# Edit one scene — `POST /v1/modify_scene`

**Synchronous, no credit charged.** After the user reviews scenes (via `result.review_url` from [`/v1/create_video`](create-video.md)) and asks to swap the background image or video on a specific scene, call this endpoint to apply the edit in place.

The endpoint is **roll-aware** — you don't pick "background vs overlay"; the server does the right thing based on whether the scene is B-roll (asset becomes the background) or A-roll (asset becomes the overlay, narrator + grid untouched).

<!-- widecast-playground:modify-scene -->

> **Today's limit.** Only the background media is editable (`field_name: "mediaUrl"` + optional `"mediaType"`). Other field names return `400 unsupported_field`. Generic field edits, atomicity, and re-spec-gen triggering land in a follow-up release.

---

## Request

```http
POST /v1/modify_scene
Authorization: Bearer wc_live_REPLACE_ME
Content-Type: application/json

{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "mediaUrl",  "value": "https://cdn.example.com/coast-sunset.jpg" },
    { "field_name": "mediaType", "value": "image" }
  ]
}
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | `topic_id` from `/v1/create_video`. Same id used by `/v1/status` and `/v1/export_video`. The video must have reached `scenes_ready_for_review` (HTTP 409 otherwise). |
| `by` | string enum | yes | How to pick the scene. `"id"` = exact `segment.id` match. `"voice_file"` = exact match on the per-scene uid (also the mp3 narration filename — most reliable). `"text"` = fuzzy match against `segment.text`; may return a clarification response. |
| `value` | string \| number | yes | The id / voice_file / narration snippet to match against. For `by="text"` pass enough of the narration to be unambiguous. |
| `fields` | array | yes | Non-empty list of `{ field_name, value }` edits. Today honoured: `{ field_name: "mediaUrl", value: "<http(s) URL>" }` and optional `{ field_name: "mediaType", value: "image" \| "video" }` (auto-detected from URL extension if omitted). Other field names → 400 `unsupported_field`. |
| `op` | string | no | Reserved for future generic field ops. Defaults to `"set"`. Ignored for media edits today. |
| `min_score` | number | no | Only when `by="text"`. Fuzzy-match acceptance threshold, 0..1 (default `0.5`). Lower cautiously for paraphrases; raising past `0.9` usually causes false negatives because exact narration text rarely matches verbatim. |

---

## Responses

### `200 OK` — success

```json
{
  "object":     "scene_modified",
  "id":         "widecast7c0d4f8a9b1e2d3f",
  "scene_id":   3,
  "voice_file": "XcR0k",
  "score":      1.0,
  "applied":    "media",
  "media_type": "image"
}
```

- `scene_id` — `segment.id` of the edited scene.
- `voice_file` — stable per-scene uid (also the mp3 filename).
- `score` — `1.0` for `by="id"` / `by="voice_file"`; the fuzzy score for `by="text"`.
- `applied` — which family of edits ran. Today only `"media"`.
- `media_type` — `"image"` or `"video"`, the asset type the server resolved.

The change is visible in the editor (`review_url`) immediately. Call `/v1/export_video` again only when the user wants a fresh final MP4 to reflect the edit.

### `200 OK` — clarification (ambiguous `by="text"`)

When two or more scenes match the supplied text closely enough that picking one would be a guess, the server returns a clarification — **no edit is applied**.

```json
{
  "object":      "clarification",
  "needs_input": "value",
  "message":     "More than one scene matches that text closely. Pick one and call again with by='voice_file' (or by='id') and value set to the chosen scene's identifier.",
  "candidates":  [
    { "segment_id": 3, "voice_file": "XcR0k", "score": 0.92, "text": "Meta đã chi 14.3 tỷ đô để mua Scale AI…" },
    { "segment_id": 7, "voice_file": "Z9p2m", "score": 0.88, "text": "Meta chi 14.3 tỷ USD đầu tư vào AI training data…" }
  ]
}
```

Show the `text` previews to the user, get a pick, then call again with `by="voice_file"` and the chosen scene's `voice_file`. The server never silently picks one.

### `404 Not Found` — `video_not_found` / `scene_not_found`

- `video_not_found` — no video with this id in the account.
- `scene_not_found` — the id / voice_file / text didn't match any scene (with the configured `min_score` floor).

### `409 Precondition Failed` — `scenes_not_ready` / `invalid_script`

- `scenes_not_ready` — the video hasn't reached `scenes_ready_for_review` yet. Poll `/v1/status/{id}` first.
- `invalid_script` — the stored scene script is malformed; the video cannot be edited via this endpoint.

### `400 Bad Request`

- `invalid_json` — request body is not valid JSON.
- `missing_field` — required field missing (`id`, `by`, `value`, or `fields`).
- `invalid_id` — `id` doesn't match the `widecast<alphanumeric>` pattern.
- `invalid_by` — `by` is not one of `id` / `voice_file` / `text`.
- `invalid_field_entry` — an entry in `fields` is not `{ field_name, value }`.
- `invalid_media_url` — `mediaUrl` is not an http(s) URL the server can reach.
- `unsupported_field` — `fields` contains a `field_name` other than `mediaUrl` / `mediaType` (only the background media is editable today).

---

## Roll-aware behaviour

| Scene roll | What happens |
|---|---|
| **B-roll** (no narrator on screen) | The asset IS the background. `mediaUrl`, `thumbnailUrl`, `brollUrl`, and `brollThumbnailUrl` are all set (B-roll invariant `brollUrl === mediaUrl`); the asset is appended to `savedImages` / `savedVideos` so the editor lists it as a switchable option. |
| **A-roll** (narrator on screen) | The narrator, grid background, and overlay structure are **untouched**. The asset is registered as a saved option and stamped as `user_asset_url` on the scene; the next scene-spec gen turns it into the overlay (image → chest-card overlay; video → `brollUrl` backdrop). |

You never need to know the roll — pass the asset, the server applies it correctly.

---

## SDK examples

### Python

```python
from widecast import Widecast

