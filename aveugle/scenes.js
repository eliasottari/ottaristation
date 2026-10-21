// ============================================================
//  « Pourquoi c'est horrible d'être aveugle ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Sujet sensible : on rit des situations, de la ville et des gens maladroits, JAMAIS du héros (il a toujours le dernier mot).
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

// ---------- SIZEX fun : accent BLEU « sonar », jaune marqueur, vert menthe ; ondes sonores bleu ciel ----------
sxFun('#3a5bff'); SX.acc2 = '#ffd23f'; SX.cool = '#5ee0a0';
const SONAR = '#8fd0ff';

// ============================================================
//  LE HÉROS : lunettes noires rondes (toujours), canne blanche (o.cane, o.tap = elle balaie le sol), chien guide à côté.
//  heroHair (hairFn) arme un drapeau ; browsSvg est mis de côté et eyesSvg dessine les lunettes + les sourcils AU-DESSUS
//  (l'expression passe par les sourcils et la bouche). Les autres persos ne sont pas touchés.
// ============================================================
const HERO_SHIRT = '#ff7a59', HERO_HAIR = '#2b1a12', HERO_SKIN = '#c98a5e';
let _AV = null;
const _browsBase = browsSvg, _eyesBase = eyesSvg;
browsSvg = function (type, r, lx, ly) { if (_AV) { _AV.brows = type; return ''; } return _browsBase(type, r, lx, ly); };
eyesSvg = function (type, r, t, lx, ly, seed) {
  const q = _AV; _AV = null;
  if (!q) return _eyesBase(type, r, t, lx, ly, seed);
  const up = (type === 'pop' || type === 'huge' || type === 'wide') ? -r * .1 + Math.sin(t * 30) * r * .015 : 0, gx = lx * .5, gy = r * .02 + ly * .3 + up;
  const lr = r * .27, ex = r * .37;
  let s = line(-ex - lr * .9 + gx, gy - r * .06, -r * .97, -r * .12, 6) + line(ex + lr * .9 + gx, gy - r * .06, r * .97, -r * .12, 6) +
    path(`M${f1(-ex + lr * .85 + gx)} ${f1(gy - r * .05)}Q${f1(gx)} ${f1(gy - r * .15)} ${f1(ex - lr * .85 + gx)} ${f1(gy - r * .05)}`, 'none', 7);
  for (const sd of [-1, 1]) { const cx = sd * ex + gx;
    s += circ(cx, gy, lr, '#1d1d26', 7) + path(`M${f1(cx - lr * .6)} ${f1(gy - lr * .15)}Q${f1(cx - lr * .5)} ${f1(gy - lr * .6)} ${f1(cx - lr * .05)} ${f1(gy - lr * .7)}`, 'none', Math.max(3, r * .045), 'rgba(255,255,255,.7)'); }
  return s + _browsBase(q.brows, r, gx, gy - r * .2);
};
const heroHair = (r, t, o) => { _AV = {}; return hairSvg('side', o.hairColor || HERO_HAIR, r, t); };
// canne blanche (dans le repère de la main) : poignée noire au-dessus de la main, bout rouge au sol
function avCane(dx, dy) { const L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, x0 = -ux * L * .55, y0 = -uy * L * .55;
  return line(x0, y0, dx, dy, 18, OL) + line(x0, y0, dx, dy, 10, '#fff') + line(dx - ux * L * .32, dy - uy * L * .32, dx - ux * L * .1, dy - uy * L * .1, 10, '#e2463a') +
    line(x0, y0, x0 + ux * L * .3, y0 + uy * L * .3, 12, '#2b2b33') + circ(dx, dy, 9, '#fff', 5); }
function heroP(o, t) {
  o = Object.assign({ age: 'kid', hairFn: heroHair, shirt: HERO_SHIRT, pants: '#3b3f4a', skin: HERO_SKIN, seed: 2 }, o);
  if (o.cane) { const a = o.armR || (o.armR = [50, 62]); const hx = 69 + Math.cos(R(a[0])) * 56 + Math.cos(R(a[1])) * 54, hy = -188 + Math.sin(R(a[0])) * 56 + Math.sin(R(a[1])) * 54;
    const tip = 150 + (o.tap ? Math.sin(t * 7 + (o.ph || 0)) * 45 : 0) + (o.caneX || 0); o.holdR = avCane(tip - hx, 4 - hy); }
  return person(o, t); }
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: heroHair, skin: HERO_SKIN, seed: 2 }, o), t));
// ---------- le chien guide (labrador doré, harnais à poignée), sol à yb, regarde à droite (o.flip = à gauche) ----------
function avDog(x, yb, s, t, o = {}) { const c = '#e8b866', c2 = '#c98f45', wag = Math.sin(t * 14) * 16, sh = o.shock;
  let g = G(`rotate(${f1(-30 + wag)} -140 -165)`, path('M-140 -165Q-200 -200 -215 -270', 'none', 30, OL) + path('M-140 -165Q-200 -200 -215 -270', 'none', 18, c));
  const lg = (lx, ph) => { const k = (o.walk ? Math.sin(t * 9 + ph) * 14 : 0); return rect(lx - 17 + k, -125, 34, 125, c2, 14, 6) + ell(lx + 6 + k, -4, 26, 13, c2, 5); };
  g += lg(-110, 0) + lg(70, 1.6) + ell(0, -165, 160, 72, c, 7) + lg(-60, 3.1) + lg(115, 4.7);
  if (o.harness !== false) g += path('M-6 -232L-46 -330Q10 -350 64 -322L36 -232', 'none', 18, OL) + path('M-6 -232L-46 -330Q10 -350 64 -322L36 -232', 'none', 9, '#e2463a') + rect(-26, -236, 74, 120, '#e2463a', 10, 6) + rect(-4, -200, 30, 22, '#fff', 4, 3);
  g += G(tr(160, -250 + (sh ? -20 : 0), 1, sh ? -8 : 0), ell(-34, 10, 30, 56, c2, 6, OL).replace('<ellipse', `<ellipse transform="rotate(20 -34 10)"`) + circ(0, 0, 74, c, 7) + ell(60, 32, 52, 36, '#f4d29a', 6) + ell(104, 18, 16, 12, OL, 0) +
    (sh ? circ(14, -16, 16, '#fff', 5) + circ(16, -16, 7, OL, 0) : circ(14, -16, 10, OL, 0) + circ(18, -20, 3.5, '#fff', 0)) + (sh ? ell(70, 62, 14, 18, OL, 0) : path('M44 54Q70 72 94 50', 'none', 6) + ell(76, 76 + Math.sin(t * 10) * 3, 12, 18, '#ff7a8a', 5)) + rect(-60, 46, 70, 20, '#5b8fd8', 8, 5));
  return G(tr(x, yb, s) + (o.flip ? ' scale(-1 1)' : ''), g); }
// ondes sonores (arcs qui partent) : dir en degrés, spread = demi-ouverture
function avWaves(x, y, t, col = SONAR, dir = 0, spread = 40, n = 3, Rr = 200, sw = 10) { let s = '';
  for (let i = 0; i < n; i++) { const k = (t * 1.1 + i / n) % 1, r = 30 + k * Rr, a0 = R(dir - spread), a1 = R(dir + spread);
    s += op(1 - k, path(`M${f1(x + Math.cos(a0) * r)} ${f1(y + Math.sin(a0) * r)}A${f1(r)} ${f1(r)} 0 0 1 ${f1(x + Math.cos(a1) * r)} ${f1(y + Math.sin(a1) * r)}`, 'none', sw, col)); }
  return s; }
const avWaves2 = (x, y, t, col = SONAR, gap = 60, Rr = 180) => avWaves(x + gap, y, t, col, 0, 40, 3, Rr) + avWaves(x - gap, y, t + .3, col, 180, 40, 3, Rr);
// POV du héros : noir profond, poussière sonore
function avPOV(T) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#06070d', 0, 0) + op(.5, radial(CX, 900, 900, '#1a2040', '#06070d'));
  for (let i = 0; i < 28; i++) { const x = (i * 397) % W, y = (i * 613 + T * 20 * (i % 3 + 1)) % H; s += circ(x, y, 2 + (i % 3), 'rgba(143,208,255,.25)', 0); }
  return s; }
// le dessin de Kevin (maison, soleil, fleur, signature)
const avDrawing = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-150, -110, 300, 220, '#fff', 6, 6) + circ(95, -60, 30, '#ffd23f', 4) + [0, 1, 2, 3, 4, 5].map(i => line(95 + Math.cos(i) * 40, -60 + Math.sin(i) * 40, 95 + Math.cos(i) * 56, -60 + Math.sin(i) * 56, 4, '#ffb03a')).join('') +
  path('M-110 70L-110 -10L-60 -60L-10 -10L-10 70Z', '#ff8fb1', 4) + rect(-75, 20, 30, 50, '#5b8fd8', 2, 3) + path('M40 70L40 20', 'none', 4, '#36a85a') + circ(40, 12, 14, '#e2463a', 3) + line(-140, 80, 140, 80, 5, '#36a85a') + ftext(100, 102, 'KEVIN', { size: 18, fill: '#e2463a', stroke: 'none' }));
// trottinette / scooter garé
const avScooter = (x, yb, s = 1, c = '#e2463a') => G(tr(x, yb, s), circ(-150, -50, 50, '#2b2b33', 7) + circ(-150, -50, 18, '#9aa3ad', 4) + circ(150, -50, 50, '#2b2b33', 7) + circ(150, -50, 18, '#9aa3ad', 4) +
  path('M-200 -90Q-190 -190 -60 -180L60 -120L120 -120L150 -60L-110 -60Z', c, 7) + path('M-180 -170Q-120 -230 -20 -200L-20 -175L-170 -160Z', '#2b2b33', 6) + line(100, -120, 140, -300, 16, '#7d848c') + line(100, -300, 190, -300, 14, OL) + circ(175, -240, 22, '#fff6a0', 5) + rect(-60, -150, 90, 30, shade(c, -.2), 8, 4));
