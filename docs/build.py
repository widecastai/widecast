#!/usr/bin/env python3
"""
WideCast docs build pipeline — Markdown + YAML manifests → static site + examples.

Output target: **widecast/** itself (the site root). This means after build,
`widecast/docs.html`, `widecast/playground.html`, `widecast/endpoints/...` etc.
are the live web files. The marketing homepage `widecast/widecast.html` is
hand-crafted (NOT generated here). Test by:
    python3 -m http.server -d widecast 8000
    open http://localhost:8000/widecast.html

Deploy by serving `widecast/` from any web server (see ../deploy_widecast.sh):
- Production:       https://widecast.ai/            (widecast/ IS the web root;
                    webserver default document = widecast.html)

Same HTML works in both places — every page has a <base href> computed per
depth, so relative URLs (assets/, playgrounds/, endpoints/) resolve regardless
of where the site is mounted.

Inputs (sources, live in widecast/docs/):
  endpoints/<name>.md          (docs Markdown, may contain
                                <!-- widecast-playground:<key> --> markers)
  playgrounds/<key>.yaml       (playground source-of-truth:
                                endpoint info + N use_cases + assertions)
  index.md
  llms.txt
  template.html                (HTML shell with {{BASE_HREF}} + {{CONTENT}})
  assets/*                     (CSS, JS — copied as-is)

Outputs (built into widecast/ root):
  docs.html                    (docs landing, from index.md — NOT the homepage)
  playground.html              (aggregator)
  llms.txt                     (copy)
  openapi.yaml                 (copy from widecast/openapi/)
  openapi.json                 (converted from YAML)
  assets/                      (copied)
  endpoints/<name>.html
  playgrounds/<key>.json       (yaml → json, fetched by JS)
  ../examples/python/<key>__<use_case>.py        (cross-folder)
  ../examples/typescript/<key>__<use_case>.ts
  ../examples/curl/<key>__<use_case>.sh

Dependencies (minimal):
  pip install markdown pyyaml pygments
"""
from __future__ import annotations

import json
import os
import pprint
import re
import shutil
import sys
from pathlib import Path

try:
    import markdown
    import yaml
    from pygments.formatters import HtmlFormatter
except ImportError as e:
    print(f"Missing dep: {e}. Install with: pip install markdown pyyaml pygments")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent          # widecast/docs/
SITE_ROOT = ROOT.parent                          # widecast/  (build target = self)
EXAMPLES_ROOT = ROOT.parent / "examples"
ASSETS_SRC = ROOT / "assets"
PLAYGROUND_SRC = ROOT / "playgrounds"
ENDPOINTS_SRC = ROOT / "endpoints"
TEMPLATE_FILE = ROOT / "template.html"
INDEX_MD = ROOT / "index.md"
LLMS_TXT = ROOT / "llms.txt"
OPENAPI_SRC = ROOT.parent / "openapi" / "openapi.yaml"
LEGACY_SITE = ROOT.parent / "docs-html"          # stale after refactor — warn

# ── User guide (end-user docs) ──────────────────────────────────────────
GUIDE_SRC = ROOT / "guide"                       # docs/guide/*.md   (topic sources)
GUIDE_META_FILE = GUIDE_SRC / "_guide.yml"       # groups + ui universe + exceptions
GUIDE_OUT = SITE_ROOT / "guide"                  # widecast/guide/*.html (published)
QA_TXT_OUT = ROOT / "qa.txt"                     # INTERNAL chatbot feed — never copied to site root
MCP_SERVER_TS = SITE_ROOT / "mcp-server" / "src" / "index.ts"
# test_cases.json lives at the project root (next to test_cases.txt).
# Single source of truth for industry example content (script + idea +
# label per case). Playground YAML references case IDs from here.
TEST_CASES_JSON = ROOT.parent.parent / "test_cases.json"

# Public API base URL (dev pilot). SDK + examples + playground default to this.
API_BASE_URL = os.environ.get("WIDECAST_API_BASE_URL", "https://widecast.ai/app/dashboard")

# Canonical public origin (scheme + host, no trailing slash). Used to emit
# absolute URLs in sitemap.xml / robots.txt. The site is served from this host.
SITE_BASE = os.environ.get("WIDECAST_SITE_BASE", "https://widecast.ai").rstrip("/")

PLAYGROUND_MARKER_RE = re.compile(r"<!--\s*widecast-playground:([a-zA-Z0-9_-]+)\s*-->")

# Pulls the SUPPORTED_FIELD_TYPES literal out of `playground.js` — that file
# is the single source of truth for which `field.type` values the runtime
# renderer can actually handle. We fail the build if any playground YAML
# declares an unsupported type — that's how we prevent "I added it to YAML
# but forgot the JS branch" drift. See HANDOFF A38 (playground UI surface).
_FIELD_TYPES_DECL_RE = re.compile(
    r"const\s+SUPPORTED_FIELD_TYPES\s*=\s*\[(?P<list>[^\]]+)\]"
)


def _load_supported_field_types() -> list[str]:
    js_path = ASSETS_SRC / "playground.js"
    text = js_path.read_text(encoding="utf-8")
    m = _FIELD_TYPES_DECL_RE.search(text)
    if not m:
        raise SystemExit(
            f"[build] FATAL: cannot find SUPPORTED_FIELD_TYPES declaration in "
            f"{js_path.relative_to(SITE_ROOT)}. The YAML↔JS field-type contract "
            f"is broken — see HANDOFF A38."
        )
    raw_items = re.findall(r'"([^"]+)"', m.group("list"))
    if not raw_items:
        raise SystemExit(
            f"[build] FATAL: SUPPORTED_FIELD_TYPES in playground.js is empty."
        )
    return raw_items


_TEST_CASES_CACHE: dict | None = None


