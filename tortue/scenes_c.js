// ============================================================
//  B122–B182 : 35 ans, le retour, la ponte, les bébés et les lumières + BANDE-SON (BEDS)
// ============================================================
// plage de nuit « bétonnée » : mer à gauche (horizon lumineux de lune), hôtels + route à droite
function bgResort(t, o = {}) {
  const hz = o.hz ?? 470, sy = o.sy ?? 720, lit = o.lit ?? 1, split = o.split ?? 860;
  let s = grad('#121c3c', '#2c3670', -200, -200, W + 400, hz + 200);
  const r = rng(8); for (let i = 0; i < 40; i++) s += circ(r() * split, r() * hz * .9, 1.5 + r() * 2, 'rgba(255,255,240,.7)', 0);
  s += circ(o.moonX ?? 280, 150, 50, '#fff6d6', 0) + glow(o.moonX ?? 280, 150, 200, '#fff6d6', .3);
  s += `<path d="M-200 ${hz}L${split + 60} ${hz}L${split - 160} ${sy}L-200 ${sy}Z" fill="#1d3f6e"/>` + `<path d="M${(o.moonX ?? 280) - 40} ${hz}L${(o.moonX ?? 280) + 40} ${hz}L${(o.moonX ?? 280) + 140} ${sy}L${(o.moonX ?? 280) - 140} ${sy}Z" fill="rgba(255,246,214,${o.moonGlow ?? .22})"/>`;
  for (let i = 0; i < 4; i++) s += path(`M-200 ${hz + 40 + i * 55}q60 -10 120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0`, 'none', 4, 'rgba(200,220,255,.25)').replace('M-200', `M${-200 - (t * 20 + i * 30) % 240}`);
  s += `<path d="M${split + 60} ${hz}L${W + 200} ${hz}L${W + 200} ${sy}L${split - 160} ${sy}Z" fill="#3c414c"/>`;
  const hs = o.hotels ?? [[960, 180, 330], [1180, 240, 420], [1460, 200, 300], [1700, 260, 380]];
  for (const [x, w, h] of hs) s += hotel(x, hz + 40, w, h * (o.hk ?? 1), lit, '#d8d0c4', x % 7);
  if (lit > .2) s += glow(1400, hz - 100, 900, '#ffcf70', .35 * lit);
  if (o.road !== false) { s += `<path d="M${split - 70} ${sy - 150}L${W + 200} ${sy - 150}L${W + 200} ${sy - 30}L${split - 150} ${sy - 30}Z" fill="#5b6068"/>`; for (let x = split; x < W + 200; x += 200) s += rect(x - ((t * (o.carSpeed || 0)) % 200), sy - 96, 100, 12, '#f4f1e6', 4, 0); }
  if (o.lamps !== false) for (const x of [1000, 1350, 1700]) s += streetLight(x, sy - 150, 260, lit);
  s += grad('#a8916c', '#7c6a4c', -200, sy, W + 400, H - sy + 400) + line(-200, sy, W + 200, sy, 5, 'rgba(0,0,0,.2)');
  return s;
}
function lightEyes(x, y, s, t) { return G(tr(x, y, s), glow(0, 0, 160, '#ffe9a0', .6) + circ(0, 0, 40, '#fff8d0', 0)); }
function memory(x, y, w, h, inner, k) { return G(tr(x, y, k), rect(-w / 2, -h / 2, w, h, '#f3e3c3', 30, 8) + inner.replace(/<g/, '<g opacity=".9"') + rect(-w / 2, -h / 2, w, h, 'rgba(160,110,50,.18)', 30, 0)); }
function iconCard(x, y, s, inner, t, t0, crossed = 1) { const k = pop(t, t0, .35); return k <= 0 ? '' : G(tr(x, y, s * k), circ(0, 0, 130, '#fff') + inner + circ(0, 0, 130, 'none') + (crossed ? G('', path('M-80 -80L80 80', 'none', 30) + path('M-80 -80L80 80', 'none', 16, '#ff4d4d')) : '')); }
function trackMarks(x1, y1, x2, y2, n = 10) { let s = ''; for (let i = 0; i < n; i++) { const k = i / n; s += ell(lerp(x1, x2, k) - 30, lerp(y1, y2, k), 16, 9, 'rgba(120,90,50,.35)', 0) + ell(lerp(x1, x2, k) + 30, lerp(y1, y2, k) + 20, 16, 9, 'rgba(120,90,50,.35)', 0); } return s; }

// ---------- 35 ANS ----------
B(122, { enter: 'none', cam: zin(1, 1.08),
  draw: t => { let s = bgUnder(t); for (let i = 0; i < 6; i++) s += G(tr(CX - 500 + i * 200, 360, 1, ((t * 6 + i) % 1) * 60 - 30), op(1 - ((t * 6 + i) % 1), calendarPage(0, 0, .7, 0, String(1990 + i * 6 + Math.floor(t * 10))))); return s + torAF({ x: CX, y: 1120, r: 140, expr: 'shock', armL: 200, armR: -20 }, t); },
  sfx: [[0, 'el:time_pass', 1], [.1, 'clock_fast', .5]] });
