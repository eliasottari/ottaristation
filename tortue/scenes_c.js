// ============================================================
//  B122–B182 (V2 ciné) : 35 ans, le retour, la ponte, les bébés et les lumières
//  (BEDS et SCENES.sort sont dans beds.js)
// ============================================================
// ---------- décor de nuit « bétonné » en pièces pour depth() : mer à gauche, ville à droite ----------
function c_night(t, o = {}) {
  const hz = o.hz ?? 470, sy = o.sy ?? 720, lit = o.lit ?? 1, sp = o.split ?? 900, M = 800, mx = o.moonX ?? 300;
  let sky = grad('#0f1734', '#2c3670', -M, -M, W + 2 * M, hz + M + 100);
  const r = rng(8); for (let i = 0; i < 70; i++) sky += circ(-M + r() * (W + 2 * M), -300 + r() * (hz + 260), 1.5 + r() * 2.2, `rgba(255,255,240,${.35 + .45 * Math.abs(Math.sin(t * .8 + i))})`, 0);
  if (o.moon !== false) sky += glow(mx, 150, 260, '#fff6d6', .35) + circ(mx, 150, 52, '#fff6d6', 0);
  let city = `<path d="M${sp} ${hz}L${W + M} ${hz}L${W + M} ${sy}L${sp - 200} ${sy}Z" fill="#3a3f4b"/>`;
  const hs = o.hotels ?? [[sp + 40, 190, 340], [sp + 270, 240, 440], [sp + 550, 200, 300], [sp + 790, 260, 400], [sp + 1090, 220, 330], [sp + 1350, 240, 380]];
  if (lit > .2) city += glow(sp + 600, hz - 120, 1000, '#ffcf70', .4 * lit);
  for (const [x, w, h] of hs) city += hotel(x, hz + 40, w, h * (o.hk ?? 1), lit, '#d8d0c4', Math.round(x) % 7);
  if (o.road !== false) { city += `<path d="M${sp - 90} ${sy - 150}L${W + M} ${sy - 150}L${W + M} ${sy - 30}L${sp - 170} ${sy - 30}Z" fill="#5b6068"/>`; for (let x = sp; x < W + M; x += 200) city += rect(x - ((t * (o.carSpeed || 0)) % 200), sy - 96, 100, 12, '#f4f1e6', 4, 0); }
  if (o.lamps !== false) for (const x of [sp + 100, sp + 450, sp + 800, sp + 1150]) city += streetLight(x, sy - 150, 260, lit);
  let sea = `<path d="M${-M} ${hz}L${sp + 60} ${hz}L${sp - 200} ${sy}L${-M} ${sy}Z" fill="#183a68"/>` +
    `<path d="M${mx - 40} ${hz}L${mx + 40} ${hz}L${mx + 150} ${sy}L${mx - 150} ${sy}Z" fill="rgba(255,246,214,${o.moonGlow ?? .22})"/>`;
  for (let i = 0; i < 4; i++) { const y = hz + 40 + i * (sy - hz) / 4.5, off = (t * (20 + i * 8)) % 240; sea += path(`M${-M - off} ${y}` + Array.from({ length: 10 }, () => 'q60 -10 120 0').join(''), 'none', 4, 'rgba(200,220,255,.25)'); }
  const wv = wave(t, .18, 20);
  let sand = path(`M${-M} ${sy + wv}` + Array.from({ length: 16 }, () => 'q50 -16 100 0').join('') + `L${sp - 200} ${sy + 60}L${-M} ${sy + 60}Z`, 'rgba(220,235,255,.55)', 0);
  sand += grad(o.sand1 || '#a8916c', o.sand2 || '#6e5c40', -M, sy + 10, W + 2 * M, H - sy + M) + line(-M, sy + 10, W + M, sy + 10, 5, 'rgba(0,0,0,.15)');
  const r2 = rng(o.seed || 5); for (let i = 0; i < 40; i++) sand += ell(-500 + r2() * (W + 1000), sy + 60 + r2() * (H - sy + 200), 6 + r2() * 8, 3 + r2() * 3, 'rgba(60,45,25,.25)', 0);
  return { sky, city, sea, sand };
}
function c_nightL(t, o = {}) { const p = c_night(t, o); return [{ z: 6, svg: p.sky }, { z: 2.6, svg: p.sea + p.city, haze: o.haze ?? 0 , hazeCol: '#2c3670' }, { z: 1, svg: p.sand }]; }
// tout-en-un (sans profondeur)
function c_nightFlat(t, o = {}) { const p = c_night(t, o); return p.sky + p.sea + p.city + p.sand; }
// bokeh de ville (premier plan flou)
const c_bokeh = (t, seed = 4, n = 12) => bokeh(t, seed, n, ['#ffe08a', '#fff6c8', '#ffcf70', '#ff9e5e']);
// polaroïd souvenir (sépia) avec contenu découpé
function c_memory(x, y, w, h, inner, k, r = 0, sepia = .3) {
  if (k <= 0) return '';
  const id = 'cm' + (_gid++);
  return G(tr(x, y, k, r), rect(-w / 2 - 22, -h / 2 - 22, w + 44, h + 90, '#fffaf0', 10) +
    `<defs><clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${inner}<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="rgba(170,110,40,${sepia})"/></g>` + rect(-w / 2, -h / 2, w, h, 'none', 5));
}
function c_iconCard(x, y, s, inner, t, t0, crossed = 1) { const k = pop(t, t0, .35); return k <= 0 ? '' : G(tr(x, y, s * k), circ(0, 0, 130, '#fff') + inner + circ(0, 0, 130, 'none') + (crossed ? G('', path('M-80 -80L80 80', 'none', 30) + path('M-80 -80L80 80', 'none', 16, '#ff4d4d')) : '')); }
function c_tracks(x1, y1, x2, y2, n = 10, col = 'rgba(70,50,30,.35)') { let s = ''; const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * 28, ny = Math.cos(a) * 28; for (let i = 0; i < n; i++) { const k = i / n; s += ell(lerp(x1, x2, k) + nx, lerp(y1, y2, k) + ny, 14, 8, col, 0) + ell(lerp(x1, x2, k + .5 / n) - nx, lerp(y1, y2, k + .5 / n) - ny, 14, 8, col, 0); } return s; }
const c_dash = (d, sw = 12, col = '#fff', off = 0) => path(d, 'none', sw, col, `stroke-dasharray="28 24" stroke-dashoffset="${f1(off)}"`);
function c_snail(x, y, s, t) { return G(tr(x, y, s), path('M-90 0Q-100 -20 -60 -20L60 -20Q90 -20 100 0Z', '#c9d98a') + circ(10, -70, 60, '#e39a5a') + path('M10 -70m-40 0a40 40 0 1 1 40 40a25 25 0 1 1 -20 -30', 'none', 6) + line(80, -20, 95, -70, 6) + line(70, -20, 70, -66, 6) + circ(95, -74, 8, OL, 0) + circ(70, -70, 8, OL, 0) + G(tr(130, -110), text(0, 0, OL, 'pfff', '#fff', 34))); }
function c_moonFace(x, y, s, t, k = 1) { return G(tr(x, y, s), glow(0, 0, 260, '#fff6d6', .45) + circ(0, 0, 90, '#fff6d6') + circ(-30, -10, 9, OL, 0) + circ(30, -10, 9, OL, 0) + path('M-26 24Q0 46 26 24', 'none', 7) + ell(-52, 18, 12, 7, CHEEK, 0) + ell(52, 18, 12, 7, CHEEK, 0) +
  G(tr(-130, 30, 1, -30 + wave(t, 2, 30) * k), ell(-40, 0, 46, 22, '#fff6d6'))); }
function c_calFly(t, n = 8, y0 = 1990, rate = 12, seed = 3) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const k = (t * 1.6 + i / n) % 1, x = r() * W, y = 900 - k * 1100; s += op(1 - k, calendarPage(x + wave(t, .7, 60, i / n), y, .55, k * 400 * (r() - .5), String(y0 + Math.floor(t * rate) + i))); } return s; }
function c_counter(x, y, n, label, col = '#ffd23f', size = 90) { return G(tr(x, y), rect(-(String(n).length + label.length) * size * .32 - 40, -size * .8, (String(n).length + label.length) * size * .64 + 80, size * 1.5, col, size * .5) + text(0, size * .36, 'none', n + ' ' + label, OL, size)); }
function c_nest(x, y, s, t, hearts = 1) { return G(tr(x, y, s), ell(0, 0, 220, 70, '#8c7652', 6, '#5e4c32') + path('M-160 -10Q0 -70 160 -10', 'none', 6, 'rgba(255,255,255,.2)') + (hearts ? heart(0, -10, .6 + .05 * Math.sin(t * 5), '#ff8fb0') : '')); }
function c_bulb(x, y, s, k = 1) { return k <= 0 ? '' : G(tr(x, y, s * k), glow(0, 0, 200, '#fff3a0', .7) + circ(0, -20, 70, '#fff3a0') + rect(-30, 44, 60, 50, '#bbb', 8) + line(-30, 62, 30, 62, 5) + path('M-20 0L-8 -30L8 0L20 -30', 'none', 6, '#e0a020')); }
function c_radar(x, y, s, t) { const a = t * 300; return G(tr(x, y, s), circ(0, 0, 160, 'rgba(20,60,40,.85)', 7, '#3dff8a') + circ(0, 0, 105, 'none', 4, '#3dff8a') + circ(0, 0, 50, 'none', 4, '#3dff8a') + line(-160, 0, 160, 0, 3, '#3dff8a') + line(0, -160, 0, 160, 3, '#3dff8a') +
  `<path d="M0 0L${f1(Math.cos(R(a)) * 160)} ${f1(Math.sin(R(a)) * 160)}A160 160 0 0 0 ${f1(Math.cos(R(a - 40)) * 160)} ${f1(Math.sin(R(a - 40)) * 160)}Z" fill="rgba(61,255,138,.35)"/>` + circ(70, -60, 14, '#ff6fa5', 4, '#fff') + G(tr(70, -96), text(0, 0, 'none', 'TA PLAGE', '#fff', 26))); }
// écran blanc / noir pudique
const c_white = k => rect(-300, -300, W + 600, H + 600, `rgba(255,252,238,${clamp(k)})`, 0, 0);
const c_black = k => rect(-300, -300, W + 600, H + 600, `rgba(0,0,0,${clamp(k)})`, 0, 0);
// fond « danger » sombre à rayons
const c_darkRays = t => rect(-300, -300, W + 600, H + 600, '#2a1f3d', 0, 0) + rays(t, CX, CY, '#3a2a4f', '#4b3866', 22);
// voiture vue de l'intérieur (pare-brise, volant, tableau de bord)
function c_carPOV(t, inner) { return inner + path(`M-300 -300L${W + 300} -300L${W + 300} 1180L-300 1180Z M120 90Q960 30 1800 90L1880 640Q960 600 40 640Z`, '#1e2230', 0, OL, 'fill-rule="evenodd"') +
  rect(-300, 640, W + 600, 600, '#262b3a', 0, 0) + rect(-300, 640, W + 600, 14, '#3a4055', 0, 0) + G(tr(560, 960, 1, wave(t, .5, 4)), circ(0, 0, 230, 'none', 34, '#14161f') + line(-220, 0, 220, 0, 30, '#14161f') + circ(0, 0, 60, '#14161f', 0)) +
  rect(1300, 700, 300, 90, '#0f1118', 14, 0) + text(1450, 762, 'none', '♪ 104.2', '#5ef0a0', 46) + G(tr(1600, 160, 1, wave(t, .8, 8)), line(0, -60, 0, 0, 5, '#999') + path('M-30 0L30 0L20 60L-20 60Z', '#ff6fa5', 5, '#222')); }

// ============================================================
//  TRENTE-CINQ ANS
// ============================================================
// B122 — travelling sous-marin en accéléré : le bébé grandit en adulte, les pages du calendrier filent, compteur → 35
B(122, { enter: 'none', cam: (t, d) => ({ z: 1.02, hand: .4 }),
  draw: (t, d) => { const A = at(122, 'ans'), g = eInOut(seg(t, .1, A + .2)), n = Math.min(35, Math.floor(35 * seg(t, 0, A + .1)));
    return depth({ x: t * 260, zoom: 1 }, [...underLayers(t * 3, { dark: .15 }),
      { z: 1, svg: G(tr(700 + t * 260, 520 + wave(t, .8, 20)), op(1 - g, tor({ x: 0, y: 0, s: 1.3, expr: 'happy', swim: 3 }, t)) + op(g, torA({ x: 0, y: 0, s: lerp(.9, 1.3, g), expr: 'effort', swim: 3 }, t))) + motionLines(400 + t * 260, 460, 4, 160, 0, 'rgba(255,255,255,.6)') },
      { z: .5, svg: c_calFly(t, 7, 1990, 22), blur: 6 }]) + streaks(t, 1, 12, 'rgba(255,255,255,.35)') + c_counter(CX, 130, n, 'ANS', '#ffd23f', 84); },
  sfx: [[0, 'el:time_pass', 1], [.1, 'clock_fast', .6], [.3, 'el:swim_whoosh', .5], [at(122, 'ans'), 'ding', .7]] });
