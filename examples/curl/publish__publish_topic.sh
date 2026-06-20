#!/usr/bin/env bash
# 📣 Publish an existing WideCast video/blog
# Auto-generated from widecast/docs/playgrounds/publish.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/publish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"topic_id": "widecast7c0d4f8a9b1e2d3f", "platforms": ["youtube", "x"]}'
