// ============================================================
//  « Pourquoi c'est horrible de naître le 29 février ? » — style SIZEX fun — 9:16, calé mot à mot
//  (words.js + timing.js générés par tools/prep.py). Intro motion (3 plans), puis vrais décors vivants + couche motion.
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
//  SIZEX fun : accent violet « bissextile », jaune marqueur, Fredoka
// ============================================================
sxFun('#7a5cff'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';

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

// chambre (jour / nuit) : papier peint rayé à pois, fenêtre + rideaux + vue, poster, étagère, cadres, lit, bureau, tapis, objets au sol
function bedroom(t, night = 0) { let s = dStripes(1250, night ? '#262c5e' : '#d7e6ff', night ? '#2b3266' : '#e3eeff') + dDots(1250, night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.55)');
  s += wallClock(470, 180, 52, t, 6) + dCalendar(1010, 780) + dSwitch(1010, 960) + dOutlet(580, 1180);
  s += dWindow(620, 260, 360, 420, t, night) + dCactus(700, 702, .7) + dJar(910, 702, '#7be07b', .6);
  s += dPoster(220, 465, 240, 330, night ? '#3a3f7a' : '#ff8fb1', 'SKATE', '4 LIFE', '#fff', -2) + dPic(470, 360, 120, 96, 0, '#c38a52', '#bfe6ff', 3) + dPic(450, 500, 90, 110, 1, '#7a5a3a', '#fff1d6', -4);
  s += dShelf(60, 790, 330, dBooks(80, 790, 7, 3) + dTrophy(300, 790, .8) + dBall(360, 772, 18, '#4d7cf0'));
  s += (night ? WASH('rgba(20,24,60,.18)') : WASH()) + dBase(1250, night ? '#3d4378' : '#fff');
  s += dParquet(1250, night ? '#3a3040' : '#c49a6c', night ? '#2c2432' : '#a97f55') + dRug(560, 1470, 380, 90, night ? '#6a4c8a' : '#ff8fb1', night ? '#8a6aa8' : '#ffd23f');
  s += dBed(40, 1330, .95, night) + dDesk(880, 1130, .8, t, night) + dFloorLamp(1050, 1250, .8, night, t) + plant(985, 1255, .75);
  s += dSneakers(180, 1600, '#fff', .8) + dBag(930, 1560, '#4d7cf0', .8) + dBox(80, 1720, 170, 110) + dBall(760, 1640, 34, '#ffd23f', '#fff', t * 40);
  if (night) s += op(.35 + .1 * Math.sin(t * 3), rect(-M, -M, W + 2 * M, H + 2 * M, '#0b1030', 0, 0));
  return s + fgBlur(G(tr(1010, 1870, 1.4, -15), dBall(0, 0, 90, '#ff6b6b'))); }

// salle de classe : fanions, horloge, posters, tableau (craie, éponge), poussière de craie, radiateur, étagère + globe, cartables, parquet, pupitres flous au premier plan, avion en papier
function classroom(t) { let s = grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + dDots(1250, 'rgba(255,200,120,.35)', 110, 8) + dBunting(-30, 1110, 40, t, ['#ff6b6b', '#4d7cf0', '#ffd23f', '#7be07b', '#b56cff']);
  s += dPoster(160, 190, 190, 120, '#7be07b', 'MATHS', '÷ 4', '#fff', -3, '#fff') + dPoster(700, 190, 210, 120, '#4d7cf0', 'HISTOIRE', '1582', '#fff', 2, SX.acc2) + wallClock(940, 200, 60, t, 6) + dPic(420, 190, 110, 90, 0);
  s += rect(60, 280, 960, 560, '#3c5a48', 18) + rect(80, 300, 920, 520, '#456b55', 10, 0) + ftext(140, 360, '365 + ¼', { size: 34, fill: 'rgba(255,255,255,.55)', stroke: 'none', anchor: 'start' }) + ftext(940, 790, '1 an = 365,25 j', { size: 30, fill: 'rgba(255,255,255,.5)', stroke: 'none', anchor: 'end' }) +
    path('M120 790q30 -40 60 0t60 0', 'none', 4, 'rgba(255,255,255,.5)') + path('M880 340l60 0l-30 40Z', 'none', 4, 'rgba(255,255,255,.45)');
  s += rect(60, 840, 960, 24, '#8a5a3a', 6, 5) + rect(160, 822, 70, 22, '#ffd23f', 4, 4) + rect(260, 830, 30, 12, '#fff', 4, 3) + rect(300, 830, 24, 12, '#ff8fb1', 4, 3);
  for (let i = 0; i < 6; i++) { const k = (t * .6 + i / 6) % 1; s += circ(200 + i * 14, 850 + k * 300, 4, 'rgba(255,255,255,.7)', 0); }
  s += G(tr(540, 1060), rect(-120, -80, 240, 150, '#fff', 14, 5) + [-80, -40, 0, 40, 80].map(x => line(x, -66, x, 56, 6, '#d6dde3')).join('')) + dOutlet(380, 1180) + dSwitch(700, 940);
  s += dShelf(780, 1000, 280, dBooks(800, 1000, 8, 5, 80) + G(tr(1010, 1000), rect(-10, -20, 20, 20, '#8a5a3a', 0, 4) + circ(0, -62, 42, '#5ec4f0', 5) + path('M-30 -80q20 -10 30 10t30 -6M-36 -50q24 10 40 -6', 'none', 6, '#7be07b')));
  s += [80, 200].map((x, i) => G(tr(x, 960), line(0, -30, 0, 0, 5) + dBag(0, 160, ['#ff6b6b', '#7be07b'][i], .7))).join('');
  s += WASH('rgba(255,255,255,.1)') + dBase(1250, '#e8c38a') + dParquet(1250) + dBin(1000, 1420, '#4d7cf0', .8) + dBall(130, 1440, 30, '#ff9a3c') + dBox(560, 1440, 150, 70, '#fff');
  const pf = (t * .35) % 1; s += G(tr(lerp(-150, 1250, pf), 260 + Math.sin(pf * 9) * 60, 1, Math.cos(pf * 9) * 14), path('M-60 0L60 -16L-30 22Z', '#fff', 4) + line(-60, 0, 60, -16, 3));
  s += fgBlur(G(tr(CX, 1830), rect(-700, -70, 600, 60, '#c99a63', 10, 6) + rect(100, -70, 600, 60, '#c99a63', 10, 6) + rect(-640, -150, 140, 80, '#fff', 6, 5) + dMug(400, -70, t, '#ffd23f') + dPens(-250, -70)), 10);
  return s; }

// ============================================================
//  PERSONNAGES
// ============================================================
const HAIR = '#3a2a20', SHIRT = '#2fb8a6', HATC = '#ff4f87';
// chapeau de fête « 29 » = signature du héros (né un 29 février). o.droop 0..1 : le chapeau s'affaisse (déprime)
function partyHat(r, t, o = {}) { const dr = o.droop || 0, h = r * 1.05 * (1 - dr * .3), w = r * .4, tip = dr * r * .55;
  let g = path(`M${f1(-w)} 0L${f1(tip)} ${f1(-h)}L${f1(w)} 0Q0 ${f1(r * .14)} ${f1(-w)} 0Z`, o.col || HATC, 6);
  for (const f of [.28, .58]) { const hw = w * (1 - f); g += line(-hw + tip * f + 4, -h * f, hw + tip * f - 4, -h * f + 6, r * .07, SX.acc2); }
  g += circ(tip * .3 - w * .25, -h * .14, r * .045, '#fff', 0) + circ(tip * .45 + w * .3, -h * .42, r * .04, '#fff', 0);
  g += G(tr(tip, -h, 1 + .1 * Math.sin(t * 9)), circ(0, 0, r * .14, SX.acc2, 6) + circ(-r * .04, -r * .04, r * .04, '#fff', 0));
  g += ftext(tip * .2, -h * .02 - r * .03, '29', { size: r * .2, fill: '#fff', stroke: OL, sw: r * .04 });
  return G(tr(r * .3, -r * .8, 1, 18 + Math.sin(t * 3) * 3 + dr * 30), g); }
const heroHair = (o = {}) => (r, t) => { const [b, f] = hairSvg(o.style || 'short', o.col || HAIR, r, t); return [b, f + (o.hat === false ? '' : partyHat(r, t, o))]; };
const fHero = (o, t) => person(Object.assign({ age: 'kid', hairFn: heroHair(o.hh || {}), shirt: SHIRT, pants: '#3b4a6b', seed: 2 }, o), t);
const fHeroA = (o, t) => person(Object.assign({ age: 'adult', hairFn: heroHair(o.hh || {}), shirt: SHIRT, pants: '#33415e', seed: 2 }, o), t);
const fHeroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: heroHair(o.hh || {}), seed: 2 }, o), t));
const fBaby = (o, t) => person(Object.assign({ age: 'baby', hairFn: heroHair(Object.assign({ style: 'tuft' }, o.hh || {})), shirt: '#bfe6ff', seed: 2 }, o), t);
const fOld = (o, t) => person(Object.assign({ age: 'adult', hairFn: heroHair(Object.assign({ style: 'bald', col: '#ddd' }, o.hh || {})), shirt: SHIRT, pants: '#6b6f7a', glasses: true, mustache: true, wrinkles: true, seed: 2 }, o), t);
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinA = (o, t) => kevin(Object.assign({ age: 'adult' }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const docP = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#9a9aa0', glasses: true, mustache: true, shirt: '#fff', coat: 1, stetho: 1, pants: '#4b5b7a', seed: 4 }, o), t);
const docHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'side', hairColor: '#9a9aa0', glasses: true, mustache: true, seed: 4 }, o), t));
const nurse = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#8a5a3a', shirt: '#7fd3c4', pants: '#7fd3c4', skin: '#c98a5e', seed: 5 }, o), t);
const mum = (o, t) => person(Object.assign({ age: 'adult', hair: 'long', hairColor: '#5a3a26', shirt: '#ff8fb1', pants: '#4b5b7a', seed: 6 }, o), t);
const amieA = (o, t) => person(Object.assign({ age: 'adult', hair: 'curly', hairColor: '#2b2420', shirt: '#b56cff', pants: '#4b3b6e', skin: '#c98a5e', seed: 5 }, o), t);
const poteA = (o, t) => person(Object.assign({ age: 'adult', hair: 'ponytail', hairColor: '#e0a040', shirt: '#ff9a3c', pants: '#2f6f8f', seed: 7 }, o), t);
const prof = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#8a5a3a', glasses: true, shirt: '#e2463a', pants: '#4b5b7a', seed: 9 }, o), t);
const ptr = o => tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0);

// ============================================================
//  ACCESSOIRES
// ============================================================
function fDigi(x, y, s, str, t, col = '#ff4d4d') { return G(tr(x, y, s), rect(-260, -120, 520, 240, '#2b2b33', 34, 8) + rect(-232, -92, 464, 184, '#14141a', 16, 0) + glow(0, 0, 280, col, .22) +
  ftext(0, 52, str, { size: 150, fill: col, stroke: 'none', font: 'Fredoka' }) + circ(-230, -100, 9, '#555', 0) + circ(230, -100, 9, '#555', 0) + rect(-60, 120, 120, 16, '#2b2b33', 6, 0)); }
function fAna(x, y, r, h, m, t, rim = SX.acc) { let g = circ(0, 0, r + 14, rim, 7) + circ(0, 0, r, '#fff', 6);
  for (let i = 0; i < 12; i++) { const a = R(i * 30); g += line(Math.cos(a) * r * .8, Math.sin(a) * r * .8, Math.cos(a) * r * .92, Math.sin(a) * r * .92, i % 3 ? 5 : 10); }
  const ah = R((h % 12 + m / 60) * 30 - 90), am = R(m * 6 - 90);
  return G(tr(x, y), g + line(0, 0, Math.cos(ah) * r * .5, Math.sin(ah) * r * .5, 14) + line(0, 0, Math.cos(am) * r * .78, Math.sin(am) * r * .78, 9) + circ(0, 0, 12, OL, 0)); }
function fCalPage(x, y, s, mon, day, o = {}) { const c = o.col || '#e2463a';
  return G(tr(x, y, s, o.r || 0), rect(-150, -180, 300, 350, o.bg || '#fff', 20, 7) + rect(-150, -180, 300, 96, c, 20, 7) + rect(-146, -110, 292, 24, c, 0, 0) + line(-150, -86, 150, -86, 7) +
    circ(-80, -180, 14, '#d9dee6', 5) + circ(80, -180, 14, '#d9dee6', 5) + ftext(0, -115, mon, { size: 52, fill: '#fff' }) +
    ftext(0, 82, String(day), { size: String(day).length > 2 ? 110 : 170, fill: o.fg || OL, stroke: 'none', font: 'Fredoka' }) + (o.sub ? ftext(0, 148, o.sub, { size: 34, fill: '#7a8a99', stroke: 'none', font: 'Fredoka' }) : '')); }
// grille de février (st = colonne du 1er), cellule d'un jour en coordonnées locales
const FEB_CS = 92;
const febCell = (d, st = 3) => { const i = st + d - 1; return [-FEB_CS * 3.5 + FEB_CS * (i % 7) + FEB_CS / 2, -170 + FEB_CS * Math.floor(i / 7) + FEB_CS / 2]; };
function fFeb(x, y, s, t, o = {}) { const days = o.days ?? 28, st = o.start ?? 3, c = o.col || SX.acc;
  let g = rect(-360, -330, 720, 650, '#fff', 24, 8) + rect(-360, -330, 720, 110, c, 24, 8) + rect(-356, -240, 712, 20, c, 0, 0) + line(-360, -220, 360, -220, 8) + ftext(0, -255, o.title || 'FÉVRIER', { size: 58, fill: '#fff' });
  ['L', 'M', 'M', 'J', 'V', 'S', 'D'].forEach((d, i) => g += ftext(-FEB_CS * 3.5 + FEB_CS * i + FEB_CS / 2, -184, d, { size: 28, fill: '#7a8a99', stroke: 'none', font: 'Fredoka' }));
  for (let d = 1; d <= days; d++) { const [cx, cy] = febCell(d, st); g += rect(cx - 40, cy - 38, 80, 76, d === o.hl ? SX.acc2 : '#f1f4f8', 12, 3) + ftext(cx, cy + 15, String(d), { size: 38, fill: OL, stroke: 'none', font: 'Fredoka' }); }
  if (o.ghost) { const [cx, cy] = febCell(days + 1, st), bl = Math.sin(t * 12) > 0; g += rect(cx - 40, cy - 38, 80, 76, bl ? 'rgba(255,77,77,.25)' : 'rgba(255,77,77,.08)', 12, 4, '#ff4d4d') + ftext(cx, cy + 16, '?', { size: 46, fill: '#ff4d4d', stroke: 'none', font: 'Fredoka' }); }
  return G(tr(x, y, s, o.r || 0), g); }
