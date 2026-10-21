// ============================================================
//  « Pourquoi c'est horrible d'être un garçon ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Sujet sociétal : on rit des clichés (« sois un homme », « fais pas le fragile ») et des situations absurdes, JAMAIS du héros.
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

// ---------- SIZEX fun : accent BLEU PÉTROLE (le « bleu garçon » cliché, en plus profond), jaune marqueur, vert menthe ----------
sxFun('#1478b4'); SX.acc2 = '#ffd23f'; SX.cool = '#5ee0a0';

// ============================================================
//  LE HÉROS : cheveux courts bruns, t-shirt MOUTARDE (fixes tout l'épisode) avec un CŒUR CADENASSÉ imprimé
//  (= les émotions verrouillées). Le cadenas s'ouvre à la toute fin (« oser le dire »).
//  o.lock : 'closed' (défaut) | 'open' ; o.heartC : couleur du cœur (statue = gris).
// ============================================================
const HERO_SHIRT = '#f5b82e', HERO_HAIR = '#3a2418';
const heroHair = (r, t, o) => hairSvg('short', o.hairColor || HERO_HAIR, r, t);
function gPadlock(open = 0, col = '#ffd23f') {
  const sh = open ? G(`translate(0 ${f1(-14 * open)}) rotate(${f1(-35 * open)} 14 -10)`, path('M-13 -8L-13 -22A13 13 0 0 1 13 -22L13 -8', 'none', 7)) : path('M-13 -8L-13 -22A13 13 0 0 1 13 -22L13 -8', 'none', 7);
  return sh + rect(-20, -10, 40, 32, col, 6, 5) + circ(0, 2, 5, OL, 0) + line(0, 4, 0, 13, 4); }
function heroP(o, t) {
  o = Object.assign({ age: 'kid', hairFn: heroHair, shirt: HERO_SHIRT, pants: '#3b3f4a', seed: 2, heartShirt: true }, o);
  let s = person(o, t); const i = s.indexOf('fill="#e2463a"');
  if (i > 0) { const j = s.indexOf('/>', i) + 2; s = s.slice(0, i) + `fill="${o.heartC || '#e2463a'}"` + s.slice(i + 14, j) + gPadlock(o.lock === 'open' ? 1 : 0, o.heartC ? '#c9c9c9' : '#ffd23f') + s.slice(j); }
  return s; }
// position de la tête d'un perso enfant (pour poser moustache, nez de clown, ampoule…)
const headAt = (o, t, seed = 2) => [o.x || 0, (o.y || 0) + (o.s || 1) * (-64 - 150 + (o.bob ?? 1) * wave(t, .8, 4, seed) - 78), 100 * (o.s || 1)];
// fausse moustache collée, nez de clown, pansement
const gStache = (x, y, r, rot = 0) => G(tr(x, y + r * .3, r / 100, rot), path('M-62 6Q-40 -26 0 -6Q40 -26 62 6Q40 30 0 10Q-40 30 -62 6Z', '#4a2a16', 5));
const gNose = (x, y, r, k = 1) => k <= 0 ? '' : G(tr(x, y + r * .12, r / 100 * k), circ(0, 0, 17, '#e2463a', 5) + circ(-5, -6, 5, 'rgba(255,255,255,.7)', 0));
const gPatch = (x, y, s = 1, r = 20) => G(tr(x, y, s, r), rect(-34, -13, 68, 26, '#f3c89a', 10, 4) + rect(-12, -11, 24, 22, '#e8b07e', 4, 0));
function heroHead(x, y, r, o, t) {
  return G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: heroHair, seed: 2 }, o), t) + (o.stache ? gStache(0, 0, r, o.stache === 2 ? 14 : 0) : '') + gNose(0, 0, r, o.nose || 0)); }
// ---------- le COACH du « sois un homme » : casquette pétrole, moustache, sifflet ----------
const coach = (o, t) => adult(4, Object.assign({ hair: 'bald', hairColor: '#7a6a5a', shirt: '#e2463a', pants: '#2f3b4e', mustache: true, cap: '#1478b4', glasses: false, skin: '#f0c49c', seed: 64 }, o), t);
const coachHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'bald', hairColor: '#7a6a5a', mustache: true, cap: '#1478b4', skin: '#f0c49c', seed: 64 }, o), t));
const gWhistle = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-30, -16, 60, 32, '#c9d3dc', 12, 5) + circ(-30, 0, 20, '#c9d3dc', 5) + rect(24, -10, 26, 20, '#c9d3dc', 4, 5));
// ---------- accessoires ----------
const gBook = (c = '#5b8fd8', r = 0) => G(tr(0, -20, 1, r), rect(-50, -36, 100, 72, c, 6, 5) + line(0, -36, 0, 36, 5) + line(-38, -16, -12, -16, 3, '#fff') + line(12, -16, 38, -16, 3, '#fff'));
const gPad = (c = '#2b2b33') => G(tr(0, -10), rect(-44, -22, 88, 44, c, 20, 5) + circ(-22, 0, 7, '#e2463a', 0) + circ(22, -6, 5, SX.acc2, 0) + circ(28, 6, 5, SX.cool, 0));
const gPigeon = (x, y, s = 1, t = 0) => G(tr(x, y + Math.abs(Math.sin(t * 6)) * -6, s), ell(0, 0, 46, 30, '#9aa3ad', 5) + path('M-40 -4L-70 -14L-62 10Z', '#7d848c', 4) + circ(34, -26, 20, '#9aa3ad', 5) + path('M52 -28L66 -22L52 -18Z', '#ffb03a', 3) + circ(38, -30, 4, OL, 0) + line(-6, 28, -6, 44, 4) + line(10, 28, 10, 44, 4));
const gBulb = (x, y, k, on = 1) => k <= 0 ? '' : G(tr(x, y, k), (on ? op(.5, glow(0, 0, 170, '#fff6a0', .8)) : '') + circ(0, 0, 66, on ? '#fff6a0' : '#e8e8e8', 7) + rect(-28, 56, 56, 44, '#9aa3ad', 8, 5) + path('M-16 10L-6 -14L6 10L16 -14', 'none', 5, '#ffb03a'));
const gThought = (x, y, s, inner) => G(tr(x, y, s), circ(-150, 170, 16, '#fff', 5) + circ(-120, 130, 24, '#fff', 5) + cloud(0, 0, 1.4, '#fff', 6) + inner);
const gRain = (x, y, t, w = 220) => { let s = cloud(x, y, 1.1, '#7d8a9c', 6); for (let i = 0; i < 8; i++) { const k = (t * 2.4 + i * .37) % 1; s += line(x - w / 2 + 20 + (i * 53) % w, y + 50 + k * 220, x - w / 2 + 14 + (i * 53) % w, y + 80 + k * 220, 6, '#8fd0ff'); } return s; };
const gBox = (x, yb, s = 1, t = 0) => G(tr(x, yb, s), rect(-190, -280, 380, 280, '#d9a86c', 6, 7) + path('M-190 -280L-240 -330L-60 -330L-20 -280M190 -280L240 -330L60 -330L20 -280', '#c8955a', 6) + rect(-30, -280, 60, 280, '#e8c08a', 0, 0) +
  G(tr(0, -110, 1, -6), rect(-170, -34, 340, 68, '#fff', 4, 5) + ftext(0, 18, 'FRAGILE', { size: 46, fill: '#e2463a', stroke: 'none' })) + G(tr(-120, -200), path('M-20 -30L20 -30L10 10L0 10L0 30L14 30L-14 30L0 30L0 10L-10 10Z', 'none', 5)));
// bureau du notaire (décor composé)
function officeBg(t) { const yb = 1250;
  let s = dWall('stripe', '#e9eef4', '#dde5ee', yb) + rect(-M, 940, W + 2 * M, yb - 940, '#7a5a3a', 0, 0) + line(-M, 940, W + M, 940, 6, '#5a3a26') + dBase(yb, '#5a3a26');
  s += dWindowView(650, 220, 340, 400, t) + dCurtain(590, 200, 100, 470, '#2f5f8a', t, 1) + dCurtain(950, 200, 100, 470, '#2f5f8a', t, -1);
  s += dShelf(40, 380, 460, dBooks(60, 380, 260, 8) + dTrophy(380, 380, .8) + dJar(450, 380, '#5b8fd8', .7)) + dShelf(40, 620, 460, dBooks(60, 620, 300, 9) + dGlobe(430, 620, .6, t));
  s += dFrame(270, 820, 160, 120, 'mount', '#c38a52', -2) + wallClock(540, 150, 52, t) + dFrame(80, 820, 90, 110, 'face', '#8a5a3a', 3) + dSwitch(1030, 900) + dOutlet(60, 1180);
  s += dPot(1010, 1250, .9, t, 0) + dLamp(560, 1250, .8, 1, t) + dParquet(yb, '#9a6a44') + dRug(CX, 1520, 860, 160, '#2f5f8a', '#ffd23f') + dBin(80, 1330, .7, '#7d848c') + dBox(990, 1420, .7, 'ARCHIVES');
  return s; }
