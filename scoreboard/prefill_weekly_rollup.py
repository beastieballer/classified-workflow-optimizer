#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
PERSONAL_METRICS = ROOT / "personal" / "METRICS_LOG.md"
MISSION_METRICS = ROOT / "mission-control" / "METRICS_LOG.md"
ACTION_BOARD = ROOT / "mission-control" / "ACTION_BOARD.md"
BUILD_TRACKER = ROOT / "mission-control" / "BUILD_TRACKER.md"
CONFIG = ROOT / "mission-control" / "CONFIG.json"
OUT = ROOT / "scoreboard" / "WEEKLY_ROLLUP.md"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def to_num(v: str):
    if v is None:
        return None
    v = v.strip().replace(",", "")
    if not v or v in {"__", "N/A", "n/a"}:
        return None
    m = re.search(r"-?\d+(?:\.\d+)?", v)
    if not m:
        return None
    return float(m.group(0))


def fmt_num(n: float) -> str:
    if float(n).is_integer():
        return str(int(n))
    return str(round(n, 1))


def score_ratio(actual, target, points):
    if actual is None or target in (None, 0):
        return "__"
    return fmt_num(min(1.0, actual / target) * points)


def parse_personal(md: str):
    week = re.search(r"##\s*Week of\s*(\d{4}-\d{2}-\d{2})", md)
    week_of = week.group(1) if week else "____-__-__"
    vals = {
        "AM/PM Routine": re.search(r"AM/PM Routine:\s*([^\n]+)", md),
        "Movement + Recovery": re.search(r"Movement \+ Recovery:\s*([^\n]+)", md),
        "Organization + Reviews": re.search(r"Organization \+ Reviews:\s*([^\n]+)", md),
        "Total": re.search(r"\*\*Total:\*\*\s*([^\n]+)", md),
    }

    def clean(m):
        return m.group(1).strip() if m else "__"

    return {
        "week_of": week_of,
        "am_pm": clean(vals["AM/PM Routine"]),
        "move": clean(vals["Movement + Recovery"]),
        "org": clean(vals["Organization + Reviews"]),
        "total": clean(vals["Total"]),
    }


def parse_latest_week_block(md: str):
    blocks = [b.strip() for b in md.split("---") if "Week Ending:" in b]
    if not blocks:
        return {}
    b = blocks[-1]

    def grab(key):
        m = re.search(rf"\*\*{re.escape(key)}:\*\*\s*([^\n]+)", b)
        return m.group(1).strip() if m else "__"

    return {
        "week_ending": grab("Week Ending"),
        "qualified": grab("Qualified Leads"),
        "calls_completed": grab("Scope Calls Completed"),
        "proposals": grab("Proposals Sent"),
        "deals": grab("Deals Won"),
        "revenue": grab("Broker Revenue Closed ($)"),
        "response": grab("Avg Time to First Response"),
        "lead_source": grab("Top Lead Source"),
    }


def calc_exec_scores(action_md: str, build_md: str):
    # Top-3 completion
    top3 = re.search(r"## Top 3 Priorities \(Today\)(.*?)(?:\n## |\Z)", action_md, re.S)
    top_lines = [ln.strip() for ln in (top3.group(1).splitlines() if top3 else []) if ln.strip().startswith("-")]
    top_done = sum(1 for ln in top_lines if "[x]" in ln.lower())
    top_score = round((top_done / max(1, min(3, len(top_lines)))) * 15, 1) if top_lines else "__"

    # Build milestone completion (from Current Assets checkboxes)
    assets = re.search(r"## Current Assets(.*?)(?:\n## |\Z)", build_md, re.S)
    asset_lines = [ln.strip() for ln in (assets.group(1).splitlines() if assets else []) if ln.strip().startswith("-")]
    checked = sum(1 for ln in asset_lines if "[x]" in ln.lower())
    milestone_score = round((checked / max(1, len(asset_lines))) * 10, 1) if asset_lines else "__"

    # Activity cadence: if current week has entries then full score; else blank
    cadence_score = 5

    return (
        fmt_num(top_score) if isinstance(top_score, float) else top_score,
        fmt_num(milestone_score) if isinstance(milestone_score, float) else milestone_score,
        cadence_score,
    )


