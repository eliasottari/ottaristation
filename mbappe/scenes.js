// ============================================================
//  « Pourquoi c'est horrible d'être Kylian Mbappé ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  PERSONNE RÉELLE : caricature cartoon BIENVEILLANTE (crâne rasé, grand sourire, maillot bleu n°10 puis blanc).
//  Aucun vrai logo (clubs, sponsors, FIFA) : couleurs + texte seulement. Passages Suède / Mao : sobres et neutres.
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
const BEDS = [];

// ---------- SIZEX fun : accent BLEU FRANCE (propre à l'épisode), or pour les mots-clés ----------
sxFun('#1f4fd1'); SX.acc2 = '#ffd23f'; SX.cool = '#8fd0ff';
const GOLD = '#ffc928', FBLUE = '#1f4fd1', FRED = '#e2463a';

// ============================================================
//  LE HÉROS : caricature bienveillante (crâne rasé = léger dégradé, peau brune, grand sourire), maillots par époque
// ============================================================
const MB_SKIN = '#9a6440', MB_CHEEK = '#c9705a';
const mbHair = (r, t, o) => ['', op(.32, path(`M${-r * .97} ${-r * .14}A${r * .99} ${r * .99} 0 0 1 ${r * .97} ${-r * .14}Q${r * .62} ${-r * .52} 0 ${-r * .58}Q${-r * .62} ${-r * .52} ${-r * .97} ${-r * .14}Z`, '#1a1210', 0)) +
  op(.35, path(`M${-r * .45} ${-r * .78}Q${-r * .2} ${-r * .92} ${r * .1} ${-r * .9}`, 'none', r * .06, '#fff'))];
const KIT = {
  fra: { shirt: FBLUE, pants: '#f4f4f4', num: '10', nc: '#fff', trim: FRED },
  psg: { shirt: '#1c2a5a', pants: '#1c2a5a', num: '7', nc: '#fff', stripe: '#d8283a' },
  real: { shirt: '#f6f6f6', pants: '#f6f6f6', num: '9', nc: GOLD, trim: GOLD },
  monaco: { shirt: FRED, pants: '#fff', num: '29', nc: '#fff', half: '#fff' },
  casual: { shirt: '#2f3443', pants: '#3b4a6b' },
  hoodie: { shirt: '#ff9a4d', pants: '#3b4a6b' },
};
const mbChest = (k, fl) => (topY, hipY, bt, bb) => { const K = KIT[k]; let s = '';
  if (K.half) s += path(`M${bt - 4} ${topY + 6}L${bb - 6} ${hipY}L${-bb + 40} ${hipY}Z`, K.half, 0);
  if (K.stripe) s += rect(-26, topY + 8, 52, hipY - topY - 2, K.stripe, 0, 0) + line(-26, topY + 8, -26, hipY + 4, 6, '#fff') + line(26, topY + 8, 26, hipY + 4, 6, '#fff');
  if (K.trim) s += path(`M${-bt * .55} ${topY + 6}Q0 ${topY + 34} ${bt * .55} ${topY + 6}`, 'none', 8, K.trim);
  if (K.num) s += G(fl ? 'scale(-1 1)' : '', ftext(0, topY + (hipY - topY) * .66, K.num, { size: (hipY - topY) * .42, fill: K.nc, stroke: K.nc === '#fff' || K.nc === GOLD ? OL : '#fff', sw: 6 }));
  return s; };
const mbP = (o, t) => { const k = o.kit || 'fra', K = KIT[k];
  return person(Object.assign({ age: 'adult', skin: MB_SKIN, cheekColor: MB_CHEEK, hairFn: mbHair, shirt: K.shirt, pants: K.pants, shoes: k === 'casual' || k === 'hoodie' ? '#f4f4f4' : '#ffd23f', chest: mbChest(k, o.flip), seed: 10 }, o), t); };
const mbKid = (o, t) => person(Object.assign({ age: 'kid', skin: MB_SKIN, cheekColor: MB_CHEEK, hairFn: mbHair, shirt: FRED, pants: '#2b2f3a', chest: mbChest('fra', o.flip), seed: 11 }, o), t);
const mbBaby = (o, t) => person(Object.assign({ age: 'baby', skin: MB_SKIN, cheekColor: MB_CHEEK, hairFn: mbHair, shirt: '#bfe0ff', seed: 12 }, o), t);
// tête seule (+ épaules au maillot si o.kit)
const mbHead = (x, y, r, o, t) => { const K = KIT[o.kit || 'fra'];
  const sh = o.kit === false ? '' : path(`M${-r * 1.35} ${r * 2.1}Q${-r * 1.25} ${r * .92} 0 ${r * .9}Q${r * 1.25} ${r * .92} ${r * 1.35} ${r * 2.1}Z`, K.shirt, 7) + path(`M${-r * .5} ${r * .93}Q0 ${r * 1.25} ${r * .5} ${r * .93}`, 'none', 8, K.trim || shade(K.shirt, -.3));
  return G(tr(x, y, 1, o.tilt || 0), sh + head(Object.assign({ hr: r, skin: MB_SKIN, cheekColor: MB_CHEEK, hairFn: mbHair, seed: 10 }, o), t)); };

// ---------- accessoires ----------
const mbBall = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), circ(0, 0, 40, '#fff', 5) + path('M0 -14L13 -4L8 12L-8 12L-13 -4Z', OL, 0) + path('M0 -14L0 -38M13 -4L36 -12M8 12L22 32M-8 12L-22 32M-13 -4L-36 -12', 'none', 4));
const mbTrophy = (x, y, s = 1, t = 0) => G(tr(x, y, s, Math.sin(t * 3) * 2), rect(-70, -40, 140, 40, '#2f6b4a', 8, 6) + rect(-50, -70, 100, 32, '#3d8a5f', 6, 6) +
  path('M-18 -70L-24 -150L24 -150L18 -70Z', GOLD, 6) + path('M-80 -300Q-90 -200 0 -150Q90 -200 80 -300Z', GOLD, 6) + path('M-78 -280Q-140 -270 -120 -220Q-104 -190 -60 -196', 'none', 12) + path('M-78 -280Q-140 -270 -120 -220Q-104 -190 -60 -196', 'none', 6, GOLD) +
  path('M78 -280Q140 -270 120 -220Q104 -190 60 -196', 'none', 12) + path('M78 -280Q140 -270 120 -220Q104 -190 60 -196', 'none', 6, GOLD) + ell(0, -300, 80, 18, '#e8a820', 6) + path('M-50 -270Q-56 -210 -20 -175', 'none', 10, 'rgba(255,255,255,.6)') +
  sparkle(60, -240, .4 + .2 * Math.sin(t * 6), '#fff'));
function mbGoal(x, yb, s = 1, bulge = 0) { let n = ''; for (let i = 0; i <= 12; i++) n += line(-300 + i * 50, -260, -300 + i * 50 + Math.sin(i / 12 * Math.PI) * bulge * .3, -10 + bulge * .1, 3, 'rgba(255,255,255,.75)');
  for (let j = 0; j <= 5; j++) n += path(`M-300 ${-260 + j * 50}Q0 ${-260 + j * 50 + bulge} 300 ${-260 + j * 50}`, 'none', 3, 'rgba(255,255,255,.75)');
  return G(tr(x, yb, s), op(.9, n) + rect(-312, -272, 24, 272, '#fff', 6, 6) + rect(288, -272, 24, 272, '#fff', 6, 6) + rect(-312, -282, 624, 24, '#fff', 8, 6)); }
// stade (nuit par défaut) : ciel, projecteurs, tribunes pleines qui bougent, panneaux, pelouse rayée
function mbStadium(t, o = {}) { const night = o.night !== false, cols = o.cols || [FBLUE, '#fff', FRED, '#ffd23f', '#5ec4f0'];
  let s = night ? grad('#0b1640', '#26388a', -M, -M, W + 2 * M, 1100 + M) : grad('#7cc8ff', '#dff2ff', -M, -M, W + 2 * M, 1100 + M);
  if (night) { const r = rng(3); for (let i = 0; i < 26; i++) s += op(.5 + .5 * Math.sin(t * 3 + i), circ(-200 + r() * 1500, -120 + r() * 330, 2 + r() * 3, '#fff', 0)); }
  else s += cloud(((t * 30) % 1700) - 400, 110, .9) + cloud(((t * 22 + 800) % 1700) - 400, 220, .6);
  s += path(`M${-M} 330Q540 230 ${W + M} 330L${W + M} 1150L${-M} 1150Z`, '#232a4a', 7);
  for (let k = 0; k < 4; k++) { const y0 = 360 + k * 190; s += rect(-M, y0, W + 2 * M, 182, k % 2 ? '#323c6a' : '#3b4679', 0, 0) + line(-M, y0, W + M, y0, 5, '#1b2140');
    for (let row = 0; row < 2; row++) for (let i = 0; i < 17; i++) { const x = -40 + i * 70 + (row ? 35 : 0) + k * 13, y = y0 + 70 + row * 70 - Math.abs(Math.sin(t * (o.cheer ? 9 : 3) + i * 1.3 + k)) * (o.cheer ? 22 : 7);
      s += ell(x, y + 30, 26, 22, cols[(i + k + row) % cols.length], 0) + circ(x, y, 17, SK[(i + row + k) % 6], 0); } }
  for (const [x, c] of [[160, FBLUE], [700, FRED], [940, '#fff']]) s += G(tr(x, 520 + (x % 3) * 190, 1, wave(t, .7, 8, x)), line(0, 0, 0, -120, 6) + path(`M0 -120Q50 ${-130 + wave(t, 1.3, 10, x)} 100 -110L100 -60Q50 ${-70 + wave(t, 1.3, 10, x)} 0 -60Z`, c, 5));
  if (o.flashes !== false) { const r = rng(9); for (let i = 0; i < 9; i++) { const x = r() * W, y = 420 + r() * 700, ph = r(); if (Math.sin(t * 7 + ph * 20) > .85) s += sparkle(x, y, .45, '#fff'); } }
  for (const x of [70, 1010]) s += line(x, 420, x, 120, 14, '#3a4250') + rect(x - 85, 40, 170, 104, '#3a4250', 14, 6) + [0, 1, 2].map(i => circ(x - 52 + i * 52, 72, 17, '#fffbe0', 4) + circ(x - 52 + i * 52, 114, 17, '#fffbe0', 4)).join('') + (night ? op(.3 + .05 * Math.sin(t * 3), glow(x, 92, 300, '#fffbe0', .8)) : '');
  const ads = o.ads || ['ALLEZ !', 'FOOT', 'BUT !', 'GOAL', 'ALLEZ !'];
  s += rect(-M, 1110, W + 2 * M, 90, '#1b2140', 0, 0); ads.forEach((a, i) => { const x = -60 + i * 300 - ((t * 60) % 300); s += rect(x, 1120, 280, 70, DPAL[(i * 3) % 8], 8, 5) + ftext(x + 140, 1170, a, { size: 40, fill: '#fff' }); });
  s += rect(-M, 1200, W + 2 * M, 800, '#3fa04a', 0, 0); for (let i = 0; i < 6; i++) s += rect(-M, 1200 + i * 110, W + 2 * M, 55, '#4bb257', 0, 0);
  s += line(-M, 1235, W + M, 1235, 8, '#eaffea') + path('M260 1235Q540 1330 820 1235', 'none', 8, '#eaffea');
  return s; }
// tapis rouge (barrières, photographes, foule de téléphones)
function mbCarpet(t) { let s = grad('#3a1240', '#1a0820', -M, -M, W + 2 * M, H + 2 * M) + dWall('star', 'rgba(0,0,0,0)', 'rgba(255,220,160,.18)', 1150);
  for (const x of [200, 880]) s += op(.16 + .04 * Math.sin(t * 2 + x), path(`M${x} -40L${x - 260} 1300L${x + 260} 1300Z`, '#fff6c8', 0));
  s += dNeon(CX, 260, 'GALA', '#ff5c8a', t, 70);
  const r = rng(5); for (let i = 0; i < 12; i++) { const x = 40 + i * 92, y = 1010 + (i % 2) * 40 + wave(t, 1.2, 6, i); s += ell(x, y + 70, 46, 50, ['#2b2f3a', '#4a2a55', '#3a4250'][i % 3], 5) + circ(x, y, 34, SK[i % 6], 5) + (i % 3 !== 1 ? G(tr(x + 30, y - 40, 1, 10), rect(-20, -34, 40, 64, '#222', 8, 4) + (Math.sin(t * 6 + i * 2.1) > .6 ? op(.9, sparkle(0, -5, .7, '#fff')) : rect(-14, -26, 28, 46, '#9fd0ff', 3, 0))) : ''); }
  s += rect(-M, 1150, W + 2 * M, 900, '#5a2340', 0, 0) + path('M300 1150L780 1150L1180 1950L-100 1950Z', '#e2263a', 7) + path('M330 1150L360 1150L60 1950L0 1950Z', '#ffd23f', 0) + path('M750 1150L720 1150L1020 1950L1080 1950Z', '#ffd23f', 0);
  for (const x of [120, 960]) s += line(x, 1200, x, 1000, 10, GOLD) + circ(x, 990, 18, GOLD, 5) + rect(x - 40, 1190, 80, 20, GOLD, 6, 4);
  s += path('M120 1020Q300 1080 480 1020', 'none', 14, '#b8243a') + path('M600 1020Q780 1080 960 1020', 'none', 14, '#b8243a');
  return s; }
