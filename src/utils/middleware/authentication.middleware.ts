import passport from "passport";

// created authorization middlewares to called at the beginning of functions
export const isAuthenticated = passport.authenticate('jwt_user', {session: false})
export const isAdmin = passport.authenticate('jwt_admin', {session: false})
export const isSuperAdmin = passport.authenticate('jwt_super_admin', {session: false})