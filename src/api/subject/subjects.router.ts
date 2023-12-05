import { Router } from "express";
import { validate } from "../../utils/middleware/validation.middleware";
import { FilterSubjectDTO, IDSubjectDTO, SubjectDTO, UpdateSubjectDTO } from "./subjects.dto";
import { addSubject, listSubjects, getOneSubject, updateSubject, deleteSubject } from "./subjects.controller";
import { isAdmin, isAuthenticated } from "../../utils/middleware/authentication.middleware";

const router = Router(); // Mount the third path for the end points at the '/subject' path

router.post("/add-subject", isAuthenticated, validate(SubjectDTO, "body"), addSubject); // Check if the user is authenticated, validate body and call function addSubject
router.get("/list", isAuthenticated, validate(FilterSubjectDTO, "query"), listSubjects); // Check if the user is authenticated, validate the query, check if all filters can be passed and call function listSubjects
router.get("/:id", isAuthenticated, validate(IDSubjectDTO, "params"), getOneSubject); // Check if the user is authenticated, validate param and call function getOneSubject
router.patch("/:id", isAuthenticated, validate(UpdateSubjectDTO), validate(IDSubjectDTO, "params"), updateSubject); // Check if the user is authenticated, validate body and param and call function udpdateSubject
router.delete("/:id", isAdmin, validate(IDSubjectDTO, "params"), deleteSubject); // Check if the user is admin, validate param and call function deleteSubject

export default router; // Export the router