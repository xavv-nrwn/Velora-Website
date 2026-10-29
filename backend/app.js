import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import auth from './routes/auth.js';
import transactions from './routes/transactions.js';
import categories from './routes/categories.js';
import goals from './routes/goals.js';
import reports from './routes/reports.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, '../frontend/dist');
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: false }));
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(origin => origin.trim()) : ['http://localhost:5173'];
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) return callback(null, true);
  callback(new Error('Origin tidak diizinkan'));
}, credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'duitku-development-secret', resave: false, saveUninitialized: false, proxy: true, cookie: { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 } }));
app.use('/api/auth', auth);
app.use('/api/transactions', transactions);
app.use('/api/categories', categories);
app.use('/api/goals', goals);
app.get('/api/health', async (req, res, next) => {
  try {
    const { ensureDemoDatabase } = await import('./db/bootstrap.js');
    await ensureDemoDatabase();
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});
app.use('/api', reports);
app.use(express.static(frontendDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'));
});
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Terjadi kesalahan pada server' }); });
export default app;
