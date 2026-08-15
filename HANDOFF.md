# Handoff — picking this up on another machine

Branch: **`rebuild/nextjs-workers`** (not `main`). All work is pushed.

## Where the project stands

The site is **live on its real domain**: https://bastuku-inv.com

- DNS moved to Cloudflare on 2026-08-15. The old GitHub Pages A records are
  deleted and the Worker serves the apex via a Custom Domain with a Cloudflare
  certificate. `www` 301s to the apex.
- **Turnstile is live.** Widget created for `bastuku-inv.com`; the secret is a
  Worker secret and the public site key is in `wrangler.jsonc` `vars` **and** in
  `.env.production`, because Next inlines `NEXT_PUBLIC_*` at build time — setting
  it only as a Worker var would not reach the client bundle.
- **D1 `bastuku-leads` is migrated locally and remotely** (`leads`, 14 columns).
  The remote table was created on 2026-08-15; it had not actually been applied
  despite an earlier note claiming otherwise.
- **Tests:** 37 unit (Vitest) + 10 e2e (Playwright), all passing.

## Setup on a fresh machine

```bash
git clone https://github.com/BnD-labs/bastuku-inv-website.git
cd bastuku-inv-website
git checkout rebuild/nextjs-workers

npm ci
npx playwright install chromium chromium-headless-shell   # both, see below
cp .dev.vars.example .dev.vars                            # local secrets, gitignored
npx wrangler d1 migrations apply bastuku-leads --local
```

Requires Node 22+ (built on 24.19.0 and 26.7.0).

### Cloudflare auth

`npx wrangler login` (OAuth) **times out in some terminals** — the browser
callback to `localhost:8976` never lands. If that happens, create a scoped API
token in the dashboard (Workers Scripts: Edit, D1: Edit, Account Settings: Read)
and export it:

```bash
export CLOUDFLARE_API_TOKEN=...
npm run deploy
```

### Windows notes

- `npx @lhci/cli autorun` fails with `EPERM ... Temp\lighthouse.<n>` — a
  `chrome-launcher` cleanup bug. Workaround in `BUDGETS.md`. CI is unaffected.
- If a build fails with `EPERM` on `.open-next`, an orphaned `workerd` process
  is holding it. `Get-Process workerd | Stop-Process -Force`, delete the
  directory, rebuild. Running the e2e suite reliably leaves one behind, so
  expect this on the first deploy after `npx playwright test`.
- Do not delete `.next` casually: `next/font` caches the Google Fonts download
  there, and refetching fails on a flaky connection with a misleading
  "Failed to fetch `Sora` from Google Fonts" build error. Just retry.
- Playwright needs **both** `chromium` and `chromium-headless-shell`; installing
  only the former fails at launch with a confusing "just installed or updated"
  message.

## What is blocked, and on whom

| Blocker | Owner | Why it matters |
|---|---|---|
| **Resend not configured** | client | No API key yet, so `RESEND_API_KEY` / `LEAD_NOTIFY_EMAIL` are unset. Leads still save to D1, but nobody is emailed when one arrives. Domain verification for `bastuku-inv.com` is the slow part — start it first. |
| **`CLAIMS.md`: unresolved rows** | client | The launch gate. The site is live with these outstanding, so treat it as a soft launch. Highest priority: the invented rate card (#10), the `info@bastuku.com` vs `bastuku-inv.com` email conflict (#6), and the coverage cities nobody has confirmed (#4, #5). |
| **Pricing model, not just prices** | client | The calculator prices every service as `(base + km × rate) × volume`, which does not fit packaging, general supplies, or container-based freight. Ask how each service is actually priced before rewiring it. |
| **Owned photography** | client | The hero is a third-party frame, cropped to remove another firm's livery and a generator watermark (claim #16). Real photography retires that compromise. |

## Notable design decisions

- **No prices are shown anywhere.** The hero calculator was replaced by
  `MoveScoper`, which scopes a job (service, route, size) and hands it to the
  quote form without quoting a figure. `lib/estimate.ts` and `content/rates.ts`
  are retained and tested but unwired — rewire them when a real rate card lands.
- **Palette comes from the logo**: navy `#072248`, lime `#AEE522`. Lime is
  1.4:1 against paper, so it is a background/dark-surface colour only;
  `--color-lime-deep` is the accessible form for accent text on light. Do not
  use `text-lime` on a light background.
- **Never hardcode a service count.** Copy and tests derive from
  `SERVICES.length`; adding the seventh service broke three hardcoded sixes.

## Repo orientation

- `2026-08-04-bastuku-rebuild.md` — the original 26-task plan (historical; its
  file paths and phone number predate later changes)
- `CLAIMS.md` — launch gate for unverified marketing claims
- `BUDGETS.md` — Lighthouse budgets and why performance is `warn` not `error`
- `content/` — typed page content; adding a service is a data edit
- `lib/` — pure logic (`estimate`, `whatsapp`, `validation`) plus the only
  files that know about SQL (`leads`) and Resend (`email`)
- `images/` — source photography, repo-only. `npm run images` emits optimised
  copies to `public/` and fails if any raster exceeds 200 KB. Crop and duotone
  are declared in the manifest there.
