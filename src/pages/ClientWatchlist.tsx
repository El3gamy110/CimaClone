import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../lib/api';
import { Trash2 } from 'lucide-react';

export default function ClientWatchlist() {
  const { watchlist, removeFromWatchlist } = useStore();

  return (
    <div className="space-y-8 pb-24 md:pb-0">
      <header>
        <h1 className="font-syne text-4xl font-bold text-shadow-glow text-primary-soft">Client Watchlist</h1>
        <p className="text-gray-400 mt-2">Your personalized film log and saved movies.</p>
      </header>

      {watchlist.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl">
          <p className="text-gray-400">Your watchlist is empty. Go discover some cinema!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {watchlist.map((movie) => (
            <div key={movie.id} className="flex gap-4 p-4 glass-panel rounded-xl items-center hover:bg-[#201c32]/80 transition-all border border-transparent hover:border-primary/20">
              <Link to={`/movie/${movie.id}`}>
                <img 
                  src={getImageUrl(movie.poster_path, 'w500')} 
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-md"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/movie/${movie.id}`}>
                  <h3 className="font-syne font-bold text-lg text-gray-200 hover:text-primary-soft transition-colors">{movie.title}</h3>
                </Link>
                <div className="flex items-center gap-1 text-accent-amber mt-1">
                  <span className="text-sm font-bold">{movie.vote_average?.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">/10</span>
                </div>
              </div>
              <button 
                onClick={() => removeFromWatchlist(movie.id)}
                className="p-3 text-gray-500 hover:text-red-400 bg-obsidian/50 rounded-full hover:bg-obsidian transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
