// ============================================================
//  « Pourquoi c'est horrible d'avoir un strabisme ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Sujet sensible : on rit des situations et des gens qui ne comprennent pas, jamais du héros.
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

// ---------- SIZEX fun : accent VIOLET « regard électrique », jaune marqueur, vert menthe ----------
sxFun('#7c4dff'); SX.acc2 = '#ffd23f'; SX.cool = '#5ee0a0';

// ============================================================
//  LE HÉROS : un œil qui regarde droit, l'autre qui dévie (strabisme) — aide « yeux qui louchent »
//  heroHair (hairFn) arme un drapeau juste avant que head() dessine les yeux ; eyesSvg est enveloppé pour dessiner
//  des yeux à sclère blanche : œil gauche = suit o.look, œil droit = o.look + o.dev (déviation, défaut vers le nez).
//  o.patch = cache-œil coloré sur l'œil « fort » (rééducation), o.band = bandeau de sport.
// ============================================================
const HERO_SHIRT = '#5b8fd8', HERO_HAIR = '#3a2418';
let _SQ = null;
const _eyesBase = eyesSvg;
eyesSvg = function (type, r, t, lx, ly, seed) {
  const q = _SQ; _SQ = null;
  if (!q) return _eyesBase(type, r, t, lx, ly, seed);
  const SZ = { dot: .24, wide: .26, huge: .29, pop: .3 }, ex = r * .34;
  const blink = (type === 'dot' || type === 'wide') && ((t + seed * 1.7) % 3.3) < .11;
  let s;
  if (!SZ[type] || blink) s = _eyesBase(blink ? 'closed' : type, r, t, lx, ly, seed);
  else {
    s = ''; const sr = r * SZ[type], pr = r * .08, ey = r * .02 - (SZ[type] > .24 ? r * .04 : 0), mx = sr - pr * .9;
    const jt = SZ[type] > .24 ? [Math.sin(t * 47) * r * .012, Math.cos(t * 53) * r * .012] : [0, 0];
    for (const side of [-1, 1]) {
      let px = lx / (r * .12), py = ly / (r * .12);
      if (side === 1) { px += q.dev[0]; py += q.dev[1]; }
      const m = Math.hypot(px, py); if (m > 1) { px /= m; py /= m; }
      const cx = side * ex + lx * .25, cy = ey + ly * .2, X = cx + px * mx + jt[0], Y = cy + py * mx + jt[1];
      s += circ(cx, cy, sr, '#fff', 5) + circ(X, Y, pr, OL, 0) + circ(X + pr * .35, Y - pr * .4, pr * .32, '#fff', 0);
    }
  }
  if (q.patch) s += line(-r * .97, -r * .3, -ex - r * .2, -r * .06, 6) + line(-ex + r * .2, -r * .08, r * .97, -r * .38, 6) +
    G(tr(-ex, r * .02), ell(0, 0, r * .25, r * .22, q.patch, 6) + G(tr(0, 0, r / 520), path('M0 -40Q6 -6 40 0Q6 6 0 40Q-6 6 -40 0Q-6 -6 0 -40Z', '#fff', 0)));
  return s;
};
const heroHair = (r, t, o) => { _SQ = { dev: o.dev || [-.9, .05], patch: o.patch };
  const [b, f] = hairSvg('curly', o.hairColor || HERO_HAIR, r, t);
  return [b, f + (o.band ? rect(-r * .98, -r * .62, r * 1.96, r * .2, '#e2463a', r * .08, 5) + line(-r * .9, -r * .52, r * .9, -r * .52, 3, '#fff') : '')]; };
const heroP = (o, t) => person(Object.assign({ age: 'kid', hairFn: heroHair, shirt: HERO_SHIRT, pants: '#3b3f4a', seed: 2 }, o), t);
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: heroHair, seed: 2 }, o), t));
// déviation animée (la pupille « décroche » : dérive douce)
const drift = (t, a = .9) => [-a + .12 * Math.sin(t * 2.3), .08 * Math.sin(t * 3.1)];

// ---------- personnages secondaires ----------
const sbDoc = (o, t) => adult(1, Object.assign({ shirt: '#f4f7fb', coat: true, hair: 'bun', hairColor: '#6b3e26', glasses: true, pants: '#5a6b8a' }, o), t);
const sbProf = (o, t) => adult(0, Object.assign({ shirt: '#8a6ad8', glasses: true, pants: '#3b3f4a' }, o), t);

// ---------- accessoires de l'épisode (préfixe sb) ----------
// œil-personnage (veines, iris, reflet) ; o.legs / o.arms : bras [aL, aR] en degrés ; o.lid = paupière tombante
function sbEyeball(x, y, s, t, o = {}) { const [px, py] = o.look || [0, 0], ir = o.iris || '#5b8fd8'; let g = '';
  if (o.legs) { const w = Math.sin(t * 12) * (o.walk || 0); g += line(-34, 80, -44 - w, 175, 12) + line(34, 80, 44 + w, 175, 12) + ell(-54 - w, 180, 30, 14, OL, 0) + ell(54 + w, 180, 30, 14, OL, 0); }
  if (o.arms) { const [a1, a2] = o.arms; g += path(`M-90 10Q${f1(-90 + Math.cos(R(a1)) * 80)} ${f1(10 + Math.sin(R(a1)) * 80)} ${f1(-90 + Math.cos(R(a1)) * 150)} ${f1(10 + Math.sin(R(a1)) * 150)}`, 'none', 12) + circ(-90 + Math.cos(R(a1)) * 150, 10 + Math.sin(R(a1)) * 150, 18, SKIN, 5) +
    path(`M90 10Q${f1(90 + Math.cos(R(a2)) * 80)} ${f1(10 + Math.sin(R(a2)) * 80)} ${f1(90 + Math.cos(R(a2)) * 150)} ${f1(10 + Math.sin(R(a2)) * 150)}`, 'none', 12) + circ(90 + Math.cos(R(a2)) * 150, 10 + Math.sin(R(a2)) * 150, 18, SKIN, 5); }
  g += circ(0, 0, 100, '#fff', 7) + path('M-92 30q22 -6 30 10M-80 -50q20 4 26 -10M88 40q-18 -4 -26 12', 'none', 3, '#ff8a8a') +
    circ(px * 40, py * 40, 44, ir, 5) + circ(px * 46, py * 46, 22, OL, 0) + circ(px * 46 + 10, py * 46 - 12, 8, '#fff', 0);
  if (o.lid) g += path(`M-100 0A100 100 0 0 1 100 0L100 ${f1(-100 + 100 * o.lid)}Q0 ${f1(-60 + 110 * o.lid)} -100 ${f1(-100 + 100 * o.lid)}Z`, '#f2c9a0', 6);
  if (o.sweat) g += sweat(95, -60 + (t * 30 % 20), 1);
  return G(tr(x, y, s, o.r || 0), g); }
// tableau d'acuité (lettres de plus en plus petites)
function sbChart(x, y, s = 1, blurK = 0) { const rows = [['E', 96], ['F P', 64], ['T O Z', 46], ['L P E D', 34], ['P E C F D', 26], ['E D F C Z P', 20]];
  let L = ''; rows.forEach(([str, sz], i) => { L += ftext(0, -150 + i * 62 + sz * .35 + (i ? 20 : 0), str, { size: sz, fill: i === 0 ? '#e2463a' : OL, stroke: 'none' }); });
  return G(tr(x, y, s), rect(-140, -230, 280, 460, '#fff', 12, 6) + (blurK ? blur(blurK, L) : L) + line(-110, 200, 110, 200, 4, '#e2463a')); }
