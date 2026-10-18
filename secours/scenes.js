// ============================================================
//  « Pourquoi c'est horrible d'être le pote de secours ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
//  Style V2 : fausse 3D (depth/flou), caméra épaule, crash zooms, expressions extrêmes. SFX synthétisés.
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

// ---------- SIZEX fun : accent orange « gilet de secours », jaune marqueur, bleu froid ----------
sxFun('#ff6a1a'); SX.acc2 = '#ffd23f'; SX.cool = '#4d9de0';

// ---------- aides + bibliothèque de décors riches (reprise de pauvres/, préfixe s) ----------
const rays = (t, cx, cy, c1, c2, n = 20) => sunburst(cx, cy, n, c1, c2, t * 12);
function cross(x, y, s, t, t0 = 0) { const k = pop(t, t0, .3); return k <= 0 ? '' : G(tr(x, y, s * k), path('M-80 -80L80 80M80 -80L-80 80', 'none', 46) + path('M-80 -80L80 80M80 -80L-80 80', 'none', 28, '#ff4d4d')); }
function stamp(x, y, str, t, t0, col = '#e2463a', r = -12, size = 84) { const k = seg(t, t0, t0 + .18); if (k <= 0) return ''; const s = lerp(2.2, 1, eOutCubic(k)); const w = str.length * size * .62 + 70; return G(tr(x, y, s, r), rect(-w / 2, -size * .72, w, size * 1.44, 'rgba(255,255,255,.85)', 14, 12, col) + text(0, size * .36, 'none', str, col, size)); }
function confetti(t, t0 = 0, n = 40, seed = 4) { const r = rng(seed); let s = ''; const k = t - t0; if (k < 0) return ''; const cols = ['#ff6fa5', '#ffd23f', '#5ec4f0', '#7be07b', '#ff8a3d']; for (let i = 0; i < n; i++) { const x = r() * W, y = -50 + (r() * 300 + k * (300 + r() * 300)) % (H + 100); s += rect(x, y, 18, 30, cols[i % 5], 4, 0).replace('/>', ` transform="rotate(${f1(k * 200 + i * 40)} ${f1(x)} ${f1(y)})"/>`); } return s; }
function sweatSpray(x, y, t, n = 6) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * 2 + i / n) % 1, sd = i % 2 ? 1 : -1; s += op(1 - k, sweat(x + sd * (60 + 220 * k), y - 120 * k + 260 * k * k, .8)); } return s; }
function chatBubble(x, y, w, h, str, t, t0, me_ = false, size = 40) { const k = pop(t, t0, .3); if (k <= 0) return ''; const lines = str.split('\n'); return G(tr(x, y, k), rect(-w / 2, -h / 2, w, h, me_ ? '#7fd3a0' : '#fff', 28, 6) + path(`M${-w * .2} ${h / 2 - 3}L${-w * .3} ${h / 2 + 40}L${-w * .05} ${h / 2 - 3}Z`, me_ ? '#7fd3a0' : '#fff', 6) + rect(-w * .22, h / 2 - 12, w * .2, 14, me_ ? '#7fd3a0' : '#fff', 0, 0) + lines.map((l, i) => ftext(0, -h / 2 + 18 + size + i * size * 1.25, l, { size, fill: OL, stroke: 'none' })).join('')); }
function heartsUp(t, x, y, n = 5, sp = 380) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * .8 + i / n) % 1; s += op(1 - k, heart(x + Math.sin(k * 9 + i) * 60 + (i - n / 2) * 30, y - k * sp, .6 + k * .3)); } return s; }
const zin = (a = 1, b = 1.12, hand = 0) => (t, d) => ({ z: lerp(a, b, eInOut(clamp(t / d))), hand });
const camHand = (z = 1.06, a = 1) => () => ({ z, hand: a });
function clipR(x, y, w, h, svg, rx = 18) { const id = 'cl' + (_gid++); return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }
const mixC = (a, b, k) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), C = p(b); return '#' + A.map((v, i) => Math.round(v + (C[i] - v) * clamp(k)).toString(16).padStart(2, '0')).join(''); };
const ptr = o => tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : '');
const bigClockF = (x, y, str, col, s = 1) => G(tr(x, y, s), rect(-210, -90, 420, 180, '#2b2b33', 30) + ftext(0, 35, str, { size: 100, fill: col, stroke: 'none' }));
const M = 700;
const KH = ['curly', 'bun', 'spiky', 'ponytail', 'short', 'long'], KC = ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040', '#1f1a18', '#6b3e26'], KS = ['#ff8fb1', '#7aa6d8', '#7be07b', '#ff9a4d', '#b56cff', '#5ec4f0'], SK = ['#f2c9a0', '#c98a5e', '#f6d7b8', '#8a5a3a', '#e0b088', '#f2c9a0'];
const kid = (i, o, t) => person(Object.assign({ age: 'kid', hair: KH[i % 6], hairColor: KC[i % 6], shirt: KS[i % 6], skin: SK[i % 6], pants: '#3b3f4a', seed: 20 + i }, o), t);
const AH = ['side', 'bun', 'bald', 'long', 'short'], AC = ['#1f1a18', '#8a5a3a', '#7a6a5a', '#c4521b', '#d9d9de'], AS = ['#5b8fd8', '#e2463a', '#36a85a', '#ff9a4d', '#8a6ad8'];
const adult = (i, o, t) => person(Object.assign({ age: 'adult', hair: AH[i % 5], hairColor: AC[i % 5], shirt: AS[i % 5], skin: SK[(i + 2) % 6], pants: '#2f3b4e', seed: 60 + i, glasses: i % 3 === 0 }, o), t);
const DPAL = ['#e2463a', '#5b8fd8', '#ffd23f', '#36a85a', '#ff8fb1', '#8a6ad8', '#ff9a4d', '#5ec4f0'];
const sHaze = (k = .35, col = '230,240,250', y1 = 1300) => rect(-M, -M, W + 2 * M, y1 + M, `rgba(${col},${k})`, 0, 0);
function sWall(kind, c1, c2, yb = 1250) { let s = rect(-M, -M, W + 2 * M, yb + M, c1, 0, 0);
  if (kind === 'stripe') for (let x = -M; x < W + M; x += 120) s += rect(x, -M, 48, yb + M, c2, 0, 0);
  if (kind === 'dot') for (let y = -40; y < yb; y += 90) for (let x = -M + ((y / 90) % 2 ? 45 : 0); x < W + M; x += 90) s += circ(x, y, 7, c2, 0);
  if (kind === 'diamond') for (let y = 0; y < yb; y += 110) for (let x = -M + ((y / 110) % 2 ? 55 : 0); x < W + M; x += 110) s += path(`M${x} ${y - 14}L${x + 10} ${y}L${x} ${y + 14}L${x - 10} ${y}Z`, c2, 0);
  if (kind === 'star') for (let y = 30; y < yb; y += 140) for (let x = -M + ((y / 140) % 2 ? 70 : 0); x < W + M; x += 140) s += ftext(x, y, '✦', { size: 26, fill: c2, stroke: 'none' });
  return s; }
const sBase = (yb, col = '#fff', h = 34) => rect(-M, yb - h, W + 2 * M, h, col, 0, 0) + line(-M, yb - h, W + M, yb - h, 5, shade(col, -.25));
function sParquet(yb, c) { let s = rect(-M, yb, W + 2 * M, 1500, c, 0, 0); const ys = [0, 28, 64, 112, 176, 260, 370, 510, 690]; ys.forEach((dy, i) => { s += line(-M, yb + dy, W + M, yb + dy, 4, shade(c, -.2)); const nx = ys[i + 1]; if (nx !== undefined) for (let x = -M + (i % 2) * 110; x < W + M; x += 220) s += line(x, yb + dy, x, yb + nx, 4, shade(c, -.2)); }); return s + line(-M, yb, W + M, yb, 8, shade(c, -.35)); }
function sTileFloor(yb, c1, c2) { let s = rect(-M, yb, W + 2 * M, 1500, c1, 0, 0); const ys = [0, 40, 95, 170, 270, 400, 570, 800]; for (let i = 0; i < ys.length - 1; i++) { const h = ys[i + 1] - ys[i], w = h * 1.6; for (let k = 0, x = -M; x < W + M; x += w, k++) if ((k + i) % 2) s += rect(x, yb + ys[i], w, h, c2, 0, 0); } return s + line(-M, yb, W + M, yb, 7, shade(c1, -.3)); }
const sOutlet = (x, y) => rect(x - 22, y - 30, 44, 60, '#f4f1ea', 8, 4) + circ(x - 8, y, 4, OL, 0) + circ(x + 8, y, 4, OL, 0);
const sSwitch = (x, y) => rect(x - 24, y - 34, 48, 68, '#f4f1ea', 8, 4) + rect(x - 9, y - 16, 18, 32, '#dcd6cc', 4, 3);
function sPic(kind, w, h) { const a = -w / 2 + 12, b = -h / 2 + 12, iw = w - 24, ih = h - 24;
  if (kind === 'mount') return rect(a, b, iw, ih, '#cfe8f5', 0, 0) + path(`M${a} ${b + ih}L${a + iw * .35} ${b + ih * .35}L${a + iw * .6} ${b + ih * .7}L${a + iw * .75} ${b + ih * .5}L${a + iw} ${b + ih}Z`, '#7bbf5a', 3) + circ(a + iw * .78, b + ih * .25, ih * .12, '#ffd23f', 3);
  if (kind === 'heart') return rect(a, b, iw, ih, '#ffe1ee', 0, 0) + heart(0, 4, Math.min(iw, ih) / 120, '#ff5d73');
  if (kind === 'face') return rect(a, b, iw, ih, '#fff1c8', 0, 0) + circ(0, ih * .08, ih * .28, '#f2c9a0', 3) + path(`M${-ih * .28} ${-ih * .02}Q0 ${-ih * .38} ${ih * .28} ${-ih * .02}`, '#6b3e26', 3) + path(`M${-ih * .1} ${ih * .18}Q0 ${ih * .25} ${ih * .1} ${ih * .18}`, 'none', 3);
  if (kind === 'sea') return rect(a, b, iw, ih, '#bfe3ff', 0, 0) + rect(a, b + ih * .55, iw, ih * .45, '#4d9fd8', 0, 0) + path(`M${a + iw * .3} ${b + ih * .55}L${a + iw * .45} ${b + ih * .2}L${a + iw * .5} ${b + ih * .55}Z`, '#fff', 3);
  return rect(a, b, iw, ih, '#e1f5d6', 0, 0) + circ(0, 0, ih * .25, '#ff9a4d', 3); }
const sFrame = (x, y, w, h, kind = 'mount', col = '#c38a52', r = 0) => G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, col, 6, 6) + sPic(kind, w, h) + rect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 'none', 2, 3));
function sPoster(x, y, w, h, bg, r, inner = '', t = 0) { const fl = Math.sin(t * 2.4 + x) * 3; return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, bg, 6, 5) + inner + path(`M${w / 2 - 34} ${h / 2}L${w / 2} ${h / 2 - 34 + fl}L${w / 2} ${h / 2}Z`, shade(bg, -.2), 3) + rect(-18, -h / 2 - 10, 36, 18, 'rgba(255,255,255,.75)', 3, 0)); }
function sBooks(x, y, w, seed = 1) { const r = rng(seed); let s = '', cx = x; while (cx < x + w - 20) { const bw = 18 + r() * 14, bh = 56 + r() * 34, c = DPAL[Math.floor(r() * 8)]; if (r() < .12 && cx + bh < x + w) { s += rect(cx, y - bw, bh, bw, c, 3, 4); cx += bh + 4; continue; } s += rect(cx, y - bh, bw, bh, c, 3, 4) + line(cx + 4, y - bh + 12, cx + bw - 4, y - bh + 12, 3, 'rgba(255,255,255,.6)'); cx += bw + 2; } return s; }
const sShelf = (x, y, w, items = '', col = '#b5835a') => items + rect(x, y, w, 18, col, 4, 5) + path(`M${x + 24} ${y + 18}L${x + 24} ${y + 50}L${x + 56} ${y + 18}`, 'none', 5) + path(`M${x + w - 24} ${y + 18}L${x + w - 24} ${y + 50}L${x + w - 56} ${y + 18}`, 'none', 5);
const sJar = (x, y, c = '#ffd23f', s = 1) => G(tr(x, y, s), rect(-24, -64, 48, 64, 'rgba(220,240,255,.85)', 10, 4) + rect(-20, -40, 40, 36, c, 6, 0) + rect(-26, -76, 52, 16, '#c96a3a', 5, 4));
const sTrophy = (x, y, s = 1) => G(tr(x, y, s), rect(-30, -16, 60, 16, '#6b3e26', 3, 4) + rect(-8, -46, 16, 30, '#e8b923', 0, 4) + path('M-34 -96L34 -96Q34 -46 0 -46Q-34 -46 -34 -96Z', '#ffd23f', 4) + path('M-34 -88Q-56 -84 -46 -64M34 -88Q56 -84 46 -64', 'none', 4) + ftext(0, -64, '1', { size: 22, fill: '#a0703f', stroke: 'none' }));
const sTeddy = (x, y, s = 1, c = '#c9935c') => G(tr(x, y, s), ell(0, -38, 40, 40, c, 5) + circ(-30, -96, 13, c, 5) + circ(30, -96, 13, c, 5) + circ(0, -82, 30, c, 5) + ell(0, -74, 12, 9, '#f1d2a8', 0) + circ(-10, -88, 4, OL, 0) + circ(10, -88, 4, OL, 0) + circ(0, -77, 4, OL, 0) + ell(-28, -8, 16, 11, c, 4) + ell(28, -8, 16, 11, c, 4));
function sPot(x, y, s, t, kind = 0, potC = '#d9825b') { const sw = wave(t, .5, 4, x * .01); let lv = '';
  if (kind === 0) for (let i = 0; i < 5; i++) lv += G(tr(0, -60, 1, -60 + i * 30 + sw), ell(0, -55, 18, 55, ['#5fb85f', '#4fa64f', '#6cc46c'][i % 3], 4));
  else if (kind === 1) lv += G(tr(0, -60, 1, sw), rect(-18, -150, 36, 150, '#5aa76a', 18, 4) + rect(-58, -110, 26, 70, '#5aa76a', 13, 4) + rect(32, -126, 26, 60, '#5aa76a', 13, 4));
  else for (let i = 0; i < 7; i++) lv += G(tr(0, -60, 1, -75 + i * 25 + sw), path('M0 0Q-16 -60 0 -120Q16 -60 0 0Z', '#4fa64f', 3));
  return G(tr(x, y, s), lv + path('M-46 -62L46 -62L36 0L-36 0Z', potC, 5) + rect(-52, -74, 104, 18, shade(potC, -.15), 5, 5)); }
function sCurtain(x, y, w, h, col, t, side = 1) { let d = `M${x} ${y}L${x + w} ${y}`; const n = 5; for (let i = 0; i <= n; i++) { const yy = y + h * i / n; d = d; } const sw = wave(t, .5, 14, x * .01);
  const xb = x + (side > 0 ? w * .7 + sw : w * .3 + sw), dd = side > 0 ? `M${x} ${y}L${x + w} ${y}Q${x + w * .55} ${y + h * .5} ${xb} ${y + h}L${x - 6} ${y + h}Z` : `M${x} ${y}L${x + w} ${y}L${x + w + 6} ${y + h}L${xb} ${y + h}Q${x + w * .45} ${y + h * .5} ${x} ${y}Z`;
  let s = path(dd, col, 6); for (let i = 1; i < 4; i++) s += path(`M${x + w * i / 4} ${y + 10}Q${x + w * i / 4 + sw * .4} ${y + h * .5} ${x + w * i / 4 + (side > 0 ? -1 : 1) * w * .12} ${y + h - 10}`, 'none', 4, shade(col, -.25)); return s + rect(x - 20, y - 14, w + 40, 18, '#8a5a3a', 8, 4); }
function sWindowView(x, y, w, h, t, o = {}) { const night = o.night; let s = grad(night ? '#0f163a' : '#9fd6ff', night ? '#2a3170' : '#e6f6ff', x, y, w, h);
  s += night ? circ(x + w * .72, y + h * .22, 34, '#fff6d6', 0) : cloud(x + ((t * 20) % (w + 160)) - 80, y + h * .25, .45, '#fff');
  for (let i = 0; i < 5; i++) { const bx = x + i * w / 5, bh = h * (.25 + ((i * 37) % 30) / 100); s += rect(bx, y + h - bh, w / 5 + 2, bh, night ? '#1a2048' : '#b9cfe0', 0, 0); for (let j = 0; j < 3; j++) s += rect(bx + 14, y + h - bh + 16 + j * 34, 14, 16, night ? (Math.sin(t * .7 + i * 3 + j) > -.3 ? '#ffe08a' : '#2e3570') : '#e6f2fb', 2, 0); }
  if (!night) s += circ(x + w * .2, y + h - 30, 46, '#6cc46c', 0) + circ(x + w * .3, y + h - 50, 40, '#5fb85f', 0);
  return s + rect(x, y, w, h, 'none', 8, 10, '#fff') + rect(x - 6, y - 6, w + 12, h + 12, 'none', 10, 6) + line(x + w / 2, y, x + w / 2, y + h, 8, '#fff') + line(x, y + h / 2, x + w, y + h / 2, 8, '#fff') + rect(x - 24, y + h, w + 48, 20, '#f4f1ea', 4, 5); }