B(123, { cam: zin(1.04, 1.1),
  draw: t => bgUnder(t) + torAF({ x: CX, y: 1120 + Math.abs(Math.sin(t * 6)) * 20, r: 150, expr: 'deadpan', armL: 200, armR: -20 }, t),
  sfx: [[.1, 'pop', .8]] });
B(124, { flash: 1, cam: shk(1.08, 8),
  draw: t => rays(t, CX, CY, '#ffe08a', '#ffc23d') + confetti(t, 0, 40) + bigText(['35 ANS'], t, .05, CX, 420, '#ff6fa5', 260) + G(tr(CX, 960), rect(-260, -60, 520, 120, '#fff4e0', 20) + Array.from({ length: 7 }, (_, i) => rect(-200 + i * 64, -150, 18, 90, '#5ec4f0', 6, 4) + ell(-191 + i * 64, -165, 9, 14, '#ffb703', 3)).join('')),
  sfx: [[0, 'el:hit_cine', 1], [.1, 'tada', .8]] });
B(125, { cam: zin(1, 1.1),
  draw: t => bgUnder(t, { dark: .2 }) + G(tr(lerp(700, 900, t / 1.6), 560), torA({ x: 0, y: 0, s: 1.6, expr: 'calm', swim: lerp(1, .1, t / 1.6) }, t)),
  sfx: [[0, 'el:swim_whoosh', .5], [.6, 'el:riser', .4]] });
B(126, { cam: zin(1, 1.1),
  draw: t => { let s = bgUnder(t); for (let i = 0; i < 4; i++) { const k = (t * .7 + i / 4) % 1; s += op(1 - k, path(`M${1900 - k * 900} ${200 + i * 150}q-60 40 0 80t0 80`, 'none', 10, '#ffe08a')); } return s + torA({ x: 760, y: 640, s: 1.5, expr: 'wow', swim: .2, look: [1, -.3] }, t) + stars(760, 300, t, 4, 180); },
  sfx: [[0, 'el:chime', .8], [.4, 'el:sonar', .5]] });
B(127, { cam: zin(1.15, 1.0),
  draw: t => rays(t, CX, 400, '#ffe6b8', '#ffd28a') + bgBeach(t, { dusk: .5, hz: 560, sy: 760, sunX: 1500, sunY: 380, hotels: 1 }).replace(/<defs>.*?<\/rect>/, '') + glow(CX, 760, 500, '#fff6c8', .5) + G(tr(CX, 900, 1, 0), torAT({ x: 0, y: 0, s: .6, swim: 1, rot: 0 }, t)),
  sfx: [[0, 'el:wave_crash', .5], [.2, 'el:gull', .4]] });
B(128, { cam: zin(1, 1.06),
  draw: t => bgUnder(t) + torAF({ x: 460, y: 1120, r: 130, expr: 'calm', armL: 200, armR: -20 }, t) + memory(1250, 500, 820, 560, bgSand(t, { sy: -100, night: 1 }).replace(/<defs>/, '<defs>').slice(0, 0) + rect(-400, -270, 800, 540, '#e9c98d', 26, 0) + egg(0, 40, 2.8, .8, t, { bow: 1 }), pop(t, .2)),
  sfx: [[.2, 'magic', .9], [.6, 'el:egg_crack', .4], [1, 'el:baby_squeak', .5]] });
B(129, { cam: zin(1, 1.06),
  draw: t => bgUnder(t) + torAF({ x: 460, y: 1120, r: 130, expr: t > .5 ? 'scared' : 'worried', armL: 220, armR: -40 }, t) + memory(1250, 500, 820, 560, rect(-400, -270, 800, 540, '#bfe3ff', 26, 0) + eagle({ x: 80, y: -40, s: .8, talons: 'open', expr: 'hungry' }, t) + tor({ x: -200, y: 220, s: .5, expr: 'scared' }, t), pop(t, .1)),
  sfx: [[.1, 'magic', .6], [.4, 'el:eagle', .7], [.6, 'sting', .5]] });
B(130, { cam: zout(1.15, 1.0),
  draw: t => { let s = grad('#3d9fd1', '#1d6a9f', -200, -200, W + 400, H + 400) + path('M-200 200Q200 120 300 300Q260 520 -200 560Z', '#e9d39a') + path('M1700 900Q1900 700 2200 760L2200 1300L1600 1300Z', '#e9d39a');
    s += path(`M240 300C700 900 1400 100 1700 600S900 1000 300 420`, 'none', 10, '#fff').replace('stroke-linecap', `stroke-dasharray="26 26" stroke-dashoffset="${-t * 80}" stroke-linecap`);
    return s + torAT({ x: lerp(1600, 600, t / 2.1), y: lerp(600, 760, t / 2.1), s: .5, rot: -80, swim: 1 }, t) + tag(300, 200, 'TA PLAGE', t, .2, '#fff', OL, 46) + tag(CX, 960, 'DES DÉCENNIES', t, .9, '#ffd23f', OL, 60); },
  sfx: [[0, 'whoosh', .7], [.9, 'pop', .6]] });
