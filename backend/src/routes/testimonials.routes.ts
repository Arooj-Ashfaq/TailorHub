import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/testimonials.controller.js";

export const testimonialsRouter = Router();

testimonialsRouter.get("/", asyncHandler(controller.listTestimonials));
testimonialsRouter.post("/", asyncHandler(controller.createTestimonial));
testimonialsRouter.delete("/:id", asyncHandler(controller.deleteTestimonial));
