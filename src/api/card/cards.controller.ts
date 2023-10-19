import { Response, NextFunction } from "express"
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import { CardDTO, FilterCardDTO, IDCardDTO, UpdateCardDTO } from "./cards.dto";
import CardService from "./cards.services";
import { hasKeyValuePairs } from "../../utils/has-values-object";

export const addCard = async (req: TypedRequest<CardDTO>, res: Response, next: NextFunction) => {
    try{
        const newCard = await CardService.add(req.body);
        return res.status(201).json(newCard);
    }catch(err){
        next(err);
    }
}

export const listCards = async (req: TypedRequest<any, FilterCardDTO>, res: Response, next: NextFunction) => {
    try{
        const cards = await CardService.list(req.query);
        res.json(cards);
    }catch(err){
        next(err);
    }
}

export const getOneCard = async (req: TypedRequest<any, ParsedQs, IDCardDTO>, res: Response, next: NextFunction) => {
    try{
        const found = await CardService.getByIdAndInstallationWithError(req.params.id, req.user?.installationId?.id! || null);
        return res.json(found);
    }catch(err){
        next(err);
    }
}

export const updateCard = async (req: TypedRequest<UpdateCardDTO, ParsedQs, IDCardDTO>, res: Response, next: NextFunction) => {
    try{
        if(!await hasKeyValuePairs(req.body)) return res.json({message: "Nothing to update"});
        await CardService.update(req.params.id, req.body);
        return res.status(200).json({message: `Card ${req.params.id} changed with succesfully`});
    }catch(err){
        next(err);
    }
}

export const deleteCard = async (req: TypedRequest<any, ParsedQs, IDCardDTO>, res: Response, next: NextFunction) => {
    try{
        await CardService.delete(req.params.id, req.user?.installationId?.id! || null);
        return res.json({message: `Card ${req.params.id} deleted`});
    }catch(err){
        next(err)
    }
}