// B123 — « Oui. » : contre-plongée ultra deadpan, regard caméra, une goutte de sueur… silence
B(123, { enter: 'none', cam: () => ({ z: 1.12, cy: 380, r: -4 }),
  draw: t => grad('#bff0ff', '#2b88c0', -300, -300, W + 600, H + 600) + Array.from({ length: 5 }, (_, i) => `<path d="M${300 + i * 330} -100L${400 + i * 330} -100L${560 + i * 300} 1200L${420 + i * 300} 1200Z" fill="rgba(255,255,255,.1)"/>`).join('') +
    path('M-300 120' + Array.from({ length: 26 }, (_, k) => `q50 ${10 + wave(t, .4, 8, k / 6)} 100 0`).join('') + 'L2300 -300L-300 -300Z', 'rgba(230,252,255,.55)', 0) +
    torAF({ x: CX, y: 880, r: 165, expr: 'deadpan', look: [0, 0], armL: 210, armR: -30 }, t) + sweat(CX + 200, 430 + seg(t, .3, .9) * 60, .9) + G(tr(CX + 340, 300, pop(t, .25)), text(0, 0, OL, '…', '#fff', 110)),
  sfx: [[.05, 'tick', .5], [.3, 'el:bubbles', .4]] });
// B124 — « TRENTE-CINQ ANS. » : crash zoom en plongée, choc absurde, mâchoire au sol, gâteau d'anniversaire 35 bougies
B(124, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.05, 1.15, t / d), r: 6, shake: 9 }),
  draw: t => { const A = at(124, 'ans');
    return rays(t, CX, 500, '#ffe08a', '#ff9e3d', 26) + confetti(t, 0, 60) + torAF({ x: CX, y: 1010, r: 175, expr: 'jawdrop', armL: 240, armR: -60, tremble: 1 }, t) +
      G(tr(CX - 20, 690), path(`M-40 0Q-50 ${150 * pop(t, .15)} 0 ${200 * pop(t, .15)}Q50 ${150 * pop(t, .15)} 40 0Z`, '#ff8a9a', 6)) +
      G(tr(1520, 640, pop(t, A - .2), 8), rect(-170, -40, 340, 120, '#fff4e0', 18) + rect(-170, -40, 340, 34, '#ff9ec4', 14, 0) + Array.from({ length: 9 }, (_, i) => rect(-150 + i * 36, -110, 14, 70, i % 2 ? '#5ec4f0' : '#ffd23f', 5, 4) + ell(-143 + i * 36, -124, 8, 13, '#ff8a3d', 3)).join('') + text(0, 60, 'none', '35', '#ff4d6d', 60)) +
      partyHorn(350, 560, 1.3, 200, seg(t, A, A + .3)) + bigText(['35 ANS !!!'], t, A - .1, CX, 170, '#ff6fa5', 190); },
  sfx: [[0, 'el:hit_cine', 1], [.05, 'el:crowd_gasp', .6], [at(124, 'ans') - .1, 'tada', .9], [at(124, 'ans'), 'whistle', .6], [.8, 'boing', .5]] });
// B125 — « Et maintenant… » : ultra-chill, elle flotte sur le dos, lunettes, cocktail d'algue ; travelling lent
B(125, { enter: 'tilt', cam: camPush(1.0, 1.08, .3),
  draw: t => depth({ x: t * 40, zoom: 1 }, [...underLayers(t, { surface: 140 }),
    { z: 1, svg: G(tr(960, 470 + wave(t, .4, 14), 1, 180 + wave(t, .3, 4)), G('scale(1 -1)', torA({ x: 0, y: 0, s: 1.6, expr: 'chill', swim: .25, headTilt: -10 }, t))) +
      G(tr(1230, 410, 1, -20), rect(-24, -60, 48, 80, 'rgba(255,255,255,.6)', 8, 5) + rect(-20, -30, 40, 46, '#ff9ec4', 6, 0) + line(10, -60, 30, -110, 6, '#5ec4f0')) + heart(760, 300 - t * 50, .6) + heart(1150, 260 - t * 40, .45) + G(tr(1400, 250), text(0, 0, OL, 'chiiiill', '#fff', 60)) },
    { z: .5, svg: fgBubbles(t, 3, 6) + fgKelp(1800, 1300, 1.2, t), blur: 8 }]),
  sfx: [[0, 'el:bubbles', .6], [.3, 'el:chime', .5], [.8, 'magic', .4]] });
// B126 — « quelque chose t'appelle » : profil, un ruban doré l'attrape par le nez et la soulève (gag tarte sur la fenêtre)
B(126, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: .7 }),
  draw: t => { const Q = at(126, 'appelle'), k = eOutCubic(seg(t, .2, Q)), lift = seg(t, Q - .2, Q + .5);
    let rib = ''; for (let i = 0; i < 3; i++) rib += path(`M2200 ${300 + i * 40}C1700 ${150 + i * 50 + wave(t, .8, 50, i / 3)} 1500 ${520 + wave(t, 1, 60, i / 3)} ${lerp(2000, 1180, k)} ${470 + i * 10}`, 'none', 18 - i * 4, ['#ffe08a', '#ffd23f', '#fff6c8'][i]);
    return depth({ zoom: 1 }, [...underLayers(t, { dark: .2 }),
      { z: 1, svg: rib + sparkle(1500 + wave(t, .5, 40), 360, .6, '#fff6c8') + G(tr(800, 620 - lift * 120, 1, -lift * 12), torA({ x: 0, y: 0, s: 1.6, expr: k > .8 ? 'zen' : 'shock', neck: 1.2, swim: lift ? 0 : .5, flipUp: lift > .3 }, t)) +
        (k > .8 ? G(tr(1350, 260, pop(t, Q)), text(0, 0, OL, 'viiiens…', '#ffe08a', 96)) : '') },
      { z: .5, svg: fgBubbles(t, 9, 5), blur: 9 }]); },
  sfx: [[0, 'whoosh', .6], [.2, 'magic', .8], [at(126, 'appelle'), 'angel', .7], [at(126, 'appelle') + .2, 'el:chime', .5]] });

// ============================================================
//  LA PLAGE, LES SOUVENIRS
// ============================================================
// B127 — « Cette plage. » : très large, grue qui descend au coucher du soleil ; elle sort la tête de l'écume, cœurs dans les yeux
B(127, { enter: 'none', cam: () => ({ z: 1, hand: .3 }),
  draw: (t, d) => { const c = camMove(t, d, { y: -260, zoom: 1.0 }, { y: 40, zoom: 1.1 }, eOutCubic);
    return depth(c, [...beachLayers(t, { dusk: .55, hotels: 1, hz: 470, sy: 650, sunX: 960, sunY: 300 }),
      { z: 1, svg: rays(t, 960, 300, 'rgba(255,230,180,.15)', 'rgba(255,210,150,0)', 18) + G(tr(1250, 620), torA({ x: 0, y: 0, s: .55, expr: 'love', swim: .5, flip: 1 }, t)) + heart(1200, 470 - t * 60, .5) },
      { z: .5, svg: path('M-300 1000Q300 900 900 1020T2300 980L2300 1400L-300 1400Z', 'rgba(255,255,255,.85)', 0) + fgRock(1700, 1050, 1.6), blur: 9 }]); },
  sfx: [[0, 'el:wave_crash', .7], [.2, 'el:gull', .5], [.4, 'el:chime', .6]] });
// B128 — « Celle où tu es née. » : gros plan, larmes de joie en fontaine + polaroïd sépia de l'œuf au nœud rose
B(128, { cam: camPush(1.02, 1.1, .4),
  draw: t => depth({ zoom: 1 }, [...beachLayers(t, { dusk: .55, hz: 520, sy: 700 }).map(l => Object.assign(l, { blur: 4 })),
    { z: 1, svg: torAF({ x: 640, y: 830, r: 150, expr: 'sob', armL: 220, armR: -40, headTilt: wave(t, 1, 6) }, t) +
      c_memory(1360, 380, 560, 380, bgSand(t, { sy: -300, night: 0 }).replace(/-200/g, '-600') + egg(0, 30, 2.6, .8, t, { bow: 1 }) + heart(170, -100, .7), pop(t, .2), 6) + G(tr(1360, 680, pop(t, at(128, 'né'))), text(0, 0, OL, 'ICI !', '#ff6fa5', 70)) }]),
  sfx: [[.1, 'magic', .9], [.4, 'el:baby_squeak', .5], [at(128, 'né'), 'el:crowd_aww', .5]] });
// B129a — flashback en contre-plongée : l'aigle baveux (sépia, grain VHS)
B(129, { enter: 'crash', cam: (t, d) => ({ z: lerp(1, 1.15, t / d), cy: 300, shake: 4 }),
  overlay: t => rect(0, 0, W, H, 'rgba(170,110,40,.28)', 0, 0) + Array.from({ length: 6 }, (_, i) => rect(0, (i * 197 + t * 700) % H, W, 4, 'rgba(255,255,255,.15)', 0, 0)).join('') + text(1700, 120, OL, '1990', '#fff', 60),
  draw: t => grad('#ffd4a8', '#9fd6ff', -300, -300, W + 600, H + 600) + cloud(400, 200, 1.3) + cloud(1600, 300, 1) + speedLines(t * .4, CX, 400, 18, 'rgba(255,255,255,.35)') +
    eagleFront({ x: CX, y: 560, s: lerp(.9, 1.3, t / 1.3), expr: 'starving', talons: 1, bib: 1 }, t) + fork(420, 520, 1.4, -25) + knife(1500, 520, 1.4, 25),
  sfx: [[0, 'magic', .6], [.15, 'el:eagle2', .9], [.5, 'el:wings', .6], [.9, 'growl', .5]] });
// B129b — retour au présent : stress post-traumatique, œil qui tressaute, elle se fait pipi dessus
B(129, { enter: 'whip', cam: (t, d) => ({ z: 1.06, hand: 1.2, r: -5 }),
  draw: t => depth({ zoom: 1 }, [...beachLayers(t, { dusk: .55, hz: 520, sy: 700 }).map(l => Object.assign(l, { blur: 3 })),
    { z: 1, svg: torAF({ x: CX, y: 850, r: 150, expr: 'terror', armL: 250, armR: -70, tremble: 1.4, pee: seg(t, .1, .9) }, t) + emark(CX + 280, 380, .8 * pop(t, .05)) + sweat(CX - 260, 420, 1) + sweat(CX + 250, 520, .8) +
      G(tr(CX - 420, 300, pop(t, .2), -10), text(0, 0, OL, 'BRRR', '#fff', 70)) }]),
  sfx: [[0, 'sting', .8], [.1, 'el:struggle', .4], [.3, 'spray', .4], [.5, 'squeak', .6]] }, at(129, 'failli'));
// B130 — « pas vue depuis des décennies » : plongée sur l'océan ; elle dérive, couverte de balanes et de toiles d'araignée ; grue qui monte
B(130, { cam: (t, d) => ({ z: lerp(1.25, 1.0, eOutCubic(t / d)), r: lerp(-8, 0, t / d) }),
  draw: (t, d) => { const D = at(130, 'décennies');
    let s = grad('#2f8fc4', '#145a8c', -300, -300, W + 600, H + 600); const r = rng(5);
    for (let i = 0; i < 28; i++) s += path(`M${r() * W - 100} ${r() * H}q30 -10 60 0t60 0`, 'none', 5, 'rgba(255,255,255,.3)');
    s += c_dash('M960 560C600 300 300 800 200 500S500 100 900 200S1700 300 1800 800', 10, 'rgba(255,255,255,.6)', -t * 60);
    s += G(tr(960, 560, 1, wave(t, .3, 8)), torAT({ x: 0, y: 0, s: 1.4, swim: .3 }, t) + [[-40, -30], [30, 40], [50, -60], [-30, 70]].map(([x, y]) => circ(x, y, 14, '#e8e2d0', 4)).join('') +
      path('M-110 -140L110 140M110 -140L-110 140M0 -170L0 170M-160 0L160 0', 'none', 2, 'rgba(255,255,255,.8)') + circ(0, 0, 60, 'none', 2, 'rgba(255,255,255,.7)') + circ(0, 0, 120, 'none', 2, 'rgba(255,255,255,.6)'));
    return s + G(tr(1100, 350), text(0, 0, OL, 'zzz', '#fff', 50)) + c_counter(CX, 140, t < D ? '19' + (90 + Math.floor(t * 4)) : '2025', '', '#ffd23f', 80) + tag(CX, 960 - 300, 'DES DÉCENNIES', t, D, '#ff6fa5', '#fff', 64); },
  sfx: [[0, 'whoosh_up', .6], [.4, 'el:bubbles', .4], [at(130, 'décennies'), 'pop', .8], [at(130, 'décennies') + .1, 'el:time_pass', .5]] });

// ============================================================
//  NAVIGATION
// ============================================================
// B131a — plan moyen : elle s'équipe en pilote (casque, lunettes d'aviateur), boussole qui tourne
B(131, { enter: 'drop', cam: camPush(1.0, 1.08, .5),
  draw: t => depth({ x: wave(t, .2, 30), zoom: 1 }, [...underLayers(t, { fishFar: 1, floor: 980 }),
    { z: 1, svg: torA({ x: 900, y: 700, s: 1.7, expr: 'cool', swim: .4 }, t) + G(tr(1070, 500), path('M-70 0Q0 -90 70 0', 'none', 14, '#333') + rect(-90, -10, 40, 50, '#444', 10) + line(-80, 40, -40, 80, 6, '#444') + circ(-36, 84, 10, '#444', 0)) +
      G(tr(1450, 320, pop(t, .4)), circ(0, 0, 110, '#fff') + circ(0, 0, 86, '#eaf6ff', 5) + G(`rotate(${t * 400})`, path('M0 -70L18 0L-18 0Z', '#ff4d4d', 4) + path('M0 70L18 0L-18 0Z', '#fff', 4))) + G(tr(1450, 470, pop(t, .8)), text(0, 0, OL, 'NAVIGATION', '#fff', 54)) },
    { z: .5, svg: fgKelp(150, 1300, 1.3, t) + fgBubbles(t, 4, 5), blur: 9 }]),
  sfx: [[0, 'whoosh', .6], [.4, 'slot', .6], [.8, 'el:sonar', .6], [1.6, 'tick', .5]] });
