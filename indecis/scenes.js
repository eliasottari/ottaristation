// ============================================================
//  « Pourquoi c'est horrible d'être indécis ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Héros : un épi en forme de « ? » sur la tête + un « ? » sur le t-shirt, des flèches qui oscillent autour de lui.
//  Les CAPITALES du script = moments criés → kword slam + flash + shake.
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

// ---------- SIZEX fun : accent VIOLET « hésitation » (propre à l'épisode), jaune marqueur ----------
sxFun('#8b5cf6'); SX.acc2 = '#ffd23f'; SX.cool = '#8fd0ff';
const LIL = '#c9b3ff', VAN = '#fff3c4', CHOC = '#8a5a3a', HAIRC = '#3a2a20', KGREEN = '#5fb85f';

// ============================================================
//  LE HÉROS : épi en point d'interrogation qui gigote + « ? » sur le t-shirt
// ============================================================
const HERO_SHIRT = '#8b5cf6';
function idHair(r, t, o) { const [b, f] = hairSvg('short', o.hairColor || HAIRC, r, t), w = Math.sin(t * 3.2) * 9;
  const d = `M${f1(-r * .22)} ${f1(-r * 1.4)}Q${f1(-r * .24)} ${f1(-r * 1.74)} ${f1(r * .06)} ${f1(-r * 1.74)}Q${f1(r * .36)} ${f1(-r * 1.72)} ${f1(r * .32)} ${f1(-r * 1.46)}Q${f1(r * .28)} ${f1(-r * 1.26)} ${f1(r * .03)} ${f1(-r * 1.2)}L${f1(r * .03)} ${f1(-r * .98)}`;
  return [b, f + G(`rotate(${f1(w)} 0 ${f1(-r)})`, path(d, 'none', r * .22) + path(d, 'none', r * .12, o.hairColor || HAIRC))]; }
const idChest = (topY, hipY) => ftext(0, (topY + hipY) / 2 + 20, '?', { size: 58, fill: '#fff' });
const heroP = (o, t) => person(Object.assign({ age: 'kid', hairFn: idHair, hairColor: HAIRC, shirt: HERO_SHIRT, pants: '#3b3f4a', chest: idChest, seed: 2 }, o), t);
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: idHair, hairColor: HAIRC, seed: 2 }, o), t));
// regard qui fait gauche-droite (indécision)
const idLook = (t, sp = 7) => [Math.sin(t * sp) > 0 ? 1.1 : -1.1, 0];
// la fille du rendez-vous
const idGirl = (o, t) => kid(3, Object.assign({ hair: 'long', hairColor: '#1f1a18', shirt: '#ff8fb1', skin: SK[1], seed: 33 }, o), t);
const idGirlHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'long', hairColor: '#1f1a18', skin: SK[1], seed: 33 }, o), t));

// ---------- aides motion / gags ----------
const idFlash = (t, t0, k = .85) => t < t0 || t > t0 + .25 ? '' : op(k * (1 - seg(t, t0, t0 + .25)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0));
// flèche (dir 1 = droite, -1 = gauche)
const idArrow = (x, y, dir, str, c, a = 0, s = 1) => G(tr(x, y, s, a), path(dir > 0 ? 'M-130 -38L70 -38L70 -66L150 0L70 66L70 38L-130 38Z' : 'M130 -38L-70 -38L-70 -66L-150 0L-70 66L-70 38L130 38Z', c, 7) + (str ? ftext(dir * -16, 13, str, { size: 34, fill: '#fff' }) : ''));
// panneau à deux flèches qui oscillent (pied en yb)
function idSign(x, yb, s, t, A = 'ICI', B_ = 'LÀ', sp = 5, ph = 0) { const a1 = Math.sin(t * sp + ph) * 28, a2 = Math.sin(t * sp + ph + 2.2) * 28;
  return G(tr(x, yb, s), rect(-14, -520, 28, 520, '#8a5a3a', 6, 6) + G(tr(0, -440, 1, a1), idArrow(80, 0, 1, A, SX.acc, 0, .8)) + G(tr(0, -330, 1, a2), idArrow(-80, 0, -1, B_, '#36a85a', 0, .8)) + circ(0, -520, 18, SX.acc2, 5)); }
// balance de l'hésitation (pivot en x,y) ; inL / inR = contenu des plateaux
function idScale(x, y, s, t, inL = '', inR = '', a = Math.sin(t * 4) * 14) { const rr = R(a), ex = Math.cos(rr) * 220, ey = Math.sin(rr) * 220;
  const pan = (px, py, inner) => G(tr(px, py), line(-80, 110, 0, 0, 5) + line(80, 110, 0, 0, 5) + G(tr(0, 96), inner) + path('M-120 110Q0 170 120 110Z', SX.acc2, 6));
  return G(tr(x, y, s), rect(-90, 360, 180, 30, '#c58e55', 10, 6) + rect(-16, 0, 32, 370, SX.acc2, 8, 6) + pan(-ex, -ey, inL) + pan(ex, ey, inR) + line(-ex, -ey, ex, ey, 20) + line(-ex, -ey, ex, ey, 10, SX.acc2) + circ(0, 0, 26, SX.acc, 6)); }
// toiles d'araignée (héros figé)
const idWeb = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), [0, 1, 2, 3, 4].map(i => line(0, 0, Math.cos(R(i * 22.5)) * 120, Math.sin(R(i * 22.5)) * 120, 3, 'rgba(255,255,255,.9)')).join('') + [40, 75, 110].map(rr => path(`M${rr} 0` + [1, 2, 3, 4].map(i => `Q${f1(Math.cos(R(i * 22.5 - 11)) * rr * .8)} ${f1(Math.sin(R(i * 22.5 - 11)) * rr * .8)} ${f1(Math.cos(R(i * 22.5)) * rr)} ${f1(Math.sin(R(i * 22.5)) * rr)}`).join(''), 'none', 3, 'rgba(255,255,255,.9)')).join(''));
// éclair dessiné
const idBolt = (x, y, s = 1, c = '#ffe14d') => G(tr(x, y, s), path('M0 -120L-50 10L-10 10L-40 130L60 -30L15 -30L45 -120Z', c, 6));
// petite ampoule
const idBulb = (x, y, s, on, t) => G(tr(x, y, s), (on ? op(.45 + .1 * Math.sin(t * 9), circ(0, -10, 110, '#fff6a0', 0)) : '') + circ(0, -20, 60, on ? '#fff36a' : '#e8e8e8', 7) + rect(-30, 34, 60, 40, '#9aa3ad', 8, 6) + line(-26, 50, 26, 50, 4) + (on ? path('M-20 -10Q0 -40 20 -10', 'none', 5, '#e8b923') : ''));

// ---------- glaces ----------
const idCone = (x, y, s = 1, c = VAN, melt = 0, r = 0) => G(tr(x, y, s, r), path('M-52 0L0 150L52 0Z', '#e8a85a', 6) + path('M-34 22L26 22M-24 52L16 52M-14 82L8 82', 'none', 4, '#b8783a') +
  circ(0, -30, 60, c, 6) + (melt > 0 ? path(`M-56 -14Q-48 ${f1(20 + melt * 90)} -34 -2Q-22 ${f1(16 + melt * 130)} -6 2Q10 ${f1(24 + melt * 70)} 30 -4Q40 ${f1(14 + melt * 100)} 54 -12Z`, c, 5) : '') + ell(-20, -52, 15, 9, 'rgba(255,255,255,.6)', 0));
// glacier qui vieillit (age 0 → 3)
const idGlacier = (age, o, t) => adult(1, Object.assign({ hair: age >= 2 ? 'bald' : 'short', hairColor: ['#5a3a26', '#8a7a6a', '#c9c9cf', '#eeeeee'][age], wrinkles: age >= 2, mustache: age >= 1, beard: age >= 3, glasses: age >= 2, shirt: '#fff', apron: '#ff8fb1', skin: SK[2], seed: 81 }, o), t);
// boutique de glaces (fond) — le comptoir se dessine APRÈS le glacier
function idShop(t, o = {}) { const yb = 1250;
  let s = dWall('stripe', '#ffeaf2', '#ffdbe9', yb) + dBase(yb, '#ff8fb1');
  s += dNeon(540, 190, 'GLACES', '#ff5c8a', t, 72);
  s += G(tr(190, 480, 1, -2), rect(-140, -170, 280, 340, '#8a5a3a', 18, 7) + rect(-122, -152, 244, 304, '#2f3a35', 10, 0) + ftext(0, -100, 'PARFUMS', { size: 34, fill: '#fff', stroke: 'none' }) +
    ['VANILLE', 'CHOCOLAT', 'FRAISE', 'PISTACHE'].map((f, i) => circ(-92, -44 + i * 56, 12, [VAN, CHOC, '#ff8fb1', '#9be37b'][i], 3) + ftext(-68, -34 + i * 56, f, { size: 26, fill: 'rgba(255,255,255,.9)', stroke: 'none', anchor: 'start' })).join(''));
  s += dWindowView(720, 330, 290, 300, t) + rect(705, 312, 320, 30, '#ff5c8a', 6, 5) + [0, 1, 2, 3, 4].map(i => path(`M${705 + i * 64} 342L${769 + i * 64} 342L${769 + i * 64} 390Q${737 + i * 64} ${412 + wave(t, .6, 5, i)} ${705 + i * 64} 390Z`, i % 2 ? '#fff' : '#ff5c8a', 4)).join('');
  s += wallClock(470, 420, 56, t, o.clock || 1) + dShelf(370, 690, 280, dJar(400, 690, '#ff8fb1', .8) + dJar(465, 690, SX.acc2, .8) + dJar(530, 690, '#9be37b', .8) + dPot(605, 690, .45, t, 2, '#5ec4f0'));
  s += hangLamp(330, 590, t, .5) + hangLamp(860, 600, t + 1, .5) + dFrame(990, 760, 90, 110, 'sea', '#c38a52', 4);
  if (o.photo && t > o.photo) s += G(tr(880, 760, pop(t, o.photo, .35), 4), rect(-80, -70, 160, 140, '#fff', 8, 6) + rect(-66, -56, 132, 112, '#bfe3ff', 4, 4) + heart(0, -14, .8) + ftext(0, 44, 'MARIÉS', { size: 18, fill: '#e2463a', stroke: 'none' }));
  return s; }
// comptoir + vitrine réfrigérée (bacs de couleur)
function idCounter(t, melt = 0) { let s = rect(-M, 1040, W + 2 * M, 34, '#fff', 8, 6) + rect(-M, 1074, W + 2 * M, 176, '#ff8fb1', 0, 6) + rect(40, 1088, 1000, 110, 'rgba(220,240,255,.7)', 12, 5);
  const cols = [VAN, CHOC, '#ff8fb1', '#9be37b', '#ffd23f', '#c9b3ff', '#ff9a4d', '#fff'];
  cols.forEach((c, i) => { const x = 110 + i * 123; s += ell(x, 1150, 50, 22, '#cfd6dc', 4) + ell(x, 1144, 44, 17, c, 3) + (melt ? path(`M${x - 40} 1150Q${x - 30} ${1175 + melt * 30} ${x - 18} 1152`, c, 3) : ''); });
  return s + op(.35, path('M60 1090L200 1090L120 1196L40 1196Z', '#fff', 0)) + dTileFloor(1250, '#fff', '#ffc4da'); }

