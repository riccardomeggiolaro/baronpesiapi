import { Response, NextFunction } from "express"
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import { FilterSubjectDTO, IDSubjectDTO, SubjectDTO, UpdateSubjectDTO } from "./subjects.dto";
import SubjectService from "./subject.services";
import { hasKeyValuePairs } from "../../utils/has-values-object";

export const addSubject = async (req: TypedRequest<SubjectDTO>, res: Response, next: NextFunction) => {
    const newInstallation = await SubjectService.add(req.body);
    return res.status(201).json(newInstallation);
}

export const listSubjects = async (req: TypedRequest<any, FilterSubjectDTO>, res: Response, next: NextFunction) => {
    try{
        const installations = await SubjectService.list(req.query);
        res.json(installations);
    }catch(err){
        next(err);
    }
}

export const getOneSubject = async (req: TypedRequest<any, ParsedQs, IDSubjectDTO>, res: Response, next: NextFunction) => {
    try{
        const found = await SubjectService.getByIdWithError(req.params.id);
        return res.json(found);
    }catch(err){
        next(err);
    }
}

export const updateSubject = async (req: TypedRequest<UpdateSubjectDTO, ParsedQs, IDSubjectDTO>, res: Response, next: NextFunction) => {
    try{
        if(!await hasKeyValuePairs(req.body)) return res.json({message: "Niente da aggiornare"});
        await SubjectService.update(req.params.id, req.body);
        return res.status(200).json({message: `Installazione ${req.params.id} modificato con successo`});
    }catch(err){
        next(err);
    }
}

export const deleteSubject = async (req: TypedRequest<any, ParsedQs, IDSubjectDTO>, res: Response, next: NextFunction) => {
    try{
        await SubjectService.delete(req.params.id);
        return res.json({message: `Soggetto ${req.params.id} eliminato`});
    }catch(err){
        next(err)
    }
}