function fCake(x, y, s, t, n = 1, o = {}) { let g = ell(0, 40, 300, 40, '#e6e9ee', 6) + rect(-240, -110, 480, 150, o.c1 || '#ff8fb1', 30, 7) + path('M-236 -80Q-200 -40 -160 -80T-80 -80T0 -80T80 -80T160 -80T236 -80L236 -106L-236 -106Z', '#fff', 0) +
    rect(-170, -230, 340, 126, o.c2 || '#ffd0e0', 26, 7) + path('M-166 -200Q-140 -165 -110 -200T-50 -200T10 -200T70 -200T130 -200T166 -200L166 -226L-166 -226Z', '#fff', 0);
  const r = rng(5); for (let i = 0; i < 14; i++) g += rect(-210 + r() * 420, -60 + r() * 80, 16, 6, ['#ffd23f', '#5ec4f0', '#7be07b', '#fff'][i % 4], 3, 0);
  for (let i = 0; i < n; i++) { const cx = n === 1 ? 0 : -130 + i * 260 / (n - 1); g += rect(cx - 11, -320, 22, 94, ['#7aa6d8', '#ffd23f', '#7be07b', '#b56cff', '#ff9a3c'][i % 5], 5, 5) + line(cx - 8, -300, cx + 8, -290, 4, 'rgba(255,255,255,.7)') + line(cx - 8, -270, cx + 8, -260, 4, 'rgba(255,255,255,.7)') +
    (o.out ? (o.smoke ? op(.6, path(`M${cx} -330q-14 -30 0 -60t0 -60`, 'none', 6, '#bbb')) : '') : G(tr(cx, -342, 1 + .15 * Math.sin(t * 20 + i)), glow(0, -6, 50, '#ffd23f', .55) + path('M0 -32Q17 -4 0 10Q-17 -4 0 -32Z', '#ffb340', 4))); }
  if (o.label) g += ftext(0, -20, o.label, { size: 56, fill: '#fff' });
  return G(tr(x, y, s, o.r || 0), g); }
function fBalloon(x, y, s, col, t, i = 0) { const sw = Math.sin(t * 2 + i) * 10; return G(tr(x, y + Math.sin(t * 1.6 + i) * 12, s, sw * .4), path(`M0 0Q${f1(sw)} 60 0 120Q${f1(-sw)} 180 0 240`, 'none', 4) + path('M-12 6L12 6L0 -10Z', col, 4) + ell(0, -84, 66, 82, col, 6) + ell(-24, -116, 13, 22, 'rgba(255,255,255,.55)', 0)); }
const fGift = (x, y, s, col, rib = '#ffd23f') => G(tr(x, y, s), rect(-60, -100, 120, 100, col, 8, 6) + rect(-70, -126, 140, 32, shade(col, .1), 8, 6) + rect(-10, -126, 20, 126, rib, 0, 4) + path('M0 -126C-40 -170 -60 -130 0 -126C60 -130 40 -170 0 -126Z', rib, 5));
function fSign(x, y, s, str, r = 0, col = '#fff') { const sz = Math.min(64, 290 / (str.length * .6)); return G(tr(x, y, s, r), line(0, 30, 0, 330, 16, '#a2703f') + rect(-170, -110, 340, 150, col, 12, 7) + ftext(0, -35 + sz * .36, str, { size: sz, fill: OL, stroke: 'none', font: 'Fredoka' })); }
const fMega = (x, y, s, r = 0) => G(tr(x, y, s, r), path('M0 -30L120 -80L120 80L0 30Z', '#e2463a', 6) + rect(-40, -34, 46, 68, '#e6e9ee', 8, 6) + rect(-30, 30, 22, 50, '#59616c', 6, 5) + ell(120, 0, 18, 80, '#ff8a7a', 6));
function fId(x, y, s, t, o = {}) { return G(tr(x, y, s, o.r || 0), rect(-270, -170, 540, 340, '#eef4ff', 24, 7) + rect(-270, -170, 540, 70, '#4d7cf0', 24, 7) + rect(-266, -120, 532, 20, '#4d7cf0', 0, 0) + ftext(0, -122, "CARTE D'IDENTITÉ", { size: 34, fill: '#fff', stroke: 'none', font: 'Fredoka' }) +
  rect(-240, -80, 180, 220, '#d9e6ff', 14, 5) + clipR(-240, -80, 180, 220, fHeroHead(-150, 40, 70, { expr: o.expr || 'smug', hh: o.hh || {} }, t), 14) +
  ftext(-30, -30, 'NÉ LE', { size: 30, fill: '#7a8a99', stroke: 'none', font: 'Fredoka', anchor: 'start' }) + ftext(-30, 20, '29/02', { size: 52, fill: OL, stroke: 'none', font: 'Fredoka', anchor: 'start' }) +
  ftext(-30, 80, 'ÂGE :', { size: 30, fill: '#7a8a99', stroke: 'none', font: 'Fredoka', anchor: 'start' }) + ftext(70, 128, o.age || '18 ANS', { size: 56, fill: SX.acc, stroke: 'none', font: 'Fredoka', anchor: 'start' })); }
function fLaptop(x, y, s, t, screen = '') { return G(tr(x, y, s), glow(0, -200, 420, '#8cc8ff', .3) + rect(-260, -340, 520, 340, '#2b2b33', 18, 7) + rect(-236, -316, 472, 292, '#eaf4ff', 8, 0) + screen + path('M-320 0L320 0L360 40L-360 40Z', '#9aa3ad', 6)); }
function fPhone(x, y, s, r, screen) { return G(tr(x, y, s, r), rect(-170, -330, 340, 660, '#2b2b33', 44, 7) + rect(-150, -295, 300, 590, '#f4f0ff', 24, 0) + screen + rect(-50, -318, 100, 14, '#444', 7, 0)); }
const qMarks = (x, y, t, n = 3, col = SX.acc2) => Array.from({ length: n }, (_, i) => G(tr(x + (i - (n - 1) / 2) * 90, y - Math.abs(Math.sin(t * 4 + i)) * 30, 1, (i - 1) * 14), ftext(0, 0, '?', { size: 90, fill: col }))).join('');
function tears(x, y, t, n = 4) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * 1.6 + i / n) % 1, sd = i % 2 ? 1 : -1; s += op(1 - k, path(`M${f1(x + sd * (40 + k * 160))} ${f1(y + k * k * 300 - k * 60)}q-10 18 0 26q10 -8 0 -26Z`, '#7fd0ff', 3)); } return s; }
const zzz = (x, y, t) => [0, 1, 2].map(i => { const k = (t * .6 + i / 3) % 1; return op(1 - k, ftext(x + k * 60, y - k * 120, 'z', { size: 30 + k * 30, fill: '#fff' })); }).join('');
const bird = (x, y, s, t, i = 0) => G(tr(x, y, s), path(`M-30 0Q-15 ${f1(-14 - 10 * Math.sin(t * 10 + i))} 0 0Q15 ${f1(-14 - 10 * Math.sin(t * 10 + i))} 30 0`, 'none', 6));
function fTree(x, y, s, t, k = 0) { const sw = wave(t, .3, 2, x); if (k === 1) return G(tr(x, y, s, sw), rect(-18, -120, 36, 120, '#8a5a3a', 8, 5) + path('M0 -460L130 -240L70 -240L160 -110L-160 -110L-70 -240L-130 -240Z', '#3f9a5a', 6));
  return G(tr(x, y, s, sw), rect(-24, -260, 48, 260, '#8a5a3a', 10, 5) + circ(0, -330, 150, '#5fb85f', 6) + circ(-90, -260, 100, '#4fa64f', 6) + circ(90, -270, 110, '#6cc46c', 6) + circ(-40, -380, 18, '#ff6b6b', 4) + circ(60, -300, 16, '#ff6b6b', 4)); }
function fBike(x, y, s, c = '#e2463a') { return G(tr(x, y, s), circ(-90, 0, 60, 'none', 10) + circ(90, 0, 60, 'none', 10) + circ(-90, 0, 8, OL, 0) + circ(90, 0, 8, OL, 0) + path('M-90 0L-20 -90L60 -90L90 0M-20 -90L0 0L60 -90M0 0L-90 0', 'none', 10, c) + line(-30, -110, 0, -110, 12) + line(60, -90, 70, -130, 8) + line(50, -130, 90, -130, 10)); }
function fCar(x, y, s, c = '#ffd23f', flip = 0) { return G(tr(x, y, s) + (flip ? ' scale(-1 1)' : ''), path('M-230 0L-230 -80Q-220 -110 -160 -110L-110 -190Q-90 -210 -40 -210L80 -210Q120 -210 150 -170L190 -110Q240 -105 240 -70L240 0Z', c, 7) + path('M-100 -110L-60 -180L10 -180L10 -110Z', '#bfe6ff', 5) + path('M40 -110L40 -180L100 -180L150 -110Z', '#bfe6ff', 5) + circ(-130, 0, 50, '#333', 7) + circ(140, 0, 50, '#333', 7) + circ(-130, 0, 18, '#ccc', 4) + circ(140, 0, 18, '#ccc', 4) + rect(210, -80, 30, 20, '#fff6c0', 4, 4)); }
function fLamp(x, y, s = 1, on = 0) { return G(tr(x, y, s), rect(-14, -620, 28, 620, '#4b5563', 6, 5) + path('M0 -620Q0 -680 60 -680', 'none', 12, '#4b5563') + path('M30 -690L100 -690L110 -650L20 -650Z', '#4b5563', 5) + (on ? glow(65, -630, 120, '#fff3b0', .6) : '') + ell(65, -650, 30, 10, on ? '#fff3b0' : '#e6e9ee', 3) + rect(-26, -20, 52, 20, '#4b5563', 4, 5)); }
const pigeon = (x, y, s, t, i = 0) => G(tr(x, y, s, Math.sin(t * 6 + i) > .6 ? 20 : 0), ell(0, 0, 40, 26, '#9aa3ad', 5) + circ(30, -24, 16, '#9aa3ad', 5) + path('M44 -26L58 -22L44 -18Z', '#ff9a3c', 3) + circ(34, -28, 3, OL, 0) + line(-6, 24, -6, 40, 4) + line(8, 24, 8, 40, 4));
function walkers(t, y = 1290, n = 3, sc = .5, seed = 40) { let s = ''; for (let i = 0; i < n; i++) { const x = ((i * 420 + t * (50 + i * 20) * (i % 2 ? 1 : -1)) % 1700 + 1700) % 1700 - 300; s += person({ age: 'adult', x, y, s: sc, hair: ['bun', 'side', 'curly', 'long'][i % 4], hairColor: ['#8a5a3a', '#2b2420', '#1f1a18', '#e0a040'][i % 4], shirt: ['#7aa6d8', '#ff8fb1', '#ffd23f', '#7be07b'][i % 4], pants: '#4b5b7a', expr: 'happy', walk: 3, flip: i % 2, seed: seed + i }, t); } return s; }

// ============================================================
//  DÉCORS RICHES (15–30 éléments, 2–3 éléments animés chacun)
// ============================================================
// maternité (nuit) : néons, fenêtre nuit + rideaux, horloge, diplôme, poster, moniteur ECG animé, perfusion qui goutte, étagère, armoire,
// distributeur, prises, ballon cœur, sol carrelé, tabouret, poubelle, plante, chaussons, premier plan flou
function maternite(t, o = {}) { const night = o.night ?? 1;
  let s = grad('#e2f5ef', '#cdeee4', -M, -M, W + 2 * M, H + 2 * M) + dStripes(900, 'rgba(0,0,0,0)', 'rgba(255,255,255,.25)', 110, 40) + rect(-M, 900, W + 2 * M, 350, '#b5e2d4', 0, 0) + rect(-M, 888, W + 2 * M, 22, '#fff', 0, 4);
  s += dNeon(140, 460, 40, Math.sin(t * 13) > -.9) + dNeon(620, 940, 40);
  s += dWindow(60, 250, 290, 340, t, night, '#cfe8ff');
  if (!o.noClock) s += wallClock(540, 230, 66, t, 6);
  s += dPoster(880, 300, 170, 220, '#ff8fb1', 'BÉBÉS', 'chut !', '#fff', 3);
  s += G(tr(560, 440), rect(-110, -66, 220, 132, '#c38a52', 8, 5) + rect(-95, -51, 190, 102, '#fdf6e3', 0, 3) + ftext(0, 8, 'DIPLÔME', { size: 30, fill: OL, stroke: 'none', font: 'Fredoka' }) + circ(62, 34, 14, '#e2463a', 4));
  let ecg = ''; for (let i = 0; i <= 22; i++) { const ph = ((i / 22) - t * 1.2 % 1 + 2) % 1; ecg += (i ? 'L' : 'M') + f1(-110 + i * 10) + ' ' + f1(ph > .45 && ph < .5 ? -45 : ph > .5 && ph < .56 ? 30 : 0); }
  s += G(tr(930, 640), line(0, 100, 0, 610, 10, '#9aa3ad') + rect(-60, 600, 120, 16, '#9aa3ad', 6, 4) + rect(-140, -100, 280, 200, '#3a3f4a', 18, 6) + rect(-122, -82, 244, 150, '#0f1a14', 8, 0) + `<path d="${ecg}" fill="none" stroke="#5dff8a" stroke-width="5" stroke-linejoin="round"/>` +
    ftext(90, 50, String(120 + Math.round(Math.sin(t * 2) * 4)), { size: 28, fill: '#5dff8a', stroke: 'none', font: 'Fredoka' }) + circ(110, -88, 7, Math.sin(t * 8) > 0 ? '#ff4d4d' : '#552', 0));
  const dk = (t * .8) % 1; s += G(tr(770, 540), line(0, 0, 0, 710, 8, '#9aa3ad') + path('M-40 0L40 0', 'none', 8, '#9aa3ad') + rect(-36, 10, 72, 110, 'rgba(210,235,255,.85)', 14, 5) + rect(-28, 60, 56, 52, 'rgba(120,200,255,.5)', 8, 0) + path('M0 120Q20 200 -10 300', 'none', 4, '#9aa3ad') + circ(0, 130 + dk * 60, 6, '#7fd0ff', 0));
  s += dShelf(40, 760, 300, dJar(80, 760, '#fff') + dJar(140, 760, '#bfe6ff') + dBottle(200, 760, '#ff8fb1') + G(tr(275, 760), circ(-18, -62, 13, '#c88a52', 4) + circ(18, -62, 13, '#c88a52', 4) + circ(0, -42, 26, '#c88a52', 4) + ell(0, -12, 24, 16, '#c88a52', 4)), '#fff');
  s += G(tr(170, 1250), rect(-130, -250, 260, 250, '#fff', 12, 6) + [0, 1, 2].map(i => rect(-110, -230 + i * 76, 220, 60, '#eef3f5', 8, 4) + rect(-20, -205 + i * 76, 40, 10, '#9aa3ad', 4, 0)).join('') + dBottle(-70, -250, '#7be07b', .8) + G(tr(60, -250), rect(-30, -60, 60, 60, '#fff', 8, 4) + rect(-8, -50, 16, 40, '#e2463a', 0, 0) + rect(-20, -38, 40, 16, '#e2463a', 0, 0)));
  s += G(tr(420, 860), rect(-34, -70, 68, 120, '#fff', 12, 5) + rect(-24, -30, 48, 40, '#bfe6ff', 6, 3) + rect(-8, 50, 16, 20, '#9aa3ad', 3, 3)) + dOutlet(420, 1180) + dSwitch(1010, 960);
  s += WASH('rgba(255,255,255,.12)') + dChecker(1250, '#eef3f5', '#d8e2e6', 100) + line(-M, 1250, W + M, 1250, 6);
  s += G(tr(600, 1430), ell(0, -110, 70, 18, '#7fd3c4', 5) + line(0, -100, 0, 0, 10) + [-1, 1].map(sd => line(0, -10, sd * 50, 20, 8)).join('')) + dBin(990, 1440, '#e6e9ee', .7) + plant(70, 1300, .7) + dSneakers(330, 1640, '#ff8fb1', .6) + ell(820, 1700, 130, 20, 'rgba(120,200,255,.35)', 0);
  s += fBalloon(1030, 1050, .8, '#ff5d73', t, 2);
  if (o.fg !== false) s += fgBlur(G(tr(1100, 1000), path('M-120 -1100Q-60 -400 -140 900L200 900L200 -1100Z', '#ffd0e0', 6)), 12);
  return s; }
