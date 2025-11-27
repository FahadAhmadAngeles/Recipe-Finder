import React, { useState, useEffect } from "react";

const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:3000/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Error fetching recipes:", err));
  }, []);

  // Pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);

  const styles = {
    body: {
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      paddingTop: "70px", 
      margin: 0,
      fontFamily: "Arial, sans-serif",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "20px",
    },
    card: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "15px",
      background: "#fff",
      color: "#000",
      boxShadow: "0 0px 0px rgba(0,0,0,0)",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    cardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    },
    pagination: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      alignItems: "center",
    },
    button: {
      padding: "8px 15px",
      border: "none",
      backgroundColor: "#007bff",
      color: "white",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    buttonDisabled: {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
  };

  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {currentRecipes.map((recipe) => (
            <div
              key={recipe.recipeId}
              style={hoveredCard === recipe.recipeId ? { ...styles.card, ...styles.cardHover } : styles.card}
              onMouseEnter={() => setHoveredCard(recipe.recipeId)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3>{recipe.name}</h3>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
              <p><strong>Rating:</strong> {recipe.rating} ⭐</p>
              <p><strong>Time:</strong> {recipe.timeToMake}</p>
            </div>
          ))}
        </div>

        {recipes.length > recipesPerPage && (
          <div style={styles.pagination}>
            <button
              style={currentPage === 1 ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              style={currentPage === totalPages ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesList;