// B131b — très gros plan sur son œil + HUD radar vert : « extraordinaire »
B(131, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .5 }),
  overlay: t => G(tr(1480, 400), c_radar(0, 0, 1.2, t)) + tag(1480, 140, 'GPS INTÉGRÉ ✓', t, at(131, 'extra') - at(131, 'navigation'), '#5fd068', OL, 56),
  draw: t => rect(-300, -300, W + 600, H + 600, '#0e3550', 0, 0) + rect(-300, -300, W + 600, H + 600, 'rgba(61,255,138,.06)', 0, 0) + torAF({ x: 640, y: 1250, r: 330, expr: 'smugger', armL: 200, armR: -20 }, t) +
    Array.from({ length: 12 }, (_, i) => line(0, i * 95 + (t * 120) % 95, W, i * 95 + (t * 120) % 95, 2, 'rgba(61,255,138,.15)')).join(''),
  sfx: [[0, 'el:hit_cine', .5], [.1, 'el:sonar', 1], [.6, 'ecg_beep', .5], [at(131, 'extra') - at(131, 'navigation'), 'ding', .8]] }, at(131, 'navigation'));
// B132a — profil : des lignes de champ en pointillés lui entrent dans la tête, petite aiguille de boussole dans une bulle
B(132, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .4 }),
  draw: t => { let f = ''; for (let i = 0; i < 4; i++) f += c_dash(`M-200 ${200 + i * 120}C500 ${100 + i * 160} 900 ${300 + i * 60} 1150 ${520}`, 8, 'rgba(120,200,255,.85)', -t * 120);
    return depth({ zoom: 1 }, [...underLayers(t, { dark: .25 }), { z: 1, svg: f + torA({ x: 900, y: 720, s: 1.8, expr: 'wow', swim: .3, headTilt: -8 }, t) +
      thought(1450, 300, 300, 240, G(tr(0, 0), circ(0, 0, 80, '#fff') + G(`rotate(${wave(t, .8, 30)})`, path('M0 -60L16 0L-16 0Z', '#ff4d4d', 4) + path('M0 60L16 0L-16 0Z', '#eee', 4))), pop(t, .5)) +
      Array.from({ length: 6 }, (_, i) => { const k = (t * .8 + i / 6) % 1; return op(1 - k, text(lerp(200, 1100, k), 300 + i * 50, 'none', i % 2 ? '1' : '0', '#7cf0ff', 40)); }).join('') }]); },
  sfx: [[0, 'whoosh', .5], [.4, 'el:sonar', .7], [.9, 'el:typing', .4], [1.5, 'magic', .6]] });
// B132b — très large dans l'espace : la Terre et son champ magnétique, une mini-tortue surfe sur une ligne
B(132, { enter: 'none', cam: (t, d) => ({ z: lerp(1.15, 1.0, eOutCubic(t / d)) }),
  draw: t => { const a = R(-120 + t * 50); return grad('#070d22', '#1b2552', -300, -300, W + 600, H + 600) + Array.from({ length: 70 }, (_, i) => circ((i * 397) % W, (i * 211) % H, 2, 'rgba(255,255,255,.6)', 0)).join('') + glow(CX, 560, 700, '#3a7bd5', .3) + magEarth(CX, 560, 1.5, t) +
    G(tr(CX + Math.cos(a) * 430, 560 + Math.sin(a) * 300, .35, t * 50 - 30), torAT({ x: 0, y: 0, s: 1, swim: 1 }, t)) + bigText(['CHAMP MAGNÉTIQUE'], t, .1, CX, 130, '#78c8ff', 96); },
  sfx: [[0, 'el:hit_cine', .5], [.1, 'magic', .8], [.6, 'el:sonar', .5]] }, at(132, 'champ'));
// B132c — POV caméra épaule : elle suit une « autoroute » magnétique lumineuse, panneau sous-marin
B(132, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: 1 }),
  draw: t => { const off = t * 600; let road = `<path d="M860 420L1060 420L1900 1300L20 1300Z" fill="rgba(120,200,255,.25)"/>`; for (let i = 0; i < 8; i++) { const k = ((i / 8 + t * .9) % 1), y = 420 + k * k * 880; road += rect(CX - 8 - k * 40, y, 16 + k * 80, 20 + k * 60, 'rgba(200,240,255,.8)', 4, 0); }
    return depth({ zoom: 1 }, [...underLayers(t, { dark: .2 }), { z: 1, svg: road + G(tr(1400, 360, pop(t, .3)), line(0, 0, 0, 240, 12) + rect(-200, -80, 400, 140, '#2f9e5a', 14) + text(0, -10, 'none', 'TA PLAGE →', '#fff', 46) + text(0, 40, 'none', '8 000 km', '#fff', 40)) +
      G(tr(CX, 700 + wave(t, 1, 10)), torAT({ x: 0, y: 0, s: 1.3, swim: 1.2 }, t)) }, { z: .5, svg: fgBubbles(t * 3, 6, 7), blur: 8 }]) + streaks(t, -1, 8, 'rgba(255,255,255,.25)'); },
  sfx: [[0, 'el:swim_whoosh', .8], [.3, 'pop', .6], [.8, 'el:bubbles', .5], [1.4, 'whoosh', .5]] }, at(132, 'pour'));
// B133a — très large : plan coupé surface, cycle jour/nuit en accéléré, minuscule tortue qui traverse
B(133, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: t => { const ph = (Math.sin(t * 4) + 1) / 2;
    return bgSplit(t, { wl: 420, sky1: lerpColor('#8fd3ff', '#141c40', ph), sky2: lerpColor('#e4f6ff', '#2c3670', ph) }) + circ(CX + Math.cos(t * 4) * 900, 380 - Math.abs(Math.sin(t * 4)) * 300, 60, ph > .5 ? '#fff6d6' : '#fff3b0', 0) +
      G(tr(lerp(200, 1700, t / 1.6), 560, .6), torA({ x: 0, y: 0, s: 1, swim: 2, expr: 'effort' }, t)) + c_dash('M100 560L1800 560', 6, 'rgba(255,255,255,.5)', -t * 100) + c_counter(CX, 130, 'AN ' + (1 + Math.floor(t * 12)), '', '#fff', 70); },
  sfx: [[0, 'el:time_pass', .7], [.3, 'el:swim_whoosh', .5], [1.0, 'clock_fast', .4]] });
// B133b — travelling latéral en parallaxe : tempête, iceberg, elle prend une barbe d'algues
B(133, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: .8, shake: 2 }),
  draw: t => { const k = seg(t, 0, 1.3);
    return depth({ x: t * 500, zoom: 1 }, [{ z: 5, svg: grad('#34507a', '#0d2a4a', -1500, -900, W + 3000, H + 1800) },
      { z: 2.5, svg: path('M1500 -100L1700 -100L1900 500L1300 500Z', '#e8f6ff', 6, '#9ac') + path('M2500 -100L2800 -100L3000 600L2400 600Z', '#e8f6ff', 6, '#9ac') + G(tr(700, 100), cloud(0, 0, 1.6, '#55607a')), haze: .3, hazeCol: '#0d2a4a' },
      { z: 1, svg: G(tr(800 + t * 500, 560), torA({ x: 0, y: 0, s: 1.5, expr: 'effort', swim: 2 }, t) + G(tr(230, -40), op(k, [-20, 0, 20, 40].map(dx => path(`M${dx} 0q${wave(t, 1, 12, dx / 50)} 60 ${dx / 4} ${80 + 60 * k}`, 'none', 10, '#3f8f4f')).join('')))) + fish({ x: 300 + t * 300, y: 860, s: .6, color: '#ffb347' }, t) },
      { z: .5, svg: Array.from({ length: 10 }, (_, i) => line(i * 260 + t * 200, -100, i * 260 - 100 + t * 200, 1200, 4, 'rgba(200,230,255,.4)')).join(''), blur: 4 }]); },
  sfx: [[0, 'el:swim_whoosh', .8], [.2, 'thunder', .5], [.7, 'el:bubbles', .4], [1.1, 'hmm', .6]] }, at(133, 'traversé'));
// B134 — « Et aujourd'hui… » : très gros plan western, regard plissé déterminé, letterbox, nœud qui flotte
B(134, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), bars: 1, cy: 420 }),
  draw: t => grad('#ffb38a', '#3fb6d9', -300, -300, W + 600, H + 600) + rays(t, CX, 300, 'rgba(255,240,200,.25)', 'rgba(255,240,200,0)', 16) + torAF({ x: CX, y: 1250, r: 340, expr: 'suspicious', look: [0, 0], headTilt: wave(t, .5, 2) }, t) +
    Array.from({ length: 6 }, (_, i) => line(((i * 400 + t * 900) % (W + 400)) - 200, 200 + i * 90, ((i * 400 + t * 900) % (W + 400)) - 20, 200 + i * 90, 5, 'rgba(255,255,255,.5)')).join(''),
  sfx: [[0, 'whistle', .4], [.2, 'el:a_wind', .5], [.5, 'drum', .7]] });
// B135 — « tu reviens. » : contre-plongée héroïque, elle jaillit de l'écume au ralenti, soleil couchant derrière
B(135, { enter: 'drop', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 300, r: lerp(4, 0, t / d) }),
  draw: t => { const k = eOutCubic(seg(t, 0, .8));
    return depth({ y: -k * 40, zoom: 1 }, [{ z: 6, svg: grad('#ff9a6b', '#ffd9a0', -900, -900, W + 1800, 1800) + glow(CX, 330, 600, '#fff3b0', .8) + circ(CX, 330, 130, '#fff3b0', 0) + rays(t, CX, 330, 'rgba(255,240,190,.3)', 'rgba(255,240,190,0)', 22) },
      { z: 2.4, svg: grad(SEA, SEA_D, -900, 820, W + 1800, 600) },
      { z: 1, svg: G(tr(CX, lerp(930, 740, k)), torA({ x: 0, y: 0, s: 2.3, expr: 'cool', swim: .2, flipUp: 1 }, t)) + Array.from({ length: 18 }, (_, i) => { const rr = rng(i * 7919 + 13); rr(); rr(); const a = R(190 + rr() * 160), v = 500 + rr() * 500, q = seg(t, 0, 1.1); return circ(CX + Math.cos(a) * v * q, 860 + Math.sin(a) * v * q + 600 * q * q, 10 + rr() * 10, '#dff6ff', 4, '#fff'); }).join('') },
      { z: .5, svg: path('M-400 1000Q200 900 800 980T2400 960L2400 1500L-400 1500Z', 'rgba(255,255,255,.9)', 0), blur: 8 }]) + tag(CX, 130, 'LE RETOUR', t, .35, '#ffd23f', OL, 64); },
  sfx: [[0, 'el:splash', 1], [.05, 'el:hit_cine', .8], [.3, 'angel', .6], [.5, 'glint', .7]] });

// ============================================================
//  LA PONTE
// ============================================================
// B136a — plongée : elle se traîne sur le sable, traces, sueur qui gicle
B(136, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), r: -6 }),
  draw: t => sandTop(t, 23) + rect(-300, 960, W + 600, 300, 'rgba(255,255,255,.6)', 0, 0) + c_tracks(CX, 1100, CX, 620 - t * 30, 9) + torAT({ x: CX, y: 520 - t * 30, s: 1.6, walk: .4 }, t) + sweat(CX + 220, 330, 1) + sweat(CX - 230, 360, .8) + sweat(CX + 260, 470, .6) + G(tr(1450, 300), text(0, 0, OL, 'HNNNG', '#fff', 64)),
  sfx: [[0, 'hmm', .9], [.4, 'el:dig', .4], [1.0, 'el:struggle', .4]] });
// B136b — macro au ras du sable, caméra épaule : effort XXL, un escargot la double
B(136, { enter: 'whip', cam: camHand(1.05, 1.1),
  draw: t => depth({ x: t * 20, zoom: 1 }, [{ z: 5, svg: beachParts(t, { dusk: .6, hz: 420, sy: 560 }).sky, blur: 5 }, { z: 2.5, svg: beachParts(t, { dusk: .6, hz: 420, sy: 560 }).sea, blur: 5 },
    { z: 1, svg: beachParts(t, { dusk: .6, hz: 420, sy: 560 }).sand + torA({ x: 760 + t * 12, y: 760, s: 2.2, expr: 'effort', face: { mouth: 'tongue' }, walk: .3, tremble: .4, headTilt: 8 }, t) + sweat(1260, 470, 1.2) + c_snail(150 + t * 300, 760, 1.4, t) },
    { z: .45, svg: fgGrass(1800, 1180, 1.6, t) + fgShell(150, 1100, 1.6, 20), blur: 10 }]),
  sfx: [[0, 'el:struggle', .6], [.3, 'hmm', .8], [.7, 'boing', .4]] }, at(136, 'sur'));
