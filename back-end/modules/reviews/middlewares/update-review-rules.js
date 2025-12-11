const { body } = require('express-validator');

const userIdRule = body('userId')
  .optional()
  .isMongoId()
  .withMessage('User ID must be a valid MongoDB ObjectId');

const recipeIdRule = body('recipeId')
  .optional()
  .isMongoId()
  .withMessage('Recipe ID must be a valid MongoDB ObjectId');

const commentRule = body('comment')
  .optional()
  .isString()
  .withMessage('Comment must be a string');

const updateReviewRules = [userIdRule, recipeIdRule, commentRule];

module.exports = { updateReviewRules };
