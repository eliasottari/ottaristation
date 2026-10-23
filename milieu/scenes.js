// ============================================================
//  « Pourquoi c'est horrible d'être l'enfant du milieu ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Famille : la grande sœur (brevet) puis le grand frère (« le premier »), TOI (t-shirt moutarde « 2 », épi rebelle),
//  le petit frère (« le bébé », boucles blondes). Les CAPITALES du script = moments criés → kword slam + flash.
//  Fin tendre : le héros a appris à se taire (placard plein de « problèmes »), le petit frère vient le serrer dans ses bras.
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

// ---------- SIZEX fun : accent VERT SAUGE (propre à l'épisode), jaune marqueur ----------
sxFun('#5f9e6e'); SX.acc2 = '#ffd23f'; SX.cool = '#8fd0ff';
const MUST = '#e3a92b', HERO_HC = '#6b4226';

// ============================================================
//  LE HÉROS : l'enfant du milieu — cheveux châtains + ÉPI rebelle, t-shirt moutarde floqué « 2 » (ni premier, ni bébé)
// ============================================================
const miHair = (r, t, o) => { const [b, f] = hairSvg('short', HERO_HC, r, t), sw = Math.sin(t * 5) * r * .05;
  const d = `M${f1(r * .02)} ${f1(-r * .96)}C${f1(-r * .02)} ${f1(-r * 1.3)} ${f1(r * .34 + sw)} ${f1(-r * 1.44)} ${f1(r * .3 + sw)} ${f1(-r * 1.2)}`;
  return [b, f + path(d, 'none', 15) + path(d, 'none', 7, HERO_HC)]; };
const miReindeer = G(tr(0, -128), path('M-14 -18L-26 -46M-24 -36L-38 -42M14 -18L26 -46M24 -36L38 -42', 'none', 6, '#8a5a3a') + circ(0, 0, 24, '#8a5a3a', 4) + circ(-8, -4, 3, OL, 0) + circ(8, -4, 3, OL, 0) + circ(0, 12, 8, '#ff3b30', 3));
const miFlake = (x, y) => path(`M${x - 12} ${y}L${x + 12} ${y}M${x} ${y - 12}L${x} ${y + 12}M${x - 8} ${y - 8}L${x + 8} ${y + 8}M${x + 8} ${y - 8}L${x - 8} ${y + 8}`, 'none', 4, '#fff');
function miShirtArt(o, t) { const bob = (o.bob ?? 1) * wave(t, .8, 4, o.seed || 0), fl = o.flip ? ' scale(-1 1)' : '';
  const art = o.pull ? path('M-58 -184L-38 -168L-19 -184L0 -168L19 -184L38 -168L58 -184', 'none', 6, '#fff') + miReindeer + miFlake(-44, -112) + miFlake(44, -112) + path('M-60 -84L60 -84', 'none', 8, '#fff')
    : ftext(0, -116, '2', { size: 66, fill: '#fff' });
  return G(ptr(o), G(`translate(0 ${f1(bob)})` + fl, art)); }
const heroP = (o, t) => { const oo = Object.assign({ age: 'kid', hairFn: miHair, shirt: MUST, pants: '#3b4a6b', seed: 2 }, o.pull ? { shirt: '#c8323a' } : {}, o); return person(oo, t) + miShirtArt(oo, t); };
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: miHair, seed: 2 }, o), t));

// ---------- la famille ----------
const MOM = { age: 'adult', hair: 'bun', hairColor: '#8a5a3a', shirt: '#e86a8a', pants: '#4b3b6e', skin: SK[2], necklace: true, seed: 4 };
const DAD = { age: 'adult', hair: 'side', hairColor: '#3a2a20', shirt: '#36a85a', pants: '#2f3b4e', skin: SK[4], glasses: true, mustache: true, seed: 8 };
const SIS = { age: 'kid', hair: 'long', hairColor: '#2b2420', shirt: '#8a6ad8', pants: '#4b3b6e', skin: SK[0], seed: 6 };
const BRO = { age: 'adult', hair: 'short', hairColor: '#1f1a18', shirt: '#5b8fd8', pants: '#2f3b4e', skin: SK[0], seed: 7 };
const PETIT = { age: 'kid', hair: 'curly', hairColor: '#f0b84a', shirt: '#9fd6ff', pants: '#5b8fd8', skin: SK[2], seed: 9 };
const miP = base => (o, t) => person(Object.assign({}, base, o), t);
const miH = base => (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, base, o), t));
const miMom = miP(MOM), miDad = miP(DAD), miSis = miP(SIS), miBro = miP(BRO), miPetit = miP(PETIT);
const miMomHead = miH(MOM), miSisHead = miH(SIS), miPetitHead = miH(PETIT), miBroHead = miH(BRO);

// éclair blanc au milieu d'un plan
const miFlash = (t, t0, k = .8) => t < t0 || t > t0 + .25 ? '' : op(k * (1 - seg(t, t0, t0 + .25)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0));

// ============================================================
//  ACCESSOIRES
// ============================================================
const miDiploma = (x, y, s = 1, r = 0, str = 'BREVET') => G(tr(x, y, s, r), rect(-190, -120, 380, 240, '#fff8e0', 10, 6) + rect(-170, -100, 340, 200, 'none', 6, 3, '#c9a020') + ftext(0, -36, str, { size: 50, fill: '#7a5a3a', stroke: 'none' }) +
  [0, 1].map(i => line(-130, 24 + i * 26, 60, 24 + i * 26, 4, '#d8c8a0')).join('') + path('M110 90L96 150L125 132L154 150L140 90Z', '#e2463a', 4) + circ(125, 70, 34, '#e2463a', 5) + circ(125, 70, 20, '#ffd23f', 4));
const miTooth = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-26 -30Q-30 -52 -10 -48Q0 -40 10 -48Q30 -52 26 -30Q24 0 14 30Q8 40 4 20Q0 8 -4 20Q-8 40 -14 30Q-24 0 -26 -30Z', '#fff', 5) + path('M-16 -34Q-10 -42 -2 -38', 'none', 4, '#bfe0ff'));
const miExam = (note = '', k = 1) => rect(-170, -210, 340, 420, '#fff', 8, 0) + ftext(0, -150, 'MATHS', { size: 44, fill: OL, stroke: 'none' }) + line(-130, -120, 130, -120, 4, '#e2463a') +
  ['2 + 2 = 4', '7 × 8 = 56', '9 − 3 = 6'].map((q, i) => ftext(-130, -60 + i * 66, q, { size: 34, fill: '#3a5bff', stroke: 'none', anchor: 'start' }) + path(`M96 ${-76 + i * 66}l12 14l24 -30`, 'none', 6, '#36a85a')).join('') +
  (note ? op(k, G(tr(30, 150, 1, -8), ftext(0, 0, note, { size: 84, fill: '#2f9a4a', stroke: 'none' }) + ell(0, -28, 130, 66, 'none', 8, '#2f9a4a'))) : '');
const miSheet = (s = .4, r = -8) => G(tr(0, -60, s, r), rect(-170, -210, 340, 420, '#fff', 8, 6) + miExam('18/20'));
const miCamPh = (on, s = .38) => phone(0, -50, s, 0, rect(-66, -128, 132, 250, '#cfe9ff', 12, 0) + circ(0, -10, 34, 'none', 7, '#5b8fd8') + circ(0, -10, 12, '#5b8fd8', 0)) + (on ? op(.85, glow(0, -80, 150, '#fff', .95)) + impactStar(0, -80, .55) : '');
const miCrown = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-70 0L-80 -80L-40 -40L0 -100L40 -40L80 -80L70 0Z', '#ffd23f', 6) + circ(0, -30, 10, '#e2463a', 4) + circ(-44, -24, 8, '#5ec4f0', 4) + circ(44, -24, 8, '#7be07b', 4));
const miPaci = (x, y, s = 1) => G(tr(x, y, s), ell(0, 0, 34, 22, '#5ec4f0', 5) + circ(0, 0, 10, '#fff', 4) + path('M-14 18Q0 52 14 18', 'none', 7, '#ff8fb1'));
const miRosette = (x, y, s = 1, str = '', r = 0) => G(tr(x, y, s, r), path('M-30 20L-52 120L-22 98L0 128L10 30Z', '#e2463a', 5) + path('M30 20L52 120L22 98L0 128L-10 30Z', '#c8323a', 5) +
  Array.from({ length: 12 }, (_, i) => { const a = R(i * 30); return circ(Math.cos(a) * 46, Math.sin(a) * 46, 18, '#ffd23f', 4); }).join('') + circ(0, 0, 46, '#ffd23f', 5) + circ(0, 0, 34, '#fff3b0', 4) + (str ? ftext(0, 12, str, { size: 34, fill: '#c9a020', stroke: 'none' }) : ''));
const miCap = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-34 0L-34 -30L34 -30L34 0Q0 14 -34 0Z', '#2b2b33', 5) + path('M-90 -40L0 -72L90 -40L0 -8Z', '#2b2b33', 5) + line(0, -40, 66, -22, 4, '#ffd23f') + line(66, -22, 66, 18, 5, '#ffd23f') + circ(66, 24, 8, '#ffd23f', 3));
const miCase = (x, yb, s = 1, c = '#e2463a', r = 0) => G(tr(x, yb, s, r), rect(-36, -190, 72, 50, 'none', 14, 10) + rect(-90, -150, 180, 150, c, 16, 6) + line(-90, -80, 90, -80, 5, shade(c, -.2)) + rect(26, -134, 46, 30, '#fff', 4, 3) + circ(-60, 4, 12, '#3a3f4a', 4) + circ(60, 4, 12, '#3a3f4a', 4));
const miLaptop = (x, y, s = 1, k = 1) => G(tr(x, y, s), (k > 0 ? op(.55 * k, glow(0, -140, 280, '#9fd6ff', .85)) : '') + rect(-200, -260, 400, 250, '#3a3f4a', 16, 7) + rect(-180, -240, 360, 210, k > 0 ? '#bfe8ff' : '#2b2f38', 6, 0) +
  (k > 0 ? op(k, ftext(0, -100, '★', { size: 110, fill: '#fff', stroke: 'none' })) : '') + path('M-240 0L240 0L270 36L-270 36Z', '#9aa3ad', 7));
const miConsole = (x, y, s = 1, r = 0, t = 0) => G(tr(x, y, s, r), op(.45, glow(0, 0, 230, '#ff8fb1', .7)) + rect(-176, -72, 80, 144, '#e2463a', 32, 6) + rect(96, -72, 80, 144, '#5ec4f0', 32, 6) + rect(-104, -76, 208, 152, '#2b2b33', 10, 6) +
  rect(-90, -62, 180, 124, '#7be07b', 6, 0) + circ(0, 0, 26, '#fff', 4) + circ(-136, -24, 14, '#2b2b33', 4) + circ(136, 24, 10, '#fff', 3) + circ(136, -24, 10, '#fff', 3) + sparkle(170, -100, .4 + .2 * Math.sin(t * 9), '#fff') + sparkle(-170, 90, .3, '#ffd23f'));
const miPlaster = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-50, -16, 100, 32, '#f6c9a0', 14, 5) + rect(-16, -16, 32, 32, '#e8b088', 4, 0) + circ(-34, 0, 3, '#d49a70', 0) + circ(34, 0, 3, '#d49a70', 0));
const miBump = (x, y, s = 1) => G(tr(x, y, s), ell(0, 0, 40, 30, '#ff8f8f', 6) + path('M-14 -10Q0 -20 14 -10', 'none', 4, '#fff'));
const miGoldStar = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M0 -50L14 -16L50 -14L22 8L32 46L0 24L-32 46L-22 8L-50 -14L-14 -16Z', '#ffd23f', 6) + path('M-12 -18L0 -36', 'none', 5, '#fff6c8'));
const miHorn = (x, y, s, k, r = 0) => { const d = `M30 0Q100 ${f1(-6 + 70 * (1 - k))} ${f1(110 + 60 * k)} ${f1(-4 + 150 * (1 - k))}`; return G(tr(x, y, s, r), path(d, 'none', 24) + path(d, 'none', 14, '#ff8fb1') + rect(-40, -14, 74, 28, '#5ec4f0', 8, 5)); };
const miDome = (x, yb, w, h) => op(.9, path(`M${x - w / 2} ${yb}L${x - w / 2} ${yb - h * .6}A${w / 2} ${h * .4} 0 0 1 ${x + w / 2} ${yb - h * .6}L${x + w / 2} ${yb}Z`, 'rgba(200,235,255,.28)', 6)) +
  path(`M${x - w * .36} ${yb - h * .55}Q${x - w * .3} ${yb - h * .85} ${x - w * .1} ${yb - h * .93}`, 'none', 10, 'rgba(255,255,255,.8)') + rect(x - w / 2 - 20, yb - 10, w + 40, 30, '#9aa3ad', 8, 6) + circ(x, yb - h - 14, 18, '#9aa3ad', 5);
const miSpeech = (x, y, k, str = '…') => k <= 0 ? '' : G(tr(x, y, k), path('M-130 -70Q-130 -110 -90 -110L90 -110Q130 -110 130 -70L130 10Q130 50 90 50L-10 50L-60 100L-50 50L-90 50Q-130 50 -130 10Z', '#fff', 6) + ftext(0, -10, str, { size: 70, fill: OL, stroke: 'none' }));

