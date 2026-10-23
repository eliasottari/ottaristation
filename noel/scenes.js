// ============================================================
//  « Pourquoi c'est horrible de naître le 25 décembre ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Héros FIXE tout l'épisode (bébé → 5 ans → 8 ans → 12 ans → ado) : il porte toujours un CHAPEAU D'ANNIV pointu
//  (la fête qu'on lui vole) — remplacé par un bonnet de Père Noël sur les photos. Ambiance Noël partout.
//  Les CAPITALES du script = moments criés → kword slam + flash/shake.
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

// ---------- SIZEX fun : accent ROUGE NOËL vif (propre à l'épisode), jaune marqueur, vert sapin ----------
sxFun('#e8233a'); SX.acc2 = '#ffd23f'; SX.cool = '#8fd0ff';
const NRED = '#d62839', SAPIN = '#2f8f4e', CHOCO = '#5a2e14';

// ============================================================
//  LE HÉROS : cheveux châtains + chapeau d'anniversaire pointu (toujours), bonnet rouge en option
// ============================================================
const NHC = '#6b3e26';
function nStarD(r, k = .45) { let d = ''; for (let i = 0; i < 10; i++) { const a = R(-90 + i * 36), rr = i % 2 ? r * k : r; d += (i ? 'L' : 'M') + f1(Math.cos(a) * rr) + ' ' + f1(Math.sin(a) * rr); } return d + 'Z'; }
const nPartyHat = (r, droop = 0) => G(tr(r * .2, -r * .8, 1, 14 + droop), path(`M${-r * .34} 0L${r * .34} 0L0 ${-r * .95}Z`, '#ffd23f', 6) +
  circ(-r * .1, -r * .22, r * .06, NRED, 0) + circ(r * .13, -r * .1, r * .06, '#5ec4f0', 0) + circ(0, -r * .55, r * .06, NRED, 0) + circ(r * .06, -r * .36, r * .05, '#36a85a', 0) +
  rect(-r * .37, -r * .07, r * .74, r * .13, '#ff8fb1', r * .06, 5) + circ(0, -r * .98, r * .12, '#fff', 5));
const nBonnet = r => path(`M${-r * .95} ${-r * .6}Q${-r * .75} ${-r * 1.65} ${r * .3} ${-r * 1.4}Q${r * 1.1} ${-r * 1.15} ${r * 1.28} ${-r * .42}L${r * .95} ${-r * .6}Z`, NRED, 6) +
  rect(-r * 1.04, -r * .78, r * 2.08, r * .3, '#fff', r * .15, 6) + circ(r * 1.28, -r * .36, r * .18, '#fff', 6);
const nHair = (r, t, o) => { const [b, f] = hairSvg('short', NHC, r, t); return [b, f + (o.bonnet ? nBonnet(r) : o.noHat ? '' : nPartyHat(r, o.droop || 0))]; };
const nBaby = (o, t) => person(Object.assign({ age: 'baby', hairFn: nHair, shirt: '#ffe1b8', seed: 2 }, o), t);
const nKid = (o, t) => person(Object.assign({ age: 'kid', hairFn: nHair, shirt: '#5b8fd8', pants: '#3b3f4a', seed: 2 }, o), t);
const nTeen = (o, t) => person(Object.assign({ age: 'adult', hairFn: nHair, shirt: '#4a7fd0', pants: '#2f3b4e', seed: 2 }, o), t);
const nHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: nHair, seed: 2 }, o), t));
const nFlash = (t, t0, k = .8) => t < t0 || t > t0 + .25 ? '' : op(k * (1 - seg(t, t0, t0 + .25)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0));

// ---------- Père Noël, Kevin à bois de renne, la famille ----------
const nSantaHair = (r, t, o) => ['', ell(-r * .92, -r * .05, r * .22, r * .3, '#fff', 6) + ell(r * .92, -r * .05, r * .22, r * .3, '#fff', 6) + nBonnet(r)];
function nSanta(o, t) { const x = o.x || 0, y = o.y || 0, s = o.s || 1;
  return person(Object.assign({ age: 'adult', shirt: NRED, pants: NRED, shoes: '#2b2420', hairFn: nSantaHair, beard: true, hairColor: '#fff', collar: '#fff', bob: 0, glasses: false, seed: 77 }, o), t) +
    G(tr(x, y, s, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''), rect(-80, -162, 160, 30, '#2b2420', 8, 5) + rect(-22, -168, 44, 42, 'none', 8, 7, '#ffd23f')); }
const nAntlers = r => { const d = `M${-r * .45} ${-r * .75}L${-r * .75} ${-r * 1.5}M${-r * .62} ${-r * 1.15}L${-r * 1.0} ${-r * 1.25}M${-r * .7} ${-r * 1.35}L${-r * .5} ${-r * 1.65}`;
  const dd = d + d.replace(/M(-?)/g, (m, s) => 'M' + (s ? '' : '-')).replace(/L(-?)/g, (m, s) => 'L' + (s ? '' : '-'));
  return path(dd, 'none', r * .2) + path(dd, 'none', r * .12, '#a0683a'); };
const nKevHair = (r, t, o) => { const [b, f] = hairSvg('spiky', '#c4521b', r, t); return [nAntlers(r) + b, f]; };
const nKevin = (o, t) => kevin(Object.assign({ shirt: NRED, hairFn: nKevHair }, o), t);
const nKevHead = (x, y, r, o, t) => kevinHead(x, y, r, Object.assign({ hairFn: nKevHair }, o), t);
const nMom = (o, t) => adult(3, Object.assign({ hair: 'long', hairColor: '#8a5a3a', shirt: '#36a85a' }, o), t);
const nDad = (o, t) => adult(0, Object.assign({ hair: 'side', mustache: true, glasses: false, shirt: '#c22a3a' }, o), t);

// ============================================================
//  ACCESSOIRES DE NOËL
// ============================================================
// flocons qui tombent (clip optionnel pour une fenêtre)
function nSnow(t, n = 40, o = {}) { const r = rng(o.seed || 7); let s = ''; const x0 = o.x ?? -120, y0 = o.y ?? -120, w = o.w ?? W + 240, h = o.h ?? H + 240;
  for (let i = 0; i < n; i++) { const sp = 50 + r() * 80, sz = (o.sz || 1) * (4 + r() * 7), bx = r() * w, by = r() * h; s += circ(x0 + bx + Math.sin(t * 1.4 + i * 1.7) * 18, y0 + ((by + t * sp) % h), sz, o.c || '#fff', 0); }
  return o.clip ? clipR(x0, y0, w, h, s, 0) : s; }
// guirlande lumineuse qui clignote
function nLights(x0, x1, y, sag, t, n = 10, ph = 0) { const mx = (x0 + x1) / 2, my = y + sag * 2; let s = path(`M${x0} ${y}Q${mx} ${my} ${x1} ${y}`, 'none', 5, '#24563a');
  const cols = [NRED, '#ffd23f', '#5ec4f0', '#7be07b', '#ff8fb1'];
  for (let i = 0; i < n; i++) { const u = (i + .5) / n, px = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * mx + u * u * x1, py = (1 - u) * (1 - u) * y + 2 * (1 - u) * u * my + u * u * y, on = Math.sin(t * 4 + i * 1.9 + ph) > -.3, c = cols[i % 5];
    s += (on ? op(.45, circ(px, py + 18, 28, c, 0)) : '') + rect(px - 7, py - 4, 14, 11, '#3a3f4a', 3, 3) + ell(px, py + 18, 10, 15, on ? c : shade(c, -.45), 4); }
  return s; }
// guirlande de sapin (festons) + nœuds rouges
function nGarland(x0, x1, y, t, n = 4) { let s = ''; const w = (x1 - x0) / n;
  for (let i = 0; i < n; i++) { const a = x0 + i * w, d = `M${a} ${y}Q${a + w / 2} ${y + 70} ${a + w} ${y}`; s += path(d, 'none', 30) + path(d, 'none', 22, SAPIN) + path(d, 'none', 6, '#4fb06a', 'stroke-dasharray="6 14"') + circ(a + w / 2, y + 48, 14, ['#ffd23f', '#5ec4f0', '#ff8fb1'][i % 3], 5); }
  for (let i = 0; i <= n; i++) { const x = x0 + i * w; s += path(`M${x} ${y}l-30 -20l0 40Z M${x} ${y}l30 -20l0 40Z`, NRED, 5) + circ(x, y, 11, NRED, 5); }
  return s; }
// couronne de porte
const nWreath = (x, y, s = 1) => G(tr(x, y, s), circ(0, 0, 70, 'none', 40) + circ(0, 0, 70, 'none', 30, SAPIN) + [0, 1, 2, 3, 4, 5, 6, 7].map(i => circ(Math.cos(i * .8) * 70, Math.sin(i * .8) * 70, 9, i % 2 ? NRED : '#ffd23f', 3)).join('') +
  path('M0 60l-36 -24l0 48Z M0 60l36 -24l0 48Z', NRED, 5) + circ(0, 60, 12, NRED, 5));
// houx
const nHolly = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M0 0Q-30 -40 -70 -30Q-50 -20 -60 0Q-40 -6 -30 14Q-20 0 0 0Z', SAPIN, 5) + path('M0 0Q30 -40 70 -30Q50 -20 60 0Q40 -6 30 14Q20 0 0 0Z', '#36a85a', 5) + circ(-10, -6, 12, NRED, 4) + circ(10, -8, 12, NRED, 4) + circ(0, 8, 12, NRED, 4));
// sapin décoré (o.gifts = cadeaux au pied)
function nTree(x, yb, s, t, o = {}) { let g = rect(-26, -80, 52, 80, '#8a5a3a', 6, 6);
  const tiers = [[250, -60, -330, SAPIN], [200, -250, -500, '#38a05a'], [150, -420, -650, '#45b067']], r = rng(5);
  let deco = '';
  tiers.forEach(([hw, yb2, yt, c], k) => { g += path(`M${-hw} ${yb2}Q${-hw / 2} ${yb2 + 26} 0 ${yb2}Q${hw / 2} ${yb2 + 26} ${hw} ${yb2}L0 ${yt}Z`, c, 7);
    deco += path(`M${-hw * .75} ${yb2 - 20}Q0 ${yb2 - (yb2 - yt) * .2} ${hw * .65} ${yb2 - (yb2 - yt) * .5}`, 'none', 9, '#ffd23f');
    for (let i = 0; i < 4; i++) { const u = .15 + r() * .7, v = .1 + r() * .6, by = yb2 - (yb2 - yt) * v, bw = hw * (1 - v) * .8, bx = (u * 2 - 1) * bw, col = [NRED, '#5ec4f0', '#ffd23f', '#ff8fb1', '#fff'][(i + k) % 5];
      deco += line(bx, by - 30, bx, by - 14, 3) + circ(bx, by, 18, col, 5) + circ(bx - 6, by - 6, 5, 'rgba(255,255,255,.7)', 0); }
    for (let i = 0; i < 6; i++) { const u = (i + .5) / 6, ly = yb2 - (yb2 - yt) * (.25 + .5 * ((i * 37) % 10) / 10), lx = (u * 2 - 1) * hw * (1 - (yb2 - ly) / (yb2 - yt)) * .9, on = Math.sin(t * 5 + i * 2.1 + k) > 0;
      deco += (on ? op(.5, circ(lx, ly, 18, '#fff6a0', 0)) : '') + circ(lx, ly, 7, on ? '#fff6a0' : '#c9b860', 3); } });
  const st = G(tr(0, -665, 1 + .06 * Math.sin(t * 4), Math.sin(t * 2) * 6), op(.4, circ(0, 0, 90, '#fff6a0', 0)) + path(nStarD(56), '#ffd23f', 7));
  let gifts = '';
  if (o.gifts) gifts = dGift(-170, 30, .9, NRED, '#fff') + dGift(150, 40, 1.1, '#5ec4f0', '#ffd23f') + dGift(-20, 50, .75, '#7be07b', NRED) + dGift(260, 30, .6, '#ff8fb1', '#fff');
  return G(tr(x, yb, s), g + deco + st + gifts); }
// cheminée avec feu et chaussettes
function nFireplace(x, yb, s, t) { let g = rect(-230, -420, 460, 420, '#c0533a', 8, 7);
  for (let i = 1; i < 10; i++) { const y = -420 + i * 42; g += line(-226, y, 226, y, 3, '#9a3e2a'); for (let k = -3; k <= 3; k++) { const bx = k * 76 + (i % 2 ? 38 : 0); if (Math.abs(bx) < 220) g += line(bx, y - 42, bx, y, 3, '#9a3e2a'); } }
  g += path('M-150 0L-150 -190Q-150 -290 0 -290Q150 -290 150 -190L150 0Z', '#2b1a14', 7) + op(.5 + .15 * Math.sin(t * 9), glow(0, -60, 200, '#ffb050', .8));
  g += ell(-40, -20, 70, 22, '#8a5a3a', 5) + ell(40, -14, 70, 22, '#6b3e26', 5) + flames(-110, -30, 220, 170, t, 3);
  g += rect(-270, -462, 540, 44, '#f4f1ea', 8, 7) + nGarland(-260, 260, -446, t, 3);
  g += G(tr(-200, -462), rect(-12, -70, 24, 70, '#fff', 4, 4) + G(tr(0, -82, 1 + .15 * Math.sin(t * 17)), path('M0 -22Q12 -4 0 6Q-12 -4 0 -22Z', '#ffb340', 3))) + G(tr(200, -462), rect(-12, -56, 24, 56, '#fff', 4, 4) + G(tr(0, -68, 1 + .15 * Math.sin(t * 15)), path('M0 -22Q12 -4 0 6Q-12 -4 0 -22Z', '#ffb340', 3)));
  [-150, 0, 150].forEach((sx, i) => { g += G(tr(sx, -418, 1, wave(t, .6, 4, i)), path('M-26 28L26 28L26 90Q62 92 62 118Q62 140 36 140L-10 140Q-26 140 -26 120Z', [NRED, SAPIN, NRED][i], 5) + rect(-32, 0, 64, 32, '#fff', 10, 5)); });
  return G(tr(x, yb, s), g); }
