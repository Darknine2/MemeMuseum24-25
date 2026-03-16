
import { Sequelize } from "sequelize";
import { createModel as createCredentialsModel } from "./Credentials.js";
import 'dotenv/config.js';

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
    dialect: process.env.DIALECT
});

// Crea i modelli
createCredentialsModel(database);

// Esporta i modelli
export const { Credentials } = database.models;

export async function initDatabase() {
    try {
        await database.sync();
        console.log("Database sincronizzato correttamente");

    } catch (err) {
        console.error("Errore DB:", err.message);
    }
}


