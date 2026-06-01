#!/usr/bin/env bash
# Short paragraph (English)
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"script_text": "California parents should encourage their teens to get a driver's license at 16.\nDriving builds independence, responsibility, and confidence.\nDon't wait — the longer you delay, the harder it gets.\n", "wait_for_render": false}'
