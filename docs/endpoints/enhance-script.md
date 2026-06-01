# Enhance a draft script — `POST /v1/enhance_script`

Improve a **draft** video script with AI — fix grammar, add examples, sharpen the hook. Use this when you have a rough script and want it polished before turning it into a video with `/v1/create_video` (`source=text`).

Async: returns a `widecast*` id, `status: "processing"`, AND `result.review_url` (opens the Script Editor) in the create response itself — safe to hand the user immediately; the editor shows a spinner while enhancing. Poll `GET /v1/status/{id}` until `completed` for the final enhanced script. Consumes credits.

<!-- widecast-playground:enhance-script -->

### Request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `script_text` | string | yes | The DRAFT script to enhance. |
| `intervention_level` | integer | no | How aggressively to rewrite: `0` = segment only, `1` = natural enhance (default), `2` = maximum rewrite. SDK constant `INTERVENTION_LEVELS`. |
| `language` | string | no | Output language. Omit / `""` keeps the draft's original language. |
| `callback_url` | string (url) | no | HTTPS webhook for completion events. |
| `metadata` | object | no | Echoed back on `/v1/status`. |

### Response — `202 Accepted` → poll `/v1/status`

Returns the unified `/v1/status` envelope with `status: "processing"`. `result.review_url` is already populated — the Script Editor — share with the user now. Then poll `GET /v1/status/{id}`:
- `status == "completed"` → enhanced narration is final. Hand the same `topic_id` to `/v1/export_video` or re-submit the text to `/v1/create_video` to turn it into a video.

### SDK

```python
v = c.enhance_script(script_text="Want more views? Post consistently. The end.", intervention_level=1).wait()
print(v.review_url)
```
```typescript
const v = await client.enhance_script({ script_text: "rough draft…", intervention_level: 2 }).then(v => v.wait());
```

### Errors

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `script_text` is missing/empty. |
| `invalid_intervention_level` | 400 | `intervention_level` not `0`, `1`, or `2`. |
| `missing_api_key` / `invalid_api_key` | 401 | API-key auth. |
| `account_expired` / `credit_exhausted` | 402 | Account expired or out of credits. |
