"""
🚩 Minimal report

Auto-generated from widecast/docs/playgrounds/error-report.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_error_report(**{ 'error_message': 'video_data returned 502 script_parse_failed on a video that '
                   'renders fine in the editor'})
print(resp)