B(131, { cam: zin(1, 1.06),
  draw: t => bgUnder(t) + torA({ x: 820, y: 680, s: 1.6, expr: 'cool', swim: .5 }, t) + G(tr(820, 430, pop(t, .4)), circ(0, 0, 90, '#fff') + circ(0, 0, 70, '#eaf6ff', 5) + G(`rotate(${wave(t, .5, 30)})`, path('M0 -60L16 0L-16 0Z', '#ff4d4d', 4) + path('M0 60L16 0L-16 0Z', '#fff', 4))) + tag(1450, 300, 'GPS INTÉGRÉ', t, 1.2, '#5fd068', OL, 56),
  sfx: [[.4, 'el:sonar', .9], [1.2, 'ding', .7]] });
B(132, { cam: zin(1, 1.05),
  draw: t => { const a = R(-60 + t * 18); return grad('#0b1530', '#1d2b5c', -200, -200, W + 400, H + 400) + Array.from({ length: 50 }, (_, i) => circ((i * 397) % W, (i * 211) % H, 2, 'rgba(255,255,255,.6)', 0)).join('') + magEarth(CX - 200, CY, 1.6, t) +
    G(tr(CX - 200 + Math.cos(a) * 340, CY + Math.sin(a) * 360, .35, t * 18 + 30), torAT({ x: 0, y: 0, s: 1, swim: 1 }, t)) + tag(1500, 300, 'CHAMP', t, 1.6, '#78c8ff', OL, 64) + tag(1500, 420, 'MAGNÉTIQUE', t, 1.75, '#78c8ff', OL, 64) +
    (t > 3 ? G(tr(1500, 700, pop(t, 3)), circ(0, 0, 90, '#fff') + path('M0 -60L16 0L-16 0Z', '#ff4d4d', 4) + path('M0 60L16 0L-16 0Z', '#fff', 4)) : ''); },
  sfx: [[0, 'el:sonar', .8], [1.6, 'magic', .7], [3.0, 'pop', .6], [4.5, 'el:sonar', .5]] });
B(133, { cam: zout(1.15, 1.0),
  draw: t => { const ph = t / 3.2; return grad(lerpColor('#2a8fc0', '#103c63', (Math.sin(t * 2) + 1) / 2), '#0c3b63', -200, -200, W + 400, H + 400) + path('M100 700Q600 300 1100 600T1850 300', 'none', 10, 'rgba(255,255,255,.5)').replace('stroke-linecap', 'stroke-dasharray="26 26" stroke-linecap') +
    G(tr(lerp(100, 1700, ph), lerp(700, 340, ph) + Math.sin(ph * 9) * 60, 1, -10), torA({ x: 0, y: 0, s: .8, swim: 1.5, expr: 'calm' }, t)) + circ(CX + Math.cos(t * 2) * 800, 200 + Math.sin(t * 2) * 100, 50, '#fff3b0', 0); },
  sfx: [[0, 'el:swim_whoosh', .7], [.5, 'el:time_pass', .5]] });
B(134, { cam: zin(1.05, 1.15),
  draw: t => bgUnder(t, { surface: 100 }) + torAF({ x: CX, y: 1160, r: 160, expr: 'angry', face: { mouth: 'smirk' }, armL: 200, armR: -20 }, t),
  sfx: [[0, 'drum', .9]] });
B(135, { flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 400 }),
  draw: t => { const k = eOutCubic(seg(t, 0, .9)); return rays(t, CX, 300, '#ffe6b8', '#ffd28a') + bgBeach(t, { dusk: .6, hz: 820, sy: 900, sunX: CX, sunY: 280 }).replace(/<defs>.*?<\/rect>/, '') + G(tr(CX, lerp(1100, 900, k)), torA({ x: 0, y: 0, s: 2.0, expr: 'cool', walk: .6 }, t)) + rect(-200, 960, W + 400, 200, 'rgba(255,255,255,.6)', 0, 0); },
  sfx: [[0, 'el:wave_crash', 1], [.1, 'el:hit_cine', .7]] });
B(136, { cam: zin(1, 1.06),
  draw: t => sandTop(t, 23) + trackMarks(CX, 1100, CX, 560 + t * 0, 9) + torAT({ x: CX, y: 520 - t * 40, s: 1.5, walk: .5 }, t) + sweat(CX + 200, 300, 1) + sweat(CX - 220, 340, .7),
  sfx: [[0, 'hmm', .8], [.8, 'el:dig', .5], [1.8, 'hmm', .7]] });
B(137, { cam: zin(1, 1.06),
  draw: t => bgNightBeach(t, { moonX: 300 }) + ell(1100, 900, 220, 60, '#7c6a4c', 0) + sandFlying(1180, 880, t, 14) + torA({ x: 900, y: 900, s: 1.5, expr: 'angry', flip: 1, fa: wave(t, 3, 30) }, t),
  sfx: [[0, 'el:dig', 1], [.8, 'el:dig', .8]] });
B(138, { cam: zin(1, 1.08),
  draw: t => { const n = Math.min(12, Math.floor(t * 6)); let s = bgSand(t, { sy: 300, night: 1 }) + path('M500 300Q960 950 1420 300Z', '#6e5a3e', 0) + eggsPile(CX, 760, n, .85, t, 2);
    s += torA({ x: CX, y: 310, s: 1.4, expr: 'calm', flip: 1 }, t) + (t % .17 < .1 ? egg(CX + 30, 420 + (t % .17) * 1500, .7, 0, t) : '');
    return s + tag(1600, 520, n + ' / 100', t, .1, '#fff', OL, 56); },
  sfx: Array.from({ length: 12 }, (_, i) => [i * .17, i % 2 ? 'pop' : 'pop_hi', .55]) });
