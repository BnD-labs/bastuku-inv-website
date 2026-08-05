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
| 12 | FAQ: "walkthrough together before we leave" | faqs | drafted | ❌ UNVERIFIED — is this standard practice? |
| 13 | FAQ: damage handling process | faqs | drafted | ❌ UNVERIFIED — what is the real policy/insurance position? |
| 14 | Coverage: Chipata, Solwezi, Olympia | coverage | drafted | ❌ UNVERIFIED |

## Missing assets — client action

- [ ] Real rate card (blocks the estimate tool showing real numbers)
- [ ] Testimonials — currently zero anywhere on the site
- [ ] Client logos, if any are permitted for use
- [ ] Professional photography (existing images are 8 MB phone exports)
- [ ] Physical address for `LocalBusiness` schema — "Lusaka, Zambia" is too vague to rank
- [ ] Business registration number, if it should appear in the footer
- [ ] Real social media profile URLs (current footer links are dead `#` anchors)
- [ ] Resend domain verification for `bastuku-inv.com` — lead emails send from
      `noreply@bastuku-inv.com` and will not deliver until the domain is verified
