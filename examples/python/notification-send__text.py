"""
🔔 Plain notification (email + Telegram if connected)

Auto-generated from widecast/docs/playgrounds/notification-send.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_notification_send(**{ 'subject': 'Your video is ready',
  'message': 'All 8 scenes finished rendering — open the editor to review.'})
print(resp)
