---
slug: export-video
title: Exporting the final video
group: editing
order: 7
summary: "Press Export, work through any pre-export warnings, and download, publish, or share your video once rendering finishes."
updated: 2026-08-12
covers:
  - api:POST /v1/export_video
  - mcp:widecast_export_video
  - ui:export
sources:
  - gubo-remotion-player/js/editor_main.js (Export button, pre-export warning modal, Exporting status)
  - gubo-remotion-player/js/editor_extracted.js (Start Export confirmation, Exporting screen, Exported dialog, dubbing offer)
  - widecast/docs/endpoints/export-video.md (POST /v1/export_video reference)
  - widecast/mcp-server/src/index.ts (widecast_export_video confirmation gate)
---

Every scene in the editor has its own live preview, but the finished MP4 does not exist until you export. Exporting renders all your scenes into one polished video file, ready to download, publish, or share. Here is what happens at each step, and what to do if WideCast asks you to double-check something first.

## Start the export

Find the **Export** button at the end of your scene list. Pressing it opens a **Start Export?** confirmation explaining that WideCast will "Export all parts into a polished video with effects and transitions." Confirm with **Export Final Video (~10min)** to start rendering; that label doubles as your time estimate, since most exports finish in about ten minutes. Exporting uses credits, so it is worth a last look at your scenes before you confirm.

## Pre-export warnings

Before rendering starts, WideCast checks every scene for problems.

- If scenes are simply unfinished, for example narration that is AI-generated because you have not recorded your voice yet, or a scene still using placeholder media, you will see an **Incomplete Scenes Detected** warning. It lists which scenes need attention and why. Press **Export Anyway** to render with those scenes as they are, or close the warning and fix them first. Scene fixes are covered in [Scene editor basics](guide/scene-editor-basics.html).
- If a B-roll scene has no image or video attached at all, WideCast blocks the export completely, and there is no **Export Anyway** option for that case. Open the scene, add background media, and try exporting again.

## While your video renders

Once you confirm, the screen switches to **Exporting your video...** with a progress bar, a percentage, and a countdown timer. This is normal and lines up with the estimate shown on the confirm button. If you need to stop partway through, press **Stop Export**; a stopped export cannot resume, so starting again means rendering from the beginning.

## The Exported dialog

When rendering finishes, WideCast shows the **Exported** dialog. **Download** saves the MP4 straight to your device. **Publish** starts the publishing flow, covered in [Publish and schedule](guide/publish-and-schedule.html). **Share** gives you a link you can send to anyone. If you also want a version of your video in another language, the same dialog offers **Dubbing** for 20 Credits; see [Avatar and voice](guide/avatar-and-voice.html) for how dubbing works.

## Export again after edits

Made a change after exporting? Go back into the scene editor, edit what you need, then press **Export Again** on the Exported dialog, or **Export** in the editor, to render a fresh copy. The new export replaces the old one at the same link, so anyone you already shared it with sees the updated version once the new render finishes. Re-exporting uses credits again too, the same as the first export.

## Exporting through AI agents and the API

If you connect an AI agent to your WideCast account through the API or an MCP connector, it can trigger this same final render for you. The agent is required to ask you directly whether to render the final video now, and it can only proceed after you explicitly say yes to that specific export. Confirming once earlier in the conversation is not enough; the agent has to check with you again each time it renders. See [API and MCP](guide/api-and-mcp.html) for how to connect an agent to your account.

## Q&A
Q: What happens when I press "Export" in WideCast?
A: WideCast opens a "Start Export?" confirmation explaining that it will combine your scenes into one polished video. Confirm with "Export Final Video (~10min)" and rendering begins. A few minutes later, the "Exported" dialog gives you the finished MP4 to download, publish, or share.

Q: Why does WideCast warn me before exporting?
A: WideCast checks every scene first so you are not surprised by the result. If a scene is unfinished, using placeholder media, or relying on AI-generated narration because you have not recorded your voice, an "Incomplete Scenes Detected" warning lists exactly which scenes and why, before any credits are spent rendering them.

Q: What does "Export Anyway" do?
A: It renders the video even though the "Incomplete Scenes Detected" warning found scenes that are not fully finished. Those scenes are not skipped or removed; they render using their current fallback content, such as AI-generated narration or placeholder media, instead of blocking the export.

Q: Why can't I export my video at all?
A: If a B-roll scene has no image or video attached, WideCast blocks the export completely, and there is no "Export Anyway" option for that case. Open the scene, add a background image or video, and try exporting again.

Q: Why is my export taking so long?
A: A render typically takes about ten minutes, the same estimate shown on the "Export Final Video (~10min)" button. The "Exporting your video..." screen shows a progress bar, a percentage, and a countdown timer so you can see it is still working.

Q: Can I cancel an export while it is running?
A: Yes. Press "Stop Export" on the exporting screen. A stopped export cannot pick up where it left off, so starting again means rendering from the beginning.

Q: Where is my MP4 after exporting?
A: Once rendering finishes, WideCast shows the "Exported" dialog. Press "Download" there to save the MP4 to your device.

Q: Can I export the same video twice?
A: Yes. Press "Export Again" on the Exported dialog, or "Export" in the editor, any time you want a fresh render. The new export replaces the previous one at the same link, so anyone with that link sees the newest version.

Q: I edited my video after exporting. Do I need to export again?
A: Yes. Exporting only captures your scenes as they were at that moment, so any edits you make afterward will not appear in the MP4 you already downloaded or shared until you export again.

Q: Does exporting cost credits?
A: Yes. Exporting uses credits, and exporting again after edits uses credits again too. Check your balance under "Subscription & Credits" in the profile menu before starting a render.

Q: Can I translate my exported video into another language?
A: Yes. The "Exported" dialog offers "Dubbing" for 20 Credits right next to Download, Publish, and Share. It creates a version of your video narrated in another language.

Q: Can an AI agent export my video for me?
A: Yes, if you have connected one through the API or an MCP connector. The agent still has to ask you directly whether to render the final video, and it can only export after you explicitly confirm that specific request, not based on something you said earlier in the conversation.
