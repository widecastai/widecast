#!/usr/bin/env bash
# 📜 Script · English — 🏃 Sports & Fitness
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "faceless": false, "callback_url": "", "script_text": "The marathon wall is real, and it happens at mile twenty for almost everyone. Your body stores about two thousand calories of glycogen in muscles and liver. Running uses about a hundred calories per mile. That math means glycogen runs empty between mile eighteen and twenty-two. When glycogen runs out, your body switches to fat for fuel. Fat burns slower. Your pace drops twenty to thirty percent. Your legs feel like cement. Two ways to push the wall back exist. Eat thirty to sixty grams of carbs per hour during the run. Train your body to burn fat better through long, slow weekend runs. The wall isn't lack of fitness. It's biochemistry."}'
