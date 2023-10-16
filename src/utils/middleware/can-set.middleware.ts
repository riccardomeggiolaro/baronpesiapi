import { TypedRequest, ParsedQs } from "../typed-request.interface";
import { ExistUsernameTDO, UpdateUserDTO } from "../../api/user/user.dto";
import { Response, NextFunction } from "express";
import UserService from "../../api/user/user.services";

export function canSetDelete(action: "update" | "delete"){
    return async (req: TypedRequest<any, ParsedQs, ExistUsernameTDO>, res: Response, next: NextFunction) => {
        if(action === "update") {
            req.body as UpdateUserDTO;
            if(req.body.accessLevel >= req.user?.accessLevel!) return res.status(400).json({message: "Non puoi assegnare un livello di accesso maggiore o uguale del tuo"});
        }
        const user = await UserService.getUserByUsername(req.params.username);
        if(req.params.username === req.user?.username) return res.status(400).json({message: `Non puoi ${action} te stesso`});
        if(user && user!.accessLevel > req.user?.accessLevel!) return res.status(400).json({message: `Non puoi ${action} un utente con un livello di accesso maggiore del tuo`});
        next();
    }
}