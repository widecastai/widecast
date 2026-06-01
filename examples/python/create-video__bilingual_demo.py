"""
Bilingual · 2 scenes (English + Vietnamese)

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'wait_for_render': False,
  'script': { 'aspectRatio': '9_16',
              'language': 'vi',
              'title': 'WideCast bilingual demo',
              'segments': [ { 'id': 1,
                              'type': 'HOOK',
                              'text': "Here's why every California teen should get "
                                      'their license at 16.',
                              'language': 'en'},
                            { 'id': 2,
                              'type': 'BODY',
                              'text': 'Cha mẹ ở California nên khuyến khích con lấy '
                                      'bằng lái ngay khi đủ tuổi.',
                              'language': 'vi'}]}})
print(resp)
