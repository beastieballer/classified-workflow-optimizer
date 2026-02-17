# HEARTBEAT.md

## Autonomous Background Checklist (when heartbeat prompt arrives)

Run lightweight checks and only alert Alex if there is meaningful change:

1. Mission Control freshness
   - Confirm `mission-control/ACTIVITY_LOG.md` has an entry in last 8 hours.
   - If stale, add a short progress log entry.

2. SCIF Idea Pipeline
   - Add at least 1 new idea or refinement per day to `mission-control/IDEA_VAULT.md`.
   - Prefer ideas adjacent to ClearedConnect + ShieldSpec.

3. Build Momentum
   - Keep `mission-control/ACTION_BOARD.md` current with top 3 priorities.
   - Mark completed tasks and add next executable steps.

4. Output packaging
   - For strong ideas, create/update a mini-deck in `mission-control/decks/`.

5. Quiet mode
   - If nothing material changed, respond HEARTBEAT_OK.