def _load_test_cases() -> dict:
    """Load + cache test_cases.json (project-root). Returns the `cases` dict
    keyed by case_id. Fails the build with a clear message if the file is
    missing or malformed — it's the source of truth for all playground
    industry example content."""
    global _TEST_CASES_CACHE
    if _TEST_CASES_CACHE is not None:
        return _TEST_CASES_CACHE
    if not TEST_CASES_JSON.exists():
        raise SystemExit(
            f"[build] FATAL: {TEST_CASES_JSON} not found.\n"
            f"  This file is the source of truth for playground industry "
            f"examples.\n  Either restore from git or create it (see "
            f"test_cases.txt for the source content)."
        )
    try:
        data = json.loads(TEST_CASES_JSON.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise SystemExit(
            f"[build] FATAL: {TEST_CASES_JSON} is not valid JSON: {e}"
        )
    cases = data.get("cases")
    if not isinstance(cases, dict):
        raise SystemExit(
            f"[build] FATAL: {TEST_CASES_JSON} missing top-level "
            f"`cases: {{}}` object."
        )
    _TEST_CASES_CACHE = cases
    return cases


def _merge_case_into_request(case_id: str, case: dict, request_template: dict,
                             section_id: str) -> dict:
    """Combine a section's request_template with the per-case content. Maps
    the case's content field into the request field the source expects:
      source=text → request.script_text = case.script
      source=idea → request.idea_text   = case.idea
      source=blog → request.blog_text   = case.blog
    Fails if the case is missing the content field its host section needs."""
    # source → (case content field, request input field). Media URL sources
    # (A49) carry the URL in a same-named case field. File sources are NOT in
    # the interactive playground (multipart upload — use the SDK).
    _SOURCE_FIELD_MAP = {
        "text": ("script", "script_text"),
        "idea": ("idea", "idea_text"),
        "blog": ("blog", "blog_text"),
        "video_url": ("video_url", "video_url"),
        "audio_url": ("audio_url", "audio_url"),
    }
    request = dict(request_template)
    source = request.get("source", "text")
    mapping = _SOURCE_FIELD_MAP.get(source)
    if mapping is None:
        raise SystemExit(
            f"[build] FATAL: section '{section_id}' request_template.source "
            f"= {source!r} — expected one of {sorted(_SOURCE_FIELD_MAP)}."
        )
    case_field, request_field = mapping
    content = case.get(case_field)
    if not isinstance(content, str) or not content.strip():
        raise SystemExit(
            f"[build] FATAL: case '{case_id}' has no `{case_field}` field but "
            f"is referenced from source={source} section '{section_id}'. "
            f"Add a `{case_field}` field to that case in test_cases.json."
        )
    request[request_field] = content.strip()
    return request


def _expand_use_case_cases(cfg: dict, yml_path: Path) -> None:
    """For each use_case with `cases: [...]` + `request_template: {...}`,
    materialize the industries[] array from test_cases.json. Mutates cfg
    in place so downstream code (validator, aggregator, examples generator,
    inline injector) sees the same shape regardless of where content lives.

    Mutual exclusion: a use_case must have EITHER (cases + request_template),
    OR `industries: [...]` (legacy explicit), OR `request: {...}` (legacy
    single-example). Mixing is an error."""
    use_cases = cfg.get("use_cases") or []
    if not isinstance(use_cases, list):
        return
    cases_pool = None  # lazy load — only if any use_case needs it
    for uc in use_cases:
        if not isinstance(uc, dict):
            continue
        case_ids = uc.get("cases")
        request_template = uc.get("request_template")
        has_legacy_inds = isinstance(uc.get("industries"), list) and uc["industries"]
        has_legacy_req = isinstance(uc.get("request"), dict)
        wants_merge = isinstance(case_ids, list) and case_ids
        if wants_merge and (has_legacy_inds or has_legacy_req):
            raise SystemExit(
                f"[build] FATAL: use_case '{uc.get('id', '?')}' in "
                f"{yml_path.relative_to(SITE_ROOT)} mixes `cases:` with "
                f"`industries:` or `request:` — pick one shape."
            )
        if not wants_merge:
            continue
        if not isinstance(request_template, dict):
            raise SystemExit(
                f"[build] FATAL: use_case '{uc.get('id', '?')}' has `cases:` "
                f"but no `request_template:` dict."
            )
        if cases_pool is None:
            cases_pool = _load_test_cases()
        industries: list[dict] = []
        for cid in case_ids:
            if not isinstance(cid, str):
                raise SystemExit(
                    f"[build] FATAL: use_case '{uc.get('id', '?')}' cases[] "
                    f"contains non-string entry {cid!r}."
                )
            case = cases_pool.get(cid)
            if not isinstance(case, dict):
                raise SystemExit(
                    f"[build] FATAL: case '{cid}' (referenced from "
                    f"use_case '{uc.get('id', '?')}') not found in "
                    f"test_cases.json. Check the spelling or add the case."
                )
            label = case.get("label")
            if not isinstance(label, str) or not label.strip():
                raise SystemExit(
                    f"[build] FATAL: case '{cid}' missing `label` field "
                    f"(pill text). Add `label: \"emoji + name\"` to "
                    f"test_cases.json."
                )
            industries.append({
                "key": cid,
                "label": label,
                "request": _merge_case_into_request(
                    cid, case, request_template, uc.get("id", "?")
                ),
            })
        uc["industries"] = industries
        # Keep `cases` + `request_template` in the emitted JSON for debug
        # visibility (devs can see where content comes from) but downstream
        # readers should consume `industries[]` only.


def _validate_playground_yaml(cfg: dict, yml_path: Path, supported: list[str]) -> None:
    """Fail the build if any field declares an unsupported `type`, if a
    `show_when` directive references a field that doesn't exist in the form,
    or if a use_case is missing both `request` and `industries[]` (or has
    industries[] with malformed entries).

    Canaries (HANDOFF A38 + industries schema):
      • Type drift — silent text-input fallback when YAML adds an unhandled type.
      • show_when drift — visibility gate references undeclared field name.
      • use_case shape — must have EITHER `request` (legacy single-example) OR
        `industries[]` (multi-industry with pill switcher). Every industry
        entry needs `key`, `label`, and `request`.
    """
    errors: list[str] = []
    fields = cfg.get("fields") or []
    declared_names = {f.get("name") for f in fields if isinstance(f, dict)}
    for field in fields:
        if not isinstance(field, dict):
            continue
        ftype = field.get("type")
        if ftype is not None and ftype not in supported:
            errors.append(
                f"  • field '{field.get('name', '?')}' declares type={ftype!r} "
                f"but playground.js only supports {supported}."
            )
        sw = field.get("show_when")
        if sw is not None:
            if not isinstance(sw, dict):
                errors.append(
                    f"  • field '{field.get('name', '?')}' has show_when of type "
                    f"{type(sw).__name__}, expected dict {{controlling_field: value}}."
                )
            else:
                for ctrl_name in sw.keys():
                    if ctrl_name not in declared_names:
                        errors.append(
                            f"  • field '{field.get('name', '?')}' show_when "
                            f"references unknown field '{ctrl_name}' — add it "
                            f"to `fields` first."
                        )

    # use_case shape check — request vs industries[]
    for uc in (cfg.get("use_cases") or []):
        if not isinstance(uc, dict):
            continue
        uc_id = uc.get("id", "?")
        has_request = isinstance(uc.get("request"), dict)
        industries = uc.get("industries")
        has_industries = isinstance(industries, list) and len(industries) > 0
        if not has_request and not has_industries:
            errors.append(
                f"  • use_case '{uc_id}' has neither `request` nor "
                f"`industries[]`. Must define one."
            )
            continue
        if has_industries:
            seen_keys = set()
            for i, ind in enumerate(industries):
                if not isinstance(ind, dict):
                    errors.append(
                        f"  • use_case '{uc_id}' industries[{i}] is not a dict."
                    )
                    continue
                k = ind.get("key")
                if not isinstance(k, str) or not k.strip():
                    errors.append(
                        f"  • use_case '{uc_id}' industries[{i}] missing `key` "
                        f"(non-empty string)."
                    )
                elif k in seen_keys:
                    errors.append(
                        f"  • use_case '{uc_id}' industries[{i}] duplicates "
                        f"key '{k}' — must be unique within the section."
                    )
                else:
                    seen_keys.add(k)
                if not isinstance(ind.get("label"), str) or not ind["label"].strip():
                    errors.append(
                        f"  • use_case '{uc_id}' industries[{i}] missing `label`."
                    )
                if not isinstance(ind.get("request"), dict):
                    errors.append(
                        f"  • use_case '{uc_id}' industries[{i}] missing `request` dict."
                    )

        # choices[] — radio groups inside the example card (2026-05-22).
        # Each choice turns a `select` field into a radio group the dev can
        # toggle. Validate: field is declared, field has options, choice
        # options ⊆ field options, gated values ⊆ choice options.
        choices = uc.get("choices")
        if choices is not None:
            if not isinstance(choices, list):
                errors.append(
                    f"  • use_case '{uc_id}' choices must be a list."
                )
            else:
                field_options_by_name = {}
                for f in fields:
                    if isinstance(f, dict) and isinstance(f.get("options"), list):
                        field_options_by_name[f.get("name")] = {
                            str(o.get("value")) for o in f["options"]
                            if isinstance(o, dict)
                        }
                for ci, ch in enumerate(choices):
                    if not isinstance(ch, dict):
                        errors.append(f"  • use_case '{uc_id}' choices[{ci}] not a dict.")
                        continue
                    cf = ch.get("field")
                    if cf not in declared_names:
                        errors.append(
                            f"  • use_case '{uc_id}' choices[{ci}] field '{cf}' "
                            f"not declared in `fields`."
                        )
                        continue
                    if cf not in field_options_by_name:
                        errors.append(
                            f"  • use_case '{uc_id}' choices[{ci}] field '{cf}' "
                            f"is not a select field with options — radios need options."
                        )
                        continue
                    allowed = field_options_by_name[cf]
                    ch_opts = ch.get("options")
                    ch_opts = [str(o) for o in ch_opts] if isinstance(ch_opts, list) else list(allowed)
                    for o in ch_opts:
                        if o not in allowed:
                            errors.append(
                                f"  • use_case '{uc_id}' choices[{ci}] option "
                                f"'{o}' not in field '{cf}' enum {sorted(allowed)}."
                            )
                    gated = ch.get("gated") or {}
                    if not isinstance(gated, dict):
                        errors.append(
                            f"  • use_case '{uc_id}' choices[{ci}] gated must be a dict "
                            f"{{value: message}}."
                        )
                    else:
                        for gv in gated:
                            if str(gv) not in ch_opts:
                                errors.append(
                                    f"  • use_case '{uc_id}' choices[{ci}] gated value "
                                    f"'{gv}' not in this choice's options {ch_opts}."
                                )

    if errors:
        msg = (
            f"[build] FATAL: playground YAML "
            f"{yml_path.relative_to(SITE_ROOT)} has structural problems:\n"
            + "\n".join(errors)
            + "\n  → For new field types: add a `renderField` branch in "
            "widecast/docs/assets/playground.js AND extend SUPPORTED_FIELD_TYPES.\n"
            "  → For show_when: declare the controlling field in the same YAML's "
            "`fields` list.\n"
            "  → For use_cases: either set `request: {...}` OR `industries: [{key, label, request}, ...]`."
        )
        raise SystemExit(msg)


def _render_markdown(md_text: str) -> str:
    return markdown.markdown(
        md_text,
        extensions=["fenced_code", "tables", "toc", "codehilite"],
        extension_configs={"codehilite": {"css_class": "highlight", "guess_lang": False}},
    )


def _load_playground_cfg_for_inject(key: str) -> dict | None:
    """Load + expand + validate a playground YAML for in-line MD injection.
    Mirrors _build_playgrounds' pipeline so inline markers see exactly the
    same merged industries[] shape as the aggregator page."""
    yml = PLAYGROUND_SRC / f"{key}.yaml"
    if not yml.exists():
        return None
    cfg = yaml.safe_load(yml.read_text(encoding="utf-8")) or {}
    _expand_use_case_cases(cfg, yml)
    supported = _load_supported_field_types()
    _validate_playground_yaml(cfg, yml, supported)
    return cfg


def _example_section_html(yml_key: str, uc: dict) -> str:
    """One stacked example card per use_case (A41 — user direction 2026-05-20:
    'mỗi API là một section kèm example, không cần dropdown, just show and run').

    Each card is a `.wc-pg-example` mount point. playground.js fetches the
    parent YAML's JSON config, picks this `data-usecase-id` out of `use_cases`,
    and renders ONLY that example — pre-filled params (enum/boolean values
    shown as locked read-only rows; long text fields as editable textareas)
    plus Run + Copy buttons.

    Why this shape: devs don't have to click a dropdown to switch source
    or output_type — they scroll past one example for each combination."""
    uc_id = uc.get("id", "case")
    title = uc.get("title", uc_id)
    desc = uc.get("description", "")
    desc_html = f'<p class="wc-pg-example-desc">{desc}</p>' if desc else ""
    return (
        f'<section class="wc-pg-example" '
        f'data-cfg="playgrounds/{yml_key}.json" '
        f'data-usecase-id="{uc_id}" '
        f'id="ex-{yml_key}--{uc_id}">'
        f'<header class="wc-pg-example-head">'
        f'<h3 class="wc-pg-example-title">{title}</h3>'
        f'{desc_html}'
        f'</header>'
        f'<div class="wc-pg-mount">'
        f'<p class="wc-playground-loading">Loading…</p>'
        f'</div>'
        f'</section>'
    )


def _inject_playgrounds(html: str) -> str:
    """Replace <!-- widecast-playground:key --> with stacked example sections
    — one card per use_case in the referenced YAML.

    Falls back to the (now-legacy) single-form mount if the YAML has no
    use_cases (very unusual)."""
    def repl(m):
        key = m.group(1)
        cfg = _load_playground_cfg_for_inject(key)
        if not cfg:
            return (
                f'<div class="wc-pg-error">Playground not found: {key}</div>'
            )
        use_cases = cfg.get("use_cases") or []
        if not use_cases:
            return (
                f'<div class="wc-pg-error">Playground "{key}" has no use_cases — '
                f'add at least one before referencing it from MD.</div>'
            )
        # Group header so devs know which endpoint these examples belong to.
        ep = cfg.get("endpoint") or {}
        method = (ep.get("method") or "POST").upper()
        path = ep.get("path") or "/"
        header = (
            f'<div class="wc-pg-endpoint-bar">'
            f'<span class="wc-method wc-method-{method.lower()}">{method}</span>'
            f'<code class="wc-pg-endpoint-path">{path}</code>'
            f'</div>'
        )
        sections = "".join(_example_section_html(key, uc) for uc in use_cases)
        return (
            f'<div class="wc-pg-examples-group">{header}{sections}</div>'
        )
    return PLAYGROUND_MARKER_RE.sub(repl, html)


def _render_template(template: str, *, title: str, content: str,
                     description: str = "", canonical: str = "",
                     page_class: str = "", base_href: str = "./") -> str:
    return (template
            .replace("{{TITLE}}", title)
            .replace("{{DESCRIPTION}}", description)
            .replace("{{CONTENT}}", content)
            .replace("{{CANONICAL}}", canonical)
            .replace("{{PAGE_CLASS}}", page_class)
            .replace("{{BASE_HREF}}", base_href)
            .replace("{{API_BASE_URL}}", API_BASE_URL))


def _build_page(md_file: Path, template: str, out_file: Path,
                base_href: str,
                title_fallback: str | None = None,
                canonical_path: str | None = None) -> dict:
    """Build a single MD page → HTML at `out_file`.

    `base_href` should be relative (e.g. "./" for root pages, "../" for endpoints/)
    so resources resolve at any mount point."""
    md_text = md_file.read_text(encoding="utf-8")
    h1 = re.search(r"^#\s+(.+)$", md_text, re.MULTILINE)
    title = h1.group(1).strip() if h1 else (title_fallback or md_file.stem)
    desc_match = re.search(r"^#\s+.+\n+([^\n#].+)$", md_text, re.MULTILINE)
    description = desc_match.group(1).strip() if desc_match else ""

    html_body = _render_markdown(md_text)
    html_body = _inject_playgrounds(html_body)

    canonical = f"https://widecast.ai/{canonical_path or out_file.name}"
    full = _render_template(template, title=f"{title} · WideCast Docs",
                            content=html_body, description=description,
                            canonical=canonical, page_class="endpoint-page",
                            base_href=base_href)
    out_file.parent.mkdir(parents=True, exist_ok=True)
    out_file.write_text(full, encoding="utf-8")
    return {"title": title, "description": description, "href": out_file.name}


def _build_playgrounds() -> list[dict]:
    """YAML manifests → JSON config files + return list for aggregator.

    Validates the YAML↔JS field-type contract per HANDOFF A38: every
    `field.type` in any playground YAML must be in the
    `SUPPORTED_FIELD_TYPES` declared in playground.js. Build fails fast
    otherwise — catches the "added YAML, forgot the JS branch" drift
    before it ships."""
    out_dir = SITE_ROOT / "playgrounds"
    out_dir.mkdir(parents=True, exist_ok=True)
    supported = _load_supported_field_types()
    items = []
    for yml_file in sorted(PLAYGROUND_SRC.glob("*.yaml")):
        cfg = yaml.safe_load(yml_file.read_text(encoding="utf-8"))
        # Expand `cases: [...]` → `industries: [...]` by merging test_cases.json
        # content with each section's request_template (A45 dynamic-content).
        # Runs BEFORE validation so the YAML↔JS schema check sees the
        # final shape regardless of where content was authored.
        _expand_use_case_cases(cfg, yml_file)
        _validate_playground_yaml(cfg, yml_file, supported)
        cfg["_key"] = yml_file.stem
        cfg["_api_base_url"] = API_BASE_URL
        out_json = out_dir / f"{yml_file.stem}.json"
        out_json.write_text(json.dumps(cfg, indent=2, ensure_ascii=False),
                            encoding="utf-8")
        items.append({
            "key": yml_file.stem,
            "title": cfg.get("title", yml_file.stem),
            "method": cfg.get("endpoint", {}).get("method", ""),
            "path": cfg.get("endpoint", {}).get("path", ""),
            "description": cfg.get("description", ""),
            "use_cases": [uc.get("title", uc.get("id", "")) for uc in cfg.get("use_cases", [])],
        })
        print(f"  playground → {out_json.relative_to(SITE_ROOT)}")
    return items


def _build_aggregator(items: list[dict], template: str) -> None:
    """Build playground.html — STACKED EXAMPLES layout: one card per use_case
    across all endpoints, grouped by endpoint H2. Every example is fully
    visible on first paint — no dropdowns, no use-case tabs, no click-to-load.

    Per user direction 2026-05-20 evening: "tách WideCast Playground thành
    các section riêng — Script to video, Idea to video riêng, không cần
    dropdown option, tất cả pre-fill sẵn, dev chỉ nhấn Run". The page is a
    scrollable gallery — for `/v1/create_video` that's 7 examples (text/idea
    × scene/video × EN/VI variants) each as its own self-contained card.

    Lives at widecast/playground.html, base_href='./'."""
    if not items:
        return

    # Group structure: each endpoint becomes one H2 + N example cards.
    # Reload full configs so we have use_cases (the trimmed `items` only
    # carries titles for the TOC; we need the full request payloads here).
    supported = _load_supported_field_types()
    grouped: list[dict] = []
    for it in items:
        yml = PLAYGROUND_SRC / f"{it['key']}.yaml"
        cfg = yaml.safe_load(yml.read_text(encoding="utf-8")) or {}
        # Same expansion + validation pipeline as the JSON build so the
        # aggregator's grouped structure has industries[] populated.
        _expand_use_case_cases(cfg, yml)
        _validate_playground_yaml(cfg, yml, supported)
        grouped.append({
            "key": it["key"],
            "title": it["title"],
            "method": it["method"],
            "path": it["path"],
            "description": it.get("description", ""),
            "use_cases": cfg.get("use_cases") or [],
        })

    # Floating TOC — list each ENDPOINT as a top-level entry, with its
    # use cases as sub-entries (nested links).
    toc_lines = ["<nav class='wc-pg-toc' aria-label='Endpoints'><h2>Endpoints</h2><ul>"]
    for g in grouped:
        toc_lines.append(
            f"<li class='wc-pg-toc-group'>"
            f"<a href='#ep-{g['key']}'>"
            f"<span class='wc-method wc-method-{g['method'].lower()}'>{g['method']}</span>"
            f" <span class='wc-pg-title'>{g['title']}</span>"
            f"</a>"
        )
        if g["use_cases"]:
            toc_lines.append("<ul class='wc-pg-toc-sub'>")
            for uc in g["use_cases"]:
                uc_id = uc.get("id", "case")
                uc_title = uc.get("title", uc_id)
                toc_lines.append(
                    f"<li><a href='#ex-{g['key']}--{uc_id}'>{uc_title}</a></li>"
                )
            toc_lines.append("</ul>")
        toc_lines.append("</li>")
    toc_lines.append("</ul></nav>")
    toc_html = "".join(toc_lines)

    # Stacked example cards — grouped by endpoint header.
    sections_html_parts: list[str] = []
    total_examples = 0
    for g in grouped:
        sections_html_parts.append(
            f"<section class='wc-pg-endpoint' id='ep-{g['key']}'>"
            f"<header class='wc-pg-endpoint-head'>"
            f"<span class='wc-method wc-method-{g['method'].lower()}'>{g['method']}</span>"
            f"<code class='wc-pg-endpoint-path'>{g['path']}</code>"
            f"<h2 class='wc-pg-endpoint-title'>{g['title']}</h2>"
            f"</header>"
        )
        if g["description"]:
            sections_html_parts.append(
                f"<p class='wc-pg-endpoint-desc'>{g['description']}</p>"
            )
        for uc in g["use_cases"]:
            sections_html_parts.append(_example_section_html(g["key"], uc))
            total_examples += 1
        sections_html_parts.append("</section>")
    sections_html = "".join(sections_html_parts)

    body = f"""
<header class="wc-pg-page-head">
  <h1>WideCast Playground</h1>
  <p class="wc-pg-page-sub">Every API, every variant, one scrolling page.
  Each card is a working example — params pre-filled, just hit Run or copy
  the code in your language.</p>
</header>
<div class="wc-pg-app wc-pg-stacked">
  {toc_html}
  <main class="wc-pg-stack">
    {sections_html}
  </main>
</div>
"""
    html = _render_template(template, title="Playground · WideCast",
                            content=body,
                            description="Every WideCast API as a pre-filled, runnable example.",
                            canonical="https://widecast.ai/playground.html",
                            page_class="playground-page",
                            base_href="./")
    (SITE_ROOT / "playground.html").write_text(html, encoding="utf-8")
    print(f"  aggregator (stacked) → {(SITE_ROOT / 'playground.html').relative_to(SITE_ROOT)} "
          f"({len(grouped)} endpoints, {total_examples} example cards)")


def _generate_examples() -> None:
    """For each playground YAML → 3 code files per use_case (Python, TS, cURL)."""
    py_dir = EXAMPLES_ROOT / "python"
    ts_dir = EXAMPLES_ROOT / "typescript"
    sh_dir = EXAMPLES_ROOT / "curl"
    for d in (py_dir, ts_dir, sh_dir):
        d.mkdir(parents=True, exist_ok=True)

    def _emit(yml_file_name: str, key: str, spec_id: str, body: dict,
              spec_title: str, sdk_method: str, method: str, path: str) -> None:
        """Write Python + TS + cURL examples for ONE (use_case × industry)
        combination. Filename = `<playground_key>__<spec_id>.<ext>`."""
        body_json = json.dumps(body, indent=2, ensure_ascii=False)
        body_py = pprint.pformat(body, indent=2, width=88, sort_dicts=False)

        py = f'''"""
{spec_title}

Auto-generated from widecast/docs/playgrounds/{yml_file_name}.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="{API_BASE_URL}")

resp = client.{sdk_method}(**{body_py})
print(resp)
'''
        (py_dir / f"{key}__{spec_id}.py").write_text(py, encoding="utf-8")

        ts = f'''/**
 * {spec_title}
 *
 * Auto-generated from widecast/docs/playgrounds/{yml_file_name}.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({{ apiKey: "wc_live_REPLACE_ME", baseUrl: "{API_BASE_URL}" }});

const resp = await client.{sdk_method}({body_json});
console.log(resp);
'''
        (ts_dir / f"{key}__{spec_id}.ts").write_text(ts, encoding="utf-8")

        sh = f'''#!/usr/bin/env bash
# {spec_title}
# Auto-generated from widecast/docs/playgrounds/{yml_file_name}.

curl -X {method} "{API_BASE_URL}{path}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer wc_live_REPLACE_ME" \\
  -d '{json.dumps(body, ensure_ascii=False)}'
'''
        sh_path = sh_dir / f"{key}__{spec_id}.sh"
        sh_path.write_text(sh, encoding="utf-8")
        os.chmod(sh_path, 0o755)

    for yml_file in sorted(PLAYGROUND_SRC.glob("*.yaml")):
        cfg = yaml.safe_load(yml_file.read_text(encoding="utf-8"))
        # Expand cases → industries so example generator sees merged data.
        _expand_use_case_cases(cfg, yml_file)
        method = cfg.get("endpoint", {}).get("method", "POST").upper()
        path = cfg.get("endpoint", {}).get("path", "/")
        sdk_method = _sdk_method_name(cfg)
        key = yml_file.stem
        total_emitted = 0
        for uc in cfg.get("use_cases", []):
            uc_id = uc.get("id", "case")
            uc_title = uc.get("title", uc_id)
            # Multi-industry use_case → one example file per industry. Legacy
            # single-request use_case → one example file per use_case.
            industries = uc.get("industries")
            if isinstance(industries, list) and industries:
                for ind in industries:
                    if not isinstance(ind, dict):
                        continue
                    spec_id = f"{uc_id}__{ind.get('key', 'industry')}"
                    spec_title = f"{uc_title} — {ind.get('label', ind.get('key', ''))}"
                    _emit(yml_file.name, key, spec_id, ind["request"],
                          spec_title, sdk_method, method, path)
                    total_emitted += 1
            elif isinstance(uc.get("request"), dict):
                _emit(yml_file.name, key, uc_id, uc["request"],
                      uc_title, sdk_method, method, path)
                total_emitted += 1
        print(f"  examples → {key}: {total_emitted} examples × 3 languages")


def _sdk_method_name(cfg: dict) -> str:
    """Map endpoint to SDK method name. Locked convention."""
    path = cfg.get("endpoint", {}).get("path", "")
    if path == "/v1/create_video":
        return "create_video"
    if path.startswith("/v1/status"):
        return "get_status"
    return path.strip("/").replace("/", "_").replace("-", "_")


def _copy_assets() -> None:
    if not ASSETS_SRC.exists():
        return
    dst = SITE_ROOT / "assets"
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(ASSETS_SRC, dst)
    # Inject Pygments CSS for code blocks
    (dst / "pygments.css").write_text(HtmlFormatter(style="default").get_style_defs(".highlight"),
                                       encoding="utf-8")
    # Generate widecast-config.js — single source of truth for the API base URL.
    # Every served page loads <script src="assets/widecast-config.js"> instead
    # of inline-setting window.WIDECAST_API_BASE_URL. To change at runtime,
    # edit this file on the deployed server (no rebuild needed). To change at
    # build time, set WIDECAST_API_BASE_URL env and re-run this script.
    (dst / "widecast-config.js").write_text(
        f"""// WideCast API base URL — single source of truth.
//
// All client-side pages (docs.html, playground.html, endpoints/*.html,
// webhook-test.html) load this file via <script src="assets/widecast-config.js">.
// Edit the URL here to redirect every page at once — no rebuild required.
//
// At build time, docs/build.py regenerates this file from the
// WIDECAST_API_BASE_URL env var (defaults to https://widecast.ai/app/dashboard).
window.WIDECAST_API_BASE_URL = {json.dumps(API_BASE_URL)};
""",
        encoding="utf-8",
    )
    print(f"  assets → {dst.relative_to(SITE_ROOT)}/")


def _write_skill_load_manifest(folder) -> None:
    """Generate <folder>/LOAD_MANIFEST.md: the full-load reference / canary for a
    skill. For every .md module it records line count + exact last non-empty line
    (the natural canary — you can only quote it after reading to EOF) + sha256.
    A loading agent's LOAD LEDGER cross-checks against this: a mismatch means the
    module was returned truncated ("output too large") or stale = NOT loaded.
    Regenerated every build, so adding a new module needs no manual step. Excludes
    itself. Code-free canary: no token is injected into the module files."""
    import hashlib
    rows = []
    for f in sorted(folder.rglob("*.md")):
        if f.name == "LOAD_MANIFEST.md":
            continue
        try:
            text = f.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue
        line_count = len(text.splitlines())
        last = ""
        for ln in text.splitlines():
            if ln.strip():
                last = ln
        last = last.replace("|", "\\|")
        sha = hashlib.sha256(f.read_bytes()).hexdigest()
        rel = f.relative_to(folder).as_posix()
        rows.append(f"| {rel} | {line_count} | {sha} | {last} |")
    lines = [
        "# LOAD_MANIFEST — full-load reference (canary) for this skill",
        "",
        "Auto-generated by build.py on every deploy. Do not edit by hand.",
        "After loading any module below, its actual LINE COUNT must match its row here "
        "(see the LOAD LEDGER in SKILL.md / ai_video_editor/03_dod_gates). A shortfall = "
        "truncated = NOT loaded; re-read to EOF before acting. last_line + sha256 are "
        "OPTIONAL deeper checks (staleness/integrity), not required every load.",
        "",
        "| module | lines | sha256 | last_line |",
        "|---|---|---|---|",
        *rows,
        "",
    ]
    (folder / "LOAD_MANIFEST.md").write_text("\n".join(lines), encoding="utf-8")


def _zip_skills() -> None:
    """Bundle each Skill folder into a downloadable .zip so non-tech users can
    grab it with one click (Claude 'upload Skill'). Output: skills/<name>.zip
    (archive contains the <name>/ folder + its files), served at
    https://origin.widecast.ai/skills/<name>.zip. Regenerated every build so it tracks
    SKILL.md edits. Each folder also gets a fresh LOAD_MANIFEST.md (full-load
    canary) written before zipping, so it ships inside the archive."""
    import zipfile
    skills_dir = SITE_ROOT / "skills"
    if not skills_dir.exists():
        return
    for folder in sorted(p for p in skills_dir.iterdir() if p.is_dir()):
        zip_path = skills_dir / f"{folder.name}.zip"
        try:
            _write_skill_load_manifest(folder)
            with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
                for f in sorted(folder.rglob("*")):
                    if f.is_file() and f.suffix.lower() in (".md", ".txt", ".json", ".yaml", ".yml"):
                        zf.write(f, arcname=f"{folder.name}/{f.relative_to(folder)}")
            print(f"  skill zip → skills/{folder.name}.zip (+ LOAD_MANIFEST.md)")
        except Exception as e:
            print(f"  skill zip FAILED {folder.name}: {e}")


def _chatgpt_actions_spec(spec: dict) -> dict:
    """Derive a ChatGPT 'GPT Actions' flavored OpenAPI from the canonical spec.

    ChatGPT's GPT-Actions importer is stricter than general OpenAPI:
      - each operation `description` must be <= 300 chars (else the whole op is
        dropped — that's why createVideo disappeared in the user's import),
      - it does NOT dereference `$ref` parameters (it sees no `name` and skips
        them, which compounded the createVideo failure),
      - it accepts exactly ONE server (it warns + drops the extras otherwise),
      - free-form `{type: object}` response schemas trip "missing properties".

    So we DERIVE this variant at build time (never hand-maintained) → it can't
    drift from openapi.yaml. The canonical openapi.json stays rich (it feeds the
    docs, the SDK reference, and any HTTP/MCP caller). ChatGPT's deep authoring
    context comes from the GPT *Instructions* (delivered by the Action
    `getWritingSkill`, which streams the matching `skills/<format>-writing/
    SKILL.md` on demand by `format` parameter), not from these short Action
    labels, so collapsing description→summary is safe."""
    a = json.loads(json.dumps(spec))  # deep copy
    # 1) exactly one server (ChatGPT keeps only the first)
    if isinstance(a.get("servers"), list) and a["servers"]:
        a["servers"] = [a["servers"][0]]
    comp_params = (a.get("components") or {}).get("parameters") or {}
    methods = ("get", "post", "put", "patch", "delete", "options", "head")

    def _cap(text: str) -> str:
        return text if len(text) <= 300 else text[:299] + "…"

    for path in list(a.get("paths", {}).keys()):
        ops = a["paths"][path]
        # 2) drop the self-referential spec paths (/openapi.json, /openapi.yaml):
        #    their `{type: object}`/`{type: string}` responses trip the importer.
        if any(isinstance(ops.get(m), dict) and "Spec" in (ops[m].get("tags") or [])
               for m in methods):
            del a["paths"][path]
            continue
        for m in methods:
            op = ops.get(m)
            if not isinstance(op, dict):
                continue
            # 3) description = the short summary (<=300). Every op has a summary
            #    (longest ~60 chars); fall back to a truncated description.
            summ = op.get("summary")
            if summ:
                op["description"] = _cap(summ)
            elif isinstance(op.get("description"), str):
                op["description"] = _cap(op["description"])
            # 4) inline $ref parameters so each carries a real string `name`
            params = op.get("parameters")
            if isinstance(params, list):
                inlined = []
                for p in params:
                    if isinstance(p, dict) and "$ref" in p:
                        key = p["$ref"].rsplit("/", 1)[-1]
                        resolved = comp_params.get(key)
                        if resolved:
                            resolved = json.loads(json.dumps(resolved))
                            if isinstance(resolved.get("description"), str):
                                resolved["description"] = _cap(resolved["description"])
                            inlined.append(resolved)
                        # unresolved ref -> drop the bad parameter entirely
                    else:
                        inlined.append(p)
                op["parameters"] = inlined
    # components.parameters are now inlined everywhere -> drop to avoid a dangling
    # ref the importer might still scan. (securitySchemes/schemas stay intact.)
    if isinstance(a.get("components"), dict):
        a["components"].pop("parameters", None)
    return a


def _check_llms_parity() -> None:
    """Guard: docs/llms.txt is a hand-maintained doc surface that mirrors the
    OpenAPI spec for AIs that fetch /llms.txt to learn how to call the API
    (with or without an MCP server). Fail the build if it drifts from the
    locked `source`/`output_type` enums, the three /v1/ paths, the status enum,
    or the word bounds — same philosophy as the playground field-type drift
    guard (HANDOFF A38; 'verify behavior, not artifacts')."""
    if not LLMS_TXT.exists():
        return
    text = LLMS_TXT.read_text(encoding="utf-8")
    try:
        spec = yaml.safe_load(OPENAPI_SRC.read_text(encoding="utf-8"))
        props = spec["components"]["schemas"]["CreateVideoRequest"]["properties"]
        source_enum = list(props["source"]["enum"])
        output_enum = list(props["output_type"]["enum"])
    except Exception as e:
        raise SystemExit(
            f"[build] FATAL: cannot read source/output_type enums from "
            f"{OPENAPI_SRC.name} to check llms.txt parity: {e}"
        )
    missing: list[str] = []
    # enum values must appear as backticked tokens, so we don't match prose
    for val in source_enum + output_enum:
        if f"`{val}`" not in text:
            missing.append(f"enum `{val}`")
    for path in ("/v1/create_video", "/v1/status/", "/v1/export_video"):
        if path not in text:
            missing.append(f"path {path}")
    for st in ("pending", "processing", "completed", "failed"):
        if st not in text:
            missing.append(f"status '{st}'")
    for bound in ("80", "500", "1000", "3000"):
        if bound not in text:
            missing.append(f"word-bound {bound}")
    if missing:
        raise SystemExit(
            "[build] FATAL: docs/llms.txt is out of sync with the OpenAPI spec.\n"
            "  Missing tokens: " + ", ".join(missing) + "\n"
            "  llms.txt is the /llms.txt surface AIs read to call the API — keep\n"
            "  it in step with openapi/openapi.yaml (source + output_type enums,\n"
            "  the three /v1/ paths, the status enum, the word bounds). HANDOFF A38."
        )


# ─── User guide (docs/guide/*.md → guide/*.html + docs/qa.txt) ──────────
#
# One topic file = ONE user-facing feature: guide prose + a `## Q&A` section.
# The prose becomes widecast/guide/<slug>.html (same template as the rest of
# the docs site); every Q/A pair is extracted into docs/qa.txt — the single
# INTERNAL knowledge file for the livechatwith.us support chatbot. The owner
# pastes it into the livechat admin custom-Q&A screen by hand (numbered
# "N. Q:"/"N. A:" format, required by that screen's parser — dashboard2.py
# parseQA). qa.txt stays out of the site root.
#
# Drift guards (same philosophy as A38 / _check_llms_parity):
#   • coverage forward:  every public API op + MCP tool + ui_surface must be
#     `covers:`-ed by ≥1 topic, or listed in _guide.yml coverage_exceptions.
#     (Warn-only while _guide.yml enforce_full_coverage is false.)
#   • coverage backward: every `covers:` entry must still exist in the
#     universe — catches renamed/removed features leaving stale docs. FATAL.
#   • Q/A grammar: strict `Q:` / `A:` pairs (blank-line separated) so the
#     chatbot ES pusher parses the file deterministically. FATAL.
#   • output hygiene: guide pages + qa.txt are end-user surfaces — internal
#     terms (remotion / gubo.ai / vendor names), Vietnamese diacritics, and
#     em-dashes fail the build.

_FRONTMATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.DOTALL)
_QA_HEADING_RE = re.compile(r"^##\s+Q&A\s*$", re.MULTILINE)
_COVERS_PREFIXES = ("api:", "mcp:", "ui:")
_GUIDE_BANNED_TERMS = ("remotion", "gubo.ai", "heygen")
_VIET_DIACRITICS_RE = re.compile(
    "[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]",
    re.IGNORECASE,
)


