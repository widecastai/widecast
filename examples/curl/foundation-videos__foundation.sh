#!/usr/bin/env bash
# 🏛️ Foundation templates
# Auto-generated from widecast/docs/playgrounds/foundation-videos.yaml.

curl -X GET "https://widecast.ai/app/dashboard2/v1/foundation_videos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"industry": "Real Estate", "page": 0}'
