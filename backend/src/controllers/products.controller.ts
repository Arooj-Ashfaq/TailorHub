import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { products } from "../db/schema.js";
import { NotFoundError, requireFields } from "../utils/validation.js";

export async function listProducts(req: Request, res: Response): Promise<void> {
  const { category } = req.query;
  const rows = await db.select().from(products);
  const filtered = category && category !== "All" ? rows.filter((p) => p.category === category) : rows;
  res.json(filtered);
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const [row] = await db.select().from(products).where(eq(products.id, id));
  if (!row) throw new NotFoundError("Product not found");
  res.json(row);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  requireFields(req.body ?? {}, ["name", "category", "price", "image"]);
  const { name, category, price, image, rating } = req.body;
  const [row] = await db
    .insert(products)
    .values({ name, category, price, image, rating: rating ?? 5 })
    .returning();
  res.status(201).json(row);
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const [existing] = await db.select().from(products).where(eq(products.id, id));
  if (!existing) throw new NotFoundError("Product not found");

  const [row] = await db.update(products).set(req.body ?? {}).where(eq(products.id, id)).returning();
  res.json(row);
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const [existing] = await db.select().from(products).where(eq(products.id, id));
  if (!existing) throw new NotFoundError("Product not found");

  await db.delete(products).where(eq(products.id, id));
  res.status(204).send();
}
