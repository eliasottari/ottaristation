// ============================================================
//  « Pourquoi c'est horrible de naître tortue ? » — 16:9 (1920×1080), 182 blocs BEATFLOW
//  scenes.js = aides + B001–B058 ; scenes_b.js = B059–B121 ; scenes_c.js = B122–B182 (+ BEDS)
// ============================================================
const TOTAL = 422.6;
const BT = [0, 2.41, 4.99, 8.57, 9.53, 11.63, 21.11, 23.37, 25.59, 31.75, 34.95, 37.25, 41.77, 42.93, 44.13, 45.61, 48.05, 50.41, 53.93, 55.53, 58.61, 63.57, 67.91, 70.75, 73.61, 75.71, 79.17, 80.97, 83.61, 85.99, 88.67, 89.61, 91.69, 95.79, 97.79, 101.89, 103.71, 105.83, 109.09, 111.07, 113.61, 119.01, 120.99, 122.47, 124.57, 126.25, 127.31, 127.77, 130.57, 132.49, 133.81, 135.67, 137.75, 139.13, 141.33, 144.75, 146.77, 147.93, 149.05, 152.27, 155.01, 156.07, 160.53, 162.45, 164.65, 168.03, 171.33, 173.19, 174.73, 177.89, 180.01, 183.41, 185.45, 187.25, 190.71, 191.99, 192.97, 194.97, 199.21, 202.89, 204.83, 206.59, 209.35, 213.51, 216.95, 219.43, 221.55, 223.19, 224.95, 230.61, 234.51, 239.39, 241.57, 242.75, 243.97, 246.21, 248.29, 250.57, 252.27, 253.25, 254.55, 255.23, 258.15, 259.75, 261.15, 262.93, 264.81, 267.79, 269.77, 271.59, 273.15, 274.35, 278.15, 279.89, 282.55, 283.85, 286.39, 287.49, 289.49, 290.91, 292.29, 295.39, 296.97, 297.91, 298.99, 300.11, 301.79, 303.13, 304.33, 307.19, 309.47, 313.75, 319.71, 322.79, 323.99, 325.17, 327.57, 328.87, 331.75, 333.63, 336.17, 338.03, 344.67, 347.29, 348.55, 351.05, 353.11, 354.83, 357.45, 359.17, 360.53, 362.49, 367.13, 369.35, 370.21, 371.87, 373.43, 375.87, 377.55, 379.61, 381.81, 383.27, 384.55, 385.91, 387.23, 389.75, 392.11, 393.25, 394.53, 396.55, 398.33, 399.05, 401.27, 403.33, 405.41, 406.87, 408.43, 409.17, 410.75, 411.67, 415.13, 417.99, 422.01];
const SCENES = [];
// mots de la voix (reconnaissance vocale : [début, fin, mot]) -> caler les actions sur les mots
const _norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/œ/g, 'oe').replace(/[^a-z0-9]/g, '');
// at(n, 'mot', k) = temps (relatif au début du bloc n) du k-ième mot qui commence par 'mot' dans le bloc
function at(n, word, k = 1) {
  const a = BT[n - 1] - .3, b = BT[n] + .3, q = _norm(word);
  for (const [s, e, w] of WORDS) if (s >= a && s <= b && _norm(w).startsWith(q) && --k === 0) return +(s - BT[n - 1]).toFixed(2);
  console.error('at(): mot introuvable', n, word); return 0;
}
// durée d'un bloc
const dur = n => BT[n] - BT[n - 1];

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

