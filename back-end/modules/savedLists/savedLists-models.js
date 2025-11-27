const mongoose = require("mongoose");
const { recipeModel } = require("../recipes/recipes-models.js"); 
const { userModel } = require("../users/users-models.js"); 

//SCHEMAS AND MODELS 



const listSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
});

const listModel = mongoose.model("SavedList", listSchema);

//CRUD OPERATIONS 

async function getAllLists() {
  return await listModel.find().populate("recipes").populate("userId");
}

async function getListByUserId(userId) {
  const list = await listModel.findOne({ userId }).populate("recipes");
  if (!list) throw new Error("Saved list not found");
  return list;
}

async function createList(data) {
  const { userId, recipeIds } = data;

  const user = await userModel.findOne({ userId });
  if (!user) throw new Error("User not found");

  const recipes = await recipeModel.find({ recipeId: { $in: recipeIds } });
  if (recipes.length === 0) throw new Error("No valid recipes found");

  const list = new listModel({
    userId: user._id,                
    recipes: recipes.map(r => r._id) 
  });

  await list.save();
  return list;
}


async function updateList(userId, updatedRecipeIds) {
  const list = await listModel.findOneAndUpdate(
    { userId },
    { recipes: updatedRecipeIds },
    { new: true } 
  );

  if (!list) throw new Error("Saved list not found");
  return list;
}

async function deleteList(userId) {
  const deleted = await listModel.findOneAndDelete({ userId });
  if (!deleted) throw new Error("Saved list not found");
  return deleted;
}

module.exports = {
  getAllLists,
  getListByUserId,
  createList,
  updateList,
  deleteList,
  listModel
};