// fenêtre avec neige qui tombe et toits enneigés
function nWin(x, y, w, h, t, o = {}) { const n = o.night; let s = grad(n ? '#16204f' : '#a9c8e8', n ? '#3b4a8c' : '#e8f2fb', x, y, w, h);
  if (n) s += circ(x + w * .75, y + h * .2, 26, '#fff6d6', 0);
  for (let i = 0; i < 4; i++) { const bx = x + i * w / 4 - 6, bh = h * (.22 + ((i * 29) % 20) / 100), top = y + h - bh;
    s += rect(bx, top, w / 4 + 6, bh, n ? '#232b5e' : '#c9d6e6', 0, 0) + path(`M${bx - 8} ${top}L${bx + w / 8} ${top - 30}L${bx + w / 4 + 14} ${top}Z`, '#fff', 0) + rect(bx + w / 8 - 8, top + 20, 16, 20, n ? '#ffe08a' : '#fff', 2, 0); }
  s += rect(x, y + h - 26, w, 26, '#fff', 0, 0) + nSnow(t, 18, { x, y, w, h, clip: 1, sz: .7, seed: (x | 0) + 3 });
  s += rect(x, y, w, h, 'none', 8, 10, '#fff') + rect(x - 6, y - 6, w + 12, h + 12, 'none', 10, 6) + line(x + w / 2, y, x + w / 2, y + h, 8, '#fff') + line(x, y + h / 2, x + w, y + h / 2, 8, '#fff');
  s += rect(x - 24, y + h, w + 48, 20, '#f4f1ea', 4, 5) + path(`M${x - 20} ${y + h + 2}Q${x + w * .3} ${y + h - 22} ${x + w / 2} ${y + h - 4}Q${x + w * .7} ${y + h - 24} ${x + w + 20} ${y + h + 2}Z`, '#fff', 4);
  return s; }
// horloge (h:m figés, trotteuse qui tourne)
function nClock(x, y, r, h, m, t) { const ma = R(m * 6), ha = R((h % 12 + m / 60) * 30), sa = R(t * 360);
  let g = circ(0, 0, r + 12, '#c38a52', 7) + circ(0, 0, r, '#fbf6e8', 5); for (let i = 0; i < 12; i++) { const a = R(i * 30); g += line(Math.sin(a) * r * .8, -Math.cos(a) * r * .8, Math.sin(a) * r * .92, -Math.cos(a) * r * .92, i % 3 ? 4 : 8); }
  g += line(0, 0, Math.sin(ha) * r * .5, -Math.cos(ha) * r * .5, 12) + line(0, 0, Math.sin(ma) * r * .8, -Math.cos(ma) * r * .8, 7) + line(0, 0, Math.sin(sa) * r * .85, -Math.cos(sa) * r * .85, 3, '#e2463a') + circ(0, 0, 9, OL, 0);
  return G(tr(x, y), g + nHolly(0, -r - 10, .55)); }
// calendrier à feuilles
const nCalIn = (day = '25', mon = 'DÉC.') => rect(-130, -150, 260, 300, '#fff', 16, 7) + rect(-130, -150, 260, 90, NRED, 16, 7) + circ(-70, -150, 12, '#9aa3ad', 5) + circ(70, -150, 12, '#9aa3ad', 5) +
  ftext(0, -88, mon, { size: 50, fill: '#fff', stroke: 'none' }) + ftext(0, 105, day, { size: 150, fill: OL, stroke: 'none' });
const nCal = (x, y, s = 1, day, mon, r = 0) => G(tr(x, y, s, r), nCalIn(day, mon) + nHolly(95, -60, .5));
// gâteau d'anniversaire rose
function nCake(x, y, s, t, n = 3, o = {}) { let g = ell(0, 30, 230, 30, '#e6e9ee', 6) + rect(-190, -100, 380, 130, '#ff8fb1', 26, 7) + path('M-186 -72Q-150 -36 -114 -72T-38 -72T38 -72T114 -72T186 -72L186 -96L-186 -96Z', '#fff', 0) +
    rect(-130, -200, 260, 104, '#ffd0e0', 22, 7) + path('M-126 -172Q-100 -140 -74 -172T-22 -172T30 -172T82 -172T126 -172L126 -196L-126 -196Z', '#fff', 0);
  for (let i = 0; i < n; i++) { const cx = n === 1 ? 0 : -80 + i * 160 / (n - 1); g += rect(cx - 10, -280, 20, 80, ['#5ec4f0', '#ffd23f', '#7be07b'][i % 3], 5, 5) + (o.out ? '' : G(tr(cx, -296, 1 + .15 * Math.sin(t * 20 + i)), op(.6, circ(0, -4, 26, '#ffe08a', 0)) + path('M0 -26Q14 -4 0 8Q-14 -4 0 -26Z', '#ffb340', 4))); }
  return G(tr(x, y, s, o.r || 0), g); }
// la BÛCHE (o.name = prénom minuscule en chocolat, o.candles, o.out = bougies soufflées, o.bend = flammes couchées)
function nBuche(x, y, s, t, o = {}) { let g = ell(0, 96, 330, 34, '#e6e9ee', 6) + rect(-300, -95, 580, 190, '#6b3e26', 90, 7);
  for (let i = 0; i < 5; i++) g += path(`M${-260 + i * 20} ${-60 + i * 30}Q${-60} ${-80 + i * 32} ${180 - i * 10} ${-55 + i * 30}`, 'none', 5, '#4a2a18');
  g += ell(280, 0, 64, 95, '#8a5a3a', 7) + path('M280 0m-8 0a8 8 0 1 1 16 0a18 18 0 1 1 -34 0a28 28 0 1 1 52 0a38 38 0 1 1 -70 0', 'none', 6, '#f1d2a8');
  g += path('M-290 -60Q-280 -100 -200 -96Q-140 -112 -80 -96Q0 -114 80 -98Q160 -112 230 -94Q270 -96 278 -70Q240 -76 200 -66Q140 -80 80 -70Q20 -84 -40 -70Q-120 -82 -180 -68Q-250 -80 -290 -60Z', '#fff', 4);
  g += nHolly(-200, -96, .9) + G(tr(150, -96), rect(-8, -40, 16, 40, '#fff', 6, 4) + ell(0, -46, 34, 18, NRED, 5) + circ(-12, -50, 5, '#fff', 0) + circ(10, -44, 5, '#fff', 0));
  const nc = o.candles || 0; for (let i = 0; i < nc; i++) { const cx = -90 + i * 90; g += rect(cx - 9, -170, 18, 74, ['#5ec4f0', '#ffd23f', '#ff8fb1'][i % 3], 5, 5);
    if (!o.out) g += G(tr(cx, -184, 1 + .15 * Math.sin(t * 20 + i), o.bend || 0), op(.6, circ(0, -4, 24, '#ffe08a', 0)) + path('M0 -26Q14 -4 0 8Q-14 -4 0 -26Z', '#ffb340', 4));
    else g += op(.7, path(`M${cx} -176q-14 -26 0 -52t0 -52`, 'none', 6, '#c9c9d2')); }
  g += G(tr(-10, 10, 1, -3), rect(-170, -58, 340, 112, '#fff8e6', 14, 5) + ftext(0, -6, 'Joyeux Noël', { size: 46, fill: CHOCO, stroke: 'none' }) + (o.name ? ftext(132, 38, o.name, { size: 15, fill: CHOCO, stroke: 'none' }) : ''));
  return G(tr(x, y, s, o.r || 0), g); }
// le PULL de Noël (o.big = pull géant ouvert en haut)
function nPull(x, y, s, t, o = {}) { const k = o.sleeve ?? 1;
  let g = path(`M-200 -420L-330 -${120 * k}L-250 -${60 * k}L-190 -300Z`, NRED, 7) + path(`M200 -420L330 -${120 * k}L250 -${60 * k}L190 -300Z`, NRED, 7);
  g += path('M-210 -430Q0 -470 210 -430L200 0L-200 0Z', NRED, 7) + rect(-206, -46, 412, 46, '#a81f30', 10, 6);
  for (let i = -5; i <= 5; i++) g += line(i * 38, -40, i * 38, -6, 4, '#7a1424');
  let zz = 'M-200 -330'; for (let i = 0; i < 10; i++) zz += `L${-180 + i * 40} ${i % 2 ? -330 : -300}`; g += path(zz + 'L200 -315', 'none', 10, '#fff');
  let zb = 'M-200 -110'; for (let i = 0; i < 10; i++) zb += `L${-180 + i * 40} ${i % 2 ? -110 : -80}`; g += path(zb + 'L200 -95', 'none', 10, '#fff');
  for (let i = 0; i < 5; i++) g += G(tr(-160 + i * 80, -370), path('M0 -22L14 4L-14 4Z', '#36a85a', 0) + circ(0, -24, 3, '#ffd23f', 0));
  g += G(tr(0, -205), ell(0, 0, 60, 52, '#a0683a', 5) + ell(0, 30, 30, 22, '#c9935c', 4) + circ(0, 46, 14, '#ff3b30', 4) + circ(-22, -6, 6, OL, 0) + circ(22, -6, 6, OL, 0) +
    path('M-36 -40L-60 -100M-48 -70L-80 -80M36 -40L60 -100M48 -70L80 -80', 'none', 9, '#fff'));
  g += [-140, 140].map(sx => G(tr(sx, -200, 1, t * 30), path(nStarD(26, .3), '#fff', 0))).join('');
  if (!o.big) g += path('M-90 -446Q0 -400 90 -446', 'none', 18, '#a81f30');
  else g += ell(0, -440, 120, 30, '#a81f30', 7);
  return G(tr(x, y, s, o.r || 0), g); }
// table de réveillon (nappe blanche, chemin rouge, dinde, bougies)
function nTable(x, yb, w, t, o = {}) { let g = rect(-w / 2, -40, w, 260, '#fff', 14, 7) + path(`M${-w / 2} 60Q0 90 ${w / 2} 60`, 'none', 5, '#dfe3ea') + rect(-w / 2 + 60, -40, w - 120, 40, NRED, 6, 0) + rect(-w / 2, -40, w, 260, 'none', 14, 7);
  for (let i = 0; i < 4; i++) { const px = -w / 2 + 90 + i * (w - 180) / 3; g += ell(px, -44, 56, 16, '#fff', 5) + ell(px, -46, 34, 9, '#eef1f5', 3); }
  if (o.turkey !== false) g += G(tr(o.tx || 0, -60), ell(0, 0, 120, 26, '#e6e9ee', 6) + ell(0, -46, 100, 64, '#c0742e', 7) + path('M-50 -80Q-30 -100 0 -96', 'none', 5, '#e8a35a') + line(-90, -40, -150, -70, 22) + line(-90, -40, -150, -70, 14, '#c0742e') + circ(-158, -74, 14, '#fff', 4) + line(90, -40, 150, -70, 22) + line(90, -40, 150, -70, 14, '#c0742e') + circ(158, -74, 14, '#fff', 4));
  for (const cx of [-w / 2 + 40, w / 2 - 40]) g += rect(cx - 10, -130, 20, 90, '#fff8e6', 4, 4) + G(tr(cx, -146, 1 + .15 * Math.sin(t * 16 + cx)), op(.6, circ(0, -4, 24, '#ffe08a', 0)) + path('M0 -24Q12 -4 0 8Q-12 -4 0 -24Z', '#ffb340', 3));
  return G(tr(x, yb), g); }
// lit d'hôpital
const nBed = (x, yb, s = 1) => G(tr(x, yb, s), rect(-340, -150, 40, 300, '#b9c4cc', 12, 6) + rect(300, -60, 40, 210, '#b9c4cc', 12, 6) + rect(-320, -40, 640, 120, '#e8eef2', 20, 7) + path('M-310 -40Q-100 -110 310 -50L310 0L-310 0Z', '#8fd0ff', 6) + path('M-200 -70Q0 -90 200 -60', 'none', 4, '#5aaee0'));
// poussette
const nStroller = (x, yb, s = 1) => G(tr(x, yb, s), circ(-110, -30, 34, '#3a3f4a', 6) + circ(110, -30, 34, '#3a3f4a', 6) + line(150, -120, 230, -320, 10) + line(220, -320, 270, -320, 14) + path('M-170 -200L170 -200Q160 -70 0 -70Q-160 -70 -170 -200Z', NRED, 7) + path('M-170 -200Q-190 -360 0 -360L0 -200Z', '#a81f30', 7) + path('M-170 -200L170 -200', 'none', 10, '#fff'));
// téléphone géant (écran réel, coordonnées écran) : en-tête de discussion + contenu clippé
function nPhoneUI(cx, cy, w, h, t, inner = '', o = {}) { const x = cx - w / 2, y = cy - h / 2;
  let s = rect(x - 24, y - 64, w + 48, h + 120, '#2b2b33', 54, 7) + rect(cx - 50, y - 40, 100, 14, '#15151c', 7, 0) + rect(x, y, w, h, o.bg || '#eef4ff', 14, 0);
  if (o.name) s += rect(x, y, w, 96, SAPIN, 14, 0) + nKevHead(x + 56, y + 48, 32, { expr: o.kx || 'happy' }, t) + ftext(x + 104, y + 62, o.name, { size: 38, fill: '#fff', stroke: 'none', anchor: 'start' });
  return s + clipR(x, y + (o.name ? 96 : 0), w, h - (o.name ? 96 : 0), inner, 0); }