// parc (décor composé) : ciel, immeubles au loin, arbres, bancs, réverbères, fleurs, oiseaux, figurants
function parkBg(t) { const yb = 1220;
  let s = SKY(t, '#9fd6ff', '#fff3d6') + op(.8, dSkyline(1080, '#c3d6e4', 6)) + dBirds(t, 3, 330, 2) + dHaze(.12);
  s += tree(120, yb, .85, t) + tree(980, yb, .95, t + 1) + dPine(330, yb, .7, t) + dPine(780, yb, .6, t) + dBush(560, yb, .9) + dBush(1060, yb, .7);
  s += rect(-M, yb, W + 2 * M, 1500, '#8fcf6a', 0, 0) + line(-M, yb, W + M, yb, 6, '#6fae4c') + path(`M${CX - 140} ${yb}L${CX + 140} ${yb}L${CX + 420} 2000L${CX - 420} 2000Z`, '#e8d6b0', 0);
  s += dLampPost(60, 1300, 1) + dLampPost(1020, 1300, 1) + dBench(230, 1290, .8) + dBench(860, 1290, .8) + dFlowers(700, 1300, 6, 4, t) + dFlowers(160, 1330, 5, 7, t) + dBin(400, 1310, .6, '#36a85a') + kidsBg(t, 1200, 3, .35);
  return s; }
const DIM = (k = .3) => op(k, rect(-M, -M, W + 2 * M, H + 2 * M, '#141838', 0, 0));

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001 — SIGNATURE : grille encre, héros (cœur cadenassé) qui gonfle les biceps, titre 3 lignes, « débloqué » en étoiles sur GARÇON
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'garcon');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.25, expr: t > K ? 'jawdrop' : 'proud', armL: [200, -100 + Math.sin(t * 8) * 8], armR: [-20, -80 - Math.sin(t * 8) * 8] }, t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1060, 330, 330, t, K + .15, { label: 'garcon.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'ÊTRE", CX, 415, t, .3, { size: 58 }) +
      kword('UN GARÇON ?', CX, 540, t, K - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'garcon') - .05, 'boom', .6], [at(1, 'garcon'), 'sparkle', .5]] });

// B002a — « Tu as 7 ans, tu tombes à vélo, » : papier + gobo, le héros file à vélo… caillou… vol plané
const O2 = at(2, 'ouvres') - .15;
B(2, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Tb = at(2, 'tombes'), k = seg(t, Tb, Tb + .55), bx = lerp(260, 600, eOutCubic(seg(t, 0, Tb)));
    const ride = t < Tb ? G(tr(bx, 1200), dBike(0, 0, 1.6, '#e2463a') + G(tr(-10, -60), cutout(heroP({ x: 0, y: 0, s: 1.05, expr: 'joy', legL: [60, 120], legR: [120, 60], armL: [-30, 10], armR: [-20, 10] }, t), 8))) :
      G(tr(600, 1200, 1, 25 * eOutCubic(seg(t, Tb, Tb + .2))), dBike(0, 0, 1.6, '#e2463a')) + G(tr(600 + 300 * k, 1200 - 60 - 380 * Math.sin(k * Math.PI * .8) + 160 * k, 1, k * 300), cutout(heroP({ x: 0, y: 0, s: 1.05, expr: 'terror', armL: [200, 240], armR: [-20, -60] }, t), 8));
    return paper(SX.paper) + gobo(T, .12) + rect(-M, 1205, W + 2 * M, 900, '#bfe39a', 0, 7) + G(tr(700, 1210), path('M-60 0Q-50 -60 0 -64Q50 -60 60 0Z', '#9aa3ad', 6)) +
      (t > Tb ? impactStar(700, 1140, .6 * (1 - seg(t, Tb + .3, Tb + .6))) : '') + ride + (t < Tb ? motionLines(bx - 230, 1060, 3, 90, 0) : '') +
      funTag(CX, 470, '7 ANS', t, at(2, '7') - .1, { size: 96, bg: SX.acc2, fg: SX.ink }) + kthin('tu tombes à vélo', CX, 610, t, Tb - .1, { size: 54 }); },
  sfx: [[0, 'whoosh', .4], [at(2, '7') - .1, 'pop', .6], [.3, 'squeak', .3], [at(2, 'tombes'), 'crack', .5], [at(2, 'tombes') + .1, 'whoosh_up', .5]] });
// B002b — « …tu t'ouvres le genou, tu pleures. » : le héros assis dans l'herbe, genou éraflé, fontaine de larmes
B(2, { enter: 'drop', cam: (t, d) => ({ z: 1.06, shake: t < .25 ? 6 : 0 }),
  draw: (t, d, T) => { const Gn = at(2, 'genou') - O2, Pl = at(2, 'pleures') - O2;
    return paper(SX.paper) + gobo(T, .1) + halftoneFade(SX.acc, .08, 1) + rect(-M, 1205, W + 2 * M, 900, '#bfe39a', 0, 7) + dFlowers(80, 1210, 4, 3, t) + dFlowers(880, 1210, 5, 6, t) +
      cutout(heroP({ x: CX - 60, y: 1283, s: 1.3, expr: t > Pl ? 'sob' : 'shock', legL: [-10, 10], legR: [10, 20], armL: [130, 160], armR: [40, 20] }, t), 10) +
      G(tr(CX + 30, 1190), path('M-24 -8l16 10M-14 -14l18 12M-4 -16l14 10', 'none', 6, '#e2463a')) + (t > Gn ? impactStar(CX + 30, 1160, .45 + .05 * Math.sin(t * 20)) : '') +
      markerCircle(CX + 30, 1180, 90, 60, t, Gn, { col: SX.acc }) + markerText('le genou !', 820, 1010, t, Gn + .05, { size: 52 }) +
      funTag(CX, 470, 'TU PLEURES', t, Pl - .05, { size: 66, bg: SX.acc, fg: '#fff' }); },
  sfx: [[0, 'thud', .7], [at(2, 'genou') - O2, 'scratch', .5], [at(2, 'pleures') - O2 - .05, 'pop', .6], [at(2, 'pleures') - O2, 'gasp', .5]] }, O2);

// B003 — « Un adulte s'approche. » : rue, contre-plongée, le COACH entre dans le champ, son ombre couvre le héros
B(3, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .3, cy: 1300 }),
  draw: (t, d, T) => { const Ad = at(3, 'adulte'), k = eOutCubic(seg(t, 0, .8)), cx = lerp(1120, 780, k);
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: heroP({ x: 280, y: 1360, s: 1.1, expr: 'cry', legL: [-10, 10], legR: [10, 20], armL: [130, 160], armR: [40, 20] }, t) + gPatch(330, 1290, .8) +
        op(.25 * k, ell(lerp(700, 420, k), 1380, 320, 50, '#141838', 0)) + G(tr(0, Math.abs(Math.sin(t * 9)) * -10), coach({ x: cx, y: 1560, s: 1.5, expr: 'neutral', flip: 1, armR: [60, 80], armL: [110, 100] }, t)) },
      { z: .6, svg: blur(10, dBush(60, 1900, 1.6)) }]) +
      funTag(CX, 450, 'UN ADULTE', t, Ad - .05, { size: 66, bg: SX.acc2, fg: SX.ink }) + markerText("s'approche…", 780, 590, t, at(3, 'approche'), { size: 48 }); },
  sfx: [[0, 'steps', .5], [at(3, 'adulte') - .05, 'pop', .6], [at(3, 'approche'), 'scratch', .4], [.5, 'thud', .4]] });

// B004 — « Allez, sois un homme. » : crash zoom sur le coach, coup de sifflet, SOIS UN HOMME
B(4, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, eOutCubic(clamp(t / .4))), shake: t > at(4, 'homme') ? 5 : 1 }),
  draw: (t, d, T) => { const Hm = at(4, 'homme');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2), haze: .35 }, { z: 1, svg: coachHead(CX, 1000, 210, { expr: t > Hm ? 'angry' : 'talk' }, t) + gWhistle(CX + 200, 1110, 1.1, -20) + (t < Hm ? speedLines(t, CX + 280, 1110, 10) : '') }]) +
      funTag(300, 450, 'ALLEZ,', t, at(4, 'allez') - .1, { size: 56, bg: '#fff', fg: SX.ink, r: -6 }) + kword('SOIS UN HOMME !', CX, 590, t, Hm - .1, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(4, 'allez') - .1, 'whistle', .5], [at(4, 'sois'), 'pop_hi', .4], [at(4, 'homme') - .1, 'boom', .6]] });