const sRug = (x, y, w, h, c1, c2) => ell(x, y, w / 2, h / 2, c1, 6) + ell(x, y, w * .38, h * .36, 'none', 6, c2) + ell(x, y, w * .22, h * .2, c2, 0);
const sBin = (x, y, s = 1, c = '#7aa6d8') => G(tr(x, y, s), path('M-46 -110L46 -110L36 0L-36 0Z', c, 5) + line(-20, -90, -16, -14, 4, shade(c, -.25)) + line(20, -90, 16, -14, 4, shade(c, -.25)) + path('M-30 -110Q-10 -136 6 -112Q20 -130 34 -110', '#fff', 4));
const sBag = (x, y, s = 1, c = '#e2463a', r = 0) => G(tr(x, y, s, r), rect(-60, -130, 120, 130, c, 26, 5) + rect(-40, -60, 80, 46, shade(c, -.15), 12, 4) + path('M-30 -130Q0 -176 30 -130', 'none', 8) + circ(0, -80, 6, '#ffd23f', 3));
const sShoes = (x, y, s = 1, c = '#5b8fd8') => G(tr(x, y, s), path('M-80 0L-80 -34Q-60 -46 -40 -30L-6 -20Q4 -10 0 0Z', c, 5) + path('M10 0L10 -34Q30 -46 50 -30L84 -20Q94 -10 90 0Z', c, 5) + line(-82, -3, 0, -3, 6, '#fff') + line(8, -3, 92, -3, 6, '#fff'));
const sBall = (x, y, s = 1, t = 0, c = '#e2463a') => G(tr(x, y - 40 * s, s, t * 40), circ(0, 0, 40, c, 5) + path('M-40 0Q0 -20 40 0M0 -40Q-20 0 0 40', 'none', 5, '#fff'));
const sBox = (x, y, s = 1, str = '') => G(tr(x, y, s), rect(-80, -110, 160, 110, '#d9a86c', 4, 5) + path('M-80 -110L-100 -140L-20 -140L0 -110M80 -110L100 -140L20 -140L0 -110', '#c8955a', 4) + rect(-14, -110, 28, 40, '#e8c690', 0, 0) + (str ? ftext(0, -30, str, { size: 22, fill: '#7a5a3a', stroke: 'none' }) : ''));
const sGift = (x, y, s = 1, c = '#5ec4f0', c2 = '#ffd23f') => G(tr(x, y, s), rect(-60, -100, 120, 100, c, 6, 5) + rect(-12, -100, 24, 100, c2, 0, 0) + rect(-60, -100, 120, 100, 'none', 6, 5) + path('M0 -100Q-40 -150 -30 -104M0 -100Q40 -150 30 -104', 'none', 7, c2));
function sLamp(x, y, s = 1, on = 1, t = 0, c = '#ffd23f') { return G(tr(x, y, s), (on ? op(.25 + .05 * Math.sin(t * 3), circ(0, -300, 140, '#fff6c8', 0)) : '') + rect(-40, -10, 80, 14, '#5a4a3a', 6, 4) + line(0, -10, 0, -260, 8) + path('M-60 -250L60 -250L36 -350L-36 -350Z', c, 5)); }
const sDeskLamp = (x, y, s = 1, t = 0) => G(tr(x, y, s), op(.3 + .05 * Math.sin(t * 4), path('M40 -150L-60 0L160 0Z', '#fff6c8', 0)) + ell(0, -6, 40, 10, '#5b8fd8', 4) + line(0, -10, -20, -100, 8) + line(-20, -100, 40, -150, 8) + path('M20 -170L80 -140L60 -110L4 -134Z', '#5b8fd8', 5));
const sMug = (x, y, s = 1, t = 0, c = '#ff8fb1') => G(tr(x, y, s), rect(-26, -54, 52, 54, c, 8, 4) + path('M26 -42Q46 -36 26 -14', 'none', 5) + op(.6, path(`M-6 -64Q${-14 + wave(t, 1, 6)} -84 -4 -104M10 -64Q${2 + wave(t, 1, 6, .5)} -86 12 -108`, 'none', 4, '#fff')));
const sGlobe = (x, y, s = 1, t = 0) => G(tr(x, y, s), rect(-40, -10, 80, 14, '#6b3e26', 5, 4) + line(0, -10, 0, -40, 6) + circ(0, -110, 66, '#5ec4f0', 5) + G(`translate(${f1(((t * 30) % 120) - 60)} -110)`, ell(0, -14, 26, 18, '#7be07b', 0) + ell(30, 22, 16, 12, '#7be07b', 0)) + circ(0, -110, 66, 'none', 5) + path('M-74 -110A74 74 0 0 1 0 -184', 'none', 6, '#8a5a3a'));
function sBird(x, y, s, t, ph = 0) { const f = Math.sin(t * 10 + ph) * 14; return G(tr(x, y, s), path(`M-30 ${f1(-f)}Q-14 -6 0 4Q14 -6 30 ${f1(-f)}`, 'none', 6)); }
const sBirds = (t, n = 3, y = 300, seed = 1) => { let s = ''; for (let i = 0; i < n; i++) s += sBird(((t * (50 + i * 12) + i * 420 + seed * 200) % 1700) - 300, y + i * 46 + Math.sin(t * 2 + i) * 14, .7 - i * .1, t, i * 2); return s; };
function sSkyline(yb, col, seed = 3, win = 'rgba(255,255,255,.35)') { const r = rng(seed); let s = '', x = -M; while (x < W + M) { const w = 120 + r() * 140, h = 280 + r() * 380; s += rect(x, yb - h, w, h, col, 0, 0); if (r() < .4) s += rect(x + w * .4, yb - h - 50, 10, 50, col, 0, 0); for (let j = yb - h + 40; j < yb - 40; j += 70) for (let i = x + 18; i < x + w - 30; i += 46) s += rect(i, j, 20, 28, win, 2, 0); x += w + 6; } return s; }
function sBuilding(x, yb, w, h, c, seed, t, o = {}) { const r = rng(seed); let s = rect(x, yb - h, w, h, c, 4, 6) + rect(x - 10, yb - h - 18, w + 20, 26, shade(c, -.18), 4, 5);
  const cols = Math.max(1, Math.floor(w / 95)), cw = (w - 30) / cols, top = yb - h + 40, shopH = o.shop === false ? 0 : 190;
  for (let j = top; j < yb - shopH - 90; j += 120) for (let i = 0; i < cols; i++) { const wx = x + 15 + i * cw + 10, ww = cw - 20, lit = o.night ? Math.sin(t * .6 + i * 2.1 + j * .07) > -.2 : r() < .2;
    s += rect(wx, j, ww, 74, lit ? '#ffe08a' : '#cfe8ff', 4, 4); const k = r(); if (k < .3) s += path(`M${wx + 3} ${j + 3}L${wx + ww * .35} ${j + 3}Q${wx + ww * .2} ${j + 40} ${wx + 6} ${j + 70}Z`, DPAL[(seed + i) % 8], 0); else if (k < .45) s += rect(wx - 6, j + 66, ww + 12, 14, '#8a5a3a', 3, 3) + circ(wx + ww * .3, j + 62, 12, '#5fb85f', 3) + circ(wx + ww * .65, j + 60, 14, '#ff8fb1', 3); else s += line(wx + ww / 2, j, wx + ww / 2, j + 74, 4);
    if (r() < .18) s += rect(wx - 10, j + 74, ww + 20, 10, '#7d848c', 2, 4) + Array.from({ length: 4 }, (_, q) => line(wx - 6 + q * (ww + 12) / 3, j + 84, wx - 6 + q * (ww + 12) / 3, j + 116, 4)).join('') + line(wx - 10, j + 116, wx + ww + 10, j + 116, 5); }
  if (shopH) { const ac = o.awn || DPAL[seed % 8]; s += rect(x + 14, yb - 160, w - 28, 160, '#cfe8ff', 4, 5) + rect(x + w * .62, yb - 150, w * .22, 150, shade(c, -.3), 4, 5);
    for (let i = 0; i < 6; i++) s += path(`M${x + i * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 160}Q${x + (i + .5) * w / 6} ${yb - 140} ${x + i * w / 6} ${yb - 160}Z`, i % 2 ? '#fff' : ac, 4);
    if (o.sign) s += rect(x + w / 2 - o.sign.length * 11 - 16, yb - 250, o.sign.length * 22 + 32, 44, '#fff8e0', 8, 4) + ftext(x + w / 2, yb - 218, o.sign, { size: 26, fill: ac, stroke: 'none' }); }
  return s; }
const sLampPost = (x, yb, s = 1, on = 0) => G(tr(x, yb, s), (on ? op(.35, circ(0, -470, 70, '#fff6c8', 0)) : '') + rect(-22, -20, 44, 20, '#3a4250', 4, 4) + rect(-8, -440, 16, 420, '#3a4250', 4, 4) + path('M0 -440Q0 -480 50 -480', 'none', 10, '#3a4250') + path('M30 -486L90 -486L80 -456L40 -456Z', '#ffe08a', 4));
const sBench = (x, yb, s = 1) => G(tr(x, yb, s), rect(-120, -110, 240, 22, '#b5835a', 5, 4) + rect(-120, -80, 240, 22, '#b5835a', 5, 4) + rect(-130, -44, 260, 20, '#c8955a', 5, 4) + line(-100, -24, -100, 0, 8) + line(100, -24, 100, 0, 8) + line(-100, -110, -100, -44, 6) + line(100, -110, 100, -44, 6));
const sBike = (x, yb, s = 1, c = '#36a85a') => G(tr(x, yb - 50 * s, s), circ(-70, 0, 48, 'none', 7) + circ(70, 0, 48, 'none', 7) + path('M-70 0L-20 -70L50 -70L70 0M-20 -70L0 0L50 -70M0 0L-70 0', 'none', 7, c) + line(-30, -90, -6, -90, 8) + path('M50 -70L44 -96L66 -100', 'none', 7));
function sCar(x, yb, s = 1, c = '#ff6b6b', flip = 0) { return G(`translate(${f1(x)} ${f1(yb)}) scale(${flip ? -s : s} ${s})`, path('M-200 -40L-200 -100Q-190 -120 -150 -124L-100 -190Q-80 -200 40 -200Q90 -196 120 -124L190 -114Q210 -104 210 -70L210 -40Z', c, 6) + path('M-84 -130L-56 -180L10 -180L10 -130Z', '#cfe8ff', 4) + path('M30 -130L30 -180L80 -180L106 -130Z', '#cfe8ff', 4) + circ(-110, -36, 42, '#3a4250', 6) + circ(-110, -36, 16, '#c8ced6', 4) + circ(120, -36, 42, '#3a4250', 6) + circ(120, -36, 16, '#c8ced6', 4) + rect(186, -98, 22, 16, '#ffe08a', 4, 3)); }
const sBush = (x, yb, s = 1, c = '#5fb85f') => G(tr(x, yb, s), circ(-60, -40, 50, shade(c, -.1), 5) + circ(50, -44, 54, shade(c, -.05), 5) + circ(0, -70, 64, c, 5) + rect(-110, -12, 220, 12, c, 0, 0));
function sFlowers(x, yb, n = 5, seed = 2, t = 0) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const fx = x + i * 34 + r() * 10, h = 40 + r() * 30, sw = wave(t, .6, 4, i); s += line(fx, yb, fx + sw, yb - h, 5, '#4fa64f') + circ(fx + sw, yb - h, 14, DPAL[Math.floor(r() * 8)], 4) + circ(fx + sw, yb - h, 5, '#ffd23f', 0); } return s; }
const sPine = (x, yb, s = 1, t = 0) => G(tr(x, yb, s, wave(t, .3, 1.5, x)), rect(-16, -60, 32, 60, '#8a5a3a', 6, 5) + path('M-90 -60L0 -200L90 -60Z', '#3f9a5a', 5) + path('M-74 -150L0 -280L74 -150Z', '#4fa66a', 5) + path('M-56 -240L0 -350L56 -240Z', '#5fb87a', 5));
const sFence = (x0, x1, yb, c = '#fff') => { let s = rect(x0, yb - 90, x1 - x0, 14, c, 3, 4) + rect(x0, yb - 46, x1 - x0, 14, c, 3, 4); for (let x = x0; x < x1; x += 46) s += path(`M${x} ${yb}L${x} ${yb - 110}L${x + 14} ${yb - 128}L${x + 28} ${yb - 110}L${x + 28} ${yb}Z`, c, 4); return s; };
const sSign = (x, yb, str, c = '#5b8fd8', s = 1) => G(tr(x, yb, s), rect(-8, -300, 16, 300, '#8a8f99', 4, 4) + rect(-110, -380, 220, 90, c, 12, 5) + ftext(0, -322, str, { size: 34, fill: '#fff', stroke: 'none' }));
const sBalloon = (x, y, c, t, ph = 0, s = 1) => { const bx = x + wave(t, .5, 10, ph), by = y + wave(t, .7, 12, ph + 1); return path(`M${f1(bx)} ${f1(by + 70 * s)}Q${f1(bx + 20)} ${f1(by + 160 * s)} ${f1(bx - 6)} ${f1(by + 260 * s)}`, 'none', 3) + G(tr(bx, by, s), ell(0, 0, 52, 64, c, 5) + path('M-8 62L8 62L0 74Z', c, 4) + ell(-18, -24, 10, 16, 'rgba(255,255,255,.6)', 0)); };
const sSpeaker = (x, yb, s = 1, t = 0) => { const p = 1 + .08 * Math.max(0, Math.sin(t * 13)); return G(tr(x, yb, s), rect(-90, -340, 180, 340, '#241830', 14, 6) + circ(0, -240, 52 * p, '#3a2a4a', 5) + circ(0, -240, 18, '#5ec4f0', 4) + circ(0, -100, 66 * p, '#3a2a4a', 5) + circ(0, -100, 22, '#ff5c8a', 4)); };
const sNeon = (x, y, str, c, t, size = 54) => { const on = Math.sin(t * 7) > -.6 || Math.sin(t * 23) > .2; return op(on ? 1 : .35, ftext(x, y, str, { size, fill: 'none', stroke: c, sw: 6 }) + (on ? op(.35, glow(x, y - size * .3, size * 1.6, c, .5)) : '')); };
const sStreamers = (t, y = -20, n = 9) => { let s = ''; for (let i = 0; i < n; i++) { const x = -40 + i * 140, l = 120 + (i * 53) % 90; s += path(`M${x} ${y}Q${x + 20 + wave(t, .9, 12, i)} ${y + l * .5} ${x + wave(t, .9, 18, i + 1)} ${y + l}`, 'none', 10, DPAL[i % 8]); } return s; };
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + circ(930, 150, 60, '#fff3b0', 0) + op(.35, circ(930, 150, 100, '#fff3b0', 0)) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff') + cloud(((t * 12 + 1200) % 1800) - 300, 120, .7, 'rgba(255,255,255,.85)') + sBirds(t, 3, 280);
function tree(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c') + circ(-40, -380, 14, '#e2463a', 4) + circ(60, -300, 14, '#e2463a', 4) + circ(-80, -240, 12, '#e2463a', 4)); }
function kidsBg(t, y = 1150, n = 4, s = .45) { let r = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; r += kid(i + 1, { x, y, s, expr: 'happy', walk: 3, flip: i % 2 }, t); } return r; }
function streetT(t, n = 3) { const yb = 1250; let s = SKY(t, '#9fd6ff', '#fff1dc') + op(.85, sSkyline(1000, '#bccde0', 5)) + sHaze(.2);
  const signs = ['CAFÉ', '', 'BOULANGERIE', '', 'PHARMACIE', 'FLEURS', '', 'CINÉ'];
  for (let i = -2; i < 6; i++) s += sBuilding(-200 + i * 300, yb, 280, 540 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4], i + 10, t, { sign: signs[(i + 8) % 8], awn: DPAL[(i + 8) % 8] });
  s += sHaze(.16, '255,250,240', 1250);
  s += rect(-M, yb, W + 2 * M, 1400, '#c8ccd2', 0, 0) + [0, 1, 2].map(i => line(-M, yb + 20 + i * 26, W + M, yb + 20 + i * 26, 3, '#b0b5bc')).join('') + rect(-M, yb + 90, W + 2 * M, 20, '#8f959d', 0, 0) + rect(-M, yb + 110, W + 2 * M, 1400, '#6e747c', 0, 0) + Array.from({ length: 10 }, (_, i) => rect(-M + i * 300 - ((t * 0) % 300), yb + 300, 160, 18, '#fff', 4, 0)).join('') + line(-M, yb, W + M, yb, 8, '#7d848c');
  s += sLampPost(70, yb, 1) + sLampPost(830, yb, 1) + tree(470, yb, .62, t) + sBench(640, yb, .7) + sBin(950, yb, .6, '#36a85a') + sBike(260, yb + 10, .6, '#ff5c8a') + sSign(1050, yb, 'RUE', '#5b8fd8', .8) + sFlowers(900, yb, 4, 5, t) + sCar(-60, yb + 250, .9, '#5ec4f0') + sCar(1000, yb + 260, .9, '#ffd23f', 1);
  for (let i = 0; i < n; i++) { const x = ((i * 520 + t * (70 + i * 20) * (i % 2 ? -1 : 1)) % 1700 + 1700) % 1700 - 300; s += op(.8, adult(i + 2, { x, y: 1270, s: .5, expr: 'neutral', walk: 3, flip: i % 2 }, t)); }
  return s; }
const WASH = (c = 'rgba(255,255,255,.14)') => rect(-M, -M, W + 2 * M, H + 2 * M, c, 0, 0); // voile léger : décor moins saturé derrière les persos
function sofa(x, yb, s = 1, c = '#5ec4a0') { return G(tr(x, yb, s), rect(-330, -260, 660, 180, shade(c, -.12), 44, 6) + rect(-290, -235, 160, 115, '#ffd23f', 34, 5) + rect(-70, -225, 150, 105, '#fff', 34, 5) + rect(130, -232, 150, 112, '#e86a8a', 34, 5) + rect(-290, -125, 580, 95, c, 22, 6) + rect(-385, -160, 105, 160, c, 32, 6) + rect(280, -160, 105, 160, c, 32, 6) + rect(-340, -30, 34, 30, '#6b3e26', 4, 4) + rect(306, -30, 34, 30, '#6b3e26', 4, 4) + G(tr(-200, -150, 1, -10), rect(-60, -10, 120, 18, '#5b8fd8', 6, 4))); }
function famTable(x, yb, s, t, o = {}) { let g = ''; for (let i = 0; i < 5; i++) { const cx = -380 + i * 190; g += rect(cx - 50, -330, 100, 150, '#c58e55', 14, 5) + line(cx - 36, -180, cx - 36, -40, 8) + line(cx + 36, -180, cx + 36, -40, 8); }
  g += rect(-520, -200, 1040, 40, '#b07a45', 8, 6) + path('M-520 -200L520 -200L540 -110L-540 -110Z', '#fff', 6) + [0, 1, 2, 3, 4, 5].map(i => path(`M${-540 + i * 180} -110l90 0l-45 30Z`, '#e2463a', 0)).join('') + line(-480, -110, -480, 0, 12) + line(480, -110, 480, 0, 12);
  if (!o.empty) g += [-380, -190, 0, 190, 380].map((cx, i) => ell(cx, -206, 60, 16, '#fff', 4) + ell(cx, -208, 34, 8, ['#ffd23f', '#7be07b', '#ff8fb1', '#ff9a4d', '#5ec4f0'][i], 0)).join('');
  else g += [-380, -190, 190, 380].map(cx => ell(cx, -206, 60, 16, '#fff', 4) + op(.5, path(`M${cx - 40} -240Q${cx} -${270 + wave(t, .5, 8)} ${cx + 40} -240`, 'none', 3, '#ccc'))).join('');
  return G(tr(x, yb, s), g); }
