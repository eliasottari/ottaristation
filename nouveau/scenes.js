// ============================================================
//  « Pourquoi c'est horrible d'être le nouveau de la classe ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Héros = LE NOUVEAU (cheveux bouclés bruns, t-shirt corail, sac à dos bleu) — gardé tout l'épisode.
//  Les CAPITALES du script = moments criés → kword slam + flash. Kevin (récurrent) au self.
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

// ---------- SIZEX fun : accent BLEU CIEL (propre à l'épisode), jaune marqueur, corail en secondaire ----------
sxFun('#38b6ff'); SX.acc2 = '#ffd23f'; SX.cool = '#ff8a65';
const KGREEN = '#5fb85f';

// ============================================================
//  LE NOUVEAU : bouclé brun, t-shirt corail, SAC À DOS bleu (bretelles devant), pastille « nouveau » sur le t-shirt
// ============================================================
const NV = { hair: '#3a2418', shirt: '#ff6f61', bag: '#2f6fd0', skin: SK[1] };
function nvTray(t, o = {}) { // plateau de cantine (origine = centre du plateau)
  return rect(-135, -12, 270, 26, '#8fd0ff', 8, 6) + ell(-55, -20, 58, 16, '#fff', 5) + (o.empty ? '' : path('M-90 -24Q-80 -60 -50 -50Q-30 -70 -14 -46Q0 -40 -20 -24Z', '#ffe9a0', 4) + ell(-40, -26, 18, 8, '#ff9a4d', 3)) +
    rect(40, -78, 38, 62, 'rgba(210,240,255,.9)', 6, 5) + rect(44, -50, 30, 30, '#8fd0ff', 3, 0) + circ(108, -32, 20, '#e2463a', 4) + line(108, -52, 112, -62, 4); }
function heroP(o, t) {
  const q = Object.assign({ age: 'kid', hair: 'curly', hairColor: NV.hair, shirt: NV.shirt, pants: '#2f3b4e', skin: NV.skin, seed: 5 }, o);
  if (q.tray) Object.assign(q, { armL: [110, 190], armR: [70, -10] });
  const bob = (q.bob ?? 1) * wave(t, .8, 4, q.seed), top = -214 + bob;
  const back = q.bag === false ? '' : G(ptr(q), rect(-104, top + 16, 208, 150, NV.bag, 34, 7) + rect(-104, top + 100, 208, 50, shade(NV.bag, -.18), 20, 5));
  const strap = d => path(d, 'none', 18) + path(d, 'none', 10, NV.bag);
  let front = q.bag === false ? '' : strap(`M-40 ${top + 4}Q-46 ${top + 60} -54 ${top + 128}`) + strap(`M40 ${top + 4}Q46 ${top + 60} 54 ${top + 128}`);
  front += G(tr(-14, top + 82, 1, -8), rect(-20, -14, 40, 28, '#fff', 6, 4) + rect(-20, -14, 40, 9, SX.acc, 4, 0) + ftext(0, 10, 'N', { size: 15, fill: '#e2463a', stroke: 'none' }));
  if (q.bow) front += path(`M0 ${top + 14}L-26 ${top}L-26 ${top + 28}Z`, '#1d2026', 4) + path(`M0 ${top + 14}L26 ${top}L26 ${top + 28}Z`, '#1d2026', 4) + circ(0, top + 14, 8, '#1d2026', 3);
  if (q.tray) front += G(tr(0, top + 64), nvTray(t, { empty: q.trayEmpty }));
  return back + person(q, t) + G(ptr(q), front);
}
// buste (gros plans) : épaules corail + bretelles + tête
function heroBust(x, y, r, o, t) {
  const sh = path(`M${-r * 1.35} ${r * 2.4}Q${-r * 1.4} ${r * .95} 0 ${r * .9}Q${r * 1.4} ${r * .95} ${r * 1.35} ${r * 2.4}Z`, NV.shirt, 7) +
    path(`M${-r * .55} ${r * .98}L${-r * .7} ${r * 2.4}`, 'none', r * .2) + path(`M${-r * .55} ${r * .98}L${-r * .7} ${r * 2.4}`, 'none', r * .12, NV.bag) +
    path(`M${r * .55} ${r * .98}L${r * .7} ${r * 2.4}`, 'none', r * .2) + path(`M${r * .55} ${r * .98}L${r * .7} ${r * 2.4}`, 'none', r * .12, NV.bag);
  return G(tr(x, y, 1, o.tilt || 0), sh + head(Object.assign({ hr: r, hair: 'curly', hairColor: NV.hair, skin: NV.skin, seed: 5 }, o), t)); }
// vu de dos (amorce, premier plan) : le gros sac à dos
function nvHeroBack(x, yb, s = 1) {
  let hair = circ(0, -300, 100, NV.hair, 7); for (let i = 0; i < 9; i++) { const a = R(200 + i * 18); hair += circ(Math.cos(a) * 96, -300 + Math.sin(a) * 96, 24, NV.hair, 0); }
  return G(tr(x, yb, s), path('M-90 0L-84 -160Q-80 -200 -46 -206L46 -206Q80 -200 84 -160L90 0Z', NV.shirt, 7) + ell(-102, -290, 16, 24, NV.skin, 6) + ell(102, -290, 16, 24, NV.skin, 6) + hair +
    rect(-80, -190, 160, 190, NV.bag, 34, 7) + rect(-56, -110, 112, 70, shade(NV.bag, -.18), 16, 5) + line(-40, -80, 40, -80, 4, '#ffd23f')); }
// un élève vu de dos (assis au 1er rang)
function nvBackKid(i, x, yb, s = 1) { const hc = KC[i % 6], sk = SK[i % 6], hs = KH[i % 6];
  return G(tr(x, yb, s), path('M-80 0L-74 -150Q-70 -190 -40 -196L40 -196Q70 -190 74 -150L80 0Z', KS[i % 6], 7) + ell(-98, -280, 15, 22, sk, 6) + ell(98, -280, 15, 22, sk, 6) +
    (hs === 'ponytail' || hs === 'long' ? path('M-30 -260Q0 -120 30 -260Z', hc, 6) : '') + circ(0, -290, 96, hc, 7) + (hs === 'bun' ? circ(0, -390, 36, hc, 6) : '') + (hs === 'spiky' ? path('M-80 -330L-60 -400L-30 -360L0 -410L30 -360L60 -400L80 -330Z', hc, 6) : '')); }
const nvProf = (o, t) => adult(1, Object.assign({ hair: 'bun', hairColor: '#7a4a2a', glasses: true, shirt: '#5ec4a0', pants: '#2f3b4e', skin: SK[0], seed: 61 }, o), t);
const nvCoach = (o, t) => adult(2, Object.assign({ hair: 'bald', mustache: true, glasses: false, cap: '#e2463a', shirt: '#2f6fd0', pants: '#e2463a', skin: SK[3], seed: 62 }, o), t);
const nvWhistle = (r = 0) => G(tr(0, -10, 1, r), rect(-10, -16, 46, 30, '#c9d3dc', 10, 5) + circ(0, 0, 20, '#c9d3dc', 5) + line(-14, 14, -40, 60, 3, '#e2463a'));
// éclair blanc au milieu d'un plan
const nvFlash = (t, t0, k = .85) => t < t0 || t > t0 + .25 ? '' : op(k * (1 - seg(t, t0, t0 + .25)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0));
// horloge murale analogique (h, m, s)
function nvClock(x, y, r, h, m, sec, o = {}) {
  const ah = (h % 12 + m / 60) * 30, am = (m + (sec || 0) / 60) * 6, as = (sec || 0) * 6;
  let s = circ(x, y, r * 1.12, o.rim || '#e2463a', 7) + circ(x, y, r, '#fffdf5', 6);
  for (let i = 0; i < 12; i++) { const a = R(i * 30); s += line(x + Math.sin(a) * r * .78, y - Math.cos(a) * r * .78, x + Math.sin(a) * r * .9, y - Math.cos(a) * r * .9, i % 3 ? 5 : 10); }
  s += line(x, y, x + Math.sin(R(ah)) * r * .5, y - Math.cos(R(ah)) * r * .5, r * .09) + line(x, y, x + Math.sin(R(am)) * r * .76, y - Math.cos(R(am)) * r * .76, r * .06);
  if (sec != null) s += line(x, y, x + Math.sin(R(as)) * r * .84, y - Math.cos(R(as)) * r * .84, r * .025 + 2, '#e2463a');
  return s + circ(x, y, r * .07, OL, 0); }
// projecteur de théâtre + cône de lumière
function nvSpot(x0, y0, x1, y1, w, k = 1, col = '#fff6c8') { if (k <= 0) return ''; const a = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
  return op(.3 * k, path(`M${x0 - 30} ${y0}L${x0 + 30} ${y0}L${x1 + w} ${y1}L${x1 - w} ${y1}Z`, col, 0)) + op(.35 * k, ell(x1, y1, w, w * .22, col, 0)) +
    G(tr(x0, y0, 1, a - 90), rect(-50, -90, 100, 120, '#2b2b33', 18, 6) + ell(0, 30, 54, 16, '#fff6c8', 5)); }
// chaise d'école (origine = sol)
const nvChair = (x, yb, s = 1, col = '#ff8a65') => G(tr(x, yb, s), line(-60, 0, -60, -170, 12, '#7d848c') + line(60, 0, 60, -170, 12, '#7d848c') + line(-60, -170, -60, -330, 12, '#7d848c') + line(60, -170, 60, -330, 12, '#7d848c') +
  rect(-82, -184, 164, 28, col, 8, 6) + rect(-82, -370, 164, 92, col, 16, 6) + ell(-40, -350, 20, 8, 'rgba(255,255,255,.5)', 0));
// escargot (l'horloge qui n'avance pas)
const nvSnail = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-60 10Q-70 -6 -50 -10L50 -10Q70 -10 74 10Z', '#bfe8b5', 5) + line(56, -10, 70, -46, 4) + line(66, -10, 86, -40, 4) + circ(70, -48, 6, OL, 0) + circ(86, -42, 6, OL, 0) +
  circ(-6, -36, 34, '#ff9a4d', 5) + path('M-6 -36m-18 0a18 18 0 1 1 18 18a10 10 0 1 1 -8 -12', 'none', 4));
// écran de téléphone (coordonnées locales de phone() : x ±66, y -128..122)
function nvScreen(kind, t, o = {}) {
  if (kind === 'off') return rect(-66, -128, 132, 250, '#14161c', 12, 0) + op(.25, path('M-50 -110L10 -110L-50 0Z', '#fff', 0)) + (o.face || '');
  let s = grad('#7aa6ff', '#ff9ec4', -66, -128, 132, 250);
  if (kind === 'lock') return s + ftext(0, -50, '10:00', { size: 40, fill: '#fff', stroke: 'none' }) + ftext(0, -20, 'lundi', { size: 16, fill: '#fff', stroke: 'none' }) + rect(-30, 96, 60, 6, '#fff', 3, 0);
  for (let i = 0; i < 9; i++) s += rect(-54 + (i % 3) * 40, -110 + Math.floor(i / 3) * 44, 28, 28, DPAL[i % 8], 8, 3);
  return s + rect(-58, 40, 116, 60, '#fff', 12, 3) + ftext(0, 66, '0 message', { size: 16, fill: OL, stroke: 'none' }) + ftext(0, 88, '0 notif', { size: 14, fill: '#7d848c', stroke: 'none' }); }

