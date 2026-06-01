#!/usr/bin/env bash
# Tiếng Việt · Long form
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"script_text": "Bạn nên cho con lấy bằng lái xe ngay khi đủ 16 tuổi. Đây không phải là chuyện\nrảnh hay không rảnh — đây là cách bạn dạy con tự lập sớm nhất.\nLái xe giúp các bạn trẻ học cách ra quyết định trong thời gian thực: nhìn\nđường, đoán hành vi người khác, chọn tốc độ phù hợp. Đó là những kỹ năng\nkhông lớp học nào dạy được, chỉ có thực hành mới có.\nHơn nữa, có bằng lái sớm tạo ra sự độc lập về di chuyển — con bạn không\nphải chờ bố mẹ đưa đón, có thể tự đi học, đi làm thêm, đi gặp bạn bè.\nCàng để muộn, càng khó học. Hãy ủng hộ con ngay bây giờ.\n", "output_type": "scene", "wait_for_render": false}'