const nTyping = (x, y, t) => rect(x - 70, y - 34, 140, 68, '#fff', 34, 5) + [0, 1, 2].map(i => circ(x - 34 + i * 34, y - 8 * Math.max(0, Math.sin(t * 9 - i)), 10, '#9aa3ad', 0)).join('');

// ============================================================
//  DÉCORS
// ============================================================
// salon de Noël : cheminée, sapin, fenêtre enneigée, guirlandes (o.night, o.noTree, o.noFire, o.sofa)
function nSalon(t, o = {}) { const yb = 1250, n = o.night;
  let s = dWall('diamond', n ? '#5a2f3a' : '#f6dcc0', n ? '#6a3a48' : '#ecc9a6', yb) + rect(-M, 960, W + 2 * M, yb - 960, n ? '#4a2430' : '#e2b48a', 0, 0) + line(-M, 960, W + M, 960, 8, n ? '#3a1a24' : '#b88a5a');
  s += nWin(460, 330, 260, 340, t, { night: n }) + dCurtain(400, 310, 100, 440, '#c22a3a', t, 1) + dCurtain(690, 310, 100, 440, '#c22a3a', t, -1) + nWreath(590, 260, .55);
  s += dFrame(110, 330, 140, 170, 'face', '#c38a52', -3) + dFrame(290, 310, 110, 140, 'mount', '#8a5a3a', 3) + nLights(-60, W + 60, 110, 46, t, 13);
  if (!o.noFire) s += nFireplace(220, 1250, .9, t);
  else s += dShelf(60, 820, 360, dBooks(80, 820, 180, 3) + dTeddy(330, 820, .7));
  if (!o.noTree) s += nTree(900, 1300, 1.0, t, { gifts: 1 });
  else s += dPot(960, 1250, 1.2, t, 2, '#c22a3a');
  s += n ? op(.22, rect(-M, -M, W + 2 * M, yb + M, '#1a1030', 0, 0)) + op(.4, glow(220, 1100, 420, '#ffb050', .55)) : WASH('rgba(255,255,255,.1)');
  s += dParquet(yb, n ? '#6a4630' : '#b07a50') + dRug(CX, 1480, 820, 170, '#c22a3a', '#ffd23f');
  if (o.sofa) s += sofa(CX, 1300, .95, SAPIN);
  s += dGift(120, 1600, .9, '#ff8fb1', '#fff') + dTeddy(980, 1640, .8) + dBall(260, 1720, .6, 0, NRED) + dBox(820, 1800, .8, 'DÉCO');
  return s; }
// maternité de Noël : horloge 8 h 32, calendrier 25 DÉC.
function nMater(t, o = {}) { const yb = 1250, ck = o.clk || [560, 340, 80], cl = o.cal || [850, 380, .75];
  let s = dWall('dot', '#e4f6ef', '#cdeee0', yb) + nWin(50, 270, 300, 360, t) + dCurtain(30, 250, 90, 420, '#ffd23f', t, 1) + dCurtain(300, 250, 90, 420, '#ffd23f', t, -1) + nLights(-40, W + 40, 120, 40, t, 11, 1);
  s += nClock(ck[0], ck[1], ck[2], 8, 32, t) + nCal(cl[0], cl[1], cl[2], '25', 'DÉC.', 4) + dFrame(440, 560, 120, 100, 'heart', '#c38a52', -3);
  s += G(tr(990, 760), rect(-70, -60, 140, 110, '#2b2b33', 10, 6) + path(`M-56 0L-30 0L-20 -30L-6 30L8 0L56 0`, 'none', 6, '#7be07b') + line(0, 50, 0, 490, 10, '#9aa3ad'));
  s += G(tr(720, 1250), rect(-80, -160, 160, 160, '#f4f1ea', 10, 6) + line(-70, -80, 70, -80, 4)) + nTree(720, 1090, .26, t);
  s += dParquet(yb, '#e8cfa8') + dTeddy(150, 1300, 1.1) + dGift(310, 1310, .9, NRED, '#fff') + dGift(400, 1300, .7, '#7be07b', '#ffd23f') + dBalloon(60, 820, '#ff8fb1', t, 0, .7);
  return s; }
// ciel de nuit + toits enneigés (Père Noël)
function nNight(t, o = {}) { let s = grad('#0d1640', '#3a3f8a', -M, -M, W + 2 * M, H + 2 * M);
  for (let i = 0; i < 30; i++) { const x = (i * 137) % W, y = 80 + (i * 211) % 700; s += op(.5 + .5 * Math.sin(t * 3 + i), sparkle(x, y, .12 + (i % 3) * .05, '#fff6d6')); }
  s += op(.35, circ(o.mx ?? 760, o.my ?? 430, 230, '#fff6d6', 0)) + circ(o.mx ?? 760, o.my ?? 430, 180, '#fff6d6', 6) + circ((o.mx ?? 760) - 60, (o.my ?? 430) - 40, 30, '#efe3b8', 0) + circ((o.mx ?? 760) + 50, (o.my ?? 430) + 50, 22, '#efe3b8', 0);
  const r = rng(9); let x = -M;
  while (x < W + M) { const w = 170 + r() * 120, h = 220 + r() * 220, top = 1250 - h;
    s += rect(x, top, w, h + 700, '#1a2150', 0, 6) + path(`M${x - 20} ${top}L${x + w / 2} ${top - 110}L${x + w + 20} ${top}Z`, '#232b62', 6) + path(`M${x - 20} ${top}L${x + w / 2} ${top - 110}L${x + w + 20} ${top}L${x + w + 10} ${top + 16}L${x + w / 2} ${top - 84}L${x - 10} ${top + 16}Z`, '#fff', 0);
    s += rect(x + w * .7, top - 90, 34, 70, '#5a3a4a', 2, 5) + rect(x + w * .7 - 6, top - 98, 46, 16, '#fff', 6, 0);
    for (let k = 0; k < 2; k++) s += rect(x + 26 + k * (w - 90), top + 60, 46, 58, Math.sin(t + x + k) > -.6 ? '#ffd76a' : '#2e3570', 4, 5);
    x += w + 10; }
  return s + nSnow(t, 46); }
// rue de Noël (o.night, o.shut = 0..1 rideaux de fer baissés)
function nStreet(t, o = {}) { const yb = 1250, n = o.night, k = o.shut ?? 0;
  let s = grad(n ? '#121a45' : '#bcd3ea', n ? '#3b3f8a' : '#f2f6fb', -M, -M, W + 2 * M, yb + M);
  if (n) for (let i = 0; i < 18; i++) s += op(.5 + .5 * Math.sin(t * 3 + i), sparkle((i * 151) % W, 60 + (i * 97) % 300, .12, '#fff6d6'));
  s += op(.9, dSkyline(560, n ? '#1e2550' : '#c7d3e2', 5, n ? 'rgba(255,220,120,.6)' : 'rgba(255,255,255,.45)'));
  const shops = [[-30, 'BOULANGERIE', '#f3c6a0', '#c22a3a'], [350, 'JOUETS', '#bfe3d0', SAPIN], [720, 'CINÉMA', '#d8c6f0', '#5a3a8a']];
  shops.forEach(([x0, name, c, aw], i) => { const w = 360;
    s += rect(x0, 520, w, yb - 520, c, 0, 6) + rect(x0 - 8, 500, w + 16, 34, shade(c, -.2), 4, 6) + path(`M${x0 - 6} 500Q${x0 + w / 2} 470 ${x0 + w + 6} 500L${x0 + w + 6} 512L${x0 - 6} 512Z`, '#fff', 0);
    s += rect(x0 + 30, 560, w - 60, 70, '#fff8e6', 10, 5) + ftext(x0 + w / 2, 610, name, { size: name.length > 8 ? 30 : 38, fill: aw, stroke: 'none' });
    let st = ''; for (let j = 0; j < 7; j++) st += rect(x0 + 10 + j * (w - 20) / 7, 650, (w - 20) / 7, 70, j % 2 ? '#fff' : aw, 0, 0); s += st + path(`M${x0 + 10} 720` + Array.from({ length: 7 }, (_, j) => `Q${x0 + 10 + (j + .5) * (w - 20) / 7} 750 ${x0 + 10 + (j + 1) * (w - 20) / 7} 720`).join(''), aw, 5) + rect(x0 + 10, 650, w - 20, 70, 'none', 0, 5);
    s += rect(x0 + 30, 780, 190, 300, n ? '#ffe9a8' : '#e8f4ff', 6, 6) + rect(x0 + 240, 800, 90, 280, '#8a5a3a', 6, 6) + circ(x0 + 255, 950, 7, '#ffd23f', 3);
    s += dGift(x0 + 80, 1070, .6, NRED, '#fff') + (i === 1 ? dTeddy(x0 + 160, 1070, .7) : i === 0 ? G(tr(x0 + 160, 1060), ell(0, -20, 50, 26, '#d9a86c', 5)) : G(tr(x0 + 160, 1070), rect(-40, -90, 80, 90, '#2b2b33', 6, 5) + ftext(0, -36, 'FILM', { size: 20, fill: '#ffd23f', stroke: 'none' })));
    s += nWreath(x0 + 285, 870, .4);
    if (k > 0) { const sh = 360 * eOutCubic(k); let g = rect(x0 + 24, 760, w - 48, sh, '#9aa3ad', 4, 6); for (let j = 1; j < 12; j++) if (j * 30 < sh) g += line(x0 + 28, 760 + j * 30, x0 + w - 28, 760 + j * 30, 4, '#7d848c'); s += g;
      if (k >= 1) s += G(tr(x0 + w / 2, 900, 1, wave(t, .6, 6, i)), line(-50, -60, -20, -20, 4) + line(50, -60, 20, -20, 4) + rect(-90, -20, 180, 70, '#fff', 10, 6) + ftext(0, 30, 'FERMÉ', { size: 40, fill: '#e2463a', stroke: 'none' })); }
  });
  s += nLights(-60, W + 60, 450, 50, t, 12, 2);
  s += dLampPost(30, 1300, 1.1, n) + nWreath(30, 900, .3);
  s += rect(-M, yb, W + 2 * M, 300, '#eef3fa', 0, 6) + path(`M-200 ${yb + 60}Q200 ${yb + 40} 540 ${yb + 70}T1300 ${yb + 50}`, 'none', 8, '#cfdcec') + rect(-M, yb + 300, W + 2 * M, 900, '#5a6070', 0, 6) + line(-M, yb + 480, W + M, yb + 480, 12, '#f4f1ea');
  s += G(tr(950, 1360), circ(0, -40, 70, '#fff', 6) + circ(0, -150, 50, '#fff', 6) + circ(-16, -158, 6, OL, 0) + circ(16, -158, 6, OL, 0) + path('M0 -146L40 -140L0 -134Z', '#ff8a3d', 3) + rect(-60, -200, 120, 16, NRED, 6, 4) + rect(-40, -250, 80, 56, '#2b2420', 6, 4));
  return s + nSnow(t, 40); }
// cour d'école enneigée
const nYard = t => schoolyard(t) + op(.35, rect(-M, -M, W + 2 * M, 1180 + M, '#dfe9f6', 0, 0)) + rect(-M, 1180, W + 2 * M, 900, '#eef3fa', 0, 6) + path('M-200 1260Q300 1230 700 1270T1300 1250', 'none', 8, '#cfdcec') + nLights(-60, W + 60, 140, 40, t, 12) + nSnow(t, 40);
// chambre ado de Noël
const nRoom = t => bedroomN(t) + nLights(-60, W + 60, 140, 46, t, 13, 1) + nWreath(860, 760, .45);

// ============================================================
//  PLANS
// ============================================================
// B001a — SIGNATURE : grille encre + neige, bébé (déjà avec son chapeau d'anniv) en cut-out, titre 3 lignes, « débloqué » sur 25 DÉCEMBRE
const O1 = at(1, 'tu') - .12;
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, '25');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + nSnow(t, 30) + burst(CX, 1020, 300, t, .4, SX.acc, 16) + unlock(CX, 980, t, K, { part: 'back', r: 480 }) +
      G(tr(CX, 1300, 1 + .03 * Math.sin(t * 6)), cutout(nBaby({ x: 0, y: 0, s: 1.6, expr: t > K ? 'jawdrop' : 'happy' }, t), 12)) +
      unlock(CX, 980, t, K, { part: 'front', r: 480 }) + funBox(CX, 960, 400, 400, t, K + .2, { label: 'bebe.png' }) + funTag(840, 760, '25/12', t, K + .35, { size: 44, bg: SAPIN, r: 8 }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin('HORRIBLE DE NAÎTRE LE', CX, 415, t, .3, { size: 56 }) +
      kword('25 DÉCEMBRE ?', CX, 540, t, K - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, '25') - .05, 'boom', .6], [at(1, '25'), 'sparkle', .5], [at(1, '25') + .35, 'pop', .4]] });