function salonF(t, o = {}) { const yb = 1250, n = o.night;
  let s = sWall('diamond', n ? '#3a3a6a' : '#fde7c8', n ? '#4a4a80' : '#f6d3a8', yb) + rect(-M, 930, W + 2 * M, yb - 930, n ? '#33335e' : '#eccb9c', 0, 0) + line(-M, 930, W + M, 930, 8, n ? '#2a2a50' : '#c9a473') + sBase(yb, '#fff');
  s += sFrame(110, 330, 150, 180, 'face', '#c38a52', -3) + sFrame(290, 300, 130, 160, 'face', '#8a5a3a', 2) + sFrame(120, 560, 130, 150, 'face', '#ff9a4d', 3) + sFrame(290, 530, 140, 170, 'face', '#5b8fd8', -2) + sFrame(420, 430, 54, 64, 'mount', '#9aa3ad', 6);
  s += wallClock(560, 200, 56, t, o.clock || 1) + sShelf(440, 690, 250, sBooks(455, 690, 110, 5) + sTrophy(600, 690, .7) + sTrophy(650, 690, .55)) + sOutlet(80, 1180) + sSwitch(1020, 880);
  s += sWindowView(720, 300, 280, 360, t, { night: n }) + sCurtain(660, 280, 100, 450, '#e86a8a', t, 1) + sCurtain(960, 280, 100, 450, '#e86a8a', t, -1) + sPot(760, 690, .45, t, 2, '#5b8fd8') + sPot(965, 690, .4, t, 1);
  if (!o.noSofa) s += sofa(CX - 40, 1290, .95, '#5ec4a0');
  s += n ? op(.3, rect(-M, -M, W + 2 * M, yb + M, '#141838', 0, 0)) : WASH();
  s += sParquet(yb, n ? '#5a4a4a' : '#c49a6c') + sRug(CX, 1470, 820, 170, '#e86a8a', '#ffd23f') + sLamp(1020, 1290, 1, 1, t, '#ffd23f') + sPot(70, 1290, 1, t, 0);
  s += sBall(250, 1580, .6, t * .3, '#5b8fd8') + sShoes(820, 1660, .7, '#e2463a') + sTeddy(960, 1620, .7) + sBox(140, 1780, .8, 'JOUETS');
  return s; }
function cuisine(t, o = {}) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#fff1c4', 0, 0);
  for (let y = 820, j = 0; y < 1000; y += 60, j++) for (let x = -M + (j % 2) * 45; x < W + M; x += 90) s += rect(x, y, 90, 60, '#e8f4f8', 0, 3, '#c9dde6');
  for (let i = 0; i < 4; i++) { const x = 250 + i * 110; s += rect(x, 150, 104, 260, '#7fc8b0', 8, 6) + rect(x + 14, 170, 76, 220, 'none', 6, 3, '#5aa58c') + rect(x + 46, 340, 12, 40, '#fff', 5, 3); }
  s += rect(240, 132, 460, 22, '#5aa58c', 4, 5) + sJar(300, 130, '#ff9a4d', .7) + sJar(360, 130, '#7be07b', .7) + sPot(640, 130, .45, t, 2, '#e2463a');
  s += sWindowView(740, 300, 270, 330, t); for (let i = 0; i < 6; i++) s += path(`M${720 + i * 52} 290L${772 + i * 52} 290L${772 + i * 52} 380Q${746 + i * 52} ${410 + wave(t, .6, 6, i)} ${720 + i * 52} 380Z`, i % 2 ? '#fff' : '#e2463a', 4); s += rect(712, 278, 326, 16, '#8a5a3a', 6, 4);
  s += rect(-40, 380, 260, 870, '#eef3f6', 26, 7) + line(-40, 700, 220, 700, 6) + rect(186, 460, 16, 160, '#c9d3dc', 6, 4) + rect(186, 760, 16, 200, '#c9d3dc', 6, 4);
  s += [[30, 480, '#ff8fb1', -6], [120, 520, '#5ec4f0', 5], [40, 820, '#7be07b', 4], [130, 880, '#ffd23f', -5]].map(([x, y, c, r]) => G(tr(x, y, 1, r + wave(t, .8, 1.5, x)), rect(-40, -50, 80, 100, '#fff', 4, 4) + circ(0, -12, 22, c, 3) + path('M-20 26L0 14L20 30', 'none', 4, c) + circ(0, -54, 8, '#e2463a', 3))).join('') + G(tr(110, 1020, 1, 8), rect(-14, -14, 28, 28, '#ffd23f', 2, 3)) + circ(60, 650, 12, '#5b8fd8', 4) + circ(150, 1100, 12, '#ff9a4d', 4);
  s += wallClock(330, 520, 48, t) + G(tr(560, 540), rect(-80, -90, 160, 190, '#fff', 8, 5) + rect(-80, -90, 160, 34, SX.acc, 8, 5) + ftext(0, -64, 'CORVÉES', { size: 20, fill: '#fff', stroke: 'none' }) + [0, 1, 2, 3, 4].map(i => rect(-64, -42 + i * 26, 128, 16, DPAL[i], 4, 0)).join(''));
  s += line(250, 760, 690, 760, 8, '#9aa3ad') + [300, 380, 460, 540, 620].map((x, i) => G(tr(x, 760, 1, wave(t, .7, 4, i)), line(0, 0, 0, 50, 5, '#9aa3ad') + (i % 2 ? circ(0, 66, 18, '#c9d3dc', 4) : rect(-10, 50, 20, 36, '#c9d3dc', 4, 4)))).join('');
  s += WASH() + rect(220, 1000, 900, 30, '#b98552', 6, 6) + rect(220, 1030, 900, 230, '#7fc8b0', 0, 6);
  for (let i = 0; i < 2; i++) s += rect(240 + i * 170, 1050, 150, 90, '#8fd4bc', 8, 4) + rect(295 + i * 170, 1080, 40, 12, '#fff', 5, 3);
  s += rect(600, 1045, 220, 205, '#3a3f4a', 10, 5) + rect(620, 1100, 180, 120, '#ffb36b', 8, 4) + op(.4, glow(710, 1160, 120, '#ffd88a', .6)) + [0, 1, 2, 3].map(i => circ(630 + i * 52, 1070, 9, '#c9ced6', 3)).join('');
  s += G(tr(420, 1000), rect(-80, -110, 160, 110, '#c9d3dc', 12, 6) + rect(-100, -122, 200, 22, '#9aa3ad', 8, 5) + line(-100, -90, -128, -90, 10) + line(100, -90, 128, -90, 10)) + steam(400, 860, t, .8) + steam(450, 870, t + .4, .6);
  s += G(tr(930, 1000), path('M-80 -50Q0 40 80 -50Z', '#ff9a4d', 5) + circ(-30, -60, 22, '#e2463a', 4) + circ(10, -70, 22, '#ffd23f', 4) + circ(40, -56, 20, '#7be07b', 4)) + sMug(1060, 1000, .9, t, '#5b8fd8');
  s += sTileFloor(yb, '#f0e6da', '#d9c4a8') + sBin(1050, 1340, .7, '#36a85a') + sShoes(150, 1700, .7, '#5b8fd8');
  return s; }
function entree(t, o = {}) { const yb = 1250, op_ = o.open || 0;
  let s = sWall('stripe', '#d6ecf7', '#c4e0ef', yb) + rect(-M, 960, W + 2 * M, yb - 960, '#9fc6dc', 0, 0) + line(-M, 960, W + M, 960, 6, '#7fa8c0') + sBase(yb, '#fff');
  s += rect(392, 512, 296, 746, '#fff', 6, 7);
  if (op_ > 0) s += clipR(400, 520, 280, 730, grad('#141a40', '#3a3070', 400, 520, 280, 730) + circ(620, 600, 26, '#fff6d6', 0) + rect(400, 1080, 280, 170, '#3a4060', 0, 0) + sLampPost(450, 1180, .55, 1) + (o.friends ? kid(1, { x: 560, y: 1290, s: .8, expr: 'joy', armR: [-60, -100] }, t) + kid(3, { x: 650, y: 1300, s: .75, expr: 'happy', armL: [200, 240], flip: 1 }, t) : ''), 0);
  const dw = lerp(280, 60, op_); s += rect(400, 520, dw, 730, '#e2463a', 4, 6) + (dw > 120 ? rect(400 + dw * .2, 570, dw * .6, 200, '#cfe8ff', 10, 5) + rect(400 + dw * .2, 830, dw * .6, 330, 'none', 8, 4, '#b8352b') + circ(400 + dw * .85, 920, 14, '#ffd23f', 4) : '');
  // toise des aînés sur le chambranle (+ le tien, tout en bas)
  [['12', 830], ['10', 900], ['9', 950], ['8 ANS', 1010]].forEach(([nm, y]) => { s += line(700, y, 740, y, 5) + ftext(746, y + 8, nm, { size: 20, fill: '#2b2420', stroke: 'none', anchor: 'start' }); });
  s += line(40, 360, 340, 360, 10, '#8a5a3a'); for (let i = 0; i < 6; i++) { const x = 60 + i * 52, c = [...DPAL, '#5a6b4a'][i], sw = wave(t, .4, 3, i); s += circ(x, 360, 8, '#ffd23f', 3) + G(tr(x, 366, 1, sw), path('M-30 0L30 0L44 230L-44 230Z', c, 5) + line(0, 0, 0, 230, 3, shade(c, -.2))); }
  s += G(tr(290, 330, 1, -8), path('M-50 0Q0 -60 50 0Z', '#36a85a', 5) + rect(-60, -4, 120, 12, '#36a85a', 6, 4));
  s += rect(40, 1130, 320, 20, '#b98552', 4, 5) + rect(40, 1190, 320, 20, '#b98552', 4, 5) + line(50, 1130, 50, 1250, 8) + line(350, 1130, 350, 1250, 8);
  const sc = ['#e2463a', '#5b8fd8', '#ffd23f', '#36a85a', '#ff8fb1', '#b56cff', '#ff9a4d']; for (let i = 0; i < 7; i++) s += sShoes(90 + (i % 3) * 100, 1128 + (i > 2 ? 60 : 0) - (i > 5 ? 60 : 0), .45, sc[i]);
  s += circ(880, 520, 110, '#f1c27d', 7) + circ(880, 520, 88, '#cfe8f5', 5) + line(840, 470, 880, 430, 8, 'rgba(255,255,255,.7)');
  s += rect(760, 900, 260, 22, '#b98552', 6, 5) + line(780, 922, 780, 1250, 8) + line(1000, 922, 1000, 1250, 8) + ell(830, 896, 40, 14, '#5ec4f0', 4) + circ(820, 880, 9, '#ffd23f', 3) + sPot(950, 900, .5, t, 0) + rect(880, 860, 50, 36, '#fff', 3, 3);
  s += line(CX + 30, -M, CX + 30 + wave(t, .5, 20), 300, 4) + G(tr(CX + 30 + wave(t, .5, 20), 300), path('M-60 40L60 40L30 -10L-30 -10Z', '#ffd23f', 5) + op(.3, circ(0, 60, 90, '#fff6c8', 0)));
  s += WASH('rgba(255,255,255,.1)');
  s += sParquet(yb, '#b98a5c') + rect(240, 1300, 600, 900, '#5b8fd8', 10, 6) + rect(270, 1320, 540, 900, 'none', 6, 5, '#ffd23f') + sBag(940, 1360, .8, '#e2463a', 10) + sBall(1030, 1600, .6, 0, '#ffd23f');
  if (o.night) s += op(.28, rect(-M, -M, W + 2 * M, H + 2 * M, '#1a1d48', 0, 0));
  return s; }
function chambreH(t, o = {}) { const yb = 1250;
  let s = sWall('dot', o.c1 || '#d9f0d2', o.c2 || '#c4e6b9', yb) + sBase(yb, '#fff');
  s += sWindowView(60, 300, 260, 330, t) + sCurtain(0, 280, 90, 420, '#5b8fd8', t, 1) + sCurtain(290, 280, 90, 420, '#5b8fd8', t, -1);
  s += sPoster(480, 360, 150, 210, '#ff9a4d', -4, circ(0, -20, 40, '#fff', 4) + path('M-20 40L0 -10L20 40Z', '#e2463a', 4), t) + sPoster(660, 400, 130, 170, '#b56cff', 5, ftext(0, 10, '★', { size: 70, fill: '#ffd23f', stroke: 'none' }), t);
  s += G(tr(860, 300, 1, 6 + wave(t, .5, 2)), path('M-90 -40L120 0L-90 40Z', '#36a85a', 6) + ftext(-20, 12, 'GO !', { size: 32, fill: '#fff', stroke: 'none' }));
  s += wallClock(1010, 470, 46, t) + sShelf(720, 640, 330, sBooks(730, 640, 150, 7) + sTeddy(920, 640, .6) + sTrophy(1000, 640, .6)) + sOutlet(560, 1180);
  s += G(tr(900, yb), rect(-220, -230, 40, 230, '#b98552', 8, 6) + rect(-200, -110, 420, 90, '#b98552', 10, 6) + rect(-190, -150, 400, 60, '#fff', 20, 5) + path('M-120 -150Q60 -190 230 -150L230 -40L-120 -40Z', '#5b8fd8', 6) + ell(-150, -170, 60, 30, '#fff', 5));
  s += WASH() + sParquet(yb, '#c49a6c') + sRug(CX, 1480, 760, 160, '#5ec4f0', '#ffd23f');
  s += G(tr(170, 1320), [0, 1, 2, 3].map(i => path(`M${-90 + i * 8} ${-i * 34}L${90 - i * 6} ${-i * 34}L${84 - i * 6} ${-i * 34 - 30}L${-84 + i * 8} ${-i * 34 - 30}Z`, DPAL[i + 1], 4)).join('') + funTagS('À LAVER', 0, -150));
  s += sShoes(820, 1660, .7, '#36a85a') + sBag(960, 1400, .8, '#ff9a4d', 8) + sBall(300, 1700, .6, t * .2, '#e2463a');
  return s; }
const funTagS = (str, x, y) => G(tr(x, y, 1, -6), rect(-str.length * 9 - 14, -18, str.length * 18 + 28, 36, '#fff8e0', 8, 4) + ftext(0, 9, str, { size: 22, fill: '#7a5a3a', stroke: 'none' }));
function houseExt(t, o = {}) { const yb = 1250, dk = o.dusk || 0;
  let s = SKY(t, mixC('#8fd3ff', '#ff9a6b', dk), mixC('#e6f6ff', '#ffe0b0', dk)) + sBirds(t, 3, 260) + op(.8, sSkyline(1010, mixC('#c3d6e4', '#d9a8a0', dk), 4)) + sHaze(.18, '255,245,235') + ell(200, 1080, 500, 120, '#9ccf8a', 0) + ell(900, 1090, 500, 110, '#8fc47c', 0);
  for (let i = 0; i < 4; i++) { const k = (t * .4 + i / 4) % 1; s += op(.7 * (1 - k), circ(770 + k * 60 + wave(t, .5, 10, i), 470 - k * 260, 26 + k * 40, '#eef0f4', 0)); }
  s += rect(730, 470, 70, 150, '#b8352b', 4, 6) + path('M140 640L540 380L940 640Z', '#d9534f', 7) + rect(180, 640, 720, 610, '#f6e3c0', 6, 7) + [0, 1, 2, 3, 4].map(i => line(180, 700 + i * 110, 900, 700 + i * 110, 3, '#ead2a8')).join('');
  [[260, 700], [660, 700]].forEach(([x, y]) => { s += rect(x, y, 160, 150, mixC('#cfe8ff', '#ffd88a', dk), 6, 6) + line(x + 80, y, x + 80, y + 150, 5) + path(`M${x} ${y}L${x + 50} ${y}Q${x + 30} ${y + 70} ${x} ${y + 150}Z`, '#e86a8a', 4) + rect(x - 10, y + 150, 180, 30, '#b98552', 4, 5) + sFlowers(x + 20, y + 150, 4, x, t); });
  s += rect(260, 960, 160, 150, '#cfe8ff', 6, 6) + line(340, 960, 340, 1110, 5) + rect(470, 920, 140, 330, '#5b8fd8', 6, 6) + circ(585, 1090, 10, '#ffd23f', 4) + rect(450, 1230, 180, 20, '#c9b8a0', 3, 5) + rect(660, 960, 160, 150, '#cfe8ff', 6, 6) + line(740, 960, 740, 1110, 5);
  s += rect(500, 870, 80, 34, '#fff8e0', 6, 4) + ftext(540, 896, 'N°7', { size: 22, fill: '#7a5a3a', stroke: 'none' });
  s += tree(1000, 1250, .85, t) + sPine(80, 1250, .8, t) + sBush(160, 1250, .6) + sBush(880, 1250, .55, '#4fa64f') + G(tr(980, 1260), rect(-6, -150, 12, 150, '#8a5a3a', 3, 4) + rect(-50, -200, 100, 60, '#e2463a', 18, 5) + ftext(0, -160, 'FAMILLE', { size: 16, fill: '#fff', stroke: 'none' }));
  s += sFence(-M, 440, 1260, '#fff') + sFence(640, W + M, 1260, '#fff') + rect(-M, 1260, W + 2 * M, 200, '#8fd16a', 0, 0) + rect(440, 1260, 200, 200, '#d8c8a8', 0, 4) + rect(-M, 1460, W + 2 * M, 110, '#c8ccd2', 0, 0) + line(-M, 1460, W + M, 1460, 6, '#9aa0a8') + rect(-M, 1570, W + 2 * M, 600, '#6e747c', 0, 0) + Array.from({ length: 8 }, (_, i) => rect(-M + i * 300, 1720, 160, 16, '#fff', 4, 0)).join('');
  s += sLampPost(40, 1470, .9, dk > .4) + (o.car !== false ? sCar(900, 1690, .8, '#ffd23f', 1) : '');
  if (dk) s += op(.2 * dk, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff7a3a', 0, 0));
  return s; }
function battery(x, y, s, lvl, t) { const c = lvl < .25 ? '#e2463a' : lvl < .5 ? '#ffb03a' : '#7be07b'; return G(tr(x, y, s), rect(-90, -44, 180, 88, '#fff', 16, 7) + rect(90, -18, 18, 36, OL, 4, 0) + (lvl > 0 ? rect(-78, -32, 156 * lvl, 64, (lvl < .25 && Math.sin(t * 14) > 0) ? '#ffb3a8' : c, 8, 0) : '')); }
function polaroid(x, y, s, r, inner, t, t0) { const k = pop(t, t0, .4); if (k <= 0) return ''; return G(tr(x, y, s * k, r + (1 - k) * 30), rect(-110, -120, 220, 250, '#fff', 8, 6) + clipR(-92, -102, 184, 176, rect(-92, -102, 184, 176, '#bfe6ff', 0, 0) + inner, 4) + rect(-92, -102, 184, 176, 'none', 4, 4) + rect(-30, -136, 60, 30, 'rgba(255,240,180,.8)', 3, 0)); }
const sCone = (x, y, s = 1) => G(tr(x, y, s), rect(-50, -10, 100, 14, '#ff7a2f', 4, 4) + path('M-34 -10L0 -150L34 -10Z', '#ff7a2f', 5) + path('M-24 -50L24 -50', 'none', 12, '#fff'));
function schoolBuilding(x, yb, w, h, t) { let s = path(`M${x - 30} ${yb - h}L${x + w / 2} ${yb - h - 130}L${x + w + 30} ${yb - h}Z`, '#d9534f', 6) + rect(x, yb - h, w, h, '#f0d9b5', 4, 6);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) { if (j === 2 && (i === 1 || i === 2)) continue; const wx = x + 40 + i * (w - 60) / 4, wy = yb - h + 50 + j * 150; s += rect(wx, wy, (w - 60) / 4 - 30, 90, '#cfe8ff', 4, 5) + circ(wx + 20, wy + 60, 12, DPAL[(i + j) % 8], 0) + path(`M${wx + 40} ${wy + 70}L${wx + 52} ${wy + 46}L${wx + 64} ${wy + 70}`, DPAL[(i + j + 3) % 8], 0) + line(wx, wy + 45, wx + (w - 60) / 4 - 30, wy + 45, 4); }
  s += rect(x + w / 2 - 80, yb - 200, 160, 200, '#3e7cc0', 8, 6) + line(x + w / 2, yb - 200, x + w / 2, yb, 5) + rect(x + w / 2 - 130, yb - 270, 260, 56, '#fff8e0', 10, 5) + ftext(x + w / 2, yb - 230, 'ÉCOLE', { size: 36, fill: '#d9534f', stroke: 'none' }) + wallClock(x + w / 2, yb - h - 50, 40, t);
  const fx = x + w - 40, fy = yb - h - 160; s += line(fx, yb - h, fx, fy, 6) + path(`M${fx} ${fy}Q${fx + 40} ${fy - 10 + wave(t, 2, 8)} ${fx + 80} ${fy + wave(t, 2, 10, .5)}L${fx + 80} ${fy + 50 + wave(t, 2, 10, .5)}Q${fx + 40} ${fy + 40 + wave(t, 2, 8)} ${fx} ${fy + 50}Z`, '#5b8fd8', 4);
  return s; }
