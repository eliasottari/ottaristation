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
