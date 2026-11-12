import { Link } from 'react-router-dom';
import AnimalCard from '../components/AnimalCard.jsx';
import { useFetch } from '../components/useFetch.js';

export default function HappyEndings() {
  const { data: animals, loading, error } = useFetch('/animals?status=adotado');

  return (
    <>
      <section className="hero hero-sm">
        <h1>🎉 Finais felizes</h1>
        <p>
          Cada um destes animais chegou até nós precisando de ajuda e hoje tem uma família.
          {animals?.length > 0 && (
            <>
              {' '}
              Já são <strong>{animals.length}</strong> {animals.length === 1 ? 'história' : 'histórias'} por aqui.
            </>
          )}
        </p>
      </section>
      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}
      {animals?.length === 0 && (
        <p className="muted center">
          As primeiras histórias estão sendo escritas. <Link to="/adote">Que tal começar a sua?</Link>
        </p>
      )}
      <div className="grid">
        {animals?.map((a) => (
          <AnimalCard key={a.id} animal={a} />
        ))}
      </div>
    </>
  );
}