// ---------- cinéma ----------
function idPoster(kind, x, y, s, t, lit = 0) { const w = 250, h = 350;
  let inner = kind === 'com' ? grad('#ffe680', '#ffb03a', -w / 2, -h / 2, w, h) + G(tr(0, 30), circ(0, 0, 80, '#fff', 6) + path('M-34 -20Q-24 -36 -14 -20M14 -20Q24 -36 34 -20', 'none', 6) + path('M-44 12Q0 70 44 12Z', '#7a2b2b', 5) + circ(-58, 6, 12, '#ff8fb1', 0) + circ(58, 6, 12, '#ff8fb1', 0)) + ftext(0, -120, 'COMÉDIE', { size: 40, fill: '#fff' })
    : grad('#2a2440', '#0d0b1a', -w / 2, -h / 2, w, h) + G(tr(0, 40 + Math.sin(t * 4) * 8), path('M-70 70L-70 -20Q-70 -90 0 -90Q70 -90 70 -20L70 70L46 50L24 70L0 50L-24 70L-46 50Z', '#f4f4f8', 6) + ell(-26, -24, 12, 18, OL, 0) + ell(26, -24, 12, 18, OL, 0) + ell(0, 14, 14, 20, OL, 0)) + ftext(0, -120, 'HORREUR', { size: 40, fill: '#ff5c5c' });
  return G(tr(x, y, s), (lit ? op(.5 * lit, rect(-w / 2 - 40, -h / 2 - 40, w + 80, h + 80, kind === 'com' ? '#fff36a' : '#ff5c5c', 40, 0)) : '') + rect(-w / 2 - 18, -h / 2 - 18, w + 36, h + 36, '#ffd23f', 10, 7) + clipR(-w / 2, -h / 2, w, h, inner, 4) + rect(-w / 2, -h / 2, w, h, 'none', 4, 5) +
    (lit ? [0, 1, 2, 3, 4, 5].map(i => circ(-w / 2 - 9 + (i % 2) * (w + 18), -h / 2 + 40 + Math.floor(i / 2) * 135, 8, Math.sin(t * 12 + i) > 0 ? '#fff6a0' : '#ffb03a', 3)).join('') : '')); }
function idCinema(t, o = {}) { const yb = 1250, night = o.night, lit = o.lit || [0, 0];
  let s = night ? grad('#0d1030', '#2a2060', -M, -M, W + 2 * M, yb + M) : grad('#ff9a6b', '#ffd9a8', -M, -M, W + 2 * M, yb + M);
  if (night) { for (let i = 0; i < 18; i++) s += circ((i * 211) % 1100, 60 + (i * 97) % 300, 3 + (i % 3), '#fff6d6', 0); s += op(.3, circ(880, 190, 120, '#fff6c8', 0)) + circ(880, 190, 72, '#fff6d6', 6) + circ(856, 172, 14, '#e8dfb8', 0) + circ(904, 214, 10, '#e8dfb8', 0); }
  else s += cloud(((t * 30) % 1300) - 150, 150, .9, '#fff3e6') + cloud(((t * 20 + 600) % 1300) - 150, 230, .6, '#fff3e6') + dBirds(t, 3, 210, 2);
  s += dBuilding(-80, yb, 200, 980, night ? '#3a4270' : '#8fa0c8', 3, t, { night }) + dBuilding(960, yb, 220, 900, night ? '#4a3a70' : '#a08ac8', 5, t, { night });
  s += rect(110, 380, 860, 870, '#b81f3a', 10, 7) + [0, 1, 2, 3, 4, 5].map(i => line(160 + i * 152, 470, 160 + i * 152, 1240, 4, '#9a1830')).join('');
  s += rect(70, 250, 940, 170, '#2b2420', 16, 7) + dNeon(540, 340, 'CINÉMA', '#ffd23f', t, 84);
  for (let i = 0; i < 16; i++) { const on = night && o.shut ? 0 : Math.sin(t * 7 + i * .8) > -.3; s += circ(100 + i * 59, 268, 9, on ? '#fff6a0' : '#7a6a40', 3) + circ(100 + i * 59, 402, 9, on ? '#fff6a0' : '#7a6a40', 3); }
  s += idPoster('com', 290, 720, 1, t, lit[0]) + idPoster('hor', 790, 720, 1, t, lit[1]);
  s += rect(440, 940, 200, 310, '#3a1d2a', 8, 7) + rect(456, 960, 78, 270, '#9fd0ff', 4, 4) + rect(546, 960, 78, 270, '#9fd0ff', 4, 4) + op(.4, path('M462 970L520 970L470 1100Z', '#fff', 0));
  s += G(tr(540, 905), rect(-110, -26, 220, 48, '#ffd23f', 10, 5) + ftext(0, 12, o.shut ? 'FERMÉ' : 'GUICHET', { size: 28, fill: '#b81f3a', stroke: 'none' }));
  if (o.shut) { const k = o.shut, hgt = 790 * k;
    let sh = rect(120, 455, 840, hgt, '#9aa3ad', 0, 6); for (let y = 475; y < 455 + hgt; y += 26) sh += line(120, y, 960, y, 4, '#7d848c');
    sh += rect(110, 440, 860, 30, '#5a5f6a', 6, 6) + rect(120, 455 + hgt - 20, 840, 24, '#6b7280', 4, 5);
    s += sh + (k > .7 ? G(tr(540, 820, 1, Math.sin(t * 3) * 4), line(-80, -90, -80, -40, 4) + line(80, -90, 80, -40, 4) + rect(-150, -40, 300, 90, '#fff', 12, 6) + ftext(0, 18, 'FERMÉ', { size: 48, fill: '#e2463a', stroke: 'none' })) : ''); }
  s += rect(-M, yb, W + 2 * M, 700, '#b9c0c8', 0, 0) + line(-M, yb, W + M, yb, 6, '#8a929c') + rect(-M, 1560, W + 2 * M, 500, '#3a3f4a', 0, 0) + line(-M, 1560, W + M, 1560, 10, '#ddd');
  s += dLampPost(1030, yb + 10, 1, night) + dBin(60, 1290, 1, '#36a85a') + dPot(400, 1270, .8, t, 1, '#b81f3a') + dPot(680, 1270, .8, t, 0, '#b81f3a');
  return s; }

// ---------- resto ----------
const idBurger = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-92 -10Q-92 -92 0 -92Q92 -92 92 -10Z', '#e8a85a', 6) + [[-40, -60], [0, -72], [40, -58], [-14, -42], [26, -38]].map(([a, b]) => ell(a, b, 7, 3.5, '#fff6d6', 0)).join('') +
  path('M-104 -10Q-66 12 -34 -6Q0 14 34 -6Q66 12 104 -10L100 6L-100 6Z', '#7be07b', 5) + rect(-96, 2, 192, 20, '#ffd23f', 6, 5) + rect(-94, 20, 188, 28, '#7a4a2a', 12, 5) + path('M-92 46L92 46Q92 82 0 82Q-92 82 -92 46Z', '#e8a85a', 6));
const idPizza = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), ell(0, 0, 140, 64, '#e8a85a', 6) + ell(0, -4, 118, 50, '#ffd23f', 0) + [[-60, -10], [10, -24], [60, 4], [-20, 20], [70, -30], [-80, 22]].map(([a, b]) => ell(a, b, 18, 9, '#e2463a', 3)).join('') +
  path('M-118 -4L118 -4M0 -54L0 46M-84 -38L84 30M84 -38L-84 30', 'none', 3, 'rgba(160,100,40,.5)'));
// part de pizza tenue en main (pointe vers le bas, fromage qui file)
const idSlice = (k = 0) => G(tr(0, -10), path('M0 120L-56 -10L56 -10Z', '#ffd23f', 6) + rect(-62, -30, 124, 26, '#e8a85a', 12, 6) + circ(-12, 30, 12, '#e2463a', 3) + circ(16, 70, 10, '#e2463a', 3) + (k > 0 ? path(`M0 110Q-10 ${f1(150 + k * 60)} 6 ${f1(190 + k * 110)}`, 'none', 7, '#ffd23f') : ''));
const idWaiter = (v, o, t) => adult(0, Object.assign({ hair: v >= 2 ? 'bald' : 'side', hairColor: ['#1f1a18', '#8a7a6a', '#eeeeee'][v], mustache: v >= 1, beard: v >= 2, wrinkles: v >= 1, glasses: v >= 2, shirt: '#fff', apron: '#2b2420', skin: SK[4], seed: 90 }, o), t);
const idPad = G(tr(0, -30, 1, -8), rect(-50, -66, 100, 130, '#fff', 6, 5) + [0, 1, 2, 3].map(i => line(-34, -36 + i * 26, 34, -36 + i * 26, 3, '#9aa3ad')).join(''));
const idTable = (yb = 1210) => rect(60, yb - 40, 960, 46, '#fff', 12, 7) + path(`M90 ${yb + 6}L990 ${yb + 6}L960 ${yb + 140}L120 ${yb + 140}Z`, '#e2463a', 6) + [0, 1, 2, 3, 4, 5, 6].map(i => rect(130 + i * 120, yb + 10, 60, 60, 'rgba(255,255,255,.55)', 0, 0)).join('');
const idPlate = (x, y, s = 1) => ell(x, y, 120 * s, 34 * s, '#fff', 6) + ell(x, y - 2, 86 * s, 22 * s, '#eef2f5', 0);

// ---------- multivers ----------
const LIVES = [['ASTRONAUTE', '#3a3a8a', '#0d0d30', 'wow'], ['ROI', '#c9b3ff', '#7a5cd8', 'smugger'], ['ROCKSTAR', '#ff6b6b', '#b81f3a', 'shadesGrin'], ['CHEF ÉTOILÉ', '#fff3c4', '#ffb03a', 'proud'], ['FOOTBALLEUR', '#9be37b', '#36a85a', 'ecstatic'], ['MILLIONNAIRE', '#ffe08a', '#e8b923', 'smug']];
function idLife(i, w, h, t) { const [lb, c1, c2, ex] = LIVES[i], hr = h * .26, hy = h * .14;
  let s = grad(c1, c2, -w / 2 - 2, -h / 2 - 2, w + 4, h + 4);
  if (i === 0) for (let k = 0; k < 10; k++) s += circ(-w / 2 + (k * 67) % w, -h / 2 + (k * 41) % h, 3, '#fff', 0);
  if (i === 4) s += rect(-w / 2, h * .25, w, h * .3, '#5fb85f', 0, 0) + line(-w / 2, h * .25, w / 2, h * .25, 4, '#fff');
  if (i === 2) s += [0, 1, 2].map(k => ftext(-w * .34 + k * w * .34, -h * .2 + Math.sin(t * 5 + k) * 8, '♪', { size: 34, fill: '#fff' })).join('');
  if (i === 5) s += [0, 1, 2].map(k => bill(-w * .32 + k * w * .32, -h * .25 + ((t * 40 + k * 30) % 40), .35, k * 20 - 20)).join('');
  s += G(tr(0, hy), head({ hr, hairFn: idHair, hairColor: HAIRC, expr: ex, seed: 2 }, t));
  if (i === 0) s += circ(0, hy, hr * 1.4, 'rgba(200,230,255,.3)', 5) + op(.6, ell(-hr * .6, hy - hr * .7, hr * .3, hr * .15, '#fff', 0));
  if (i === 1) s += path(`M${-hr * .8} ${hy - hr * .85}L${-hr * .8} ${hy - hr * 1.5}L${-hr * .4} ${hy - hr * 1.15}L0 ${hy - hr * 1.6}L${hr * .4} ${hy - hr * 1.15}L${hr * .8} ${hy - hr * 1.5}L${hr * .8} ${hy - hr * .85}Z`, '#ffd23f', 4);
  if (i === 3) s += circ(-hr * .5, hy - hr * 1.3, hr * .45, '#fff', 4) + circ(hr * .5, hy - hr * 1.3, hr * .45, '#fff', 4) + circ(0, hy - hr * 1.5, hr * .5, '#fff', 4) + rect(-hr * .75, hy - hr * 1.15, hr * 1.5, hr * .35, '#fff', 4, 4);
  if (i === 4) s += G(tr(w * .3, h * .3, 1, t * 200), circ(0, 0, hr * .45, '#fff', 4) + circ(0, 0, hr * .16, OL, 0));
  const lw = lb.length * h * .07 + 24;
  s += G(tr(-w / 2 + 10, -h / 2 + 10), rect(0, 0, lw, h * .16, SX.acc, 8, 4) + ftext(lw / 2, h * .118, lb, { size: h * .1, fill: '#fff', stroke: 'none' }));
  return clipR(-w / 2, -h / 2, w, h, s, 10) + rect(-w / 2, -h / 2, w, h, 'none', 10, 6); }