// ordinateur portable (écran = svg dans le repère -190..190 × -260..-20)
const avLaptop = (x, y, s, screen = '', r = 0) => G(tr(x, y, s, r), rect(-210, -280, 420, 280, '#3a3f4a', 18, 7) + rect(-190, -260, 380, 240, '#eef4ff', 8, 0) + screen + path('M-250 0L250 0L280 40L-280 40Z', '#9aa3ad', 7) + rect(-50, 8, 100, 14, '#7d848c', 6, 0));
// serveur (tablier noir)
const avWaiter = (o, t) => adult(4, Object.assign({ hair: 'short', hairColor: '#1f1a18', shirt: '#fff', apron: '#2b2420', pants: '#2b2420', glasses: false, skin: '#f2c9a0' }, o), t);
// table de resto vue de face (cache les jambes)
const avTable = (x, yb, w = 700, t = 0) => G(tr(x, yb), rect(-w / 2, -20, w, 40, '#fff', 10, 7) + rect(-w / 2 + 10, 20, w - 20, 300, '#e9e2d4', 6, 6) + path(`M${-w / 2 + 10} 20L${-w / 2 + 60} 140L${-w / 2 + 110} 20M${w / 2 - 110} 20L${w / 2 - 60} 140L${w / 2 - 10} 20`, '#d9534f', 0) +
  ell(-150, -24, 70, 16, '#fff', 5) + ell(150, -24, 70, 16, '#fff', 5) + G(tr(0, -70), rect(-22, -40, 44, 90, 'rgba(200,235,255,.7)', 10, 5) + ell(0, -24, 10, 30, '#fff', 0)) + G(tr(-290, -50), circ(0, 0, 24, '#ffd23f', 4) + path('M0 -24L0 -60', 'none', 4)));
// bandes podotactiles jaunes (sol)
const avTactile = (x0, x1, y) => { let s = rect(x0, y - 22, x1 - x0, 44, '#ffd23f', 8, 5); for (let x = x0 + 22; x < x1 - 10; x += 36) s += circ(x, y - 6, 7, '#e8b400', 0) + circ(x + 18, y + 10, 7, '#e8b400', 0); return s; };
// passage piéton (sol)
const avZebra = (x, y, n = 6, s = 1) => G(tr(x, y, s), Array.from({ length: n }, (_, i) => path(`M${-420 + i * 150} 0L${-330 + i * 150} 0L${-300 + i * 160} 260L${-410 + i * 160} 260Z`, '#fff', 0)).join(''));
// note de musique
const avNote = (x, y, s = 1, c = SX.acc2, r = 0) => G(tr(x, y, s, r), ell(0, 0, 22, 16, c, 5) + line(18, -2, 18, -80, 7) + path('M18 -80Q40 -70 44 -46', 'none', 7));
const DIM = (k = .3) => op(k, rect(-M, -M, W + 2 * M, H + 2 * M, '#141838', 0, 0));

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001 — SIGNATURE : grille encre, héros + chien en cut-out, ondes sonores, titre 3 lignes, « débloqué » en étoiles sur AVEUGLE
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'aveugle');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX - 60, 1050, 300, t, .4, SX.acc, 16) + unlock(CX - 60, 1000, t, K, { part: 'back', r: 480 }) + avWaves2(CX - 60, 1060, t, SONAR, 150, 220) +
      G(tr(CX - 90, 1440, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.25, expr: t > K ? 'joy' : 'happy', cane: 1, tap: 1 }, t), 12)) + cutout(avDog(CX + 230, 1450, .7, t, {}), 10) +
      unlock(CX - 60, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX - 90, 1060, 300, 300, t, K + .2, { label: 'aveugle.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'ÊTRE", CX, 415, t, .3, { size: 58 }) +
      kword('AVEUGLE ?', CX, 540, t, K - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'aveugle') - .05, 'boom', .6], [at(1, 'aveugle'), 'sparkle', .5], [.6, 'tick', .3]] });

// B002 — « Tu as 6 ans » : papier + gobo, gâteau à 6 bougies, le héros souffle (il sent la chaleur des bougies)
B(2, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { let candles = ''; for (let i = 0; i < 6; i++) { const x = -125 + i * 50; candles += rect(x - 8, -150, 16, 60, DPAL[i % 8], 4, 4) + G(tr(x, -165, 1 + .15 * Math.sin(t * 20 + i)), path('M0 -22Q12 -4 0 6Q-12 -4 0 -22Z', '#ffb03a', 3)); }
    return paper(SX.paper) + gobo(T, .12) + burst(760, 980, 300, t, .05, '#ffe1b8', 16) +
      cutout(heroP({ x: 320, y: 1450, s: 1.25, expr: 'joy', cane: 1 }, t), 10) + cutout(G(tr(760, 1180), rect(-190, -90, 380, 150, '#ff8fb1', 24, 6) + rect(-190, -90, 380, 40, '#fff', 20, 0) + candles + rect(-220, 60, 440, 20, '#fff', 8, 5)), 10) +
      funTag(CX, 520, '6 ANS', t, at(2, '6') - .1, { size: 96, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 520, t, at(2, '6'), 6, 180); },
  sfx: [[0, 'whoosh', .4], [at(2, '6') - .1, 'pop', .7], [at(2, '6'), 'tada', .4], [.4, 'sparkle', .3]] });

// B003 — « À l'école, Kevin te tend un dessin » : salle de classe, Kevin tend fièrement son dessin
B(3, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Ds = at(3, 'dessin'), Td = at(3, 'tend'), k = eOutBack(seg(t, Td - .1, Td + .3));
    const board = ftext(540, 640, 'DESSIN LIBRE', { size: 70, fill: 'rgba(255,255,255,.85)', stroke: 'none' });
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.3, svg: classroomT(t, board), haze: .06 },
      { z: 1, svg: heroP({ x: 300, y: 1490, s: 1.3, expr: 'happy', cane: 1, look: [1, 0] }, t) + avDog(120, 1560, .55, t, { flip: 0 }) + kevin({ x: 800, y: 1490, s: 1.3, expr: 'proud', flip: 1, armR: [-10, -20] }, t) +
        avDrawing(lerp(760, 590, k), 1020, .85, -6) },
      { z: .6, svg: blur(10, dBag(980, 1860, 1.4, '#ff8fb1', -10)) }]) +
      funTag(CX, 430, "À L'ÉCOLE", t, at(3, 'ecole') - .1, { size: 56, bg: SX.acc2, fg: SX.ink }) + markerCircle(590, 1020, 150, 115, t, Ds, { col: SX.acc }) + markerText('mon dessin !', 820, 640, t, Ds, { size: 44 }); },
  sfx: [[0, 'school_bell', .4], [at(3, 'ecole') - .1, 'pop', .5], [at(3, 'tend') - .1, 'flutter', .5], [at(3, 'dessin'), 'scratch', .5]] });

// B004 — « Alors ? Il est beau ? » : crash zoom sur Kevin qui brandit son dessin, étincelles de fierté
B(4, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.1, eOutCubic(clamp(t / .4))), hand: .3 }),
  draw: (t, d, T) => { const Bx = at(4, 'beau');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .3 }, { z: 1, svg: kevinHead(380, 960, 200, { expr: t > Bx ? 'ecstatic' : 'proud', look: [1, 0] }, t) + avDrawing(790, 960, 1.1, 6 + Math.sin(t * 12) * 3) + sparkle(930, 800, .5 + .1 * Math.sin(t * 9)) + sparkle(660, 1100, .4) }]) +
      funTag(330, 470, 'ALORS ?', t, at(4, 'alors') - .1, { size: 56, bg: '#fff', fg: SX.ink, r: -6 }) + kword('IL EST BEAU ?', CX, 600, t, Bx - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [at(4, 'alors') - .1, 'pop_hi', .5], [at(4, 'beau') - .05, 'boom', .5], [at(4, 'beau'), 'sparkle', .5]] });

// B005 — « Tu réponds : » : gros plan sur le héros, serein, ondes qui captent la voix de Kevin
B(5, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .3 }, { z: 1, svg: heroHead(CX, 940, 230, { expr: 'smug' }, t) + avWaves(CX + 280, 920, t, SONAR, 180, 30, 3, 140) }]) +
    funTag(CX, 470, 'TU RÉPONDS…', t, at(5, 'reponds') - .15, { size: 62, bg: SX.acc, fg: '#fff' }),
  sfx: [[0, 'whoosh', .4], [at(5, 'reponds') - .15, 'pop', .6], [.2, 'hmm', .4]] });

// B006 — « Décris-le-moi. » : bulle du héros, Kevin bloqué la bouche ouverte
B(6, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const Dc = at(6, 'decris');
    return classroomT(t) + WASH() + heroP({ x: 300, y: 1500, s: 1.35, expr: 'happy', cane: 1, armL: [200, 240] }, t) + kevin({ x: 790, y: 1500, s: 1.35, expr: t > Dc + .2 ? 'jawdrop' : 'proud', flip: 1, armR: [-10, -20], holdR: avDrawing(0, -40, .6, 4) }, t) +
      chatBubble(330, 720, 420, 120, 'DÉCRIS-LE-MOI !', t, Dc - .1, true, 46) + (t > Dc + .2 ? emark(900, 820, .6) + sweat(900, 950, 1) : ''); },
  sfx: [[at(6, 'decris') - .1, 'pop', .6], [at(6, 'moi'), 'boing', .5], [at(6, 'moi') + .1, 'gasp', .4]] });

