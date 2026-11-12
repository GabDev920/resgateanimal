import { Link } from 'react-router-dom';
import { useFetch } from '../../components/useFetch.js';
import { LABELS } from '../../api.js';

const STATUS_ORDER = ['disponivel', 'em_processo', 'em_tratamento', 'adotado'];

export default function Dashboard() {
  const { data: stats, loading, error } = useFetch('/stats');

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="error">{error}</p>;

  const maxViews = Math.max(1, ...stats.topViewed.map((a) => a.views));

  return (
    <>
      <h1>Visão geral</h1>

      <h2 className="section-title">Animais</h2>
      <div className="stats">
        {STATUS_ORDER.map((s) => (
          <div key={s} className="stat">
            <b>{stats.byStatus[s] ?? 0}</b>
            <span>{LABELS.status[s]}</span>
          </div>
        ))}
      </div>

      <h2 className="section-title">Para fazer</h2>
      <div className="stats">
        <Link to="/admin/adocoes" className={`stat ${stats.pendingAdoptions ? 'attention' : ''}`}>
          <b>{stats.pendingAdoptions}</b>
          <span>Candidaturas pendentes</span>
        </Link>
        <Link to="/admin/mensagens" className={`stat ${stats.unreadMessages ? 'attention' : ''}`}>
          <b>{stats.unreadMessages}</b>
          <span>Mensagens não lidas</span>
        </Link>
        <div className="stat">
          <b>{stats.approvedLast30Days}</b>
          <span>Adoções aprovadas (30 dias)</span>
        </div>
      </div>

      <h2 className="section-title">Mais vistos no site</h2>
      {stats.topViewed.length === 0 ? (
        <p className="muted">
          Ainda não há visualizações. Elas são contadas quando o visitante aceita os cookies de estatística.
        </p>
      ) : (
        <ol className="ranking">
          {stats.topViewed.map((a) => (
            <li key={a.id}>
              <Link to={`/admin/animais/${a.id}`}>{a.name}</Link>
              <span className="bar-track">
                <span className="bar" style={{ width: `${(a.views / maxViews) * 100}%` }} />
              </span>
              <span className="num">{a.views}</span>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
