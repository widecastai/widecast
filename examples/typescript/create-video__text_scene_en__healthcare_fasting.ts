/**
 * 📜 Script → Scenes · English — 🏥 Healthcare
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "text",
  "output_type": "scene",
  "script_text": "Intermittent fasting works for half the people who try it, and fails for the other half. The mechanism is real. Sixteen hours without food drops insulin, lets stored fat get used, and resets hunger hormones. The fail mode is also real. People in calorie deficit during the eating window can binge in the four-hour eating window. Skipping breakfast then eating a thousand-calorie lunch defeats the metabolic benefit. Genetics matter too, about thirty percent of people have a CLOCK gene variant that handles late-day eating poorly. If you've tried intermittent fasting and gained weight, your eating window is too short and your meals are too dense. Try fourteen-ten before sixteen-eight. Build the habit before stretching the fast."
});
console.log(resp);
