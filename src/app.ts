import Express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import Router from "./api/router";
import { DataSource } from "typeorm";
import { errorHandlers } from "./errors";
import { UserORM } from "./api/user/user.entity";
import { InstallationORM } from "./api/installation/installation.entity";
import { SubjectORM } from "./api/subject/subject.entity";
import { CardORM } from "./api/card/card.entity";
import { EventORM } from "./api/event/event.entity";
import { toNumber } from "lodash";
// a middleware that enhances security by adding Content Security Policy (CSP) headers
var helmet = require("helmet"); 
// a middleware that compresses responses to reduce their size
var compression = require("compression");

// Create Express app instance
export const app = Express();

// Configure database connection using TypeORM
export const AppDataSource = new DataSource({
  type: "mysql", // Specify MySQL as the database type
  host: process.env.HOST_DB, // Set the database host using the HOST_DB environment variable
  port: toNumber(process.env.PORT_DB), // Set the database port using the PORT_DB environment variable, converting it to a number
  username: process.env.USERNAME_DB, // Set the database username using the USERNAME_DB environment variable
  password: process.env.PASSWORD_DB, // Set the database password using the PASSWORD_DB environment variable
  database: process.env.NAME_DB, // Set the database name using the NAME_DB environment variable
  entities: [UserORM, SubjectORM, CardORM, InstallationORM, EventORM], // Define the entities to be managed by TypeORM
  synchronize: false, // Disable automatic synchronization of the schema with the database
  logging: false, // Disable logging by default
});

// Set CORS options to define allowed origins, methods, and headers
const corsOptions = {
  // origin: ORIGIN, // Optionally specify allowed origins (e.g., 'https://example.com')
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allow GET, POST, PATCH, and DELETE methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow Content-Type and Authorization headers
};

// Apply middleware to the Express app
app.use(compression()); // Enable compression middleware for reducing response size
app.use(cors(corsOptions)); // Enable CORS middleware with specified options
app.use(morgan("tiny")); // Enable Morgan middleware for logging HTTP requests in a concise format
app.use(bodyParser.json()); // Enable body-parser middleware for parsing JSON requests
app.use(helmet()); // Enable helmet middleware for CSP security

// Mount the main router at the '/api' path
app.use("/api", Router);

// Apply error handlers to catch and handle any errors that occur during routing
app.use(errorHandlers);