import express from "express";
import { CommentController } from "../controllers/CommentController.js";
import { enforceAuthentication, enforceCommentOwnership } from "../middleware/authorization.js";
import { validateCommentText, validateMemeIdParam, validateCommentIdParam } from "../middleware/validator/commentValidator.js";

// mergeParams a true permette al router di leggere :memeId dal router genitore (memeRouter)
export const commentRouter = express.Router({ mergeParams: true });

// CREATE: Crea un nuovo commento per un meme specifico
commentRouter.post("/",
    enforceAuthentication,
    validateMemeIdParam,
    validateCommentText,
    (req, res, next) => {

        req.body.memeId = req.params.memeId;

        CommentController.createComment(req.body, req.username)
            .then(newComment => res.status(201).json(newComment))
            .catch(next);
    });

// READ: Ottieni tutti i commenti per un meme specifico
commentRouter.get("/",
    validateMemeIdParam,
    (req, res, next) => {
        CommentController.getCommentsByMeme(req.params.memeId)
            .then(comments => res.json(comments))
            .catch(next);
    });

// UPDATE: Aggiorna un commento esistente (solo l'autore può farlo)
commentRouter.put("/:commentId",
    enforceAuthentication,
    validateMemeIdParam,
    validateCommentIdParam,
    validateCommentText,
    enforceCommentOwnership,
    (req, res, next) => {
        CommentController.updateComment(req.params.commentId, req.body)
            .then(updatedComment => res.json(updatedComment))
            .catch(next);
    });

// DELETE: Elimina un commento (solo l'autore può farlo)
commentRouter.delete("/:commentId",
    enforceAuthentication,
    validateMemeIdParam,
    validateCommentIdParam,
    enforceCommentOwnership,
    (req, res, next) => {
        CommentController.deleteComment(req.params.commentId)
            .then(result => res.json(result))
            .catch(next);
    });
