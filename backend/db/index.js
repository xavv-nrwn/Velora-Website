import mysql from 'mysql2/promise';

const host = process.env.DB_HOST || 'localhost';
const ssl = process.env.DB_SSL === 'true' || host.includes('aivencloud.com')
  ? { rejectUnauthorized: false }
  : undefined;

export const pool = mysql.createPool({
  host,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'duitku_db',
  ssl,
  timezone: '+07:00',
  waitForConnections: true,
  connectionLimit: 10
});
