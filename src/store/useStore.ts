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
  authModalOpen: boolean;
  setSession: (session: Session | null) => void;
  setAuthModalOpen: (open: boolean) => void;
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
      authModalOpen: false,
      setAuthModalOpen: (open) => set({ authModalOpen: open }),
      setSession: (session) => {
        set({ session, user: session?.user ?? null });
        if (!session) {
          // Clear account watchlist when logging out
          set({ watchlist: [] });
        }
      },
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
          
          set({ watchlist: dbWatchlist });
        }
      },
      toggleWatchlist: async (item) => {
        const { user, watchlist } = get();
        
        if (!user) {
          set({ authModalOpen: true });
          return;
        }

        const exists = watchlist.find((i) => i.id === item.id);

        if (exists) {
          const newList = watchlist.filter((i) => i.id !== item.id);
          set({ watchlist: newList });
          await supabase.from('watchlists').delete().match({ user_id: user.id, media_id: item.id });
        } else {
          const newList = [...watchlist, item];
          set({ watchlist: newList });
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
      },
      isInWatchlist: (id) => {
        return get().watchlist.some((i) => i.id === id);
      },
    }),
    {
      name: 'cimaclone-storage',
      partialize: () => ({}), // We no longer persist the watchlist locally since it's strictly cloud-based
    }
  )
);
