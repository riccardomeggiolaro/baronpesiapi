import { Response, NextFunction } from "express"
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import MaterialService from "./material.services";
import { hasKeyValuePairs } from "../../utils/has-values-object";
import { FilterMaterialDTO, IDMaterialDTO, MaterialDTO, UpdateMaterialDTO } from "./material.dto";

export const addMaterial = async (req: TypedRequest<MaterialDTO>, res: Response, next: NextFunction) => {
    try{
        const create = await MaterialService.add(req.body);
        return res.status(201).json(create);
    }catch(err) {
        next(err); // Pass the error to the Express error handler
    }
}

export const listMaterials = async (req: TypedRequest<any, FilterMaterialDTO>, res: Response, next: NextFunction) => {
    try {
        // Attempt to retrieve a list of subjects using the SubjectService
        const materials = await MaterialService.list(req.query); // Retrieve subjects based on query parameters
        res.json(materials); // Send the retrieved list of subjects as JSON response
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}

export const updateMaterial = async (req: TypedRequest<UpdateMaterialDTO, ParsedQs, IDMaterialDTO>, res: Response, next: NextFunction) => {
    try{
        // Check if there are any key-value pairs in the request body
        if (!await hasKeyValuePairs(req.body)) {
            return res.json({ message: "Niente da aggiornare" }); // Send message indicating no updates required
        }
        // Update the subject with the specified ID using the SubjectService
        await MaterialService.update(req.params.id, req.body); // Update subject based on ID parameter and request body data    
        return res.status(200).json({ message: `Material ${req.params.id} modificato con successo` }); // Send a success message indicating the subject has been modified
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}

export const deleteMaterial = async (req: TypedRequest<any, ParsedQs, IDMaterialDTO>, res: Response, next: NextFunction) => {
    try {
        // Attempt to delete the subject with the specified ID using the SubjectService
        await MaterialService.delete(req.params.id); // Delete subject based on ID parameter    
        return res.json({ message: `Materiale ${req.params.id} eliminato` }); // Send a success message indicating the subject has been deleted
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}