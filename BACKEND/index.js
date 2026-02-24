import express from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// ===== FIX __dirname (WAJIB untuk ESM) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== STATIC IMAGE SERVER =====
// folder: BACKEND/images
app.use("/images", express.static(path.join(__dirname, "images")));

// ===== DATABASE =====
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "toko_gerabah",
  password: "postgres",
  port: 5432,
});

// ================= LOGIN =================
app.post("/api/login", async (req, res) => {
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= PRODUCTS =================
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        category_id,
        name,
        price,
        stock,
        description,
        image
      FROM products
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
});

// ================= RUN SERVER =================
app.listen(3001, () => {
  console.log("API running di http://localhost:3001");
});
