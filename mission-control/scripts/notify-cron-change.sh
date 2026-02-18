#!/usr/bin/env bash
set -euo pipefail

PHONE="+13012135069"
SERVICE="imessage"

ACTION="${1:-updated}"
JOB_NAME="${2:-cron job}"
DETAILS="${3:-no details provided}"

MSG="🗿 Rock cron ${ACTION}: ${JOB_NAME} — ${DETAILS}"

if imsg send --to "$PHONE" --service "$SERVICE" --text "$MSG"; then
  exit 0
fi

# fallback to SMS if iMessage fails
imsg send --to "$PHONE" --service sms --text "$MSG"
