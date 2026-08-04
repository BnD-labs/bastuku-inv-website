# Bastuku Investments Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-page static site at `bastuku-inv.com` with a 14-page Next.js site on Cloudflare Workers, carrying the visual identity from `bastuku-full-flow.html` and a working lead-capture pipeline backed by D1 and Resend.

**Architecture:** Static-first App Router — all 14 marketing pages prerender at build time. Only `POST /api/quote` runs server-side. Business logic lives in pure, I/O-free functions (`lib/estimate.ts`, `lib/whatsapp.ts`) that are unit-tested without a browser or database. Page content is typed data in `content/`, so the six service pages share one template and adding a service is a data edit.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind v4, `@opennextjs/cloudflare`, Cloudflare D1, Cloudflare Turnstile, Resend, Zod, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-04-bastuku-rebuild-design.md`

## Global Constraints

- **Deploy target is Cloudflare Workers, not Pages.** Use `@opennextjs/cloudflare`. Do not use `@cloudflare/next-on-pages`.
- **No dark mode.** Do not add `dark:` variants. The identity is warm paper by design.
- **No raster image may exceed 200 KB** in the built output. Enforced by Lighthouse CI in Task 27.
- **Every raster image goes through `next/image`.** No bare `<img>` tags outside of SVG.
- **Currency is ZMW.** Format as `K1,200` (no space, comma thousands).
- **Phone number of record:** `+260 962936172` → `wa.me/260962936172`. Flagged for verification in `CLAIMS.md`.
- **Contact email is unresolved** (`info@bastuku.com` vs the `bastuku-inv.com` domain). Use the constant `CONTACT_EMAIL` from `content/site.ts` everywhere so it is a one-line fix.
- **Design tokens are fixed** — see Task 2. Never hardcode a hex value in a component.
- **Every factual claim added to a page must be appended to `CLAIMS.md`** in the same commit.
- **Commit after every task.** Conventional commit prefixes (`feat:`, `test:`, `chore:`, `fix:`).

---

## File Structure

```
app/
  layout.tsx                      root layout, fonts, header/footer
  page.tsx                        home
  services/page.tsx               hub
  services/[slug]/page.tsx        6 service pages from content/services.ts
  coverage/page.tsx
  how-it-works/page.tsx
  for-business/page.tsx
  about/page.tsx
  quote/page.tsx
  contact/page.tsx
  api/quote/route.ts              the only server endpoint
  sitemap.ts
  robots.ts
components/
  ui/                             Button, Pill, Card, Section, Input, Field
  sections/                       Hero, EstimateWidget, ServicePicker,
                                  CoverageTiers, Timeline, TrustStrip, QuoteForm
  layout/                         Header, MobileNav, Footer
  seo/                            JsonLd
lib/
  estimate.ts                     pure — inputs → {low, high}
  whatsapp.ts                     pure — context → wa.me URL
  validation.ts                   Zod schemas, shared client + server
  leads.ts                        the only file that knows SQL exists
  email.ts                        the only file that knows about Resend
  turnstile.ts                    token verification
  format.ts                       currency formatting
content/
  site.ts                         name, phone, email, address, socials
  services.ts                     6 services, typed
  coverage.ts                     3 tiers
  rates.ts                        PLACEHOLDER rate card
  faqs.ts
migrations/
  0001_create_leads.sql
tests/
  unit/                           Vitest
  e2e/                            Playwright
CLAIMS.md                         verification gate
wrangler.jsonc
```

---

# Phase 0 — Foundation

### Task 1: Scaffold Next.js on Cloudflare Workers

Nothing else can be verified until a deploy pipeline exists. This task ends with a real URL serving a real page.

**Files:**
- Create: `package.json`, `next.config.ts`, `wrangler.jsonc`, `open-next.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `.gitignore`
- Move: `index.html`, `js/`, `styles/`, `bastuku-full-flow.html` → `legacy/`

- [ ] **Step 1: Preserve the existing site**

The old site stays readable during the rebuild — it is the source of truth for contact details and copy.

```bash
mkdir -p legacy
git mv index.html js styles bastuku-full-flow.html legacy/
git mv screen.png legacy/
git commit -m "chore: move legacy static site to legacy/"
```

Leave `CNAME`, `.nojekyll`, `images/`, `README.md`, and the docs at root.

- [ ] **Step 2: Scaffold the app**

```bash
npx create-cloudflare@latest bastuku-app --framework=next --platform=workers
```

When prompted: TypeScript **yes**, ESLint **yes**, Tailwind **yes**, `src/` directory **no**, App Router **yes**, import alias `@/*` **yes**.

Then hoist it to the repo root and remove the nested folder:

```bash
cp -r bastuku-app/. . && rm -rf bastuku-app
```

- [ ] **Step 3: Configure the Worker**

`wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "bastuku-inv",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-08-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "observability": { "enabled": true }
}
```

`nodejs_compat` is required — without it the Resend SDK fails at runtime with an opaque module error.

- [ ] **Step 4: Add scripts**

In `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 5: Replace the scaffold home page**

`app/page.tsx`:

```tsx
export default function Home() {
  return <main><h1>Bastuku Investments</h1></main>;
}
```

- [ ] **Step 6: Verify local dev**

Run: `npm run dev`
Expected: `http://localhost:3000` renders "Bastuku Investments" with no console errors.

- [ ] **Step 7: Verify the Workers build**

Run: `npm run preview`
Expected: builds without error and serves the page locally on the Workers runtime. This is the step that catches OpenNext misconfiguration — a passing `next dev` proves nothing about Workers.

- [ ] **Step 8: Deploy to workers.dev**

Run: `npm run deploy`
Expected: deploy succeeds, prints a `*.workers.dev` URL, and that URL renders the page.

**Do not touch DNS yet.** `bastuku-inv.com` continues serving GitHub Pages until Task 30.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js app on Cloudflare Workers"
```

---

### Task 2: Design tokens and fonts

**Files:**
- Create: `app/globals.css`, `lib/fonts.ts`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: CSS custom properties `--color-ink`, `--color-paper`, etc., consumable as Tailwind utilities (`bg-paper`, `text-ink`). Font CSS variables `--font-display`, `--font-body`, `--font-mono`.

- [ ] **Step 1: Define tokens**

`app/globals.css` — values copied verbatim from `legacy/bastuku-full-flow.html`:

```css
@import "tailwindcss";

@theme {
  --color-ink: #16202A;
  --color-ink-soft: #24323F;
  --color-paper: #F3EFE6;
  --color-paper-dim: #E7E1D2;
  --color-amber: #E8A33D;
  --color-amber-bright: #F5B85C;
  --color-brick: #B24C32;
  --color-route: #5B8C7B;
  --color-route-bright: #74B39E;
  --color-card-tint: #E4EDE9;

  --font-display: var(--font-big-shoulders), sans-serif;
  --font-body: var(--font-sora), sans-serif;
  --font-mono: var(--font-jetbrains), monospace;

  --radius-pill: 999px;
}

body {
  font-family: var(--font-body);
  background: var(--color-paper);
  color: var(--color-ink);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The reduced-motion block is global and non-negotiable — the concept has none, and the coverflow is heavily animated.

- [ ] **Step 2: Self-host the fonts**

`lib/fonts.ts`:

```ts
import { Big_Shoulders_Display, Sora, JetBrains_Mono } from "next/font/google";

export const bigShoulders = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-big-shoulders",
  display: "swap",
});

export const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});
```

`next/font` self-hosts and subsets at build time — no request to `fonts.googleapis.com`, no layout shift. The concept loads three families from the CDN render-blocking; this removes that entirely.

- [ ] **Step 3: Wire into the layout**

`app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { bigShoulders, sora, jetbrains } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bastuku Investments",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bigShoulders.variable} ${sora.variable} ${jetbrains.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify**

Add to `app/page.tsx` temporarily:

```tsx
<h1 className="font-display text-6xl uppercase text-brick">Bastuku</h1>
```

Run: `npm run dev`
Expected: heading renders in Big Shoulders Display, brick red `#B24C32`, page background warm paper `#F3EFE6`. Then revert the temporary markup.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css lib/fonts.ts app/layout.tsx
git commit -m "feat: add design tokens and self-hosted fonts"
```

---

### Task 3: Site constants and UI primitives

**Files:**
- Create: `content/site.ts`, `components/ui/Button.tsx`, `components/ui/Pill.tsx`, `components/ui/Card.tsx`, `components/ui/Section.tsx`, `components/ui/Field.tsx`

**Interfaces:**
- Produces: `SITE` constant; `<Button variant="primary"|"dark"|"ghost">`, `<Pill>`, `<Card>`, `<Section tone="paper"|"ink">`, `<Field label htmlFor error>`.

- [ ] **Step 1: Site constants**

`content/site.ts` — every contact detail flows through here, so the unresolved email is a one-line fix:

```ts
export const SITE = {
  name: "Bastuku Investments",
  legalName: "Bastuku Investments Limited",
  foundedYear: 2017,
  phoneDisplay: "+260 962936172",
  phoneE164: "+260962936172",
  whatsappNumber: "260962936172",
  // UNVERIFIED: conflicts with the bastuku-inv.com domain. See CLAIMS.md.
  email: "info@bastuku.com",
  city: "Lusaka",
  country: "Zambia",
  url: "https://bastuku-inv.com",
} as const;

export const CONTACT_EMAIL = SITE.email;
```

- [ ] **Step 2: Button**

`components/ui/Button.tsx`:

```tsx
import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-amber text-ink hover:bg-amber-bright",
  dark: "bg-ink text-amber-bright hover:bg-ink-soft",
  ghost: "bg-card-tint text-ink border border-ink/10 hover:bg-card-tint/70",
} as const;

type Variant = keyof typeof variants;

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3.5 " +
  "font-body text-sm font-bold whitespace-nowrap transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brick";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
```

The `focus-visible` outline is on the base style so no variant can ship without a visible focus ring — the concept has none anywhere.

- [ ] **Step 3: Section**

`components/ui/Section.tsx`:

```tsx
const tones = {
  paper: "bg-paper text-ink",
  ink: "bg-ink text-paper",
} as const;

