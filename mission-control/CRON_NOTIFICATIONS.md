# Cron Change Notifications

Phone target: `+1 301-213-5069`
Primary: `iMessage`
Fallback: `SMS`

## Helper Script

`mission-control/scripts/notify-cron-change.sh`

Usage:

```bash
cd /Users/alexpotter/.openclaw/workspace
bash mission-control/scripts/notify-cron-change.sh added "Mission Control morning war plan" "0 7 * * * ET"
```

## Operational Rule (Rock)
Whenever Rock adds/updates/removes cron jobs, Rock sends a text notification using this helper.
