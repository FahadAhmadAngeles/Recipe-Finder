const express = require('express');
const reviewsRoutes = express.Router();
const { 
  getAllReviews, 
  getReviewsByRecipe, 
  addReview, 
  updateReview, 
  deleteReview 
} = require('./reviews-models');

const { createReviewRules } = require('./middlewares/create-review-rules');
const { updateReviewRules } = require('./middlewares/update-review-rules');
const { validationResult } = require('express-validator');

// GET ALL REVIEWS
reviewsRoutes.get('/', async (req, res) => {
  try {
    const reviews = await getAllReviews();
    if (!reviews || reviews.length === 0) return res.status(404).json([]);
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET REVIEWS BY RECIPE ID
reviewsRoutes.get('/recipe/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await getReviewsByRecipe(recipeId);
    if (!reviews || reviews.length === 0) return res.status(404).json([]);
    res.status(200).json(reviews);
  } catch (error) {
    console.error(`Error fetching reviews for recipe ${req.params.recipeId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// CREATE NEW REVIEW
reviewsRoutes.post('/', createReviewRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newReview = req.body;
    const createdReview = await addReview(newReview);
    res.status(201).json(createdReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// UPDATE REVIEW
reviewsRoutes.put('/:reviewId', updateReviewRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { reviewId } = req.params;
    const updatedData = req.body;
    const updatedReview = await updateReview(reviewId, updatedData);
    res.status(200).json(updatedReview);
  } catch (error) {
    if (error.message === 'Review not found') {
      res.status(404).json({ error: 'Review not found' });
    } else {
      console.error(`Error updating review ${req.params.reviewId}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// DELETE REVIEW
reviewsRoutes.delete('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await deleteReview(reviewId);
    res.status(200).json(deletedReview);
  } catch (error) {
    if (error.message === 'Review not found') {
      res.status(404).json({ error: 'Review not found' });
    } else {
      console.error(`Error deleting review ${req.params.reviewId}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

module.exports = reviewsRoutes;
