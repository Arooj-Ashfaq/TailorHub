import type { NextFunction, Request, Response } from "express";
import { isProduction } from "../config/env.js";

interface HttpError extends Error {
  status?: number;
}

export function errorHandler(err: HttpError, _req: Request, res: Response, _next: NextFunction): void {
  const status = err.status ?? 500;

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: status >= 500 && isProduction ? "Internal server error" : err.message || "Internal server error",
  });
}
