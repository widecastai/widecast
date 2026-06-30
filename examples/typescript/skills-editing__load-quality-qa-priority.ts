/**
 * 🎯 Kickoff core 5/5 — quality standard + video-level QA + priority
 *
 * Auto-generated from widecast/docs/playgrounds/skills-editing.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_skills_editing({
  "module": "ai_video_editor/05_quality_qa_priority"
});
console.log(resp);