const sbSpecs = (x, y, s = 1, c = '#e2463a', r = 0) => G(tr(x, y, s, r), circ(-46, 0, 36, 'rgba(210,240,255,.7)', 7, c) + circ(46, 0, 36, 'rgba(210,240,255,.7)', 7, c) + path('M-12 -4Q0 -16 12 -4', 'none', 7, c) + line(-82, -6, -120, -16, 7, c) + line(82, -6, 120, -16, 7, c) + circ(-58, -12, 8, '#fff', 0) + circ(34, -12, 8, '#fff', 0));
// fauteuil d'examen + réfracteur (machine à lunettes sur bras articulé)
function sbExamChair(x, yb, s = 1) { return G(tr(x, yb, s), rect(-26, -170, 52, 170, '#9aa3ad', 6, 5) + ell(0, -4, 120, 18, '#7d848c', 5) + rect(-150, -270, 300, 100, '#7c4dff', 34, 6) + rect(-130, -330, 260, 90, '#8f66ff', 34, 6) + rect(-180, -320, 60, 40, '#5b3ad0', 16, 5) + rect(120, -320, 60, 40, '#5b3ad0', 16, 5)); }
const sbPhoropter = (x, y, s = 1, t = 0) => G(tr(x, y, s), line(260, -80, 140, 0, 18, '#7d848c') + rect(-150, -60, 300, 120, '#3a3f4a', 40, 6) + circ(-70, 0, 42, '#cfe8ff', 6) + circ(70, 0, 42, '#cfe8ff', 6) + circ(-70, 0, 18, OL, 0) + circ(70, 0, 18, OL, 0) + G(tr(0, -70, 1, t * 60), circ(0, 0, 22, '#ffd23f', 5) + line(-14, 0, 14, 0, 4)) + circ(-130, -40, 10, '#e2463a', 3) + circ(130, -40, 10, '#5ee0a0', 3));
// cabinet d'ophtalmo : mur menthe à pois, tableau d'acuité, fenêtre + rideaux, diplôme, horloge, affiche « l'œil », présentoir à lunettes
function sbOphtalmo(t, o = {}) { const yb = 1250;
  let s = dWall('dot', '#dff3ee', '#c8e8df', yb) + rect(-M, 900, W + 2 * M, yb - 900, '#bfe0d6', 0, 0) + line(-M, 900, W + M, 900, 6, '#9cc7ba') + dBase(yb, '#fff');
  s += sbChart(170, 560, 1, o.blur || 0) + dWindowView(720, 290, 300, 320, t) + dCurtain(660, 270, 90, 400, '#b9a4ff', t, 1) + dCurtain(990, 270, 90, 400, '#b9a4ff', t, -1);
  s += G(tr(470, 330, 1, -2), rect(-90, -64, 180, 128, '#c38a52', 6, 6) + rect(-76, -50, 152, 100, '#fff8e0', 4, 0) + ftext(0, -12, 'DIPLÔME', { size: 24, fill: '#7a5a3a', stroke: 'none' }) + line(-50, 14, 50, 14, 3, '#c9b48a') + circ(46, 30, 16, '#e2463a', 3));
  s += wallClock(560, 150, 44, t) + dPoster(450, 580, 170, 210, '#fff', 3, sbEyeball(0, -14, .55, t, { iris: '#36a85a', look: [Math.sin(t * 1.3), 0] }) + ftext(0, 82, "L'ŒIL", { size: 26, fill: OL, stroke: 'none' }), t);
  s += dShelf(690, 740, 360, sbSpecs(750, 700, .5, '#e2463a') + sbSpecs(870, 700, .5, '#5b8fd8') + sbSpecs(990, 700, .5, '#36a85a') + dPot(1040, 740, .35, t, 2));
  s += dOutlet(1020, 1180) + dSwitch(40, 960) + dLamp(1010, 1250, .9, 1, t, '#b9a4ff');
  s += WASH() + dTileFloor(yb, '#eaf2f4', '#d3e3ea') + dPot(60, 1300, 1, t, 1) + dBin(1000, 1330, .7, '#7aa6d8') + dRug(CX, 1520, 760, 150, '#b9a4ff', '#ffd23f');
  return s; }
// salle d'interrogatoire (mur de briques, glace sans tain, porte, classeur, lampe qui se balance)
function sbInterro(t) { const yb = 1250; let s = rect(-M, -M, W + 2 * M, yb + M, '#3d4250', 0, 0);
  for (let y = -80, j = 0; y < yb; y += 70, j++) for (let x = -M + (j % 2) * 70; x < W + M; x += 140) s += rect(x + 3, y + 3, 134, 64, (j * 3 + x) % 7 ? '#454b5b' : '#4b5263', 6, 0);
  s += rect(560, 300, 460, 300, '#1c2230', 8, 8) + op(.25, path('M600 560L700 340M660 580L780 330', 'none', 10, '#fff')) + op(.3, circ(760, 470, 40, '#0c0f18', 0) + rect(720, 510, 80, 90, '#0c0f18', 20, 0) + circ(880, 480, 36, '#0c0f18', 0) + rect(845, 515, 70, 85, '#0c0f18', 20, 0));
  s += rect(60, 520, 240, 730, '#5a4a3a', 8, 6) + rect(110, 570, 140, 110, '#8fb3c9', 6, 5) + circ(270, 900, 14, '#ffd23f', 4) + wallClock(430, 220, 44, t, 3);
  s += dPoster(450, 700, 150, 190, '#e8dcc0', -3, ftext(0, -40, 'SILENCE', { size: 24, fill: '#7a4a2a', stroke: 'none' }) + circ(0, 30, 40, '#fff', 4) + line(-26, 30, 26, 30, 8, '#e2463a'), t);
  s += G(tr(960, yb), rect(-90, -330, 180, 330, '#7d848c', 8, 6) + [0, 1, 2].map(i => rect(-70, -310 + i * 105, 140, 85, '#9aa3ad', 6, 4) + rect(-20, -280 + i * 105, 40, 12, OL, 4, 0)).join('') + rect(-60, -360, 120, 30, '#ffb03a', 4, 4) + dMug(40, -330, .8, t, '#e2463a'));
  s += dTileFloor(yb, '#2e323c', '#363b47') + hangLamp(CX, 470, t, 1);
  return s; }
// gradins de la photo de classe (3 rangées d'élèves) dans la cour
function sbBleachers(t) { let s = schoolyard(t);
  for (let j = 0; j < 3; j++) { const y = 1110 - j * 120; s += rect(-M, y, W + 2 * M, 40, ['#c38a52', '#b5835a', '#a87850'][j], 4, 5); for (let i = 0; i < 8; i++) s += kid(i + j * 3, { x: 60 + i * 140 + (j % 2) * 70, y: y - 10, s: .42, expr: ['happy', 'joy', 'laugh', 'neutral'][(i + j) % 4], armR: (i + j) % 5 ? [70, 80] : [-60, -90] }, t + i); }
  return s; }
function sbTripod(x, y, s, t = 0) { return G(tr(x, y, s), line(0, 0, -140, 500, 14) + line(0, 0, 140, 500, 14) + line(0, 0, 0, 520, 14) + rect(-170, -150, 340, 200, '#3a3f4a', 30) + circ(0, -50, 80, '#2b2b33') + circ(0, -50, 46, '#7c4dff', 6) + circ(-16, -66, 12, '#fff', 0) + rect(90, -190, 70, 40, '#555', 8)); }
// grande photo de classe imprimée (rangées de têtes, le héros au centre)
function sbClassPhoto(t, dev) { let g = rect(-300, -210, 600, 420, '#fff', 10, 6) + rect(-280, -190, 560, 330, '#bfe3ff', 4, 0) + rect(-280, 60, 560, 80, '#c38a52', 0, 0);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 6; i++) { if (j === 1 && (i === 2 || i === 3)) continue; g += kidHeadMini(-225 + i * 90, -110 + j * 100, i + j * 6, t); }
  g += heroHead(0, -10, 48, { expr: 'neutral', dev }, t) + kevinHead(90, -10, 42, { expr: 'happy' }, t) + ftext(0, 180, 'CM1 — 2026', { size: 28, fill: '#7a5a3a', stroke: 'none' });
  return g; }
const kidHeadMini = (x, y, i, t) => G(tr(x, y), head({ hr: 36, hair: KH[i % 6], hairColor: KC[i % 6], skin: SK[i % 6], expr: 'happy', seed: 20 + i }, t));
const sbBattery = (x, y, s, k, t) => { const c = k > .5 ? '#5ee0a0' : k > .2 ? '#ffd23f' : '#e2463a', bl = k < .2 && Math.sin(t * 10) > 0; return G(tr(x, y, s), rect(-110, -55, 220, 110, '#fff', 18, 7) + rect(110, -22, 22, 44, OL, 6, 0) + (bl ? '' : rect(-96, -41, 192 * clamp(k), 82, c, 10, 0))); };
const sbIce = (x, y, s, c = '#ff8fb1', r = 0) => G(tr(x, y, s, r), path('M-30 0L30 0L0 110Z', '#e8b06a', 5) + path('M-16 20L16 20M-10 50L10 50', 'none', 3, '#c98a4a') + circ(0, -20, 38, c, 5) + circ(-14, -34, 10, 'rgba(255,255,255,.6)', 0));
const sbDouble = (svg, dx, k = .55) => op(k, G(tr(-dx / 2, 0), svg)) + op(k, G(tr(dx / 2, 0), svg));
const DIM = (k = .3) => op(k, rect(-M, -M, W + 2 * M, H + 2 * M, '#141838', 0, 0));

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001 — SIGNATURE : grille encre, le héros en cut-out (un œil qui part), titre 3 lignes, « débloqué » en étoiles sur STRABISME
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'strabisme');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.25, expr: t > K ? 'shock' : 'neutral', dev: drift(t, t > K ? 1 : .9), armR: [-30, -60] }, t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1030, 330, 330, t, K + .2, { label: 'strabisme.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'AVOIR", CX, 415, t, .3, { size: 58 }) +
      kword('UN STRABISME ?', CX, 540, t, K - .05, { size: 72, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'strabisme') - .05, 'boom', .6], [at(1, 'strabisme'), 'sparkle', .5], [at(1, 'strabisme') + .3, 'boing', .4]] });

