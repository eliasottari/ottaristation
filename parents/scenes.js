// ============================================================
//  « Pourquoi c'est horrible d'être l'enfant de parents divorcés ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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

// ---------- SIZEX fun : accent rose-rouge, jaune marqueur, bleu « papa » ----------
sxFun('#ff4f7b'); SX.acc2 = '#ffd23f'; SX.cool = '#4d9de0';

// ---------- aides + bibliothèque de décors riches (reprise de dernier/ aine/ tache/, préfixe p) ----------
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
const pHaze = (k = .35, col = '230,240,250', y1 = 1300) => rect(-M, -M, W + 2 * M, y1 + M, `rgba(${col},${k})`, 0, 0);
function pWall(kind, c1, c2, yb = 1250) { let s = rect(-M, -M, W + 2 * M, yb + M, c1, 0, 0);
  if (kind === 'stripe') for (let x = -M; x < W + M; x += 120) s += rect(x, -M, 48, yb + M, c2, 0, 0);
  if (kind === 'dot') for (let y = -40; y < yb; y += 90) for (let x = -M + ((y / 90) % 2 ? 45 : 0); x < W + M; x += 90) s += circ(x, y, 7, c2, 0);
  if (kind === 'diamond') for (let y = 0; y < yb; y += 110) for (let x = -M + ((y / 110) % 2 ? 55 : 0); x < W + M; x += 110) s += path(`M${x} ${y - 14}L${x + 10} ${y}L${x} ${y + 14}L${x - 10} ${y}Z`, c2, 0);
  if (kind === 'star') for (let y = 30; y < yb; y += 140) for (let x = -M + ((y / 140) % 2 ? 70 : 0); x < W + M; x += 140) s += ftext(x, y, '✦', { size: 26, fill: c2, stroke: 'none' });
  return s; }
const pBase = (yb, col = '#fff', h = 34) => rect(-M, yb - h, W + 2 * M, h, col, 0, 0) + line(-M, yb - h, W + M, yb - h, 5, shade(col, -.25));
function pParquet(yb, c) { let s = rect(-M, yb, W + 2 * M, 1500, c, 0, 0); const ys = [0, 28, 64, 112, 176, 260, 370, 510, 690]; ys.forEach((dy, i) => { s += line(-M, yb + dy, W + M, yb + dy, 4, shade(c, -.2)); const nx = ys[i + 1]; if (nx !== undefined) for (let x = -M + (i % 2) * 110; x < W + M; x += 220) s += line(x, yb + dy, x, yb + nx, 4, shade(c, -.2)); }); return s + line(-M, yb, W + M, yb, 8, shade(c, -.35)); }
function pTileFloor(yb, c1, c2) { let s = rect(-M, yb, W + 2 * M, 1500, c1, 0, 0); const ys = [0, 40, 95, 170, 270, 400, 570, 800]; for (let i = 0; i < ys.length - 1; i++) { const h = ys[i + 1] - ys[i], w = h * 1.6; for (let k = 0, x = -M; x < W + M; x += w, k++) if ((k + i) % 2) s += rect(x, yb + ys[i], w, h, c2, 0, 0); } return s + line(-M, yb, W + M, yb, 7, shade(c1, -.3)); }
const pOutlet = (x, y) => rect(x - 22, y - 30, 44, 60, '#f4f1ea', 8, 4) + circ(x - 8, y, 4, OL, 0) + circ(x + 8, y, 4, OL, 0);
const pSwitch = (x, y) => rect(x - 24, y - 34, 48, 68, '#f4f1ea', 8, 4) + rect(x - 9, y - 16, 18, 32, '#dcd6cc', 4, 3);
function pPic(kind, w, h) { const a = -w / 2 + 12, b = -h / 2 + 12, iw = w - 24, ih = h - 24;
  if (kind === 'mount') return rect(a, b, iw, ih, '#cfe8f5', 0, 0) + path(`M${a} ${b + ih}L${a + iw * .35} ${b + ih * .35}L${a + iw * .6} ${b + ih * .7}L${a + iw * .75} ${b + ih * .5}L${a + iw} ${b + ih}Z`, '#7bbf5a', 3) + circ(a + iw * .78, b + ih * .25, ih * .12, '#ffd23f', 3);
  if (kind === 'heart') return rect(a, b, iw, ih, '#ffe1ee', 0, 0) + heart(0, 4, Math.min(iw, ih) / 120, '#ff5d73');
  if (kind === 'face') return rect(a, b, iw, ih, '#fff1c8', 0, 0) + circ(0, ih * .08, ih * .28, '#f2c9a0', 3) + path(`M${-ih * .28} ${-ih * .02}Q0 ${-ih * .38} ${ih * .28} ${-ih * .02}`, '#6b3e26', 3) + path(`M${-ih * .1} ${ih * .18}Q0 ${ih * .25} ${ih * .1} ${ih * .18}`, 'none', 3);
  if (kind === 'sea') return rect(a, b, iw, ih, '#bfe3ff', 0, 0) + rect(a, b + ih * .55, iw, ih * .45, '#4d9fd8', 0, 0) + path(`M${a + iw * .3} ${b + ih * .55}L${a + iw * .45} ${b + ih * .2}L${a + iw * .5} ${b + ih * .55}Z`, '#fff', 3);
  return rect(a, b, iw, ih, '#e1f5d6', 0, 0) + circ(0, 0, ih * .25, '#ff9a4d', 3); }
const pFrame = (x, y, w, h, kind = 'mount', col = '#c38a52', r = 0) => G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, col, 6, 6) + pPic(kind, w, h) + rect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 'none', 2, 3));
function pPoster(x, y, w, h, bg, r, inner = '', t = 0) { const fl = Math.sin(t * 2.4 + x) * 3; return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, bg, 6, 5) + inner + path(`M${w / 2 - 34} ${h / 2}L${w / 2} ${h / 2 - 34 + fl}L${w / 2} ${h / 2}Z`, shade(bg, -.2), 3) + rect(-18, -h / 2 - 10, 36, 18, 'rgba(255,255,255,.75)', 3, 0)); }
function pBooks(x, y, w, seed = 1) { const r = rng(seed); let s = '', cx = x; while (cx < x + w - 20) { const bw = 18 + r() * 14, bh = 56 + r() * 34, c = DPAL[Math.floor(r() * 8)]; if (r() < .12 && cx + bh < x + w) { s += rect(cx, y - bw, bh, bw, c, 3, 4); cx += bh + 4; continue; } s += rect(cx, y - bh, bw, bh, c, 3, 4) + line(cx + 4, y - bh + 12, cx + bw - 4, y - bh + 12, 3, 'rgba(255,255,255,.6)'); cx += bw + 2; } return s; }
const pShelf = (x, y, w, items = '', col = '#b5835a') => items + rect(x, y, w, 18, col, 4, 5) + path(`M${x + 24} ${y + 18}L${x + 24} ${y + 50}L${x + 56} ${y + 18}`, 'none', 5) + path(`M${x + w - 24} ${y + 18}L${x + w - 24} ${y + 50}L${x + w - 56} ${y + 18}`, 'none', 5);
const pJar = (x, y, c = '#ffd23f', s = 1) => G(tr(x, y, s), rect(-24, -64, 48, 64, 'rgba(220,240,255,.85)', 10, 4) + rect(-20, -40, 40, 36, c, 6, 0) + rect(-26, -76, 52, 16, '#c96a3a', 5, 4));
const pTrophy = (x, y, s = 1) => G(tr(x, y, s), rect(-30, -16, 60, 16, '#6b3e26', 3, 4) + rect(-8, -46, 16, 30, '#e8b923', 0, 4) + path('M-34 -96L34 -96Q34 -46 0 -46Q-34 -46 -34 -96Z', '#ffd23f', 4) + path('M-34 -88Q-56 -84 -46 -64M34 -88Q56 -84 46 -64', 'none', 4) + ftext(0, -64, '1', { size: 22, fill: '#a0703f', stroke: 'none' }));
const pTeddy = (x, y, s = 1, c = '#c9935c') => G(tr(x, y, s), ell(0, -38, 40, 40, c, 5) + circ(-30, -96, 13, c, 5) + circ(30, -96, 13, c, 5) + circ(0, -82, 30, c, 5) + ell(0, -74, 12, 9, '#f1d2a8', 0) + circ(-10, -88, 4, OL, 0) + circ(10, -88, 4, OL, 0) + circ(0, -77, 4, OL, 0) + ell(-28, -8, 16, 11, c, 4) + ell(28, -8, 16, 11, c, 4));
function pPot(x, y, s, t, kind = 0, potC = '#d9825b') { const sw = wave(t, .5, 4, x * .01); let lv = '';
  if (kind === 0) for (let i = 0; i < 5; i++) lv += G(tr(0, -60, 1, -60 + i * 30 + sw), ell(0, -55, 18, 55, ['#5fb85f', '#4fa64f', '#6cc46c'][i % 3], 4));
  else if (kind === 1) lv += G(tr(0, -60, 1, sw), rect(-18, -150, 36, 150, '#5aa76a', 18, 4) + rect(-58, -110, 26, 70, '#5aa76a', 13, 4) + rect(32, -126, 26, 60, '#5aa76a', 13, 4));
  else for (let i = 0; i < 7; i++) lv += G(tr(0, -60, 1, -75 + i * 25 + sw), path('M0 0Q-16 -60 0 -120Q16 -60 0 0Z', '#4fa64f', 3));
  return G(tr(x, y, s), lv + path('M-46 -62L46 -62L36 0L-36 0Z', potC, 5) + rect(-52, -74, 104, 18, shade(potC, -.15), 5, 5)); }
function pCurtain(x, y, w, h, col, t, side = 1) { let d = `M${x} ${y}L${x + w} ${y}`; const n = 5; for (let i = 0; i <= n; i++) { const yy = y + h * i / n; d = d; } const sw = wave(t, .5, 14, x * .01);
  const xb = x + (side > 0 ? w * .7 + sw : w * .3 + sw), dd = side > 0 ? `M${x} ${y}L${x + w} ${y}Q${x + w * .55} ${y + h * .5} ${xb} ${y + h}L${x - 6} ${y + h}Z` : `M${x} ${y}L${x + w} ${y}L${x + w + 6} ${y + h}L${xb} ${y + h}Q${x + w * .45} ${y + h * .5} ${x} ${y}Z`;
  let s = path(dd, col, 6); for (let i = 1; i < 4; i++) s += path(`M${x + w * i / 4} ${y + 10}Q${x + w * i / 4 + sw * .4} ${y + h * .5} ${x + w * i / 4 + (side > 0 ? -1 : 1) * w * .12} ${y + h - 10}`, 'none', 4, shade(col, -.25)); return s + rect(x - 20, y - 14, w + 40, 18, '#8a5a3a', 8, 4); }
function pWindowView(x, y, w, h, t, o = {}) { const night = o.night; let s = grad(night ? '#0f163a' : '#9fd6ff', night ? '#2a3170' : '#e6f6ff', x, y, w, h);
  s += night ? circ(x + w * .72, y + h * .22, 34, '#fff6d6', 0) : cloud(x + ((t * 20) % (w + 160)) - 80, y + h * .25, .45, '#fff');
  for (let i = 0; i < 5; i++) { const bx = x + i * w / 5, bh = h * (.25 + ((i * 37) % 30) / 100); s += rect(bx, y + h - bh, w / 5 + 2, bh, night ? '#1a2048' : '#b9cfe0', 0, 0); for (let j = 0; j < 3; j++) s += rect(bx + 14, y + h - bh + 16 + j * 34, 14, 16, night ? (Math.sin(t * .7 + i * 3 + j) > -.3 ? '#ffe08a' : '#2e3570') : '#e6f2fb', 2, 0); }
  if (!night) s += circ(x + w * .2, y + h - 30, 46, '#6cc46c', 0) + circ(x + w * .3, y + h - 50, 40, '#5fb85f', 0);
  return s + rect(x, y, w, h, 'none', 8, 10, '#fff') + rect(x - 6, y - 6, w + 12, h + 12, 'none', 10, 6) + line(x + w / 2, y, x + w / 2, y + h, 8, '#fff') + line(x, y + h / 2, x + w, y + h / 2, 8, '#fff') + rect(x - 24, y + h, w + 48, 20, '#f4f1ea', 4, 5); }
const pRug = (x, y, w, h, c1, c2) => ell(x, y, w / 2, h / 2, c1, 6) + ell(x, y, w * .38, h * .36, 'none', 6, c2) + ell(x, y, w * .22, h * .2, c2, 0);
const pBin = (x, y, s = 1, c = '#7aa6d8') => G(tr(x, y, s), path('M-46 -110L46 -110L36 0L-36 0Z', c, 5) + line(-20, -90, -16, -14, 4, shade(c, -.25)) + line(20, -90, 16, -14, 4, shade(c, -.25)) + path('M-30 -110Q-10 -136 6 -112Q20 -130 34 -110', '#fff', 4));
const pBag = (x, y, s = 1, c = '#e2463a', r = 0) => G(tr(x, y, s, r), rect(-60, -130, 120, 130, c, 26, 5) + rect(-40, -60, 80, 46, shade(c, -.15), 12, 4) + path('M-30 -130Q0 -176 30 -130', 'none', 8) + circ(0, -80, 6, '#ffd23f', 3));
const pShoes = (x, y, s = 1, c = '#5b8fd8') => G(tr(x, y, s), path('M-80 0L-80 -34Q-60 -46 -40 -30L-6 -20Q4 -10 0 0Z', c, 5) + path('M10 0L10 -34Q30 -46 50 -30L84 -20Q94 -10 90 0Z', c, 5) + line(-82, -3, 0, -3, 6, '#fff') + line(8, -3, 92, -3, 6, '#fff'));
const pBall = (x, y, s = 1, t = 0, c = '#e2463a') => G(tr(x, y - 40 * s, s, t * 40), circ(0, 0, 40, c, 5) + path('M-40 0Q0 -20 40 0M0 -40Q-20 0 0 40', 'none', 5, '#fff'));
const pBox = (x, y, s = 1, str = '') => G(tr(x, y, s), rect(-80, -110, 160, 110, '#d9a86c', 4, 5) + path('M-80 -110L-100 -140L-20 -140L0 -110M80 -110L100 -140L20 -140L0 -110', '#c8955a', 4) + rect(-14, -110, 28, 40, '#e8c690', 0, 0) + (str ? ftext(0, -30, str, { size: 22, fill: '#7a5a3a', stroke: 'none' }) : ''));
const pGift = (x, y, s = 1, c = '#5ec4f0', c2 = '#ffd23f') => G(tr(x, y, s), rect(-60, -100, 120, 100, c, 6, 5) + rect(-12, -100, 24, 100, c2, 0, 0) + rect(-60, -100, 120, 100, 'none', 6, 5) + path('M0 -100Q-40 -150 -30 -104M0 -100Q40 -150 30 -104', 'none', 7, c2));
function pLamp(x, y, s = 1, on = 1, t = 0, c = '#ffd23f') { return G(tr(x, y, s), (on ? op(.25 + .05 * Math.sin(t * 3), circ(0, -300, 140, '#fff6c8', 0)) : '') + rect(-40, -10, 80, 14, '#5a4a3a', 6, 4) + line(0, -10, 0, -260, 8) + path('M-60 -250L60 -250L36 -350L-36 -350Z', c, 5)); }
const pDeskLamp = (x, y, s = 1, t = 0) => G(tr(x, y, s), op(.3 + .05 * Math.sin(t * 4), path('M40 -150L-60 0L160 0Z', '#fff6c8', 0)) + ell(0, -6, 40, 10, '#5b8fd8', 4) + line(0, -10, -20, -100, 8) + line(-20, -100, 40, -150, 8) + path('M20 -170L80 -140L60 -110L4 -134Z', '#5b8fd8', 5));
const pMug = (x, y, s = 1, t = 0, c = '#ff8fb1') => G(tr(x, y, s), rect(-26, -54, 52, 54, c, 8, 4) + path('M26 -42Q46 -36 26 -14', 'none', 5) + op(.6, path(`M-6 -64Q${-14 + wave(t, 1, 6)} -84 -4 -104M10 -64Q${2 + wave(t, 1, 6, .5)} -86 12 -108`, 'none', 4, '#fff')));
const pGlobe = (x, y, s = 1, t = 0) => G(tr(x, y, s), rect(-40, -10, 80, 14, '#6b3e26', 5, 4) + line(0, -10, 0, -40, 6) + circ(0, -110, 66, '#5ec4f0', 5) + G(`translate(${f1(((t * 30) % 120) - 60)} -110)`, ell(0, -14, 26, 18, '#7be07b', 0) + ell(30, 22, 16, 12, '#7be07b', 0)) + circ(0, -110, 66, 'none', 5) + path('M-74 -110A74 74 0 0 1 0 -184', 'none', 6, '#8a5a3a'));
function pBird(x, y, s, t, ph = 0) { const f = Math.sin(t * 10 + ph) * 14; return G(tr(x, y, s), path(`M-30 ${f1(-f)}Q-14 -6 0 4Q14 -6 30 ${f1(-f)}`, 'none', 6)); }
const pBirds = (t, n = 3, y = 300, seed = 1) => { let s = ''; for (let i = 0; i < n; i++) s += pBird(((t * (50 + i * 12) + i * 420 + seed * 200) % 1700) - 300, y + i * 46 + Math.sin(t * 2 + i) * 14, .7 - i * .1, t, i * 2); return s; };
function pSkyline(yb, col, seed = 3, win = 'rgba(255,255,255,.35)') { const r = rng(seed); let s = '', x = -M; while (x < W + M) { const w = 120 + r() * 140, h = 280 + r() * 380; s += rect(x, yb - h, w, h, col, 0, 0); if (r() < .4) s += rect(x + w * .4, yb - h - 50, 10, 50, col, 0, 0); for (let j = yb - h + 40; j < yb - 40; j += 70) for (let i = x + 18; i < x + w - 30; i += 46) s += rect(i, j, 20, 28, win, 2, 0); x += w + 6; } return s; }
function pBuilding(x, yb, w, h, c, seed, t, o = {}) { const r = rng(seed); let s = rect(x, yb - h, w, h, c, 4, 6) + rect(x - 10, yb - h - 18, w + 20, 26, shade(c, -.18), 4, 5);
  const cols = Math.max(1, Math.floor(w / 95)), cw = (w - 30) / cols, top = yb - h + 40, shopH = o.shop === false ? 0 : 190;
  for (let j = top; j < yb - shopH - 90; j += 120) for (let i = 0; i < cols; i++) { const wx = x + 15 + i * cw + 10, ww = cw - 20, lit = o.night ? Math.sin(t * .6 + i * 2.1 + j * .07) > -.2 : r() < .2;
    s += rect(wx, j, ww, 74, lit ? '#ffe08a' : '#cfe8ff', 4, 4); const k = r(); if (k < .3) s += path(`M${wx + 3} ${j + 3}L${wx + ww * .35} ${j + 3}Q${wx + ww * .2} ${j + 40} ${wx + 6} ${j + 70}Z`, DPAL[(seed + i) % 8], 0); else if (k < .45) s += rect(wx - 6, j + 66, ww + 12, 14, '#8a5a3a', 3, 3) + circ(wx + ww * .3, j + 62, 12, '#5fb85f', 3) + circ(wx + ww * .65, j + 60, 14, '#ff8fb1', 3); else s += line(wx + ww / 2, j, wx + ww / 2, j + 74, 4);
    if (r() < .18) s += rect(wx - 10, j + 74, ww + 20, 10, '#7d848c', 2, 4) + Array.from({ length: 4 }, (_, q) => line(wx - 6 + q * (ww + 12) / 3, j + 84, wx - 6 + q * (ww + 12) / 3, j + 116, 4)).join('') + line(wx - 10, j + 116, wx + ww + 10, j + 116, 5); }
  if (shopH) { const ac = o.awn || DPAL[seed % 8]; s += rect(x + 14, yb - 160, w - 28, 160, '#cfe8ff', 4, 5) + rect(x + w * .62, yb - 150, w * .22, 150, shade(c, -.3), 4, 5);
    for (let i = 0; i < 6; i++) s += path(`M${x + i * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 160}Q${x + (i + .5) * w / 6} ${yb - 140} ${x + i * w / 6} ${yb - 160}Z`, i % 2 ? '#fff' : ac, 4);
    if (o.sign) s += rect(x + w / 2 - o.sign.length * 11 - 16, yb - 250, o.sign.length * 22 + 32, 44, '#fff8e0', 8, 4) + ftext(x + w / 2, yb - 218, o.sign, { size: 26, fill: ac, stroke: 'none' }); }
  return s; }
