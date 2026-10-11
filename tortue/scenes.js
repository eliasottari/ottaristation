// ============================================================
//  « Pourquoi c'est horrible de naître tortue ? » — 16:9 (1920×1080), 182 blocs BEATFLOW
//  scenes.js = aides + B001–B058 ; scenes_b.js = B059–B121 ; scenes_c.js = B122–B182 (+ BEDS)
// ============================================================
const TOTAL = 422.6;
const BT = [0, 2.72, 5.24, 8.87, 9.84, 11.24, 20.54, 22.81, 24.61, 30.82, 34.48, 36.34, 40.15, 42.06, 43.26, 44.49, 46.91, 48.34, 52.80, 54.44, 57.84, 61.02, 65.28, 68.96, 71.60, 72.95, 76.80, 78.56, 80.34, 82.08,
  85.03, 86.43, 87.86, 92.87, 94.88, 96.55, 99.06, 102.64, 106.44, 108.31, 110.51, 115.40, 117.45, 119.96, 121.27, 122.73, 123.73, 124.88, 127.77, 129.58, 131.16, 132.17, 134.28, 136.44, 138.51, 142.17, 143.42, 144.26, 146.08, 149.30,
  151.40, 152.76, 157.13, 159.84, 161.80, 164.96, 167.40, 169.24, 171.67, 174.98, 176.58, 180.30, 182.02, 185.90, 187.31, 188.20, 189.14, 192.21, 197.44, 199.74, 201.23, 203.13, 206.87, 209.62, 214.29, 215.15, 217.40, 220.94, 222.46, 228.85,
  232.18, 236.22, 238.26, 239.70, 240.79, 243.08, 245.64, 247.56, 250.21, 251.06, 251.81, 253.56, 254.90, 255.81, 257.80, 260.21, 262.03, 265.57, 267.26, 269.09, 271.05, 271.88, 276.26, 278.82, 280.76, 282.90, 284.87, 285.75, 286.95, 288.93,
  290.07, 291.54, 293.27, 294.50, 296.42, 298.04, 299.38, 300.84, 303.58, 305.88, 308.03, 311.20, 318.04, 321.23, 322.03, 323.08, 326.17, 327.89, 330.08, 332.15, 334.04, 336.52, 343.26, 345.19, 347.51, 349.33, 351.28, 352.29, 355.82, 358.21,
  359.47, 360.82, 366.60, 368.22, 369.76, 371.14, 372.30, 374.08, 376.16, 378.26, 380.05, 382.08, 383.55, 385.05, 386.40, 389.14, 391.48, 392.72, 393.68, 395.99, 397.70, 399.21, 400.91, 402.56, 404.68, 406.28, 407.88, 408.63, 409.54, 410.36, 414.60, 417.51, 422.01];
const SCENES = [];
function B(n, o, off = 0) { o.s = +(BT[n - 1] + off).toFixed(3); o.n = n; SCENES.push(o); return o; }

// ---------- personnages de l'épisode ----------
const tor = (o, t) => turtle(Object.assign({ age: 'baby', bow: 1, lashes: 1, seed: 1 }, o), t);
const torF = (o, t) => turtleFront(Object.assign({ age: 'baby', bow: 1, lashes: 1, seed: 1 }, o), t);
const torT = (o, t) => turtleTop(Object.assign({ age: 'baby', bow: 1, seed: 1 }, o), t);
const torA = (o, t) => turtle(Object.assign({ age: 'adult', bow: 1, lashes: 1, seed: 1 }, o), t);
const torAF = (o, t) => turtleFront(Object.assign({ age: 'adult', bow: 1, lashes: 1, seed: 1 }, o), t);
const torAT = (o, t) => turtleTop(Object.assign({ age: 'adult', bow: 1, seed: 1 }, o), t);
const sib = (o, t) => turtle(Object.assign({ age: 'baby', seed: (o.x || 0) % 7 }, o), t);
const sibT = (o, t) => turtleTop(Object.assign({ age: 'baby', seed: (o.x || 0) % 7 }, o), t);
const kid = (o, t) => turtle(Object.assign({ age: 'baby', tuft: 1, seed: 3 }, o), t);           // son bébé (fin)
const kidF = (o, t) => turtleFront(Object.assign({ age: 'baby', tuft: 1, seed: 3 }, o), t);
const kidT = (o, t) => turtleTop(Object.assign({ age: 'baby', seed: 3 }, o), t);
const mom = (o, t) => turtle(Object.assign({ age: 'adult', lashes: 1, shell: '#6f8f4f', shellL: '#93b06c', seed: 5 }, o), t);