// ============================================================
//  DÉCORS
// ============================================================
// fond de classe vu depuis le tableau (mur du fond) : fenêtres, affiches, horloge, porte-manteaux, étagère
function nvClassBack(t, o = {}) { const yb = 1250;
  let s = dWall('stripe', '#eaf5ff', '#dcecfa', yb) + rect(-M, 930, W + 2 * M, yb - 930, '#a9cbe3', 0, 0) + line(-M, 930, W + M, 930, 6, '#7fa9c8');
  s += windowFrame(-150, 250, 230, 400) + dCurtain(60, 240, 80, 440, '#ffd23f', t, -1);
  s += path('M-40 130Q540 210 1120 130', 'none', 4) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => { const x = 20 + i * 125, y = 140 + Math.sin(i / 8 * 3.14) * 62; return path(`M${x - 26} ${y}L${x + 26} ${y}L${x} ${y + 50 + wave(t, .7, 4, i)}Z`, DPAL[i % 8], 4); }).join('');
  s += dPoster(300, 360, 170, 220, '#ff9a4d', -3, ftext(0, -30, 'ABC', { size: 44, fill: '#fff', stroke: 'none' }) + ftext(0, 40, '123', { size: 40, fill: '#fff', stroke: 'none' }), t);
  s += dPoster(560, 340, 260, 170, '#5ec4f0', 2, ell(-60, -10, 56, 36, '#7be07b', 4) + ell(50, 20, 44, 30, '#7be07b', 4) + ell(84, -40, 20, 14, '#7be07b', 4), t);
  s += nvClock(820, 300, 58, o.h ?? 8, o.m ?? 3, o.sec ?? Math.floor(t * 3)) + dFrame(1000, 360, 120, 150, 'mount', '#c38a52', 3);
  s += dShelf(700, 560, 360, dBooks(715, 560, 170, 3) + dGlobe(960, 560, .7, t));
  s += line(160, 650, 660, 650, 8, '#8a5a3a') + [0, 1, 2, 3, 4].map(i => circ(200 + i * 105, 660, 9, '#c9d3dc', 4) + dBag(200 + i * 105, 740, .55, DPAL[(i + 3) % 8], wave(t, .4, 4, i))).join('');
  s += hangLamp(270, 60, t, .25) + hangLamp(810, 60, t + 1, .25) + dPot(1010, 925, .8, t, 1) + dOutlet(60, 1100) + dSwitch(1030, 860);
  return s + dParquet(yb, '#c49a6c'); }
// 3 rangées d'élèves assis derrière leurs pupitres (15 visibles)
const NV_ROWS = [{ n: 6, s: .42, y: 1040, x0: 105, dx: 174 }, { n: 5, s: .55, y: 1175, x0: 130, dx: 205 }, { n: 4, s: .7, y: 1345, x0: 160, dx: 253 }];
const NV_SEATS = []; NV_ROWS.forEach((r, ri) => { for (let i = 0; i < r.n; i++) NV_SEATS.push([r.x0 + i * r.dx, r.y, r.s, ri]); });
function nvPupils(t, o = {}) { let s = '';
  NV_SEATS.forEach(([x, y, sc], k) => {
    if (o.skip && o.skip(k)) return;
    s += kid(k + 1, { x, y, s: sc, expr: o.expr ? o.expr(k) : 'neutral', look: o.look ? o.look(k, x) : [0, 0], armL: [70, 20], armR: [110, 160] }, t + k * .37);
    const dy = y - 104 * sc;
    s += desk(x, dy, sc * .78) + rect(x - 40 * sc, dy - 22 * sc, 70 * sc, 14 * sc, DPAL[(k + 2) % 8], 3, 3) + line(x + 50 * sc, dy - 20 * sc, x + 110 * sc, dy - 26 * sc, 5 * sc + 2, '#ffd23f');
    if (o.over) s += o.over(k, x, y, sc);
  });
  return s; }
// cantine / self : carrelage, menu, néon SELF, comptoir avec bacs fumants, fenêtres, horloge
function nvCantine(t, o = {}) { const yb = 1250;
  let s = dWall('dot', '#fff4e0', '#ffe2b8', yb) + rect(-M, 820, W + 2 * M, yb - 820, '#f0c98a', 0, 0);
  for (let i = 0; i < 32; i++) s += rect(-M + i * 60, 820, 60, 60, i % 2 ? '#ffffff' : '#ffd9a0', 0, 2, '#e8b878');
  s += dWindowView(40, 230, 280, 320, t) + dWindowView(760, 230, 280, 320, t) + dCurtain(10, 220, 60, 360, '#ff8a65', t, 1) + dCurtain(1000, 220, 60, 360, '#ff8a65', t, -1);
  s += dNeon(540, 150, 'SELF', '#ff5c8a', t, 70) + nvClock(360, 150, 44, o.h ?? 12, o.m ?? 0, null, { rim: '#36a85a' });
  s += G(tr(540, 380, 1, -1), rect(-150, -130, 300, 260, '#8a5a3a', 14, 7) + rect(-134, -114, 268, 228, '#2f3a35', 6, 0) + ftext(0, -66, 'MENU', { size: 40, fill: '#fff', stroke: 'none' }) +
    ['PURÉE', 'POISSON', 'COMPOTE'].map((w, i) => ftext(0, -16 + i * 46, w, { size: 28, fill: i === 1 ? SX.acc2 : 'rgba(255,255,255,.85)', stroke: 'none' })).join(''));
  s += dPoster(950, 660, 150, 110, '#7be07b', 3, ftext(0, 10, '5 FRUITS', { size: 24, fill: '#fff', stroke: 'none' }), t);
  if (o.counter !== false) { s += G(tr(330, 820), rect(-330, -150, 560, 150, '#c9d3dc', 12, 7) + rect(-330, -150, 560, 26, '#9aa3ad', 8, 5) + op(.5, rect(-310, -280, 520, 110, '#e6f6ff', 8, 4)));
    [-240, -110, 20, 150].forEach((x, i) => s += G(tr(330 + x, 680), rect(-55, -16, 110, 30, '#7d848c', 6, 5) + ell(0, -16, 50, 12, ['#ffe9a0', '#ff9a4d', '#7be07b', '#e2463a'][i], 4)) + steam(330 + x, 640, t + i * .3, .45)); }
  s += dTileFloor(yb, '#f2e6d0', '#d9c9a8') + dPot(60, 1290, 1, t, 0) + dPot(1030, 1290, .9, t, 2);
  return s; }
// longue table de cantine : seats = [[x, fn(x, yb, s)]], dessinés DERRIÈRE la table ; yb = sol des convives
function nvTable(t, yb, s, seats, o = {}) { const ty = yb - 112 * s, x0 = o.x0 ?? 20, x1 = o.x1 ?? 1060;
  let k = seats.map(([x, f]) => f(x, yb, s)).join('');
  k += rect(x0, ty, x1 - x0, 30 * s + 10, '#f4f6f8', 10, 6) + rect(x0 + 20, ty + 30 * s + 10, x1 - x0 - 40, 120 * s, '#c58e55', 6, 6);
  seats.forEach(([x], i) => { if (o.trays !== false && !(o.noTray && o.noTray(i))) k += G(tr(x, ty + 4, s * .7), nvTray(t, { empty: i % 2 })); });
  return k; }
const nvSeat = (i, o = {}) => (x, yb, s) => kid(i, Object.assign({ x, y: yb, s, armL: [70, 20], armR: [110, 160] }, o), o.tt || 0);
// gymnase : espaliers, panier, tableau d'affichage, corde, fanions, tapis, plots
function nvGym(t, o = {}) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#f4e6c8', 0, 0) + rect(-M, 760, W + 2 * M, yb - 760, '#7bc39a', 0, 0) + line(-M, 760, W + M, 760, 6, '#5a9f78');
  for (let i = 0; i < 5; i++) s += windowFrame(-60 + i * 250, 100, 180, 120);
  s += path('M-40 290Q540 350 1120 290', 'none', 4) + [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const x = 40 + i * 140, y = 300 + Math.sin(i / 7 * 3.14) * 46; return path(`M${x - 24} ${y}L${x + 24} ${y}L${x} ${y + 46 + wave(t, .7, 4, i)}Z`, DPAL[(i + 1) % 8], 4); }).join('');
  s += rect(10, 430, 18, 820, '#c58e55', 4, 5) + rect(230, 430, 18, 820, '#c58e55', 4, 5); for (let y = 470; y < 1240; y += 62) s += rect(20, y, 220, 14, '#d9a86c', 6, 4);
  s += line(540, -M, 540, 330, 10, '#7d848c') + G(tr(540, 450), rect(-150, -110, 300, 190, '#fff', 10, 7) + rect(-56, -30, 112, 80, 'none', 6, 6, '#e2463a') + ell(0, 92, 64, 14, 'none', 9, '#ff7a1a') +
    path('M-60 96L-40 170M-20 100L-14 176M20 100L14 176M60 96L40 170M-50 130L50 130', 'none', 4, '#fff'));
  s += G(tr(850, 470), rect(-140, -80, 280, 160, '#1d2026', 14, 7) + ftext(-70, -40, 'LOCAUX', { size: 20, fill: '#9aa3ad', stroke: 'none' }) + ftext(70, -40, 'VISITEURS', { size: 20, fill: '#9aa3ad', stroke: 'none' }) + ftext(0, 40, '0 - 0', { size: 70, fill: '#ff5c5c', stroke: 'none' }));
  s += G(tr(1010, 0, 1, wave(t, .3, 3)), line(0, -M, 0, 920, 16, '#d9a86c') + line(0, -M, 0, 920, 6, '#b8854f') + ell(0, 930, 22, 30, '#d9a86c', 5));
  s += rect(330, 1080, 200, 170, '#5b8fd8', 16, 6) + line(330, 1140, 530, 1140, 4, '#3a6ab8') + G(tr(700, 1250), rect(-110, -150, 220, 150, '#c9d3dc', 8, 6) + dBall(-50, -150, .55, t, '#ff7a1a') + dBall(30, -150, .55, t + 1, '#ffd23f') + dBall(-10, -190, .55, t + 2, '#fff'));
  s += dBench(150, 1260, .7);
  s += rect(-M, yb, W + 2 * M, 1400, '#e8c08a', 0, 0) + [0, 40, 100, 180, 290, 430].map(dy => line(-M, yb + dy, W + M, yb + dy, 4, '#d4a86a')).join('') + line(-M, yb + 2, W + M, yb + 2, 7, '#b8854f') +
    ell(CX, 1560, 300, 80, 'none', 8, '#fff') + line(CX, yb + 10, CX, H + M, 8, '#fff') + line(-M, 1440, W + M, 1440, 6, '#e2463a');
  s += [[90, 1330], [990, 1330], [180, 1720], [900, 1720]].map(([x, y]) => path(`M${x - 30} ${y}L${x} ${y - 70}L${x + 30} ${y}Z`, '#ff7a1a', 5) + line(x - 18, y - 30, x + 18, y - 30, 6, '#fff')).join('');
  return s; }
