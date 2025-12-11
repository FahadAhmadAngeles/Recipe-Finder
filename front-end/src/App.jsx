import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import RecipePage from "./components/recipePage";
import TopRecipesPage from "./components/recipe-list";
import AddRecipe from "./components/addRecipe";
import "./App.css";
import jwt_decode from "jwt-decode";
import Pagination from "./components/pagination";

const AccountSettings = () => <div>Account Settings Page</div>;

const App = () => {
   const [userId, setUserId] = useState(null);

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return;

       try {
          const decoded = jwt_decode(token);
            setUserId(decoded.userId);
       } catch (err) {
         console.error("Invalid token", err);
       }

  }, []);

 const appStyle = {
    backgroundColor: "#ffffff",
    minWidth: "100vw",
    margin: 0,
    fontFamily: "Arial, sans-serif",
  };

  return (
    <div style={appStyle}>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TopRecipesPage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/favorites" element={userId ? <Pagination endpoint={`/users/${userId}/savedList`} title={"Favorite Recipes"} /> : <div>Please log in to view favorites</div>} />
        <Route path="/catalogue" element={<Pagination endpoint={"/recipes"} title={"Catalogue"} />} />
        <Route path="/account" element={<AccountSettings />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
      </Routes>
    </Router>
    </div>
  );
};

export default App;