// ---------- aides graphiques ----------
const CX = W / 2, CY = H / 2;
function bigText(lines, t, t0, x, y, col = '#fff', size = 120, gap = 1.08) {
  return lines.map((l, i) => { const k = pop(t, t0 + i * .18, .4); return k <= 0 ? '' : G(tr(x, y + i * size * gap, k), text(0, size * .35, OL, l, col, size)); }).join('');
}
function title(t) {
  const k1 = pop(t, .05, .45), k2 = pop(t, .35, .5);
  return G(tr(CX, 120, k1), text(0, 30, OL, "POURQUOI C'EST HORRIBLE", '#fff', 104)) +
    G(tr(CX, 250, k2, wave(t, .6, 2)), text(0, 30, OL, 'DE NAÎTRE <tspan fill="#7be07b">TORTUE ?</tspan>', '#fff', 122));
}
function tag(x, y, str, t, t0, bg = '#ffd23f', fg = OL, size = 64, r = 0) {
  const k = pop(t, t0, .35); if (k <= 0) return '';
  const w = str.length * size * .56 + size;
  return G(tr(x, y, k, r), rect(-w / 2, -size * .8, w, size * 1.6, bg, size * .5) + text(0, size * .36, 'none', str, fg, size));
}
const rays = (t, cx, cy, c1 = '#ffe9a8', c2 = '#ffd36b', n = 20) => sunburst(cx, cy, n, c1, c2, t * 12);
function cross(x, y, s, t, t0 = 0) { const k = pop(t, t0, .3); return k <= 0 ? '' : G(tr(x, y, s * k), path('M-80 -80L80 80M80 -80L-80 80', 'none', 46) + path('M-80 -80L80 80M80 -80L-80 80', 'none', 28, '#ff4d4d')); }
function check(x, y, s, t, t0 = 0) { const k = pop(t, t0, .3); return k <= 0 ? '' : G(tr(x, y, s * k), path('M-80 0L-20 60L90 -70', 'none', 46) + path('M-80 0L-20 60L90 -70', 'none', 28, '#5fd068')); }
function noSign(x, y, s, inner, t, t0) { const k = pop(t, t0, .35); return k <= 0 ? '' : G(tr(x, y, s * k), circ(0, 0, 130, '#fff') + inner + circ(0, 0, 130, 'none', 24, OL) + circ(0, 0, 130, 'none', 14, '#ff4d4d') + line(-92, -92, 92, 92, 26) + line(-92, -92, 92, 92, 14, '#ff4d4d')); }
function nugget(x, y, s = 1, r = 0) { return G(tr(x, y, s, r), path('M-90 -10C-100 -60 -30 -80 10 -60C60 -90 110 -40 90 10C100 60 30 80 -10 60C-60 80 -110 40 -90 -10Z', '#e9a93b') + circ(-30, -20, 6, '#c97f1f', 0) + circ(30, 10, 7, '#c97f1f', 0) + circ(0, 30, 5, '#c97f1f', 0) + circ(40, -30, 5, '#c97f1f', 0)); }
function sauce(x, y, s = 1) { return G(tr(x, y, s), path('M-50 -20L50 -20L40 30L-40 30Z', '#fff') + ell(0, -20, 50, 12, '#e2463a')); }
function spoon(x, y, s = 1, r = 0) { return G(tr(x, y, s, r), line(0, 0, 160, 0, 26) + line(0, 0, 160, 0, 12, '#cfd6dc') + ell(-40, 0, 50, 32, '#cfd6dc')); }
function ruler(x, y, w, label, t, t0 = 0) {
  const k = seg(t, t0, t0 + .5); let s = rect(x, y, w * k, 50, '#ffd23f', 6, 6);
  for (let i = 0; i <= 10 * k; i++) s += line(x + i * w / 10, y, x + i * w / 10, y + (i % 5 ? 18 : 30), 4);
  return s + (k > .9 ? text(x + w / 2, y + 120, OL, label, '#fff', 70) : '');
}
function meter(x, y, w, h, k, col = '#5fd068', label = '') {
  return rect(x, y, w, h, '#fff', h / 2) + rect(x + 8, y + 8, Math.max(0, (w - 16) * clamp(k)), h - 16, col, (h - 16) / 2, 0) + rect(x, y, w, h, 'none', h / 2) + (label ? text(x + w / 2, y + h * .72, OL, label, '#fff', h * .7) : '');
}
function vhs(t) { let s = ''; for (let i = 0; i < 14; i++) s += rect(0, (i * 83 + t * 900) % H, W, 6, 'rgba(255,255,255,.12)', 0, 0); return s + text(160, 120, OL, '◀◀', '#fff', 90); }
function pauseBars(x, y, s = 1) { return G(tr(x, y, s), rect(-60, -70, 40, 140, '#fff', 8) + rect(20, -70, 40, 140, '#fff', 8)); }
function bottle(x, y, s = 1) { return G(tr(x, y, s), rect(-40, -60, 80, 140, '#eaf6ff', 20) + rect(-30, -100, 60, 40, '#ffb3c7', 10) + path('M-14 -100Q0 -150 14 -100Z', '#e9c08a', 5) + rect(-40, 0, 80, 70, '#fffbe8', 0, 0) + rect(-40, -60, 80, 140, 'none', 20)); }
function hugIcon(x, y, s = 1) { return G(tr(x, y, s), heart(0, 0, 1.6, '#ff6f91')); }
function eggsPile(x, y, n, s, t, seed = 3, hiIdx = -1) {
  const r = rng(seed); let g = '';
  const cols = Math.ceil(Math.sqrt(n * 1.6));
  for (let i = 0; i < n; i++) { const c = i % cols, rw = Math.floor(i / cols); g += egg(x + (c - cols / 2) * 90 + (rw % 2) * 45 + r() * 10, y - rw * 80 + r() * 8, s * (.9 + r() * .15), 0, t, { r: wave(t, .5, 4, i / 7) }); }
  return g;
}
function stars(x, y, t, n = 5, rr = 90) { let s = ''; for (let i = 0; i < n; i++) { const a = t * 4 + i * 6.28 / n; s += sparkle(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .35, .4, '#ffe066'); } return s; }
function confetti(t, t0 = 0, n = 50, seed = 4) {
  const r = rng(seed); let s = ''; const k = t - t0; if (k < 0) return '';
  const cols = ['#ff6fa5', '#ffd23f', '#5ec4f0', '#7be07b', '#ff8a3d'];
  for (let i = 0; i < n; i++) { const x = r() * W, y = -50 + (r() * 300 + k * (250 + r() * 300)) % (H + 100); s += rect(x + wave(k, .7, 30, r()), y, 18, 30, cols[i % 5], 4, 0).replace('/>', ` transform="rotate(${f1(k * 200 + i * 40)} ${f1(x)} ${f1(y)})"/>`); }
  return s;
}
function thought(x, y, w, h, inner, k = 1) { return bubble(x, y, w, h, inner, k); }
function sandFlying(x, y, t, n = 10, seed = 2) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const k = (t * 1.6 + r()) % 1; s += circ(x + (r() - .5) * 60 + (r() - .5) * 300 * k, y - 260 * k + 400 * k * k, 6 + r() * 6, SAND_D, 3); } return s; }
// fond « pédagogie » : blanc pur avec léger dégradé
const bgWhite = () => grad('#ffffff', '#f2f6fa', -200, -200, W + 400, H + 400);
// caméras
const zin = (a = 1, b = 1.12) => (t, d) => ({ z: lerp(a, b, eInOut(clamp(t / d))) });
const zout = (a = 1.15, b = 1) => (t, d) => ({ z: lerp(a, b, eOutCubic(clamp(t / d))) });
const zinAt = (a, b, cx, cy) => (t, d) => ({ z: lerp(a, b, eInOut(clamp(t / d))), cx, cy });
const shk = (z = 1.08, a = 10) => () => ({ z, shake: a });

// ============================================================
//  ACCROCHE — l'aigle
// ============================================================
B(1, { enter: 'none', cam: zout(1.12, 1.0),
  draw: (t, d) => bgBeach(t, { hotels: 1 }) + birdShadow(900 + Math.cos(t * 1.5) * 260, 900 + Math.sin(t * 1.5) * 50, 1.1, .2) +
    tor({ x: 960, y: 900, s: .8, expr: 'happy', walk: .6 }, t) + eagle({ x: 1500 + wave(t, .3, 60), y: 420, s: .45, expr: 'hungry' }, t) + title(t),
  sfx: [[0, 'el:gull', .7], [.05, 'whoosh', .8], [.4, 'el:hit_cine', .7], [1.6, 'el:eagle', .6]] });
B(2, { cam: zin(1.02, 1.1),
  draw: t => rays(t, CX, 520, '#d8f3ff', '#bfe9ff') + bgBeach(t, { hz: 330, sy: 520 }).replace(/^/, '') + torF({ x: CX, y: 1060, r: 150, expr: 'wow', armL: 210 + wave(t, 1.2, 15), armR: -30 - wave(t, 1.2, 15) }, t) +
    stars(CX, 260, t, 6, 300) + G(tr(1500, 300, 1, wave(t, .5, 10)), path('M0 0C-30 -40 -70 -20 -60 10C-50 30 -20 20 0 0C20 20 50 30 60 10C70 -20 30 -40 0 0Z', '#ffb3e6', 5)),
  sfx: [[0, 'el:chime', .8], [.6, 'el:baby_squeak', .7], [1.4, 'sparkle', .6]] });
B(3, { enter: 'drop', cam: (t, d) => ({ z: lerp(1, 1.1, t / d), cy: 300 }),
  draw: t => bgBeach(t, { hz: 900, sy: 990, sunY: 200, sunX: 400 }) + eagle({ x: CX + 60, y: 420 + wave(t, .5, 20), s: 1.45, expr: 'hungry', bib: 1, talons: 'open', flap: 1.2 }, t) +
    fork(560, 560, 1.3, -30 + wave(t, 1, 8)) + knife(1420, 560, 1.3, 30 - wave(t, 1, 8)) + tor({ x: 420, y: 1010, s: 1.2, expr: 'shock', neck: .9 }, t) + emark(640, 760, .8),
  sfx: [[0, 'el:eagle', .9], [.15, 'el:wings', .6], [1.2, 'sting', .8], [2.3, 'el:munch', .4]] });
