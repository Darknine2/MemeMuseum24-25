import express from "express";
import { MemeController } from "../controllers/MemeController.js";
import { TagController } from "../controllers/TagController.js";
import { uploadMemePhoto } from "../middleware/uploadPhoto.js";
import { enforceAuthentication, enforceMemeOwnership, optionalAuthentication } from "../middleware/authorization.js";
import { commentRouter } from "./commentRouter.js";
import { voteRouter } from "./voteRouter.js";
import { validateParamId, validateCreateMeme, validateUpdateMeme } from "../middleware/validator/memeValidator.js";

export const memeRouter = express.Router();

// Delega le rotte dei commenti al commentRouter raggruppandole in /:memeId/comment
memeRouter.use("/:memeId/comment", commentRouter);
memeRouter.use("/:memeId/vote", voteRouter);


// CREATE: Crea un nuovo meme
memeRouter.post("/",
    uploadMemePhoto.single("image"),
    enforceAuthentication,
    validateCreateMeme,
    (req, res, next) => {

        if (!req.file) {
            const error = new Error("No file uploaded");
            error.status = 400;
            throw error;
        }

        const memeData = req.body.memeData;

        MemeController.createMeme(memeData, req.body.tags, req.username, req.file)
            .then(newMeme => res.status(201).json(newMeme))
            .catch(next);
    });

// READ: Ottieni tutti i meme
memeRouter.get("/",
    optionalAuthentication,
    (req, res, next) => {
        MemeController.getAllMemes(req.query, req.username)
            .then(memes => res.json(memes))
            .catch(next);
    });

// READ: Ottieni tutti i meme di un utente specifico
memeRouter.get("/user",
    enforceAuthentication,
    (req, res, next) => {
        MemeController.getMemeByUsername(req.username, req.query)
            .then(memes => res.json(memes))
            .catch(next);
    });

memeRouter.get("/daily",
    optionalAuthentication,
    (req, res, next) => {
        MemeController.getMemeOfTheDay()
            .then(meme => res.json(meme))
            .catch(next);
    });

// READ: Ottieni un singolo meme tramite ID
memeRouter.get("/:memeId",
    optionalAuthentication,
    validateParamId,
    (req, res, next) => {
        MemeController.getMemeById(req.params.memeId, req.username)
            .then(meme => res.json(meme))
            .catch(next);
    });

// UPDATE: Aggiorna un meme esistente (es. titolo, file, etc)
memeRouter.put("/:memeId",
    enforceAuthentication,
    enforceMemeOwnership,
    uploadMemePhoto.single("image"),
    validateParamId,
    validateUpdateMeme,
    (req, res, next) => {

        if (!req.file) {
            const error = new Error("No file uploaded");
            error.status = 400;
            throw error;
        }

        const memeData = req.body.memeData;

        MemeController.updateMeme(req.params.memeId, memeData, req.file)
            .then(updatedMeme => res.json(updatedMeme))
            .catch(next);
    });

// DELETE: Elimina un meme
memeRouter.delete("/:memeId",
    enforceAuthentication,
    enforceMemeOwnership,
    validateParamId,
    (req, res, next) => {
        MemeController.deleteMeme(req.params.memeId)
            .then(result => res.json(result))
            .catch(next);
    });




