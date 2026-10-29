// ============================================================
//  « Pourquoi c'est horrible d'être toujours en embrouille avec ses parents ? » — format SIZEX fun — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Héros : ado de 15 ans (sweat violet, casque audio sur la tête) ; version enfant (t-shirt jaune à étoile) pour les souvenirs.
//  Maman (chignon, haut rose) et papa (moustache, lunettes, polo vert) récurrents. Kevin = le pote (kevin()).
//  Les CAPITALES du script = moments criés → kword slam + flash/shake. Fin émouvante (vieille vidéo VHS).
// ============================================================
const SCENES = [];
const BEDS = [];
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

// ---------- SIZEX fun : accent ROUGE-ORANGE « embrouille » (propre à l'épisode), jaune marqueur ----------
sxFun('#f0472e'); SX.acc2 = '#ffd23f'; SX.cool = '#8fd0ff';
const EM_HOOD = '#6a5acd', EM_HAIR = '#3a2a20', EM_CUP = '#5ec4f0';

// ============================================================
//  PERSONNAGES
// ============================================================
// casque audio posé sur la tête : LE signe de l'ado
const emPhones = r => { const d = `M${f1(-r * .97)} ${f1(-r * .05)}Q${f1(-r * 1.08)} ${f1(-r * 1.3)} 0 ${f1(-r * 1.26)}Q${f1(r * 1.08)} ${f1(-r * 1.3)} ${f1(r * .97)} ${f1(-r * .05)}`;
  return path(d, 'none', r * .2, OL) + path(d, 'none', r * .1, '#3a3f4a') + rect(-r * 1.14, -r * .34, r * .3, r * .56, EM_CUP, r * .12, 6) + rect(r * .84, -r * .34, r * .3, r * .56, EM_CUP, r * .12, 6); };
const emHair = (r, t, o) => { const [b, f] = hairSvg('side', EM_HAIR, r, t); return [b, f + (o.phones === false ? '' : emPhones(r))]; };
const emHoodie = (topY, hipY, bt, bb) => rect(-bb * .5, hipY - 78, bb, 60, 'rgba(0,0,0,.14)', 18, 5) + line(-16, topY + 12, -20, topY + 80, 6, '#fff') + line(16, topY + 12, 20, topY + 80, 6, '#fff') + circ(-20, topY + 86, 6, '#fff', 3) + circ(20, topY + 86, 6, '#fff', 3);
const emTeen = (o, t) => person(Object.assign({ age: 'adult', hairFn: emHair, shirt: EM_HOOD, pants: '#2f3b4e', chest: emHoodie, seed: 2 }, o, { s: (o.s || 1) * .95 }), t);
const emTeenHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: emHair, seed: 2 }, o), t));
// étoile (t-shirt du héros enfant)
const emStarP = (x, y, R_, c) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R_ * .45 : R_; d += (i ? 'L' : 'M') + f1(x + Math.cos(a) * rr) + ' ' + f1(y + Math.sin(a) * rr); } return path(d + 'Z', c, 5); };
const emKid = (o, t) => person(Object.assign({ age: 'kid', hair: 'side', hairColor: EM_HAIR, shirt: '#ffd23f', pants: '#5b8fd8', seed: 2, chest: (topY) => emStarP(0, topY + 72, 26, '#ff8a3d') }, o), t);
const emMom = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#8a5a3a', shirt: '#ff8fb1', pants: '#3b3f5a', skin: SK[2], seed: 64 }, o), t);
const emMomHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'bun', hairColor: '#8a5a3a', skin: SK[2], seed: 64 }, o), t));
const emDad = (o, t) => person(Object.assign({ age: 'adult', hair: 'short', hairColor: '#4a3428', mustache: true, glasses: true, shirt: '#36a85a', pants: '#2f3b4e', skin: SK[4], seed: 61 }, o), t);
const emDadHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'short', hairColor: '#4a3428', mustache: true, glasses: true, skin: SK[4], seed: 61 }, o), t));
const emKev = (o, t) => kevin(Object.assign({ age: 'adult' }, o), t);
// tête vue de dos (parents devant la télé)
const emBackHead = (x, y, r, hc, skin, bun) => (bun ? circ(x, y - r * 1.05, r * .38, hc, 6) : '') + circ(x - r * .98, y + r * .1, r * .2, skin, 6) + circ(x + r * .98, y + r * .1, r * .2, skin, 6) + circ(x, y, r, hc, 7) + path(`M${x - r * .5} ${y - r * .6}Q${x} ${y - r * .2} ${x + r * .5} ${y - r * .6}`, 'none', 5, 'rgba(0,0,0,.2)');

// ============================================================
//  ACCESSOIRES
// ============================================================
const emFlash = (t, t0, k = .8) => t < t0 || t > t0 + .25 ? '' : op(k * (1 - seg(t, t0, t0 + .25)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0));
// mégaphone (pointe vers +x)
const emMega = () => rect(-50, -24, 50, 48, '#e2463a', 8, 7) + path('M0 -26L130 -78L130 78L0 26Z', '#ffd23f', 7) + ell(130, 0, 20, 78, '#fff3b0', 7) + rect(-36, 18, 22, 52, '#2b2b33', 6, 6);
// ondes sonores qui partent de (x, y) vers la droite (dir 1) ou la gauche (-1)
function emWaves(x, y, t, t0, dir = 1, n = 4, col = '#fff') { if (t < t0) return ''; let s = '';
  for (let i = 0; i < n; i++) { const k = ((t - t0) * 1.8 + i / n) % 1, Rr = 60 + k * 520, a0 = R(dir > 0 ? -38 : 142), a1 = R(dir > 0 ? 38 : 218);
    const d = `M${f1(x + Math.cos(a0) * Rr)} ${f1(y + Math.sin(a0) * Rr)}A${f1(Rr)} ${f1(Rr)} 0 0 1 ${f1(x + Math.cos(a1) * Rr)} ${f1(y + Math.sin(a1) * Rr)}`;
    s += op(1 - k, path(d, 'none', 26, OL) + path(d, 'none', 14, col)); }
  return s; }
const emBowl = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-70 -10Q-70 60 0 60Q70 60 70 -10Z', '#5ec4f0', 6) + ell(0, -10, 70, 18, '#fff8e6', 6) + line(30, -20, 90, -80, 9, '#c9d3dc'));
const emRemote = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-24, -80, 48, 160, '#2b2b33', 14, 6) + circ(0, -52, 10, '#e2463a', 0) + [0, 1, 2].map(i => rect(-14, -26 + i * 28, 28, 16, '#7d848c', 6, 0)).join(''));
const emSandwich = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-70 0Q-70 -40 0 -44Q70 -40 70 0Z', '#e8b46a', 6) + rect(-74, 0, 148, 14, '#7be07b', 6, 5) + rect(-70, 12, 140, 14, '#e2463a', 6, 5) + rect(-72, 24, 144, 22, '#e8b46a', 10, 6));
const emGlove = (c = '#e2463a') => ell(0, 0, 36, 32, c, 6) + ell(-14, -8, 10, 6, 'rgba(255,255,255,.5)', 0) + rect(-24, 22, 48, 22, '#fff', 6, 5);
// panneau volume façon télé
function emVol(x, y, lvl, t, s = 1) { let b = ''; for (let i = 0; i < 10; i++) { const on = i < lvl; b += rect(-80 + i * 26, 18 - i * 4, 18, 22 + i * 4, on ? (i > 7 ? '#ff4d4d' : i > 5 ? '#ffd23f' : '#7be07b') : 'rgba(255,255,255,.18)', 4, 0); }
  return G(tr(x, y, s), rect(-200, -60, 400, 120, 'rgba(18,18,30,.88)', 22, 6) + path('M-170 -14L-150 -14L-124 -36L-124 36L-150 14L-170 14Z', '#fff', 0) + (lvl > 0 ? path('M-112 -16Q-100 0 -112 16', 'none', 5, '#fff') : '') + G(tr(30, -6), b) + ftext(110, -26, 'VOLUME', { size: 20, fill: '#fff', stroke: 'none' })); }
const emPhoto = (x, y, s, r, inner) => G(tr(x, y, s, r), rect(-90, -100, 180, 210, '#fff', 6, 6) + clipR(-76, -86, 152, 140, rect(-76, -86, 152, 140, '#bfe3ff', 0, 0) + inner, 2) + rect(-76, -86, 152, 140, 'none', 2, 4));
// le chargeur (il n'a rien demandé)
function emCharger(x, y, s, t, o = {}) { const cry = o.cry, sh = o.shake ? Math.sin(t * 50) * 5 : 0, lk = o.look || 0;
  let g = rect(-34, -150, 20, 50, '#c9d3dc', 5, 6) + rect(14, -150, 20, 50, '#c9d3dc', 5, 6) + rect(-80, -110, 160, 210, '#f4f6f8', 34, 7) + rect(-60, 70, 120, 14, '#dfe5ea', 6, 0) + ell(-48, -80, 14, 8, 'rgba(255,255,255,.9)', 0);
  g += ell(-32, -30, 22, 28, '#fff', 5) + ell(32, -30, 22, 28, '#fff', 5) + circ(-32 + lk * 7, -24, 11, OL, 0) + circ(32 + lk * 7, -24, 11, OL, 0) + circ(-28 + lk * 7, -30, 4, '#fff', 0) + circ(36 + lk * 7, -30, 4, '#fff', 0);
  g += cry ? path('M-60 -70L-14 -58M60 -70L14 -58', 'none', 7) + path('M-26 48Q0 22 26 48', 'none', 7) : o.scared ? path('M-56 -66L-14 -74M56 -66L14 -74', 'none', 6) + ell(0, 42, 14, 18, '#7a2b2b', 5) : path('M-20 40Q0 52 20 40', 'none', 6);
  if (cry) for (const sd of [-1, 1]) for (let i = 0; i < 6; i++) { const k = (t * 2.4 + i / 6) % 1; g += circ(sd * (40 + 140 * k), -10 - 70 * k + 260 * k * k, 10, '#8fd0ff', 3, '#5aaee0'); }
  return G(tr(x + sh, y, s, o.r || 0), g); }
// tente (pop) ; k = échelle d'apparition
const emTent = (x, yb, s, k, t) => k <= 0 ? '' : G(tr(x, yb, s * k), line(-240, 0, -330, 20, 5) + line(240, 0, 330, 20, 5) + rect(-340, 10, 20, 30, '#8a5a3a', 4, 4) + rect(320, 10, 20, 30, '#8a5a3a', 4, 4) +
  path('M-250 0L0 -340L250 0Z', '#ff9a4d', 7) + path('M0 -340L-80 0L80 0Z', '#e2703a', 6) + path('M0 -300L-46 0L0 -60L46 0Z', '#5a2a1a', 5) + line(0, -340, 0, -420, 8) + path(`M0 -420L${f1(70 + Math.sin(t * 8) * 8)} -400L0 -380Z`, SX.acc, 5));
// nain de jardin
const emGnome = (x, yb, s = 1) => G(tr(x, yb, s), ell(0, -40, 46, 50, '#5b8fd8', 6) + path('M-40 -80Q0 -60 40 -80L30 -60Q0 0 -30 -60Z', '#fff', 5) + circ(0, -100, 30, '#f2c9a0', 6) + path('M-36 -112L0 -210L36 -112Z', '#e2463a', 6) + circ(0, -88, 8, '#ff8fb1', 0));
// boîte de conserve (téléphone à ficelle)
const emCan = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-32, -42, 64, 84, '#c9d3dc', 10, 6) + line(-32, -14, 32, -14, 4, '#9aa3ad') + line(-32, 14, 32, 14, 4, '#9aa3ad') + ell(0, -42, 32, 10, '#e8edf2', 5));
// livre « mode d'emploi »
const emBook = (x, y, s, r, l1, l2) => G(tr(x, y, s, r), rect(-150, -110, 300, 220, '#e2463a', 12, 7) + line(0, -110, 0, 110, 6) + ftext(-75, -20, l1, { size: 30, fill: '#fff', stroke: 'none' }) + ftext(-75, 24, l2, { size: 30, fill: '#ffd23f', stroke: 'none' }) + rect(30, -80, 90, 120, '#fff', 6, 4) + line(45, -50, 105, -50, 4, '#9aa3ad') + line(45, -20, 105, -20, 4, '#9aa3ad') + line(45, 10, 90, 10, 4, '#9aa3ad'));

// ============================================================
//  DÉCORS (propres à l'épisode)
// ============================================================
// frigo (open 0→1 : porte qui s'ouvre, lumière ; siren : gyrophare sur le dessus)
function emFridge(x, yb, s, t, open = 0, o = {}) { let g = rect(-150, -760, 300, 760, '#f4f7fa', 30, 7);
  if (open > .02) {
    g += rect(-136, -746, 272, 732, '#fffbe6', 22, 5) + op(.7, glow(0, -400, 300, '#fff6b0', .9)) + [-560, -380, -200].map(y => line(-130, y, 130, y, 6, '#c9d3dc')).join('');
    g += rect(-100, -680, 50, 120, '#fff', 12, 5) + rect(-100, -660, 50, 30, '#5b8fd8', 0, 0) + path('M20 -380L110 -380L110 -440Z', '#ffd23f', 5) + circ(-60, -410, 30, '#e2463a', 5) + rect(-20, -250, 90, 50, '#ff8fb1', 10, 5) + circ(70, -620, 34, '#7be07b', 5) + rect(-100, -140, 200, 90, '#c9e7ff', 14, 5);
    const dw = 300 * (1 - open) + 70;
    g += path(`M150 -760L${f1(150 + dw)} ${f1(-760 - 40 * open)}L${f1(150 + dw)} ${f1(40 * open)}L150 0Z`, '#e8edf2', 7) + op(open, line(170, -600, 170 + dw * .8, -620, 6, '#c9d3dc') + line(170, -300, 170 + dw * .8, -300, 6, '#c9d3dc'));
    g += op(.28 * open, path('M-140 -700L-700 -900L-700 200L-140 -20Z', '#fff6b0', 0));
  } else {
    g += line(-150, -500, 150, -500, 6) + rect(-128, -680, 20, 140, '#c9d3dc', 10, 4) + rect(-128, -440, 20, 200, '#c9d3dc', 10, 4);
    g += G(tr(40, -620, 1, -6), rect(-50, -60, 100, 120, '#fff', 4, 4) + path('M-30 30L-10 -10L10 20L30 -20', 'none', 5, '#5b8fd8') + circ(0, -60, 10, '#e2463a', 3)) + G(tr(60, -360, 1, 5), rect(-46, -56, 92, 112, '#fff8e0', 4, 4) + ftext(0, 10, 'LISTE', { size: 22, fill: OL, stroke: 'none' }) + circ(0, -56, 10, '#36a85a', 3)) + circ(-40, -300, 14, '#ffd23f', 4) + circ(80, -180, 14, '#ff8fb1', 4);
  }
  if (o.siren) { const a = t * 9; g += rect(-50, -790, 100, 30, '#3a3f4a', 6, 5) + path('M-40 -790Q-40 -850 0 -850Q40 -850 40 -790Z', '#ff3b30', 6) + op(.45, path(`M0 -820L${f1(Math.cos(a) * 600)} ${f1(-820 + Math.sin(a) * 160 - 60)}L${f1(Math.cos(a) * 600)} ${f1(-820 + Math.sin(a) * 160 + 60)}Z`, '#ff5c5c', 0)); }
  return G(tr(x, yb, s), g); }
