// ============================================================
//  « Pourquoi c'est horrible d'être Kevin ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Épisode MÉTA : pour une fois, KEVIN (le figurant récurrent de la série) est le héros. Ton tendre, auto-dérision.
//  Les CAPITALES du script = moments criés → kword slam + flash. Les « … ? KEVIN. » = gros « KEVIN. » qui slam.
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

// ---------- SIZEX fun : accent ORANGE ROUX (propre à l'épisode), jaune marqueur, vert Kevin pour les étiquettes ----------
sxFun('#ff7a1a'); SX.acc2 = '#ffd23f'; SX.cool = '#8fd0ff';
const ROUX = '#c4521b', KGREEN = '#5fb85f';

// ============================================================
//  KEVIN (le héros) : kevin() / kevinHead() de decor.js. Bébé (déjà à pics), ado, adulte.
// ============================================================
const kvBaby = (o, t) => person(Object.assign({ age: 'baby', hair: 'spiky', hairColor: ROUX, freckles: true, shirt: '#bfe8b5', seed: 3 }, o), t);
const kvAdult = (o, t) => kevin(Object.assign({ age: 'adult' }, o), t);
// Kevin vu de dos (spectateur devant l'écran)
const kvBack = (x, y, s = 1) => G(tr(x, y, s), rect(-190, 80, 380, 300, KGREEN, 90, 7) + circ(-98, 8, 24, SKIN, 6) + circ(98, 8, 24, SKIN, 6) + circ(0, 0, 100, ROUX, 7) + hairSvg('spiky', ROUX, 100, 0)[1]);
// éclair blanc au milieu d'un plan
const kvFlash = (t, t0, k = .85) => t < t0 || t > t0 + .25 ? '' : op(k * (1 - seg(t, t0, t0 + .25)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0));
// le gros « KEVIN. » qui slam à chaque fois
const kvSlam = (t, t0, y = 800) => t < t0 ? '' : burst(CX, y, 330, t, t0, SX.acc, 18) + kword('KEVIN.', CX, y, t, t0, { size: 190, fill: '#fff' }) + popStars(CX, y, t, t0 + .1, 8, 380) + kvFlash(t, t0, .7);
// émoji « mort de rire » dessiné (pas de police émoji)
const kvLol = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), circ(0, 0, 40, '#ffd23f', 5) + path('M-24 -8Q-14 -20 -4 -8M4 -8Q14 -20 24 -8', 'none', 5) + path('M-22 6Q0 34 22 6Z', '#7a2b2b', 4) + path('M-30 -4Q-44 10 -40 24', 'none', 7, '#5ec4f0') + path('M30 -4Q44 10 40 24', 'none', 7, '#5ec4f0'));
// petit nez de clown
const kvNose = (x, y, r = 16) => circ(x, y, r, '#ff3b30', 4) + circ(x - r * .3, y - r * .3, r * .3, 'rgba(255,255,255,.7)', 0);

// ---------- les miniatures des « vrais » épisodes précédents (Kevin toujours en figurant ridicule) ----------
const EPS = {
  petit: { label: 'PETIT', c1: '#8fd0ff', c2: '#4f86d8', hair: 'short', hc: '#4a3428', skin: SK[1], expr: 'sad', kx: 'sob' },
  insomnie: { label: 'INSOMNIE', c1: '#5a5fb0', c2: '#1d2350', hair: 'curly', hc: '#2b2420', skin: SK[0], expr: 'dizzy', kx: 'mock' },
  pauvre: { label: 'PAUVRE', c1: '#ffe08a', c2: '#ffb03a', hair: 'bun', hc: '#8a5a3a', skin: SK[3], expr: 'worried', kx: 'smugger' },
  chauve: { label: 'CHAUVE', c1: '#ffc4d6', c2: '#ff7aa2', hair: 'bald', hc: '#7a6a5a', skin: SK[0], expr: 'sob', kx: 'laugh' },
  cernes: { label: 'CERNES', c1: '#c9b8ff', c2: '#7a5cd8', hair: 'long', hc: '#1f1a18', skin: SK[2], expr: 'deadpan', kx: 'dizzy' },
  front: { label: 'GRAND FRONT', c1: '#b8f0c8', c2: '#36a85a', hair: 'side', hc: '#e0a040', skin: SK[1], expr: 'embarrassed', kx: 'mock' },
  barbe: { label: 'BARBE', c1: '#ffd9b0', c2: '#ff9a4d', hair: 'short', hc: '#6b3e26', skin: SK[4], expr: 'worried', kx: 'smugger' },
  acne: { label: 'ACNÉ', c1: '#a8e6ff', c2: '#2f9ad0', hair: 'ponytail', hc: '#8a5a3a', skin: SK[3], expr: 'sad', kx: 'jawdrop' },
  oreilles: { label: 'OREILLES', c1: '#fff2a8', c2: '#e8b923', hair: 'curly', hc: '#6b3e26', skin: SK[5], expr: 'shock', kx: 'laugh' },
  kevin: { label: 'KEVIN', c1: '#ffcf9a', c2: '#ff7a1a', hair: 'spiky', hc: ROUX, skin: SKIN, expr: 'ecstatic', kx: 'wow', star: 1 },
};
// miniature w×h centrée en 0 ; le figurant Kevin est à (w*.3, h*.2)
function kvThumb(key, w, h, t, o = {}) { const e = EPS[key], hr = h * .3;
  let s = grad(e.c1, e.c2, -w / 2 - 2, -h / 2 - 2, w + 4, h + 4) + op(.22, sunburst(-w * .17, h * .1, 14, 'rgba(255,255,255,.9)', 'rgba(255,255,255,0)', t * 10));
  s += G(tr(-w * .17, h * .14), head({ hr, hair: e.hair, hairColor: e.hc, skin: e.skin, expr: e.expr, freckles: !!e.star, seed: 40 }, t));
  if (!e.star) s += G(tr(w * .3, h * .2, 1, Math.sin(t * 4 + w) * 8), head({ hr: hr * .48, hair: 'spiky', hairColor: ROUX, freckles: true, expr: o.kx || e.kx, seed: 3 }, t)) + kvNose(w * .3, h * .2 + hr * .1, hr * .07);
  else s += popStars(w * .25, -h * .05, (t % 1.2) + .1, 0, 6, h * .3);
  const lw = e.label.length * h * .1 + 28;
  s += G(tr(-w / 2 + 12, -h / 2 + 12), rect(0, 0, lw, h * .2, SX.acc, 8, 4) + ftext(lw / 2, h * .155, e.label, { size: h * .15, fill: '#fff' }));
  return clipR(-w / 2, -h / 2, w, h, s, 10) + rect(-w / 2, -h / 2, w, h, 'none', 10, 5); }

// lecteur vidéo (cadre sombre, barre rouge, titre)
function kvPlayer(x, y, w, h, inner, t, o = {}) { const p = o.p ?? (.15 + (t * .06) % .8);
  return G(tr(x, y, o.s || 1, o.r || 0), rect(-w / 2 - 16, -h / 2 - 16, w + 32, h + 32, '#15151c', 26, 7) + clipR(-w / 2, -h / 2, w, h, rect(-w / 2, -h / 2, w, h, '#000', 0, 0) + inner, 10) +
    rect(-w / 2 + 10, h / 2 - 18, w - 20, 8, 'rgba(255,255,255,.4)', 4, 0) + rect(-w / 2 + 10, h / 2 - 18, (w - 20) * p, 8, '#ff2b2b', 4, 0) + circ(-w / 2 + 10 + (w - 20) * p, h / 2 - 14, 11, '#ff2b2b', 0) +
    (o.title ? G(tr(0, h / 2 + 62), rect(-w / 2 - 16, -38, w + 32, 76, '#fff', 18, 6) + ftext(-w / 2 + 6, 13, o.title, { size: 32, fill: SX.ink, stroke: 'none', anchor: 'start' })) : '')); }
// salle de visionnage : chambre de nuit floutée, grand écran, Kevin de dos au premier plan
const PLY = 800, PW = 880, PH = 495;
function kvWatch(t, inner, o = {}) {
  return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .38 }]) + op(.18 + .04 * Math.sin(t * 7), glow(CX, PLY, 700, '#9fd0ff', .7)) +
    kvPlayer(CX, PLY, PW, PH, inner, t, { title: o.title, p: o.p }) + kvBack(CX, 1430, 1.35) + op(.2, ell(CX, 1330, 170, 60, '#bfe3ff', 0)); }
// décors miniatures (coordonnées locales du lecteur : x ±440, y ±247)
const inYard = (t) => grad('#9fd6ff', '#e6f6ff', -460, -260, 920, 520) + cloud(((t * 40) % 1100) - 500, -170, .8, '#fff') + rect(-460, 110, 920, 160, '#8fd18a', 0, 0) + line(-460, 110, 460, 110, 5, '#6cb86a') + tree(-380, 120, .5, t) + dFence(-460, 460, 112, '#fff');
const inNight = (t) => rect(-460, -260, 920, 520, '#232a66', 0, 0) + dWindowView(-400, -210, 200, 220, t, { night: true }) + op(.5, rect(-460, -260, 920, 520, 'rgba(10,10,40,.3)', 0, 0));

// ---------- décors ----------
// maternité (chambre d'hôpital) : ballons qui éclatent au prénom
function kvMater(t, o = {}) { const yb = 1250, popT = o.popT ?? 1e9;
  let s = dWall('dot', '#e4f6ef', '#cdeee0', yb) + dWindowView(60, 260, 320, 380, t) + dCurtain(40, 250, 90, 420, '#ffd23f', t, 1) + dCurtain(330, 250, 90, 420, '#ffd23f', t, -1);
  s += path('M440 200Q640 280 840 200', 'none', 5) + [0, 1, 2, 3, 4, 5].map(i => path(`M${470 + i * 64} ${218 + Math.sin(i / 5 * 3.14) * 50}l26 50l26 -50Z`, DPAL[i], 4)).join('');
  [[860, 330, '#ef476f', 0], [960, 300, '#ffd23f', 1.3], [760, 360, '#5ec4f0', 2.1]].forEach(([x, y, c, ph], i) => { const tp = popT + i * .08;
    s += t < tp ? dBalloon(x, y, c, t, ph) : op(1 - seg(t, tp, tp + .3), G(tr(x, y, 1 + seg(t, tp, tp + .3)), path('M0 -60L10 -20L40 -30L18 0L50 20L10 18L0 60L-10 18L-50 20L-18 0L-40 -30L-10 -20Z', c, 5))); });
  s += dFrame(560, 470, 160, 130, 'heart', '#c38a52', -3) + G(tr(980, 760), rect(-70, -60, 140, 110, '#2b2b33', 10, 6) + path(`M-56 0L-30 0L-20 -30L-6 30L8 0L56 0`, 'none', 6, '#7be07b') + line(0, 50, 0, 490, 10, '#9aa3ad'));
  s += G(tr(640, 640), rect(-110, -40, 220, 80, '#fff', 12, 5) + ftext(0, 14, "C'EST UN GARS", { size: 26, fill: '#3e7cc0', stroke: 'none' }));
  s += dParquet(yb, '#e8cfa8') + dTeddy(150, 1250, 1.1) + dGift(300, 1250, .9) + dGift(380, 1250, .7, '#ff8fb1', '#fff') + dPot(1010, 1290, 1, t, 1);
  return s; }
