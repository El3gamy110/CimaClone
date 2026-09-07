import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, getImageUrl } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Play, Plus, Info, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RatingBadge } from '../components/ui/RatingBadge';

export default function TvDiscovery() {
  const { toggleWatchlist, isInWatchlist } = useStore();
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };



  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending_tv'],
    queryFn: async () => {
      const res = await api.get('/trending/tv/day');
      return res.data;
    }
  });

  const { data: popular, isLoading: popularLoading } = useQuery({
    queryKey: ['popular_tv'],
    queryFn: async () => {
      const res = await api.get('/tv/popular');
      return res.data;
    }
  });

  const heroTv = trending?.results?.[0];
  const isSaved = heroTv ? isInWatchlist(heroTv.id) : false;

  return (
    <div className="space-y-24 pb-24 md:pb-0">
      
      {/* 1. Hero Section */}
      <section className="relative rounded-2xl overflow-hidden glass-panel h-[70vh] min-h-[500px] bg-obsidian">
        {heroTv ? (
          <>
            <img 
              src={getImageUrl(heroTv.backdrop_path, 'w1280')} 
              alt={heroTv.name}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
            
            <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center">
              <div className="max-w-2xl space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="highlight">PREMIERE SERIES</Badge>
                  <Badge variant="secondary">HDR10</Badge>
                  <Badge variant="secondary">DOLBY ATMOS</Badge>
                  <span className="text-xs text-gray-400 font-medium ml-2">Drama / Sci-Fi</span>
                </div>
                
                <h1 className="font-syne text-5xl md:text-7xl font-bold text-shadow-glow text-white leading-tight">
                  {heroTv.name}
                </h1>
                
                <div className="flex items-center gap-6">
                  <RatingBadge score={heroTv.vote_average} className="scale-110 origin-left" />
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white">TV-MA</div>
                    Certified Fresh
                  </div>
                </div>

                <p className="font-sans text-gray-300 text-lg leading-relaxed max-w-xl line-clamp-3">
                  {heroTv.overview}
                </p>

                <div className="flex items-center gap-4 pt-4">
                  <Button size="lg" className="gap-2" onClick={() => navigate(`/tv/${heroTv.id}`)}>
                    <Play className="w-5 h-5 fill-current" />
                    Watch Latest Episode
                  </Button>
                  <Button variant="secondary" size="lg" className="gap-2" onClick={() => toggleWatchlist({...heroTv, media_type: 'tv'})}>
                    {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {isSaved ? 'Added' : 'Add to Watchlist'}
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full border border-white/10" onClick={() => navigate(`/tv/${heroTv.id}`)}>
                    <Info className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="animate-pulse w-full h-full bg-white/5" />
        )}
      </section>

      {/* 2. Trending TV Releases */}
      <section className="space-y-6 gsap-animate">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-primary-soft font-mono text-xs tracking-widest uppercase whitespace-nowrap">01 // Pulse</span>
            <h2 className="font-syne text-2xl md:text-3xl font-bold text-white leading-tight">Trending TV Series</h2>
          </div>
          <div className="flex gap-2 shrink-0 pb-1">
            <button aria-label="Scroll left" onClick={() => scrollCarousel('left')} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-soft transition-all"><ChevronLeft className="w-4 h-4" /></button>
            <button aria-label="Scroll right" onClick={() => scrollCarousel('right')} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-soft transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        
        <div ref={carouselRef} className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {trendingLoading ? Array(6).fill(0).map((_,i) => <div key={i} className="shrink-0 w-32 md:w-40 animate-pulse aspect-[2/3] bg-white/5 rounded-xl" />) : 
            trending?.results?.slice(1, 10).map((tv: any) => (
            <Link to={`/tv/${tv.id}`} key={tv.id} className="group block relative shrink-0 w-32 md:w-40 snap-start">
              <div className="rounded-xl overflow-hidden glass-panel group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)] transition-all duration-300">
                <img 
                  src={getImageUrl(tv.poster_path)} 
                  alt={tv.name}
                  loading="lazy"
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent p-4 flex flex-col justify-end">
                  <h3 className="font-sans font-semibold text-sm text-white truncate">{tv.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <RatingBadge score={tv.vote_average} showText={false} />
                    <Badge variant="outline">4K</Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Global Network Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 pt-8">
        {/* Left: Most Watched */}
        <section className="lg:col-span-2 space-y-6 gsap-animate">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-primary-soft font-mono text-xs tracking-widest uppercase">02 // GLOBAL METRICS</span>
              <h2 className="font-syne text-3xl font-bold text-white mt-1">Most Watched Series</h2>
            </div>
            <span className="text-xs text-gray-500 font-mono hidden sm:block">Realtime Global Views</span>
          </div>

          <div className="space-y-4">
            {popularLoading ? Array(4).fill(0).map((_,i) => <div key={i} className="animate-pulse h-24 bg-white/5 rounded-xl" />) :
              popular?.results?.slice(0, 4).map((tv: any, idx: number) => (
              <div key={tv.id} className="flex items-center gap-4 group p-2 hover:bg-white/5 rounded-xl transition-colors">
                <span className="font-syne text-2xl md:text-3xl font-bold text-white/20 w-8 md:w-12 text-center group-hover:text-primary-soft transition-colors">
                  0{idx + 1}
                </span>
                <img src={getImageUrl(tv.poster_path)} loading="lazy" className="w-12 h-16 md:w-16 md:h-24 object-cover rounded-md shadow-md" alt={tv.name} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-syne font-bold text-base md:text-lg text-white truncate">{tv.name}</h3>
                  <p className="text-xs text-gray-500 truncate mt-1">Network {tv.id % 2 === 0 ? 'HBO' : 'Apple TV+'}</p>
                  <div className="mt-3 w-full bg-white/5 rounded-full h-1.5 overflow-hidden flex relative">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-deep to-primary-hyper rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${Math.max(40, 100 - idx * 15)}%` }}></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-sans font-bold text-sm md:text-base text-white">{(14.2 - idx * 2.1).toFixed(1)}M</div>
                  <div className="text-[10px] text-green-400 mt-1">+{(12.4 - idx * 3).toFixed(1)}% vs Prev Week</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Critic Consensus */}
        <section className="space-y-6 gsap-animate">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-primary-soft font-mono text-xs tracking-widest uppercase">03 // EDITORIAL VERDICT</span>
              <h2 className="font-syne text-3xl font-bold text-white mt-1">Critic Consensus</h2>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-primary/20 relative">
            <div className="absolute -top-3 -right-3 bg-primary w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <span className="text-white text-xs font-bold">94%</span>
            </div>
            
            <div className="flex items-center gap-1 mb-4 text-accent-amber">
              {'★★★★★'.split('').map((star, i) => <span key={i} className="text-sm">{star}</span>)}
              <Badge variant="highlight" className="ml-auto">MUST WATCH</Badge>
            </div>
            
            <blockquote className="font-sans text-gray-200 text-sm md:text-base italic leading-relaxed">
              "A masterful return to form that redefines episodic pacing. The character development is unmatched in modern television."
            </blockquote>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=50&h=50&q=80" className="w-8 h-8 rounded-full border border-white/20" alt="Critic" />
                <div>
                  <div className="text-xs font-bold text-white">Cassian Reynolds</div>
                  <div className="text-[10px] text-gray-500">Chief TV Critic, Culture Observ.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
