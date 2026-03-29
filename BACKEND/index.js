import express from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const { Pool } = pkg;
const app = express();

// ===== FIX __dirname (WAJIB untuk ESM) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// ===== DATABASE =====
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "toko_gerabah",
  password: "postgres",
  port: 5432,
});

// ===== TEST DATABASE CONNECTION =====
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection error:", err.stack);
  } else {
    console.log("✅ Database connected successfully");
    release();
  }
});

// ===== KONFIGURASI UPLOAD GAMBAR =====
// Pastikan folder images ada
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Konfigurasi storage multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

// Filter file yang diizinkan
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan (jpeg, jpg, png, gif, webp)"));
  }
};

// Inisialisasi multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

// ===== REGISTER =====
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Username dan password wajib diisi" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter"
      });
    }

    // Cek username sudah ada atau belum
    const checkUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: "Username sudah dipakai" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    const result = await pool.query(
      `INSERT INTO users (name, username, password, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, username, role, created_at`,
      [username, username, hashedPassword, "kasir", true]
    );

    res.status(201).json({
      success: true,
      message: "Register berhasil",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("Error register:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error: " + err.message 
    });
  }
});

// ===== LOGIN =====
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Username dan password wajib diisi" 
      });
    }

    // Cari user
    const result = await pool.query(
      `SELECT id, name, username, password, role, created_at
       FROM users
       WHERE username = $1 AND is_active = true`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: "Username atau password salah" 
      });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Username atau password salah" 
      });
    }

    // Hapus password dari response
    delete user.password;

    res.json({
      success: true,
      message: "Login berhasil",
      data: user
    });

  } catch (err) {
    console.error("Error login:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error: " + err.message 
    });
  }
});

// ===== PRODUCTS =====

// GET semua produk (dengan filter dan search)
app.get("/api/products", async (req, res) => {
  try {
    const { search, category } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;

    // Filter search berdasarkan nama
    if (search) {
      query += ` AND p.name ILIKE $${paramIndex}`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Filter berdasarkan kategori
    if (category) {
      query += ` AND p.category_id = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    query += ` ORDER BY p.id ASC`;

    const result = await pool.query(query, queryParams);
    
    res.json({
      success: true,
      data: result.rows,
      message: "Produk berhasil diambil"
    });
    
  } catch (err) {
    console.error("Error get products:", err);
    res.status(500).json({ 
      success: false, 
      message: "Gagal mengambil produk: " + err.message 
    });
  }
});

// GET single product by ID
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  // Validasi ID
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID produk harus berupa angka"
    });
  }

  try {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Produk berhasil diambil"
    });

  } catch (err) {
    console.error("Error get product by id:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil produk: " + err.message
    });
  }
});

// CREATE produk dengan upload gambar
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { category_id, name, price, stock, description } = req.body;
    
    // Validasi input
    if (!name || name.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        message: "Nama produk wajib diisi" 
      });
    }

    if (!price || price <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Harga harus diisi dan lebih dari 0" 
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Stok tidak boleh negatif" 
      });
    }

    // Ambil nama file gambar jika ada
    const image = req.file ? req.file.filename : null;

    const result = await pool.query(
      `INSERT INTO products
      (category_id, name, price, stock, description, image, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *`,
      [
        category_id || null,
        name.trim(),
        price,
        stock || 0,
        description || null,
        image,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Produk berhasil ditambahkan",
      imageUrl: image ? `/images/${image}` : null
    });
    
  } catch (err) {
    console.error("Error create product:", err);
    res.status(500).json({ 
      success: false, 
      message: "Gagal menambah produk: " + err.message 
    });
  }
});

// UPDATE produk dengan upload gambar
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { category_id, name, price, stock, description } = req.body;
    const { id } = req.params;

    // Validasi ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID produk harus berupa angka"
      });
    }

    // Validasi input
    if (!name || name.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        message: "Nama produk wajib diisi" 
      });
    }

    if (!price || price <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Harga harus diisi dan lebih dari 0" 
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Stok tidak boleh negatif" 
      });
    }

    // Cek apakah produk ada
    const checkProduct = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (checkProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan"
      });
    }

    const currentProduct = checkProduct.rows[0];
    
    // Handle gambar baru
    let image = currentProduct.image;
    if (req.file) {
      image = req.file.filename;
      
      // Hapus gambar lama jika ada (opsional)
      if (currentProduct.image) {
        const oldImagePath = path.join(imagesDir, currentProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    // Update produk
    const result = await pool.query(
      `UPDATE products
       SET category_id = $1,
           name = $2,
           price = $3,
           stock = $4,
           description = $5,
           image = $6,
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        category_id || null,
        name.trim(),
        price,
        stock || 0,
        description || null,
        image,
        id,
      ]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: "Produk berhasil diupdate",
      imageUrl: image ? `/images/${image}` : null
    });

  } catch (err) {
    console.error("Error update product:", err);
    res.status(500).json({ 
      success: false,
      message: "Gagal update produk: " + err.message 
    });
  }
});

// DELETE produk
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  // Validasi ID
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID produk harus berupa angka"
    });
  }

  try {
    // Cek apakah produk ada dan ambil info gambar
    const checkProduct = await pool.query(
      "SELECT id, image FROM products WHERE id = $1",
      [id]
    );

    if (checkProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan"
      });
    }

    const product = checkProduct.rows[0];

    // Hapus gambar dari filesystem jika ada
    if (product.image) {
      const imagePath = path.join(imagesDir, product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Hapus produk dari database
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Produk berhasil dihapus"
    });

  } catch (err) {
    console.error("Error delete product:", err);
    res.status(500).json({ 
      success: false,
      message: "Gagal menghapus produk: " + err.message 
    });
  }
});

// ===== CATEGORIES =====

// GET semua kategori
app.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM categories ORDER BY name ASC
    `);
    
    res.json({
      success: true,
      data: result.rows,
      message: "Kategori berhasil diambil"
    });
    
  } catch (err) {
    console.error("Error get categories:", err);
    res.status(500).json({ 
      success: false, 
      message: "Gagal mengambil kategori: " + err.message 
    });
  }
});

// CREATE kategori
app.post("/api/categories", async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Nama kategori wajib diisi"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO categories (name, created_at)
       VALUES ($1, NOW())
       RETURNING *`,
      [name.trim()]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Kategori berhasil ditambahkan"
    });

  } catch (err) {
    console.error("Error create category:", err);
    res.status(500).json({
      success: false,
      message: "Gagal menambah kategori: " + err.message
    });
  }
});

// ===== HANDLE 404 =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint '${req.originalUrl}' dengan method '${req.method}' tidak ditemukan`
  });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  
  // Handle multer error
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File terlalu besar. Maksimal 5MB"
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: "Internal server error: " + err.message
  });
});

// ===== RUN SERVER =====
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 ================================`);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📌 http://localhost:${PORT}`);
  console.log(`📦 Database: PostgreSQL - toko_gerabah`);
  console.log(`📂 Upload folder: ${imagesDir}`);
  console.log(`================================\n`);
});