function schoolyard(t) { const yb = 1180;
  return SKY(t) + op(.8, sSkyline(1120, '#c3d6e4', 3)) + circ(-20, 1080, 90, '#9ccf8a', 0) + circ(1020, 1060, 110, '#9ccf8a', 0) + sHaze(.15) +
    schoolBuilding(-120, yb, 640, 560, t) + sBuilding(560, yb, 700, 470, '#e8c9a0', 4, t, { shop: false }) + sFence(-M, W + M, yb, '#fff') +
    rect(-M, yb, W + 2 * M, 1500, '#c9b8a0', 0, 0) + line(-M, yb, W + M, yb, 7, '#a8987f') +
    [0, 1, 2, 3, 4].map(i => rect(CX - 60 + (i % 2) * 0, 1300 + i * 70, 120, 64, 'none', 4, 5, '#fff')).join('') + ftext(CX, 1660, '★', { size: 60, fill: '#fff', stroke: 'none' }) +
    G(tr(40, yb), rect(-8, -480, 16, 480, '#7d848c', 4, 4) + rect(-90, -520, 120, 80, '#fff', 6, 5) + circ(-40, -436, 30, 'none', 5, '#e2463a')) +
    sBench(260, 1230, .8) + sBush(700, 1200, .8) + sFlowers(780, 1225, 6, 3, t) + tree(950, 1200, .9, t) + sPine(1060, 1200, .7, t) + sBin(470, 1225, .6, '#36a85a') + sBall(620, 1290, .7, t) + sBag(160, 1290, .6, '#ff8fb1', -8) +
    kidsBg(t, 1230, 3); }
function classroomT(t, inner = '') { const yb = 1250;
  let s = sWall('stripe', '#fff1d6', '#ffe8c2', yb) + rect(-M, 960, W + 2 * M, yb - 960, '#d9b88c', 0, 0) + line(-M, 960, W + M, 960, 6, '#b8956a') + sBase(yb, '#a0784e');
  for (let i = 0; i < 8; i++) { const x = 100 + i * 105, y = 160 + Math.sin(i * .7) * 10 + wave(t, .8, 3, i); s += G(tr(x, y, 1, wave(t, .8, 5, i)), rect(-34, -40, 68, 70, DPAL[i % 8], 6, 4) + ftext(0, 14, 'ABCDEFGH'[i], { size: 36, fill: '#fff', stroke: 'none' })); }
  s += path('M40 120Q470 160 900 120', 'none', 4) + rect(60, 250, 960, 560, '#8a6a4a', 18) + rect(80, 270, 920, 520, '#456b55', 10, 0) + op(.15, path('M120 300Q400 340 700 300M150 700Q500 650 900 720', 'none', 12, '#fff')) + inner + rect(120, 790, 840, 18, '#8a6a4a', 6, 4) + rect(180, 774, 50, 18, '#fff', 4, 3) + rect(260, 776, 70, 16, '#ff8fb1', 4, 3) + rect(780, 770, 90, 22, '#3a3a3a', 4, 3);
  s += wallClock(960, 170, 60, t) + windowFrame(-200, 300, 220, 420) + sCurtain(-60, 290, 90, 450, '#ff8fb1', t, -1);
  s += sShelf(-20, 1000, 200, sBooks(-10, 1000, 180, 4)) + sPoster(1040, 600, 90, 300, '#7aa6d8', 4, ftext(0, 0, '1+1', { size: 34, fill: '#fff', stroke: 'none' }), t) + sOutlet(1010, 1170) + sSwitch(40, 900);
  for (let i = 0; i < 4; i++) s += circ(380 + i * 110, 880, 9, '#7d848c', 3) + (i % 2 ? sBag(380 + i * 110, 1010, .5, DPAL[i + 1]) : '');
  return s + sParquet(yb, '#c49a6c') + sBin(1010, 1300, .7) + sPot(60, 1290, .9, t, 1) + sRug(CX, 1520, 700, 140, '#7aa6d8', '#ffd23f'); }
function bedroomN(t, lamp = 0) { const yb = 1250; let s = sWall('star', '#1d2350', '#2e3a80', yb) + rect(-M, 900, W + 2 * M, yb - 900, '#262c5e', 0, 0) + line(-M, 900, W + M, 900, 5, '#3a4290');
  s += sWindowView(620, 230, 360, 420, t, { night: true }); for (let i = 0; i < 6; i++) s += sparkle(650 + (i * 67) % 300, 270 + (i * 113) % 200, .18 + .1 * Math.sin(t * 3 + i), '#fff6d6');
  s += sCurtain(560, 210, 110, 480, '#5a3a8a', t, 1) + sCurtain(930, 210, 110, 480, '#5a3a8a', t, -1);
  s += rect(90, 300, 230, 300, '#ff8fb1', 10) + ftext(205, 470, '★', { size: 120, fill: '#fff', stroke: 'none' }) + sFrame(400, 380, 120, 150, 'sea', '#8a6ad8', 3) + sShelf(60, 720, 420, sBooks(80, 720, 180, 7) + sTrophy(310, 720, .9) + sTeddy(410, 720, .7));
  s += G(tr(820, 1260), rect(-260, -260, 40, 300, '#6b4a8a', 10, 6) + rect(-240, -90, 520, 110, '#8a6ad8', 16, 6) + path('M-220 -100Q20 -150 270 -100L280 0L-220 0Z', '#5ec4f0', 6) + path('M-200 -70Q0 -100 260 -70', 'none', 4, '#3a9ac0') + ell(-160, -130, 70, 34, '#fff', 5) + sTeddy(-40, -110, .6, '#ff9a4d'));
  s += G(tr(470, 1250), rect(-70, -150, 140, 150, '#6b4a8a', 8, 5) + line(-60, -75, 60, -75, 4) + rect(-50, -200, 100, 50, '#141a3a', 8, 4) + ftext(0, -164, Math.sin(t * 6) > 0 ? '02:47' : '02 47', { size: 26, fill: '#ff5c8a', stroke: 'none' }) + op(.25, circ(0, -176, 70, '#ff5c8a', 0)));
  s += sOutlet(70, 1100) + sSwitch(1040, 960);
  return s + rect(-M, yb, W + 2 * M, 1400, '#3a3050', 0, 0) + line(-M, yb, W + M, yb, 6, '#2a2240') + sRug(330, 1420, 520, 120, '#5a3a8a', '#ff8fb1') + sShoes(180, 1330, .55, '#ff8fb1') + sBall(940, 1360, .5, 0, '#ffc83d'); }
function discoBall(x, y, s, t) { let g = circ(0, 0, 90, '#c9d3dc', 7); for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) { if (i * i + j * j > 10) continue; const lit = Math.sin(t * 6 + i * 1.7 + j * 2.3) > .4; g += rect(i * 24 - 10, j * 24 - 10, 20, 20, lit ? '#fff' : '#9aa8b5', 3, 0); } return G(tr(x, y, s), line(0, -400, 0, -90, 6) + g); }
function partyT(t, o = {}) { let s = grad('#3a1a5c', '#170b2a', -M, -M, W + 2 * M, H + 2 * M) + sWall('dot', 'rgba(0,0,0,0)', 'rgba(255,255,255,.05)', 1300); const cols = ['#ff5c8a', '#5ec4f0', '#ffd23f', '#7be07b'];
  s += sWindowView(-120, 640, 220, 300, t, { night: true }) + sWindowView(980, 640, 220, 300, t, { night: true }) + sNeon(940, 1010, 'PARTY', '#ff5c8a', t, 48);
  for (let i = 0; i < 4; i++) { const a = Math.sin(t * .9 + i * 1.6) * 30; s += op(.16, G(tr(150 + i * 260, -50, 1, a), path('M-30 0L30 0L260 1500L-260 1500Z', cols[i], 0))); }
  s += sStreamers(t, -20, 9);
  let gd = 'M-60 300'; for (let i = 0; i < 12; i++) gd += `Q${-60 + i * 110 + 55} ${360} ${-60 + (i + 1) * 110} 300`; s += path(gd, 'none', 5, '#2b2420');
  for (let i = 0; i < 12; i++) s += circ(-5 + i * 110, 338, 14, Math.sin(t * 5 + i * 1.3) > 0 ? cols[i % 4] : '#4a3a5a', 4);
  s += discoBall(CX, 160, .9, t) + sBalloon(70, 520, '#ff5c8a', t, 0, .8) + sBalloon(150, 590, '#ffd23f', t, 1, .7) + sBalloon(960, 540, '#5ec4f0', t, 2, .8) + sBalloon(1030, 610, '#7be07b', t, 3, .7);
  s += G(tr(820, 1300), rect(-150, -150, 300, 24, '#ff9a4d', 6, 5) + line(-130, -126, -130, 0, 8) + line(130, -126, 130, 0, 8) + [-100, -40, 30, 90].map((x, i) => i % 2 ? rect(x - 14, -196, 28, 46, '#e2463a', 4, 4) : ell(x, -164, 36, 14, '#ffd23f', 4)).join(''));
  s += sSpeaker(40, 1310, .9, t) + sSpeaker(1040, 1310, .9, t);
  if (o.dancers !== false) for (let i = 0; i < 5; i++) { const x = 60 + i * 240 + (o.part || 0) * (i < 2 ? -260 : i > 2 ? 260 : 0); s += op(.75, person({ age: 'adult', x, y: 1330 + (i % 2) * 40, s: .62, skin: '#4a2f5e', shirt: '#2e1a46', pants: '#1c1030', hair: KH[i], hairColor: '#1c1030', face: { eyes: 'closed', mouth: 'grin' }, armL: [200 + wave(t, 1.2, 40, i * .2), 250], armR: [-20 - wave(t, 1.2, 40, i * .2 + .5), -70], bob: 3, seed: 80 + i }, t * 1.6)); }
  s += rect(-M, 1300, W + 2 * M, 900, '#1c0f2e', 0, 0); for (let i = 0; i < 8; i++) s += rect(-80 + i * 160, 1320, 150, 70, Math.sin(t * 4 + i * 2) > 0 ? 'rgba(255,92,138,.35)' : 'rgba(94,196,240,.25)', 6, 0);
  for (let i = 0; i < 14; i++) s += rect((i * 97) % 1080, 1420 + (i * 53) % 300, 16, 26, DPAL[i % 8], 3, 0);
  return s; }
function pointHand(tx, ty, ang, sleeve, k = 1, len = 700) { if (k <= 0) return ''; const a = R(ang), off = (1 - k) * 800;
  return G(tr(tx - Math.cos(a) * off, ty - Math.sin(a) * off, 1, ang), line(-len, 0, -100, 0, 74, OL) + line(-len, 0, -100, 0, 60, sleeve) + rect(-54, -18, 70, 36, SKIN, 18, 6) + rect(-130, -46, 96, 92, SKIN, 38, 6) + path('M-100 -10L-50 -10M-100 14L-50 14', 'none', 5) + ell(-82, -46, 30, 16, SKIN, 6)); }
function parkA(t) { const yb = 1200;
  let s = SKY(t, '#9fe0ff', '#fff4dc') + op(.8, sSkyline(1060, '#c3d6e4', 8)) + sHaze(.15) + ell(200, 1130, 540, 130, '#9ccf8a', 0) + ell(900, 1120, 540, 120, '#8fc77d', 0);
  s += tree(110, 1200, 1, t) + sPine(330, 1180, .8, t) + tree(990, 1190, 1.05, t) + sPine(770, 1170, .7, t) + sLampPost(560, 1200, .85) + sBench(840, 1215, .75) + sBin(660, 1210, .55, '#36a85a') + sBirds(t, 2, 330);
  s += rect(-M, yb, W + 2 * M, 1500, '#8fd16a', 0, 0) + line(-M, yb, W + M, yb, 6, '#6fb84a') + path(`M-${M} 1520Q300 1330 540 1400Q800 1470 ${W + M} 1300L${W + M} 1420Q800 1580 540 1520Q300 1460 -${M} 1660Z`, '#e8d8b0', 0);
  s += ell(880, 1290, 180, 40, '#7fc8e8', 5) + G(tr(860 + wave(t, .4, 30), 1280), ell(0, 0, 26, 16, '#fff', 4) + circ(18, -16, 12, '#fff', 4) + path('M28 -16L40 -12L28 -9Z', '#ffb03a', 3));
  s += sBush(60, 1270, .7) + sFlowers(160, 1300, 6, 4, t) + sBush(1010, 1340, .6, '#4fa64f') + kidsBg(t, 1240, 2, .4);
  return s; }
function bathroomT(t) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#cfeaf0', 0, 0); for (let x = -M; x < W + M; x += 120) s += line(x, -M, x, H + M, 4, '#b2d6de'); for (let y = -M; y < H + M; y += 120) s += line(-M, y, W + M, y, 4, '#b2d6de');
  for (let x = -M; x < W + M; x += 120) s += rect(x, 190, 120, 60, ((x / 120) % 2 + 2) % 2 ? '#7fd3e6' : '#ffd23f', 0, 0); s += line(-M, 190, W + M, 190, 4, '#9cc8d2') + line(-M, 250, W + M, 250, 4, '#9cc8d2');
  s += rect(250, 120, 580, 44, '#e8eef0', 22, 5) + [0, 1, 2, 3].map(i => op(.6 + .3 * Math.sin(t * 3 + i), circ(320 + i * 145, 142, 18, '#fff6c8', 4))).join('');
  s += mirror(170, 280, 740, 860) + rect(770, 320, 80, 70, '#ffe066', 3, 3) + rect(700, 330, 70, 60, '#ff8fb1', 3, 3);
  s += line(-10, 520, 120, 520, 10, '#c8ced6') + towel(10, 520, 100, 300, '#ff8fb1', '#fff') + sShelf(940, 640, 150, sJar(980, 640, '#7be07b') + rect(1020, 560, 40, 80, '#5ec4f0', 10, 4) + rect(1028, 540, 24, 22, '#fff', 4, 3)) + sShelf(940, 900, 150, sPot(1010, 900, .6, t, 2, '#fff')) + sOutlet(60, 1000);
  s += rect(-M, 1250, W + 2 * M, 1400, '#e8eef0', 0, 0) + line(-M, 1250, W + M, 1250, 7, '#b8c4c8') + path(`M${CX - 300} 1250L${CX + 300} 1250Q${CX + 280} 1420 ${CX} 1430Q${CX - 280} 1420 ${CX - 300} 1250Z`, '#fff');
  s += rect(CX - 20, 1170, 40, 80, '#c8ced6', 8, 5) + path(`M${CX - 20} 1180L${CX - 20} 1150Q${CX - 20} 1130 ${CX + 30} 1130L${CX + 60} 1130L${CX + 60} 1160`, 'none', 14, '#c8ced6') + (() => { const k = (t * 1.3) % 1; return circ(CX + 60, 1170 + k * 120, 8, '#9fd6ff', 3); })();
  s += G(tr(170, 1250), rect(-36, -110, 72, 110, '#7fd3e6', 14, 5) + line(-10, -110, -16, -170, 7, '#ff8fb1') + line(12, -110, 22, -176, 7, '#5ec4f0')) + G(tr(900, 1250), rect(-40, -120, 80, 120, '#fff', 20, 5) + rect(-10, -150, 20, 30, '#c8ced6', 4, 4) + path('M10 -150L46 -150', 'none', 8, '#c8ced6')) + G(tr(990, 1250 + wave(t, 1.2, 3)), ell(0, -30, 44, 30, '#ffd23f', 5) + circ(24, -70, 24, '#ffd23f', 5) + path('M44 -72L66 -66L44 -60Z', '#ff9a4d', 3) + circ(30, -76, 4, OL, 0));
  return s; }