// B137 — « Tu creuses un trou. » : plan moyen, de nuit, elle creuse comme un chien : sable partout, nuage de poussière
B(137, { enter: 'punch', cam: (t, d) => ({ z: 1.06, shake: 5 }),
  draw: t => depth({ zoom: 1 }, [...c_nightL(t, { hz: 380, sy: 560 }),
    { z: 1, svg: ell(1050, 800, 260, 60, '#4f4232', 0) + sandFlying(1200, 780, t * 1.5, 20, 3) + sandFlying(1250, 760, t * 1.3 + .5, 16, 7) + G(tr(1300, 640), cloud(0, 0, 1 + .1 * Math.sin(t * 20), '#c9b28a')) +
      torA({ x: 850, y: 690, s: 1.7, expr: 'rage', flail: 1 }, t) + motionLines(1180, 640, 4, 90, 0) + G(tr(1500, 400, pop(t, .2), 10), text(0, 0, OL, 'SCRATCH SCRATCH', '#fff', 54)) },
    { z: .5, svg: fgGrass(120, 1180, 1.5, t, '#4a6a3a'), blur: 9 }]),
  sfx: [[0, 'el:dig', 1], [.3, 'scratch', .6], [.6, 'el:dig', .8], [.9, 'scratch', .5]] });
// B138a — plongée (pudique) dans le nid : les œufs tombent un à un, compteur
B(138, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d) }),
  draw: t => { const n = Math.min(14, Math.floor(seg(t, at(138, 'œufs') - .2, 1.75) * 14)); let s = sandTop(t, 7).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#9c8662' : '#7c6a4c');
    s += ell(CX, 600, 430, 330, '#4f4232', 7, '#3a3022') + eggsPile(CX, 700, n, .9, t, 2) + (t > at(138, 'œufs') - .2 && t < 1.75 && (t * 8) % 1 < .6 ? egg(CX + 20, lerp(150, 520, (t * 8) % 1 / .6), lerp(1.4, .9, (t * 8) % 1 / .6), 0, t) : '');
    s += G(tr(CX, 110), tHead({ expr: 'effort', blush: 1, bow: 1, lashes: 1, look: [0, 1] }, 100, t, T_SKIN)) + sweat(CX + 200, 140, .8);
    return s + c_counter(1600, 300, n, '/ 100', '#fff', 60); },
  sfx: Array.from({ length: 10 }, (_, i) => [at(138, 'œufs') - .2 + i * .14, i % 2 ? 'pop' : 'pop_hi', .55]).concat([[0, 'whoosh', .5]]) });
// B138b — gros plan profil : concentration totale, chaque « plop » la fait cligner, compteur qui grimpe
B(138, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), hand: .4 }),
  draw: t => { const pl = (t * 2.6) % 1 < .15, n = 14 + Math.floor(t * 30);
    return depth({ zoom: 1 }, [...c_nightL(t, { hz: 300, sy: 500 }).map(l => Object.assign(l, { blur: 4 })),
      { z: 1, svg: torAF({ x: 800, y: 900, r: 160, expr: pl ? 'effort' : 'zen', armL: 210, armR: -30 }, t) + (pl ? G(tr(1130, 380), text(0, 0, OL, 'plop', '#fff', 64)) : '') + sweat(560, 420, .8) + c_counter(1500, 300, Math.min(n, 100), '/ 100', '#ffd23f', 70) },
      { z: .5, svg: fgGrass(1800, 1200, 1.5, t, '#4a6a3a'), blur: 9 }]); },
  sfx: [[0, 'pop', .6], [.38, 'pop_hi', .6], [.77, 'pop', .6], [1.0, 'tick', .4]] }, at(138, 'un'));
// B139 — « Puis tu les recouvres. » : large, elle projette du sable en arrière puis tapote, petit panneau « BÉBÉS ♥ »
B(139, { enter: 'tilt', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .4 }),
  draw: t => { const R2 = at(139, 'recouvres'), k = seg(t, R2, 1.8);
    return depth({ x: -t * 30, zoom: 1 }, [...c_nightL(t, { hz: 420, sy: 600 }),
      { z: 1, svg: c_nest(800, 760, 1.1, t, k > .9) + (t < R2 + .8 ? sandFlying(780, 740, t * 1.6, 14, 4) + sandFlying(820, 720, t * 1.4 + .3, 12, 9) : '') + torA({ x: 1200, y: 760, s: 1.5, expr: k > .6 ? 'proud' : 'effort', fa: wave(t, 3, 40) }, t) +
        G(tr(560, 640, pop(t, 1.3), -8), line(0, 0, 0, 120, 8) + rect(-110, -60, 220, 90, '#fff', 12) + text(0, 0, 'none', 'BÉBÉS ♥', '#ff6fa5', 40)) },
      { z: .5, svg: fgGrass(100, 1180, 1.6, t, '#4a6a3a') + fgShell(1750, 1100, 1.3, -20), blur: 9 }]); },
  sfx: [[0, 'el:dig', .8], [at(139, 'recouvres'), 'el:dig', .7], [1.3, 'pop', .6], [1.5, 'thud', .5]] });
// B140a — fière, elle s'époussette les nageoires (plan moyen)
B(140, { enter: 'none', cam: () => ({ z: 1.04, hand: .3 }),
  draw: t => depth({ zoom: 1 }, [...c_nightL(t, { hz: 400, sy: 600 }), { z: 1, svg: c_nest(700, 780, 1, t, 1) + torA({ x: 1150, y: 740, s: 1.6, expr: 'proud', flip: 1, fa: wave(t, 3, 20) }, t) + sparkle(1300, 520, .5 * pop(t, .3), '#fff') + G(tr(1400, 420, pop(t, .4)), text(0, 0, OL, 'TERMINÉ !', '#fff', 60)) }]),
  sfx: [[.1, 'whistle', .4], [.3, 'sparkle', .5], [.6, 'tick', .3]] });
// B140b — dolly zoom (effet Vertigo) en gros plan : elle réalise… ampoule
B(140, { enter: 'none', cam: () => ({ z: 1.0 }),
  draw: (t, d) => { const k = eInOut(seg(t, 0, d)), R2 = at(140, 'réalises') - at(140, 'tu');
    return depth({ zoom: lerp(1.0, 1.6, k) }, [...c_nightL(t, { hz: 360, sy: 560 }).map(l => Object.assign(l, { z: l.z * .55 })),
      { z: 50, svg: rays(t, CX, 400, 'rgba(255,255,255,.08)', 'rgba(255,255,255,0)', 20) },
      { z: 1e6, svg: torAF({ x: CX, y: 860, r: 165, expr: k > .4 ? 'shock' : 'neutral', armL: 200, armR: -20 }, t) + c_bulb(CX + 300, 280, 1, pop(t, R2)) }]); },
  sfx: [[0, 'el:riser', .7], [at(140, 'réalises') - at(140, 'tu'), 'ding', 1], [1.2, 'heartbeat', .5]] }, at(140, 'tu'));
// B141 — « Tu es devenue ta mère. » : contre-plongée débullée, mâchoire au sol, sa mère fantôme apparaît derrière elle
B(141, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), r: -7, cy: 300, shake: t > at(141, 'mère') ? 6 : 0 }),
  draw: t => { const M2 = at(141, 'mère'), k = eInOut(seg(t, .2, 1.1));
    return c_darkRays(t) + op(k * .8, G(tr(CX + 360, 640, 1, 8), mom({ x: 0, y: 0, s: 2.1, expr: 'happy', flip: 1, headTilt: 10 }, t)) + G(tr(CX + 420, 280), text(0, 0, OL, 'coucou ma chérie', '#fff', 46))) +
      torAF({ x: CX - 260, y: 880, r: 160, expr: 'jawdrop', armL: 240, armR: -60, tremble: .6 }, t) + G(tr(CX - 260, 600), path(`M-50 0Q-60 ${300 * pop(t, .3)} 0 ${420 * pop(t, .3)}Q60 ${300 * pop(t, .3)} 50 0Z`, '#ff8a9a', 7)) +
      bigText(['TA MÈRE.'], t, M2, CX, 150, '#ffd23f', 130); },
  sfx: [[0, 'sting', 1], [.3, 'boing', .7], [at(141, 'mère'), 'el:hit_cine', .9], [at(141, 'mère') + .1, 'el:crowd_gasp', .7]] });
// B142a — plongée douce sur le nid (cœur), elle s'éloigne en laissant ses traces
B(142, { enter: 'none', cam: (t, d) => ({ z: lerp(1.1, 1.0, eOutCubic(t / d)), r: 4 }),
  draw: t => { let s = sandTop(t, 9).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#9c8662' : '#7c6a4c');
    return s + G(tr(CX, 560), ell(0, 0, 330, 250, '#8c7652', 7, '#5e4c32') + heart(0, 0, 2.2 + .1 * Math.sin(t * 6), '#ff8fb0')) + c_tracks(CX + 300, 600, 1800, 300, 10) + torAT({ x: lerp(1500, 1700, t / 1.8), y: lerp(380, 330, t / 1.8), s: 1.1, rot: 70, walk: .5 }, t) + sparkle(CX - 200, 380, .5, '#fff'); },
  sfx: [[0, 'el:chime', .6], [.5, 'el:patter', .3], [1.2, 'magic', .4]] });
// B142b — recul : autour du nid, TOUT le monde attend déjà dans le noir (crabes à bavoirs, mouette avec fourchette, ailerons)
B(142, { enter: 'none', cam: (t, d) => ({ z: lerp(1.35, 1.0, eOutCubic(t / d)), cy: 640 }),
  draw: t => depth({ zoom: 1 }, [...c_nightL(t, { hz: 360, sy: 520 }),
    { z: 1, svg: c_nest(CX, 760, .9, t, 1) + Array.from({ length: 3 }, (_, i) => G(tr(450 + i * 2 * 250, 230 + i * 30), path('M-30 30L0 -40L30 30Z', '#6d7f92'))).join('') +
      crab({ x: 480, y: 720, s: .55, bib: 1, fork: 1, angry: 1, walk: .3 }, t) + crab({ x: 1450, y: 740, s: .6, bib: 1, angry: 1 }, t) + eagle({ x: 1150, y: 560, s: .6, gull: 1, expr: 'starving', bib: 1 }, t) +
      Array.from({ length: 5 }, (_, i) => G(tr(200 + i * 380, 600 + (i % 2) * 40), circ(-14, 0, 9, '#ffe066', 0) + circ(14, 0, 9, '#ffe066', 0))).join('') + G(tr(CX, 520, pop(t, .5)), text(0, 0, OL, '…MIAM ?', '#ff6fa5', 56)) },
    { z: .5, svg: fgGrass(120, 1180, 1.6, t, '#3e5a30') + fgGrass(1820, 1180, 1.5, t, '#3e5a30', 6), blur: 9 }]),
  sfx: [[0, 'whoosh_up', .5], [.3, 'el:crab_scuttle', .5], [.7, 'el:gull', .5], [1.2, 'growl', .5], [1.6, 'el:crab', .4]] }, at(142, 'dans'));
// B142c — gros plan : terreur rétrospective, les dangers de 35 ans surgissent autour d'elle un par un
B(142, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .8 }),
  draw: t => { const T35 = at(142, '35') - at(142, 'qui'); let s = c_darkRays(t) + torAF({ x: CX, y: 900, r: 130, expr: t > T35 ? 'panic' : 'scared', armL: 240, armR: -60, tremble: 1, pee: seg(t, T35, T35 + .8) }, t);
    const items = [eagle({ x: 0, y: 0, s: .35, expr: 'starving' }, t), crab({ x: 0, y: 30, s: .55, angry: 1 }, t), shark({ x: 0, y: 0, s: .32 }, t), net(0, -90, 200, 180, t, { n: 6, floats: false }), plasticBag({ x: 0, y: -10, s: .6 }, t), carFront(0, 70, .4, 1)];
    const pos = [[420, 330], [1500, 330], [300, 620], [1620, 620], [640, 170], [1280, 170]];
    items.forEach((it, i) => { s += c_iconCard(pos[i][0], pos[i][1], .8, it, t, .1 + i * .32, 0); });
    return s + tag(CX, 140, '35 ANS !', t, T35, '#ff4d4d', '#fff', 60); },
  sfx: [[.1, 'el:eagle', .6], [.42, 'el:crab', .6], [.74, 'el:shark', .5], [1.06, 'el:net_creak', .5], [1.38, 'el:bag_rustle', .5], [1.7, 'el:car_horn', .5], [at(142, '35') - at(142, 'qui'), 'sting', .7]] }, at(142, 'qui'));
// B143a — « Mais au moins… » : soupir, haussement d'épaules, elle regarde le nid
B(143, { enter: 'whip', cam: () => ({ z: 1.04, hand: .3 }),
  draw: t => depth({ zoom: 1 }, [...c_nightL(t, { hz: 380, sy: 560 }), { z: 1, svg: c_nest(1300, 780, .9, t, 1) + torA({ x: 760, y: 740, s: 1.7, expr: 'worried', headTilt: 15, flipUp: 1 }, t) + G(tr(1000, 420), text(0, 0, OL, 'pfiou…', '#fff', 54)) },
    { z: .5, svg: fgGrass(1800, 1200, 1.5, t, '#3e5a30'), blur: 9 }]),
  sfx: [[.1, 'hmm', .6], [.5, 'el:a_wind', .3]] });