// B001b — « Tu viens de naître. » : papier + gobo, bébé cut-out, JOUR 1
B(1, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.08, .2),
  draw: (t, d, T) => { const Na = at(1, 'naitre', 2) - O1;
    return paper(SX.paper) + gobo(T, .12) + burst(CX, 1000, 290, t, .02, '#ffd0d6', 16) +
      cutout(nBaby({ x: CX, y: 1300, s: 1.5, expr: t > Na ? 'cry' : 'calm' }, t), 12) + nHolly(250, 1150, 1.2, -10) +
      funTag(250, 760, 'JOUR 1', t, .05, { size: 46, bg: SAPIN, r: -8 }) + markerText('déjà un chapeau', 790, 690, t, Na + .05, { size: 42 }) + markerArrow(760, 720, 650, 830, t, Na + .1, { bend: -40 }) +
      kthin('tu viens de', CX, 420, t, 0, { size: 60 }) + kword('NAÎTRE', CX, 550, t, Na - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [.05, 'pop', .5], [at(1, 'naitre', 2) - O1 - .05, 'boom', .4], [at(1, 'naitre', 2) - O1, 'baby_coo', .7], [at(1, 'naitre', 2) - O1 + .1, 'scratch', .4]] }, O1);

// B002 — « Le médecin regarde l'heure. » : papier vert, médecin cut-out (bébé dans les bras), horloge qui pop
B(2, { enter: 'none', trans: 'circle', transD: .25, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const Md = at(2, 'medecin'), Rg = at(2, 'regarde'), Hr = at(2, 'heure');
    const babyB = G(tr(0, 0, 1, -20), nBaby({ x: 0, y: 70, s: .45, expr: 'calm' }, t));
    return paper('#e3f7ef') + gobo(T, .1) + blob(790, 830, 250, t, '#ffd9e6', 3) +
      cutout(person({ age: 'adult', x: 330, y: 1480, s: 1.2, hair: 'side', hairColor: '#7a6a5a', shirt: '#f4f6f8', coat: 1, stetho: 1, glasses: true, skin: SK[4], seed: 70, expr: t > Hr ? 'shock' : 'neutral', look: t > Rg ? [1.2, -1] : [0, 0], armL: [60, -20], holdL: babyB }, t), 10) +
      (t > Rg - .1 ? G(tr(790, 830, pop(t, Rg - .1, .35), Math.sin(t * 5) * 4), cutout(nClock(0, 0, 150, 8, 32, t), 10)) : '') + markerCircle(790, 830, 190, 190, t, Hr, { col: NRED }) +
      kthin('le médecin', CX, 420, t, Md - .1, { size: 60 }) + kword("REGARDE L'HEURE", CX, 560, t, Rg - .05, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(2, 'medecin') - .1, 'pop_hi', .4], [at(2, 'regarde') - .1, 'pop', .5], [at(2, 'regarde'), 'tick', .5], [at(2, 'heure'), 'scratch', .4]] });

// B003 — « 25 décembre. 8 h 32. » : maternité de Noël ; la caméra plonge sur le calendrier, puis sur l'horloge
B(3, { enter: 'whip', cam: (t, d) => { const H8 = at(3, '8h32'), k = eInOut(seg(t, H8 - .2, H8 + .05)); return { z: 1.18, cx: lerp(300, 780, k), cy: 820, hand: .3, shake: t > H8 && t < H8 + .3 ? 6 : 0 }; },
  draw: (t, d, T) => { const D = at(3, '25'), H8 = at(3, '8h32');
    return depth({ zoom: 1, x: Math.sin(t) * 6 }, [{ z: 1.3, svg: nMater(t, { clk: [780, 840, 125], cal: [300, 860, 1.05] }), haze: .05 }]) + markerCircle(300, 870, 170, 190, t, D + .1, { col: NRED }) + markerCircle(780, 840, 170, 170, t, H8 + .05, { col: NRED }) +
      kword('25 DÉCEMBRE', CX, 450, t, D - .05, { size: 100, fill: '#fff', op: t > H8 ? 0 : 1 }) + kword('8 H 32', CX, 450, t, H8 - .05, { size: 140, fill: SX.acc2 }) + nFlash(t, H8, .5); },
  sfx: [[0, 'whoosh', .4], [at(3, '25') - .05, 'boom', .5], [at(3, '25') + .1, 'scratch', .4], [at(3, '8h32') - .2, 'whoosh', .4], [at(3, '8h32') - .05, 'boom', .6], [at(3, '8h32'), 'tick', .6]] });

// B004 — « Tes parents pleurent de joie. » : maman au lit avec le bébé, papa en fontaine de larmes, cœurs
B(4, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pa = at(4, 'parents'), Pl = at(4, 'pleurent'), Jo = at(4, 'joie');
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.4, svg: nMater(t), haze: .08 },
      { z: 1, svg: nMom({ x: 540, y: 1440, s: 1.1, expr: t > Pl ? 'cry' : 'happy', armL: [150, 60], armR: [120, 160] }, t) + nBaby({ x: 420, y: 1270, s: .85, expr: 'happy' }, t) + nBed(560, 1330, 1) +
        nDad({ x: 870, y: 1490, s: 1.15, expr: t > Pl ? 'sob' : 'happy', flip: 1, armL: [-140, -110] }, t) + (t > Jo ? heartsUp(t, 640, 900, 6) : '') },
      { z: .6, svg: blur(10, dPot(60, 1950, 1.6, t, 2)) }]) +
      kthin('tes parents pleurent', CX, 420, t, Pa - .1, { size: 58 }) + kword('DE JOIE', CX, 570, t, Jo - .05, { size: 120, fill: SX.acc2 }) + popStars(CX, 570, t, Jo + .05, 8, 300); },
  sfx: [[0, 'whoosh', .4], [at(4, 'parents'), 'pop_hi', .4], [at(4, 'pleurent'), 'spray', .4], [at(4, 'joie') - .05, 'boom', .4], [at(4, 'joie'), 'kiss', .5]] });

// B005 — « Et quelque part… » : nuit, toits enneigés, une ombre de traîneau passe devant la lune
B(5, { enter: 'none', trans: 'black', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Qp = at(5, 'quelque'), sx = lerp(-200, 1300, seg(t, .1, d));
    const sil = G(tr(sx, 430 - Math.sin(t * 3) * 20, .55, -6), path('M-200 -40L160 -40Q220 -40 230 -120L250 -150L260 -60Q240 20 160 20L-180 20Q-220 20 -220 -20Z', '#0d1640', 0) + circ(-40, -110, 60, '#0d1640', 0) + path('M-220 60L200 60Q270 60 280 10', 'none', 10, '#0d1640') +
      line(260, -60, 420, -80, 4, '#0d1640') + ell(480, -90, 90, 40, '#0d1640', 0) + circ(580, -150, 34, '#0d1640', 0) + path('M570 -180L540 -250M590 -180L620 -250', 'none', 8, '#0d1640') + line(450, -60, 420, 0, 10, '#0d1640') + line(520, -60, 560, 0, 10, '#0d1640'));
    return nNight(t, { mx: 600, my: 450 }) + sil + kthin('et quelque part…', CX, 760, t, Qp - .2, { size: 70 }) + funTag(820, 900, 'PÔLE NORD', t, .15, { size: 40, bg: '#fff', fg: SX.ink, r: 6 }); },
  sfx: [[0, 'wind', .5], [.1, 'sting', .4], [at(5, 'quelque'), 'magic', .4], [.15, 'pop_hi', .3]] });

// B006a — « LE PÈRE NOËL vient de te… » : crash, gros plan Père Noël sournois qui se frotte les mains
const O6 = at(6, 'voler') - .15;
B(6, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 3 }),
  draw: (t, d, T) => { const Pe = at(6, 'pere'), Vi = at(6, 'vient'), rub = Math.sin(t * 22) * 10;
    return rays(t, CX, 950, '#7a1424', NRED, 22) + nSnow(t, 24) + burst(CX, 950, 300, t, Pe, '#ffd23f', 18) +
      cutout(nSanta({ x: CX, y: 1560, s: 1.35, expr: 'smugger', look: [1, 0], armL: [40, -40 + rub], armR: [140, -140 - rub] }, t), 12) + (t > Vi ? sparkle(700, 960, .8 + .2 * Math.sin(t * 20), '#fff') : '') +
      kword('LE PÈRE NOËL', CX, 440, t, Pe - .1, { size: 110, fill: '#fff' }) + kthin('vient de te…', CX, 590, t, Vi - .1, { size: 58 }); },
  sfx: [[0, 'flash_hit', .5], [at(6, 'pere') - .1, 'boom', .7], [at(6, 'noel'), 'growl', .4], [at(6, 'vient'), 'glint', .5], [at(6, 'vient') + .1, 'tiptoe', .4]] });
// B006b — « …VOLER TON ANNIVERSAIRE. » : le traîneau file avec le gâteau et la banderole JOYEUX ANNIV, le bébé hurle à la fenêtre
function nDeer(x, y, s, t) { const g1 = Math.sin(t * 14) * 30;
  return G(tr(x, y, s), line(-60, 20, -60 - g1, 100, 14) + line(-60, 20, -60 - g1, 100, 8, '#8a5a3a') + line(60, 20, 60 + g1, 100, 14) + line(60, 20, 60 + g1, 100, 8, '#8a5a3a') +
    ell(0, 0, 120, 56, '#a0683a', 7) + path('M80 -20L130 -100', 'none', 40) + path('M80 -20L130 -100', 'none', 28, '#a0683a') + ell(150, -120, 56, 42, '#a0683a', 7) +
    path('M130 -150L110 -230M120 -195L80 -210M170 -150L190 -230M180 -195L220 -210', 'none', 12) + path('M130 -150L110 -230M120 -195L80 -210M170 -150L190 -230M180 -195L220 -210', 'none', 6, '#d9a86c') +
    op(.5 + .3 * Math.sin(t * 10), circ(205, -118, 34, '#ff5c5c', 0)) + circ(205, -118, 18, '#ff3b30', 5) + circ(150, -132, 7, OL, 0) + path('M-120 -10Q-150 -30 -140 -50', 'none', 8)); }
function nSleigh(x, y, s, t, cake = true) { const by = Math.sin(t * 4) * 10;
  return G(tr(x, y + by, s, -6), nSanta({ x: -40, y: 70, s: .75, expr: 'mock', armR: [-60, -100], holdR: cake ? nCake(0, -10, .32, t, 3) : '', armL: [200, 160] }, t) +
    path('M-220 -40L160 -40Q220 -40 230 -120L250 -150Q270 -170 280 -140L260 -60Q240 20 160 20L-180 20Q-220 20 -220 -20Z', '#c22a3a', 7) + path('M-200 -20L150 -20', 'none', 8, '#ffd23f') +
    path('M-230 70L210 70Q290 70 300 10', 'none', 12) + path('M-230 70L210 70Q290 70 300 10', 'none', 6, '#ffd23f') + line(-150, 20, -150, 70, 8) + line(120, 20, 120, 70, 8) +
    line(260, -60, 400, -40, 5) + nDeer(520, -30, .9, t)); }
B(6, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4, shake: t > at(6, 'anniversaire') - O6 ? 5 : 0 }),
  draw: (t, d, T) => { const Vo = at(6, 'voler') - O6, An = at(6, 'anniversaire') - O6, sx = lerp(400, 720, seg(t, 0, d)), fl = Math.sin(t * 9) * 5;
    const banner = G(tr(sx - 250, 930 + Math.sin(t * 3) * 10, 1, fl), line(0, 0, 60, -10, 5) + rect(-340, -50, 340, 100, '#fff', 10, 7) + ftext(-170, 18, 'JOYEUX ANNIV', { size: 44, fill: NRED, stroke: 'none' }));
    return nNight(t, { mx: 280, my: 420 }) + banner + nSleigh(sx, 930, .85, t) + speedLines(t, sx, 930, 18, 'rgba(255,255,255,.35)') +
      G(tr(820, 1200), rect(-170, -150, 340, 230, '#ffe9a8', 10, 8) + clipR(-170, -150, 340, 230, nBaby({ x: 0, y: 180, s: .9, expr: 'jawdrop' }, t), 10) + line(0, -150, 0, 80, 8, '#fff') + rect(-190, 80, 380, 24, '#fff', 6, 5)) +
      kword('VOLER', CX, 430, t, Vo - .05, { size: 120, fill: SX.acc2 }) + kword('TON ANNIVERSAIRE', CX, 580, t, An - .05, { size: 76, fill: '#fff' }) + stamp(300, 1060, 'VOLÉ !', t, An + .3, NRED, -12, 70); },
  sfx: [[0, 'whoosh', .5], [at(6, 'voler') - O6 - .05, 'boom', .6], [at(6, 'voler') - O6, 'flutter', .4], [at(6, 'anniversaire') - O6 - .05, 'boom', .5], [at(6, 'anniversaire') - O6 + .1, 'gasp', .5], [at(6, 'anniversaire') - O6 + .3, 'thud', .6]] }, O6);

