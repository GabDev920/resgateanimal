import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { saveConsent, useConsent } from '../consent.js';
import { refreshFavorites } from '../favorites.js';

const CATEGORIES = [
  {
    key: 'necessary',
    title: 'Necessários',
    text: 'Guardam esta escolha de cookies e mantêm o login da área administrativa. Sempre ativos.',
    locked: true,
  },
  {
    key: 'preferences',
    title: 'Preferências',
    text: 'Guardam os animais que você marcou como favoritos neste navegador.',
  },
  {
    key: 'statistics',
    title: 'Estatísticas',
    text: 'Contam, de forma anônima, quantas vezes a página de cada animal foi vista. Nenhum dado pessoal é enviado.',
  },
];

export default function CookieBanner() {
  const consent = useConsent();
  const [settings, setSettings] = useState(null); // null = painel fechado; { reason } = aberto
  const [choice, setChoice] = useState({ preferences: true, statistics: true });

  useEffect(() => {
    const open = (e) => {
      const current = consent ?? { preferences: true, statistics: true };
      setChoice({ preferences: current.preferences, statistics: current.statistics });
      setSettings({ reason: e.detail?.reason });
    };
    window.addEventListener('ra:cookie-settings', open);
    return () => window.removeEventListener('ra:cookie-settings', open);
  }, [consent]);

  function save(next) {
    saveConsent(next);
    refreshFavorites();
    setSettings(null);
  }

  if (settings) {
    return (
      <div className="cookie-overlay" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
        <div className="cookie-modal card card-body">
          <h2 id="cookie-title">Preferências de cookies</h2>
          {settings.reason && <p className="cookie-reason">{settings.reason}</p>}
          {CATEGORIES.map((c) => (
            <label key={c.key} className="cookie-option">
              <input
                type="checkbox"
                checked={c.locked ? true : choice[c.key]}
                disabled={c.locked}
                onChange={(e) => setChoice({ ...choice, [c.key]: e.target.checked })}
              />
              <span>
                <strong>{c.title}</strong>
                <span className="muted">{c.text}</span>
              </span>
            </label>
          ))}
          <div className="actions">
            <button className="btn" onClick={() => save(choice)}>
              Salvar escolhas
            </button>
            <button className="btn btn-outline" onClick={() => save({ preferences: true, statistics: true })}>
              Aceitar todos
            </button>
          </div>
          <p className="muted small">
            Saiba mais na <Link to="/privacidade" onClick={() => setSettings(null)}>Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    );
  }

  if (consent) return null;

  return (
    <div className="cookie-banner" role="region" aria-label="Aviso de cookies">
      <p>
        🍪 Usamos cookies para guardar seus favoritos e contar, de forma anônima, as visitas aos animais. Os
        necessários ficam sempre ativos.{' '}
        <Link to="/privacidade">Política de Privacidade</Link>
      </p>
      <div className="actions">
        <button className="btn btn-sm" onClick={() => save({ preferences: true, statistics: true })}>
          Aceitar todos
        </button>
        <button className="btn btn-outline btn-sm" onClick={() => save({ preferences: false, statistics: false })}>
          Só os necessários
        </button>
        <button className="link" onClick={() => setSettings({})}>
          Personalizar
        </button>
      </div>
    </div>
  );
}
