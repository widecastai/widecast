# Add an idea to the production plan — `POST /v1/production_plan/add`

**Synchronous, no credit charged.** Queue a new idea/topic into the account's **production plan** — the backlog of ideas to turn into videos later. Readable back via [`GET /v1/production_plan`](library.md).

> Use this after [`/v1/collect_ideas`](collect-ideas.md) or [`/v1/foundation_videos`](library.md) surfaces ideas, or whenever the user says "add this to my plan", "queue this idea", "schedule this topic". The account is resolved server-side from the API key — there is **no** company/user field in the body.

The entry lands with `workflow_phase: "queued"` — or `"ab_roll"` when `source: "template"` and a `template` is given.

> **Shared core.** This endpoint and the dashboard's legacy `/add_to_production_plan` route both call the same server helper (`_add_to_production_plan_core`), so the stored row shape is identical across the UI flow and the public API.

### Recommended idea (A55)

Adding several generated ideas and want to highlight one? Pass `recommended: true` on that idea — the dashboard's plan list shows a **Recommended** badge on it (top-right). This is an **idea-level** flag; it is not `recommended_format`, which picks the master *script version* below.

### Script attach (A55)

Optionally send `scripts` — **1-5 pre-written script versions**, one per format (`VE` Value Explainer, `QA` Client Q&A, `POV`, `CS` Case Study, `MB` Myth-Buster), each **80-1000 words**. The idea is then stored already **Script ready** (no LLM call, no credit): opening it in the dashboard goes straight into the Script Editor with the supplied version(s) selectable in the 5-format strip — the writing/generation step is skipped. The `recommended_format` version becomes the master script; the others land as ready versions; formats you did not supply stay generatable later from the editor as usual.

Do **not** combine `scripts` with a `topic_id` that already has a video/script — that returns `409 topic_exists`.

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
| `recommended` | boolean | no | Flag this idea as your recommended pick — the plan list shows a **Recommended** badge on it. Idea-level; not the script-version `recommended_format`. |
| `scripts` | array | no | *Script attach.* 1-5 objects `{"format", "text"}` — formats unique, from `VE / QA / POV / CS / MB`; each `text` = the full spoken script, **80-1000 words**. Stores the idea already "Script ready". |
| `recommended_format` | string | no | Which supplied format is the recommended/**master** version. Must be one of the supplied `scripts[].format`; defaults to the first entry's format. |
| `language` | string | no | Language of the attached scripts (e.g. `English`, `Vietnamese`). Defaults to the account's saved output language. |

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

When `recommended: true` was sent, the response also carries `"recommended": true`. When `scripts` was sent, it also carries:

```json
{
  "recommended":        true,
  "scripts_attached":   ["VE", "QA", "MB"],
  "recommended_format": "VE",
  "script_ready":       true
}
```

`scripts_attached` lists the stored formats in the fixed `VE → QA → POV → CS → MB` order.

### Error responses

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `idea_text` is empty. |
| `invalid_week_start` | 400 | `week_start` is not an integer (unix seconds). |
| `invalid_scripts` | 400 | `scripts` malformed: not a 1-5 array, bad/duplicate `format`, or missing `text`. |
| `script_too_short` / `script_too_long` | 400 | A `scripts[].text` is outside the **80-1000** word bounds. |
| `invalid_recommended_format` | 400 | `recommended_format` is not among the supplied `scripts[].format`. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |
| `topic_exists` | 409 | `scripts` sent with a `topic_id` that already has a video/script. |
| `production_plan_add_failed` | 502 | The plan write failed upstream. |
| `script_seed_failed` | 502 | The plan entry was created, but attaching the scripts failed — the idea behaves like a normal (script-less) idea. |

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

# Recommended pick + pre-written scripts (idea lands "Script ready"):
res = client.add_to_production_plan(
    "3 estate-planning mistakes young parents make",
    recommended=True,
    scripts=[
        {"format": "VE", "text": ve_script_text},   # 80-1000 words each
        {"format": "MB", "text": mb_script_text},
    ],
    recommended_format="VE",
)
print(res["scripts_attached"], res["script_ready"])
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

// Recommended pick + pre-written scripts (idea lands "Script ready"):
const res2 = await client.add_to_production_plan(
  "3 estate-planning mistakes young parents make",
  {
    recommended: true,
    scripts: [
      { format: "VE", text: veScriptText },  // 80-1000 words each
      { format: "MB", text: mbScriptText },
    ],
    recommended_format: "VE",
  },
);
console.log(res2.scripts_attached, res2.script_ready);
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

```jsonc
// Recommended pick + pre-written scripts — lands "Script ready":
{
  "name": "widecast_add_to_production_plan",
  "arguments": {
    "idea_text":          "3 estate-planning mistakes young parents make",
    "recommended":        true,
    "scripts": [
      { "format": "VE", "text": "…full 80-1000 word script…" },
      { "format": "MB", "text": "…full 80-1000 word script…" }
    ],
    "recommended_format": "VE"
  }
}
```
