#!/usr/bin/env bash
# 🧭 Audit a scene by voice_file (preferred)
# Auto-generated from widecast/docs/playgrounds/scene-geometry.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/scene_geometry" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"id": "widecast7c0d4f8a9b1e2d3f", "voice_file": "XcR0k"}'
