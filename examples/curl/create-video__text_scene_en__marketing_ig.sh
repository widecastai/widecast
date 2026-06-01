#!/usr/bin/env bash
# 📜 Script → Scenes · English — 📣 Marketing
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "script_text": "Your Instagram engagement just dropped seventy percent, and nothing you posted is at fault. The algorithm shifted in twenty-twenty-six. Reels now get four times the reach of static posts. Posts with under three seconds of attention get downranked. Hashtag relevance now beats hashtag volume. Three things will recover your reach. Switch to reels-first content even if you hate filming. Open with a hook in the first one point five seconds, text, motion, or a question. Tag your niche with three precise hashtags, not twenty broad ones. Engagement isn't dead. The shortcut to it just changed. Test these three changes this week, then check insights."}'