const emStairs = () => { let s = ''; for (let i = 0; i < 9; i++) { const xr = 330 - i * 62, y = 1250 - (i + 1) * 74; s += rect(-M, y, xr + M, 74, i % 2 ? '#c58e55' : '#b97f48', 4, 6); }
  s += line(380, 1080, -140, 410, 14) + line(380, 1080, -140, 410, 8, '#8a5a3a'); for (let i = 0; i < 8; i++) { const xr = 330 - i * 62, y = 1250 - (i + 1) * 74; s += line(xr - 20, y, xr - 20 + 50, y - 160 + 10, 5); } return s; };
function emKitchen(t, o = {}) { const yb = 1250, n = o.night;
  let s = dWall('stripe', n ? '#3d3a66' : '#fff1d6', n ? '#46437a' : '#ffe8c4', yb);
  s += rect(-M, 760, W + 2 * M, 140, n ? '#4a4f80' : '#e3f4f7', 0, 0); for (let x = -M; x < W + M; x += 70) s += line(x, 760, x, 900, 3, n ? '#5a5f90' : '#c7e2ec'); s += line(-M, 830, W + M, 830, 3, n ? '#5a5f90' : '#c7e2ec');
  s += [0, 1].map(i => rect(-40 + i * 170, 180, 160, 230, '#9fd6cf', 12, 6) + circ(-40 + i * 170 + (i ? 22 : 138), 300, 9, OL, 0)).join('');
  s += dShelf(-20, 610, 300, dJar(20, 610, '#ff9a4d', .8) + dJar(80, 610, '#7be07b', .8) + dMug(150, 610, .8, t, '#5ec4f0') + dPot(230, 610, .4, t, 2));
  s += dWindowView(380, 260, 300, 330, t, { night: n }) + rect(368, 248, 324, 354, 'none', 8, 10, '#fff') + dCurtain(350, 240, 80, 390, '#ff9a4d', t, 1) + dCurtain(630, 240, 80, 390, '#ff9a4d', t, -1);
  s += wallClock(790, 250, 50, t) + hangLamp(530, 110, t, n ? 1 : .35);
  s += rect(-M, 930, 830 + M, 320, '#5b8fd8', 0, 6) + rect(-M, 900, 850 + M, 40, '#f4f1ea', 8, 6) + [0, 1, 2].map(i => rect(-20 + i * 270, 980, 240, 120, '#6f9fe0', 10, 5) + rect(80 + i * 270, 1030, 40, 14, OL, 6, 0)).join('');
  s += G(tr(110, 900), rect(-50, -150, 100, 150, '#3a3f4a', 12, 6) + rect(-34, -70, 68, 60, 'rgba(160,220,255,.5)', 8, 4) + rect(-30, -40, 60, 30, '#6b3e26', 4, 0)) + steam(110, 730, t, .6);
  s += G(tr(300, 900), rect(-70, -90, 140, 90, '#e2463a', 22, 6) + rect(-40, -100, 24, 16, OL, 4, 0) + rect(16, -100, 24, 16, OL, 4, 0));
  s += G(tr(500, 900), path('M-80 0Q-80 -60 0 -60Q80 -60 80 0Z', '#fff', 6) + circ(-30, -66, 26, '#e2463a', 5) + circ(20, -70, 24, '#ffd23f', 5) + circ(-2, -92, 22, '#7be07b', 5)) + dPot(690, 900, .55, t, 1, '#5ec4a0');
  s += o.fridge != null ? o.fridge : emFridge(930, yb, 1, t, o.open || 0, o);
  s += dTileFloor(yb, n ? '#5a5070' : '#f2e6d0', n ? '#4a4060' : '#d9c9ae') + dBin(40, 1310, .8, '#36a85a');
  if (o.stairs) s += emStairs();
  if (n) s += op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#141838', 0, 0));
  return s; }
// ring de boxe (débat du frigo)
function emRing(t, o = {}) { let s = grad('#2a1d48', '#120b24', -M, -M, W + 2 * M, H + 2 * M);
  s += rect(-M, 120, W + 2 * M, 20, '#4a4a55', 4, 5) + [0, 1, 2, 3, 4, 5].map(i => G(tr(90 + i * 180, 140, 1, wave(t, .5, 8, i)), rect(-22, 0, 44, 50, '#2b2b33', 8, 5) + circ(0, 56, 16, i % 2 ? '#ffe08a' : '#fff', 4))).join('');
  for (let i = 0; i < 3; i++) { const x = 180 + i * 360 + wave(t, .2, 60, i * .3); s += op(.12, path(`M${f1(x - 30)} 140L${f1(x + 30)} 140L${f1(x + 280)} 1300L${f1(x - 280)} 1300Z`, '#fff6c8', 0)); }
  s += dNeon(CX, 330, o.neon || 'FIGHT NIGHT', '#ff5c8a', t, 50);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 9; i++) { const bx = -40 + i * 145 + (j % 2) * 70, by = 700 + j * 120 + wave(t, .9, 6, i * .37 + j) - (o.cheer ? Math.abs(Math.sin(t * 8 + i)) * 20 : 0), c = ['#3a2a5a', '#30234c', '#271c40'][j];
    s += circ(bx, by, 42, c, 0) + ell(bx, by + 110, 70, 70, c, 0); if ((i * 7 + j * 3) % 5 === 0) { const ph = (t * 1.7 + i * .31 + j * .5) % 1; if (ph < .1) s += op(1 - ph / .1, circ(bx + 30, by - 10, 30, '#fff', 0)); } }
  s += path('M-80 1250L1160 1250L1240 1500L-160 1500Z', '#4f86d8', 7) + path('M-160 1500L1240 1500L1240 1700L-160 1700Z', '#e2463a', 7) + [0, 1, 2, 3, 4].map(i => line(-160, 1530 + i * 34, 1240, 1530 + i * 34, 4, '#c8323a')).join('');
  s += [80, 1000].map((x, i) => rect(x - 18, 900, 36, 360, i ? '#5b8fd8' : '#e2463a', 8, 6)).join('');
  ['#e2463a', '#fff', '#5b8fd8'].forEach((c, i) => { const y = 960 + i * 80; s += line(80, y, 1000, y, 16) + line(80, y, 1000, y, 9, c); });
  return s; }
const emRingFront = () => [-40, 1120].map((x, i) => rect(x - 22, 1180, 44, 420, i ? '#5b8fd8' : '#e2463a', 8, 6) + circ(x, 1180, 30, '#fff', 6)).join('') + ['#e2463a', '#fff', '#5b8fd8'].map((c, i) => { const y = 1290 + i * 70; return line(-40, y, 1120, y, 18) + line(-40, y, 1120, y, 10, c); }).join('');
// plateau télé « débat »
function emDebate(t) { let s = grad('#1d2f7a', '#0b1238', -M, -M, W + 2 * M, H + 2 * M);
  for (let i = 0; i < 16; i++) { const x = -M + i * 180 + ((t * 60) % 180); s += line(x, 0, x - 400, 1250, 6, 'rgba(120,170,255,.12)'); }
  s += rect(-M, 150, W + 2 * M, 18, '#3a3f4a', 4, 5) + [0, 1, 2, 3, 4, 5, 6].map(i => circ(60 + i * 160, 190, 20, i % 2 ? '#8fd0ff' : '#fff', 5) + op(.1, path(`M${50 + i * 160} 200L${70 + i * 160} 200L${170 + i * 160} 1250L${-50 + i * 160} 1250Z`, '#bfe3ff', 0))).join('');
  s += rect(150, 620, 780, 360, '#0e1a4a', 20, 7) + clipR(160, 630, 760, 340, grad('#3a5bff', '#ff3d6e', 160, 630, 760, 340) + op(.25, sunburst(CX, 800, 16, 'rgba(255,255,255,.9)', 'rgba(255,255,255,0)', t * 10)), 12) +
    G(tr(CX, 790, 1 + .03 * Math.sin(t * 5)), rect(-60, -110, 120, 220, '#fff', 18, 6) + line(-60, -30, 60, -30, 5) + rect(-46, -90, 10, 40, '#c9d3dc', 4, 3) + rect(-46, -10, 10, 60, '#c9d3dc', 4, 3)) +
    G(tr(300, 680), rect(-110, -30, 220, 60, '#e2463a', 14, 5) + circ(-80, 0, 10, Math.sin(t * 6) > 0 ? '#fff' : '#ffb3b3', 0) + ftext(10, 11, 'EN DIRECT', { size: 28, fill: '#fff', stroke: 'none' })) + ftext(760, 920, 'POUR / CONTRE', { size: 30, fill: '#fff', stroke: 'none' });
  s += [40, 1040].map(x => rect(x - 40, 300, 80, 950, '#16215a', 10, 5) + [0, 1, 2, 3, 4, 5].map(j => circ(x, 360 + j * 150, 14, Math.sin(t * 4 + j + x) > 0 ? '#ffd23f' : '#3a4a8a', 0)).join('')).join('');
  s += rect(-M, 1250, W + 2 * M, 700, '#101a4a', 0, 0) + line(-M, 1250, W + M, 1250, 6, '#3a5bff') + [0, 1, 2, 3].map(i => line(-M, 1300 + i * 70, W + M, 1300 + i * 70, 3, 'rgba(120,170,255,.25)')).join('') + op(.25, ell(CX, 1360, 500, 60, '#8fb3ff', 0));
  return s; }
const emPodium = (x, label, c) => G(tr(x, 1150), path('M-150 0L150 0L120 330L-120 330Z', c, 7) + rect(-160, -20, 320, 40, '#e8edf2', 10, 6) + rect(-100, 60, 200, 60, '#fff', 10, 5) + ftext(0, 104, label, { size: 34, fill: OL, stroke: 'none' }) + line(-60, -20, -90, -110, 6) + circ(-92, -116, 12, '#3a3f4a', 4));
// salle d'interrogatoire (lampe qui se balance, miroir sans tain)
function emInterro(t, o = {}) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#5d6572', 0, 0); for (let x = -M; x < W + M; x += 160) s += line(x, -M, x, yb, 4, '#525a66');
  s += rect(-M, 980, W + 2 * M, 270, '#4c535e', 0, 0) + line(-M, 980, W + M, 980, 6, '#3d434c');
  s += rect(520, 380, 520, 420, '#1d2430', 10, 8) + (o.kev || '') + op(.16, path('M560 400L700 400L560 600Z', '#fff', 0)) + op(.1, path('M760 400L860 400L620 780L560 780Z', '#fff', 0)) + rect(520, 380, 520, 420, 'none', 10, 10, '#9aa3ad');
  s += rect(40, 420, 300, 830, '#7a8290', 8, 7) + rect(130, 480, 120, 110, '#bfe3ff', 6, 6) + line(130, 535, 250, 535, 4) + circ(300, 860, 14, '#c9d3dc', 5) + G(tr(190, 370), rect(-80, -26, 160, 52, '#fff8e0', 8, 5) + ftext(0, 12, 'SALLE 2', { size: 28, fill: OL, stroke: 'none' }));
  s += G(tr(1000, 300), rect(-50, -24, 80, 48, '#2b2b33', 8, 5) + circ(-60, 0, 14, '#3a3f4a', 4) + circ(20, -10, 7, Math.sin(t * 6) > 0 ? '#ff2b2b' : '#7a2020', 0)) + wallClock(430, 290, 40, t) + (o.photos || '');
  s += rect(-M, yb, W + 2 * M, 700, '#363b45', 0, 0) + [0, 1, 2, 3].map(i => line(-M, yb + 30 + i * 60, W + M, yb + 30 + i * 60, 3, '#2e333c')).join('');
  s += op(.32, rect(-M, -M, W + 2 * M, H + 2 * M, '#0a0c14', 0, 0));
  const a = wave(t, .45, 14);
  s += G(tr(CX, -20, 1, a), line(0, -M, 0, 330, 6) + op(.22, path('M-60 370L60 370L460 1400L-460 1400Z', '#fff6b0', 0)) + path('M-90 380L90 380L44 320L-44 320Z', '#3a3f4a', 6) + ell(0, 380, 90, 16, '#fff6b0', 5));
  return s; }