// écran de sélection de joueur (jeu vidéo)
const NV_GRID = [[230, 620], [540, 620], [850, 620], [230, 830], [540, 830], [850, 830], [230, 1040], [540, 1040], [850, 1040]];
function nvSelect(t, cur, o = {}) {
  let s = gridBg('#161a3a', 'rgba(120,160,255,.12)') + halftoneFade('#5b8fd8', .08, 1) + rect(-M, 455, W + 2 * M, 70, '#2f6fd0', 0, 6) + ftext(CX, 504, 'CHOISIS TON JOUEUR', { size: 40, fill: '#fff' });
  NV_GRID.forEach(([x, y], i) => { const me = i === 8, w = 270, h = 190;
    let inner = me ? grad('#fff3b0', '#ffd23f', -w / 2, -h / 2, w, h) : grad('#8fd0ff', '#4f86d8', -w / 2, -h / 2, w, h);
    inner += me ? G(tr(0, 30), head({ hr: 66, hair: 'curly', hairColor: NV.hair, skin: NV.skin, expr: o.heroExpr || 'worried', seed: 5 }, t)) : G(tr(0, 30), head({ hr: 66, hair: KH[(i + 1) % 6], hairColor: KC[(i + 1) % 6], skin: SK[(i + 1) % 6], expr: ['smugger', 'happy', 'cool', 'laugh'][i % 4], seed: 20 + i }, t));
    let card = clipR(-w / 2, -h / 2, w, h, inner, 16) + rect(-w / 2, -h / 2, w, h, 'none', 16, 6);
    if (!me) card += op(.55, rect(-w / 2, -h / 2, w, h, '#1d2026', 16, 0)) + G(tr(0, 0, 1, -12), rect(-80, -30, 160, 60, '#e2463a', 10, 5) + ftext(0, 18, 'PRIS', { size: 44, fill: '#fff' }));
    else card += G(tr(-w / 2 + 70, -h / 2 + 24), rect(-60, -18, 120, 36, SX.acc, 10, 4) + ftext(0, 11, 'NOUVEAU', { size: 22, fill: '#fff' }));
    s += G(tr(x, y, me && o.pulse ? 1 + .05 * Math.sin(t * 12) : 1), card); });
  if (cur != null) { const [x, y] = NV_GRID[cur], bl = Math.sin(t * 14) > -.3;
    s += rect(x - 150, y - 110, 300, 220, 'none', 18, bl ? 12 : 8, SX.acc2) + G(tr(x - 130, y - 118), rect(-34, -24, 68, 48, SX.acc2, 12, 5) + ftext(0, 14, 'J1', { size: 32, fill: OL, stroke: 'none' })); }
  return s; }

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001a — SIGNATURE : grille encre, le nouveau en cut-out, titre 3 lignes, « débloqué » en étoiles sur NOUVEAU
const O1 = at(1, 'il') - .12;
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'nouveau'), C = at(1, 'classe');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.25, expr: t > K ? 'panic' : 'worried', armL: t > K ? [-140, -120] : [110, 100], armR: t > K ? [-40, -60] : [70, 80] }, t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1030, 330, 330, t, K + .2, { label: 'nouveau.png' }) +
      kthin("POURQUOI C'EST HORRIBLE", CX, 330, t, .05, { size: 54 }) + kword("D'ÊTRE LE NOUVEAU", CX, 440, t, K - .05, { size: 70, fill: SX.acc2 }) + kword('DE LA CLASSE ?', CX, 560, t, C - .05, { size: 62, fill: '#fff', puff: false }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [at(1, 'nouveau') - .05, 'boom', .6], [at(1, 'nouveau'), 'sparkle', .5], [at(1, 'classe') - .05, 'pop', .5]] });

// B001b — « Il est 8 h 03. » : papier + gobo, grosse horloge d'école à 8:03, le nouveau qui déglutit
B(1, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.1, .2),
  draw: (t, d, T) => { const H8 = at(1, '8h3') - O1;
    return paper('#e8f4ff') + gobo(T, .12) + burst(CX, 880, 320, t, .02, '#cfeaff', 16) + nvClock(CX, 880, 215, 8, 3, 7 + Math.floor(t * 3)) +
      cutout(heroP({ x: 190, y: 1440, s: .95, expr: t > H8 ? 'scared' : 'worried', look: [1, -1] }, t), 10) +
      kthin('il est', CX, 380, t, 0, { size: 58 }) + kword('8 H 03', CX, 490, t, H8 - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(1, '8h3') - O1 - .05, 'boom', .5], [at(1, '8h3') - O1 + .05, 'tick', .5], [at(1, '8h3') - O1 + .35, 'tick', .5]] }, O1);

// B002 — « Tu entres dans ta nouvelle classe. » : papier, la porte « 5e B » s'ouvre… des dizaines d'yeux dans le noir
B(2, { enter: 'none', trans: 'circle', transD: .25, cam: zin(1.0, 1.08, .2),
  draw: (t, d, T) => { const En = at(2, 'entres'), Nv = at(2, 'nouvelle'), k = eOutCubic(seg(t, En, En + .45));
    let eyes = ''; for (let i = 0; i < 12; i++) { const ex = -120 + (i % 4) * 80 + (Math.floor(i / 4) % 2) * 30, ey = -250 + Math.floor(i / 4) * 170 + (i * 37) % 60, bl = Math.sin(t * 3 + i * 2) > .96;
      if (k > .3 + i * .03) eyes += bl ? line(ex - 26, ey, ex + 26, ey, 5, '#fff') : ell(ex - 14, ey, 12, 16, '#fff', 3) + ell(ex + 14, ey, 12, 16, '#fff', 3) + circ(ex - 14, ey + 4, 5, OL, 0) + circ(ex + 14, ey + 4, 5, OL, 0); }
    const door = G(`translate(460 920) scale(${f1(1 - .82 * k)} 1)`, rect(0, -340, 360, 700, '#5ec4f0', 10, 7) + rect(60, -280, 240, 170, '#cfefff', 10, 6) + G(tr(180, 60), rect(-80, -34, 160, 68, '#fff', 10, 5) + ftext(0, 14, '5e B', { size: 40, fill: OL, stroke: 'none' })) + circ(320, 30, 18, '#ffd23f', 5));
    return paper('#e8f4ff') + gobo(T, .1) + blob(640, 900, 330, t, '#cfe8ff', 2) + rect(430, 550, 420, 740, '#8a5a3a', 12, 7) + G(tr(640, 920), rect(-180, -340, 360, 700, '#241d44', 0, 0) + eyes) + door +
      cutout(heroP({ x: lerp(110, 300, eOutCubic(seg(t, 0, En + .3))), y: 1440, s: 1.05, expr: t > Nv ? 'worried' : 'calm', look: [1, 0], legL: [95 + Math.sin(t * 12) * 14, 90], legR: [85 - Math.sin(t * 12) * 14, 90] }, t), 10) +
      kthin('tu entres dans ta', CX, 380, t, 0, { size: 56 }) + funTag('NOUVELLE CLASSE', CX, 480, t, Nv - .1, { size: 52, bg: SX.acc, r: -3 }); },
  sfx: [[0, 'whoosh', .4], [.05, 'steps', .4], [at(2, 'entres'), 'squeak', .5], [at(2, 'nouvelle') - .1, 'pop', .5], [at(2, 'classe'), 'gulp', .4]] });

// B003 — « Trente élèves te regardent. » : POV, toute la classe, les têtes pivotent d'un coup, un projecteur s'allume sur toi
B(3, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), hand: .3 }),
  draw: (t, d, T) => { const Tr = at(3, '30'), Rg = at(3, 'regardent'), snap = t > Rg;
    return nvClassBack(t) + nvPupils(t, { expr: k => snap ? (k % 3 ? 'suspicious' : 'shock') : ['happy', 'talk', 'neutral', 'laugh'][k % 4], look: k => snap ? [0, 0] : [k % 2 ? 1.3 : -1.3, .3] }) +
      nvSpot(140, 60, CX, 1500, 330, seg(t, Rg, Rg + .08)) +
      funTag(counter(1, 30, t, Tr, .35) + ' ÉLÈVES', CX, 430, t, Tr - .05, { size: 62, bg: SX.acc }) + (snap ? kword('TE REGARDENT', CX, 580, t, Rg - .05, { size: 80, fill: SX.acc2 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(3, '30') - .05, 'pop', .5], [at(3, '30') + .05, 'slot', .3], [at(3, 'regardent'), 'zap', .5], [at(3, 'regardent') + .05, 'flash_hit', .4]] });

// B004 — « Le professeur sourit. » : tableau, la prof sourit… beaucoup trop (éclat sur les dents)
B(4, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pr = at(4, 'professeur'), So = at(4, 'sourit');
    return classroomT(t, ftext(540, 720, 'Bienvenue !', { size: 54, fill: 'rgba(255,255,255,.85)', stroke: 'none' })) + WASH() +
      nvProf({ x: 700, y: 1500, s: 1.25, expr: t > So ? 'happy' : 'neutral', face: t > So ? { mouth: 'teeth', blush: 1 } : {}, armL: [150, 80], armR: [30, 100] }, t) +
      (t > So ? sparkle(740, 1010, .8 + .3 * Math.sin(t * 24), '#fff') : '') + heroP({ x: 250, y: 1490, s: 1.15, expr: 'worried', look: [1, -.5] }, t) +
      kthin('le professeur', CX, 400, t, Pr - .15, { size: 60 }) + kword('SOURIT', CX, 540, t, So - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(4, 'professeur') - .1, 'pop_hi', .4], [at(4, 'sourit'), 'glint', .6], [at(4, 'sourit') + .05, 'sparkle', .4]] });

// B005 — « Présente-toi ! » : crash zoom sur la prof bras ouverts, flèche vers TOI
B(5, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t < .25 ? 4 : 0 }),
  draw: (t, d, T) => { const Pz = at(5, 'presente');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .3 }, { z: 1, svg: nvProf({ x: CX, y: 1800, s: 1.8, expr: 'ecstatic', armL: [-150, -120], armR: [-30, -60] }, t) }]) +
      kword('PRÉSENTE-TOI !', CX, 450, t, Pz - .05, { size: 88, fill: SX.acc2 }) + markerArrow(860, 620, 960, 1000, t, Pz + .15, { bend: -60 }) + markerText('toi', 950, 1060, t, Pz + .3, { size: 60 }); },
  sfx: [[0, 'flash_hit', .4], [at(5, 'presente') - .05, 'boom', .5], [at(5, 'presente') + .15, 'scratch', .4], [at(5, 'toi'), 'ding', .4]] });

// B006a — « PARDON ? » : gros plan, mâchoire au sol
const O6 = at(6, 'je') - .12;
B(6, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), shake: 6 }),
  draw: (t, d, T) => { const Pa = at(6, 'pardon');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .35 }, { z: 1, svg: heroBust(CX, 960, 220, { expr: 'jawdrop' }, t) }]) + speedLines(t, CX, 960, 26, 'rgba(255,255,255,.45)') +
      kword('PARDON ?', CX, 470, t, Pa - .05, { size: 140, fill: '#fff' }) + nvFlash(t, Pa, .5); },
  sfx: [[0, 'flash_hit', .5], [at(6, 'pardon') - .05, 'boom', .6], [at(6, 'pardon') + .1, 'scratch', .5]] });
