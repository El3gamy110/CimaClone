import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, getImageUrl } from '../lib/api';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { RatingBadge } from '../components/ui/RatingBadge';
import { Play } from 'lucide-react';

const collections = {
  cyberpunk: { title: "Cyberpunk & Noir", subtitle: "ESSENTIAL ANTHOLOGY", desc: "High tech, low life. Neon decay and rain-drenched city streets.", params: { with_genres: '878,80' } },
  thriller: { title: "Mind-Bending Thrillers", subtitle: "PSYCHOLOGICAL PROJECTS", desc: "Puzzles that question cognition, unreliable narrators, loops, and twists.", params: { with_genres: '53,9648' } },
  horror: { title: "Cosmic Horror", subtitle: "BEYOND COMPREHENSION", desc: "Ancient dread from the dark voids of the stars and unknowable entities.", params: { with_genres: '27,878' } },
  anime: { title: "Neo-Tokyo Anime", subtitle: "JAPANESE MASTERPIECES", desc: "Hand-painted cels, sci-fi classics, grimy sci-fi, and mecha aesthetics.", params: { with_genres: '16,878', with_original_language: 'ja' } }
};

export default function Collection() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const col = collections[id as keyof typeof collections] || collections.cyberpunk;

  const { data, isLoading } = useQuery({
    queryKey: ['collection', id, page],
    queryFn: async () => {
      const res = await api.get('/discover/movie', { params: { page, ...col.params, sort_by: 'popularity.desc' } });
      return res.data;
    }
  });

  return (
    <div className="space-y-12 pb-24 md:pb-8">
      {/* Header */}
      <header className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-4">{col.subtitle}</Badge>
            <h1 className="font-syne text-4xl md:text-5xl font-bold text-shadow-glow text-white tracking-tight">
              {col.title}
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl text-sm leading-relaxed">
              {col.desc}
            </p>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-4">
            <div className="text-xs font-mono text-gray-500">Curated Midnight Collection</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
        {/* Left: Movie List */}
        <div className="xl:col-span-2 space-y-6">
          {isLoading ? Array(5).fill(0).map((_,i) => <div key={i} className="animate-pulse h-48 bg-white/5 rounded-xl" />) :
            data?.results?.map((movie: any) => (
            <div key={movie.id} className="flex gap-6 group items-start">
              
              <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 glass-panel rounded-xl border border-white/5 group-hover:border-primary-soft/40 group-hover:shadow-[0_4px_20px_rgba(168,85,247,0.15)] transition-all">
                <div className="relative shrink-0">
                  <img src={getImageUrl(movie.poster_path)} className="w-24 md:w-32 rounded-lg shadow-lg" alt={movie.title} />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] font-bold bg-obsidian/80 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10 w-max">
                    <Play className="w-3 h-3 text-white" /> Direct Stream
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link to={`/movie/${movie.id}`}>
                        <h2 className="font-syne text-xl md:text-2xl font-bold text-white group-hover:text-primary-soft transition-colors">{movie.title} <span className="text-sm font-sans font-normal text-gray-500">({movie.release_date?.split('-')[0]})</span></h2>
                      </Link>
                      <div className="flex items-center gap-3 mt-2">
                        <RatingBadge score={movie.vote_average} className="bg-white/5 px-2 py-1 rounded-md border border-white/10" />
                        <span className="text-xs text-gray-400 font-medium">Dir. CINE NOIR</span>
                        <span className="text-xs text-gray-600 hidden sm:inline">•</span>
                        <span className="text-xs text-gray-400 font-medium hidden sm:inline">Feature</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                    {movie.overview}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 mt-auto">
                    <Link to={`/movie/${movie.id}`}>
                      <Button variant="secondary" size="sm" className="gap-2 text-[10px]">
                        View Dossier <Play className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <span className="text-xs text-gray-500">Page {page} of {data?.total_pages || 1}</span>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-[10px]">Previous</Button>
              <Button variant="default" size="sm" className="w-8 h-8 p-0 text-[10px] rounded-full">{page}</Button>
              <Button variant="secondary" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= (data?.total_pages || 1)} className="text-[10px]">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
