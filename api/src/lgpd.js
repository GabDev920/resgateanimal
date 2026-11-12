import { z } from 'zod';

// Formulários públicos só são aceitos com o aceite explícito da Política de Privacidade.
export const lgpdConsent = z.literal(true, { message: 'É preciso aceitar a Política de Privacidade' });

export const ANONYMIZED = {
  name: 'Titular anonimizado',
  email: 'anonimizado@removido.invalid',
};
