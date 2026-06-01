# Security policy

## Reporting a vulnerability

If you find a security issue in WideCast — whether in this repo (SDKs / MCP server / Skills / docs) or on the live widecast.ai service — please report it privately, NOT in a public GitHub issue.

**Email:** security@widecast.ai
**Subject prefix:** `[security]`

Include in your report:
- A short description of the issue and the impact you expect (read another user's data? bypass billing? execute code?).
- Steps to reproduce, with the smallest test case that demonstrates the bug.
- Affected version(s) — package version for SDK/MCP issues; date / `request_id` for live-service issues.
- Your contact for follow-up.

We aim to:
- Acknowledge within **48 hours**.
- Confirm the issue (or push back) within **5 business days**.
- Patch high-severity bugs within **14 days** of confirmation, with credit to you (or anonymous if you prefer).

## Scope

In scope:
- SDKs in this repo (`sdk-python/`, `sdk-js/`)
- MCP server (`mcp-server/`)
- Skill files (`skills/*`) — supply-chain / prompt-injection concerns
- The OpenAPI spec and `install.json` manifest — manifest-poisoning concerns
- The live API at `https://widecast.ai/v1/*` — auth bypass, IDOR, billing manipulation, server-side request forgery, injection, etc.
- The live OAuth / publish flow (per-platform token leak, scope escalation).

Out of scope:
- Rate-limit / fair-use violations (please report via support if you think you've been wrongly throttled — that's billing support, not security).
- Open redirect on documentation pages where the target is clearly external.
- Findings that require physical access to the user's device, social engineering, or compromised host infrastructure outside our control.

## Safe-harbor

You're welcome to test against our live `widecast.ai` service using your own account, **as long as**:
- You don't access data belonging to other users / accounts.
- You don't degrade service for other users (don't fuzz at scale, no DoS attempts).
- You stop and report as soon as you reproduce the bug — no further exploitation.

We won't take legal action against good-faith research that follows the above.

## Disclosure preference

We follow coordinated disclosure. We'll work with you on a public-disclosure date once the patch ships. We're happy to credit you in the CHANGELOG and the GitHub Security Advisory.
