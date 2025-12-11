import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import jwt_decode from "jwt-decode";
import "../style/saveButton.css";



const SaveButton = ({ recipeId }) => {
  const [saved, setSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwt_decode(token);
      const uid = decoded.userId; 
      setUserId(uid);
      setIsLoggedIn(true);

      fetch(`http://localhost:3000/users/${uid}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json();
        })
        .then((userData) => {
          const savedList = (userData.savedList || []).map((s) => String(s));
          if (savedList.includes(String(recipeId))) setSaved(true);
        })
        .catch(() => setSaved(false));
    } catch (err) {
      console.error("Invalid token", err);
      setIsLoggedIn(false);
    }
  }, [recipeId]);

  const handleToggle = async () => {
    if (!userId) {
      alert("Please log in to save recipes");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/users/${userId}/savedList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to toggle saved recipe");
        return;
      }

      
      setSaved((prev) => !prev);
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  if (!isLoggedIn) return null;

  return (
    <button className={`save-button ${saved ? "saved" : ""}`} onClick={handleToggle}>
     <FontAwesomeIcon icon={faBookmark} />
    </button>
  );
};

export default SaveButton;
