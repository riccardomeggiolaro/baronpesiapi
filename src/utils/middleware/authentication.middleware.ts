import passport from "passport";

export const isAuthenticated = passport.authenticate('jwt_user', {session: false})
export const isAdmin = passport.authenticate('jwt_admin', {session: false})