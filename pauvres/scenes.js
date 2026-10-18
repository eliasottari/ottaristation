// ============================================================
//  « Pourquoi c'est horrible d'être le pote pauvre du groupe ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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

// ---------- SIZEX fun : accent vert « billet », jaune marqueur, bleu froid ----------
sxFun('#2fbf71'); SX.acc2 = '#ffd23f'; SX.cool = '#4d9de0';

// ---------- aides + bibliothèque de décors riches (reprise de parents/ dernier/ aine/ tache/, préfixe v) ----------
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
const vHaze = (k = .35, col = '230,240,250', y1 = 1300) => rect(-M, -M, W + 2 * M, y1 + M, `rgba(${col},${k})`, 0, 0);
function vWall(kind, c1, c2, yb = 1250) { let s = rect(-M, -M, W + 2 * M, yb + M, c1, 0, 0);
  if (kind === 'stripe') for (let x = -M; x < W + M; x += 120) s += rect(x, -M, 48, yb + M, c2, 0, 0);
  if (kind === 'dot') for (let y = -40; y < yb; y += 90) for (let x = -M + ((y / 90) % 2 ? 45 : 0); x < W + M; x += 90) s += circ(x, y, 7, c2, 0);
  if (kind === 'diamond') for (let y = 0; y < yb; y += 110) for (let x = -M + ((y / 110) % 2 ? 55 : 0); x < W + M; x += 110) s += path(`M${x} ${y - 14}L${x + 10} ${y}L${x} ${y + 14}L${x - 10} ${y}Z`, c2, 0);
  if (kind === 'star') for (let y = 30; y < yb; y += 140) for (let x = -M + ((y / 140) % 2 ? 70 : 0); x < W + M; x += 140) s += ftext(x, y, '✦', { size: 26, fill: c2, stroke: 'none' });
  return s; }
const vBase = (yb, col = '#fff', h = 34) => rect(-M, yb - h, W + 2 * M, h, col, 0, 0) + line(-M, yb - h, W + M, yb - h, 5, shade(col, -.25));
function vParquet(yb, c) { let s = rect(-M, yb, W + 2 * M, 1500, c, 0, 0); const ys = [0, 28, 64, 112, 176, 260, 370, 510, 690]; ys.forEach((dy, i) => { s += line(-M, yb + dy, W + M, yb + dy, 4, shade(c, -.2)); const nx = ys[i + 1]; if (nx !== undefined) for (let x = -M + (i % 2) * 110; x < W + M; x += 220) s += line(x, yb + dy, x, yb + nx, 4, shade(c, -.2)); }); return s + line(-M, yb, W + M, yb, 8, shade(c, -.35)); }
function vTileFloor(yb, c1, c2) { let s = rect(-M, yb, W + 2 * M, 1500, c1, 0, 0); const ys = [0, 40, 95, 170, 270, 400, 570, 800]; for (let i = 0; i < ys.length - 1; i++) { const h = ys[i + 1] - ys[i], w = h * 1.6; for (let k = 0, x = -M; x < W + M; x += w, k++) if ((k + i) % 2) s += rect(x, yb + ys[i], w, h, c2, 0, 0); } return s + line(-M, yb, W + M, yb, 7, shade(c1, -.3)); }
const vOutlet = (x, y) => rect(x - 22, y - 30, 44, 60, '#f4f1ea', 8, 4) + circ(x - 8, y, 4, OL, 0) + circ(x + 8, y, 4, OL, 0);
const vSwitch = (x, y) => rect(x - 24, y - 34, 48, 68, '#f4f1ea', 8, 4) + rect(x - 9, y - 16, 18, 32, '#dcd6cc', 4, 3);
function vPic(kind, w, h) { const a = -w / 2 + 12, b = -h / 2 + 12, iw = w - 24, ih = h - 24;
  if (kind === 'mount') return rect(a, b, iw, ih, '#cfe8f5', 0, 0) + path(`M${a} ${b + ih}L${a + iw * .35} ${b + ih * .35}L${a + iw * .6} ${b + ih * .7}L${a + iw * .75} ${b + ih * .5}L${a + iw} ${b + ih}Z`, '#7bbf5a', 3) + circ(a + iw * .78, b + ih * .25, ih * .12, '#ffd23f', 3);
  if (kind === 'heart') return rect(a, b, iw, ih, '#ffe1ee', 0, 0) + heart(0, 4, Math.min(iw, ih) / 120, '#ff5d73');
  if (kind === 'face') return rect(a, b, iw, ih, '#fff1c8', 0, 0) + circ(0, ih * .08, ih * .28, '#f2c9a0', 3) + path(`M${-ih * .28} ${-ih * .02}Q0 ${-ih * .38} ${ih * .28} ${-ih * .02}`, '#6b3e26', 3) + path(`M${-ih * .1} ${ih * .18}Q0 ${ih * .25} ${ih * .1} ${ih * .18}`, 'none', 3);
  if (kind === 'sea') return rect(a, b, iw, ih, '#bfe3ff', 0, 0) + rect(a, b + ih * .55, iw, ih * .45, '#4d9fd8', 0, 0) + path(`M${a + iw * .3} ${b + ih * .55}L${a + iw * .45} ${b + ih * .2}L${a + iw * .5} ${b + ih * .55}Z`, '#fff', 3);
  return rect(a, b, iw, ih, '#e1f5d6', 0, 0) + circ(0, 0, ih * .25, '#ff9a4d', 3); }
const vFrame = (x, y, w, h, kind = 'mount', col = '#c38a52', r = 0) => G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, col, 6, 6) + vPic(kind, w, h) + rect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 'none', 2, 3));
function vPoster(x, y, w, h, bg, r, inner = '', t = 0) { const fl = Math.sin(t * 2.4 + x) * 3; return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, bg, 6, 5) + inner + path(`M${w / 2 - 34} ${h / 2}L${w / 2} ${h / 2 - 34 + fl}L${w / 2} ${h / 2}Z`, shade(bg, -.2), 3) + rect(-18, -h / 2 - 10, 36, 18, 'rgba(255,255,255,.75)', 3, 0)); }
function vBooks(x, y, w, seed = 1) { const r = rng(seed); let s = '', cx = x; while (cx < x + w - 20) { const bw = 18 + r() * 14, bh = 56 + r() * 34, c = DPAL[Math.floor(r() * 8)]; if (r() < .12 && cx + bh < x + w) { s += rect(cx, y - bw, bh, bw, c, 3, 4); cx += bh + 4; continue; } s += rect(cx, y - bh, bw, bh, c, 3, 4) + line(cx + 4, y - bh + 12, cx + bw - 4, y - bh + 12, 3, 'rgba(255,255,255,.6)'); cx += bw + 2; } return s; }
const vShelf = (x, y, w, items = '', col = '#b5835a') => items + rect(x, y, w, 18, col, 4, 5) + path(`M${x + 24} ${y + 18}L${x + 24} ${y + 50}L${x + 56} ${y + 18}`, 'none', 5) + path(`M${x + w - 24} ${y + 18}L${x + w - 24} ${y + 50}L${x + w - 56} ${y + 18}`, 'none', 5);
const vJar = (x, y, c = '#ffd23f', s = 1) => G(tr(x, y, s), rect(-24, -64, 48, 64, 'rgba(220,240,255,.85)', 10, 4) + rect(-20, -40, 40, 36, c, 6, 0) + rect(-26, -76, 52, 16, '#c96a3a', 5, 4));
const vTrophy = (x, y, s = 1) => G(tr(x, y, s), rect(-30, -16, 60, 16, '#6b3e26', 3, 4) + rect(-8, -46, 16, 30, '#e8b923', 0, 4) + path('M-34 -96L34 -96Q34 -46 0 -46Q-34 -46 -34 -96Z', '#ffd23f', 4) + path('M-34 -88Q-56 -84 -46 -64M34 -88Q56 -84 46 -64', 'none', 4) + ftext(0, -64, '1', { size: 22, fill: '#a0703f', stroke: 'none' }));
const vTeddy = (x, y, s = 1, c = '#c9935c') => G(tr(x, y, s), ell(0, -38, 40, 40, c, 5) + circ(-30, -96, 13, c, 5) + circ(30, -96, 13, c, 5) + circ(0, -82, 30, c, 5) + ell(0, -74, 12, 9, '#f1d2a8', 0) + circ(-10, -88, 4, OL, 0) + circ(10, -88, 4, OL, 0) + circ(0, -77, 4, OL, 0) + ell(-28, -8, 16, 11, c, 4) + ell(28, -8, 16, 11, c, 4));
function vPot(x, y, s, t, kind = 0, potC = '#d9825b') { const sw = wave(t, .5, 4, x * .01); let lv = '';
  if (kind === 0) for (let i = 0; i < 5; i++) lv += G(tr(0, -60, 1, -60 + i * 30 + sw), ell(0, -55, 18, 55, ['#5fb85f', '#4fa64f', '#6cc46c'][i % 3], 4));
  else if (kind === 1) lv += G(tr(0, -60, 1, sw), rect(-18, -150, 36, 150, '#5aa76a', 18, 4) + rect(-58, -110, 26, 70, '#5aa76a', 13, 4) + rect(32, -126, 26, 60, '#5aa76a', 13, 4));
  else for (let i = 0; i < 7; i++) lv += G(tr(0, -60, 1, -75 + i * 25 + sw), path('M0 0Q-16 -60 0 -120Q16 -60 0 0Z', '#4fa64f', 3));
  return G(tr(x, y, s), lv + path('M-46 -62L46 -62L36 0L-36 0Z', potC, 5) + rect(-52, -74, 104, 18, shade(potC, -.15), 5, 5)); }
function vCurtain(x, y, w, h, col, t, side = 1) { let d = `M${x} ${y}L${x + w} ${y}`; const n = 5; for (let i = 0; i <= n; i++) { const yy = y + h * i / n; d = d; } const sw = wave(t, .5, 14, x * .01);
  const xb = x + (side > 0 ? w * .7 + sw : w * .3 + sw), dd = side > 0 ? `M${x} ${y}L${x + w} ${y}Q${x + w * .55} ${y + h * .5} ${xb} ${y + h}L${x - 6} ${y + h}Z` : `M${x} ${y}L${x + w} ${y}L${x + w + 6} ${y + h}L${xb} ${y + h}Q${x + w * .45} ${y + h * .5} ${x} ${y}Z`;
  let s = path(dd, col, 6); for (let i = 1; i < 4; i++) s += path(`M${x + w * i / 4} ${y + 10}Q${x + w * i / 4 + sw * .4} ${y + h * .5} ${x + w * i / 4 + (side > 0 ? -1 : 1) * w * .12} ${y + h - 10}`, 'none', 4, shade(col, -.25)); return s + rect(x - 20, y - 14, w + 40, 18, '#8a5a3a', 8, 4); }
function vWindowView(x, y, w, h, t, o = {}) { const night = o.night; let s = grad(night ? '#0f163a' : '#9fd6ff', night ? '#2a3170' : '#e6f6ff', x, y, w, h);
  s += night ? circ(x + w * .72, y + h * .22, 34, '#fff6d6', 0) : cloud(x + ((t * 20) % (w + 160)) - 80, y + h * .25, .45, '#fff');
  for (let i = 0; i < 5; i++) { const bx = x + i * w / 5, bh = h * (.25 + ((i * 37) % 30) / 100); s += rect(bx, y + h - bh, w / 5 + 2, bh, night ? '#1a2048' : '#b9cfe0', 0, 0); for (let j = 0; j < 3; j++) s += rect(bx + 14, y + h - bh + 16 + j * 34, 14, 16, night ? (Math.sin(t * .7 + i * 3 + j) > -.3 ? '#ffe08a' : '#2e3570') : '#e6f2fb', 2, 0); }
  if (!night) s += circ(x + w * .2, y + h - 30, 46, '#6cc46c', 0) + circ(x + w * .3, y + h - 50, 40, '#5fb85f', 0);
  return s + rect(x, y, w, h, 'none', 8, 10, '#fff') + rect(x - 6, y - 6, w + 12, h + 12, 'none', 10, 6) + line(x + w / 2, y, x + w / 2, y + h, 8, '#fff') + line(x, y + h / 2, x + w, y + h / 2, 8, '#fff') + rect(x - 24, y + h, w + 48, 20, '#f4f1ea', 4, 5); }
const vRug = (x, y, w, h, c1, c2) => ell(x, y, w / 2, h / 2, c1, 6) + ell(x, y, w * .38, h * .36, 'none', 6, c2) + ell(x, y, w * .22, h * .2, c2, 0);
const vBin = (x, y, s = 1, c = '#7aa6d8') => G(tr(x, y, s), path('M-46 -110L46 -110L36 0L-36 0Z', c, 5) + line(-20, -90, -16, -14, 4, shade(c, -.25)) + line(20, -90, 16, -14, 4, shade(c, -.25)) + path('M-30 -110Q-10 -136 6 -112Q20 -130 34 -110', '#fff', 4));
const vBag = (x, y, s = 1, c = '#e2463a', r = 0) => G(tr(x, y, s, r), rect(-60, -130, 120, 130, c, 26, 5) + rect(-40, -60, 80, 46, shade(c, -.15), 12, 4) + path('M-30 -130Q0 -176 30 -130', 'none', 8) + circ(0, -80, 6, '#ffd23f', 3));
const vShoes = (x, y, s = 1, c = '#5b8fd8') => G(tr(x, y, s), path('M-80 0L-80 -34Q-60 -46 -40 -30L-6 -20Q4 -10 0 0Z', c, 5) + path('M10 0L10 -34Q30 -46 50 -30L84 -20Q94 -10 90 0Z', c, 5) + line(-82, -3, 0, -3, 6, '#fff') + line(8, -3, 92, -3, 6, '#fff'));
const vBall = (x, y, s = 1, t = 0, c = '#e2463a') => G(tr(x, y - 40 * s, s, t * 40), circ(0, 0, 40, c, 5) + path('M-40 0Q0 -20 40 0M0 -40Q-20 0 0 40', 'none', 5, '#fff'));
const vBox = (x, y, s = 1, str = '') => G(tr(x, y, s), rect(-80, -110, 160, 110, '#d9a86c', 4, 5) + path('M-80 -110L-100 -140L-20 -140L0 -110M80 -110L100 -140L20 -140L0 -110', '#c8955a', 4) + rect(-14, -110, 28, 40, '#e8c690', 0, 0) + (str ? ftext(0, -30, str, { size: 22, fill: '#7a5a3a', stroke: 'none' }) : ''));
const vGift = (x, y, s = 1, c = '#5ec4f0', c2 = '#ffd23f') => G(tr(x, y, s), rect(-60, -100, 120, 100, c, 6, 5) + rect(-12, -100, 24, 100, c2, 0, 0) + rect(-60, -100, 120, 100, 'none', 6, 5) + path('M0 -100Q-40 -150 -30 -104M0 -100Q40 -150 30 -104', 'none', 7, c2));
function vLamp(x, y, s = 1, on = 1, t = 0, c = '#ffd23f') { return G(tr(x, y, s), (on ? op(.25 + .05 * Math.sin(t * 3), circ(0, -300, 140, '#fff6c8', 0)) : '') + rect(-40, -10, 80, 14, '#5a4a3a', 6, 4) + line(0, -10, 0, -260, 8) + path('M-60 -250L60 -250L36 -350L-36 -350Z', c, 5)); }
const vDeskLamp = (x, y, s = 1, t = 0) => G(tr(x, y, s), op(.3 + .05 * Math.sin(t * 4), path('M40 -150L-60 0L160 0Z', '#fff6c8', 0)) + ell(0, -6, 40, 10, '#5b8fd8', 4) + line(0, -10, -20, -100, 8) + line(-20, -100, 40, -150, 8) + path('M20 -170L80 -140L60 -110L4 -134Z', '#5b8fd8', 5));
const vMug = (x, y, s = 1, t = 0, c = '#ff8fb1') => G(tr(x, y, s), rect(-26, -54, 52, 54, c, 8, 4) + path('M26 -42Q46 -36 26 -14', 'none', 5) + op(.6, path(`M-6 -64Q${-14 + wave(t, 1, 6)} -84 -4 -104M10 -64Q${2 + wave(t, 1, 6, .5)} -86 12 -108`, 'none', 4, '#fff')));
const vGlobe = (x, y, s = 1, t = 0) => G(tr(x, y, s), rect(-40, -10, 80, 14, '#6b3e26', 5, 4) + line(0, -10, 0, -40, 6) + circ(0, -110, 66, '#5ec4f0', 5) + G(`translate(${f1(((t * 30) % 120) - 60)} -110)`, ell(0, -14, 26, 18, '#7be07b', 0) + ell(30, 22, 16, 12, '#7be07b', 0)) + circ(0, -110, 66, 'none', 5) + path('M-74 -110A74 74 0 0 1 0 -184', 'none', 6, '#8a5a3a'));
function vBird(x, y, s, t, ph = 0) { const f = Math.sin(t * 10 + ph) * 14; return G(tr(x, y, s), path(`M-30 ${f1(-f)}Q-14 -6 0 4Q14 -6 30 ${f1(-f)}`, 'none', 6)); }
const vBirds = (t, n = 3, y = 300, seed = 1) => { let s = ''; for (let i = 0; i < n; i++) s += vBird(((t * (50 + i * 12) + i * 420 + seed * 200) % 1700) - 300, y + i * 46 + Math.sin(t * 2 + i) * 14, .7 - i * .1, t, i * 2); return s; };
function vSkyline(yb, col, seed = 3, win = 'rgba(255,255,255,.35)') { const r = rng(seed); let s = '', x = -M; while (x < W + M) { const w = 120 + r() * 140, h = 280 + r() * 380; s += rect(x, yb - h, w, h, col, 0, 0); if (r() < .4) s += rect(x + w * .4, yb - h - 50, 10, 50, col, 0, 0); for (let j = yb - h + 40; j < yb - 40; j += 70) for (let i = x + 18; i < x + w - 30; i += 46) s += rect(i, j, 20, 28, win, 2, 0); x += w + 6; } return s; }
function vBuilding(x, yb, w, h, c, seed, t, o = {}) { const r = rng(seed); let s = rect(x, yb - h, w, h, c, 4, 6) + rect(x - 10, yb - h - 18, w + 20, 26, shade(c, -.18), 4, 5);
  const cols = Math.max(1, Math.floor(w / 95)), cw = (w - 30) / cols, top = yb - h + 40, shopH = o.shop === false ? 0 : 190;
  for (let j = top; j < yb - shopH - 90; j += 120) for (let i = 0; i < cols; i++) { const wx = x + 15 + i * cw + 10, ww = cw - 20, lit = o.night ? Math.sin(t * .6 + i * 2.1 + j * .07) > -.2 : r() < .2;
    s += rect(wx, j, ww, 74, lit ? '#ffe08a' : '#cfe8ff', 4, 4); const k = r(); if (k < .3) s += path(`M${wx + 3} ${j + 3}L${wx + ww * .35} ${j + 3}Q${wx + ww * .2} ${j + 40} ${wx + 6} ${j + 70}Z`, DPAL[(seed + i) % 8], 0); else if (k < .45) s += rect(wx - 6, j + 66, ww + 12, 14, '#8a5a3a', 3, 3) + circ(wx + ww * .3, j + 62, 12, '#5fb85f', 3) + circ(wx + ww * .65, j + 60, 14, '#ff8fb1', 3); else s += line(wx + ww / 2, j, wx + ww / 2, j + 74, 4);
    if (r() < .18) s += rect(wx - 10, j + 74, ww + 20, 10, '#7d848c', 2, 4) + Array.from({ length: 4 }, (_, q) => line(wx - 6 + q * (ww + 12) / 3, j + 84, wx - 6 + q * (ww + 12) / 3, j + 116, 4)).join('') + line(wx - 10, j + 116, wx + ww + 10, j + 116, 5); }
  if (shopH) { const ac = o.awn || DPAL[seed % 8]; s += rect(x + 14, yb - 160, w - 28, 160, '#cfe8ff', 4, 5) + rect(x + w * .62, yb - 150, w * .22, 150, shade(c, -.3), 4, 5);
    for (let i = 0; i < 6; i++) s += path(`M${x + i * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 160}Q${x + (i + .5) * w / 6} ${yb - 140} ${x + i * w / 6} ${yb - 160}Z`, i % 2 ? '#fff' : ac, 4);
    if (o.sign) s += rect(x + w / 2 - o.sign.length * 11 - 16, yb - 250, o.sign.length * 22 + 32, 44, '#fff8e0', 8, 4) + ftext(x + w / 2, yb - 218, o.sign, { size: 26, fill: ac, stroke: 'none' }); }
  return s; }
