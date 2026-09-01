import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { testimonials } from "../db/schema.js";
import { NotFoundError, requireFields } from "../utils/validation.js";

export async function listTestimonials(_req: Request, res: Response): Promise<void> {
  const rows = await db.select().from(testimonials);
  res.json(rows);
}

export async function createTestimonial(req: Request, res: Response): Promise<void> {
  requireFields(req.body ?? {}, ["name", "role", "quote"]);
  const { name, role, quote, rating } = req.body;
  const [row] = await db.insert(testimonials).values({ name, role, quote, rating: rating ?? 5 }).returning();
  res.status(201).json(row);
}

export async function deleteTestimonial(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const [existing] = await db.select().from(testimonials).where(eq(testimonials.id, id));
  if (!existing) throw new NotFoundError("Testimonial not found");

  await db.delete(testimonials).where(eq(testimonials.id, id));
  res.status(204).send();
}
