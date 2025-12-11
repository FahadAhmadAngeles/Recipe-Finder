const express = require('express');
const recipesRoutes = express.Router();
const { 
    recipeModel,
  getAllRecipes, 
  getRecipeById, 
  addRecipe, 
  updateRecipe, 
  deleteRecipe 
} = require('./recipes-models');

const { createRecipeRules } = require('./middlewares/create-recipe-rules'); 
const { validationResult } = require('express-validator'); 
const { updateRecipeRules } = require('./middlewares/update-recipe-rules');


// GET ALL RECIPES, SEARCH OPTION
recipesRoutes.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    const searchQuery = req.query.q?.trim() || "";

    let filter = {};
    if (searchQuery) {
      filter = {
        recipe_name: { $regex: searchQuery, $options: "i" } // case-insensitive
      };
    }

    const totalRecipes = await recipeModel.countDocuments(filter);

    const recipes = await recipeModel
      .find(filter)
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      totalRecipes,
      totalPages: Math.ceil(totalRecipes / limit),
      recipes,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// SEARCH RECIPES BY NAME
recipesRoutes.get('/search', async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const regex = new RegExp(query, "i");
    const recipes = await recipeModel.find({ recipe_name: { $regex: regex } });

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ error: "No recipes found" });
    }

    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error searching recipes:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Helper keyword filters
function containsAny(text, keywords) {
    if (!text) return false;
    text = text.toLowerCase();
    return keywords.some(kw => text.includes(kw));
}


// MEAT-BASED RECIPES
recipesRoutes.get('/category/meat', async (req, res) => {
    try {
        const recipes = await getAllRecipes();

        const meatKeywords = ["chicken", "beef", "pork", "lamb", "turkey", "bacon", "sausage"];

        const filtered = recipes.filter(r => 
            containsAny(JSON.stringify(r.ingredients), meatKeywords) ||
            containsAny(r.cuisine_path, meatKeywords)
        );

        res.status(200).json(filtered);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//VEGAN
recipesRoutes.get('/category/vegan', async (req, res) => {
    try {
        const recipes = await getAllRecipes();

        const nonVeganKeywords = [
            "chicken", "beef", "pork", "fish", "egg", "milk",
            "cheese", "butter", "seafood", "shrimp", "salmon", "yogurt"
        ];

        const filtered = recipes.filter(r => 
            !containsAny(JSON.stringify(r.ingredients), nonVeganKeywords)
        );

        res.status(200).json(filtered);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// DESSERTS

recipesRoutes.get('/category/desserts', async (req, res) => {
    try {
        const recipes = await getAllRecipes();

        const dessertKeywords = [
            "dessert", "cake", "cookie", "pie", "pudding", 
            "sweet", "brownie", "chocolate"
        ];

        const filtered = recipes.filter(r => 
            containsAny(r.cuisine_path, dessertKeywords) ||
            containsAny(JSON.stringify(r.ingredients), dessertKeywords)
        );

        res.status(200).json(filtered);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});





// GET RECIPE BY ID
recipesRoutes.get('/:id', async (req, res) => {
    const recipeId = req.params.id;

    await getRecipeById(recipeId)
    .then((recipe) => {
        if (!recipe) {
            return res.status(404).json({ error: "Recipe Not Found" });
        } else {
            return res.status(200).json(recipe);
        }
    })
    .catch((error) => {
        console.error('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});


// CREATE RECIPE
recipesRoutes.post('/', createRecipeRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newRecipe = req.body;

    addRecipe(newRecipe)
    .then((addedRecipe) => {
        res.status(201).json(addedRecipe);
    })
    .catch((error) => {
        console.error('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});


// UPDATE RECIPE
recipesRoutes.put('/:id', updateRecipeRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const recipeId = Number(req.params.id);
    const newRecipeData = req.body;

    getRecipeById(recipeId)    
    .then((existingRecipe) => {
        if (!existingRecipe) {
            res.status(404).json({ error: "Recipe not found" });
        } else {
            updateRecipe(recipeId, newRecipeData)
            .then((updatedRecipe) => {
                res.status(200).json(updatedRecipe);
            })
            .catch((error) => {
                console.error('Error', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        }
    })
    .catch((error) => {
        console.error('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});


// DELETE RECIPE
recipesRoutes.delete('/:id', (req, res) => {
    const recipeId = Number(req.params.id);

    getRecipeById(recipeId)  
    .then((existingRecipe) => {
        if (!existingRecipe) {
            res.status(404).json({ error: "Recipe not found" });
        } else {
            deleteRecipe(recipeId)
            .then((deletedRecipe) => {
                res.status(200).json(deletedRecipe);
            })
            .catch((error) => {
                console.error('Error', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        }
    })
    .catch((error) => {
        console.error('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});



module.exports = recipesRoutes;