const emTable = (t) => G(tr(CX, 1170), rect(-470, 0, 940, 40, '#9aa3ad', 8, 7) + rect(-430, 40, 30, 400, '#7d848c', 0, 6) + rect(400, 40, 30, 400, '#7d848c', 0, 6) + rect(274, -60, 52, 60, '#fff', 8, 5) + G(tr(-280, -8, 1, -6), rect(-90, -14, 180, 18, '#e8b46a', 4, 5))) + steam(840, 1090, t, .5);
// chambre de l'ado (night, door 0→1, mess)
function emRoom(t, o = {}) { const yb = 1250, n = o.night, dk = o.door || 0;
  let s = dWall('dot', n ? '#2b3270' : '#dde8ff', n ? '#36408a' : '#cbdaf6', yb);
  s += dWindowView(400, 300, 260, 300, t, { night: n }) + rect(388, 288, 284, 324, 'none', 8, 10, '#fff') + dCurtain(380, 280, 70, 360, '#36a85a', t, 1) + dCurtain(610, 280, 70, 360, '#36a85a', t, -1);
  s += dPoster(110, 360, 150, 200, '#e2463a', -6, ftext(0, 10, 'GAME', { size: 40, fill: '#fff', stroke: 'none' }), t) + dPoster(270, 320, 120, 160, '#8a6ad8', 5, circ(0, 0, 36, '#ffd23f', 4), t);
  s += path('M20 230Q280 290 540 230Q790 290 1060 230', 'none', 4) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => { const x = 60 + i * 120, y = 240 + Math.abs(Math.sin(i * 1.1)) * 30; return circ(x, y + 14, 12, Math.sin(t * 4 + i) > 0 ? DPAL[i % 8] : '#555a70', 4); }).join('');
  s += dShelf(60, 640, 270, dBooks(70, 640, 120, 4) + dTrophy(230, 640, .55) + G(tr(290, 640), rect(-26, -30, 52, 30, '#2b2b33', 8, 4)));
  // porte (charnière à droite)
  s += rect(800, 520, 240, 730, n ? '#fff1b0' : '#f6e7c8', 6, 7);
  const lw = 240 * (1 - dk * .8); s += rect(1040 - lw, 520, lw, 730, '#c58e55', 6, 7) + (lw > 80 ? circ(1040 - lw + 30, 900, 12, '#ffd23f', 4) + rect(1040 - lw + 30, 580, lw - 60, 260, '#d9a06a', 8, 4) : '');
  // bureau + écran
  s += G(tr(560, 1000), rect(-170, 0, 340, 26, '#c58e55', 6, 6) + rect(-150, 26, 22, 224, '#8a5a3a', 0, 5) + rect(128, 26, 22, 224, '#8a5a3a', 0, 5) + rect(-90, -150, 180, 120, '#2b2b33', 12, 6) + rect(-78, -138, 156, 96, n ? '#7ab8ff' : '#bfe3ff', 6, 0) + rect(-14, -30, 28, 30, '#3a3f4a', 0, 4) + rect(70, -46, 60, 46, '#e2463a', 10, 4)) + op(n ? .35 : .15, glow(560, 920, 220, '#9fd0ff', .6));
  // lit
  s += rect(-60, 900, 60, 350, '#8a5a3a', 8, 7) + rect(-60, 1100, 560, 150, '#5b8fd8', 20, 7) + path('M-40 1110Q200 1060 500 1110L500 1150L-40 1150Z', '#7aa6ff', 5) + rect(10, 1060, 150, 60, '#fff', 26, 6);
  s += dParquet(yb, n ? '#4a4060' : '#c49a6c') + dRug(560, 1420, 640, 140, '#ff9a4d', '#ffd23f');
  if (o.mess !== false) s += ell(620, 1300, 90, 34, '#e2463a', 6) + ell(660, 1280, 60, 24, '#36a85a', 5) + ell(920, 1350, 80, 30, '#8a6ad8', 6) + G(tr(300, 1330, 1, -8), rect(-80, -16, 160, 32, '#e8b46a', 6, 5) + circ(-40, -16, 10, '#e2463a', 0)) + dShoes(140, 1380, .7, '#5b8fd8') + dBall(1010, 1300, .5, t * .2, '#ffd23f') + G(tr(800, 1290, 1, 20), path('M-30 0Q-30 -40 0 -40L20 -40L20 0Z', '#fff', 5)) + dBin(1030, 1250, .7, '#7aa6d8');
  if (n) s += op(.32, rect(-M, -M, W + 2 * M, H + 2 * M, '#0d1030', 0, 0)) + (dk > 0 ? op(.5 * dk, path(`M800 1250L1040 1250L${f1(1040 + 400 * dk)} 1920L${f1(800 - 300 * dk)} 1920Z`, '#fff1b0', 0)) : '');
  return s; }
// jardin (maison à gauche, fenêtre avec les parents)
function emGarden(t, o = {}) { let s = SKY(t, o.gold ? '#ffcf8a' : '#8fd3ff', o.gold ? '#fff0d6' : '#e6f6ff');
  s += op(.3, glow(900, 260, 220, '#fff6a0', .8)) + circ(900, 260, 70, '#ffe066', 6) + cloud(((t * 25) % 1400) - 200, 300, 1, '#fff') + cloud(((t * 18 + 600) % 1400) - 200, 430, .7, '#fff') + dBirds(t, 3, 340);
  s += rect(380, 330, 60, 140, '#b8413c', 4, 6) + steam(410, 300, t, .7) + path('M-120 560L230 300L580 560Z', '#d9534f', 7) + rect(-80, 560, 620, 690, '#ffe6bf', 4, 7);
  s += rect(20, 640, 200, 180, '#bfe3ff', 6, 7) + (o.win || '') + line(120, 640, 120, 820, 5) + rect(10, 818, 220, 18, '#fff', 4, 5) + rect(300, 640, 180, 180, '#bfe3ff', 6, 7) + line(390, 640, 390, 820, 5) + dCurtain(290, 630, 50, 200, '#ff8fb1', t, 1);
  s += rect(330, 960, 130, 290, '#5b8fd8', 8, 7) + circ(440, 1110, 9, '#ffd23f', 3) + rect(60, 960, 180, 140, '#bfe3ff', 6, 7) + line(150, 960, 150, 1100, 5);
  s += tree(880, 1250, 1.2, t) + dFence(-M, W + M, 1250, '#fff') + dBush(570, 1262, 1.1) + dBush(1050, 1262, .9) + dFlowers(640, 1262, 6, 3, t);
  s += rect(-M, 1250, W + 2 * M, 800, '#8fd18a', 0, 0) + [0, 1, 2, 3, 4].map(i => rect(-M, 1290 + i * 110, W + 2 * M, 55, '#84c97f', 0, 0)).join('') + line(-M, 1250, W + M, 1250, 6, '#6cb86a') + emGnome(990, 1400, .9);
  return s; }
// entrée (porte d'entrée, porte-manteau)
function emEntry(t) { const yb = 1250;
  let s = dWall('diamond', '#e6f0e0', '#d2e3c8', yb) + rect(-M, 980, W + 2 * M, 270, '#c7d9bb', 0, 0) + line(-M, 980, W + M, 980, 6, '#a9c29a');
  s += rect(560, 420, 360, 830, '#8a5a3a', 10, 8) + rect(600, 470, 280, 300, '#9a6a4a', 8, 5) + rect(600, 820, 280, 380, '#9a6a4a', 8, 5) + rect(680, 500, 120, 120, '#bfe3ff', 60, 6) + circ(880, 860, 16, '#ffd23f', 5) + rect(860, 880, 40, 14, '#ffd23f', 4, 4);
  s += line(170, 430, 170, 1250, 12) + line(90, 1250, 250, 1250, 12) + line(110, 470, 230, 470, 10) + path('M110 480Q70 600 90 760L170 760L160 490Z', '#e2463a', 6) + path('M230 480Q270 620 250 800L180 800L190 490Z', '#5b8fd8', 6) + path('M130 430Q170 380 210 430Z', '#ffd23f', 6);
  s += ell(400, 560, 80, 110, '#bfe3ff', 8) + op(.4, path('M370 500L420 480L380 620Z', '#fff', 0)) + rect(330, 720, 140, 20, '#c58e55', 4, 5) + [0, 1, 2].map(i => line(350 + i * 45, 740, 350 + i * 45, 770, 5) + circ(350 + i * 45, 780, 10, DPAL[i], 3)).join('');
  s += dFrame(1000, 520, 100, 130, 'face', '#c38a52', 3) + dSwitch(990, 760) + hangLamp(CX, 100, t, .3);
  s += G(tr(330, 1250), rect(-40, -130, 80, 130, '#36a85a', 10, 6) + line(-10, -130, -30, -220, 8, '#e2463a') + line(15, -130, 30, -200, 8, '#5b8fd8')) + dPot(1010, 1260, .8, t, 2);
  s += dParquet(yb, '#c49a6c') + rect(560, 1270, 360, 70, '#b8854f', 12, 6) + dShoes(150, 1330, .7, '#e2463a') + dShoes(320, 1360, .6, '#36a85a');
  return s; }
// salon de nuit + télé (scène émotion)
const emTV = (t, inner = '') => { const fl = .85 + .15 * Math.sin(t * 13) * Math.sin(t * 5); return op(.4 * fl, glow(CX, 780, 520, '#9fd0ff', .7)) + G(tr(CX, 1060), rect(-320, 0, 640, 190, '#6b3e26', 12, 7) + rect(-290, 30, 270, 130, '#7a4a2a', 8, 5) + rect(20, 30, 270, 130, '#7a4a2a', 8, 5) + rect(-60, -24, 120, 24, '#3a3f4a', 4, 5) + rect(-300, -380, 600, 360, '#22232a', 18, 7) + clipR(-280, -360, 560, 320, rect(-280, -360, 560, 320, '#000', 0, 0) + inner + op(.15 * (1 - fl), rect(-280, -360, 560, 320, '#fff', 0, 0)), 8)); };
const emTVRoom = (t, inner) => salonF(t, { night: 1, noSofa: 1 }) + emTV(t, inner);
// mini-image VHS dans la télé (coordonnées locales ±280 × −360..−40)
const emTVKid = (t) => G(tr(0, -200, .5), emGarden(t, { gold: 1 })) + G(tr(0, -200, .5), emKid({ x: 0, y: 160, s: .9, expr: 'ecstatic', armL: [-150, -120], armR: [-30, -60] }, t)) + op(.2, rect(-280, -360, 560, 320, '#ffb36b', 0, 0)) + ftext(-250, -320, 'PLAY', { size: 26, fill: '#fff', stroke: 'none', anchor: 'start' });
// couloir de nuit (porte du salon entrouverte, lumière bleue)
function emHall(t, o = {}) { const yb = 1250, fl = .6 + .25 * Math.sin(t * 9) * Math.sin(t * 3.7);
  let s = dWall('stripe', '#2a3060', '#323a72', yb) + rect(-M, 980, W + 2 * M, 270, '#252a55', 0, 0) + line(-M, 980, W + M, 980, 6, '#1c2046');
  s += dFrame(130, 520, 130, 160, 'face', '#c38a52', -3) + dFrame(320, 480, 110, 130, 'heart', '#8a5a3a', 2) + dFrame(250, 720, 150, 110, 'mount', '#ff9a4d', 1) + dWindowView(-60, 300, 120, 160, t, { night: 1 });
  s += G(tr(240, 1050), rect(-150, 0, 300, 24, '#8a5a3a', 6, 6) + line(-130, 24, -130, 200, 8) + line(130, 24, 130, 200, 8)) + dPot(150, 1050, .5, t, 1) + G(tr(320, 1040), rect(-30, -10, 60, 10, '#c9d3dc', 4, 4));
  s += rect(640, 420, 330, 830, '#141838', 6, 7) + op(fl, rect(646, 426, 90, 818, '#bfe3ff', 0, 0)) + rect(736, 420, 234, 830, '#5a4a6a', 6, 7) + circ(760, 860, 12, '#ffd23f', 4);
  s += dParquet(yb, '#3a3050') + rect(-M, 1300, W + 2 * M, 120, '#6a3a5a', 0, 0) + op(.35 * fl, path('M646 1250L736 1250L1000 1920L560 1920Z', '#bfe3ff', 0));
  s += op(.25, rect(-M, -M, W + 2 * M, H + 2 * M, '#0a0c24', 0, 0));
  return s; }
// toise sur l'encadrement de porte
const emToise = (x, marks, t) => rect(x - 26, 300, 52, 950, '#fff8e6', 4, 6) + marks.map(([y, lab, t0]) => t < t0 ? '' : line(x - 40, y, x + 40, y, 6, '#e2463a') + ftext(x + 50, y + 12, lab, { size: 30, fill: '#fff', anchor: 'start' })).join('');

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001a — SIGNATURE : grille encre, ado en cut-out entre ses parents qui crient, titre 3 lignes, « débloqué » sur PARENTS
const O1 = at(1, 'tu') - .12;
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3, shake: t > at(1, 'parents') && t < at(1, 'parents') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const K = at(1, 'parents'), Em = at(1, 'embrouille'), on = t > Em;
    const bolt = (x, y, sc) => t > Em ? G(tr(x, y, sc * (1 + .1 * Math.sin(t * 30)), 0), path('M0 -60L-22 6L6 6L-12 70L34 -14L6 -14L22 -60Z', '#ffd23f', 6)) : '';
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      cutout(emMom({ x: 210, y: 1490, s: .95, expr: on ? 'angry' : 'neutral', face: on ? { mouth: 'scream' } : {}, look: [1, 0], armR: on ? [-20, -10] : [70, 80] }, t), 10) +
      cutout(emDad({ x: 870, y: 1490, s: .95, expr: on ? 'rage' : 'neutral', face: on ? { mouth: 'scream' } : {}, look: [-1, 0], flip: 1, armR: on ? [-20, -10] : [70, 80] }, t + .5), 10) +
      emWaves(300, 1090, t, Em, 1, 2) + emWaves(780, 1090, t, Em, -1, 2) +
      G(tr(CX, 1490, 1 + .03 * Math.sin(t * 6)), cutout(emTeen({ x: 0, y: 0, s: 1.2, expr: t > K ? 'jawdrop' : on ? 'annoyed' : 'chill', armL: t > K ? [-150, -120] : [110, 100], armR: t > K ? [-30, -60] : [70, 80] }, t), 12)) +
      bolt(370, 950, 1) + bolt(710, 930, 1.1) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1030, 320, 320, t, K + .2, { label: 'ado.png' }) +
      kthin("POURQUOI C'EST HORRIBLE", CX, 330, t, .05, { size: 54 }) + kthin("D'ÊTRE EN EMBROUILLE", CX, 415, t, at(1, 'etre') - .1, { size: 58 }) +
      kword('AVEC SES PARENTS ?', CX, 540, t, K - .05, { size: 68, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [at(1, 'etre') - .1, 'pop_hi', .4], [at(1, 'embrouille'), 'zap', .4], [at(1, 'parents') - .05, 'boom', .6], [at(1, 'parents'), 'sparkle', .5]] });
