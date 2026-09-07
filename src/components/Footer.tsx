import { Link } from 'react-router-dom';


export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-obsidian py-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-6 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="CINE NOIR Logo" className="h-8 w-8 object-contain" />
              <span className="font-syne font-bold text-xl text-primary-soft tracking-wider">CINE NOIR</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              The definitive cinematic archive designed for passionate cinephiles, industry curators, and late-night film explorers.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-syne font-bold text-white uppercase tracking-widest text-sm">Genres</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Neo-Noir & Thriller</Link></li>
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Sci-Fi & Cyberpunk</Link></li>
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Psychological Drama</Link></li>
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Art House & Indie</Link></li>
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Classic Remasters</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-syne font-bold text-white uppercase tracking-widest text-sm">Platform & Dev</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-primary-soft transition-colors">API Documentation</Link></li>
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Community Forums</Link></li>
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Developer Sandbox</Link></li>
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Release Notes</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-syne font-bold text-white uppercase tracking-widest text-sm">Editorial & Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Editorial Standards</Link></li>
              <li><Link to="#" className="hover:text-primary-soft transition-colors">Content Ingestion</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 CineNoir Media Database Corp. Engineered for cinematic purity.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-soft animate-pulse"></span>
              System Operational
            </span>
            <span>Powered by CineNoir Core v4.8</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
