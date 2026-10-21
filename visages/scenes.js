// ============================================================
//  « Pourquoi c'est horrible de ne jamais reconnaître les visages ? » (prosopagnosie) — format SIZEX fun — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Sujet sensible : on rit des situations (quiproquos, gens vexés), jamais du héros. Gag central : du point de vue
//  du héros, les visages des autres sont des ŒUFS lisses / flous / « ? » ; il se repère aux indices (coiffure, voix, veste).
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

// ---------- SIZEX fun : accent BRIQUE « enquête », jaune marqueur, bleu ciel ----------
sxFun('#c2452d'); SX.acc2 = '#ffd23f'; SX.cool = '#6fc3ff';

// ============================================================
//  VISAGES-ŒUFS : eg(o, mode) arme un drapeau dans hairFn (appelé avant sourcils/yeux/bouche) ;
//  browsSvg / eyesSvg / mouthSvg sont enveloppés : mode 'egg' = visage lisse (reflet), 'blur' = traits flous,
//  'q' = gros « ? », 'scribble' = gribouillis. Sueur, vapeur, larmes restent (l'émotion passe quand même).
// ============================================================
let _EGG = null, _EGB = '';
const _browsB = browsSvg, _eyesB = eyesSvg, _mouthB = mouthSvg;
browsSvg = function (type, r, lx, ly) { if (!_EGG) return _browsB(type, r, lx, ly); if (_EGG === 'blur') _EGB += _browsB(type, r, lx, ly); return ''; };
eyesSvg = function (type, r, t, lx, ly, seed) { if (!_EGG) return _eyesB(type, r, t, lx, ly, seed); if (_EGG === 'blur') _EGB += _eyesB(type, r, t, lx, ly, seed); return ''; };
mouthSvg = function (type, r, t, lx, ly) {
  const m = _EGG; _EGG = null; if (!m) return _mouthB(type, r, t, lx, ly);
  let s = '';
  if (m === 'blur') { s = blur(r * .16, _EGB + _mouthB(type, r, t, lx, ly)); _EGB = ''; }
  else if (m === 'q') s = ftext(0, r * .32, '?', { size: r * 1.0, fill: '#fff' });
  else if (m === 'scribble') { let d = `M${-r * .6} ${-r * .2}`; for (let i = 0; i < 9; i++) d += `L${f1((i % 2 ? -.55 : .6) * r)} ${f1(-r * .25 + i * r * .08 + Math.sin(t * 9 + i) * r * .03)}`; s = path(d, 'none', r * .07, OL); }
  else s = op(.6, ell(-r * .36, -r * .44, r * .22, r * .11, '#fff', 0)) + op(.35, ell(-r * .12, -r * .58, r * .06, r * .04, '#fff', 0));
  return s;
};
const eg = (o = {}, m = 'egg') => Object.assign({ glasses: false }, o, { cheeks: m === 'egg' ? false : o.cheeks,
  hairFn: (r, t, oo) => { _EGG = m; _EGB = ''; return hairSvg(oo.hair || 'short', oo.hairColor || '#4a3428', r, t); } });
const kevE = (o, t, m = 'egg') => kevin(eg(Object.assign({ freckles: false }, o), m), t);
const kevBald = (o, t, m = 'egg') => kevE(Object.assign({ hair: 'bald', hairColor: '#e8b48a', shirt: '#9aa3ad' }, o), t, m);

// ============================================================
//  LE HÉROS : enquêteur malgré lui — casquette de détective à carreaux (toujours), loupe + carnet « INDICES »
// ============================================================
const HERO_SHIRT = '#5b8fd8', HERO_HAIR = '#5a3a26';
const heroHair = (r, t, o) => { const [b, f] = hairSvg('short', o.hairColor || HERO_HAIR, r, t);
  const cap = path(`M${-r * .94} ${-r * .34}Q${-r * .9} ${-r * 1.18} 0 ${-r * 1.16}Q${r * .9} ${-r * 1.18} ${r * .94} ${-r * .34}Q0 ${-r * .62} ${-r * .94} ${-r * .34}Z`, '#c9925a', 6) +
    path(`M${-r * .5} ${-r * .48}Q${-r * .44} ${-r * .9} ${-r * .3} ${-r * 1.08}M${r * .5} ${-r * .48}Q${r * .44} ${-r * .9} ${r * .3} ${-r * 1.08}M0 ${-r * .52}L0 ${-r * 1.14}M${-r * .82} ${-r * .62}Q0 ${-r * .86} ${r * .82} ${-r * .62}M${-r * .6} ${-r * .94}Q0 ${-r * 1.06} ${r * .6} ${-r * .94}`, 'none', 4, '#8a5a3a') +
    ell(0, -r * .4, r * .5, r * .11, '#a8743f', 5) + circ(0, -r * 1.16, r * .08, '#8a5a3a', 4);
  return [b, f + cap]; };
const heroP = (o, t) => person(Object.assign({ age: 'kid', hairFn: heroHair, shirt: HERO_SHIRT, pants: '#3b3f4a', seed: 2 }, o), t);
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: heroHair, seed: 2 }, o), t));
const loupe = (s = .55, r = 0) => G(`rotate(${r}) scale(-1 1)`, magnifier(-150 * s, -150 * s, s)); // verre en haut à DROITE de la main (ne cache pas le visage)
// carnet « INDICES » (cases cochées k = nombre d'indices cochés)
function vgNote(x, y, s, r, k = 0, items = ['VOIX', 'COIFFURE', 'VESTE', 'DÉMARCHE'], t = 0, strike = -1) {
  let g = rect(-110, -150, 220, 300, '#fffbe8', 10, 6) + rect(-110, -150, 220, 54, '#c2452d', 10, 6) + ftext(0, -112, 'INDICES', { size: 30, fill: '#fff', stroke: 'none' });
  for (let i = 0; i < 6; i++) g += circ(-80 + i * 32, -150, 9, '#9aa3ad', 4);
  items.forEach((it, i) => { const y = -60 + i * 52; g += rect(-92, y - 18, 30, 30, '#fff', 5, 4) + ftext(14, y + 8, it, { size: 24, fill: OL, stroke: 'none' });
    if (i < k) g += path(`M${-88} ${y - 2}L${-78} ${y + 10}L${-56} ${y - 26}`, 'none', 7, '#36a85a');
    if (i === strike) g += line(-96, y - 4, 96, y - 2, 7, '#e2463a'); });
  return G(tr(x, y, s, r), g); }
// post-it « BONJOUR je m'appelle » collé sur le front
const vgBadge = (x, y, str, s = 1, col = '#e2463a', r = -4) => G(tr(x, y, s, r), rect(-110, -62, 220, 124, '#fff', 12, 6) + rect(-110, -62, 220, 42, col, 12, 0) + rect(-110, -62, 220, 124, 'none', 12, 6) +
  ftext(0, -32, 'BONJOUR', { size: 22, fill: '#fff', stroke: 'none' }) + ftext(0, 36, str, { size: 40, fill: OL, stroke: 'none' }));
// ondes sonores (indice « voix »)
const vgWaves = (x, y, t, s = 1, c = SX.cool) => G(tr(x, y, s), [0, 1, 2].map(i => op(1 - ((t * 2 + i / 3) % 1), path(`M${20 + ((t * 2 + i / 3) % 1) * 90} -60Q${60 + ((t * 2 + i / 3) % 1) * 90} 0 ${20 + ((t * 2 + i / 3) % 1) * 90} 60`, 'none', 9, c))).join(''));
const DIM = (k = .3, c = '#141838') => op(k, rect(-M, -M, W + 2 * M, H + 2 * M, c, 0, 0));
const vgUncle = (o, t, m = 'blur') => adult(0, eg(Object.assign({ shirt: '#8a6ad8', pants: '#3b3f4a', glasses: false }, o), m), t);
const vgGirl = (o, t, m = 'egg') => kid(3, eg(Object.assign({ shirt: '#ff8fb1' }, o), m), t);           // l'amie depuis 4 ans (queue de cheval)
const vgLea = (o, t, m = 'egg') => kid(5, eg(Object.assign({ shirt: '#7be07b' }, o), m), t);           // cheveux longs → nouvelle coupe
// polaroïd souvenir
const vgPola = (x, y, s, r, inner, t, t0) => { const k = popEl(t, t0, .4); return k <= 0 ? '' : G(tr(x, y, s * k, r), rect(-110, -130, 220, 260, '#fff', 6, 6) + clipR(-92, -112, 184, 184, rect(-92, -112, 184, 184, '#bfe3ff', 0, 0) + inner, 4) + rect(-92, -112, 184, 184, 'none', 4, 4)); };
const vgCrown = (x, y, s = 1) => G(tr(x, y, s), path('M-70 0L-80 -80L-40 -40L0 -100L40 -40L80 -80L70 0Z', '#ffd23f', 6) + circ(0, -100, 10, '#e2463a', 4) + circ(-80, -80, 9, '#5ec4f0', 4) + circ(80, -80, 9, '#5ec4f0', 4) + rect(-70, -14, 140, 18, '#e8b923', 4, 5));
// moniteur (système d'identification)
function vgMonitor(x, y, s, t, inner) { return G(tr(x, y, s), rect(-330, -230, 660, 430, '#3a3f4a', 26, 7) + rect(-300, -200, 600, 370, '#10233a', 10, 0) + inner + rect(-40, 200, 80, 70, '#3a3f4a', 0, 6) + rect(-160, 266, 320, 28, '#3a3f4a', 12, 6) + circ(290, 186, 8, Math.sin(t * 6) > 0 ? '#e2463a' : '#5a2020', 0)); }
// cerveau-personnage (détective)
function vgBrain(x, y, s, t, o = {}) { const w = Math.sin(t * 3) * 4;
  let g = path('M-170 40Q-200 -60 -130 -110Q-110 -170 -30 -160Q20 -200 90 -160Q170 -150 180 -70Q220 10 160 70Q130 120 50 110Q0 140 -60 110Q-150 110 -170 40Z', '#ff9ec0', 7) +
    path('M-120 -60Q-80 -90 -50 -50Q-20 -100 30 -70M40 -120Q70 -80 110 -100M-140 20Q-90 0 -70 40Q-30 10 10 40Q50 0 100 30M60 -30Q100 -50 140 -20', 'none', 6, '#e06a95') +
    _eyesB(o.eyes || 'dot', 160, t, 0, 0, 1) + _mouthB(o.mouth || 'wavy', 160, t, 0, 0) + G(tr(0, -150), path('M-120 10Q-110 -90 0 -90Q110 -90 120 10Q0 -20 -120 10Z', '#c9925a', 6) + ell(0, 6, 80, 16, '#a8743f', 5));
  return G(tr(x, y + w, s), g); }
