import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidatorErrors.js';

export const validateTagIdParam = [
    param('tagId').isInt({ min: 1 }).withMessage('Valid Tag ID is required'),
    handleValidationErrors
];

export const validateTagBody = [
    body('name')
        .isString().withMessage('Tag name must be a string')
        .trim()
        .notEmpty().withMessage('Tag name cannot be empty')
        .isLength({ max: 50 }).withMessage('Tag name must not exceed 50 characters'),
    handleValidationErrors
];
