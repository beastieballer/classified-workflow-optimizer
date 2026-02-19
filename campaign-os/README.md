# Campaign OS (Ampersand Alternative)

AI-native SaaS for campaign teams running linear + CTV + digital.

## Positioning
Not an inventory reseller. A decision layer above buying that:
1. Optimizes creative variants
2. Measures incremental lift
3. Enforces compliance before launch

## v0 Modules
- **Creative Intelligence Loop**: variant scoring + budget shift recommendations
- **Incrementality Engine**: channel lift score + confidence
- **Compliance Copilot**: disclaimer/risk checks with audit trail

## Files
- `index.html` — public-facing product page
- `app.html` — interactive MVP dashboard mock
- `styles.css` — shared styling
- `app.js` — simulation logic + simple recommendations

## Run locally
```bash
cd campaign-os
python3 -m http.server 8093
```
Open:
- http://localhost:8093/index.html
- http://localhost:8093/app.html

## 14-day MVP Build Plan
- **Days 1-2:** data model + event schema (creative, spend, conversions, region)
- **Days 3-4:** connectors (CSV + manual input + API stubs)
- **Days 5-7:** creative scoring model + budget recommendation engine
- **Days 8-10:** incrementality baseline (geo split + confidence bands)
- **Days 11-12:** compliance rule engine + reviewer workflow
- **Days 13-14:** onboarding + billing hooks + pilot deploy