// cerveau rigolo (avec yeux)
const idBrain = (x, y, s, t, worried = 0) => G(tr(x, y + Math.sin(t * 4) * 8, s), path('M-120 20C-160 -10 -150 -80 -100 -90C-90 -140 -20 -150 0 -110C30 -150 100 -140 110 -90C160 -80 165 -10 125 20C130 70 60 90 20 70C0 90 -60 90 -80 60C-120 70 -140 50 -120 20Z', '#ff9ec4', 7) +
  path('M-90 -40Q-60 -70 -30 -40M10 -70Q40 -40 70 -70M-60 30Q-20 10 20 35M70 0Q95 20 105 -10M-110 0Q-95 10 -80 -5', 'none', 5, '#e06c98') +
  circ(-36, -6, 17, '#fff', 4) + circ(36, -6, 17, '#fff', 4) + circ(-36 + Math.sin(t * 7) * 6, -4, 7, OL, 0) + circ(36 + Math.sin(t * 7) * 6, -4, 7, OL, 0) + (worried ? path('M-22 40Q0 28 22 40', 'none', 5) : path('M-22 34Q0 50 22 34', 'none', 5)));

// ---------- baskets ----------
const idSneak = (x, y, s = 1, c = '#2b2b33', r = 0) => { const lc = c === '#2b2b33' ? '#fff' : '#9aa3ad';
  return G(tr(x, y, s, r), path('M-120 20L-120 -44Q-112 -76 -66 -64L-14 -42Q36 -22 90 -12Q132 -2 130 22L-120 22Z', c, 7) + rect(-128, 16, 266, 28, '#fff', 12, 6) + path('M-60 -56L-34 -34M-38 -60L-10 -38M-14 -62L14 -38', 'none', 6, lc) + path('M-120 -20Q-90 -10 -70 -24', 'none', 5, lc) + circ(60, 0, 10, lc, 0)); };
function idShoeShop(t) { const yb = 1250;
  let s = dWall('diamond', '#e8f1ff', '#d3e2fb', yb) + dBase(yb, '#5b8fd8') + dNeon(540, 190, 'SNEAKERS', '#5ec4f0', t, 70);
  const cols = ['#e2463a', '#ffd23f', '#36a85a', '#5b8fd8', '#ff8fb1', '#ff9a4d', '#8a6ad8', '#5ec4f0'];
  [380, 590, 800].forEach((y, j) => { s += dShelf(30, y, 330, [0, 1].map(k => dShoes(110 + k * 160, y, .8, cols[(j * 2 + k) % 8])).join('')) + dShelf(720, y, 330, [0, 1].map(k => dShoes(800 + k * 160, y, .8, cols[(j * 2 + k + 3) % 8])).join('')); });
  s += rect(400, 330, 280, 520, '#cfe6f5', 14, 7) + op(.5, path('M420 350L520 350L430 600Z', '#fff', 0)) + ftext(540, 880, '- 50 %', { size: 40, fill: '#e2463a', stroke: 'none' });
  s += hangLamp(540, 120, t, .4) + dRug(540, 1330, 700, 90, '#ffd9e6', '#ff8fb1') + dParquet(yb, '#e8cfa8') + dPot(60, 1290, 1, t, 1) + dPot(1020, 1290, 1, t, 2) + dBox(160, 1250, .8, 'SHOES') + dBox(930, 1250, .7);
  return s; }

// ---------- nuages de regret ----------
function idRegret(x, y, s, t, ph = 0) { let tears = '';
  for (let i = 0; i < 4; i++) { const k = (t * 1.5 + i / 4 + ph) % 1; tears += op(1 - k * .8, path(`M${-46 + (i % 2) * 92} ${f1(20 + k * 200)}q-12 18 0 26q12 -8 0 -26Z`, '#5ec4f0', 4)); }
  return G(tr(x, y + Math.sin(t * 3 + ph) * 8, s), tears + path('M-120 40C-175 40 -175 -30 -120 -30C-122 -88 -40 -98 -18 -54C2 -112 96 -104 96 -34C150 -46 170 40 112 40Z', '#b8c6dc', 7) +
    path('M-62 -20Q-46 -8 -30 -20M30 -20Q46 -8 62 -20', 'none', 6) + path('M-46 -12Q-50 10 -46 30M46 -12Q50 10 46 30', 'none', 6, '#5ec4f0') + path(`M-24 ${f1(22 + Math.sin(t * 20 + ph) * 2)}Q0 6 24 22`, 'none', 6) + ell(-74, 4, 12, 7, '#ff9ec4', 0) + ell(74, 4, 12, 7, '#ff9ec4', 0)); }

// ---------- calendrier / téléphone ----------
const idCal = (x, y, s, str, r = 0) => G(tr(x, y, s, r), rect(-110, -130, 220, 260, '#fff', 14, 7) + rect(-110, -130, 220, 70, '#e2463a', 14, 7) + ftext(0, -82, 'JOUR', { size: 34, fill: '#fff' }) + ftext(0, 70, str, { size: 120, fill: OL, stroke: 'none' }) + circ(-60, -130, 10, '#9aa3ad', 4) + circ(60, -130, 10, '#9aa3ad', 4));
function idChat(t, o = {}) { // contenu d'écran de téléphone (repère -66..66 / -128..122)
  let s = rect(-66, -128, 132, 250, '#f4f6fb', 12, 0) + rect(-66, -128, 132, 36, SX.acc, 12, 0) + circ(-46, -110, 11, '#ff8fb1', 3) + ftext(-30, -104, 'Léa', { size: 15, fill: '#fff', stroke: 'none', anchor: 'start' });
  if (o.me) s += G(tr(26, -66, o.me), rect(-34, -14, 70, 28, '#7fd3a0', 10, 3) + ftext(1, 6, 'OUI !!', { size: 14, fill: OL, stroke: 'none' }));
  if (o.dots) s += G(tr(-36, -18), rect(-26, -12, 52, 24, '#fff', 10, 3) + [0, 1, 2].map(i => circ(-12 + i * 12, 0, 3.5 + Math.max(0, Math.sin(t * 10 - i)) * 1.5, '#9aa3ad', 0)).join(''));
  if (o.her) s += G(tr(-8, 6, o.her), rect(-52, -44, 104, 82, '#fff', 10, 3) + ["Désolée, j'ai", 'cru que', "t'étais pas", 'intéressé.'].map((l, i) => ftext(-46, -24 + i * 18, l, { size: 12.5, fill: OL, stroke: 'none', anchor: 'start' })).join(''));
  if (o.crack) s += path('M20 -40L4 -10L28 10L6 40L22 70M4 -10L-24 0M28 10L50 -4', 'none', 3, OL);
  return s; }

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001a — SIGNATURE : grille encre, héros en cut-out entouré de flèches qui oscillent, titre 3 lignes, « débloqué » sur INDÉCIS
const O1 = at(1, 'tu') - .12;
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'indecis');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      idArrow(200, 860, -1, '', SX.acc2, Math.sin(t * 6) * 20, .8) + idArrow(880, 860, 1, '', '#5ec4f0', Math.sin(t * 6 + 2) * 20, .8) +
      G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.25, expr: t > K ? 'panic' : 'confused', look: idLook(t, 6), armL: [-150, -120], armR: [-30, -60] }, t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1030, 330, 330, t, K + .2, { label: 'heros.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'ÊTRE", CX, 415, t, .3, { size: 58 }) +
      kword('INDÉCIS ?', CX, 540, t, K - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'indecis') - .05, 'boom', .6], [at(1, 'indecis'), 'sparkle', .5]] });

// B001b — « Tu as huit ans. » : papier + gobo, héros cut-out, étiquette 8 ANS
B(1, { enter: 'none', trans: 'wipe', transD: .18, cam: zin(1.02, 1.08, .2),
  draw: (t, d, T) => paper(SX.paper) + gobo(T, .12) + burst(CX, 1000, 280, t, 0, '#e6dcff', 16) +
    cutout(heroP({ x: CX, y: 1460, s: 1.3, expr: 'happy', armR: [-40, -60] }, t), 12) +
    kthin('tu as', CX, 420, t, 0, { size: 60 }) + funTag(CX, 560, '8 ANS', t, .05, { size: 96, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 560, t, .1, 6, 200),
  sfx: [[0, 'whoosh', .4], [.05, 'pop', .7], [.15, 'sparkle', .4]] }, O1);

// B002 — « Ta mère t'emmène acheter une glace. » : rue, maman tire le héros par la main, enseigne cornet géante
const idConeSign = (x, yb, t) => G(tr(x, yb), rect(-10, -560, 20, 560, '#3a4250', 4, 5) + G(tr(0, -640, 1, Math.sin(t * 3) * 6), idCone(0, 0, 1.5, '#ff8fb1') + circ(-30, -110, 22, '#e2463a', 4)));
B(2, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .4 }),
  draw: (t, d, T) => { const Me = at(2, 'mere'), Gl = at(2, 'glace'), dx = t * 60;
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: idConeSign(860, 1300, t) + adult(3, { x: 520 + dx, y: 1480, s: 1.1, hair: 'long', expr: 'happy', walk: 1, armL: [150, 120] }, t) + heroP({ x: 270 + dx, y: 1490, s: 1.05, expr: t > Gl ? 'ecstatic' : 'happy', walk: 1, armR: [-10, 10] }, t) },
      { z: .6, svg: blur(10, dBush(60, 1900, 1.6)) }]) +
      kthin("ta mère t'emmène", CX, 420, t, Me - .1, { size: 58 }) + kword('UNE GLACE', CX, 560, t, Gl - .05, { size: 110, fill: SX.acc2 }) + popStars(860, 660, t, Gl, 6, 160); },
  sfx: [[0, 'whoosh', .4], [at(2, 'mere'), 'steps', .4], [at(2, 'acheter'), 'pop_hi', .4], [at(2, 'glace') - .05, 'boom', .4], [at(2, 'glace'), 'ding', .5]] });

// B003 — « Vanille ou chocolat ? » : boutique, deux cornets qui se disputent l'écran, regard gauche-droite
B(3, { enter: 'none', trans: 'circle', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Va = at(3, 'vanille'), Ch = at(3, 'chocolat');
    return idShop(t) + idGlacier(0, { x: 800, y: 1330, s: 1.0, expr: 'happy', armL: [150, 110] }, t) + idCounter(t) +
      G(tr(260, 800, pop(t, Va - .05, .3), Math.sin(t * 5) * 6), idCone(0, 0, 1.3, VAN)) + G(tr(560, 800, pop(t, Ch - .05, .3), Math.sin(t * 5 + 2) * 6), idCone(0, 0, 1.3, CHOC)) +
      heroP({ x: 330, y: 1490, s: 1.3, expr: 'confused', look: t > Ch ? idLook(t, 9) : [-1, -0.5] }, t) +
      funTag(260, 590, 'VANILLE', t, Va - .05, { size: 46, bg: '#fff', fg: SX.ink, r: -6 }) + funTag(600, 590, 'CHOCOLAT', t, Ch - .05, { size: 46, bg: CHOC, r: 5 }) + kthin('ou', 430, 450, t, at(3, 'ou') - .05, { size: 64 }) + (t > Ch ? kword('?', 880, 560, t, Ch + .2, { size: 150, fill: SX.acc2 }) : ''); },
  sfx: [[at(3, 'vanille') - .05, 'pop', .6], [at(3, 'ou'), 'pop_hi', .3], [at(3, 'chocolat') - .05, 'pop', .6], [at(3, 'chocolat') + .2, 'boing', .4]] });

