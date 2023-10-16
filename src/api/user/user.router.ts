import { Router } from "express";
import { isAdmin, isAuthenticated } from "../../utils/middleware/authentication.middleware";
import { deleteUser, getUser, list, me, updateLastAccess, updatePassword, updateUser } from "./user.controller";
import { validate } from "../../utils/middleware/validation.middleware";
import { ExistUsernameTDO, FilterUserDTO, PasswordDTO, UpdateLastAcces, UpdateUserDTO, UsernameDTO } from "./user.dto";
import { canSetDelete } from "../../utils/middleware/can-set.middleware";

const router = Router();

router.get("/me", isAuthenticated, me);
router.get("/list", isAdmin, validate(FilterUserDTO, "query"), list);
router.get("/:username", isAdmin, validate(UsernameDTO, "params"), getUser);
router.delete("/:username", isAdmin, validate(ExistUsernameTDO, "params"), canSetDelete("delete"), deleteUser);
router.patch("/update/last-access", isAuthenticated, validate(UpdateLastAcces, "body"), updateLastAccess);
router.patch("/update/change-password", isAuthenticated, validate(PasswordDTO, "body"), updatePassword);
router.patch("/:username", isAdmin, validate(ExistUsernameTDO, "params"), validate(UpdateUserDTO), canSetDelete("update"), updateUser);

export default router;