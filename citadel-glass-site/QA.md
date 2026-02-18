# QA Checklist + Results (Citadel Glass Site)

Date: 2026-02-18
Scope: `/citadel-glass-site` only
Tester role: QA + release engineer

## Desktop QA (≥1280px)

- [x] Hero hierarchy clear (brand > headline > subheadline > CTA)
- [x] Primary + secondary CTAs visible above fold
- [x] Section order supports conversion flow (trust → offer → process → FAQ → CTA)
- [x] Typography contrast passes practical readability on dark background
- [x] Cards align and remain readable across wider layouts
- [x] FAQ accordions open/close correctly in browser
- [x] Pricing ranges and tier labels consistently formatted
- [x] Footer assurance line present

## Mobile QA (375–430px)

- [x] Meta viewport present
- [x] No horizontal overflow
- [x] CTA buttons wrap and remain tappable
- [x] Tier cards stack to one column
- [x] Step cards remain readable without clipping
- [x] FAQ controls are tap-friendly
- [x] Disclaimer block remains visible and readable

## Content + Legal-Safety QA

- [x] Tone is premium/discreet and consistent
- [x] Risky absolute guarantees removed/avoided
- [x] Explicit legal-safe disclaimer block included on page
- [x] "Unbreakable" claim explicitly denied in FAQ
- [x] Investment figures labeled as typical ranges (not promises)

## Issues Found + Fixes Applied

1. **Missing deployable web page** (only `content.md` existed)
   - Fix: created `index.html` with responsive, conversion-ordered single-page site.
2. **Legal-safe disclaimer needed on production page**
   - Fix: added a dedicated “Important Performance Disclaimer” section in-page.
3. **No deployment/runbook docs**
   - Fix: added `DEPLOY.md` with local serve + Vercel deployment commands.

## Release Readiness

Status: **Ready to deploy**

Notes:
- This is a static site release (single-page HTML/CSS).
- Contact links currently target `hello@citadelglass.com` mailto placeholders.