// sol vu de dessus (plongée)
function sandTop(t, seed = 6) { let s = grad('#f5ddb0', '#e8c68c', -900, -900, W + 1800, H + 1800); const r = rng(seed); for (let i = 0; i < 90; i++) s += ell(-400 + r() * (W + 800), -300 + r() * (H + 600), 5 + r() * 10, 3 + r() * 6, SAND_W, 0); for (let i = 0; i < 6; i++) s += ell(r() * W, r() * H, 26, 18, '#fff4dc', 4, '#d6b27a'); return s; }
// tong géante (présent : plage fréquentée)
function flipFlop(x, y, s = 1, r = 0, c = '#ff6f91') { return G(tr(x, y, s, r), path('M-90 -260C-130 -200 -130 160 -80 230C-30 290 60 290 90 220C130 140 130 -200 90 -260C50 -310 -50 -310 -90 -260Z', c) + path('M0 -170L-80 -40M0 -170L80 -40', 'none', 22, '#3a6fd8') + circ(0, -170, 14, '#3a6fd8', 5)); }
// trompette de fête
function partyHorn(x, y, s = 1, r = 0, k = 1) { return G(tr(x, y, s, r), path('M0 -18L120 -40L120 40L0 18Z', '#ffd23f') + path('M20 -14L40 14M60 -24L80 24M100 -32L110 30', 'none', 6, '#ff6fa5') + (k > 0 ? path(`M120 0q${40 * k} -40 ${80 * k} 0t${80 * k} 0`, 'none', 14, '#5ec4f0') : '')); }
// caméras composées
const camHand = (z = 1.05, a = 1) => () => ({ z, hand: a });
const camPush = (a = 1, b = 1.15, hand = .6) => (t, d) => ({ z: lerp(a, b, eInOut(clamp(t / d))), hand });

// ============================================================
//  ACCROCHE — l'aigle (version ciné : profondeur, épaule, POV, réactions XXL)
// ============================================================
// B001 — grue qui descend du ciel vers la plage, titre
B(1, { enter: 'none', cam: () => ({ z: 1, hand: .3 }),
  draw: (t, d) => { const c = camMove(t, d, { y: -380, zoom: 1.0 }, { y: 0, zoom: 1.12 }, eOutCubic);
    return depth(c, [...beachLayers(t, { hotels: 1 }),
      { z: 3.2, svg: eagle({ x: 1500 - t * 120, y: 300, s: .35, expr: 'starving', flap: 2 }, t), haze: .25 },
      { z: 1, svg: birdShadow(1000 - t * 140, 810, 1, .2) + tor({ x: 900, y: 800, s: .75, expr: 'ecstatic', walk: .8 }, t) },
      { z: .45, svg: fgGrass(120, 1180, 1.6, t) + fgDune(1750, 1000, 900, 300) + fgShell(1500, 1120, 1.2, 20), blur: 9 }]) + title(t); },
  sfx: [[0, 'el:gull', .7], [.05, 'whoosh', .8], [.4, 'el:hit_cine', .7], [1.6, 'el:eagle', .5]] });
// B002 — gros plan caméra épaule : extase totale, puis une ombre tombe sur son visage
B(2, { cam: camPush(1.02, 1.12, .8),
  draw: (t, d) => { const sh = seg(t, 1.9, 2.4);
    return depth({ x: wave(t, .2, 40), zoom: 1 }, [
      { z: 5, svg: rays(t, CX, 300, '#d8f3ff', '#bfe9ff', 24) },
      { z: 2.5, svg: beachParts(t, { hz: 330, sy: 520 }).sea, blur: 3 },
      { z: 1.6, svg: beachParts(t, { hz: 330, sy: 520 }).sand, blur: 2 },
      { z: 1, svg: torF({ x: CX, y: 890, r: 165, expr: sh > .5 ? 'shock' : 'ecstatic', armL: 230 + wave(t, 2, 25), armR: -50 - wave(t, 2, 25), headTilt: wave(t, 1, 8) }, t) + stars(CX, 260, t, 8, 340) +
        G(tr(1450 + wave(t, .4, 80), 330 + wave(t, .7, 40), 1, wave(t, 3, 20)), path('M0 0C-30 -40 -70 -20 -60 10C-50 30 -20 20 0 0C20 20 50 30 60 10C70 -20 30 -40 0 0Z', '#ffb3e6', 5)) + heart(500, 300 - t * 60, .8) + heart(1400, 650 - t * 50, .6) },
      { z: .5, svg: fgShell(220, 1000, 1.6, -20) + fgGrass(1800, 1150, 1.4, t), blur: 10 }]) +
      rect(-200, -200, W + 400, H + 400, `rgba(20,10,30,${.5 * sh})`, 0, 0); },
  sfx: [[0, 'el:chime', .8], [.4, 'el:baby_squeak', .8], [1.0, 'sparkle', .7], [1.9, 'el:wings', .7], [2.1, 'sting', .5]] });