// B006b — « JE VIENS D'ARRIVER… UNE CONFÉRENCE ? » : pupitre de conférencier, micro, flashs, bannière
B(6, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .4, shake: t > at(6, 'conference') - O6 ? 6 : 0 }),
  draw: (t, d, T) => { const Vi = at(6, 'viens') - O6, Fa = at(6, 'fasse') - O6, Co = at(6, 'conference') - O6;
    let flashes = ''; for (let i = 0; i < 6; i++) { const ph = (t * 2.4 + i * .37) % 1; if (t > Fa && ph < .12) flashes += op(1 - ph / .12, G(tr([140, 960, 200, 900, 110, 980][i], [820, 780, 1080, 1040, 660, 640][i]), circ(0, 0, 56, '#fff', 0) + impactStar(0, 0, .45))); }
    const podium = G(tr(CX, 1520), path('M-190 -370L190 -370L160 0L-160 0Z', '#3a3f5a', 7) + rect(-210, -390, 420, 40, '#2b2f45', 10, 6) + circ(0, -200, 70, SX.acc, 6) + ftext(0, -178, '?', { size: 80, fill: '#fff' }));
    const mic = path(`M${CX + 60} 1140Q${CX + 70} 1190 ${CX + 40} 1130`, 'none', 8) + G(tr(CX + 40, 1122, 1, -30), rect(-14, -30, 28, 46, '#2b2b33', 12, 5));
    const banner = G(tr(CX, 735), path('M-420 -46L420 -46L400 46L-400 46Z', '#e2463a', 7) + ftext(0, 16, 'CONFÉRENCE DU NOUVEAU', { size: 40, fill: '#fff' }));
    let crowd = ''; for (let i = 0; i < 7; i++) { const bx = 70 + i * 160, by = 1760 + wave(t, .7, 6, i * .3); crowd += circ(bx, by, 110, '#1c1830', 0) + ell(bx, 1920, 150, 110, '#1c1830', 0); }
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .3 }]) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, '#1c1830', 0, 0)) + nvSpot(CX, 120, CX, 1480, 300, 1) + (t > Fa ? banner : '') +
      heroP({ x: CX, y: 1460, s: 1.3, expr: t > Co ? 'terror' : 'panic', armL: [60, -10], armR: [120, 190] }, t) + (t > Fa ? podium + mic : '') + sweatSpray(CX, 1000, t, 4) + flashes + crowd +
      kthin("je viens d'arriver…", CX, 390, t, Vi - .15, { size: 58, out: Co - .2 }) + kthin('et tu veux déjà que je fasse', CX, 480, t, at(6, 'veux') - O6 - .1, { size: 46, out: Co - .2 }) +
      kword('UNE CONFÉRENCE ?!', CX, 440, t, Co - .05, { size: 76, fill: SX.acc2 }) + nvFlash(t, Co, .45); },
  sfx: [[0, 'whoosh', .4], [at(6, 'viens') - O6, 'pop_hi', .3], [at(6, 'fasse') - O6, 'shutter', .5], [at(6, 'fasse') - O6 + .3, 'shutter', .4], [at(6, 'conference') - O6 - .05, 'boom', .6], [at(6, 'conference') - O6, 'squeak', .5]] }, O6);

// B007 — « Bienvenue dans la vie du nouveau. » : guirlande « BIENVENUE », une seule langue de belle-mère qui fait pfff, confettis tristes
B(7, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bv = at(7, 'bienvenue'), Nv = at(7, 'nouveau'), blow = seg(t, Bv, Bv + .3);
    const horn = G(tr(0, -20, 1, 0), rect(0, -8, 30, 16, '#ff8fb1', 4, 4) + path(`M30 0Q${30 + 120 * blow} ${-10 + 60 * blow * blow} ${30 + 140 * blow} ${80 * blow * blow}`, 'none', 18, '#ffd23f'));
    let gar = path('M60 880Q540 980 1020 880', 'none', 5); 'BIENVENUE'.split('').forEach((c, i) => { const x = 110 + i * 108, y = 900 + Math.sin(i / 8 * 3.14) * 70 + wave(t, .6, 4, i); gar += G(tr(x, y, 1, wave(t, .6, 5, i)), path('M-44 0L44 0L0 90Z', DPAL[i % 8], 5) + ftext(0, 40, c, { size: 34, fill: '#fff' })); });
    return classroomT(t) + WASH() + gar + nvProf({ x: 880, y: 1500, s: 1.15, expr: 'happy', armL: [-60 + Math.sin(t * 14) * 20, -40], armR: [-120 - Math.sin(t * 14) * 20, -140] }, t) +
      heroP({ x: 300, y: 1490, s: 1.3, expr: t > Nv ? 'deadpan' : 'worried' }, t) + kid(4, { x: 600, y: 1500, s: .95, expr: 'deadpan', armR: [-20, 0], holdR: horn }, t) + confetti(t, Bv, 10) +
      kthin('bienvenue dans', CX, 400, t, Bv - .1, { size: 58 }) + kword('LA VIE DU NOUVEAU', CX, 540, t, Nv - .1, { size: 70, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(7, 'bienvenue'), 'whistle', .4], [at(7, 'vie'), 'pop_hi', .3], [at(7, 'nouveau') - .1, 'boom', .4], [at(7, 'nouveau') + .2, 'crickets', .3]] });

// B008 — « Tu annonces ton prénom. » : il parle, bulle « Moi, c'est Théo ! »
B(8, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const An = at(8, 'annonces'), Pr = at(8, 'prenom');
    return classroomT(t) + WASH() + heroP({ x: 300, y: 1490, s: 1.35, expr: 'happy', face: { mouth: 'talk' }, armR: [-20, -60] }, t) +
      chatBubble(720, 820, 560, 150, "Moi, c'est Théo !", t, An, true, 48) +
      kthin('tu annonces ton', CX, 400, t, An - .1, { size: 58 }) + kword('PRÉNOM', CX, 540, t, Pr - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(8, 'annonces'), 'pop', .5], [at(8, 'prenom') - .05, 'boom', .4], [at(8, 'prenom') + .15, 'pop_hi', .3]] });

// B009 — « Personne ne réagit. » : POV classe, visages de marbre, grillon sur un pupitre, boule d'herbe
B(9, { enter: 'none', cam: () => ({ z: 1.08 }),
  draw: (t, d, T) => { const Pe = at(9, 'personne');
    return nvClassBack(t) + nvPupils(t, { expr: () => 'deadpan' }) + op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#7a808c', 0, 0)) +
      cricket(680, 1200, .7, t) + markerText('cri cri…', 760, 1080, t, .15, { size: 46, col: '#fff' }) + tumbleweed(lerp(-200, 1250, t / d), 1300, .9, t * 300) +
      kword('PERSONNE.', CX, 450, t, Pe - .05, { size: 120, fill: '#fff' }) + kthin('ne réagit', CX, 600, t, at(9, 'reagit') - .15, { size: 58 }); },
  sfx: [[0, 'crickets', .7], [at(9, 'personne') - .05, 'boom', .3], [at(9, 'reagit'), 'wind', .3], [.4, 'crickets', .4]] });

// B010 — « Tu cherches une place. » : le nouveau scrute à la loupe, chaque place est prise (croix rouges)
B(10, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const Ch = at(10, 'cherches'), Pl = at(10, 'place'), xs = [3, 7, 1, 9, 5];
    return nvClassBack(t) + nvPupils(t, { expr: k => k % 2 ? 'mock' : 'smug', over: (k, x, y, sc) => { const j = xs.indexOf(k); return j < 0 ? '' : cross(x, y - 300 * sc, sc * .5, t, Ch + j * .12); } }) +
      heroP({ x: 900, y: 1560, s: 1.45, flip: 1, expr: 'suspicious', look: [1, 0], armR: [-60, -100], holdR: magnifier(0, -40, .45, -20) }, t) +
      kthin('tu cherches', CX, 400, t, Ch - .15, { size: 58 }) + kword('UNE PLACE', CX, 540, t, Pl - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(10, 'cherches'), 'hmm', .4], [at(10, 'cherches') + .12, 'error_beep', .25], [at(10, 'cherches') + .36, 'error_beep', .25], [at(10, 'place') - .05, 'boom', .4]] });

// B011 — « La seule chaise disponible est au premier rang. » : vue vers le tableau, élèves de dos, UNE chaise vide sous un projecteur divin
B(11, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Se = at(11, 'seule'), Ch = at(11, 'chaise'), Pr = at(11, 'premier');
    return classroomT(t) + WASH() + G(tr(930, 1180), desk(0, 0, .9) + apple(-120, -40, .3) + rect(20, -60, 120, 30, '#fff', 4, 4)) +
      nvBackKid(1, 130, 1440, .95) + nvBackKid(2, 330, 1460, .95) + nvBackKid(3, 520, 1450, .95) +
      nvSpot(720, 130, 720, 1330, 170, seg(t, Ch, Ch + .1), '#fff3a0') + nvChair(720, 1360, .85) + (t > Ch ? sparkle(790, 1130, .5 + .2 * Math.sin(t * 9), '#fff') : '') +
      kthin('la seule chaise disponible', CX, 400, t, Se - .1, { size: 52 }) + markerArrow(560, 860, 690, 1020, t, Ch + .1, { bend: 50 }) + markerText('LA SEULE', 420, 830, t, Ch + .1, { size: 50 }) +
      kword('PREMIER RANG', CX, 540, t, Pr - .05, { size: 90, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(11, 'chaise'), 'angel', .5], [at(11, 'disponible'), 'scratch', .4], [at(11, 'premier') - .05, 'boom', .5], [at(11, 'rang'), 'pop', .3]] });

// B012 — « À côté du bureau du prof. » : collé au bureau, la prof se penche avec un sourire immense
B(12, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), hand: .3, cx: 700, cy: 1000 }),
  draw: (t, d, T) => { const Co = at(12, 'cote'), Bu = at(12, 'bureau'), lean = eOutBack(seg(t, Bu, Bu + .4));
    const plate = G(tr(800, 1185), rect(-130, -32, 260, 64, '#fff', 8, 5) + ftext(0, 12, 'BUREAU DU PROF', { size: 24, fill: '#e2463a', stroke: 'none' }));
    return classroomT(t) + WASH() + nvProf({ x: 830, y: 1480, s: 1.25, rot: -14 * lean, expr: t > Bu ? 'happy' : 'neutral', face: t > Bu ? { mouth: 'teeth' } : {}, look: [-1, 0] }, t) +
      desk(800, 1150, 1.15) + apple(640, 1115, .32) + G(tr(950, 1120), rect(-50, -30, 100, 40, '#fff', 4, 4) + rect(-46, -42, 100, 40, '#f4f1ea', 4, 4)) + dMug(1000, 1120, .9, t, '#e2463a') + plate +
      nvChair(320, 1500, .85) + heroP({ x: 320, y: 1440, s: 1.25, expr: 'embarrassed', look: [1, 0], armL: [80, 90], armR: [100, 90] }, t) + (t > Bu ? sweat(420, 1000 + (t * 40) % 30, 1.1) : '') +
      kthin('à côté du', CX, 400, t, Co - .15, { size: 60 }) + kword('BUREAU DU PROF', CX, 540, t, Bu - .05, { size: 82, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(12, 'cote'), 'pop_hi', .4], [at(12, 'bureau') - .05, 'boom', .4], [at(12, 'bureau') + .1, 'squeak', .4], [at(12, 'prof') + .1, 'gulp', .5]] });

// B013 — « MAGNIFIQUE. » : rayons dorés, pouce levé ultra sarcastique, la tête de la prof collée à la sienne
B(13, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t < .3 ? 5 : 0 }),
  draw: (t, d, T) => { const Mg = at(13, 'magnifique');
    const thumb = G(tr(0, -30), rect(-26, -20, 52, 50, NV.skin, 14, 5) + rect(-12, -60, 24, 46, NV.skin, 12, 5));
    return rays(t, CX, 950, '#ffe680', '#ffc93a', 22) + cutout(heroP({ x: 360, y: 1450, s: 1.2, expr: 'deadpan', armR: [-60, -100], holdR: thumb }, t), 10) +
      cutout(G(tr(760, 1000, 1, 10), head({ hr: 150, hair: 'bun', hairColor: '#7a4a2a', glasses: true, skin: SK[0], expr: 'love', seed: 61 }, t)), 10) +
      kword('MAGNIFIQUE.', CX, 470, t, Mg - .05, { size: 110, fill: '#fff' }) + popStars(CX, 470, t, Mg + .05, 8, 320); },
  sfx: [[0, 'flash_hit', .5], [at(13, 'magnifique') - .05, 'boom', .6], [at(13, 'magnifique') + .05, 'tada', .4], [at(13, 'magnifique') + .2, 'sparkle', .4]] });

