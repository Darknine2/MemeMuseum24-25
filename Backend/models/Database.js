import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createMemeModel } from "./Meme.js";
import { createModel as createTagModel } from "./Tag.js";
import { createModel as createCommentModel } from "./Comment.js";
import { createModel as createVoteModel } from "./Vote.js";
import 'dotenv/config.js';

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
    dialect: process.env.DIALECT
});

// Crea i modelli
createUserModel(database);
createMemeModel(database);
createTagModel(database);
createCommentModel(database);
createVoteModel(database);

// Esporta i modelli
export const { User, Meme, Tag, Comment, Vote } = database.models;

// ------------------------------------
// Definizione delle relazioni tra i modelli
// ------------------------------------

// Relazioni User -> Meme (1:N, un user crea molti meme)
User.hasMany(Meme, { foreignKey: { name: 'userId', defaultValue: 'Unknown' }, onDelete: 'SET DEFAULT', as: 'Memes' });
Meme.belongsTo(User, { foreignKey: { name: 'userId', defaultValue: 'Unknown' }, onDelete: 'SET DEFAULT', as: 'Author' });

// Relazioni User -> Comment (1:N, un user scrive molti commenti)
User.hasMany(Comment, { foreignKey: { name: 'userId', defaultValue: 'Unknown' }, onDelete: 'SET DEFAULT', as: 'Comments' });
Comment.belongsTo(User, { foreignKey: { name: 'userId', defaultValue: 'Unknown' }, onDelete: 'SET DEFAULT', as: 'User' });

// Relazione Molti-a-Molti (N:M): User <-> Meme (Tabella Ponte: Vote)
User.belongsToMany(Meme, { through: Vote, foreignKey: { name: 'userId', defaultValue: 'Unknown' }, as: 'VotedMemes' });
Meme.belongsToMany(User, { through: Vote, foreignKey: 'memeId', as: 'Voters' });

// Relazioni Meme -> Comment (1:N, un meme ha molti commenti)
Meme.hasMany(Comment, { foreignKey: 'memeId', as: 'Comments' });
Comment.belongsTo(Meme, { foreignKey: 'memeId', as: 'Meme' });

// (Super Many-to-Many) Permette di interrogare anche direttamente il modello Vote
User.hasMany(Vote, { foreignKey: { name: 'userId', defaultValue: 'Unknown' }, onDelete: 'SET DEFAULT', as: 'Votes' });
Vote.belongsTo(User, { foreignKey: { name: 'userId', defaultValue: 'Unknown' }, onDelete: 'SET DEFAULT', as: 'User' });
Meme.hasMany(Vote, { foreignKey: 'memeId', as: 'Votes' });
Vote.belongsTo(Meme, { foreignKey: 'memeId', as: 'Meme' });

// Relazione Molti-a-Molti (N:M): Meme <-> Tag
// Creiamo una tabella associativa chiamata "MemeTag" 
Meme.belongsToMany(Tag, { through: 'MemeTag', foreignKey: 'memeId', as: 'Tags' });
Tag.belongsToMany(Meme, { through: 'MemeTag', foreignKey: 'tagId', as: 'Memes' });

export async function initDatabase() {
    try {
        await database.sync();
        console.log("Database sincronizzato correttamente");

        await User.findOrCreate({
            where: { username: 'Unknown' },
            defaults: { password: null }
        });

    } catch (err) {
        console.error("Errore DB:", err.message);
    }
}