// B007 — « Bienvenue dans la vie d'un enfant né le 25 décembre. » : rue de Noël, arche lumineuse, bébé en poussette
B(7, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bv = at(7, 'bienvenue'), En = at(7, 'enfant'), D = at(7, '25');
    let bulbs = ''; for (let i = 0; i < 14; i++) { const a = R(180 + i * 180 / 13), bx = CX + Math.cos(a) * 400, by = 820 + Math.sin(a) * 200, on = Math.sin(t * 6 + i) > -.4; bulbs += circ(bx, by, 16, on ? (i % 2 ? '#fff3a0' : '#ff8fb1') : '#9a8a50', 4) + (on ? op(.35, circ(bx, by, 30, '#fff3a0', 0)) : ''); }
    const arch = rect(118, 820, 44, 480, '#8a5a3a', 6, 6) + rect(918, 820, 44, 480, '#8a5a3a', 6, 6) + path('M140 820A400 200 0 0 1 940 820', 'none', 30, SAPIN) + path('M140 820A400 200 0 0 1 940 820', 'none', 6, '#ffd23f') + bulbs + nWreath(140, 830, .35) + nWreath(940, 830, .35);
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: nStreet(t), haze: .1 },
      { z: 1, svg: arch + nMom({ x: 260, y: 1480, s: 1.1, expr: 'happy', armR: [-10, 10] }, t) + nBaby({ x: 600, y: 1175, s: .8, expr: 'confused' }, t) + nStroller(600, 1300, 1) },
      { z: .6, svg: blur(10, nTree(1010, 2050, .6, t)) }]) +
      kthin('bienvenue dans la vie', CX, 400, t, Bv - .1, { size: 56 }) + kthin("d'un enfant né le", CX, 480, t, En - .15, { size: 50 }) + kword('25 DÉCEMBRE', CX, 600, t, D - .05, { size: 100, fill: SX.acc2 }) + confetti(t, D, 26); },
  sfx: [[0, 'whoosh', .4], [at(7, 'bienvenue'), 'magic', .5], [at(7, 'enfant'), 'pop_hi', .4], [at(7, '25') - .05, 'boom', .5], [at(7, '25'), 'tada', .4]] });

// B008 — « À cinq ans, tu demandes quand aura lieu ta fête. » : salon de Noël, tu tires la manche de maman qui décore le sapin
B(8, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const A5 = at(8, '5'), Qu = at(8, 'quand'), Fe = at(8, 'fete'), tug = Math.sin(t * 12) * 10;
    return nSalon(t) + nMom({ x: 760, y: 1480, s: 1.15, expr: 'happy', flip: 1, armL: [-120, -90], holdL: circ(0, -10, 22, NRED, 5) }, t) +
      nKid({ x: 360, y: 1480, s: 1.2, expr: t > Fe ? 'ecstatic' : 'happy', look: [1, -1], armR: [-10 + tug, 10], armL: [110, 100] }, t) +
      funTag(CX, 420, '5 ANS', t, A5 - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 420, t, A5, 6, 180) +
      kthin('quand aura lieu', CX, 560, t, Qu - .1, { size: 56 }) + kword('MA FÊTE ?', CX, 680, t, Fe - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(8, '5') - .1, 'pop', .7], [at(8, 'demandes'), 'squeak', .4], [at(8, 'quand'), 'pop_hi', .4], [at(8, 'fete') - .05, 'boom', .4]] });

// B009 — « Ta mère répond : » : gros plan maman, guirlande autour du cou, sourire énorme
B(9, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t), haze: .3 }, { z: 1, svg: nMom({ x: CX, y: 1760, s: 1.9, expr: 'joy', face: { mouth: 'talk' } }, t) + nGarland(300, 780, 1150, t, 3) }]) +
    kthin('ta mère répond :', CX, 440, t, 0, { size: 62 }),
  sfx: [[0, 'whoosh', .3], [at(9, 'mere'), 'pop_hi', .4], [at(9, 'repond'), 'hmm', .3]] });

// B010 — « Mais mon chéri, on fait déjà Noël ! » : maman montre le sapin, tu te dégonfles
B(10, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ma = at(10, 'mais'), De = at(10, 'deja'), No = at(10, 'noel');
    return nSalon(t) + nMom({ x: 640, y: 1480, s: 1.15, expr: 'joy', face: t < No + .3 ? { mouth: 'talk' } : {}, armR: [-40, -60], armL: [110, 100] }, t) +
      nKid({ x: 300, y: 1480, s: 1.2, expr: t > De ? 'sad' : 'confused', droop: t > De ? 40 * seg(t, De, De + .4) : 0 }, t) +
      markerArrow(760, 620, 880, 760, t, No, { bend: -50 }) + kthin('mais mon chéri, on fait', CX, 430, t, Ma - .1, { size: 52 }) + kword('DÉJÀ NOËL !', CX, 560, t, De - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[at(10, 'mais'), 'pop_hi', .4], [at(10, 'deja') - .05, 'boom', .4], [at(10, 'noel'), 'magic', .5], [at(10, 'noel') + .2, 'scratch', .4]] });

// B011a — « OUI MAMAN. NOËL. » : gros plan rage, vapeur
const O11 = at(11, 'pas') - .15;
B(11, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 4 + (t > at(11, 'noel') ? 4 : 0) }),
  draw: (t, d, T) => { const Ou = at(11, 'oui'), No = at(11, 'noel');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t), haze: .3 }, { z: 1, svg: nHead(CX, 990, 230, { expr: 'rage', tilt: Math.sin(t * 20) * 3 }, t) }]) +
      kword('OUI MAMAN.', CX, 430, t, Ou - .05, { size: 110, fill: '#fff' }) + kword('NOËL.', 820, 640, t, No - .05, { size: 110, fill: SX.acc2, r: 8 }) + nFlash(t, No, .4); },
  sfx: [[0, 'flash_hit', .4], [at(11, 'oui') - .05, 'boom', .6], [at(11, 'maman'), 'growl', .4], [at(11, 'noel') - .05, 'boom', .6], [at(11, 'noel') + .1, 'sizzle', .4]] });
// B011b — « PAS MON ANNIVERSAIRE. » : rayons rouges, tu trépignes, le chapeau d'anniv brandi
B(11, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 6 }),
  draw: (t, d, T) => { const Pa = at(11, 'pas') - O11, An = at(11, 'anniversaire') - O11, jump = Math.abs(Math.sin(t * 12)) * 40;
    return rays(t, CX, 950, '#ff6b6b', '#c92f3a', 22) + burst(CX, 1000, 300, t, Pa, '#ffd23f', 18) +
      cutout(nKid({ x: CX, y: 1470 - jump, s: 1.3, expr: 'rage', armL: [-150, -110], armR: [-30, -70] }, t), 12) +
      kword('PAS MON', CX, 430, t, Pa - .05, { size: 110, fill: '#fff' }) + kword('ANNIVERSAIRE !', CX, 580, t, An - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(11, 'pas') - O11 - .05, 'boom', .6], [at(11, 'anniversaire') - O11 - .05, 'thud', .7], [at(11, 'anniversaire') - O11 + .1, 'hammer', .4], [at(11, 'anniversaire') - O11 + .4, 'hammer', .4]] }, O11);

// B012 — « À huit ans, tes copains reçoivent deux cadeaux. » : cour enneigée, les copains croulent sous 2 cadeaux chacun
const nGiftStack = (c1, c2) => G(tr(0, -10), dGift(0, 0, .7, c1, '#fff') + dGift(0, -70, .55, c2, '#ffd23f'));
B(12, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const A8 = at(12, '8'), Re = at(12, 'recoivent'), C2 = at(12, '2');
    return nYard(t) + kid(1, { x: 800, y: 1490, s: 1.2, expr: 'ecstatic', flip: 1, armL: [-80, -95], holdL: t > Re ? nGiftStack(SAPIN, '#ff8fb1') : '' }, t) +
      kid(4, { x: 560, y: 1490, s: 1.15, expr: 'joy', armR: [-80, -95], holdR: t > Re + .1 ? nGiftStack('#5ec4f0', NRED) : '' }, t + 1) +
      nKid({ x: 230, y: 1490, s: 1.3, expr: t > C2 ? 'jawdrop' : 'happy', look: [1, 0] }, t) +
      funTag(CX, 420, '8 ANS', t, A8 - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 420, t, A8, 6, 180) + kword('2 CADEAUX', CX, 590, t, C2 - .05, { size: 110, fill: '#fff' }); },
  sfx: [[0, 'school_bell', .3], [at(12, '8') - .1, 'pop', .7], [at(12, 'recoivent'), 'pop', .5], [at(12, 'recoivent') + .1, 'pop', .5], [at(12, '2') - .05, 'boom', .4], [at(12, 'cadeaux'), 'tada', .3]] });

// B013 — « Un pour Noël. » : carte cadeau SAPIN
const nGiftCard = (c1, c2, lab, col) => rect(-150, -160, 300, 320, col, 22, 0) + dGift(0, 70, 1.6, c1, c2) + ftext(0, 130, lab, { size: 40, fill: '#fff' });
B(13, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const No = at(13, 'noel');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nYard(t), haze: .3 }, { z: 1, svg: kid(1, { x: 260, y: 1490, s: 1.3, expr: 'ecstatic', armL: [-150, -120], armR: [-30, -60] }, t) }]) +
      card(720, 860, 300, 320, nGiftCard(SAPIN, NRED, 'NOËL', '#bfe3d0'), t, .05, { ry: 0, thick: 12, r: 6, bw: 6 }) + nTree(720, 820, .18, t) +
      kword('UN POUR NOËL', CX, 450, t, No - .2, { size: 92, fill: '#7be07b' }) + popStars(720, 860, t, No, 6, 200); },
  sfx: [[.05, 'pop', .6], [at(13, 'noel') - .2, 'boom', .4], [at(13, 'noel'), 'sparkle', .5]] });

// B014 — « Un pour leur anniversaire. » : carte cadeau ANNIV (ballons)
B(14, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const An = at(14, 'anniversaire');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nYard(t), haze: .3 }, { z: 1, svg: kid(4, { x: 820, y: 1490, s: 1.3, expr: 'ecstatic', flip: 1, armL: [-150, -120], armR: [-30, -60] }, t) }]) +
      card(360, 860, 300, 320, nGiftCard('#ff8fb1', '#ffd23f', 'ANNIV', '#ffd9e6'), t, .05, { ry: 0, thick: 12, r: -6, bw: 6 }) + dBalloon(260, 560, '#ff5c8a', t, 0, .7) + dBalloon(460, 580, '#5ec4f0', t, 1, .7) +
      kword("UN POUR L'ANNIV", CX, 450, t, An - .15, { size: 84, fill: '#ff8fb1' }) + confetti(t, An, 24); },
  sfx: [[0, 'whoosh', .4], [.05, 'pop', .6], [at(14, 'anniversaire') - .15, 'boom', .4], [at(14, 'anniversaire'), 'tada', .5]] });

// B015 — « Toi ? Regarde, on t'a pris un gros cadeau pour les deux ! » : les parents poussent un cadeau ÉNORME
B(15, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const To = at(15, 'toi'), Rg = at(15, 'regarde'), Gr = at(15, 'gros'), De = at(15, 'deux'), gx = lerp(1300, 700, eOutCubic(seg(t, Rg, Gr + .1))), gs = lerp(1.6, 3.4, eOutBack(seg(t, Gr - .1, Gr + .3)));
    return nSalon(t) + nDad({ x: gx + 300, y: 1490, s: 1.1, expr: 'joy', flip: 1, armL: [-160, -170] }, t) + dGift(gx, 1360, gs, NRED, '#ffd23f') +
      nKid({ x: 250, y: 1480, s: 1.3, expr: t > Gr ? 'ecstatic' : t > To ? 'sad' : 'neutral', look: [1, 0] }, t) +
      kthin('toi ?', CX, 410, t, To - .1, { size: 70, out: Rg + .2 }) + kword('UN GROS CADEAU', CX, 470, t, Gr - .05, { size: 88, fill: SX.acc2 }) + funTag(CX, 620, 'POUR LES DEUX !', t, De - .1, { size: 48, bg: SAPIN, r: -4 }); },
  sfx: [[at(15, 'toi'), 'crickets', .4], [at(15, 'regarde'), 'steps', .4], [at(15, 'gros') - .1, 'boing', .6], [at(15, 'gros') - .05, 'boom', .4], [at(15, 'deux') - .1, 'pop', .5]] });

// B016 — « C'est un pull. » : le couvercle saute, un pull de Noël plié sort… tête de six pieds de long
B(16, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pu = at(16, 'pull'), up = eOutBack(seg(t, Pu - .25, Pu + .15));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t), haze: .25 }]) + nPull(700, 1150 - 160 * up, .8, t) + G(tr(700, 1340), rect(-250, -200, 500, 220, NRED, 8, 7) + rect(-30, -200, 60, 220, '#ffd23f', 0, 0) + rect(-250, -200, 500, 220, 'none', 8, 7)) +
      (t > Pu - .25 ? G(tr(700 + 300 * up, 1130 - 500 * up, 1, 40 * up), rect(-270, -40, 540, 60, NRED, 8, 7)) : '') +
      nHead(260, 1000, 150, { expr: t > Pu ? 'deadpan' : 'ecstatic', droop: t > Pu ? 40 : 0 }, t) + kword('UN PULL.', CX, 470, t, Pu - .05, { size: 130, fill: '#fff' }); },
  sfx: [[at(16, 'c') + .05, 'drum', .4], [at(16, 'pull') - .25, 'pop', .6], [at(16, 'pull') - .05, 'boom', .4], [at(16, 'pull') + .2, 'crickets', .5]] });

