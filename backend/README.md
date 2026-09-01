# TailorHub — Backend

REST API for TailorHub, built with **Express + TypeScript**, running on **PostgreSQL 18** via
[Drizzle ORM](https://orm.drizzle.team). See the [root README](../README.md) for how to run this
together with the frontend.

## Stack

- **Express** — HTTP server
- **TypeScript**, run in dev with **`tsx`** (no manual compile step needed while developing)
- **Drizzle ORM** + **`pg`** (node-postgres) — typed queries, SQL migrations, no native/binary
  dependencies to install (unlike some SQLite drivers) — `npm install` just works everywhere
- **PostgreSQL 18** — schema defined in [`src/db/schema.ts`](src/db/schema.ts)

## 1. Install PostgreSQL 18

**Windows** — download and run the installer from
[postgresql.org/download/windows](https://www.postgresql.org/download/windows/) (the EDB
installer). It'll ask you to set a password for the `postgres` user and a port (default `5432`)
— remember these, you'll need them for `DATABASE_URL` below. `pgAdmin` is installed alongside it
if you'd like a GUI.

**macOS** — `brew install postgresql@18 && brew services start postgresql@18`

**Linux** — use your distro's package manager, or the
[PostgreSQL apt repository](https://www.postgresql.org/download/linux/ubuntu/) for the latest
major version if your distro only ships an older one.

**Any OS, no local install** — run it in Docker instead:
```sh
docker run --name tailorhub-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tailorhub -p 5432:5432 -d postgres:18
```

Then create a database (skip this if you used the Docker command above, which already creates one):
```sh
psql -U postgres -c "CREATE DATABASE tailorhub;"
```

## 2. Configure and install

```sh
cp .env.example .env
# edit .env — set DATABASE_URL to match your Postgres user/password/port
npm install
```

## 3. Create the schema and seed data

```sh
npm run db:migrate    # creates the products/services/testimonials/appointments tables
npm run db:seed        # populates them with the atelier's starting catalogue (safe to re-run — skips if data already exists)
```

## 4. Run it

```sh
npm run dev             # http://localhost:4000 (auto-restarts on file changes, via tsx watch)
```

```sh
curl http://localhost:4000/api/health
curl http://localhost:4000/api/products
```

## Project structure

```
backend/
├── drizzle/                    # SQL migration files (generated — don't hand-edit)
├── src/
│   ├── config/env.ts           # typed, validated environment variables
│   ├── db/
│   │   ├── schema.ts           # Drizzle table definitions (source of truth for the DB shape)
│   │   ├── client.ts           # pg Pool + Drizzle client
│   │   ├── migrate.ts          # applies drizzle/*.sql to the database
│   │   └── seed.ts             # inserts the starting catalogue
│   ├── controllers/            # one file per resource — the actual business logic
│   ├── routes/                 # thin Express routers, wire HTTP verbs to controllers
│   ├── middlewares/             # errorHandler, notFound
│   ├── utils/                  # asyncHandler, validation helpers
│   ├── app.ts                  # builds the Express app (middleware + routes)
│   └── server.ts               # entrypoint — checks DB connectivity, then listens
├── drizzle.config.ts           # drizzle-kit config (used by db:generate)
├── tsconfig.json
└── package.json
```

## Changing the schema

1. Edit [`src/db/schema.ts`](src/db/schema.ts)
2. `npm run db:generate` — creates a new SQL file in `drizzle/`
3. `npm run db:migrate` — applies it

## API reference

| Method | Route                     | Description                                       |
|--------|---------------------------|----------------------------------------------------|
| GET    | `/api/health`              | Health check                                       |
| GET    | `/api/products`            | List products (optional `?category=`)              |
| GET    | `/api/products/:id`        | Get one product                                    |
| POST   | `/api/products`            | Create a product                                   |
| PUT    | `/api/products/:id`        | Update a product                                   |
| DELETE | `/api/products/:id`        | Delete a product                                   |
| GET    | `/api/services`            | List services (optional `?limit=`)                 |
| GET    | `/api/services/:id`        | Get one service                                    |
| POST   | `/api/services`            | Create a service                                   |
| PUT    | `/api/services/:id`        | Update a service                                   |
| DELETE | `/api/services/:id`        | Delete a service                                   |
| GET    | `/api/testimonials`        | List testimonials                                  |
| POST   | `/api/testimonials`        | Add a testimonial                                  |
| DELETE | `/api/testimonials/:id`    | Delete a testimonial                                |
| GET    | `/api/appointments`        | List fitting/appointment requests                  |
| GET    | `/api/appointments/:id`    | Get one request                                    |
| POST   | `/api/appointments`        | Create one (this is what the Contact form calls)   |
| PATCH  | `/api/appointments/:id`    | Update a request's `status`                         |
| DELETE | `/api/appointments/:id`    | Delete a request                                    |

## Production build

```sh
npm run build   # compiles src/ → dist/ with tsc
npm start        # runs dist/server.js
```

## Notes

- No admin UI yet for managing products/services/appointments — the full REST API above covers
  it, so it's a small step to add one, or manage things via `curl`/Postman/`npm run db:studio`
  (opens Drizzle Studio, a GUI for the database) in the meantime.
- Tested in development against PostgreSQL 16 (the newest version readily available in this
  sandbox) — the schema and queries here use standard SQL features with nothing PG18-specific,
  so the same code runs unchanged on PostgreSQL 18.
