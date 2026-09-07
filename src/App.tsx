import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import Discovery from './pages/Discovery';
import FilmDossier from './pages/FilmDossier';
import TvDiscovery from './pages/TvDiscovery';
import TvDossier from './pages/TvDossier';
import TvVault from './pages/TvVault';
import ArchivalVault from './pages/ArchivalVault';
import ClientWatchlist from './pages/ClientWatchlist';
import Collection from './pages/Collection';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';
import { useEffect } from 'react';

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
    </BrowserRouter>
  );
}

export default App;
