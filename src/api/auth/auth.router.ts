import { Router } from "express";
import { FirstUserDTO, LoginUserDTO, SigninUserDTO } from "./auth.dto";
import { firstUser, login, signin, signinFirstUser } from "./auth.controller";
import { validate } from "../../utils/middleware/validation.middleware";
import { isAdmin } from "../../utils/middleware/authentication.middleware";
import { thereIsntUser } from "../../utils/middleware/there-isnt-user.middleware";

const router = Router(); // Mount the third path for the end points at the '/auth' path

router.post("/signin", isAdmin, validate(SigninUserDTO), signin); // Check if the user is admin, validate the body and call the function signin
router.post("/signin/first-user", validate(FirstUserDTO), thereIsntUser(), signinFirstUser); // Validate the body, check if there is just some user and call the function signinFirstUser
router.get("/first-user", firstUser); // Get if there is first user
router.post("/login", validate(LoginUserDTO), login); // validate the body and call the function login

export default router; // Export the router