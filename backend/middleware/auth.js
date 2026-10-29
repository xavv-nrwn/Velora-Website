import { ensureDemoDatabase } from '../db/bootstrap.js';

export async function requireAuth(req, res, next) {
  try {
    if (!req.session?.userId) {
      req.session.userId = await ensureDemoDatabase();
    }
    next();
  } catch (error) {
    next(error);
  }
}
