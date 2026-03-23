import { User } from "../models/Database.js";
import Jwt from "jsonwebtoken";
import { createHash } from "crypto";
import { PhotoService } from "../services/PhotoService.js";

export class AuthController {


    static async login(username, password) {

        const check = await AuthController.checkCredentials(username, password);
        if (!check) {
            const error = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }
        return AuthController.issueToken(username);

    }

    static async register(username, password) {

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            const error = new Error("Username already exists");
            error.status = 409;
            throw error;
        }

        const user = await User.create({ username, password });
        return AuthController.issueToken(username);
    }

    static async updateUser(username, newUsername, password, newPassword) {

        console.log(username, newUsername, password, newPassword);
        const user = await User.findByPk(username);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const check = await AuthController.checkCredentials(username, password);
        if (!check) {
            const error = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }

        const updates = {};
        if (newUsername) {
            const existingUser = await User.findOne({ where: { username: newUsername } });
            if (existingUser) {
                const error = new Error("Username already exists");
                error.status = 409;
                throw error;
            }
            updates.username = newUsername;
        }

        if (newPassword) {
            updates.password = newPassword;
        }

        // Usiamo User.update() perché modificare la Primary Key (username) con .save() causa problemi
        await User.update(updates, { where: { username: username } });

        return AuthController.issueToken(newUsername || username);
    }

    static async changeUsername(username, password, newUsername) {
        const user = await User.findByPk(username);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const check = await AuthController.checkCredentials(username, password);
        if (!check) {
            const error = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }

        const existingUser = await User.findOne({ where: { username: newUsername } });
        if (existingUser) {
            const error = new Error("Username already exists");
            error.status = 409;
            throw error;
        }


        await User.update({ username: newUsername }, { where: { username: username } });
        return AuthController.issueToken(newUsername);
    }

    static async changePassword(username, password, newPassword) {
        const user = await User.findByPk(username);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const check = await AuthController.checkCredentials(username, password);
        if (!check) {
            const error = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }

        await user.update({ password: newPassword });
        return AuthController.issueToken(username);
    }


    static async deleteUser(username) {
        const user = await User.findByPk(username);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        await user.destroy();
    }

    static async updateProfilePicture(username, file) {
        const user = await User.findByPk(username);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        if (user.profile_picture && user.profile_picture !== "logo.png") {
            await PhotoService.deletePhoto("profiles", username, user.profile_picture);
        }

        const newPath = await PhotoService.uploadPhoto(file, "profiles", username);
        await user.update({ profile_picture: newPath });

        return AuthController.issueToken(username);
    }

    static async getUser(username) {
        const user = await User.findByPk(username, {
            attributes: ['username', 'profile_picture']
        });
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        return user;
    }

    static async checkCredentials(username, password) {

        const hashedPassword = createHash("sha256").update(password).digest("hex");
        const user = await User.findOne({ where: { username, password: hashedPassword } });

        if (user) {
            return true;
        }
        return false;
    }


    static issueToken(username) {
        return Jwt.sign({ user: username }, process.env.TOKEN_SECRET, { expiresIn: `${24 * 60 * 60}s` });
    }

    static isTokenValid(token, callback) {
        Jwt.verify(token, process.env.TOKEN_SECRET, callback);
    }



}