def _load_guide_meta() -> dict:
    if not GUIDE_META_FILE.exists():
        raise SystemExit(
            f"[build] FATAL: {GUIDE_META_FILE.relative_to(SITE_ROOT)} is missing — "
            f"it defines guide groups, the ui_surfaces universe, and coverage exceptions."
        )
    try:
        meta = yaml.safe_load(GUIDE_META_FILE.read_text(encoding="utf-8")) or {}
    except yaml.YAMLError as e:
        raise SystemExit(f"[build] FATAL: _guide.yml is invalid YAML: {e}")
    groups = meta.get("groups")
    if (not isinstance(groups, list) or not groups
            or not all(isinstance(g, dict) and g.get("key") and g.get("title") for g in groups)):
        raise SystemExit("[build] FATAL: _guide.yml needs `groups: [{key, title}, ...]`.")
    if not isinstance(meta.get("ui_surfaces"), dict) or not meta["ui_surfaces"]:
        raise SystemExit("[build] FATAL: _guide.yml needs a non-empty `ui_surfaces: {key: description}` map.")
    exc = meta.get("coverage_exceptions") or {}
    if not isinstance(exc, dict) or not all(isinstance(v, str) and v.strip() for v in exc.values()):
        raise SystemExit("[build] FATAL: _guide.yml coverage_exceptions must map item → non-empty reason.")
    meta["coverage_exceptions"] = exc
    return meta