// B017 — « UN TRÈS GROS PULL, EFFECTIVEMENT. » : tu es avalé par un pull GÉANT, manches qui traînent, « débloqué » ironique
B(17, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t < .3 ? 6 : 0, hand: .3 }),
  draw: (t, d, T) => { const Tr = at(17, 'tres'), Gr = at(17, 'gros'), Ef = at(17, 'effectivement');
    return nSalon(t) + unlock(CX, 900, t, Gr, { part: 'back', r: 470 }) + nPull(CX, 1700, 2.05, t, { big: 1, sleeve: 1.3 }) + nHead(CX, 690, 120, { expr: 'dizzy', droop: 20 }, t) + unlock(CX, 900, t, Gr, { part: 'front', r: 470 }) +
      nDad({ x: 980, y: 1500, s: .9, expr: 'proud', flip: 1, armL: [-120, -60], armR: [-60, -120] }, t) +
      kword('UN TRÈS GROS PULL', CX, 430, t, Tr - .1, { size: 80, fill: SX.acc2 }) + kthin('effectivement.', CX, 545, t, Ef - .1, { size: 58 }) + funTag(250, 1000, 'TAILLE XXXXL', t, Ef, { size: 36, bg: '#fff', fg: SX.ink, r: -8 }); },
  sfx: [[0, 'flash_hit', .4], [at(17, 'tres') - .1, 'boom', .6], [at(17, 'gros'), 'tada', .5], [at(17, 'pull'), 'boing', .4], [at(17, 'effectivement'), 'rimshot', .5]] });

// B018 — « À douze ans, tu veux inviter tes amis. » : chambre de Noël, tu fabriques des cartons d'invitation
const nInvite = (t) => ftext(0, -70, 'INVITATION', { size: 34, fill: NRED, stroke: 'none' }) + ftext(0, -20, 'mon anniv !', { size: 30, fill: OL, stroke: 'none' }) + ftext(0, 40, 'le 25 déc.', { size: 34, fill: SAPIN, stroke: 'none' }) + G(tr(0, 85, .35), nCake(0, 0, 1, t, 3));
B(18, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const A12 = at(18, '12'), In = at(18, 'inviter'), Am = at(18, 'amis');
    return nRoom(t) + WASH('rgba(255,240,220,.08)') + nKid({ x: 280, y: 1480, s: 1.4, expr: 'joy', look: [1, 0], armR: [-60, -80], holdR: G(tr(0, -20, .35, -8), rect(-130, -120, 260, 240, '#fff', 14, 6)) }, t) +
      [0, 1, 2].map(i => card(640 + i * 150, 900 + (i % 2) * 60, 260, 300, nInvite(t), t, In + i * .12, { ry: 0, thick: 8, r: -8 + i * 8, bw: 6 })).join('') +
      funTag(CX, 420, '12 ANS', t, A12 - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 420, t, A12, 6, 180) + kthin('tu veux inviter', CX, 560, t, In - .1, { size: 56 }) + kword('TES AMIS', CX, 670, t, Am - .05, { size: 96, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(18, '12') - .1, 'pop', .7], [at(18, 'inviter'), 'pop_hi', .4], [at(18, 'inviter') + .12, 'pop_hi', .4], [at(18, 'inviter') + .24, 'pop_hi', .4], [at(18, 'amis') - .05, 'boom', .4]] });

// B019 — « Kevin répond : » : téléphone géant, ton invitation, Kevin est en train d'écrire…
B(19, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ke = at(19, 'kevin');
    const inner = chatBubble(700, 760, 420, 130, 'Tu viens à mon\nanniv le 25 ?', t, -1, true, 38) + (t > Ke ? nTyping(380, 920, t) : '');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nRoom(t), haze: .4 }]) + nPhoneUI(CX, 860, 620, 720, t, inner, { name: 'Kevin' }) + kthin('kevin répond :', CX, 420, t, Ke - .1, { size: 62 }) + nHead(150, 1100, 110, { expr: 'worried', look: [1, -1] }, t); },
  sfx: [[0, 'whoosh', .3], [at(19, 'kevin'), 'typing', .5], [at(19, 'repond'), 'pop_hi', .4]] });

// B020 — « Désolé, je suis avec ma famille. » : chez Kevin, réveillon en pull et bois de renne
B(20, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const De = at(20, 'desole'), Fa = at(20, 'famille');
    const fam = adult(1, { x: 560, y: 1380, s: .95, expr: 'laugh', shirt: SAPIN }, t) + grandma({ x: 760, y: 1380, s: .95, expr: 'happy' }, t + 1) + adult(2, { x: 960, y: 1380, s: .95, expr: 'joy', shirt: '#ffd23f', flip: 1 }, t + 2);
    return nSalon(t, { night: 1, noFire: 1 }) + fam + nTable(760, 1250, 640, t) +
      nKevin({ x: 270, y: 1490, s: 1.3, expr: 'embarrassed', armR: [-60, -100], holdR: phone(0, -40, .45), armL: [-150, -140] }, t) +
      chatBubble(600, 720, 470, 140, 'Désolé, je suis\navec ma famille.', t, De, false, 40) +
      kthin('désolé,', CX, 420, t, De - .1, { size: 58, out: Fa - .2 }) + kword('AVEC MA FAMILLE', CX, 440, t, Fa - .1, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(20, 'desole'), 'ding', .5], [at(20, 'famille') - .1, 'boom', .4], [at(20, 'famille') + .1, 'chomp', .4]] });

// B021 — « Logique. » : ta tête, yeux mi-clos
B(21, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.06, 1.1, t / d) }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: nRoom(t), haze: .4 }, { z: 1, svg: nHead(CX, 990, 220, { expr: 'deadpan' }, t) }]) + markerText('logique.', CX, 560, t, at(21, 'logique'), { size: 90 }),
  sfx: [[at(21, 'logique'), 'scratch', .5], [at(21, 'logique') + .1, 'hmm', .4]] });

// B022 — « C'EST NOËL. » : rayons verts, étoile géante, neige qui explose
B(22, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 5 }),
  draw: (t, d, T) => { const No = at(22, 'noel');
    return rays(t, CX, 900, '#45b067', SAPIN, 22) + nSnow(t, 40) + G(tr(CX, 900, pop(t, 0, .35), t * 40), op(.4, circ(0, 0, 260, '#fff6a0', 0)) + path(nStarD(220), '#ffd23f', 10)) +
      kword("C'EST NOËL.", CX, 600, t, No - .15, { size: 120, fill: '#fff' }) + popStars(CX, 900, t, No, 10, 380); },
  sfx: [[0, 'flash_hit', .5], [at(22, 'c'), 'magic', .5], [at(22, 'noel') - .15, 'boom', .6], [at(22, 'noel'), 'sparkle', .5]] });

// B023 — « Tous tes amis sont occupés. » : façade la nuit, 4 fenêtres, chaque ami en famille → OCCUPÉ ×4
B(23, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const To = at(23, 'tous'), Oc = at(23, 'occupes');
    const pos = [[300, 720], [780, 720], [300, 1020], [780, 1020]], ww = 380, wh = 250;
    let s = grad('#121a45', '#3b3f8a', -M, -M, W + 2 * M, H + 2 * M) + rect(30, 520, 1020, 1400, '#8a4a3a', 0, 7);
    for (let y = 540; y < 1300; y += 44) s += line(30, y, 1050, y, 3, '#6e3a2c');
    s += path('M10 520L540 300L1070 520Z', '#5a2f3a', 7) + path('M10 520L540 300L1070 520L1050 540L540 330L30 540Z', '#fff', 0) + nLights(30, 1050, 540, 30, t, 14);
    pos.forEach(([x, y], i) => { const inner = rect(-ww / 2, -wh / 2, ww, wh, '#ffe3a8', 0, 0) + nTree(130, 120, .3, t + i) + kid(i + 1, { x: -90, y: 210, s: .6, expr: ['laugh', 'joy', 'ecstatic', 'happy'][i] }, t + i) + adult(i + 2, { x: 30, y: 250, s: .5, expr: 'laugh' }, t + i);
      s += G(tr(x, y), clipR(-ww / 2, -wh / 2, ww, wh, inner, 6) + rect(-ww / 2, -wh / 2, ww, wh, 'none', 6, 9, '#fff') + line(0, -wh / 2, 0, wh / 2, 7, '#fff') + rect(-ww / 2 - 16, wh / 2, ww + 32, 18, '#fff', 4, 5)) + stamp(x, y, 'OCCUPÉ', t, Oc + i * .1, NRED, -10 + i * 6, 50); });
    return s + nSnow(t, 36) + kthin('tous tes amis sont', CX, 410, t, To - .1, { size: 56, out: Oc - .1 }) + kword('OCCUPÉS', CX, 410, t, Oc - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(23, 'amis'), 'pop_hi', .4], [at(23, 'occupes'), 'thud', .6], [at(23, 'occupes') + .1, 'thud', .5], [at(23, 'occupes') + .2, 'thud', .5], [at(23, 'occupes') + .3, 'thud', .5]] });

// B024 — « Tous les magasins sont fermés. » : rue de Noël, les rideaux de fer tombent, tu restes seul
B(24, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ma = at(24, 'magasins'), Fe = at(24, 'fermes'), tw = lerp(-150, 1250, seg(t, 0, d));
    return nStreet(t, { night: 1, shut: seg(t, Ma, Fe + .1) }) + nKid({ x: 540, y: 1480, s: 1.35, expr: t > Fe ? 'sob' : 'worried' }, t) +
      G(tr(tw, 1420, 1, t * 400), circ(0, 0, 60, 'none', 8, '#b8854f') + path('M-40 -30Q0 20 40 -30M-34 34Q0 -10 34 34', 'none', 6, '#b8854f')) +
      kthin('tous les magasins sont', CX, 400, t, Ma - .3, { size: 54 }) + kword('FERMÉS', CX, 520, t, Fe - .05, { size: 130, fill: SX.acc2 }); },
  sfx: [[0, 'wind', .5], [at(24, 'magasins'), 'shutter', .5], [at(24, 'magasins') + .3, 'shutter', .5], [at(24, 'fermes') - .05, 'thud', .7], [at(24, 'fermes') + .2, 'crickets', .4]] });

// B025 — « Et ton gâteau d'anniversaire ? » : à table, serviette au cou, tu rêves d'un gâteau rose
B(25, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ga = at(25, 'gateau');
    const dream = t > Ga - .1 ? G(tr(720, 820, pop(t, Ga - .1, .35)), cloud(0, 0, 2.2, '#fff', 7) + circ(-240, 170, 24, '#fff', 6) + circ(-290, 230, 14, '#fff', 5) + nCake(0, 60, .5, t, 3)) : '';
    return nSalon(t, { night: 1 }) + nTable(CX, 1250, 900, t, { turkey: false }) + nKid({ x: 280, y: 1390, s: 1.35, expr: t > Ga ? 'starving' : 'happy', look: [1, -1], armL: [60, -20], armR: [120, -40] }, t) +
      path('M230 1108L330 1108L280 1180Z', '#fff', 5) + dream + kthin('et ton', CX, 410, t, 0, { size: 58 }) + kword("GÂTEAU D'ANNIV ?", CX, 530, t, Ga - .05, { size: 80, fill: '#ff8fb1' }); },
  sfx: [[at(25, 'et'), 'pop_hi', .3], [at(25, 'gateau') - .1, 'magic', .5], [at(25, 'gateau') - .05, 'boom', .4], [at(25, 'anniversaire'), 'gulp', .5]] });

// B026 — « C'EST UNE BÛCHE. » : la bûche s'écrase sur la table, mâchoire au sol
B(26, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(26, 'buche') ? 8 : 2 }),
  draw: (t, d, T) => { const Bu = at(26, 'buche'), dy = 700 * (1 - eOutCubic(seg(t, Bu - .3, Bu)));
    return nSalon(t, { night: 1 }) + nTable(CX, 1250, 900, t, { turkey: false }) + nKid({ x: 230, y: 1390, s: 1.35, expr: t > Bu ? 'jawdrop' : 'ecstatic' }, t) +
      (t > Bu ? impactStar(660, 1180, .9) : '') + nBuche(660, 1120 - dy, .75, t, { candles: 3 }) +
      kword("C'EST UNE", CX, 420, t, .02, { size: 80, fill: '#fff' }) + kword('BÛCHE.', CX, 570, t, Bu - .05, { size: 150, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [.02, 'boom', .4], [at(26, 'buche') - .3, 'whoosh', .5], [at(26, 'buche'), 'thud', .8], [at(26, 'buche') + .1, 'gasp', .5]] });

// B027 — « Avec ton prénom écrit en chocolat. » : insert sur la bûche : « Joyeux Noël » énorme… et « léo » minuscule
B(27, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pr = at(27, 'prenom'), Ch = at(27, 'chocolat');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t, { night: 1 }), haze: .4 }]) + nBuche(CX, 980, 1.8, t, { name: 'léo', candles: 0 }) + markerCircle(CX + 220, 1047, 60, 40, t, Pr, { col: SX.acc2, w: 10 }) +
      markerText('ton prénom', 780, 760, t, Pr + .1, { size: 54 }) + markerArrow(800, 790, 770, 1000, t, Pr + .15, { bend: -60 }) + nHead(110, 700, 90, { expr: 'confused' }, t) +
      kthin('avec ton prénom écrit', CX, 420, t, 0, { size: 56 }) + kword('EN CHOCOLAT', CX, 560, t, Ch - .05, { size: 96, fill: '#c9935c' }); },
  sfx: [[0, 'whoosh', .4], [at(27, 'prenom'), 'scratch', .5], [at(27, 'ecrit'), 'pop_hi', .4], [at(27, 'chocolat') - .05, 'boom', .4], [at(27, 'chocolat'), 'squeak', .4]] });

