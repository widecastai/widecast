#!/usr/bin/env bash
# (M) Remotion add element — image with explicit 280×498 preview rect
# Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/modify_scene" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"id": "widecast7c0d4f8a9b1e2d3f", "by": "voice_file", "value": "XcR0k", "fields": [{"field_name": "remotion.add_element", "value": {"kind": "image", "url": "https://cdn.example.com/badge.png", "rect": {"x": 16, "y": 60, "w": 64, "h": 64, "coordinate_space": "preview"}}}]}'