def _parse_qa_pairs(text: str, where: str) -> list[dict]:
    """Strict grammar for the chatbot feed (docs/qa.txt):
         Q: one line
         A: the answer — may wrap onto following non-blank lines
       A blank line ends the pair. Anything else is a build error — the ES
       pusher and the chatbot rely on this file parsing deterministically.
       Wrapped answer lines are collapsed to one line on output, so every
       emitted pair is exactly `Q: ...\\nA: ...`."""
    pairs: list[dict] = []
    errors: list[str] = []
    q: str | None = None
    a_lines: list[str] = []
    state = "idle"  # idle | want_a | in_a
    last_line_no = 0

    def _close(line_no: int) -> None:
        nonlocal q, a_lines, state
        answer = " ".join(a_lines).strip()
        if not answer:
            errors.append(f"line {line_no}: empty answer for Q {q!r}")
        else:
            pairs.append({"q": q, "a": answer})
        q, a_lines, state = None, [], "idle"

    for i, raw_line in enumerate(text.splitlines(), 1):
        last_line_no = i
        line = raw_line.strip()
        if not line:
            if state == "in_a":
                _close(i)
            elif state == "want_a":
                errors.append(f"line {i}: Q without an A: {q!r}")
                q, state = None, "idle"
            continue
        if line.startswith("Q:"):
            if state == "in_a":
                _close(i)
            elif state == "want_a":
                errors.append(f"line {i}: two Q lines in a row (missing A for {q!r})")
            q = line[2:].strip()
            state = "want_a"
            if not q:
                errors.append(f"line {i}: empty question")
        elif line.startswith("A:"):
            if state == "want_a":
                a_lines = [line[2:].strip()]
                state = "in_a"
            elif state == "in_a":
                errors.append(f"line {i}: A line without a new Q above it")
            else:
                errors.append(f"line {i}: A line without any Q")
        else:
            if state == "in_a":
                a_lines.append(line)
            else:
                errors.append(f"line {i}: stray text outside a Q/A pair: {line[:60]!r}")
    if state == "in_a":
        _close(last_line_no + 1)
    elif state == "want_a":
        errors.append(f"end of section: Q without an A: {q!r}")
    if not errors and not pairs:
        errors.append("`## Q&A` section contains no pairs")
    if errors:
        raise SystemExit(
            f"[build] FATAL: bad Q&A section in {where}:\n"
            + "\n".join(f"  • {e}" for e in errors)
        )
    return pairs


