#!/usr/bin/env bash
# (D) Group rect — resize + scale children
# Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/modify_scene" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"id": "widecast7c0d4f8a9b1e2d3f", "by": "voice_file", "value": "XcR0k", "fields": [{"field_name": "remotion.group.rect", "value": {"element_id": "main", "x": 111, "y": -120, "w": 498, "h": 174, "coordinate_space": "canvas", "resize_mode": "scale_children"}}]}'
