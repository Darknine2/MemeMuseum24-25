import { Meme } from "../models/Database.js";
import fs from "fs/promises";
import path from "path";

export class MemeController {

    // CREATE
    static async createMeme(memeData, username, file) {

        memeData.userId = username;
        memeData.created_at = new Date();
        if (file) {
            memeData.image_path = file.filename;
        }

        try {
            const newMeme = await Meme.create({
                ...memeData
            });

            if (file) {
                await MemeController.uploadMemePhoto(file, newMeme.id);
                await newMeme.reload();
            }

            return newMeme;
        } catch (error) {
            // Se si verifica un problema, cancelliamo l'immagine temporanea
            if (file?.path) {
                fs.unlink(file.path).catch((err) => { });
            }
            throw error; // Rilanciamo l'errore originale per il router/error handler
        }
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
    static async updateMeme(memeId, updateData, file) {
        const meme = await Meme.findByPk(memeId);
        if (!meme) {
            const error = new Error("Meme not found");
            error.status = 404;
            throw error;
        }

        // update
        await meme.update(updateData);
        if (file) {
            await MemeController.deletePhoto(meme.image_path);
            await MemeController.uploadMemePhoto(file, meme.id);
            await meme.reload();
        }
        return meme;
    }

    // DELETE BY ID
    static async deleteMeme(memeId) {
        const meme = await Meme.findByPk(memeId);
        if (!meme) {
            const error = new Error("Meme not found");
            error.status = 404;
            throw error;
        }
        await MemeController.deletePhoto(meme);
        await meme.destroy();
        return { message: "Meme deleted successfully", id: memeId };
    }


    static async uploadMemePhoto(file, memeId) {
        if (!file) return;

        const meme = await Meme.findByPk(memeId);
        if (!meme) {
            const error = new Error("Meme not found");
            error.status = 404;
            throw error;
        }

        // Percorso per la nuova cartella images/memes/{id}
        const memeFolder = path.join(process.cwd(), "images", "memes", String(memeId));

        // Creiamo la cartella se non esiste
        await fs.mkdir(memeFolder, { recursive: true });

        // Spostiamo il file dalla cartella di upload temporanea alla cartella finale
        const newPath = path.join(memeFolder, file.filename);
        await fs.rename(file.path, newPath);

        // Aggiorniamo il path dell'immagine nel database
        meme.image_path = `images/memes/${memeId}/${file.filename}`;
        await meme.save();

        return meme;
    }

    static async deletePhoto(memeObject) {
        const memeFolder = path.join(process.cwd(), "images", "memes", String(memeObject.id));
        const memePath = memeObject.image_path;
        await fs.unlink(memePath);
        await fs.rmdir(memeFolder);
    }
}