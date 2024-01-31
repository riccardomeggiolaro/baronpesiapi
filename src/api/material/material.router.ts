import { Router } from "express";
import { validate } from "../../utils/middleware/validation.middleware";
import { isAdmin, isAuthenticated } from "../../utils/middleware/authentication.middleware";
import { FilterMaterialDTO, IDMaterialDTO, MaterialDTO, UpdateMaterialDTO } from "./material.dto";
import { addMaterial, deleteMaterial, listMaterials, updateMaterial } from "./material.controller";

const router = Router(); // Mount the third path for the end points at the '/subject' path

router.post("/add-material", isAuthenticated, validate(MaterialDTO, "body"), addMaterial); // Check if the user is authenticated, validate body and call function addSubject
router.get("/list", isAuthenticated, validate(FilterMaterialDTO, "query"), listMaterials); // Check if the user is authenticated, validate the query, check if all filters can be passed and call function listSubjects
router.patch("/:id", isAdmin, validate(UpdateMaterialDTO), validate(IDMaterialDTO, "params"), updateMaterial); // Check if the user is authenticated, validate body and param and call function udpdateSubject
router.delete("/:id", isAdmin, validate(IDMaterialDTO, "params"), deleteMaterial); // Check if the user is admin, validate param and call function deleteSubject

export default router; // Export the router