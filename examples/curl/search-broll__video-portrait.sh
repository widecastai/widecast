#!/usr/bin/env bash
# 🎬 Stock video clips (portrait)
# Auto-generated from widecast/docs/playgrounds/search-broll.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/search_broll" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"keyword": "umbrella rain", "kind": "video", "ratio": "portrait", "limit": 10}'
