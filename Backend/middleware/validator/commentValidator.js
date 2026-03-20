import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidatorErrors.js';

export const validateCommentText = [
    body('text')
        .isString().withMessage('Comment text must be a string')
        .trim()
        .notEmpty().withMessage('Comment text cannot be empty')
        .isLength({ max: 500 }).withMessage('Comment text must not exceed 500 characters'),
    handleValidationErrors
];

export const validateMemeIdParam = [
    param('memeId').isInt({ min: 1 }).withMessage('Valid Meme ID is required'),
    handleValidationErrors
];

export const validateCommentIdParam = [
    param('commentId').isInt({ min: 1 }).withMessage('Valid Comment ID is required'),
    handleValidationErrors
];
