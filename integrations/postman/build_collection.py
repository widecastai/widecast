#!/usr/bin/env python3
"""
Generate a Postman v2.1 collection from widecast/openapi/openapi.yaml.

Run:
    python widecast/integrations/postman/build_collection.py

Output:
    widecast/integrations/postman/collection.json

The collection uses two Postman variables — {{base_url}} and {{api_key}} — so
users only fill them once in their Postman environment.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("pip install pyyaml", file=sys.stderr)
    sys.exit(1)

HERE = Path(__file__).resolve().parent
SPEC = HERE.parent.parent / "openapi" / "openapi.yaml"
OUT = HERE / "collection.json"


def _example_body(op: dict) -> str | None:
    body = (op.get("requestBody") or {}).get("content", {}).get("application/json", {})
    if "example" in body:
        return json.dumps(body["example"], indent=2, ensure_ascii=False)
    if "examples" in body and body["examples"]:
        first = next(iter(body["examples"].values()))
        return json.dumps(first.get("value", {}), indent=2, ensure_ascii=False)
    return None


def main() -> int:
    spec = yaml.safe_load(SPEC.read_text(encoding="utf-8"))

    items = []
    for path, methods in spec.get("paths", {}).items():
        for method, op in methods.items():
            if method.lower() not in ("get", "post", "put", "patch", "delete"):
                continue
            item: dict = {
                "name": op.get("summary") or f"{method.upper()} {path}",
                "request": {
                    "method": method.upper(),
                    "header": [
                        {"key": "Content-Type", "value": "application/json"},
                        {"key": "Idempotency-Key", "value": "{{$guid}}", "disabled": True},
                    ],
                    "url": {
                        "raw": "{{base_url}}" + path,
                        "host": ["{{base_url}}"],
                        "path": [p for p in path.split("/") if p],
                    },
                    "description": op.get("description", ""),
                },
            }
            body_raw = _example_body(op)
            if body_raw:
                item["request"]["body"] = {
                    "mode": "raw",
                    "raw": body_raw,
                    "options": {"raw": {"language": "json"}},
                }
            items.append(item)

    collection = {
        "info": {
            "name": "WideCast.ai",
            "_postman_id": "00000000-0000-0000-0000-000000000001",
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
            "description": (spec.get("info") or {}).get("description", ""),
        },
        "variable": [
            {"key": "base_url", "value": "https://widecast.ai/app/dashboard2",
             "description": "WideCast API base URL"},
            {"key": "api_key", "value": "wc_live_REPLACE_ME",
             "description": "Your wc_live_* API key"},
        ],
        "auth": {
            "type": "bearer",
            "bearer": [{"key": "token", "value": "{{api_key}}", "type": "string"}],
        },
        "item": items,
    }

    OUT.write_text(json.dumps(collection, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {OUT.relative_to(SPEC.parent.parent.parent)} "
          f"({len(items)} endpoint{'s' if len(items) != 1 else ''})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
