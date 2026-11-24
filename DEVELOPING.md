# Developing

Detailed working guide: architecture, commands, conventions, and testing notes. `CLAUDE.md` holds the short version and the standing rules; read that first.

## What this is

Lead-generation site for **Bastuku Investments Limited**, a Lusaka (Zambia) movers and freight company. Live at https://bastuku-inv.com. The job of the site is to turn visitors into quote requests (form → D1 + email, or WhatsApp). Audience is largely on mobile and slow connections.

Work happens on branch **`rebuild/nextjs-workers`**, not `main`. The live deploy comes from this branch.

Read `HANDOFF.md` (state, blockers, design decisions) and `CLAIMS.md` before changing copy. `2026-08-04-bastuku-rebuild.md` is the original 26-task plan and is historical: its file paths and phone number are out of date.

## Stack

Next.js **16.2.11** App Router, React 19, TypeScript (strict), Tailwind **v4** (CSS-first, no `tailwind.config`), Zod 4, deployed as a **Cloudflare Worker via OpenNext** (`@opennextjs/cloudflare`). Storage is D1, email is Resend, bot protection is Turnstile. Node 22+.

Next 16 postdates training data. The full docs are vendored at `node_modules/next/dist/docs/`; read the relevant guide there before writing framework code from memory.

## Commands

```bash
npm run dev                    # next dev (bindings available via initOpenNextCloudflareForDev)
npm run build                  # plain next build (what CI and Playwright use)
npm test                       # vitest, tests/unit/**/*.test.ts (45 tests, ~3s)
npx vitest run tests/unit/estimate.test.ts       # one file
npx vitest run -t "applies the volume multiplier" # one test by name
npm run test:e2e               # playwright; builds + serves on :3100 itself (53 tests)
npx playwright test tests/e2e/motion.spec.ts     # one spec
npx tsc --noEmit               # typecheck (CI runs this)
npm run preview                # OpenNext build + local Worker
npm run deploy                 # OpenNext build + deploy to Cloudflare
npm run upload                 # OpenNext build + upload without promoting
npm run cf-typegen             # regenerate cloudflare-env.d.ts after changing wrangler.jsonc bindings
npm run images                 # sharp pipeline: images/ -> public/images/, fails if any raster > 200 KB or video > 1.5 MB
npx wrangler d1 migrations apply bastuku-leads --local   # add --remote for production
```

Two Windows traps on this machine, both of which look like broken code:

- **Vitest fails every suite with "failed to find the runner"** when the shell's working directory has a lower-case drive letter (`c:/Users/…`, which Git Bash and some VS Code terminals produce). Vite then loads two copies of vitest. Run it from a path that starts `C:\`.
- **`npm run test:e2e` times out waiting for the web server.** A cold `next build` takes about two minutes here, close to Playwright's 180 s limit. Build once, start `npx next start --port 3100` yourself, and Playwright reuses it (outside CI).

First-time setup: `npm ci`, `npx playwright install chromium chromium-headless-shell` (needs **both**), `cp .dev.vars.example .dev.vars`, apply the local D1 migration.

**`npm run lint` is broken.** The script is `next lint`, which Next 16 removed (it reads `lint` as a project directory and errors). Running `npx eslint .` also fails with `TypeError: Converting circular structure to JSON`, because `eslint.config.mjs` loads `next/core-web-vitals` through `FlatCompat`, which `eslint-config-next@16` no longer supports. The fix is to import the flat configs directly (`eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`) and set `"lint": "eslint ."`. Until that is done, `tsc --noEmit` is the only static check, and it is what CI runs.

CI (`.github/workflows/ci.yml`, every push and PR): `tsc --noEmit` → unit → `npm run build` → e2e → `@lhci/cli autorun`. CI does **not** run lint.

## Architecture

### Request flow for a quote (`app/api/quote/route.ts`)

`QuoteForm` (client) validates with the shared `quoteSchema`, then POSTs JSON plus a Turnstile token to `/api/quote`. The route handler runs in this fixed order:

