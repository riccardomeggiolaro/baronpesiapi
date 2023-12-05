import { Response, NextFunction } from "express"
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import { FilterSubjectDTO, IDSubjectDTO, SubjectDTO, UpdateSubjectDTO } from "./subjects.dto";
import SubjectService from "./subject.services";
import { hasKeyValuePairs } from "../../utils/has-values-object";

export const addSubject = async (req: TypedRequest<SubjectDTO>, res: Response, next: NextFunction) => {
    try{
        // Attempt to create a new subject using the SubjectService
        const newSubject = await SubjectService.add(req.body); // Create a new subject based on request body data
        return res.status(201).json(newSubject); // Send the newly created subject object as JSON response with a 201 status code
    }catch(err) {
        next(err); // Pass the error to the Express error handler
    }
}

export const listSubjects = async (req: TypedRequest<any, FilterSubjectDTO>, res: Response, next: NextFunction) => {
    try {
        // Attempt to retrieve a list of subjects using the SubjectService
        const subjects = await SubjectService.list(req.query); // Retrieve subjects based on query parameters
        res.json(subjects); // Send the retrieved list of subjects as JSON response
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}

export const getOneSubject = async (req: TypedRequest<any, ParsedQs, IDSubjectDTO>, res: Response, next: NextFunction) => {
    try{
        // Attempt to retrieve the subject with the specified ID using the SubjectService
        const subject = await SubjectService.getByIdWithError(req.params.id); // Retrieve subject based on ID parameter
        if (subject) {
            return res.json(subject); // Send the retrieved subject object as JSON response if found
        }else{
            // Handle the case where the subject with the specified ID is not found
            res.status(404).json({ message: "Subject not found" });
        }
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}

export const updateSubject = async (req: TypedRequest<UpdateSubjectDTO, ParsedQs, IDSubjectDTO>, res: Response, next: NextFunction) => {
    try{
        // Check if there are any key-value pairs in the request body
        if (!await hasKeyValuePairs(req.body)) {
            return res.json({ message: "Niente da aggiornare" }); // Send message indicating no updates required
        }
        // Update the subject with the specified ID using the SubjectService
        await SubjectService.update(req.params.id, req.body); // Update subject based on ID parameter and request body data    
        return res.status(200).json({ message: `Subject ${req.params.id} modificato con successo` }); // Send a success message indicating the subject has been modified
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}

export const deleteSubject = async (req: TypedRequest<any, ParsedQs, IDSubjectDTO>, res: Response, next: NextFunction) => {
    try {
        // Attempt to delete the subject with the specified ID using the SubjectService
        await SubjectService.delete(req.params.id); // Delete subject based on ID parameter    
        return res.json({ message: `Soggetto ${req.params.id} eliminato` }); // Send a success message indicating the subject has been deleted
    }catch(err){
        next(err); // Pass the error to the Express error handler
    }
}