import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { toPlainObject } from "lodash";
import * as gbl from "../../../global";
import UserService from "../../../api/user/user.services";

// Define Passport JWT strategy for user authentication (jwt_user)
passport.use(
  "jwt_user",
  new JwtStrategy(
    {
      // Extract JWT token from the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Secret key for verifying the JWT token
      secretOrKey: process.env.JWT_SECRET,
    },
    async (token, done) => {
      try {
        // Retrieve user data from the database using the token's ID
        const user = await UserService.getUserById(token.id);

        // Check if the user needs installation assigned but doesn't have it
        if (user?.accessLevel! < gbl.classicAdmin && !user?.installationId){
          return done(null, false, { message: "Installazione non assegnata" })
        }
        // Check if the user exists and is able to log in
        if (user && user.able) {
          // Convert UserORM object to a plain object and pass it to Passport
          const data = toPlainObject(user);
          return done(null, data);
        } else if (user && !user.able) {
          // Return an error message if the user is not able to log in
          return done(null, false, { message: "non abilitato" });
        } else {
          // Return an error message if the token is invalid
          return done(null, false, { message: "token non valido" });
        }
      } catch (err) {
        // Handle any errors during user retrieval or validation
        done(err);
      }
    }
  )
);

// Define Passport JWT strategy for classic admin authentication (jwt_admin)
passport.use(
    "jwt_admin",
    new JwtStrategy(
      {
        // Extract JWT token from the Authorization header
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

        // Secret key for verifying the JWT token
        secretOrKey: process.env.JWT_SECRET,
      },
      async (token, done) => {
        try {
          // Retrieve user data from the database using the token's ID
          const user = await UserService.getUserById(token.id);
  
          // Check if the user exists, has classic admin access level, and is able to log in
          if (user && user.accessLevel >= gbl.classicAdmin && user.able) {
            // Convert UserORM object to a plain object and pass it to Passport
            const data = toPlainObject(user);
            return done(null, data);
          } else if (user && user.accessLevel >= gbl.classicAdmin && !user.able) {
            // Return an error message if the classic admin is not able to log in
            return done(null, false, { message: "non abilitato" });
          } else {
            // Return an error message if the token is invalid or the user does not have classic admin access level
            return done(null, false, { message: "token non valido" });
          }
        } catch (err) {
          // Handle any errors during user retrieval or validation
          done(err);
        }
      }
    )
);
  
passport.use("jwt_super_admin", new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT token from the Authorization header
      secretOrKey: process.env.JWT_SECRET // Secret key for verifying the JWT token
    },
    async (token, done) => {
      try {
        const user = await UserService.getUserById(token.id);
  
        if (user && user.accessLevel === gbl.superAdmin && user.able) { // Check if the user exists, has super admin access level, and is able to log in
          const data = toPlainObject(user); // Convert UserORM object to a plain object
          return done(null, data); // Pass user data to Passport
        } else if (user && user.accessLevel === gbl.superAdmin && !user.able) {
          return done(null, false, { message: "non abilitato" }); // Return error message if the super admin is not able to log in
        } else {
          return done(null, false, { message: "token non valido" }); // Return error message if the token is invalid or the user does not have super admin access level
        }
      } catch (err) {
        done(err); // Handle any errors during user retrieval or validation
      }
    }
));
  