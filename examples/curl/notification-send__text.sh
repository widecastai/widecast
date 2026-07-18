#!/usr/bin/env bash
# 🔔 Plain notification (email + Telegram if connected)
# Auto-generated from widecast/docs/playgrounds/notification-send.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/notification/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"subject": "Your video is ready", "message": "All 8 scenes finished rendering — open the editor to review."}'
