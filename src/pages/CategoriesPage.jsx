import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { 
  FaHome, FaBox, FaTags, FaHeart, FaUser, 
  FaShoppingBag, FaArrowRight, FaStar, FaRegHeart 
} from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";
import "./CategoriesPage.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productCounts, setProductCounts] = useState({});

  // Ambil jumlah produk per kategori
  const fetchProductCounts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/products");
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const counts = {};
        data.data.forEach(product => {
          const categoryId = product.category_id;
          if (categoryId) {
            counts[categoryId] = (counts[categoryId] || 0) + 1;
          }
        });
        setProductCounts(counts);
      }
    } catch (error) {
      console.error("Error fetching product counts:", error);
    }
  };

  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:3001/api/categories")
      .then((res) => res.json())
      .then((response) => {
        console.log("Categories response:", response);
        
        if (response.success && Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (Array.isArray(response)) {
          setCategories(response);
        } else {
          console.error("Format response salah:", response);
          setCategories([]);
          setError("Format data kategori salah");
        }
      })
      .catch((err) => {
        console.error("Error fetch categories:", err);
        setError("Gagal mengambil data kategori");
        setCategories([]);
      })
      .finally(() => setLoading(false));

    // Fetch product counts
    fetchProductCounts();
  }, []);

  // Ikon untuk setiap kategori (random tapi konsisten)
  const getCategoryIcon = (name, index) => {
    const icons = [
      "🏺", "🍶", "🌸", "✨", "🎨", "🌟", "💮", "🏵️", "🌺", "🪴"
    ];
    if (name?.toLowerCase().includes("gerabah")) return "🏺";
    if (name?.toLowerCase().includes("keramik")) return "🍶";
    if (name?.toLowerCase().includes("lainnya")) return "🌸";
    return icons[index % icons.length];
  };

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="categories-container">
          <div className="categories-dashboard-layout">
            <CategoriesSidebar />
            <main className="categories-main-content">
              <div className="categories-header">
                <h1>Kategori Produk</h1>
                <p>Jelajahi koleksi berdasarkan kategori 🌸</p>
              </div>
              <div className="categories-loading">
                <div>Memuat kategori cantik...</div>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!Array.isArray(categories)) {
    return (
      <>
        <Header />
        <div className="categories-container">
          <div className="categories-dashboard-layout">
            <CategoriesSidebar />
            <main className="categories-main-content">
              <div className="categories-header">
                <h1>Kategori Produk</h1>
                <p>Jelajahi koleksi berdasarkan kategori 🌸</p>
              </div>
              <div className="categories-error">
                <div className="categories-error-icon">😔</div>
                <p>Error: Data kategori tidak valid</p>
                <button onClick={handleRefresh}>Coba Lagi</button>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="categories-container">
        <div className="categories-dashboard-layout">
          {/* Sidebar Navigation */}
          <CategoriesSidebar />

          {/* Main Content */}
          <main className="categories-main-content">
            <div className="categories-header">
              <h1>Kategori Produk</h1>
              <p>Jelajahi koleksi gerabah dan keramik berdasarkan kategori ✨🌸</p>
            </div>

            {error && (
              <div className="categories-error">
                <div className="categories-error-icon">⚠️</div>
                <p>{error}</p>
                <button onClick={handleRefresh}>Coba Lagi</button>
              </div>
            )}

            {!error && categories.length === 0 ? (
              <div className="categories-empty">
                <div className="categories-empty-icon">🏷️</div>
                <h3>Belum Ada Kategori</h3>
                <p>Silakan tambahkan kategori terlebih dahulu untuk mulai mengelola produk.</p>
              </div>
            ) : (
              <div className="categories-grid-wrapper">
                <div className="categories-grid">
                  {categories.map((cat, index) => {
                    const productCount = productCounts[cat.id] || 0;
                    return (
                      <Link 
                        to={`/categories/${cat.id}`} 
                        key={cat.id} 
                        className="category-card"
                      >
                        <div className="category-icon">
                          {getCategoryIcon(cat.name, index)}
                        </div>
                        <div className="category-content">
                          <h3>{cat.name}</h3>
                          <p>Koleksi produk {cat.name} berkualitas</p>
                          <div className="category-stats">
                            <span>
                              <FaShoppingBag /> {productCount} Produk
                            </span>
                            <span>
                              <FaStar /> Terlaris
                            </span>
                          </div>
                          <div className="category-link">
                            Lihat Koleksi <FaArrowRight />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Komponen Sidebar terpisah (match dengan Product Management)
const CategoriesSidebar = () => {
  return (
    <aside className="categories-sidebar">
      <div className="categories-sidebar-logo">
        <h2>🌸 Neva's Lume</h2>
        <p>Product Categories</p>
      </div>
      <ul className="categories-sidebar-menu">
        <li>
          <NavLink to="/dashboard">
            <FaHome /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/products">
            <FaBox /> Manajemen Produk
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories" className="active">
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
  );
};

export default CategoriesPage;