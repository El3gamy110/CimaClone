import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface AppState {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (movie) => {
        if (!get().watchlist.find((m) => m.id === movie.id)) {
          set((state) => ({ watchlist: [...state.watchlist, movie] }));
        }
      },
      removeFromWatchlist: (movieId) => {
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== movieId),
        }));
      },
      isInWatchlist: (movieId) => {
        return get().watchlist.some((m) => m.id === movieId);
      },
    }),
    {
      name: 'cimaclone-storage',
    }
  )
);
