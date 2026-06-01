#!/usr/bin/env bash
# 📜 Script → Scenes · English — 📱 Product Review
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "script_text": "Skip the iPhone 17 if you're on iPhone 15. The processor is twenty percent faster but you won't feel it. The camera adds a one-twenty-millimeter telephoto, useful only if you shoot portraits or sports. The screen is the same. Battery life improved by ninety minutes. Price went up by two hundred dollars. Three real reasons to upgrade exist. You're on iPhone 13 or older, the jump is meaningful. Your battery is below eighty percent health and replacement costs two hundred. You shoot pro video at 4K HDR, the new ISP earns its keep. Otherwise wait for iPhone 18 next year. Most users won't notice the difference."}'
