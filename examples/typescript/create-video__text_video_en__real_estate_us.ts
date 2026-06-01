/**
 * 🎬 Script → Final MP4 · English — 🏠 Real Estate
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "text",
  "output_type": "video",
  "callback_url": "https://widecast.ai/app/dashboard2/webhook_to_telegram",
  "script_text": "Stop renting in the Bay Area until you've seen this number. Median home price is one point four million dollars, mortgage rates are seven percent, and you'll need at least two hundred thousand down. But here's what most people miss. Renting a two-bedroom in San Jose costs forty-two hundred a month and goes nowhere. Buying the same house, even with mortgage and tax, locks in fifty percent of that as equity over ten years. Three things kill first-time buyers in California: hidden closing costs that hit thirty thousand, property tax reassessment after purchase, and HOA fees that creep up six percent yearly. If you're earning over a hundred and eighty thousand, the math actually favors buying. Talk to a local mortgage broker before another rent check disappears."
});
console.log(resp);
