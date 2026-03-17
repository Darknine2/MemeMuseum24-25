import { DataTypes } from 'sequelize';

export function createModel(database) {
    database.define('Meme', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image_path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        upvotes_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        downvotes_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    }, { timestamps: false });
}
