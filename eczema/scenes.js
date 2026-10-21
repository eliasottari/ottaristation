// ============================================================
//  « Pourquoi c'est horrible d'avoir de l'eczéma ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Moteur : lib.js · cine.js · motion.js · decor.js (décors riches, kevin, kid, adult, aides : NE PAS les redéclarer).
//  Ton : bienveillant — on rit de la situation (la peau qui fait grève, la boucle infernale), jamais de la personne.
// ============================================================
const SCENES = [];
function B(n, o, off = 0) { o.s = +(BT[n - 1] + off).toFixed(3); o.n = n; SCENES.push(o); return o; }
const _norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
// at(n, 'mot', k) : temps (relatif au début du bloc n) du k-ième mot qui commence par 'mot'
function at(n, word, k = 1) {
  const a = BT[n - 1] - .3, b = BT[n] + .3, q = _norm(word);
  for (const [s, e, w] of WORDS) if (s >= a && s <= b && _norm(w).startsWith(q) && --k === 0) return +(s - BT[n - 1]).toFixed(2);
  console.error('at(): mot introuvable', n, word); return 0;
}
const dur = n => +(BT[n] - BT[n - 1]).toFixed(2);
const CX = W / 2;

// ---------- SIZEX fun : accent FUCHSIA « crème apaisante / plaques », jaune marqueur ----------
sxFun('#c53a9d'); SX.acc2 = '#ffd23f'; SX.cool = '#8fe0c0';

// ============================================================
//  LE HÉROS porte le sujet : plaques rouges cartoon (joue, tempe, bras), démangeaisons (zigzags), t-shirt manches courtes
// ============================================================
const HAIR_E = '#5a3a26', SHIRT_E = '#8fd6b4', PANTS_E = '#3b4a6b', WOOL = '#c9584a';
const PLQ = '#e65c6a', PLQ2 = '#c13e4e';
// plaque d'eczéma (tache rouge irrégulière + grain) ; k > 1 = enflammée (halo)
function plaque(x, y, s, k = 1, seed = 1, rot = 0) { if (k <= 0) return ''; const r = rng(seed); let g = k > 1 ? op(clamp(k - 1) * (.7 + .3 * Math.sin(seed + k * 9)), circ(0, 0, 62, 'rgba(255,60,80,.35)', 0)) : '';
  for (let i = 0; i < 5; i++) { const a = r() * 6.28, d = r() * 18; g += ell(Math.cos(a) * d, Math.sin(a) * d * .6, 15 + r() * 12, 10 + r() * 7, PLQ, 0); }
  for (let i = 0; i < 7; i++) g += circ((r() - .5) * 46, (r() - .5) * 24, 2.5 + r() * 2.5, PLQ2, 0);
  return op(.55 + .45 * clamp(k), G(tr(x, y, s * (.75 + .25 * clamp(k)), rot), g)); }
// démangeaison : zigzags rouges qui vibrent + petite étincelle
function itchFx(x, y, t, s = 1) { let g = ''; for (let i = 0; i < 3; i++) { const a = -45 + i * 45, j = Math.sin(t * 34 + i * 2) * 5; g += G(tr(Math.cos(R(a - 90)) * 70, Math.sin(R(a - 90)) * 70 + j, 1, a), path('M0 -24l12 8l-12 8l12 8l-12 8', 'none', 7, PLQ2)); }
  return G(tr(x, y, s), g + (Math.sin(t * 13) > 0 ? sparkle(-62, -30, .3, '#fff') : sparkle(62, -40, .3, '#fff'))); }
const eczHair = (r, t, o) => { const [b, f] = hairSvg('curly', o.hairColor || HAIR_E, r, t), k = o.plq ?? 1;
  return [b, plaque(-r * .5, r * .42, r / 100 * .85, k, 7, -10) + plaque(r * .66, -r * .12, r / 100 * .5, k, 9, 25) + f + (o.scrF ? itchFx(r * .7, -r * .3, t, r / 100 * .8) : '')]; };
// position épaules / coudes / mains (même géométrie que person() pour un enfant)
function eczArmPts(o, t) { const A = AGE.kid, bob = (o.bob ?? 1) * wave(t, .8, 4, o.seed || 0), shY = -A.legL - A.bodyH + bob + 26, bt = A.bodyTop / 2;
  return [[-bt - 10, o.armL || [110, 100]], [bt + 10, o.armR || [70, 80]]].map(([sx, a]) => { const ex = sx + Math.cos(R(a[0])) * A.upper, ey = shY + Math.sin(R(a[0])) * A.upper; return { sx, sy: shY, ex, ey, hx: ex + Math.cos(R(a[1])) * A.lower, hy: ey + Math.sin(R(a[1])) * A.lower }; }); }
const mitt = (x, y, a) => G(tr(x, y, 1, a + 90), path('M-34 -10Q-40 -70 0 -74Q40 -70 34 -10L30 30L-30 30Z', '#ff8fb1', 6) + path('M-34 -30Q-60 -40 -58 -10Q-50 10 -32 4', '#ff8fb1', 6) + rect(-36, 22, 72, 22, '#fff', 8, 5) + circ(-8, -40, 5, '#fff', 0) + circ(12, -24, 5, '#fff', 0));
function ecz(o, t) { o = Object.assign({ age: 'kid', hairFn: eczHair, shirt: SHIRT_E, pants: PANTS_E, seed: 2 }, o); if (o.wool) o.shirt = WOOL; o.sleeve = o.wool ? WOOL : SKIN;
  const P = eczArmPts(o, t), k = o.plq ?? 1; let ov = '';
  if (!o.wool) P.forEach((p, i) => { ov += circ(p.sx, p.sy + 8, 25, o.shirt, 5) + plaque(lerp(p.ex, p.hx, .45), lerp(p.ey, p.hy, .45), .5, k, 11 + i) + plaque(lerp(p.sx, p.ex, .7), lerp(p.sy, p.ey, .7), .38, k, 21 + i); });
  else { const A = AGE.kid, top = -A.legL - A.bodyH; for (let i = 0; i < 4; i++) ov += path(`M-34 ${top + 40 + i * 30}l17 12l17 -12l17 12l17 -12`, 'none', 5, shade(WOOL, -.25)); for (let i = 0; i < 9; i++) { const yy = top + 20 + i * 17; ov += line(-82 - i * 1.5, yy, -100 - i * 1.5, yy - 8, 4) + line(82 + i * 1.5, yy, 100 + i * 1.5, yy - 8, 4); } ov += itchFx(0, top - 10, t, .9); }
  if (o.scr) ov += itchFx(lerp(P[0].ex, P[0].hx, .5), P[0].ey - 30, t, .9);
  if (o.mitts) ov += mitt(P[0].hx, P[0].hy, o.armL ? o.armL[1] : 100) + mitt(P[1].hx, P[1].hy, o.armR ? o.armR[1] : 80);
  return person(o, t) + G(ptr(o), ov); }
const eczHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: eczHair, seed: 2 }, o), t));
// poses : gratter l'avant-bras gauche (main droite qui frotte) / gratter la joue
const SCR = (t, sp = 34) => ({ armL: [70, -20], armR: [150 + 6 * Math.sin(t * sp), 180 + 18 * Math.sin(t * sp + 1)], scr: 1 });
const SCRF = (t, sp = 34) => ({ armR: [-60 + 8 * Math.sin(t * sp), -120 + 16 * Math.sin(t * sp + 1)], scrF: 1 });

// ---------- gros plan avant-bras (plaques, main qui gratte, pancartes de grève, feu de l'inflammation) ----------
function picket(x, y, s, str, t, t0 = 0, col = '#e2463a') { const k = pop(t, t0, .35); if (k <= 0) return ''; const b = Math.abs(Math.sin(t * 8 + x)) * 12;
  return G(tr(x, y - b, s * k, Math.sin(t * 6 + x) * 6), line(0, 10, 0, -150, 8, '#8a5a3a') + rect(-90, -235, 180, 95, '#fff', 12, 6) + ftext(0, -172, str, { size: 34, fill: col, stroke: 'none' }) + ell(0, 30, 48, 36, PLQ, 6) + path('M-26 12l16 7M26 12l-16 7', 'none', 5) + circ(-13, 26, 5, OL, 0) + circ(13, 26, 5, OL, 0) + path('M-11 48Q0 38 11 48', 'none', 4) + G(tr(30, 0), circ(0, 0, 14, SKIN, 4))); }
function scratchHand(x, y, t, sp = 22) { const sx = x + 170 * Math.sin(t * sp); let g = ''; [-66, -22, 22, 66].forEach((fx, i) => g += rect(fx - 21, -20, 42, 135 - Math.abs(i - 1.5) * 12, SKIN, 21, 7) + rect(fx - 13, 82 - Math.abs(i - 1.5) * 12, 26, 24, '#fff', 8, 3));
  return G(tr(sx, y, 1, 8 * Math.sin(t * sp)), g + ell(0, -50, 112, 82, SKIN, 8) + rect(-92, -300, 184, 230, SHIRT_E, 30, 8)) + itchFx(sx, y - 170, t, 1.4) + motionLines(sx - 190, y, 3, 60, 180) + motionLines(sx + 190, y, 3, 60, 0); }
function armCU(x, y, s, t, o = {}) { const k = o.red ?? 1; let g = rect(-1000, -120, 1290, 240, SKIN, 120, 8);
  g += plaque(-360, 20, 2.6, k, 3, 8) + plaque(-60, -18, 2.2, k, 5, -12) + plaque(-640, -10, 1.8, k, 8);
  if (o.face) { const e = o.face; g += G(tr(-360, 20), path('M-50 -40l30 14M50 -40l-30 14', 'none', 8) + circ(-24, -10, 9, OL, 0) + circ(24, -10, 9, OL, 0) + (e > 1 ? path('M-30 34Q0 10 30 34', 'none', 7) + path('M-18 30l6 -8l6 8l6 -8l6 8', '#fff', 3) : path('M-24 30Q0 18 24 30', 'none', 7))); }
  if (o.raw) g += op(o.raw, path('M-470 -50l330 26M-450 0l350 12M-430 50l320 0', 'none', 9, '#fff3f0'));
  if (o.cream) g += op(o.cream, path('M-560 -60Q-360 -100 -140 -50Q-40 0 -160 60Q-380 100 -560 50Q-640 0 -560 -60Z', 'rgba(255,255,255,.75)', 0)) + (o.cream > .5 ? sparkle(-300, -60, .5, '#fff') + sparkle(-520, 40, .35, '#fff') : '');
  for (let i = 0; i < 4; i++) g += rect(330, -110 + i * 54, 160 - Math.abs(i - 1.3) * 18, 48, SKIN, 24, 7);
  g += G(tr(270, -110, 1, -30), rect(-30, -90, 60, 120, SKIN, 30, 7)) + ell(300, 0, 105, 118, SKIN, 8) + rect(-1100, -150, 200, 300, o.sleeve || SHIRT_E, 30, 8);
  if (o.fire) g += op(clamp(o.fire), flames(-620, -80, 680, 190, t, 3, '#ff5a4a', '#ffd23f'));
  if (o.signs) o.signs.forEach(([px, str, t0]) => g += picket(px, -100, 1.1, str, t, t0));
  if (o.scr) g += scratchHand(-300, -150, t);
  return G(tr(x, y, s, o.rot || 0), g); }

