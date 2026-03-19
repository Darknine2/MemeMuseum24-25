import { User } from "../models/Database.js";
import Jwt from "jsonwebtoken";
import { createHash } from "crypto";

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

        if (newUsername) {
            const existingUser = await User.findOne({ where: { username: newUsername } });
            if (existingUser) {
                const error = new Error("Username already exists");
                error.status = 409;
                throw error;
            }
            user.username = newUsername;
        }

        if (newPassword) {
            user.password = newPassword;
        }
        await user.save();

        return AuthController.issueToken(user.username);
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

