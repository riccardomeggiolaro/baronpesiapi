import { TypedRequest } from "../typed-request.interface";
import { Response, NextFunction } from "express";
import UserService from "../../api/user/user.services";
import { FirstUserDTO } from "../../api/auth/auth.dto";

export function thereIsntUser(){
    return async (req: TypedRequest<FirstUserDTO>, res: Response, next: NextFunction) => {
        const user = await UserService.getOneUser();
        if(user != null){
            return res.status(400).json({message: `Primo utente già creato`})
        }
        next();
    }
}