import express from "express";
import { AuthController } from "../controllers/AuthController.js";

export const authRouter = express.Router();

// LOGIN: Effettua l'accesso
authRouter.post("/login",
    (req, res, next) => {
        const { username, password } = req.body;

        if (!username || !password) {
            const error = new Error("Username and password are required");
            error.status = 400;
            return next(error);
        }

        AuthController.login(username, password)
            .then(token => res.status(200).json({ token }))
            .catch(next);
    });

// REGISTER: Registra un nuovo utente
authRouter.post("/register",
    (req, res, next) => {
        const { username, password } = req.body;

        if (!username || !password) {
            const error = new Error("Username and password are required");
            error.status = 400;
            return next(error);
        }

        AuthController.register(username, password)
            .then(token => res.status(201).json({ token }))
            .catch(next);
    });
