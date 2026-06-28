#!/usr/bin/env bash
# 🪟 Curated WideCast grid backgrounds (special `keyword="grid"`)
# Auto-generated from widecast/docs/playgrounds/search-broll.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/search_broll" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"keyword": "grid", "kind": "video"}'
