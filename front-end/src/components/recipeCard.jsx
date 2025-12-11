import React from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../style/recipe-list.css";
import SaveButton from "./saveButton";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="card-wrapper">
      <Link to={`/recipe/${recipe._id || recipe.recipeId}`} className="card-link">
        <div className="card">
          <h3>{recipe.recipe_name}</h3>
          <img src={recipe.img_src} alt={recipe.recipe_name} />
          <p><strong>Rating:</strong> {recipe.rating} ⭐</p>
          {recipe.yield ? (
            <p><strong>Servings Yield:</strong> {recipe.yield}</p>
          ) : null}
        </div>
      </Link>

      
      <SaveButton recipeId={recipe._id || recipe.recipeId} />

    </div>
  );
};

export default RecipeCard;
