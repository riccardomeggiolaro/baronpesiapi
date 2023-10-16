import { Router } from "express";
import { validate } from "../../utils/middleware/validation.middleware";
import { isAuthenticated } from "../../utils/middleware/authentication.middleware";
import { CardDTO, FilterCardDTO, IDCardDTO, UpdateCardDTO } from "./cards.dto";
import { addCard, deleteCard, getOneCard, listCards, updateCard } from "./cards.controller";
import { isToAssign } from "../../utils/middleware/is-to-assign-card.middleware";

const router = Router();

router.post("/add-card", isAuthenticated, validate(CardDTO), isToAssign("add"), addCard);
router.get("/list", isAuthenticated, validate(FilterCardDTO), isToAssign("filters"), listCards);
router.get("/:id", isAuthenticated, validate(IDCardDTO, "params"), getOneCard);
router.patch("/:id", isAuthenticated, validate(UpdateCardDTO), validate(IDCardDTO, "params"), isToAssign("update"), updateCard);
router.delete("/:id", isAuthenticated, validate(IDCardDTO, "params"), deleteCard);

export default router;