// B003a — POV de l'aigle : il repère sa proie, le viseur verrouille
B(3, { enter: 'crash', cam: (t, d) => ({ z: lerp(1, 1.35, eInOut(t / d)), cx: 960, cy: 640, hand: .6 }),
  overlay: t => povEagle(t, 960, 640, seg(t, .1, 1.2)),
  draw: t => sandTop(t, 3) + ell(960, 700, 70, 26, 'rgba(0,0,0,.15)', 0) + torT({ x: 960, y: 640, s: .6, walk: .6 }, t) + Array.from({ length: 4 }, (_, i) => crab({ x: 300 + i * 450, y: 250 + (i % 2) * 600, s: .25 }, t)).join(''),
  sfx: [[0, 'el:eagle', .7], [.3, 'el:riser', .5], [1.2, 'ding', .6]] });
// B003b — contre-plongée XXL : l'aigle affamé, bavoir, fourchette & couteau, bave à flots
B(3, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.12, t / d), cy: 380, shake: 3, bars: 1 }),
  draw: t => depth({ y: -wave(t, .3, 30), zoom: 1 }, [
    { z: 6, svg: grad('#ffb38a', '#8fd3ff', -900, -900, W + 1800, H + 1800) + glow(400, 200, 400, '#fff3b0', .6) },
    { z: 3, svg: cloud(300, 250, 1.4) + cloud(1600, 150, 1.2), haze: .2 },
    { z: 1, svg: speedLines(t * .4, CX, 300, 20, 'rgba(255,255,255,.35)') + eagleFront({ x: CX, y: 600 + wave(t, .5, 15), s: 1.25, expr: 'starving', bib: 1, flap: 1.6 }, t) +
      fork(380, 520, 1.6, -25 + wave(t, 1.5, 10)) + knife(1540, 520, 1.6, 25 - wave(t, 1.5, 10)) + G(tr(1520, 180, pop(t, .5), 10), text(0, 0, OL, 'GRRR', '#fff', 80)) },
    { z: .55, svg: fgGrass(200, 1150, 1.8, t) + fgGrass(1750, 1180, 1.6, t, '#5f8a35', 5), blur: 8 }]),
  sfx: [[0, 'el:eagle2', 1], [.2, 'el:wings', .8], [.5, 'growl', .9], [1.3, 'el:munch', .5], [1.6, 'gulp', .6]] }, at(3, 'que'));
// B004 — plongée : elle détale, jambes en hélice, l'ombre grossit derrière
B(4, { enter: 'crash', cam: () => ({ z: 1.08, shake: 6, hand: 1 }),
  draw: t => { const x = 260 + t * 1100;
    return depth({ x: t * 200, zoom: 1 }, [{ z: 1, svg: sandTop(t, 21) + birdShadow(x - 300 + t * 200, 560, 1.4 + t * 1.2, .3) + sandFlying(x - 120, 640, t * 2, 10) + motionLines(x - 220, 540, 4, 160, 0) + heroTopRun(x, 540, t) },
      { z: .5, svg: fgShell(1700, 200, 1.4, 30) + fgRock(200, 980, 1.2), blur: 8 }]) + streaks(t, 1, 10); },
  sfx: [[0, 'el:patter', 1], [.05, 'whoosh', .9], [.3, 'el:wings', .6], [.6, 'squeak', .6]] });
function heroTopRun(x, y, t) { return torT({ x, y, s: 1.3, rot: 90, walk: 9, expr: 'terror' }, t) + G(tr(x + 120, y - 90), sweat(0, 0, .8) + sweat(40, 60, .6)); }
// B005 — « tu fais ce que tu peux » : ralenti ridicule, langue tirée ; un crabe la double en marchant en arrière avec son téléphone
B(5, { enter: 'none', cam: (t, d) => ({ z: 1.05, hand: .5 }),
  draw: t => depth({ x: t * 30, zoom: 1.05 }, [...beachLayers(t, { hotels: 1 }),
    { z: 1, svg: tor({ x: 760 + t * 25, y: 780, s: 1.8, expr: 'effort', face: { mouth: 'tongue' }, walk: .35, headTilt: 10, tremble: .3 }, t) + sweat(1180, 500, 1.2) + sweat(1230, 580, .8) + G(tr(1240, 400), text(0, 0, OL, 'pff…', '#fff', 60)) +
      crab({ x: 100 + t * 700, y: 860, s: .7, walk: 2, mouth: 'smile', flip: 1 }, t) + G(tr(100 + t * 700 + 70, 740, 1, -15), phone(0, 0, .3)) },
    { z: .5, svg: fgGrass(1800, 1180, 1.6, t), blur: 9 }]),
  sfx: [[0, 'el:record', .8], [.2, 'hmm', .9], [.5, 'el:crab_scuttle', .6], [.9, 'el:patter', .3]] });