// ---------- décors repris de aine/ (renommés) : cuisine, table familiale, maison, main qui pointe ----------
function miKitchen(t, o = {}) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#fff1c4', 0, 0);
  for (let y = 820, j = 0; y < 1000; y += 60, j++) for (let x = -M + (j % 2) * 45; x < W + M; x += 90) s += rect(x, y, 90, 60, '#e8f4f8', 0, 3, '#c9dde6');
  for (let i = 0; i < 4; i++) { const x = 250 + i * 110; s += rect(x, 150, 104, 260, '#7fc8b0', 8, 6) + rect(x + 14, 170, 76, 220, 'none', 6, 3, '#5aa58c') + rect(x + 46, 340, 12, 40, '#fff', 5, 3); }
  s += rect(240, 132, 460, 22, '#5aa58c', 4, 5) + dJar(300, 130, '#ff9a4d', .7) + dJar(360, 130, '#7be07b', .7) + dPot(640, 130, .45, t, 2, '#e2463a');
  s += dWindowView(740, 300, 270, 330, t); for (let i = 0; i < 6; i++) s += path(`M${720 + i * 52} 290L${772 + i * 52} 290L${772 + i * 52} 380Q${746 + i * 52} ${410 + wave(t, .6, 6, i)} ${720 + i * 52} 380Z`, i % 2 ? '#fff' : '#e2463a', 4); s += rect(712, 278, 326, 16, '#8a5a3a', 6, 4);
  s += rect(-40, 380, 260, 870, '#eef3f6', 26, 7) + line(-40, 700, 220, 700, 6) + rect(186, 460, 16, 160, '#c9d3dc', 6, 4) + rect(186, 760, 16, 200, '#c9d3dc', 6, 4);
  s += [[30, 480, '#ff8fb1', -6], [120, 520, '#5ec4f0', 5], [40, 820, '#7be07b', 4], [130, 880, '#ffd23f', -5]].map(([x, y, c, r]) => G(tr(x, y, 1, r + wave(t, .8, 1.5, x)), rect(-40, -50, 80, 100, '#fff', 4, 4) + circ(0, -12, 22, c, 3) + path('M-20 26L0 14L20 30', 'none', 4, c) + circ(0, -54, 8, '#e2463a', 3))).join('') + G(tr(110, 1020, 1, 8), rect(-14, -14, 28, 28, '#ffd23f', 2, 3)) + circ(60, 650, 12, '#5b8fd8', 4) + circ(150, 1100, 12, '#ff9a4d', 4);
  s += wallClock(330, 520, 48, t) + G(tr(560, 540), rect(-80, -90, 160, 190, '#fff', 8, 5) + rect(-80, -90, 160, 34, SX.acc, 8, 5) + ftext(0, -64, 'CORVÉES', { size: 20, fill: '#fff', stroke: 'none' }) + [0, 1, 2, 3, 4].map(i => rect(-64, -42 + i * 26, 128, 16, DPAL[i], 4, 0)).join(''));
  s += line(250, 760, 690, 760, 8, '#9aa3ad') + [300, 380, 460, 540, 620].map((x, i) => G(tr(x, 760, 1, wave(t, .7, 4, i)), line(0, 0, 0, 50, 5, '#9aa3ad') + (i % 2 ? circ(0, 66, 18, '#c9d3dc', 4) : rect(-10, 50, 20, 36, '#c9d3dc', 4, 4)))).join('');
  s += WASH() + rect(220, 1000, 900, 30, '#b98552', 6, 6) + rect(220, 1030, 900, 230, '#7fc8b0', 0, 6);
  for (let i = 0; i < 2; i++) s += rect(240 + i * 170, 1050, 150, 90, '#8fd4bc', 8, 4) + rect(295 + i * 170, 1080, 40, 12, '#fff', 5, 3);
  s += rect(600, 1045, 220, 205, '#3a3f4a', 10, 5) + rect(620, 1100, 180, 120, '#ffb36b', 8, 4) + op(.4, glow(710, 1160, 120, '#ffd88a', .6)) + [0, 1, 2, 3].map(i => circ(630 + i * 52, 1070, 9, '#c9ced6', 3)).join('');
  s += G(tr(420, 1000), rect(-80, -110, 160, 110, '#c9d3dc', 12, 6) + rect(-100, -122, 200, 22, '#9aa3ad', 8, 5) + line(-100, -90, -128, -90, 10) + line(100, -90, 128, -90, 10)) + steam(400, 860, t, .8) + steam(450, 870, t + .4, .6);
  s += G(tr(930, 1000), path('M-80 -50Q0 40 80 -50Z', '#ff9a4d', 5) + circ(-30, -60, 22, '#e2463a', 4) + circ(10, -70, 22, '#ffd23f', 4) + circ(40, -56, 20, '#7be07b', 4)) + dMug(1060, 1000, .9, t, '#5b8fd8');
  s += dTileFloor(yb, '#f0e6da', '#d9c4a8') + dBin(1050, 1340, .7, '#36a85a') + dShoes(150, 1700, .7, '#5b8fd8');
  return s; }
function miTable(x, yb, s, t, o = {}) { let g = ''; for (let i = 0; i < 5; i++) { const cx = -380 + i * 190; g += rect(cx - 50, -330, 100, 150, '#c58e55', 14, 5) + line(cx - 36, -180, cx - 36, -40, 8) + line(cx + 36, -180, cx + 36, -40, 8); }
  g += rect(-520, -200, 1040, 40, '#b07a45', 8, 6) + path('M-520 -200L520 -200L540 -110L-540 -110Z', '#fff', 6) + [0, 1, 2, 3, 4, 5].map(i => path(`M${-540 + i * 180} -110l90 0l-45 30Z`, '#e2463a', 0)).join('') + line(-480, -110, -480, 0, 12) + line(480, -110, 480, 0, 12);
  g += [-380, -190, 0, 190, 380].map((cx, i) => ell(cx, -206, 60, 16, '#fff', 4) + ell(cx, -208, 34, 8, ['#ffd23f', '#7be07b', '#ff8fb1', '#ff9a4d', '#5ec4f0'][i], 0)).join('');
  return G(tr(x, yb, s), g); }