const hangLamp = (x, y, t, k = 1) => { const sw = wave(t, .6, 8); return G(tr(x, 0, 1, sw), line(0, -M, 0, y, 6) + op(.28 * k, path(`M-50 ${y + 40}L50 ${y + 40}L380 ${y + 1200}L-380 ${y + 1200}Z`, '#fff6b0', 0)) + path(`M-90 ${y + 50}L90 ${y + 50}L40 ${y - 20}L-40 ${y - 20}Z`, '#3a3f4a', 6) + circ(0, y + 52, 22, '#fff6b0', 4)); };
const calPage = (x, y, s, str, c, r = 0, sub = '') => G(tr(x, y, s, r), rect(-110, -130, 220, 260, '#fff', 16, 6) + rect(-110, -130, 220, 70, c, 16, 6) + ftext(0, -82, str, { size: 34, fill: '#fff', stroke: 'none' }) + (sub ? ftext(0, 40, sub, { size: 90, fill: OL, stroke: 'none' }) : ''));
function phoneBig(x, y, s, r, screen) { return G(tr(x, y, s, r), rect(-170, -330, 340, 660, '#2b2b33', 44) + rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + screen + rect(-50, -318, 100, 14, '#444', 7, 0)); }
function invite(kind, x, y, s, t, t0, r = 0) { const k = popEl(t, t0, .45); if (k <= 0) return ''; let g;
  if (kind === 'anniv') g = rect(-220, -160, 440, 320, '#fff8e0', 22, 7) + rect(-220, -160, 440, 70, '#ff8fb1', 22, 7) + ftext(0, -110, 'ANNIV !', { size: 44, fill: '#fff' }) + G(tr(-80, 90, .55), rect(-120, -80, 240, 120, '#ff8fb1', 20, 6) + [0, 1, 2].map(i => rect(-60 + i * 50, -140, 16, 60, DPAL[i + 1], 4, 4)).join('')) + ftext(90, 40, 'SAMEDI', { size: 34, fill: OL, stroke: 'none' }) + ftext(90, 90, '20 H', { size: 34, fill: OL, stroke: 'none' });
  else if (kind === 'concert') g = rect(-240, -130, 480, 260, '#8a6ad8', 18, 7) + `<line x1="110" y1="-130" x2="110" y2="130" stroke="#fff" stroke-width="5" stroke-dasharray="12 10"/>` + ftext(-60, -50, 'CONCERT', { size: 46, fill: '#fff' }) + ftext(-60, 20, '♪ ♫ ♪', { size: 56, fill: SX.acc2, stroke: 'none' }) + ftext(-60, 80, 'FOSSE', { size: 28, fill: '#fff', stroke: 'none' }) + ftext(176, 16, 'N°7', { size: 40, fill: '#fff', stroke: 'none' });
  else g = rect(-250, -130, 500, 260, '#5ec4f0', 18, 7) + rect(-250, -130, 500, 64, '#2f6fb0', 18, 7) + ftext(0, -82, 'BOARDING PASS', { size: 32, fill: '#fff', stroke: 'none' }) + ftext(-120, 10, 'PARIS', { size: 36, fill: OL, stroke: 'none' }) + ftext(120, 10, 'BALI', { size: 36, fill: OL, stroke: 'none' }) + path('M-30 0L40 0M20 -16L40 0L20 16', 'none', 7) + `<line x1="-210" y1="70" x2="210" y2="70" stroke="${OL}" stroke-width="4" stroke-dasharray="6 6"/>`;
  return G(tr(x, y, s * k, r + (1 - k) * 20), g); }
const thought = (x, y, w, h, inner, t, t0) => { const k = popEl(t, t0, .45); if (k <= 0) return ''; return G(tr(x, y, k), circ(-w * .42, h * .62, 20, '#fff', 5) + circ(-w * .3, h * .5, 30, '#fff', 5) + ell(0, 0, w / 2, h / 2, '#fff', 6) + clipR(-w / 2 + 30, -h / 2 + 30, w - 60, h - 60, inner, (h - 60) / 2)); };
const crickets = (t, n = 3) => Array.from({ length: n }, (_, i) => G(tr(200 + i * 340, 1300 + (i % 2) * 60 + Math.abs(Math.sin(t * 8 + i)) * -14), ell(0, 0, 30, 14, '#5a8a3a', 4) + line(20, -6, 50, -30, 3) + line(14, -8, 40, -36, 3))).join('');
const rainCloud = (x, y, s, t) => G(tr(x, y, s), cloud(0, 0, 1, '#7d8a9c') + Array.from({ length: 6 }, (_, i) => { const k = (t * 1.6 + i / 6) % 1; return line(-70 + i * 28, 40 + k * 160, -76 + i * 28, 70 + k * 160, 6, 'rgba(160,200,255,.8)'); }).join(''));

// ============================================================
//  ÉPISODE « le pote de secours » : héros en GILET ORANGE de remplaçant (chasuble de foot + écusson croix de secours),
//  Kevin (rouquin, t-shirt vert), Thomas (le titulaire, lunettes noires, cheveux blonds), les potes.
// ============================================================
const HEROC = { age: 'kid', hair: 'short', hairColor: '#5a3a26', shirt: '#4d9de0', pants: '#3b4a6b', apron: '#ff8a1f', seed: 2 };
const crossBadge = (x, y, s = 1) => G(tr(x, y, s, -6), rect(-24, -24, 48, 48, '#fff', 10, 5) + rect(-7, -17, 14, 34, '#e2463a', 2, 0) + rect(-17, -7, 34, 14, '#e2463a', 2, 0));
function secHero(o, t) { const bob = (o.bob ?? 1) * wave(t, .8, 4, 2); return person(Object.assign({}, HEROC, o), t) + (o.badge === false ? '' : G(ptr(o), crossBadge(0, -128 + bob, .8))); }
const secHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), (o.vest === false ? '' : path(`M${-r * .9} ${r * 1.5}Q${-r * .9} ${r * .8} 0 ${r * .8}Q${r * .9} ${r * .8} ${r * .9} ${r * 1.5}Z`, '#ff8a1f', 6) + crossBadge(0, r * 1.15, r / 160)) + head(Object.assign({ hr: r }, HEROC, o), t));
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const THOMC = { age: 'kid', hair: 'side', hairColor: '#e8b23a', shirt: '#b56cff', pants: '#2b2b33', skin: '#f6d7b8', seed: 7 };
const thomas = (o, t) => person(Object.assign({}, THOMC, { expr: 'shadesGrin' }, o), t);
const thomasHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, THOMC, { expr: 'shadesGrin' }, o), t));
const POTES = [0, 3, 4, 1];
const pote = (i, o, t) => kid(POTES[i % 4], o, t);
const poteHead = (i, x, y, r, o, t) => { const j = POTES[i % 4]; return G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: KH[j], hairColor: KC[j], skin: SK[j], seed: 20 + j }, o), t)); };

// ---------- accessoires ----------
// écran d'appel entrant (coordonnées écran phoneBig : -150..150 × -295..295)
function callScreen(name, t, o = {}) { const ring = Math.sin(t * 18) * 6; return rect(-150, -295, 300, 590, o.bg || '#1d2350', 24, 0) + ftext(0, -210, o.top || 'appel entrant…', { size: 24, fill: 'rgba(255,255,255,.7)', stroke: 'none' }) +
  G(tr(0, -70, 1, ring), circ(0, 0, 82, '#fff', 5) + (o.avatar || kevinHead(0, 6, 62, { expr: 'joy' }, t))) + ftext(0, 70, name, { size: 46, fill: '#fff', stroke: 'none' }) +
  circ(-80, 200, 46, '#e2463a', 5) + path('M-104 204Q-80 186 -56 204', 'none', 9, '#fff') + G(tr(80, 200, 1 + .08 * Math.sin(t * 12)), circ(0, 0, 46, '#36c26a', 5) + path('M-20 -14Q-24 14 14 20', 'none', 9, '#fff')); }
// écran de discussion de groupe : msgs = [[texte, t0, moi?], …]
function chatScreen(title, msgs, t) { let s = rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + rect(-150, -295, 300, 70, '#4d9de0', 24, 0) + rect(-150, -250, 300, 25, '#4d9de0', 0, 0) + ftext(0, -248, title, { size: 26, fill: '#fff', stroke: 'none' });
  msgs.forEach(([str, t0, me], i) => { const k = popEl(t, t0, .35); if (k <= 0) return; const w = Math.min(260, str.length * 15 + 40), x = me ? 140 - w / 2 : -140 + w / 2, y = -170 + i * 78;
    s += G(tr(x, y, k), rect(-w / 2, -28, w, 56, me ? '#7fd3a0' : '#fff', 20, 4) + ftext(0, 9, str, { size: 24, fill: OL, stroke: 'none' })); }); return s; }
// fenêtre « Instagram » (story) : inner = svg dans -150..150 × -200..250
function igScreen(inner, t, o = {}) { let s = rect(-150, -295, 300, 590, '#fff', 24, 0) + ftext(-130, -248, 'Instagrom', { size: 28, fill: OL, stroke: 'none', anchor: 'start' }) + heart(110, -258, .32, '#ff5d73');
  for (let i = 0; i < 4; i++) s += circ(-105 + i * 70, -185, 26, 'none', 5, ['#ff6a1a', '#ff5c8a', '#b56cff', '#ffd23f'][i]) + circ(-105 + i * 70, -185, 19, DPAL[(i + 3) % 8], 0);
  s += clipR(-150, -150, 300, 360, inner, 0) + heart(-120, 240, .34, o.liked ? '#ff5d73' : '#fff') + ftext(40, 252, o.likes || '♥ 248', { size: 24, fill: OL, stroke: 'none' }); return s; }
// panneau de remplacement (foot) : OUT rouge / IN vert
function subBoard(x, y, s, t, outStr, inStr, k = 1) { const bl = Math.sin(t * 9) > -.3; return G(tr(x, y, s, wave(t, .7, 3)), rect(-30, 150, 60, 260, '#3a3f4a', 8, 6) + rect(-260, -170, 520, 330, '#141820', 26, 8) +
  ftext(-170, -80, 'OUT', { size: 36, fill: '#ff5c5c', stroke: 'none' }) + ftext(70, -60, outStr, { size: 76, fill: bl ? '#ff3b30' : '#a02020', stroke: 'none' }) + line(-230, 0, 230, 0, 4, '#2c3240') +
  ftext(-170, 90, 'IN', { size: 36, fill: '#5cff8a', stroke: 'none' }) + (k > 0 ? G(tr(70, 110, k), ftext(0, 0, inStr, { size: 76, fill: bl ? '#36ff7a' : '#209050', stroke: 'none' })) : '')); }
// boîtier d'urgence « BRISER LA VITRE »
function emergencyBox(x, y, s, inner, t, crack = 0) { let g = rect(-250, -330, 500, 640, '#e2463a', 26, 8) + rect(-210, -250, 420, 470, '#ffe9e0', 10, 5) + inner + rect(-210, -250, 420, 470, 'rgba(200,235,255,.28)', 10, 5) + line(-170, -200, -60, -240, 12, 'rgba(255,255,255,.75)') + line(-170, -150, -20, -230, 7, 'rgba(255,255,255,.55)');
  if (crack > 0) g += path('M0 -20L-60 -110L-150 -140M0 -20L70 -130L120 -240M0 -20L110 40L200 30M0 -20L-40 90L-130 180M0 -20L30 120', 'none', 6 * crack, '#fff');
  g += rect(-230, -320, 460, 62, '#fff8e0', 12, 5) + ftext(0, -277, 'POTE DE SECOURS', { size: 40, fill: '#e2463a', stroke: 'none' }) + rect(-230, 240, 460, 56, '#fff8e0', 12, 5) + ftext(0, 278, 'EN CAS D\'ANNULATION : BRISER LA VITRE', { size: 22, fill: '#e2463a', stroke: 'none' });
  g += path('M250 -100Q300 -60 290 20', 'none', 6, '#9aa3ad') + G(tr(290, 40, 1, wave(t, .8, 8)), rect(-12, 0, 24, 110, '#8a5a3a', 6, 4) + rect(-40, -16, 80, 36, '#9aa3ad', 8, 5));
  return G(tr(x, y, s), g); }
// grand bouton d'arcade
const bigBtn = (x, y, s, col, label, press = 0, t = 0) => G(tr(x, y, s), ell(0, 40, 170, 60, '#3a3f4a', 7) + rect(-170, -10, 340, 50, '#3a3f4a', 0, 0) + ell(0, -10, 170, 60, '#555c68', 7) + ell(0, -40 + press * 30, 130, 46, shade(col, -.25), 7) + rect(-130, -40 + press * 30, 260, 40 - press * 30, shade(col, -.25), 0, 0) + ell(0, -80 + press * 50, 130, 46, col, 7) + ell(-50, -96 + press * 50, 36, 12, 'rgba(255,255,255,.5)', 0) + (label ? ftext(0, 130, label, { size: 34, fill: '#fff' }) : ''));
// contrat papier
function contractDoc(x, y, s, t, r = 0) { let g = rect(-300, -400, 600, 800, '#fffdf4', 10, 7) + rect(-300, -400, 600, 110, '#ffe8c8', 10, 7) + ftext(0, -335, 'CONTRAT D\'AMITIÉ', { size: 42, fill: OL, stroke: 'none' }) + ftext(0, -300, '— CDD : 1 soirée —', { size: 26, fill: '#a0703f', stroke: 'none' });
  for (let i = 0; i < 9; i++) g += line(-240, -220 + i * 46, i % 3 === 2 ? 60 : 240, -220 + i * 46, 6, '#d8d0c0');
  g += ftext(-240, 250, 'Signé : Kevin', { size: 28, fill: OL, stroke: 'none', anchor: 'start' }) + path('M-60 300q30 -40 50 0t50 0t60 -20', 'none', 5, '#4d7cf0') + ftext(120, 250, 'Toi', { size: 28, fill: OL, stroke: 'none', anchor: 'start' }) + path('M120 300q20 -30 40 0t40 0', 'none', 5, '#4d7cf0');
  return G(tr(x, y, s, r), g); }
// cinéma (décor complet) : écran lumineux, rideaux, rangées de sièges, panneau SORTIE, spectateurs
function cinemaS(t, o = {}) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#2a1420', 0, 0); for (let x = -M; x < W + M; x += 70) s += rect(x, -M, 34, 1300 + M, 'rgba(255,255,255,.03)', 0, 0);
  const fl = .8 + .2 * Math.sin(t * 9) * Math.sin(t * 3.1);
  s += op(.25 * fl, path('M540 -200L-200 900L1280 900Z', '#bfe3ff', 0)) + rect(90, 160, 900, 470, '#141820', 14, 7) + rect(110, 180, 860, 430, mixC('#7fc8ff', '#ffe08a', .5 + .5 * Math.sin(t * 1.3)), 6, 0) + op(.5, path('M110 610L300 400L420 520L600 300L800 500L970 380L970 610Z', '#2f6fb0', 0)) + circ(800, 280, 50, '#fff6c8', 0);
  s += sCurtain(-60, 130, 200, 560, '#a8203a', t, 1) + sCurtain(940, 130, 200, 560, '#a8203a', t, -1) + rect(-M, 110, W + 2 * M, 50, '#7a1428', 0, 5);
  s += G(tr(980, 740), rect(-70, -30, 140, 60, '#1f8a4a', 8, 4) + ftext(0, 12, 'SORTIE', { size: 26, fill: '#fff', stroke: 'none' })) + G(tr(90, 740), rect(-16, -60, 32, 60, '#e2463a', 8, 4) + rect(-10, -76, 20, 20, '#3a3f4a', 4, 3));
  for (let i = 0; i < 6; i++) s += op(.6 + .4 * Math.sin(t * 2 + i), circ(100 + i * 176, 690, 8, '#ffd88a', 0));
  if (o.crowd !== false) for (let j = 0; j < 2; j++) for (let i = 0; i < 6; i++) s += op(.9, head({ hr: 46, hair: KH[(i + j) % 6], hairColor: '#1c1020', skin: '#4a2a3a', cheeks: false, face: { eyes: 'dot', mouth: 'flat' }, seed: 70 + i }, t).replace(/^/, `<g transform="translate(${80 + i * 184 + j * 90} ${830 + j * 120})">`) + '</g>');
  for (let j = 0; j < 3; j++) { const y = 900 + j * 150; for (let i = -1; i < 8; i++) { const x = -40 + i * 170 + (j % 2) * 85; s += rect(x - 72, y - 90, 144, 140, '#c8243e', 30, 6) + rect(x - 60, y + 20, 120, 60, '#a01c32', 14, 5); } }
  s += rect(-M, 1250, W + 2 * M, 1400, '#3a1a26', 0, 0) + line(-M, 1250, W + M, 1250, 6, '#1c0c14');
  for (let i = 0; i < 9; i++) s += circ((i * 137) % W, 1300 + (i * 71) % 400, 10, '#fff6c8', 3);
  return s; }
const popcornS = (x, y, s = 1, t = 0) => G(tr(x, y, s), path('M-60 -130L60 -130L44 0L-44 0Z', '#fff', 5) + [-36, -12, 12, 36].map((xx, i) => rect(xx - 7, -128, 14, 126, i % 2 ? '#e2463a' : '#fff', 0, 0)).join('') + path('M-60 -130L60 -130L44 0L-44 0Z', 'none', 5) + [[-40, -150], [-10, -170], [24, -156], [46, -138], [0, -146], [-30, -132]].map(([a, b], i) => circ(a, b + wave(t, 1.4, 3, i), 22, '#fff6c8', 4)).join(''));
const glasses3D = (x, y, s = 1) => G(tr(x, y, s), rect(-90, -26, 80, 52, 'rgba(255,60,60,.65)', 10, 5) + rect(10, -26, 80, 52, 'rgba(60,160,255,.65)', 10, 5) + line(-10, -6, 10, -6, 6));
// petite scène « ciné entre potes » (pour l'écran du téléphone) — coordonnées -150..150 × -150..210
function cinePic(t, o = {}) { let s = rect(-150, -150, 300, 360, '#2a1420', 0, 0) + rect(-130, -140, 260, 110, mixC('#7fc8ff', '#ffe08a', .5), 4, 0);
  const who = [['p', 0], ['k'], ['p', 1], ['th']]; who.forEach(([w, i], j) => { const x = -105 + j * 70, y = 40 + (j % 2) * 8;
    s += (w === 'k' ? kevinHead(x, y, 34, { expr: 'ecstatic' }, t) : w === 'th' ? thomasHead(x, y, 34, {}, t) : poteHead(i, x, y, 34, { expr: 'ecstatic' }, t)) + (w !== 'th' ? glasses3D(x, y - 2, .36) : ''); });
  for (let i = 0; i < 5; i++) s += rect(-150 + i * 64, 100, 54, 110, '#c8243e', 14, 4);
  return s + popcornS(-110, 140, .45, t) + popcornS(110, 150, .45, t + 1); }
// camembert du temps : part « TOI » minuscule
function pieTime(x, y, r, t, t0) { const k = eOutBack(seg(t, t0, t0 + .6)); if (k <= 0) return ''; const sl = [['BOULOT', .3, '#4d9de0'], ['THOMAS', .28, '#b56cff'], ['KEVIN', .4, '#5fb85f'], ['TOI', .02, '#ff6a1a']]; let a = -90, s = '';
  sl.forEach(([nm, f, c]) => { const a2 = a + f * 360, A = R(a), B_ = R(a2), lg = f > .5 ? 1 : 0; s += path(`M0 0L${f1(Math.cos(A) * r)} ${f1(Math.sin(A) * r)}A${r} ${r} 0 ${lg} 1 ${f1(Math.cos(B_) * r)} ${f1(Math.sin(B_) * r)}Z`, c, 6); const m = R((a + a2) / 2); if (f > .1) s += ftext(Math.cos(m) * r * .6, Math.sin(m) * r * .6 + 12, nm, { size: 34, fill: '#fff' }); a = a2; });
  return G(tr(x, y, k, (1 - k) * -40), s); }
