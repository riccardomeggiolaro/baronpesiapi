import { Response, NextFunction } from "express"
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import { CardDTO, FilterCardDTO, IDCardDTO, UpdateCardDTO } from "./cards.dto";
import CardService from "./cards.services";
import { hasKeyValuePairs } from "../../utils/has-values-object";

export const addCard = async (req: TypedRequest<CardDTO>, res: Response, next: NextFunction) => {
    try{
        const cardData = req.body; // Retrieve the card data from the request body
        const newCard = await CardService.add(cardData); // Add the new card using CardService.add
        return res.status(201).json(newCard); // Return a successful response with the newly created card
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
};
  
export const listCards = async (req: TypedRequest<any, FilterCardDTO>, res: Response, next: NextFunction) => {
    try{
        const filterParams: FilterCardDTO = req.query; // Extract filter parameters from the request query
        const cards = await CardService.list(filterParams); // Fetch cards using CardService.list, passing the filter parameters
        res.json(cards); // Return a successful response with the retrieved cards
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
};  

export const getOneCard = async (req: TypedRequest<any, ParsedQs, IDCardDTO>, res: Response, next: NextFunction) => {
    try{
        const found = await CardService.getByIdAndInstallationWithError(req.params.id, req.user?.installationId?.id! || null); // Find one card by id and installationId if exist
        return res.json(found); // Return a successful response with card found
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
}

export const updateCard = async (req: TypedRequest<UpdateCardDTO, ParsedQs, IDCardDTO>, res: Response, next: NextFunction) => {
    try{
        if(!await hasKeyValuePairs(req.body)) return res.json({message: "Niente da aggiornare"}); // Return if there isn't anything to update
        await CardService.update(req.params.id, req.user?.installationId?.id || null, req.body); // Update the card by id and installationId if exist
        return res.status(200).json({message: `Carta ${req.params.id} modificata con successo`}); // Return a successful response
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
}

export const deleteCard = async (req: TypedRequest<any, ParsedQs, IDCardDTO>, res: Response, next: NextFunction) => {
    try{
        await CardService.delete(req.params.id); // Delete card by id and installationId if exist
        return res.json({message: `Carta ${req.params.id} eliminata`}); // Return a successful response
    }catch(err){
        next(err) // Pass errors to the next middleware handler
    }
}