export function Section({
  tone = "paper",
  className = "",
  children,
  ...props
}: React.ComponentProps<"section"> & { tone?: keyof typeof tones }) {
  return (
    <section className={`${tones[tone]} px-[6vw] py-20 ${className}`} {...props}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
```

- [ ] **Step 4: Pill, Card, Field**

`components/ui/Pill.tsx`:

```tsx
export function Pill({ className = "", ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill bg-card-tint px-5 py-2.5 font-body text-sm font-bold text-ink ${className}`}
      {...props}
    />
  );
}
```

`components/ui/Card.tsx`:

```tsx
export function Card({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`rounded-2xl bg-paper p-7 text-ink shadow-[0_18px_34px_-18px_rgba(22,32,42,0.35)] ${className}`}
      {...props}
    />
  );
}
```

`components/ui/Field.tsx`:

```tsx
export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-body text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="font-body text-sm text-brick">
          {error}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify**

Render all four primitives on `app/page.tsx`, run `npm run dev`, confirm they display with correct tokens. Tab through and confirm the focus ring is visible on `Button`. Revert the scratch markup.

- [ ] **Step 6: Commit**

```bash
git add content/site.ts components/ui
git commit -m "feat: add site constants and UI primitives"
```

---

# Phase 1 — Pure Logic (TDD)

These three modules hold most of the logic risk and have zero I/O, so they are tested first and fastest.

### Task 4: Test infrastructure and `lib/whatsapp.ts`

**Files:**
- Create: `vitest.config.ts`, `lib/whatsapp.ts`, `tests/unit/whatsapp.test.ts`

**Interfaces:**
- Produces: `buildWhatsAppUrl(ctx: WhatsAppContext): string` and the `WhatsAppContext` type. Consumed by Header, Hero, QuoteForm, and every error fallback.

- [ ] **Step 1: Install and configure Vitest**

```bash
npm install -D vitest @vitejs/plugin-react
```

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: { environment: "node", include: ["tests/unit/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

- [ ] **Step 2: Write the failing test**

`tests/unit/whatsapp.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

describe("buildWhatsAppUrl", () => {
  it("returns a bare wa.me link with a default message when given no context", () => {
    const url = buildWhatsAppUrl({});
    expect(url).toBe(
      "https://wa.me/260962936172?text=Hi%20Bastuku%2C%20I%27d%20like%20a%20quote."
    );
  });

  it("includes the service when provided", () => {
    const url = buildWhatsAppUrl({ service: "House Removals" });
    expect(decodeURIComponent(url)).toContain("Service: House Removals");
  });

  it("includes origin and destination when both provided", () => {
    const url = buildWhatsAppUrl({ origin: "Kabulonga", destination: "Roma" });
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("From: Kabulonga");
    expect(decoded).toContain("To: Roma");
  });

  it("omits empty fields rather than emitting blank labels", () => {
    const decoded = decodeURIComponent(buildWhatsAppUrl({ origin: "", service: "Packaging" }));
    expect(decoded).not.toContain("From:");
    expect(decoded).toContain("Service: Packaging");
  });

  it("percent-encodes newlines and special characters", () => {
    const url = buildWhatsAppUrl({ message: "50% fragile & heavy" });
    expect(url).not.toContain(" ");
    expect(url).toContain("%25");
    expect(decodeURIComponent(url)).toContain("50% fragile & heavy");
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npx vitest run tests/unit/whatsapp.test.ts`
Expected: FAIL — cannot resolve `@/lib/whatsapp`.

- [ ] **Step 4: Implement**

`lib/whatsapp.ts`:

```ts
import { SITE } from "@/content/site";

export interface WhatsAppContext {
  service?: string;
  origin?: string;
  destination?: string;
  name?: string;
  message?: string;
}

export function buildWhatsAppUrl(ctx: WhatsAppContext = {}): string {
  const lines = ["Hi Bastuku, I'd like a quote."];

  const fields: [string, string | undefined][] = [
    ["Name", ctx.name],
    ["Service", ctx.service],
    ["From", ctx.origin],
    ["To", ctx.destination],
    ["Details", ctx.message],
  ];

  for (const [label, value] of fields) {
    if (value && value.trim()) lines.push(`${label}: ${value.trim()}`);
  }

  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}
```

- [ ] **Step 5: Run to verify pass**

Run: `npx vitest run tests/unit/whatsapp.test.ts`
Expected: 5 passed.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts lib/whatsapp.ts tests/unit/whatsapp.test.ts package.json package-lock.json
git commit -m "feat: add WhatsApp deep-link builder with tests"
```

---

### Task 5: `lib/validation.ts`

**Files:**
- Create: `lib/validation.ts`, `tests/unit/validation.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `quoteSchema` (Zod), `type QuoteInput`. Used by `QuoteForm` client-side and `/api/quote` server-side — one schema, two consumers, no drift.

- [ ] **Step 1: Install Zod**

```bash
npm install zod
```

- [ ] **Step 2: Write the failing test**

`tests/unit/validation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { quoteSchema } from "@/lib/validation";

const valid = {
  name: "John Banda",
  phone: "+260962936172",
  serviceSlug: "house-removals",
};

describe("quoteSchema", () => {
  it("accepts a minimal valid submission", () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a name shorter than two characters", () => {
    const r = quoteSchema.safeParse({ ...valid, name: "J" });
    expect(r.success).toBe(false);
  });

  it("accepts Zambian numbers in local 0-prefixed form", () => {
    expect(quoteSchema.safeParse({ ...valid, phone: "0962936172" }).success).toBe(true);
  });

  it("accepts numbers with spaces and strips them", () => {
    const r = quoteSchema.safeParse({ ...valid, phone: "+260 96 293 6172" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.phone).toBe("+260962936172");
  });

  it("rejects a phone number that is not a plausible Zambian mobile", () => {
    expect(quoteSchema.safeParse({ ...valid, phone: "12345" }).success).toBe(false);
  });

  it("rejects an unknown service slug", () => {
    expect(quoteSchema.safeParse({ ...valid, serviceSlug: "teleportation" }).success).toBe(false);
  });

  it("treats email as optional but validates it when present", () => {
    expect(quoteSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
    expect(quoteSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...valid, email: "a@b.com" }).success).toBe(true);
  });

  it("rejects a message longer than 2000 characters", () => {
    const r = quoteSchema.safeParse({ ...valid, message: "x".repeat(2001) });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npx vitest run tests/unit/validation.test.ts`
Expected: FAIL — cannot resolve `@/lib/validation`.

- [ ] **Step 4: Implement**

`lib/validation.ts`:

```ts
import { z } from "zod";

export const SERVICE_SLUGS = [
  "house-removals",
  "office-relocation",
  "cross-border-moves",
  "exports-imports",
  "packaging",
  "general-supplies",
] as const;

// Zambian mobile: +260 or 0 prefix, then 9 digits starting 7 or 9.
const ZM_MOBILE = /^(?:\+260|0)(?:7|9)\d{8}$/;

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(120),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .refine((v) => ZM_MOBILE.test(v), "Enter a valid Zambian mobile number")
    .transform((v) => (v.startsWith("0") ? `+260${v.slice(1)}` : v)),
  email: z.union([z.literal(""), z.string().email("Enter a valid email address")]).optional(),
  serviceSlug: z.enum(SERVICE_SLUGS),
  origin: z.string().trim().max(200).optional(),
  destination: z.string().trim().max(200).optional(),
  moveDate: z.string().trim().max(40).optional(),
  message: z.string().trim().max(2000, "Please keep it under 2000 characters").optional(),
  estimateLow: z.number().int().nonnegative().optional(),
  estimateHigh: z.number().int().nonnegative().optional(),
  sourcePage: z.string().trim().max(120).optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
```

Normalising `0…` to `+260…` at the schema boundary means `lib/leads.ts` never sees two formats for the same number.

- [ ] **Step 5: Run to verify pass**

Run: `npx vitest run tests/unit/validation.test.ts`
Expected: 8 passed.

- [ ] **Step 6: Commit**

```bash
git add lib/validation.ts tests/unit/validation.test.ts package.json package-lock.json
git commit -m "feat: add shared Zod validation schema with tests"
```

---

### Task 6: `lib/estimate.ts` and the placeholder rate card

**Files:**
- Create: `content/rates.ts`, `lib/estimate.ts`, `lib/format.ts`, `tests/unit/estimate.test.ts`

**Interfaces:**
- Consumes: `SERVICE_SLUGS` from `lib/validation.ts`.
- Produces: `calculateEstimate(input: EstimateInput, rates?: RateConfig): EstimateRange`, `formatKwacha(n: number): string`.

> **BLOCKED ON CLIENT.** `content/rates.ts` holds invented numbers. The tool ships behind a visible "indicative range" label until the real rate card arrives. Swapping it is a one-file change — no code touches.

- [ ] **Step 1: Write the placeholder rate card**

`content/rates.ts`:

```ts
/**
 * PLACEHOLDER RATE CARD — NUMBERS ARE INVENTED.
 * Awaiting Bastuku's real rate card. See CLAIMS.md.
 * Swapping this file requires no code changes.
 */
export interface RateConfig {
  /** Callout fee in ZMW before distance and volume. */
  baseFee: Record<string, number>;
  /** ZMW per kilometre. */
  perKm: number;
  /** Multiplier applied to (base + distance). */
  volumeMultiplier: Record<"small" | "medium" | "large", number>;
  /** Fraction applied either side of the midpoint to produce the range. */
  spread: number;
}

export const RATES: RateConfig = {
  baseFee: {
    "house-removals": 1500,
    "office-relocation": 2500,
    "cross-border-moves": 6000,
    "exports-imports": 5000,
    packaging: 800,
    "general-supplies": 500,
  },
  perKm: 25,
  volumeMultiplier: { small: 1, medium: 1.6, large: 2.4 },
  spread: 0.2,
};

export const RATES_ARE_PLACEHOLDER = true;
```

- [ ] **Step 2: Write the failing test**

`tests/unit/estimate.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { calculateEstimate } from "@/lib/estimate";
import { formatKwacha } from "@/lib/format";
import type { RateConfig } from "@/content/rates";

// Fixed fixture so tests never break when the real rate card lands.
const rates: RateConfig = {
  baseFee: { "house-removals": 1000, packaging: 500 },
  perKm: 10,
  volumeMultiplier: { small: 1, medium: 2, large: 3 },
  spread: 0.2,
};

describe("calculateEstimate", () => {
  it("computes (base + distance) * volume with a symmetric spread", () => {
    // (1000 + 10*50) * 1 = 1500 → ±20% → 1200 to 1800
    const r = calculateEstimate(
      { serviceSlug: "house-removals", distanceKm: 50, volume: "small" },
      rates
    );
    expect(r).toEqual({ low: 1200, high: 1800, currency: "ZMW" });
  });

  it("applies the volume multiplier", () => {
    // (1000 + 10*50) * 3 = 4500 → 3600 to 5400
    const r = calculateEstimate(
      { serviceSlug: "house-removals", distanceKm: 50, volume: "large" },
      rates
    );
    expect(r).toEqual({ low: 3600, high: 5400, currency: "ZMW" });
  });

  it("returns whole kwacha, never fractional", () => {
    const r = calculateEstimate(
      { serviceSlug: "packaging", distanceKm: 7, volume: "medium" },
      rates
    );
    expect(Number.isInteger(r.low)).toBe(true);
    expect(Number.isInteger(r.high)).toBe(true);
  });

  it("throws on an unknown service rather than silently returning zero", () => {
    expect(() =>
      calculateEstimate({ serviceSlug: "unknown", distanceKm: 10, volume: "small" }, rates)
    ).toThrow(/unknown service/i);
  });

  it("throws on negative distance", () => {
    expect(() =>
      calculateEstimate({ serviceSlug: "packaging", distanceKm: -5, volume: "small" }, rates)
    ).toThrow(/distance/i);
  });

  it("handles zero distance as a same-area move", () => {
    const r = calculateEstimate(
      { serviceSlug: "packaging", distanceKm: 0, volume: "small" },
      rates
    );
    expect(r).toEqual({ low: 400, high: 600, currency: "ZMW" });
  });
});

describe("formatKwacha", () => {
  it("formats with a K prefix and comma thousands", () => {
    expect(formatKwacha(1200)).toBe("K1,200");
    expect(formatKwacha(950)).toBe("K950");
    expect(formatKwacha(1234567)).toBe("K1,234,567");
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npx vitest run tests/unit/estimate.test.ts`
Expected: FAIL — cannot resolve `@/lib/estimate`.

- [ ] **Step 4: Implement**

`lib/format.ts`:

```ts
export function formatKwacha(amount: number): string {
  return `K${Math.round(amount).toLocaleString("en-US")}`;
}
```

`lib/estimate.ts`:

```ts
import { RATES, type RateConfig } from "@/content/rates";

export type Volume = "small" | "medium" | "large";

export interface EstimateInput {
  serviceSlug: string;
  distanceKm: number;
  volume: Volume;
}

export interface EstimateRange {
  low: number;
  high: number;
  currency: "ZMW";
}

export function calculateEstimate(
  input: EstimateInput,
  rates: RateConfig = RATES
): EstimateRange {
  const base = rates.baseFee[input.serviceSlug];
  if (base === undefined) {
    throw new Error(`Unknown service: ${input.serviceSlug}`);
  }
  if (!Number.isFinite(input.distanceKm) || input.distanceKm < 0) {
    throw new Error(`Invalid distance: ${input.distanceKm}`);
  }

  const midpoint = (base + input.distanceKm * rates.perKm) * rates.volumeMultiplier[input.volume];

  return {
    low: Math.round(midpoint * (1 - rates.spread)),
    high: Math.round(midpoint * (1 + rates.spread)),
    currency: "ZMW",
  };
}
```

Throwing on an unknown service matters — returning `0` would render "K0 – K0" to a customer, which reads as free.

- [ ] **Step 5: Run to verify pass**

Run: `npx vitest run`
Expected: all suites pass (whatsapp 5, validation 8, estimate 7).

- [ ] **Step 6: Commit**

```bash
git add content/rates.ts lib/estimate.ts lib/format.ts tests/unit/estimate.test.ts
git commit -m "feat: add estimate calculator with placeholder rate card"
```

---

# Phase 2 — Content Layer

### Task 7: Service content

**Files:**
- Create: `content/services.ts`, `CLAIMS.md`

**Interfaces:**
- Consumes: `SERVICE_SLUGS` from `lib/validation.ts`.
- Produces: `SERVICES: Service[]`, `getService(slug: string): Service | undefined`. Drives `/services`, `/services/[slug]`, the home ServicePicker, and the quote form's service dropdown.

- [ ] **Step 1: Define the shape and the six services**

`content/services.ts`:

```ts
import type { SERVICE_SLUGS } from "@/lib/validation";

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export interface Service {
  slug: ServiceSlug;
  /** Short label for tiles and dropdowns. */
  name: string;
  /** Page <h1>. */
  heading: string;
  /** One-sentence tile copy and meta description seed. */
  summary: string;
  /** Body copy, one paragraph per entry. */
  body: string[];
  /** Bullets rendered as an "included" list. */
  includes: string[];
  /** CTA label used on tiles and the page hero. */
  cta: string;
  /** Emoji placeholder replaced by SVG in Task 15. */
  icon: string;
}

export const SERVICES: Service[] = [
  {
    slug: "house-removals",
    name: "House Removals",
    heading: "House moves, handled end to end",
    summary:
      "We pack, load, transport, and unpack. Book a date and let us carry the rest.",
    body: [
      "Moving house is mostly logistics wearing the costume of an emotional event. We take the logistics off your hands so you can deal with the rest of it.",
      "Your move gets a named lead who is with you from the first packed box to the final walkthrough. One person, one number, no chasing updates through a switchboard.",
    ],
    includes: [
      "Packing materials and professional packing",
      "Loading, transport, and unloading",
      "Unpacking and placement in your new home",
      "A walkthrough together before we leave",
    ],
    cta: "Book This Move",
    icon: "🏠",
  },
  {
    slug: "office-relocation",
    name: "Office Relocation",
    heading: "Move the office without losing the week",
    summary:
      "Relocations scheduled around your working hours, so your team barely notices the switch.",
    body: [
      "The cost of an office move is rarely the move. It is the days your team spends unable to work. We schedule around that — evenings, weekends, or phased by department.",
      "Equipment, furniture, and sensitive documents are inventoried before they leave and checked off on arrival, so nothing goes missing between two addresses.",
    ],
    includes: [
      "Out-of-hours and weekend scheduling",
      "Inventoried, checked-off transport",
      "IT equipment and sensitive document handling",
      "Phased moves by department or floor",
    ],
    cta: "Plan My Relocation",
    icon: "🏢",
  },
  {
    slug: "cross-border-moves",
    name: "Cross-Border Moves",
    heading: "Relocating out of Zambia",
    summary:
      "Customs, permits, and border logistics handled — you don't lift a finger.",
    body: [
      "A cross-border move is a paperwork problem with a truck attached. We handle the paperwork.",
      "Customs documentation, permits, and border clearance are arranged before your belongings reach the crossing, so your things are not sitting at a border waiting on a form.",
    ],
    includes: [
      "Customs documentation and permits",
      "Border clearance coordination",
      "Full packing and secure transport",
      "Delivery and placement at destination",
    ],
    cta: "Get Cross-Border Quote",
    icon: "🌍",
  },
  {
    slug: "exports-imports",
    name: "Exports & Imports",
    heading: "Commercial freight and clearing",
    summary:
      "Moving goods, not households — customs clearing and freight for businesses.",
    body: [
      "This is the commercial side: consignments, clearing agents, and customs procedure for businesses moving stock rather than furniture.",
      "We handle documentation, duty calculation, and clearance so your goods move through the border on schedule instead of accruing storage fees.",
    ],
    includes: [
      "Import and export documentation",
      "Customs clearing and duty handling",
      "Freight forwarding and consolidation",
      "Delivery to your warehouse or site",
    ],
    cta: "Discuss Freight",
    icon: "🚢",
  },
  {
    slug: "packaging",
    name: "Professional Packaging",
    heading: "Packing that survives the road",
    summary:
      "Custom crating, wrapping, and materials for fragile and high-value items.",
    body: [
      "Most transit damage is packing damage that happened before the truck moved. Good packing is the cheapest insurance in logistics.",
      "We supply the materials and do the work — including custom crating for items that no standard box was designed to hold.",
    ],
    includes: [
      "Professional packing materials supplied",
      "Custom crating for fragile and odd-shaped items",
      "Labelling and inventory",
      "Available standalone or as part of a move",
    ],
    cta: "Book Packing",
    icon: "📦",
  },
  {
    slug: "general-supplies",
    name: "General Supplies",
    heading: "Sourced, collected, delivered",
    summary:
      "One-off jobs and ongoing supply — no long-term commitment required.",
    body: [
      "Sometimes the job is not a move. Something needs sourcing, collecting, or delivering, and it needs to happen this week.",
      "We take one-off jobs as readily as recurring supply contracts, with no minimum and no long-term commitment.",
    ],
    includes: [
      "Sourcing goods and materials",
      "Collection and delivery",
      "One-off or recurring schedules",
      "No minimum commitment",
    ],
    cta: "Request a Job",
    icon: "🚚",
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
```

- [ ] **Step 2: Create the claims gate**

`CLAIMS.md`:

```markdown
# Claims Verification — required before launch

Every factual or promissory statement on the site is listed here. Nothing
in this file ships to production until the **Status** column reads
`VERIFIED` or the claim is struck.

| # | Claim | Where it appears | Source | Status |
|---|---|---|---|---|
| 1 | "98% Client Satisfaction" | not yet used | old site | ❌ UNVERIFIED — do not use until substantiated |
| 2 | "We respond within 2 hours" | not yet used | old site | ❌ UNVERIFIED |
| 3 | Moves completed: **200+** vs **500+** | stats strip | old site vs concept | ⚠️ CONFLICT — client must give one number |
| 4 | Cross-border to Zimbabwe, South Africa, Botswana | services, coverage | concept | ❌ UNVERIFIED — do we actually serve all three? |
| 5 | Regional coverage: Ndola, Kitwe, Livingstone, Kabwe | coverage | concept | ❌ UNVERIFIED |
| 6 | Contact email `info@bastuku.com` | `content/site.ts` | old site | ⚠️ CONFLICT — domain is `bastuku-inv.com` |
| 7 | Phone `+260 962936172` | site-wide | old site | ❌ UNVERIFIED — confirm this is the WhatsApp number |
| 8 | Trading since May 2017 | about, stats | old site | ❌ UNVERIFIED |
| 9 | "Payment only finalized once you're satisfied" | how-it-works | concept | ❌ UNVERIFIED — is this a real policy? |
| 10 | All estimate figures | `content/rates.ts` | **invented placeholder** | ❌ PLACEHOLDER — real rate card required |
| 11 | Customs/permit handling capability | cross-border, exports | concept | ❌ UNVERIFIED — licensed clearing agent? |

## Missing assets — client action

- [ ] Real rate card (blocks the estimate tool showing real numbers)
- [ ] Testimonials — currently zero anywhere on the site
- [ ] Client logos, if any are permitted for use
- [ ] Professional photography (existing images are 8 MB phone exports)
- [ ] Physical address for `LocalBusiness` schema — "Lusaka, Zambia" is too vague to rank
- [ ] Business registration number, if it should appear in the footer
- [ ] Real social media profile URLs (current footer links are dead `#` anchors)
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors. In particular, every `slug` must satisfy `ServiceSlug` — a typo here fails the build rather than producing a 404 later.

- [ ] **Step 4: Commit**

```bash
git add content/services.ts CLAIMS.md
git commit -m "feat: add six-service content model and claims verification gate"
```

---

### Task 8: Coverage and FAQ content

**Files:**
- Create: `content/coverage.ts`, `content/faqs.ts`

**Interfaces:**
- Produces: `COVERAGE_TIERS: CoverageTier[]`, `FAQS: Faq[]`. Drives `/coverage`, the home CoverageTiers section, and `FAQPage` JSON-LD in Task 25.

- [ ] **Step 1: Coverage tiers**

`content/coverage.ts`:

```ts
export interface CoverageTier {
  id: "local" | "regional" | "cross-border";
  label: string;
  headline: string;
  /** Named places. UNVERIFIED — see CLAIMS.md #4, #5. */
  areas: string[];
  detail: string;
}

export const COVERAGE_TIERS: CoverageTier[] = [
  {
    id: "local",
    label: "Local",
    headline: "Lusaka and surrounds",
    areas: ["Lusaka Central", "Kabulonga", "Woodlands", "Chelston", "Roma", "Olympia"],
    detail:
      "Our home ground. Same-week scheduling is usually possible, and for most local moves we can quote from a phone call.",
  },
  {
    id: "regional",
    label: "Regional",
    headline: "Across Zambia",
    areas: ["Ndola", "Kitwe", "Livingstone", "Kabwe", "Chipata", "Solwezi"],
    detail:
      "Long-haul moves to Zambia's major cities. These need a few days' notice so we can route the vehicle efficiently — which keeps your cost down.",
  },
  {
    id: "cross-border",
    label: "Cross-Border",
    headline: "Beyond Zambia",
    areas: ["Zimbabwe", "South Africa", "Botswana"],
    detail:
      "Customs documentation, permits, and border clearance handled before your belongings reach the crossing.",
  },
];
```

- [ ] **Step 2: FAQs**

`content/faqs.ts`:

```ts
export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "How far in advance should I book a move?",
    answer:
      "For local Lusaka moves, a few days is usually enough. Month-end fills up fastest, so book earlier if your date is fixed. Regional and cross-border moves need more notice because of routing and paperwork.",
  },
  {
    question: "Do you provide packing materials?",
    answer:
      "Yes. Boxes, wrapping, and custom crating for fragile items are all supplied. You can book packing as part of a move or on its own.",
  },
  {
    question: "How is the price worked out?",
    answer:
      "Distance, volume, and the type of job. The estimate tool on this site gives you an indicative range immediately; a firm quote follows once we understand the details.",
  },
  {
    question: "Do you move outside Lusaka?",
    answer:
      "Yes — across Zambia's major cities, and across borders to neighbouring countries. See our coverage page for the areas we serve.",
  },
  {
    question: "What happens if something is damaged?",
    answer:
      "We do a walkthrough together before we leave so anything is raised while we are still there. Raise it with your move lead on the day and they will deal with it on the spot.",
  },
  {
    question: "Can you handle office moves outside business hours?",
    answer:
      "Yes, and we usually recommend it. Evening, weekend, and phased department-by-department moves all keep your team working.",
  },
];
```

- [ ] **Step 3: Append the new claims**

Add rows to `CLAIMS.md`:

```markdown
| 12 | FAQ: "walkthrough together before we leave" | faqs | drafted | ❌ UNVERIFIED — is this standard practice? |
| 13 | FAQ: damage handling process | faqs | drafted | ❌ UNVERIFIED — what is the real policy/insurance position? |
| 14 | Coverage: Chipata, Solwezi, Olympia | coverage | drafted | ❌ UNVERIFIED |
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add content/coverage.ts content/faqs.ts CLAIMS.md
git commit -m "feat: add coverage tiers and FAQ content"
```

---

# Phase 3 — Backend

### Task 9: D1 schema and `lib/leads.ts`

**Files:**
- Create: `migrations/0001_create_leads.sql`, `lib/leads.ts`, `tests/unit/leads.test.ts`
- Modify: `wrangler.jsonc`

**Interfaces:**
- Consumes: `QuoteInput` from `lib/validation.ts`.
- Produces: `insertLead(db: D1Database, input: QuoteInput): Promise<string>` returning the new lead id.

- [ ] **Step 1: Create the database**

```bash
npx wrangler d1 create bastuku-leads
```

Copy the printed `database_id` into `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "bastuku-leads",
    "database_id": "PASTE_ID_HERE"
  }
]
```

- [ ] **Step 2: Write the migration**

`migrations/0001_create_leads.sql`:

```sql
CREATE TABLE IF NOT EXISTS leads (
  id            TEXT PRIMARY KEY,
  created_at    TEXT NOT NULL,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT,
  service_slug  TEXT NOT NULL,
  origin        TEXT,
  destination   TEXT,
  move_date     TEXT,
  message       TEXT,
  estimate_low  INTEGER,
  estimate_high INTEGER,
  source_page   TEXT,
  status        TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
```

- [ ] **Step 3: Apply locally**

```bash
npx wrangler d1 migrations apply bastuku-leads --local
```

Expected: reports one migration applied.

- [ ] **Step 4: Write the failing test**

`tests/unit/leads.test.ts` — a fake `D1Database` that records the bound values, so the SQL is tested without a database:

```ts
import { describe, it, expect, vi } from "vitest";
import { insertLead } from "@/lib/leads";
import type { QuoteInput } from "@/lib/validation";

function fakeDb() {
  const calls: { sql: string; values: unknown[] }[] = [];
  const db = {
    prepare(sql: string) {
      return {
        bind(...values: unknown[]) {
          calls.push({ sql, values });
          return { run: async () => ({ success: true }) };
        },
      };
    },
  };
  return { db: db as never, calls };
}

const input: QuoteInput = {
  name: "John Banda",
  phone: "+260962936172",
  serviceSlug: "house-removals",
};

describe("insertLead", () => {
  it("returns a generated id", async () => {
    const { db } = fakeDb();
    const id = await insertLead(db, input);
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("inserts into the leads table with a parameterised statement", async () => {
    const { db, calls } = fakeDb();
    await insertLead(db, input);
    expect(calls).toHaveLength(1);
    expect(calls[0].sql).toContain("INSERT INTO leads");
    expect(calls[0].sql).not.toContain("John Banda"); // never interpolated
  });

  it("stores an ISO timestamp", async () => {
    const { db, calls } = fakeDb();
    await insertLead(db, input);
    const createdAt = calls[0].values[1] as string;
    expect(() => new Date(createdAt).toISOString()).not.toThrow();
  });

  it("writes null, not undefined, for absent optional fields", async () => {
    const { db, calls } = fakeDb();
    await insertLead(db, input);
    expect(calls[0].values).not.toContain(undefined);
  });

  it("persists the estimate range when supplied", async () => {
    const { db, calls } = fakeDb();
    await insertLead(db, { ...input, estimateLow: 1200, estimateHigh: 1800 });
    expect(calls[0].values).toContain(1200);
    expect(calls[0].values).toContain(1800);
  });
});
```

- [ ] **Step 5: Run to verify failure**

Run: `npx vitest run tests/unit/leads.test.ts`
Expected: FAIL — cannot resolve `@/lib/leads`.

- [ ] **Step 6: Implement**

`lib/leads.ts`:

```ts
import type { QuoteInput } from "@/lib/validation";

const INSERT_SQL = `
INSERT INTO leads (
  id, created_at, name, phone, email, service_slug,
  origin, destination, move_date, message,
  estimate_low, estimate_high, source_page, status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`.trim();

export async function insertLead(db: D1Database, input: QuoteInput): Promise<string> {
  const id = crypto.randomUUID();

  await db
    .prepare(INSERT_SQL)
    .bind(
      id,
      new Date().toISOString(),
      input.name,
      input.phone,
      input.email || null,
      input.serviceSlug,
      input.origin || null,
      input.destination || null,
      input.moveDate || null,
      input.message || null,
      input.estimateLow ?? null,
      input.estimateHigh ?? null,
      input.sourcePage || null,
      "new"
    )
    .run();

  return id;
}
```

Values are always bound, never interpolated — the third test asserts this so no future edit can introduce string-built SQL.

- [ ] **Step 7: Run to verify pass**

Run: `npx vitest run tests/unit/leads.test.ts`
Expected: 5 passed.

- [ ] **Step 8: Commit**

```bash
git add migrations lib/leads.ts tests/unit/leads.test.ts wrangler.jsonc
git commit -m "feat: add D1 leads schema and insert layer"
```

---

### Task 10: Turnstile verification and Resend email

**Files:**
- Create: `lib/turnstile.ts`, `lib/email.ts`, `tests/unit/turnstile.test.ts`, `.dev.vars.example`

**Interfaces:**
- Consumes: `QuoteInput`, `SITE`, `getService`.
- Produces: `verifyTurnstile(token, secret, ip?): Promise<boolean>`, `sendLeadEmails(resendKey, input, leadId): Promise<{notified: boolean; confirmed: boolean}>`.

- [ ] **Step 1: Document the secrets**

`.dev.vars.example`:

```
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
RESEND_API_KEY=re_xxxxxxxxxxxx
LEAD_NOTIFY_EMAIL=info@bastuku.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

The `1x…` values are Cloudflare's documented always-pass test keys. Add `.dev.vars` to `.gitignore` — real secrets never enter git.

- [ ] **Step 2: Write the failing Turnstile test**

`tests/unit/turnstile.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from "vitest";
import { verifyTurnstile } from "@/lib/turnstile";

afterEach(() => vi.unstubAllGlobals());

function stubFetch(body: unknown, ok = true) {
  const fn = vi.fn().mockResolvedValue({ ok, json: async () => body });
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("verifyTurnstile", () => {
  it("returns true when Cloudflare reports success", async () => {
    stubFetch({ success: true });
    expect(await verifyTurnstile("tok", "secret")).toBe(true);
  });

  it("returns false when Cloudflare reports failure", async () => {
    stubFetch({ success: false, "error-codes": ["invalid-input-response"] });
    expect(await verifyTurnstile("tok", "secret")).toBe(false);
  });

  it("returns false rather than throwing when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    expect(await verifyTurnstile("tok", "secret")).toBe(false);
  });

  it("returns false for an empty token without calling the network", async () => {
    const fn = stubFetch({ success: true });
    expect(await verifyTurnstile("", "secret")).toBe(false);
    expect(fn).not.toHaveBeenCalled();
  });

  it("sends the token and secret to Cloudflare's siteverify endpoint", async () => {
    const fn = stubFetch({ success: true });
    await verifyTurnstile("tok", "secret", "1.2.3.4");
    const [url, init] = fn.mock.calls[0];
    expect(url).toContain("challenges.cloudflare.com");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toMatchObject({ secret: "secret", response: "tok", remoteip: "1.2.3.4" });
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npx vitest run tests/unit/turnstile.test.ts`
Expected: FAIL — cannot resolve `@/lib/turnstile`.

- [ ] **Step 4: Implement Turnstile**

`lib/turnstile.ts`:

```ts
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteip?: string
): Promise<boolean> {
  if (!token) return false;

  try {
    const res = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, ...(remoteip ? { remoteip } : {}) }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // Never let a captcha outage throw — the caller decides how to degrade.
    return false;
  }
}
```

- [ ] **Step 5: Implement email**

```bash
npm install resend
```

`lib/email.ts`:

```ts
import { Resend } from "resend";
import { SITE } from "@/content/site";
import { getService } from "@/content/services";
import type { QuoteInput } from "@/lib/validation";
import { formatKwacha } from "@/lib/format";

export interface EmailResult {
  notified: boolean;
  confirmed: boolean;
}

function leadSummary(input: QuoteInput, leadId: string): string {
  const service = getService(input.serviceSlug)?.name ?? input.serviceSlug;
  const rows: [string, string | undefined][] = [
    ["Name", input.name],
    ["Phone", input.phone],
    ["Email", input.email || undefined],
    ["Service", service],
    ["From", input.origin],
    ["To", input.destination],
    ["Preferred date", input.moveDate],
    ["Details", input.message],
    [
      "Estimate shown",
      input.estimateLow && input.estimateHigh
        ? `${formatKwacha(input.estimateLow)} – ${formatKwacha(input.estimateHigh)}`
        : undefined,
    ],
    ["Page", input.sourcePage],
    ["Lead ID", leadId],
  ];

  return rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
    .join("\n");
}

export async function sendLeadEmails(
  apiKey: string,
  notifyTo: string,
  input: QuoteInput,
  leadId: string
): Promise<EmailResult> {
  const resend = new Resend(apiKey);
  const service = getService(input.serviceSlug)?.name ?? input.serviceSlug;
  const result: EmailResult = { notified: false, confirmed: false };

  try {
    await resend.emails.send({
      from: `${SITE.name} <noreply@bastuku-inv.com>`,
      to: notifyTo,
      replyTo: input.email || undefined,
      subject: `New quote request — ${service} — ${input.name}`,
      html: `<h2>New quote request</h2>${leadSummary(input, leadId)}`,
    });
    result.notified = true;
  } catch {
    // Swallowed deliberately: the lead is already in D1. See route handler.
  }

  if (input.email) {
    try {
      await resend.emails.send({
        from: `${SITE.name} <noreply@bastuku-inv.com>`,
        to: input.email,
        subject: `We've got your request — ${SITE.name}`,
        html: `
          <p>Hi ${input.name},</p>
          <p>Thanks for getting in touch about <strong>${service}</strong>.
             We've received your request and will come back to you shortly.</p>
          <p>If it's urgent, WhatsApp us on ${SITE.phoneDisplay}.</p>
          <p>— The ${SITE.name} team</p>
        `,
      });
      result.confirmed = true;
    } catch {
      // Confirmation is a nicety; never fail the request over it.
    }
  }

  return result;
}
```

> `noreply@bastuku-inv.com` requires domain verification in Resend before it will deliver. Add to `CLAIMS.md` under client actions.

- [ ] **Step 6: Run to verify pass**

Run: `npx vitest run`
Expected: all suites pass.

- [ ] **Step 7: Commit**

```bash
git add lib/turnstile.ts lib/email.ts tests/unit/turnstile.test.ts .dev.vars.example .gitignore package.json package-lock.json
git commit -m "feat: add Turnstile verification and Resend lead emails"
```

---

### Task 11: `POST /api/quote`

The governing rule from the spec: **a user must never see a failure that loses their lead.**

**Files:**
- Create: `app/api/quote/route.ts`, `tests/unit/quote-route.test.ts`

**Interfaces:**
- Consumes: `quoteSchema`, `insertLead`, `sendLeadEmails`, `verifyTurnstile`, `buildWhatsAppUrl`.
- Produces: JSON `{ok: true, leadId}` on success; `{ok: false, error, whatsappUrl?}` on failure.

- [ ] **Step 1: Write the failing test**

`tests/unit/quote-route.test.ts` — mocks the four collaborators so every failure branch is exercised:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: vi.fn() }));
vi.mock("@/lib/leads", () => ({ insertLead: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendLeadEmails: vi.fn() }));
vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => ({
    env: {
      DB: {},
      TURNSTILE_SECRET_KEY: "s",
      RESEND_API_KEY: "r",
      LEAD_NOTIFY_EMAIL: "info@bastuku.com",
    },
  }),
}));

import { POST } from "@/app/api/quote/route";
import { verifyTurnstile } from "@/lib/turnstile";
import { insertLead } from "@/lib/leads";
import { sendLeadEmails } from "@/lib/email";

const body = {
  name: "John Banda",
  phone: "+260962936172",
  serviceSlug: "house-removals",
  turnstileToken: "tok",
};

const req = (b: unknown) =>
  new Request("https://bastuku-inv.com/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(b),
  });

beforeEach(() => {
  vi.mocked(verifyTurnstile).mockResolvedValue(true);
  vi.mocked(insertLead).mockResolvedValue("lead-123");
  vi.mocked(sendLeadEmails).mockResolvedValue({ notified: true, confirmed: true });
});

describe("POST /api/quote", () => {
  it("stores the lead and returns its id on the happy path", async () => {
    const res = await POST(req(body));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ ok: true, leadId: "lead-123" });
  });

  it("rejects a failed Turnstile check with 403 and never touches the database", async () => {
    vi.mocked(verifyTurnstile).mockResolvedValue(false);
    const res = await POST(req(body));
    expect(res.status).toBe(403);
    expect(insertLead).not.toHaveBeenCalled();
  });

  it("returns 400 with field errors for invalid input", async () => {
    const res = await POST(req({ ...body, phone: "12345" }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { fieldErrors: Record<string, string[]> };
    expect(json.fieldErrors.phone).toBeTruthy();
  });

  it("still succeeds when the database write fails but email is sent", async () => {
    vi.mocked(insertLead).mockRejectedValue(new Error("D1 down"));
    const res = await POST(req(body));
    expect(res.status).toBe(200);
    expect(sendLeadEmails).toHaveBeenCalled();
  });

  it("still succeeds when email fails but the lead was stored", async () => {
    vi.mocked(sendLeadEmails).mockResolvedValue({ notified: false, confirmed: false });
    const res = await POST(req(body));
    expect(res.status).toBe(200);
  });

  it("returns a prefilled WhatsApp URL when both storage and email fail", async () => {
    vi.mocked(insertLead).mockRejectedValue(new Error("D1 down"));
    vi.mocked(sendLeadEmails).mockResolvedValue({ notified: false, confirmed: false });
    const res = await POST(req(body));
    expect(res.status).toBe(503);
    const json = (await res.json()) as { whatsappUrl: string };
    expect(json.whatsappUrl).toContain("wa.me/260962936172");
    expect(decodeURIComponent(json.whatsappUrl)).toContain("John Banda");
  });

  it("returns 400 for a malformed JSON body", async () => {
    const res = await POST(
      new Request("https://bastuku-inv.com/api/quote", { method: "POST", body: "not json" })
    );
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/quote-route.test.ts`
Expected: FAIL — cannot resolve `@/app/api/quote/route`.

- [ ] **Step 3: Implement**

`app/api/quote/route.ts`:

```ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { quoteSchema } from "@/lib/validation";
import { insertLead } from "@/lib/leads";
import { sendLeadEmails } from "@/lib/email";
import { verifyTurnstile } from "@/lib/turnstile";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getService } from "@/content/services";

export async function POST(request: Request): Promise<Response> {
  const { env } = getCloudflareContext();

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Malformed request" }, { status: 400 });
  }

  const { turnstileToken, ...fields } = (raw ?? {}) as Record<string, unknown>;

  const ok = await verifyTurnstile(
    typeof turnstileToken === "string" ? turnstileToken : "",
    env.TURNSTILE_SECRET_KEY,
    request.headers.get("CF-Connecting-IP") ?? undefined
  );
  if (!ok) {
    return Response.json(
      { ok: false, error: "Verification failed. Please try again." },
      { status: 403 }
    );
  }

  const parsed = quoteSchema.safeParse(fields);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Please check the form", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // Store and notify independently — neither failure may discard the lead.
  let leadId: string | null = null;
  try {
    leadId = await insertLead(env.DB, input);
  } catch (err) {
    console.error("D1 insert failed", err);
  }

  const emails = await sendLeadEmails(
    env.RESEND_API_KEY,
    env.LEAD_NOTIFY_EMAIL,
    input,
    leadId ?? "unstored"
  );

  // Both paths dead: hand the user their own data back as a WhatsApp message.
  if (!leadId && !emails.notified) {
    console.error("Lead capture fully failed", { name: input.name, phone: input.phone });
    return Response.json(
      {
        ok: false,
        error: "We couldn't submit that. Message us on WhatsApp and we'll pick it up right away.",
        whatsappUrl: buildWhatsAppUrl({
          name: input.name,
          service: getService(input.serviceSlug)?.name,
          origin: input.origin,
          destination: input.destination,
          message: input.message,
        }),
      },
      { status: 503 }
    );
  }

  return Response.json({ ok: true, leadId });
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/unit/quote-route.test.ts`
Expected: 7 passed.

- [ ] **Step 5: Add the env type declarations**

`cloudflare-env.d.ts`:

```ts
declare global {
  interface CloudflareEnv {
    DB: D1Database;
    TURNSTILE_SECRET_KEY: string;
    RESEND_API_KEY: string;
    LEAD_NOTIFY_EMAIL: string;
  }
}
export {};
```

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add app/api/quote/route.ts tests/unit/quote-route.test.ts cloudflare-env.d.ts
git commit -m "feat: add quote API with lead-preserving failure fallbacks"
```

---

# Phase 4 — Shared Chrome

### Task 12: Header and mobile nav

The concept hides nav links below 900px with no replacement. This task fixes that.

**Files:**
- Create: `components/layout/Header.tsx`, `components/layout/MobileNav.tsx`, `content/nav.ts`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `<Header />`, `NAV_LINKS`.

- [ ] **Step 1: Nav content**

`content/nav.ts`:

```ts
export const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/coverage", label: "Coverage" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/for-business", label: "For Business" },
  { href: "/about", label: "About" },
] as const;
```

- [ ] **Step 2: Header**

`components/layout/Header.tsx`:

```tsx
import Link from "next/link";
import { NAV_LINKS } from "@/content/nav";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md">
      <div className="bg-ink px-4 py-2.5 text-center font-mono text-xs uppercase tracking-wider text-amber-bright">
        Booking spots filling for month-end moves — reserve yours early
      </div>
      <div className="flex items-center justify-between px-[5vw] py-4">
        <Link href="/" className="font-display text-2xl font-black uppercase text-ink">
          Bastuku<span className="text-brick">.</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-body text-sm font-semibold text-ink-soft hover:text-brick"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={buildWhatsAppUrl({})}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-pill bg-card-tint px-5 py-2.5 font-body text-sm font-bold text-ink hover:bg-card-tint/70"
          >
            WhatsApp Us
          </a>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Mobile nav**

`components/layout/MobileNav.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/content/nav";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="rounded-pill bg-card-tint px-4 py-2.5 font-body text-sm font-bold text-ink"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="absolute left-0 right-0 top-full flex flex-col gap-1 bg-paper px-[5vw] py-4 shadow-lg"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-b border-ink/10 py-3 font-body text-base font-semibold text-ink"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={buildWhatsAppUrl({})}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 rounded-pill bg-amber px-5 py-3 text-center font-body text-sm font-bold text-ink"
          >
            WhatsApp Us
          </a>
        </nav>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run dev`
Expected: at ≥1024px the horizontal nav shows and the Menu button is hidden. Below 1024px the reverse. Open the menu, press Escape — it closes. Click a link — it navigates and closes.

- [ ] **Step 5: Commit**

```bash
git add components/layout content/nav.ts app/layout.tsx
git commit -m "feat: add header with working mobile navigation"
```

---

### Task 13: Footer

Replaces the old footer's dead `#contact` social links with either real URLs or nothing.

**Files:**
- Create: `components/layout/Footer.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Implement**

`components/layout/Footer.tsx`:

```tsx
import Link from "next/link";
import { SITE } from "@/content/site";
import { SERVICES } from "@/content/services";
import { NAV_LINKS } from "@/content/nav";

export function Footer() {
  return (
    <footer className="bg-ink px-[6vw] py-16 text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-black uppercase">
            Bastuku<span className="text-brick">.</span>
          </p>
          <p className="mt-4 font-body text-sm leading-relaxed text-paper/65">
            Logistics and supply solutions in {SITE.city}, {SITE.country}, since {SITE.foundedYear}.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-mono text-xs uppercase tracking-wider text-amber-bright">Company</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-body text-sm text-paper/65 hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <h2 className="font-mono text-xs uppercase tracking-wider text-amber-bright">Services</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="font-body text-sm text-paper/65 hover:text-paper"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-amber-bright">Contact</h2>
          <ul className="mt-4 flex flex-col gap-2 font-body text-sm text-paper/65">
            <li>{SITE.city}, {SITE.country}</li>
            <li>
              <a href={`tel:${SITE.phoneE164}`} className="hover:text-paper">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-paper">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-paper/15 pt-8 text-center font-body text-sm text-paper/50">
        © {SITE.foundedYear}–{new Date().getFullYear()} {SITE.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
```

No social icons until real profile URLs exist. `CLAIMS.md` already tracks this.

- [ ] **Step 2: Wire both into the layout**

In `app/layout.tsx`, wrap `{children}` with `<Header />` and `<Footer />`.

- [ ] **Step 3: Verify**

Run: `npm run dev`
Expected: footer renders on every page, all six service links resolve, no `href="#"` anywhere. Confirm with:

```bash
grep -rn 'href="#"' app components && echo "FOUND DEAD LINKS" || echo "clean"
```

Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Footer.tsx app/layout.tsx
git commit -m "feat: add footer with real links only"
```

---

# Phase 5 — Sections

### Task 14: Hero and EstimateWidget

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/EstimateWidget.tsx`, `components/art/HeroArt.tsx`

**Interfaces:**
- Consumes: `calculateEstimate`, `formatKwacha`, `SERVICES`.
- Produces: `<Hero />`, `<EstimateWidget />`.

- [ ] **Step 1: Port the hero SVG**

Copy the `<svg>` from `legacy/bastuku-full-flow.html:294-331` into `components/art/HeroArt.tsx` as a server component. Convert attributes to JSX casing (`stroke-width` → `strokeWidth`, `stop-color` → `stopColor`, `preserveAspectRatio` unchanged) and add `aria-hidden="true"` plus `role="presentation"` — it is decoration, not content.

- [ ] **Step 2: EstimateWidget**

`components/sections/EstimateWidget.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calculateEstimate, type Volume } from "@/lib/estimate";
import { formatKwacha } from "@/lib/format";
import { SERVICES } from "@/content/services";
import { RATES_ARE_PLACEHOLDER } from "@/content/rates";
import { Button } from "@/components/ui/Button";

export function EstimateWidget() {
  const router = useRouter();
  const [serviceSlug, setServiceSlug] = useState(SERVICES[0].slug);
  const [distanceKm, setDistanceKm] = useState(15);
  const [volume, setVolume] = useState<Volume>("medium");

  const range = calculateEstimate({ serviceSlug, distanceKm, volume });

  function goToQuote() {
    const params = new URLSearchParams({
      service: serviceSlug,
      low: String(range.low),
      high: String(range.high),
    });
    router.push(`/quote?${params}`);
  }

  return (
    <div className="max-w-xl rounded-2xl bg-paper/80 p-6 backdrop-blur-sm">
      <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft">
        Get an instant estimate
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="est-service" className="font-body text-sm font-semibold">
            What are you moving?
          </label>
          <select
            id="est-service"
            value={serviceSlug}
            onChange={(e) => setServiceSlug(e.target.value as typeof serviceSlug)}
            className="rounded-pill border-[1.5px] border-ink/15 bg-white px-4 py-3 font-body text-sm"
          >
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="est-distance" className="font-body text-sm font-semibold">
            Distance: {distanceKm} km
          </label>
          <input
            id="est-distance"
            type="range"
            min={0}
            max={500}
            step={5}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="accent-amber"
          />
        </div>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="font-body text-sm font-semibold">How much?</legend>
          <div className="mt-1 flex gap-2">
            {(["small", "medium", "large"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={volume === v}
                onClick={() => setVolume(v)}
                className={`rounded-pill px-4 py-2 font-body text-sm font-bold capitalize ${
                  volume === v ? "bg-ink text-amber-bright" : "bg-card-tint text-ink"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <p aria-live="polite" className="mt-5 font-display text-4xl font-black text-ink">
        {formatKwacha(range.low)} – {formatKwacha(range.high)}
      </p>
      <p className="mt-1 font-body text-xs text-ink-soft/70">
        Indicative range. Your final quote is confirmed by our team.
        {RATES_ARE_PLACEHOLDER && " Pricing shown is provisional."}
      </p>

      <Button className="mt-4 w-full" onClick={goToQuote}>
        Continue to Quote
      </Button>
    </div>
  );
}
```

`aria-live="polite"` matters — without it, screen reader users get no feedback when the numbers change.

- [ ] **Step 3: Hero**

`components/sections/Hero.tsx` — port the headline and layout from `legacy/bastuku-full-flow.html:334-341`, using `<HeroArt />` behind and `<EstimateWidget />` in place of the concept's dead text input. Headline: "We'll carry the load. You carry on." with `the load.` in `text-brick`.

- [ ] **Step 4: Verify**

Render `<Hero />` on `app/page.tsx`. Run `npm run dev`.
Expected: changing service, distance, or volume updates the range immediately. "Continue to Quote" navigates to `/quote?service=…&low=…&high=…`.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx components/sections/EstimateWidget.tsx components/art/HeroArt.tsx app/page.tsx
git commit -m "feat: add hero with working estimate widget"
```

---

### Task 15: ServicePicker — coverflow with the a11y defects fixed

The concept's version binds `keydown` to `window`, hijacking arrow keys across the entire page, and its tiles are unreachable by keyboard.

**Files:**
- Create: `components/sections/ServicePicker.tsx`, `tests/e2e/service-picker.spec.ts`

- [ ] **Step 1: Implement with scoped keyboard handling**

`components/sections/ServicePicker.tsx`:

```tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { SERVICES } from "@/content/services";

export function ServicePicker() {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const clamp = (i: number) => Math.max(0, Math.min(SERVICES.length - 1, i));

  // Scoped to the stage — NOT window. The concept's bug was binding globally.
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((i) => clamp(i + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((i) => clamp(i - 1));
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div
        ref={stageRef}
        role="tablist"
        aria-label="Our services"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative flex h-[460px] w-full items-center justify-center [perspective:1400px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
      >
        {SERVICES.map((s, i) => {
          const offset = i - active;
          const abs = Math.abs(offset);
          const dir = Math.sign(offset);
          const isActive = abs === 0;

          const style = isActive
            ? { transform: "none", opacity: 1, zIndex: 50 }
            : {
                transform: `translateX(${dir * (150 + (abs - 1) * 90)}px) translateZ(${
                  -160 - (abs - 1) * 60
                }px) rotateY(${dir * -42}deg) scale(${0.82 - (abs - 1) * 0.08})`,
                opacity: abs > 2 ? 0 : 1 - abs * 0.28,
                zIndex: 50 - abs,
              };

          return (
            <div
              key={s.slug}
              role="tab"
              id={`svc-tab-${s.slug}`}
              aria-selected={isActive}
              // Only the active tile is in the tab order — roving tabindex.
              tabIndex={isActive ? 0 : -1}
              aria-hidden={abs > 2}
              onClick={() => setActive(i)}
              style={style}
              className="absolute flex h-[400px] w-[300px] flex-col rounded-2xl bg-paper p-7 text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none"
            >
              <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-xl bg-card-tint text-2xl">
                <span aria-hidden="true">{s.icon}</span>
              </div>
              <h3 className="mb-3 font-display text-2xl font-extrabold uppercase leading-none">
                {s.name}
              </h3>
              <p className="flex-1 font-body text-sm leading-relaxed text-ink-soft/85">
                {s.summary}
              </p>
              {isActive && (
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-4 rounded-pill bg-ink px-5 py-3 text-center font-body text-sm font-bold text-amber-bright"
                >
                  {s.cta} →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-2.5">
        {SERVICES.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            aria-label={`Show ${s.name}`}
            aria-controls={`svc-tab-${s.slug}`}
            onClick={() => setActive(i)}
            className={`h-2.5 w-2.5 rounded-full transition-transform ${
              i === active ? "scale-125 bg-amber-bright" : "bg-paper/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

Three fixes versus the concept: keyboard handling scoped to the stage, roving `tabIndex` so exactly one tile is tabbable, and `motion-reduce:transition-none` on the animation.

- [ ] **Step 2: Write the E2E test**

`tests/e2e/service-picker.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("arrow keys move the coverflow only when it has focus", async ({ page }) => {
  await page.goto("/");
  const stage = page.getByRole("tablist", { name: "Our services" });
  await stage.scrollIntoViewIfNeeded();

  const first = page.getByRole("tab").first();
  await expect(first).toHaveAttribute("aria-selected", "true");

  await stage.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true");
});

test("arrow keys do not hijack the page when the coverflow is not focused", async ({ page }) => {
  await page.goto("/");
  await page.locator("body").click({ position: { x: 5, y: 5 } });
  const before = await page.evaluate(() => window.scrollY);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(before);
});

test("only the active tile is reachable by Tab", async ({ page }) => {
  await page.goto("/");
  const tabbable = page.locator('[role="tab"][tabindex="0"]');
  await expect(tabbable).toHaveCount(1);
});
```

- [ ] **Step 3: Install Playwright and run**

```bash
npm install -D @playwright/test && npx playwright install chromium
npx playwright test tests/e2e/service-picker.spec.ts
```

Expected: 3 passed.

- [ ] **Step 4: Commit**

```bash
git add components/sections/ServicePicker.tsx tests/e2e playwright.config.ts package.json package-lock.json
git commit -m "feat: add accessible service coverflow"
```

---

### Task 16: CoverageTiers

**Files:**
- Create: `components/sections/CoverageTiers.tsx`

- [ ] **Step 1: Implement**

`components/sections/CoverageTiers.tsx` — client component. Port the tier pills from `legacy/bastuku-full-flow.html:447-452`, replacing the concept's `innerHTML` swap with React state over `COVERAGE_TIERS`.

```tsx
"use client";

import { useState } from "react";
import { COVERAGE_TIERS } from "@/content/coverage";

export function CoverageTiers() {
  const [activeId, setActiveId] = useState(COVERAGE_TIERS[0].id);
  const active = COVERAGE_TIERS.find((t) => t.id === activeId)!;

  return (
    <div>
      <div role="tablist" aria-label="Coverage areas" className="flex flex-wrap gap-3">
        {COVERAGE_TIERS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === activeId}
            aria-controls="coverage-detail"
            onClick={() => setActiveId(t.id)}
            className={`rounded-pill px-6 py-3.5 font-body text-sm font-bold uppercase transition-colors ${
              t.id === activeId ? "bg-ink text-amber-bright" : "bg-card-tint text-ink hover:bg-card-tint/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="coverage-detail" role="tabpanel" aria-live="polite" className="mt-6">
        <h3 className="font-display text-2xl font-extrabold uppercase">{active.headline}</h3>
        <p className="mt-2 font-body text-base text-ink-soft">{active.detail}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {active.areas.map((a) => (
            <li key={a} className="rounded-pill bg-card-tint px-4 py-2 font-body text-sm">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

Using `innerHTML` as the concept does is both an XSS surface and unannounced to assistive tech; React state plus `aria-live` fixes both.

- [ ] **Step 2: Verify**

Run: `npm run dev`. Click each tier — headline, detail, and area list all update, and the selected pill is visually and programmatically marked.

- [ ] **Step 3: Commit**

```bash
git add components/sections/CoverageTiers.tsx
git commit -m "feat: add coverage tier selector"
```

---

### Task 17: Timeline and TrustStrip

**Files:**
- Create: `components/sections/Timeline.tsx`, `components/sections/TrustStrip.tsx`, `content/steps.ts`

- [ ] **Step 1: Steps content**

`content/steps.ts`:

```ts
export interface Step {
  title: string;
  paragraphs: string[];
}

export const STEPS: Step[] = [
  {
    title: "Request",
    paragraphs: [
      "Tell us what you're moving and where — house, office, or cross-border — and get an indicative estimate right on the site, no waiting required.",
      "Once you're happy with the range, confirm your date and we lock in your slot.",
    ],
  },
  {
    title: "Pack & Move",
    paragraphs: [
      "Our team arrives on schedule to pack, load, and transport your belongings. You'll have a direct contact for the whole move — no chasing updates.",
      "Need something adjusted on the day? Tell your move lead and they'll sort it on the spot.",
    ],
  },
  {
    title: "Unpack & Confirm",
    paragraphs: [
      "We place everything where you want it and do a walkthrough together before we leave — so you can confirm everything arrived in the shape it left in.",
      "Payment is finalised once you're satisfied.",
    ],
  },
];
```

The concept's "No surprises at the end" is dropped as an unverifiable promise; the payment line is retained but tracked as `CLAIMS.md` #9.

- [ ] **Step 2: Timeline**

`components/sections/Timeline.tsx` — server component, semantic `<ol>`. Port the marker and rail styling from `legacy/bastuku-full-flow.html:252-267`. The concept uses `<div>`s; an ordered list is what this content actually is.

- [ ] **Step 3: TrustStrip**

`components/sections/TrustStrip.tsx` — the four-stat band from `legacy/bastuku-full-flow.html:355-360`.

> Use **only** `2017` (founding year) and `Lusaka+` (coverage). Omit the move count until `CLAIMS.md` #3 is resolved, and omit "24/7 WhatsApp support" until #2 is verified. Render whatever stats are verified rather than leaving placeholders — a two-stat strip that is true beats a four-stat strip that is not.

- [ ] **Step 4: Verify**

Run: `npm run dev`. Timeline renders as an ordered list; TrustStrip shows only verified stats.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Timeline.tsx components/sections/TrustStrip.tsx content/steps.ts
git commit -m "feat: add how-it-works timeline and trust strip"
```

---

### Task 18: QuoteForm

**Files:**
- Create: `components/sections/QuoteForm.tsx`, `tests/e2e/quote-form.spec.ts`

**Interfaces:**
- Consumes: `POST /api/quote`, `quoteSchema`, `buildWhatsAppUrl`, `SERVICES`.

- [ ] **Step 1: Implement**

`components/sections/QuoteForm.tsx` — client component. Requirements, all of which are tested in Step 2:

1. Reads `?service`, `?low`, `?high` from the URL via `useSearchParams` and prefills, so the estimate carries into the form.
2. Renders the Turnstile widget via `next/script` with `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
3. Validates with `quoteSchema` on submit; renders per-field errors through `<Field error>`, each wired with `aria-describedby` and `aria-invalid`.
4. Posts JSON to `/api/quote` with the Turnstile token.
5. On `ok: true` — replaces the form with a success panel. Does not reset and re-enable after a timeout the way `legacy/js/script.js:310` did, which made users think it had not sent.
6. On `503` with `whatsappUrl` — renders a prominent WhatsApp button using that URL, so the user's typed data is never lost.
7. Disables the submit button while in flight and sets `aria-busy`.
8. Always renders a secondary "Or WhatsApp us" link built from the current form state.

- [ ] **Step 2: Write the E2E test**

`tests/e2e/quote-form.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("prefills the service from the estimate widget", async ({ page }) => {
  await page.goto("/quote?service=office-relocation&low=1200&high=1800");
  await expect(page.getByLabel(/service/i)).toHaveValue("office-relocation");
});

test("shows a field error for an invalid phone number", async ({ page }) => {
  await page.goto("/quote");
  await page.getByLabel(/full name/i).fill("John Banda");
  await page.getByLabel(/phone/i).fill("12345");
  await page.getByRole("button", { name: /get my quote/i }).click();
  await expect(page.getByRole("alert")).toContainText(/valid Zambian mobile/i);
});

test("submits successfully and shows confirmation", async ({ page }) => {
  await page.route("**/api/quote", (r) =>
    r.fulfill({ status: 200, json: { ok: true, leadId: "lead-123" } })
  );
  await page.goto("/quote");
  await page.getByLabel(/full name/i).fill("John Banda");
  await page.getByLabel(/phone/i).fill("0962936172");
  await page.getByRole("button", { name: /get my quote/i }).click();
  await expect(page.getByText(/we've got your request/i)).toBeVisible();
});

test("offers a prefilled WhatsApp fallback when the server fails", async ({ page }) => {
  await page.route("**/api/quote", (r) =>
    r.fulfill({
      status: 503,
      json: {
        ok: false,
        error: "We couldn't submit that.",
        whatsappUrl: "https://wa.me/260962936172?text=Hi%20Bastuku",
      },
    })
  );
  await page.goto("/quote");
  await page.getByLabel(/full name/i).fill("John Banda");
  await page.getByLabel(/phone/i).fill("0962936172");
  await page.getByRole("button", { name: /get my quote/i }).click();

  const fallback = page.getByRole("link", { name: /whatsapp/i });
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveAttribute("href", /wa\.me\/260962936172/);
});
```

- [ ] **Step 3: Run**

Run: `npx playwright test tests/e2e/quote-form.spec.ts`
Expected: 4 passed.

- [ ] **Step 4: Commit**

```bash
git add components/sections/QuoteForm.tsx tests/e2e/quote-form.spec.ts
git commit -m "feat: add quote form with WhatsApp failure fallback"
```

---

# Phase 6 — Pages

### Task 19: Home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Compose**

Order: `<Hero />` → four CTA cards (Book / Quote / For Business / WhatsApp, from `legacy/bastuku-full-flow.html:343-348`) → `<TrustStrip />` → `<ServicePicker />` (tone `ink`) → `<CoverageTiers />` → `<Timeline />` (condensed, linking to `/how-it-works`) → closing CTA.

Each CTA card links to a real route: `/quote`, `/quote`, `/for-business`, and `buildWhatsAppUrl({})`.

- [ ] **Step 2: Verify**

Run: `npm run dev`. Every CTA navigates somewhere real. Confirm no dead links:

```bash
grep -rn 'href="#"' app components && echo "FOUND" || echo "clean"
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: build home page"
```

---

### Task 20: Services hub and the six service pages

**Files:**
- Create: `app/services/page.tsx`, `app/services/[slug]/page.tsx`

- [ ] **Step 1: Hub**

`app/services/page.tsx` — a static grid of all six from `SERVICES`, each card linking to its page. No coverflow here; a hub page should be scannable and crawlable.

- [ ] **Step 2: Service template**

`app/services/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES, getService } from "@/content/services";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.name} in Lusaka | Bastuku Investments`,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <Section>
        <p className="font-mono text-xs uppercase tracking-wider text-route">Services</p>
        <h1 className="mt-3 max-w-[14ch] font-display text-5xl font-black uppercase leading-none">
          {service.heading}
        </h1>
        {service.body.map((p) => (
          <p key={p} className="mt-5 max-w-[52ch] font-body text-lg leading-relaxed text-ink-soft">
            {p}
          </p>
        ))}
        <ButtonLink href={`/quote?service=${service.slug}`} className="mt-8">
          {service.cta} →
        </ButtonLink>
      </Section>

      <Section tone="ink">
        <h2 className="font-display text-3xl font-black uppercase">What's included</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {service.includes.map((item) => (
            <li key={item} className="flex gap-3 font-body text-base text-paper/75">
              <span aria-hidden="true" className="text-amber-bright">—</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
```

`generateStaticParams` prerenders all six at build time — no runtime cost.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build output lists all six `/services/*` routes as static (`●` or `○`), not dynamic (`ƒ`).

Then visit each of the six in `npm run dev`, and confirm `/services/nonsense` returns 404.

- [ ] **Step 4: Commit**

```bash
git add app/services
git commit -m "feat: add services hub and six service pages"
```

---

### Task 21: Remaining pages

**Files:**
- Create: `app/coverage/page.tsx`, `app/how-it-works/page.tsx`, `app/for-business/page.tsx`, `app/about/page.tsx`, `app/quote/page.tsx`, `app/contact/page.tsx`

- [ ] **Step 1: Build each**

| Page | Contents |
|---|---|
| `/coverage` | `<CoverageTiers />` full-width, all three tiers expanded, closing CTA |
| `/how-it-works` | `<Timeline />` full version, `FAQS` accordion, CTA |
| `/for-business` | B2B copy — recurring logistics, office relocation, exports/imports; contact-led CTA rather than the estimate tool |
| `/about` | Founded 2017, mission, vision, founder photo (Task 23), values |
| `/quote` | `<QuoteForm />` wrapped in `<Suspense>` — it reads `useSearchParams` and will fail the build without a boundary |
| `/contact` | Phone, WhatsApp, email, city, and a short form; no map until a real address exists |

`/quote` must be:

```tsx
import { Suspense } from "react";
import { QuoteForm } from "@/components/sections/QuoteForm";

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="min-h-[600px]" />}>
      <QuoteForm />
    </Suspense>
  );
}
```

- [ ] **Step 2: Verify all 14 routes**

Run: `npm run build`
Expected: build output lists exactly 14 page routes plus `/api/quote`. Count them against the spec's route list — a missing route here becomes a 404 in production.

- [ ] **Step 3: Commit**

```bash
git add app/coverage app/how-it-works app/for-business app/about app/quote app/contact
git commit -m "feat: add remaining six pages"
```

---

# Phase 7 — Launch Readiness

### Task 22: Images

The 27 MB problem. `Founder.png` alone is 8.8 MB.

**Files:**
- Create: `public/images/` (optimised assets)
- Modify: `next.config.ts`, `app/about/page.tsx`, `app/how-it-works/page.tsx`

- [ ] **Step 1: Audit what exists**

```bash
ls -la images/
```

Expected: `Founder.png` 8.8 MB, `hero-bg.png` 8.6 MB, `Gemini_*.png` 8.0 MB, `BASTUKU-LOGO1.png` 1.1 MB, two ~400 KB JPEGs.

- [ ] **Step 2: Keep only what's used**

Illustration-led means most of these are now unused. Retain and optimise:

- `Founder.png` → `/about`
- `IMG-20230813-WA0025.jpg` → `/how-it-works` team photo
- `BASTUKU-LOGO1.png` → favicon and OG image only

Discard `hero-bg.png` and `Gemini_*.png` — the hero is now SVG.

- [ ] **Step 3: Optimise**

```bash
mkdir -p public/images
npx sharp-cli -i images/Founder.png -o public/images/founder.webp resize 1200 --withoutEnlargement -f webp -q 82
npx sharp-cli -i images/IMG-20230813-WA0025.jpg -o public/images/team.webp resize 1400 --withoutEnlargement -f webp -q 82
npx sharp-cli -i images/BASTUKU-LOGO1.png -o public/icon.png resize 512 -f png
npx sharp-cli -i images/BASTUKU-LOGO1.png -o public/apple-icon.png resize 180 -f png
```

Then verify every output is under the 200 KB budget:

```bash
find public -type f \( -name '*.webp' -o -name '*.png' \) -size +200k -exec ls -la {} \;
```

Expected: **no output.** Any file listed must be re-compressed before proceeding.

- [ ] **Step 4: Use `next/image`**

```tsx
import Image from "next/image";

<Image
  src="/images/founder.webp"
  alt="The founder of Bastuku Investments"
  width={1200}
  height={900}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="rounded-2xl object-cover"
/>
```

Explicit `width`/`height` prevent layout shift; `sizes` stops mobile downloading the desktop asset.

- [ ] **Step 5: Remove the old directory**

```bash
git rm -r images/
```

- [ ] **Step 6: Verify**

Run: `npm run build`, then check the total payload:

```bash
du -sh public/
```

Expected: well under 1 MB, versus 27 MB before.

- [ ] **Step 7: Commit**

```bash
git add public next.config.ts app
git commit -m "perf: replace 27MB image directory with optimised WebP assets"
```

---

### Task 23: SEO — metadata, JSON-LD, sitemap, robots

**Files:**
- Create: `components/seo/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx` and each page

- [ ] **Step 1: Root metadata**

In `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Bastuku Investments | Movers & Logistics in Lusaka, Zambia",
    template: "%s | Bastuku Investments",
  },
  description:
    "House removals, office relocation, cross-border moves, and freight across Zambia. Trusted logistics in Lusaka since 2017.",
  openGraph: {
    type: "website",
    locale: "en_ZM",
    siteName: SITE.name,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};
```

- [ ] **Step 2: JSON-LD**

`components/seo/JsonLd.tsx`:

```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Emit `LocalBusiness` (via `MovingCompany`) in the root layout:

```ts
{
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  name: SITE.legalName,
  url: SITE.url,
  telephone: SITE.phoneE164,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressCountry: "ZM",
  },
  foundingDate: "2017-05",
  areaServed: COVERAGE_TIERS.flatMap((t) => t.areas),
}
```

Add `Service` schema on each service page and `FAQPage` on `/how-it-works`.

> `streetAddress` is missing — "Lusaka, Zambia" is too vague to rank locally. Tracked in `CLAIMS.md` under client actions.

- [ ] **Step 3: Sitemap and robots**

`app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { SERVICES } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/coverage",
    "/how-it-works",
    "/for-business",
    "/about",
    "/quote",
    "/contact",
    ...SERVICES.map((s) => `/services/${s.slug}`),
  ];

  return routes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
```

`app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Verify**

Run: `npm run build && npm run preview`, then:

```bash
curl -s localhost:8788/sitemap.xml | grep -c "<url>"
```

Expected: `14`.

```bash
curl -s localhost:8788/robots.txt
```

Expected: contains `Sitemap: https://bastuku-inv.com/sitemap.xml`.

Validate the JSON-LD by pasting the rendered page source into Google's Rich Results Test.

- [ ] **Step 5: Commit**

```bash
git add components/seo app/sitemap.ts app/robots.ts app
git commit -m "feat: add metadata, JSON-LD, sitemap, and robots"
```

---

### Task 24: Lighthouse CI budgets

Makes the 27 MB regression structurally impossible rather than a matter of memory.

**Files:**
- Create: `lighthouserc.json`, `.github/workflows/ci.yml`

- [ ] **Step 1: Configure budgets**

`lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start",
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/services/house-removals",
        "http://localhost:3000/quote"
      ],
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 1 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "resource-summary:image:size": ["error", { "maxNumericValue": 600000 }],
        "resource-summary:total:size": ["error", { "maxNumericValue": 1500000 }],
        "unused-javascript": "off"
      }
    }
  }
}
```

Accessibility is set to a hard `1`. Anything less and the build fails — that is the point.

- [ ] **Step 2: CI workflow**

`.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm test
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:e2e
      - run: npx @lhci/cli autorun
```

- [ ] **Step 3: Verify**

Run: `npm run build && npx @lhci/cli autorun`
Expected: all assertions pass. If accessibility is below 1, fix the reported violations before proceeding — do not lower the threshold.

- [ ] **Step 4: Commit**

```bash
git add lighthouserc.json .github/workflows/ci.yml
git commit -m "ci: add Lighthouse budgets and verification workflow"
```

---

### Task 25: Production secrets and staging verification

**Files:**
- Modify: `wrangler.jsonc`

- [ ] **Step 1: Apply the migration to production D1**

```bash
npx wrangler d1 migrations apply bastuku-leads --remote
```

- [ ] **Step 2: Set secrets**

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put LEAD_NOTIFY_EMAIL
```

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is public and goes in `wrangler.jsonc` under `vars`, not `secret put`.

- [ ] **Step 3: Verify Resend domain**

In the Resend dashboard, add `bastuku-inv.com` and publish the DKIM/SPF records. Until this is done, `noreply@bastuku-inv.com` will not deliver and every lead notification silently fails to the fallback path.

- [ ] **Step 4: Deploy and smoke-test end to end**

```bash
npm run deploy
```

On the `*.workers.dev` URL:

1. Submit a real quote request.
2. Confirm the notification email arrives.
3. Confirm the customer confirmation email arrives.
4. Confirm the row landed:

```bash
npx wrangler d1 execute bastuku-leads --remote \
  --command "SELECT id, created_at, name, service_slug, source_page FROM leads ORDER BY created_at DESC LIMIT 5"
```

Expected: your test submission is the first row.

- [ ] **Step 5: Delete the test rows**

```bash
npx wrangler d1 execute bastuku-leads --remote --command "DELETE FROM leads WHERE name = 'Test User'"
```

- [ ] **Step 6: Commit**

```bash
git add wrangler.jsonc
git commit -m "chore: configure production bindings"
```

---

### Task 26: Claims audit and DNS cutover

**The launch gate.** Do not proceed past Step 1 until `CLAIMS.md` is resolved.

**Files:**
- Modify: `CLAIMS.md`, `content/*`

- [ ] **Step 1: Work through `CLAIMS.md` with the client**

Every row must reach `VERIFIED` or be struck from the site. Highest priority:

1. **#10 rate card** — the estimate tool shows invented numbers until this is replaced.
2. **#6 contact email** — currently `info@bastuku.com` on a `bastuku-inv.com` site.
3. **#7 phone number** — every WhatsApp link on the site depends on it.
4. **#4/#5 coverage** — the site currently claims cities and countries nobody has confirmed.

- [ ] **Step 2: Apply corrections**

Update `content/site.ts`, `content/rates.ts`, `content/coverage.ts`. Strike anything unverified — a smaller true site beats a larger false one.

- [ ] **Step 3: Re-run everything**

```bash
npx tsc --noEmit && npm test && npm run build && npm run test:e2e && npx @lhci/cli autorun
```

Expected: all green.

- [ ] **Step 4: Cut over DNS**

1. Add `bastuku-inv.com` as a custom domain on the Worker in the Cloudflare dashboard.
2. Confirm the certificate is issued and active.
3. Load `https://bastuku-inv.com` and verify it serves the new site.
4. Submit one live quote request and confirm it lands in D1 and in the inbox.
5. Disable GitHub Pages in the old repo settings **only after** the above passes.

`CNAME` and `.nojekyll` at the repo root are GitHub Pages artifacts — remove them once the cutover is confirmed.

- [ ] **Step 5: Remove the legacy site**

```bash
git rm -r legacy/ CNAME .nojekyll
git commit -m "chore: remove legacy static site after cutover"
```

- [ ] **Step 6: Post-launch verification**

- Submit `https://bastuku-inv.com/sitemap.xml` in Google Search Console
- Confirm all 14 URLs resolve with 200
- Run Lighthouse against production
- Confirm WhatsApp links open the correct number from a real phone

- [ ] **Step 7: Final commit**

```bash
git commit --allow-empty -m "chore: launch bastuku-inv.com on Cloudflare Workers"
```

---

## Self-Review Notes

**Spec coverage** — every section of the design maps to at least one task: stack §3 → T1–2; component boundaries §4 → T3–18; data flow §5 → T9, T11; error handling §6 → T11 (all four rows tested); estimate §7 → T6, T14; defects §8 → T12 (mobile nav), T15 (coverflow a11y), T13 (dead links), T22 (images), T2 (fonts, reduced motion); testing §9 → T4–6, T9–11, T15, T18, T24; SEO §10 → T23; content §11 → T7–8, T26; risks §12 → T6 (rates), T26 (claims), T25 (staging).

**Known dependencies carried forward:**
- `content/rates.ts` ships with invented numbers until the client supplies a rate card (T6 → T26 #10)
- The contact email conflict is isolated to one constant in `content/site.ts` (T3 → T26 #2)
- Resend domain verification is required before any lead email delivers (T25 Step 3)
- Testimonials and a street address remain absent; both are tracked as client actions in `CLAIMS.md`
