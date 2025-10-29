import Express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import { DataSource } from "typeorm";
import { toNumber } from "lodash";
import Router from "./api/router";
import { errorHandlers } from "./errors";
import { UserORM } from "./api/user/user.entity";
import { InstallationORM } from "./api/installation/installation.entity";
import { CardORM } from "./api/card/card.entity";
import { EventORM } from "./api/event/event.entity";
import { SubjectORM } from "./api/subject/subject.entity";
import { MaterialORM } from "./api/material/material.entity";

// Create Express app instance
export const app = Express();

// Configure database connection using TypeORM
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST_DB,
  port: toNumber(process.env.PORT_DB),
  username: process.env.USERNAME_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.NAME_DB,
  entities: [UserORM, SubjectORM, CardORM, InstallationORM, EventORM, MaterialORM],
  synchronize: false,
  logging: false,
  timezone: "Z", // Usa UTC per la connessione al database
  // Oppure: timezone: "+02:00" se vuoi forzare l'ora italiana
});

// Set CORS options to define allowed origins, methods, and headers
const corsOptions = {
  // origin: ['https://example.com'], // Specifica i domini consentiti in produzione
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Abilita l'invio di credenziali (cookies, headers di autorizzazione)
};

// Apply middleware to the Express app
app.use(compression()); // Enable response compression
app.use(cors(corsOptions)); // Enable CORS with specified options
app.use(morgan("tiny")); // Enable HTTP request logging
app.use(bodyParser.json({ limit: '10mb' })); // Parse JSON requests with size limit
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded requests
app.use(helmet()); // Enable security headers

// Mount the main router at the '/api' path
app.use("/api", Router);

// Apply error handlers to catch and handle any errors that occur during routing
app.use(errorHandlers);