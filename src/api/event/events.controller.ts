import { Response, NextFunction } from "express"
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import { EventDTO, FilterEventDTO, IDEventDTO, UpdateEventDTO } from "./events.dto";
import CardService from "../card/cards.services";
import EventService from "./events.services";
import { hasKeyValuePairs } from "../../utils/has-values-object";
import { Between, LessThan, Like, MoreThan } from "typeorm";
import InstallationService from "../installation/installations.services";

export const addEvent = async (req: TypedRequest<EventDTO>, res: Response, next: NextFunction) => {
    try{
        const card = await CardService.getByCardCodeAndInstallation(req.body.cardCode, req.body.idInstallation || null);
        if(!card) return res.status(400).json({message: `Carta non assegnata alla stazione ${req.body.idInstallation}`})
        const newEvent = await EventService.add(req.body);
        return res.status(201).json(newEvent);
    }catch(err){
        next(err);
    }
}

export const listEvents = async (req: TypedRequest<any, FilterEventDTO>, res: Response, next: NextFunction) => {
    try{
        const events = await EventService.list(req.query);
        return res.json(events);
    }catch(err){
        next(err);
    }
}

export const getOneEvent = async (req: TypedRequest<any, ParsedQs, IDEventDTO>, res: Response, next: NextFunction) => {
    try{
        const event = await EventService.getByIdAndInstallationWithError(req.params.id, req.user?.installationId?.id! || null);
        return res.json(event);
    }catch(err){
        next(err);
    }
}

export const updateEvent = async (req: TypedRequest<UpdateEventDTO, ParsedQs, IDEventDTO>, res: Response, next: NextFunction) => {
    try{
        await EventService.getByIdAndInstallationWithError(req.params.id, req.user?.installationId?.id! || null);
        if(!await hasKeyValuePairs(req.body)) return res.json({message: "Niente da aggiornare"});
        await EventService.update(req.params.id, req.body);
        return res.status(200).json({message: `Evento ${req.params.id} modificato con successo`});
    }catch(err){
        next(err);
    }
}

export const deleteEvent = async (req: TypedRequest<any, ParsedQs, IDEventDTO>, res: Response, next: NextFunction) => {
    try{
        await EventService.delete(req.params.id, req.user?.installationId?.id! || null);
        return res.json({message: `Evento ${req.params.id} eliminato`});
    }catch(err){
        next(err)
    }
}