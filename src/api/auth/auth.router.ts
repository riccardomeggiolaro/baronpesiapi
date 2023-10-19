import { Router } from "express";
import { FirstUserDTO, LoginUserDTO, SigninUserDTO } from "./auth.dto";
import { firstUser, login, signin, signinFirstUser } from "./auth.controller";
import { validate } from "../../utils/middleware/validation.middleware";
import { isAdmin } from "../../utils/middleware/authentication.middleware";
import { thereIsntUser } from "../../utils/middleware/there-isnt-user.middleware";

const router = Router();

router.post("/signin", isAdmin, validate(SigninUserDTO), signin);
router.post("/signin/first-user", validate(FirstUserDTO), thereIsntUser(), signinFirstUser);
router.get("/first-user", firstUser);
router.post("/login", validate(LoginUserDTO), login);

export default router;