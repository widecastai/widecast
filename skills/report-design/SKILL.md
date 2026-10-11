---
name: solo-agency-report-design
description: >-
  Use before generating, reviewing, or fixing any standalone HTML report rendered with
  `tool render-report` (the weekly CRM client report, the master digest, any other
  non-daily report). Adapts landing-page design discipline from leonxlnx/taste-skill
  into a report-specific, client-blind, print-safe standard. HTML only: no PDF is produced.
---

# Solo Agency Report Design Skill

This is the report-specific design module. Load it before rendering or repairing a
standalone HTML report, after the factual source record is ready and before writing HTML.

Scope: it governs standalone HTML reports rendered with `<bridge> tool render-report render`
(the weekly CRM client report, the master digest, any other non-daily report). The Daily
Report (`daily_report.md` + `daily_report.json`, Stage 6 "Daily Report Contract") is rendered
by the dashboard Daily Reports page and needs no skill load.

Source note: this module adapts the design-read, dial, anti-default, typography,
layout, and preflight discipline from `leonxlnx/taste-skill` for Solo Agency
reports. Do not treat the original landing-page skill as a runtime dependency.
This local module is the canonical report design rule.

## Design Read

Default reading:

```text
Reading this as: agency intelligence report for a busy owner/operator, with a polished editorial landing-page language, leaning toward standalone HTML, strong hierarchy, print-safe CSS, and no remote dependencies.
```

Report dials:

- `DESIGN_VARIANCE: 7` - use asymmetry, editorial spacing, visual contrast, and memorable section rhythm.
- `MOTION_INTENSITY: 1` - reports must be static and print-safe. Hover polish is allowed in HTML, but no required animation.
- `VISUAL_DENSITY: 6` - more information than a landing page, but never a raw data dump.

## Non-Negotiables

- The report must feel like a premium agency deliverable, not exported Markdown.
- The first viewport must work like a landing-page hero: report title, client/date context, decisive recommendation, source status, and 3-5 scan-friendly highlights.
- Client-facing reports remain client-blind. Do not mention Solo Agency, WideCast, PDNA/provider tooling, OpenAPI, MCP, Local Collector, Chrome extensions, automation/scheduled tasks, API keys, Telegram, agent/debug details, or `INTERNAL_REPORT`.
- No remote CSS, JavaScript, fonts, icons, images, tracking pixels, or CDNs.
- No fake static action buttons. Use links only when they go somewhere real.
- No raw Markdown dumps, plain default browser tables, or endless equal cards.
- No document-level horizontal scroll on 390px mobile. Only dedicated table wrappers may scroll.
- No long private data source excerpts or private source inventory in client-facing files.
- Print CSS stays readable without hover, copy buttons, collapses, or scripts (a reader may print the page from the browser). No PDF file is produced or promised.

## Required Report Shape

Use this order unless a specific client/report language requires a natural local
translation:

1. Hero: report promise, date, source status, top recommendation, confidence.
2. Executive snapshot: what changed, why it matters, what to do next.
3. Source coverage and data quality: which sources were read and any coverage limit.
4. Evidence ledger: compact, reference-linked, confidence-labeled.
5. Lead & Competitor Opportunities: clear opportunity cards or a mobile-safe table.
6. Idea Matrix: grouped by audience value, pain point, source signal, and business fit.
7. Best idea: one recommended action with rationale and approval state.
8. Draft/recommendation: polished review blocks, not raw prompt output.
9. Limits and blockers: client-safe coverage limits and next action.

A report is one standalone HTML file. Do not make the reader open sibling HTML
files; anything the reader needs is an anchor inside the same file.

## Visual System

Use a report-native visual language:

- Typography: modern sans stack by default. Avoid making the report look like a browser default or terminal dump.
- Color: one strong accent plus neutral ink/paper surfaces. Avoid generic AI purple/blue gradients and one-note beige/slate palettes.
- Layout: asymmetric hero, metric strip, editorial section headers, evidence cards, and deliberate whitespace.
- Cards: use cards for repeated items only. Do not put cards inside cards.
- Tables: use tables only for real comparison/ledger data. Wrap in `.table-scroll` and make them readable in print.
- Numbers: use real collected counts only. Do not invent fake-precise metrics for visual effect.
- References: every claim/lead/competitor/draft idea should carry a visible source URL or a clear unavailable note.
- Language: crisp, useful, no filler. The reader should know the next action within 60 seconds.

## Renderer Contract

Use the bridge's built-in renderer instead of writing ad hoc Python, shell, or
browser scripts during each run. It is part of the Go bridge binary: there is no
Python renderer and nothing to install.

```sh
<bridge> tool render-report render --input REPORT.md --output-html REPORT.html --title "Report Title" --client-name "Client Name" --report-kind "Weekly Client Report" --client-facing --fail-on-scrub
```

`--input` and `--output-html` are required; `--title`, `--client-name`, `--report-kind`,
`--report-date`, `--subtitle` and `--status-note` are optional. `--client-facing
--fail-on-scrub` runs the Client-Blind Scrub Gate: on a hit the real output file is
NOT written, a `REPORT.blocked.html` sidecar is, and the command exits 3 - fix the
source and re-run, and never deliver a `.blocked.html`. Pass those two flags only for a
report a client will read; an operator-only report is rendered WITHOUT them. Every run
writes `REPORT.html.render_status.json`; decide success from the exit code, never from
file existence. HTML is the only output: do not pass `--output-pdf`, and do not promise
a PDF.

Allowed deviations:

- If the renderer fails, log the exact blocker (command, exit code, stderr line) and tell the human. Do not replace it with a one-off report script.
- If a client has a custom approved report template, it may be layered into the renderer or a named reusable template file. Do not improvise a new unnamed renderer during the run.

## Preflight

Before handing off any report:

- [ ] Loaded this module and Stage 6 in the current turn/run.
- [ ] Used `<bridge> tool render-report render` or logged why the reusable renderer was unavailable.
- [ ] HTML is standalone, mobile-friendly, and visually polished.
- [ ] The first viewport has a useful hero, not a file title plus wall of text.
- [ ] The HTML does not link out to sibling HTML files; any such references are internal section anchors or plain labels.
- [ ] Client-facing HTML was rendered with `--client-facing --fail-on-scrub` and exited 0 (no `.blocked.html`).
- [ ] No PDF was produced or promised.
- [ ] `INTERNAL_REPORT` contains all operations/provider/debug details excluded from client-facing files.
- [ ] No fake buttons, remote dependencies, raw Markdown dump, or mobile body overflow.