// B143b — « …ils auront une chance » : contre-plongée douce au clair de lune, elle embrasse le nid, cœurs (ultra-tendre)
B(143, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 400 }),
  draw: t => grad('#152246', '#3a4682', -300, -300, W + 600, H + 600) + glow(1450, 200, 400, '#fff6d6', .5) + circ(1450, 200, 70, '#fff6d6', 0) + rect(-300, 860, W + 600, 400, '#6e5c40', 0, 0) +
    c_nest(CX + 300, 880, 1.3, t, 0) + torAF({ x: CX - 200, y: 880, r: 150, expr: 'zen', armL: 230, armR: -10, headTilt: 12 }, t) + [0, 1, 2, 3].map(i => { const k = (t * .6 + i / 4) % 1; return op(1 - k, heart(CX + 200 + i * 60, 700 - k * 400, .5 + .3 * k)); }).join('') + sparkle(CX + 420, 520, .6 * pop(t, .5), '#fff') + stars(CX - 200, 280, t, 5, 220),
  sfx: [[0, 'kiss', .6], [.2, 'el:chime', .8], [.6, 'sparkle', .5]] }, at(143, 'ils'));
// B144 — « Tu retournes à l'eau. » : travelling latéral profil, elle pleure en fontaine et fait coucou au nid
B(144, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: .5 }),
  draw: t => depth({ x: -t * 160, zoom: 1 }, [...c_nightL(t, { hz: 380, sy: 560, split: 1500 }),
    { z: 1, svg: c_nest(1500, 790, .8, t, 1) + G(tr(900 - t * 160, 690), torA({ x: 0, y: 0, s: 1.5, expr: 'sob', flip: 1, walk: 1, flipUp: 1 }, t)) + (t > 1 ? shockRing(300, 700, t, 1, '#dff') : '') },
    { z: .5, svg: fgShell(300, 1100, 1.6) + fgGrass(1700, 1180, 1.4, t, '#3e5a30'), blur: 9 }]),
  sfx: [[0, 'el:patter', .5], [.2, 'el:crowd_aww', .4], [1.0, 'el:splash', .7]] });

// ============================================================
//  DEUX MOIS PLUS TARD : LES BÉBÉS
// ============================================================
// B145a — carton : calendrier qui s'effeuille, « DEUX MOIS PLUS TARD »
B(145, { enter: 'none', flash: 1, cam: zout(1.12, 1.0),
  draw: t => grad('#141b38', '#3a4682', -300, -300, W + 600, H + 600) + c_calFly(t, 9, 1, 0, 6) + bigText(['DEUX MOIS', 'PLUS TARD…'], t, .2, CX, 330, '#ffd23f', 130) + G(tr(CX, 700), wallClock(0, 0, 90, t * 30, 1)),
  sfx: [[0, 'el:time_pass', .9], [.2, 'el:hit_cine', .5], [.4, 'clock_fast', .5]] });
// B145b — grue qui plonge sous le sable : coupe, les œufs bien au chaud
B(145, { enter: 'none', cam: () => ({ z: 1.02 }),
  draw: (t, d) => { const k = eInOut(seg(t, 0, d)); return G(tr(0, lerp(300, -150, k)), bgSand(t, { sy: 200, night: 1 }) + c_nest(CX, 200, 1, t, 0) + eggsPile(CX, 900, 18, .9, t, 7) + text(1500, 800, OL, 'z z z', '#fff', 50)); },
  sfx: [[0, 'whoosh', .5], [.4, 'el:dig', .3]] }, at(145, 'sous'));
// B146 — « une petite coquille se fissure. » : macro, l'œuf tremble, battement lumineux, fissure au mot
B(146, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.12, eInOut(t / d)) }),
  draw: t => { const F = at(146, 'fissure'); return depth({ zoom: 1 }, [{ z: 3, svg: bgSand(t, { sy: -400, night: 1 }), blur: 4 },
    { z: 1, svg: glow(CX, 560, 400, '#fff6c8', .3 + .2 * Math.max(0, Math.sin(t * 8))) + egg(CX, 560, 4.4, seg(t, F - .1, F + .2) * .45, t, { r: t > F - .4 ? Math.sin(t * 40) * 4 : 0 }) + (t > F ? impactStar(CX + 160, 400, .5) + G(tr(CX + 320, 300, pop(t, F)), text(0, 0, OL, 'CRAC', '#fff', 80)) : '') },
    { z: .5, svg: Array.from({ length: 10 }, (_, i) => circ((i * 233) % W, 900 + (i % 3) * 80, 40 + (i % 4) * 14, '#a98758', 0)).join(''), blur: 9 }]); },
  sfx: [[.3, 'heartbeat', .6], [.9, 'heartbeat', .6], [at(146, 'fissure'), 'el:egg_crack', 1], [at(146, 'fissure') + .1, 'crack', .6]] });
// B147 — « Puis une deuxième. » : contre-plongée sous la pile ; un premier bébé sort la tête, regarde la deuxième qui craque
B(147, { enter: 'whip', cam: () => ({ z: 1.05, cy: 380, r: 6 }),
  draw: t => { const D2 = at(147, 'deuxième'); return bgSand(t, { sy: -400, night: 1 }) + glow(CX, 300, 600, '#fff6c8', .2) + egg(600, 760, 2.2, .7, t, { r: -5 }) + egg(1250, 520, 2.6, seg(t, D2 - .1, D2 + .2) * .45, t, { r: t > D2 - .3 ? Math.sin(t * 40) * 4 : 0 }) + egg(1500, 860, 2, 0, t) + egg(300, 400, 2, 0, t) +
    (t > D2 ? impactStar(1420, 380, .4) + G(tr(1500, 250, pop(t, D2)), text(0, 0, OL, 'CRAC !', '#fff', 70)) : '') + G(tr(640, 520, pop(t, .2)), text(0, 0, OL, '?', '#fff', 80)); },
  sfx: [[.1, 'squeak', .5], [at(147, 'deuxième'), 'el:egg_crack', 1], [at(147, 'deuxième') + .15, 'pop', .6]] });
// B148a — au ras du sable de nuit : la surface bouillonne, des têtes surgissent comme du pop-corn
B(148, { enter: 'none', cam: camHand(1.04, .5),
  draw: t => depth({ zoom: 1 }, [...c_nightL(t, { hz: 330, sy: 500 }).map(l => Object.assign(l, { blur: l.z > 1 ? 3 : 0 })),
    { z: 1, svg: Array.from({ length: 7 }, (_, i) => { const x = 200 + i * 250, t0 = .1 + (i * .37) % 1, k = eOutBack(seg(t, t0, t0 + .3)); return ell(x, 680, 90, 24, '#3a3022', 0) + (k > 0 ? G(tr(x, 690 - k * 70, k), sib({ x: 0, y: 0, s: .9, expr: i % 2 ? 'wow' : 'happy', seed: i }, t)) + sandFlying(x, 660, t + i, 6, i) : ''); }).join('') + rect(-300, 690, W + 600, 500, '#6e5c40', 0, 0) },
    { z: .5, svg: fgGrass(100, 1180, 1.4, t, '#3e5a30'), blur: 9 }]),
  sfx: [[.1, 'el:sand_pop', .8], [.47, 'el:sand_pop', .7], [.84, 'el:sand_pop', .8], [1.0, 'el:baby_squeak', .5]] });
// B148b — plongée : des dizaines de bébés jaillissent, pop-corn géant
B(148, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.15, 1.0, eOutCubic(t / d)), r: -4 }),
  draw: t => { let s = sandTop(t, 29).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#8c7652' : '#6e5c40'); const r = rng(3);
    for (let i = 0; i < 34; i++) { const x = 150 + r() * 1620, y = 120 + r() * 840, t0 = r() * 1.2; const k = eOutBack(seg(t, t0, t0 + .3)); if (k > 0) s += ell(x, y + 24, 60, 30, '#3a3022', 0) + G(tr(x, y, k * .7), sibT({ x: 0, y: 0, s: 1, walk: .8, rot: r() * 360 }, t)); }
    return s + c_counter(CX, 120, Math.min(60, Math.floor(seg(t, 0, 1.4) * 60)), 'BÉBÉS', '#fff', 64); },
  sfx: [[.1, 'el:sand_pop', .7], [.4, 'el:sand_pop', .7], [.7, 'el:sand_pop', .7], [1.0, 'el:baby_squeak', .6], [1.2, 'pop', .5]] }, at(148, 'bébés'));
// B149 — « L'un d'eux sort la tête. » : plan moyen, POP, un bébé à la mèche émerge avec un chapeau de sable
B(149, { enter: 'punch', cam: camPush(1.02, 1.1, .4),
  draw: t => { const S = at(149, 'sort'), k = eOutBack(seg(t, S, S + .35));
    return depth({ zoom: 1 }, [...c_nightL(t, { hz: 300, sy: 520 }).map(l => Object.assign(l, { blur: l.z > 1 ? 5 : 0 })),
      { z: 1, svg: ell(CX, 900, 240, 60, '#3a3022', 0) + G(tr(CX, 1150 - k * 260), kidF({ x: 0, y: 0, r: 130, expr: k > .9 ? 'wow' : 'shock', armL: 220, armR: -40 }, t) + G(tr(0, -370, 1, -10), path('M-80 0Q0 -60 80 0Z', '#a8916c'))) + rect(-300, 900, W + 600, 400, '#6e5c40', 0, 0) + (k > 0 ? sandFlying(CX, 880, t, 14) : '') + G(tr(CX + 320, 360, pop(t, S)), text(0, 0, OL, 'POP !', '#fff', 80)) },
      { z: .5, svg: fgShell(300, 1100, 1.8, 15), blur: 10 }]); },
  sfx: [[at(149, 'sort'), 'el:sand_pop', 1], [at(149, 'sort') + .05, 'pop', .8], [at(149, 'sort') + .3, 'el:baby_squeak', .8]] });
// B150 — « Il regarde autour de lui. » : profil, la tête qui pivote à toute vitesse gauche-droite (whip de tête)
B(150, { enter: 'whip', cam: () => ({ z: 1.08, hand: .6 }),
  draw: t => { const lk = Math.sign(Math.sin(t * 7)); return depth({ zoom: 1 }, [...c_nightL(t, { hz: 360, sy: 560 }).map(l => Object.assign(l, { blur: l.z > 1 ? 4 : 0 })),
    { z: 1, svg: kid({ x: CX, y: 720, s: 2.3, expr: 'confused', look: [lk, 0], flip: lk < 0 ? 1 : 0, headTilt: lk * 8 }, t) + motionLines(CX + lk * 330, 520, 3, 70, lk > 0 ? 0 : 180) + qmark(CX + 330, 300, .6 * pop(t, .4)) }]); },
  sfx: [[.1, 'whoosh', .5], [.35, 'whoosh', .5], [.6, 'whoosh', .5], [.9, 'el:baby_squeak', .5]] });
// B151 — « Et là… un problème. » : très large, la ville flamboie ; au mot : disque rayé, gel, alerte rouge
B(151, { enter: 'none', cam: (t, d) => t < at(151, 'problème') ? { z: lerp(1.0, 1.06, t / d) } : { z: 1.15, cx: 1300, cy: 500, shake: 5 },
  draw: t => { const P = at(151, 'problème'), red = t > P;
    return depth({ zoom: 1 }, [...c_nightL(t, { hz: 450, sy: 680 }), { z: 1, svg: kid({ x: 760, y: 730, s: .6, expr: red ? 'shock' : 'happy' }, t) }, { z: .5, svg: c_bokeh(t, 3, 8), blur: 10 }]) +
      (red ? rect(-300, -300, W + 600, H + 600, 'rgba(255,40,40,.18)', 0, 0) + G(tr(1300, 320, pop(t, P)), path('M0 -170L170 130L-170 130Z', '#ffd23f', 10) + text(0, 100, 'none', '!', OL, 200)) : ''); },
  sfx: [[0, 'el:a_night', .3], [at(151, 'problème'), 'el:record', 1], [at(151, 'problème') + .05, 'sting', .8], [at(151, 'problème') + .2, 'siren', .3]] });
// B152a — « Normalement… » : film documentaire d'époque (sépia, grain), plage sauvage d'autrefois sous la lune
B(152, { enter: 'none', cam: zin(1.0, 1.05),
  overlay: t => rect(0, 0, W, H, 'rgba(170,120,60,.35)', 0, 0) + Array.from({ length: 5 }, (_, i) => line((i * 433 + t * 1500) % W, 0, (i * 433 + t * 1500) % W + 10, H, 2, 'rgba(255,255,255,.25)')).join('') + tag(300, 140, 'DOCUMENTAIRE', t, .1, '#fff', OL, 40),
  draw: t => bgNightBeach(t, { moonX: 500, hz: 400, sy: 580 }) + c_nest(1300, 760, .8, t, 0) + sib({ x: 1150, y: 680, s: 1.1, expr: 'happy', flip: 1 }, t),
  sfx: [[0, 'el:record', .4], [.1, 'rewind', .4], [.4, 'el:chime', .4]] });