function sandTop(t, seed = 6) { let s = grad('#f5ddb0', '#e8c68c', -200, -200, W + 400, H + 400); const r = rng(seed); for (let i = 0; i < 70; i++) s += ell(r() * W, r() * H, 5 + r() * 10, 3 + r() * 6, SAND_W, 0); for (let i = 0; i < 5; i++) s += ell(r() * W, r() * H, 26, 18, '#fff4dc', 4, '#d6b27a'); return s; }
B(4, { enter: 'whip', cam: shk(1.06, 6),
  draw: t => { const x = 300 + t * 900; return sandTop(t) + birdShadow(x - 150 + t * 60, 560, 1.6, .28) + sandFlying(x - 120, 640, t, 8) + speedLines(t * .5, x, 540, 14, 'rgba(255,255,255,.5)') + torT({ x, y: 540, s: 1.4, rot: 90, walk: 4 }, t); },
  sfx: [[0, 'el:patter', 1], [.1, 'whoosh', .8], [.5, 'el:wings', .5]] });
B(5, { cam: zin(1.0, 1.06),
  draw: t => bgBeach(t, { hotels: 1 }) + tor({ x: 820 + t * 40, y: 980, s: 1.6, expr: 'pain', walk: .7, headTilt: 8 }, t) + sweat(1150, 640, 1) + sweat(1190, 700, .7) +
    crab({ x: 300 + t * 520, y: 960, s: .6, walk: 2, mouth: 'smile' }, t),
  sfx: [[0, 'el:patter', .6], [.2, 'hmm', .8], [.8, 'el:crab_scuttle', .6]] });
// B006 : 3 sous-plans (centimètres / cuillères / nugget)
B(6, { cam: zin(1, 1.05),
  draw: t => bgBeach(t, { hotels: 1 }) + tor({ x: 900, y: 920, s: 1.5, expr: 'confused', look: [0, -1] }, t) + ruler(520, 960, 820, '≈ 5 cm', t, .3) + qmark(1200, 560, .7),
  sfx: [[0, 'pop', .8], [.3, 'tick', .8], [.8, 'ding', .7]] });
B(6, { enter: 'whip', cam: zin(1.05, 1.12),
  draw: t => rays(t, CX, CY, '#fff3d9', '#ffe2a8') + tor({ x: 760, y: 820, s: 2.2, expr: 'worried', walk: .9, look: [.5, 1] }, t) + G(tr(1440, 640, pop(t, .5)), spoon(0, 0, 1.4, 20 + wave(t, 1, 8))) + text(1300, 520, OL, '=', '#fff', 140).replace('<text', `<text opacity="${seg(t, .4, .6)}"`),
  sfx: [[0, 'whoosh', .8], [.5, 'el:chime', .5], [1.2, 'boing', .6]] }, 2.45);
B(6, { enter: 'drop', cam: (t, d) => ({ z: lerp(1, 1.12, t / d), shake: t > 1 ? 4 : 0 }),
  draw: t => { const ey = lerp(-300, 330, eOutCubic(seg(t, 0, 1.2))); return bgBeach(t, { hotels: 1 }) + birdShadow(1000, 1000, 1.4, .3) + eagle({ x: 1050, y: ey, s: 1.25, talons: 'open', expr: 'hungry' }, t) +
    tor({ x: 820, y: 1000, s: .85, expr: 'scared' }, t) + (t > 1.25 ? thought(560, 300, 520, 330, nugget(-60, -90, 1.2, -10) + sauce(130, -60, 1), pop(t, 1.25)) : ''); },
  sfx: [[0, 'el:dive', .9], [.6, 'el:eagle', .9], [1.0, 'el:wings', .7], [1.3, 'pop', .9], [2.2, 'el:munch', .6]] }, 4.6);
B(7, { cam: (t, d) => ({ z: 1.04, shake: t > .8 ? 3 : 0 }),
  draw: t => { const k = eInOut(seg(t, .2, 1.1)); return bgBeach(t, { hotels: 1 }) + tor({ x: 940, y: 900, s: 1.6, expr: k > .5 ? 'pain' : 'worried', neck: 1 - k * .75, squash: k * .4 }, t) + (k > .6 ? motionLines(1300, 650, 3, 70, 200) : ''); },
  sfx: [[.2, 'squeak', .8], [.6, 'hmm', .9], [1.3, 'el:struggle', .4]] });
B(8, { flash: 1, cam: shk(1.08, 6),
  draw: t => rays(t, CX, CY, '#ffe066', '#ffb703', 24) + confetti(t, 0, 50) + torF({ x: CX, y: 1120, r: 165, expr: 'shock', neck: .3, armL: 220, armR: -40 }, t) + bigText(['SURPRISE !'], t, .45, CX, 150, '#ff6fa5', 150),
  sfx: [[0, 'el:hit_cine', .8], [.45, 'tada', .9], [.5, 'el:crowd_gasp', .6]] });
// B009 : terrestre vs marine
B(9, { cam: zin(1, 1.04),
  draw: t => { const k = eInOut(seg(t, .6, 1.6)); const k2 = eInOut(seg(t, 3.6, 4.6));
    return grad('#bfe9ff', '#f3fbff', -200, -200, W + 400, H + 400) + rect(-100, 820, W / 2 + 100, 400, '#b9d98a', 0, 0) + rect(W / 2, 820, W / 2 + 100, 400, SAND, 0, 0) + line(W / 2, -100, W / 2, H + 100, 10) +
      turtle({ x: 480, y: 900, s: 1.3, age: 'adult', shell: '#9c7444', shellL: '#c49a62', skin: '#c9b27a', expr: k > .9 ? 'calm' : 'happy', neck: 1 - k, headBehind: 1, seed: 7, dome: 1.45 }, t) + (k > .9 ? check(480, 400, .9, t, 1.6) : '') +
      tag(480, 140, 'TERRESTRE', t, .1, '#c49a62', '#fff', 60) + (t > 3.2 ? tor({ x: 1400, y: 900, s: 1.6, expr: k2 > .5 ? 'pain' : 'worried', neck: 1 - k2 * .55, squash: k2 * .3 }, t) + tag(1440, 140, 'MARINE', t, 3.25, SEA, '#fff', 60) + cross(1440, 420, .9, t, 4.7) : ''); },
  sfx: [[.1, 'pop', .8], [.7, 'squeak', .6], [1.6, 'ding', .8], [3.25, 'pop', .8], [3.7, 'hmm', .8], [4.7, 'error_beep', .8]] });
B(10, { cam: zin(1, 1.1),
  draw: t => { const gx = lerp(-300, 300, seg(t, .5, 1.6)); return sandTop(t, 9) + torT({ x: CX, y: 560, s: 2.6, rot: 0 }, t) +
    `<g opacity=".7"><path d="M${CX + gx - 60} 300L${CX + gx + 20} 300L${CX + gx - 100} 820L${CX + gx - 180} 820Z" fill="#fff"/></g>` + sparkle(CX + 180, 380, pop(t, 1.4), '#fff') + sparkle(CX - 160, 700, .6 * pop(t, 1.7), '#fff') + tag(CX, 980, 'ARMURE', t, 1.0, '#cfd6dc', OL, 70) +
    G(tr(1500, 320, pop(t, 2)), path('M0 -90L80 -60L70 40Q40 90 0 110Q-40 90 -70 40L-80 -60Z', '#cfd6dc') + path('M0 -60L0 80M-50 0L50 0', 'none', 8, '#8a96a3')); },
  sfx: [[.5, 'glint', .9], [1.0, 'el:hit_cine', .5], [1.4, 'sparkle', .8], [2, 'hammer', .5]] });
