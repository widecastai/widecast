# Suggest video ideas — `POST /v1/suggest_ideas`

**Synchronous.** Returns a list of video topic ideas for an industry **immediately** — no `topic_id`, no polling. Consumes credits.

<!-- widecast-playground:suggest-ideas -->

### Request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `industry_id` | string | no* | Industry name (e.g. `Real Estate`). *Required unless your account already has an industry set (then it falls back to that). |
| `num_topics` | integer | no | How many ideas, 1–20 (default 5). |
| `sub_industry` | string | no | Optional sub-industry refinement. |
| `user_location` | string | no | Optional location hint (e.g. `US`). |

### Response — `200 OK` (synchronous)

```json
{
  "object": "ideas",
  "industry": "Real Estate",
  "ideas": [
    { "title": "…", "description": "…", "industry": "…", "audience": "…", "professional": "…", "level": "industry_topic" }
  ]
}
```

### SDK
```python
res = c.suggest_ideas(industry_id="Real Estate", num_topics=5)
for idea in res["ideas"]:
    print(idea["title"])
```
```typescript
const res = await client.suggest_ideas({ industry_id: "Real Estate", num_topics: 5 });
```

### Errors

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | No `industry_id` and no account industry. |
| `ideas_failed` | 400/500 | Generation failed. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |
| `account_expired` / `credit_exhausted` | 402 | Billing. |
