"""Webhook signature verification.

WideCast signs every webhook delivery with HMAC-SHA256:
    signed_payload = f"{timestamp}.{request_body_raw}"
    signature      = HMAC_SHA256(secret, signed_payload).hexdigest()
    header         = "X-WideCast-Signature: t=<timestamp>,v1=<sig_hex>"

Verify the header on every incoming webhook to confirm it came from WideCast
and hasn't been tampered with. Also check the timestamp is recent (default
tolerance: 5 minutes) to prevent replay attacks.

Example (Flask):

    from flask import request
    from widecast import verify_webhook, WebhookVerificationError

    @app.route("/widecast-hook", methods=["POST"])
    def handle_widecast():
        try:
            event = verify_webhook(
                request.get_data(as_text=True),
                request.headers.get("X-WideCast-Signature", ""),
                secret=os.environ["WIDECAST_WEBHOOK_SECRET"],
            )
        except WebhookVerificationError as e:
            return {"error": str(e)}, 400
        # `event` is the parsed JSON body: {event_id, event_type, data, ...}
        if event["event_type"] == "video.completed":
            review_url = event["data"]["result"]["review_url"]
            ...
        return "", 204
"""
from __future__ import annotations

import hashlib
import hmac
import json
import time
from typing import Any


class WebhookVerificationError(ValueError):
    """Raised when a webhook signature is invalid, expired, or malformed."""


def verify_webhook(
    request_body: str,
    signature_header: str,
    secret: str,
    *,
    tolerance_seconds: int = 300,
) -> dict:
    """Verify a webhook delivery and return the parsed event body.

    Args:
        request_body:       The raw HTTP request body (string). MUST be exactly
                            what WideCast sent — no JSON re-encoding, no
                            whitespace normalisation. Get it from
                            `request.get_data(as_text=True)` in Flask or
                            equivalent.
        signature_header:   The full `X-WideCast-Signature` header value, e.g.
                            "t=1747680000,v1=abc123...".
        secret:             Your `WIDECAST_WEBHOOK_SECRET` (shared with the
                            server-side env var). Cycle this periodically.
        tolerance_seconds:  Reject signatures whose `t=` is older than this.
                            Default 5 min — typical clock skew + retry delay.

    Returns:
        The parsed event body as a dict, e.g.
            {"event_id": "evt_...", "event_type": "video.completed",
             "created_at": "...", "data": {...}}

    Raises:
        WebhookVerificationError: stale timestamp, bad signature, or malformed
        header.
    """
    if not signature_header:
        raise WebhookVerificationError("missing X-WideCast-Signature header")
    try:
        parts = dict(p.split("=", 1) for p in signature_header.split(","))
    except ValueError as e:
        raise WebhookVerificationError(f"malformed signature header: {e}")
    ts = parts.get("t")
    sig = parts.get("v1")
    if not ts or not sig:
        raise WebhookVerificationError("signature header missing t= or v1=")
    try:
        ts_int = int(ts)
    except ValueError:
        raise WebhookVerificationError("t= is not an integer")
    if abs(time.time() - ts_int) > tolerance_seconds:
        raise WebhookVerificationError(
            f"signature timestamp outside tolerance window "
            f"({tolerance_seconds}s) — possible replay"
        )
    signed = f"{ts}.{request_body}".encode("utf-8")
    expected = hmac.new(secret.encode("utf-8"), signed, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, sig):
        raise WebhookVerificationError("signature mismatch")
    try:
        return json.loads(request_body)
    except json.JSONDecodeError as e:
        raise WebhookVerificationError(f"body is not valid JSON: {e}")
