# TailorHub

A bespoke tailoring atelier site — TanStack Start (React 19 + TypeScript + Tailwind + shadcn/ui).
Includes shop, services, testimonials, a fitting-request contact form, and full account
login/signup — all backed by a real API instead of mock data.

**Backend repo:** [Arooj-Ashfaq/TailorHub-Backend](https://github.com/Arooj-Ashfaq/TailorHub-Backend)
(Express + TypeScript + PostgreSQL). This repo is the frontend only.

## Run it

Clone both repos as siblings:

```
some-folder/
├── TailorHub/            (this repo)
└── TailorHub-Backend/
```

Start the backend first (see its README for full PostgreSQL setup):

```sh
cd TailorHub-Backend
npm install
npm run db:migrate
npm run db:seed
npm run dev              # http://localhost:4000
```

Then the frontend:

```sh
cd TailorHub
npm install
npm run dev               # http://localhost:8080
```

Open **http://localhost:8080**. The Vite dev server proxies `/api/*` to `http://localhost:4000`
(see `vite.config.ts`) — no CORS setup or API URL configuration needed.

## Features

- **Shop** — products fetched from the backend, filterable by category
- **Services** — the full service catalogue, with a featured subset on the homepage
- **Testimonials** — pulled from the backend
- **Contact / fitting requests** — submits to the backend; if you're logged in, the request is
  linked to your account automatically
- **Accounts** — sign up as a **buyer** or **seller**, log in, and view your fitting-request
  history on `/account`
- **Seller Dashboard** (`/seller`, sellers and admins) — create, edit and delete your own
  products and services with full forms
- **Admin Panel** (`/admin`, admins only) — manage every user (including changing roles), every
  product/service, testimonials, and every fitting request
- **`/dashboard`** — a single link that sends each role to its own dashboard (buyer → `/account`,
  seller → `/seller`, admin → `/admin`); this is what the nav's account link points to
- **Chat assistant** — a rule-based FAQ widget (bottom-right on every page) that answers common
  questions about hours, pricing, booking, services and accounts. It's not an AI model — just
  fast, reliable keyword matching against a small knowledge base, so it always works with no API
  key or external service required. See `src/components/site/ChatBot.tsx`.

Demo accounts (see the backend README) let you try each role immediately without signing up.

## Scripts

| Command           | What it does                             |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the dev server                     |
| `npm run build`   | Production build (outputs to `.output/`) |
| `npm run preview` | Preview the production build             |
| `npm run lint`    | Lint with ESLint                         |
| `npm run format`  | Format with Prettier                     |

## Where the API is called from

- `src/lib/api.ts` — typed fetch client (products, services, testimonials, appointments, auth); automatically attaches the JWT if the user is logged in
- `src/lib/auth-context.tsx` — React context for the logged-in user (backed by `src/lib/auth-storage.ts`, which wraps `localStorage`)
- `src/lib/product-images.ts` — maps the backend's short image key (e.g. `"fabrics"`) to the bundled asset
- `src/routes/` — `shop.tsx`, `services.tsx`, `index.tsx`, `contact.tsx` use the API client via TanStack Query; `login.tsx`, `signup.tsx`, `account.tsx` use the auth context

## What's still static

The About page timeline, the homepage stats/marquee/how-it-works copy, and the portfolio gallery
are hardcoded — that's site copy, not business data, so it doesn't go through the API. Everything
that looks like a real record (products, services, testimonials, users, appointment requests)
does.

## Troubleshooting

If you see `Error: listen EAFNOSUPPORT ... address: '::'` when starting the dev server, your
machine/container doesn't support IPv6 — run `npm run dev -- --host 0.0.0.0` instead.

## Deploying to Vercel

1. Deploy the backend first (see [`TailorHub-Backend`'s README](https://github.com/Arooj-Ashfaq/TailorHub-Backend#deploying-to-render)) and note its URL, e.g. `https://tailorhub-backend.onrender.com`.
2. In Vercel: **Add New → Project**, import this repo. Vercel/Nitro auto-detect the Vercel
   environment at build time and produce the right output — no framework preset needed.
3. Add one environment variable in the Vercel project settings:
   - `VITE_API_URL` = your backend's URL from step 1 (no trailing slash)
4. Deploy. Once it's live, copy the Vercel URL and set it as `CORS_ORIGIN` on the backend
   (Render dashboard), then redeploy the backend — the two need each other's URLs to talk.
5. If you use Vercel preview deployments (a different URL per branch/PR), add that URL too, as a
   comma-separated second value in the backend's `CORS_ORIGIN`.

**Why `VITE_API_URL` is needed:** in dev, `fetch("/api/...")` works because the Vite dev server
proxies it to your local backend (see `vite.config.ts`) — that proxy only exists in `vite dev`,
not in the production build. In production the frontend and backend are on different domains
entirely (Vercel + Render), so the API client (`src/lib/api.ts`) needs the backend's full URL to
call it directly. Leave `VITE_API_URL` unset locally and everything keeps using the dev proxy as
before.

---

<details>
<summary>Original Lovable info</summary>

This project was built with [Lovable](https://lovable.dev).

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

</details>
