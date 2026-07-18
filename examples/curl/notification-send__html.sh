#!/usr/bin/env bash
# ✨ HTML-formatted body
# Auto-generated from widecast/docs/playgrounds/notification-send.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/notification/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"subject": "Render finished", "message": "<b>Final cut</b> is ready — open <a href='https://widecast.ai/'>WideCast</a> to publish.", "parse_mode": "HTML"}'
