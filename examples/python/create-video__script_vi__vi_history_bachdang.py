"""
📜 Script · Tiếng Việt — 📜 Lịch sử

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'text',
  'output_type': 'scene',
  'callback_url': '',
  'script_text': 'Năm chín ba tám, Ngô Quyền chấm dứt một nghìn năm Bắc thuộc bằng một '
                 'bãi cọc gỗ. Quân Nam Hán tiến vào cửa sông Bạch Đằng với hơn hai vạn '
                 'quân và hàng trăm chiến thuyền. Ngô Quyền cắm cọc gỗ bịt sắt nhọn '
                 'dưới lòng sông, chờ thủy triều lên thì che mất, thủy triều xuống thì '
                 'lộ ra. Khi quân địch tiến vào lúc nước lớn, ông cho thuyền nhẹ ra '
                 'khiêu chiến rồi giả thua rút lui. Khi thủy triều rút, hạm đội Nam '
                 'Hán mắc cọc, vỡ tan. Lưu Hoằng Tháo, tướng chỉ huy, tử trận. Một '
                 'trận đánh duy nhất chấm dứt nghìn năm đô hộ. Bài học vẫn còn nguyên '
                 'giá trị: địa hình và thời điểm thắng quân số.'})
print(resp)
