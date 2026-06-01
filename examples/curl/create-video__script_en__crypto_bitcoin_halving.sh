#!/usr/bin/env bash
# 📜 Script · English — ₿ Crypto
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "faceless": false, "callback_url": "", "script_text": "Bitcoin's supply schedule was decided in two thousand nine by Satoshi, and no one can change it. The protocol caps total supply at twenty-one million coins. Every four years, the reward for mining a block cuts in half. This is called the halving. In two thousand nine miners earned fifty bitcoin per block. By twenty-twelve it dropped to twenty-five. By twenty-sixteen to twelve point five. The most recent halving in twenty-twenty-four brought it to three point one two five. Each halving has historically preceded a major price rally. The next halving in twenty-twenty-eight will reduce new supply to one point five six. Scarcity is mathematical, not opinion. The supply curve is the only thing in crypto you can predict."}'