// berceau de maternité (bac transparent + couverture), mobile étoiles qui tourne
function fCrib(x, y, s, t, inner = '') { let mob = line(0, -560, 0, -470, 5) + line(-110, -470, 110, -470, 6); for (let i = 0; i < 3; i++) { const a = t * 1.5 + i * 2.1; mob += G(tr(Math.cos(a) * 100, -440 + Math.sin(a) * 10), line(0, -30, 0, 0, 3) + sparkle(0, 14, .45, [SX.acc2, '#ff8fb1', '#7fd0ff'][i])); }
  return G(tr(x, y, s), line(-200, 0, -200, 250, 12, '#9aa3ad') + line(200, 0, 200, 250, 12, '#9aa3ad') + rect(-240, 230, 480, 20, '#9aa3ad', 8, 5) + inner + rect(-230, -170, 460, 200, 'rgba(220,240,255,.55)', 26, 7) + path('M-226 -60Q0 -100 226 -60L226 10Q0 40 -226 10Z', '#bfe6ff', 5) + [-140, -40, 60, 160].map(xx => circ(xx, -30, 10, '#fff', 0)).join('') + mob); }

// salon de fête : papier peint, cadres, horloge, calendrier, étagère, fenêtre + vue, banderole JOYEUX ANNIV, guirlande, ballons, canapé + coussins,
// table à cadeaux + chips + gobelets, lampadaire, plante, tapis, chat qui dort (queue), confettis au sol, ballon flou premier plan
function fBanner(t, y = 150, str = 'JOYEUX ANNIV') { let s = path(`M30 ${y - 40}Q540 ${y + 40} 1050 ${y - 40}`, 'none', 5); const L = str.replace(/ /g, '').split(''), n = L.length;
  L.forEach((c, i) => { const k = (i + .5) / n, x = lerp(60, 1020, k), yy = y - 40 + 80 * 4 * k * (1 - k) * .5, sw = Math.sin(t * 3 + i) * 5; s += G(tr(x, yy, 1, sw), path('M-34 0L34 0L34 70L0 92L-34 70Z', ['#ff6b6b', '#ffd23f', '#5ec4f0', '#7be07b', '#b56cff'][i % 5], 5) + ftext(0, 54, c, { size: 40, fill: '#fff', stroke: OL, sw: 6 })); }); return s; }
function salonParty(t, o = {}) { const party = o.party ?? 1;
  let s = dStripes(1250, '#ffe7cc', '#ffdcb8', 120, 54) + dDots(1250, 'rgba(255,255,255,.45)', 120, 6);
  s += dWindow(700, 320, 290, 340, t, o.night || 0, '#7be0c8');
  s += dPic(150, 350, 150, 120, 0, '#c38a52', '#bfe6ff', -3) + dPic(320, 330, 100, 120, 1, '#7a5a3a', '#fff1d6', 4) + dPic(250, 500, 110, 90, 2, '#c38a52', '#ffe0ec', 2);
  s += wallClock(540, 330, 46, t, 6) + dCalendar(545, 500);
  s += dShelf(60, 720, 380, dBooks(80, 720, 9, 7) + dTrophy(340, 720, .7) + dCactus(405, 720, .6));
  s += dOutlet(640, 1180) + dSwitch(1030, 860);
  if (party) s += dBunting(-40, 1120, 40, t) + fBanner(t, 170);
  s += WASH() + dBase(1250, '#fff') + dParquet(1250) + dRug(540, 1500, 430, 100, '#9d86ff', '#ffd23f');
  s += G(tr(250, 1250), rect(-240, -240, 480, 150, '#5b8fd8', 40, 7) + rect(-270, -120, 540, 120, '#4a7cc4', 30, 7) + rect(-290, -210, 70, 210, '#5b8fd8', 30, 7) + rect(220, -210, 70, 210, '#5b8fd8', 30, 7) + rect(-190, -205, 120, 90, '#ffd23f', 26, 6) + rect(50, -205, 120, 90, '#ff8fb1', 26, 6) + rect(-250, 0, 30, 26, '#8a5a3a', 4, 4) + rect(220, 0, 30, 26, '#8a5a3a', 4, 4));
  s += G(tr(860, 1250), rect(-170, -140, 340, 24, '#b98552', 6, 6) + rect(-150, -116, 20, 116, '#a2703f', 4, 4) + rect(130, -116, 20, 116, '#a2703f', 4, 4));
  if (party) { s += fGift(790, 1110, .7, '#ff6b6b') + fGift(900, 1110, .55, '#5ec4f0', '#ff8fb1') + ell(985, 1102, 50, 16, '#ffd23f', 5) + [0, 1, 2].map(i => circ(965 + i * 18, 1092, 9, '#ff9a3c', 3)).join('') + [0, 1].map(i => path(`M${700 + i * 40} 1110L${694 + i * 40} 1060L${726 + i * 40} 1060L${720 + i * 40} 1110Z`, ['#ff8fb1', '#7be07b'][i], 4)).join('');
    s += fBalloon(120, 900, .9, '#ff6b6b', t, 0) + fBalloon(200, 870, .8, '#ffd23f', t, 1) + fBalloon(960, 980, .9, '#5ec4f0', t, 2) + fBalloon(1030, 940, .75, '#b56cff', t, 3);
    const r = rng(8); for (let i = 0; i < 22; i++) s += rect(r() * W, 1270 + r() * 600, 16, 10, ['#ff6b6b', '#ffd23f', '#5ec4f0', '#7be07b'][i % 4], 3, 0); }
  s += dFloorLamp(1050, 1250, .75, 0, t) + plant(480, 1255, .7);
  s += G(tr(170, 1440), path(`M-60 10Q${f1(-140 + Math.sin(t * 3) * 10)} ${f1(-10 + Math.sin(t * 3) * 25)} -110 -50`, 'none', 18, OL) + path(`M-60 10Q${f1(-140 + Math.sin(t * 3) * 10)} ${f1(-10 + Math.sin(t * 3) * 25)} -110 -50`, 'none', 9, '#ff9a3c') + ell(0, 0, 80, 40, '#ff9a3c', 6) + circ(62, -22, 34, '#ff9a3c', 6) + path('M42 -48L50 -74L64 -52Z', '#ff9a3c', 5) + path('M72 -52L86 -74L90 -46Z', '#ff9a3c', 5) + path('M50 -24q8 6 16 0M72 -24q8 6 16 0', 'none', 4)) + zzz(240, 1380, t);
  if (party && o.fg !== false) s += fgBlur(G(tr(980, 1820, 1.8), fBalloon(0, 0, 1, '#ff8fb1', t, 4)), 12);
  return s; }

// cour d'école : ciel + nuages + oiseaux, ville lointaine brumeuse, école (briques, toit, fenêtres, horloge, enseigne, drapeau), grille,
// arbres, panier de basket, banc, vélo, poubelle, marelle, ballon, élèves qui courent, feuilles floues au premier plan
function schoolyard2(t) { let s = SKY(t, '#8fd3ff', '#eaf7ff');
  for (let i = 0; i < 3; i++) s += bird(((t * 90 + i * 300) % 1500) - 200, 150 + i * 40 + Math.sin(t * 2 + i) * 10, .8, t, i);
  let far = ''; for (let i = 0; i < 9; i++) far += rect(-200 + i * 170, 700 - (i * 53 % 160), 150, 600, ['#b9c6d8', '#c9d3e0', '#a9b8cc'][i % 3], 4, 0); s += op(.7, far);
  let sc = rect(-470, -700, 940, 700, '#f0b98a', 8, 7); for (let y = -680; y < -10; y += 34) sc += line(-466, y, 466, y, 2, 'rgba(160,80,40,.25)');
  sc += path('M-510 -700L0 -900L510 -700Z', '#c96a3c', 7) + G(tr(0, -770), circ(0, 0, 54, '#fff', 6) + line(0, 0, 0, -36, 6) + G(`rotate(${f1(t * 90)})`, line(0, 0, 0, -44, 4, SX.acc)));
  for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const wx = -420 + i * 145, wy = -640 + r * 200; sc += rect(wx, wy, 100, 120, '#cfe8ff', 6, 5) + line(wx + 50, wy, wx + 50, wy + 120, 4) + ((i + r) % 4 === 1 ? circ(wx + 30, wy + 90, 22, '#f2c9a0', 3) : '') + ((i + r) % 3 === 0 ? rect(wx, wy, 100, 30, '#ff8fb1', 4, 3) : ''); }
  sc += rect(-110, -260, 220, 260, '#8a5a3a', 10, 6) + line(0, -260, 0, 0, 5) + rect(-180, -330, 360, 60, '#2f6f8f', 10, 6) + ftext(0, -286, 'ÉCOLE', { size: 40, fill: '#fff', stroke: 'none', font: 'Fredoka' });
  s += G(tr(540, 1180), sc) + line(990, 1180, 990, 520, 8) + path(`M990 530L${f1(1110 + Math.sin(t * 5) * 10)} ${f1(560 + Math.sin(t * 6) * 8)}L990 610Z`, SX.acc, 5);
  s += fTree(70, 1200, .95, t) + fTree(1010, 1210, .8, t, 1);
  for (let x = -60; x < W + 60; x += 50) s += line(x, 1080, x, 1190, 7, '#59616c'); s += line(-60, 1095, W + 60, 1095, 7, '#59616c') + line(-60, 1170, W + 60, 1170, 7, '#59616c');
  s += WASH('rgba(255,255,255,.12)') + rect(-M, 1190, W + 2 * M, 1500, '#d9c6a6', 0, 0) + line(-M, 1190, W + M, 1190, 6);
  s += G(tr(890, 1250), rect(-10, -420, 20, 420, '#59616c', 4, 5) + rect(-90, -500, 180, 120, '#fff', 8, 6) + rect(-30, -460, 60, 50, 'none', 4, 5, '#e2463a') + ell(0, -372, 50, 12, 'none', 6, '#ff6b2b'));
  s += G(tr(240, 1300), rect(-150, -60, 300, 24, '#b98552', 6, 5) + rect(-150, -110, 300, 20, '#b98552', 6, 5) + line(-130, -36, -130, 0, 8) + line(130, -36, 130, 0, 8)) + fBike(620, 1290, .6, '#4d7cf0') + dBin(1030, 1330, '#5fb85f', .7);
  [[200, 1500], [300, 1500], [250, 1600], [250, 1700]].forEach(([x, y], i) => s += rect(x - 50, y - 50, 100, 100, 'none', 0, 6, '#fff') + ftext(x, y + 18, String(i + 1), { size: 44, fill: '#fff', stroke: 'none', font: 'Fredoka' }));
  s += dBall(((t * 120) % 1400) - 200, 1560, 34, '#ff9a3c', '#fff', t * 200) + kidsBg(t, 1235, 3, .38);
  return s + fgBlur(G(tr(1050, -40, 1.4), circ(0, 0, 160, '#5fb85f', 6) + circ(-120, 60, 110, '#4fa64f', 6)), 12); }

// rue : ciel, skyline brumeuse, façades (fenêtres, balcons, plantes, stores), commerces + enseignes, bâtiment central (mairie / maternité / café),
// trottoir, route, voitures garées, lampadaires, arbres en bac, vélo, poubelle, pigeons, passants, poteau flou au premier plan
function fFacade(x, w, top, col, t, sign = '', aw = '#e2463a') { let s = rect(x, top, w, 1250 - top, col, 6, 6) + rect(x - 12, top - 22, w + 24, 26, shade(col, -.2), 4, 5);
  const n = Math.max(2, Math.floor(w / 115)), cw = w / n;
  for (let j = 0, y = top + 50; y < 1250 - 380; y += 150, j++) for (let i = 0; i < n; i++) { const wx = x + i * cw + cw * .18, ww = cw * .64, lit = (i * 7 + j * 3) % 5 === 0;
    s += rect(wx, y, ww, 96, lit ? '#ffe9a8' : '#cfe8ff', 6, 5) + line(wx + ww / 2, y, wx + ww / 2, y + 96, 4) + ((i + j) % 3 === 1 ? rect(wx - 10, y + 80, ww + 20, 26, '#59616c', 4, 4) + [0, 1, 2].map(q => line(wx + q * ww / 2, y + 80, wx + q * ww / 2, y + 106, 3)).join('') : '') + ((i + j) % 4 === 2 ? path(`M${wx} ${y}L${wx + ww} ${y}L${wx + ww} ${y + 30}L${wx} ${y + 30}Z`, aw, 4) : '') + ((i * 3 + j) % 5 === 1 ? circ(wx + ww * .25, y + 86, 16, '#5fb85f', 4) : ''); }
  if (sign) { const sy = 1250 - 300; s += rect(x, sy, w, 300, shade(col, -.12), 0, 5) + rect(x + 20, sy + 110, w - 40, 170, '#bfe0f2', 8, 5) + line(x + w / 2, sy + 110, x + w / 2, sy + 280, 5);
    for (let i = 0; i < Math.floor(w / 50); i++) s += path(`M${x + i * 50} ${sy + 20}L${x + i * 50 + 50} ${sy + 20}L${x + i * 50 + 50} ${sy + 80}Q${x + i * 50 + 25} ${sy + 100} ${x + i * 50} ${sy + 80}Z`, i % 2 ? aw : '#fff', 4);
    s += rect(x + w / 2 - Math.min(w * .4, sign.length * 17 + 20), sy - 50, Math.min(w * .8, sign.length * 34 + 40), 60, '#2b2420', 10, 4) + ftext(x + w / 2, sy - 8, sign, { size: 34, fill: '#fff', stroke: 'none', font: 'Fredoka' }); }
  return s; }