// B001b — « Tu as quinze ans. » : papier + gobo, l'ado en cut-out, gros « 15 ANS »
B(1, { enter: 'none', trans: 'wipe', transD: .18, cam: zin(1.02, 1.08, .2),
  draw: (t, d, T) => { const A15 = at(1, '15') - O1;
    return paper(SX.paper) + gobo(T, .12) + burst(CX, 1020, 290, t, .02, '#ffe1b8', 16) +
      cutout(emTeen({ x: CX, y: 1490, s: 1.25, expr: 'cool', armR: [-60, -100], holdR: phone(0, -40, .4) }, t), 12) +
      kthin('tu as', CX, 420, t, 0, { size: 60 }) + funTag(CX, 580, '15 ANS', t, A15 - .08, { size: 100, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 580, t, A15, 6, 220); },
  sfx: [[0, 'whoosh', .4], [at(1, '15') - O1 - .08, 'pop', .7], [at(1, '15') - O1, 'sparkle', .4]] }, O1);

// B002 — « Tu descends dans la cuisine. » : l'ado zombie descend l'escalier, maman au comptoir
B(2, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ds = at(2, 'descends'), Cu = at(2, 'cuisine'), k = eInOut(seg(t, 0, d)), step = Math.abs(Math.sin(t * 9)) * 14;
    return emKitchen(t, { stairs: 1 }) + WASH() +
      emMom({ x: 760, y: 1490, s: 1.05, expr: 'neutral', look: [1, 0], flip: 1, armL: [60, 20], holdL: G(tr(0, 0, 1, 0), rect(-6, -60, 12, 70, '#8a5a3a', 4, 4)) }, t) +
      emTeen({ x: lerp(60, 330, k), y: lerp(1030, 1440, k) - step, s: 1.1, expr: 'sleep', rot: 6, armL: [130, 110], armR: [50, 70] }, t) +
      ftext(lerp(200, 470, k), lerp(560, 940, k) - (t * 40 % 30), 'z', { size: 60, fill: '#fff' }) + ftext(lerp(240, 510, k), lerp(500, 880, k) - (t * 30 % 30), 'Z', { size: 80, fill: '#fff' }) +
      kthin('tu descends dans', CX, 420, t, Ds - .1, { size: 58 }) + funTag(CX, 560, 'LA CUISINE', t, Cu - .05, { size: 64, bg: SX.acc2, fg: SX.ink, r: -4 }); },
  sfx: [[0, 'whoosh', .4], [at(2, 'descends'), 'steps', .5], [at(2, 'dans'), 'thud', .3], [at(2, 'cuisine') - .05, 'pop', .6]] });

// B003 — « Tu dis : Bonjour maman. » : grand sourire, soleil, oiseaux, bulle « bonjour maman ! »
B(3, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Di = at(3, 'dis'), Bj = at(3, 'bonjour');
    return emKitchen(t) + WASH('rgba(255,240,200,.18)') + op(.25, sunburst(530, 420, 14, 'rgba(255,240,170,.9)', 'rgba(255,240,170,0)', t * 8)) +
      emMom({ x: 790, y: 1490, s: 1.05, expr: 'neutral', look: [1, 0], flip: 1 }, t) +
      emTeen({ x: 300, y: 1490, s: 1.2, expr: t > Bj ? 'happy' : 'calm', look: [1, 0], armR: t > Bj ? [-50, -90 + Math.sin(t * 14) * 20] : [70, 80] }, t) +
      chatBubble(410, 740, 400, 120, 'Bonjour maman !', t, Bj - .05, true, 44) + popStars(300, 960, t, Bj, 6, 220) +
      kthin('tu dis :', CX, 430, t, Di - .15, { size: 60 }); },
  sfx: [[at(3, 'dis') - .15, 'pop_hi', .4], [at(3, 'bonjour') - .05, 'pop', .6], [at(3, 'bonjour'), 'chirp', .5], [at(3, 'maman'), 'sparkle', .4]] });

// B004 — « Elle répond : » : gros plan, maman se retourne lentement, la cuisine s'assombrit, regard qui brille
B(4, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.12, t / d) }),
  draw: (t, d, T) => { const Re = at(4, 'repond'), k = eOutCubic(seg(t, 0, d * .8));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: emKitchen(t), haze: .3 }]) + op(.45 * k, rect(-M, -M, W + 2 * M, H + 2 * M, '#2a0a14', 0, 0)) +
      emMomHead(CX, 960, 240, { expr: 'suspicious', look: [lerp(1.4, 0, k), 0], tilt: lerp(14, 0, k) }, t) + (t > Re ? sparkle(CX - 80, 950, .7, '#ff5c5c') + sparkle(CX + 80, 950, .7, '#ff5c5c') : '') +
      kthin('elle répond :', CX, 450, t, 0, { size: 62 }); },
  sfx: [[0, 'whoosh', .4], [at(4, 'elle'), 'sting', .5], [at(4, 'repond'), 'glint', .5]] });

// B005 — « TU POURRAIS AU MOINS RANGER TA CHAMBRE ! » : mégaphone, ondes de choc, l'ado soufflé
B(5, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 5 + (t > at(5, 'ranger') ? 4 : 0) }),
  draw: (t, d, T) => { const Po = at(5, 'pourrais'), Ra = at(5, 'ranger'), blow = Math.sin(t * 40) * 4;
    return emKitchen(t) + WASH('rgba(255,90,60,.12)') +
      emMom({ x: 250, y: 1490, s: 1.1, expr: 'rage', face: { mouth: 'scream' }, look: [1, 0], armR: [-12, -8], holdR: emMega() }, t) + emWaves(520, 980, t, Po, 1, 5) +
      emTeen({ x: 810 + blow, y: 1490, s: 1.15, expr: 'terror', rot: 12, armL: [-160, -170], armR: [-20, -10] }, t) + emBowl(980 + Math.sin(t * 7) * 30, 820 - (t * 120) % 200, .8, t * 300) +
      kthin('tu pourrais au moins', CX, 420, t, Po - .1, { size: 56 }) + kword('RANGER TA CHAMBRE !', CX, 560, t, Ra - .05, { size: 64, fill: SX.acc2 }) + emFlash(t, Ra, .5); },
  sfx: [[0, 'flash_hit', .5], [at(5, 'pourrais'), 'siren', .3], [at(5, 'ranger') - .05, 'boom', .7], [at(5, 'chambre'), 'wind', .5], [at(5, 'chambre') + .2, 'crack', .4]] });

// B006 — « FRÈRE, J'AI MÊME PAS ENCORE PRIS MON PETIT-DÉJEUNER ! » : l'ado fume, bol vide, horloge 07:02
B(6, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 3 + (t > at(6, 'petit') ? 4 : 0) }),
  draw: (t, d, T) => { const Fr = at(6, 'frere'), Pr = at(6, 'pris'), Pe = at(6, 'petit');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: emKitchen(t), haze: .25 }]) + bigClockF(820, 760, '07:02', '#ff5c5c', .6) +
      emTeen({ x: 380, y: 1490, s: 1.25, expr: 'rage', armL: [-150, -110], armR: [-40, -70], holdR: emBowl(0, -30, .9, -20) }, t) + steam(300, 820, t, 1) + steam(470, 820, t + .3, 1) +
      kword('FRÈRE,', CX, 420, t, Fr - .05, { size: 110, fill: '#fff' }) + kthin("j'ai même pas encore pris", CX, 580, t, Pr - .4, { size: 54 }) + funTag(800, 950, 'MON PETIT-DÉJEUNER !', t, Pe - .05, { size: 34, bg: SX.acc, r: 5 }); },
  sfx: [[0, 'flash_hit', .4], [at(6, 'frere') - .05, 'boom', .6], [at(6, 'pris'), 'sizzle', .4], [at(6, 'petit') - .05, 'pop', .6], [at(6, 'dejeuner'), 'growl', .5]] });

// B007 — « Bienvenue dans la vie de celui qui s'embrouille H24 avec ses parents. » : la maison sous un orage PERMANENT, voisins au soleil
function emHouse(t, storm) { let s = SKY(t, '#8fd3ff', '#e6f6ff') + circ(950, 250, 60, '#ffe066', 6) + dBirds(t, 3, 300);
  s += [[-200, 140], [1080, 140]].map(([x, w]) => rect(x, 820, w + 120, 430, '#f6d3a8', 4, 7) + path(`M${x - 20} 820L${x + 70 + w / 2} 640L${x + 160 + w} 820Z`, '#5b8fd8', 7)).join('');
  s += rect(180, 640, 720, 610, '#ffe6bf', 4, 7) + path('M140 640L540 380L940 640Z', '#d9534f', 7) + rect(700, 430, 60, 130, '#b8413c', 4, 6);
  const wins = [[250, 700], [610, 700], [250, 940]]; wins.forEach(([x, y], i) => { s += rect(x, y, 220, 170, Math.sin(t * 9 + i * 2) > .3 && storm ? '#fff6a0' : '#bfe3ff', 6, 7) + line(x + 110, y, x + 110, y + 170, 5); });
  s += rect(620, 980, 140, 270, '#5b8fd8', 8, 7) + circ(735, 1120, 9, '#ffd23f', 3) + rect(590, 1250, 200, 30, '#b8854f', 8, 5);
  s += dFence(-M, W + M, 1250, '#fff') + rect(-M, 1250, W + 2 * M, 800, '#8fd18a', 0, 0) + line(-M, 1250, W + M, 1250, 6, '#6cb86a') + dBush(120, 1262, 1) + dBush(980, 1262, 1) + dFlowers(400, 1262, 5, 2, t);
  if (storm) { const r = rng(3); for (let i = 0; i < 26; i++) { const x = 200 + r() * 680, y = 380 + ((r() * 600 + t * 900) % 600); s += line(x, y, x - 12, y + 40, 5, '#5aaee0'); }
    s += G(tr(540, 250, 1 + .03 * Math.sin(t * 3)), cloud(-160, 0, 1.6, '#6a6f80', 7) + cloud(140, -20, 1.5, '#5d6272', 7) + cloud(0, -60, 1.7, '#727788', 7));
    if ((t * 1.3) % 1 < .12) s += lightning(560, 330, 1.1); }
  return s; }
B(7, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bv = at(7, 'bienvenue'), Em = at(7, 'embrouille'), H24 = at(7, 'h24'), Pa = at(7, 'parents');
    const angry = (x, y, str, t0) => t < t0 ? '' : G(tr(x, y, pop(t, t0, .3), Math.sin(t * 12 + x) * 6), rect(-70, -40, 140, 80, '#fff', 30, 6) + ftext(0, 16, str, { size: 40, fill: '#e2463a', stroke: 'none' }));
    return emHouse(t, 1) + angry(360, 670, '#@!', Em) + angry(720, 670, '!!!', Em + .15) + angry(360, 910, 'GRR', Em + .3) +
      kthin('bienvenue dans la vie de celui qui', CX, 420, t, Bv - .1, { size: 46 }) + funTag(330, 560, "S'EMBROUILLE", t, Em - .05, { size: 46, bg: SX.acc, r: -5 }) +
      kword('H24', 790, 560, t, H24 - .05, { size: 120, fill: SX.acc2 }) + (t > Pa ? funTag(900, 1100, '7J/7', t, Pa, { size: 40, bg: '#fff', fg: SX.ink, r: 6 }) : ''); },
  sfx: [[at(7, 'bienvenue'), 'magic', .4], [at(7, 'embrouille') - .05, 'thunder', .5], [at(7, 'embrouille') + .2, 'pop', .4], [at(7, 'h24') - .05, 'boom', .6], [at(7, 'parents'), 'pop_hi', .4]] });

// B008 — « À huit ans, tu voulais rester avec eux toute la journée. » : souvenir doré au parc, le petit accroché à ses parents
B(8, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const A8 = at(8, '8'), Vo = at(8, 'voulais'), To = at(8, 'toute'), sw = Math.sin(t * 5) * 10;
    return emGarden(t, { gold: 1 }) + op(.2, rect(-M, -M, W + 2 * M, H + 2 * M, '#ffb36b', 0, 0)) +
      emMom({ x: 210, y: 1490, s: 1.0, expr: 'happy', look: [1, 0], armR: [30, 40] }, t) + emDad({ x: 870, y: 1490, s: 1.0, expr: 'happy', look: [-1, 0], flip: 1, armR: [30, 40] }, t + .5) +
      emKid({ x: CX, y: 1470 - Math.abs(Math.sin(t * 6)) * 30, s: 1.05, expr: 'ecstatic', armL: [-170 + sw, -170], armR: [-10 - sw, -10] }, t) + heartsUp(t, CX, 900, 5) +
      funTag(CX, 430, '8 ANS', t, A8 - .1, { size: 90, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 430, t, A8, 6, 180) +
      kthin('tu voulais rester avec eux', CX, 600, t, Vo - .1, { size: 52 }) + funTag(CX, 700, 'TOUTE LA JOURNÉE', t, To - .05, { size: 44, bg: '#ff8fb1', r: 3 }); },
  sfx: [[0, 'whoosh', .4], [at(8, '8') - .1, 'pop', .7], [at(8, 'voulais'), 'chirp', .4], [at(8, 'eux'), 'kiss', .4], [at(8, 'toute') - .05, 'pop_hi', .5]] });