B(139, { cam: zin(1, 1.05),
  draw: t => { const k = seg(t, .1, 1.8); return bgSand(t, { sy: 300, night: 1 }) + path(`M500 300Q960 ${lerp(950, 320, k)} 1420 300Z`, '#6e5a3e', 0) + eggsPile(CX, 760, 12, .85, t, 2) + rect(400, 300, 1100, 520 * k, '#c9a26a', 0, 0) + sandFlying(CX, 300, t, 14) + torA({ x: CX + 300, y: 310, s: 1.4, expr: 'calm', fa: wave(t, 3, 30) }, t); },
  sfx: [[0, 'el:dig', 1], [1, 'el:dig', .7]] });
B(140, { cam: zin(1.04, 1.12),
  draw: t => bgNightBeach(t) + torAF({ x: CX, y: 1150, r: 160, expr: t > .5 ? 'shock' : 'calm', armL: 200, armR: -20 }, t) + G(tr(CX + 300, 300, pop(t, .5)), circ(0, 0, 70, '#fff3a0') + rect(-30, 60, 60, 50, '#bbb', 6)),
  sfx: [[.5, 'ding', 1]] });
B(141, { flash: 1, cam: zin(1, 1.08),
  draw: t => { const k = eInOut(seg(t, .3, 1.4)); return rays(t, CX, CY, '#3a2a4f', '#4b3866') + G(tr(CX - 280 * (1 - k), 900), mom({ x: 0, y: 0, s: 2, expr: 'calm' }, t)) + op(k, G(tr(CX + 280 * (1 - k), 900), torA({ x: 0, y: 0, s: 2, expr: 'shock' }, t))) + (k > .9 ? bigText(['TA MÈRE.'], t, 1.5, CX, 160, '#ffd23f', 110) : ''); },
  sfx: [[0, 'sting', .9], [1.5, 'el:crowd_gasp', .7]] });
B(142, { cam: zin(1, 1.06),
  draw: t => { let s = bgWhite() + G(tr(CX, CY), circ(0, 0, 230, '#e9c98d', 7) + eggsPile(0, 80, 10, .7, t, 6));
    const items = [eagle({ x: 0, y: 0, s: .35, expr: 'hungry' }, t), crab({ x: 0, y: 30, s: .55, angry: 1 }, t), shark({ x: 0, y: 0, s: .32 }, t), net(0, -90, 200, 180, t, { n: 6, floats: false }), plasticBag({ x: 0, y: -10, s: .6 }, t), carFront(0, 70, .4, 1)];
    items.forEach((it, i) => { const a = R(i * 60 + t * 25 - 90); s += iconCard(CX + Math.cos(a) * 440, CY + Math.sin(a) * 380, .9, it, t, .3 + i * .5, 0); });
    return s + (t > 4.2 ? tag(CX, 120, '35 ANS DE DANGER', t, 4.2, '#ff4d4d', '#fff', 56) : ''); },
  sfx: [[.3, 'el:eagle', .6], [.8, 'el:crab', .6], [1.3, 'el:shark', .5], [1.8, 'el:net_creak', .5], [2.3, 'el:bag_rustle', .5], [2.8, 'el:car_horn', .5], [4.2, 'sting', .6]] });
B(143, { cam: zin(1, 1.06),
  draw: t => bgNightBeach(t) + torAF({ x: CX, y: 1150, r: 150, expr: 'calm', face: { mouth: 'smile' }, armL: 200, armR: -20 }, t) + heart(CX + 300, 330 - t * 40, .9 * pop(t, .5)) + sparkle(CX - 300, 380, .6 * pop(t, .9), '#fff'),
  sfx: [[.4, 'el:chime', .8]] });
B(144, { cam: zin(1, 1.05),
  draw: t => { const k = seg(t, 0, 2.3); return bgNightBeach(t, { moonX: 400, sy: 700 }) + G(tr(lerp(1300, 520, k), lerp(900, 680, k), lerp(1.3, .7, k)), torA({ x: 0, y: 0, s: 1, flip: 1, expr: 'calm', walk: 1 }, t)) + (k > .9 ? G(tr(520, 680), circ(0, 0, 60 * seg(t, 2.1, 2.3), 'none', 6, '#fff')) : ''); },
  sfx: [[0, 'el:patter', .4], [1.9, 'el:splash', .8], [2.0, 'el:wave_crash', .4]] });

// ---------- DEUX MOIS PLUS TARD : LES BÉBÉS ----------
B(145, { enter: 'none', flash: 1,
  draw: t => bgSand(t, { sy: 200, night: 1 }) + eggsPile(CX, 900, 20, .9, t, 7) + bigText(['DEUX MOIS', 'PLUS TARD'], t, .2, CX, 380, '#ffd23f', 120),
  sfx: [[0, 'el:time_pass', .9], [.3, 'el:hit_cine', .5]] });
