import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "../style/recipePage.css";
import SaveButton from "./saveButton";
import ReviewButtons from "./reviewButtons";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwt_decode(token);
      setUserId(decoded.userId);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }, []);

  // Fetch recipe and reviews
  useEffect(() => {
    const fetchRecipeAndReviews = async () => {
      try {
        const res = await fetch(`http://localhost:3000/recipes/${id}`);
        const data = await res.json();
        setRecipe(data);

        const reviewsRes = await fetch(`http://localhost:3000/reviews/recipe/${id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch recipe or reviews:", err);
        setLoading(false);
      }
    };
    fetchRecipeAndReviews();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  const display = (val) => (val ? val : "N/A");

  // DELETE REVIEW
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete review");
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT REVIEW
  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowEditForm(true);
  };

  // SAVE EDITED REVIEW
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/${editingReview._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: editingReview.comment }),
      });
      if (!response.ok) throw new Error("Failed to update review");

      const updated = await response.json();
      setReviews((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
      setShowEditForm(false);
      setEditingReview(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ADD REVIEW
  const handleAddReview = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: id, userId, comment: newComment }),
      });
      if (!response.ok) throw new Error("Failed to add review");

      const added = await response.json();
      setReviews((prev) => [...prev, added]);
      setNewComment("");
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="recipe-page">
      <div className="recipe-info">
        <div className="recipe-title-row">
          <h1>{recipe.recipe_name}</h1>
          <SaveButton recipeId={recipe._id || recipe.recipeId} />
        </div>

        <section className="recipe-section">
          <h2>Details</h2>
          <p><strong>Prep Time:</strong> {display(recipe.prep_time)}</p>
          <p><strong>Cook Time:</strong> {display(recipe.cook_time)}</p>
          <p><strong>Total Time:</strong> {display(recipe.total_time)}</p>
          <p><strong>Servings:</strong> {display(recipe.servings)}</p>
          <p><strong>Rating:</strong> {display(recipe.rating)}</p>
          <p><strong>Cuisine:</strong> {display(recipe.cuisine_path)}</p>
          <p>
            <strong>Source URL:</strong>{" "}
            {recipe.url ? <a href={recipe.url}>View Recipe</a> : "N/A"}
          </p>
        </section>

        <section className="recipe-section">
          <h2>Ingredients</h2>
          <p>{display(recipe.ingredients)}</p>
        </section>

        <section className="recipe-section">
          <h2>Directions</h2>
          <p>{display(recipe.directions)}</p>
        </section>

        <section className="recipe-section">
          <h2>Nutrition</h2>
          <p>{display(recipe.nutrition)}</p>
        </section>

        <section className="recipe-section">
          <h2>Timing</h2>
          <p>{display(recipe.timing)}</p>
        </section>

        <section className="recipe-section">
          <h2>Reviews</h2>

          {/* add review button */}
          {isLoggedIn && (
            <div>
              {!showAddForm && (
                <button
                  className="add-review-button"
                  onClick={() => setShowAddForm(true)}
                >
                  ADD
                </button>
              )}
                {/* add review form */}
              {showAddForm && (
                <div className="add-review-form">
                  <textarea
                    className="review-textarea"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your review..."
                  />
                  <button className="submit-review-button" onClick={handleAddReview}>Submit</button>
                  <button className="cancel-review-button" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              )}
            </div>
          )}

            {/* review list */}
          {reviews.map((review) => (
            <div key={review._id} className="review-item">
              <p className="review-username">By: {review.userId.username}</p>
              <p>{review.comment}</p>
              {isLoggedIn && userId === review.userId._id && (
                <ReviewButtons
                  reviewData={review}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              )}
            </div>
          ))}
  {/* edit review */}
          {showEditForm && editingReview && (
            <div className="edit-review-form">
              <textarea
                className="review-textarea"
                value={editingReview.comment}
                onChange={(e) =>
                  setEditingReview({ ...editingReview, comment: e.target.value })
                }
              />
              <button className="submit-review-button" onClick={handleSaveEdit}>Save</button>
              <button className="cancel-review-button" onClick={() => {
                setShowEditForm(false);
                setEditingReview(null);
              }}>Cancel</button>
            </div>
          )}
        </section>
      </div>

      <div className="recipe-image-container">
        <img
          src={recipe.img_src || "https://via.placeholder.com/400"}
          alt={recipe.recipe_name}
          className="recipe-image"
        />
      </div>
    </div>
  );
};

export default RecipePage;
