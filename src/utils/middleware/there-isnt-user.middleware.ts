import { TypedRequest } from "../typed-request.interface";
import { Response, NextFunction } from "express";
import UserService from "../../api/user/user.services";
import { FirstUserDTO } from "../../api/auth/auth.dto";

export function thereIsntUser() {
    return async (req: TypedRequest<FirstUserDTO>, res: Response, next: NextFunction) => {
        // Check if there is already a user in the system
        const user = await UserService.getOneUser();
        if (user != null) {
            // If there is already a user, return an error message indicating that the first user has already been created.
            return res.status(400).json({ message: `Primo utente già creato` }); // Return an error message.
        }  
        // If there is no user, proceed to the next middleware or route handler.
        next();
    };
  }
  