function miHouse(t, o = {}) { const yb = 1250, dk = o.dusk || 0;
  let s = SKY(t, mixC('#8fd3ff', '#ff9a6b', dk), mixC('#e6f6ff', '#ffe0b0', dk)) + dBirds(t, 3, 260) + op(.8, dSkyline(1010, mixC('#c3d6e4', '#d9a8a0', dk), 4)) + dHaze(.18, '255,245,235') + ell(200, 1080, 500, 120, '#9ccf8a', 0) + ell(900, 1090, 500, 110, '#8fc47c', 0);
  for (let i = 0; i < 4; i++) { const k = (t * .4 + i / 4) % 1; s += op(.7 * (1 - k), circ(770 + k * 60 + wave(t, .5, 10, i), 470 - k * 260, 26 + k * 40, '#eef0f4', 0)); }
  s += rect(730, 470, 70, 150, '#b8352b', 4, 6) + path('M140 640L540 380L940 640Z', '#d9534f', 7) + rect(180, 640, 720, 610, '#f6e3c0', 6, 7) + [0, 1, 2, 3, 4].map(i => line(180, 700 + i * 110, 900, 700 + i * 110, 3, '#ead2a8')).join('');
  [[260, 700], [660, 700]].forEach(([x, y]) => { s += rect(x, y, 160, 150, mixC('#cfe8ff', '#ffd88a', dk), 6, 6) + line(x + 80, y, x + 80, y + 150, 5) + path(`M${x} ${y}L${x + 50} ${y}Q${x + 30} ${y + 70} ${x} ${y + 150}Z`, '#e86a8a', 4) + rect(x - 10, y + 150, 180, 30, '#b98552', 4, 5) + dFlowers(x + 20, y + 150, 4, x, t); });
  s += rect(260, 960, 160, 150, '#cfe8ff', 6, 6) + line(340, 960, 340, 1110, 5) + rect(470, 920, 140, 330, '#5b8fd8', 6, 6) + circ(585, 1090, 10, '#ffd23f', 4) + rect(450, 1230, 180, 20, '#c9b8a0', 3, 5) + rect(660, 960, 160, 150, '#cfe8ff', 6, 6) + line(740, 960, 740, 1110, 5);
  s += rect(500, 870, 80, 34, '#fff8e0', 6, 4) + ftext(540, 896, 'N°7', { size: 22, fill: '#7a5a3a', stroke: 'none' });
  s += tree(1000, 1250, .85, t) + dPine(80, 1250, .8, t) + dBush(160, 1250, .6) + dBush(880, 1250, .55, '#4fa64f') + G(tr(980, 1260), rect(-6, -150, 12, 150, '#8a5a3a', 3, 4) + rect(-50, -200, 100, 60, '#e2463a', 18, 5) + ftext(0, -160, 'FAMILLE', { size: 16, fill: '#fff', stroke: 'none' }));
  s += dFence(-M, 440, 1260, '#fff') + dFence(640, W + M, 1260, '#fff') + rect(-M, 1260, W + 2 * M, 200, '#8fd16a', 0, 0) + rect(440, 1260, 200, 200, '#d8c8a8', 0, 4) + rect(-M, 1460, W + 2 * M, 110, '#c8ccd2', 0, 0) + line(-M, 1460, W + M, 1460, 6, '#9aa0a8') + rect(-M, 1570, W + 2 * M, 600, '#6e747c', 0, 0) + Array.from({ length: 8 }, (_, i) => rect(-M + i * 300, 1720, 160, 16, '#fff', 4, 0)).join('');
  s += dLampPost(40, 1470, .9, dk > .4) + (o.car !== false ? dCar(900, 1690, .8, '#ffd23f', 1) : '');
  if (dk) s += op(.2 * dk, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff7a3a', 0, 0));
  return s; }
function miPoint(tx, ty, ang, sleeve, k = 1, len = 700) { if (k <= 0) return ''; const a = R(ang), off = (1 - k) * 800;
  return G(tr(tx - Math.cos(a) * off, ty - Math.sin(a) * off, 1, ang), line(-len, 0, -100, 0, 74, OL) + line(-len, 0, -100, 0, 60, sleeve) + rect(-54, -18, 70, 36, SKIN, 18, 6) + rect(-130, -46, 96, 92, SKIN, 38, 6) + path('M-100 -10L-50 -10M-100 14L-50 14', 'none', 5) + ell(-82, -46, 30, 16, SKIN, 6)); }

// ---------- décors propres à l'épisode ----------
// fanions de fête
const miBunting = (t, y = 100) => { let s = path(`M-80 ${y}Q540 ${y + 120} 1160 ${y}`, 'none', 5); for (let i = 0; i < 12; i++) { const x = -20 + i * 100, u = (x + 80) / 1240, yy = y + 4 * u * (1 - u) * 60 + wave(t, .8, 3, i); s += path(`M${x - 34} ${f1(yy)}L${x + 34} ${f1(yy)}L${x} ${f1(yy + 64)}Z`, DPAL[i % 8], 4); } return s; };
// guirlande lumineuse
const miLights = (t, y = 90) => { let s = path(`M-80 ${y}Q540 ${y + 110} 1160 ${y}`, 'none', 5, '#2f5a3a'); for (let i = 0; i < 14; i++) { const x = -40 + i * 86, u = (x + 80) / 1240, yy = y + 4 * u * (1 - u) * 55, on = Math.sin(t * 6 + i * 1.9) > -.2; s += circ(x, yy + 18, 13, on ? DPAL[i % 8] : '#6a6a7a', 4) + (on ? op(.35, circ(x, yy + 18, 30, '#fff6c8', 0)) : ''); } return s; };
// gâteau sur une petite table
const miCake = (x, yb, s, t) => G(tr(x, yb, s), rect(-150, -200, 300, 24, '#ff9a4d', 6, 5) + line(-130, -176, -130, 0, 8) + line(130, -176, 130, 0, 8) + rect(-100, -300, 200, 100, '#ffe0ec', 14, 6) + rect(-70, -370, 140, 72, '#fff', 12, 6) +
  path('M-100 -270Q-75 -250 -50 -270Q-25 -250 0 -270Q25 -250 50 -270Q75 -250 100 -270', 'none', 6, '#ff8fb1') + [-40, 0, 40].map((cx, i) => rect(cx - 6, -420, 12, 50, DPAL[i + 1], 3, 3) + G(tr(cx, -432, 1 + .15 * Math.sin(t * 20 + i)), path('M0 -22Q12 -4 0 6Q-12 -4 0 -22Z', '#ffb03a', 3))).join(''));
function miSalonFete(t) { return salonF(t) + miBunting(t, 80) + dBalloon(70, 560, '#ff5c8a', t, 0, .8) + dBalloon(150, 620, '#ffd23f', t, 1, .7) + dBalloon(1010, 600, SX.acc, t, 2, .8) + miCake(900, 1330, .8, t); }
// sapin de Noël
function miTree(x, yb, s, t) { let g = rect(-26, -80, 52, 80, '#8a5a3a', 6, 6) + rect(-80, -40, 160, 50, '#e2463a', 8, 6);
  g += path('M-260 -100L0 -420L260 -100Z', '#2f8a4a', 7) + path('M-220 -280L0 -580L220 -280Z', '#36a85a', 7) + path('M-170 -450L0 -720L170 -450Z', '#4fb86a', 7);
  g += path('M-200 -170Q0 -110 200 -200', 'none', 8, '#ffd23f') + path('M-150 -350Q0 -300 160 -380', 'none', 8, '#ffd23f') + path('M-110 -520Q0 -480 110 -540', 'none', 8, '#ffd23f');
  [[-150, -140], [90, -160], [0, -250], [-100, -330], [120, -320], [-40, -430], [70, -470], [-60, -600], [40, -560], [180, -130]].forEach(([a, b], i) => { const on = Math.sin(t * 5 + i * 1.7) > 0; g += circ(a, b, 20, DPAL[i % 8], 4) + (on ? op(.5, circ(a, b, 34, '#fff6c8', 0)) : ''); });
  g += G(tr(0, -740, 1, wave(t, .5, 6)), path('M0 -60L16 -20L58 -18L24 8L36 50L0 26L-36 50L-24 8L-58 -18L-16 -20Z', '#ffd23f', 6)) + op(.35 + .1 * Math.sin(t * 4), circ(0, -740, 90, '#fff6a0', 0));
  return G(tr(x, yb, s), g); }
// salon de Noël (soir) : sapin, guirlande, cadeaux, neige dehors, chaussettes
function miNoel(t) { let s = salonF(t, { night: 1 });
  let snow = ''; for (let i = 0; i < 18; i++) { const x = 720 + (i * 67) % 280 + wave(t, .4, 10, i), y = 300 + ((t * (60 + i * 7) + i * 53) % 360); snow += circ(x, y, 5 + (i % 3), '#fff', 0); }
  s += clipR(720, 300, 280, 360, snow, 6) + miLights(t, 70) + op(.12, rect(-M, -M, W + 2 * M, H + 2 * M, '#ffb060', 0, 0));
  s += miTree(150, 1290, .9, t) + dGift(60, 1330, .9, '#e2463a', '#ffd23f') + dGift(250, 1340, .8, '#5ec4f0', '#fff') + dGift(150, 1380, .7, '#7be07b', '#e2463a');
  s += [[560, '#e2463a'], [640, '#36a85a']].map(([x, c], i) => G(tr(x, 760, 1, wave(t, .5, 4, i)), line(0, -40, 0, 0, 4) + path('M-26 0L26 0L26 70Q60 80 54 110L4 110Q-26 110 -26 80Z', c, 5) + rect(-30, -6, 60, 24, '#fff', 8, 4))).join('');
  return s; }
// escalier vu de côté (haut à gauche → bas à droite), rampe, cadres qui montent, palier, tapis
function miStairs(t) { const yb = 1300;
  let s = dWall('stripe', '#e6f0f7', '#d7e7f1', yb) + dBase(yb, '#fff');
  s += dWindowView(760, 170, 250, 300, t) + dCurtain(710, 150, 80, 360, SX.acc, t, 1) + dCurtain(960, 150, 80, 360, SX.acc, t, -1);
  s += dFrame(110, 200, 120, 150, 'face', '#c38a52', -3) + dFrame(290, 320, 120, 150, 'face', '#5b8fd8', 2) + dFrame(470, 450, 110, 140, 'heart', '#ff9a4d', -2) + dFrame(640, 580, 110, 130, 'face', '#8a6ad8', 3);
  s += wallClock(900, 640, 50, t) + dShelf(800, 880, 240, dBooks(815, 880, 120, 3) + dTrophy(990, 880, .6)) + dSwitch(1040, 1000);
  const y0 = 600, N = 7, xe = -140 + N * 100; let mass = `M-300 ${y0}`, tr_ = '';
  for (let i = 0; i < N; i++) { const x = -140 + i * 100, y = y0 + i * 100; mass += `L${x} ${y}L${x + 100} ${y}L${x + 100} ${y + 100}`;
    tr_ += rect(x - 6, y - 14, 112, 18, '#e0b585', 4, 5) + rect(x + 20, y - 12, 60, 12, '#e86a8a', 2, 0); }
  mass += `L${xe} 1300L-300 1300Z`;
  s += path(mass, '#c58e55', 7) + tr_;
  let rail = ''; for (let i = 0; i <= N; i++) { const x = -110 + i * 100, y = Math.min(y0 + i * 100, 1300); rail += line(x, y - 14, x, y0 - 230 + (x + 160), 9, '#8a5a3a'); }
  s += rail + line(-160, y0 - 260, xe + 70, y0 - 260 + xe + 230, 26, OL) + line(-160, y0 - 260, xe + 70, y0 - 260 + xe + 230, 16, '#8a5a3a') + rect(xe + 45, 1060, 50, 240, '#8a5a3a', 8, 6) + circ(xe + 70, 1050, 30, '#8a5a3a', 6);
  s += dParquet(yb, '#c49a6c') + dRug(900, 1420, 360, 100, '#5ec4f0', '#ffd23f') + dPot(1040, 1330, .9, t, 1) + dShoes(560, 1440, .6, '#e2463a') + dBall(300, 1520, .55, 0, '#ffd23f');
  return s; }
// stade : tribunes pleines qui sautent, projecteurs, drapeaux, piste
function miStade(t) { let s = SKY(t, '#8fd3ff', '#e6f6ff') + dBirds(t, 3, 230);
  for (const sd of [-1, 1]) { const x = sd < 0 ? 80 : 1000; s += rect(x - 14, 160, 28, 500, '#5a6370', 4, 5) + rect(x - 80, 100, 160, 90, '#3a4250', 12, 6) + [0, 1, 2].map(i => circ(x - 50 + i * 50, 145, 18, '#fff6c8', 4)).join('') + op(.25, path(`M${x} 190L${x + sd * -500} 1100L${x + sd * -200} 1100Z`, '#fff6c8', 0)); }
  s += rect(-M, 640, W + 2 * M, 520, '#4a5878', 0, 0);
  for (let r = 0; r < 6; r++) { const y = 680 + r * 80; s += rect(-M, y + 30, W + 2 * M, 14, '#3a4664', 0, 0); for (let i = 0; i < 16; i++) { const x = -30 + i * 72 + (r % 2) * 36, j = Math.max(0, Math.sin(t * 9 + i * 1.3 + r)) * 14; s += circ(x, y - j, 22, SK[(i + r) % 6], 4) + rect(x - 22, y + 14 - j, 44, 26, DPAL[(i * 3 + r) % 8], 8, 4); } }
  for (let i = 0; i < 5; i++) { const x = 120 + i * 210; s += line(x, 640, x, 520, 6) + path(`M${x} 520Q${x + 40} ${510 + wave(t, 1.2, 10, i)} ${x + 80} 525L${x + 80} 575Q${x + 40} ${560 + wave(t, 1.2, 10, i)} ${x} 570Z`, DPAL[i * 2 % 8], 4); }
  s += rect(-M, 1150, W + 2 * M, 900, '#d9533f', 0, 0) + line(-M, 1150, W + M, 1150, 8, '#fff') + [1220, 1320, 1450, 1620].map(y => line(-M, y, W + M, y, 6, 'rgba(255,255,255,.8)')).join('') + rect(-M, 1150, W + 2 * M, 20, '#7be07b', 0, 0);
  return s; }
// podium : marche 1 (centre) et marche 3 (droite)… pas de marche 2
const miPodium = (x, yb) => G(tr(x, yb), rect(-140, -200, 280, 200, '#ffd23f', 8, 7) + ftext(0, -70, '1', { size: 110, fill: '#fff' }) + rect(140, -110, 240, 110, '#e8b28a', 8, 7) + ftext(260, -30, '3', { size: 70, fill: '#fff' }));
// chambre partagée (jour) : lits superposés, fenêtre, posters, étagère, cartons, toise
function miRoom(t, o = {}) { const yb = 1250;
  let s = dWall('stripe', '#e3f1e6', '#d3e9d8', yb) + dBase(yb, '#fff');
  s += dWindowView(420, 250, 250, 320, t) + dCurtain(370, 230, 80, 400, '#ffd23f', t, 1) + dCurtain(620, 230, 80, 400, '#ffd23f', t, -1);
  s += dPoster(170, 330, 150, 200, '#5b8fd8', -4, circ(0, -20, 40, '#fff', 4) + path('M-30 50L0 -10L30 50Z', '#ffd23f', 4), t) + dPoster(880, 300, 140, 180, '#ff8fb1', 5, heart(0, 0, .9), t);
  s += wallClock(1010, 520, 44, t) + dShelf(60, 700, 300, dBooks(75, 700, 160, 4) + dTeddy(280, 700, .6) + dTrophy(335, 700, .5)) + dOutlet(560, 1180);
  s += G(tr(850, yb), rect(-200, -640, 30, 640, '#b98552', 8, 6) + rect(170, -640, 30, 640, '#b98552', 8, 6) + rect(-190, -470, 380, 70, '#5ec4f0', 14, 6) + rect(-190, -150, 380, 70, '#ff9a4d', 14, 6) +
    ell(-110, -486, 50, 22, '#fff', 5) + ell(-110, -166, 50, 22, '#fff', 5) + rect(-190, -410, 380, 24, '#b98552', 6, 5) + rect(-190, -90, 380, 24, '#b98552', 6, 5) + [0, 1, 2, 3, 4].map(i => line(120, -600 + i * 110, 170, -600 + i * 110, 8, '#8a5a3a')).join('') + line(120, -640, 120, -90, 8, '#8a5a3a'));
  if (o.toise) { const x = o.toise; s += rect(x - 46, 300, 92, 950, '#fff8e0', 10, 6); for (let y = 320; y < 1250; y += 30) s += line(x - 46, y, x - 46 + ((y - 320) % 150 ? 18 : 40), y, 4, '#c9a020'); s += G(tr(x, 270), circ(0, 0, 40, '#ffd23f', 5) + circ(-12, -6, 6, OL, 0) + circ(12, -6, 6, OL, 0) + path('M-30 -30L-40 -60M30 -30L40 -60', 'none', 6)); }
  s += WASH() + dParquet(yb, '#c49a6c') + dRug(CX, 1440, 760, 150, '#5ec4f0', '#ffd23f') + dBox(130, 1360, .9, 'CARTONS') + dBall(980, 1620, .6, 0, '#e2463a') + dShoes(700, 1720, .7, '#36a85a') + dTeddy(330, 1660, .7, '#ff9a4d');
  return s; }
// porte de chambre (aîné) : panneaux, poignée ; o.open = porte ouverte
const miDoor = (x, yb, t, o = {}) => G(tr(x, yb), rect(-170, -760, 340, 760, '#fff', 6, 7) + (o.open ? rect(-150, -740, 300, 740, '#2b2f50', 4, 0) + op(.5, glow(0, -300, 200, '#5ec4f0', .5)) : rect(-150, -740, 300, 740, '#c58e55', 4, 6) + rect(-110, -690, 220, 260, 'none', 8, 4, '#a8743f') + rect(-110, -380, 220, 300, 'none', 8, 4, '#a8743f') + circ(110, -360, 16, '#ffd23f', 5)) + (o.sign ? G(tr(0, -560, 1, wave(t, .6, 3)), line(-50, -60, 0, -100, 4) + line(50, -60, 0, -100, 4) + rect(-120, -60, 240, 110, '#fff', 12, 6) + ftext(0, -16, o.sign, { size: 30, fill: '#e2463a', stroke: 'none' }) + ftext(0, 26, o.sign2 || '', { size: 22, fill: OL, stroke: 'none' })) : ''));

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001 — SIGNATURE : grille encre, la fratrie en cut-out (toi AU MILIEU), titre 3 lignes, « débloqué » en étoiles sur MILIEU
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'milieu'), N9 = at(1, '9');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      cutout(miSis({ x: 175, y: 1530, s: 1.45, expr: t > K ? 'smugger' : 'happy', armR: [-60, -95], holdR: miDiploma(0, -40, .4, -8) }, t), 10) +
      cutout(miPetit({ x: 900, y: 1400, s: .95, expr: 'joy', flip: 1, armL: [-150, -120] }, t), 10) +
      G(tr(CX, 1470, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.3, expr: t > K ? 'jawdrop' : 'neutral' }, t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1060, 330, 340, t, K + .2, { label: 'milieu.png' }) +
      funTag(820, 860, '9 ANS', t, N9 - .05, { size: 44, bg: SX.acc, r: 6 }) +
      kthin("POURQUOI C'EST HORRIBLE", CX, 330, t, .05, { size: 50 }) + kthin("D'ÊTRE L'ENFANT DU", CX, 415, t, .3, { size: 54 }) +
      kword('MILIEU ?', CX, 540, t, K - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'milieu') - .05, 'boom', .6], [at(1, 'milieu'), 'sparkle', .5], [at(1, '9') - .05, 'pop', .5]] });

