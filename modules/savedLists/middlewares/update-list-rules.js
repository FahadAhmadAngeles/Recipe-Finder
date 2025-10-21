const { body } = require('express-validator');

const recipeIdsRule = body('recipeIds')
    .optional()
    .isArray()
    .withMessage('Recipe IDs must be an array')
    .custom((value) => {
        if (!value.every(Number.isInteger)) {
            throw new Error('All recipe IDs must be integers');
        }
        return true;
    });

const updateListRules = [recipeIdsRule];
module.exports = { updateListRules };