1. Parse JSON (400 if malformed).
2. `verifyTurnstile` (403 on failure). Never throws; it returns `false` on network error.
3. `quoteSchema.safeParse` (400 with `fieldErrors`).
4. `insertLead` to D1 and `sendLeadEmails` via Resend, **independently**. Neither failure may discard the lead; email errors are swallowed on purpose.
5. If *both* storage and the notification email failed, respond 503 with a `whatsappUrl` built from the user's own input so the lead is never lost.

The client sends the request even when the Turnstile token is missing; the server is the authority. Do not "fix" this by blocking submit on the client, because that strands users behind a third-party script outage.

Phone numbers are normalised by the schema to `+260…` and only Zambian mobiles (`+260`/`0` then `7` or `9` then 8 digits) are accepted.

### Layout

- `app/`: routes. `services/[slug]` is statically generated from `SERVICES`. `api/quote` is the only dynamic endpoint. `icon.png` and `apple-icon.png` are generated by `npm run images` into `app/` (Next file conventions), not `public/`.
- `content/`: typed page content (`services`, `faqs`, `coverage`, `steps`, `nav`, `site`, `rates`). Copy changes and adding a service are data edits.
- `lib/`: pure logic (`estimate`, `whatsapp`, `validation`, `format`, `turnstile`, `fonts`). `leads.ts` is the only file that knows SQL; `email.ts` is the only file that knows Resend.
- `components/{layout,sections,ui,seo}`: presentational pieces. Only the interactive ones are client components (`QuoteForm`, `MoveScoper`, `CoverageTiers`, `Reveal`, `MobileNav`, `Header`, `LoopingVideo`).
- `migrations/`: D1 SQL (`leads` table). `images/`: source photography, repo-only, never deployed.
- Path alias `@/*` maps to the repo root.

### Cloudflare bindings and secrets

