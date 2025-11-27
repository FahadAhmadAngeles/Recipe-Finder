const { body } = require('express-validator');

const userIdRule = body('userId')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Customer ID must be a positive integer');

const recipeIdsRule = body('recipeIds')
    .isArray()
    .withMessage('Recipe IDs must be an array')

const createListRules = [userIdRule, recipeIdsRule];
module.exports = { createListRules };