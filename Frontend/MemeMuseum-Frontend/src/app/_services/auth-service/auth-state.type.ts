export type AuthState = {
    isAuthenticated: boolean;
    username: string | null;
    token: string | null;
}