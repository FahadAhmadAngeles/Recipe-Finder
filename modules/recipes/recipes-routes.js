const express = require('express');
const recipesRoutes = express.Router();
const { getAllRecipes, getRecipeById, addRecipe, updateRecipe, deleteRecipe } = require('./recipes-models');
const { createRecipeRules } = require('./middlewares/create-recipe-rules'); 
const { validationResult } = require('express-validator'); 
const { updateRecipeRules } = require('./middlewares/update-recipe-rules');


recipesRoutes.get('/', (req, res) => {
    getAllRecipes()
    .then ((recipes) => {
        if (!recipes || recipes.length === 0) {
            return res.status(404).json([]);
        } else {
            return res.status(200).json(recipes);
        }
    }
    )
    .catch((error) => {
                console.error('Error', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
})

recipesRoutes.get('/:id', (req, res) => {
    const recipeId = Number(req.params.id);

    getRecipeById(recipeId)
    .then((recipe) => {
        if (!recipe) {
            return res.status(404).json({error: "Recipe Not Found"});
        } else {
            return res.status(200).json(recipe)
        }
    })
    .catch((error) => {
                console.error('Error', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
}
)

recipesRoutes.post('/', createRecipeRules, (req, res) => {
   
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
   } else {
    const newRecipe = req.body;

    addRecipe(newRecipe)
    .then((addedRecipe) => {
        res.status(201).json(addedRecipe)
    })
    .catch((error) => {
                console.error('Error', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        }
})

recipesRoutes.put('/:id', updateRecipeRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
    
    recipeId = Number(req.params.id);
    newRecipeData = req.body

    getProductByID(recipeId)
    .then((existingRecipe) => {
        if (!existingRecipe) {
            res.status(404).json({error: "Product not found"});
        } else {
            updateRecipe(recipeId, newRecipeData)
            .then((updatedRecipe) => {
                res.status(200).json(updatedRecipe)
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

        }
})

recipesRoutes.delete('/:id', (req, res) => {
    recipeId = Number(req.params.id);
    

    getProductByID(recipeId)
    .then((existingRecipe) => {
        if (!existingRecipe) {
            res.status(404).json({error: "Product not found"});
        } else {
            deleteRecipe(recipeId)
            .then((deletedRecipe) => {
                res.status(200).json(deletedRecipe)
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
})

module.exports = recipesRoutes;