// ============================================================
//  B059–B121 : l'océan, la respiration, les années, le sac plastique, le filet
// ============================================================
// radiographie : tortue vue de dessus avec poumons (k = remplissage, red = alerte)
function xrayLungs(x, y, s, t, k = 1, red = 0) {
  const col = lerpColor('#ff9db5', '#ff3b3b', red);
  let g = ell(0, 0, 230, 290, 'rgba(160,220,255,.25)', 7, '#bfe9ff') + circ(0, -360, 90, 'rgba(160,220,255,.25)', 7, '#bfe9ff');
  for (const sd of [-1, 1]) g += G(tr(sd * 80, -60, .7 + .3 * k), path(`M0 -150C${sd * 110} -150 ${sd * 120} 40 ${sd * 60} 150C${sd * 10} 170 ${-sd * 10} 120 0 80Z`, col, 6));
  g += path('M0 -270L0 -150', 'none', 14, '#bfe9ff');
  return G(tr(x, y, s), g);
}
function o2Gauge(x, y, s, k, label = 'O₂') {
  const col = k > .5 ? '#5fd068' : k > .25 ? '#ffb340' : '#ff4d4d';
  return G(tr(x, y, s), rect(-70, -220, 140, 440, '#fff', 30) + rect(-52, -200 + 400 * (1 - k), 104, 400 * k, col, 18, 0) + rect(-70, -220, 140, 440, 'none', 30) + rect(-30, -250, 60, 34, '#fff', 8) + text(0, 300, OL, label, '#fff', 80));
}
function depthTag(x, y, str, t, t0) { return tag(x, y, str, t, t0, '#0f4c74', '#fff', 60); }
function boatHull(x, y, s = 1) { return G(tr(x, y, s), path('M-320 0L320 0L260 90L-260 90Z', '#e2463a') + rect(-320, -20, 640, 30, '#fff', 6) + rect(-120, -150, 240, 130, '#fff', 10) + rect(-90, -125, 60, 50, '#bfe3f5', 6, 5) + rect(30, -125, 60, 50, '#bfe3f5', 6, 5)); }
function seagrass(x, y, s, t) { let g = ''; for (let i = 0; i < 5; i++) g += path(`M${i * 22 - 44} 0q${wave(t, .6, 10, i / 5)} -60 ${8 - i * 4} -140`, 'none', 18) + path(`M${i * 22 - 44} 0q${wave(t, .6, 10, i / 5)} -60 ${8 - i * 4} -140`, 'none', 10, '#62c26a'); return G(tr(x, y, s), g); }
function netWall(t, o = {}) { return net(o.x ?? CX, o.y ?? -40, o.w ?? 2400, o.h ?? 1200, t, Object.assign({ n: 18, sw: 7 }, o)); }
// tortue prise dans le filet (adulte de profil + cordes autour de la nageoire)
function tangled(x, y, s, t, o = {}) {
  let g = torA(Object.assign({ x: 0, y: 0, s: 1, expr: 'scared', flail: o.calm ? 0 : 1 }, o), t);
  g += path('M60 -20C120 40 200 0 240 60M90 -60C160 -10 230 -40 260 20M30 10C110 80 220 60 280 110', 'none', 9, 'rgba(235,235,220,.95)');
  return G(tr(x, y, s), g);
}

// ---------- OCÉAN ----------
B(59, { cam: zin(1, 1.08),
  draw: t => bgUnder(t, { fishFar: 1 }) + stars(CX, 300, t, 6, 400) + G(tr(CX, 560 + wave(t, .4, 20)), tor({ x: 0, y: 0, s: 1.6, expr: 'wow', swim: 1 }, t)) + sparkle(1400, 300, .8 * pop(t, .8)) + sparkle(500, 760, .6 * pop(t, 1.2)),
  sfx: [[0, 'el:chime', .8], [.8, 'sparkle', .6], [2.2, 'el:swim_whoosh', .5]] });
B(60, { flash: 1, cam: shk(1.06, 5),
  draw: t => { const x = 1300 - t * 180; return bgUnder(t, { fishFar: 1 }) + G(tr(x, 640), tor({ x: 0, y: 0, s: 1.2, expr: 'scared', swim: 3, flip: 1 }, t)) +
    fish({ x: x + 420, y: 560, s: 1.1, teeth: 1, color: '#ff8a3d' }, t) + fish({ x: x + 640, y: 760, s: .9, teeth: 1, color: '#9b6bd6' }, t) + bigText(['TOUT LE MONDE', 'VEUT TE MANGER'], t, .1, CX, 160, '#ff5d5d', 96); },
  sfx: [[0, 'sting', .9], [.6, 'el:chomp_water', .8], [1.4, 'el:fish_school', .6]] });
B(61, { cam: (t, d) => ({ z: lerp(1, 1.08, t / d), shake: 3 }),
  draw: t => { const k = eOutCubic(seg(t, 0, 1)); return bgUnder(t, { dark: .3 }) + shark({ x: lerp(2400, 1100, k), y: 520, s: 1.7 }, t) + tor({ x: 360, y: 760, s: .8, expr: 'shock', swim: 1 }, t); },
  sfx: [[0, 'el:shark', 1], [.5, 'el:chomp_water', .6]] });
B(62, { cam: zin(1.0, 1.06),
  draw: t => bgUnder(t, { dark: .15 }) + shark({ x: 1250, y: 560, s: 1.4, jaw: .25 }, t) +
    G(tr(1120, 390, 1), circ(-40, 0, 34, 'rgba(255,255,255,.3)', 6) + circ(40, 0, 34, 'rgba(255,255,255,.3)', 6) + line(-6, 0, 6, 0, 6)) +
    G(tr(800, 230, pop(t, .3), -8), rect(-190, -110, 380, 220, '#fffbe8', 10) + text(0, -30, 'none', 'DIPLÔME', '#c9a227', 54) + text(0, 40, 'none', 'Prédateur', OL, 44) + circ(130, 70, 26, '#e2463a', 4)) +
    tor({ x: 330, y: 860, s: 1.1, expr: 'confused' }, t) + qmark(450, 560, .8 * pop(t, 2.2)) + (t > 2.6 ? tag(1250, 960, 'PRO', t, 2.6, '#5fd068', OL, 60) : ''),
  sfx: [[.3, 'ding', .7], [1.5, 'el:chomp_water', .6], [2.2, 'hmm', .7], [2.6, 'pop', .7]] });
