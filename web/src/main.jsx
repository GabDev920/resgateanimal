import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Home from './pages/Home.jsx';
import Animals from './pages/Animals.jsx';
import AnimalDetail from './pages/AnimalDetail.jsx';
import Help from './pages/Help.jsx';
import Favorites from './pages/Favorites.jsx';
import HappyEndings from './pages/HappyEndings.jsx';
import Privacy from './pages/Privacy.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Admin from './pages/admin/Admin.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="adote" element={<Animals />} />
          <Route path="adote/:id" element={<AnimalDetail />} />
          <Route path="ajude" element={<Help />} />
          <Route path="favoritos" element={<Favorites />} />
          <Route path="finais-felizes" element={<HappyEndings />} />
          <Route path="privacidade" element={<Privacy />} />
          <Route path="login" element={<Login />} />
          <Route
            path="admin/*"
            element={
              <RequireAuth>
                <Admin />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
