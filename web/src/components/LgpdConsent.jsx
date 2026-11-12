import { Link } from 'react-router-dom';

// Caixa de aceite obrigatória nos formulários públicos.
export default function LgpdConsent() {
  return (
    <label className="consent">
      <input type="checkbox" name="lgpd_consent" required />
      <span>
        Li e concordo com a <Link to="/privacidade" target="_blank">Política de Privacidade</Link> e autorizo o uso dos
        meus dados para que a ONG entre em contato sobre este pedido.
      </span>
    </label>
  );
}

// Converte o valor do checkbox ("on") no booleano esperado pela API.
export function withConsent(form) {
  return { ...form, lgpd_consent: form.lgpd_consent === 'on' };
}