// B014 — « À la récréation, tout le monde retrouve ses amis. » : cour, câlins et checks partout, lui seul au milieu
B(14, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Rc = at(14, 'recreation'), Rt = at(14, 'retrouve'), Am = at(14, 'amis'), hug = t > Rt;
    return schoolyard(t) + WASH() +
      kid(1, { x: 130, y: 1470, s: 1.0, expr: hug ? 'joy' : 'happy', armL: [110, 100], armR: hug ? [-10, -20] : [70, 80] }, t) + kid(2, { x: 290, y: 1470, s: 1.0, expr: hug ? 'joy' : 'happy', flip: 1, armR: hug ? [-10, -20] : [70, 80] }, t + 1) +
      kid(3, { x: 800, y: 1470, s: 1.0, expr: hug ? 'laugh' : 'happy', armR: hug ? [-60, -80] : [70, 80] }, t + 2) + kid(5, { x: 960, y: 1470, s: 1.0, expr: hug ? 'laugh' : 'happy', flip: 1, armR: hug ? [-60, -80] : [70, 80] }, t + 3) +
      (hug ? heartsUp(t, 210, 1000, 4) + impactStar(880, 1010, .5 + .1 * Math.sin(t * 20)) : '') +
      heroP({ x: CX, y: 1500, s: 1.15, expr: hug ? 'sad' : 'worried' }, t) + (t > Am ? G(tr(CX, 900), cloud(0, 0, .9, '#c9d3dc', 6) + [0, 1, 2].map(i => line(-40 + i * 40, 60 + ((t * 300 + i * 40) % 80), -46 + i * 40, 80 + ((t * 300 + i * 40) % 80), 5, '#5ec4f0')).join('')) : '') +
      funTag('RÉCRÉ !', CX, 410, t, Rc - .1, { size: 70, bg: SX.acc2, fg: SX.ink }) + kthin('tout le monde retrouve', CX, 550, t, at(14, 'tout') - .1, { size: 52 }) + kword('SES AMIS', CX, 650, t, Am - .05, { size: 80, fill: '#fff' }); },
  sfx: [[0, 'school_bell', .5], [at(14, 'recreation') - .1, 'pop', .5], [at(14, 'retrouve'), 'kiss', .3], [at(14, 'amis') - .05, 'boom', .3], [at(14, 'amis') + .2, 'chirp', .3]] });

// B015 — « Toi, tu fais semblant d'être passionné par les affiches du couloir. » : couloir, faux intérêt total pour « LAVEZ-VOUS LES MAINS »
B(15, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Toi = at(15, 'toi'), Sb = at(15, 'semblant'), Pa = at(15, 'passionne'), Af = at(15, 'affiches');
    const poster = dPoster(300, 830, 320, 380, '#7be07b', -2, ftext(0, -120, 'LAVEZ-VOUS', { size: 36, fill: '#fff', stroke: OL, sw: 5 }) + ftext(0, -76, 'LES MAINS', { size: 36, fill: '#fff', stroke: OL, sw: 5 }) +
      ell(0, 40, 80, 50, '#fff', 5) + circ(-30, 0, 18, '#bfe3ff', 4) + circ(20, -14, 12, '#bfe3ff', 4) + circ(50, 20, 14, '#bfe3ff', 4), t);
    return hallway(t) + WASH() + kidsBg(t, 1230, 3, .5) + poster + (t > Af ? markerCircle(300, 830, 190, 220, t, Af, { col: '#e2463a' }) : '') +
      heroP({ x: 720, y: 1490, s: 1.3, flip: 1, expr: t > Pa ? 'wow' : 'neutral', look: [1, -.3], armR: [-80, -40], holdR: magnifier(0, -10, .35, 20) }, t) + (t > Pa ? sparkle(640, 960, .5 + .2 * Math.sin(t * 9), '#fff') : '') +
      kthin('toi, tu fais semblant', CX, 400, t, Toi - .1, { size: 54 }) + kword('PASSIONNÉ', CX, 520, t, Pa - .05, { size: 100, fill: SX.acc2 }) + markerText('fascinant.', 800, 680, t, Pa + .4, { size: 48, col: '#fff' }) +
      funTag('FAUX INTÉRÊT', 300, 1090, t, Af, { size: 34, bg: '#e2463a', r: 4 }); },
  sfx: [[0, 'whoosh', .4], [at(15, 'semblant'), 'hmm', .4], [at(15, 'passionne') - .05, 'boom', .4], [at(15, 'passionne') + .1, 'glint', .5], [at(15, 'affiches'), 'scratch', .5]] });

// B016 — « Tu sors ton téléphone. » : couloir flou, le téléphone jaillit de la poche
B(16, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const So = at(16, 'sors'), Te = at(16, 'telephone'), up = eOutBack(seg(t, So, So + .35));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: hallway(t), haze: .35 }]) + heroBust(330, 1000, 190, { expr: 'neutral', look: [1, .3] }, t) +
      G(tr(760, 1300 - 420 * up, 1, 8), phone(0, 0, 1.5, 0, nvScreen('off', t)) + circ(-70, 210, 44, NV.skin, 6) + circ(80, 200, 40, NV.skin, 6)) +
      kthin('tu sors ton', CX, 400, t, So - .15, { size: 58 }) + kword('TÉLÉPHONE', CX, 530, t, Te - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(16, 'sors'), 'whoosh_up', .4], [at(16, 'telephone') - .05, 'pop', .5], [at(16, 'telephone') + .1, 'glint', .3]] });

// B017 — « Tu l'ouvres. » : insert écran : déverrouillé… 0 message
B(17, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.05, 1.12, t / d) }),
  draw: (t, d, T) => { const Ou = at(17, 'ouvres');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: hallway(t), haze: .45 }]) + G(tr(CX, 900, 1, -4), phone(0, 0, 2.2, 0, nvScreen(t > Ou ? 'home' : 'lock', t)) + circ(-150, 300, 60, NV.skin, 6) + circ(150, 290, 56, NV.skin, 6)) +
      (t > Ou ? funTag('0 MESSAGE', CX, 420, t, Ou + .1, { size: 60, bg: '#fff', fg: SX.ink }) : kthin("tu l'ouvres", CX, 420, t, 0, { size: 60 })); },
  sfx: [[0, 'whoosh', .3], [at(17, 'ouvres'), 'pop_hi', .5], [at(17, 'ouvres') + .1, 'pop', .4]] });

// B018 — « Tu le refermes. » : écran noir… le reflet du nouveau, impassible
B(18, { enter: 'none', cam: (t, d) => ({ z: lerp(1.12, 1.16, t / d) }),
  draw: (t, d, T) => { const Rf = at(18, 'refais');
    const face = t > Rf ? op(.35, G(tr(0, -10), head({ hr: 50, hair: 'curly', hairColor: '#888', skin: '#9aa3ad', expr: 'deadpan', cheeks: false, seed: 5 }, t))) : '';
    return depth({ zoom: 1 }, [{ z: 1.4, svg: hallway(t), haze: .45 }]) + G(tr(CX, 900, 1, -4), phone(0, 0, 2.2, 0, nvScreen(t > Rf ? 'off' : 'home', t, { face })) + circ(-150, 300, 60, NV.skin, 6) + circ(150, 290, 56, NV.skin, 6)) +
      kthin('tu le refermes.', CX, 420, t, 0, { size: 60 }); },
  sfx: [[0, 'whoosh', .2], [at(18, 'refais'), 'snip', .5], [at(18, 'refais') + .1, 'crickets', .3]] });

// B019 — « Tu regardes l'heure. » : il lève les yeux vers la grosse horloge du couloir (10:00)
B(19, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), cy: 900 }),
  draw: (t, d, T) => { const Rg = at(19, 'regardes'), He = at(19, 'heure');
    return depth({ zoom: 1 }, [{ z: 1.3, svg: hallway(t), haze: .3 }]) + nvClock(CX, 760, 200, 10, 0, 0) + heroBust(250, 1080, 160, { expr: 'neutral', look: [1, -1.4], tilt: -8 }, t) +
      kthin("tu regardes l'heure", CX, 430, t, Rg - .15, { size: 58 }) + (t > He ? funTag('10:00', 880, 1000, t, He, { size: 50, bg: SX.acc }) : ''); },
  sfx: [[0, 'whoosh', .3], [at(19, 'regardes'), 'tick', .5], [at(19, 'heure'), 'tick', .5], [at(19, 'heure') + .1, 'pop_hi', .3]] });

// B020 — « Il s'est passé onze secondes. » : crash zoom, la trotteuse à 11 s, un escargot sur l'aiguille, toiles d'araignée
B(20, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(20, '11') && t < at(20, '11') + .3 ? 5 : 0 }),
  draw: (t, d, T) => { const Pa = at(20, 'passe'), E = at(20, '11'), sec = Math.min(11, Math.floor(seg(t, 0, E) * 11));
    const web = path('M120 620L300 620M120 620L120 800M120 620L260 760M150 650Q190 640 190 620M120 680Q180 690 200 700', 'none', 4, 'rgba(255,255,255,.8)');
    return depth({ zoom: 1 }, [{ z: 1.3, svg: hallway(t), haze: .4 }]) + nvClock(CX, 860, 260, 10, 0, sec) + nvSnail(CX + 20, 860 - 140, .7, -90) + web + G(`translate(1080 0) scale(-1 1)`, web) +
      kthin("il s'est passé", CX, 400, t, Pa - .2, { size: 58 }) + kword('11 SECONDES', CX, 520, t, E - .05, { size: 96, fill: SX.acc2 }) + funTag('+11 s', 870, 1130, t, E + .1, { size: 44, bg: '#e2463a' }); },
  sfx: [[0, 'whoosh', .3], [at(20, 'passe'), 'tick', .5], [at(20, '11') - .05, 'boom', .4], [at(20, 'secondes'), 'tick', .4], [at(20, 'secondes') + .3, 'wind', .3]] });

// B021 — « PLUS QUE QUATORZE MINUTES ET QUARANTE-NEUF SECONDES. » : rayons rouges, compte à rebours géant 14:49, fontaine de larmes
B(21, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 3 }),
  draw: (t, d, T) => { const Pl = at(21, 'plus'), Mi = at(21, '14'), Se = at(21, '49'), last = at(21, 'secondes', 2);
    const disp = (t > Mi ? '14' : '--') + ':' + (t > Se ? (t > last + .35 ? '48' : '49') : '--');
    const panel = G(tr(CX, 760), rect(-400, -170, 800, 340, '#1d2026', 40, 8) + op(.35 + .1 * Math.sin(t * 8), rect(-370, -140, 740, 280, '#ff4d4d', 24, 0).replace('fill="#ff4d4d"', 'fill="#3a0f14"')) +
      ftext(0, 80, disp, { size: 230, fill: '#ff4d4d', stroke: 'none' }) + ftext(0, -128, 'FIN DE LA RÉCRÉ DANS', { size: 26, fill: '#ff9a9a', stroke: 'none' }));
    const bar = G(tr(CX, 1010), rect(-360, -26, 720, 52, '#fff', 26, 6) + rect(-356, -22, 10, 44, '#36a85a', 20, 0) + ftext(0, 12, '1 %', { size: 30, fill: OL, stroke: 'none' }));
    return rays(t, CX, 900, '#ff6b6b', '#b8202e', 22) + panel + bar + cutout(heroP({ x: 250, y: 1440, s: 1.0, expr: 'sob', face: { fountain: 1 } }, t), 10) +
      kword('PLUS QUE…', CX, 440, t, Pl - .05, { size: 100, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .5], [at(21, 'plus') - .05, 'boom', .5], [at(21, '14'), 'ecg_beep', .4], [at(21, '49'), 'ecg_beep', .4], [at(21, 'secondes', 2) + .35, 'tick', .5]] });

