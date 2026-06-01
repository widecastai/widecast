# @widecast/mcp-server

Model Context Protocol (MCP) server for [WideCast.ai](https://widecast.ai). Drop
WideCast's video-generation tools into **Claude Desktop**, **Claude Code**,
**Cursor**, **Windsurf**, or any MCP-compatible host so your AI can make videos
from a conversation.

Pair it with the **WideCast authoring Skills** (video / blog / social) — the Skill
teaches the model to write a great script; this server turns it into a real video.

Tools exposed:

- `widecast_create_video` — create a video from a script (`source=text`), an idea
  (`source=idea`), an article (`source=blog`), or a YouTube/TikTok/Facebook link
  (`source=video_url` / `audio_url`). Choose `output_type` = `scene` / `video` / `text`.
- `widecast_get_status` — poll a video until `completed`; returns `review_url` /
  `video_url`.
- `widecast_export_video` — render the final MP4 for a `scene` video after review.

## Install

**Not yet on npm — run it from this repo (one time):**

```bash
cd widecast/mcp-server
npm install            # fetches @modelcontextprotocol/sdk; dist/index.js is prebuilt
node dist/index.js     # quick check — should print "[widecast-mcp] vX ready"; Ctrl-C to stop
```

Then point your host's config at the absolute path of `dist/index.js` (below).
*(After we publish to npm, `npx -y @widecast/mcp-server` will work instead.)*

The server is **self-contained** — it calls the WideCast REST API directly, so the
only dependency is `@modelcontextprotocol/sdk`. To rebuild after editing `src/`:
`npm run build`.

## Configure

### Claude Desktop
Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or
`%APPDATA%/Claude/claude_desktop_config.json` (Windows), then restart Claude:

```json
{
  "mcpServers": {
    "widecast": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/widecast/mcp-server/dist/index.js"],
      "env": { "WIDECAST_API_KEY": "wc_live_REPLACE_ME" }
    }
  }
}
```

### Cursor — `~/.cursor/mcp.json`
```json
{
  "mcpServers": {
    "widecast": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/widecast/mcp-server/dist/index.js"],
      "env": { "WIDECAST_API_KEY": "wc_live_REPLACE_ME" }
    }
  }
}
```

### Claude Code
```bash
claude mcp add widecast node /ABSOLUTE/PATH/TO/widecast/mcp-server/dist/index.js --env WIDECAST_API_KEY=wc_live_REPLACE_ME
```

## Use in conversation

After restarting your host:

> **You:** "Make me a short video about why California parents should let their teen
> get a driver's license at 16."
>
> **Agent:** writes a script (best with the WideCast video-script Skill installed) →
> calls `widecast_create_video` (`source=text`, `output_type=video`) → polls
> `widecast_get_status` until `completed` → shares the `video_url`.

## Environment variables

| Var | Default | Purpose |
|---|---|---|
| `WIDECAST_API_KEY` | — | Your `wc_live_*` API key (create one in your WideCast dashboard) |
| `WIDECAST_BASE_URL` | `https://widecast.ai/app/dashboard2` | Override for staging / self-hosted |

## Build from source
```bash
npm install && npm run build && node dist/index.js
```

## License
Apache-2.0.
