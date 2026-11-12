import { NavLink, Outlet, Link } from 'react-router-dom';
import CookieBanner from './CookieBanner.jsx';
import { openCookieSettings } from '../consent.js';
import { useFavorites } from '../favorites.js';

export default function Layout() {
  const favorites = useFavorites();

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            🐾 Resgate Animal
          </Link>
          <nav className="nav">
            <NavLink to="/" end>
              Início
            </NavLink>
            <NavLink to="/adote">Adote</NavLink>
            <NavLink to="/finais-felizes">Finais felizes</NavLink>
            <NavLink to="/ajude">Como ajudar</NavLink>
            <NavLink to="/favoritos" aria-label={`Favoritos (${favorites.length})`}>
              ❤️ {favorites.length > 0 && <span className="count">{favorites.length}</span>}
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Resgate Animal — adoção responsável salva vidas.</p>
          <div className="footer-links">
            <Link to="/privacidade">Privacidade</Link>
            <button className="link" onClick={() => openCookieSettings()}>
              Cookies
            </button>
            <Link to="/admin">Área administrativa</Link>
          </div>
        </div>
      </footer>
      <CookieBanner />
    </>
  );
}
