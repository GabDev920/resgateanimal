import { openCookieSettings } from '../consent.js';

export default function Privacy() {
  return (
    <article className="prose">
      <h1>Política de Privacidade</h1>
      <p className="muted">
        Esta política explica como a ONG trata os dados pessoais recebidos pelo site, conforme a Lei Geral de Proteção de
        Dados (Lei nº 13.709/2018).
      </p>

      <h2>Quais dados coletamos e por quê</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Onde</th>
              <th>Dados</th>
              <th>Finalidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Candidatura de adoção</td>
              <td>Nome, e-mail, telefone, cidade e o relato enviado</td>
              <td>Avaliar a candidatura e entrar em contato sobre a adoção</td>
            </tr>
            <tr>
              <td>Formulário de contato</td>
              <td>Nome, e-mail, telefone (opcional) e a mensagem</td>
              <td>Responder dúvidas, organizar voluntariado e doações e apurar denúncias</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        A base legal é o seu <strong>consentimento</strong>, registrado com data e hora no momento do envio. Os dados são
        usados somente pela equipe da ONG e não são vendidos nem compartilhados com terceiros.
      </p>

      <h2>Cookies</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Categoria</th>
              <th>Para que serve</th>
              <th>Validade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>ra_consent</code>
              </td>
              <td>Necessário</td>
              <td>Guarda as suas escolhas sobre cookies</td>
              <td>180 dias</td>
            </tr>
            <tr>
              <td>
                <code>ra_favoritos</code>
              </td>
              <td>Preferências</td>
              <td>Lista dos animais que você marcou como favoritos</td>
              <td>180 dias</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Com a categoria <strong>estatísticas</strong> ativa, o site avisa o servidor cada vez que você abre a página de um
        animal, para somar ao contador de visualizações. Nada que identifique você é enviado ou guardado. A área
        administrativa usa o armazenamento local do navegador para manter a sessão da equipe.
      </p>
      <p>
        <button className="btn btn-outline btn-sm" onClick={() => openCookieSettings()}>
          Alterar preferências de cookies
        </button>
      </p>

      <h2>Por quanto tempo guardamos</h2>
      <p>
        Candidaturas e mensagens ficam guardadas enquanto forem necessárias para a adoção e o acompanhamento do animal.
        Os backups do sistema são mantidos por 14 dias.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Você pode pedir a qualquer momento acesso, correção ou exclusão dos seus dados, ou revogar o consentimento. Basta
        escrever pela página <a href="/ajude">Como ajudar</a>, escolhendo o assunto "Contato". A equipe anonimiza os
        dados pessoais da sua candidatura ou mensagem, mantendo apenas o histórico do animal.
      </p>

      <h2>Segurança</h2>
      <p>
        Em produção o site é acessado por conexão criptografada (HTTPS). As senhas da equipe são armazenadas com hash e
        a área administrativa tem acesso restrito.
      </p>
    </article>
  );
}
