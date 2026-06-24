/* WideCast Playground — vanilla JS, no build step.
 *
 * Hydrates every <div class="wc-playground" data-cfg="/playgrounds/<key>.json">
 * with a form + result viewer + Copy-as-{Python,TS,cURL} controls.
 *
 * The playground manifests (yaml-source, json-runtime) are the SINGLE SOURCE
 * shared between inline docs playgrounds and the standalone aggregator page.
 */
(function () {
  "use strict";

  const API_BASE = window.WIDECAST_API_BASE_URL || "https://widecast.ai/app/dashboard2";
  const LS_KEY = "widecast_api_key";

  // ──────────────────────────────────────────────────────────────────────
  // Supported playground YAML `field.type` values (contract with build.py).
  //
  // This is the SINGLE source of truth for the YAML↔JS contract — if you
  // add a new field type in a playground YAML, you MUST also add a branch
  // in `renderField()` below AND add the literal here. `build.py` reads
  // this list (by regex) and FAILS THE BUILD if any playground YAML uses
  // a field.type not in this set — that's the canary that prevents the
  // "YAML edit only, JS forgotten" drift.
  // SUPPORTED_FIELD_TYPES = ["boolean", "json", "textarea", "select", "text", "file"]
  // `file` (A49) renders an <input type="file"> and switches the card's Run +
  // Copy to multipart/form-data (media file sources: video_file / audio_file).
  // ──────────────────────────────────────────────────────────────────────
  const SUPPORTED_FIELD_TYPES = ["boolean", "json", "textarea", "select", "text", "file"];
  if (typeof window !== "undefined") window.__WIDECAST_PG_FIELD_TYPES = SUPPORTED_FIELD_TYPES;

  // ──────────────────────────────────────────────────────────────────────
  function el(tag, attrs, ...children) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") e.className = v;
        else if (k === "html") e.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v);
      }
    }
    for (const c of children) {
      if (c == null) continue;
      e.append(c.nodeType ? c : document.createTextNode(c));
    }
    return e;
  }

  function getApiKey() { try { return localStorage.getItem(LS_KEY) || ""; } catch (_) { return ""; } }
  function setApiKey(k) { try { localStorage.setItem(LS_KEY, k); } catch (_) {} }

  // ──────────────────────────────────────────────────────────────────────
  // Inline-image paste support (source=blog) — opt-in via field `inline_images`.
  //
  // A <textarea> is plain-text only: pasting a rich web article silently
  // drops every <img>. For blog source we WANT those images — the server
  // (ai_enhance_script) extracts inline image URLs from blog_text and turns
  // them into per-scene illustration images. So when the clipboard carries
  // text/html, we intercept the paste and splice the plain text WITH each
  // usable image URL inlined at its original position.
  //
  // PARITY: we only inline URLs the server will actually consume. The server
  // detects media via this exact pattern (dashboard2.py _MEDIA_URL_PATTERN):
  //   https?://…\.(png|jpg|jpeg|gif|webp|bmp|avif|svg|mp4|webm|mov|m4v|avi)(?\?…)?
  // base64 (data:) + relative-path images are dropped (no public upload
  // endpoint to host them, and the server couldn't fetch them anyway).
  // Plain-text pastes and HTML with no usable image URL fall through to the
  // browser's default paste, so normal behaviour is untouched.
  const _WC_MEDIA_URL_RE =
    /^https?:\/\/[^\s<>"']+\.(?:png|jpg|jpeg|gif|webp|bmp|avif|svg|mp4|webm|mov|m4v|avi)(?:\?[^\s<>"']*)?$/i;

  // Heuristic: drop obvious icons / tracking pixels. We can't measure
  // rendered size at paste time, so only skip when an explicit small numeric
  // dimension attribute is present (real content images usually have none or
  // a large one).
  function _wcImageLooksTiny(img) {
    for (const attr of ["width", "height"]) {
      const raw = (img.getAttribute(attr) || "").trim();
      if (/^\d+$/.test(raw) && parseInt(raw, 10) < 64) return true;
    }
    return false;
  }

  // Parse clipboard text/html → plain text with usable image URLs inlined.
  // Returns null when there is no usable image URL (caller lets the default
  // paste run instead).
  function _wcHtmlToTextWithInlineImages(html) {
    let doc;
    try { doc = new DOMParser().parseFromString(html, "text/html"); }
    catch (_) { return null; }
    if (!doc || !doc.body) return null;

    const BLOCK = new Set([
      "P", "DIV", "BR", "LI", "UL", "OL", "H1", "H2", "H3", "H4", "H5", "H6",
      "TR", "TABLE", "BLOCKQUOTE", "SECTION", "ARTICLE", "HEADER", "FOOTER",
      "FIGURE", "FIGCAPTION", "HR",
    ]);
    const parts = [];
    let usable = 0;

    function walk(node) {
      for (const child of node.childNodes) {
        if (child.nodeType === 3) {            // text node
          parts.push(child.nodeValue);
        } else if (child.nodeType === 1) {     // element
          const tag = child.tagName.toUpperCase();
          if (tag === "IMG" || tag === "SOURCE") {
            const src = (child.getAttribute("src") || "").trim();
            if (_WC_MEDIA_URL_RE.test(src) && !_wcImageLooksTiny(child)) {
              parts.push("\n" + src + "\n");
              usable++;
            }
            continue;  // never recurse into / keep the element itself
          }
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") continue;
          if (tag === "BR") { parts.push("\n"); continue; }
          const isBlock = BLOCK.has(tag);
          if (isBlock) parts.push("\n");
          walk(child);
          if (isBlock) parts.push("\n");
        }
      }
    }
    walk(doc.body);

    if (usable === 0) return null;  // no images → default plain-text paste

    let text = parts.join("");
    text = text
      .replace(/[ \t]+\n/g, "\n")     // trailing spaces before newline
      .replace(/\n{3,}/g, "\n\n")     // collapse blank-line runs
      .replace(/^\s+|\s+$/g, "");     // trim ends
    return text;
  }

  // Attach the intercepting paste handler to a <textarea>. Idempotent.
  function attachInlineImagePaste(textarea) {
    if (!textarea || textarea._wcInlinePaste) return;
    textarea._wcInlinePaste = true;
    textarea.addEventListener("paste", (e) => {
      const cd = e.clipboardData || window.clipboardData;
      if (!cd) return;
      let html = "";
      try { html = cd.getData("text/html") || ""; } catch (_) { html = ""; }
      if (!html) return;                       // plain-text paste → default
      const text = _wcHtmlToTextWithInlineImages(html);
      if (text == null) return;                // no usable image → default
      e.preventDefault();
      const start = textarea.selectionStart != null ? textarea.selectionStart : textarea.value.length;
      const end = textarea.selectionEnd != null ? textarea.selectionEnd : textarea.value.length;
      if (typeof textarea.setRangeText === "function") {
        textarea.setRangeText(text, start, end, "end");
      } else {
        textarea.value = textarea.value.slice(0, start) + text + textarea.value.slice(end);
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
      }
      // Notify listeners (word counter, snippet builders) of the change.
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  async function loadConfig(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`Failed to load ${url}: ${r.status}`);
    return r.json();
  }

  function renderField(field, value) {
    const wrap = el("div", { class: "wc-pg-field" });
    const lbl = el("label", null, field.label || field.name);
    wrap.append(lbl);
    let input;
    if (field.type === "boolean") {
      input = el("input", { type: "checkbox" });
      input.checked = !!value;
      input.name = field.name;
      const inline = el("label", null, input, " " + (field.label || field.name));
      wrap.innerHTML = "";
      wrap.append(inline);
    } else if (field.type === "json") {
      input = el("textarea", { name: field.name, spellcheck: "false" });
      input.value = typeof value === "string" ? value : JSON.stringify(value ?? {}, null, 2);
      wrap.append(input);
    } else if (field.type === "textarea") {
      input = el("textarea", { name: field.name, spellcheck: "true" });
      if (field.rows) input.rows = field.rows;
      if (field.placeholder) input.placeholder = field.placeholder;
      input.value = value ?? "";
      wrap.append(input);
      // Inline-image paste (source=blog) — keep pasted image URLs inline.
      if (field.inline_images) attachInlineImagePaste(input);
    } else if (field.type === "select") {
      input = el("select", { name: field.name });
      const opts = Array.isArray(field.options) ? field.options : [];
      const seeded = value ?? field.default ?? (opts[0] && opts[0].value);
      for (const opt of opts) {
        const o = el("option", { value: String(opt.value) }, opt.label || String(opt.value));
        if (String(opt.value) === String(seeded)) o.selected = true;
        input.append(o);
      }
      wrap.append(input);
    } else if (field.type === "file") {
      input = el("input", { type: "file", name: field.name });
      if (field.accept) input.setAttribute("accept", field.accept);
      wrap.append(input);
    } else {
      input = el("input", { type: "text", name: field.name });
      if (field.placeholder) input.placeholder = field.placeholder;
      input.value = value ?? "";
      wrap.append(input);
    }
    return { wrap, input, field };
  }

  // ──────────────────────────────────────────────────────────────────────
  // show_when directive — conditional field visibility.
  //
  // YAML shape:
  //   - name: idea_text
  //     type: textarea
  //     show_when: { source: idea }      # show only when `source` field is "idea"
  //
  // Values can also be arrays — { source: [idea, other] } matches any. The
  // controlling field MUST itself be declared in `fields` (typically a select
  // or boolean). If `show_when` is absent, the field is always shown.
  //
  // collectRequest() ALSO honors show_when — hidden fields are NOT sent in
  // the request body (server would otherwise see e.g. an empty script_text
  // when source=idea). Same rule for snippet generators.
  // ──────────────────────────────────────────────────────────────────────
  function readCurrentValue(field, input) {
    if (!input) return undefined;
    if (field.type === "boolean") return !!input.checked;
    return input.value;
  }
  function isFieldVisible(field, fieldInputs) {
    const cond = field.show_when;
    if (!cond || typeof cond !== "object") return true;
    for (const [ctrlName, allowed] of Object.entries(cond)) {
      const ctrl = fieldInputs.find(fi => fi.field.name === ctrlName);
      if (!ctrl) continue;  // controlling field not in form → assume visible
      const cur = String(readCurrentValue(ctrl.field, ctrl.input));
      const allowedArr = Array.isArray(allowed) ? allowed : [allowed];
      if (!allowedArr.map(String).includes(cur)) return false;
    }
    return true;
  }
  function applyShowWhen(fieldInputs) {
    for (const fi of fieldInputs) {
      const show = isFieldVisible(fi.field, fieldInputs);
      fi.wrap.style.display = show ? "" : "none";
      fi.wrap.dataset.hidden = show ? "" : "1";
    }
  }

  function collectRequest(fields, fieldInputs) {
    const body = {};
    for (const fi of fieldInputs) {
      const { input, field } = fi;
      // Skip fields hidden by show_when — server should not see them.
      if (!isFieldVisible(field, fieldInputs)) continue;
      // File fields aren't JSON-serializable — handled by the multipart path.
      if (field.type === "file") continue;
      if (field.type === "boolean") {
        body[field.name] = input.checked;
      } else if (field.type === "json") {
        const raw = input.value.trim();
        if (!raw && field.required !== true) continue;  // skip empty optional JSON
        try {
          body[field.name] = raw ? JSON.parse(raw) : null;
        } catch (e) {
          throw new Error(`Field '${field.name}' is not valid JSON: ${e.message}`);
        }
      } else {
        // text / textarea / select / default — plain string, no parsing
        const v = input.value;
        if (v === "" && field.required !== true) continue;  // skip empty optional text
        body[field.name] = v;
      }
    }
    return body;
  }

  // ──────────────────────────────────────────────────────────────────────
  function snippetPython(cfg, body, fileField) {
    const sdkMethod = sdkMethodFor(cfg);
    // Python bools are True/False (JSON.stringify would emit lowercase
    // true/false → invalid Python). Everything else uses JSON form.
    const pyVal = (v) =>
      v === true ? "True" : v === false ? "False"
        : JSON.stringify(v, null, 2).replace(/\n/g, "\n    ");
    const lines = Object.entries(body).map(([k, v]) =>
      `    ${k}=${pyVal(v)}`);
    // Media file source (A49): the file is a real upload, not JSON.
    if (fileField) lines.push(`    ${fileField}=open("/path/to/your/file", "rb")`);
    const argsBlock = lines.join(",\n");
    return `from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="${API_BASE}")

resp = client.${sdkMethod}(
${argsBlock}
)
print(resp)
`;
  }
  function snippetTS(cfg, body, fileField) {
    const sdkMethod = sdkMethodFor(cfg);
    if (fileField) {
      const entries = Object.entries(body).map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`);
      entries.push(`  ${fileField}: yourBlob /* a Blob/File (e.g. await openAsBlob("clip.mp4")) */`);
      return `import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "${API_BASE}" });

const resp = await client.${sdkMethod}({
${entries.join(",\n")}
});
console.log(resp);
`;
    }
    return `import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "${API_BASE}" });

const resp = await client.${sdkMethod}(${JSON.stringify(body, null, 2)});
console.log(resp);
`;
  }
  function snippetCurl(cfg, body, fileField) {
    const method = (cfg.endpoint?.method || "POST").toUpperCase();
    const path = cfg.endpoint?.path || "/";
    // Media file source (A49): multipart/form-data with -F parts.
    if (fileField) {
      const forms = Object.entries(body).map(([k, v]) =>
        `  -F "${k}=${typeof v === "object" ? JSON.stringify(v) : v}" \\`);
      forms.push(`  -F "${fileField}=@/path/to/your/file"`);
      return `curl -X ${method} "${API_BASE}${path}" \\
  -H "Authorization: Bearer wc_live_REPLACE_ME" \\
${forms.join("\n")}
`;
    }
    // GET reads → query string, no body.
    if (method === "GET") {
      return `curl "${API_BASE}${withQuery(path, method, body)}" \\
  -H "Authorization: Bearer wc_live_REPLACE_ME"
`;
    }
    return `curl -X ${method} "${API_BASE}${path}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer wc_live_REPLACE_ME" \\
  -d '${JSON.stringify(body)}'
`;
  }
  function sdkMethodFor(cfg) {
    const path = cfg.endpoint?.path || "";
    if (path === "/v1/create_video") return "create_video";
    if (path.startsWith("/v1/videos/")) return "get_video";
    // Batch C read endpoints — explicit SDK method names (path-derived would be wrong).
    const READ_SDK = {
      "/v1/videos": "list_videos", "/v1/account": "account",
      "/v1/analytics": "analytics", "/v1/roadmap": "roadmap",
      "/v1/production_plan": "production_plan",
      "/v1/recommendations": "recommendations",
      "/v1/telegram/send": "send_telegram_message",
      "/v1/create_image": "create_image",
      "/v1/search_broll": "search_broll",
      "/v1/video_data": "video_data",
    };
    if (READ_SDK[path]) return READ_SDK[path];
    return path.replace(/^\//, "").replace(/[\/{}-]/g, "_");
  }

  // GET endpoints carry their params in the query string, not a body. Append a
  // urlencoded query for GET (objects → JSON); pass the path through otherwise.
  function withQuery(path, method, body) {
    if ((method || "").toUpperCase() !== "GET" || !body) return path;
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(body)) {
      if (v === undefined || v === null || v === "") continue;
      qs.set(k, (v && typeof v === "object") ? JSON.stringify(v) : String(v));
    }
    const s = qs.toString();
    return s ? `${path}?${s}` : path;
  }

  // Add a "Copy" button to every prose code block in docs articles (the doc
  // standard — applies on every page since this script loads site-wide). Skips
  // playground-internal <pre> (those have their own copy/run controls).
  function enhanceCodeBlocks() {
    const blocks = document.querySelectorAll(".wc-article pre");
    blocks.forEach((pre) => {
      if (pre.dataset.wcCopy) return;                       // idempotent
      if (pre.closest(".wc-pg-example, .wc-pg-result, .wc-playground")) return;
      pre.dataset.wcCopy = "1";
      const codeEl = pre.querySelector("code");
      // Capture the text BEFORE adding the button so its label never leaks in.
      const text = (codeEl ? codeEl.innerText : pre.innerText).replace(/\s+$/, "");
      const btn = el("button", { class: "wc-copy", type: "button", "aria-label": "Copy code" }, "Copy");
      btn.addEventListener("click", (e) => { e.preventDefault(); copyToClipboard(text, btn); });
      pre.appendChild(btn);
    });
  }

  async function copyToClipboard(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      const old = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = old), 1200);
    } catch (_) {
      alert("Copy failed. Select & copy manually.");
    }
  }

  // ──────────────────────────────────────────────────────────────────────
  // renderExample — one card per use_case, with optional industry pill row.
  //
  // Two shapes supported:
  //   • Single-example: use_case has `request: {...}` → renders body directly.
  //   • Multi-industry: use_case has `industries: [{key, label, request}, ...]`
  //     → renders a pill row at the top; clicking a pill swaps the body
  //     to that industry's request payload in place. Defaults to first
  //     industry. Pills carry the example's domain — Real Estate, P&C
  //     Insurance, News, etc — so the dev sees breadth + picks the
  //     industry closest to their own use case.
  //
  // Layout (per industry / single example):
  //   • Header (rendered by build.py outside this mount)
  //   • [Pill row — only when industries[] present]
  //   • "Params" card — for each key in active request:
  //       - long-text / text fields → editable input
  //       - select / boolean / unknown → LOCKED row "name → value"
  //   • API key row
  //   • Big Run + Copy Python / TS / cURL
  //   • Result panel (auto-polls if poll_after_create configured)
  // ──────────────────────────────────────────────────────────────────────
  function renderExample(container, cfg, useCase) {
    container.innerHTML = "";

    const industries = Array.isArray(useCase?.industries) ? useCase.industries : null;
    const hasIndustries = industries && industries.length > 0;

    // Always render a body container; for multi-industry, also render a
    // pill row above it that swaps the body in place.
    let pillRow = null;
    let activeIndustryIdx = 0;

    if (hasIndustries) {
      pillRow = el("div", { class: "wc-pg-industry-pills",
                            role: "tablist",
                            "aria-label": "Industry examples" });
      const hint = el("p", { class: "wc-pg-industry-hint" },
        "Try this section with any industry — pill swaps the example in place:");
      container.append(hint, pillRow);
      industries.forEach((ind, i) => {
        const pill = el("button", {
          type: "button",
          class: "wc-pg-industry-pill" + (i === 0 ? " active" : ""),
          role: "tab",
          "aria-selected": i === 0 ? "true" : "false",
          "data-industry-key": ind.key || String(i),
        }, ind.label || ind.key || `Variant ${i + 1}`);
        pill.addEventListener("click", () => switchIndustry(i));
        pillRow.append(pill);
      });
    }

    const bodyMount = el("div", { class: "wc-pg-example-body" });
    container.append(bodyMount);

    function switchIndustry(idx) {
      if (idx === activeIndustryIdx) return;
      activeIndustryIdx = idx;
      pillRow.querySelectorAll(".wc-pg-industry-pill").forEach((p, i) => {
        const on = i === idx;
        p.classList.toggle("active", on);
        p.setAttribute("aria-selected", on ? "true" : "false");
      });
      renderExampleBody(bodyMount, cfg, useCase, currentRequest());
    }

    function currentRequest() {
      if (hasIndustries) {
        const ind = industries[activeIndustryIdx];
        return (ind && ind.request) || {};
      }
      return useCase.request || {};
    }

    renderExampleBody(bodyMount, cfg, useCase, currentRequest());
  }

  // Renders the params block + API key + actions + result panel for ONE
  // request payload. Called both on initial mount and on every industry
  // pill switch.
  function renderExampleBody(container, cfg, useCase, reqSpec) {
    container.innerHTML = "";

    const method = (cfg.endpoint?.method || "POST").toUpperCase();
    const path = cfg.endpoint?.path || "/";
    const fieldDefs = Array.isArray(cfg.fields) ? cfg.fields : [];
    const fieldByName = new Map(fieldDefs.filter(f => f && f.name).map(f => [f.name, f]));

    // Helper: should this param get an editable input vs a locked read-only
    // row? Rule (per user direction 2026-05-20 evening):
    //   - select / boolean / unknown → locked row (these are CHOICES; the
    //     dev experiences variants by scrolling to a different card).
    //   - textarea → editable (long content the dev WILL want to tweak).
    //   - text → editable (typically a URL / id / small string the dev
    //     may want to point at their own endpoint, e.g. callback_url).
    //   - any other field with a value > 200 chars → editable
    //     (defensive: long content shouldn't be wedged into a locked row).
    function isEditableLong(name, value) {
      const def = fieldByName.get(name);
      if (def && (def.type === "textarea" || def.type === "text")) return true;
      if (typeof value === "string" && value.length > 200) return true;
      return false;
    }

    // ── Params block: radios + locked rows + editable textareas ───────
    const paramsBlock = el("div", { class: "wc-pg-params" });
    paramsBlock.append(el("h4", { class: "wc-pg-params-head" }, "Parameters"));

    // Track editable inputs so Run / Copy can pick up the latest value.
    // Keyed by field name.
    const editableInputs = new Map();
    const editableBools = new Map();   // boolean flag (e.g. faceless) → checkbox input
    const lockedParams = {};      // values that never change for this example
    const radioSelections = {};   // field → current radio value (live)
    // Media file source (A49): when reqSpec.source is a `file`-typed field,
    // we render a file picker and switch Run/Copy to multipart/form-data.
    let fileInput = null;         // the <input type="file"> element (or null)
    let fileFieldName = null;     // e.g. "video_file" / "audio_file"

    // choices[] = which request params render as a horizontal radio group
    // the dev can toggle (output_type, video_length). Keyed by field name.
    const choiceByField = new Map();
    (Array.isArray(useCase.choices) ? useCase.choices : []).forEach(ch => {
      if (ch && ch.field) choiceByField.set(ch.field, ch);
    });
    // Unique token per render so radio `name` groups don't collide across
    // the multiple example cards on one page (selecting in one card must
    // NOT move another card's radios).
    const uid = "wcpg-" + Math.random().toString(36).slice(2, 9);

    function renderRadioGroup(name, defaultValue, choice) {
      const def = fieldByName.get(name);
      const label = (def && def.label) || name;
      const fieldOpts = (def && Array.isArray(def.options)) ? def.options : [];
      const optionLabels = new Map(
        fieldOpts.map(o => [String(o.value), o.label || String(o.value)]));
      const opts = Array.isArray(choice.options)
        ? choice.options.map(String)
        : fieldOpts.map(o => String(o.value));
      const gated = choice.gated || {};  // { value: message }
      const dflt = String(defaultValue);
      radioSelections[name] = dflt;

      const row = el("div", { class: "wc-pg-radio-field" });
      row.append(el("label", { class: "wc-pg-radio-grouplabel" },
        `${label} `, el("code", { class: "wc-pg-field-name" }, name)));
      const group = el("div", { class: "wc-pg-radio-group" });
      const msg = el("p", { class: "wc-pg-radio-msg", style: "display:none" });
      const inputs = [];
      for (const optVal of opts) {
        const rid = `${uid}-${name}-${optVal}`;
        const input = el("input", {
          type: "radio", name: `${uid}-${name}`, value: optVal, id: rid,
        });
        if (optVal === dflt) input.checked = true;
        inputs.push(input);
        const isGated = !!gated[optVal];
        const optLabel = el("label", {
          class: "wc-pg-radio-opt" + (isGated ? " wc-pg-radio-opt-gated" : ""),
          for: rid,
        }, input, " " + (optionLabels.get(optVal) || optVal));
        input.addEventListener("change", () => {
          if (!input.checked) return;
          if (gated[optVal]) {
            // Gated value (e.g. video_length=normal) — show the paywall
            // note and snap back to the default (free) value.
            msg.textContent = gated[optVal];
            msg.style.display = "";
            const back = inputs.find(r => r.value === dflt);
            if (back) back.checked = true;
            radioSelections[name] = dflt;
            return;
          }
          msg.style.display = "none";
          radioSelections[name] = optVal;
        });
        group.append(optLabel);
      }
      row.append(group, msg);
      paramsBlock.append(row);
    }

    // Render order: keys as they appear in the YAML's `request` (declaration
    // order from `use_case.request` — Python yaml.safe_load preserves it
    // since 3.7, and we re-dump in our JSON build, so order is stable).
    for (const [name, value] of Object.entries(reqSpec)) {
      const def = fieldByName.get(name);
      const label = (def && def.label) || name;

      // Radio group (output_type / video_length) — toggleable choice.
      if (choiceByField.has(name)) {
        renderRadioGroup(name, value, choiceByField.get(name));
        continue;
      }

      // Boolean flag (e.g. faceless) → editable checkbox the dev can flip in
      // place (NOT a locked row). currentBody() reads .checked as a real
      // boolean, so the SDK snippets stay type-correct.
      if (def && def.type === "boolean") {
        const row = el("div", { class: "wc-pg-field wc-pg-field-editable" });
        const cb = el("input", { type: "checkbox", name });
        cb.checked = !!value;
        row.append(el("label", null, cb, " ", `${label} `,
          el("code", { class: "wc-pg-field-name" }, name)));
        paramsBlock.append(row);
        editableBools.set(name, cb);
        continue;
      }

      // callback_url with an empty default: render editable but skip the
      // locked-row noise. It's already covered by isEditableLong (text type).
      if (isEditableLong(name, value)) {
        // Editable input — textarea for long content, single-line for text.
        const row = el("div", { class: "wc-pg-field wc-pg-field-editable" });
        row.append(el("label", null, `${label} `,
          el("code", { class: "wc-pg-field-name" }, name)));
        const useTextarea = !(def && def.type === "text");
        const ta = el(useTextarea ? "textarea" : "input", useTextarea
          ? { name, spellcheck: "true",
              rows: (def && def.rows) ? String(def.rows) : "8" }
          : { name, type: "text", spellcheck: "false" });
        ta.value = String(value ?? "");
        if (def && def.placeholder) ta.placeholder = def.placeholder;
        row.append(ta);
        // Inline-image paste (source=blog): keep pasted image URLs inline so
        // the server turns them into per-scene illustrations.
        if (useTextarea && def && def.inline_images) {
          attachInlineImagePaste(ta);
          row.append(el("p", { class: "wc-pg-hint" },
            "Tip: paste a web article and its images are kept as inline image "
            + "URLs — the AI uses them as per-scene illustrations. (Only public "
            + "http(s) image links are kept; embedded/base64 images are skipped.)"));
        }
        // Live word counter for *_text fields with declared bounds (UX hint
        // — server still enforces).
        const minWords = def && (def["x-widecast-min-words"] || def.x_widecast_min_words);
        const maxWords = def && (def["x-widecast-max-words"] || def.x_widecast_max_words);
        if (minWords || maxWords) {
          const counter = el("p", { class: "wc-pg-wordcount" }, "");
          const update = () => {
            const wc = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
            let msg = `${wc} word${wc === 1 ? "" : "s"}`;
            if (minWords && maxWords) msg += ` (${minWords}–${maxWords})`;
            else if (minWords) msg += ` (min ${minWords})`;
            else if (maxWords) msg += ` (max ${maxWords})`;
            counter.textContent = msg;
            counter.classList.toggle(
              "wc-pg-wordcount-bad",
              !!(minWords && wc < minWords),
            );
          };
          ta.addEventListener("input", update);
          update();
          row.append(counter);
        }
        paramsBlock.append(row);
        editableInputs.set(name, ta);
      } else {
        // Locked row — read-only display of "name: value". No widget.
        lockedParams[name] = value;
        const row = el("div", { class: "wc-pg-param-locked" });
        row.append(
          el("code", { class: "wc-pg-param-name" }, name),
          el("span", { class: "wc-pg-param-sep" }, "→"),
          el("code", { class: "wc-pg-param-value" }, JSON.stringify(value)),
        );
        paramsBlock.append(row);
      }
    }

    // ── File picker (media file sources: video_file / audio_file) ─────
    // The file isn't a pre-fillable fixture, so it isn't in reqSpec — we
    // render the picker off the source's `file`-typed field def.
    const _srcFileDef = reqSpec.source && fieldByName.get(reqSpec.source);
    if (_srcFileDef && _srcFileDef.type === "file") {
      fileFieldName = _srcFileDef.name;
      const row = el("div", { class: "wc-pg-field wc-pg-field-editable" });
      row.append(el("label", null, `${_srcFileDef.label || fileFieldName} `,
        el("code", { class: "wc-pg-field-name" }, fileFieldName)));
      fileInput = el("input", { type: "file", name: fileFieldName });
      if (_srcFileDef.accept) fileInput.setAttribute("accept", _srcFileDef.accept);
      if (_srcFileDef.placeholder) {
        row.append(el("p", { class: "wc-pg-hint" }, _srcFileDef.placeholder));
      }
      row.append(fileInput);
      paramsBlock.append(row);
    }

    container.append(paramsBlock);

    // ── API key (editable, stored locally) ────────────────────────────
    const keyRow = el("div", { class: "wc-pg-field wc-pg-field-editable" });
    const keyInput = el("input", {
      type: "password",
      placeholder: "wc_live_… (optional in pilot — stored only in your browser)",
    });
    keyInput.value = getApiKey();
    keyInput.addEventListener("input", () => setApiKey(keyInput.value));
    keyRow.append(el("label", null, "API key"), keyInput);
    container.append(keyRow);

    // ── Action bar: Run + Copy ─────────────────────────────────────────
    const runBtn = el("button", { class: "wc-btn wc-btn-run", type: "button" }, "▶  Run");
    const cpPy = el("button", { class: "wc-btn", type: "button" }, "Copy Python");
    const cpTs = el("button", { class: "wc-btn", type: "button" }, "Copy TypeScript");
    const cpCurl = el("button", { class: "wc-btn", type: "button" }, "Copy cURL");
    container.append(el("div", { class: "wc-pg-actions" }, runBtn, cpPy, cpTs, cpCurl));

    // ── Result panel (hidden until Run fires) ─────────────────────────
    const resultPanel = el("div", { class: "wc-pg-result", style: "display:none" });
    container.append(resultPanel);

    // Build the request body for THIS example: locked params + radio
    // selections + current editable values. This is the exact JSON the
    // Run + Copy use. Empty-string values (e.g. an untouched callback_url)
    // are dropped so the snippet + request stay clean.
    function currentBody() {
      const body = { ...lockedParams, ...radioSelections };
      for (const [name, input] of editableInputs.entries()) {
        body[name] = input.value;
      }
      for (const k of Object.keys(body)) {
        if (body[k] === "" || body[k] == null) delete body[k];
      }
      // Boolean flags (e.g. faceless): include only when checked (server
      // defaults to false), as a REAL boolean so the SDK snippets type-check.
      for (const [name, input] of editableBools.entries()) {
        if (input.checked) body[name] = true;
      }
      return body;
    }

    cpPy.addEventListener("click", () => {
      try { copyToClipboard(snippetPython(cfg, currentBody(), fileFieldName), cpPy); }
      catch (e) { alert(e.message); }
    });
    cpTs.addEventListener("click", () => {
      try { copyToClipboard(snippetTS(cfg, currentBody(), fileFieldName), cpTs); }
      catch (e) { alert(e.message); }
    });
    cpCurl.addEventListener("click", () => {
      try { copyToClipboard(snippetCurl(cfg, currentBody(), fileFieldName), cpCurl); }
      catch (e) { alert(e.message); }
    });

    runBtn.addEventListener("click", async () => {
      resultPanel.style.display = "";
      resultPanel.innerHTML = "<h4>Result</h4><p>Running…</p>";
      let body;
      try {
        body = currentBody();
      } catch (e) {
        resultPanel.innerHTML = `<h4>Result</h4><pre>${escapeHtml(e.message)}</pre>`;
        return;
      }
      // Media file sources (A49) → multipart/form-data; everything else JSON.
      const pickedFile = fileInput && fileInput.files && fileInput.files[0];
      if (fileFieldName && !pickedFile) {
        resultPanel.innerHTML =
          `<h4>Result</h4><pre>Please choose a ${escapeHtml(fileFieldName)} to upload.</pre>`;
        return;
      }
      try {
        const headers = {};
        const k = keyInput.value.trim();
        if (k) headers["Authorization"] = "Bearer " + k;
        let fetchBody;
        if (pickedFile) {
          // Build multipart — let the browser set the Content-Type boundary.
          const form = new FormData();
          for (const [bk, bv] of Object.entries(body)) {
            form.set(bk, (bv && typeof bv === "object") ? JSON.stringify(bv) : String(bv));
          }
          form.set(fileFieldName, pickedFile, pickedFile.name);
          fetchBody = form;
        } else {
          headers["Content-Type"] = "application/json";
          fetchBody = method === "GET" ? undefined : JSON.stringify(body);
        }
        const t0 = performance.now();
        const r = await fetch(API_BASE + withQuery(path, method, body), { method, headers, body: fetchBody });
        const dt = Math.round(performance.now() - t0);
        const json = await r.json().catch(() => ({}));
        const reqId = r.headers.get("X-Request-Id") || "-";
        renderStatusPanel(resultPanel, json, {
          httpStatus: r.status, dt, reqId, label: "Create response",
        });

        // Poll headers must NOT carry the multipart Content-Type.
        const pollHeaders = {};
        if (k) pollHeaders["Authorization"] = "Bearer " + k;
        const pollCfg = cfg.poll_after_create;
        if (pollCfg && pollCfg.enabled && json && json[pollCfg.id_field || "id"]) {
          await autoPollStatus(resultPanel, json, pollCfg, pollHeaders);
        }
      } catch (e) {
        resultPanel.innerHTML = `<h4>Error</h4><pre>${escapeHtml(e.message)}</pre>`;
      }
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // LEGACY render() — kept for any older docs MD that uses single-form
  // marker without per-use-case expansion. New code paths emit per-example
  // sections via renderExample; this function is the fallback.
  // ──────────────────────────────────────────────────────────────────────
  function render(container, cfg) {
    container.innerHTML = "";
    const method = (cfg.endpoint?.method || "POST").toUpperCase();
    const path = cfg.endpoint?.path || "/";

    // Header
    container.append(el("div", { class: "wc-pg-header" },
      el("span", null,
        el("span", { class: `wc-method wc-method-${method.toLowerCase()}` }, method),
        " ",
        path
      ),
      el("span", { class: "wc-pg-title" }, cfg.title || "")
    ));

    const body = el("div", { class: "wc-pg-body" });

    // API key row (always editable, stored in localStorage)
    const keyInput = el("input", { type: "password", placeholder: "wc_live_..." });
    keyInput.value = getApiKey();
    keyInput.addEventListener("input", () => setApiKey(keyInput.value));
    body.append(el("div", { class: "wc-pg-field" },
      el("label", null, "API Key (stored in your browser only)"),
      keyInput
    ));

    // Use case bar
    const cases = cfg.use_cases || [];
    let activeIdx = 0;
    const caseBar = el("div", { class: "wc-pg-usecase-bar" });
    cases.forEach((uc, i) => {
      const btn = el("button", {
        class: "wc-pg-usecase" + (i === 0 ? " active" : ""),
        onclick: () => loadCase(i),
      }, uc.title || uc.id || `Case ${i + 1}`);
      caseBar.append(btn);
    });
    if (cases.length > 1) body.append(caseBar);

    // Field inputs
    const fieldsHost = el("div");
    body.append(fieldsHost);

    // Actions
    const runBtn = el("button", { class: "wc-btn wc-btn-primary" }, "Run");
    const cpPy = el("button", { class: "wc-btn" }, "Copy as Python");
    const cpTs = el("button", { class: "wc-btn" }, "Copy as TypeScript");
    const cpCurl = el("button", { class: "wc-btn" }, "Copy as cURL");
    body.append(el("div", { class: "wc-pg-actions" }, runBtn, cpPy, cpTs, cpCurl));

    // Result panel
    const resultPanel = el("div", { class: "wc-pg-result", style: "display:none" });
    body.append(resultPanel);

    container.append(body);

    // Field rendering with seeded values from current use case
    let fieldInputs = [];
    function loadCase(i) {
      activeIdx = i;
      caseBar.querySelectorAll(".wc-pg-usecase").forEach((b, j) =>
        b.classList.toggle("active", j === i));
      fieldsHost.innerHTML = "";
      fieldInputs = (cfg.fields || []).map(f => {
        const seeded = (cases[i]?.request || {})[f.name];
        const r = renderField(f, seeded ?? f.default);
        fieldsHost.append(r.wrap);
        return r;
      });
      // Live-update visibility when any controlling field changes — `change`
      // fires on select + checkbox immediately; `input` fires on text edits
      // (useful if someone ever uses a text field to gate visibility).
      for (const fi of fieldInputs) {
        const ev = (fi.field.type === "boolean" || fi.field.type === "select")
          ? "change" : "input";
        fi.input.addEventListener(ev, () => applyShowWhen(fieldInputs));
      }
      applyShowWhen(fieldInputs);
    }
    loadCase(0);

    // Wire copy buttons
    function currentBody() { return collectRequest(cfg.fields || [], fieldInputs); }
    cpPy.addEventListener("click", () => {
      try { copyToClipboard(snippetPython(cfg, currentBody()), cpPy); }
      catch (e) { alert(e.message); }
    });
    cpTs.addEventListener("click", () => {
      try { copyToClipboard(snippetTS(cfg, currentBody()), cpTs); }
      catch (e) { alert(e.message); }
    });
    cpCurl.addEventListener("click", () => {
      try { copyToClipboard(snippetCurl(cfg, currentBody()), cpCurl); }
      catch (e) { alert(e.message); }
    });

    // Run button
    runBtn.addEventListener("click", async () => {
      resultPanel.style.display = "";
      resultPanel.innerHTML = "<h4>Result</h4><p>Running…</p>";
      let body;
      try {
        body = currentBody();
      } catch (e) {
        resultPanel.innerHTML = `<h4>Result</h4><pre>${e.message}</pre>`;
        return;
      }
      try {
        const headers = { "Content-Type": "application/json" };
        const k = keyInput.value.trim();
        if (k) headers["Authorization"] = "Bearer " + k;
        const t0 = performance.now();
        const r = await fetch(API_BASE + withQuery(path, method, body), {
          method,
          headers,
          body: method === "GET" ? undefined : JSON.stringify(body),
        });
        const dt = Math.round(performance.now() - t0);
        const json = await r.json().catch(() => ({}));
        const reqId = r.headers.get("X-Request-Id") || "-";
        renderStatusPanel(resultPanel, json, { httpStatus: r.status, dt, reqId, label: "Create response" });

        // Auto-poll if configured + we got an id back (e.g., POST /v1/create_video → poll /v1/status/{id})
        const pollCfg = cfg.poll_after_create;
        if (pollCfg && pollCfg.enabled && json && json[pollCfg.id_field || "id"]) {
          await autoPollStatus(resultPanel, json, pollCfg, headers);
        }
      } catch (e) {
        resultPanel.innerHTML = `<h4>Error</h4><pre>${escapeHtml(e.message)}</pre>`;
      }
    });
  }

  function renderStatusPanel(panel, json, { httpStatus, dt, reqId, label = "Result" }) {
    const statusBadge = json && json.status
      ? `<span class="wc-status wc-status-${json.status}">${json.status}</span>`
      : "";
    const progressPct = json && typeof json.progress === "number"
      ? ` · progress=${Math.round(json.progress * 100)}%`
      : "";
    panel.innerHTML =
      `<h4>${label} · HTTP ${httpStatus} · ${dt}ms · req=${reqId} ${statusBadge}${progressPct}</h4>` +
      `<pre>${escapeHtml(JSON.stringify(json, null, 2))}</pre>`;
    const reviewUrl = json && json.result && json.result.review_url;
    const videoUrl = json && json.result && json.result.video_url;
    if (reviewUrl) {
      panel.append(el("p", { class: "wc-cta" },
        "👉 Review the rendered scenes: ",
        el("a", { href: reviewUrl, target: "_blank", rel: "noopener" }, reviewUrl)));
    }
    if (videoUrl) {
      panel.append(el("video", { src: videoUrl, controls: "" }));
    }
  }

  async function autoPollStatus(panel, createResp, pollCfg, headers) {
    const idField = pollCfg.id_field || "id";
    const id = createResp[idField];
    const tpl = pollCfg.status_path || "/v1/status/{id}";
    const statusPath = tpl.replace("{id}", encodeURIComponent(id));
    const terminal = new Set(pollCfg.terminal_statuses || ["completed", "failed"]);
    const initialMs = pollCfg.initial_interval_ms || 5000;
    const maxMs = pollCfg.max_interval_ms || 60000;
    const backoff = pollCfg.backoff_multiplier || 1.5;
    const timeoutMs = pollCfg.timeout_ms || 600000;
    const deadline = Date.now() + timeoutMs;
    let interval = initialMs;
    let pollCount = 0;
    let lastJson = createResp;

    // Already terminal? (e.g., wait_for_render=true completed in one shot)
    if (lastJson && terminal.has(lastJson.status)) {
      renderStatusPanel(panel, lastJson, {
        httpStatus: 200, dt: 0,
        reqId: lastJson?.meta?.request_id || "-",
        label: `Final state · ${lastJson.status}`,
      });
      return;
    }

    while (Date.now() < deadline) {
      const wait = Math.min(interval, Math.max(100, deadline - Date.now()));
      await new Promise(r => setTimeout(r, wait));
      pollCount += 1;
      const t0 = performance.now();
      let r, json;
      try {
        r = await fetch(API_BASE + statusPath, { method: "GET", headers });
        json = await r.json().catch(() => ({}));
      } catch (e) {
        panel.innerHTML = `<h4>Poll error</h4><pre>${escapeHtml(String(e))}</pre>`;
        return;
      }
      const dt = Math.round(performance.now() - t0);
      lastJson = json;
      renderStatusPanel(panel, json, {
        httpStatus: r.status, dt,
        reqId: r.headers.get("X-Request-Id") || "-",
        label: `Poll #${pollCount} (next ${Math.round(interval / 1000)}s)`,
      });
      if (json && terminal.has(json.status)) {
        renderStatusPanel(panel, json, {
          httpStatus: r.status, dt,
          reqId: r.headers.get("X-Request-Id") || "-",
          label: `Final state · ${json.status} (after ${pollCount} poll${pollCount === 1 ? "" : "s"})`,
        });
        return;
      }
      interval = Math.min(interval * backoff, maxMs);
    }
    renderStatusPanel(panel, lastJson, {
      httpStatus: 200, dt: 0,
      reqId: lastJson?.meta?.request_id || "-",
      label: `Polling timeout after ${Math.round(timeoutMs / 1000)}s — last state was ${lastJson?.status || "unknown"}`,
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ──────────────────────────────────────────────────────────────────────
  // Hydrate all playgrounds on the page
  async function hydrateAll() {
    enhanceCodeBlocks();   // copy buttons on docs code blocks (every page)
    // ── New mount points: one card per use_case (`.wc-pg-example`) ────
    // Build.py emits these in the aggregator + injects them in MD pages
    // via the <!-- widecast-playground:key --> marker. Each carries
    // data-cfg (path to endpoint JSON) + data-usecase-id (which case to
    // render). Cache configs we've already loaded — multiple examples
    // share the same endpoint JSON, no point re-fetching.
    const cfgCache = new Map();
    async function getCfg(url) {
      if (!cfgCache.has(url)) cfgCache.set(url, loadConfig(url));
      return cfgCache.get(url);
    }
    const exampleNodes = document.querySelectorAll(".wc-pg-example");
    for (const node of exampleNodes) {
      const url = node.dataset.cfg;
      const uid = node.dataset.usecaseId;
      const mount = node.querySelector(".wc-pg-mount") || node;
      if (!url || !uid) continue;
      try {
        const cfg = await getCfg(url);
        const uc = (cfg.use_cases || []).find(u => u && u.id === uid);
        if (!uc) {
          mount.innerHTML = `<p class="wc-pg-error">Use case '${uid}' not found in ${url}.</p>`;
          continue;
        }
        renderExample(mount, cfg, uc);
      } catch (e) {
        mount.innerHTML = `<p class="wc-pg-error">Example failed to load: ${e.message}</p>`;
      }
    }

    // ── Legacy single-form mount points (`.wc-playground`) ────────────
    // Only used by very old docs that haven't been rebuilt. New build.py
    // expands the MD marker into per-example sections instead.
    const nodes = document.querySelectorAll(".wc-playground");
    for (const node of nodes) {
      const url = node.dataset.cfg;
      if (!url) continue;
      try {
        const cfg = await getCfg(url);
        render(node, cfg);
      } catch (e) {
        node.innerHTML = `<p class="wc-playground-loading">Playground failed to load: ${e.message}</p>`;
      }
    }

    // Stacked-aggregator scroll-spy — highlight the TOC link for whichever
    // example card is currently in the viewport. Targets the new per-use-case
    // sections (`.wc-pg-example`) and the endpoint group headers
    // (`.wc-pg-endpoint`). Cheap IntersectionObserver, no scroll-event
    // throttling needed. Silent if no .wc-pg-toc exists (e.g. inline
    // playground inside an endpoint docs page).
    const toc = document.querySelector(".wc-pg-toc");
    if (toc) {
      const trackedSelector = ".wc-pg-example, .wc-pg-endpoint";
      const sections = document.querySelectorAll(trackedSelector);
      const links = new Map();
      toc.querySelectorAll("a").forEach(a => {
        const href = a.getAttribute("href") || "";
        if (href.startsWith("#")) links.set(href.slice(1), a);
      });

      // Click → scroll to the target section. We do this in JS (not relying on
      // the native #anchor jump) because the example cards render ASYNC: their
      // height — and therefore every anchor's position — changes after
      // hydrateAll() finishes. scrollIntoView() re-reads the layout at click
      // time, so it always lands on the right card (honors CSS scroll-margin-top
      // for the sticky nav). Also keeps the URL hash + active highlight in sync.
      toc.addEventListener("click", (ev) => {
        const a = ev.target.closest("a[href^='#']");
        if (!a) return;
        const id = decodeURIComponent((a.getAttribute("href") || "").slice(1));
        const target = id && document.getElementById(id);
        if (!target) return;            // fall back to native if id missing
        ev.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        try { history.replaceState(null, "", "#" + id); } catch (_) {}
        toc.querySelectorAll("a").forEach(x => x.classList.remove("active"));
        a.classList.add("active");
      });

      if (sections.length && "IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          for (const en of entries) {
            const link = links.get(en.target.id);
            if (!link) continue;
            if (en.isIntersecting) {
              toc.querySelectorAll("a").forEach(x => x.classList.remove("active"));
              link.classList.add("active");
            }
          }
        }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
        sections.forEach(s => io.observe(s));
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrateAll);
  } else {
    hydrateAll();
  }
})();
