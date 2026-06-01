/**
 * 📜 Script · English — 💰 Finance
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "text",
  "output_type": "scene",
  "faceless": false,
  "callback_url": "",
  "script_text": "Starting your Roth IRA at twenty-five versus thirty-five costs you exactly one million dollars at retirement. Both people contribute the same six thousand a year. Both earn the same seven percent annual return. The only difference is ten years. The twenty-five-year-old ends with two point four million by age sixty-five. The thirty-five-year-old ends with one point one million. Compound interest is principal times one plus rate to the power of years. The years exponent is what matters most. Even if you can only afford a hundred dollars a month at twenty-five, do it. The math punishes waiting more than it punishes low contributions. Open the account this week. Most brokerages take ten minutes."
});
console.log(resp);