B(146, { cam: zin(1.05, 1.15),
  draw: t => bgSand(t, { sy: -100, night: 1 }) + egg(CX, 600, 4.2, seg(t, .2, 1.8) * .45, t, { r: Math.sin(t * 30) * 3 }),
  sfx: [[.2, 'el:egg_crack', 1], [1.2, 'crack', .6]] });
B(147, { cam: (t, d) => ({ z: 1.04, cy: 700 }),
  draw: t => bgSand(t, { sy: -100, night: 1 }) + egg(600, 700, 2.4, .45, t) + egg(1300, 700, 2.4, seg(t, .1, .9) * .45, t, { r: Math.sin(t * 30) * 3 }),
  sfx: [[.1, 'el:egg_crack', .9]] });
B(148, { cam: zout(1.15, 1.0),
  draw: t => { let s = sandTop(t, 29).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#a8916c' : '#8c7652'); const r = rng(3);
    for (let i = 0; i < 26; i++) { const x = 200 + r() * 1500, y = 150 + r() * 800, t0 = r() * 2.8; const k = eOutBack(seg(t, t0, t0 + .4)); if (k > 0) s += ell(x, y + 20, 60, 30, '#6e5a3e', 0) + G(tr(x, y, k * .8), sibT({ x: 0, y: 0, s: 1, walk: .6, rot: r() * 360 }, t)); }
    return s; },
  sfx: [[.2, 'el:sand_pop', .7], [.8, 'el:sand_pop', .6], [1.4, 'el:sand_pop', .7], [2.0, 'el:sand_pop', .6], [2.6, 'el:baby_squeak', .5]] });
B(149, { cam: zin(1.04, 1.12),
  draw: t => { const k = eOutBack(seg(t, .3, .8)); return bgResort(t, { lit: 1 }) + ell(CX, 960, 200, 50, '#6e5a3e', 0) + G(tr(CX, 1020 - k * 140, 1), kidF({ x: 0, y: 0, r: 130, expr: 'wow', armL: 210, armR: -30 }, t)) + rect(-200, 990, W + 400, 200, '#8c7652', 0, 0) + sandFlying(CX, 960, t, 10); },
  sfx: [[.3, 'el:sand_pop', 1], [.6, 'el:baby_squeak', .8]] });
B(150, { cam: zin(1, 1.06),
  draw: t => { const lk = Math.sin(t * 2.5); return bgResort(t, { lit: 1 }) + kid({ x: CX, y: 920, s: 1.5, expr: 'confused', look: [lk, 0], headTilt: lk * 10 }, t) + qmark(CX + 200, 560, .6 * pop(t, .6)); },
  sfx: [[.2, 'hmm', .6], [.6, 'el:baby_squeak', .5]] });
B(151, { flash: 1, cam: zin(1.0, 1.08),
  draw: t => bgResort(t, { lit: 1 }) + kid({ x: 760, y: 920, s: 1, expr: 'neutral' }, t) + G(tr(CX, 260, pop(t, .5)), path('M0 -170L170 130L-170 130Z', '#ffd23f', 10) + text(0, 100, 'none', '!', OL, 200)),
  sfx: [[0, 'sting', .9], [.5, 'el:hit_cine', .6]] });
B(152, { enter: 'none', cam: zin(1, 1.04),
  draw: t => bgNightBeach(t, { moonX: 500 }).replace(/<defs>/, '<defs>') + glow(500, 430, 600, '#fff6d6', .25 + .1 * Math.sin(t * 2)) + G(tr(1300, 900), turtle({ age: 'baby', tuft: 1, seed: 3, flip: 1, s: 1.5, expr: 'happy', look: [1, -.4] }, t)) +
    path(`M960 860L${lerp(960, 620, seg(t, .5, 2))} ${lerp(860, 520, seg(t, .5, 2))}`, 'none', 14, '#fff').replace('stroke-linecap', 'stroke-dasharray="30 26" stroke-linecap') + tag(500, 260, 'HORIZON LUMINEUX', t, 2.2, '#fff6d6', OL, 56) + check(500, 420, .6, t, 3.2),
  sfx: [[.5, 'whoosh', .6], [2.2, 'el:chime', .8], [3.2, 'ding', .6]] });
B(153, { enter: 'none', cam: zin(1, 1.04), overlay: t => vhs(t),
  draw: t => bgNightBeach(t, { moonX: 500 }) + kid({ x: 1300, y: 900, s: 1.2, expr: 'neutral', flip: 1 }, t),
  sfx: [[0, 'rewind', .8], [.3, 'el:time_pass', .5]] });
B(154, { cam: zin(1, 1.06),
  draw: t => { const k = seg(t, 0, 1.4); let s = sandTop(t, 31).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#a8916c' : '#8c7652') + rect(-200, -200, 900, H + 400, '#1d3f6e', 0, 0);
    s += rect(1100, -200, 1100, H + 400, '#3c414c', 0, 0) + rect(1000, -200, 140, H + 400, '#5b6068', 0, 0);
    for (let i = 0; i < 4; i++) { const kk = eOutBack(seg(k, i * .2, i * .2 + .3)); if (kk > 0) s += G(tr(1350 + (i % 2) * 330, 160 + Math.floor(i / 2) * 420, kk), rect(-140, -150, 280, 300, '#d8d0c4') + rect(-110, -120, 220, 240, '#ffe08a', 10, 5)); }
    return s; },
  sfx: [[0, 'hammer', .6], [.3, 'pop', .7], [.6, 'pop', .7], [.9, 'pop', .7], [1.2, 'whoosh', .6]] });