function streetBg(t, o = {}) { const main = o.main || 'mairie';
  let s = SKY(t, o.sky1 || '#8fd3ff', o.sky2 || '#e6f6ff');
  for (let i = 0; i < 3; i++) s += bird(((t * 80 + i * 330) % 1500) - 200, 140 + i * 50, .7, t, i);
  let far = ''; for (let i = 0; i < 10; i++) far += rect(-260 + i * 160, 380 + (i * 71 % 200), 140, 900, '#b7c4d6', 4, 0) + rect(-230 + i * 160, 420 + (i * 71 % 200), 30, 30, '#d4dde8', 2, 0); s += op(.6, far);
  s += fFacade(-140, 330, 360, '#f0b8a8', t, 'BOULANGERIE', '#ff8fb1') + fFacade(870, 360, 300, '#bcd7c4', t, 'FLEURS', '#5fb85f');
  if (main === 'mairie') { let m = rect(220, 420, 640, 830, '#f4ecd8', 6, 7) + path('M200 420L540 250L880 420Z', '#e8dcc0', 7) + G(tr(540, 340), circ(0, 0, 50, '#fff', 6) + line(0, 0, 0, -32, 5) + G(`rotate(${f1(t * 60)})`, line(0, 0, 0, -40, 4, '#e2463a'))) + rect(300, 470, 480, 70, '#2b2420', 10, 5) + ftext(540, 522, 'MAIRIE', { size: 48, fill: '#fff', stroke: 'none', font: 'Fredoka' });
    for (let i = 0; i < 5; i++) m += rect(270 + i * 120, 580, 50, 670, '#fff', 4, 5) + rect(260 + i * 120, 570, 70, 20, '#e8dcc0', 4, 4);
    m += line(540, 250, 540, 120, 7) + [['#3a5bd9', 0], ['#fff', 1], ['#e2463a', 2]].map(([c, i]) => path(`M${540 + i * 40} ${125 + Math.sin(t * 5 + i) * 6}L${580 + i * 40} ${125 + Math.sin(t * 5 + i + 1) * 6}L${580 + i * 40} ${185 + Math.sin(t * 5 + i + 1) * 6}L${540 + i * 40} ${185 + Math.sin(t * 5 + i) * 6}Z`, c, 4)).join('');
    s += m + rect(240, 1200, 600, 50, '#e8dcc0', 4, 5); }
  else if (main === 'mater') { s += fFacade(220, 650, 300, '#e9f2f6', t, 'MATERNITÉ', '#5ec4f0') + G(tr(545, 380), rect(-60, -60, 120, 120, '#fff', 14, 6) + rect(-18, -46, 36, 92, '#e2463a', 0, 0) + rect(-46, -18, 92, 36, '#e2463a', 0, 0)); }
  else { s += fFacade(220, 650, 330, '#ffe0a8', t, 'CAFÉ DU COIN', '#7a5cff'); }
  s += fLamp(150, 1250, 1, o.night) + fLamp(930, 1250, 1, o.night) + G(tr(330, 1250), rect(-50, -60, 100, 60, '#b98552', 6, 5)) + fTree(330, 1190, .55, t);
  s += WASH('rgba(255,255,255,.12)') + rect(-M, 1250, W + 2 * M, 200, '#d6dae0', 0, 0); for (let x = -M; x < W + M; x += 120) s += line(x, 1250, x - 40, 1450, 3, '#c0c6ce'); s += line(-M, 1250, W + M, 1250, 6) + rect(-M, 1440, W + 2 * M, 22, '#a7adb5', 0, 5);
  s += rect(-M, 1462, W + 2 * M, 800, '#6b717a', 0, 0); for (let x = -M + ((t * 0) % 200); x < W + M; x += 200) s += rect(x, 1700, 110, 18, '#fff', 4, 0);
  if (main === 'cafe') s += [[380, 1360], [700, 1360]].map(([x, y]) => G(tr(x, y), rect(-80, -90, 160, 18, '#fff', 6, 5) + line(0, -72, 0, 0, 8) + line(-40, 0, 40, 0, 8) + path('M0 -90L0 -360', 'none', 6) + path('M-150 -330Q0 -420 150 -330Z', '#7a5cff', 6) + dMug(-30, -90, t, '#fff') + rect(-140, -60, 40, 60, '#b98552', 4, 4) + rect(100, -60, 40, 60, '#b98552', 4, 4))).join('');
  s += fCar(200, 1620, .9, '#ffd23f') + fCar(900, 1650, .9, '#ff6b6b', 1) + fBike(640, 1420, .5, '#7be07b') + dBin(1020, 1420, '#5fb85f', .6) + pigeon(500, 1400, .8, t, 0) + pigeon(560, 1420, .7, t, 2) + walkers(t, 1300, 3, .42);
  return s + fgBlur(G(tr(-30, 0), rect(-30, -100, 60, 2200, '#4b5563', 6, 6)), 10); }

// parc : soleil qui tourne, nuages, collines, arbres variés, étang + canards, banc, cerf-volant, fleurs, papillons, allée, lampadaire, pique-nique
function park(t) { let s = SKY(t, '#9fe0ff', '#fff4dc') + G(tr(880, 230), sunburst(0, 0, 14, 'rgba(255,230,120,.5)', 'rgba(255,255,255,0)', t * 10) + circ(0, 0, 80, '#ffd23f', 6));
  s += path('M-700 1000Q-100 700 500 980T1800 950L1800 1300L-700 1300Z', '#b5e48c', 6) + path('M-700 1080Q300 860 1200 1060L1800 1080L1800 1300L-700 1300Z', '#9fd77a', 6);
  s += fTree(80, 1150, .9, t) + fTree(1000, 1120, .75, t, 1) + fTree(820, 1080, .5, t) + fTree(260, 1060, .45, t, 1);
  const kx = 600 + Math.sin(t * 1.3) * 60, ky = 300 + Math.cos(t * 1.7) * 30; s += path(`M${f1(kx)} ${f1(ky + 70)}Q${f1(kx - 100)} 700 380 1120`, 'none', 3) + G(tr(kx, ky, 1, Math.sin(t * 2) * 10), path('M0 -70L50 0L0 70L-50 0Z', '#ff6b6b', 6) + line(0, -70, 0, 70, 3) + line(-50, 0, 50, 0, 3)) + path(`M${f1(kx)} ${f1(ky + 70)}q20 30 0 60q-20 30 0 60`, 'none', 4, SX.acc2);
  s += WASH('rgba(255,255,255,.1)') + rect(-M, 1200, W + 2 * M, 1500, '#8fd16a', 0, 0) + path('M380 2200Q420 1600 560 1200L700 1200Q620 1600 780 2200Z', '#f1e2c2', 6);
  s += ell(180, 1380, 230, 70, '#7fd0ff', 6) + ell(150, 1370, 120, 20, 'rgba(255,255,255,.5)', 0) + [0, 1].map(i => { const dx = Math.sin(t * .8 + i * 3) * 80; return G(tr(150 + dx + i * 70, 1370, .7, 0) + (Math.cos(t * .8 + i * 3) < 0 ? ' scale(-1 1)' : ''), ell(0, 0, 40, 24, '#fff', 5) + circ(28, -26, 18, '#fff', 5) + path('M44 -28L62 -24L44 -18Z', '#ff9a3c', 3) + circ(32, -30, 3, OL, 0)); }).join('');
  s += G(tr(880, 1330), rect(-140, -50, 280, 22, '#b98552', 6, 5) + rect(-140, -100, 280, 20, '#b98552', 6, 5) + line(-120, -28, -120, 20, 8) + line(120, -28, 120, 20, 8)) + fLamp(1040, 1260, .7);
  const r = rng(3); for (let i = 0; i < 18; i++) { const x = r() * W, y = 1230 + r() * 600; s += circ(x, y, 9, ['#ffd23f', '#ff8fb1', '#fff', '#b56cff'][i % 4], 3) + line(x, y + 8, x, y + 26, 3, '#4fa64f'); }
  for (let i = 0; i < 2; i++) { const bx = 300 + i * 480 + Math.sin(t * 1.2 + i) * 80, by = 900 + Math.cos(t * 1.7 + i) * 60, fl = Math.abs(Math.sin(t * 14 + i)); s += G(tr(bx, by, .8), ell(-14, 0, 16 * fl + 3, 18, ['#ff8fb1', SX.acc2][i], 3) + ell(14, 0, 16 * fl + 3, 18, ['#ff8fb1', SX.acc2][i], 3) + line(0, -12, 0, 12, 4)); }
  s += G(tr(700, 1560), path('M-160 0L160 0L200 90L-200 90Z', '#ff6b6b', 5) + [-120, -40, 40, 120].map(x => line(x, 0, x * 1.25, 90, 4, '#fff')).join('') + rect(-40, -60, 80, 60, '#d8a96a', 8, 5) + path('M-30 -60Q0 -100 30 -60', 'none', 6));
  return s + fgBlur(G(tr(CX, 1900), [-500, -300, -100, 100, 300, 500].map(x => path(`M${x - 60} 0Q${x} -200 ${x + 60} 0Z`, '#5fb85f', 6)).join('')), 10); }

// 2100 : ciel violet-orange, planète à anneaux, tours futuristes (néons), hologramme « 2100 », voitures volantes, monorail, drone, chien robot, sol métal
function future2100(t) { let s = grad('#4b2a8a', '#ff9a6b', -M, -M, W + 2 * M, 1900) + G(tr(820, 260), circ(0, 0, 110, '#ffcf6b', 6) + ell(0, 0, 200, 40, 'none', 8, '#fff') + ell(0, 0, 200, 40, 'none', 4, '#ff8fb1'));
  for (let i = 0; i < 12; i++) s += sparkle((i * 197) % W, 80 + (i * 83) % 300, .12 + .06 * Math.sin(t * 5 + i), '#fff');
  let far = ''; for (let i = 0; i < 9; i++) far += rect(-200 + i * 170, 500 - (i * 61 % 220), 110, 900, '#6a4aa8', 30, 0); s += op(.75, far);
  const tower = (x, w, top, c) => { let g = rect(x, top, w, 1250 - top, c, 30, 7) + path(`M${x + w / 2} ${top - 120}L${x + w / 2} ${top}`, 'none', 8); for (let y = top + 60; y < 1200; y += 70) g += rect(x + 20, y, w - 40, 24, Math.sin(t * 3 + y) > .3 ? '#7ff0ff' : '#3a2f7a', 10, 0); return g + circ(x + w / 2, top - 130, 14, Math.sin(t * 6) > 0 ? '#ff4f87' : '#fff', 4); };
  s += tower(-60, 220, 360, '#3d3080') + tower(200, 160, 520, '#5040a0') + tower(850, 260, 300, '#3d3080') + tower(700, 140, 600, '#5a48b0');
  s += line(-M, 760, W + M, 760, 14, '#c9c2ff') + G(tr(((t * 400) % 2200) - 600, 730), rect(-260, -50, 520, 80, '#fff', 40, 6) + [-180, -90, 0, 90, 180].map(x => rect(x - 30, -34, 60, 34, '#7ff0ff', 10, 4)).join(''));
  for (let i = 0; i < 3; i++) { const x = ((t * (160 + i * 60) * (i % 2 ? -1 : 1) + i * 500) % 1600 + 1600) % 1600 - 260, y = 300 + i * 150 + Math.sin(t * 2 + i) * 15; s += G(tr(x, y, .55) + (i % 2 ? ' scale(-1 1)' : ''), ell(0, 0, 150, 50, ['#ff6b6b', '#ffd23f', '#5ec4f0'][i], 7) + ell(20, -36, 70, 36, '#bfe6ff', 6) + ell(-100, 40, 50, 12, '#7ff0ff', 0) + ell(100, 40, 50, 12, '#7ff0ff', 0)); }
  const dx = 300 + Math.sin(t) * 200; s += G(tr(dx, 600 + Math.sin(t * 3) * 20), rect(-40, -14, 80, 28, '#ddd', 10, 5) + line(-60, -20, 60, -20, 5) + ell(-60, -24, 30, 6, 'rgba(255,255,255,.6)', 0) + ell(60, -24, 30, 6, 'rgba(255,255,255,.6)', 0) + circ(0, 18, 8, '#ff4f87', 3));
  s += WASH('rgba(40,20,90,.12)') + rect(-M, 1250, W + 2 * M, 900, '#7a76a8', 0, 0); for (let x = -M; x < W + M; x += 140) s += line(x, 1250, x - 60, 2000, 4, '#6a6698'); s += line(-M, 1250, W + M, 1250, 6) + line(-M, 1420, W + M, 1420, 6, '#7ff0ff');
  const rx = ((t * 70) % 1500) - 200; s += G(tr(rx, 1380, .8), rect(-70, -70, 140, 70, '#c9ced6', 20, 6) + rect(40, -120, 70, 60, '#c9ced6', 16, 6) + circ(85, -96, 9, '#7ff0ff', 0) + [-50, -10, 30, 60].map((x, i) => line(x, 0, x + Math.sin(t * 10 + i) * 10, 40, 8)).join('') + line(-70, -60, -110, -100, 6));
  return s + fgBlur(G(tr(1000, 1820, 1.5), ell(0, 0, 200, 60, '#ff4f87', 7) + ell(0, -40, 90, 40, '#bfe6ff', 6)), 12); }

// repaire du méchant : briques, torches (flammes), fenêtre orage (éclairs), chauves-souris, chaînes, tableau « PLAN », cage, tapis rouge
function lair(t) { let s = grad('#2a1f45', '#3a2560', -M, -M, W + 2 * M, H + 2 * M);
  for (let j = 0, y = -M; y < 1250; y += 70, j++) for (let x = -M + (j % 2) * 70; x < W + M; x += 140) s += rect(x, y, 136, 66, j % 3 ? '#3b2b63' : '#43316e', 6, 3, '#24183d');
  const fl = Math.sin(t * 23) > .7; s += rect(380, 180, 320, 300, fl ? '#d8d0ff' : '#1a1430', 14, 8) + line(540, 180, 540, 480, 7) + line(380, 330, 700, 330, 7) + (fl ? lightning(520, 190, .5) : '');
  s += [120, 960].map(x => G(tr(x, 600), rect(-16, 0, 32, 120, '#8a5a3a', 5, 5) + flames(0, 0, 70, 110, t, x) + glow(0, -40, 220, '#ff9a3c', .35))).join('');
  for (let i = 0; i < 3; i++) { const bx = ((t * 160 + i * 400) % 1400) - 200, by = 140 + i * 70 + Math.sin(t * 8 + i) * 16; s += G(tr(bx, by, .7), path(`M0 0Q-30 ${f1(-30 * Math.sin(t * 16 + i))} -70 0Q-40 10 0 10Q40 10 70 0Q30 ${f1(-30 * Math.sin(t * 16 + i))} 0 0Z`, '#151022', 4) + circ(0, 4, 14, '#151022', 0)); }
  s += [250, 830].map(x => Array.from({ length: 6 }, (_, i) => ell(x + Math.sin(t * 2 + i * .5) * i * 3, 40 + i * 40, 12, 20, 'none', 6, '#9aa3ad')).join('')).join('');
  s += G(tr(880, 880, 1, 3), rect(-150, -120, 300, 240, '#2f3a33', 12, 7) + ftext(0, -60, 'PLAN :', { size: 36, fill: '#fff', stroke: 'none', font: 'Fredoka' }) + ftext(0, -10, 'ruiner les', { size: 30, fill: 'rgba(255,255,255,.8)', stroke: 'none', font: 'Fredoka' }) + ftext(0, 30, 'anniversaires', { size: 30, fill: 'rgba(255,255,255,.8)', stroke: 'none', font: 'Fredoka' }) + path('M-90 70l40 20l40 -30l40 20', 'none', 5, '#ff4d4d'));
  s += rect(-M, 1250, W + 2 * M, 900, '#241a3a', 0, 0) + line(-M, 1250, W + M, 1250, 6) + path('M300 1250L780 1250L900 2000L180 2000Z', '#a8263a', 6) + [0, 1, 2].map(i => G(tr(100 + i * 70, 1500 + i * 30), circ(0, 0, 22, '#e8e0d0', 4) + line(-30, 20, 30, 50, 10, '#e8e0d0'))).join('');
  return s + op(.25 + .1 * Math.sin(t * 3), rect(-M, -M, W + 2 * M, H + 2 * M, '#150a30', 0, 0)); }