// ---------- petit monde de la peau : rempart PEAU, garde, gouttes d'eau, irritants ----------
function germ(x, y, s, t, col = '#9be15d', seed = 1) { let d = ''; for (let i = 0; i < 20; i++) { const a = i / 20 * 6.283, rr = i % 2 ? 46 : 64 + 6 * Math.sin(t * 9 + i + seed); d += (i ? 'L' : 'M') + f1(Math.cos(a) * rr) + ' ' + f1(Math.sin(a) * rr); }
  return G(tr(x, y, s, Math.sin(t * 4 + seed) * 12), path(d + 'Z', col, 6) + path('M-28 -18l18 8M28 -18l-18 8', 'none', 6) + circ(-14, -2, 7, OL, 0) + circ(14, -2, 7, OL, 0) + path('M-16 22l8 -6l8 6l8 -6l8 6', '#fff', 4)); }
const eDrop = (x, y, s, t, ph = 0) => G(tr(x, y + wave(t, 1.2, 8, ph), s), path('M0 -70C20 -36 44 -12 44 16C44 44 22 60 0 60C-22 60 -44 44 -44 16C-44 -12 -20 -36 0 -70Z', '#7fcbff', 6) + ell(-16, 0, 8, 14, '#fff', 0) + circ(-12, 16, 5, OL, 0) + circ(12, 16, 5, OL, 0) + path('M-10 32Q0 42 10 32', 'none', 4) + ell(-24, 30, 7, 4, '#ff9bb0', 0) + ell(24, 30, 7, 4, '#ff9bb0', 0));
function cellGuard(x, y, s, t, expr = 'proud', o = {}) { return G(tr(x, y, s, o.r || 0), line(110, -150, 110, 170, 10, '#8a5a3a') + path('M96 -150L110 -200L124 -150Z', '#c9d3dc', 5) + head({ hr: 90, expr, skin: '#f6c3a8', cap: '#9aa3ad', hair: 'short', hairColor: '#9aa3ad', seed: 5 }, t) + circ(110, 60, 20, '#f6c3a8', 5) + (o.tape ? G(tr(-20, 120, 1, -10), rect(-60, -18, 120, 36, 'rgba(230,230,220,.95)', 4, 4)) : '')); }
function fortE(t, o = {}) { const yb = 1250, c = clamp(o.crack || 0), wob = o.wob ? Math.sin(t * 20) * 6 * o.wob : 0;
  let s = SKY(t, '#9fd6ff', '#fff1dc') + circ(-100, 1150, 320, '#9ccf8a', 0) + circ(560, 1220, 420, '#8fc47e', 0) + circ(1200, 1130, 340, '#9ccf8a', 0) + dPine(330, 900, .6, t) + dPine(760, 880, .7, t) + tree(560, 860, .4, t) + dHaze(.1);
  let wall = rect(-M, 830, W + 2 * M, yb - 830, '#f4bfa6', 0, 7); for (let x = -M; x < W + M; x += 150) wall += rect(x, 760, 92, 80, '#f4bfa6', 6, 7);
  for (let j = 0, y = 900; y < yb; y += 70, j++) { wall += line(-M, y, W + M, y, 4, '#d99a82'); for (let x = -M + (j % 2) * 70; x < W + M; x += 140) wall += line(x, y - 70, x, y, 4, '#d99a82'); }
  wall += G(tr(CX, 945), rect(-170, -60, 340, 120, '#fff8e0', 14, 6) + ftext(0, 26, 'PEAU', { size: 72, fill: PLQ2, stroke: 'none' }));
  if (c > 0) { wall += op(c, path('M200 840l40 80l-30 60l50 90l-20 80M760 830l-30 70l40 70l-40 90l30 100M480 1060l60 40l-20 60', 'none', 8) + ell(330, 1130, 50 * c, 34 * c, '#7a3a3a', 6) + ell(860, 1010, 40 * c, 28 * c, '#7a3a3a', 6) + ell(620, 1180, 34 * c, 22 * c, '#7a3a3a', 6)); }
  s += G(`translate(${f1(wob)} 0)`, wall);
  for (const [tx, fl] of [[110, 0], [970, 1]]) s += G(tr(tx, 0), rect(-110, 560, 220, 700, '#f0b49a', 8, 7) + path('M-135 572L0 380L135 572Z', SX.acc, 7) + line(0, 380, 0, 300, 6) + path(`M0 300Q40 ${f1(306 + wave(t, 1.4, 8, fl))} 84 ${f1(300 + wave(t, 1.4, 10, fl + .3))}L84 ${f1(344 + wave(t, 1.4, 10, fl + .3))}Q40 ${f1(350 + wave(t, 1.4, 8, fl))} 0 344Z`, '#ffd23f', 5) + rect(-34, 660, 68, 100, '#6b3e3e', 34, 5) + rect(-34, 880, 68, 100, '#6b3e3e', 34, 5));
  s += rect(-M, yb, W + 2 * M, 1400, '#7cc46a', 0, 0) + line(-M, yb, W + M, yb, 7, '#5a9a4a') + rect(-M, yb + 60, W + 2 * M, 150, '#5ec4f0', 0, 6) + [0, 1, 2].map(i => path(`M${-60 + i * 400 + wave(t, .4, 30, i)} ${yb + 120}q40 -20 80 0t80 0`, 'none', 5, '#fff')).join('') + dFlowers(60, yb + 330, 5, 4, t) + dBush(880, yb + 330, .9) + dFlowers(560, yb + 330, 6, 8, t);
  return s; }

// ---------- décors propres au sujet ----------
const eTube = (x, y, s = 1, r = 0, c = '#fff', str = '') => G(tr(x, y, s, r), path('M-30 0L30 0L40 -150L-40 -150Z', c, 5) + rect(-44, -170, 88, 26, '#c9d3dc', 6, 5) + rect(-16, 0, 32, 26, SX.acc, 6, 5) + rect(-22, -110, 44, 50, SX.acc, 6, 0) + (str ? ftext(0, -70, str, { size: 22, fill: OL, stroke: 'none' }) : ''));
function eTub(x, yb, t) { return G(tr(x, yb), rect(-270, -270, 540, 270, '#fff', 40, 7) + rect(-290, -290, 580, 44, '#f4f7fa', 22, 6) + circ(-200, 10, 18, '#c9d3dc', 5) + circ(200, 10, 18, '#c9d3dc', 5) + G(tr(-170, -300, 1, wave(t, .7, 6)), ell(0, 0, 38, 26, '#ffd23f', 5) + circ(20, -28, 20, '#ffd23f', 5) + path('M36 -30l18 4l-18 6Z', '#ff9a4d', 3) + circ(24, -32, 4, OL, 0))); }
function bathE(t, o = {}) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#e4f5f7', 0, 0) + rect(-M, 620, W + 2 * M, yb - 620, '#bfe6ea', 0, 0);
  for (let x = -M; x < W + M; x += 90) s += line(x, 620, x, yb, 3, '#a4d4da'); for (let y = 710; y < yb; y += 90) s += line(-M, y, W + M, y, 3, '#a4d4da');
  s += rect(-M, 604, W + 2 * M, 20, '#fff', 0, 4) + dWindowView(400, 120, 180, 220, t);
  s += G(tr(200, 470), rect(-150, -180, 300, 330, '#c38a52', 30, 7) + rect(-126, -156, 252, 282, '#d6f0ff', 20, 0) + path('M-90 -110L-30 -140M-100 -50L10 -120', 'none', 10, 'rgba(255,255,255,.8)'));
  s += G(tr(200, 880), rect(-14, 100, 28, 280, '#e8eef2', 6, 5) + path('M-170 0L170 0L130 110L-130 110Z', '#fff', 7) + rect(-20, -60, 40, 60, '#c9d3dc', 8, 5) + path('M0 -60Q50 -90 64 -30', 'none', 12, '#c9d3dc') + rect(96, -80, 50, 80, '#ff8fb1', 10, 5) + line(110, -80, 100, -130, 6, '#5ec4f0') + line(132, -80, 142, -126, 6, '#ffd23f') + eTube(-110, 0, .45, -8, '#fff'));
  s += dShelf(600, 470, 330, eTube(640, 470, .55, 0, '#fff') + eTube(700, 470, .5, 0, '#cfe8ff') + dJar(770, 470, '#ff8fb1', .8) + eTube(830, 470, .55, 0, '#e8f7e0') + dJar(890, 470, '#7be07b', .7));
  s += G(tr(470, 680), circ(0, 0, 28, 'none', 6, '#c9d3dc') + path(`M-60 20L60 20L${f1(64 + wave(t, .5, 4))} 250L${f1(-64 + wave(t, .5, 4))} 250Z`, '#ff8fb1', 6) + line(-60, 210, 60, 210, 5, '#fff'));
  s += line(560, 150, 1200, 150, 10, '#c9d3dc') + dCurtain(980, 150, 150, 860, '#7fd3ff', t, -1);
  s += G(tr(790, 300), line(110, -150, 110, 0, 10, '#c9d3dc') + path('M110 0Q100 40 30 40', 'none', 10, '#c9d3dc') + ell(0, 50, 64, 22, '#c9d3dc', 6));
  if (o.shower) { let w = ''; for (let i = 0; i < 12; i++) { const k = (t * 2.4 + i / 12) % 1, xx = 740 + (i % 6) * 20 + (i > 5 ? 10 : 0); w += line(xx + (xx - 790) * k * .8, 380 + k * 640, xx + (xx - 790) * (k + .05) * .8, 410 + k * 640, 6, 'rgba(120,200,255,.85)'); } s += w; }
  if (o.tub !== false) s += eTub(790, yb, t);
  if (o.steam) for (let i = 0; i < 5; i++) { const k = (t * .25 + i / 5) % 1; s += op(.75 * Math.sin(k * 3.14), cloud(300 + i * 180 + Math.sin(t + i) * 40, 1100 - k * 800, 1 + k, '#fff')); }
  s += WASH() + dTileFloor(yb, '#f2f2ea', '#d8e8ea') + dRug(330, 1420, 460, 110, '#ff8fb1', '#fff') + dPot(60, 1300, .9, t, 2, '#5b8fd8') + dBin(1000, 1320, .6, '#ff8fb1');
  return s; }
