import { User } from "../models/Database.js";
import Jwt from "jsonwebtoken";
import { createHash } from "crypto";

export class AuthController {


    static async login(username, password) {

        const hashedPassword = createHash("sha256").update(password).digest("hex");

        const user = await User.findOne({ where: { username, password: hashedPassword } });
        if (!user) {
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


    static issueToken(username) {
        return Jwt.sign({ user: username }, process.env.TOKEN_SECRET, { expiresIn: `${24 * 60 * 60}s` });
    }

    static isTokenValid(token, callback) {
        Jwt.verify(token, process.env.TOKEN_SECRET, callback);
    }



}

