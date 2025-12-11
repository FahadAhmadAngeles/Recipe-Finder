const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  recipe_id: { type: Number, required: true, unique: true },

  recipe_name: { type: String, required: true },

  prep_time: { type: String },        
  cook_time: { type: String },       
  total_time: { type: String },       

  servings: { type: Number },

  ingredients: { type: String  },
  directions: { type: String},

  rating: { type: Number, min: 0.0, max: 5.0 },

  url: { type: String },
  cuisine_path: { type: String },

  nutrition: { type: String },
  timing: { type: String }
  
});

const recipeModel = mongoose.model("Recipe", recipeSchema);

// CRUD OPERATIONS
async function getAllRecipes() {
  return await recipeModel.find();
}

async function getRecipeById(id) {
  const recipe = await recipeModel.findById(id);
  if (!recipe) throw new Error("Recipe not found");
  return recipe;
}

async function addRecipe(newRecipe) {
  const recipe = new recipeModel(newRecipe);
  await recipe.save();
  return recipe;
}

async function updateRecipe(recipe_id, updatedRecipe) {
  const recipe = await recipeModel.findOneAndUpdate(
    { recipe_id: recipe_id },
    updatedRecipe,
    { new: true }
  );
  if (!recipe) throw new Error("Recipe not found");
  return recipe;
}

async function deleteRecipe(recipe_id) {
  const deleted = await recipeModel.findOneAndDelete({ recipe_id });
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
