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
var helmet = require("helmet");
var compression = require("compression");

export const app = Express();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.HOST_DB,
    port: toNumber(process.env.PORT_DB),
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.NAME_DB,
    entities: [UserORM, SubjectORM, CardORM, InstallationORM, EventORM],
    synchronize: true,
    logging: false
})

const corsOptions = {
//    origin: ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(compression());
app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(helmet());

app.use("/api", Router);

app.use(errorHandlers);