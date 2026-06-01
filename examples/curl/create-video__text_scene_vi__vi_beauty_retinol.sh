#!/usr/bin/env bash
# 📜 Script → Scenes · Tiếng Việt — 💄 Làm đẹp
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "script_text": "Bạn vừa bắt đầu dùng retinol thì da nổi mụn, đỏ rát, bong tróc. Đó có thể không phải là phản ứng dị ứng, mà là quá trình thải độc bình thường. Retinol đẩy tốc độ thay tế bào da từ hai mươi tám ngày xuống mười bốn ngày. Mụn ẩn dưới da nổi nhanh hơn, sau đó mới hết hẳn. Quá trình này thường kéo dài bốn đến sáu tuần. Ba cách giảm tình trạng kích ứng. Một, bắt đầu từ nồng độ thấp nhất zero phẩy hai năm phần trăm và chỉ dùng hai lần một tuần. Hai, thoa kem dưỡng ẩm trước khi thoa retinol, phương pháp sandwich. Ba, tuyệt đối tránh nắng, retinol làm da mỏng đi và dễ cháy nắng. Nếu sau sáu tuần vẫn không cải thiện, đổi sang retinaldehyde hoặc bakuchiol."}'
