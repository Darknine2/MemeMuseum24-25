export interface Comment {
    id?: number;
    text: string;
    memeId?: number;
    userId?: string;
    created_at?: string | Date;
    User?: {
        username: string;
    };
}
