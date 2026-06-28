#!/usr/bin/env bash
# (G) Layout batch — via the explicit `layout.batch` envelope
# Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/modify_scene" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"id": "widecast7c0d4f8a9b1e2d3f", "by": "voice_file", "value": "XcR0k", "fields": [{"field_name": "layout.batch", "value": {"fields": [{"field_name": "overlay.narrator.rect", "value": {"x": 35, "y": 124, "w": 210, "h": 374}}, {"field_name": "overlay.caption.y", "value": 408}]}}]}'