// B002 — « Ta grande sœur vient de décrocher son brevet. » : papier, la sœur en cut-out brandit son BREVET
B(2, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.08, .2),
  draw: (t, d, T) => { const So = at(2, 'soeur'), De = at(2, 'decrocher'), Br = at(2, 'brevet');
    return paper(SX.paper) + gobo(T, .12) + burst(700, 960, 300, t, De, '#ffe1b8', 16) +
      cutout(miSis({ x: 480, y: 1540, s: 1.5, expr: t > De ? 'ecstatic' : 'happy', armL: [-150, -120], armR: t > De ? [-40, -70] : [70, 80], holdR: t > De ? miDiploma(30, -70, .55, -10) : '' }, t), 12) +
      funTag(230, 760, 'GRANDE SŒUR', t, So - .1, { size: 40, bg: '#8a6ad8', r: -8 }) + markerText('mention TB', 840, 760, t, Br + .1, { size: 46 }) +
      kthin('ta grande sœur décroche son', CX, 420, t, 0, { size: 50 }) + kword('BREVET', CX, 560, t, Br - .05, { size: 120, fill: SX.acc2 }) + popStars(760, 960, t, Br, 8, 260); },
  sfx: [[0, 'whoosh', .4], [at(2, 'soeur') - .1, 'pop', .5], [at(2, 'decrocher'), 'whoosh_up', .4], [at(2, 'brevet') - .05, 'boom', .5], [at(2, 'brevet'), 'tada', .5]] });

// B003 — « Tes parents organisent une fête. » : papier, les parents en cut-out, banderole, confettis
B(3, { enter: 'none', trans: 'circle', transD: .22, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const Pa = at(3, 'parents'), Fe = at(3, 'fete'), k = pop(t, Pa, .35);
    const banner = k > 0 ? G(tr(CX, 790 + Math.sin(t * 4) * 6, k), path('M-330 -64L330 -64L306 64L-306 64Z', SX.acc, 7) + ftext(0, 22, 'BRAVO BREVET !', { size: 56, fill: '#fff' })) : '';
    return paper('#fdf0dc') + gobo(T, .1) + blob(CX, 1000, 300, t, '#ffd9e6', 3) +
      cutout(miMom({ x: 260, y: 1500, s: 1.15, expr: 'joy', armL: [-150, -120], armR: [-30, -60] }, t), 10) + cutout(miDad({ x: 820, y: 1500, s: 1.15, expr: 'laugh', flip: 1, armL: [-150, -120], armR: [-30, -60] }, t + 1), 10) +
      banner + confetti(t, Fe, 34) + kthin('tes parents organisent', CX, 420, t, 0, { size: 54 }) + kword('UNE FÊTE', CX, 570, t, Fe - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(3, 'parents'), 'pop', .6], [at(3, 'organisent'), 'pop_hi', .4], [at(3, 'fete') - .05, 'boom', .5], [at(3, 'fete'), 'tada', .5]] });

// B004 — « Ton petit frère vient de perdre sa première dent. » : salon en fête, le petit brandit sa dent, maman filme ; Kevin au gâteau
B(4, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pd = at(4, 'perdre'), De = at(4, 'dent'), up = eOutBack(seg(t, Pd - .1, Pd + .25));
    const tooth = up > 0 ? G(tr(0, -50 - 30 * up), miTooth(0, 0, 1.1 * up) + (t > De ? sparkle(36, -36, .5 + .2 * Math.sin(t * 12), '#fff') : '')) : '';
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: miSalonFete(t) + kevin({ x: 760, y: 1250, s: .6, expr: 'happy', armR: [-40, -80] }, t), haze: .12 },
      { z: 1, svg: miSis({ x: 110, y: 1540, s: 1.4, expr: 'happy', armR: [-50, -85], holdR: miDiploma(0, -40, .4, -8) }, t) + heroP({ x: 330, y: 1510, s: 1.2, expr: 'neutral', look: [1, 0], armR: [80, 90], holdR: miSheet(.32, 10) }, t) +
        miPetit({ x: 600, y: 1420, s: 1.0, expr: t > Pd ? 'ecstatic' : 'happy', armR: [-60, -100], holdR: tooth }, t) +
        miMom({ x: 890, y: 1500, s: 1.12, expr: 'love', flip: 1, armL: [-20, -40], holdL: miCamPh(t > De && (t * 3) % 1 < .15) }, t) },
      { z: .6, svg: blur(10, dBalloon(1040, 1700, '#5ec4f0', t, 1, 1.6)) }]) +
      markerCircle(690, 1060, 70, 70, t, De, { col: '#e2463a' }) +
      kthin('ton petit frère perd sa', CX, 420, t, 0, { size: 52 }) + kword('PREMIÈRE DENT', CX, 560, t, De - .3, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(4, 'petit'), 'pop_hi', .4], [at(4, 'perdre'), 'boing', .5], [at(4, 'dent') - .3, 'boom', .4], [at(4, 'dent'), 'sparkle', .5]] });

// B005 — « Tout le monde prend des photos. » : tous les téléphones sur le petit, flashs ; ta main avec la copie dépasse… ignorée
B(5, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), shake: t < .25 ? 5 : 0 }),
  draw: (t, d, T) => { const To = at(5, 'tout'), Pr = at(5, 'prend'), Ph = at(5, 'photos');
    const fl = i => [Pr, Pr + .22, Ph, Ph + .18].some(x => t > x + i * .04 && t < x + i * .04 + .12);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miSalonFete(t), haze: .18 },
      { z: 1, svg: miDad({ x: 150, y: 1500, s: 1.1, expr: 'love', armR: [-30, -60], holdR: miCamPh(fl(0)) }, t) + grandma({ x: 360, y: 1520, s: 1.0, expr: 'joy', armR: [-40, -70], holdR: miCamPh(fl(1)) }, t + 1) +
        miPetit({ x: CX + 40, y: 1420, s: 1.0, expr: 'ecstatic', armL: [-150, -120], armR: [-60, -100], holdR: G(tr(0, -60), miTooth(0, 0, 1.1)) }, t) +
        miSis({ x: 800, y: 1540, s: 1.3, expr: 'happy', flip: 1, armL: [-30, -60], holdL: miCamPh(fl(2)) }, t) + miMom({ x: 990, y: 1500, s: 1.1, expr: 'love', flip: 1, armL: [-30, -60], holdL: miCamPh(fl(3)) }, t) },
      { z: .6, svg: G(tr(1010, 1260 - 60 * Math.abs(Math.sin(t * 9)), 1, 12), circ(0, 120, 40, SKIN, 6) + miSheet(.42, 0)) }]) +
      kword('TOUT LE MONDE', CX, 430, t, To - .05, { size: 92, fill: SX.acc2 }) + kthin('prend des photos', CX, 570, t, Pr - .1, { size: 56 }); },
  sfx: [[0, 'flash_hit', .4], [at(5, 'tout') - .05, 'boom', .5], [at(5, 'prend'), 'shutter', .6], [at(5, 'prend') + .22, 'shutter', .5], [at(5, 'photos'), 'shutter', .6]] });

// B006a — « Et toi ? » : whip vers toi, tout seul dans le coin, sous un petit spot
const O6 = at(6, 'tu') - .15;
B(6, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const Et = at(6, 'et');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miSalonFete(t), haze: .45 }]) + op(.5, rect(-M, -M, W + 2 * M, H + 2 * M, '#1d1a2a', 0, 0)) + op(.35, path('M470 0L180 1500L900 1500L610 0Z', '#fff6c8', 0)) +
      heroP({ x: CX, y: 1500, s: 1.35, expr: 'neutral', look: [0, 0], armR: [80, 90], holdR: miSheet(.34, 10) }, t) + kword('ET TOI ?', CX, 520, t, Et - .05, { size: 130, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .5], [at(6, 'et') - .05, 'boom', .4], [at(6, 'toi'), 'ding', .4]] });
// B006b — « TU VIENS D'AVOIR 18 SUR 20 EN MATHS. » : rayons, toi brandis la copie, 18/20 slam
B(6, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(6, '18') - O6 && t < at(6, '18') - O6 + .4 ? 7 : 2 }),
  draw: (t, d, T) => { const V = at(6, 'viens') - O6, D18 = at(6, '18') - O6, Ma = at(6, 'maths') - O6;
    return rays(t, CX, 950, '#7fc08e', '#4f8f5e', 22) + burst(300, 1050, 280, t, D18, SX.acc2, 16) +
      cutout(heroP({ x: 300, y: 1500, s: 1.3, expr: t > D18 ? 'ecstatic' : 'happy', armL: [-150, -120], armR: [-30, -60] }, t), 12) +
      card(760, 930, 340, 420, miExam('18/20', seg(t, D18, D18 + .15)), t, V, { ry: 0, thick: 10, r: 5, bw: 6 }) +
      kthin("tu viens d'avoir", CX, 410, t, V - .1, { size: 58 }) + kword('18/20', CX, 560, t, D18 - .05, { size: 150, fill: '#fff' }) +
      funTag(300, 760, 'EN MATHS !', t, Ma - .05, { size: 44, bg: SX.acc, r: -6 }) + popStars(760, 930, t, D18, 8, 300) + miFlash(t, D18, .5); },
  sfx: [[0, 'flash_hit', .5], [at(6, 'viens') - O6, 'pop_hi', .4], [at(6, '18') - O6 - .05, 'boom', .7], [at(6, '18') - O6, 'jackpot', .4], [at(6, 'maths') - O6, 'pop', .5]] }, O6);

// B007 — « C'est bien, mon chéri. » : maman filme le petit, tapote ta tête sans te regarder
B(7, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Bi = at(7, 'bien'), pat = Math.abs(Math.sin(t * 14)) * 10;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miSalonFete(t), haze: .15 },
      { z: 1, svg: heroP({ x: 300, y: 1520, s: 1.22, expr: t > Bi + .3 ? 'deadpan' : 'happy', armR: [-40, -70], holdR: miSheet(.4, -6), headTilt: pat * .3 }, t) +
        miMom({ x: 640, y: 1480, s: 1.15, expr: 'love', look: [1, 0], armL: [212 + pat, 232 + pat], armR: [-30, -50], holdR: miCamPh((t * 2.5) % 1 < .12) }, t) +
        miPetit({ x: 930, y: 1420, s: .95, expr: 'ecstatic', flip: 1, armL: [-150, -120] }, t) }]) +
      chatBubble(640, 780, 560, 120, "c'est bien, mon chéri.", t, Bi - .25, false, 44) + (t > Bi + .3 ? markerText('…sans regarder', 250, 830, t, Bi + .3, { size: 40 }) : ''); },
  sfx: [[at(7, 'bien') - .25, 'pop', .5], [at(7, 'bien'), 'tick', .4], [at(7, 'bien') + .15, 'tick', .4], [at(7, 'cheri'), 'crickets', .3]] });

// B008a — « MERCI POUR CETTE CÉRÉMONIE » : toi sur ta boîte à chaussures « 18/20 », couronne en papier, tu t'acclames tout seul
const O8 = at(8, 'absolument') - .15;
B(8, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3, shake: t < .3 ? 5 : 0 }),
  draw: (t, d, T) => { const Me = at(8, 'merci'), Ce = at(8, 'cette'), sw = Math.sin(t * 9) * 14;
    const crowd = miMom({ x: 680, y: 1250, s: .62, expr: 'love', flip: 1 }, t) + miDad({ x: 900, y: 1250, s: .62, expr: 'love', flip: 1 }, t + 1) + miPetit({ x: 790, y: 1230, s: .5, expr: 'ecstatic' }, t) + miSis({ x: 1030, y: 1260, s: .7, expr: 'happy', flip: 1 }, t);
    const box = G(tr(330, 1470), rect(-150, -120, 300, 120, '#d9a86c', 6, 6) + path('M-150 -120L-120 -150L150 -150L150 -120Z', '#c8955a', 5) + ftext(0, -42, '18/20', { size: 50, fill: '#2f9a4a', stroke: 'none' }));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miSalonFete(t) + crowd, haze: .3 }, { z: 1, svg: box + heroP({ x: 330, y: 1350, s: 1.15, expr: 'smugger', armL: [-150 + sw, -120], armR: [-30 - sw, -60] }, t) + miCrown(330, 1350 - 1.15 * 395, .7, -6) }]) +
      (t > Ce ? G(tr(330 + Math.sin(t * 3) * 60, 700 + (t - Ce) * 260, 1, t * 200), rect(-14, -8, 28, 16, '#ff8fb1', 3, 3)) : '') +
      kword('MERCI', CX, 430, t, Me - .05, { size: 130, fill: '#fff' }) + kthin('pour cette cérémonie', CX, 580, t, Ce - .1, { size: 56 }); },
  sfx: [[0, 'flash_hit', .4], [at(8, 'merci') - .05, 'boom', .6], [at(8, 'pour'), 'pop_hi', .3], [at(8, 'cette'), 'whistle', .3], [at(8, 'ceremonie'), 'pop', .4]] });
// B008b — « ABSOLUMENT INCROYABLE. » : gros plan blasé, la langue de belle-mère retombe, un ballon se dégonfle
B(8, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const Ab = at(8, 'absolument') - O8, In = at(8, 'incroyable') - O8, hk = 1 - seg(t, In, In + .5);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miSalonFete(t), haze: .38 }, { z: 1, svg: heroHead(CX - 40, 990, 220, { expr: 'deadpan' }, t) + miHorn(CX + 40, 1110, 1.3, hk, -6) + miCrown(CX - 40, 990 - 250, 1.3, -8) }]) +
      G(tr(900, 820 + (t - Ab) * 120, 1 - .4 * seg(t, In, d), wave(t, 2, 14)), path('M0 -70Q60 -70 60 0Q60 60 0 70Q-60 60 -60 0Q-60 -70 0 -70Z', '#ff5c8a', 6) + line(0, 70, 0, 200, 3)) +
      kthin('absolument', CX, 420, t, Ab - .05, { size: 62 }) + kword('INCROYABLE.', CX, 560, t, In - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[at(8, 'absolument') - O8, 'pop_hi', .4], [at(8, 'incroyable') - O8 - .05, 'boom', .4], [at(8, 'incroyable') - O8 + .1, 'squeak', .5], [at(8, 'incroyable') - O8 + .4, 'crickets', .5]] }, O8);

