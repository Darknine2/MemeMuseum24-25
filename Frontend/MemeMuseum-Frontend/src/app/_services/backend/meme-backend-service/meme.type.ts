export interface Meme {
    id?: number;
    title: string;
    description?: string;
    image_path: string;
    created_at?: string | Date;
    upvotes_count?: number;
    downvotes_count?: number;
    userId?: string;
    Author?: {
        username: string;
    };
}