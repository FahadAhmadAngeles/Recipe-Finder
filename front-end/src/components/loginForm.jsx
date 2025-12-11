import React, { useState } from "react";
import "../style/loginForm.css";

const LoginForm = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const res = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    onLoginSuccess(data.token); // <-- parent handles setting token + closing
  };

  return (
    <div className="lightbox-overlay">
      <form className="login-box" onSubmit={handleSubmit}>
        <button type="button" className="close-login" onClick={onClose}>
          ✕ Close
        </button>

        <h2>Login</h2>

        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="eg. JohnDoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