const vLampPost = (x, yb, s = 1, on = 0) => G(tr(x, yb, s), (on ? op(.35, circ(0, -470, 70, '#fff6c8', 0)) : '') + rect(-22, -20, 44, 20, '#3a4250', 4, 4) + rect(-8, -440, 16, 420, '#3a4250', 4, 4) + path('M0 -440Q0 -480 50 -480', 'none', 10, '#3a4250') + path('M30 -486L90 -486L80 -456L40 -456Z', '#ffe08a', 4));
const vBench = (x, yb, s = 1) => G(tr(x, yb, s), rect(-120, -110, 240, 22, '#b5835a', 5, 4) + rect(-120, -80, 240, 22, '#b5835a', 5, 4) + rect(-130, -44, 260, 20, '#c8955a', 5, 4) + line(-100, -24, -100, 0, 8) + line(100, -24, 100, 0, 8) + line(-100, -110, -100, -44, 6) + line(100, -110, 100, -44, 6));
const vBike = (x, yb, s = 1, c = '#36a85a') => G(tr(x, yb - 50 * s, s), circ(-70, 0, 48, 'none', 7) + circ(70, 0, 48, 'none', 7) + path('M-70 0L-20 -70L50 -70L70 0M-20 -70L0 0L50 -70M0 0L-70 0', 'none', 7, c) + line(-30, -90, -6, -90, 8) + path('M50 -70L44 -96L66 -100', 'none', 7));
function vCar(x, yb, s = 1, c = '#ff6b6b', flip = 0) { return G(`translate(${f1(x)} ${f1(yb)}) scale(${flip ? -s : s} ${s})`, path('M-200 -40L-200 -100Q-190 -120 -150 -124L-100 -190Q-80 -200 40 -200Q90 -196 120 -124L190 -114Q210 -104 210 -70L210 -40Z', c, 6) + path('M-84 -130L-56 -180L10 -180L10 -130Z', '#cfe8ff', 4) + path('M30 -130L30 -180L80 -180L106 -130Z', '#cfe8ff', 4) + circ(-110, -36, 42, '#3a4250', 6) + circ(-110, -36, 16, '#c8ced6', 4) + circ(120, -36, 42, '#3a4250', 6) + circ(120, -36, 16, '#c8ced6', 4) + rect(186, -98, 22, 16, '#ffe08a', 4, 3)); }
const vBush = (x, yb, s = 1, c = '#5fb85f') => G(tr(x, yb, s), circ(-60, -40, 50, shade(c, -.1), 5) + circ(50, -44, 54, shade(c, -.05), 5) + circ(0, -70, 64, c, 5) + rect(-110, -12, 220, 12, c, 0, 0));
function vFlowers(x, yb, n = 5, seed = 2, t = 0) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const fx = x + i * 34 + r() * 10, h = 40 + r() * 30, sw = wave(t, .6, 4, i); s += line(fx, yb, fx + sw, yb - h, 5, '#4fa64f') + circ(fx + sw, yb - h, 14, DPAL[Math.floor(r() * 8)], 4) + circ(fx + sw, yb - h, 5, '#ffd23f', 0); } return s; }
const vPine = (x, yb, s = 1, t = 0) => G(tr(x, yb, s, wave(t, .3, 1.5, x)), rect(-16, -60, 32, 60, '#8a5a3a', 6, 5) + path('M-90 -60L0 -200L90 -60Z', '#3f9a5a', 5) + path('M-74 -150L0 -280L74 -150Z', '#4fa66a', 5) + path('M-56 -240L0 -350L56 -240Z', '#5fb87a', 5));
const vFence = (x0, x1, yb, c = '#fff') => { let s = rect(x0, yb - 90, x1 - x0, 14, c, 3, 4) + rect(x0, yb - 46, x1 - x0, 14, c, 3, 4); for (let x = x0; x < x1; x += 46) s += path(`M${x} ${yb}L${x} ${yb - 110}L${x + 14} ${yb - 128}L${x + 28} ${yb - 110}L${x + 28} ${yb}Z`, c, 4); return s; };
const vSign = (x, yb, str, c = '#5b8fd8', s = 1) => G(tr(x, yb, s), rect(-8, -300, 16, 300, '#8a8f99', 4, 4) + rect(-110, -380, 220, 90, c, 12, 5) + ftext(0, -322, str, { size: 34, fill: '#fff', stroke: 'none' }));
const vBalloon = (x, y, c, t, ph = 0, s = 1) => { const bx = x + wave(t, .5, 10, ph), by = y + wave(t, .7, 12, ph + 1); return path(`M${f1(bx)} ${f1(by + 70 * s)}Q${f1(bx + 20)} ${f1(by + 160 * s)} ${f1(bx - 6)} ${f1(by + 260 * s)}`, 'none', 3) + G(tr(bx, by, s), ell(0, 0, 52, 64, c, 5) + path('M-8 62L8 62L0 74Z', c, 4) + ell(-18, -24, 10, 16, 'rgba(255,255,255,.6)', 0)); };
const vSpeaker = (x, yb, s = 1, t = 0) => { const p = 1 + .08 * Math.max(0, Math.sin(t * 13)); return G(tr(x, yb, s), rect(-90, -340, 180, 340, '#241830', 14, 6) + circ(0, -240, 52 * p, '#3a2a4a', 5) + circ(0, -240, 18, '#5ec4f0', 4) + circ(0, -100, 66 * p, '#3a2a4a', 5) + circ(0, -100, 22, '#ff5c8a', 4)); };
const vNeon = (x, y, str, c, t, size = 54) => { const on = Math.sin(t * 7) > -.6 || Math.sin(t * 23) > .2; return op(on ? 1 : .35, ftext(x, y, str, { size, fill: 'none', stroke: c, sw: 6 }) + (on ? op(.35, glow(x, y - size * .3, size * 1.6, c, .5)) : '')); };
const vStreamers = (t, y = -20, n = 9) => { let s = ''; for (let i = 0; i < n; i++) { const x = -40 + i * 140, l = 120 + (i * 53) % 90; s += path(`M${x} ${y}Q${x + 20 + wave(t, .9, 12, i)} ${y + l * .5} ${x + wave(t, .9, 18, i + 1)} ${y + l}`, 'none', 10, DPAL[i % 8]); } return s; };
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + circ(930, 150, 60, '#fff3b0', 0) + op(.35, circ(930, 150, 100, '#fff3b0', 0)) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff') + cloud(((t * 12 + 1200) % 1800) - 300, 120, .7, 'rgba(255,255,255,.85)') + vBirds(t, 3, 280);
function tree(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c') + circ(-40, -380, 14, '#e2463a', 4) + circ(60, -300, 14, '#e2463a', 4) + circ(-80, -240, 12, '#e2463a', 4)); }
function kidsBg(t, y = 1150, n = 4, s = .45) { let r = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; r += kid(i + 1, { x, y, s, expr: 'happy', walk: 3, flip: i % 2 }, t); } return r; }
function streetT(t, n = 3) { const yb = 1250; let s = SKY(t, '#9fd6ff', '#fff1dc') + op(.85, vSkyline(1000, '#bccde0', 5)) + vHaze(.2);
  const signs = ['CAFÉ', '', 'BOULANGERIE', '', 'PHARMACIE', 'FLEURS', '', 'CINÉ'];
  for (let i = -2; i < 6; i++) s += vBuilding(-200 + i * 300, yb, 280, 540 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4], i + 10, t, { sign: signs[(i + 8) % 8], awn: DPAL[(i + 8) % 8] });
  s += vHaze(.16, '255,250,240', 1250);
  s += rect(-M, yb, W + 2 * M, 1400, '#c8ccd2', 0, 0) + [0, 1, 2].map(i => line(-M, yb + 20 + i * 26, W + M, yb + 20 + i * 26, 3, '#b0b5bc')).join('') + rect(-M, yb + 90, W + 2 * M, 20, '#8f959d', 0, 0) + rect(-M, yb + 110, W + 2 * M, 1400, '#6e747c', 0, 0) + Array.from({ length: 10 }, (_, i) => rect(-M + i * 300 - ((t * 0) % 300), yb + 300, 160, 18, '#fff', 4, 0)).join('') + line(-M, yb, W + M, yb, 8, '#7d848c');
  s += vLampPost(70, yb, 1) + vLampPost(830, yb, 1) + tree(470, yb, .62, t) + vBench(640, yb, .7) + vBin(950, yb, .6, '#36a85a') + vBike(260, yb + 10, .6, '#ff5c8a') + vSign(1050, yb, 'RUE', '#5b8fd8', .8) + vFlowers(900, yb, 4, 5, t) + vCar(-60, yb + 250, .9, '#5ec4f0') + vCar(1000, yb + 260, .9, '#ffd23f', 1);
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
  let s = vWall('diamond', n ? '#3a3a6a' : '#fde7c8', n ? '#4a4a80' : '#f6d3a8', yb) + rect(-M, 930, W + 2 * M, yb - 930, n ? '#33335e' : '#eccb9c', 0, 0) + line(-M, 930, W + M, 930, 8, n ? '#2a2a50' : '#c9a473') + vBase(yb, '#fff');
  s += vFrame(110, 330, 150, 180, 'face', '#c38a52', -3) + vFrame(290, 300, 130, 160, 'face', '#8a5a3a', 2) + vFrame(120, 560, 130, 150, 'face', '#ff9a4d', 3) + vFrame(290, 530, 140, 170, 'face', '#5b8fd8', -2) + vFrame(420, 430, 54, 64, 'mount', '#9aa3ad', 6);
  s += wallClock(560, 200, 56, t, o.clock || 1) + vShelf(440, 690, 250, vBooks(455, 690, 110, 5) + vTrophy(600, 690, .7) + vTrophy(650, 690, .55)) + vOutlet(80, 1180) + vSwitch(1020, 880);
  s += vWindowView(720, 300, 280, 360, t, { night: n }) + vCurtain(660, 280, 100, 450, '#e86a8a', t, 1) + vCurtain(960, 280, 100, 450, '#e86a8a', t, -1) + vPot(760, 690, .45, t, 2, '#5b8fd8') + vPot(965, 690, .4, t, 1);
  if (!o.noSofa) s += sofa(CX - 40, 1290, .95, '#5ec4a0');
  s += n ? op(.3, rect(-M, -M, W + 2 * M, yb + M, '#141838', 0, 0)) : WASH();
  s += vParquet(yb, n ? '#5a4a4a' : '#c49a6c') + vRug(CX, 1470, 820, 170, '#e86a8a', '#ffd23f') + vLamp(1020, 1290, 1, 1, t, '#ffd23f') + vPot(70, 1290, 1, t, 0);
  s += vBall(250, 1580, .6, t * .3, '#5b8fd8') + vShoes(820, 1660, .7, '#e2463a') + vTeddy(960, 1620, .7) + vBox(140, 1780, .8, 'JOUETS');
  return s; }
function cuisine(t, o = {}) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#fff1c4', 0, 0);
  for (let y = 820, j = 0; y < 1000; y += 60, j++) for (let x = -M + (j % 2) * 45; x < W + M; x += 90) s += rect(x, y, 90, 60, '#e8f4f8', 0, 3, '#c9dde6');
  for (let i = 0; i < 4; i++) { const x = 250 + i * 110; s += rect(x, 150, 104, 260, '#7fc8b0', 8, 6) + rect(x + 14, 170, 76, 220, 'none', 6, 3, '#5aa58c') + rect(x + 46, 340, 12, 40, '#fff', 5, 3); }
  s += rect(240, 132, 460, 22, '#5aa58c', 4, 5) + vJar(300, 130, '#ff9a4d', .7) + vJar(360, 130, '#7be07b', .7) + vPot(640, 130, .45, t, 2, '#e2463a');
  s += vWindowView(740, 300, 270, 330, t); for (let i = 0; i < 6; i++) s += path(`M${720 + i * 52} 290L${772 + i * 52} 290L${772 + i * 52} 380Q${746 + i * 52} ${410 + wave(t, .6, 6, i)} ${720 + i * 52} 380Z`, i % 2 ? '#fff' : '#e2463a', 4); s += rect(712, 278, 326, 16, '#8a5a3a', 6, 4);
  s += rect(-40, 380, 260, 870, '#eef3f6', 26, 7) + line(-40, 700, 220, 700, 6) + rect(186, 460, 16, 160, '#c9d3dc', 6, 4) + rect(186, 760, 16, 200, '#c9d3dc', 6, 4);
  s += [[30, 480, '#ff8fb1', -6], [120, 520, '#5ec4f0', 5], [40, 820, '#7be07b', 4], [130, 880, '#ffd23f', -5]].map(([x, y, c, r]) => G(tr(x, y, 1, r + wave(t, .8, 1.5, x)), rect(-40, -50, 80, 100, '#fff', 4, 4) + circ(0, -12, 22, c, 3) + path('M-20 26L0 14L20 30', 'none', 4, c) + circ(0, -54, 8, '#e2463a', 3))).join('') + G(tr(110, 1020, 1, 8), rect(-14, -14, 28, 28, '#ffd23f', 2, 3)) + circ(60, 650, 12, '#5b8fd8', 4) + circ(150, 1100, 12, '#ff9a4d', 4);
  s += wallClock(330, 520, 48, t) + G(tr(560, 540), rect(-80, -90, 160, 190, '#fff', 8, 5) + rect(-80, -90, 160, 34, SX.acc, 8, 5) + ftext(0, -64, 'CORVÉES', { size: 20, fill: '#fff', stroke: 'none' }) + [0, 1, 2, 3, 4].map(i => rect(-64, -42 + i * 26, 128, 16, DPAL[i], 4, 0)).join(''));
  s += line(250, 760, 690, 760, 8, '#9aa3ad') + [300, 380, 460, 540, 620].map((x, i) => G(tr(x, 760, 1, wave(t, .7, 4, i)), line(0, 0, 0, 50, 5, '#9aa3ad') + (i % 2 ? circ(0, 66, 18, '#c9d3dc', 4) : rect(-10, 50, 20, 36, '#c9d3dc', 4, 4)))).join('');
  s += WASH() + rect(220, 1000, 900, 30, '#b98552', 6, 6) + rect(220, 1030, 900, 230, '#7fc8b0', 0, 6);
  for (let i = 0; i < 2; i++) s += rect(240 + i * 170, 1050, 150, 90, '#8fd4bc', 8, 4) + rect(295 + i * 170, 1080, 40, 12, '#fff', 5, 3);
  s += rect(600, 1045, 220, 205, '#3a3f4a', 10, 5) + rect(620, 1100, 180, 120, '#ffb36b', 8, 4) + op(.4, glow(710, 1160, 120, '#ffd88a', .6)) + [0, 1, 2, 3].map(i => circ(630 + i * 52, 1070, 9, '#c9ced6', 3)).join('');
  s += G(tr(420, 1000), rect(-80, -110, 160, 110, '#c9d3dc', 12, 6) + rect(-100, -122, 200, 22, '#9aa3ad', 8, 5) + line(-100, -90, -128, -90, 10) + line(100, -90, 128, -90, 10)) + steam(400, 860, t, .8) + steam(450, 870, t + .4, .6);
  s += G(tr(930, 1000), path('M-80 -50Q0 40 80 -50Z', '#ff9a4d', 5) + circ(-30, -60, 22, '#e2463a', 4) + circ(10, -70, 22, '#ffd23f', 4) + circ(40, -56, 20, '#7be07b', 4)) + vMug(1060, 1000, .9, t, '#5b8fd8');
  s += vTileFloor(yb, '#f0e6da', '#d9c4a8') + vBin(1050, 1340, .7, '#36a85a') + vShoes(150, 1700, .7, '#5b8fd8');
  return s; }