// B002 — « Tu as 8 ans » : papier + gobo, gâteau à 8 bougies, le héros en cut-out
B(2, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { let candles = ''; for (let i = 0; i < 8; i++) { const x = -150 + i * 43; candles += rect(x - 7, -150, 14, 60, DPAL[i % 8], 4, 4) + G(tr(x, -165, 1 + .15 * Math.sin(t * 20 + i)), path('M0 -22Q12 -4 0 6Q-12 -4 0 -22Z', '#ffb03a', 3)); }
    return paper(SX.paper) + gobo(T, .12) + burst(CX, 980, 300, t, .05, '#ffe1b8', 16) +
      cutout(heroP({ x: 330, y: 1450, s: 1.25, expr: 'happy', armR: [-40, -70] }, t), 10) + cutout(G(tr(760, 1180), rect(-190, -90, 380, 150, '#ff8fb1', 24, 6) + rect(-190, -90, 380, 40, '#fff', 20, 0) + candles + rect(-220, 60, 440, 20, '#fff', 8, 5)), 10) +
      funTag(CX, 520, '8 ANS', t, at(2, '8') - .1, { size: 96, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [at(2, '8') - .1, 'pop', .7], [.2, 'tada', .4]] });

// B003 — « Tu regardes Kevin droit dans les yeux » : un regard part sur Kevin… l'autre sur la plante
B(3, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1, 1.05, t / d) }),
  draw: (t, d, T) => { const Dr = at(3, 'droit'), Y = at(3, 'yeux');
    return paper('#efe8ff') + gobo(T, .1) + cutout(heroP({ x: 300, y: 1460, s: 1.3, expr: 'neutral', look: [1, 0], dev: [-1.6, .15] }, t), 10) + cutout(kevin({ x: 800, y: 1460, s: 1.3, expr: 'happy', flip: 1 }, t), 10) +
      cutout(dPot(560, 1240, .9, t, 1), 8) + markerArrow(360, 980, 740, 980, t, Dr, { bend: 50, col: SX.acc }) + markerArrow(360, 1030, 560, 1080, t, at(3, 'dans'), { bend: -40, col: SX.acc2 }) +
      funTag(CX, 470, 'DROIT DANS LES YEUX', t, Dr - .05, { size: 46, bg: SX.acc, fg: '#fff' }) + markerText('…ou la plante ?', 640, 640, t, at(3, 'dans') + .05, { size: 46 }); },
  sfx: [[at(3, 'regardes'), 'pop_hi', .4], [at(3, 'droit') - .05, 'pop', .6], [at(3, 'droit'), 'scratch', .5], [at(3, 'dans'), 'boing', .5]] });

// B004 — « Il se retourne » : cour d'école, Kevin pivote pour voir derrière lui… personne (un pigeon)
B(4, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Rt = at(4, 'retourne') - .1, turned = t > Rt;
    return depth({ zoom: 1, x: Math.sin(t) * 14 }, [{ z: 1.5, svg: schoolyard(t), haze: .08 },
      { z: 1, svg: heroP({ x: 300, y: 1480, s: 1.3, expr: 'neutral', look: [1, 0], dev: drift(t, 1.5) }, t) + kevin({ x: 780, y: 1480, s: 1.3, expr: turned ? 'confused' : 'happy', flip: turned ? 0 : 1, look: turned ? [1, 0] : [0, 0] }, t) + motionLines(700, 1000, 3, 60, 0) },
      { z: .6, svg: blur(10, dBush(1000, 1900, 1.6)) }]) + (turned ? qmark(900, 820, .7, SX.acc2, 12) : ''); },
  sfx: [[0, 'whoosh', .5], [at(4, 'retourne') - .1, 'whoosh_up', .6], [at(4, 'retourne') + .1, 'hmm', .4]] });

// B005 — « Tu parles à qui ? » : crash zoom sur Kevin qui cherche derrière lui (un pigeon le fixe)
B(5, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.12, eOutCubic(clamp(t / .4))), hand: .3 }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: schoolyard(t), haze: .25 }, { z: 1, svg: kevinHead(CX, 900, 200, { expr: 'confused', look: [Math.sin(t * 6), 0] }, t) +
    G(tr(880, 1130), ell(0, 0, 60, 46, '#9aa3ad', 6) + circ(40, -46, 30, '#9aa3ad', 6) + circ(48, -52, 7, OL, 0) + path('M68 -44L92 -38L68 -32Z', '#ffb03a', 4)) }]) +
    funTag(CX, 460, 'À QUI ?', t, at(5, 'qui') - .1, { size: 70, bg: SX.acc2, fg: SX.ink }) + qmark(240, 640, .8, '#fff', -14),
  sfx: [[0, 'whoosh', .6], [at(5, 'parles'), 'hmm', .5], [at(5, 'qui') - .1, 'pop', .6], [.5, 'chirp', .4]] });

// B006 — « À toi, Kevin ! » : le héros pointe Kevin (un œil sur lui, l'autre ailleurs), Kevin sursaute
B(6, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const Kv = at(6, 'kevin');
    return schoolyard(t) + WASH() + heroP({ x: 330, y: 1500, s: 1.35, expr: 'angry', look: [1, 0], dev: [-1.7, 0], armR: [-15, -10] }, t) + kevin({ x: 790, y: 1500 - (t > Kv ? 30 * Math.max(0, Math.sin((t - Kv) * 12)) : 0), s: 1.35, expr: t > Kv ? 'shock' : 'confused', flip: 1 }, t) +
      funTag(330, 470, 'À TOI !', t, at(6, 'toi') - .05, { size: 70, bg: SX.acc, fg: '#fff' }) + kword('KEVIN !', 780, 600, t, Kv - .05, { size: 92, fill: SX.acc2, r: 4 }) + (t > Kv ? emark(900, 860, .6) : ''); },
  sfx: [[at(6, 'toi') - .05, 'pop', .6], [at(6, 'kevin') - .05, 'boing', .7], [at(6, 'kevin'), 'gasp', .5]] });

// B007 — « Je te regarde depuis 10 minutes ! » : l'horloge s'emballe, toiles d'araignée sur le héros, compteur 10 MIN
B(7, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const Mn = at(7, '10'), n = counter(0, 10, t, at(7, 'depuis'), Mn - at(7, 'depuis') + .3);
    const web = G(tr(170, 790), path('M0 0L120 -40M0 0L110 60M0 0L40 120M30 -10Q50 30 20 50M70 -24Q90 40 50 90', 'none', 3, 'rgba(255,255,255,.8)'));
    return schoolyard(t) + WASH() + heroP({ x: 300, y: 1500, s: 1.35, expr: 'suspicious', face: { eyes: 'dot' }, look: [1, 0], dev: [-1.6, 0] }, t) + (t > Mn ? web : '') + kevin({ x: 790, y: 1500, s: 1.35, expr: 'embarrassed', flip: 1 }, t) +
      G(tr(780, 560), circ(0, 0, 120, '#fff', 8) + G(`rotate(${f1(t * 900)})`, line(0, 0, 0, -90, 8)) + G(`rotate(${f1(t * 75)})`, line(0, 0, 50, 0, 10)) + circ(0, 0, 10, OL, 0)) +
      funTag(330, 470, n + ' MIN', t, at(7, 'depuis'), { size: 80, bg: SX.acc2, fg: SX.ink }) + (t > Mn ? popStars(330, 470, t, Mn, 6, 160) : ''); },
  sfx: [[at(7, 'regarde'), 'clock_fast', .5], [at(7, 'depuis'), 'pop_hi', .4], [at(7, '10'), 'boom', .5], [at(7, 'minutes'), 'crickets', .4]] });

// B008 — « Bienvenue dans la vie de quelqu'un qui a un strabisme » : paillasson BIENVENUE, débloqué en étoiles
B(8, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const S = at(8, 'strabisme');
    return paper('#ece4ff') + gobo(T, .1) + unlock(CX, 980, t, S, { part: 'back', r: 470 }) + G(tr(CX, 1300), rect(-330, -40, 660, 120, '#c58e55', 30, 7) + ftext(-205, 42, 'BIEN', { size: 60, fill: '#7a4a2a', stroke: 'none' }) + ftext(205, 42, 'VENUE', { size: 60, fill: '#7a4a2a', stroke: 'none' })) +
      cutout(heroP({ x: CX, y: 1290, s: 1.3, expr: 'happy', armL: [200, 230], armR: [-20, -50] }, t), 12) + unlock(CX, 980, t, S, { part: 'front', r: 470 }) +
      kthin('bienvenue dans la vie de', CX, 400, t, at(8, 'bienvenue') - .1, { size: 52 }) + kthin("quelqu'un qui a un", CX, 480, t, at(8, 'quelqu') - .1, { size: 52 }) + kword('STRABISME', CX, 610, t, S - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'magic', .5], [at(8, 'bienvenue'), 'pop_hi', .4], [at(8, 'quelqu'), 'pop_hi', .4], [at(8, 'strabisme') - .05, 'tada', .6], [at(8, 'strabisme'), 'sparkle', .5]] });

