import { AuthController } from "../controllers/AuthController.js";
import { Comment, Meme } from "../models/Database.js";


export function enforceAuthentication(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    if (!token) {
        next({ status: 401, message: "Unauthorized" });
        return;
    }
    AuthController.isTokenValid(token, (err, decodedToken) => {
        if (err) {
            next({ status: 401, message: "Unauthorized" });
        } else {
            req.username = decodedToken.user;
            next();
        }
    });
}

export function optionalAuthentication(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return next();
    }
    AuthController.isTokenValid(token, (err, decodedToken) => {
        if (!err && decodedToken) {
            req.username = decodedToken.user;
        }
        next();
    });
}


export async function enforceCommentOwnership(req, res, next) {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) {
        next({ status: 404, message: "Comment not found" });
        return;
    }

    if (comment.userId !== req.username) {
        next({ status: 403, message: "Unauthorized to update this comment" });
        return;
    }

    next();
}

export async function enforceMemeOwnership(req, res, next) {
    const meme = await Meme.findByPk(req.params.memeId);
    if (!meme) {
        next({ status: 404, message: "Meme not found" });
        return;
    }

    if (meme.userId !== req.username) {
        next({ status: 403, message: "Unauthorized to update this meme" });
        return;
    }

    next();
}