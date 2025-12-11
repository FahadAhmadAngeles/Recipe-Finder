const { body } = require('express-validator');

const userIdRule = body('userId')
  .notEmpty()
  .isMongoId()
  .withMessage('User ID must be a valid MongoDB ObjectId');

const recipeIdRule = body('recipeId')
  .notEmpty()
  .isMongoId()
  .withMessage('Recipe ID must be a valid MongoDB ObjectId');

const commentRule = body('comment')
  .optional()
  .isString()
  .withMessage('Comment must be a string');

const createReviewRules = [userIdRule, recipeIdRule, commentRule];

module.exports = { createReviewRules };
