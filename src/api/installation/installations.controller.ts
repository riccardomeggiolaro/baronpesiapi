import { Request, Response, NextFunction } from "express"
import InstallationService from "./installations.services";
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import { FilterInstallationDTO, IDInstallationDTO, InstallationDTO, UpdateDTO } from "./installations.dto";
import * as gbl from "../../global";
import { hasKeyValuePairs } from "../../utils/has-values-object";

export const addInstallation = async (req: TypedRequest<InstallationDTO>, res: Response, next: NextFunction) => {
    try {
        const newInstallation = await InstallationService.add(req.body); // Attempt to create a new installation using the InstallationService.
        return res.status(201).json(newInstallation); // If the installation was created successfully, send a 201 Created response with the new installation data.
    } catch (err) {
        next(); // Pass errors to the next middleware handler
    }
}

export const listInstallations = async (req: TypedRequest<any, FilterInstallationDTO>, res: Response, next: NextFunction) => {
    try {
        const installations = await InstallationService.list(req.query); // Retrieve a list of installations using the InstallationService, applying the filtering criteria specified in the request query parameters.
        res.json(installations); // If the installations were retrieved successfully, send a JSON response containing the list of installations.
    } catch (err) {
        next(); // Pass errors to the next middleware handler
    }
}

export const getInstallationDefault = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const accessLevel = req.user?.accessLevel!; // Retrieve the access level of the authenticated user.
        const id = req.user?.installationId?.id; // Retrieve the ID of the default installation for the authenticated user.
        if (accessLevel > gbl.classicAdmin) return res.json({message: "Non hai un'installazione assegnata, puoi accedere a tutte perchè sei un amministratore"});
        // Check if the user is not a super admin and does not have a default installation assigned.
        if (accessLevel < gbl.superAdmin && !id) return res.json({message: "La tua installazione assegnata può essere stata eliminata o non esiste"});
        const found = await InstallationService.getByIdWithError(id!); // Retrieve the default installation for the authenticated user using the InstallationService.
        res.json(found); // If the default installation was retrieved successfully, send a JSON response containing the installation data.
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
}

export const getOneInstallation = async (req: TypedRequest<any, ParsedQs, IDInstallationDTO>, res: Response, next: NextFunction) => {
    try{
        const found = await InstallationService.getByIdWithError(req.params.id); // Retrieve the specified installation using the InstallationService.
        return res.json(found); // If the default installation was retrieved successfully, send a JSON response containing the installation data.
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
}

export const updateInstallation = async (req: TypedRequest<UpdateDTO, ParsedQs, IDInstallationDTO>, res: Response, next: NextFunction) => {
    try{
        if(!await hasKeyValuePairs(req.body)) return res.json({message: "Niente da aggiornare"}); // Check if the request body contains any key-value pairs. If not, send a response indicating that there is nothing to update.
        await InstallationService.update(req.params.id, req.body); // Update the specified installation using the InstallationService.
        return res.status(200).json({message: `Installazione ${req.params.id} modificata con successo`}); // If the installation was updated successfully, send a 200 OK response indicating that the update was successful.
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
}

export const deleteInstallation = async (req: TypedRequest<any, ParsedQs, IDInstallationDTO>, res: Response, next: NextFunction) => {
    try{
        await InstallationService.delete(req.params.id); // Delete the specified installation using the InstallationService.
        return res.json({message: `Installazione ${req.params.id} eliminata`}); //  If the installation was deleted successfully, send a JSON response indicating that the deletion was successful.
    }catch(err){
        next(err) // Pass errors to the next middleware handler
    }
}