export const validateProduct = (req, res, next) => {
  const { name, price, stock, category_id } = req.body;
  const errors = [];

  // Validasi name
  if (!name || name.trim() === "") {
    errors.push("Nama produk wajib diisi");
  } else if (name.length < 3) {
    errors.push("Nama produk minimal 3 karakter");
  } else if (name.length > 100) {
    errors.push("Nama produk maksimal 100 karakter");
  }

  // Validasi price
  if (!price && price !== 0) {
    errors.push("Harga wajib diisi");
  } else if (isNaN(price) || price <= 0) {
    errors.push("Harga harus angka positif");
  }

  // Validasi stock
  if (stock !== undefined && stock !== "") {
    if (isNaN(stock) || stock < 0) {
      errors.push("Stok harus angka positif atau 0");
    }
  }

  // Validasi category_id
  if (category_id && isNaN(category_id)) {
    errors.push("ID kategori harus angka");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validasi gagal",
      errors: errors,
    });
  }

  next();
};