// B009 — « À quinze ans… » : disque rayé, rayons violets, l'ado capuche + casque, bras croisés, blasé
B(9, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), shake: t < .25 ? 6 : 0 }),
  draw: (t, d, T) => { const A15 = at(9, '15');
    return rays(t, CX, 950, '#8a6ad8', '#4b2f9a', 22) + cutout(emTeen({ x: CX, y: 1490, s: 1.3, expr: 'deadpan', armL: [30, 170], armR: [150, 10] }, t), 12) +
      funTag(CX, 450, '15 ANS', t, A15 - .08, { size: 100, bg: SX.acc, r: -3 }) + popStars(CX, 450, t, A15, 6, 200); },
  sfx: [[0, 'scratch', .7], [at(9, '15') - .08, 'boom', .5], [at(9, 'ans'), 'buzz', .3]] });

// B010a — « Tu ne peux même plus ouvrir le frigo » : le frigo s'ouvre… et déclenche un gyrophare
const O10 = at(10, 'sans') - .15;
B(10, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ou = at(10, 'ouvrir'), Fr = at(10, 'frigo'), op_ = eOutCubic(seg(t, Ou, Ou + .3));
    return emKitchen(t, { open: op_, siren: t > Fr }) + WASH() + (t > Fr ? op(.18 + .12 * Math.sin(t * 18), rect(-M, -M, W + 2 * M, H + 2 * M, '#ff3b30', 0, 0)) : '') +
      emTeen({ x: 560, y: 1490, s: 1.15, expr: t > Fr ? 'shock' : 'starving', look: [1, 0], armR: [-10, 10] }, t) +
      (t > Fr ? G(tr(110, 1100 - 260 * eOutBack(seg(t, Fr, Fr + .3))), emMomHead(0, 0, 110, { expr: 'suspicious', look: [1, 0] }, t)) : '') +
      kthin('tu ne peux même plus', CX, 420, t, 0, { size: 56 }) + funTag(CX, 560, 'OUVRIR LE FRIGO', t, Fr - .1, { size: 56, bg: SX.acc2, fg: SX.ink, r: -3 }); },
  sfx: [[at(10, 'peux'), 'steps', .3], [at(10, 'ouvrir'), 'squeak', .5], [at(10, 'ouvrir') + .1, 'angel', .3], [at(10, 'frigo'), 'siren', .6]] });
// B010b — « …sans déclencher un débat. » : plateau télé « DÉBAT », maman vs l'ado, papa modérateur
B(10, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Dc = at(10, 'declencher') - O10, Db = at(10, 'debat') - O10;
    return emDebate(t) + emDad({ x: CX, y: 1440, s: .78, expr: 'smug', armL: [60, 20], armR: [120, 160] }, t) +
      emMom({ x: 220, y: 1490, s: 1.0, expr: 'angry', face: { mouth: 'talk' }, look: [1, 0], armR: [-20, -30] }, t) + emTeen({ x: 860, y: 1490, s: 1.05, expr: 'annoyed', look: [-1, 0], flip: 1 }, t) +
      emPodium(220, 'MAMAN', '#e2463a') + emPodium(860, 'TOI', EM_HOOD) +
      kthin('sans déclencher', CX, 420, t, Dc - .2, { size: 58 }) + kword('UN DÉBAT', CX, 540, t, Db - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(10, 'declencher') - O10, 'drum', .5], [at(10, 'debat') - O10 - .05, 'boom', .5], [at(10, 'debat') - O10 + .1, 'ding', .6]] }, O10);

// B011 — « Pourquoi tu manges maintenant ? » : RING DE BOXE, coin rouge : maman en gants
B(11, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .4 }),
  draw: (t, d, T) => { const Pq = at(11, 'pourquoi'), Mt = at(11, 'maintenant'), jab = Math.max(0, Math.sin(t * 14)) * 20;
    return emRing(t) + emTeen({ x: 830, y: 1490, s: 1.05, expr: 'confused', look: [-1, 0], flip: 1, armL: [60, 20], armR: [-40, -80], holdR: emSandwich(0, -20, .7) }, t) +
      emMom({ x: 260, y: 1490, s: 1.1, expr: 'angry', face: { mouth: 'talk' }, look: [1, 0], armL: [-10 - jab, -30], armR: [-30, -50], holdL: emGlove(), holdR: emGlove() }, t) + emRingFront() +
      funTag(830, 760, 'ROUND 1', t, .05, { size: 36, bg: '#fff', fg: SX.ink, r: 6 }) +
      kthin('pourquoi tu manges', CX, 420, t, Pq - .1, { size: 58 }) + kword('MAINTENANT ?', CX, 560, t, Mt - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'school_bell', .5], [at(11, 'pourquoi'), 'pop_hi', .4], [at(11, 'manges'), 'chomp', .4], [at(11, 'maintenant') - .05, 'boom', .5]] });

// B012 — « Parce que j'ai faim. » : coin bleu, l'ado en gants, sandwich, ventre qui gargouille
B(12, { enter: 'none', cam: (t, d) => ({ z: lerp(1.05, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pa = at(12, 'parce'), Fa = at(12, 'faim');
    return depth({ zoom: 1, x: 120 }, [{ z: 1.3, svg: emRing(t), haze: .1 }]) + emMom({ x: 160, y: 1490, s: 1.0, expr: 'deadpan', look: [1, 0], armL: [60, 30], armR: [120, 150], holdL: emGlove(), holdR: emGlove() }, t) +
      emTeen({ x: 640, y: 1490, s: 1.2, expr: 'starving', look: [-1, 0], flip: 1, armL: [120, 100], holdL: emSandwich(0, -10, .7), armR: [80, 60], holdR: emGlove('#5b8fd8') }, t) +
      (t > Fa ? path(`M560 ${1170}q20 -14 40 0q20 14 40 0`, 'none', 6, '#fff') + path(`M560 ${1200}q20 -14 40 0q20 14 40 0`, 'none', 6, '#fff') : '') + emRingFront() +
      kthin('parce que', CX, 420, t, Pa - .1, { size: 58 }) + funTag(CX, 560, "J'AI FAIM.", t, Fa - .05, { size: 70, bg: '#5b8fd8', r: 3 }); },
  sfx: [[at(12, 'parce'), 'pop_hi', .4], [at(12, 'faim') - .05, 'pop', .6], [at(12, 'faim'), 'growl', .6]] });

// B013 — « BAISSE D'UN TON ! » : maman pointe la télécommande, le volume de l'ado descend
B(13, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t < .35 ? 7 : 2 }),
  draw: (t, d, T) => { const Ba = at(13, 'baisse'), lvl = Math.round(lerp(8, 1, seg(t, Ba, Ba + .5)));
    let ir = ''; for (let i = 0; i < 3; i++) { const k = (t * 3 + i / 3) % 1; ir += op(1 - k, path(`M${f1(470 + k * 220)} ${f1(930 - 40)}q20 40 0 80`, 'none', 7, '#ff5c5c')); }
    return emRing(t) + emMom({ x: 260, y: 1490, s: 1.1, expr: 'rage', face: { mouth: 'scream' }, look: [1, 0], armR: [-15, -5], holdR: emRemote(20, 0, 1, 90) }, t) + (t > Ba ? ir : '') +
      emTeen({ x: 820, y: 1490, s: 1.05, expr: 'embarrassed', look: [-1, 0], flip: 1, armL: [80, 60], armR: [80, 60] }, t) + emVol(820, 760, lvl, t, .9) + emRingFront() +
      kword("BAISSE D'UN TON !", CX, 470, t, Ba - .05, { size: 72, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .5], [at(13, 'baisse') - .05, 'boom', .6], [at(13, 'baisse') + .1, 'tick', .5], [at(13, 'ton'), 'tick', .5], [at(13, 'ton') + .15, 'error_beep', .3]] });

// B014 — « MAIS J'AI JUSTE DIT QUE J'AVAIS FAIM ! » : l'ado explose, volume au MAX, maman décoiffée
B(14, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), shake: t > at(14, 'avais') ? 9 : 4 }),
  draw: (t, d, T) => { const Ma = at(14, 'mais'), Ju = at(14, 'juste'), Av = at(14, 'avais'), lvl = Math.round(lerp(1, 10, seg(t, Ma, Av)));
    return emRing(t, { cheer: 1 }) + emWaves(640, 1000, t, Ma, -1, 5) + emMom({ x: 210, y: 1490, s: 1.05, expr: 'shock', look: [1, 0], rot: -10, armL: [-160, -150], armR: [-30, -10] }, t) +
      emTeen({ x: 780, y: 1490, s: 1.15, expr: 'rage', face: { mouth: 'scream' }, look: [-1, 0], flip: 1, armL: [-140, -120], armR: [-40, -60], holdR: emSandwich(0, -20, .7) }, t) +
      emVol(780, 740, lvl, t, .9) + (lvl >= 10 ? funTag(780, 650, 'VOL. MAX', t, Av, { size: 34, bg: '#ff4d4d', r: 5 }) : '') + emRingFront() +
      kthin("mais j'ai juste dit", CX, 420, t, Ma - .1, { size: 56 }) + kword("QUE J'AVAIS FAIM !", CX, 550, t, Av - .15, { size: 70, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(14, 'mais'), 'whoosh_up', .4], [at(14, 'juste'), 'drum', .4], [at(14, 'avais') - .15, 'boom', .7], [at(14, 'faim'), 'school_bell', .5]] });

// B015 — « Tu veux sortir ? » : entrée, l'ado en veste la main sur la poignée… maman surgit du mur
B(15, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ve = at(15, 'veux'), So = at(15, 'sortir'), pk = eOutBack(seg(t, Ve, Ve + .3));
    return emEntry(t) + WASH() + emTeen({ x: 700, y: 1490, s: 1.15, expr: t > So ? 'scared' : 'happy', look: [1, 0], armR: [-10, 30], shirt: '#e2463a' }, t) +
      G(tr(-200 + 330 * pk, 0), emMom({ x: 0, y: 1490, s: 1.1, expr: 'suspicious', look: [1, 0], armR: [-30, -10] }, t)) + (t > So ? sweat(830, 950 + (t * 40) % 30, 1.1) : '') +
      kthin('tu veux', CX, 420, t, Ve - .1, { size: 60 }) + kword('SORTIR ?', CX, 560, t, So - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'steps', .4], [at(15, 'veux'), 'whoosh', .5], [at(15, 'sortir') - .05, 'boom', .4], [at(15, 'sortir') + .1, 'hmm', .5]] });

// B016 — « Interrogatoire. » : salle d'interrogatoire, lampe qui se balance, maman et papa en flics
B(16, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t < .3 ? 5 : 0 }),
  draw: (t, d, T) => { const In = at(16, 'interrogatoire');
    return emInterro(t) + emMom({ x: 190, y: 1490, s: 1.05, expr: 'suspicious', look: [1, 0], armR: [-20, 30] }, t) + emDad({ x: 890, y: 1490, s: 1.05, expr: 'suspicious', look: [-1, 0], flip: 1, armR: [-50, -100], holdR: rect(-40, -60, 80, 100, '#fff8e0', 6, 5) }, t) +
      emTeen({ x: CX, y: 1490, s: 1.1, expr: 'scared', armL: [100, 80], armR: [80, 100] }, t) + emTable(t) + sweatSpray(CX, 920, t, 4) +
      kword('INTERROGATOIRE', CX, 470, t, In - .05, { size: 80, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .4], [at(16, 'interrogatoire') - .05, 'thud', .7], [at(16, 'interrogatoire'), 'sting', .5], [at(16, 'interrogatoire') + .2, 'buzz', .3]] });

// B017 — « Avec qui ? Où ? Quand ? Pourquoi ? » : les questions pleuvent sur l'ado
B(17, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .4 }),
  draw: (t, d, T) => { const Q = [['AVEC QUI ?', at(17, 'avec'), 300, 640, '#ff8fb1'], ['OÙ ?', at(17, 'ou'), 820, 600, SX.acc2], ['QUAND ?', at(17, 'quand'), 760, 860, '#8fd0ff'], ['POURQUOI ?', at(17, 'pourquoi'), 300, 900, '#7be07b']];
    let rain = ''; for (let i = 0; i < 14; i++) { const x = (i * 83) % W, y = ((t * 900 + i * 173) % 1300) - 100; rain += ftext(x, y, '?', { size: 50 + (i % 3) * 20, fill: '#fff' }); }
    return emInterro(t) + op(.5, rain) + emMom({ x: 160, y: 1490, s: 1.0, expr: 'angry', face: { mouth: 'talk' }, look: [1, 0] }, t) + emDad({ x: 920, y: 1490, s: 1.0, expr: 'angry', face: { mouth: 'talk' }, look: [-1, 0], flip: 1 }, t) +
      emTeen({ x: CX, y: 1490, s: 1.1, expr: 'panic' }, t) + emTable(t) + sweatSpray(CX, 920, t, 6) +
      Q.map(([s, t0, x, y, c]) => { if (t < t0) return ''; const k = eOutBack(seg(t, t0, t0 + .25)); return funTag(x, lerp(y - 400, y, k), s, t, t0, { size: 46, bg: c, fg: SX.ink, r: (x > CX ? 6 : -6) }); }).join(''); },
  sfx: [[at(17, 'avec'), 'pop', .6], [at(17, 'ou'), 'pop_hi', .6], [at(17, 'quand'), 'pop', .6], [at(17, 'pourquoi'), 'pop_hi', .6], [at(17, 'pourquoi') + .1, 'drum', .4]] });

