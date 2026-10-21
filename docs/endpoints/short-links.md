# Short links — `POST /v1/short_links`, `GET` / `PATCH /v1/short_links/{id}`

**Synchronous, no credit charged.** Create a short link `https://widecast.ai/s/<ID>` that redirects (HTTP 302) to any http(s) URL, look one up (its destination and click count), and change where it goes. A short link belongs to the account of the API key, and every open is counted.

> **The ID is permanent.** Only the destination (`url`) can change. Links made on the [widecast.ai/shorten.html](../shorten.html) page and links made through the API are the same links: you can create on one and edit on the other.

| Rule | Value |
|---|---|
| `url` | Full `http://` or `https://` link, at most **2048** characters (SDK `SHORT_LINK_URL_MAX_CHARS`), no spaces, no `user:password@`. |
| `custom_id` | Optional. **4-32 letters or digits only** (SDK `SHORT_LINK_CUSTOM_ID_MIN_CHARS` / `SHORT_LINK_CUSTOM_ID_MAX_CHARS`): no spaces, dashes or other symbols. Case-insensitive, stored in capitals: `Sale2026` becomes `SALE2026`, and `widecast.ai/s/sale2026` opens the same link. 0 and O are both allowed. |
| Random ID | When `custom_id` is omitted: 6 characters from A-Z and 1-9, leaving out 0 and O so it is easy to read. |
| New links | **10 per account per hour** (SDK `SHORT_LINK_CREATES_PER_HOUR`), shared with the shorten page. A request that creates nothing (409, 5xx) does not use up the limit. |
| Destination changes | **100 per account per hour** (SDK `SHORT_LINK_EDITS_PER_HOUR`). |
| Ownership | Another account's link, and an ID that does not exist, both answer `404 short_link_not_found`. |

<!-- widecast-playground:short-link-create -->

---

## Create — `POST /v1/short_links`

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/short_links" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "url":       "https://example.com/spring-sale?utm_source=newsletter",
        "custom_id": "SALE2026"
      }'
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | **yes** | The long link. Full `http://` or `https://` URL, max **2048** characters (SDK `SHORT_LINK_URL_MAX_CHARS`). |
| `custom_id` | string | no | The ID after `widecast.ai/s/`: **4-32** letters or digits (SDK `SHORT_LINK_CUSTOM_ID_MIN_CHARS` / `SHORT_LINK_CUSTOM_ID_MAX_CHARS`), case-insensitive, stored in capitals. Omit for a random ID. |

### Response — `201 Created`

```json
{
  "object":     "short_link",
  "id":         "SALE2026",
  "short_url":  "https://widecast.ai/s/SALE2026",
  "url":        "https://example.com/spring-sale?utm_source=newsletter",
  "clicks":     0,
  "created_at": "2026-10-20T19:05:00Z",
  "updated_at": null,
  "meta":       { "request_id": "req_abcd…", "widecast_version": "0.1.0" }
}
```

Give the user `short_url` exactly as returned.

---

## Look up — `GET /v1/short_links/{id}`

`{id}` is the part after `widecast.ai/s/` (for example `SALE2026`), not the whole URL.

```bash
curl -sS "https://widecast.ai/app/dashboard/v1/short_links/SALE2026" \
  -H "Authorization: Bearer wc_live_REPLACE_ME"
```

Returns the same `short_link` object. `clicks` includes opens that are still being counted in memory, so it can be a little ahead of what the dashboard shows.

---

## Change the destination — `PATCH /v1/short_links/{id}`

```bash
curl -sS -X PATCH "https://widecast.ai/app/dashboard/v1/short_links/SALE2026" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{ "url": "https://example.com/autumn-collection" }'
```

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | **yes** | The new destination. Full `http://` or `https://` URL, max **2048** characters (SDK `SHORT_LINK_URL_MAX_CHARS`). |

Returns the `short_link` object plus `previous_url`. The ID, `short_url` and `clicks` stay the same, and everyone who opens the link afterwards lands on the new `url`. If an AI agent makes the call, it should confirm the new destination with the user first: the link may already be printed or shared.

---

## Error responses

| `error.code` | HTTP | When |
|---|---|---|
| `invalid_json` | 400 | The body is not a JSON object. |
| `missing_field` | 400 | `url` is missing or empty (`param: url`). |
| `invalid_url` | 400 | `url` is not a full http/https link, is over 2048 characters, has spaces or `user:password@`. |
| `invalid_custom_id` | 400 | `custom_id` is not 4-32 letters or digits. |
| `invalid_short_link_id` | 400 | The `{id}` in the path is not 1-32 letters or digits. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |
| `short_link_not_found` | 404 | No such short link in this account. |
| `custom_id_taken` | 409 | That ID already exists. Choose another `custom_id` or omit it. |
| `rate_limited` | 429 | 10 new links, or 100 destination changes, per account per hour. Carries `Retry-After` and `error.details.retry_after_seconds`. |
| `short_link_failed` | 500 | The link could not be stored or read. Retry. |

---

## SDK examples

### Python

```python
from widecast import Widecast

client = Widecast()
link = client.create_short_link("https://example.com/spring-sale", custom_id="Sale2026")
print(link["short_url"])            # https://widecast.ai/s/SALE2026

info = client.get_short_link("SALE2026")
print(info["url"], info["clicks"])

moved = client.update_short_link("https://widecast.ai/s/SALE2026", "https://example.com/autumn-collection")
print(moved["previous_url"], "->", moved["url"])
```

`get_short_link` and `update_short_link` accept the ID or the whole short URL. A 429 raises `RateLimitError` at once (`e.details["retry_after_seconds"]`) instead of waiting out the hour.

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const link = await client.create_short_link("https://example.com/spring-sale", { custom_id: "Sale2026" });
console.log(link.short_url);        // https://widecast.ai/s/SALE2026

const info = await client.get_short_link("SALE2026");
const moved = await client.update_short_link("SALE2026", "https://example.com/autumn-collection");
console.log(moved.previous_url, "->", moved.url);
```

### MCP

The MCP server exposes `widecast_create_short_link`, `widecast_get_short_link` and `widecast_update_short_link`. The update tool tells the agent to confirm the new destination with the user before calling.
