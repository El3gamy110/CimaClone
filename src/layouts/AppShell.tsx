import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, Archive, Bookmark, Search, Bell, Clapperboard, Tv, User as UserIcon, ChevronDown, LogIn, LogOut } from 'lucide-react';
import Footer from '../components/Footer';
import { api, getImageUrl } from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

export default function AppShell() {
  const { session, user } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5">
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

            <button className="relative p-2 text-gray-400 hover:text-white transition-colors hidden sm:block">
              <Bell className="w-5 h-5" />
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
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8">
        <Outlet />
      </main>

      {/* Mobile Floating Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 glass-panel rounded-pill flex justify-around items-center p-3 z-50">
        <Link to="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary-soft">
          <Compass size={20} />
          <span className="text-[10px]">Discover</span>
        </Link>
        <Link to="/vault" className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary-soft">
          <Archive size={20} />
          <span className="text-[10px]">Vault</span>
        </Link>
        <Link to="/watchlist" className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary-soft">
          <Bookmark size={20} />
          <span className="text-[10px]">Watchlist</span>
        </Link>
      </nav>

      <Footer />
    </div>
  );
}
