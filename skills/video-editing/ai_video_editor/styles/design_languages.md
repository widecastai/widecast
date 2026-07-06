# Design language selector — compact visual grammar for overlays

_Version: `modular-1.1` · style module of the AI Video Editor Playbook._

This is the **visual language reference** used by the SVG engine and by explicit endpoint/overlay polish requests. The fast video-editing skill does not load this file by default and does not judge scenes by these aesthetics.

> **HOW TO USE — short.** Use this only when the user explicitly asks for visual polish or when an objective endpoint/overlay defect requires a rebuild. Pick ONE language as a design direction, then render the scene's pattern. In fast blind-spot QA, do not load this file merely to judge taste.
>
> **Fast-scope guard:** never fail a scene only because it does not match one of these languages. Copy correctness and background fit live in the fast gates; visual language is only for explicit rebuild/polish work.
>
> **Endpoint use.** Scene 2, thumbnail, and final CTA do not automatically load this file in fast mode. Load it only for an explicit endpoint rebuild/polish request or an unrecoverable objective endpoint defect.

<!-- SYNC_DEFAULT_POOL (machine-read by svg_skill_sync.py — the server's default
     rotation when no vibe is known; edit freely, keep names backticked):
     `flat_swiss_modern`, `soft_depth_floating_cards`, `liquid_glass_glossy`,
     `broadcast_serious_tv`, `editorial_magazine`, `corporate_duotone`,
     `data_lab_technical`, `warm_humanist`, `minimal_mono_premium`,
     `blue_cyan_fintech`, `modern_experimental_split`, `embossed_3d_sticker` -->

## Selection Rules

- Serious finance/legal/insurance/health/trust → `broadcast_serious_tv`, `luxury_authority`, `corporate_duotone`, `medical_clean`, `minimal_mono_premium`, `blue_cyan_fintech`.
- Tech/data/security/AI → `data_lab_technical`, `cyan_hologram_interface`, `cyberpunk_neon`, `neon_laser_grid`, `retro_futurist`, `blue_cyan_fintech`.
- Youth/creator/entertainment → `kinetic_youth_creator`, `cartoon_bold_pop`, `comic_halftone_pop`, `anime_speedline_hero`, `anime_cute_kawaii`, `acid_gradient_modern`.
- Premium/luxury/authority → `luxury_authority`, `luxury_black_gloss`, `minimal_mono_premium`, `editorial_magazine`, `holographic_foil`, `chrome_3d_glossy`.
- Warm education/care/community → `warm_humanist`, `organic_paper_cutout`, `soft_depth_floating_cards`, `social_proof_trust`, `medical_clean`.
- Urgent/news/real-world warning → `broadcast_serious_tv`, `documentary_grit`, `neo_brutalist_editorial`, `sports_energy` only when energy fits.

## Language Menu

| language | best for | grammar tokens |
|---|---|---|
| `flat_swiss_modern` | clean explainers, SaaS, systems | grid, flat blocks, strict alignment, one accent |
| `soft_depth_floating_cards` | calm education, friendly product | soft cards, rounded corners, quiet shadow, warm contrast |
| `liquid_glass_glossy` | modern tech, premium creator | translucent panels, glossy highlights, soft glow, gradient title |
| `embossed_3d_sticker` | short-form punch, energetic hooks | sticker outline, chunky title, hard shadow, big badges |
| `broadcast_serious_tv` | finance/legal/news/insurance | lower-third bars, red/blue/white, condensed headline, authority |
| `editorial_magazine` | openings, thought leadership | serif/sans contrast, asymmetry, cover-line, negative space |
| `kinetic_youth_creator` | creator economy, viral tips | stacked words, diagonal slashes, pop colors, short copy |
| `luxury_authority` | premium trust, advisory | deep neutrals, gold accent, restrained serif, wide spacing |
| `neo_brutalist_editorial` | blunt claim, contrarian point | hard boxes, thick black strokes, acid accent, raw layout |
| `minimal_mono_premium` | understated authority | mono palette, hairline frame, tiny metadata, lots of space |
| `retro_futurist` | tech nostalgia, future signal | sunset gradient, horizon/grid, condensed title, neon accent |
| `cyberpunk_neon` | security, AI, high-alert tech | dark panel, magenta/cyan neon, scan lines, sharp borders |
| `organic_paper_cutout` | human, local, care | paper shapes, earth colors, tactile cards, soft irregularity |
| `corporate_duotone` | B2B, operations, sales | two-color system, clean panels, stable metrics, boardroom safe |
| `data_lab_technical` | analytics, proof, engineering | mono type, grid, terminal frame, precise bars/readouts |
| `warm_humanist` | coaching, education, care | warm tones, rounded forms, soft cards, approachable title |
| `medical_clean` | health, safety, procedure | white/cyan, clean checklist, low anxiety, high clarity |
| `sports_energy` | performance, fitness, competition | speed lines, heavy condensed title, score-card energy |
| `social_proof_trust` | testimonials, proof, reviews | stars/seal, white quote card, green trust accent |
| `documentary_grit` | case study, warning, real-world | rough bars, field-note stamp, stark red/black, evidence tone |
| `modern_experimental_split` | disruptive modern brand | asymmetric split planes, graphic tension, acid accent |
| `cartoon_bold_pop` | playful explainer, kids/consumer | speech cloud, thick outline, bright fills, friendly shapes |
| `comic_halftone_pop` | punchy reveal, simple claim | halftone dots, burst, speech bubble, comic title |
| `anime_speedline_hero` | peak moment, dramatic claim | speed lines, burst glow, outlined hero title, high drama |
| `neon_laser_grid` | focus, future, action | laser strokes, dark tech panel, cyan/magenta glow |
| `cyan_hologram_interface` | cool tech, dashboard, scan | cyan HUD frame, mono readouts, radar rings, translucent panel |
| `chrome_3d_glossy` | premium tech, high impact | chrome gradient, glossy plate, metallic title, strong shadow |
| `holographic_foil` | premium creator, fashion, launch | iridescent foil, angled card, black pill, soft shine |
| `toy_clay_3d` | friendly product, education | clay gradients, rounded 3D blobs, soft white card |
| `y2k_chrome_pop` | internet culture, youth nostalgia | chrome pastel, orbit rings, bubble pill, playful gloss |
| `acid_gradient_modern` | edgy launch, music, creator | acid gradient plane, black tag, club-energy contrast |
| `blue_cyan_fintech` | fintech, SaaS, credible tech | cyan header, clean metric line, white panel, restrained glow |
| `glossy_bubblegum_3d` | social, beauty, fun | glossy bubbles, pink/cyan, pill card, soft highlight |
| `luxury_black_gloss` | premium close, luxury trust | black gloss plate, gold rule, serif title, polished restraint |
| `anime_cute_kawaii` | cute consumer, playful education | pastel face card, rounded title, sparkles, soft pop |

## Apply

Use the chosen language to decide **surface, shape, title treatment, palette, density, and decoration**. Then keep the content pattern honest: chart stays chart, checklist stays checklist, quote stays quote. If the language makes text smaller, face unclear, caption crowded, or copy wrong, the Universal Standard wins.