// lit d'hôpital (devant la maman)
const kvBed = (x, yb, s = 1) => G(tr(x, yb, s), rect(-340, -150, 40, 300, '#b9c4cc', 12, 6) + rect(300, -60, 40, 210, '#b9c4cc', 12, 6) + rect(-320, -40, 640, 120, '#e8eef2', 20, 7) + path('M-310 -40Q-100 -110 310 -50L310 0L-310 0Z', '#8fd0ff', 6) + path('M-200 -70Q0 -90 200 -60', 'none', 4, '#5aaee0'));
// scène de théâtre (rideaux, projecteurs, public en ombres chinoises)
function kvStage(t, o = {}) { let s = grad('#3a1d3e', '#1c0e22', -M, -M, W + 2 * M, H + 2 * M) + dWall('star', 'rgba(0,0,0,0)', 'rgba(255,220,160,.12)', 1300);
  s += rect(-M, 175, W + 2 * M, 22, '#4a4a55', 4, 5); for (let i = 0; i < 5; i++) { const x = 120 + i * 210, a = wave(t, .5, 10, i); s += G(tr(x, 197, 1, a), rect(-22, 0, 44, 60, '#2b2b33', 8, 5) + circ(0, 64, 18, i % 2 ? '#ffe08a' : '#ff8fb1', 4)); }
  for (const sd of [-1, 1]) { let c = ''; for (let i = 0; i < 4; i++) c += path(`M${i * 45} -100Q${i * 45 + 25 + wave(t, .4, 6, i)} 700 ${i * 45 + 5} 1400`, 'none', 10, '#7a1426'); s += G(sd < 0 ? tr(-60, 0) : `translate(${W + 60} 0) scale(-1 1)`, path('M-100 -100L200 -100Q150 600 230 1400L-100 1400Z', '#b81f3a', 7) + c + path('M150 700Q230 720 210 780', 'none', 12, '#ffd23f') + circ(205, 790, 14, '#ffd23f', 4)); }
  s += path('M-100 -100L1180 -100L1180 120Q900 180 540 140Q180 180 -100 120Z', '#b81f3a', 7) + [0, 1, 2, 3, 4, 5, 6].map(i => circ(80 + i * 150, 140 + Math.sin(i) * 8, 10, '#ffd23f', 3)).join('');
  s += dNeon(540, 330, o.neon || 'LOL', '#ff5c8a', t, 70);
  s += op(.2, path(`M${300 + wave(t, .2, 30)} 120L${120} 1450L${560} 1450Z`, '#fff6c8', 0)) + op(.14, path(`M${780 - wave(t, .25, 40)} 120L${520} 1450L${980} 1450Z`, '#ffb3c8', 0));
  s += dPot(70, 1300, .8, t, 0, '#b81f3a') + dPot(1010, 1300, .8, t, 2, '#b81f3a');
  s += rect(-M, 1300, W + 2 * M, 900, '#6b3e26', 0, 0) + [0, 1, 2, 3].map(i => line(-M, 1330 + i * 40, W + M, 1330 + i * 40, 3, '#5a3320')).join('') + line(-M, 1300, W + M, 1300, 10, '#4a2a18') + rect(-M, 1480, W + 2 * M, 40, '#3a2010', 0, 0);
  for (let i = 0; i < 9; i++) s += ell(-40 + i * 145, 1480, 30, 14, '#ffe08a', 4) + op(.25, circ(-40 + i * 145, 1470, 40, '#fff6c8', 0));
  for (let i = 0; i < 7; i++) { const bx = 80 + i * 160, by = 1760 + wave(t, .7, 6, i * .3) - (o.laugh ? Math.abs(Math.sin(t * 9 + i)) * 26 : 0); s += circ(bx, by, 120, '#140a18', 0) + ell(bx, 1900, 150, 120, '#140a18', 0) + (i === 2 || i === 5 ? G(tr(bx + 70, by - 150, 1, 10), rect(-24, -40, 48, 80, '#222', 8, 4) + rect(-18, -32, 36, 62, Math.sin(t * 3 + i) > 0 ? '#bfe3ff' : '#fff6c8', 4, 0)) : ''); }
  return s; }
// intérieur voiture vu à travers le pare-brise (auto-école)
function kvCar(t, inside = '') { let s = streetT(t, 2) + WASH('rgba(255,255,255,.1)');
  s += path('M-200 380L1280 380L1280 1920L-200 1920Z', '#e2463a', 0) + path('M110 440L970 440L1060 1150L20 1150Z', '#3a3f4a', 8);
  s += clipR(-M, 440, W + 2 * M, 710, path('M110 440L970 440L1060 1150L20 1150Z', '#4a5060', 0) + rect(140, 520, 300, 420, '#2f343e', 60, 6) + rect(640, 520, 300, 420, '#2f343e', 60, 6) + inside, 0);
  s += path('M110 440L970 440L1060 1150L20 1150Z', 'none', 22, '#c8324a') + op(.18, path('M180 470L420 470L200 900Z', '#fff', 0));
  s += G(tr(540, 410), rect(-140, -54, 280, 70, '#fff', 14, 6) + ftext(0, -6, 'AUTO-ÉCOLE', { size: 34, fill: '#e2463a', stroke: 'none' }));
  s += G(tr(540, 520), rect(-60, -18, 120, 36, '#2b2b33', 10, 4)) + G(tr(-30, 760), ell(0, 0, 60, 40, '#e2463a', 6) + ell(0, 0, 44, 28, '#9fd6ff', 4)) + G(tr(1110, 760), ell(0, 0, 60, 40, '#e2463a', 6) + ell(0, 0, 44, 28, '#9fd6ff', 4));
  s += path('M-200 1150L1280 1150L1280 1320L-200 1320Z', '#2b2f38', 7) + rect(120, 1170, 220, 60, '#1d2026', 14, 5) + circ(180, 1200, 20, '#7be07b', 4) + circ(260, 1200, 20, '#ffd23f', 4);
  s += path('M-200 1320Q540 1280 1280 1320L1280 1920L-200 1920Z', '#d93a3a', 7) + path('M200 1380Q540 1350 880 1380', 'none', 6, '#b8283a') + G(tr(540, 1450), rect(-60, -30, 120, 60, '#fff', 10, 5) + ftext(0, 14, 'L', { size: 50, fill: '#e2463a', stroke: 'none' }));
  return s; }
// volant (premier plan)
const kvWheel = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), ell(0, 0, 150, 70, 'none', 26) + ell(0, 0, 150, 70, 'none', 14, '#3a3f4a') + rect(-30, -20, 60, 40, '#3a3f4a', 12, 5) + line(-150, 0, -30, 0, 14, '#3a3f4a') + line(30, 0, 150, 0, 14, '#3a3f4a'));
// ordinateur portable
const kvLaptop = (x, y, s, screen = '', r = 0) => G(tr(x, y, s, r), rect(-210, -280, 420, 280, '#3a3f4a', 18, 7) + rect(-190, -260, 380, 240, '#eef4ff', 8, 0) + clipR(-190, -260, 380, 240, screen, 8) + path('M-250 0L250 0L280 40L-280 40Z', '#9aa3ad', 7) + rect(-50, 8, 100, 14, '#7d848c', 6, 0));
const kvDesk = (x, yb, w = 620) => G(tr(x, yb), rect(-w / 2, -20, w, 40, '#c58e55', 8, 7) + rect(-w / 2 + 20, 20, 30, 300, '#8a5a3a', 0, 5) + rect(w / 2 - 50, 20, 30, 300, '#8a5a3a', 0, 5));
// tableau en liège (mur de miniatures façon complot)
const BOARD = { keys: ['petit', 'insomnie', 'pauvre', 'chauve', 'cernes', 'front', 'barbe', 'acne', 'oreilles'], xs: [230, 540, 850], ys: [560, 750, 940], w: 270, h: 152, r: [-3, 2, -2, 3, -1, 2, -2, 3, -3] };
const bPos = i => [BOARD.xs[i % 3], BOARD.ys[Math.floor(i / 3)]];
const bKev = i => { const [x, y] = bPos(i); return [x + BOARD.w * .3, y + BOARD.h * .2]; };
function kvBoard(t, o = {}) { const show = o.show ?? (() => -1);
  let s = bedroomN(t) + WASH('rgba(255,240,220,.1)') + dDeskLamp(120, 1250, 1.2, t);
  s += rect(50, 455, 980, 590, '#8a5a3a', 18, 7) + rect(70, 475, 940, 550, '#d4a26a', 8, 4);
  for (let i = 0; i < 60; i++) s += circ(80 + (i * 97) % 920, 485 + (i * 61) % 530, 3, '#b8854f', 0);
  BOARD.keys.forEach((k, i) => { const [x, y] = bPos(i); const t0 = show(i); if (t < t0) return; const kk = pop(t, t0, .3);
    s += G(tr(x, y, kk, BOARD.r[i]), rect(-BOARD.w / 2 - 10, -BOARD.h / 2 - 10, BOARD.w + 20, BOARD.h + 20, '#fff', 6, 4) + kvThumb(k, BOARD.w, BOARD.h, t + i) + circ(0, -BOARD.h / 2 - 2, 12, DPAL[i % 8], 4)); });
  return s; }

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001a — SIGNATURE : grille encre, Kevin en cut-out, titre 3 lignes, « débloqué » en étoiles sur KEVIN
const O1 = at(1, 'tu') - .12;
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'kevin');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(kevin({ x: 0, y: 0, s: 1.25, expr: t > K ? 'wow' : 'smugger', armL: t > K ? [-140, -120] : [110, 100], armR: t > K ? [-40, -60] : [70, 80] }, t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1030, 330, 330, t, K + .2, { label: 'heros.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'ÊTRE", CX, 415, t, .3, { size: 58 }) +
      kword('KEVIN ?', CX, 540, t, K - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'kevin') - .05, 'boom', .6], [at(1, 'kevin'), 'sparkle', .5]] });

// B001b — « Tu viens de naître. » : papier + gobo, bébé Kevin en cut-out… déjà à pics
B(1, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.08, .2),
  draw: (t, d, T) => { const Na = at(1, 'naitre') - O1;
    return paper(SX.paper) + gobo(T, .12) + burst(CX, 1020, 290, t, .02, '#ffe1b8', 16) +
      cutout(kvBaby({ x: CX, y: 1330, s: 1.45, expr: t > Na ? 'happy' : 'calm' }, t), 12) +
      funTag(250, 760, 'JOUR 1', t, .05, { size: 46, bg: KGREEN, r: -8 }) + markerText('déjà à pics', 820, 700, t, Na + .05, { size: 46 }) + markerArrow(800, 730, 650, 830, t, Na + .1, { bend: -40 }) +
      kthin('tu viens de', CX, 420, t, 0, { size: 60 }) + kword('NAÎTRE', CX, 550, t, Na - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [.05, 'pop', .5], [at(1, 'naitre') - O1 - .05, 'boom', .4], [at(1, 'naitre') - O1, 'baby_coo', .7], [at(1, 'naitre') - O1 + .1, 'scratch', .4]] }, O1);

// B002 — « La sage-femme demande ton prénom. » : papier, sage-femme cut-out + fiche « PRÉNOM : ? », berceau
B(2, { enter: 'none', trans: 'circle', transD: .25, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const Sf = at(2, 'sage'), Pr = at(2, 'prenom');
    const clip = G(tr(0, -60, 1, 8), rect(-80, -100, 160, 200, '#c58e55', 10, 6) + rect(-66, -84, 132, 172, '#fff', 4, 0) + ftext(0, -40, 'PRÉNOM', { size: 26, fill: OL, stroke: 'none' }) + line(-50, 20, 50, 20, 4, '#9aa3ad') + (t > Pr ? ftext(0, 10, '?', { size: 54, fill: '#e2463a', stroke: 'none' }) : ''));
    return paper('#e3f7ef') + gobo(T, .1) + blob(800, 1040, 260, t, '#ffd9e6', 3) +
      cutout(adult(1, { x: 330, y: 1480, s: 1.2, hair: 'bun', hairColor: '#8a5a3a', shirt: '#8fd0ff', pants: '#5aaee0', expr: t > Pr ? 'shock' : 'happy', look: [1, 0], armR: [-40, -70], holdR: clip }, t), 10) +
      cutout(kvBaby({ x: 800, y: 1250, s: 1.05, expr: 'happy' }, t) + G(tr(800, 1290), rect(-200, -60, 400, 90, '#fff', 26, 7) + rect(-200, -60, 400, 30, '#eee', 18, 5)), 10) +
      funTag(CX, 430, 'LA SAGE-FEMME', t, Sf - .1, { size: 50, bg: SX.cool, fg: SX.ink, r: -4 }) + kword('TON PRÉNOM ?', CX, 570, t, Pr - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(2, 'sage') - .1, 'pop', .5], [at(2, 'demande'), 'pop_hi', .4], [at(2, 'prenom') - .05, 'boom', .4], [at(2, 'prenom') + .1, 'scratch', .4]] });

