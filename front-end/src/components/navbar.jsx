import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const styles = {
    navbar: {
      width: "100%",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "15px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    brand: {
      fontSize: "24px",
      fontWeight: "bold",
    },
    navLinks: {
      display: "flex",
      gap: "20px",
      listStyleType: "none",
      margin: 0,
      padding: 0,
    },
    link: {
      color: "#fff",
      textDecoration: "none",
      fontSize: "16px",
      cursor: "pointer",
      transition: "color 0.2s",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>Recipe Finder</div>
      <ul style={styles.navLinks}>
        <li>
          <Link to="/" style={styles.link}>HomePage</Link>
        </li>
        <li>
          <Link to="/favorites" style={styles.link}>Favorite Recipes</Link>
        </li>
        <li>
          <Link to="/account" style={styles.link}>Account Settings</Link>
        </li>
        <li>
          <Link to="/add-recipe" style={styles.link}>Add Recipe</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
