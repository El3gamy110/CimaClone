import { useQuery } from '@tanstack/react-query';
import { api, getImageUrl } from '../lib/api';
import { Link } from 'react-router-dom';

export default function Discovery() {
  const { data, isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: async () => {
      const res = await api.get('/trending/movie/day');
      return res.data;
    }
  });

  return (
    <div className="space-y-12 pb-24 md:pb-0">
      <section>
        <h1 className="font-syne text-4xl font-bold mb-6 text-shadow-glow text-primary-soft">Trending Today</h1>
        {isLoading ? (
          <div className="animate-pulse h-64 bg-elevated rounded-xl"></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data?.results?.map((movie: any) => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="relative group block">
                <div className="rounded-xl overflow-hidden glass-panel border border-white/5 group-hover:border-primary-soft/60 group-hover:-translate-y-1 transition-all duration-300">
                  <img 
                    src={getImageUrl(movie.poster_path)} 
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/20 to-transparent opacity-100 p-3 flex flex-col justify-end">
                    <h3 className="font-sans font-semibold text-sm truncate">{movie.title}</h3>
                    <div className="flex items-center gap-1 text-accent-amber mt-1">
                      <span className="text-xs font-bold">{movie.vote_average?.toFixed(1)}</span>
                      <span className="text-[10px] text-gray-400">/10</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