// B009a — « Tes deux yeux ne regardent pas toujours » : cabinet d'ophtalmo, gros plan, étiquettes ŒIL 1 / ŒIL 2
const O9 = at(9, 'exactement') - .15;
B(9, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Dx = at(9, 'deux');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: sbOphtalmo(t), haze: .2 }, { z: 1, svg: heroHead(CX, 920, 230, { expr: 'neutral', look: [Math.sin(t * 2) * .4, 0], dev: drift(t, 1.1) }, t) }]) +
      funTag(330, 650, 'ŒIL 1', t, Dx, { size: 44, bg: SX.cool, fg: SX.ink, r: -8 }) + funTag(760, 650, 'ŒIL 2', t, Dx + .2, { size: 44, bg: SX.acc, fg: '#fff', r: 8 }) +
      kthin('ne regardent pas toujours…', CX, 420, t, at(9, 'regardent') - .1, { size: 54 }); },
  sfx: [[0, 'whoosh', .5], [at(9, 'deux'), 'pop_hi', .5], [at(9, 'deux') + .2, 'pop_hi', .5], [at(9, 'regardent'), 'hmm', .4]] });
// B009b — « …exactement dans la même direction » : deux yeux-boussoles qui pointent chacun ailleurs (concept)
B(9, { enter: 'none', trans: 'zoom', transD: .22, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const Mm = at(9, 'meme') - O9, a = Math.sin(t * 3) * .6;
    return gridBg('#2a1f4a') + halftoneFade(SX.acc, .08, 1) + cutout(sbEyeball(330, 940, 1.5, t, { look: [Math.cos(a) * .9, Math.sin(a) * .5], iris: '#5ee0a0', legs: 1 }), 10) + cutout(sbEyeball(750, 940, 1.5, t, { look: [-.9, -.6 + Math.sin(t * 5) * .3], iris: SX.acc, legs: 1, sweat: 1 }), 10) +
      markerArrow(330, 720, 120, 520, t, .15, { bend: 40, col: SX.cool }) + markerArrow(750, 720, 980, 560, t, .3, { bend: -40, col: SX.acc2 }) +
      kword('MÊME DIRECTION ?', CX, 450, t, Mm - .05, { size: 72, fill: SX.acc2 }) + cross(CX, 640, .5, t, Mm + .4); },
  sfx: [[0, 'whoosh', .5], [.15, 'scratch', .4], [.3, 'scratch', .4], [at(9, 'meme') - O9 - .05, 'boom', .5], [at(9, 'meme') - O9 + .4, 'error_beep', .5]] }, O9);

// B010 — « L'un fixe un objet » : l'ophtalmo tient un stylo-lampe, l'œil 1 le suit parfaitement
B(10, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .2 }),
  draw: (t, d, T) => { const F = at(10, 'fixe'), px = 640 + Math.sin(t * 3) * 60;
    return sbOphtalmo(t) + sbExamChair(330, 1300, .9) + heroP({ x: 330, y: 1480, s: 1.3, expr: 'neutral', look: [.8 + Math.sin(t * 3) * .2, -.2], dev: [-1.7, .2] }, t) +
      sbDoc({ x: 860, y: 1500, s: 1.2, expr: 'happy', flip: 1, armR: [-10, -30] }, t) + G(tr(px, 900, 1, -20), rect(-10, -70, 20, 110, '#e2463a', 8, 4) + circ(0, -78, 14, '#fff6a0', 4) + op(.5, glow(0, -78, 60, '#fff6a0', .8))) +
      markerCircle(px, 830, 70, 70, t, F + .1, { col: SX.cool }) + funTag(330, 470, 'ŒIL 1 : FIXE', t, F - .05, { size: 50, bg: SX.cool, fg: SX.ink }) + markerText('objet', px, 700, t, at(10, 'objet'), { size: 48 }); },
  sfx: [[0, 'thud', .4], [at(10, 'fixe') - .05, 'pop', .6], [at(10, 'fixe') + .1, 'scratch', .4], [at(10, 'objet'), 'glint', .5]] });

// B011a — « L'autre peut dévier vers l'intérieur, l'extérieur » : gros plan, l'œil 2 part en dedans puis en dehors (flèches GPS)
const O11 = at(11, 'haut') - .22;
B(11, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const In = at(11, 'interieur'), Ex = at(11, 'exterieur'), dx = t < In - .1 ? -.2 : t < Ex - .1 ? -1.9 : 1.9;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: sbOphtalmo(t), haze: .3 }, { z: 1, svg: heroHead(CX, 900, 240, { expr: 'worried', dev: [dx, 0] }, t) }]) +
      funTag(CX, 430, "L'AUTRE PEUT DÉVIER", t, at(11, 'autre') - .1, { size: 46, bg: SX.acc, fg: '#fff' }) +
      funTag(280, 1180, '→ INTÉRIEUR', t, In - .05, { size: 40, bg: SX.acc2, fg: SX.ink, r: -6 }) + funTag(800, 1180, 'EXTÉRIEUR →', t, Ex - .05, { size: 40, bg: SX.cool, fg: SX.ink, r: 6 }) +
      (t > In - .1 && t < Ex - .1 ? markerArrow(820, 640, 640, 760, t, In - .1, { bend: 30, col: SX.acc2 }) : '') + (t > Ex - .1 ? markerArrow(680, 760, 900, 640, t, Ex - .1, { bend: -30, col: SX.cool }) : ''); },
  sfx: [[at(11, 'devier'), 'whoosh', .4], [at(11, 'interieur') - .1, 'boing', .5], [at(11, 'interieur') - .05, 'pop_hi', .4], [at(11, 'exterieur') - .1, 'boing', .5], [at(11, 'exterieur') - .05, 'pop_hi', .4]] });
// B011b — « …le haut ou le bas » : panneau d'ascenseur ▲ ▼ qui s'allume, la pupille monte… puis descend (ding)
B(11, { enter: 'crash', cam: (t, d) => ({ z: 1.06, shake: 2, r: -4 }),
  draw: (t, d, T) => { const Hh = at(11, 'haut') - O11, Bb = at(11, 'bas') - O11, dy = t < Bb - .05 ? -1.9 : 1.9, up = t < Bb - .05;
    return rays(t, CX, 900, '#efe8ff', '#dccfff', 20) + heroHead(440, 900, 220, { expr: 'shock', dev: [-.3, dy], look: [0, 0] }, t) +
      G(tr(880, 900), rect(-90, -200, 180, 400, '#c9d3dc', 20, 7) + circ(0, -80, 56, up ? '#ffd23f' : '#fff', 6) + path('M-24 -66L0 -104L24 -66Z', OL, 0) + circ(0, 80, 56, up ? '#fff' : '#ffd23f', 6) + path('M-24 66L0 104L24 66Z', OL, 0)) +
      kword(up ? 'HAUT' : 'BAS', 440, 500, t, up ? Hh - .05 : Bb - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(11, 'haut') - O11, 'ding', .6], [at(11, 'haut') - O11 + .05, 'whoosh_up', .4], [at(11, 'bas') - O11 - .05, 'ding', .6], [at(11, 'bas') - O11, 'thud', .4]] }, O11);

// B012a — « Et non, tu ne le fais pas exprès » : rue, le héros secoue la tête, tampon PAS EXPRÈS
const O12 = at(12, 'pour') - .15;
B(12, { enter: 'whip', cam: camHand(1.05, .4),
  draw: (t, d, T) => { const Ex = at(12, 'expres'), nod = Math.sin(t * 16) * 8 * seg(t, at(12, 'non') - .1, at(12, 'non') + .5) * (1 - seg(t, .7, .9));
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 }, { z: 1, svg: G(`rotate(${f1(nod)} 400 1100)`, heroP({ x: 400, y: 1490, s: 1.35, expr: 'embarrassed', dev: drift(t, 1), armL: [200, 160], armR: [-20, 20] }, t)) + kevin({ x: 860, y: 1490, s: 1.2, expr: 'suspicious', flip: 1 }, t) },
      { z: .6, svg: blur(10, dBin(80, 1820, 1.4, '#36a85a')) }]) + funTag(400, 460, 'ET NON !', t, at(12, 'non') - .05, { size: 64, bg: SX.acc, fg: '#fff' }) + stamp(CX, 640, 'PAS EXPRÈS', t, Ex - .05, '#7c4dff', -8, 70); },
  sfx: [[0, 'whoosh', .4], [at(12, 'non') - .05, 'pop', .6], [at(12, 'non'), 'boing', .4], [at(12, 'expres') - .05, 'thud', .7]] });
