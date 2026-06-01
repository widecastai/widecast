#!/usr/bin/env bash
# Tutorial · 5 scenes (English)
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"wait_for_render": false, "script": {"aspectRatio": "9_16", "language": "en", "title": "WideCast Tutorial demo", "segments": [{"id": 1, "type": "HOOK", "text": "Want to make a video in 60 seconds? Here's how.", "language": "en"}, {"id": 2, "type": "BODY", "text": "First, draft your script — bullet points work fine.", "language": "en"}, {"id": 3, "type": "BODY", "text": "Second, paste it into WideCast and pick an aspect ratio.", "language": "en"}, {"id": 4, "type": "BODY", "text": "Third, hit render and grab a coffee — done in under a minute.", "language": "en"}, {"id": 5, "type": "CTA", "text": "Try it free at widecast.ai.", "language": "en"}]}}'
