import React, { useState } from "react";
import "../style/loginForm.css";

const Registration = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !username.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (password.length() < 6 || password.length() > 30) {
      alert("Password must be between 6 and 30 characters");
      return;
    }
    
    if (username.length() < 6 || username.length() > 20) {
      alert("Username must be between 6 and 20 characters");
      return;
    }

    const newUser = {
      email,
      password,
      username,
      role: role || "user",
    };

    try {
      const res = await fetch("http://localhost:3000/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Registration successful!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating account");
    }
  };

  return (
    <div className="lightbox-overlay">
      <form className="login-box" onSubmit={handleSubmit}>
        <button type="button" className="close-login" onClick={onClose}>
          ✕ Close
        </button>

        <h2>Register</h2>

        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="example@gmail.com"
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

        {/*  <div className="input-group">
          <label>Role (optional):</label>
          <input
            type="text"
            placeholder="admin or user"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>*/}
       

        <button className="login-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Registration;
