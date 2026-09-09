# Report a WideCast problem — `POST /v1/error/report`

**Synchronous, no credit charged.** Report a problem with WideCast itself — a failing upload, a broken export, an overlay that will not build, an endpoint returning a 5xx you cannot work around. The report is emailed straight to the WideCast team.

> **Self-reporting only.** There is no company / user / recipient field by design. The reporting account is resolved server-side from the API key, and the destination is fixed to the WideCast team — so this cannot be used to email arbitrary people.

## When to use it (and when not to)

| Situation | Use |
|---|---|
| An endpoint keeps returning 5xx and you cannot work around it | **this endpoint** |
| An export / upload / overlay build fails repeatedly | **this endpoint** |
| You want to tell the **user** something ("your video is ready") | [`/v1/notification/send`](notification-send.md) |
| The content is weak — bad hook, wrong background, a typo | fix it yourself; don't report |

Whenever the failing call returned a `request_id`, put it in `context`. It is the single most useful field for tracing a report back to the server-side log.

> **Shared core.** This endpoint and the dashboard's `/report_error` route both call the same server helpers (`_wc_normalize_error_report` + `_report_error_core`), so a report renders identically whichever surface submitted it.

<!-- widecast-playground:error-report -->

---

## Request

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/error/report" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "module":        "export",
        "error_message": "export_failed: renderer exited with code 137 (OOM)",
        "context": {
          "topic_id":   "widecast7c0d4f8a9b1e2d3f",
          "request_id": "req_9f2c14ab",
          "attempted":  "second export retry after scene 4 edit"
        }
      }'
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `error_message` | string | **yes** | What went wrong. Prefer the **verbatim** error text the failing call returned over a paraphrase. Max **4000** characters (SDK `ERROR_MESSAGE_MAX_CHARS`). |
| `module` | string | no | Which part failed — e.g. `export`, `scene_upload`, `spec`, `modify_scene`, `video_data`. Free-form; it only groups reports for triage. Max **80** characters (SDK `ERROR_MODULE_MAX_CHARS`). Defaults to `agent` for API callers. |
| `context` | object | no | Free-form debugging details: `topic_id`, `voice_file`, `scene_id`, what you were attempting, and above all the `request_id` of the failing call. At most **50** keys are rendered into the report. |

---

## Response — `200 OK`

```json
{
  "object":       "error_report",
  "reported":     true,
  "module":       "export",
  "context_keys": 3,
  "request_id":   "req_abcd…"
}
```

`reported: true` means the report reached the WideCast team. `module` echoes the module the report was filed under after defaulting/truncation, and `context_keys` how many `context` entries were included.

### Error responses

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `error_message` is empty. |
| `error_message_too_long` | 400 | `error_message` exceeds 4000 characters. |
| `module_too_long` | 400 | `module` exceeds 80 characters. |
| `invalid_module` | 400 | `module` is not a string. |
| `invalid_context` | 400 | `context` is not an object. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |
| `error_report_failed` | 502 | The report could not be delivered. |

---

## SDK examples

### Python

```python
from widecast import Widecast

client = Widecast()
res = client.report_error(
    "export_failed: renderer exited with code 137 (OOM)",
    module="export",
    context={
        "topic_id": "widecast7c0d4f8a9b1e2d3f",
        "request_id": "req_9f2c14ab",
    },
)
print(res["reported"], res["module"])
```

A realistic pattern — report only after your own retry failed:

```python
from widecast import Widecast, APIError

client = Widecast()
try:
    client.export_video("widecast7c0d4f8a9b1e2d3f", user_confirmed_render=True)
except APIError as e:
    client.report_error(
        str(e),
        module="export",
        context={"topic_id": "widecast7c0d4f8a9b1e2d3f",
                 "request_id": getattr(e, "request_id", None)},
    )
    raise
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const res = await client.report_error(
  "export_failed: renderer exited with code 137 (OOM)",
  {
    module: "export",
    context: { topic_id: "widecast7c0d4f8a9b1e2d3f", request_id: "req_9f2c14ab" },
  },
);
console.log(res.reported, res.module);
```

### MCP

```jsonc
{
  "name": "widecast_report_error",
  "arguments": {
    "module":        "export",
    "error_message": "export_failed: renderer exited with code 137 (OOM)",
    "context": { "topic_id": "widecast7c0d4f8a9b1e2d3f", "request_id": "req_9f2c14ab" }
  }
}
```
