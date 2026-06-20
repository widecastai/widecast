/**
 * 📜 Script · English — 🛡 L&H Insurance
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.create_video({
  "source": "text",
  "output_type": "scene",
  "faceless": false,
  "callback_url": "",
  "script_text": "Whole life insurance costs five to fifteen times more than term life for the same death benefit. A healthy thirty-year-old pays twenty dollars a month for half a million in term coverage over twenty years. The same person pays two hundred dollars a month for whole life. The agent will tell you whole life builds cash value. That cash value typically returns one to three percent over decades, worse than a basic index fund. Term life covers the years your kids depend on you. Whole life is mostly a commission product. If you want investing, invest. If you want protection during high-responsibility years, buy term. Most families need term, not whole."
});
console.log(resp);
