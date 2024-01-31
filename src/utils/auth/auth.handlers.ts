import './local/local-strategy'
import './jwt/jwt-strategy'
import { Installation } from '../../api/installation/installations.interface';

export interface iUser { // Define the IUser interface for user data
  id?: number; // Optional user ID
  username?: string; // User's username
  hashedPassword?: string; // User's hashed password
  accessLevel?: number; // User's access level
  able?: boolean; // Flag indicating whether the user is enabled or disabled
  lastAccess?: Date; // Timestamp of the user's last access
  installationId?: Installation | null; // User's assigned installation or null
}

declare global { // Declare global namespace
  namespace Express { // Define Express namespace
    interface User extends iUser { // Extend Express.User interface with iUser properties
    }
  }
}
