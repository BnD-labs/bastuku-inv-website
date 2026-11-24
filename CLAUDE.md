# CLAUDE.md

Lead-generation site for Bastuku Investments Limited, Lusaka movers and freight. Live at https://bastuku-inv.com. Its job is turning visitors into quote requests (form → D1, or WhatsApp).

## Branch and deploy

- Work on **`rebuild/nextjs-workers`**: the live Next.js app, deployed to Cloudflare Workers through OpenNext. `main` is the old April 2026 static site. Do not touch it.
- Branch from `rebuild/nextjs-workers` and open the PR back into it.
- **Never deploy.** Brandon (BASTUKU Operations Director) reviews, merges, and runs `npm run deploy`.
- Checks: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`, `npm run preview` (the Worker build; check redirects here).

## Read first

- `HANDOFF.md`: state, blockers, setup, Cloudflare auth, Windows build traps.
- `CLAIMS.md`: the launch gate for every factual claim on the site.
- `DEVELOPING.md`: architecture, commands, conventions, testing notes.

## Standing rules

- **No in-house crew language.** Crews are subcontracted. Never write "our team", "our staff", "our people", "our crew" or "Bastuku crew" about the people doing the work; use "a trained, vetted crew". "Your team" (the client's staff) and "move lead" are fine.
- **No prices anywhere.** `content/rates.ts` and `lib/estimate.ts` stay unwired; their figures are invented.
- **No new claims.** Any statistic, licence number, address, testimonial, guarantee, or capability a customer could hold BASTUKU to gets a `CLAIMS.md` row first.
- **Never hardcode the service count.** Derive it from `SERVICES.length`.
- **Renaming a service slug:** update `SERVICE_SLUGS`, `SERVICES`, and the `rates.ts` key, add the old slug to `LEGACY_SLUGS`, and add a permanent redirect in `next.config.ts`.
- **Page metadata goes through `pageMetadata()`** (`lib/metadata.ts`). Next merges metadata shallowly, so a bare `openGraph` drops the shared image.
- **Service split:** Cross-Border Moves = households and personal effects. Clearing, Forwarding & Freight = commercial cargo.
- **Contact:** `info@bastuku-inv.com`. `+260 976 831 400` is primary and the only WhatsApp number; `+260 977 778 844` is calls only (it replaced `+260 967 022 254` in November 2026).
- **Colour:** lime `#AEE522` on dark backgrounds only; `text-lime-deep` on light. Navy is `#072248`.
- **Voice:** short, plain sentences; an uppercase heading over a lower-case line.
- **Code style:** tabs, double quotes, semicolons, comments that explain why.
