# Motion typography & posters — `POST /v1/typography`

**For agents that compose their own video** (HTML, After Effects, any renderer). WideCast only designs the text, with the same engines the editor uses: template typography for a key phrase mid-video, and the SVG poster engine for the **opening hook poster** and the **closing call-to-action poster**. You get every object back as its own **self-contained SVG** — the text already converted to outlines with the fonts WideCast renders with, so it needs no font and stays sharp at any size — plus a transparent PNG, its text and its position. **Charges 1 credit per call.**

> **Line breaks.** In `quote`, `|` (also `->`, `→` or a new line) forces a line break: `"KHÔNG CẦN QUAY | VẪN CÓ KHÁCH"` sets two lines.

> **Timing, motion and sound are yours.** The response carries the design only. Reveal each object on the word that says it, animate it in your video's own style, and add sound effects to match your motion.

> **Safe area.** Every object stays inside y 128–960 of the 1280 canvas: clear of the platforms' dead zones (the top 10 % and the bottom 25 % of a vertical video).

---

## Request

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/typography" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "role":  "typography",
        "text":  "Không cần quay video mà vẫn có khách hàng mỗi ngày",
        "quote": "KHÔNG CẦN QUAY | VẪN CÓ KHÁCH",
        "language": "vi",
        "look":  "my-video-01",
        "wait":  60
      }'
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `role` | string | yes | `typography` (a key phrase mid-video), `opening_poster` (the opening hook), `cta_poster` (the closing call to action). Posters are UPPERCASE, at most 3 lines of 4 words. |
| `text` | string | yes | The narration of this moment (≤ 2000 chars), context for the engines. |
| `quote` | string | no | The words to set (≤ 300 chars). `\|` = line break. Typography defaults to `text`; posters write their own copy from `text` unless `exact` is true. |
| `language` | string | no | Language code (`vi`, `en`, …). Default `vi`. |
| `words` | array | no | `[{word, start, end}]`, seconds from the start of this moment. Optional context for the engine's choice of layout (word by word or line by line). |
| `duration` | number | no | Seconds this moment lasts (1-60). Default: from `words`. |
| `show_narrator` | boolean | no | A narrator is on screen: posters keep to the lower band, clear of the face. |
| `exact` | boolean | no | Posters: use `quote` exactly as written, `\|` lines kept. |
| `brand` | object | no | `{colors: ["#RRGGBB", …]}`, main colour first. The template typography re-targets its hue to it; posters take the nearest of WideCast's curated palettes. The response's `brand` says what was applied. |
| `cta` | object | no | `{company_name, phone, email}` for a `cta_poster` (else the account profile). |
| `look` | string | no | One id per video (letters, digits, `-`, `_`): calls with the same `look` share one style. |
| `wait` | integer | no | Seconds to wait for the result (0-100, default 0). |

## Response

```json
{
  "object": "typography",
  "id": "typo_5805cf4ae9c74941",
  "status": "completed",
  "role": "typography",
  "look": "my-video-01",
  "lines": ["KHÔNG CẦN QUAY", "VẪN CÓ KHÁCH"],
  "canvas": { "width": 720, "height": 1280, "safe_top": 128, "safe_bottom": 960 },
  "preview_url": "https://widecast.ai/downloads/<company>/api_typography/my-video-01/typo_5805cf4ae9c74941_preview.png",
  "objects": [
    { "index": 1, "name": "p0_deco1", "kind": "decoration", "text": null,
      "svg_url": "…_obj01.svg", "image_url": "…_obj01.png",
      "box": { "x": 60, "y": 430, "w": 600, "h": 12 }, "phase": 0 },
    { "index": 2, "name": "p0_line4", "kind": "text", "text": "KHÔNG CẦN QUAY",
      "svg_url": "…_obj02.svg", "image_url": "…_obj02.png",
      "box": { "x": 67, "y": 462, "w": 586, "h": 81 }, "phase": 0 },
    { "index": 3, "name": "p0_line5", "kind": "text", "text": "VẪN CÓ KHÁCH",
      "svg_url": "…_obj03.svg", "image_url": "…_obj03.png",
      "box": { "x": 86, "y": 519, "w": 547, "h": 80 }, "phase": 0 }
  ],
  "credits_charged": 1
}
```

- `objects` are in paint order (back to front). Word-by-word layouts return one object per word, each with its own `text`.
- `svg_url`: the object alone, text in outlines, sized to its box. Use it in a browser-based renderer (an `<img>` or inline SVG); it scales without blur.
- `image_url`: the same object as a transparent PNG at twice the canvas scale (box.w×2 by box.h×2 pixels), for renderers that do not take SVG.
- `box` is where WideCast places the object on the 720×1280 canvas: multiply by 1.5 for 1080×1920. Keep the objects' relative positions to keep the design, or rearrange them for your frame.
- `phase` appears when the design has several phases (`p0_`, `p1_` …) that replace each other over time.
- `preview_url` shows the whole set as WideCast places it: look at it before placing the objects.
- `status` is `processing` while the job runs: poll [`GET /v1/typography/{id}`](#poll) (free; pass `?wait=` up to 100 s). On failure `status` is `failed` and `error` says why.

## Poll

```bash
curl -sS "https://widecast.ai/app/dashboard/v1/typography/typo_5805cf4ae9c74941?wait=30" \
  -H "Authorization: Bearer wc_live_REPLACE_ME"
```

## MCP

`widecast_generate_typography` (waits up to ~90 s) and `widecast_get_typography`, on both the remote connector and the local `widecast-mcp` server.