// B006a — macro au ras du sol : elle est minuscule ; une tong géante s'écrase à côté
B(6, { enter: 'tilt', cam: (t, d) => ({ z: 1.04, hand: .5, shake: t > 1.3 && t < 1.6 ? 14 : 0 }),
  draw: t => { const f = eOutCubic(seg(t, 1.0, 1.35));
    return depth({ zoom: 1 }, [{ z: 5, svg: beachParts(t, { hz: 500, sy: 620 }).sky, blur: 4 }, { z: 2.5, svg: beachParts(t, { hz: 500, sy: 620 }).sea, blur: 5 },
      { z: 1, svg: beachParts(t, { hz: 500, sy: 620 }).sand + Array.from({ length: 14 }, (_, i) => circ(200 + i * 120, 980 + (i % 3) * 30, 14 + (i % 4) * 6, SAND_D, 4)).join('') +
        tor({ x: 900, y: 760, s: 1.1, expr: f > .9 ? 'terror' : 'confused', look: [0, -1], tremble: f > .9 ? 1 : 0 }, t) + ruler(700, 790, 420, '', t, .2) + tag(910, 380, '≈ 5 cm', t, .6, '#ffd23f', OL, 70) + G(tr(1450, lerp(-500, 700, f), 1, -8), flipFlop(0, 0, 1.6)) + (f >= 1 ? shockRing(1450, 880, t, 1.35, '#fff') + sandFlying(1300, 860, t, 12) : '') },
      { z: .45, svg: fgShell(200, 1100, 1.8, 10), blur: 10 }]); },
  sfx: [[0, 'pop', .8], [.3, 'tick', .7], [1.0, 'whoosh', .8], [1.32, 'thud', 1], [1.4, 'el:crowd_gasp', .5]] });
// B006b — insert sur les nageoires-cuillères qui moulinent + vraie cuillère qui brille
B(6, { enter: 'whip', cam: camHand(1.08, .9),
  draw: t => rays(t, CX, CY, '#fff3d9', '#ffe2a8', 22) + G(tr(560, 640, 2.6, -10), G(tr(0, 0, 1, wave(t, 4, 45)), flipper(70, 30, T_BABY_SKIN, true)) + G(tr(-20, 40, 1, 20 - wave(t, 4, 45)), flipper(70, 30, T_BABY_SKIN, true))) +
    motionLines(560, 420, 3, 70, -90) + text(CX, 560, OL, '=', '#fff', 170) + G(tr(1380, 600, pop(t, .5), -20), spoon(0, 0, 2.2)) + sparkle(1420, 520, pop(t, .9) * .8, '#fff') + G(tr(CX, 330, pop(t, 1.2)), text(0, 0, OL, 'des cuillères…', '#fff', 70)),
  sfx: [[0, 'whoosh', .8], [.2, 'el:patter', .5], [.5, 'ding', .8], [.9, 'glint', .7], [1.4, 'boing', .6]] }, at(6, 'tes'));
// B006c — POV de la tortue : on lève les yeux… l'aigle fond sur la caméra
B(6, { enter: 'none', cam: (t, d) => ({ z: 1.0, hand: 1.2 }), overlay: t => povEyes(t, [.25, .85]),
  draw: (t, d) => { const k = eInCubic(seg(t, 0, 1.15)); return grad('#7ccaff', '#e7f6ff', -200, -200, W + 400, H + 400) + glow(1500, 200, 500, '#fff3b0', .6) + cloud(400, 200, 1.4) + cloud(1500, 700, 1.1) +
    eagleFront({ x: CX + 100 * (1 - k), y: lerp(380, 560, k), s: lerp(.25, 2.4, k), expr: 'starving', talons: 1 }, t); },
  sfx: [[0, 'el:dive', 1], [.4, 'el:eagle', .9], [.8, 'heartbeat', .7]] }, at(6, 'et'));