function vgDrawer(x, y, label, col, inner, open = 0) { return G(tr(x, y), rect(-170, -70, 340, 140, '#9aa3ad', 10, 6) + rect(-150 , -50, 300, 100, col, 8, 5) + rect(-60, -10, 120, 24, '#fff', 6, 4) + ftext(0, -20, label, { size: 30, fill: OL, stroke: 'none' }) + (open ? G(tr(0, 120 * open), rect(-160, -60, 320, 120, '#c9d3dc', 8, 6) + inner) : '')); }

// ---------- décors propres à l'épisode ----------
// salle de bain : carrelage, fenêtre + rideaux, miroir à ampoules, lavabo, verre à dents, canard, étagère, serviette, tapis
function vgBath(t) { const yb = 1250; let s = rect(-M, -M, W + 2 * M, yb + M, '#dff1f7', 0, 0);
  for (let y = -60; y < yb; y += 80) s += line(-M, y, W + M, y, 3, '#c3e1ea'); for (let x = -M; x < W + M; x += 80) s += line(x, -M, x, yb, 3, '#c3e1ea');
  s += rect(-M, 880, W + 2 * M, 12, '#9cc7d6', 0, 0);
  s += dWindowView(60, 240, 220, 280, t) + dCurtain(30, 220, 70, 340, '#7fd0c0', t, 1) + dCurtain(250, 220, 70, 340, '#7fd0c0', t, -1);
  s += G(tr(640, 560), rect(-220, -250, 440, 500, '#9aa3ad', 30, 7) + grad('#eaf8ff', '#bfe0ef', -196, -226, 392, 452) + rect(-196, -226, 392, 452, 'none', 20, 5) + op(.5, path('M-150 -180L-60 -220M-170 -110L10 -200', 'none', 12, '#fff')));
  s += [-160, -55, 55, 160].map(x => circ(640 + x, 282, 18, Math.sin(t * 5 + x) > -.7 ? '#fff6a0' : '#e8d890', 4)).join('');
  s += G(tr(640, 1010), rect(-260, 0, 520, 240, '#f4f1ea', 10, 6) + ell(0, 0, 280, 40, '#fff', 6) + ell(0, 0, 200, 24, '#cfe8f0', 4) + rect(-12, -90, 24, 80, '#9aa3ad', 8, 4) + path('M-12 -90Q40 -110 60 -70', 'none', 12, '#9aa3ad') + rect(-220, 60, 200, 160, '#e8e3d8', 8, 4) + rect(20, 60, 200, 160, '#e8e3d8', 8, 4) + circ(-40, 140, 8, OL, 0) + circ(40, 140, 8, OL, 0));
  s += dMug(420, 1000, .9, t, '#ff8fb1') + G(tr(410, 940, 1, -10), rect(-5, -60, 10, 70, '#5b8fd8', 4, 3)) + dJar(860, 1000, '#7be07b', .9) +
    G(tr(510, 995), ell(0, 0, 36, 26, '#ffd23f', 5) + circ(26, -26, 20, '#ffd23f', 5) + path('M42 -28L62 -24L42 -18Z', '#ff9a4d', 4) + circ(32, -32, 4, OL, 0));
  s += dShelf(880, 620, 180, dJar(910, 620, '#ffd23f', .7) + dJar(970, 620, '#ff8fb1', .8) + dPot(1030, 620, .35, t, 2));
  s += line(900, 720, 1060, 720, 10, '#9aa3ad') + path(`M920 720L1040 720L${1030 + Math.sin(t * 2) * 4} 940Q980 960 ${930 + Math.sin(t * 2) * 4} 940Z`, '#ffb03a', 5) + line(930, 900, 1032, 900, 6, '#fff');
  s += dOutlet(330, 950) + wallClock(160, 700, 44, t) + dTileFloor(yb, '#eef6f8', '#d6e8ee') + dRug(640, 1420, 520, 120, '#7fd0c0', '#fff') + dBin(150, 1350, .8, '#ff8fb1') + dPot(1010, 1340, .9, t, 1);
  return s; }
// salon de coiffure : mur rayé rose, enseigne barbier qui tourne, 2 miroirs à ampoules, affiche COUPE 15€, horloge, étagère de flacons, casque séchoir
function vgCoiffeur(t) { const yb = 1250; let s = dWall('stripe', '#ffe6ee', '#ffd6e3', yb) + rect(-M, 980, W + 2 * M, yb - 980, '#f5c6d4', 0, 0) + line(-M, 980, W + M, 980, 6, '#e09ab0');
  const off = (t * 80) % 80; let st = ''; for (let i = 0; i < 8; i++) st += path(`M-40 ${f1(-280 + i * 80 + off)}L40 ${f1(-320 + i * 80 + off)}L40 ${f1(-290 + i * 80 + off)}L-40 ${f1(-250 + i * 80 + off)}Z`, '#e2463a', 0);
  s += G(tr(70, 600), rect(-34, -200, 68, 400, '#fff', 30, 6) + clipR(-30, -196, 60, 392, st, 26) + rect(-34, -200, 68, 400, 'none', 30, 6) + circ(0, -215, 28, '#c9d3dc', 5) + circ(0, 215, 28, '#c9d3dc', 5));
  for (const mx of [360, 780]) s += G(tr(mx, 560), rect(-150, -200, 300, 400, '#fff', 20, 6) + grad('#eaf8ff', '#c8e4f2', -130, -180, 260, 360) + op(.5, path('M-90 -140L-20 -170M-110 -80L20 -150', 'none', 10, '#fff')) + [-110, -55, 0, 55, 110].map(x => circ(x, -218, 14, Math.sin(t * 6 + x) > -.5 ? '#fff6a0' : '#e8d890', 4)).join(''));
  s += dPoster(570, 300, 140, 180, '#fff', 3, ftext(0, -40, 'COUPE', { size: 28, fill: SX.acc, stroke: 'none' }) + ftext(0, 14, '15€', { size: 52, fill: OL, stroke: 'none' }) + G(tr(0, 62, 1, 90), path('M-30 -8L30 8M-30 8L30 -8', 'none', 6) + circ(-36, -10, 10, 'none', 5) + circ(-36, 10, 10, 'none', 5)), t);
  s += wallClock(570, 130, 40, t) + dShelf(220, 820, 640, dJar(270, 820, '#ff8fb1', .8) + dJar(330, 820, '#7be07b', .7) + dJar(560, 820, '#ffd23f', .8) + dJar(760, 820, '#5ec4f0', .7) + dPot(830, 820, .4, t, 2));
  s += G(tr(990, 1010), rect(-12, 0, 24, 240, '#9aa3ad', 4, 4) + path('M-110 0Q-110 -150 0 -150Q110 -150 110 0Z', '#c38ad8', 6) + ell(0, 0, 110, 24, '#a86ac0', 5));
  s += dTileFloor(yb, '#f4f1ea', '#d8cfc0') + hairPile(170, 1340, .45, '#2b2420') + dPot(1020, 1340, 1, t, 0) + dBin(90, 1420, .7, '#ff8fb1');
  return s; }