// B018 — « Et surtout… C'est qui ce Kevin ? » : maman claque la photo de Kevin sur la table ; Kevin fait coucou derrière la vitre
const emKevWave = (t, t0, x = 800, y = 900, s = .8) => t < t0 ? '' : G(tr(0, 120 * (1 - eOutBack(seg(t, t0, t0 + .35)))), emKev({ x, y: y + 300 * s / .8, s, expr: 'happy', armR: [-60, -100 + Math.sin(t * 16) * 25] }, t));
B(18, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3, shake: t > at(18, 'kevin') && t < at(18, 'kevin') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const Su = at(18, 'surtout'), Qu = at(18, 'qui'), K = at(18, 'kevin');
    const photo = t < K - .15 ? '' : G(tr(0, -200 * (1 - eOutCubic(seg(t, K - .15, K)))), emPhoto(380, 1110, 1, -8, G(tr(0, -10), kevinHead(0, 0, 50, { expr: 'happy' }, t))));
    return emInterro(t, { kev: clipR(520, 380, 520, 420, emKevWave(t, K, 800, 640, .75), 10) }) + emTeen({ x: 760, y: 1490, s: 1.1, expr: t > K ? 'deadpan' : 'worried' }, t) +
      emMom({ x: 260, y: 1490, s: 1.1, expr: 'suspicious', look: [1, 0], armR: t > K ? [30, 60] : [-30, -80] }, t) + emTable(t) + photo +
      (t > K + .1 ? funTag(900, 400, 'coucou !', t, K + .1, { size: 34, bg: '#5fb85f', r: 6 }) : '') +
      kthin('et surtout…', CX, 430, t, Su - .1, { size: 58 }) + kword("C'EST QUI CE KEVIN ?", CX, 560, t, Qu - .15, { size: 62, fill: SX.acc2 }); },
  sfx: [[at(18, 'surtout'), 'sting', .4], [at(18, 'qui') - .15, 'boom', .4], [at(18, 'kevin'), 'thud', .7], [at(18, 'kevin') + .1, 'pop_hi', .5], [at(18, 'kevin') + .3, 'boing', .4]] });

// B019 — « MAMAN, ÇA FAIT SIX ANS QUE TU CONNAIS KEVIN ! » : mur de photos maman + Kevin depuis 6 ans ; Kevin refait coucou
B(19, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 3 }),
  draw: (t, d, T) => { const Ma = at(19, 'maman'), S6 = at(19, '6'), Co = at(19, 'connais'), K = at(19, 'kevin', 2);
    const pics = [[640, 470, -6, '2020'], [880, 460, 5, '2022'], [640, 700, 4, '2024'], [880, 700, -4, '2026']].map(([x, y, r, yr], i) => { const t0 = S6 + i * .12; if (t < t0) return '';
      return G(tr(x, y, pop(t, t0, .3), 0), emPhoto(0, 0, 1, r, G(tr(-30, -6), emMomHead(0, 0, 34, { expr: 'happy' }, t)) + G(tr(32, 4), kevinHead(0, 0, 28 + i * 3, { expr: 'happy' }, t)) + ftext(0, 98, yr, { size: 24, fill: OL, stroke: 'none' }))); }).join('');
    return emInterro(t, { photos: pics }) + emMom({ x: 860, y: 1490, s: 1.05, expr: t > Co ? 'embarrassed' : 'confused', look: [-1, 0], flip: 1 }, t) +
      emTeen({ x: 300, y: 1490, s: 1.2, expr: 'rage', face: { mouth: 'scream' }, look: [1, 0], armL: [-150, -120], armR: [-30, -40] }, t) + emTable(t) +
      (t > K ? G(tr(590, 1060), emKevWave(t, K, 0, -80, .5)) : '') +
      kword('MAMAN,', CX, 400, t, Ma - .05, { size: 90, fill: '#fff', op: t > S6 ? 0 : 1 }) + kword('6 ANS !', 330, 400, t, S6 - .05, { size: 110, fill: SX.acc2 }) +
      (t > Co ? funTag(330, 560, 'TU CONNAIS KEVIN !', t, Co - .05, { size: 38, bg: '#5fb85f', r: -4 }) : ''); },
  sfx: [[0, 'flash_hit', .4], [at(19, 'maman') - .05, 'boom', .6], [at(19, '6'), 'pop', .5], [at(19, '6') + .24, 'pop', .5], [at(19, 'connais'), 'pop_hi', .4], [at(19, 'kevin', 2), 'boing', .5]] });

// B020a — « Tu restes à la maison ? » : chambre de jour, l'ado devant l'écran, papa passe la tête
const O20 = at(20, 'passes') - .15;
B(20, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Re = at(20, 'restes'), Ma = at(20, 'maison'), pk = eOutBack(seg(t, Re, Re + .3));
    return emRoom(t, { door: .6 }) + WASH() + G(tr(1200 - 270 * pk, 0), emDadHead(0, 820, 110, { expr: 'suspicious', look: [-1, 0] }, t)) +
      emTeen({ x: 420, y: 1490, s: 1.15, expr: 'chill', look: [1, -.4], armR: [-50, -90], holdR: phone(0, -40, .4) }, t) +
      kthin('tu restes', CX, 420, t, Re - .1, { size: 60 }) + funTag(CX, 560, 'À LA MAISON ?', t, Ma - .05, { size: 58, bg: SX.acc2, fg: SX.ink, r: -3 }); },
  sfx: [[0, 'whoosh', .4], [at(20, 'restes'), 'squeak', .5], [at(20, 'maison') - .05, 'pop', .6], [at(20, 'maison') + .1, 'hmm', .4]] });
// B020b — « …Tu passes ta vie enfermé ! » : des barreaux tombent, toiles d'araignée, champignon sur la tête
B(20, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(20, 'enferme') - O20 && t < at(20, 'enferme') - O20 + .3 ? 7 : 0 }),
  draw: (t, d, T) => { const Pa = at(20, 'passes') - O20, En = at(20, 'enferme') - O20, by = -900 * (1 - eOutCubic(seg(t, En - .1, En + .1)));
    let bars = rect(-M, 300 + by, W + 2 * M, 40, '#5d6572', 4, 7); for (let x = 60; x < W; x += 120) bars += rect(x - 12, 320 + by, 24, 1000, '#7d848c', 8, 6);
    const web = (x, y, s, r) => G(tr(x, y, s, r), [0, 1, 2, 3, 4].map(i => line(0, 0, Math.cos(R(i * 22)) * 160, Math.sin(R(i * 22)) * 160, 3, '#fff')).join('') + [50, 100, 150].map(rr => path(`M${rr} 0Q${rr * .8} ${rr * .4} ${rr * .71} ${rr * .71}Q${rr * .4} ${rr * .8} 0 ${rr}`, 'none', 3, '#fff')).join(''));
    return emRoom(t, { door: .6 }) + WASH('rgba(80,90,110,.25)') + web(-20, 160, 1.2, 0) + web(1100, 160, 1.2, 90) +
      emTeen({ x: 420, y: 1490, s: 1.15, expr: 'deadpan', skin: SKIN_PALE, armR: [-50, -90], holdR: phone(0, -40, .4) }, t) + G(tr(430, 940), path('M-60 0Q-60 -60 0 -60Q60 -60 60 0Z', '#e2463a', 6) + circ(-24, -30, 10, '#fff', 0) + circ(20, -40, 8, '#fff', 0) + rect(-16, 0, 32, 30, '#fff8e6', 6, 5)) +
      emMom({ x: 860, y: 1490, s: 1.0, expr: 'angry', face: { mouth: 'talk' }, look: [-1, 0], flip: 1, armR: [-20, -10] }, t) + bars +
      kthin('tu passes ta vie', CX, 420, t, Pa - .05, { size: 58 }) + kword('ENFERMÉ !', CX, 560, t, En - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(20, 'vie') - O20, 'pop_hi', .4], [at(20, 'enferme') - O20 - .1, 'whoosh', .5], [at(20, 'enferme') - O20 + .05, 'thud', .8], [at(20, 'enferme') - O20 + .1, 'crickets', .3]] }, O20);

// B021 — « Tu sors ? Tu passes ta vie dehors ! » : jardin, l'ado part en skate, maman à la fenêtre au mégaphone
B(21, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const So = at(21, 'sors'), De = at(21, 'dehors'), x = lerp(360, 820, eInOut(seg(t, So, De)));
    const board = G(tr(x, 1500), rect(-110, -12, 220, 22, '#e2463a', 11, 6) + circ(-70, 20, 16, '#3a3f4a', 5) + circ(70, 20, 16, '#3a3f4a', 5));
    return emGarden(t, { win: G(tr(120, 760), emMomHead(0, 0, 70, { expr: 'angry', face: { mouth: 'scream' }, look: [1, 0] }, t)) }) + emWaves(200, 760, t, So, 1, 3) + board +
      emTeen({ x, y: 1490, s: 1.1, expr: t > De ? 'confused' : 'cool', rot: t > De ? 0 : -6, armL: [-170, -160], armR: [-10, -20] }, t) + (t > De ? G(tr(x, 820, pop(t, De, .3)), path('M0 60Q-60 -10 -60 -50A60 60 0 0 1 60 -50Q60 -10 0 60Z', SX.acc, 7) + circ(0, -50, 22, '#fff', 5)) : '') +
      kthin('tu sors ? tu passes ta vie', CX, 420, t, So - .1, { size: 54 }) + kword('DEHORS !', CX, 560, t, De - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(21, 'sors'), 'squeak', .4], [at(21, 'passes'), 'whoosh', .4], [at(21, 'dehors') - .05, 'boom', .5], [at(21, 'dehors'), 'pop', .5]] });

// B022 — « IL FAUT QUE JE VIVE OÙ ? DANS LE JARDIN ? » : l'ado plante sa tente dans le jardin, les parents à la fenêtre
B(22, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 3 }),
  draw: (t, d, T) => { const Fa = at(22, 'faut'), Vi = at(22, 'vive'), Da = at(22, 'dans'), Ja = at(22, 'jardin'), hit = Math.sin(t * 16);
    const win = G(tr(70, 770), emMomHead(0, 0, 60, { expr: 'jawdrop' }, t)) + G(tr(170, 770), emDadHead(0, 0, 60, { expr: 'jawdrop' }, t));
    const mallet = G(tr(0, 0), line(0, 0, 0, -110, 10, '#8a5a3a') + rect(-40, -140, 80, 40, '#8a5a3a', 8, 6));
    return emGarden(t, { win }) + emTent(740, 1320, 1, eOutBack(seg(t, Ja - .1, Ja + .25)), t) +
      emTeen({ x: 360, y: 1490, s: 1.15, expr: 'rage', face: { mouth: 'scream' }, look: [1, 0], armR: hit > 0 ? [-60, -100] : [10, 30], holdR: mallet }, t) + (t > Vi && hit < -.8 ? impactStar(520, 1350, .6) : '') +
      kthin('il faut que je vive où ?', CX, 420, t, Fa - .1, { size: 56 }) + kword('DANS LE JARDIN ?', CX, 560, t, Da - .05, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(22, 'vive'), 'hammer', .6], [at(22, 'ou'), 'hammer', .6], [at(22, 'dans') - .05, 'boom', .5], [at(22, 'jardin'), 'boing', .6]] });

// B023 — « Le soir, ton père entre dans ta chambre. » : chambre de nuit, la porte s'ouvre, silhouette de papa à contre-jour
B(23, { enter: 'none', trans: 'black', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const So = at(23, 'soir'), Pe = at(23, 'pere'), En = at(23, 'entre'), dk = eOutCubic(seg(t, Pe - .2, En + .2));
    return emRoom(t, { night: 1, door: dk }) + (dk > .3 ? op(seg(t, Pe, En + .2), emDad({ x: 900, y: 1490, s: 1.0, expr: 'neutral', look: [-1, 0], flip: 1 }, t)) : '') +
      emTeen({ x: 380, y: 1490, s: 1.1, expr: t > En ? 'scared' : 'chill', look: [1, 0], armR: [-50, -90], holdR: phone(0, -40, .4) }, t) + op(.3, glow(400, 980, 200, '#9fd0ff', .7)) +
      kthin('le soir,', CX, 420, t, So - .15, { size: 62 }) + funTag(CX, 560, 'TON PÈRE', t, Pe - .05, { size: 62, bg: '#36a85a', r: -3 }); },
  sfx: [[0, 'crickets', .4], [at(23, 'pere') - .05, 'pop', .5], [at(23, 'entre'), 'squeak', .6], [at(23, 'chambre'), 'steps', .4]] });

// B024 — « Il te demande de ranger. » : papa montre le bazar, chaque tas entouré au marqueur
B(24, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const De = at(24, 'demande'), Ra = at(24, 'ranger');
    return emRoom(t, { night: 1, door: 1 }) + emDad({ x: 820, y: 1490, s: 1.05, expr: 'annoyed', look: [-1, .5], flip: 1, armR: [-10, 10] }, t) +
      emTeen({ x: 330, y: 1490, s: 1.05, expr: 'annoyed', look: [1, 0], armR: [-50, -90], holdR: phone(0, -40, .4) }, t) +
      markerCircle(620, 1290, 130, 60, t, Ra, { col: SX.acc2 }) + markerCircle(300, 1330, 120, 50, t, Ra + .1, { col: SX.acc2 }) + markerArrow(740, 980, 640, 1180, t, De, { bend: 30 }) +
      kthin('il te demande de', CX, 420, t, De - .2, { size: 58 }) + kword('RANGER.', CX, 560, t, Ra - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[at(24, 'demande'), 'scratch', .4], [at(24, 'ranger') - .05, 'boom', .4], [at(24, 'ranger'), 'scratch', .5], [at(24, 'ranger') + .1, 'scratch', .4]] });

// B025 — « Tu réponds : Je vais le faire. » : vautré sur le lit, pouce levé, barre de chargement bloquée à 1 %
B(25, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .2 }),
  draw: (t, d, T) => { const Rp = at(25, 'reponds'), Va = at(25, 'vais');
    const bar = t < Va + .1 ? '' : G(tr(CX, 960, pop(t, Va + .1, .3)), rect(-260, -50, 520, 100, '#fff', 20, 6) + rect(-240, -10, 480, 34, '#dfe5ea', 12, 4) + rect(-240, -10, 12, 34, '#7be07b', 6, 0) + ftext(0, -20, 'RANGEMENT : 1 %', { size: 26, fill: OL, stroke: 'none' }));
    return emRoom(t, { night: 1, door: 1 }) + G(tr(480, 1095, 1, -88), emTeen({ x: 0, y: 0, s: 1.0, expr: 'chill', armR: [-10, -40], armL: [100, 80] }, t)) +
      emDad({ x: 880, y: 1490, s: 1.0, expr: 'deadpan', look: [-1, 0], flip: 1 }, t) + chatBubble(400, 740, 420, 110, 'je vais le faire', t, Va - .05, true, 40) + bar +
      kthin('tu réponds :', CX, 430, t, Rp - .15, { size: 60 }); },
  sfx: [[at(25, 'reponds'), 'pop_hi', .4], [at(25, 'vais') - .05, 'pop', .5], [at(25, 'faire'), 'error_beep', .3], [at(25, 'faire') + .2, 'crickets', .3]] });