// B006d — serres XXL puis le fantasme : elle devient un nugget trempé dans la sauce
B(6, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .6, bars: t < 1.1 ? 1 : 0 }),
  draw: t => { if (t < 1.1) { const o = seg(t, .1, .7); return rect(-200, -200, W + 400, H + 400, '#ffd9a0', 0, 0) + rays(t, CX, CY, '#ffd9a0', '#ffc070', 18) +
      G(tr(CX, 500, 2.6), [-50, 0, 50].map(a => G(`rotate(${a * (.4 + o * .9) + 90})`, path('M0 0L60 0Q86 6 90 34', 'none', 26) + path('M0 0L60 0', 'none', 12, '#ffc93c'))).join('') + line(0, -200, 0, 0, 40) + line(0, -200, 0, 0, 22, '#ffc93c')) + G(tr(1450, 300, pop(t, .5)), text(0, 0, OL, 'CLAC', '#fff', 90)); }
    const k = t - 1.1, dip = Math.max(0, Math.sin(k * 2.2)) ;
    return rays(t, CX, CY, '#ffe9a8', '#ffd36b', 22) + G(tr(1300, 560), eagle({ x: 0, y: 0, s: 1.3, expr: 'starving', bib: 1, wingA: -20, mouthOpen: .6 + .4 * Math.sin(t * 8) }, t)) +
      sauce(680, 900, 2) + G(tr(700, lerp(420, 760, dip), 1, -10), line(0, -320, 0, -60, 16) + line(0, -320, 0, -60, 8, '#cfd6dc') + nugget(0, 0, 1.6, 0) + G(tr(0, -10), torF({ x: 0, y: 60, r: 55, expr: 'terror', armL: 220, armR: -40, tremble: 1 }, t))) +
      G(tr(700, 300, pop(t, 1.3)), text(0, 0, OL, 'NUGGET', '#ffd23f', 90)); },
  sfx: [[0, 'el:hit_cine', .7], [.3, 'snip', .8], [.5, 'chomp', .8], [1.1, 'pop', .8], [1.6, 'el:splash', .4], [2.2, 'el:munch', .7], [2.8, 'growl', .6]] }, at(6, 'avec'));
// B007 — elle essaie de rentrer la tête : pousse sur son visage, se fait pipi dessus de peur
B(7, { cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .8, shake: t > .9 ? 3 : 0 }),
  draw: t => { const k = eInOut(seg(t, .2, 1.1));
    return depth({ x: wave(t, .3, 20), zoom: 1 }, [...beachLayers(t, { hotels: 1 }),
      { z: 1, svg: birdShadow(900, 780, 2 + t * .4, .25 + t * .05) + tor({ x: 900, y: 760, s: 1.9, expr: k > .4 ? 'terror' : 'panic', neck: 1 - k * .7, squash: k * .35, tremble: 1, pee: seg(t, .9, 2.2) }, t) + (k > .5 ? motionLines(1320, 640, 3, 80, 200) + G(tr(1350, 360), text(0, 0, OL, 'RENTRE !!', '#fff', 64)) : '') },
      { z: .5, svg: fgGrass(150, 1180, 1.6, t), blur: 9 }]); },
  sfx: [[.1, 'squeak', .8], [.4, 'hmm', .9], [.9, 'el:struggle', .4], [1.1, 'spray', .3], [1.4, 'el:crowd_aww', .4]] });