// B009 — « Bienvenue dans la vie de l'enfant du milieu. » : le portrait de famille… toi, au milieu, tout flou
B(9, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Bv = at(9, 'bienvenue'), En = at(9, 'enfant'), Mi = at(9, 'milieu');
    const pic = grad('#bfe6ff', '#e6f6ff', -320, -230, 640, 460) + rect(-320, 130, 640, 100, '#8fd16a', 0, 0) + miSisHead(-200, 20, 105, { expr: 'happy' }, t) + miPetitHead(200, 60, 80, { expr: 'ecstatic' }, t) +
      blur(9, heroHead(0, 40, 90, { expr: 'happy' }, t)) + G(tr(300, -200, 1, 20), ell(0, 0, 90, 60, SKIN, 6));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: salonF(t), haze: .3 }]) +
      card(CX, 900, 700, 520, rect(-350, -260, 700, 520, '#c38a52', 10, 0) + clipR(-320, -230, 640, 460, pic, 6) + rect(-320, -230, 640, 460, 'none', 6, 5), t, Bv - .1, { ry: 0, thick: 12, r: -3, bw: 6 }) +
      (t > Mi ? markerCircle(CX, 940, 120, 120, t, Mi, { col: '#e2463a' }) + markerText('flou', 820, 1120, t, Mi + .15, { size: 50 }) : '') +
      kthin('bienvenue dans la vie de', CX, 410, t, Bv - .1, { size: 54 }) + kword("L'ENFANT DU MILIEU", CX, 540, t, En - .05, { size: 72, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(9, 'bienvenue'), 'magic', .5], [at(9, 'enfant') - .05, 'boom', .4], [at(9, 'milieu'), 'scratch', .5], [at(9, 'milieu') + .15, 'pop_hi', .4]] });

// B010 — « Ton grand frère est le premier. » : stade, podium : le frère sur la marche 1, le petit sur la 3… et pas de marche 2 (débloqué 2/3)
B(10, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Gf = at(10, 'grand'), Pr = at(10, 'premier');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: miStade(t), haze: .08 },
      { z: 1, svg: unlock(CX, 800, t, Pr, { part: 'back', r: 460 }) + miPodium(CX, 1340) +
        miBro({ x: CX, y: 1140, s: 1.0, expr: t > Pr ? 'ecstatic' : 'proud', armL: [-150, -120], armR: [-30, -60] }, t) + miCrown(CX, 1140 - 402 - 100, .9, 4) + miRosette(CX, 1140 - 250, .5, '1') +
        miPetit({ x: CX + 260, y: 1230, s: .8, expr: 'happy', armL: [-150, -120] }, t) +
        heroP({ x: 190, y: 1500, s: 1.2, expr: t > Pr ? 'deadpan' : 'neutral', look: [1, -1] }, t) },
      { z: .6, svg: blur(10, dBush(1040, 1960, 1.6)) }]) + popStars(CX, 1180, t, Pr, 8, 300) + confetti(t, Pr, 30) +
      kthin('ton grand frère est', CX, 410, t, Gf - .2, { size: 56 }) + kword('LE PREMIER', CX, 540, t, Pr - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(10, 'grand'), 'pop_hi', .4], [at(10, 'premier') - .05, 'boom', .5], [at(10, 'premier'), 'tada', .5], [at(10, 'premier') + .1, 'sparkle', .4]] });

// B011 — « Le premier à marcher. » : (flash-back) le frère bébé fait ses premiers pas, papa filme, maman bras ouverts, empreintes dorées
B(11, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ma = at(11, 'marcher'), x = lerp(330, 560, clamp(t / d)), st = Math.sin(t * 14) * 22;
    const steps = [0, 1, 2, 3].map(i => { const fx = 300 + i * 70; return fx < x - 40 ? ell(fx, 1440 + (i % 2) * 24, 22, 12, '#ffd23f', 4) : ''; }).join('');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: salonF(t) + op(.18, rect(-M, -M, W + 2 * M, H + 2 * M, '#ffd9a0', 0, 0)), haze: .1 },
      { z: 1, svg: steps + miMom({ x: 150, y: 1490, s: 1.08, expr: 'joy', armL: [200, 180], armR: [-10, 10] }, t) +
        person({ age: 'kid', x, y: 1400, s: .82, hair: 'tuft', hairColor: '#1f1a18', shirt: '#5b8fd8', pants: '#fff', skin: SK[0], expr: 'happy', armL: [200, 220], armR: [-20, -40], legL: [95 + st, 90], legR: [85 - st, 90], seed: 7 }, t) +
        miDad({ x: 900, y: 1490, s: 1.1, expr: 'love', flip: 1, armL: [-10, -20], holdL: G(tr(0, -30), rect(-60, -50, 120, 90, '#3a3f4a', 12, 5) + circ(-70, 0, 30, '#5b8fd8', 5) + circ(30, -66, 14, '#e2463a', 0)) }, t) }]) +
      funTag(820, 740, '1ERS PAS', t, .1, { size: 42, bg: SX.acc, r: 6 }) + kthin('le premier à', CX, 420, t, 0, { size: 60 }) + kword('MARCHER', CX, 560, t, Ma - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[.1, 'pop_hi', .4], [at(11, 'premier'), 'tiptoe', .5], [at(11, 'marcher') - .05, 'boom', .4], [at(11, 'marcher') + .1, 'baby_coo', .5]] });

// B012 — « Le premier à réussir ses examens. » : cour du lycée, le frère lance son chapeau, tampon ADMIS
B(12, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Re = at(12, 'reussir'), Ex = at(12, 'examens'), k = seg(t, Re, Re + .9), cy = 1078 - 102 - 330 * Math.sin(k * Math.PI);
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: schoolyard(t), haze: .1 },
      { z: 1, svg: miMom({ x: 160, y: 1500, s: 1.05, expr: 'joy', armL: [-150, -120], armR: [-30, -60] }, t) + miDad({ x: 920, y: 1500, s: 1.05, expr: 'sob', flip: 1, armL: [-150, -120] }, t) +
        miBro({ x: CX, y: 1480, s: 1.0, expr: 'ecstatic', armL: [-140, -110], armR: [-40, -70], holdR: miDiploma(0, -30, .38, 8, 'BAC') }, t) + miCap(CX + 30 * k, cy, 1, k * 540) },
      { z: .6, svg: blur(10, dBush(60, 1960, 1.6)) }]) + confetti(t, Ex, 28) + stamp(840, 960, 'ADMIS', t, Ex + .1, '#2f9a4a', -12, 70) +
      kthin('le premier à réussir', CX, 420, t, 0, { size: 56 }) + kword('SES EXAMENS', CX, 560, t, Ex - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(12, 'reussir'), 'whoosh_up', .5], [at(12, 'examens') - .05, 'boom', .4], [at(12, 'examens') + .1, 'thud', .6], [at(12, 'examens') + .15, 'tada', .4]] });

// B013 — « Le premier à quitter la maison. » : devant la maison, valises, maman en fontaine de larmes
B(13, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Qu = at(13, 'quitter'), Ma = at(13, 'maison'), bx = 760 + Math.max(0, t - Qu) * 120, st = t > Qu ? Math.sin(t * 12) * 20 : 0;
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.5, svg: miHouse(t), haze: .1 },
      { z: 1, svg: miMom({ x: 190, y: 1480, s: 1.1, expr: 'sob', armL: [-140, -110] }, t) + miDad({ x: 400, y: 1480, s: 1.1, expr: 'cry', armL: [-150, -130], armR: [70, 80] }, t + 1) +
        miBro({ x: bx, y: 1480, s: 1.0, expr: 'happy', flip: 1, armL: [-150, -130], armR: [80, 90], holdR: miCase(0, 80, .7, '#e2463a'), legL: [95 + st, 90], legR: [85 - st, 90] }, t) + miCase(bx + 170, 1490, .8, '#5ec4f0', -4) },
      { z: .6, svg: blur(10, dLampPost(1060, 2000, 1.6)) }]) +
      kthin('le premier à quitter', CX, 420, t, 0, { size: 56 }) + kword('LA MAISON', CX, 560, t, Ma - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(13, 'quitter'), 'steps', .4], [at(13, 'maison') - .05, 'boom', .4], [at(13, 'maison') + .1, 'gasp', .4]] });

// B014 — « Ton petit frère, lui, est le bébé. » : le petit sur un coussin-trône, couronne, toute la famille en cœur
B(14, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Lu = at(14, 'lui'), Bb = at(14, 'db');
    const throne = G(tr(CX, 1400), ell(0, 20, 220, 60, '#c8323a', 7) + ell(0, 0, 200, 50, '#e2463a', 6) + [-170, 170].map(x => circ(x, 34, 14, '#ffd23f', 4)).join(''));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: salonF(t), haze: .12 },
      { z: 1, svg: miMom({ x: 150, y: 1500, s: 1.08, expr: 'love', look: [1, 0] }, t) + miSis({ x: 340, y: 1530, s: 1.3, expr: 'love' }, t) + throne +
        miPetit({ x: CX, y: 1390, s: 1.0, expr: 'smugger', armR: [-50, -90], holdR: G(tr(0, -40), line(0, 0, 0, 80, 8, '#ffd23f') + circ(0, -10, 26, '#ff8fb1', 5)) }, t) + miCrown(CX, 1390 - 395, .8, -6) +
        miDad({ x: 760, y: 1500, s: 1.08, expr: 'love', flip: 1 }, t) + heroP({ x: 960, y: 1520, s: 1.15, expr: 'deadpan', flip: 1 }, t) + heartsUp(t, 400, 1000, 6) },
      { z: .6, svg: blur(10, dTeddy(80, 2000, 2.2)) }]) +
      kthin('ton petit frère, lui, est', CX, 420, t, 0, { size: 54 }) + kword('LE BÉBÉ', CX, 570, t, Bb - .05, { size: 130, fill: '#ff8fb1' }); },
  sfx: [[0, 'whoosh', .4], [at(14, 'lui'), 'pop_hi', .4], [at(14, 'db') - .05, 'boom', .4], [at(14, 'db'), 'baby_coo', .6], [at(14, 'db') + .1, 'kiss', .4]] });

// B015 — « Il éternue ? » : gros plan, ATCHOUM, gerbe de gouttes
B(15, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(15, 'ternu') ? 6 : 0 }),
  draw: (t, d, T) => { const Te = at(15, 'ternu'), sn = t > Te;
    let drops = ''; if (sn) for (let i = 0; i < 12; i++) { const k = seg(t, Te, Te + .4), a = R(-40 + i * 7); drops += circ(CX + 60 + Math.cos(a) * 520 * k, 1060 + Math.sin(a) * 300 * k + i * 6, 12 + (i % 3) * 5, '#bfe8ff', 4); }
    return depth({ zoom: 1 }, [{ z: 1.4, svg: salonF(t), haze: .35 }, { z: 1, svg: miPetitHead(CX - 40, 1000, 210, { expr: sn ? 'pain' : 'neutral', face: sn ? { eyes: 'closed', mouth: 'scream' } : { eyes: 'squint', mouth: 'o' }, tilt: sn ? 12 : -8 }, t) }]) +
      drops + kthin('il éternue ?', CX, 420, t, 0, { size: 66 }) + (sn ? burst(780, 700, 200, t, Te, '#fff', 14) + kword('ATCHOUM !', 760, 700, t, Te, { size: 72, fill: '#fff' }) : ''); },
  sfx: [[0, 'hmm', .3], [at(15, 'ternu'), 'spray', .6], [at(15, 'ternu') + .02, 'boom', .4], [at(15, 'ternu') + .1, 'pop_hi', .4]] });

