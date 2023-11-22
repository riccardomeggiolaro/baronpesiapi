import { Router } from "express";
import { validate } from "../../utils/middleware/validation.middleware";
import { FilterSubjectDTO, IDSubjectDTO, SubjectDTO, UpdateSubjectDTO } from "./subjects.dto";
import { addSubject, listSubjects, getOneSubject, updateSubject, deleteSubject } from "./subjects.controller";
import { isAdmin, isAuthenticated } from "../../utils/middleware/authentication.middleware";

const router = Router();

router.post("/add-subject", isAuthenticated, validate(SubjectDTO, "body"), addSubject);
router.get("/list", isAuthenticated, validate(FilterSubjectDTO, "query"), listSubjects);
router.get("/:id", isAuthenticated, validate(IDSubjectDTO, "params"), getOneSubject);
router.patch("/:id", isAuthenticated, validate(UpdateSubjectDTO), validate(IDSubjectDTO, "params"), updateSubject);
router.delete("/:id", isAdmin, validate(IDSubjectDTO, "params"), deleteSubject);

export default router;