// B003 — « Ta mère répond : Kevin. » : maternité, maman fière ; à « Kevin » les ballons éclatent
B(3, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3, shake: t > at(3, 'kevin') && t < at(3, 'kevin') + .4 ? 7 : 0 }),
  draw: (t, d, T) => { const Me = at(3, 'mere'), K = at(3, 'kevin');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: kvMater(t, { popT: K }), haze: .08 },
      { z: 1, svg: adult(3, { x: 640, y: 1440, s: 1.12, hair: 'long', expr: t > K ? 'proud' : 'happy', face: t > Me && t < K ? { mouth: 'talk' } : {}, armL: [150, 60], armR: [120, 160] }, t) +
        kvBaby({ x: 420, y: 1270, s: .85, expr: t > K ? 'shock' : 'happy' }, t) + kvBed(620, 1330, 1) },
      { z: .6, svg: blur(10, dPot(1050, 1950, 1.6, t, 2)) }]) +
      kthin('ta mère répond :', CX, 430, t, Me - .15, { size: 60 }) + kword('KEVIN.', CX, 580, t, K - .05, { size: 150, fill: SX.acc2 }) + kvFlash(t, K, .6); },
  sfx: [[0, 'whoosh', .4], [at(3, 'mere'), 'pop_hi', .4], [at(3, 'kevin') - .05, 'boom', .7], [at(3, 'kevin'), 'pop', .6], [at(3, 'kevin') + .1, 'pop_hi', .5], [at(3, 'kevin') + .2, 'scratch', .5]] });

// B004 — « Le médecin baisse les yeux. » : gros plan du médecin, il baisse les yeux, gêné (une goutte de sueur)
B(4, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d) }),
  draw: (t, d, T) => { const Md = at(4, 'medecin'), Bs = at(4, 'baisse'), down = t > Bs;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: kvMater(t, { popT: -10 }), haze: .3 }, { z: 1, svg: person({ age: 'adult', x: CX, y: 1700, s: 2.1, hair: 'side', hairColor: '#7a6a5a', shirt: '#f4f6f8', coat: 1, stetho: 1, glasses: true, skin: SK[4], expr: down ? 'sad' : 'neutral', look: down ? [0, 1.4] : [0, 0], headTilt: down ? 8 : 0, seed: 70 }, t) +
      (down ? sweat(720, 780 + (t * 40) % 30, 1.2) : '') }]) +
      kthin('le médecin', CX, 420, t, Md - .1, { size: 60 }) + funTag(CX, 545, 'BAISSE LES YEUX…', t, Bs - .05, { size: 46, bg: SX.cool, fg: SX.ink, r: 3 }); },
  sfx: [[at(4, 'medecin') - .1, 'pop_hi', .4], [at(4, 'baisse'), 'sting', .5], [at(4, 'yeux'), 'gulp', .5], [at(4, 'yeux') + .2, 'crickets', .3]] });

// B005 — « IL SAIT DÉJÀ QUE TA VIE EST FOUTUE. » : rayons rouges, dossier « VIE DE KEVIN » courbe qui plonge, tampon FOUTUE
B(5, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(5, 'foutue') ? 6 : 2 }),
  draw: (t, d, T) => { const Sa = at(5, 'sait'), Vi = at(5, 'vie'), Fo = at(5, 'foutue'), k = seg(t, Vi - .2, Fo);
    let cv = ''; for (let i = 0; i <= 20; i++) { const u = i / 20; if (u > k) break; cv += (i ? 'L' : 'M') + f1(-150 + u * 300) + ' ' + f1(-60 + u * u * 190 + Math.sin(u * 20) * 10); }
    const chart = ftext(0, -150, 'VIE DE KEVIN', { size: 34, fill: OL, stroke: 'none' }) + line(-160, 150, 170, 150, 5) + line(-160, 150, -160, -110, 5) + path(cv, 'none', 10, '#e2463a') + (k >= 1 ? emark(150, 120, .4, '#e2463a') : '');
    return rays(t, CX, 950, '#ff6b6b', '#c92f3a', 22) + cutout(kvBaby({ x: 260, y: 1330, s: 1.2, expr: 'happy' }, t), 10) +
      card(720, 900, 420, 380, chart, t, Sa, { ry: 0, thick: 10, r: 4, bw: 6 }) +
      kword('IL SAIT DÉJÀ', CX, 430, t, Sa - .05, { size: 100, fill: '#fff' }) + kthin('que ta vie est', CX, 590, t, at(5, 'que') - .1, { size: 54 }) + stamp(720, 900, 'FOUTUE', t, Fo - .05, '#e2463a', -12, 90); },
  sfx: [[0, 'flash_hit', .5], [at(5, 'sait') - .05, 'boom', .6], [at(5, 'vie'), 'whoosh_up', .3], [at(5, 'vie') + .2, 'error_beep', .4], [at(5, 'foutue') - .05, 'thud', .8], [at(5, 'foutue'), 'buzz', .4]] });

// B006 — « Bienvenue dans la vie de Kevin. » : rue, arche à ampoules « LA VIE DE KEVIN », bébé en poussette, pancarte « PAS DE REMBOURSEMENT »
const kvStroller = (x, yb, s = 1) => G(tr(x, yb, s), circ(-110, -30, 34, '#3a3f4a', 6) + circ(110, -30, 34, '#3a3f4a', 6) + line(150, -120, 230, -320, 10) + line(220, -320, 270, -320, 14) + path('M-170 -200L170 -200Q160 -70 0 -70Q-160 -70 -170 -200Z', '#ff8fb1', 7) + path('M-170 -200Q-190 -360 0 -360L0 -200Z', '#e2668f', 7));
B(6, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bv = at(6, 'bienvenue'), K = at(6, 'kevin'), sw = Math.sin(t * 3) * 8;
    let bulbs = ''; for (let i = 0; i < 14; i++) { const a = R(180 + i * 180 / 13), bx = CX + Math.cos(a) * 400, by = 760 + Math.sin(a) * 200, on = i === 9 ? Math.sin(t * 23) > .5 : Math.sin(t * 6 + i) > -.4; bulbs += circ(bx, by, 16, on ? '#fff3a0' : '#9a8a50', 4) + (on ? op(.35, circ(bx, by, 30, '#fff3a0', 0)) : ''); }
    const arch = rect(118, 760, 44, 500, '#8a5a3a', 6, 6) + rect(918, 760, 44, 500, '#8a5a3a', 6, 6) + path(`M140 760A400 200 0 0 1 940 760`, 'none', 30, '#b81f3a') + path(`M140 760A400 200 0 0 1 940 760`, 'none', 6, '#ffd23f') + bulbs +
      G(tr(800, 860, 1, sw), line(-40, -60, -40, 0, 4) + line(40, -60, 40, 0, 4) + rect(-110, 0, 220, 80, '#fff', 10, 5) + ftext(0, 34, 'PAS DE', { size: 24, fill: '#e2463a', stroke: 'none' }) + ftext(0, 64, 'REMBOURSEMENT', { size: 20, fill: '#e2463a', stroke: 'none' }));
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .1 },
      { z: 1, svg: arch + adult(3, { x: 230, y: 1480, s: 1.1, hair: 'long', expr: 'happy', armR: [-10, 10] }, t) + kvBaby({ x: 560, y: 1175, s: .8, expr: 'happy' }, t) + kvStroller(560, 1300, 1) },
      { z: .6, svg: blur(10, dBush(1000, 1900, 1.6)) }]) +
      kthin('bienvenue dans la vie de', CX, 430, t, Bv - .1, { size: 54 }) + kword('KEVIN', CX, 600, t, K - .05, { size: 120, fill: SX.acc2 }) + confetti(t, K, 26); },
  sfx: [[0, 'whoosh', .4], [at(6, 'bienvenue'), 'magic', .5], [at(6, 'vie'), 'pop_hi', .4], [at(6, 'kevin') - .05, 'boom', .5], [at(6, 'kevin'), 'tada', .5]] });

// B007 — « À huit ans, tu rates ton contrôle de maths. » : classe, Kevin sûr de lui… puis la copie revient
const kvExam = (t, note = '', k = 0) => rect(-170, -210, 340, 420, '#fff', 8, 0) + ftext(0, -150, 'CONTRÔLE', { size: 40, fill: OL, stroke: 'none' }) + line(-130, -120, 130, -120, 4, '#e2463a') +
  ['2 + 2 = 5', '7 × 8 = 78', '9 − 3 = 🙃'.replace('🙃', '?')].map((q, i) => ftext(-130, -60 + i * 80, q, { size: 38, fill: '#3a5bff', stroke: 'none', anchor: 'start' })).join('') +
  (note ? op(k, G(tr(70, 150, 1, -10), ftext(0, 0, note, { size: 92, fill: '#e2463a', stroke: 'none' }) + ell(0, -30, 120, 70, 'none', 8, '#e2463a'))) : '');
B(7, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const A8 = at(7, '8'), Ra = at(7, 'rates'), Ct = at(7, 'controle');
    return classroomT(t, ftext(540, 640, '7 × 8 = ?', { size: 80, fill: 'rgba(255,255,255,.85)', stroke: 'none' })) + WASH() +
      kid(1, { x: 900, y: 1300, s: .72, expr: 'happy' }, t) + desk(900, 1220, .62) +
      kevin({ x: 300, y: 1490, s: 1.35, expr: t > Ra ? 'shock' : 'smugger', armL: t > Ra ? [-150, -120] : [110, 100], armR: t > Ra ? [-30, -60] : [40, 10] }, t) + desk(300, 1330, 1.05) +
      card(730, 900, 340, 420, kvExam(t), t, Ct - .15, { ry: 0, thick: 10, r: 5, bw: 6 }) +
      funTag(CX, 430, '8 ANS', t, A8 - .1, { size: 90, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 430, t, A8, 6, 180) + kthin('tu rates ton contrôle', CX, 610, t, Ra - .1, { size: 54 }); },
  sfx: [[0, 'school_bell', .4], [at(7, '8') - .1, 'pop', .7], [at(7, 'rates'), 'error_beep', .4], [at(7, 'controle') - .15, 'pop_hi', .5], [at(7, 'maths'), 'scratch', .4]] });

// B008 — « Six sur vingt. » : crash zoom sur la copie, 6/20 entouré de rouge
B(8, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 4 }),
  draw: (t, d, T) => { const S6 = at(8, '6');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .35 }, { z: 1, svg: card(640, 860, 380, 460, kvExam(t, '6/20', seg(t, S6, S6 + .15)), t, -1, { ry: 0, thick: 10, r: -4, bw: 6 }) +
      kevinHead(250, 1040, 150, { expr: 'jawdrop', tilt: -8 }, t) }]) +
      kword('6/20', CX, 470, t, S6 - .05, { size: 150, fill: '#ff5c5c' }); },
  sfx: [[0, 'whoosh', .4], [at(8, '6') - .05, 'boom', .6], [at(8, 'sur'), 'scratch', .5], [at(8, 'sur') + .1, 'gasp', .5]] });

// B009 — « Normalement, tes parents devraient t'engueuler. » : salon, parents sur le canapé, bulle « ce qui devrait arriver »
const kvParents = (t, e1, e2, o = {}) => adult(0, { x: 640, y: 1440, s: 1.05, hair: 'side', mustache: true, glasses: false, expr: e1, look: [-1, 0], armL: o.paperL ? [-30, -10] : [110, 100], holdL: o.paperL || '' }, t) +
  adult(3, { x: 880, y: 1440, s: 1.05, hair: 'long', expr: e2, look: [-1, 0], armR: o.phoneR ? [-60, -100] : [70, 80], holdR: o.phoneR ? phone(0, -40, .4) : '' }, t + 1) + sofa(760, 1500, .95, '#5ec4a0');