// B026 — « Il dit : Fais-le maintenant. » : papa en contre-plongée, chrono en main
B(26, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 1100, shake: t > at(26, 'maintenant') ? 4 : 0 }),
  draw: (t, d, T) => { const Di = at(26, 'dit'), Fa = at(26, 'fais'), Mt = at(26, 'maintenant');
    const watch = G(tr(0, -30), circ(0, 0, 50, '#fff', 7) + rect(-12, -70, 24, 20, '#c9d3dc', 4, 5) + line(0, 0, Math.cos(t * 8) * 34, Math.sin(t * 8) * 34, 6, '#e2463a'));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: emRoom(t, { night: 1, door: 1 }), haze: .3 }]) +
      emDad({ x: CX, y: 1600, s: 1.45, expr: t > Mt ? 'angry' : 'annoyed', armR: [-60, -100], holdR: watch, armL: [130, 100] }, t) +
      kthin('il dit :', CX, 400, t, Di - .15, { size: 58 }) + kthin('fais-le', CX, 480, t, Fa - .1, { size: 62 }) + kword('MAINTENANT.', CX, 600, t, Mt - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(26, 'fais'), 'tick', .5], [at(26, 'maintenant') - .05, 'boom', .5], [at(26, 'maintenant'), 'clock_fast', .4]] });

// B027 — « Tu t'énerves. Il s'énerve. » : face à face, la vapeur monte d'un côté puis de l'autre, thermomètre
B(27, { enter: 'none', trans: 'glitch', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), shake: t > at(27, 'enerve', 2) ? 5 : 2 }),
  draw: (t, d, T) => { const E1 = at(27, 'enerve'), E2 = at(27, 'enerve', 2), lv = .3 * seg(t, 0, E1) + .35 * seg(t, E1, E1 + .3) + .35 * seg(t, E2, E2 + .3);
    const th = G(tr(CX, 900), rect(-26, -220, 52, 380, '#fff', 26, 6) + rect(-14, 140 - 340 * lv, 28, 340 * lv, '#ff4d4d', 10, 0) + circ(0, 190, 46, '#ff4d4d', 6));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: emRoom(t, { night: 1, door: 1 }), haze: .35 }]) + op(.25 * lv, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff2b2b', 0, 0)) +
      emTeenHead(270, 960, 170, { expr: t > E1 ? 'rage' : 'annoyed', look: [1, 0], burn: t > E1 ? .6 : 0 }, t) + emDadHead(810, 960, 170, { expr: t > E2 ? 'rage' : 'annoyed', look: [-1, 0], burn: t > E2 ? .6 : 0 }, t) + th +
      (t > E1 ? steam(200, 760, t, 1.2) + steam(340, 760, t + .3, 1.2) : '') + (t > E2 ? steam(740, 760, t, 1.2) + steam(880, 760, t + .3, 1.2) : '') +
      kthin("tu t'énerves.", 270, 450, t, E1 - .25, { size: 52 }) + kthin("il s'énerve.", 810, 450, t, E2 - .3, { size: 52 }); },
  sfx: [[at(27, 'enerve') - .1, 'sizzle', .5], [at(27, 'enerve'), 'growl', .5], [at(27, 'enerve', 2) - .1, 'sizzle', .5], [at(27, 'enerve', 2), 'growl', .6]] });

// B028 — « Et trois minutes plus tard… » : carton façon dessin animé, horloge qui tourne à toute vitesse
B(28, { enter: 'none', trans: 'circle', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const T3 = at(28, '3'), Ta = at(28, 'tard');
    const clock = G(tr(CX, 960, 1.3), circ(0, 0, 150, '#fff', 8) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => line(Math.cos(i * .5236) * 120, Math.sin(i * .5236) * 120, Math.cos(i * .5236) * 136, Math.sin(i * .5236) * 136, 6)).join('') +
      line(0, 0, Math.cos(t * 14) * 110, Math.sin(t * 14) * 110, 9, '#e2463a') + line(0, 0, Math.cos(t * 2) * 70, Math.sin(t * 2) * 70, 12) + circ(0, 0, 12, OL, 0));
    return paper('#ffe9a8') + gobo(T, .1) + blob(CX, 960, 330, t, '#ffd23f', 4) + clock + popStars(CX, 960, t, Ta, 8, 320) +
      kword('3 MINUTES', CX, 470, t, T3 - .05, { size: 110, fill: '#fff' }) + kthin('plus tard…', CX, 620, t, Ta - .3, { size: 70, fill: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [at(28, '3') - .05, 'boom', .4], [at(28, 'minutes'), 'clock_fast', .6], [at(28, 'tard'), 'ding', .5]] });

// B029a — « Vous vous disputez pour un chargeur » : tir à la corde père/fils avec un câble, le chargeur au milieu
const O29 = at(29, 'qui') - .15;
B(29, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 5 }),
  draw: (t, d, T) => { const Di = at(29, 'disputez'), Ch = at(29, 'chargeur'), sw = Math.sin(t * 7) * 40;
    const cx = CX + sw, cy = 1090;
    return emRoom(t, { night: 1, door: 1 }) + WASH('rgba(255,80,60,.1)') +
      emTeen({ x: 230 + sw, y: 1490, s: 1.1, expr: 'rage', look: [1, 0], rot: -12, armR: [-5, 0], armL: [-10, 10] }, t) + emDad({ x: 860 + sw, y: 1490, s: 1.1, expr: 'rage', look: [-1, 0], flip: 1, rot: 12, armR: [-5, 0], armL: [-10, 10] }, t) +
      path(`M${f1(400 + sw)} 1020Q${f1(cx - 60)} ${cy + 30} ${f1(cx)} ${cy}Q${f1(cx + 60)} ${cy - 30} ${f1(690 + sw)} 1020`, 'none', 12) + path(`M${f1(400 + sw)} 1020Q${f1(cx - 60)} ${cy + 30} ${f1(cx)} ${cy}Q${f1(cx + 60)} ${cy - 30} ${f1(690 + sw)} 1020`, 'none', 6, '#fff') +
      emCharger(cx, cy - 40, .7, t, { scared: 1, shake: 1, r: sw * .3 }) + (Math.sin(t * 7) > .9 ? impactStar(cx, cy - 160, .5) : '') +
      kthin('vous vous disputez pour', CX, 420, t, Di - .2, { size: 54 }) + funTag(CX, 560, 'UN CHARGEUR', t, Ch - .05, { size: 62, bg: SX.acc2, fg: SX.ink, r: -3 }); },
  sfx: [[0, 'flash_hit', .4], [at(29, 'disputez'), 'growl', .5], [at(29, 'pour'), 'whoosh', .4], [at(29, 'chargeur') - .05, 'pop', .6], [at(29, 'chargeur') + .1, 'squeak', .5]] });
// B029b — « …qui n'a rien demandé à personne. » : gros plan sur le chargeur qui pleure, les deux se disputent flous derrière
B(29, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ri = at(29, 'rien') - O29, Pe = at(29, 'personne') - O29;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: emRoom(t, { night: 1, door: 1 }) + emTeen({ x: 200, y: 1490, s: 1.1, expr: 'rage', look: [1, 0] }, t) + emDad({ x: 880, y: 1490, s: 1.1, expr: 'rage', look: [-1, 0], flip: 1 }, t), blur: 8, haze: .3 }]) +
      emCharger(CX, 980, 1.6, t, { cry: 1 }) + path('M540 1140Q520 1300 600 1400Q700 1500 640 1700', 'none', 16) + path('M540 1140Q520 1300 600 1400Q700 1500 640 1700', 'none', 9, '#fff') +
      kthin("qui n'a", CX, 410, t, 0, { size: 58 }) + kword('RIEN DEMANDÉ', CX, 530, t, Ri - .05, { size: 90, fill: SX.acc2 }) + (t > Pe ? funTag(820, 760, 'À PERSONNE', t, Pe - .05, { size: 40, bg: '#8fd0ff', fg: SX.ink, r: 6 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(29, 'rien') - O29 - .05, 'boom', .4], [at(29, 'demande') - O29, 'ghost', .3], [at(29, 'personne') - O29, 'pop_hi', .4], [at(29, 'personne') - O29 + .2, 'gulp', .5]] }, O29);

// B030a — « Puis un soir, tu surprends tes parents » : couloir de nuit, l'ado sur la pointe des pieds, lumière bleue de la télé
const O30 = at(30, 'en') - .15;
B(30, { enter: 'none', trans: 'black', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const So = at(30, 'soir'), Pa = at(30, 'parents'), x = lerp(250, 460, seg(t, 0, d));
    const glass = G(tr(0, -20), rect(-22, -50, 44, 70, 'rgba(200,235,255,.6)', 6, 5) + rect(-18, -20, 36, 36, 'rgba(140,200,255,.7)', 4, 0));
    return emHall(t) + emTeen({ x, y: 1490 - Math.abs(Math.sin(t * 5)) * 10, s: 1.1, expr: t > Pa ? 'wow' : 'calm', look: [1, 0], armR: [-30, -80], holdR: glass, armL: [150, 120] }, t) + op(.25, glow(x + 80, 980, 180, '#bfe3ff', .6)) +
      kthin('puis un soir,', CX, 420, t, So - .2, { size: 60 }) + funTag(CX, 560, 'TES PARENTS', t, Pa - .05, { size: 56, bg: '#8fd0ff', fg: SX.ink, r: -3 }); },
  sfx: [[0, 'crickets', .4], [at(30, 'surprends'), 'tiptoe', .5], [at(30, 'parents') - .05, 'pop', .4], [at(30, 'parents') + .2, 'tiptoe', .4]] });
// B030b — « …en train de regarder une vieille vidéo. » : par-dessus l'épaule, les parents sur le canapé devant la télé
B(30, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .15 }),
  draw: (t, d, T) => { const Re = at(30, 'regarder') - O30, Vi = at(30, 'vieille') - O30;
    const sofaBack = path('M-80 1200Q-80 1140 0 1140L1080 1140Q1160 1140 1160 1200L1160 1500L-80 1500Z', '#3e8a70', 7) + path('M0 1180L1080 1180', 'none', 5, '#2f6e58');
    return emTVRoom(t, emTVKid(t)) + emBackHead(380, 1110, 105, '#8a5a3a', SK[2], 1) + emBackHead(700, 1105, 100, '#4a3428', SK[4], 0) + sofaBack +
      kthin('en train de regarder', CX, 420, t, Re - .25, { size: 56 }) + funTag(CX, 540, 'UNE VIEILLE VIDÉO', t, Vi - .1, { size: 50, bg: SX.acc2, fg: SX.ink, r: -3 }); },
  sfx: [[0, 'whoosh', .3], [at(30, 'regarder') - O30, 'rewind', .4], [at(30, 'vieille') - O30 - .1, 'pop', .5], [at(30, 'video') - O30, 'baby_coo', .3]] }, O30);

// B031 — « Tu as cinq ans. » : plein écran VHS, le petit (5 ans) dans le jardin
function emVHS(t, inner) { let s = inner + op(.16, rect(-M, -M, W + 2 * M, H + 2 * M, '#ffb36b', 0, 0));
  for (let y = 0; y < H; y += 10) s += rect(-M, y, W + 2 * M, 3, 'rgba(0,0,0,.07)', 0, 0);
  const by = (t * 260) % (H + 200) - 100; s += op(.25, rect(-M, by, W + 2 * M, 36, '#fff', 0, 0));
  s += G(tr(130, 380), path('M-18 -24L20 0L-18 24Z', '#fff', 5) + ftext(34, 16, 'PLAY', { size: 44, fill: '#fff', anchor: 'start' })) + ftext(950, 396, '14 JUIL. 2016', { size: 40, fill: '#fff', anchor: 'end' });
  return s; }
B(31, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .5 }),
  draw: (t, d, T) => { const A5 = at(31, '5');
    return emVHS(t, emGarden(t, { gold: 1 }) + emKid({ x: CX, y: 1460 - Math.abs(Math.sin(t * 7)) * 24, s: .85, expr: 'ecstatic', armL: [-150, -120], armR: [-30, -60] }, t) + dBall(760, 1420, .8, t, '#e2463a')) +
      funTag(CX, 560, '5 ANS', t, A5 - .08, { size: 100, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 560, t, A5, 6, 200); },
  sfx: [[0, 'rewind', .4], [at(31, '5') - .08, 'pop', .6], [at(31, 'ans'), 'baby_coo', .4]] });

// B032 — « Tu cours vers eux en criant : » : VHS, le petit court vers la caméra (vers ses parents)
B(32, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .6 }),
  draw: (t, d, T) => { const Co = at(32, 'cours'), k = eInOut(seg(t, Co, d)), run = Math.sin(t * 16) * 30;
    return emVHS(t, emGarden(t, { gold: 1 }) + emKid({ x: CX + Math.sin(t * 8) * 20, y: lerp(1350, 1560, k), s: lerp(.6, 1.25, k), expr: 'ecstatic', face: { mouth: 'scream' }, armL: [-150 + run, -120], armR: [-30 - run, -60], legL: [90 + run, 90], legR: [90 - run, 90] }, t)) +
      kthin('tu cours vers eux', CX, 560, t, Co - .1, { size: 60 }) + kthin('en criant :', CX, 660, t, at(32, 'criant') - .2, { size: 56 }); },
  sfx: [[at(32, 'cours'), 'steps', .5], [at(32, 'eux'), 'steps', .4], [at(32, 'criant'), 'whoosh_up', .3]] });