// B004 — « Tu réfléchis. » : gros plan, balance cornets qui oscille au-dessus, points d'interrogation en orbite
B(4, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Re = at(4, 'reflechis');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: idShop(t), haze: .38 }]) + idScale(CX, 600, .62, t, idCone(0, -60, .55, VAN), idCone(0, -60, .55, CHOC), Math.sin(t * 6) * 18) +
      heroHead(CX, 990, 170, { expr: 'confused', look: idLook(t, 8), tilt: Math.sin(t * 4) * 6 }, t) +
      [0, 1, 2].map(i => { const a = t * 3 + i * 2.1; return qmark(CX + Math.cos(a) * 260, 960 + Math.sin(a) * 80, .5, [SX.acc2, '#fff', LIL][i]); }).join('') +
      kword('TU RÉFLÉCHIS…', CX, 450, t, Re - .05, { size: 84, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(4, 'reflechis') - .05, 'hmm', .6], [at(4, 'reflechis') + .1, 'tick', .4], [at(4, 'reflechis') + .3, 'tick', .4]] });

// B005–B007 — « Une minute. / Deux minutes. / Cinq minutes. » : le glacier vieillit, l'horloge s'emballe, le héros se fige
function idWait(n, age, label, word, expr, o = {}) {
  B(n, { enter: o.enter || 'punch', trans: o.trans, transD: .2, cam: (t, d) => ({ z: lerp(1.02 + age * .02, 1.06 + age * .02, t / d), hand: .3 }),
    draw: (t, d, T) => { const Wd = at(n, word);
      return idShop(t, { clock: 6 + age * 14 }) + idGlacier(age, { x: 800, y: 1330, s: 1.0, expr, armL: age === 0 ? [150 + Math.sin(t * 20) * 10, 120] : [110, 100] }, t) + idCounter(t) +
        G(tr(260, 800, 1, Math.sin(t * 5) * 6), idCone(0, 0, 1.3, VAN, age * .3)) + G(tr(560, 800, 1, Math.sin(t * 5 + 2) * 6), idCone(0, 0, 1.3, CHOC, age * .3)) +
        heroP({ x: 330, y: 1490, s: 1.3, expr: age >= 2 ? 'dizzy' : 'confused', look: idLook(t, 9) }, t) + (age >= 1 ? idWeb(150, 1010, .8 + age * .2, 20) : '') + (age >= 2 ? idWeb(520, 1180, .7, 200) : '') +
        (age >= 1 ? sweat(420, 1000 + (t * 60) % 40, 1) : '') +
        kword(label, CX, 470, t, Wd - .05, { size: 120, fill: age >= 2 ? '#ff6b6b' : SX.acc2 }) + popStars(CX, 470, t, Wd, 6, 220); },
    sfx: [[0, o.trans ? 'whoosh' : 'pop_hi', .4], [at(n, word) - .05, 'boom', .4], [at(n, word), 'clock_fast', .4], [at(n, word) + .2, age >= 2 ? 'crickets' : 'tick', .4]] });
}
idWait(5, 0, '1 MINUTE', 'minute', 'annoyed', { enter: 'drop' });
idWait(6, 1, '2 MINUTES', 'deux', 'deadpan', { trans: 'push' });
idWait(7, 2, '5 MINUTES', 'cinq', 'sleep', { enter: 'crash' });

// B008 — « LE GLACIER A EU LE TEMPS DE FONDER UNE FAMILLE. » : il est vieux, marié, enfants, photo de mariage — slam
B(8, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(8, 'famille') && t < at(8, 'famille') + .5 ? 8 : 2 }),
  draw: (t, d, T) => { const Gl = at(8, 'glacier'), Fo = at(8, 'fonder'), Fa = at(8, 'famille');
    return idShop(t, { clock: 30, photo: Fo }) + idGlacier(3, { x: 820, y: 1330, s: 1.0, expr: 'proud', armR: [-30, -60] }, t) +
      (t > Fo ? adult(3, { x: 620, y: 1330, s: .95, hair: 'long', hairColor: '#d9d9de', wrinkles: true, shirt: '#fff', apron: '#ff8fb1', expr: 'happy', armL: [150, 120] }, t + 1) : '') +
      (t > Fa ? kid(1, { x: 470, y: 1200, s: .72, expr: 'joy', armL: [-150, -120] }, t) + kid(4, { x: 960, y: 1200, s: .65, expr: 'happy', armR: [-30, -60] }, t + 2) : '') + idCounter(t, 1) +
      G(tr(260, 860, 1, Math.sin(t * 5) * 6), idCone(0, 0, 1.2, VAN, 1)) +
      heroP({ x: 300, y: 1490, s: 1.3, expr: t > Fa ? 'jawdrop' : 'dizzy', look: [1, -0.3] }, t) + idWeb(140, 1010, 1.2, 20) +
      (t > Fa ? heartsUp(t, 720, 900, 5) + confetti(t, Fa, 26) : '') +
      kthin('le glacier a eu le temps', CX, 390, t, Gl - .1, { size: 54 }) + kthin('de fonder', CX, 460, t, Fo - .15, { size: 54 }) +
      kword('UNE FAMILLE', CX, 580, t, Fa - .05, { size: 110, fill: SX.acc2 }) + idFlash(t, Fa, .6); },
  sfx: [[0, 'flash_hit', .5], [at(8, 'glacier'), 'pop_hi', .4], [at(8, 'fonder'), 'pop', .5], [at(8, 'famille') - .05, 'boom', .7], [at(8, 'famille'), 'baby_coo', .5], [at(8, 'famille') + .2, 'tada', .4]] });

// B009 — « Bienvenue dans la vie d'un indécis. » : rue, arche BIENVENUE, panneaux qui pointent partout, débloqué (2/3)
B(9, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bv = at(9, 'bienvenue'), In = at(9, 'indecis');
    let bulbs = ''; for (let i = 0; i < 13; i++) { const a = R(180 + i * 15), on = Math.sin(t * 6 + i) > -.4; bulbs += circ(CX + Math.cos(a) * 400, 820 + Math.sin(a) * 190, 15, on ? '#fff3a0' : '#9a8a50', 4); }
    const arch = rect(118, 820, 44, 440, '#8a5a3a', 6, 6) + rect(918, 820, 44, 440, '#8a5a3a', 6, 6) + path('M140 820A400 190 0 0 1 940 820', 'none', 30, SX.acc) + path('M140 820A400 190 0 0 1 940 820', 'none', 6, SX.acc2) + bulbs;
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .1 },
      { z: 1.2, svg: idSign(230, 1300, .7, t, 'ICI', 'LÀ', 5) + idSign(860, 1300, .7, t, 'OUI', 'NON', 6, 1) },
      { z: 1, svg: arch + unlock(CX, 1000, t, In, { part: 'back', r: 460 }) + heroP({ x: CX, y: 1490, s: 1.3, expr: t > In ? 'dizzy' : 'happy', look: idLook(t, 5), armL: [-150, -120], armR: [-30, -60] }, t) + unlock(CX, 1000, t, In, { part: 'front', r: 460 }) },
      { z: .6, svg: blur(10, dBush(1020, 1900, 1.6)) }]) +
      kthin("bienvenue dans la vie d'un", CX, 420, t, Bv - .1, { size: 52 }) + kword('INDÉCIS', CX, 570, t, In - .05, { size: 130, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(9, 'bienvenue'), 'magic', .5], [at(9, 'vie'), 'pop_hi', .4], [at(9, 'indecis') - .05, 'boom', .5], [at(9, 'indecis'), 'sparkle', .5]] });

// B010 — « À douze ans, Kevin te demande quel film regarder. » : devant le cinéma, Kevin pose LA question
B(10, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const A12 = at(10, '12'), K = at(10, 'kevin'), Fi = at(10, 'film');
    return idCinema(t) + kevin({ x: 790, y: 1490, s: 1.25, expr: 'happy', flip: 1, armL: [-150, -120] }, t) + heroP({ x: 300, y: 1490, s: 1.25, expr: t > Fi ? 'worried' : 'happy', look: t > Fi ? idLook(t, 6) : [1, 0] }, t) +
      funTag(CX, 470, '12 ANS', t, A12 - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 470, t, A12, 6, 180) +
      chatBubble(760, 640, 380, 110, 'ON REGARDE QUOI ?', t, Fi - .1, false, 34); },
  sfx: [[0, 'whoosh', .4], [at(10, '12') - .1, 'pop', .7], [at(10, 'kevin'), 'pop_hi', .4], [at(10, 'film') - .1, 'pop', .5], [at(10, 'regarder'), 'hmm', .3]] });

// B011 — « Tu choisis une comédie. » : l'affiche COMÉDIE s'illumine, le héros la pointe
B(11, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .3, cx: 440 }),
  draw: (t, d, T) => { const Co = at(11, 'comedie');
    return idCinema(t, { lit: [t > Co - .1 ? 1 : 0, 0] }) + kevin({ x: 790, y: 1490, s: 1.25, expr: 'happy', flip: 1 }, t) + heroP({ x: 300, y: 1490, s: 1.25, expr: 'laugh', look: [-.5, -1], armL: [-120, -140] }, t) +
      kword('COMÉDIE', 330, 470, t, Co - .05, { size: 96, fill: SX.acc2 }) + popStars(290, 720, t, Co, 6, 220); },
  sfx: [[at(11, 'choisis'), 'pop_hi', .4], [at(11, 'comedie') - .1, 'ding', .5], [at(11, 'comedie') - .05, 'boom', .4], [at(11, 'comedie') + .1, 'sparkle', .4]] });

// B012 — « Puis tu changes pour un film d'horreur. » : whip vers l'affiche HORREUR, héros terrifié… mais il la choisit
B(12, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .3, cx: 640 }),
  draw: (t, d, T) => { const Ch = at(12, 'changes'), Ho = at(12, 'horreur');
    return idCinema(t, { lit: [0, t > Ch ? 1 : 0] }) + (t > Ho && t < Ho + .2 ? op(.4, rect(-M, -M, W + 2 * M, H + 2 * M, '#2a2440', 0, 0)) : '') +
      kevin({ x: 790, y: 1490, s: 1.25, expr: 'annoyed', flip: 1 }, t) + heroP({ x: 300, y: 1490, s: 1.25, expr: t > Ho ? 'scared' : 'confused', look: [1, -1], armR: [-60, -80], tremble: t > Ho ? 1 : 0 }, t) +
      kthin('puis tu changes pour', CX, 420, t, Ch - .15, { size: 54 }) + kword("UN FILM D'HORREUR", CX, 560, t, Ho - .15, { size: 76, fill: '#ff6b6b' }); },
  sfx: [[0, 'whoosh', .5], [at(12, 'changes'), 'rewind', .4], [at(12, 'horreur') - .15, 'boom', .4], [at(12, 'horreur'), 'ghost', .5], [at(12, 'horreur') + .1, 'thunder', .3]] });

// B013 — « Puis tu reviens à la comédie. » : les affiches clignotent en alternance, Kevin a le tournis
B(13, { enter: 'none', trans: 'glitch', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .4, r: Math.sin(t * 6) * 3 }),
  draw: (t, d, T) => { const Rv = at(13, 'reviens'), Co = at(13, 'comedie'), alt = Math.sin(t * 16) > 0 && t < Co;
    return idCinema(t, { lit: t > Co ? [1, 0] : alt ? [1, 0] : [0, 1] }) + kevin({ x: 790, y: 1490, s: 1.25, expr: 'dizzy', flip: 1 }, t) +
      heroP({ x: 300, y: 1490, s: 1.25, expr: 'panic', look: idLook(t, 16), armL: t > Co ? [-120, -140] : [110, 100], armR: t > Co ? [70, 80] : [-60, -80] }, t) +
      idArrow(300, 880, Math.sin(t * 16) > 0 ? -1 : 1, '', SX.acc2, 0, .6) +
      kthin('puis tu reviens à la', CX, 420, t, Rv - .2, { size: 54 }) + kword('COMÉDIE', CX, 560, t, Co - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(13, 'reviens'), 'rewind', .4], [at(13, 'reviens') + .2, 'tick', .3], [at(13, 'comedie') - .05, 'boom', .4], [at(13, 'comedie') + .1, 'boing', .4]] });