// B008 — CRASH ZOOM « SURPRISE ! » : yeux exorbités, mâchoire au sol, trompette de fête
B(8, { enter: 'none', cam: (t, d) => t < at(8, 'surprise') ? { z: lerp(1.0, 1.25, t / at(8, 'surprise')), hand: .4 } : { z: 1.08, shake: 7 },
  overlay: t => op(1 - seg(t, at(8, 'surprise'), at(8, 'surprise') + .2), t >= at(8, 'surprise') ? `<rect width="${W}" height="${H}" fill="#fff"/>` : ''),
  draw: t => { const S = at(8, 'surprise');
    if (t < S) return rect(-200, -200, W + 400, H + 400, '#2b2238', 0, 0) + `<path d="M${CX - 160} -50L${CX + 160} -50L${CX + 520} 1200L${CX - 520} 1200Z" fill="rgba(255,240,180,.25)"/>` + torF({ x: CX, y: 930, r: 170, expr: 'worried', look: [Math.sin(t * 3), 0], armL: 200, armR: -20 }, t);
    return rays(t, CX, CY, '#ffe066', '#ffb703', 26) + confetti(t, S, 70) + torF({ x: CX, y: 940, r: 165, expr: 'jawdrop', neck: .3, armL: 230, armR: -50 }, t) +
      partyHorn(1350, 420, 1.4, -20, seg(t, S + .1, S + .4)) + partyHorn(560, 420, 1.4, 200, seg(t, S + .2, S + .5)) + bigText(['SURPRISE !'], t, S, CX, 150, '#ff6fa5', 160); },
  sfx: [[0, 'drum', .6], [.2, 'el:riser', .5], [at(8, 'surprise') - .05, 'el:hit_cine', .9], [at(8, 'surprise'), 'tada', .9], [at(8, 'surprise') + .05, 'whistle', .6], [at(8, 'surprise') + .1, 'el:crowd_gasp', .5]] });
// B009 — contre-plongée en 2 temps : la tortue terrestre se range pépère (« NE PAS DÉRANGER »), la marine reste coincée
B(9, { cam: (t, d) => ({ z: 1.04, cy: 700, hand: .5 }),
  draw: t => { const T2 = at(9, 'les'), T3 = at(9, 'rentrer'); const k = eInOut(seg(t, .5, 1.4)); const k2 = eInOut(seg(t, T3 - .3, T3 + .7));
    if (t < T2 - .1) return grad('#bfe9ff', '#f3fbff', -200, -200, W + 400, H + 400) + rect(-200, 860, W + 400, 400, '#b9d98a', 0, 0) + fgGrass(300, 900, 1, t) + fgGrass(1600, 900, 1.2, t) +
      turtle({ x: 960, y: 900, s: 2.2, age: 'adult', shell: '#9c7444', shellL: '#c49a62', skin: '#c9b27a', expr: k > .9 ? 'smugger' : 'smug', neck: 1 - k, headBehind: 1, seed: 7, dome: 1.45 }, t) +
      (k > .9 ? G(tr(1240, 640, pop(t, 1.5), 8), line(0, 0, 0, 140, 8) + rect(-120, -50, 240, 100, '#fff', 12) + text(0, 12, 'none', 'NE PAS', OL, 32) + text(0, 44, 'none', 'DÉRANGER', OL, 32)) : '') + tag(960, 140, 'TORTUE TERRESTRE', t, .1, '#c49a62', '#fff', 60);
    return depth({ zoom: 1 }, [...beachLayers(t, { hz: 600, sy: 760 }), { z: 1, svg: tor({ x: 960, y: 780, s: 2.3, expr: k2 > .5 ? 'panic' : 'effort', neck: 1 - k2 * .55, squash: k2 * .35, tremble: k2 }, t) + (k2 > .6 ? impactStar(1180, 520, .5) : '') + cross(1500, 400, 1, t, T3 + .8) + tag(960, 140, 'TORTUE MARINE', t, T2, SEA, '#fff', 60) }]); },
  sfx: [[.1, 'pop', .8], [.6, 'squeak', .6], [1.4, 'slot', .3], [1.5, 'ding', .8], [at(9, 'les') - .1, 'whoosh', .8], [at(9, 'rentrer') - .2, 'hmm', .9], [at(9, 'rentrer') + .3, 'el:struggle', .5], [at(9, 'rentrer') + .8, 'error_beep', .8]] });