function chambreE(t) { const yb = 1250;
  let s = dWall('dot', '#e8e1fa', '#d8cdf5', yb) + dBase(yb, '#fff');
  s += dWindowView(60, 300, 260, 330, t) + dCurtain(0, 280, 90, 420, SX.acc, t, 1) + dCurtain(290, 280, 90, 420, SX.acc, t, -1);
  s += dPoster(480, 360, 150, 210, '#ff9a4d', -4, circ(0, -20, 40, '#fff', 4) + path('M-20 40L0 -10L20 40Z', '#e2463a', 4), t) + dPoster(660, 400, 130, 170, '#5b8fd8', 5, ftext(0, 10, '★', { size: 70, fill: '#ffd23f', stroke: 'none' }), t);
  s += dFrame(870, 300, 130, 110, 'heart', '#c38a52', 4) + wallClock(1010, 470, 46, t) + dShelf(720, 640, 330, dBooks(730, 640, 150, 7) + dTeddy(920, 640, .6) + eTube(1010, 640, .4, 0, '#fff')) + dOutlet(560, 1180) + dSwitch(420, 900);
  s += G(tr(900, yb), rect(-220, -230, 40, 230, '#b98552', 8, 6) + rect(-200, -110, 420, 90, '#b98552', 10, 6) + rect(-190, -150, 400, 60, '#fff', 20, 5) + path('M-120 -150Q60 -190 230 -150L230 -40L-120 -40Z', '#8a6ad8', 6) + ell(-150, -170, 60, 30, '#fff', 5));
  s += WASH() + dParquet(yb, '#c49a6c') + dRug(CX, 1480, 760, 160, '#8fe0c0', '#ffd23f');
  s += dBox(170, 1330, .8, 'JOUETS') + dShoes(820, 1660, .7, '#36a85a') + dBag(960, 1400, .8, '#ff9a4d', 8) + dBall(300, 1700, .6, t * .2, '#e2463a') + dPot(60, 1290, .9, t, 0);
  return s; }
function radiator(x, yb, s, t, hot = 1) { let g = ''; for (let i = 0; i < 7; i++) g += rect(-210 + i * 60, -260, 46, 240, '#f4f1ea', 20, 5); let w = ''; if (hot) for (let i = 0; i < 4; i++) { const k = (t * 1.2 + i / 4) % 1; w += op(1 - k, path(`M${-150 + i * 100} ${-280 - k * 220}q-24 -30 0 -60q24 -30 0 -60`, 'none', 7, '#ff8a5a')); }
  return G(tr(x, yb, s), rect(-230, -30, 460, 30, '#c9d3dc', 6, 5) + g + w + circ(220, -40, 16, '#e2463a', 4)); }
function snowWin(x, y, w, h, t) { let s = ''; for (let i = 0; i < 16; i++) { const k = (t * .35 + i / 16) % 1, sx = x + ((i * 53) % w) + Math.sin(t * 2 + i) * 10; s += circ(sx, y + k * h, 6 + (i % 3) * 2, '#fff', 0); } return clipR(x, y, w, h, s + rect(x, y + h - 40, w, 40, '#fff', 0, 0), 4); }
function hygro(x, y, s, v, t) { return G(tr(x, y, s, wave(t, .4, 2)), rect(-90, -120, 180, 240, '#fff', 20, 6) + ftext(0, -66, 'AIR', { size: 30, fill: OL, stroke: 'none' }) + ftext(0, 10, v + '%', { size: 62, fill: '#e2463a', stroke: 'none' }) + ftext(0, 80, 'SEC !', { size: 30, fill: '#e2463a', stroke: 'none' })); }
function ePhone(x, y, s, r, screen = '') { return G(tr(x, y, s, r), rect(-170, -330, 340, 660, '#2b2b33', 44, 6) + rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + screen + rect(-50, -318, 100, 14, '#444', 7, 0)); }
const DIMR = (k = .3) => op(k, rect(-M, -M, W + 2 * M, H + 2 * M, '#141838', 0, 0));
const deskF = (x, y, s = 1, c = '#c58e55') => G(tr(x, y, s), rect(-230, -20, 460, 34, shade(c, .15), 8, 6) + rect(-200, 14, 400, 180, c, 6, 6) + line(-150, 60, 150, 60, 4, shade(c, -.2)));
function cabinetE(t) { const yb = 1250;
  let s = dWall('stripe', '#e3f4ea', '#d4ede0', yb) + rect(-M, 900, W + 2 * M, yb - 900, '#bfe0cf', 0, 0) + line(-M, 900, W + M, 900, 6, '#9cc9b2') + dBase(yb, '#fff');
  s += dWindowView(360, 250, 260, 320, t) + dCurtain(310, 230, 80, 380, '#7fd3ff', t, 1) + dCurtain(590, 230, 80, 380, '#7fd3ff', t, -1);
  s += G(tr(150, 330, 1, -2), rect(-110, -80, 220, 160, '#c38a52', 6, 6) + rect(-96, -66, 192, 132, '#fffbe8', 0, 3) + line(-60, -30, 60, -30, 5, '#9aa') + line(-70, 0, 70, 0, 4, '#bbb') + circ(50, 40, 18, SX.acc, 4)) + G(tr(150, 560, 1, 2), rect(-90, -70, 180, 140, '#8a5a3a', 6, 6) + rect(-76, -56, 152, 112, '#fffbe8', 0, 3) + line(-50, -20, 50, -20, 5, '#9aa') + circ(40, 30, 16, '#5b8fd8', 4));
  s += dPoster(900, 420, 200, 300, '#fff', 2, ftext(0, -70, 'E', { size: 80, fill: OL, stroke: 'none' }) + ftext(0, 0, 'F P', { size: 50, fill: OL, stroke: 'none' }) + ftext(0, 50, 'T O Z', { size: 34, fill: OL, stroke: 'none' }) + ftext(0, 90, 'L P E D', { size: 24, fill: OL, stroke: 'none' }), t);
  s += wallClock(720, 150, 50, t) + dShelf(640, 700, 240, dJar(670, 700, '#ff8fb1', .7) + dJar(730, 700, '#7be07b', .7) + eTube(800, 700, .45, 0, '#fff') + eTube(850, 700, .42, 0, '#cfe8ff')) + hangLamp(540, 60, t, .4);
  s += G(tr(1030, 0), rect(-30, 600, 60, 600, '#fff', 6, 4) + [0, 1, 2, 3, 4, 5].map(i => line(-30, 650 + i * 90, 0, 650 + i * 90, 4)).join(''));
  s += G(tr(240, yb), rect(-220, -230, 440, 60, '#7fd3ff', 20, 6) + rect(-180, -240, 300, 20, '#fff', 8, 4) + line(-180, -170, -180, 0, 10) + line(180, -170, 180, 0, 10) + rect(-200, -60, 400, 16, '#c9d3dc', 6, 4));
  s += WASH() + dTileFloor(yb, '#eef5f0', '#d8eadf') + dPot(1010, 1300, 1, t, 0) + dBin(80, 1320, .6, '#7aa6d8');
  return s; }
function ePalm(x, yb, s, t) { const sw = wave(t, .4, 4, x); let lv = ''; for (let i = 0; i < 6; i++) lv += G(tr(0, 0, 1, -150 + i * 50 + sw), path('M0 0Q90 -40 190 20Q90 0 0 0Z', '#3f9a5a', 5)); return G(tr(x, yb, s), path('M-14 0Q-30 -200 10 -420L34 -420Q0 -200 18 0Z', '#a0703f', 5) + G(tr(20, -420), lv + circ(0, 0, 18, '#8a5a3a', 4))); }
function poolE(t, o = {}) { let s = grad('#ff9a8b', '#ffd6a5', -M, -M, W + 2 * M, 1100 + M) + circ(760, 760, 110, '#ffe08a', 0) + op(.4, circ(760, 760, 170, '#ffe08a', 0)) + cloud(((t * 20) % 1500) - 200, 260, 1.1, '#ffe9e0') + cloud(((t * 12 + 800) % 1600) - 300, 430, .8, '#ffe9e0') + dBirds(t, 3, 330);
  s += op(.8, dSkyline(930, '#c98aa0', 4, 'rgba(255,230,180,.6)')) + ePalm(80, 960, 1, t) + ePalm(990, 960, .9, t) + rect(-M, 880, W + 2 * M, 100, '#f4e3c8', 0, 5) + dFence(-M, W + M, 960, '#fff');
  let gl = 'M-60 520'; for (let i = 0; i < 12; i++) gl += `Q${-60 + i * 110 + 55} 580 ${-60 + (i + 1) * 110} 520`; s += path(gl, 'none', 5); for (let i = 0; i < 12; i++) s += circ(-5 + i * 110, 556, 13, Math.sin(t * 4 + i * 1.3) > 0 ? DPAL[i % 8] : '#7a6a5a', 4);
  s += rect(-M, 975, W + 2 * M, 26, '#fff', 0, 5) + rect(-M, 1000, W + 2 * M, 250, '#46b8e8', 0, 0);
  for (let i = 0; i < 6; i++) s += path(`M${-80 + i * 220 + wave(t, .5, 30, i)} ${1040 + (i % 3) * 60}q30 -14 60 0t60 0`, 'none', 5, 'rgba(255,255,255,.7)');
  for (let x = -M; x < W + M; x += 50) s += circ(x, 1150, 10, Math.floor((x + M) / 50) % 2 ? '#fff' : '#e2463a', 3);
  s += G(tr(880, 990), rect(-10, -20, 260, 30, '#5ec4f0', 10, 5) + rect(180, 10, 30, 60, '#c9d3dc', 4, 4));
  s += o.heads || '';
  s += op(.85, rect(-M, 1092, W + 2 * M, 158, '#46b8e8', 0, 0)) + G(tr(250 + wave(t, .3, 20), 1110), ell(0, 0, 90, 34, '#ff8fb1', 6) + ell(0, -4, 40, 14, '#46b8e8', 5)) + G(tr(760, 1120 + wave(t, .6, 6)), circ(0, 0, 34, '#ffd23f', 5) + path('M-34 0Q0 -16 34 0', 'none', 5, '#e2463a'));
  s += rect(-M, 1240, W + 2 * M, 900, '#f2e6d0', 0, 0) + line(-M, 1240, W + M, 1240, 8, '#d8c8a8') + [0, 1, 2, 3].map(i => line(-M, 1300 + i * 90, W + M, 1300 + i * 90, 4, '#e2d2b4')).join('');
  s += G(tr(140, 1250), line(-30, 0, -30, -150, 8, '#c9d3dc') + line(30, 0, 30, -150, 8, '#c9d3dc') + line(-30, -50, 30, -50, 6, '#c9d3dc') + line(-30, -100, 30, -100, 6, '#c9d3dc'));
  s += G(tr(920, 1400), path('M-160 0L-120 -90L140 -40L160 0Z', '#5ec4f0', 6) + line(-140, 0, -140, 40, 8) + line(140, 0, 140, 40, 8)) + dPot(1030, 1330, .9, t, 1, '#ff8fb1') + G(tr(300, 1500), rect(-90, -20, 180, 30, '#ff8fb1', 10, 5) + line(-60, -20, 60, -20, 4, '#fff'));
  return s; }
