import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ cart }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Only apply scroll detection on non-homepage
    if (isHomePage) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } 
      // Hide header when scrolling down (but keep it visible at top)
      else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, isHomePage]);

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out successfully!");
    navigate("/");
  };

  return (
    <header className={`header ${isHomePage ? "homepage" : "other-pages"} ${!isVisible ? "hidden" : ""}`}>
      <nav className="header-nav">
        <Link to="/" className="header-logo">
          <h2>🍽️ Restaurant</h2>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          
          {!isAdmin && (
            <>
              <Link to="/menu">Menu</Link>
              <Link to="/cart">
                Cart 
              </Link>
              {token && <Link to="/orders">My Orders</Link>}
            </>
          )}
          
          {isAdmin && <Link to="/admin">Admin Panel</Link>}
          
          {!token ? (
            <>
              <Link to="/login">Login</Link>
              {/* <Link to="/register">Register</Link> */}
            </>
          ) : (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          )}
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

          {!isAdmin && (
            <>
              <Link to="/menu" onClick={() => setMenuOpen(false)}>
                Menu
              </Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                Cart ({cart?.length || 0})
              </Link>
              {token && (
                <Link to="/orders" onClick={() => setMenuOpen(false)}>
                  My Orders
                </Link>
              )}
            </>
          )}

          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>
              Admin Panel
            </Link>
          )}

          {!token ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <button 
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }} 
              className="logout-btn"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}