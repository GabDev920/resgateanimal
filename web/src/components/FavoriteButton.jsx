import { toggleFavorite, useFavorites } from '../favorites.js';

export default function FavoriteButton({ animal, compact = false }) {
  const favorites = useFavorites();
  const active = favorites.includes(animal.id);

  function handleClick(e) {
    // O botão fica dentro do cartão, que é um link: não queremos navegar ao favoritar.
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(animal.id);
  }

  const label = active ? `Remover ${animal.name} dos favoritos` : `Adicionar ${animal.name} aos favoritos`;
  return (
    <button
      type="button"
      className={`fav ${active ? 'active' : ''} ${compact ? 'compact' : ''}`}
      onClick={handleClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
    >
      {active ? '❤️' : '🤍'}
      {!compact && <span>{active ? 'Favorito' : 'Favoritar'}</span>}
    </button>
  );
}