// B005a — « Pardon ? » : gros plan sur le héros… qui a maintenant une fausse moustache collée sur la figure
const O5 = at(5, 'j') - .12;
B(5, { enter: 'whip', cam: () => ({ z: 1.08, hand: .4, r: -4 }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2), haze: .35 }, { z: 1, svg: heroHead(CX, 990, 220, { expr: 'confused', stache: 1, tilt: -8 }, t) + qmark(820, 760, .7, SX.acc2, 12) }]) +
    kword('PARDON ?', CX, 520, t, at(5, 'pardon') - .1, { size: 110, fill: '#fff' }) + markerArrow(300, 760, 470, 1020, t, .1, { bend: -40, col: SX.acc2 }) + markerText('moustache', 260, 700, t, .1, { size: 44 }),
  sfx: [[0, 'boing', .6], [at(5, 'pardon') - .1, 'pop', .6], [.15, 'scratch', .4], [.3, 'hmm', .4]] });
// B005b — « J'ai 7 ans et je viens de perdre la moitié de mon genou. » : rue, camembert GENOU 50 %
B(5, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Sv = at(5, '7') - O5, Mt = at(5, 'moitie') - O5, Gn = at(5, 'genou') - O5;
    const pk = seg(t, Mt, Mt + .35), pie = circ(0, 0, 110, '#f2c9a0', 7) + (pk > 0 ? path(`M0 0L0 -110A110 110 0 ${pk > .99 ? 1 : 0} 1 ${f1(Math.sin(pk * Math.PI) * 110)} ${f1(-Math.cos(pk * Math.PI) * 110)}Z`, SX.acc, 6) : '') + ftext(0, 170, 'GENOU', { size: 40, fill: SX.ink, stroke: 'none' });
    return streetT(t, 2) + WASH() + heroP({ x: 300, y: 1410, s: 1.25, expr: 'cry', legL: [-10, 10], legR: [10, 20], armL: [200, 240], armR: [40, 20] }, t) + gStache(...headAt({ x: 300, y: 1410, s: 1.25 }, t), 18) + gPatch(360, 1330, .9) +
      card(770, 860, 420, 440, pie, t, Mt - .2, { ry: 0, thick: 10, r: 4, bw: 6 }) + (t > Mt + .3 ? kword('-50 %', 770, 880, t, Mt + .3, { size: 76, fill: '#fff', r: -6 }) : '') +
      funTag(300, 470, "J'AI 7 ANS", t, Sv - .1, { size: 58, bg: SX.acc2, fg: SX.ink, r: -5 }) + kthin('la moitié de mon genou', 640, 600, t, Mt - .1, { size: 48 }) + (t > Gn ? popStars(770, 860, t, Gn, 6, 220) : ''); },
  sfx: [[at(5, '7') - O5 - .1, 'pop', .6], [at(5, 'perdre') - O5, 'whoosh', .4], [at(5, 'moitie') - O5 - .2, 'pop_hi', .5], [at(5, 'moitie') - O5 + .3, 'boom', .5], [at(5, 'genou') - O5, 'error_beep', .4]] }, O5);

// B006 — « Bienvenue dans la vie d'un garçon. » : porte « VIE DE GARÇON », paillasson BIENVENUE, débloqué en étoiles
B(6, { enter: 'none', trans: 'circle', transD: .25, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const Gc = at(6, 'garcon');
    return paper('#e3eef7') + gobo(T, .1) + unlock(CX, 980, t, Gc, { part: 'back', r: 470 }) +
      G(tr(CX, 1250), rect(-230, -640, 460, 640, '#c8955a', 10, 7) + rect(-200, -610, 400, 590, '#b5835a', 6, 5) + circ(160, -300, 18, '#ffd23f', 5) +
        G(tr(0, -560, 1, -3), rect(-170, -40, 340, 80, '#fff', 10, 6) + ftext(0, 14, 'VIE DE GARÇON', { size: 36, fill: SX.acc, stroke: 'none' })) + rect(-330, 0, 660, 90, '#c58e55', 30, 7) + ftext(0, 62, 'BIENVENUE', { size: 54, fill: '#7a4a2a', stroke: 'none' })) +
      cutout(heroP({ x: CX - 40, y: 1450, s: 1.3, expr: t > Gc ? 'jawdrop' : 'worried', armL: [130, 150], armR: [50, 30] }, t), 12) + gPatch(CX + 10, 1385, .9) +
      unlock(CX, 980, t, Gc, { part: 'front', r: 470 }) + kthin('bienvenue dans la vie', CX, 400, t, at(6, 'bienvenue') - .1, { size: 54 }) + kword("D'UN GARÇON", CX, 520, t, Gc - .05, { size: 88, fill: SX.acc2 }); },
  sfx: [[0, 'magic', .5], [at(6, 'bienvenue'), 'pop_hi', .4], [at(6, 'garcon') - .05, 'tada', .6], [at(6, 'garcon'), 'sparkle', .5]] });

// B007 — « À 10 ans, tu as peur du noir. » : chambre de nuit, le héros caché sous la couette, deux yeux dans l'armoire
B(7, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .4 }),
  draw: (t, d, T) => { const Nr = at(7, 'noir'), bl = Math.sin(t * 5) > .9;
    return bedroomN(t) + DIM(.35) + G(tr(200, 760), rect(-130, -260, 260, 470, '#3a2a5a', 10, 7) + line(0, -250, 0, 200, 5) + op(t > .3 ? 1 : 0, (bl ? '' : ell(-40, -40, 16, 10, '#fff36a', 0) + ell(40, -40, 16, 10, '#fff36a', 0)))) +
      heroHead(640, 1010, 150, { expr: t > Nr ? 'terror' : 'chatter', look: [-1, 0] }, t) + G(tr(640, 1150), path('M-330 -60Q0 -130 330 -60L360 120L-360 120Z', '#5ec4f0', 7) + path('M-280 -40Q0 -100 280 -40', 'none', 5, '#3a9ac0')) + rect(-M, 1240, W + 2 * M, 900, '#3a3050', 0, 0) +
      funTag(CX, 450, '10 ANS', t, at(7, '10') - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + kword('PEUR DU NOIR', CX, 600, t, Nr - .05, { size: 84, fill: '#fff' }); },
  sfx: [[0, 'crickets', .4], [at(7, '10') - .1, 'pop', .6], [at(7, 'peur'), 'heartbeat', .6], [at(7, 'noir') - .05, 'boom', .5], [.4, 'ghost', .3]] });

// B008 — « T'es une mauviette ou quoi ? » : la lumière s'allume, un grand cousin se moque depuis la porte, tampon MAUVIETTE ?
B(8, { enter: 'none', trans: 'push', transD: .2, cam: camHand(1.06, .4),
  draw: (t, d, T) => { const Mv = at(8, 'mauviette');
    return bedroomN(t) + op(.4, path('M-100 -100L380 -100L900 1900L-100 1900Z', '#fff6c8', 0)) + G(tr(220, 1250), rect(-170, -760, 340, 760, '#fff6c8', 4, 7)) +
      adult(1, { x: 220, y: 1500, s: 1.25, expr: 'mock', hair: 'short', hairColor: '#1f1a18', shirt: '#36a85a', armR: [-40, -120], armL: [200, 160] }, t) +
      heroHead(720, 1020, 150, { expr: 'embarrassed', look: [-1, 0] }, t) + G(tr(720, 1150), path('M-330 -60Q0 -130 330 -60L360 120L-360 120Z', '#5ec4f0', 7)) + rect(-M, 1240, W + 2 * M, 900, '#3a3050', 0, 0) +
      stamp(640, 560, 'MAUVIETTE ?', t, Mv - .05, SX.acc, -8, 76) + (t > Mv ? sweat(880, 900, 1.1) : ''); },
  sfx: [[0, 'tick', .5], [.05, 'flash_hit', .3], [at(8, 'mauviette') - .05, 'thud', .7], [at(8, 'quoi'), 'boing', .5]] });

// B009 — « À 13 ans, tu n'aimes pas le foot. » : cour d'école, le héros lit sur un banc, le ballon le frôle — croix sur FOOT
B(9, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ft = at(9, 'foot'), bk = seg(t, .3, Ft + .2);
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: schoolyard(t), haze: .06 },
      { z: 1, svg: dBench(330, 1500, 1.4) + heroP({ x: 330, y: 1500, s: 1.3, expr: t > Ft ? 'annoyed' : 'happy', armL: [60, -60], armR: [120, -120], holdR: '' }, t) + G(tr(330, 1270), gBook('#8a6ad8')) +
        dBall(lerp(1150, 600, bk), lerp(700, 900, bk) - Math.sin(bk * Math.PI) * 200 + 40, 1.3, t * 3) + (bk > 0 && bk < 1 ? motionLines(lerp(1150, 600, bk) + 110, lerp(700, 900, bk) - 120, 3, 70, 0, '#fff') : '') },
      { z: .6, svg: blur(10, dBag(990, 1880, 1.4, '#ff8fb1', -10)) }]) +
      funTag(CX, 450, '13 ANS', t, at(9, '13') - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + kword('LE FOOT', 760, 620, t, Ft - .05, { size: 90, fill: '#fff', r: 5 }) + cross(760, 620, .7, t, Ft + .2); },
  sfx: [[0, 'whistle', .3], [at(9, '13') - .1, 'pop', .6], [.3, 'whoosh', .4], [at(9, 'foot') - .05, 'pop_hi', .4], [at(9, 'foot') + .2, 'error_beep', .5]] });

