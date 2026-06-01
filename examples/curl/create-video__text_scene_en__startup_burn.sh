#!/usr/bin/env bash
# 📜 Script → Scenes · English — 🚀 Startup
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "script_text": "Every founder should know two numbers cold: burn rate and runway. Burn rate is how much cash you spend each month. Runway is how many months until you hit zero. The formula is simple, cash divided by monthly burn equals runway. If you have eight hundred thousand in the bank and spend a hundred thousand a month, you have eight months. The threshold every startup needs is default-alive: you can reach profitability before runway ends without raising more money. If you're default-dead, you're either fundraising or cutting. There is no third option. Calculate your number tonight. Most founders find out theirs is shorter than they thought."}'