// bureau (président / avocat) : mur, fenêtre ville, étagères, cadres, plantes
function mbOffice(t, o = {}) { const yb = 1250;
  let s = dWall('stripe', o.wall || '#e8e3f4', o.wall2 || '#ddd6ee', yb) + dWindowView(600, 280, 380, 420, t) + dCurtain(570, 270, 90, 460, o.cur || '#1c2a5a', t, 1) + dCurtain(930, 270, 90, 460, o.cur || '#1c2a5a', t, -1);
  s += dShelf(60, 520, 360, dBooks(70, 520, 340, 3)) + dShelf(60, 760, 360, dTrophy(120, 760, .9) + dTrophy(200, 760, .7) + dGlobe(320, 760, .7, t) + dJar(390, 760, '#ffd23f', .7));
  s += dFrame(240, 300, 200, 150, 'mount', '#c38a52', -2) + (o.sign ? G(tr(240, 900), rect(-170, -50, 340, 100, '#1c2a5a', 14, 6) + ftext(0, 18, o.sign, { size: 44, fill: '#fff' })) : '');
  s += op(.25, circ(800, 160, 60 + 10 * Math.sin(t * 2), '#fff6c8', 0)) + dLamp(1000, 1250, 1, 1, t);
  s += dParquet(yb, '#c9955e') + dPot(70, 1290, 1.1, t, 1) + dPot(1010, 1300, 1, t, 2);
  return s; }
// salle de conférence de presse : mur de fond à motif texte, table, micros, flashes
function mbPress(t, word = 'PRESSE', col = '#1c2a5a', o = {}) { let s = rect(-M, -M, W + 2 * M, 1250 + M, col, 0, 0);
  for (let j = 0; j < 9; j++) for (let i = -2; i < 6; i++) s += ftext(i * 260 + (j % 2) * 130, 120 + j * 130, word, { size: 40, fill: 'rgba(255,255,255,.16)', stroke: 'none' });
  const r = rng(11); for (let i = 0; i < 10; i++) { const x = r() * W, y = 200 + r() * 900; if (Math.sin(t * 8 + i * 1.7) > .8) s += op(.8, glow(x, y, 120, '#fff', .9)) + sparkle(x, y, .6, '#fff'); }
  s += rect(-M, 1250, W + 2 * M, 700, '#3a3f4a', 0, 0);
  return s; }
const mbTable = (yb, cloth = '#f4f4f4', mics = 5, t = 0) => { let s = rect(60, yb - 30, 960, 50, '#6b3e26', 8, 6) + path(`M70 ${yb + 10}L1010 ${yb + 10}L990 ${yb + 260}L90 ${yb + 260}Z`, cloth, 6);
  for (let i = 0; i < mics; i++) { const x = 330 + i * 105; s += line(x, yb - 30, x + (i - 2) * 12, yb - 150, 6) + ell(x + (i - 2) * 12, yb - 168, 20, 28, DPAL[i % 8], 5) + rect(x - 20, yb - 40, 40, 14, '#2b2b33', 4, 3); }
  return s; };
// paysage enneigé (Suède, neutre) : ciel gris-bleu, montagnes, sapins, neige qui tombe
function mbSnow(t) { let s = grad('#9fb4d8', '#e3ebf7', -M, -M, W + 2 * M, H + 2 * M) + path(`M${-M} 900L120 560L330 820L560 480L800 800L1000 600L${W + M} 860L${W + M} 1300L${-M} 1300Z`, '#c4d2ea', 7) + path('M520 520L560 480L600 520L580 540L560 520L540 540Z', '#fff', 4);
  s += path(`M${-M} 1050Q540 960 ${W + M} 1050L${W + M} 2000L${-M} 2000Z`, '#f4f8ff', 7);
  [[90, 1080, .9], [230, 1040, 1.2], [880, 1040, 1.1], [1010, 1090, .8], [400, 1000, .6], [700, 990, .55]].forEach(([x, y, k]) => s += dPine(x, y, k, t));
  s += rect(-M, 1250, W + 2 * M, 700, '#eaf1fb', 0, 0) + line(-M, 1250, W + M, 1250, 5, '#c4d2ea');
  const r = rng(4); for (let i = 0; i < 40; i++) { const x = (r() * W + Math.sin(t + i) * 30), y = (r() * 1800 + t * (60 + r() * 60)) % 1800; s += circ(x, y, 4 + r() * 4, '#fff', 0); }
  return s; }
// salon avec grande télé
const mbTV = (x, y, w, h, inner, s = 1) => G(tr(x, y, s), rect(-w / 2 - 20, -h / 2 - 20, w + 40, h + 40, '#1d2026', 22, 7) + clipR(-w / 2, -h / 2, w, h, rect(-w / 2, -h / 2, w, h, '#000', 0, 0) + inner, 8) + rect(-60, h / 2 + 20, 120, 40, '#3a3f4a', 6, 6) + rect(-140, h / 2 + 56, 280, 20, '#3a3f4a', 8, 6));
// mini-terrain dans un écran (coordonnées locales ±w/2, ±h/2)
const mbMiniMatch = (w, h, t) => rect(-w / 2, -h / 2, w, h, '#3fa04a', 0, 0) + [0, 1, 2, 3].map(i => rect(-w / 2 + i * w / 4, -h / 2, w / 8, h, '#4bb257', 0, 0)).join('') + line(0, -h / 2, 0, h / 2, 4, '#eaffea') + circ(0, 0, h * .2, 'none', 4, '#eaffea') +
  [0, 1, 2, 3].map(i => circ(Math.sin(t * 2 + i) * w * .35, Math.cos(t * 1.5 + i * 2) * h * .3, 12, i % 2 ? FBLUE : '#fff', 3)).join('') + mbBall(Math.sin(t * 2.4) * w * .3, Math.cos(t * 1.9) * h * .25, .25);
const mbBars = (w, h) => ['#fff', '#ffd23f', '#5ec4f0', '#36a85a', '#ff8fb1', '#e2463a', '#2f5fd8'].map((c, i) => rect(-w / 2 + i * w / 7, -h / 2, w / 7 + 1, h * .72, c, 0, 0)).join('') + rect(-w / 2, h * .22, w, h * .28, '#1d2026', 0, 0);
// émoji « mort de rire » dessiné (pas de police émoji)
const mbLol = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), circ(0, 0, 40, '#ffd23f', 5) + path('M-24 -8Q-14 -20 -4 -8M4 -8Q14 -20 24 -8', 'none', 5) + path('M-22 6Q0 34 22 6Z', '#7a2b2b', 4) + path('M-30 -4Q-44 10 -40 24', 'none', 7, '#5ec4f0') + path('M30 -4Q44 10 40 24', 'none', 7, '#5ec4f0'));
// marteau de juge (émoji)
const mbGavel = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-12, -10, 24, 120, '#8a5a3a', 8, 5) + rect(-60, -50, 120, 50, '#a8703f', 14, 6) + rect(-72, -54, 20, 58, '#6b3e26', 6, 5) + rect(52, -54, 20, 58, '#6b3e26', 6, 5));
// smartphone avec écran perso (écran local -66..66 × -128..122)
const mbPhone = (x, y, s, r, screen) => phone(x, y, s, r, clipR(-66, -128, 132, 250, screen, 12));
// perruque de juge (pour les téléphones-juges)
const mbWig = (x, y, s = 1) => G(tr(x, y, s), [-1, 1].map(sd => [0, 1, 2].map(i => circ(sd * 76, -90 + i * 42, 24, '#f4f1ea', 5)).join('')).join('') + path('M-80 -110Q0 -200 80 -110Q60 -150 0 -156Q-60 -150 -80 -110Z', '#f4f1ea', 5));
// contrat (option : déchiré en 2)
const mbContract = (x, y, s, tear = 0, label = 'CONTRAT', r = 0) => { const page = h => rect(-110, -150, 220, 300, '#fff', 6, 5) + ftext(0, -100, label, { size: 34, fill: OL, stroke: 'none' }) + [0, 1, 2, 3, 4].map(i => line(-80, -50 + i * 36, 80, -50 + i * 36, 4, '#c9d3dc')).join('') + path('M-60 110Q-30 80 0 110T60 105', 'none', 4, '#3a5bff');
  if (tear <= 0) return G(tr(x, y, s, r), page());
  const d = tear * 120; return G(tr(x, y, s, r), G(`translate(${-d} ${d * .2}) rotate(${-tear * 18})`, clipR(-120, -160, 120, 320, page(), 0)) + G(`translate(${d} ${d * .3}) rotate(${tear * 22})`, clipR(0, -160, 120, 320, page(), 0))); };
// photographe (paparazzi) avec appareil
const mbCam = (flash = 0) => rect(-44, -30, 88, 60, '#2b2b33', 10, 5) + circ(6, 0, 20, '#5a6070', 5) + circ(6, 0, 9, '#9fd0ff', 0) + rect(-36, -44, 26, 16, '#2b2b33', 4, 4) + (flash ? op(flash, glow(-24, -40, 140, '#fff', 1) + sparkle(-24, -40, 1.1, '#fff')) : '');
const mbPap = (i, o, t, flashK = 0) => adult(i, Object.assign({ armR: [-40, -100], armL: [-150, -60], holdR: mbCam(flashK), expr: 'smugger' }, o), t);
// éclair blanc au milieu d'un plan
const mbFlash = (t, t0, k = .85) => t < t0 || t > t0 + .25 ? '' : op(k * (1 - seg(t, t0, t0 + .25)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0));
// billets qui tombent
function mbMoneyRain(t, t0 = 0, n = 18, seed = 6) { if (t < t0) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * W, sp = 260 + r() * 260, y = -120 + ((t - t0) * sp + r() * 900) % 1500; s += bill(x + Math.sin(t * 2 + i) * 40, y, .7, Math.sin(t * 3 + i) * 30); } return s; }
// tour Eiffel stylisée (fond)
const mbEiffel = (x, yb, s = 1, c = '#8a6a4a') => G(tr(x, yb, s), path('M-110 0Q-40 -120 -18 -420L18 -420Q40 -120 110 0L70 0Q30 -80 0 -80Q-30 -80 -70 0Z', c, 6) + rect(-70, -200, 140, 22, c, 4, 5) + rect(-40, -330, 80, 18, c, 4, 5) + line(0, -420, 0, -500, 8, c));
// calendrier à feuille
const mbCal = (x, y, s, top, big, sub = '', r = 0) => G(tr(x, y, s, r), rect(-150, -170, 300, 340, '#fff', 18, 7) + rect(-150, -170, 300, 90, FRED, 18, 7) + ftext(0, -110, top, { size: 42, fill: '#fff' }) + ftext(0, 50, big, { size: 120, fill: OL, stroke: 'none' }) + (sub ? ftext(0, 130, sub, { size: 40, fill: '#7d848c', stroke: 'none' }) : '') + circ(-80, -170, 14, '#9aa3ad', 4) + circ(80, -170, 14, '#9aa3ad', 4));

// ============================================================
//  PLANS — un B(n, {...}) par bloc. Cadrage : visages/textes y 380–1150 (sous-titres incrustés y ≈ 1440–1550).
// ============================================================
// B001 — INTRO MACHINE À SOUS : 3 rouleaux sur la tête cartoon du héros, le 3e tombe PILE sur « Kylian »
const SL0 = .1, SLS = [+(at(1, 'kylian') - 1.1).toFixed(2), +(at(1, 'kylian') - .75).toFixed(2), at(1, 'kylian')];
var CAP_START = SLS[2];   // sous-titres masqués jusqu'au jackpot (pas de spoiler)
B(1, { enter: 'none', cam: (t, d) => slotCam(t, SL0, SLS),
  draw: (t, d, T) => casinoBg(t) + slotMachine(t, { l1: "POURQUOI C'EST", l2: "HORRIBLE D'ÊTRE", key: 'KYLIAN MBAPPÉ ?', t0: SL0, stops: SLS,
      win: [0, 1, 2].map(i => (x, y, s, t) => mbHead(x, y - 8 * s, 56 * s, { expr: i === 2 ? 'ecstatic' : 'happy', kit: false }, t)) }),
  sfx: slotSfx(SL0, SLS) });

// B002 — « 20 décembre 1998. PARIS. » : papier + gobo, calendrier qui s'arrache, bébé en cut-out, tour Eiffel qui pousse sur « Paris »
B(2, { enter: 'none', trans: 'wipe', transD: .22, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const D = at(2, '20'), Y = at(2, '1998'), P = at(2, 'paris'), ek = eOutBack(seg(t, P - .1, P + .3));
    return paper('#eaf2ff') + gobo(T, .12) + blob(780, 900, 270, t, '#ffd9e6', 3) + burst(300, 1000, 250, t, .05, '#ffe1b8', 16) +
      (ek > 0 ? G(tr(820, 1250, 1, 0), G(`scale(1 ${f1(ek)})`, mbEiffel(0, 0, 1.25))) : '') +
      cutout(mbBaby({ x: 300, y: 1290, s: 1.3, expr: t > Y ? 'happy' : 'calm' }, t), 12) +
      card(790, 820, 300, 340, mbCal(0, 0, 1, 'DÉC.', '20', '1998'), t, D - .1, { ry: 0, thick: 10, r: 5, bw: 6 }) +
      kthin('20 décembre', CX, 420, t, D - .1, { size: 64 }) + funTag(CX, 545, '1998', t, Y - .1, { size: 70, bg: SX.acc2, fg: SX.ink, r: -4 }) + kword('PARIS', 780, 1120, t, P - .05, { size: 110, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(2, '20') - .1, 'pop', .5], [at(2, '1998') - .1, 'pop_hi', .5], [at(2, '1998'), 'baby_coo', .5], [at(2, 'paris') - .05, 'boom', .5], [at(2, 'paris'), 'magic', .4]] });

