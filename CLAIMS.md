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
| 6 | Contact email `info@bastuku-inv.com` (was `info@bastuku.com`) | `content/site.ts` | company Google account and 2026 invoices | ✅ VERIFIED |
| 7 | Phone `+260 976831400` | site-wide | client, 2026-08-15 | ✅ VERIFIED — supplied directly by the client as the live WhatsApp number, replacing the old `+260 962936172` |
| 8 | Trading since May 2017 | about, stats | old site | ❌ UNVERIFIED |
| 9 | ~~"Payment only finalized once you're satisfied"~~ | how-it-works | concept | ~~STRUCK~~ — replaced 2026-11; invoices require payment before the move. Now reads "Your payment terms are set out in your quote before anything moves." |
| 10 | All estimate figures | `content/rates.ts` | **invented placeholder** | ⏸️ NOT SHOWN — the hero calculator was replaced by a no-price scoping tool on 2026-08-15, so no invented figure reaches a customer. `lib/estimate.ts` is retained and tested but unwired until a real rate card lands. |
| 11 | Customs/permit handling capability | cross-border, and since 2026-11 the **service name and page heading** "Clearing, Forwarding & Freight" (`/services/clearing-forwarding-freight`, for-business, default site title and description) | concept; renamed per Phase 0 brief, 2026-11-22 | ❌ UNVERIFIED — licensed clearing agent? Licence number awaited from Mildred. The rename makes this the site's headline commercial claim, so it is now the highest-priority row |
| 12 | FAQ: "walkthrough together before we leave" | faqs | drafted | ❌ UNVERIFIED — is this standard practice? |
| 13 | FAQ: damage handling process | faqs | drafted | ❌ UNVERIFIED — what is the real policy/insurance position? |
| 14 | Coverage: Chipata, Solwezi, Olympia | coverage | drafted | ❌ UNVERIFIED |
| 15 | International Moves service — sea/air freight, export crating, destination agents | `/services/international-moves`, services hub, quote form | client request, 2026-08-15 | ❌ UNVERIFIED — client asked for the service to be listed, but the capability detail is drafted. Confirm which of sea freight, air freight, and destination-agent coordination are genuinely offered |
| 16 | Hero photograph shows a Bastuku job | home hero | `images/Gemini_Generated_Image_*.png` | ⚠️ CROPPED — the source frame carries another firm's livery (`kwexports.co.za`) and a generator watermark; both are cropped out and the image is duotoned. Confirm this depicts genuine Bastuku work, or replace with owned photography |
| 17 | Secondary call line `+260 967 022 254` (calls only; WhatsApp stays on #7) | footer, contact, JSON-LD | BASTUKU contact rule, Oct 2026 | ⚠️ CONFIRM — Brandon to confirm at review |
| 18 | Air cargo export from Kenneth Kaunda International Airport | `/services/clearing-forwarding-freight` (body and includes), for-business offer card | Phase 0 brief, 2026-11-22 | ⚠️ CONFIRM — supplied by Brandon in the brief; confirm it is a service BASTUKU arranges today, not a planned one |
| 19 | A firm quote, agreed before anything moves or is booked | homepage CTA card ("get a firm price") and closer, How it works step 1, pricing FAQ, About values; already in the hero scoper since 2026-08 ("We confirm the price with you before anything moves") | replaces the retired price-tool copy, 2026-11-23 | ⚠️ CONFIRM — the scoper already promised it; Brandon to confirm every job gets a fixed quote before booking, with no on-the-day re-pricing |

## Missing assets — client action

- [ ] Real rate card (blocks the estimate tool showing real numbers). Note the
      **pricing model** is an open question as well as the numbers: the current
      calculator prices every service as `(base + km × rate) × volume`, which
      does not fit services that are not distance-driven (packaging, general
      supplies) or that price by container/consignment (exports, international).
      Ask the client how each service is actually priced before rewiring it.
- [ ] Professional photography — the current hero is a cropped third-party-livery
      frame (see claim #16). Owned photography would retire that compromise.
- [ ] Testimonials — currently zero anywhere on the site
- [ ] Client logos, if any are permitted for use
- [ ] Professional photography (existing images are 8 MB phone exports)
- [ ] Physical address for `LocalBusiness` schema — "Lusaka, Zambia" is too vague to rank
- [ ] Business registration number, if it should appear in the footer
- [ ] Real social media profile URLs (current footer links are dead `#` anchors)
- [ ] Resend domain verification for `bastuku-inv.com` — lead emails send from
      `noreply@bastuku-inv.com` and will not deliver until the domain is verified
