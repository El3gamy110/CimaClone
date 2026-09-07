import { Link } from 'react-router-dom';


export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-obsidian py-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-6 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="CINE NOIR Logo" className="object-contain" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              The definitive cinematic archive designed for passionate cinephiles, industry curators, and late-night film explorers.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-syne font-bold text-white uppercase tracking-widest text-sm">Movies</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-primary-soft transition-colors">Discover Movies</Link></li>
              <li><Link to="/vault" className="hover:text-primary-soft transition-colors">Top Rated Movies</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-syne font-bold text-white uppercase tracking-widest text-sm">TV Series</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/tv" className="hover:text-primary-soft transition-colors">Discover TV Series</Link></li>
              <li><Link to="/tv/vault" className="hover:text-primary-soft transition-colors">Top Rated TV</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-syne font-bold text-white uppercase tracking-widest text-sm">Account</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/watchlist" className="hover:text-primary-soft transition-colors">My Watchlist</Link></li>
              <li><Link to="/login" className="hover:text-primary-soft transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-primary-soft transition-colors">Create Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 CimaClone Media Database Corp. Engineered for cinematic purity.</p>
          <span>Powered by CimaClone</span>
        </div>
      </div>
    </footer>
  );
}
