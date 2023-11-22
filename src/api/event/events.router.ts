import { Router } from "express";
import { validate } from "../../utils/middleware/validation.middleware";
import {  EventDTO, FilterEventDTO, IDEventDTO, UpdateEventDTO } from "./events.dto";
import { addEvent, deleteEvent, exportEvents, getOneEvent, listEvents, updateEvent } from "./events.controller";
import { isAdmin, isAuthenticated, isSuperAdmin } from "../../utils/middleware/authentication.middleware";
import { isToAssign } from "../../utils/middleware/is-to-assign-event.middleware";

const router = Router();

router.post("/add-event", isSuperAdmin, validate(EventDTO), isToAssign("add"), addEvent);
router.get("/list", isAuthenticated, validate(FilterEventDTO, "query"), isToAssign("filters"), listEvents);
router.get("/export-list/:type", isAuthenticated, validate(FilterEventDTO, "query"), isToAssign("filters"), exportEvents);
router.get("/:id", isAdmin, validate(IDEventDTO, "params"), getOneEvent);
router.patch("/:id", isSuperAdmin, validate(UpdateEventDTO), validate(IDEventDTO, "params"), isToAssign("update"), updateEvent);
router.delete("/:id", isSuperAdmin, validate(IDEventDTO, "params"), deleteEvent);

export default router;