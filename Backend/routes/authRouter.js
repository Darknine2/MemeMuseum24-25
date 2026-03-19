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

import { enforceAuthentication } from "../middleware/authorization.js";

authRouter.put("/",
    enforceAuthentication,
    (req, res, next) => {
        const { password, newUsername, newPassword } = req.body;
        
        if (!password) {
            const error = new Error("Current password is required");
            error.status = 400;
            return next(error);
        }

        if (!newUsername && !newPassword) {
            const error = new Error("Nothing to update");
            error.status = 400;
            return next(error);
        }

        AuthController.updateUser(req.username, newUsername, password, newPassword)
            .then((token) => res.json({ message: "Credentials updated successfully", token }))
            .catch(next);
    });

// DELETE: Elimina account utente
authRouter.delete("/",
    enforceAuthentication,
    (req, res, next) => {
        AuthController.deleteUser(req.username)
            .then(() => res.json({ message: "Account deleted successfully" }))
            .catch(next);
    });
