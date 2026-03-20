import { body, validationResult } from 'express-validator';
import { handleValidationErrors } from './handleValidatorErrors.js';


// Validatori riutilizzabili
const checkUsername = (field) =>
    body(field)
        .isString().withMessage(`${field} is required`)
        .isLength({ min: 3 }).withMessage(`${field} must be at least 3 characters long`)
        .trim();

const checkPassword = (field) =>
    body(field)
        .isString().withMessage(`${field} is required`)
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).withMessage(`${field} must be at least 8 characters long, 
            contain at least one uppercase letter, one lowercase letter, 
            one number and one special character`);

export const validateLogin = [
    body('username').notEmpty().withMessage('Username is required').trim(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

export const validateRegister = [
    checkUsername('username'),
    checkPassword('password'),
    handleValidationErrors
];

export const validateChangeUsername = [
    body('password').notEmpty().withMessage('Current password is required'),
    checkUsername('newUsername'),
    handleValidationErrors
];

export const validateChangePassword = [
    body('password').notEmpty().withMessage('Current password is required'),
    checkPassword('newPassword'),
    handleValidationErrors
];

export const validateUpdateUser = [
    body('password').notEmpty().withMessage('Current password is required'),
    checkUsername('newUsername').optional(),
    checkPassword('newPassword').optional(),
    body().custom((value, { req }) => {
        if (!req.body.newUsername && !req.body.newPassword) {
            throw new Error('Nothing to update');
        }
        return true;
    }),
    handleValidationErrors
];