const pLampPost = (x, yb, s = 1, on = 0) => G(tr(x, yb, s), (on ? op(.35, circ(0, -470, 70, '#fff6c8', 0)) : '') + rect(-22, -20, 44, 20, '#3a4250', 4, 4) + rect(-8, -440, 16, 420, '#3a4250', 4, 4) + path('M0 -440Q0 -480 50 -480', 'none', 10, '#3a4250') + path('M30 -486L90 -486L80 -456L40 -456Z', '#ffe08a', 4));
const pBench = (x, yb, s = 1) => G(tr(x, yb, s), rect(-120, -110, 240, 22, '#b5835a', 5, 4) + rect(-120, -80, 240, 22, '#b5835a', 5, 4) + rect(-130, -44, 260, 20, '#c8955a', 5, 4) + line(-100, -24, -100, 0, 8) + line(100, -24, 100, 0, 8) + line(-100, -110, -100, -44, 6) + line(100, -110, 100, -44, 6));
const pBike = (x, yb, s = 1, c = '#36a85a') => G(tr(x, yb - 50 * s, s), circ(-70, 0, 48, 'none', 7) + circ(70, 0, 48, 'none', 7) + path('M-70 0L-20 -70L50 -70L70 0M-20 -70L0 0L50 -70M0 0L-70 0', 'none', 7, c) + line(-30, -90, -6, -90, 8) + path('M50 -70L44 -96L66 -100', 'none', 7));
function pCar(x, yb, s = 1, c = '#ff6b6b', flip = 0) { return G(`translate(${f1(x)} ${f1(yb)}) scale(${flip ? -s : s} ${s})`, path('M-200 -40L-200 -100Q-190 -120 -150 -124L-100 -190Q-80 -200 40 -200Q90 -196 120 -124L190 -114Q210 -104 210 -70L210 -40Z', c, 6) + path('M-84 -130L-56 -180L10 -180L10 -130Z', '#cfe8ff', 4) + path('M30 -130L30 -180L80 -180L106 -130Z', '#cfe8ff', 4) + circ(-110, -36, 42, '#3a4250', 6) + circ(-110, -36, 16, '#c8ced6', 4) + circ(120, -36, 42, '#3a4250', 6) + circ(120, -36, 16, '#c8ced6', 4) + rect(186, -98, 22, 16, '#ffe08a', 4, 3)); }
const pBush = (x, yb, s = 1, c = '#5fb85f') => G(tr(x, yb, s), circ(-60, -40, 50, shade(c, -.1), 5) + circ(50, -44, 54, shade(c, -.05), 5) + circ(0, -70, 64, c, 5) + rect(-110, -12, 220, 12, c, 0, 0));
function pFlowers(x, yb, n = 5, seed = 2, t = 0) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const fx = x + i * 34 + r() * 10, h = 40 + r() * 30, sw = wave(t, .6, 4, i); s += line(fx, yb, fx + sw, yb - h, 5, '#4fa64f') + circ(fx + sw, yb - h, 14, DPAL[Math.floor(r() * 8)], 4) + circ(fx + sw, yb - h, 5, '#ffd23f', 0); } return s; }
const pPine = (x, yb, s = 1, t = 0) => G(tr(x, yb, s, wave(t, .3, 1.5, x)), rect(-16, -60, 32, 60, '#8a5a3a', 6, 5) + path('M-90 -60L0 -200L90 -60Z', '#3f9a5a', 5) + path('M-74 -150L0 -280L74 -150Z', '#4fa66a', 5) + path('M-56 -240L0 -350L56 -240Z', '#5fb87a', 5));
const pFence = (x0, x1, yb, c = '#fff') => { let s = rect(x0, yb - 90, x1 - x0, 14, c, 3, 4) + rect(x0, yb - 46, x1 - x0, 14, c, 3, 4); for (let x = x0; x < x1; x += 46) s += path(`M${x} ${yb}L${x} ${yb - 110}L${x + 14} ${yb - 128}L${x + 28} ${yb - 110}L${x + 28} ${yb}Z`, c, 4); return s; };
const pSign = (x, yb, str, c = '#5b8fd8', s = 1) => G(tr(x, yb, s), rect(-8, -300, 16, 300, '#8a8f99', 4, 4) + rect(-110, -380, 220, 90, c, 12, 5) + ftext(0, -322, str, { size: 34, fill: '#fff', stroke: 'none' }));
const pBalloon = (x, y, c, t, ph = 0, s = 1) => { const bx = x + wave(t, .5, 10, ph), by = y + wave(t, .7, 12, ph + 1); return path(`M${f1(bx)} ${f1(by + 70 * s)}Q${f1(bx + 20)} ${f1(by + 160 * s)} ${f1(bx - 6)} ${f1(by + 260 * s)}`, 'none', 3) + G(tr(bx, by, s), ell(0, 0, 52, 64, c, 5) + path('M-8 62L8 62L0 74Z', c, 4) + ell(-18, -24, 10, 16, 'rgba(255,255,255,.6)', 0)); };
const pSpeaker = (x, yb, s = 1, t = 0) => { const p = 1 + .08 * Math.max(0, Math.sin(t * 13)); return G(tr(x, yb, s), rect(-90, -340, 180, 340, '#241830', 14, 6) + circ(0, -240, 52 * p, '#3a2a4a', 5) + circ(0, -240, 18, '#5ec4f0', 4) + circ(0, -100, 66 * p, '#3a2a4a', 5) + circ(0, -100, 22, '#ff5c8a', 4)); };
const pNeon = (x, y, str, c, t, size = 54) => { const on = Math.sin(t * 7) > -.6 || Math.sin(t * 23) > .2; return op(on ? 1 : .35, ftext(x, y, str, { size, fill: 'none', stroke: c, sw: 6 }) + (on ? op(.35, glow(x, y - size * .3, size * 1.6, c, .5)) : '')); };
const pStreamers = (t, y = -20, n = 9) => { let s = ''; for (let i = 0; i < n; i++) { const x = -40 + i * 140, l = 120 + (i * 53) % 90; s += path(`M${x} ${y}Q${x + 20 + wave(t, .9, 12, i)} ${y + l * .5} ${x + wave(t, .9, 18, i + 1)} ${y + l}`, 'none', 10, DPAL[i % 8]); } return s; };
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + circ(930, 150, 60, '#fff3b0', 0) + op(.35, circ(930, 150, 100, '#fff3b0', 0)) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff') + cloud(((t * 12 + 1200) % 1800) - 300, 120, .7, 'rgba(255,255,255,.85)') + pBirds(t, 3, 280);
function tree(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c') + circ(-40, -380, 14, '#e2463a', 4) + circ(60, -300, 14, '#e2463a', 4) + circ(-80, -240, 12, '#e2463a', 4)); }
function kidsBg(t, y = 1150, n = 4, s = .45) { let r = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; r += kid(i + 1, { x, y, s, expr: 'happy', walk: 3, flip: i % 2 }, t); } return r; }
function streetT(t, n = 3) { const yb = 1250; let s = SKY(t, '#9fd6ff', '#fff1dc') + op(.85, pSkyline(1000, '#bccde0', 5)) + pHaze(.2);
  const signs = ['CAFÉ', '', 'BOULANGERIE', '', 'PHARMACIE', 'FLEURS', '', 'CINÉ'];
  for (let i = -2; i < 6; i++) s += pBuilding(-200 + i * 300, yb, 280, 540 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4], i + 10, t, { sign: signs[(i + 8) % 8], awn: DPAL[(i + 8) % 8] });
  s += pHaze(.16, '255,250,240', 1250);
  s += rect(-M, yb, W + 2 * M, 1400, '#c8ccd2', 0, 0) + [0, 1, 2].map(i => line(-M, yb + 20 + i * 26, W + M, yb + 20 + i * 26, 3, '#b0b5bc')).join('') + rect(-M, yb + 90, W + 2 * M, 20, '#8f959d', 0, 0) + rect(-M, yb + 110, W + 2 * M, 1400, '#6e747c', 0, 0) + Array.from({ length: 10 }, (_, i) => rect(-M + i * 300 - ((t * 0) % 300), yb + 300, 160, 18, '#fff', 4, 0)).join('') + line(-M, yb, W + M, yb, 8, '#7d848c');
  s += pLampPost(70, yb, 1) + pLampPost(830, yb, 1) + tree(470, yb, .62, t) + pBench(640, yb, .7) + pBin(950, yb, .6, '#36a85a') + pBike(260, yb + 10, .6, '#ff5c8a') + pSign(1050, yb, 'RUE', '#5b8fd8', .8) + pFlowers(900, yb, 4, 5, t) + pCar(-60, yb + 250, .9, '#5ec4f0') + pCar(1000, yb + 260, .9, '#ffd23f', 1);
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
  let s = pWall('diamond', n ? '#3a3a6a' : '#fde7c8', n ? '#4a4a80' : '#f6d3a8', yb) + rect(-M, 930, W + 2 * M, yb - 930, n ? '#33335e' : '#eccb9c', 0, 0) + line(-M, 930, W + M, 930, 8, n ? '#2a2a50' : '#c9a473') + pBase(yb, '#fff');
  s += pFrame(110, 330, 150, 180, 'face', '#c38a52', -3) + pFrame(290, 300, 130, 160, 'face', '#8a5a3a', 2) + pFrame(120, 560, 130, 150, 'face', '#ff9a4d', 3) + pFrame(290, 530, 140, 170, 'face', '#5b8fd8', -2) + pFrame(420, 430, 54, 64, 'mount', '#9aa3ad', 6);
  s += wallClock(560, 200, 56, t, o.clock || 1) + pShelf(440, 690, 250, pBooks(455, 690, 110, 5) + pTrophy(600, 690, .7) + pTrophy(650, 690, .55)) + pOutlet(80, 1180) + pSwitch(1020, 880);
  s += pWindowView(720, 300, 280, 360, t, { night: n }) + pCurtain(660, 280, 100, 450, '#e86a8a', t, 1) + pCurtain(960, 280, 100, 450, '#e86a8a', t, -1) + pPot(760, 690, .45, t, 2, '#5b8fd8') + pPot(965, 690, .4, t, 1);
  if (!o.noSofa) s += sofa(CX - 40, 1290, .95, '#5ec4a0');
  s += n ? op(.3, rect(-M, -M, W + 2 * M, yb + M, '#141838', 0, 0)) : WASH();
  s += pParquet(yb, n ? '#5a4a4a' : '#c49a6c') + pRug(CX, 1470, 820, 170, '#e86a8a', '#ffd23f') + pLamp(1020, 1290, 1, 1, t, '#ffd23f') + pPot(70, 1290, 1, t, 0);
  s += pBall(250, 1580, .6, t * .3, '#5b8fd8') + pShoes(820, 1660, .7, '#e2463a') + pTeddy(960, 1620, .7) + pBox(140, 1780, .8, 'JOUETS');
  return s; }
