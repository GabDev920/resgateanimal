import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const statsRouter = Router();

const count = async (query) => Number((await query.count({ n: '*' }).first()).n);

// Números da visão geral do painel administrativo.
statsRouter.get('/', requireAuth, async (req, res) => {
  const byStatusRows = await db('animals').select('status').count({ n: '*' }).groupBy('status');
  const byStatus = Object.fromEntries(byStatusRows.map((r) => [r.status, Number(r.n)]));

  const [pendingAdoptions, unreadMessages, approvedLast30Days, topViewed] = await Promise.all([
    count(db('adoption_requests').where({ status: 'pendente' })),
    count(db('contact_messages').where({ read: false })),
    count(
      db('adoption_requests')
        .where({ status: 'aprovado' })
        .where('updated_at', '>=', db.raw("now() - interval '30 days'")),
    ),
    db('animals').select('id', 'name', 'status', 'views').where('views', '>', 0).orderBy('views', 'desc').limit(5),
  ]);

  res.json({ byStatus, pendingAdoptions, unreadMessages, approvedLast30Days, topViewed });
});