def _parse_guide_topic(md_file: Path) -> dict:
    rel = md_file.relative_to(SITE_ROOT)
    raw = md_file.read_text(encoding="utf-8")
    fm = _FRONTMATTER_RE.match(raw)
    if not fm:
        raise SystemExit(f"[build] FATAL: {rel} is missing its `---` frontmatter block.")
    try:
        meta = yaml.safe_load(fm.group(1)) or {}
    except yaml.YAMLError as e:
        raise SystemExit(f"[build] FATAL: {rel} frontmatter is invalid YAML: {e}")
    problems: list[str] = []
    for key in ("slug", "title", "group", "summary", "updated", "covers"):
        if not meta.get(key):
            problems.append(f"missing frontmatter field `{key}`")
    slug = str(meta.get("slug", ""))
    if slug and slug != md_file.stem:
        problems.append(
            f"slug {slug!r} ≠ filename {md_file.stem!r} — the slug is the permanent URL; they must match"
        )
    covers = meta.get("covers") or []
    if not isinstance(covers, list) or not covers:
        problems.append("`covers` must be a non-empty list")
    else:
        for c in covers:
            if not isinstance(c, str) or not c.startswith(_COVERS_PREFIXES):
                problems.append(f"covers entry {c!r} must start with one of {_COVERS_PREFIXES}")
    body = raw[fm.end():]
    qa_m = _QA_HEADING_RE.search(body)
    if not qa_m:
        problems.append("missing `## Q&A` section — every topic ships chatbot Q&A")
    if problems:
        raise SystemExit(f"[build] FATAL: {rel}:\n" + "\n".join(f"  • {p}" for p in problems))
    prose = body[: qa_m.start()].strip()
    qa_text = body[qa_m.end():]
    prose_no_code = re.sub(r"```.*?```", "", prose, flags=re.DOTALL)
    if re.search(r"^#\s", prose_no_code, re.MULTILINE):
        raise SystemExit(
            f"[build] FATAL: {rel}: prose contains an H1 — the page H1 comes from "
            f"frontmatter `title`; start sections at `##`."
        )
    return {
        "slug": md_file.stem,
        "title": str(meta["title"]),
        "group": str(meta["group"]),
        "summary": str(meta["summary"]),
        "updated": str(meta["updated"]),
        "order": int(meta.get("order", 999)),
        "covers": [str(c) for c in covers],
        "prose": prose,
        "pairs": _parse_qa_pairs(qa_text, str(rel)),
        "rel": str(rel),
    }


