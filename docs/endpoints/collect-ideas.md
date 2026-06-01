# Generate ideas from a product — `POST /v1/collect_ideas`

**Synchronous.** Returns video ideas derived from a **product/service description** (≥10 chars) **immediately** — no polling. Consumes credits.

<!-- widecast-playground:collect-ideas -->

### Request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `product_service_input` | string | yes | Describe the product/service to brainstorm ideas from (**≥10 chars**). |
| `sub_industry` | string | no | Optional sub-industry. |
| `user_location` | string | no | Optional location hint. |

### Response — `200 OK` (synchronous)

```json
{
  "object": "ideas",
  "ideas": [
    { "title": "…", "description": "…", "level": "related_questions" }
  ]
}
```

### SDK
```python
res = c.collect_ideas(product_service_input="A budgeting app for freelancers with tax estimates")
```
```typescript
const res = await client.collect_ideas({ product_service_input: "A budgeting app for freelancers…" });
```

### Errors

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `product_service_input` missing or <10 chars. |
| `ideas_failed` | 400/500 | Generation failed. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |
| `account_expired` / `credit_exhausted` | 402 | Billing. |