B(63, { cam: (t, d) => ({ z: lerp(1, 1.12, t / d), cy: 350 }),
  draw: t => bgUnder(t, { surface: 90 }) + speedLines(t, CX, 360, 22, 'rgba(255,255,255,.35)') + G(tr(CX + wave(t, .5, 40), 420 - t * 30, 1, -60), tor({ x: 0, y: 0, s: 1.3, expr: 'scared', swim: 4 }, t)) +
    op(.7, shark({ x: CX + 200, y: 1000, s: 1, rot: -30 }, t).replace(/#8fa3b5/g, '#2b4a63')),
  sfx: [[0, 'el:swim_whoosh', 1], [.8, 'el:swim_whoosh', .8], [1.4, 'el:bubbles', .5]] });
B(64, { cam: zin(1, 1.08),
  draw: t => { const k = eOutCubic(seg(t, 0, 1.2)); return bgSplit(t, { wl: 260 }) + op(.6, fish({ x: 1700 - t * 80, y: 760, s: .9, teeth: 1, color: '#ff8a3d' }, t)) +
    G(tr(lerp(300, CX, k), lerp(820, 470, k), 1, -10 * (1 - k)), tor({ x: 0, y: 0, s: 1.1, expr: k > .9 ? 'happy' : 'scared', swim: 2 - k, look: [-1, 0] }, t)) +
    sargassum(CX, 260, 1300, t, 21) + sargassum(CX - 60, 262, 700, t, 5); },
  sfx: [[0, 'el:swim_whoosh', .7], [.5, 'el:bag_rustle', .3], [1, 'el:bubbles', .5]] });
B(65, { cam: zin(1, 1.06),
  draw: t => bgSplit(t, { wl: 300 }) + sargassum(CX, 300, 1500, t, 21) + G(tr(CX, 620), tor({ x: 0, y: 0, s: 1.4, expr: 'happy', swim: .4 }, t)) +
    G(tr(1450, 600, pop(t, .4), wave(t, .5, 3)), rect(-110, -90, 220, 180, '#c38a52', 8) + rect(-90, -70, 180, 140, '#f7f0dc', 0, 4) + tor({ x: 0, y: 50, s: .35, expr: 'happy' }, t)) +
    G(tr(CX, 900, pop(t, 1.0)), rect(-200, -45, 400, 90, '#a0522d', 20) + text(0, 22, 'none', 'HOME', '#fff', 60)),
  sfx: [[.4, 'pop', .7], [1, 'ding', .8], [1.6, 'el:chime', .5]] });
B(66, { cam: zin(1, 1.1),
  draw: t => bgUnder(t) + tor({ x: 760, y: 680, s: 1.5, expr: 'suspicious', swim: .4 }, t) + magnifier(1300, 460, 1.5 * pop(t, .3), -20) + qmark(1300, 440, .8 * pop(t, .9)),
  sfx: [[.3, 'whoosh', .6], [.9, 'hmm', .8]] });
B(67, { cam: zout(1.12, 1.0),
  draw: t => bgUnder(t, { fishFar: 1, floor: 960 }) + G(tr(CX, 640), tor({ x: 0, y: 0, s: 1.4, expr: 'joy', swim: 1 }, t)) + bigText(['MARINE'], t, .4, CX, 200, '#5ec4f0', 160) +
    G(tr(1500, 280, pop(t, .6)), path('M0 -100L0 100M-60 -50L60 -50M-90 40Q-80 110 0 110Q80 110 90 40', 'none', 30) + path('M0 -100L0 100M-60 -50L60 -50M-90 40Q-80 110 0 110Q80 110 90 40', 'none', 16, '#ffd23f') + circ(0, -120, 24, 'none', 12)),
  sfx: [[.4, 'el:hit_cine', .6], [.6, 'tada', .5]] });
B(68, { cam: zin(1.02, 1.1),
  draw: t => { let s = bgUnder(t, { floor: 1000 }) + torF({ x: CX, y: 1100, r: 150, expr: 'happy', armL: 200 + wave(t, 1, 10), armR: -20 - wave(t, 1, 10) }, t);
    for (let i = 0; i < 6; i++) { const k = (t * .8 + i / 6) % 1; s += circ(CX + 60 + wave(t, 1, 20, i / 6), 520 - k * 500, 12 + k * 14, 'rgba(255,255,255,.4)', 4, 'rgba(255,255,255,.8)'); }
    return s; },
  sfx: [[0, 'el:bubbles', .9], [1, 'el:bubbles', .5]] });
B(69, { flash: 1, cam: shk(1.08, 8),
  draw: t => rays(t, CX, CY, '#ff7a7a', '#ff4d4d') + torF({ x: CX, y: 1160, r: 175, expr: 'pain', face: { mouth: 'flat' }, cheekColor: '#ff6b6b', armL: 230, armR: -50 }, t) +
    ell(CX - 100, 850, 46, 30, '#ff8b8b', 0) + ell(CX + 100, 850, 46, 30, '#ff8b8b', 0) + bigText(['TU NE PEUX PAS', 'RESPIRER SOUS L\'EAU'], t, 1.0, CX, 130, '#fff', 92),
  sfx: [[0, 'el:record', .7], [1.0, 'el:hit_cine', .9], [1.1, 'error_beep', .8], [2, 'siren', .4]] });
B(70, { cam: zin(1, 1.06),
  draw: t => grad('#0e2a44', '#123a5a', -200, -200, W + 400, H + 400) + Array.from({ length: 12 }, (_, i) => line(0, i * 90, W, i * 90, 2, 'rgba(120,200,255,.15)')).join('') +
    xrayLungs(CX, 640, 1.05, t, .8 + .2 * Math.sin(t * 3)) + tag(CX + 480, 400, 'POUMONS', t, .5, '#ff9db5', OL, 60),
  sfx: [[0, 'zap', .8], [.5, 'pop', .7], [1.2, 'el:inhale', .3]] });
B(71, { cam: zin(1, 1.04),
  draw: t => { const ph = (t % 1.85) / 1.85; const up = Math.sin(ph * Math.PI); const y = lerp(820, 360, up);
    return bgSplit(t, { wl: 400 }) + G(tr(CX, y, 1, -50 * Math.cos(ph * Math.PI)), tor({ x: 0, y: 0, s: 1.3, expr: up > .9 ? 'joy' : 'worried', swim: 2 }, t)) +
      (up > .92 ? G(tr(CX + 200, 260), text(0, 0, OL, 'HAAA', '#fff', 70)) : '') + path(`M300 900L300 450`, 'none', 14, '#fff') + path('M260 490L300 440L340 490', 'none', 14, '#fff'); },
  sfx: [[.3, 'el:swim_whoosh', .7], [.85, 'el:surface', .8], [1.0, 'el:inhale', .6], [1.4, 'el:plunge', .5], [2.7, 'el:surface', .7], [2.85, 'el:inhale', .5]] });
B(72, { cam: zin(1, 1.06),
  draw: t => bgUnder(t) + torF({ x: CX, y: 1100, r: 150, expr: 'deadpan', armL: 250 + (Math.sin(t * 9) > 0 ? 25 : 0), armR: -70 - (Math.sin(t * 9) > 0 ? 25 : 0) }, t),
  sfx: [[.1, 'el:applause', .4], [.3, 'hmm', .4]] });
B(73, { cam: zout(1.15, 1.0),
  draw: t => bgUnder(t, { floor: 900, fishFar: 1 }) + G(tr(CX, 560, pop(t, .2)), rect(-240, -150, 480, 300, '#ff6fa5', 20) + rect(-30, -150, 60, 300, '#ffd23f', 0, 6) + rect(-240, -20, 480, 50, '#ffd23f', 0, 6) + bow(0, -160, 1.6, 0, '#ffd23f')) +
    tor({ x: 450, y: 800, s: 1, expr: 'wow', swim: .6 }, t) + G(tr(1500, 300), sun(0, 0, .35, t, 'nice')),
  sfx: [[.2, 'magic', .8], [1.2, 'el:chime', .6]] });
B(74, { cam: zin(1.02, 1.1),
  draw: t => { const k = t > .3; return grad('#e9eef4', '#cfd8e2', -200, -200, W + 400, H + 400) + rect(380, 160, 1160, 760, '#fff', 30) + rect(380, 160, 1160, 110, '#5ec4f0', 30) + text(CX, 238, 'none', 'Options : TORTUE MARINE', '#fff', 56) +
      text(760, 420, 'none', 'Nager', OL, 56) + rect(1180, 375, 160, 70, '#5fd068', 35) + circ(1305, 410, 28, '#fff', 5) +
      text(760, 560, 'none', 'Carapace', OL, 56) + rect(1180, 515, 160, 70, '#5fd068', 35) + circ(1305, 550, 28, '#fff', 5) +
      text(760, 700, 'none', 'Respiration aquatique', OL, 56) + rect(1180, 655, 160, 70, '#cfd6dc', 35) + circ(1215 + (t > .9 ? Math.sin(t * 30) * 6 : 0), 690, 28, '#fff', 5) +
      (t > .9 ? tag(CX, 840, 'NON INSTALLÉE', t, .9, '#ff4d4d', '#fff', 56) : ''); },
  sfx: [[.2, 'pop', .6], [.9, 'error_beep', 1]] });
B(75, { enter: 'none', cam: (t, d) => ({ z: 1.02, cy: 300 }),
  draw: t => { const a = t * 4; return grad(lerpColor('#5fd0ea', '#123a5a', (Math.sin(a) + 1) / 2), '#1b6fa3', -200, -200, W + 400, H + 400) + circ(CX + Math.cos(a) * 600, 300 + Math.sin(a) * 250, 70, '#fff3b0', 0) + circ(CX - Math.cos(a) * 600, 300 - Math.sin(a) * 250, 50, '#eef', 0) +
      G(tr(CX, 800), op(.8, tor({ x: 0, y: 0, s: 1.2, swim: 1 }, t).replace(/fill="[^"]+"/g, 'fill="#0d3b5c"'))); },
  sfx: [[0, 'el:time_pass', .9]] });
B(76, { cam: zin(1, 1.04),
  draw: t => { const k = eInOut(seg(t, 0, .8)); return grad('#2a9fd0', '#0f5c8c', -200, -200, W + 400, H + 400) + (k < .5 ? torT({ x: CX, y: CY, s: lerp(.8, 1.6, k * 2), swim: 1 }, t) : torAT({ x: CX, y: CY, s: lerp(.8, 1.3, (k - .5) * 2), swim: 1 }, t)) + G(tr(CX + 420, 300), path('M0 80L0 -80M-50 -30L0 -80L50 -30', 'none', 24, '#fff')); },
  sfx: [[0, 'whoosh_up', .9], [.4, 'magic', .7]] });
B(77, { cam: zin(1, 1.06),
  draw: t => { const k = seg(t, .8, 1.2); return bgUnder(t) + torA({ x: 900, y: 700, s: 1.6, expr: 'proud', swim: .3 }, t) + fish({ x: lerp(1800, 1000, eInCubic(seg(t, 0, .8))) + k * 200, y: 480 - k * 100, s: .8, rot: k * 90, color: '#9b6bd6' }, t) +
    (k > 0 && k < 1 ? impactStar(1000, 500, .5) : '') + (t > 1 ? tag(1300, 300, 'TOC !', t, 1, '#fff', OL, 60) : '') + sparkle(800, 420, .6 * pop(t, 1.6), '#fff'); },
  sfx: [[.8, 'hammer', 1], [.85, 'boing', .5], [1.6, 'glint', .8]] });
B(78, { cam: zin(1, 1.08),
  draw: t => bgUnder(t, { floor: 980 }) + torA({ x: lerp(400, 1000, t / 5), y: 600, s: 1.5, expr: 'cool', swim: .8 }, t) +
    fish({ x: 1500, y: lerp(560, 300, eOutCubic(seg(t, .8, 1.6))), s: .8, color: '#ffd23f' }, t) + fish({ x: 1650, y: lerp(640, 900, eOutCubic(seg(t, 1, 1.8))), s: .7, color: '#7fd3ff' }, t) +
    shark({ x: 1600, y: 240, s: .6, jaw: .1, rot: wave(t, .8, 6) }, t) + (t > 3 ? tag(1600, 80, 'RESPECT.', t, 3, '#fff', OL, 56) : ''),
  sfx: [[0, 'el:hit_cine', .5], [.8, 'el:fish_school', .7], [3, 'glint', .7]] });
B(79, { cam: zout(1.12, 1.0),
  draw: t => bgUnder(t, { floor: 940, fishFar: 1 }) + glow(CX, 0, 900, '#fff8c8', .4) + G(tr(lerp(500, 1300, t / 2.3), 520 + wave(t, .4, 30)), torA({ x: 0, y: 0, s: 1.1, expr: 'shadesGrin', swim: .5 }, t)) + jelly({ x: 1600, y: 300, s: .5 }, t),
  sfx: [[0, 'el:chime', .5], [.8, 'el:bubbles', .4]] });
B(80, { cam: zin(1.02, 1.08),
  draw: t => { const eat = t > .7; return bgUnder(t, { floor: 960 }) + seagrass(1300, 1000, 2.2, t) + torAF({ x: 800, y: 1100, r: 150, expr: eat ? 'happy' : 'joy', face: eat ? { mouth: 'laugh' } : {}, armL: 200 + wave(t, 1.5, 12), armR: eat ? -60 : -20, holdR: eat ? path('M0 0q20 -60 0 -120', 'none', 20, '#62c26a') : '' }, t); },
  sfx: [[0, 'el:swim_whoosh', .7], [.8, 'el:munch', 1]] });
B(81, { cam: zin(1, 1.05),
  draw: t => grad('#2a7fb0', '#0c3b63', -200, -200, W + 400, H + 400) + path('M100 800Q600 300 1100 600T1850 300', 'none', 10, 'rgba(255,255,255,.6)').replace('stroke-linecap', 'stroke-dasharray="26 26" stroke-linecap') +
    G(tr(lerp(200, 1600, t / 1.9), lerp(720, 380, t / 1.9), 1, -15), torA({ x: 0, y: 0, s: .9, swim: 2, expr: 'happy' }, t)) + tag(CX, 960, Math.floor(lerp(12, 4800, t / 1.9)) + ' km', t, 0, '#fff', OL, 70),
  sfx: [[0, 'el:swim_whoosh', .8], [.2, 'clock_fast', .4]] });
B(82, { cam: zin(1, 1.06),
  draw: t => { const k = seg(t, 1.5, 3.5); return grad('#3fb6d9', '#1f7fae', -200, -200, W + 400, H + 400) + G(tr(CX + 300, 520 + k * 600, 1, k * 30), laptopSheet(0, 0, 1.3)) + cross(CX + 300, 400 + k * 600, 1.3, t, 1.4) +
      torAT({ x: 560, y: 560, s: 1.1, rot: -70, swim: .5 }, t) + G(tr(560, 560), circ(-40, -300, 50, 'none', 0)); },
  sfx: [[0, 'el:typing', .8], [1.4, 'el:record', .8], [1.6, 'el:splash', .5], [2.4, 'el:bubbles', .5]] });
B(83, { cam: zin(1, 1.06),
  draw: t => bgSplit(t, { wl: 600 }) + G(tr(CX, 560 + wave(t, .4, 8), 1, 180), torA({ x: 0, y: 0, s: 1.3, expr: 'calm', fa: -30, headTilt: 180 }, t)).replace(/rotate\(180\)/, 'rotate(180)') +
    Array.from({ length: 5 }, (_, i) => G(tr(560 + i * 200, 220, pop(t, .4 + i * .35)), path('M0 -60L18 -18L62 -14L28 14L38 58L0 34L-38 58L-28 14L-62 -14L-18 -18Z', '#ffd23f', 6))).join(''),
  sfx: [[.4, 'ding', .6], [.75, 'ding', .65], [1.1, 'ding', .7], [1.45, 'ding', .75], [1.8, 'tada', .7]] });

// ---------- LE SAC PLASTIQUE ----------
B(84, { cam: (t, d) => ({ z: lerp(1, 1.18, eInOut(seg(t, 1.5, 4))), cx: 1400, cy: 400 }),
  draw: t => bgUnder(t, { fishFar: 1 }) + torA({ x: 600, y: 700, s: 1.4, expr: t > 1.2 ? 'suspicious' : 'happy', swim: t > 1.2 ? .2 : 1, look: [1, -.5] }, t) + plasticBag({ x: 1450, y: 380, s: .8, print: false }, t) + (t > 1.2 ? emark(800, 400, .7 * pop(t, 1.2)) : ''),
  sfx: [[.2, 'el:swim_whoosh', .5], [1.2, 'hmm', .8], [2.2, 'el:bag_rustle', .4]] });
B(85, { cam: zin(1, 1.05),
  draw: t => bgUnder(t) + plasticBag({ x: CX, y: 480, s: 1.5, print: false }, t),
  sfx: [[0, 'el:bag_rustle', .7]] });
B(86, { cam: zin(1, 1.06),
  draw: t => bgUnder(t) + jelly({ x: 620, y: 420, s: 1.6 }, t) + plasticBag({ x: 1300, y: 400, s: 1.3, print: false }, t) + text(CX, 470, OL, '≈', '#fff', 160) + torA({ x: CX - 60, y: 1000, s: .9, expr: 'suspicious' }, t),
  sfx: [[0, 'pop', .6], [.6, 'hmm', .8]] });
B(87, { cam: zin(1, 1.06),
  draw: t => { const k = seg(t, .4, 1.4); return bgUnder(t) + G(tr(620 - k * 900, 420), jelly({ x: 0, y: 0, s: 1.6 }, t)) + plasticBag({ x: lerp(1300, CX, k), y: 400, s: 1.3, print: false }, t) + cross(620, 420, 1, t, .2); },
  sfx: [[.2, 'error_beep', .8], [.5, 'whoosh', .6]] });
B(88, { flash: 1, cam: shk(1.06, 5),
  draw: t => rays(t, CX, CY, '#d6e2ec', '#c1d2e0') + plasticBag({ x: CX, y: 430, s: 2 }, t) + bigText(['SAC PLASTIQUE'], t, .2, CX, 900, '#ff5d5d', 110),
  sfx: [[0, 'el:hit_cine', .8], [.2, 'el:bag_rustle', .9], [.3, 'sting', .6]] });
B(89, { cam: zin(1, 1.05),
  draw: t => { let s = grad('#f6efe2', '#e7dccb', -200, -200, W + 400, H + 400) + rect(-100, 760, W + 200, 400, '#cbb89c', 0, 0) + rect(500, 640, 900, 130, '#5b6068', 10) + rect(500, 620, 900, 30, '#8a929c', 6);
    s += cardTerminal(1250, 540, .6, 0, '') + person({ age: 'adult', x: 760, y: 1060, s: 1.05, expr: t > 3 ? 'happy' : 'neutral', shirt: '#5b7bd6', hair: 'short', armR: [-20, -60] }, t);
    s += G(tr(980, 560), plasticBag({ x: 0, y: 0, s: .6, print: false }, t) + circ(-30, 40, 26, '#ff5d4d', 5) + circ(20, 50, 26, '#ff5d4d', 5) + circ(-5, 0, 26, '#ff5d4d', 5));
    s += tag(CX, 160, '3 TOMATES', t, .9, '#ff5d4d', '#fff', 60) + (t > 3.6 ? tag(CX, 300, '10 MINUTES', t, 3.7, '#ffd23f', OL, 60) + wallClock(1600, 300, 90, t * 30) : '');
    return s; },
  sfx: [[.2, 'el:bag_rustle', .7], [.9, 'pop', .8], [2.6, 'kaching', .7], [3.7, 'tick', .8], [4.6, 'clock_fast', .4]] });
B(90, { cam: zin(1, 1.06),
  draw: t => { const yr = Math.floor(lerp(2025, 2425, seg(t, .2, 3))); return bgUnder(t, { dark: .2 }) + plasticBag({ x: CX + wave(t, .2, 120), y: 460, s: 1.3 }, t) + tag(CX, 900, String(yr), t, .1, '#fff', OL, 90) +
    G(tr(300, 300, 1, -t * 60), calendarPage(0, 0, .8)) + fish({ x: 1500, y: 700, s: .7, color: '#7fd3ff' }, t) + emark(1400, 560, .5); },
  sfx: [[0, 'clock_fast', .7], [1.5, 'el:time_pass', .5]] });
B(91, { cam: zin(1, 1.04),
  draw: t => { const k = seg(t, .6, 2); return bgWhite() + G(tr(CX - 200, 560, 1.2), xrayLungs(0, 0, 1, t, .9).replace(/#ff9db5/g, '#ffd6e0') + path('M0 -260L0 -100C0 0 -60 40 -40 140', 'none', 30, '#ffb37a') + G(tr(-20, 40 - k * 120, .65), plasticBag({ x: 0, y: 0, s: 1, print: false }, t))) +
    G(tr(1400, 520, pop(t, 2.2)), path('M0 -170L170 130L-170 130Z', '#ffd23f', 10) + text(0, 100, 'none', '!', OL, 200)) + tag(1400, 860, 'BOUCHÉ', t, 2.6, '#ff4d4d', '#fff', 60); },
  sfx: [[.6, 'gulp', .9], [2.2, 'error_beep', .9], [2.6, 'pop', .6]] });
B(92, { cam: zin(1, 1.06),
  draw: t => { const k = eInOut(seg(t, .2, 1.8)); return bgUnder(t) + plasticBag({ x: 1300, y: 420, s: 1.1, print: false }, t) + G(tr(lerp(300, 1100, k), 760 - Math.sin(k * Math.PI) * 160), torA({ x: 0, y: 0, s: 1.2, expr: 'smug', swim: 1, look: [1, -.6] }, t)); },
  sfx: [[.2, 'el:swim_whoosh', .8], [1.0, 'hmm', .5]] });
B(93, { cam: (t, d) => ({ z: 1.04, cy: 300 }),
  draw: t => bgUnder(t, { surface: 100 }) + G(tr(lerp(500, 1500, t / 1.4), 330, 1, -10), op(.95, torA({ x: 0, y: 0, s: 1.1, swim: 1.2, expr: 'happy' }, t))),
  sfx: [[0, 'el:swim_whoosh', .8]] });
B(94, { cam: zin(1, 1.08),
  draw: t => grad('#ffcf9a', '#3fb6d9', -200, -200, W + 400, H + 400) + Array.from({ length: 9 }, (_, i) => path(`M${(i * 260 + t * 20) % (W + 300) - 150} ${120 + (i * 137) % 860}q40 -14 80 0t80 0`, 'none', 5, 'rgba(255,255,255,.4)')).join('') +
    G(tr(1300, 380, 1, 0), boatHull(0, 0, .9)) + op(.6, path('M1300 450L1100 1100M1300 450L1500 1100', 'none', 6, '#fff')) + torAT({ x: 500, y: 700, s: .8, rot: 60, swim: 1 }, t),
  sfx: [[0, 'el:a_wind', .3], [.3, 'el:car_engine', .25]] });

// ---------- LE FILET ----------
B(95, { flash: 1, cam: zout(1.2, 1.0),
  draw: t => bgUnder(t, { dark: .35 }) + netWall(t, { y: 60, h: 1100, w: 2600 }) + torA({ x: 560, y: 900, s: .9, expr: 'shock', look: [1, -1] }, t),
  sfx: [[0, 'sting', .9], [.2, 'el:net_creak', .7], [.6, 'el:shark', .4]] });
B(96, { cam: zin(1, 1.06),
  draw: t => { let s = bgUnder(t, { dark: .35 }); for (let i = 0; i < 7; i++) s += fish({ x: 400 + i * 190 + wave(t, 3, 20, i / 7), y: 380 + (i % 3) * 170 + wave(t, 2.5, 30, i / 3), s: .7, color: ['#ffb347', '#7fd3ff', '#ff8fb1', '#ffd23f'][i % 4], rot: wave(t, 4, 25, i / 5), tf: 6, flip: i % 2 }, t);
    return s + net(CX, 180, 1500, 760, t, { n: 14, tight: .3 + .1 * Math.sin(t * 3) }); },
  sfx: [[0, 'el:fish_school', .9], [.6, 'el:struggle', .6], [1.4, 'el:net_creak', .5]] });
B(97, { cam: shk(1.06, 4),
  draw: t => { const k = eOutCubic(seg(t, .1, .7)); const k2 = seg(t, 1, 1.6); return bgUnder(t, { dark: .35 }) + netWall(t, { x: lerp(2600, 1700, k2), y: 40, w: 2400, h: 1100, tight: .2 }) + G(tr(1000, 600, 1, 0) + (k > .5 ? ' scale(-1 1)' : ''), torA({ x: 0, y: 0, s: 1.3, expr: k2 > 0 ? 'scared' : 'shock', swim: 3 }, t)) + (t > 1.2 ? tag(CX, 140, 'TROP TARD', t, 1.2, '#ff4d4d', '#fff', 64) : ''); },
  sfx: [[.1, 'whoosh', .9], [1.0, 'el:net_creak', .8], [1.2, 'sting', .7]] });
B(98, { cam: zin(1.05, 1.15),
  draw: t => { let s = bgUnder(t, { dark: .4 }) + G(tr(700, 560, 3, 30 + wave(t, 3, 8)), flipper(150, 46, T_SKIN, false));
    const k = seg(t, .3, 1.4); for (let i = 0; i < 4; i++) s += op(clamp(k * 4 - i), path(`M${900 + i * 90} 380C${960 + i * 90} 520 ${880 + i * 90} 640 ${960 + i * 90} 760`, 'none', 18) + path(`M${900 + i * 90} 380C${960 + i * 90} 520 ${880 + i * 90} 640 ${960 + i * 90} 760`, 'none', 10, '#ebebdc'));
    return s + net(1300, 100, 1400, 900, t, { n: 12, floats: false, rope: false, tight: .2 }); },
  sfx: [[.3, 'el:net_creak', .9], [.9, 'squeak', .7], [1.4, 'el:rope_snap', .2]] });
B(99, { cam: (t, d) => ({ z: 1.06, cy: 400, shake: 5 }),
  draw: t => bgUnder(t, { dark: .4, surface: 60 }) + net(CX + 300, 200, 1300, 900, t, { n: 12, pull: [CX + 60, 560, .35 + .15 * Math.sin(t * 6)] }) + G(tr(CX - 240 - Math.abs(Math.sin(t * 6)) * 40, 560, 1, -10), torA({ x: 0, y: 0, s: 1.3, expr: 'pain', flipUp: 1, flip: 1 }, t)),
  sfx: [[0, 'hmm', 1], [.1, 'el:net_creak', .8]] });
B(100, { cam: zin(1.0, 1.15),
  draw: t => { const k = seg(t, 0, .7); return bgUnder(t, { dark: .45 }) + torAT({ x: CX, y: CY, s: 1.3, flail: 1, swim: 3 }, t) + net(CX, CY - lerp(700, 300, k), lerp(2200, 760, k), lerp(1400, 600, k), t, { n: 12, floats: false }); },
  sfx: [[0, 'el:net_creak', 1]] });
B(101, { cam: shk(1.06, 9),
  draw: t => { let s = bgUnder(t, { dark: .45 }) + tangled(CX - 100, 640, 1.5, t); for (let i = 0; i < 8; i++) s += circ(CX + wave(t, 2, 200, i / 8), 400 - ((t * 300 + i * 80) % 400), 10 + i % 3 * 5, 'rgba(255,255,255,.4)', 3, 'rgba(255,255,255,.7)'); return s + net(CX, 160, 1700, 900, t, { n: 14, tight: .35, floats: false }); },
  sfx: [[0, 'el:struggle', 1], [.6, 'el:bubbles', .6]] });
B(102, { cam: (t, d) => ({ z: lerp(1.05, 1.15, t / d), shake: t < 1 ? 9 : 0 }),
  draw: t => { const fr = t > 1.0; return bgUnder(t, { dark: fr ? .6 : .45 }) + tangled(CX - 100, 620, 1.5, fr ? 0 : t, { calm: fr, expr: fr ? 'shock' : 'pain' }) + net(CX, 160, 1700, 900, t, { n: 14, tight: .35, floats: false }) + (t > .2 && !fr ? tag(CX, 140, 'ENCORE !', t, .2, '#fff', OL, 60) : ''); },
  sfx: [[0, 'el:struggle', .9], [.5, 'el:struggle', .8], [1.0, 'el:record', .4], [1.05, 'el:heart_slow', .8]] });
B(103, { cam: zout(1.3, 1.0),
  draw: t => bgUnder(t, { dark: .55, surface: 80 }) + glow(CX, 60, 700, '#fff8c8', .35) + path(`M${CX} 1000L${CX} 160`, 'none', 10, 'rgba(255,255,255,.6)').replace('stroke-linecap', 'stroke-dasharray="20 22" stroke-linecap') + tangled(CX - 60, 980, .55, t, { calm: 1, expr: 'shock' }) + net(CX, 820, 700, 260, t, { n: 10, floats: false }),
  sfx: [[0, 'sting', .8], [.3, 'el:heart_slow', .5]] });
B(104, { cam: zin(1.04, 1.14),
  draw: t => bgUnder(t, { dark: .55 }) + torAF({ x: CX, y: 1160, r: 165, expr: 'worried', face: { mouth: 'flat' }, armL: 230, armR: -50 }, t) + ell(CX - 95, 868, 44, 28, '#ff9b9b', 0) + ell(CX + 95, 868, 44, 28, '#ff9b9b', 0) +
    G(tr(1500, 360, pop(t, .4)), circ(0, 0, 110, 'rgba(255,255,255,.3)', 7, '#fff') + text(0, 35, 'none', 'AIR', '#fff', 80)),
  sfx: [[0, 'el:heart_slow', .9], [.4, 'pop', .6]] });
B(105, { cam: (t, d) => ({ z: lerp(1, 1.08, t / d), cy: 300 }),
  draw: t => bgUnder(t, { dark: .55, surface: 70 }) + glow(CX, 60, 600, '#fff8c8', .4) + net(CX, 500, 1800, 700, t, { n: 14, floats: false }) + G(tr(CX, 520, 1, -80), tangled(0, 0, 1.0, t, { expr: 'cry' })) + cross(CX + 360, 260, .8, t, 1.2),
  sfx: [[0, 'el:net_creak', .8], [1.2, 'error_beep', .7]] });
B(106, { cam: zin(1, 1.06),
  draw: t => grad('#2a0e1a', '#3a1424', -200, -200, W + 400, H + 400) + xrayLungs(CX, 640, 1.05, t, .55 + .1 * Math.sin(t * 2), .5 + .5 * Math.abs(Math.sin(t * 4))) + tag(CX + 480, 400, 'AIR ?!', t, .3, '#ff4d4d', '#fff', 60),
  sfx: [[0, 'heartbeat', .9], [.3, 'error_beep', .6], [1, 'heartbeat', .9]] });
B(107, { cam: zin(1, 1.06),
  draw: t => { const k = lerp(.6, .12, seg(t, 0, 3.4)); return bgUnder(t, { dark: .6 }) + tangled(700, 700, 1.3, t, { expr: 'pain' }) + o2Gauge(1450, 520, 1.1, k) + tag(1450, 120, Math.round(k * 100) + ' %', t, 0, k > .3 ? '#ffb340' : '#ff4d4d', '#fff', 60); },
  sfx: [[0, 'el:heart_slow', .9], [1.4, 'error_beep', .6], [2.6, 'error_beep', .8]] });
B(108, { cam: shk(1.08, 12),
  draw: t => bgUnder(t, { dark: .6 }) + net(CX + 250, 200, 1300, 900, t, { n: 12, pull: [CX + 60, 560, .45 + .2 * Math.sin(t * 9)] }) + G(tr(CX - 260 - Math.abs(Math.sin(t * 9)) * 60, 560, 1, -10), torA({ x: 0, y: 0, s: 1.4, expr: 'angry', flipUp: 1, flip: 1 }, t)) + motionLines(CX - 700, 560, 4, 140, 180),
  sfx: [[0, 'el:struggle', 1], [.3, 'el:net_creak', 1], [.4, 'hmm', .9]] });
B(109, { cam: zin(1.04, 1.12),
  draw: t => bgUnder(t, { dark: .6 }) + G(tr(800, 560, 3, 25), flipper(150, 46, T_SKIN, false) + (t > .5 ? path('M70 -22l12 12l-10 8l12 12', 'none', 5, '#e2463a') : '')) + path(`M${1150} 300C1100 500 1150 700 1100 900`, 'none', 22) + path(`M1150 300C1100 500 1150 700 1100 900`, 'none', 12, '#ebebdc') + (t > .5 ? impactStar(1000, 560, .5) + sparkle(900, 420, .5, '#fff') : ''),
  sfx: [[.4, 'snip', .8], [.5, 'squeak', .8], [.6, 'el:net_creak', .6]] });
B(110, { cam: shk(1.05, 5),
  draw: t => { const k = Math.sin(t * 5); return bgUnder(t, { dark: .6 }) + G(tr(CX, 0) + (k > 0 ? ' scale(-1 1)' : ''), torAF({ x: 0, y: 1150, r: 160, expr: 'scared', look: [k > 0 ? 1 : -1, 0], armL: 210, armR: -30 }, t)) + net(CX, 0, 2000, 1100, t, { n: 16, floats: false, rope: false }); },
  sfx: [[0, 'whoosh', .8], [.6, 'whoosh', .7], [1.2, 'el:net_creak', .6]] });
B(111, { flash: 1, cam: shk(1.1, 10),
  draw: t => rect(-200, -200, W + 400, H + 400, '#2a0e1a', 0, 0) + cross(CX, CY - 40, 2.2, t, 0) + bigText(['IMPOSSIBLE'], t, .1, CX, 940, '#ff4d4d', 110),
  sfx: [[0, 'el:hit_cine', 1], [.05, 'error_beep', .8]] });
B(112, { enter: 'none', cam: zin(1, 1.05),
  draw: t => bgWhite() + rect(260, 140, 1400, 30, '#5ec4f0', 10, 0) + text(CX, 120, 'none', 'SURFACE', '#5ec4f0', 50) + net(CX, 500, 900, 400, t, { n: 10, col: '#8a8f99', sw: 5 }) +
    G(tr(CX - 60, 720, .9), torA({ x: 0, y: 0, s: 1, expr: 'cry', calm: 1 }, t)) + path(`M${CX} 640L${CX} 220`, 'none', 10, '#8a8f99').replace('stroke-linecap', 'stroke-dasharray="20 22" stroke-linecap') + cross(CX, 380, .6, t, 1.0) + o2Gauge(1600, 640, .8, lerp(.3, 0, seg(t, 0, 4)), ''),
  sfx: [[0, 'el:heart_slow', .8], [1, 'error_beep', .6]] });
B(113, { cam: zin(1, 1.05),
  draw: t => bgUnder(t, { floor: 960 }) + G(tr(lerp(500, 1200, t / 2.6), 560), torA({ x: 0, y: 0, s: 1.3, expr: 'proud', swim: 2 }, t)) + medal(560, 300, 1 * pop(t, .4)) + check(1550, 300, .9, t, .9),
  sfx: [[.4, 'ding', .8], [.9, 'tada', .5]] });
B(114, { cam: zin(1, 1.05),
  draw: t => bgWhite() + rect(260, 140, 1400, 30, '#5ec4f0', 10, 0) + net(CX, 330, 1200, 200, t, { n: 12, col: '#8a8f99', sw: 5, floats: false }) + G(tr(CX - 60, 820, .9), torA({ x: 0, y: 0, s: 1, expr: 'worried', swim: 1.5 }, t)) +
    path(`M${CX} 700L${CX} ${lerp(700, 380, seg(t, .2, 1))}`, 'none', 14, '#5fd068') + cross(CX, 330, .7, t, 1.1),
  sfx: [[.2, 'whoosh_up', .6], [1.1, 'error_beep', .8]] });
B(115, { cam: shk(1.06, 9),
  draw: t => bgUnder(t, { dark: .65 }) + tangled(CX - 100, 640, 1.5, t, { expr: 'angry' }) + net(CX, 160, 1700, 900, t, { n: 14, tight: .35, floats: false }) + o2Gauge(1700, 300, .5, .08, ''),
  sfx: [[0, 'el:struggle', 1], [1, 'el:net_creak', .7]] });
B(116, { cam: zin(1.05, 1.2),
  draw: t => { const k = seg(t, .6, 1.4); let s = bgUnder(t, { dark: .6 });
    s += path(`M${CX - 600} ${CY}L${CX - 30 - k * 120} ${CY + k * 60}`, 'none', 40) + path(`M${CX - 600} ${CY}L${CX - 30 - k * 120} ${CY + k * 60}`, 'none', 26, '#ebebdc') + path(`M${CX + 600} ${CY}L${CX + 30 + k * 120} ${CY - k * 60}`, 'none', 40) + path(`M${CX + 600} ${CY}L${CX + 30 + k * 120} ${CY - k * 60}`, 'none', 26, '#ebebdc');
    if (k < 1) for (let i = 0; i < 5; i++) s += line(CX - 40, CY - 20 + i * 10, CX + 40, CY - 30 + i * 12, 4, '#ebebdc');
    return s + (k > 0 ? impactStar(CX, CY, .6 * pop(t, .6)) : ''); },
  sfx: [[0, 'el:net_creak', .8], [.6, 'el:rope_snap', 1], [.65, 'crack', .6]] });
B(117, { flash: 1, cam: shk(1.08, 8),
  draw: t => bgUnder(t, { dark: .5 }) + speedLines(t, CX, CY, 30, 'rgba(255,255,255,.6)') + G(tr(CX, lerp(800, 400, eOutCubic(seg(t, 0, .8))), 1, -60), torA({ x: 0, y: 0, s: 1.5, expr: 'angry', swim: 4 }, t)) + net(CX, 900, 1800, 500, t, { n: 12, floats: false }),
  sfx: [[0, 'el:rope_snap', .9], [.1, 'whoosh_up', .9]] });
B(118, { cam: zin(1, 1.08),
  draw: t => { const dpt = Math.max(1, Math.round(lerp(8, 2, seg(t, 0, 1.2)))); return bgUnder(t, { dark: lerp(.45, .1, t / 1.2), surface: 120 }) + G(tr(CX, lerp(900, 500, t / 1.2), 1, -80), torA({ x: 0, y: 0, s: 1.2, expr: 'worried', swim: 3 }, t)) + depthTag(1600, 300, '-' + dpt + ' m', t, 0) + o2Gauge(300, 560, .6, .05, ''); },
  sfx: [[0, 'el:swim_whoosh', .9], [.4, 'el:bubbles', .7]] });
B(119, { flash: 1, cam: shk(1.06, 6),
  draw: t => { const k = eOutBack(seg(t, .1, .7)); let s = bgSplit(t, { wl: 560 }) + G(tr(CX, lerp(900, 450, k), 1, -30), torA({ x: 0, y: 0, s: 1.4, expr: 'shock', swim: 2 }, t));
    for (let i = 0; i < 10; i++) { const a = R(200 + i * 14), r = 300 * seg(t, .2, 1); s += circ(CX + Math.cos(a) * r, 560 + Math.sin(a) * r * .8, 16, '#fff', 4, '#9be2f5'); }
    return s; },
  sfx: [[.1, 'el:surface', 1], [.2, 'el:splash', .8]] });
B(120, { cam: zin(1.0, 1.08),
  draw: t => rays(t, CX, 300, '#fff6c8', '#ffe08a') + rect(-200, 700, W + 400, 600, '#4cc3e6', 0, 0) + torAF({ x: CX, y: 1200, r: 160, expr: t < .5 ? 'shock' : 'calm', face: t < .5 ? { mouth: 'o' } : { mouth: 'grin' }, armL: 220, armR: -40 }, t) + (t > .2 ? G(tr(CX + 300, 300, pop(t, .2)), text(0, 0, OL, 'HAAAA', '#fff', 90)) : ''),
  sfx: [[0, 'el:gasp', 1], [.6, 'el:inhale', .8]] });
B(121, { cam: zout(1.12, 1.0),
  draw: t => bgSplit(t, { wl: 600, sky1: '#ffd7a8', sky2: '#fff1d9' }) + G(tr(CX, 600 + wave(t, .4, 8)), torA({ x: 0, y: 0, s: 1.2, expr: 'proud', swim: .4, band: 1 }, t)) + G(tr(CX, 220, pop(t, .5)), rect(-200, -80, 400, 160, '#fff', 20) + text(0, 30, 'none', 'SURVIE : 2', '#5fd068', 64)),
  sfx: [[0, 'el:a_beach', .3], [.5, 'tada', .7]] });
