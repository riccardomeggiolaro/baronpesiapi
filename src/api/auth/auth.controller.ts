import { Request, Response, NextFunction } from "express";
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import { FirstUserDTO, LoginUserDTO, SigninUserDTO } from "./auth.dto";
import { omit, pick, toPlainObject } from "lodash";
import UserService from "../user/user.services";
import { JustExistsError } from "../../errors/user-exists";
import passport from "passport";
import * as jwt from "jsonwebtoken";
import { User } from "../user/user.interface";
import { NotExistsError } from "../../errors/not-exist";
import InstallationService from "../installation/installations.services";
import { superAdmin } from "../../global";
import { iUser } from "../../utils/auth/auth.handlers";
import { UsernameDTO } from "../user/user.dto";

export const signin = async (req: TypedRequest<SigninUserDTO>, res: Response, next: NextFunction) => {
    try{
        if(req.body.accessLevel && req.body.accessLevel >= req.user?.accessLevel!){
            return res.status(400).json({message: "Non puoi assegnare un livello di accesso maggiore o uguale al tuo"});
        }
        const userData: User = omit(req.body, 'username', 'password', 'idInstallation');
        const credentials = pick(req.body, 'username', 'password');
        if(req.body.idInstallation){
            const installation = await InstallationService.getById(req.body.idInstallation);
            userData.installationId = installation?.id!
        }
        const newUser = await UserService.add(userData, credentials);
        res.json(newUser);
    }catch(err){
        if(err instanceof JustExistsError || err instanceof NotExistsError){
            return res.status(400).send(err.message);
        }
        next(err);
    }
}

export const signinFirstUser = async (req: TypedRequest<FirstUserDTO>, res: Response, next: NextFunction) => {
    try{
        const userData: User = {
            accessLevel: superAdmin
        };
        const credentials = req.body;
        const newUser = await UserService.add(userData, credentials);
        req.user = newUser as iUser
        console.log(req.user);
        const token = jwt.sign(toPlainObject(req.user), process.env.JWT_SECRET!, {expiresIn: '7 days'})
        return res.json({user: newUser, token: token});
    }catch(err){
        if(err instanceof JustExistsError || err instanceof NotExistsError){
            return res.status(400).send(err.message);
        }
        next(err);
    }
}

export const firstUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = await UserService.getOneUser();
        if(user) return res.send(true);
        else return res.send(false);
    }catch(err){
        next(err);
    }
}

export const login = async (req: TypedRequest<LoginUserDTO>, res: Response, next: NextFunction) => {
    try{
        passport.authenticate("local", (err, user, info) => {
            if(err){
                return next(err);
            }
            if(!user){
                return res.status(401).json({error: 'LoginError', code: info.message});
            }
            const token = jwt.sign(user, process.env.JWT_SECRET!, {expiresIn: '7 days'})
            return res.status(200).json({user: user, token: token});
        })(req, res, next);
    }catch(err){
        next(err);
    }
}