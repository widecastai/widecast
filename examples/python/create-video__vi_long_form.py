"""
Tiếng Việt · Long form

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'script_text': 'Bạn nên cho con lấy bằng lái xe ngay khi đủ 16 tuổi. Đây không phải '
                 'là chuyện\n'
                 'rảnh hay không rảnh — đây là cách bạn dạy con tự lập sớm nhất.\n'
                 'Lái xe giúp các bạn trẻ học cách ra quyết định trong thời gian thực: '
                 'nhìn\n'
                 'đường, đoán hành vi người khác, chọn tốc độ phù hợp. Đó là những kỹ '
                 'năng\n'
                 'không lớp học nào dạy được, chỉ có thực hành mới có.\n'
                 'Hơn nữa, có bằng lái sớm tạo ra sự độc lập về di chuyển — con bạn '
                 'không\n'
                 'phải chờ bố mẹ đưa đón, có thể tự đi học, đi làm thêm, đi gặp bạn '
                 'bè.\n'
                 'Càng để muộn, càng khó học. Hãy ủng hộ con ngay bây giờ.\n',
  'output_type': 'scene',
  'wait_for_render': False})
print(resp)
