#!/usr/bin/env bash
# 🌐 Who has the editor open right now?
# Auto-generated from widecast/docs/playgrounds/scene-inspector.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/scene_inspector" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"id": "widecast7c0d4f8a9b1e2d3f", "action": "list_live_editors"}'
