import { Link } from 'react-router-dom';
import AnimalCard from '../components/AnimalCard.jsx';
import { useFetch } from '../components/useFetch.js';
import { useFavorites } from '../favorites.js';
import { openCookieSettings, useConsent } from '../consent.js';

export default function Favorites() {
  const consent = useConsent();
  const favorites = useFavorites();
  const { data: animals, loading } = useFetch('/animals');

  if (!consent?.preferences) {
    return (
      <div className="empty">
        <h1>❤️ Meus favoritos</h1>
        <p>Para guardar favoritos neste navegador, é preciso permitir os cookies de preferências.</p>
        <button className="btn" onClick={() => openCookieSettings()}>
          Ajustar cookies
        </button>
      </div>
    );
  }

  const list = (animals ?? []).filter((a) => favorites.includes(a.id));

  return (
    <>
      <h1>❤️ Meus favoritos</h1>
      {loading && <p>Carregando...</p>}
      {!loading && list.length === 0 && (
        <div className="empty">
          <p>Você ainda não favoritou nenhum animal. Toque no 🤍 dos cartões para guardar os que mais gostou.</p>
          <Link to="/adote" className="btn">
            Ver animais
          </Link>
        </div>
      )}
      <div className="grid">
        {list.map((a) => (
          <AnimalCard key={a.id} animal={a} />
        ))}
      </div>
    </>
  );
}
