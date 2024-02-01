import { Response, NextFunction } from "express";
import { TypedRequest } from "../typed-request.interface";
import { classicAdmin } from "../../global";

export function canFilterBy(keyFilter: string, keyUserId: string){
    return async (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => {
        if (req.user?.accessLevel! < classicAdmin) {
            if (req.query[keyFilter]) {
                return res.status(400).json({ message: `Non puoi filtrare tramite ${keyFilter}` }); // Return an error message if the user cannot filter by installation.
            } else {
                req.query[keyFilter] = req.user?.[keyUserId];
                next();
            }
        } else {
            next();
        }
    };      
}