def _guide_universe(meta: dict) -> set[str]:
    """api:* from openapi.yaml, mcp:* from mcp-server/src/index.ts, ui:* from
    _guide.yml — the three-legged feature universe the guide must cover."""
    universe: set[str] = set()
    try:
        spec = yaml.safe_load(OPENAPI_SRC.read_text(encoding="utf-8"))
        for path, ops in (spec.get("paths") or {}).items():
            for m in ("get", "post", "put", "patch", "delete"):
                if isinstance(ops.get(m), dict):
                    universe.add(f"api:{m.upper()} {path}")
    except Exception as e:
        raise SystemExit(f"[build] FATAL: cannot read {OPENAPI_SRC.name} for guide coverage: {e}")
    try:
        ts = MCP_SERVER_TS.read_text(encoding="utf-8")
    except OSError as e:
        raise SystemExit(f"[build] FATAL: cannot read {MCP_SERVER_TS} for guide coverage: {e}")
    names = set(re.findall(r'name:\s*"(widecast_[a-z0-9_]+)"', ts))
    if not names:
        raise SystemExit(
            "[build] FATAL: no widecast_* tool names found in mcp-server/src/index.ts — "
            "did the declaration style change? Update the regex in _guide_universe()."
        )
    universe |= {f"mcp:{n}" for n in names}
    universe |= {f"ui:{k}" for k in meta["ui_surfaces"]}
    return universe