function bedCU(x, y, s, t, o = {}) { const h = o.head || ''; return G(tr(x, y, s), rect(-420, -260, 60, 330, '#6b4a8a', 14, 7) + rect(-380, -60, 820, 140, '#8a6ad8', 18, 7) + ell(-250, -110, 130, 60, '#fff', 6) + h + path('M-150 -90Q120 -160 440 -80L440 60L-150 60Z', '#5ec4f0', 7) + path('M-110 -50Q130 -100 420 -40', 'none', 5, '#3a9ac0') + (o.armOut || '')); }

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, at(n, 'mot') - .15))
//  Cadrage 9:16 : visages/textes entre y 380 et 1150 ; sous 1250 = décor seulement (sous-titres du client).
// ============================================================
// B001 — SIGNATURE : grille encre, le héros en cut-out (plaques, gratte la joue), « débloqué » en étoiles sur ECZÉMA
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'hex');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(ecz(Object.assign({ x: 0, y: 0, s: 1.25, expr: t > K ? 'jawdrop' : 'worried', plq: t > K ? 1.4 : 1 }, SCRF(t)), t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1030, 330, 330, t, K + .1, { label: 'plaques.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'AVOIR", CX, 415, t, .3, { size: 58 }) +
      kword("DE L'ECZÉMA ?", CX, 540, t, K - .05, { size: 78, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'hex') - .05, 'boom', .6], [at(1, 'hex'), 'sparkle', .5], [.6, 'scratch', .3]] });

// B002a — « Il est trois heures du matin, tu dors » : nuit graphique, lit en cut-out, horloge 03:00, Zzz
const O2 = at(2, 'enfin') - .15;
B(2, { enter: 'none', trans: 'wipe', transD: .25, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { let st = ''; for (let i = 0; i < 14; i++) st += sparkle((i * 173) % 1080, 120 + (i * 97) % 600, .15 + .08 * Math.sin(t * 3 + i), '#fff6d6');
    return gridBg('#1b2150') + halftoneFade('#5a63c8', .1, 1) + st + circ(860, 300, 80, '#fff6d6', 6) + circ(830, 280, 70, '#1b2150', 0) +
      cutout(bedCU(CX + 20, 1160, 1, t, { head: eczHead(-250, -170, 100, { expr: 'sleep', tilt: -14 }, t) }), 10) + ftext(260 + Math.sin(t * 2) * 10, 830 - (t * 40) % 60, 'Z z z', { size: 54, fill: '#fff' }) +
      G(tr(CX, 470), bigClockF(0, 0, Math.sin(t * 6) > -.5 ? '03:00' : '03 00', '#ff5c8a', 1)) + funTag(CX, 640, '3 H DU MATIN', t, at(2, 'trois') - .05, { size: 46, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [at(2, 'trois') - .05, 'pop', .6], [at(2, 'heures'), 'clock_fast', .3], [at(2, 'dors'), 'crickets', .4]] });
// B002b — « enfin, tu essaies » : les yeux s'ouvrent d'un coup, le bras sort de la couette et ça gratte
B(2, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.1, 1.16, t / d), shake: t < .25 ? 6 : 0 }),
  draw: (t, d, T) => { const E = at(2, 'essaies') - O2; const arm = G(tr(-60, -80, 1, -20), rect(0, -36, 320, 72, SKIN, 36, 7) + plaque(150, 0, 1, 1.2, 4) + ell(330, 0, 52, 46, SKIN, 7) + itchFx(160, -40, t, .9));
    return gridBg('#1b2150') + halftoneFade('#5a63c8', .1, 1) + circ(860, 300, 80, '#fff6d6', 6) + circ(830, 280, 70, '#1b2150', 0) +
      cutout(bedCU(CX + 20, 1160, 1, t, { head: eczHead(-250, -170, 100, { expr: t > E ? 'deadpan' : 'shock', face: t > E ? {} : { eyes: 'pop' }, tilt: -14 }, t), armOut: arm }), 10) +
      kthin('enfin… tu essaies.', CX, 470, t, .05, { size: 60 }) + markerText('gratte gratte', 640, 760, t, E, { size: 50, col: SX.acc2 }); },
  sfx: [[0, 'boing', .5], [.05, 'gasp', .4], [at(2, 'essaies') - O2, 'scratch', .6], [at(2, 'essaies') - O2 + .2, 'scratch', .4]] }, O2);

// B003 — « Parce que ton bras te gratte, tu grattes. » : papier, gros plan bras en cut-out, la main se met à gratter
B(3, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1, 1.05, t / d) }),
  draw: (t, d, T) => { const G1 = at(3, 'gratte'), G2 = at(3, 'gratte', 2);
    return paper(SX.paper) + gobo(T, .12) + cutout(armCU(CX + 60, 900, .9, t, { red: t > G1 ? 1.4 : 1, scr: t > G2 }), 10) + (t > G1 && t < G2 ? itchFx(CX - 260, 760, t, 1.4) : '') +
      funTag(CX - 140, 470, 'TON BRAS', t, at(3, 'bras') - .05, { size: 56, bg: SX.cool, fg: SX.ink }) + kword('TU GRATTES.', CX, 600, t, G2 - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[at(3, 'bras') - .05, 'pop_hi', .5], [at(3, 'gratte'), 'buzz', .4], [at(3, 'gratte', 2) - .05, 'boom', .5], [at(3, 'gratte', 2), 'scratch', .7], [at(3, 'gratte', 2) + .4, 'scratch', .5]] });

// B004a — « Ça soulage pendant deux secondes » : chambre de nuit, extase chill de ouf, compte à rebours 2… 1…
const O4 = at(4, 'puis') - .15;
B(4, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const D = at(4, 'deux'), c = t < D ? 2 : Math.max(0, 2 - Math.floor((t - D) / (O4 - D) * 2.2));
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: bedroomN(t), haze: .1 }, { z: 1, svg: glow(CX, 1000, 360, '#fff3a0', .35) + ecz({ x: CX, y: 1480, s: 1.35, expr: 'chill', armL: [70, -20], armR: [150, 180], plq: .8 }, t) + heartsUp(t, CX, 900, 4) }]) +
      funTag(CX, 450, 'SOULAGEMENT', t, at(4, 'soulage') - .05, { size: 56, bg: SX.cool, fg: SX.ink }) + G(tr(860, 680), circ(0, 0, 90, '#fff', 7) + ftext(0, 34, String(c), { size: 100, fill: SX.acc, stroke: 'none' })) + markerText('secondes', 860, 820, t, at(4, 'secondes'), { size: 40, col: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(4, 'soulage'), 'angel', .6], [at(4, 'deux'), 'tick', .6], [at(4, 'secondes'), 'tick', .6]] });
// B004b — « puis ça gratte encore plus » : crash zoom, panique, gratte à toute vitesse, plaques qui s'enflamment
B(4, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.1, shake: 7 }),
  draw: (t, d, T) => { const E = at(4, 'encore') - O4;
    return rays(t, CX, 900, '#e2463a', '#ff7a7a', 22) + ecz(Object.assign({ x: CX, y: 1500, s: 1.4, expr: 'panic', plq: 1.6 }, SCR(t, 50)), t) + speedLines(t, CX, 900, 26, 'rgba(255,255,255,.5)') +
      kword('ENCORE PLUS !', CX, 480, t, E - .05, { size: 100, fill: SX.acc2 }) + popStars(CX - 100, 1000, t, E, 6, 200); },
  sfx: [[0, 'flash_hit', .6], [.05, 'scratch', .7], [at(4, 'encore') - O4 - .05, 'boom', .6], [at(4, 'plus') - O4, 'scratch', .6]] }, O4);

// B005 — « Félicitations ! » : rayons, confettis ironiques, héros qui gratte, regard vide
B(5, { enter: 'punch', flash: 1, cam: zin(1.04, 1.1),
  draw: (t, d, T) => rays(t, CX, 900, '#ffe9a6', '#ffd76b', 22) + confetti(t, 0, 36) + ecz(Object.assign({ x: CX, y: 1500, s: 1.4, expr: 'deadpan', plq: 1.3 }, SCR(t)), t) + kword('FÉLICITATIONS !', CX, 520, t, 0, { size: 82, fill: SX.acc }),
  sfx: [[0, 'tada', .7], [.1, 'sparkle', .5], [.3, 'scratch', .4]] });

// B006 — « Tu viens de déclencher la boucle infernale » : roue de hamster en feu, étiquettes du cycle
B(6, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const D = at(6, 'declencher'), Bo = at(6, 'boucle'); let sp = ''; const r = 330; for (let i = 0; i < 12; i++) { const a = R(i * 30 + t * 220); sp += line(Math.cos(a) * 40, Math.sin(a) * 40, Math.cos(a) * r, Math.sin(a) * r, 8, '#8a6a5a'); }
    const wheel = G(tr(CX, 900), line(-260, 400, 0, 0, 18, '#5a4a4a') + line(260, 400, 0, 0, 18, '#5a4a4a') + sp + circ(0, 0, r, 'none', 26, OL) + circ(0, 0, r, 'none', 14, '#c9a27a') + circ(0, 0, 34, '#5a4a4a', 6));
    const tags = [['ÇA GRATTE', CX, 470, SX.acc2], ['TU GRATTES', 900, 900, SX.cool], ['ÇA SOULAGE', CX, 1300 - 80, '#fff'], ['ÇA GRATTE +', 180, 900, '#ff8fb1']];
    return gridBg('#3a1026') + halftoneFade(SX.acc, .1, 1) + flames(-60, 1320, 1200, 260, t, 5, '#ff5a4a', '#ffd23f') + (t > D ? wheel : G(tr(CX, 900), circ(0, 0, r, 'none', 14, '#c9a27a'))) +
      ecz(Object.assign({ x: CX, y: 1180, s: .95, expr: t > Bo ? 'terror' : 'worried', walk: t > D ? 4 : 0 }, t > D ? {} : SCR(t)), t * (t > D ? 2.4 : 1)) + (t > D ? motionLines(CX - 170, 980, 3, 70, 180, '#fff') : '') +
      tags.map(([s, x, y, c], i) => funTag(x, y, s, t, Bo + i * .12, { size: 34, bg: c, fg: SX.ink, r: (i % 2 ? 6 : -6) })).join('') + kword('BOUCLE INFERNALE', CX, 600, t, Bo - .05, { size: 74, fill: '#fff' }); },
  sfx: [[at(6, 'declencher') - .05, 'zap', .6], [at(6, 'declencher'), 'squeak', .5], [at(6, 'boucle') - .05, 'boom', .6], [at(6, 'boucle') + .1, 'pop_hi', .4], [at(6, 'infernale'), 'fire', .6]] });