// B003 — « Tu t'appelles Kylian Mbappé. » : grille encre, bébé en cut-out, bracelet de naissance, ÉTOILES « débloqué » sur le nom
B(3, { enter: 'none', trans: 'circle', transD: .25, cam: zin(1.02, 1.08, .2),
  draw: (t, d, T) => { const Ap = at(3, 'appelles'), K = at(3, 'kylian');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1010, 290, t, .05, SX.acc, 16) + unlock(CX, 980, t, K, { part: 'back', r: 470 }) +
      G(tr(CX, 1280, 1 + .03 * Math.sin(t * 6)), cutout(mbBaby({ x: 0, y: 0, s: 1.5, expr: t > K ? 'ecstatic' : 'happy' }, t), 12)) +
      unlock(CX, 980, t, K, { part: 'front', r: 470 }) + funBox(CX, 980, 380, 400, t, K + .15, { label: 'bebe.png' }) +
      funTag(820, 760, 'BRACELET', t, Ap, { size: 34, bg: '#8fd0ff', fg: SX.ink, r: 8 }) +
      kthin("tu t'appelles", CX, 420, t, Ap - .15, { size: 62 }) + kword('KYLIAN MBAPPÉ', CX, 560, t, K - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(3, 'appelles'), 'pop_hi', .5], [at(3, 'kylian') - .05, 'boom', .6], [at(3, 'kylian'), 'sparkle', .5], [at(3, 'mbappe'), 'tada', .4]] });

// B004a — « Tu grandis à Bondy, avec un père entraîneur de foot » : city-stade de quartier, petit Kylian qui dribble, papa au sifflet
const O4 = at(4, 'et') - .12;
function mbCity(t) { let s = SKY(t) + dSkyline(980, '#b9c6dd', 5) + dBuilding(120, 1000, 230, 560, '#e8b48a', 2, t) + dBuilding(900, 1000, 260, 620, '#9fb4d8', 4, t) + dBuilding(380, 1000, 180, 420, '#f2d38a', 6, t) + dBirds(t, 3, 260, 2);
  s += rect(-M, 1000, W + 2 * M, 1000, '#c9c2b5', 0, 0) + rect(-M, 1040, W + 2 * M, 1000, '#4bb257', 0, 0) + [0, 1, 2, 3].map(i => rect(-M, 1060 + i * 120, W + 2 * M, 60, '#3fa04a', 0, 0)).join('');
  s += dFence(-60, 1140, 1050, '#9aa3ad') + dSign(960, 1050, 'BONDY', '#5b8fd8', .9) + tree(70, 1040, .7, t) + dBench(230, 1080, .6) + line(-M, 1250, W + M, 1250, 7, '#eaffea');
  return s; }
B(4, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bo = at(4, 'bondy'), Pe = at(4, 'pere'), En = at(4, 'entraineur'), bx = 560 + Math.sin(t * 5) * 80;
    const dad = adult(0, { x: 840, y: 1480, s: 1.1, skin: '#8a5a3a', hair: 'short', hairColor: '#1f1a18', shirt: '#36a85a', cap: '#36a85a', glasses: false, expr: t > En ? 'proud' : 'happy', flip: 1, armR: t > En ? [-60, -120] : [70, 80], holdR: t > En ? G(tr(0, -10), rect(-24, -12, 48, 24, '#c0c6cc', 10, 4)) : '' }, t);
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.4, svg: mbCity(t), haze: .06 },
      { z: 1, svg: mbGoal(170, 1250, .45) + dad + mbKid({ x: 380, y: 1480, s: 1.15, expr: 'ecstatic', walk: t, legL: [70 + Math.sin(t * 12) * 25, 90], legR: [110 - Math.sin(t * 12) * 25, 90], armL: [150, 140], armR: [30, 40] }, t) + mbBall(bx, 1440, 1, t * 500) },
      { z: .6, svg: blur(10, dBush(1020, 1950, 1.5)) }]) +
      funTag(CX, 420, 'BONDY', t, Bo - .1, { size: 70, bg: '#5b8fd8', r: -4 }) + (t > Pe ? kthin('papa entraîneur', CX, 570, t, Pe, { size: 56 }) : '') + (t > En ? markerArrow(700, 640, 800, 860, t, En, { bend: -40 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(4, 'bondy') - .1, 'pop', .6], [at(4, 'pere'), 'pop_hi', .4], [at(4, 'entraineur'), 'whistle', .6], [at(4, 'foot'), 'boing', .4]] });
// B004b — « …et une mère ancienne handballeuse. » : maman en suspension, tir de hand surpuissant, papa et le petit bouche bée
B(4, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .3, shake: t > at(4, 'handballeuse') - O4 && t < at(4, 'handballeuse') - O4 + .3 ? 7 : 0 }),
  draw: (t, d, T) => { const Me = at(4, 'mere') - O4, Hb = at(4, 'handballeuse') - O4, k = seg(t, Hb, Hb + .35), jump = Math.sin(clamp(t / (Hb + .2)) * Math.PI) * 120;
    const mom = adult(3, { x: 330, y: 1480 - jump, s: 1.15, skin: '#7a4a2e', hair: 'ponytail', hairColor: '#1f1a18', shirt: '#ffd23f', pants: '#2f3b4e', expr: t > Hb ? 'rage' : 'proud', armR: t > Hb ? [-10, 0] : [-20, -80], armL: [150, 120], legL: [120, 60], legR: [60, 120] }, t);
    const ball = t < Hb ? G(tr(534, 1480 - jump - 515), circ(0, 0, 40, '#ff9a4d', 5) + path('M-40 0Q0 -24 40 0M0 -40Q-16 0 0 40', 'none', 4)) : G(tr(lerp(380, 1250, k), lerp(980, 820, k), 1, t * 900), circ(0, 0, 40, '#ff9a4d', 5) + path('M-40 0Q0 -24 40 0M0 -40Q-16 0 0 40', 'none', 4));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: mbCity(t), haze: .1 }, { z: 1, svg: mbKid({ x: 860, y: 1480, s: 1.0, expr: t > Hb ? 'jawdrop' : 'happy', flip: 1 }, t) + mom + (t > Hb && k < 1 ? speedLines(t, lerp(380, 1250, k), lerp(980, 820, k), 16, 'rgba(255,255,255,.8)') : '') + ball }]) +
      kthin('et une mère', CX, 420, t, Me - .15, { size: 62 }) + kword('HANDBALLEUSE', CX, 560, t, Hb - .05, { size: 96, fill: SX.acc2 }) + (t > Hb + .3 ? impactStar(1000, 820, .8) : ''); },
  sfx: [[0, 'whoosh', .4], [at(4, 'mere') - O4, 'pop_hi', .4], [at(4, 'handballeuse') - O4 - .05, 'whoosh_up', .5], [at(4, 'handballeuse') - O4, 'boom', .5], [at(4, 'handballeuse') - O4 + .35, 'crack', .5]] }, O4);

// B005 — « Bref… TU SAVAIS COURIR AVANT MÊME DE SAVOIR PAYER TES IMPÔTS. » : bébé qui sprinte, le formulaire d'impôts reste sur place
const mbTax = (x, y, s, r = 0) => G(tr(x, y, s, r), rect(-150, -200, 300, 400, '#fff', 8, 6) + rect(-150, -200, 300, 70, '#5b8fd8', 8, 6) + ftext(0, -150, 'IMPÔTS', { size: 46, fill: '#fff' }) +
  [0, 1, 2, 3, 4].map(i => rect(-120, -100 + i * 56, 34, 34, '#fff', 4, 4) + line(-70, -83 + i * 56, 120, -83 + i * 56, 4, '#c9d3dc')).join('') + ftext(0, 180, 'À REMPLIR', { size: 28, fill: FRED, stroke: 'none' }));
B(5, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .5, shake: t > at(5, 'courir') ? 3 : 0 }),
  draw: (t, d, T) => { const Co = at(5, 'courir'), Pa = at(5, 'payer'), Im = at(5, 'impots'), bx = t < Co ? 260 : 260 + ((t - Co) * 900) % 1400;
    return rays(t, CX, 900, '#6f9bff', '#2f5fd8', 22) + speedLines(t, CX, 900, 30, 'rgba(255,255,255,.55)') +
      card(780, 900, 320, 420, mbTax(0, 0, 1), t, Pa - .2, { ry: 0, thick: 10, r: 6, bw: 6 }) +
      G(tr(bx, 0), cutout(mbBaby({ x: 0, y: 1250, s: 1.25, expr: t > Co ? 'ecstatic' : 'happy', rot: t > Co ? 12 : 0 }, t), 10) + (t > Co ? op(.7, path('M-180 1100L-420 1100M-160 1180L-460 1180M-200 1020L-380 1020', 'none', 12, '#fff')) : '')) +
      kthin('bref…', CX, 400, t, 0, { size: 56, out: Co - .3 }) + kword('COURIR', CX, 470, t, Co - .05, { size: 130, fill: '#fff' }) + kthin('avant de savoir payer', CX, 620, t, at(5, 'avant') - .1, { size: 54 }) +
      stamp(780, 1060, 'IMPÔTS ?', t, Im - .05, FRED, -10, 64); },
  sfx: [[0, 'flash_hit', .5], [at(5, 'courir') - .05, 'boom', .6], [at(5, 'courir'), 'whoosh', .6], [at(5, 'payer') - .2, 'printer', .4], [at(5, 'impots') - .05, 'thud', .7], [at(5, 'impots'), 'baby_coo', .5]] });

// B006 — « À seize ans, tu joues à Monaco. » : stade de jour rouge et blanc, ado Kylian en maillot rouge/blanc, yacht en carton au fond
B(6, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const A16 = at(6, '16'), Mo = at(6, 'monaco');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: mbStadium(t, { night: false, cols: [FRED, '#fff', FRED, '#fff', '#ffd23f'], ads: ['MONACO', 'ALLEZ !', 'FOOT', 'MONACO', 'BUT !'] }), haze: .12 },
      { z: 1, svg: mbP({ x: CX, y: 1480, s: 1.08, kit: 'monaco', expr: t > Mo ? 'ecstatic' : 'happy', armL: t > Mo ? [-140, -120] : [110, 100], armR: t > Mo ? [-40, -60] : [70, 80] }, t) + mbBall(760, 1440, .9, t * 300) },
      { z: .6, svg: blur(10, fgGrass(80, 1950, 1.6, t)) }]) +
      funTag(CX, 400, '16 ANS', t, A16 - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 400, t, A16, 6, 180) + kword('MONACO', CX, 620, t, Mo - .05, { size: 104, fill: '#fff', acc: FRED }); },
  sfx: [[0, 'whoosh', .4], [at(6, '16') - .1, 'pop', .6], [at(6, 'joues'), 'boing', .4], [at(6, 'monaco') - .05, 'boom', .5], [at(6, 'monaco'), 'whistle', .4]] });

// B007 — « À dix-huit ans, tu signes au PSG. » : bureau, signature d'un contrat géant, flashes ; texte « PARIS » (pas de logo)
B(7, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const A18 = at(7, '18'), Si = at(7, 'signes'), P = at(7, 'psg'), sk = seg(t, Si, Si + .6);
    const sig = path(`M-70 90Q-40 ${90 - 40 * sk} ${-70 + 140 * sk} ${90 + Math.sin(sk * 12) * 14}`, 'none', 6, '#3a5bff');
    return mbPress(t, 'PARIS', '#1c2a5a') + G(tr(CX, 0), rect(-26, 0, 52, 1250, '#d8283a', 0, 0)) + mbTable(1260, '#1c2a5a', 0) +
      mbP({ x: 330, y: 1500, s: 1.15, kit: 'psg', expr: t > Si ? 'ecstatic' : 'happy', armR: [-10, 30], holdR: t > Si ? G(tr(0, 0, 1, 30), rect(-8, -70, 16, 90, GOLD, 6, 4)) : '' }, t) +
      adult(0, { x: 800, y: 1500, s: 1.1, shirt: '#2f3b4e', hair: 'side', expr: 'happy', flip: 1, armR: [-30, 20] }, t) +
      card(560, 1060, 260, 330, rect(-110, -150, 220, 300, '#fff', 6, 5) + ftext(0, -100, 'CONTRAT', { size: 34, fill: OL, stroke: 'none' }) + [0, 1, 2, 3].map(i => line(-80, -50 + i * 34, 80, -50 + i * 34, 4, '#c9d3dc')).join('') + sig, t, Si - .2, { ry: 0, thick: 10, r: -4, bw: 6 }) +
      funTag(CX, 420, '18 ANS', t, A18 - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + kword('PARIS', CX, 590, t, P - .05, { size: 120, fill: '#fff', acc: '#d8283a' }); },
  sfx: [[0, 'whoosh', .4], [at(7, '18') - .1, 'pop', .6], [at(7, 'signes'), 'scratch', .5], [at(7, 'psg') - .05, 'boom', .5], [at(7, 'psg'), 'shutter', .6]] });

// B008 — « À dix-neuf ans… » : tunnel des joueurs, Kylian en bleu de dos vers la lumière, roulement de tambour
B(8, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.12, t / d) }),
  draw: (t, d, T) => { const A19 = at(8, '19');
    let tun = rect(-M, -M, W + 2 * M, H + 2 * M, '#151a30', 0, 0); for (let i = 6; i >= 0; i--) { const k = i / 6; tun += rect(CX - 120 - k * 700, 760 - 160 - k * 700, 240 + k * 1400, 330 + k * 1400, i % 2 ? '#1d2444' : '#232b52', 40, 6); }
    tun += op(.9, glow(CX, 840, 420, '#fffbe0', 1)) + rect(CX - 120, 600, 240, 330, '#fff8d6', 30, 6);
    return tun + G(tr(CX, 1480, 1.25), rect(-80, -330, 160, 220, FBLUE, 40, 7) + ftext(0, -200, '10', { size: 90, fill: '#fff' }) + circ(0, -390, 80, MB_SKIN, 7) + op(.32, path('M-78 -400A80 80 0 0 1 78 -400Q50 -440 0 -444Q-50 -440 -78 -400Z', '#1a1210', 0)) + rect(-60, -120, 50, 120, '#f4f4f4', 14, 6) + rect(10, -120, 50, 120, '#f4f4f4', 14, 6)) +
      funTag(CX, 450, '19 ANS', t, A19 - .1, { size: 100, bg: SX.acc2, fg: SX.ink }) + kthin('…', CX, 600, t, A19 + .2, { size: 80 }); },
  sfx: [[0, 'whoosh', .4], [at(8, '19') - .1, 'pop', .6], [at(8, '19'), 'drum', .6], [at(8, 'ans') + .1, 'heartbeat', .4]] });

