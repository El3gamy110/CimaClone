import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import Discovery from './pages/Discovery';
import FilmDossier from './pages/FilmDossier';
import ArchivalVault from './pages/ArchivalVault';
import ClientWatchlist from './pages/ClientWatchlist';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Discovery />} />
          <Route path="movie/:id" element={<FilmDossier />} />
          <Route path="vault" element={<ArchivalVault />} />
          <Route path="watchlist" element={<ClientWatchlist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
