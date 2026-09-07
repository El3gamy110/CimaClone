import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../lib/api';
import { Play, Check, Star, Zap, Bookmark } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RatingBadge } from '../components/ui/RatingBadge';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const watchHabitsData = [
  { name: 'May', count: 18 },
  { name: 'Jun', count: 24 },
  { name: 'Jul', count: 29 },
  { name: 'Aug', count: 36 },
  { name: 'Sep', count: 22 },
  { name: 'Oct', count: 41 },
];

export default function ClientWatchlist() {
  const { watchlist, toggleWatchlist, user } = useStore();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <Bookmark className="w-10 h-10 text-primary-soft" />
        </div>
        <h1 className="font-syne text-4xl md:text-5xl font-bold text-white mb-4">Your Watchlist Awaits</h1>
        <p className="text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed">
          Create an account or sign in to build your personalized cinematic library, save titles for later, and get curated recommendations based on your unique taste.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
          <Link to="/login" className="flex-1 py-3 bg-primary hover:bg-primary-soft text-white rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            Sign In
          </Link>
          <Link to="/signup" className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-bold transition-all">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      {/* Profile Header */}
      <header className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full p-1 border-2 border-primary-soft overflow-hidden bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-3xl text-white">{user ? user.email?.charAt(0).toUpperCase() : 'G'}</span>
            </div>
            {user && <Badge variant="highlight" className="absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-md">PRO</Badge>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="font-syne text-3xl font-bold text-white">{user ? user.email?.split('@')[0] : 'Guest User'}</h1>
              {user && <Badge variant="secondary" className="hidden sm:inline-flex">VERIFIED</Badge>}
            </div>
            <p className="text-sm text-gray-300 max-w-md leading-relaxed hidden md:block">
              {user ? 'Welcome back to your personalized cinematic database.' : 'Your watchlist is currently saved locally. Sign in to sync across devices.'}
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-gray-500 pt-2">
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${user ? 'bg-green-500' : 'bg-primary-soft'}`}></span> 
                {user ? 'Cloud Sync Active' : 'Local Storage Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-12">
          <div>
            <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">IN WATCHLIST</div>
            <div className="font-syne text-3xl font-bold text-white">{watchlist.length}</div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/5 pb-1">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <Button variant="default" size="sm" className="rounded-full h-9">Want to Watch <span className="ml-2 bg-obsidian/50 px-1.5 py-0.5 rounded-md text-[10px]">{watchlist.length}</span></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12 pt-4">
        {/* Left: Movie Grid */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="flex flex-wrap gap-3 items-center text-xs">
            <div className="ml-auto flex items-center gap-2">
              <span className="text-gray-500 font-bold uppercase tracking-widest">Sort:</span>
              <select className="bg-transparent text-white focus:outline-none border-none font-semibold cursor-pointer">
                <option>Recently Added</option>
                <option>Rating (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {watchlist.length === 0 ? (
              <div className="col-span-2 glass-panel p-12 text-center rounded-xl text-gray-400">
                Your watchlist is empty. Go discover some cinema!
              </div>
            ) : watchlist.map((item: any, idx: number) => (
              <div key={`${item.media_type}-${item.id}`} className="glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col group hover:border-primary/30 transition-all">
                <div className="relative aspect-[16/9]">
                  <img src={getImageUrl(item.backdrop_path || item.poster_path, 'w500')} alt={item.title || item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    {idx % 2 === 0 && <Badge variant="highlight" className="bg-primary/90 text-white backdrop-blur-md border-transparent"><Zap className="w-3 h-3 mr-1 fill-current" /> HIGH PRIORITY</Badge>}
                    <Badge variant="outline" className="bg-obsidian/80 backdrop-blur-sm">{item.media_type === 'tv' ? 'SERIES' : '4K'}</Badge>
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <RatingBadge score={item.vote_average} className="bg-obsidian/80 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10" />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <Link to={`/${item.media_type === 'tv' ? 'tv' : 'movie'}/${item.id}`}>
                      <h3 className="font-syne text-xl font-bold text-white group-hover:text-primary-soft transition-colors truncate">{item.title || item.name}</h3>
                    </Link>
                    <div className="text-xs text-gray-400 mt-1">{(item.release_date || item.first_air_date)?.split('-')[0]}</div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mt-auto pt-4">
                    <Button className="flex-1 gap-2 bg-primary/20 text-primary-soft border border-primary/30 hover:bg-primary/30 hover:border-primary-soft shadow-none">
                      <Play className="w-4 h-4 fill-current" /> Launch Stream
                    </Button>
                    <Button variant="secondary" size="icon" className="shrink-0" onClick={() => toggleWatchlist(item)}>
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>

        {/* Right: Analytics Sidebar */}
        <div className="space-y-8">
          
          {/* Tonight's Pick */}
          <div className="glass-panel p-5 rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-soft/20 blur-3xl rounded-full"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="text-[10px] font-bold text-primary-soft tracking-widest uppercase flex items-center gap-2">
                <Star className="w-3 h-3 fill-current" /> TONIGHT'S CURATED PICK
              </div>
              <Badge variant="highlight">98% Match</Badge>
            </div>
            <p className="text-xs text-gray-300 mb-4 relative z-10">Based on your late-night mood filter: <span className="font-bold text-white">"Atmospheric & Slow Pace"</span></p>
            
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-4 border border-white/10 group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80" alt="Pick" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-obsidian/40 group-hover:bg-obsidian/20 transition-all"></div>
              <div className="absolute bottom-3 left-3">
                <div className="font-syne font-bold text-white text-lg">Nightfall Frequency</div>
                <div className="text-[10px] text-gray-300">1h 48m • Neo-Noir Dystopia</div>
              </div>
              <div className="absolute bottom-3 right-3 w-8 h-8 bg-primary/90 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400 relative z-10">
              <span>Availability: Amazon Prime 4K</span>
              <Link to="#" className="text-primary-soft font-bold hover:text-white transition-colors">Why this pick?</Link>
            </div>
          </div>

          {/* Watch Habits Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-sans font-bold text-white text-sm">Watch Habits</h3>
              <span className="text-[10px] text-gray-500 font-mono">Past 6 Months</span>
            </div>
            
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={watchHabitsData}>
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#12111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#a855f7', fontWeight: 'bold' }}
                    labelStyle={{ color: '#9ca3af', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#374151" radius={[4, 4, 0, 0]} activeBar={{ fill: '#a855f7' }} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} dy={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-xs text-gray-400">Average: <strong className="text-white">28 films/month</strong></span>
              <span className="text-xs font-bold text-green-400 flex items-center gap-1">↗ +18% QoQ</span>
            </div>
          </div>

          {/* Genre Affinity */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-sans font-bold text-white text-sm">Genre Affinity</h3>
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Historical</span>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Sci-Fi & Cyberpunk', pct: 38 },
                { name: 'Film Noir & Neo-Noir', pct: 27 },
                { name: 'Psychological Thriller', pct: 21 },
                { name: 'Arthouse & Surrealism', pct: 14 },
              ].map(genre => (
                <div key={genre.name}>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>{genre.name}</span>
                    <span className="text-white">{genre.pct}%</span>
                  </div>
                  <div className="w-full bg-obsidian rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary-soft h-full rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${genre.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Services */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-sans font-bold text-white text-sm">Connected Services</h3>
              <Link to="#" className="text-[10px] text-primary-soft font-bold hover:text-white transition-colors">Manage</Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-obsidian/50 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                <span className="text-xs font-bold text-gray-300">Apple TV+</span>
              </div>
              <div className="bg-obsidian/50 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></span>
                <span className="text-xs font-bold text-gray-300">Criterion</span>
              </div>
              <div className="bg-obsidian/50 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span>
                <span className="text-xs font-bold text-gray-300">MUBI</span>
              </div>
              <div className="bg-obsidian/50 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></span>
                <span className="text-xs font-bold text-gray-300">Max (4K)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
