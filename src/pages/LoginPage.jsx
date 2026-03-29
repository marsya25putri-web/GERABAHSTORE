import "../dist/css/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("Response dari backend:", data); // Debug: lihat struktur response

      // ❌ LOGIN GAGAL
      if (!res.ok) {
        alert(`Login gagal \n${data.message || "Username / Password salah"}`);
        setLoading(false);
        return;
      }

      // ✅ PERBAIKAN: Ambil dari data.data, bukan data.user
      const userData = data.data; // <-- INI YANG DIPERBAIKI
      
      // simpan user ke localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // ambil role user
      const role = userData.role;

      // ✅ LOGIN BERHASIL
      alert(
        `Login berhasil 🌸\n\n` +
        `Halo, ${userData.username}!\n` +
        `Role kamu: ${role ? role.toUpperCase() : 'USER'}`
      );

      // arahkan ke dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Server error 😥");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-illustration">🏺✨</div>
        <h2 className="login-title">neva's pottery</h2>
        <p className="login-subtitle">
          MASUK & PILIH DEKORASI GERABAH FAVORITMU ♡
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login-btn" disabled={loading}>
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Belum punya akun? <Link to="/register">Buat akun</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;