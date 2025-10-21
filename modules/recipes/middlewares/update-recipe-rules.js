const { body } = require('express-validator');

const nameRule = body('name')
.optional()
.isString()
.isLength({ min: 3, max: 100 })
.withMessage('Updated recipe name must be between 3 and 100 characters long');

const ingredientsRule = body('ingredients')
.optional()
.isString()
.isLength({ max: 500 })
.withMessage('Ingredients must be less than 500 characters');

const ratingRule = body('rating')
.optional()
.isFloat({ min: 0, max: 5 })
.custom((value) => {
    if (value % 0.5 !== 0) {
        throw new Error('Rating must be in 0.5 increments');
    }
    return true;
})
.withMessage('Rating must be between 0 and 5 in 0.5 increments');

const timeToMakeRule = body('timeToMake')
.optional()
.isString()
.isLength({ max: 10 })
.withMessage('Time to make must be less than 10 characters');

const updateRecipeRules = [nameRule, ingredientsRule, ratingRule, timeToMakeRule];
module.exports = { updateRecipeRules };