// B014 — « QUAND TU TE DÉCIDES, LE CINÉMA EST FERMÉ. » : nuit, lune, Kevin endormi, le rideau de fer tombe — slam FERMÉ
B(14, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(14, 'ferme') && t < at(14, 'ferme') + .5 ? 9 : 2 }),
  draw: (t, d, T) => { const De = at(14, 'decides'), Ci = at(14, 'cinema'), Fe = at(14, 'ferme'), k = eOutCubic(seg(t, Ci, Fe));
    return idCinema(t, { night: 1, shut: Math.max(.02, k) }) + kevin({ x: 800, y: 1490, s: 1.2, expr: 'sleep', flip: 1, rot: -8, beard: true, hairColor: '#c4521b' }, t) + ftext(880, 980 + Math.sin(t * 3) * 10, 'Zzz', { size: 54, fill: '#fff' }) +
      heroP({ x: 300, y: 1490, s: 1.25, expr: t > Fe ? 'jawdrop' : 'ecstatic', look: [1, -1], armL: t > Fe ? [110, 100] : [-150, -120], armR: t > Fe ? [70, 80] : [-30, -60] }, t) +
      kthin('quand tu te décides,', CX, 420, t, De - .3, { size: 56, out: Fe - .1 }) + kword('FERMÉ', CX, 520, t, Fe - .05, { size: 170, fill: '#ff6b6b' }) + idFlash(t, Fe, .6); },
  sfx: [[0, 'flash_hit', .4], [at(14, 'decides'), 'ding', .4], [at(14, 'cinema'), 'whoosh_up', .3], [at(14, 'ferme') - .05, 'boom', .7], [at(14, 'ferme'), 'thud', .7], [at(14, 'ferme') + .3, 'crickets', .3]] });

// B015 — « À seize ans, tu vas au restaurant. » : resto, héros + Kevin attablés, menus
B(15, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const A16 = at(15, '16'), Re = at(15, 'restaurant');
    const menu = G(tr(0, -50, 1, -6), rect(-60, -80, 120, 160, '#2f3a35', 8, 5) + ftext(0, -36, 'MENU', { size: 22, fill: '#fff', stroke: 'none' }) + [0, 1, 2].map(i => line(-40, -6 + i * 26, 40, -6 + i * 26, 3, 'rgba(255,255,255,.6)')).join(''));
    return restoT(t) + heroP({ x: 290, y: 1440, s: 1.2, expr: 'happy', armR: [-60, -60], holdR: menu }, t) + kevin({ x: 800, y: 1440, s: 1.2, expr: 'happy', flip: 1 }, t + 1) + idTable(1230) + dMug(820, 1186, .9, t, '#5ec4f0') +
      funTag(CX, 450, '16 ANS', t, A16 - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 450, t, A16, 6, 180) + kthin('tu vas au restaurant', CX, 610, t, Re - .4, { size: 56 }); },
  sfx: [[0, 'whoosh', .4], [at(15, '16') - .1, 'pop', .7], [at(15, 'vas'), 'steps', .3], [at(15, 'restaurant'), 'ding', .4]] });

// B016 — « Tu hésites entre un burger et une pizza. » : gros plan, balance burger/pizza au-dessus de la tête
B(16, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const He = at(16, 'hesites'), Bu = at(16, 'burger'), Pi = at(16, 'pizza');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: restoT(t, { diners: false }), haze: .35 }]) + idScale(CX, 560, .95, t, t > Bu - .1 ? idBurger(0, -50, .7) : '', t > Pi - .1 ? idPizza(0, -20, .6) : '', Math.sin(t * 5) * 18) +
      heroHead(CX, 1010, 150, { expr: 'confused', look: idLook(t, 7) }, t) +
      kthin('tu hésites entre', CX, 420, t, He - .1, { size: 56 }) + funTag(250, 880, 'BURGER', t, Bu - .05, { size: 40, bg: '#ff9a4d', r: -6 }) + funTag(830, 880, 'PIZZA', t, Pi - .05, { size: 40, bg: '#e2463a', r: 6 }); },
  sfx: [[0, 'whoosh', .4], [at(16, 'hesites'), 'hmm', .5], [at(16, 'burger') - .05, 'pop', .6], [at(16, 'pizza') - .05, 'pop', .6], [at(16, 'pizza') + .2, 'squeak', .4]] });

// B017 — « Le serveur revient trois fois. » : à chaque retour il a vieilli (moustache, puis barbe blanche)
B(17, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Rv = at(17, 'revient'), Tr = at(17, 'trois'), Fo = at(17, 'fois'), v = t > Fo ? 2 : t > Tr ? 1 : 0, sw = [Rv, Tr, Fo][v];
    const poof = t > sw && t < sw + .3 && v > 0 ? op(1 - seg(t, sw, sw + .3), G(tr(780, 950, 1 + seg(t, sw, sw + .3)), cloud(0, 0, 1.4, '#fff', 6))) : '';
    return restoT(t) + idWaiter(v, { x: 780, y: 1480, s: 1.1, expr: v === 2 ? 'deadpan' : v === 1 ? 'annoyed' : 'happy', armL: [-80, -100], holdL: idPad, flip: 1 }, t) + poof +
      heroP({ x: 290, y: 1440, s: 1.2, expr: 'confused', look: idLook(t, 6) }, t) + idTable(1230) +
      kthin('le serveur revient', CX, 420, t, at(17, 'serveur') - .1, { size: 56 }) + kword((v + 1) + ' FOIS', CX, 560, t, sw - .05, { size: 110, fill: v === 2 ? '#ff6b6b' : SX.acc2 }) +
      funTag(820, 720, '×' + (v + 1), t, sw, { size: 50, bg: '#fff', fg: SX.ink, r: 6 }); },
  sfx: [[at(17, 'serveur'), 'steps', .4], [at(17, 'revient') - .05, 'boom', .4], [at(17, 'trois') - .05, 'whoosh', .5], [at(17, 'trois'), 'pop', .5], [at(17, 'fois') - .05, 'whoosh', .5], [at(17, 'fois'), 'boing', .5]] });

// B018 — « Finalement, tu prends le burger. Il arrive. » : il pointe le burger… qui tombe sur la table, fumant
B(18, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .3, shake: t > at(18, 'arrive') && t < at(18, 'arrive') + .25 ? 7 : 0 }),
  draw: (t, d, T) => { const Fi = at(18, 'finalement'), Bu = at(18, 'burger'), Ar = at(18, 'arrive'), dy = 700 * (1 - eOutBack(seg(t, Ar - .25, Ar + .1)));
    return restoT(t) + heroP({ x: 290, y: 1440, s: 1.2, expr: t > Ar ? 'ecstatic' : 'happy', armR: t < Ar ? [-20, -10] : [-40, -60] }, t) + kevin({ x: 800, y: 1440, s: 1.2, expr: 'happy', flip: 1 }, t + 1) + idTable(1230) +
      idPlate(480, 1192) + (t > Ar - .25 ? idBurger(480, 1130 - dy, 1) + (t > Ar ? steam(450, 1020, t, .8) + steam(520, 1010, t + .5, .8) : '') : '') +
      kthin('finalement,', CX, 420, t, Fi - .1, { size: 56 }) + funTag(CX, 560, 'LE BURGER', t, Bu - .1, { size: 64, bg: '#ff9a4d' }) + (t > Ar ? kword('IL ARRIVE !', CX, 700, t, Ar - .05, { size: 80, fill: SX.acc2 }) : ''); },
  sfx: [[at(18, 'finalement'), 'pop_hi', .4], [at(18, 'burger') - .1, 'pop', .6], [at(18, 'arrive') - .25, 'whoosh', .5], [at(18, 'arrive'), 'thud', .6], [at(18, 'arrive') + .1, 'sizzle', .4]] });

// B019 — « Tu regardes la pizza de Kevin. » : la pizza de Kevin dans une lumière divine, le héros bave
B(19, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), hand: .2, cx: 680 }),
  draw: (t, d, T) => { const Rg = at(19, 'regardes'), Pi = at(19, 'pizza'), K = at(19, 'kevin');
    return restoT(t) + (t > Pi ? op(.55, sunburst(700, 1150, 16, 'rgba(255,240,150,.9)', 'rgba(255,240,150,0)', t * 20)) : '') +
      heroP({ x: 290, y: 1440, s: 1.2, expr: t > Pi ? 'starving' : 'happy', look: [1, .5] }, t) + (t > Pi ? path(`M330 ${1090}q-6 ${f1(30 + (t * 60) % 40)} 4 ${f1(50 + (t * 60) % 40)}`, 'none', 7, '#9fd8ff') : '') +
      kevin({ x: 820, y: 1440, s: 1.2, expr: 'smugger', flip: 1, armL: [-80, -110], holdL: idSlice(seg(t, K - .2, d)) }, t + 1) + idTable(1230) +
      idPlate(480, 1192) + idBurger(480, 1130, .9) + idPlate(700, 1192) + idPizza(700, 1170, .75) + (t > Pi ? sparkle(760, 1110, .8 + .2 * Math.sin(t * 14)) + sparkle(640, 1130, .6) : '') +
      kthin('tu regardes', CX, 420, t, Rg - .1, { size: 56 }) + kword('LA PIZZA DE KEVIN', CX, 560, t, Pi - .1, { size: 72, fill: SX.acc2 }); },
  sfx: [[at(19, 'regardes'), 'hmm', .4], [at(19, 'pizza') - .1, 'angel', .6], [at(19, 'pizza'), 'sparkle', .5], [at(19, 'kevin'), 'chomp', .5]] });

// B020 — « PUTAIN. J'AURAIS DÛ PRENDRE LA PIZZA. » : gros plan rage, bip censure, LA PIZZA
B(20, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 4 + (t < at(20, 'aurais') ? 5 : 0) }),
  draw: (t, d, T) => { const Pu = at(20, 'putain'), Au = at(20, 'aurais'), Pi = at(20, 'pizza');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: restoT(t, { diners: false }), haze: .35 }]) + speedLines(t, CX, 1000, 28, 'rgba(255,255,255,.45)') +
      heroHead(CX, 990, 170, { expr: t > Pi ? 'sob' : 'rage', tilt: Math.sin(t * 22) * 3 }, t) + (t > Pi ? idPizza(860, 1060, .55, -12) + sparkle(900, 1010, .6) : idBurger(860, 1080, .6, 10)) +
      kword('P*TAIN !', CX, 420, t, Pu - .05, { size: 120, fill: '#fff' }) + funTag(840, 330, 'BIP', t, Pu, { size: 40, bg: '#e2463a', r: 8 }) +
      kthin("j'aurais dû prendre", CX, 560, t, Au - .1, { size: 54 }) + kword('LA PIZZA', CX, 680, t, Pi - .1, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .5], [at(20, 'putain') - .05, 'boom', .5], [at(20, 'putain'), 'error_beep', .6], [at(20, 'aurais'), 'scratch', .4], [at(20, 'pizza') - .1, 'thud', .6]] });

// B021 — « Mais attends. » : concept, tout se fige (pause), grille, héros cut-out qui lève le doigt
B(21, { enter: 'none', trans: 'black', transD: .18, cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => { const At = at(21, 'attends');
    const pause = G(tr(800, 760, pop(t, .02, .3)), circ(0, 0, 110, SX.acc, 7) + rect(-42, -50, 28, 100, '#fff', 6, 5) + rect(14, -50, 28, 100, '#fff', 6, 5));
    return gridBg(SX.ink) + halftoneFade('#fff', .05, 1) + cutout(heroP({ x: 340, y: 1460, s: 1.3, expr: 'suspicious', armR: [-60, -95] }, t), 12) + pause +
      kword('MAIS ATTENDS.', CX, 470, t, At - .15, { size: 104, fill: '#fff' }); },
  sfx: [[0, 'scratch', .6], [.02, 'pop', .5], [at(21, 'attends') - .15, 'boom', .4], [at(21, 'attends') + .2, 'tick', .3]] });

