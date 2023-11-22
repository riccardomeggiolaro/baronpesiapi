import { Router } from "express";
import { validate } from "../../utils/middleware/validation.middleware";
import { isAdmin, isAuthenticated, isSuperAdmin } from "../../utils/middleware/authentication.middleware";
import { CardDTO, FilterCardDTO, IDCardDTO, UpdateCardDTO } from "./cards.dto";
import { addCard, deleteCard, getOneCard, listCards, updateCard } from "./cards.controller";
import { isToAssign } from "../../utils/middleware/is-to-assign-card.middleware";

const router = Router();

router.post("/add-card", isSuperAdmin, validate(CardDTO), isToAssign("add"), addCard);
router.get("/list", isAuthenticated, validate(FilterCardDTO), isToAssign("filters"), listCards);
router.get("/:id", isAdmin, validate(IDCardDTO, "params"), getOneCard);
router.patch("/:id", isAuthenticated, validate(UpdateCardDTO), validate(IDCardDTO, "params"), isToAssign("update"), updateCard);
router.delete("/:id", isSuperAdmin, validate(IDCardDTO, "params"), deleteCard);

export default router;