const bigX = (x, y, s, t, t0) => cross(x, y, s, t, t0);
const tear = (x, y, t, sp = 1) => { const k = (t * sp) % 1; return op(1 - k, path(`M${x} ${y + k * 160}q-14 22 0 30q14 -8 0 -30Z`, '#7fd0ff', 4)); };
const zzz = (x, y, t) => [0, 1, 2].map(i => { const k = (t * .6 + i / 3) % 1; return op(1 - k, ftext(x + k * 60, y - k * 160, 'z', { size: 40 + k * 30, fill: '#fff' })); }).join('');
const qMark = (x, y, t, t0, s = 1) => { const k = popEl(t, t0, .4); return k <= 0 ? '' : G(tr(x, y, s * k, wave(t, 1.5, 8)), ftext(0, 30, '?', { size: 110, fill: SX.acc2 })); };
const ringWaves = (x, y, t) => [0, 1, 2].map(i => { const k = (t * 1.6 + i / 3) % 1; return op(1 - k, path(`M${x + 60 + k * 70} ${y - 40 - k * 30}q${30 + k * 20} ${40 + k * 30} 0 ${80 + k * 60}M${x - 60 - k * 70} ${y - 40 - k * 30}q${-30 - k * 20} ${40 + k * 30} 0 ${80 + k * 60}`, 'none', 7, SX.acc2)); }).join('');
const dustFight = (x, y, s, t) => { let g = ''; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28 + t * 2; g += circ(Math.cos(a) * 150 + wave(t, 3, 12, i), Math.sin(a) * 90 + wave(t, 3, 10, i + 2), 90 + 14 * Math.sin(t * 9 + i), '#f4ead8', 6); }
  g += circ(0, 0, 150, '#f4ead8', 0) + G(tr(-60, -40, 1, t * 400), path('M0 -40L10 -10L40 0L10 10L0 40L-10 10L-40 0L-10 -10Z', '#ffd23f', 4)) + G(tr(80, 30, 1, -t * 300), path('M0 -30L8 -8L30 0L8 8L0 30L-8 8L-30 0L-8 -8Z', '#fff', 4)) + ftext(-120 + wave(t, 4, 8), 120, 'POW', { size: 44, fill: '#e2463a' }) + ftext(120, -100 + wave(t, 4, 8, 1), '#!@', { size: 40, fill: OL, stroke: 'none' });
  return G(tr(x, y, s), g); };
const SEP = 'rgba(40,40,60,.35)';
// pièce de nuit, chambre du héros (lampe de chevet allumée)
const heroNight = (t) => bedroomN(t);
// ombre portée au sol
const shadowS = (x, y, w) => ell(x, y, w, w * .16, 'rgba(0,0,0,.18)', 0);

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, héros en gilet de remplaçant (cut-out), étoiles « débloqué », titre cinétique
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'pote') - .05; return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 980, t, K, { part: 'back', r: 480 }) + burst(CX, 1000, 300, t, .4, SX.acc, 16) +
    G(tr(CX, 1000, 1 + .03 * Math.sin(t * 6)), cutout(secHead(0, -30, 150, { expr: t > K ? 'worried' : 'neutral' }, t), 14)) + G(tr(CX + 300, 1040, 1, 10 + wave(t, 1, 4)), cutout(subBoardMini(t), 8)) +
    unlock(CX, 980, t, K, { part: 'front', r: 480 }) + kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'ÊTRE LE", CX, 415, t, .3, { size: 58 }) + kword('POTE DE SECOURS ?', CX, 540, t, K, { size: 70, fill: SX.acc2 }) + funBox(CX, 930, 360, 380, t, 1.2, { label: 'remplaçant.png' }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'pote') - .05, 'boom', .6], [at(1, 'pote'), 'sparkle', .6], [1.2, 'tick', .5], [at(1, 'secours'), 'whistle', .4]] });
function subBoardMini(t) { return G(tr(0, 0, .42), subBoard(0, 0, 1, t, '1', '2')); }
// B002 — VENDREDI 20H47 : papier + gobo, téléphone géant qui vibre (cut-out), horloge digitale
B(2, { enter: 'none', trans: 'wipe', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), shake: t > at(2, 'sonne') ? 4 : 0 }),
  draw: (t, d, T) => { const S = at(2, 'telephone') - .1, vib = t > S ? Math.sin(t * 60) * 6 : 0; return paper(SX.paper) + gobo(T, .12) + burst(CX, 960, 340, t, S, '#ffe1b8', 18) +
    G(tr(CX + vib, 930, 1, -6 + vib * .5), cutout(phoneBig(0, 0, .95, 0, callScreen('KEVIN', t, { avatar: t > S ? kevinHead(0, 6, 62, { expr: 'joy' }, t) : circ(0, 0, 60, '#9aa3ad', 0) })), 12)) + (t > S ? ringWaves(CX, 760, t) : '') +
    kthin('vendredi', CX, 360, t, .02, { size: 60, fill: SX.ink }) + G(tr(CX, 480, popEl(t, at(2, '20h') - .05, .4)), bigClockF(0, 0, '20:47', SX.acc, .9)) + funTag(CX + 250, 1130, 'BZZZ', t, at(2, 'sonne') - .05, { size: 46, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .5], [at(2, '20h') - .05, 'pop_hi', .6], [at(2, 'telephone') - .1, 'vibrate', .8], [at(2, 'sonne'), 'ring', .6], [at(2, 'sonne') + .05, 'pop', .5]] });
// B003 — Kevin t'invite à une soirée : grille colorée, bulle de discussion « SOIRÉE CHEZ MOI », Kevin en cut-out
B(3, { enter: 'none', trans: 'up', transD: .25, cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => gridBg('#2a2440') + halftoneFade(SX.acc, .08, 1) + G(tr(330, 1000), cutout(kevinHead(0, 0, 160, { expr: 'joy', look: [1, 0] }, t), 12)) + popStars(330, 900, t, at(3, 'kevin'), 6, 220) +
    G(tr(740, 760, 1, wave(t, 1, 3)), cutout(phoneBig(0, 0, .7, 0, chatScreen('Kevin 🎉', [['yo !', .1], ['soirée chez moi', at(3, 'invite') - .05], ['ce soir 21h 🎶', at(3, 'soiree') - .1]], t)), 10)) +
    funTag(330, 760, 'KEVIN', t, at(3, 'kevin'), { size: 48, bg: '#5fb85f' }) + kword('SOIRÉE !', CX, 420, t, at(3, 'soiree') - .05, { size: 100, fill: SX.acc2 }),
  sfx: [[at(3, 'kevin'), 'pop', .6], [at(3, 'invite') - .05, 'pop_hi', .6], [at(3, 'soiree') - .1, 'pop_hi', .6], [at(3, 'soiree') - .05, 'boom', .5]] });
// B004 — INCROYABLE ! : vraie chambre, le héros saute de joie au plafond, confettis
B(4, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.06, shake: t < .25 ? 6 : 0, cy: 900 }),
  draw: (t, d, T) => { const j = Math.abs(Math.sin(t * 7)) * 110; return chambreH(t) + shadowS(CX, 1510, 160) + secHero({ x: CX, y: 1500 - j, s: 1.4, expr: 'ecstatic', armL: [210, 250], armR: [-30, -70], legL: [120, 100], legR: [60, 80] }, t) + confetti(t, 0, 40) +
    kword('INCROYABLE !', CX, 430, t, .02, { size: 96, fill: SX.acc2 }) + popStars(CX, 900, t, .1, 8, 340); },
  sfx: [[0, 'flash_hit', .6], [.02, 'tada', .7], [.15, 'boing', .6], [.4, 'boing', .5]] });
// B005 — préparation : salle de bain, coiffure, parfum en nuage toxique (×12), puis il file
B(5, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const P = at(5, 'parfum') - .1, A = at(5, 'arrives'), k = seg(t, P, P + .8); let fog = ''; for (let i = 0; i < 7; i++) fog += op(.55 * k, cloud(CX + Math.cos(i * 2.1 + t) * 260 * k, 820 + Math.sin(i * 1.7 + t) * 160 * k, .9 + .5 * k, '#e9d4ff'));
    const away = eOutCubic(seg(t, A - .1, A + .2)) * 900;
    return bathroomT(t) + secHero({ x: CX - 60 + away, y: 1500, s: 1.4, expr: t > P ? 'smugger' : 'cool', armR: t > P ? [-20, -50] : [-30, -70], holdR: t > P ? G(tr(0, 0, .9), rect(-24, -60, 48, 80, '#b56cff', 12, 5) + rect(-10, -80, 20, 22, '#ffd23f', 4, 4)) : rect(-8, -60, 16, 70, '#3a3f4a', 4, 4), walk: away > 0 ? 3 : 0 }, t) + fog +
      (t > P && t < P + .9 ? Array.from({ length: 5 }, (_, i) => circ(CX + 60 + i * 30 + away, 880 - i * 20, 6 + i * 2, 'rgba(230,200,255,.8)', 0)).join('') : '') +
      funTag(CX - 230, 450, 'COIFFÉ', t, at(5, 'prepares') - .1, { size: 46, bg: SX.cool }) + funTag(CX + 200, 520, 'PARFUM ×12', t, P + .05, { size: 50, bg: '#b56cff' }) + (away > 0 ? motionLines(CX - 300 + away, 1100, 3, 90, 0) : ''); },
  sfx: [[at(5, 'prepares'), 'squeak', .5], [at(5, 'parfum') - .1, 'spray', .9], [at(5, 'parfum') + .25, 'spray', .7], [at(5, 'arrives') - .1, 'whoosh', .7], [at(5, 'arrives') + .1, 'steps', .5]] });
// B006 — Et Kevin te lance… : la soirée, Kevin t'accueille, ralenti suspendu
B(6, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.4, svg: partyT(t), haze: .1 }, { z: 1, svg: secHero({ x: 280, y: 1500, s: 1.35, expr: 'joy', armR: [-40, -80] }, t) + kevin({ x: 790, y: 1500, s: 1.35, expr: 'smug', flip: 1, armL: [200, 230] }, t) }, { z: .6, svg: blur(10, sBalloon(980, 1500, '#ff5c8a', t, 0, 1.6)) }]) +
    kthin('et Kevin te lance…', CX, 420, t, at(6, 'kevin'), { size: 60 }) + funTag(790, 620, '…', t, at(6, 'lance'), { size: 60, bg: '#fff', fg: SX.ink }),
  sfx: [[0, 'drum', .5], [at(6, 'kevin'), 'pop', .5], [at(6, 'lance'), 'hmm', .5]] });
// B007 — « Heureusement que t'es venu ! » : gros câlin de Kevin, cœurs
B(7, { enter: 'punch', cam: zin(1.04, 1.12, .4),
  draw: (t, d, T) => partyT(t, { dancers: false }) + WASH('rgba(30,10,50,.25)') + kevin({ x: 600, y: 1500, s: 1.4, expr: 'ecstatic', flip: 1, armL: [170, 190], armR: [10, -10] }, t) + secHero({ x: 420, y: 1500, s: 1.35, expr: 'happy', rot: -6 }, t) + heartsUp(t, 520, 900) +
    funTag(CX, 430, 'HEUREUSEMENT !', t, at(7, 'heureusement') - .05, { size: 58, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'pop', .6], [at(7, 'heureusement'), 'kiss', .5], [at(7, 'venu'), 'sparkle', .5]] });
// B008 — « Thomas s'est désisté ! » : panneau de remplacement OUT Thomas / IN toi
B(8, { enter: 'crash', flash: 1, cam: () => ({ z: 1.05, shake: 3 }),
  draw: (t, d, T) => { const D = at(8, 'desiste') - .1; return partyT(t, { dancers: false }) + WASH('rgba(30,10,50,.3)') + kevin({ x: 860, y: 1520, s: 1.3, expr: 'joy', flip: 1, armL: [200, 160] }, t) + subBoard(520, 800, 1, t, 'THOMAS', 'TOI', eOutBack(seg(t, D, D + .3))) +
    G(tr(330, 520), funTag(0, 0, 'REMPLACEMENT', t, .05, { size: 40, bg: SX.acc })); },
  sfx: [[0, 'whistle', .9], [.1, 'flash_hit', .5], [at(8, 'desiste') - .1, 'error_beep', .5], [at(8, 'desiste') + .1, 'ding', .6]] });
// B009a — « Attends, je suis littéralement le REMPLAÇANT… » : gros plan, mâchoire au sol
B(9, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.18, eInOut(clamp(t / d))), hand: .5 }),
  draw: (t, d, T) => { const R_ = at(9, 'remplacant') - .05; return partyT(t) + WASH('rgba(30,10,50,.35)') + secHead(CX, 880, 220, { expr: t > R_ ? 'jawdrop' : 'confused' }, t) + (t > R_ ? sweatSpray(CX, 760, t) : '') +
    kthin('attends… je suis littéralement le', CX, 380, t, at(9, 'attends'), { size: 44 }) + kword('REMPLAÇANT', CX, 500, t, R_, { size: 100, fill: SX.acc2 }); },
  sfx: [[at(9, 'attends'), 'scratch', .6], [at(9, 'litteralement'), 'hmm', .4], [at(9, 'remplacant') - .05, 'boom', .6], [at(9, 'remplacant') + .3, 'gasp', .5]] });
// B009b — « …d'un mec qui s'appelle… THOMAS ? » : fiche de Thomas (carte), lunettes noires, le héros pâlit
const O9 = at(9, 'mec') - .15;
B(9, { enter: 'none', trans: 'zoom', transD: .2, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const TH = at(9, 'thomas') - O9 - .05; return paper('#ffe9c9') + gobo(T, .1) + card(CX, 860, 520, 600, rect(-260, -300, 520, 600, '#d7c9ff', 0, 0) + thomasHead(0, -20, 160, {}, t) + ftext(0, 240, 'THOMAS', { size: 64, fill: OL, stroke: 'none' }), t, 0, { ry: lerp(25, 0, seg(t, 0, .4)), bg: '#fff' }) +
    funBox(CX, 860, 560, 640, t, TH, { label: 'titulaire.png', col: SX.acc }) + G(tr(170, 1130), secHead(0, 0, 90, { expr: 'dizzy' }, t)) + qMark(900, 520, t, TH, 1) + kword('THOMAS ?', CX, 410, t, TH, { size: 78, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .5], [.15, 'tick', .5], [at(9, 'thomas') - O9 - .05, 'boing', .7], [at(9, 'thomas') - O9 + .1, 'rimshot', .4]] }, O9);
// B010 — « Bienvenue dans la vie du pote de secours » : le héros rangé dans un boîtier d'urgence (étoiles débloqué)
B(10, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const S = at(10, 'secours') - .1; return entree(t) + WASH('rgba(255,255,255,.45)') + unlock(CX, 880, t, S, { part: 'back', r: 460 }) + emergencyBox(CX, 900, 1.05, G(tr(0, 0), secHero({ x: 0, y: 200, s: .78, expr: 'deadpan', badge: true }, t)), t) +
    unlock(CX, 880, t, S, { part: 'front', r: 460 }) + kthin('bienvenue dans la vie du', CX, 380, t, at(10, 'bienvenue'), { size: 52, fill: SX.ink }); },
  sfx: [[at(10, 'bienvenue'), 'magic', .5], [at(10, 'vie'), 'pop_hi', .4], [at(10, 'secours') - .1, 'siren', .5], [at(10, 'secours'), 'sparkle', .6]] });
// B011 — jamais le premier invité : liste d'invités de Kevin, ton nom tout en bas (n°12)
B(11, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), cy: 860 }),
  draw: (t, d, T) => { const P = at(11, 'premier'); let list = rect(-260, -380, 520, 760, '#fffdf4', 16, 7) + rect(-260, -380, 520, 90, '#5fb85f', 16, 7) + ftext(0, -320, 'INVITÉS', { size: 46, fill: '#fff', stroke: 'none' });
    const names = ['1. Thomas', '2. Léa', '3. Sam', '4. Inès', '5. Max', '6. Nour', '7. Le chat'];
    names.forEach((nm, i) => { list += ftext(-200, -230 + i * 64, nm, { size: 36, fill: OL, stroke: 'none', anchor: 'start' }) + path(`M140 ${-244 + i * 64}l14 14l26 -28`, 'none', 7, '#36a85a'); });
    list += ftext(-200, 300, '12. toi', { size: 36, fill: SX.acc, stroke: 'none', anchor: 'start' }) + ftext(70, 300, '(si besoin)', { size: 26, fill: '#a0703f', stroke: 'none', anchor: 'start' });
    return salonF(t) + G(tr(CX + 40, 860, 1, -3), list) + kevin({ x: 140, y: 1560, s: 1.2, expr: 'smug', armR: [-40, -60] }, t) + markerCircle(CX - 30, 1150, 210, 50, t, P, { col: SX.acc }) + G(tr(880, 1110), secHead(0, 0, 80, { expr: 'sad' }, t)) + funTag(CX, 400, 'JAMAIS 1er', t, P - .05, { size: 54, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .5], [at(11, 'jamais'), 'pop', .6], [at(11, 'premier'), 'scratch', .5], [at(11, 'invite'), 'error_beep', .4]] });
// B012 — celui qu'on appelle quand quelqu'un annule : Kevin écrase le gros bouton rouge « POTE DE SECOURS »
B(12, { enter: 'punch', cam: (t, d) => ({ z: 1.05, shake: t > at(12, 'appelle') && t < at(12, 'appelle') + .3 ? 8 : 0 }),
  draw: (t, d, T) => { const A = at(12, 'appelle'), pr = seg(t, A - .1, A) * (1 - seg(t, A + .25, A + .45)), N = at(12, 'annule') - .1; return salonF(t, { night: 1 }) + WASH('rgba(20,20,50,.2)') +
    kevin({ x: 330, y: 1500, s: 1.35, expr: t > A ? 'ecstatic' : 'effort', armR: [-30 + pr * 40, -20 + pr * 40] }, t) + bigBtn(720, 1100, 1, '#e2463a', 'APPEL SECOURS', pr, t) + (t > A ? impactStar(720, 980, .8 * (1 - seg(t, A, A + .4))) : '') +
    G(tr(780, 600), phoneBig(0, 0, .55, 8, rect(-150, -295, 300, 590, '#fff', 24, 0) + ftext(0, -120, 'Thomas', { size: 40, fill: OL, stroke: 'none' }) + ftext(0, -60, 'a annulé', { size: 34, fill: OL, stroke: 'none' }) + (t > N ? cross(0, 100, .9, t, N) : ''))) +
    kthin('celui qu\'on appelle quand', CX, 380, t, at(12, 'celui'), { size: 50 }) + funTag(300, 520, 'ANNULÉ', t, N, { size: 54, bg: '#e2463a' }); },
  sfx: [[at(12, 'celui'), 'pop_hi', .4], [at(12, 'appelle') - .05, 'thud', .8], [at(12, 'appelle'), 'siren', .5], [at(12, 'annule') - .1, 'error_beep', .6]] });