// B007 — « Il insiste. » : Kevin colle le dessin sur les lunettes du héros (qui reste de marbre)
B(7, { enter: 'drop', cam: (t, d) => ({ z: 1.08, hand: .4, shake: t > .2 && t < .35 ? 5 : 0, r: 3 }),
  draw: (t, d, T) => { const k = eOutBack(seg(t, 0, .25));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .3 }, { z: 1, svg: heroHead(400, 960, 210, { expr: 'deadpan' }, t) + avDrawing(lerp(900, 580, k), 1010, 1.0, -8 + Math.sin(t * 25) * 3) +
      G(tr(lerp(1000, 680, k), 1110), circ(0, 0, 40, SKIN, 6)) + G(tr(lerp(1000, 690, k), 880), circ(0, 0, 40, SKIN, 6)) }]) +
      funTag(CX, 470, 'IL INSISTE', t, at(7, 'insiste') - .1, { size: 64, bg: SX.acc2, fg: SX.ink, r: 4 }) + motionLines(960, 1000, 3, 80, 0); },
  sfx: [[0, 'whoosh', .5], [.22, 'squeak', .5], [at(7, 'insiste') - .1, 'pop', .6]] });

// B008 — « Mais regarde, Kevin. » : le héros montre ses lunettes et sa canne, Kevin percute
B(8, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Rg = at(8, 'regarde'), Kv = at(8, 'kevin');
    return classroomT(t) + WASH() + heroP({ x: 330, y: 1500, s: 1.35, expr: 'smug', cane: 1, armL: [200, 260] }, t) + kevin({ x: 800, y: 1500, s: 1.35, expr: t > Kv ? 'shock' : 'confused', flip: 1, armR: [60, 80], holdR: avDrawing(0, 20, .5, 80) }, t) +
      markerCircle(330, 1080, 120, 80, t, Rg, { col: SX.acc2 }) + markerCircle(500, 1360, 70, 120, t, Rg + .3, { col: SX.acc2 }) +
      kword('REGARDE, KEVIN.', CX, 520, t, Rg - .05, { size: 76, fill: SX.acc2 }) + (t > Kv ? G(tr(900, 860), circ(0, 0, 36, '#fff6a0', 5) + rect(-14, 30, 28, 26, '#9aa3ad', 4, 4)) + popStars(900, 860, t, Kv, 6, 120) : ''); },
  sfx: [[at(8, 'regarde') - .05, 'pop', .6], [at(8, 'regarde'), 'scratch', .5], [at(8, 'regarde') + .3, 'scratch', .4], [at(8, 'kevin'), 'ding', .6]] });

// B009a — « On va peut-être devoir revoir le concept… » : le héros prof au tableau (canne = baguette), Kevin élève
const O9 = at(9, 'concept') - .15;
B(9, { enter: 'none', trans: 'up', transD: .22, cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const Rv = at(9, 'revoir');
    const board = ftext(540, 600, 'COURS N°1', { size: 64, fill: 'rgba(255,255,255,.85)', stroke: 'none' }) + ftext(540, 700, 'VOIR ≠ VOIR', { size: 56, fill: 'rgba(255,255,255,.7)', stroke: 'none' });
    return classroomT(t, board) + heroP({ x: 220, y: 1480, s: 1.25, expr: 'proud', armR: [-40, -60], holdR: avCane(60, -160), armL: [200, 240] }, t) + avDog(470, 1560, .5, t) +
      G(tr(800, 1560), rect(-150, -170, 300, 30, '#c58e55', 6, 6) + rect(-130, -140, 26, 140, '#8a5a3a', 0, 4) + rect(104, -140, 26, 140, '#8a5a3a', 0, 4)) + kevin({ x: 800, y: 1440, s: 1.15, expr: 'confused', flip: 1, armR: [-70, -100] }, t) +
      funTag(CX, 430, 'RÉVISION', t, Rv - .1, { size: 60, bg: SX.acc, fg: '#fff' }) + qmark(930, 820, .5, SX.acc2, 10); },
  sfx: [[0, 'whoosh', .4], [at(9, 'revoir') - .1, 'pop', .6], [.2, 'tick', .4], [.5, 'tick', .4]] });
// B009b — « …de la cécité. » : gros plan Kevin, l'ampoule s'allume, mot-clé CÉCITÉ
B(9, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, eOutCubic(clamp(t / .4))), shake: 2 }),
  draw: (t, d, T) => { const Cc = at(9, 'cecite') - O9;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .35 }, { z: 1, svg: kevinHead(CX, 1000, 210, { expr: t > Cc ? 'wow' : 'confused' }, t) }]) +
      G(tr(CX, 700, eOutBack(seg(t, Cc - .3, Cc))), circ(0, 0, 70, t > Cc ? '#fff6a0' : '#e8e8e8', 7) + rect(-30, 60, 60, 46, '#9aa3ad', 8, 5) + (t > Cc ? op(.5, glow(0, 0, 160, '#fff6a0', .8)) : '')) +
      kword('LA CÉCITÉ', CX, 470, t, Cc - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [at(9, 'cecite') - O9 - .3, 'pop_hi', .4], [at(9, 'cecite') - O9 - .05, 'boom', .5], [at(9, 'cecite') - O9, 'ding', .6]] }, O9);

// B010 — « Bienvenue dans la vie d'un enfant aveugle de naissance » : paillasson BIENVENUE, débloqué en étoiles
B(10, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const Av = at(10, 'aveugle');
    return paper('#e6ecff') + gobo(T, .1) + unlock(CX, 1000, t, Av, { part: 'back', r: 470 }) + G(tr(CX, 1300), rect(-330, -40, 660, 120, '#c58e55', 30, 7) + ftext(-205, 42, 'BIEN', { size: 60, fill: '#7a4a2a', stroke: 'none' }) + ftext(205, 42, 'VENUE', { size: 60, fill: '#7a4a2a', stroke: 'none' })) +
      cutout(heroP({ x: CX - 80, y: 1290, s: 1.3, expr: 'joy', cane: 1, armL: [200, 230] }, t), 12) + cutout(avDog(CX + 230, 1300, .62, t), 10) + unlock(CX, 1000, t, Av, { part: 'front', r: 470 }) +
      kthin("bienvenue dans la vie d'un", CX, 400, t, at(10, 'bienvenue') - .1, { size: 50 }) + kword('ENFANT AVEUGLE', CX, 520, t, Av - .05, { size: 80, fill: SX.acc2 }) +
      funTag(CX, 650, 'DE NAISSANCE', t, at(10, 'naissance') - .05, { size: 46, bg: SX.acc, fg: '#fff' }); },
  sfx: [[0, 'magic', .5], [at(10, 'bienvenue'), 'pop_hi', .4], [at(10, 'aveugle') - .05, 'tada', .6], [at(10, 'aveugle'), 'sparkle', .5], [at(10, 'naissance') - .05, 'pop', .5]] });

// B011 — « Contrairement à ce que beaucoup imaginent, » : rue, les passants imaginent tous… un écran noir
B(11, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bc = at(11, 'beaucoup'), Im = at(11, 'imaginent');
    const tv = (x, y, t0) => t > t0 ? G(tr(x, y, eOutBack(seg(t, t0, t0 + .3))), cloud(0, 0, 1.1, '#fff', 6) + rect(-70, -50, 140, 96, '#111', 10, 6) + line(-30, 46, -46, 70, 6) + line(30, 46, 46, 70, 6)) : '';
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: [0, 1, 2].map(i => adult(i + 1, { x: 470 + i * 220, y: 1480 + (i % 2) * 15, s: 1.0, expr: 'confused', look: [0, -1], flip: i === 2 }, t + i)).join('') + heroP({ x: 180, y: 1490, s: 1.2, expr: 'calm', cane: 1, tap: 1 }, t) },
      { z: .6, svg: blur(10, dBush(1000, 1900, 1.6)) }]) +
      tv(470, 780, Bc) + tv(690, 740, Bc + .15) + tv(910, 780, Bc + .3) + kthin('contrairement à ce que', CX, 410, t, at(11, 'contrairement') - .1, { size: 52 }) + kword('BEAUCOUP IMAGINENT', CX, 530, t, Im - .05, { size: 66, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(11, 'beaucoup'), 'pop_hi', .5], [at(11, 'beaucoup') + .15, 'pop_hi', .5], [at(11, 'beaucoup') + .3, 'pop_hi', .5], [at(11, 'imaginent') - .05, 'hmm', .5]] });

// B012 — « être aveugle ne signifie pas forcément voir un écran noir » : salon, la télé noire, tampon PAS FORCÉMENT
B(12, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Fo = at(12, 'forcement'), Ec = at(12, 'ecran'), Nr = at(12, 'noir');
    return salonF(t) + WASH() + G(tr(700, 1000), rect(-230, -170, 460, 300, '#2b2b33', 18, 7) + rect(-210, -150, 420, 260, '#050508', 8, 0) + op(.25, path('M-180 -120L-120 -140M-190 -80L-60 -130', 'none', 8, '#fff')) + rect(-60, 130, 120, 40, '#5a4030', 4, 5) + rect(-160, 170, 320, 30, '#7a5a3a', 6, 5)) +
      heroP({ x: 250, y: 1490, s: 1.3, expr: 'suspicious', cane: 1, armL: [200, 250] }, t) +
      kthin('être aveugle ≠', CX, 410, t, at(12, 'etre') - .1, { size: 56 }) + kword('ÉCRAN NOIR', 700, 1010, t, Ec - .05, { size: 64, fill: '#fff' }) + cross(700, 1000, .9, t, Nr + .1) +
      stamp(CX, 580, 'PAS FORCÉMENT', t, Fo - .05, '#3a5bff', -6, 66); },
  sfx: [[0, 'zap', .4], [at(12, 'forcement') - .05, 'thud', .7], [at(12, 'ecran') - .05, 'pop', .5], [at(12, 'noir') + .1, 'error_beep', .5]] });