B(11, { cam: zin(1.02, 1.1),
  draw: t => bgBeach(t, { hotels: 1 }) + tor({ x: 900, y: 940, s: 1.7, expr: 'deadpan', neck: .25, squash: .25 }, t) + eagle({ x: 1500, y: lerp(-200, 260, eOutCubic(seg(t, .6, 1.3))), s: .8, expr: 'happy', bib: 1 }, t),
  sfx: [[.2, 'el:record', .8], [.7, 'el:eagle', .5], [1.2, 'rimshot', .7]] });
B(12, { enter: 'none', cam: zin(1, 1.04), overlay: t => (t < 1.6 ? vhs(t) : ''),
  draw: t => { const back = t < 1.6 ? -t * 500 : 0; return bgBeach(t, { hotels: 1, dusk: seg(t, 1.6, 3.5) * .5 }) + tor({ x: 900 + back, y: 940, s: 1.4, expr: t < 1.6 ? 'shock' : 'sad', walk: t < 1.6 ? -2 : 0, flip: t < 1.6 ? 0 : 1 }, t) + (t < .3 ? pauseBars(CX, CY) : ''); },
  sfx: [[0, 'rewind', .9], [.05, 'el:time_pass', .7]] });

// ============================================================
//  FLASHBACK — l'œuf sous le sable
// ============================================================
B(13, { enter: 'none', flash: 1,
  draw: t => bgSand(t, { sy: 160 }) + eggsPile(CX, 900, 22, .9, t, 3) + egg(CX, 640, 1.2, 0, t) + bow(CX - 30, 600, .4, -20) +
    G(tr(1520, 300, 1, 10 - t * 40), calendarPage(0, 0, 1, 0, '')) + bigText(['DEUX MOIS', 'PLUS TÔT'], t, .2, CX, 330, '#ffd23f', 120),
  sfx: [[0, 'el:time_pass', .9], [.2, 'whoosh', .7], [.5, 'el:hit_cine', .5]] });
B(14, { cam: zin(1.05, 1.15),
  draw: t => bgSand(t, { sy: -100 }) + glow(CX, 560, 420, '#fff6c8', .5 + .2 * Math.sin(t * 5)) + egg(CX, 580, 4.2, 0, t, { r: wave(t, .8, 4) }) + bow(CX - 120, 410, 1.4, -20) + heart(CX + 300, 340, .7 * pop(t, .5)),
  sfx: [[0, 'pop', .8], [.3, 'heartbeat', .7]] });
B(15, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.05, 1.0, t / d) }),
  draw: t => { let s = bgSand(t, { sy: 120 }); s += crab({ x: 300 + t * 300, y: 80, s: .35, walk: 2 }, t);
    for (let i = 0; i < 6; i++) s += sandFlying(400 + i * 220, 330 + (t * 200) % 300, t, 3, i);
    return s + egg(CX, 820, 2.6, 0, t) + bow(CX - 70, 720, .9, -20) + path(`M${CX} 260L${CX} 600`, 'none', 10, 'rgba(255,255,255,.7)') + path(`M${CX - 40} 560L${CX} 620L${CX + 40} 560`, 'none', 10, 'rgba(255,255,255,.7)') + tag(CX + 420, 420, '-50 cm', t, .4, '#fff', OL, 60); },
  sfx: [[0, 'thud', .8], [.2, 'el:dig', .6], [.5, 'pop', .6]] });
B(16, { cam: zout(1.25, 1.0),
  draw: t => { let s = bgSand(t, { sy: -200 }); const r = rng(5); let n = Math.floor(seg(t, 0, 1.6) * 100);
    for (let i = 0; i < 100; i++) { const c = i % 14, rw = Math.floor(i / 14); if (i < n) s += egg(220 + c * 115 + (rw % 2) * 55, 160 + rw * 120, .9, 0, t, { r: wave(t, .6, 5, i / 9) }); }
    s += bow(220 + 7 * 115 - 30 + 0, 160 + 3 * 120 - 40, .45, -20);
    return s + tag(CX, 990, '≈ 100', t, 1.5, '#ffd23f', OL, 80); },
  sfx: [[0, 'pop', .6], [.3, 'pop_hi', .6], [.6, 'pop', .6], [.9, 'pop_hi', .6], [1.5, 'tada', .7]] });
B(17, { cam: zin(1, 1.08),
  draw: t => bgSand(t, { sy: 360 }) + path('M600 330Q960 120 1320 330', 'none', 10, 'rgba(255,255,255,.9)').replace('stroke-linecap', 'stroke-dasharray="30 24" stroke-linecap') +
    G(tr(1480, 300), Array.from({ length: 6 }, (_, i) => ell(i * 70, (i % 2) * 30, 18, 12, '#c9a26a', 0)).join('')) + egg(CX, 720, 2.2, 0, t, { r: wave(t, 1, 6) }) + bow(CX - 60, 630, .8, -20) +
    qmark(CX - 260, 560, .9 * pop(t, .2)) + tag(CX, 180, 'PARTIE.', t, .8, '#ff6b6b', '#fff', 70),
  sfx: [[.2, 'hmm', .7], [.8, 'el:record', .7], [1.1, 'el:crowd_aww', .5]] });
B(18, { cam: zin(1, 1.05),
  draw: t => { const k1 = seg(t, 0, .9), k2 = seg(t, .9, 1.75), k3 = seg(t, 1.75, 4.4);
    let s = bgBeach(t, { dusk: .55, hotels: 1, sy: 600 });
    const mx = 760 + eInOut(k3) * 900, my = 900 - eInOut(seg(k3, .6, 1)) * 300;
    s += ell(760, 940, 260, 50, SAND_D, 0);
    if (k2 > 0) s += ell(760, 930, 240 * Math.min(1, k2 * 1.2), 60, '#e9c98d', 0);
    s += mom({ x: mx, y: my, s: 1.4, expr: k3 > 0 ? 'cool' : 'calm', walk: k3 > 0 ? 1.4 : 0, flip: 0, fa: k2 > 0 && k3 <= 0 ? wave(t, 4, 40) : undefined }, t);
    if (k1 > 0 && k1 < 1) for (let i = 0; i < 3; i++) s += egg(560, 900 + ((t * 2.5 + i / 3) % 1) * 60, .5, 0, t);
    if (k2 > 0 && k2 < 1) s += sandFlying(560, 930, t, 10);
    if (k3 > .55) s += G(tr(mx, my - 80, 1), path('M0 0q20 -40 40 0', 'none', 6, '#fff'));
    return s + tag(lerp(560, 1300, eInOut(seg(t, 0, 3))), 200, ['PONDU', 'ENTERRÉ', 'BYE !'][k3 > 0 ? 2 : k2 > 0 ? 1 : 0], t, 0, '#fff', OL, 60); },
  sfx: [[0, 'pop', .6], [.3, 'pop', .6], [.6, 'pop', .6], [.9, 'el:dig', .8], [1.75, 'el:patter', .5], [3.2, 'el:splash', .7], [3.6, 'kiss', .6]] });
B(19, { cam: zin(1, 1.06),
  draw: t => bgSand(t, { sy: -100 }) + eggsPile(CX, 980, 14, .9, t, 8) + noSign(620, 420, 1.1, hugIcon(0, 0, 1.1), t, .1) + noSign(1300, 420, 1.1, bottle(0, 0, 1.1), t, .9),
  sfx: [[.1, 'error_beep', .8], [.9, 'error_beep', .8]] });
