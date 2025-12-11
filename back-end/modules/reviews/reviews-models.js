const mongoose = require("mongoose");
const { recipeModel } = require("../recipes/recipes-models.js");
const { userModel } = require("../users/users-models.js");

// REVIEW SCHEMA AND MODEL
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const reviewModel = mongoose.model("Review", reviewSchema);

// CRUD OPERATIONS

async function getAllReviews() {
  return await reviewModel.find()
    .populate("userId", "username _id")
    .populate("recipeId");
}

async function getReviewsByRecipe(recipeId) {
  return await reviewModel
    .find({ recipeId })
    .populate("userId", "username _id");
}

// Create a review
async function addReview(reviewData) {
  const { userId, recipeId, comment } = reviewData;

  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");

  const recipe = await recipeModel.findById(recipeId);
  if (!recipe) throw new Error("Recipe not found");

  const review = new reviewModel({ userId, recipeId, comment });
  await review.save();

  // Add review ID to recipe's reviews array
  recipe.reviews = recipe.reviews ? [...recipe.reviews, review._id] : [review._id];
  await recipe.save();

  return review;
}

// Update a review
async function updateReview(reviewId, updatedData) {
  const review = await reviewModel.findByIdAndUpdate(
    reviewId,
    updatedData,
    { new: true } // return the updated document
  );

  if (!review) throw new Error("Review not found");
  return review;
}

// Delete a review
async function deleteReview(reviewId) {
  const review = await reviewModel.findByIdAndDelete(reviewId);
  if (!review) throw new Error("Review not found");

  // Remove review ID from the recipe's reviews array
  await recipeModel.findByIdAndUpdate(
    review.recipeId,
    { $pull: { reviews: review._id } }
  );

  return review;
}

module.exports = {
  reviewModel,
  getAllReviews,
  getReviewsByRecipe,
  addReview,
  updateReview,
  deleteReview,
};
