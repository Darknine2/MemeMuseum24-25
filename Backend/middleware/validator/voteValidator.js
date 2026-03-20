import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidatorErrors.js';

export const validateVoteBody = [
    body('vote')
        .isBoolean().withMessage('Vote must be a boolean (true or false)'),
    handleValidationErrors
];

export const validateMemeIdParam = [
    param('memeId').isInt({ min: 1 }).withMessage('Valid Meme ID is required'),
    handleValidationErrors
];
