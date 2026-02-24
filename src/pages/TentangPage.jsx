import Header from "../components/header";
import Footer from "../components/footer";
import "../dist/css/about.css";

const TentangPage = () => {
  return (
    <>
      <Header />

      <section className="about-section">
        <div className="about-container">
          <h1 className="about-title">Tentang Kami</h1>

          <p className="about-text">
            Neva's Lume Pottery merupakan penyedia gerabah berkualitas yang
            menghadirkan perpaduan antara keindahan seni dan sentuhan desain
            modern.
          </p>

          <p className="about-text">
            Kami menyediakan berbagai produk gerabah seperti vas, piring,
            cangkir, dan pot yang dirancang dengan gaya elegan serta
            memperhatikan detail pada setiap proses pembuatannya.
          </p>

          <p className="about-text">
            Setiap produk dibuat menggunakan material pilihan dan melalui
            proses pengerjaan yang teliti, sehingga menghasilkan gerabah yang
            kuat, fungsional, dan bernilai estetika tinggi.
          </p>

          <p className="about-text">
            Kami berkomitmen untuk menghadirkan produk terbaik yang tidak hanya
            memperindah ruangan, tetapi juga memberikan kepuasan bagi setiap
            pelanggan.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TentangPage;
