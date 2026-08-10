import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import SearchPage from '../pages/SearchPage';
import ArtistPage from '../pages/ArtistPage';
import AlbumPage from '../pages/AlbumPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/artists/:id" element={<ArtistPage />} />
          <Route path="/albums/:id" element={<AlbumPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default AppRouter;