// B152b — travelling latéral en parallaxe : les bébés foncent joyeusement vers la mer qui brille
B(152, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: .6 }),
  draw: t => depth({ x: -t * 220, zoom: 1 }, [{ z: 6, svg: grad('#141c40', '#34407a', -900, -900, W + 1800, 1500) + glow(400, 200, 400, '#fff6d6', .5) + circ(400, 200, 60, '#fff6d6', 0) },
    { z: 2.4, svg: grad('#1d3f6e', '#0f2448', -900, 380, W + 1800, 220) + `<path d="M330 380L470 380L700 600L100 600Z" fill="rgba(255,246,214,.3)"/>` },
    { z: 1, svg: grad('#a8916c', '#6e5c40', -1200, 590, W + 2400, 800) + Array.from({ length: 7 }, (_, i) => sib({ x: 700 + i * 200 - t * 380 * (1 + (i % 3) * .1), y: 680 + (i % 2) * 40, s: .85, flip: 1, walk: 2, expr: i % 2 ? 'ecstatic' : 'happy', seed: i }, t)).join('') + motionLines(1800 - t * 300, 720, 3, 80, 0, 'rgba(255,255,255,.5)') },
    { z: .5, svg: fgGrass(1700, 1180, 1.5, t, '#3e5a30') + fgShell(300, 1080, 1.4, 10), blur: 9 }]),
  sfx: [[0, 'el:patter', .9], [.4, 'el:baby_squeak', .6], [1.2, 'el:wave_crash', .4]] }, at(152, 'les'));
// B152c — l'horizon lumineux : plan sur la mer brillante, flèche + « HORIZON LUMINEUX » ✓
B(152, { enter: 'tilt', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), cx: 500, cy: 400 }),
  draw: t => bgNightBeach(t, { moonX: 500, hz: 460, sy: 760 }) + glow(500, 460, 700, '#fff6d6', .35 + .1 * Math.sin(t * 3)) + Array.from({ length: 6 }, (_, i) => sparkle(380 + (i * 61) % 240, 500 + i * 40, .3 + .2 * Math.abs(Math.sin(t * 3 + i)), '#fff')).join('') +
    c_dash(`M1400 820Q1000 760 ${lerp(1300, 700, seg(t, 0, .7))} 640`, 12, '#fff', -t * 80) + tag(500, 300, 'HORIZON LUMINEUX', t, at(152, 'lumineux') - at(152, 'horizon'), '#fff6d6', OL, 56) + check(1000, 300, .6, t, at(152, 'mer') - at(152, 'horizon')),
  sfx: [[0, 'el:chime', .8], [.3, 'sparkle', .5], [at(152, 'mer') - at(152, 'horizon'), 'ding', .7]] }, at(152, 'horizon'));
// B153 — « Sauf que depuis ta naissance… » : contre-plongée, le bébé lève les yeux, les tours poussent du sol en accéléré, grue de chantier
B(153, { enter: 'crash', cam: (t, d) => ({ z: 1.04, cy: 360, r: 5 }),
  draw: t => { const k = eOutBack(seg(t, .5, 1.9));
    return grad('#141b38', '#3a3f6a', -300, -300, W + 600, H + 600) + glow(1300, 500, 700, '#ffcf70', .3 * k) + [[700, 360, 760], [1100, 300, 900], [1450, 360, 700]].map(([x, w, h], i) => hotel(x, 780, w, h * clamp(k - i * .1, 0, 1.2), clamp(k), '#d8d0c4', i + 3)).join('') +
      G(tr(300, 780), line(0, 0, 0, -700, 18, '#ffb703') + line(0, -700, 600, -700, 14, '#ffb703') + line(500, -700, 500, -700 + 300 * k, 4)) + rect(-300, 780, W + 600, 500, '#6e5c40', 0, 0) + c_calFly(t, 6, 1990, 18, 8) +
      kid({ x: 420, y: 800, s: 1.6, expr: 'jawdrop', look: [1, -1], headTilt: -20 }, t); },
  sfx: [[0, 'rewind', .6], [.5, 'hammer', .6], [.8, 'el:time_pass', .6], [1.2, 'hammer', .5], [1.6, 'boom', .4]] });
// B154 — « la plage a changé. » : plongée avant/après, les blocs de béton tombent du ciel
B(154, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.12, 1.0, eOutCubic(t / d)), shake: t > .4 && t < .7 ? 8 : 0 }),
  draw: t => { let s = sandTop(t, 31).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#a8916c' : '#8c7652') + rect(-300, -300, 900, H + 600, '#1d3f6e', 0, 0) + rect(1100, -300, 1200, H + 600, '#3c414c', 0, 0) + rect(980, -300, 140, H + 600, '#5b6068', 0, 0);
    for (let i = 0; i < 4; i++) { const kk = eOutBack(seg(t, i * .1, i * .1 + .25)); s += G(tr(1350 + (i % 2) * 360, 220 + Math.floor(i / 2) * 460, lerp(2.5, 1, clamp(kk))), op(clamp(kk * 2), rect(-150, -170, 300, 340, '#d8d0c4') + rect(-115, -135, 230, 270, '#ffe08a', 10, 5))); }
    return s + tag(450, 200, 'AVANT', t, 0, '#5ec4f0', '#fff', 50) + tag(1500, 120, 'MAINTENANT', t, .3, '#ff6fa5', '#fff', 50); },
  sfx: [[0, 'whoosh', .6], [.2, 'thud', .8], [.35, 'thud', .7], [.5, 'el:hit_cine', .5]] });
// B155 — « Il y a des hôtels. » : les hôtels poussent un par un (pop), musique de fête, le bébé minuscule en bas
B(155, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), cy: 500 }),
  draw: t => { const H0 = at(155, 'hôtels'); const hs = [[200, 260, 500], [520, 300, 640], [880, 260, 520], [1200, 320, 700], [1580, 260, 560]];
    return grad('#141b38', '#2c3670', -300, -300, W + 600, H + 600) + hs.map(([x, w, h], i) => { const k = eOutBack(seg(t, .3 + i * .15, .6 + i * .15)); return k <= 0 ? '' : G(`translate(${x + w / 2} 760) scale(1 ${f1(k)}) translate(${-x - w / 2} -760)`, hotel(x, 760, w, h, 1, '#d8d0c4', i + 1)); }).join('') +
      rect(-300, 760, W + 600, 500, '#6e5c40', 0, 0) + G(tr(CX, 150, pop(t, H0)), rect(-280, -60, 560, 120, '#ff6fa5', 20) + text(0, 26, 'none', '★★★★★', '#fff', 70)) + kid({ x: 960, y: 800, s: .7, expr: 'wow' }, t); },
  sfx: [[.3, 'pop', .8], [.45, 'pop', .8], [.6, 'pop', .8], [.75, 'pop', .8], [.9, 'pop', .8], [at(155, 'hôtels'), 'el:hotel_party', .6]] });
// B156 — « Des routes. Des parkings. » : profil, une voiture passe en trombe (le bébé décoiffé), lignes de parking qui se peignent
B(156, { enter: 'whip', cam: (t, d) => ({ z: 1.04, shake: t < .8 ? 4 : 0 }),
  draw: t => { const P = at(156, 'parkings'), cx = lerp(2400, -600, seg(t, .15, .8));
    return grad('#141b38', '#2a3266', -300, -300, W + 600, 900) + glow(1400, 300, 700, '#ffcf70', .4) + road(430, 220, t, 1200) + car(cx, 640, .9, t, { lights: 1, color: '#5b7bd6' }) + streaks(t, 1, 6, 'rgba(255,255,255,.4)') +
      rect(-300, 650, W + 600, 600, '#5b6068', 0, 0) + Array.from({ length: 6 }, (_, i) => op(seg(t, P + i * .06, P + i * .06 + .1), line(900 + i * 180, 680, 900 + i * 180, 1000, 10, '#fff'))).join('') +
      G(tr(1500, 300, pop(t, P)), rect(-70, -70, 140, 140, '#3a6fd8', 16) + text(0, 40, 'none', 'P', '#fff', 110)) + kid({ x: 500, y: 700, s: 1.4, expr: 'shock', squash: t > .4 && t < .8 ? .3 : 0, headTilt: -15 }, t) + (t > .4 ? motionLines(700, 560, 3, 60, 180, '#fff') : ''); },
  sfx: [[.2, 'el:car_pass', .9], [.25, 'whoosh', .6], [at(156, 'routes'), 'pop', .5], [at(156, 'parkings'), 'spray', .4], [at(156, 'parkings') + .3, 'ding', .5]] });
// B157 — « Et surtout… des lumières. » : très large en parallaxe, tout est éteint puis CLAC tout s'allume, bokeh au premier plan
B(157, { enter: 'none', cam: (t, d) => ({ z: 1.0, hand: .3 }),
  overlay: (t) => { const L = at(157, 'lumières') - .15; return op(.8 * (1 - seg(t, L, L + .3)), t >= L ? `<rect width="${W}" height="${H}" fill="#fff6c8"/>` : ''); },
  draw: (t, d) => { const L = at(157, 'lumières') - .15, lit = t >= L ? 1 : .05; const c = camMove(t, d, { x: -120, zoom: 1.05 }, { x: 120, zoom: 1.12 });
    return depth(c, [...c_nightL(t, { hz: 440, sy: 680, lit, split: 700 }), { z: 1, svg: kid({ x: 700, y: 720, s: .6, expr: lit > .5 ? 'wow' : 'neutral' }, t) },
      { z: .45, svg: lit > .5 ? c_bokeh(t, 5, 10) : '', blur: 11 }]); },
  sfx: [[.3, 'el:a_night', .3], [at(157, 'lumières') - .15, 'el:lightbuzz', 1], [at(157, 'lumières') - .1, 'el:hit_cine', .6], [at(157, 'lumières') + .2, 'el:hotel_party', .4]] });
// B158 — « Beaucoup de lumières. » : POV du bébé ébloui, bokeh qui se multiplie, clignements
B(158, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: 1 }), overlay: t => povEyes(t, [.35, .75, 1.15, 1.4], .7) + rect(0, 0, W, H, `rgba(255,250,220,${.15 + .25 * seg(t, 0, 1.6)})`, 0, 0),
  draw: t => { let s = c_nightFlat(t, { hz: 560, sy: 820, split: 300 }); const n = 6 + Math.floor(t * 20);
    for (let i = 0; i < n; i++) s += glow(100 + (i * 263) % 1800, 120 + (i * 157) % 620, 110 + (i % 3) * 60, ['#ffe08a', '#fff6c8', '#ffcf70'][i % 3], .7);
    return s + blur(8, c_bokeh(t, 11, 14)); },
  sfx: [[0, 'el:lightbuzz', .8], [.4, 'shutter', .3], [.8, 'el:hotel_party', .4], [1.2, 'glint', .6]] });
// B159 — « Alors ton bébé regarde devant lui. » : contre-plongée au ras du sable, reflets des lumières dans ses yeux étoilés
B(159, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), cy: 420 }),
  draw: t => depth({ zoom: 1 }, [...c_nightL(t, { hz: 620, sy: 860, split: 300 }).map(l => Object.assign(l, { blur: l.z > 1 ? 4 : 0 })),
    { z: 1, svg: glow(CX, 400, 600, '#ffcf70', .25) + kidF({ x: CX - 120, y: 930, r: 150, expr: 'wow', look: [.4, -.6], armL: 210, armR: -30, headTilt: -8 }, t) + sparkle(CX - 180, 640, .3 + .2 * Math.sin(t * 6), '#fff') + sparkle(CX - 50, 640, .3 + .2 * Math.cos(t * 6), '#fff') },
    { z: .5, svg: Array.from({ length: 9 }, (_, i) => circ((i * 237) % W, 1000 + (i % 3) * 50, 40 + (i % 4) * 16, '#6e5c40', 0)).join(''), blur: 9 }]),
  sfx: [[.1, 'el:baby_squeak', .7], [.6, 'sparkle', .6], [1.2, 'el:chime', .4]] });
// B160 — « Il voit une immense lumière. » : plongée, un cône de lumière divine tombe sur le minuscule bébé, chœur d'anges
B(160, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.15, 1.0, eOutCubic(t / d)), r: 5 }),
  draw: t => { const I = at(160, 'immense'), k = eOutCubic(seg(t, I - .3, I + .3));
    return sandTop(t, 41).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#6b5a42' : '#4f4232') + `<path d="M${CX - 120} -300L${CX + 120} -300L${CX + 520 * k + 120} 1200L${CX - 520 * k - 120} 1200Z" fill="rgba(255,250,210,${.45 * k})"/>` + glow(CX, 560, 500 * k + 100, '#fffbe0', .7 * k) +
      kidT({ x: CX, y: 560, s: 1.1, rot: 15 }, t) + stars(CX, 560, t, 6, 260) + Array.from({ length: 5 }, (_, i) => sparkle(CX - 300 + i * 150, 300 + (i % 2) * 400, .5 * k, '#fff')).join(''); },
  sfx: [[0, 'el:riser', .5], [at(160, 'immense'), 'angel', 1], [at(160, 'lumière'), 'el:chime', .7]] });
// B161 — « Il commence à avancer. » : travelling épaule en parallaxe, il trottine vers la lumière, petits cœurs
B(161, { enter: 'whip', cam: (t, d) => ({ z: 1.05, hand: .9 }),
  draw: t => depth({ x: t * 240, zoom: 1 }, [...c_nightL(t, { hz: 420, sy: 620, split: 100 }),
    { z: 1, svg: c_tracks(300, 720, 700 + t * 240, 720, 8) + kid({ x: 800 + t * 240, y: 700, s: 1.5, expr: 'joy', walk: 1.6 }, t) + heart(980 + t * 240, 420 - t * 60, .5) + heart(1060 + t * 240, 500 - t * 40, .4) },
    { z: .45, svg: c_bokeh(t, 8, 8) + fgGrass(1700, 1200, 1.6, t, '#3e5a30'), blur: 10 }]),
  sfx: [[0, 'el:patter', 1], [.4, 'el:baby_squeak', .5], [.9, 'boing', .3]] });
