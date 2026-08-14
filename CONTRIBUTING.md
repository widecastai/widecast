# Contributing to WideCast

Thanks for considering a contribution. This repo is the **public surface** of WideCast — SDKs, MCP server, Agent Skills, OpenAPI spec, docs, and adapter integrations. The rendering engine, scene editor, and billing pipeline live in a private engine repo and aren't in scope here.

## What you can change here

| Area | Where | Welcome PRs |
|---|---|---|
| Python SDK | [`sdk-python/`](sdk-python/) | Bug fixes, type-hint improvements, retry/backoff tuning, new helper methods that map 1:1 to a public `/v1/*` endpoint |
| JS/TS SDK | [`sdk-js/`](sdk-js/) | Same as Python |
| MCP server | [`mcp-server/`](mcp-server/) | Tool description tweaks, new wrapper tools over public endpoints, stdio + HTTP transport fixes |
| Agent Skills | [`skills/{video-script-writing,blog-writing,social-post-writing}/SKILL.md`](skills/) | Clarifications, examples, copy edits. **Structural changes to the `must_apply_now` checklist — open an issue first** so we align with the engine's behavior. |
| Adapter integrations | [`integrations/{langchain,openai,vercel-ai,postman}/`](integrations/) | Filling in framework-specific bindings using the existing SDK as a base |
| Documentation | [`docs/`](docs/), [`endpoints/`](endpoints/) | Always welcome — typos, broken examples, missing edge cases |
| OpenAPI examples | [`openapi/openapi.yaml`](openapi/openapi.yaml) `examples:` | More realistic worked examples per source / output_type combo |
| Install manifest | [`install.json`](install.json) | New host entries (e.g., a new MCP client we don't cover yet), better detection hints |

## What's out of scope

| Area | Why |
|---|---|
| Rendering engine, narrator pipeline, scene composition | Lives in the private engine repo. Open an [issue](../../issues) and we'll work it from our side. |
| New `/v1/*` endpoint **behavior** | Schema PRs on `openapi.yaml` are welcome as proposals, but the implementation has to land in the private repo first. |
| Billing, rate-limit math, ES-backed storage | Private. |
| Per-platform OAuth / social distribution | Private — provider TOS complications. |

When in doubt, open an issue with the proposal — fastest way to find out if it's in scope.

## Dev setup (no backend access required)

The public surfaces are self-contained — you can hack on them without an internal API key.

```bash
git clone https://github.com/widecastai/widecast.git
cd widecast

# Python SDK
cd sdk-python && pip install -e . && python3 -m pytest tests/ -q

# JS/TS SDK
cd sdk-js && npm install && npm test

# MCP server (TS)
cd mcp-server && npm install && npm run build && node --check dist/index.js
```

For end-to-end tests against the live API you'll need a `wc_live_*` key from [widecast.ai/#setup](https://widecast.ai/#setup) (free tier has a sandbox quota).

## Building the docs site

```bash
cd docs && python3 build.py
# output → widecast/*.html
```

The build runs a parity check that fails if the OpenAPI source drifts from `llms.txt` or `openapi-actions.json`. Keep them in sync.

## PR conventions

- **One concern per PR.** A typo fix + a new SDK method + a docs rewrite = three PRs.
- **Tests pass locally before pushing.** `pytest`, `vitest`, `node --check dist/index.js`, `python3 docs/build.py`.
- **No published-secret commits.** Pre-commit scan looks for `wc_live_`, `AKIA`, `sk-`, JWT-shaped tokens. Re-roll keys immediately if anything slips.
- **Conventional Commits.** `feat(sdk-py): add waitFor` / `fix(mcp): timeout on stdio reconnect` / `docs(skills): clarify abstract topic escape`.
- **Skill changes:** add an example of the before / after model output so reviewers can see the behavior delta.
- **OpenAPI changes:** run the build to regenerate `openapi.json` and `openapi-actions.json` so the artifacts stay in sync.

## Issue templates

- 🐛 **Bug** — what you tried, what you expected, what happened, `request_id` from the error envelope if you have one.
- ✨ **Feature** — what use case, why the current API can't cover it.
- ❓ **Question** — usage / integration question; tagging with `question` keeps the noise sortable.

## Releasing (maintainers)

Releases run from the private engine repo via a single command. The flow is gate-checked end-to-end so a broken state can't reach PyPI / npm.

```bash
# in the private engine repo root
make doctor                # 1. snapshot the world (read-only)
make release VER=0.1.1     # 2. bump + check + sync + tag
```

`make release` runs in order:

1. **Bump** `widecast/VERSION` + 3 package metadata files (`sdk-python/pyproject.toml`, `sdk-js/package.json`, `mcp-server/package.json`).
2. **Check** — full parity across all surfaces (12 phases today):
   - `dashboard2.py` AST parse
   - `docs/build.py` (OpenAPI ↔ llms.txt ↔ openapi-actions.json parity, plus the
     User Guide build: every public endpoint + MCP tool + UI surface must be
     covered by a `docs/guide/` topic, and the chatbot Q&A feed `docs/qa.txt`
     regenerates from the same topics — see HANDOFF A54)
   - `pytest sdk-python`
   - `npm run typecheck && npm test` on `sdk-js`
   - `npm run build && node --check dist/index.js` on `mcp-server`
   - Version coherence: VERSION = 3 package files
   - Grep parity: every `properties:` field in OpenAPI appears in both SDKs
3. **Sync** private widecast/ → public mirror (allow-list rsync, INTERNAL: comments stripped, secret scan).
4. **Tag** `vX.Y.Z` on the public mirror. GitHub Actions `publish-pypi` + `publish-npm` workflows fire and ship the 3 packages within ~3 minutes.

If any step fails, the next step doesn't run and the failing log line is printed so the agent (or you) can find and fix the drift.

For surgical operations:

```bash
make check                 # just run the gate, no bump/sync/tag
make bump VER=0.1.1        # just propagate version, don't release
make sync-dry              # preview what'd sync, no commit
make sync                  # push private → public (no tag)
```

**Agent context for a new session** — read these in order:
1. `~/.claude/projects/.../memory/MEMORY.md` (always auto-loaded; pointer index)
2. `widecast/HANDOFF.md` (private — A1-A54 decision history)
3. The `project-widecast-surfaces-map` memory entry — which file owns which API contract
4. This file (`CONTRIBUTING.md`) for the public-facing scope rules

## Code of Conduct

By participating you agree to the [Contributor Covenant](CODE_OF_CONDUCT.md).

## License

By contributing you agree your changes ship under [Apache 2.0](LICENSE).
