import { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "./categories.css";

const CategoriesPage = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter(
          (p) => Number(p.category_id) === Number(activeCategory)
        );

  return (
    <>
      <Header />

      <div className="categories-container">
        <h1 className="categories-title">Kategori Produk</h1>

        <div className="category-buttons">
          <button onClick={() => setActiveCategory("all")}>Semua</button>
          <button onClick={() => setActiveCategory(12)}>Vas</button>
          <button onClick={() => setActiveCategory(2)}>Alat Makan</button>
          <button onClick={() => setActiveCategory(3)}>Dekorasi</button>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              {product.stock === 0 && (
                <span className="product-badge">Habis</span>
              )}

              <img
                src={`http://localhost:3001/images/${product.image}`}
                alt={product.name}
                className="product-image"
              />

              <div className="product-body">
                <h3>{product.name}</h3>

                <p className="price">
                  Rp {Number(product.price).toLocaleString("id-ID")}
                </p>

                <p className="desc">
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

export default CategoriesPage;