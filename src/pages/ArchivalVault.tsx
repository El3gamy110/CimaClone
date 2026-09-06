import { useQuery } from '@tanstack/react-query';
import { api, getImageUrl } from '../lib/api';
import { Link } from 'react-router-dom';

export default function ArchivalVault() {
  const { data, isLoading } = useQuery({
    queryKey: ['top_rated'],
    queryFn: async () => {
      const res = await api.get('/movie/top_rated');
      return res.data;
    }
  });

  return (
    <div className="space-y-8 pb-24 md:pb-0">
      <header>
        <h1 className="font-syne text-4xl font-bold text-shadow-glow text-primary-soft">Archival Vault</h1>
        <p className="text-gray-400 mt-2">The canonical top 250 rated cinema.</p>
      </header>

      {isLoading ? (
        <div className="animate-pulse h-64 bg-elevated rounded-xl"></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data?.results?.map((movie: any) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="group block">
              <div className="rounded-xl overflow-hidden glass-panel border border-white/5 group-hover:border-primary-soft/60 group-hover:-translate-y-1 transition-all duration-300">
                <img 
                  src={getImageUrl(movie.poster_path)} 
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="p-4 bg-midnight">
                  <h3 className="font-sans font-semibold text-sm truncate text-gray-200 group-hover:text-primary-soft transition-colors">{movie.title}</h3>
                  <div className="flex items-center gap-1 text-accent-amber mt-2">
                    <span className="text-xs font-bold">{movie.vote_average?.toFixed(1)}</span>
                    <span className="text-[10px] text-gray-500">/10</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
