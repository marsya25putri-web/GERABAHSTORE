import express from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
const app = express();

// ===== FIX __dirname (WAJIB untuk ESM) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json()); // PARSE JSON BODY
app.use("/images", express.static(path.join(__dirname, "images")));

// ===== DATABASE =====
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "toko_gerabah",
  password: "postgres",
  port: 5432,
});

// ===== REGISTER =====
app.post("/api/register", async (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }

  const { username, password } = req.body;
  // Gunakan username sebagai name jika name tidak dikirim
  const name = username; 

  try {
    const checkUser = await pool.query(
      "SELECT id FROM users WHERE username=$1",
      [username]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Username sudah dipakai" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // PERBAIKAN: Ganti 'user' menjadi 'cashier' sesuai constraint database
    const result = await pool.query(
      `INSERT INTO users (name, username, password, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, username, role`,
      [name, username, hashedPassword, 'kasir', true] // 'user' diganti 'cashier'
    );

    res.json({
      message: "Register berhasil 🎉",
      user: result.rows[0],
    });

  } catch (err) {
    console.error("Error register:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// ===== LOGIN =====
app.post("/api/login", async (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }

  const { username, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT id, name, username, password, role
       FROM users
       WHERE username=$1
       AND is_active=true`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Login gagal" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Login gagal" });
    }

    delete user.password;
    res.json({ user });

  } catch (err) {
    console.error("Error login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== PRODUCTS =====
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, category_id, name, price, stock, description, image
      FROM products
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error get products:", err);
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
});

// ===== RUN SERVER =====
app.listen(3001, () => {
  console.log("✅ API running di http://localhost:3001");
  console.log("📦 Database: PostgreSQL - toko_gerabah");
});