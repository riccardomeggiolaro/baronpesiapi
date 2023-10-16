import { Request, Response, NextFunction } from "express"
import InstallationService from "./installations.services";
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import { FilterInstallationDTO, IDInstallationDTO, InstallationDTO, UpdateDTO } from "./installations.dto";
import * as gbl from "../../global";
import { hasKeyValuePairs } from "../../utils/has-values-object";

export const addInstallation = async (req: TypedRequest<InstallationDTO>, res: Response, next: NextFunction) => {
    const newInstallation = await InstallationService.add(req.body);
    return res.status(201).json(newInstallation);
}

export const listInstallations = async (req: TypedRequest<any, FilterInstallationDTO>, res: Response, next: NextFunction) => {
    const installations = await InstallationService.list(req.query);
    res.json(installations);
}

export const getInstallationDefault = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const accessLevel = req.user?.accessLevel!;
        const id = req.user?.installationId?.id;
        if(accessLevel > gbl.classicAdmin) return res.json({message: "You haven't an Installation of default, you can access to all of them beacuse you are admin"})
        if(accessLevel < gbl.superAdmin && !id) return res.json({message: "your installation assigned may have been deleted or not exist"})
        const found = await InstallationService.getByIdWithError(id!);
        res.json(found);
    }catch(err){
        next(err);
    }
}

export const getOneInstallation = async (req: TypedRequest<any, ParsedQs, IDInstallationDTO>, res: Response, next: NextFunction) => {
    try{
        const found = await InstallationService.getByIdWithError(req.params.id);
        return res.json(found);
    }catch(err){
        next(err);
    }
}

export const updateInstallation = async (req: TypedRequest<UpdateDTO, ParsedQs, IDInstallationDTO>, res: Response, next: NextFunction) => {
    try{
        if(!await hasKeyValuePairs(req.body)) return res.json({message: "Nothing to update"});
        await InstallationService.update(req.params.id, req.body);
        return res.status(200).json({message: `Installation ${req.params.id} changed with succesfully`});
    }catch(err){
        next(err);
    }
}

export const deleteInstallation = async (req: TypedRequest<any, ParsedQs, IDInstallationDTO>, res: Response, next: NextFunction) => {
    try{
        await InstallationService.delete(req.params.id);
        return res.json({message: `Installation ${req.params.id} deleted`});
    }catch(err){
        next(err)
    }
}