// B022 — « Le pire, ce n'est pas de choisir. » : couloir, deux portes A / B, CHOISIR barré
const idDoor = (x, yb, lab, c, open = 0, inner = '') => G(tr(x, yb), rect(-130, -560, 260, 560, '#5a3a26', 8, 7) + rect(-110, -540, 220, 540, '#1d1430', 4, 0) + inner +
  (open < 1 ? path(`M-110 -540L${f1(-110 + 220 * (1 - open))} ${f1(-540 + 30 * open)}L${f1(-110 + 220 * (1 - open))} ${f1(-30 * open)}L-110 0Z`, c, 6) + circ(f1(-110 + 190 * (1 - open)), -270, 12, SX.acc2, 4) : '') +
  G(tr(0, -620), rect(-60, -40, 120, 80, '#fff', 12, 6) + ftext(0, 22, lab, { size: 56, fill: c, stroke: 'none' })));
B(22, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pi = at(22, 'pire'), Ch = at(22, 'choisir');
    return hallway(t) + WASH() + idDoor(240, 1250, 'A', '#5b8fd8') + idDoor(840, 1250, 'B', '#e2463a') +
      heroP({ x: CX, y: 1490, s: 1.25, expr: 'worried', look: idLook(t, 5) }, t) +
      kthin('le pire,', CX, 400, t, Pi - .15, { size: 58 }) + kthin("ce n'est pas de", CX, 480, t, at(22, 'pas') - .3, { size: 54 }) + funTag(CX, 610, 'CHOISIR', t, Ch - .1, { size: 70, bg: SX.acc2, fg: SX.ink }) + cross(CX, 610, 1.1, t, Ch + .1); },
  sfx: [[0, 'whoosh', .4], [at(22, 'pire'), 'sting', .4], [at(22, 'choisir') - .1, 'pop', .6], [at(22, 'choisir') + .1, 'buzz', .4]] });

// B023 — « C'est ce qui arrive APRÈS. » : la porte B s'ouvre sur l'orage — slam APRÈS
B(23, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), shake: t > at(23, 'apres') ? 6 : 1, cx: 760 }),
  draw: (t, d, T) => { const Ar = at(23, 'arrive'), Ap = at(23, 'apres'), fl = t > Ap && Math.sin(t * 30) > .2;
    const storm = (fl ? rect(-110, -540, 220, 540, '#5a4a90', 0, 0) + idBolt(0, -330, .9) : '') + cloud(0, -420, .7, '#3a3060', 0);
    return hallway(t) + WASH('rgba(40,30,80,.2)') + idDoor(240, 1250, 'A', '#5b8fd8') + idDoor(840, 1250, 'B', '#e2463a', eOutCubic(seg(t, Ar - .2, Ap)), storm) +
      heroP({ x: 560, y: 1490, s: 1.25, expr: t > Ap ? 'terror' : 'scared', look: [1, -.5], tremble: t > Ap ? 1 : 0 }, t) +
      kthin("c'est ce qui arrive", CX, 400, t, Ar - .4, { size: 56 }) + kword('APRÈS', CX, 540, t, Ap - .05, { size: 170, fill: '#ff6b6b' }) + idFlash(t, Ap, .5); },
  sfx: [[0, 'flash_hit', .4], [at(23, 'arrive') - .2, 'squeak', .5], [at(23, 'apres') - .05, 'boom', .6], [at(23, 'apres'), 'thunder', .6]] });

// B024a — « Ton cerveau imagine » : nuit, le cerveau sort de la tête comme un projecteur
const O24 = at(24, 'toutes') - .1;
B(24, { enter: 'none', trans: 'circle', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ce = at(24, 'cerveau'), Im = at(24, 'imagine'), up = eOutBack(seg(t, Ce - .1, Ce + .3));
    return bedroomN(t) + WASH('rgba(10,10,40,.25)') + heroP({ x: CX, y: 1490, s: 1.3, expr: 'worried', look: [0, -1] }, t) +
      (up > 0 ? op(.35, path(`M${CX} ${1000}L${CX - 120} ${f1(1000 - 280 * up)}L${CX + 120} ${f1(1000 - 280 * up)}Z`, '#ffb3d6', 0)) + idBrain(CX, 1000 - 300 * up, .9 * up, t) : '') +
      (t > Im ? [0, 1, 2].map(i => sparkle(CX - 200 + i * 200, 640 + Math.sin(t * 5 + i) * 20, .6, [SX.acc2, '#fff', LIL][i])).join('') : '') +
      kthin('ton cerveau', CX, 400, t, Ce - .15, { size: 60 }) + kword('IMAGINE', CX, 520, t, Im - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[at(24, 'cerveau') - .1, 'boing', .5], [at(24, 'cerveau') + .1, 'pop', .4], [at(24, 'imagine') - .05, 'magic', .5], [at(24, 'imagine') + .1, 'sparkle', .4]] });
// B024b — « …toutes les vies que tu aurais pu avoir en prenant l'autre décision. » : multivers d'écrans, vies parallèles
B(24, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Vi = at(24, 'vies') - O24, Au = at(24, 'aurais') - O24, Ad = at(24, 'autre') - O24, pw = 300, ph = 200;
    const pos = [[200, 690], [540, 690], [880, 690], [200, 930], [540, 930], [880, 930]];
    const grid = pos.map(([x, y], i) => { const t0 = Vi - .1 + i * (Au + .6 - Vi) / 6; return t < t0 ? '' : G(tr(x, y, pop(t, t0, .3), [-3, 2, -2, 3, -1, 2][i]), rect(-pw / 2 - 12, -ph / 2 - 12, pw + 24, ph + 24, '#15151c', 18, 6) + idLife(i, pw, ph, t + i)); }).join('');
    return bedroomN(t) + op(.55, rect(-M, -M, W + 2 * M, H + 2 * M, '#120c2a', 0, 0)) + op(.25, path(`M${CX} 1180L60 560L1020 560Z`, '#ffb3d6', 0)) + idBrain(CX, 1150, .55, t) + grid +
      kthin('toutes les vies', CX, 400, t, 0, { size: 58 }) + funTag(CX, 500, 'VIES PARALLÈLES', t, Vi, { size: 50, bg: SX.acc, r: -3 }) +
      (t > Ad ? funTag(CX, 1110, "L'AUTRE DÉCISION", t, Ad - .05, { size: 40, bg: SX.acc2, fg: SX.ink, r: 3 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(24, 'vies') - O24, 'pop', .5], [at(24, 'vies') - O24 + .3, 'pop_hi', .4], [at(24, 'aurais') - O24, 'pop_hi', .4], [at(24, 'avoir') - O24, 'pop_hi', .4], [at(24, 'autre') - O24 - .05, 'tada', .4]] }, O24);

// B025 — « Tu achètes des baskets noires ? » : magasin de sneakers, il brandit les noires
B(25, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ba = at(25, 'baskets'), No = at(25, 'noires');
    return idShoeShop(t) + heroP({ x: 340, y: 1490, s: 1.3, expr: t > No ? 'proud' : 'happy', armR: [-40, -70], holdR: G(tr(0, -40), idSneak(0, 0, .8, '#2b2b33', -10)) }, t) +
      adult(2, { x: 820, y: 1480, s: 1.1, hair: 'short', shirt: '#5ec4f0', expr: 'happy', flip: 1, armL: [-30, -40] }, t) +
      kthin('tu achètes des baskets', CX, 420, t, Ba - .5, { size: 54 }) + funTag(CX, 560, 'NOIRES ?', t, No - .05, { size: 70, bg: '#2b2b33' }) + popStars(560, 900, t, No, 6, 140); },
  sfx: [[0, 'whoosh', .4], [at(25, 'achetes'), 'kaching', .4], [at(25, 'noires') - .05, 'pop', .6], [at(25, 'noires') + .1, 'squeak', .4]] });

// B026 — « Tu regrettes les blanches. » : les blanches sur un piédestal, lumière divine, le héros sanglote
B(26, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Rg = at(26, 'regrettes'), Bl = at(26, 'blanches');
    const ped = G(tr(780, 1250), rect(-130, -220, 260, 220, '#fff', 10, 7) + rect(-150, -240, 300, 30, '#e8eef2', 8, 6)) + (t > Bl - .1 ? op(.5, path('M780 -100L560 1030L1000 1030Z', '#fff6c8', 0)) : '') + G(tr(780, 970 + Math.sin(t * 3) * 10), idSneak(0, 0, 1.1, '#fbfbfb')) + (t > Bl ? sparkle(860, 930, .9 + .2 * Math.sin(t * 15), '#fff') : '');
    return idShoeShop(t) + ped + heroP({ x: 330, y: 1490, s: 1.3, expr: t > Rg ? 'sob' : 'sad', look: [1, -.3], armR: [70, 80], holdR: idSneak(0, -10, .6, '#2b2b33', 20) }, t) +
      kthin('tu regrettes', CX, 420, t, Rg - .1, { size: 56 }) + kword('LES BLANCHES', CX, 560, t, Bl - .05, { size: 96, fill: '#fff' }); },
  sfx: [[at(26, 'regrettes'), 'sting', .4], [at(26, 'blanches') - .1, 'angel', .6], [at(26, 'blanches'), 'glint', .5], [at(26, 'blanches') + .2, 'gulp', .4]] });

// B027 — « Tu restes chez toi ? » : chambre, plaid, chips… notif « SOIRÉE CHEZ MAX »
B(27, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Re = at(27, 'restes'), To = at(27, 'toi');
    const ph = phone(0, -30, .45, 0, rect(-66, -128, 132, 250, '#fff', 12, 0) + rect(-60, -110, 120, 70, SX.acc, 10, 0) + ftext(0, -66, 'SOIRÉE !', { size: 22, fill: '#fff', stroke: 'none' }));
    return bedroomN(t, 1) + WASH('rgba(10,10,40,.15)') + sofa(560, 1450, 1.1, '#8a6ad8') + heroP({ x: 460, y: 1430, s: 1.2, expr: 'chill', armR: [-50, -70], holdR: ph }, t) +
      path('M300 1260Q560 1180 820 1260L820 1400L300 1400Z', '#ffd23f', 6) + path('M340 1300Q560 1240 790 1300', 'none', 5, '#e8b923') + G(tr(800, 1220, 1, 10), rect(-40, -60, 80, 100, '#e2463a', 10, 5) + ftext(0, 0, 'CHIPS', { size: 18, fill: '#fff', stroke: 'none' })) +
      kthin('tu restes', CX, 420, t, Re - .1, { size: 60 }) + funTag(CX, 560, 'CHEZ TOI ?', t, To - .2, { size: 70, bg: LIL, fg: SX.ink }); },
  sfx: [[at(27, 'restes'), 'thud', .4], [at(27, 'chez'), 'pop', .5], [at(27, 'toi'), 'vibrate', .4], [at(27, 'toi') + .2, 'ding', .3]] });

