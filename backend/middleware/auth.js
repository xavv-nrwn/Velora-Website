import { pool } from '../db/index.js';

export async function requireAuth(req, res, next) {
  try {
    if (!req.session?.userId) {
      const [rows] = await pool.query('SELECT id FROM users ORDER BY id ASC LIMIT 1');
      if (!rows.length) return res.status(500).json({ error: 'Belum ada akun demo' });
      req.session.userId = rows[0].id;
    }
    next();
  } catch (error) {
    next(error);
  }
}