// B010a — « Kevin te regarde comme si tu venais… » : Kevin (ballon sous le bras), les yeux qui sortent de la tête
const O10 = at(10, 'trahir') - .15;
B(10, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, eOutCubic(clamp(t / .4))), shake: t > at(10, 'regarde') ? 3 : 0 }),
  draw: (t, d, T) => { const Rg = at(10, 'regarde');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: schoolyard(t), haze: .35 }, { z: 1, svg: kevinHead(CX, 1000, 210, { expr: t > Rg ? 'jawdrop' : 'suspicious' }, t) + dBall(860, 1250, 1.6, 0) }]) +
      funTag(CX, 450, 'KEVIN TE REGARDE', t, at(10, 'kevin') - .1, { size: 58, bg: '#5fb85f', fg: '#fff' }) + kthin('comme si tu venais…', CX, 600, t, at(10, 'comme') - .1, { size: 52 }) + (t > Rg ? emark(820, 820, .7) : ''); },
  sfx: [[0, 'flash_hit', .4], [at(10, 'kevin') - .1, 'pop', .6], [at(10, 'regarde'), 'gasp', .6], [at(10, 'regarde') + .1, 'boing', .5]] });
// B010b — « …de trahir toute la civilisation. » : rayons rouges, les grands ancêtres (homme des cavernes, Romain, Viking) choqués
B(10, { enter: 'none', trans: 'glitch', transD: .2, cam: () => ({ z: 1.06, shake: 3 }),
  draw: (t, d, T) => { const Th = at(10, 'trahir') - O10, Cv = at(10, 'civilisation') - O10;
    const anc = [{ hair: 'curly', hairColor: '#5a3a26', beard: 1 }, { hair: 'short', hairColor: '#1f1a18' }, { hair: 'long', hairColor: '#e0a040', beard: 1 }];
    const extra = [line(80, 40, 140, -90, 16, '#8a5a3a') + circ(140, -100, 26, '#8a5a3a', 6), path('M-100 -60Q0 -150 100 -60', 'none', 16, '#36a85a'), path('M-80 -70Q0 -140 80 -70Z', '#9aa3ad', 6) + path('M-80 -80Q-130 -110 -120 -170M80 -80Q130 -110 120 -170', 'none', 14, '#f4f1ea')];
    return rays(t, CX, 950, '#ff6b6b', '#d93a3a', 22) + anc.map((a, i) => card(220 + i * 320, 820, 270, 300, head(Object.assign({ hr: 90, expr: t > Cv ? 'jawdrop' : 'shock', seed: 80 + i }, a), t) + extra[i] +
        G(tr(0, 130), ftext(0, 0, ['AN -30 000', 'AN 52', 'AN 900'][i], { size: 26, fill: SX.ink, stroke: 'none' })), t, .05 + i * .12, { ry: 0, thick: 10, r: [-4, 2, 4][i], bw: 6 })).join('') +
      G(tr(CX, 1520), cutout(heroP({ x: 0, y: 0, s: 1.15, expr: 'embarrassed', armL: [130, 150], armR: [50, 30] }, t), 10)) +
      kthin('de trahir toute la', CX, 410, t, Th - .1, { size: 56 }) + kword('CIVILISATION', CX, 530, t, Cv - .05, { size: 96, fill: '#fff' }) + stamp(CX, 1010, 'TRAHISON', t, Th + .1, SX.ink, -6, 54); },
  sfx: [[0, 'zap', .4], [at(10, 'trahir') - O10 + .1, 'thud', .7], [.05, 'pop_hi', .3], [.29, 'pop_hi', .3], [at(10, 'civilisation') - O10 - .05, 'sting', .6]] }, O10);

// B011 — « Mais t'es quel genre de mec ? » : Kevin (ballon) pointe le héros (livre), cadre « genre ??? »
B(11, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.03, 1.09, t / d), hand: .4, r: -2 }),
  draw: (t, d, T) => { const Mc = at(11, 'mec'), Gr = at(11, 'genre');
    return schoolyard(t) + WASH() + heroP({ x: 290, y: 1500, s: 1.35, expr: 'confused', armL: [60, -60], armR: [120, -120] }, t) + G(tr(290, 1280), gBook('#8a6ad8')) +
      kevin({ x: 790, y: 1500, s: 1.35, expr: 'suspicious', flip: 1, armR: [-10, -5], armL: [100, 60], holdL: dBall(0, 40, .9, 0) }, t) +
      funBox(290, 1000, 330, 340, t, Gr, { label: 'genre ???', col: SX.acc }) + kthin("mais t'es quel genre", CX, 420, t, at(11, 'mais') - .1, { size: 54 }) + kword('DE MEC ?!', CX, 560, t, Mc - .05, { size: 86, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(11, 'mais'), 'hmm', .4], [at(11, 'genre'), 'pop_hi', .5], [at(11, 'mec') - .05, 'boom', .5]] });

// B012a — « Un mec qui n'aime pas… » : le héros, posé, explique (doigt levé)
const O12 = at(12, 'courir') - .15;
B(12, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d) }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: schoolyard(t), haze: .3 }, { z: 1, svg: heroHead(CX, 990, 220, { expr: 'smug' }, t) + G(tr(860, 1130, 1, -10), circ(0, 0, 50, SKIN, 6) + rect(-12, -120, 26, 100, SKIN, 13, 6)) }]) +
    funTag(CX, 470, "UN MEC QUI N'AIME PAS…", t, at(12, 'qui') - .25, { size: 50, bg: SX.acc, fg: '#fff' }),
  sfx: [[0, 'whoosh', .4], [at(12, 'qui') - .25, 'pop', .6], [at(12, 'aime'), 'tick', .4]] });
// B012b — « …courir derrière un ballon, Kevin. » : la meute (Kevin dedans) court après le ballon comme des chiots — Kevin se fige
B(12, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .5 }),
  draw: (t, d, T) => { const Kv = at(12, 'kevin') - O12, Bl = at(12, 'ballon') - O12, kvx = t > Kv ? lerp(560, 600, seg(t, Kv, Kv + .3)) : 1100 - t * 600;
    let pack = ''; for (let i = 0; i < 3; i++) { const x = 1250 - t * 650 + i * 190; pack += kid([0, 1, 4][i], { x, y: 1430 + (i % 2) * 20, s: .9, expr: 'starving', rot: -10, armL: [160, 190], armR: [-160, -190], legL: [70 + Math.sin(t * 25 + i) * 30, 100], legR: [110 - Math.sin(t * 25 + i) * 30, 80] }, t + i); }
    return schoolyard(t) + WASH() + dBall(1000 - t * 650, 1520, 1.0, -t * 4) + pack +
      kevin({ x: kvx, y: 1480, s: 1.1, expr: t > Kv ? 'jawdrop' : 'starving', rot: t > Kv ? 0 : -10, legL: t > Kv ? [95, 90] : [70 + Math.sin(t * 25) * 30, 100], legR: t > Kv ? [85, 90] : [110 - Math.sin(t * 25) * 30, 80] }, t) +
      motionLines(1180, 1150, 4, 110, 0, '#fff') + heroP({ x: 180, y: 1500, s: 1.15, expr: 'chill', armL: [60, -60], armR: [120, -120] }, t) + G(tr(180, 1300), gBook('#8a6ad8')) +
      kword('DERRIÈRE UN BALLON', CX, 470, t, Bl - .25, { size: 70, fill: SX.acc2 }) + (t > Kv ? funTag(600, 720, 'KEVIN.', t, Kv, { size: 60, bg: '#5fb85f', fg: '#fff', r: 6 }) : ''); },
  sfx: [[0, 'steps', .6], [at(12, 'courir') - O12, 'whoosh', .5], [at(12, 'ballon') - O12 - .25, 'boom', .5], [at(12, 'kevin') - O12, 'scratch', .6], [at(12, 'kevin') - O12 + .05, 'boing', .5]] }, O12);

// B013 — « À 15 ans, tu aimes quelqu'un. » : couloir, yeux en cœur, le cœur cadenassé du t-shirt bat à tout rompre
B(13, { enter: 'none', trans: 'circle', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Qu = at(13, 'quelqu'), bt = 1 + .25 * Math.max(0, Math.sin(t * 14));
    return hallway(t) + WASH() + heroP({ x: 330, y: 1500, s: 1.35, expr: 'love', armL: [140, 120], armR: [40, 60] }, t) + heartsUp(t, 330, 900, 5) +
      G(tr(770, 900, bt), heart(0, 0, 2.4, '#e2463a') + G(tr(0, -8, 2.2), gPadlock(0))) + (t > Qu ? popStars(770, 900, t, Qu, 7, 200, ['#ff8fb1', '#fff', SX.acc2]) : '') +
      funTag(CX, 450, '15 ANS', t, at(13, '15') - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + kword("TU AIMES QUELQU'UN", CX, 600, t, Qu - .2, { size: 70, fill: '#fff' }); },
  sfx: [[0, 'school_bell', .3], [at(13, '15') - .1, 'pop', .6], [at(13, 'aimes'), 'heartbeat', .6], [at(13, 'quelqu') - .2, 'boom', .4], [at(13, 'quelqu'), 'sparkle', .5]] });