// B012b — « …pour espionner deux conversations à la fois » : terrasse, un œil sur chaque table (fantasme d'espion barré)
B(12, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Es = at(12, 'espionner') - O12, Cv = at(12, 'conversations') - O12;
    return restoT(t, { diners: false }) + adult(2, { x: 150, y: 1470, s: 1.05, expr: 'talk' }, t) + adult(4, { x: 300, y: 1470, s: 1.0, expr: 'laugh', flip: 1 }, t + 1) + adult(3, { x: 800, y: 1470, s: 1.0, expr: 'talk' }, t + .5) + adult(0, { x: 950, y: 1470, s: 1.05, expr: 'shock', flip: 1 }, t + 2) +
      heroP({ x: CX, y: 1480, s: 1.25, expr: 'neutral', look: [-1, 0], dev: [2, 0], holdR: G(tr(0, -30), rect(-40, -60, 80, 120, '#fff', 6, 4) + rect(-30, -45, 60, 10, '#9aa', 2, 0)) }, t) +
      chatBubble(230, 860, 260, 100, 'bla bla', t, Cv - .1, false, 40) + chatBubble(860, 860, 260, 100, 'potins !', t, Cv + .1, true, 40) +
      funTag(CX, 450, 'ESPION ?', t, Es - .05, { size: 64, bg: '#2b2420', fg: '#fff' }) + cross(CX, 450, .6, t, at(12, 'conversations') - O12 + .3) + markerText('×2', CX, 640, t, at(12, 'deux') - O12, { size: 60 }); },
  sfx: [[at(12, 'espionner') - O12 - .05, 'tiptoe', .6], [at(12, 'deux') - O12, 'pop_hi', .4], [at(12, 'conversations') - O12 - .1, 'pop', .5], [at(12, 'fois') - O12, 'error_beep', .5]] }, O12);

// B013 — « À l'école, tu poses une question au professeur » : classe, main levée, bulle ?
B(13, { enter: 'none', trans: 'up', transD: .25, cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const Q = at(13, 'question'); const board = ftext(540, 560, 'LES YEUX', { size: 70, fill: 'rgba(255,255,255,.85)', stroke: 'none' }) + ftext(540, 680, 'ŒIL + ŒIL = ?', { size: 60, fill: 'rgba(255,255,255,.7)', stroke: 'none' });
    return classroomT(t, board) + sbProf({ x: 160, y: 1260, s: .85, expr: 'talk', armL: [200, 250] }, t) + kid(1, { x: 820, y: 1480, s: 1.2, expr: 'neutral', flip: 1 }, t) + heroP({ x: 380, y: 1500, s: 1.25, expr: 'talk', look: [-1, -.5], dev: [1.7, 0], armR: t > at(13, 'poses') ? [-80, -95] : [70, 80] }, t) +
      chatBubble(420, 760, 140, 120, '?', t, Q - .05, true, 80) + funTag(CX, 400, "À L'ÉCOLE", t, at(13, 'ecole') - .1, { size: 54, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'school_bell', .4], [at(13, 'ecole') - .1, 'pop', .5], [at(13, 'poses'), 'whoosh_up', .4], [at(13, 'question') - .05, 'pop_hi', .5]] });

// B014 — « Il répond à ton voisin » : le prof répond au voisin (flèche), le voisin ne comprend rien
B(14, { enter: 'whip', cam: (t, d) => ({ z: 1.06, hand: .4, r: 3 }),
  draw: (t, d, T) => { const V = at(14, 'voisin');
    return classroomT(t) + sbProf({ x: 160, y: 1260, s: .85, expr: 'happy', armR: [-20, -10] }, t) + kid(1, { x: 820, y: 1480, s: 1.2, expr: t > V ? 'shock' : 'confused', flip: 1 }, t) + heroP({ x: 380, y: 1500, s: 1.25, expr: 'sad', look: [-1, -.5], dev: [1.7, 0], armR: [-80, -95] }, t) +
      markerArrow(300, 760, 760, 880, t, at(14, 'repond'), { bend: 120, col: SX.acc2 }) + funTag(820, 560, 'MOI ?!', t, V - .05, { size: 60, bg: SX.acc, fg: '#fff' }) + qmark(260, 820, .5, '#fff', -10); },
  sfx: [[at(14, 'repond'), 'scratch', .5], [at(14, 'voisin') - .05, 'boing', .6], [at(14, 'voisin') + .2, 'gasp', .4]] });

// B015 — « Sur la photo de classe, Kevin demande » : gradins, photographe, FLASH
B(15, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const P = at(15, 'photo'), fl = clamp(1 - (t - P) / .25);
    return depth({ zoom: 1 }, [{ z: 1.3, svg: sbBleachers(t), haze: .05 },
      { z: 1, svg: heroP({ x: 430, y: 1470, s: 1.15, expr: 'happy', dev: drift(t, 1) }, t) + kevin({ x: 700, y: 1470, s: 1.15, expr: t > at(15, 'kevin') ? 'suspicious' : 'happy', look: [-1, 0] }, t) },
      { z: .6, svg: blur(8, sbTripod(960, 1500, 1.1)) }]) + (t > P ? op(fl * .85, rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0)) : '') +
      funTag(CX, 450, 'PHOTO DE CLASSE', t, P - .05, { size: 54, bg: SX.acc2, fg: SX.ink }) + chatBubble(780, 700, 200, 90, '…hmm', t, at(15, 'demande') - .1, false, 36); },
  sfx: [[at(15, 'photo') - .1, 'pop', .5], [at(15, 'photo'), 'shutter', .8], [at(15, 'photo') + .05, 'flash_hit', .4], [at(15, 'kevin'), 'hmm', .5]] });

// B016 — « Attends, tu regardais l'appareil ou la fenêtre ? » : Kevin brandit la photo, deux flèches APPAREIL / FENÊTRE
B(16, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ap = at(16, 'appareil'), Fe = at(16, 'fenetre');
    return hallway(t) + WASH() + kevin({ x: 900, y: 1500, s: 1.25, expr: 'suspicious', flip: 1, armR: [-40, -60], armL: [200, 220] }, t) + heroP({ x: 160, y: 1500, s: 1.15, expr: 'embarrassed', dev: drift(t, 1) }, t) +
      card(500, 880, 540, 380, G(tr(0, 0, .88), sbClassPhoto(t, [-1.8, 0])), t, .1, { ry: 0, thick: 10, r: -4, bw: 6 }) +
      funTag(330, 480, 'APPAREIL ?', t, Ap - .05, { size: 50, bg: SX.cool, fg: SX.ink }) + funTag(780, 480, 'FENÊTRE ?', t, Fe - .05, { size: 50, bg: SX.acc, fg: '#fff' }) +
      markerArrow(400, 540, 485, 830, t, Ap, { bend: 30, col: SX.cool }) + markerArrow(740, 540, 520, 830, t, Fe, { bend: -30, col: SX.acc2 }); },
  sfx: [[0, 'thud', .4], [at(16, 'attends'), 'hmm', .5], [at(16, 'appareil') - .05, 'pop', .6], [at(16, 'fenetre') - .05, 'pop', .6]] });

// B017 — « Magnifique ! » : pouce levé ironique, rayons, confettis tristes
B(17, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 4 }),
  draw: (t, d, T) => rays(t, CX, 900, SX.acc, '#9b7bff', 22) + heroHead(CX, 950, 220, { expr: 'sad', face: { mouth: 'flat', brows: 'flat' }, dev: drift(t, 1) }, t) +
    G(tr(820, 1060, 1, -10), ell(0, 0, 60, 70, SKIN, 6) + rect(-16, -120, 32, 90, SKIN, 16, 6)) + kword('MAGNIFIQUE !', CX, 470, t, at(17, 'magnifique') - .05, { size: 100, fill: SX.acc2 }) + confetti(t, .1, 18),
  sfx: [[0, 'flash_hit', .5], [at(17, 'magnifique') - .05, 'boom', .5], [at(17, 'magnifique') + .2, 'rimshot', .5]] });

