import { Request, Response, NextFunction } from "express";
import { TypedRequest } from "../../utils/typed-request.interface";
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

export const signin = async (req: TypedRequest<SigninUserDTO>, res: Response, next: NextFunction) => {
    try{
        // Check if the user is trying to add an user with an access level bigger than his
        if(req.body.accessLevel && req.body.accessLevel >= req.user?.accessLevel!){
            return res.status(400).json({message: "Non puoi assegnare un livello di accesso maggiore o uguale al tuo"});
        }
        const userData: User = omit(req.body, 'username', 'password', 'idInstallation'); // Create an object with body data exept for username, password and idInstallation
        const credentials = pick(req.body, 'username', 'password'); // Create an object that pick from body only username and password
        // If it was passed idInstallation
        if(req.body.installationId){
            const installation = await InstallationService.getById(req.body.installationId); // Find the installation
            userData.installationId = installation?.id! // Add the installation found to the object userData
        }
        const newUser = await UserService.add(userData, credentials); // Add the new user
        res.json(newUser); // Return new user
    }catch(err){
        // Handle specific errors
        if (err instanceof JustExistsError || err instanceof NotExistsError) {
            return res.status(400).send(err.message);
        }
        // Pass other errors to the next middleware handler
        next(err);
    }
}

export const signinFirstUser = async (req: TypedRequest<FirstUserDTO>, res: Response, next: NextFunction) => {
    try{
        const user = await UserService.getOneUser();
        if (user != null) {
            // If there is already a user, return an error message indicating that the first user has already been created.
            return res.status(400).json({ message: `Primo utente già creato` }); // Return an error message.
        }
        // Create a new user object with the superAdmin access level
        const userData: User = {
            accessLevel: superAdmin
        };  
        const credentials = req.body; // Extract credentials from the request body
        const newUser = await UserService.add(userData, credentials); // Add the new user using UserService.add
        req.user = newUser as iUser; // Set the newly created user as the current user in the request
        const token = jwt.sign(toPlainObject(req.user), process.env.JWT_SECRET!, { expiresIn: '7 days' }); // Generate a JWT token using jwt.sign  
        return res.json({ user: newUser, token: token }); // Return the new user and the generated token
    }catch(err){
        // Handle specific errors
        if (err instanceof JustExistsError || err instanceof NotExistsError) {
            return res.status(400).send(err.message);
        }  
        next(err); // Pass other errors to the next middleware handler
    }
};
  
export const firstUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = await UserService.getOneUser(); // Get one user  
        // Check if a user exists
        if(user){
            return res.send(true); // Send a response indicating that a user exists
        }else{
            return res.send(false); // Send a response indicating that no user exists
        }
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
};

export const login = async (req: TypedRequest<LoginUserDTO>, res: Response, next: NextFunction) => {
    try{
        // Attempt to authenticate the user using Passport's local strategy
        passport.authenticate("local", (err, user, info) => {
            // Handle any errors that occurred during authentication
            if(err){
                return next(err);
            }
            // Check if the user was successfully authenticated
            if(!user){
                return res.status(401).json({error: 'LoginError', code: info.message});  // Return an error response indicating invalid credentials
            }
            const token = jwt.sign(user, process.env.JWT_SECRET!, {expiresIn: '7 days'}) // Generate a JWT token using the logged-in user's information
            return res.status(200).json({user: user, token: token}); // Return a successful response with the user and the generated 
        })(req, res, next);
    }catch(err){
        next(err); // Pass any unexpected errors to the next middleware handler
    }
}