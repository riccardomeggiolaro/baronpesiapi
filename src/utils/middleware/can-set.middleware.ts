import { TypedRequest, ParsedQs } from "../typed-request.interface";
import { ExistUsernameTDO, UpdateUserDTO } from "../../api/user/user.dto";
import { Response, NextFunction } from "express";
import UserService from "../../api/user/user.services";

// middleware that check if the user is authorizated to set or delete the user
export function canSetDelete(action: "update" | "delete") {
    return async (req: TypedRequest<any, ParsedQs, ExistUsernameTDO>, res: Response, next: NextFunction) => {
      if (action === "update") { // Check if the action is "update"
        req.body as UpdateUserDTO; // Cast the request body to UpdateUserDTO
        if (req.body.accessLevel >= req.user?.accessLevel!) { // Check if the updated access level is greater than or equal to the current user's access level
          return res.status(400).json({ message: "Non puoi assegnare un livello di accesso maggiore o uguale del tuo" }); // Return an error message if the access level is too high
        }
      }  
      const user = await UserService.getUserByUsername(req.params.username); // Retrieve the user by username from the database
      if (req.params.username === req.user?.username) { // Check if the user is trying to modify themselves
        return res.status(400).json({ message: `Non puoi ${action} te stesso` }); // Return an error message if the user is modifying themselves
      }  
      if (user && user!.accessLevel > req.user?.accessLevel!) { // Check if the target user's access level is greater than the current user's access level
        return res.status(400).json({ message: `Non puoi ${action} un utente con un livello di accesso maggiore del tuo` }); // Return an error message if the target user's access level is too high
      }
      next(); // Proceed to the next middleware or route handler
    };
  }