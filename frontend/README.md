# TailorHub — Frontend

TanStack Start (React 19 + TypeScript + Tailwind + shadcn/ui) site for a bespoke tailoring
atelier. Talks to the [`../backend`](../backend) API for products, services, testimonials and
appointment requests — see the [root README](../README.md) for how to run both together.

## Run standalone

```sh
npm install
npm run dev        # http://localhost:8080
```

Requires the backend running on `http://localhost:4000` (see `../backend/README.md`) — the Vite
dev server proxies `/api/*` requests there (see `vite.config.ts`), so no CORS setup or API base
URL is needed.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (outputs to `.output/`) |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |

## Where the API is called from

- `src/lib/api.ts` — typed fetch client (`getProducts`, `getServices`, `getTestimonials`, `createAppointment`)
- `src/lib/product-images.ts` — maps the backend's short image key (e.g. `"fabrics"`) to the bundled asset
- `src/routes/shop.tsx`, `services.tsx`, `index.tsx`, `contact.tsx` — pages that use the client above via TanStack Query

## What's still static

The About page timeline, the homepage stats/marquee/how-it-works copy, and the portfolio gallery
are hardcoded — that's site copy, not business data, so it doesn't go through the API. Everything
that looks like a real record (products, services, testimonials, appointment requests) does.

## Troubleshooting

If you see `Error: listen EAFNOSUPPORT ... address: '::'` when starting the dev server, your
machine/container doesn't support IPv6 — run `npm run dev -- --host 0.0.0.0` instead.

---

<details>
<summary>Original Lovable info</summary>

This project was built with [Lovable](https://lovable.dev).

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

</details>
