import { pool } from './index.js';

export async function ensureDemoDatabase() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100) NOT NULL,email VARCHAR(255) NOT NULL UNIQUE,password_hash VARCHAR(255) NOT NULL DEFAULT '') ENGINE=InnoDB`);
  await pool.query(`CREATE TABLE IF NOT EXISTS categories(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,name VARCHAR(100) NOT NULL,type ENUM('income','expense') NOT NULL,UNIQUE KEY categories_user_type_name(user_id,type,name)) ENGINE=InnoDB`);
  await pool.query(`CREATE TABLE IF NOT EXISTS transactions(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,category_id INT NOT NULL,type ENUM('income','expense') NOT NULL,amount DECIMAL(12,2) NOT NULL,transaction_date DATE NOT NULL,description VARCHAR(255),INDEX transactions_user_date(user_id,transaction_date)) ENGINE=InnoDB`);
  await pool.query(`CREATE TABLE IF NOT EXISTS savings_goals(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,name VARCHAR(150) NOT NULL,target_amount DECIMAL(12,2) NOT NULL,saved_amount DECIMAL(12,2) NOT NULL DEFAULT 0,target_date DATE NULL,description VARCHAR(255)) ENGINE=InnoDB`);

  const [duplicates] = await pool.query(`SELECT duplicate.id AS duplicate_id, original.id AS keep_id
    FROM categories duplicate
    JOIN categories original
      ON original.user_id = duplicate.user_id
     AND original.type = duplicate.type
     AND LOWER(TRIM(original.name)) = LOWER(TRIM(duplicate.name))
     AND original.id < duplicate.id`);

  for (const duplicate of duplicates) {
    await pool.query('UPDATE transactions SET category_id=? WHERE category_id=?', [duplicate.keep_id, duplicate.duplicate_id]);
    await pool.query('DELETE FROM categories WHERE id=?', [duplicate.duplicate_id]);
  }

  await pool.query('UPDATE categories SET name=TRIM(name)');

  const [indexes] = await pool.query("SHOW INDEX FROM categories WHERE Key_name = 'categories_user_type_name'");
  if (!indexes.length) {
    await pool.query('ALTER TABLE categories ADD UNIQUE INDEX categories_user_type_name (user_id, type, name)');
  }

  await pool.query("INSERT IGNORE INTO users(name,email,password_hash) VALUES('Pengguna Demo','demo@velora.local','')");
  const [[user]] = await pool.query("SELECT id FROM users WHERE email='demo@velora.local' LIMIT 1");
  const defaults = [['Uang jajan','income'],['Hadiah','income'],['Hasil kerja','income'],['Lainnya','income'],['Makanan dan minuman','expense'],['Transportasi','expense'],['Sekolah','expense'],['Belanja','expense'],['Hiburan','expense'],['Tabungan','expense'],['Lainnya','expense']];
  for (const [name, type] of defaults) {
    await pool.query('INSERT IGNORE INTO categories(user_id,name,type) VALUES(?,?,?)', [user.id, name, type]);
  }
  await ensureUserCategories(user.id);
  return user.id;
}

export async function ensureUserCategories(userId) {
  const defaults = [['Uang jajan','income'],['Hadiah','income'],['Hasil kerja','income'],['Lainnya','income'],['Makanan dan minuman','expense'],['Transportasi','expense'],['Sekolah','expense'],['Belanja','expense'],['Hiburan','expense'],['Tabungan','expense'],['Lainnya','expense']];
  const [categories] = await pool.query('SELECT id,name,type FROM categories WHERE user_id=? ORDER BY id',[userId]);
  const keepers = new Map();

  for (const category of categories) {
    const key = `${category.type}:${String(category.name).trim().toLowerCase()}`;
    const keeper = keepers.get(key);
    if (!keeper) {
      keepers.set(key, category);
    } else {
      await pool.query('UPDATE transactions SET category_id=? WHERE category_id=? AND user_id=?',[keeper.id,category.id,userId]);
      await pool.query('DELETE FROM categories WHERE id=? AND user_id=?',[category.id,userId]);
    }
  }

  for (const [name, type] of defaults) {
    const key = `${type}:${name.toLowerCase()}`;
    if (!keepers.has(key)) {
      await pool.query('INSERT IGNORE INTO categories(user_id,name,type) VALUES(?,?,?)',[userId,name,type]);
    }
  }
}
