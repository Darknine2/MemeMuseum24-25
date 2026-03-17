import express from "express";
import { TagController } from "../controllers/TagController.js";
import { enforceAuthentication } from "../middleware/authorization.js";

export const tagRouter = express.Router();

// READ: Ottieni tutti i tag
tagRouter.get("/tag",
    (req, res, next) => {
        TagController.getAllTags()
            .then(tags => res.json(tags))
            .catch(next);
    });

// READ: Ottieni un tag specifico tramite ID
tagRouter.get("/tag/:tagId",
    (req, res, next) => {
        TagController.getTagById(req.params.tagId)
            .then(tag => res.json(tag))
            .catch(next);
    });

// CREATE: Crea un nuovo tag
tagRouter.post("/tag",
    enforceAuthentication,
    (req, res, next) => {
        TagController.createTag(req.body)
            .then(newTag => res.status(201).json(newTag))
            .catch(next);
    });

// UPDATE: Aggiorna un tag esistente
tagRouter.put("/tag/:tagId",
    enforceAuthentication,
    (req, res, next) => {
        TagController.updateTag(req.params.tagId, req.body)
            .then(updatedTag => res.json(updatedTag))
            .catch(next);
    });

// DELETE: Elimina un tag
tagRouter.delete("/tag/:tagId",
    enforceAuthentication,
    (req, res, next) => {
        TagController.deleteTag(req.params.tagId)
            .then(result => res.json(result))
            .catch(next);
    });


