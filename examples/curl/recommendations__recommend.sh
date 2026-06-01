#!/usr/bin/env bash
# 💡 Recommended ideas
# Auto-generated from widecast/docs/playgrounds/recommendations.yaml.

curl -X GET "https://widecast.ai/app/dashboard2/v1/recommendations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"industry": "Real Estate", "page": 0}'