// B013 — sortie : le lendemain matin au lit, tu découvres les photos (polaroids qui pleuvent)
B(13, { enter: 'drop', cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const Ph = at(13, 'photos') - .1, L = at(13, 'lendemain') - .05; const fun = (i) => rect(-92, -102, 184, 176, ['#ffb36b', '#9fe0ff', '#ffd1e8'][i], 0, 0) + poteHead(i, -40, 0, 34, { expr: 'ecstatic' }, t) + kevinHead(30, 10, 34, { expr: 'ecstatic' }, t) + ftext(0, 60, ['BOWLING', 'KARAOKÉ', 'PIZZA'][i], { size: 22, fill: OL, stroke: 'none' });
    return chambreH(t) + G(tr(CX, 1480), rect(-360, -130, 720, 140, '#b98552', 14, 6) + path('M-340 -150Q0 -200 340 -150L340 -60L-340 -60Z', '#5b8fd8', 6)) + secHero({ x: CX, y: 1420, s: 1.25, expr: t > Ph + .3 ? 'sob' : 'sleep', armR: [-20, -50], holdR: phone(0, 0, .5, 0, '') }, t) +
      polaroid(250, 650, 1.05, -10, fun(0), t, Ph) + polaroid(CX, 590, 1.05, 4, fun(1), t, Ph + .2) + polaroid(830, 660, 1.05, 12, fun(2), t, Ph + .4) + (t > Ph + .3 ? tear(CX - 60, 960, t) + tear(CX + 60, 960, t + .5) : '') +
      funTag(CX, 400, 'LE LENDEMAIN', t, L, { size: 52, bg: SX.cool }); },
  sfx: [[at(13, 'sortie'), 'pop', .4], [at(13, 'photos') - .1, 'shutter', .7], [at(13, 'photos') + .1, 'pop_hi', .5], [at(13, 'photos') + .3, 'pop_hi', .5], [at(13, 'lendemain'), 'sting', .4]] });
// B014 — Quand ils organisent un voyage… : la voiture chargée, valises, carte d'embarquement
B(14, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const V = at(14, 'voyage') - .1; return houseExt(t, { car: false }) + sCar(560, 1560, 1.2, '#ffd23f', 1) + G(tr(560, 1300), rect(-170, -60, 120, 70, '#e2463a', 10, 5) + rect(-40, -80, 140, 90, '#4d9de0', 10, 5) + rect(110, -50, 90, 60, '#36a85a', 10, 5)) +
    pote(0, { x: 180, y: 1500, s: 1.15, expr: 'ecstatic', armL: [200, 240] }, t) + kevin({ x: 930, y: 1500, s: 1.15, expr: 'ecstatic', flip: 1, armL: [200, 250] }, t) + invite('boarding', CX, 640, .95, t, V, -4) + kthin('quand ils organisent un', CX, 380, t, at(14, 'organisent') - .1, { size: 52 }); },
  sfx: [[0, 'whoosh', .5], [at(14, 'organisent'), 'chirp', .4], [at(14, 'voyage') - .1, 'pop', .7], [at(14, 'voyage') + .2, 'tada', .4]] });
// B015 — « Ah mince ! » : Kevin, faux désolé, main sur la bouche
B(15, { enter: 'punch', cam: zin(1.06, 1.14, .5),
  draw: (t, d, T) => houseExt(t) + WASH('rgba(255,255,255,.2)') + kevinHead(CX, 880, 230, { expr: 'embarrassed', look: [.5, -.3] }, t) + G(tr(CX + 40, 1060, 1, -10), rect(-60, -40, 120, 80, SKIN, 34, 6)) + funTag(CX, 450, 'AH MINCE !', t, .02, { size: 70, bg: '#fff', fg: SX.ink }) + sparkle(CX + 260, 700, .5 + .2 * Math.sin(t * 9), '#fff'),
  sfx: [[0, 'pop', .6], [at(15, 'mince'), 'hmm', .5], [.4, 'squeak', .3]] });
// B016 — « On pensait que t'étais pas disponible » : ton agenda… complètement vide (grillons)
B(16, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Dp = at(16, 'disponible') - .1; let ag = rect(-300, -300, 600, 600, '#fff', 16, 7) + rect(-300, -300, 600, 80, SX.cool, 16, 7) + ftext(0, -246, 'TON AGENDA', { size: 40, fill: '#fff', stroke: 'none' });
    for (let j = 0; j < 4; j++) for (let i = 0; i < 7; i++) ag += rect(-280 + i * 80, -200 + j * 120, 72, 110, '#f4f6fa', 6, 3);
    return houseExt(t) + WASH('rgba(255,255,255,.25)') + G(tr(CX, 830, 1, 2), ag) + crickets(t, 3) + kevin({ x: 900, y: 1560, s: 1.15, expr: 'smug', flip: 1, armL: [150, 220], armR: [30, -40] }, t) +
      markerText('dispo : 100 %', CX - 40, 1180, t, Dp, { size: 56, col: SX.acc2 }) + kthin('« on pensait que t\'étais pas dispo »', CX, 380, t, at(16, 'pensait') - .1, { size: 42 }); },
  sfx: [[at(16, 'pensait'), 'pop_hi', .4], [at(16, 'disponible') - .1, 'scratch', .5], [at(16, 'disponible') + .2, 'crickets', .6]] });
// B017 — « Personne ne m'a demandé ! » : rage, vapeur, rue qui tremble
B(17, { enter: 'crash', flash: 1, cam: () => ({ z: 1.08, shake: 9, r: -4 }),
  draw: (t, d, T) => streetT(t) + rays(t, CX, 900, 'rgba(255,90,40,.25)', 'rgba(255,255,255,0)', 18) + secHero({ x: CX, y: 1500, s: 1.45, expr: 'rage', armL: [230, 260], armR: [-50, -80], tremble: 1 }, t) + steam(CX - 150, 820, t, 1.2) + steam(CX + 150, 820, t + .3, 1.2) +
    kword('PERSONNE !', CX, 440, t, at(17, 'personne') - .05, { size: 104, fill: SX.acc2 }) + funTag(CX, 580, 'm\'a demandé', t, at(17, 'demande') - .1, { size: 44, bg: '#e2463a' }),
  sfx: [[0, 'flash_hit', .6], [at(17, 'personne') - .05, 'boom', .7], [.2, 'growl', .4], [at(17, 'demande'), 'sizzle', .5]] });
// B018a — « Mais dès que Kevin se dispute avec son meilleur pote… » : nuage de bagarre cartoon dans le salon
B(18, { enter: 'whip', cam: camHand(1.05, .8),
  draw: (t, d, T) => { const D = at(18, 'dispute') - .1, k = seg(t, D, D + .2); return salonF(t) + (k > 0 ? dustFight(CX, 980, 1.2 * eOutBack(k), t) + G(tr(CX - 210, 840), kevinHead(0, 0, 80, { expr: 'rage' }, t)) + G(tr(CX + 210, 820), poteHead(0, 0, 0, 80, { expr: 'rage' }, t)) :
      kevin({ x: 330, y: 1500, s: 1.3, expr: 'angry' }, t) + pote(0, { x: 750, y: 1500, s: 1.3, expr: 'angry', flip: 1 }, t)) + funTag(CX, 430, 'CLASH', t, D, { size: 64, bg: '#e2463a' }) + kthin('avec son meilleur pote', CX, 560, t, at(18, 'meilleur') - .1, { size: 46 }); },
  sfx: [[at(18, 'kevin'), 'pop', .4], [at(18, 'dispute') - .1, 'boom', .6], [at(18, 'dispute') + .2, 'hammer', .5], [at(18, 'meilleur'), 'crack', .5]] });
// B018b — « devine qui devient son confident » : projecteur sur le héros, cadre « confident.exe »
const O18 = at(18, 'devine') - .15;
B(18, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => { const C = at(18, 'confident') - O18 - .05; return rect(-M, -M, W + 2 * M, H + 2 * M, '#1d1a2e', 0, 0) + op(.35, path('M540 -100L240 1300L840 1300Z', '#fff6c8', 0)) + ell(CX, 1500, 300, 50, 'rgba(255,246,200,.35)', 0) +
    secHero({ x: CX, y: 1500, s: 1.4, expr: 'worried', look: [0, -1] }, t) + qMark(250, 640, t, .05, .9) + qMark(830, 600, t, .2, .8) + funBox(CX, 980, 340, 380, t, C, { label: 'confident.exe' }) + kword('CONFIDENT', CX, 440, t, C, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [.05, 'pop_hi', .4], [at(18, 'confident') - O18 - .05, 'sting', .6], [at(18, 'confident') - O18 + .2, 'tick', .5]] }, O18);
// B019 — « Toi. 2h au téléphone. » : nuit, téléphone collé à l'oreille, horloge qui file, compteur 2:00
B(19, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const H2 = at(19, '2h') - .1, mins = Math.floor(counter(0, 120, t, H2, .9)); return bedroomN(t) + secHero({ x: 380, y: 1500, s: 1.35, expr: 'sleep', armR: [-40, -110], headTilt: 8 }, t) + phone(525, 1090, .5, 15, '') + zzz(560, 760, t) +
    G(tr(800, 520), rect(-190, -80, 380, 160, '#2b2b33', 30) + ftext(0, 32, `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}:00`, { size: 76, fill: SX.acc, stroke: 'none' })) + funTag(250, 470, 'TOI.', t, at(19, 'toi') - .05, { size: 64, bg: SX.acc2, fg: SX.ink }) + wallClock(820, 760, 70, t, 12); },
  sfx: [[at(19, 'toi') - .05, 'pop', .6], [at(19, '2h') - .1, 'clock_fast', .6], [at(19, 'telephone'), 'vibrate', .4]] });
// B020 — écouter, conseiller, remonter le moral : le héros psy, Kevin en larmes sur le divan, jauge de moral qui remonte
B(20, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const E = at(20, 'ecoutes') - .05, C = at(20, 'conseilles') - .05, Rm = at(20, 'remontes') - .05, lv = .1 + .3 * seg(t, E, E + .3) + .25 * seg(t, C, C + .3) + .3 * seg(t, Rm, Rm + .4);
    return salonF(t, { noSofa: 1 }) + sofa(720, 1400, 1.0, '#5ec4a0') + kevin({ x: 760, y: 1330, s: 1.15, expr: lv > .8 ? 'joy' : 'sob', rot: -70, flip: 1 }, t) + (lv < .8 ? tear(640, 1080, t) + tear(660, 1080, t + .4) : '') +
      secHero({ x: 220, y: 1520, s: 1.3, expr: 'calm', glasses: true, armR: [-10, -40], holdR: rect(-40, -50, 80, 100, '#fff', 6, 5) }, t) +
      funTag(220, 460, 'J\'ÉCOUTE', t, E, { size: 40, bg: SX.cool, r: -6 }) + funTag(CX, 540, 'JE CONSEILLE', t, C, { size: 40, bg: '#b56cff', r: 3 }) + funTag(840, 460, 'MORAL ↑', t, Rm, { size: 40, bg: SX.acc, r: -3 }) +
      G(tr(940, 760), rect(-36, -200, 72, 400, '#fff', 30, 6) + rect(-24, 188 - 376 * lv, 48, 376 * lv, lv > .7 ? '#36c26a' : lv > .4 ? '#ffd23f' : '#e2463a', 20, 0) + rect(-36, -200, 72, 400, 'none', 30, 6)); },
  sfx: [[at(20, 'ecoutes') - .05, 'pop_hi', .5], [at(20, 'conseilles') - .05, 'pop_hi', .5], [at(20, 'remontes') - .05, 'whoosh_up', .6], [at(20, 'moral'), 'ding', .6]] });
// B021a — « Le lendemain, ils se réconcilient » : câlin Kevin + meilleur pote au parc, cœurs
B(21, { enter: 'none', trans: 'wipe', transD: .25, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => parkA(t) + kevin({ x: 470, y: 1500, s: 1.35, expr: 'ecstatic', armR: [10, -10] }, t) + pote(0, { x: 640, y: 1500, s: 1.35, expr: 'ecstatic', flip: 1, armR: [10, -10] }, t) + heartsUp(t, 560, 980, 6) + G(tr(950, 1140), secHead(0, 0, 70, { expr: 'smug' }, t)) +
    funTag(CX, 430, 'RÉCONCILIÉS', t, at(21, 'reconcil') - .1, { size: 58, bg: '#ff8fb1' }),
  sfx: [[at(21, 'lendemain'), 'chirp', .4], [at(21, 'reconcil') - .1, 'kiss', .6], [at(21, 'reconcil') + .2, 'sparkle', .5]] });
// B021b — « et Kevin disparaît » : pouf ! nuage, il ne reste que ses chaussures ; le héros seul
const O21 = at(21, 'kevin') - .15;
B(21, { enter: 'punch', cam: (t, d) => ({ z: 1.06, shake: t > .25 && t < .45 ? 5 : 0 }),
  draw: (t, d, T) => { const P = at(21, 'disparait') - O21 - .1, k = seg(t, P, P + .5); return parkA(t) + (k < .3 ? kevin({ x: 700, y: 1500, s: 1.35, expr: 'happy', flip: 1, walk: 3 }, t) : sShoes(700, 1500, .8, '#2b2b2b')) +
    (k > 0 && k < 1 ? op(1 - k, cloud(700, 1150, 1.6 + k, '#fff') + cloud(640, 1000, 1.2 + k, '#fff')) : '') + secHero({ x: 300, y: 1500, s: 1.35, expr: k > .3 ? 'jawdrop' : 'happy', armR: [-60, -90] }, t) + funTag(700, 800, 'POUF', t, P, { size: 60, bg: '#fff', fg: SX.ink }) + kthin('…et Kevin disparaît', CX, 420, t, 0, { size: 56 }); },
  sfx: [[0, 'pop', .4], [at(21, 'disparait') - O21 - .1, 'magic', .7], [at(21, 'disparait') - O21, 'pop_hi', .6], [at(21, 'disparait') - O21 + .3, 'crickets', .4]] }, O21);
// B022 — FÉLICITATIONS ! : plateau de jeu télé ironique, confettis, trophée en carton
B(22, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 4 }),
  draw: (t, d, T) => rays(t, CX, 900, '#ffe9a6', '#ffd76b', 24) + confetti(t, 0, 50) + secHero({ x: CX, y: 1500, s: 1.4, expr: 'deadpan', armR: [-20, -80], holdR: sTrophy(0, 0, 1.3) }, t) + kword('FÉLICITATIONS !', CX, 450, t, .02, { size: 86, fill: '#fff' }) + popStars(CX, 700, t, .1, 8, 360),
  sfx: [[0, 'tada', .8], [.02, 'flash_hit', .5], [.2, 'jackpot', .4]] });
// B023 — « Ton contrat d'amitié temporaire vient d'expirer » : contrat papier, tampon EXPIRÉ
B(23, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d), hand: .2 }),
  draw: (t, d, T) => { const X = at(23, 'expirer') - .05; return paper(SX.paper) + gobo(T, .1) + G(tr(0, 0), contractDoc(CX, 900, .95, t, -3)) + markerCircle(CX, 640, 230, 50, t, at(23, 'temporaire') - .1, { col: SX.acc }) + stamp(CX, 960, 'EXPIRÉ', t, X, '#e2463a', -14, 110) +
    kthin('ton contrat d\'amitié', CX, 370, t, at(23, 'contrat') - .1, { size: 54, fill: SX.ink }) + (t > X ? cutout(secHead(880, 1200, 70, { expr: 'sob' }, t), 8) : ''); },
  sfx: [[at(23, 'contrat'), 'printer', .4], [at(23, 'temporaire') - .1, 'scratch', .5], [at(23, 'expirer') - .05, 'thud', .9], [at(23, 'expirer') + .1, 'error_beep', .4]] });
// B024 — Un samedi, tu proposes un cinéma : salon, groupe de discussion, pop-corn prêt
B(24, { enter: 'whip', cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => salonF(t) + secHero({ x: 290, y: 1500, s: 1.35, expr: 'joy', armR: [-10, -40], holdR: popcornS(0, 0, .6, t) }, t) + G(tr(760, 820, 1, 4), phoneBig(0, 0, .85, 0, chatScreen('Les potes', [['ciné ce soir ? 🍿', at(24, 'proposes') - .1, 1]], t))) +
    G(tr(CX, 420), calPage(0, 0, .8, 'SAMEDI', SX.cool, -4)) + sparkle(260, 900, .5, '#fff'),
  sfx: [[at(24, 'samedi'), 'pop', .5], [at(24, 'proposes') - .1, 'pop_hi', .6], [at(24, 'cinema'), 'ding', .5]] });
// B025 — tout le monde est occupé, tu restes chez toi : réponses « occupé » en rafale, pluie à la fenêtre
B(25, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.04, 1.0, t / d) }),
  draw: (t, d, T) => { const O = at(25, 'occupe') - .3, R_ = at(25, 'restes'); return salonF(t) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, '#3a4a6a', 0, 0)) + G(tr(860, 480), rainCloud(0, 0, .8, t)) +
    secHero({ x: 290, y: 1500, s: 1.35, expr: t > R_ ? 'sad' : 'worried', armR: [-10, -40], holdR: popcornS(0, 0, .6, t) }, t) +
    G(tr(760, 820, 1, 4), phoneBig(0, 0, .85, 0, chatScreen('Les potes', [['ciné ce soir ? 🍿', -1, 1], ['occupé', O], ['dsl pas dispo', O + .15], ['jpp ce soir', O + .3], ['occupééé', O + .45]], t))) +
    stamp(CX, 450, 'OCCUPÉS', t, at(25, 'occupe') - .05, '#e2463a', -8, 80) + funTag(290, 640, 'CHEZ TOI', t, R_, { size: 44, bg: SX.cool }); },
  sfx: [[at(25, 'occupe') - .3, 'pop_hi', .5], [at(25, 'occupe') - .15, 'pop_hi', .5], [at(25, 'occupe') - .05, 'thud', .7], [at(25, 'restes'), 'thunder', .4]] });
// B026 — Tu ouvres Instagram : insert main + téléphone, l'appli s'ouvre (POV)
B(26, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.12, eOutCubic(clamp(t / d))) }),
  draw: (t, d, T) => { const I = at(26, 'instagram') - .1, k = eOutBack(seg(t, I, I + .3)); return blur(12, salonF(t)) + op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#1d2350', 0, 0)) +
    G(tr(CX, 900), phoneBig(0, 0, 1.25, 0, rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + G(tr(0, -20, k), rect(-80, -80, 160, 160, '#ff5c8a', 40, 6) + circ(0, 0, 40, 'none', 9, '#fff') + circ(48, -48, 9, '#fff', 0)))) + G(tr(CX + 40, 1270), rect(-46, -160, 92, 200, SKIN, 40, 6)) + funTag(CX, 400, 'INSTAGROM', t, I, { size: 50, bg: '#ff5c8a' }); },
  sfx: [[0, 'whoosh', .5], [at(26, 'instagram') - .1, 'pop_hi', .7], [at(26, 'instagram') + .1, 'magic', .4]] });
