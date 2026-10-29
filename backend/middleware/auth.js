import { pool } from '../db/index.js';

export async function requireAuth(req, res, next) {
  try {
    if (!req.session?.userId) {
      const [rows] = await pool.query("SELECT id FROM users WHERE email='demo@velora.local' LIMIT 1");
      if (!rows.length) return res.status(503).json({ error: 'Database belum siap. Jalankan bootstrap melalui /api/health.' });
      req.session.userId = rows[0].id;
    }
    next();
  } catch (error) {
    next(error);
  }
}
