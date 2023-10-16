var rateLimit = require('express-rate-limit');

export const classicAdmin = 2
export const superAdmin = 3
export const PORT = process.env.PORT;
export const ORIGIN = process.env.ORIGIN;
export const HOST = process.env.HOST;
export const PORT_DB = parseInt(process.env.PORT_DB!);
export const USERNAME = process.env.USERNAME;
export const PASSWORD = process.env.PASSWORD;
export const DATABASE = process.env.DATABASE;

export const limiterLogin = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5
})

export const limiterChangePassword = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5
})