const kvRageCloud = (t, k) => k <= 0 ? '' : G(tr(700, 680, k), cloud(0, 0, 2.2, '#fff', 7) + circ(-250, 190, 26, '#fff', 6) + circ(-300, 250, 16, '#fff', 5) +
  G(tr(-90, 0), head({ hr: 70, hair: 'side', hairColor: AC[0], mustache: true, skin: SK[2], expr: 'rage', seed: 60 }, t)) + G(tr(90, 0), head({ hr: 70, hair: 'long', hairColor: AC[3], skin: SK[5], expr: 'rage', seed: 63 }, t)));
B(9, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const No = at(9, 'normalement'), Pa = at(9, 'parents'), En = at(9, 'engueuler');
    return salonF(t) + WASH() + kvParents(t, 'neutral', 'neutral') + kvRageCloud(t, pop(t, Pa, .35)) +
      kevin({ x: 300, y: 1490, s: 1.3, expr: 'worried', armL: [-120, -150], holdL: G(tr(10, -80, .45, -8), rect(-170, -210, 340, 420, '#fff', 8, 6) + ftext(70, 160, '6/20', { size: 92, fill: '#e2463a', stroke: 'none' })) }, t) +
      funTag(330, 420, 'NORMALEMENT…', t, No - .05, { size: 46, bg: '#fff', fg: SX.ink, r: -5 }) + (t > En ? markerText('ENGUEULADE', 700, 920, t, En, { size: 44 }) : ''); },
  sfx: [[at(9, 'normalement'), 'pop_hi', .4], [at(9, 'parents'), 'pop', .5], [at(9, 'engueuler'), 'growl', .4], [at(9, 'engueuler') + .1, 'scratch', .4]] });

// B010 — « Mais non. Tu es Kevin. » : la bulle est barrée, papa lit le journal, maman sur son téléphone
B(10, { enter: 'none', cam: (t, d) => ({ z: lerp(1.05, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Mn = at(10, 'mais'), K = at(10, 'kevin');
    const news = G(tr(0, -40), rect(-110, -80, 220, 150, '#f4f1ea', 4, 5) + ftext(0, -40, 'JOURNAL', { size: 26, fill: OL, stroke: 'none' }) + [0, 1, 2].map(i => line(-90, -10 + i * 24, 90, -10 + i * 24, 4, '#9aa3ad')).join(''));
    return salonF(t) + WASH() + kvParents(t, 'deadpan', 'deadpan', { paperL: news, phoneR: 1 }) + (t < Mn + .3 ? kvRageCloud(t, 1 - seg(t, Mn + .1, Mn + .3)) : '') + (t < Mn + .5 ? cross(700, 680, 1.3, t, Mn) : '') +
      kevin({ x: 300, y: 1490, s: 1.3, expr: t > K ? 'confused' : 'worried', armL: [-120, -150], holdL: G(tr(10, -80, .45, -8), rect(-170, -210, 340, 420, '#fff', 8, 6) + ftext(70, 160, '6/20', { size: 92, fill: '#e2463a', stroke: 'none' })) }, t) +
      kword('MAIS NON.', CX, 430, t, Mn - .05, { size: 100, fill: '#fff' }) + funTag(CX, 590, 'TU ES KEVIN', t, K - .1, { size: 56, bg: KGREEN }); },
  sfx: [[at(10, 'mais') - .05, 'boom', .5], [at(10, 'mais') + .05, 'buzz', .4], [at(10, 'kevin') - .1, 'pop', .6], [at(10, 'kevin') + .2, 'crickets', .3]] });

// B011 — « TOUT LE MONDE S'Y ATTENDAIT. » : papa, maman, mamie brandissent des pancartes « 6/20 » (pari gagné)
B(11, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t < .3 ? 5 : 0 }),
  draw: (t, d, T) => { const To = at(11, 'tout'), Mo = at(11, 'monde'), At = at(11, 'attendait');
    const sign = (t0) => G(tr(0, -130, pop(t, t0, .3)), line(0, 130, 0, 0, 9, '#8a5a3a') + rect(-90, -70, 180, 110, '#fff', 12, 6) + ftext(0, 2, '6/20', { size: 44, fill: '#e2463a', stroke: 'none' }) + ftext(0, 32, 'prévu', { size: 20, fill: '#3a5bff', stroke: 'none' }));
    return salonF(t) + WASH() + adult(0, { x: 210, y: 1480, s: 1.1, hair: 'side', mustache: true, glasses: false, expr: 'smug', armR: [-80, -95], holdR: sign(To) }, t) +
      adult(3, { x: 540, y: 1480, s: 1.1, hair: 'long', expr: 'smugger', armR: [-80, -95], holdR: sign(Mo) }, t + 1) + grandma({ x: 870, y: 1480, s: 1.1, expr: 'deadpan', armR: [-80, -95], holdR: sign(Mo + .15) }, t + 2) +
      kword('TOUT LE MONDE', CX, 430, t, To - .05, { size: 92, fill: SX.acc2 }) + kthin("s'y attendait.", CX, 590, t, At - .15, { size: 60 }); },
  sfx: [[0, 'flash_hit', .4], [at(11, 'tout') - .05, 'boom', .6], [at(11, 'tout'), 'pop', .5], [at(11, 'monde'), 'pop', .5], [at(11, 'monde') + .15, 'pop', .5], [at(11, 'attendait'), 'rimshot', .5]] });

// B012 — « À quinze ans, tu tombes amoureux. » : cour, Kevin ado, yeux en cœur, il « tombe » littéralement (pencher + cœurs)
B(12, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const A15 = at(12, '15'), Tb = at(12, 'tombes'), Am = at(12, 'amoureux'), fall = eOutBack(seg(t, Tb, Tb + .4));
    return schoolyard(t) + WASH() + kid(3, { x: 790, y: 1490, s: 1.3, hair: 'ponytail', hairColor: '#e0a040', shirt: '#ff8fb1', expr: 'happy', flip: 1, armL: [200, 160 + Math.sin(t * 8) * 15] }, t) +
      kevin({ x: 300, y: 1490, s: 1.4, expr: t > Tb ? 'love' : 'happy', rot: -22 * fall, armL: [-150, -120], armR: [-30, -60] }, t) + (t > Am ? heartsUp(t, 330, 900, 5) : '') +
      funTag(CX, 430, '15 ANS', t, A15 - .1, { size: 90, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 430, t, A15, 6, 180) + kword('TU TOMBES AMOUREUX', CX, 590, t, Tb - .05, { size: 64, fill: '#ff8fb1' }); },
  sfx: [[0, 'whoosh', .4], [at(12, '15') - .1, 'pop', .7], [at(12, 'tombes'), 'boing', .5], [at(12, 'amoureux'), 'kiss', .5], [at(12, 'amoureux') + .1, 'sparkle', .4]] });

// B013 — « Elle te quitte. » : elle part, le cœur se casse en deux, Kevin en fontaine
B(13, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), shake: t < .3 ? 6 : 0 }),
  draw: (t, d, T) => { const Qu = at(13, 'quitte'), sp = seg(t, Qu - .1, Qu + .3) * 70;
    return schoolyard(t) + WASH('rgba(120,140,170,.18)') + kid(3, { x: 820 + t * 260, y: 1490, s: 1.3, hair: 'ponytail', hairColor: '#e0a040', shirt: '#ff8fb1', expr: 'deadpan', walk: 1 }, t) +
      kevin({ x: 300, y: 1490, s: 1.4, expr: 'sob' }, t) +
      G(tr(560 - sp, 820, 1, -sp * .3), path('M0 30C-40 0 -50 -20 -40 -38C-30 -54 -8 -50 0 -32L-10 -10L6 6Z', '#ff5d73', 5).replace('<path', '<path transform="scale(2.4)"')) +
      G(tr(560 + sp, 820, 1, sp * .3), path('M0 30C40 0 50 -20 40 -38C30 -54 8 -50 0 -32L-10 -10L6 6Z', '#ff5d73', 5).replace('<path', '<path transform="scale(2.4)"')) +
      kword('ELLE TE QUITTE', CX, 470, t, .02, { size: 88, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [.02, 'boom', .5], [at(13, 'quitte') - .1, 'crack', .7], [at(13, 'quitte') + .1, 'steps', .4]] });

// B014 — « À dix-huit ans, tu passes ton permis. » : rue, voiture d'auto-école, Kevin adulte avec les clés
B(14, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const A18 = at(14, '18'), Pe = at(14, 'permis');
    const keys = G(tr(0, -20, 1, Math.sin(t * 14) * 20), line(0, 0, 0, 30, 5) + circ(0, 40, 14, 'none', 6, '#ffd23f') + rect(-6, 50, 12, 40, '#c9d3dc', 3, 4));
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .1 },
      { z: 1, svg: dCar(720, 1330, 1.3, '#e2463a', 1) + G(tr(720, 1030), rect(-110, -40, 220, 56, '#fff', 12, 6) + ftext(0, 0, 'AUTO-ÉCOLE', { size: 26, fill: '#e2463a', stroke: 'none' })) +
        kvAdult({ x: 290, y: 1490, s: 1.2, expr: 'ecstatic', armR: [-70, -100], holdR: keys }, t) },
      { z: .6, svg: blur(10, dBush(80, 1900, 1.6)) }]) +
      funTag(CX, 430, '18 ANS', t, A18 - .1, { size: 90, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 430, t, A18, 6, 180) + kthin('tu passes ton permis', CX, 600, t, Pe - .3, { size: 56 }); },
  sfx: [[0, 'whoosh', .4], [at(14, '18') - .1, 'pop', .7], [at(14, 'passes'), 'coins', .3], [at(14, 'permis'), 'ding', .5]] });

// B015 — « Même le moniteur attache sa ceinture avant de démarrer le moteur. » : vue pare-brise, le moniteur boucle 3 ceintures + casque
B(15, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3, shake: t > at(15, 'moteur') ? 5 : 0 }),
  draw: (t, d, T) => { const Mo = at(15, 'moniteur'), Bt = [at(15, 'attache'), at(15, 'ceinture'), at(15, 'avant')], Dm = at(15, 'demarrer'), Mt = at(15, 'moteur');
    const nb = Bt.filter(x => t > x).length;
    const belts = Bt.map((x, i) => { const k = eOutCubic(seg(t, x, x + .2)); if (k <= 0) return ''; const a = [[690, 1000, 850, 1150], [830, 1000, 670, 1150], [650, 1090, 870, 1095]][i]; return line(a[0], a[1], lerp(a[0], a[2], k), lerp(a[1], a[3], k), 34) + line(a[0], a[1], lerp(a[0], a[2], k), lerp(a[1], a[3], k), 22, '#5a5f6a'); }).join('');
    const helmet = t > Dm ? G(tr(760, 880 - 60 * (1 - eOutBack(seg(t, Dm, Dm + .3)))), path('M-110 -40Q-110 -150 0 -150Q110 -150 110 -40Z', '#ffd23f', 7) + rect(-116, -50, 232, 24, '#e2463a', 10, 5)) : '';
    const inside = kvAdult({ x: 300, y: 1400, s: 1.2, expr: 'happy', armL: [60, -10], armR: [80, 10] }, t) + adult(2, { x: 760, y: 1400, s: 1.2, hair: 'bald', mustache: true, glasses: true, shirt: '#5b8fd8', expr: t > Mt ? 'terror' : t > Bt[0] ? 'scared' : 'worried', armL: [160, 220], armR: [20, -40] }, t) + belts + helmet;
    return kvCar(t, inside) + kvWheel(300, 1080, 1, Math.sin(t * 3) * 6) +
      funTag(CX, 400, 'LE MONITEUR', t, Mo - .1, { size: 44, bg: '#fff', fg: SX.ink, r: -4 }) + (nb ? funTag(820, 560, 'CEINTURE ×' + nb, t, Bt[0], { size: 40, bg: '#e2463a', r: 5 }) : '') +
      (t > Mt ? kword('VROUM…', 330, 600, t, Mt - .05, { size: 70, fill: SX.acc2 }) : ''); },
  sfx: [[at(15, 'moniteur') - .1, 'pop_hi', .4], [at(15, 'attache'), 'snip', .6], [at(15, 'ceinture'), 'snip', .6], [at(15, 'avant'), 'snip', .6], [at(15, 'demarrer'), 'boing', .4], [at(15, 'moteur'), 'growl', .5], [at(15, 'moteur') + .1, 'gasp', .5]] });

