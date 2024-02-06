import { Response, NextFunction } from "express";
import { TypedRequest } from "../typed-request.interface";
import { classicAdmin } from "../../global";

export function canFilterByInstallation(){
    return async (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => {
        if (req.user?.accessLevel! < classicAdmin) {
            if (req.query.installationId) {
                return res.status(400).json({ message: `Non puoi filtrare tramite installazione` }); // Return an error message if the user cannot filter by installation.
            } else {
                req.query.installationId = req.user?.installationId?.id;
                next();
            }
        } else {
            next();
        }
    };      
}