// B018 — « Même les photos deviennent un interrogatoire » : salle d'interrogatoire, Kevin détective à la loupe, lampe
B(18, { enter: 'none', trans: 'glitch', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const I = at(18, 'interrogatoire');
    return sbInterro(t) + heroP({ x: 330, y: 1480, s: 1.25, expr: 'scared', dev: drift(t, 1) }, t) + kevin({ x: 790, y: 1480, s: 1.3, expr: 'suspicious', flip: 1, armR: [-30, -50], holdR: magnifier(0, 0, .7, -20) }, t) +
      G(tr(CX, 1300), rect(-420, -30, 840, 40, '#7a5a3a', 8, 6) + rect(-390, 10, 30, 300, '#5a4030', 0, 5) + rect(360, 10, 30, 300, '#5a4030', 0, 5) + G(tr(-40, -40, 1, -8), rect(-80, -60, 160, 110, '#fff', 6, 5) + rect(-66, -48, 132, 70, '#bfe3ff', 3, 0))) +
      funTag(CX, 450, 'INTERROGATOIRE', t, I - .05, { size: 58, bg: '#e2463a', fg: '#fff' }) + kthin('même les photos…', CX, 580, t, at(18, 'photos') - .1, { size: 46 }); },
  sfx: [[0, 'zap', .4], [at(18, 'photos'), 'hmm', .4], [at(18, 'interrogatoire') - .05, 'sting', .6], [at(18, 'interrogatoire') + .3, 'heartbeat', .4]] });

// B019 — « Mais le strabisme, ce n'est pas seulement une histoire d'apparence » : miroir, carte APPARENCE barrée
B(19, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Ap = at(19, 'apparence'), Se = at(19, 'seulement');
    return paper('#efe8ff') + gobo(T, .1) + G(tr(760, 900), rect(-170, -260, 340, 520, '#c38a52', 30, 7) + grad('#e6f6ff', '#bcdcf0', -146, -236, 292, 472) + rect(-146, -236, 292, 472, 'none', 20, 5) + heroHead(0, -20, 110, { expr: 'confused', look: [-1, 0], dev: [1.8, 0] }, t) + op(.5, path('M-110 -200L-40 -230M-120 -150L0 -200', 'none', 10, '#fff'))) +
      cutout(heroP({ x: 300, y: 1470, s: 1.3, expr: 'confused', look: [1, 0], dev: [-1.8, 0] }, t), 10) +
      kthin('pas seulement une histoire', CX, 400, t, Se - .1, { size: 50 }) + kword("D'APPARENCE", CX, 520, t, Ap - .1, { size: 88, fill: SX.acc2 }) + cross(CX, 520, .7, t, Ap + .3); },
  sfx: [[0, 'whoosh', .5], [at(19, 'strabisme'), 'glint', .5], [at(19, 'seulement') - .1, 'pop_hi', .4], [at(19, 'apparence') - .1, 'boom', .5], [at(19, 'apparence') + .3, 'error_beep', .4]] });

// B020 — « les yeux ont du mal à travailler ensemble » : deux yeux-ouvriers portent une planche VISION… chacun dans un sens
B(20, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Tr = at(20, 'travailler'), tug = Math.sin(t * 9) * 16 * seg(t, Tr - .3, Tr);
    return sbOphtalmo(t) + DIM() + G(tr(CX + tug, 1000, 1, tug * .3), rect(-330, -30, 660, 60, '#d9a86c', 10, 6) + ftext(0, 18, 'VISION', { size: 44, fill: '#7a4a2a', stroke: 'none' })) +
      sbEyeball(250 + tug, 1060, 1.1, t, { legs: 1, walk: 30, arms: [-60, -30], look: [-1, 0], iris: '#5ee0a0', sweat: 1 }) + sbEyeball(830 + tug, 1060, 1.1, t, { legs: 1, walk: 30, arms: [-150, -120], look: [1, -.2], iris: SX.acc, sweat: 1 }) +
      motionLines(80, 1000, 3, 70, 180) + motionLines(1000, 1000, 3, 70, 0) + funTag(CX, 460, 'TRAVAIL D’ÉQUIPE', t, Tr - .05, { size: 50, bg: SX.acc2, fg: SX.ink }) + cross(CX, 460, .5, t, at(20, 'ensemble')) + kthin('selon les cas…', CX, 600, t, at(20, 'selon') - .05, { size: 44 }); },
  sfx: [[at(20, 'selon'), 'pop_hi', .4], [at(20, 'yeux'), 'squeak', .5], [at(20, 'travailler') - .05, 'pop', .5], [at(20, 'ensemble'), 'error_beep', .5], [at(20, 'mal'), 'thud', .4]] });

// B021a — « Tu peux avoir une vision double » : POV, Kevin vu en double qui se dédouble
const O21 = at(21, 'perdre') - .15;
B(21, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .6 }),
  draw: (t, d, T) => { const Db = at(21, 'double'), dx = 40 + 110 * seg(t, Db - .3, Db + .2) + Math.sin(t * 4) * 15;
    return sbDouble(schoolyard(t), dx * .3, .55) + sbDouble(kevin({ x: CX, y: 1500, s: 1.4, expr: 'happy', armR: [-40, -60] }, t), dx, .6) + radial(CX, 900, 1000, 'rgba(20,10,40,0)', '#140a28', .85) +
      kword('VISION DOUBLE', CX, 460, t, Db - .1, { size: 80, fill: SX.acc2 }) + sbDouble(ftext(CX, 600, '×2', { size: 60, fill: '#fff' }), dx * .4, .7); },
  sfx: [[0, 'flash_hit', .5], [at(21, 'vision'), 'whoosh', .5], [at(21, 'double') - .1, 'boom', .5], [at(21, 'double'), 'boing', .5]] });
// B021b — « …perdre une partie de la perception du relief » : Kevin lance la balle, le héros attrape à côté… BONK
B(21, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), shake: t > at(21, 'relief') - O21 ? 6 : 0 }),
  draw: (t, d, T) => { const Rl = at(21, 'relief') - O21, k = clamp(t / Rl), hit = t > Rl;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: schoolyard(t), haze: .08 },
      { z: 1, svg: heroP({ x: 320, y: 1490, s: 1.3, expr: hit ? 'dizzy' : 'neutral', look: [1, -.3], dev: drift(t, 1.3), armR: [-30, -60], armL: [190, 170] }, t) + kevin({ x: 870, y: 1490, s: 1.25, expr: hit ? 'shock' : 'happy', flip: 1, armR: [-40, -60] }, t) +
        (hit ? impactStar(320, 840, .6) + dBall(420 + (t - Rl) * 300, 900 + (t - Rl) * 400, .8, t) : dBall(lerp(790, 330, k), lerp(900, 880, k) - Math.sin(k * 3.14) * 200, .8, t)) +
        G(tr(560, 980), rect(-20, -20, 40, 40, 'none', 4, 4, SX.cool) + op(.6, circ(0, 0, 4, SX.cool, 0))) }]) +
      funTag(CX, 450, 'RELIEF ?', t, at(21, 'perception') - O21 - .05, { size: 60, bg: SX.cool, fg: SX.ink }) + (hit ? kword('BONK', 300, 640, t, Rl, { size: 100, fill: SX.acc2, r: -8 }) : '') + markerText('3D → 2D', 820, 640, t, at(21, 'partie') - O21, { size: 50 }); },
  sfx: [[at(21, 'perdre') - O21, 'whoosh', .5], [at(21, 'perception') - O21 - .05, 'pop', .5], [at(21, 'relief') - O21, 'boing', .8], [at(21, 'relief') - O21 + .05, 'thud', .6], [at(21, 'relief') - O21 + .2, 'chirp', .4]] }, O21);

// B022 — « ou développer une baisse de vision d'un œil pendant l'enfance » : cache-œil-cuillère, le tableau devient flou
B(22, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.09, t / d), hand: .2 }),
  draw: (t, d, T) => { const Bs = at(22, 'baisse'), bl = 9 * seg(t, Bs - .1, Bs + .5);
    return sbOphtalmo(t, { blur: bl }) + sbExamChair(560, 1300, .9) + heroP({ x: 560, y: 1480, s: 1.3, expr: 'worried', look: [-1, -.6], dev: [0, -.6], armL: [230, 300], holdL: G(tr(0, 0, 1, 30), line(0, 0, 0, -120, 12, '#36a85a') + ell(0, -150, 46, 56, '#36a85a', 6)) }, t) +
      sbDoc({ x: 900, y: 1500, s: 1.2, expr: 'calm', flip: 1, armL: [200, 160] }, t) + markerCircle(170, 560, 170, 250, t, Bs + .1, { col: SX.acc }) +
      funTag(CX, 430, 'UN ŒIL PLUS FAIBLE', t, Bs - .05, { size: 48, bg: SX.acc, fg: '#fff' }) + funTag(560, 560, "PENDANT L'ENFANCE", t, at(22, 'pendant') - .05, { size: 36, bg: SX.acc2, fg: SX.ink, r: 4 }); },
  sfx: [[0, 'whoosh', .4], [at(22, 'developper'), 'magic', .3], [at(22, 'baisse') - .05, 'pop', .6], [at(22, 'vision'), 'hmm', .4], [at(22, 'pendant') - .05, 'pop_hi', .4]] });