// fauteuil de coiffeur
const vgChair = (x, yb, s = 1) => G(tr(x, yb, s), rect(-20, -150, 40, 150, '#9aa3ad', 6, 5) + ell(0, -4, 110, 18, '#7d848c', 5) + rect(-140, -250, 280, 100, '#e2463a', 30, 6) + rect(-120, -440, 240, 200, '#e2463a', 40, 6) + rect(-170, -260, 50, 30, '#7d848c', 10, 5) + rect(120, -260, 50, 30, '#7d848c', 10, 5));
// tapis rouge + cordons (fantasme « star »)
function vgCarpet(t) { let s = hallway(t) + DIM(.25, '#2a0a20') + path('M380 1250L700 1250L1000 1920L80 1920Z', '#d6334a', 6);
  for (const x of [250, 830]) s += G(tr(x, 1250), rect(-12, -130, 24, 130, '#e8b923', 6, 4) + circ(0, -140, 20, '#e8b923', 4));
  s += path('M250 1150Q540 1210 830 1150', 'none', 14, '#a01a3a');
  for (let i = 0; i < 4; i++) { const on = Math.sin(t * 9 + i * 2.3) > .6; s += on ? op(.8, G(tr(120 + i * 280, 760 + (i % 2) * 120), path('M0 -60L14 -14L60 0L14 14L0 60L-14 14L-60 0L-14 -14Z', '#fff', 0))) : ''; }
  return s; }

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001 — SIGNATURE : grille encre, le héros-détective en cut-out avec sa loupe, visages-œufs « ? » qui flottent, débloqué sur VISAGES
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'visages');
    const eggs = [[170, 820, 0], [910, 800, 1], [200, 1130, 4], [890, 1120, 2]].map(([x, y, i], j) => G(tr(x, y + Math.sin(t * 3 + j) * 14, popEl(t, .2 + j * .25, .4)), cutout(head(eg({ hr: 70, hair: KH[i], hairColor: KC[i], skin: SK[i], seed: 30 + i }, j % 2 ? 'q' : 'egg'), t), 6))).join('');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) + eggs +
      G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.25, expr: t > K ? 'jawdrop' : 'confused', look: [-.6, -.3], armR: [-70, -100], holdR: loupe(.6, -10) }, t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1030, 330, 330, t, K + .15, { label: 'visages.png' }) +
      kthin("POURQUOI C'EST HORRIBLE", CX, 330, t, .05, { size: 46 }) + kthin('DE NE JAMAIS RECONNAÎTRE', CX, 410, t, at(1, 'jamais') - .1, { size: 46 }) +
      kword('LES VISAGES ?', CX, 535, t, K - .05, { size: 80, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [at(1, 'jamais') - .1, 'pop_hi', .4], [.45, 'boing', .3], [at(1, 'visages') - .05, 'boom', .6], [at(1, 'visages'), 'sparkle', .5]] });

// B002a — « Tu arrives au lycée » : papier + gobo, le héros en cut-out arrive en glissant, étiquette LYCÉE
const O2 = at(2, 'un') - .15;
B(2, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => paper(SX.paper) + gobo(T, .12) + burst(CX, 980, 300, t, .05, '#ffe1b8', 16) +
    cutout(G(tr(800, 1240), rect(-200, -330, 400, 330, '#f2d7a8', 6, 6) + path('M-230 -330L0 -440L230 -330Z', '#d9534f', 6) + [-120, 0, 120].map(x => rect(x - 40, -280, 80, 80, '#bfe3ff', 6, 5)).join('') + rect(-50, -130, 100, 130, '#8a5a3a', 6, 5) + ftext(0, -365, 'LYCÉE', { size: 34, fill: '#fff' })), 10) +
    cutout(heroP({ x: lerp(-100, 330, eOutBack(clamp(t / .5))), y: 1450, s: 1.25, expr: 'happy', armR: [-40, -70], holdR: vgNote(0, -60, .4, -10, 0, ['VOIX', 'COIFFURE', 'VESTE', 'DÉMARCHE']) }, t), 10) + motionLines(150, 1150, 3, 70, 180) +
    funTag(CX, 520, 'LYCÉE', t, at(2, 'lycee') - .1, { size: 80, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'whoosh', .5], [.1, 'steps', .4], [at(2, 'lycee') - .1, 'pop', .6], [at(2, 'lycee'), 'school_bell', .25]] });
// B002b — « un homme te sourit. Salut ! » : un homme en cut-out… visage FLOU, sourire flou, bulle « Salut ! »
B(2, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Sa = at(2, 'salut') - O2;
    return paper('#fdeee0') + gobo(T, .1) + cutout(heroP({ x: 280, y: 1450, s: 1.25, expr: 'neutral', look: [1, -.3] }, t), 10) +
      cutout(vgUncle({ x: 770, y: 1460, s: 1.15, expr: 'happy', flip: 1, armR: t > Sa ? [-80, -110] : [70, 80] }, t), 10) +
      funTag(770, 560, 'UN HOMME', t, at(2, 'homme') - O2 - .05, { size: 48, bg: SX.acc, fg: '#fff' }) + markerCircle(770, 990, 120, 120, t, at(2, 'sourit') - O2, { col: SX.acc2 }) +
      chatBubble(560, 700, 230, 100, 'Salut !', t, Sa - .05, false, 48); },
  sfx: [[at(2, 'homme') - O2 - .05, 'pop_hi', .5], [at(2, 'sourit') - O2, 'scratch', .4], [at(2, 'salut') - O2 - .05, 'pop', .6], [at(2, 'salut') - O2 + .1, 'hmm', .3]] }, O2);

// B003 — « Tu souris en retour » : cour du lycée, gros sourire forcé du héros (dents serrées), ✨
B(3, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.12, t / d), hand: .3 }),
  draw: (t, d, T) => { const Sr = at(3, 'souris');
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.4, svg: schoolyard(t), haze: .2 }, { z: 1, svg: heroHead(CX, 900, 220, { expr: t > Sr ? 'happy' : 'neutral', face: t > Sr ? { mouth: 'teeth', brows: 'up' } : {}, look: [.5, 0] }, t) + (t > Sr ? sweat(CX + 230, 760, 1.2) : '') }]) +
      (t > Sr ? sparkle(CX - 120, 1040, .8) + sparkle(CX + 140, 1060, .6) : '') + funTag(CX, 470, 'SOURIRE AUTO', t, Sr - .05, { size: 56, bg: SX.acc2, fg: SX.ink }) + markerText('(ok… c\'est qui ?)', 760, 600, t, Sr + .3, { size: 40 }); },
  sfx: [[0, 'whoosh', .4], [at(3, 'souris') - .05, 'pop', .5], [at(3, 'souris'), 'glint', .6], [at(3, 'retour'), 'hmm', .3]] });

// B004 — « Salut, monsieur. » : cour, le héros salue poliment l'homme flou (vouvoiement…)
B(4, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Mo = at(4, 'monsieur');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: schoolyard(t), haze: .08 },
      { z: 1, svg: heroP({ x: 320, y: 1490, s: 1.3, expr: 'happy', look: [1, 0], armR: [-60 + Math.sin(t * 14) * 20, -100] }, t) + vgUncle({ x: 790, y: 1490, s: 1.15, expr: 'happy', flip: 1 }, t) },
      { z: .6, svg: blur(10, dBush(80, 1900, 1.5)) }]) +
      chatBubble(330, 720, 330, 100, 'Salut, monsieur !', t, at(4, 'salut') - .05, true, 42) + funTag(790, 480, 'MONSIEUR ?', t, Mo, { size: 52, bg: SX.acc, fg: '#fff', r: 5 }); },
  sfx: [[at(4, 'salut') - .05, 'pop_hi', .5], [at(4, 'salut'), 'whoosh', .3], [at(4, 'monsieur'), 'pop', .6], [at(4, 'monsieur') + .3, 'squeak', .4]] });

// B005 — « Il te fixe. » : crash zoom sur la tête floue qui fixe… grillons
B(5, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.14, eOutCubic(clamp(t / .4))), hand: .2 }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: schoolyard(t), haze: .3 }, { z: 1, svg: G(tr(CX, 900), head(eg({ hr: 230, hair: 'side', hairColor: AC[0], skin: SK[2], expr: 'deadpan', seed: 10 }, 'blur'), t)) }]) +
    speedLines(t, CX, 900, 26, 'rgba(255,255,255,.5)') + kword('MALAISE', CX, 470, t, at(5, 'fixe') - .1, { size: 100, fill: '#fff' }) + funTag(CX, 1190, 'IL TE FIXE', t, at(5, 'fixe'), { size: 46, bg: SX.ink, fg: '#fff' }),
  sfx: [[0, 'whoosh', .5], [at(5, 'fixe') - .1, 'sting', .4], [at(5, 'fixe'), 'crickets', .5]] });

// B006 — « Je suis ton oncle. » : FLASH, tampon TONTON sur l'homme flou, le héros mâchoire au sol
B(6, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 6 }),
  draw: (t, d, T) => { const On = at(6, 'oncle');
    return schoolyard(t) + WASH() + heroP({ x: 300, y: 1490, s: 1.3, expr: t > On ? 'jawdrop' : 'shock', look: [1, 0] }, t) + vgUncle({ x: 790, y: 1490, s: 1.15, expr: 'annoyed', flip: 1, armL: [200, 250] }, t) +
      kword('TON ONCLE.', CX, 470, t, at(6, 'ton') - .05, { size: 96, fill: SX.acc2 }) + stamp(790, 760, 'TONTON', t, On, SX.acc, 10, 60) + (t > On ? emark(150, 820, .7) : ''); },
  sfx: [[0, 'flash_hit', .5], [at(6, 'ton') - .05, 'boom', .6], [at(6, 'oncle'), 'thud', .7], [at(6, 'oncle') + .05, 'gasp', .5]] });

// B007 — « Ah ! Bonjour, tonton. » : câlin gêné, cœurs du tonton, sueur
B(7, { enter: 'whip', cam: camHand(1.06, .5),
  draw: (t, d, T) => { const Bj = at(7, 'bonjour');
    return schoolyard(t) + WASH() + vgUncle({ x: 680, y: 1490, s: 1.15, expr: 'happy', flip: 1, armL: [200, 160], armR: [-20, 30] }, t) +
      heroP({ x: 420, y: 1490, s: 1.3, expr: 'embarrassed', look: [1, 0], armR: [-10, 20], armL: [200, 220] }, t) + sweatSpray(420, 990, t, 4) + (t > Bj ? heartsUp(t, 700, 950, 4) : '') +
      funTag(330, 470, 'AH !', t, at(7, 'ah') - .05, { size: 80, bg: SX.acc, fg: '#fff' }) + chatBubble(360, 700, 340, 100, 'Bonjour, tonton !', t, Bj - .05, true, 40); },
  sfx: [[at(7, 'ah') - .05, 'boing', .6], [at(7, 'bonjour') - .05, 'pop', .5], [at(7, 'tonton'), 'kiss', .4], [at(7, 'tonton') + .2, 'squeak', .3]] });

