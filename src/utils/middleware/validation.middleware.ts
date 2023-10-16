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
        const data = plainToClass(type, req[origin]);
        const errors = await classValidate(data, {whitelist: true, forbidNonWhitelisted: true});
        if(errors.length){
            next(new ValidationError(errors));
        } else {
            req[origin] = data
            next();
        }
    }
}