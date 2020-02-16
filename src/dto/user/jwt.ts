export interface JwtPayload {
    id: number;
    email: string;
    scopes: string[];
}