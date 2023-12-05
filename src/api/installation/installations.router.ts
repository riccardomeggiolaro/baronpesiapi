import { Router } from "express";
import { addInstallation, deleteInstallation, getInstallationDefault, getOneInstallation, listInstallations, updateInstallation } from "./installations.controller";
import { validate } from "../../utils/middleware/validation.middleware";
import { FilterInstallationDTO, IDInstallationDTO, InstallationDTO, UpdateDTO } from "./installations.dto";
import { isAdmin, isAuthenticated, isSuperAdmin } from "../../utils/middleware/authentication.middleware";

const router = Router(); // Mount the third path for the end points at the '/subject' path

router.post("/add-installation", isSuperAdmin, validate(InstallationDTO), addInstallation); // Check if the user is super admin, validate body and call function addInstallation
router.get("/list", isAdmin, validate(FilterInstallationDTO, "query"), listInstallations); // Check if the user is admin, validate query and call function listInstallations
router.get("/assigned", isAuthenticated, getInstallationDefault); // Check if the user is authenticated and call function getInstallationDefault
router.get("/:id", isAdmin, validate(IDInstallationDTO, "params"), getOneInstallation); // Check if the user is admin, validate param and call function getOneInstallation
router.patch("/:id", isSuperAdmin, validate(UpdateDTO), validate(IDInstallationDTO, "params"), updateInstallation); // Check if the user is super admin, validate body and param and call function updateInstallation
router.delete("/:id", isSuperAdmin, validate(IDInstallationDTO, "params"), deleteInstallation); // Check is the user is super admin, validate param and call function deleteInstallation

export default router; // Export the router