B(155, { cam: zin(1, 1.06),
  draw: t => bgResort(t, { lit: 1, road: false, lamps: false, hk: eOutBack(seg(t, .1, .7)) }) + kid({ x: 520, y: 900, s: 1, expr: 'wow' }, t),
  sfx: [[.1, 'pop', .8], [.3, 'pop', .8], [.5, 'pop', .8], [.6, 'el:hotel_party', .5]] });
B(156, { cam: zin(1, 1.06),
  draw: t => { let s = bgResort(t, { lit: 1, carSpeed: 300 }) + car(lerp(2200, -400, t / 1.16), 700, .55, t, { lights: 1, color: '#5b7bd6' });
    s += G(tr(1500, 900, pop(t, .5)), rect(-200, -40, 400, 120, '#5b6068', 6) + [-150, -50, 50, 150].map(x => line(x, -40, x, 80, 5, '#fff')).join('') + text(0, -70, OL, 'P', '#5ec4f0', 80));
    return s + kid({ x: 520, y: 900, s: 1, expr: 'shock' }, t); },
  sfx: [[0, 'el:traffic', .6], [.3, 'el:car_horn', .6]] });
B(157, { cam: zout(1.12, 1.0),
  draw: t => bgResort(t, { lit: seg(t, .1, 1.4) }) + kid({ x: 520, y: 900, s: .9, expr: 'wow' }, t),
  sfx: [[.1, 'el:lightbuzz', 1], [.8, 'el:lightbuzz', .6]] });
B(158, { cam: zin(1.04, 1.14),
  draw: t => { let s = rect(-200, -200, W + 400, H + 400, '#1a1630', 0, 0); for (let i = 0; i < 14; i++) s += glow(100 + (i * 263) % 1800, 100 + (i * 157) % 700, 180 + (i % 3) * 60, ['#ffe08a', '#fff6c8', '#ffcf70'][i % 3], .6);
    return s + kidF({ x: CX, y: 1150, r: 150, expr: 'annoyed', face: { eyes: 'squint' }, armL: 240, armR: -60 }, t); },
  sfx: [[0, 'el:lightbuzz', .8], [.6, 'el:hotel_party', .4]] });
B(159, { cam: (t, d) => ({ z: 1.04, cy: 600 }),
  draw: t => bgResort(t, { lit: 1, hz: 760, sy: 960 }) + kid({ x: 760, y: 1060, s: 1.9, expr: 'wow', look: [1, -1] }, t),
  sfx: [[.2, 'el:baby_squeak', .7]] });
B(160, { cam: zin(1.0, 1.1),
  draw: t => rect(-200, -200, W + 400, H + 400, '#1a1630', 0, 0) + glow(CX, 300, 900, '#fff2b0', .9) + circ(CX, 300, 160, '#fffbe0', 0) + kidT({ x: CX, y: 860, s: 1.3, rot: 0 }, t) + stars(CX, 560, t, 5, 260),
  sfx: [[0, 'el:chime', .9], [.3, 'el:lightbuzz', .5]] });
B(161, { cam: zin(1, 1.06),
  draw: t => bgResort(t, { lit: 1 }) + kid({ x: lerp(600, 900, t / 2), y: 900, s: 1.1, expr: 'happy', walk: 1 }, t) + trackMarks(400, 920, lerp(600, 900, t / 2) - 120, 920, 6),
  sfx: [[0, 'el:patter', .9]] });
B(162, { cam: (t, d) => ({ z: lerp(1, 1.15, eInOut(t / d)), cx: 1400, cy: 400 }),
  draw: t => bgResort(t, { lit: 1 }) + kid({ x: 900, y: 900, s: 1.1, expr: 'happy', walk: .8 }, t),
  sfx: [[0, 'el:riser', .8]] });
B(163, { cam: zin(1, 1.06),
  draw: t => bgResort(t, { lit: 1, moonGlow: .4 }) + kid({ x: 1000, y: 900, s: 1.1, expr: 'happy', walk: .8 }, t) + path('M800 820Q600 700 400 620', 'none', 12, '#fff').replace('stroke-linecap', 'stroke-dasharray="26 22" stroke-linecap') + tag(400, 560, 'LA MER', t, .2, '#5ec4f0', '#fff', 50) + cross(1400, 400, .9, t, .7),
  sfx: [[0, 'el:record', .9], [.7, 'error_beep', .7]] });
B(164, { flash: 1, cam: zin(1.02, 1.1),
  draw: t => rect(-200, -200, W + 400, H + 400, '#1a1630', 0, 0) + hotel(460, 1080, 1000, 1000, 1, '#e7e2d8', 9) + G(tr(CX, 120, pop(t, .2)), rect(-300, -60, 600, 120, '#ff6fa5', 16) + text(0, 30, 'none', 'HÔTEL ★★★★', '#fff', 64)),
  sfx: [[0, 'el:hotel_party', 1], [.2, 'el:hit_cine', .5]] });
