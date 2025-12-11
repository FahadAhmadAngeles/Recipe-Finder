const { body } = require('express-validator');

const recipeNameRule = body('recipe_name')
  .notEmpty()
  .isString()
  .isLength({ min: 3, max: 100 })
  .withMessage('Recipe name is required and must be between 3 and 100 characters');

const prepTimeRule = body('prep_time')
  .optional()
  .isString()
  .withMessage('Prep time must be a non-negative integer');

const cookTimeRule = body('cook_time')
  .optional()
  .isString()
  .withMessage('Cook time must be a non-negative integer');

const totalTimeRule = body('total_time')
  .optional()
  .isString()
  .withMessage('Total time must be a non-negative integer');

const servingsRule = body('servings')
  .optional()
  .isInt({ min: 1 })
  .withMessage('Servings must be at least 1');

const ingredientsRule = body('ingredients')
  .notEmpty()
  .isString()
  .withMessage('Ingredients are required and must be an array of strings');

const directionsRule = body('directions')
  .notEmpty()
  .isString()
  .withMessage('Directions are required and must be an array of strings');

const ratingRule = body('rating')
  .notEmpty()
  .isFloat({ min: 0, max: 5 })
  .custom((value) => {
    if (value % 0.5 !== 0) {
      throw new Error('Rating must be in 0.5 increments');
    }
    return true;
  })
  .withMessage('Rating is required and must be between 0 and 5 in 0.5 increments');

const urlRule = body('url')
  .optional()
  .isURL()
  .withMessage('URL must be a valid URL');

const cuisinePathRule = body('cuisine_path')
  .optional()
  .isString()
  .withMessage('Cuisine path must be a string');

const nutritionRule = body('nutrition')
  .optional()
  .isString()
  .withMessage('Nutrition must be an object');

const timingRule = body('timing')
  .optional()
  .isString()
  .withMessage('Timing must be an object');

const createRecipeRules = [
  recipeNameRule,
  prepTimeRule,
  cookTimeRule,
  totalTimeRule,
  servingsRule,
  ingredientsRule,
  directionsRule,
  ratingRule,
  urlRule,
  cuisinePathRule,
  nutritionRule,
  timingRule,
];

module.exports = { createRecipeRules };