// B007 — « Bienvenue dans la vie de quelqu'un qui a de l'eczéma » : salle de bain, étagère qui déborde de crèmes, paillasson BIENVENUE
B(7, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const E = at(7, 'hex'); let tubes = ''; for (let i = 0; i < 9; i++) { const k = pop(t, .2 + i * .1, .3); if (k > 0) tubes += G(tr(620 + (i % 5) * 70, 800 - Math.floor(i / 5) * 160, k), eTube(0, 0, .55, (i % 3 - 1) * 8, ['#fff', '#cfe8ff', '#e8f7e0', '#ffe1ee'][i % 4])); }
    return bathE(t) + dShelf(580, 800, 380, tubes) + G(tr(CX - 120, 1290), rect(-260, -30, 520, 90, '#c58e55', 26, 7) + ftext(0, 32, 'BIENVENUE', { size: 50, fill: '#7a4a2a', stroke: 'none' })) +
      ecz({ x: CX - 120, y: 1480, s: 1.3, expr: 'happy', armL: [200, 230], armR: [-20, -60], holdR: eTube(0, 0, .5, 20) }, t) + kthin('bienvenue dans la vie de', CX, 400, t, at(7, 'bienvenue') - .1, { size: 54 }) +
      kword("L'ECZÉMA", CX, 520, t, E - .05, { size: 100, fill: SX.acc }) + popStars(780, 700, t, E, 6, 180); },
  sfx: [[0, 'whoosh', .4], [.2, 'pop_hi', .3], [.5, 'pop_hi', .3], [.8, 'pop_hi', .3], [at(7, 'bienvenue'), 'magic', .5], [at(7, 'hex') - .05, 'tada', .6]] });

// B008 — « Ta peau est censée servir de barrière » : la PEAU est un rempart, garde fier, drapeaux
B(8, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3, cy: 900 }),
  draw: (t, d, T) => { const Bb = at(8, 'barriere'); return fortE(t) + cellGuard(CX - 260, 690, .9, t, t > Bb ? 'proud' : 'neutral') + eDrop(CX + 160, 770, .8, t) + eDrop(CX + 300, 770, .7, t, .4) +
    funTag(CX + 40, 450, 'TA PEAU', t, at(8, 'peau') - .05, { size: 54, bg: '#f4bfa6', fg: SX.ink }) + kword('= BARRIÈRE', CX, 570, t, Bb - .05, { size: 90, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(8, 'peau') - .05, 'pop', .6], [at(8, 'censee'), 'whistle', .3], [at(8, 'barriere') - .05, 'boom', .5], [at(8, 'barriere') + .1, 'thud', .5]] });

// B009a — « Elle aide à garder l'eau à l'intérieur » : les gouttes d'eau saluent derrière les créneaux
const O9 = at(9, 'et') - .1;
B(9, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), cy: 860 }),
  draw: (t, d, T) => { const E = at(9, 'eau'); let dr = ''; for (let i = 0; i < 5; i++) dr += eDrop(160 + i * 190, 770 - pop(t, E - .1 + i * .08, .3) * 30, .85, t, i * .3) ;
    return fortE(t) + dr + cellGuard(CX, 690, .85, t, 'proud') + funTag(CX, 470, "L'EAU RESTE DEDANS", t, E - .05, { size: 46, bg: '#7fcbff', fg: SX.ink }) + markerArrow(860, 560, 760, 700, t, at(9, 'interieur'), { bend: -40, col: SX.acc2 }); },
  sfx: [[at(9, 'garder'), 'pop_hi', .4], [at(9, 'eau') - .1, 'pop', .5], [at(9, 'eau'), 'chirp', .4], [at(9, 'interieur'), 'scratch', .4]] });
// B009b — « et à empêcher les irritants d'entrer » : les irritants (pollen, poussière, savon) rebondissent sur le mur
B(9, { enter: 'whip', cam: (t, d) => ({ z: 1.05, hand: .4, shake: Math.abs(Math.sin(t * 7)) > .97 ? 5 : 0 }),
  draw: (t, d, T) => { const I = at(9, 'irritants') - O9; let gs = ''; [['#9be15d', 0], ['#c9b8a0', .3], ['#c08aff', .6]].forEach(([c, ph], i) => { const k = ((t * .9 + ph) % 1), bx = i % 2 ? 1100 - 500 * Math.sin(k * 3.14) : -20 + 500 * Math.sin(k * 3.14); gs += germ(bx, 1060 - i * 90 - Math.sin(k * 6.28) * 40, .9, t, c, i) + (k > .45 && k < .55 ? impactStar(bx, 1060 - i * 90, .5) : ''); });
    return fortE(t) + cellGuard(CX, 690, .85, t, 'effort') + eDrop(250, 770, .7, t) + eDrop(830, 770, .7, t, .5) + gs + funTag(CX, 470, 'IRRITANTS : REFUSÉS', t, I - .05, { size: 44, bg: '#e2463a' }); },
  sfx: [[0, 'whoosh', .4], [.4, 'boing', .5], [at(9, 'irritants') - O9 - .05, 'pop', .6], [at(9, 'irritants') - O9 + .2, 'boing', .5], [at(9, 'entree') - O9, 'thud', .5]] }, O9);

// B010a — « Sauf qu'avec la dermatite atopique » : le rempart se fissure, le garde s'inquiète
const O10 = at(10, 'cette') - .15;
B(10, { enter: 'none', trans: 'glitch', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3, cy: 900 }),
  draw: (t, d, T) => { const D = at(10, 'dermatite'); return fortE(t, { crack: seg(t, D, D + .6) * .6 }) + cellGuard(CX, 690, .85, t, t > D ? 'worried' : 'neutral') + eDrop(250, 770, .7, t) + eDrop(830, 770, .7, t, .5) +
    kthin("sauf qu'avec la", CX, 400, t, at(10, 'sauf') - .1, { size: 52 }) + funTag(CX, 520, 'DERMATITE ATOPIQUE', t, D - .05, { size: 44, bg: SX.acc }) + (t > D ? markerCircle(330, 1130, 90, 70, t, D + .3, { col: SX.acc2 }) : ''); },
  sfx: [[at(10, 'sauf'), 'sting', .4], [at(10, 'dermatite') - .05, 'pop', .6], [at(10, 'dermatite') + .1, 'crack', .6], [at(10, 'atopique'), 'crack', .4]] });
// B010b — « cette barrière peut être plus fragile » : le mur tremble, des trous, le garde le tient au scotch, tampon FRAGILE
B(10, { enter: 'drop', cam: (t, d) => ({ z: 1.06, shake: 4, cy: 900 }),
  draw: (t, d, T) => { const F = at(10, 'fragile') - O10; return fortE(t, { crack: 1, wob: 1 }) + cellGuard(CX - 200, 690, .85, t, 'panic', { tape: 1 }) + eDrop(830, 770 + seg(t, F, F + .4) * 60, .7, t, .5) +
    G(tr(700, 820 + seg(t, .3, .9) * 400, 1, t * 200), rect(-46, -26, 92, 52, '#f4bfa6', 6, 6)) + stamp(CX, 500, 'FRAGILE', t, F - .05, '#e2463a', -8, 90); },
  sfx: [[0, 'crack', .6], [.3, 'thud', .5], [at(10, 'fragile') - O10 - .05, 'thud', .8], [at(10, 'fragile') - O10 + .1, 'gasp', .5]] }, O10);

// B011 — « et l'inflammation provoque des démangeaisons » : salon, plaques qui s'allument comme des alarmes, panique
B(11, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), shake: t > at(11, 'demang') ? 6 : 2 }),
  draw: (t, d, T) => { const I = at(11, 'inflammation'), Dm = at(11, 'demang'), al = t > I && Math.sin(t * 14) > 0;
    return salonF(t) + (al ? op(.18, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff2a2a', 0, 0)) : '') + ecz(Object.assign({ x: CX, y: 1490, s: 1.35, expr: t > Dm ? 'terror' : 'shock', plq: t > I ? 1.8 : 1 }, t > Dm ? SCR(t, 50) : {}), t) +
      germ(250, 820, .6, t, '#9be15d', 2) + germ(840, 900, .55, t, '#c08aff', 3) + funTag(CX, 450, 'INFLAMMATION', t, I - .05, { size: 54, bg: '#e2463a' }) + kword('DÉMANGEAISONS', CX, 590, t, Dm - .05, { size: 80, fill: SX.acc2 }); },
  sfx: [[at(11, 'inflammation') - .05, 'siren', .4], [at(11, 'inflammation') + .1, 'fire', .5], [at(11, 'demang') - .05, 'boom', .6], [at(11, 'demang'), 'scratch', .7]] });

// B012 — « Alors tu grattes, la peau s'abîme » : gros plan bras sur chambre floue, la main gratte, traces, tampon ABÎMÉE
B(12, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .5 }),
  draw: (t, d, T) => { const A = at(12, 'abime'); return blur(10, chambreE(t)) + WASH('rgba(255,255,255,.15)') + armCU(CX + 60, 900, .9, t, { red: 1.3, scr: t < A + .2, raw: seg(t, A - .3, A + .1) }) +
    funTag(CX, 450, 'TU GRATTES', t, at(12, 'grattes') - .05, { size: 52, bg: SX.acc2, fg: SX.ink }) + stamp(800, 1120, 'ABÎMÉE', t, A - .05, '#e2463a', 8, 64); },
  sfx: [[0, 'scratch', .7], [.4, 'scratch', .6], [at(12, 'grattes') - .05, 'pop', .5], [at(12, 'abime') - .05, 'thud', .6]] });

// B013a — « elle s'irrite davantage » : la plaque se réveille, sourcils froncés, elle grossit et grogne
const O13 = at(13, 'et') - .15;
B(13, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.06, 1.16, t / d) }),
  draw: (t, d, T) => { const I = at(13, 'irrite'); return blur(10, chambreE(t)) + WASH('rgba(60,0,20,.12)') + armCU(CX + 140, 920, 1.05 + seg(t, I, I + .8) * .2, t, { red: t > I ? 1.8 : 1.3, face: t > I ? 2 : 1, raw: 1 }) +
    funTag(CX, 460, 'IRRITÉE', t, I - .05, { size: 60, bg: '#e2463a' }) + kthin('davantage', CX, 610, t, at(13, 'davantage'), { size: 56 }); },
  sfx: [[at(13, 'irrite') - .05, 'growl', .6], [at(13, 'irrite'), 'pop', .5], [at(13, 'davantage'), 'growl', .5]] });
// B013b — « et tu as encore plus envie de gratter » : jauge ENVIE DE GRATTER qui explose, yeux affamés sur son propre bras
B(13, { enter: 'crash', cam: (t, d) => ({ z: 1.06, shake: t > at(13, 'gratter') - O13 ? 7 : 2 }),
  draw: (t, d, T) => { const Gg = at(13, 'gratter') - O13, k = lerp(.8, 2.4, eOutCubic(seg(t, .1, Gg))), v = Math.round(k * 100), sh = k > 2 ? Math.sin(t * 50) * 6 : 0, fill = clamp(k / 2.4);
    const gauge = G(tr(CX + sh, 560), rect(-280, -60, 560, 120, '#fff', 30, 7) + rect(-266, -46, 532 * fill, 92, mixC('#ffd23f', '#e2463a', fill), 24, 0) + rect(-266, -46, 532, 92, 'none', 24, 5) + ftext(0, 22, v + ' %', { size: 60, fill: OL, stroke: 'none' }) + ftext(0, -86, 'ENVIE DE GRATTER', { size: 44, fill: '#fff' }));
    return chambreE(t) + ecz({ x: CX, y: 1490, s: 1.35, expr: 'starving', look: [-1, .6], armL: [70, -20], armR: [-40, -80], plq: 1.6 }, t) + gauge + (k > 2 ? popStars(CX, 560, t, Gg, 6, 320) : ''); },
  sfx: [[0, 'whoosh_up', .5], [at(13, 'encore') - O13, 'tick', .5], [at(13, 'envie') - O13, 'slot', .5], [at(13, 'gratter') - O13, 'error_beep', .7]] }, O13);