// B016 — « Toute la famille arrive. » : couloir, tout le monde déboule (thermomètre, trousse de secours, couverture), gyrophare
B(16, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .5 }),
  draw: (t, d, T) => { const To = at(16, 'toute'), Ar = at(16, 'arrive'), k = eOutCubic(seg(t, 0, .5)), st = Math.sin(t * 16) * 26, lg = [[95 + st, 90], [85 - st, 90]];
    const kit = G(tr(0, -30), rect(-60, -46, 120, 92, '#fff', 12, 5) + rect(-12, -34, 24, 68, '#e2463a', 0, 0) + rect(-34, -12, 68, 24, '#e2463a', 0, 0));
    const thermo = G(tr(0, -50, 1, -20), rect(-10, -70, 20, 110, '#fff', 10, 5) + circ(0, 46, 18, '#e2463a', 5) + rect(-4, -40, 8, 80, '#e2463a', 2, 0));
    const ppl = miMom({ x: lerp(1500, 220, k), y: 1490, s: 1.08, expr: 'terror', armR: [-40, -70], holdR: thermo, legL: lg[0], legR: lg[1] }, t) +
      miDad({ x: lerp(1700, 470, k), y: 1490, s: 1.08, expr: 'panic', armR: [-20, -10], holdR: kit, legL: lg[1], legR: lg[0] }, t + 1) +
      grandma({ x: lerp(1900, 720, k), y: 1500, s: 1.0, expr: 'scared', armR: [-30, -50], holdR: G(tr(0, -20), rect(-70, -50, 140, 100, '#ff8fb1', 14, 5) + path('M-70 -10L70 -10M-70 20L70 20', 'none', 4, '#fff')) }, t + 2) +
      miSis({ x: lerp(2100, 940, k), y: 1530, s: 1.25, expr: 'panic', armR: [-40, -80], holdR: phone(0, -40, .35) }, t);
    return hallway(t) + WASH() + op(.25 * (Math.sin(t * 20) > 0 ? 1 : 0), rect(-M, -M, W + 2 * M, H + 2 * M, '#ff3b30', 0, 0)) + speedLines(t, CX, 1000, 26, 'rgba(255,255,255,.5)') + ppl +
      kword('TOUTE LA FAMILLE', CX, 440, t, To - .05, { size: 76, fill: '#fff' }) + funTag(CX, 600, 'ARRIVE !', t, Ar - .05, { size: 54, bg: '#e2463a', r: -4 }); },
  sfx: [[0, 'siren', .5], [at(16, 'toute') - .05, 'boom', .5], [at(16, 'famille'), 'steps', .6], [at(16, 'arrive'), 'pop', .5]] });

// B017 — « Toi, tu tombes dans les escaliers ? » : tu dévales l'escalier en tonneau, étoiles à chaque marche
B(17, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3, shake: t > at(17, 'tombes') ? 5 : 0 }),
  draw: (t, d, T) => { const Tb = at(17, 'tombes'), Es = at(17, 'escaliers'), p = eInOut(seg(t, Tb - .2, Es + .45)), x = lerp(170, 740, p), bounce = Math.abs(Math.sin(p * Math.PI * 4)) * 60;
    const y = (x >= 560 ? 1220 : 600 + Math.floor((x + 140) / 100) * 100) - 150 - bounce;
    const hero = G(tr(x, y, 1, p * 900), heroP({ x: 0, y: 150, s: .8, expr: p > 0 ? 'terror' : 'neutral', armL: [-150 + bounce, -120], armR: [-30, -60 - bounce], legL: [60, 30], legR: [120, 150] }, t));
    return miStairs(t) + (t < Tb - .2 ? heroP({ x: 170, y: 900, s: .8, expr: 'happy', look: [1, 0] }, t) : hero) +
      [0, 1, 2, 3].map(i => { const tp = Tb + .15 + i * .2; return t > tp && t < tp + .25 ? impactStar(lerp(260, 640, i / 3), lerp(900, 1220, i / 3), .8) : ''; }).join('') +
      kthin('toi, tu tombes dans', CX, 420, t, 0, { size: 56 }) + kword('LES ESCALIERS ?', CX, 560, t, Es - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[at(17, 'tombes') - .1, 'whoosh', .5], [at(17, 'tombes') + .15, 'thud', .6], [at(17, 'tombes') + .35, 'thud', .6], [at(17, 'escaliers'), 'thud', .7], [at(17, 'escaliers') + .3, 'crack', .5]] });

// B018 — « Fais attention au petit ! » : en bas, tu vois des étoiles ; maman protège le petit (sous cloche) et TE gronde
B(18, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Fa = at(18, 'fais'), Pe = at(18, 'petit');
    let stars = ''; for (let i = 0; i < 4; i++) { const a = t * 6 + i * 1.57; stars += sparkle(300 + Math.cos(a) * 110, 930 + Math.sin(a) * 30, .55, '#ffd23f'); }
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miStairs(t), haze: .2 },
      { z: 1, svg: heroP({ x: 300, y: 1520, s: 1.2, expr: 'dizzy', rot: Math.sin(t * 4) * 6, armL: [130, 110] }, t) + miBump(330, 1520 - 1.2 * 392 + 10, 1.1) + miPlaster(250, 1520 - 1.2 * 292 + 40, .8, -20) + stars +
        miMom({ x: 680, y: 1490, s: 1.12, expr: 'angry', armL: [185, 180], armR: [100, 120] }, t) +
        miPetit({ x: 930, y: 1400, s: .85, expr: 'happy', flip: 1 }, t) + miDome(930, 1410, 300, 420) },
      { z: .6, svg: blur(10, dPot(1060, 2000, 1.6, t, 1)) }]) +
      chatBubble(650, 760, 640, 120, 'fais attention au petit !', t, Fa - .1, false, 44) + (t > Pe ? funTag(930, 900, 'FRAGILE', t, Pe, { size: 34, bg: '#e2463a', r: 6 }) : ''); },
  sfx: [[0, 'chirp', .3], [at(18, 'fais') - .1, 'pop', .5], [at(18, 'attention'), 'buzz', .3], [at(18, 'petit'), 'ding', .4]] });

// B019 — « MAIS C'EST MOI QUI VIENS DE TOMBER ! » : gros plan furieux, bosse qui gonfle, pansement
B(19, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 4 + (t > at(19, 'tomber') ? 5 : 0) }),
  draw: (t, d, T) => { const Ma = at(19, 'mais'), Qu = at(19, 'qui'), To = at(19, 'tomber'), bk = 1 + .6 * eOutBack(seg(t, To, To + .3));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miStairs(t), haze: .4 }]) + burst(CX, 1000, 330, t, To, '#ff6b6b', 16) +
      heroHead(CX, 1000, 230, { expr: 'rage', tilt: Math.sin(t * 22) * 3 }, t) + miBump(CX + 70, 1000 - 220, 1.4 * bk) + miPlaster(CX - 120, 1060, 1.3, -24) +
      kword("MAIS C'EST MOI", CX, 430, t, Ma - .05, { size: 92, fill: '#fff' }) + kthin('qui viens de tomber !', CX, 580, t, Qu - .1, { size: 58 }) + miFlash(t, To, .4); },
  sfx: [[0, 'flash_hit', .5], [at(19, 'mais') - .05, 'boom', .6], [at(19, 'moi'), 'growl', .4], [at(19, 'tomber'), 'boing', .6], [at(19, 'tomber') + .1, 'thud', .5]] });

// B020 — « À Noël, ton aîné reçoit un ordinateur. » : salon de Noël, le frère ouvre un ordi qui brille
B(20, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const No = at(20, 'noel'), Ai = at(20, 'aine'), Or = at(20, 'ordinateur'), k = seg(t, Or - .2, Or + .2);
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.4, svg: miNoel(t), haze: .08 },
      { z: 1, svg: miBro({ x: 560, y: 1490, s: 1.0, expr: t > Or ? 'ecstatic' : 'happy', armL: [-160, -140], armR: [-30, -60] }, t) + miLaptop(800, 1210, .6, k) +
        heroP({ x: 980, y: 1520, s: 1.1, expr: 'neutral', flip: 1, look: [-1, 0] }, t) },
      { z: .6, svg: blur(10, dGift(1040, 1960, 2, '#e2463a', '#ffd23f')) }]) + (t > Or ? popStars(800, 1080, t, Or, 8, 260) : '') +
      funTag(CX, 410, 'À NOËL', t, No - .05, { size: 56, bg: '#e2463a', r: -4 }) + kthin('ton aîné reçoit', CX, 520, t, Ai - .2, { size: 50 }) + kword('UN ORDINATEUR', CX, 620, t, Or - .05, { size: 86, fill: SX.acc2 }); },
  sfx: [[at(20, 'noel') - .05, 'ring', .4], [at(20, 'noel'), 'magic', .4], [at(20, 'recoit'), 'pop', .5], [at(20, 'ordinateur') - .05, 'boom', .4], [at(20, 'ordinateur'), 'jackpot', .4]] });

// B021 — « Le petit reçoit une console. » : le petit saute de joie, console qui brille
B(21, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Re = at(21, 'recoit'), Co = at(21, 'console'), jump = t > Co ? Math.abs(Math.sin((t - Co) * 10)) * 50 : 0;
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.4, svg: miNoel(t), haze: .1 },
      { z: 1, svg: miBro({ x: 180, y: 1490, s: .95, expr: 'happy', look: [0, 1], armL: [60, 20], armR: [120, 160] }, t) + miLaptop(190, 1420, .35, 1) +
        miPetit({ x: CX + 40, y: 1410 - jump, s: 1.0, expr: t > Co ? 'ecstatic' : 'happy', armL: [-150, -120], armR: [-30, -60] }, t) + (t > Co - .1 ? miConsole(CX + 40, 900 - jump, .7 * pop(t, Co - .1, .3), -6, t) : '') +
        heroP({ x: 960, y: 1520, s: 1.1, expr: 'neutral', flip: 1, look: [-1, 0] }, t) }]) +
      kthin('le petit reçoit', CX, 420, t, Re - .3, { size: 58 }) + kword('UNE CONSOLE', CX, 560, t, Co - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(21, 'recoit'), 'pop', .5], [at(21, 'console') - .05, 'boom', .4], [at(21, 'console'), 'tada', .5], [at(21, 'console') + .2, 'boing', .4]] });

// B022 — « Toi, un pull. » : toi dans un pull de Noël (renne, flocons), blasé ; ba-dum-tss
B(22, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.06, 1.12, t / d), shake: t < .25 ? 5 : 0 }),
  draw: (t, d, T) => { const Pu = at(22, 'pull');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miNoel(t), haze: .3 }, { z: 1, svg: heroP({ x: CX, y: 1500, s: 1.35, pull: 1, expr: 'deadpan', armL: [100, 95], armR: [80, 85] }, t) +
      path('M200 1500Q260 1420 330 1480L300 1560Z', '#e2463a', 5) + path('M760 1520Q820 1450 900 1500L860 1580Z', '#ffd23f', 5) }]) +
      kthin('toi,', CX, 420, t, 0, { size: 64 }) + kword('UN PULL.', CX, 560, t, Pu - .05, { size: 140, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .4], [at(22, 'toi'), 'pop_hi', .4], [at(22, 'pull') - .05, 'thud', .5], [at(22, 'pull') + .1, 'rimshot', .6]] });

// B023 — « On savait pas trop ce que tu voulais. » : les parents haussent les épaules derrière le canapé, points d'interrogation
B(23, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Sa = at(23, 'savait'), Vo = at(23, 'voulais'), sh = Math.sin(t * 6) * 8;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miNoel(t), haze: .1 },
      { z: 1, svg: miMom({ x: 560, y: 1450, s: 1.05, expr: 'confused', armL: [160 + sh, 230], armR: [20 - sh, -50] }, t) + miDad({ x: 820, y: 1450, s: 1.05, expr: 'confused', armL: [160 - sh, 230], armR: [20 + sh, -50] }, t + 1) +
        sofa(700, 1520, .95, '#5ec4a0') + qmark(620, 870, .6 * pop(t, Vo, .3), '#fff', -10) + qmark(880, 850, .6 * pop(t, Vo + .1, .3), '#fff', 10) +
        heroP({ x: 220, y: 1520, s: 1.2, pull: 1, expr: 'annoyed', look: [1, 0] }, t) }]) +
      chatBubble(690, 720, 640, 120, 'on savait pas trop…', t, Sa - .2, false, 44) + kthin('ce que tu voulais', CX, 420, t, Vo - .4, { size: 58 }); },
  sfx: [[at(23, 'savait') - .2, 'pop', .5], [at(23, 'trop'), 'hmm', .4], [at(23, 'voulais'), 'pop_hi', .4], [at(23, 'voulais') + .1, 'pop_hi', .4]] });

// B024 — « BAH DEMANDEZ-MOI, NON ? » : rayons rouges, toi en pull qui hurles
B(24, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 6 }),
  draw: (t, d, T) => { const Ba = at(24, 'bah'), De = at(24, 'demandez'), No = at(24, 'non');
    return rays(t, CX, 950, '#ff6b6b', '#c92f3a', 22) + burst(CX, 1050, 320, t, De, SX.acc2, 16) +
      cutout(heroP({ x: CX, y: 1500, s: 1.35, pull: 1, expr: 'rage', face: { mouth: 'scream' }, armL: [-160, -130], armR: [-20, -50] }, t), 12) +
      kthin('bah,', CX, 400, t, Ba - .05, { size: 64 }) + kword('DEMANDEZ-MOI', CX, 540, t, De - .05, { size: 100, fill: '#fff' }) + funTag(CX, 700, 'NON ?!', t, No - .05, { size: 60, bg: SX.acc2, fg: SX.ink, r: 5 }); },
  sfx: [[0, 'flash_hit', .5], [at(24, 'bah'), 'pop_hi', .4], [at(24, 'demandez') - .05, 'boom', .7], [at(24, 'demandez'), 'growl', .4], [at(24, 'non'), 'pop', .5]] });