// B013 — « Il existe différents degrés de cécité » : 4 cartes du même paysage, de plus en plus floues/sombres (concept)
B(13, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .2 }),
  draw: (t, d, T) => { const Df = at(13, 'differents'), Dg = at(13, 'degres');
    const land = (b, dk) => { let s = rect(-170, -120, 340, 240, '#9fd6ff', 0, 0) + circ(90, -50, 34, '#ffd23f', 4) + rect(-170, 50, 340, 70, '#7bc96f', 0, 0) + rect(-110, -20, 70, 80, '#ff8fb1', 0, 4) + path('M-120 -20L-75 -60L-30 -20Z', '#e2463a', 4) + circ(60, 20, 34, '#36a85a', 4) + rect(54, 40, 12, 30, '#8a5a3a', 0, 3);
      return (b ? blur(b, s) : s) + (dk ? rect(-170, -120, 340, 240, `rgba(6,7,13,${dk})`, 0, 0) : ''); };
    const L = [['FLOU', 6, 0], ['TRÈS FLOU', 16, .15], ['LUMIÈRE', 30, .6], ['NOIR', 0, 1]];
    return paper('#e6ecff') + gobo(T, .08) + L.map(([lb, b, dk], i) => { const x = i % 2 ? 790 : 290, y = i < 2 ? 760 : 1060;
      return card(x, y, 380, 270, clipR(-170, -120, 340, 240, land(b, dk), 14) + G(tr(0, 150), funTag(0, 0, lb, t, Df + i * .25 + .2, { size: 34, bg: [SX.cool, SX.acc2, '#ffb03a', SX.ink][i], fg: i === 3 ? '#fff' : SX.ink })), t, Df + i * .25, { ry: 0, thick: 10, r: [-4, 3, 2, -3][i], bw: 6 }); }).join('') +
      kthin('il existe différents', CX, 390, t, at(13, 'existe') - .1, { size: 54 }) + kword('DEGRÉS', CX, 520, t, Dg - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(13, 'differents'), 'pop_hi', .4], [at(13, 'differents') + .25, 'pop_hi', .4], [at(13, 'differents') + .5, 'pop_hi', .4], [at(13, 'degres') - .05, 'boom', .5], [at(13, 'differents') + .75, 'pop_hi', .4]] });

// B014 — « Et si tu n'as jamais eu de vision, » : chambre de nuit, bébé héros (lunettes de star) dans son lit, mobile musical
B(14, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Jm = at(14, 'jamais');
    let mob = line(0, -120, 0, 0, 5) + G(`rotate(${f1(t * 40)})`, line(-130, 0, 130, 0, 6) + [-130, 0, 130].map((x, i) => line(x, 0, x, 60, 4) + circ(x, 80, 26, DPAL[i * 2], 5)).join(''));
    return bedroomN(t) + WASH('rgba(255,255,255,.08)') + G(tr(800, 600), mob) + avNote(380 + Math.sin(t * 3) * 20, 700 - (t * 60 % 120), .8, SX.acc2, -10) + avNote(700, 660 - (t * 50 % 100), .7, SONAR, 10) +
      person({ age: 'baby', x: CX, y: 1180, s: 1.3, hairFn: heroHair, skin: HERO_SKIN, expr: 'joy', shirt: '#9dbcec' }, t) +
      G(tr(CX, 1250), rect(-360, -60, 720, 40, '#c58e55', 10, 7) + [-300, -200, -100, 0, 100, 200, 300].map(x => rect(x - 12, -20, 24, 220, '#e8c690', 6, 5)).join('') + rect(-380, 190, 760, 50, '#c58e55', 10, 7)) +
      funTag(CX, 430, 'JAMAIS', t, Jm - .05, { size: 72, bg: SX.acc, fg: '#fff' }) + kthin('eu de vision', CX, 540, t, at(14, 'vision') - .1, { size: 50 }); },
  sfx: [[0, 'baby_coo', .5], [at(14, 'jamais') - .05, 'pop', .6], [.3, 'ding', .3], [at(14, 'vision'), 'magic', .4]] });

// B015 — « tu n'as pas de souvenir visuel auquel comparer ton expérience » : dossier SOUVENIRS_VISUELS vide (0 fichier)
B(15, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Sv = at(15, 'souvenir'), Cp = at(15, 'comparer');
    const folder = rect(-200, -130, 160, 50, '#ffcf5a', 14, 6) + rect(-200, -100, 400, 250, '#ffd23f', 18, 7) + ftext(0, -30, 'souvenirs_visuels/', { size: 30, fill: OL, stroke: 'none' }) + ftext(0, 60, '0 fichier', { size: 50, fill: '#e2463a', stroke: 'none' });
    return bedroomN(t) + WASH() + heroP({ x: 300, y: 1500, s: 1.35, expr: 'confused', armL: [200, 250], armR: [-20, -70] }, t) + avDog(820, 1520, .6, t, { flip: 1 }) +
      card(700, 850, 460, 330, folder, t, Sv - .1, { ry: 0, thick: 10, r: 4, bw: 6 }) + (t > Sv + .4 ? popStars(700, 850, t, Sv + .4, 5, 160, ['#fff', SONAR, SX.acc2]) : '') +
      funTag(CX, 450, 'SOUVENIR VISUEL ?', t, at(15, 'visuel') - .1, { size: 50, bg: SX.acc2, fg: SX.ink }) + markerText('comparer… à quoi ?', 700, 1150, t, Cp, { size: 44 }); },
  sfx: [[0, 'whoosh', .4], [at(15, 'souvenir') - .1, 'pop', .5], [at(15, 'visuel'), 'error_beep', .4], [at(15, 'comparer'), 'scratch', .5], [at(15, 'experience'), 'hmm', .4]] });

// B016 — « Tu découvres le monde autrement » : rue, le héros et son chien avancent, tout le décor « chante » (ondes)
B(16, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const Au = at(16, 'autrement');
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: streetT(t, 2) + avWaves(470, 850, t, SONAR, -90, 50, 3, 120) + avWaves(950, 1180, t + .4, SONAR, -90, 50, 3, 120) + dBird(300, 380, .9, t) + avWaves(300, 380, t, SX.acc2, 0, 40, 2, 100), haze: .06 },
      { z: 1, svg: heroP({ x: 350, y: 1490, s: 1.3, expr: 'joy', cane: 1, tap: 1, walk: 6 }, t) + avDog(720, 1500, .7, t, { walk: 1 }) },
      { z: .6, svg: blur(10, dFlowers(950, 1900, 5, 3, t)) }]) +
      (t > Au ? burst(CX, 560, 200, t, Au, SX.acc, 14) : '') + kthin('tu découvres le monde', CX, 410, t, at(16, 'decouvres') - .1, { size: 54 }) + kword('AUTREMENT', CX, 540, t, Au - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'chirp', .5], [at(16, 'decouvres'), 'steps', .4], [at(16, 'autrement') - .05, 'boom', .5], [at(16, 'monde'), 'pop_hi', .4]] });

// B017a — « Par les sons, les textures » : POV NOIR, le monde se dessine en ondes (oiseau, voiture), puis la main touche l'écorce
const O17 = at(17, 'odeurs') - .15;
B(17, { enter: 'none', trans: 'black', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .5 }),
  draw: (t, d, T) => { const Sn = at(17, 'sons'), Tx = at(17, 'textures');
    const reveal = (t0) => clamp((t - t0) / .4) * (0.75 + .25 * Math.sin(t * 6));
    return avPOV(T) + op(.5, avWaves2(CX, 950, t, SONAR, 80, 260)) + op(reveal(Sn), dBird(280, 760, 1.4, t) + avWaves(280, 760, t, SONAR, 0, 50, 3, 220)) + op(reveal(Sn + .2), dCar(800, 1130, 1.1, '#5ec4f0', 1) + avWaves(800, 1000, t + .5, SONAR, -90, 60, 3, 200)) +
      (t > Tx - .1 ? op(reveal(Tx - .1), G(tr(CX, 1000), rect(-220, -280, 160, 560, '#8a5a3a', 30, 7) + [0, 1, 2, 3, 4].map(i => path(`M${-200 + (i % 2) * 30} ${-240 + i * 110}q40 30 0 70`, 'none', 6, '#5a3a26')).join('') +
        G(tr(40 + Math.sin(t * 8) * 10, 0), ell(0, 0, 90, 70, HERO_SKIN, 7) + [0, 1, 2, 3].map(i => rect(-100, -60 + i * 34, 60, 28, HERO_SKIN, 14, 6)).join('')) + avWaves(-140, 0, t, SX.cool, 180, 50, 3, 160))) : '') +
      funTag(330, 470, 'LES SONS', t, Sn - .1, { size: 60, bg: SONAR, fg: SX.ink, r: -6 }) + funTag(760, 600, 'LES TEXTURES', t, Tx - .1, { size: 52, bg: SX.cool, fg: SX.ink, r: 5 }); },
  sfx: [[0, 'whoosh', .4], [at(17, 'sons') - .1, 'pop_hi', .5], [at(17, 'sons'), 'chirp', .6], [at(17, 'sons') + .3, 'wind', .3], [at(17, 'textures') - .1, 'pop_hi', .5], [at(17, 'textures') + .1, 'scratch', .4]] });
