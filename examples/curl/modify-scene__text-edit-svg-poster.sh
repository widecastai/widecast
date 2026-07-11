#!/usr/bin/env bash
# (O) Overlay text edit — retype a poster line (0-LLM, SVG-sourced)
# Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/modify_scene" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"id": "widecast7c0d4f8a9b1e2d3f", "by": "voice_file", "value": "Xb79O", "fields": [{"field_name": "overlay.text_edit", "value": {"wc_object": "support_stack", "lines": ["KHOAN VAY MUA NHA", "DUNG CHU QUAN"], "fill": "#FFD60A"}}]}'