// B028 — « Tu regrettes la soirée. » : bulle de pensée avec la fête (boule disco), il pleure dans son plaid
B(28, { enter: 'none', cam: (t, d) => ({ z: lerp(1.05, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Rg = at(28, 'regrettes'), So = at(28, 'soiree'), k = pop(t, Rg - .1, .35);
    const party = clipR(-190, -110, 380, 200, rect(-190, -110, 380, 200, '#3a1a5c', 0, 0) + discoBall(0, -60, .5, t) + [0, 1, 2].map(i => G(tr(-120 + i * 120, 70 - Math.abs(Math.sin(t * 8 + i)) * 20), head({ hr: 34, hair: KH[i], hairColor: KC[i], skin: SK[i], expr: 'ecstatic', seed: 20 + i }, t))).join(''), 20);
    return bedroomN(t, 1) + WASH('rgba(10,10,40,.15)') + sofa(560, 1450, 1.1, '#8a6ad8') + heroP({ x: 460, y: 1430, s: 1.2, expr: t > So ? 'sob' : 'sad' }, t) + path('M300 1260Q560 1180 820 1260L820 1400L300 1400Z', '#ffd23f', 6) +
      (k > 0 ? bubble(680, 730, 460, 300, party, k) : '') +
      kthin('tu regrettes', CX, 400, t, Rg - .1, { size: 56 }) + kword('LA SOIRÉE', 600, 480, t, So - .05, { size: 90, fill: SX.acc2 }); },
  sfx: [[at(28, 'regrettes') - .1, 'pop', .5], [at(28, 'regrettes') + .1, 'drum', .3], [at(28, 'soiree') - .05, 'boom', .4], [at(28, 'soiree') + .1, 'gasp', .4]] });

// B029a — « Tu sors ? » : la fête, il danse… sans conviction
const O29 = at(29, 'regrettes') - .12;
B(29, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .4 }),
  draw: (t, d, T) => { const So = at(29, 'sors');
    return partyT(t) + kid(1, { x: 820, y: 1490 - Math.abs(Math.sin(t * 8)) * 20, s: 1.15, expr: 'ecstatic', flip: 1, armL: [-150, -120] }, t) + kid(4, { x: 160, y: 1490 - Math.abs(Math.sin(t * 8 + 1)) * 20, s: 1.1, expr: 'joy', armR: [-30, -60] }, t + 1) +
      heroP({ x: CX, y: 1490 - Math.abs(Math.sin(t * 8)) * 10, s: 1.3, expr: 'happy', armL: [-150, -120], armR: [-30, -60] }, t) +
      funTag(CX, 470, 'TU SORS ?', t, So - .15, { size: 80, bg: '#ff5c8a' }); },
  sfx: [[0, 'whoosh', .4], [at(29, 'sors') - .15, 'pop', .6], [at(29, 'sors'), 'drum', .5]] });
// B029b — « Tu regrettes ton lit. » : il bâille, bulle de pensée avec son lit (et un cœur)
B(29, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const Rg = at(29, 'regrettes') - O29, Li = at(29, 'lit') - O29, k = pop(t, Rg - .05, .35);
    const bed = rect(-190, -110, 380, 200, '#1d2350', 0, 0) + rect(-150, 0, 300, 70, '#8a6ad8', 12, 5) + rect(-150, -40, 90, 50, '#fff', 14, 5) + path('M-60 -10Q60 -30 150 0L150 40L-60 40Z', '#ffd23f', 5) + heart(100, -70, .7) + ftext(-130, -60, 'z', { size: 30, fill: '#fff' });
    return partyT(t) + kid(1, { x: 820, y: 1490 - Math.abs(Math.sin(t * 8)) * 20, s: 1.15, expr: 'ecstatic', flip: 1, armL: [-150, -120] }, t) +
      heroP({ x: 420, y: 1490, s: 1.3, expr: t > Li ? 'sob' : 'sleep', face: t < Li ? { mouth: 'o' } : {} }, t) + (k > 0 ? bubble(680, 760, 440, 290, clipR(-190, -110, 380, 200, bed, 20), k) : '') +
      kthin('tu regrettes', CX, 400, t, Rg - .1, { size: 56 }) + kword('TON LIT', 640, 500, t, Li - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[at(29, 'regrettes') - O29 - .05, 'pop', .5], [at(29, 'regrettes') - O29 + .1, 'hmm', .4], [at(29, 'lit') - O29 - .05, 'boom', .4], [at(29, 'lit') - O29 + .1, 'sparkle', .3]] }, O29);

// B030 — « FRÈRE, MÊME TES REGRETS ONT DES REGRETS. » : rayons, un gros nuage de regret qui pleure… et ses petits regrets qui pleurent aussi
B(30, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t < .3 ? 6 : t > at(30, 'regrets', 2) && t < at(30, 'regrets', 2) + .4 ? 7 : 1 }),
  draw: (t, d, T) => { const Fr = at(30, 'frere'), Me = at(30, 'meme'), R1 = at(30, 'regrets'), R2 = at(30, 'regrets', 2);
    return rays(t, CX, 820, '#9fb0d8', '#5a6aa0', 22) + (t > R1 - .1 ? idRegret(500, 840, 2.0 * pop(t, R1 - .1, .4), t) : '') +
      (t > R2 - .1 ? idRegret(840, 640, .95 * pop(t, R2 - .1, .3), t, .3) + idRegret(960, 520, .45 * pop(t, R2 + .1, .3), t, .6) + idRegret(1015, 455, .22 * pop(t, R2 + .25, .3), t, .9) : '') +
      kword('FRÈRE,', CX, 420, t, Fr - .05, { size: 110, fill: '#fff', op: t > Me - .05 ? 0 : 1 }) + kword('MÊME TES REGRETS', CX, 420, t, Me - .05, { size: 74, fill: '#fff' }) +
      kword('ONT DES REGRETS', CX, 1090, t, R2 - .3, { size: 74, fill: SX.acc2 }) + idFlash(t, R2, .4); },
  sfx: [[0, 'flash_hit', .5], [at(30, 'frere') - .05, 'boom', .6], [at(30, 'regrets') - .1, 'pop', .5], [at(30, 'regrets') + .1, 'gulp', .4], [at(30, 'regrets', 2) - .1, 'pop_hi', .5], [at(30, 'regrets', 2) + .1, 'pop_hi', .5], [at(30, 'regrets', 2) + .3, 'rimshot', .5]] });

// B031 — « Puis un jour, quelqu'un te plaît. » : cour, elle passe, cœurs, le héros fond
B(31, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Jo = at(31, 'jour'), Qu = at(31, 'quelqu'), Pl = at(31, 'plait');
    return schoolyard(t) + WASH() + idGirl({ x: 800, y: 1490, s: 1.3, expr: 'happy', flip: 1, armL: [200, 160 + Math.sin(t * 8) * 15] }, t) +
      heroP({ x: 300, y: 1490, s: 1.3, expr: t > Pl ? 'love' : 'happy', look: [1, 0] }, t) + (t > Pl ? heartsUp(t, 330, 950, 6) : '') +
      kthin('puis un jour,', CX, 400, t, Jo - .2, { size: 58 }) + funTag(CX, 520, "QUELQU'UN", t, Qu - .05, { size: 64, bg: '#ff8fb1' }) + kword('TE PLAÎT', CX, 660, t, Pl - .05, { size: 96, fill: '#ffb3c8' }); },
  sfx: [[0, 'whoosh', .4], [at(31, 'jour'), 'pop_hi', .4], [at(31, 'quelqu') - .05, 'pop', .5], [at(31, 'plait') - .05, 'kiss', .5], [at(31, 'plait') + .1, 'sparkle', .4]] });

// B032 — « Elle te propose un rendez-vous. » : bulle « ON SE VOIT SAMEDI ? », étiquette RENDEZ-VOUS
B(32, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pr = at(32, 'propose'), Rv = at(32, 'rendez');
    return schoolyard(t) + WASH() + idGirl({ x: 800, y: 1490, s: 1.3, expr: 'happy', flip: 1, face: { mouth: 'talk' } }, t) +
      heroP({ x: 300, y: 1490, s: 1.3, expr: 'love', look: [1, 0] }, t) + chatBubble(720, 720, 400, 140, 'ON SE VOIT\nSAMEDI ?', t, Pr - .1, false, 40) +
      kthin('elle te propose', CX, 400, t, 0, { size: 56 }) + funTag(CX, 510, 'UN RENDEZ-VOUS', t, Rv - .05, { size: 56, bg: '#ff8fb1' }) + heartsUp(t, 720, 900, 3); },
  sfx: [[at(32, 'propose') - .1, 'pop', .5], [at(32, 'rendez') - .05, 'ding', .5], [at(32, 'rendez') + .1, 'kiss', .4]] });

// B033 — « Tu veux répondre oui. » : un énorme « OUI ! » commence à sortir de sa bouche
B(33, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ve = at(33, 'veux'), Ou = at(33, 'oui'), k = pop(t, Ou - .1, .35);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: schoolyard(t), haze: .3 }]) + heroHead(380, 990, 160, { expr: t > Ou ? 'ecstatic' : 'happy', look: [1, 0], face: t > Ve ? { mouth: 'o' } : {} }, t) +
      (k > 0 ? G(tr(760, 860, k), rect(-200, -110, 400, 220, '#7fd3a0', 40, 7) + path('M-170 60L-240 130L-110 90Z', '#7fd3a0', 6) + rect(-176, 50, 90, 50, '#7fd3a0', 0, 0) + ftext(0, 50, 'OUI !', { size: 130, fill: '#fff' })) : '') +
      kthin('tu veux répondre', CX, 430, t, Ve - .1, { size: 60 }) + popStars(760, 860, t, Ou, 7, 260); },
  sfx: [[at(33, 'veux'), 'pop_hi', .4], [at(33, 'repondre'), 'whoosh_up', .4], [at(33, 'oui') - .1, 'boom', .5], [at(33, 'oui'), 'tada', .4]] });

// B034 — « Mais tu réfléchis. » : le « OUI » se dégonfle, balance, points d'interrogation
B(34, { enter: 'none', cam: (t, d) => ({ z: lerp(1.06, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ma = at(34, 'mais'), Re = at(34, 'reflechis'), k = 1 - .6 * seg(t, Ma, Re + .3);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: schoolyard(t), haze: .4 }]) + heroHead(380, 990, 160, { expr: 'worried', look: idLook(t, 8) }, t) +
      G(tr(760, 860, k, Math.sin(t * 9) * 6 * (1 - k)), rect(-200, -110, 400, 220, '#b9c4cc', 40, 7) + ftext(0, 50, 'OUI ?', { size: 130, fill: '#fff' })) +
      [0, 1, 2].map(i => qmark(220 + i * 300, 720 + Math.sin(t * 6 + i) * 20, .5, [SX.acc2, '#fff', LIL][i], -10 + i * 10)).join('') +
      kthin('mais…', CX, 400, t, Ma - .05, { size: 60 }) + kword('TU RÉFLÉCHIS', CX, 520, t, Re - .05, { size: 90, fill: SX.acc2 }); },
  sfx: [[at(34, 'mais') - .05, 'scratch', .5], [at(34, 'reflechis') - .05, 'hmm', .5], [at(34, 'reflechis') + .1, 'whoosh', .3], [at(34, 'reflechis') + .3, 'tick', .3]] });

// B035–B037 — « Et si… » : l'arbre des « et si » pousse sur sa tête, une bulle par question
const ETSI = [[230, 760, 'ÇA SE PASSE MAL ?'], [850, 760, "TU T'ATTACHES ?"], [540, 560, "QUELQU'UN D'AUTRE ?"]];
function idEtSiInner(i, t) {
  if (i === 0) return cloud(0, -30, .8, '#4a4a6a', 6) + idBolt(10, 50, .45) + [0, 1, 2, 3].map(k => line(-60 + k * 40, 20 + ((t * 200 + k * 30) % 60), -70 + k * 40, 40 + ((t * 200 + k * 30) % 60), 4, '#5ec4f0')).join('');
  if (i === 1) return heart(0, 0, 1.6) + rect(-30, 10, 60, 50, '#ffd23f', 8, 5) + path('M-18 10L-18 -6Q-18 -26 0 -26Q18 -26 18 -6L18 10', 'none', 6) + path('M-110 -60Q-60 -30 -40 0M110 -60Q60 -30 40 0', 'none', 8, '#9aa3ad');
  return idGirlHead(-40, 10, 46, { expr: 'love' }, t) + G(tr(50, 10), head({ hr: 46, hair: 'side', hairColor: '#e0a040', skin: SK[4], expr: 'smugger', glasses: true, seed: 71 }, t)) + heart(0, -70, .5);
}
function idEtSi(t, n, t0) { let s = '';
  ETSI.forEach(([x, y, lab], i) => { if (i > n) return; const k = i < n ? 1 : eOutCubic(seg(t, t0 - .15, t0 + .2)); if (k <= 0) return;
    const sx = CX, sy = 900, mx = lerp(sx, x, .5) + (i === 2 ? 0 : (x < CX ? 60 : -60)), my = lerp(sy, y, .5) + 60;
    s += path(`M${sx} ${sy}Q${f1(mx)} ${f1(my)} ${f1(lerp(sx, x, k))} ${f1(lerp(sy, y + 120, k))}`, 'none', 26, OL) + path(`M${sx} ${sy}Q${f1(mx)} ${f1(my)} ${f1(lerp(sx, x, k))} ${f1(lerp(sy, y + 120, k))}`, 'none', 14, '#8a5a3a');
    if (k >= .9) { const kk = i < n ? 1 : pop(t, t0 + .1, .3); s += G(tr(x, y, kk), circ(0, 0, 125, '#fff', 7) + clipR(-118, -118, 236, 236, idEtSiInner(i, t), 118)) + funTag(x, y + (i === 2 ? -160 : 165), lab, t, i < n ? -1 : t0 + .15, { size: 28, bg: i === 2 ? SX.acc : '#ff5c8a', r: i % 2 ? 4 : -4 }); } });
  return s; }