client = Widecast()

# 1) Make the video, wait for scenes to be ready.
v = client.create_video(script_text=script).wait()

# 2) User reviews v.review_url. They say "use this image for scene 3".
result = client.modify_scene(
    v.id,
    by="voice_file",
    value="XcR0k",
    fields=[
        {"field_name": "mediaUrl",  "value": "https://cdn.example.com/coast-sunset.jpg"},
        {"field_name": "mediaType", "value": "image"},
    ],
)

if result["object"] == "clarification":
    # Two scenes matched too closely — show candidates to the user.
    for c in result["candidates"]:
        print(c["voice_file"], "→", c["text"])
    # …after they pick, call again with by="voice_file" and the chosen value.
else:
    assert result["object"] == "scene_modified"
    print(f"Edited scene {result['scene_id']} ({result['media_type']})")

# 3) Render the final MP4 only when the user is happy.
client.export_video(v.id).wait(timeout=900)
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const v = await client.create_video({ script_text: script }).then(v => v.wait());

const result = await client.modify_scene({
  id: v.id,
  by: "voice_file",
  value: "XcR0k",
  fields: [
    { field_name: "mediaUrl",  value: "https://cdn.example.com/coast-sunset.jpg" },
    { field_name: "mediaType", value: "image" },
  ],
});

if (result.object === "clarification") {
  for (const c of result.candidates) console.log(c.voice_file, "→", c.text);
} else {
  console.log(`Edited scene ${result.scene_id} (${result.media_type})`);
}

await client.export_video(v.id).then(v => v.wait({ timeoutMs: 900_000 }));
```

### Manual (curl)

```bash
curl -sS -X POST ".../v1/modify_scene" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "id":    "widecast7c0d4f8a9b1e2d3f",
        "by":    "voice_file",
        "value": "XcR0k",
        "fields": [
          { "field_name": "mediaUrl",  "value": "https://cdn.example.com/coast-sunset.jpg" }
        ]
      }' | jq
```

---

## Cost & ordering

- **Free** — `/v1/modify_scene` does not consume credits. The expensive work (re-rendering the final MP4) only runs when you call [`/v1/export_video`](export-video.md) again.
- **Order matters when re-rendering**: apply all `modify_scene` edits first, then call `/v1/export_video` once. Edits made after `/v1/export_video` won't appear in the already-queued render.

---

## When to use `by="text"`

Prefer `by="voice_file"` or `by="id"` whenever you have either from a previous `/v1/status` call — exact matches never fail. Use `by="text"` only when the user names a scene by what's said in it ("change the picture on the scene about Meta and Scale AI"). The endpoint is ambiguity-safe — it returns a clarification rather than guess — but the round-trip costs a call. When the user paraphrases (e.g. mixes Vietnamese and English versions of the same line), lower `min_score` cautiously to `0.4` or `0.45`; do not raise past `0.9`.