// B014 — « Tu voudrais en parler. » : le héros se lance, petite bulle timide avec un cœur
B(14, { enter: 'whip', cam: camHand(1.06, .4),
  draw: (t, d, T) => schoolyard(t) + WASH() + heroP({ x: 300, y: 1500, s: 1.35, expr: 'embarrassed', armL: [200, 250], armR: [60, 80] }, t) +
    chatBubble(440, 760, 360, 110, 'EUH… LES GARS ?', t, .05, true, 40) + G(tr(640, 690, pop(t, .25)), heart(0, 0, .6, '#e2463a')) + funTag(CX, 470, 'EN PARLER', t, at(14, 'parler') - .25, { size: 66, bg: SX.acc, fg: '#fff' }),
  sfx: [[.05, 'pop', .6], [.25, 'pop_hi', .4], [at(14, 'parler') - .25, 'tick', .4]] });

// B015 — « Tes potes répondent. » : trois potes sur le banc tournent la tête en même temps (synchro parfaite)
B(15, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), shake: t > .3 && t < .45 ? 4 : 0 }),
  draw: (t, d, T) => { const lk = t > .3 ? [-1, 0] : [0, -1];
    return schoolyard(t) + WASH() + dBench(560, 1500, 1.6) + kid(0, { x: 330, y: 1500, s: 1.25, expr: 'suspicious', look: lk, flip: t > .3 }, t) + kevin({ x: 560, y: 1500, s: 1.25, expr: 'suspicious', look: lk, flip: t > .3 }, t) + kid(4, { x: 790, y: 1500, s: 1.25, expr: 'suspicious', look: lk, flip: t > .3 }, t + 1) +
      (t > .3 ? motionLines(330, 1000, 3, 60, 0) + motionLines(560, 1000, 3, 60, 0) + motionLines(790, 1000, 3, 60, 0) : '') + funTag(CX, 470, 'TES POTES', t, at(15, 'potes') - .1, { size: 72, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[at(15, 'potes') - .1, 'pop', .6], [.3, 'whoosh', .5], [.32, 'squeak', .4], [at(15, 'repondent'), 'hmm', .4]] });

// B016 — « Frère, fais pas le fragile. » : un carton FRAGILE tombe sur le héros (seule la tête dépasse), Kevin fait les muscles
B(16, { enter: 'drop', flash: 1, cam: (t, d) => ({ z: 1.06, shake: t > at(16, 'fragile') && t < at(16, 'fragile') + .25 ? 7 : 0 }),
  draw: (t, d, T) => { const Fr = at(16, 'fragile'), k = eOutCubic(seg(t, Fr - .25, Fr));
    return schoolyard(t) + WASH() + kevin({ x: 790, y: 1500, s: 1.35, expr: 'smugger', flip: 1, armL: [200, -100], armR: [-20, -80] }, t) +
      heroHead(320, 960, 135, { expr: t > Fr ? 'embarrassed' : 'shock' }, t) + G(tr(320, lerp(-200, 1560, k)), gBox(0, 0, 1.15, t)) + (t > Fr ? impactStar(320, 1200, .6 * (1 - seg(t, Fr + .2, Fr + .5))) : '') +
      kthin('frère, fais pas le', CX, 430, t, at(16, 'frere') - .1, { size: 56 }) + stamp(CX, 590, 'FRAGILE', t, Fr - .05, '#e2463a', -6, 90); },
  sfx: [[at(16, 'frere'), 'pop_hi', .4], [at(16, 'fragile') - .25, 'whoosh', .5], [at(16, 'fragile'), 'thud', .8], [at(16, 'fragile') + .1, 'boing', .4]] });

// B017a — « Alors tu rigoles, » : le héros (dans le carton) rit trop fort, HA HA HA, goutte de sueur
const O17 = at(17, 'fais') - .15;
B(17, { enter: 'none', trans: 'wipe', transD: .2, cam: camHand(1.06, .5),
  draw: (t, d, T) => { const Rg = at(17, 'rigoles');
    return schoolyard(t) + WASH() + kevin({ x: 800, y: 1500, s: 1.3, expr: 'laugh', flip: 1 }, t) + kid(5, { x: 1010, y: 1500, s: 1.2, expr: 'laugh', flip: 1 }, t) +
      heroP({ x: 330, y: 1500 + Math.abs(Math.sin(t * 16)) * -10, s: 1.35, expr: 'laugh', face: { sweat: 1 }, armL: [200, 240], armR: [-20, -60] }, t) +
      ['HA', 'HA', 'HA !'].map((w, i) => funTag(220 + i * 230, 760 - i * 60, w, t, Rg + i * .12, { size: 58, bg: ['#fff', SX.acc2, SX.cool][i], fg: SX.ink, r: [-8, 5, -4][i] })).join('') +
      kword('TU RIGOLES', CX, 480, t, Rg - .1, { size: 90, fill: SX.acc2 }); },
  sfx: [[at(17, 'alors'), 'pop_hi', .4], [at(17, 'rigoles') - .1, 'boom', .4], [at(17, 'rigoles'), 'pop', .5], [at(17, 'rigoles') + .12, 'pop', .5], [at(17, 'rigoles') + .24, 'pop', .5]] });
// B017b — « …tu fais semblant de t'en foutre. » : lunettes noires, cool… mais la bulle de pensée montre la vérité (il pleure)
B(17, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Sm = at(17, 'semblant') - O17;
    return schoolyard(t) + WASH() + dBench(330, 1500, 1.4) + heroP({ x: 330, y: 1500, s: 1.35, expr: 'cool', armL: [200, 260], armR: [-20, -10] }, t) +
      gThought(780, 820, 1, heroHead(0, 10, 90, { expr: 'sob' }, t)) + markerText('en vrai…', 800, 1060, t, Sm + .2, { size: 44 }) +
      kword('SEMBLANT', CX, 480, t, Sm - .05, { size: 104, fill: '#fff' }) + funTag(330, 620, 'TRANQUILLE', t, .1, { size: 46, bg: SX.acc, fg: '#fff', r: -5 }); },
  sfx: [[0, 'glint', .5], [.1, 'pop', .5], [at(17, 'semblant') - O17 - .05, 'boom', .5], [at(17, 'semblant') - O17 + .2, 'scratch', .4]] }, O17);

// B018 — « Tu apprends à transformer chaque émotion en blague. » : la BLAGUE-O-MATIC du salon : émotions dedans, blagues dehors
B(18, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .2 }),
  draw: (t, d, T) => { const Em = at(18, 'emotion'), Bl = at(18, 'blague'), Tr = at(18, 'transformer');
    const ins = [cloud(0, 0, .5, '#8fa3c0', 5), heart(0, 0, .7, '#e2463a'), path('M-10 -40L20 -40L0 -6L22 -6L-14 40L-2 6L-22 6Z', '#ffd23f', 5)];
    let items = ''; ins.forEach((it, i) => { const k = seg(t, Tr + i * .3, Tr + i * .3 + .5); if (k > 0 && k < 1) items += G(tr(lerp(160, 520, k), lerp(760, 820, k) - Math.sin(k * Math.PI) * 120), it); });
    const outs = ['LOL', 'MDR', 'PTDR'];
    return salonF(t, { noSofa: true }) + WASH() + G(tr(620, 1240), rect(-200, -420, 400, 420, '#9aa3ad', 30, 7) + path('M-120 -420L-170 -520L170 -520L120 -420Z', '#c9d3dc', 7) + rect(-150, -330, 300, 90, '#2b2b33', 14, 5) +
        ftext(0, -272, 'BLAGUE-O-MATIC', { size: 30, fill: SX.acc2, stroke: 'none' }) + circ(-80, -150, 40, SX.acc, 6) + circ(80, -150, 40, '#e2463a', 6) + G(`rotate(${f1(t * 300)} 210 -200)`, line(210, -200, 290, -200, 14) + circ(290, -200, 18, '#fff', 5)) + rect(200, -80, 200, 40, '#7d848c', 8, 6)) +
      heroP({ x: 220, y: 1500, s: 1.25, expr: 'effort', armR: [-10, -20] }, t) + items +
      outs.map((w, i) => funTag(940, 680 + i * 120, w, t, Bl - .1 + i * .12, { size: 46, bg: [SX.acc2, '#fff', SX.cool][i], fg: SX.ink, r: [-6, 5, -3][i] })).join('') +
      funTag(CX, 430, 'CHAQUE ÉMOTION', t, Em - .1, { size: 56, bg: SX.acc, fg: '#fff' }) + kword('= BLAGUE', CX, 570, t, Bl - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[at(18, 'transformer'), 'printer', .5], [at(18, 'emotion') - .1, 'pop', .6], [at(18, 'blague') - .05, 'boom', .5], [at(18, 'blague') + .05, 'pop_hi', .4], [at(18, 'blague') + .17, 'pop_hi', .4]] });