function cuisine(t, o = {}) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#fff1c4', 0, 0);
  for (let y = 820, j = 0; y < 1000; y += 60, j++) for (let x = -M + (j % 2) * 45; x < W + M; x += 90) s += rect(x, y, 90, 60, '#e8f4f8', 0, 3, '#c9dde6');
  for (let i = 0; i < 4; i++) { const x = 250 + i * 110; s += rect(x, 150, 104, 260, '#7fc8b0', 8, 6) + rect(x + 14, 170, 76, 220, 'none', 6, 3, '#5aa58c') + rect(x + 46, 340, 12, 40, '#fff', 5, 3); }
  s += rect(240, 132, 460, 22, '#5aa58c', 4, 5) + pJar(300, 130, '#ff9a4d', .7) + pJar(360, 130, '#7be07b', .7) + pPot(640, 130, .45, t, 2, '#e2463a');
  s += pWindowView(740, 300, 270, 330, t); for (let i = 0; i < 6; i++) s += path(`M${720 + i * 52} 290L${772 + i * 52} 290L${772 + i * 52} 380Q${746 + i * 52} ${410 + wave(t, .6, 6, i)} ${720 + i * 52} 380Z`, i % 2 ? '#fff' : '#e2463a', 4); s += rect(712, 278, 326, 16, '#8a5a3a', 6, 4);
  s += rect(-40, 380, 260, 870, '#eef3f6', 26, 7) + line(-40, 700, 220, 700, 6) + rect(186, 460, 16, 160, '#c9d3dc', 6, 4) + rect(186, 760, 16, 200, '#c9d3dc', 6, 4);
  s += [[30, 480, '#ff8fb1', -6], [120, 520, '#5ec4f0', 5], [40, 820, '#7be07b', 4], [130, 880, '#ffd23f', -5]].map(([x, y, c, r]) => G(tr(x, y, 1, r + wave(t, .8, 1.5, x)), rect(-40, -50, 80, 100, '#fff', 4, 4) + circ(0, -12, 22, c, 3) + path('M-20 26L0 14L20 30', 'none', 4, c) + circ(0, -54, 8, '#e2463a', 3))).join('') + G(tr(110, 1020, 1, 8), rect(-14, -14, 28, 28, '#ffd23f', 2, 3)) + circ(60, 650, 12, '#5b8fd8', 4) + circ(150, 1100, 12, '#ff9a4d', 4);
  s += wallClock(330, 520, 48, t) + G(tr(560, 540), rect(-80, -90, 160, 190, '#fff', 8, 5) + rect(-80, -90, 160, 34, SX.acc, 8, 5) + ftext(0, -64, 'CORVÉES', { size: 20, fill: '#fff', stroke: 'none' }) + [0, 1, 2, 3, 4].map(i => rect(-64, -42 + i * 26, 128, 16, DPAL[i], 4, 0)).join(''));
  s += line(250, 760, 690, 760, 8, '#9aa3ad') + [300, 380, 460, 540, 620].map((x, i) => G(tr(x, 760, 1, wave(t, .7, 4, i)), line(0, 0, 0, 50, 5, '#9aa3ad') + (i % 2 ? circ(0, 66, 18, '#c9d3dc', 4) : rect(-10, 50, 20, 36, '#c9d3dc', 4, 4)))).join('');
  s += WASH() + rect(220, 1000, 900, 30, '#b98552', 6, 6) + rect(220, 1030, 900, 230, '#7fc8b0', 0, 6);
  for (let i = 0; i < 2; i++) s += rect(240 + i * 170, 1050, 150, 90, '#8fd4bc', 8, 4) + rect(295 + i * 170, 1080, 40, 12, '#fff', 5, 3);
  s += rect(600, 1045, 220, 205, '#3a3f4a', 10, 5) + rect(620, 1100, 180, 120, '#ffb36b', 8, 4) + op(.4, glow(710, 1160, 120, '#ffd88a', .6)) + [0, 1, 2, 3].map(i => circ(630 + i * 52, 1070, 9, '#c9ced6', 3)).join('');
  s += G(tr(420, 1000), rect(-80, -110, 160, 110, '#c9d3dc', 12, 6) + rect(-100, -122, 200, 22, '#9aa3ad', 8, 5) + line(-100, -90, -128, -90, 10) + line(100, -90, 128, -90, 10)) + steam(400, 860, t, .8) + steam(450, 870, t + .4, .6);
  s += G(tr(930, 1000), path('M-80 -50Q0 40 80 -50Z', '#ff9a4d', 5) + circ(-30, -60, 22, '#e2463a', 4) + circ(10, -70, 22, '#ffd23f', 4) + circ(40, -56, 20, '#7be07b', 4)) + pMug(1060, 1000, .9, t, '#5b8fd8');
  s += pTileFloor(yb, '#f0e6da', '#d9c4a8') + pBin(1050, 1340, .7, '#36a85a') + pShoes(150, 1700, .7, '#5b8fd8');
  return s; }
function entree(t, o = {}) { const yb = 1250, op_ = o.open || 0;
  let s = pWall('stripe', '#d6ecf7', '#c4e0ef', yb) + rect(-M, 960, W + 2 * M, yb - 960, '#9fc6dc', 0, 0) + line(-M, 960, W + M, 960, 6, '#7fa8c0') + pBase(yb, '#fff');
  s += rect(392, 512, 296, 746, '#fff', 6, 7);
  if (op_ > 0) s += clipR(400, 520, 280, 730, grad('#141a40', '#3a3070', 400, 520, 280, 730) + circ(620, 600, 26, '#fff6d6', 0) + rect(400, 1080, 280, 170, '#3a4060', 0, 0) + pLampPost(450, 1180, .55, 1) + (o.friends ? kid(1, { x: 560, y: 1290, s: .8, expr: 'joy', armR: [-60, -100] }, t) + kid(3, { x: 650, y: 1300, s: .75, expr: 'happy', armL: [200, 240], flip: 1 }, t) : ''), 0);
  const dw = lerp(280, 60, op_); s += rect(400, 520, dw, 730, '#e2463a', 4, 6) + (dw > 120 ? rect(400 + dw * .2, 570, dw * .6, 200, '#cfe8ff', 10, 5) + rect(400 + dw * .2, 830, dw * .6, 330, 'none', 8, 4, '#b8352b') + circ(400 + dw * .85, 920, 14, '#ffd23f', 4) : '');
  // toise des aînés sur le chambranle (+ le tien, tout en bas)
  [['12', 830], ['10', 900], ['9', 950], ['8 ANS', 1010]].forEach(([nm, y]) => { s += line(700, y, 740, y, 5) + ftext(746, y + 8, nm, { size: 20, fill: '#2b2420', stroke: 'none', anchor: 'start' }); });
  s += line(40, 360, 340, 360, 10, '#8a5a3a'); for (let i = 0; i < 6; i++) { const x = 60 + i * 52, c = [...DPAL, '#5a6b4a'][i], sw = wave(t, .4, 3, i); s += circ(x, 360, 8, '#ffd23f', 3) + G(tr(x, 366, 1, sw), path('M-30 0L30 0L44 230L-44 230Z', c, 5) + line(0, 0, 0, 230, 3, shade(c, -.2))); }
  s += G(tr(290, 330, 1, -8), path('M-50 0Q0 -60 50 0Z', '#36a85a', 5) + rect(-60, -4, 120, 12, '#36a85a', 6, 4));
  s += rect(40, 1130, 320, 20, '#b98552', 4, 5) + rect(40, 1190, 320, 20, '#b98552', 4, 5) + line(50, 1130, 50, 1250, 8) + line(350, 1130, 350, 1250, 8);
  const sc = ['#e2463a', '#5b8fd8', '#ffd23f', '#36a85a', '#ff8fb1', '#b56cff', '#ff9a4d']; for (let i = 0; i < 7; i++) s += pShoes(90 + (i % 3) * 100, 1128 + (i > 2 ? 60 : 0) - (i > 5 ? 60 : 0), .45, sc[i]);
  s += circ(880, 520, 110, '#f1c27d', 7) + circ(880, 520, 88, '#cfe8f5', 5) + line(840, 470, 880, 430, 8, 'rgba(255,255,255,.7)');
  s += rect(760, 900, 260, 22, '#b98552', 6, 5) + line(780, 922, 780, 1250, 8) + line(1000, 922, 1000, 1250, 8) + ell(830, 896, 40, 14, '#5ec4f0', 4) + circ(820, 880, 9, '#ffd23f', 3) + pPot(950, 900, .5, t, 0) + rect(880, 860, 50, 36, '#fff', 3, 3);
  s += line(CX + 30, -M, CX + 30 + wave(t, .5, 20), 300, 4) + G(tr(CX + 30 + wave(t, .5, 20), 300), path('M-60 40L60 40L30 -10L-30 -10Z', '#ffd23f', 5) + op(.3, circ(0, 60, 90, '#fff6c8', 0)));
  s += WASH('rgba(255,255,255,.1)');
  s += pParquet(yb, '#b98a5c') + rect(240, 1300, 600, 900, '#5b8fd8', 10, 6) + rect(270, 1320, 540, 900, 'none', 6, 5, '#ffd23f') + pBag(940, 1360, .8, '#e2463a', 10) + pBall(1030, 1600, .6, 0, '#ffd23f');
  if (o.night) s += op(.28, rect(-M, -M, W + 2 * M, H + 2 * M, '#1a1d48', 0, 0));
  return s; }
function chambreH(t, o = {}) { const yb = 1250;
  let s = pWall('dot', o.c1 || '#d9f0d2', o.c2 || '#c4e6b9', yb) + pBase(yb, '#fff');
  s += pWindowView(60, 300, 260, 330, t) + pCurtain(0, 280, 90, 420, '#5b8fd8', t, 1) + pCurtain(290, 280, 90, 420, '#5b8fd8', t, -1);
  s += pPoster(480, 360, 150, 210, '#ff9a4d', -4, circ(0, -20, 40, '#fff', 4) + path('M-20 40L0 -10L20 40Z', '#e2463a', 4), t) + pPoster(660, 400, 130, 170, '#b56cff', 5, ftext(0, 10, '★', { size: 70, fill: '#ffd23f', stroke: 'none' }), t);
  s += G(tr(860, 300, 1, 6 + wave(t, .5, 2)), path('M-90 -40L120 0L-90 40Z', '#36a85a', 6) + ftext(-20, 12, 'LÉO', { size: 32, fill: '#fff', stroke: 'none' }));
  s += wallClock(1010, 470, 46, t) + pShelf(720, 640, 330, pBooks(730, 640, 150, 7) + pTeddy(920, 640, .6) + pTrophy(1000, 640, .6)) + pOutlet(560, 1180);
  s += G(tr(900, yb), rect(-220, -230, 40, 230, '#b98552', 8, 6) + rect(-200, -110, 420, 90, '#b98552', 10, 6) + rect(-190, -150, 400, 60, '#fff', 20, 5) + path('M-120 -150Q60 -190 230 -150L230 -40L-120 -40Z', '#5b8fd8', 6) + ell(-150, -170, 60, 30, '#fff', 5));
  s += WASH() + pParquet(yb, '#c49a6c') + pRug(CX, 1480, 760, 160, '#5ec4f0', '#ffd23f');
  s += G(tr(170, 1320), [0, 1, 2, 3].map(i => path(`M${-90 + i * 8} ${-i * 34}L${90 - i * 6} ${-i * 34}L${84 - i * 6} ${-i * 34 - 30}L${-84 + i * 8} ${-i * 34 - 30}Z`, DPAL[i + 1], 4)).join('') + funTagS('À LAVER', 0, -150));
  s += pShoes(820, 1660, .7, '#36a85a') + pBag(960, 1400, .8, '#ff9a4d', 8) + pBall(300, 1700, .6, t * .2, '#e2463a');
  return s; }
const funTagS = (str, x, y) => G(tr(x, y, 1, -6), rect(-str.length * 9 - 14, -18, str.length * 18 + 28, 36, '#fff8e0', 8, 4) + ftext(0, 9, str, { size: 22, fill: '#7a5a3a', stroke: 'none' }));
function houseExt(t, o = {}) { const yb = 1250, dk = o.dusk || 0;
  let s = SKY(t, mixC('#8fd3ff', '#ff9a6b', dk), mixC('#e6f6ff', '#ffe0b0', dk)) + pBirds(t, 3, 260) + op(.8, pSkyline(1010, mixC('#c3d6e4', '#d9a8a0', dk), 4)) + pHaze(.18, '255,245,235') + ell(200, 1080, 500, 120, '#9ccf8a', 0) + ell(900, 1090, 500, 110, '#8fc47c', 0);
  for (let i = 0; i < 4; i++) { const k = (t * .4 + i / 4) % 1; s += op(.7 * (1 - k), circ(770 + k * 60 + wave(t, .5, 10, i), 470 - k * 260, 26 + k * 40, '#eef0f4', 0)); }
  s += rect(730, 470, 70, 150, '#b8352b', 4, 6) + path('M140 640L540 380L940 640Z', '#d9534f', 7) + rect(180, 640, 720, 610, '#f6e3c0', 6, 7) + [0, 1, 2, 3, 4].map(i => line(180, 700 + i * 110, 900, 700 + i * 110, 3, '#ead2a8')).join('');
  [[260, 700], [660, 700]].forEach(([x, y]) => { s += rect(x, y, 160, 150, mixC('#cfe8ff', '#ffd88a', dk), 6, 6) + line(x + 80, y, x + 80, y + 150, 5) + path(`M${x} ${y}L${x + 50} ${y}Q${x + 30} ${y + 70} ${x} ${y + 150}Z`, '#e86a8a', 4) + rect(x - 10, y + 150, 180, 30, '#b98552', 4, 5) + pFlowers(x + 20, y + 150, 4, x, t); });
  s += rect(260, 960, 160, 150, '#cfe8ff', 6, 6) + line(340, 960, 340, 1110, 5) + rect(470, 920, 140, 330, '#5b8fd8', 6, 6) + circ(585, 1090, 10, '#ffd23f', 4) + rect(450, 1230, 180, 20, '#c9b8a0', 3, 5) + rect(660, 960, 160, 150, '#cfe8ff', 6, 6) + line(740, 960, 740, 1110, 5);
  s += rect(500, 870, 80, 34, '#fff8e0', 6, 4) + ftext(540, 896, 'N°7', { size: 22, fill: '#7a5a3a', stroke: 'none' });
  s += tree(1000, 1250, .85, t) + pPine(80, 1250, .8, t) + pBush(160, 1250, .6) + pBush(880, 1250, .55, '#4fa64f') + G(tr(980, 1260), rect(-6, -150, 12, 150, '#8a5a3a', 3, 4) + rect(-50, -200, 100, 60, '#e2463a', 18, 5) + ftext(0, -160, 'FAMILLE', { size: 16, fill: '#fff', stroke: 'none' }));
  s += pFence(-M, 440, 1260, '#fff') + pFence(640, W + M, 1260, '#fff') + rect(-M, 1260, W + 2 * M, 200, '#8fd16a', 0, 0) + rect(440, 1260, 200, 200, '#d8c8a8', 0, 4) + rect(-M, 1460, W + 2 * M, 110, '#c8ccd2', 0, 0) + line(-M, 1460, W + M, 1460, 6, '#9aa0a8') + rect(-M, 1570, W + 2 * M, 600, '#6e747c', 0, 0) + Array.from({ length: 8 }, (_, i) => rect(-M + i * 300, 1720, 160, 16, '#fff', 4, 0)).join('');
  s += pLampPost(40, 1470, .9, dk > .4) + (o.car !== false ? pCar(900, 1690, .8, '#ffd23f', 1) : '');
  if (dk) s += op(.2 * dk, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff7a3a', 0, 0));
  return s; }
function battery(x, y, s, lvl, t) { const c = lvl < .25 ? '#e2463a' : lvl < .5 ? '#ffb03a' : '#7be07b'; return G(tr(x, y, s), rect(-90, -44, 180, 88, '#fff', 16, 7) + rect(90, -18, 18, 36, OL, 4, 0) + (lvl > 0 ? rect(-78, -32, 156 * lvl, 64, (lvl < .25 && Math.sin(t * 14) > 0) ? '#ffb3a8' : c, 8, 0) : '')); }
function polaroid(x, y, s, r, inner, t, t0) { const k = pop(t, t0, .4); if (k <= 0) return ''; return G(tr(x, y, s * k, r + (1 - k) * 30), rect(-110, -120, 220, 250, '#fff', 8, 6) + clipR(-92, -102, 184, 176, rect(-92, -102, 184, 176, '#bfe6ff', 0, 0) + inner, 4) + rect(-92, -102, 184, 176, 'none', 4, 4) + rect(-30, -136, 60, 30, 'rgba(255,240,180,.8)', 3, 0)); }
const pCone = (x, y, s = 1) => G(tr(x, y, s), rect(-50, -10, 100, 14, '#ff7a2f', 4, 4) + path('M-34 -10L0 -150L34 -10Z', '#ff7a2f', 5) + path('M-24 -50L24 -50', 'none', 12, '#fff'));
function schoolBuilding(x, yb, w, h, t) { let s = path(`M${x - 30} ${yb - h}L${x + w / 2} ${yb - h - 130}L${x + w + 30} ${yb - h}Z`, '#d9534f', 6) + rect(x, yb - h, w, h, '#f0d9b5', 4, 6);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) { if (j === 2 && (i === 1 || i === 2)) continue; const wx = x + 40 + i * (w - 60) / 4, wy = yb - h + 50 + j * 150; s += rect(wx, wy, (w - 60) / 4 - 30, 90, '#cfe8ff', 4, 5) + circ(wx + 20, wy + 60, 12, DPAL[(i + j) % 8], 0) + path(`M${wx + 40} ${wy + 70}L${wx + 52} ${wy + 46}L${wx + 64} ${wy + 70}`, DPAL[(i + j + 3) % 8], 0) + line(wx, wy + 45, wx + (w - 60) / 4 - 30, wy + 45, 4); }
  s += rect(x + w / 2 - 80, yb - 200, 160, 200, '#3e7cc0', 8, 6) + line(x + w / 2, yb - 200, x + w / 2, yb, 5) + rect(x + w / 2 - 130, yb - 270, 260, 56, '#fff8e0', 10, 5) + ftext(x + w / 2, yb - 230, 'ÉCOLE', { size: 36, fill: '#d9534f', stroke: 'none' }) + wallClock(x + w / 2, yb - h - 50, 40, t);
  const fx = x + w - 40, fy = yb - h - 160; s += line(fx, yb - h, fx, fy, 6) + path(`M${fx} ${fy}Q${fx + 40} ${fy - 10 + wave(t, 2, 8)} ${fx + 80} ${fy + wave(t, 2, 10, .5)}L${fx + 80} ${fy + 50 + wave(t, 2, 10, .5)}Q${fx + 40} ${fy + 40 + wave(t, 2, 8)} ${fx} ${fy + 50}Z`, '#5b8fd8', 4);
  return s; }
