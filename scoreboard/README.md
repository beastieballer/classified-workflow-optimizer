# Scoreboard

Single-pane weekly rollup for personal + business performance.

## Files
- `WEEKLY_ROLLUP.md` — one-page combined scorecard
- `prefill_weekly_rollup.py` — auto-prefill script (Sunday cron)
- `dashboard.html` — visual Command Deck
- `dashboard.css` / `dashboard.js` — dashboard styling + logic

## Weekly use (Sunday)
1. Cron/script pre-fills `WEEKLY_ROLLUP.md`
2. Review and adjust weekly readout + next-week top 3
3. Open `dashboard.html` for executive + ops + action view

## View dashboard locally
From workspace root:

```bash
python3 -m http.server 8091
```

Open:
`http://localhost:8091/scoreboard/dashboard.html`
