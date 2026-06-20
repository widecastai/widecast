#!/usr/bin/env bash
# ✨ HTML-formatted message
# Auto-generated from widecast/docs/playgrounds/telegram-send.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/telegram/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"message": "<b>Render finished</b>\nOpen <a href='https://widecast.ai/'>WideCast</a> to publish.", "parse_mode": "HTML"}'
