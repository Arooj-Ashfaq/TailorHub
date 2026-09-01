import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/services.controller.js";

export const servicesRouter = Router();

servicesRouter.get("/", asyncHandler(controller.listServices));
servicesRouter.get("/:id", asyncHandler(controller.getService));
servicesRouter.post("/", asyncHandler(controller.createService));
servicesRouter.put("/:id", asyncHandler(controller.updateService));
servicesRouter.delete("/:id", asyncHandler(controller.deleteService));
