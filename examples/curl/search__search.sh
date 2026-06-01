#!/usr/bin/env bash
# 🔎 Search by keyword
# Auto-generated from widecast/docs/playgrounds/search.yaml.

curl -X GET "https://widecast.ai/app/dashboard2/v1/search" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"q": "marketing tips", "limit": 10}'
