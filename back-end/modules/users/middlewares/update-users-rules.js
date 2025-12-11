const { body } = require('express-validator');

const emailRule = body('email')
    .optional()
    .isString()
    .isEmail()
    .withMessage('Email must be valid');

const usernameRule = body('username')
    .optional()
    .isString()
    .isLength({ min: 6, max: 20 })
    .withMessage('Username must be between 6 and 20 characters');

    const savedListRule = body('savedList')
  .optional()
  .isArray()
  .withMessage('Saved list must be an array');

const passwordRule = body('password')
    .optional()
    .isString()
    .isLength({ min: 6, max: 30 })
    .withMessage('Password must be between 6 and 30 characters');

const roleRule = body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage("Role must be either 'user' or 'admin'");

const updateUserRules = [emailRule, passwordRule, roleRule, usernameRule, savedListRule];

module.exports = { updateUserRules };
