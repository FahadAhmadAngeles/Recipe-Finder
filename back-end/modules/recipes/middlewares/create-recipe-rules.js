const { body } = require('express-validator');

const nameRule = body('name')
.notEmpty()
.isString()
.isLength({ min: 3, max: 100 })
.withMessage('Recipe name must be between 3 and 100 characters long');

const ingredientsRule = body('ingredients')
.notEmpty()
.isString()
.isLength({ max: 500 })
.withMessage('Ingredients are required and must be less than 500 characters');

const ratingRule = body('rating')
.notEmpty()
.isFloat({ min: 0, max: 5 })
.custom((value) => {
    if (value % 0.5 !== 0) {
        throw new Error('Rating must be in 0.5 increments');
    }
    return true;
})
.withMessage('Rating must be between 0 and 5 in 0.5 increments');

const timeToMakeRule = body('timeToMake')
.notEmpty()
.isString()
.isLength({ max: 10 })
.withMessage('Time to make is required and must be less than 10 characters');

const createRecipeRules = [nameRule, ingredientsRule, ratingRule, timeToMakeRule];
module.exports = { createRecipeRules };