// B009 — « TU GAGNES LA COUPE DU MONDE. » : stade de nuit en feu, trophée doré soulevé, confettis, ÉTOILES (2/3)
B(9, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .4, shake: t > at(9, 'coupe') && t < at(9, 'coupe') + .4 ? 8 : 0 }),
  draw: (t, d, T) => { const Ga = at(9, 'gagnes'), Co = at(9, 'coupe'), lift = eOutBack(seg(t, Co - .2, Co + .25));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: mbStadium(t, { cheer: 1 }), haze: .18 }]) + unlock(CX, 900, t, Co, { part: 'back', r: 480 }) +
      mbP({ x: CX, y: 1490, s: 1.2, expr: 'ecstatic', armL: [-120 + 30 * (1 - lift), -90], armR: [-60 - 30 * (1 - lift), -90] }, t) + mbTrophy(CX, 960 - 70 * lift, .75 + .05 * lift, t) +
      unlock(CX, 900, t, Co, { part: 'front', r: 480 }) + confetti(t, Co, 36) +
      kthin('tu gagnes', CX, 380, t, Ga - .1, { size: 58 }) + kword('LA COUPE DU MONDE', CX, 500, t, Co - .05, { size: 78, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .5], [at(9, 'gagnes'), 'whoosh_up', .4], [at(9, 'coupe') - .05, 'boom', .7], [at(9, 'coupe'), 'tada', .6], [at(9, 'monde'), 'sparkle', .5]] });

// B010 — « Magnifique. » : gros plan rayonnant, rayons dorés (plan concept)
B(10, { enter: 'none', trans: 'circle', transD: .18, cam: zin(1.0, 1.08),
  draw: (t, d, T) => { const Ma = at(10, 'magnifique');
    return rays(t, CX, 900, '#ffe58a', '#ffbf2e', 22) + mbHead(CX, 920, 210, { expr: 'ecstatic' }, t) + sparkle(250, 760, .9 + .2 * Math.sin(t * 9), '#fff') + sparkle(840, 700, .7, '#fff') + sparkle(820, 1060, .6, '#fff') +
      kword('MAGNIFIQUE', CX, 470, t, Ma - .05, { size: 110, fill: '#fff', acc: '#e8a020' }); },
  sfx: [[0, 'whoosh', .3], [at(10, 'magnifique') - .05, 'angel', .5], [at(10, 'magnifique') + .1, 'sparkle', .5]] });

// B011 — « Tu es riche, célèbre, adulé. » : tapis rouge ; 3 étiquettes sur les 3 mots (billets, flashes, cœurs)
B(11, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ri = at(11, 'riche'), Ce = at(11, 'celebre'), Ad = at(11, 'adule');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: mbCarpet(t), haze: .05 },
      { z: 1, svg: mbP({ x: CX, y: 1490, s: 1.2, kit: 'casual', expr: t > Ad ? 'love' : t > Ce ? 'cool' : 'smugger', armL: [-150, -110], armR: t > Ce ? [-40, -70] : [70, 80], glasses: t > Ce }, t) }]) +
      mbMoneyRain(t, Ri, 14) + (t > Ce ? mbFlash(t, Ce, .5) : '') + (t > Ad ? heartsUp(t, CX, 900, 7, 500) : '') +
      funTag(250, 450, 'RICHE', t, Ri - .05, { size: 58, bg: '#36a85a', r: -6 }) + funTag(800, 520, 'CÉLÈBRE', t, Ce - .05, { size: 58, bg: SX.acc, r: 5 }) + funTag(CX, 640, 'ADULÉ', t, Ad - .05, { size: 70, bg: '#ff5c8a', r: -3 }); },
  sfx: [[0, 'whoosh', .4], [at(11, 'riche') - .05, 'kaching', .6], [at(11, 'celebre') - .05, 'shutter', .6], [at(11, 'celebre') + .1, 'shutter', .4], [at(11, 'adule') - .05, 'kiss', .5]] });

// B012 — « La vie parfaite ? » : bouée flamant rose dans une piscine, lunettes de soleil, chill de ouf
const mbPool = (t) => SKY(t, '#5ec4f0', '#e6f6ff') + path(`M${-M} 820L${W + M} 820L${W + M} 2000L${-M} 2000Z`, '#f2e6d0', 0) + dPot(80, 820, 1.2, t, 1) + dPot(1000, 820, 1.1, t, 2) + G(tr(860, 820), line(0, 0, 0, -420, 12, '#8a5a3a') + path('M0 -420Q-160 -480 -260 -380M0 -420Q160 -480 260 -380M0 -420Q-80 -540 -200 -540M0 -420Q80 -540 200 -540', 'none', 26, '#36a85a')) +
  rect(-M, 880, W + 2 * M, 1200, '#5ec4f0', 0, 0) + [0, 1, 2, 3, 4, 5].map(i => path(`M${-100 + i * 220 + wave(t, .4, 20, i)} ${950 + i * 60}q40 -16 80 0`, 'none', 6, '#bfeaff')).join('');
B(12, { enter: 'none', trans: 'up', transD: .18, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Pf = at(12, 'parfaite'), bob = Math.sin(t * 3) * 10;
    return mbPool(t) + G(tr(CX, 1180 + bob), ell(0, 0, 330, 110, '#ff8fb1', 7) + ell(0, -10, 200, 54, '#5ec4f0', 5)) +
      mbHead(CX, 940 + bob, 150, { expr: 'chill', glasses: true, kit: 'casual' }, t) + G(tr(CX + 250, 1020 + bob, 1, 10), rect(-30, -70, 60, 90, '#ffd23f', 12, 5) + line(10, -70, 30, -120, 5, '#ff5c8a')) +
      kword('LA VIE PARFAITE ?', CX, 480, t, Pf - .15, { size: 84, fill: '#fff' }); },
  sfx: [[0, 'waves', .4], [at(12, 'vie'), 'pop_hi', .4], [at(12, 'parfaite'), 'magic', .4]] });

// B013 — « HAHAHAHA. » : rayons rouges, émojis qui rient partout, la bouée crève
B(13, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), shake: 7 }),
  draw: (t, d, T) => { const Ha = at(13, 'hahahaha');
    return rays(t, CX, 900, '#ff6b6b', '#c92f3a', 24) + mbHead(CX, 980, 150, { expr: 'jawdrop', kit: 'casual' }, t) +
      [[200, 760, 1.4, -14], [880, 700, 1.2, 16], [160, 1130, 1.1, 10], [930, 1120, 1.3, -10], [540, 690, .9, 4]].map(([x, y, s, r], i) => t > Ha + i * .05 ? mbLol(x, y + Math.sin(t * 20 + i) * 10, s * pop(t, Ha + i * .05, .2), r) : '').join('') +
      kword('HAHAHAHA', CX, 480, t, Ha - .05, { size: 140, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .5], [at(13, 'hahahaha') - .05, 'boom', .6], [at(13, 'hahahaha'), 'rimshot', .5], [at(13, 'hahahaha') + .2, 'boing', .4]] });

// B014a — « En 2022, » : stade de finale, panneau d'affichage « FINALE 2022 »
const O14 = at(14, 'tu') - .15;
const mbBoard = (x, y, s, top, mid, c = '#ffd23f') => G(tr(x, y, s), rect(-260, -130, 520, 260, '#14161c', 20, 8) + rect(-240, -110, 480, 70, '#2a2f3a', 10, 0) + ftext(0, -60, top, { size: 40, fill: '#fff', stroke: 'none' }) + ftext(0, 80, mid, { size: 110, fill: c, stroke: 'none' }) + line(-30, 150, -30, 330, 14, '#3a4250') + line(30, 150, 30, 330, 14, '#3a4250'));
B(14, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Y = at(14, '2022');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: mbStadium(t), haze: .1 }]) + G(tr(0, 0, 1), mbBoard(CX, 830, 1.2, 'FINALE', t > Y ? '2022' : '— —')) +
      funTag(CX, 450, '2022', t, Y - .1, { size: 96, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [at(14, 'en'), 'drum', .5], [at(14, '2022') - .1, 'pop', .6], [at(14, '2022'), 'whistle', .5]] });
// B014b — « …tu marques TROIS BUTS en finale de Coupe du monde. » : 3 frappes, 3 filets qui gonflent, compteur 1-2-3
B(14, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4, shake: t > at(14, '3') - O14 && t < at(14, '3') - O14 + .3 ? 8 : 0 }),
  draw: (t, d, T) => { const Ma = at(14, 'marques') - O14, T3 = at(14, '3') - O14, Bu = at(14, 'buts') - O14, Fi = at(14, 'finale') - O14;
    const shots = [Ma, T3, Bu], n = shots.filter(s => t > s + .2).length, last = Math.max(...shots.filter(s => t > s), -9), k = seg(t, last, last + .25);
    const ball = last < 0 ? mbBall(470, 1410, 1) : mbBall(lerp(470, 800 + (n % 2) * 80, k), lerp(1410, 1000, k) - Math.sin(k * Math.PI) * 140, 1, t * 900);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: mbStadium(t, { cheer: n > 0 }), haze: .12 }]) + mbGoal(800, 1250, .85, last > 0 && k >= 1 ? 40 * Math.max(0, 1 - (t - last - .25) * 2) : 0) +
      mbP({ x: 300, y: 1490, s: 1.15, expr: n ? 'ecstatic' : 'effort', legR: t - last < .2 ? [20, 30] : [85, 90], armL: [150, 120], armR: n ? [-50, -70] : [40, 60] }, t) + ball +
      G(tr(820, 610), rect(-180, -80, 360, 160, '#14161c', 18, 7) + ftext(-80, 30, 'BUTS', { size: 40, fill: '#fff', stroke: 'none' }) + ftext(90, 44, '' + n, { size: 110, fill: SX.acc2, stroke: 'none' })) +
      kword('3 BUTS', 300, 560, t, T3 - .05, { size: 120, fill: SX.acc2 }) + kthin('en finale !', 300, 690, t, Fi - .1, { size: 54 }); },
  sfx: [[0, 'flash_hit', .4], [at(14, 'marques') - O14, 'boom', .5], [at(14, '3') - O14, 'boom', .6], [at(14, '3') - O14 + .1, 'ding', .5], [at(14, 'buts') - O14, 'boom', .6], [at(14, 'finale') - O14, 'tada', .5]] }, O14);

// B015 — « La France perd quand même. » : le trophée s'envole (tiré par un fil hors champ), Kylian en larmes
B(15, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d) }),
  draw: (t, d, T) => { const Pe = at(15, 'perd'), up = seg(t, Pe, Pe + .7);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: mbStadium(t, { cols: ['#7d848c', '#9aa3ad', '#5a6070'] }), haze: .3 }]) + op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#1a2040', 0, 0)) +
      line(880, -100, 880, 790 - 700 * up, 4, '#fff') + mbTrophy(880, 1000 - 700 * up, .7, t) +
      mbP({ x: 330, y: 1490, s: 1.2, expr: t > Pe ? 'sob' : 'happy', armR: t > Pe ? [-60, -100] : [70, 80], armL: [110, 100] }, t) +
      kthin('la France', CX, 420, t, 0, { size: 60 }) + kword('PERD', CX, 560, t, Pe - .05, { size: 130, fill: '#ff6b6b' }) + kthin('quand même', CX, 690, t, at(15, 'quand') - .1, { size: 54 }); },
  sfx: [[0, 'whoosh', .3], [at(15, 'perd') - .05, 'thud', .7], [at(15, 'perd'), 'sting', .5], [at(15, 'quand'), 'whoosh_up', .4], [at(15, 'meme'), 'crickets', .3]] });

// B016 — « FRÈRE, IL FALLAIT QUE TU MARQUES COMBIEN ? DOUZE ? » : filet qui déborde de ballons, compteur qui s'emballe jusqu'à « 12 ? »
B(16, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .4, shake: t > at(16, '12') ? 6 : 2 }),
  draw: (t, d, T) => { const Fr = at(16, 'frere'), Co = at(16, 'combien'), D = at(16, '12'), cnt = t < Co ? 3 : Math.min(12, 3 + Math.floor((t - Co) / Math.max(.05, D - Co) * 9));
    let balls = ''; for (let i = 0; i < cnt; i++) balls += mbBall(560 + ((i * 97) % 440) - 220, 1200 - Math.floor(i / 5) * 60 - (i % 2) * 20, .85, i * 40);
    return rays(t, CX, 950, '#6f9bff', '#2f5fd8', 22) + mbGoal(CX, 1250, .9, 40 + cnt * 4) + balls +
      burst(800, 760, 250, t, D, '#ff5c5c', 14) + mbHead(190, 1000, 110, { expr: 'dizzy', tilt: -8 }, t) + sweat(280, 920 + (t * 40) % 20, 1) +
      kword('FRÈRE', CX, 420, t, Fr - .05, { size: 120, fill: '#fff' }) + kthin('il fallait que tu marques combien ?', CX, 560, t, at(16, 'fallait') - .1, { size: 46 }) +
      G(tr(800, 760, 1, 6), rect(-160, -80, 320, 160, '#14161c', 20, 7) + ftext(0, 44, (t > D ? '12 ?' : cnt + ''), { size: 110, fill: SX.acc2, stroke: 'none' })); },
  sfx: [[0, 'flash_hit', .4], [at(16, 'frere') - .05, 'boom', .6], [at(16, 'combien'), 'clock_fast', .4], [at(16, '12') - .05, 'boom', .6], [at(16, '12'), 'rimshot', .5]] });

