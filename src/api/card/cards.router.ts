import { Router } from "express";
import { validate } from "../../utils/middleware/validation.middleware";
import { isAuthenticated, isSuperAdmin } from "../../utils/middleware/authentication.middleware";
import { CardDTO, FilterCardDTO, IDCardDTO, UpdateCardDTO } from "./cards.dto";
import { addCard, deleteCard, getOneCard, listCards, updateCard } from "./cards.controller";
import { isToAssign } from "../../utils/middleware/is-to-assign-card.middleware";

const router = Router(); // Mount the third path for the end points at the '/card' path

router.post("/add-card", isSuperAdmin, validate(CardDTO), addCard); // Check if the user is super admin, validate the body and call function add card
router.get("/list", isAuthenticated, validate(FilterCardDTO, "query"), isToAssign("filters"), listCards); // Check if the user is authenticated, validate the query, check if all filters can be passed and call function listCards
router.get("/:id", isAuthenticated, validate(IDCardDTO, "params"), getOneCard); // Check if the user is authenticated, validate the param and call the function getOneCard
router.patch("/:id", isAuthenticated, validate(UpdateCardDTO), validate(IDCardDTO, "params"), isToAssign("update"), updateCard); // Check if the user is authenticated, validate the body and the param, check if can update and call the function updateCard
router.delete("/:id", isSuperAdmin, validate(IDCardDTO, "params"), deleteCard); // Chech if the user is super admin, validate the param and call the function deleteCard

export default router; // Export the router