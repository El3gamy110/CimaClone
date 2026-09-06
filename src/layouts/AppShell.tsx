import { Outlet, Link } from 'react-router-dom';
import { Compass, Archive, Bookmark } from 'lucide-react';

export default function AppShell() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-primary/20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="CINE NOIR Logo" className="h-8 w-8 object-contain" />
            <span className="font-syne font-bold text-xl text-primary-soft tracking-wider">CINE NOIR</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-primary-soft transition-colors text-sm font-medium">Discovery</Link>
            <Link to="/vault" className="text-gray-300 hover:text-primary-soft transition-colors text-sm font-medium">Vault</Link>
            <Link to="/watchlist" className="text-gray-300 hover:text-primary-soft transition-colors text-sm font-medium">Watchlist</Link>
          </nav>
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
    </div>
  );
}