function schoolyard(t) { const yb = 1180;
  return SKY(t) + op(.8, pSkyline(1120, '#c3d6e4', 3)) + circ(-20, 1080, 90, '#9ccf8a', 0) + circ(1020, 1060, 110, '#9ccf8a', 0) + pHaze(.15) +
    schoolBuilding(-120, yb, 640, 560, t) + pBuilding(560, yb, 700, 470, '#e8c9a0', 4, t, { shop: false }) + pFence(-M, W + M, yb, '#fff') +
    rect(-M, yb, W + 2 * M, 1500, '#c9b8a0', 0, 0) + line(-M, yb, W + M, yb, 7, '#a8987f') +
    [0, 1, 2, 3, 4].map(i => rect(CX - 60 + (i % 2) * 0, 1300 + i * 70, 120, 64, 'none', 4, 5, '#fff')).join('') + ftext(CX, 1660, '★', { size: 60, fill: '#fff', stroke: 'none' }) +
    G(tr(40, yb), rect(-8, -480, 16, 480, '#7d848c', 4, 4) + rect(-90, -520, 120, 80, '#fff', 6, 5) + circ(-40, -436, 30, 'none', 5, '#e2463a')) +
    pBench(260, 1230, .8) + pBush(700, 1200, .8) + pFlowers(780, 1225, 6, 3, t) + tree(950, 1200, .9, t) + pPine(1060, 1200, .7, t) + pBin(470, 1225, .6, '#36a85a') + pBall(620, 1290, .7, t) + pBag(160, 1290, .6, '#ff8fb1', -8) +
    kidsBg(t, 1230, 3); }
function classroomT(t, inner = '') { const yb = 1250;
  let s = pWall('stripe', '#fff1d6', '#ffe8c2', yb) + rect(-M, 960, W + 2 * M, yb - 960, '#d9b88c', 0, 0) + line(-M, 960, W + M, 960, 6, '#b8956a') + pBase(yb, '#a0784e');
  for (let i = 0; i < 8; i++) { const x = 100 + i * 105, y = 160 + Math.sin(i * .7) * 10 + wave(t, .8, 3, i); s += G(tr(x, y, 1, wave(t, .8, 5, i)), rect(-34, -40, 68, 70, DPAL[i % 8], 6, 4) + ftext(0, 14, 'ABCDEFGH'[i], { size: 36, fill: '#fff', stroke: 'none' })); }
  s += path('M40 120Q470 160 900 120', 'none', 4) + rect(60, 250, 960, 560, '#8a6a4a', 18) + rect(80, 270, 920, 520, '#456b55', 10, 0) + op(.15, path('M120 300Q400 340 700 300M150 700Q500 650 900 720', 'none', 12, '#fff')) + inner + rect(120, 790, 840, 18, '#8a6a4a', 6, 4) + rect(180, 774, 50, 18, '#fff', 4, 3) + rect(260, 776, 70, 16, '#ff8fb1', 4, 3) + rect(780, 770, 90, 22, '#3a3a3a', 4, 3);
  s += wallClock(960, 170, 60, t) + windowFrame(-200, 300, 220, 420) + pCurtain(-60, 290, 90, 450, '#ff8fb1', t, -1);
  s += pShelf(-20, 1000, 200, pBooks(-10, 1000, 180, 4)) + pPoster(1040, 600, 90, 300, '#7aa6d8', 4, ftext(0, 0, '1+1', { size: 34, fill: '#fff', stroke: 'none' }), t) + pOutlet(1010, 1170) + pSwitch(40, 900);
  for (let i = 0; i < 4; i++) s += circ(380 + i * 110, 880, 9, '#7d848c', 3) + (i % 2 ? pBag(380 + i * 110, 1010, .5, DPAL[i + 1]) : '');
  return s + pParquet(yb, '#c49a6c') + pBin(1010, 1300, .7) + pPot(60, 1290, .9, t, 1) + pRug(CX, 1520, 700, 140, '#7aa6d8', '#ffd23f'); }
function bedroomN(t, lamp = 0) { const yb = 1250; let s = pWall('star', '#1d2350', '#2e3a80', yb) + rect(-M, 900, W + 2 * M, yb - 900, '#262c5e', 0, 0) + line(-M, 900, W + M, 900, 5, '#3a4290');
  s += pWindowView(620, 230, 360, 420, t, { night: true }); for (let i = 0; i < 6; i++) s += sparkle(650 + (i * 67) % 300, 270 + (i * 113) % 200, .18 + .1 * Math.sin(t * 3 + i), '#fff6d6');
  s += pCurtain(560, 210, 110, 480, '#5a3a8a', t, 1) + pCurtain(930, 210, 110, 480, '#5a3a8a', t, -1);
  s += rect(90, 300, 230, 300, '#ff8fb1', 10) + ftext(205, 470, '★', { size: 120, fill: '#fff', stroke: 'none' }) + pFrame(400, 380, 120, 150, 'sea', '#8a6ad8', 3) + pShelf(60, 720, 420, pBooks(80, 720, 180, 7) + pTrophy(310, 720, .9) + pTeddy(410, 720, .7));
  s += G(tr(820, 1260), rect(-260, -260, 40, 300, '#6b4a8a', 10, 6) + rect(-240, -90, 520, 110, '#8a6ad8', 16, 6) + path('M-220 -100Q20 -150 270 -100L280 0L-220 0Z', '#5ec4f0', 6) + path('M-200 -70Q0 -100 260 -70', 'none', 4, '#3a9ac0') + ell(-160, -130, 70, 34, '#fff', 5) + pTeddy(-40, -110, .6, '#ff9a4d'));
  s += G(tr(470, 1250), rect(-70, -150, 140, 150, '#6b4a8a', 8, 5) + line(-60, -75, 60, -75, 4) + rect(-50, -200, 100, 50, '#141a3a', 8, 4) + ftext(0, -164, Math.sin(t * 6) > 0 ? '02:47' : '02 47', { size: 26, fill: '#ff5c8a', stroke: 'none' }) + op(.25, circ(0, -176, 70, '#ff5c8a', 0)));
  s += pOutlet(70, 1100) + pSwitch(1040, 960);
  return s + rect(-M, yb, W + 2 * M, 1400, '#3a3050', 0, 0) + line(-M, yb, W + M, yb, 6, '#2a2240') + pRug(330, 1420, 520, 120, '#5a3a8a', '#ff8fb1') + pShoes(180, 1330, .55, '#ff8fb1') + pBall(940, 1360, .5, 0, '#ffc83d'); }
function discoBall(x, y, s, t) { let g = circ(0, 0, 90, '#c9d3dc', 7); for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) { if (i * i + j * j > 10) continue; const lit = Math.sin(t * 6 + i * 1.7 + j * 2.3) > .4; g += rect(i * 24 - 10, j * 24 - 10, 20, 20, lit ? '#fff' : '#9aa8b5', 3, 0); } return G(tr(x, y, s), line(0, -400, 0, -90, 6) + g); }
function partyT(t, o = {}) { let s = grad('#3a1a5c', '#170b2a', -M, -M, W + 2 * M, H + 2 * M) + pWall('dot', 'rgba(0,0,0,0)', 'rgba(255,255,255,.05)', 1300); const cols = ['#ff5c8a', '#5ec4f0', '#ffd23f', '#7be07b'];
  s += pWindowView(-120, 640, 220, 300, t, { night: true }) + pWindowView(980, 640, 220, 300, t, { night: true }) + pNeon(940, 1010, 'PARTY', '#ff5c8a', t, 48);
  for (let i = 0; i < 4; i++) { const a = Math.sin(t * .9 + i * 1.6) * 30; s += op(.16, G(tr(150 + i * 260, -50, 1, a), path('M-30 0L30 0L260 1500L-260 1500Z', cols[i], 0))); }
  s += pStreamers(t, -20, 9);
  let gd = 'M-60 300'; for (let i = 0; i < 12; i++) gd += `Q${-60 + i * 110 + 55} ${360} ${-60 + (i + 1) * 110} 300`; s += path(gd, 'none', 5, '#2b2420');
  for (let i = 0; i < 12; i++) s += circ(-5 + i * 110, 338, 14, Math.sin(t * 5 + i * 1.3) > 0 ? cols[i % 4] : '#4a3a5a', 4);
  s += discoBall(CX, 160, .9, t) + pBalloon(70, 520, '#ff5c8a', t, 0, .8) + pBalloon(150, 590, '#ffd23f', t, 1, .7) + pBalloon(960, 540, '#5ec4f0', t, 2, .8) + pBalloon(1030, 610, '#7be07b', t, 3, .7);
  s += G(tr(820, 1300), rect(-150, -150, 300, 24, '#ff9a4d', 6, 5) + line(-130, -126, -130, 0, 8) + line(130, -126, 130, 0, 8) + [-100, -40, 30, 90].map((x, i) => i % 2 ? rect(x - 14, -196, 28, 46, '#e2463a', 4, 4) : ell(x, -164, 36, 14, '#ffd23f', 4)).join(''));
  s += pSpeaker(40, 1310, .9, t) + pSpeaker(1040, 1310, .9, t);
  if (o.dancers !== false) for (let i = 0; i < 5; i++) { const x = 60 + i * 240 + (o.part || 0) * (i < 2 ? -260 : i > 2 ? 260 : 0); s += op(.75, person({ age: 'adult', x, y: 1330 + (i % 2) * 40, s: .62, skin: '#4a2f5e', shirt: '#2e1a46', pants: '#1c1030', hair: KH[i], hairColor: '#1c1030', face: { eyes: 'closed', mouth: 'grin' }, armL: [200 + wave(t, 1.2, 40, i * .2), 250], armR: [-20 - wave(t, 1.2, 40, i * .2 + .5), -70], bob: 3, seed: 80 + i }, t * 1.6)); }
  s += rect(-M, 1300, W + 2 * M, 900, '#1c0f2e', 0, 0); for (let i = 0; i < 8; i++) s += rect(-80 + i * 160, 1320, 150, 70, Math.sin(t * 4 + i * 2) > 0 ? 'rgba(255,92,138,.35)' : 'rgba(94,196,240,.25)', 6, 0);
  for (let i = 0; i < 14; i++) s += rect((i * 97) % 1080, 1420 + (i * 53) % 300, 16, 26, DPAL[i % 8], 3, 0);
  return s; }
function pointHand(tx, ty, ang, sleeve, k = 1, len = 700) { if (k <= 0) return ''; const a = R(ang), off = (1 - k) * 800;
  return G(tr(tx - Math.cos(a) * off, ty - Math.sin(a) * off, 1, ang), line(-len, 0, -100, 0, 74, OL) + line(-len, 0, -100, 0, 60, sleeve) + rect(-54, -18, 70, 36, SKIN, 18, 6) + rect(-130, -46, 96, 92, SKIN, 38, 6) + path('M-100 -10L-50 -10M-100 14L-50 14', 'none', 5) + ell(-82, -46, 30, 16, SKIN, 6)); }
function parkA(t) { const yb = 1200;
  let s = SKY(t, '#9fe0ff', '#fff4dc') + op(.8, pSkyline(1060, '#c3d6e4', 8)) + pHaze(.15) + ell(200, 1130, 540, 130, '#9ccf8a', 0) + ell(900, 1120, 540, 120, '#8fc77d', 0);
  s += tree(110, 1200, 1, t) + pPine(330, 1180, .8, t) + tree(990, 1190, 1.05, t) + pPine(770, 1170, .7, t) + pLampPost(560, 1200, .85) + pBench(840, 1215, .75) + pBin(660, 1210, .55, '#36a85a') + pBirds(t, 2, 330);
  s += rect(-M, yb, W + 2 * M, 1500, '#8fd16a', 0, 0) + line(-M, yb, W + M, yb, 6, '#6fb84a') + path(`M-${M} 1520Q300 1330 540 1400Q800 1470 ${W + M} 1300L${W + M} 1420Q800 1580 540 1520Q300 1460 -${M} 1660Z`, '#e8d8b0', 0);
  s += ell(880, 1290, 180, 40, '#7fc8e8', 5) + G(tr(860 + wave(t, .4, 30), 1280), ell(0, 0, 26, 16, '#fff', 4) + circ(18, -16, 12, '#fff', 4) + path('M28 -16L40 -12L28 -9Z', '#ffb03a', 3));
  s += pBush(60, 1270, .7) + pFlowers(160, 1300, 6, 4, t) + pBush(1010, 1340, .6, '#4fa64f') + kidsBg(t, 1240, 2, .4);
  return s; }
function bathroomT(t) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#cfeaf0', 0, 0); for (let x = -M; x < W + M; x += 120) s += line(x, -M, x, H + M, 4, '#b2d6de'); for (let y = -M; y < H + M; y += 120) s += line(-M, y, W + M, y, 4, '#b2d6de');
  for (let x = -M; x < W + M; x += 120) s += rect(x, 190, 120, 60, ((x / 120) % 2 + 2) % 2 ? '#7fd3e6' : '#ffd23f', 0, 0); s += line(-M, 190, W + M, 190, 4, '#9cc8d2') + line(-M, 250, W + M, 250, 4, '#9cc8d2');
  s += rect(250, 120, 580, 44, '#e8eef0', 22, 5) + [0, 1, 2, 3].map(i => op(.6 + .3 * Math.sin(t * 3 + i), circ(320 + i * 145, 142, 18, '#fff6c8', 4))).join('');
  s += mirror(170, 280, 740, 860) + rect(770, 320, 80, 70, '#ffe066', 3, 3) + rect(700, 330, 70, 60, '#ff8fb1', 3, 3);
  s += line(-10, 520, 120, 520, 10, '#c8ced6') + towel(10, 520, 100, 300, '#ff8fb1', '#fff') + pShelf(940, 640, 150, pJar(980, 640, '#7be07b') + rect(1020, 560, 40, 80, '#5ec4f0', 10, 4) + rect(1028, 540, 24, 22, '#fff', 4, 3)) + pShelf(940, 900, 150, pPot(1010, 900, .6, t, 2, '#fff')) + pOutlet(60, 1000);
  s += rect(-M, 1250, W + 2 * M, 1400, '#e8eef0', 0, 0) + line(-M, 1250, W + M, 1250, 7, '#b8c4c8') + path(`M${CX - 300} 1250L${CX + 300} 1250Q${CX + 280} 1420 ${CX} 1430Q${CX - 280} 1420 ${CX - 300} 1250Z`, '#fff');
  s += rect(CX - 20, 1170, 40, 80, '#c8ced6', 8, 5) + path(`M${CX - 20} 1180L${CX - 20} 1150Q${CX - 20} 1130 ${CX + 30} 1130L${CX + 60} 1130L${CX + 60} 1160`, 'none', 14, '#c8ced6') + (() => { const k = (t * 1.3) % 1; return circ(CX + 60, 1170 + k * 120, 8, '#9fd6ff', 3); })();
  s += G(tr(170, 1250), rect(-36, -110, 72, 110, '#7fd3e6', 14, 5) + line(-10, -110, -16, -170, 7, '#ff8fb1') + line(12, -110, 22, -176, 7, '#5ec4f0')) + G(tr(900, 1250), rect(-40, -120, 80, 120, '#fff', 20, 5) + rect(-10, -150, 20, 30, '#c8ced6', 4, 4) + path('M10 -150L46 -150', 'none', 8, '#c8ced6')) + G(tr(990, 1250 + wave(t, 1.2, 3)), ell(0, -30, 44, 30, '#ffd23f', 5) + circ(24, -70, 24, '#ffd23f', 5) + path('M44 -72L66 -66L44 -60Z', '#ff9a4d', 3) + circ(30, -76, 4, OL, 0));
  return s; }

// ============================================================
//  ÉPISODE « parents divorcés » : héros Léo (cœur rapiécé rose/bleu sur le t-shirt = maman/papa), maman (rose), papa (bleu), Kevin
// ============================================================
const MOMC = '#ff6fa5', DADC = '#4d9de0';
const tint = (c, k) => op(k, rect(-M, -M, W + 2 * M, H + 2 * M, c, 0, 0));
// cœur coupé en deux (zigzag) : moitié rose = maman, moitié bleue = papa ; gap = écart entre les moitiés
function splitHeart(x, y, s, gap = 8) { const L = 'M0 -14L-7 2L5 16L-5 32L0 46C-16 32 -46 18 -46 -6C-46 -30 -16 -40 0 -14Z', Rr = 'M0 -14L-7 2L5 16L-5 32L0 46C16 32 46 18 46 -6C46 -30 16 -40 0 -14Z';
  return G(tr(x, y, s), G(`translate(${f1(-gap / 2)} 0)`, path(L, MOMC, 5)) + G(`translate(${f1(gap / 2)} 0)`, path(Rr, DADC, 5))); }