B(165, { cam: (t, d) => ({ z: 1.04, cy: 600 }),
  draw: t => { let s = bgResort(t, { lit: 1, hz: 700, sy: 900 }); for (let i = 0; i < 5; i++) s += sib({ x: 1200 - i * 160 - t * 120, y: 980 + (i % 2) * 50, s: .7, flip: 1, walk: 1.2, expr: 'happy', seed: i }, t); return s + kid({ x: 1500, y: 1000, s: .8, expr: 'happy' }, t); },
  sfx: [[0, 'el:patter', .8], [.5, 'el:wave_crash', .4]] });
B(166, { cam: zin(1, 1.06),
  draw: t => { let s = sandTop(t, 33).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#a8916c' : '#8c7652') + rect(-200, -200, 520, H + 400, '#1d3f6e', 0, 0) + rect(1560, -200, 600, H + 400, '#3c414c', 0, 0) + glow(1800, 540, 600, '#ffcf70', .5);
    for (let i = 0; i < 7; i++) s += sibT({ x: 1000 - t * 160 - (i % 3) * 60, y: 160 + i * 120, s: .6, rot: -90, walk: 1.2 }, t);
    return s + kidT({ x: 1100 + t * 120, y: 560, s: .8, rot: 90, walk: 1 }, t) + path(`M${1200 + t * 120} 560L1500 560`, 'none', 12, '#ffd23f') + path('M1470 530L1510 560L1470 590', 'none', 12, '#ffd23f'); },
  sfx: [[0, 'el:patter', .7], [.5, 'boing', .4]] });
B(167, { cam: zin(1, 1.08),
  draw: t => grad('#141b38', '#2a3266', -200, -200, W + 400, 800) + glow(1400, 300, 700, '#ffcf70', .5) + road(520, 220, t, 0) + grad('#a8916c', '#7c6a4c', -200, 740, W + 400, 500) + rect(-200, 740, W + 400, 30, '#c9ccd1', 0, 0) + streetLight(1500, 520, 300, 1) + kid({ x: lerp(600, 900, t / 1.24), y: 960, s: 1.3, expr: 'happy', walk: 1 }, t),
  sfx: [[0, 'el:traffic', .7], [.2, 'el:patter', .6]] });
B(168, { cam: zin(1, 1.06),
  draw: t => grad('#141b38', '#2a3266', -200, -200, W + 400, 800) + road(520, 220, t, 600) + grad('#a8916c', '#7c6a4c', -200, 740, W + 400, 500) + car(lerp(2300, 1500, t / .96), 700, 1.0, t, { lights: 1 }),
  sfx: [[0, 'el:car_engine', 1]] });
B(169, { cam: zout(1.1, 1.0),
  draw: t => { const k = seg(t, 0, 2.3); return grad('#141b38', '#2a3266', -200, -200, W + 400, 800) + road(420, 200, t, 600) + grad('#a8916c', '#7c6a4c', -200, 620, W + 400, 600) +
    `<path d="M${lerp(1700, 1300, k) - 200} 560L-200 300L-200 1200L${lerp(1700, 1300, k) - 100} 640Z" fill="rgba(255,245,190,.3)"/>` + car(lerp(1800, 1400, k), 600, .8, t, { lights: 0 }) + kid({ x: 700, y: 900, s: .9, expr: 'wow', walk: .8 }, t); },
  sfx: [[0, 'el:car_pass', .9]] });
B(170, { cam: zin(1.04, 1.12),
  draw: t => rect(-200, -200, W + 400, H + 400, '#191a2e', 0, 0) + glow(1700, 500, 900, '#fff6c8', .7 + .1 * Math.sin(t * 8)) + kidF({ x: 820, y: 1150, r: 150, expr: 'happy', look: [1, 0], armL: 210, armR: -30 }, t),
  sfx: [[0, 'el:patter', .7], [.4, 'el:heart_slow', .7]] });
