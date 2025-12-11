const mongoose = require("mongoose");
const { userModel } = require("../../modules/users/users-models.js");
const { recipeModel } = require("../../modules/recipes/recipes-models.js");
const { reviewModel } = require("../../modules/reviews/reviews-models.js");
const DB_URL = process.env.DB_URL;

async function connectDB(req, res, next) {
  try {
    await mongoose.connect(DB_URL, { dbName: "MyRecipeDB" });
    console.log("Database Connected");

    await Promise.all([
      userModel.syncIndexes(),
      recipeModel.syncIndexes(),
      reviewModel.syncIndexes(),
    ]);

    next();
  } catch (error) {
    console.log(`Database connection failed`);
    console.log(error);
  }
}

module.exports = connectDB;