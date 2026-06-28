#!/usr/bin/env bash
# (A) Background swap — match by narration text, video
# Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/modify_scene" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"id": "widecast7c0d4f8a9b1e2d3f", "by": "text", "value": "Meta đã chi 14.3 tỷ đô để mua Scale AI", "fields": [{"field_name": "mediaUrl", "value": "https://cdn.example.com/scale-ai-news.mp4"}, {"field_name": "mediaType", "value": "video"}]}'
