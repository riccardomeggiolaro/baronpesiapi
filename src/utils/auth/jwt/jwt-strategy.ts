import passport from "passport";
import { UserORM } from "../../../api/user/user.entity";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { toPlainObject } from "lodash";
import * as gbl from "../../../global";
import { InstallationORM } from "../../../api/installation/installation.entity";

passport.use("jwt_user", new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    async (token, done) => {
        try{
            const user = await UserORM
                .createQueryBuilder("users")
                .leftJoinAndMapOne("users.installationId", InstallationORM, "installations", "users.installationId = installations.id")
                .where("users.id = :id", { id: token.id })
                .getOne()
            if(user && user.able){
                const data = toPlainObject(user);
                return done(null, data);
            }else if(user && !user.able){
                return done(null, false, {message: 'non abilitato'});                
            }else{
                return done(null, false, {message: 'token non valido'});
            }
        }catch(err){
            done(err);
        }
    }
))

passport.use("jwt_admin", new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    async (token, done) => {
        try{
            const user = await UserORM.createQueryBuilder("users")
                .leftJoinAndMapOne("users.installationId", InstallationORM, "installations", "users.installationId = installations.id")
                .where("users.id = :id", { id: token.id })
                .getOne()
            console.log(user)
            if(user && user.accessLevel >= gbl.classicAdmin && user.able){
                const data = toPlainObject(user);
                return done(null, data);
            }else if(user && user.accessLevel >= gbl.classicAdmin && !user.able){
                return done(null, false, {message: 'non abilitato'});                
            }else{
                return done(null, false, {message: 'token non valido'});
            }
        }catch(err){
            done(err);
        }
    }
))

passport.use("jwt_super_admin", new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    async (token, done) => {
        try{
            const user = await UserORM.createQueryBuilder("users")
                .leftJoinAndMapOne("users.installationId", InstallationORM, "installations", "users.installationId = installations.id")
                .where("users.id = :id", { id: token.id })
                .getOne()
            console.log(user)
            if(user && user.accessLevel === gbl.superAdmin && user.able){
                const data = toPlainObject(user);
                return done(null, data);
            }else if(user && user.accessLevel === gbl.superAdmin && !user.able){
                return done(null, false, {message: 'non abilitato'});                
            }else{
                return done(null, false, {message: 'token non valido'});
            }
        }catch(err){
            done(err);
        }
    }
))