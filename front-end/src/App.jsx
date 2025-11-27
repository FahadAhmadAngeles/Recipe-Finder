import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import RecipesList from "./components/recipe-list";
import AddRecipe from "./components/addRecipe";

const FavoriteRecipes = () => <div>Your Favorite Recipes</div>;
const AccountSettings = () => <div>Account Settings Page</div>;

const App = () => {

 const appStyle = {
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    margin: 0,
    fontFamily: "Arial, sans-serif",
  };

  return (
    <div style={appStyle}>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<RecipesList />} />
        <Route path="/favorites" element={<FavoriteRecipes />} />
        <Route path="/account" element={<AccountSettings />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
      </Routes>
    </Router>
    </div>
  );
};

export default App;
