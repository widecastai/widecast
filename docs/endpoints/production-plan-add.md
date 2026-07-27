# Add an idea to the production plan — `POST /v1/production_plan/add`

**Synchronous, no credit charged.** Queue a new idea/topic into the account's **production plan** — the backlog of ideas to turn into videos later. Readable back via [`GET /v1/production_plan`](library.md).

> Use this after [`/v1/collect_ideas`](collect-ideas.md) or [`/v1/foundation_videos`](library.md) surfaces ideas, or whenever the user says "add this to my plan", "queue this idea", "schedule this topic". The account is resolved server-side from the API key — there is **no** company/user field in the body.

The entry lands with `workflow_phase: "queued"` — or `"ab_roll"` when `source: "template"` and a `template` is given.

> **Shared core.** This endpoint and the dashboard's legacy `/add_to_production_plan` route both call the same server helper (`_add_to_production_plan_core`), so the stored row shape is identical across the UI flow and the public API.

<!-- widecast-playground:production-plan-add -->

---

## Request

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/production_plan/add" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "idea_text":   "Why estate planning matters for young families",
        "description": "Hook on the 40% who die intestate; CTA to book a consult.",
        "source":      "idea"
      }'
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `idea_text` | string | **yes** | The idea / topic line to queue into the plan. |
| `description` | string | no | Longer description / notes for the idea. |
| `industry` | string | no | Industry tag. **Falls back to the account's saved industry** when omitted. |
| `source` | string | no | Provenance tag (default `idea`). Use `template` together with `template` to start the entry in the `ab_roll` phase instead of `queued`. |
| `week_start` | integer | no | Unix timestamp (seconds) for the plan week; used as the entry's `creation_time`. Defaults to now. |
| `topic_id` | string | no | Stable id for the entry. **Auto-generated** (`widecast<hex>`) when omitted. |
| `template` | string | no | *Advanced.* Template id when queuing from a foundation template. |
| `sub_industry` | string | no | *Advanced.* Narrower sub-industry tag. |
| `core_topics` | string | no | *Advanced.* Core topics for the idea. |
| `peripheral_topics` | string | no | *Advanced.* Peripheral / related topics. |
| `short_headline` | string | no | *Advanced.* A short headline for the entry. |

---

## Response — `200 OK`

```json
{
  "object":         "production_plan_entry",
  "added":          true,
  "topic_id":       "widecast3f0a8b2c91d4e57f",
  "workflow_phase": "queued",
  "industry":       "estate planning",
  "source":         "idea",
  "request_id":     "req_abcd…"
}
```

`topic_id` is the id of the queued entry — the one you passed, or the one the server generated. Read the full plan back with [`GET /v1/production_plan`](library.md).

### Error responses

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `idea_text` is empty. |
| `invalid_week_start` | 400 | `week_start` is not an integer (unix seconds). |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |
| `production_plan_add_failed` | 502 | The plan write failed upstream. |

---

## SDK examples

### Python

```python
from widecast import Widecast

client = Widecast()
res = client.add_to_production_plan(
    "Why estate planning matters for young families",
    description="Hook on the 40% who die intestate; CTA to book a consult.",
)
print(res["topic_id"], res["workflow_phase"])
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const res = await client.add_to_production_plan(
  "Why estate planning matters for young families",
  { description: "Hook on the 40% who die intestate; CTA to book a consult." },
);
console.log(res.topic_id, res.workflow_phase);
```

### MCP

```jsonc
{
  "name": "widecast_add_to_production_plan",
  "arguments": {
    "idea_text": "Why estate planning matters for young families",
    "source":    "idea"
  }
}
```
