import fs from "fs/promises";
import path from "path";

export class PhotoService {

    static async uploadPhoto(file, category, id) {
        if (!file) return;

        // Percorso per la nuova cartella images/{category}/{id}
        const targetFolder = path.join(process.cwd(), "images", category, String(id));

        // Creiamo la cartella se non esiste
        await fs.mkdir(targetFolder, { recursive: true });

        // Spostiamo il file dalla cartella temporanea alla cartella finale
        const newPath = path.join(targetFolder, file.filename);
        await fs.rename(file.path, newPath);

        return `images/${category}/${id}/${file.filename}`;
    }

    static async deletePhoto(category, id, imagePath) {
        // Rimuoviamo il file
        if (imagePath) {
            await fs.unlink(imagePath).catch(() => { });
        }

        // Rimuoviamo la cartella dedicata a quell'id
        const targetFolder = path.join(process.cwd(), "images", category, String(id));
        await fs.rmdir(targetFolder).catch(() => { });
    }
}