// B008 — « Bienvenue dans la vie de quelqu'un qui a une prosopagnosie » : paillasson BIENVENUE, débloqué en étoiles
B(8, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const P = at(8, 'prosopagnosie');
    return paper('#fdeee0') + gobo(T, .1) + unlock(CX, 980, t, P, { part: 'back', r: 470 }) + G(tr(CX, 1300), rect(-330, -40, 660, 120, '#c58e55', 30, 7) + ftext(-205, 42, 'BIEN', { size: 60, fill: '#7a4a2a', stroke: 'none' }) + ftext(205, 42, 'VENUE', { size: 60, fill: '#7a4a2a', stroke: 'none' })) +
      cutout(heroP({ x: CX, y: 1290, s: 1.3, expr: t > P ? 'wow' : 'happy', armL: [200, 230], armR: [-30, -70], holdR: loupe(.6, -10) }, t), 12) + unlock(CX, 980, t, P, { part: 'front', r: 470 }) +
      kthin('bienvenue dans la vie de', CX, 400, t, at(8, 'bienvenue') - .1, { size: 52 }) + kthin("quelqu'un qui a une", CX, 480, t, at(8, 'quelqu') - .1, { size: 52 }) + kword('PROSOPAGNOSIE', CX, 610, t, P - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'magic', .5], [at(8, 'bienvenue'), 'pop_hi', .4], [at(8, 'quelqu'), 'pop_hi', .4], [at(8, 'prosopagnosie') - .05, 'tada', .6], [at(8, 'prosopagnosie'), 'sparkle', .5]] });

// B009a — « un trouble qui rend… » : carte de définition (card) qui pivote, mot TROUBLE
const O9 = at(9, 'la') - .1;
B(9, { enter: 'none', trans: 'zoom', transD: .22, cam: zin(1.02, 1.08),
  draw: (t, d, T) => paper('#fdeee0') + gobo(T, .1) + card(CX, 860, 720, 440, ftext(0, -110, 'PROSOPAGNOSIE (n.f.)', { size: 44, fill: SX.acc, stroke: 'none' }) + line(-300, -70, 300, -70, 5, '#e8d8c0') +
      ftext(0, 0, 'du grec prosôpon = visage', { size: 36, fill: OL, stroke: 'none' }) + ftext(0, 60, 'et agnôsia = ne pas reconnaître', { size: 36, fill: OL, stroke: 'none' }) + G(tr(0, 150), [-150, 0, 150].map((x, i) => G(tr(x, 0), head(eg({ hr: 44, hair: KH[i + 1], hairColor: KC[i + 1], skin: SK[i], seed: 40 + i }, 'q'), t))).join('')), t, .05, { thick: 12, r: -3, bw: 6 }) +
    funTag(CX, 470, 'UN TROUBLE', t, at(9, 'trouble') - .1, { size: 64, bg: SX.acc, fg: '#fff' }),
  sfx: [[0, 'whoosh', .5], [.05, 'flutter', .4], [at(9, 'trouble') - .1, 'pop', .6], [at(9, 'rend'), 'tick', .4]] });
// B009b — « …la reconnaissance des visages difficile » : couloir du lycée, viseur SCAN sur des têtes-œufs → ÉCHEC
B(9, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Df = at(9, 'difficile') - O9, sx = lerp(260, 820, seg(t, .1, Df - .1));
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: hallway(t), haze: .08 },
      { z: 1, svg: kid(0, eg({ x: 260, y: 1470, s: 1.15, expr: 'happy' }), t) + kid(4, eg({ x: 540, y: 1470, s: 1.15, expr: 'talk', flip: 1 }), t + 1) + kid(2, eg({ x: 820, y: 1470, s: 1.15, expr: 'happy', flip: 1 }), t + 2) }]) +
      funBox(sx, 1130, 240, 240, t, .1, { label: 'scan…', col: SX.cool }) + ftext(sx, 960, Math.floor(t * 8) % 2 ? '???' : '...', { size: 40, fill: '#fff' }) +
      kthin('reconnaissance des visages', CX, 430, t, at(9, 'reconnaissance') - O9 - .1, { size: 54 }) + stamp(CX, 640, 'DIFFICILE', t, Df - .05, SX.acc, -8, 76); },
  sfx: [[0, 'whoosh', .4], [.1, 'typing', .4], [at(9, 'reconnaissance') - O9, 'scratch', .3], [at(9, 'difficile') - O9 - .05, 'error_beep', .6], [at(9, 'difficile') - O9, 'thud', .5]] }, O9);

// B010 — « Parfois même ceux de personnes très proches » : salon familial, papa et maman en têtes-œufs, le héros à la loupe
B(10, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pr = at(10, 'proches');
    return salonF(t) + adult(4, eg({ x: 560, y: 1440, s: 1.0, expr: 'happy', shirt: '#36a85a' }), t) + adult(1, eg({ x: 790, y: 1440, s: 1.0, expr: 'happy', flip: 1, hair: 'long', hairColor: '#8a5a3a', shirt: '#ff8fb1' }), t + 1) +
      heroP({ x: 230, y: 1490, s: 1.3, expr: 'suspicious', look: [1, -.4], armR: [-50, -80], holdR: loupe(.6, -20) }, t) +
      markerText('papa ?', 560, 880, t, at(10, 'personnes'), { size: 50 }) + markerText('maman ?', 820, 860, t, at(10, 'personnes') + .25, { size: 50, r: 6 }) +
      funTag(CX, 450, 'TRÈS PROCHES', t, Pr - .1, { size: 60, bg: SX.acc2, fg: SX.ink }) + kthin('parfois même…', CX, 580, t, at(10, 'parfois') - .05, { size: 46 }); },
  sfx: [[0, 'whoosh', .4], [at(10, 'parfois'), 'hmm', .4], [at(10, 'personnes'), 'pop_hi', .4], [at(10, 'personnes') + .25, 'pop_hi', .4], [at(10, 'proches') - .1, 'pop', .6]] });

// B011a — « Tu peux voir un visage parfaitement » : gros plan net HD d'un visage, loupe géante qui balaie
const O11 = at(11, 'distinguer') - .15;
const girlFace = (x, y, r, t, o = {}) => G(tr(x, y), head(Object.assign({ hr: r, hair: 'ponytail', hairColor: KC[3], skin: SK[3], seed: 23, expr: 'happy' }, o), t) + (o.nose === false ? '' : path(`M${-r * .05} ${r * .08}Q${r * .1} ${r * .18} ${-r * .05} ${r * .22}`, 'none', 6)));
B(11, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pf = at(11, 'parfaitement'), lx = CX + Math.sin(t * 2.4) * 160;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .3 }, { z: 1, svg: girlFace(CX, 900, 240, t) }]) +
      G(tr(lx, 880), circ(0, 0, 150, 'rgba(210,240,255,.25)', 12) + line(110, 110, 230, 230, 30, '#8b5a3c') + op(.6, path('M-90 -60Q-60 -100 -10 -110', 'none', 12, '#fff'))) +
      funTag(250, 1180, 'HD', t, at(11, 'visage') - .05, { size: 50, bg: SX.cool, fg: SX.ink, r: -6 }) + kword('PARFAITEMENT', CX, 460, t, Pf - .05, { size: 92, fill: SX.acc2 }) + (t > Pf ? popStars(CX, 460, t, Pf, 8, 300) : ''); },
  sfx: [[0, 'whoosh', .5], [at(11, 'visage') - .05, 'pop_hi', .5], [at(11, 'parfaitement') - .05, 'boom', .5], [at(11, 'parfaitement'), 'glint', .6]] });
// B011b — « …distinguer les yeux, le nez et la bouche » : étiquettes ✓ YEUX ✓ NEZ ✓ BOUCHE posées sur chaque mot
B(11, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.06, 1.1, t / d) }),
  draw: (t, d, T) => { const Y = at(11, 'yeux') - O11, N = at(11, 'nez') - O11, Bo = at(11, 'bouche') - O11;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .35 }, { z: 1, svg: girlFace(CX, 880, 240, t) }]) +
      markerArrow(260, 640, 440, 860, t, Y, { bend: 40, col: SX.acc2 }) + funTag(250, 590, '✓ YEUX', t, Y - .05, { size: 46, bg: SX.acc2, fg: SX.ink, r: -6 }) +
      markerArrow(860, 760, 580, 930, t, N, { bend: -40, col: SX.cool }) + funTag(860, 710, '✓ NEZ', t, N - .05, { size: 46, bg: SX.cool, fg: SX.ink, r: 6 }) +
      markerArrow(300, 1150, 470, 990, t, Bo, { bend: -40, col: SX.acc }) + funTag(280, 1190, '✓ BOUCHE', t, Bo - .05, { size: 44, bg: SX.acc, fg: '#fff', r: -4 }) +
      kthin('tout est là…', CX, 430, t, .05, { size: 50 }); },
  sfx: [[at(11, 'yeux') - O11 - .05, 'pop', .5], [at(11, 'yeux') - O11, 'scratch', .3], [at(11, 'nez') - O11 - .05, 'pop', .5], [at(11, 'bouche') - O11 - .05, 'pop', .5], [at(11, 'bouche') - O11 + .2, 'ding', .4]] }, O11);