function fStroller(x, y, s, t, inner = '') { return G(tr(x, y, s), circ(-90, 0, 38, '#2b2b33', 7) + circ(90, 0, 38, '#2b2b33', 7) + circ(-90, 0, 12, '#ccc', 4) + circ(90, 0, 12, '#ccc', 4) + path('M-90 0L0 -60L90 0M0 -60L0 -100', 'none', 8) + line(130, -150, 230, -290, 10) + line(210, -290, 260, -290, 14) +
  path('M-140 -150Q-140 -310 40 -310L40 -150Z', '#5b44d0', 7) + inner + path('M-150 -160L140 -160Q150 -40 0 -40Q-150 -40 -150 -160Z', '#7a5cff', 7) + [-90, -30, 30, 90].map(xx => circ(xx, -110, 9, '#fff', 0)).join('')); }
function fVillain(x, y, s, t, k = 0) { const rub = Math.sin(t * 14) * 14 * k, bob = Math.abs(Math.sin(t * 9)) * 14 * k;
  const arm = sd => path(`M${sd * 150} 20Q${sd * 260} 90 ${sd * (60 + rub * sd * .5)} 200`, 'none', 26, OL) + path(`M${sd * 150} 20Q${sd * 260} 90 ${sd * (60 + rub * sd * .5)} 200`, 'none', 14, '#fff') + circ(sd * (60 + rub * sd * .5), 200, 34, '#fff', 7);
  return G(tr(x, y - bob, s, Math.sin(t * 3) * 3), path('M-70 170L-80 330M70 170L80 330', 'none', 16) + ell(-90, 335, 44, 18, OL, 0) + ell(90, 335, 44, 18, OL, 0) + fCalPage(0, 0, 1, 'FÉV', '', { col: '#7a1a3a' }) +
    path('M-100 -30L-25 0M100 -30L25 0', 'none', 16) + circ(-58, 30, 18, OL, 0) + circ(58, 30, 18, OL, 0) + circ(-52, 24, 6, '#fff', 0) + circ(64, 24, 6, '#fff', 0) +
    (k ? path('M-90 80Q0 170 90 80Z', '#7a1a3a', 8) + path('M-70 86L-60 104L-48 88M48 88L60 104L70 86', '#fff', 4) : path('M-70 95Q0 125 70 95', 'none', 9)) +
    path('M0 70Q-50 50 -90 75Q-110 60 -95 45M0 70Q50 50 90 75Q110 60 95 45', 'none', 12) + arm(-1) + arm(1)); }

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, tête du héros (chapeau « 29 ») en cut-out, page « 29 FÉV », étoiles « débloqué », titre cinétique
const U1 = at(1, '29') - .05;
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 1000, t, U1, { part: 'back', r: 480 }) + burst(CX, 1010, 300, t, .4, SX.acc, 16) +
    G(tr(CX, 1060, 1 + .03 * Math.sin(t * 6)), cutout(fHeroHead(0, 0, 160, { expr: t < U1 ? 'worried' : 'shock' }, t), 14)) + sticker(fCalPage(0, 0, 1, 'FÉV', 29, { col: SX.acc }), 865, 820, .6, t, U1 + .1, { r: 10 }) +
    unlock(CX, 1000, t, U1, { part: 'front', r: 480 }) + funBox(CX, 1030, 420, 420, t, at(1, 'fevrier') + .3, { label: '29-02.png' }) +
    kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin('HORRIBLE DE NAÎTRE', CX, 415, t, .3, { size: 58 }) + kword('LE 29 FÉVRIER ?', CX, 540, t, U1, { size: 78, fill: SX.acc2 }),
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [.4, 'pop', .4], [U1, 'boom', .6], [U1 + .05, 'sparkle', .6], [at(1, 'fevrier') + .3, 'tick', .5]] });
// B002 — « Tu viens de naître » : papier + gobo, bébé (déjà le chapeau !) en cut-out, explosion BD
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => { const N = at(2, 'naitre'); return paper(SX.paper) + gobo(T, .12) + burst(CX, 900, 380, t, 0, '#ffe1b8', 18) + G(tr(CX, 1240), cutout(fBaby({ x: 0, y: 0, s: 1.7, expr: t > N ? 'wow' : 'cry' }, t), 12)) + popStars(CX, 850, t, N, 8, 330) + funTag(CX, 450, 'NOUVEAU-NÉ !', t, N - .1, { size: 64, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .5], [.08, 'baby_coo', .7], [at(2, 'naitre') - .1, 'pop', .6], [at(2, 'naitre'), 'sparkle', .5]] });
// B003 — « Le médecin regarde l'horloge » : grille, tête du médecin + horloge en cut-out, flèche marqueur du regard
B(3, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const L = at(3, 'regarde'), Hh = at(3, 'horloge'); return gridBg('#2a2440') + halftoneFade(SX.acc, .08, 1) +
    cutout(docHead(320, 1010, 150, { expr: t > Hh ? 'worried' : 'neutral', look: t > L ? [1, -1] : [0, 0] }, t), 12) + G(tr(770, 800, popEl(t, .05, .5)), cutout(fAna(0, 0, 170, 11, 58 + seg(t, Hh, d), t), 12)) +
    markerArrow(420, 900, 600, 830, t, L, { bend: 60, col: SX.acc2 }) + kword('TIC… TAC…', CX, 470, t, Hh - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh_up', .5], [.05, 'pop', .5], [at(3, 'regarde'), 'scratch', .4], [at(3, 'horloge') - .05, 'tick', .8], [at(3, 'horloge') + .5, 'tick', .7]] });
// B004 — 23h59 : maternité de nuit, énorme réveil digital rouge, médecin + infirmière en sueur
B(4, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.12, 1.04, eOutCubic(clamp(t / .3))), hand: .4 }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: maternite(t, { noClock: 1, fg: false }), haze: .1 }, { z: 1, svg: fDigi(CX, 580, 1.3, '23:59', t) + docP({ x: 250, y: 1560, s: 1.15, expr: 'worried', look: [1, -1] }, t) + nurse({ x: 850, y: 1560, s: 1.15, expr: 'scared', flip: 1, look: [-1, -1] }, t) + sweatSpray(250, 930, t, 4) }]) +
    funTag(CX, 830, '1 MINUTE !', t, at(4, '23') + .1, { size: 50, bg: '#ff4d4d' }),
  sfx: [[0, 'flash_hit', .5], [at(4, '23'), 'tick', .9], [.25, 'heartbeat', .6], [at(4, '23') + .1, 'pop', .5]] });
// B005 — « Puis, minuit » : le réveil bascule à 00:00 (vert), mâchoires au sol
B(5, { enter: 'none', cam: (t, d) => ({ z: 1.05, shake: t > at(5, 'minuit') ? 8 * (1 - seg(t, at(5, 'minuit'), at(5, 'minuit') + .5)) : 0 }),
  draw: (t, d, T) => { const Mn = at(5, 'minuit'), on = t > Mn; return maternite(t, { noClock: 1 }) + (on ? rays(t, CX, 580, 'rgba(255,240,170,.4)', 'rgba(255,255,255,0)', 18) + impactStar(CX, 580, 1.8) : '') + fDigi(CX, 580, 1.3, on ? '00:00' : '23:59', t, on ? '#5dff8a' : '#ff4d4d') +
    docP({ x: 250, y: 1560, s: 1.15, expr: on ? 'jawdrop' : 'worried', look: [1, -1] }, t) + nurse({ x: 850, y: 1560, s: 1.15, expr: on ? 'terror' : 'scared', flip: 1 }, t) + kword('MINUIT !', CX, 860, t, Mn - .05, { size: 96, fill: '#fff' }); },
  sfx: [[at(5, 'puis'), 'clock_fast', .5], [at(5, 'minuit') - .05, 'ding', .9], [at(5, 'minuit'), 'boom', .6], [at(5, 'minuit') + .1, 'gasp', .6]] });
// B006 — « 29 février » : la page « 28 » du calendrier s'arrache, le « 29 » brille (rayons, étoiles)
B(6, { enter: 'punch', flash: 1, cam: zin(1.05, 1.12, .3),
  draw: (t, d, T) => { const Tr = at(6, '29') - .1, k = seg(t, Tr, Tr + .5); return maternite(t, { noClock: 1, fg: false }) + WASH('rgba(255,255,255,.25)') + rays(t, CX, 820, 'rgba(255,240,170,.45)', 'rgba(255,255,255,0)', 20) + glow(CX, 820, 420, '#fff3b0', .45 * k) +
    fCalPage(CX, 830, 1.45, 'FÉV', 29, { col: SX.acc }) + (k < 1 ? G(tr(CX + k * 520, 830 - k * 260 + k * k * 500, 1, k * 140), fCalPage(0, 0, 1.45, 'FÉV', 28)) : '') + popStars(CX, 830, t, Tr + .2, 8, 380) + kword('29 FÉVRIER', CX, 440, t, at(6, 'fevrier') - .1, { size: 100, fill: SX.acc2 }); },
  sfx: [[at(6, '29') - .1, 'scratch', .7], [at(6, '29'), 'whoosh', .6], [at(6, 'fevrier') - .1, 'boom', .6], [at(6, 'fevrier'), 'angel', .6]] });
// B007 — « Félicitations ! » : le médecin brandit le bébé façon roi lion, confettis
B(7, { enter: 'punch', cam: () => ({ z: 1.04, hand: .5, cy: 960 }),
  draw: (t, d, T) => maternite(t, { noClock: 1 }) + rays(t, CX, 760, 'rgba(255,230,140,.4)', 'rgba(255,255,255,0)', 18) + docP({ x: CX, y: 1640, s: 1.15, expr: 'ecstatic', armL: [200, 230], armR: [-20, -50] }, t) + fBaby({ x: CX, y: 880 + wave(t, .2, 10), s: 1.05, expr: 'joy' }, t) + confetti(t, 0, 40) +
    kword('FÉLICITATIONS !', CX, 420, t, at(7, 'felicitations') - .05, { size: 78, fill: SX.acc2 }),
  sfx: [[0, 'tada', .7], [.05, 'baby_coo', .6], [at(7, 'felicitations') + .2, 'pop', .5]] });
// B008a — « à une date » : bébé au berceau (mobile étoiles), bracelet de naissance « 29/02 »
const o8 = at(8, 'qui') - .15;
B(8, { enter: 'whip', cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const D = at(8, 'date'); return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: maternite(t), haze: .08 }, { z: 1, svg: fBaby({ x: CX, y: 1160, s: .95, expr: 'happy' }, t) + fCrib(CX, 1200, 1, t) + nurse({ x: 900, y: 1560, s: 1.1, expr: 'happy', flip: 1, look: [-1, 0] }, t) }]) +
    funTag(CX, 520, 'DATE : 29/02', t, D - .05, { size: 56, bg: SX.acc2, fg: SX.ink }) + funBox(CX, 930, 300, 260, t, D + .1, { label: 'bébé.png' }); },
  sfx: [[0, 'whoosh', .5], [at(8, 'naitre'), 'baby_coo', .6], [at(8, 'date') - .05, 'pop', .6], [at(8, 'date') + .1, 'printer', .4]] });
// B008b — « qui n'existe même pas tous les ans » : 4 cartes-calendriers, 3 barrées
B(8, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1, 1.06, t / d) }),
  draw: (t, d, T) => { const E = at(8, 'existe') - o8, P = at(8, 'pas') - o8, To = at(8, 'tous') - o8, A = at(8, 'ans') - o8; let s = maternite(t, { fg: false }) + WASH('rgba(255,255,255,.35)');
    ['2024', '2025', '2026', '2027'].forEach((y, i) => { const x = i % 2 ? 800 : 280, yy = i < 2 ? 740 : 1030, t0 = E - .15 + i * .08;
      s += card(x, yy, 290, 250, ftext(0, -60, y, { size: 50, fill: SX.acc, stroke: 'none', font: 'Fredoka' }) + ftext(0, 80, i ? '28' : '29', { size: 120, fill: OL, stroke: 'none', font: 'Fredoka' }) + ftext(0, -10, 'FÉV', { size: 30, fill: '#7a8a99', stroke: 'none', font: 'Fredoka' }), t, t0, { ry: 0, thick: 10, r: (i - 1.5) * 4 }) +
        (i ? cross(x + 70, yy + 30, .5, t, [P, To, A][i - 1]) : popStars(x, yy, t, t0 + .3, 6, 180)); });
    return s + fHeroHead(CX, 890, 76, { expr: t > P ? 'shock' : 'happy', hh: { style: 'tuft' } }, t) + kword('PAS TOUS LES ANS', CX, 450, t, P - .05, { size: 72, fill: SX.acc2 }); },
  sfx: [[at(8, 'existe') - o8 - .15, 'pop_hi', .5], [at(8, 'existe') - o8, 'pop_hi', .5], [at(8, 'pas') - o8, 'error_beep', .5], [at(8, 'tous') - o8, 'error_beep', .5], [at(8, 'ans') - o8, 'error_beep', .5]] }, o8);
// B009 — « Bienvenue dans la vie… » : sortie de la maternité sur tapis rouge, maman + poussette, confettis
B(9, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bv = at(9, 'bienvenue'), N = at(9, '29'), px = lerp(400, 600, clamp(t / d));
    return depth({ zoom: 1, x: Math.sin(t * .8) * 20 }, [{ z: 1.5, svg: streetBg(t, { main: 'mater' }), haze: .06 }, { z: 1, svg: path('M340 1250L740 1250L900 1960L180 1960Z', '#e2463a', 6) + path('M380 1250L700 1250', 'none', 6, '#ffd23f') +
      mum({ x: px - 250, y: 1560, s: 1.15, expr: 'joy', walk: 2, armR: [-60, -70] }, t) + fStroller(px + 60, 1440, 1.05, t, fHeroHead(40, -200, 60, { expr: 'wow', hh: { style: 'tuft' } }, t)) }]) +
      kword('BIENVENUE', CX, 430, t, Bv - .05, { size: 104, fill: SX.acc2 }) + funTag(CX + 230, 580, '29/02', t, N - .05, { size: 54, bg: SX.acc }) + confetti(t, Bv, 25); },
  sfx: [[0, 'whoosh', .5], [at(9, 'bienvenue') - .05, 'tada', .7], [at(9, 'vie'), 'baby_coo', .5], [at(9, '29') - .05, 'pop', .6], [at(9, 'fevrier'), 'sparkle', .5]] });
