import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/products.controller.js";

export const productsRouter = Router();

productsRouter.get("/", asyncHandler(controller.listProducts));
productsRouter.get("/:id", asyncHandler(controller.getProduct));
productsRouter.post("/", asyncHandler(controller.createProduct));
productsRouter.put("/:id", asyncHandler(controller.updateProduct));
productsRouter.delete("/:id", asyncHandler(controller.deleteProduct));
