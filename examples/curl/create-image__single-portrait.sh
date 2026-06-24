#!/usr/bin/env bash
# 🖼️ Single portrait image
# Auto-generated from widecast/docs/playgrounds/create-image.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_image" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"prompt": "a wooden ladder leaning against a red brick wall, morning light", "ratio": "portrait", "count": 1}'
