# widecast (Python)

Official Python SDK for [WideCast.ai](https://widecast.ai) — generate short-form videos from a script, an idea, a blog post, or an existing video/audio clip via a clean REST API. Python 3.8+.

```bash
pip install widecast
```

## 60-second example

```python
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME")

# source="text" — you've already written the narration (used verbatim by the narrator).
video = client.create_video(
    source="text",
    script_text=(
        "The first 10 minutes after a car crash decide whether your insurance pays — or fights you. "
        "First: pull over, hazards on; if anyone's hurt, dial 911. "
        "Second: do NOT say 'I'm sorry' at the scene — admission of fault hurts your claim. "
        "Third: take photos of both cars, both plates, the road, skid marks. "
        "Fourth: swap name, license, plate, insurance company and policy number with the other driver. "
        "Fifth: call your insurance the same day. Save this so you don't have to think when it happens."
    ),
)

print(video.review_url)            # Show the user immediately — page handles early arrival.
done = video.wait()                # Polls /v1/status with backoff (5s → 60s cap).
print(done.status, done.video_url) # 'completed' + final MP4 URL
```

## Source routing — pick honestly

WideCast's REST API takes one of several **sources** depending on what you have. If you're driving the SDK from an AI agent that **cannot do real research** (no web search, no URL fetch, no image search), don't write the script yourself — let WideCast research and write it for you:

```python
# source="idea" — the server researches the topic AND writes the script.
# Use this when you (or the AI driving the SDK) can't fetch the web or
# harvest image URLs to back up a "current event" script.
video = client.create_video(
    source="idea",
    idea_text="5 things every first-time driver should do right after a car accident.",
)
done = video.wait()
```

Other sources:

| `source` | When to use | Required field |
|---|---|---|
| `"text"` | You have a finished 80–500-word narration. | `script_text` |
| `"idea"` | You have a short brief (5–1000 words). Server researches + writes the script. | `idea_text` |
| `"blog"` | Repurpose an existing 30–3000-word article into a video. | `blog_text` |
| `"video_url"` / `"audio_url"` | Remake from an existing media URL. | `video_url` / `audio_url` |
| `"video_file"` / `"audio_file"` | Same, from a local file (multipart upload — use the SDK helper). | `video_file` / `audio_file` |
| `"audio_base64"` | Audio attached inline as base64 (≤10 MB decoded). The AI-agent path for "user attached a voice memo to the chat" — no URL or multipart. | `audio_data` (+ optional `audio_filename`) — or use the `create_video_from_audio_bytes(audio_bytes, …)` helper |

The full writing method (research → harvest images → 3-Layer Hook → inline media → hand-off) is available through the key-free endpoint `https://widecast.ai/app/dashboard2/v1/skills/writing?format=video` or the static fallback `https://origin.widecast.ai/skills/video-script-writing.zip` — fetch it from any LLM before drafting a `source="text"` script.

## Setup

```python
from widecast import Widecast

# API key from env (WIDECAST_API_KEY) or explicit
client = Widecast(
    api_key="wc_live_...",
    base_url="https://widecast.ai/app/dashboard",   # default
    timeout=60.0,
    max_retries=3,
)
```

## Methods

```python
client.create_video(
    source,                       # "text" | "idea" | "blog" | "video_url" | "audio_url" | "audio_base64" | ...
    script_text=None,             # required when source="text"
    idea_text=None,               # required when source="idea"
    blog_text=None,               # required when source="blog"
    video_url=None, audio_url=None,
    audio_data=None,              # base64-encoded, required when source="audio_base64"
    audio_filename=None,          # used to pick extension (audio_base64 only)
    output_type=None,             # "text" | "scene" | "video"
    language=None, faceless=None,
    callback_url=None, metadata=None, idempotency_key=None,
) -> Video

# Ergonomic helper for the "user attached a voice memo" path — bytes → base64,
# 10 MB cap enforced client-side, fast-fail before any network call.
client.create_video_from_audio_bytes(
    audio_bytes,                  # raw bytes
    filename=None,                # original filename (used for the file extension)
    **create_video_kwargs,        # output_type, callback_url, metadata, idempotency_key, ...
) -> Video

client.get_status(video_id) -> Video       # single check
client.export_video(video_id) -> Video     # render final MP4 (scene → video)
client.modify_scene(                       # SYNC, no credit. Swap bg media on ONE scene
    video_id, by="voice_file"|"id"|"text", value=..., fields=[
        {"field_name": "mediaUrl", "value": "<URL>"},                 # required
        {"field_name": "mediaType", "value": "image"|"video"},        # optional, auto-detected
    ], op=None, min_score=None,
) -> dict   # {object:"scene_modified", ...} or {object:"clarification", candidates:[...]}

client.create_content(content, content_type="blog", language=None) -> Video
client.enhance_script(script_text, language=None, intervention_level=None) -> Video

client.collect_ideas(product_service_input, sub_industry=None, user_location=None,
                     target_location=None)

client.publish(topic_id=None, text=None, video_url=None, photo_urls=None, platforms=None, title=None)
client.list_videos(from_record=0)
client.search(query, limit=10)
client.account()                  # plan + credits_remaining

# Video instance
video.id              # str — widecast<alphanumeric>
video.status          # 'pending' | 'processing' | 'completed' | 'failed'
video.review_url      # str — share with user immediately (present from first response)
video.video_url       # str | None — final MP4 (output_type='video' only)
video.progress_label  # str — UX hint like "Generating scene visuals · ~7 min left"
video.is_terminal     # bool
video.wait(timeout=600.0, poll_interval=3.0)  # blocks until terminal
video["any_field"]    # dict access for everything else
```

See [openapi.json](https://widecast.ai/openapi.json) for the full schema.

## Error handling

```python
from widecast import (
    WidecastError, InvalidRequestError, NotFoundError,
    PreconditionFailedError, RateLimitError, APIError,
)

try:
    video = client.create_video(source="text", script_text="...")
except InvalidRequestError as e:
    if e.code == "credit_exhausted":
        # HTTP 402 — show user both options
        print(f"You're out of credits on the {e.details.get('current_plan')} plan.")
        print(f"Wait until {e.details.get('reset_at')} (monthly refresh) — or upgrade now:")
        print(e.upgrade_url)   # https://widecast.ai/#pricing_plans
    else:
        print(f"Bad input: {e} (param={e.param}, request_id={e.request_id})")
except RateLimitError:
    print("Slow down, retry after a moment.")
except APIError as e:
    print(f"Server-side issue: {e.code} — share request_id={e.request_id} in support tickets.")
```

Every error carries `e.code`, `e.message`, `e.request_id`, `e.doc_url`, `e.status`. HTTP 402 (`credit_exhausted` / `account_expired`) additionally carries `e.details` with `upgrade_url`, `reset_at`, `current_plan`, `credits_remaining`, `next_plan`, etc.

## More

- **Docs & live playground**: <https://widecast.ai/docs.html> · <https://widecast.ai/playground.html>
- **OpenAPI 3.1 spec**: <https://widecast.ai/openapi.json>
- **Issues & discussion**: <https://github.com/widecastai/widecast/discussions>

## License

Apache-2.0.
