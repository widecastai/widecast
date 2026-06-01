/**
 * 📜 Script · English — 🍞 Cooking
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
  "script_text": "Your sourdough is dense because three things are wrong, not one. Hydration matters more than recipe. Most beginners use sixty-five percent hydration, expert bakers go seventy-five to eighty. Higher water means more steam during the bake, more steam means open crumb. Temperature controls fermentation speed. At twenty-eight degrees Celsius your starter doubles in three hours, at room temperature it takes ten. Most home doughs are under-fermented because the kitchen is cold. Shape matters too. Loose shaping kills surface tension; the loaf flattens instead of rising. Build a tight skin in final shaping. Bake hot, two hundred fifty Celsius with steam for the first ten minutes. Crust forms last, oven spring happens first."
});
console.log(resp);
