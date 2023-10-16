import './local/local-strategy'
import './jwt/jwt-strategy'
import { Installation } from '../../api/installation/installations.interface';

export interface iUser {
    id?: number;
    username?: string;
    hashedPassword?: string;
    accessLevel?: number;
    enabled?: boolean;
    lastAccess?: Date;  
    installationId?: Installation | null;   
}

declare global {
    namespace Express {
        interface User extends iUser {
        }
    }
}