// B014a — « À l'école » : cour d'école vivante, le héros arrive en manches courtes
const O14 = at(14, 'kevin') - .15;
B(14, { enter: 'none', trans: 'wipe', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: schoolyard(t), haze: .08 }, { z: 1, svg: ecz({ x: 400, y: 1490, s: 1.3, expr: 'happy', walk: 3 }, t) + kevin({ x: 820, y: 1490, s: 1.25, expr: 'neutral', flip: 1 }, t) }, { z: .6, svg: blur(10, dBag(100, 1800, 1.4, '#ff8fb1', -8)) }]) +
    funTag(CX, 460, "À L'ÉCOLE", t, at(14, 'ecole') - .1, { size: 60, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'school_bell', .5], [at(14, 'ecole') - .1, 'pop', .6], [.2, 'steps', .4]] });
// B014b — « Kevin remarque tes plaques rouges » : Kevin à la loupe, cercle au marqueur sur les plaques
B(14, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.06, 1.12, t / d), hand: .3 }),
  draw: (t, d, T) => { const P = at(14, 'plaques') - O14; return schoolyard(t) + WASH() + ecz({ x: 330, y: 1490, s: 1.35, expr: t > P ? 'embarrassed' : 'neutral', armL: [70, -20] }, t) +
    kevin({ x: 790, y: 1490, s: 1.35, expr: 'suspicious', flip: 1, armR: [-20, -30], holdR: magnifier(0, 0, .7, 0), headTilt: -10 }, t) + funTag(790, 460, 'KEVIN', t, 0, { size: 46, bg: '#5fb85f' }) +
    markerCircle(315, 1020, 110, 90, t, P, { col: SX.acc2 }) + markerText('plaques rouges', 400, 820, t, P + .1, { size: 46, col: SX.acc2 }); },
  sfx: [[0, 'pop', .5], [at(14, 'remarque') - O14, 'hmm', .5], [at(14, 'plaques') - O14, 'scratch', .6], [at(14, 'rouges') - O14, 'glint', .5]] }, O14);

// B015 — « Wesh, c'est contagieux ? » : Kevin bondit en arrière, masque sur le nez
const O15 = at(15, 'oueche') - .15;
B(15, { enter: 'whip', flash: 1, cam: () => ({ z: 1.06, shake: 4 }),
  draw: (t, d, T) => { const C = at(15, 'contagieux') - O15, j = eOutCubic(seg(t, .05, .4)); return schoolyard(t) + WASH() + ecz({ x: 300, y: 1490, s: 1.35, expr: 'confused', armL: [70, -20] }, t) +
    kevin({ x: lerp(700, 880, j), y: 1490 - Math.sin(j * 3.14) * 160, s: 1.3, expr: 'terror', flip: 1, mask: t > C, armL: [200, 240], armR: [-60, -110] }, t) + motionLines(620, 1000, 3, 80, 180) +
    funTag(860, 420, 'WESH', t, .1, { size: 50, bg: '#5fb85f' }) + kword('CONTAGIEUX ?', CX, 560, t, C - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[.05, 'boing', .6], [.1, 'pop', .5], [at(15, 'contagieux') - O15 - .05, 'boom', .5], [at(15, 'contagieux') - O15 + .1, 'gasp', .5]] }, O15);

// B016a — « Non, Kevin, » : gros plan héros, regard blasé
const O16 = at(16, 'ce') - .15;
B(16, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.08, 1.14, t / d) }),
  draw: (t, d, T) => blur(8, schoolyard(t)) + WASH('rgba(255,255,255,.2)') + eczHead(CX, 940, 240, { expr: 'deadpan' }, t) + kword('NON, KEVIN.', CX, 500, t, at(16, 'non') - .05, { size: 96, fill: '#fff' }),
  sfx: [[0, 'whoosh', .4], [at(16, 'non') - .05, 'thud', .5], [at(16, 'kevin'), 'rimshot', .3]] });
// B016b — « ce n'est pas un abonnement que je peux te partager » : appli ECZÉMA+ sur téléphone, PARTAGER barré
B(16, { enter: 'none', trans: 'up', transD: .25, cam: camHand(1.04, .5),
  draw: (t, d, T) => { const A = at(16, 'abonnement') - O16, P = at(16, 'partager') - O16;
    const scr = rect(-150, -295, 300, 90, SX.acc, 24, 0) + ftext(0, -235, 'ECZÉMA+', { size: 44, fill: '#fff', stroke: 'none' }) + ftext(0, -150, 'ABONNEMENT', { size: 28, fill: OL, stroke: 'none' }) + ftext(0, -110, 'À VIE · 0 €', { size: 26, fill: '#7a8a9a', stroke: 'none' }) +
      plaque(0, -10, 2, 1.2, 6) + G(tr(0, 130), rect(-130, -40, 260, 80, '#5fb85f', 30, 5) + ftext(0, 14, 'PARTAGER', { size: 30, fill: '#fff', stroke: 'none' })) + ftext(0, 230, 'avec : Kevin ?', { size: 26, fill: OL, stroke: 'none' });
    return blur(8, schoolyard(t)) + WASH('rgba(255,255,255,.2)') + kevin({ x: 870, y: 1500, s: 1.2, expr: 'confused', flip: 1, mask: true }, t) + card(470, 900, 360, 680, ePhone(0, 0, 1, 0, scr), t, A - .15, { ry: 0, thick: 10, r: -4, bw: 0, bg: 'none' }) +
      cross(470, 1030, .9, t, P) + funTag(470, 470, 'NON TRANSFÉRABLE', t, P + .1, { size: 40, bg: '#e2463a' }); },
  sfx: [[at(16, 'abonnement') - O16 - .15, 'pop_hi', .5], [at(16, 'abonnement') - O16, 'ding', .5], [at(16, 'partager') - O16, 'error_beep', .6], [at(16, 'partager') - O16 + .1, 'pop', .5]] }, O16);

// B017a — « L'hiver arrive, le chauffage assèche l'air » : salon, neige derrière la vitre, radiateur brûlant, hygromètre 18 %
const O17 = at(17, 'ta') - .15;
B(17, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const C = at(17, 'chauffage'), Sc = at(17, 'seche'); return salonF(t, { noSofa: true }) + snowWin(720, 300, 280, 360, t) + radiator(260, 1250, 1, t, t > C) +
    ecz({ x: 700, y: 1490, s: 1.3, expr: t > Sc ? 'dizzy' : 'shock', plq: 1.2, armL: [70, -20] }, t) + (t > Sc ? hygro(260, 820, 1, 18, t) : '') +
    funTag(CX, 450, "L'HIVER ❄", t, at(17, 'hiver') - .1, { size: 56, bg: '#cfe8ff', fg: SX.ink }) + funTag(800, 620, 'AIR SEC', t, Sc - .05, { size: 46, bg: '#ff9a4d', fg: SX.ink }); },
  sfx: [[0, 'wind', .5], [at(17, 'hiver') - .1, 'pop', .5], [at(17, 'chauffage'), 'sizzle', .5], [at(17, 'seche') - .05, 'pop', .5], [at(17, 'air'), 'wind', .3]] });
// B017b — « ta peau proteste » : gros plan bras, les plaques sortent des pancartes de grève
B(17, { enter: 'crash', cam: camHand(1.06, .5),
  draw: (t, d, T) => { const P = at(17, 'proteste') - O17; return blur(10, salonF(t)) + WASH('rgba(255,255,255,.15)') + armCU(CX + 60, 980, .85, t, { red: 1.3, signs: [[-360, 'GRÈVE !', P - .1], [-60, 'TROP SEC', P + .1], [-640, 'NON !', P + .25]] }) +
    kword('TA PEAU PROTESTE', CX, 480, t, P - .05, { size: 72, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(17, 'proteste') - O17 - .1, 'pop', .5], [at(17, 'proteste') - O17, 'whistle', .5], [at(17, 'proteste') - O17 + .25, 'pop', .5]] }, O17);

// B018 — « Tu prends une douche trop chaude, elle proteste encore » : douche fumante, thermomètre rouge, pancartes ENCORE ?!
B(18, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const C = at(18, 'chaude'), P = at(18, 'proteste'); return bathE(t, { tub: false, shower: 1, steam: 1 }) + ecz({ x: 790, y: 1300, s: 1.25, expr: t > P ? 'shock' : 'zen', plq: t > P ? 1.6 : 1, armL: [200, 250], armR: [-20, -70] }, t) + eTub(790, 1250, t) +
    G(tr(220, 900), thermometer(0, 0, 1.1, lerp(.4, 1, seg(t, C - .3, C + .3)), '#ff5d4d')) + funTag(260, 520, 'TROP CHAUDE', t, C - .05, { size: 46, bg: '#ff5d4d' }) +
    picket(640, 1010, .8, 'ENCORE ?!', t, P) + picket(950, 980, .8, 'GRÈVE', t, P + .15); },
  sfx: [[0, 'waves', .4], [at(18, 'douche'), 'spray', .5], [at(18, 'chaude') - .05, 'sizzle', .6], [at(18, 'proteste'), 'pop', .6], [at(18, 'encore'), 'whistle', .4]] });

