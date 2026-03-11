import "../dist/css/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const text = await res.text();
console.log("Response:", text);

let data;
try {
  data = JSON.parse(text);
} catch {
  data = { message: text };
}

      if (!res.ok) {
        alert(data.message || "Register gagal");
        return;
      }

      alert("Akun berhasil dibuat 🎉");

      // setelah register kembali ke login
      navigate("/login");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <div className="login-illustration">🪴✨</div>

        <h2 className="login-title">Buat Akun</h2>

        <form onSubmit={handleRegister}>

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

          <button className="login-btn">
            Daftar
          </button>

        </form>

      </div>
    </div>
  );
};

export default RegisterPage;