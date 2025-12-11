import React, { useState } from "react";
import "../style/addRecipe.css";

const AddRecipe = () => {
  const [recipeName, setRecipeName] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [servings, setServings] = useState();
  const [ingredients, setIngredients] = useState("");
  const [directions, setDirections] = useState("");
  const [rating, setRating] = useState("");
  const [url, setUrl] = useState("");
  const [cuisinePath, setCuisinePath] = useState("");
  const [nutrition, setNutrition] = useState("");
  const [timing, setTiming] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!recipeName.trim()) newErrors.recipeName = "Recipe name is required";
    if (!ingredients.trim()) newErrors.ingredients = "Ingredients are required";
    if (!directions.trim()) newErrors.directions = "Directions are required";
    if (!rating || isNaN(rating) || rating < 0 || rating > 5) newErrors.rating = "Rating must be 0-5";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const recipe = {
      recipe_name: recipeName,
      prep_time: prepTime,
      cook_time: cookTime,
      total_time: totalTime,
      servings,
      ingredients,
      directions,
      rating: parseFloat(rating),
      url,
      cuisine_path: cuisinePath,
      nutrition,
      timing
    };

    try {
      const res = await fetch("http://localhost:3000/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe)
      });

      if (!res.ok) throw new Error("Failed to add recipe");

      setSuccessMessage("Recipe added successfully!");
      setRecipeName(""); setPrepTime(""); setCookTime(""); setTotalTime(""); setServings("");
      setIngredients(""); setDirections(""); setRating(""); setUrl(""); setCuisinePath("");
      setNutrition(""); setTiming("");
      setErrors({});
    } catch (err) {
      console.error(err);
      setSuccessMessage("Error adding recipe");
    }
  };

  return (
    <div className="add-recipe-container">
      <h2>Add New Recipe</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Recipe Name*</label>
          <input
            value={recipeName}
            onChange={e => setRecipeName(e.target.value)}
            placeholder="Apple Pie by Grandma Ople"
          />
          {errors.recipeName && <div className="error">{errors.recipeName}</div>}
        </div>

        <div className="input-group">
          <label>Prep Time</label>
          <input
            value={prepTime}
            onChange={e => setPrepTime(e.target.value)}
            placeholder="30 mins"
          />
        </div>

        <div className="input-group">
          <label>Cook Time</label>
          <input
            value={cookTime}
            onChange={e => setCookTime(e.target.value)}
            placeholder="1 hr"
          />
        </div>

        <div className="input-group">
          <label>Total Time</label>
          <input
            value={totalTime}
            onChange={e => setTotalTime(e.target.value)}
            placeholder="1 hr 30 mins"
          />
        </div>

        <div className="input-group">
          <label>Servings</label>
          <input
            value={servings}
            onChange={e => setServings(e.target.value)}
            placeholder="8"
          />
        </div>

        <div className="input-group">
          <label>Ingredients*</label>
          <textarea
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            placeholder="8 small Granny Smith apples, ½ cup unsalted butter, 3 tablespoons all-purpose flour, ½ cup white sugar, ½ cup brown sugar, ¼ cup water, 1 (9 inch) double-crust pie pastry, thawed"
          />
          {errors.ingredients && <div className="error">{errors.ingredients}</div>}
        </div>

        <div className="input-group">
          <label>Directions*</label>
          <textarea
            value={directions}
            onChange={e => setDirections(e.target.value)}
            placeholder="Peel and core apples, then thinly slice. Preheat oven to 425°F. Melt butter and add flour, sugars, and water. Prepare pie crust, assemble lattice, pour mixture, and bake as instructed."
          />
          {errors.directions && <div className="error">{errors.directions}</div>}
        </div>

        <div className="input-group">
          <label>Rating*</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            value={rating}
            onChange={e => setRating(e.target.value)}
            placeholder="4.8"
          />
          {errors.rating && <div className="error">{errors.rating}</div>}
        </div>

        <div className="input-group">
          <label>Source URL</label>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/apple-pie-recipe"
          />
        </div>

        <div className="input-group">
          <label>Cuisine Path</label>
          <input
            value={cuisinePath}
            onChange={e => setCuisinePath(e.target.value)}
            placeholder="/Desserts/Pies/Apple Pie Recipes/"
          />
        </div>

        <div className="input-group">
          <label>Nutrition</label>
          <textarea
            value={nutrition}
            onChange={e => setNutrition(e.target.value)}
            placeholder="Total Fat 19g, Saturated Fat 9g, Cholesterol 31mg, Sodium 124mg, Total Carbs 52g, Fiber 3g, Protein 2g"
          />
        </div>

        <div className="input-group">
          <label>Timing</label>
          <textarea
            value={timing}
            onChange={e => setTiming(e.target.value)}
            placeholder="Prep Time: 30 mins, Cook Time: 1 hr, Total Time: 1 hr 30 mins, Servings: 8, Yield: 1 9-inch pie"
          />
        </div>

        <button type="submit" className="add-recipe-button">Add Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