// B022 — « À midi, catastrophe. » : cantine, horloge 12:00, gyrophare, la foule déboule
B(22, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .5, shake: t > at(22, 'catastrophe') ? 4 : 0 }),
  draw: (t, d, T) => { const Mi = at(22, 'midi'), Ca = at(22, 'catastrophe'), al = t > Ca && Math.sin(t * 16) > 0;
    let rush = ''; for (let i = 0; i < 5; i++) { const x = ((t * 900 + i * 260) % 1500) - 200; rush += kid(i + 1, { x, y: 1300 + (i % 2) * 40, s: .75, expr: 'ecstatic', armL: [-140, -120], armR: [-40, -60] }, t + i); }
    return nvCantine(t) + (al ? op(.25, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff3b30', 0, 0)) : '') + rush + G(tr(950, 760), rect(-30, -10, 60, 30, '#555', 6, 4) + ell(0, -30, 34, 40, al ? '#ff3b30' : '#a8323a', 5)) +
      heroP({ x: 250, y: 1500, s: 1.25, expr: t > Ca ? 'scared' : 'worried' }, t) +
      funTag('MIDI', CX, 410, t, Mi - .1, { size: 64, bg: SX.acc }) + kword('CATASTROPHE', CX, 560, t, Ca - .05, { size: 100, fill: '#ff5c5c' }); },
  sfx: [[0, 'whoosh', .4], [at(22, 'midi'), 'ding', .5], [at(22, 'catastrophe') - .05, 'boom', .5], [at(22, 'catastrophe'), 'siren', .4], [.2, 'steps', .4]] });

// B023 — « Tu arrives au self. » : comptoir, la dame de cantine claque une louche de purée sur le plateau
B(23, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ar = at(23, 'arrives'), Sf = at(23, 'sel'), plop = seg(t, Sf - .15, Sf + .05);
    const ladle = G(tr(0, -20, 1, -30 + 60 * plop), line(0, 0, 0, 160, 10, '#9aa3ad') + ell(0, 170, 34, 20, '#9aa3ad', 5));
    return nvCantine(t, { h: 12, m: 2 }) + adult(4, { x: 760, y: 1240, s: 1.0, hair: 'bun', expr: 'deadpan', cap: '#fff', apron: '#fff', shirt: '#8a6ad8', armR: [-60, -20], holdR: ladle }, t) +
      G(tr(330, 820), rect(-330, -40, 1000, 60, '#9aa3ad', 6, 6)) +
      heroP({ x: 330, y: 1500, s: 1.3, tray: 1, trayEmpty: t < Sf, expr: t > Sf ? 'confused' : 'happy' }, t) + (t > Sf && t < Sf + .4 ? impactStar(250, 1060, .4) : '') +
      kthin('tu arrives', CX, 400, t, Ar - .15, { size: 58 }) + kword('AU SELF', CX, 540, t, Sf - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(23, 'arrives'), 'steps', .4], [at(23, 'sel') - .05, 'boom', .4], [at(23, 'sel'), 'thud', .5]] });

// B024 — « Toutes les tables sont occupées. » : cantine pleine à craquer, tampon COMPLET, il tourne la tête dans tous les sens
const nvFull = (t, kev) => nvTable(t, 1060, .5, [0, 1, 2, 3, 4, 5].map(i => [100 + i * 176, nvSeat(i + 1, { expr: ['laugh', 'happy', 'talk', 'joy'][i % 4], tt: t + i })])) +
  nvTable(t, 1220, .62, [0, 1, 2, 3, 4].map(i => [130 + i * 205, i === 3 && kev ? (x, yb, s) => kevin(Object.assign({ x, y: yb, s, armL: [70, 20], armR: [110, 160] }, kev), t) : nvSeat(i + 7, { expr: ['happy', 'laugh', 'talk'][i % 3], tt: t + i * 2 })]));
B(24, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .4 }),
  draw: (t, d, T) => { const Tb = at(24, 'tables'), Oc = at(24, 'occupees');
    return nvCantine(t, { counter: false }) + nvFull(t, { expr: 'laugh' }) + heroP({ x: CX, y: 1560, s: 1.4, tray: 1, expr: t > Oc ? 'panic' : 'worried', look: [Math.sin(t * 7) * 1.3, 0] }, t) +
      kthin('toutes les tables', CX, 400, t, at(24, 'toutes') - .1, { size: 58 }) + stamp(CX, 560, 'COMPLET', t, Oc - .05, '#e2463a', -10, 96); },
  sfx: [[0, 'whoosh', .4], [at(24, 'tables'), 'pop', .4], [at(24, 'occupees') - .05, 'thud', .6], [at(24, 'occupees'), 'error_beep', .4], [at(24, 'occupees') + .2, 'gasp', .4]] });

// B025 — « Tu repères Kevin. » : viseur sur Kevin, entouré au marqueur
B(25, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.25, eInOut(t / d)), cx: 745, cy: 1000 }),
  draw: (t, d, T) => { const Rp = at(25, 'reperes'), K = at(25, 'kevin'), kx = 745, ky = 1220 - 292 * .62;
    return nvCantine(t, { counter: false }) + nvFull(t, { expr: 'happy' }) + op(.25, rect(-M, -M, W + 2 * M, H + 2 * M, '#1d2026', 0, 0)) + op(.25, glow(kx, ky, 200, '#fff6a0', .9)) +
      G(tr(kx, ky, 1, t * 40), circ(0, 0, 120, 'none', 7, '#ff3b30') + line(-150, 0, -80, 0, 7, '#ff3b30') + line(80, 0, 150, 0, 7, '#ff3b30') + line(0, -150, 0, -80, 7, '#ff3b30') + line(0, 80, 0, 150, 7, '#ff3b30')) +
      kthin('tu repères', CX, 430, t, Rp - .15, { size: 56 }) + funTag('KEVIN', kx, 800, t, K - .05, { size: 60, bg: KGREEN }); },
  sfx: [[0, 'whoosh', .3], [at(25, 'reperes'), 'zap', .4], [at(25, 'kevin') - .05, 'pop', .6], [at(25, 'kevin') + .1, 'glint', .4]] });

// B026 — « Il te fait signe. » : par-dessus l'épaule du nouveau (sac à dos), Kevin fait coucou
B(26, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Fa = at(26, 'fait'), Si = at(26, 'signe'), wv = Math.sin(t * 16) * 22;
    return nvCantine(t, { counter: false }) + WASH() + nvTable(t, 1260, 1.0, [[700, (x, yb, s) => kevin({ x, y: yb, s: 1.25, expr: 'happy', armR: [-70 + wv, -100 + wv], armL: [110, 100] }, t)]], { x0: 300, x1: 1100 }) +
      nvHeroBack(220, 1700, 1.3) + (t > Si ? funTag('COUCOU !', 900, 760, t, Si, { size: 44, bg: KGREEN, r: 6 }) : '') +
      kthin('il te fait', CX, 400, t, Fa - .15, { size: 58 }) + kword('SIGNE', CX, 540, t, Si - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(26, 'fait'), 'pop_hi', .4], [at(26, 'signe') - .05, 'boom', .3], [at(26, 'signe'), 'ding', .5]] });

// B027 — « Enfin, quelqu'un de sympa ! » : extase, yeux en cœur, débloqué (2/3)
B(27, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const En = at(27, 'enfin'), Sy = at(27, 'sympa');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nvCantine(t), haze: .35 }]) + op(.3, glow(CX, 1000, 600, '#fff3a0', .9)) + unlock(CX, 1000, t, En, { part: 'back', r: 470 }) +
      heroP({ x: CX, y: 1490, s: 1.35, tray: 1, expr: t > Sy ? 'love' : 'ecstatic' }, t) + unlock(CX, 1000, t, En, { part: 'front', r: 470 }) + (t > Sy ? heartsUp(t, CX, 1000, 5) : '') +
      kword('ENFIN !', CX, 420, t, En - .05, { size: 120, fill: SX.acc2 }) + kthin("quelqu'un de sympa !", CX, 570, t, at(27, 'quelqu') - .1, { size: 60 }); },
  sfx: [[0, 'flash_hit', .4], [at(27, 'enfin') - .05, 'boom', .5], [at(27, 'enfin'), 'angel', .5], [at(27, 'sympa'), 'sparkle', .5], [at(27, 'sympa') + .1, 'tada', .4]] });

// B028 — « Tu t'approches. » : ralenti rêveur, il avance avec son plateau, Kevin salue
B(28, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ap = at(28, 'approches'), wv = Math.sin(t * 16) * 22, wk = Math.sin(t * 8);
    return nvCantine(t, { counter: false }) + op(.18, rect(-M, -M, W + 2 * M, H + 2 * M, '#ffd9e6', 0, 0)) + nvTable(t, 1220, .9, [[820, (x, yb, s) => kevin({ x, y: yb, s: 1.1, expr: 'happy', armR: [-70 + wv, -100 + wv], flip: 1 }, t)]], { x0: 560, x1: 1100 }) +
      heroP({ x: lerp(220, 380, t / d), y: 1490, s: 1.3, tray: 1, expr: 'happy', face: { blush: 1 }, legL: [95 + wk * 16, 90], legR: [85 - wk * 16, 90] }, t) + sparkle(160, 900, .4 + .2 * Math.sin(t * 7), '#fff') + sparkle(520, 820, .3 + .2 * Math.sin(t * 9), '#fff') +
      kthin("tu t'approches…", CX, 430, t, Ap - .15, { size: 64 }); },
  sfx: [[0, 'whoosh', .3], [.05, 'steps', .5], [at(28, 'approches'), 'magic', .3], [at(28, 'approches') + .2, 'pop_hi', .3]] });

// B029a — « Il crie : » : gros plan Kevin qui prend sa respiration
const O29 = at(29, 'non') - .12;
B(29, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d) }),
  draw: (t, d, T) => { const Cr = at(29, 'crie');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nvCantine(t, { counter: false }), haze: .35 }, { z: 1, svg: kevinHead(CX, 990, 220, { expr: 'shock', face: { mouth: 'o' } }, t) }]) +
      kthin('il crie :', CX, 440, t, Cr - .15, { size: 64 }); },
  sfx: [[0, 'whoosh', .3], [at(29, 'crie'), 'gasp', .5]] });