// B019 — « Tu mets un pull qui gratte » : chambre, pull en laine plein de piquants, électrocuté de démangeaisons
B(19, { enter: 'drop', cam: (t, d) => ({ z: 1.06, shake: t > at(19, 'gratte') ? 5 : 0 }),
  draw: (t, d, T) => { const Gt = at(19, 'gratte'); return chambreE(t) + ecz({ x: CX, y: 1490, s: 1.4, expr: t > Gt ? 'pain' : 'neutral', wool: 1, tremble: t > Gt, armL: [120, 120], armR: [60, 60] }, t + (t > Gt ? Math.sin(t * 60) * .02 : 0)) +
    (t > Gt ? itchFx(CX - 180, 1050, t, 1.2) + itchFx(CX + 180, 1050, t + .3, 1.2) : '') + funTag(CX, 460, 'PULL EN LAINE', t, at(19, 'pull') - .05, { size: 54, bg: WOOL }) + kword('QUI GRATTE', CX, 600, t, Gt - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[at(19, 'mets'), 'flutter', .5], [at(19, 'pull') - .05, 'pop', .5], [at(19, 'gratte') - .05, 'zap', .6], [at(19, 'gratte') + .1, 'scratch', .6]] });

// B020 — « Là, elle demande officiellement ta démission » : la plaque en cravate tend sa lettre de démission
B(20, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d) }),
  draw: (t, d, T) => { const O = at(20, 'officiellement'), Dm = at(20, 'demission');
    const boss = G(tr(760, 1100, 1.4), ell(0, 0, 90, 74, PLQ, 7) + path('M-50 -40l26 12M50 -40l-26 12', 'none', 7) + circ(-24, -14, 8, OL, 0) + circ(24, -14, 8, OL, 0) + path('M-20 30Q0 20 20 30', 'none', 6) + path('M-10 60L10 60L16 120L0 140L-16 120Z', '#5b8fd8', 5) + rect(-130, 40, 40, 70, '#6b3e26', 6, 5));
    const letter = G(tr(0, 0), rect(-170, -210, 340, 420, '#fff', 12, 7) + ftext(0, -150, 'LETTRE DE', { size: 32, fill: OL, stroke: 'none' }) + ftext(0, -110, 'DÉMISSION', { size: 40, fill: '#e2463a', stroke: 'none' }) + [0, 1, 2, 3].map(i => line(-130, -60 + i * 40, 110 - (i % 2) * 50, -60 + i * 40, 5, '#9aa8b5')).join('') + ftext(40, 150, '— ta peau', { size: 28, fill: '#5b8fd8', stroke: 'none', font: SX.marker }));
    return chambreE(t) + WASH() + ecz({ x: 280, y: 1490, s: 1.3, expr: t > Dm ? 'jawdrop' : 'confused', plq: 1.3 }, t) + boss + card(640, 760, 340, 420, letter, t, at(20, 'demande') - .1, { ry: 0, thick: 8, r: 6, bw: 6 }) +
      stamp(640, 900, 'OFFICIEL', t, O, '#5b8fd8', -10, 60) + kword('DÉMISSION', CX, 460, t, Dm - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[at(20, 'demande') - .1, 'flutter', .5], [at(20, 'officiellement'), 'thud', .7], [at(20, 'demission') - .05, 'boom', .6], [at(20, 'demission') + .1, 'gasp', .5]] });

// B021a — « Tu testes une crème adaptée » : salle de bain, gros tube CRÈME, la plaque s'apaise (étincelles)
const O21 = at(21, 'evites') - .35;
B(21, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const C = at(21, 'creme'), k = seg(t, C, C + .8); return bathE(t) + ecz({ x: 420, y: 1490, s: 1.35, expr: t > C + .3 ? 'zen' : 'suspicious', plq: lerp(1.2, .6, k), armL: [70, -20], armR: [-20, -60] }, t) +
    G(tr(760, 920, 1, -20 + Math.sin(t * 5) * 4), eTube(0, 0, 2, 0, '#fff', 'CRÈME')) + (t > C ? op(1 - seg(t, C + .8, C + 1.2), path(`M640 900Q${560} ${960} 480 ${1000}`, 'none', 22, '#fff')) : '') + popStars(380, 1000, t, C + .3, 6, 160) +
    funTag(CX, 450, 'CRÈME ADAPTÉE', t, C - .05, { size: 56, bg: '#fff', fg: SX.ink }); },
  sfx: [[at(21, 'testes'), 'pop_hi', .4], [at(21, 'creme') - .05, 'pop', .6], [at(21, 'creme') + .1, 'squeak', .5], [at(21, 'creme') + .3, 'sparkle', .5]] });
// B021b — « tu évites tes déclencheurs » : cartes pull / eau brûlante / savon parfumé barrées, le héros esquive
B(21, { enter: 'none', trans: 'wipe', transD: .2, cam: camHand(1.04, .4),
  draw: (t, d, T) => { const D = at(21, 'declencheurs') - O21; const icons = [G(tr(0, 10), rect(-60, -50, 120, 100, WOOL, 20, 6) + path('M-50 -10l20 12l20 -12l20 12l20 -12', 'none', 5)), thermometer(0, 30, .45, .95), G(tr(0, 0), rect(-55, -30, 110, 70, '#ffb3d9', 30, 6) + circ(-30, -50, 16, '#fff', 4) + circ(10, -64, 12, '#fff', 4) + ftext(0, 18, '✿', { size: 34, fill: '#fff', stroke: 'none' }))];
    let s = bathE(t) + WASH('rgba(255,255,255,.2)') + ecz({ x: CX, y: 1490, s: 1.3, expr: 'cool', plq: .6, armL: [200, 240], armR: [-20, -60], rot: Math.sin(t * 6) * 6 }, t);
    icons.forEach((ic, i) => { const x = 230 + i * 310, t0 = .05 + i * .15; s += card(x, 760, 220, 200, ic, t, t0, { ry: 0, thick: 8, r: (i - 1) * 8, bw: 6 }) + cross(x, 760, .7, t, D + i * .1); });
    return s + funTag(CX, 470, 'DÉCLENCHEURS', t, D - .05, { size: 56, bg: SX.acc }); },
  sfx: [[.05, 'pop_hi', .4], [.2, 'pop_hi', .4], [.35, 'pop_hi', .4], [at(21, 'declencheurs') - O21 - .05, 'pop', .6], [at(21, 'declencheurs') - O21 + .1, 'error_beep', .5]] }, O21);

// B022a — « et parfois, un médecin te prescrit » : cabinet médical, la médecin signe l'ordonnance
const O22 = at(22, 'traitement') - .15;
B(22, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Md = at(22, 'medecin'), P = at(22, 'prescrit');
    const ord = G(tr(0, 0), rect(-150, -190, 300, 380, '#fff', 12, 7) + ftext(0, -130, 'ORDONNANCE', { size: 32, fill: '#5b8fd8', stroke: 'none' }) + [0, 1, 2].map(i => line(-110, -70 + i * 50, 100 - i * 30, -70 + i * 50, 5, '#9aa8b5')).join('') + eTube(-60, 150, .5, 0, '#fff') + path('M20 130q20 -40 40 0t40 0', 'none', 5, '#5b8fd8'));
    return cabinetE(t) + ecz({ x: 300, y: 1490, s: 1.3, expr: 'worried', plq: 1.2, armL: [70, -20] }, t) +
      person({ age: 'adult', x: 790, y: 1500, s: 1.15, hair: 'bun', hairColor: '#2b2420', skin: '#c98a5e', shirt: '#fff', pants: '#5b6b8a', coat: true, stetho: true, glasses: true, expr: 'happy', flip: 1, armR: [-30, -70], seed: 71 }, t) + deskF(790, 1290, 1) +
      funTag(790, 450, 'MÉDECIN', t, Md - .05, { size: 50, bg: '#7fd3ff', fg: SX.ink }) + card(540, 800, 300, 380, ord, t, P - .1, { ry: 0, thick: 8, r: -5, bw: 6 }); },
  sfx: [[at(22, 'parfois'), 'hmm', .4], [at(22, 'medecin') - .05, 'pop', .5], [at(22, 'prescrit') - .1, 'flutter', .5], [at(22, 'prescrit') + .2, 'scratch', .4]] });
// B022b — « un traitement contre l'inflammation » : gros plan bras, le feu de l'inflammation s'éteint sous la crème, fumée + étincelles
B(22, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.06, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const I = at(22, 'inflammation') - O22, k = seg(t, I - .5, I + .3);
    return blur(10, cabinetE(t)) + WASH('rgba(255,255,255,.15)') + armCU(CX + 60, 960, .85, t, { red: lerp(1.8, .7, k), fire: 1 - k, cream: k }) + (k > .5 ? steam(CX - 240, 900, t, 1.3) + steam(CX + 60, 880, t + .4, 1.1) + popStars(CX - 200, 920, t, I + .1, 7, 260) : '') +
      kthin('un traitement contre', CX, 420, t, .05, { size: 54 }) + kword("L'INFLAMMATION", CX, 540, t, I - .05, { size: 80, fill: SX.acc2 }); },
  sfx: [[0, 'fire', .5], [at(22, 'traitement') - O22, 'pop_hi', .4], [at(22, 'inflammation') - O22 - .3, 'spray', .6], [at(22, 'inflammation') - O22 + .1, 'sizzle', .5], [at(22, 'inflammation') - O22 + .3, 'sparkle', .5]] }, O22);

// B023 — « Parce que non, ce n'est pas simplement avoir la peau sèche » : PEAU SÈCHE ≠ ECZÉMA, « débloqué » sur NON
B(23, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1, 1.05, t / d) }),
  draw: (t, d, T) => { const N = at(23, 'non'), Sc = at(23, 'seche');
    const dry = G(tr(0, 0), circ(0, 0, 80, '#f2d8b0', 6) + path('M-50 -20l30 10l-10 30M20 -50l10 30l30 -6M-10 40l20 -10', 'none', 4, '#c9a070') + ftext(0, 130, 'peau sèche', { size: 30, fill: OL, stroke: 'none' }));
    const ecze = G(tr(0, -10), eczHead(0, 0, 80, { expr: 'sob', plq: 1.6 }, t) + flames(-70, -80, 140, 60, t, 2, '#ff5a4a', '#ffd23f') + ftext(0, 140, 'eczéma', { size: 30, fill: OL, stroke: 'none' }));
    return paper('#fdeef6') + gobo(T, .1) + unlock(CX, 880, t, N, { part: 'back', r: 460 }) + card(290, 880, 300, 330, dry, t, .15, { ry: 0, thick: 8, r: -6, bw: 6 }) + card(790, 880, 300, 330, ecze, t, .3, { ry: 0, thick: 8, r: 6, bw: 6 }) +
      kword('≠', CX, 880, t, N, { size: 160, fill: SX.acc }) + unlock(CX, 880, t, N, { part: 'front', r: 460 }) +
      kthin("ce n'est pas simplement", CX, 400, t, at(23, 'pas') - .1, { size: 54 }) + kword('LA PEAU SÈCHE', CX, 530, t, Sc - .3, { size: 84, fill: SX.acc2 }) + cross(CX, 530, 1.1, t, Sc + .05); },
  sfx: [[.15, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(23, 'non'), 'boom', .6], [at(23, 'non') + .05, 'sparkle', .5], [at(23, 'seche') - .3, 'pop', .5], [at(23, 'seche') + .05, 'error_beep', .6]] });

// B024 — « Un soir, tu refuses une piscine » : piscine au coucher de soleil, les potes appellent, le héros fait « stop »
const potes = (t, ex = 'happy') => [[330, 1, 0], [560, 3, .4], [800, 4, .8]].map(([x, i, ph]) => G(tr(x, 1040 + wave(t, .6, 8, ph)), head({ hr: 70, hair: KH[i], hairColor: KC[i], skin: SK[i], expr: ex, seed: 30 + i }, t))).join('');
B(24, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const R_ = at(24, 'refuses'), P = at(24, 'piscine'); return poolE(t, { heads: potes(t, 'laugh') }) +
    ecz({ x: 170, y: 1490, s: 1.25, expr: t > R_ ? 'worried' : 'neutral', armL: t > R_ ? [-150, -100] : [110, 100], armR: t > R_ ? [-30, -80] : [70, 80] }, t) +
    funTag(CX + 60, 460, 'UN SOIR', t, at(24, 'soir') - .1, { size: 54, bg: '#ff9a8b', fg: SX.ink }) + funTag(640, 880, 'PISCINE ?!', t, .2, { size: 44, bg: '#7fcbff', fg: SX.ink }) + cross(640, 880, .7, t, P); },
  sfx: [[0, 'waves', .5], [.2, 'pop_hi', .4], [at(24, 'soir') - .1, 'pop', .5], [at(24, 'refuses'), 'hmm', .5], [at(24, 'piscine'), 'error_beep', .5]] });

