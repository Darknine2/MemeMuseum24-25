import { Meme, Tag, User, database, Vote } from "../models/Database.js";
import { Op } from "sequelize";
import fs from "fs/promises";
import path from "path";
import { TagController } from "./TagController.js";

export class MemeController {

    // CREATE
    static async createMeme(memeData, tags, username, file) {

        memeData.userId = username;
        memeData.created_at = new Date();
        if (file) {
            memeData.image_path = file.filename;
        }

        try {
            // Eseguiamo creazione Meme e assegnazione Tag in una transazione
            const newMeme = await database.transaction(async (t) => {
                const createdMeme = await Meme.create({
                    ...memeData
                }, { transaction: t });

                if (tags) {
                    const tagsArray = Array.isArray(tags) ? tags : [tags];
                    await TagController.addTagsToMeme(createdMeme.id, tagsArray, t);
                }

                return createdMeme;
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

    // READ: Ottieni tutti i meme (con paginazione per la homepage, filtri per tag e data)
    static async getAllMemes(queryParams = {}, currentUsername = null) {
        const page = parseInt(queryParams.page) || 1;
        const limit = 10; // Carica 10 meme alla volta
        const offset = (page - 1) * limit;

        const whereClause = MemeController._buildWhereClause(queryParams);
        const includeClause = MemeController._buildTagFilter(queryParams, currentUsername);
        const orderClause = MemeController._buildOrderClause(queryParams);

        const { count, rows } = await Meme.findAndCountAll({
            where: whereClause,
            include: includeClause,
            limit: limit,
            offset: offset,
            order: orderClause,
            distinct: true // FONDAMENTALE quando si usa findAndCountAll con gli include (JOIN)
        });

        // Restituiamo un oggetto strutturato con i metadati per il frontend
        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit), // arrotonda per eccesso
            currentPage: page,
            memes: rows
        };
    }

    // Helper Functions per generazione query parametri
    static _buildWhereClause(queryParams) {
        const whereClause = {};

        // Filtro di Ricerca (Titolo o Descrizione)
        if (queryParams.search) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${queryParams.search}%` } },
                { description: { [Op.iLike]: `%${queryParams.search}%` } }
            ];
        }

        // Filtro per Intervallo di Date (es. startDate e endDate)
        if (queryParams.startDate || queryParams.endDate) {
            whereClause.created_at = {};

            if (queryParams.startDate) {
                const startDate = new Date(queryParams.startDate);
                startDate.setUTCHours(0, 0, 0, 0); // Inizio della giornata specificata
                whereClause.created_at[Op.gte] = startDate;
            }

            if (queryParams.endDate) {
                const endDate = new Date(queryParams.endDate);
                endDate.setUTCHours(23, 59, 59, 999); // Fine della giornata specificata
                whereClause.created_at[Op.lte] = endDate;
            }
        }
        return whereClause;
    }

    static _buildTagFilter(queryParams, username) {

        const includeClause = MemeController.getBaseIncludeClause(username);

        if (queryParams.tags) {
            // Con URL ?tags=coding&tags=funny, req.query.tags è già un array.
            // Con URL ?tags=coding è solo una stringa, quindi forziamo l'array.
            const tagsArray = Array.isArray(queryParams.tags) ? queryParams.tags : [queryParams.tags];

            // Forza INNER JOIN per restituire solo i meme che hanno *almeno uno* di questi tag
            includeClause[0].where = {
                name: {
                    [Op.in]: tagsArray
                }
            };
        }
        return includeClause;
    }


    static _buildOrderClause(queryParams) {
        let orderClause = [['created_at', 'DESC']]; // Mostriamo i più recenti in cima (Default)

        if (queryParams.sortBy === 'oldest') {
            orderClause = [['created_at', 'ASC']];

        } else if (queryParams.sortBy === 'most_upvoted') {
            orderClause = [
                ['votes_count', 'DESC'],
                ['created_at', 'DESC'] //se hanno gli stessi voti, mette prima il più recente
            ];

        } else if (queryParams.sortBy === 'most_downvoted') {
            orderClause = [
                ['votes_count', 'ASC'],
                ['created_at', 'DESC']
            ];
        }
        return orderClause;
    }

    static getBaseIncludeClause(currentUsername = null) {
        const includeClause = [
            {
                model: Tag,
                as: 'Tags',
                through: { attributes: [] }
            },
            {
                model: User,
                as: 'Author',
                attributes: ['username', 'profile_picture']
            }
        ];

        if (currentUsername) {
            includeClause.push({
                model: Vote,
                as: 'Votes',
                attributes: ['vote'],
                where: { userId: currentUsername },
                required: false
            });
        }

        return includeClause;
    }

    // READ BY ID
    static async getMemeById(memeId, currentUsername = null) {
        const includeClause = MemeController.getBaseIncludeClause(currentUsername);

        const meme = await Meme.findOne({
            where: { id: memeId },
            include: includeClause
        });

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

    static async getMemeByUsername(username, queryParams = {}) {
        const page = parseInt(queryParams.page) || 1;
        const limit = 10; // Carica 10 meme alla volta
        const offset = (page - 1) * limit;

        const includeClause = MemeController.getBaseIncludeClause(username);
        
        const { count, rows } = await Meme.findAndCountAll({
            where: { userId: username },
            include: includeClause,
            limit: limit,
            offset: offset,
            order: [['created_at', 'DESC']],
            distinct: true
        });

        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            memes: rows
        };
    }

    static async getMemeOfTheDay() {

        // 1. Ottieni la data odierna
        const now = new Date();
        const d = 22;
        const m = now.getMonth() + 1; // Gennaio è 0
        const y = now.getFullYear();

        // 2. Calcolo del Seed deterministico
        const seed = (d + m + y);
        const PseudoRandomSeed = BigInt(seed) * BigInt(1103515245);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // 3. Conteggio dei meme nel database
        const totalMemes = await Meme.count({
            where: {
                created_at: { [Op.lt]: todayStart }
            }
        });

        if (totalMemes === 0) {
            const error = new Error("Nessun meme nell'archivio");
            error.status = 404;
            throw error;
        }

        // 4. Trova l'indice (da 0 a totalMemes - 1)
        const targetIndex = PseudoRandomSeed % BigInt(totalMemes);

        const dailyMeme = await Meme.findOne({
            order: [['id', 'ASC']],
            offset: Number(targetIndex),
            limit: 1
        });

        return dailyMeme;

    }
}