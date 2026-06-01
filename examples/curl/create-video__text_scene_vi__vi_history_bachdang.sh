#!/usr/bin/env bash
# 📜 Script → Scenes · Tiếng Việt — 📜 Lịch sử
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "script_text": "Năm chín ba tám, Ngô Quyền chấm dứt một nghìn năm Bắc thuộc bằng một bãi cọc gỗ. Quân Nam Hán tiến vào cửa sông Bạch Đằng với hơn hai vạn quân và hàng trăm chiến thuyền. Ngô Quyền cắm cọc gỗ bịt sắt nhọn dưới lòng sông, chờ thủy triều lên thì che mất, thủy triều xuống thì lộ ra. Khi quân địch tiến vào lúc nước lớn, ông cho thuyền nhẹ ra khiêu chiến rồi giả thua rút lui. Khi thủy triều rút, hạm đội Nam Hán mắc cọc, vỡ tan. Lưu Hoằng Tháo, tướng chỉ huy, tử trận. Một trận đánh duy nhất chấm dứt nghìn năm đô hộ. Bài học vẫn còn nguyên giá trị: địa hình và thời điểm thắng quân số."}'