def _check_guide_coverage(topics: list[dict], meta: dict) -> None:
    universe = _guide_universe(meta)
    covered: dict[str, list[str]] = {}
    for t in topics:
        for c in t["covers"]:
            covered.setdefault(c, []).append(t["slug"])
    exceptions = meta["coverage_exceptions"]

    fatal: list[str] = []
    for c, slugs in sorted(covered.items()):
        if c not in universe:
            fatal.append(
                f"covers entry {c!r} (in {', '.join(slugs)}) matches nothing in the "
                f"universe — feature renamed or removed? Fix the topic or _guide.yml."
            )
    for exc_item in sorted(exceptions):
        if exc_item not in universe:
            fatal.append(f"coverage_exceptions entry {exc_item!r} matches nothing — stale, remove it.")
        elif exc_item in covered:
            print(f"  ⚠ guide: {exc_item} is both excepted and covered by {covered[exc_item]} — drop the exception.")

    missing = sorted(universe - set(covered) - set(exceptions))
    if missing:
        header = (f"guide coverage: {len(missing)} universe item(s) have no topic "
                  f"(add a `covers:` entry in a topic, or an exception in _guide.yml):")
        if meta.get("enforce_full_coverage"):
            fatal.append(header + "\n" + "\n".join(f"      - {mi}" for mi in missing))
        else:
            print(f"  ⚠ {header}")
            for mi in missing:
                print(f"      - {mi}")
            print("    (warn-only: _guide.yml enforce_full_coverage is false until the full topic set ships)")

    if fatal:
        raise SystemExit("[build] FATAL: guide coverage check failed:\n" + "\n".join(f"  • {f}" for f in fatal))
    print(f"  coverage: {len(universe)} universe items · {len(covered)} covered · "
          f"{len(exceptions)} excepted · {len(missing)} pending")


def _check_guide_output_hygiene() -> None:
    """Guide pages + qa.txt are end-user surfaces: no internal/vendor terms
    (public naming is overlay.*/scene.*, never 'remotion'), English only
    (no Vietnamese diacritics), and no em-dashes (house style)."""
    problems: list[str] = []
    targets = sorted(GUIDE_OUT.glob("*.html"))
    if QA_TXT_OUT.exists():
        targets.append(QA_TXT_OUT)
    for f in targets:
        text = f.read_text(encoding="utf-8")
        if f.suffix == ".html":
            # HTML comments come from the shared template shell and are not
            # user-visible — exclude them so only real content is policed.
            text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
        low = text.lower()
        rel = f.relative_to(SITE_ROOT.parent)
        for term in _GUIDE_BANNED_TERMS:
            n = low.count(term)
            if n:
                problems.append(f"{rel}: banned term {term!r} ×{n}")
        m = _VIET_DIACRITICS_RE.search(text)
        if m:
            problems.append(f"{rel}: Vietnamese diacritics ({m.group(0)!r}) — guide/QA are English-only")
        if "—" in text:
            problems.append(f"{rel}: em-dash found — use a period, comma, or colon instead")
    if problems:
        raise SystemExit("[build] FATAL: guide output hygiene:\n" + "\n".join(f"  • {p}" for p in problems))


def _build_guide(template: str) -> None:
    if not GUIDE_SRC.exists():
        print("  (no docs/guide/ folder — skipping user guide)")
        return
    meta = _load_guide_meta()
    topics = [_parse_guide_topic(p) for p in sorted(GUIDE_SRC.glob("*.md"))]
    if not topics:
        print("  (docs/guide/ has no topic .md files yet)")
        return
    gidx = {g["key"]: i for i, g in enumerate(meta["groups"])}
    bad_groups = [f"{t['rel']}: unknown group {t['group']!r} (add it to _guide.yml groups)"
                  for t in topics if t["group"] not in gidx]
    if bad_groups:
        raise SystemExit("[build] FATAL:\n" + "\n".join(f"  • {b}" for b in bad_groups))
    topics.sort(key=lambda t: (gidx[t["group"]], t["order"], t["slug"]))

    # The chatbot must have exactly ONE answer per question intent.
    seen_q: dict[str, str] = {}
    dups: list[str] = []
    for t in topics:
        for p in t["pairs"]:
            norm = re.sub(r"\s+", " ", p["q"].strip().rstrip("?").lower())
            if norm in seen_q:
                dups.append(f"{p['q']!r} appears in both {seen_q[norm]} and {t['slug']}")
            else:
                seen_q[norm] = t["slug"]
    if dups:
        raise SystemExit("[build] FATAL: duplicate questions across topics:\n"
                         + "\n".join(f"  • {d}" for d in dups))

    # Pages carry base_href="../" so relative links resolve against the SITE
    # ROOT: a sibling-topic link must be written `guide/<slug>.html`, never
    # bare `<slug>.html` (that would resolve to the root and 404).
    slugs = {t["slug"] for t in topics}
    bad_links: list[str] = []
    for t in topics:
        for target in re.findall(r"\]\(([a-z0-9-]+\.html)[)#]", t["prose"] + " "):
            if target[:-5] in slugs:
                bad_links.append(f"{t['rel']}: link ({target}) must be (guide/{target})")
    if bad_links:
        raise SystemExit("[build] FATAL: guide cross-links must be prefixed with guide/ "
                         "(pages use base_href='../'):\n" + "\n".join(f"  • {b}" for b in bad_links))

    GUIDE_OUT.mkdir(parents=True, exist_ok=True)
    total_pairs = 0
    for t in topics:
        qa_md = "\n\n## Common questions\n\n" + "\n\n".join(
            f"**{p['q']}**\n\n{p['a']}" for p in t["pairs"]
        )
        page_md = f"# {t['title']}\n\n{t['prose']}{qa_md}"
        html_body = _render_markdown(page_md)
        crumb = '<p class="wc-guide-crumb"><a href="guide/index.html">‹ User Guide</a></p>'
        full = _render_template(
            template,
            title=f"{t['title']} · WideCast Guide",
            content=crumb + html_body,
            description=t["summary"],
            canonical=f"https://widecast.ai/guide/{t['slug']}.html",
            page_class="endpoint-page guide-page",
            base_href="../",
        )
        (GUIDE_OUT / f"{t['slug']}.html").write_text(full, encoding="utf-8")
        total_pairs += len(t["pairs"])
        print(f"  guide → guide/{t['slug']}.html ({len(t['pairs'])} Q&A)")

    # index.html — grouped topic list
    parts = [
        "<h1>WideCast User Guide</h1>",
        '<p class="wc-guide-intro">Step-by-step guides for the WideCast studio: '
        'creating videos and posts, editing scenes, working with clients, and '
        'publishing everywhere. No code required. Building on the API instead? '
        'See the <a href="docs.html">developer docs</a>.</p>',
    ]
    for g in meta["groups"]:
        in_group = [t for t in topics if t["group"] == g["key"]]
        if not in_group:
            continue
        parts.append(f'<section class="wc-guide-group"><h2>{g["title"]}</h2><ul class="wc-guide-list">')
        for t in in_group:
            parts.append(
                f'<li><a href="guide/{t["slug"]}.html">{t["title"]}</a>'
                f'<span class="wc-guide-sum">{t["summary"]}</span></li>'
            )
        parts.append("</ul></section>")
    index_html = _render_template(
        template,
        title="User Guide · WideCast",
        content="\n".join(parts),
        description="Step-by-step WideCast guides: create, edit, share, and publish videos, blogs, and social posts.",
        canonical="https://widecast.ai/guide/index.html",
        page_class="endpoint-page guide-page",
        base_href="../",
    )
    (GUIDE_OUT / "index.html").write_text(index_html, encoding="utf-8")
    print(f"  guide index → guide/index.html ({len(topics)} topics, {total_pairs} Q&A pairs)")

    # Renamed/removed topics leave old HTML behind — surface them, never delete.
    expected = {f"{t['slug']}.html" for t in topics} | {"index.html"}
    strays = sorted(p.name for p in GUIDE_OUT.glob("*.html") if p.name not in expected)
    if strays:
        print(f"  ⚠ stale files in guide/ with no matching topic .md (delete manually): {', '.join(strays)}")

    # qa.txt — the single internal chatbot Q&A bank. NUMBERED format
    # ("N. Q:" / "N. A:", blank line between pairs) because the owner pastes
    # it by hand into the livechatwith.us admin custom-Q&A screen, whose
    # parser (dashboard2.py parseQA) requires the digit prefix. Nothing else
    # in the file (no headers/comments). NOT copied to the site root.
    qa_entries = []
    n = 0
    for t in topics:
        for p in t["pairs"]:
            n += 1
            qa_entries.append(f"{n}. Q: {p['q']}\n{n}. A: {p['a']}\n")
    QA_TXT_OUT.write_text("\n".join(qa_entries), encoding="utf-8")
    print(f"  qa.txt (chatbot Q&A bank — paste into livechat admin UI) → docs/qa.txt ({total_pairs} pairs)")

    _check_guide_coverage(topics, meta)
    _check_guide_output_hygiene()