// B017b — « …les odeurs, la position des objets » : salon, le croissant envoie son odeur, les objets ont leurs repères
B(17, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Od = at(17, 'odeurs') - O17, Ps = at(17, 'position') - O17;
    let smell = ''; for (let i = 0; i < 3; i++) smell += path(`M${780 - i * 20} ${1050 - i * 40}Q${640} ${980 + Math.sin(t * 4 + i) * 40 - i * 40} ${520} ${1030 - i * 30}Q${440} ${1060 + Math.sin(t * 5 + i) * 30 - i * 30} ${380} ${1000 - i * 30}`, 'none', 9, ['#ffb03a', '#ffd23f', '#ff8fb1'][i]);
    return salonF(t) + WASH() + G(tr(810, 1180), rect(-170, -10, 340, 30, '#c58e55', 8, 6) + rect(-150, 20, 24, 200, '#8a5a3a', 0, 5) + rect(126, 20, 24, 200, '#8a5a3a', 0, 5) + path('M-60 -10Q-80 -70 -20 -80Q20 -100 50 -70Q90 -60 70 -10Z', '#e8a24a', 6) + dMug(80, -14, .8, t, '#5b8fd8')) +
      heroP({ x: 280, y: 1490, s: 1.3, expr: 'ecstatic', face: { mouth: 'grin' }, cane: 1, look: [1, 0] }, t) + op(seg(t, Od - .1, Od + .3), smell) +
      (t > Ps ? markerPath(`M300 1340Q560 1300 760 1340`, t, Ps, { col: SX.acc2 }) + funTag(560, 1180, '3 PAS', t, Ps + .1, { size: 34, bg: SX.acc2, fg: SX.ink }) : '') +
      funTag(330, 470, 'LES ODEURS', t, Od - .1, { size: 56, bg: '#ffb03a', fg: SX.ink, r: -5 }) + funTag(760, 600, 'LA POSITION', t, Ps - .1, { size: 50, bg: SX.acc, fg: '#fff', r: 4 }); },
  sfx: [[at(17, 'odeurs') - O17 - .1, 'pop_hi', .5], [at(17, 'odeurs') - O17 + .1, 'magic', .4], [at(17, 'position') - O17 - .1, 'pop_hi', .5], [at(17, 'objets') - O17, 'scratch', .4]] }, O17);

// B018 — « Tu apprends à te repérer » : trottoir à bandes podotactiles, tic-tic de la canne, épingles de repère
B(18, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .4 }),
  draw: (t, d, T) => { const Rp = at(18, 'reperer');
    const pin = (x, y, t0, c) => t > t0 ? G(tr(x, y, eOutBack(seg(t, t0, t0 + .3))), path('M0 0Q-50 -60 -50 -90A50 50 0 0 1 50 -90Q50 -60 0 0Z', c, 6) + circ(0, -90, 18, '#fff', 4)) : '';
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2) + avTactile(-M, W + M, 1330), haze: .06 },
      { z: 1, svg: heroP({ x: 420, y: 1490, s: 1.3, expr: 'effort', cane: 1, tap: 1, walk: 5 }, t) + avDog(800, 1500, .65, t, { walk: 1 }) },
      { z: .6, svg: blur(10, dBin(80, 1850, 1.4, '#36a85a')) }]) +
      pin(230, 830, .2, SX.acc) + pin(900, 760, .45, SX.cool) + pin(650, 700, Rp - .1, SX.acc2) + funTag(CX, 450, 'TE REPÉRER', t, Rp - .05, { size: 64, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'tick', .5], [.3, 'tick', .5], [.2, 'pop_hi', .4], [.45, 'pop_hi', .4], [at(18, 'reperer') - .05, 'pop', .6], [.75, 'tick', .5]] });

// B019 — « Parfois avec une canne blanche, du braille, » : couloir, la canne brille (étoiles), puis la carte braille
B(19, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Cn = at(19, 'canne'), Br = at(19, 'braille');
    let dots = ''; for (let j = 0; j < 4; j++) for (let i = 0; i < 9; i++) if ((i * 7 + j * 3) % 5 < 3) dots += circ(-190 + i * 46 + (i % 2) * 6, -60 + j * 46, 9, '#7a5a3a', 0);
    return hallway(t) + WASH() + heroP({ x: 300, y: 1500, s: 1.35, expr: 'proud', cane: 1, armL: t > Br ? [-20, -40] : [110, 100] }, t) + avDog(120, 1560, .5, t) +
      (t > Cn && t < Br ? popStars(500, 1250, t, Cn, 6, 160, ['#fff', SX.acc2, SONAR]) + sparkle(520, 1140, .5 + .2 * Math.sin(t * 12)) : '') +
      card(760, 900, 470, 300, rect(-220, -130, 440, 260, '#fff8e8', 10, 0) + dots + ftext(0, 110, 'B O N J O U R', { size: 26, fill: '#b08a5a', stroke: 'none' }), t, Br - .1, { ry: 0, thick: 10, r: -4, bw: 6 }) +
      kword('CANNE BLANCHE', CX, 470, t, Cn - .05, { size: 82, fill: '#fff' }) + funTag(760, 700, 'BRAILLE', t, Br - .05, { size: 54, bg: SX.acc2, fg: SX.ink, r: 5 }); },
  sfx: [[0, 'flash_hit', .4], [at(19, 'canne') - .05, 'boom', .5], [at(19, 'blanche'), 'glint', .6], [at(19, 'braille') - .1, 'pop', .6], [at(19, 'braille') + .2, 'tick', .4]] });

// B020 — « ou un lecteur d'écran qui parle à toute vitesse » : chambre, portable + casque, texte qui défile à fond, compteur ×3
B(20, { enter: 'none', trans: 'glitch', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), shake: t > at(20, 'vitesse') ? 3 : 0 }),
  draw: (t, d, T) => { const Lc = at(20, 'lecteur'), Vt = at(20, 'vitesse'), sp = t > at(20, 'parle') ? 1 : .2;
    let txt = ''; for (let i = 0; i < 5; i++) txt += rect(-170 + ((i * 97 - t * 900 * sp) % 340 + 340) % 340 - 30, -230 + i * 40, 160, 18, i % 2 ? '#9fb4d8' : '#c7d4ee', 6, 0);
    return bedroomN(t) + WASH() + G(tr(CX, 1300), rect(-430, -30, 860, 50, '#c58e55', 8, 7) + rect(-400, 20, 30, 300, '#8a5a3a', 0, 5) + rect(370, 20, 30, 300, '#8a5a3a', 0, 5)) +
      heroP({ x: 300, y: 1470, s: 1.25, expr: 'chill', armR: [-10, 20], armL: [120, 60] }, t) + G(tr(300, 1470 - 1.25 * 270), path('M-110 0Q0 -150 110 0', 'none', 14, OL) + rect(-130, -10, 40, 70, SX.acc, 14, 6) + rect(90, -10, 40, 70, SX.acc, 14, 6)) +
      avLaptop(720, 1270, .95, clipR(-190, -260, 380, 240, txt, 8)) + avWaves(720, 900, t * (1 + sp * 2), SONAR, -90, 50, 3, 160) + (t > Vt ? speedLines(t, 720, 1000, 26) : '') +
      funTag(CX, 450, "LECTEUR D'ÉCRAN", t, Lc - .05, { size: 54, bg: SX.acc, fg: '#fff' }) + kword('×' + counter(1, 4, t, at(20, 'parle'), .6), 870, 640, t, at(20, 'parle'), { size: 110, fill: SX.acc2, r: 6 }) +
      kthin('à toute vitesse !', 420, 640, t, Vt - .1, { size: 46 }); },
  sfx: [[at(20, 'lecteur') - .05, 'pop', .6], [at(20, 'parle'), 'rewind', .5], [at(20, 'parle') + .1, 'typing', .5], [at(20, 'vitesse'), 'whoosh_up', .5]] });

// B021 — « Kevin l'écoute. » : Kevin colle son oreille (énorme) au portable
B(21, { enter: 'whip', cam: (t, d) => ({ z: 1.07, hand: .4, r: -3 }),
  draw: (t, d, T) => { const Ec = at(21, 'ecoute'), k = eOutBack(seg(t, Ec - .1, Ec + .25));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .25 }, { z: 1, svg: kevinHead(420, 960, 200, { expr: 'confused', look: [1, 0] }, t) + G(tr(610, 960, .6 + .7 * k), ell(0, 0, 60, 90, SKIN, 7) + path('M-10 -50Q30 -30 10 10Q-10 30 10 50', 'none', 6, '#d9a080')) +
      avLaptop(900, 1200, .7, '') + avWaves(820, 960, t * 2, SONAR, 180, 40, 3, 140) }]) +
      funTag(CX, 470, "KEVIN L'ÉCOUTE", t, at(21, 'kevin') - .05, { size: 58, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .5], [at(21, 'kevin') - .05, 'pop', .5], [at(21, 'ecoute') - .1, 'boing', .6], [.4, 'rewind', .3]] });

// B022 — « Mais comment tu fais pour comprendre aussi vite ? » : Kevin surchauffe (fumée), mots qui tournent autour
B(22, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.1, eOutCubic(clamp(t / .4))), shake: t > at(22, 'vite') ? 5 : 1 }),
  draw: (t, d, T) => { const Vt = at(22, 'vite'), Cp = at(22, 'comprendre');
    const words = ['bla', 'clic', 'menu', 'ok', 'retour', 'lien'].map((w, i) => { const a = t * 5 + i * 1.05; return ftext(CX + Math.cos(a) * 300, 960 + Math.sin(a) * 140, w, { size: 40, fill: i % 2 ? SONAR : '#fff' }); }).join('');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .3 }, { z: 1, svg: kevinHead(CX, 1000, 200, { expr: t > Cp ? 'dizzy' : 'confused', face: t > Vt ? { steamHead: 1 } : {} }, t) }]) + (t > Cp ? words : '') +
      kthin('mais comment tu fais ?', CX, 420, t, at(22, 'comment') - .1, { size: 54 }) + kword('AUSSI VITE ?!', CX, 560, t, Vt - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [at(22, 'comment'), 'hmm', .5], [at(22, 'comprendre'), 'clock_fast', .4], [at(22, 'vite') - .05, 'boom', .5], [at(22, 'vite') + .1, 'sizzle', .5]] });