function entree(t, o = {}) { const yb = 1250, op_ = o.open || 0;
  let s = vWall('stripe', '#d6ecf7', '#c4e0ef', yb) + rect(-M, 960, W + 2 * M, yb - 960, '#9fc6dc', 0, 0) + line(-M, 960, W + M, 960, 6, '#7fa8c0') + vBase(yb, '#fff');
  s += rect(392, 512, 296, 746, '#fff', 6, 7);
  if (op_ > 0) s += clipR(400, 520, 280, 730, grad('#141a40', '#3a3070', 400, 520, 280, 730) + circ(620, 600, 26, '#fff6d6', 0) + rect(400, 1080, 280, 170, '#3a4060', 0, 0) + vLampPost(450, 1180, .55, 1) + (o.friends ? kid(1, { x: 560, y: 1290, s: .8, expr: 'joy', armR: [-60, -100] }, t) + kid(3, { x: 650, y: 1300, s: .75, expr: 'happy', armL: [200, 240], flip: 1 }, t) : ''), 0);
  const dw = lerp(280, 60, op_); s += rect(400, 520, dw, 730, '#e2463a', 4, 6) + (dw > 120 ? rect(400 + dw * .2, 570, dw * .6, 200, '#cfe8ff', 10, 5) + rect(400 + dw * .2, 830, dw * .6, 330, 'none', 8, 4, '#b8352b') + circ(400 + dw * .85, 920, 14, '#ffd23f', 4) : '');
  // toise des aînés sur le chambranle (+ le tien, tout en bas)
  [['12', 830], ['10', 900], ['9', 950], ['8 ANS', 1010]].forEach(([nm, y]) => { s += line(700, y, 740, y, 5) + ftext(746, y + 8, nm, { size: 20, fill: '#2b2420', stroke: 'none', anchor: 'start' }); });
  s += line(40, 360, 340, 360, 10, '#8a5a3a'); for (let i = 0; i < 6; i++) { const x = 60 + i * 52, c = [...DPAL, '#5a6b4a'][i], sw = wave(t, .4, 3, i); s += circ(x, 360, 8, '#ffd23f', 3) + G(tr(x, 366, 1, sw), path('M-30 0L30 0L44 230L-44 230Z', c, 5) + line(0, 0, 0, 230, 3, shade(c, -.2))); }
  s += G(tr(290, 330, 1, -8), path('M-50 0Q0 -60 50 0Z', '#36a85a', 5) + rect(-60, -4, 120, 12, '#36a85a', 6, 4));
  s += rect(40, 1130, 320, 20, '#b98552', 4, 5) + rect(40, 1190, 320, 20, '#b98552', 4, 5) + line(50, 1130, 50, 1250, 8) + line(350, 1130, 350, 1250, 8);
  const sc = ['#e2463a', '#5b8fd8', '#ffd23f', '#36a85a', '#ff8fb1', '#b56cff', '#ff9a4d']; for (let i = 0; i < 7; i++) s += vShoes(90 + (i % 3) * 100, 1128 + (i > 2 ? 60 : 0) - (i > 5 ? 60 : 0), .45, sc[i]);
  s += circ(880, 520, 110, '#f1c27d', 7) + circ(880, 520, 88, '#cfe8f5', 5) + line(840, 470, 880, 430, 8, 'rgba(255,255,255,.7)');
  s += rect(760, 900, 260, 22, '#b98552', 6, 5) + line(780, 922, 780, 1250, 8) + line(1000, 922, 1000, 1250, 8) + ell(830, 896, 40, 14, '#5ec4f0', 4) + circ(820, 880, 9, '#ffd23f', 3) + vPot(950, 900, .5, t, 0) + rect(880, 860, 50, 36, '#fff', 3, 3);
  s += line(CX + 30, -M, CX + 30 + wave(t, .5, 20), 300, 4) + G(tr(CX + 30 + wave(t, .5, 20), 300), path('M-60 40L60 40L30 -10L-30 -10Z', '#ffd23f', 5) + op(.3, circ(0, 60, 90, '#fff6c8', 0)));
  s += WASH('rgba(255,255,255,.1)');
  s += vParquet(yb, '#b98a5c') + rect(240, 1300, 600, 900, '#5b8fd8', 10, 6) + rect(270, 1320, 540, 900, 'none', 6, 5, '#ffd23f') + vBag(940, 1360, .8, '#e2463a', 10) + vBall(1030, 1600, .6, 0, '#ffd23f');
  if (o.night) s += op(.28, rect(-M, -M, W + 2 * M, H + 2 * M, '#1a1d48', 0, 0));
  return s; }
function chambreH(t, o = {}) { const yb = 1250;
  let s = vWall('dot', o.c1 || '#d9f0d2', o.c2 || '#c4e6b9', yb) + vBase(yb, '#fff');
  s += vWindowView(60, 300, 260, 330, t) + vCurtain(0, 280, 90, 420, '#5b8fd8', t, 1) + vCurtain(290, 280, 90, 420, '#5b8fd8', t, -1);
  s += vPoster(480, 360, 150, 210, '#ff9a4d', -4, circ(0, -20, 40, '#fff', 4) + path('M-20 40L0 -10L20 40Z', '#e2463a', 4), t) + vPoster(660, 400, 130, 170, '#b56cff', 5, ftext(0, 10, '★', { size: 70, fill: '#ffd23f', stroke: 'none' }), t);
  s += G(tr(860, 300, 1, 6 + wave(t, .5, 2)), path('M-90 -40L120 0L-90 40Z', '#36a85a', 6) + ftext(-20, 12, 'GO !', { size: 32, fill: '#fff', stroke: 'none' }));
  s += wallClock(1010, 470, 46, t) + vShelf(720, 640, 330, vBooks(730, 640, 150, 7) + vTeddy(920, 640, .6) + vTrophy(1000, 640, .6)) + vOutlet(560, 1180);
  s += G(tr(900, yb), rect(-220, -230, 40, 230, '#b98552', 8, 6) + rect(-200, -110, 420, 90, '#b98552', 10, 6) + rect(-190, -150, 400, 60, '#fff', 20, 5) + path('M-120 -150Q60 -190 230 -150L230 -40L-120 -40Z', '#5b8fd8', 6) + ell(-150, -170, 60, 30, '#fff', 5));
  s += WASH() + vParquet(yb, '#c49a6c') + vRug(CX, 1480, 760, 160, '#5ec4f0', '#ffd23f');
  s += G(tr(170, 1320), [0, 1, 2, 3].map(i => path(`M${-90 + i * 8} ${-i * 34}L${90 - i * 6} ${-i * 34}L${84 - i * 6} ${-i * 34 - 30}L${-84 + i * 8} ${-i * 34 - 30}Z`, DPAL[i + 1], 4)).join('') + funTagS('À LAVER', 0, -150));
  s += vShoes(820, 1660, .7, '#36a85a') + vBag(960, 1400, .8, '#ff9a4d', 8) + vBall(300, 1700, .6, t * .2, '#e2463a');
  return s; }
const funTagS = (str, x, y) => G(tr(x, y, 1, -6), rect(-str.length * 9 - 14, -18, str.length * 18 + 28, 36, '#fff8e0', 8, 4) + ftext(0, 9, str, { size: 22, fill: '#7a5a3a', stroke: 'none' }));
function houseExt(t, o = {}) { const yb = 1250, dk = o.dusk || 0;
  let s = SKY(t, mixC('#8fd3ff', '#ff9a6b', dk), mixC('#e6f6ff', '#ffe0b0', dk)) + vBirds(t, 3, 260) + op(.8, vSkyline(1010, mixC('#c3d6e4', '#d9a8a0', dk), 4)) + vHaze(.18, '255,245,235') + ell(200, 1080, 500, 120, '#9ccf8a', 0) + ell(900, 1090, 500, 110, '#8fc47c', 0);
  for (let i = 0; i < 4; i++) { const k = (t * .4 + i / 4) % 1; s += op(.7 * (1 - k), circ(770 + k * 60 + wave(t, .5, 10, i), 470 - k * 260, 26 + k * 40, '#eef0f4', 0)); }
  s += rect(730, 470, 70, 150, '#b8352b', 4, 6) + path('M140 640L540 380L940 640Z', '#d9534f', 7) + rect(180, 640, 720, 610, '#f6e3c0', 6, 7) + [0, 1, 2, 3, 4].map(i => line(180, 700 + i * 110, 900, 700 + i * 110, 3, '#ead2a8')).join('');
  [[260, 700], [660, 700]].forEach(([x, y]) => { s += rect(x, y, 160, 150, mixC('#cfe8ff', '#ffd88a', dk), 6, 6) + line(x + 80, y, x + 80, y + 150, 5) + path(`M${x} ${y}L${x + 50} ${y}Q${x + 30} ${y + 70} ${x} ${y + 150}Z`, '#e86a8a', 4) + rect(x - 10, y + 150, 180, 30, '#b98552', 4, 5) + vFlowers(x + 20, y + 150, 4, x, t); });
  s += rect(260, 960, 160, 150, '#cfe8ff', 6, 6) + line(340, 960, 340, 1110, 5) + rect(470, 920, 140, 330, '#5b8fd8', 6, 6) + circ(585, 1090, 10, '#ffd23f', 4) + rect(450, 1230, 180, 20, '#c9b8a0', 3, 5) + rect(660, 960, 160, 150, '#cfe8ff', 6, 6) + line(740, 960, 740, 1110, 5);
  s += rect(500, 870, 80, 34, '#fff8e0', 6, 4) + ftext(540, 896, 'N°7', { size: 22, fill: '#7a5a3a', stroke: 'none' });
  s += tree(1000, 1250, .85, t) + vPine(80, 1250, .8, t) + vBush(160, 1250, .6) + vBush(880, 1250, .55, '#4fa64f') + G(tr(980, 1260), rect(-6, -150, 12, 150, '#8a5a3a', 3, 4) + rect(-50, -200, 100, 60, '#e2463a', 18, 5) + ftext(0, -160, 'FAMILLE', { size: 16, fill: '#fff', stroke: 'none' }));
  s += vFence(-M, 440, 1260, '#fff') + vFence(640, W + M, 1260, '#fff') + rect(-M, 1260, W + 2 * M, 200, '#8fd16a', 0, 0) + rect(440, 1260, 200, 200, '#d8c8a8', 0, 4) + rect(-M, 1460, W + 2 * M, 110, '#c8ccd2', 0, 0) + line(-M, 1460, W + M, 1460, 6, '#9aa0a8') + rect(-M, 1570, W + 2 * M, 600, '#6e747c', 0, 0) + Array.from({ length: 8 }, (_, i) => rect(-M + i * 300, 1720, 160, 16, '#fff', 4, 0)).join('');
  s += vLampPost(40, 1470, .9, dk > .4) + (o.car !== false ? vCar(900, 1690, .8, '#ffd23f', 1) : '');
  if (dk) s += op(.2 * dk, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff7a3a', 0, 0));
  return s; }
function battery(x, y, s, lvl, t) { const c = lvl < .25 ? '#e2463a' : lvl < .5 ? '#ffb03a' : '#7be07b'; return G(tr(x, y, s), rect(-90, -44, 180, 88, '#fff', 16, 7) + rect(90, -18, 18, 36, OL, 4, 0) + (lvl > 0 ? rect(-78, -32, 156 * lvl, 64, (lvl < .25 && Math.sin(t * 14) > 0) ? '#ffb3a8' : c, 8, 0) : '')); }
function polaroid(x, y, s, r, inner, t, t0) { const k = pop(t, t0, .4); if (k <= 0) return ''; return G(tr(x, y, s * k, r + (1 - k) * 30), rect(-110, -120, 220, 250, '#fff', 8, 6) + clipR(-92, -102, 184, 176, rect(-92, -102, 184, 176, '#bfe6ff', 0, 0) + inner, 4) + rect(-92, -102, 184, 176, 'none', 4, 4) + rect(-30, -136, 60, 30, 'rgba(255,240,180,.8)', 3, 0)); }
const vCone = (x, y, s = 1) => G(tr(x, y, s), rect(-50, -10, 100, 14, '#ff7a2f', 4, 4) + path('M-34 -10L0 -150L34 -10Z', '#ff7a2f', 5) + path('M-24 -50L24 -50', 'none', 12, '#fff'));
function schoolBuilding(x, yb, w, h, t) { let s = path(`M${x - 30} ${yb - h}L${x + w / 2} ${yb - h - 130}L${x + w + 30} ${yb - h}Z`, '#d9534f', 6) + rect(x, yb - h, w, h, '#f0d9b5', 4, 6);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) { if (j === 2 && (i === 1 || i === 2)) continue; const wx = x + 40 + i * (w - 60) / 4, wy = yb - h + 50 + j * 150; s += rect(wx, wy, (w - 60) / 4 - 30, 90, '#cfe8ff', 4, 5) + circ(wx + 20, wy + 60, 12, DPAL[(i + j) % 8], 0) + path(`M${wx + 40} ${wy + 70}L${wx + 52} ${wy + 46}L${wx + 64} ${wy + 70}`, DPAL[(i + j + 3) % 8], 0) + line(wx, wy + 45, wx + (w - 60) / 4 - 30, wy + 45, 4); }
  s += rect(x + w / 2 - 80, yb - 200, 160, 200, '#3e7cc0', 8, 6) + line(x + w / 2, yb - 200, x + w / 2, yb, 5) + rect(x + w / 2 - 130, yb - 270, 260, 56, '#fff8e0', 10, 5) + ftext(x + w / 2, yb - 230, 'ÉCOLE', { size: 36, fill: '#d9534f', stroke: 'none' }) + wallClock(x + w / 2, yb - h - 50, 40, t);
  const fx = x + w - 40, fy = yb - h - 160; s += line(fx, yb - h, fx, fy, 6) + path(`M${fx} ${fy}Q${fx + 40} ${fy - 10 + wave(t, 2, 8)} ${fx + 80} ${fy + wave(t, 2, 10, .5)}L${fx + 80} ${fy + 50 + wave(t, 2, 10, .5)}Q${fx + 40} ${fy + 40 + wave(t, 2, 8)} ${fx} ${fy + 50}Z`, '#5b8fd8', 4);
  return s; }
function schoolyard(t) { const yb = 1180;
  return SKY(t) + op(.8, vSkyline(1120, '#c3d6e4', 3)) + circ(-20, 1080, 90, '#9ccf8a', 0) + circ(1020, 1060, 110, '#9ccf8a', 0) + vHaze(.15) +
    schoolBuilding(-120, yb, 640, 560, t) + vBuilding(560, yb, 700, 470, '#e8c9a0', 4, t, { shop: false }) + vFence(-M, W + M, yb, '#fff') +
    rect(-M, yb, W + 2 * M, 1500, '#c9b8a0', 0, 0) + line(-M, yb, W + M, yb, 7, '#a8987f') +
    [0, 1, 2, 3, 4].map(i => rect(CX - 60 + (i % 2) * 0, 1300 + i * 70, 120, 64, 'none', 4, 5, '#fff')).join('') + ftext(CX, 1660, '★', { size: 60, fill: '#fff', stroke: 'none' }) +
    G(tr(40, yb), rect(-8, -480, 16, 480, '#7d848c', 4, 4) + rect(-90, -520, 120, 80, '#fff', 6, 5) + circ(-40, -436, 30, 'none', 5, '#e2463a')) +
    vBench(260, 1230, .8) + vBush(700, 1200, .8) + vFlowers(780, 1225, 6, 3, t) + tree(950, 1200, .9, t) + vPine(1060, 1200, .7, t) + vBin(470, 1225, .6, '#36a85a') + vBall(620, 1290, .7, t) + vBag(160, 1290, .6, '#ff8fb1', -8) +
    kidsBg(t, 1230, 3); }
function classroomT(t, inner = '') { const yb = 1250;
  let s = vWall('stripe', '#fff1d6', '#ffe8c2', yb) + rect(-M, 960, W + 2 * M, yb - 960, '#d9b88c', 0, 0) + line(-M, 960, W + M, 960, 6, '#b8956a') + vBase(yb, '#a0784e');
  for (let i = 0; i < 8; i++) { const x = 100 + i * 105, y = 160 + Math.sin(i * .7) * 10 + wave(t, .8, 3, i); s += G(tr(x, y, 1, wave(t, .8, 5, i)), rect(-34, -40, 68, 70, DPAL[i % 8], 6, 4) + ftext(0, 14, 'ABCDEFGH'[i], { size: 36, fill: '#fff', stroke: 'none' })); }
  s += path('M40 120Q470 160 900 120', 'none', 4) + rect(60, 250, 960, 560, '#8a6a4a', 18) + rect(80, 270, 920, 520, '#456b55', 10, 0) + op(.15, path('M120 300Q400 340 700 300M150 700Q500 650 900 720', 'none', 12, '#fff')) + inner + rect(120, 790, 840, 18, '#8a6a4a', 6, 4) + rect(180, 774, 50, 18, '#fff', 4, 3) + rect(260, 776, 70, 16, '#ff8fb1', 4, 3) + rect(780, 770, 90, 22, '#3a3a3a', 4, 3);
  s += wallClock(960, 170, 60, t) + windowFrame(-200, 300, 220, 420) + vCurtain(-60, 290, 90, 450, '#ff8fb1', t, -1);
  s += vShelf(-20, 1000, 200, vBooks(-10, 1000, 180, 4)) + vPoster(1040, 600, 90, 300, '#7aa6d8', 4, ftext(0, 0, '1+1', { size: 34, fill: '#fff', stroke: 'none' }), t) + vOutlet(1010, 1170) + vSwitch(40, 900);
  for (let i = 0; i < 4; i++) s += circ(380 + i * 110, 880, 9, '#7d848c', 3) + (i % 2 ? vBag(380 + i * 110, 1010, .5, DPAL[i + 1]) : '');
  return s + vParquet(yb, '#c49a6c') + vBin(1010, 1300, .7) + vPot(60, 1290, .9, t, 1) + vRug(CX, 1520, 700, 140, '#7aa6d8', '#ffd23f'); }
function bedroomN(t, lamp = 0) { const yb = 1250; let s = vWall('star', '#1d2350', '#2e3a80', yb) + rect(-M, 900, W + 2 * M, yb - 900, '#262c5e', 0, 0) + line(-M, 900, W + M, 900, 5, '#3a4290');
  s += vWindowView(620, 230, 360, 420, t, { night: true }); for (let i = 0; i < 6; i++) s += sparkle(650 + (i * 67) % 300, 270 + (i * 113) % 200, .18 + .1 * Math.sin(t * 3 + i), '#fff6d6');
  s += vCurtain(560, 210, 110, 480, '#5a3a8a', t, 1) + vCurtain(930, 210, 110, 480, '#5a3a8a', t, -1);
  s += rect(90, 300, 230, 300, '#ff8fb1', 10) + ftext(205, 470, '★', { size: 120, fill: '#fff', stroke: 'none' }) + vFrame(400, 380, 120, 150, 'sea', '#8a6ad8', 3) + vShelf(60, 720, 420, vBooks(80, 720, 180, 7) + vTrophy(310, 720, .9) + vTeddy(410, 720, .7));
  s += G(tr(820, 1260), rect(-260, -260, 40, 300, '#6b4a8a', 10, 6) + rect(-240, -90, 520, 110, '#8a6ad8', 16, 6) + path('M-220 -100Q20 -150 270 -100L280 0L-220 0Z', '#5ec4f0', 6) + path('M-200 -70Q0 -100 260 -70', 'none', 4, '#3a9ac0') + ell(-160, -130, 70, 34, '#fff', 5) + vTeddy(-40, -110, .6, '#ff9a4d'));
  s += G(tr(470, 1250), rect(-70, -150, 140, 150, '#6b4a8a', 8, 5) + line(-60, -75, 60, -75, 4) + rect(-50, -200, 100, 50, '#141a3a', 8, 4) + ftext(0, -164, Math.sin(t * 6) > 0 ? '02:47' : '02 47', { size: 26, fill: '#ff5c8a', stroke: 'none' }) + op(.25, circ(0, -176, 70, '#ff5c8a', 0)));
  s += vOutlet(70, 1100) + vSwitch(1040, 960);
  return s + rect(-M, yb, W + 2 * M, 1400, '#3a3050', 0, 0) + line(-M, yb, W + M, yb, 6, '#2a2240') + vRug(330, 1420, 520, 120, '#5a3a8a', '#ff8fb1') + vShoes(180, 1330, .55, '#ff8fb1') + vBall(940, 1360, .5, 0, '#ffc83d'); }
