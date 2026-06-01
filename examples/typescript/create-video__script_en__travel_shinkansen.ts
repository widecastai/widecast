/**
 * 📜 Script · English — ✈️ Travel
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
  "script_text": "Japan's Shinkansen has carried ten billion passengers in sixty years, with zero passenger deaths from accidents. The US Amtrak system, much smaller, has had over a hundred fatal incidents in the same period. Three engineering choices made this possible. Dedicated tracks, bullet trains never share rail with freight or commuter trains. Automatic train control overrides the driver if speed exceeds the limit. Earthquake detection cuts power within one second of seismic waves, before the train even feels the shake. The cost is enormous. Japan spent the equivalent of half a trillion dollars over six decades on rail. The result is the safest mass transit system humans have built."
});
console.log(resp);
