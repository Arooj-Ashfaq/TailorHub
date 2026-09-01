import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/appointments.controller.js";

export const appointmentsRouter = Router();

appointmentsRouter.get("/", asyncHandler(controller.listAppointments));
appointmentsRouter.get("/:id", asyncHandler(controller.getAppointment));
appointmentsRouter.post("/", asyncHandler(controller.createAppointment));
appointmentsRouter.patch("/:id", asyncHandler(controller.updateAppointmentStatus));
appointmentsRouter.delete("/:id", asyncHandler(controller.deleteAppointment));
