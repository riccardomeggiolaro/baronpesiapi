import { Router } from "express";
import { validate } from "../../utils/middleware/validation.middleware";
import { isAuthenticated } from "../../utils/middleware/authentication.middleware";
import { FilterCardDTO, IDCardDTO, UpdateCardDTO } from "./cards.dto";
import { getOneCard, listCards, updateCard } from "./cards.controller";
import { isToAssign } from "../../utils/middleware/is-to-assign-card.middleware";

const router = Router(); // Mount the third path for the end points at the '/card' path

router.get("/list", isAuthenticated, validate(FilterCardDTO, "query"), isToAssign("filters"), listCards); // Check if the user is authenticated, validate the query, check if all filters can be passed and call function listCards
router.get("/:id", isAuthenticated, validate(IDCardDTO, "params"), getOneCard); // Check if the user is authenticated, validate the param and call the function getOneCard
router.patch("/:id", isAuthenticated, validate(UpdateCardDTO), validate(IDCardDTO, "params"), isToAssign("update"), updateCard); // Check if the user is authenticated, validate the body and the param, check if can update and call the function updateCard

export default router; // Export the router