function discoBall(x, y, s, t) { let g = circ(0, 0, 90, '#c9d3dc', 7); for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) { if (i * i + j * j > 10) continue; const lit = Math.sin(t * 6 + i * 1.7 + j * 2.3) > .4; g += rect(i * 24 - 10, j * 24 - 10, 20, 20, lit ? '#fff' : '#9aa8b5', 3, 0); } return G(tr(x, y, s), line(0, -400, 0, -90, 6) + g); }
function partyT(t, o = {}) { let s = grad('#3a1a5c', '#170b2a', -M, -M, W + 2 * M, H + 2 * M) + vWall('dot', 'rgba(0,0,0,0)', 'rgba(255,255,255,.05)', 1300); const cols = ['#ff5c8a', '#5ec4f0', '#ffd23f', '#7be07b'];
  s += vWindowView(-120, 640, 220, 300, t, { night: true }) + vWindowView(980, 640, 220, 300, t, { night: true }) + vNeon(940, 1010, 'PARTY', '#ff5c8a', t, 48);
  for (let i = 0; i < 4; i++) { const a = Math.sin(t * .9 + i * 1.6) * 30; s += op(.16, G(tr(150 + i * 260, -50, 1, a), path('M-30 0L30 0L260 1500L-260 1500Z', cols[i], 0))); }
  s += vStreamers(t, -20, 9);
  let gd = 'M-60 300'; for (let i = 0; i < 12; i++) gd += `Q${-60 + i * 110 + 55} ${360} ${-60 + (i + 1) * 110} 300`; s += path(gd, 'none', 5, '#2b2420');
  for (let i = 0; i < 12; i++) s += circ(-5 + i * 110, 338, 14, Math.sin(t * 5 + i * 1.3) > 0 ? cols[i % 4] : '#4a3a5a', 4);
  s += discoBall(CX, 160, .9, t) + vBalloon(70, 520, '#ff5c8a', t, 0, .8) + vBalloon(150, 590, '#ffd23f', t, 1, .7) + vBalloon(960, 540, '#5ec4f0', t, 2, .8) + vBalloon(1030, 610, '#7be07b', t, 3, .7);
  s += G(tr(820, 1300), rect(-150, -150, 300, 24, '#ff9a4d', 6, 5) + line(-130, -126, -130, 0, 8) + line(130, -126, 130, 0, 8) + [-100, -40, 30, 90].map((x, i) => i % 2 ? rect(x - 14, -196, 28, 46, '#e2463a', 4, 4) : ell(x, -164, 36, 14, '#ffd23f', 4)).join(''));
  s += vSpeaker(40, 1310, .9, t) + vSpeaker(1040, 1310, .9, t);
  if (o.dancers !== false) for (let i = 0; i < 5; i++) { const x = 60 + i * 240 + (o.part || 0) * (i < 2 ? -260 : i > 2 ? 260 : 0); s += op(.75, person({ age: 'adult', x, y: 1330 + (i % 2) * 40, s: .62, skin: '#4a2f5e', shirt: '#2e1a46', pants: '#1c1030', hair: KH[i], hairColor: '#1c1030', face: { eyes: 'closed', mouth: 'grin' }, armL: [200 + wave(t, 1.2, 40, i * .2), 250], armR: [-20 - wave(t, 1.2, 40, i * .2 + .5), -70], bob: 3, seed: 80 + i }, t * 1.6)); }
  s += rect(-M, 1300, W + 2 * M, 900, '#1c0f2e', 0, 0); for (let i = 0; i < 8; i++) s += rect(-80 + i * 160, 1320, 150, 70, Math.sin(t * 4 + i * 2) > 0 ? 'rgba(255,92,138,.35)' : 'rgba(94,196,240,.25)', 6, 0);
  for (let i = 0; i < 14; i++) s += rect((i * 97) % 1080, 1420 + (i * 53) % 300, 16, 26, DPAL[i % 8], 3, 0);
  return s; }
function pointHand(tx, ty, ang, sleeve, k = 1, len = 700) { if (k <= 0) return ''; const a = R(ang), off = (1 - k) * 800;
  return G(tr(tx - Math.cos(a) * off, ty - Math.sin(a) * off, 1, ang), line(-len, 0, -100, 0, 74, OL) + line(-len, 0, -100, 0, 60, sleeve) + rect(-54, -18, 70, 36, SKIN, 18, 6) + rect(-130, -46, 96, 92, SKIN, 38, 6) + path('M-100 -10L-50 -10M-100 14L-50 14', 'none', 5) + ell(-82, -46, 30, 16, SKIN, 6)); }
function parkA(t) { const yb = 1200;
  let s = SKY(t, '#9fe0ff', '#fff4dc') + op(.8, vSkyline(1060, '#c3d6e4', 8)) + vHaze(.15) + ell(200, 1130, 540, 130, '#9ccf8a', 0) + ell(900, 1120, 540, 120, '#8fc77d', 0);
  s += tree(110, 1200, 1, t) + vPine(330, 1180, .8, t) + tree(990, 1190, 1.05, t) + vPine(770, 1170, .7, t) + vLampPost(560, 1200, .85) + vBench(840, 1215, .75) + vBin(660, 1210, .55, '#36a85a') + vBirds(t, 2, 330);
  s += rect(-M, yb, W + 2 * M, 1500, '#8fd16a', 0, 0) + line(-M, yb, W + M, yb, 6, '#6fb84a') + path(`M-${M} 1520Q300 1330 540 1400Q800 1470 ${W + M} 1300L${W + M} 1420Q800 1580 540 1520Q300 1460 -${M} 1660Z`, '#e8d8b0', 0);
  s += ell(880, 1290, 180, 40, '#7fc8e8', 5) + G(tr(860 + wave(t, .4, 30), 1280), ell(0, 0, 26, 16, '#fff', 4) + circ(18, -16, 12, '#fff', 4) + path('M28 -16L40 -12L28 -9Z', '#ffb03a', 3));
  s += vBush(60, 1270, .7) + vFlowers(160, 1300, 6, 4, t) + vBush(1010, 1340, .6, '#4fa64f') + kidsBg(t, 1240, 2, .4);
  return s; }
function bathroomT(t) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#cfeaf0', 0, 0); for (let x = -M; x < W + M; x += 120) s += line(x, -M, x, H + M, 4, '#b2d6de'); for (let y = -M; y < H + M; y += 120) s += line(-M, y, W + M, y, 4, '#b2d6de');
  for (let x = -M; x < W + M; x += 120) s += rect(x, 190, 120, 60, ((x / 120) % 2 + 2) % 2 ? '#7fd3e6' : '#ffd23f', 0, 0); s += line(-M, 190, W + M, 190, 4, '#9cc8d2') + line(-M, 250, W + M, 250, 4, '#9cc8d2');
  s += rect(250, 120, 580, 44, '#e8eef0', 22, 5) + [0, 1, 2, 3].map(i => op(.6 + .3 * Math.sin(t * 3 + i), circ(320 + i * 145, 142, 18, '#fff6c8', 4))).join('');
  s += mirror(170, 280, 740, 860) + rect(770, 320, 80, 70, '#ffe066', 3, 3) + rect(700, 330, 70, 60, '#ff8fb1', 3, 3);
  s += line(-10, 520, 120, 520, 10, '#c8ced6') + towel(10, 520, 100, 300, '#ff8fb1', '#fff') + vShelf(940, 640, 150, vJar(980, 640, '#7be07b') + rect(1020, 560, 40, 80, '#5ec4f0', 10, 4) + rect(1028, 540, 24, 22, '#fff', 4, 3)) + vShelf(940, 900, 150, vPot(1010, 900, .6, t, 2, '#fff')) + vOutlet(60, 1000);
  s += rect(-M, 1250, W + 2 * M, 1400, '#e8eef0', 0, 0) + line(-M, 1250, W + M, 1250, 7, '#b8c4c8') + path(`M${CX - 300} 1250L${CX + 300} 1250Q${CX + 280} 1420 ${CX} 1430Q${CX - 280} 1420 ${CX - 300} 1250Z`, '#fff');
  s += rect(CX - 20, 1170, 40, 80, '#c8ced6', 8, 5) + path(`M${CX - 20} 1180L${CX - 20} 1150Q${CX - 20} 1130 ${CX + 30} 1130L${CX + 60} 1130L${CX + 60} 1160`, 'none', 14, '#c8ced6') + (() => { const k = (t * 1.3) % 1; return circ(CX + 60, 1170 + k * 120, 8, '#9fd6ff', 3); })();
  s += G(tr(170, 1250), rect(-36, -110, 72, 110, '#7fd3e6', 14, 5) + line(-10, -110, -16, -170, 7, '#ff8fb1') + line(12, -110, 22, -176, 7, '#5ec4f0')) + G(tr(900, 1250), rect(-40, -120, 80, 120, '#fff', 20, 5) + rect(-10, -150, 20, 30, '#c8ced6', 4, 4) + path('M10 -150L46 -150', 'none', 8, '#c8ced6')) + G(tr(990, 1250 + wave(t, 1.2, 3)), ell(0, -30, 44, 30, '#ffd23f', 5) + circ(24, -70, 24, '#ffd23f', 5) + path('M44 -72L66 -66L44 -60Z', '#ff9a4d', 3) + circ(30, -76, 4, OL, 0));
  return s; }
const hangLamp = (x, y, t, k = 1) => { const sw = wave(t, .6, 8); return G(tr(x, 0, 1, sw), line(0, -M, 0, y, 6) + op(.28 * k, path(`M-50 ${y + 40}L50 ${y + 40}L380 ${y + 1200}L-380 ${y + 1200}Z`, '#fff6b0', 0)) + path(`M-90 ${y + 50}L90 ${y + 50}L40 ${y - 20}L-40 ${y - 20}Z`, '#3a3f4a', 6) + circ(0, y + 52, 22, '#fff6b0', 4)); };
const calPage = (x, y, s, str, c, r = 0, sub = '') => G(tr(x, y, s, r), rect(-110, -130, 220, 260, '#fff', 16, 6) + rect(-110, -130, 220, 70, c, 16, 6) + ftext(0, -82, str, { size: 34, fill: '#fff', stroke: 'none' }) + (sub ? ftext(0, 40, sub, { size: 90, fill: OL, stroke: 'none' }) : ''));

// ============================================================
//  ÉPISODE « le pote pauvre » : héros (t-shirt orange avec un écusson cousu main, grosses chaussures solides), ses potes, Kevin, maman.
//  Ton bienveillant : on rit des situations (prix, Kevin, excuses), jamais du héros ni de sa famille.
// ============================================================
const HEROC = { age: 'kid', hair: 'curly', hairColor: '#2b2420', skin: '#c98a5e', shirt: '#ffb03a', pants: '#4b5b7a', shoes: '#7a4a2a', seed: 2 };
// écusson cousu main (cœur bleu, points de couture) : la marque visuelle du héros
const patchP = (x, y, s = 1) => G(tr(x, y, s, -8), rect(-24, -22, 48, 44, '#5ec4f0', 8, 5) + `<rect x="-16" y="-14" width="32" height="28" rx="5" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="5 4"/>` + heart(0, -2, .32, '#ff5d73'));
function pvHero(o, t) { const bob = (o.bob ?? 1) * wave(t, .8, 4, 2); return person(Object.assign({}, HEROC, o), t) + (o.patch === false ? '' : G(ptr(o), patchP(-32, -122 + bob))); }
const pvHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, HEROC, o), t));
const POTES = [0, 3, 4, 1];
const pote = (i, o, t) => kid(POTES[i % 4], o, t);
const poteHead = (i, x, y, r, o, t) => { const j = POTES[i % 4]; return G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: KH[j], hairColor: KC[j], skin: SK[j], seed: 20 + j }, o), t)); };
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const MAMAN = { age: 'adult', hair: 'bun', hairColor: '#2b2420', skin: '#c98a5e', shirt: '#e86a8a', pants: '#4b3b6e', necklace: true, seed: 4 };
const maman = (o, t) => person(Object.assign({}, MAMAN, o), t);
const serveur = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#1f1a18', mustache: true, shirt: '#fff', apron: '#2b2420', pants: '#2b2b33', seed: 8 }, o), t);
// nez de Pinocchio (gros plan, la tête regarde vers la droite)
const pinoNose = (x, y, r, L) => L <= 0 ? '' : rect(x, y - r * .09, L, r * .2, HEROC.skin, r * .1, 5) + circ(x + L, y + r * .01, r * .11, HEROC.skin, 5);

// ---------- accessoires ----------
function phoneBig(x, y, s, r, screen) { return G(tr(x, y, s, r), rect(-170, -330, 340, 660, '#2b2b33', 44) + rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + screen + rect(-50, -318, 100, 14, '#444', 7, 0)); }
const pastaBox = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-60, -90, 120, 180, '#4d7cf0', 10, 5) + rect(-44, -44, 88, 66, '#fff6c8', 8, 4) + [0, 1, 2, 3].map(i => path(`M${-34 + i * 20} -30q8 14 0 28q-8 14 0 26`, 'none', 6, '#f2b632')).join('') + ftext(0, -58, 'PÂTES', { size: 24, fill: '#fff', stroke: 'none' }) + rect(-40, 40, 80, 32, '#ffd23f', 8, 4) + ftext(0, 64, '0,89€', { size: 20, fill: OL, stroke: 'none' }));
function bigBoot(x, y, s = 1, r = 0, o = {}) { const c = o.c || '#8a5a3a';
  return G(tr(x, y, s, r) + (o.flip ? ' scale(-1 1)' : ''), path('M-90 0L-90 -160Q-90 -180 -70 -180L10 -180Q24 -180 24 -160L24 -86Q70 -76 116 -56Q146 -42 146 -12L146 0Z', c, 7) + rect(-104, -8, 262, 34, '#3a2a20', 10, 6) + [0, 1, 2, 3].map(i => line(-60, -164 + i * 22, 2, -150 + i * 22, 6, '#f4e2c0')).join('') +
    rect(40, -66, 50, 40, shade(c, -.25), 6, 4) + `<rect x="46" y="-60" width="38" height="28" rx="4" fill="none" stroke="#f4e2c0" stroke-width="3" stroke-dasharray="5 4"/>` + path('M-80 -60l30 8M-74 -30l24 -6M100 -30l20 6', 'none', 4, shade(c, -.35)) + rect(-90, -186, 114, 18, shade(c, -.2), 6, 5)); }
function sneaker(x, y, s = 1, c = '#ff5c8a', r = 0, t = 0) { return G(tr(x, y, s, r), path('M-120 0L-120 -64Q-110 -96 -66 -86L-4 -66Q56 -54 112 -32Q134 -20 128 0Z', '#fff', 7) + path('M-100 -30Q-20 -70 80 -36Q10 -40 -96 -6Z', c, 4) + rect(-128, -4, 264, 26, c, 10, 6) + [0, 1, 2].map(i => line(-70 + i * 22, -84 + i * 6, -50 + i * 22, -60 + i * 6, 5)).join('') + sparkle(100, -90, .35 + .15 * Math.sin(t * 9), '#fff') + sparkle(-120, -110, .28 + .12 * Math.sin(t * 7 + 1), '#ffd23f')); }
const shoeBox = (x, y, s = 1, open = 0) => G(tr(x, y, s), rect(-170, -90, 340, 120, '#d9a86c', 8, 6) + ftext(0, -12, 'SOLIDE', { size: 34, fill: '#7a4a2a', stroke: 'none' }) + G(tr(-170, -90, 1, -open * 70), rect(0, -26, 340, 30, '#c8955a', 6, 6)));
function burgerP(x, y, s = 1, t = 0) { return G(tr(x, y, s), rect(-90, -20, 180, 34, '#e8a050', 16, 5) + rect(-100, -44, 200, 28, '#6b3e26', 12, 5) + path('M-104 -46L104 -46L84 -30L60 -48L30 -28L0 -48L-30 -28L-60 -48L-84 -30Z', '#ffd23f', 4) + path('M-100 -56Q-60 -40 -30 -58Q0 -40 30 -58Q60 -40 100 -56L100 -48L-100 -48Z', '#7be07b', 4) + path('M-96 -56Q-96 -150 0 -150Q96 -150 96 -56Z', '#f0a850', 5) + [[-40, -110], [0, -125], [36, -104], [-10, -90], [60, -80]].map(([a, b]) => ell(a, b, 7, 4, '#fff6dc', 0)).join('')); }
const saladP = (x, y, s = 1) => G(tr(x, y, s), path('M-90 -10Q0 60 90 -10Z', '#fff', 5) + circ(-40, -24, 26, '#7be07b', 4) + circ(0, -34, 28, '#5fb85f', 4) + circ(40, -24, 26, '#7be07b', 4) + circ(-14, -14, 12, '#e2463a', 3) + circ(24, -16, 10, '#e2463a', 3));
const cakeP = (x, y, s = 1) => G(tr(x, y, s), path('M-80 0L80 0L80 -70L-80 -100Z', '#ff8fb1', 5) + path('M-80 -40L80 -26', 'none', 8, '#fff') + path('M-80 -100L80 -70', 'none', 10, '#fff') + circ(10, -104, 16, '#e2463a', 4) + line(10, -118, 20, -138, 4, '#36a85a'));
const dishP = (x, y, s, inner) => G(tr(x, y, s), ell(0, 0, 130, 34, '#fff', 5) + ell(0, -2, 92, 22, '#f2f2f2', 3) + G(tr(0, -6, .7), inner));
function waterGlass(x, y, s = 1, lvl = .7, t = 0) { const h = 170 * lvl; return G(tr(x, y, s), path(`M-50 ${-h}L50 ${-h}L42 0L-42 0Z`, 'rgba(140,210,255,.75)', 0) + rect(-20, -h + 10 + wave(t, 1, 4), 30, 30, 'rgba(255,255,255,.85)', 6, 3) + path('M-56 -180L56 -180L44 0L-44 0Z', 'rgba(255,255,255,.25)', 6) + line(-36, -160, -30, -30, 6, 'rgba(255,255,255,.7)')); }
function receipt(x, y, s, len, t, o = {}) { let g = rect(-110, 0, 220, len, '#fff', 4, 5) + ftext(0, 50, 'ADDITION', { size: 30, fill: OL, stroke: 'none' }); for (let yy = 80; yy < len - 80; yy += 34) g += line(-80, yy, 40, yy, 5, '#c9ced6') + line(60, yy, 86, yy, 5, '#c9ced6');
  if (len > 200) g += line(-90, len - 66, 90, len - 66, 4) + ftext(0, len - 22, o.total || 'TOTAL : 96 €', { size: 26, fill: SX.acc, stroke: 'none' }); return G(tr(x, y, s, o.r || 0), g); }
