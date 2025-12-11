import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/navbar.css";
import LoginForm from "./loginForm.jsx";
import Registration from "./registerForm.jsx";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginClick = () => setShowLogin(true);
  const handleRegisterClick = () => setShowRegister(true);

  const closeLogin = () => setShowLogin(false);
  const closeRegister = () => setShowRegister(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    closeLogin();
  };

  return (
    <>
      <nav className="navbar">
        <div className="brand">Recipe Finder</div>

        <ul className="navLinks page-links">
          <li><Link to="/" className="link">HomePage</Link></li>
          <li><Link to="/catalogue" className="link">Catalogue</Link></li>
          <li><Link to="/favorites" className="link">Favorite Recipes</Link></li>
          {/* <li><Link to="/add-recipe" className="link">Add Recipe</Link></li> */}
        </ul>

        <div className="account-buttons">
          {!isLoggedIn && (
            <>
              <button className="login-btn-navbar" onClick={handleLoginClick}>
                Login
              </button>
              <button className="login-btn-navbar" onClick={handleRegisterClick}>
                Register
              </button>
            </>
          )}

          {isLoggedIn && (
            <button className="login-btn-navbar" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>

      {showLogin && (
        <LoginForm onLoginSuccess={handleLoginSuccess} onClose={closeLogin} />
      )}

      {showRegister && <Registration onClose={closeRegister} />}
    </>
  );
};

export default Navbar;
