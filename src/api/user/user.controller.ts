import { Request, Response, NextFunction } from "express";
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import UserService from "./user.services";
import { ExistUsernameTDO, FilterUserDTO, PasswordDTO, UpdateLastAcces, UpdateUserDTO, UsernameDTO } from "./user.dto";
import * as bcrypt from "bcrypt";
import { NotExistsError } from "../../errors/not-exist";
import { omit } from "lodash";
import { hasKeyValuePairs } from "../../utils/has-values-object";

export const me = async(req: Request, res: Response, next: NextFunction) => {
    res.json(req.user);
}

export const list = async (req: TypedRequest<any, FilterUserDTO>, res: Response, next: NextFunction) => {
    try{
        const list = await UserService.list(req.query);
        return res.json(list);
    }catch(err){
        next(err);
    }
}

export const getUser = async (req: TypedRequest<any, ParsedQs, UsernameDTO>, res: Response, next: NextFunction) => {
    try{
        const user = await UserService.getUserByUsernameWithError(req.params.username);
        return res.json(user);
    }catch(err){
        next(err);
    }
}

export const deleteUser = async (req: TypedRequest<any, ParsedQs, ExistUsernameTDO>, res: Response, next: NextFunction) => {
    try{
        await UserService.delete(req.params.username);
        return res.json({message: `Utente ${req.params.username} eliminato`});
    }catch(err){
        if(err instanceof NotExistsError){
            return res.send(err.message);
        }
        next(err);
    }
}

export const updateUser = async (req: TypedRequest<UpdateUserDTO, ParsedQs, ExistUsernameTDO>, res: Response, next: NextFunction) => {
    try{
        if(!await hasKeyValuePairs(req.body)) return res.json({message: "Niente da aggiornare"});
        let list: object = omit(req.body, "password");
        if(req.body.password){
            const hash = await UserService.hashPAssword(req.body.password);
            list["hashedPassword"] = hash;
        }
        await UserService.update(req.params.username, list);
        return res.status(200).json({message: `Utente ${req.params.username} modificato con successo`});
    }catch(err){
        next(err);
    }
}

export const updatePassword = async (req: TypedRequest<PasswordDTO>, res: Response, next: NextFunction) => {
    try{
        if(!await bcrypt.compare(req.body.oldPassword, req.user?.hashedPassword!)){
            return res.status(400).json({message: "La password vecchia non è corretta"});
        }
        const newPassword = await UserService.hashPAssword(req.body.repeatPassword);
        await UserService.update(req.user?.username!, {hashedPassword: newPassword})
        res.status(200).json({message: "Password cambiata con successo"});
    }catch(err){
        next(err);
    }
}

export const updateLastAccess = async (req: TypedRequest<UpdateLastAcces>, res: Response, next: NextFunction) => {
    try{
        await UserService.update(req.user?.username!, {lastAccess: new Date(req.body.date) || null});
        return res.sendStatus(200);
    }catch(err){
        next(err)
    }
}