// B023 — « Heureusement, il existe des prises en charge » : l'ophtalmo arrive en héroïne, débloqué en étoiles
B(23, { enter: 'none', trans: 'zoom', transD: .25, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Hz = at(23, 'heureusement'), Pc = at(23, 'prises');
    return sbOphtalmo(t) + unlock(760, 900, t, Hz, { part: 'back', r: 460 }) + sbDoc({ x: 760, y: 1500, s: 1.35, expr: 'joy', flip: 1, armR: [-60, -100], armL: [210, 250] }, t) + unlock(760, 900, t, Hz, { part: 'front', r: 460 }) +
      heroP({ x: 300, y: 1490, s: 1.25, expr: t > Hz ? 'wow' : 'worried', dev: drift(t, .9) }, t) + (t > Hz ? heartsUp(t, 300, 1000, 4) : '') +
      kword('HEUREUSEMENT', CX, 450, t, Hz - .05, { size: 84, fill: SX.acc2 }) + funTag(CX, 600, 'PRISES EN CHARGE', t, Pc - .05, { size: 44, bg: SX.cool, fg: SX.ink }); },
  sfx: [[at(23, 'heureusement') - .05, 'boom', .5], [at(23, 'heureusement'), 'angel', .6], [at(23, 'heureusement') + .1, 'sparkle', .5], [at(23, 'prises') - .05, 'pop', .5]] });

// B024a — « Lunettes » : SLAM, les lunettes se posent sur le nez (le héros les garde jusqu'à la fin)
const O24b = at(24, 'reeducation') - .15, O24c = at(24, 'et') - .1;
B(24, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 3 }),
  draw: (t, d, T) => { const L = at(24, 'lunettes'), k = eOutBack(seg(t, L, L + .25));
    return rays(t, CX, 900, '#fff3b0', '#ffe066', 22) + heroHead(CX, 950, 220, { expr: t > L + .25 ? 'joy' : 'shock', dev: drift(t, .9), glasses: t > L + .25 }, t) + (t < L + .25 ? sbSpecs(CX, lerp(500, 955, k), 2.1) : popStars(CX, 900, t, L + .25, 8, 260)) +
      kword('LUNETTES', CX, 460, t, L - .05, { size: 100, fill: SX.acc }); },
  sfx: [[0, 'flash_hit', .4], [at(24, 'lunettes') - .05, 'boom', .5], [at(24, 'lunettes') + .25, 'glint', .7]] });
// B024b — « …rééducation dans certaines situations » : cache-œil à étoile + bandeau, le coach-ophtalmo fait suivre le stylo
B(24, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const R0 = at(24, 'reeducation') - O24b, px = 700 + Math.sin(t * 5) * 120;
    return sbOphtalmo(t) + heroP({ x: 330, y: 1490, s: 1.3, expr: 'effort', face: { eyes: 'dot' }, glasses: false, patch: '#ff8fb1', band: 1, look: [Math.sin(t * 5) * .8 + .2, -.3], dev: [-.4, 0], armL: [200, 260], armR: [-20, -60] }, t) + sweatSpray(330, 900, t, 4) +
      sbDoc({ x: 880, y: 1500, s: 1.2, expr: 'happy', flip: 1, armR: [-30, -60] }, t) + G(tr(px, 860, 1, -10), rect(-10, -60, 20, 100, SX.acc, 8, 4) + circ(0, -66, 14, '#fff6a0', 4)) + G(tr(940, 900), circ(0, 0, 14, '#c9d3dc', 4)) +
      funTag(CX, 450, 'RÉÉDUCATION', t, R0 - .05, { size: 60, bg: SX.cool, fg: SX.ink }) + kthin('dans certaines situations', CX, 580, t, at(24, 'certaines') - O24b - .1, { size: 44 }); },
  sfx: [[0, 'whistle', .5], [at(24, 'reeducation') - O24b - .05, 'pop', .6], [.5, 'squeak', .4], [at(24, 'situations') - O24b, 'ding', .4]] }, O24b);
// B024c — « …et parfois chirurgie » : bloc pudique, ophtalmo masquée avec un minuscule outil qui brille, moniteur qui bipe
B(24, { enter: 'none', trans: 'circle', transD: .22, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const Ch = at(24, 'chirurgie') - O24c;
    return sbOphtalmo(t) + DIM(.2) + hospitalBed(CX, 1330, .95) + heroHead(330, 1130, 110, { expr: 'worried', dev: drift(t, .9) }, t) + sbDoc({ x: 760, y: 1500, s: 1.3, expr: 'happy', mask: true, cap: '#5ee0a0', flip: 1, armR: [-40, -70] }, t) +
      G(tr(330, 820), rect(-150, -90, 300, 180, '#2b2b33', 16, 6) + ecg(-130, -60, 260, 120, t)) + (Math.sin(t * 10) > 0 ? sparkle(630, 960, .5, '#fff') : '') +
      funTag(CX, 460, 'PARFOIS : CHIRURGIE', t, Ch - .05, { size: 50, bg: SX.acc, fg: '#fff' }); },
  sfx: [[0, 'ecg_beep', .4], [at(24, 'parfois') - O24c, 'pop_hi', .4], [at(24, 'chirurgie') - O24c - .05, 'pop', .6], [at(24, 'chirurgie') - O24c + .2, 'glint', .5]] }, O24c);

// B025 — « Un jour, Kevin te demande » : parc, banc, glaces, Kevin lève le doigt (question)
B(25, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Kd = at(25, 'kevin');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 }, { z: 1, svg: dBench(CX, 1500, 1.6) + heroP({ x: 340, y: 1490, s: 1.25, expr: 'happy', glasses: 1, dev: drift(t, .9), armR: [-60, -90], holdR: sbIce(0, -30, .9) }, t) +
      kevin({ x: 760, y: 1490, s: 1.25, expr: t > Kd ? 'confused' : 'happy', flip: 1, armR: [-70, -100], armL: [200, 230], holdL: sbIce(0, -30, .9, '#7be07b') }, t) }, { z: .6, svg: blur(10, dFlowers(900, 1900, 5, 3, t)) }]) +
      funTag(CX, 450, 'UN JOUR…', t, at(25, 'jour') - .1, { size: 60, bg: SX.acc2, fg: SX.ink }) + (t > Kd ? qmark(860, 760, .6, SX.acc2, 10) : ''); },
  sfx: [[0, 'chirp', .5], [at(25, 'jour') - .1, 'pop', .5], [at(25, 'kevin'), 'hmm', .5], [at(25, 'demande'), 'pop_hi', .4]] });

// B026 — « Et du coup, tu vois deux Kevin ? » : Kevin en gros plan curieux, bulle de pensée avec DEUX Kevin
B(26, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.1, eOutCubic(clamp(t / .4))), hand: .3 }),
  draw: (t, d, T) => { const Dx = at(26, 'deux');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2), haze: .3 }, { z: 1, svg: kevinHead(380, 1000, 170, { expr: 'wow', look: [1, -.5] }, t) }]) +
      (t > Dx - .2 ? G(tr(760, 700, eOutBack(seg(t, Dx - .2, Dx + .1))), cloud(0, 0, 1.5, '#fff', 6) + kevinHead(-70, 0, 60, { expr: 'happy' }, t) + kevinHead(70, 0, 60, { expr: 'happy' }, t + .5)) + circ(560, 900, 22, '#fff', 5) + circ(510, 960, 14, '#fff', 5) : '') +
      kword('DEUX KEVIN ?', CX, 430, t, Dx - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [at(26, 'coup'), 'hmm', .4], [at(26, 'deux') - .2, 'magic', .5], [at(26, 'deux') - .05, 'boom', .5], [at(26, 'kevin'), 'pop', .5]] });

// B027 — « Tu le regardes, tu réfléchis » : le héros plisse… barre de chargement ANALYSE, engrenages
B(27, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d) }),
  draw: (t, d, T) => { const Rf = at(27, 'reflechis'), k = seg(t, .2, d);
    let gears = ''; for (let i = 0; i < 2; i++) gears += G(tr(430 + i * 210, 560 - i * 40, 1 - i * .3, (i ? -1 : 1) * t * 120), circ(0, 0, 60, '#c9d3dc', 6) + Array.from({ length: 8 }, (_, j) => G(`rotate(${j * 45})`, rect(-14, -84, 28, 30, '#c9d3dc', 4, 5))).join('') + circ(0, 0, 20, OL, 0));
    return streetT(t, 2) + WASH('rgba(40,20,80,.25)') + heroHead(CX, 950, 230, { expr: 'confused', glasses: 1, look: [.3, 0], dev: drift(t, 1) }, t) + (t > Rf - .2 ? gears : '') +
      G(tr(CX, 1200), rect(-260, -30, 520, 60, '#fff', 30, 6) + rect(-250, -20, 500 * k, 40, SX.acc, 20, 0) + ftext(0, -50, 'ANALYSE…', { size: 36, fill: '#fff' })) +
      kthin('tu le regardes…', CX, 400, t, at(27, 'regardes') - .1, { size: 52 }); },
  sfx: [[at(27, 'regardes'), 'hmm', .5], [at(27, 'reflechis') - .2, 'clock_fast', .4], [at(27, 'reflechis'), 'tick', .4], [.9, 'printer', .3]] });

