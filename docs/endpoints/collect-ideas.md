# Generate ideas from a product — `POST /v1/collect_ideas`

**Synchronous.** Returns video ideas derived from a **product/service description** (≥10 chars) **immediately** — no polling. Consumes credits on success.

<!-- widecast-playground:collect-ideas -->

### Request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `product_service_input` | string | yes | Describe the product/service to brainstorm ideas from (**≥10 chars**). |
| `target_location` | string | conditional | **Audience market** the videos should target (city/state/country) — e.g. `"California, United States"`, `"Texas, US"`, `"Vietnam"`. Drives which local trends/sources/language are used. Required if the account has no cached `target_location` yet; if you omit it AND no cached value exists, the API returns a **clarification** response (see below) and does **not** charge a credit. May differ from where the user is based (an agency in Vietnam may target a US audience). |
| `user_location` | string | no | Optional: where the user is based (city/state/country). Used as a hint; can differ from `target_location`. |
| `sub_industry` | string | no | Optional sub-industry. |

### Response — `200 OK` (synchronous, success)

```json
{
  "object": "ideas",
  "ideas": [
    { "title": "…", "description": "…", "level": "related_questions" }
  ]
}
```

### Response — `200 OK` (clarification, no credit charged)

Returned when `target_location` is missing AND the account has no cached one. Relay the message to the user, then call again with their answer:

```json
{
  "object": "clarification",
  "needs_input": "target_location",
  "message": "Which target market / audience location should these video ideas target? e.g. 'California, United States', 'Texas, US', or 'Vietnam'."
}
```

### SDK
```python
res = c.collect_ideas(
    product_service_input="A budgeting app for freelancers with tax estimates",
    target_location="California, United States",
)
```
```typescript
const res = await client.collect_ideas({
  product_service_input: "A budgeting app for freelancers…",
  target_location: "California, United States",
});
```

### Errors

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `product_service_input` missing or <10 chars. |
| `ideas_failed` | 400/500 | Generation failed. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |
| `account_expired` / `credit_exhausted` | 402 | Billing. |