// B012 — « sans réussir à savoir à qui il appartient » : fiche d'identité, le nom se brouille, tampon INCONNU, le visage devient œuf
B(12, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Q = at(12, 'qui'), Ap = at(12, 'appartient'), egg_ = t > Q;
    const inner = rect(-330, -200, 660, 50, SX.acc, 10, 0) + ftext(0, -163, "CARTE D'IDENTITÉ", { size: 30, fill: '#fff', stroke: 'none' }) +
      G(tr(-180, 30), rect(-110, -120, 220, 240, '#e6f6ff', 10, 4) + head(egg_ ? eg({ hr: 85, hair: 'ponytail', hairColor: KC[3], skin: SK[3], seed: 23 }, 'egg') : { hr: 85, hair: 'ponytail', hairColor: KC[3], skin: SK[3], seed: 23, expr: 'happy' }, t)) +
      ftext(110, -40, 'NOM :', { size: 34, fill: '#9a8a7a', stroke: 'none' }) + ftext(110, 20, t > .2 ? scramble('LÉA MARTIN', t, 0, 99) : '…', { size: 44, fill: OL, stroke: 'none' }) +
      ftext(110, 90, 'QUI ?', { size: 34, fill: '#9a8a7a', stroke: 'none' });
    return hallway(t) + WASH('rgba(40,30,80,.2)') + card(CX, 880, 700, 420, inner, t, 0, { thick: 12, r: 3, bw: 6 }) +
      kword('À QUI ?', CX, 470, t, Q - .05, { size: 100, fill: SX.acc2 }) + stamp(680, 1010, 'INCONNU', t, Ap, SX.acc, -10, 56) +
      heroHead(150, 1150, 90, { expr: 'confused', look: [1, -.5] }, t); },
  sfx: [[0, 'flash_hit', .4], [.2, 'slot', .4], [at(12, 'qui') - .05, 'boom', .5], [at(12, 'qui') + .05, 'magic', .3], [at(12, 'appartient'), 'thud', .7]] });

// B013 — « Alors ton cerveau cherche d'autres indices » : MODE DÉTECTIVE, le héros sort loupe + carnet (rayons)
B(13, { enter: 'none', trans: 'circle', transD: .25, cam: zin(1.0, 1.08),
  draw: (t, d, T) => { const In = at(13, 'indices'), Ce = at(13, 'cerveau');
    return rays(t, CX, 900, '#ffe9c2', '#ffd79a', 22) + burst(CX, 900, 330, t, Ce, SX.acc2, 16) + heroHead(430, 920, 200, { expr: t > In ? 'smug' : 'suspicious', look: [1, 0] }, t) +
      G(tr(760, 820, eOutBack(seg(t, Ce, Ce + .3)), -12), magnifier(0, 0, 1.2)) + vgNote(800, 1110, .75, 8, t > In ? 2 : 0, ['VOIX', 'COIFFURE', 'VESTE', 'DÉMARCHE'], t) +
      funTag(CX, 450, 'MODE DÉTECTIVE', t, Ce - .05, { size: 56, bg: SX.ink, fg: '#fff' }) + kword("D'AUTRES INDICES", CX, 590, t, In - .1, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [at(13, 'cerveau') - .05, 'pop', .6], [at(13, 'cherche'), 'magic', .4], [at(13, 'indices') - .1, 'boom', .5], [at(13, 'indices'), 'glint', .5]] });

// B014a — « Une voix, une coiffure » : rue, Kevin (tête-œuf) au loin : ondes VOIX, cercle sur la COIFFURE rousse
const O14 = at(14, 'une', 3) - .1;
B(14, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const V = at(14, 'voix'), C = at(14, 'coiffure');
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: heroP({ x: 250, y: 1490, s: 1.3, expr: 'suspicious', look: [1, -.3], armR: [-50, -80], holdR: loupe(.55, -20) }, t) + kevE({ x: 780, y: 1490, s: 1.3, expr: 'talk', flip: 1, armR: [-60, -100] }, t) + (t > V ? vgWaves(620, 990, t, 1) : '') },
      { z: .6, svg: blur(10, dBin(1000, 1840, 1.4, '#36a85a')) }]) +
      funTag(330, 470, '🔊 VOIX', t, V - .05, { size: 56, bg: SX.cool, fg: SX.ink }) + chatBubble(820, 640, 180, 90, 'Yo !', t, V, false, 44) +
      (t > C ? markerCircle(780, 1060, 160, 130, t, C, { col: SX.acc2 }) : '') + funTag(780, 470, 'COIFFURE', t, C - .05, { size: 56, bg: SX.acc2, fg: SX.ink, r: 5 }); },
  sfx: [[0, 'whoosh', .4], [at(14, 'voix') - .05, 'pop', .5], [at(14, 'voix'), 'buzz', .3], [at(14, 'coiffure') - .05, 'pop', .5], [at(14, 'coiffure'), 'scratch', .5]] });
// B014b — « …une veste, une façon de marcher » : cercle sur le t-shirt vert, Kevin qui marche en se dandinant (traces de pas)
B(14, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ve = at(14, 'veste') - O14, Ma = at(14, 'facon') - O14, walk = t > Ma, kx = walk ? lerp(760, 600, seg(t, Ma, d)) : 760, sw = walk ? Math.sin(t * 14) : 0;
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: heroP({ x: 230, y: 1490, s: 1.25, expr: 'smug', look: [1, -.2], armL: [200, 230], holdL: vgNote(0, -60, .5, -6, t > Ma ? 4 : 2, undefined, t) }, t) +
        kevE({ x: kx, y: 1490 - Math.abs(sw) * 16, s: 1.3, rot: sw * 6, expr: 'happy', flip: 1, legL: [95 + sw * 20, 90], legR: [85 - sw * 20, 90] }, t) },
      { z: .6, svg: blur(10, dBin(1000, 1840, 1.4, '#36a85a')) }]) +
      markerCircle(kx, 1260, 130, 80, t, Ve, { col: SX.acc2 }) + funTag(760, 470, 'VESTE', t, Ve - .05, { size: 56, bg: '#5fb85f', fg: '#fff' }) +
      (walk ? kword('DÉMARCHE', CX, 640, t, Ma, { size: 70, fill: SX.acc2, r: -4 }) : ''); },
  sfx: [[at(14, 'veste') - O14 - .05, 'pop', .5], [at(14, 'veste') - O14, 'scratch', .4], [at(14, 'facon') - O14, 'steps', .5], [at(14, 'marcher') - O14, 'boing', .4]] }, O14);

// B015 — « Tout se passe à peu près bien » : cour, chill de ouf avec le carnet, main « bof » qui tangue
B(15, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), r: Math.sin(t * 3) * 2 }),
  draw: (t, d, T) => schoolyard(t) + WASH() + heroP({ x: 360, y: 1490, s: 1.3, expr: 'chill', armR: [-70, -100], holdR: vgNote(0, -40, .45, Math.sin(t * 6) * 12, 4, undefined, t) }, t) + kevE({ x: 800, y: 1490, s: 1.25, expr: 'happy', flip: 1 }, t) +
    funTag(CX, 470, 'À PEU PRÈS', t, at(15, 'peu') - .1, { size: 64, bg: SX.acc2, fg: SX.ink, r: Math.sin(t * 6) * 6 }) + stamp(CX, 640, 'OK', t, at(15, 'bien') - .05, '#36a85a', -6, 80),
  sfx: [[0, 'thud', .3], [at(15, 'peu') - .1, 'pop', .5], [at(15, 'bien') - .05, 'ding', .5], [.2, 'chirp', .3]] });

// B016a — « Jusqu'au jour où Kevin… » : la rue s'assombrit, éclair, Kevin en contre-jour
const O16 = at(16, 'decide') - .15;
B(16, { enter: 'none', trans: 'glitch', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), shake: 2 }),
  draw: (t, d, T) => { const Kv = at(16, 'kevin');
    return streetT(t, 2) + DIM(.55, '#1a1030') + (Math.sin(t * 8) > .6 ? lightning(820, 260, .7) : '') + kevE({ x: CX, y: 1490, s: 1.35, expr: 'smug' }, t) +
      kthin("JUSQU'AU JOUR OÙ…", CX, 440, t, .05, { size: 60 }) + funTag(CX, 600, 'KEVIN', t, Kv - .05, { size: 70, bg: '#5fb85f', fg: '#fff' }); },
  sfx: [[0, 'thunder', .5], [at(16, 'jour'), 'sting', .5], [at(16, 'kevin') - .05, 'pop', .6], [at(16, 'kevin') + .2, 'heartbeat', .4]] });
// B016b — « …décide de se raser la tête » : salle de bain, tondeuse, les pics roux tombent → crâne nu
B(16, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Rs = at(16, 'raser') - O16, Tt = at(16, 'tete') - O16, bald = t > Tt;
    let fall = ''; if (t > Rs) for (let i = 0; i < 7; i++) { const k = ((t - Rs) * 1.6 + i / 7) % 1; fall += G(tr(500 + i * 26 + Math.sin(i * 3 + k * 6) * 40, 900 + k * 420, 1, k * 300 + i * 40), path('M0 -22L10 0L0 22L-10 0Z', '#c4521b', 4)); }
    return vgBath(t) + (bald ? kevBald({ x: 640, y: 1490, s: 1.3, expr: 'happy', shirt: '#5fb85f', armR: [-40, -80] }, t) : kevE({ x: 640, y: 1490, s: 1.3, expr: 'effort', armR: [-35, -45], holdR: clippers(0, -30, .45, 30, t) }, t)) + fall + hairPile(640, 1330, .6 * seg(t, Rs, Tt + .3) + .01, '#c4521b') +
      kword('RASÉ', 360, 470, t, Tt - .05, { size: 110, fill: SX.acc2, r: -6 }) + (bald ? sparkle(700, 950, .7, '#fff') : ''); },
  sfx: [[0, 'flash_hit', .4], [at(16, 'raser') - O16, 'buzz', .7], [at(16, 'raser') - O16 + .2, 'snip', .4], [at(16, 'tete') - O16 - .05, 'boom', .5], [at(16, 'tete') - O16 + .1, 'glint', .6]] }, O16);

