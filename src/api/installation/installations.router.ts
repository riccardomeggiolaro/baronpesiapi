import { Router } from "express";
import { addInstallation, deleteInstallation, getInstallationDefault, getOneInstallation, listInstallations, updateInstallation } from "./installations.controller";
import { validate } from "../../utils/middleware/validation.middleware";
import { FilterInstallationDTO, IDInstallationDTO, InstallationDTO, UpdateDTO } from "./installations.dto";
import { isAdmin, isAuthenticated } from "../../utils/middleware/authentication.middleware";

const router = Router();

router.post("/add-installation", isAdmin, validate(InstallationDTO), addInstallation);
router.get("/list", isAdmin, validate(FilterInstallationDTO, "query"), listInstallations);
router.get("/assigned", isAuthenticated, getInstallationDefault);
router.get("/:id", isAdmin, validate(IDInstallationDTO, "params"), getOneInstallation);
router.patch("/:id", isAdmin, validate(UpdateDTO), validate(IDInstallationDTO, "params"), updateInstallation);
router.delete("/:id", isAdmin, validate(IDInstallationDTO, "params"), deleteInstallation);

export default router;