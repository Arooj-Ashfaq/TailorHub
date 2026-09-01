import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env.js";
import * as schema from "./schema.js";

export const pool = new Pool({ connectionString: env.databaseUrl });

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
});

export const db = drizzle(pool, { schema });