// B017 — « Tu le croises dans la rue, tu passes devant lui » : Kevin chauve salue, le héros passe le nez dans son carnet
B(17, { enter: 'whip', cam: (t, d) => ({ z: 1.04, x: Math.sin(t) * 10, hand: .3 }),
  draw: (t, d, T) => { const Pa = at(17, 'passes'), hx = lerp(120, 560, seg(t, .1, d));
    return depth({ zoom: 1, x: -hx * .05 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: kevBald({ x: 840, y: 1490, s: 1.3, expr: 'happy', flip: 1, armR: [-80 + Math.sin(t * 16) * 20, -120] }, t) + heroP({ x: hx, y: 1490, s: 1.25, expr: 'neutral', look: [0, .6], armL: [200, 260], armR: [-30, -60], holdR: vgNote(0, -40, .45, -6, 1, undefined, t) }, t) + motionLines(hx - 140, 1200, 3, 60, 180) }]) +
      chatBubble(860, 760, 180, 90, 'Yo !', t, at(17, 'croises'), false, 44) + funTag(CX, 470, 'INCONNU AU BATAILLON', t, Pa - .05, { size: 46, bg: SX.ink, fg: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [.1, 'steps', .5], [at(17, 'croises'), 'pop_hi', .4], [at(17, 'passes') - .05, 'pop', .5], [at(17, 'lui'), 'hmm', .3]] });

// B018 — « Frère, pourquoi tu m'ignores ? » : crash zoom sur Kevin chauve (tête-œuf qui FUME), débullé
B(18, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.12, eOutCubic(clamp(t / .4))), shake: 4, r: -5 }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2), haze: .3 }, { z: 1, svg: kevinHead(CX, 920, 220, eg({ hair: 'bald', hairColor: '#e8b48a', freckles: false, expr: 'rage' }), t) }]) +
    kword('FRÈRE ?!', CX, 460, t, at(18, 'frere') - .05, { size: 110, fill: SX.acc2 }) + chatBubble(CX, 1140, 420, 90, "tu m'ignores ?!", t, at(18, 'mignores') - .1, false, 42),
  sfx: [[0, 'flash_hit', .5], [at(18, 'frere') - .05, 'boom', .6], [at(18, 'pourquoi'), 'growl', .4], [at(18, 'mignores'), 'sizzle', .5]] });

// B019a — « Parce que tu viens de supprimer » : le héros pointe le crâne, la fiche COIFFURE se fait barrer
const O19 = at(19, 'mon') - .15;
B(19, { enter: 'none', trans: 'wipe', transD: .22, cam: camHand(1.05, .4),
  draw: (t, d, T) => { const Su = at(19, 'supprimer');
    return streetT(t, 2) + WASH() + heroP({ x: 300, y: 1490, s: 1.3, expr: 'angry', look: [1, 0], armR: [-15, -10] }, t) + kevBald({ x: 790, y: 1490, s: 1.3, expr: 'embarrassed', flip: 1, armL: [230, 280] }, t) +
      vgNote(330, 760, .9, -6, 1, ['COIFFURE', 'VOIX', 'VESTE', 'DÉMARCHE'], t, t > Su ? 0 : -1) + funTag(780, 470, 'SUPPRIMÉ', t, Su - .05, { size: 64, bg: SX.acc, fg: '#fff', r: 4 }) + kthin('parce que tu viens de…', CX, 600, t, .05, { size: 46 }); },
  sfx: [[at(19, 'parce'), 'pop_hi', .4], [at(19, 'supprimer') - .05, 'pop', .6], [at(19, 'supprimer'), 'scratch', .6], [at(19, 'supprimer') + .3, 'error_beep', .4]] });
// B019b — « …mon unique système d'identification » : écran SYSTÈME (silhouette à pics) → HORS SERVICE, fumée
B(19, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), shake: t > at(19, 'identification') - O19 ? 3 : 0 }),
  draw: (t, d, T) => { const Sy = at(19, 'systeme') - O19, Id = at(19, 'identification') - O19, k = seg(t, Sy, Id);
    const scr = ftext(0, -140, "SYSTÈME D'IDENTIFICATION", { size: 32, fill: '#6fff9a', stroke: 'none' }) + G(tr(-150, 30), head(eg({ hr: 80, hair: 'spiky', hairColor: '#c4521b', seed: 3 }, 'egg'), t)) + ftext(-150, 150, 'AVANT', { size: 26, fill: '#6fff9a', stroke: 'none' }) +
      G(tr(150, 30), head(eg({ hr: 80, hair: 'bald', hairColor: '#e8b48a', seed: 3 }, 'egg'), t)) + ftext(150, 150, 'APRÈS', { size: 26, fill: '#6fff9a', stroke: 'none' }) + rect(-260, 110, 520 * k, 10, '#6fff9a', 4, 0);
    return bedroomN(t, 1) + WASH('rgba(255,255,255,.08)') + vgMonitor(CX, 790, 1, t, scr) + (t > Id ? steam(CX + 220, 560, t, 1.2) + steam(CX - 200, 560, t + .4, 1) : '') +
      funTag(CX, 450, 'UNIQUE', t, at(19, 'unique') - O19 - .05, { size: 56, bg: SX.acc2, fg: SX.ink }) + stamp(CX, 820, 'HORS SERVICE', t, Id, '#e2463a', -8, 64) +
      heroHead(160, 1120, 100, { expr: 'sob' }, t); },
  sfx: [[0, 'thud', .3], [at(19, 'unique') - O19 - .05, 'pop', .5], [at(19, 'systeme') - O19, 'typing', .4], [at(19, 'identification') - O19, 'error_beep', .7], [at(19, 'identification') - O19 + .2, 'sizzle', .4]] }, O19);

// B020 — « À une soirée, tu présentes deux personnes » : soirée, le héros entre deux têtes-œufs, bras ouverts
B(20, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pr = at(20, 'presentes');
    return partyT(t) + adult(3, eg({ x: 190, y: 1480, s: 1.05, expr: 'happy' }), t) + adult(4, eg({ x: 890, y: 1480, s: 1.05, expr: 'happy', flip: 1, shirt: '#ff9a4d' }), t + 1) +
      heroP({ x: CX, y: 1490, s: 1.3, expr: 'happy', armL: t > Pr ? [200, 190] : [110, 100], armR: t > Pr ? [-20, -10] : [70, 80] }, t) +
      funTag(CX, 450, 'SOIRÉE', t, at(20, 'soiree') - .1, { size: 70, bg: '#ff5c8a', fg: '#fff' }) + markerText('×2', CX, 600, t, at(20, 'deux'), { size: 70 }); },
  sfx: [[0, 'whoosh', .4], [at(20, 'soiree') - .1, 'pop', .6], [at(20, 'presentes'), 'whoosh_up', .4], [at(20, 'deux'), 'pop_hi', .5]] });

// B021 — « Je te présente… silence. » : la musique coupe, tout s'éteint, grillons, bouche en O figée
B(21, { enter: 'none', cam: (t, d) => ({ z: lerp(1.06, 1.14, t / d) }),
  draw: (t, d, T) => { const Si = at(21, 'silence'), fr = t > Si;
    return partyT(fr ? 0 : t) + DIM(fr ? .55 : .1) + adult(3, eg({ x: 190, y: 1480, s: 1.05, expr: 'happy' }), fr ? 0 : t) + adult(4, eg({ x: 890, y: 1480, s: 1.05, expr: 'happy', flip: 1, shirt: '#ff9a4d' }), fr ? 0 : t + 1) +
      heroP({ x: CX, y: 1490, s: 1.3, expr: fr ? 'embarrassed' : 'talk', face: fr ? { mouth: 'o-small' } : {}, armL: [200, 190], armR: [-20, -10] }, fr ? 1 : t) +
      chatBubble(CX, 660, 380, 100, 'Je te présente…', t, at(21, 'je') - .05, true, 42) + (fr ? kword('SILENCE.', CX, 470, t, Si, { size: 110, fill: '#fff' }) : ''); },
  sfx: [[at(21, 'je') - .05, 'pop_hi', .4], [at(21, 'silence') - .05, 'scratch', .7], [at(21, 'silence') + .05, 'crickets', .7], [at(21, 'silence') + .3, 'gulp', .5]] });

