import { Router } from "express";
import { productsRouter } from "./products.routes.js";
import { servicesRouter } from "./services.routes.js";
import { testimonialsRouter } from "./testimonials.routes.js";
import { appointmentsRouter } from "./appointments.routes.js";

export const apiRouter = Router();

apiRouter.use("/products", productsRouter);
apiRouter.use("/services", servicesRouter);
apiRouter.use("/testimonials", testimonialsRouter);
apiRouter.use("/appointments", appointmentsRouter);