// B025 — « Tes amis pensent que tu fais ton difficile » : les potes lèvent les yeux au ciel, bulle : toi en diva sur un trône
B(25, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const P = at(25, 'pensent'), Df = at(25, 'difficile');
    const diva = G(tr(0, 40), rect(-90, -40, 180, 150, '#e2463a', 20, 6) + rect(-110, -150, 220, 120, '#ffd23f', 20, 6) + eczHead(0, -70, 60, { expr: 'cool' }, t) + path('M-40 -130L-48 -170L-20 -150L0 -180L20 -150L48 -170L40 -130Z', '#ffd23f', 5));
    return poolE(t, { heads: potes(t, 'annoyed') }) + G(tr(CX, 700, pop(t, P, .35)), cloud(0, 0, 2.2, '#fff') + diva) + circ(560, 900, 22, '#fff', 5) + circ(570, 950, 14, '#fff', 4) +
      funTag(CX, 450, 'DIFFICILE', t, Df - .05, { size: 64, bg: SX.acc }); },
  sfx: [[at(25, 'amis'), 'hmm', .4], [at(25, 'pensent'), 'magic', .5], [at(25, 'difficile') - .05, 'pop', .6], [at(25, 'difficile') + .2, 'rimshot', .4]] });

// B026 — « Mais toi, tu imagines déjà le chlore » : gros plan terreur, bulle : bidon de CHLORE monstrueux qui fonce sur le bras
B(26, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.06, 1.12, t / d), shake: t > at(26, 'clor') ? 4 : 0 }),
  draw: (t, d, T) => { const Cl = at(26, 'clor'), k = eOutCubic(seg(t, Cl - .2, Cl + .4));
    const mons = G(tr(lerp(180, 60, k), 0, 1, Math.sin(t * 8) * 6), rect(-90, -110, 180, 220, '#e8f7ff', 24, 7) + rect(-40, -150, 80, 50, '#5ec4f0', 10, 6) + ftext(0, -40, 'CHLORE', { size: 30, fill: '#2a7ab0', stroke: 'none' }) + path('M-50 10l30 12M50 10l-30 12', 'none', 7) + circ(-24, 30, 8, OL, 0) + circ(24, 30, 8, OL, 0) + path('M-40 66Q0 100 40 66Z', '#7a2b2b', 5) + path('M-26 70l8 12l8 -12M10 72l8 12l8 -12', '#fff', 3));
    const arm = G(tr(-170, 30, 1, -10), rect(-110, -32, 220, 64, SKIN, 32, 6) + plaque(0, 0, .9, 1.4, 4));
    return blur(10, poolE(t)) + op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#1a1040', 0, 0)) + eczHead(CX, 1020, 170, { expr: 'terror' }, t) + G(tr(CX, 640, pop(t, at(26, 'imagines'), .35)), cloud(0, 0, 2.3, '#fff') + arm + mons) + circ(CX - 130, 820, 20, '#fff', 5) +
      kword('LE CHLORE', CX, 440, t, Cl - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[at(26, 'toi'), 'sting', .5], [at(26, 'imagines'), 'magic', .5], [at(26, 'clor') - .2, 'growl', .6], [at(26, 'clor') - .05, 'boom', .5]] });

// B027a — « la serviette » : serviette en papier de verre « grain 40 » qui frotte (étincelles)
const O27 = at(27, 'et') - .1;
B(27, { enter: 'whip', cam: camHand(1.06, .5),
  draw: (t, d, T) => { const S = at(27, 'serviette'), rub = Math.sin(t * 24) * 60; let dots = ''; for (let i = 0; i < 40; i++) dots += circ(-130 + (i * 37) % 260, -170 + (i * 53) % 340, 4, '#b08a50', 0);
    return blur(10, poolE(t)) + op(.25, rect(-M, -M, W + 2 * M, H + 2 * M, '#1a1040', 0, 0)) + armCU(CX + 60, 1000, .8, t, { red: 1.4 }) + (t > S ? G(tr(CX - 120 + rub, 860, 1, -8), rect(-150, -190, 300, 380, '#e8c690', 20, 7) + dots + ftext(0, 0, 'GRAIN 40', { size: 40, fill: '#7a4a2a', stroke: 'none' })) + impactStar(CX - 120 + rub, 1000, .35, '#fff3b0') : '') +
      funTag(CX, 460, 'LA SERVIETTE', t, S - .05, { size: 56, bg: '#ff8fb1', fg: SX.ink }); },
  sfx: [[at(27, 'serviette') - .05, 'pop', .5], [at(27, 'serviette'), 'scratch', .7], [at(27, 'serviette') + .3, 'scratch', .6]] });
// B027b — « et la nuit à te gratter » : retour au lit, horloge 03:00, ça gratte sous la couette
B(27, { enter: 'drop', cam: (t, d) => ({ z: 1.06, hand: .3 }),
  draw: (t, d, T) => { const N = at(27, 'nuit') - O27; return bedroomN(t) + DIMR(.2) + G(tr(820, 1260), ell(-160, -130, 70, 34, '#fff', 5)) + eczHead(660, 1080, 95, { expr: 'pain', tilt: -12, plq: 1.5, scrF: 1 }, t) +
    G(tr(950, 1180, 1, -10 + Math.sin(t * 30) * 8), rect(-80, -30, 160, 60, SKIN, 30, 6) + plaque(0, 0, .8, 1.5, 5)) + itchFx(950, 1110, t, 1) + G(tr(CX, 520), bigClockF(0, 0, '03:00', '#ff5c8a', .9)) +
    kword('LA NUIT', CX, 720, t, N - .05, { size: 90, fill: '#fff' }); },
  sfx: [[0, 'crickets', .5], [at(27, 'nuit') - O27 - .05, 'boom', .4], [at(27, 'gratter') - O27, 'scratch', .7], [at(27, 'gratter') - O27 + .25, 'scratch', .5]] }, O27);

// B028 — « Le pire avec l'eczéma, tout le monde voit tes plaques » : couloir, projecteur, tous les regards (et flèches) sur les plaques
B(28, { enter: 'none', trans: 'glitch', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const V = at(28, 'voit'), Pq = at(28, 'plaques'); let crowd = ''; [[110, 2, 0], [300, 5, 0], [780, 1, 1], [970, 4, 1]].forEach(([x, i, f]) => crowd += kid(i, { x, y: 1440, s: .95, expr: t > V ? 'shock' : 'neutral', flip: f, look: [f ? -1 : 1, 0] }, t));
    return hallway(t) + DIMR(.25) + op(.35, path('M480 -50L330 1300L790 1300L640 -50Z', '#fff6c8', 0)) + crowd + ecz({ x: CX, y: 1470, s: 1.25, expr: 'embarrassed', plq: 1.4, armL: [70, -20] }, t) +
      markerArrow(200, 760, 400, 960, t, Pq - .1, { bend: -50, col: SX.acc2 }) + markerArrow(880, 760, 680, 960, t, Pq, { bend: 50, col: SX.acc2 }) +
      kthin("le pire avec l'eczéma,", CX, 400, t, at(28, 'pire') - .1, { size: 52 }) + kword('TOUT LE MONDE VOIT', CX, 530, t, at(28, 'tout') - .05, { size: 66, fill: SX.acc2 }); },
  sfx: [[at(28, 'pire'), 'sting', .5], [at(28, 'tout') - .05, 'boom', .5], [at(28, 'voit'), 'gasp', .5], [at(28, 'plaques') - .1, 'scratch', .5], [at(28, 'plaques'), 'scratch', .4]] });

// B029a — « Mais presque personne ne voit » : le couloir se vide, lumières qui s'éteignent, le héros seul
const O29 = at(29, 'les') - .15;
B(29, { enter: 'none', cam: (t, d) => ({ z: lerp(1.08, 1.02, t / d) }),
  draw: (t, d, T) => { const P = at(29, 'personne'), k = seg(t, P - .2, P + .5); let crowd = ''; [[110, 2, -1], [300, 5, -1], [780, 1, 1], [970, 4, 1]].forEach(([x, i, sd]) => crowd += op(1 - k, kid(i, { x: x + sd * 400 * k, y: 1440, s: .95, expr: 'neutral', walk: 3, flip: sd < 0 }, t)));
    return hallway(t) + DIMR(.25 + .35 * k) + crowd + ecz({ x: CX, y: 1470, s: 1.25, expr: 'sad', plq: 1.2 }, t) + kword('PRESQUE PERSONNE', CX, 480, t, P - .05, { size: 70, fill: '#fff' }) + kthin('ne voit…', CX, 610, t, at(29, 'voit') - .05, { size: 56 }); },
  sfx: [[at(29, 'presque'), 'steps', .5], [at(29, 'personne') - .05, 'whoosh', .5], [at(29, 'voit'), 'wind', .4]] });
// B029b — FIN : « les nuits que tu passes à essayer de ne pas y toucher » : 3 h du mat', moufles de cuisine, la plaque supplie « GRATTE-MOI », il tient bon
B(29, { enter: 'none', trans: 'black', transD: .3, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const N = at(29, 'nuits') - O29, Tc = at(29, 'toucher') - O29, hr = ['03:12', '03:48', '04:25', '04:59', '05:31'][Math.min(4, Math.floor(seg(t, 0, Tc) * 5))];
    return bedroomN(t) + unlock(CX, 900, t, N, { part: 'back', r: 460 }) + ecz({ x: CX, y: 1490, s: 1.35, expr: t > Tc ? 'proud' : 'effort', plq: 1.3, mitts: 1, armL: [100, 30], armR: [80, 150] }, t) +
      picket(CX - 230, 1010, .75, 'GRATTE-MOI', t, at(29, 'essayer') - O29 - .2) + unlock(CX, 900, t, N, { part: 'front', r: 460 }) + G(tr(860, 700), bigClockF(0, 0, hr, '#ff5c8a', .7)) +
      kthin('les nuits à essayer de', CX, 400, t, N - .05, { size: 56 }) + kword('NE PAS Y TOUCHER.', CX, 530, t, Tc - .05, { size: 76, fill: SX.acc2 }) + (t > Tc ? heartsUp(t - Tc, CX, 900, 4) : ''); },
  sfx: [[0, 'clock_fast', .4], [at(29, 'nuits') - O29, 'sparkle', .5], [at(29, 'essayer') - O29 - .2, 'pop', .5], [at(29, 'essayer') - O29, 'hmm', .4], [at(29, 'toucher') - O29 - .05, 'boom', .6], [at(29, 'toucher') - O29 + .3, 'angel', .5]] }, O29);

SCENES.sort((a, b) => a.s - b.s);
