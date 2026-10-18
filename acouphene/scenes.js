// ============================================================
//  « Pourquoi c'est horrible d'avoir des acouphènes ? » — style SIZEX fun — 9:16, calé mot à mot
//  (words.js + timing.js générés par tools/prep.py --realign ; BT[6] recalé à la main sur « Sof » = « Sauf »).
//  Intro motion (3 plans), puis vrais décors vivants + couche motion. Le sifflement est VISIBLE : ondes violettes, « iii » qui flottent,
//  et un petit monstre-sifflement (« iiiBug ») qui suit le héros partout.
//  TOTAL et BT viennent de timing.js (ne pas les redéfinir ici). BT[n-1] = début du bloc n.
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

// ---------- aides (template) ----------
const rays = (t, cx, cy, c1, c2, n = 20) => sunburst(cx, cy, n, c1, c2, t * 12);
function cross(x, y, s, t, t0 = 0) { const k = pop(t, t0, .3); return k <= 0 ? '' : G(tr(x, y, s * k), path('M-80 -80L80 80M80 -80L-80 80', 'none', 46) + path('M-80 -80L80 80M80 -80L-80 80', 'none', 28, '#ff4d4d')); }
function stamp(x, y, str, t, t0, col = '#e2463a', r = -12, size = 84) { const k = seg(t, t0, t0 + .18); if (k <= 0) return ''; const s = lerp(2.2, 1, eOutCubic(k)); const w = str.length * size * .62 + 70; return G(tr(x, y, s, r), rect(-w / 2, -size * .72, w, size * 1.44, 'rgba(255,255,255,.85)', 14, 12, col) + text(0, size * .36, 'none', str, col, size)); }
function confetti(t, t0 = 0, n = 40, seed = 4) { const r = rng(seed); let s = ''; const k = t - t0; if (k < 0) return ''; const cols = ['#ff6fa5', '#ffd23f', '#5ec4f0', '#7be07b', '#ff8a3d']; for (let i = 0; i < n; i++) { const x = r() * W, y = -50 + (r() * 300 + k * (300 + r() * 300)) % (H + 100); s += rect(x, y, 18, 30, cols[i % 5], 4, 0).replace('/>', ` transform="rotate(${f1(k * 200 + i * 40)} ${f1(x)} ${f1(y)})"/>`); } return s; }
function sweatSpray(x, y, t, n = 6) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * 2 + i / n) % 1, sd = i % 2 ? 1 : -1; s += op(1 - k, sweat(x + sd * (60 + 220 * k), y - 120 * k + 260 * k * k, .8)); } return s; }
const zin = (a = 1, b = 1.12, hand = 0) => (t, d) => ({ z: lerp(a, b, eInOut(clamp(t / d))), hand });
const camHand = (z = 1.06, a = 1) => () => ({ z, hand: a });
function clipR(x, y, w, h, svg, rx = 18) { const id = 'cl' + (_gid++); return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }
function clipC(x, y, r, svg) { const id = 'cc' + (_gid++); return `<defs><clipPath id="${id}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }

// ============================================================
//  SIZEX fun : accent violet « onde sonore », jaune marqueur, turquoise
// ============================================================
sxFun('#8a5cff'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';

// ---------- décors vivants ----------
const M = 700;
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff');
function tiles(c1, c2, size = 120, x0 = -M, y0 = -M, w = W + 2 * M, h = H + 2 * M) { let s = rect(x0, y0, w, h, c1, 0, 0); for (let x = x0; x < x0 + w; x += size) s += line(x, y0, x, y0 + h, 4, c2); for (let y = y0; y < y0 + h; y += size) s += line(x0, y, x0 + w, y, 4, c2); return s; }
function kidsBg(t, y = 1150, n = 4, sc = .45) { let s = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; s += person({ age: 'kid', x, y, s: sc, hair: ['curly', 'bun', 'short', 'ponytail'][i % 4], hairColor: ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040'][i % 4], shirt: ['#ff8fb1', '#7aa6d8', '#ffd23f', '#7be07b'][i % 4], expr: 'happy', walk: 3, flip: i % 2, seed: 20 + i }, t); } return s; }
// ---------- accessoires de décor (passe « DÉCORS RICHES », factorisés, préfixe d pour ne pas écraser le moteur) ----------
const WASH = (c = 'rgba(255,255,255,.14)') => rect(-M, -M, W + 2 * M, H + 2 * M, c, 0, 0); // voile léger : décor moins saturé derrière les persos
function dStripes(y1, c1, c2, step = 120, bw = 50) { let s = rect(-M, -M, W + 2 * M, y1 + M, c1, 0, 0); for (let x = -M; x < W + M; x += step) s += rect(x, -M, bw, y1 + M, c2, 0, 0); return s; }
function dDots(y1, c, step = 90, r = 7) { let s = ''; for (let y = -40, j = 0; y < y1 - 30; y += step, j++) for (let x = -M + (j % 2) * step / 2; x < W + M; x += step) s += circ(x, y, r, c, 0); return s; }
function dParquet(y, c1 = '#c49a6c', c2 = '#a97f55', lh = 46) { let s = rect(-M, y, W + 2 * M, H + 2 * M - y, c1, 0, 0);
  for (let j = 0; y + j * lh < H + M; j++) { const yy = y + j * lh; s += line(-M, yy, W + M, yy, 3, c2); for (let x = -M + ((j * 137) % 230); x < W + M; x += 230) s += line(x, yy, x, yy + lh, 3, c2); }
  return s; }
function dChecker(y, c1, c2, size = 110, y1 = H + M) { let s = rect(-M, y, W + 2 * M, y1 - y, c1, 0, 0); for (let yy = y, j = 0; yy < y1; yy += size, j++) for (let x = -M + (j % 2) * size; x < W + M; x += size * 2) s += rect(x, yy, size, size, c2, 0, 0); return s; }
function dTiles(x0, y0, x1, y1, c1, c2, size = 100) { let s = rect(x0, y0, x1 - x0, y1 - y0, c1, 0, 0); for (let x = x0; x <= x1; x += size) s += line(x, y0, x, y1, 4, c2); for (let y = y0; y <= y1; y += size) s += line(x0, y, x1, y, 4, c2); return s; }
const dBase = (y, c = '#fff') => rect(-M, y - 28, W + 2 * M, 30, c, 0, 5) + line(-M, y, W + M, y, 6);
const dOutlet = (x, y) => rect(x - 26, y - 26, 52, 52, '#fbfbf4', 10, 5) + circ(x, y, 15, '#ecece4', 3) + circ(x - 6, y, 3.5, OL, 0) + circ(x + 6, y, 3.5, OL, 0);
const dSwitch = (x, y) => rect(x - 24, y - 32, 48, 64, '#fbfbf4', 10, 5) + rect(x - 11, y - 16, 22, 32, '#e6e6dc', 5, 3);
// cadre photo : k 0 paysage, 1 portrait, 2 cœur
function dPic(x, y, w, h, k = 0, fr = '#c38a52', bg = '#bfe6ff', r = 0) { let s = rect(-w / 2, -h / 2, w, h, fr, 6, 5) + rect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20, bg, 0, 3);
  if (k === 0) s += path(`M${-w / 2 + 12} ${h / 2 - 12}L${-w * .15} ${-h * .1}L${w * .05} ${h * .15}L${w * .2} ${-h * .05}L${w / 2 - 12} ${h / 2 - 12}Z`, '#7cc46a', 3) + circ(w * .22, -h * .22, Math.min(w, h) * .09, '#ffd23f', 0);
  else if (k === 1) s += circ(0, -h * .08, Math.min(w, h) * .18, '#f2c9a0', 3) + path(`M${-w * .28} ${h / 2 - 12}Q0 ${h * .05} ${w * .28} ${h / 2 - 12}Z`, '#ff8fb1', 3);
  else s += heart(0, 0, Math.min(w, h) / 220, '#ff5d73');
  return G(tr(x, y, 1, r), s + circ(0, -h / 2 - 22, 5, OL, 0) + path(`M${-w * .3} ${-h / 2}L0 ${-h / 2 - 22}L${w * .3} ${-h / 2}`, 'none', 3)); }
function dPoster(x, y, w, h, bg, l1, l2, fg = '#fff', r = 0, c2 = SX.acc2) { return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, bg, 10, 5) + ftext(0, -h * .04, l1, { size: Math.min(w / (l1.length * .62), h * .3), fill: fg, stroke: 'none' }) + (l2 ? ftext(0, h * .28, l2, { size: Math.min(w / (l2.length * .62), h * .2), fill: c2, stroke: 'none' }) : '') +
  rect(-w / 2 - 8, -h / 2 - 8, 34, 16, 'rgba(255,255,255,.7)', 3, 0) + rect(w / 2 - 26, -h / 2 - 8, 34, 16, 'rgba(255,255,255,.7)', 3, 0)); }
// rangée de livres posée sur y (de x vers la droite)
function dBooks(x, y, n, seed = 1, hmax = 90) { const r = rng(seed), cols = ['#ff6b6b', '#4d7cf0', '#ffd23f', '#7be07b', '#b56cff', '#ff9a3c', '#36c5b4', '#ff8fb1']; let s = '', xx = x;
  for (let i = 0; i < n; i++) { const w = 18 + r() * 14, h = hmax * (.65 + r() * .35), c = cols[Math.floor(r() * cols.length)], lean = i === n - 1 && r() > .5;
    s += lean ? G(tr(xx + w / 2, y, 1, 18), rect(-w / 2, -h, w, h, c, 3, 4) + line(-w / 2 + 4, -h * .7, w / 2 - 4, -h * .7, 3, 'rgba(255,255,255,.6)')) : rect(xx, y - h, w, h, c, 3, 4) + line(xx + 4, y - h * .75, xx + w - 4, y - h * .75, 3, 'rgba(255,255,255,.6)'); xx += w + 2; }
  return s; }
const dShelf = (x, y, w, items = '', c = '#b98552') => items + rect(x, y, w, 18, c, 4, 5) + path(`M${x + 24} ${y + 18}l0 26l26 -26`, '#8a5a3a', 4) + path(`M${x + w - 24} ${y + 18}l0 26l-26 -26`, '#8a5a3a', 4);
const dTrophy = (x, y, s = 1) => G(tr(x, y, s), rect(-30, -14, 60, 14, '#8a5a3a', 3, 4) + rect(-8, -40, 16, 26, '#f2b632', 0, 4) + path('M-34 -96L34 -96Q30 -40 0 -40Q-30 -40 -34 -96Z', '#ffd23f', 5) + path('M-34 -86Q-56 -80 -40 -62M34 -86Q56 -80 40 -62', 'none', 5) + circ(0, -74, 8, '#fff6c0', 0));
const dJar = (x, y, c = '#ff6b6b', s = 1) => G(tr(x, y, s), rect(-24, -60, 48, 60, 'rgba(220,240,255,.7)', 10, 4) + rect(-20, -40, 40, 36, c, 6, 0) + rect(-26, -72, 52, 16, '#59616c', 5, 4));
const dBottle = (x, y, c = '#5ec4f0', s = 1) => G(tr(x, y, s), rect(-16, -64, 32, 64, c, 10, 4) + rect(-7, -80, 14, 18, '#fff', 3, 3) + rect(-10, -44, 20, 22, 'rgba(255,255,255,.7)', 3, 0));
const dCactus = (x, y, s = 1) => G(tr(x, y, s), path('M-8 -40Q-10 -110 0 -120Q10 -110 8 -40Z', '#6dbb7a', 4) + path('M-6 -70Q-30 -72 -28 -96', 'none', 10, OL) + path('M-6 -70Q-30 -72 -28 -96', 'none', 5, '#6dbb7a') + path('M-26 -42L-20 0L20 0L26 -42Z', '#e98a5a', 4) + circ(0, -122, 6, '#ff8fb1', 3));
const dMug = (x, y, t, c = '#ff6b6b') => G(tr(x, y), rect(-26, -50, 52, 50, c, 8, 4) + path('M26 -40Q46 -34 26 -16', 'none', 6)) + steam(x, y - 60, t, .35);
const dPens = (x, y) => G(tr(x, y), line(-10, -40, -18, -80, 6, '#ff6b6b') + line(0, -40, 4, -86, 6, '#4d7cf0') + line(10, -40, 20, -76, 6, '#ffd23f') + rect(-22, -44, 44, 44, '#7a8a99', 6, 4));
function dLamp(x, y, s, on = 0) { return G(tr(x, y, s), (on ? glow(0, -150, 200, '#fff3b0', .55) : '') + ell(0, 0, 50, 12, '#59616c', 4) + path('M0 0L-30 -110L20 -170', 'none', 8) + path('M0 -190L70 -150L40 -110L-20 -150Z', SX.acc, 5) + (on ? circ(30, -125, 10, '#fff6c0', 0) : '')); }
function dFloorLamp(x, y, s, on = 0, t = 0) { const fl = on ? .55 + .08 * Math.sin(t * 23) * Math.sin(t * 7) : 0; return G(tr(x, y, s), (on ? glow(0, -520, 260, '#ffd88a', fl) : '') + ell(0, 0, 60, 14, '#59616c', 4) + line(0, 0, 0, -480, 9) + path('M-70 -480L70 -480L45 -590L-45 -590Z', on ? '#ffe9a8' : '#ffd0a8', 5)); }
const dRug = (cx, cy, rx, ry, c1, c2) => ell(cx, cy, rx, ry, c1, 6) + ell(cx, cy, rx * .78, ry * .74, 'none', 6, c2) + ell(cx, cy, rx * .5, ry * .46, c2, 0) + Array.from({ length: 12 }, (_, i) => { const a = R(i * 30); return line(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, cx + Math.cos(a) * (rx + 18), cy + Math.sin(a) * (ry + 8), 4); }).join('');
function dCurtain(x, y, w, h, col, t, side = 1) { const sw = Math.sin(t * 1.6 + side) * 14; let d = `M${x} ${y}L${x + w} ${y}`; d += `Q${x + w + sw} ${y + h * .5} ${x + w * .55 + sw * 1.4} ${y + h}`;
  for (let i = 0; i < 3; i++) d += `q${-w * .09} 16 ${-w * .18} 0`; d += `Q${x - 6} ${y + h * .5} ${x} ${y}Z`;
  return path(d, col, 6) + [.3, .6].map(k => path(`M${x + w * k} ${y + 10}Q${x + w * k + sw * .6} ${y + h * .5} ${x + w * k * .9 + sw} ${y + h - 10}`, 'none', 4, 'rgba(0,0,0,.15)')).join(''); }
const dRail = (x0, x1, y) => line(x0, y, x1, y, 10) + circ(x0, y, 12, '#c38a52', 4) + circ(x1, y, 12, '#c38a52', 4);
// vue par une fenêtre (ciel, immeubles, arbre, nuages / nuit : lune, étoiles, fenêtres allumées)
function dView(x, y, w, h, t, night = 0) { let s = night ? grad('#0f163a', '#26306a', x, y, w, h) : grad('#8fd3ff', '#e6f6ff', x, y, w, h);
  if (night) { s += circ(x + w * .72, y + h * .22, 34, '#fff6d6', 0) + glow(x + w * .72, y + h * .22, 120, '#fff6d6', .35); for (let i = 0; i < 9; i++) s += sparkle(x + 20 + (i * 97) % (w - 40), y + 20 + (i * 53) % (h * .45), .1 + .07 * Math.sin(t * 4 + i), '#fff6d6'); }
  else s += cloud(x + ((t * 35) % (w + 200)) - 100, y + h * .2, .35, '#fff') + cloud(x + w - ((t * 22 + 80) % (w + 200)) + 60, y + h * .38, .25, '#fff');
  const r = rng(9); for (let i = 0; i < 5; i++) { const bw = 50 + r() * 50, bh = h * (.3 + r() * .4), bx = x - 10 + i * w / 4.5, c = night ? '#2a2f55' : ['#b9c6d8', '#c9d3e0', '#a9b8cc'][i % 3];
    s += rect(bx, y + h - bh, bw, bh + 4, c, 3, 3); for (let j = 0; j < Math.floor(bh / 34); j++) for (let k = 0; k < 2; k++) s += rect(bx + 10 + k * bw * .45, y + h - bh + 12 + j * 34, bw * .28, 16, night ? (r() > .45 ? '#ffd86b' : '#3a4070') : 'rgba(255,255,255,.7)', 2, 0); }
  s += circ(x + w * .18, y + h - 40, 70, night ? '#1d3a2a' : '#7cc46a', 4) + circ(x + w * .3, y + h - 70, 55, night ? '#24452f' : '#8fd47a', 4) + rect(x + w * .22, y + h - 20, 16, 30, '#8a5a3a', 0, 0);
  return clipR(x, y, w, h, s, 6); }
function dWindow(x, y, w, h, t, night = 0, cur = '#ffd0e0') { return dView(x, y, w, h, t, night) + rect(x, y, w, h, 'none', 6, 9) + line(x + w / 2, y, x + w / 2, y + h, 7) + line(x, y + h * .45, x + w, y + h * .45, 7) + line(x + 20, y + 18, x + 40, y + 48, 5, 'rgba(255,255,255,.7)') +
  rect(x - 26, y + h, w + 52, 22, '#fff', 6, 5) + dRail(x - 60, x + w + 60, y - 22) + dCurtain(x - 60, y - 22, w * .3, h + 70, cur, t, 1) + dCurtain(x + w + 60 - w * .3, y - 22, w * .3, h + 70, cur, t, -1); }
function dBed(x, y, s = 1, night = 0) { const duv = night ? '#5b5fa8' : '#ff9a3c'; let d = rect(-260, -260, 50, 300, '#b98552', 14) + rect(-240, -60, 520, 120, '#b98552', 12) + rect(-230, -100, 500, 70, '#fff', 20) +
  rect(-215, -165, 150, 80, '#fff', 30) + rect(-80, -150, 130, 66, '#bfe6ff', 28) + path('M-120 -110Q100 -150 290 -100L290 30L-120 30Z', duv, 6);
  for (let i = 0; i < 5; i++) d += circ(-60 + i * 70, -40 + (i % 2) * 30, 12, 'rgba(255,255,255,.5)', 0);
  d += G(tr(150, -128), circ(-24, -36, 16, '#c88a52', 4) + circ(24, -36, 16, '#c88a52', 4) + circ(0, -16, 32, '#c88a52', 5) + circ(-10, -20, 4, OL, 0) + circ(10, -20, 4, OL, 0) + ell(0, -8, 8, 5, OL, 0) + ell(0, 18, 28, 22, '#c88a52', 5));
  return G(tr(x, y, s), d); }
function dDesk(x, y, s, t, night = 0) { return G(tr(x, y, s), rect(-200, -20, 400, 26, '#b98552', 6, 5) + rect(-185, 6, 26, 220, '#a2703f', 4, 4) + rect(159, 6, 26, 220, '#a2703f', 4, 4) + rect(40, 6, 130, 120, '#c99a63', 6, 4) + circ(105, 66, 7, OL, 0) +
  rect(-130, -130, 170, 110, '#2b2b33', 10, 5) + rect(-120, -122, 150, 92, night ? '#7fd0ff' : '#cfe8ff', 5, 0) + rect(-150, -24, 210, 12, '#59616c', 5, 4) + (night ? glow(-45, -80, 160, '#7fd0ff', .3) : '') +
  rect(60, -60, 60, 40, '#fff', 3, 3) + line(66, -48, 110, -48, 3, '#9aa3ad') + line(66, -36, 104, -36, 3, '#9aa3ad')) + dLamp(x + 150 * s, y - 20 * s, .8 * s, night) + dMug(x - 170 * s, y - 20 * s, t) + dPens(x + 95 * s, y - 20 * s); }
const dSneakers = (x, y, c = '#fff', s = 1) => G(tr(x, y, s), path('M-70 0L-70 -30Q-60 -50 -30 -46L10 -30L40 -26Q60 -20 60 0Z', c, 5) + line(-66, -8, 56, -8, 5, '#ff4f87') + path('M20 0L20 -30Q30 -50 60 -46L100 -30L130 -26Q150 -20 150 0Z', c, 5) + line(24, -8, 146, -8, 5, '#ff4f87'));
const dBag = (x, y, c = '#4d7cf0', s = 1) => G(tr(x, y, s), path('M-60 0L-70 -120Q-60 -160 0 -160Q60 -160 70 -120L60 0Z', c, 6) + rect(-40, -80, 80, 50, shade(c, -.15), 10, 5) + path('M-30 -160Q-30 -200 0 -200Q30 -200 30 -160', 'none', 8) + circ(0, -120, 6, '#ffd23f', 3));
const dBox = (x, y, w = 160, h = 110, c = '#d8a96a') => rect(x - w / 2, y - h, w, h, c, 4, 5) + line(x - w / 2, y - h + 24, x + w / 2, y - h + 24, 4) + rect(x - 20, y - h, 40, 30, 'rgba(255,255,255,.35)', 0, 0);
const dBin = (x, y, c = '#7a8a99', s = 1) => G(tr(x, y, s), path('M-50 0L-60 -130L60 -130L50 0Z', c, 5) + rect(-66, -144, 132, 20, shade(c, -.15), 6, 5) + line(-20, -110, -16, -20, 4, 'rgba(0,0,0,.2)') + line(20, -110, 16, -20, 4, 'rgba(0,0,0,.2)') + G(tr(0, -150, 1, 20), rect(-16, -20, 32, 26, '#fff', 4, 3)));
const dBall = (x, y, r, c1 = '#ff6b6b', c2 = '#fff', a = 0) => G(tr(x, y, 1, a), circ(0, 0, r, c2) + path(`M${-r} 0A${r} ${r} 0 0 1 ${r} 0Z`, c1, 0) + path(`M0 ${-r}Q${r * .5} 0 0 ${r}`, 'none', 4, '#ffd23f') + circ(0, 0, r, 'none'));
const dCalendar = (x, y) => rect(x - 50, y - 60, 100, 120, '#fff', 6, 5) + rect(x - 50, y - 60, 100, 30, SX.acc, 6, 5) + [0, 1, 2, 3].map(j => [0, 1, 2, 3].map(i => rect(x - 38 + i * 21, y - 18 + j * 18, 12, 10, j === 2 && i === 1 ? '#ff6b6b' : '#d9dee6', 2, 0)).join('')).join('');
function dBunting(x0, x1, y, t, cols = ['#ff6b6b', '#ffd23f', '#5ec4f0', '#7be07b']) { let s = path(`M${x0} ${y}Q${(x0 + x1) / 2} ${y + 100} ${x1} ${y}`, 'none', 4); const n = Math.floor((x1 - x0) / 70);
  for (let i = 0; i < n; i++) { const k = (i + .5) / n, fx = lerp(x0, x1, k), fy = y + 200 * k * (1 - k) - 2, sw = Math.sin(t * 3 + i) * 6; s += path(`M${fx - 26} ${fy}L${fx + 26} ${fy}L${fx + sw} ${fy + 52}Z`, cols[i % cols.length], 4); } return s; }
const dCone = (x, y, s = 1) => G(tr(x, y, s), rect(-50, -10, 100, 14, '#ffd23f', 4, 4) + path('M-34 -10L0 -150L34 -10Z', '#ffd23f', 5) + path('M-24 -50L24 -50', 'none', 12, OL) + ftext(0, -64, '!', { size: 40, fill: OL, stroke: 'none' }));
const dVent = (x, y, w = 120, h = 60) => rect(x - w / 2, y - h / 2, w, h, '#e6e9ee', 6, 4) + [0, 1, 2].map(i => line(x - w / 2 + 12, y - h / 2 + 15 + i * 15, x + w / 2 - 12, y - h / 2 + 15 + i * 15, 4, '#9aa3ad')).join('');
const dNeon = (x0, x1, y, on = 1) => (on ? glow((x0 + x1) / 2, y, (x1 - x0) * .7, '#f4fbff', .5) : '') + rect(x0, y - 10, x1 - x0, 20, on ? '#fbfeff' : '#c9d1db', 10, 5) + line(x0 + 20, y - 26, x0 + 20, y - 10, 4) + line(x1 - 20, y - 26, x1 - 20, y - 10, 4);
const fgBlur = (svg, px = 9) => blur(px, svg);

// ---------- le héros (20 ans) : oreilles visibles + sifflement visualisé ----------
const HAIR = '#3a2a20', SHIRT = '#ff9a3c', PANTS = '#33415e';
const ears = r => [-1, 1].map(sd => ell(sd * r * .97, r * .08, r * .16, r * .24, SKIN, 6) + path(`M${f1(sd * r * 1.0)} ${f1(-r * .06)}q${f1(sd * r * .08)} ${f1(r * .13)} 0 ${f1(r * .26)}`, 'none', 4, 'rgba(150,70,50,.5)')).join('');
const earHair = (style = 'short', col = HAIR) => (r, t) => { const [b, f] = hairSvg(style, col, r, t); return [ears(r) + b, f]; };
const ptr = o => tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : '');
const guy = (o, t) => person(Object.assign({ age: 'adult', hairFn: earHair(), shirt: SHIRT, pants: PANTS, seed: 2 }, o), t);
const guyHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: earHair(), seed: 2 }, o), t));
const kevin = (o, t) => person(Object.assign({ age: 'adult', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const amie = (o, t) => person(Object.assign({ age: 'adult', hair: 'curly', hairColor: '#2b2420', shirt: '#b56cff', pants: '#4b3b6e', skin: '#c98a5e', seed: 5 }, o), t);
const amieHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'curly', hairColor: '#2b2420', skin: '#c98a5e', seed: 5 }, o), t));
const doc = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#8a5a3a', glasses: true, shirt: '#fff', coat: 1, stetho: 1, pants: '#4b5b7a', seed: 4 }, o), t);
const HEADY = -402; // centre de la tête d'un adulte dans le repère du perso

// ondes du sifflement (arcs violets qui partent des oreilles) — side : -1 / 1 / 0 = les deux
function ringing(x, y, r, t, k = 1, o = {}) { if (k <= 0) return ''; let s = ''; const sides = o.side ? [o.side] : [-1, 1];
  for (const sd of sides) { const ex = x + sd * r * 1.05;
    for (let i = 0; i < 3; i++) { const ph = (t * (o.sp || 1.6) + i / 3) % 1, Rr = r * (.35 + ph * (o.reach || .9)) * (.6 + .4 * k), a = R(42);
      const x1 = ex + sd * Math.cos(a) * Rr, y1 = y - Math.sin(a) * Rr, y2 = y + Math.sin(a) * Rr, d = `M${f1(x1)} ${f1(y1)}A${f1(Rr)} ${f1(Rr)} 0 0 ${sd > 0 ? 1 : 0} ${f1(x1)} ${f1(y2)}`;
      s += op((1 - ph) * k, path(d, 'none', r * .09 + 8, OL) + path(d, 'none', r * .09, o.col || SX.acc)); } }
  return s; }
const guyRing = (o, t, k = 1, oo = {}) => G(ptr(o), ringing(0, HEADY, 92, t, k, oo));
// « iii » qui flottent et montent
function iFloat(x, y, t, n = 5, o = {}) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * (o.sp || .7) + i / n) % 1, sz = (o.size || 56) * (.7 + .5 * ((i * 37) % 10) / 10);
  s += op(Math.min(1, (1 - k) * 2.2) * (o.o ?? 1), ftext(x + Math.sin(k * 7 + i * 2) * (o.w || 60) + (i - (n - 1) / 2) * (o.gap || 34), y - k * (o.h || 300), o.str || 'iii', { size: sz, fill: o.col || '#fff' })); } return s; }
// le monstre-sifflement : boule violette, 3 antennes « i », bouche ouverte qui chante
function iiiBug(x, y, s, t, o = {}) { const col = o.col || SX.acc, lx = (o.look || [0, 0])[0] * 8, ly = (o.look || [0, 0])[1] * 8; let g = '';
  for (let i = -1; i <= 1; i++) { const sw = Math.sin(t * 9 + i * 2) * 8; g += line(i * 30, -70, i * 42 + sw, -150, 9) + circ(i * 42 + sw, -168, 16, '#fff', 6); }
  g += blob(0, 0, 100, t, col, o.seed || 3) + ell(-34, -18, 26, 30, '#fff', 5) + ell(34, -18, 26, 30, '#fff', 5) + circ(-32 + lx, -12 + ly, 11, OL, 0) + circ(36 + lx, -12 + ly, 11, OL, 0);
  if (o.angry) g += line(-60, -58, -14, -40, 8) + line(60, -58, 14, -40, 8);
  g += o.sing === 0 ? path('M-28 34Q0 58 28 34', 'none', 8) : ell(0, 42, 22, 24 + 7 * Math.sin(t * 22), '#5a1f2a', 6) + ell(0, 54, 10, 6, '#ff8fb1', 0);
  if (o.mega) g += G(tr(70, 40, 1, -20), path('M0 -20L110 -70L110 70L0 20Z', '#ff6b6b', 7) + rect(-20, -24, 30, 48, '#ff6b6b', 6, 6));
  return G(tr(x, y + Math.sin(t * 4) * 10, s, (o.r || 0) + Math.sin(t * 3) * 6), g); }
// fil électrique / zigzag d'onde aiguë
function zig(x1, x2, y, t, amp = 30, col = SX.acc, n = 18) { let d = `M${x1} ${y}`; const w = (x2 - x1) / n; for (let i = 1; i <= n; i++) d += `L${f1(x1 + i * w)} ${f1(y + (i % 2 ? -1 : 1) * amp * (.6 + .4 * Math.sin(t * 30 + i)))}`; return path(d, 'none', 16, OL) + path(d, 'none', 8, col); }
function sayB(x, y, str, t, t0, o = {}) { const k = popEl(t, t0, .45); if (k <= 0) return ''; const sz = o.size || 46, w = Math.max(...str.split('\n').map(l => l.length)) * sz * .6 + sz * 1.4, L = str.split('\n'), h = L.length * sz * 1.25 + sz * .9, tx = o.tail ?? -w * .25;
  return G(tr(x, y, k, o.r ?? -2), path(`M${f1(tx - 30)} ${f1(h / 2 - 6)}L${f1(tx + (o.tdx ?? -40))} ${f1(h / 2 + 70)}L${f1(tx + 40)} ${f1(h / 2 - 6)}Z`, o.bg || '#fff', 7) + rect(-w / 2, -h / 2, w, h, o.bg || '#fff', 40, 7) + path(`M${f1(tx - 26)} ${f1(h / 2 - 4)}L${f1(tx + 36)} ${f1(h / 2 - 4)}`, 'none', 9, o.bg || '#fff') +
    L.map((l, i) => ftext(0, -h / 2 + sz * 1.05 + i * sz * 1.25, l, { size: sz, fill: o.fg || SX.ink, stroke: 'none', font: 'Fredoka' })).join('')); }
const zzz = (x, y, t) => [0, 1, 2].map(i => { const k = (t * .8 + i / 3) % 1; return op(1 - k, ftext(x + k * 60 + i * 10, y - k * 160, 'z', { size: 40 + i * 12, fill: '#fff' })); }).join('');

// ---------- accessoires de l'épisode ----------
function dTV(x, y, s, t, mode = 'show', on = 1) { let scr = '';
  if (!on) scr = rect(-230, -300, 460, 260, '#1b1d24', 8, 0) + line(-180, -270, -120, -230, 8, 'rgba(255,255,255,.12)');
  else if (mode === 'static') { const r = rng(Math.floor(t * 24)); scr = rect(-230, -300, 460, 260, '#8a8f99', 8, 0); for (let i = 0; i < 40; i++) scr += rect(-230 + r() * 440, -300 + r() * 250, 20 + r() * 40, 6, r() > .5 ? '#fff' : '#3a3d45', 0, 0); }
  else scr = grad('#7fd0ff', '#bfe8ff', -230, -300, 460, 260) + ell(0, -90, 230, 50, '#7be07b', 0) + circ(110, -230, 30, '#ffd23f', 0) + cloud(-80 + (t * 40 % 200), -230, .35, '#fff');
  return G(tr(x, y, s), rect(-300, 0, 600, 140, '#b98552', 10) + rect(-280, 30, 260, 90, '#a2703f', 6, 4) + rect(20, 30, 260, 90, '#a2703f', 6, 4) + circ(-150, 75, 7, OL, 0) + circ(150, 75, 7, OL, 0) +
    rect(-40, -30, 80, 30, '#59616c', 4, 5) + rect(-250, -320, 500, 300, '#2b2b33', 18) + scr + rect(-230, -300, 460, 260, 'none', 8, 4) + circ(220, -38, 6, on ? '#7be07b' : '#ff6b6b', 0) +
    G(tr(-200, 0), rect(-30, -60, 60, 60, '#59616c', 8, 4) + circ(0, -30, 18, '#2b2b33', 4)) + G(tr(210, 0), rect(-50, -16, 100, 16, '#2b2b33', 6, 4) + rect(-36, -40, 72, 24, '#e2463a', 6, 4))); }
function dFridge(x, y, s, t, open = 0) { let g = rect(-170, -720, 340, 720, '#f4f7fa', 30) + line(-170, -470, 170, -470, 6) + rect(120, -680, 22, 160, '#c9ced6', 10, 4) + rect(120, -420, 22, 200, '#c9ced6', 10, 4);
  g += [[-110, -640, '#ff6b6b'], [-20, -600, '#ffd23f'], [60, -650, '#5ec4f0'], [-90, -380, '#7be07b'], [40, -300, '#ff8fb1']].map(([a, b, c]) => circ(a, b, 14, c, 4)).join('');
  g += G(tr(-60, -560, 1, -6), rect(-60, -50, 120, 100, '#fff', 4, 4) + path('M-40 30L-10 -20L20 10L40 -10', 'none', 5, '#4d7cf0') + circ(30, -30, 10, '#ffd23f', 3)) + G(tr(30, -360, 1, 5), rect(-50, -70, 100, 140, '#fff8c0', 4, 4) + [0, 1, 2, 3].map(i => line(-36, -40 + i * 26, 30, -40 + i * 26, 4, '#9aa3ad')).join(''));
  g += G(tr(-80, -240, 1, -4), rect(-44, -56, 88, 112, '#fff', 4, 4) + circ(0, -10, 22, '#f2c9a0', 3) + path('M-30 40Q0 0 30 40', '#7aa6d8', 3));
  for (let i = 0; i < 3; i++) { const k = (t * 1.2 + i / 3) % 1; g += op(.5 * (1 - k), path(`M${f1(-200 - k * 50)} ${-500 + i * 60}q-20 -15 0 -30`, 'none', 5, '#9aa3ad')); } // ronronnement
  return G(tr(x, y, s), g + rect(-150, 0, 40, 14, '#59616c', 4, 3) + rect(110, 0, 40, 14, '#59616c', 4, 3)); }
function dCharger(x, y, s, t, plugged = 1) { let g = rect(-60, -60, 120, 120, '#fbfbf4', 16, 6) + circ(0, 0, 40, '#ecece4', 4);
  g += plugged ? rect(-34, -40, 68, 80, '#fff', 10, 6) + rect(-20, -20, 40, 6, '#c9ced6', 3, 0) + circ(18, 26, 5, '#7be07b', 0) + path('M0 40C0 160 -160 120 -180 260C-190 330 -120 360 -60 340', 'none', 12, OL) + path('M0 40C0 160 -160 120 -180 260C-190 330 -120 360 -60 340', 'none', 6, '#fff') : circ(-12, 0, 6, OL, 0) + circ(12, 0, 6, OL, 0);
  return G(tr(x, y, s), g); }
const dPhoneFlat = (x, y, s, t) => G(tr(x, y, s, -8), rect(-60, -110, 120, 220, '#2b2b33', 20) + rect(-50, -96, 100, 180, '#cfe8ff', 10, 0) + rect(-24, -40, 48, 80, 'none', 6, 5) + rect(-24, 40 - 80 * (.5 + .5 * Math.sin(t * 2)), 48, 80 * (.5 + .5 * Math.sin(t * 2)), '#7be07b', 4, 0) + rect(-10, -48, 20, 8, OL, 2, 0));
function dFuseBox(x, y, s, lever = 0, t = 0) { let g = rect(-160, -220, 320, 440, '#c9ced6', 16) + rect(-140, -200, 280, 400, '#e6e9ee', 10, 5);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 6; i++) g += rect(-120 + i * 40, -170 + j * 90, 30, 60, '#fff', 6, 4) + rect(-112 + i * 40, -150 + j * 90 + ((i + j) % 3 ? 0 : 14), 14, 18, OL, 3, 0);
  g += rect(-60, 110, 120, 70, '#59616c', 10, 5) + G(tr(0, 145, 1, lerp(-35, 35, lever)), rect(-14, -80, 28, 80, '#e2463a', 8, 5) + rect(-30, -96, 60, 30, '#e2463a', 12, 5));
  g += G(tr(110, -250), path('M0 -40L40 30L-40 30Z', '#ffd23f', 5) + ftext(0, 22, '⚡', { size: 34, fill: OL, stroke: 'none' }));
  return G(tr(x, y, s), g); }
function dSpeaker(x, y, s, t, beat = 1, col = '#2b2b33') { const p = beat ? 1 + .08 * Math.max(0, Math.sin(t * 13)) : 1;
  return G(tr(x, y, s), rect(-110, -360, 220, 360, col, 18) + circ(0, -250, 50 * p, '#4a4d57') + circ(0, -250, 22 * p, '#1b1d24', 4) + circ(0, -110, 80 * p, '#4a4d57') + circ(0, -110, 38 * p, '#1b1d24', 4) + circ(80, -330, 7, beat ? '#7be07b' : '#555', 0)); }
const notes = (x, y, t, n = 4, col = '#fff') => Array.from({ length: n }, (_, i) => { const k = (t * .7 + i / n) % 1; return op(1 - k, G(tr(x + Math.sin(k * 6 + i) * 70 + (i - n / 2) * 40, y - k * 280, .9 + .3 * (i % 2), Math.sin(k * 8) * 15), ftext(0, 0, i % 2 ? '♪' : '♫', { size: 70, fill: col }))); }).join('');
function dFan(x, y, s, t, on = 1) { const a = on ? t * 1400 : 20; let bl = ''; for (let i = 0; i < 3; i++) bl += G(`rotate(${f1(a + i * 120)})`, ell(0, -62, 34, 60, '#bfe6ff', 5));
  return G(tr(x, y, s), ell(0, 0, 110, 26, '#9aa3ad', 6) + rect(-14, -330, 28, 330, '#c9ced6', 8, 5) + G(tr(0, -420), bl + circ(0, 0, 26, '#5ec4f0', 5) + circ(0, 0, 130, 'none', 7) + [0, 30, 60, 90, 120, 150].map(d => G(`rotate(${d})`, line(-130, 0, 130, 0, 3, 'rgba(43,36,32,.5)'))).join(''))); }
const windGusts = (x, y, t, n = 5, dir = 1) => Array.from({ length: n }, (_, i) => { const k = (t * 1.5 + i / n) % 1; return op(1 - k, path(`M${f1(x + dir * k * 400)} ${y + (i - n / 2) * 50}q${dir * 60} -30 ${dir * 120} 0t${dir * 120} 0`, 'none', 7, '#fff')); }).join('');
const earplug = (x, y, s, r = 0) => G(tr(x, y, s, r), rect(-34, -60, 68, 120, '#ff9a3c', 30) + ell(0, -40, 28, 12, 'rgba(255,255,255,.35)', 0) + [0, 1, 2].map(i => circ(-12 + i * 12, 10 + (i % 2) * 14, 4, '#e07a2a', 0)).join(''));
const candleLight = (x, y, s, t) => G(tr(x, y, s), glow(0, -150, 260, '#ffd88a', .55 + .05 * Math.sin(t * 17)) + rect(-30, -120, 60, 120, '#fff6e0', 8) + line(0, -120, 0, -140, 5) + G(tr(0, -160, 1 + .1 * Math.sin(t * 20)), path('M0 -40Q20 -6 0 14Q-20 -6 0 -40Z', '#ffb340', 4)) + ell(0, 0, 60, 14, '#c9ced6', 5));
const bulbHang = (x, y, L, t, on = 1, col = '#fff6c0') => { const a = Math.sin(t * 1.4 + x) * 5; return G(tr(x, y, 1, a), line(0, 0, 0, L, 4) + path(`M-40 ${L + 40}L-20 ${L}L20 ${L}L40 ${L + 40}Z`, '#2b2b33', 5) + (on ? glow(0, L + 70, 140, '#ffe9a0', .4) : '') + circ(0, L + 50, 20, on ? col : '#ccc', 4)); };
const fairy = (x0, x1, y, t, sag = 70) => { let s = path(`M${x0} ${y}Q${(x0 + x1) / 2} ${y + sag * 2} ${x1} ${y}`, 'none', 4); const n = Math.floor((x1 - x0) / 60); for (let i = 0; i <= n; i++) { const k = i / n, fx = lerp(x0, x1, k), fy = y + 4 * sag * k * (1 - k); const on = Math.sin(t * 5 + i * 1.7) > -.3; s += (on ? glow(fx, fy + 14, 30, ['#ffe066', '#ff8fb1', '#7fd0ff'][i % 3], .6) : '') + circ(fx, fy + 14, 11, on ? ['#ffe066', '#ff8fb1', '#7fd0ff'][i % 3] : '#9aa3ad', 4); } return s; };
// ---------- extérieur ----------
function dLampPost(x, y, s, on = 1, t = 0) { return G(tr(x, y, s), (on ? glow(0, -560, 220, '#ffe9a0', .5 + .05 * Math.sin(t * 9)) : '') + rect(-16, -540, 32, 540, '#3b4256', 8, 5) + rect(-36, -30, 72, 30, '#3b4256', 8, 5) + path('M-60 -560L60 -560L40 -610L-40 -610Z', '#3b4256', 5) + rect(-40, -560, 80, 30, on ? '#fff3b0' : '#c9ced6', 6, 5)); }
const dCar = (x, y, s, col = '#e2463a', flip = 0) => G(tr(x, y, s) + (flip ? ' scale(-1 1)' : ''), path('M-230 -40L-230 -110Q-220 -140 -170 -140L-120 -140L-70 -220L110 -220L170 -140L220 -130Q240 -120 240 -80L240 -40Z', col, 7) + path('M-100 -145L-55 -205L20 -205L20 -145Z', '#bfe6ff', 5) + path('M40 -145L40 -205L100 -205L145 -145Z', '#bfe6ff', 5) + circ(-140, -40, 50, '#2b2b33') + circ(-140, -40, 20, '#c9ced6', 5) + circ(150, -40, 50, '#2b2b33') + circ(150, -40, 20, '#c9ced6', 5) + rect(215, -115, 26, 22, '#fff3b0', 6, 4) + rect(-235, -110, 20, 22, '#ff6b6b', 4, 4));
const dTree = (x, y, s, t, c = '#5fb85f') => G(tr(x, y, s, wave(t, .3, 2, x)), rect(-26, -280, 52, 280, '#8a5a3a', 10) + circ(0, -350, 150, c) + circ(-100, -270, 100, shade(c, -.08)) + circ(100, -280, 110, shade(c, .08)) + circ(-40, -400, 16, '#ff6b6b', 4) + circ(60, -320, 14, '#ff6b6b', 4));
const dBike = (x, y, s, col = '#4d7cf0') => G(tr(x, y, s), circ(-90, -60, 60, 'none', 8) + circ(90, -60, 60, 'none', 8) + path('M-90 -60L-20 -60L40 -150L-50 -150Z M40 -150L90 -60 M-50 -150L-60 -180 M40 -150L50 -190L80 -190', 'none', 10, col) + rect(-80, -190, 50, 14, OL, 6, 0));
const dBird = (x, y, s, t) => G(tr(x, y, s), path(`M-40 ${f1(-20 * Math.sin(t * 12))}Q-20 0 0 8Q20 0 40 ${f1(-20 * Math.sin(t * 12))}`, 'none', 7));
function dFacade(x, w, top, col, t, o = {}) { // immeuble avec boutique au rez-de-chaussée, balcons, fenêtres (allumées le soir)
  let s = rect(x, top, w, 1260 - top, col, 6) + rect(x - 10, top - 20, w + 20, 30, shade(col, -.15), 6, 5); const r = rng(o.seed || 3);
  for (let y = top + 50; y < 860; y += 170) for (let xx = x + 30; xx < x + w - 90; xx += 130) { const lit = o.eve && r() > .45; s += rect(xx, y, 90, 110, lit ? '#ffd86b' : '#cfe8ff', 6, 5) + line(xx + 45, y, xx + 45, y + 110, 4) + (r() > .6 ? rect(xx - 12, y + 92, 114, 18, '#3b4256', 4, 4) + [0, 1, 2, 3, 4].map(i => line(xx - 6 + i * 25, y + 92, xx - 6 + i * 25, y + 70, 4)).join('') + (r() > .5 ? plant(xx + 80, y + 92, .25) : '') : ''); }
  if (o.shop) { const sc = o.shopCol || '#e2463a'; s += rect(x + 10, 930, w - 20, 70, '#2b2b33', 8, 5) + ftext(x + w / 2, 980, o.shop, { size: Math.min(46, (w - 60) / (o.shop.length * .62)), fill: o.neon && Math.sin(t * 7) < -.85 ? '#777' : '#fff', stroke: 'none' });
    for (let i = 0; i * 60 < w - 20; i++) s += path(`M${x + 10 + i * 60} 1000L${x + 70 + i * 60} 1000L${x + 70 + i * 60} 1050Q${x + 40 + i * 60} 1070 ${x + 10 + i * 60} 1050Z`, i % 2 ? '#fff' : sc, 4);
    s += rect(x + 30, 1080, w * .55, 170, o.eve ? '#ffe2a0' : '#cfe8ff', 6, 6) + rect(x + w * .65, 1080, w * .28, 180, '#7a5a3a', 6, 6) + circ(x + w * .7, 1170, 6, '#ffd23f', 3) + (o.goods ? [0, 1, 2].map(i => circ(x + 70 + i * 50, 1230, 22, ['#e8b060', '#d89040', '#f0c070'][i], 4)).join('') : ''); }
  if (o.cross) s += G(tr(x + w - 60, 880), (Math.sin(t * 6) > 0 ? glow(0, 0, 90, '#7be07b', .5) : '') + rect(-16, -46, 32, 92, '#3aa65a', 4, 4) + rect(-46, -16, 92, 32, '#3aa65a', 4, 4));
  return s; }
function walkers(t, y, n = 3, sc = .5, seed = 60) { let s = ''; for (let i = 0; i < n; i++) { const dir = i % 2 ? 1 : -1, x = ((i * 430 + t * (70 + i * 20) * dir) % 1700 + 1700) % 1700 - 300;
  s += person({ age: 'adult', x, y: y + (i % 2) * 30, s: sc, hair: ['bun', 'short', 'curly', 'side'][i % 4], hairColor: ['#8a5a3a', '#2b2420', '#e0a040', '#5a3a26'][i % 4], shirt: ['#7aa6d8', '#ff8fb1', '#7be07b', '#ffd23f'][i % 4], pants: '#3b3f4a', expr: 'happy', walk: 3, flip: dir < 0, seed: seed + i }, t); } return s; }
// rue (soir par défaut / jour) : ciel, nuages, oiseaux, 3 couches d'immeubles, boutiques, lampadaires, voiture, vélo, arbre, poubelle, passants
function streetBg(t, o = {}) { const eve = !o.day; let s = grad(eve ? '#ff8f70' : '#8fd3ff', eve ? '#ffd9a0' : '#e6f6ff', -M, -M, W + 2 * M, 1900);
  s += circ(820, 520, 90, eve ? '#ffcf70' : '#fff3b0', 0) + glow(820, 520, 260, '#fff3b0', .4) + cloud(((t * 30) % 1600) - 300, 200, 1.2, eve ? '#ffc1a8' : '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 380, .8, eve ? '#ffb39a' : '#fff');
  s += dBird(((t * 120) % 1500) - 200, 300 + Math.sin(t * 2) * 20, .8, t) + dBird(((t * 120 + 90) % 1500) - 200, 340, .6, t + .3);
  let far = ''; for (let i = -2; i < 7; i++) far += building(-150 + i * 200, 1000, 190, 380 + (i * 137 % 260), eve ? '#c08aa0' : '#b9c6d8', eve ? '#ffd86b' : '#e6f6ff');
  s += op(.55, far);
  s += dFacade(-300, 470, 330, eve ? '#e8b48a' : '#f0d9b5', t, { shop: 'BOULANGERIE', shopCol: '#e2463a', eve, goods: 1, seed: 4 }) + dFacade(190, 400, 420, eve ? '#c9a3c4' : '#cfd8e2', t, { shop: 'PHARMACIE', shopCol: '#3aa65a', eve, cross: 1, seed: 7 }) + dFacade(610, 480, 280, eve ? '#e7a08a' : '#f0b8a8', t, { shop: o.shop || 'CAFÉ', shopCol: '#4d7cf0', eve, neon: 1, seed: 9 });
  s += rect(-M, 1250, W + 2 * M, 80, '#cfc7bd', 0, 5) + rect(-M, 1330, W + 2 * M, 900, '#7d848c', 0, 0) + [0, 1, 2, 3, 4, 5, 6].map(i => rect(-100 + i * 220 - (t * 0) , 1560, 120, 18, '#f4f4f4', 4, 0)).join('');
  s += dLampPost(120, 1290, .9, eve, t) + dLampPost(980, 1290, .9, eve, t) + dTree(560, 1290, .65, t, '#5fb85f') + dBin(330, 1300, '#3aa65a', .7) + dBike(820, 1300, .7, '#ff6b6b') + walkers(t, 1290, 3, .42);
  s += dCar(((t * 260) % 2200) - 500, 1500, .8, '#4d7cf0') + dCar(260, 1720, 1, '#ffd23f', 1);
  return s; }
// ---------- intérieurs ----------
// entrée : porte d'entrée (judas, poignée, paillasson), portemanteau, étagère à chaussures, console + vide-poche, miroir, cadres, interrupteur, compteur électrique
function hallway(t, o = {}) { let s = dStripes(1250, '#cfe6d8', '#c2dccc', 110, 40) + dDots(1250, 'rgba(255,255,255,.35)', 110, 6);
  const dx = o.doorX ?? 300, open = o.open || 0; s += rect(dx - 190, 240, 380, 1010, '#8a5a3a', 8) + G(tr(dx - 170, 260) + ` scale(${f1(1 - open * .8)} 1)`, rect(0, 0, 340, 990, '#c96a3c', 6, 6) + rect(40, 60, 260, 380, 'none', 6, 5, 'rgba(0,0,0,.25)') + rect(40, 520, 260, 400, 'none', 6, 5, 'rgba(0,0,0,.25)') + circ(170, 150, 14, '#2b2b33', 4) + circ(290, 520, 18, '#ffd23f', 5) + rect(270, 515, 50, 14, '#ffd23f', 6, 4));
  s += wallClock(620, 200, 44, t, 6) + dPic(800, 300, 140, 110, 0) + dPic(960, 330, 100, 130, 1, '#7a5a3a', '#fff1d6', 4) + G(tr(700, 520), rect(-90, -130, 180, 260, '#f1c27d', 40, 6) + grad('#e6f6ff', '#b9dcef', -70, -110, 140, 220).replace('<rect', '<rect rx="30"') + line(-40, -60, 0, -100, 8, 'rgba(255,255,255,.8)'));
  s += line(560, 640, 1000, 640, 12, '#8a5a3a') + [600, 720, 840, 960].map((x, i) => circ(x, 640, 12, '#c38a52', 4) + (i < 3 ? G(tr(x, 650, 1, Math.sin(t * 1.5 + i) * 3), path('M-50 0L50 0L70 300L-70 300Z', ['#e2463a', '#4d7cf0', '#ffd23f'][i], 6) + (i === 1 ? path('M-40 0Q0 40 40 0', 'none', 5) : '')) : G(tr(x, 600), path('M-60 0Q0 -90 60 0Z', '#5fb85f', 6) + rect(-80, -6, 160, 14, '#5fb85f', 6, 5)))).join('');
  s += rect(560, 1000, 300, 26, '#b98552', 6, 5) + rect(580, 1026, 20, 224, '#a2703f', 4, 4) + rect(820, 1026, 20, 224, '#a2703f', 4, 4) + G(tr(640, 1000), ell(0, -14, 50, 20, '#5ec4f0', 5) + path('M-14 -30l10 -24l8 6', 'none', 5, '#ffd23f')) + dMug(780, 1000, t, '#ff8fb1') + dSwitch(900, 860);
  if (o.fuse !== false) s += dFuseBox(1000, 900, .5, o.lever || 0, t);
  s += WASH() + dBase(1250, '#fff') + dParquet(1250) + rect(dx - 170, 1270, 340, 70, '#a8743f', 14, 5) + ftext(dx, 1322, 'HOME', { size: 38, fill: '#fff6e0', stroke: 'none' });
  s += dSneakers(620, 1400, '#fff', .8) + dSneakers(860, 1440, '#ff6b6b', .7) + G(tr(110, 1380), rect(-20, -320, 40, 320, '#2b2b33', 10, 5) + path('M-60 -320Q0 -380 60 -320', 'none', 8)) + dBag(980, 1560, '#4d7cf0', .8) + plant(60, 1300, .9);
  return s; }
// salon : papier peint, fenêtre + rideaux + vue, étagère garnie, cadres, horloge, canapé + coussins, lampe, tapis, table basse, plante, objets au sol, chat
function livingRoom(t, night = 0, o = {}) { let s = dStripes(1250, night ? '#2d2a55' : '#ffe1c9', night ? '#332f60' : '#ffd6b8', 140, 60) + dDots(1250, night ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.4)', 140, 6);
  s += dWindow(640, 250, 340, 400, t, night, night ? '#7a5cc9' : '#ffb0c8') + wallClock(160, 200, 54, t, 6) + dPic(380, 260, 150, 110, 0, '#c38a52', night ? '#5a6aa8' : '#bfe6ff', -3) + dPic(330, 430, 90, 110, 1, '#7a5a3a', '#fff1d6', 4) + dPic(470, 440, 100, 90, 2, '#c38a52', '#fff', -2);
  s += dShelf(60, 700, 380, dBooks(80, 700, 8, 4) + dTrophy(330, 700, .7) + dJar(400, 700, '#7be07b', .6)) + dShelf(80, 880, 300, dCactus(120, 880, .6) + dBooks(170, 880, 5, 8, 70) + dBottle(330, 880, '#ff8fb1', .7));
  s += dOutlet(560, 1160) + dSwitch(570, 900) + dPoster(860, 870, 180, 220, night ? '#3a3f7a' : '#4d7cf0', 'CHILL', 'MODE', '#fff', 3);
  s += (night ? WASH('rgba(20,24,60,.15)') : WASH()) + dBase(1250, night ? '#3d4378' : '#fff') + dParquet(1250, night ? '#3a3040' : '#c49a6c', night ? '#2c2432' : '#a97f55') + dRug(540, 1500, 460, 110, night ? '#6a4c8a' : '#ff8fb1', night ? '#8a6aa8' : '#ffd23f');
  s += dFloorLamp(70, 1300, .9, night || o.lamp, t) + plant(1010, 1300, .9);
  if (o.couch !== false) s += dCouchBack(540, 1440, o.couchCol);
  return s; }
const dCouchBack = (x, y, col = '#5b8fd8') => rect(x - 400, y - 440, 800, 320, col, 50) + rect(x - 370, y - 410, 360, 240, shade(col, .12), 34, 5) + rect(x + 10, y - 410, 360, 240, shade(col, .12), 34, 5) + G(tr(x - 270, y - 260, 1, -12), rect(-70, -70, 140, 140, '#ffd23f', 36, 6) + circ(0, 0, 14, '#fff', 0)) + G(tr(x + 280, y - 260, 1, 10), rect(-70, -70, 140, 140, '#ff8fb1', 36, 6) + heart(0, 0, .5, '#fff'));
const dCouchFront = (x, y, col = '#5b8fd8') => rect(x - 440, y - 340, 110, 300, shade(col, -.1), 40) + rect(x + 330, y - 340, 110, 300, shade(col, -.1), 40) + rect(x - 350, y - 200, 700, 160, col, 30) + line(x, y - 195, x, y - 45, 5, 'rgba(0,0,0,.2)') + rect(x - 400, y - 40, 34, 40, '#8a5a3a', 6, 5) + rect(x + 366, y - 40, 34, 40, '#8a5a3a', 6, 5);
const dCat = (x, y, s, t) => G(tr(x, y, s), ell(0, 0, 90, 46, '#ff9a3c', 6) + circ(70, -30, 40, '#ff9a3c', 6) + path('M46 -60L52 -96L74 -66Z M84 -66L100 -94L104 -56Z', '#ff9a3c', 5) + path('M56 -30q8 6 16 0M80 -30q8 6 16 0', 'none', 4) + path(`M-86 10Q-150 ${f1(-20 + 30 * Math.sin(t * 3))} -130 -60`, 'none', 22, OL) + path(`M-86 10Q-150 ${f1(-20 + 30 * Math.sin(t * 3))} -130 -60`, 'none', 12, '#ff9a3c') + path('M-20 -30l0 30M10 -36l0 30', 'none', 6, '#e07a2a'));
// cuisine : crédence carrelée, placards hauts, hotte, casseroles suspendues, plan de travail (bouilloire, grille-pain, corbeille de fruits, bloc couteaux), fenêtre, calendrier, horloge, sol damier, tabouret, poubelle
function kitchen(t, night = 0) { let s = grad('#fff3d6', '#ffe8b8', -M, -M, W + 2 * M, 1300) + dTiles(-M, 700, W + M, 1000, '#e9f6fb', '#c7e2ec', 60);
  for (let i = 0; i < 4; i++) s += rect(-80 + i * 260, 160, 240, 340, '#7ac7b0', 14) + rect(-60 + i * 260, 180, 200, 300, 'none', 10, 5, 'rgba(0,0,0,.15)') + circ(140 + i * 260 - 40, 450, 8, '#ffd23f', 3);
  s += dWindow(250, 560, 300, 260, t, night, '#ffd23f') + wallClock(940, 600, 46, t, 6) + dCalendar(700, 640);
  s += line(-40, 560, 220, 560, 8) + [0, 1, 2].map(i => G(tr(10 + i * 80, 560, 1, Math.sin(t * 1.4 + i) * 4), line(0, 0, 0, 40, 4) + circ(0, 80, 34 - i * 4, ['#e2463a', '#ff9a3c', '#c9ced6'][i], 6) + line(0, 80, 0, 150, 10))).join('');
  s += rect(-M, 1000, W + 2 * M, 34, '#b98552', 4, 5) + rect(-M, 1034, W + 2 * M, 220, '#7ac7b0', 0, 5) + [0, 1, 2, 3, 4].map(i => rect(-40 + i * 240, 1050, 220, 190, 'none', 10, 5, 'rgba(0,0,0,.18)') + rect(60 + i * 240, 1060, 40, 10, '#ffd23f', 4, 3)).join('');
  s += G(tr(130, 1000), path('M-60 0L-50 -110Q0 -140 50 -110L60 0Z', '#e2463a', 6) + path('M50 -90Q90 -80 70 -30', 'none', 8) + rect(-14, -150, 28, 22, OL, 6, 0)) + steam(130, 860, t, .5);
  s += G(tr(420, 1000), rect(-80, -100, 160, 100, '#c9ced6', 20) + rect(-50, -110, 30, 12, OL, 3, 0) + rect(20, -110, 30, 12, OL, 3, 0)) + G(tr(640, 1000), path('M-80 -10Q0 50 80 -10Z', '#fff', 5) + circ(-30, -40, 30, '#e2463a', 5) + circ(20, -46, 30, '#ffd23f', 5) + circ(-2, -70, 26, '#7be07b', 5));
  s += G(tr(800, 1000), rect(-40, -90, 80, 90, '#8a5a3a', 8, 5) + line(-20, -90, -26, -150, 8, '#c9ced6') + line(0, -90, 0, -160, 8, '#c9ced6') + line(20, -90, 26, -140, 8, '#c9ced6'));
  s += WASH('rgba(255,255,255,.08)') + dChecker(1250, '#f2f4f6', '#d6dde3', 90) + line(-M, 1250, W + M, 1250, 6) + dBin(80, 1500, '#7a8a99', .9) + G(tr(560, 1560), rect(-80, -200, 160, 30, '#ff6b6b', 12, 5) + line(-60, -170, -70, 0, 10) + line(60, -170, 70, 0, 10)) + G(tr(400, 1720), ell(0, 0, 70, 30, '#ffd23f', 5) + ell(0, -6, 50, 16, '#fff', 0));
  return s; }
// cabinet ORL : diplôme, poster oreille, audiogramme, fenêtre, étagère, bureau + ordi (onde), casque audio, lavabo, plante, tabouret, poubelle
function orlRoom(t) { let s = grad('#d8f3ec', '#bfe9de', -M, -M, W + 2 * M, H + 2 * M) + dStripes(1250, 'rgba(0,0,0,0)', 'rgba(255,255,255,.18)', 100, 30) + rect(-M, 900, W + 2 * M, 350, '#a8ddd0', 0, 0) + rect(-M, 890, W + 2 * M, 18, '#fff', 0, 4);
  s += G(tr(240, 520), rect(-190, -230, 380, 460, '#fff', 12, 6) + ftext(0, -170, 'L\'OREILLE', { size: 40, fill: SX.ink, stroke: 'none' }) + path('M-40 -120C60 -150 120 -60 100 20C90 80 40 80 30 140C20 190 -50 190 -60 150', '#f2c9a0', 8) + path('M-10 -70C40 -80 70 -20 50 20C40 50 10 40 0 70', 'none', 7) + G(tr(110, 40), path('M0 0q30 -30 60 0t60 0', 'none', 6, SX.acc) + circ(130, 0, 18, '#7fd0ff', 5)) + line(-150, 120, -60, 80, 4, '#9aa3ad') + ftext(-150, 150, 'tympan', { size: 22, fill: '#59616c', stroke: 'none' }));
  s += wallClock(560, 170, 44, t, 6) + rect(480, 300, 200, 150, '#c38a52', 8) + rect(496, 316, 168, 118, '#fdf6e3', 0, 4) + ftext(580, 384, 'DIPLÔME', { size: 26, fill: OL, stroke: 'none' }) + circ(580, 414, 12, '#e2463a', 4);
  s += dWindow(760, 260, 260, 300, t, 0, '#fff') + G(tr(870, 720), rect(-130, -110, 260, 220, '#fff', 10, 5) + [0, 1, 2, 3].map(i => line(-110, -80 + i * 50, 110, -80 + i * 50, 3, '#d9dee6')).join('') + path(`M-110 -40L-60 -30L-10 ${f1(-10 + 20 * Math.sin(t * 2))}L40 40L110 70`, 'none', 7, '#e2463a'));
  s += dShelf(480, 620, 230, dJar(520, 620, '#fff') + dJar(580, 620, '#bfe6ff') + dBottle(640, 620, '#ff6b6b') + dBottle(680, 620, '#7be07b', .8), '#fff');
  s += G(tr(560, 780), path('M-50 0Q-50 -70 0 -70Q50 -70 50 0', 'none', 12) + rect(-66, -10, 32, 56, '#4d7cf0', 12, 5) + rect(34, -10, 32, 56, '#4d7cf0', 12, 5)) + dOutlet(700, 1120) + dSwitch(80, 960);
  s += WASH('rgba(255,255,255,.08)') + dChecker(1250, '#9fc7d6', '#8cbacb', 100) + line(-M, 1250, W + M, 1250, 6);
  s += G(tr(780, 1250), rect(-260, -260, 520, 30, '#b98552', 6, 5) + rect(-240, -230, 26, 230, '#a2703f', 4, 4) + rect(214, -230, 26, 230, '#a2703f', 4, 4) + rect(-160, -420, 220, 160, '#2b2b33', 12, 5) + rect(-146, -406, 192, 132, '#0f2a3a', 6, 0) + zig(-140, 40, -340, t, 26, '#7be07b', 12) + rect(-70, -260, 60, 0, OL, 0, 5) + dMug(140, -260, t, '#5ec4f0') + dPens(80, -260));
  s += G(tr(110, 1500), rect(-50, -80, 100, 30, '#e2463a', 12, 5) + line(0, -50, 0, 30, 10) + [-40, 0, 40].map(x => circ(x, 40, 12, '#59616c', 4)).join('')) + dBin(1010, 1480, '#e6e9ee', .7) + plant(980, 1255, .7);
  return s; }
// restaurant : briques, guirlande, suspensions, ardoise, cadres, étagère à bouteilles, fenêtre de nuit, tables + convives qui bavardent, serveur
function resto(t) { let s = rect(-M, -M, W + 2 * M, 1250 + M, '#c86a4a', 0, 0); for (let y = -M, j = 0; y < 1250; y += 50, j++) { s += line(-M, y, W + M, y, 4, '#a8553a'); for (let x = -M + (j % 2) * 60; x < W + M; x += 120) s += line(x, y, x, y + 50, 4, '#a8553a'); }
  s += WASH('rgba(255,240,220,.18)') + fairy(-40, 1120, 120, t, 50);
  s += G(tr(220, 470, 1, -2), rect(-170, -170, 340, 340, '#2f3a33', 14, 8) + rect(-170, -170, 340, 340, 'none', 14, 12, '#a8743f') + ftext(0, -110, 'MENU', { size: 46, fill: '#fff', stroke: 'none' }) + ['Pâtes 12€', 'Pizza 11€', 'Tiramisu 6€', 'Silence : 0€'].map((l, i) => ftext(-140, -50 + i * 50, l, { size: 30, fill: i === 3 ? SX.acc2 : 'rgba(255,255,255,.85)', stroke: 'none', anchor: 'start' })).join(''));
  s += dWindow(640, 300, 340, 300, t, 1, '#e2463a') + dPic(500, 720, 140, 110, 0) + dPic(960, 760, 110, 90, 2);
  s += dShelf(40, 780, 360, dBottle(80, 780, '#3aa65a', 1.1) + dBottle(130, 780, '#7a2b2b', 1.2) + dJar(190, 780, '#ffd23f') + dBottle(250, 780, '#3aa65a', 1) + dJar(320, 780, '#e2463a') + plant(380, 780, .3), '#8a5a3a');
  s += [200, 540, 880].map((x, i) => bulbHang(x, -40, 180 + (i % 2) * 60, t)).join('');
  s += WASH('rgba(0,0,0,.04)') + dChecker(1250, '#e8dcc6', '#cdbb9c', 100) + rect(-M, 1240, W + 2 * M, 22, '#7a4f2a', 0, 0);
  for (const [x, y, sc, sd] of [[180, 1050, .55, 30], [880, 1060, .55, 31]]) { s += G(tr(x, y), rect(-170, 0, 340, 24, '#fff', 8, 5) + line(-140, 24, -140, 200, 10) + line(140, 24, 140, 200, 10) + circ(-60, -10, 30, '#fff', 4) + circ(60, -10, 30, '#fff', 4) + rect(-10, -60, 20, 50, '#7a2b2b', 6, 4));
    for (const k of [-1, 1]) s += person({ age: 'adult', x: x + k * 200, y: y + 150, s: sc, flip: k > 0, hair: ['bun', 'curly', 'short', 'side'][(sd + k + 1) % 4], hairColor: ['#8a5a3a', '#2b2420', '#e0a040', '#5a3a26'][(sd + k + 1) % 4], shirt: ['#7aa6d8', '#ff8fb1', '#7be07b', '#ffd23f'][(sd + k + 1) % 4], expr: Math.sin(t * 6 + x + k) > 0 ? 'talk' : 'laugh', armR: [-20 + 20 * Math.sin(t * 8 + k), -60], seed: sd + k }, t); }
  const wx = ((t * 160) % 1600) - 250; s += person({ age: 'adult', x: wx, y: 1200, s: .5, hair: 'side', hairColor: '#1f1a18', mustache: true, shirt: '#fff', apron: '#2b2b33', pants: '#2b2b33', expr: 'happy', walk: 3, armR: [-80, -90], holdR: ell(0, -10, 70, 14, '#fff', 5) + circ(0, -24, 24, '#ffd23f', 4), seed: 40 }, t);
  return s; }
// chambre nuit (réutilise la chambre riche) + lit au premier plan
function bedroom(t, night = 1) { let s = dStripes(1250, night ? '#262c5e' : '#d7e6ff', night ? '#2b3266' : '#e3eeff') + dDots(1250, night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.55)');
  s += wallClock(470, 180, 52, t, 6) + dCalendar(1010, 780) + dSwitch(1010, 960) + dOutlet(580, 1180);
  s += dWindow(620, 260, 360, 420, t, night) + dCactus(700, 702, .7) + dJar(910, 702, '#7be07b', .6);
  s += dPoster(220, 465, 240, 330, night ? '#3a3f7a' : '#ff8fb1', 'ROCK', 'N\'ROLL', '#fff', -2) + dPic(470, 360, 120, 96, 0, '#c38a52', '#bfe6ff', 3) + dPic(450, 500, 90, 110, 1, '#7a5a3a', '#fff1d6', -4);
  s += dShelf(60, 790, 330, dBooks(80, 790, 7, 3) + dTrophy(300, 790, .8) + dBall(360, 772, 18, '#4d7cf0'));
  s += (night ? WASH('rgba(20,24,60,.18)') : WASH()) + dBase(1250, night ? '#3d4378' : '#fff');
  s += dParquet(1250, night ? '#3a3040' : '#c49a6c', night ? '#2c2432' : '#a97f55') + dRug(560, 1470, 380, 90, night ? '#6a4c8a' : '#ff8fb1', night ? '#8a6aa8' : '#ffd23f');
  s += dDesk(880, 1130, .8, t, night) + dFloorLamp(1050, 1250, .8, 0, t) + plant(985, 1255, .75) + dSneakers(180, 1600, '#fff', .8) + dBag(930, 1560, '#4d7cf0', .8) + dBox(80, 1720, 170, 110);
  if (night) s += op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#0b1030', 0, 0));
  return s; }
// lit vu de face (tête sur l'oreiller, couette jusqu'au menton) : head = svg de la tête centré en (x, hy)
function bigBed(x, hy, headSvg, t, col = '#5b5fa8') { return rect(x - 460, hy - 330, 920, 260, '#b98552', 40) + rect(x - 430, hy - 300, 860, 200, '#c99a63', 30, 5) + ell(x, hy + 40, 330, 120, '#fff', 7) + ell(x - 120, hy + 10, 60, 20, 'rgba(0,0,0,.06)', 0) + headSvg +
  path(`M${x - 520} ${hy + 150}Q${x} ${hy + 90 + 6 * Math.sin(t * 1.5)} ${x + 520} ${hy + 150}L${x + 560} 2400L${x - 560} 2400Z`, col, 7) + path(`M${x - 520} ${hy + 150}Q${x} ${hy + 90} ${x + 520} ${hy + 150}`, 'none', 26, '#fff') + path(`M${x - 520} ${hy + 150}Q${x} ${hy + 90} ${x + 520} ${hy + 150}`, 'none', 7, OL, 'transform="translate(0 13)"') +
  [0, 1, 2, 3, 4, 5].map(i => circ(x - 400 + i * 160, hy + 320 + (i % 2) * 70, 18, 'rgba(255,255,255,.4)', 0)).join(''); }
const nightstand = (x, y, t, lamp = 0) => G(tr(x, y), rect(-110, -200, 220, 200, '#b98552', 12) + rect(-90, -170, 180, 70, '#a2703f', 6, 4) + circ(0, -135, 8, '#ffd23f', 3)) + dLamp(x - 40, y - 200, .8, lamp) + dMug(x + 60, y - 200, t, '#5ec4f0');
// soirée : salon de nuit + guirlandes, boule disco, enceintes, amis qui dansent, ballons, buffet
function soiree(t) { let s = livingRoom(t, 1, { couch: false }) + fairy(-40, 1120, 130, t, 60) + fairy(-40, 1120, 40, t + 1, 40);
  s += G(tr(540, 120), line(0, -200, 0, 0, 4) + circ(0, 60, 70, '#c9ced6', 6) + [0, 1, 2, 3].map(i => line(-66, 30 + i * 0, 66, 30, 0)).join('') + Array.from({ length: 12 }, (_, i) => rect(-50 + (i % 4) * 26, 18 + Math.floor(i / 4) * 28, 22, 22, (i + Math.floor(t * 6)) % 3 ? '#e6e9ee' : '#fff', 3, 0)).join(''));
  for (let i = 0; i < 6; i++) { const a = t * 1.5 + i; s += op(.18, path(`M540 180L${f1(540 + Math.cos(a) * 900)} ${f1(900 + Math.sin(a) * 300)}L${f1(540 + Math.cos(a + .12) * 900)} ${f1(900 + Math.sin(a + .12) * 300)}Z`, ['#ff8fb1', '#7fd0ff', '#ffe066'][i % 3], 0)); }
  s += [[150, 330, '#ff6b6b'], [930, 300, '#ffd23f'], [1010, 420, '#5ec4f0']].map(([x, y, c], i) => G(tr(x, y + Math.sin(t * 2 + i) * 14), ell(0, 0, 48, 58, c, 5) + line(0, 58, 10, 200, 3))).join('');
  for (let i = 0; i < 4; i++) { const x = 150 + i * 250, j = Math.abs(Math.sin(t * 6 + i)); s += person({ age: 'adult', x, y: 1290 - j * 20, s: .55, hair: ['curly', 'bun', 'short', 'ponytail'][i], hairColor: ['#2b2420', '#8a5a3a', '#e0a040', '#c4521b'][i], shirt: ['#ff8fb1', '#7aa6d8', '#7be07b', '#ffd23f'][i], expr: 'joy', armL: [200 + 30 * Math.sin(t * 6 + i), 240], armR: [-20 - 30 * Math.sin(t * 6 + i), -60], seed: 50 + i }, t); }
  s += G(tr(540, 1330), rect(-260, -30, 520, 30, '#fff', 8, 5) + circ(-160, -50, 30, '#ffd23f', 4) + G(tr(-40, -30), path('M-40 0L40 0L30 -60L-30 -60Z', '#e2463a', 5)) + rect(80, -90, 30, 60, '#7be07b', 6, 4) + rect(140, -80, 30, 50, '#ff9a3c', 6, 4));
  return s; }
// parc chill : ciel, nuages, collines, lac + canards, arbres, hamac, pique-nique, banc, cerf-volant, papillons, fleurs
function parkChill(t) { let s = grad('#9fe0ff', '#fff4dc', -M, -M, W + 2 * M, 1900) + circ(880, 260, 80, '#fff3b0', 0) + glow(880, 260, 240, '#fff3b0', .5) + cloud(((t * 25) % 1600) - 300, 220, 1.2, '#fff') + cloud(((t * 15 + 800) % 1700) - 300, 400, .8, '#fff');
  s += path('M-700 1000Q0 760 600 960Q1100 820 1800 1000L1800 2600L-700 2600Z', '#a6dc84', 0) + path('M-700 1080Q300 920 1800 1080L1800 2600L-700 2600Z', '#8fd16a', 0);
  s += ell(760, 1120, 300, 60, '#7fd0ff', 5) + [0, 1].map(i => G(tr(680 + i * 120 + Math.sin(t + i) * 30, 1110), ell(0, 0, 26, 16, '#fff', 4) + circ(18, -16, 12, '#fff', 4) + path('M28 -16l14 4l-14 4Z', '#ff9a3c', 3))).join('');
  const kx = 300 + Math.sin(t) * 40; s += G(tr(kx, 330, 1, Math.sin(t * 2) * 10), path('M0 -60L40 0L0 70L-40 0Z', '#ff6b6b', 5) + line(0, -60, 0, 70, 3) + line(-40, 0, 40, 0, 3)) + path(`M${kx} 400Q${kx + 60} 700 ${kx - 40} 1000`, 'none', 3);
  s += dTree(110, 1180, .9, t, '#5fb85f') + dTree(1000, 1170, .85, t, '#4fa64f');
  s += path('M150 900Q540 1060 960 900', 'none', 8, '#8a5a3a') + path(`M200 930Q540 ${1080 + 6 * Math.sin(t * 1.2)} 900 930`, '#ffd23f', 7) + G(tr(560, 960), circ(0, 0, 50, SKIN, 6) + path('M-50 -10A50 50 0 0 1 50 -10Q0 -40 -50 -10Z', '#e0a040', 5) + path('M-26 4q10 8 20 0M8 4q10 8 20 0', 'none', 4) + path('M-12 22Q0 32 12 22', 'none', 4)) + zzz(610, 900, t);
  s += G(tr(330, 1250), path('M-160 0L160 0L200 120L-200 120Z', '#ff8fb1', 6) + [-120, -40, 40, 120].map(x => line(x, 0, x * 1.25, 120, 4, '#fff')).join('') + G(tr(-80, 30), rect(-50, -30, 100, 50, '#c38a52', 8, 5)) + circ(60, 40, 22, '#e2463a', 4)) + person({ age: 'adult', x: 410, y: 1260, s: .5, hair: 'bun', hairColor: '#8a5a3a', shirt: '#7aa6d8', expr: 'chill', armR: [-80, -100], seed: 61 }, t);
  s += G(tr(880, 1300), rect(-150, -60, 300, 20, '#8a5a3a', 6, 5) + rect(-150, -120, 300, 20, '#8a5a3a', 6, 5) + line(-120, -40, -120, 40, 10) + line(120, -40, 120, 40, 10)) + person({ age: 'adult', x: 880, y: 1300, s: .45, hair: 'side', hairColor: '#9a9aa0', glasses: true, shirt: '#ffd23f', expr: 'zen', seed: 62 }, t);
  for (let i = 0; i < 12; i++) s += circ((i * 211) % W, 1380 + (i * 97) % 500, 12, ['#ffd23f', '#ff8fb1', '#fff'][i % 3], 4);
  for (let i = 0; i < 3; i++) { const bx = ((t * 60 + i * 400) % 1300) - 100, by = 700 + i * 120 + Math.sin(t * 3 + i) * 40; s += G(tr(bx, by), ell(-14, 0, 16, 10 * Math.abs(Math.sin(t * 14 + i)) + 2, ['#ff8fb1', '#b56cff', '#ffd23f'][i], 4) + ell(14, 0, 16, 10 * Math.abs(Math.sin(t * 14 + i)) + 2, ['#ff8fb1', '#b56cff', '#ffd23f'][i], 4)); }
  return s; }

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, tête cut-out qui siffle des oreilles, titre cinétique + étoiles « débloqué »
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const A = at(1, 'accouph') - .05; return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 1000, t, A, { part: 'back', r: 480 }) + burst(CX, 1000, 300, t, .45, SX.acc, 16) +
    ringing(CX, 1010, 160, t, seg(t, .5, 1)) + G(tr(CX, 1010, 1 + .03 * Math.sin(t * 6)), cutout(guyHead(0, 0, 160, { expr: t > A + .1 ? 'terror' : 'worried', look: [.5, -.3] }, t), 14)) +
    iFloat(CX + 290, 880, t, 4, { size: 48 }) + iFloat(CX - 290, 880, t + .4, 3, { size: 44 }) + unlock(CX, 1000, t, A, { part: 'front', r: 480 }) +
    kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'AVOIR DES", CX, 415, t, .3, { size: 56 }) + kword('ACOUPHÈNES ?', CX, 540, t, A, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [.45, 'boing', .4], [at(1, 'accouph') - .05, 'boom', .6], [at(1, 'accouph'), 'sparkle', .6], [.6, 'ecg_beep', .2]] });

// B002 — « un bruit que personne d'autre n'entend, un sifflement » : papier, 3 cut-outs ; seul le héros entend, les autres « ? »
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const P = at(2, 'personne'), S = at(2, 'syflement'); return paper(SX.paper) + gobo(T, .12) +
    G(tr(220, 1060), cutout(person({ age: 'adult', x: 0, y: 380, s: .85, hair: 'bun', hairColor: '#8a5a3a', shirt: '#7aa6d8', expr: 'chill', seed: 31 }, t), 10)) + G(tr(860, 1060), cutout(kevin({ x: 0, y: 380, s: .85, expr: 'happy' }, t), 10)) +
    (t > P ? qmark(220, 640, .55, '#fff', -10) + qmark(860, 640, .55, '#fff', 10) : '') +
    ringing(CX, 900, 150, t, seg(t, S - .2, S + .1)) + cutout(guyHead(CX, 900, 150, { expr: t > S ? 'shock' : 'worried', face: t > S ? { eyes: 'huge' } : {} }, t), 12) + (t > S ? iFloat(CX, 720, t, 4, { size: 54, col: SX.acc }) + zig(CX - 340, CX + 340, 1160, t, 26) : '') +
    kthin("que personne d'autre n'entend", CX, 350, t, P - .05, { size: 48 }) + kword('SIFFLEMENT', CX, 480, t, S - .05, { size: 84, fill: SX.acc }); },
  sfx: [[.02, 'whoosh', .5], [at(2, 'personne'), 'pop', .5], [at(2, 'entend'), 'hmm', .4], [at(2, 'syflement') - .05, 'boom', .5], [at(2, 'syflement'), 'ecg_beep', .3]] });

// B003 — « et qui te suit même quand tout est éteint » : grille nuit, le monstre-sifflement suit le héros ; clic, la lampe s'éteint… il brille encore
B(3, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const E = at(3, 'eteint'), off = seg(t, E - .1, E + .05), wx = lerp(380, 640, clamp(t / d));
    return gridBg(lerpColor('#2a2440', '#0c0a14', off)) + op(1 - off * .7, glow(860, 520, 240, '#fff3b0', .6)) + G(tr(860, 380), line(0, -400, 0, 0, 5, '#fff') + path('M-70 60L70 60L40 0L-40 0Z', off > .5 ? '#555' : SX.acc2, 6) + circ(0, 74, 20, off > .5 ? '#777' : '#fff6c0', 5)) +
      cutout(guy({ x: wx, y: 1500, s: 1.15, expr: off > .5 ? 'terror' : 'worried', walk: off > .5 ? 0 : 3, look: [-1, 0] }, t), 12) + guyRing({ x: wx, y: 1500, s: 1.15 }, t, .8) +
      iiiBug(wx - 300, 820 + Math.sin(t * 3) * 20, .9, t, { look: [1, 0] }) + glow(wx - 300, 820, 200, SX.acc, .25 + .3 * off) +
      kthin('il te suit…', CX, 340, t, at(3, 'suit') - .1, { size: 56 }) + kword('MÊME ÉTEINT', CX, 460, t, E - .05, { size: 78, fill: SX.acc2 }); },
  sfx: [[.05, 'tiptoe', .5], [at(3, 'suit'), 'ghost', .4], [at(3, 'eteint') - .1, 'tick', .8], [at(3, 'eteint') - .05, 'boom', .4]] });

// B004 — « Tu as 20 ans, tu rentres chez toi après une longue journée » : rue du soir vivante, il traîne des pieds, sac à dos, étiquette 20 ANS
B(4, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const wx = lerp(250, 600, clamp(t / d)); return depth({ zoom: 1, x: (t / d) * 40 }, [{ z: 1.5, svg: streetBg(t), haze: .06 }, { z: 1, svg: guy({ x: wx, y: 1510, s: 1.2, expr: t > at(4, 'longue') ? 'deadpan' : 'neutral', walk: 2, armR: [100, 95], holdR: '' }, t) + G(ptr({ x: wx, y: 1510, s: 1.2 }), dBag(-40, -170, '#4d7cf0', .9)) + (t > at(4, 'longue') ? sweatSpray(wx, 1000, t, 3) : '') }, { z: .6, svg: blur(10, dBin(1000, 1880, '#3aa65a', 1.8)) }]) +
    funTag(wx + 230, 820, '20 ANS', t, at(4, '20') - .05, { size: 56, bg: SX.cool }) + funTag(CX, 430, 'LONGUE JOURNÉE', t, at(4, 'longue') - .05, { size: 54, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .5], [.1, 'steps', .5], [at(4, '20') - .05, 'pop', .6], [at(4, 'rentres'), 'steps', .5], [at(4, 'longue') - .05, 'boing', .4]] });

// B005 — « Tu fermes la porte » : entrée, la porte claque (impact), il s'adosse
B(5, { enter: 'drop', cam: (t, d) => ({ z: 1.04, shake: t > at(5, 'porte') && t < at(5, 'porte') + .25 ? 10 : 0 }),
  draw: (t, d, T) => { const P = at(5, 'porte'), k = seg(t, 0, P); return hallway(t, { open: 1 - eOutCubic(k), doorX: 300 }) + guy({ x: 560, y: 1500, s: 1.2, expr: 'deadpan', look: [-1, 0], armL: [160, 200] }, t) +
    (t > P ? impactStar(300, 760, .9 * (1 - seg(t, P, P + .4)) + .3) + motionLines(480, 760, 3, 60, 180) : ''); },
  sfx: [[.05, 'whoosh', .4], [at(5, 'porte'), 'thud', .9]] });

// B006 — « Enfin, le silence » : salon de nuit, chill de ouf : vautré dans le canapé, étoiles, mot SILENCE tout doux
B(6, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.08), tx: CX, ty: 950,
  draw: (t, d, T) => livingRoom(t, 1, { lamp: 1 }) + guy({ x: 540, y: 1414, s: 1.2, expr: 'zen', armL: [200, 250], armR: [-20, -70], rot: -4 }, t) + dCouchFront(540, 1440) + dCat(830, 1218, .6, t) + G(tr(200, 1340), rect(-90, 0, 180, 20, '#b98552', 6, 5) + dMug(0, 0, t, '#5ec4f0')) +
    popStars(540, 930, t, at(6, 'silence'), 8, 300) + sparkle(380, 800, .5 + .2 * Math.sin(t * 6), '#fff6c0') + sparkle(720, 760, .4 + .2 * Math.sin(t * 7), '#fff6c0') +
    kthin('enfin…', CX, 360, t, at(6, 'enfin') - .05, { size: 58 }) + kword('LE SILENCE', CX, 480, t, at(6, 'silence') - .05, { size: 84, fill: '#bfe6ff', puff: false }),
  sfx: [[0, 'whoosh', .3], [at(6, 'enfin'), 'angel', .5], [at(6, 'silence'), 'sparkle', .4]] });

// B007 — « Sauf que non » : scratch ! même salon, les yeux s'ouvrent en grand, l'oreille s'allume
B(7, { enter: 'punch', flash: 1, cam: (t, d) => ({ z: lerp(1.1, 1.18, t / d), shake: 4, r: -4 }),
  draw: (t, d, T) => { const N = at(7, 'non'); return livingRoom(t, 1, { lamp: 1 }) + guyRing({ x: 540, y: 1414, s: 1.2 }, t, seg(t, N - .1, N + .2)) + guy({ x: 540, y: 1414, s: 1.2, expr: 'jawdrop', armL: [200, 250], armR: [-20, -70] }, t) + dCouchFront(540, 1440) + dCat(830, 1218, .6, t) +
    funTag(CX, 450, 'SAUF QUE NON.', t, at(7, 'sof') - .05, { size: 66, bg: SX.acc, r: -6 }) + (t > N ? emark(820, 760, .7, SX.acc2, 14) : ''); },
  sfx: [[0, 'scratch', .8], [at(7, 'sof') - .05, 'pop', .6], [at(7, 'non'), 'gasp', .6]] });

// B008 — « Iiiiiii » : crash zoom sur l'oreille, IIIIII géant, glitch, tout tremble
B(8, { enter: 'crash', flash: 1, cam: () => ({ z: 1.12, shake: 14 }),
  draw: (t, d, T) => glitch(rect(-M, -M, W + 2 * M, H + 2 * M, SX.ink, 0, 0) + sunburst(260, 960, 22, 'rgba(138,92,255,.35)', 'rgba(0,0,0,0)', t * 40) + G(tr(140, 1000, 1, 8), guyHead(0, 0, 340, { expr: 'terror' }, t)) +
    ringing(140, 1000, 340, t * 2, 1, { side: 1, reach: .8 }) + zig(560, 1100, 820, t, 40, SX.acc2, 12) + kword('IIIIIIII', 760, 560, t, .02, { size: 170, fill: SX.acc2, r: -10, d: .15 }), T, .3),
  sfx: [[0, 'flash_hit', .6], [.02, 'ecg_beep', .4], [.15, 'zap', .4]] });

// B009 — « Tu vérifies le chargeur » : gros plan prise + chargeur, loupe, cadre « chargeur.png », croix
B(9, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const C = at(9, 'chargeur'); return livingRoom(t, 0, { couch: false }) + dCharger(380, 900, 1.3, t, t < C + .2) + dPhoneFlat(220, 1350, .9, t) +
    guyHead(780, 760, 170, { expr: 'suspicious', look: [-1, .3] }, t) + G(tr(560, 1020, 1, 130), rect(70, -16, 140, 32, '#8a5a3a', 12, 5) + circ(0, 0, 90, 'rgba(191,230,255,.4)', 12)) +
    funBox(380, 900, 260, 260, t, at(9, 'verifie'), { label: 'chargeur.png' }) + (t > C + .2 ? cross(380, 900, .8, t, C + .2) : '') + funTag(CX, 420, 'CHARGEUR ?', t, C - .05, { size: 60, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .5], [at(9, 'verifie'), 'tick', .5], [at(9, 'chargeur') - .05, 'pop', .6], [at(9, 'chargeur') + .2, 'error_beep', .4]] });

// B010 — « la télévision » : il débranche la télé (neige) → noir, croix
B(10, { enter: 'none', trans: 'push', transD: .2, cam: () => ({ z: 1.04, hand: .3 }),
  draw: (t, d, T) => { const V = at(10, 'television') + .25; return livingRoom(t, 0, { couch: false }) + dTV(420, 1150, 1.05, t, 'static', t < V) + guy({ x: 860, y: 1520, s: 1.15, expr: 'effort', flip: 1, armL: [190, 180] }, t) + line(700, 1180, 900, 1180, 8) +
    (t > V ? cross(420, 840, .9, t, V) : '') + funTag(420, 460, 'TÉLÉ', t, at(10, 'television') - .05, { size: 64, bg: SX.cool }); },
  sfx: [[0, 'whoosh', .4], [at(10, 'television'), 'sizzle', .4], [at(10, 'television') + .25, 'zap', .5]] });

// B011 — « le réfrigérateur » : cuisine, oreille collée contre le frigo, croix
B(11, { enter: 'none', trans: 'push', transD: .2, cam: () => ({ z: 1.05, hand: .3 }),
  draw: (t, d, T) => { const F = at(11, 'refrig'); return kitchen(t) + dFridge(330, 1250, 1.05, t) + guy({ x: 700, y: 1520, s: 1.15, expr: 'suspicious', flip: 1, look: [1, 0], armL: [200, 190], headTilt: -8 }, t) +
    (t > F + .35 ? cross(330, 700, .8, t, F + .35) : '') + funTag(700, 440, 'FRIGO', t, F - .05, { size: 64, bg: '#5ec4f0' }); },
  sfx: [[0, 'whoosh', .4], [at(11, 'refrig'), 'buzz', .25], [at(11, 'refrig') + .35, 'error_beep', .4]] });

// B012 — « Tu coupes l'électricité » : compteur, il abaisse le levier → noir total, un fil coupé crache des étincelles
B(12, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(12, 'electricite') && t < at(12, 'electricite') + .3 ? 8 : 0 }),
  draw: (t, d, T) => { const C = at(12, 'couples'), E = at(12, 'electricite'), lv = eOutBack(seg(t, C, C + .4)), dark = seg(t, E, E + .08);
    return hallway(t, { fuse: false }) + dFuseBox(660, 820, 1.25, lv, t) + guy({ x: 330, y: 1520, s: 1.15, expr: 'rage', armR: [-30, -10] }, t) +
      op(dark * .88, rect(-M, -M, W + 2 * M, H + 2 * M, '#05040a', 0, 0)) + (t > E ? G(tr(860, 560), path('M-200 0L-20 0', 'none', 16) + path('M20 10L200 20', 'none', 16) + impactStar(0, 0, .45 + .15 * Math.sin(t * 40), SX.acc2)) + circ(300, 920, 10, '#fff', 0) + circ(360, 920, 10, '#fff', 0) : '') +
      funTag(CX, 400, 'CLAC !', t, C - .05, { size: 60, bg: '#e2463a' }); },
  sfx: [[at(12, 'couples') - .05, 'pop', .5], [at(12, 'couples'), 'hammer', .6], [at(12, 'electricite'), 'zap', .8], [at(12, 'electricite') + .1, 'sizzle', .5]] });

// B013 — « Le son est toujours là » : dans le noir, à la bougie, le monstre-sifflement brille et chante
B(13, { enter: 'none', cam: zin(1.02, 1.1, .4),
  draw: (t, d, T) => { const L = at(13, 'toujours'); return hallway(t) + op(.82, rect(-M, -M, W + 2 * M, H + 2 * M, '#06050c', 0, 0)) + candleLight(330, 1310, 1, t) + guy({ x: 330, y: 1520, s: 1.15, expr: 'terror', armR: [-80, -100] }, t) +
    glow(760, 760, 280, SX.acc, .45) + iiiBug(760, 760, 1.1, t, { look: [-1, 0] }) + iFloat(760, 560, t, 4, { size: 50, col: SX.acc2 }) + ringing(760, 760, 110, t, 1) +
    kword('TOUJOURS LÀ', CX, 410, t, L - .05, { size: 78, fill: SX.acc2 }); },
  sfx: [[0, 'ghost', .5], [at(13, 'son'), 'ecg_beep', .3], [at(13, 'toujours') - .05, 'boom', .5], [at(13, 'la'), 'sting', .4]] });

// B014 — « Les acouphènes sont des perceptions sonores » : cabinet ORL, la docteure au poster de l'oreille, mot-clé
B(14, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const A = at(14, 'accouph'), P = at(14, 'perceptions'); return orlRoom(t) + doc({ x: 720, y: 1540, s: 1.2, expr: 'talk', flip: 1, armL: [210, 200] }, t) + markerArrow(560, 880, 300, 640, t, A, { col: SX.acc }) +
    funTag(CX, 380, 'ACOUPHÈNES', t, A - .05, { size: 58, bg: SX.acc }) + card(310, 1000, 400, 150, ftext(0, -12, 'PERCEPTION', { size: 44, fill: SX.ink, stroke: 'none' }) + ftext(0, 46, 'SONORE', { size: 40, fill: SX.acc, stroke: 'none' }), t, P - .05, { ry: 10, r: -4, bg: '#fff7e6' }); },
  sfx: [[0, 'whoosh', .5], [at(14, 'accouph') - .05, 'pop', .6], [at(14, 'accouph'), 'scratch', .4], [at(14, 'perceptions') - .05, 'pop_hi', .5]] });

// B015 — « comme des sifflements ou des bourdonnements » : concept papier, 2 cartes : bouilloire qui siffle / abeille qui bourdonne
B(15, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const S = at(15, 'syflements'), Bd = at(15, 'bourdon');
    const kettle = G(tr(0, 40), path('M-90 60L-80 -40Q0 -90 80 -40L90 60Z', '#e2463a', 7) + path('M80 -10L150 -60L160 -40L95 20', '#e2463a', 6) + rect(-20, -90, 40, 24, OL, 8, 0) + steam(150, -90, t, .6) + iFloat(140, -110, t, 3, { size: 40, col: SX.acc }));
    const bee = G(tr(0, 40, 1, Math.sin(t * 10) * 6), ell(-30, -60, 40, 26, 'rgba(255,255,255,.8)', 5) + ell(30, -60, 40, 26, 'rgba(255,255,255,.8)', 5) + ell(0, 0, 90, 60, '#ffd23f', 7) + rect(-30, -56, 22, 112, OL, 0, 0) + rect(20, -50, 22, 100, OL, 0, 0) + circ(70, -14, 10, OL, 0) + path('M-90 0l-30 0', 'none', 7)) + ftext(0, -120, 'bzzz', { size: 44, fill: SX.ink, stroke: 'none' });
    return paper(SX.paper) + gobo(T, .1) + card(290, 860, 400, 460, kettle + ftext(0, 190, 'SIFFLEMENT', { size: 40, fill: SX.ink, stroke: 'none' }), t, S - .1, { ry: 12, r: -5, bg: '#fff' }) +
      card(790, 900, 400, 460, bee + ftext(0, 190, 'BOURDONNEMENT', { size: 34, fill: SX.ink, stroke: 'none' }), t, Bd - .1, { ry: -12, r: 5, bg: '#fff' }) + kthin('comme des…', CX, 420, t, 0, { size: 58 }); },
  sfx: [[at(15, 'syflements') - .1, 'pop', .6], [at(15, 'syflements'), 'whistle', .25], [at(15, 'bourdon') - .1, 'pop', .6], [at(15, 'bourdon'), 'buzz', .4]] });

// B016 — « sans source sonore extérieure correspondante » : radar qui balaye la pièce : 0 SOURCE… la flèche pointe DANS sa tête
B(16, { enter: 'none', trans: 'glitch', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const S = at(16, 'source'), X = at(16, 'exterieur'), C = at(16, 'correspond'), a = t * 220;
    return gridBg('#0f2a24', 'rgba(120,255,200,.08)') + [180, 320, 460].map(r => circ(CX, 900, r, 'none', 4, 'rgba(120,255,200,.35)')).join('') + op(.35, path(`M${CX} 900L${f1(CX + Math.cos(R(a)) * 480)} ${f1(900 + Math.sin(R(a)) * 480)}L${f1(CX + Math.cos(R(a + 25)) * 480)} ${f1(900 + Math.sin(R(a + 25)) * 480)}Z`, '#7bffc8', 0)) +
      guyHead(CX, 900, 150, { expr: t > C ? 'dizzy' : 'worried' }, t) + (t > C ? glow(CX, 900, 120, SX.acc, .5) + iFloat(CX, 800, t, 3, { size: 40, col: SX.acc2 }) : '') +
      funTag(CX, 1150, `SOURCE EXTÉRIEURE : ${t > X ? 0 : '?'}`, t, S - .05, { size: 40, bg: t > X ? '#e2463a' : SX.cool }) + markerArrow(900, 560, CX + 90, 820, t, C, { col: SX.acc2, bend: -60 }) + markerText('ICI !', 900, 520, t, C + .1, { size: 64 }) +
      kthin('sans source', CX, 400, t, at(16, 'sans') - .05, { size: 62 }); },
  sfx: [[0, 'zap', .3], [at(16, 'source'), 'ecg_beep', .4], [at(16, 'exterieur'), 'error_beep', .4], [at(16, 'correspond'), 'scratch', .5], [at(16, 'correspond') + .3, 'ding', .5]] });

// B017 — « Ils peuvent être intermittents ou persistants » : l'oreille-néon clignote (ON/OFF)… puis reste allumée à fond
B(17, { enter: 'whip', cam: camHand(1.04, .4),
  draw: (t, d, T) => { const I = at(17, 'intermittent'), P = at(17, 'persistent'), on = t > P ? 1 : (t > I ? (Math.sin(t * 18) > 0 ? 1 : 0) : 0);
    return orlRoom(t) + doc({ x: 900, y: 1560, s: 1.1, expr: 'talk', flip: 1, armL: [200, 220] }, t) + guyRing({ x: 380, y: 1520, s: 1.2 }, t, on) + guy({ x: 380, y: 1520, s: 1.2, expr: t > P ? 'sob' : 'worried' }, t) +
      funTag(380, 700, on ? 'ON' : 'OFF', t, I, { size: 56, bg: on ? SX.acc : '#7a8a99' }) +
      kword('INTERMITTENTS', CX, 380, t, I - .05, { size: 64, fill: '#fff', op: t > P ? .35 : 1 }) + kword('PERSISTANTS', CX, 490, t, P - .05, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(17, 'intermittent'), 'tick', .5], [at(17, 'intermittent') + .2, 'tick', .5], [at(17, 'persistent') - .05, 'boom', .5], [at(17, 'persistent') + .2, 'ecg_beep', .3]] });

// B018 — « Mais… essaie d'expliquer ça à Kevin » : terrasse de café, Kevin chill de ouf avec sa paille
B(18, { enter: 'drop', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const K = at(18, 'kevin'); return depth({ zoom: 1, x: Math.sin(t) * 15 }, [{ z: 1.5, svg: streetBg(t, { day: 1, shop: 'CAFÉ' }), haze: .08 },
    { z: 1, svg: guy({ x: 290, y: 1470, s: 1.15, expr: 'deadpan', look: [1, 0] }, t) + kevin({ x: 790, y: 1470, s: 1.15, expr: 'chill', flip: 1, armL: [200, 250], holdL: rect(-24, -70, 48, 70, '#ff8fb1', 8, 5) + line(6, -70, 16, -110, 6) }, t) + G(tr(CX, 1360), rect(-160, 0, 320, 22, '#fff', 8, 5) + line(0, 22, 0, 300, 12) + G(tr(-60, 0), rect(-24, -50, 48, 50, '#fff', 8, 5)) + G(tr(70, 0), rect(-30, -14, 60, 14, '#ffd23f', 6, 4))) },
    { z: .6, svg: blur(10, G(tr(1000, 1820), path('M-200 0Q0 -300 200 0Z', '#e2463a', 8))) }]) +
    kthin('essaie d\'expliquer ça à…', CX, 360, t, at(18, 'essaie') - .05, { size: 50 }) + funTag(790, 640, 'KEVIN', t, K - .05, { size: 60, bg: '#5fb85f' }); },
  sfx: [[0, 'whoosh', .5], [at(18, 'mais'), 'hmm', .4], [at(18, 'kevin') - .05, 'pop', .6], [at(18, 'kevin') + .2, 'chirp', .3]] });

// B019 — « Bah, mets des bouchons d'oreille » : gros plan Kevin smug, il brandit 2 bouchons géants
B(19, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), r: -3 }),
  draw: (t, d, T) => { const Bq = at(19, 'bouchons'), k = eOutBack(seg(t, Bq - .1, Bq + .3)); return streetBg(t, { day: 1 }) + WASH('rgba(255,255,255,.2)') + kevinHead(560, 860, 230, { expr: 'smugger', look: [0, .2] }, t) +
    (k > 0 ? earplug(260, 1060, 1.4 * k, -20) + earplug(840, 1040, 1.4 * k, 18) + popStars(260, 1060, t, Bq) : '') + sayB(CX, 420, 'Bah, mets des\nbouchons d\'oreille !', t, at(19, 'bah') - .05, { size: 48 }); },
  sfx: [[0, 'flash_hit', .4], [at(19, 'bah'), 'pop', .5], [at(19, 'bouchons') - .1, 'boing', .7], [at(19, 'oreille'), 'glint', .5]] });

// B020 — « Kevin, le bruit n'est pas dans la pièce » : bouchons enfoncés… vue en coupe de sa tête : le monstre-sifflement est DEDANS
B(20, { enter: 'none', trans: 'circle', transD: .3, tx: CX, ty: 860, cam: zin(1.02, 1.1),
  draw: (t, d, T) => { const P = at(20, 'piece'), Bq = at(20, 'bruit');
    return streetBg(t, { day: 1 }) + WASH('rgba(255,255,255,.25)') + guyHead(CX, 880, 280, { expr: 'deadpan' }, t) + earplug(CX - 290, 900, .7, 90) + earplug(CX + 290, 900, .7, -90) +
      (t > Bq ? G(tr(CX, 860), circ(0, 0, 130, 'rgba(43,36,32,.85)', 7) + iiiBug(0, 30, .55, t, { look: [0, 0] })) : '') + (t > Bq ? markerCircle(CX, 870, 180, 170, t, Bq, { col: SX.acc2 }) : '') +
      kevinHead(940, 1070, 100, { expr: 'confused' }, t) + (t > P ? qmark(1000, 930, .5, '#fff', 10) : '') + funTag(CX, 420, 'PAS DANS LA PIÈCE', t, at(20, 'kevin') + .2, { size: 50, bg: SX.acc }) + markerText('dans la tête', CX, 1230, t, P - .05, { size: 54, col: SX.acc2 }); },
  sfx: [[at(20, 'kevin'), 'squeak', .5], [at(20, 'bruit'), 'ecg_beep', .3], [at(20, 'bruit') + .1, 'scratch', .4], [at(20, 'piece'), 'rimshot', .4]] });

// B021 — « Tu vas au restaurant » : plan large resto vivant
B(21, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(clamp(t / d))) }),
  draw: (t, d, T) => resto(t) + guy({ x: CX, y: 1560, s: 1.2, expr: 'happy', walk: 2 }, t) + guyRing({ x: CX, y: 1560, s: 1.2 }, t, .4) + funTag(CX, 420, 'RESTO', t, at(21, 'restaurant') - .05, { size: 62, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'whoosh', .5], [.1, 'chomp', .3], [at(21, 'restaurant') - .05, 'pop', .6]] });

// B022 — « le bruit des conversations le masque un peu » : bulles « bla bla » couvrent le monstre, jauge qui baisse, il souffle
B(22, { enter: 'none', trans: 'push', transD: .25, cam: camHand(1.04, .4),
  draw: (t, d, T) => { const C = at(22, 'conversations'), Mq = at(22, 'masque'), m = seg(t, Mq - .2, Mq + .4);
    return resto(t) + G(tr(CX, 1050), rect(-200, 0, 400, 24, '#fff', 8, 5)) + guy({ x: CX, y: 1560, s: 1.15, expr: m > .5 ? 'chill' : 'worried', armR: [-30, -60] }, t) + guyRing({ x: CX, y: 1560, s: 1.15 }, t, 1 - m * .8) +
      op(1 - m * .7, iiiBug(820, 700, .55, t, { look: [-1, 0] })) + ['BLA', 'BLA BLA', 'HAHA', 'BLA'].map((w, i) => funTag([220, 820, 300, 760][i], [600, 640, 760, 780][i], w, t, C + i * .14, { size: 44, bg: ['#fff', SX.cool, SX.acc2, '#ff8fb1'][i], fg: SX.ink, r: (i - 1.5) * 6 })).join('') +
      G(tr(CX, 430), rect(-260, -30, 520, 60, '#2b2b33', 30, 6) + rect(-250, -20, 500 * (1 - m * .6), 40, SX.acc, 20, 0) + ftext(-280, 16, 'iii', { size: 40, fill: '#fff', anchor: 'end' })) + markerText('un peu', CX + 200, 520, t, at(22, 'peu'), { size: 46, col: SX.acc2 }); },
  sfx: [[at(22, 'conversations'), 'pop', .5], [at(22, 'conversations') + .14, 'pop', .5], [at(22, 'conversations') + .28, 'pop', .5], [at(22, 'masque'), 'magic', .4]] });

// B023 — « Tu rentres, il revient » : porte d'entrée, le monstre surgit « COUCOU »
B(23, { enter: 'drop', cam: (t, d) => ({ z: 1.06, shake: t > at(23, 'revient') ? 6 : 0 }),
  draw: (t, d, T) => { const Rv = at(23, 'revient'), k = eOutBack(seg(t, Rv - .1, Rv + .3)); return hallway(t, { open: .9 }) + guy({ x: 330, y: 1520, s: 1.15, expr: t > Rv ? 'terror' : 'deadpan' }, t) +
    (k > 0 ? iiiBug(780, 820, 1.1 * k, t, { look: [-1, 0] }) + burst(780, 820, 230 * k, t, Rv, 'rgba(255,210,63,.0)', 12) + sayB(800, 480, 'COUCOU !', t, Rv + .05, { size: 54, tail: -60 }) : ''); },
  sfx: [[0, 'steps', .5], [at(23, 'revient') - .1, 'boing', .7], [at(23, 'revient'), 'ghost', .4], [at(23, 'revient') + .1, 'gasp', .5]] });

// B024 — « Tu t'allonges, tu essaies de dormir » : lit vu de face, yeux grands ouverts au plafond, réveil
B(24, { enter: 'none', trans: 'up', transD: .25, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const D = at(24, 'dormir'); return bedroom(t, 1) + nightstand(140, 1280, t) + bigBed(600, 960, guyHead(600, 960, 150, { expr: t > D ? 'annoyed' : 'deadpan', face: { eyes: 'wide' }, look: [0, -1] }, t), t) +
    G(tr(140, 1060), rect(-70, -50, 140, 100, '#2b2b33', 20) + ftext(0, 18, t > D ? '02:47' : '02:46', { size: 38, fill: '#ff6b6b', stroke: 'none' })) + guyRing({ x: 600, y: 960 - HEADY * 150 / 92, s: 150 / 92 }, t, .6) + funTag(CX, 430, 'DODO ?', t, D - .05, { size: 60, bg: '#5b5fa8' }); },
  sfx: [[at(24, 'allonges'), 'thud', .4], [at(24, 'dormir') - .05, 'pop', .5], [at(24, 'dormir'), 'clock_fast', .3]] });

// B025 — « Plus tu écoutes » : gros plan oreille, les ondes grossissent
B(25, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.05, 1.2, t / d) }),
  draw: (t, d, T) => { const E = at(25, 'ecoutes'), g = seg(t, 0, d); return bedroom(t, 1) + op(.4, rect(-M, -M, W + 2 * M, H + 2 * M, '#0b1030', 0, 0)) + G(tr(380, 900, 1, -6), guyHead(0, 0, 240, { expr: 'worried', look: [1, 0] }, t)) +
    ringing(380, 900, 240, t, .6 + .4 * g, { side: 1, reach: .9 + g }) + iFloat(800, 900, t, 5, { size: 50 + 30 * g, col: SX.acc2 }) + kthin('plus tu écoutes…', CX, 420, t, E - .1, { size: 60 }); },
  sfx: [[0, 'whoosh', .3], [at(25, 'ecoutes'), 'heartbeat', .5], [at(25, 'ecoutes') + .2, 'ecg_beep', .3]] });

// B026 — « plus il semble prendre toute la place » : les lettres IIII gonflent et remplissent la chambre, il est écrasé dans le coin
B(26, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(26, 'toute') ? 5 : 0 }),
  draw: (t, d, T) => { const g = eOutBack(seg(t, at(26, 'semble'), at(26, 'place') + .3)); let s = bedroom(t, 1) + op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#0b1030', 0, 0));
    s += guy({ x: 140 - g * 40, y: 1500, s: .95, expr: 'panic', rot: -10 * g, armL: [200, 230], armR: [-20, -50] }, t);
    for (let i = 0; i < 4; i++) s += G(tr(420 + i * 170, 1250 - 10 * Math.sin(t * 6 + i), .5 + 1.3 * g * (1 + .1 * Math.sin(t * 5 + i))), ftext(0, 0, 'i', { size: 480, fill: [SX.acc, SX.acc2, '#ff8fb1', SX.cool][i] }));
    return s + iiiBug(820, 520, .6 + .3 * g, t, { look: [-1, .5] }) + kword('TOUTE LA PLACE', CX, 380, t, at(26, 'toute') - .05, { size: 62, fill: '#fff' }); },
  sfx: [[at(26, 'semble'), 'whoosh_up', .6], [at(26, 'prendre'), 'boing', .5], [at(26, 'toute') - .05, 'boom', .6], [at(26, 'place'), 'crack', .5]] });

// B027 — « Alors tu mets un ventilateur » : il plante un ventilo géant, cheveux au vent, chill forcé
B(27, { enter: 'whip', cam: camHand(1.04, .4),
  draw: (t, d, T) => { const V = at(27, 'ventilateur'), on = t > V; return bedroom(t, 1) + dFan(800, 1500, 1.15, t, on) + (on ? windGusts(640, 900, t, 5, -1) : '') + guy({ x: 330, y: 1520, s: 1.15, expr: on ? 'chill' : 'deadpan', rot: on ? -4 : 0, headTilt: on ? -8 : 0 }, t) +
    funTag(800, 420, 'VENTILO', t, V - .05, { size: 62, bg: SX.cool }); },
  sfx: [[0, 'whoosh', .4], [at(27, 'ventilateur') - .05, 'pop', .6], [at(27, 'ventilateur'), 'wind', .5]] });

// B028 — « une musique douce, un bruit de pluie » : 2 cartes qui poussent (enceinte + notes / nuage de pluie dans la chambre)
B(28, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Mu = at(28, 'musique'), P = at(28, 'pluie'); let rain = ''; for (let i = 0; i < 14; i++) { const x = -120 + (i * 37) % 240, y = ((i * 53 + t * 500) % 200); rain += line(x, y - 20, x - 6, y + 10, 5, '#7fd0ff'); }
    return bedroom(t, 1) + dFan(140, 1500, .7, t, 1) + guy({ x: 540, y: 1520, s: 1.1, expr: 'chill', armR: [-60, -90] }, t) +
      card(270, 800, 360, 400, G(tr(0, 120, .7), dSpeaker(0, 0, 1, t, 1, '#ff8fb1')) + notes(0, -30, t, 3, SX.acc), t, Mu - .1, { ry: 10, r: -5, bg: '#fff7e6' }) +
      card(810, 800, 360, 400, G(tr(0, -90), cloud(0, 0, .9, '#c9d3e0', 6)) + G(tr(0, 0), rain), t, P - .1, { ry: -10, r: 5, bg: '#e6f6ff' }) +
      kthin('musique douce', 270, 520, t, Mu, { size: 44 }) + kthin('pluie', 810, 520, t, P, { size: 48 }); },
  sfx: [[at(28, 'musique') - .1, 'pop', .6], [at(28, 'musique'), 'magic', .3], [at(28, 'pluie') - .1, 'pop', .6], [at(28, 'pluie'), 'spray', .4]] });

// B029 — « tout ce qui peut détourner ton attention » : arsenal complet autour du lit, flèches qui tirent l'attention, le monstre boude
B(29, { enter: 'drop', cam: zin(1.0, 1.07, .3),
  draw: (t, d, T) => { const Dt = at(29, 'detourner'), A = at(29, 'attention'); return bedroom(t, 1) + dFan(110, 1500, .75, t, 1) + dSpeaker(980, 1400, .7, t, 1, '#ff8fb1') + notes(980, 1080, t, 3) + G(tr(860, 560), cloud(0, 0, .6, '#c9d3e0', 6)) +
    bigBed(520, 980, guyHead(520, 980, 140, { expr: 'zen' }, t), t) + iiiBug(820, 760, .55, t, { sing: 0, angry: 1, look: [-1, 0] }) +
    markerArrow(380, 760, 170, 1000, t, Dt, { col: SX.acc2, bend: 60 }) + markerArrow(660, 760, 940, 1100, t, Dt + .15, { col: SX.acc2, bend: -60 }) +
    kthin('détourner ton', CX, 360, t, Dt - .05, { size: 54 }) + kword('ATTENTION', CX, 470, t, A - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[at(29, 'detourner'), 'scratch', .5], [at(29, 'detourner') + .15, 'scratch', .4], [at(29, 'attention') - .05, 'boom', .5], [at(29, 'attention') + .2, 'hmm', .3]] });

// B030 — « Un soir, quelqu'un te demande » : soirée vivante (guirlandes, boule disco, amis qui dansent)
B(30, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => soiree(t) + dSpeaker(90, 1500, .9, t, 1) + dSpeaker(990, 1500, .9, t, 1) + notes(90, 1100, t, 3) + guy({ x: 380, y: 1540, s: 1.15, expr: 'happy', armR: [-60, -80] }, t) + amie({ x: 720, y: 1540, s: 1.12, expr: 'talk', flip: 1, armL: [200, 220] }, t) +
    funTag(CX, 420, 'UN SOIR', t, at(30, 'soir') - .05, { size: 62, bg: SX.acc }) + funTag(720, 740, '?', t, at(30, 'demande'), { size: 60, bg: '#fff', fg: SX.ink }),
  sfx: [[0, 'whoosh', .5], [.1, 'drum', .3], [at(30, 'soir') - .05, 'pop', .6], [at(30, 'demande'), 'pop_hi', .4]] });

// B031 — « Tu veux qu'on coupe la musique pour être tranquille ? » : gros plan amie, main sur le bouton de volume
B(31, { enter: 'punch', cam: zin(1.04, 1.1),
  draw: (t, d, T) => { const C = at(31, 'coupe'); return soiree(t) + WASH('rgba(20,20,50,.15)') + amieHead(420, 900, 210, { expr: 'happy', look: [1, 0] }, t) + G(tr(860, 1030), rect(-150, -170, 300, 340, '#2b2b33', 24) + circ(0, -40, 90, '#4a4d57', 6) + G(`rotate(${f1(-120 * seg(t, C, C + .5))})`, line(0, 0, 0, -70, 10, SX.acc2)) + ftext(0, 120, 'VOLUME', { size: 32, fill: '#fff', stroke: 'none' })) +
    sayB(CX, 450, 'On coupe la musique\npour être tranquille ?', t, .05, { size: 44, tail: -120 }); },
  sfx: [[.05, 'pop', .5], [at(31, 'coupe'), 'tick', .6], [at(31, 'tranquille'), 'hmm', .4]] });

// B032 — « Tu regardes les enceintes, puis tu réponds » : insert POV sur les enceintes qui pompent, puis il se tourne
B(32, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const E = at(32, 'enceintes'), Rp = at(32, 'reponds'); return soiree(t) + dSpeaker(290, 1400, 1.5, t, 1) + dSpeaker(800, 1400, 1.5, t, 1) + notes(540, 900, t, 5, SX.acc2) +
    markerCircle(290, 1000, 220, 330, t, E, { col: SX.acc2 }) + markerCircle(800, 1000, 220, 330, t, E + .1, { col: SX.acc2 }) + (t > Rp - .3 ? G(tr(CX, 740), guyHead(0, 0, 130, { expr: 'smug', look: [0, 0] }, t)) : '') + kthin('les enceintes…', CX, 400, t, E - .05, { size: 58 }); },
  sfx: [[at(32, 'regardes'), 'whoosh', .4], [at(32, 'enceintes'), 'scratch', .5], [at(32, 'enceintes') + .1, 'drum', .4], [at(32, 'reponds') - .3, 'pop', .5]] });

// B033 — « Non, laisse-la » : il enlace l'enceinte, cœurs, « NON ! LAISSE-LA ! »
B(33, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 5 }),
  draw: (t, d, T) => soiree(t) + dSpeaker(620, 1500, 1.1, t, 1) + guy({ x: 470, y: 1520, s: 1.15, expr: 'love', armL: [10, -30], armR: [10, -10] }, t) + heartsUpA(t, 540, 900) + notes(640, 1000, t, 3) +
    funTag(CX, 430, 'NON ! LAISSE-LA !', t, at(33, 'non') - .05, { size: 60, bg: SX.acc, r: -5 }),
  sfx: [[0, 'flash_hit', .4], [at(33, 'non') - .05, 'boom', .5], [at(33, 'laisse'), 'kiss', .5]] });

// B034 — « Parce que pour la plupart des gens, le silence est un repos » : parc chill de ouf (hamac, pique-nique, canards), REPOS
B(34, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => parkChill(t) + funTag(CX, 400, 'LA PLUPART DES GENS', t, at(34, 'plupart') - .05, { size: 48, bg: SX.cool }) + kthin('le silence =', CX, 530, t, at(34, 'silence') - .05, { size: 56 }) + kword('REPOS', CX, 650, t, at(34, 'repos') - .05, { size: 110, fill: '#bfe6ff' }) + popStars(CX, 650, t, at(34, 'repos'), 8, 320),
  sfx: [[0, 'chirp', .4], [at(34, 'plupart') - .05, 'pop', .5], [at(34, 'silence'), 'waves', .3], [at(34, 'repos') - .05, 'angel', .5]] });

// B035a — « Pour toi, c'est parfois… » : nuit, chambre silencieuse, seul assis au bord du lit
const o35 = at(35, 'moment') - .15;
B(35, { enter: 'none', trans: 'black', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => bedroom(t, 1) + op(.45, rect(-M, -M, W + 2 * M, H + 2 * M, '#05061a', 0, 0)) + guy({ x: CX, y: 1520, s: 1.2, expr: 'sad', look: [0, .5] }, t) + guyRing({ x: CX, y: 1520, s: 1.2 }, t, .5) + funTag(CX, 430, 'POUR TOI…', t, at(35, 'toi') - .05, { size: 62, bg: '#5b5fa8' }),
  sfx: [[0, 'crickets', .4], [at(35, 'toi') - .05, 'pop', .4]] });

// B035b — FIN : « …le moment où ton bruit devient le plus fort » : le monstre sort un mégaphone, ondes énormes, LE PLUS FORT ; le héros, blasé, met… un bouchon au monstre
B(35, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), shake: t > at(35, 'fort') - o35 ? 9 : 2 }),
  draw: (t, d, T) => { const Bt = at(35, 'bruit') - o35, F = at(35, 'fort') - o35, g = eOutBack(seg(t, Bt - .2, F + .2)), plug = seg(t, F + .1, F + .35);
    return bedroom(t, 1) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, '#05061a', 0, 0)) + sunburst(760, 760, 22, 'rgba(138,92,255,.3)', 'rgba(0,0,0,0)', t * 30) + ringing(760, 760, 140 + 80 * g, t * 1.5, 1) +
      guy({ x: 260, y: 1520, s: 1.1, expr: plug > 0 ? 'smugger' : 'terror', armR: plug > 0 ? [-30, -20] : [70, 80] }, t) + iiiBug(760, 760, .9 + .5 * g, t, { mega: 1 }) + iFloat(760, 520, t, 5, { size: 70, col: SX.acc2 }) +
      (plug > 0 ? earplug(lerp(420, 790, eOutCubic(plug)), lerp(1000, 820, eOutCubic(plug)), .6, 70) : '') +
      kthin('le moment où ton bruit devient', CX, 340, t, 0, { size: 44 }) + kword('LE PLUS FORT', CX, 460, t, F - .3, { size: 72, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(35, 'bruit') - o35, 'ghost', .5], [at(35, 'fort') - o35 - .3, 'boom', .7], [at(35, 'fort') - o35, 'siren', .3], [at(35, 'fort') - o35 + .12, 'pop', .6], [at(35, 'fort') - o35 + .35, 'rimshot', .5]] }, o35);

function heartsUpA(t, x, y, n = 5) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * .9 + i / n) % 1; s += op(1 - k, heart(x + Math.sin(k * 9 + i) * 60 + (i - n / 2) * 40, y - k * 360, .6 + k * .3)); } return s; }

SCENES.sort((a, b) => a.s - b.s);