function tapP(x, y, s = 1, t = 0, on = 1) { let g = rect(-26, -20, 52, 140, '#c8ced6', 10, 5) + path('M-26 -10Q-26 -60 30 -60L110 -60L110 -20L40 -20Q20 -20 20 0', '#c8ced6', 6) + rect(-50, -100, 100, 26, '#9aa3ad', 10, 5) + rect(-8, -126, 16, 30, '#9aa3ad', 4, 4);
  if (on) for (let i = 0; i < 4; i++) { const k = (t * 2 + i / 4) % 1; g += circ(96 + wave(t, 2, 2, i), -10 + k * 160, 10, '#9fd6ff', 3); } return G(tr(x, y, s), g); }
function invite(kind, x, y, s, t, t0, r = 0) { const k = popEl(t, t0, .45); if (k <= 0) return ''; let g;
  if (kind === 'anniv') g = rect(-220, -160, 440, 320, '#fff8e0', 22, 7) + rect(-220, -160, 440, 70, '#ff8fb1', 22, 7) + ftext(0, -110, 'ANNIV !', { size: 44, fill: '#fff' }) + G(tr(-80, 90, .55), rect(-120, -80, 240, 120, '#ff8fb1', 20, 6) + [0, 1, 2].map(i => rect(-60 + i * 50, -140, 16, 60, DPAL[i + 1], 4, 4)).join('')) + ftext(90, 40, 'SAMEDI', { size: 34, fill: OL, stroke: 'none' }) + ftext(90, 90, '20 H', { size: 34, fill: OL, stroke: 'none' });
  else if (kind === 'concert') g = rect(-240, -130, 480, 260, '#8a6ad8', 18, 7) + `<line x1="110" y1="-130" x2="110" y2="130" stroke="#fff" stroke-width="5" stroke-dasharray="12 10"/>` + ftext(-60, -50, 'CONCERT', { size: 46, fill: '#fff' }) + ftext(-60, 20, '♪ ♫ ♪', { size: 56, fill: SX.acc2, stroke: 'none' }) + ftext(-60, 80, 'FOSSE', { size: 28, fill: '#fff', stroke: 'none' }) + ftext(176, 16, 'N°7', { size: 40, fill: '#fff', stroke: 'none' });
  else g = rect(-250, -130, 500, 260, '#5ec4f0', 18, 7) + rect(-250, -130, 500, 64, '#2f6fb0', 18, 7) + ftext(0, -82, 'BOARDING PASS', { size: 32, fill: '#fff', stroke: 'none' }) + ftext(-120, 10, 'PARIS', { size: 36, fill: OL, stroke: 'none' }) + ftext(120, 10, 'BALI', { size: 36, fill: OL, stroke: 'none' }) + path('M-30 0L40 0M20 -16L40 0L20 16', 'none', 7) + `<line x1="-210" y1="70" x2="210" y2="70" stroke="${OL}" stroke-width="4" stroke-dasharray="6 6"/>`;
  return G(tr(x, y, s * k, r + (1 - k) * 20), g); }
// balance : fléau qui penche (ang), plateaux gauche/droite (contenu SVG)
function balance(x, y, s, ang, left, right) { const a = R(ang), dx = Math.cos(a) * 330, dy = Math.sin(a) * 330;
  const pan = (px, py, inner) => G(tr(px, py), line(-110, 150, 0, 0, 5) + line(110, 150, 0, 0, 5) + path('M-150 150L150 150Q120 210 0 210Q-120 210 -150 150Z', '#ffd23f', 6) + G(tr(0, 140), inner));
  return G(tr(x, y, s), rect(-20, 0, 40, 520, '#c9a020', 8, 6) + path('M-160 560L160 560L110 500L-110 500Z', '#c9a020', 6) + pan(-dx, -dy, left) + pan(dx, dy, right) + line(-dx, -dy, dx, dy, 22) + line(-dx, -dy, dx, dy, 12, '#ffd23f') + circ(0, 0, 34, '#ffd23f', 6) + path('M0 -70L-20 -34L20 -34Z', '#ffd23f', 5)); }
const piggy = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), ell(0, 0, 110, 85, '#ff9ab8', 6) + circ(98, -10, 34, '#ff9ab8', 6) + ell(122, -10, 13, 17, '#ff7aa0', 4) + circ(62, -40, 7, OL, 0) + path('M-24 -84L20 -84', 'none', 8) + path('M-40 -70L-58 -112L-14 -82Z', '#ff9ab8', 5) + rect(-70, 66, 26, 32, '#ff9ab8', 6, 5) + rect(40, 66, 26, 32, '#ff9ab8', 6, 5) + path('M-110 -10Q-140 -30 -126 -50', 'none', 6));
const coinP = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), circ(0, 0, 30, '#ffd23f', 5) + ftext(0, 12, '€', { size: 32, fill: '#c9a020', stroke: 'none' }));
const billP = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-90, -45, 180, 90, '#8fd18a', 8, 5) + circ(0, 0, 26, '#bfe8b5', 4) + ftext(0, 14, '€', { size: 40, fill: '#4b8f46', stroke: 'none' }));
function moneyRain(t, t0, n = 14, seed = 5) { if (t < t0) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * W, sp = 500 + r() * 400, y = -100 + ((t - t0) * sp + r() * 600) % (H + 200); s += (i % 3 ? billP : coinP)(x + Math.sin(t * 2 + i) * 40, y, .8 + r() * .4, (t * 120 + i * 40) % 360); } return s; }
// carte bancaire en méditation (jeûne intermittent)
function cardZen(x, y, s, t) { const b = wave(t, .5, 6); return G(tr(x, y + b, s), path('M-120 120Q-200 150 -160 170L160 170Q200 150 120 120', 'none', 20, '#4d7cf0') + rect(-160, -110, 320, 200, '#4d7cf0', 24, 7) + rect(-120, -60, 64, 50, '#ffd23f', 8, 4) + line(-120, -36, -56, -36, 3) + ftext(40, 64, '•••• 0,00', { size: 26, fill: '#fff', stroke: 'none' }) +
  path('M30 -40Q50 -26 70 -40M100 -40Q120 -26 140 -40', 'none', 6) + path('M70 0Q86 10 102 0', 'none', 5) + line(-170, 0, -230, -50, 10) + line(170, 0, 230, -50, 10) + circ(-236, -56, 16, '#fff', 5) + circ(236, -56, 16, '#fff', 5) + op(.5 + .3 * Math.sin(t * 3), ftext(0, -150, 'ommm', { size: 34, fill: '#fff', stroke: OL }))); }
function slotMachine(x, y, s, t, t0, words) { const sp = t > t0 && t < t0 + .7; let g = rect(-230, -260, 460, 480, '#e2463a', 40, 7) + rect(-200, -320, 400, 90, '#ffd23f', 30, 7) + ftext(0, -262, 'EXCUSES', { size: 44, fill: '#e2463a', stroke: 'none' }) + rect(-190, -170, 380, 170, '#fff', 16, 6);
  for (let i = 0; i < 3; i++) { const w = sp ? '?!#%&'[Math.floor(t * 30 + i * 2) % 5] : words[i]; g += line(-63 + i * 127, -170, -63 + i * 127, 0, 5) + ftext(-127 + i * 127, -62, w, { size: sp ? 70 : 64, fill: [SX.acc, '#4d7cf0', '#ff9a4d'][i], stroke: 'none' }); }
  const lv = sp ? 60 : -60; return G(tr(x, y, s), g + rect(-160, 60, 320, 70, '#c43a2e', 16, 6) + line(250, -40, 290, lv - 60, 14) + circ(290, lv - 70, 34, '#ffd23f', 6) + [-120, -40, 40, 120].map(cx => circ(cx, -210, 10, Math.sin(t * 12 + cx) > 0 ? '#fff6c8' : '#c43a2e', 3)).join('')); }
const thought = (x, y, w, h, inner, t, t0) => { const k = popEl(t, t0, .45); if (k <= 0) return ''; return G(tr(x, y, k), circ(-w * .42, h * .62, 20, '#fff', 5) + circ(-w * .3, h * .5, 30, '#fff', 5) + ell(0, 0, w / 2, h / 2, '#fff', 6) + clipR(-w / 2 + 30, -h / 2 + 30, w - 60, h - 60, inner, (h - 60) / 2)); };
const crickets = (t, n = 3) => Array.from({ length: n }, (_, i) => G(tr(200 + i * 340, 1300 + (i % 2) * 60 + Math.abs(Math.sin(t * 8 + i)) * -14), ell(0, 0, 30, 14, '#5a8a3a', 4) + line(20, -6, 50, -30, 3) + line(14, -8, 40, -36, 3))).join('');
const rainCloud = (x, y, s, t) => G(tr(x, y, s), cloud(0, 0, 1, '#7d8a9c') + Array.from({ length: 6 }, (_, i) => { const k = (t * 1.6 + i / 6) % 1; return line(-70 + i * 28, 40 + k * 160, -76 + i * 28, 70 + k * 160, 6, 'rgba(160,200,255,.8)'); }).join(''));
// photo de vacances (plage) : potes souriants (+ place libre pour le héros)
function beachPic(t, o = {}) { let s = rect(-200, -160, 400, 320, '#9fe0ff', 0, 0) + circ(150, -110, 34, '#fff3b0', 0) + rect(-200, 30, 400, 40, '#4d9fd8', 0, 0) + rect(-200, 60, 400, 100, '#f4dca0', 0, 0) + path('M-170 60L-150 -60L-130 60Z', '#5fb85f', 3);
  const xs = o.hero ? [-140, -60, 60, 140] : [-120, -40, 40, 120]; [0, 1, 2].forEach(i => { const x = o.hero ? [-140, -60, 140][i] : [-110, 0, 110][i]; s += poteHead(i, x, 60, 44, { expr: 'ecstatic' }, t); });
  if (o.hero) s += pvHead(50, 60, 44, { expr: 'ecstatic' }, t); else if (o.gap) s += `<ellipse cx="50" cy="60" rx="44" ry="50" fill="rgba(255,255,255,.4)" stroke="#fff" stroke-width="5" stroke-dasharray="10 8"/>`;
  return s + rect(-200, 110, 400, 60, '#f4dca0', 0, 0); }

// ---------- décors ----------
const restoTable = (x, yb, s = 1, w = 760) => G(tr(x, yb, s), path(`M${-w / 2} -60L${w / 2} -60L${w / 2 + 30} 60L${-w / 2 - 30} 60Z`, '#fff', 6) + Array.from({ length: Math.floor(w / 60) }, (_, i) => rect(-w / 2 + i * 60 + 4, -56, 30, 54, i % 2 ? '#e2463a' : 'rgba(0,0,0,0)', 0, 0) + rect(-w / 2 + i * 60 + 34 - 6, 6, 32, 50, i % 2 ? 'rgba(0,0,0,0)' : '#e2463a', 0, 0)).join('') + path(`M${-w / 2} -60L${w / 2} -60L${w / 2 + 30} 60L${-w / 2 - 30} 60Z`, 'none', 6) + rect(-w / 2 + 40, 60, 26, 500, '#6b3e26', 6, 5) + rect(w / 2 - 66, 60, 26, 500, '#6b3e26', 6, 5));
function restoT(t, o = {}) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#b85a44', 0, 0);
  for (let y = -60, j = 0; y < 900; y += 56, j++) for (let x = -M + (j % 2) * 60; x < W + M; x += 120) s += rect(x + 3, y + 3, 114, 50, (j * 7 + x) % 3 ? '#cc6a52' : '#c0604a', 6, 0);
  s += rect(-M, 900, W + 2 * M, yb - 900, '#7a4a2a', 0, 0); for (let x = -M; x < W + M; x += 90) s += line(x, 900, x, yb, 4, '#5a3420'); s += rect(-M, 890, W + 2 * M, 22, '#5a3420', 4, 5) + vBase(yb, '#4a2a18');
  s += G(tr(230, 440, 1, -2), rect(-170, -210, 340, 420, '#8a5a3a', 18, 7) + rect(-150, -190, 300, 380, '#2f3a35', 10, 0) + ftext(0, -130, 'MENU', { size: 46, fill: '#fff', stroke: 'none' }) + [['BURGER', '18€'], ['FRITES', '7€'], ['SODA', '6€'], ['DESSERT', '9€']].map(([a, b], i) => ftext(-120, -60 + i * 62, a, { size: 28, fill: 'rgba(255,255,255,.85)', stroke: 'none', anchor: 'start' }) + ftext(120, -60 + i * 62, b, { size: 28, fill: SX.acc2, stroke: 'none', anchor: 'end' })).join(''));
  s += vNeon(760, 230, 'BURGER', '#ff5c8a', t, 66) + G(tr(760, 300), ftext(0, 0, '★ ★ ★', { size: 30, fill: SX.acc2, stroke: 'none' }));
  s += vWindowView(600, 380, 330, 330, t) + rect(590, 360, 350, 30, '#2f3a35', 6, 5) + [0, 1, 2, 3, 4, 5].map(i => path(`M${590 + i * 58} 390L${648 + i * 58} 390L${648 + i * 58} 440Q${619 + i * 58} ${462 + wave(t, .6, 5, i)} ${590 + i * 58} 440Z`, i % 2 ? '#fff' : '#36a85a', 4)).join('');
  s += vFrame(990, 420, 110, 140, 'sea', '#c38a52', 4) + vFrame(990, 620, 100, 120, 'mount', '#2f3a35', -3) + vFrame(440, 220, 110, 90, 'heart', '#c38a52', 3);
  s += vShelf(380, 760, 300, vJar(410, 760, '#ff9a4d', .8) + vJar(470, 760, '#7be07b', .8) + vPot(560, 760, .45, t, 2, '#e2463a') + rect(620, 700, 36, 60, '#36a85a', 8, 4) + rect(626, 680, 24, 22, '#e2463a', 4, 3)) + wallClock(540, 140, 44, t);
  s += hangLamp(300, 620, t, .6) + hangLamp(800, 640, t + 1, .6);
  if (o.diners !== false) for (let i = 0; i < 3; i++) { const x = [120, 540, 960][i]; s += op(.9, adult(i + 1, { x, y: 1180, s: .5, expr: ['happy', 'laugh', 'talk'][i], flip: i % 2, armR: [-30, -80] }, t + i) + G(tr(x, 1110), rect(-130, -10, 260, 26, '#fff', 6, 4) + ell(-50, -14, 34, 10, '#fff', 3) + ell(60, -14, 34, 10, '#fff', 3))); }
  s += WASH('rgba(255,240,230,.12)') + vTileFloor(yb, '#f2e6d0', '#3a3f4a') + vPot(60, 1290, 1.1, t, 1) + vPot(1020, 1290, 1, t, 0) + G(tr(1000, yb), line(0, 0, 0, -520, 10, '#6b3e26') + circ(-40, -480, 34, '#e2463a', 5) + circ(40, -460, 30, '#5b8fd8', 5));
  return s; }
function museeT(t) { const yb = 1250;
  let s = vWall('stripe', '#f1e6cf', '#eadcc0', yb) + rect(-M, 110, W + 2 * M, 50, '#d8c4a0', 0, 5) + rect(-M, 960, W + 2 * M, yb - 960, '#d9c39a', 0, 0) + line(-M, 960, W + M, 960, 6, '#b89e70') + vBase(yb, '#fff');
  for (const x of [20, 1060]) s += rect(x - 60, 160, 120, 1090, '#fbf5e8', 4, 6) + rect(x - 80, 150, 160, 40, '#efe2c6', 6, 5) + rect(x - 80, 1210, 160, 40, '#efe2c6', 6, 5) + [-30, 0, 30].map(d => line(x + d, 200, x + d, 1200, 4, '#e6d8bc')).join('');
  s += G(tr(CX, 60), rect(-330, -40, 660, 80, '#7a2a3a', 14, 6) + ftext(0, 18, 'MUSÉE DE LA CHAUSSURE', { size: 38, fill: '#ffe9b0', stroke: 'none' }));
  for (let i = 0; i < 3; i++) s += op(.14, path(`M${270 + i * 270} 160L${200 + i * 270} 1250L${340 + i * 270} 1250Z`, '#fff6c8', 0)) + G(tr(270 + i * 270, 170), rect(-26, -16, 52, 26, '#3a3f4a', 6, 4));
  s += vPot(150, 1250, .9, t, 1, '#c38a52') + vPot(930, 1250, .9, t, 0, '#c38a52');
  s += WASH() + vParquet(yb, '#b98a5c') + rect(240, 1250, 600, 900, '#9a2a3a', 0, 0) + [180, 900].map(x => G(tr(x, 1320), rect(-14, -170, 28, 170, '#c9a020', 6, 4) + circ(0, -180, 22, '#ffd23f', 5) + rect(-40, -10, 80, 20, '#c9a020', 6, 4))).join('') + path('M180 1160Q540 1280 900 1160', 'none', 20, '#c43a3a');
  return s; }
const sepia = (svg) => svg + op(.35, rect(-200, -200, 400, 400, '#a8743a', 0, 0));
// mini-chambre du héros (simple mais chaleureuse) : nuit ou jour
const heroRoom = (t, night) => night ? bedroomN(t) : chambreH(t, { c1: '#e8f0d2', c2: '#d8e6b9' });

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, les potes en cut-out avec sacs de shopping, le héros au centre poches retournées ; « débloqué » sur PAUVRE
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const P = at(1, 'pauvre') - .05;
    const pockets = t > P ? G(tr(CX, 1380), path('M-62 -70Q-96 -50 -78 -24Q-60 -40 -50 -66Z', '#fff', 5) + path('M62 -70Q96 -50 78 -24Q60 -40 50 -66Z', '#fff', 5)) : '';
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) +
      cutout(pote(0, { x: 220, y: 1400, s: .9, expr: 'cool', armR: [-20, -60], holdL: vBag(0, 60, .55, '#ff8fb1', 6) }, t), 12) + cutout(pote(1, { x: 860, y: 1400, s: .9, expr: 'happy', flip: 1, holdL: vBag(0, 60, .55, '#5ec4f0', -6) }, t), 12) +
      unlock(CX, 1060, t, P, { part: 'back', r: 480 }) + G(tr(CX, 1380, 1 + .04 * Math.sin(t * 7)), cutout(pvHero({ x: 0, y: 0, s: 1.0, expr: t > P ? 'embarrassed' : 'happy', armL: [150, 120], armR: [30, 60] }, t), 10)) + pockets + unlock(CX, 1060, t, P, { part: 'front', r: 480 }) +
      kthin("POURQUOI C'EST HORRIBLE", CX, 330, t, .05, { size: 52 }) + kthin("D'ÊTRE LE POTE", CX, 415, t, .3, { size: 58 }) + kword('PAUVRE DU GROUPE ?', CX, 540, t, P, { size: 68, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'pauvre') - .05, 'boom', .6], [at(1, 'pauvre') + .05, 'sparkle', .6], [at(1, 'groupe'), 'boing', .4]] });