// B023a — « Parce que, contrairement à toi, Kevin, » : le héros, cool, pointe Kevin ; Kevin « moi ? »
const O23 = at(23, 'ecoute') - .3;
B(23, { enter: 'none', trans: 'wipe', transD: .2, cam: camHand(1.05, .4),
  draw: (t, d, T) => { const Ct = at(23, 'contrairement'), Kv = at(23, 'kevin');
    return bedroomN(t) + WASH() + heroP({ x: 300, y: 1500, s: 1.35, expr: 'smugger', armL: [200, 230], armR: [-15, -10] }, t) + kevin({ x: 790, y: 1500, s: 1.35, expr: t > Kv ? 'shock' : 'confused', flip: 1, armL: [230, 300] }, t) +
      funTag(CX, 450, 'CONTRAIREMENT À TOI', t, Ct - .1, { size: 52, bg: SX.acc, fg: '#fff' }) + (t > Kv ? chatBubble(800, 720, 180, 90, 'MOI ?', t, Kv, false, 44) : ''); },
  sfx: [[at(23, 'parce'), 'pop_hi', .4], [at(23, 'contrairement') - .1, 'pop', .6], [at(23, 'toi'), 'tick', .4], [at(23, 'kevin'), 'boing', .5]] });
// B023b — « …j'écoute quand quelqu'un parle. » : J'ÉCOUTE en slam, Kevin brûlé (rouge), rimshot
B(23, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.07, shake: t < .3 ? 6 : 0, r: -3 }),
  draw: (t, d, T) => { const Ec = at(23, 'ecoute') - O23, Pl = at(23, 'parle') - O23;
    return rays(t, CX, 950, SX.acc, '#6f86ff', 22) + heroHead(330, 980, 190, { expr: 'smugger' }, t) + kevinHead(780, 1000, 190, { expr: t > Pl ? 'jawdrop' : 'shock', burn: t > Pl ? .8 : 0, look: [-1, 0] }, t) +
      (t > Pl ? steam(720, 790, t, 1) + steam(850, 790, t + .3, 1) : '') + kword("J'ÉCOUTE", CX, 470, t, Ec - .05, { size: 110, fill: SX.acc2 }) + kthin("quand quelqu'un parle.", CX, 620, t, at(23, 'quand') - O23 - .05, { size: 52 }); },
  sfx: [[0, 'flash_hit', .5], [at(23, 'ecoute') - O23 - .05, 'boom', .6], [at(23, 'parle') - O23, 'rimshot', .7], [at(23, 'parle') - O23 + .1, 'sizzle', .4]] }, O23);

// B024 — « Mais il y a un problème. » : rayons rouges, gyrophare, PROBLÈME
B(24, { enter: 'none', trans: 'glitch', transD: .22, cam: () => ({ z: 1.06, shake: 3 }),
  draw: (t, d, T) => { const Pb = at(24, 'probleme'), on = Math.sin(t * 18) > 0;
    return rays(t, CX, 950, '#ff6b6b', '#d93a3a', 22) + heroHead(CX, 980, 210, { expr: 'worried' }, t) + avWaves2(CX, 980, t * 1.5, '#fff', 260, 160) +
      G(tr(CX, 700), rect(-70, -10, 140, 40, '#3a3f4a', 10, 6) + path('M-50 -10Q-50 -100 0 -100Q50 -100 50 -10Z', on ? '#ff3b30' : '#a02020', 6) + (on ? op(.5, glow(0, -50, 160, '#ff3b30', .8)) : '')) +
      kword('PROBLÈME', CX, 470, t, Pb - .05, { size: 110, fill: '#fff' }); },
  sfx: [[0, 'zap', .4], [.05, 'siren', .5], [at(24, 'probleme') - .05, 'boom', .6], [at(24, 'probleme') + .1, 'sting', .5]] });

// B025 — « La ville n'a pas toujours pensé à toi. » : plan de la ville (card) où il manque… toi
B(25, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Vl = at(25, 'ville'), Ps = at(25, 'pense'), Ti = at(25, 'toi');
    const plan = rect(-260, -170, 520, 340, '#2f5fb8', 8, 0) + [-170, -60, 50, 160].map(x => line(x, -170, x, 170, 3, 'rgba(255,255,255,.5)')).join('') + [-100, 0, 100].map(y => line(-260, y, 260, y, 3, 'rgba(255,255,255,.5)')).join('') +
      [[-220, -150], [-20, -150], [90, -40], [-130, 20], [100, 120]].map(([x, y]) => rect(x, y, 80, 60, 'none', 2, 3, '#fff')).join('') + ftext(0, -190, 'PLAN DE LA VILLE', { size: 30, fill: '#fff' }) +
      ftext(-170, 70, '🚗', { size: 40, stroke: 'none' }) + ftext(60, -80, '🛴', { size: 40, stroke: 'none' }) + ftext(-60, 150, 'PIÉTONS : ???', { size: 26, fill: SX.acc2, stroke: 'none' });
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 3), haze: .12 },
      { z: 1, svg: heroP({ x: 250, y: 1490, s: 1.25, expr: 'confused', cane: 1, tap: 1 }, t) + avDog(120, 1560, .5, t) + adult(0, { x: 860, y: 1500, s: 1.05, expr: 'smug', shirt: '#ffb03a', flip: 1, armR: [-40, -70], holdR: G(tr(0, -20), rect(-14, -60, 28, 120, '#fff6a0', 4, 4)) }, t) }]) +
      card(600, 760, 560, 380, plan, t, Vl - .1, { ry: 0, thick: 10, r: 3, bw: 6 }) + markerCircle(540, 910, 110, 50, t, Ti, { col: SX.acc2 }) +
      funTag(CX, 450, "N'A PAS PENSÉ À TOI", t, Ps - .1, { size: 50, bg: SX.acc, fg: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(25, 'ville') - .1, 'printer', .4], [at(25, 'pense') - .1, 'pop', .6], [at(25, 'toi'), 'scratch', .5]] });

// B026 — « Un scooter sur le trottoir. » : la canne cogne le scooter garé en plein milieu — TONK
B(26, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), shake: t > at(26, 'trottoir') && t < at(26, 'trottoir') + .25 ? 7 : 0 }),
  draw: (t, d, T) => { const Sc = at(26, 'scooter'), Tr = at(26, 'trottoir'), hit = t > Tr;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2) + avTactile(-M, W + M, 1330), haze: .06 },
      { z: 1, svg: avScooter(760, 1420, 1.25, '#e2463a') + heroP({ x: 300, y: 1490, s: 1.3, expr: hit ? 'annoyed' : 'calm', cane: 1, tap: !hit, caneX: hit ? 30 : 0 }, t) + avDog(110, 1560, .5, t, { shock: hit }) + (hit ? impactStar(560, 1300, .6) : '') },
      { z: .6, svg: blur(10, dBush(1000, 1900, 1.6)) }]) +
      funTag(CX, 450, 'SCOOTER', t, Sc - .05, { size: 66, bg: SX.acc2, fg: SX.ink }) + markerText('…sur le trottoir', 700, 590, t, at(26, 'sur'), { size: 46 }) + (hit ? kword('TONK', 560, 760, t, Tr, { size: 110, fill: '#fff', r: -8 }) : ''); },
  sfx: [[at(26, 'un'), 'tick', .5], [at(26, 'scooter') - .05, 'pop', .6], [at(26, 'trottoir'), 'thud', .8], [at(26, 'trottoir') + .05, 'boing', .5]] });

// B027 — « Une voiture garée devant le passage. » : voiture en travers du passage piéton, conducteur qui mange tranquille
B(27, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Gr = at(27, 'garee'), Pa = at(27, 'passage');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2) + avZebra(CX, 1270, 7, 1), haze: .05 },
      { z: 1, svg: dCar(640, 1460, 2.0, '#5b8fd8', 1) + G(tr(560, 1000), head({ hr: 70, hair: 'bald', expr: 'chill', seed: 70 }, t) + G(tr(70, 40, 1, -20), path('M-30 0Q-40 -30 0 -36Q40 -30 30 0Z', '#e8a24a', 5))) + heroP({ x: 210, y: 1500, s: 1.25, expr: 'suspicious', cane: 1, caneX: 40 }, t) },
      { z: .6, svg: blur(10, dLampPost(1040, 1950, 1.6)) }]) +
      funTag(CX, 450, 'VOITURE GARÉE', t, at(27, 'voiture') - .05, { size: 56, bg: SX.acc, fg: '#fff' }) + stamp(640, 640, 'SUR LE PASSAGE', t, Pa - .05, '#e2463a', -8, 60); },
  sfx: [[at(27, 'voiture'), 'pop', .5], [at(27, 'garee'), 'chomp', .5], [at(27, 'passage') - .05, 'thud', .7], [at(27, 'passage') + .2, 'error_beep', .4]] });

// B028a — « Un site internet avec des boutons » : gros plan sur l'écran : boutons sans nom, images sans description
const O28 = at(28, 'impossibles') - .15;
B(28, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const St = at(28, 'site'), Bt = at(28, 'boutons');
    const site = rect(-190, -260, 380, 40, '#c7d4ee', 0, 0) + circ(-170, -240, 8, '#e2463a', 0) + circ(-146, -240, 8, '#ffd23f', 0) + rect(-170, -200, 160, 100, '#ffb03a', 6, 0) + ftext(-90, -140, 'IMG_4032', { size: 22, fill: '#fff', stroke: 'none' }) +
      [0, 1, 2].map(i => rect(10, -200 + i * 40, 160, 30, ['#3a5bff', '#36a85a', '#e2463a'][i], 15, 0) + ftext(90, -178 + i * 40, '', { size: 18 })).join('') + rect(-170, -80, 340, 40, '#9fb4d8', 8, 0);
    return bedroomN(t) + WASH() + avLaptop(CX, 1250, 1.6, site) + heroP({ x: 160, y: 1560, s: 1.1, expr: 'neutral' }, t) +
      (t > Bt ? [0, 1, 2].map(i => funTag(CX + 160 * 1.6, 1250 - 1.6 * (182 - i * 40) - 0, '???', t, Bt + i * .12, { size: 30, bg: '#fff', fg: SX.ink })).join('') : '') +
      funTag(CX, 420, 'SITE INTERNET', t, St - .05, { size: 60, bg: SX.acc2, fg: SX.ink }) + markerCircle(CX + 144, 950, 170, 110, t, Bt + .1, { col: SX.acc }); },
  sfx: [[0, 'typing', .4], [at(28, 'site') - .05, 'pop', .6], [at(28, 'boutons'), 'pop_hi', .4], [at(28, 'boutons') + .12, 'pop_hi', .4], [at(28, 'boutons') + .24, 'pop_hi', .4]] });
