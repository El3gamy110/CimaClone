import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';
import { useEffect, Suspense, lazy } from 'react';

// Lazy loaded page components
const Discovery = lazy(() => import('./pages/Discovery'));
const FilmDossier = lazy(() => import('./pages/FilmDossier'));
const TvDiscovery = lazy(() => import('./pages/TvDiscovery'));
const TvDossier = lazy(() => import('./pages/TvDossier'));
const TvVault = lazy(() => import('./pages/TvVault'));
const ArchivalVault = lazy(() => import('./pages/ArchivalVault'));
const ClientWatchlist = lazy(() => import('./pages/ClientWatchlist'));
const Collection = lazy(() => import('./pages/Collection'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const VerifyOtp = lazy(() => import('./pages/VerifyOtp'));

function App() {
  const { setSession, fetchWatchlist } = useStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchWatchlist();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchWatchlist();
    });

    return () => subscription.unsubscribe();
  }, [setSession, fetchWatchlist]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="animate-pulse min-h-screen bg-obsidian flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-primary-soft border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-sans tracking-widest text-sm">LOADING ASSETS...</p>
      </div>}>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Discovery />} />
            <Route path="movie/:id" element={<FilmDossier />} />
            <Route path="tv" element={<TvDiscovery />} />
            <Route path="tv/:id" element={<TvDossier />} />
            <Route path="tv/vault" element={<TvVault />} />
            <Route path="vault" element={<ArchivalVault />} />
            <Route path="collection/:id" element={<Collection />} />
            <Route path="watchlist" element={<ClientWatchlist />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verify" element={<VerifyOtp />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