// B016a — « Mais le pire arrive » : chambre de nuit, orage par la fenêtre, LE PIRE
const O16 = at(16, 'quand') - .15;
B(16, { enter: 'none', trans: 'black', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3, shake: t > at(16, 'pire') ? 3 : 0 }),
  draw: (t, d, T) => { const Pi = at(16, 'pire'), fl = t > Pi && t < Pi + .25;
    return bedroomN(t) + WASH('rgba(10,10,40,.3)') + (fl ? lightning(800, 300, 1.2) : '') + kvDesk(560, 1290, 700) + kvLaptop(760, 1270, 1.0, rect(-190, -260, 380, 240, '#9fd0ff', 0, 0)) +
      kvAdult({ x: 300, y: 1500, s: 1.2, expr: t > Pi ? 'scared' : 'neutral', look: [1, 0] }, t) + op(.3, glow(700, 1100, 300, '#9fd0ff', .6)) +
      kthin('mais…', CX, 420, t, at(16, 'mais') - .05, { size: 60 }) + kword('LE PIRE', CX, 560, t, Pi - .05, { size: 130, fill: '#ff5c5c' }) + kvFlash(t, Pi, .5); },
  sfx: [[at(16, 'mais'), 'sting', .4], [at(16, 'pire') - .05, 'thunder', .6], [at(16, 'pire'), 'boom', .4], [at(16, 'arrive'), 'wind', .3]] });
// B016b — « …quand tu découvres cette chaîne YouTube. » : grand écran, page de la chaîne « Pourquoi c'est horrible… »
B(16, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Dc = at(16, 'decouvres') - O16, Ch = at(16, 'chaine') - O16, Yt = at(16, 'youtube') - O16;
    const inner = rect(-450, -260, 900, 520, '#f4f1ea', 0, 0) + rect(-450, -260, 900, 150, SX.acc, 0, 0) + ftext(0, -170, "POURQUOI C'EST HORRIBLE…", { size: 44, fill: '#fff' }) +
      circ(-340, -100, 60, '#fff', 6) + ftext(-340, -82, '?', { size: 60, fill: SX.acc, stroke: 'none' }) + ftext(-260, -70, '2,4 M abonnés', { size: 26, fill: '#7d848c', stroke: 'none', anchor: 'start' }) +
      G(tr(300, -80), rect(-100, -30, 200, 60, '#e2463a', 30, 5) + ftext(0, 11, "S'ABONNER", { size: 26, fill: '#fff', stroke: 'none' })) +
      ['chauve', 'cernes', 'acne'].map((k, i) => G(tr(-290 + i * 290, 110, pop(t, Dc + i * .12, .3)), kvThumb(k, 260, 146, t + i))).join('');
    return kvWatch(t, inner, { p: .02 }) + kthin('cette chaîne…', CX, 400, t, Ch - .2, { size: 54 }) + kword('YOUTUBE', CX, 490, t, Yt - .05, { size: 100, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(16, 'decouvres') - O16, 'pop_hi', .4], [at(16, 'decouvres') - O16 + .12, 'pop_hi', .4], [at(16, 'chaine') - O16 - .1, 'pop', .5], [at(16, 'youtube') - O16 - .05, 'boom', .4]] }, O16);

// B017 — « Un mec explique pourquoi c'est horrible d'être petit. » : la vidéo « PETIT »
B(17, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ex = at(17, 'explique'), Pe = at(17, 'petit');
    return kvWatch(t, kvThumb('petit', PW, PH, t), { title: "Pourquoi c'est horrible d'être petit ?" }) +
      kthin('un mec explique…', CX, 400, t, Ex - .2, { size: 54 }) + funTag(CX, 480, 'PETIT', t, Pe - .05, { size: 70, bg: SX.acc2, fg: SX.ink, r: 4 }) + popStars(CX, 480, t, Pe, 6, 200); },
  sfx: [[0, 'whoosh', .4], [at(17, 'explique') + .05, 'pop_hi', .4], [at(17, 'petit') - .05, 'pop', .6], [at(17, 'petit'), 'sparkle', .4]] });

// B018 — « DEVINE QUI SE FAIT MOQUER ? KEVIN. » : dans la vidéo, Kevin au bonnet d'âne pointé du doigt → KEVIN.
const kvDunce = (x, y, s = 1) => G(tr(x, y, s, -8), path('M-60 0L0 -150L60 0Z', '#fff', 6) + ftext(0, -20, 'ÂNE', { size: 26, fill: '#e2463a', stroke: 'none' }));
B(18, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(18, 'kevin') ? 6 : 0 }),
  draw: (t, d, T) => { const Dv = at(18, 'devine'), Mq = at(18, 'moquer'), K = at(18, 'kevin');
    const inner = inYard(t) + kid(1, { x: -330, y: 250, s: .62, expr: 'mock', armR: [-10, -10] }, t) + kid(4, { x: -150, y: 250, s: .62, expr: 'mock', armR: [-15, -5] }, t + 1) +
      person({ age: 'kid', x: 20, y: 250, s: .45, hair: 'short', hairColor: '#4a3428', shirt: '#ff9a4d', skin: SK[1], expr: 'laugh', seed: 40 }, t) +
      kevin({ x: 260, y: 250, s: .62, expr: 'sob' }, t) + kvDunce(260, 250 - .62 * 292 - 50, .7) + (t > Mq ? ftext(-240, -150, 'HA HA !', { size: 44, fill: SX.acc2 }) : '');
    return kvWatch(t, inner) + kthin('devine qui se fait', CX, 400, t, Dv - .05, { size: 54, out: K - .1 }) + kword('MOQUER ?', CX, 490, t, Mq - .05, { size: 90, fill: SX.acc2, op: t > K ? 0 : 1 }) + kvSlam(t, K); },
  sfx: [[0, 'flash_hit', .4], [at(18, 'devine'), 'pop_hi', .4], [at(18, 'moquer') - .05, 'boom', .4], [at(18, 'moquer') + .1, 'hmm', .3], [at(18, 'kevin') - .05, 'boom', .7], [at(18, 'kevin') + .2, 'rimshot', .5]] });

// B019 — « Il explique l'insomnie. » : la vidéo « INSOMNIE »
B(19, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .2 }),
  draw: (t, d, T) => { const In = at(19, 'insomnie');
    return kvWatch(t, kvThumb('insomnie', PW, PH, t), { title: "Pourquoi c'est horrible d'avoir des insomnies ?" }) +
      kthin('il explique', CX, 400, t, 0, { size: 54 }) + funTag(CX, 480, "L'INSOMNIE", t, In - .05, { size: 66, bg: '#5a5fb0', r: -4 }) + popStars(CX, 480, t, In, 6, 200); },
  sfx: [[0, 'whoosh', .4], [at(19, 'insomnie') - .05, 'pop', .6], [at(19, 'insomnie'), 'clock_fast', .3]] });

// B020 — « QUI APPELLE À TROIS HEURES DU MATIN ? KEVIN. » : dans la vidéo, 03:00, le téléphone vibre, appel de Kevin → KEVIN.
B(20, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(20, 'kevin') ? 6 : 0 }),
  draw: (t, d, T) => { const Ap = at(20, 'appelle'), H3 = at(20, '3h'), K = at(20, 'kevin'), vib = t > Ap ? Math.sin(t * 70) * 6 : 0;
    const call = G(tr(160 + vib, 40, 1, -8), rect(-90, -160, 180, 300, '#2b2b33', 26, 6) + rect(-76, -140, 152, 260, '#7be07b', 12, 0) + G(tr(0, -60), head({ hr: 44, hair: 'spiky', hairColor: ROUX, freckles: true, expr: 'happy', seed: 3 }, t)) + ftext(0, 30, 'KEVIN', { size: 32, fill: '#fff' }) + ftext(0, 70, 'appel…', { size: 22, fill: '#fff', stroke: 'none' }));
    const inner = inNight(t) + G(tr(-180, 160), rect(-200, -40, 400, 120, '#8a6ad8', 16, 6) + rect(-190, -70, 140, 50, '#fff', 20, 5)) + G(tr(-260, 70), head({ hr: 70, hair: 'curly', hairColor: '#2b2420', skin: SK[0], expr: 'pain', seed: 41 }, t)) +
      (t > H3 ? bigClockF(-60, -150, '03:00', '#ff5c5c', .55) : '') + (t > Ap ? call : '');
    return kvWatch(t, inner) + kthin('qui appelle à', CX, 400, t, Ap - .1, { size: 54, out: K - .1 }) + kword('3 H DU MATIN ?', CX, 490, t, H3 - .05, { size: 84, fill: SX.acc2, op: t > K ? 0 : 1 }) + kvSlam(t, K); },
  sfx: [[0, 'flash_hit', .4], [at(20, 'appelle'), 'ring', .5], [at(20, 'appelle') + .1, 'vibrate', .4], [at(20, '3h') - .05, 'boom', .4], [at(20, 'kevin') - .05, 'boom', .7], [at(20, 'kevin') + .2, 'rimshot', .5]] });

// B021 — « Il explique pourquoi c'est horrible d'être pauvre. » : la vidéo « PAUVRE »
B(21, { enter: 'none', trans: 'glitch', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pv = at(21, 'pauvre');
    return kvWatch(t, kvThumb('pauvre', PW, PH, t), { title: "Pourquoi c'est horrible d'être le pote pauvre ?" }) +
      kthin('il explique', CX, 400, t, 0, { size: 54 }) + funTag(CX, 480, 'PAUVRE', t, Pv - .05, { size: 70, bg: SX.acc2, fg: SX.ink, r: 4 }) + popStars(CX, 480, t, Pv, 6, 200); },
  sfx: [[0, 'whoosh', .4], [at(21, 'pourquoi'), 'pop_hi', .4], [at(21, 'pauvre') - .05, 'pop', .6], [at(21, 'pauvre'), 'coins', .4]] });

// B022 — « QUI DOIT ENCORE QUARANTE EUROS ? KEVIN. » : dans la vidéo, Kevin siffle, la reconnaissance de dette « 40 € » → KEVIN.
B(22, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(22, 'kevin') ? 6 : 0 }),
  draw: (t, d, T) => { const Dt = at(22, 'doit'), E40 = at(22, '40'), K = at(22, 'kevin');
    const iou = G(tr(0, -30, 1, 6), rect(-120, -80, 240, 160, '#fff8e6', 6, 5) + ftext(0, -30, 'JE TE DOIS', { size: 28, fill: OL, stroke: 'none' }) + ftext(0, 40, counter(5, 40, t, E40, .5) + ' €', { size: 60, fill: '#e2463a', stroke: 'none' }));
    const inner = grad('#ffe08a', '#ffb03a', -460, -260, 920, 520) + rect(-460, 130, 920, 140, '#c58e55', 0, 0) +
      person({ age: 'kid', x: -250, y: 250, s: .62, hair: 'bun', hairColor: '#8a5a3a', shirt: '#5ec4a0', skin: SK[3], expr: 'annoyed', look: [1, 0], armR: [-20, -30], seed: 42 }, t) +
      kevin({ x: 230, y: 250, s: .62, expr: 'smugger', look: [1, -1], flip: 1 }, t) + (t > Dt ? G(tr(60, -120, pop(t, Dt, .3)), iou) : '') + ftext(330, -110, '♪', { size: 50, fill: '#fff' });
    return kvWatch(t, inner) + kthin('qui doit encore', CX, 400, t, Dt - .15, { size: 54, out: K - .1 }) + kword('40 € ?', CX, 490, t, E40 - .05, { size: 100, fill: SX.acc2, op: t > K ? 0 : 1 }) + kvSlam(t, K); },
  sfx: [[0, 'flash_hit', .4], [at(22, 'doit'), 'pop', .5], [at(22, '40'), 'kaching', .5], [at(22, '40') + .2, 'whistle', .3], [at(22, 'kevin') - .05, 'boom', .7], [at(22, 'kevin') + .2, 'rimshot', .5]] });