const HERO = { age: 'kid', hair: 'short', hairColor: '#5a3a26', shirt: '#ffe08a', pants: '#3b4a6b', seed: 2 };
function leo(o, t) { const a = o.age || 'kid', bob = (o.bob ?? 1) * wave(t, .8, 4, 2); return person(Object.assign({}, HERO, o), t) + (o.patch === false ? '' : G(ptr(o), splitHeart(0, (a === 'adult' ? -255 : -150) + bob, a === 'adult' ? .7 : .55, o.gap ?? 10))); }
const leoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, HERO, o), t));
const teen = (o, t) => leo(Object.assign({ age: 'adult', hair: 'side' }, o), t);
const teenHead = (x, y, r, o, t) => leoHead(x, y, r, Object.assign({ hair: 'side' }, o), t);
const MOM = { age: 'adult', hair: 'long', hairColor: '#6b3e26', shirt: MOMC, pants: '#4b3b6e', necklace: true, seed: 4 };
const DAD = { age: 'adult', hair: 'side', hairColor: '#3a2a20', glasses: true, shirt: DADC, pants: '#2f3b4e', seed: 8 };
const mom = (o, t) => person(Object.assign({}, MOM, o), t), dad = (o, t) => person(Object.assign({}, DAD, o), t);
const momHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, MOM, o), t));
const dadHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, DAD, o), t));
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const prof = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#8a5a3a', glasses: true, shirt: '#e2463a', pants: '#4b5b7a', seed: 6 }, o), t);
const profHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'bun', hairColor: '#8a5a3a', glasses: true, seed: 6 }, o), t));

// ---------- accessoires ----------
const suitcase = (x, yb, s = 1, c = '#e2463a', r = 0) => G(tr(x, yb, s, r), path('M-40 -220L-40 -270Q-40 -290 -20 -290L20 -290Q40 -290 40 -270L40 -220', 'none', 12) + rect(-100, -225, 200, 200, c, 24, 6) + line(-50, -215, -50, -35, 5, shade(c, -.25)) + line(50, -215, 50, -35, 5, shade(c, -.25)) + circ(-60, -10, 16, '#3a3f4a', 5) + circ(60, -10, 16, '#3a3f4a', 5) + G(tr(-10, -150, 1, -12), rect(-34, -22, 68, 44, '#fff', 8, 4) + heart(0, 0, .3, MOMC)) + G(tr(30, -80, 1, 10), rect(-30, -20, 60, 40, '#ffd23f', 20, 4)));
const toothbrush = (x, y, s, c, r = 0) => G(tr(x, y, s, r), rect(-9, -40, 18, 170, c, 9, 4) + rect(-13, -100, 26, 60, '#fff', 6, 4) + line(-6, -96, -6, -46, 3, '#9fd6ff') + line(6, -96, 6, -46, 3, '#9fd6ff'));
const cup = (x, y, s, c) => G(tr(x, y, s), path('M-50 -100L50 -100L40 0L-40 0Z', c, 6) + line(-36, -70, 36, -70, 4, 'rgba(255,255,255,.6)'));
function agenda(x, y, s, t, t0) { const k = popEl(t, t0, .5); if (k <= 0) return ''; const days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']; let g = rect(-400, -300, 800, 600, '#fff', 24, 7) + rect(-400, -300, 800, 90, SX.acc, 24, 7) + ftext(0, -238, 'EMPLOI DU TEMPS', { size: 46, fill: '#fff' });
  days.forEach((d, i) => { const cx = -342 + i * 114; g += ftext(cx, -170, d, { size: 26, fill: OL, stroke: 'none' }); for (let j = 0; j < 4; j++) { const c = (i * 3 + j * 5) % 4 < 2 ? MOMC : DADC, on = popEl(t, t0 + .1 + (i + j) * .04, .3); if (on > 0) g += G(tr(cx, -110 + j * 100, on), rect(-50, -40, 100, 80, c, 12, 4) + path('M-20 10L0 -14L20 10Z', '#fff', 0) + rect(-14, 10, 28, 20, '#fff', 0, 0)); } });
  return G(tr(x, y, s * k, -3), g); }
const miniHouse = (x, yb, s, c, roof) => G(tr(x, yb, s), rect(-140, -220, 280, 220, c, 8, 7) + path('M-175 -215L0 -350L175 -215Z', roof, 7) + rect(-30, -110, 60, 110, shade(c, -.35), 6, 5) + rect(-110, -180, 60, 54, '#cfe8ff', 6, 5) + rect(50, -180, 60, 54, '#cfe8ff', 6, 5) + rect(60, -330, 34, 60, shade(roof, -.2), 3, 5));
function cake(x, y, s, t, c = '#ff8fb1', n = 3) { let g = rect(-180, -110, 360, 180, c, 30) + path('M-180 -70Q-130 -30 -90 -70T0 -70T90 -70T180 -70', 'none', 14, '#fff') + rect(-210, 60, 420, 28, '#fff', 14);
  for (let i = 0; i < n; i++) { const cx = (i - (n - 1) / 2) * 80; g += rect(cx - 9, -190, 18, 80, ['#7aa6d8', '#ffd23f', '#7be07b'][i % 3], 4, 4) + G(tr(cx, -206, 1 + .15 * Math.sin(t * 20 + i)), path('M0 -24Q13 -2 0 8Q-13 -2 0 -24Z', '#ffb340', 3)); } return G(tr(x, y, s), g); }
function xmasTree(x, yb, s, t) { let g = rect(-26, -80, 52, 80, '#8a5a3a', 6, 5) + path('M-200 -80L0 -300L200 -80Z', '#3f9a5a', 6) + path('M-160 -220L0 -420L160 -220Z', '#4fa66a', 6) + path('M-110 -350L0 -520L110 -350Z', '#5fb87a', 6);
  [[-120, -110], [90, -130], [-60, -250], [70, -270], [0, -180], [-30, -400], [40, -380]].forEach(([a, b], i) => g += circ(a, b, 18, Math.sin(t * 8 + i * 1.7) > 0 ? DPAL[i % 8] : '#fff6c8', 4));
  g += G(tr(0, -540, 1 + .1 * Math.sin(t * 6), t * 40), path('M0 -40L12 -12L42 -12L18 6L28 36L0 18L-28 36L-18 6L-42 -12L-12 -12Z', '#ffd23f', 5)); return G(tr(x, yb, s), g + pGift(-150, 0, .8, '#e2463a') + pGift(150, 0, .8, '#5ec4f0', '#fff')); }
function brain2(x, y, s, t) { let g = path('M-170 40Q-200 -60 -130 -110Q-110 -170 -30 -160Q20 -200 90 -150Q170 -140 175 -50Q210 30 140 80Q90 130 0 110Q-90 130 -170 40Z', '#ffb8cc', 7) + path('M-100 -60Q-60 -30 -90 10M20 -120Q0 -60 40 -30M90 -40Q120 10 80 50M-30 40Q0 70 40 60', 'none', 6, '#e88aa6');
  const b = wave(t, .6, 10); g += line(-80 + b, 0, 80 - b, 10, 4, '#ffd23f') + G(tr(-80 + b, 0), circ(0, 0, 26, '#fff6a0', 5) + circ(-8, -4, 4, OL, 0) + circ(8, -4, 4, OL, 0) + path('M-8 8Q0 14 8 8', 'none', 3)) + G(tr(80 - b, 10), circ(0, 0, 26, '#fff6a0', 5) + circ(-8, -4, 4, OL, 0) + circ(8, -4, 4, OL, 0) + path('M-8 8Q0 14 8 8', 'none', 3) + line(20, -10, 40, -30, 5));
  return G(tr(x, y, s), g); }
const hangLamp = (x, y, t, k = 1) => { const sw = wave(t, .6, 8); return G(tr(x, 0, 1, sw), line(0, -M, 0, y, 6) + op(.28 * k, path(`M-50 ${y + 40}L50 ${y + 40}L380 ${y + 1200}L-380 ${y + 1200}Z`, '#fff6b0', 0)) + path(`M-90 ${y + 50}L90 ${y + 50}L40 ${y - 20}L-40 ${y - 20}Z`, '#3a3f4a', 6) + circ(0, y + 52, 22, '#fff6b0', 4)); };
const magGlass = (x, y, s, r = 0) => G(tr(x, y, s, r), line(0, 60, 0, 190, 22, '#8a5a3a') + circ(0, 0, 70, 'rgba(200,235,255,.55)', 10) + path('M-36 -20Q-30 -46 -6 -50', 'none', 7, '#fff'));
const notebook = (x, y, s, r = 0) => G(tr(x, y, s, r), rect(-70, -90, 140, 180, '#fff8e0', 10, 5) + [0, 1, 2, 3].map(i => line(-50, -50 + i * 34, 50, -50 + i * 34, 4, '#9ab')).join('') + rect(-70, -90, 20, 180, MOMC, 6, 4));
const mic = (x, y, s, r = 0) => G(tr(x, y, s, r), rect(-12, 0, 24, 140, '#3a3f4a', 8, 5) + circ(0, -20, 40, '#c9ced6', 6) + rect(-34, 20, 68, 40, SX.acc, 8, 4) + ftext(0, 50, 'TV', { size: 24, fill: '#fff', stroke: 'none' }));
const fedora = (x, y, r) => G(tr(x, y), ell(0, -r * .62, r * 1.25, r * .22, '#6b5a4a', 6) + path(`M${-r * .7} ${-r * .66}Q${-r * .72} ${-r * 1.45} 0 ${-r * 1.3}Q${r * .72} ${-r * 1.45} ${r * .7} ${-r * .66}Z`, '#7d6a58', 6) + rect(-r * .7, -r * .86, r * 1.4, r * .2, '#2b2420', 0, 0) + G(tr(r * .35, -r * 1.02, 1, 8), rect(-r * .32, -r * .17, r * .64, r * .34, '#fff', 4, 4) + ftext(0, r * .08, 'PRESSE', { size: r * .15, fill: SX.acc, stroke: 'none' })));
const tape = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-70, -22, 140, 44, '#f4f1e2', 6, 5) + rect(-22, -50, 44, 100, '#f4f1e2', 6, 5));
const consoleIco = (x, y, s) => G(tr(x, y, s), path('M-120 -30Q-150 70 -90 80Q-60 80 -50 40L50 40Q60 80 90 80Q150 70 120 -30Q110 -60 70 -60L-70 -60Q-110 -60 -120 -30Z', '#3a3f4a', 6) + circ(-70, 0, 18, '#666', 4) + [[70, -20, '#7be07b'], [100, 0, '#e2463a'], [40, 0, '#5ec4f0'], [70, 20, '#ffd23f']].map(([a, b, c]) => circ(a, b, 11, c, 4)).join(''));
const phoneIco = (x, y, s, r = 0) => phone(x, y, s, r, rect(-50, -100, 100, 60, '#5ec4f0', 8, 0) + rect(-50, -30, 100, 30, '#ff8fb1', 8, 0));
const calPage = (x, y, s, str, c, r = 0, sub = '') => G(tr(x, y, s, r), rect(-110, -130, 220, 260, '#fff', 16, 6) + rect(-110, -130, 220, 70, c, 16, 6) + ftext(0, -82, str, { size: 34, fill: '#fff', stroke: 'none' }) + (sub ? ftext(0, 40, sub, { size: 90, fill: OL, stroke: 'none' }) : ''));
const tie = (x, y, s) => G(tr(x, y, s), path('M-16 0L16 0L10 20L28 110L0 140L-28 110L-10 20Z', '#2f3b6e', 5));
const crackPath = (x0, y0, k) => k <= 0 ? '' : `<path d="M${x0} ${y0}l40 70l-50 60l70 80l-40 90l60 70l-30 110" fill="none" stroke="${OL}" stroke-width="10" stroke-linejoin="round" stroke-dasharray="${f1(600 * k)} 900"/>`;
function qMarks(t, t0, n = 9, seed = 3) { if (t < t0) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = 90 + r() * 900, y0 = 680 + r() * 480, k = popEl(t, t0 + i * .06, .4); if (k > 0) s += G(tr(x, y0 + wave(t, .9, 12, i), k * (.7 + r() * .6), (r() - .5) * 40), ftext(0, 40, '?', { size: 130, fill: [SX.acc, SX.acc2, SX.cool, '#fff'][i % 4] })); } return s; }
function flashes(t, n = 6, seed = 4) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * 1080, y = 380 + r() * 600, ph = r(); if (((t * 3 + ph) % 1) < .12) s += impactStar(x, y, .8, '#fff'); } return s; }
// split-screen gauche / droite
const split = (l, r, x = 540) => clipR(-M, -M, x + M, H + 2 * M, l, 0) + clipR(x, -M, W - x + M, H + 2 * M, r, 0) + line(x, -M, x, H + M, 16) + line(x, -M, x, H + M, 6, '#fff');
// anniversaire (salon festif) : guirlandes, ballons, banderole
function bdaySalon(t, o = {}) { return salonF(t, o) + pStreamers(t, -20, 9) + pBalloon(90, 520, '#ff5c8a', t, 0, .8) + pBalloon(170, 600, '#ffd23f', t, 1, .7) + pBalloon(990, 560, '#5ec4f0', t, 2, .8) +
  G(tr(CX, 150 + wave(t, .5, 4)), path('M-420 -30Q0 40 420 -30L420 40Q0 110 -420 40Z', '#fff8e0', 6) + ftext(0, 52, 'JOYEUX ANNIV', { size: 52, fill: SX.acc, stroke: 'none' })); }
// texte de fin
const momTag = (x, y, str, t, t0) => funTag(x, y, str, t, t0, { size: 50, bg: MOMC });
const dadTag = (x, y, str, t, t0) => funTag(x, y, str, t, t0, { size: 50, bg: DADC });

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, la famille en cut-out ; sur DIVORCÉS la feuille se déchire, les parents s'écartent, Léo « débloqué »
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const D = at(1, 'divorces'), k = eOutBack(seg(t, D, D + .4));
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + (t > D ? G(tr(CX, 0), path(`M-14 560L14 640L-18 720L16 800L-14 880L18 960L-12 1040L16 1120L-10 1250`, 'none', 14, SX.acc2)) : '') +
      cutout(mom({ x: 270 - k * 90, y: 1370, s: .95, expr: t > D ? 'annoyed' : 'happy', rot: -k * 6 }, t), 12) + cutout(dad({ x: 810 + k * 90, y: 1370, s: .95, expr: t > D ? 'annoyed' : 'happy', flip: 1, rot: k * 6 }, t), 12) +
      unlock(CX, 1060, t, D, { part: 'back', r: 480 }) + G(tr(CX, 1380, 1 + .04 * Math.sin(t * 7)), cutout(leo({ x: 0, y: 0, s: 1.0, expr: t > D ? 'shock' : 'happy', face: t > D ? { eyes: 'huge' } : {}, gap: 10 + 30 * k }, t), 10)) + unlock(CX, 1060, t, D, { part: 'front', r: 480 }) +
      kthin("POURQUOI C'EST HORRIBLE", CX, 330, t, .05, { size: 52 }) + kthin("D'ÊTRE L'ENFANT DE", CX, 415, t, .3, { size: 58 }) + kword('PARENTS DIVORCÉS ?', CX, 540, t, at(1, 'parents') - .05, { size: 68, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'parents') - .05, 'boom', .6], [at(1, 'divorces'), 'crack', .8], [at(1, 'divorces') + .1, 'sparkle', .6]] });
// B002 — 8 ans : la photo de famille se déchire en deux sur « divorcent »
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => { const R_ = at(2, 'divorcent'), k = eOutCubic(seg(t, R_ - .1, R_ + .35));
    const inner = rect(-260, -200, 520, 400, '#bfe6ff', 0, 0) + rect(-260, 110, 520, 90, '#8fd16a', 0, 0) + circ(180, -130, 40, '#fff3b0', 0) + momHead(-140, -10, 80, { expr: 'happy' }, t) + dadHead(140, -20, 80, { expr: 'happy' }, t) + leoHead(0, 70, 62, { expr: 'joy' }, t);
    const photo = rect(-290, -230, 580, 520, '#fff', 10, 7) + inner + rect(-260, -200, 520, 400, 'none', 2, 4);
    return paper(SX.paper) + gobo(T, .12) + burst(CX, 860, 360, t, R_, '#ffd0de', 16) +
      G(tr(CX - k * 120, 860, 1, -k * 12), clipR(-300, -260, 300, 600, photo, 0)) + G(tr(CX + k * 120, 860, 1, k * 12), clipR(0, -260, 300, 600, photo, 0)) +
      funTag(CX, 410, '8 ANS', t, at(2, 'huit') - .05, { size: 60, bg: SX.acc2 }) + (k > .5 ? kword('DIVORCE !', CX, 560, t, R_ + .1, { size: 80, fill: SX.acc }) : ''); },
  sfx: [[at(2, 'huit') - .05, 'pop', .6], [at(2, 'annoncent'), 'hmm', .4], [at(2, 'divorcent') - .1, 'crack', .9], [at(2, 'divorcent') + .1, 'boom', .5]] });
