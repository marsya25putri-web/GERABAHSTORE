import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../dist/css/dashboard.css";
import Header from "../components/header";
import Footer from "../components/footer";

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams(); // ambil id kategori dari URL

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((response) => {
        console.log("Response dari API:", response); // 🔍 Cek struktur
        
        // ✅ PERBAIKAN: Ambil data dari response.data
        if (response.success && Array.isArray(response.data)) {
          let productData = response.data;
          
          // jika ada id kategori → filter produk
          if (id) {
            productData = productData.filter(
              (product) => String(product.category_id) === id
            );
          }
          
          setProducts(productData);
        } else {
          console.error("Format response salah:", response);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetch products:", err);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="dashboard-container">
          <p style={{ textAlign: "center", padding: "50px" }}>Loading produk...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="dashboard-container" id="home">
        <div className="dashboard-header">
          <h2 className="welcome-title">
            Hallo! Selamat datang, {user?.name || "User"} ༘˚⋆𐙚｡⋆𖦹.✧˚
          </h2>
          <p className="welcome-subtitle">
            Perpaduan kualitas, serta estetika kami sajikan!
          </p>
        </div>

        {/* ✅ Cek apakah products ada dan array */}
        {products.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px" }}>
            {id ? "Tidak ada produk di kategori ini" : "Belum ada produk"}
          </p>
        ) : (
          <div className="products-grid" id="produk">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                {product.stock === 0 && (
                  <span className="product-badge">Habis</span>
                )}

                <div className="product-image-wrapper">
                  <img
                    src={
                      product.image
                        ? `http://localhost:3001/images/${product.image}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=Error";
                    }}
                  />
                </div>

                <div className="product-body">
                  <h3 className="product-name">{product.name}</h3>

                  <p className="product-price">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </p>

                  <p className="product-desc">
                    {product.description ||
                      "Gerabah handmade dengan sentuhan estetik ✨"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default DashboardPage;