export interface Meme {
    id?: number;
    title: string;
    description?: string;
    image_path: string;
    created_at?: string | Date;
    votes_count?: number;
    comment_count?: number;
    userId?: string;
    Author?: {
        username: string;
        profile_picture: string;
    };
    Tags?: {
        id: number;
        name: string;
    }[];
    Votes?: {
        vote: boolean;
    }[];
}