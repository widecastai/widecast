#!/usr/bin/env bash
# 📜 Script → Scenes · English — 🛒 Ecommerce
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "script_text": "If your Shopify store converts under two percent, you're losing money on every ad click. The industry average is one point four percent, but top stores hit four to six. Three issues kill conversion in twenty-twenty-six. Slow product pages, anything over three seconds loads loses sixty percent of buyers. Missing trust signals, no real product photos, no reviews, no return policy near the buy button. Friction at checkout, surprise shipping fees, forced account creation, or address fields without autofill. Fix product page speed first using Shopify's free PageSpeed report. Add five real customer photos to your top product. Move shipping cost above the cart. Conversion compounds, each fix earns the next."}'
