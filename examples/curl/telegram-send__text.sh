#!/usr/bin/env bash
# 💬 Plain text notification
# Auto-generated from widecast/docs/playgrounds/telegram-send.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/telegram/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"message": "Your video is ready to review! Open the dashboard to pick scenes."}'