function idWhatIf(n, word, o = {}) {
  B(n, { enter: o.enter || 'punch', trans: o.trans, transD: .2, cam: (t, d) => ({ z: lerp(1.0 + n * 0 + (n - 35) * .02, 1.04 + (n - 35) * .02, t / d), hand: .3, shake: t > at(n, word) && t < at(n, word) + .2 ? 4 : 0 }),
    draw: (t, d, T) => { const Wd = at(n, word);
      return depth({ zoom: 1 }, [{ z: 1.4, svg: schoolyard(t), haze: .45 }]) + op(.25 + .05 * (n - 35), rect(-M, -M, W + 2 * M, H + 2 * M, '#2a2050', 0, 0)) + idEtSi(t, n - 35, Wd) +
        heroHead(CX, 1040, 120, { expr: ['worried', 'scared', 'panic'][n - 35], look: [0, -1] }, t) + (n === 35 ? kthin('et si…', 160, 420, t, at(n, 'si') - .1, { size: 60 }) : ''); },
    sfx: [[0, o.trans ? 'whoosh' : 'pop_hi', .4], [at(n, 'si'), 'tick', .3], [at(n, word) - .15, 'whoosh_up', .4], [at(n, word) + .1, 'pop', .5], [at(n, word) + .15, n === 35 ? 'thunder' : n === 36 ? 'heartbeat' : 'gasp', .4]] });
}
idWhatIf(35, 'mal', { trans: 'black' });
idWhatIf(36, 'attaches', { enter: 'punch' });
idWhatIf(37, 'autre', { enter: 'crash' });

// B038 — « Trois jours plus tard, tu écris enfin. » : calendrier qui défile JOUR 1-2-3, toiles d'araignée, il écrit enfin
B(38, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Tr = at(38, 'trois'), Jo = at(38, 'jours'), Pl = at(38, 'plus'), Ec = at(38, 'ecris'), En = at(38, 'enfin'), day = t > Pl ? '3' : t > Jo ? '2' : '1';
    const ph = phone(0, -30, .45, 0, idChat(t, { me: t > Ec ? 1 : 0 }));
    return bedroomN(t, 1) + WASH() + G(tr(800, 760, 1, 4), idCal(0, 0, 1.05, day)) + (t > Jo && t < Pl + .3 ? op(.6, G(tr(800, 760 - seg(t, Jo, Jo + .3) * 200, 1, 30), rect(-110, -130, 220, 260, '#fff', 14, 6))) : '') +
      heroP({ x: 330, y: 1490, s: 1.3, expr: t > En ? 'ecstatic' : 'dizzy', armR: [-50, -70], holdR: ph }, t) + idWeb(170, 1000, 1.1, 30) + (t > Pl ? idWeb(450, 1170, .8, 200) : '') +
      kthin('trois jours plus tard,', CX, 400, t, Tr - .1, { size: 56 }) + (t > Ec ? kword('TU ÉCRIS ENFIN', CX, 540, t, Ec - .05, { size: 82, fill: SX.acc2 }) : ''); },
  sfx: [[at(38, 'trois'), 'tick', .4], [at(38, 'jours'), 'whoosh', .4], [at(38, 'plus'), 'whoosh', .4], [at(38, 'ecris'), 'typing', .5], [at(38, 'enfin') - .05, 'boom', .4]] });

// B039 — « Elle répond : » : gros plan téléphone, trois petits points qui dansent
B(39, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Re = at(39, 'repond');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t, 1), haze: .4 }]) + phone(640, 830, 2.2, 3, idChat(t, { me: 1, dots: t > Re - .2 })) +
      heroHead(190, 1040, 110, { expr: 'worried', look: [1, -.3] }, t) + sweat(260, 940 + (t * 50) % 30, 1) +
      kthin('elle répond :', 330, 420, t, at(39, 'elle') - .1, { size: 60 }); },
  sfx: [[0, 'whoosh', .4], [at(39, 'elle'), 'vibrate', .5], [at(39, 'repond'), 'typing', .4], [at(39, 'repond') + .3, 'heartbeat', .4]] });

// B040 — « Désolée, j'ai cru que t'étais pas intéressé. » : le message tombe, l'écran se fissure, mâchoire au sol
B(40, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .2, shake: t > at(40, 'interesse') && t < at(40, 'interesse') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const De = at(40, 'desolee'), In = at(40, 'interesse');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t, 1), haze: .4 }]) + phone(640, 830, 2.2, 3, idChat(t, { me: 1, her: pop(t, De - .1, .3), crack: t > In })) +
      heroHead(190, 1040, 110, { expr: t > In ? 'jawdrop' : 'shock', look: [1, -.3] }, t) +
      funTag(330, 430, 'DÉSOLÉE…', t, De - .1, { size: 56, bg: '#fff', fg: SX.ink, r: -5 }) + (t > In ? stamp(640, 1070, 'VU', t, In, '#e2463a', -12, 70) : ''); },
  sfx: [[at(40, 'desolee') - .1, 'ding', .5], [at(40, 'cru'), 'sting', .4], [at(40, 'interesse'), 'crack', .7], [at(40, 'interesse') + .1, 'gasp', .5]] });

// B041 — « Et là, tu comprends. » : l'ampoule s'allume, débloqué (3/3)
B(41, { enter: 'none', trans: 'circle', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const La = at(41, 'la'), Co = at(41, 'comprends');
    return bedroomN(t, 1) + WASH() + unlock(CX, 900, t, Co, { part: 'back', r: 460 }) + heroP({ x: CX, y: 1490, s: 1.3, expr: t > Co ? 'shock' : 'deadpan', look: [0, -1] }, t) +
      idBulb(CX, 660, 1, t > Co, t) + unlock(CX, 900, t, Co, { part: 'front', r: 460 }) +
      kthin('et là,', CX, 400, t, La - .2, { size: 60 }) + kword('TU COMPRENDS', CX, 520, t, Co - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[at(41, 'la'), 'hmm', .4], [at(41, 'comprends') - .05, 'ding', .6], [at(41, 'comprends'), 'sparkle', .5], [at(41, 'comprends') + .1, 'magic', .4]] });

// B042 — « À FORCE DE CHERCHER LA MEILLEURE DÉCISION… » : perdu dans une forêt de panneaux, loupe à la main
B(42, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), r: Math.sin(t * 2) * 2, hand: .4 }),
  draw: (t, d, T) => { const Fo = at(42, 'force'), Ch = at(42, 'chercher'), Me = at(42, 'meilleure');
    const bg = SKY(t, '#c9b3ff', '#fff0e0') + dBirds(t, 3, 300, 4) + path('M-200 1100Q300 980 700 1060Q1000 1120 1300 1040L1300 1920L-200 1920Z', '#8fd18a', 7) + rect(-M, 1250, W + 2 * M, 800, '#7cc278', 0, 0) +
      [[120, 1140, .5, 0], [340, 1110, .45, 1], [760, 1120, .5, 2], [980, 1150, .55, 3]].map(([x, y, s, i]) => idSign(x, y, s, t, ['ICI', 'NON', 'OUI', 'PAR LÀ'][i], ['LÀ', 'PEUT-ÊTRE', 'NON', 'ICI'][i], 4 + i, i)).join('') + tree(1000, 1000, .7, t) + dFlowers(200, 1260, 6, 2, t);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bg, haze: .05 }, { z: 1, svg: heroP({ x: CX, y: 1490, s: 1.3, expr: 'dizzy', look: idLook(t, 4), armR: [-40, -70], holdR: magnifier(0, -30, .6, -20) }, t) + idSign(820, 1500, .9, t, 'MIEUX', 'PIRE', 7) }, { z: .6, svg: blur(10, dBush(60, 1900, 1.6)) }]) +
      kthin('à force de chercher', CX, 400, t, Fo - .1, { size: 58 }) + kword('LA MEILLEURE DÉCISION…', CX, 530, t, Me - .2, { size: 64, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(42, 'force'), 'wind', .3], [at(42, 'chercher'), 'hmm', .4], [at(42, 'meilleure') - .2, 'boom', .5], [at(42, 'decision'), 'error_beep', .3]] });

// B043a — « TU LAISSES PARFOIS LES AUTRES » : Kevin part main dans la main avec elle, le héros figé au panneau
const O43 = at(43, 'decider') - .15;
B(43, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const La = at(43, 'laisses'), Au = at(43, 'autres'), dx = t * 70;
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.5, svg: streetT(t, 2), haze: .1 },
      { z: 1, svg: kevin({ x: 700 + dx, y: 1480, s: 1.15, expr: 'smugger', walk: 1, armL: [150, 110] }, t) + idGirl({ x: 900 + dx, y: 1480, s: 1.15, expr: 'love', walk: 1, armR: [30, 60] }, t + 1) + heartsUp(t, 800 + dx, 1000, 4) +
        heroP({ x: 270, y: 1490, s: 1.25, expr: 'jawdrop', look: [1, 0] }, t) + idWeb(120, 1020, 1.1, 20) + idSign(450, 1500, .7, t, 'ELLE', '???', 8) },
      { z: .6, svg: blur(10, dBush(1020, 1900, 1.6)) }]) +
      kthin('tu laisses parfois', CX, 400, t, La - .2, { size: 58 }) + kword('LES AUTRES', CX, 530, t, Au - .1, { size: 110, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(43, 'laisses'), 'steps', .4], [at(43, 'parfois'), 'kiss', .4], [at(43, 'autres') - .1, 'boom', .5]] });
// B043b — FIN : « …DÉCIDER À TA PLACE. » : gros texte final, le héros cut-out tient encore son panneau qui tourne
B(43, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t < .3 ? 6 : t > at(43, 'place') - O43 && t < at(43, 'place') - O43 + .4 ? 6 : 0 }),
  draw: (t, d, T) => { const De = at(43, 'decider') - O43, Pl = at(43, 'place') - O43;
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1020, 300, t, .1, SX.acc, 18) +
      G(tr(840, 900, .8), kevinHead(0, 0, 100, { expr: 'smugger' }, t) + idGirlHead(170, 10, 95, { expr: 'love' }, t) + heart(85, -130, .8)) +
      cutout(heroP({ x: 340, y: 1460, s: 1.3, expr: t > Pl ? 'sob' : 'shock', look: idLook(t, 9), armR: [-60, -95], holdR: G(tr(0, -30, 1, t * 400), idArrow(0, 0, 1, '', SX.acc2, 0, .5)) }, t), 12) +
      kword('DÉCIDER', CX, 430, t, De - .05, { size: 140, fill: '#fff' }) + kword('À TA PLACE.', CX, 600, t, Pl - .1, { size: 110, fill: SX.acc2 }) + (t > Pl ? popStars(CX, 600, t, Pl, 8, 380) : '') + idFlash(t, Pl, .5); },
  sfx: [[0, 'flash_hit', .5], [at(43, 'decider') - O43 - .05, 'boom', .7], [at(43, 'place') - O43 - .1, 'boom', .6], [at(43, 'place') - O43 + .1, 'rimshot', .6], [at(43, 'place') - O43 + .5, 'crickets', .3]] }, O43);

SCENES.sort((a, b) => a.s - b.s);
const BEDS = [];
