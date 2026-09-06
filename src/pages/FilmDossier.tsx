import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, getImageUrl } from '../lib/api';
import { useStore } from '../store/useStore';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export default function FilmDossier() {
  const { id } = useParams();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useStore();
  
  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const res = await api.get(`/movie/${id}`);
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="animate-pulse h-screen bg-elevated/50 rounded-xl"></div>;
  }

  if (!movie) return <div>Movie not found.</div>;

  const inWatchlist = isInWatchlist(movie.id);

  return (
    <div className="space-y-8 pb-24 md:pb-0">
      <div className="relative rounded-xl overflow-hidden glass-panel h-[40vh] md:h-[60vh]">
        <img 
          src={getImageUrl(movie.backdrop_path, 'original')} 
          alt={movie.title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row gap-6 md:items-end">
          <img 
            src={getImageUrl(movie.poster_path)} 
            alt={movie.title}
            className="w-32 md:w-48 rounded-lg shadow-2xl border border-primary/20 hidden md:block"
          />
          <div className="flex-1 space-y-4">
            <h1 className="font-syne text-4xl md:text-6xl font-bold text-shadow-glow text-white">{movie.title}</h1>
            <p className="font-sans text-gray-300 text-sm md:text-base max-w-3xl leading-relaxed">
              {movie.overview}
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                className="flex items-center gap-2 bg-gradient-to-br from-primary-hyper to-primary-deep text-white px-6 py-3 rounded-pill font-medium shadow-[0_4px_16px_rgba(147,51,234,0.35)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.5)] transition-all"
              >
                {inWatchlist ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
