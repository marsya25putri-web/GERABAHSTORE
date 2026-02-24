import { useEffect, useState } from "react";
import "../dist/css/dashboard.css";
import Header from "../components/header";
import Footer from "../components/footer";

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Header />

      <div className="dashboard-container" id="home">
        <div className="dashboard-header">
          <h2 className="welcome-title">
            Hallo! Selamat datang, {user?.name} ༘˚⋆𐙚｡⋆𖦹.✧˚
          </h2>
          <p className="welcome-subtitle">
            Perpaduan kualitas, serta estetika kami sajikan!
          </p>
        </div>

        <div className="products-grid" id="produk">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              {product.stock === 0 && (
                <span className="product-badge">Habis</span>
              )}

              <div className="product-image-wrapper">
                <img
                  src={`http://localhost:3001/images/${product.image}`}
                  alt={product.name}
                  className="product-image"
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
      </div>

      <Footer />
    </>
  );
};

export default DashboardPage;
