import { Comment, Meme, User } from "../models/Database.js";

export class CommentController {

    // CREATE: Aggiungi un commento a un meme
    static async createComment(commentData, username) {

        // Verifica che il meme esista
        const meme = await Meme.findByPk(commentData.memeId);
        if (!meme) {
            const error = new Error("Meme not found");
            error.status = 404;
            throw error;
        }

        commentData.userId = username;
        commentData.created_at = new Date();

        const newComment = await Comment.create({
            ...commentData
        });

        meme.comment_count++;
        await meme.save();

        return newComment;
    }

    // READ: Ottieni i commenti di un meme specifico
    static async getCommentsByMeme(memeId) {
        const comments = await Comment.findAll({
            where: { memeId: memeId },
            include: [{ model: User, as: 'User', attributes: ['username'] }]
        });
        return comments;
    }

    // UPDATE BY ID: Modifica un commento
    static async updateComment(commentId, updateData) {
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            const error = new Error("Comment not found");
            error.status = 404;
            throw error;
        }

        await comment.update({ text: updateData.text });
        return comment;
    }

    // DELETE BY ID: Elimina un commento
    static async deleteComment(commentId) {

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            const error = new Error("Comment not found");
            error.status = 404;
            throw error;
        }

        const meme = await Meme.findByPk(comment.memeId);
        if (!meme) {
            const error = new Error("Meme not found");
            error.status = 404;
            throw error;
        }

        await comment.destroy();
        meme.comment_count--;
        await meme.save();
        return { message: "Comment deleted successfully", id: commentId };
    }
}
