import { Response, NextFunction } from "express";
import { TypedRequest } from "../typed-request.interface";
import { classicAdmin, superAdmin } from "../../global";

export function isToAssign(action: "filters"): (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => Promise<Response>;
export function isToAssign(action: "filters" | "update"){
    // This middleware function checks if the current user has the necessary permissions to perform the specified action ("add", "filters", or "update") on events.
    return async (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => {
        // Check if the current user's access level is less than superAdmin.
        if (req.user?.accessLevel! < superAdmin) {
            // If the action is "filters", check if the user has permission to filter events.
            if (action === "filters") {
                // If the user is not a classic admin and is filtering by installation, return an error message.
                if (req.user?.accessLevel! < classicAdmin && req.query.idInstallation) {
                    return res.status(400).json({ message: "Non puoi filtrare tramite installazione" }); // Return an error message if the user cannot filter by installation.
                }      
                // If the user is not a classic admin and is not filtering by installation, set filter installatioId with him installation assigned.
                else if(req.user?.accessLevel! < classicAdmin && !req.query.idInstallation){
                    req.query.idInstallation = req.user?.installationId?.id;
                    next();
                }
                // If the user is not filtering by installation or is filtering by installation but is a classic admin, proceed to the next middleware or route handler.
                else {
                    next(); // Proceed to the next middleware or route handler.
                }
            }
        }      
        // If the current user is a superAdmin, no additional checks are required.
        else {
           // Proceed to the next middleware or route handler for each action.
            if (action === "filters") {
                next();
            }
        }
    };      
}