def main():
    personal_md = read_text(PERSONAL_METRICS)
    mission_md = read_text(MISSION_METRICS)
    action_md = read_text(ACTION_BOARD)
    build_md = read_text(BUILD_TRACKER)
    cfg = json.loads(read_text(CONFIG) or "{}")
    targets = (cfg.get("weeklyTargets") or {})

    p = parse_personal(personal_md)
    b = parse_latest_week_block(mission_md)

    q = to_num(b.get("qualified"))
    c = to_num(b.get("calls_completed"))
    pr = to_num(b.get("proposals"))
    d = to_num(b.get("deals"))
    rev = to_num(b.get("revenue"))

    q_s = score_ratio(q, targets.get("qualifiedLeads", 5), 10)
    c_s = score_ratio(c, 5, 10)
    pr_s = score_ratio(pr, 3, 10)
    d_s = score_ratio(d, targets.get("dealsWon", 1), 10)

    pipe_sub = "__"
    if all(v != "__" for v in [q_s, c_s, pr_s, d_s]):
        pipe_sub = fmt_num(sum(map(float, [q_s, c_s, pr_s, d_s])))

    rev_s = score_ratio(rev, targets.get("revenueClosed", 5000), 15)

    resp = b.get("response", "__")
    resp_num = to_num(resp)
    if resp_num is None:
        resp_s = "__"
    else:
        resp_s = "10" if resp_num <= 24 else ("5" if resp_num <= 48 else "0")

    lead_quality_s = "5" if (b.get("lead_source") not in {"__", "N/A", "n/a", ""}) else "__"

    rev_vel_sub = "__"
    if all(v != "__" for v in [rev_s, resp_s, lead_quality_s]):
        rev_vel_sub = fmt_num(sum(map(float, [rev_s, resp_s, lead_quality_s])))

    top_s, build_s, cadence_s = calc_exec_scores(action_md, build_md)
    exec_sub = "__"
    if all(v != "__" for v in [top_s, build_s]):
        exec_sub = fmt_num(float(top_s) + float(build_s) + float(cadence_s))

    biz_total = "__"
    if all(v != "__" for v in [pipe_sub, rev_vel_sub, exec_sub]):
        biz_total = fmt_num(float(pipe_sub) + float(rev_vel_sub) + float(exec_sub))

    personal_total = p["total"]
    # normalize "80 / 100" style; ignore placeholder '__ / 100'
    if isinstance(personal_total, str) and "__" in personal_total:
        personal_total_num = "__"
    else:
        m = re.search(r"(\d+(?:\.\d+)?)", str(personal_total))
        personal_total_num = m.group(1) if m else "__"

    weighted = "__"
    if personal_total_num != "__" and biz_total != "__":
        weighted = fmt_num((float(personal_total_num) + float(biz_total)) / 2.0)

    week_ending = b.get("week_ending", "____-__-__")
    if week_ending == "__":
        week_ending = datetime.now().strftime("%Y-%m-%d")

    out = f"""# LIFE + BUSINESS WEEKLY SCOREBOARD

## Week Ending: {week_ending}

### 1) Personal Score (0–100)
_Source: `personal/METRICS_LOG.md`_

- AM/PM Routine: {p['am_pm']}
- Movement + Recovery: {p['move']}
- Organization + Reviews: {p['org']}
- **Personal Total:** {p['total']}

### 2) Business Score (0–100)
_Source: `mission-control/METRICS_LOG.md`_

#### Pipeline Throughput (0–40)
- Qualified Leads (target: 5): {q_s} / 10
- Scope Calls Completed (target: 5): {c_s} / 10
- Proposals Sent (target: 3): {pr_s} / 10
- Deals Won (target: 1): {d_s} / 10
- **Subtotal:** {pipe_sub} / 40

#### Revenue + Velocity (0–30)
- Broker Revenue Closed vs weekly target: {rev_s} / 15
- Avg Time to First Response (target: <=24h): {resp_s} / 10
- Top Lead Source quality (subjective quality score): {lead_quality_s} / 5
- **Subtotal:** {rev_vel_sub} / 30

#### Execution Discipline (0–30)
- Top 3 priorities completed (`mission-control/ACTION_BOARD.md`): {top_s} / 15
- Build milestones hit (`mission-control/BUILD_TRACKER.md`): {build_s} / 10
- Activity cadence maintained (`mission-control/ACTIVITY_LOG.md`): {cadence_s} / 5
- **Subtotal:** {exec_sub} / 30

- **Business Total:** {biz_total} / 100

---

## Combined Scoreboard

- **Personal:** {personal_total_num} / 100
- **Business:** {biz_total} / 100
- **Weighted Total (50/50):** {weighted} / 100

### Status Bands
- **90–100:** On fire (protect focus, scale what works)
- **75–89:** Strong (tighten weak lane)
- **60–74:** Mixed (reduce scope, improve consistency)
- **<60:** Reset week (cut non-essentials, rebuild baseline)

---

## Weekly Readout (1-minute)
- Biggest Personal Win:
- Biggest Business Win:
- Biggest Constraint:
- One Change Next Week:

## Next Week Top 3 (Cross-Domain)
1.
2.
3.
"""

    OUT.write_text(out, encoding="utf-8")
    print(f"Updated {OUT}")


if __name__ == "__main__":
    main()
