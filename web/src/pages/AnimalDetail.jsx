import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../components/useFetch.js';
import FavoriteButton from '../components/FavoriteButton.jsx';
import LgpdConsent, { withConsent } from '../components/LgpdConsent.jsx';
import { api, LABELS, formatAge, photoUrl } from '../api.js';
import { useConsent } from '../consent.js';

// Animais já contados nesta visita (evita somar de novo ao voltar para a mesma página).
const counted = new Set();

export default function AnimalDetail() {
  const { id } = useParams();
  const { data: animal, loading, error } = useFetch(`/animals/${id}`);
  const [photoIndex, setPhotoIndex] = useState(0);
  const consent = useConsent();

  useEffect(() => {
    if (!consent?.statistics || counted.has(id)) return;
    counted.add(id);
    api(`/animals/${id}/view`, { method: 'POST' }).catch(() => {});
  }, [id, consent?.statistics]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="error">{error}</p>;

  const photo = animal.photos[photoIndex];
  const canAdopt = ['disponivel', 'em_processo'].includes(animal.status);

  return (
    <>
      <p>
        <Link to={animal.status === 'adotado' ? '/finais-felizes' : '/adote'}>← Voltar</Link>
      </p>
      <div className="detail">
        <div>
          <div className="detail-photo">
            {photo ? <img src={photoUrl(photo.filename)} alt={animal.name} /> : <span className="no-photo">🐾</span>}
          </div>
          {animal.photos.length > 1 && (
            <div className="thumbs">
              {animal.photos.map((p, i) => (
                <button key={p.id} className={i === photoIndex ? 'active' : ''} onClick={() => setPhotoIndex(i)}>
                  <img src={photoUrl(p.filename)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="title-row">
            <h1>{animal.name}</h1>
            <FavoriteButton animal={animal} />
          </div>
          <span className="badge">{LABELS.status[animal.status]}</span>
          {animal.views > 0 && (
            <span className="views">
              👀 {animal.views} {animal.views === 1 ? 'visualização' : 'visualizações'}
            </span>
          )}
          <ul className="facts">
            <li>
              <strong>Espécie:</strong> {LABELS.species[animal.species]}
            </li>
            <li>
              <strong>Sexo:</strong> {LABELS.sex[animal.sex]}
            </li>
            <li>
              <strong>Porte:</strong> {LABELS.size[animal.size]}
            </li>
            <li>
              <strong>Idade:</strong> {formatAge(animal.age_months)}
            </li>
            <li>
              <strong>Castrado:</strong> {animal.neutered ? 'Sim' : 'Não'} · <strong>Vacinado:</strong>{' '}
              {animal.vaccinated ? 'Sim' : 'Não'}
            </li>
          </ul>
          {animal.description && <p className="pre">{animal.description}</p>}
          {animal.health_notes && (
            <p className="pre muted">
              <strong>Saúde:</strong> {animal.health_notes}
            </p>
          )}
          <ShareButtons animal={animal} />
        </div>
      </div>

      {canAdopt && <AdoptionForm animal={animal} />}
    </>
  );
}

function ShareButtons({ animal }) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  const text =
    animal.status === 'adotado'
      ? `${animal.name} encontrou um lar! 🎉 ${url}`
      : `Conheça ${animal.name}, que está esperando por uma família! 🐾 ${url}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copie o link:', url);
    }
  }

  return (
    <div className="share">
      <span className="muted">Ajude a divulgar:</span>
      <a
        className="btn btn-sm btn-whatsapp"
        href={`https://wa.me/?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Compartilhar no WhatsApp
      </a>
      <button type="button" className="btn btn-outline btn-sm" onClick={copy}>
        {copied ? 'Link copiado ✓' : 'Copiar link'}
      </button>
    </div>
  );
}

function AdoptionForm({ animal }) {
  const [status, setStatus] = useState({ sending: false, done: false, error: null });

  async function handleSubmit(e) {
    e.preventDefault();
    const form = withConsent(Object.fromEntries(new FormData(e.currentTarget)));
    setStatus({ sending: true, done: false, error: null });
    try {
      await api('/adoptions', { method: 'POST', body: { ...form, animal_id: animal.id } });
      setStatus({ sending: false, done: true, error: null });
    } catch (err) {
      setStatus({ sending: false, done: false, error: err.message });
    }
  }

  if (status.done) {
    return (
      <div className="card card-body success">
        Recebemos seu interesse em adotar {animal.name}! Nossa equipe entrará em contato em breve. 💛
      </div>
    );
  }

  return (
    <form className="card card-body form" onSubmit={handleSubmit}>
      <h2>Quero adotar {animal.name}</h2>
      <div className="form-row">
        <label>
          Nome completo
          <input name="name" required minLength={2} />
        </label>
        <label>
          E-mail
          <input name="email" type="email" required />
        </label>
      </div>
      <div className="form-row">
        <label>
          Telefone / WhatsApp
          <input name="phone" required minLength={8} />
        </label>
        <label>
          Cidade
          <input name="city" required />
        </label>
      </div>
      <label>
        Conte um pouco sobre você e sua casa
        <textarea name="message" rows={4} />
      </label>
      <LgpdConsent />
      {status.error && <p className="error">{status.error}</p>}
      <button className="btn" disabled={status.sending}>
        {status.sending ? 'Enviando...' : 'Enviar interesse'}
      </button>
    </form>
  );
}
