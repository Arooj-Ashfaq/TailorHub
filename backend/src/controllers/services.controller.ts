import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { services } from "../db/schema.js";
import { NotFoundError, requireFields } from "../utils/validation.js";

export async function listServices(req: Request, res: Response): Promise<void> {
  const { limit } = req.query;
  const rows = await db.select().from(services);
  res.json(limit ? rows.slice(0, Number(limit)) : rows);
}

export async function getService(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const [row] = await db.select().from(services).where(eq(services.id, id));
  if (!row) throw new NotFoundError("Service not found");
  res.json(row);
}

export async function createService(req: Request, res: Response): Promise<void> {
  requireFields(req.body ?? {}, ["title", "price", "duration", "image", "description"]);
  const { title, price, duration, image, description } = req.body;
  const [row] = await db.insert(services).values({ title, price, duration, image, description }).returning();
  res.status(201).json(row);
}

export async function updateService(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const [existing] = await db.select().from(services).where(eq(services.id, id));
  if (!existing) throw new NotFoundError("Service not found");

  const [row] = await db.update(services).set(req.body ?? {}).where(eq(services.id, id)).returning();
  res.json(row);
}

export async function deleteService(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const [existing] = await db.select().from(services).where(eq(services.id, id));
  if (!existing) throw new NotFoundError("Service not found");

  await db.delete(services).where(eq(services.id, id));
  res.status(204).send();
}
