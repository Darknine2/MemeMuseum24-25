import { DataTypes } from 'sequelize';
import { createHash } from 'crypto';

export function createModel(database) {
    database.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            set(value) {
                // Se value è null o stringa vuota, non eseguire l'hashing
                if (value) {
                    const hash = createHash('sha256').update(value).digest('hex');
                    this.setDataValue('password', hash);
                } else {
                    // Se non c'è password (Social), salviamo null o quello che viene passato
                    this.setDataValue('password', null);
                }
            }
        }
    }, { timestamps: false });
}
