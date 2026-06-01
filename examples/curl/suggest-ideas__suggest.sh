#!/usr/bin/env bash
# 💡 Suggest ideas
# Auto-generated from widecast/docs/playgrounds/suggest-ideas.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/suggest_ideas" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"industry_id": "Real Estate", "num_topics": "5"}'
