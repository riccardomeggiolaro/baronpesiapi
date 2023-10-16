import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserORM } from "../../../api/user/user.entity";
import * as bcrypt from "bcrypt";
import { toPlainObject } from "lodash";
import UserService from "../../../api/user/user.services";
import { InstallationORM } from "../../../api/installation/installation.entity";

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        session: false
    },
    async (username, password, done) => {
        try{
            const identity = await UserORM
                .createQueryBuilder("users")
                .leftJoinAndMapOne("users.installationId", InstallationORM, "installations", "users.installationId = installations.id")
                .where("users.username = :username", { username: username })
                .getOne()
            if(!identity){
                return done(null, false, {message: `username: ${username} non trovato`});
            }
            if(identity && !identity.able) return done(null, false, {message: `${username} non abilitato`});
            const match = await bcrypt.compare(password, identity.hashedPassword);
            const data = toPlainObject(identity);
            if(match){
                await UserService.update(username, {lastAccess: null});
                return done(null, data);
            }
            done(null, false, {message: `password non valida`});
        }catch(err){
            done(err);
        }
    }
));
