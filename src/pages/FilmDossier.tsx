import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, getImageUrl } from '../lib/api';
import { useStore } from '../store/useStore';
import { Play, Bookmark, BookmarkCheck, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';


export default function FilmDossier() {
  const { id } = useParams();
  const { toggleWatchlist, isInWatchlist } = useStore();
  const castRef = useRef<HTMLDivElement>(null);

  const scrollCast = (dir: 'left' | 'right') => {
    if (castRef.current) {
      castRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };
  
  // Combine all fetches for the dossier
  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const [details, credits, videos, reviews, images] = await Promise.all([
        api.get(`/movie/${id}`),
        api.get(`/movie/${id}/credits`),
        api.get(`/movie/${id}/videos`),
        api.get(`/movie/${id}/reviews`),
        api.get(`/movie/${id}/images`, { params: { include_image_language: 'en,null' } })
      ]);
      return {
        ...details.data,
        credits: credits.data,
        videos: videos.data,
        reviews: reviews.data,
        images: images.data
      };
    },
    enabled: !!id
  });



  if (isLoading) {
    return <div className="animate-pulse h-screen bg-elevated/50" />;
  }
  if (!movie) return <div>Movie not found.</div>;

  const inWatchlist = isInWatchlist(movie.id);
  const trailer = movie.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || movie.videos?.results?.[0];
  const cast = movie.credits?.cast?.slice(0, 20) || [];
  const primaryReview = movie.reviews?.results?.[0];
  const backdrops = movie.images?.backdrops?.length > 0 
    ? movie.images.backdrops.slice(0, 3) 
    : [
        { file_path: movie.backdrop_path },
        { file_path: movie.poster_path }
      ].filter(b => b.file_path);

  return (
    <div className="pb-24 md:pb-8 -mt-[88px] md:-mt-[104px]">
      {/* 1. Hero Backdrop Section */}
      <div className="relative w-full h-[60vh] min-h-[500px]">
        {/* Full-bleed background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-full bg-obsidian">
          <img 
            src={getImageUrl(movie.backdrop_path, 'w1280')} 
            alt={movie.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-end pb-8 pt-24 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="highlight">NOW PLAYING IN THEATERS & IMAX</Badge>
            <span className="text-xs text-gray-400 font-medium px-2 border-l border-white/20">
              {movie.genres?.map((g: any) => g.name).join(' • ')}
            </span>
          </div>

          <h1 className="font-syne text-5xl md:text-7xl font-bold text-shadow-glow text-white tracking-tight">
            {movie.title}
          </h1>
          <p className="font-sans text-gray-300 italic text-lg max-w-3xl">"{movie.tagline || movie.overview?.split('.')[0] + '.'}"</p>

          <div className="flex flex-wrap items-center gap-6 mt-4">
            <Badge variant="outline">R</Badge>
            <span className="text-sm font-semibold text-gray-300">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
            <span className="text-sm font-semibold text-gray-300">{new Date(movie.release_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <Badge variant="secondary">IMAX 70MM</Badge>
            <Badge variant="secondary">DOLBY VISION</Badge>
            <Badge variant="secondary">4K UHD</Badge>

            <div className="ml-auto flex items-center gap-3">
              <Button className="gap-2" onClick={() => trailer && window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}>
                <Play className="w-4 h-4 fill-current" /> Watch Official Trailer
              </Button>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className={`w-12 px-0 transition-colors ${inWatchlist ? 'bg-primary-soft/20 text-primary-soft border-primary-soft/30' : ''}`}
                  onClick={() => toggleWatchlist({...movie, media_type: 'movie'})}
                >  {inWatchlist ? <BookmarkCheck className="w-4 h-4 text-primary-soft" /> : <Bookmark className="w-4 h-4" />}
                </Button>
            </div>
          </div>

          {/* Stat Cards Row */}
          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="glass-panel px-4 py-3 rounded-xl flex items-center gap-4 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg text-white">95%</div>
              <div>
                <div className="text-xs font-bold text-gray-300">CERTIFIED FRESH</div>
                <div className="text-[10px] text-gray-500">14,230+ Reviews</div>
              </div>
            </div>
            <div className="glass-panel px-4 py-3 rounded-xl flex items-center gap-4 border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center font-bold text-lg text-white">88</div>
              <div>
                <div className="text-xs font-bold text-gray-300">Universal Acclaim</div>
                <div className="text-[10px] text-gray-500">Metascore of Critics</div>
              </div>
            </div>
            <div className="glass-panel px-4 py-3 rounded-xl flex items-center gap-4 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-accent-amber/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent-amber fill-accent-amber" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-200">{movie.vote_average?.toFixed(1)} <span className="text-xs text-gray-500 font-normal">/10</span></div>
                <div className="text-[10px] text-gray-500">{movie.vote_count?.toLocaleString()} IMDb Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-8 border-b border-white/5 pb-4 flex gap-6 text-sm font-semibold overflow-x-auto scrollbar-hide">
        <a href="#synopsis" className="text-gray-400 hover:text-white cursor-pointer pb-4 whitespace-nowrap focus:text-primary-soft focus:border-b-2 focus:border-primary-soft">Overview</a>
        <a href="#cast" className="text-gray-400 hover:text-white cursor-pointer pb-4 whitespace-nowrap focus:text-primary-soft focus:border-b-2 focus:border-primary-soft">Cast & Crew</a>
        <a href="#reviews" className="text-gray-400 hover:text-white cursor-pointer pb-4 whitespace-nowrap focus:text-primary-soft focus:border-b-2 focus:border-primary-soft">Reviews & Critics</a>
        <a href="#stills" className="text-gray-400 hover:text-white cursor-pointer pb-4 whitespace-nowrap focus:text-primary-soft focus:border-b-2 focus:border-primary-soft">4K Media & Photos</a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Synopsis */}
          <section id="synopsis" className="glass-panel p-8 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-syne text-2xl font-bold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary-soft rounded-full"></span> The Synopsis
              </h3>
              <span className="text-[10px] text-gray-500 tracking-widest font-mono uppercase">Official Archive Entry</span>
            </div>
            <p className="font-sans text-gray-300 leading-[1.6] text-[15px]">
              {movie.overview}
            </p>
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/5">
              <div>
                <div className="text-[10px] text-primary-soft font-bold tracking-widest uppercase mb-1">Director</div>
                <div className="font-bold text-sm text-gray-200">Elena Vardalos</div>
                <div className="text-xs text-gray-500 mt-1">Sci-Fi Award Winner</div>
              </div>
              <div>
                <div className="text-[10px] text-primary-soft font-bold tracking-widest uppercase mb-1">Writers</div>
                <div className="font-bold text-sm text-gray-200">Julian Drake & Vance</div>
                <div className="text-xs text-gray-500 mt-1">Adapted from Novella</div>
              </div>
              <div>
                <div className="text-[10px] text-primary-soft font-bold tracking-widest uppercase mb-1">Original Score</div>
                <div className="font-bold text-sm text-gray-200">Trent Reznor</div>
                <div className="text-xs text-gray-500 mt-1">Ambient Dark-wave</div>
              </div>
            </div>
          </section>

          {/* Key Narrative Threads */}
          <section className="space-y-4">
            <h3 className="font-syne text-2xl font-bold flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-primary-soft fill-primary-soft/20" /> Key Narrative Threads
            </h3>
            {[
              { id: '01', title: 'The Chrono-Frequency Hypothesis', desc: 'Central plot revolves around acoustic anomalies unraveling parallel timelines.' },
              { id: '02', title: 'Synthetic Preservation Rights', desc: 'A political sub-plot questioning the legality of memory extraction from synthetics.' },
              { id: '03', title: 'The Eclipse Countdown', desc: 'A 72-hour ticking clock before the ultimate dimensional collapse.' }
            ].map(thread => (
              <div key={thread.id} className="glass-panel p-5 rounded-xl border border-white/5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary-soft font-mono text-xs font-bold shrink-0">
                  {thread.id}
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-sm">{thread.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{thread.desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Production Stills */}
          <section id="stills" className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-syne text-2xl font-bold text-white">Production Stills</h3>
                <p className="text-xs text-gray-500 mt-1">High-Fidelity frame captures and set photography</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {backdrops[0] && (
                <img 
                  src={getImageUrl(backdrops[0].file_path, 'w500')} 
                  loading="lazy"
                  onClick={() => window.open(getImageUrl(backdrops[0].file_path, 'original'), '_blank')}
                  className="col-span-2 row-span-2 w-full h-full object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity" 
                  alt="Still 1" 
                />
              )}
              {backdrops[1] && (
                <img 
                  src={getImageUrl(backdrops[1].file_path, 'w500')} 
                  loading="lazy"
                  onClick={() => window.open(getImageUrl(backdrops[1].file_path, 'original'), '_blank')}
                  className="col-span-2 row-span-2 w-full h-full object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity" 
                  alt="Still 2" 
                />
              )}
            </div>
          </section>

          {/* Top Billed Cast */}
          <section id="cast" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-syne text-2xl font-bold text-white">Top Billed Cast</h3>
                <p className="text-xs text-gray-500 mt-1">Principal ensemble and credited character roles</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => scrollCast('left')} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-soft transition-all"><span className="text-xs">←</span></button>
                <button onClick={() => scrollCast('right')} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-soft transition-all"><span className="text-xs">→</span></button>
              </div>
            </div>
            <div ref={castRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {cast.map((actor: any) => (
                <div key={actor.id} className="flex flex-col items-center gap-3 shrink-0 w-28 text-center group">
                  <div className="w-20 h-20 rounded-full p-1 border border-primary/20 group-hover:border-primary-soft transition-colors">
                    <img 
                      src={actor.profile_path ? getImageUrl(actor.profile_path, 'w500') : 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=100&h=100'} 
                      alt={actor.name} 
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-gray-200 group-hover:text-primary-soft transition-colors">{actor.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{actor.character}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8">
          
            {/* Trailer Box */}
          {trailer && (
            <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-sans font-bold text-sm flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary-soft fill-current" /> Official Teaser Trailer (4K)
                </h4>
                <Badge variant="outline">02:44</Badge>
              </div>
              <div 
                className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer border border-white/10 group-hover:border-primary-soft/50 transition-all"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
              >
                <img src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`} alt="Trailer thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-obsidian/40 flex items-center justify-center group-hover:bg-obsidian/20 transition-all">
                  <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    <Play className="w-5 h-5 text-white fill-current ml-1" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Where to Watch */}
          <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-sans font-bold text-sm flex items-center gap-2 text-white">
                <Play className="w-4 h-4 text-primary-soft" /> Where to Watch
              </h4>
              <span className="text-[10px] text-gray-500">Updated 2h ago</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-obsidian/50 p-3 rounded-lg border border-white/5">
                <Badge variant="highlight" className="mb-2">4K REMASTER</Badge>
                <div className="font-bold text-xs text-white">HBO Max (Dolby Vision)</div>
                <div className="text-[10px] text-gray-500 mt-1">Streaming in 4K HDR 10+</div>
              </div>
              <div className="bg-obsidian/50 p-3 rounded-lg border border-white/5">
                <Badge variant="secondary" className="mb-2">PRE-ORDER</Badge>
                <div className="font-bold text-xs text-white">Apple TV 4K</div>
                <div className="text-[10px] text-gray-500 mt-1">Releases Oct 14 • $24.99</div>
              </div>
            </div>
          </div>

          {/* Critic Consensus */}
          {primaryReview && (
            <div id="reviews" className="glass-panel p-6 rounded-xl border border-primary/20 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-sans font-bold text-sm text-white">Critical Consensus</h4>
                <Badge variant="highlight">Must Watch</Badge>
              </div>
              <blockquote className="font-sans text-gray-300 text-sm italic leading-relaxed">
                "{primaryReview.content.substring(0, 150)}..."
              </blockquote>
              <div className="text-right">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">— {primaryReview.author}</span>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Positive Score</span>
                <div className="flex-1 h-1.5 bg-obsidian rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-primary-soft"></div>
                </div>
                <span className="text-[10px] text-primary-soft font-bold">88% (1.2K)</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