// B162 — « Sauf que cette lumière… » : profil, il ralentit ; la caméra panote vers la source de lumière (suspense)
B(162, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.25, eInOut(t / d)), cx: lerp(CX, 1550, eInOut(t / d)), cy: 380 }),
  draw: t => c_nightFlat(t, { hz: 500, sy: 700, split: 900 }) + kid({ x: 600, y: 700, s: 1.2, expr: 'happy', walk: .4 }, t) + glow(1550, 380, 500, '#fff6c8', .6 + .1 * Math.sin(t * 6)),
  sfx: [[0, 'el:riser', .8], [.6, 'drum', .5]] });
// B163 — « ce n'est pas l'océan. » : large, la lune (avec un visage) agite le bras côté mer : « ICI ! » ; croix rouge côté ville
B(163, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: t => depth({ zoom: 1 }, [...c_nightL(t, { hz: 420, sy: 640, moon: false }), { z: 4, svg: c_moonFace(320, 220, .9, t) + G(tr(560, 140, pop(t, .2)), text(0, 0, OL, 'ICI !', '#fff6d6', 64)) },
    { z: 1, svg: kid({ x: 1050, y: 700, s: .9, expr: 'happy', walk: .8 }, t) + c_dash('M950 690Q700 660 520 600', 10, '#5ec4f0', -t * 60) + tag(480, 520, 'L\'OCÉAN', t, .3, '#5ec4f0', '#fff', 44) + cross(1500, 330, .9, t, at(163, 'océan')) }]),
  sfx: [[0, 'el:record', .6], [.3, 'whistle', .5], [at(163, 'océan'), 'error_beep', .8]] });
// B164 — « C'est un hôtel. » : crash zoom sur la façade, enseigne néon, silhouettes qui dansent, boule disco
B(164, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 3 }),
  draw: t => { let s = rect(-300, -300, W + 600, H + 600, '#1a1630', 0, 0) + glow(CX, 500, 900, '#ff6fa5', .25) + rect(160, 140, 1600, 1100, '#e7e2d8');
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const x = 250 + i * 380, y = 330 + j * 260, c = ['#ffe08a', '#ff9ec4', '#9fe8ff'][(i + j + Math.floor(t * 6)) % 3]; s += rect(x, y, 280, 190, c, 10) + G(tr(x + 140, y + 190, 1, wave(t, 2, 12, i / 4)), circ(0, -110, 26, 'rgba(40,20,40,.7)', 0) + rect(-24, -86, 48, 90, 'rgba(40,20,40,.7)', 14, 0) + line(-20, -70, -60 + wave(t, 2, 20), -120, 12, 'rgba(40,20,40,.7)')); }
    return s + G(tr(CX, 150, pop(t, at(164, 'hôtel'))), rect(-340, -70, 680, 140, '#ff3b8d', 20, 8) + text(0, 30, 'none', 'HÔTEL ★★★★', '#fff', 72)) + G(tr(1700, 120, 1, t * 90), circ(0, 0, 60, '#cfd6dc') + path('M-60 0L60 0M0 -60L0 60', 'none', 3)); },
  sfx: [[0, 'el:hotel_party', 1], [.05, 'el:hit_cine', .6], [at(164, 'hôtel'), 'zap', .5]] });
// B165 — « pendant que ses frères et sœurs cherchent la mer… » : contre-plongée au ras du sol, les frères foncent (un passe flou au 1er plan), lui part à l'opposé au fond
B(165, { enter: 'tilt', cam: (t, d) => ({ z: 1.04, cy: 420, hand: .5 }),
  draw: t => depth({ zoom: 1 }, [...c_nightL(t, { hz: 480, sy: 660, split: 1100 }),
    { z: 1.6, svg: kid({ x: 1400 + t * 60, y: 700, s: .7, expr: 'happy', walk: 1 }, t), blur: 2 },
    { z: 1, svg: Array.from({ length: 4 }, (_, i) => sib({ x: 1500 - i * 260 - t * 420, y: 740 + (i % 2) * 30, s: 1.1, flip: 1, walk: 2, expr: 'ecstatic', seed: i + 2 }, t)).join('') + G(tr(500, 420, pop(t, at(165, 'mer'))), text(0, 0, OL, 'LA MEEER !', '#5ec4f0', 70)) },
    { z: .5, svg: sib({ x: 1400 - t * 900, y: 1150, s: 2.6, flip: 1, walk: 2, seed: 9 }, t), blur: 10 }]),
  sfx: [[0, 'el:patter', 1], [.4, 'whoosh', .6], [.9, 'el:baby_squeak', .6], [at(165, 'mer'), 'el:wave_crash', .4]] });
// B166 — « lui marche dans l'autre direction. » : plongée, le flot de bébés va à gauche, lui seul à droite ; un frère crie
B(166, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.1, 1.0, eOutCubic(t / d)), r: -3 }),
  draw: t => { let s = sandTop(t, 33).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#8c7652' : '#6e5c40') + rect(-300, -300, 620, H + 600, '#1d3f6e', 0, 0) + glow(150, 540, 400, '#fff6d6', .25) + rect(1580, -300, 700, H + 600, '#3c414c', 0, 0) + glow(1800, 540, 600, '#ffcf70', .5);
    for (let i = 0; i < 9; i++) s += sibT({ x: 1100 - t * 200 - (i % 3) * 70 - i * 30, y: 140 + i * 95, s: .55, rot: -90, walk: 1.4 }, t);
    return s + kidT({ x: 1150 + t * 120, y: 600, s: .8, rot: 90, walk: 1 }, t) + c_dash(`M${1260 + t * 120} 600L1520 600`, 10, '#ffd23f') + path('M1490 570L1530 600L1490 630', 'none', 12, '#ffd23f') + G(tr(700, 160, pop(t, .5)), text(0, 0, OL, 'HÉ ! PAR LÀ !', '#fff', 56)); },
  sfx: [[0, 'el:patter', .7], [.5, 'el:baby_squeak', .6], [1.2, 'whistle', .4]] });
// B167 — « Vers la route. » : plan moyen, il arrive au trottoir, tout content, lampadaire au-dessus
B(167, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: .4 }),
  draw: t => grad('#141b38', '#2a3266', -300, -300, W + 600, 800) + glow(1400, 300, 700, '#ffcf70', .5) + road(360, 260, t, 0) + streetLight(1550, 620, 380, 1) + rect(-300, 620, W + 600, 50, '#c9ccd1', 0, 0) + grad('#8c7652', '#6e5c40', -300, 670, W + 600, 600) +
    kid({ x: lerp(500, 780, t / 1.14), y: 760, s: 1.6, expr: 'happy', walk: 1.2 }, t) + G(tr(1150, 260, pop(t, at(167, 'route'))), rect(-150, -50, 300, 100, '#fff', 12) + text(0, 18, 'none', 'ROUTE', OL, 50)),
  sfx: [[0, 'el:traffic', .5], [.2, 'el:patter', .6], [at(167, 'route'), 'pop', .5]] });
// B168 — « Une voiture approche. » : POV du conducteur : tableau de bord, radio, la route ; le minuscule bébé invisible dans le noir
B(168, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .6 }),
  draw: t => c_carPOV(t, grad('#0d1228', '#232b55', -300, -300, W + 600, 700) + glow(1500, 300, 500, '#ffcf70', .4) + `<path d="M-300 640L860 330L1060 330L2300 640Z" fill="#3c414c"/>` + Array.from({ length: 5 }, (_, i) => { const k = ((i / 5 + t * 1.2) % 1); return rect(CX - 6 - k * 30, 340 + k * k * 300, 12 + k * 60, 10 + k * 30, '#f4f1e6', 3, 0); }).join('') +
    `<path d="M700 640L900 360L1020 360L1220 640Z" fill="rgba(255,245,190,.25)"/>` + Array.from({ length: 3 }, (_, i) => text(1400 + i * 50, 600 - ((t * 80 + i * 40) % 120), 'none', '♪', '#5ef0a0', 40)).join('')),
  sfx: [[0, 'el:car_engine', 1], [.3, 'el:hotel_party', .3], [.8, 'el:traffic', .4]] });
// B169 — « Ses phares éclairent le sable. » : large, les faisceaux balayent le sable scintillant, le bébé pris dans la lumière, longue ombre
B(169, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(t / d)) }),
  draw: t => { const k = seg(t, 0, 1.8), bx = lerp(1700, 1400, k);
    return depth({ zoom: 1 }, [{ z: 4, svg: grad('#0d1228', '#232b55', -900, -900, W + 1800, 1300) + glow(1500, 200, 500, '#ffcf70', .3) },
      { z: 1.6, svg: road(300, 200, t, 0) + car(bx, 480, .7, t, { lights: 0 }) },
      { z: 1, svg: grad('#6b5a42', '#3e3324', -900, 520, W + 1800, 900) + `<path d="M${bx - 150} 450L-300 ${lerp(300, 500, k)}L-300 1300L${bx - 60} 500Z" fill="rgba(255,245,190,.35)"/>` + Array.from({ length: 20 }, (_, i) => sparkle((i * 97) % 1300, 640 + (i * 53) % 400, .15 + .12 * Math.abs(Math.sin(t * 4 + i)), '#fff')).join('') +
        `<path d="M700 700L240 ${740 + 20 * Math.sin(t)}L240 770L700 720Z" fill="rgba(0,0,0,.35)"/>` + kid({ x: 760, y: 710, s: 1.1, expr: 'wow', walk: .6 }, t) },
      { z: .5, svg: fgGrass(150, 1180, 1.6, t, '#3e5a30'), blur: 9 }]); },
  sfx: [[0, 'el:car_pass', .7], [.5, 'glint', .5], [1.2, 'sparkle', .4]] });
// B170 — « Le petit continue d'avancer. » : gros plan de face, il marche vers nous en chantonnant, inconscient, éclairé de plus en plus fort
B(170, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .4 }),
  draw: t => { const k = seg(t, 0, 1.78);
    return grad('#121630', '#262a4a', -300, -300, W + 600, H + 600) + glow(CX, 500, 900, '#fff6c8', .3 + .5 * k) + kidF({ x: CX, y: 820 + Math.abs(Math.sin(t * 8)) * 10, r: 150, expr: 'ecstatic', armL: 210 + wave(t, 2, 15), armR: -30 - wave(t, 2, 15), look: [0, 0] }, t) +
      Array.from({ length: 3 }, (_, i) => { const q = (t * .8 + i / 3) % 1; return op(1 - q, text(CX + 260 + q * 120, 360 - q * 200, OL, '♪', '#fff', 70)); }).join('') + c_white(k * .3); },
  sfx: [[0, 'el:patter', .7], [.3, 'el:baby_squeak', .5], [.8, 'el:car_engine', .5], [1.2, 'el:heart_slow', .5]] });
// B171 — « Il ne comprend pas. » : contre-plongée, il lève les yeux, perplexe ; deux soleils jumeaux au loin
B(171, { enter: 'whip', cam: () => ({ z: 1.06, cy: 400, r: -6 }),
  draw: t => grad('#121630', '#262a4a', -300, -300, W + 600, H + 600) + glow(1450, 300, 300, '#fff6c8', .9) + glow(1700, 300, 300, '#fff6c8', .9) + circ(1450, 300, 50, '#fffbe0', 0) + circ(1700, 300, 50, '#fffbe0', 0) + rect(-300, 720, W + 600, 600, '#4f4232', 0, 0) +
    kid({ x: 700, y: 760, s: 2, expr: 'confused', look: [1, -1], headTilt: -15 }, t) + qmark(1000, 380, .9 * pop(t, .1)) + qmark(1120, 300, .6 * pop(t, .3), '#fff', 15),
  sfx: [[0, 'hmm', .5], [.2, 'el:car_engine', .6], [.3, 'squeak', .4]] });
// B172 — « Il suit simplement la lumière. » : plongée, grue qui monte, il trottine dans le faisceau, ombre qui s'allonge
B(172, { enter: 'none', cam: (t, d) => ({ z: lerp(1.15, 1.0, eInOut(t / d)), r: 3 }),
  draw: t => sandTop(t, 35).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#6b5a42' : '#4f4232') + rect(1300, -300, 1000, H + 600, '#5b6068', 0, 0) + line(1300, -300, 1300, H + 300, 14, '#c9ccd1') +
    `<path d="M1600 560L200 160L200 960Z" fill="rgba(255,245,190,${.35 + .1 * seg(t, 0, 2)})"/>` + c_tracks(300, 560, lerp(500, 820, t / 2.2) - 80, 560, 8) + kidT({ x: lerp(500, 820, t / 2.2), y: 560, s: .9, rot: 90, walk: 1 }, t) + `<path d="M${lerp(500, 820, t / 2.2) - 50} 560L${lerp(500, 820, t / 2.2) - 350} 540L${lerp(500, 820, t / 2.2) - 350} 580Z" fill="rgba(0,0,0,.3)"/>`,
  sfx: [[0, 'el:patter', .6], [.6, 'el:car_engine', .6], [1.4, 'el:heart_slow', .5]] });
// B173a — « Comme son instinct… » : gros plan, yeux en cœur, sérénité totale face à la lumière
B(173, { enter: 'none', cam: (t, d) => ({ z: lerp(1.05, 1.12, t / d) }),
  draw: t => grad('#121630', '#262a4a', -300, -300, W + 600, H + 600) + glow(CX, 400, 900, '#fff6c8', .75) + kidF({ x: CX, y: 840, r: 160, expr: 'love', armL: 220, armR: -40, look: [0, -.3] }, t) + c_white(.25),
  sfx: [[0, 'el:heart_slow', .7], [.2, 'angel', .4]] });
