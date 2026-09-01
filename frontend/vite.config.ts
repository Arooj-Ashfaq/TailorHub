// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      // Bind explicitly to IPv4 — some machines/containers don't support the
      // default "::" (IPv6) bind and fail with EAFNOSUPPORT.
      host: "0.0.0.0",
      // Forward API calls to the Express backend (see /backend) during local
      // dev, so the frontend can just fetch("/api/...") same-origin — no CORS.
      // Run the backend separately with `npm run dev` inside /backend (or use
      // the root `npm run dev:full` script to start both at once).
      proxy: {
        "/api": {
          target: "http://localhost:4000",
          changeOrigin: false,
        },
      },
    },
  },
});
