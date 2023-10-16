import { NextFunction, Request, Response } from "express";

export class AccessLevelError extends Error {
  constructor() {
    super();
    this.name = 'AccessLevelError';
    this.message = "Non puoi modificare o eliminare un utente che ha il livello di accesso maggiore o uguale al tuo";
  }
}