// B019 — « Triste ? Une blague. » : gros plan, larmes… pouet, nez de clown + grand sourire
B(19, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), shake: 1 }),
  draw: (t, d, T) => { const Un = at(19, 'une'), Bq = at(19, 'blague', 2);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .3 }, { z: 1, svg: heroHead(CX, 1000, 220, { expr: t > Un ? 'laugh' : 'sob', nose: pop(t, Un, .3) }, t) }]) +
      funTag(CX, 450, 'TRISTE ?', t, at(19, 'triste') - .1, { size: 72, bg: '#8fa3c0', fg: '#fff' }) + kword('BLAGUE !', 780, 660, t, Bq - .05, { size: 84, fill: SX.acc2, r: 6 }); },
  sfx: [[at(19, 'triste') - .1, 'pop', .6], [at(19, 'triste') + .1, 'gasp', .3], [at(19, 'une'), 'squeak', .6], [at(19, 'blague', 2), 'rimshot', .6]] });

// B020 — « Stressé ? Une blague. » : contrôle de maths, sueur à flots… nez de clown, jonglage
B(20, { enter: 'whip', cam: (t, d) => ({ z: 1.07, hand: .5, r: 3 }),
  draw: (t, d, T) => { const Un = at(20, 'une'), Bq = at(20, 'blague', 2), cl = t > Un;
    const ball = i => { const a = t * 9 + i * 2.1; return circ(330 + Math.cos(a) * 130, 740 - Math.abs(Math.sin(a)) * 160, 30, DPAL[i * 2], 5); };
    const hp = { x: 330, y: 1500, s: 1.3 };
    return classroomT(t, ftext(540, 620, 'CONTRÔLE', { size: 80, fill: 'rgba(255,255,255,.85)', stroke: 'none' })) + WASH() + heroP(Object.assign({ expr: cl ? 'laugh' : 'chatter', face: cl ? {} : { sweatSpray: 1 }, armL: cl ? [-120, -60] : [110, 100], armR: cl ? [-60, -120] : [70, 80] }, hp), t) +
      gNose(...headAt(hp, t), pop(t, Un, .3)) + (cl ? [0, 1, 2].map(ball).join('') : '') + G(tr(790, 1330), desk(0, 0, 1.0)) + G(tr(790, 1240, 1, -6), rect(-120, -80, 240, 160, '#fff', 6, 5) + ftext(0, 10, '2x + ? = ?!', { size: 30, fill: SX.ink, stroke: 'none' })) +
      funTag(CX, 450, 'STRESSÉ ?', t, at(20, 'stresse') - .1, { size: 72, bg: '#e2463a', fg: '#fff' }) + kword('BLAGUE !', 780, 660, t, Bq - .05, { size: 84, fill: SX.acc2, r: -6 }); },
  sfx: [[at(20, 'stresse') - .1, 'pop', .6], [.1, 'clock_fast', .4], [at(20, 'une'), 'squeak', .6], [at(20, 'blague', 2), 'rimshot', .6]] });

// B021 — « Tu as besoin d'aide ? » : salon, maman se penche gentiment vers le héros (sur le canapé)
B(21, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.03, 1.07, t / d), hand: .2 }),
  draw: (t, d, T) => salonF(t) + heroP({ x: 380, y: 1267, s: 1.2, expr: 'neutral', legL: [0, 90], legR: [0, 90], armL: [100, 80] }, t) +
    adult(1, { x: 820, y: 1520, s: 1.2, expr: 'worried', flip: 1, rot: -8, armR: [-30, -10] }, t) + chatBubble(700, 640, 440, 110, "BESOIN D'AIDE ?", t, at(21, 'besoin') - .15, false, 46) + heartsUp(t, 820, 820, 3, 200),
  sfx: [[0, 'whoosh', .3], [at(21, 'besoin') - .15, 'pop', .6], [at(21, 'tu'), 'hmm', .3]] });

// B022 — « Non, t'inquiète, je gère. » : le salon EN FEU derrière, le héros, lunettes noires, pouce levé, sirote son chocolat
B(22, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Gr = at(22, 'gere'), Iq = at(22, 'inquiete');
    return salonF(t) + op(.35, rect(-M, -M, W + 2 * M, 1250 + M, '#ff7a1a', 0, 0)) + flames(-60, 1260, 600, 520, t, 1) + flames(620, 1260, 520, 600, t, 3) +
      heroP({ x: CX, y: 1267, s: 1.25, expr: 'cool', legL: [0, 90], legR: [0, 90], armR: [-80, -100], armL: [120, 60], holdL: dMug(0, 20, .9, t, SX.acc) }, t) +
      G(tr(CX + 100, 830, pop(t, Gr - .1)), rect(-18, -50, 36, 60, SKIN, 14, 5)) + funTag(CX, 450, "NON, T'INQUIÈTE", t, Iq - .1, { size: 56, bg: '#fff', fg: SX.ink }) + kword('JE GÈRE.', CX, 600, t, Gr - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[0, 'fire', .5], [at(22, 'non'), 'pop_hi', .4], [at(22, 'inquiete') - .1, 'pop', .5], [at(22, 'gere') - .05, 'ding', .6], [at(22, 'gere'), 'glint', .4]] });

// B023 — « Même quand tu ne gères absolument rien. » : dézoom : feu + fuite d'eau + téléphone qui vibre ; jauge GESTION 0 %
B(23, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.12, 1.0, eOutCubic(clamp(t / d))), shake: 2 }),
  draw: (t, d, T) => { const Ab = at(23, 'absolument'), Rn = at(23, 'rien');
    let drops = ''; for (let i = 0; i < 7; i++) { const k = (t * 2 + i / 7) % 1; drops += ell(820 + (i % 3) * 30, 300 + k * 900, 12, 18, '#8fd0ff', 4); }
    return salonF(t) + op(.35, rect(-M, -M, W + 2 * M, 1250 + M, '#ff7a1a', 0, 0)) + flames(-60, 1260, 600, 560, t, 1) + flames(620, 1260, 520, 620, t, 3) + rect(780, 260, 120, 30, '#7d848c', 6, 5) + drops +
      ell(840, 1430, 260, 50, 'rgba(143,208,255,.7)', 5) + phone(170, 1090 + Math.sin(t * 60) * 4, .55, -10 + Math.sin(t * 50) * 4) +
      heroP({ x: CX, y: 1267, s: 1.25, expr: 'smug', face: { sweatSpray: 1 }, legL: [0, 90], legR: [0, 90], armR: [-80, -100], armL: [120, 60], holdL: dMug(0, 20, .9, t, SX.acc) }, t) +
      G(tr(CX, 720), bar(0, 0, 520, 1 - seg(t, .1, Ab), { col: '#e2463a', bg: 'rgba(255,255,255,.6)' }) + ftext(0, -46, 'GESTION : ' + Math.round(100 * (1 - seg(t, .1, Ab))) + ' %', { size: 40, fill: '#fff' })) +
      kthin('même quand tu ne gères', CX, 420, t, at(23, 'meme') - .1, { size: 52 }) + kword('ABSOLUMENT RIEN', CX, 560, t, Ab - .05, { size: 80, fill: SX.acc2 }) + (t > Rn ? cross(CX + 260, 720, .4, t, Rn) : ''); },
  sfx: [[0, 'fire', .4], [.1, 'vibrate', .5], [at(23, 'meme'), 'pop_hi', .4], [at(23, 'absolument') - .05, 'boom', .5], [at(23, 'rien'), 'error_beep', .5]] });

// B024a — « Puis un jour, » : chambre, le calendrier s'effeuille, le téléphone vibre sur la table de nuit
const O24 = at(24, 'kevin') - .15;
B(24, { enter: 'none', trans: 'black', transD: .25, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d) }),
  draw: (t, d, T) => { const Jr = at(24, 'jour');
    return bedroomN(t) + WASH('rgba(255,255,255,.06)') + heroP({ x: 300, y: 1500, s: 1.3, expr: 'neutral', look: [1, 0] }, t) +
      calendarPage(760, 760, 1.2, 4, String(12 + Math.min(9, Math.floor(t * 14)))) + (t < .5 ? G(tr(760, 760 - t * 600, 1.2, t * 200), calendarPage(0, 0, 1, 0, '11')) : '') +
      phone(760, 1080 + Math.sin(t * 60) * 5, .5, 80 + Math.sin(t * 50) * 4) + motionLines(860, 1080, 3, 40, 0, '#fff') + funTag(CX, 450, 'UN JOUR', t, Jr - .15, { size: 72, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'flutter', .5], [at(24, 'jour') - .15, 'pop', .6], [.3, 'vibrate', .6]] });
