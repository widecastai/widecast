# widecast (Python)

Official Python SDK for [WideCast.ai](https://widecast.ai) — generate videos from a script,
idea, audio, or existing video via a clean REST API.

```bash
pip install widecast
```

## 60-second example

```python
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME")

video = client.create_video(
    script={
        "language": "vi",
        "aspectRatio": "9_16",
        "segments": [
            {"id": 1, "type": "HOOK",
             "text": "Bạn nên cho con lấy bằng lái xe ngay khi 16 tuổi."},
        ],
    },
).wait()                     # blocks until completed/failed

print(video["status"], video["video_url"])
```

## Setup

```python
from widecast import Widecast

# API key from env (WIDECAST_API_KEY) or explicit
client = Widecast(
    api_key="wc_live_...",
    base_url="https://widecast.ai/app/dashboard2",   # default for v0.1.0 pilot
    timeout=60.0,
    max_retries=3,
)
```

## Methods

```python
client.create_video(script, *, wait_for_render=False, callback_url=None,
                    metadata=None, idempotency_key=None) -> Video
client.get_video(video_id) -> Video

video.wait(timeout=600.0, poll_interval=3.0) -> Video
video.id            # str
video.status        # 'processing' | 'rendering' | 'completed' | 'failed'
video.video_url     # str | None
video.is_terminal   # bool
video["any_field"]  # dict access for everything else
```

## Error handling

```python
from widecast import (
    WidecastError, InvalidRequestError, NotFoundError,
    RateLimitError, APIError,
)

try:
    video = client.create_video(script=my_script)
except InvalidRequestError as e:
    print(f"Bad input: {e} (param={e.param}, request_id={e.request_id})")
except RateLimitError as e:
    print("Slow down, retry after a moment.")
except APIError as e:
    print(f"Server-side issue: {e.code} — share request_id={e.request_id} in support tickets.")
```

Every error carries `e.code`, `e.message`, `e.request_id`, `e.doc_url`, `e.status`.

## License

Apache-2.0.