// B033 — « ATTENDEZ-MOI ! » : le petit tout près de l'objectif, bras grands ouverts
B(33, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t < .4 ? 4 : 1, hand: .5 }),
  draw: (t, d, T) => { const At = at(33, 'attendez');
    return emVHS(t, emGarden(t, { gold: 1 }) + emKid({ x: CX, y: 1700, s: 1.6, expr: 'ecstatic', face: { mouth: 'scream' }, armL: [-160, -150], armR: [-20, -30] }, t) + heartsUp(t, CX, 900, 4)) +
      kword('ATTENDEZ-MOI !', CX, 560, t, At - .05, { size: 82, fill: SX.acc2 }) + emFlash(t, At, .4); },
  sfx: [[0, 'flash_hit', .3], [at(33, 'attendez') - .05, 'boom', .4], [at(33, 'moi'), 'baby_coo', .6], [at(33, 'moi') + .2, 'sparkle', .4]] });

// B034 — « Ta mère sourit. » : gros plan maman éclairée par la télé, une larme brille
B(34, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const So = at(34, 'sourit');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: emTVRoom(t, emTVKid(t)), haze: .35, blur: 6 }]) + op(.35, glow(CX, 960, 380, '#9fd0ff', .7)) +
      emMomHead(CX, 990, 230, { expr: t > So ? 'happy' : 'calm', face: t > So ? { blush: 1 } : {} }, t) + (t > So ? sparkle(CX - 90, 1050 + (t - So) * 40, .5, '#bfe3ff') : '') +
      kthin('ta mère sourit.', CX, 450, t, at(34, 'ta') - .1, { size: 64 }); },
  sfx: [[at(34, 'mere'), 'pop_hi', .3], [at(34, 'sourit'), 'glint', .5], [at(34, 'sourit') + .1, 'sparkle', .3]] });

// B035 — « Il voulait toujours être avec nous… » : les parents sur le canapé, papa passe le bras autour de maman
B(35, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .15 }),
  draw: (t, d, T) => { const Vo = at(35, 'voulait'), Av = at(35, 'avec');
    return salonF(t, { night: 1, noSofa: 1 }) + op(.35 + .1 * Math.sin(t * 9), glow(CX, 900, 520, '#9fd0ff', .7)) +
      emMom({ x: 420, y: 1440, s: 1.0, expr: 'happy', face: { mouth: 'talk' }, look: [1, -.3] }, t) + emDad({ x: 680, y: 1440, s: 1.0, expr: 'calm', look: [-1, 0], flip: 1, armL: [-120, 160] }, t + .5) + sofa(CX, 1500, 1.0, '#3e8a70') +
      heartsUp(t, CX, 820, 3, 200) + kthin('il voulait toujours', CX, 430, t, Vo - .1, { size: 58 }) + kthin('être avec nous…', CX, 530, t, Av - .25, { size: 58, fill: SX.acc2 }); },
  sfx: [[at(35, 'voulait'), 'pop_hi', .3], [at(35, 'toujours'), 'kiss', .3], [at(35, 'avec'), 'sparkle', .3]] });

// B036 — « Tu restes derrière la porte. Silencieux. » : l'ado dans le couloir, un trait de lumière sur le visage
B(36, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.02, 1.1, eInOut(t / d)), hand: .15 }),
  draw: (t, d, T) => { const Re = at(36, 'restes'), Si = at(36, 'silencieux');
    const glass = G(tr(0, -20), rect(-22, -50, 44, 70, 'rgba(200,235,255,.6)', 6, 5) + rect(-18, -20, 36, 36, 'rgba(140,200,255,.7)', 4, 0));
    return emHall(t) + emTeen({ x: 540, y: 1490, s: 1.15, expr: t > Si ? 'sad' : 'calm', look: [1, 0], armR: [30, -40], holdR: glass, armL: [100, 80] }, t) +
      op(.3 + .1 * Math.sin(t * 9), path('M600 900L700 900L700 1100L600 1100Z', '#bfe3ff', 0)) +
      kthin('tu restes derrière la porte.', CX, 430, t, Re - .2, { size: 54 }) + kthin('silencieux.', CX, 540, t, Si - .1, { size: 62, fill: SX.acc2 }); },
  sfx: [[0, 'crickets', .3], [at(36, 'restes'), 'heartbeat', .4], [at(36, 'porte'), 'hmm', .2], [at(36, 'silencieux'), 'heartbeat', .4]] });

// B037 — « Parce qu'au fond, tu les aimes toujours. » : gros plan, un cœur s'allume dans la poitrine — débloqué (2/3)
B(37, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .15 }),
  draw: (t, d, T) => { const Fo = at(37, 'fond'), Ai = at(37, 'aimes'), hb = 1 + .12 * Math.max(0, Math.sin(t * 9));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: emHall(t), haze: .3 }]) + unlock(CX, 1190, t, Ai, { part: 'back', r: 400 }) +
      emTeen({ x: CX, y: 1560, s: 1.4, expr: t > Ai ? 'happy' : 'sad', face: t > Ai ? { blush: 1 } : {} }, t) + (t > Ai - .1 ? op(.5, glow(CX, 1190, 160, '#ff8fb1', .9)) + heart(CX, 1190, 1.3 * hb * pop(t, Ai - .1, .3), '#ff5d73') : '') +
      unlock(CX, 1190, t, Ai, { part: 'front', r: 400 }) +
      kthin("parce qu'au fond,", CX, 430, t, Fo - .3, { size: 58 }) + kword('TU LES AIMES', CX, 560, t, Ai - .15, { size: 96, fill: SX.acc2 }); },
  sfx: [[at(37, 'fond'), 'heartbeat', .5], [at(37, 'aimes') - .15, 'boom', .3], [at(37, 'aimes'), 'sparkle', .5], [at(37, 'toujours'), 'heartbeat', .5]] });

// B038 — « Tu veux simplement qu'ils te laissent grandir. » : toise sur l'encadrement de porte, l'ado s'étire au-dessus du trait « 15 ANS »
B(38, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .15 }),
  draw: (t, d, T) => { const Si = at(38, 'simplement'), Gr = at(38, 'grandir'), up = eOutBack(seg(t, Gr, Gr + .35)), s = 1.08 + .07 * up;
    const top = 1490 - 494 * s * .95;
    return emHall(t) + emToise(720, [[1157, '5 ANS', 0], [1098, '8 ANS', 0], [928, '15 ANS', 0]], t) + emTeen({ x: 600, y: 1490, s, expr: t > Gr ? 'proud' : 'calm', look: [-.6, 0], armL: [-120, -100] }, t) +
      (t > Gr ? line(680, top, 760, top, 6, SX.acc2) + markerArrow(860, top + 120, 860, top - 40, t, Gr, { col: SX.acc2 }) : '') +
      kthin("tu veux simplement qu'ils te laissent", CX, 420, t, Si - .15, { size: 44 }) + kword('GRANDIR', CX, 560, t, Gr - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[at(38, 'simplement'), 'pop_hi', .3], [at(38, 'laissent'), 'scratch', .3], [at(38, 'grandir') - .05, 'whoosh_up', .5], [at(38, 'grandir'), 'magic', .4]] });

// B039a — « Et eux essaient encore de comprendre » : les parents sur le canapé avec « L'ADO : MODE D'EMPLOI », perdus
const O39 = at(39, 'comment') - .15;
B(39, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .15 }),
  draw: (t, d, T) => { const Es = at(39, 'essaient'), Cp = at(39, 'comprendre'), rot = t > Cp ? 180 : 0;
    return salonF(t, { noSofa: 1 }) + emMom({ x: 400, y: 1440, s: 1.0, expr: 'confused', look: [.6, -1] }, t) + emDad({ x: 700, y: 1440, s: 1.0, expr: 'confused', look: [-.6, -1], flip: 1 }, t + .5) + sofa(CX, 1500, 1.0, '#5ec4a0') +
      G(tr(CX, 830, pop(t, Es, .3), 0), G(`rotate(${f1(lerp(0, rot, seg(t, Cp, Cp + .3)))})`, emBook(0, 0, .9, 0, "L'ADO :", "MODE D'EMPLOI"))) +
      (t > Cp ? ftext(260, 860, '?', { size: 100, fill: '#fff' }) + ftext(830, 840, '?', { size: 80, fill: '#fff' }) : '') +
      kthin('et eux essaient encore', CX, 420, t, Es - .2, { size: 56 }) + kword('DE COMPRENDRE', CX, 560, t, Cp - .05, { size: 86, fill: SX.acc2 }); },
  sfx: [[at(39, 'essaient'), 'pop', .5], [at(39, 'encore'), 'printer', .2], [at(39, 'comprendre') - .05, 'whoosh', .4], [at(39, 'comprendre') + .2, 'hmm', .4]] });
// B039b — « …comment leur petit garçon est devenu un adolescent. » : papier, le petit en cut-out → flèche → l'ado
B(39, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .15 }),
  draw: (t, d, T) => { const Pe = at(39, 'petit') - O39, De = at(39, 'devenu') - O39, Ad = at(39, 'adolescent') - O39;
    return paper(SX.paper) + gobo(T, .1) + blob(300, 1080, 230, t, '#ffe1b8', 2) + blob(790, 1060, 260, t, '#e1dcff', 5) +
      cutout(emKid({ x: 290, y: 1440, s: .95, expr: 'ecstatic', armL: [-150, -120], armR: [-30, -60] }, t), 10) +
      (t > De - .2 ? cutout(emTeen({ x: 790, y: 1490, s: 1.15 * pop(t, De - .2, .35), expr: 'cool' }, t), 12) : '') + markerArrow(420, 900, 640, 900, t, De - .1, { bend: -50 }) +
      kthin('comment leur', CX, 420, t, 0, { size: 56 }) + funTag(300, 690, 'PETIT GARÇON', t, Pe - .05, { size: 44, bg: SX.acc2, fg: SX.ink, r: -5 }) +
      kthin('est devenu', CX, 520, t, De - .15, { size: 52 }) + kword('UN ADOLESCENT', 760, 690, t, Ad - .1, { size: 60, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(39, 'petit') - O39 - .05, 'pop', .5], [at(39, 'devenu') - O39 - .2, 'whoosh_up', .5], [at(39, 'adolescent') - O39 - .1, 'boom', .4], [at(39, 'adolescent') - O39 + .1, 'sparkle', .4]] }, O39);

// B040 — « LE PLUS TRISTE, C'EST QUE VOUS VOUS AIMEZ… » : cuisine du soir, chacun boude dans son coin… un grand cœur les relie — débloqué (3/3)
B(40, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Tr = at(40, 'triste'), Vo = at(40, 'vous'), Ai = at(40, 'aimez'), hk = pop(t, Ai - .1, .4);
    return emKitchen(t, { night: 1 }) + unlock(CX, 900, t, Ai, { part: 'back', r: 470 }) +
      emMom({ x: 200, y: 1490, s: 1.0, expr: t > Ai ? 'sad' : 'annoyed', look: [-1, 0], flip: 1, armL: [30, 170], armR: [150, 10] }, t) +
      emDad({ x: 880, y: 1490, s: 1.0, expr: t > Ai ? 'sad' : 'annoyed', look: [1, 0], armL: [30, 170], armR: [150, 10] }, t + .5) +
      emTeen({ x: CX, y: 1490, s: 1.1, expr: t > Ai ? 'sad' : 'deadpan', armL: [30, 170], armR: [150, 10] }, t) +
      (hk > 0 ? op(.5, glow(CX, 790, 200, '#ff8fb1', .8)) + heart(CX, 790, 2.4 * hk, '#ff5d73') : '') + unlock(CX, 900, t, Ai, { part: 'front', r: 470 }) +
      kthin('le plus triste,', CX, 420, t, Tr - .3, { size: 60, fill: '#fff' }) + kword('VOUS VOUS AIMEZ…', CX, 560, t, Vo - .1, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .3], [at(40, 'triste'), 'sting', .4], [at(40, 'vous') - .1, 'boom', .4], [at(40, 'aimez'), 'heartbeat', .5], [at(40, 'aimez') + .1, 'sparkle', .5]] });

// B041 — FIN : « MAIS QUE VOUS AVEZ PARFOIS OUBLIÉ COMMENT VOUS PARLER. » : papa tend un téléphone à ficelle, l'ado le prend… le chargeur sourit
B(41, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ma = at(41, 'mais'), Ob = at(41, 'oublie'), Co = at(41, 'comment'), Pa = at(41, 'parler'), k = eOutCubic(seg(t, Co, Pa));
    const strg = t > Co ? path(`M${f1(lerp(800, 330, 0))} 1010Q${f1(CX)} ${f1(1060 - 40 * k)} ${f1(lerp(800, 330, k))} ${f1(lerp(1010, 1000, k))}`, 'none', 5, '#fff') : '';
    return emKitchen(t, { night: 1 }) + WASH('rgba(255,200,150,.08)') +
      emMom({ x: CX, y: 1440, s: .9, expr: t > Pa ? 'happy' : 'worried', look: [0, 0] }, t + .3) +
      emDad({ x: 840, y: 1490, s: 1.05, expr: t > Co ? 'happy' : 'embarrassed', look: [-1, 0], flip: 1, armR: [-20, -30], holdR: emCan(0, -20, .9, 0) }, t + .5) +
      emTeen({ x: 260, y: 1490, s: 1.1, expr: t > Pa ? 'happy' : 'confused', look: [1, 0], armR: t > Pa ? [-30, -80] : [70, 80], holdR: t > Pa ? emCan(0, -20, .9, 0) : '' }, t) + strg +
      (t > Pa ? chatBubble(260, 760, 200, 100, 'allô ?', t, Pa + .1, true, 40) + emCharger(960, 1210, .55, t, { look: -1 }) + heart(1000, 1060, .6 * pop(t, Pa + .2, .3)) : '') +
      kthin('mais que vous avez parfois', CX, 410, t, Ma - .1, { size: 54 }) + kword('OUBLIÉ', CX, 530, t, Ob - .05, { size: 130, fill: SX.acc2 }) + kthin('comment vous parler.', CX, 660, t, Co - .15, { size: 62, fill: '#fff' }); },
  sfx: [[at(41, 'mais'), 'pop_hi', .3], [at(41, 'oublie') - .05, 'boom', .5], [at(41, 'comment'), 'whoosh', .3], [at(41, 'parler'), 'ring', .4], [at(41, 'parler') + .3, 'sparkle', .4]] });

SCENES.sort((a, b) => a.s - b.s);