// B024b — « …Kevin t'appelle après une mauvaise nouvelle. » : Kevin dans sa chambre, téléphone à l'oreille, nuage de pluie au-dessus
B(24, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.03, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Mv = at(24, 'mauvaise') - O24;
    return bedroomN(t) + DIM(.25) + kevin({ x: 540, y: 1500, s: 1.35, expr: t > Mv ? 'sad' : 'worried', armR: [-60, -130], holdR: phone(0, -10, .26, 20) }, t) + gRain(560, 820, t) +
      funTag(CX, 430, 'KEVIN APPELLE', t, .05, { size: 56, bg: '#5fb85f', fg: '#fff' }) + kword('MAUVAISE NOUVELLE', CX, 590, t, Mv - .05, { size: 70, fill: '#fff' }); },
  sfx: [[0, 'ring', .5], [.05, 'pop', .5], [.3, 'wind', .3], [at(24, 'mauvaise') - O24 - .05, 'thunder', .5]] }, O24);

// B025 — « Tu l'écoutes. » : le héros au téléphone, calme, toute ouïe (oreille qui grandit)
B(25, { enter: 'none', trans: 'push', transD: .18, cam: () => ({ z: 1.08 }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .3 }, { z: 1, svg: heroHead(CX - 60, 980, 210, { expr: 'worried', look: [1, 0] }, t) + phone(CX + 180, 1000, .7, 15) + G(tr(CX + 160, 980, .8 + .4 * pop(t, .1)), ell(0, 0, 50, 76, SKIN, 6)) }]) +
    funTag(CX, 470, 'TU ÉCOUTES', t, at(25, 'ecoutes') - .2, { size: 66, bg: SX.acc, fg: '#fff' }),
  sfx: [[0, 'whoosh', .3], [.1, 'boing', .4], [at(25, 'ecoutes') - .2, 'pop', .6]] });

// B026 — « Il te dit : parle à personne de ce que je viens de te raconter. » : Kevin « chut », tampon TOP SECRET
B(26, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ps = at(26, 'personne'), Rc = at(26, 'raconter');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .3 }, { z: 1, svg: kevinHead(CX, 990, 210, { expr: 'worried', look: [0, 0] }, t) + G(tr(CX, 1190), rect(-14, -150, 28, 110, SKIN, 14, 6) + circ(0, 0, 52, SKIN, 6)) + phone(CX - 250, 990, .65, -15) }]) +
      kthin('parle à personne…', CX, 430, t, at(26, 'par') - .1, { size: 60 }) + stamp(CX, 600, 'TOP SECRET', t, Ps - .05, '#e2463a', -8, 80) + (t > Rc ? markerText('chut.', 820, 760, t, Rc, { size: 56 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(26, 'dit'), 'hmm', .4], [at(26, 'par') - .1, 'pop_hi', .4], [at(26, 'personne') - .05, 'thud', .7], [at(26, 'raconter'), 'tiptoe', .5]] });

// B027 — « Tu lui promets. » : fermeture éclair sur la bouche, main sur le cœur cadenassé
B(27, { enter: 'none', trans: 'wipe', transD: .18, cam: () => ({ z: 1.07, hand: .3 }),
  draw: (t, d, T) => { const k = seg(t, .1, .4);
    return bedroomN(t) + WASH('rgba(255,255,255,.06)') + heroP({ x: CX, y: 1500, s: 1.4, expr: 'calm', armR: [140, -150] }, t) +
      G(tr(CX, 1500 - 1.4 * 292 + 1.4 * 32), line(-60, 0, -60 + 120 * k, 0, 10, '#c9d3dc') + rect(-70 + 120 * k, -14, 22, 28, '#9aa3ad', 4, 4)) + funTag(CX, 470, 'PROMIS.', t, at(27, 'promets') - .15, { size: 80, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[.1, 'snip', .5], [at(27, 'promets') - .15, 'pop', .6], [.4, 'ding', .4]] });

// B028 — « Et tu réalises un truc. » : ampoule qui s'allume au-dessus du héros
B(28, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, eOutCubic(clamp(t / .4))) }),
  draw: (t, d, T) => { const Tr = at(28, 'truc'), Rl = at(28, 'realises');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .3 }, { z: 1, svg: heroHead(CX, 1020, 210, { expr: t > Tr ? 'wow' : 'shock' }, t) }]) + gBulb(CX, 720, pop(t, Rl - .1), t > Tr) +
      kthin('et tu réalises', CX, 420, t, at(28, 'et') - .1, { size: 56 }) + kword('UN TRUC.', CX, 540, t, Tr - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(28, 'realises') - .1, 'pop_hi', .4], [at(28, 'truc') - .05, 'boom', .4], [at(28, 'truc'), 'ding', .7]] });

// B029a — « Vous êtes 2 garçons capables… » : salon, le héros et Kevin sur le canapé, manettes en main
const O29 = at(29, 'passer') - .15;
const sofaDuo = (t, ex1, ex2, o = {}) => heroP({ x: 340, y: 1267, s: 1.2, expr: ex1, legL: [0, 90], legR: [0, 90], armL: [60, -20], armR: [120, 170], holdR: gPad() }, t) +
  kevin({ x: 720, y: 1267, s: 1.2, expr: ex2, legL: [0, 90], legR: [0, 90], armL: [60, -20], armR: [120, 170], holdR: gPad('#5b8fd8'), flip: o.flip }, t);
B(29, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .2 }),
  draw: (t, d, T) => salonF(t) + sofaDuo(t, 'happy', 'happy') + funTag(CX, 450, '2 GARÇONS', t, at(29, '2') - .1, { size: 76, bg: SX.acc, fg: '#fff' }) + kthin('capables de…', CX, 590, t, at(29, 'capables') - .1, { size: 54 }),
  sfx: [[0, 'whoosh', .4], [at(29, '2') - .1, 'pop', .6], [at(29, 'capables'), 'pop_hi', .4], [.2, 'typing', .3]] });
// B029b — « …passer 4 heures à discuter d'un jeu vidéo. » : l'horloge s'emballe, le jour devient nuit, ils parlent sans fin
B(29, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const Hr = at(29, '4') - O29, Jv = at(29, 'jeu') - O29, nt = t > Hr + .6;
    const tops = ['LE BOSS !', 'LA MAP !', 'LE PATCH !', 'LE LORE !'];
    return salonF(t * (1 + seg(t, Hr, Hr + .3) * 30), { night: nt }) + sofaDuo(t, 'ecstatic', 'ecstatic', { flip: 1 }) +
      tops.map((w, i) => chatBubble(i % 2 ? 790 : 290, 700 + Math.floor(i / 2) * 130, 260, 90, w, t, .1 + i * .35, i % 2 === 0, 34)).join('') +
      kword(counter(0, 4, t, Hr - .1, .5) + ' HEURES', CX, 480, t, Hr - .1, { size: 96, fill: SX.acc2 }) + markerText('jeu vidéo', 760, 600, t, Jv, { size: 46 }); },
  sfx: [[.1, 'pop_hi', .4], [.45, 'pop_hi', .4], [at(29, '4') - O29 - .1, 'clock_fast', .6], [.8, 'pop_hi', .4], [at(29, 'jeu') - O29, 'scratch', .4]] }, O29);

// B030a — « Mais pour dire : je vais mal… » : la bulle sort… minuscule. Les deux se figent, grillons
const O30 = at(30, 'il') - .15;
B(30, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const Jv = at(30, 'je'), k = 1 - .75 * seg(t, Jv, Jv + .6);
    return salonF(t, { night: 1 }) + sofaDuo(t, 'embarrassed', 'shock') + G(tr(420, 780, k), chatBubble(0, 0, 340, 100, 'je vais mal…', t, Jv - .1, true, 40)) +
      kthin('mais pour dire', CX, 430, t, at(30, 'mais') - .1, { size: 56 }) + (t > Jv + .5 ? sweat(420, 900, 1) + sweat(800, 900, 1) : ''); },
  sfx: [[at(30, 'mais') - .1, 'pop_hi', .4], [at(30, 'je') - .1, 'pop', .5], [at(30, 'mal'), 'squeak', .4], [at(30, 'mal') + .2, 'crickets', .5]] });
