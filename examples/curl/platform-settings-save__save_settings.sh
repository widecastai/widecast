#!/usr/bin/env bash
# 💾 Save publish settings
# Auto-generated from widecast/docs/playgrounds/platform-settings-save.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/platform_settings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"platform": "youtube", "settings": {"privacy": "public"}}'
