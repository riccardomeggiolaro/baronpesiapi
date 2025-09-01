export interface User {
    id?: number;
    username?: string;
    hashedPassword?: string;
    accessLevel?: number;
    enabled?: boolean;
    lastAccess?: Date;  
    installationId?: number;
}