// B028 — « Magnifique. » : sourire forcé, pouce levé, éclat ironique
B(28, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t, { night: 1 }), haze: .4 }, { z: 1, svg: nHead(CX, 990, 220, { expr: 'deadpan', face: { mouth: 'grin' } }, t) + G(tr(820, 1180, pop(t, .05, .3), -10), circ(0, 0, 60, SKIN, 7) + rect(-20, -130, 40, 100, SKIN, 20, 7)) }]) +
    sparkle(640, 1080, .9 + .2 * Math.sin(t * 20), '#fff') + kword('MAGNIFIQUE.', CX, 480, t, at(28, 'magnifique') - .1, { size: 110, fill: SX.acc2 }),
  sfx: [[at(28, 'magnifique') - .1, 'boom', .4], [at(28, 'magnifique'), 'glint', .6], [at(28, 'magnifique') + .2, 'sparkle', .4]] });

// B029a — « Tu souffles tes bougies… » : tu souffles, les flammes se couchent puis s'éteignent
const O29 = at(29, 'pendant') - .1;
B(29, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const So = at(29, 'souffles'), Bo = at(29, 'bougies'), out = t > Bo + .15;
    let wind = ''; if (t > So && !out) for (let i = 0; i < 3; i++) wind += op(.8, path(`M${390 + ((t * 600 + i * 60) % 180)} ${990 + i * 30}q30 -12 60 0t60 0`, 'none', 6, '#fff'));
    return nSalon(t, { night: 1 }) + nTable(CX, 1250, 900, t, { turkey: false }) + nBuche(680, 1120, .75, t, { candles: 3, out, bend: t > So ? 50 : 0 }) +
      nKid({ x: 250, y: 1390, s: 1.35, expr: 'effort', face: t > So ? { mouth: 'o' } : {}, look: [1, 0] }, t) + wind +
      kthin('tu souffles tes bougies', CX, 430, t, So - .1, { size: 56 }) + (out ? funTag(680, 760, 'PFFF', t, Bo + .15, { size: 48, bg: '#fff', fg: SX.ink, r: 6 }) : ''); },
  sfx: [[at(29, 'souffles'), 'wind', .6], [at(29, 'bougies') + .15, 'pop_hi', .4], [at(29, 'bougies') + .2, 'sizzle', .4]] });
// B029b — « …pendant que ta tante chante Petit Papa Noël. » : la tante au micro-bougie, notes de musique partout
B(29, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const Ch = at(29, 'chante') - O29, Pp = at(29, 'petit') - O29, sing = t > Ch;
    let notes = ''; if (sing) for (let i = 0; i < 5; i++) { const k = (t * .9 + i / 5) % 1; notes += op(1 - k, ftext(560 + Math.sin(k * 8 + i) * 80 + i * 70, 1000 - k * 520, i % 2 ? '♪' : '♫', { size: 70, fill: ['#ffd23f', '#fff', '#ff8fb1'][i % 3] })); }
    const mic = G(tr(0, -30), rect(-12, -10, 24, 90, '#fff8e6', 4, 5) + circ(0, -26, 24, '#9aa3ad', 5));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t, { night: 1 }), haze: .2 }]) + nKid({ x: 200, y: 1400, s: 1.1, expr: 'deadpan' }, t) +
      adult(4, { x: 640, y: 1520, s: 1.35, hair: 'curly', hairColor: '#8a3a2a', shirt: SAPIN, necklace: true, expr: sing ? 'joy' : 'happy', face: sing ? { mouth: Math.sin(t * 14) > 0 ? 'laugh' : 'o' } : {}, armR: [20, -80], holdR: mic, armL: [200, 220 + Math.sin(t * 6) * 20] }, t) + notes +
      kthin('ta tante chante', CX, 410, t, Ch - .2, { size: 56 }) + kword('PETIT PAPA NOËL', CX, 540, t, Pp - .05, { size: 80, fill: SX.acc2 }) + (t > Pp ? funTag(250, 760, '♪ FAUX ♪', t, Pp + .4, { size: 40, bg: NRED, r: -8 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(29, 'chante') - O29, 'whistle', .5], [at(29, 'petit') - O29 - .05, 'boom', .4], [at(29, 'papa') - O29, 'squeak', .5], [at(29, 'noel') - O29, 'squeak', .5]] }, O29);

// B030 — « Même sur les photos, tu portes un bonnet rouge. » : le mur de photos, toujours le bonnet
B(30, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ph = at(30, 'photos'), Bo = at(30, 'bonnet'), Me = at(30, 'meme');
    const P = [[300, 720, -5, '1 AN', '#bfe3ff', 95], [780, 720, 4, '5 ANS', '#ffd9e6', 100], [300, 1030, 3, '8 ANS', '#d8f2c8', 110], [780, 1030, -4, '12 ANS', '#fff1b8', 115]];
    let s = depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t), haze: .3 }]) + rect(70, 540, 940, 640, '#c58e55', 16, 7) + rect(90, 560, 900, 600, '#d4a26a', 8, 4);
    P.forEach(([x, y, r, lab, bg, hr], i) => { const t0 = Me + i * (Ph - Me + .3) / 4; if (t < t0) return;
      const inner = rect(-130, -120, 260, 200, bg, 4, 4) + nTree(90, 70, .14, t) + G(tr(-20, 0), head({ hr: hr * .7, hairFn: nHair, bonnet: true, expr: ['calm', 'sad', 'deadpan', 'annoyed'][i], seed: 2 }, t));
      s += G(tr(x, y, pop(t, t0, .3), r), rect(-150, -140, 300, 300, '#fff', 6, 6) + clipR(-130, -120, 260, 200, inner, 4) + ftext(0, 125, lab, { size: 34, fill: OL, stroke: 'none' }) + circ(0, -140, 12, NRED, 4)); });
    P.forEach(([x, y], i) => { s += markerCircle(x - 10, y - 75, 80, 50, t, Bo + i * .07, { col: SX.acc2, w: 10 }); });
    return s + kthin('même sur les photos', CX, 410, t, Me - .1, { size: 56, out: Bo - .1 }) + kword('BONNET ROUGE', CX, 420, t, Bo - .05, { size: 96, fill: '#fff' }); },
  sfx: [[at(30, 'meme'), 'shutter', .5], [at(30, 'photos'), 'shutter', .5], [at(30, 'portes'), 'shutter', .4], [at(30, 'bonnet') - .05, 'boom', .4], [at(30, 'bonnet'), 'scratch', .5]] });

// B031 — « Puis tu grandis. » : la toise du salon, tu passes de 12 ans à ado d'un coup
B(31, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Gr = at(31, 'grandis'), big = t > Gr, k = pop(t, Gr, .35);
    const toise = G(tr(840, 0), rect(-40, 500, 80, 760, '#fff8e6', 8, 6) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(i => line(-40, 540 + i * 48, i % 2 ? -10 : 10, 540 + i * 48, 4)).join('') +
      [['16', 690], ['12', 900], ['8', 1040], ['5', 1150]].map(([a, y]) => line(-60, y, 60, y, 6, NRED) + ftext(90, y + 12, a, { size: 34, fill: NRED, stroke: 'none' })).join(''));
    return nSalon(t, { noTree: 1 }) + toise + (big ? speedLines(t, 420, 900, 20, 'rgba(255,255,255,.5)') : '') +
      (big ? G(tr(420, 1500, 1, 0), G(`scale(1 ${f1(.7 + .3 * k)})`, nTeen({ x: 0, y: 0, s: 1.2, expr: 'wow', armL: [-150, -120], armR: [-30, -60] }, t))) : nKid({ x: 420, y: 1480, s: 1.3, expr: 'effort' }, t)) +
      kword('TU GRANDIS', CX, 440, t, Gr - .05, { size: 110, fill: SX.acc2 }) + popStars(420, 900, t, Gr, 8, 300); },
  sfx: [[0, 'whoosh', .4], [at(31, 'puis'), 'pop_hi', .4], [at(31, 'grandis') - .05, 'whoosh_up', .6], [at(31, 'grandis'), 'boing', .5]] });

// B032 — « Tu fais semblant de t'en foutre. » : ado au salon, lunettes noires, mains derrière la tête… une goutte trahit
B(32, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Se = at(32, 'semblant'), Fo = at(32, 'foutre');
    return nSalon(t, { sofa: 1 }) + nTeen({ x: 420, y: 1500, s: 1.2, expr: 'cool', armL: [-130, -20], armR: [-50, -160] }, t) + (t > Fo ? sweat(530, 1010 + (t * 40) % 30, 1.1) : '') +
      kthin('tu fais semblant', CX, 420, t, Se - .2, { size: 58 }) + kword("DE T'EN FOUTRE", CX, 560, t, Fo - .15, { size: 92, fill: SX.acc2 }) + funTag(820, 820, 'OSEF.', t, Fo + .1, { size: 50, bg: '#fff', fg: SX.ink, r: 6 }); },
  sfx: [[at(32, 'fais'), 'pop_hi', .4], [at(32, 'semblant'), 'whistle', .4], [at(32, 'foutre') - .15, 'boom', .4], [at(32, 'foutre') + .1, 'pop', .5]] });

// B033 — « De toute façon, j'aime pas les anniversaires. » : gros plan, le nez de Pinocchio pousse sur « anniversaires »
B(33, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Df = at(33, 'toute'), Ai = at(33, 'aime'), An = at(33, 'anniversaires'), L = 20 + 330 * eOutBack(seg(t, An, An + .5));
    const nose = G(tr(CX + 10, 1010), rect(0, -18, L, 36, SKIN, 18, 7) + (L > 200 ? G(tr(L - 60, -18), path('M0 0Q-20 -40 10 -50Q10 -20 0 0Z', '#36a85a', 4)) : ''));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t), haze: .35 }, { z: 1, svg: nHead(CX - 60, 980, 210, { expr: t > An ? 'shock' : 'smug', look: [1, 0] }, t) + nose }]) +
      kthin('de toute façon,', CX, 410, t, Df - .2, { size: 54 }) + kword("J'AIME PAS", CX, 530, t, Ai - .1, { size: 100, fill: '#fff' }) + kthin('les anniversaires.', CX, 640, t, An - .15, { size: 52 }) + funTag(820, 760, 'MENTEUR', t, An + .3, { size: 40, bg: NRED, r: 8 }); },
  sfx: [[at(33, 'toute'), 'pop_hi', .3], [at(33, 'aime') - .1, 'boom', .4], [at(33, 'anniversaires'), 'whoosh_up', .5], [at(33, 'anniversaires') + .1, 'boing', .5], [at(33, 'anniversaires') + .3, 'pop', .4]] });

// B034a — « Sauf que le 25 décembre, » : les feuilles du calendrier défilent jusqu'au 25
const O34 = at(34, 'quand') - .15;
B(34, { enter: 'none', trans: 'black', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Sa = at(34, 'sauf'), D = at(34, '25'), day = Math.min(25, 21 + Math.floor(seg(t, Sa, D) * 4.99));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t, { night: 1 }), haze: .35 }]) + card(CX, 920, 300, 340, nCalIn(String(day), 'DÉC.'), t, .02, { ry: 0, thick: 12, r: -3, bw: 0 }) +
      (t < D ? G(tr(CX, 780 - (t * 900) % 200, 1, (t * 300) % 60), op(.8, rect(-130, -10, 260, 160, '#fff', 10, 5))) : '') + (t > D ? markerCircle(CX, 990, 140, 110, t, D + .05, { col: NRED, w: 12 }) : '') +
      kthin('sauf que le', CX, 420, t, Sa - .1, { size: 58 }) + kword('25 DÉCEMBRE', CX, 560, t, D - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[at(34, 'sauf'), 'sting', .4], [at(34, 'sauf') + .1, 'flutter', .5], [at(34, '25') - .05, 'boom', .5], [at(34, '25'), 'ding', .4]] });
// B034b — « …quand tout le monde ouvre ses cadeaux… » : la famille déchire les paquets, toi dans ton coin
B(34, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .4 }),
  draw: (t, d, T) => { const To = at(34, 'tout') - O34, Ou = at(34, 'ouvre') - O34;
    let paper_ = ''; if (t > Ou) for (let i = 0; i < 10; i++) { const k = ((t - Ou) * 1.2 + i / 10) % 1, x = 380 + i * 50 + Math.sin(i * 3) * 120 * k, y = 1150 - 500 * k + 600 * k * k; paper_ += G(tr(x, y, 1, t * 300 + i * 40), rect(-24, -18, 48, 36, [NRED, SAPIN, '#ffd23f', '#5ec4f0'][i % 4], 4, 4)); }
    return nSalon(t, { night: 1 }) + nDad({ x: 300, y: 1490, s: 1.05, expr: 'ecstatic', armL: [-150, -120], armR: [-30, -60] }, t) + kid(2, { x: 520, y: 1490, s: 1.1, expr: 'ecstatic', armL: [-140, -120], armR: [-40, -60], holdR: dGift(0, 0, .5, '#5ec4f0', '#ffd23f') }, t) +
      grandma({ x: 720, y: 1490, s: 1.0, expr: 'laugh', armR: [-60, -90], holdR: dTeddy(0, 20, .5) }, t) + nTeen({ x: 930, y: 1500, s: 1.05, expr: 'deadpan', flip: 1, armL: [-60, -100], holdL: phone(0, -40, .35) }, t) + paper_ + confetti(t, Ou, 30) +
      kthin('quand tout le monde', CX, 420, t, To - .1, { size: 56 }) + kword('OUVRE SES CADEAUX', CX, 550, t, Ou - .05, { size: 74, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(34, 'tout') - O34, 'pop_hi', .4], [at(34, 'ouvre') - O34, 'snip', .6], [at(34, 'ouvre') - O34 + .2, 'tada', .5], [at(34, 'cadeaux') - O34, 'gasp', .4]] }, O34);

