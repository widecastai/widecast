/**
 * 📜 Script · English — 🌱 Sustainability
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
  "script_text": "Electric vehicles aren't zero-emission, but they're still better. Building a Tesla emits about ten metric tons of CO2 mostly from battery production. Building a Camry emits about six metric tons. So an EV starts four tons in the hole. The break-even depends on your local grid. If you charge in California with renewables, you erase that gap in eighteen months. In West Virginia where coal dominates, it takes about five years. Over a fifteen-year lifespan, even a coal-charged EV emits half what a gas car emits. The honest answer isn't zero, it's still cleaner. If you live where the grid is dirty, push for cleaner power first, then EVs follow."
});
console.log(resp);
