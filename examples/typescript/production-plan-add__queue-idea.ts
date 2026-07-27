/**
 * 📝 Queue an idea into the plan
 *
 * Auto-generated from widecast/docs/playgrounds/production-plan-add.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_production_plan_add({
  "idea_text": "Why estate planning matters for young families",
  "description": "Hook on the 40% who die intestate; CTA to book a consult.",
  "source": "idea"
});
console.log(resp);
