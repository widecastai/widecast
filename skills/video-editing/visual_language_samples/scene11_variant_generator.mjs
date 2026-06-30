import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = new URL('./scene11_variants/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });

const xml = (s) => `<?xml version="1.0" encoding="UTF-8"?>\n${s.trim()}\n`;

const commonDefs = `
  <filter id="shadowSoft" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#111827" flood-opacity="0.25"/>
  </filter>
  <filter id="shadowHard" x="-10%" y="-10%" width="130%" height="130%">
    <feDropShadow dx="10" dy="12" stdDeviation="0" flood-color="#111827" flood-opacity="0.42"/>
  </filter>
  <filter id="glowCyan" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#22D3EE" flood-opacity="0.78"/>
  </filter>
  <filter id="glowPink" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#F472B6" flood-opacity="0.82"/>
  </filter>
  <linearGradient id="glassGrad" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0" stop-color="#ECFEFF" stop-opacity="0.86"/>
    <stop offset="1" stop-color="#A78BFA" stop-opacity="0.48"/>
  </linearGradient>
  <linearGradient id="acidGrad" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0" stop-color="#D9F99D"/>
    <stop offset="0.55" stop-color="#22D3EE"/>
    <stop offset="1" stop-color="#F472B6"/>
  </linearGradient>
  <linearGradient id="luxGold" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="#F5D061"/>
    <stop offset="1" stop-color="#B45309"/>
  </linearGradient>
  <linearGradient id="chrome" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0" stop-color="#FFFFFF"/>
    <stop offset="0.28" stop-color="#94A3B8"/>
    <stop offset="0.52" stop-color="#F8FAFC"/>
    <stop offset="0.76" stop-color="#64748B"/>
    <stop offset="1" stop-color="#E0F2FE"/>
  </linearGradient>
  <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
    <circle cx="4" cy="4" r="3" fill="#111827" opacity="0.16"/>
  </pattern>
  <style>
    text { font-family: "Be Vietnam Pro Black", "Inter Black", Arial, sans-serif; }
    .title { font-size:58px; font-weight:900; letter-spacing:0; }
    .label { font-size:40px; font-weight:900; letter-spacing:0; }
    .small { font-size:31px; font-weight:900; letter-spacing:0; }
    .rule { font-size:36px; font-weight:900; letter-spacing:0; }
  </style>`;

function baseSvg(body, extraDefs = '') {
  return xml(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280" data-wc-ani="all">
  <defs>${commonDefs}${extraDefs}</defs>
  ${body}
</svg>`);
}

function iconPair({ leftStroke = '#0F766E', rightStroke = '#B91C1C', markFill = 'none', style = '' } = {}) {
  return `
  <g data-wc-object="left_check" data-wc-kind="mark" data-wc-anim="pop" data-wc-z="5" ${style}>
    <circle cx="199" cy="558" r="72" fill="${markFill === 'none' ? '#D1FAE5' : markFill}" stroke="${leftStroke}" stroke-width="8"/>
    <path d="M156 558L188 592L246 520" fill="none" stroke="${leftStroke}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g data-wc-object="right_cross" data-wc-kind="mark" data-wc-anim="pop" data-wc-z="5" ${style}>
    <circle cx="521" cy="558" r="72" fill="${markFill === 'none' ? '#FEE2E2' : markFill}" stroke="${rightStroke}" stroke-width="8"/>
    <path d="M482 518L560 596M560 518L482 596" fill="none" stroke="${rightStroke}" stroke-width="23" stroke-linecap="round"/>
  </g>`;
}

const variants = {
  broadcast_serious_tv: baseSvg(`
  <g data-wc-object="title_bar" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="1" filter="url(#shadowSoft)">
    <rect x="38" y="128" width="644" height="92" rx="8" fill="#0B1F3A"/>
    <rect x="38" y="220" width="644" height="72" rx="8" fill="#B91C1C"/>
    <text x="64" y="196" class="title" fill="#FFFFFF">KHÔNG TỰ ĐỘNG</text>
    <text x="64" y="272" class="title" fill="#FFFFFF">CẬP NHẬT</text>
  </g>
  <g data-wc-object="broadcast_panels" data-wc-kind="object" data-wc-anim="fade" data-wc-z="2" filter="url(#shadowSoft)">
    <rect x="54" y="356" width="288" height="378" rx="12" fill="#FFFFFF" stroke="#0B1F3A" stroke-width="6"/>
    <rect x="378" y="356" width="288" height="378" rx="12" fill="#FFFFFF" stroke="#B91C1C" stroke-width="6"/>
    <rect x="54" y="356" width="288" height="74" fill="#0B1F3A"/>
    <rect x="378" y="356" width="288" height="74" fill="#B91C1C"/>
  </g>
  <g data-wc-object="broadcast_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="90" y="408" class="label" fill="#FFFFFF">NĂM NGOÁI</text>
    <text x="404" y="408" class="label" fill="#FFFFFF">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#0B1F3A">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#0B1F3A">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#059669', rightStroke: '#DC2626' })}
  <g data-wc-object="lower_third" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3" filter="url(#shadowSoft)">
    <rect x="58" y="792" width="604" height="104" rx="8" fill="#0B1F3A"/>
    <rect x="58" y="792" width="16" height="104" fill="#B91C1C"/>
    <text x="92" y="858" class="rule" fill="#FFFFFF">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`),

  luxury_authority: baseSvg(`
  <g data-wc-object="title_plate" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="1" filter="url(#shadowSoft)">
    <rect x="58" y="128" width="604" height="178" rx="18" fill="#11100E" opacity="0.96"/>
    <rect x="88" y="152" width="544" height="5" fill="url(#luxGold)"/>
    <text x="90" y="214" class="title" fill="#F8FAFC">KHÔNG TỰ ĐỘNG</text>
    <text x="90" y="276" class="title" fill="#F5D061">CẬP NHẬT</text>
  </g>
  <g data-wc-object="lux_panels" data-wc-kind="object" data-wc-anim="fade" data-wc-z="2" filter="url(#shadowSoft)">
    <rect x="62" y="372" width="278" height="360" rx="18" fill="#FFFDF7" stroke="#B45309" stroke-width="4"/>
    <rect x="380" y="372" width="278" height="360" rx="18" fill="#FFFDF7" stroke="#7F1D1D" stroke-width="4"/>
    <path d="M94 448H308M412 448H626" stroke="#D97706" stroke-width="3"/>
  </g>
  <g data-wc-object="lux_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="92" y="426" class="label" fill="#92400E">NĂM NGOÁI</text>
    <text x="430" y="426" class="label" fill="#7F1D1D">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#11100E">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#11100E">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#047857', rightStroke: '#991B1B' })}
  <g data-wc-object="lux_rule" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3" filter="url(#shadowSoft)">
    <rect x="82" y="794" width="556" height="102" rx="18" fill="#11100E" opacity="0.94"/>
    <rect x="116" y="815" width="488" height="4" fill="url(#luxGold)"/>
    <text x="126" y="864" class="rule" fill="#F8FAFC">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`),

  minimal_mono_premium: baseSvg(`
  <g data-wc-object="mono_frame" data-wc-kind="object" data-wc-anim="fade" data-wc-z="1">
    <rect x="52" y="128" width="616" height="768" rx="0" fill="#FFFFFF" opacity="0.88"/>
    <rect x="70" y="146" width="580" height="732" fill="none" stroke="#111827" stroke-width="3"/>
    <path d="M360 370V734" stroke="#111827" stroke-width="3"/>
  </g>
  <g data-wc-object="mono_title" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="2">
    <text x="92" y="216" class="title" fill="#111827">KHÔNG TỰ ĐỘNG</text>
    <text x="92" y="280" class="title" fill="#111827">CẬP NHẬT</text>
    <text x="92" y="330" font-size="24" font-weight="900" fill="#6B7280">ANNUAL NOTICE CHECK</text>
  </g>
  <g data-wc-object="mono_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="96" y="426" class="label" fill="#111827">NĂM NGOÁI</text>
    <text x="424" y="426" class="label" fill="#111827">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#111827">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#111827">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#111827', rightStroke: '#111827', markFill: '#FFFFFF' })}
  <g data-wc-object="mono_rule" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3">
    <rect x="82" y="798" width="556" height="96" rx="0" fill="#111827"/>
    <text x="126" y="862" class="rule" fill="#FFFFFF">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`),

  flat_swiss_modern: baseSvg(`
  <g data-wc-object="swiss_title" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="1">
    <rect x="54" y="128" width="612" height="178" rx="0" fill="#F8FAFC"/>
    <rect x="54" y="128" width="26" height="178" fill="#2563EB"/>
    <text x="104" y="212" class="title" fill="#111827">KHÔNG TỰ ĐỘNG</text>
    <text x="104" y="276" class="title" fill="#2563EB">CẬP NHẬT</text>
  </g>
  <g data-wc-object="swiss_panels" data-wc-kind="object" data-wc-anim="fade" data-wc-z="2">
    <rect x="58" y="372" width="282" height="360" rx="0" fill="#ECFDF5"/>
    <rect x="380" y="372" width="282" height="360" rx="0" fill="#FEF2F2"/>
    <rect x="58" y="372" width="282" height="10" fill="#059669"/>
    <rect x="380" y="372" width="282" height="10" fill="#DC2626"/>
  </g>
  <g data-wc-object="swiss_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="92" y="426" class="label" fill="#047857">NĂM NGOÁI</text>
    <text x="430" y="426" class="label" fill="#B91C1C">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#111827">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#111827">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#059669', rightStroke: '#DC2626' })}
  <g data-wc-object="swiss_rule" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3">
    <rect x="82" y="794" width="556" height="104" rx="0" fill="#2563EB"/>
    <text x="126" y="860" class="rule" fill="#FFFFFF">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`),

  soft_depth_floating_cards: baseSvg(`
  <g data-wc-object="soft_title" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="1" filter="url(#shadowSoft)">
    <rect x="54" y="126" width="612" height="180" rx="34" fill="#FFF7ED" opacity="0.94"/>
    <circle cx="616" cy="158" r="26" fill="#FDBA74"/>
    <text x="92" y="212" class="title" fill="#7C2D12">KHÔNG TỰ ĐỘNG</text>
    <text x="92" y="276" class="title" fill="#EA580C">CẬP NHẬT</text>
  </g>
  <g data-wc-object="soft_cards" data-wc-kind="object" data-wc-anim="fade" data-wc-z="2" filter="url(#shadowSoft)">
    <rect x="58" y="372" width="282" height="360" rx="34" fill="#FFFFFF" opacity="0.96"/>
    <rect x="380" y="372" width="282" height="360" rx="34" fill="#FFFFFF" opacity="0.96"/>
    <circle cx="88" cy="402" r="18" fill="#86EFAC"/>
    <circle cx="410" cy="402" r="18" fill="#FCA5A5"/>
  </g>
  <g data-wc-object="soft_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="92" y="426" class="label" fill="#166534">NĂM NGOÁI</text>
    <text x="430" y="426" class="label" fill="#991B1B">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#292524">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#292524">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#16A34A', rightStroke: '#EF4444' })}
  <g data-wc-object="soft_rule" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3" filter="url(#shadowSoft)">
    <rect x="82" y="794" width="556" height="104" rx="34" fill="#7C2D12"/>
    <text x="126" y="860" class="rule" fill="#FFFFFF">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`),

  liquid_glass_glossy: baseSvg(`
  <g data-wc-object="glass_title" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="1" filter="url(#shadowSoft)">
    <rect x="54" y="126" width="612" height="180" rx="32" fill="url(#glassGrad)" stroke="#FFFFFF" stroke-width="4" opacity="0.9"/>
    <path d="M82 158C174 134 280 138 356 160C452 188 534 176 638 148" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.55"/>
    <text x="92" y="212" class="title" fill="#0F172A">KHÔNG TỰ ĐỘNG</text>
    <text x="92" y="276" class="title" fill="#4C1D95">CẬP NHẬT</text>
  </g>
  <g data-wc-object="glass_cards" data-wc-kind="object" data-wc-anim="fade" data-wc-z="2" filter="url(#shadowSoft)">
    <rect x="58" y="372" width="282" height="360" rx="32" fill="#F0FDFA" opacity="0.86" stroke="#FFFFFF" stroke-width="4"/>
    <rect x="380" y="372" width="282" height="360" rx="32" fill="#FFF1F2" opacity="0.86" stroke="#FFFFFF" stroke-width="4"/>
  </g>
  <g data-wc-object="glass_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="92" y="426" class="label" fill="#0F766E">NĂM NGOÁI</text>
    <text x="430" y="426" class="label" fill="#BE123C">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#0F172A">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#0F172A">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#14B8A6', rightStroke: '#F43F5E' })}
  <g data-wc-object="glass_rule" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3" filter="url(#shadowSoft)">
    <rect x="82" y="794" width="556" height="104" rx="32" fill="#0F172A" opacity="0.86" stroke="#FFFFFF" stroke-width="3"/>
    <text x="126" y="860" class="rule" fill="#FFFFFF">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`),

  data_lab_technical: baseSvg(`
  <g data-wc-object="lab_grid" data-wc-kind="object" data-wc-anim="fade" data-wc-z="1">
    <rect x="46" y="124" width="628" height="774" rx="14" fill="#031B2D" opacity="0.92"/>
    <path d="M78 164H642M78 244H642M78 324H642M78 404H642M78 484H642M78 564H642M78 644H642M78 724H642M78 804H642" stroke="#164E63" stroke-width="2" opacity="0.5"/>
    <path d="M160 144V878M280 144V878M400 144V878M520 144V878" stroke="#164E63" stroke-width="2" opacity="0.5"/>
  </g>
  <g data-wc-object="lab_title" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="2">
    <text x="78" y="214" class="title" fill="#67E8F9">KHÔNG TỰ ĐỘNG</text>
    <text x="78" y="278" class="title" fill="#FFFFFF">CẬP NHẬT</text>
    <text x="80" y="326" font-size="24" font-weight="900" fill="#94A3B8">STATUS: MANUAL RENEWAL REQUIRED</text>
  </g>
  <g data-wc-object="lab_panels" data-wc-kind="object" data-wc-anim="fade" data-wc-z="2">
    <rect x="58" y="372" width="282" height="360" rx="10" fill="#082F49" stroke="#22C55E" stroke-width="4"/>
    <rect x="380" y="372" width="282" height="360" rx="10" fill="#082F49" stroke="#EF4444" stroke-width="4"/>
  </g>
  <g data-wc-object="lab_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="92" y="426" class="label" fill="#86EFAC">NĂM NGOÁI</text>
    <text x="430" y="426" class="label" fill="#FCA5A5">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#FFFFFF">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#FFFFFF">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#22C55E', rightStroke: '#EF4444', markFill: '#031B2D', style: 'filter="url(#glowCyan)"' })}
  <g data-wc-object="lab_rule" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3">
    <rect x="82" y="794" width="556" height="104" rx="10" fill="#0E7490"/>
    <text x="126" y="860" class="rule" fill="#FFFFFF">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`),

  neon_laser_grid: baseSvg(`
  <g data-wc-object="laser_base" data-wc-kind="object" data-wc-anim="fade" data-wc-z="1">
    <rect x="44" y="124" width="632" height="774" rx="24" fill="#050014" opacity="0.94"/>
    <path d="M72 856L360 128L648 856M112 856L360 208L608 856M152 856L360 304L568 856" stroke="#22D3EE" stroke-width="3" opacity="0.38"/>
    <path d="M72 760H648M92 680H628M112 600H608M132 520H588M152 440H568" stroke="#F472B6" stroke-width="3" opacity="0.32"/>
  </g>
  <g data-wc-object="laser_title" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="2" filter="url(#glowCyan)">
    <text x="80" y="214" class="title" fill="#E0F2FE">KHÔNG TỰ ĐỘNG</text>
    <text x="80" y="278" class="title" fill="#22D3EE">CẬP NHẬT</text>
  </g>
  <g data-wc-object="laser_cards" data-wc-kind="object" data-wc-anim="fade" data-wc-z="2">
    <rect x="58" y="372" width="282" height="360" rx="20" fill="#0F172A" opacity="0.84" stroke="#22D3EE" stroke-width="5"/>
    <rect x="380" y="372" width="282" height="360" rx="20" fill="#0F172A" opacity="0.84" stroke="#F472B6" stroke-width="5"/>
  </g>
  <g data-wc-object="laser_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="92" y="426" class="label" fill="#67E8F9">NĂM NGOÁI</text>
    <text x="430" y="426" class="label" fill="#FDA4AF">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#FFFFFF">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#FFFFFF">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#22D3EE', rightStroke: '#F472B6', markFill: '#050014', style: 'filter="url(#glowPink)"' })}
  <g data-wc-object="laser_rule" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3" filter="url(#glowCyan)">
    <rect x="82" y="794" width="556" height="104" rx="18" fill="#111827" stroke="#22D3EE" stroke-width="4"/>
    <text x="126" y="860" class="rule" fill="#FFFFFF">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`),

  cartoon_bold_pop: baseSvg(`
  <g data-wc-object="cartoon_title" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="1" filter="url(#shadowHard)">
    <path d="M78 128H642C660 128 674 142 674 160V278C674 296 660 310 642 310H78C60 310 46 296 46 278V160C46 142 60 128 78 128Z" fill="#FFF200" stroke="#111827" stroke-width="8"/>
    <text x="88" y="214" class="title" fill="#111827">KHÔNG TỰ ĐỘNG</text>
    <text x="88" y="278" class="title" fill="#EF4444">CẬP NHẬT</text>
  </g>
  <g data-wc-object="cartoon_cards" data-wc-kind="object" data-wc-anim="fade" data-wc-z="2" filter="url(#shadowHard)">
    <rect x="58" y="372" width="282" height="360" rx="32" fill="#FFFFFF" stroke="#111827" stroke-width="8"/>
    <rect x="380" y="372" width="282" height="360" rx="32" fill="#FFFFFF" stroke="#111827" stroke-width="8"/>
  </g>
  <g data-wc-object="cartoon_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="92" y="426" class="label" fill="#10B981" stroke="#111827" stroke-width="1.8">NĂM NGOÁI</text>
    <text x="430" y="426" class="label" fill="#EF4444" stroke="#111827" stroke-width="1.8">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#111827">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#111827">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#10B981', rightStroke: '#EF4444', markFill: '#FFFFFF' })}
  <g data-wc-object="cartoon_rule" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3" filter="url(#shadowHard)">
    <rect x="82" y="794" width="556" height="104" rx="28" fill="#22D3EE" stroke="#111827" stroke-width="8"/>
    <text x="126" y="860" class="rule" fill="#111827">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`),

  anime_speedline_hero: baseSvg(`
  <g data-wc-object="anime_burst" data-wc-kind="object" data-wc-anim="fade" data-wc-z="1">
    <rect x="42" y="124" width="636" height="774" rx="22" fill="#111827" opacity="0.9"/>
    <path d="M360 512L70 150M360 512L650 150M360 512L44 420M360 512L676 420M360 512L90 846M360 512L630 846M360 512L202 128M360 512L518 128M360 512L210 898M360 512L510 898" stroke="#FDE047" stroke-width="8" opacity="0.76"/>
  </g>
  <g data-wc-object="anime_title" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="2" filter="url(#shadowHard)">
    <text x="72" y="214" class="title" fill="#FFFFFF" stroke="#111827" stroke-width="4">KHÔNG TỰ ĐỘNG</text>
    <text x="72" y="284" class="title" fill="#FDE047" stroke="#111827" stroke-width="4">CẬP NHẬT</text>
  </g>
  <g data-wc-object="anime_cards" data-wc-kind="object" data-wc-anim="fade" data-wc-z="2" filter="url(#shadowHard)">
    <rect x="58" y="372" width="282" height="360" rx="18" fill="#FFFFFF" stroke="#111827" stroke-width="7"/>
    <rect x="380" y="372" width="282" height="360" rx="18" fill="#FFFFFF" stroke="#111827" stroke-width="7"/>
  </g>
  <g data-wc-object="anime_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="92" y="426" class="label" fill="#059669">NĂM NGOÁI</text>
    <text x="430" y="426" class="label" fill="#DC2626">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#111827">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#111827">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#059669', rightStroke: '#DC2626' })}
  <g data-wc-object="anime_rule" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3" filter="url(#shadowHard)">
    <rect x="82" y="794" width="556" height="104" rx="18" fill="#EF4444" stroke="#111827" stroke-width="7"/>
    <text x="126" y="860" class="rule" fill="#FFFFFF">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`),

  modern_experimental_split: baseSvg(`
  <g data-wc-object="split_planes" data-wc-kind="object" data-wc-anim="fade" data-wc-z="1">
    <path d="M42 132H678V898H42Z" fill="#111827" opacity="0.9"/>
    <path d="M42 132H678L416 898H42Z" fill="#D9F99D" opacity="0.96"/>
    <path d="M366 132H678V898H516Z" fill="#22D3EE" opacity="0.95"/>
  </g>
  <g data-wc-object="split_title" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="2">
    <rect x="54" y="132" width="612" height="174" rx="0" fill="#111827"/>
    <text x="90" y="212" class="title" fill="#FFFFFF">KHÔNG TỰ ĐỘNG</text>
    <text x="90" y="276" class="title" fill="#D9F99D">CẬP NHẬT</text>
  </g>
  <g data-wc-object="split_cards" data-wc-kind="object" data-wc-anim="fade" data-wc-z="2">
    <rect x="58" y="372" width="282" height="360" rx="0" fill="#FFFFFF" stroke="#111827" stroke-width="6"/>
    <rect x="380" y="372" width="282" height="360" rx="0" fill="#FFFFFF" stroke="#111827" stroke-width="6"/>
  </g>
  <g data-wc-object="split_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="92" y="426" class="label" fill="#111827">NĂM NGOÁI</text>
    <text x="430" y="426" class="label" fill="#111827">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#111827">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#111827">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#111827', rightStroke: '#EF4444', markFill: '#FFFFFF' })}
  <g data-wc-object="split_rule" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3">
    <rect x="82" y="794" width="556" height="104" rx="0" fill="#111827"/>
    <text x="126" y="860" class="rule" fill="#FFFFFF">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`),

  blue_cyan_fintech: baseSvg(`
  <g data-wc-object="fintech_title" data-wc-kind="text" data-wc-anim="slide-down" data-wc-z="1" filter="url(#shadowSoft)">
    <rect x="54" y="128" width="612" height="178" rx="22" fill="#082F49" opacity="0.94"/>
    <rect x="54" y="128" width="612" height="18" rx="9" fill="#22D3EE"/>
    <text x="92" y="212" class="title" fill="#FFFFFF">KHÔNG TỰ ĐỘNG</text>
    <text x="92" y="276" class="title" fill="#67E8F9">CẬP NHẬT</text>
  </g>
  <g data-wc-object="fintech_cards" data-wc-kind="object" data-wc-anim="fade" data-wc-z="2" filter="url(#shadowSoft)">
    <rect x="58" y="372" width="282" height="360" rx="22" fill="#F8FAFC" stroke="#0891B2" stroke-width="5"/>
    <rect x="380" y="372" width="282" height="360" rx="22" fill="#F8FAFC" stroke="#E11D48" stroke-width="5"/>
    <path d="M92 452H306M414 452H628" stroke="#CBD5E1" stroke-width="4"/>
  </g>
  <g data-wc-object="fintech_text" data-wc-kind="text" data-wc-anim="fade" data-wc-z="4">
    <text x="92" y="426" class="label" fill="#0891B2">NĂM NGOÁI</text>
    <text x="430" y="426" class="label" fill="#E11D48">NĂM NAY</text>
    <text x="92" y="684" class="small" fill="#0F172A">ĐÃ THÔNG BÁO</text>
    <text x="412" y="684" class="small" fill="#0F172A">PHẢI LÀM LẠI</text>
  </g>
  ${iconPair({ leftStroke: '#0891B2', rightStroke: '#E11D48' })}
  <g data-wc-object="fintech_rule" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3" filter="url(#shadowSoft)">
    <rect x="82" y="794" width="556" height="104" rx="22" fill="#0E7490"/>
    <text x="126" y="860" class="rule" fill="#FFFFFF">Đổi bảo hiểm: phải nhắc lại</text>
  </g>`)
};

const manifest = [];
for (const [name, content] of Object.entries(variants)) {
  const filename = `scene11_EA9OB_${name}.svg`;
  writeFileSync(join(outDir, filename), content, 'utf8');
  manifest.push({ name, file: join(outDir, filename) });
}

console.log(JSON.stringify(manifest, null, 2));
