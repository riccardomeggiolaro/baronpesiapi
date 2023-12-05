import { genericErrorHandler } from "./generic";
import { notFoundHandler } from "./not-found";
import { validationErrorHandler } from "./validation";

// Create an array of errors for when I launch next()
export const errorHandlers = [notFoundHandler, validationErrorHandler, genericErrorHandler];