// B030b — « …il faut presque signer un accord de confidentialité. » : chez le notaire, contrat géant, plume, tampon
B(30, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .2 }),
  draw: (t, d, T) => { const Sg = at(30, 'signer') - O30, Cf = at(30, 'confidentialite') - O30, Ac = at(30, 'accord') - O30;
    const doc = rect(-200, -250, 400, 500, '#fffdf4', 8, 0) + ftext(0, -190, 'ACCORD', { size: 40, fill: SX.ink, stroke: 'none' }) + ftext(0, -150, 'de confidentialité', { size: 24, fill: SX.ink, stroke: 'none' }) +
      [0, 1, 2, 3, 4, 5].map(i => line(-160, -100 + i * 34, 160 - (i % 3) * 40, -100 + i * 34, 4, '#c9c4b4')).join('') + line(-160, 170, -20, 170, 4) + line(20, 170, 160, 170, 4) +
      (t > Sg ? path(`M-150 160q20 -30 40 0t40 0`, 'none', 4, '#1478b4') : '') + (t > Sg + .4 ? path('M30 160q20 -30 40 0t40 0', 'none', 4, '#36a85a') : '');
    return officeBg(t) + heroP({ x: 220, y: 1500, s: 1.2, expr: 'worried', armR: [-20, -60], holdR: G(tr(0, 0, 1, 30), path('M0 0L-10 -90Q20 -120 30 -80Z', '#fff', 4)) }, t) +
      kevin({ x: 880, y: 1500, s: 1.2, expr: 'worried', flip: 1 }, t) + adult(0, { x: CX, y: 1480, s: 1.0, expr: 'deadpan', shirt: '#2b2b33', glasses: true }, t) +
      G(tr(CX, 1330), rect(-330, -30, 660, 50, '#6b3e26', 8, 7) + rect(-310, 20, 620, 260, '#7a4a2a', 6, 6)) + card(CX, 760, 340, 420, G(tr(0, 0, .8), doc), t, Ac - .2, { ry: 0, thick: 10, r: -2, bw: 6 }) +
      kword('CONFIDENTIALITÉ', CX, 470, t, Cf - .05, { size: 80, fill: SX.acc2 }) + stamp(860, 1020, 'SIGNÉ', t, Cf + .4, SX.acc, -12, 56); },
  sfx: [[at(30, 'faut'), 'pop_hi', .3], [at(30, 'accord') - O30 - .2, 'printer', .4], [at(30, 'signer') - O30, 'scratch', .5], [at(30, 'confidentialite') - O30 - .05, 'boom', .5], [at(30, 'confidentialite') - O30 + .4, 'thud', .7]] }, O30);

// B031 — « Être un garçon ne t'oblige pas à devenir une statue. » : parc, le héros en STATUE grise (pigeon sur la tête)… qui se fissure
B(31, { enter: 'none', trans: 'circle', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2, cy: 1100 }),
  draw: (t, d, T) => { const St = at(31, 'statue'), Ob = at(31, 'oblige'), cr = seg(t, St, St + .2);
    const stone = { skin: '#c9c9c9', shirt: '#b3b3b3', pants: '#9a9a9a', hairColor: '#8a8a8a', heartC: '#a8a8a8', cheeks: false };
    const hp = Object.assign({ x: CX, y: 1250, s: 1.2, expr: 'deadpan', armL: [200, 240], armR: [-20, -60], bob: 0, look: [Math.sin(t * 3) > 0 ? 1 : -1, 0] }, stone);
    const [hx, hy] = headAt(hp, t);
    return parkBg(t) + G(tr(CX, 1520), rect(-260, -270, 520, 270, '#d9d4c8', 8, 7) + rect(-290, -290, 580, 40, '#c4bfb2', 8, 7) + ftext(0, -120, 'LE MEC', { size: 52, fill: '#8a8577', stroke: 'none' })) +
      heroP(hp, t) + gPigeon(hx + 20, hy - 120, .9, t) + (cr > 0 ? op(cr, path(`M${hx - 30} ${hy - 90}l20 50l-25 40l30 50M${CX + 40} ${hy + 160}l-20 60l25 50`, 'none', 7)) : '') +
      kthin("ne t'oblige pas à devenir", CX, 410, t, Ob - .2, { size: 50 }) + kword('UNE STATUE', CX, 540, t, St - .1, { size: 96, fill: '#fff' }) + cross(CX, 540, .6, t, St + .3); },
  sfx: [[0, 'chirp', .4], [at(31, 'garcon'), 'flutter', .4], [at(31, 'oblige'), 'pop_hi', .4], [at(31, 'statue') - .1, 'boom', .5], [at(31, 'statue'), 'crack', .7]] });

// B032a — « Le courage, » : cliché du chevalier : armure, bouclier… tout raide
const O32 = at(32, 'ce') - .15;
B(32, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Cg = at(32, 'courage');
    const shield = G(tr(0, -10), path('M-80 -90L80 -90L80 0Q80 80 0 120Q-80 80 -80 0Z', '#9aa3ad', 7) + path('M0 -70L0 90M-60 0L60 0', 'none', 12, '#e2463a'));
    return parkBg(t) + WASH() + heroP({ x: 380, y: 1500, s: 1.35, expr: 'effort', shirt: '#b8c0c8', sleeve: '#9aa3ad', cap: '#9aa3ad', armL: [130, 160], armR: [-30, -80], holdR: line(0, 0, 40, -200, 14, '#c9d3dc') }, t) + G(tr(250, 1260), shield) +
      funTag(CX, 450, 'LE COURAGE ?', t, Cg - .1, { size: 70, bg: SX.acc2, fg: SX.ink }) + markerText('(le cliché)', 790, 640, t, Cg + .2, { size: 46 }); },
  sfx: [[0, 'whoosh', .4], [at(32, 'courage') - .1, 'pop', .6], [at(32, 'courage') + .2, 'glint', .5], [.3, 'hammer', .3]] });
// B032b — « …ce n'est pas de ne rien ressentir. » : papier : un robot « 0 émotion » barré à côté du héros
B(32, { enter: 'none', trans: 'zoom', transD: .2, cam: zin(1.02, 1.07, .2),
  draw: (t, d, T) => { const Rs = at(32, 'ressentir') - O32, Rn = at(32, 'rien') - O32;
    const robot = G(tr(760, 1450), rect(-110, -330, 220, 240, '#c9d3dc', 20, 7) + rect(-80, -90, 40, 90, '#9aa3ad', 6, 6) + rect(40, -90, 40, 90, '#9aa3ad', 6, 6) + rect(-140, -310, 30, 160, '#9aa3ad', 10, 6) + rect(110, -310, 30, 160, '#9aa3ad', 10, 6) +
      G(tr(0, -450), rect(-100, -90, 200, 170, '#c9d3dc', 26, 7) + rect(-60, -40, 40, 30, SX.ink, 4, 0) + rect(20, -40, 40, 30, SX.ink, 4, 0) + line(-40, 40, 40, 40, 7) + line(0, -90, 0, -140, 7) + circ(0, -150, 14, '#e2463a', 5)) + ftext(0, -200, '0 %', { size: 50, fill: SX.ink, stroke: 'none' }));
    return paper('#e3eef7') + gobo(T, .1) + cutout(robot, 10) + cutout(heroP({ x: 300, y: 1450, s: 1.3, expr: 'calm', armL: [130, 150], armR: [50, 30] }, t), 10) + cross(760, 1000, .9, t, Rs + .05) +
      kthin("ce n'est pas de ne", CX, 410, t, at(32, 'n') - O32 - .1, { size: 56 }) + kword('RIEN RESSENTIR', CX, 540, t, Rn - .05, { size: 86, fill: SX.acc }); },
  sfx: [[0, 'whoosh', .4], [at(32, 'pas') - O32, 'pop_hi', .4], [at(32, 'rien') - O32 - .05, 'boom', .5], [at(32, 'ressentir') - O32 + .05, 'error_beep', .5]] }, O32);

// B033 — FIN : « C'est aussi d'oser le dire. » : coucher de soleil au parc, le cadenas du cœur s'ouvre (étoiles), Kevin pleure
//          de joie dans ses bras… et au fond, le coach du début se mouche dans un mouchoir géant
B(33, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Os = at(33, 'oser'), Dr = at(33, 'dire'), op_ = t > Os;
    return parkBg(t) + op(.25, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff9a4d', 0, 0)) + unlock(380, 1000, t, Os, { part: 'back', r: 420 }) +
      coach({ x: 940, y: 1330, s: .8, expr: t > Dr ? 'sob' : 'sad', armR: [-110, -150], holdR: G(tr(0, -20), rect(-40, -50, 80, 80, '#fff', 14, 5)) }, t) +
      heroP({ x: 380, y: 1500, s: 1.35, expr: op_ ? 'joy' : 'calm', lock: op_ ? 'open' : 'closed', armR: op_ ? [-20, -40] : [70, 80], armL: [200, 240] }, t) +
      kevin({ x: 720, y: 1500, s: 1.35, expr: op_ ? 'sob' : 'sad', flip: 1, armR: op_ ? [-160, -150] : [70, 80] }, t) + (op_ ? heartsUp(t, 550, 1000, 6, 420) : '') +
      unlock(380, 1000, t, Os, { part: 'front', r: 300 }) +
      kthin("c'est aussi", CX, 410, t, at(33, 'aussi') - .2, { size: 60 }) + kword("D'OSER LE DIRE.", CX, 540, t, Os - .1, { size: 90, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(33, 'aussi'), 'pop_hi', .4], [at(33, 'oser') - .1, 'boom', .5], [at(33, 'oser'), 'sparkle', .6], [at(33, 'dire'), 'tada', .5]] });

SCENES.sort((a, b) => a.s - b.s);