// B017 — « Tu restes au PSG. » : salon parisien chic, Kylian dans un fauteuil « PARIS », tour Eiffel par la fenêtre
function mbParisRoom(t) { let s = dWall('diamond', '#1c2a5a', '#2b3a72', 1250) + G(tr(0, 0), rect(560, 260, 420, 520, '#8fc8ff', 14, 7) + mbEiffel(770, 780, .9, '#6a5a4a') + cloud(((t * 30) % 600) + 500, 360, .5) + rect(560, 260, 420, 520, 'none', 14, 7) + line(770, 260, 770, 780, 8) + line(560, 520, 980, 520, 8));
  s += dCurtain(530, 250, 90, 560, '#d8283a', t, 1) + dCurtain(930, 250, 90, 560, '#d8283a', t, -1) + dFrame(240, 380, 220, 170, 'mount', GOLD, -2) + dShelf(80, 700, 340, dTrophy(130, 700, 1) + dTrophy(220, 700, .8) + dBooks(270, 700, 140, 5));
  s += hangLamp(300, 140, t, .7) + dParquet(1250, '#b88a5a') + dRug(CX, 1330, 900, 160, '#d8283a', '#1c2a5a') + dPot(1010, 1290, 1.1, t, 1) + dLamp(80, 1250, 1, 1, t);
  return s; }
B(17, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Re = at(17, 'restes'), P = at(17, 'psg');
    const arm = G(tr(CX, 1300), rect(-330, -420, 660, 340, '#1c2a5a', 60, 7) + rect(-26, -420, 52, 340, '#d8283a', 0, 0) + ftext(0, -330, 'PARIS', { size: 50, fill: '#fff' }) + rect(-380, -200, 110, 260, '#1c2a5a', 40, 7) + rect(270, -200, 110, 260, '#1c2a5a', 40, 7) + rect(-290, -140, 580, 140, '#26346a', 30, 7));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: mbParisRoom(t), haze: .06 }, { z: 1, svg: arm + mbP({ x: CX, y: 1370, s: 1.1, kit: 'psg', expr: 'chill', armL: [160, 80], armR: [20, 100], legL: [60, 90], legR: [120, 90] }, t) }]) +
      kthin('tu restes', CX, 420, t, Re - .1, { size: 60 }) + funTag(CX, 545, 'AU PSG', t, P - .1, { size: 70, bg: '#d8283a', r: -4 }); },
  sfx: [[0, 'whoosh', .4], [at(17, 'restes'), 'thud', .4], [at(17, 'psg') - .1, 'pop', .6], [at(17, 'psg') + .1, 'hmm', .4]] });

// B018 — « On t'accuse de vouloir contrôler le club. » : Kylian manette en main, le club (mini-stade) téléguidé ; doigts accusateurs
B(18, { enter: 'none', trans: 'glitch', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ac = at(18, 'accuses'), Ct = at(18, 'controler'), Cl = at(18, 'club'), on = t > Ct;
    const pad = G(tr(0, 0), rect(-70, -34, 140, 68, '#2b2f3a', 30, 5) + circ(-36, 0, 12, '#5a6070', 3) + circ(36, -10, 9, FRED, 3) + circ(52, 8, 9, '#36a85a', 3));
    const finger = (x, y, r) => G(tr(x, y, 1, r), rect(-150, -40, 160, 80, '#e0b088', 36, 6) + rect(-10, -20, 150, 40, '#e0b088', 20, 6));
    return mbOffice(t, { sign: 'PRÉSIDENT', cur: '#1c2a5a' }) + WASH() + desk(CX, 1300, 1.3, '#6b3e26') +
      G(tr(780, 1060 + (on ? Math.sin(t * 10) * 14 : 0), .55, on ? Math.sin(t * 6) * 8 : 0), rect(-240, -90, 480, 180, '#3fa04a', 70, 7) + ell(0, -90, 240, 40, '#323c6a', 6) + ftext(0, 20, 'CLUB', { size: 64, fill: '#fff' }) + (on ? line(0, -130, 0, -230, 5) + circ(0, -240, 14, FRED, 4) : '')) +
      mbP({ x: 330, y: 1470, s: 1.1, kit: 'psg', expr: on ? 'smugger' : 'confused', armR: [-30, -20], armL: [150, -150], holdR: pad }, t) +
      (t > Ac ? finger(-200 + 300 * eOutBack(seg(t, Ac, Ac + .3)), 700, -8) + G(`translate(${W} 0) scale(-1 1)`, finger(-200 + 300 * eOutBack(seg(t, Ac + .1, Ac + .4)), 760, -8)) : '') +
      kthin("on t'accuse de vouloir", CX, 420, t, Ac - .15, { size: 54 }) + kword('CONTRÔLER LE CLUB', CX, 560, t, Ct - .05, { size: 78, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(18, 'accuses'), 'gasp', .5], [at(18, 'controler') - .05, 'boom', .5], [at(18, 'controler') + .1, 'zap', .4], [at(18, 'club'), 'buzz', .4]] });

// B019 — « Tu décides de partir au Real Madrid. » : aéroport, valise, panneau des départs qui claque « MADRID », maillot blanc
function mbAirport(t) { let s = grad('#bfe3ff', '#eaf6ff', -M, -M, W + 2 * M, 1250 + M) + cloud(((t * 40) % 1600) - 300, 300, .8);
  const pk = (t * .25) % 1; s += G(tr(lerp(-300, 1400, pk), lerp(760, 200, pk), .7, -18), ell(0, 0, 220, 46, '#fff', 6) + path('M-40 0L-120 -120L-60 -120L60 0Z', '#5b8fd8', 5) + path('M120 -20L200 -110L230 -110L190 -10Z', '#5b8fd8', 5));
  for (let i = 0; i < 6; i++) s += line(-60 + i * 240, 160, -60 + i * 240, 1250, 18, '#7d848c');
  s += rect(-M, 140, W + 2 * M, 30, '#7d848c', 0, 6) + rect(-M, 980, W + 2 * M, 280, '#d6dde6', 0, 6);
  for (let i = 0; i < 5; i++) s += G(tr(80 + i * 230, 1180), rect(-90, -110, 180, 90, '#5b8fd8', 20, 5) + rect(-90, -30, 180, 30, '#4a7ac8', 10, 5) + line(-70, 0, -70, 60, 8) + line(70, 0, 70, 60, 8));
  s += dTileFloor(1250, '#eef1f5', '#c9d3dc') + dPot(1010, 1300, 1, t, 2);
  return s; }
B(19, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const De = at(19, 'decides'), Pa = at(19, 'partir'), Md = at(19, 'madrid'), real = t > Md, wx = lerp(300, 420, seg(t, Pa, d));
    const board = G(tr(760, 800), rect(-250, -110, 500, 220, '#14161c', 16, 7) + ftext(-220, -50, 'DÉPARTS', { size: 34, fill: SX.acc2, stroke: 'none', anchor: 'start' }) +
      ftext(-220, 30, t > Md ? 'MADRID' : t > Pa ? scramble('MADRID', t, Pa, Md - Pa) : 'PARIS', { size: 64, fill: '#fff', stroke: 'none', anchor: 'start' }) + ftext(220, 30, '✈', { size: 54, fill: '#fff', stroke: 'none', anchor: 'end' }));
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: mbAirport(t), haze: .06 }, { z: 1, svg: board +
      mbP({ x: wx, y: 1490, s: 1.15, kit: real ? 'real' : 'psg', expr: real ? 'ecstatic' : 'smugger', walk: t, armR: [60, 80], holdR: G(tr(30, 120), rect(-70, -10, 140, 190, '#e2463a', 20, 6) + rect(-30, -40, 60, 34, 'none', 10, 6) + circ(-40, 190, 14, OL, 0) + circ(40, 190, 14, OL, 0)) }, t) + (real ? popStars(wx, 1250, t, Md, 8, 300) : '') }]) +
      kthin('tu décides de partir au', CX, 400, t, De - .1, { size: 52 }) + kword('REAL MADRID', CX, 560, t, Md - .05, { size: 100, fill: GOLD }); },
  sfx: [[0, 'whoosh', .4], [at(19, 'decides'), 'pop_hi', .4], [at(19, 'partir'), 'typing', .4], [at(19, 'madrid') - .05, 'boom', .5], [at(19, 'madrid'), 'tada', .5]] });

// B020 — « POLÉMIQUE ! » : rayons rouges, journaux qui tournoient en arrivant (plan concept)
const mbPaper = (x, y, s, r, head_) => G(tr(x, y, s, r), rect(-180, -120, 360, 240, '#f4f1ea', 6, 6) + ftext(0, -66, 'LE JOURNAL', { size: 26, fill: '#7d848c', stroke: 'none' }) + ftext(0, -6, head_, { size: 48, fill: FRED, stroke: 'none' }) + [0, 1, 2].map(i => line(-150, 40 + i * 28, 150, 40 + i * 28, 5, '#c9d3dc')).join(''));
B(20, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 7 }),
  draw: (t, d, T) => { const Po = at(20, 'polemique');
    const pp = [[260, 820, -12, 'TRAHISON ?'], [820, 760, 10, 'SCANDALE'], [300, 1120, 8, 'IL PART !'], [800, 1100, -8, 'POLÉMIQUE']].map(([x, y, r, h], i) => { const k = pop(t, Po + i * .06, .3); return k > 0 ? mbPaper(x, y, .9 * k, r + (1 - k) * 360, h) : ''; }).join('');
    return rays(t, CX, 900, '#ff6b6b', '#c92f3a', 24) + pp + mbHead(CX, 950, 120, { expr: 'shock', kit: 'real' }, t) + kword('POLÉMIQUE !', CX, 480, t, Po - .05, { size: 120, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .5], [at(20, 'polemique') - .05, 'boom', .7], [at(20, 'polemique'), 'whoosh', .5], [at(20, 'polemique') + .15, 'siren', .3]] });

// B021 — « Tu réclames des salaires et primes impayés. » : facture qui se déroule jusqu'au sol, le patron transpire
B(21, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Rc = at(21, 'reclames'), Sa = at(21, 'salaires'), Im = at(21, 'impayes'), L = 80 + 560 * eOutCubic(seg(t, Rc, Im + .3));
    const scroll = G(tr(520, 760), rect(-120, 0, 240, L, '#fff', 6, 6) + ftext(0, 50, 'FACTURE', { size: 36, fill: OL, stroke: 'none' }) + [...Array(Math.floor(L / 50))].map((_, i) => i ? ftext(-90, 60 + i * 50, '€€€', { size: 26, fill: '#36a85a', stroke: 'none', anchor: 'start' }) + ftext(90, 60 + i * 50, '…', { size: 26, fill: OL, stroke: 'none', anchor: 'end' }) : '').join('') + rect(-140, -20, 280, 40, '#c9935c', 16, 6));
    return mbOffice(t, { sign: 'PARIS', cur: '#1c2a5a' }) + WASH() +
      adult(0, { x: 840, y: 1300, s: .95, shirt: '#2f3b4e', hair: 'side', expr: t > Im ? 'panic' : 'worried', flip: 1, armR: [-60, -110] }, t) + desk(820, 1320, 1.0, '#6b3e26') +
      mbP({ x: 260, y: 1490, s: 1.15, kit: 'real', expr: t > Sa ? 'suspicious' : 'smugger', armR: [-20, -40], armL: [110, 100] }, t) + scroll +
      kthin('salaires et primes', CX, 420, t, Sa - .1, { size: 58 }) + kword('IMPAYÉS', CX, 560, t, Im - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(21, 'reclames'), 'printer', .5], [at(21, 'salaires'), 'pop_hi', .4], [at(21, 'impayes') - .05, 'boom', .5], [at(21, 'impayes') + .1, 'gulp', .5]] });

// B022 — « CONFLIT À PLUSIEURS DIZAINES DE MILLIONS D'EUROS ! » : tir à la corde sur un billet géant, compteur, pluie de billets
B(22, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .5, shake: t > at(22, 'millions') ? 5 : 2 }),
  draw: (t, d, T) => { const Cf = at(22, 'conflit'), Di = at(22, 'dizaines'), Mi = at(22, 'millions'), sw = Math.sin(t * 8) * 30, v = counter(0, 55, t, Di, Mi - Di + .2);
    const big = G(tr(CX + sw, 1080), rect(-260, -110, 520, 220, '#8fd18a', 16, 7) + circ(0, 0, 70, '#bfe8b5', 5) + ftext(0, 34, '€', { size: 100, fill: '#4b8f46', stroke: 'none' }));
    return mbOffice(t, { cur: '#36a85a' }) + WASH('rgba(255,255,255,.2)') + mbMoneyRain(t, Mi, 20) + big +
      mbP({ x: 180 + sw, y: 1490, s: 1.1, kit: 'real', expr: 'effort', rot: -10, armR: [-5, 0], armL: [5, 0] }, t) +
      adult(0, { x: 900 + sw, y: 1490, s: 1.1, shirt: '#2f3b4e', hair: 'side', expr: 'rage', flip: 1, rot: 10, armR: [-5, 0], armL: [5, 0] }, t) +
      kword('CONFLIT', CX, 420, t, Cf - .05, { size: 120, fill: '#ff6b6b' }) + (t > Di - .1 ? G(tr(CX, 640), rect(-330, -70, 660, 140, '#14161c', 24, 7) + ftext(0, 34, v + ' 000 000 €', { size: 76, fill: SX.acc2, stroke: 'none' })) : ''); },
  sfx: [[0, 'flash_hit', .5], [at(22, 'conflit') - .05, 'boom', .6], [at(22, 'dizaines'), 'clock_fast', .4], [at(22, 'millions'), 'kaching', .6], [at(22, 'euros'), 'coins', .5]] });

