import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Archive, Bookmark, Search, Bell, Clapperboard, Tv, User as UserIcon, ChevronDown, LogIn, LogOut, X } from 'lucide-react';
import Footer from '../components/Footer';
import { api, getImageUrl } from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import Scene from '../components/3d/Scene';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AppShell() {
  const { session, user, authModalOpen, setAuthModalOpen } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState<'movies' | 'tv' | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const res = await api.get('/search/multi', {
        params: { query: debouncedSearch }
      });
      return res.data.results.slice(0, 5); // top 5 results
    },
    enabled: debouncedSearch.length > 2
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Global Page Transition Animation
  useGSAP(() => {
    // Reset and animate the main content area every time the route changes
    gsap.fromTo(
      'main',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    // Re-initialize ScrollTrigger for global animation elements on route change
    setTimeout(() => {
      const elements = document.querySelectorAll('.gsap-animate');
      elements.forEach((el) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 40 }, 
          {
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            }
          }
        );
      });
    }, 100); // small delay to let React render the new page
  }, [location.pathname]);


  return (
    <>
      {/* Global 3D Animated Scene Background */}
      <Scene />
      
      <div className="flex flex-col min-h-screen relative z-10 overflow-x-hidden">
        {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 glass-panel border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between gap-8">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="CINE NOIR Logo" className="object-contain" />            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {/* Movies Group */}
              <div className="relative group">
                <div className="px-4 py-2 rounded-pill text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer flex items-center gap-1">
                  Movies <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-full left-0 mt-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-obsidian border border-white/10 rounded-xl shadow-xl flex flex-col p-2">
                    <NavLink to="/" className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-primary/20 text-primary-soft' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Discover Movies</NavLink>
                    <NavLink to="/vault" className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-primary/20 text-primary-soft' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Top Rated</NavLink>
                  </div>
                </div>
              </div>
              
              {/* TV Series Group */}
              <div className="relative group">
                <div className="px-4 py-2 rounded-pill text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer flex items-center gap-1">
                  TV Series <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-full left-0 mt-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-obsidian border border-white/10 rounded-xl shadow-xl flex flex-col p-2">
                    <NavLink to="/tv" className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-primary/20 text-primary-soft' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Discover TV Series</NavLink>
                    <NavLink to="/tv/vault" className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-primary/20 text-primary-soft' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Top Rated</NavLink>
                  </div>
                </div>
              </div>

              {/* Watchlist */}
              <NavLink to="/watchlist" className={({ isActive }) => `px-4 py-2 rounded-pill text-sm font-semibold transition-all ${isActive ? 'bg-primary/20 text-primary-soft' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>Watchlist</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="relative hidden lg:block w-full max-w-sm" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search cinematic titles, cast, directors..." 
                className="w-full bg-black/40 border border-white/10 rounded-pill py-2 pl-10 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-soft/50 focus:ring-1 focus:ring-primary-soft/50 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-block bg-white/10 rounded px-1.5 py-0.5 text-[10px] font-sans text-gray-400 font-semibold border border-white/10">⌘K</kbd>
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchQuery.length > 2 && (
                <div className="absolute top-full right-0 left-0 mt-2 bg-obsidian border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {isSearchLoading ? (
                    <div className="p-4 text-center text-gray-400 text-sm">Searching the archives...</div>
                  ) : searchResults?.length > 0 ? (
                    <div className="max-h-[400px] overflow-y-auto">
                      {searchResults.map((result: any) => (
                        <div 
                          key={result.id} 
                          className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-b-0 transition-colors"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                            if (result.media_type === 'movie') navigate(`/movie/${result.id}`);
                            if (result.media_type === 'tv') navigate(`/tv/${result.id}`);
                          }}
                        >
                          {result.poster_path || result.profile_path ? (
                            <img src={getImageUrl(result.poster_path || result.profile_path, 'w500')} alt={result.title || result.name} className="w-10 h-14 object-cover rounded-md" />
                          ) : (
                            <div className="w-10 h-14 bg-white/10 rounded-md flex items-center justify-center">
                              {result.media_type === 'movie' ? <Clapperboard className="w-4 h-4 text-gray-500" /> : result.media_type === 'tv' ? <Tv className="w-4 h-4 text-gray-500" /> : <UserIcon className="w-4 h-4 text-gray-500" />}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-bold text-white truncate">{result.title || result.name}</div>
                            <div className="text-[10px] text-gray-400 uppercase flex items-center gap-2 mt-1">
                              <span className="text-primary-soft">{result.media_type}</span>
                              {result.release_date && <span>• {result.release_date.split('-')[0]}</span>}
                              {result.first_air_date && <span>• {result.first_air_date.split('-')[0]}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400 text-sm">No results found in the database.</div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-obsidian border-b border-white/10 lg:hidden shadow-2xl animate-fade-in z-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cinematic titles, cast..." 
                    className="w-full bg-black/40 border border-white/10 rounded-pill py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-soft/50 focus:ring-1 focus:ring-primary-soft/50 transition-all"
                    autoFocus
                  />
                </div>
                
                {/* Mobile Search Results */}
                {searchQuery.length > 2 && (
                  <div className="mt-4 max-h-[300px] overflow-y-auto">
                    {isSearchLoading ? (
                      <div className="p-4 text-center text-gray-400 text-sm">Searching the archives...</div>
                    ) : searchResults?.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((result: any) => (
                          <div 
                            key={result.id} 
                            className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer rounded-lg transition-colors border border-transparent hover:border-white/5"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              if (result.media_type === 'movie') navigate(`/movie/${result.id}`);
                              if (result.media_type === 'tv') navigate(`/tv/${result.id}`);
                            }}
                          >
                            {result.poster_path || result.profile_path ? (
                              <img src={getImageUrl(result.poster_path || result.profile_path, 'w500')} alt={result.title || result.name} className="w-10 h-14 object-cover rounded-md shadow-md" />
                            ) : (
                              <div className="w-10 h-14 bg-white/10 rounded-md flex items-center justify-center">
                                {result.media_type === 'movie' ? <Clapperboard className="w-4 h-4 text-gray-500" /> : result.media_type === 'tv' ? <Tv className="w-4 h-4 text-gray-500" /> : <UserIcon className="w-4 h-4 text-gray-500" />}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-bold text-white truncate max-w-[200px]">{result.title || result.name}</div>
                              <div className="text-[10px] text-gray-400 uppercase flex items-center gap-2 mt-1">
                                <span className="text-primary-soft font-bold">{result.media_type}</span>
                                {result.release_date && <span>• {result.release_date.split('-')[0]}</span>}
                                {result.first_air_date && <span>• {result.first_air_date.split('-')[0]}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-400 text-sm">No results found.</div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile Search Toggle Button */}
            <button 
              className="lg:hidden p-2 text-gray-400 hover:text-primary-soft transition-colors"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (!isSearchOpen) setSearchQuery('');
              }}
            >
              <Search className="w-5 h-5" />
            </button>
            {session && user ? (
              <div className="flex items-center gap-4 group relative cursor-pointer ml-2">
                <button className="w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-primary-soft transition-all flex items-center justify-center bg-primary">
                  <UserIcon className="w-4 h-4 text-white" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 glass-panel border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
                  <div className="px-3 py-2 text-sm text-white font-bold border-b border-white/5 mb-1 truncate">
                    {user.email}
                  </div>
                  <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors w-full text-left">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary-soft rounded-pill text-sm font-bold border border-primary/30 transition-all ml-2">
                <LogIn className="w-4 h-4" /> <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8 pt-[88px] md:pt-[104px]">
        <Outlet />
      </main>

      {/* Mobile Floating Navigation Overlay */}
      {activeMobileMenu && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setActiveMobileMenu(null)} />
      )}

      {/* Mobile Floating Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 glass-panel rounded-pill flex justify-around items-center p-3 z-50">
        
        {/* Movies */}
        <div className="relative">
          <button 
            onClick={() => setActiveMobileMenu(activeMobileMenu === 'movies' ? null : 'movies')}
            className={`flex flex-col items-center gap-1 transition-colors ${(location.pathname === '/' || location.pathname === '/vault') ? 'text-primary-soft' : 'text-gray-400 hover:text-primary-soft'}`}
          >
            <Clapperboard size={20} />
            <span className="text-[10px]">Movies</span>
          </button>
          
          {activeMobileMenu === 'movies' && (
            <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-36 bg-obsidian border border-white/10 rounded-xl shadow-2xl p-1.5 flex flex-col animate-fade-in">
              <Link to="/" onClick={() => setActiveMobileMenu(null)} className={`px-3 py-2 text-xs font-semibold rounded-lg text-center transition-colors ${location.pathname === '/' ? 'bg-primary/20 text-primary-soft' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Discover</Link>
              <Link to="/vault" onClick={() => setActiveMobileMenu(null)} className={`px-3 py-2 text-xs font-semibold rounded-lg text-center transition-colors ${location.pathname === '/vault' ? 'bg-primary/20 text-primary-soft' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Top Rated</Link>
            </div>
          )}
        </div>

        {/* TV Series */}
        <div className="relative">
          <button 
            onClick={() => setActiveMobileMenu(activeMobileMenu === 'tv' ? null : 'tv')}
            className={`flex flex-col items-center gap-1 transition-colors ${(location.pathname === '/tv' || location.pathname === '/tv/vault') ? 'text-primary-soft' : 'text-gray-400 hover:text-primary-soft'}`}
          >
            <Tv size={20} />
            <span className="text-[10px]">TV Series</span>
          </button>
          
          {activeMobileMenu === 'tv' && (
            <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-36 bg-obsidian border border-white/10 rounded-xl shadow-2xl p-1.5 flex flex-col animate-fade-in">
              <Link to="/tv" onClick={() => setActiveMobileMenu(null)} className={`px-3 py-2 text-xs font-semibold rounded-lg text-center transition-colors ${location.pathname === '/tv' ? 'bg-primary/20 text-primary-soft' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Discover</Link>
              <Link to="/tv/vault" onClick={() => setActiveMobileMenu(null)} className={`px-3 py-2 text-xs font-semibold rounded-lg text-center transition-colors ${location.pathname === '/tv/vault' ? 'bg-primary/20 text-primary-soft' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Top Rated</Link>
            </div>
          )}
        </div>

        {/* Watchlist */}
        <NavLink to="/watchlist" className={({isActive}) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary-soft' : 'text-gray-400 hover:text-primary-soft'}`}>
          <Bookmark size={20} />
          <span className="text-[10px]">Watchlist</span>
        </NavLink>
      </nav>

      <Footer />
      </div>

      {/* Global Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/80 backdrop-blur-md px-4 transition-all duration-300">
          <div className="bg-obsidian border border-white/10 p-8 rounded-2xl shadow-2xl max-w-sm w-full relative">
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bookmark className="w-8 h-8 text-primary-soft" />
              </div>
              <h3 className="font-syne text-2xl font-bold text-white">Save Your Favorites</h3>
              <p className="text-sm text-gray-400 leading-relaxed pb-4">
                Sign in to create a personalized watchlist, track what you've seen, and get tailored recommendations.
              </p>
              <div className="space-y-3">
                <Link to="/login" onClick={() => setAuthModalOpen(false)} className="block w-full py-3 bg-primary hover:bg-primary-soft text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setAuthModalOpen(false)} className="block w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold transition-all border border-white/10">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
