# Mission Control ♜

Venture operating system for Alex + Rook.

## Purpose
A single place to track:
- Business ideas worth pursuing
- Active projects and build status
- Weekly priorities and daily actions
- Revenue and pipeline signals

## Files
- `IDEA_VAULT.md` — opportunity pipeline + scorecards
- `BUILD_TRACKER.md` — active builds and blockers
- `ACTION_BOARD.md` — today/this-week execution list
- `METRICS_LOG.md` — weekly business metrics
- `dashboard.html` — visual mission-control cockpit
- `dashboard.css` / `dashboard.js` — dashboard styling + logic
- `ACTIVITY_LOG.md` — autonomous build timeline

## Dashboard Modules (v2)
- KPI strip with color-coded status
- Pipeline funnel visualization
- Weekly target-vs-actual scoreboard
- Today actions, build tracker, top ideas
- Live recent activity feed

## View Dashboard
From `mission-control/` run:

```bash
python3 -m http.server 8090
```

Then open: `http://localhost:8090/dashboard.html`

## Operating Rhythm
- **Daily:** update `ACTION_BOARD.md`
- **2-3x per week:** update `BUILD_TRACKER.md`
- **Weekly (Friday):** update `METRICS_LOG.md`
- **As ideas appear:** log in `IDEA_VAULT.md`

## Status Key
- `IDEA` — early concept
- `VALIDATE` — testing demand
- `BUILD` — shipping MVP
- `SELL` — actively acquiring customers
- `SCALE` — systematizing growth
- `PAUSE` — parked intentionally
- `KILL` — archived and closed