// B025 — « Et quand il faut partager une chambre… » : la fratrie débarque avec cartons, oreiller, nounours
B(25, { enter: 'none', trans: 'circle', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pa = at(25, 'partager'), Ch = at(25, 'chambre');
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.4, svg: miRoom(t), haze: .08 },
      { z: 1, svg: miBro({ x: 200, y: 1480, s: 1.0, expr: 'smugger', armL: [20, -20], armR: [160, 200], holdR: dBox(-30, 60, .7, 'MOI') }, t) +
        heroP({ x: 560, y: 1520, s: 1.2, expr: 'worried', armL: [100, 90], armR: [50, 70], holdR: G(tr(40, 0, 1, 70), rect(-90, -50, 180, 100, '#fff', 40, 6)) }, t) +
        miPetit({ x: 870, y: 1420, s: .9, expr: 'happy', flip: 1, armL: [60, 20], holdL: dTeddy(0, 60, .8) }, t) }]) +
      kthin('et quand il faut partager', CX, 420, t, Pa - .5, { size: 54 }) + kword('UNE CHAMBRE', CX, 560, t, Ch - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(25, 'faut'), 'steps', .4], [at(25, 'partager'), 'pop', .4], [at(25, 'chambre') - .05, 'boom', .4]] });

// B026 — « Devine qui doit faire des concessions ? » : le scotch rouge partage la chambre : grand pour l'aîné, berceau pour le petit… une bande pour toi
B(26, { enter: 'none', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .2 }),
  draw: (t, d, T) => { const Dv = at(26, 'devine'), Co = at(26, 'concessions'), k1 = eOutCubic(seg(t, Dv, Dv + .4)), k2 = eOutCubic(seg(t, Dv + .3, Dv + .7));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miRoom(t), haze: .08 }]) +
      line(640, 1900, 640, lerp(1900, 640, k1), 16, '#e2463a') + line(780, 1900, 780, lerp(1900, 640, k2), 16, '#e2463a') +
      miBro({ x: 300, y: 1480, s: 1.0, expr: 'smugger', armL: [-150, -120], armR: [-30, -60] }, t) + miPetit({ x: 930, y: 1420, s: .9, expr: 'happy', flip: 1 }, t) +
      G(tr(710, 0), G('scale(.62 1)', heroP({ x: 0, y: 1510, s: 1.15, expr: 'worried' }, t))) +
      funTag(320, 760, "L'AÎNÉ", t, Dv + .2, { size: 38, bg: '#5b8fd8', r: -4 }) + funTag(930, 820, 'LE PETIT', t, Dv + .5, { size: 34, bg: '#ff8fb1', r: 5 }) + funTag(710, 900, 'TOI', t, Co, { size: 34, bg: SX.acc, r: -3 }) +
      kthin('devine qui doit faire', CX, 420, t, Dv - .1, { size: 56 }) + kword('DES CONCESSIONS ?', CX, 560, t, Co - .05, { size: 74, fill: SX.acc2 }); },
  sfx: [[at(26, 'devine'), 'scratch', .5], [at(26, 'devine') + .3, 'scratch', .4], [at(26, 'concessions') - .05, 'boom', .4], [at(26, 'concessions'), 'squeak', .5]] });

// B027a — « Pas l'aîné. » : le frère, casque sur les oreilles, devant SA porte
const O27 = at(27, 'il') - .15;
B(27, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pa = at(27, 'pas');
    const phones = G(tr(0, 0), path('M-100 -10Q-100 -120 0 -120Q100 -120 100 -10', 'none', 14) + rect(-118, -30, 36, 70, '#e2463a', 12, 5) + rect(82, -30, 36, 70, '#e2463a', 12, 5));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miRoom(t) + miDoor(CX, 1250, t, { sign: 'PRIVÉ', sign2: 'interdit aux petits' }), haze: .1 }]) +
      miBro({ x: CX, y: 1490, s: 1.05, expr: 'smugger', armL: [40, -150], armR: [140, -30] }, t) + G(tr(CX, 1490 - 1.05 * 402), phones) +
      funTag(CX, 450, "PAS L'AÎNÉ", t, Pa - .05, { size: 72, bg: '#5b8fd8', r: -4 }); },
  sfx: [[0, 'whoosh', .4], [at(27, 'pas') - .05, 'pop', .6], [at(27, 'aine'), 'buzz', .3], [at(27, 'aine') + .1, 'hmm', .3]] });
// B027b — « Il a besoin d'intimité. » : PORTE CLAQUÉE au nez, panneau « NE PAS DÉRANGER »
B(27, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d), shake: t > at(27, 'intimite') - O27 && t < at(27, 'intimite') - O27 + .3 ? 7 : 0 }),
  draw: (t, d, T) => { const Be = at(27, 'besoin') - O27, In = at(27, 'intimite') - O27;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miRoom(t), haze: .15 }]) + miDoor(CX, 1250, t, { sign: 'INTIMITÉ', sign2: 'ne pas déranger', open: t < In }) +
      (t < In ? miBro({ x: CX, y: 1490, s: 1.05, expr: 'annoyed', flip: 1 }, t) : '') + heroP({ x: 250, y: 1520, s: 1.2, expr: t > In ? 'shock' : 'neutral', look: [1, 0] }, t) +
      kthin("il a besoin d'", CX, 400, t, Be - .2, { size: 56 }) + kword('INTIMITÉ', CX, 540, t, In - .05, { size: 120, fill: SX.acc2 }) + (t > In && t < In + .3 ? impactStar(CX, 900, 1.2) : ''); },
  sfx: [[at(27, 'besoin') - O27, 'pop_hi', .4], [at(27, 'intimite') - O27 - .05, 'thud', .8], [at(27, 'intimite') - O27, 'boom', .4], [at(27, 'intimite') - O27 + .2, 'crickets', .3]] }, O27);

// B028 — « Pas le petit. » : le petit dans le grand lit, couronne, nounours
B(28, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d) }),
  draw: (t, d, T) => { const Pa = at(28, 'pas');
    const bed = G(tr(CX, 1300), rect(-340, -260, 40, 300, '#8a6ad8', 10, 6) + rect(300, -160, 40, 200, '#8a6ad8', 10, 6) + rect(-320, -100, 640, 110, '#b9a8ff', 18, 6) + path('M-320 -110Q0 -170 320 -110L320 -40L-320 -40Z', '#ff8fb1', 6));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miRoom(t), haze: .2 }]) + miPetitHead(CX - 60, 1080, 120, { expr: 'happy' }, t) + miCrown(CX - 60, 940, .8, -8) + bed + dTeddy(CX + 160, 1200, 1) +
      funTag(CX, 450, 'PAS LE PETIT', t, Pa - .05, { size: 72, bg: '#ff8fb1', r: 4 }); },
  sfx: [[at(28, 'pas') - .05, 'pop', .6], [at(28, 'petit'), 'baby_coo', .5], [at(28, 'petit') + .1, 'sparkle', .3]] });

// B029 — « Il est trop jeune. » : gros plan, tétine, yeux qui brillent
B(29, { enter: 'none', cam: (t, d) => ({ z: lerp(1.06, 1.1, t / d) }),
  draw: (t, d, T) => { const Tr = at(29, 'trop');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miRoom(t), haze: .35 }]) + miPetitHead(CX, 1000, 210, { expr: 'wow', face: { mouth: 'o-small' } }, t) + miPaci(CX, 1090, 1.6) + heartsUp(t, 260, 1050, 4) +
      kthin('il est', CX, 410, t, 0, { size: 60 }) + kword('TROP JEUNE', CX, 540, t, Tr - .05, { size: 110, fill: '#ff8fb1' }); },
  sfx: [[0, 'pop_hi', .3], [at(29, 'trop') - .05, 'boom', .4], [at(29, 'jeune'), 'squeak', .5]] });

// B030a — « TOI. » : rayons, trois doigts pointés sur toi, TOI. géant (débloqué 3/3)
const O30 = at(30, 'tu') - .15;
B(30, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 6 }),
  draw: (t, d, T) => { const To = at(30, 'toi');
    return rays(t, CX, 950, '#8fd0a0', '#4f8f5e', 22) + unlock(CX, 1000, t, To, { part: 'back', r: 460 }) +
      cutout(heroP({ x: CX, y: 1500, s: 1.3, expr: 'jawdrop' }, t), 12) + popStars(CX, 1250, t, To, 8, 380) +
      miPoint(330, 1080, 0, BRO.shirt, eOutCubic(seg(t, 0, .2))) + miPoint(750, 1080, 180, MOM.shirt, eOutCubic(seg(t, .04, .24))) + miPoint(740, 900, 135, DAD.shirt, eOutCubic(seg(t, .08, .28)), 500) +
      kword('TOI.', CX, 500, t, To - .05, { size: 220, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .5], [0, 'whoosh', .5], [at(30, 'toi') - .05, 'boom', .7], [at(30, 'toi'), 'sparkle', .5]] });
// B030b — « Tu es assez grand pour comprendre. » : la toise : coche « COMPRENDRE » à hauteur de ta tête
B(30, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .2 }),
  draw: (t, d, T) => { const As = at(30, 'assez') - O30, Co = at(30, 'comprendre') - O30, hy = 1490 - 1.3 * 395;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miRoom(t, { toise: 330 }), haze: .05 }]) +
      heroP({ x: 330, y: 1490, s: 1.3, expr: t > Co ? 'proud' : 'neutral' }, t) + line(240, hy, lerp(240, 470, eOutCubic(seg(t, As, As + .3))), hy, 10, '#2f9a4a') +
      (t > Co ? funTag(640, hy, 'COMPRENDRE ✓', t, Co, { size: 40, bg: '#2f9a4a', r: -3 }) : '') +
      kthin('tu es assez grand pour', CX, 420, t, As - .2, { size: 56 }) + kword('COMPRENDRE', CX, 560, t, Co - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[at(30, 'assez') - O30, 'scratch', .4], [at(30, 'grand') - O30, 'pop_hi', .3], [at(30, 'comprendre') - O30 - .05, 'boom', .4], [at(30, 'comprendre') - O30, 'ding', .5]] }, O30);

// B031 — « Mais jamais assez grand pour décider. » : la marque « DÉCIDER » est tout en haut… tu sautes, tu ne l'atteins jamais
B(31, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.0, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ja = at(31, 'jamais'), Dc = at(31, 'decider'), hy = 1490 - 1.3 * 395, jump = Math.abs(Math.sin(t * 7)) * 70;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miRoom(t, { toise: 330 }), haze: .05 }]) +
      line(240, hy, 470, hy, 10, '#2f9a4a') + line(240, 420, 470, 420, 10, '#e2463a') + funTag(640, 420, 'DÉCIDER', t, Ja, { size: 44, bg: '#e2463a', r: 3 }) +
      heroP({ x: 330, y: 1490 - jump, s: 1.3, expr: 'effort', armL: [-120, -100], armR: [-60, -80] }, t) + markerArrow(420, hy - 60, 420, 470, t, Ja + .2, { bend: 60 }) +
      kword('JAMAIS ASSEZ GRAND', CX, 640, t, Ja - .05, { size: 70, fill: SX.acc2 }) + kthin('pour décider', CX, 760, t, Dc - .15, { size: 56 }); },
  sfx: [[at(31, 'mais'), 'sting', .4], [at(31, 'jamais') - .05, 'boom', .4], [at(31, 'assez'), 'boing', .4], [at(31, 'grand'), 'boing', .4], [at(31, 'decider'), 'error_beep', .4]] });

// B032 — « Alors tu apprends à te débrouiller seul. » : cuisine vide, tu te fais ton sandwich-tour tout seul (ton plus doux)
B(32, { enter: 'none', trans: 'black', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ap = at(32, 'apprends'), Db = at(32, 'debrouiller'), Se = at(32, 'seul'), n = Math.min(5, Math.floor(seg(t, Ap, Se) * 6));
    let sw = ''; const cols = ['#e8b88a', '#7be07b', '#ff6b6b', '#ffd23f', '#e8b88a']; for (let i = 0; i < n; i++) sw += rect(-90, -i * 26, 180, 24, cols[i], 10, 5);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miKitchen(t), haze: .08 }]) +
      heroP({ x: 340, y: 1520, s: 1.22, expr: 'effort', armL: [110, 100], armR: [10, -10] }, t) + G(tr(640, 1200), rect(-110, 10, 220, 24, '#fff', 12, 5) + sw) +
      funTag(820, 820, 'SEUL', t, Se - .05, { size: 54, bg: SX.acc, r: 5 }) +
      kthin('alors tu apprends à te', CX, 420, t, Ap - .3, { size: 54 }) + kword('DÉBROUILLER', CX, 560, t, Db - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[at(32, 'apprends'), 'pop_hi', .3], [at(32, 'te'), 'tick', .3], [at(32, 'debrouiller') - .05, 'boom', .3], [at(32, 'debrouiller') + .2, 'tick', .3], [at(32, 'seul'), 'pop', .4]] });

// B033 — « À régler tes problèmes. » : dans la rue, vélo par terre, tu colles toi-même ton pansement
B(33, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Re = at(33, 'regler'), Pb = at(33, 'probleme'), k = eOutBack(seg(t, Re, Re + .3));
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: G(tr(780, 1440, 1, 18), dBike(0, 0, 1.2, '#36a85a')) + heroP({ x: 380, y: 1510, s: 1.22, expr: 'effort', armL: [70, 110], armR: [100, 130], legL: [95, 90], legR: [40, 100] }, t) +
        (k > 0 ? miPlaster(480, 1475, 1.1 * k, -14) : '') },
      { z: .6, svg: blur(10, dBush(80, 1960, 1.6)) }]) +
      kthin('à régler', CX, 420, t, 0, { size: 60 }) + kword('TES PROBLÈMES', CX, 560, t, Pb - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(33, 'regler'), 'snip', .5], [at(33, 'probleme') - .05, 'boom', .3], [at(33, 'probleme') + .1, 'pop', .4]] });

