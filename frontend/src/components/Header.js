import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">

      <div className="container nav">
        <div className="logo"><Link to="/">MyRestaurant</Link></div>
        <nav className="nav-links">
          <Link to="/">Menu</Link>
          <Link to="/cart">Cart</Link>

          {token ? (
            <button onClick={logout} style={{border:"none",background:"transparent",cursor:"pointer"}}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