// B023 — « FRÈRE, J'AI MÊME PAS SIGNÉ DE CONTRAT ! » : face caméra, Kevin furieux brandit un contrat vierge
B(23, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 3 + (t > at(23, 'contrat') ? 5 : 0) }),
  draw: (t, d, T) => { const Fr = at(23, 'frere'), Si = at(23, 'signe'), Co = at(23, 'contrat');
    const contract = ftext(0, -130, 'CONTRAT', { size: 36, fill: OL, stroke: 'none' }) + [0, 1, 2, 3].map(i => line(-100, -80 + i * 34, 100, -80 + i * 34, 4, '#9aa3ad')).join('') + ftext(-100, 90, 'Signature :', { size: 22, fill: OL, stroke: 'none', anchor: 'start' }) + line(-100, 130, 100, 130, 4, OL);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .3 }, { z: 1, svg: kevinHead(430, 990, 220, { expr: 'rage', tilt: -6 + Math.sin(t * 20) * 2 }, t) }]) +
      card(850, 960, 280, 340, contract, t, Si - .2, { ry: 0, thick: 10, r: 6, bw: 6 }) + cross(850, 1060, .8, t, Co) +
      kword('FRÈRE,', CX, 420, t, Fr - .05, { size: 96, fill: '#fff' }) + kthin("j'ai même pas signé", CX, 590, t, Si - .3, { size: 56 }) + funTag(850, 760, 'DE CONTRAT !', t, Co - .05, { size: 40, bg: '#e2463a', r: 6 }); },
  sfx: [[0, 'flash_hit', .4], [at(23, 'frere') - .05, 'boom', .6], [at(23, 'signe') - .2, 'pop', .5], [at(23, 'contrat') - .05, 'thud', .7], [at(23, 'contrat'), 'buzz', .4]] });

// B024 — « Et un jour, miracle. » : rayons dorés, auréole, un téléphone descend du ciel avec une notif
B(24, { enter: 'none', trans: 'circle', transD: .25, cam: () => ({ z: 1.04, hand: .2 }),
  draw: (t, d, T) => { const Jo = at(24, 'jour'), Mi = at(24, 'miracle'), dy = 300 * (1 - eOutCubic(seg(t, Mi - .2, Mi + .4)));
    const notif = G(tr(780, 860 - dy, 1, 6), op(.5, glow(0, 0, 220, '#fff6a0', .9)) + phone(0, 0, 1.1, 0, rect(-66, -128, 132, 250, '#fff', 12, 0) + rect(-60, -110, 120, 60, SX.acc, 10, 0) + ftext(0, -72, '1 notif', { size: 20, fill: '#fff', stroke: 'none' }) + heart(0, 30, .8)));
    return rays(t, CX, 950, '#ffe680', '#ffc93a', 22) + cutout(kvAdult({ x: 330, y: 1480, s: 1.15, expr: t > Mi ? 'wow' : 'neutral', look: [1, -1] }, t) + G(tr(330, 1480 - 1.15 * 402 - 150), ell(0, 0, 80, 22, 'none', 12, '#ffd23f')), 10) +
      (t > Mi - .2 ? notif : '') + kthin('et un jour,', CX, 420, t, Jo - .15, { size: 60, fill: '#fff' }) + kword('MIRACLE', CX, 560, t, Mi - .05, { size: 130, fill: '#fff' }) + popStars(780, 860, t, Mi + .3, 8, 240); },
  sfx: [[at(24, 'jour'), 'pop_hi', .4], [at(24, 'miracle') - .2, 'angel', .6], [at(24, 'miracle') - .05, 'boom', .3], [at(24, 'miracle') + .3, 'ding', .5]] });

// B025 — « Les abonnés réclament enfin un épisode sur toi. » : manif dans la rue, pancartes « ON VEUT KEVIN »
B(25, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const Ab = at(25, 'abonnes'), Rc = at(25, 'reclament'), Ep = at(25, 'episode');
    const sign = (str, c, ph) => G(tr(0, -60, 1, Math.sin(t * 7 + ph) * 8), line(0, 60, 0, -150, 9, '#8a5a3a') + rect(-120, -220, 240, 100, c, 12, 6) + ftext(0, -158, str, { size: 34, fill: '#fff' }));
    const ppl = [[150, 'ON VEUT', 0], [400, 'KEVIN !', 1], [660, 'ÉPISODE', 2], [920, 'KEVIN ♥', 3]].map(([x, s, i]) => { const jump = Math.abs(Math.sin(t * 7 + i)) * 20 * (t > Rc ? 1 : 0);
      return (i % 2 ? kid(i + 1, { x, y: 1490 - jump, s: 1.1, expr: 'angry', face: { mouth: 'scream' }, armR: [-80, -95], holdR: sign(s, DPAL[i * 2 % 8], i) }, t + i) : adult(i + 1, { x, y: 1490 - jump, s: 1.0, expr: 'angry', face: { mouth: 'scream' }, armR: [-80, -95], holdR: sign(s, DPAL[i * 2 % 8], i) }, t + i)); }).join('');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .1 }, { z: 1, svg: ppl }, { z: .6, svg: blur(10, dLampPost(1040, 1950, 1.6)) }]) +
      funTag(CX, 410, 'LES ABONNÉS', t, Ab - .1, { size: 50, bg: KGREEN, r: -4 }) + kword('UN ÉPISODE SUR TOI', CX, 540, t, Ep - .05, { size: 66, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(25, 'abonnes') - .1, 'pop', .5], [at(25, 'reclament'), 'whistle', .4], [at(25, 'reclament') + .1, 'drum', .5], [at(25, 'episode') - .05, 'boom', .4]] });

// B026 — « Tu souris. » : gros plan, le sourire pousse, éclat sur les dents
B(26, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const So = at(26, 'souris');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2), haze: .35 }, { z: 1, svg: kevinHead(CX, 980, 230, { expr: t > So ? 'happy' : 'neutral', face: t > So ? { blush: 1 } : {} }, t) }]) +
      (t > So ? sparkle(640, 1050, .9 + .2 * Math.sin(t * 20), '#fff') : '') + kthin('tu souris.', CX, 440, t, 0, { size: 66 }); },
  sfx: [[at(26, 'souris'), 'glint', .6], [at(26, 'souris') + .05, 'sparkle', .4]] });

// B027 — « ENFIN ! JE SUIS LE PERSONNAGE PRINCIPAL ! » : scène, tapis rouge, projecteur, flashs des paparazzis, débloqué (2/3)
B(27, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const En = at(27, 'enfin'), Pe = at(27, 'personnage'), Pr = at(27, 'principal');
    let flashes = ''; for (let i = 0; i < 6; i++) { const ph = (t * 2.3 + i * .37) % 1; if (ph < .12) flashes += op(1 - ph / .12, G(tr([140, 960, 220, 880, 120, 990][i], [800, 760, 1050, 1000, 620, 600][i]), circ(0, 0, 60, '#fff', 0) + impactStar(0, 0, .5))); }
    const carpet = path('M420 1060L660 1060L900 1920L180 1920Z', '#d6334a', 6) + path('M440 1060L640 1060', 'none', 6, '#ffd23f') + [-1, 1].map(sd => [0, 1, 2].map(i => { const x = CX + sd * (180 + i * 90), y = 1150 + i * 150; return rect(x - 8, y - 110, 16, 110, '#ffd23f', 4, 4) + circ(x, y - 116, 14, '#ffd23f', 4); }).join('') + path(`M${CX + sd * 180} 1050Q${CX + sd * 225} 1100 ${CX + sd * 270} 1200Q${CX + sd * 315} 1250 ${CX + sd * 360} 1350`, 'none', 10, '#7a1428')).join('');
    return kvStage(t, { neon: 'STAR' }) + carpet + op(.35, path('M540 120L330 1500L750 1500Z', '#fff6c8', 0)) + unlock(CX, 950, t, Pe, { part: 'back', r: 470 }) +
      kvAdult({ x: CX, y: 1460, s: 1.2, expr: 'ecstatic', armL: [-140, -110], armR: [-40, -70] }, t) + flashes + unlock(CX, 950, t, Pe, { part: 'front', r: 470 }) +
      kword('ENFIN !', CX, 420, t, En - .05, { size: 110, fill: SX.acc2 }) + kword('PERSONNAGE PRINCIPAL', CX, 570, t, Pe - .05, { size: 64, fill: '#fff' }) + funTag(850, 800, 'HÉROS', t, Pr, { size: 44, bg: SX.acc2, fg: SX.ink, r: 8 }); },
  sfx: [[0, 'flash_hit', .4], [at(27, 'enfin') - .05, 'boom', .6], [at(27, 'suis'), 'shutter', .5], [at(27, 'personnage') - .05, 'tada', .6], [at(27, 'personnage'), 'sparkle', .5], [at(27, 'principal'), 'shutter', .5], [at(27, 'principal') + .3, 'jackpot', .3]] });

// B028a — « Sauf qu'en regardant tes anciennes apparitions, » : chambre, Kevin devant son ordi, grille de miniatures
const O28 = at(28, 'remarques') - .2;
const kvGrid = (t, n0 = 0) => rect(-190, -260, 380, 240, '#f4f1ea', 0, 0) + [0, 1, 2, 3, 4, 5].map(i => G(tr(-120 + (i % 3) * 120, -200 + Math.floor(i / 3) * 90 - ((t * 30) % 90)), kvThumb(BOARD.keys[(i + n0) % 9], 108, 62, t + i))).join('') + [6, 7, 8].map(i => G(tr(-120 + (i % 3) * 120, -200 + 180 - ((t * 30) % 90)), kvThumb(BOARD.keys[i % 9], 108, 62, t + i))).join('');
B(28, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Sa = at(28, 'sauf'), An = at(28, 'anciennes');
    return bedroomN(t) + WASH() + kvDesk(640, 1290, 760) + kvLaptop(760, 1270, 1.05, kvGrid(t)) + op(.25, glow(760, 1130, 260, '#bfe3ff', .6)) + dMug(980, 1270, 1, t, '#ff8fb1') +
      kvAdult({ x: 290, y: 1500, s: 1.2, expr: 'suspicious', look: [1, 0] }, t) +
      kthin("sauf qu'en regardant", CX, 420, t, Sa - .05, { size: 56 }) + funTag(CX, 560, 'TES ANCIENNES APPARITIONS', t, An - .1, { size: 38, bg: KGREEN, r: -3 }); },
  sfx: [[at(28, 'sauf'), 'pop_hi', .4], [at(28, 'regardant'), 'typing', .4], [at(28, 'anciennes') - .1, 'pop', .5], [at(28, 'apparitions'), 'scratch', .3]] });
// B028b — « …tu remarques quelque chose. » : plein écran, la loupe passe sur les miniatures… le même figurant partout
B(28, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Rm = at(28, 'remarques') - O28, Qc = at(28, 'quelque') - O28;
    const pos = [[300, 680], [780, 680], [300, 950], [780, 950]], keys = ['petit', 'barbe', 'cernes', 'oreilles'], tw = 420, th = 236;
    const mk = Math.min(3, Math.floor(seg(t, Rm, d) * 4)), [mx, my] = pos[mk], kx = mx + tw * .3, ky = my + th * .2;
    return bedroomN(t) + WASH('rgba(10,10,40,.35)') + rect(50, 520, 980, 600, '#3a3f4a', 26, 8) + rect(70, 540, 940, 560, '#eef4ff', 10, 0) +
      pos.map(([x, y], i) => G(tr(x, y), kvThumb(keys[i], tw, th, t + i))).join('') +
      pos.map(([x, y], i) => i <= mk && t > Rm ? markerCircle(x + tw * .3, y + th * .2, 66, 66, t, Rm + i * (d - Rm) / 4, { col: '#e2463a' }) : '').join('') +
      (t > Rm - .1 ? magnifier(kx + 30, ky + 20, .75, 0) : '') +
      kthin('tu remarques', CX, 410, t, Rm - .1, { size: 50 }) + kword('QUELQUE CHOSE…', CX, 470, t, Qc - .05, { size: 70, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(28, 'remarques') - O28, 'hmm', .5], [at(28, 'quelque') - O28 - .05, 'boom', .4], [at(28, 'chose') - O28, 'scratch', .5]] }, O28);