// B029b — « NON, JE PARLAIS À MON POTE DERRIÈRE ! » : Kevin hurle et montre le pote derrière le nouveau
B(29, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t < .4 ? 6 : 2 }),
  draw: (t, d, T) => { const No = at(29, 'non') - O29, Pa = at(29, 'parlais') - O29, Po = at(29, 'pote') - O29, De = at(29, 'derriere') - O29, wv = Math.sin(t * 16) * 22;
    return nvCantine(t, { counter: false }) + nvTable(t, 1150, .6, [[150, nvSeat(4, { expr: 'joy', armL: [-140 + wv, -120], tt: t })]], { x0: 20, x1: 330 }) +
      heroP({ x: 420, y: 1490, s: 1.3, tray: 1, expr: t > De ? 'shock' : 'happy' }, t) +
      kevin({ x: 850, y: 1500, s: 1.35, flip: 1, expr: 'angry', face: { mouth: 'scream' }, armR: [-170, -175], armL: [110, 100] }, t) +
      (t > Po ? funTag('LE POTE', 160, 760, t, Po, { size: 40, bg: KGREEN, r: -6 }) + markerArrow(560, 700, 230, 840, t, Po, { bend: -40 }) : '') +
      kword('NON !', CX, 440, t, No - .05, { size: 150, fill: '#fff', op: t > Pa ? 0 : 1 }) + kthin('je parlais à mon pote', CX, 410, t, Pa - .1, { size: 56 }) +
      kword('DERRIÈRE !', CX, 540, t, De - .05, { size: 100, fill: SX.acc2 }) + nvFlash(t, No, .5); },
  sfx: [[0, 'flash_hit', .5], [at(29, 'non') - O29 - .05, 'boom', .6], [at(29, 'pote') - O29, 'pop_hi', .4], [at(29, 'derriere') - O29 - .05, 'boom', .5], [at(29, 'derriere') - O29 + .1, 'scratch', .5]] }, O29);

// B030a — « AH. » : gros plan, sourire figé, grisaille
const O30 = at(30, 'tu') - .1;
B(30, { enter: 'crash', cam: () => ({ z: 1.1 }),
  draw: (t, d, T) => { const Ah = at(30, 'ah');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nvCantine(t), haze: .45 }, { z: 1, svg: heroBust(CX, 970, 220, { expr: 'deadpan', face: { mouth: 'flat' } }, t) }]) + op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#6a6f7a', 0, 0)) +
      kword('AH.', CX, 470, t, Ah - .05, { size: 200, fill: '#fff' }); },
  sfx: [[at(30, 'ah') - .05, 'boom', .4], [at(30, 'ah'), 'crickets', .6]] });
// B030b — « Tu fais demi-tour avec ton plateau. » : pirouette ratée, toute la cantine rigole
B(30, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Dm = at(30, 'demi') - O30, Pl = at(30, 'plateau') - O30, k = seg(t, Dm, Dm + .35), sx = Math.cos(k * Math.PI), x = lerp(540, 300, seg(t, Dm + .3, d));
    const h = heroP({ x: 0, y: 0, s: 1.3, tray: 1, expr: 'embarrassed', flip: k > .5 ? 1 : 0, legL: [95 + Math.sin(t * 9) * 14 * (k >= 1), 90], legR: [85 - Math.sin(t * 9) * 14 * (k >= 1), 90] }, t);
    return nvCantine(t, { counter: false }) + nvFull(t, { expr: 'laugh' }) + G(`translate(${f1(x)} 1530) scale(${f1(Math.max(.08, Math.abs(sx)))} 1)`, h) +
      (k > 0 && k < 1 ? path('M380 1000A170 60 0 1 0 700 1000', 'none', 10, '#fff') : '') +
      kthin('tu fais', CX, 400, t, 0, { size: 58 }) + kword('DEMI-TOUR', CX, 530, t, Dm - .05, { size: 110, fill: SX.acc2 }) + (t > Pl ? funTag('avec ton plateau', 760, 760, t, Pl, { size: 36, bg: '#8fd0ff', fg: SX.ink, r: 5 }) : ''); },
  sfx: [[0, 'whoosh', .3], [at(30, 'demi') - O30, 'whoosh', .6], [at(30, 'demi') - O30 + .2, 'squeak', .3], [at(30, 'plateau') - O30, 'pop', .4], [at(30, 'plateau') - O30 + .2, 'steps', .3]] }, O30);

// B031 — « Comme un serveur qui vient de se faire licencier. » : restaurant, nœud pap', serviette, plateau en l'air, nuage de pluie, VIRÉ
B(31, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Se = at(31, 'serveur'), Li = at(31, 'licencier'), wk = Math.sin(t * 7);
    const high = G(tr(0, -40), ell(0, 0, 90, 16, '#c9d3dc', 6) + rect(-14, -64, 28, 60, 'rgba(210,240,255,.9)', 6, 4));
    const towel = G(tr(0, 10), rect(-24, 0, 48, 90, '#fff', 6, 5) + line(-24, 30, 24, 30, 4, '#5ec4f0'));
    let rain = ''; for (let i = 0; i < 6; i++) rain += line(330 + i * 26, 780 + ((t * 420 + i * 50) % 160), 324 + i * 26, 806 + ((t * 420 + i * 50) % 160), 5, '#5ec4f0');
    return restoT(t) + WASH() + adult(0, { x: 880, y: 1490, s: 1.15, expr: 'angry', mustache: true, look: [-1, 0], armL: [180, 185], armR: [70, 80] }, t) +
      heroP({ x: lerp(480, 340, t / d), y: 1500, s: 1.3, flip: 1, bow: 1, expr: 'sob', armR: [-80, -95], holdR: high, armL: [100, 90], holdL: towel, legL: [95 + wk * 14, 90], legR: [85 - wk * 14, 90] }, t) +
      (t > Se ? G(tr(400, 720), cloud(0, 0, 1.0, '#9aa3ad', 6)) + rain : '') +
      kthin('comme un serveur…', CX, 400, t, Se - .2, { size: 58 }) + kword('LICENCIÉ', CX, 530, t, Li - .05, { size: 110, fill: SX.acc2 }) + stamp(820, 760, 'VIRÉ', t, Li + .2, '#e2463a', -12, 80); },
  sfx: [[0, 'whoosh', .4], [at(31, 'serveur'), 'ding', .4], [at(31, 'licencier') - .05, 'thud', .6], [at(31, 'licencier') + .2, 'sting', .5], [at(31, 'vient'), 'thunder', .2]] });

// B032 — « Puis arrive le cours de sport. » : gymnase, le prof de sport siffle
B(32, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ar = at(32, 'arrive'), Sp = at(32, 'sport'), blow = t > Sp;
    let row = ''; [[330, 2], [470, 4], [610, 6], [750, 1]].forEach(([x, i]) => row += kid(i, { x, y: 1260, s: .7, expr: 'neutral', shirt: '#fff' }, t + i));
    return nvGym(t) + row + nvCoach({ x: 860, y: 1500, s: 1.15, flip: 1, expr: blow ? 'angry' : 'neutral', face: blow ? { mouth: 'o', blush: 1 } : {}, armR: [-120, -150], holdR: nvWhistle() }, t) +
      heroP({ x: 230, y: 1500, s: 1.25, expr: 'worried', shirt: '#fff' }, t) + (blow ? G(tr(720, 960), speedLines(t, 0, 0, 10, 'rgba(255,255,255,.8)')) : '') +
      kthin('puis arrive le cours de', CX, 400, t, Ar - .2, { size: 54 }) + kword('SPORT', CX, 540, t, Sp - .05, { size: 130, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(32, 'arrive'), 'steps', .3], [at(32, 'sport') - .05, 'boom', .4], [at(32, 'sport'), 'whistle', .6]] });

// B033 — « Le professeur demande de former des équipes. » : chasubles rouge / bleu, tableau ÉQUIPE A / ÉQUIPE B
B(33, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const De = at(33, 'demande'), Fo = at(33, 'former'), Eq = at(33, 'equipes');
    const bibs = G(tr(0, -30), rect(-40, -40, 80, 70, '#e2463a', 10, 5) + rect(-40, -40, 80, 70, '#5b8fd8', 10, 5).replace('<rect', '<rect transform="translate(30 20)"'));
    return nvGym(t) + nvCoach({ x: CX, y: 1500, s: 1.25, expr: 'smug', face: t > De && t < Eq ? { mouth: 'talk' } : {}, armR: [-60, -100], holdR: bibs, armL: [110, 100] }, t) +
      cutout(heroP({ x: 200, y: 1480, s: 1.0, expr: 'worried', shirt: '#fff' }, t), 0) +
      funTag('ÉQUIPE A', 250, 860, t, Fo, { size: 46, bg: '#e2463a', r: -6 }) + funTag('ÉQUIPE B', 830, 860, t, Eq, { size: 46, bg: '#5b8fd8', r: 6 }) +
      kthin('former des', CX, 400, t, Fo - .15, { size: 58 }) + kword('ÉQUIPES', CX, 540, t, Eq - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(33, 'professeur'), 'whistle', .3], [at(33, 'former'), 'pop', .5], [at(33, 'equipes') - .05, 'boom', .4], [at(33, 'equipes'), 'pop', .5]] });

// B034 — « Tout le monde se choisit. » : ça se pointe du doigt, les élèves filent à gauche (rouge) et à droite (bleu)
B(34, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .4 }),
  draw: (t, d, T) => { const To = at(34, 'tout'), Ch = at(34, 'choisit');
    let s = ''; [0, 1, 2, 3, 4, 5].forEach(i => { const side = i % 2 ? 1 : -1, t0 = To + i * .1, k = eOutCubic(seg(t, t0, t0 + .35)), x0 = 300 + i * 96, x1 = side < 0 ? 110 + (i >> 1) * 130 : 970 - (i >> 1) * 130;
      s += kid(i + 1, { x: lerp(x0, x1, k), y: 1300 + (i % 3) * 40, s: .9, shirt: side < 0 ? '#e2463a' : '#5b8fd8', expr: k > .5 ? 'joy' : 'happy', flip: side > 0 ? 1 : 0, armR: k > 0 && k < 1 ? [-20, -10] : [70, 80] }, t + i); });
    return nvGym(t) + s + heroP({ x: CX, y: 1500, s: 1.2, expr: 'confused', shirt: '#fff', look: [Math.sin(t * 9) * 1.3, 0] }, t) +
      kword('TOUT LE MONDE', CX, 420, t, To - .05, { size: 92, fill: '#fff' }) + kthin('se choisit', CX, 560, t, Ch - .15, { size: 64 }); },
  sfx: [[0, 'whoosh', .3], [at(34, 'tout'), 'pop', .4], [at(34, 'monde'), 'pop', .4], [at(34, 'choisit'), 'pop', .4], [at(34, 'choisit') + .2, 'pop_hi', .4]] });

// B035 — « Toi, tu restes au milieu. » : seul dans le rond central, projecteur, boule d'herbe, les deux équipes le fixent
B(35, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const Re = at(35, 'restes'), Mi = at(35, 'milieu');
    let s = ''; for (let i = 0; i < 3; i++) s += kid(i + 1, { x: 90 + i * 120, y: 1320 + (i % 2) * 40, s: .85, shirt: '#e2463a', expr: 'deadpan', look: [1, 0] }, t + i) + kid(i + 4, { x: 990 - i * 120, y: 1320 + (i % 2) * 40, s: .85, shirt: '#5b8fd8', expr: 'deadpan', flip: 1, look: [1, 0] }, t + i);
    return nvGym(t) + op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#1d2026', 0, 0)) + s + nvSpot(CX, 120, CX, 1530, 240, 1) +
      heroP({ x: CX, y: 1520, s: 1.25, expr: 'sad', shirt: '#fff' }, t) + tumbleweed(lerp(-200, 1250, t / d), 1600, .8, t * 300) +
      kthin('toi, tu restes', CX, 410, t, at(35, 'toi') - .1, { size: 58 }) + kword('AU MILIEU', CX, 550, t, Mi - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(35, 'restes'), 'crickets', .6], [at(35, 'milieu') - .05, 'boom', .4], [at(35, 'milieu') + .1, 'wind', .3]] });