// B022 — « Tu connais cette fille depuis quatre ans » : l'amie (tête-œuf, queue de cheval), compteur 4 ANS, polaroïds souvenirs
B(22, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Dp = at(22, 'depuis'), Q = at(22, 'quatre'), n = counter(0, 4, t, Dp, Q - Dp + .2);
    const mem = i => [kid(3, eg({ x: -30, y: 90, s: .32, expr: 'happy' }), t) + heroP({ x: 40, y: 90, s: .32, expr: 'happy' }, t), dBall(0, 60, .9, t) + heroP({ x: -40, y: 90, s: .3, expr: 'laugh' }, t), heroP({ x: 30, y: 90, s: .32, expr: 'joy' }, t) + kid(3, eg({ x: -40, y: 90, s: .32, expr: 'happy' }), t)][i];
    return partyT(t) + WASH('rgba(255,255,255,.06)') + vgGirl({ x: 720, y: 1490, s: 1.3, expr: 'happy', flip: 1, armL: [215, 255] }, t) + heroP({ x: 260, y: 1490, s: 1.25, expr: 'worried', look: [1, -.3] }, t) +
      vgPola(180, 700, .8, -8, mem(0), t, Dp) + vgPola(420, 640, .8, 5, mem(1), t, Dp + .2) + vgPola(940, 700, .8, 8, mem(2), t, Dp + .4) +
      funTag(CX, 450, n + ' ANS', t, Dp - .05, { size: 90, bg: SX.acc2, fg: SX.ink }) + (t > Q ? popStars(CX, 450, t, Q, 6, 200) : ''); },
  sfx: [[at(22, 'connais'), 'hmm', .4], [at(22, 'depuis') - .05, 'pop', .5], [at(22, 'depuis') + .2, 'shutter', .4], [at(22, 'quatre'), 'boom', .5], [at(22, 'ans'), 'sparkle', .4]] });

// B023 — « Tu as oublié son visage, pas votre histoire » : moitié VISAGE ✗ (œuf), moitié HISTOIRE ✓ (bulle de souvenirs + cœurs)
B(23, { enter: 'none', trans: 'push', transD: .22, cam: zin(1.02, 1.07),
  draw: (t, d, T) => { const Vi = at(23, 'visage'), Hi = at(23, 'histoire');
    return partyT(t) + WASH('rgba(255,255,255,.08)') + G(tr(300, 880), head(eg({ hr: 170, hair: 'ponytail', hairColor: KC[3], skin: SK[3], seed: 23 }, 'egg'), t)) + cross(300, 880, .9, t, Vi + .1) +
      (t > Hi - .3 ? G(tr(790, 860, eOutBack(seg(t, Hi - .3, Hi))), cloud(0, 0, 2.1, '#fff', 6) + dGift(-90, 40, .6) + heart(30, -30, 1.1, '#ff5d73') + G(tr(100, 50, .6), path('M-30 0L30 0L0 110Z', '#e8b06a', 5) + circ(0, -20, 38, '#ff8fb1', 5))) + heartsUp(t, 790, 900, 4) : '') +
      funTag(300, 1170, 'VISAGE', t, Vi - .05, { size: 48, bg: SX.ink, fg: '#fff' }) + funTag(790, 1170, '✓ HISTOIRE', t, Hi - .05, { size: 48, bg: '#36a85a', fg: '#fff' }) +
      kthin('tu as oublié son visage…', CX, 420, t, at(23, 'oublie') - .1, { size: 50 }) + kword('PAS VOTRE HISTOIRE', CX, 540, t, at(23, 'pas') - .05, { size: 66, fill: SX.acc2 }); },
  sfx: [[at(23, 'oublie'), 'pop_hi', .4], [at(23, 'visage') + .1, 'error_beep', .5], [at(23, 'pas') - .05, 'boom', .4], [at(23, 'histoire') - .3, 'magic', .5], [at(23, 'histoire'), 'ding', .5]] });

// B024 — « Et les autres prennent ça pour de l'arrogance » : couloir, 3 têtes-œufs chuchotent derrière le héros, ARROGANT ?
B(24, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ar = at(24, 'arrogance');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: hallway(t), haze: .06 },
      { z: 1, svg: kid(1, eg({ x: 620, y: 1470, s: 1.1, expr: 'suspicious', armR: [-60, -110] }), t) + kid(4, eg({ x: 790, y: 1470, s: 1.1, expr: 'suspicious', flip: 1 }), t + 1) + kid(2, eg({ x: 950, y: 1470, s: 1.1, expr: 'annoyed', flip: 1 }), t + 2) +
        heroP({ x: 240, y: 1490, s: 1.25, expr: 'neutral', look: [-1, 0], armR: [-40, -70], holdR: vgNote(0, -40, .45, -6, 2, undefined, t) }, t) }]) +
      chatBubble(720, 760, 230, 90, 'chuchu…', t, at(24, 'autres'), false, 38) + chatBubble(930, 690, 180, 80, 'pff', t, at(24, 'prennent'), false, 38) +
      funTag(CX, 470, 'ARROGANT ?', t, Ar - .1, { size: 76, bg: SX.acc, fg: '#fff', r: -4 }); },
  sfx: [[at(24, 'autres'), 'tiptoe', .4], [at(24, 'prennent'), 'hmm', .4], [at(24, 'arrogance') - .1, 'boom', .5], [at(24, 'arrogance') + .2, 'gasp', .4]] });

// B025 — « Il se croit trop important pour dire bonjour » : leur fantasme — le héros en star couronnée sur tapis rouge, flashs
B(25, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Im = at(25, 'important'), Bj = at(25, 'bonjour');
    return vgCarpet(t) + heroP({ x: CX, y: 1490, s: 1.35, expr: 'cool', face: { mouth: 'smirk' }, look: [0, -.4], armL: [140, 120], armR: [-60, -30] }, t) + vgCrown(CX, 990 + Math.sin(t * 4) * 4, .9) +
      kword('TROP IMPORTANT', CX, 470, t, Im - .1, { size: 78, fill: SX.acc2 }) + chatBubble(200, 700, 200, 90, 'Bonjour', t, Bj - .1, false, 36) + cross(200, 700, .45, t, Bj + .2); },
  sfx: [[0, 'flash_hit', .4], [at(25, 'croit'), 'shutter', .5], [at(25, 'important') - .1, 'tada', .5], [at(25, 'pour'), 'shutter', .4], [at(25, 'bonjour') + .2, 'error_beep', .4]] });

// B026a — « Non, tu essaies juste de ne pas » : classe, le héros secoue la tête, NON !
const O26 = at(26, 'appeler') - .15;
const vgBoard = ftext(540, 560, 'FRANÇAIS', { size: 76, fill: 'rgba(255,255,255,.9)', stroke: 'none' }) + ftext(540, 680, 'le COD / le COI', { size: 50, fill: 'rgba(255,255,255,.7)', stroke: 'none' });
B(26, { enter: 'none', trans: 'up', transD: .25, cam: camHand(1.05, .4),
  draw: (t, d, T) => { const No = at(26, 'non'), nod = Math.sin(t * 16) * 9 * seg(t, No - .1, No + .4) * (1 - seg(t, .7, .9));
    return classroomT(t) + kid(1, eg({ x: 860, y: 1480, s: 1.15, expr: 'happy', flip: 1 }), t) + G(`rotate(${f1(nod)} 380 1100)`, heroP({ x: 380, y: 1490, s: 1.3, expr: 'worried', armL: [200, 160], armR: [-20, 20] }, t)) +
      funTag(380, 470, 'NON !', t, No - .05, { size: 80, bg: SX.acc, fg: '#fff' }) + kthin('tu essaies juste…', 640, 620, t, at(26, 'essaies') - .05, { size: 48 }); },
  sfx: [[at(26, 'non') - .05, 'pop', .6], [at(26, 'non'), 'boing', .4], [at(26, 'essaies'), 'pop_hi', .4], [at(26, 'juste'), 'heartbeat', .3]] });
// B026b — « …d'appeler ta prof de français maman » : main levée, « Mam… » qui s'échappe, le héros se plaque la main sur la bouche
B(26, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ma = at(26, 'maman') - O26, Pf = at(26, 'preuve') - O26, gag = t > Ma + .25;
    return classroomT(t, vgBoard) + adult(1, eg({ x: 160, y: 1290, s: .9, expr: 'talk', glasses: true, shirt: '#8a6ad8', armL: [200, 250] }), t) + kid(1, eg({ x: 880, y: 1480, s: 1.15, expr: gag ? 'shock' : 'happy', flip: 1 }), t) +
      heroP({ x: 470, y: 1490, s: 1.3, expr: gag ? 'embarrassed' : 'talk', look: [-1, -.4], armR: [-80, -95], armL: gag ? [-60, -150] : [110, 100] }, t) + (gag ? sweatSpray(470, 980, t, 5) : '') +
      funTag(200, 470, 'LA PROF', t, Pf - .05, { size: 54, bg: SX.cool, fg: SX.ink, r: -5 }) + chatBubble(560, 720, 240, 100, 'Mam…', t, Ma - .1, true, 50) + (t > Ma ? kword('MAMAN', 770, 920, t, Ma, { size: 90, fill: SX.acc2, r: 5 }) + cross(770, 920, .6, t, Ma + .3) : ''); },
  sfx: [[at(26, 'appeler') - O26, 'whoosh_up', .4], [at(26, 'preuve') - O26 - .05, 'pop_hi', .4], [at(26, 'maman') - O26 - .1, 'pop', .5], [at(26, 'maman') - O26 + .3, 'error_beep', .5], [at(26, 'maman') - O26 + .35, 'gasp', .4]] }, O26);

// B027a — « Le pire, quelqu'un… » : rue, LE PIRE en slam, Léa (longs cheveux = SON indice) arrive
const O27b = at(27, 'changer') - .12, O27c = at(27, 'devenir') - .15;
B(27, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 4 }),
  draw: (t, d, T) => streetT(t, 2) + WASH() + vgLea({ x: 720, y: 1490, s: 1.3, expr: 'happy', flip: 1, armL: [215, 255] }, t) + heroP({ x: 280, y: 1490, s: 1.25, expr: 'happy', look: [1, -.2], armR: [-50, -80], holdR: vgNote(0, -40, .45, -6, 1, ['CHEVEUX', 'LONGS', '', ''], t) }, t) +
    kword('LE PIRE', CX, 480, t, at(27, 'pire') - .05, { size: 110, fill: SX.acc2 }),
  sfx: [[0, 'flash_hit', .5], [at(27, 'pire') - .05, 'boom', .6], [at(27, 'quelqu'), 'pop_hi', .3]] });
