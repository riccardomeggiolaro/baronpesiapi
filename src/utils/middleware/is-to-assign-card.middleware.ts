import { Response, NextFunction } from "express";
import { TypedRequest } from "../typed-request.interface";
import { classicAdmin, superAdmin } from "../../global";
import { CardDTO, UpdateCardDTO } from "../../api/card/cards.dto";

export function isToAssign(action: "update"): (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => Promise<Response>;
export function isToAssign(action: "add"): (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => Promise<Response>;
export function isToAssign(action: "filters"): (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => Promise<Response>;
export function isToAssign(action: "add" | "filters" | "update"){
    return async (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => {
        if(req.user?.accessLevel! < superAdmin){
            if(action === "add"){
                return res.status(400).json({message: "Non puoi aggiungere una nuova carta"})
            }
            if(action === "filters"){
                if(req.user?.accessLevel! < classicAdmin && req.query.idInstallation) return res.status(400).json({message: "Non puoi filtrare tramite installazione"})
                else if(req.user?.accessLevel! < classicAdmin && !req.query.idInstallation) {
                    if(!req.user?.installationId?.id) return res.status(400).json({message: "Non hai una installazione assegnata"});
                    req.query.idInstallation = req.user?.installationId?.id;
                    next();
                }else next();
            }
            if(action === "update"){
                req.body = req.body as UpdateCardDTO;
                if(req.body.installationId) return res.status(400).json({message: "Non puoi assegnare una installazione"})
                if(req.body.cardCode) return res.status(400).json({message: "Non puoi assegnare un codice carta"})
                else next()
            }
        }else{
            if(action === "add"){
                let b = req.body as CardDTO;
                if(!b.idInstallation) return res.status(400).json({message: "Id installazione mancante"})
                else next()
            }
            if(action === "filters"){
                next();
            }
            if(action === "update"){
                next()
            }
        }
    }
}