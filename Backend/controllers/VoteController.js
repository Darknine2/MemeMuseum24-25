import { Vote, Meme } from "../models/Database.js";

export class VoteController {

    static async castVote(memeId, username, voteValue) {
        // Normalizza voteValue in un booleano
        const isUpvote = String(voteValue).toLowerCase() === 'true' || voteValue === 1 || voteValue === true;

        const meme = await Meme.findByPk(memeId);
        if (!meme) {
            const error = new Error("Meme not found");
            error.status = 404;
            throw error;
        }

        const existingVote = await Vote.findOne({
            where: { memeId: meme.id, userId: username }
        });

        console.log(isUpvote);

        if (existingVote) {
            return await this.updateVote(meme, existingVote, isUpvote);
        }

        return await this.createVote(meme, username, isUpvote);
    }

    static async updateVote(meme, existingVote, voteValue) {

        if (voteValue === existingVote.vote) {
            const error = new Error("You have already voted");
            error.status = 400;
            throw error;
        }

        if (existingVote.vote) {
            meme.votes_count = meme.votes_count - 2;
        } else {
            meme.votes_count = meme.votes_count + 2;
        }

        existingVote.vote = voteValue;
        await existingVote.save();
        await meme.save();

        return existingVote;
    }

    static async createVote(meme, username, voteValue) {
        const newVote = await Vote.create({
            memeId: meme.id,
            userId: username,
            vote: voteValue
        });

        if (voteValue) {
            meme.votes_count++;
        } else {
            meme.votes_count--;
        }

        await meme.save();
        return newVote;
    }

    static async deleteVote(memeId, username) {

        const meme = await Meme.findByPk(memeId);
        if (!meme) {
            const error = new Error("Meme not found");
            error.status = 404;
            throw error;
        }

        const existingVote = await Vote.findOne({
            where: { memeId: meme.id, userId: username }
        });

        if (!existingVote) {
            const error = new Error("Vote not found");
            error.status = 404;
            throw error;
        }

        if (existingVote.vote) {
            meme.votes_count--;
        }
        else {
            meme.votes_count++;
        }

        await meme.save();
        await existingVote.destroy();
        return { message: "Vote deleted successfully" };


    }

    static async getVotesByMeme(memeId) {

    }


}