// B027b — « …peut changer de coupe de cheveux » : salon de coiffure, coup de ciseaux : longs → carré court
B(27, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Co = at(27, 'coupe') - O27b, cut = t > Co + .15, sc = Math.sin(t * 30) * 10;
    let fall = ''; if (t > Co) for (let i = 0; i < 6; i++) { const k = clamp((t - Co) * 1.3 - i * .06); fall += op(1 - k * .6, G(tr(440 + i * 40, 980 + k * 360, 1, k * 200 + i * 30), path('M0 -30Q10 0 0 30', 'none', 8, '#6b3e26'))); }
    return vgCoiffeur(t) + vgChair(CX, 1430, 1) + vgLea({ x: CX, y: 1380, s: 1.15, expr: cut ? 'joy' : 'happy', hair: cut ? 'short' : 'long', armL: [100, 90], armR: [80, 90] }, t) + fall +
      adult(1, eg({ x: 860, y: 1490, s: 1.05, expr: 'happy', flip: 1, armR: [-40, -70], shirt: '#2b2420', holdR: G(tr(0, -20, 1, sc), path('M-30 -8L30 8M-30 8L30 -8', 'none', 8, '#9aa3ad') + circ(-36, -10, 12, 'none', 6) + circ(-36, 10, 12, 'none', 6)) }), t) +
      funTag(CX, 450, 'NOUVELLE COUPE', t, Co - .05, { size: 58, bg: SX.acc2, fg: SX.ink }) + (cut ? popStars(CX, 900, t, Co + .15, 8, 260) : ''); },
  sfx: [[0, 'whoosh', .4], [at(27, 'changer') - O27b, 'snip', .5], [at(27, 'coupe') - O27b, 'snip', .7], [at(27, 'cheveux') - O27b, 'tada', .4]] }, O27b);
// B027c — « …et devenir pour toi presque un inconnu » : rue, Léa au carré salue, le héros scanne : indice CHEVEUX LONGS barré → INCONNUE
B(27, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const In = at(27, 'inconnu') - O27c, Pq = at(27, 'presque') - O27c;
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: vgLea({ x: 760, y: 1490, s: 1.3, expr: 'happy', hair: 'short', flip: 1, armL: [215 + Math.sin(t * 16) * 15, 255] }, t) + heroP({ x: 280, y: 1490, s: 1.25, expr: t > In ? 'confused' : 'suspicious', look: [1, -.3], armR: [-50, -80], holdR: loupe(.55, -20) }, t) }]) +
      vgNote(300, 700, .8, -6, 0, ['CHEVEUX', 'LONGS'], t, t > Pq ? 0 : -1) + chatBubble(760, 720, 210, 90, 'Coucou !', t, .1, false, 40) +
      markerText('presque…', 720, 470, t, Pq, { size: 54 }) + stamp(760, 600, 'INCONNUE', t, In - .05, SX.acc, 8, 64) + (t > In ? qmark(960, 860, .6, SX.acc2, 10) : ''); },
  sfx: [[.1, 'pop_hi', .4], [at(27, 'presque') - O27c, 'scratch', .5], [at(27, 'inconnu') - O27c - .05, 'thud', .6], [at(27, 'inconnu') - O27c + .1, 'hmm', .4]] }, O27c);

// B028a — « Alors quand tu demandes son prénom une deuxième fois » : cour, « C'est quoi ton prénom ? » ×2, gêne
const O28 = at(28, 'ce') - .12;
B(28, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pn = at(28, 'prenom'), Dx = at(28, 'deuxieme');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: schoolyard(t), haze: .08 },
      { z: 1, svg: heroP({ x: 300, y: 1490, s: 1.3, expr: 'embarrassed', look: [1, 0], armL: [205, 245] }, t) + vgLea({ x: 780, y: 1490, s: 1.3, expr: t > Dx ? 'annoyed' : 'happy', hair: 'short', flip: 1 }, t) },
      { z: .6, svg: blur(10, dBush(1000, 1900, 1.5)) }]) +
      chatBubble(360, 700, 300, 120, "C'est quoi\nton prénom ?", t, Pn - .2, true, 38) + funTag(CX, 460, '2e FOIS', t, Dx - .05, { size: 70, bg: SX.acc, fg: '#fff' }) + (t > Dx ? emark(860, 860, .6) : ''); },
  sfx: [[at(28, 'demandes'), 'hmm', .4], [at(28, 'prenom') - .2, 'pop_hi', .5], [at(28, 'deuxieme') - .05, 'pop', .6], [at(28, 'fois'), 'boing', .4]] });
// B028b — « …ce n'est pas que cette personne ne compte pas » : câlin, grand cœur qui pulse, ELLE COMPTE
B(28, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Co = at(28, 'compte') - O28, hb = 1 + .06 * Math.max(0, Math.sin(t * 9));
    return schoolyard(t) + WASH('rgba(255,220,230,.25)') + G(tr(CX, 870, hb * eOutBack(seg(t, .1, .5))), heart(0, 0, 4.2, '#ff5d73')) +
      heroP({ x: 420, y: 1490, s: 1.3, expr: 'happy', armR: [-10, 20], armL: [200, 220] }, t) + vgLea({ x: 680, y: 1490, s: 1.3, expr: 'happy', hair: 'short', flip: 1, armL: [200, 160], armR: [-20, 30] }, t) + heartsUp(t, CX, 1000, 5) +
      kthin("ce n'est pas qu'elle…", CX, 420, t, .05, { size: 50 }) + kword('NE COMPTE PAS', CX, 540, t, Co - .1, { size: 76, fill: '#fff' }) + cross(CX, 540, .7, t, Co + .25); },
  sfx: [[0, 'whoosh', .4], [.1, 'heartbeat', .5], [at(28, 'compte') - O28 - .1, 'pop', .5], [at(28, 'compte') - O28 + .25, 'error_beep', .4], [at(28, 'pas', 2) - O28, 'angel', .4]] }, O28);

// B029a — « C'est que ton cerveau n'a pas » : le cerveau-détective, tiroir VISAGES vide (toile d'araignée), tiroir SOUVENIRS plein
const O29 = at(29, 'retenu') - .15;
B(29, { enter: 'none', trans: 'zoom', transD: .22, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const Ce = at(29, 'cerveau');
    return paper('#fdeee0') + gobo(T, .1) + cutout(vgBrain(CX, 760, 1.25, t, { eyes: 'dot', mouth: 'wavy' }), 10) +
      vgDrawer(300, 1070, 'VISAGES', '#c9d3dc', path('M-120 -40L120 40M-120 40L120 -40M0 -60L0 60', 'none', 3, 'rgba(80,80,80,.6)'), seg(t, .2, .6)) +
      vgDrawer(780, 1070, 'SOUVENIRS', '#ffd1dc', heart(-70, 0, .7, '#ff5d73') + heart(0, -10, .8, '#ff5d73') + heart(70, 0, .7, '#ff5d73'), seg(t, .5, .9)) +
      funTag(CX, 450, 'TON CERVEAU', t, Ce - .05, { size: 60, bg: '#ff9ec0', fg: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [at(29, 'cerveau') - .05, 'pop', .5], [.2, 'squeak', .4], [.5, 'sparkle', .4]] });
// B029b — FIN : « …retenu le bon badge. » : tout le monde avec un post-it BONJOUR sur le front, le héros soulagé, débloqué + confettis
B(29, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Bd = at(29, 'badge') - O29, Rt = at(29, 'retenu') - O29;
    return schoolyard(t) + WASH() + unlock(CX, 720, t, Bd, { part: 'back', r: 420 }) +
      vgUncle({ x: 140, y: 1440, s: 1.0, expr: 'happy' }, t) + vgBadge(140, 1000, 'TONTON', .55, '#8a6ad8', -6) +
      kevBald({ x: 930, y: 1440, s: 1.15, expr: 'happy', flip: 1 }, t) + vgBadge(930, 1062, 'KEVIN', .55, '#5fb85f', 6) +
      vgLea({ x: 680, y: 1440, s: 1.1, expr: 'happy', hair: 'short', flip: 1 }, t) + vgBadge(680, 1072, 'LÉA', .55, '#ff8fb1', -4) +
      heroP({ x: 410, y: 1440, s: 1.25, expr: t > Bd ? 'ecstatic' : 'happy', armR: [-60, -100], armL: [220, 260] }, t) + unlock(CX, 720, t, Bd, { part: 'front', r: 420 }) +
      kthin("n'a pas retenu", CX, 400, t, Rt - .05, { size: 54 }) + kword('LE BON BADGE.', CX, 520, t, Bd - .1, { size: 92, fill: SX.acc2 }) + (t > Bd ? confetti(t, Bd, 30) : ''); },
  sfx: [[0, 'flash_hit', .4], [at(29, 'retenu') - O29, 'pop_hi', .4], [at(29, 'bon') - O29, 'pop', .5], [at(29, 'badge') - O29 - .1, 'tada', .6], [at(29, 'badge') - O29 + .1, 'sparkle', .5]] }, O29);

SCENES.sort((a, b) => a.s - b.s);
