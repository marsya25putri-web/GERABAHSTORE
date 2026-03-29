import pool from "../db.js"; // Asumsi Anda punya db.js atau langsung pake pool dari index.js

// GET semua produk dengan filter, search, pagination
export const getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10, sort = "id", order = "ASC" } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;

    // Filter search
    if (search) {
      query += ` AND p.name ILIKE $${paramIndex}`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Filter category
    if (category) {
      query += ` AND p.category_id = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    // Hitung total data untuk pagination
    const countQuery = query.replace(
      "SELECT p.*, c.name as category_name",
      "SELECT COUNT(*) as total"
    );
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Sorting
    const validSortColumns = ["id", "name", "price", "stock", "created_at"];
    const validOrder = ["ASC", "DESC"];
    
    const sortColumn = validSortColumns.includes(sort) ? sort : "id";
    const sortOrder = validOrder.includes(order.toUpperCase()) ? order : "ASC";
    
    query += ` ORDER BY p.${sortColumn} ${sortOrder}`;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), offset);

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      message: "Produk berhasil diambil",
    });

  } catch (err) {
    console.error("Error get products:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil produk: " + err.message,
    });
  }
};

// GET single product
export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID produk harus berupa angka",
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
        message: "Produk tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Produk berhasil diambil",
    });

  } catch (err) {
    console.error("Error get product by id:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil produk: " + err.message,
    });
  }
};

// CREATE produk dengan upload gambar
export const createProduct = async (req, res) => {
  const { category_id, name, price, stock, description } = req.body;
  
  // Ambil nama file gambar jika ada
  const image = req.file ? req.file.filename : null;

  try {
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
      imageUrl: image ? `/images/${image}` : null,
    });

  } catch (err) {
    console.error("Error create product:", err);
    res.status(500).json({
      success: false,
      message: "Gagal menambah produk: " + err.message,
    });
  }
};

// UPDATE produk
export const updateProduct = async (req, res) => {
  const { category_id, name, price, stock, description } = req.body;
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID produk harus berupa angka",
    });
  }

  try {
    // Cek apakah produk ada
    const checkProduct = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (checkProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    const currentProduct = checkProduct.rows[0];
    
    // Handle gambar baru
    let image = currentProduct.image;
    if (req.file) {
      image = req.file.filename;
      
      // Hapus gambar lama jika ada (optional)
      // fs.unlink(path.join(__dirname, "../images", currentProduct.image), (err) => {});
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
      imageUrl: image ? `/images/${image}` : null,
    });

  } catch (err) {
    console.error("Error update product:", err);
    res.status(500).json({
      success: false,
      message: "Gagal update produk: " + err.message,
    });
  }
};

// DELETE produk
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID produk harus berupa angka",
    });
  }

  try {
    // Cek apakah produk ada
    const checkProduct = await pool.query(
      "SELECT id, image FROM products WHERE id = $1",
      [id]
    );

    if (checkProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    // Hapus gambar dari filesystem (optional)
    // const product = checkProduct.rows[0];
    // if (product.image) {
    //   fs.unlink(path.join(__dirname, "../images", product.image), (err) => {});
    // }

    // Hapus produk
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Produk berhasil dihapus",
    });

  } catch (err) {
    console.error("Error delete product:", err);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus produk: " + err.message,
    });
  }
};