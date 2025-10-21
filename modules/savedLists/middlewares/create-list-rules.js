const { body } = require('express-validator');

const customerIdRule = body('customerid')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Customer ID must be a positive integer');

const recipeIdsRule = body('recipeIds')
    .isArray()
    .withMessage('Recipe IDs must be an array')
    .custom((value) => {
        if (!value.every(Number.isInteger)) {
            throw new Error('All recipe IDs must be integers');
        }
        return true;
    });

const createListRules = [customerIdRule, recipeIdsRule];
module.exports = { createListRules };