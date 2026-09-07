import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, getImageUrl } from '../lib/api';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { RatingBadge } from '../components/ui/RatingBadge';
import { Play, CheckCircle2, Star } from 'lucide-react';

export default function ArchivalVault() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['top_rated', page],
    queryFn: async () => {
      const res = await api.get('/movie/top_rated', { params: { page } });
      return res.data;
    }
  });

  return (
    <div className="space-y-12 pb-24 md:pb-8">
      {/* Header & Filters */}
      <header className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-4">ARCHIVAL CANON INDEX - ISSUE 49</Badge>
            <h1 className="font-syne text-4xl md:text-5xl font-bold text-shadow-glow text-white tracking-tight">
              The Criterion Vault: <span className="text-primary-soft">Top 250 Cinema<br/>of All Time</span>
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl text-sm leading-relaxed">
              Ranked by verified cinephile scores, historical preservation mandates, and rigorous critical consensus across 12,400+ international guild ballots.
            </p>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-4">
            <div className="text-xs font-mono text-gray-500">250 Works Indexed</div>
          </div>
        </div>

      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
        {/* Left: Ranked List */}
        <div className="xl:col-span-2 space-y-6">
          {isLoading ? Array(5).fill(0).map((_,i) => <div key={i} className="animate-pulse h-48 bg-white/5 rounded-xl" />) :
            data?.results?.slice(0, 10).map((movie: any, idx: number) => (
            <div key={movie.id} className="flex gap-6 group items-start gsap-animate">
              <div className="flex flex-col items-center pt-2">
                <div className="font-syne text-3xl font-bold text-primary-soft">#{idx + 1}</div>
                <div className="text-[10px] font-mono text-gray-500 mt-1 uppercase">TIER A</div>
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 glass-panel rounded-xl border border-white/5 group-hover:border-primary-soft/40 group-hover:shadow-[0_4px_20px_rgba(168,85,247,0.15)] transition-all">
                <div className="relative shrink-0">
                  <img src={getImageUrl(movie.poster_path)} className="w-24 md:w-32 rounded-lg shadow-lg" alt={movie.title} />
                  <Badge variant="outline" className="absolute top-2 right-2 bg-obsidian/80 backdrop-blur-sm border-white/10">4K UHD</Badge>
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
                        <span className="text-xs text-gray-400 font-medium">Dir. Christopher Nolan</span>
                        <span className="text-xs text-gray-600 hidden sm:inline">•</span>
                        <span className="text-xs text-gray-400 font-medium hidden sm:inline">152 min</span>
                      </div>
                    </div>
                    {idx === 0 && <Badge variant="highlight" className="hidden sm:inline-flex">2 ACADEMY AWARDS</Badge>}
                  </div>
                  
                  <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                    {movie.overview}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 mt-auto">
                    <Button variant="secondary" size="sm" className="gap-2 text-[10px]">
                      View Dossier <Play className="w-3 h-3" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">Metascore</span>
                      <div className="w-6 h-6 rounded bg-gray-200 text-obsidian font-bold text-[10px] flex items-center justify-center">84</div>
                    </div>
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

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Curator Spotlight */}
          <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h4 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-primary-soft" /> CURATOR'S SPOTLIGHT
              </h4>
              <span className="text-[10px] text-gray-500 font-mono">Week 42</span>
            </div>
            <div className="p-4">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4 border border-white/10">
                <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80" alt="Spotlight" className="w-full h-full object-cover" />
                <Badge variant="highlight" className="absolute top-2 left-2">DEEP DIVE</Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-sm font-bold text-white leading-tight">The Anatomy of Tension</div>
                  <div className="text-[10px] text-gray-300 mt-0.5">How Villeneuve manipulates silence in 2049</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Senior Archival Fellow Dr. Elena Rostova analyzes how subtle atmospheric frequencies and expansive architecture evoke psychological weight in modern neo-noir masterpieces.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-deep flex items-center justify-center text-[10px] text-white font-bold">ER</div>
                  <span className="text-[10px] text-gray-300 font-bold">Elena Rostova, Ph.D.</span>
                </div>
                <Link to="#" className="text-[10px] text-primary-soft font-bold hover:text-white transition-colors">Read Essay →</Link>
              </div>
            </div>
          </div>

          {/* Community Ballot */}
          <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-sans font-bold text-sm text-white">COMMUNITY BALLOT</h4>
              <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">Live</Badge>
            </div>
            <div>
              <div className="font-syne font-bold text-lg text-white leading-tight">Greatest Plot Twist in Film History?</div>
              <div className="text-[10px] text-gray-400 mt-1">1,843 cinephiles voted today. Select a contender to view verified distribution metrics.</div>
            </div>
            
            <div className="space-y-2 mt-4">
              {[
                { title: 'The Usual Suspects (1995)', pct: 44, active: true },
                { title: 'Psycho (1960)', pct: 26, active: false },
                { title: 'Mulholland Drive (2001)', pct: 16, active: false },
                { title: 'Fight Club (1999)', pct: 14, active: false }
              ].map((item) => (
                <div key={item.title} className={`relative p-3 rounded-lg border ${item.active ? 'border-primary-soft/50 bg-primary/10' : 'border-white/5 bg-white/5'} flex justify-between items-center overflow-hidden cursor-pointer hover:border-primary-soft/50 transition-colors`}>
                  {item.active && <div className="absolute inset-y-0 left-0 bg-primary-soft/20" style={{ width: `${item.pct}%` }}></div>}
                  <span className="relative z-10 text-xs font-bold text-gray-200">{item.title}</span>
                  <span className="relative z-10 text-xs font-bold text-white">{item.pct}%</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-gray-500">Closes in 14 hours</span>
              <Link to="#" className="text-[10px] text-primary-soft font-bold hover:text-white transition-colors">Discuss in Guild Forum</Link>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-primary/20 bg-primary/5 flex gap-3 items-center">
            <CheckCircle2 className="w-5 h-5 text-primary-soft shrink-0" />
            <p className="text-[10px] text-gray-300">Criterion Certified Archive. Scores weighted by verified historical citations and member tiers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