// B036 — « Tu es littéralement le dernier personnage disponible dans le menu. » : écran de sélection, tout est PRIS, le curseur finit sur lui
B(36, { enter: 'none', trans: 'glitch', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Li = at(36, 'litteralement'), Dr = at(36, 'dernier'), Mn = at(36, 'menu');
    const cur = t < Dr ? Math.min(7, Math.floor(seg(t, .15, Dr) * 8)) : 8;
    return nvSelect(t, cur, { pulse: t > Dr, heroExpr: t > Mn ? 'embarrassed' : 'worried' }) +
      kthin('tu es littéralement', CX, 380, t, Li - .2, { size: 56, out: Dr - .15 }) + kword('DERNIER PERSO DISPO', CX, 380, t, Dr - .05, { size: 64, fill: SX.acc2 }) +
      (t > Mn ? funTag('DISPO ✓', 850, 1170, t, Mn, { size: 40, bg: KGREEN }) : '') + (t > Dr ? popStars(850, 1040, t, Dr + .05, 8, 200) : ''); },
  sfx: [[0, 'whoosh', .4], [.4, 'tick', .4], [.8, 'tick', .4], [at(36, 'dernier') - .05, 'boom', .5], [at(36, 'dernier') + .05, 'ding', .5], [at(36, 'menu'), 'pop_hi', .4]] });

// B037a — « Mais un jour, à la cantine, » : lumière dorée, cantine plus douce
const O37 = at(37, 'quelqu') - .15;
B(37, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Jo = at(37, 'jour'), Ca = at(37, 'cantine');
    return nvCantine(t, { counter: false }) + op(.2, rect(-M, -M, W + 2 * M, H + 2 * M, '#ffd9a0', 0, 0)) + nvFull(t, { expr: 'happy' }) + op(.25, glow(CX, 900, 600, '#fff3a0', .8)) +
      heroP({ x: 300, y: 1530, s: 1.3, tray: 1, expr: 'neutral' }, t) +
      kthin('mais un jour,', CX, 400, t, Jo - .2, { size: 60 }) + kword('À LA CANTINE', CX, 540, t, Ca - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(37, 'jour'), 'magic', .4], [at(37, 'cantine') - .05, 'pop', .5], [at(37, 'cantine') + .15, 'chirp', .3]] });
// B037b — « …quelqu'un décale son sac. » : une fille pousse son sac, la chaise se libère
B(37, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Qu = at(37, 'quelqu') - O37, Dc = at(37, 'decale') - O37, Sa = at(37, 'sac') - O37, k = eOutCubic(seg(t, Dc, Dc + .4));
    return nvCantine(t, { counter: false }) + WASH('rgba(255,236,200,.25)') + nvChair(760, 1400, .9) +
      nvTable(t, 1450, 1.15, [[330, nvSeat(3, { expr: 'happy', look: [1, 0], armR: [10, 0], tt: t })]], { x0: 40, x1: 1060, noTray: () => false }) +
      dBag(lerp(760, 1000, k), 1120 + 200 * k * k, 1.1, '#ff8fb1', 20 * k) + (t > Sa ? sparkle(780, 1050, .6 + .2 * Math.sin(t * 9), '#fff') : '') +
      kthin("quelqu'un", CX, 400, t, Qu - .1, { size: 60 }) + kword('DÉCALE SON SAC', CX, 540, t, Dc - .05, { size: 80, fill: SX.acc2 }) + (t > Dc ? markerArrow(780, 1000, 990, 1050, t, Dc, { bend: 60 }) : ''); },
  sfx: [[0, 'whoosh', .3], [at(37, 'decale') - O37, 'whoosh_up', .4], [at(37, 'decale') - O37 + .3, 'thud', .4], [at(37, 'sac') - O37, 'sparkle', .5]] }, O37);

// B038 — « Tu veux t'asseoir avec nous ? » : la table entière sourit, bulle
B(38, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ve = at(38, 'veux'), No = at(38, 'nous');
    return nvCantine(t, { counter: false }) + WASH('rgba(255,236,200,.25)') + nvChair(800, 1400, .9) +
      nvTable(t, 1450, 1.15, [[200, nvSeat(5, { expr: 'happy', tt: t + 1 })], [480, nvSeat(3, { expr: 'joy', armR: [-40, -70], tt: t })]], { x0: 40, x1: 1060 }) +
      chatBubble(CX, 640, 680, 190, "Tu veux t'asseoir\navec nous ?", t, Ve - .05, false, 50) + (t > No ? heartsUp(t, 480, 900, 3) : ''); },
  sfx: [[0, 'whoosh', .3], [at(38, 'veux') - .05, 'pop', .5], [at(38, 'asseoir'), 'pop_hi', .3], [at(38, 'nous'), 'chirp', .4]] });

// B039 — « Tu hésites. » : gros plan, yeux qui hésitent, sueur, points d'interrogation
B(39, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const He = at(39, 'hesites');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nvCantine(t, { counter: false }), haze: .4 }, { z: 1, svg: heroBust(CX, 980, 220, { expr: 'worried', look: [Math.sin(t * 10) * 1.2, 0] }, t) }]) + sweat(700, 840 + (t * 40) % 30, 1.2) +
      ftext(260, 860 - 30 * seg(t, He, He + .3), '?', { size: 110, fill: SX.acc2 }) + ftext(840, 760, '?', { size: 80, fill: '#fff' }) + kthin('tu hésites…', CX, 440, t, 0, { size: 64 }); },
  sfx: [[0, 'heartbeat', .4], [at(39, 'hesites'), 'hmm', .5], [at(39, 'hesites') + .1, 'pop_hi', .3]] });

// B040 — « Puis tu souris. » : petit sourire tendre, éclat
B(40, { enter: 'none', cam: (t, d) => ({ z: lerp(1.1, 1.14, t / d) }),
  draw: (t, d, T) => { const So = at(40, 'souris');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nvCantine(t, { counter: false }), haze: .3 }, { z: 1, svg: heroBust(CX, 980, 220, { expr: t > So ? 'happy' : 'worried', face: t > So ? { blush: 1 } : {} }, t) }]) +
      op(.25, glow(CX, 980, 500, '#fff3a0', .7)) + (t > So ? sparkle(650, 1060, .9 + .2 * Math.sin(t * 20), '#fff') : '') + kthin('puis tu souris.', CX, 440, t, 0, { size: 64 }); },
  sfx: [[at(40, 'souris'), 'glint', .6], [at(40, 'souris') + .05, 'sparkle', .4], [.05, 'whoosh', .2]] });

// B041 — « Parce qu'il faut parfois des semaines pour trouver sa place… » : le calendrier s'effeuille, il rit à table avec eux
B(41, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pf = at(41, 'parfois'), Se = at(41, 'semaines'), Pl = at(41, 'place'), wk = 1 + Math.min(5, Math.floor(seg(t, Se, Pl) * 6));
    let pages = ''; for (let i = 0; i < 2; i++) pages += calendarPage(860, 800 - i * 6, .8, 4 - i * 6, 'S' + Math.max(1, wk - i));
    const fly = t > Se && t < Pl ? G(tr(860 + ((t * 4) % 1) * 200, 800 - ((t * 4) % 1) * 300, .8, ((t * 4) % 1) * 90), calendarPage(0, 0, 1, 0, 'S' + wk)) : '';
    return nvCantine(t, { counter: false }) + WASH('rgba(255,236,200,.25)') + pages + fly +
      nvTable(t, 1450, 1.1, [[230, nvSeat(5, { expr: 'laugh', tt: t + 1 })], [520, (x, yb, s) => heroP({ x, y: yb, s, expr: 'laugh', bag: false }, t)], [810, nvSeat(3, { expr: 'joy', flip: 1, tt: t })]], { x0: 40, x1: 1060 }) +
      kthin("parce qu'il faut parfois", CX, 400, t, Pf - .2, { size: 54 }) + kword('DES SEMAINES', CX, 520, t, Se - .05, { size: 96, fill: '#fff' }) + funTag('SA PLACE', 300, 760, t, Pl - .05, { size: 54, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .4], [at(41, 'parfois'), 'pop_hi', .3], [at(41, 'semaines') - .05, 'boom', .4], [at(41, 'semaines') + .1, 'clock_fast', .3], [at(41, 'place') - .05, 'ding', .5]] });

// B042a — « ET UNE SIMPLE CHAISE LIBRE » : la chaise libre brille, débloqué (3/3)
const O42 = at(42, 'pour') - .12;
B(42, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Si = at(42, 'simple'), Ch = at(42, 'chaise');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nvCantine(t, { counter: false }), haze: .3 }]) + op(.3, glow(CX, 1000, 500, '#fff3a0', .9)) + unlock(CX, 1000, t, Ch, { part: 'back', r: 470 }) +
      G(tr(CX, 1290, 1 + .03 * Math.sin(t * 6)), cutout(nvChair(0, 0, 1.15), 10)) + unlock(CX, 1000, t, Ch, { part: 'front', r: 470 }) + funBox(CX, 1000, 300, 420, t, Ch + .2, { label: 'chaise.png' }) +
      kthin('et une simple', CX, 400, t, Si - .2, { size: 60 }) + kword('CHAISE LIBRE', CX, 540, t, Ch - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(42, 'simple'), 'pop_hi', .4], [at(42, 'chaise') - .05, 'boom', .5], [at(42, 'chaise'), 'sparkle', .6], [at(42, 'libre'), 'tada', .5]] });
// B042b — FIN : « POUR COMMENCER À SE SENTIR CHEZ SOI. » : assis avec ses potes, paillasson « CHEZ MOI », Kevin fait encore signe à son pote
B(42, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Co = at(42, 'commencer') - O42, Ch = at(42, 'chez') - O42, wv = Math.sin(t * 16) * 22;
    const mat = G(tr(520, 1560), path('M-230 -50L230 -50L260 50L-260 50Z', '#c58e55', 7) + ftext(0, 20, 'CHEZ MOI', { size: 50, fill: '#fff' }));
    return nvCantine(t, { counter: false }) + WASH('rgba(255,236,200,.28)') + nvTable(t, 1060, .5, [[880, (x, yb, s) => kevin({ x, y: yb, s, expr: 'happy', armR: [-70 + wv, -100 + wv] }, t)]], { x0: 640, x1: 1060, trays: false }) +
      nvTable(t, 1450, 1.1, [[230, nvSeat(5, { expr: 'laugh', tt: t + 1 })], [520, (x, yb, s) => heroP({ x, y: yb, s, expr: 'joy', face: { blush: 1 }, bag: false }, t)], [810, nvSeat(3, { expr: 'joy', flip: 1, tt: t })]], { x0: 40, x1: 1060 }) +
      mat + heartsUp(t, 520, 1000, 4) + confetti(t, Ch, 26) +
      kthin('pour commencer à se sentir', CX, 410, t, Co - .2, { size: 52 }) + kword('CHEZ SOI.', CX, 570, t, Ch - .05, { size: 150, fill: SX.acc2 }) + (t > Ch ? popStars(CX, 570, t, Ch + .05, 8, 380) : ''); },
  sfx: [[0, 'whoosh', .4], [at(42, 'commencer') - O42, 'magic', .4], [at(42, 'chez') - O42 - .05, 'boom', .5], [at(42, 'chez') - O42, 'tada', .6], [at(42, 'chez') - O42 + .3, 'sparkle', .4]] }, O42);

SCENES.sort((a, b) => a.s - b.s);
