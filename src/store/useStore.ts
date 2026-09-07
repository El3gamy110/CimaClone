import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface WatchlistItem {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

interface AppState {
  watchlist: WatchlistItem[];
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
  fetchWatchlist: () => Promise<void>;
  toggleWatchlist: (item: WatchlistItem) => Promise<void>;
  isInWatchlist: (id: number) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      session: null,
      user: null,
      setSession: (session) => set({ session, user: session?.user ?? null }),
      fetchWatchlist: async () => {
        const { user } = get();
        if (!user) return;
        
        const { data, error } = await supabase.from('watchlists').select('*');
        if (error) {
          console.error('Error fetching watchlist from Supabase', error);
          return;
        }
        
        if (data) {
          const dbWatchlist: WatchlistItem[] = data.map((row: any) => ({
            id: row.media_id,
            media_type: row.media_type,
            title: row.title,
            name: row.name,
            poster_path: row.poster_path,
            backdrop_path: row.backdrop_path,
            release_date: row.release_date,
            first_air_date: row.first_air_date,
            vote_average: row.vote_average
          }));
          
          // Merge local and DB watchlists
          const localWatchlist = get().watchlist;
          const merged = [...dbWatchlist];
          
          for (const localItem of localWatchlist) {
            if (!merged.find(m => m.id === localItem.id)) {
              merged.push(localItem);
              // Also push this local item to the DB
              await supabase.from('watchlists').insert({
                user_id: user.id,
                media_id: localItem.id,
                media_type: localItem.media_type,
                title: localItem.title || null,
                name: localItem.name || null,
                poster_path: localItem.poster_path,
                backdrop_path: localItem.backdrop_path,
                release_date: localItem.release_date || null,
                first_air_date: localItem.first_air_date || null,
                vote_average: localItem.vote_average
              }).then(({ error }) => {
                if (error) console.error(error);
              });
            }
          }
          
          set({ watchlist: merged });
        }
      },
      toggleWatchlist: async (item) => {
        const current = get().watchlist;
        const exists = current.find((i) => i.id === item.id);
        const { user } = get();

        if (exists) {
          set({ watchlist: current.filter((i) => i.id !== item.id) });
          if (user) {
            await supabase.from('watchlists').delete().match({ user_id: user.id, media_id: item.id });
          }
        } else {
          set({ watchlist: [...current, item] });
          if (user) {
            await supabase.from('watchlists').insert({
              user_id: user.id,
              media_id: item.id,
              media_type: item.media_type,
              title: item.title || null,
              name: item.name || null,
              poster_path: item.poster_path,
              backdrop_path: item.backdrop_path,
              release_date: item.release_date || null,
              first_air_date: item.first_air_date || null,
              vote_average: item.vote_average
            });
          }
        }
      },
      isInWatchlist: (id) => {
        return get().watchlist.some((i) => i.id === id);
      },
    }),
    {
      name: 'cimaclone-storage',
      partialize: (state) => ({ watchlist: state.watchlist }), // only persist watchlist locally
    }
  )
);