// B002 — tes potes organisent un week-end : papier, téléphone géant en cut-out, groupe « WEEK-END !!! », têtes des potes surexcitées
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Wk = at(2, 'week') - .05; const scr = chatBubble(-10, -170, 250, 90, 'on part ?', t, .05, false, 34) + chatBubble(10, -50, 250, 90, 'WEEK-END !!!', t, Wk, true, 34) + chatBubble(-10, 70, 230, 90, 'GO GO GO', t, Wk + .2, false, 36) + rect(-150, -295, 300, 70, SX.acc, 24, 0) + ftext(0, -248, 'LES POTES (4)', { size: 28, fill: '#fff', stroke: 'none' });
    return paper(SX.paper) + gobo(T, .12) + burst(CX, 860, 380, t, .02, '#d6f5e2', 16) + cutout(phoneBig(CX, 860, .95, -4, scr), 12) +
      cutout(poteHead(0, 210, 700, 95, { expr: 'ecstatic' }, t), 10) + cutout(poteHead(1, 880, 640, 90, { expr: 'joy' }, t), 10) + cutout(poteHead(2, 860, 1060, 85, { expr: 'ecstatic', tilt: 10 }, t), 10) +
      kthin('tes potes organisent', CX, 400, t, at(2, 'organisent') - .1, { size: 56 }) + kword('UN WEEK-END', CX, 520, t, Wk, { size: 92, fill: SX.acc }); },
  sfx: [[.05, 'pop_hi', .5], [at(2, 'organisent'), 'vibrate', .5], [at(2, 'week') - .05, 'pop', .7], [at(2, 'week') + .15, 'pop_hi', .5]] });
// B003 — 200 € par personne : grille sombre, compteur qui grimpe, billets qui pleuvent, le héros mâchoire au sol
B(3, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1, 1.1, eOutCubic(clamp(t / d))), shake: t > at(3, 'euros') ? 3 : 0 }),
  draw: (t, d, T) => gridBg('#173a2a') + halftoneFade(SX.acc, .08, 1) + moneyRain(t, .1, 12) + cutout(pvHead(CX, 1010, 170, { expr: t > at(3, 'euros') ? 'jawdrop' : 'worried', face: t > at(3, 'euros') ? { eyes: 'huge' } : {} }, t), 12) + sweatSpray(CX, 960, t, 4) +
    kword(`${counter(0, 200, t, .02, at(3, 'euros'))} €`, CX, 520, t, .02, { size: 170, fill: SX.acc2 }) + funTag(CX, 720, 'PAR PERSONNE', t, at(3, 'personne') - .05, { size: 54, bg: SX.acc }),
  sfx: [[.02, 'slot', .5], [at(3, 'euros'), 'kaching', .7], [at(3, 'personne') - .05, 'pop', .6], [at(3, 'personne') + .2, 'gulp', .6]] });
// B004 — Kevin regarde le prix : salon de Kevin, vautré dans le canapé, téléphone « 200 € »
B(4, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Pr = at(4, 'prix'); return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.4, svg: salonF(t, { noSofa: true }), haze: .06 }, { z: 1, svg: sofa(CX, 1330, 1, '#5ec4a0') + kevin({ x: CX, y: 1420, s: 1.25, expr: 'suspicious', look: [1, 0], armR: [-40, -110], holdR: phone(0, -40, .5, 0, ftext(0, 10, '200€', { size: 44, fill: SX.acc, stroke: 'none' })) }, t) }]) +
    funTag(CX - 250, 470, 'KEVIN', t, at(4, 'kevin'), { size: 56, bg: '#5fb85f' }) + markerCircle(CX + 120, 900, 120, 90, t, Pr) + markerText('le prix', CX + 260, 760, t, Pr + .1, { size: 54, col: SX.acc }); },
  sfx: [[0, 'whoosh', .6], [at(4, 'kevin'), 'pop', .6], [at(4, 'regarde'), 'hmm', .5], [at(4, 'prix'), 'scratch', .5]] });
// B005 — « Franchement, c'est donné ! » : Kevin extatique, il jette des pièces comme des confettis, rayons
B(5, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 3 }),
  draw: (t, d, T) => { const Dn = at(5, 'donne'); return salonF(t, { noSofa: true }) + rays(t, CX, 900, 'rgba(255,233,140,.45)', 'rgba(255,255,255,0)', 20) +
    kevin({ x: CX, y: 1480, s: 1.35, expr: 'ecstatic', armL: [200, 230], armR: [-20, -50] }, t) + (t > Dn ? Array.from({ length: 10 }, (_, i) => { const k = t - Dn, a = -1.57 + (i - 4.5) * .3; return coinP(CX + Math.cos(a) * 600 * k, 850 + Math.sin(a) * 700 * k + 900 * k * k, .9, k * 500 + i * 30); }).join('') : '') +
    kthin('franchement,', CX, 400, t, .05, { size: 58, fill: OL }) + kword("C'EST DONNÉ !", CX, 520, t, Dn - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[.05, 'flash_hit', .5], [at(5, 'donne') - .05, 'tada', .6], [at(5, 'donne'), 'coins', .7], [at(5, 'donne') + .4, 'coins', .5]] });
// B006a — toi, tu calcules : cuisine, calculette, vapeur qui sort de la tête, équations au marqueur
const O6 = at(6, 'combien') - .15;
B(6, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .4 }),
  draw: (t, d, T) => cuisine(t) + pvHero({ x: CX, y: 1460, s: 1.3, expr: 'effort', look: [0, 1], armL: [130, 100], armR: [50, 80], holdR: G(tr(0, 10, .8), rect(-50, -70, 100, 140, '#3a3f4a', 14, 5) + rect(-38, -58, 76, 36, '#bfe6c4', 6, 3) + ftext(0, -32, Math.floor(t * 30) % 1000 + '', { size: 22, fill: '#1d4026', stroke: 'none' })) }, t) + steam(CX - 60, 940, t, 1.2) + steam(CX + 60, 950, t + .4, 1) +
    markerText('200 ÷ 0,89', 250, 620, t, at(6, 'calculer') - .1, { size: 54, col: SX.acc }) + markerText('= ?', 850, 700, t, at(6, 'calculer') + .3, { size: 70, col: '#4d7cf0' }) + funTag(CX, 430, 'TOI', t, .05, { size: 60, bg: '#ffb03a' }),
  sfx: [[.05, 'pop', .6], [at(6, 'calculer') - .1, 'typing', .6], [at(6, 'calculer') + .2, 'scratch', .4], [.9, 'sizzle', .4]] });
// B006b — combien de paquets de pâtes : la tour de paquets monte jusqu'au plafond, compteur 224, le héros câline la tour (chill de ouf)
B(6, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const P0 = at(6, 'paquet') - O6, n = Math.floor(clamp((t - P0 + .2) / (d - P0 - .3)) * 24); let tower = '';
    for (let i = 0; i < n; i++) { const c = i % 3, row = Math.floor(i / 3); tower += pastaBox(700 + (c - 1) * 120 + (row % 2) * 20, 1230 - row * 150, .95, (i * 37 % 9) - 4); }
    return cuisine(t) + tower + pvHero({ x: 300, y: 1460, s: 1.3, expr: t > at(6, '200') - O6 ? 'love' : 'wow', armL: [160, 140], armR: [40, 20] }, t) +
      kword(`${counter(0, 224, t, P0, d - P0 - .4)}`, 300, 520, t, P0, { size: 140, fill: SX.acc2 }) + funTag(300, 680, 'PAQUETS DE PÂTES', t, at(6, 'pates') - O6, { size: 40, bg: '#4d7cf0' }) + (t > at(6, '200') - O6 ? heartsUp(t, 300, 900, 4, 260) : ''); },
  sfx: [[at(6, 'paquet') - O6, 'pop', .5], [at(6, 'pates') - O6, 'pop', .5], [at(6, 'acheter') - O6, 'pop_hi', .5], [at(6, '200') - O6, 'kaching', .6], [at(6, '200') - O6 + .3, 'angel', .4]] }, O6);
// B007 — « Bienvenue dans la vie du pote pauvre » : rue, devant son immeuble, banderole BIENVENUE, confettis (ironie tendre)
B(7, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const Bv = at(7, 'bienvenue'); return streetT(t, 3) + pvHero({ x: CX, y: 1460, s: 1.3, expr: 'happy', face: { brows: 'sad' }, armR: [-60, -110] }, t) + G(tr(CX, 1560), rect(-200, -30, 400, 70, '#c8955a', 12, 5) + ftext(0, 22, 'BIENVENUE', { size: 40, fill: '#7a4a2a', stroke: 'none' })) +
    confetti(t, Bv) + kword('BIENVENUE', CX, 430, t, Bv - .05, { size: 110, fill: SX.acc2 }) + funTag(CX, 590, 'NIVEAU : POTE PAUVRE', t, at(7, 'pauvre') - .15, { size: 42, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .5], [at(7, 'bienvenue') - .05, 'tada', .6], [at(7, 'vie'), 'pop', .5], [at(7, 'pauvre') - .15, 'pop_hi', .5]] });
// B008 — tout commence au collège : cour, sonnerie, le héros arrive avec un énorme cartable
B(8, { enter: 'whip', cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => schoolyard(t) + G(tr(190 + t * 160, 1330, 1, wave(t, 3, 4)), vBag(0, 0, 1.1, '#5b8fd8')) + pvHero({ x: 280 + t * 160, y: 1460, s: 1.3, expr: 'joy', walk: 3 }, t) + funTag(CX + 160, 460, 'COLLÈGE', t, at(8, 'college') - .05, { size: 70, bg: SX.cool }),
  sfx: [[0, 'school_bell', .5], [.1, 'steps', .5], [at(8, 'college') - .05, 'pop', .6]] });
// B009 — tes amis arrivent avec les dernières baskets : défilé au ralenti, lumière, basket sur un piédestal « baskets.png »
B(9, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), cy: 900 }),
  draw: (t, d, T) => { const Bk = at(9, 'baskets'); return schoolyard(t) + glow(CX, 700, 500, '#fff6c8', .5) + rays(t, CX, 700, 'rgba(255,240,170,.3)', 'rgba(255,255,255,0)', 18) +
    [0, 1, 2].map(i => pote(i, { x: 220 + i * 320, y: 1480 + (i % 2) * 30, s: 1.15, expr: 'cool', walk: 1, flip: i === 2 }, t * .4)).join('') +
    funBox(CX, 720, 420, 250, t, Bk - .2, { label: 'baskets.png' }) + (t > Bk - .2 ? sneaker(CX, 790, 1.4 * popEl(t, Bk - .2, .5), '#ff5c8a', -6, t) + popStars(CX, 720, t, Bk) : '') + kword('DERNIÈRES', CX, 430, t, at(9, 'dernieres') - .05, { size: 96, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .5], [.2, 'steps', .4], [at(9, 'dernieres') - .05, 'boom', .5], [at(9, 'baskets') - .2, 'sparkle', .6], [at(9, 'baskets') + .1, 'glint', .6]] });
// B010 — ta mère t'a acheté des chaussures : entrée, maman fière ouvre la boîte « SOLIDE », grosses chaussures brunes
B(10, { enter: 'none', trans: 'push', transD: .2, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const C = at(10, 'chaussures') - .15, k = eOutBack(seg(t, C, C + .4)); return entree(t) + maman({ x: 800, y: 1540, s: 1.2, expr: 'proud', flip: 1, armL: [200, 200], armR: [-20, -20] }, t) +
    pvHero({ x: 280, y: 1460, s: 1.3, expr: k > .5 ? 'worried' : 'neutral', look: [1, 0] }, t) + shoeBox(560, 1080, .8, k) + (k > 0 ? G(tr(560, 1000 - 60 * k, k), bigBoot(-70, 0, .55) + bigBoot(70, 0, .55, 0, { flip: 1 })) + popStars(560, 920, t, C + .2) : '') +
    funTag(CX, 440, 'MAMAN', t, at(10, 'mere') - .05, { size: 56, bg: '#e86a8a' }) + kword('CHAUSSURES', CX, 580, t, C + .1, { size: 92, fill: SX.acc2 }); },
  sfx: [[at(10, 'mere') - .05, 'pop', .6], [at(10, 'achete'), 'hmm', .4], [at(10, 'chaussures') - .15, 'squeak', .6], [at(10, 'chaussures'), 'tada', .4]] });
// B011 — « Elles sont super solides ! » : maman tape au marteau, c'est le marteau qui casse
B(11, { enter: 'crash', cam: (t, d) => ({ z: 1.06, shake: t > at(11, 'solides') && t < at(11, 'solides') + .3 ? 9 : 0 }),
  draw: (t, d, T) => { const S = at(11, 'solides'), hit = t > S; const ang = hit ? 20 : lerp(-60, 20, eInOut(seg(t, 0, S)));
    return entree(t) + maman({ x: 380, y: 1540, s: 1.25, expr: hit ? 'proud' : 'effort', armR: [-20 + ang, -10 + ang], holdR: G(tr(0, 0, 1, 0), rect(-8, -10, 16, 150, '#8a5a3a', 6, 4) + (hit ? G(tr(40, -40, 1, 50), rect(-40, -24, 80, 48, '#9aa3ad', 8, 5)) : rect(-50, -40, 100, 50, '#9aa3ad', 8, 5))) }, t) +
      G(tr(720, 1140), rect(-180, 0, 360, 40, '#b98552', 6, 5) + bigBoot(0, 0, .9)) + (hit ? impactStar(700, 1040, 1, '#fff3b0') : '') +
      kthin('elles sont', CX, 400, t, .05, { size: 58, fill: OL }) + kword('SUPER SOLIDES !', CX, 520, t, S - .1, { size: 92, fill: SX.acc }); },
  sfx: [[.1, 'whoosh', .4], [at(11, 'solides') - .02, 'hammer', .9], [at(11, 'solides'), 'crack', .7], [at(11, 'solides') + .3, 'boing', .5]] });
// B012 — « Oui maman. » : gros plan, sourire résigné, pouce levé
B(12, { enter: 'punch', cam: () => ({ z: 1.1 }),
  draw: (t, d, T) => entree(t) + WASH('rgba(255,255,255,.25)') + pvHead(CX, 900, 230, { expr: 'happy', face: { brows: 'sad' } }, t) + G(tr(CX + 270, 1110, 1, -10), rect(-50, -40, 100, 90, HEROC.skin, 30, 6) + rect(-22, -110, 44, 90, HEROC.skin, 22, 6)) + funTag(CX, 450, 'OUI MAMAN', t, .02, { size: 70, bg: '#fff', fg: OL }),
  sfx: [[.02, 'pop', .6], [.2, 'hmm', .4]] });
// B013a — survécu à trois générations : musée, vitrine, 3 portraits sépia avec LES MÊMES chaussures
const O13 = at(13, 'deux') - .15;
B(13, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const G3 = at(13, 'generations'); let s = museeT(t);
    for (let i = 0; i < 3; i++) { const x = 270 + i * 270, t0 = at(13, 'trois') + i * .15 - .3; const k = popEl(t, t0, .45); if (k <= 0) continue;
      s += G(tr(x, 560, k, (i - 1) * 3), rect(-115, -150, 230, 300, '#c9a020', 8, 7) + rect(-100, -135, 200, 270, '#f1dcb0', 0, 0) + head({ hr: 54, hair: ['bald', 'side', 'curly'][i], hairColor: '#5a4030', skin: '#c98a5e', mustache: i < 2, wrinkles: i < 2, cap: i === 0 ? '#5a4030' : undefined, expr: 'proud', seed: 40 + i }, t).replace(/^/, '<g transform="translate(0 -40)">') + '</g>' + bigBoot(0, 110, .38) + op(.3, rect(-100, -135, 200, 270, '#a8743a', 0, 0)) + ftext(0, 180, ['1950', '1985', '2024'][i], { size: 30, fill: OL, stroke: 'none' })); }
    s += G(tr(CX, 1040), rect(-170, 20, 340, 200, '#efe2c6', 6, 6) + bigBoot(-60, 10, .45) + bigBoot(60, 10, .45, 0, { flip: 1 }) + path('M-150 20L-150 -170L150 -170L150 20', 'rgba(200,235,255,.35)', 6) + line(-120, -140, -60, -60, 6, 'rgba(255,255,255,.8)'));
    return s + kword('3 GÉNÉRATIONS', CX, 340, t, G3 - .1, { size: 84, fill: SX.acc2 }) + pvHero({ x: 900, y: 1520, s: 1.1, expr: 'deadpan', flip: 1 }, t); },
  sfx: [[at(13, 'survecu'), 'angel', .4], [at(13, 'trois') - .3, 'pop', .5], [at(13, 'trois') - .15, 'pop', .5], [at(13, 'trois'), 'pop', .5], [at(13, 'generations') - .1, 'boom', .5]] });
// B013b — et deux guerres mondiales : les chaussures sur un podium, médailles et casque, explosions cartoon derrière, intactes
B(13, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.05, shake: 5 }),
  draw: (t, d, T) => paper('#efe0c0') + burst(220, 760, 200, t, .02, '#ffb36b', 12) + burst(880, 700, 230, t, .1, '#ffd23f', 12) + op(.7, cloud(300, 950, 1.6, '#d9cdb8') + cloud(820, 990, 1.8, '#d9cdb8')) +
    G(tr(CX, 1230), rect(-260, 0, 520, 60, '#c9a020', 10, 6) + rect(-200, -60, 400, 60, '#ffd23f', 8, 6) + ftext(0, -16, 'INVAINCUES', { size: 34, fill: '#7a4a2a', stroke: 'none' })) +
    G(tr(CX, 1170), bigBoot(-110, 0, .9) + bigBoot(110, 0, .9, 0, { flip: 1 }) + medal(-110, -200, .6) + medal(150, -210, .6) + path('M-60 -220Q-60 -320 60 -320Q160 -320 160 -220Z', '#6b7a4a', 7)) +
    stamp(250, 560, '1914', t, .05, '#7a2a3a', -12, 70) + stamp(830, 560, '1939', t, .25, '#7a2a3a', 10, 70) + kword('2 GUERRES', CX, 400, t, at(13, 'guerres') - O13 - .05, { size: 100, fill: SX.acc }) + kthin('mondiales', CX, 510, t, at(13, 'mondiales') - O13, { size: 60, fill: OL }),
  sfx: [[0, 'boom', .6], [.05, 'thud', .6], [.25, 'thud', .6], [at(13, 'guerres') - O13, 'flash_hit', .5], [at(13, 'mondiales') - O13 + .2, 'ding', .5]] }, O13);
