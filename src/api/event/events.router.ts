import { Router } from "express";
import { validate } from "../../utils/middleware/validation.middleware";
import {  FilterEventDTO, IDEventDTO } from "./events.dto";
import { deleteEvent, exportEvents, getOneEvent, listEvents } from "./events.controller";
import { isAuthenticated, isSuperAdmin } from "../../utils/middleware/authentication.middleware";
import { isToAssign } from "../../utils/middleware/is-to-assign-event.middleware";

const router = Router(); // Mount the third path for the end points at the '/event' path

router.get("/list", isAuthenticated, validate(FilterEventDTO, "query"), isToAssign("filters"), listEvents); // Check if the user is authenticated, validate filters, check if the filters are ok and call function listEvents
router.get("/export-list/:type", isAuthenticated, validate(FilterEventDTO, "query"), isToAssign("filters"), exportEvents); //
router.get("/:id", isAuthenticated, validate(IDEventDTO, "params"), getOneEvent); // Check if the user is admin, validate param and call function getOneEvent
router.delete("/:id", isSuperAdmin, validate(IDEventDTO, "params"), deleteEvent); // Check if the user is super admin, validate param and call function deleteEvent

export default router; // Export the router