#!/usr/bin/env bash
# 📜 Script → Scenes · Tiếng Việt — 📖 Văn học
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "script_text": "Nguyễn Du viết Truyện Kiều bằng chữ Nôm vào đầu thế kỷ mười chín, ba nghìn hai trăm năm mươi tư câu lục bát. Cốt truyện ông mượn từ tiểu thuyết Trung Quốc, nhưng nghệ thuật thì hoàn toàn Việt. Lý do Truyện Kiều sống hai trăm năm không nằm ở cốt truyện, mà ở từng câu thơ. Mỗi câu có thể đứng độc lập như một câu tục ngữ. Người Việt mọi thế hệ vẫn dùng câu Kiều trong đời sống: bói Kiều, lẩy Kiều, đố Kiều. Đây là điều hiếm gặp trong văn học thế giới, một tác phẩm vừa kinh điển vừa dân gian. Nếu chưa đọc trọn vẹn, hãy bắt đầu với đoạn Kiều ở lầu Ngưng Bích, chín mươi tư câu cô đọng cả triết lý nhân sinh."}'