// B010a — « À 4 ans, tu fêtes ton… » : salon de fête, calendrier qui défile jusqu'à 2024
const o10 = at(10, 'premier') - .15;
B(10, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const F = at(10, '4'); const y = counter(2020, 2024, t, 0, .7); return salonParty(t) + fHero({ x: CX, y: 1500, s: 1.15, expr: 'ecstatic', armL: [200, 230], armR: [-20, -50] }, t) + fCalPage(870, 650, .6, `FÉV ${y}`, y === 2024 ? 29 : 28, { col: SX.acc }) +
    funTag(CX, 520, '4 ANS', t, F - .05, { size: 80, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 520, t, F, 6, 220); },
  sfx: [[0, 'whoosh', .5], [.05, 'clock_fast', .4], [at(10, '4') - .05, 'pop', .7], [at(10, 'fetes'), 'tada', .6]] });
// B010b — « premier anniversaire à la date exacte » : gâteau à 1 bougie, effet « débloqué », marqueur
B(10, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(clamp(t / .5))) }),
  draw: (t, d, T) => { const P = .15, Ex = at(10, 'exacte') - o10; return salonParty(t, { fg: false }) + unlock(CX, 900, t, P, { part: 'back', r: 520 }) + fHero({ x: CX, y: 1450, s: 1.3, expr: 'ecstatic', armL: [200, 230], armR: [-20, -50] }, t) + fCake(CX, 1440, .7, t, 1) +
    unlock(CX, 900, t, P, { part: 'front', r: 520 }) + funTag(CX, 430, '1er VRAI ANNIV !', t, P + .1, { size: 60, bg: SX.acc }) + markerText('date exacte !', 790, 640, t, Ex - .05, { size: 54, col: SX.acc2 }) + confetti(t, P, 30); },
  sfx: [[.1, 'flash_hit', .5], [.15, 'jackpot', .7], [.4, 'sparkle', .6], [at(10, 'exacte') - o10, 'scratch', .5], [at(10, 'exacte') - o10 + .3, 'tada', .5]] }, o10);
// B011 — « Kevin te regarde » : gros plan Kevin soupçonneux, fond flou
B(11, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d) }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.6, svg: salonParty(t, { fg: false }), blur: 6, haze: .1 }, { z: 1, svg: kevinHead(CX, 860, 230, { expr: 'suspicious', look: [-1, 0] }, t) }]) +
    funTag(CX + 250, 500, 'KEVIN', t, at(11, 'kevin'), { size: 50, bg: '#5fb85f' }) + markerCircle(CX - 30, 850, 240, 90, t, at(11, 'regarde'), { col: SX.acc2 }),
  sfx: [[0, 'whoosh', .5], [at(11, 'kevin'), 'pop', .5], [at(11, 'regarde'), 'hmm', .6]] });
// B012 — « t'as 4 ans ou 1 an ? » : Kevin perdu (points d'interrogation), tu rigoles
B(12, { cam: camHand(1.04, .4),
  draw: (t, d, T) => { const Q4 = at(12, '4'), Q1 = at(12, '1'), Rg = at(12, 'rigoles'); return salonParty(t) + fHero({ x: 320, y: 1490, s: 1.25, expr: t > Rg ? 'laugh' : 'happy' }, t) + kevin({ x: 770, y: 1500, s: 1.35, expr: 'confused', flip: 1, armL: [200, 140] }, t) + qMarks(800, 780, t, 2) +
    funTag(760, 430, '4 ANS ?', t, Q4 - .05, { size: 54, bg: SX.cool }) + funTag(800, 580, '1 AN ?', t, Q1 - .05, { size: 54, bg: '#ff8fb1' }) + funTag(320, 640, 'HA HA !', t, Rg, { size: 56, bg: '#fff', fg: SX.ink }); },
  sfx: [[0, 'hmm', .5], [at(12, '4') - .05, 'pop_hi', .6], [at(12, '1') - .05, 'pop_hi', .6], [at(12, 'rigoles'), 'rimshot', .5], [at(12, 'rigoles') + .1, 'boing', .4]] });
// B013 — à 8 ans : la même blague en boucle dans la cour, compteur jusqu'à 600, chapeau qui s'affaisse
B(13, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const Dj = at(13, 'deja'), S = at(13, '600'); const n = counter(1, 600, t, Dj, S - Dj); let s = schoolyard2(t) + kevin({ x: 140, y: 1470, s: 1.1, expr: 'laugh' }, t) + person({ age: 'kid', x: 950, y: 1470, s: 1.1, hair: 'ponytail', hairColor: '#e0a040', shirt: '#ff8fb1', expr: 'laugh', flip: 1, seed: 22 }, t) +
    fHero({ x: CX, y: 1500, s: 1.35, expr: t > S ? 'dead' : 'deadpan', hh: { droop: seg(t, Dj, S) } }, t);
    ['1 AN ?!', 'BÉBÉ !', '4 ANS ?', "T'AS 2 ANS ?", 'HAHA 1 AN'].forEach((j, i) => { s += funTag([240, 840, 230, 850, 540][i], [640, 620, 860, 840, 660][i], j, t, Dj - .3 + i * .3, { size: 38, bg: ['#fff', SX.acc2, SX.cool, '#ff8fb1', '#fff'][i], fg: SX.ink, r: (i - 2) * 5 }); });
    return s + (t > S ? burst(CX, 420, 200, t, S - .05, SX.acc, 14) : '') + funTag(CX, 420, `BLAGUE N°${n}`, t, Dj - .2, { size: 56, bg: SX.acc }); },
  sfx: [[at(13, 'deja') - .3, 'pop', .4], [at(13, 'deja'), 'pop', .4], [at(13, 'deja') + .3, 'pop', .4], [at(13, 'deja') + .6, 'pop', .4], [at(13, '600') - .05, 'boom', .6], [at(13, '600') + .1, 'rimshot', .4]] });
// B014 — à 12 ans : chambre, liste « MON ANNIV » qui se coche
B(14, { enter: 'whip', cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => { const D = at(14, '12'), O = at(14, 'organiser'); let list = rect(-200, -240, 400, 480, '#fffbe8', 16, 7) + ftext(0, -170, 'MON ANNIV', { size: 46, fill: SX.acc, stroke: 'none', font: 'Fredoka' });
    ['GÂTEAU', 'BALLONS', 'INVITÉS'].forEach((it, i) => { list += rect(-160, -100 + i * 100, 46, 46, '#fff', 8, 5) + ftext(-90, -62 + i * 100, it, { size: 40, fill: OL, stroke: 'none', font: 'Fredoka', anchor: 'start' }) + (t > O + .2 + i * .25 ? path(`M-152 ${-78 + i * 100}l14 16l26 -34`, 'none', 9, '#3aa65a') : ''); });
    return bedroom(t) + fHero({ x: 320, y: 1500, s: 1.35, expr: 'ecstatic', armR: [-30, -60] }, t) + card(780, 800, 400, 480, list, t, O - .25, { ry: -12, thick: 12 }) + funTag(320, 480, '12 ANS', t, D - .05, { size: 64, bg: SX.acc2, fg: SX.ink }) + popStars(320, 900, t, O); },
  sfx: [[0, 'whoosh', .5], [at(14, '12') - .05, 'pop', .6], [at(14, 'organiser') - .25, 'whoosh_up', .5], [at(14, 'organiser') + .2, 'tick', .5], [at(14, 'organiser') + .45, 'tick', .5], [at(14, 'organiser') + .7, 'tick', .5]] });
// B015 — « Problème. » puis février 2025 : pas de case 29 (case fantôme qui clignote), loupe, INTROUVABLE
B(15, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t < .4 ? 7 : 0 }),
  draw: (t, d, T) => { const Ce = at(15, 'cette'), N = at(15, '29'), Ex = at(15, 'existe'); const [gx, gy] = febCell(29), mx = CX - 60 + gx * .9 + Math.sin(t * 5) * 10, my = 780 + gy * .9;
    return bedroom(t) + WASH('rgba(255,255,255,.2)') + (t < Ce ? kword('PROBLÈME.', CX, 640, t, 0, { size: 120, fill: '#ff4d4d' }) + fHeroHead(CX, 990, 120, { expr: 'shock' }, t) :
      G(tr(CX - 60, 780, .9 * popEl(t, Ce, .5)), fFeb(0, 0, 1, t, { title: 'FÉVRIER 2025', ghost: t > N })) + (t > N ? circ(mx, my, 70, 'rgba(200,230,255,.35)', 9) + line(mx + 50, my + 50, mx + 120, my + 120, 18) : '') +
      fHeroHead(900, 1060, 105, { expr: t > Ex ? 'terror' : 'worried', look: [-1, -1] }, t) + funTag(CX, 400, '29 : INTROUVABLE', t, Ex, { size: 48, bg: '#ff4d4d' })); },
  sfx: [[0, 'boom', .7], [.02, 'error_beep', .4], [at(15, 'cette'), 'pop', .6], [at(15, '29'), 'hmm', .5], [at(15, 'existe'), 'error_beep', .7], [at(15, 'existe') + .1, 'buzz', .4]] });
// B016 — « tu choisis le 28 » : coup de marqueur rouge sur le 28
B(16, { enter: 'none', trans: 'zoom', transD: .25, cam: zin(1.0, 1.1, .3),
  draw: (t, d, T) => { const V = at(16, '28'); const [cx, cy] = febCell(28), gx = CX - 60 + cx * .9, gy = 780 + cy * .9;
    return bedroom(t) + WASH('rgba(255,255,255,.2)') + fFeb(CX - 60, 780, .9, t, { title: 'FÉVRIER 2025', hl: t > V ? 28 : 0 }) + markerCircle(gx, gy, 62, 56, t, V, { col: '#ff4d4d' }) + fHeroHead(900, 1060, 105, { expr: t > V ? 'smugger' : 'suspicious', look: [-1, -1] }, t) +
      funTag(CX, 400, 'VA POUR LE 28 !', t, V + .1, { size: 54, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .5], [at(16, 'choisis'), 'hmm', .5], [at(16, '28'), 'scratch', .7], [at(16, '28') + .1, 'pop', .6], [at(16, 'fevrier') + .2, 'ding', .5]] });
// B017 — Kevin proteste (pancarte « NON ! ») : « t'es pas encore né ! »
B(17, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const P = at(17, 'proteste'), Ms = at(17, 'mais'), N = at(17, 'nait'); return classroom(t) + fHero({ x: 270, y: 1500, s: 1.3, expr: t > N ? 'jawdrop' : 'smug' }, t) + kevin({ x: 780, y: 1500, s: 1.35, expr: 'rage', flip: 1, armL: [200, 200] }, t) +
    G(tr(850, 640, popEl(t, P, .5), 8), fSign(0, 0, .8, 'NON !', 0, '#fff')) + funTag(CX, 420, "T'ES PAS ENCORE NÉ !", t, Ms, { size: 46, bg: '#5fb85f' }); },
  sfx: [[0, 'whoosh', .5], [at(17, 'proteste'), 'whistle', .6], [at(17, 'proteste') + .05, 'pop', .6], [at(17, 'mais'), 'pop_hi', .6], [at(17, 'nait'), 'gasp', .6]] });
// B018 — « le 1er mars » : la page de février se replie, MARS 1 entouré
B(18, { enter: 'drop', cam: zin(1.02, 1.1),
  draw: (t, d, T) => { const C = at(18, 'choisis'), Ma = at(18, 'mars'), fl = seg(t, C, C + .35); return bedroom(t) + WASH('rgba(255,255,255,.2)') + fCalPage(CX, 780, 1.4, 'MARS', 1, { col: '#5fb85f' }) +
    (fl < 1 ? G(tr(CX, 528) + ` scale(1 ${f1(Math.max(.01, 1 - fl))})`, G(tr(0, 252), fCalPage(0, 0, 1.4, 'FÉV', 28))) : '') + markerCircle(CX, 815, 150, 140, t, Ma - .1, { col: '#ff4d4d' }) + fHeroHead(890, 1070, 100, { expr: 'smug', look: [-1, -1] }, t) +
    funTag(CX, 400, '1er MARS !', t, Ma, { size: 64, bg: '#5fb85f' }); },
  sfx: [[at(18, 'choisis'), 'whoosh', .6], [at(18, 'choisis') + .1, 'flutter', .5], [at(18, 'mars') - .1, 'scratch', .7], [at(18, 'mars'), 'pop', .6]] });
// B019 — Kevin proteste ENCORE : manif dans la cour, mégaphone, pancartes
B(19, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .5 }),
  draw: (t, d, T) => { const E = at(19, 'encore'), D = at(19, 'deja'); return schoolyard2(t) + person({ age: 'kid', x: 600, y: 1400, s: .9, hair: 'curly', hairColor: '#2b2420', shirt: '#7aa6d8', expr: 'angry', seed: 24 }, t) + fSign(600, 900, .6, 'BOUH', -6, '#ffd23f') + person({ age: 'kid', x: 960, y: 1400, s: .9, hair: 'bun', hairColor: '#8a5a3a', shirt: '#ffd23f', expr: 'angry', flip: 1, seed: 25 }, t) + fSign(960, 880, .6, 'NON', 8, '#ff8fb1') +
    fHero({ x: 220, y: 1500, s: 1.25, expr: 'worried' }, t) + sweatSpray(220, 1080, t, 4) + kevin({ x: 760, y: 1500, s: 1.35, expr: 'rage', flip: 1, armL: [180, 170] }, t) + fMega(640, 1110, .7, 190) + motionLines(520, 1110, 3, 70, 180) +
    funTag(CX, 580, 'MANIF ANTI-ANNIV', t, E, { size: 40, bg: '#fff', fg: SX.ink }) + kword('DÉJÀ PASSÉ !', CX, 430, t, D - .05, { size: 92, fill: '#ff4d4d' }); },
  sfx: [[0, 'siren', .4], [at(19, 'proteste'), 'whistle', .6], [at(19, 'encore'), 'pop', .5], [at(19, 'deja') - .05, 'boom', .6], [at(19, 'passe'), 'buzz', .4]] });
