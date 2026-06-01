#!/usr/bin/env bash
# 🗺️ Roadmap
# Auto-generated from widecast/docs/playgrounds/roadmap.yaml.

curl -X GET "https://widecast.ai/app/dashboard2/v1/roadmap" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"cycle": 1}'
