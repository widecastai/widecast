/**
 * 📚 Load the master SKILL.md + the live module index
 *
 * Auto-generated from widecast/docs/playgrounds/skills-editing.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_skills_editing({});
console.log(resp);
