const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  recipeId: { type: Number },
  ingredients: { type: Array, default: [] },
  rating: { type: Number, min: 0.5, max: 5 },
  timeToMake: { type: String }
});

const recipeModel = mongoose.model("Recipe", recipeSchema);

// CRUD OPERATIONS 

async function getAllRecipes() {
  return await recipeModel.find();
}

async function getRecipeById(recipeId) {
  const recipe = await recipeModel.findOne({ recipeId });
  if (!recipe) throw new Error("Recipe not found");
  return recipe;
}

async function addRecipe(newRecipe) {
  const recipe = new recipeModel(newRecipe);
  await recipe.save();
  return recipe;
}

async function updateRecipe(recipeId, updatedRecipe) {
  const recipe = await recipeModel.findOneAndUpdate({ recipeId },updatedRecipe, { new: true });
  if (!recipe) throw new Error("Recipe not found");
  return recipe;
}

async function deleteRecipe(recipeId) {
  const deleted = await recipeModel.findOneAndDelete({ recipeId });
  if (!deleted) throw new Error("Recipe not found");
  return deleted;
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  recipeModel
};
