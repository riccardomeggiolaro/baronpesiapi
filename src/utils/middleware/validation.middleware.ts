import { plainToClass } from "class-transformer";
import { Response, NextFunction } from "express";
import { validate as classValidate } from "class-validator";
import { ValidationError } from "../../errors/validation";
import { ParamsDictionary, ParsedQs, TypedRequest } from "../typed-request.interface";

export function validate<T extends object>(type: (new() => T), origin: 'body'): (req: TypedRequest<T, any, ParamsDictionary>, res: Response, next: NextFunction) => Promise<void>;
export function validate<T extends object>(type: (new() => T), origin: 'query'): (req: TypedRequest<any, T, ParamsDictionary>, res: Response, next: NextFunction) => Promise<void>;
export function validate<T extends object>(type: (new() => T), origin: 'params'): (req: TypedRequest<any, ParsedQs, T>, res: Response, next: NextFunction) => Promise<void>;
export function validate<T extends object>(type: (new() => T)): (req: TypedRequest<T, any, any>, res: Response, next: NextFunction) => Promise<void>;
export function validate<T extends object> (type: (new() => T), origin: 'body' | 'query' | "params" = 'body'){
    return async (req: TypedRequest<any, ParsedQs, ParamsDictionary>, res: Response, next: NextFunction) => {
        // Extract data from the specified origin (body, query, or params)
        const data = plainToClass(type, req[origin]);      
        // Validate the extracted data against the specified TypeScript class
        const errors = await classValidate(data, {whitelist: true, forbidNonWhitelisted: true});
        // Check if any validation errors occurred
        if (errors.length) {
            // If errors exist, create a ValidationError and pass it to the next middleware handler
            next(new ValidationError(errors));
        } else {
            // If validation is successful, store the validated data back in the request object
            req[origin] = data;
            // Proceed to the next middleware handler
            next();
        }
    };      
}