// B028a — « Non. Et crois-moi » : NON sec, rayons, tampon
const O28 = at(28, 'seul') - .25;
B(28, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 5 }),
  draw: (t, d, T) => { const N = at(28, 'non');
    return rays(t, CX, 900, SX.acc, '#9b7bff', 22) + heroHead(CX, 970, 220, { expr: 'smug', face: { eyes: 'dot', mouth: 'smirk' }, glasses: 1, dev: drift(t, .9) }, t) +
      kword('NON.', CX, 480, t, N - .05, { size: 150, fill: '#fff' }) + kthin('et crois-moi…', CX, 640, t, at(28, 'crois') - .05, { size: 50 }); },
  sfx: [[0, 'flash_hit', .5], [at(28, 'non') - .05, 'boom', .6], [at(28, 'crois'), 'pop_hi', .4]] });
// B028b — « …un seul, c'est déjà beaucoup trop » : UN Kevin déjà ingérable (mange ta glace, rot, bazar), jauge TROP qui explose
B(28, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .5 }),
  draw: (t, d, T) => { const Tp = at(28, 'trop') - O28, g = seg(t, .1, Tp);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2), haze: .08 }, { z: 1, svg: dBench(CX, 1500, 1.6) + heroP({ x: 300, y: 1490, s: 1.25, expr: 'deadpan', glasses: 1, armR: [-60, -90], holdR: G(tr(0, -30), path('M-30 0L30 0L0 110Z', '#e8b06a', 5)) }, t) +
      kevin({ x: 640 + Math.sin(t * 8) * 30, y: 1490, s: 1.3, expr: 'mock', flip: 1, armL: [210 + Math.sin(t * 14) * 30, 250], armR: [-50 + Math.sin(t * 12) * 40, -80], holdL: sbIce(0, -30, .9, '#ff8fb1') }, t) + (Math.sin(t * 6) > .3 ? ftext(720, 800, 'BURP', { size: 50, fill: SX.cool }) : '') }]) +
      G(tr(880, 600), rect(-50, -180, 100, 360, '#fff', 30, 7) + rect(-36, 166 - 332 * g, 72, 332 * g, mixC('#5ee0a0', '#e2463a', g), 20, 0) + ftext(0, -210, 'KEVIN-MÈTRE', { size: 26, fill: '#fff' })) +
      funTag(330, 450, '1 SEUL', t, 0, { size: 60, bg: SX.acc2, fg: SX.ink }) + kword('DÉJÀ TROP', 400, 600, t, Tp - .05, { size: 90, fill: SX.acc2, r: -4 }) + (t > Tp ? burst(880, 440, 140, t, Tp, '#e2463a', 12) : ''); },
  sfx: [[0, 'pop', .5], [.4, 'chomp', .5], [at(28, 'deja') - O28, 'squeak', .4], [at(28, 'trop') - O28 - .05, 'boom', .6], [at(28, 'trop') - O28 + .05, 'siren', .3]] }, O28);

// B029a — « Parce que le plus fatigant » : couloir, le héros vidé, batterie à plat
const O29 = at(29, 'ce') - .15;
B(29, { enter: 'none', trans: 'glitch', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Fa = at(29, 'fatigant');
    return hallway(t) + WASH('rgba(40,30,80,.18)') + heroP({ x: CX, y: 1500, s: 1.35, expr: 'sad', face: { mouth: 'wavy' }, glasses: 1, dev: drift(t, 1), rot: 6, armL: [120, 110], armR: [60, 70] }, t) + sbBattery(CX, 640, 1, lerp(.6, .08, seg(t, 0, Fa + .2)), t) +
      kword('FATIGANT', CX, 460, t, Fa - .05, { size: 96, fill: SX.acc2 }) + steam(CX + 150, 860, t, .8); },
  sfx: [[at(29, 'plus'), 'error_beep', .4], [at(29, 'fatigant') - .05, 'boom', .5], [at(29, 'fatigant') + .2, 'wind', .4]] });
// B029b — « …ce n'est pas de devoir expliquer comment fonctionnent tes yeux » : au tableau, schéma des yeux, compteur d'explications
B(29, { enter: 'whip', cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const Ex = at(29, 'expliquer') - O29, n = counter(340, 999, t, Ex, 1.2);
    const board = G(tr(540, 520), sbEyeball(-160, 0, .7, t, { look: [1, 0], iris: '#5ee0a0' }) + sbEyeball(160, 0, .7, t, { look: [-1, .2], iris: SX.acc }) + path('M-100 90Q0 200 100 90', 'none', 6, '#fff') + ftext(0, 220, 'CERVEAU ?', { size: 40, fill: 'rgba(255,255,255,.85)', stroke: 'none' }));
    return classroomT(t, board) + kid(2, { x: 120, y: 1480, s: 1.0, expr: 'sleep' }, t) + kid(4, { x: 960, y: 1480, s: 1.0, expr: 'sleep', flip: 1 }, t + 1) + heroP({ x: 760, y: 1490, s: 1.25, expr: 'talk', glasses: 1, dev: drift(t, 1), armL: [200, 230], holdL: line(0, 0, -160, -120, 8, '#b5835a') }, t) +
      funTag(330, 960, 'EXPLICATION N°' + n, t, Ex - .05, { size: 36, bg: SX.acc2, fg: SX.ink, r: -4 }) + ftext(180, 1040, 'Zzz', { size: 50, fill: '#fff' }) + ftext(940, 1040, 'Zzz', { size: 50, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(29, 'expliquer') - O29 - .05, 'pop', .5], [at(29, 'expliquer') - O29 + .1, 'typing', .4], [at(29, 'yeux') - O29, 'scratch', .4]] }, O29);

// B030a — « C'est de devoir expliquer à des gens » : rue, la foule qui fixe le héros (bouches ouvertes)
const O30 = at(30, 'qui') - .15;
B(30, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Gn = at(30, 'gens');
    return streetT(t, 2) + WASH() + [0, 1, 2, 3].map(i => adult(i, { x: 520 + i * 160, y: 1470 + (i % 2) * 20, s: 1.0, expr: 'deadpan', face: { mouth: 'o-small' }, flip: 1 }, t + i)).join('') + heroP({ x: 220, y: 1490, s: 1.25, expr: 'talk', glasses: 1, dev: drift(t, 1), armR: [-30, -50] }, t) +
      kthin('expliquer à des', CX, 430, t, at(30, 'expliquer') - .05, { size: 56 }) + kword('GENS…', CX, 560, t, Gn - .05, { size: 100, fill: SX.acc2 }) + chatBubble(300, 760, 220, 90, '…les yeux', t, at(30, 'expliquer'), true, 34); },
  sfx: [[at(30, 'expliquer'), 'pop_hi', .4], [at(30, 'gens') - .05, 'boom', .5], [at(30, 'gens') + .2, 'crickets', .5]] });
// B030b — FIN : « …qui n'utilisent visiblement pas les leurs » : Kevin le nez sur son téléphone percute le lampadaire ; le héros chill
B(30, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(30, 'visiblement') - O30 + .3 && t < at(30, 'visiblement') - O30 + .6 ? 8 : 0 }),
  draw: (t, d, T) => { const V = at(30, 'visiblement') - O30, hit = t > V + .3, Lr = at(30, 'leurs') - O30, kx = hit ? 760 : lerp(560, 760, clamp(t / (V + .3)));
    return streetT(t, 2) + WASH() + dLampPost(830, 1500, 1.5) + heroP({ x: 250, y: 1490, s: 1.25, expr: 'chill', glasses: 1, armR: [-40, -60] }, t) +
      kevin({ x: kx, y: 1490, s: 1.25, expr: hit ? 'dizzy' : 'happy', look: [0, 1], rot: hit ? -8 : 0, armR: [-60, -100], holdR: phone(0, -20, .5, -10) }, t) + (hit ? impactStar(850, 960, .5) + popStars(780, 1000, t, V + .3, 6, 140) : '') +
      kthin("qui n'utilisent visiblement", CX, 380, t, V - .1, { size: 54 }) + kword('PAS LES LEURS.', CX, 510, t, Lr - .1, { size: 92, fill: SX.acc2 }) + (t > Lr ? confetti(t, Lr, 30) : ''); },
  sfx: [[0, 'flash_hit', .4], [at(30, 'visiblement') - O30, 'tiptoe', .4], [at(30, 'visiblement') - O30 + .3, 'thud', .8], [at(30, 'visiblement') - O30 + .35, 'boing', .5], [at(30, 'leurs') - O30, 'rimshot', .6]] }, O30);

SCENES.sort((a, b) => a.s - b.s);
