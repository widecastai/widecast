#!/usr/bin/env bash
# ⚙️ Load publish settings
# Auto-generated from widecast/docs/playgrounds/platform-settings.yaml.

curl -X GET "https://widecast.ai/app/dashboard/v1/platform_settings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{}'