// B014 — à 15 ans, tes potes veulent aller au restaurant : rue, les potes pointent l'enseigne BURGER
B(14, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => streetT(t, 2) + G(tr(760, 640), rect(-200, -70, 400, 140, '#2f3a35', 20, 7) + vNeon(0, 26, 'BURGER', '#ff5c8a', t, 70)) +
    pote(0, { x: 560, y: 1460, s: 1.2, expr: 'ecstatic', armR: [-70, -80] }, t) + pote(1, { x: 830, y: 1470, s: 1.2, expr: 'joy', armL: [210, 200], flip: 1 }, t) + pvHero({ x: 230, y: 1460, s: 1.3, expr: 'worried', look: [1, -.5] }, t) +
    funTag(260, 460, '15 ANS', t, at(14, '15') - .05, { size: 64, bg: SX.cool }) + markerArrow(560, 860, 680, 720, t, at(14, 'restaurant') - .1, { col: SX.acc }) + funTag(CX + 120, 420, 'RESTAURANT', t, at(14, 'restaurant') - .05, { size: 54, bg: SX.acc }),
  sfx: [[0, 'whoosh', .5], [at(14, '15') - .05, 'pop', .6], [at(14, 'veulent'), 'steps', .4], [at(14, 'restaurant') - .05, 'ding', .6]] });
// B015 — tu regardes la carte : resto, le héros caché derrière un menu géant, seuls les yeux dépassent
B(15, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d) }),
  draw: (t, d, T) => restoT(t) + pvHead(CX, 900, 150, { expr: 'suspicious', look: [0, .6] }, t) + G(tr(CX, 1120, 1, wave(t, 1.5, 1.5)), rect(-330, -150, 660, 420, '#fff8e0', 18, 7) + line(0, -150, 0, 270, 6) + ftext(-165, -70, 'MENU', { size: 50, fill: '#7a2a3a', stroke: 'none' }) + [0, 1, 2].map(i => line(-290, -10 + i * 50, -40, -10 + i * 50, 6, '#c9b89a') + line(40, -10 + i * 50, 290, -10 + i * 50, 6, '#c9b89a')).join('')) + restoTable(CX, 1290, 1, 900) +
    funTag(CX, 450, 'LA CARTE', t, at(15, 'carte') - .05, { size: 60, bg: SX.acc2, fg: OL }),
  sfx: [[0, 'whoosh', .5], [.1, 'flutter', .5], [at(15, 'carte') - .05, 'pop', .6]] });
// B016 — 18 € le burger : insert menu, burger doré auréolé, prix qui slam, les yeux du héros sortent des orbites
B(16, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), shake: t > at(16, 'euros') ? 4 : 0 }),
  draw: (t, d, T) => { const E = at(16, '18') - .05; return restoT(t) + WASH('rgba(30,20,10,.35)') + G(tr(CX, 900), rect(-360, -380, 720, 760, '#fff8e0', 24, 8)) + glow(CX, 860, 300, '#ffe9a0', .7) + rays(t, CX, 860, 'rgba(255,220,120,.35)', 'rgba(255,255,255,0)', 16) +
    burgerP(CX, 980, 1.5 + .05 * Math.sin(t * 6), t) + ell(CX, 680, 120, 26, 'none', 10, '#ffd23f') + sparkle(CX - 200, 780, .6, '#fff') + sparkle(CX + 220, 900, .5, '#ffd23f') +
    kword('18 €', CX, 560, t, E, { size: 170, fill: SX.acc }) + funTag(CX, 1150, 'LE BURGER', t, at(16, 'burger') - .05, { size: 54, bg: SX.acc2, fg: OL }) + pvHead(900, 430, 80, { expr: 'jawdrop', face: { eyes: 'huge' } }, t); },
  sfx: [[at(16, '18') - .05, 'boom', .7], [at(16, 'euros'), 'kaching', .6], [at(16, 'burger') - .05, 'angel', .5], [at(16, 'burger') + .3, 'gasp', .6]] });
// B017 — Kevin commande : à table, Kevin pointe tout le menu, le serveur note à toute vitesse
B(17, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => restoT(t) + kevin({ x: 330, y: 1440, s: 1.25, expr: 'smugger', armR: [-80, -90] }, t) + serveur({ x: 820, y: 1500, s: 1.05, expr: 'shock', flip: 1, armL: [200, 220], holdL: G(tr(0, -30), rect(-50, -60, 100, 120, '#fff', 8, 5) + [0, 1, 2].map(i => line(-36, -30 + i * 26, 36, -30 + i * 26, 4, '#9ab')).join('')) }, t) + restoTable(CX, 1290, 1, 900) + motionLines(900, 1000, 3, 50, 0) +
    funTag(330, 470, 'KEVIN', t, .05, { size: 56, bg: '#5fb85f' }) + kword('COMMANDE', CX, 600, t, at(17, 'commande') - .05, { size: 96, fill: SX.acc2 }),
  sfx: [[0, 'whoosh', .5], [.05, 'pop', .5], [at(17, 'commande') - .05, 'boom', .4], [at(17, 'commande') + .2, 'typing', .5]] });
// B018 — entrée, plat, dessert : trois assiettes atterrissent devant Kevin, une par mot
B(18, { enter: 'punch', cam: () => ({ z: 1.06, hand: .3 }),
  draw: (t, d, T) => { const e = [at(18, 'entr'), at(18, 'plat'), at(18, 'dessert')]; const land = (i, x, inner) => { const k = eOutBack(seg(t, e[i] - .1, e[i] + .2)); return k <= 0 ? '' : G(tr(x, lerp(400, 1210, k)), dishP(0, 0, .9, inner)); };
    return restoT(t) + kevin({ x: CX, y: 1440, s: 1.25, expr: 'ecstatic', armL: [200, 230], armR: [-20, -50] }, t) + restoTable(CX, 1290, 1, 900) + land(0, 220, saladP(0, -20, 1)) + land(1, CX, burgerP(0, -10, .8, t)) + land(2, 860, cakeP(0, -10, 1)) +
      funTag(220, 470, 'ENTRÉE', t, e[0], { size: 44, bg: '#7be07b', fg: OL }) + funTag(CX, 560, 'PLAT', t, e[1], { size: 50, bg: SX.acc }) + funTag(860, 470, 'DESSERT', t, e[2], { size: 44, bg: '#ff8fb1' }); },
  sfx: [[at(18, 'entr') - .02, 'thud', .5], [at(18, 'plat') - .02, 'thud', .6], [at(18, 'dessert') - .02, 'thud', .6], [at(18, 'dessert') + .15, 'chomp', .5]] });
// B019 — toi, tu prends de l'eau : projecteur sur un verre d'eau et un glaçon solitaire
B(19, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => restoT(t) + op(.45, rect(-M, -M, W + 2 * M, H + 2 * M, '#1a1020', 0, 0)) + op(.35, path('M440 -100L640 -100L900 1300L180 1300Z', '#fff6c8', 0)) + pvHero({ x: CX, y: 1440, s: 1.25, expr: 'happy', face: { brows: 'sad' } }, t) + restoTable(CX, 1290, 1, 900) + waterGlass(CX + 160, 1230, .9, .75, t) +
    funTag(CX, 470, "DE L'EAU", t, at(19, 'eau') - .1, { size: 60, bg: '#9fd6ff', fg: OL }),
  sfx: [[0, 'whoosh', .4], [.1, 'thud', .4], [at(19, 'eau') - .1, 'pop', .5], [at(19, 'eau') + .1, 'gulp', .4]] });
// B020 — « T'as pas faim ? » : Kevin bouche pleine, miettes
B(20, { enter: 'punch', cam: () => ({ z: 1.12 }),
  draw: (t, d, T) => restoT(t) + WASH('rgba(255,255,255,.2)') + kevinHead(CX, 880, 210, { expr: 'talk', look: [-1, 0] }, t) + Array.from({ length: 6 }, (_, i) => { const k = (t * 2 + i / 6) % 1; return circ(CX - 40 + (i - 3) * 30 - k * 120, 1000 + k * 200, 8, '#e8a050', 3); }).join('') + chatBubble(CX - 140, 470, 460, 110, "T'AS PAS FAIM ?", t, .02, false, 44),
  sfx: [[.02, 'pop', .6], [.1, 'chomp', .6], [at(20, 'faim'), 'hmm', .4]] });
// B021 — « Si, mais mon compte bancaire fait un jeûne intermittent » : CONCEPT, la carte bancaire médite devant une assiette vide
B(21, { enter: 'none', trans: 'glitch', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const C = at(21, 'compte'), J = at(21, 'jeune'); return paper(SX.paper) + gobo(T, .12) + blob(CX, 1020, 280, t, '#d6f5e2', 4) +
    (t > C ? G(tr(CX, 1240), rect(-300, -20, 600, 50, '#ff8fb1', 25, 6)) + G(tr(CX, 960, popEl(t, C, .5)), cardZen(0, 0, 1, t)) : '') +
    (t > C ? dishP(CX + 330, 1200, .8, '') + fork(CX + 220, 1160, .4, 90) : '') + calPage(220, 930, .8, 'JEÛNE', SX.acc, -8, String(Math.min(30, 3 + Math.floor(t * 8)))) +
    cutout(pvHead(250, 560, 100, { expr: 'starving' }, t), 8) + markerText('grrr…', 410, 690, t, .3, { size: 46, col: '#4d7cf0' }) + kthin('mon compte bancaire', CX + 100, 400, t, C - .05, { size: 54, fill: OL }) +
    kword('JEÛNE', CX + 150, 540, t, J - .05, { size: 120, fill: SX.acc }) + kthin('intermittent', CX + 150, 670, t, at(21, 'intermittent'), { size: 54, fill: OL }); },
  sfx: [[.05, 'zap', .3], [.3, 'growl', .6], [at(21, 'compte'), 'magic', .5], [at(21, 'jeune') - .05, 'boom', .5], [at(21, 'intermittent'), 'ding', .5]] });
// B022 — au moment de payer, Kevin annonce : le serveur pose l'addition, un ticket interminable qui roule jusqu'au sol
B(22, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const P = at(22, 'payer'); return restoT(t) + kevin({ x: 210, y: 1440, s: 1.2, expr: 'smug', armR: [-80, -100] }, t) + pvHero({ x: 480, y: 1440, s: 1.2, expr: 'worried' }, t) + restoTable(CX, 1290, 1, 900) +
    serveur({ x: 990, y: 1500, s: 1.05, expr: 'happy', flip: 1 }, t) + (t > P - .1 ? receipt(740, 760, 1, lerp(80, 760, eOutCubic(seg(t, P - .1, P + .6))), t, { r: -4 }) : '') + funTag(300, 470, 'KEVIN ANNONCE', t, at(22, 'annonce') - .1, { size: 44, bg: '#5fb85f' }) + kword('PAYER', CX, 360, t, P - .05, { size: 90, fill: SX.acc2 }); },
  sfx: [[.1, 'steps', .4], [at(22, 'payer') - .1, 'printer', .7], [at(22, 'payer') - .05, 'sting', .4], [at(22, 'annonce'), 'ding', .5]] });
// B023 — « On divise en parts égales ! » : Kevin découpe l'addition en 4 parts, ciseaux, extase
B(23, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 3 }),
  draw: (t, d, T) => { const D = at(23, 'divise'), k = eOutCubic(seg(t, D, D + .5)); let parts = ''; for (let i = 0; i < 4; i++) parts += G(tr(CX + (i - 1.5) * (110 + 120 * k), 700 + Math.sin(i * 2) * 40 * k, 1, (i - 1.5) * 10 * k), receipt(0, -170, .85, 300, t, { total: '24 €' }).replace('ADDITION', '1/4'));
    return restoT(t) + rays(t, CX, 900, 'rgba(255,233,140,.35)', 'rgba(255,255,255,0)', 18) + kevin({ x: 230, y: 1460, s: 1.25, expr: 'ecstatic', armR: [-60, -100], holdR: scissors(0, -20, .5, -60, .5 + .5 * Math.sin(t * 30)) }, t) + parts + (t > D ? markerText('24 € chacun', CX + 200, 900, t, D + .3, { size: 50, col: SX.acc }) : '') +
      kword('PARTS ÉGALES !', CX, 400, t, at(23, 'pas') - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[at(23, 'on'), 'snip', .7], [at(23, 'divise'), 'snip', .8], [at(23, 'divise') + .2, 'snip', .7], [at(23, 'pas') - .05, 'tada', .5]] });
// B024 — « Pardon ? » : crash zoom, yeux exorbités
B(24, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.05, 1.2, eOutCubic(clamp(t / .3))), shake: 6 }),
  draw: (t, d, T) => rays(t, CX, 900, '#ffd23f', '#ffb03a', 22) + pvHead(CX, 920, 260, { expr: 'jawdrop', face: { eyes: 'huge' } }, t) + kword('PARDON ?!', CX, 470, t, .0, { size: 130, fill: '#fff' }),
  sfx: [[0, 'flash_hit', .6], [.02, 'scratch', .6], [.1, 'gasp', .7]] });
// B025 — « J'ai bu de l'eau du robinet ! » : rage, il brandit le verre, robinet « 0 € »
B(25, { enter: 'punch', cam: () => ({ z: 1.06, shake: 4 }),
  draw: (t, d, T) => restoT(t) + pvHero({ x: 360, y: 1440, s: 1.25, expr: 'rage', armR: [-10, -20] }, t) + restoTable(CX, 1290, 1, 900) + waterGlass(570, 1230, .9, .15, t) + tapP(850, 1000, 1.1, t) + funTag(850, 760, '0 €', t, at(25, 'robinet') - .05, { size: 80, bg: SX.acc }) +
    kword('EAU DU ROBINET !', CX, 470, t, at(25, 'eau') - .05, { size: 68, fill: '#9fd6ff' }) + op(.8, G(tr(360, 900), path('M-60 -40Q-30 -80 0 -40M20 -60Q50 -100 80 -60', 'none', 8, '#fff'))),
  sfx: [[.05, 'growl', .5], [at(25, 'eau') - .05, 'boom', .5], [at(25, 'robinet'), 'spray', .5], [at(25, 'robinet') + .3, 'rimshot', .4]] });
// B026 — mais le pire, ce sont les invitations : chambre, le téléphone vibre, des enveloppes arrivent en rafale
B(26, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const I = at(26, 'invitations'); let env = ''; for (let i = 0; i < 6; i++) { const t0 = I - .2 + i * .1; if (t < t0) continue; const k = clamp((t - t0) / .5); env += G(tr(lerp(CX, 140 + (i % 3) * 400, eOutCubic(k)), lerp(1000, 640 + Math.floor(i / 3) * 260, eOutCubic(k)), .8, (i - 2.5) * 8), rect(-90, -60, 180, 120, '#fff', 10, 6) + path('M-90 -60L0 10L90 -60', 'none', 6) + heart(0, 24, .3, SX.acc)); }
    return heroRoom(t) + pvHero({ x: CX, y: 1460, s: 1.3, expr: 'shock', armR: [-30, -100], holdR: phone(0, -40, .5, Math.sin(t * 40) * 6, '') }, t) + env + kthin('mais le pire,', CX, 400, t, at(26, 'pire') - .1, { size: 58, fill: OL }) + kword('LES INVITATIONS', CX, 520, t, I - .05, { size: 84, fill: SX.acc }); },
  sfx: [[0, 'vibrate', .6], [at(26, 'pire'), 'sting', .5], [at(26, 'invitations') - .05, 'boom', .5], [at(26, 'invitations') + .1, 'pop_hi', .5], [at(26, 'invitations') + .3, 'pop_hi', .5]] });
// B027-29 — un anniversaire / un concert / un voyage : chaque carte pop avec son prix
const invBg = (t) => blur(8, heroRoom(t)) + WASH('rgba(255,255,255,.25)');
B(27, { enter: 'whip', cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => invBg(t) + invite('anniv', CX, 860, 1.2, t, .02, -4) + funTag(CX + 220, 1130, '- 30 €', t, at(27, 'anniversaire') + .1, { size: 60, bg: SX.acc }) + kword('ANNIVERSAIRE', CX, 460, t, at(27, 'anniversaire') - .05, { size: 84, fill: '#ff8fb1' }),
  sfx: [[.02, 'whoosh', .5], [at(27, 'anniversaire') - .05, 'pop', .6], [at(27, 'anniversaire') + .1, 'kaching', .5]] });
B(28, { enter: 'whip', cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => invBg(t) + invite('concert', CX, 860, 1.2, t, .02, 4) + funTag(CX - 200, 1110, '- 60 €', t, at(28, 'concert') + .1, { size: 60, bg: SX.acc }) + kword('CONCERT', CX, 460, t, at(28, 'concert') - .05, { size: 100, fill: '#b9a2ff' }),
  sfx: [[.02, 'whoosh', .5], [at(28, 'concert') - .05, 'drum', .6], [at(28, 'concert') + .1, 'kaching', .5]] });
B(29, { enter: 'whip', cam: () => ({ z: 1.06, shake: 2 }),
  draw: (t, d, T) => invBg(t) + invite('voyage', CX, 860, 1.2, t, .02, -3) + funTag(CX + 200, 1110, '- 400 €', t, at(29, 'voyage') + .1, { size: 64, bg: SX.acc }) + kword('VOYAGE', CX, 460, t, at(29, 'voyage') - .05, { size: 110, fill: '#5ec4f0' }),
  sfx: [[.02, 'whoosh', .5], [at(29, 'voyage') - .05, 'whoosh_up', .6], [at(29, 'voyage') + .1, 'jackpot', .4]] });
// B030 — tu aimerais venir. Vraiment. : fenêtre la nuit, bulle de pensée (les potes qui dansent), yeux de chiot sur VRAIMENT
B(30, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d) }),
  draw: (t, d, T) => { const V = at(30, 'vraiment'); return heroRoom(t, 1) + pvHero({ x: 330, y: 1460, s: 1.3, expr: t > V ? 'sob' : 'sad', look: [1, -1] }, t) +
    thought(720, 760, 520, 360, G('translate(-216 -470) scale(.4)', partyT(t * 1.3, { dancers: true })), t, at(30, 'aimerais') - .1) + (t > V ? heartsUp(t, 330, 1000, 3, 200) : '') + funTag(330, 470, 'VRAIMENT.', t, V - .05, { size: 56, bg: '#fff', fg: OL }); },
  sfx: [[.1, 'crickets', .3], [at(30, 'aimerais') - .1, 'magic', .4], [at(30, 'vraiment') - .05, 'pop', .5], [at(30, 'vraiment') + .1, 'heartbeat', .5]] });
