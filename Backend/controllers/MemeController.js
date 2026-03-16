import { Meme } from "../models/Database.js";

export class MemeController {

    // CREATE
    static async createMeme(memeData, userId) {
        // Supponendo che nel payload ci siano i campi previsti nel model: title, description, image_path
        // Opzionalmente gestiamo autore/userId in base alla configurazione delle relazioni, 
        // per ora non implementato nel model base inviato.

        memeData.userId = userId;
        memeData.created_at = new Date();

        const newMeme = await Meme.create({
            ...memeData
        });


        return newMeme;
    }

    // READ ALLEN
    static async getAllMemes(queryParams = {}) {
        // queryParams potrebbe indicare filtri o paginazione, qui prendiamo tutto:
        const memes = await Meme.findAll();
        return memes;
    }

    // READ BY ID
    static async getMemeById(memeId) {
        const meme = await Meme.findByPk(memeId);
        if (!meme) {
            const error = new Error("Meme not found");
            error.status = 404;
            throw error;
        }
        return meme;
    }

    // UPDATE BY ID
    static async updateMeme(memeId, updateData, userId) {
        const meme = await Meme.findByPk(memeId);
        if (!meme) {
            const error = new Error("Meme not found");
            error.status = 404;
            throw error;
        }

        // update
        await meme.update(updateData);
        return meme;
    }

    // DELETE BY ID
    static async deleteMeme(memeId, userId) {
        const meme = await Meme.findByPk(memeId);
        if (!meme) {
            const error = new Error("Meme not found");
            error.status = 404;
            throw error;
        }

        await meme.destroy();
        return { message: "Meme deleted successfully", id: memeId };
    }
}