import express from "express";
import { VoteController } from "../controllers/VoteController.js";
import { enforceAuthentication } from "../middleware/authorization.js";
import { validateVoteBody, validateMemeIdParam } from "../middleware/validator/voteValidator.js";

// Importante: mergeParams a true permette al router di leggere :memeId dal memeRouter
export const voteRouter = express.Router({ mergeParams: true });

// READ: Ottieni tutti quanti gli utenti che hanno votato un meme tramite Tabella N:M
voteRouter.get("/", validateMemeIdParam, (req, res, next) => {
    VoteController.getVotesByMeme(req.params.memeId)
        .then(votes => res.json(votes))
        .catch(next);
});

// CREATE / UPDATE: Esprimi o cambia il tuo voto 
// Non c'e' piu' bisogno di inviare l'id del voto: il router si basa nativamente su memeId dal path e username dal JWT
voteRouter.post("/", enforceAuthentication, validateMemeIdParam, validateVoteBody, (req, res, next) => {
    // req.body deve contenere { vote: true } o { vote: false }
    VoteController.castVote(req.params.memeId, req.username, req.body.vote)
        .then(newVote => res.status(201).json(newVote))
        .catch(next);
});

// DELETE: Rimuovi il *proprio* voto e stacca la tabella ponte
voteRouter.delete("/", enforceAuthentication, validateMemeIdParam, (req, res, next) => {
    VoteController.deleteVote(req.params.memeId, req.username)
        .then(result => res.json(result))
        .catch(next);
});
