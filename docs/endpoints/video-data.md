# Read a video's full structured script — `POST /v1/video_data`

**Synchronous, free.** Returns the FULL structured `video_script` for a `topic_id`: every scene's text/narration, the per-scene UID needed by [`/v1/modify_scene`](modify-scene.md), the currently-shown media URL, narrator (face / voice clone) config, and `global_settings` (aspect ratio, music, brand, language).

Mirrors the same engine the dashboard's scene editor uses on open — A/B-roll rebalance + ensure background music + persist if changed — so the data here matches what the user sees in `https://widecast.ai/#scene_editor?topic_id=…` exactly.

Use this when:
- The user asks "what scenes are in video X?", "show me scene 3", "what background is on the scene about Y?", "how long is each scene?".
- You need to look up a scene's `voice_file` before calling [`/v1/modify_scene`](modify-scene.md) (it's the most reliable `by` mode).
- You want to inspect what asset is currently on a scene before swapping it.

<!-- widecast-playground:video-data -->

---

## Request

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/video_data" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{"video_id": "widecastABCDEFGHIJKL"}'
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `video_id` | string | yes | Topic id from [`/v1/create_video`](create-video.md). Same id used by [`/v1/status`](create-video.md), [`/v1/export_video`](export-video.md), [`/v1/modify_scene`](modify-scene.md). Pattern: `widecast<alphanumeric>` (~20 chars). |

---

## Response — `200 OK`

```json
{
  "object":         "video_data",
  "id":             "widecastABCDEFGHIJKL",
  "topic_id":       "widecastABCDEFGHIJKL",
  "aspect_ratio":   "portrait",
  "title":          "Why your teen should get a driver's license at 16",
  "language":       "English",
  "total_segments": 6,
  "total_duration": 92.4,
  "segments": [
    {
      "id":           "0",
      "voice_file":   "widecast_seg_01",
      "text":         "You should let your teen get a driver's license at 16.",
      "type":         "A-roll",
      "duration":     8.2,
      "mediaUrl":     "https://widecast-assets.s3.us-west-1.amazonaws.com/.../scene01.jpg",
      "mediaType":    "image",
      "brollUrl":     "",
      "thumbnailUrl": "https://widecast.ai/downloads/.../thumb_01.jpg",
      "narrator":     {"name": "Sarah", "voice_id": "v_clone_42", "face_id": "f_clone_42", "audio_url": "...", "video_url": ""}
    },
    {
      "id":           "1",
      "voice_file":   "widecast_seg_02",
      "text":         "Here's why responsibility starts behind the wheel.",
      "type":         "B-roll",
      "duration":     12.7,
      "mediaUrl":     "https://pexels.com/.../teen_driving.mp4",
      "mediaType":    "video",
      "brollUrl":     "https://pexels.com/.../teen_driving.mp4",
      "thumbnailUrl": "https://pexels.com/.../teen_driving_thumb.jpg",
      "narrator":     {}
    }
  ],
  "global_settings": {
    "aspectRatio": "portrait",
    "music":       {"track": "default_calm", "volume": 0.18},
    "language":    "English",
    "brand":       {"logo_url": "..."}
  },
  "review_url": "https://widecast.ai/#scene_editor?topic_id=widecastABCDEFGHIJKL",
  "request_id": "req_abcd…"
}
```

### Error responses

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `video_id` is empty. |
| `video_not_found` | 404 | No video with this id on the account. Check it's the `widecast<...>` from `/v1/create_video` and that it belongs to your API key's account. |
| `script_not_ready` | 409 | Video is still processing or never had a script generated. Poll [`/v1/status`](create-video.md) until `status=="completed"`, then retry. |
| `script_parse_failed` | 502 | Stored video_script is malformed. Contact support with `request_id`. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |

---

## SDK examples

### Python

```python
from widecast import Widecast

client = Widecast()
data = client.video_data("widecastABCDEFGHIJKL")

for seg in data["segments"]:
    print(f"Scene {seg['id']} ({seg['type']}, {seg['duration']:.1f}s)")
    print(f"  voice_file: {seg['voice_file']}")
    print(f"  text:       {seg['text'][:80]}")
    print(f"  media:      {seg['mediaUrl']}")

# Use voice_file with modify_scene to swap the background:
client.modify_scene(
    video_id=data["id"],
    by="voice_file",
    value=data["segments"][0]["voice_file"],
    fields=[{"field_name": "mediaUrl", "value": "https://example.com/new.jpg"}],
)
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const data = await client.video_data("widecastABCDEFGHIJKL");

for (const seg of data.segments) {
  console.log(`Scene ${seg.id} (${seg.type}, ${seg.duration?.toFixed(1)}s)`);
  console.log(`  voice_file: ${seg.voice_file}`);
  console.log(`  media:      ${seg.mediaUrl}`);
}
```

### MCP

```jsonc
{
  "name": "widecast_video_data",
  "arguments": { "video_id": "widecastABCDEFGHIJKL" }
}
// → inspect segments; pick the right voice_file; then call
//   widecast_modify_scene with by="voice_file" + value=<that voice_file>.
```
