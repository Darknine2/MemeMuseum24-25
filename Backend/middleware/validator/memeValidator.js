import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidatorErrors.js';


// Una volta che il parse a JSON è avvenuto con successo, con express-validator posso validare i campi del JSON
export const parseMemeBody = (req, res, next) => {
    try {
        if (req.body.memeBody) {
            req.body.memeData = JSON.parse(req.body.memeBody);
        } else {
            req.body.memeData = {};
        }
        next();
    } catch (err) {
        const error = new Error("Invalid JSON format in memeBody");
        error.status = 400;
        next(error);
    }
};

// Validatori riutilizzabili
const checkTitle = () =>
    body('memeData.title')
        .isString().withMessage('Title is required')
        .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters long')
        .trim();

const checkDescription = () =>
    body('memeData.description')
        .optional({ nullable: true, checkFalsy: true }) // Permette null o stringa vuota
        .isString().withMessage('Description must be a string')
        .trim();

export const validateParamId = [
    param('memeId').isInt({ min: 1 }).withMessage('Valid Meme ID is required'),
    handleValidationErrors
];

export const validateCreateMeme = [
    parseMemeBody,
    checkTitle(),
    checkDescription(),
    handleValidationErrors
];

export const validateUpdateMeme = [
    parseMemeBody,
    body('memeData.title').optional().isString().isLength({ min: 1, max: 255 }).withMessage
        ('Title must be between 1 and 255 characters long').trim(),
    checkDescription(),
    handleValidationErrors
];
