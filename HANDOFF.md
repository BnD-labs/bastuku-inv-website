# Handoff — picking this up on another machine

Branch: **`rebuild/nextjs-workers`** (not `main`). All work is pushed.

## Where the project stands

24 of the 26 tasks in `2026-08-04-bastuku-rebuild.md` are complete.

- **Live on Cloudflare:** https://bastuku-inv.bndlabs-023.workers.dev — all 14
  routes serve, sitemap has 14 URLs, images serve from the edge.
- **D1 `bastuku-leads` is migrated locally and remotely** (`leads`, 14 columns).
- **Tests:** 37 unit (Vitest) + 10 e2e (Playwright), all passing.
- **Lighthouse on the deployed Worker:** performance 88, accessibility 100,
  SEO 100, best-practices 100, CLS 0. See `BUDGETS.md`.

## Setup on a fresh machine

```bash
git clone https://github.com/BnD-labs/bastuku-inv-website.git
cd bastuku-inv-website
git checkout rebuild/nextjs-workers

npm ci
npx playwright install chromium          # e2e browser, not in git
npx wrangler login                       # Cloudflare auth, per-machine

cp .dev.vars.example .dev.vars           # local secrets, gitignored
npx wrangler d1 migrations apply bastuku-leads --local   # local DB state
```

Requires Node 22+ (built on 24.19.0).

`.dev.vars.example` ships Cloudflare's documented always-pass Turnstile test
keys, so the quote form works locally without real credentials.

### Windows notes

Two environment issues cost time; both are documented so they do not again:

- `npx @lhci/cli autorun` fails with `EPERM ... Temp\lighthouse.<n>` — a
  `chrome-launcher` cleanup bug. Workaround in `BUDGETS.md`. CI is unaffected.
- If a build fails with `EPERM` on `.open-next`, orphaned `workerd`/`esbuild`
  processes are holding it. Kill them, then delete the directory.

## What is blocked, and on whom

| Blocker | Owner | Why it matters |
|---|---|---|
| **Nameservers still on Google** (`ns-cloud-e*.googledomains.com`) | client | Workers custom domains require the zone on Cloudflare. Add the site in Cloudflare, change NS at the registrar. Until then the domain cannot point at the Worker. |
| **Turnstile widget not created** | client | `POST /api/quote` rejects every submission without a real secret key. |
| **Resend domain not verified** | client | Lead emails send from `noreply@bastuku-inv.com` and will not deliver until `bastuku-inv.com` is verified. Slowest item — start first. |
| **`CLAIMS.md`: 14 unresolved rows** | client | The launch gate. Rate card (#10) is invented placeholder data; phone (#7) and the `info@bastuku.com` vs `bastuku-inv.com` email conflict (#6) are unconfirmed. |

### Current DNS is broken independently of the above

`bastuku-inv.com` has **eight A records**, round-robin across two hosts:

- `185.199.108–111.153` → GitHub Pages
- `216.239.32/34/36/38.110` → Google

Hence the 404 and the missing TLS certificate. `www` still CNAMEs to
`bnd-labs.github.io`. Moving the zone to Cloudflare clears all of this.

## Remaining work once unblocked

1. `wrangler secret put TURNSTILE_SECRET_KEY` / `RESEND_API_KEY` /
   `LEAD_NOTIFY_EMAIL`, and add `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
2. Redeploy, submit a real quote, confirm the row lands in remote D1 and the
   email arrives.
3. Work `CLAIMS.md` to zero with the client.
4. Attach `bastuku-inv.com` as a Custom Domain on the Worker; Cloudflare issues
   the certificate.
5. Delete the GitHub Pages leftovers — `CNAME`, `.nojekyll`, and `legacy/`.

## Repo orientation

- `2026-08-04-bastuku-rebuild.md` — the 26-task plan being executed
- `CLAIMS.md` — launch gate for unverified marketing claims
- `BUDGETS.md` — Lighthouse budgets and why performance is `warn` not `error`
- `content/` — typed page content; adding a service is a data edit
- `lib/` — pure logic (`estimate`, `whatsapp`, `validation`) plus the only
  files that know about SQL (`leads`) and Resend (`email`)
- `legacy/` — the previous static site, kept until cutover
- `images/` — source photography, repo-only. `npm run images` emits optimised
  copies to `public/` and fails if any raster exceeds 200 KB.