// B010 — plongée héroïque : la carapace brille comme une armure (chœur épique)
B(10, { cam: (t, d) => ({ z: lerp(1.25, 1.0, eOutCubic(t / d)), r: lerp(-6, 0, t / d) }),
  draw: t => { const gx = lerp(-400, 400, seg(t, .5, 1.6)); return rays(t, CX, 560, '#fff6d6', '#ffe9a0', 28) + glow(CX, 560, 600, '#fff', .5) + torT({ x: CX, y: 580, s: 2.8 }, t) +
    `<path d="M${CX + gx - 60} 260L${CX + gx + 30} 260L${CX + gx - 120} 900L${CX + gx - 210} 900Z" fill="rgba(255,255,255,.75)"/>` + sparkle(CX + 200, 380, pop(t, 1.4), '#fff') + sparkle(CX - 180, 760, .7 * pop(t, 1.7), '#fff') +
    tag(CX, 120, 'ARMURE LÉGENDAIRE', t, 1.0, '#cfd6dc', OL, 64) + G(tr(1550, 330, pop(t, 2)), path('M0 -90L80 -60L70 40Q40 90 0 110Q-40 90 -70 40L-80 -60Z', '#cfd6dc') + path('M0 -60L0 80M-50 0L50 0', 'none', 8, '#8a96a3')); },
  sfx: [[0, 'el:hit_cine', .5], [.3, 'angel', .8], [.5, 'glint', .9], [1.4, 'sparkle', .8], [2, 'hammer', .5]] });
// B011 — elle plonge dans sa carapace… BONK contre le bord, étoiles ; au fond (flou) l'aigle se tord de rire
B(11, { enter: 'whip', cam: (t, d) => ({ z: 1.06, hand: .7, shake: t > .7 && t < 1 ? 10 : 0 }),
  draw: t => { const b = t > .7;
    return depth({ zoom: 1 }, [...beachLayers(t, { hotels: 1 }), { z: 2.2, svg: eagle({ x: 1550, y: 420, s: 1, expr: 'happy', wingA: -40 + wave(t, 4, 20), mouthOpen: .8 }, t) + G(tr(1500, 250), text(0, 0, OL, 'HA HA HA', '#fff', 60)), blur: 4 },
      { z: 1, svg: tor({ x: 820, y: 770, s: 2, expr: b ? 'dizzy' : 'effort', neck: b ? .15 : lerp(1, .4, t / .7), squash: b ? .3 : 0, headDy: b ? 0 : 0 }, t) + (b ? impactStar(1080, 570, .6) + stars(1060, 430, t, 5, 120) : '') }]); },
  sfx: [[.1, 'whoosh', .7], [.7, 'thud', 1], [.75, 'boing', .7], [1.0, 'el:eagle', .5], [1.2, 'rimshot', .6]] });
// B012 — arrêt sur image (« oui, c'est moi ») puis rembobinage VHS
B(12, { enter: 'none', cam: (t, d) => ({ z: t < at(12, 'parce') ? 1.1 : 1.0 }), overlay: t => (t > at(12, 'parce') && t < at(12, 'parce') + 1.8 ? vhs(t) : ''),
  draw: t => { const P = at(12, 'parce'); if (t < P) return beachParts(0.3, { hotels: 1 }).sky + beachParts(.3, {}).sea + beachParts(.3, {}).sand + eagle({ x: 1150, y: 520, s: 1.4, expr: 'starving', talons: 'open' }, .3) + tor({ x: 900, y: 800, s: 1.7, expr: 'terror', rot: -15 }, .3) +
      rect(-200, -200, W + 400, H + 400, 'rgba(255,240,200,.25)', 0, 0) + G(tr(560, 260, 1, -6), rect(-300, -70, 600, 140, '#fff', 14) + text(0, 22, 'none', 'Oui. C\'est moi.', OL, 60));
    const k = seg(t, P, P + 2.2); return beachParts(t, { hotels: 1, dusk: k * .6 }).sky + beachParts(t, {}).sea + beachParts(t, {}).sand + tor({ x: 900 - (t - P) * 400, y: 800, s: 1.4, expr: 'shock', walk: -3 }, t) + eagle({ x: 1150 + (t - P) * 600, y: 640 - (t - P) * 300, s: 1.4, expr: 'starving' }, t); },
  sfx: [[0, 'el:record', 1], [at(12, 'parce'), 'rewind', .9], [at(12, 'parce') + .05, 'el:time_pass', .7]] });