// B023 — « Ton nom circule dans une affaire en Suède. » : paysage enneigé neutre, son nom passe de téléphone en téléphone
B(23, { enter: 'none', trans: 'black', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const No = at(23, 'nom'), Ci = at(23, 'circule'), Su = at(23, 'suede'), k = (t - Ci) * .9;
    const tag = t > Ci ? G(tr(CX + Math.sin(k * 4) * 300, 760 + Math.sin(k * 8) * 60, 1, Math.sin(k * 6) * 10), rect(-190, -40, 380, 80, '#fff', 40, 6) + ftext(0, 16, 'KYLIAN MBAPPÉ', { size: 36, fill: OL, stroke: 'none' })) : '';
    const phs = [[150, 820, -10], [930, 820, 10], [CX, 620, 0]].map(([x, y, r]) => mbPhone(x, y, .7, r, rect(-66, -128, 132, 250, '#eef4ff', 0, 0) + [0, 1, 2].map(i => rect(-50, -90 + i * 60, 100, 36, '#c9d3dc', 10, 0)).join(''))).join('');
    return mbSnow(t) + WASH() + phs + tag + mbHead(CX, 1060, 100, { expr: t > Su ? 'worried' : 'neutral', kit: 'real' }, t) +
      kthin('ton nom circule…', CX, 420, t, No - .15, { size: 60 }) + funTag(CX, 545, 'SUÈDE', t, Su - .1, { size: 60, bg: '#5b8fd8', r: -3 }); },
  sfx: [[0, 'whoosh', .3], [at(23, 'nom'), 'vibrate', .4], [at(23, 'circule'), 'whoosh', .4], [at(23, 'affaire'), 'vibrate', .4], [at(23, 'suede') - .1, 'pop', .4]] });

// B024a — « L'enquête est finalement classée sans poursuites » : dossier fermé, tampon « CLASSÉ SANS SUITE » (sobre)
const O24 = at(24, 'sans', 2) - .15;
const mbFolder = (x, y, s, r = 0) => G(tr(x, y, s, r), path('M-220 -150L-80 -150L-50 -120L220 -120L220 160L-220 160Z', '#e8c98a', 7) + rect(-220, -100, 440, 260, '#f2d9a2', 10, 7) + rect(-140, -40, 280, 60, '#fff', 8, 4) + ftext(0, 2, 'DOSSIER', { size: 36, fill: OL, stroke: 'none' }));
B(24, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const En = at(24, 'enquete'), Cl = at(24, 'classee'), hy = Cl > t ? -200 + 120 * Math.sin(clamp((t - En) / (Cl - En)) * Math.PI * 3) : 0;
    return mbOffice(t, { wall: '#e9eef4', wall2: '#dde4ec', cur: '#7d848c' }) + WASH('rgba(255,255,255,.25)') + desk(CX, 1280, 1.5, '#8a5a3a') + mbFolder(CX, 940, 1.15) +
      G(tr(CX + 40, 760 + hy), rect(-40, -200, 80, 160, '#6b3e26', 20, 6) + rect(-90, -50, 180, 50, '#3a3f4a', 10, 6)) +
      kthin("l'enquête est finalement", CX, 420, t, En - .15, { size: 54 }) + stamp(CX, 960, 'CLASSÉ SANS SUITE', t, Cl - .05, FRED, -8, 60); },
  sfx: [[0, 'whoosh', .3], [at(24, 'enquete'), 'pop_hi', .3], [at(24, 'classee') - .05, 'thud', .8], [at(24, 'sans'), 'hammer', .5]] });
// B024b — « …sans que les autorités aient publiquement confirmé que tu étais visé. » : pupitre officiel, micros, « AUCUN COMMENTAIRE »
B(24, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Au = at(24, 'autorites') - O24, Pu = at(24, 'publiquement') - O24, Vi = at(24, 'vise') - O24;
    const pod = G(tr(CX, 1300), path('M-200 -300L200 -300L170 0L-170 0Z', '#3a4250', 7) + rect(-220, -330, 440, 40, '#5a6070', 10, 6) + rect(-140, -230, 280, 90, '#e9eef4', 10, 5) + ftext(0, -170, 'OFFICIEL', { size: 36, fill: OL, stroke: 'none' }) +
      [-1, 0, 1].map(i => line(i * 60, -330, i * 80, -440, 6) + ell(i * 80, -460, 18, 26, DPAL[i + 1], 5)).join(''));
    return mbPress(t, 'INFO', '#4a5568') + pod + (t > Pu ? chatBubble(CX, 760, 520, 130, 'AUCUN COMMENTAIRE', t, Pu, false, 40) : '') +
      mbHead(190, 1060, 95, { expr: t > Vi ? 'confused' : 'neutral', kit: 'real' }, t) + (t > Vi ? qmark(300, 920, .6, SX.acc2, 12) : '') +
      kthin('sans que les autorités', CX, 410, t, Au - .3, { size: 56 }) + kthin('aient confirmé que tu étais visé', CX, 500, t, Pu, { size: 46 }); },
  sfx: [[0, 'whoosh', .3], [at(24, 'autorites') - O24, 'pop_hi', .3], [at(24, 'publiquement') - O24, 'pop', .4], [at(24, 'vise') - O24, 'hmm', .4], [at(24, 'vise') - O24 + .3, 'crickets', .3]] }, O24);

// B025 — « Mais Internet a déjà rendu son verdict. » : foule de téléphones-JUGES (perruques), commentaires qui jugent, marteau émoji
B(25, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .4, shake: t > at(25, 'verdict') && t < at(25, 'verdict') + .3 ? 8 : 0 }),
  draw: (t, d, T) => { const In = at(25, 'internet'), Re = at(25, 'rendu'), Ve = at(25, 'verdict'), slam = t > Ve ? 0 : -50 * seg(t, Re, Ve);
    const judge = (x, y, s, r, i) => G(tr(x, y + Math.sin(t * 6 + i) * 10, s, r), mbWig(0, 0, 1) + phone(0, 0, 1, 0, '') + G(tr(0, -20), circ(-26, -10, 9, OL, 0) + circ(26, -10, 9, OL, 0) + path('M-40 -40L-12 -28M40 -40L12 -28', 'none', 6) + path('M-24 40Q0 24 24 40', 'none', 6)) + G(tr(70, 60, .5, slam - 20), mbGavel(0, 0, 1)));
    const coms = [['COUPABLE !', 210, 640, -6], ['on sait tous', 820, 600, 5], ['#JUSTICE', 230, 1180, 4], ['source : tkt', 840, 1190, -5]].map(([s, x, y, r], i) => t > In + .2 + i * .25 ? chatBubble(x, y, s.length * 24 + 80, 90, s, t, In + .2 + i * .25, false, 34) : '').join('');
    return gridBg('#1e2340') + halftoneFade('#fff', .05, 1) + [[150, 900, .9, -8], [400, 860, 1.0, 4], [680, 870, 1.0, -4], [930, 900, .9, 8]].map((p, i) => judge(...p, i)).join('') + coms +
      kthin('mais internet a déjà rendu', CX, 400, t, In - .15, { size: 52 }) + kword('SON VERDICT', CX, 520, t, Ve - .05, { size: 104, fill: SX.acc2 }) + mbFlash(t, Ve, .5); },
  sfx: [[0, 'flash_hit', .4], [at(25, 'internet'), 'typing', .5], [at(25, 'deja'), 'pop', .4], [at(25, 'verdict') - .05, 'hammer', .8], [at(25, 'verdict'), 'boom', .5]] });

// B026 — « Et en octobre 2026… » : ciel d'orage, calendrier géant qui s'arrache jusqu'à OCTOBRE 2026, tonnerre
B(26, { enter: 'none', trans: 'black', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(26, '2026') && t < at(26, '2026') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const Oc = at(26, 'octobre'), Y = at(26, '2026');
    const sky = grad('#2b2f4a', '#4a5070', -M, -M, W + 2 * M, H + 2 * M) + cloud(((t * 30) % 1400) - 300, 260, 1.4, '#6a7090') + cloud(((t * 20 + 700) % 1400) - 300, 400, 1.1, '#5a6080') + (Math.sin(t * 9) > .9 || (t > Y && t < Y + .2) ? lightning(800, 120, 1.2) + op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0)) : '');
    return sky + rect(-M, 1250, W + 2 * M, 700, '#2a2f45', 0, 0) +
      card(CX, 930, 340, 380, mbCal(0, 0, 1.1, t > Oc ? 'OCT.' : 'SEPT.', t > Y ? '2026' : '…', ''), t, .05, { ry: 0, thick: 10, r: -3, bw: 6 }) +
      kthin('et en', CX, 420, t, 0, { size: 60 }) + kword('OCTOBRE 2026', CX, 560, t, Y - .05, { size: 100, fill: '#fff' }); },
  sfx: [[0, 'wind', .4], [at(26, 'octobre'), 'whoosh', .4], [at(26, '2026') - .05, 'thunder', .7], [at(26, '2026') + .1, 'sting', .4]] });

// B027a — « Tu plaisantes sur un montage de ton visage avec Mao Zedong. » : Kylian rit sur son canapé, téléphone = montage PIXELISÉ « MONTAGE »
const O27 = at(27, 'boum') - .15;
const mbPixel = (w, h, t) => { const r = rng(21); let s = ''; const n = 7; for (let j = 0; j < n + 2; j++) for (let i = 0; i < n; i++) s += rect(-w / 2 + i * w / n, -h / 2 + j * h / (n + 2), w / n + 1, h / (n + 2) + 1, ['#c98a5e', '#8a6a5a', '#5a4a4a', '#e0b088', '#3a3f4a', '#9a7a6a'][Math.floor(r() * 6)], 0, 0); return s; };
B(27, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pl = at(27, 'plaisantes'), Mo = at(27, 'montage'), Vi = at(27, 'visage');
    const screen = mbPixel(132, 250, t) + rect(-66, -10, 132, 50, 'rgba(20,20,30,.75)', 0, 0) + ftext(0, 24, 'MONTAGE', { size: 26, fill: '#fff', stroke: 'none' });
    return salonF(t, { noSofa: false }) + WASH() + mbP({ x: 330, y: 1400, s: 1.05, kit: 'hoodie', expr: t > Pl ? 'laugh' : 'happy', armR: [-60, -60], armL: [110, 100], legL: [60, 90], legR: [120, 90] }, t) +
      card(760, 880, 300, 520, mbPhone(0, 0, 1.55, 0, screen), t, Mo - .2, { ry: 0, thick: 10, r: 5, bw: 6 }) + (t > Pl ? mbLol(500, 760 + Math.sin(t * 12) * 8, .9, -10) : '') +
      kthin('tu plaisantes sur un', CX, 400, t, Pl - .15, { size: 56 }) + funTag(CX, 520, 'MONTAGE', t, Mo - .1, { size: 60, bg: '#7d848c', r: -3 }) + markerText('flouté', 560, 1170, t, Vi, { size: 50 }); },
  sfx: [[0, 'whoosh', .4], [at(27, 'plaisantes'), 'boing', .4], [at(27, 'montage') - .2, 'pop', .5], [at(27, 'visage'), 'scratch', .4], [at(27, 'zedong'), 'tick', .5]] });
// B027b — « BOUM ! » : explosion cartoon, flash, le téléphone vole
B(27, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.05, 1.12, t / d), shake: 12 }),
  draw: (t, d, T) => { const Bo = at(27, 'boum') - O27;
    return rays(t, CX, 900, '#ffd23f', '#ff7a1a', 26) + burst(CX, 900, 470, t, Bo - .05, '#ff5c3a', 16) + burst(CX, 900, 330, t, Bo, '#ffd23f', 14) +
      mbHead(CX, 960, 130, { expr: 'shock', kit: 'hoodie' }, t) + kword('BOUM !', CX, 470, t, Bo - .05, { size: 160, fill: '#fff' }); },
  sfx: [[at(27, 'boum') - O27 - .05, 'boom', .9], [at(27, 'boum') - O27, 'flash_hit', .6], [at(27, 'boum') - O27 + .05, 'crack', .5]] }, O27);

// B028 — « Des sponsors chinois rompent leurs contrats. » : hommes d'affaires génériques qui déchirent des contrats
B(28, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Sp = at(28, 'sponsors'), Ro = at(28, 'rompent'), tear = eOutCubic(seg(t, Ro, Ro + .4));
    const suit = (x, i, fl) => adult(i, { x, y: 1480, s: 1.0, shirt: '#2f3443', pants: '#2f3443', hair: ['side', 'short', 'bald'][i % 3], hairColor: '#1f1a18', skin: SK[[0, 4, 2][i % 3]], expr: t > Ro ? 'angry' : 'suspicious', flip: fl, armR: [-70, -90], armL: [-110, -90], glasses: i === 1 }, t);
    return mbOffice(t, { wall: '#e6e8ee', wall2: '#d9dce4', cur: '#5a6070' }) + WASH() + suit(200, 0, 0) + suit(CX, 1, 0) + suit(880, 2, 1) +
      [200, CX, 880].map((x, i) => mbContract(x, 790, .7, tear, 'CONTRAT', (i - 1) * 6)).join('') + (t > Ro ? popStars(CX, 790, t, Ro, 8, 300) : '') +
      funTag(CX, 420, 'SPONSORS', t, Sp - .1, { size: 64, bg: '#7d848c', r: -3 }) + kword('CONTRATS ROMPUS', CX, 570, t, Ro - .05, { size: 80, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(28, 'sponsors') - .1, 'pop', .5], [at(28, 'rompent'), 'snip', .6], [at(28, 'rompent') + .1, 'scratch', .5], [at(28, 'contrat'), 'thud', .4]] });

