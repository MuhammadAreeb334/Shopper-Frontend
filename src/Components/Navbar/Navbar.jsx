import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { ShopContext } from "../../Context/ShopContext";

const Navbar = () => {
  const { getTotalCartItems, updateToken } = useContext(ShopContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  const handleLogout = () => {
    updateToken("");
    // sessionStorage.removeItem("user");
    navigate("/login");
    // If not using a global Auth state, you might need window.location.reload()
    // to force a UI update across the app.
  };

  const menuItems = [
    { label: "Shop", key: "/", path: "/" },
    { label: "Men", key: "/mens", path: "/mens" },
    { label: "Women", key: "/womens", path: "/womens" },
    { label: "Kids", key: "/kids", path: "/kids" },
  ];

  return (
    <nav className="navbar">
      <div
        className="nav-logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="Shopper logo" />
        <p>SHOPPER</p>
      </div>

      <div
        className="mobile-menu-icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      <ul
        className={`nav-menu ${isMobileMenuOpen ? "mobile-menu-active" : ""}`}
      >
        {menuItems.map(({ label, key, path }) => (
          <li
            key={key}
            className={location.pathname === path ? "active" : ""}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Link to={path} className="nav-links">
              {label}
            </Link>
            {location.pathname === path && <hr />}
          </li>
        ))}
      </ul>

      <div className="nav-login-cart">
        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}

        <div className="cart-container">
          <Link to="/cart">
            <FaShoppingCart size={28} color="#515151" />
          </Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