// B020 — « je vais te faire passer ton DERNIER anniversaire » : rage, flammes, l'invitation de Kevin déchirée
B(20, { enter: 'punch', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.14, eInOut(clamp(t / d))), shake: t > at(20, 'dernier') ? 6 : 2, r: -4 }),
  draw: (t, d, T) => { const Dn = at(20, 'dernier'), k = eOutCubic(seg(t, Dn, Dn + .4)); const inv = rect(-150, -100, 300, 200, '#fff', 14, 7) + ftext(0, -30, 'INVITATION', { size: 40, fill: SX.acc, stroke: 'none', font: 'Fredoka' }) + ftext(0, 40, 'KEVIN', { size: 56, fill: OL, stroke: 'none', font: 'Fredoka' }) + heart(110, -60, .4);
    return bedroom(t) + op(.45, rect(-M, -M, W + 2 * M, H + 2 * M, '#c4102a', 0, 0)) + rays(t, 360, 1000, 'rgba(255,120,60,.35)', 'rgba(0,0,0,0)', 18) + flames(360, 1300, 600, 280, t) + fHero({ x: 360, y: 1500, s: 1.4, expr: 'rage' }, t) + steam(300, 880, t, .7) + steam(420, 880, t, .7) +
      kevin({ x: 870, y: 1460, s: 1.1, expr: 'terror', flip: 1, tremble: 1 }, t) + G(tr(700 - k * 70, 760, 1, -k * 25), clipR(-150, -110, 150, 220, inv, 0)) + G(tr(700 + k * 70, 760 + k * 30, 1, k * 25), clipR(0, -110, 150, 220, inv, 0)) + kword('DERNIER', CX, 430, t, Dn - .05, { size: 120, fill: '#ff4d4d' }); },
  sfx: [[0, 'growl', .6], [at(20, 'faire'), 'fire', .5], [at(20, 'dernier') - .05, 'boom', .7], [at(20, 'dernier'), 'crack', .7], [at(20, 'anniversaire'), 'gasp', .5]] });
// B021 — à 18 ans, majeur comme tout le monde : devant la mairie, carte d'identité, d'autres ados identiques surgissent
B(21, { enter: 'whip', cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const E = at(21, '18'), Mj = at(21, 'majeur'), Cm = at(21, 'comme'); let s = streetBg(t, { main: 'mairie' });
    [[150, '#ff8fb1', 'curly', '#1f1a18', 20], [930, '#ffd23f', 'ponytail', '#e0a040', 21]].forEach(([x, sh, hr, hc, sd], i) => { const k = popEl(t, Cm + i * .12, .5); if (k > 0) s += G(tr(x, 1560, k), person({ age: 'adult', x: 0, y: 0, s: 1.0, hair: hr, hairColor: hc, shirt: sh, pants: '#4b5b7a', expr: 'proud', seed: sd, armL: [200, 230], armR: [-20, -50] }, t)); });
    return s + fHeroA({ x: CX, y: 1560, s: 1.15, expr: 'proud', armL: [200, 230], armR: [-20, -50] }, t) + G(tr(CX + 200, 760, popEl(t, Mj - .2, .5), -8), fId(0, 0, .55, t, {})) + funTag(CX, 420, '18 ANS', t, E - .05, { size: 70, bg: SX.acc2, fg: SX.ink }) + kword('MAJEUR !', CX, 560, t, Mj - .05, { size: 92, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .5], [at(21, '18') - .05, 'pop', .6], [at(21, 'majeur') - .05, 'tada', .7], [at(21, 'comme'), 'pop_hi', .5], [at(21, 'comme') + .12, 'pop_hi', .5]] });
// B022a — « pas besoin d'attendre 72 ans » : fantasme sépia, toi vieux de 72 ans dans la file d'attente (toiles d'araignée) → barré
const o22 = at(22, 'pour') - .15;
B(22, { enter: 'none', trans: 'glitch', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Nn = at(22, 'non'), A = at(22, 'attendre'), S = at(22, '72');
    if (t < A - .1) return streetBg(t, { main: 'mairie' }) + fHeroA({ x: CX, y: 1560, s: 1.15, expr: 'smug', tilt: Math.sin(t * 14) * 8 }, t) + funTag(CX, 520, 'NON NON NON', t, Nn, { size: 60, bg: '#ff4d4d' });
    const sc = streetBg(t, { main: 'mairie' }) + G(tr(240, 1300), rect(-160, -60, 320, 24, '#b98552', 6, 5) + line(-140, -36, -140, 0, 8) + line(140, -36, 140, 0, 8)) + fOld({ x: CX, y: 1560, s: 1.15, expr: 'sad', tremble: 1 }, t) + line(CX + 150, 1150, CX + 170, 1560, 12, '#8a5a3a') +
      path(`M${CX - 260} 700L${CX - 60} 900M${CX - 260} 760L${CX - 120} 700M${CX - 220} 840L${CX - 260} 920`, 'none', 3, '#fff') + G(tr(870, 720), fAna(0, 0, 90, t * 30, t * 360, t));
    return filmBW(sc, T) + funTag(CX, 450, '72 ANS', t, S - .05, { size: 70, bg: '#fff', fg: SX.ink }) + cross(CX, 900, 1.2, t, S + .45); },
  sfx: [[at(22, 'non'), 'error_beep', .6], [at(22, 'attendre') - .1, 'rewind', .5], [at(22, '72') - .05, 'pop', .6], [at(22, '72') + .2, 'crickets', .4], [at(22, '72') + .45, 'buzz', .6]] });
// B022b — « pour avoir légalement 18 ans » : carte d'identité tamponnée LÉGAL
B(22, { enter: 'crash', flash: 1, cam: zin(1.04, 1.1, .3),
  draw: (t, d, T) => { const L = at(22, 'legalement') - o22, E = at(22, '18') - o22; return streetBg(t, { main: 'mairie' }) + WASH('rgba(255,255,255,.2)') + fHeroA({ x: 230, y: 1560, s: 1.15, expr: 'smugger' }, t) + G(tr(650, 820, popEl(t, 0, .5), -6), fId(0, 0, .9, t, { expr: 'smugger' })) +
    stamp(700, 700, 'LÉGAL', t, L, '#3aa65a', -12, 70) + kword('18 ANS', CX, 430, t, E - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(22, 'legalement') - o22, 'hammer', .7], [at(22, 'legalement') - o22 + .05, 'thud', .5], [at(22, '18') - o22 - .05, 'tada', .6]] }, o22);
// B023 — « les blagues continuent » : terrasse de café, les vannes arrivent en rafale sur toi
B(23, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const Bl = at(23, 'blagues'); let s = streetBg(t, { main: 'cafe' }) + fHeroA({ x: 300, y: 1560, s: 1.15, expr: 'deadpan', hh: { droop: .5 } }, t) + kevinA({ x: 800, y: 1560, s: 1.15, expr: 'laugh', flip: 1 }, t);
    ['1 AN ?', 'BÉBÉ !', '4 ANS ½ ?'].forEach((j, i) => { const t0 = Bl - .15 + i * .18, k = seg(t, t0, t0 + .5); if (t > t0) s += G(tr(lerp(1250, 380 + i * 40, eOutCubic(k)), 450 + i * 120), funTag(0, 0, j, t, t0, { size: 46, bg: [SX.acc2, '#fff', '#ff8fb1'][i], fg: SX.ink })); });
    return s; },
  sfx: [[0, 'whoosh', .5], [at(23, 'blagues') - .15, 'whoosh', .5], [at(23, 'blagues') + .05, 'pop', .5], [at(23, 'continuent'), 'pop', .5], [at(23, 'continuent') + .15, 'rimshot', .4]] });
// B024 — « Donc t'as que 4 ans et demi ? » « Oui, Kevin. »
B(24, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const Q = at(24, '4'), O = at(24, 'oui'); return streetBg(t, { main: 'cafe' }) + kevinA({ x: 780, y: 1560, s: 1.2, expr: t < O ? 'mock' : 'laugh', flip: 1, armL: [190, 195] }, t) + fHeroA({ x: 300, y: 1560, s: 1.15, expr: t > O ? 'deadpan' : 'annoyed', hh: { droop: .6 } }, t) +
    funTag(760, 470, '4 ANS ET DEMI ?', t, Q - .1, { size: 46, bg: '#5fb85f' }) + funTag(300, 620, 'OUI, KEVIN.', t, O - .05, { size: 50, bg: '#fff', fg: SX.ink }); },
  sfx: [[at(24, 'donc'), 'hmm', .5], [at(24, '4') - .1, 'pop', .6], [at(24, 'demi'), 'boing', .5], [at(24, 'oui') - .05, 'pop', .5], [at(24, 'oui') + .3, 'crickets', .4]] });
// B025a — « Et toi, tu as 20 ans » : tu retournes la flèche
const o25 = at(25, 'toujours') - .15;
B(25, { enter: 'whip', cam: camHand(1.06, .4),
  draw: (t, d, T) => { const To = at(25, 'toi'), V = at(25, '20'); return streetBg(t, { main: 'cafe' }) + fHeroA({ x: 300, y: 1560, s: 1.15, expr: 'smugger', armR: [-10, -15] }, t) + kevinA({ x: 790, y: 1560, s: 1.2, expr: t > V ? 'shock' : 'laugh', flip: 1 }, t) +
    markerArrow(420, 720, 680, 800, t, To, { col: SX.acc2 }) + funTag(790, 470, 'TOI : 20 ANS', t, V - .05, { size: 54, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .5], [at(25, 'toi'), 'scratch', .5], [at(25, '20') - .05, 'pop', .6], [at(25, '20') + .1, 'sting', .4]] });
// B025b — « … comment fonctionne un calendrier » : Kevin tient le calendrier à l'envers, kevin.exe a planté
B(25, { enter: 'none', trans: 'wipe', transD: .22, cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => { const Dc = at(25, 'decouvert') - o25, Cl = at(25, 'calendrier') - o25; return streetBg(t, { main: 'cafe' }) + WASH('rgba(255,255,255,.15)') + kevinA({ x: CX, y: 1580, s: 1.25, expr: 'dizzy', armL: [200, 160], armR: [-20, 20] }, t) +
    G(tr(CX, 1170, 1, 180 + Math.sin(t * 3) * 8), fFeb(0, 0, .45, t, {})) + qMarks(CX, 640, t, 3) + funBox(CX, 900, 360, 340, t, Dc, { label: 'kevin.exe', col: '#ff4d4d' }) + kword('CALENDRIER ?!', CX, 440, t, Cl - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[at(25, 'decouvert') - o25, 'error_beep', .5], [at(25, 'comment') - o25, 'hmm', .5], [at(25, 'calendrier') - o25 - .05, 'boing', .7], [at(25, 'calendrier') - o25 + .3, 'rimshot', .5]] }, o25);
// B026 — « ton 20e anniversaire » : salon de fête, bras en l'air
B(26, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const V = at(26, '20e'); return salonParty(t) + fHeroA({ x: CX, y: 1560, s: 1.2, expr: 'ecstatic', armL: [200, 230], armR: [-20, -50] }, t) + funTag(CX, 450, '20 ANS', t, V - .05, { size: 76, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 700, t, V, 8, 300) + confetti(t, V, 25); },
  sfx: [[0, 'whoosh', .5], [at(26, 'arrive'), 'drum', .5], [at(26, '20e') - .05, 'tada', .7], [at(26, '20e') + .2, 'sparkle', .5]] });
// B027 — « ton 5e 29 février » : éventail de 5 pages « 29 » (2008 → 2024), énorme « 5e »
B(27, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(clamp(t / .5))) }),
  draw: (t, d, T) => { const En = at(27, 'enfin'), F = at(27, '5e'); let s = salonParty(t, { fg: false }) + WASH('rgba(40,20,90,.35)');
    ['2008', '2012', '2016', '2020', '2024'].forEach((y, i) => { const a = R(-160 + i * 35), x = CX + Math.cos(a) * 360, yy = 960 + Math.sin(a) * 280; s += card(x, yy, 170, 200, ftext(0, -45, y, { size: 36, fill: SX.acc, stroke: 'none', font: 'Fredoka' }) + ftext(0, 60, '29', { size: 84, fill: OL, stroke: 'none', font: 'Fredoka' }), t, En + i * .12, { ry: 0, thick: 8, r: (i - 2) * 8, bw: 6 }); });
    return s + fHeroHead(CX, 990, 120, { expr: 'ecstatic' }, t) + kword('5e', CX, 430, t, F - .05, { size: 160, fill: SX.acc2 }) + popStars(CX, 430, t, F, 8, 260); },
  sfx: [[at(27, 'enfin'), 'pop_hi', .4], [at(27, 'enfin') + .24, 'pop_hi', .4], [at(27, 'enfin') + .48, 'pop_hi', .4], [at(27, '5e') - .05, 'boom', .6], [at(27, '29'), 'sparkle', .6]] });
// B028 — « Tes amis organisent une fête » : la fête démarre, confettis
B(28, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Fe = at(28, 'fete'); return salonParty(t) + amieA({ x: 170, y: 1560, s: 1.05, expr: 'joy', armL: [200, 230], armR: [-20, -50] }, t) + poteA({ x: 910, y: 1560, s: 1.05, expr: 'ecstatic', flip: 1, armL: [200, 230], armR: [-20, -50] }, t) + fHeroA({ x: CX, y: 1580, s: 1.2, expr: 'ecstatic' }, t) +
    confetti(t, at(28, 'amis'), 40) + funTag(CX, 430, 'FÊTE !!!', t, Fe - .05, { size: 80, bg: SX.acc }); },
  sfx: [[0, 'tada', .5], [at(28, 'amis'), 'pop', .5], [at(28, 'organisent'), 'pop_hi', .5], [at(28, 'fete') - .05, 'boom', .5], [at(28, 'fete'), 'whistle', .4]] });
// B029 — le gâteau arrive… avec 5 bougies (marqueur « 5 ?! »), ton sourire s'éteint
B(29, { enter: 'whip', cam: zin(1.02, 1.12, .4),
  draw: (t, d, T) => { const Gt = at(29, 'gateau'), C = at(29, '5'); const cx = lerp(1300, 700, eOutCubic(seg(t, Gt - .1, Gt + .5))); return salonParty(t, { fg: false }) + fHeroA({ x: 270, y: 1560, s: 1.15, expr: t > C ? 'deadpan' : 'ecstatic', hh: { droop: seg(t, C, C + .4) } }, t) +
    amieA({ x: cx + 170, y: 1560, s: 1.05, expr: 'laugh', flip: 1 }, t) + fCake(cx - 40, 1180, .8, t, 5) + markerCircle(cx - 40, 930, 170, 70, t, C, { col: '#ff4d4d' }) + markerText('5 ?!', cx - 40, 760, t, C + .2, { size: 80, col: SX.acc2 }); },
  sfx: [[at(29, 'gateau') - .1, 'steps', .5], [at(29, 'gateau') + .2, 'angel', .4], [at(29, '5'), 'scratch', .6], [at(29, '5') + .2, 'pop', .6], [at(29, 'bougies'), 'sting', .4]] });
// B030 — « Tout le monde rigole » : crash zoom, fou rire général, toi de marbre
B(30, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.15, 1.05, eOutCubic(clamp(t / .3))), shake: 5 }),
  draw: (t, d, T) => salonParty(t, { fg: false }) + amieA({ x: 150, y: 1560, s: 1.05, expr: 'laugh' }, t) + poteA({ x: 930, y: 1560, s: 1.05, expr: 'laugh', flip: 1 }, t) + kevinA({ x: 720, y: 1600, s: 1.0, expr: 'laugh', flip: 1 }, t) + fHeroA({ x: 400, y: 1580, s: 1.1, expr: 'deadpan', hh: { droop: 1 } }, t) +
    tears(150, 900, t, 3) + tears(930, 900, t, 3) + ['HA', 'HAHA', 'HA HA HA'].map((h, i) => funTag([200, 880, 560][i], [560, 600, 430][i], h, t, i * .1, { size: 46, bg: '#fff', fg: SX.ink, r: (i - 1) * 8 })).join(''),
  sfx: [[0, 'rimshot', .6], [.1, 'pop', .4], [at(30, 'rigole'), 'boing', .5]] });
