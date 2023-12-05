import passport from "passport"; // Import Passport for authentication
import { Strategy as LocalStrategy } from "passport-local"; // Import LocalStrategy for username and password authentication
import { UserORM } from "../../../api/user/user.entity"; // Import UserORM entity for accessing user data
import * as bcrypt from "bcrypt"; // Import bcrypt for password hashing and comparison
import { toPlainObject } from "lodash"; // Import toPlainObject function from Lodash for converting UserORM object to plain object
import UserService from "../../../api/user/user.services"; // Import UserService for updating user last access timestamp
import { InstallationORM } from "../../../api/installation/installation.entity"; // Import InstallationORM entity for accessing installation data

passport.use(new LocalStrategy(
  {
    usernameField: "username", // Specify the username field in the request
    passwordField: "password", // Specify the password field in the request
    session: false // Disable session management
  },
  async (username, password, done) => {
    try {
      // Retrieve user data using the provided username
      const identity = await UserORM.createQueryBuilder("users")
        .leftJoinAndMapOne("users.installationId", InstallationORM, "installations", "users.installationId = installations.id")
        .where("users.username = :username", { username: username })
        .getOne();

      // Check if the user exists
      if (!identity) {
        return done(null, false, { message: `username: ${username} non trovato` }); // Return error message if username is not found
      }

      // Check if the user is able to log in
      if (identity && !identity.able) {
        return done(null, false, { message: `${username} non abilitato` }); // Return error message if user is not able to log in
      }

      // Compare the provided password with the user's hashed password
      const match = await bcrypt.compare(password, identity.hashedPassword);

      // Check if the password is valid
      if (match) {
        // Update the user's last access timestamp
        await UserService.update(username, { lastAccess: null });

        // Convert UserORM object to a plain object and pass it to Passport
        const data = toPlainObject(identity);
        return done(null, data);
      }

      // Return error message if the password is invalid
      done(null, false, { message: "password non valida" });
    } catch (err) {
      // Handle any errors during user retrieval or password comparison
      done(err);
    }
  }
));