// B029 — « À chaque vidéo, les autres vivent une histoire différente. » : mur en liège, les miniatures s'épinglent une à une
B(29, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ch = at(29, 'chaque'), Df = at(29, 'differente'), step = (Df - Ch) / 9;
    return kvBoard(t, { show: i => Ch + i * step }) + kthin('à chaque vidéo, les autres vivent', CX, 400, t, Ch - .1, { size: 46 }) + (t > Df ? funTag(CX, 1110, 'UNE HISTOIRE DIFFÉRENTE', t, Df - .05, { size: 40, bg: SX.acc2, fg: SX.ink, r: -2 }) : ''); },
  sfx: [[at(29, 'chaque') + .0, 'pop', .4], [at(29, 'video'), 'pop', .4], [at(29, 'autres'), 'pop', .4], [at(29, 'vivent'), 'pop', .4], [at(29, 'histoire'), 'pop', .4], [at(29, 'differente') - .05, 'pop_hi', .5]] });

// B030 — « Mais toi… Tu es toujours là. » : Kevin est entouré au marqueur dans CHAQUE miniature
B(30, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const To = at(30, 'toi'), Tj = at(30, 'toujours'), step = .07;
    return kvBoard(t) + BOARD.keys.map((k, i) => { const [x, y] = bKev(i); return markerCircle(x, y, 50, 50, t, To + i * step, { col: '#e2463a', w: 12 }); }).join('') +
      kword('MAIS TOI…', CX, 400, t, at(30, 'mais') - .05, { size: 80, fill: '#fff', op: t > Tj ? 0 : 1 }) + kword('TOUJOURS LÀ', CX, 400, t, Tj - .05, { size: 86, fill: SX.acc2 }); },
  sfx: [[at(30, 'mais') - .05, 'sting', .5], [at(30, 'toi'), 'scratch', .5], [at(30, 'toi') + .3, 'scratch', .4], [at(30, 'toujours') - .05, 'boom', .4]] });

// B031 — « Toujours le même prénom. » : une étiquette « KEVIN » se colle sous chaque figurant
B(31, { enter: 'none', cam: (t, d) => ({ z: lerp(1.08, 1.12, t / d), hand: .3 }),
  draw: (t, d, T) => { const Me = at(31, 'meme'), Pr = at(31, 'prenom');
    return kvBoard(t) + BOARD.keys.map((k, i) => { const [x, y] = bKev(i); return markerCircle(x, y, 50, 50, t, -1, { col: '#e2463a', w: 12 }) + funTag(x, y + 62, 'KEVIN', t, Me + i * .06, { size: 20, bg: KGREEN, r: (i % 2 ? 6 : -6) }); }).join('') +
      kthin('toujours le', CX, 400, t, 0, { size: 50, out: Pr - .1 }) + kword('MÊME PRÉNOM', CX, 400, t, Pr - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[at(31, 'meme'), 'pop_hi', .4], [at(31, 'meme') + .2, 'pop_hi', .4], [at(31, 'meme') + .4, 'pop_hi', .4], [at(31, 'prenom') - .05, 'boom', .5]] });

// B032 — « Toujours le même idiot. » : façon complot, une photo de Kevin « IDIOT » au centre, fils rouges vers tous les figurants
B(32, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), shake: t < .3 ? 4 : 0 }),
  draw: (t, d, T) => { const Me = at(32, 'meme'), Id = at(32, 'idiot'), cx = 540, cy = 760;
    const strings = BOARD.keys.map((k, i) => { if (i === 4) return ''; const [x, y] = bKev(i), kk = eOutCubic(seg(t, Me + i * .05, Me + i * .05 + .25)); return kk > 0 ? line(cx, cy, lerp(cx, x, kk), lerp(cy, y, kk), 7, '#e2463a') + circ(x, y, 10, '#e2463a', 3) : ''; }).join('');
    const photo = G(tr(cx, cy, pop(t, .05, .35), -4), rect(-150, -170, 300, 340, '#fff', 8, 6) + rect(-130, -150, 260, 240, '#bfe3ff', 4, 4) + G(tr(0, -20), kevinHead(0, 0, 90, { expr: 'dizzy' }, t)) + kvNose(0, -10, 14) + ftext(0, 140, 'KEVIN', { size: 40, fill: OL, stroke: 'none' }) + circ(0, -170, 14, '#e2463a', 4));
    return kvBoard(t) + strings + photo + stamp(cx + 40, cy + 40, 'IDIOT', t, Id - .05, '#e2463a', -14, 72) +
      kthin('toujours le', CX, 400, t, 0, { size: 50, out: Id - .1 }) + kword('MÊME IDIOT', CX, 400, t, Id - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .3], [at(32, 'meme'), 'whoosh', .4], [at(32, 'meme') + .2, 'tick', .4], [at(32, 'idiot') - .05, 'thud', .7], [at(32, 'idiot'), 'rimshot', .4]] });

// B033 — « Et tu réalises un truc horrible. » : gros plan, Kevin réalise (vertigo, traits de vitesse)
B(33, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.14, eInOut(t / d)), r: lerp(0, -4, t / d) }),
  draw: (t, d, T) => { const Re = at(33, 'realises'), Ho = at(33, 'horrible');
    return depth({ zoom: 1 - .1 * seg(t, 0, d) }, [{ z: 1.5, svg: bedroomN(t), haze: .4 }]) + (t > Re ? speedLines(t, CX, 980, 26, 'rgba(255,255,255,.4)') : '') +
      kevinHead(CX, 990, 230, { expr: t > Ho ? 'terror' : t > Re ? 'shock' : 'neutral' }, t) +
      kthin('et tu réalises', CX, 420, t, Re - .2, { size: 58 }) + kword('UN TRUC HORRIBLE', CX, 570, t, Ho - .05, { size: 76, fill: '#ff5c5c' }); },
  sfx: [[0, 'whoosh', .4], [at(33, 'realises'), 'whoosh_up', .5], [at(33, 'truc'), 'heartbeat', .5], [at(33, 'horrible') - .05, 'sting', .6]] });

// B034 — « TU N'ES PAS UN PERSONNAGE. » : grille, Kevin cut-out, « FICHE PERSONNAGE » barrée
B(34, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 3 }),
  draw: (t, d, T) => { const Pa = at(34, 'pas'), Pe = at(34, 'personnage');
    const sheet = ftext(0, -150, 'FICHE', { size: 34, fill: OL, stroke: 'none' }) + ftext(0, -110, 'PERSONNAGE', { size: 34, fill: OL, stroke: 'none' }) + G(tr(0, -10), kevinHead(0, 0, 60, { expr: 'happy' }, t)) +
      ftext(-130, 100, 'Rôle : héros', { size: 28, fill: '#3a5bff', stroke: 'none', anchor: 'start' }) + ftext(-130, 150, 'Histoire : oui', { size: 28, fill: '#3a5bff', stroke: 'none', anchor: 'start' });
    return gridBg('#3a1420', 'rgba(255,255,255,.07)') + halftoneFade('#fff', .05, 1) + burst(300, 1000, 280, t, Pa, SX.acc, 16) + cutout(kevin({ x: 300, y: 1470, s: 1.3, expr: 'sob' }, t), 12) +
      card(770, 900, 360, 420, sheet, t, .02, { ry: 0, thick: 10, r: 4, bw: 6 }) + cross(770, 900, 1.6, t, Pe) +
      kword('PAS UN PERSONNAGE', CX, 450, t, Pa - .05, { size: 72, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .5], [at(34, 'pas') - .05, 'boom', .6], [at(34, 'personnage'), 'buzz', .5], [at(34, 'personnage') + .05, 'thud', .6]] });

// B035 — « TU ES UNE BLAGUE QUI REVIENT À CHAQUE ÉPISODE. » : scène comique, Kevin diable-en-boîte avec nez rouge, ba-dum-tss
B(35, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bl = at(35, 'blague'), Rv = at(35, 'revient'), Ep = at(35, 'episode'), Ch = at(35, 'chaque');
    const up = eOutBack(seg(t, Bl - .15, Bl + .2)), bob = (t > Bl + .2 ? Math.sin((t - Bl) * 14) * 30 * Math.exp(-(t - Bl) * 1.5) : 0) + (t > Rv ? Math.abs(Math.sin((t - Rv) * 8)) * -20 : 0), yf = 1170 + (1 - up) * 520 + bob;
    let spring = ''; for (let i = 0; i < 8; i++) spring += (i ? 'L' : 'M') + (CX + (i % 2 ? 40 : -40)) + ' ' + f1(lerp(1180, yf - 40, i / 7));
    const box = G(tr(CX, 1170), path('M-170 0L-200 -70L200 -70L170 0Z', '#e2463a', 7) + rect(-170, 0, 340, 260, '#ffd23f', 10, 7) + path('M-170 0L170 260M170 0L-170 260', 'none', 8, '#e2463a') + G(tr(170, -70, 1, 60 + 40 * up), rect(0, -10, 260, 20, '#e2463a', 6, 6)));
    const drum = G(tr(900, 1180), ell(0, 0, 90, 40, '#5b8fd8', 6) + rect(-90, 0, 180, 120, '#5b8fd8', 0, 6) + ell(0, 120, 90, 40, '#5b8fd8', 6) + line(60, -60, 60, -230, 7, '#9aa3ad') + G(tr(60, -230, 1, t > Ep ? -14 + Math.sin(t * 40) * 6 : -6), ell(0, 0, 90, 16, '#ffd23f', 5)));
    return kvStage(t, { neon: 'LOL', laugh: t > Bl }) + drum + (up > 0 ? path(spring, 'none', 12) : '') + kevin({ x: CX, y: yf, s: 1.15, expr: 'laugh', armL: [-150, -120], armR: [-30, -60] }, t) + kvNose(CX, yf - 1.15 * 292 + 18, 18) + box +
      kword('TU ES UNE BLAGUE', CX, 430, t, Bl - .1, { size: 82, fill: SX.acc2 }) + kthin('qui revient à chaque épisode', CX, 590, t, Rv - .1, { size: 46 }) +
      (t > Ch ? funTag(260, 760, 'ÉP. ' + counter(1, 42, t, Ch, .6), t, Ch, { size: 40, bg: KGREEN, r: -6 }) : '') + (t > Ep ? kvLol(820, 760, 1.1, -10) + kvLol(180, 980, .8, 12) : ''); },
  sfx: [[0, 'whoosh', .4], [at(35, 'blague') - .15, 'boing', .6], [at(35, 'blague') - .1, 'boom', .4], [at(35, 'revient'), 'boing', .4], [at(35, 'chaque'), 'slot', .4], [at(35, 'episode'), 'rimshot', .7]] });

// B036 — « Tu regardes directement la caméra. » : quatrième mur, viseur REC, Kevin tourne la tête vers nous
B(36, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Rg = at(36, 'regardes'), Ca = at(36, 'camera'), k = eOutCubic(seg(t, Rg, Rg + .4));
    const vf = [[120, 640], [960, 640]].map(([x], i) => '').join('') + path('M110 720L110 640L190 640M970 720L970 640L890 640M110 1080L110 1160L190 1160M970 1080L970 1160L890 1160', 'none', 10, '#fff') +
      op(Math.sin(t * 6) > 0 ? 1 : .2, circ(860, 1110, 16, '#ff2b2b', 4)) + ftext(900, 1122, 'REC', { size: 34, fill: '#fff', anchor: 'start' }) + line(510, 900, 570, 900, 4, 'rgba(255,255,255,.6)') + line(540, 870, 540, 930, 4, 'rgba(255,255,255,.6)');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .3 }, { z: 1, svg: kevinHead(CX, 940, 210, { expr: t > Ca ? 'deadpan' : 'neutral', look: [lerp(1.2, 0, k), 0], tilt: lerp(12, 0, k) }, t) }]) + vf +
      kthin('tu regardes directement', CX, 420, t, Rg - .1, { size: 54 }) + kword('LA CAMÉRA', CX, 560, t, Ca - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(36, 'regardes'), 'whoosh', .4], [at(36, 'directement'), 'shutter', .4], [at(36, 'camera') - .05, 'boom', .4], [at(36, 'camera') + .1, 'ding', .3]] });