// B027 — Ils sont tous au cinéma : la story — les potes au ciné en lunettes 3D
B(27, { enter: 'none', trans: 'zoom', transD: .2, cam: zin(1.02, 1.08, .2),
  draw: (t, d, T) => blur(12, salonF(t)) + op(.4, rect(-M, -M, W + 2 * M, H + 2 * M, '#1d2350', 0, 0)) + G(tr(CX, 880), phoneBig(0, 0, 1.25, 0, igScreen(cinePic(t), t, { likes: '♥ 1 024' }))) +
    kthin('ils sont', CX - 160, 400, t, at(27, 'tous') - .2, { size: 54 }) + kword('TOUS', CX + 130, 400, t, at(27, 'tous') - .05, { size: 92, fill: SX.acc2 }) + funTag(CX, 1180, 'AU CINÉ', t, at(27, 'cinema') - .1, { size: 46, bg: '#e2463a' }),
  sfx: [[0, 'whoosh', .4], [at(27, 'tous') - .05, 'boom', .5], [at(27, 'cinema') - .1, 'pop', .6]] });
// B028 — Avec Kevin : zoom dans la story, entouré au marqueur
B(28, { enter: 'none', cam: () => ({ z: 1.0 }),
  draw: (t, d, T) => { const z = lerp(1.25, 2.1, eOutCubic(seg(t, 0, .4))); return blur(12, salonF(t)) + op(.4, rect(-M, -M, W + 2 * M, H + 2 * M, '#1d2350', 0, 0)) + G(`translate(${f1(CX + (z - 1.25) * 110)} ${f1(880 - (z - 1.25) * 60)})`, phoneBig(0, 0, z, 0, igScreen(cinePic(t), t))) +
    markerCircle(CX + 20, 820, 160, 150, t, at(28, 'kevin') - .05, { col: SX.acc }) + funTag(CX, 420, 'AVEC KEVIN', t, at(28, 'kevin') - .05, { size: 58, bg: '#5fb85f' }); },
  sfx: [[0, 'whoosh', .5], [at(28, 'kevin') - .05, 'scratch', .6], [at(28, 'kevin'), 'pop', .5]] });
// B029 — MÊME THOMAS ! : plan large au cinéma, Thomas en lunettes noires, cadre « thomas.png », crash zoom
B(29, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.12, eOutCubic(clamp(t / .4))), shake: 4 }),
  draw: (t, d, T) => { const Th = at(29, 'thomas') - .05; return cinemaS(t, { crowd: false }) + kevin({ x: 230, y: 1450, s: 1.05, expr: 'ecstatic', armR: [-60, -100] }, t) + thomas({ x: CX, y: 1450, s: 1.15, armL: [200, 240], armR: [-20, -60] }, t) + pote(1, { x: 850, y: 1450, s: 1.05, expr: 'ecstatic' }, t) +
    glasses3D(230, 1450 - 1.05 * 304, .9) + glasses3D(850, 1450 - 1.05 * 304, .9) + funBox(CX, 1060, 300, 360, t, Th, { label: 'thomas.png', col: '#b56cff' }) + kword('MÊME THOMAS !', CX, 430, t, .02, { size: 90, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .6], [.02, 'boom', .6], [at(29, 'thomas') - .05, 'tick', .6], [at(29, 'thomas') + .2, 'rimshot', .5]] });
// B030 — « Ah… » : héros seul sur le canapé, gris, une larme, grillons
B(30, { enter: 'none', cam: zin(1.08, 1.14),
  draw: (t, d, T) => salonF(t) + op(.45, rect(-M, -M, W + 2 * M, H + 2 * M, '#5a6070', 0, 0)) + secHead(CX, 880, 230, { expr: 'deadpan', face: { brows: 'sad' } }, t) + tear(CX - 90, 900, t, .8) + funTag(CX, 450, 'Ah…', t, .05, { size: 64, bg: '#fff', fg: SX.ink }),
  sfx: [[0, 'crickets', .6], [.15, 'gulp', .5]] });
// B031 — tu commences à comprendre : grille concept, ampoule qui s'allume (étoiles débloqué)
B(31, { enter: 'none', trans: 'glitch', transD: .2, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const C = at(31, 'comprendre') - .1, on = t > C; return gridBg(SX.ink) + halftoneFade('#fff', .05, 1) + unlock(CX, 620, t, C, { part: 'back', r: 420 }) + G(tr(CX, 1020), cutout(secHead(0, 0, 170, { expr: on ? 'wow' : 'confused' }, t), 12)) +
    G(tr(CX, 620, 1 + (on ? .05 * Math.sin(t * 10) : 0)), (on ? op(.5, circ(0, 0, 150, '#fff6c8', 0)) : '') + circ(0, 0, 90, on ? '#ffe066' : '#c9ced6', 7) + rect(-40, 80, 80, 60, '#9aa3ad', 10, 6) + line(-30, 100, 30, 100, 5) + path('M-24 20Q0 -30 24 20', 'none', 6, on ? '#ff9a3c' : '#9aa3ad')) +
    unlock(CX, 620, t, C, { part: 'front', r: 420 }) + kthin('alors, tu commences à', CX, 360, t, at(31, 'alors'), { size: 52 }); },
  sfx: [[at(31, 'alors'), 'pop_hi', .4], [at(31, 'commences'), 'hmm', .4], [at(31, 'comprendre') - .1, 'ding', .7], [at(31, 'comprendre'), 'sparkle', .6]] });
// B032 — le problème, ce n'est pas que les gens sont occupés : agendas « OCCUPÉ » barrés
B(32, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const P = at(32, 'pas') - .05, O = at(32, 'occupes') - .1; let s = paper('#e8f3ff') + gobo(T, .08);
    for (let i = 0; i < 3; i++) { const x = 220 + i * 320; s += card(x, 860, 260, 330, rect(-130, -165, 260, 330, '#fff', 0, 0) + (i === 1 ? kevinHead(0, -40, 70, { expr: 'smug' }, t) : i === 0 ? thomasHead(0, -40, 70, {}, t) : poteHead(1, 0, -40, 70, { expr: 'happy' }, t)) + ftext(0, 100, 'OCCUPÉ', { size: 40, fill: '#e2463a', stroke: 'none' }), t, .1 + i * .15, { ry: 0, r: (i - 1) * 5 }) + cross(x, 860, .9, t, O + i * .1); }
    return s + kthin('le problème, ce n\'est', CX, 380, t, at(32, 'probleme') - .1, { size: 54, fill: SX.ink }) + kword('PAS ÇA', CX, 500, t, P, { size: 96, fill: SX.acc }); },
  sfx: [[.1, 'pop', .4], [.25, 'pop', .4], [.4, 'pop', .4], [at(32, 'pas') - .05, 'boom', .5], [at(32, 'occupes') - .1, 'error_beep', .5]] });
// B033 — ils trouvent du temps, mais rarement pour toi : camembert du temps, part « TOI » microscopique (loupe)
B(33, { enter: 'none', trans: 'wipe', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Tm = at(33, 'temps') - .1, Rr = at(33, 'rarement') - .05; return gridBg('#2a2440') + pieTime(CX, 880, 300, t, Tm) + (t > Rr ? G(tr(CX + 120, 560, eOutBack(seg(t, Rr, Rr + .3))), circ(0, 0, 90, 'rgba(200,235,255,.4)', 9) + line(60, 60, 140, 140, 22)) + markerArrow(860, 380, CX + 40, 560, t, Rr, { col: SX.acc2 }) : '') +
    kthin('du temps… mais', CX, 380, t, at(33, 'trouvent') - .1, { size: 52 }) + funTag(250, 1150, 'TOI : 2 %', t, at(33, 'toi') - .1, { size: 44, bg: SX.acc }) + cutout(secHead(860, 1110, 70, { expr: 'sad' }, t), 8); },
  sfx: [[at(33, 'trouvent'), 'pop_hi', .4], [at(33, 'temps') - .1, 'whoosh_up', .5], [at(33, 'rarement') - .05, 'squeak', .6], [at(33, 'toi'), 'error_beep', .5]] });
// B034 — Puis, un vendredi soir, Kevin t'appelle : chambre de nuit, téléphone qui sonne sur la table de nuit
B(34, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const A = at(34, 'kevin') - .1, vib = t > A ? Math.sin(t * 60) * 5 : 0; return bedroomN(t) + secHero({ x: 330, y: 1500, s: 1.35, expr: t > A ? 'shock' : 'chill', armL: [200, 230] }, t) +
    G(tr(760 + vib, 820, 1, 5 + vib * .5), phoneBig(0, 0, .8, 0, callScreen('KEVIN', t))) + (t > A ? ringWaves(760, 600, t) : '') + funTag(CX, 410, 'VENDREDI SOIR', t, at(34, 'vendredi') - .1, { size: 50, bg: SX.cool }); },
  sfx: [[at(34, 'vendredi') - .1, 'pop', .5], [at(34, 'kevin') - .1, 'ring', .7], [at(34, 'appelle'), 'vibrate', .6]] });
// B035 — « Frère, on a une place libre ! Tu viens ? » : Kevin à la soirée, chaise vide « RÉSERVÉ THOMAS » barré
B(35, { enter: 'punch', cam: camHand(1.06, .6),
  draw: (t, d, T) => { const L = at(35, 'place') - .05; return partyT(t) + WASH('rgba(30,10,50,.25)') + kevinHead(380, 860, 190, { expr: 'joy' }, t) + G(tr(170, 1110, 1, -20), phoneBig(0, 0, .4, 0, '')) +
    G(tr(820, 1180), rect(-110, -260, 220, 30, '#c58e55', 8, 5) + rect(-100, -230, 200, 180, '#c58e55', 16, 5) + rect(-110, -60, 220, 30, '#b07a45', 8, 5) + line(-90, -30, -90, 70, 10) + line(90, -30, 90, 70, 10) + rect(-80, -200, 160, 50, '#fff', 8, 4) + ftext(0, -166, 'THOMAS', { size: 26, fill: OL, stroke: 'none' }) + (t > L ? path('M-80 -190L80 -160', 'none', 8, '#e2463a') : '')) +
    funTag(CX, 430, 'PLACE LIBRE !', t, L, { size: 58, bg: SX.acc2, fg: SX.ink }) + funTag(800, 600, 'TU VIENS ?', t, at(35, 'viens') - .1, { size: 46, bg: '#5fb85f' }); },
  sfx: [[at(35, 'frere'), 'pop', .5], [at(35, 'place') - .05, 'boing', .6], [at(35, 'viens') - .1, 'pop_hi', .6]] });
// B036 — Tu regardes ton téléphone : très gros plan, visage éclairé par l'écran, silence
B(36, { enter: 'none', trans: 'circle', transD: .25, cam: zin(1.08, 1.18),
  draw: (t, d, T) => bedroomN(t) + op(.5, rect(-M, -M, W + 2 * M, H + 2 * M, '#0d1030', 0, 0)) + op(.35, glow(CX, 900, 420, '#bfe3ff', .7)) + secHead(CX, 860, 250, { expr: 'deadpan', look: [0, .6] }, t) + G(tr(CX, 1250, 1, -4), phoneBig(0, 0, .6, 0, callScreen('KEVIN', t))),
  sfx: [[0, 'hmm', .4], [.2, 'vibrate', .4], [.6, 'heartbeat', .5]] });
// B037 — Tu pourrais accepter, comme d'habitude : pouce au-dessus du bouton vert, compteur « déjà dit oui ×47 »
B(37, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 1 }),
  draw: (t, d, T) => { const Hb = at(37, 'habitude') - .1; return bedroomN(t) + op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#0d1030', 0, 0)) + bigBtn(CX, 1030, 1.15, '#36c26a', 'ACCEPTER', .1 * Math.abs(Math.sin(t * 4)), t) +
    G(tr(CX + 30, 640 + wave(t, 2, 20)), rect(-46, -40, 92, 220, SKIN, 40, 6) + rect(-60, 150, 120, 160, '#4d9de0', 30, 6)) + kthin('tu pourrais accepter…', CX, 380, t, at(37, 'pourrais') - .1, { size: 54 }) + funTag(250, 520, `OUI ×${counter(40, 47, t, Hb, .4)}`, t, Hb, { size: 44, bg: SX.cool }); },
  sfx: [[at(37, 'pourrais'), 'heartbeat', .5], [at(37, 'accepter'), 'tick', .5], [at(37, 'habitude') - .1, 'slot', .5]] });
// B038 — Mais cette fois, tu réponds NON : bouton rouge écrasé, explosion, flash
B(38, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.06, shake: t > at(38, 'non') - .1 ? 10 : 2 }),
  draw: (t, d, T) => { const N = at(38, 'non') - .05, pr = seg(t, N - .1, N); return rays(t, CX, 900, '#ff9a6b', '#ff6a1a', 22) + burst(CX, 1000, 380, t, N, SX.acc2, 16) + bigBtn(CX, 1060, 1.2, '#e2463a', 'REFUSER', pr, t) +
    G(tr(CX + 30, lerp(600, 700, pr)), rect(-46, -40, 92, 220, SKIN, 40, 6) + rect(-60, 150, 120, 160, '#4d9de0', 30, 6)) + kthin('mais cette fois…', CX, 360, t, at(38, 'mais'), { size: 50 }) + kword('NON.', CX, 520, t, N, { size: 160, fill: '#fff' }) + popStars(CX, 900, t, N, 8, 380); },
  sfx: [[at(38, 'mais'), 'whoosh', .5], [at(38, 'non') - .1, 'thud', .9], [at(38, 'non') - .05, 'boom', .8], [at(38, 'non') + .1, 'flash_hit', .5]] });
// B039 — Tu n'as même rien de prévu : pyjama, masque concombre, canapé — chill de ouf
B(39, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Pv = at(39, 'prevu') - .1; return salonF(t, { night: 1, noSofa: 1 }) + sofa(CX, 1420, 1.05, '#5ec4a0') + secHero({ x: CX, y: 1440, s: 1.35, expr: 'chill', shirt: '#b56cff', apron: false, badge: false, armL: [160, 220], armR: [20, -40], legL: [40, 20], legR: [40, 20] }, t) +
    circ(CX - 40, 1440 - 1.35 * 304, 22, '#9be07b', 4) + circ(CX + 40, 1440 - 1.35 * 304, 22, '#9be07b', 4) + zzz(CX + 160, 920, t) + funTag(CX, 450, 'RIEN DE PRÉVU', t, Pv, { size: 54, bg: SX.cool }) + markerText('chill de ouf', 820, 640, t, at(39, 'rien'), { size: 48, col: SX.acc2 }); },
  sfx: [[at(39, 'meme'), 'waves', .4], [at(39, 'rien'), 'scratch', .4], [at(39, 'prevu') - .1, 'pop', .6]] });
// B040 — Et pourtant, ça fait du bien : le héros flotte, zen, rayons et cœurs
B(40, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => rays(t, CX, 900, '#c9f1e8', '#a6e3d6', 22) + secHero({ x: CX, y: 1440 + wave(t, .8, 30), s: 1.35, expr: 'zen', shirt: '#b56cff', apron: false, badge: false, armL: [150, 180], armR: [30, 0], legL: [30, 150], legR: [150, 30] }, t) + heartsUp(t, CX, 960, 6) + sparkle(260, 700, .5 + .2 * Math.sin(t * 6), '#fff') + sparkle(840, 760, .4 + .2 * Math.sin(t * 7), '#fff') +
    kthin('et pourtant…', CX, 380, t, at(40, 'pourtant') - .1, { size: 54, fill: SX.ink }) + kword('ÇA FAIT DU BIEN', CX, 500, t, at(40, 'fait') - .05, { size: 76, fill: SX.acc2 }),
  sfx: [[at(40, 'pourtant'), 'angel', .5], [at(40, 'fait') - .05, 'sparkle', .6], [at(40, 'bien'), 'magic', .4]] });
// B041 — seul un vendredi soir, parfois moins triste : à la fenêtre la nuit, pizza, la ville qui brille
B(41, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Tr = at(41, 'triste') - .1; let city = grad('#141a40', '#3a3070', -M, -M, W + 2 * M, H + 2 * M) + circ(860, 260, 70, '#fff6d6', 0) + op(.35, circ(860, 260, 120, '#fff6d6', 0)) + op(.9, sSkyline(1250, '#1d2350', 9, 'rgba(255,224,138,.6)'));
    for (let i = 0; i < 18; i++) city += sparkle((i * 131) % W, 120 + (i * 77) % 500, .15 + .1 * Math.sin(t * 3 + i), '#fff6d6');
    return city + rect(-M, 1150, W + 2 * M, 1000, '#3a3050', 0, 0) + rect(-M, 1130, W + 2 * M, 40, '#f4f1ea', 4, 6) + secHero({ x: CX - 80, y: 1500, s: 1.35, expr: 'happy', shirt: '#b56cff', apron: false, badge: false, armR: [-20, -70], holdR: path('M0 0L80 -40L80 40Z', '#ffcf6b', 5) + circ(50, -6, 8, '#e2463a', 0) + circ(60, 16, 8, '#e2463a', 0) }, t) +
      sCurtain(-40, 80, 160, 1080, '#5a3a8a', t, 1) + sCurtain(960, 80, 160, 1080, '#5a3a8a', t, -1) + kthin('seul un vendredi soir…', CX, 400, t, at(41, 'seul') - .1, { size: 54 }) + funTag(CX, 540, 'MOINS TRISTE', t, Tr, { size: 56, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[at(41, 'seul'), 'chirp', .3], [at(41, 'vendredi'), 'pop_hi', .4], [at(41, 'parfois'), 'sparkle', .4], [at(41, 'triste') - .1, 'pop', .6]] });
// B042 — FIN : « que d'être invité uniquement QUAND IL MANQUE QUELQU'UN » ; dernier gag : Kevin brandit le panneau IN : ??? devant une soirée vide
B(42, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(42, 'quelqu') ? 3 : 0 }),
  draw: (t, d, T) => { const Q = at(42, 'quand') - .05, M2 = at(42, 'manque') - .05; return partyT(t, { dancers: false }) + WASH('rgba(30,10,50,.35)') + kevin({ x: 300, y: 1450, s: 1.25, expr: t > M2 ? 'panic' : 'worried', armR: [-60, -110] }, t) + subBoard(700, 1000, .7, t, 'THOMAS', '???', 1) +
    kthin('invité uniquement', CX, 320, t, at(42, 'invite') - .1, { size: 54, out: Q - .1 }) + kword('QUAND IL MANQUE', CX, 410, t, Q, { size: 76, fill: '#fff' }) + kword("QUELQU'UN.", CX, 520, t, at(42, 'quelqu') - .05, { size: 92, fill: SX.acc2 }) +
    (t > M2 ? funTag(700, 700, 'ALLÔ ?', t, M2 + .1, { size: 44, bg: '#5fb85f' }) : '') + (t > at(42, 'quelqu') + .3 ? popStars(CX, 700, t, at(42, 'quelqu') + .3, 8, 380) : ''); },
  sfx: [[0, 'whoosh', .5], [at(42, 'invite'), 'pop_hi', .4], [at(42, 'quand') - .05, 'boom', .5], [at(42, 'manque'), 'ring', .5], [at(42, 'quelqu') - .05, 'flash_hit', .6], [at(42, 'quelqu') + .4, 'rimshot', .5]] });

SCENES.sort((a, b) => a.s - b.s);