def _write_sitemap_robots() -> None:
    """Emit a sitemap.xml of canonical public pages + a robots.txt that points
    to it. Self-maintaining: the page list is derived from files that actually
    exist in SITE_ROOT after the build (curated roots + every endpoints/*.html),
    so it can't drift from what we ship. Goal: agent/search discovery — see the
    isitagentready.com audit (sitemap + robots).

    Served as plain static files at https://widecast.ai/sitemap.xml and
    /robots.txt (nginx serves .xml/.txt with correct content-type, like
    llms.txt). Remember to add both to deploy_widecast.sh ROOT_FILES and to
    PURGE Cloudflare after a content change (CF caches by extension)."""
    from datetime import date, datetime, timezone

    # Curated top-level pages (homepage + docs/playground + the per-AI guides).
    # Internal/dev pages (webhook-test, palette-explorer, new_index1) are
    # intentionally excluded. Homepage is widecast.html but its canonical URL
    # is the bare origin "/" (webserver default document).
    curated = [
        ("", "widecast.html", "weekly", "1.0"),
        ("docs.html", "docs.html", "weekly", "0.9"),
        ("playground.html", "playground.html", "monthly", "0.7"),
        ("claude.html", "claude.html", "monthly", "0.6"),
        ("chatgpt.html", "chatgpt.html", "monthly", "0.6"),
        ("gemini.html", "gemini.html", "monthly", "0.6"),
        ("grok.html", "grok.html", "monthly", "0.6"),
        ("antigravity.html", "antigravity.html", "monthly", "0.6"),
    ]

    def _lastmod(rel_file: str) -> str:
        p = SITE_ROOT / rel_file
        try:
            return datetime.fromtimestamp(p.stat().st_mtime, timezone.utc).date().isoformat()
        except OSError:
            return date.today().isoformat()

    urls: list[tuple[str, str, str, str]] = []  # (loc_path, lastmod, changefreq, priority)
    for loc_path, src_file, freq, prio in curated:
        if (SITE_ROOT / src_file).exists():
            urls.append((loc_path, _lastmod(src_file), freq, prio))

    # Every built endpoint reference page.
    endpoints_dir = SITE_ROOT / "endpoints"
    if endpoints_dir.exists():
        for html in sorted(endpoints_dir.glob("*.html")):
            rel = f"endpoints/{html.name}"
            urls.append((rel, _lastmod(rel), "monthly", "0.5"))

    # Every built user-guide page (index ranks above individual topics).
    guide_dir = SITE_ROOT / "guide"
    if guide_dir.exists():
        for html in sorted(guide_dir.glob("*.html")):
            rel = f"guide/{html.name}"
            prio = "0.7" if html.name == "index.html" else "0.5"
            urls.append((rel, _lastmod(rel), "monthly", prio))

    def _xml_escape(s: str) -> str:
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc_path, lastmod, freq, prio in urls:
        loc = f"{SITE_BASE}/{loc_path}" if loc_path else f"{SITE_BASE}/"
        lines += ["  <url>",
                  f"    <loc>{_xml_escape(loc)}</loc>",
                  f"    <lastmod>{lastmod}</lastmod>",
                  f"    <changefreq>{freq}</changefreq>",
                  f"    <priority>{prio}</priority>",
                  "  </url>"]
    lines.append("</urlset>")
    (SITE_ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")

    robots = (
        "# robots.txt — WideCast (https://widecast.ai)\n"
        "# All crawlers and AI agents welcome.\n"
        "User-agent: *\n"
        "Allow: /\n"
        "\n"
        f"Sitemap: {SITE_BASE}/sitemap.xml\n"
    )
    (SITE_ROOT / "robots.txt").write_text(robots, encoding="utf-8")
    print(f"  sitemap.xml ({len(urls)} urls) + robots.txt written")


def main() -> int:
    print(f"[build] SITE_ROOT  = {SITE_ROOT}")
    print(f"[build] API_BASE_URL = {API_BASE_URL}")
    SITE_ROOT.mkdir(parents=True, exist_ok=True)
    EXAMPLES_ROOT.mkdir(parents=True, exist_ok=True)

    template = TEMPLATE_FILE.read_text(encoding="utf-8")

    _copy_assets()
    print("[build] Skill download zips")
    _zip_skills()

    print("[build] Playground manifests")
    items = _build_playgrounds()

    print("[build] Endpoint pages (base_href='../')")
    for md in sorted(ENDPOINTS_SRC.glob("*.md")):
        out_file = SITE_ROOT / "endpoints" / f"{md.stem}.html"
        info = _build_page(md, template, out_file,
                           base_href="../",
                           canonical_path=f"endpoints/{md.stem}.html")
        print(f"  endpoint → endpoints/{info['href']}")

    print("[build] User guide (docs/guide/*.md → guide/, base_href='../')")
    _build_guide(template)

    print("[build] Docs landing + llms.txt + openapi.{yaml,json}")
    # IMPORTANT: widecast/widecast.html is the MARKETING HOMEPAGE — hand-crafted,
    # NOT generated by this script (it's also the webserver default document;
    # there is intentionally NO index.html). We do NOT overwrite it. The docs
    # landing built from docs/index.md goes to widecast/docs.html.
    if INDEX_MD.exists():
        info = _build_page(INDEX_MD, template, SITE_ROOT / "docs.html",
                           base_href="./",
                           title_fallback="WideCast Docs",
                           canonical_path="docs.html")
        print(f"  docs landing → {info['href']}")
    if LLMS_TXT.exists():
        _check_llms_parity()
        shutil.copy2(LLMS_TXT, SITE_ROOT / "llms.txt")
        print("  llms.txt copied (parity OK)")
    if OPENAPI_SRC.exists():
        shutil.copy2(OPENAPI_SRC, SITE_ROOT / "openapi.yaml")
        try:
            spec = yaml.safe_load(OPENAPI_SRC.read_text(encoding="utf-8"))
            (SITE_ROOT / "openapi.json").write_text(
                json.dumps(spec, indent=2, ensure_ascii=False), encoding="utf-8"
            )
            # ChatGPT GPT-Actions flavored spec (derived, never hand-maintained).
            (SITE_ROOT / "openapi-actions.json").write_text(
                json.dumps(_chatgpt_actions_spec(spec), indent=2, ensure_ascii=False),
                encoding="utf-8"
            )
            print("  openapi.{yaml,json} + openapi-actions.json written")
        except Exception as e:
            print(f"  openapi.json failed: {e}")

    print("[build] sitemap.xml + robots.txt")
    _write_sitemap_robots()

    print("[build] Playground aggregator (base_href='./')")
    _build_aggregator(items, template)

    print("[build] Code examples")
    _generate_examples()

    if LEGACY_SITE.exists():
        print(f"\n[build] NOTE: legacy {LEGACY_SITE.relative_to(SITE_ROOT.parent)}/ folder is now STALE.")
        print(f"        Build output moved to {SITE_ROOT}/ itself.")
        print(f"        Delete {LEGACY_SITE.relative_to(SITE_ROOT.parent)}/ manually when ready.")

    print(f"\n[build] DONE → {SITE_ROOT}")
    print(f"[build] Test locally: python3 -m http.server -d {SITE_ROOT.name} 8000")
    print(f"[build]               → http://localhost:8000/widecast.html (home) "
          f"· /playground.html · /docs.html")
    return 0


if __name__ == "__main__":
    sys.exit(main())