// B003 — ils te regardent droit dans les yeux : deux têtes géantes, regard fixe, crash zoom
B(3, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1, 1.12, eOutCubic(seg(t, at(3, 'droit') - .1, at(3, 'droit') + .3))), shake: t > at(3, 'yeux') ? 3 : 0 }),
  draw: (t, d, T) => gridBg('#2a2440') + halftoneFade(SX.acc, .08, 1) + cutout(momHead(310, 860, 190, { expr: 'deadpan', face: { eyes: 'huge' } }, t), 12) + cutout(dadHead(770, 860, 190, { expr: 'deadpan', face: { eyes: 'huge' } }, t), 12) +
    leoHead(CX, 1120, 90, { expr: 'scared', look: [0, -1] }, t) + sweatSpray(CX, 1080, t, 4) + kthin('droit dans', CX, 400, t, at(3, 'droit') - .05, { size: 58 }) + kword('LES YEUX', CX, 520, t, at(3, 'yeux') - .05, { size: 110, fill: SX.acc2 }),
  sfx: [[.1, 'hmm', .5], [at(3, 'droit') - .1, 'whoosh', .6], [at(3, 'yeux') - .05, 'sting', .6], [at(3, 'yeux') + .2, 'gulp', .6]] });
// B004 — « rien ne va changer » : salon, sourires forcés… et le mur se fissure, le cadre tombe
B(4, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3, shake: t > at(4, 'changer') ? 5 : 0 }),
  draw: (t, d, T) => { const C = at(4, 'changer'), k = seg(t, C - .1, C + .35), f = eInOut(seg(t, C, C + .4));
    return salonF(t) + G(tr(0, 0), crackPath(170, 640, k)) + (f > 0 ? G(tr(290, 530 + f * 600, 1, f * 80), rect(-70, -85, 140, 170, '#5b8fd8', 6, 6) + rect(-58, -73, 116, 146, '#fff1c8', 0, 0)) : '') +
      mom({ x: 230, y: 1560, s: 1.2, expr: 'happy', face: { brows: 'sad' }, armR: [-10, -40] }, t) + dad({ x: 850, y: 1560, s: 1.2, expr: 'happy', face: { brows: 'sad' }, flip: 1, armR: [-10, -40] }, t) + sweatSpray(230, 1060, t, 3) +
      leo({ x: CX, y: 1560, s: 1.25, expr: t > C ? 'suspicious' : 'worried' }, t) + kthin('rien ne va', CX, 400, t, at(4, 'rien') - .05, { size: 60, fill: OL }) + kword('CHANGER', CX, 510, t, C - .05, { size: 100, fill: '#fff' }) + funTag(CX + 230, 640, '(promis)', t, at(4, 'cheri'), { size: 36, bg: '#fff' }); },
  sfx: [[.1, 'kiss', .4], [at(4, 'cheri'), 'pop', .5], [at(4, 'changer') - .1, 'crack', .8], [at(4, 'changer') + .3, 'thud', .7], [at(4, 'changer') + .4, 'boing', .4]] });
// B005a — « Trois semaines plus tard » : carton façon dessin animé, horloge qui file
const O5b = at(5, 'tu') - .12, O5c = at(5, 'deux', 2) - .15;
B(5, { enter: 'none', trans: 'circle', transD: .3, cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => grad('#ffb3c9', '#ffe0ea', -M, -M, W + 2 * M, H + 2 * M) + pWall('star', 'rgba(0,0,0,0)', 'rgba(255,255,255,.5)', 1900) + blob(CX, 800, 380, t, SX.acc2, 3, { t0: .02 }) + G(tr(CX, 860), circ(0, 0, 150, '#fff', 8) + line(0, 0, 0, -100, 10) + G(`rotate(${f1(t * 900)})`, line(0, 0, 0, -120, 7, SX.acc)) + circ(0, 0, 14, OL, 0)) +
    kword('3 SEMAINES', CX, 480, t, at(5, 'trois') - .05, { size: 100, fill: '#fff' }) + kthin('plus tard…', CX, 1110, t, at(5, 'plus') - .05, { size: 70, fill: OL }),
  sfx: [[at(5, 'trois') - .05, 'boom', .5], [.1, 'clock_fast', .6], [at(5, 'plus'), 'whoosh', .4]] });
// B005b — deux chambres : split-screen, chambre rose chez maman / chambre bleue chez papa, Léo dans les deux
B(5, { enter: 'whip', cam: zin(1.02, 1.07, .3),
  draw: (t, d, T) => { const D2 = at(5, 'deux') - O5b;
    return split(chambreH(t, { c1: '#ffd9e6', c2: '#ffc4d8' }) + tint(MOMC, .08) + leo({ x: 290, y: 1530, s: 1.25, expr: 'confused', look: [1, 0] }, t), chambreH(t, { c1: '#d6e8ff', c2: '#c2dcff' }) + tint(DADC, .08) + leo({ x: 790, y: 1530, s: 1.25, expr: 'confused', look: [-1, 0], flip: 1 }, t)) +
      momTag(270, 420, 'MAMAN', t, .05) + dadTag(810, 420, 'PAPA', t, .15) + funTag(CX, 560, '2 CHAMBRES', t, D2 - .05, { size: 64, bg: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.15, 'pop_hi', .4], [at(5, 'deux') - O5b - .05, 'boing', .6]] }, O5b);
// B005c — deux brosses à dents… et un emploi du temps de MINISTRE (cravate, téléphones qui sonnent)
B(5, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const BR = at(5, 'brossadans') - O5c, E = at(5, 'emploi') - O5c, Mi = at(5, 'ministre') - O5c;
    return bathroomT(t) + leo({ x: CX, y: 1490, s: 1.3, expr: t > Mi ? 'panic' : 'neutral', armL: [200, 230], armR: [-20, -50], holdL: t > BR ? toothbrush(0, -40, .7, MOMC, -20) : '', holdR: t > BR ? toothbrush(0, -40, .7, DADC, 20) : '' }, t) +
      (t > Mi ? tie(CX, 1490 - 214 * 1.3 + 12, 1.1) + phoneIco(170 + wave(t, 3, 8), 900, .8, -10) + phoneIco(910 - wave(t, 3, 8), 960, .8, 12) : '') +
      funTag(CX, 420, '2 BROSSES À DENTS', t, BR, { size: 48, bg: SX.cool }) + agenda(CX, 770, .62, t, E) + (t > Mi ? kword('MINISTRE', CX, 560, t, Mi - .05, { size: 96, fill: SX.acc2 }) : ''); },
  sfx: [[at(5, 'brossadans') - O5c, 'pop', .7], [at(5, 'brossadans') - O5c + .15, 'pop_hi', .5], [at(5, 'emploi') - O5c, 'whoosh_up', .6], [at(5, 'ministre') - O5c - .05, 'boom', .5], [at(5, 'ministre') - O5c + .1, 'ring', .5]] }, O5c);
// B006 — « Bienvenue » : devant la maison, paillasson BIENVENUE, deux valises, confettis ironiques
B(6, { enter: 'none', trans: 'wipe', cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => houseExt(t) + leo({ x: CX - 60, y: 1500, s: 1.3, expr: 'deadpan', armL: [120, 95] }, t) + suitcase(300, 1520, .9, MOMC, -4) + suitcase(760, 1520, .9, DADC, 5) + G(tr(CX, 1560), rect(-200, -30, 400, 70, '#c8955a', 12, 5) + ftext(0, 22, 'BIENVENUE', { size: 40, fill: '#7a4a2a', stroke: 'none' })) +
    confetti(t, at(6, 'bienvenue')) + kword('BIENVENUE', CX, 430, t, at(6, 'bienvenue') - .05, { size: 104, fill: SX.acc2 }) + funTag(CX, 580, 'NIVEAU : DIVORCÉ', t, at(6, 'divorces') - .1, { size: 46, bg: SX.acc }),
  sfx: [[at(6, 'bienvenue') - .05, 'tada', .6], [at(6, 'bienvenue') + .1, 'pop', .5], [at(6, 'divorces') - .1, 'error_beep', .4]] });
// B007 — Lundi chez maman (maison rose, maman fait coucou)
B(7, { enter: 'whip', cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => houseExt(t) + tint(MOMC, .1) + mom({ x: 540, y: 1250, s: .95, expr: 'joy', armR: [-60, -110] }, t) + leo({ x: 220 + t * 120, y: 1520, s: 1.25, expr: 'neutral', walk: 3, holdR: suitcase(10, 120, .5, MOMC) }, t) + calPage(860, 560, .9, 'LUNDI', MOMC, 6, '1') + momTag(CX, 420, 'CHEZ MAMAN', t, at(7, 'chez') - .05),
  sfx: [[0, 'whoosh', .6], [at(7, 'lundi'), 'pop', .6], [at(7, 'chez'), 'steps', .5], [at(7, 'maman'), 'kiss', .4]] });
// B008 — Vendredi chez papa (rue, immeuble de papa)
B(8, { enter: 'whip', cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => streetT(t, 2) + tint(DADC, .08) + dad({ x: 560, y: 1290, s: 1.0, expr: 'happy', armR: [-60, -110], flip: 1 }, t) + leo({ x: 880 - t * 120, y: 1520, s: 1.25, expr: 'neutral', walk: 3, flip: 1, holdR: suitcase(10, 120, .5, DADC) }, t) + calPage(210, 560, .9, 'VENDREDI', DADC, -6, '5') + dadTag(CX, 420, 'CHEZ PAPA', t, at(8, 'chez') - .05),
  sfx: [[0, 'whoosh', .6], [at(8, 'vendredi'), 'pop', .6], [at(8, 'chez'), 'steps', .5]] });
// B009 — Dimanche, retour chez maman : Léo fait la navette, tout tourne (dizzy)
B(9, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: 1.05, r: Math.sin(t * 6) * 3 }),
  draw: (t, d, T) => houseExt(t, { dusk: .5 }) + tint(MOMC, .08) + motionLines(CX + 220, 1150, 4, 90, 0) + leo({ x: CX, y: 1520, s: 1.3, expr: 'dizzy', rot: Math.sin(t * 9) * 8, holdR: suitcase(10, 120, .5, '#ffd23f') }, t) +
    G(tr(CX, 900, 1, t * 200), circ(0, -260, 14, '#ffd23f', 4) + circ(220, 130, 14, '#fff', 4) + circ(-220, 130, 14, SX.acc, 4)) + calPage(860, 560, .9, 'DIMANCHE', MOMC, 6, '7') + momTag(CX, 420, 'RETOUR', t, at(9, 'retour') - .05) + markerArrow(250, 650, 430, 560, t, at(9, 'maman') - .1, { col: MOMC }),
  sfx: [[0, 'whoosh', .6], [at(9, 'dimanche'), 'pop', .5], [at(9, 'retour'), 'boing', .6], [at(9, 'maman'), 'scratch', .4]] });
// B010a — le cartable est resté chez papa : entrée chez maman, crochet vide, bulle = le cartable sur le canapé de papa
const O10b = at(10, 'magnifique') - .15;
B(10, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .6 }),
  draw: (t, d, T) => { const C = at(10, 'cartable'), R_ = at(10, 'reste');
    return entree(t) + leo({ x: 330, y: 1500, s: 1.3, expr: t > R_ ? 'panic' : 'worried', armL: [200, 220], armR: [-20, -40] }, t) + (t > R_ ? sweatSpray(330, 1040, t, 5) : '') +
      (t > C ? G(tr(690, 760), cloud(0, 0, 2.2, '#fff', 6) + circ(-230, 230, 26, '#fff', 6) + circ(-280, 290, 16, '#fff', 6) + clipR(-200, -120, 400, 240, rect(-200, -120, 400, 240, '#d6e8ff', 0, 0) + sofa(0, 160, .5, DADC) + pBag(0, 40, .9, '#ff9a4d'), 30)) : '') +
      (t > R_ ? markerCircle(690, 800, 110, 90, t, R_, { col: SX.acc }) + dadTag(690, 560, 'CHEZ PAPA', t, at(10, 'papa') - .05) : '') + funTag(330, 420, 'CARTABLE ?', t, C, { size: 56, bg: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(10, 'cartable'), 'pop', .6], [at(10, 'reste'), 'error_beep', .6], [at(10, 'papa'), 'scratch', .5]] });
// B010b — « Magnifique. » : gros plan blasé, applaudissement lent, paillettes ironiques
B(10, { enter: 'punch', cam: () => ({ z: 1.1 }),
  draw: (t, d, T) => entree(t) + tint('#000', .15) + leoHead(CX, 880, 240, { expr: 'deadpan', face: { eyes: 'half' } }, t) + kword('MAGNIFIQUE.', CX, 470, t, .02, { size: 96, fill: SX.acc2 }) + sparkle(260, 640, .6 + .3 * Math.sin(t * 20)) + sparkle(820, 700, .5 + .3 * Math.sin(t * 20 + 1), '#fff'),
  sfx: [[0, 'sparkle', .5], [.05, 'drum', .4]] }, O10b);
// B011 — à l'école : pupitre vide, Léo explique les mains écartées
B(11, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const A = at(11, 'affaires');
    return classroomT(t, ftext(540, 470, 'Lundi', { size: 60, fill: 'rgba(255,255,255,.8)', stroke: 'none' }) + ftext(540, 600, 'Devoirs : p. 42', { size: 50, fill: 'rgba(255,255,255,.6)', stroke: 'none' })) + kidsBg(t, 1240, 2, .5) +
      leo({ x: CX, y: 1470, s: 1.25, expr: 'embarrassed', armL: [170, 200], armR: [10, -20] }, t) + G(tr(CX, 1420), rect(-260, -40, 520, 40, '#c58e55', 8, 6) + line(-220, 0, -220, 300, 12) + line(220, 0, 220, 300, 12)) +
      (t > A ? G(tr(CX, 1360), op(.6, ftext(0, 0, 'vide…', { size: 40, fill: OL, stroke: 'none', font: SX.marker }))) : '') + funTag(CX, 420, "PAS D'AFFAIRES", t, A - .05, { size: 56, bg: SX.acc }) + markerArrow(780, 1180, 640, 1350, t, A + .1, { col: SX.acc2 }); },
  sfx: [[0, 'school_bell', .4], [at(11, 'expliques'), 'hmm', .4], [at(11, 'affaires') - .05, 'pop', .6], [at(11, 'affaires') + .1, 'scratch', .4]] });
// B012 — le prof demande pourquoi : gros plan prof soupçonneuse, point d'interrogation géant
B(12, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), r: -3 }),
  draw: (t, d, T) => classroomT(t) + tint('#fff', .15) + profHead(CX - 60, 880, 230, { expr: 'suspicious', look: [1, 0] }, t) + G(tr(860, 640, popEl(t, at(12, 'pourquoi') - .05, .4), 10), ftext(0, 60, '?', { size: 220, fill: SX.acc2 })) + funTag(CX - 60, 420, 'POURQUOI ?', t, at(12, 'pourquoi') - .05, { size: 64, bg: '#fff' }),
  sfx: [[0, 'whoosh', .5], [at(12, 'demande'), 'hmm', .6], [at(12, 'pourquoi') - .05, 'boing', .6]] });
