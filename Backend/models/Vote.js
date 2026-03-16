import { DataTypes } from 'sequelize';

export function createModel(database) {
    database.define('Vote', {
        vote: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, { timestamps: false });
}
