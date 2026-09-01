import { pgTable, serial, varchar, text, integer, doublePrecision, timestamp } from "drizzle-orm/pg-core";

/**
 * Shop products (Fabrics, Ready-made, Accessories, Cufflinks, Belts, Shoes...).
 * `image` stores a short key (e.g. "fabrics") that the frontend maps to a
 * bundled asset — see frontend/src/lib/product-images.ts.
 */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  price: doublePrecision("price").notNull(),
  image: varchar("image", { length: 100 }).notNull(),
  rating: doublePrecision("rating").notNull().default(5),
});

/** Tailoring services offered by the atelier (Custom Suits, Alterations, ...). */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  price: doublePrecision("price").notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  image: varchar("image", { length: 100 }).notNull(),
  description: text("description").notNull(),
});

/** Client testimonials shown on the homepage. */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
});

/** Fitting / appointment requests submitted through the Contact page. */
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  fittingType: varchar("fitting_type", { length: 100 }).notNull(),
  notes: text("notes"),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
