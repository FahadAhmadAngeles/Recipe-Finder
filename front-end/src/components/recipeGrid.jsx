// RecipeGrid.jsx
import React from "react";
import RecipeCard from "./recipeCard"; 
import "../style/recipeGrid.css"; 

const RecipeGrid = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <p>No recipes found.</p>;
  }

  return (
    <div className="recipe-grid-container">
      {title && <h2 className="recipe-grid-title">{title}</h2>}
      <div className="recipe-grid">
        {data.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeGrid;