// B173b — les phares éblouissent la caméra : la lumière envahit tout → BLANC (pudique, aucun impact)
B(173, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.25, eInCubic(t / d)), shake: 2 }),
  draw: (t, d) => { const k = seg(t, 0, d * .85);
    return rect(-300, -300, W + 600, H + 600, '#0d0f1e', 0, 0) + G(tr(CX, 700, lerp(.6, 2.6, eInCubic(k))), carFront(0, 0, 1, 1)) + glow(CX - 260, 560, 600 * (1 + k * 3), '#fffbe0', .9) + glow(CX + 260, 560, 600 * (1 + k * 3), '#fffbe0', .9) +
      Array.from({ length: 6 }, (_, i) => circ(CX + (i - 2.5) * 140 * (1 + k), 560 + (i % 2) * 60, 20 + i * 8, 'rgba(255,255,230,.35)', 0)).join('') + c_white(eInCubic(seg(t, d * .45, d))); },
  sfx: [[0, 'el:car_engine', .8], [.2, 'el:riser', .7], [.9, 'el:heart_slow', .5]] }, at(173, 'instinct'));

// ============================================================
//  AU LARGE (fin lente, letterbox)
// ============================================================
// B174 — « Et quelque part, au large… » : le blanc se dissout sur la mer de nuit, grand panoramique profil, ville minuscule au loin
B(174, { enter: 'none', cam: (t, d) => ({ z: lerp(1.08, 1.0, t / d), bars: 1 }),
  draw: (t, d) => depth({ x: t * 30, zoom: 1 }, [{ z: 6, svg: grad('#0c1330', '#2a3466', -900, -900, W + 1800, 1500) + Array.from({ length: 60 }, (_, i) => circ((i * 397) % (W + 600) - 300, (i * 131) % 450, 2, 'rgba(255,255,255,.6)', 0)).join('') + glow(1500, 200, 300, '#fff6d6', .4) + circ(1500, 200, 55, '#fff6d6', 0) },
    { z: 3, svg: G(tr(-100, 520), Array.from({ length: 30 }, (_, i) => circ(i * 14, -(i * 37 % 30), 4, '#ffcf70', 0)).join('') + glow(200, 500 - 520, 300, '#ffcf70', .3)) },
    { z: 1.5, svg: grad('#1d3f6e', '#081830', -900, 530, W + 1800, 900) + `<path d="M1460 530L1540 530L1700 1100L1300 1100Z" fill="rgba(255,246,214,.18)"/>` + Array.from({ length: 6 }, (_, i) => path(`M${-600 - (t * 20 + i * 40) % 240} ${560 + i * 80}` + Array.from({ length: 22 }, () => 'q60 -10 120 0').join(''), 'none', 4, 'rgba(200,220,255,.2)')).join('') }]) + c_white(1 - seg(t, 0, .9)),
  sfx: [[0, 'el:wave_crash', .3], [.5, 'el:a_wind', .3], [1.2, 'el:chime', .3]] });
// B175 — « tu continues de nager. » : large en coupe surface, elle nage paisible sous la lune, inconsciente
B(175, { enter: 'none', cam: (t, d) => ({ z: 1.02, bars: 1 }),
  draw: t => depth({ x: t * 60, zoom: 1 }, [...underLayers(t, { dark: .6, surface: 260 }), { z: 1, svg: glow(1300, 0, 700, '#e8f0ff', .25) + G(tr(800 + t * 60, 600), torA({ x: 0, y: 0, s: 1.3, expr: 'calm', swim: .6 }, t)) }, { z: .5, svg: fgBubbles(t, 12, 4), blur: 8 }]),
  sfx: [[0, 'el:bubbles', .4], [.4, 'el:swim_whoosh', .4]] });
// B176–B179 — souvenirs : des polaroïds dérivent dans l'eau autour d'elle (cadrages variés)
function c_polar(x, y, inner, t, t0, r = 0) { return c_memory(x, y, 300, 220, rect(-200, -150, 400, 300, '#bfe3ff', 0, 0) + inner, pop(t, t0, .5), r + wave(t, .4, 4), .25); }
B(176, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), bars: 1 }),
  draw: t => bgUnder(t, { dark: .55 }) + torAF({ x: 640, y: 840, r: 150, expr: 'calm', armL: 210, armR: -30, face: { mouth: 'smile' } }, t) + c_polar(1350, 380, eagleFront({ x: 0, y: 20, s: .3, expr: 'starving' }, t), t, at(176, 'oiseaux') - .1, 8) + check(1520, 300, .4, t, at(176, 'oiseaux') + .2),
  sfx: [[at(176, 'oiseaux') - .1, 'shutter', .5], [at(176, 'oiseaux'), 'el:eagle', .3], [at(176, 'oiseaux') + .2, 'ding', .4]] });
B(177, { enter: 'none', cam: () => ({ z: 1.04, bars: 1, cy: 380 }),
  draw: t => bgUnder(t, { dark: .55, surface: 120 }) + torA({ x: 650, y: 720, s: 1.7, expr: 'calm', swim: .4 }, t) + c_polar(1350, 380, crab({ x: 0, y: 30, s: .5, angry: 1 }, t), t, .1, -6) + check(1520, 300, .4, t, .4),
  sfx: [[.1, 'shutter', .5], [.15, 'el:crab', .3], [.4, 'ding', .4]] });
B(178, { enter: 'none', cam: (t, d) => ({ z: lerp(1.08, 1.0, t / d), bars: 1, r: 3 }),
  draw: t => grad('#123a5a', '#061a33', -300, -300, W + 600, H + 600) + torAT({ x: CX, y: 560, s: 1.4, swim: .5 }, t) + c_polar(500, 380, shark({ x: 0, y: 10, s: .4 }, t), t, .1, -8) + c_polar(1420, 420, net(0, -100, 260, 200, t, { n: 6, floats: false }), t, at(178, 'filets') - .1, 7),
  sfx: [[.1, 'shutter', .5], [.15, 'el:shark', .3], [at(178, 'filets') - .1, 'shutter', .5], [at(178, 'filets'), 'el:net_creak', .3]] });
B(179, { enter: 'none', cam: () => ({ z: 1.06, bars: 1, hand: .2 }),
  draw: t => bgUnder(t, { dark: .6 }) + torAF({ x: 1250, y: 860, r: 140, expr: 'calm', armL: 200, armR: -20 }, t) + c_polar(560, 380, plasticBag({ x: 0, y: -20, s: .6 }, t), t, .1, 6) + check(740, 300, .4, t, .4),
  sfx: [[.1, 'shutter', .5], [.15, 'el:bag_rustle', .3], [.4, 'ding', .4]] });
// B180a — profil lent : elle nage, la trace en pointillés de 35 ans derrière elle
B(180, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), bars: 1 }),
  draw: t => depth({ x: t * 40, zoom: 1 }, [...underLayers(t, { dark: .5, surface: 200 }), { z: 1, svg: c_dash(`M-400 700C0 400 300 900 ${700 + t * 40} 600`, 8, 'rgba(255,255,255,.4)') + G(tr(900 + t * 40, 600), torA({ x: 0, y: 0, s: 1.4, expr: 'calm', swim: .4 }, t)) + G(tr(300, 330), text(0, 0, OL, '35 ANS', 'rgba(255,255,255,.7)', 70)) }]),
  sfx: [[0, 'el:swim_whoosh', .3], [.8, 'el:bubbles', .3]] });
// B180b — la tête hors de l'eau, de dos, elle regarde une dernière fois la plage illuminée au loin
B(180, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), bars: 1 }),
  draw: t => depth({ zoom: 1 }, [...c_nightL(t, { hz: 470, sy: 560, split: 700, moonX: 300 }).slice(0, 2),
    { z: 1, svg: grad('#183a68', '#081830', -900, 520, W + 1800, 900) + Array.from({ length: 5 }, (_, i) => path(`M${-600 - (t * 20 + i * 40) % 240} ${600 + i * 90}` + Array.from({ length: 22 }, () => 'q60 -10 120 0').join(''), 'none', 4, 'rgba(200,220,255,.2)')).join('') +
      G(tr(760, 600, 1.5), ell(0, 70, 230, 40, 'rgba(255,255,255,.15)', 0) + ell(0, 40, 200, 70, T_SHELL) + circ(0, -40, 80, T_SKIN) + bow(-50, -100, .8, -25) + path('M-60 -90Q0 -130 60 -90', 'none', 5, 'rgba(0,0,0,.15)')) }]),
  sfx: [[0, 'el:wave_crash', .3], [.6, 'el:a_wind', .3]] }, at(180, 'retrouver'));
// B181a — très large en parallaxe : la ville éblouissante, bokeh flou au premier plan ; sur la plage vide, des petites traces vers la route
B(181, { enter: 'none', cam: (t, d) => ({ z: 1, bars: 1 }),
  draw: (t, d) => depth(camMove(t, d, { x: -100, zoom: 1.04 }, { x: 80, zoom: 1.1 }), [...c_nightL(t, { hz: 480, sy: 700, split: 600 }),
    { z: 1, svg: c_tracks(400, 950, 1250, 640, 12, 'rgba(30,20,10,.4)') }, { z: .45, svg: c_bokeh(t, 21, 10), blur: 11 }]),
  sfx: [[0, 'el:a_night', .3], [.4, 'el:lightbuzz', .3], [1.2, 'el:traffic', .2]] });
// B181b — insert : une ampoule de lampadaire qui grésille, un papillon de nuit qui tourne autour
B(181, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), bars: 1 }),
  draw: t => { const fl = Math.sin(t * 40) > .9 ? .6 : 1, a = t * 4;
    return rect(-300, -300, W + 600, H + 600, '#0e1226', 0, 0) + glow(CX, 420, 700, '#fff3b0', .6 * fl) + line(CX - 600, 200, CX - 120, 260, 30) + line(CX - 600, 200, CX - 120, 260, 18, '#6b7480') + path(`M${CX - 160} 250L${CX + 160} 250L${CX + 120} 330L${CX - 120} 330Z`, '#8a96a3') + ell(CX, 360, 120, 50, fl > .8 ? '#fffbe0' : '#e8dca0') +
      G(tr(CX + Math.cos(a) * 300, 460 + Math.sin(a * 1.3) * 140, 1.6, wave(t, 6, 20)), ell(-20, 0, 30, 18, '#d8d0c4', 4) + ell(20, 0, 30, 18, '#d8d0c4', 4) + ell(0, 0, 8, 22, '#8a7a6a', 4)); },
  sfx: [[0, 'el:lightbuzz', .6], [.5, 'buzz', .3], [1.2, 'el:lightbuzz', .4]] }, at(181, 'lumière'));
// B182a — l'œuf vide à la mèche, sur le sable ; de minuscules traces qui s'éloignent vers les lumières (gros plan lent)
B(182, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), bars: 1 }),
  draw: t => depth({ zoom: 1 }, [...c_nightL(t, { hz: 360, sy: 520, split: 500 }).map(l => Object.assign(l, { blur: l.z > 1 ? 6 : 0 })),
    { z: 1, svg: G(tr(700, 680, 2.2), ell(0, 20, 60, 20, 'rgba(0,0,0,.25)', 0) + path('M-52 10Q-50 60 0 62Q50 60 52 10L40 0L26 12L12 -2L-2 12L-16 -4L-28 10L-40 -2Z', '#fbf6ea')) + c_tracks(820, 690, 1700, 560, 9, 'rgba(30,20,10,.45)') }]),
  sfx: [[0, 'el:a_wind', .3], [.6, 'el:heart_slow', .3]] });
// B182b — dernier plan : l'horizon lumineux de la mer, beau et vide ; elle, minuscule, nage dans le reflet de la lune. Lent, letterbox, fondu au noir
B(182, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.12, eInOut(clamp(t / d))), cy: 420, bars: 1 }),
  draw: (t, d) => grad('#0c1330', '#2a3466', -300, -300, W + 600, 800) + Array.from({ length: 50 }, (_, i) => circ((i * 397) % W, (i * 131) % 420, 2, `rgba(255,255,255,${.4 + .3 * Math.sin(t + i)})`, 0)).join('') + glow(CX, 300, 500, '#fff6d6', .45) + circ(CX, 300, 75, '#fff6d6', 0) +
    grad('#1d3f6e', '#081830', -300, 520, W + 600, 800) + glow(CX, 520, 800, '#fff6d6', .3) + `<path d="M${CX - 50} 520L${CX + 50} 520L${CX + 260} 1300L${CX - 260} 1300Z" fill="rgba(255,246,214,.25)"/>` +
    Array.from({ length: 8 }, (_, i) => sparkle(CX - 120 + (i * 53) % 240, 560 + i * 50, .2 + .15 * Math.abs(Math.sin(t * 2 + i)), '#fff')).join('') +
    G(tr(CX + 40 - t * 15, 620, .45), torA({ x: 0, y: 0, s: 1, expr: 'calm', swim: .4, flip: 1 }, t)) + c_black(seg(t, d - 1.6, d) * .7),
  sfx: [[0, 'el:wave_crash', .25], [.6, 'el:chime', .3], [1.5, 'el:heart_slow', .25]] }, at(182, 'jamais'));