B(20, { cam: zin(1.02, 1.1),
  draw: t => bgSand(t, { sy: -100 }) + egg(560, 760, 2.4, 0, t, { r: wave(t, 1, 5) }) + bow(500, 660, .85, -20) +
    chatPhone(1250, 560, 2.2, 6, t, { typing: t > .6 && t < 2.2, seen: t > 2.3 }) + (t > 2.4 ? text(1250, 1000, OL, 'Vu ✔', '#fff', 64) : ''),
  sfx: [[.1, 'pop', .7], [.6, 'ding', .7], [2.3, 'el:record', .6], [2.6, 'crickets', .6]] });
B(21, { cam: (t, d) => ({ z: 1.02 + t * .02, cy: 700 }),
  draw: t => { let s = bgSand(t, { sy: 120 }) + eggsPile(CX, 980, 14, .9, t, 9);
    let flags = ''; for (let i = 0; i < 9; i++) flags += path(`M${300 + i * 165} ${230 + Math.sin(i / 8 * Math.PI) * 60}l40 0l-20 60Z`, ['#ff6fa5', '#ffd23f', '#5ec4f0'][i % 3], 4);
    s += path('M260 220Q960 360 1660 220', 'none', 6) + op(seg(t, .1, .4), flags) + bigText(['BIENVENUE !'], t, .2, CX, 420, '#ffd23f', 110);
    return s + (t > 1.6 ? tag(CX, 690, 'INFO ABSURDE N°1', t, 1.7, '#ff6b6b', '#fff', 64) : ''); },
  sfx: [[.2, 'el:applause', .5], [1.7, 'el:hit_cine', .6], [1.75, 'ding', .7]] });
B(22, { cam: zin(1.0, 1.08),
  draw: t => { const lv = .5 + .35 * Math.sin(t * 2.5);
    return sandTop(t, 11) + eggsPile(CX - 200, 800, 12, 1, t, 4) + thermometer(1400, 620, 1.4, lv, lerpColor('#4d9de0', '#ff5d4d', lv)) +
      G(tr(820, 260, 1), sexSym(0, 0, .8 * pop(t, .5), 0, '#4d9de0') + sexSym(260, 0, .8 * pop(t, .8), 1, '#ff6fa5')); },
  sfx: [[.2, 'tick', .7], [.5, 'pop', .8], [.8, 'pop_hi', .8], [1.4, 'magic', .7]] });
B(23, { cam: zin(1.0, 1.06),
  draw: t => bgSand(t, { sy: 280 }) + cloud(500, 120, 1.1, '#e8eef5') + cloud(1300, 150, 1.0, '#e8eef5') +
    rect(-100, 280, W + 200, 900, 'rgba(120,180,255,.25)', 0, 0) + thermometer(260, 700, 1.1, .25, '#4d9de0') +
    turtle({ x: 900, y: 920, s: 1.3, age: 'baby', expr: 'cool', seed: 2 }, t) + turtle({ x: 1350, y: 920, s: 1.1, age: 'baby', expr: 'smug', seed: 4, flip: 1 }, t) + sexSym(1150, 520, .9 * pop(t, .5), 0, '#4d9de0') + tag(CX + 150, 140, 'FRAIS → MÂLES', t, .2, '#4d9de0', '#fff', 64),
  sfx: [[.2, 'el:a_wind', .4], [.5, 'pop', .8], [1, 'whistle', .4]] });
B(24, { cam: zin(1.0, 1.06),
  draw: t => bgSand(t, { sy: 280 }) + rect(-200, -200, W + 400, 480, 'rgba(255,190,90,.45)', 0, 0) + sun(1650, 120, .5, t, 'nice') +
    rect(-100, 280, W + 200, 900, 'rgba(255,120,60,.18)', 0, 0) + thermometer(260, 700, 1.1, .9, '#ff5d4d') +
    turtle({ x: 900, y: 920, s: 1.3, age: 'baby', bow: 1, lashes: 1, expr: 'happy', seed: 2 }, t) + turtle({ x: 1350, y: 920, s: 1.1, age: 'baby', bow: 1, lashes: 1, expr: 'love', seed: 4, flip: 1 }, t) + sexSym(1150, 520, .9 * pop(t, .5), 1, '#ff6fa5') + tag(CX - 100, 140, 'CHAUD → FEMELLES', t, .2, '#ff6fa5', '#fff', 64),
  sfx: [[.1, 'sizzle', .5], [.5, 'pop_hi', .8], [1, 'sparkle', .6]] });
B(25, { cam: zout(1.15, 1.0),
  draw: t => bgSand(t, { sy: 420 }) + sun(1500, 170, .45, t, 'nice') + cloud(500, 160, 1, '#fff') + eggsPile(CX, 950, 16, .9, t, 12) + egg(CX, 700, 1.1, 0, t) + bow(CX - 30, 660, .4, -20),
  sfx: [[0, 'whoosh', .6], [.3, 'hmm', .5]] });
B(26, { cam: zin(1.0, 1.08),
  draw: t => { let s = grad('#5ec4f0', '#bfe9ff', -200, -200, W + 400, H + 400) + rect(160, 140, 1000, 640, '#eaf6ff', 30) + path('M260 600Q420 300 620 440T1060 360', 'none', 10, '#7be07b');
    s += G(tr(420, 300), cloud(0, 0, .8, '#fff', 6)) + sun(900, 330, .38, t, 'nice') + egg(700, 640, 1.2, 0, t) + bow(670, 600, .45, -20) + qmark(700, 470, .6);
    s += sun(1520, 560, .9, t, 'nice') + G(tr(1300, 560, 1, -30 + wave(t, 1, 10)), line(0, 0, -240, 0, 12) + line(0, 0, -240, 0, 6, '#8b5a3c'));
    return s + tag(660, 900, 'MÉTÉO DU SEXE', t, .3, '#ffd23f', OL, 60); },
  sfx: [[0, 'ding', .7], [.4, 'magic', .7], [1.6, 'el:chime', .5]] });
