# WideCast Postman Collection

Pre-built [Postman v2.1](https://learning.postman.com/docs/collections/collections-overview/) collection covering every WideCast endpoint.

## Use

1. **Import** [`collection.json`](./collection.json) into Postman (`File → Import`).
2. Set the two collection variables:
   - `base_url` = `https://widecast.ai/app/dashboard2` (or your override)
   - `api_key` = your `wc_live_*` or `wc_live_*` key
3. Hit any request — the `{{api_key}}` is auto-injected as a Bearer token.

## Regenerate

```bash
pip install pyyaml
python widecast/integrations/postman/build_collection.py
```

This reads `widecast/openapi/openapi.yaml` and rewrites `collection.json`. Run it after every API change.

## License

Apache-2.0.
