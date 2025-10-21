const { readFile, writeToFile } = require("../../shared/utils");
const path = require('path');

const filePath = path.resolve(__dirname, '../../data/recipes.json');

async function getAllRecipes() {
return await readFile(filePath);
}

async function getRecipeById(recipeId) {
    const recipes = await getAllRecipes();
    const index = recipes.findIndex((recipe) => recipe.id === recipeId);
    
    if (index !== -1) {
        return recipes[index];
    } else {
    throw new Error("Recipe not found");
    }

}

async function addRecipe(newRecipe) {
const recipes = await getAllRecipes();
recipes.push(newRecipe);
await writeToFile(filePath, recipes);

}

async function updateRecipe(recipeId, updatedRecipe) {
const recipes = await getAllRecipes();

const index = recipes.findIndex((recipe) => recipe.id === recipeId);

if (index !== -1) {
    recipes[index] = updatedRecipe;
    await writeToFile(filePath, recipes);
    return recipes[index];
} else {
    throw new Error("Recipe not found");
}
}

async function deleteRecipe(recipeId) {
const recipes = getAllRecipes();

const index = recipes.findIndex((recipe) => recipe.id === recipeId);

if (index !== -1) {
    const deleted = recipes.slice(index, 1)[0];
    await writeToFile(filePath, recipes);
    return deleted;
} else {
    throw new Error("Recipe not found");
}
}


module.exports = {
  getAllRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe
};

