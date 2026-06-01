#!/usr/bin/env bash
# 🔗 Connect a platform
# Auto-generated from widecast/docs/playgrounds/connect.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/connect" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"platform": "youtube"}'