// B034 — « À ne pas trop demander. » : repas de famille, tu lèves la main… et tu la baisses
B(34, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .2 }),
  draw: (t, d, T) => { const Tr = at(34, 'trop'), De = at(34, 'demander'), hand = t < De ? eOutCubic(seg(t, .1, .4)) : 1 - eOutCubic(seg(t, De, De + .3));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: salonF(t, { noSofa: 1 }), haze: .08 },
      { z: 1, svg: miMom({ x: 160, y: 1390, s: .95, expr: 'talk', look: [1, 0] }, t) + miDad({ x: 350, y: 1390, s: .95, expr: 'laugh', look: [1, 0] }, t + 1) + miBro({ x: 560, y: 1390, s: .95, expr: 'talk', look: [-1, 0] }, t) +
        miPetit({ x: 750, y: 1300, s: .8, expr: 'ecstatic' }, t) + heroP({ x: 930, y: 1370, s: 1.05, expr: hand > .5 ? 'neutral' : 'sad', flip: 1, armL: [lerp(100, -100, hand), lerp(90, -95, hand)] }, t) + miTable(CX, 1450, .95, t) }]) +
      chatBubble(300, 760, 260, 90, 'bla bla', t, .05, false, 36) + chatBubble(560, 700, 220, 90, 'haha !', t, .25, false, 36) +
      kthin('à ne pas trop', CX, 420, t, Tr - .3, { size: 58 }) + kword('DEMANDER', CX, 560, t, De - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[.1, 'whoosh_up', .3], [at(34, 'trop'), 'pop_hi', .3], [at(34, 'demander') - .05, 'boom', .3], [at(34, 'demander') + .1, 'whoosh', .3]] });

// B035 — « Puis un jour, ta mère te dit : » : cuisine, lumière chaude, maman se tourne vers toi
B(35, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Jo = at(35, 'jour'), Me = at(35, 'mere'), Di = at(35, 'dit');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miKitchen(t), haze: .08 }]) + lightLeak(T, .25, '#ffb060') +
      heroP({ x: 330, y: 1520, s: 1.22, expr: 'neutral', look: [1, 0] }, t) + miMom({ x: 760, y: 1490, s: 1.12, expr: t > Di ? 'happy' : 'neutral', flip: 1, look: [-1, 0], face: t > Di ? { mouth: 'talk' } : {} }, t) +
      funTag(CX, 420, 'PUIS UN JOUR', t, Jo - .3, { size: 56, bg: SX.acc, r: -3 }) + kthin('ta mère te dit :', CX, 560, t, Me - .2, { size: 62 }); },
  sfx: [[at(35, 'jour') - .3, 'pop', .4], [at(35, 'mere'), 'pop_hi', .3], [at(35, 'dit'), 'ding', .3]] });

// B036a — « Heureusement qu'avec toi, » : câlin, cœurs
const O36 = at(36, 'on') - .15;
B(36, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const He = at(36, 'heureusement');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miKitchen(t), haze: .2 }]) + lightLeak(T, .3, '#ffb060') +
      heroP({ x: 430, y: 1520, s: 1.22, expr: 'happy' }, t) + miMom({ x: 680, y: 1490, s: 1.12, expr: 'calm', flip: 1, armR: [170, 190] }, t) + heartsUp(t, 560, 980, 5) +
      chatBubble(CX, 760, 680, 120, "heureusement qu'avec toi…", t, He - .1, false, 44); },
  sfx: [[at(36, 'heureusement') - .1, 'pop', .4], [at(36, 'heureusement') + .3, 'kiss', .4], [at(36, 'toi'), 'sparkle', .3]] });
// B036b — « …on n'a jamais eu de problème. » : maman colle une étoile dorée sur toi, tampon « ZÉRO PROBLÈME »
B(36, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ja = at(36, 'jamais') - O36, Pb = at(36, 'probleme') - O36, sk = eOutBack(seg(t, Ja, Ja + .3));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miKitchen(t), haze: .12 }]) + lightLeak(T, .25, '#ffb060') +
      heroP({ x: 400, y: 1520, s: 1.25, expr: 'happy' }, t) + (sk > 0 ? miGoldStar(400, 1520 - 1.25 * 150, .9 * sk, -8) : '') + miMom({ x: 760, y: 1490, s: 1.12, expr: 'proud', flip: 1, armR: [175, 185] }, t) +
      kthin("on n'a jamais eu de", CX, 420, t, 0, { size: 58 }) + kword('PROBLÈME', CX, 560, t, Pb - .05, { size: 110, fill: SX.acc2 }) + stamp(760, 820, 'ZÉRO', t, Pb + .1, '#2f9a4a', -10, 70); },
  sfx: [[at(36, 'jamais') - O36, 'pop', .5], [at(36, 'jamais') - O36 + .05, 'sparkle', .4], [at(36, 'probleme') - O36 - .05, 'boom', .3], [at(36, 'probleme') - O36 + .1, 'thud', .5]] }, O36);

// B037 — « Tu souris. » : gros plan, petit sourire, éclat
B(37, { enter: 'none', cam: (t, d) => ({ z: lerp(1.06, 1.1, t / d) }),
  draw: (t, d, T) => { const So = at(37, 'souris');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miKitchen(t), haze: .35 }, { z: 1, svg: heroHead(CX, 1000, 230, { expr: t > So ? 'happy' : 'neutral', face: t > So ? { blush: 1 } : {} }, t) + miGoldStar(CX + 260, 1180, .9, -8) }]) + lightLeak(T, .25, '#ffb060') +
      (t > So ? sparkle(650, 1080, .9 + .2 * Math.sin(t * 20), '#fff') : '') + kthin('tu souris.', CX, 440, t, 0, { size: 66 }); },
  sfx: [[at(37, 'souris'), 'glint', .6], [at(37, 'souris') + .05, 'sparkle', .4]] });

// B038 — « Parce qu'elle pense te faire un compliment. » : maman épingle une cocarde « ENFANT FACILE »
B(38, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pe = at(38, 'pense'), Co = at(38, 'compliment'), k = pop(t, Pe + .1, .35);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: miKitchen(t), haze: .1 }]) + lightLeak(T, .25, '#ffb060') +
      heroP({ x: 400, y: 1520, s: 1.25, expr: 'happy', face: { mouth: 'smile' } }, t) + (k > 0 ? miRosette(400, 1520 - 1.25 * 160, .8 * k, '', -6) : '') + miMom({ x: 760, y: 1490, s: 1.12, expr: 'happy', flip: 1, armR: [175, 185] }, t) +
      (t > Pe + .3 ? funTag(400, 880, 'ENFANT FACILE', t, Pe + .3, { size: 36, bg: '#ffd23f', fg: SX.ink, r: -5 }) : '') +
      kthin('elle pense te faire un', CX, 420, t, Pe - .2, { size: 56 }) + kword('COMPLIMENT', CX, 560, t, Co - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[at(38, 'pense'), 'pop_hi', .3], [at(38, 'pense') + .1, 'pop', .5], [at(38, 'compliment') - .05, 'tada', .4], [at(38, 'compliment') + .2, 'sparkle', .3]] });

// B039 — « SAUF QUE TU N'ÉTAIS PAS UN ENFANT SANS PROBLÈMES. » : la nuit, le placard explose : des cartons de « problèmes » rangés depuis des années
const miWardrobe = (x, yb, k) => G(tr(x, yb), rect(-200, -760, 400, 760, '#8a6ad8', 10, 7) + rect(-180, -740, 360, 720, '#3a2a5a', 6, 0) +
  G(`translate(-180 -740) scale(${f1(1 - .85 * k)} 1)`, rect(0, 0, 180, 720, '#a08ae0', 6, 6) + circ(160, 360, 10, '#ffd23f', 4)) + G(`translate(180 -740) scale(${f1(-(1 - .85 * k))} 1)`, rect(0, 0, 180, 720, '#a08ae0', 6, 6) + circ(160, 360, 10, '#ffd23f', 4)));
B(39, { enter: 'none', trans: 'black', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(39, 'sans') && t < at(39, 'sans') + .35 ? 6 : 0 }),
  draw: (t, d, T) => { const Sa = at(39, 'sauf'), Sn = at(39, 'sans'), k = eOutBack(seg(t, Sn - .1, Sn + .2)), fall = eOutCubic(seg(t, Sn, Sn + .5));
    const labels = [['18/20', -90, -120], ['ESCALIER', 90, -110], ['LE PULL', -80, -300], ['CHAMBRE', 100, -320], ['SEUL', 0, -500]];
    const boxes = labels.map(([s_, x, y], i) => G(tr(260 + x + (i % 2 ? 1 : -1) * 160 * fall, 1250 + y * (1 - .55 * fall), 1, (i % 2 ? 1 : -1) * 25 * fall), dBox(0, 0, .95, s_))).join('');
    return bedroomN(t) + WASH('rgba(20,30,80,.25)') + miWardrobe(260, 1250, k) + (k > .2 ? boxes : '') +
      heroP({ x: 700, y: 1520, s: 1.22, expr: t > Sn ? 'sad' : 'neutral', look: [-1, 0] }, t) + (t > Sn ? G(tr(700, 1520 - 1.22 * 160), miRosette(0, 0, .55, '', 30)) : '') +
      kthin("sauf que tu n'étais pas", CX, 410, t, Sa - .05, { size: 54 }) + kword('SANS PROBLÈMES', CX, 545, t, Sn - .05, { size: 90, fill: '#fff' }) + cross(CX, 545, .9, t, Sn + .4); },
  sfx: [[at(39, 'sauf'), 'sting', .4], [at(39, 'sans') - .1, 'crack', .6], [at(39, 'sans'), 'thud', .7], [at(39, 'sans') + .25, 'thud', .5], [at(39, 'probleme'), 'heartbeat', .5]] });

// B040a — « TU ÉTAIS JUSTE CELUI QUI AVAIT APPRIS » : tu refermes doucement le placard avec ton dos, sourire mouillé
const O40 = at(40, 'ne') - .25;
B(40, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .15 }),
  draw: (t, d, T) => { const Tu = at(40, 'tu'), Qu = at(40, 'qui'), k = 1 - eOutCubic(seg(t, .1, .7));
    return bedroomN(t) + WASH('rgba(20,30,80,.25)') + miWardrobe(260, 1250, k) + op(.35, glow(420, 1000, 380, '#ffd88a', .7)) +
      heroP({ x: 420, y: 1520, s: 1.25, expr: 'happy', face: { tears: 1, eyes: 'closed' }, armL: [140, 160], armR: [40, 20] }, t) +
      kword('TU ÉTAIS JUSTE CELUI', CX, 430, t, Tu - .05, { size: 66, fill: '#fff' }) + kthin('qui avait appris', CX, 570, t, Qu - .1, { size: 60 }); },
  sfx: [[at(40, 'tu') - .05, 'boom', .4], [.5, 'thud', .3], [at(40, 'qui'), 'heartbeat', .4], [at(40, 'appris'), 'chirp', .2]] });
// B040b — FIN : « À NE PAS EN PARLER. » : tu ranges ta bulle « … » dans ta poche ; le petit frère arrive avec son nounours et te serre fort
B(40, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, eInOut(clamp(t / d))), hand: .1 }),
  draw: (t, d, T) => { const Pa = at(40, 'parler') - O40, bub = 1 - eOutCubic(seg(t, Pa, Pa + .35)), px = lerp(1200, 690, eOutCubic(seg(t, Pa + .1, Pa + .7))), hug = t > Pa + .7;
    return bedroomN(t) + WASH('rgba(20,30,80,.2)') + op(.4, glow(560, 1000, 460, '#ffd88a', .7)) +
      heroP({ x: 460, y: 1520, s: 1.25, expr: hug ? 'calm' : 'neutral', face: hug ? { blush: 1 } : {}, armR: hug ? [10, -20] : [70, 80] }, t) +
      (bub > 0 ? miSpeech(560, 900 + (1 - bub) * 300, bub, '…') : '') +
      miPetit({ x: px, y: 1440, s: .9, expr: hug ? 'calm' : 'happy', flip: 1, armL: hug ? [190, 170] : [70, 80], armR: [100, 120], holdR: dTeddy(0, 50, .7) }, t) +
      (hug ? heartsUp(t, 580, 980, 6) + heart(580, 860, 1.1 * pop(t, Pa + .7, .4)) : '') +
      kthin('à ne pas', CX, 420, t, at(40, 'ne') - O40 - .1, { size: 64 }) + kword('EN PARLER.', CX, 560, t, Pa - .3, { size: 130, fill: '#fff' }); },
  sfx: [[at(40, 'ne') - O40, 'pop_hi', .3], [at(40, 'parler') - O40 - .3, 'boom', .4], [at(40, 'parler') - O40, 'pop', .4], [at(40, 'parler') - O40 + .4, 'tiptoe', .4], [at(40, 'parler') - O40 + .7, 'kiss', .4], [at(40, 'parler') - O40 + .75, 'magic', .4]] }, O40);

SCENES.sort((a, b) => a.s - b.s);
