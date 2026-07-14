#!/usr/bin/env bash
# 🎬 Browse templates for an industry
# Auto-generated from widecast/docs/playgrounds/foundation-videos.yaml.

curl -X GET "https://widecast.ai/app/dashboard/v1/foundation_videos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"industry": "real estate", "page": 0}'