// B031 — la nuit, sur l'ordi : « Année bissextile »… un détail absurde (effet « débloqué » n°3)
B(31, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.08, eInOut(clamp(t / d))) }),
  draw: (t, d, T) => { const Dt = at(31, 'detail'), Ab = at(31, 'absurde'); let scr = rect(-300, -190, 600, 380, '#eaf4ff', 18, 0) + ftext(0, -120, 'Année bissextile', { size: 46, fill: OL, stroke: 'none', font: 'Fredoka' });
    for (let i = 0; i < 5; i++) scr += rect(-250, -70 + i * 48, i === 3 ? 380 : 500, 18, i === 3 && t > Dt ? SX.acc2 : '#c9d3e0', 8, 0);
    return bedroom(t, 1) + unlock(CX, 640, t, Ab, { part: 'back', r: 460 }) + card(CX, 640, 640, 420, scr, t, .05, { ry: 0, thick: 14, bg: '#2b2b33' }) + funBox(CX - 60, 670 + 48 * 2 + 9, 440, 60, t, Dt, { label: 'détail', col: '#ff4d4d' }) +
      glow(CX, 1060, 260, '#8cc8ff', .35) + fHeroHead(CX, 1070, 108, { expr: t > Ab ? 'jawdrop' : 'suspicious' }, t) + unlock(CX, 640, t, Ab, { part: 'front', r: 460 }); },
  sfx: [[0, 'whoosh', .4], [at(31, 'decouvres'), 'typing', .5], [at(31, 'detail'), 'pop_hi', .6], [at(31, 'absurde') - .05, 'magic', .6], [at(31, 'absurde'), 'sparkle', .6]] });
// B032 — « même la règle des 4 ans a une exception » : tableau, TOUS LES 4 ANS… EXCEPTION
B(32, { enter: 'whip', cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const Rg = at(32, 'regle'), Ex = at(32, 'exception'); return classroom(t) + op(seg(t, Rg, Rg + .3), ftext(540, 520, 'TOUS LES 4 ANS', { size: 66, fill: 'rgba(255,255,255,.92)', font: 'Fredoka', stroke: 'none' })) +
    prof({ x: 180, y: 1560, s: 1.1, expr: t > Ex ? 'smug' : 'talk', armR: [-60, -80] }, t) + fHeroA({ x: 850, y: 1560, s: 1.1, expr: t > Ex ? 'shock' : 'neutral', flip: 1 }, t) + kword('EXCEPTION', CX, 690, t, Ex - .05, { size: 100, fill: '#ff4d4d' }) + markerPath('M300 560L780 560', t, Ex - .2, { col: '#ff4d4d', w: 12 }); },
  sfx: [[0, 'whoosh', .4], [at(32, 'regle'), 'scratch', .5], [at(32, '4'), 'tick', .5], [at(32, 'exception') - .05, 'boom', .6], [at(32, 'exception') + .1, 'gasp', .5]] });
// B033 — 2100 : ville du futur, toi à 96 ans, hologramme de février qui bugge (pas de 29) → sanglots
B(33, { enter: 'none', trans: 'zoom', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Y = at(33, '2100'), N = at(33, '29'); const holo = op(.88, G(tr(740, 850), fFeb(0, 0, .58, t, { title: 'FÉV 2100', col: '#3fc9e0', ghost: t > N - .2 }))) + (t > N ? cross(845, 1030, .5, t, N + .1) : '');
    return depth({ zoom: 1, x: Math.sin(t * .7) * 20 }, [{ z: 1.6, svg: future2100(t), haze: .05, hazeCol: '#c9b8ff' }, { z: 1, svg: fOld({ x: 280, y: 1560, s: 1.1, expr: t > N + .3 ? 'sob' : 'worried', hh: { droop: seg(t, N, N + .5) } }, t) + (t > N + .3 ? tears(280, 960, t) : '') }]) +
      glitch(holo, T, t > N + .1 ? .6 : 0) + funTag(280, 650, '96 ANS', t, Y + .3, { size: 44, bg: '#fff', fg: SX.ink }) + kword('2100', CX, 420, t, Y - .05, { size: 130, fill: '#7ff0ff' }); },
  sfx: [[0, 'whoosh', .5], [at(33, '2100') - .05, 'zap', .6], [at(33, '2100') + .3, 'pop', .4], [at(33, '29'), 'error_beep', .6], [at(33, 'fevrier'), 'gasp', .5]] });
// B034a — « Pourquoi ? Parce que les années divisibles par 100… » : la prof écrit au tableau
const o34 = at(34, 'ne') - .15;
B(34, { enter: 'crash', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const P = at(34, 'pourquoi'), Dv = at(34, 'divisibles'), C = at(34, '100'); return classroom(t) + (t < Dv ? kword('POURQUOI ?', CX, 560, t, P, { size: 110, fill: SX.acc2 }) : '') + markerText('ANNÉE ÷ 100', CX, 600, t, Dv, { size: 84, col: '#fff' }) + markerCircle(CX + 170, 580, 110, 70, t, C, { col: '#ff4d4d' }) +
    prof({ x: 180, y: 1560, s: 1.1, expr: 'talk', armR: [-60, -80] }, t) + fHeroA({ x: 850, y: 1560, s: 1.1, expr: t > C ? 'confused' : 'worried', flip: 1 }, t) + (t > C ? qMarks(850, 700, t, 2) : ''); },
  sfx: [[at(34, 'pourquoi'), 'boom', .5], [at(34, 'parce'), 'hmm', .4], [at(34, 'divisibles'), 'scratch', .6], [at(34, '100'), 'scratch', .6], [at(34, '100') + .1, 'tick', .4]] });
// B034b — « …bissextiles que si divisibles par 400 » : cerveau en surchauffe, les règles tournent autour de la tête
B(34, { enter: 'none', trans: 'glitch', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.12, eInOut(clamp(t / d))), shake: t > at(34, '400') - o34 ? 5 : 1 }),
  draw: (t, d, T) => { const Bi = at(34, 'bisextiles') - o34, Q = at(34, '400') - o34; const nums = ['÷4', '÷100', '÷400', '2000 OUI', '1900 NON', '2100 NON', '366 j', '¼']; let s = gridBg(SX.ink) + halftoneFade(SX.acc, .1, 1);
    nums.forEach((nm, i) => { const a = t * 1.3 + i * 6.283 / nums.length; s += funTag(CX + Math.cos(a) * 360, 880 + Math.sin(a) * 250, nm, t, Bi - .2 + i * .15, { size: 40, bg: [SX.acc2, '#fff', SX.cool, '#ff8fb1'][i % 4], fg: SX.ink, r: Math.sin(a) * 10 }); });
    return s + cutout(fHeroHead(CX, 880, 160, { expr: t > Q ? 'dizzy' : 'confused' }, t), 12) + steam(CX - 80, 700, t, .9) + steam(CX + 80, 700, t, .9) + (t > Q ? burst(CX, 420, 210, t, Q - .05, SX.acc, 14) : '') + kword('÷ 400 ?!', CX, 420, t, Q - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'zap', .4], [at(34, 'bisextiles') - o34, 'typing', .5], [at(34, 'si') - o34, 'clock_fast', .5], [at(34, '400') - o34 - .05, 'boom', .7], [at(34, '400') - o34 + .15, 'boing', .5]] }, o34);
// B035 — le calendrier a décidé de compliquer ton existence : calendrier méchant dans son repaire, toi en cage
B(35, { enter: 'drop', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, eInOut(clamp(t / d))), hand: .3, shake: t > at(35, 'compliquer') ? 4 : 0 }),
  draw: (t, d, T) => { const Cl = at(35, 'calendrier'), Cp = at(35, 'compliquer'); let cage = ''; for (let i = 0; i < 6; i++) cage += line(770 + i * 36, 830, 770 + i * 36, 1180, 9, '#9aa3ad');
    return lair(t) + (t > Cp ? op(.5, rays(t, 380, 820, 'rgba(255,60,90,.4)', 'rgba(0,0,0,0)', 16)) : '') + fVillain(380, 820, 1.45, t, t > at(35, 'decide') ? 1 : 0) + fHeroHead(860, 1010, 78, { expr: 'terror', hh: { droop: .7 } }, t) + G('', path('M740 830Q860 740 980 830Z', '#9aa3ad', 7) + cage + rect(740, 1170, 240, 24, '#9aa3ad', 6, 6)) +
      funTag(380, 460, 'LE CALENDRIER', t, Cl - .05, { size: 46, bg: '#7a1a3a' }) + kword('COMPLIQUER', CX, 600 - 0, t, Cp - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[at(35, 'autrement'), 'thunder', .5], [at(35, 'calendrier') - .05, 'pop', .5], [at(35, 'decide'), 'growl', .5], [at(35, 'compliquer') - .05, 'boom', .7], [at(35, 'existence'), 'ghost', .5]] });
// B036 — « il y a quand même un avantage » : chill de ouf, hamac au parc, lunettes de soleil, cocktail
B(36, { enter: 'whip', cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const Av = at(36, 'avantage'), sw = Math.sin(t * 2) * 12; return park(t) + path(`M90 880Q${CX} ${1080 + sw} 990 880`, 'none', 10, '#c38a52') + path(`M150 900Q${CX} ${1110 + sw} 930 900L930 930Q${CX} ${1150 + sw} 150 930Z`, '#ffb3c8', 6) +
    G(tr(CX + 300, 1000 + sw, 1, -82), fHeroA({ x: 0, y: 0, s: .95, expr: 'chill', glasses: true }, t)) + G(tr(780, 860 + sw), rect(-24, -60, 48, 70, 'rgba(220,240,255,.8)', 10, 5) + rect(-20, -30, 40, 36, '#ff9a3c', 6, 0) + line(8, -60, 24, -100, 5, '#ff4f87') + circ(-26, -60, 14, '#7be07b', 4)) +
    funTag(CX, 470, 'AVANTAGE', t, Av - .05, { size: 76, bg: SX.cool }) + popStars(CX, 470, t, Av, 8, 280) + sparkle(260, 700, .5 + .2 * Math.sin(t * 8)); },
  sfx: [[0, 'chirp', .5], [at(36, 'bon'), 'whoosh', .3], [at(36, 'avantage') - .05, 'ding', .6], [at(36, 'avantage') + .1, 'sparkle', .5]] });
// B037a — « quand quelqu'un oublie ton anniversaire » : soirée, ton amie découvre le rappel… trop tard
const o37 = at(37, 'il') - .15;
B(37, { enter: 'whip', cam: camHand(1.05, .4),
  draw: (t, d, T) => { const Ou = at(37, 'oublie'); const scr = rect(-130, -240, 260, 120, '#fff', 18, 4) + ftext(0, -195, 'RAPPEL', { size: 26, fill: SX.acc, stroke: 'none', font: 'Fredoka' }) + ftext(0, -150, 'Anniv ?', { size: 34, fill: OL, stroke: 'none', font: 'Fredoka' }) + ftext(0, 40, '28/02', { size: 70, fill: '#7a8a99', stroke: 'none', font: 'Fredoka' });
    return streetBg(t, { main: 'cafe', sky1: '#ff9a6b', sky2: '#ffe3c2', night: 1 }) + fHeroA({ x: 280, y: 1560, s: 1.15, expr: t > Ou ? 'sad' : 'happy', hh: { droop: seg(t, Ou, Ou + .5) } }, t) + amieA({ x: 820, y: 1560, s: 1.15, expr: t > Ou ? 'embarrassed' : 'happy', flip: 1 }, t) +
      G(tr(CX, 720, popEl(t, 0, .5), Math.sin(t * 30) * (t < .5 ? 4 : 0)), fPhone(0, 0, .55, 0, scr)) + stamp(CX, 760, 'OUBLIÉ', t, Ou, '#ff4d4d', -12, 64); },
  sfx: [[0, 'vibrate', .6], [at(37, 'quelqu'), 'ring', .4], [at(37, 'oublie'), 'thud', .6], [at(37, 'oublie') + .1, 'error_beep', .5], [at(37, 'anniversaire'), 'gasp', .5]] });
// B037b — « la même excuse pendant 3 ans » : 2025 / 2026 / 2027 sans 29, « 3 ANS » en gros, ton ballon se dégonfle
B(37, { enter: 'none', trans: 'wipe', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.1, eInOut(clamp(t / d))), hand: .3 }),
  draw: (t, d, T) => { const So = at(37, 'sortir') - o37, Q = at(37, '3') - o37, ts = ['meme', 'excuse', 'pendant'].map(w => at(37, w) - o37), df = seg(t, Q + .2, Q + 1.4);
    let s = streetBg(t, { main: 'cafe', sky1: '#ff9a6b', sky2: '#ffe3c2', night: 1 }) + amieA({ x: 820, y: 1560, s: 1.15, expr: t > Q ? 'smugger' : 'embarrassed', flip: 1, armL: [210, 200], armR: [-30, -20] }, t) +
      fHeroA({ x: 270, y: 1560, s: 1.15, expr: t > Q + .4 ? 'sob' : 'sad', hh: { droop: 1 } }, t) + (t > Q + .4 ? tears(270, 950, t, 4) : '') +
      (df < 1 ? G(tr(400 + df * 300 + Math.sin(t * 30) * 20 * df, 1180 - df * 900, 1 - df * .6, df * 360), fBalloon(0, 0, .8 * (1 - df * .5), '#ff8fb1', t)) : '');
    ['2025', '2026', '2027'].forEach((y, i) => { const x = 230 + i * 310; s += card(x, 720, 230, 210, ftext(0, -45, y, { size: 40, fill: SX.acc, stroke: 'none', font: 'Fredoka' }) + ftext(0, 50, '28 FÉV', { size: 46, fill: OL, stroke: 'none', font: 'Fredoka' }), t, ts[i] - .05, { ry: 0, thick: 8, r: (i - 1) * 6, bw: 6 }) + stamp(x, 760, 'EXCUSE', t, ts[i] + .15, '#ff4d4d', -14, 40); });
    return s + (t < Q - .1 ? funTag(CX, 450, "C'ÉTAIT PAS TON ANNIV !", t, So, { size: 40, bg: '#b56cff' }) : kword('3 ANS', CX, 450, t, Q - .05, { size: 150, fill: SX.acc2 }) + popStars(CX, 450, t, Q, 8, 300)); },
  sfx: [[at(37, 'sortir') - o37, 'pop', .6], [at(37, 'meme') - o37, 'pop_hi', .5], [at(37, 'excuse') - o37, 'pop_hi', .5], [at(37, 'pendant') - o37, 'pop_hi', .5], [at(37, '3') - o37 - .05, 'boom', .7], [at(37, '3') - o37 + .3, 'squeak', .6], [at(37, 'ans') - o37 + .3, 'rimshot', .5]] }, o37);

SCENES.sort((a, b) => a.s - b.s);
