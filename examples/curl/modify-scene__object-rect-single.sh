#!/usr/bin/env bash
# (C) Object-layer rect — move a single overlay text object
# Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/modify_scene" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"id": "widecast7c0d4f8a9b1e2d3f", "by": "voice_file", "value": "XcR0k", "fields": [{"field_name": "remotion.object.rect", "value": {"layout_id": "main.obj_03_text", "x": 24, "y": 160, "w": 232, "h": 42, "coordinate_space": "preview"}}]}'
