import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { uploadProfilePhoto } from "../middleware/uploadPhoto.js";
import {
    validateLogin,
    validateRegister,
    validateChangeUsername,
    validateChangePassword,
    validateUpdateUser
} from "../middleware/validator/authValidator.js";

export const authRouter = express.Router();

// LOGIN: Effettua l'accesso
authRouter.post("/login",
    validateLogin,
    (req, res, next) => {
        const { username, password } = req.body;

        AuthController.login(username, password)
            .then(token => res.status(200).json({ token }))
            .catch(next);
    });

// REGISTER: Registra un nuovo utente
authRouter.post("/register",
    validateRegister,
    (req, res, next) => {
        const { username, password } = req.body;

        AuthController.register(username, password)
            .then(token => res.status(201).json({ token }))
            .catch(next);
    });

import { enforceAuthentication } from "../middleware/authorization.js";

// Aggiorna username
authRouter.put("/username",
    enforceAuthentication,
    validateChangeUsername,
    (req, res, next) => {
        const { password, newUsername } = req.body;

        AuthController.changeUsername(req.username, password, newUsername)
            .then((token) => res.json({ message: "Username updated successfully", token }))
            .catch(next);
    });

// Aggiorna password
authRouter.put("/password",
    enforceAuthentication,
    validateChangePassword,
    (req, res, next) => {
        const { password, newPassword } = req.body;

        AuthController.changePassword(req.username, password, newPassword)
            .then((token) => res.json({ message: "Password updated successfully", token }))
            .catch(next);
    });

authRouter.put("/profile-picture",
    enforceAuthentication,
    uploadProfilePhoto.single("profilePicture"),
    (req, res, next) => {
        const username = req.username;

        AuthController.updateProfilePicture(username, req.file)
            .then((token) => res.json({ message: "Profile picture updated successfully", token }))
            .catch(next);
    });

// Manteniamo anche la vecchia rotta completa se mai dovesse servire
authRouter.put("/",
    enforceAuthentication,
    validateUpdateUser,
    (req, res, next) => {
        const { password, newUsername, newPassword } = req.body;

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

// READ: Ottieni informazioni pubbliche utente
authRouter.get("/:username", (req, res, next) => {
    AuthController.getUser(req.params.username)
        .then(user => res.json(user))
        .catch(next);
});
