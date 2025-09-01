import { Router } from "express";
import { isAdmin, isAuthenticated } from "../../utils/middleware/authentication.middleware";
import { deleteUser, getUser, list, me, updateLastAccess, updatePassword, updateUser } from "./user.controller";
import { validate } from "../../utils/middleware/validation.middleware";
import { ExistUsernameTDO, FilterUserDTO, PasswordDTO, UpdateLastAcces, UpdateUserDTO, UsernameDTO } from "./user.dto";
import { canSetDelete } from "../../utils/middleware/can-set.middleware";

const router = Router(); // Mount the third path for the end points at the '/user' path

router.get("/me", isAuthenticated, me); // Check if user is authenticated and call function me
router.get("/list", isAdmin, validate(FilterUserDTO, "query"), list); // Check if user is admin, validate query and call function list
router.get("/:username", isAdmin, validate(UsernameDTO, "params"), getUser); // Check is user is admin, validate param and call function getUser
router.delete("/:username", isAdmin, validate(ExistUsernameTDO, "params"), canSetDelete("delete"), deleteUser); // Check if user is admin, validate param, check if user can delete and call function deleteUser
router.patch("/update/last-access", isAuthenticated, validate(UpdateLastAcces, "body"), updateLastAccess); // Check if the user authenticated, validate body and call function updateLastAccess
router.patch("/update/change-password", isAuthenticated, validate(PasswordDTO, "body"), updatePassword); // Check if the user is authenticated, validate body and call function updatePassword
router.patch("/:username", isAdmin, validate(ExistUsernameTDO, "params"), validate(UpdateUserDTO), canSetDelete("update"), updateUser); // Check if the user is admin, validate param and body, check if the user can update and call function updateUser

export default router; // Export the router