B(27, { cam: (t, d) => ({ z: lerp(1.0, 1.12, eInOut(t / d)), cy: 640 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#2b2238', 0, 0) + `<path d="M${CX - 120} -50L${CX + 120} -50L${CX + 420} 1000L${CX - 420} 1000Z" fill="rgba(255,240,180,.35)"/>` + eggsPile(CX, 1000, 12, .9, t, 14).replace(/#fbf6ea/g, '#6b6278') + egg(CX, 760, 2.2, 0, t, { r: wave(t, 1.2, 6) }) + bow(CX - 70, 660, .8, -20),
  sfx: [[0, 'drum', .8], [.2, 'el:riser', .6]] });
B(28, { flash: 1, cam: zin(1.0, 1.06),
  draw: t => rays(t, CX, CY, '#ffe1ef', '#ffc2dd') + confetti(t, 0, 60) + egg(CX, 620, 3.4, seg(t, .1, .6), t, { bow: 1 }) + sexSym(CX + 420, 420, .9 * pop(t, .4), 1, '#ff6fa5') + bigText(['FÉLICITATIONS !'], t, .9, CX, 980, '#ff6fa5', 100),
  sfx: [[0, 'tada', .9], [.1, 'el:egg_crack', .6], [.9, 'el:applause', .7]] });
B(29, { cam: (t, d) => ({ z: lerp(1, 1.12, t / d) }),
  draw: t => { let s = bgSand(t, { sy: 330, night: 1 }) + rect(-200, -200, W + 400, H + 400, 'rgba(120,0,20,.25)', 0, 0);
    s += op(.75, crab({ x: 500, y: 300, s: .5, angry: 1 }, t).replace(/#ef6a3e/g, '#2b2420')) + op(.75, eagle({ x: 1400, y: 140, s: .4 }, t).replace(/#6b4a2f|#5a3d26|#3f2a1a/g, '#2b2420'));
    return s + egg(CX, 760, 2.4, 0, t, { r: wave(t, 3, 4) }) + bow(CX - 70, 660, .85, -20) + sweat(CX + 160, 600, 1.1) + tag(CX, 980, 'NE MEURS PAS.', t, .6, '#ff4d4d', '#fff', 60); },
  sfx: [[0, 'sting', .9], [.4, 'heartbeat', .7], [1, 'el:crab', .4]] });

// ============================================================
//  ÉCLOSION & COURSE VERS LA MER
// ============================================================
B(30, { cam: zin(1.05, 1.15),
  draw: t => bgSand(t, { sy: -100, night: 1 }) + glow(CX, 560, 400, '#fff6c8', .35) + egg(CX, 600, 4.4, seg(t, .3, 2.6) * .9, t, { bow: 1, r: Math.sin(t * 30) * 3 * (t > .2 ? 1 : 0) }) + (t > .3 ? motionLines(CX + 330, 400, 3, 60, -30) : ''),
  sfx: [[.3, 'el:egg_crack', .9], [1.2, 'crack', .7], [2.0, 'el:egg_crack', .7]] });
function digger(x, y, s, t, o = {}) { return turtle(Object.assign({ age: 'baby', x, y, s, rot: -70, flail: 1, expr: 'pain', seed: x % 5 }, o), t); }
B(31, { cam: zin(1, 1.05),
  draw: t => { let s = bgSand(t, { sy: 150, night: 1 }); for (let i = 0; i < 6; i++) s += digger(380 + i * 240, 840 - t * 120 - (i % 2) * 60, .7, t) + sandFlying(380 + i * 240, 760 - t * 120, t, 4, i); return s + digger(CX, 760 - t * 140, .95, t, { bow: 1, lashes: 1 }); },
  sfx: [[0, 'el:dig', .9], [.6, 'el:dig', .5]] });
B(32, { cam: shk(1.06, 5),
  draw: t => bgSand(t, { sy: -100, night: 1 }) + sandFlying(CX - 250, 500, t, 10, 1) + sandFlying(CX + 250, 500, t, 10, 3) + torF({ x: CX, y: 1130, r: 165, expr: t < .7 ? 'angry' : 'pain', armL: 230 + wave(t, 4, 40), armR: -50 - wave(t, 4, 40) }, t) + (t > .7 ? motionLines(CX, 140, 3, 80, -90) : ''),
  sfx: [[0, 'el:dig', 1], [.1, 'hmm', .8], [.75, 'hmm', .9], [.8, 'scratch', .5]] });
B(33, { cam: zin(1, 1.08),
  draw: t => { const k = seg(t, 0, 5); const pr = k < .8 ? k * .25 : .2 + (k - .8) * 4; return bgSand(t, { sy: 140, night: 1 }) + digger(CX, lerp(900, 420, eInOut(k)), 1.0, t, { bow: 1, lashes: 1 }) + sandFlying(CX, lerp(850, 380, k), t, 6) +
    wallClock(280, 300, 90, t * 40) + meter(1300, 260, 480, 70, clamp(pr), '#ffd23f', 'SURFACE ' + Math.floor(clamp(pr) * 100) + '%') + sweat(CX + 150, lerp(700, 220, k), .9); },
  sfx: [[0, 'clock_fast', .6], [.4, 'el:dig', .7], [2.2, 'hmm', .7], [3.2, 'el:dig', .6], [4.4, 'tick', .7]] });
B(34, { flash: 1, cam: (t, d) => ({ z: 1.04, shake: t < .4 ? 6 : 0 }),
  draw: t => { const k = eOutBack(seg(t, .1, .6)); return sandTop(t, 13).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#c9b08a' : '#a99068') + ell(CX, 560, 260, 120, '#8f7854', 0) + sandFlying(CX, 560, t, 16, 5) +
    G(tr(CX, 560 - k * 40, k), torT({ x: 0, y: 0, s: 2.2 }, t)) + stars(CX, 300, t, 4, 200); },
  sfx: [[.1, 'el:sand_pop', 1], [.2, 'pop', .8], [.6, 'tada', .7]] });
B(35, { cam: (t, d) => ({ z: lerp(1.12, 1.0, eOutCubic(t / d)), cy: 400 }),
  draw: t => rays(t, CX, 380, '#ffd9a8', '#ffc58a') + bgBeach(t, { dusk: .6, hz: 380, sy: 650, sunX: CX, sunY: 330 }).replace(/<defs>.*?<\/rect>/, '') + tor({ x: 560, y: 980, s: 1.5, expr: 'wow', look: [1, -.5] }, t) + stars(560, 520, t, 5, 160),
  sfx: [[0, 'el:wave_crash', .4], [.1, 'el:chime', .9], [.8, 'sparkle', .6]] });
B(36, { cam: zin(1, 1.06),
  draw: t => bgBeach(t, { dusk: .6, sunX: 1700, sunY: 300 }) + path(`M600 880Q1100 760 ${lerp(600, 1700, seg(t, .2, 1.4))} 640`, 'none', 14, '#fff').replace('stroke-linecap', 'stroke-dasharray="30 30" stroke-linecap') + tor({ x: 420, y: 920, s: 1.3, expr: 'happy', walk: .8 }, t) + tag(1500, 280, 'OBJECTIF', t, 1.0, '#7be07b', OL, 56),
  sfx: [[.2, 'whoosh', .7], [1, 'ding', .7]] });
B(37, { cam: zout(1.25, 1.0),
  draw: t => bgBeach(t, { dusk: .6, sy: 500, sunX: 1700, sunY: 280 }) + tor({ x: 260, y: 1000, s: .45, expr: 'happy', walk: .7 }, t) +
    path('M330 920L1700 600', 'none', 8, '#fff') + path('M330 920l40 -40M330 920l55 10M1700 600l-55 -10M1700 600l-40 40', 'none', 8, '#fff') + tag(1060, 700, '≈ 30 m', t, .8, '#fff', OL, 64),
  sfx: [[0, 'whoosh_up', .7], [.8, 'pop', .8]] });
B(38, { cam: zin(1, 1.06),
  draw: t => { const k = t > 1.6; return bgBeach(t, { dusk: .6 }) + torF({ x: k ? 560 : CX, y: 1080, r: 140, expr: k ? 'worried' : 'smug', armR: k ? -20 : -110 + wave(t, 1, 6) }, t) +
    (k ? G(tr(1300, 560, pop(t, 1.7)), line(0, 0, 0, 420, 16) + rect(-260, -130, 520, 220, '#fff', 20) + text(0, -20, 'none', 'MATERNITÉ', '#ff6fa5', 66) + heart(0, 50, .6)) : tag(CX, 180, 'FACILE !', t, .3, '#7be07b', OL, 70)); },
  sfx: [[.3, 'ding', .7], [1.7, 'pop', .8], [2.6, 'el:record', .4]] });
B(39, { flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 300 }),
  draw: t => { let s = bgBeach(t, { dusk: .6, hz: 820, sy: 900, sunX: 300, sunY: 260 });
    s += G(tr(CX, 300, pop(t, .1)), line(-380, 0, -380, 600, 16) + line(380, 0, 380, 600, 16) + rect(-460, -110, 920, 220, '#ffd23f', 24) + text(0, 30, 'none', 'BUFFET À VOLONTÉ', '#e2463a', 76));
    s += eagle({ x: 1550, y: 520, s: .9, expr: 'hungry', bib: 1 }, t) + eagle({ x: 330, y: 560, s: .7, gull: 1, expr: 'happy', flip: 1, bib: 1 }, t);
    s += crab({ x: 760, y: 900, s: .9, bib: 1, fork: 1 }, t) + crab({ x: 1180, y: 910, s: .85, bib: 1, flip: 1, snapF: 8 }, t);
    return s; },
  sfx: [[0, 'kaching', .9], [.2, 'el:crab', .7], [.6, 'el:gull', .6], [1.2, 'chomp', .7]] });
B(40, { cam: zin(1, 1.06),
  draw: t => { let s = sandTop(t, 15); for (const [x, y] of [[400, 300], [1500, 280], [700, 820], [1350, 800]]) s += ell(x, y + 50, 70, 40, '#a88a5c', 0) + crab({ x, y, s: .5, walk: 1, look: Math.sin(t * 2) }, t);
    s += birdShadow(CX + Math.cos(t * 1.4) * 500, 540 + Math.sin(t * 1.4) * 200, 1.2, .25) + birdShadow(CX - Math.cos(t * 1.1) * 400, 540 - Math.sin(t * 1.1) * 260, .9, .2);
    return s + torT({ x: CX, y: 560, s: 1.1, expr: 'scared' }, t); },
  sfx: [[0, 'el:crab_scuttle', .8], [1, 'el:gull', .8], [1.6, 'el:wings', .4]] });
B(41, { cam: zin(1, 1.08),
  draw: t => { let s = bgBeach(t, { dusk: .6 }) + tor({ x: 640, y: 960, s: 1.6, expr: t < 2.2 ? 'smug' : 'embarrassed', hold: '' }, t) + G(tr(880, 790, 1.1, -12), path('M-50 10Q-40 -40 0 -46Q40 -40 50 10L30 0L18 14L0 0L-18 14L-30 0Z', '#fbf6ea'));
    s += G(tr(1300, 560, pop(t, .3), wave(t, .5, 3)), rect(-240, -320, 480, 640, '#fff', 14) + text(0, -230, 'none', 'CV', OL, 80) + rect(-170, -170, 120, 130, '#cfe9ff', 8, 5) + line(-20, -150, 180, -150, 8, '#ccc') + line(-20, -100, 150, -100, 8, '#ccc') +
      text(0, 60, 'none', 'Expérience :', '#555', 44) + (t > 2.0 ? text(0, 150, 'none', 'AUCUNE', '#e2463a', 70) : ''));
    return s + (t > 3.4 ? cricket(1700, 960, .6, t) : ''); },
  sfx: [[.3, 'pop', .8], [2.0, 'el:record', .7], [2.1, 'error_beep', .6], [3.4, 'crickets', .8]] });
B(42, { cam: shk(1.06, 4),
  draw: t => { const k = eOutCubic(seg(t, .2, .7)); return bgBeach(t, { dusk: .6 }) + tor({ x: 380, y: 960, s: .9, expr: 'shock', walk: .8 }, t) +
    sib({ x: 1000 + k * 120, y: 960 - k * 40, s: 1.1, expr: k > .5 ? 'scared' : 'happy', flail: k > .5 ? 1 : 0, rot: -k * 20 }, t) + crab({ x: 1420, y: 960, s: 1.1, snap: k > .6 ? 0 : 1, angry: 1, flip: 0 }, t) + (k > .6 ? impactStar(1180, 820, .5) : ''); },
  sfx: [[0, 'el:crab_scuttle', .6], [.5, 'el:crab', 1], [.55, 'squeak', .8]] });
B(43, { cam: zin(1, 1.05),
  draw: t => { const k = seg(t, .3, 1.6); return bgBeach(t, { dusk: .6 }) + ell(1100, 980, 160, 50, '#8f7854', 0) + G(tr(1100, 960 + k * 140, 1), sib({ x: 0, y: 0, s: 1, expr: 'scared', flail: 1 }, t) + crab({ x: 120, y: 30, s: .7, mouth: 'grin' }, t)).replace('<g transform', `<g clip-path="url(#hole)"><g transform`) .replace(/$/, '</g>') +
    `<defs><clipPath id="hole"><rect x="-200" y="-200" width="${W + 400}" height="1180"/></clipPath></defs>` + sandFlying(1100, 970, t, 12) + (k >= 1 ? G(tr(1100, 900), text(0, 0, OL, 'plop', '#fff', 60)) : '') + tor({ x: 420, y: 960, s: 1, expr: 'cry' }, t); },
  sfx: [[.3, 'el:dig', .7], [1.2, 'gulp', .8], [1.6, 'el:sand_pop', .7], [1.8, 'el:crowd_aww', .4]] });
B(44, { cam: shk(1.05, 4),
  draw: t => { const k = seg(t, .4, 1.2); return bgBeach(t, { dusk: .6, sy: 520 }) + eagle({ x: lerp(1500, 1050, k), y: lerp(-100, 520, eInCubic(k)), s: .8, gull: 1, rot: -40 * (1 - k), talons: 'open', expr: 'angry' }, t) +
    torF({ x: 620, y: 1100, r: 140, expr: 'scared', armL: 220 + wave(t, 3, 20), armR: -40 - wave(t, 3, 20) }, t) + emark(900, 400, .7 * pop(t, .5)); },
  sfx: [[0, 'el:patter', .7], [.4, 'el:dive', 1], [.7, 'el:gull', .8]] });
B(45, { cam: (t, d) => ({ z: 1.05, cy: 300 }),
  draw: t => { const k = seg(t, 0, 1.4); return bgBeach(t, { dusk: .6, hz: 900, sy: 980, sunX: 400, sunY: 250 }) + eagle({ x: lerp(1100, 1700, k), y: lerp(700, 150, k), s: 1.1, gull: 1, expr: 'happy', rot: -15, held: sib({ x: 0, y: 0, s: .7, expr: 'shock', flail: 1, rot: 10 }, t) }, t); },
  sfx: [[0, 'el:wings', .8], [.2, 'el:gull', .9], [.6, 'squeak', .6]] });
B(46, { enter: 'whip', cam: shk(1.06, 6),
  draw: t => { const x = 200 + t * 1500; return sandTop(t, 17) + sandFlying(x - 200, 620, t * 2, 10) + speedLines(t, x, 540, 24, 'rgba(255,255,255,.6)') + motionLines(x - 230, 540, 4, 140, 0) + torT({ x, y: 540, s: 1.5, rot: 90, walk: 7 }, t); },
  sfx: [[0, 'el:patter', 1], [.1, 'whoosh', .9]] });
B(47, { cam: zin(1.0, 1.15),
  draw: t => bgBeach(t, { dusk: .75 }) + rect(-200, -200, W + 400, H + 400, `rgba(20,10,40,${.35 * seg(t, 0, .6)})`, 0, 0) + tor({ x: 900, y: 940, s: 1.6, expr: 'worried', look: [-1, -1] }, t),
  sfx: [[0, 'sting', .7], [.2, 'heartbeat', .8]] });
B(48, { flash: 1, cam: zin(1.0, 1.1),
  draw: t => rays(t, CX, CY, '#3b2a4f', '#4c3763') + eagle({ x: 1100, y: 560, s: 1.6, expr: 'hungry', bib: 1, flap: .8, mouthOpen: .5 + .5 * Math.sin(t * 6) }, t) + fork(520, 640, 1.5, -20) + bigText(['LE RETOUR'], t, .4, 600, 180, '#ffd23f', 100),
  sfx: [[0, 'el:hit_cine', .9], [.2, 'el:eagle2', 1], [1.2, 'el:wings', .6]] });
B(49, { cam: zin(1, 1.05),
  draw: t => { const sx = lerp(-400, W + 400, seg(t, .2, 1.6)); return bgBeach(t, { dusk: .6 }) + birdShadow(sx, 950, 2.8, .35) + tor({ x: 940, y: 960, s: 1.1, expr: 'scared', look: [0, -1] }, t) + rect(-200, -200, W + 400, H + 400, `rgba(0,0,30,${.25 * Math.max(0, 1 - Math.abs(sx - 940) / 600)})`, 0, 0); },
  sfx: [[.2, 'el:wings', .9], [.5, 'whoosh', .8]] });
B(50, { enter: 'whip', cam: shk(1.05, 5),
  draw: t => { const turn = t > .5; return bgBeach(t, { dusk: .6, sy: 520 }) + G(tr(CX, 0, 1) + (turn ? ' scale(-1 1)' : ''), torF({ x: 0, y: 1100, r: 145, expr: 'scared', look: [turn ? 1 : -1, 0], armL: 230, armR: -60 }, t)) + motionLines(turn ? 600 : 1300, 600, 4, 120, turn ? 0 : 180); },
  sfx: [[.45, 'whoosh', 1], [.5, 'squeak', .8]] });
B(51, { cam: (t, d) => ({ z: lerp(1, 1.15, t / d), cy: 450, shake: 4 }),
  draw: t => { const k = seg(t, 0, 1); return bgBeach(t, { dusk: .6, hz: 950, sy: 1020, sunX: 300, sunY: 260 }) + speedLines(t, CX, 400, 24, 'rgba(255,255,255,.5)') + eagle({ x: CX, y: lerp(150, 480, k), s: lerp(.9, 1.7, k), rot: -55, talons: 'open', expr: 'angry' }, t); },
  sfx: [[0, 'el:dive', 1], [.4, 'el:eagle', .8]] });
B(52, { cam: (t, d) => ({ z: lerp(1.0, 1.2, eInOut(t / d)), shake: 3 }),
  draw: t => { const k = eInOut(seg(t, 0, 2)); let s = sandTop(t, 19) + birdShadow(CX, 560, lerp(3, 1.6, k), .4) + torT({ x: CX, y: 560, s: 1.4, expr: 'scared' }, t);
    for (const sd of [-1, 1]) s += G(tr(CX + sd * lerp(500, 200, k), 560, lerp(2.2, 1.4, k), sd * 20), path('M0 -80L0 40', 'none', 40) + path('M0 -80L0 40', 'none', 24, '#ffc93c') + [-40, 0, 40].map(a => G(`rotate(${a + 180})`, path('M0 -40L0 -120Q-10 -150 -30 -150', 'none', 22) + path('M0 -40L0 -110', 'none', 10, '#ffc93c'))).join(''));
    return s; },
  sfx: [[0, 'el:riser', .9], [.4, 'heartbeat', .9], [1.4, 'heartbeat', .9]] });
B(53, { flash: 1, cam: shk(1.08, 12),
  draw: t => { const k = eOutCubic(seg(t, 0, .8)); return bgBeach(t, { dusk: .6 }) + tor({ x: 900, y: 940, s: 1.3, expr: 'shock' }, t) +
    G(tr(lerp(1900, 700, k), 0), path('M0 1200L0 500C0 260 200 140 380 220C470 260 480 380 400 420C340 450 300 400 320 360C200 380 160 500 200 600L700 1200Z', '#4fc3e6') + path('M0 500C0 260 200 140 380 220C470 260 480 380 400 420', 'none', 30, '#fff')) +
    G(tr(lerp(1900, 700, k), 0), sandFlying(200, 600, t, 12).replace(new RegExp(SAND_D, 'g'), '#fff')); },
  sfx: [[0, 'el:wave_crash', 1], [.2, 'el:splash', .6]] });
B(54, { cam: zin(1, 1.06),
  draw: t => { const k = seg(t, 0, 1.2); return bgBeach(t, { dusk: .6 }) + rect(-200, 700, W + 400, 500, 'rgba(255,255,255,.35)', 0, 0) +
    G(tr(lerp(900, 300, k), 760 + wave(t, 1, 20), 1, t * 300), tor({ x: 0, y: 40, s: 1, expr: 'pain' }, t)) +
    eagle({ x: 1250, y: lerp(700, 860, seg(t, .3, .8)), s: 1.1, rot: 70 * seg(t, .3, .8), expr: 'shock', talons: 'grab' }, t) + (t > .8 ? impactStar(1150, 960, .7) + sandFlying(1150, 960, t, 10) : '') + (t > 1.1 ? qmark(1400, 500, .8) : ''); },
  sfx: [[0, 'el:splash', .8], [.8, 'thud', 1], [.85, 'el:eagle', .8], [1.2, 'rimshot', .6]] });
B(55, { cam: zout(1.15, 1.0),
  draw: t => bgBeach(t, { dusk: .75, sy: 900, sunX: CX, sunY: 280 }) + G(tr(CX, 640 + wave(t, .5, 8)), tor({ x: 0, y: 0, s: .9, expr: 'joy', swim: .5 }, t)) + bigText(['JOUR 1 : ✔'], t, .6, CX, 200, '#7be07b', 110),
  sfx: [[0, 'el:a_beach', .4], [.6, 'tada', .8]] });
B(56, { cam: zin(1.02, 1.1),
  draw: t => bgSplit(t, { wl: 600, sky1: '#ffb38a', sky2: '#ffe2c4' }) + torF({ x: 560, y: 900, r: 140, expr: 'deadpan', armL: 200, armR: -10 }, t) + G(tr(1350, 420, pop(t, .2)), rect(-280, -110, 560, 220, '#2b2b33', 26) + text(0, 40, 'none', '00:07 min', '#ff5d4d', 96)),
  sfx: [[.2, 'tick', .8], [.6, 'el:record', .6]] });
B(57, { cam: (t, d) => ({ z: lerp(1, 1.1, t / d), cy: 300 }),
  draw: t => bgUnder(t, { surface: 120 }) + G(tr(CX, 300, 1), op(.9, tor({ x: 0, y: 0, s: 1.4, expr: 'shock', swim: 1 }, t))) + glow(CX, 120, 500, '#fff', .3),
  sfx: [[0, 'el:plunge', 1], [.3, 'el:bubbles', .6]] });
B(58, { cam: zout(1.3, 1.0),
  draw: t => grad('#2a9fd0', '#0f5c8c', -200, -200, W + 400, H + 400) + Array.from({ length: 9 }, (_, i) => path(`M${(i * 260 + t * 30) % (W + 300) - 150} ${120 + (i * 137) % 860}q40 -14 80 0t80 0`, 'none', 5, 'rgba(255,255,255,.3)')).join('') + torT({ x: CX, y: CY, s: .7, swim: 1 }, t),
  sfx: [[0, 'el:bubbles', .7], [.2, 'whoosh_up', .5]] });
