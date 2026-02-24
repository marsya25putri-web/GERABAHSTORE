import { NavLink, useNavigate } from "react-router-dom";
import "./header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      {/* LEFT - LOGO */}
      <div className="header-left">
        <span className="logo-icon">☽</span>
        <span className="logo-text">Neva's Lume Pottery</span>
      </div>

      {/* CENTER - MENU */}
      <nav className="header-nav">
        <NavLink to="/dashboard" className="nav-link">
          Produk
        </NavLink>
        <NavLink to="/tentang" className="nav-link">
          Tentang Kami
        </NavLink>
        <NavLink to="/kontak" className="nav-link">
          Kontak
        </NavLink>
      </nav>

      {/* RIGHT - LOGOUT */}
      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
