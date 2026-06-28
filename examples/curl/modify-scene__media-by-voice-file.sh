#!/usr/bin/env bash
# (A) Background swap — image, by voice_file
# Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/modify_scene" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"id": "widecast7c0d4f8a9b1e2d3f", "by": "voice_file", "value": "XcR0k", "fields": [{"field_name": "mediaUrl", "value": "https://cdn.example.com/coast-sunset.jpg"}, {"field_name": "mediaType", "value": "image"}]}'
