#!/usr/bin/env bash
# Bilingual · 2 scenes (English + Vietnamese)
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"wait_for_render": false, "script": {"aspectRatio": "9_16", "language": "vi", "title": "WideCast bilingual demo", "segments": [{"id": 1, "type": "HOOK", "text": "Here's why every California teen should get their license at 16.", "language": "en"}, {"id": 2, "type": "BODY", "text": "Cha mẹ ở California nên khuyến khích con lấy bằng lái ngay khi đủ tuổi.", "language": "vi"}]}}'