// B031 — alors tu inventes des excuses : la machine à excuses (bandit manchot)
B(31, { enter: 'none', trans: 'wipe', transD: .2, cam: camHand(1.05, .4),
  draw: (t, d, T) => heroRoom(t) + WASH('rgba(255,255,255,.15)') + slotMachine(640, 930, 1, t, at(31, 'inventes') - .1, ['DODO', 'BOF', 'NON']) + pvHero({ x: 220, y: 1460, s: 1.25, expr: 'effort', armR: [-30, -60] }, t) +
    kword('EXCUSES', CX, 420, t, at(31, 'excuses') - .05, { size: 110, fill: SX.acc2 }),
  sfx: [[at(31, 'inventes') - .1, 'slot', .7], [at(31, 'excuses') - .05, 'jackpot', .5], [at(31, 'excuses') + .1, 'ding', .5]] });
// B032 — « J'aime pas trop les concerts » : gros plan, casque sur les oreilles, poster de concert derrière… le nez qui pousse
B(32, { enter: 'whip', cam: () => ({ z: 1.08 }),
  draw: (t, d, T) => { const L = 160 * eOutCubic(seg(t, at(32, 'concerts') - .1, at(32, 'concerts') + .4)); return heroRoom(t) + vPoster(260, 560, 260, 340, '#8a6ad8', -6, ftext(0, -40, '♫', { size: 120, fill: SX.acc2, stroke: 'none' }) + ftext(0, 100, 'ROCK', { size: 44, fill: '#fff', stroke: 'none' }), t) + heart(400, 400, .6) + heart(130, 380, .5) +
    pvHead(CX + 60, 900, 210, { expr: 'smug', look: [1, 0] }, t) + pinoNose(CX + 120, 940, 210, L) + path(`M${CX - 160} 870Q${CX + 60} 430 ${CX + 280} 870`, 'none', 22, '#3a3f4a') + rect(CX - 196, 820, 70, 120, '#e2463a', 30, 6) + rect(CX + 250, 820, 70, 120, '#e2463a', 30, 6) +
    chatBubble(CX, 450, 640, 110, "J'AIME PAS LES CONCERTS", t, .05, true, 40); },
  sfx: [[.05, 'pop', .6], [at(32, 'concerts') - .1, 'squeak', .7], [at(32, 'concerts') + .3, 'boing', .5]] });
// B033 — « J'ai quelque chose de prévu » : agenda complètement vide, virevoltant
B(33, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d) }),
  draw: (t, d, T) => { const days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']; let ag = rect(-400, -300, 800, 600, '#fff', 24, 7) + rect(-400, -300, 800, 90, '#4d7cf0', 24, 7) + ftext(0, -238, 'MON AGENDA', { size: 46, fill: '#fff' }); days.forEach((dd, i) => ag += ftext(-342 + i * 114, -170, dd, { size: 26, fill: OL, stroke: 'none' }) + line(-285 + i * 114, -200, -285 + i * 114, 280, 3, '#dde3ea'));
    return heroRoom(t) + WASH('rgba(255,255,255,.2)') + G(tr(CX, 860, .95, -2), ag) + tumbleweed(lerp(-100, 1180, t / d), 1000 - Math.abs(Math.sin(t * 6)) * 60, .8, t * 400) + stamp(CX, 900, 'VIDE', t, at(33, 'prevu') - .05, SX.acc, -10) +
      chatBubble(CX, 440, 640, 110, "J'AI UN TRUC DE PRÉVU", t, .05, true, 40); },
  sfx: [[.05, 'pop', .6], [.2, 'wind', .5], [at(33, 'prevu') - .05, 'thud', .6], [at(33, 'prevu') + .1, 'crickets', .4]] });
// B034 — « Je suis fatigué » : il le dit en faisant des jumping jacks, plein d'énergie
B(34, { enter: 'punch', cam: () => ({ z: 1.05, shake: 2 }),
  draw: (t, d, T) => { const up = Math.sin(t * 18) > 0; return heroRoom(t) + pvHero({ x: CX, y: 1500 - (up ? 40 : 0), s: 1.3, expr: 'ecstatic', armL: up ? [210, 230] : [110, 100], armR: up ? [-30, -50] : [70, 80] }, t) + motionLines(CX - 260, 1000, 3, 60, 90) + motionLines(CX + 260, 1000, 3, 60, 90) +
    chatBubble(CX, 440, 520, 110, 'JE SUIS FATIGUÉ', t, .02, true, 44) + markerText('(non)', 850, 700, t, at(34, 'fatigue') + .1, { size: 60, col: SX.acc }); },
  sfx: [[.02, 'pop', .6], [.1, 'boing', .4], [.35, 'boing', .4], [at(34, 'fatigue') + .1, 'scratch', .5]] });
// B035 — un jour, tes amis organisent des vacances : rue, voiture chargée à bloc qui part, le héros fait coucou sur le trottoir
B(35, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const V = at(35, 'vacances'), cx = 640 + Math.max(0, t - V) * 700; return streetT(t, 2) + G(tr(cx, 1380), vCar(0, 0, 1.3, '#ff9a4d') + rect(-200, -300, 360, 60, '#5b8fd8', 10, 5) + rect(-140, -360, 240, 60, '#ffd23f', 10, 5) + path('M-230 -380L190 -420L200 -400L-220 -360Z', '#5ec4f0', 5)) +
    [0, 1, 2].map(i => poteHead(i, cx - 110 + i * 85, 1120, 46, { expr: 'ecstatic' }, t)).join('') + pvHero({ x: 200, y: 1460, s: 1.3, expr: 'happy', face: { brows: 'sad' }, armR: [-60, -110] }, t) + (t > V ? motionLines(cx - 300, 1250, 4, 90, 0) : '') +
    kthin('tes amis organisent', CX, 400, t, at(35, 'amis'), { size: 56, fill: OL }) + kword('DES VACANCES', CX, 520, t, V - .05, { size: 68, fill: '#5ec4f0' }); },
  sfx: [[0, 'whoosh', .5], [at(35, 'jour'), 'pop', .4], [at(35, 'vacances') - .05, 'whoosh_up', .6], [at(35, 'vacances') + .2, 'tada', .4]] });
// B036 — tu regardes les photos qu'ils publient : chambre la nuit, l'écran éclaire le visage, fil de photos de plage
B(36, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d) }),
  draw: (t, d, T) => { const scroll = (t * 220) % 330; const feed = clipR(-150, -295, 300, 590, [0, 1, 2].map(i => G(tr(0, -170 + i * 330 - scroll, .68), beachPic(t)) + heart(-100, -170 + i * 330 - scroll + 130, .3, '#ff5d73')).join(''), 24);
    return heroRoom(t, 1) + glow(330, 900, 360, '#9fd6ff', .45) + pvHero({ x: 330, y: 1460, s: 1.3, expr: 'neutral', look: [1, 0] }, t) + phoneBig(780, 860, 1.05, 6, feed) + funTag(780, 400, 'LES PHOTOS', t, at(36, 'photos') - .05, { size: 54, bg: SX.cool }); },
  sfx: [[.05, 'whoosh', .4], [at(36, 'regardes'), 'tick', .4], [at(36, 'photos') - .05, 'pop', .5], [at(36, 'publient'), 'shutter', .5]] });
// B037 — tout le monde sourit : trois polaroids, sourires XXL
B(37, { enter: 'punch', cam: () => ({ z: 1.05 }),
  draw: (t, d, T) => heroRoom(t, 1) + WASH('rgba(20,20,60,.35)') + polaroid(260, 820, 1.25, -8, G(tr(0, -10, .45), beachPic(t)), t, .02) + polaroid(CX + 10, 760, 1.35, 3, G(tr(0, -10, .45), beachPic(t + 1)), t, .12) + polaroid(820, 860, 1.25, 9, G(tr(0, -10, .45), beachPic(t + 2)), t, .22) +
    kword('TOUT LE MONDE SOURIT', CX, 440, t, at(37, 'sourit') - .1, { size: 64, fill: SX.acc2 }),
  sfx: [[.02, 'shutter', .5], [.12, 'shutter', .5], [.22, 'shutter', .5], [at(37, 'sourit') - .1, 'sparkle', .5]] });
// B038 — tu es content pour eux : sourire sincère avec une petite larme, pouce levé, likes qui montent
B(38, { enter: 'whip', cam: () => ({ z: 1.08 }),
  draw: (t, d, T) => heroRoom(t, 1) + glow(CX, 900, 400, '#9fd6ff', .35) + pvHead(CX, 880, 220, { expr: 'happy' }, t) + G(tr(CX + 110, 900 + ((t * 120) % 80)), path('M0 -20Q14 0 0 14Q-14 0 0 -20Z', '#9fd6ff', 4)) + G(tr(CX - 290, 1100, 1, 10), rect(-50, -40, 100, 90, HEROC.skin, 30, 6) + rect(-22, -110, 44, 90, HEROC.skin, 22, 6)) + heartsUp(t, CX + 280, 1080, 5, 500) +
    funTag(CX, 450, 'CONTENT POUR EUX', t, at(38, 'content') - .1, { size: 50, bg: SX.acc }),
  sfx: [[.05, 'pop', .5], [at(38, 'content') - .1, 'ding', .5], [at(38, 'eux'), 'kiss', .3]] });
// B039 — mais tu aurais aimé être sur la photo : la photo de groupe avec un trou en pointillés… et le héros s'y colle en autocollant (débloqué)
B(39, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const P = at(39, 'etre') - .1, k = popEl(t, P, .5); return paper(SX.paper) + gobo(T, .12) +
    G(tr(CX, 900, 1.9, -3), rect(-220, -180, 440, 420, '#fff', 10, 6) + clipR(-200, -160, 400, 320, beachPic(t, { gap: 1 }), 4)) + funBox(CX + 95 * 1.9 * .99, 900 + 60 * 1.9, 220, 240, t, at(39, 'aurais'), { label: 'toi.png', col: SX.acc }) +
    unlock(CX + 95, 1014, t, P, { part: 'back', r: 380 }) + (k > 0 ? G(tr(CX + 95, 1014, k), cutout(pvHead(0, 0, 84, { expr: 'ecstatic' }, t), 8)) : '') + unlock(CX + 95, 1014, t, P, { part: 'front', r: 380 }) +
    kthin('tu aurais aimé être', CX, 380, t, at(39, 'aurais') - .05, { size: 56 }) + kword('SUR LA PHOTO', CX, 500, t, at(39, 'photo') - .1, { size: 76, fill: SX.acc }); },
  sfx: [[at(39, 'mais'), 'whoosh', .4], [at(39, 'aurais'), 'scratch', .4], [at(39, 'etre') - .1, 'magic', .6], [at(39, 'photo') - .1, 'sparkle', .6]] });
// B040 — et là, Kevin t'envoie : Kevin sur la plage, lunettes de soleil, selfie, message qui part
B(40, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const E = at(40, 'envoie'), k = clamp((t - E) / .5); return SKY(t, '#7fd3ff', '#fff4dc') + rect(-M, 980, W + 2 * M, 200, '#4d9fd8', 0, 0) + path(`M-${M} 990Q300 ${970 + wave(t, 1, 10)} 540 990T${W + M} 990`, 'none', 8, '#fff') + rect(-M, 1150, W + 2 * M, 1000, '#f4dca0', 0, 0) + G(tr(940, 1250), rect(-8, -500, 16, 500, '#fff', 4, 4) + path('M-180 -480Q0 -620 180 -480Z', '#ff5c8a', 6)) + vPot(100, 1260, 1.2, t, 2, '#c8955a') +
    kevin({ x: CX, y: 1460, s: 1.3, expr: 'shadesGrin', armR: [-20, -60], holdR: phone(0, -40, .5, 0, '') }, t) +
    (k > 0 && k < 1 ? G(tr(lerp(CX + 160, 1200, k), lerp(820, 300, k), 1, -20), path('M-50 0L50 -30L20 30Z', '#fff', 5)) : '') + funTag(CX, 450, 'KEVIN', t, at(40, 'kevin') - .05, { size: 60, bg: '#5fb85f' }); },
  sfx: [[0, 'waves', .5], [at(40, 'kevin') - .05, 'pop', .5], [at(40, 'envoie'), 'whoosh', .6], [at(40, 'envoie') + .3, 'vibrate', .5]] });
// B041a — « Frère, fallait venir ! » : le message s'affiche, Kevin extatique en photo
B(41, { enter: 'punch', cam: () => ({ z: 1.06 }),
  draw: (t, d, T) => { const scr = rect(-150, -295, 300, 70, '#5fb85f', 24, 0) + ftext(0, -248, 'KEVIN', { size: 30, fill: '#fff', stroke: 'none' }) + G(tr(0, -110, .62), beachPic(t)) + chatBubble(0, 120, 270, 120, 'FRÈRE,\nFALLAIT VENIR', t, at(41, 'frere'), false, 34);
    return heroRoom(t, 1) + WASH('rgba(20,20,60,.3)') + phoneBig(CX, 880, 1.15, -3, scr) + kword('FALLAIT VENIR !', CX, 420, t, at(41, 'fallait') - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[.02, 'vibrate', .6], [at(41, 'frere'), 'pop', .6], [at(41, 'fallait') - .05, 'boom', .4], [at(41, 'venir') + .2, 'rimshot', .3]] });
// B042 — « Ah oui, Kevin, j'avais juste oublié d'être riche. » : la nuit, le héros répond au téléphone, pince-sans-rire ; il tape sa réponse
B(42, { enter: 'none', trans: 'black', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d) }),
  draw: (t, d, T) => { const K = at(42, 'kevin'), Ri = at(42, 'riche') - .05, scr = rect(-150, -295, 300, 70, '#5fb85f', 24, 0) + ftext(0, -248, 'KEVIN', { size: 30, fill: '#fff', stroke: 'none' }) + chatBubble(-20, -140, 250, 110, 'FRÈRE,\nFALLAIT VENIR', t, 0, false, 30) + chatBubble(20, 40, 260, 150, "AH OUI\nJ'AVAIS OUBLIÉ\nD'ÊTRE RICHE", t, at(42, 'avais'), true, 28);
    return heroRoom(t, 1) + WASH('rgba(20,20,60,.25)') + glow(330, 900, 320, '#9fd6ff', .4) + pvHero({ x: 300, y: 1460, s: 1.3, expr: t > Ri ? 'smug' : 'deadpan', look: [1, 0] }, t) + phoneBig(790, 900, 1.0, 5, scr) +
      funTag(300, 650, 'AH OUI, KEVIN', t, K - .05, { size: 46, bg: '#5fb85f' }) + kthin("j'avais juste", CX, 380, t, at(42, 'juste') - .1, { size: 54 }) + kword("OUBLIÉ D'ÊTRE RICHE", CX, 470 + 0, t, at(42, 'oublie') - .05, { size: 60, fill: SX.acc2 }) + (t > Ri ? popStars(300, 900, t, Ri) : ''); },
  sfx: [[.05, 'hmm', .4], [at(42, 'kevin') - .05, 'pop', .5], [at(42, 'avais'), 'typing', .5], [at(42, 'oublie') - .05, 'boom', .4], [at(42, 'riche'), 'rimshot', .5]] });
// B043 — le pire, ce n'est pas de manquer une soirée : la porte se referme sur la fête, « SOIRÉE » barré
B(43, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const S = at(43, 'soiree'), o = 1 - eInOut(seg(t, S - .4, S + .15)); return entree(t, { open: o, friends: true, night: true }) + pvHero({ x: 860, y: 1460, s: 1.25, expr: 'sad', armR: [-60, -110], flip: 1 }, t) +
    kthin("le pire, ce n'est pas de manquer", CX, 380, t, at(43, 'pire') - .05, { size: 46 }) + kword('UNE SOIRÉE', CX, 500, t, S - .05, { size: 72, fill: '#fff' }) + cross(CX, 480, 1.2, t, S + .1); },
  sfx: [[.1, 'hmm', .3], [at(43, 'soiree') - .05, 'pop', .5], [at(43, 'soiree') + .1, 'thud', .7], [at(43, 'soiree') + .12, 'error_beep', .4]] });
// B044a — c'est de devoir constamment choisir : carrefour au parc, deux panneaux ARGENT / SOUVENIRS, la tête tourne
const O44 = at(44, 'entre') - .15;
B(44, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), r: Math.sin(t * 5) * 2 }),
  draw: (t, d, T) => parkA(t) + G(tr(270, 1250, 1, -6), vSign(0, 0, 'ARGENT', '#36a85a', 1.2)) + G(tr(810, 1250, 1, 6), vSign(0, 0, 'SOUVENIRS', '#ff5c8a', 1.2)) + pvHero({ x: CX, y: 1460, s: 1.3, expr: 'dizzy', look: [Math.sin(t * 6), 0] }, t) +
    kthin('constamment', CX, 400, t, at(44, 'constamment') - .05, { size: 58, fill: OL }) + kword('CHOISIR', CX, 520, t, at(44, 'choisir') - .05, { size: 120, fill: SX.acc2 }),
  sfx: [[0, 'whoosh', .5], [at(44, 'constamment'), 'clock_fast', .4], [at(44, 'choisir') - .05, 'boom', .5], [at(44, 'choisir') + .2, 'boing', .4]] });
// B044b — FIN : la balance argent / souvenirs, elle penche vers les souvenirs (débloqué) ; dernier gag : la tirelire pleure
B(44, { enter: 'none', trans: 'wipe', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const A = at(44, 'argent') - O44, S = at(44, 'souvenirs') - O44, ang = t < S ? Math.sin(t * 4) * 12 : lerp(-12, 16, eOutBack(seg(t, S, S + .6)));
    const left = piggy(0, -60, .7, 0) + (t > S + .6 ? G(tr(60, -70 + ((t * 80) % 40)), path('M0 -10Q8 0 0 8Q-8 0 0 -10Z', '#9fd6ff', 3)) : ''); const right = polaroid(-50, -90, .55, -8, G(tr(0, -10, .45), beachPic(t, { hero: 1 })), t, 0) + polaroid(60, -100, .55, 8, G(tr(0, -10, .45), beachPic(t + 1, { hero: 1 })), t, 0);
    return gridBg(SX.ink) + halftoneFade(SX.acc, .08, 1) + unlock(CX, 900, t, S, { part: 'back', r: 460 }) + balance(CX, 860, 1.05, ang, left, right) + unlock(CX, 900, t, S, { part: 'front', r: 460 }) +
      kthin('entre', CX, 330, t, A - .3, { size: 50 }) + kword('TON ARGENT', CX, 420, t, A - .05, { size: 78, fill: '#7be07b' }) + kword('ET LES SOUVENIRS', CX, 540, t, S - .05, { size: 76, fill: SX.acc2 }); },
  sfx: [[.05, 'whoosh', .4], [at(44, 'argent') - O44 - .05, 'coins', .6], [at(44, 'souvenirs') - O44 - .05, 'boom', .5], [at(44, 'souvenirs') - O44 + .1, 'sparkle', .6], [at(44, 'creer') - O44, 'angel', .5]] }, O44);

SCENES.sort((a, b) => a.s - b.s);
