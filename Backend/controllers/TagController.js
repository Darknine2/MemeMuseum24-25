import { Tag, Meme } from "../models/Database.js";

export class TagController {

    static async getAllTags() {
        const tags = await Tag.findAll();
        return tags;
    }

    static async getTagById(tagId) {
        const tag = await Tag.findByPk(tagId);
        if (!tag) {
            const error = new Error("Tag not found");
            error.status = 404;
            throw error;
        }
        return tag;
    }

    static async createTag(tagData) {
        const newTag = await Tag.create(tagData);
        return newTag;
    }

    static async addTagsToMeme(memeId, tagNames, transaction = null) {
        const meme = await Meme.findByPk(memeId, { transaction });
        if (!meme) {
            const error = new Error("Meme not found");
            error.status = 404;
            throw error;
        }

        for (const tagName of tagNames) {
            let tag = await Tag.findOne({ where: { name: tagName }, transaction });
            if (!tag) {
                tag = await Tag.create({ name: tagName }, { transaction });
            }
            await meme.addTag(tag, { transaction });
        }

        return { message: "Tag added successfully" };
    }

    static async updateTag(tagId, updateData) {
        const tag = await Tag.findByPk(tagId);
        if (!tag) {
            const error = new Error("Tag not found");
            error.status = 404;
            throw error;
        }
        await tag.update(updateData);
        return tag;
    }

    static async deleteTag(tagId) {
        const tag = await Tag.findByPk(tagId);
        if (!tag) {
            const error = new Error("Tag not found");
            error.status = 404;
            throw error;
        }
        await tag.destroy();
        return { message: "Tag deleted successfully", id: tagId };
    }

}