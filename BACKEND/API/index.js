const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Koneksi ke Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'Backend GERABAHSTORE berjalan di Vercel!' });
});

// Contoh route ambil data products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export buat Vercel (INI PENTING!)
module.exports = app;