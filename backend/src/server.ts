import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/client.js";

async function main(): Promise<void> {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to PostgreSQL.");
  } catch (err) {
    console.error("Could not connect to PostgreSQL. Is it running, and is DATABASE_URL correct?");
    console.error(err);
    process.exit(1);
  }

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`TailorHub backend listening on http://localhost:${env.port}`);
    console.log(`Health check: http://localhost:${env.port}/api/health`);
  });
}

main();

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});
