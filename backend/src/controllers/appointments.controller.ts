import type { Request, Response } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { appointments } from "../db/schema.js";
import { NotFoundError, ValidationError, isValidEmail, requireFields } from "../utils/validation.js";

export async function listAppointments(_req: Request, res: Response): Promise<void> {
  const rows = await db.select().from(appointments).orderBy(desc(appointments.createdAt));
  res.json(rows);
}

export async function getAppointment(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const [row] = await db.select().from(appointments).where(eq(appointments.id, id));
  if (!row) throw new NotFoundError("Appointment not found");
  res.json(row);
}

export async function createAppointment(req: Request, res: Response): Promise<void> {
  requireFields(req.body ?? {}, ["name", "email", "fittingType"]);
  const { name, email, phone, fittingType, notes } = req.body;

  if (!isValidEmail(email)) {
    throw new ValidationError("Please provide a valid email address");
  }

  const [row] = await db
    .insert(appointments)
    .values({ name, email, phone: phone ?? null, fittingType, notes: notes ?? null })
    .returning();
  res.status(201).json(row);
}

export async function updateAppointmentStatus(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  requireFields(req.body ?? {}, ["status"]);

  const [existing] = await db.select().from(appointments).where(eq(appointments.id, id));
  if (!existing) throw new NotFoundError("Appointment not found");

  const [row] = await db
    .update(appointments)
    .set({ status: req.body.status })
    .where(eq(appointments.id, id))
    .returning();
  res.json(row);
}

export async function deleteAppointment(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const [existing] = await db.select().from(appointments).where(eq(appointments.id, id));
  if (!existing) throw new NotFoundError("Appointment not found");

  await db.delete(appointments).where(eq(appointments.id, id));
  res.status(204).send();
}
