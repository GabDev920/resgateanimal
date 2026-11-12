import { useFetch } from '../../components/useFetch.js';
import ConsentInfo from '../../components/ConsentInfo.jsx';
import { api, LABELS, formatDate } from '../../api.js';

export default function MessagesAdmin() {
  const { data: messages, loading, error, reload } = useFetch('/contacts');

  async function run(action) {
    try {
      await action();
      reload();
    } catch (err) {
      alert(err.message);
    }
  }

  const toggleRead = (message) =>
    run(() => api(`/contacts/${message.id}`, { method: 'PATCH', body: { read: !message.read } }));

  function anonymize(message) {
    if (!confirm(`Apagar os dados pessoais e o conteúdo da mensagem de ${message.name}? Esta ação não pode ser desfeita.`)) return;
    run(() => api(`/contacts/${message.id}/anonymize`, { method: 'POST' }));
  }

  return (
    <>
      <h1>Mensagens</h1>
      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}
      {messages?.length === 0 && <p className="muted">Nenhuma mensagem.</p>}
      <div className="list">
        {messages?.map((m) => (
          <article key={m.id} className={`card card-body ${m.read ? 'read' : ''}`}>
            <div className="row-between">
              <h3>{m.name}</h3>
              <span className="badge">{LABELS.contact[m.type]}</span>
            </div>
            <p className="muted">
              {formatDate(m.created_at)}
              {!m.anonymized_at && ` · ${m.email}`}
              {m.phone && ` · ${m.phone}`}
            </p>
            <p className="pre">{m.message}</p>
            <ConsentInfo item={m} />
            <div className="actions">
              <button className="link" onClick={() => toggleRead(m)}>
                {m.read ? 'Marcar como não lida' : 'Marcar como lida'}
              </button>
              {!m.anonymized_at && (
                <button className="link danger" onClick={() => anonymize(m)}>
                  Anonimizar dados
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