// B037 — « Attendez… donc vous êtes des milliers à rire de moi ? » : très gros plan, compteur de vues, émojis qui rient
B(37, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const At = at(37, 'attendez'), Mi = at(37, 'milliers'), Ri = at(37, 'rire');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .38 }, { z: 1, svg: kevinHead(CX, 1010, 230, { expr: t > Mi ? 'shock' : 'confused', look: [0, 0] }, t) }]) +
      (t > Ri ? [[150, 820, -12], [960, 960, 10], [190, 1080, 8], [880, 1110, -8]].map(([x, y, r], i) => G(tr(x, y - Math.abs(Math.sin(t * 6 + i)) * 20, pop(t, Ri + i * .08, .3)), kvLol(0, 0, 1.2, r))).join('') : '') +
      (t > Mi ? funTag(830, 770, counter(1000, 2400000, t, Mi, .8).toLocaleString('fr-FR').replace(/ | /g, ' ') + ' VUES', t, Mi, { size: 28, bg: '#fff', fg: SX.ink, r: 6 }) : '') +
      kthin('attendez… donc vous êtes', CX, 410, t, At - .1, { size: 52 }) + kword('DES MILLIERS', CX, 540, t, Mi - .05, { size: 100, fill: SX.acc2 }) + kthin('à rire de moi ?', CX, 650, t, Ri - .1, { size: 50 }); },
  sfx: [[at(37, 'attendez'), 'scratch', .5], [at(37, 'milliers') - .05, 'boom', .4], [at(37, 'milliers'), 'slot', .4], [at(37, 'rire'), 'pop', .4], [at(37, 'moi'), 'pop', .4]] });

// B038 — « Silence. » : tout se fige, grisaille, grillons, une boule d'herbe passe
B(38, { enter: 'none', cam: () => ({ z: 1.08 }),
  draw: (t, d, T) => { const tx = lerp(-200, 1300, t / d);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .5 }, { z: 1, svg: kevinHead(CX, 1010, 230, { expr: 'deadpan' }, t) }]) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, '#6a6f7a', 0, 0)) +
      G(tr(tx, 1380, 1, t * 400), circ(0, 0, 70, 'none', 8, '#b8854f') + path('M-50 -30Q0 20 50 -30M-40 40Q0 -10 40 40M-60 10L60 0', 'none', 6, '#b8854f')) +
      kthin('silence.', CX, 440, t, 0, { size: 66 }) + funTag(850, 760, '…', t, .1, { size: 60, bg: '#fff', fg: SX.ink }); },
  sfx: [[0, 'crickets', .7], [.1, 'wind', .3]] });

// B039 — « Puis tu souris. » : petit sourire tendre, éclat
B(39, { enter: 'none', cam: (t, d) => ({ z: lerp(1.08, 1.12, t / d) }),
  draw: (t, d, T) => { const So = at(39, 'souris');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .3 }, { z: 1, svg: kevinHead(CX, 1010, 230, { expr: t > So ? 'happy' : 'deadpan', face: t > So ? { blush: 1 } : {} }, t) }]) +
      (t > So ? sparkle(660, 1080, 1 + .2 * Math.sin(t * 20), '#fff') : '') + kthin('puis tu souris.', CX, 440, t, 0, { size: 62 }); },
  sfx: [[at(39, 'souris'), 'glint', .6], [at(39, 'souris') + .05, 'sparkle', .4]] });

// B040 — « Bon… au moins, vous connaissez mon prénom. » : badge « BONJOUR, JE M'APPELLE KEVIN », débloqué (3/3)
B(40, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Bo = at(40, 'bon'), Co = at(40, 'connaissez'), Pr = at(40, 'prenom');
    const badge = G(tr(CX + 10, 1130, pop(t, Co, .35), -6), rect(-130, -70, 260, 140, '#fff', 16, 6) + rect(-130, -70, 260, 50, '#e2463a', 16, 0) + rect(-130, -70, 260, 140, 'none', 16, 6) + ftext(0, -36, 'BONJOUR, JE M\'APPELLE', { size: 18, fill: '#fff', stroke: 'none' }) + ftext(0, 40, 'KEVIN', { size: 52, fill: OL, stroke: 'none' }));
    return bedroomN(t) + WASH() + unlock(CX, 1000, t, Pr, { part: 'back', r: 460 }) +
      kvAdult({ x: CX, y: 1460, s: 1.25, expr: t > Pr ? 'proud' : 'smugger', armR: [-30, 120] }, t) + badge + unlock(CX, 1000, t, Pr, { part: 'front', r: 460 }) +
      kthin('bon… au moins,', CX, 410, t, Bo - .1, { size: 54 }) + kthin('vous connaissez', CX, 500, t, Co - .15, { size: 54 }) + kword('MON PRÉNOM', CX, 610, t, Pr - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[at(40, 'bon'), 'hmm', .4], [at(40, 'connaissez'), 'pop', .5], [at(40, 'prenom') - .05, 'tada', .6], [at(40, 'prenom'), 'sparkle', .5]] });

// B041a — « Et maintenant que les abonnés t'ont enfin » : fête, banderole « BRAVO KEVIN », les abonnés offrent un cadeau
const O41 = at(41, 'donne') - .15;
B(41, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Mt = at(41, 'maintenant'), Ab = at(41, 'abonnes');
    const banner = G(tr(CX, 700), path('M-380 -60L380 -60L360 60L-360 60Z', SX.acc, 7) + ftext(0, 22, 'BRAVO KEVIN !', { size: 64, fill: '#fff' }));
    return partyT(t) + banner + kid(2, { x: 860, y: 1490, s: 1.1, expr: 'joy', flip: 1, armL: [-150, -120] }, t) + adult(4, { x: 680, y: 1490, s: 1.0, expr: 'happy', flip: 1 }, t + 1) +
      kvAdult({ x: 260, y: 1490, s: 1.2, expr: 'joy' }, t) + dGift(480, 1300, 1.5, SX.acc, '#ffd23f') + confetti(t, Ab, 30) +
      kthin('et maintenant que', CX, 420, t, Mt - .15, { size: 56 }) + funTag(CX, 550, 'LES ABONNÉS', t, Ab - .1, { size: 56, bg: KGREEN, r: -4 }); },
  sfx: [[0, 'whoosh', .4], [at(41, 'maintenant'), 'pop_hi', .4], [at(41, 'abonnes') - .1, 'pop', .5], [at(41, 'abonnes'), 'tada', .4], [at(41, 'enfin'), 'sparkle', .3]] });
// B041b — « …donné ton propre épisode… » : le cadeau s'ouvre → la miniature « KEVIN » (le héros, enfin !)
B(41, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Dn = at(41, 'donne') - O41, Pp = at(41, 'propre') - O41, Ep = at(41, 'episode') - O41;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: partyT(t), haze: .3 }]) + unlock(CX, 860, t, Pp, { part: 'back', r: 440, n: 10 }) +
      card(CX, 860, 620, 360, kvThumb('kevin', 600, 340, t), t, Dn + .05, { ry: 0, thick: 12, r: -3, bw: 6 }) + dGift(CX, 1260, 1.6, SX.acc, '#ffd23f') +
      kevinHead(170, 1090, 120, { expr: 'ecstatic' }, t) + kword('TON PROPRE ÉPISODE', CX, 450, t, Pp - .05, { size: 70, fill: SX.acc2 }) + (t > Ep ? popStars(CX, 860, t, Ep, 8, 360) : ''); },
  sfx: [[at(41, 'donne') - O41, 'magic', .5], [at(41, 'donne') - O41 + .05, 'pop', .6], [at(41, 'propre') - O41 - .05, 'boom', .4], [at(41, 'episode') - O41, 'sparkle', .5]] }, O41);

// B042a — « DEVINE QUI VA ENCORE SE FAIRE HUMILIER » : le sourire se fige, panique
const O42 = at(42, 'dans') - .15;
B(42, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), shake: t > at(42, 'humilier') ? 6 : 2 }),
  draw: (t, d, T) => { const Dv = at(42, 'devine'), En = at(42, 'encore'), Hu = at(42, 'humilier');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: partyT(t), haze: .35 }, { z: 1, svg: kevinHead(CX, 1000, 220, { expr: t > Hu ? 'terror' : t > En ? 'shock' : 'happy' }, t) }]) +
      kthin('devine qui va encore', CX, 420, t, Dv - .1, { size: 54 }) + kword('SE FAIRE HUMILIER', CX, 560, t, Hu - .15, { size: 74, fill: '#ff5c5c' }); },
  sfx: [[0, 'flash_hit', .4], [at(42, 'devine'), 'sting', .5], [at(42, 'encore'), 'gasp', .4], [at(42, 'humilier') - .15, 'boom', .6]] });
// B042b — FIN : « …DANS LES COMMENTAIRES ? » : section commentaires qui défile, pleine de « KEVIN 😂 »
const COMS = [['lea_2009', '#ff8fb1'], ['TomTom', '#5b8fd8'], ['xX_noah_Xx', '#36a85a'], ['jade.lol', '#8a6ad8'], ['Mehdi', '#ff9a4d'], ['camcam', '#5ec4f0'], ['Inès_', '#e2463a'], ['LeVraiHugo', '#ffd23f'], ['zoé', '#7be07b'], ['Sacha', '#ff6fa5']];
function kvComment(y, i, t, mine = false) { const [u, c] = COMS[i % COMS.length];
  return G(tr(0, y), (mine ? rect(-400, -56, 800, 112, '#fff1d6', 16, 4, SX.acc) : '') + circ(-340, 0, 36, mine ? KGREEN : c, 5) + (mine ? G(tr(-340, 0), head({ hr: 26, hair: 'spiky', hairColor: ROUX, freckles: true, expr: 'sad', cheeks: false, seed: 3 }, t)) : ftext(-340, 12, u[0].toUpperCase(), { size: 32, fill: '#fff' })) +
    ftext(-286, -14, mine ? 'Kevin (moi)' : u, { size: 22, fill: '#7d848c', stroke: 'none', anchor: 'start' }) +
    (mine ? ftext(-286, 28, 'je vous aime quand même', { size: 30, fill: OL, stroke: 'none', anchor: 'start' }) + heart(130, 18, .5) : ftext(-286, 30, 'KEVIN', { size: 36, fill: OL, stroke: 'none', anchor: 'start' }) + kvLol(-286 + 140, 18, .55) + (i % 3 === 0 ? kvLol(-286 + 195, 18, .55) : '')) +
    ftext(330, 30, (mine ? 1 : 120 + i * 987 % 3000) + '', { size: 22, fill: '#7d848c', stroke: 'none', anchor: 'end' }) + heart(360, 22, .32, mine ? '#ff5d73' : '#c9d3dc')); }
B(42, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .2 }),
  draw: (t, d, T) => { const Co = at(42, 'commentaires') - O42, scroll = t * 520;
    let rows = ''; for (let i = 0; i < 14; i++) rows += kvComment(150 + i * 120 - scroll, i, t);
    const panel = G(tr(CX, 520), rect(-430, 0, 860, 620, '#fff', 26, 7) + rect(-430, 0, 860, 70, '#f4f1ea', 26, 0) + ftext(-400, 48, 'COMMENTAIRES · 48 213', { size: 28, fill: OL, stroke: 'none', anchor: 'start' }) + rect(-430, 0, 860, 620, 'none', 26, 7) +
      clipR(-420, 72, 840, 540, rows + kvComment(560 - 120 * eOutCubic(seg(t, d - .9, d - .5)) + (t < d - .9 ? 200 : 0), 0, t, true), 0));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .35 }]) + panel + kword('DANS LES COMMENTAIRES ?', CX, 430, t, Co - .1, { size: 58, fill: SX.acc2 }) + kvLol(120, 1060, 1.3, -12) + kvLol(960, 600, 1.1, 14); },
  sfx: [[0, 'whoosh', .4], [.1, 'typing', .4], [at(42, 'commentaires') - O42 - .1, 'boom', .5], [at(42, 'commentaires') - O42 + .3, 'rimshot', .5]] }, O42);

SCENES.sort((a, b) => a.s - b.s);