// B028b — « …impossibles à lire au lecteur d'écran » : la voix robot répète BOUTON BOUTON IMAGE, le héros blasé
B(28, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), shake: 2 }),
  draw: (t, d, T) => { const Im = at(28, 'impossibles') - O28, Lc = at(28, 'lecteur') - O28;
    const say = ['« BOUTON. »', '« BOUTON. »', '« IMAGE. »', '« BOUTON. »'];
    return bedroomN(t) + DIM(.25) + heroHead(300, 980, 190, { expr: 'deadpan' }, t) + avLaptop(780, 1220, .9, rect(-190, -260, 380, 240, '#eef4ff', 8, 0) + ftext(0, -130, '???', { size: 70, fill: '#e2463a', stroke: 'none' })) +
      say.map((s, i) => funTag(i % 2 ? 790 : 560, 640 + i * 90, s, t, .15 + i * .3, { size: 36, bg: i === 2 ? SX.cool : '#fff', fg: SX.ink, r: i % 2 ? 4 : -4 })).join('') +
      kword('IMPOSSIBLE', CX, 460, t, Im - .05, { size: 104, fill: SX.acc2 }) + cross(780, 1100, .5, t, Lc); },
  sfx: [[0, 'error_beep', .4], [.45, 'error_beep', .4], [.75, 'error_beep', .4], [at(28, 'impossibles') - O28 - .05, 'boom', .5], [at(28, 'lecteur') - O28, 'buzz', .4]] }, O28);

// B029a — « Le plus absurde, » : rayons, LE PLUS ABSURDE (concept)
const O29 = at(29, 'arrives') - .3;
B(29, { enter: 'none', trans: 'circle', transD: .22, cam: () => ({ z: 1.06, shake: 2 }),
  draw: (t, d, T) => rays(t, CX, 950, SX.acc2, '#ffe680', 22) + heroHead(CX, 990, 210, { expr: 'smug' }, t) + avWaves2(CX, 990, t, SX.acc, 260, 160) +
    kthin('le plus', CX, 410, t, at(29, 'plus') - .1, { size: 60, fill: SX.ink }) + kword('ABSURDE', CX, 540, t, at(29, 'absurde') - .05, { size: 120, fill: SX.acc }),
  sfx: [[0, 'flash_hit', .4], [at(29, 'plus'), 'pop_hi', .4], [at(29, 'absurde') - .05, 'boom', .6]] });
// B029b — « …tu arrives à résoudre des problèmes compliqués tout seul » : tableau plein d'équations, coche géante, TOUT SEUL
B(29, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Rs = at(29, 'resoudre') - O29, Cq = at(29, 'compliques') - O29, Sl = at(29, 'seul') - O29;
    const board = ftext(540, 520, '∑ x² + √π = ?', { size: 56, fill: 'rgba(255,255,255,.85)', stroke: 'none' }) + ftext(540, 620, '(a+b)³ ÷ 7i', { size: 50, fill: 'rgba(255,255,255,.7)', stroke: 'none' }) + (t > Cq ? ftext(540, 720, '= 42 ✓', { size: 60, fill: '#7be07b', stroke: 'none' }) : '');
    return classroomT(t, board) + kid(2, { x: 860, y: 1480, s: 1.05, expr: 'dizzy', face: { steamHead: 1 }, flip: 1 }, t) + kid(4, { x: 1010, y: 1480, s: 1.0, expr: 'jawdrop', flip: 1 }, t + 1) +
      heroP({ x: 330, y: 1490, s: 1.3, expr: 'proud', armR: [-50, -80], holdR: line(0, 0, 40, -60, 10, '#fff'), armL: [110, 100] }, t) + avDog(560, 1560, .5, t) +
      funTag(CX, 410, 'PROBLÈMES COMPLIQUÉS', t, Rs, { size: 46, bg: SX.acc, fg: '#fff' }) + (t > Sl ? kword('TOUT SEUL', 380, 820, t, Sl - .05, { size: 90, fill: SX.acc2, r: -5 }) + popStars(380, 820, t, Sl, 7, 200) : ''); },
  sfx: [[at(29, 'resoudre') - O29, 'pop', .5], [at(29, 'resoudre') - O29 + .2, 'scratch', .4], [at(29, 'compliques') - O29, 'ding', .5], [at(29, 'seul') - O29 - .05, 'tada', .6]] }, O29);

// B030 — « Et un inconnu se met à parler à la personne qui t'accompagne. » : resto, le serveur ne parle qu'à Kevin
B(30, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const In = at(30, 'inconnu'), Pr = at(30, 'personne');
    return restoT(t, { diners: false }) + heroP({ x: 250, y: 1440, s: 1.25, expr: 'happy' }, t) + kevin({ x: 560, y: 1440, s: 1.25, expr: 'neutral' }, t) + avTable(400, 1300, 760, t) +
      avWaiter({ x: 880, y: 1500, s: 1.15, expr: 'talk', flip: 1, armR: [-30, -60], holdR: G(tr(0, -10), rect(-50, -70, 100, 130, '#fff', 6, 5) + line(-30, -40, 30, -40, 4, '#9aa') + line(-30, -10, 30, -10, 4, '#9aa')) }, t) +
      avDog(130, 1600, .45, t) + funTag(880, 460, 'UN INCONNU', t, In - .1, { size: 54, bg: SX.acc2, fg: SX.ink }) + markerArrow(800, 760, 600, 900, t, at(30, 'parler'), { bend: 40, col: SX.acc }) +
      markerText("…à celui qui t'accompagne", CX, 640, t, Pr, { size: 42 }); },
  sfx: [[0, 'ding', .4], [at(30, 'inconnu') - .1, 'pop', .6], [at(30, 'parler'), 'scratch', .5], [at(30, 'accompagne'), 'hmm', .4]] });

// B031 — « Il veut boire quelque chose ? » : le serveur penché vers Kevin, Kevin gêné regarde le héros
B(31, { enter: 'whip', cam: (t, d) => ({ z: 1.08, hand: .4, r: 3 }),
  draw: (t, d, T) => restoT(t, { diners: false }) + heroP({ x: 250, y: 1440, s: 1.25, expr: 'deadpan' }, t) + kevin({ x: 560, y: 1440, s: 1.25, expr: 'embarrassed', look: [-1, 0] }, t) + avTable(400, 1300, 760, t) +
    avWaiter({ x: 900, y: 1500, s: 1.15, expr: 'talk', flip: 1, rot: -6, armR: [70, 80], armL: [200, 160] }, t) + chatBubble(620, 640, 680, 120, 'IL VEUT BOIRE QUELQUE CHOSE ?', t, at(31, 'veut') - .15, false, 34) +
    (t > at(31, 'chose') ? markerArrow(330, 840, 260, 990, t, at(31, 'chose'), { bend: -30, col: SX.acc2 }) + markerText('il ?', 360, 800, t, at(31, 'chose'), { size: 48 }) : ''),
  sfx: [[at(31, 'veut') - .15, 'pop', .6], [at(31, 'boire'), 'gulp', .4], [at(31, 'chose'), 'scratch', .4], [at(31, 'chose') + .2, 'crickets', .4]] });

// B032 — « Bonjour, je suis juste là. » : crash zoom, le héros salue, flèche géante ICI, serveur mâchoire au sol
B(32, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, eOutCubic(clamp(t / .4))), shake: t < .3 ? 5 : 0 }),
  draw: (t, d, T) => { const Bj = at(32, 'bonjour'), Js = at(32, 'juste');
    return restoT(t, { diners: false }) + WASH() + heroP({ x: 330, y: 1460, s: 1.35, expr: 'smug', armL: [-150 + Math.sin(t * 14) * 20, -120], armR: [70, 80] }, t) + avTable(500, 1320, 860, t) +
      avWaiter({ x: 860, y: 1500, s: 1.15, expr: t > Js ? 'jawdrop' : 'shock', flip: 1 }, t) + (t > Js ? sweat(920, 900, 1.2) : '') +
      funTag(330, 470, 'BONJOUR !', t, Bj - .05, { size: 60, bg: SX.acc, fg: '#fff' }) + kword('JUSTE LÀ.', CX + 60, 640, t, Js - .05, { size: 88, fill: SX.acc2, r: 3 }) +
      (t > Js ? G(tr(330, 830 + Math.sin(t * 10) * 12), path('M-40 -90L40 -90L40 -10L80 -10L0 60L-80 -10L-40 -10Z', SX.acc2, 7)) : ''); },
  sfx: [[0, 'flash_hit', .4], [at(32, 'bonjour') - .05, 'pop', .6], [at(32, 'juste') - .05, 'boom', .5], [at(32, 'la'), 'boing', .5], [at(32, 'la') + .1, 'gasp', .4]] });

