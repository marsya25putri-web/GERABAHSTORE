import Header from "../components/header";
import Footer from "../components/footer";
import "../dist/css/kontak.css";

const KontakPage = () => {
  return (
    <>
      <Header />

      <div className="kontak-container">
        <h2 className="kontak-title">Kontak Kami 💌</h2>
        <p className="kontak-subtitle">
          Kami senang mendengar cerita dan pertanyaan darimu
        </p>

        <div className="kontak-content">
          <p>📍 <strong>Alamat:</strong> Ponorogo, Jawa Timur</p>
          <p>📞 <strong>WhatsApp:</strong> 0895 2408 5894</p>
          <p>📸 <strong>Instagram:</strong> @pottery.nevaa</p>
          <p>💬 <em>DM terbuka untuk kolaborasi & pesanan khusus ✨</em></p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default KontakPage;
