import { pool } from './index.js';

export async function ensureDemoDatabase() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100) NOT NULL,email VARCHAR(255) NOT NULL UNIQUE,password_hash VARCHAR(255) NOT NULL DEFAULT '') ENGINE=InnoDB`);
  await pool.query(`CREATE TABLE IF NOT EXISTS categories(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,name VARCHAR(100) NOT NULL,type ENUM('income','expense') NOT NULL,UNIQUE KEY categories_user_type_name(user_id,type,name)) ENGINE=InnoDB`);
  await pool.query(`CREATE TABLE IF NOT EXISTS transactions(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,category_id INT NOT NULL,type ENUM('income','expense') NOT NULL,amount DECIMAL(12,2) NOT NULL,transaction_date DATE NOT NULL,description VARCHAR(255),INDEX transactions_user_date(user_id,transaction_date)) ENGINE=InnoDB`);
  await pool.query(`CREATE TABLE IF NOT EXISTS savings_goals(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,name VARCHAR(150) NOT NULL,target_amount DECIMAL(12,2) NOT NULL,saved_amount DECIMAL(12,2) NOT NULL DEFAULT 0,target_date DATE NULL,description VARCHAR(255)) ENGINE=InnoDB`);

  await pool.query("INSERT IGNORE INTO users(name,email,password_hash) VALUES('Pengguna Demo','demo@velora.local','')");
  const [[user]] = await pool.query("SELECT id FROM users WHERE email='demo@velora.local' LIMIT 1");
  const defaults = [['Uang jajan','income'],['Hadiah','income'],['Hasil kerja','income'],['Lainnya','income'],['Makanan dan minuman','expense'],['Transportasi','expense'],['Sekolah','expense'],['Belanja','expense'],['Hiburan','expense'],['Tabungan','expense'],['Lainnya','expense']];
  for (const [name, type] of defaults) {
    await pool.query('INSERT IGNORE INTO categories(user_id,name,type) VALUES(?,?,?)', [user.id, name, type]);
  }
  return user.id;
}
