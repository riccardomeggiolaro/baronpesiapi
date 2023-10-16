import { Response, NextFunction } from "express";
import { TypedRequest } from "../typed-request.interface";
import { classicAdmin } from "../../global";
import { CardDTO, UpdateCardDTO } from "../../api/card/cards.dto";

export function isToAssign(action: "update"): (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => Promise<Response>;
export function isToAssign(action: "add"): (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => Promise<Response>;
export function isToAssign(action: "filters"): (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => Promise<Response>;
export function isToAssign(action: "add" | "filters" | "update"){
    return async (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => {
        if(req.user?.accessLevel! < classicAdmin){
            if(action === "add"){
                req.body = req.body as CardDTO;
                if(req.body.idInstallation) return res.status(400).json({message: "Non puoi scegliere un installazione"})
                else {
                    req.body.idInstallation = req.user?.installationId;
                    next();
                }
            }
            if(action === "filters"){
                if(req.query.idInstallation) return res.status(400).json({message: "Non puoi filtrare tramite instllazione"})
                else {
                    req.query.idInstallation = req.user?.installationId;
                    next();
                }
            }
            if(action === "update"){
                req.body = req.body as UpdateCardDTO;
                if(req.body.idInstallation) return res.status(400).json({message: "Non puoi assegnare un installazione"})
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