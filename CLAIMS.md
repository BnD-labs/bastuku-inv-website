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
| 8 | Trading since May 2017 | about, stats, homepage facts row ("In business since 2017") | old site; PACRA certificate of incorporation (company profile 2026, Annex A) | ✅ VERIFIED — incorporated 19 May 2017, company no. 120170003932 |
| 9 | ~~"Payment only finalized once you're satisfied"~~ | how-it-works | concept | ~~STRUCK~~ — replaced 2026-11; invoices require payment before the move. Now reads "Your payment terms are set out in your quote before anything moves." |
| 10 | All estimate figures | `content/rates.ts` | **invented placeholder** | ⏸️ NOT SHOWN — the hero calculator was replaced by a no-price scoping tool on 2026-08-15, so no invented figure reaches a customer. `lib/estimate.ts` is retained and tested but unwired until a real rate card lands. |
| 11 | Customs/permit handling capability | cross-border, and since 2026-11 the **service name and page heading** "Clearing, Forwarding & Freight" (`/services/clearing-forwarding-freight`, for-business, default site title and description) | concept; renamed per Phase 0 brief, 2026-11-22 | ❌ NO LICENCE YET — Brandon, 2026-11-24: BASTUKU does not hold a clearing-agent licence; one is expected in 2027. Until then the site must not imply BASTUKU itself clears goods through customs as a licensed agent. The current copy ("Customs clearing", "We handle documentation, duty calculation, and clearance") needs rewording to what BASTUKU actually does today. Highest-priority row |
| 12 | FAQ: "walkthrough together before we leave" | faqs | drafted | ❌ UNVERIFIED — is this standard practice? |
| 13 | FAQ: damage handling process | faqs | drafted | ❌ UNVERIFIED — what is the real policy/insurance position? |
| 14 | Coverage: Chipata, Solwezi, Olympia | coverage | drafted | ❌ UNVERIFIED |
| 15 | International Moves service — sea/air freight, export crating, destination agents | `/services/international-moves`, services hub, quote form | client request, 2026-08-15; company profile 2026 (pp. 4, 6, 9) | ⚠️ PARTLY VERIFIED — **air freight and destination agents**: a completed job, the May 2026 door-to-door relocation from Shah Alam, Malaysia to Lusaka (origin packing, air freight, import clearing, delivery), handled with partner agent Santa Fe Relocation. **Sea freight**: only the profile states it, and the same profile promised daily tracking that does not exist, so a profile line alone is not proof. Confirm sea freight has actually been arranged. **Export crating**: see the crate photos under #20 |
| 16 | ~~Hero photograph shows a Bastuku job~~ | home hero | ~~`images/Gemini_Generated_Image_*.png`~~ | ~~RETIRED~~ 2026-11-24 — the old frame (the client's own photo, upscaled with an AI tool; another firm's livery and the tool's watermark cropped out) no longer ships. The hero is now `images/20260624_092641.jpg`, a residential pack-out photographed by the client; see #20 |
| 17 | Secondary call line `+260 977 778 844` (calls only; WhatsApp stays on #7) | footer, contact, JSON-LD | company profile 2026 and Brandon, 2026-11-24; replaced `+260 967 022 254` | ✅ VERIFIED |
| 18 | Air cargo export from Kenneth Kaunda International Airport | `/services/clearing-forwarding-freight` (body and includes), for-business offer card | Phase 0 brief, 2026-11-22; company profile 2026 (pp. 5, 8) | ✅ VERIFIED — the client's own photo (#20) of an export consignment being weighed and checked at the airport cargo terminal is a real job, and the profile lists time-critical air import and export through Kenneth Kaunda International. Arranging air cargo is not the same as clearing it, so the clearing wording is still #11 |
| 19 | A firm quote, agreed before anything moves or is booked | homepage CTA card ("get a firm price"), facts row ("Firm quote before anything moves") and closer, How it works step 1, pricing FAQ, About values; already in the hero scoper since 2026-08 ("We confirm the price with you before anything moves") | replaces the retired price-tool copy, 2026-11-23 | ⚠️ CONFIRM — the scoper already promised it; Brandon to confirm every job gets a fixed quote before booking, with no on-the-day re-pricing |
| 20 | Photographs and video show genuine BASTUKU jobs, and the people in them agree to appear | home hero (`20260624_092641.jpg`, a pack-out at a private home; faces visible); service pages: house-removals video (`20260624_110930.mp4`), office-relocation, international-moves, clearing-forwarding-freight (airport cargo terminal), packaging, general-supplies | client, November 2026; captions for the airport, crate and pack-out photos match the 2026 company profile | ✅ VERIFIED — Brandon, 2026-11-24: the clients are happy to appear on the site. Still worth confirming the office-relocation photo is from an office move |
| 21 | Registrations: PACRA (incorporated 19 May 2017, no. 120170003932); ZRA tax clearance, valid to 31 Dec 2026; ZPPA registered supplier since Jan 2019, citizen-owned; ZCILT corporate member for 2026. "Copies of each certificate are available on request" | `/for-business` ("On the record"), from `content/credentials.ts` | company profile 2026, Annexes A, B, C, E; Brandon asked for it, 2026-11-24 | ✅ VERIFIED — **ZRA and ZCILT lapse on 31 Dec 2026.** The page drops a lapsed one at build time and `tests/unit/credentials.test.ts` fails once a date passes; renew, then update the line and `validUntil` |
| 22 | Named clients and recent contracts: ZICTA (staff household relocation, Nov 2026) and ZCCM-IH (Lusaka to Kalulushi office relocation, Feb 2026), plus the profile's client list | `/for-business` ("Recent work", "Clients include") | company profile 2026; purchase orders in Annexes D and F | ✅ VERIFIED — Brandon, 2026-11-24: the clients are happy to appear. Private individuals (e.g. the Mauta family) are deliberately left out |
| 23 | Warehousing service: short-term holding, consolidation, and staging between packing and dispatch | `/services/warehousing`, services grid, quote form | company profile 2026 (p. 7); Brandon asked for it, 2026-11-24 | ✅ VERIFIED — the copy offers short-term holding only, as the profile does; it does not describe a facility or its security |
| 24 | General supplies: fresh and dry food in volume; safety wear, cleaning materials, office consumables; livestock including pigs and chickens | `/services/general-supplies`, for-business "Sourcing and supply" | company profile 2026 (p. 8); Brandon asked for it, 2026-11-24 | ✅ VERIFIED |
| 25 | Office: CHAZ Complex, Mission Drive, Plot No. 2882/B/510, Office Unit F3-1, Lusaka; P.O. Box 34511, Lusaka | footer, `/contact`, `MovingCompany` JSON-LD (`streetAddress`, `postOfficeBoxNumber`), from `content/site.ts` | company profile 2026, pp. 1, 2 and 13 (identical each time) | ✅ VERIFIED — no map embed or directions link yet: nobody has checked that a map service pins the right building. Claim the Google Business Profile at this address so search shows the same one |
| 26 | Month-end demand: "Booking spots filling for month-end moves — reserve yours early", and "Month-end fills up fastest" | site-wide banner (`components/layout/Header.tsx`); FAQ on booking notice (`content/faqs.ts`) | the 2026-08 rebuild plan; never checked | ⚠️ CONFIRM — the banner shows all month on every page, so it reads as a standing scarcity claim. Brandon to confirm month-end really is the busy period; if not, replace the banner with something true or remove it |

## Missing assets — client action

- [ ] Real rate card (blocks the estimate tool showing real numbers). Note the
      **pricing model** is an open question as well as the numbers: the current
      calculator prices every service as `(base + km × rate) × volume`, which
      does not fit services that are not distance-driven (packaging, general
      supplies) or that price by container/consignment (exports, international).
      Ask the client how each service is actually priced before rewiring it.
- [x] Owned photography — supplied November 2026 (claim #20). Phone originals of
      the WhatsApp service photos would still be sharper.
- [ ] Testimonials — currently zero anywhere on the site
- [ ] Client logos — naming clients is approved (claim #22); logos would need the files and each client's say-so
- [x] Physical address for the business schema — added from the company profile (claim #25)
- [x] Business registration number — the PACRA company number is on `/for-business` (claim #21); the footer stays short
- [ ] Social media profile URLs — the rebuilt site shows no social links at all, so nothing is dead. Add them to the footer when real profiles exist
- [ ] Resend domain verification for `bastuku-inv.com` — lead emails send from
      `noreply@bastuku-inv.com` and will not deliver until the domain is verified