// B033a — « Tu ne demandes pas qu'on te traite comme un héros, » : podium, cape, médaille, foule qui acclame… barré
const O33 = at(33, 'ni') - .1;
B(33, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Hr = at(33, 'heros');
    return streetT(t, 1) + WASH() + G(tr(CX, 1500), rect(-230, -170, 460, 170, '#ffd23f', 10, 7) + ftext(0, -60, '1', { size: 90, fill: '#fff' })) +
      G(tr(CX, 1330), path('M-80 -250Q-170 -100 -150 60L150 60Q170 -100 80 -250Z', '#e2463a', 7)) + heroP({ x: CX, y: 1330, s: 1.15, expr: 'embarrassed', armL: [200, 240], armR: [-20, -60], cane: 0 }, t) + G(tr(CX, 1130), line(-30, -60, 0, 0, 6, '#5b8fd8') + line(30, -60, 0, 0, 6, '#e2463a') + circ(0, 10, 26, '#ffd23f', 6)) +
      [0, 1, 2, 3].map(i => adult(i, { x: [100, 260, 820, 980][i], y: 1500, s: .95, expr: 'ecstatic', armL: [220, 260], armR: [-40, -80], flip: i > 1 }, t + i)).join('') + confetti(t, .1, 26) +
      kthin('on te traite comme un', CX, 410, t, at(33, 'traite') - .1, { size: 52 }) + kword('HÉROS', CX, 540, t, Hr - .05, { size: 110, fill: SX.acc2 }) + cross(CX, 540, .6, t, Hr + .25); },
  sfx: [[0, 'tada', .4], [at(33, 'demandes'), 'pop_hi', .4], [at(33, 'heros') - .05, 'boom', .5], [at(33, 'heros') + .25, 'error_beep', .5]] });
// B033b — « …ni comme un bébé. » : poussette géante, bavoir, un adulte « gouzi gouzi » — barré aussi
B(33, { enter: 'drop', cam: () => ({ z: 1.06, shake: 2, r: -3 }),
  draw: (t, d, T) => { const Bb = at(33, 'bebe') - O33;
    return streetT(t, 1) + WASH() + G(tr(560, 1380), circ(-170, 120, 60, '#2b2b33', 7) + circ(170, 120, 60, '#2b2b33', 7) + path('M-260 -100Q-260 80 0 80Q260 80 260 -100Z', '#ff8fb1', 7) + path('M-260 -100Q-200 -330 60 -320L60 -100Z', '#ff6fa0', 7) + line(260, -100, 360, -260, 12)) +
      heroHead(560, 1060, 130, { expr: 'deadpan' }, t) + G(tr(560, 1180), path('M-70 0Q0 60 70 0L60 70Q0 100 -60 70Z', '#fff', 5)) +
      adult(1, { x: 920, y: 1500, s: 1.05, expr: 'ecstatic', flip: 1, armR: [-20, -40] }, t) + chatBubble(820, 680, 300, 90, 'gouzi gouzi !', t, 0, false, 36) +
      kword('NI UN BÉBÉ', CX, 470, t, Bb - .25, { size: 80, fill: SX.acc2 }) + cross(CX, 470, .6, t, Bb + .2); },
  sfx: [[0, 'thud', .4], [.05, 'baby_coo', .4], [at(33, 'bebe') - O33 - .1, 'boom', .5], [at(33, 'bebe') - O33 + .2, 'error_beep', .5]] }, O33);

// B034 — « Tu demandes qu'on te parle normalement. » : le serveur parle enfin AU héros, tout le monde sourit
B(34, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Nm = at(34, 'normalement');
    return restoT(t, { diners: false }) + heroP({ x: 250, y: 1440, s: 1.25, expr: 'joy' }, t) + kevin({ x: 560, y: 1440, s: 1.25, expr: 'happy' }, t) + avTable(400, 1300, 760, t) +
      avWaiter({ x: 860, y: 1500, s: 1.15, expr: 'happy', flip: 1, armR: [-30, -60], holdR: G(tr(0, -10), rect(-50, -70, 100, 130, '#fff', 6, 5)) }, t) + chatBubble(640, 700, 360, 100, 'ET POUR VOUS ?', t, at(34, 'parle') - .1, false, 40) +
      kword('NORMALEMENT', CX, 470, t, Nm - .05, { size: 96, fill: SX.acc2 }) + (t > Nm ? heartsUp(t, 250, 1000, 4) + ftext(170, 860, '✓', { size: 110, fill: SX.cool }) : ''); },
  sfx: [[at(34, 'demandes'), 'pop_hi', .4], [at(34, 'parle') - .1, 'pop', .5], [at(34, 'normalement') - .05, 'tada', .6], [at(34, 'normalement') + .2, 'ding', .4]] });

// B035 — « Parce que ce qui t'empêche le plus souvent d'avancer, » : rue bouchée (scooters, voiture, poubelles, travaux)
B(35, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Em = at(35, 'empeche'), Av = at(35, 'avancer');
    const cone = x => G(tr(x, 1450), path('M-40 0L-10 -120L10 -120L40 0Z', '#ff8a3d', 6) + rect(-24, -80, 48, 16, '#fff', 4, 0) + rect(-50, -6, 100, 16, '#ff8a3d', 4, 5));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2) + avTactile(-M, W + M, 1330), haze: .06 },
      { z: 1, svg: dCar(820, 1420, 1.3, '#ffd23f') + avScooter(560, 1460, 1.0, '#5ec4f0') + dBin(980, 1480, .9, '#36a85a') + cone(420) + cone(680) + G(tr(560, 1300), rect(-160, -40, 320, 50, '#fff', 6, 6) + [0, 1, 2, 3].map(i => path(`M${-150 + i * 80} -40L${-110 + i * 80} -40L${-150 + i * 80 + 40} 10L${-150 + i * 80} 10Z`, '#e2463a', 0)).join('') + line(-140, 10, -140, 160, 10) + line(140, 10, 140, 160, 10)) +
        heroP({ x: 190, y: 1500, s: 1.25, expr: 'annoyed', cane: 1, caneX: 20 }, t) },
      { z: .6, svg: blur(10, dLampPost(1040, 1950, 1.6)) }]) +
      kthin("ce qui t'empêche le plus souvent", CX, 420, t, Em - .15, { size: 46 }) + funTag(CX, 560, "D'AVANCER", t, Av - .05, { size: 68, bg: SX.acc, fg: '#fff' }) + (t > Av ? markerArrow(250, 760, 760, 760, t, Av, { col: SX.acc2 }) + cross(820, 760, .5, t, Av + .3) : ''); },
  sfx: [[0, 'whoosh', .4], [at(35, 'empeche'), 'thud', .5], [at(35, 'avancer') - .05, 'pop', .6], [at(35, 'avancer') + .3, 'error_beep', .5]] });

// B036 — « ce n'est pas toujours le fait de ne pas voir. » : papier, le héros serein, carte NE PAS VOIR barrée (concept)
B(36, { enter: 'none', trans: 'circle', transD: .22, cam: zin(1.02, 1.08, .2),
  draw: (t, d, T) => { const Vr = at(36, 'voir');
    return paper('#e6ecff') + gobo(T, .1) + cutout(heroP({ x: 330, y: 1450, s: 1.3, expr: 'calm', cane: 1 }, t), 10) + cutout(avDog(760, 1450, .7, t), 10) +
      kthin("ce n'est pas toujours", CX, 420, t, at(36, 'toujours') - .2, { size: 56 }) + card(CX, 640, 600, 150, ftext(0, 22, 'NE PAS VOIR', { size: 72, fill: SX.ink, stroke: 'none' }), t, at(36, 'fait') - .1, { ry: 0, thick: 10, r: -3, bw: 6 }) + cross(CX, 640, .8, t, Vr + .05); },
  sfx: [[0, 'whoosh', .4], [at(36, 'toujours'), 'pop_hi', .4], [at(36, 'fait') - .1, 'pop', .5], [at(36, 'voir') + .05, 'scratch', .6]] });

// B037 — FIN : « C'est que le monde oublie que tu es là. » : la rue pressée (nez dans les téléphones) ; Kevin et le chien brandissent
//          la pancarte « IL EST LÀ ↓ » ; au mot « là » tout le monde se retourne et salue enfin le héros (étoiles)
B(37, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Mo = at(37, 'monde'), La = at(37, 'la'), seen = t > La;
    return streetT(t, 2) + WASH() + unlock(330, 780, t, La, { part: 'back', r: 380 }) +
      [0, 1, 2].map(i => adult(i + 1, { x: 500 + i * 140, y: 1480 + (i % 2) * 15, s: 1.0, expr: seen ? 'joy' : 'deadpan', look: seen ? [-1, 0] : [0, 1], flip: seen ? 1 : 0, armR: seen ? [-120, -150] : [-60, -100], holdR: seen ? '' : phone(0, -20, .45, -10) }, t + i)).join('') +
      heroP({ x: 300, y: 1490, s: 1.3, expr: seen ? 'joy' : 'calm', cane: 1, armL: seen ? [200, 230] : [110, 100] }, t) + avDog(120, 1560, .5, t) +
      kevin({ x: 960, y: 1490, s: 1.1, expr: 'angry', flip: 1, armR: [-80, -100], armL: [-100, -80] }, t) + G(tr(940, 880 + Math.sin(t * 8) * 10, 1, 6), rect(-130, -70, 260, 120, '#fff', 12, 7) + ftext(0, 10, 'IL EST LÀ ↓', { size: 34, fill: '#e2463a', stroke: 'none' }) + line(0, 50, 0, 140, 12, '#8a5a3a')) +
      unlock(330, 780, t, La, { part: 'front', r: 300 }) + (seen ? chatBubble(700, 760, 220, 90, 'SALUT !', t, La + .1, false, 40) : '') +
      kthin("c'est que le monde oublie", CX, 400, t, Mo - .2, { size: 54 }) + kword('QUE TU ES LÀ.', CX, 540, t, La - .3, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(37, 'monde'), 'pop_hi', .4], [at(37, 'oublie'), 'crickets', .4], [at(37, 'la') - .3, 'boom', .6], [at(37, 'la'), 'sparkle', .6], [at(37, 'la') + .2, 'tada', .5]] });

SCENES.sort((a, b) => a.s - b.s);
