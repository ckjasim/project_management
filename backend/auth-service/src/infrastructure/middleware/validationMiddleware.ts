import { body, validationResult } from 'express-validator';

export const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),

  body('email').isEmail().withMessage('Please enter a valid email address'),

  // Validate 'password' field
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const employeeLoginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('projectCode')
    .notEmpty()
    .withMessage('project code is required')
    .isLength({ min: 5 })
    .withMessage('project code must be at least 5 characters long'),
];
export const employeeRegisterValidation = [
  body('name')
    .isString()
    .isLength({ min: 3, max: 30 })
    .withMessage('Name must be between 3 and 30 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    body('mobile')
    .isLength({ min: 10, max: 10 })
    .isNumeric()
    .withMessage('Mobile number must be 10 digits'),
    body('jobRole')
    .isString()
    .withMessage('Job role must be a string'),
    body('projectCode')
    .isString()
    .isLength({ min: 5, max: 5})
    .withMessage('enter a valid 5 digit project code'),
    body('img').optional().isString().withMessage('Image URL must be a string'),
];