// B035 — « Tu regardes discrètement ton téléphone. » : gros plan ado, le téléphone caché derrière un cadeau
B(35, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Rg = at(35, 'regardes'), Di = at(35, 'discretement'), Te = at(35, 'telephone'), peek = eOutCubic(seg(t, Rg, Rg + .4));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t, { night: 1 }), haze: .4 }]) + op(.35, glow(700, 1000, 300, '#9fd0ff', .7)) + nHead(380, 940, 210, { expr: 'suspicious', look: [1.2, 1] }, t) +
      G(tr(720, 1250 - 200 * peek, 1.1, 8), phone(0, 0, 1, 0, rect(-66, -128, 132, 250, '#bfe3ff', 12, 0))) + dGift(720, 1350, 2.2, NRED, '#ffd23f') +
      kthin('tu regardes', CX, 410, t, Rg - .15, { size: 56 }) + funTag(CX, 540, 'DISCRÈTEMENT', t, Di - .05, { size: 54, bg: SAPIN, r: -3 }) + (t > Te ? markerText('ton téléphone', 780, 690, t, Te, { size: 46 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(35, 'regardes'), 'tiptoe', .5], [at(35, 'discretement') - .05, 'pop', .5], [at(35, 'telephone'), 'scratch', .4]] });

// B036 — « Tu attends quelques messages. » : écran verrouillé 25 déc. 08:32… 0 notification, cœur qui bat
B(36, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Qu = at(36, 'quelques'), Me = at(36, 'messages');
    const inner = grad('#3a3f8a', '#8a6ad8', 380, 640, 520, 640) + ftext(640, 760, '08:32', { size: 110, fill: '#fff', stroke: 'none' }) + ftext(640, 815, 'vendredi 25 décembre', { size: 30, fill: '#fff', stroke: 'none' }) +
      rect(410, 850, 460, 90, 'rgba(255,255,255,.75)', 22, 0) + ftext(640, 906, '0 notification', { size: 34, fill: '#7d848c', stroke: 'none' }) +
      G(tr(640, 1020, 1, t * 360), circ(0, 0, 30, 'none', 8, 'rgba(255,255,255,.3)') + path('M0 -30A30 30 0 0 1 30 0', 'none', 8, '#fff'));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t, { night: 1 }), haze: .45 }]) + nPhoneUI(640, 960, 520, 640, t, inner, { bg: '#3a3f8a' }) + nHead(170, 1060, 120, { expr: 'worried', look: [1, -.5] }, t) +
      (t > Me ? heart(170, 860, .8 + .25 * Math.abs(Math.sin(t * 8)), NRED) : '') +
      kthin('tu attends', CX, 395, t, 0, { size: 52 }) + kword('QUELQUES MESSAGES', CX, 480, t, Qu - .05, { size: 72, fill: SX.acc2 }); },
  sfx: [[at(36, 'attends'), 'tick', .5], [at(36, 'quelques') - .05, 'boom', .4], [at(36, 'messages'), 'heartbeat', .6], [at(36, 'messages') + .3, 'tick', .4]] });

// B037 — « Pas pour Noël. » : rayons sapin, le sapin barré
B(37, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), shake: 3 }),
  draw: (t, d, T) => { const Pa = at(37, 'pas'), No = at(37, 'noel');
    return rays(t, CX, 950, '#45b067', SAPIN, 22) + nSnow(t, 20) + G(tr(CX, 1240, 1), nTree(0, 0, .85, t)) + cross(CX, 900, 2.0, t, No) +
      nHead(150, 1080, 110, { expr: 'deadpan' }, t) + kword('PAS POUR NOËL.', CX, 450, t, Pa - .05, { size: 96, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .4], [at(37, 'pas') - .05, 'boom', .5], [at(37, 'noel'), 'buzz', .5], [at(37, 'noel') + .05, 'thud', .5]] });

// B038 — « Juste pour toi. » : douceur, tu rêves d'un petit gâteau à une bougie, cœurs
B(38, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const Ju = at(38, 'juste');
    const dream = G(tr(780, 800, pop(t, .05, .4)), cloud(0, 0, 1.8, '#fff', 7) + circ(-200, 150, 22, '#fff', 6) + circ(-250, 205, 13, '#fff', 5) + nCake(0, 70, .42, t, 1));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t, { night: 1 }), haze: .4 }, { z: 1, svg: nHead(360, 1000, 200, { expr: 'sad', look: [1, -1], face: { blush: 1 } }, t) }]) + dream + heartsUp(t, 380, 900, 4) +
      kword('JUSTE POUR TOI', CX, 460, t, Ju - .05, { size: 86, fill: '#ff8fb1' }); },
  sfx: [[0, 'magic', .4], [at(38, 'juste') - .05, 'pop', .4], [at(38, 'pour'), 'sparkle', .4]] });

// B039 — « Et quand Kevin t'écrit enfin… » : bzzz, la notif « Kevin » tombe, yeux étoilés
B(39, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3, shake: t > at(39, 'kevin') && t < at(39, 'kevin') + .5 ? 4 : 0 }),
  draw: (t, d, T) => { const Ke = at(39, 'kevin'), En = at(39, 'enfin'), dy = 160 * (1 - eOutBack(seg(t, Ke - .1, Ke + .25))), vib = t > Ke ? Math.sin(t * 70) * 5 : 0;
    const notif = t > Ke - .1 ? G(tr(640, 910 - dy), rect(-240, -60, 480, 120, '#fff', 24, 5) + nKevHead(-180, 0, 40, { expr: 'happy' }, t) + ftext(-120, -8, 'Kevin', { size: 38, fill: OL, stroke: 'none', anchor: 'start' }) + ftext(-120, 34, 'Nouveau message', { size: 26, fill: '#7d848c', stroke: 'none', anchor: 'start' })) : '';
    const inner = grad('#3a3f8a', '#8a6ad8', 380, 640, 520, 640) + ftext(640, 770, '08:32', { size: 110, fill: '#fff', stroke: 'none' }) + notif;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t, { night: 1 }), haze: .45 }]) + G(tr(vib, 0), nPhoneUI(640, 960, 520, 640, t, inner, { bg: '#3a3f8a' })) + nHead(170, 1060, 120, { expr: t > Ke ? 'wow' : 'worried', look: [1, -.5] }, t) +
      kthin('et quand', CX, 400, t, 0, { size: 56 }) + kword('KEVIN', CX, 470, t, Ke - .05, { size: 110, fill: '#7be07b' }) + funTag(880, 1080, 'ENFIN !', t, En - .05, { size: 46, bg: SX.acc2, fg: SX.ink, r: 8 }); },
  sfx: [[at(39, 'kevin') - .1, 'vibrate', .6], [at(39, 'kevin') - .05, 'ding', .6], [at(39, 'ecrit'), 'pop_hi', .4], [at(39, 'enfin') - .05, 'tada', .4]] });

// B040 — « Joyeux Noël frérot ! » : la discussion s'ouvre : Kevin à bois de renne… « Joyeux Noël frérot ! »
B(40, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Jo = at(40, 'joyeux'), Fr = at(40, 'frerot');
    const inner = chatBubble(560, 720, 380, 120, 'Joyeux Noël\nfrérot !', t, Jo, false, 40) + (t > Jo + .2 ? G(tr(500, 900, pop(t, Jo + .2, .35)), rect(-120, -90, 240, 180, '#fff', 20, 5) + nKevHead(0, 20, 60, { expr: 'ecstatic' }, t) + nTree(85, 80, .1, t)) : '');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t, { night: 1 }), haze: .45 }]) + nPhoneUI(640, 880, 520, 720, t, inner, { name: 'Kevin', kx: 'ecstatic' }) + nHead(170, 1060, 120, { expr: t > Fr ? 'deadpan' : 'wow', look: [1, -.5] }, t) +
      kword('JOYEUX NOËL', CX, 410, t, Jo - .05, { size: 96, fill: '#7be07b' }) + (t > Fr ? kthin('frérot !', 230, 790, t, Fr - .1, { size: 54 }) : ''); },
  sfx: [[at(40, 'joyeux') - .05, 'ding', .6], [at(40, 'joyeux'), 'pop', .5], [at(40, 'noel'), 'magic', .4], [at(40, 'frerot'), 'crickets', .5]] });

// B041 — « Tu souris. Puis tu réponds : » : gros plan, sourire crispé, l'œil qui tique
B(41, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d) }),
  draw: (t, d, T) => { const So = at(41, 'souris'), Re = at(41, 'reponds'), tic = t > So && Math.sin(t * 25) > .6;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t, { night: 1 }), haze: .45 }, { z: 1, svg: nHead(CX, 1000, 230, { expr: t > So ? 'happy' : 'deadpan', face: tic ? { eyes: 'half' } : {}, tilt: tic ? 3 : 0 }, t) }]) +
      (t > So ? sparkle(660, 1090, .9 + .2 * Math.sin(t * 20), '#fff') + sweat(760, 820, 1.2) : '') + kthin('tu souris.', CX, 420, t, 0, { size: 64, out: Re - .3 }) + kthin('puis tu réponds :', CX, 420, t, Re - .2, { size: 60 }); },
  sfx: [[at(41, 'souris'), 'glint', .6], [at(41, 'souris') + .3, 'tick', .4], [at(41, 'reponds'), 'typing', .6]] });

// B042a — « MERCI KEVIN. » : tu tapes comme un fou, sourire-rage
const O42 = at(42, 'au') - .15;
B(42, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 4 }),
  draw: (t, d, T) => { const Me = at(42, 'merci'), Ke = at(42, 'kevin'), str = 'MERCI KEVIN.', n = Math.floor(seg(t, Me - .1, Ke + .3) * str.length);
    const inner = chatBubble(560, 700, 380, 120, 'Joyeux Noël\nfrérot !', t, -1, false, 40) + (n > 0 ? rect(560, 860, 300, 90, '#7fd3a0', 28, 5) + ftext(710, 920, str.slice(0, n), { size: 34, fill: OL, stroke: 'none' }) : '');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: nSalon(t, { night: 1 }), haze: .45 }]) + nPhoneUI(640, 880, 520, 720, t, inner, { name: 'Kevin' }) + nHead(170, 1060, 130, { expr: 'rage', face: { mouth: 'grin' } }, t) +
      kword('MERCI KEVIN.', CX, 430, t, Me - .05, { size: 110, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .4], [at(42, 'merci') - .05, 'boom', .6], [at(42, 'merci'), 'typing', .7], [at(42, 'kevin'), 'typing', .6]] });
// B042b — FIN : « AU FAIT, JE SUIS NÉ AUJOURD'HUI. » : grille + neige, débloqué, Kevin tombe des nues, le Père Noël rend le gâteau
B(42, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(42, 'ne') - O42 && t < at(42, 'ne') - O42 + .4 ? 6 : 0 }),
  draw: (t, d, T) => { const Au = at(42, 'au') - O42, Je = at(42, 'je') - O42, Ne = at(42, 'ne') - O42, Aj = at(42, 'aujourd') - O42, sx = lerp(1300, 880, eOutCubic(seg(t, Aj + .2, Aj + .8)));
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + nSnow(t, 30) + burst(CX, 1000, 300, t, Ne, SX.acc, 18) + unlock(CX, 1000, t, Ne, { part: 'back', r: 480 }) +
      cutout(nTeen({ x: CX, y: 1520, s: 1.15, expr: t > Ne ? 'ecstatic' : 'smugger', armL: t > Ne ? [-150, -120] : [110, 100], armR: t > Ne ? [-30, -60] : [160, 200] }, t), 12) + unlock(CX, 1000, t, Ne, { part: 'front', r: 480 }) +
      (t > Ne ? G(tr(180, 900, pop(t, Ne + .1, .35), -8), cutout(rect(-120, -120, 240, 240, '#fff', 30, 6) + nKevHead(0, 10, 85, { expr: 'jawdrop' }, t), 8)) : '') +
      cutout(nSanta({ x: sx, y: 1530, s: .95, expr: 'embarrassed', flip: 1, armL: [-80, -100], holdL: nCake(0, -10, .35, t, 3) }, t), 10) +
      kthin('au fait,', CX, 400, t, Au - .1, { size: 60 }) + kword('JE SUIS NÉ', CX, 520, t, Je - .05, { size: 110, fill: '#fff' }) + kword("AUJOURD'HUI.", CX, 670, t, Aj - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(42, 'au') - O42, 'pop_hi', .4], [at(42, 'je') - O42 - .05, 'boom', .6], [at(42, 'ne') - O42, 'sparkle', .5], [at(42, 'ne') - O42 + .1, 'gasp', .5], [at(42, 'aujourd') - O42 - .05, 'boom', .7], [at(42, 'aujourd') - O42 + .25, 'tiptoe', .4], [at(42, 'aujourd') - O42 + .6, 'tada', .5]] }, O42);

SCENES.sort((a, b) => a.s - b.s);