// B013 — « Frère, il te faut un schéma ou un arbre généalogique ? » : tableau couvert d'un schéma délirant
B(13, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const S_ = at(13, 'schema'), A = at(13, 'arbre'); const k1 = seg(t, S_ - .2, S_ + .6), k2 = seg(t, A - .1, A + .5);
    let sch = ''; if (k1 > 0) sch += G(tr(300, 470, k1 > .2 ? 1 : 0), path('M-60 0L0 -50L60 0L60 60L-60 60Z', MOMC, 5)) + G(tr(780, 470, k1 > .5 ? 1 : 0), path('M-60 0L0 -50L60 0L60 60L-60 60Z', DADC, 5)) + (k1 > .7 ? path('M380 470Q540 380 700 470', 'none', 7, '#fff') + path('M700 520Q540 610 380 520', 'none', 7, '#fff') + ftext(540, 410, 'LUN→VEN', { size: 30, fill: '#fff', stroke: 'none' }) + ftext(540, 640, 'VEN→DIM ??', { size: 30, fill: '#fff', stroke: 'none' }) : '');
    if (k2 > 0) { sch += op(k2, line(540, 680, 540, 740, 5, '#fff') + line(300, 740, 780, 740, 5, '#fff') + [300, 440, 640, 780].map((x, i) => circ(x, 760, 18, ['#ffd23f', MOMC, DADC, '#7be07b'][i], 4)).join('') + ftext(540, 700, '+ beau-père + mamie²', { size: 26, fill: SX.acc2, stroke: 'none', font: SX.marker })); }
    return classroomT(t, sch) + prof({ x: 170, y: 1560, s: 1.15, expr: t > A ? 'jawdrop' : 'shock' }, t) + leo({ x: 860, y: 1500, s: 1.25, expr: 'smug', flip: 1, armL: [200, 230], holdL: rect(-8, -40, 16, 40, '#fff', 4, 3) }, t) +
      funTag(CX, 330, 'SCHÉMA ?', t, S_ - .05, { size: 44, bg: SX.acc2 }) + (t > A ? funTag(CX, 860, 'ARBRE GÉNÉALOGIQUE ?', t, A, { size: 38, bg: SX.cool }) : ''); },
  sfx: [[at(13, 'frere'), 'hmm', .4], [at(13, 'schema') - .2, 'scratch', .6], [at(13, 'schema') + .3, 'scratch', .5], [at(13, 'arbre') - .1, 'scratch', .6], [at(13, 'genealogique'), 'gasp', .5]] });
// B014 — « le pire arrive aux anniversaires » : salon festif qui vire à l'orage, Léo chapeau pointu, terreur
B(14, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.12, t / d), shake: t > at(14, 'pire') ? 5 : 0, r: 3 }),
  draw: (t, d, T) => { const P = at(14, 'pire');
    return bdaySalon(t, { night: 1 }) + (t > P && Math.sin(t * 30) > .3 ? tint('#fff', .3) : '') + cloud(CX, 640, 1.8, '#5f6a7a') + (t > P ? lightning(CX + 40, 680, .4, .5 + .5 * Math.sin(t * 25)) : '') +
      leo({ x: CX, y: 1500, s: 1.35, expr: 'terror', tremble: 1 }, t) + G(tr(CX, 1500 - 1.35 * 380), path('M-50 0L0 -140L50 0Z', SX.acc2, 6) + circ(0, -140, 14, MOMC, 4)) + kword('LE PIRE', CX, 400, t, P - .05, { size: 104, fill: '#fff' }) + funTag(CX, 520, 'ANNIVERSAIRES', t, at(14, 'anniversaires') - .05, { size: 54, bg: SX.acc }); },
  sfx: [[at(14, 'attends'), 'hmm', .5], [at(14, 'pire') - .05, 'thunder', .8], [at(14, 'pire'), 'sting', .6], [at(14, 'anniversaires'), 'pop', .5]] });
// B015 — deux maisons, deux gâteaux (split rose/bleu)
B(15, { enter: 'none', trans: 'push', transD: .2, cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => { const G2 = at(15, 'gateaux'), m = 1 - seg(t, G2 - .1, G2 + .2);
    const half = (c, roof, x) => SKY(t) + pFence(-M, W + M, 1260, '#fff') + rect(-M, 1260, W + 2 * M, 900, '#8fd16a', 0, 0) + G(tr(x, 0), m > 0 ? G(tr(0, 1250, m), miniHouse(0, 0, 1.4, c, roof)) : '') + (m < 1 ? G(tr(x, 1060, 1 - m), cake(0, 0, 1.1, t, c, 3)) : '');
    return split(half('#ffd9e6', MOMC, 270), half('#d6e8ff', DADC, 810)) + funTag(CX, 420, m > .5 ? '2 MAISONS' : '2 GÂTEAUX', t, m > .5 ? at(15, 'deux') : G2, { size: 64, bg: SX.acc2 }); },
  sfx: [[at(15, 'deux'), 'pop', .6], [at(15, 'maisons'), 'pop_hi', .4], [at(15, 'gateaux') - .1, 'boing', .6], [at(15, 'gateaux'), 'tada', .4]] });
// B016 — parfois deux cadeaux : pluie de cadeaux, Léo extatique
B(16, { enter: 'drop', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const C = at(16, 'cadeaux'); let rain = ''; if (t > at(16, 'deux') - .1) for (let i = 0; i < 6; i++) { const k = t - at(16, 'deux') + .1, x = 120 + i * 170, y = -100 + ((k * (700 + i * 80) + i * 160) % 1100); rain += pGift(x, y, .7, DPAL[i], i % 2 ? '#fff' : '#ffd23f'); }
    return bdaySalon(t) + rain + leo({ x: CX, y: 1530, s: 1.35, expr: 'ecstatic', armL: [200, 160], armR: [-20, 20], holdL: pGift(0, 30, .7, MOMC), holdR: pGift(0, 30, .7, DADC) }, t) + funTag(CX, 430, 'x2', t, C - .05, { size: 90, bg: SX.acc2 }) + popStars(CX, 900, t, C); },
  sfx: [[at(16, 'parfois'), 'whoosh', .4], [at(16, 'deux'), 'pop', .6], [at(16, 'cadeaux') - .05, 'jackpot', .5], [at(16, 'cadeaux') + .2, 'sparkle', .5]] });
// B017 — Kevin te regarde (cour d'école, yeux plissés de jalousie)
B(17, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.12, t / d) }),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: schoolyard(t), haze: .08 }, { z: 1, svg: leo({ x: 260, y: 1500, s: 1.25, expr: 'happy', holdR: pGift(0, 30, .6, MOMC) }, t) + kevin({ x: 790, y: 1500, s: 1.35, expr: 'suspicious', flip: 1, look: [-1, 0] }, t) }, { z: .6, svg: blur(10, G(tr(CX, 1820), rect(-800, -120, 1600, 240, '#7bbf5a', 60))) }]) + funTag(790, 520, 'KEVIN', t, at(17, 'kevin'), { size: 50, bg: '#5fb85f' }),
  sfx: [[0, 'school_bell', .3], [at(17, 'kevin'), 'pop', .6], [at(17, 'regarde'), 'hmm', .5]] });
// B018 — « La chance ! » : Kevin extatique sur fond de rayons
B(18, { enter: 'punch', flash: 1, cam: () => ({ z: 1.06, shake: 3 }),
  draw: (t, d, T) => rays(t, CX, 880, '#ffe9a6', '#ffd76b', 22) + kevinHead(CX, 880, 250, { expr: 'ecstatic' }, t) + popStars(CX, 880, t, .1, 8, 330) + kword('LA CHANCE !', CX, 470, t, at(18, 'chance') - .05, { size: 104, fill: SX.acc2 }),
  sfx: [[0, 'whoosh_up', .5], [at(18, 'chance') - .05, 'tada', .6], [at(18, 'chance') + .2, 'sparkle', .5]] });
// B019 — « T'as deux Noël ! » : le fantasme de Kevin, deux sapins sous la neige
B(19, { enter: 'none', trans: 'zoom', transD: .2, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { let snow = ''; for (let i = 0; i < 40; i++) { const x = (i * 97) % 1100, y = ((i * 211 + t * 260) % 1500) + 200; snow += circ(x + wave(t, .8, 10, i), y, 7, '#fff', 0); }
    return grad('#1d2a5c', '#3b4c8c', -M, -M, W + 2 * M, H + 2 * M) + pWindowView(380, 330, 320, 330, t, { night: 1 }) + rect(-M, 1250, W + 2 * M, 900, '#eef3fa', 0, 0) + xmasTree(240, 1300, .95, t) + xmasTree(840, 1300, .95, t) + kevin({ x: CX, y: 1530, s: 1.2, expr: 'love' }, t) + snow + kword('2 NOËL !', CX, 470, t, at(19, 'noel') - .1, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'magic', .5], [at(19, 'deux'), 'pop', .5], [at(19, 'noel') - .1, 'jackpot', .5]] });
// B020 — « Oui, Kevin. » : gros plan blasé
B(20, { enter: 'punch', cam: () => ({ z: 1.1 }),
  draw: (t, d, T) => blur(6, schoolyard(t)) + tint('#fff', .2) + leoHead(CX, 880, 240, { expr: 'deadpan', face: { eyes: 'half' } }, t) + funTag(CX, 430, 'OUI, KEVIN.', t, at(20, 'oui') - .05, { size: 64, bg: '#fff' }),
  sfx: [[at(20, 'oui'), 'hmm', .5], [at(20, 'kevin'), 'tick', .5]] });
// B021 — « Et toi, t'as deux neurones » : radio du crâne de Kevin, 2 neurones qui se font coucou
B(21, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d) }),
  draw: (t, d, T) => { const N = at(21, 'neurones');
    return schoolyard(t) + tint('#1a2a4a', .35) + kevin({ x: CX, y: 1560, s: 1.4, expr: 'dizzy' }, t) + (t > N - .2 ? G(tr(CX, 700), circ(-60, 190, 18, '#fff', 5) + circ(-30, 150, 26, '#fff', 5) + op(.9, circ(0, 0, 150, '#0d2240', 6)) + brain2(0, 0, .65, t)) : '') + funTag(CX, 470, '2 NEURONES', t, N - .05, { size: 64, bg: SX.acc2 }) + markerArrow(900, 560, 720, 660, t, N, { col: SX.acc }); },
  sfx: [[at(21, 'toi'), 'whoosh', .4], [at(21, 'deux') - .2, 'zap', .5], [at(21, 'neurones') - .05, 'pop', .6], [at(21, 'neurones') + .4, 'rimshot', .6]] });
// B022 — « Pourtant, tu n'en profites pas » : seul entre deux gâteaux, petit nuage de pluie perso
B(22, { enter: 'drop', cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { let rain = ''; for (let i = 0; i < 10; i++) { const x = CX - 150 + (i * 37) % 300, y = 700 + ((i * 113 + t * 900) % 360); rain += line(x, y, x - 6, y + 40, 6, '#8fd0ff'); }
    return bdaySalon(t, { night: 1 }) + leo({ x: CX, y: 1500, s: 1.3, expr: 'sad', face: { brows: 'sad' } }, t) + G(tr(CX, 1300), rect(-460, 0, 920, 40, '#b07a45', 8, 6)) + cake(230, 1240, .7, t, MOMC, 3) + cake(850, 1240, .7, t, DADC, 3) + cloud(CX, 640, 1.2, '#7d8a9c') + rain + funTag(CX, 430, 'BOF.', t, at(22, 'profites') - .05, { size: 70, bg: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(22, 'pourtant'), 'wind', .4], [at(22, 'profites'), 'thud', .4]] });
// B023 — « Puis viennent les questions » : avalanche de points d'interrogation
B(23, { enter: 'none', trans: 'glitch', transD: .2, cam: () => ({ z: 1.05, shake: 2 }),
  draw: (t, d, T) => gridBg(SX.ink) + halftoneFade(SX.acc, .08, 1) + qMarks(t, at(23, 'viennent') - .1, 10) + cutout(leoHead(CX, 900, 170, { expr: 'worried', look: [0, -1] }, t), 12) + kthin('puis viennent', CX, 400, t, at(23, 'puis'), { size: 56 }) + kword('LES QUESTIONS', CX, 520, t, at(23, 'questions') - .05, { size: 92, fill: SX.acc2 }),
  sfx: [[at(23, 'viennent') - .1, 'pop', .5], [at(23, 'viennent') + .2, 'pop_hi', .4], [at(23, 'questions') - .05, 'boom', .6]] });
// B024 — chez papa : interrogatoire sous la lampe, loupe
B(24, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), r: -4 }),
  draw: (t, d, T) => cuisine(t) + tint(DADC, .12) + tint('#000', .25) + hangLamp(CX - 140, 560, t) + leo({ x: CX - 140, y: 1500, s: 1.3, expr: 'scared' }, t) + sweatSpray(CX - 140, 1020, t, 4) +
    dad({ x: 850, y: 1580, s: 1.25, expr: 'suspicious', flip: 1, armL: [200, 210], holdL: magGlass(0, -60, .9, -20) }, t) + dadTag(CX, 420, 'CHEZ PAPA', t, .05) + funTag(780, 560, 'ELLE VOIT QUELQU\'UN ?', t, at(24, 'mere') - .05, { size: 36, bg: '#fff' }),
  sfx: [[0, 'whoosh', .5], [.05, 'pop_hi', .4], [at(24, 'mere'), 'hmm', .5], [at(24, 'quelqu'), 'sting', .5]] });
// B025 — chez maman : maman détective, carnet ; calendrier des week-ends entourés au marqueur
B(25, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), r: 4 }),
  draw: (t, d, T) => { const Wk = at(25, 'week');
    return salonF(t) + tint(MOMC, .1) + tint('#000', .2) + hangLamp(CX + 140, 560, t) + leo({ x: CX + 140, y: 1500, s: 1.3, expr: 'scared', flip: 1 }, t) + sweatSpray(CX + 140, 1020, t, 4) +
      mom({ x: 220, y: 1580, s: 1.25, expr: 'suspicious', armR: [-30, -60], holdR: notebook(0, -60, .8, 8) }, t) + momTag(CX, 420, 'CHEZ MAMAN', t, .05) + funTag(330, 560, 'IL SORT ENCORE ?', t, at(25, 'pere') - .05, { size: 36, bg: '#fff' }) +
      (t > Wk - .3 ? G(tr(850, 720), calPage(0, 0, .9, 'SAM DIM', DADC, 6, '♥?')) + markerCircle(850, 740, 130, 150, t, Wk, { col: SX.acc }) : ''); },
  sfx: [[0, 'whoosh', .5], [.05, 'pop_hi', .4], [at(25, 'pere'), 'hmm', .5], [at(25, 'week') - .3, 'pop', .5], [at(25, 'week'), 'scratch', .6]] });
// B026 — « J'ai 9 ans ! » : explosion de rage
B(26, { enter: 'crash', flash: 1, cam: () => ({ z: 1.08, shake: 9 }),
  draw: (t, d, T) => grad('#ff6b6b', '#ffb3a8', -M, -M, W + 2 * M, H + 2 * M) + burst(CX, 880, 420, t, 0, SX.acc2, 16) + leoHead(CX, 900, 230, { expr: 'rage' }, t) + steam(CX - 200, 650, t, 1.2) + steam(CX + 200, 650, t + .3, 1.2) + kword("J'AI 9 ANS !", CX, 450, t, at(26, '9') - .1, { size: 110, fill: '#fff' }),
  sfx: [[0, 'flash_hit', .6], [at(26, '9') - .1, 'boom', .7], [at(26, 'ans'), 'growl', .5]] });
// B027 — « Pas une carte de presse ! » : Léo en reporter, chapeau PRESSE, micro, flashs
B(27, { enter: 'none', trans: 'wipe', transD: .2, cam: camHand(1.06, .8),
  draw: (t, d, T) => streetT(t, 2) + flashes(t, 7) + leo({ x: CX, y: 1500, s: 1.35, expr: 'angry', armR: [-30, -70], holdR: mic(0, -40, .9, 10) }, t) + fedora(CX, 1500 - 1.35 * 400, 135) + funTag(CX, 430, 'CARTE DE PRESSE', t, at(27, 'carte') - .05, { size: 54, bg: SX.acc }) + cross(CX, 430, .9, t, at(27, 'presse')),
  sfx: [[.05, 'shutter', .6], [.3, 'shutter', .5], [at(27, 'carte') - .05, 'pop', .6], [at(27, 'presse'), 'error_beep', .5], [at(27, 'presse') + .2, 'shutter', .5]] });
// B028 — quand l'un critique l'autre : ping-pong de bulles, Léo coincé au milieu, regard gauche-droite
B(28, { enter: 'drop', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const U = at(28, 'un'), A = at(28, 'autre'), J = at(28, 'jamais'), side = t < A ? -1 : 1;
    return split(salonF(t) + tint(MOMC, .1), salonF(t, { night: 1 }) + tint(DADC, .12)) + mom({ x: 170, y: 1580, s: 1.2, expr: t < A ? 'angry' : 'annoyed', armR: [-40, -80] }, t) + dad({ x: 910, y: 1580, s: 1.2, expr: t > A ? 'angry' : 'annoyed', flip: 1, armR: [-40, -80] }, t) +
      chatBubble(270, 600, 260, 110, '@#!%', t, U, false, 50) + (t > A ? chatBubble(810, 640, 260, 110, '%!#@', t, A, true, 50) : '') +
      leo({ x: CX, y: 1500, s: 1.3, expr: t > J ? 'confused' : 'worried', look: [side, 0] }, t) + sweatSpray(CX, 1020, t, 4) + (t > J ? funTag(CX, 860, '…', t, J, { size: 70, bg: '#fff' }) : ''); },
  sfx: [[at(28, 'un'), 'growl', .4], [at(28, 'critique'), 'pop', .5], [at(28, 'autre'), 'pop', .5], [at(28, 'jamais'), 'crickets', .5]] });
