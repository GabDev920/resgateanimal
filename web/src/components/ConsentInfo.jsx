import { formatDate } from '../api.js';

// Mostra ao admin quando o titular consentiu e se os dados já foram anonimizados.
export default function ConsentInfo({ item }) {
  if (item.anonymized_at) {
    return <p className="consent-info">🔒 Dados anonimizados em {formatDate(item.anonymized_at)}</p>;
  }
  if (item.lgpd_consent_at) {
    return <p className="consent-info">✓ Consentimento LGPD em {formatDate(item.lgpd_consent_at)}</p>;
  }
  return <p className="consent-info muted">Enviado antes do registro de consentimento</p>;
}
