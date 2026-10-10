// Koneksi MySQL lokal + pembuatan tabel otomatis saat server dev pertama jalan.
import mysql, { type Pool } from 'mysql2/promise';

export type CrmEnv = {
  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MYSQL_DATABASE: string;
  OWNER_PASSWORD: string;
  SESSION_SECRET: string;
};

let pool: Pool | null = null;
let ready: Promise<void> | null = null;
let config: CrmEnv | null = null;

export function configureCrm(env: Record<string, string | undefined>) {
  config = {
    MYSQL_HOST: env.MYSQL_HOST || '127.0.0.1',
    MYSQL_PORT: Number(env.MYSQL_PORT || 3306),
    MYSQL_USER: env.MYSQL_USER || 'root',
    MYSQL_PASSWORD: env.MYSQL_PASSWORD || '',
    MYSQL_DATABASE: env.MYSQL_DATABASE || 'alfariz_crm',
    OWNER_PASSWORD: env.OWNER_PASSWORD || '',
    SESSION_SECRET: env.SESSION_SECRET || '',
  };
}

export function crmConfig(): CrmEnv {
  if (!config) configureCrm(process.env);
  return config!;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    category VARCHAR(20) NOT NULL DEFAULT 'alacarte',
    price INT NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL DEFAULT '',
    badge VARCHAR(20) NOT NULL DEFAULT '',
    spice_supported TINYINT NOT NULL DEFAULT 1,
    is_active TINYINT NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    created_at VARCHAR(30) NOT NULL,
    updated_at VARCHAR(30) NOT NULL
  ) DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    customer_name VARCHAR(60) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL DEFAULT '',
    source VARCHAR(10) NOT NULL DEFAULT 'website',
    status VARCHAR(12) NOT NULL DEFAULT 'baru',
    payment_status VARCHAR(24) NOT NULL DEFAULT 'belum_bayar',
    payment_method VARCHAR(60) NOT NULL DEFAULT '',
    notes VARCHAR(300) NOT NULL DEFAULT '',
    subtotal INT NOT NULL,
    tax INT NOT NULL,
    total INT NOT NULL,
    created_at VARCHAR(30) NOT NULL,
    updated_at VARCHAR(30) NOT NULL,
    INDEX idx_orders_created (created_at),
    INDEX idx_orders_status (status)
  ) DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(80) NULL,
    name VARCHAR(80) NOT NULL,
    unit_price INT NOT NULL,
    qty INT NOT NULL,
    options VARCHAR(300) NOT NULL DEFAULT '',
    line_total INT NOT NULL,
    INDEX idx_items_order (order_id)
  ) DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS order_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    kind VARCHAR(10) NOT NULL,
    value VARCHAR(24) NOT NULL,
    created_at VARCHAR(30) NOT NULL,
    INDEX idx_events_order (order_id)
  ) DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS settings (
    k VARCHAR(40) PRIMARY KEY,
    v TEXT NOT NULL
  ) DEFAULT CHARSET=utf8mb4`,
];

const SEED_PRODUCTS: [string, string, string, number, string, string, string, number, number][] = [
  ['paket-geprek-nasi', 'Paket Geprek + Nasi', 'paket', 17000, 'Ayam krispi fillet geprek sambel ijo uleg dadakan + nasi putih pulen hangat + lalapan timun segar.', '/menu/paket-geprek-nasi.jpg', 'BEST SELLER', 1, 1],
  ['ayam-geprek-saja', 'Ayam Geprek Saja', 'alacarte', 15000, '1 potong ayam krispi jumbo berbalut sambel ijo cabai rawit pedas gurih tanpa nasi + lalapan.', '/menu/ayam-geprek-saja.jpg', 'ALACARTE', 1, 2],
  ['geprek-original', 'Geprek Original', 'alacarte', 13000, 'Ayam geprek krispi dengan sambel ijo uleg pedas khas Al-Fariz di atas daun pisang segar.', '/menu/geprek-original.jpg', 'FAVORIT', 1, 3],
  ['geprek-extra-crispy', 'Geprek Extra Crispy', 'alacarte', 15000, 'Ayam goreng crispy super renyah double coating, disiram sambel ijo uleg dadakan cabai rawit hijau.', '/menu/geprek-extra-crispy.png', 'NEW', 1, 4],
  ['extra-sambel', 'Extra Sambel Ijo', 'tambahan', 3000, 'Tambahan sambel ijo uleg dadakan per porsi.', '', '', 0, 10],
  ['tambah-nasi', 'Tambah Nasi Pulen', 'tambahan', 5000, 'Tambahan nasi putih pulen hangat per porsi.', '', '', 0, 11],
];

async function init() {
  const c = crmConfig();
  // Buat database-nya dulu kalau belum ada. Di hosting (cPanel) user MySQL
  // biasanya tidak boleh CREATE DATABASE, jadi database dibuat lewat cPanel
  // dan langkah ini dilewati kalau ditolak.
  try {
    const boot = await mysql.createConnection({
      host: c.MYSQL_HOST,
      port: c.MYSQL_PORT,
      user: c.MYSQL_USER,
      password: c.MYSQL_PASSWORD,
    });
    await boot.query(`CREATE DATABASE IF NOT EXISTS \`${c.MYSQL_DATABASE.replace(/`/g, '')}\` CHARACTER SET utf8mb4`);
    await boot.end();
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === 'ECONNREFUSED') throw e;
  }

  pool = mysql.createPool({
    host: c.MYSQL_HOST,
    port: c.MYSQL_PORT,
    user: c.MYSQL_USER,
    password: c.MYSQL_PASSWORD,
    database: c.MYSQL_DATABASE,
    connectionLimit: 8,
    decimalNumbers: true,
  });
  for (const sql of SCHEMA) await pool.query(sql);
  const ts = new Date().toISOString();
  for (const p of SEED_PRODUCTS) {
    await pool.execute(
      `INSERT IGNORE INTO products (id, name, category, price, description, image_url, badge, spice_supported, sort_order, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [...p, ts, ts],
    );
  }
  for (const [k, v] of [
    ['tax_percent', '11'],
    ['accepting_orders', '1'],
    ['whatsapp', '628973816530'],
    ['store_name', 'Ayam Geprek Sambel Ijo Al-Fariz'],
  ]) {
    await pool.execute('INSERT IGNORE INTO settings (k, v) VALUES (?, ?)', [k, v]);
  }
}

export async function db(): Promise<Pool> {
  if (!ready) {
    ready = init().catch((e) => {
      ready = null; // coba lagi di request berikutnya (mis. MySQL baru dinyalakan)
      throw e;
    });
  }
  await ready;
  return pool!;
}
