"""
📜 Script · Tiếng Việt — 🎓 Dạy học

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'text',
  'output_type': 'scene',
  'callback_url': '',
  'script_text': 'Người Việt phát âm tiếng Anh sai chủ yếu không phải vì lười, mà vì '
                 'hệ thống âm thanh khác nhau. Tiếng Việt có sáu thanh điệu, tiếng Anh '
                 'không có thanh. Tiếng Anh có hai mươi bốn phụ âm, trong đó tám âm '
                 'tiếng Việt không có. Ba âm khó nhất với người Việt: âm /θ/ trong '
                 'think, âm /ʃ/ trong shoe, và âm /r/ cuối từ như car. Ba mẹo giúp '
                 'khắc phục. Đặt lưỡi giữa hai hàm răng và thổi nhẹ để có âm /θ/, '
                 'không phát thành /t/. Tròn môi và đẩy hơi từ trong miệng để có âm '
                 '/ʃ/, không phát thành /s/. Cuốn lưỡi nhẹ về sau khi gặp /r/ cuối từ. '
                 'Nghe nhiều và bắt chước người bản xứ hiệu quả hơn học từng âm riêng '
                 'lẻ.'})
print(resp)
