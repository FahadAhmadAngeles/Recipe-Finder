const { body } = require('express-validator');

const nameRule = body('name')
    .optional()
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long');

const passwordRule = body('password')
    .optional()
    .isString()
    .isLength({ min: 6, max: 30 })
    .withMessage('Password must be between 6 and 30 characters');

const dateAccountCreatedRule = body('dateAccountCreated')
    .optional()
    .isISO8601()
    .withMessage('Date must be in valid ISO format (YYYY-MM-DD)');

const updateUserRules = [nameRule, passwordRule, dateAccountCreatedRule];
module.exports = { updateUserRules };