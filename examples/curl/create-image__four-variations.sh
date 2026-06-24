#!/usr/bin/env bash
# 🎴 4 square variations to pick from
# Auto-generated from widecast/docs/playgrounds/create-image.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_image" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"prompt": "minimalist desk setup with a single houseplant", "ratio": "square", "count": 4}'
