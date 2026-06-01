#!/usr/bin/env bash
# 5-line tutorial (English)
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"script_text": "Want to make a video in 60 seconds? Here's how.\nFirst, draft your script — bullet points work fine.\nSecond, paste it into WideCast and pick an aspect ratio.\nThird, hit render and grab a coffee — done in under a minute.\nTry it free at widecast.ai.\n", "wait_for_render": false}'