- Bindings (`DB` D1 `bastuku-leads`, `ASSETS`, `IMAGES`, `WORKER_SELF_REFERENCE`) live in `wrangler.jsonc`. After changing them, run `npm run cf-typegen`. **Never hand-edit `cloudflare-env.d.ts`**; it is generated (and 500 KB).
- Secrets (`TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`) are set with `wrangler secret put` and `.dev.vars` locally. `wrangler types` can't see them, so they are declared by hand in `env.d.ts` via interface merging. Add new secrets there.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` must exist in **both** `wrangler.jsonc` `vars` and `.env.production`. Next inlines `NEXT_PUBLIC_*` at build time, so a Worker var alone never reaches the client bundle. `.env.production` is committed on purpose (it is a public key).
- Server code gets env through `getCloudflareContext()` from `@opennextjs/cloudflare`. Unit tests mock that module.
- `RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL` are **not yet set in production** (client hasn't set up Resend). Leads save to D1 but nobody is emailed.

## Conventions and rules that are easy to violate

- **Do not show prices.** No verified rate card exists. `MoveScoper` scopes a job and hands off to `/quote` without quoting a figure. `lib/estimate.ts` and `content/rates.ts` are tested but intentionally unwired, and the numbers in `rates.ts` are invented placeholders. Don't surface them in UI.
- **Don't add factual claims without checking `CLAIMS.md`.** Every statistic, coverage city, capability, or policy on the site is tracked there, and most rows are still UNVERIFIED (this is a soft launch). New claims get a new row. The contact email is `info@bastuku-inv.com` (verified, CLAIMS #6). The WhatsApp number is `+260 976 831 400`; `+260 977 778 844` is a call-only second line. The old `0962 936172` still lingers in the `QuoteForm` placeholder and in test fixtures.
- **Adding or renaming a service touches three places:** `SERVICE_SLUGS` in `lib/validation.ts` (the Zod enum and the `ServiceSlug` type derive from it), the `SERVICES` array in `content/services.ts`, and a `baseFee` entry in `content/rates.ts` if the estimator is ever rewired. **A rename also needs** the old slug in `LEGACY_SLUGS` (`lib/validation.ts`, so old `?service=` links and cached forms still work) and a permanent redirect in `next.config.ts`; check the redirect under `npm run preview`, not only `next start`. Never hardcode a service count; derive from `SERVICES.length` (hardcoded sixes broke when the seventh service was added; Warehousing made eight in November 2026).
- **Image policy:** every shipped raster must be ≤ 200 KB. Add a `MANIFEST` entry in `scripts/optimise-images.mjs` and run `npm run images`. `Founder.png`, `hero-bg.png` and the old `Gemini_*` hero are deliberately excluded from output (client request, an invented facility, and an AI-upscaled frame with another firm's livery; CLAIMS #16). The hero is art-directed (`components/sections/Hero.tsx`): a landscape file from `sm` up and a portrait crop for phones, so neither gets stretched; `tests/e2e/media.spec.ts` fails if it is blown up past 1.5x. The November 2026 phone photos are not committed (8-10 MB each); keep them in `images/` locally, and an entry whose source is missing is skipped.
- **Video policy:** muted loops only, in the 4:5 service-page slot, ≤ 1.5 MB, no audio track. `LoopingVideo` loads nothing until the clip is on screen, never autoplays under reduced motion, and has a pause button (WCAG 2.2.2). Encode with ffmpeg (not a project dependency; `pip install imageio-ffmpeg` bundles one):
  ```bash
  ffmpeg -i images/20260624_110930.mp4 -an -vf "crop=1080:1350:0:285,scale=720:900,fps=30" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 27 -preset slow -movflags +faststart public/videos/house-packing.mp4
  ffmpeg -i public/videos/house-packing.mp4 -frames:v 1 images/house-packing-poster.png   # then npm run images
  ```
- **Colour:** palette is from the logo (navy `ink #072248`, lime `#AEE522`). Lime is 1.4:1 on paper, so it is for backgrounds and dark surfaces only; use `lime-deep` for accent text on light. Tokens are in the `@theme` block of `app/globals.css`. There is no dark mode.
- **Tailwind source detection is off** (`@import "tailwindcss" source(none)` plus explicit `@source` lines). A class in a new top-level directory will silently not generate. Add an `@source` line for it.
- **Motion:** animate only `opacity` and `transform` (CLS must stay 0). `Reveal` rests *visible* and only arms elements fully below the fold, so slow or failed JS degrades to a static page, never a blank one. Respect `prefers-reduced-motion`. `tests/e2e/motion.spec.ts` guards this.
- **Accessibility budget is 1.0** in Lighthouse and is a hard failure. Touch targets must meet WCAG 2.2 target size and small text 4.5:1. See `BUDGETS.md`. `categories:performance` is `warn` only because local measurement is unrepresentative.
- Fonts are `Big Shoulders` (display), `Sora` (body), `JetBrains Mono` via `next/font/google` in `lib/fonts.ts`. Google renamed "Big Shoulders Display", and `next/font` exports only the new name.
- Code style: tabs for indentation, double quotes, semicolons, comments that explain *why* (many existing ones record a past failure).

## Testing notes

- Vitest runs in the `node` environment with `clearMocks: true`. Route tests mock `@/lib/turnstile`, `@/lib/leads`, `@/lib/email`, and `@opennextjs/cloudflare`.
- Playwright tests run against a **production build** on port 3100, not `next dev`, so prerender regressions are caught. First run is slow because it builds.
- Lighthouse budgets live in `lighthouserc.json`; rationale is in `BUDGETS.md` (JSON can't hold comments).

## Windows traps on this machine

- Build fails with `EPERM` on `.open-next`: an orphaned `workerd` holds it. `Get-Process workerd | Stop-Process -Force`, delete `.open-next`, rebuild. The Playwright suite reliably leaves one behind, so expect this on the first deploy after e2e.
- Don't delete `.next` casually. `next/font` caches the Google Fonts download there, and a refetch fails with a misleading "Failed to fetch `Sora` from Google Fonts". Retry the build.
- `npx @lhci/cli autorun` fails locally with `EPERM ... Temp\lighthouse.<n>` (a chrome-launcher cleanup bug). CI is unaffected; local workaround is in `BUDGETS.md`.
- `npx wrangler login` OAuth can time out; use a scoped `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit, D1: Edit, Account Settings: Read).

## Other docs in the repo

`DEPLOYMENT_GUIDE.md` and `SOP_DEPLOYMENT_AND_DOMAIN_CONNECTION.md` predate the move to Workers and describe the old GitHub Pages setup, so treat them as stale. `README.md` is a one-liner.