B(171, { cam: (t, d) => ({ z: lerp(1, 1.08, t / d), cy: 500, shake: 2 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#191a2e', 0, 0) + G(tr(1300, 760, lerp(.9, 1.3, t / 1.5)), carFront(0, 0, 1, 1)) + kid({ x: 520, y: 1000, s: 1.4, expr: 'confused', look: [1, -1] }, t) + qmark(700, 560, .8 * pop(t, .3)),
  sfx: [[0, 'el:car_engine', .8], [.5, 'el:car_horn', 1]] });
B(172, { cam: zin(1, 1.06),
  draw: t => { let s = sandTop(t, 35).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#6b5a42' : '#4f4232') + rect(1200, -200, 400, H + 400, '#5b6068', 0, 0); s += `<path d="M1400 540L400 300L400 800Z" fill="rgba(255,245,190,.4)"/>`; return s + kidT({ x: lerp(500, 900, t / 1.7), y: 560, s: .9, rot: 90, walk: 1 }, t); },
  sfx: [[0, 'el:car_engine', .7], [.3, 'el:patter', .6]] });
B(173, { cam: (t, d) => ({ z: lerp(1, 1.1, t / d) }),
  draw: t => { const w = seg(t, .6, 1.3); return rect(-200, -200, W + 400, H + 400, '#191a2e', 0, 0) + glow(1700, 540, 1000, '#fff6c8', .8) + op(1 - w * .8, kid({ x: 900, y: 920, s: 1.3, expr: 'happy', walk: .8 }, t)) + rect(-200, -200, W + 400, H + 400, `rgba(255,252,235,${w})`, 0, 0); },
  sfx: [[0, 'el:car_engine', .8], [.6, 'el:car_horn', .9], [1.3, 'el:hit_cine', .5]] });

// ---------- AU LARGE ----------
B(174, { enter: 'none', cam: zout(1.1, 1.0),
  draw: t => bgNightBeach(t, { hz: 500, sy: 1400, moonX: 1500, moonPath: true }) + op(.8, G(tr(260, 500), Array.from({ length: 8 }, (_, i) => circ(i * 22, 0, 4, '#ffe08a', 0)).join(''))),
  sfx: [[0, 'el:a_night', .4], [.3, 'el:wave_crash', .3]] });
B(175, { cam: zin(1, 1.06),
  draw: t => bgUnder(t, { dark: .55 }) + glow(CX, 0, 900, '#e8f0ff', .25) + G(tr(lerp(600, 1200, t / 1.6), 560), torA({ x: 0, y: 0, s: 1.4, expr: 'calm', swim: .7, band: 1 }, t)),
  sfx: [[0, 'el:swim_whoosh', .5]] });
B(176, { cam: zin(1.02, 1.08),
  draw: t => bgUnder(t, { dark: .5 }) + torAF({ x: 560, y: 1140, r: 140, expr: 'calm', armL: 200, armR: -20 }, t) + iconCard(1350, 520, 1.3, eagle({ x: 0, y: 0, s: .35, expr: 'hungry' }, t), t, .2),
  sfx: [[.2, 'pop', .7], [.3, 'el:eagle', .4]] });
B(177, { cam: zin(1.02, 1.08),
  draw: t => bgUnder(t, { dark: .5 }) + torAF({ x: 560, y: 1140, r: 140, expr: 'calm', armL: 200, armR: -20 }, t) + iconCard(1350, 520, 1.3, crab({ x: 0, y: 30, s: .55, angry: 1 }, t), t, 0),
  sfx: [[0, 'pop', .7], [.1, 'el:crab', .4]] });
B(178, { cam: zin(1.02, 1.08),
  draw: t => bgUnder(t, { dark: .5 }) + torAF({ x: 460, y: 1140, r: 140, expr: 'calm', armL: 200, armR: -20 }, t) + iconCard(1100, 520, 1.1, shark({ x: 0, y: 0, s: .32 }, t), t, 0) + iconCard(1550, 520, 1.1, net(0, -90, 200, 180, t, { n: 6, floats: false }), t, .4),
  sfx: [[0, 'pop', .7], [.4, 'pop', .7]] });
B(179, { cam: zin(1.02, 1.08),
  draw: t => bgUnder(t, { dark: .5 }) + torAF({ x: 560, y: 1140, r: 140, expr: 'calm', armL: 200, armR: -20 }, t) + iconCard(1350, 520, 1.3, plasticBag({ x: 0, y: -10, s: .6 }, t), t, 0),
  sfx: [[0, 'pop', .7], [.1, 'el:bag_rustle', .4]] });
B(180, { cam: zout(1.1, 1.0),
  draw: t => bgResort(t, { lit: 1, hz: 600, sy: 1300, split: 1300, moonX: 400, hotels: [[1400, 140, 260], [1560, 180, 340], [1760, 160, 280]], road: false, lamps: false }) + G(tr(lerp(900, 500, t / 4.2), 860), torA({ x: 0, y: 0, s: 1.1, flip: 1, swim: .6, expr: 'calm' }, t)),
  sfx: [[0, 'el:swim_whoosh', .4], [1.5, 'el:wave_crash', .3]] });
B(181, { cam: zin(1, 1.08),
  draw: t => bgResort(t, { lit: 1, moonGlow: .1 }) + glow(1300, 300, 600, '#fff6c8', .6) + circ(1300, 300, 60, '#fffbe0', 0) + G(tr(800, 920), kid({ x: 0, y: 0, s: .9, expr: 'happy', walk: .6 }, t)),
  sfx: [[0, 'el:lightbuzz', .5]] });
B(182, { cam: zin(1.0, 1.12),
  draw: t => { const k = seg(t, 2.2, 4.4); return rect(-200, -200, W + 400, H + 400, '#0e1226', 0, 0) + glow(1500, 300, 700, '#fff2b0', .7) + circ(1500, 300, 110, '#fffbe0', 0) +
    G(tr(400, 300), circ(0, 0, 60, '#fff6d6', 0) + glow(0, 0, 200, '#fff6d6', .2)) + kidF({ x: 900, y: 1160, r: 160, expr: 'happy', look: [1, -.5], armL: 210, armR: -30 }, t) + rect(-200, -200, W + 400, H + 400, `rgba(0,0,0,${k * .85})`, 0, 0); },
  sfx: [[.5, 'el:baby_squeak', .4], [1.8, 'el:hit_cine', .3]] });

