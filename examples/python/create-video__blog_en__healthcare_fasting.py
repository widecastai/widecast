"""
📰 Blog / Article · English — 🏥 Healthcare

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'blog',
  'language': 'English',
  'output_type': 'text',
  'video_length': 'short',
  'callback_url': '',
  'blog_text': 'Intermittent fasting has a reputation problem: half the people who try '
               'it swear it transformed their health, and the other half quietly '
               'gained weight and concluded it was a scam. Both groups are telling the '
               'truth, because the outcome depends entirely on mechanism and '
               'individual biology. The mechanism is real and well understood. Going '
               'roughly sixteen hours without food lowers circulating insulin, which '
               'allows the body to access and burn stored fat, and over time it helps '
               'reset the hunger hormones that drive constant snacking. That is the '
               'version that works. The failure mode is equally real and far more '
               'common than the success stories admit. When someone restricts their '
               'eating to a short window but then overeats inside it, the metabolic '
               'benefit evaporates. Skipping breakfast only to consume a '
               'thousand-calorie lunch defeats the entire point. Genetics complicate '
               'the picture further: roughly 30 percent of people carry a CLOCK gene '
               'variant that handles late-day eating poorly, which means the exact '
               'same fasting schedule produces different results in different bodies. '
               'If you tried intermittent fasting and gained weight, the usual culprit '
               'is not a lack of willpower. It is an eating window that is too short '
               'paired with meals that are too calorie-dense, a combination that '
               'practically guarantees a binge. The fix is to ease in rather than jump '
               'to the most aggressive schedule. Start with a fourteen-hour fast and a '
               'ten-hour eating window before attempting sixteen-eight. Build the '
               'habit and let your body adapt before stretching the fast. The schedule '
               'is a tool, not a moral test, and the right one is the one your biology '
               'can actually sustain.'})
print(resp)
