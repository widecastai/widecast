#!/usr/bin/env bash
# 📎 Upload an asset (audio / video / image)
# Auto-generated from widecast/docs/playgrounds/upload-asset.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/upload_asset" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{}'