// B029 — « Tu présentes tes excuses. » : conférence de presse, Kylian s'incline, carton « DÉSOLÉ », flashes
B(29, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Ex = at(29, 'excuses'), bow = seg(t, Ex - .2, Ex + .2);
    return mbPress(t, 'PRESSE', '#2f3443') + mbP({ x: CX, y: 1430, s: 1.1, kit: 'casual', rot: 18 * bow, expr: 'embarrassed', armL: [100, 80], armR: [80, 100] }, t) + mbTable(1300, '#f4f4f4', 5, t) +
      G(tr(CX, 1240), rect(-170, -50, 340, 90, '#fff', 12, 6) + ftext(0, 14, 'DÉSOLÉ', { size: 50, fill: FBLUE, stroke: 'none' })) +
      kthin('tu présentes tes', CX, 420, t, 0, { size: 60 }) + kword('EXCUSES', CX, 560, t, Ex - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'shutter', .5], [.2, 'shutter', .4], [at(29, 'excuses') - .05, 'pop', .5], [at(29, 'excuses') + .1, 'shutter', .5]] });

// B030 — « Même des diffusions de matchs sont suspendues en Chine. » : salon, grande télé, le match devient « SIGNAL SUSPENDU »
B(30, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Di = at(30, 'diffusions'), Su = at(30, 'suspendues'), off = t > Su;
    const inner = off ? mbBars(700, 400) + ftext(0, 130, 'SIGNAL SUSPENDU', { size: 44, fill: '#fff', stroke: 'none' }) : mbMiniMatch(700, 400, t);
    return salonF(t, { noSofa: true }) + WASH() + mbTV(CX, 760, 700, 400, (off ? glitch(inner, T, .6) : inner)) + sofa(CX, 1420, 1.1, '#5b8fd8') +
      adult(1, { x: 330, y: 1460, s: .95, expr: off ? 'jawdrop' : 'happy', armL: off ? [-140, -110] : [110, 100] }, t) + adult(4, { x: 750, y: 1460, s: .95, expr: off ? 'sob' : 'joy', flip: 1 }, t) +
      kthin('même des diffusions de matchs', CX, 400, t, Di - .2, { size: 50 }) + (t > Su ? kword('SUSPENDUES', CX, 640, t, Su - .05, { size: 90, fill: '#ff6b6b' }) : ''); },
  sfx: [[0, 'whoosh', .3], [at(30, 'diffusions'), 'whistle', .4], [at(30, 'suspendues') - .05, 'error_beep', .6], [at(30, 'suspendues'), 'buzz', .5], [at(30, 'chine'), 'gasp', .5]] });

// B031 — « T'AS FAIT UNE BLAGUE ET C'EST LA LIGA QUI PREND CHER ! » : une enclume « BLAGUE » écrase la mascotte-ballon « LA LIGA »
B(31, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4, shake: t > at(31, 'cher') && t < at(31, 'cher') + .4 ? 10 : 2 }),
  draw: (t, d, T) => { const Bl = at(31, 'blague'), Li = at(31, 'liga'), Ch = at(31, 'cher'), fall = seg(t, Ch - .35, Ch), sq = t > Ch ? .55 + .1 * Math.sin(t * 20) * Math.max(0, 1 - (t - Ch) * 2) : 1;
    const masc = G(tr(760, 1260), G(`scale(${f1(2 - sq)} ${f1(sq)})`, G(tr(0, -150), circ(0, 0, 150, '#fff', 7) + path('M0 -50L48 -14L30 42L-30 42L-48 -14Z', OL, 0) +
      (t > Ch ? path('M-70 -40L-30 -10M-30 -40L-70 -10M30 -40L70 -10M70 -40L30 -10', 'none', 8) : circ(-50, -30, 12, OL, 0) + circ(50, -30, 12, OL, 0)) + path(t > Ch ? 'M-40 80Q0 50 40 80' : 'M-40 60Q0 90 40 60', 'none', 7) +
      path('M-150 30L150 -40L150 0L-150 70Z', '#ff5c3a', 6) + ftext(0, 30, 'LA LIGA', { size: 40, fill: '#fff', stroke: OL, sw: 5 }).replace('<text', '<text transform="rotate(-13)"'))));
    const anvil = G(tr(760, lerp(-300, 1260 - 300 * sq, eInOut(fall))), path('M-170 -120L170 -120L130 -40L80 -40L110 40L-110 40L-80 -40L-130 -40Z', '#4a4f5a', 7) + ftext(0, -66, 'BLAGUE', { size: 40, fill: '#fff' }));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: mbStadium(t, { night: false }), haze: .25 }]) + masc + (t > Ch - .4 ? anvil : '') + (t > Ch ? burst(760, 1060, 200, t, Ch, '#ffd23f', 14) + popStars(760, 1100, t, Ch, 8, 300) : '') +
      mbP({ x: 230, y: 1490, s: 1.05, kit: 'real', expr: t > Ch ? 'embarrassed' : 'laugh', armR: t > Ch ? [-130, -150] : [70, 80] }, t) +
      kthin("t'as fait une blague…", CX, 400, t, at(31, 'fait') - .2, { size: 56 }) + kword('LA LIGA', CX, 530, t, Li - .05, { size: 110, fill: '#ff8a5c' }) + kword('PREND CHER !', CX, 660, t, Ch - .05, { size: 96, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .4], [at(31, 'blague'), 'boing', .5], [at(31, 'liga') - .05, 'boom', .5], [at(31, 'cher') - .35, 'whoosh', .5], [at(31, 'cher'), 'thud', .9], [at(31, 'cher') + .05, 'boing', .5]] });

// B032 — « Et dans ta vie privée ? » : porte d'entrée de la villa, Kylian en sweat referme doucement… trou de serrure
function mbHome(t) { let s = SKY(t, '#ffb88a', '#ffe3c8') + dBuilding(-60, 1250, 300, 900, '#f4ead8', 3, t) + dBuilding(840, 1250, 320, 860, '#f4ead8', 5, t) + rect(250, 360, 590, 900, '#f9f1e2', 0, 7);
  s += rect(380, 560, 330, 690, '#6b3e26', 20, 7) + rect(410, 600, 120, 280, '#7d4a2e', 10, 5) + rect(560, 600, 120, 280, '#7d4a2e', 10, 5) + rect(410, 920, 270, 280, '#7d4a2e', 10, 5) + circ(680, 900, 16, GOLD, 4) + ftext(545, 520, 'VILLA', { size: 40, fill: '#6b3e26', stroke: 'none' });
  s += dLamp(320, 700, .6, 1, t) + dPot(300, 1250, 1.1, t, 1) + dPot(790, 1250, 1.1, t, 0) + dBush(120, 1250, 1.1) + dBush(980, 1250, 1.2) + dLampPost(1000, 1250, .8, 1);
  s += rect(-M, 1250, W + 2 * M, 700, '#c9c2b5', 0, 0) + line(-M, 1250, W + M, 1250, 6);
  return s; }
B(32, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pr = at(32, 'privee');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: mbHome(t), haze: .05 }, { z: 1, svg: mbP({ x: 830, y: 1490, s: 1.1, kit: 'hoodie', expr: 'calm', flip: 1, armL: [-160, -120] }, t) }]) +
      kthin('et dans ta', CX, 420, t, 0, { size: 60 }) + kword('VIE PRIVÉE ?', CX, 560, t, Pr - .15, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(32, 'vie'), 'steps', .4], [at(32, 'privee'), 'pop_hi', .4]] });

// B033 — « Tu veux manger au restaurant ? » : restaurant, l'assiette arrive, Kylian se frotte les mains
B(33, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Re = at(33, 'restaurant'), plate = eOutBack(seg(t, Re - .2, Re + .2));
    return restoT(t) + mbP({ x: 330, y: 1480, s: 1.1, kit: 'casual', expr: 'ecstatic', armR: [-30, -60], armL: [-150, -120] }, t) +
      G(tr(560, 1320), rect(-300, -20, 600, 40, '#fff', 10, 6) + rect(-280, 20, 560, 200, '#f2e6d0', 0, 6)) + (plate > 0 ? G(tr(620, 1270, plate), ell(0, 0, 130, 34, '#fff', 6) + ell(0, -16, 80, 30, '#c9763e', 5) + circ(-30, -34, 14, '#36a85a', 4) + steam(0, -60, t, .8)) : '') +
      adult(2, { x: 870, y: 1480, s: 1.0, shirt: '#fff', apron: '#2b2f3a', hair: 'bald', expr: 'happy', flip: 1, armR: [-40, -10] }, t) +
      kthin('tu veux manger au', CX, 420, t, 0, { size: 58 }) + funTag(CX, 545, 'RESTAURANT ?', t, Re - .1, { size: 64, bg: '#ff9a4d', r: -3 }); },
  sfx: [[0, 'whoosh', .4], [at(33, 'manger'), 'chomp', .4], [at(33, 'restaurant') - .1, 'ding', .5], [at(33, 'restaurant') + .1, 'pop', .4]] });

// B034 — « Des téléphones apparaissent. » : des téléphones surgissent de partout (plantes, soupe, sous la table, serveur)
B(34, { enter: 'none', cam: (t, d) => ({ z: lerp(1.08, 1.14, t / d), hand: .5 }),
  draw: (t, d, T) => { const Te = at(34, 'telephones'), Ap = at(34, 'apparaissent');
    const pos = [[120, 1080, -14], [960, 1060, 12], [620, 1180, 0], [300, 760, -8], [820, 720, 10], [540, 650, 4], [100, 600, -6], [990, 560, 8], [700, 960, -10]];
    const phs = pos.map(([x, y, r], i) => { const t0 = Te + i * ((Ap + .5 - Te) / pos.length), k = pop(t, t0, .25); return k > 0 ? mbPhone(x, y + (1 - k) * 200, .55 * k, r, rect(-66, -128, 132, 250, '#9fd0ff', 0, 0) + circ(0, -10, 34, 'none', 5, '#fff') + (Math.sin(t * 9 + i * 2) > .7 ? op(.9, rect(-66, -128, 132, 250, '#fff', 0, 0)) : '')) : ''; }).join('');
    return restoT(t) + WASH() + mbP({ x: 330, y: 1480, s: 1.1, kit: 'casual', expr: t > Te ? 'jawdrop' : 'ecstatic', armR: [-30, -60], armL: [-150, -120] }, t) +
      G(tr(560, 1320), rect(-300, -20, 600, 40, '#fff', 10, 6) + rect(-280, 20, 560, 200, '#f2e6d0', 0, 6)) + phs +
      kword('DES TÉLÉPHONES', CX, 440, t, Te - .05, { size: 92, fill: '#fff' }); },
  sfx: [[at(34, 'telephones') - .05, 'boom', .4], [at(34, 'telephones'), 'pop', .5], [at(34, 'telephones') + .2, 'shutter', .5], [at(34, 'apparaissent'), 'pop_hi', .5], [at(34, 'apparaissent') + .3, 'shutter', .6]] });

// B035 — « Tu veux sortir avec des amis ? » : rue le soir, Kylian en sweat avec ses potes (dont Kevin), insouciants
B(35, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const So = at(35, 'sortir'), Am = at(35, 'amis');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: streetT(t, 2) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, '#3a2a6a', 0, 0)), haze: .05 },
      { z: 1, svg: kevin({ x: 820, y: 1480, s: 1.05, expr: 'laugh', flip: 1, walk: t }, t) + mbP({ x: CX, y: 1490, s: 1.1, kit: 'hoodie', expr: 'happy', walk: t }, t) + kid(3, { x: 230, y: 1480, s: 1.05, expr: 'joy', walk: t, age: 'adult', skin: SK[0], shirt: '#5ec4f0', hair: 'curly', hairColor: '#6b3e26' }, t) },
      { z: .6, svg: blur(10, dLampPost(1040, 1950, 1.4, 1)) }]) +
      kthin('tu veux sortir', CX, 420, t, So - .2, { size: 60 }) + funTag(CX, 545, 'AVEC DES AMIS ?', t, Am - .1, { size: 56, bg: '#36a85a', r: -3 }); },
  sfx: [[0, 'whoosh', .3], [at(35, 'sortir'), 'steps', .5], [at(35, 'amis') - .1, 'pop', .5], [at(35, 'amis') + .1, 'chirp', .3]] });

// B036 — « Des photos circulent. » : paparazzi dans les buissons, flashes, posts « VU ! » qui fusent
B(36, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .5 }),
  draw: (t, d, T) => { const Ph = at(36, 'photos'), Ci = at(36, 'circulent');
    const posts = [[200, 700, -10], [860, 660, 10], [CX, 560, 0]].map(([x, y, r], i) => { const k = pop(t, Ci + i * .1, .25); return k > 0 ? G(tr(x + Math.sin(t * 3 + i) * 30, y, k * .9, r), rect(-150, -110, 300, 220, '#fff', 16, 6) + rect(-130, -90, 260, 140, '#3a2a6a', 8, 0) + circ(-40, -30, 26, MB_SKIN, 4) + circ(30, -30, 26, '#ffcf9a', 4) + ftext(0, 86, 'VU !', { size: 40, fill: FRED, stroke: 'none' })) : ''; }).join('');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2) + op(.4, rect(-M, -M, W + 2 * M, H + 2 * M, '#3a2a6a', 0, 0)), haze: .1 }, { z: 1, svg: mbP({ x: CX, y: 1490, s: 1.05, kit: 'hoodie', expr: 'shock', armL: [-140, -110], armR: [-40, -70] }, t) +
      mbPap(1, { x: 140, y: 1480, s: .95 }, t, Math.sin(t * 9) > .5 ? 1 : 0) + mbPap(4, { x: 940, y: 1480, s: .95, flip: 1 }, t, Math.sin(t * 9 + 2) > .5 ? 1 : 0) + dBush(140, 1470, 1.4) + dBush(940, 1470, 1.4, '#4fa84f') }]) + posts +
      kword('PHOTOS', CX, 430, t, Ph - .05, { size: 110, fill: '#fff' }); },
  sfx: [[0, 'shutter', .5], [at(36, 'photos') - .05, 'flash_hit', .4], [at(36, 'photos'), 'shutter', .6], [at(36, 'circulent'), 'whoosh', .5], [at(36, 'circulent') + .2, 'vibrate', .4]] });

