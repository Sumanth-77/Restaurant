import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Header.css";

export default function Header({ cart }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`header ${isHomePage ? "transparent" : ""}`}>
      <nav className="header-nav">
        <Link to="/" className="header-logo">
          <h2>🍽️ Restaurant</h2>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/menu" onClick={() => setMenuOpen(false)}>
            Menu
          </Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart
          </Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link to="/register" onClick={() => setMenuOpen(false)}>
            Register
          </Link>
        </div>
      )}
    </header>
  );
}