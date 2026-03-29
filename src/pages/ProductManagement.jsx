import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, 
  FaHome, FaBox, FaTags, FaHeart, FaUser 
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import "./ProductManagement.css";

import ProductTable from "../components/ProductTable";
import ProductForm from "../components/productForm";
import SearchBar from "../components/searchBar";
import { useProducts } from "../hooks/useProducts";

const ProductManagement = () => {
  const {
    products,
    loading,
    pagination,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByCategory,
    changePage,
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/categories");
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([
          { id: 1, name: "Gerabah" },
          { id: 2, name: "Keramik" },
          { id: 3, name: "Lainnya" }
        ]);
      }
    };
    fetchCategories();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSubmitForm = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success("Produk berhasil diupdate! ✨");
      } else {
        await addProduct(formData);
        toast.success("Produk berhasil ditambahkan! 🌸");
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error submit form:", error);
      toast.error(error.message || "Gagal menyimpan produk");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini? 💭")) {
      try {
        await deleteProduct(id);
        toast.success("Produk berhasil dihapus! 🗑️");
      } catch (error) {
        console.error("Error delete product:", error);
        toast.error(error.message || "Gagal menghapus produk");
      }
    }
  };

  const handleSearch = (term) => {
    searchProducts(term);
  };

  const handleCategoryFilter = (categoryId) => {
    filterByCategory(categoryId);
  };

  return (
    <>
      <Header />
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#fff0e6',
          color: '#5e4b56',
          fontFamily: 'Poppins, sans-serif',
          borderRadius: '20px',
        },
        iconTheme: {
          primary: '#ffb7c5',
          secondary: '#fff',
        },
      }} />
      
      <div className="products-management-container">
        <div className="dashboard-layout">
          {/* Sidebar Navigation */}
          <aside className="sidebar">
            <div className="sidebar-logo">
              <h2>🌸 Neva's Lume</h2>
              <p>Product Management</p>
            </div>
            <ul className="sidebar-menu">
              <li>
                <NavLink to="/dashboard">
                  <FaHome /> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/products" className="active">
                  <FaBox /> Manajemen Produk
                </NavLink>
              </li>
              <li>
                <NavLink to="/categories">
                  <FaTags /> Kategori
                </NavLink>
              </li>
              <li>
                <NavLink to="/tentang">
                  <FaHeart /> Tentang Kami
                </NavLink>
              </li>
              <li>
                <NavLink to="/kontak">
                  <FaUser /> Kontak
                </NavLink>
              </li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <div className="content-header">
              <h1>Manajemen Produk</h1>
              <p>Kelola produk gerabah di Toko Neva's Lume Pottery ! ✨🌸</p>
            </div>

            <div className="toolbar">
              <button onClick={handleAddProduct} className="btn-add">
                <FaPlus /> Tambah Produk Baru
              </button>
              
              <div className="search-filter-wrapper">
                <div className="search-bar">
                  <FaSearch className="search-icon" />
                  <SearchBar onSearch={handleSearch} placeholder="Cari produk..." />
                </div>
                
                <select
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {showForm && (
              <div className="form-card">
                <h2>{editingProduct ? "✎ Edit Produk" : "✦ Tambah Produk Baru"}</h2>
                <ProductForm
                  product={editingProduct}
                  onSubmit={handleSubmitForm}
                  onCancel={handleCloseForm}
                  categories={categories}
                />
              </div>
            )}

            {loading ? (
              <div className="loading-spinner">
                <div>Memuat produk cantik...</div>
              </div>
            ) : (
              <>
                <div className="table-wrapper">
                  <ProductTable
                    products={products}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                </div>
                
                {pagination && pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => changePage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      ← Sebelumnya
                    </button>
                    <span>
                      Halaman {pagination.page} dari {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => changePage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Selanjutnya →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ProductManagement;