import { Request, Response, NextFunction } from "express";
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import UserService from "./user.services";
import { ExistUsernameTDO, FilterUserDTO, PasswordDTO, UpdateLastAcces, UpdateUserDTO, UsernameDTO } from "./user.dto";
import * as bcrypt from "bcrypt";
import { NotExistsError } from "../../errors/not-exist";
import { omit } from "lodash";
import { hasKeyValuePairs } from "../../utils/has-values-object";

export const me = async(req: Request, res: Response, next: NextFunction) => {
    try{
        res.json(req.user); // Response succesful with personal data
    }catch(err){
        next(); // Pass the error to the Express error handler
    }
}

export const list = async (req: TypedRequest<any, FilterUserDTO>, res: Response, next: NextFunction) => {
    try{
        // Attempt to retrieve the list of users using the UserService
        const list = await UserService.list(req.query); // Retrieve user list based on query parameters
        return res.json(list); // Send the retrieved user list as JSON response
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}

export const getUser = async (req: TypedRequest<any, ParsedQs, UsernameDTO>, res: Response, next: NextFunction) => {
    try{
        // Attempt to retrieve the user with the specified username
        const user = await UserService.getUserByUsernameWithError(req.params.username); // Retrieve user based on username parameter
        return res.json(user); // Send the retrieved user object as JSON response
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}

export const deleteUser = async (req: TypedRequest<any, ParsedQs, ExistUsernameTDO>, res: Response, next: NextFunction) => {
    try{
        // Attempt to delete the user with the specified username
        await UserService.delete(req.params.username); // Delete user based on username parameter
        return res.json({ message: `Utente ${req.params.username} eliminato` }); // Send success message as JSON response
    }catch(err){
        if (err instanceof NotExistsError) { // Check if error is of type NotExistsError
          return res.send(err.message); // Send error message specific to NotExistsError
        }
        next(err); // Otherwise, pass the error to the Express error handler
    }
}

export const updateUser = async (req: TypedRequest<UpdateUserDTO, ParsedQs, ExistUsernameTDO>, res: Response, next: NextFunction) => {
    try{
        // Check if there are any key-value pairs in the request body
        if (!await hasKeyValuePairs(req.body)) {
          return res.json({ message: "Niente da aggiornare" }); // Send message indicating no updates required
        }
        let list: object = omit(req.body, "password"); // Create a new object to hold the updated user data, excluding the "password" property
        // Handle password update if provided
        if (req.body.password) {
            const hash = await UserService.hashPAssword(req.body.password); // Hash the provided password
            list["hashedPassword"] = hash; // Add the hashed password to the update object
        }
        await UserService.update(req.params.username, list); // Update the user's data using the UserService
        return res.status(200).json({ message: `Utente ${req.params.username} modificato con successo` }); // Send a success message indicating the user has been modified
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}

export const updatePassword = async (req: TypedRequest<PasswordDTO>, res: Response, next: NextFunction) => {
    try{
        // Verify the provided old password matches the user's stored hashed password
        if (!await bcrypt.compare(req.body.oldPassword, req.user?.hashedPassword!)) {
          return res.status(400).json({ message: "La password vecchia non è corretta" }); // Send error message if old password is incorrect
        }
        const newPassword = await UserService.hashPAssword(req.body.repeatPassword); // Hash the provided new password
        await UserService.update(req.user?.username!, { hashedPassword: newPassword }); // Update the user's password with the hashed new password
        res.status(200).json({ message: "Password cambiata con successo" }); // Send a success message indicating the password has been changed
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}

export const updateLastAccess = async (req: TypedRequest<UpdateLastAcces>, res: Response, next: NextFunction) => {
    try{
        const lastAccessDate = new Date(req.body.date) || null; // Extract the last access date from the request body
        await UserService.update(req.user?.username!, { lastAccess: lastAccessDate }); // Update the user's last access timestamp with the provided date or null if not provided
        return res.sendStatus(200); // Send a success status code indicating the last access timestamp has been updated
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}