<!--
Thanks for sending a PR! A few things that make merging fast:
- One concern per PR (typo fix + new method + docs rewrite = 3 PRs)
- Tests passing locally (pytest / vitest / node --check)
- Conventional Commits in the title (feat / fix / docs / chore / refactor)
- No secrets in the diff (the sync workflow also scans, but eyeballs help)
-->

## What this changes


## Why


## How to verify

- [ ] Tests pass: `pytest sdk-python/tests` / `npm test --prefix sdk-js` / `node --check mcp-server/dist/index.js`
- [ ] If touching the OpenAPI spec or the Skills: `python3 docs/build.py` runs clean (parity check passes)
- [ ] If touching `install.json`: tested against at least one AI host's "install https://widecast.ai" prompt

## Scope check

- [ ] This change lives entirely on the public surface (SDKs / MCP / Skills / docs / integrations)
- [ ] No secrets, internal URLs, or `wc_live_*` keys in the diff
- [ ] CONTRIBUTING.md scope rules respected (no backend behavior changes here)