// B029 — tu les aimes tous les deux : câlin aux deux, cœur qui pulse, « débloqué »
B(29, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.02, 1.1),
  draw: (t, d, T) => { const A = at(29, 'aimes');
    return houseExt(t, { dusk: .3 }) + unlock(CX, 720, t, A, { part: 'back', r: 460 }) + mom({ x: 300, y: 1560, s: 1.2, expr: 'love', armR: [10, -10] }, t) + dad({ x: 780, y: 1560, s: 1.2, expr: 'love', flip: 1, armR: [10, -10] }, t) +
      leo({ x: CX, y: 1500, s: 1.3, expr: 'love', armL: [180, 170], armR: [0, 10], gap: lerp(10, 2, seg(t, A, A + .5)) }, t) + heartsUp(t, CX, 880, 6) + unlock(CX, 720, t, A, { part: 'front', r: 400 }) + kword('TOUS LES DEUX', CX, 450, t, at(29, 'tous') - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[at(29, 'toi'), 'hmm', .3], [at(29, 'aimes'), 'sparkle', .6], [at(29, 'aimes') + .1, 'angel', .5], [at(29, 'tous') - .05, 'pop', .5]] });
// B030 — les années passent : feuilles de calendrier qui s'envolent, compteur d'âge
B(30, { enter: 'none', trans: 'zoom', transD: .2, cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => { let pages = ''; for (let i = 0; i < 7; i++) { const k = (t * 1.6 + i / 7) % 1; pages += op(1 - k, calPage(200 + i * 120 + k * 300, 1000 - k * 700, .6, ['2019', '2020', '2021', '2022', '2023', '2024', '2025'][i], i % 2 ? MOMC : DADC, k * 200)); }
    return paper(SX.paper) + gobo(T, .12) + pages + cutout(teenHead(CX, 900, 150 + 30 * seg(t, 0, d), { expr: 'neutral' }, t), 12) + funTag(CX, 1150, `${counter(9, 15, t, .1, d - .2)} ANS`, t, .05, { size: 60, bg: SX.acc2 }) + kword('LES ANNÉES PASSENT', CX, 450, t, at(30, 'annees') - .05, { size: 76, fill: SX.acc }); },
  sfx: [[0, 'rewind', .5], [.1, 'clock_fast', .6], [at(30, 'passent'), 'whoosh', .5]] });
// B031 — excellent pour préparer une valise : speedrun, vêtements qui volent, chrono, médaille
B(31, { enter: 'whip', cam: camHand(1.05, .6),
  draw: (t, d, T) => { const V = at(31, 'valise'), E = at(31, 'excellent'); let fly = ''; for (let i = 0; i < 6; i++) { const k = (t * 2.4 + i / 6) % 1; fly += op(t < V ? 1 : 0, G(tr(lerp(900, 330, k), 600 + Math.sin(k * 3.1) * -250 + 400 * k, .6, k * 400), path('M-60 -40L-20 -60L20 -60L60 -40L50 0L30 -10L30 60L-30 60L-30 -10L-50 0Z', DPAL[i], 5))); }
    return chambreH(t) + teen({ x: 700, y: 1560, s: 1.1, expr: 'effort', armL: [200, 160], armR: [-30, -10] }, t) + suitcase(330, 1500, 1.3, '#ffd23f', 0) + fly + bigClockF(CX, 420, `0:0${Math.min(3, Math.floor(t * 2))}`, '#7be07b', .8) +
      (t > V ? pTrophy(330, 1180, 1.4) + popStars(330, 1080, t, V) : '') + funTag(CX, 580, 'EXCELLENT', t, E - .05, { size: 56, bg: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [.2, 'whoosh', .4], [at(31, 'excellent') - .05, 'pop', .6], [at(31, 'preparer'), 'clock_fast', .5], [at(31, 'valise'), 'kaching', .6]] });
// B032 — retenir deux adresses : carrefour, deux panneaux (maman / papa)
B(32, { enter: 'drop', cam: zin(1.02, 1.07),
  draw: (t, d, T) => { const A = at(32, 'adresses');
    return streetT(t, 2) + G(tr(CX + 200, 1300), rect(-12, -560, 24, 560, '#8a8f99', 6, 5) + G(tr(0, -500, popEl(t, at(32, 'deux') - .1, .4), -6), path('M-20 -50L-300 -50L-350 0L-300 50L-20 50Z', MOMC, 6) + ftext(-170, 14, '12 rue des Lilas', { size: 28, fill: '#fff', stroke: 'none' })) + G(tr(0, -370, popEl(t, A - .05, .4), 6), path('M20 -50L300 -50L350 0L300 50L20 50Z', DADC, 6) + ftext(170, 14, '7 av. du Port', { size: 28, fill: '#fff', stroke: 'none' }))) +
      teen({ x: 330, y: 1560, s: 1.1, expr: 'effort', armR: [-60, -100] }, t) + steam(330, 720, t, .6) + funTag(CX, 430, '2 ADRESSES', t, A, { size: 60, bg: SX.acc2 }); },
  sfx: [[at(32, 'retenir'), 'hmm', .4], [at(32, 'deux') - .1, 'pop', .6], [at(32, 'adresses') - .05, 'pop', .6], [at(32, 'adresses') + .3, 'ding', .5]] });
// B033 — « ça va » même quand tu es fatigué : sourire forcé au miroir, batterie à plat qui clignote
B(33, { enter: 'none', trans: 'wipe', transD: .25, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d) }),
  draw: (t, d, T) => { const F = at(33, 'fatigue'), lvl = lerp(.9, .08, seg(t, at(33, 'meme') - .2, F + .2));
    return bathroomT(t) + teenHead(CX, 860, 220, { expr: 'happy', face: { brows: 'sad', eyes: t > F ? 'half' : undefined } }, t) + path(`M${CX - 140} 900Q${CX - 90} 940 ${CX - 40} 900M${CX + 40} 900Q${CX + 90} 940 ${CX + 140} 900`, 'none', 9, '#9b6fa8') +
      funTag(CX - 230, 450, 'ÇA VA ! 👍', t, at(33, 'ca') - .05, { size: 54, bg: '#7be07b' }) + battery(820, 470, .9, lvl, t) + (t > F ? funTag(CX, 1160, 'FATIGUÉ', t, F, { size: 44, bg: SX.acc }) : ''); },
  sfx: [[at(33, 'ca') - .05, 'ding', .6], [at(33, 'meme'), 'error_beep', .3], [at(33, 'fatigue'), 'error_beep', .6], [at(33, 'fatigue') + .3, 'gulp', .4]] });
// B034 — un jour, tes parents te demandent ce que tu veux : appel vidéo à deux tuiles (maman / papa)
B(34, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const P = at(34, 'parents'), V = at(34, 'veux'), An = at(34, 'anniversaire');
    const scr = G(tr(0, -110, popEl(t, P - .1, .4)), rect(-140, -90, 280, 180, '#ffe1ee', 12, 0) + momHead(0, 20, 60, { expr: 'happy' }, t)) + G(tr(0, 110, popEl(t, P + .1, .4)), rect(-140, -90, 280, 180, '#dbeaff', 12, 0) + dadHead(0, 20, 60, { expr: 'happy' }, t));
    return chambreH(t) + G(tr(CX, 860, 1.25, -4), rect(-170, -300, 340, 600, '#2b2b33', 40) + rect(-150, -270, 300, 540, '#eef3f8', 20, 0) + scr) + teen({ x: 900, y: 1580, s: 1.05, expr: 'wow', flip: 1 }, t) +
      funTag(CX, 410, 'TU VEUX QUOI ?', t, V - .05, { size: 56, bg: SX.acc2 }) + (t > An ? G(tr(250, 1100), cake(0, 0, .5, t, '#ff8fb1', 3)) : '') + funTag(180, 560, 'UN JOUR…', t, .1, { size: 40, bg: '#fff' }); },
  sfx: [[.1, 'pop', .4], [at(34, 'parents') - .1, 'ring', .5], [at(34, 'parents') + .1, 'pop_hi', .4], [at(34, 'veux') - .05, 'pop', .5], [at(34, 'anniversaire'), 'tada', .4]] });
// B035 — ni console, ni téléphone : cartes barrées
B(35, { enter: 'none', trans: 'push', transD: .2, cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => { const C = at(35, 'console'), Tl = at(35, 'telephone');
    return chambreH(t) + tint('#fff', .2) + card(330, 820, 320, 320, consoleIco(0, 0, .9), t, C - .15, { thick: 8, r: -6 }) + card(750, 820, 320, 320, phoneIco(0, 0, 1), t, Tl - .15, { thick: 8, r: 6 }) + cross(330, 820, .9, t, C + .25) + cross(750, 820, .9, t, Tl + .25) +
      teenHead(CX, 1150, 90, { expr: 'calm', tilt: Math.sin(t * 8) * 10 }, t) + kword('NI… NI…', CX, 450, t, at(35, 'ni') - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[at(35, 'console') - .15, 'pop', .5], [at(35, 'console') + .25, 'error_beep', .5], [at(35, 'telephone') - .15, 'pop', .5], [at(35, 'telephone') + .25, 'error_beep', .5]] });
// B036 — tu voudrais qu'ils viennent tous les deux : bougies, vœu, bulle de rêve avec papa + maman
B(36, { enter: 'drop', cam: zin(1.02, 1.1),
  draw: (t, d, T) => { const V = at(36, 'viennent');
    return bdaySalon(t) + G(tr(CX, 1300), rect(-460, 0, 920, 40, '#b07a45', 8, 6)) + teen({ x: CX, y: 1480, s: 1.1, expr: 'calm', face: { eyes: 'closed' } }, t) + cake(CX, 1340, .6, t, '#ff8fb1', 3) +
      (t > at(36, 'simplement') - .1 ? G(tr(CX, 700, popEl(t, at(36, 'simplement') - .1, .5)), cloud(0, 0, 2.6, '#fff', 6) + momHead(-110, 10, 80, { expr: t > V ? 'joy' : 'happy' }, t) + dadHead(110, 10, 80, { expr: t > V ? 'joy' : 'happy' }, t)) + circ(CX - 60, 960, 22, '#fff', 6) + circ(CX - 30, 1020, 14, '#fff', 6) : '') +
      heartsUp(t, CX, 560, 4) + funTag(CX, 400, 'TOUS LES DEUX', t, at(36, 'tous') - .05, { size: 56, bg: SX.acc2 }); },
  sfx: [[at(36, 'voudrais'), 'magic', .5], [at(36, 'simplement') - .1, 'pop', .5], [at(36, 'viennent'), 'angel', .5], [at(36, 'deux'), 'sparkle', .5]] });
// B037 — sans disputes, sans remarques : les parents côte à côte, bouches scotchées, cases cochées
B(37, { enter: 'whip', cam: camHand(1.05, .4),
  draw: (t, d, T) => { const D = at(37, 'disputes'), R_ = at(37, 'remarque');
    return bdaySalon(t) + mom({ x: 330, y: 1580, s: 1.2, expr: 'deadpan' }, t) + dad({ x: 750, y: 1580, s: 1.2, expr: 'deadpan', flip: 1 }, t) +
      (t > D ? tape(330, 1580 - 1.2 * 402 + 45, .5, -8) : '') + (t > R_ ? tape(750, 1580 - 1.2 * 402 + 45, .5, 8) : '') +
      G(tr(CX, 470), rect(-360, -110, 720, 220, '#fff8e0', 20, 6) + ftext(-250, -18, t > D ? '☑' : '☐', { size: 60, fill: '#36a85a', stroke: 'none' }) + ftext(30, -24, 'sans disputes', { size: 44, fill: OL, stroke: 'none' }) + ftext(-250, 72, t > R_ ? '☑' : '☐', { size: 60, fill: '#36a85a', stroke: 'none' }) + ftext(30, 66, 'sans remarques', { size: 44, fill: OL, stroke: 'none' })); },
  sfx: [[at(37, 'disputes'), 'snip', .5], [at(37, 'disputes') + .05, 'tick', .6], [at(37, 'remarque'), 'snip', .5], [at(37, 'remarque') + .05, 'tick', .6]] });
// B038 — juste une journée : parc ensoleillé, page de calendrier entourée d'un cœur
B(38, { enter: 'none', trans: 'up', transD: .2, cam: zin(1.0, 1.06),
  draw: (t, d, T) => parkA(t) + calPage(CX, 820, 1.3, 'UN JOUR', SX.acc, -4, '1') + markerCircle(CX, 850, 230, 260, t, at(38, 'journee') - .05, { col: SX.acc }) + kword('JUSTE UNE JOURNÉE', CX, 430, t, at(38, 'juste') - .05, { size: 76, fill: SX.acc2 }),
  sfx: [[at(38, 'juste') - .05, 'pop', .5], [at(38, 'journee') - .05, 'scratch', .5], [at(38, 'journee') + .2, 'chirp', .4]] });
// B039 — pas forcément de se remettre ensemble : puzzle-cœur qui ne s'emboîte pas… et c'est OK
B(39, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const E = at(39, 'ensemble'), P = at(39, 'pas'), k = seg(t, at(39, 'remettre') - .3, E);
    return parkA(t) + G(tr(CX, 780), G(tr(-140 + 40 * Math.sin(k * 3.1), 0), cutout(momHead(0, 0, 90, { expr: 'calm' }, t), 8)) + G(tr(140 - 40 * Math.sin(k * 3.1), 0), cutout(dadHead(0, 0, 90, { expr: 'calm' }, t), 8)) + (t > E ? cross(0, 0, .8, t, E) : '')) +
      teen({ x: CX, y: 1580, s: 1.1, expr: 'calm', armL: [200, 240], armR: [-20, -60] }, t) + funTag(CX, 430, 'PAS FORCÉMENT', t, P - .05, { size: 56, bg: '#fff' }) + funTag(CX, 1000, 'ENSEMBLE ?', t, at(39, 'remettre') - .1, { size: 46, bg: SX.cool }); },
  sfx: [[at(39, 'pas') - .05, 'pop', .5], [at(39, 'remettre') - .1, 'whoosh', .4], [at(39, 'ensemble'), 'boing', .5], [at(39, 'ensemble') + .2, 'hmm', .3]] });
// B040a — aimer tes deux parents : câlin à trois au parc, cœurs
const O40b = at(40, 'sans') - .15;
B(40, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.02, 1.08),
  draw: (t, d, T) => parkA(t) + mom({ x: 300, y: 1580, s: 1.2, expr: 'love', armR: [0, -20] }, t) + dad({ x: 780, y: 1580, s: 1.2, expr: 'love', flip: 1, armR: [0, -20] }, t) + teen({ x: CX, y: 1580, s: 1.1, expr: 'love', armL: [180, 170], armR: [0, 10] }, t) + heartsUp(t, CX, 900, 6) +
    kthin('juste pouvoir', CX, 400, t, at(40, 'juste'), { size: 56, fill: OL }) + kword('AIMER LES DEUX', CX, 520, t, at(40, 'aimer') - .05, { size: 88, fill: SX.acc2 }),
  sfx: [[at(40, 'juste'), 'magic', .4], [at(40, 'aimer') - .05, 'pop', .6], [at(40, 'parents'), 'sparkle', .5]] });
// B040b — FIN : le cœur rose/bleu se recolle (« débloqué ») + phrase finale en gros
B(40, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Tr = at(40, 'trahir') - O40b, g = lerp(60, 0, eOutBack(seg(t, Tr - .1, Tr + .5)));
    return paper(SX.paper) + gobo(T, .12) + unlock(CX, 820, t, Tr + .3, { part: 'back', r: 480 }) + G(tr(CX, 820, 1 + .05 * Math.sin(t * 6)), splitHeart(0, 0, 5.2, g)) + (g < 2 ? G(tr(CX, 800, 1, -20), rect(-110, -30, 220, 60, '#f6d7b8', 24, 6) + circ(-40, 0, 5, '#c9a080', 0) + circ(40, 0, 5, '#c9a080', 0)) : '') + unlock(CX, 820, t, Tr + .3, { part: 'front', r: 480 }) +
      kthin('sans avoir à', CX, 400, t, .05, { size: 56, fill: OL }) + kword('TRAHIR', CX, 510, t, Tr - .05, { size: 110, fill: SX.acc }) + kword("L'AUTRE.", CX, 1140, t, at(40, 'autre') - O40b - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[.05, 'whoosh', .4], [at(40, 'trahir') - O40b - .1, 'heartbeat', .6], [at(40, 'trahir') - O40b + .3, 'magic', .6], [at(40, 'autre') - O40b, 'boom', .5], [at(40, 'autre') - O40b + .6, 'sparkle', .5]] }, O40b);

SCENES.sort((a, b) => a.s - b.s);
