import React, { useState } from "react";

const AddRecipe = () => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [rating, setRating] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (/\d/.test(name)) {
      newErrors.name = "Name cannot contain numbers";
    }

    if (!ingredients.trim()) {
      newErrors.ingredients = "Ingredients are required";
    } else if (/\d/.test(ingredients)) {
      newErrors.ingredients = "Ingredients cannot contain numbers";
    }

    if (!rating || isNaN(rating) || rating < 0 || rating > 5) {
      newErrors.rating = "Rating must be a number between 0 and 5";
    }

    if (hours < 0 || minutes < 0 || minutes > 59) {
      newErrors.time = "Invalid time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const recipe = {
      name,
      ingredients,
      rating: parseFloat(rating),
      timeToMake: `${hours}hr ${minutes}min`,
    };

    try {
      const res = await fetch("http://localhost:3000/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });
      if (!res.ok) throw new Error("Failed to add recipe");

      setSuccessMessage("Recipe added successfully!");
      setName("");
      setIngredients("");
      setRating("");
      setHours(0);
      setMinutes(0);
      setErrors({});
    } catch (err) {
      console.error(err);
      setSuccessMessage("Error adding recipe");
    }
  };

  const styles = {
    container: { maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
    inputGroup: { marginBottom: "15px" },
    label: { display: "block", marginBottom: "5px", fontWeight: "bold" },
    input: { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" },
    error: { color: "red", fontSize: "14px" },
    button: { padding: "10px 15px", border: "none", backgroundColor: "#007bff", color: "#fff", borderRadius: "5px", cursor: "pointer" },
    success: { color: "green", marginBottom: "10px" },
    timeContainer: { display: "flex", gap: "10px", alignItems: "center" },
    numberInput: { width: "80px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" },
  };

  return (
    <div style={styles.container}>
      <h2>Add New Recipe</h2>
      {successMessage && <div style={styles.success}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          {errors.name && <div style={styles.error}>{errors.name}</div>}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Ingredients</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            style={styles.input}
          />
          {errors.ingredients && <div style={styles.error}>{errors.ingredients}</div>}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={styles.input}
          />
          {errors.rating && <div style={styles.error}>{errors.rating}</div>}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Time to Make</label>
          <div style={styles.timeContainer}>
            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              style={styles.numberInput}
            />
            <span>hr</span>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              style={styles.numberInput}
            />
            <span>min</span>
          </div>
          {errors.time && <div style={styles.error}>{errors.time}</div>}
        </div>

        <button type="submit" style={styles.button}>Add Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
