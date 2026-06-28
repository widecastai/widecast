#!/usr/bin/env bash
# (J) A/B-roll switch — show narrator A-roll
# Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/modify_scene" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"id": "widecast7c0d4f8a9b1e2d3f", "by": "voice_file", "value": "XcR0k", "fields": [{"field_name": "roll.active", "value": "A"}]}'