// B037 — « Tu rates un penalty ? » : le ballon passe au-dessus de la barre… et file dans le ciel
B(37, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Ra = at(37, 'rates'), Pe = at(37, 'penalti'), k = seg(t, Ra - .1, Pe + .3);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: mbStadium(t), haze: .12 }]) + mbGoal(CX, 1180, .9) +
      mbBall(lerp(CX - 200, CX + 160, k), lerp(1400, 200, eOutCubic(k)), lerp(1, .4, k), t * 800) +
      mbP({ x: 260, y: 1490, s: 1.15, expr: t > Pe ? 'terror' : 'effort', armL: t > Pe ? [-120, -160] : [150, 120], armR: t > Pe ? [-60, -20] : [40, 60] }, t) +
      kthin('tu rates un', CX, 400, t, Ra - .15, { size: 58 }) + kword('PENALTY ?', 700, 560, t, Pe - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whistle', .5], [at(37, 'rates') - .1, 'whoosh_up', .6], [at(37, 'penalti') - .05, 'boom', .4], [at(37, 'penalti') + .2, 'gasp', .6]] });

// B038 — « Soixante millions de sélectionneurs t'expliquent ton métier. » : stade… de CANAPÉS, chacun donne son avis
B(38, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const S60 = at(38, '60'), Se = at(38, 'selectionneurs'), Ex = at(38, 'expliquent'), v = counter(0, 60, t, S60, Se - S60 + .2);
    let rows = grad('#0b1640', '#26388a', -M, -M, W + 2 * M, H + 2 * M) + [70, 1010].map(x => line(x, 420, x, 120, 14, '#3a4250') + rect(x - 85, 40, 170, 104, '#3a4250', 14, 6) + op(.3, glow(x, 92, 300, '#fffbe0', .8))).join('');
    [[760, .42, 7], [960, .58, 5], [1200, .78, 4]].forEach(([yb, s, n], r) => { for (let i = 0; i < n; i++) { const x = (i + .5) * W / n, c = DPAL[(i + r * 3) % 8];
      rows += adult(i + r, { x, y: yb - 40 * s, s: s * .9, expr: ['rage', 'angry', 'mock', 'annoyed'][(i + r) % 4], armR: [-60 + Math.sin(t * 8 + i) * 20, -100], flip: i % 2 }, t + i) + sofa(x, yb, s * .85, c); } });
    const bubbles = [['À GAUCHE !', 260, 640, -6], ['MOI J\'AURAIS MARQUÉ', 760, 600, 5], ['FRAPPE !', 200, 900, 4]].map(([s, x, y, r], i) => t > Ex + i * .2 ? chatBubble(x, y, s.length * 22 + 70, 84, s, t, Ex + i * .2, false, 32) : '').join('');
    return rows + bubbles + G(tr(CX, 440), rect(-370, -80, 740, 160, '#14161c', 24, 7) + ftext(0, 40, v + ' 000 000', { size: 96, fill: SX.acc2, stroke: 'none' })) + kthin('de sélectionneurs', CX, 1150, t, Se - .1, { size: 60 }); },
  sfx: [[0, 'flash_hit', .4], [at(38, '60'), 'clock_fast', .4], [at(38, 'selectionneurs'), 'boom', .5], [at(38, 'expliquent'), 'chirp', .4], [at(38, 'metier'), 'whistle', .5]] });

// B039 — « Tu peux t'acheter pratiquement tout ce que tu veux. » : boutique de luxe, sacs, voiture de sport, montre, château miniature
B(39, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ac = at(39, 'acheter'), To = at(39, 'tout');
    let shop = grad('#fff3d6', '#ffe0a8', -M, -M, W + 2 * M, 1250 + M) + dNeon(CX, 230, 'LUXE', '#ff5c8a', t, 66) + [0, 1, 2].map(i => G(tr(200 + i * 340, 700), rect(-130, -160, 260, 320, 'rgba(255,255,255,.6)', 16, 6) + [dTrophy(0, 100, 1.2), G(tr(0, 60), circ(0, 0, 60, GOLD, 6) + circ(0, 0, 44, '#fff', 4) + line(0, 0, 0, -30, 5) + line(0, 0, 22, 0, 5)), G(tr(0, 120), path('M-100 0L-100 -120L-60 -120L-60 -80L-20 -80L-20 -160L20 -160L20 -80L60 -80L60 -120L100 -120L100 0Z', '#c9d3dc', 6))][i] + op(.5, sparkle(90, -120, .5 + .2 * Math.sin(t * 6 + i), '#fff')))).join('');
    shop += dTileFloor(1250, '#fff', '#e8d8b8') + dCar(800, 1320, 1.0, FRED, 1);
    return shop + mbP({ x: 300, y: 1490, s: 1.15, kit: 'casual', glasses: true, expr: 'cool', armR: [60, 80], armL: [120, 100], holdR: dBag(0, 160, .8, '#ff5c8a'), holdL: dBag(0, 160, .8, GOLD) }, t) + mbMoneyRain(t, Ac, 7, 9) +
      kthin("tu peux t'acheter", CX, 420, t, Ac - .3, { size: 58 }) + kword('TOUT', CX, 560, t, To - .05, { size: 140, fill: SX.acc2 }) + markerText('(ou presque)', 760, 1000, t, at(39, 'veux'), { size: 50 }); },
  sfx: [[0, 'whoosh', .3], [at(39, 'acheter'), 'kaching', .6], [at(39, 'tout') - .05, 'boom', .4], [at(39, 'tout'), 'sparkle', .4], [at(39, 'veux'), 'scratch', .4]] });

// B040 — « Mais il y a une chose que ton argent ne peut pas te rendre. » : villa de nuit, Kylian seul tend ses billets vers une vitrine VIDE « ??? »
B(40, { enter: 'none', trans: 'black', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d) }),
  draw: (t, d, T) => { const Ch = at(40, 'chose'), Ar = at(40, 'argent'), Re = at(40, 'rendre');
    const room = bedroomN(t) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, '#101430', 0, 0)) + op(.25, path('M760 300L560 1250L1000 1250Z', '#fff6c8', 0));
    const vitrine = G(tr(780, 900), rect(-150, -220, 300, 380, 'rgba(200,230,255,.35)', 12, 7) + rect(-170, 160, 340, 90, '#3a3f4a', 8, 7) + (t > Ch ? ftext(0, 20, '???', { size: 80, fill: '#fff' }) : '') + op(.6, path('M-110 -180L-60 -180L-140 60Z', '#fff', 0)));
    return room + vitrine + (t > Ch ? op(.4 + .2 * Math.sin(t * 3), glow(780, 900, 300, '#fff6c8', .7)) : '') +
      mbP({ x: 300, y: 1490, s: 1.15, kit: 'casual', expr: t > Re ? 'sad' : 'worried', armR: t > Ar ? [-10, -10] : [70, 80], holdR: t > Ar ? G(tr(40, 0), bill(0, 0, .9, -10) + bill(14, -14, .9, 8)) : '' }, t) +
      kthin('mais il y a une', CX, 400, t, 0, { size: 56 }) + kword('CHOSE', CX, 520, t, Ch - .05, { size: 100, fill: '#fff' }) + kthin("que l'argent ne peut pas rendre", CX, 640, t, Ar - .1, { size: 46 }); },
  sfx: [[0, 'whoosh', .3], [at(40, 'chose') - .05, 'sting', .4], [at(40, 'argent'), 'coins', .4], [at(40, 'rendre'), 'heartbeat', .5]] });

// B041 — « LE DROIT D'ÊTRE UN MEC NORMAL. » : parc au coucher du soleil, Kylian joue au foot avec des gamins, sans téléphones — ÉTOILES (3/3)
B(41, { enter: 'none', trans: 'circle', transD: .25, flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Dr = at(41, 'droit'), Me = at(41, 'mec'), No = at(41, 'normal'), bx = CX + Math.sin(t * 3) * 260;
    const park = SKY(t, '#ffb36b', '#ffe8c8') + op(.6, circ(CX, 760, 160, '#fff1b0', 0)) + dSkyline(1020, '#e8b48a', 7) + rect(-M, 1020, W + 2 * M, 1000, '#5fb85f', 0, 0) + tree(90, 1060, .9, t) + tree(990, 1050, 1, t) + dBench(820, 1100, .6) + dBirds(t, 3, 300, 4) + mbGoal(170, 1150, .35) + dFlowers(300, 1100, 6, 3, t);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: park, haze: .04 }]) + unlock(CX, 950, t, Me, { part: 'back', r: 470 }) +
      kid(1, { x: 870, y: 1480, s: 1.0, expr: 'joy', flip: 1, armL: [-150, -120] }, t) + kid(4, { x: 180, y: 1480, s: .95, expr: 'happy' }, t) +
      mbP({ x: CX, y: 1490, s: 1.1, kit: 'hoodie', expr: 'ecstatic', walk: t }, t) + mbBall(bx, 1440, .9, t * 400) + unlock(CX, 950, t, Me, { part: 'front', r: 470 }) +
      kthin("le droit d'être", CX, 400, t, Dr - .1, { size: 62 }) + kword('UN MEC NORMAL', CX, 540, t, Me - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(41, 'droit'), 'angel', .4], [at(41, 'mec') - .05, 'boom', .5], [at(41, 'mec'), 'sparkle', .5], [at(41, 'normal'), 'chirp', .4]] });

// B042 — « Parce qu'au fond… » : gros plan pensif, coucher de soleil, lent zoom
B(42, { enter: 'none', trans: 'black', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const Fo = at(42, 'fond');
    return SKY(t, '#ff9a6b', '#ffd9a8') + op(.7, circ(CX, 1150, 260, '#fff1b0', 0)) + dSkyline(1250, '#c9705a', 9) + mbHead(CX, 900, 200, { expr: 'calm', kit: 'hoodie', look: [-1, -.4] }, t) +
      kthin("parce qu'au fond…", CX, 450, t, Fo - .3, { size: 66 }); },
  sfx: [[0, 'whoosh', .3], [at(42, 'fond'), 'heartbeat', .5]] });

// B043a — « TU ES DEVENU TELLEMENT CÉLÈBRE » : des dizaines de téléphones encerclent Kylian, flashes en rafale
const O43 = at(43, 'que') - .15;
B(43, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .5 }),
  draw: (t, d, T) => { const De = at(43, 'devenu'), Ce = at(43, 'celebre');
    let ring = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + t * .3, k = pop(t, i * .06, .3); if (k <= 0) continue; ring += mbPhone(CX + Math.cos(a) * 420, 900 + Math.sin(a) * 380, .5 * k, Math.cos(a) * 20, rect(-66, -128, 132, 250, '#9fd0ff', 0, 0) + (Math.sin(t * 10 + i * 1.9) > .6 ? rect(-66, -128, 132, 250, '#fff', 0, 0) : circ(0, 0, 30, 'none', 5, '#fff'))); }
    return rays(t, CX, 900, '#3b5fd8', '#1f2f80', 24) + ring + mbP({ x: CX, y: 1430, s: 1.1, kit: 'fra', expr: 'panic', armL: [-140, -110], armR: [-40, -70] }, t) +
      kthin('tu es devenu', CX, 400, t, De - .15, { size: 60 }) + kword('TELLEMENT CÉLÈBRE', CX, 530, t, Ce - .1, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [.1, 'shutter', .5], [at(43, 'devenu'), 'shutter', .5], [at(43, 'celebre') - .1, 'boom', .6], [at(43, 'celebre') + .2, 'shutter', .6]] });
// B043b — FIN : « …QUE MÊME TA VIE NE T'APPARTIENT PLUS COMPLÈTEMENT. » : la boule « MA VIE » lui échappe, attrapée par des mains-téléphones… dernier flash
B(43, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Vi = at(43, 'vie') - O43, Ap = at(43, 'appartient') - O43, Co = at(43, 'completement') - O43, k = eOutCubic(seg(t, Vi, Ap + .4));
    const orb = G(tr(lerp(CX, 760, k), lerp(900, 920, k), 1 + .04 * Math.sin(t * 6)), op(.5, glow(0, 0, 200, '#fff6c8', .9)) + circ(0, 0, 110, '#ffd9e6', 7) + heart(0, -20, 1.1) + ftext(0, 66, 'MA VIE', { size: 38, fill: OL, stroke: '#fff', sw: 6 }));
    const hands = [[1200, 800, -12], [1200, 930, 0], [1200, 1060, 12]].map(([x, y, r], i) => { const kk = eOutBack(seg(t, Ap - .3 + i * .1, Ap + .1 + i * .1)); return G(tr(x + 300 * (1 - kk), y, 1, 180 + r), rect(0, -40, 260, 80, '#e0b088', 36, 6) + mbPhone(300, 0, .45, 90, rect(-66, -128, 132, 250, '#9fd0ff', 0, 0))); }).join('');
    return SKY(t, '#ffb36b', '#ffe8c8') + dSkyline(1250, '#c9a08a', 3) + rect(-M, 1250, W + 2 * M, 700, '#9a8a7a', 0, 0) + orb + (t > Ap ? hands : '') +
      mbP({ x: 280, y: 1490, s: 1.15, kit: 'hoodie', expr: t > Ap ? 'sob' : 'worried', armR: [-30, -20], armL: [110, 100] }, t) +
      kthin('même ta vie', CX, 400, t, Vi - .2, { size: 62 }) + kword("NE T'APPARTIENT PLUS", CX, 530, t, Ap - .05, { size: 76, fill: '#fff' }) + kword('COMPLÈTEMENT.', CX, 650, t, Co - .05, { size: 80, fill: SX.acc2 }) + mbFlash(t, Co + .4, .8); },
  sfx: [[0, 'whoosh', .3], [at(43, 'vie') - O43, 'magic', .4], [at(43, 'appartient') - O43, 'whoosh', .5], [at(43, 'completement') - O43 - .05, 'boom', .5], [at(43, 'completement') - O43 + .4, 'shutter', .7]] }, O43);

SCENES.sort((a, b) => a.s - b.s);
