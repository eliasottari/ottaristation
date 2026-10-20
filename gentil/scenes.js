// ============================================================
//  « Pourquoi c'est horrible d'être le mec trop gentil ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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

// ---------- aides (template) ----------
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

// ============================================================
//  SIZEX fun : accent turquoise « âme angélique », jaune marqueur (auréole), rose
// ============================================================
sxFun('#14b8c4'); SX.acc2 = '#ffd23f'; SX.cool = '#ff8fb1';
const M = 700;
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
// figurants (utilisés par les décors copiés : kidsBg, streetT, galleryT)
const KH = ['curly', 'bun', 'spiky', 'ponytail', 'short', 'long'], KC = ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040', '#1f1a18', '#6b3e26'], KS = ['#ff8fb1', '#7aa6d8', '#7be07b', '#ff9a4d', '#b56cff', '#5ec4f0'], SK = ['#f2c9a0', '#c98a5e', '#f6d7b8', '#8a5a3a', '#e0b088', '#f2c9a0'];
const kid = (i, o, t) => person(Object.assign({ age: 'kid', hair: KH[i % 6], hairColor: KC[i % 6], shirt: KS[i % 6], skin: SK[i % 6], pants: '#3b3f4a', seed: 20 + i }, o), t);
const AH = ['side', 'bun', 'bald', 'long', 'short'], AC = ['#1f1a18', '#8a5a3a', '#7a6a5a', '#c4521b', '#d9d9de'], AS = ['#5b8fd8', '#e2463a', '#36a85a', '#ff9a4d', '#8a6ad8'];
const adult = (i, o, t) => person(Object.assign({ age: 'adult', hair: AH[i % 5], hairColor: AC[i % 5], shirt: AS[i % 5], skin: SK[(i + 2) % 6], pants: '#2f3b4e', seed: 60 + i, glasses: i % 3 === 0 }, o), t);

// ---------- décors : bibliothèque d'accessoires (reprise de tache/, préfixe d) ----------
const DPAL = ['#e2463a', '#5b8fd8', '#ffd23f', '#36a85a', '#ff8fb1', '#8a6ad8', '#ff9a4d', '#5ec4f0'];
const dHaze = (k = .35, col = '230,240,250', y1 = 1300) => rect(-M, -M, W + 2 * M, y1 + M, `rgba(${col},${k})`, 0, 0);
function dWall(kind, c1, c2, yb = 1250) { let s = rect(-M, -M, W + 2 * M, yb + M, c1, 0, 0);
  if (kind === 'stripe') for (let x = -M; x < W + M; x += 120) s += rect(x, -M, 48, yb + M, c2, 0, 0);
  if (kind === 'dot') for (let y = -40; y < yb; y += 90) for (let x = -M + ((y / 90) % 2 ? 45 : 0); x < W + M; x += 90) s += circ(x, y, 7, c2, 0);
  if (kind === 'diamond') for (let y = 0; y < yb; y += 110) for (let x = -M + ((y / 110) % 2 ? 55 : 0); x < W + M; x += 110) s += path(`M${x} ${y - 14}L${x + 10} ${y}L${x} ${y + 14}L${x - 10} ${y}Z`, c2, 0);
  if (kind === 'star') for (let y = 30; y < yb; y += 140) for (let x = -M + ((y / 140) % 2 ? 70 : 0); x < W + M; x += 140) s += ftext(x, y, '✦', { size: 26, fill: c2, stroke: 'none' });
  return s; }
const dBase = (yb, col = '#fff', h = 34) => rect(-M, yb - h, W + 2 * M, h, col, 0, 0) + line(-M, yb - h, W + M, yb - h, 5, shade(col, -.25));
function dParquet(yb, c) { let s = rect(-M, yb, W + 2 * M, 1500, c, 0, 0); const ys = [0, 28, 64, 112, 176, 260, 370, 510, 690]; ys.forEach((dy, i) => { s += line(-M, yb + dy, W + M, yb + dy, 4, shade(c, -.2)); const nx = ys[i + 1]; if (nx !== undefined) for (let x = -M + (i % 2) * 110; x < W + M; x += 220) s += line(x, yb + dy, x, yb + nx, 4, shade(c, -.2)); }); return s + line(-M, yb, W + M, yb, 8, shade(c, -.35)); }
function dTileFloor(yb, c1, c2) { let s = rect(-M, yb, W + 2 * M, 1500, c1, 0, 0); const ys = [0, 40, 95, 170, 270, 400, 570, 800]; for (let i = 0; i < ys.length - 1; i++) { const h = ys[i + 1] - ys[i], w = h * 1.6; for (let k = 0, x = -M; x < W + M; x += w, k++) if ((k + i) % 2) s += rect(x, yb + ys[i], w, h, c2, 0, 0); } return s + line(-M, yb, W + M, yb, 7, shade(c1, -.3)); }
const dOutlet = (x, y) => rect(x - 22, y - 30, 44, 60, '#f4f1ea', 8, 4) + circ(x - 8, y, 4, OL, 0) + circ(x + 8, y, 4, OL, 0);
const dSwitch = (x, y) => rect(x - 24, y - 34, 48, 68, '#f4f1ea', 8, 4) + rect(x - 9, y - 16, 18, 32, '#dcd6cc', 4, 3);
function dPic(kind, w, h) { const a = -w / 2 + 12, b = -h / 2 + 12, iw = w - 24, ih = h - 24;
  if (kind === 'mount') return rect(a, b, iw, ih, '#cfe8f5', 0, 0) + path(`M${a} ${b + ih}L${a + iw * .35} ${b + ih * .35}L${a + iw * .6} ${b + ih * .7}L${a + iw * .75} ${b + ih * .5}L${a + iw} ${b + ih}Z`, '#7bbf5a', 3) + circ(a + iw * .78, b + ih * .25, ih * .12, '#ffd23f', 3);
  if (kind === 'heart') return rect(a, b, iw, ih, '#ffe1ee', 0, 0) + heart(0, 4, Math.min(iw, ih) / 120, '#ff5d73');
  if (kind === 'face') return rect(a, b, iw, ih, '#fff1c8', 0, 0) + circ(0, ih * .08, ih * .28, '#f2c9a0', 3) + path(`M${-ih * .28} ${-ih * .02}Q0 ${-ih * .38} ${ih * .28} ${-ih * .02}`, '#6b3e26', 3) + path(`M${-ih * .1} ${ih * .18}Q0 ${ih * .25} ${ih * .1} ${ih * .18}`, 'none', 3);
  if (kind === 'sea') return rect(a, b, iw, ih, '#bfe3ff', 0, 0) + rect(a, b + ih * .55, iw, ih * .45, '#4d9fd8', 0, 0) + path(`M${a + iw * .3} ${b + ih * .55}L${a + iw * .45} ${b + ih * .2}L${a + iw * .5} ${b + ih * .55}Z`, '#fff', 3);
  return rect(a, b, iw, ih, '#e1f5d6', 0, 0) + circ(0, 0, ih * .25, '#ff9a4d', 3); }
const dFrame = (x, y, w, h, kind = 'mount', col = '#c38a52', r = 0) => G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, col, 6, 6) + dPic(kind, w, h) + rect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 'none', 2, 3));
function dPoster(x, y, w, h, bg, r, inner = '', t = 0) { const fl = Math.sin(t * 2.4 + x) * 3; return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, bg, 6, 5) + inner + path(`M${w / 2 - 34} ${h / 2}L${w / 2} ${h / 2 - 34 + fl}L${w / 2} ${h / 2}Z`, shade(bg, -.2), 3) + rect(-18, -h / 2 - 10, 36, 18, 'rgba(255,255,255,.75)', 3, 0)); }
function dBooks(x, y, w, seed = 1) { const r = rng(seed); let s = '', cx = x; while (cx < x + w - 20) { const bw = 18 + r() * 14, bh = 56 + r() * 34, c = DPAL[Math.floor(r() * 8)]; if (r() < .12 && cx + bh < x + w) { s += rect(cx, y - bw, bh, bw, c, 3, 4); cx += bh + 4; continue; } s += rect(cx, y - bh, bw, bh, c, 3, 4) + line(cx + 4, y - bh + 12, cx + bw - 4, y - bh + 12, 3, 'rgba(255,255,255,.6)'); cx += bw + 2; } return s; }
const dShelf = (x, y, w, items = '', col = '#b5835a') => items + rect(x, y, w, 18, col, 4, 5) + path(`M${x + 24} ${y + 18}L${x + 24} ${y + 50}L${x + 56} ${y + 18}`, 'none', 5) + path(`M${x + w - 24} ${y + 18}L${x + w - 24} ${y + 50}L${x + w - 56} ${y + 18}`, 'none', 5);
const dJar = (x, y, c = '#ffd23f', s = 1) => G(tr(x, y, s), rect(-24, -64, 48, 64, 'rgba(220,240,255,.85)', 10, 4) + rect(-20, -40, 40, 36, c, 6, 0) + rect(-26, -76, 52, 16, '#c96a3a', 5, 4));
const dTrophy = (x, y, s = 1) => G(tr(x, y, s), rect(-30, -16, 60, 16, '#6b3e26', 3, 4) + rect(-8, -46, 16, 30, '#e8b923', 0, 4) + path('M-34 -96L34 -96Q34 -46 0 -46Q-34 -46 -34 -96Z', '#ffd23f', 4) + path('M-34 -88Q-56 -84 -46 -64M34 -88Q56 -84 46 -64', 'none', 4) + ftext(0, -64, '1', { size: 22, fill: '#a0703f', stroke: 'none' }));
const dTeddy = (x, y, s = 1, c = '#c9935c') => G(tr(x, y, s), ell(0, -38, 40, 40, c, 5) + circ(-30, -96, 13, c, 5) + circ(30, -96, 13, c, 5) + circ(0, -82, 30, c, 5) + ell(0, -74, 12, 9, '#f1d2a8', 0) + circ(-10, -88, 4, OL, 0) + circ(10, -88, 4, OL, 0) + circ(0, -77, 4, OL, 0) + ell(-28, -8, 16, 11, c, 4) + ell(28, -8, 16, 11, c, 4));
function dPot(x, y, s, t, kind = 0, potC = '#d9825b') { const sw = wave(t, .5, 4, x * .01); let lv = '';
  if (kind === 0) for (let i = 0; i < 5; i++) lv += G(tr(0, -60, 1, -60 + i * 30 + sw), ell(0, -55, 18, 55, ['#5fb85f', '#4fa64f', '#6cc46c'][i % 3], 4));
  else if (kind === 1) lv += G(tr(0, -60, 1, sw), rect(-18, -150, 36, 150, '#5aa76a', 18, 4) + rect(-58, -110, 26, 70, '#5aa76a', 13, 4) + rect(32, -126, 26, 60, '#5aa76a', 13, 4));
  else for (let i = 0; i < 7; i++) lv += G(tr(0, -60, 1, -75 + i * 25 + sw), path('M0 0Q-16 -60 0 -120Q16 -60 0 0Z', '#4fa64f', 3));
  return G(tr(x, y, s), lv + path('M-46 -62L46 -62L36 0L-36 0Z', potC, 5) + rect(-52, -74, 104, 18, shade(potC, -.15), 5, 5)); }
function dCurtain(x, y, w, h, col, t, side = 1) { let d = `M${x} ${y}L${x + w} ${y}`; const n = 5; for (let i = 0; i <= n; i++) { const yy = y + h * i / n; d = d; } const sw = wave(t, .5, 14, x * .01);
  const xb = x + (side > 0 ? w * .7 + sw : w * .3 + sw), dd = side > 0 ? `M${x} ${y}L${x + w} ${y}Q${x + w * .55} ${y + h * .5} ${xb} ${y + h}L${x - 6} ${y + h}Z` : `M${x} ${y}L${x + w} ${y}L${x + w + 6} ${y + h}L${xb} ${y + h}Q${x + w * .45} ${y + h * .5} ${x} ${y}Z`;
  let s = path(dd, col, 6); for (let i = 1; i < 4; i++) s += path(`M${x + w * i / 4} ${y + 10}Q${x + w * i / 4 + sw * .4} ${y + h * .5} ${x + w * i / 4 + (side > 0 ? -1 : 1) * w * .12} ${y + h - 10}`, 'none', 4, shade(col, -.25)); return s + rect(x - 20, y - 14, w + 40, 18, '#8a5a3a', 8, 4); }
function dWindowView(x, y, w, h, t, o = {}) { const night = o.night; let s = grad(night ? '#0f163a' : '#9fd6ff', night ? '#2a3170' : '#e6f6ff', x, y, w, h);
  s += night ? circ(x + w * .72, y + h * .22, 34, '#fff6d6', 0) : cloud(x + ((t * 20) % (w + 160)) - 80, y + h * .25, .45, '#fff');
  for (let i = 0; i < 5; i++) { const bx = x + i * w / 5, bh = h * (.25 + ((i * 37) % 30) / 100); s += rect(bx, y + h - bh, w / 5 + 2, bh, night ? '#1a2048' : '#b9cfe0', 0, 0); for (let j = 0; j < 3; j++) s += rect(bx + 14, y + h - bh + 16 + j * 34, 14, 16, night ? (Math.sin(t * .7 + i * 3 + j) > -.3 ? '#ffe08a' : '#2e3570') : '#e6f2fb', 2, 0); }
  if (!night) s += circ(x + w * .2, y + h - 30, 46, '#6cc46c', 0) + circ(x + w * .3, y + h - 50, 40, '#5fb85f', 0);
  return s + rect(x, y, w, h, 'none', 8, 10, '#fff') + rect(x - 6, y - 6, w + 12, h + 12, 'none', 10, 6) + line(x + w / 2, y, x + w / 2, y + h, 8, '#fff') + line(x, y + h / 2, x + w, y + h / 2, 8, '#fff') + rect(x - 24, y + h, w + 48, 20, '#f4f1ea', 4, 5); }
const dRug = (x, y, w, h, c1, c2) => ell(x, y, w / 2, h / 2, c1, 6) + ell(x, y, w * .38, h * .36, 'none', 6, c2) + ell(x, y, w * .22, h * .2, c2, 0);
const dBin = (x, y, s = 1, c = '#7aa6d8') => G(tr(x, y, s), path('M-46 -110L46 -110L36 0L-36 0Z', c, 5) + line(-20, -90, -16, -14, 4, shade(c, -.25)) + line(20, -90, 16, -14, 4, shade(c, -.25)) + path('M-30 -110Q-10 -136 6 -112Q20 -130 34 -110', '#fff', 4));
const dBag = (x, y, s = 1, c = '#e2463a', r = 0) => G(tr(x, y, s, r), rect(-60, -130, 120, 130, c, 26, 5) + rect(-40, -60, 80, 46, shade(c, -.15), 12, 4) + path('M-30 -130Q0 -176 30 -130', 'none', 8) + circ(0, -80, 6, '#ffd23f', 3));
const dShoes = (x, y, s = 1, c = '#5b8fd8') => G(tr(x, y, s), path('M-80 0L-80 -34Q-60 -46 -40 -30L-6 -20Q4 -10 0 0Z', c, 5) + path('M10 0L10 -34Q30 -46 50 -30L84 -20Q94 -10 90 0Z', c, 5) + line(-82, -3, 0, -3, 6, '#fff') + line(8, -3, 92, -3, 6, '#fff'));
const dBall = (x, y, s = 1, t = 0, c = '#e2463a') => G(tr(x, y - 40 * s, s, t * 40), circ(0, 0, 40, c, 5) + path('M-40 0Q0 -20 40 0M0 -40Q-20 0 0 40', 'none', 5, '#fff'));
const dBox = (x, y, s = 1, str = '') => G(tr(x, y, s), rect(-80, -110, 160, 110, '#d9a86c', 4, 5) + path('M-80 -110L-100 -140L-20 -140L0 -110M80 -110L100 -140L20 -140L0 -110', '#c8955a', 4) + rect(-14, -110, 28, 40, '#e8c690', 0, 0) + (str ? ftext(0, -30, str, { size: 22, fill: '#7a5a3a', stroke: 'none' }) : ''));
const dGift = (x, y, s = 1, c = '#5ec4f0', c2 = '#ffd23f') => G(tr(x, y, s), rect(-60, -100, 120, 100, c, 6, 5) + rect(-12, -100, 24, 100, c2, 0, 0) + rect(-60, -100, 120, 100, 'none', 6, 5) + path('M0 -100Q-40 -150 -30 -104M0 -100Q40 -150 30 -104', 'none', 7, c2));
function dLamp(x, y, s = 1, on = 1, t = 0, c = '#ffd23f') { return G(tr(x, y, s), (on ? op(.25 + .05 * Math.sin(t * 3), circ(0, -300, 140, '#fff6c8', 0)) : '') + rect(-40, -10, 80, 14, '#5a4a3a', 6, 4) + line(0, -10, 0, -260, 8) + path('M-60 -250L60 -250L36 -350L-36 -350Z', c, 5)); }
const dDeskLamp = (x, y, s = 1, t = 0) => G(tr(x, y, s), op(.3 + .05 * Math.sin(t * 4), path('M40 -150L-60 0L160 0Z', '#fff6c8', 0)) + ell(0, -6, 40, 10, '#5b8fd8', 4) + line(0, -10, -20, -100, 8) + line(-20, -100, 40, -150, 8) + path('M20 -170L80 -140L60 -110L4 -134Z', '#5b8fd8', 5));
const dMug = (x, y, s = 1, t = 0, c = '#ff8fb1') => G(tr(x, y, s), rect(-26, -54, 52, 54, c, 8, 4) + path('M26 -42Q46 -36 26 -14', 'none', 5) + op(.6, path(`M-6 -64Q${-14 + wave(t, 1, 6)} -84 -4 -104M10 -64Q${2 + wave(t, 1, 6, .5)} -86 12 -108`, 'none', 4, '#fff')));
const dGlobe = (x, y, s = 1, t = 0) => G(tr(x, y, s), rect(-40, -10, 80, 14, '#6b3e26', 5, 4) + line(0, -10, 0, -40, 6) + circ(0, -110, 66, '#5ec4f0', 5) + G(`translate(${f1(((t * 30) % 120) - 60)} -110)`, ell(0, -14, 26, 18, '#7be07b', 0) + ell(30, 22, 16, 12, '#7be07b', 0)) + circ(0, -110, 66, 'none', 5) + path('M-74 -110A74 74 0 0 1 0 -184', 'none', 6, '#8a5a3a'));
function dBird(x, y, s, t, ph = 0) { const f = Math.sin(t * 10 + ph) * 14; return G(tr(x, y, s), path(`M-30 ${f1(-f)}Q-14 -6 0 4Q14 -6 30 ${f1(-f)}`, 'none', 6)); }
const dBirds = (t, n = 3, y = 300, seed = 1) => { let s = ''; for (let i = 0; i < n; i++) s += dBird(((t * (50 + i * 12) + i * 420 + seed * 200) % 1700) - 300, y + i * 46 + Math.sin(t * 2 + i) * 14, .7 - i * .1, t, i * 2); return s; };
function dSkyline(yb, col, seed = 3, win = 'rgba(255,255,255,.35)') { const r = rng(seed); let s = '', x = -M; while (x < W + M) { const w = 120 + r() * 140, h = 280 + r() * 380; s += rect(x, yb - h, w, h, col, 0, 0); if (r() < .4) s += rect(x + w * .4, yb - h - 50, 10, 50, col, 0, 0); for (let j = yb - h + 40; j < yb - 40; j += 70) for (let i = x + 18; i < x + w - 30; i += 46) s += rect(i, j, 20, 28, win, 2, 0); x += w + 6; } return s; }
// immeuble détaillé : corniche, fenêtres (rideaux / plantes / lumière), balcons, rez-de-chaussée commerçant (store rayé + enseigne)
function dBuilding(x, yb, w, h, c, seed, t, o = {}) { const r = rng(seed); let s = rect(x, yb - h, w, h, c, 4, 6) + rect(x - 10, yb - h - 18, w + 20, 26, shade(c, -.18), 4, 5);
  const cols = Math.max(1, Math.floor(w / 95)), cw = (w - 30) / cols, top = yb - h + 40, shopH = o.shop === false ? 0 : 190;
  for (let j = top; j < yb - shopH - 90; j += 120) for (let i = 0; i < cols; i++) { const wx = x + 15 + i * cw + 10, ww = cw - 20, lit = o.night ? Math.sin(t * .6 + i * 2.1 + j * .07) > -.2 : r() < .2;
    s += rect(wx, j, ww, 74, lit ? '#ffe08a' : '#cfe8ff', 4, 4); const k = r(); if (k < .3) s += path(`M${wx + 3} ${j + 3}L${wx + ww * .35} ${j + 3}Q${wx + ww * .2} ${j + 40} ${wx + 6} ${j + 70}Z`, DPAL[(seed + i) % 8], 0); else if (k < .45) s += rect(wx - 6, j + 66, ww + 12, 14, '#8a5a3a', 3, 3) + circ(wx + ww * .3, j + 62, 12, '#5fb85f', 3) + circ(wx + ww * .65, j + 60, 14, '#ff8fb1', 3); else s += line(wx + ww / 2, j, wx + ww / 2, j + 74, 4);
    if (r() < .18) s += rect(wx - 10, j + 74, ww + 20, 10, '#7d848c', 2, 4) + Array.from({ length: 4 }, (_, q) => line(wx - 6 + q * (ww + 12) / 3, j + 84, wx - 6 + q * (ww + 12) / 3, j + 116, 4)).join('') + line(wx - 10, j + 116, wx + ww + 10, j + 116, 5); }
  if (shopH) { const ac = o.awn || DPAL[seed % 8]; s += rect(x + 14, yb - 160, w - 28, 160, '#cfe8ff', 4, 5) + rect(x + w * .62, yb - 150, w * .22, 150, shade(c, -.3), 4, 5);
    for (let i = 0; i < 6; i++) s += path(`M${x + i * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 160}Q${x + (i + .5) * w / 6} ${yb - 140} ${x + i * w / 6} ${yb - 160}Z`, i % 2 ? '#fff' : ac, 4);
    if (o.sign) s += rect(x + w / 2 - o.sign.length * 11 - 16, yb - 250, o.sign.length * 22 + 32, 44, '#fff8e0', 8, 4) + ftext(x + w / 2, yb - 218, o.sign, { size: 26, fill: ac, stroke: 'none' }); }
  return s; }
const dLampPost = (x, yb, s = 1, on = 0) => G(tr(x, yb, s), (on ? op(.35, circ(0, -470, 70, '#fff6c8', 0)) : '') + rect(-22, -20, 44, 20, '#3a4250', 4, 4) + rect(-8, -440, 16, 420, '#3a4250', 4, 4) + path('M0 -440Q0 -480 50 -480', 'none', 10, '#3a4250') + path('M30 -486L90 -486L80 -456L40 -456Z', '#ffe08a', 4));
const dBench = (x, yb, s = 1) => G(tr(x, yb, s), rect(-120, -110, 240, 22, '#b5835a', 5, 4) + rect(-120, -80, 240, 22, '#b5835a', 5, 4) + rect(-130, -44, 260, 20, '#c8955a', 5, 4) + line(-100, -24, -100, 0, 8) + line(100, -24, 100, 0, 8) + line(-100, -110, -100, -44, 6) + line(100, -110, 100, -44, 6));
const dBike = (x, yb, s = 1, c = '#36a85a') => G(tr(x, yb - 50 * s, s), circ(-70, 0, 48, 'none', 7) + circ(70, 0, 48, 'none', 7) + path('M-70 0L-20 -70L50 -70L70 0M-20 -70L0 0L50 -70M0 0L-70 0', 'none', 7, c) + line(-30, -90, -6, -90, 8) + path('M50 -70L44 -96L66 -100', 'none', 7));
function dCar(x, yb, s = 1, c = '#ff6b6b', flip = 0) { return G(`translate(${f1(x)} ${f1(yb)}) scale(${flip ? -s : s} ${s})`, path('M-200 -40L-200 -100Q-190 -120 -150 -124L-100 -190Q-80 -200 40 -200Q90 -196 120 -124L190 -114Q210 -104 210 -70L210 -40Z', c, 6) + path('M-84 -130L-56 -180L10 -180L10 -130Z', '#cfe8ff', 4) + path('M30 -130L30 -180L80 -180L106 -130Z', '#cfe8ff', 4) + circ(-110, -36, 42, '#3a4250', 6) + circ(-110, -36, 16, '#c8ced6', 4) + circ(120, -36, 42, '#3a4250', 6) + circ(120, -36, 16, '#c8ced6', 4) + rect(186, -98, 22, 16, '#ffe08a', 4, 3)); }
const dBush = (x, yb, s = 1, c = '#5fb85f') => G(tr(x, yb, s), circ(-60, -40, 50, shade(c, -.1), 5) + circ(50, -44, 54, shade(c, -.05), 5) + circ(0, -70, 64, c, 5) + rect(-110, -12, 220, 12, c, 0, 0));
function dFlowers(x, yb, n = 5, seed = 2, t = 0) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const fx = x + i * 34 + r() * 10, h = 40 + r() * 30, sw = wave(t, .6, 4, i); s += line(fx, yb, fx + sw, yb - h, 5, '#4fa64f') + circ(fx + sw, yb - h, 14, DPAL[Math.floor(r() * 8)], 4) + circ(fx + sw, yb - h, 5, '#ffd23f', 0); } return s; }
const dPine = (x, yb, s = 1, t = 0) => G(tr(x, yb, s, wave(t, .3, 1.5, x)), rect(-16, -60, 32, 60, '#8a5a3a', 6, 5) + path('M-90 -60L0 -200L90 -60Z', '#3f9a5a', 5) + path('M-74 -150L0 -280L74 -150Z', '#4fa66a', 5) + path('M-56 -240L0 -350L56 -240Z', '#5fb87a', 5));
const dFence = (x0, x1, yb, c = '#fff') => { let s = rect(x0, yb - 90, x1 - x0, 14, c, 3, 4) + rect(x0, yb - 46, x1 - x0, 14, c, 3, 4); for (let x = x0; x < x1; x += 46) s += path(`M${x} ${yb}L${x} ${yb - 110}L${x + 14} ${yb - 128}L${x + 28} ${yb - 110}L${x + 28} ${yb}Z`, c, 4); return s; };
const dSign = (x, yb, str, c = '#5b8fd8', s = 1) => G(tr(x, yb, s), rect(-8, -300, 16, 300, '#8a8f99', 4, 4) + rect(-110, -380, 220, 90, c, 12, 5) + ftext(0, -322, str, { size: 34, fill: '#fff', stroke: 'none' }));
const dBalloon = (x, y, c, t, ph = 0, s = 1) => { const bx = x + wave(t, .5, 10, ph), by = y + wave(t, .7, 12, ph + 1); return path(`M${f1(bx)} ${f1(by + 70 * s)}Q${f1(bx + 20)} ${f1(by + 160 * s)} ${f1(bx - 6)} ${f1(by + 260 * s)}`, 'none', 3) + G(tr(bx, by, s), ell(0, 0, 52, 64, c, 5) + path('M-8 62L8 62L0 74Z', c, 4) + ell(-18, -24, 10, 16, 'rgba(255,255,255,.6)', 0)); };
const dSpeaker = (x, yb, s = 1, t = 0) => { const p = 1 + .08 * Math.max(0, Math.sin(t * 13)); return G(tr(x, yb, s), rect(-90, -340, 180, 340, '#241830', 14, 6) + circ(0, -240, 52 * p, '#3a2a4a', 5) + circ(0, -240, 18, '#5ec4f0', 4) + circ(0, -100, 66 * p, '#3a2a4a', 5) + circ(0, -100, 22, '#ff5c8a', 4)); };
const dNeon = (x, y, str, c, t, size = 54) => { const on = Math.sin(t * 7) > -.6 || Math.sin(t * 23) > .2; return op(on ? 1 : .35, ftext(x, y, str, { size, fill: 'none', stroke: c, sw: 6 }) + (on ? op(.35, glow(x, y - size * .3, size * 1.6, c, .5)) : '')); };
const dStreamers = (t, y = -20, n = 9) => { let s = ''; for (let i = 0; i < n; i++) { const x = -40 + i * 140, l = 120 + (i * 53) % 90; s += path(`M${x} ${y}Q${x + 20 + wave(t, .9, 12, i)} ${y + l * .5} ${x + wave(t, .9, 18, i + 1)} ${y + l}`, 'none', 10, DPAL[i % 8]); } return s; };
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + circ(930, 150, 60, '#fff3b0', 0) + op(.35, circ(930, 150, 100, '#fff3b0', 0)) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff') + cloud(((t * 12 + 1200) % 1800) - 300, 120, .7, 'rgba(255,255,255,.85)') + dBirds(t, 3, 280);
function tree(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c') + circ(-40, -380, 14, '#e2463a', 4) + circ(60, -300, 14, '#e2463a', 4) + circ(-80, -240, 12, '#e2463a', 4)); }
function kidsBg(t, y = 1150, n = 4, s = .45) { let r = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; r += kid(i + 1, { x, y, s, expr: 'happy', walk: 3, flip: i % 2 }, t); } return r; }
function streetT(t, n = 3) { const yb = 1250; let s = SKY(t, '#9fd6ff', '#fff1dc') + op(.85, dSkyline(1000, '#bccde0', 5)) + dHaze(.2);
  const signs = ['CAFÉ', '', 'BOULANGERIE', '', 'PHARMACIE', 'FLEURS', '', 'CINÉ'];
  for (let i = -2; i < 6; i++) s += dBuilding(-200 + i * 300, yb, 280, 540 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4], i + 10, t, { sign: signs[(i + 8) % 8], awn: DPAL[(i + 8) % 8] });
  s += dHaze(.16, '255,250,240', 1250);
  s += rect(-M, yb, W + 2 * M, 1400, '#c8ccd2', 0, 0) + [0, 1, 2].map(i => line(-M, yb + 20 + i * 26, W + M, yb + 20 + i * 26, 3, '#b0b5bc')).join('') + rect(-M, yb + 90, W + 2 * M, 20, '#8f959d', 0, 0) + rect(-M, yb + 110, W + 2 * M, 1400, '#6e747c', 0, 0) + Array.from({ length: 10 }, (_, i) => rect(-M + i * 300 - ((t * 0) % 300), yb + 300, 160, 18, '#fff', 4, 0)).join('') + line(-M, yb, W + M, yb, 8, '#7d848c');
  s += dLampPost(70, yb, 1) + dLampPost(830, yb, 1) + tree(470, yb, .62, t) + dBench(640, yb, .7) + dBin(950, yb, .6, '#36a85a') + dBike(260, yb + 10, .6, '#ff5c8a') + dSign(1050, yb, 'RUE', '#5b8fd8', .8) + dFlowers(900, yb, 4, 5, t) + dCar(-60, yb + 250, .9, '#5ec4f0') + dCar(1000, yb + 260, .9, '#ffd23f', 1);
  for (let i = 0; i < n; i++) { const x = ((i * 520 + t * (70 + i * 20) * (i % 2 ? -1 : 1)) % 1700 + 1700) % 1700 - 300; s += op(.8, adult(i + 2, { x, y: 1270, s: .5, expr: 'neutral', walk: 3, flip: i % 2 }, t)); }
  return s; }
const WASH = (c = 'rgba(255,255,255,.14)') => rect(-M, -M, W + 2 * M, H + 2 * M, c, 0, 0); // voile léger : décor moins saturé derrière les persos
function sofa(x, yb, s = 1, c = '#5ec4a0') { return G(tr(x, yb, s), rect(-330, -260, 660, 180, shade(c, -.12), 44, 6) + rect(-290, -235, 160, 115, '#ffd23f', 34, 5) + rect(-70, -225, 150, 105, '#fff', 34, 5) + rect(130, -232, 150, 112, '#e86a8a', 34, 5) + rect(-290, -125, 580, 95, c, 22, 6) + rect(-385, -160, 105, 160, c, 32, 6) + rect(280, -160, 105, 160, c, 32, 6) + rect(-340, -30, 34, 30, '#6b3e26', 4, 4) + rect(306, -30, 34, 30, '#6b3e26', 4, 4) + G(tr(-200, -150, 1, -10), rect(-60, -10, 120, 18, '#5b8fd8', 6, 4))); }
function schoolBuilding(x, yb, w, h, t) { let s = path(`M${x - 30} ${yb - h}L${x + w / 2} ${yb - h - 130}L${x + w + 30} ${yb - h}Z`, '#d9534f', 6) + rect(x, yb - h, w, h, '#f0d9b5', 4, 6);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) { if (j === 2 && (i === 1 || i === 2)) continue; const wx = x + 40 + i * (w - 60) / 4, wy = yb - h + 50 + j * 150; s += rect(wx, wy, (w - 60) / 4 - 30, 90, '#cfe8ff', 4, 5) + circ(wx + 20, wy + 60, 12, DPAL[(i + j) % 8], 0) + path(`M${wx + 40} ${wy + 70}L${wx + 52} ${wy + 46}L${wx + 64} ${wy + 70}`, DPAL[(i + j + 3) % 8], 0) + line(wx, wy + 45, wx + (w - 60) / 4 - 30, wy + 45, 4); }
  s += rect(x + w / 2 - 80, yb - 200, 160, 200, '#3e7cc0', 8, 6) + line(x + w / 2, yb - 200, x + w / 2, yb, 5) + rect(x + w / 2 - 130, yb - 270, 260, 56, '#fff8e0', 10, 5) + ftext(x + w / 2, yb - 230, 'ÉCOLE', { size: 36, fill: '#d9534f', stroke: 'none' }) + wallClock(x + w / 2, yb - h - 50, 40, t);
  const fx = x + w - 40, fy = yb - h - 160; s += line(fx, yb - h, fx, fy, 6) + path(`M${fx} ${fy}Q${fx + 40} ${fy - 10 + wave(t, 2, 8)} ${fx + 80} ${fy + wave(t, 2, 10, .5)}L${fx + 80} ${fy + 50 + wave(t, 2, 10, .5)}Q${fx + 40} ${fy + 40 + wave(t, 2, 8)} ${fx} ${fy + 50}Z`, '#5b8fd8', 4);
  return s; }
function schoolyard(t) { const yb = 1180;
  return SKY(t) + op(.8, dSkyline(1120, '#c3d6e4', 3)) + circ(-20, 1080, 90, '#9ccf8a', 0) + circ(1020, 1060, 110, '#9ccf8a', 0) + dHaze(.15) +
    schoolBuilding(-120, yb, 640, 560, t) + dBuilding(560, yb, 700, 470, '#e8c9a0', 4, t, { shop: false }) + dFence(-M, W + M, yb, '#fff') +
    rect(-M, yb, W + 2 * M, 1500, '#c9b8a0', 0, 0) + line(-M, yb, W + M, yb, 7, '#a8987f') +
    [0, 1, 2, 3, 4].map(i => rect(CX - 60 + (i % 2) * 0, 1300 + i * 70, 120, 64, 'none', 4, 5, '#fff')).join('') + ftext(CX, 1660, '★', { size: 60, fill: '#fff', stroke: 'none' }) +
    G(tr(40, yb), rect(-8, -480, 16, 480, '#7d848c', 4, 4) + rect(-90, -520, 120, 80, '#fff', 6, 5) + circ(-40, -436, 30, 'none', 5, '#e2463a')) +
    dBench(260, 1230, .8) + dBush(700, 1200, .8) + dFlowers(780, 1225, 6, 3, t) + tree(950, 1200, .9, t) + dPine(1060, 1200, .7, t) + dBin(470, 1225, .6, '#36a85a') + dBall(620, 1290, .7, t) + dBag(160, 1290, .6, '#ff8fb1', -8) +
    kidsBg(t, 1230, 3); }
function classroomT(t, inner = '') { const yb = 1250;
  let s = dWall('stripe', '#fff1d6', '#ffe8c2', yb) + rect(-M, 960, W + 2 * M, yb - 960, '#d9b88c', 0, 0) + line(-M, 960, W + M, 960, 6, '#b8956a') + dBase(yb, '#a0784e');
  for (let i = 0; i < 8; i++) { const x = 100 + i * 105, y = 160 + Math.sin(i * .7) * 10 + wave(t, .8, 3, i); s += G(tr(x, y, 1, wave(t, .8, 5, i)), rect(-34, -40, 68, 70, DPAL[i % 8], 6, 4) + ftext(0, 14, 'ABCDEFGH'[i], { size: 36, fill: '#fff', stroke: 'none' })); }
  s += path('M40 120Q470 160 900 120', 'none', 4) + rect(60, 250, 960, 560, '#8a6a4a', 18) + rect(80, 270, 920, 520, '#456b55', 10, 0) + op(.15, path('M120 300Q400 340 700 300M150 700Q500 650 900 720', 'none', 12, '#fff')) + inner + rect(120, 790, 840, 18, '#8a6a4a', 6, 4) + rect(180, 774, 50, 18, '#fff', 4, 3) + rect(260, 776, 70, 16, '#ff8fb1', 4, 3) + rect(780, 770, 90, 22, '#3a3a3a', 4, 3);
  s += wallClock(960, 170, 60, t) + windowFrame(-200, 300, 220, 420) + dCurtain(-60, 290, 90, 450, '#ff8fb1', t, -1);
  s += dShelf(-20, 1000, 200, dBooks(-10, 1000, 180, 4)) + dPoster(1040, 600, 90, 300, '#7aa6d8', 4, ftext(0, 0, '1+1', { size: 34, fill: '#fff', stroke: 'none' }), t) + dOutlet(1010, 1170) + dSwitch(40, 900);
  for (let i = 0; i < 4; i++) s += circ(380 + i * 110, 880, 9, '#7d848c', 3) + (i % 2 ? dBag(380 + i * 110, 1010, .5, DPAL[i + 1]) : '');
  return s + dParquet(yb, '#c49a6c') + dBin(1010, 1300, .7) + dPot(60, 1290, .9, t, 1) + dRug(CX, 1520, 700, 140, '#7aa6d8', '#ffd23f'); }
function hallway(t) { const yb = 1250; let s = dWall('diamond', '#d6ecf7', '#c4e0ef', yb) + rect(-M, 600, W + 2 * M, 20, '#9fc6dc', 0, 0);
  for (let i = 0; i < 4; i++) { const x = 40 + i * 290, fl = i === 2 && Math.sin(t * 17) > .3; s += rect(x, 40, 200, 26, fl ? '#9aa8b5' : '#fffbe6', 12, 5) + (fl ? '' : op(.18, path(`M${x} 66L${x + 200} 66L${x + 260} 300L${x - 60} 300Z`, '#fffbe6', 0))); }
  s += rect(70, 300, 400, 260, '#c8955a', 10, 6) + rect(86, 316, 368, 228, '#e8c690', 4, 0) + [[130, 350, '#fff', -4], [250, 340, '#ffe066', 3], [360, 360, '#ff8fb1', -2], [160, 450, '#7be07b', 5], [300, 440, '#fff', -6]].map(([x, y, c, r]) => G(tr(x + 40, y + 40, 1, r + wave(t, 1.3, 1.5, x)), rect(-44, -44, 88, 80, c, 3, 3) + line(-30, -20, 30, -20, 3, '#9aa') + line(-30, 0, 20, 0, 3, '#9aa') + circ(0, -40, 7, '#e2463a', 3))).join('');
  s += dPoster(600, 420, 150, 200, '#ff9a4d', 3, ftext(0, -30, 'CANTINE', { size: 26, fill: '#fff', stroke: 'none' }) + circ(0, 30, 40, '#fff', 4) + ell(0, 30, 24, 10, '#e2463a', 0), t) + dPoster(800, 420, 140, 200, '#36a85a', -3, ftext(0, -40, 'CHUT !', { size: 30, fill: '#fff', stroke: 'none' }) + circ(0, 30, 36, '#f2c9a0', 4) + line(0, 0, 0, 56, 8, '#f2c9a0'), t) + rect(940, 300, 150, 60, '#2fa84f', 8, 5) + ftext(1015, 342, 'SORTIE', { size: 30, fill: '#fff', stroke: 'none' }) + wallClock(1000, 470, 46, t);
  for (let i = -2; i < 12; i++) { const x = i * 130 - 60; s += rect(x, 640, 124, 610, ['#ff8fb1', '#5ec4f0', '#ffd23f', '#7be07b'][(i + 4) % 4], 8) + rect(x + 20, 690, 84, 16, 'rgba(0,0,0,.25)', 4, 0) + rect(x + 20, 720, 84, 16, 'rgba(0,0,0,.25)', 4, 0) + circ(x + 100, 960, 9, '#fff', 3) + rect(x + 44, 760, 36, 26, '#fff', 4, 3) + ftext(x + 62, 780, `${12 + i}`, { size: 18, fill: OL, stroke: 'none' }) + (i % 3 === 0 ? G(tr(x + 60, 860, 1, -10), circ(0, 0, 22, DPAL[(i + 9) % 8], 3) + ftext(0, 8, '★', { size: 22, fill: '#fff', stroke: 'none' })) : ''); }
  return s + extinguisher(1060, 1100, .5) + dTileFloor(yb, '#e3d5bb', '#d4c3a3') + op(.25, rect(-M, yb + 6, W + 2 * M, 30, '#fff', 0, 0)) + dBag(120, 1330, .7, '#5b8fd8', -10) + dBall(980, 1320, .7, t, '#ff9a4d') + dShoes(300, 1360, .6, '#e2463a'); }
function bedroomN(t, lamp = 0) { const yb = 1250; let s = dWall('star', '#1d2350', '#2e3a80', yb) + rect(-M, 900, W + 2 * M, yb - 900, '#262c5e', 0, 0) + line(-M, 900, W + M, 900, 5, '#3a4290');
  s += dWindowView(620, 230, 360, 420, t, { night: true }); for (let i = 0; i < 6; i++) s += sparkle(650 + (i * 67) % 300, 270 + (i * 113) % 200, .18 + .1 * Math.sin(t * 3 + i), '#fff6d6');
  s += dCurtain(560, 210, 110, 480, '#5a3a8a', t, 1) + dCurtain(930, 210, 110, 480, '#5a3a8a', t, -1);
  s += rect(90, 300, 230, 300, '#ff8fb1', 10) + ftext(205, 470, '★', { size: 120, fill: '#fff', stroke: 'none' }) + dFrame(400, 380, 120, 150, 'sea', '#8a6ad8', 3) + dShelf(60, 720, 420, dBooks(80, 720, 180, 7) + dTrophy(310, 720, .9) + dTeddy(410, 720, .7));
  s += G(tr(820, 1260), rect(-260, -260, 40, 300, '#6b4a8a', 10, 6) + rect(-240, -90, 520, 110, '#8a6ad8', 16, 6) + path('M-220 -100Q20 -150 270 -100L280 0L-220 0Z', '#5ec4f0', 6) + path('M-200 -70Q0 -100 260 -70', 'none', 4, '#3a9ac0') + ell(-160, -130, 70, 34, '#fff', 5) + dTeddy(-40, -110, .6, '#ff9a4d'));
  s += G(tr(470, 1250), rect(-70, -150, 140, 150, '#6b4a8a', 8, 5) + line(-60, -75, 60, -75, 4) + rect(-50, -200, 100, 50, '#141a3a', 8, 4) + ftext(0, -164, Math.sin(t * 6) > 0 ? '02:47' : '02 47', { size: 26, fill: '#ff5c8a', stroke: 'none' }) + op(.25, circ(0, -176, 70, '#ff5c8a', 0)));
  s += dOutlet(70, 1100) + dSwitch(1040, 960);
  return s + rect(-M, yb, W + 2 * M, 1400, '#3a3050', 0, 0) + line(-M, yb, W + M, yb, 6, '#2a2240') + dRug(330, 1420, 520, 120, '#5a3a8a', '#ff8fb1') + dShoes(180, 1330, .55, '#ff8fb1') + dBall(940, 1360, .5, 0, '#ffc83d'); }
function discoBall(x, y, s, t) { let g = circ(0, 0, 90, '#c9d3dc', 7); for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) { if (i * i + j * j > 10) continue; const lit = Math.sin(t * 6 + i * 1.7 + j * 2.3) > .4; g += rect(i * 24 - 10, j * 24 - 10, 20, 20, lit ? '#fff' : '#9aa8b5', 3, 0); } return G(tr(x, y, s), line(0, -400, 0, -90, 6) + g); }
function partyT(t, o = {}) { let s = grad('#3a1a5c', '#170b2a', -M, -M, W + 2 * M, H + 2 * M) + dWall('dot', 'rgba(0,0,0,0)', 'rgba(255,255,255,.05)', 1300); const cols = ['#ff5c8a', '#5ec4f0', '#ffd23f', '#7be07b'];
  s += dWindowView(-120, 640, 220, 300, t, { night: true }) + dWindowView(980, 640, 220, 300, t, { night: true }) + dNeon(940, 1010, 'PARTY', '#ff5c8a', t, 48);
  for (let i = 0; i < 4; i++) { const a = Math.sin(t * .9 + i * 1.6) * 30; s += op(.16, G(tr(150 + i * 260, -50, 1, a), path('M-30 0L30 0L260 1500L-260 1500Z', cols[i], 0))); }
  s += dStreamers(t, -20, 9);
  let gd = 'M-60 300'; for (let i = 0; i < 12; i++) gd += `Q${-60 + i * 110 + 55} ${360} ${-60 + (i + 1) * 110} 300`; s += path(gd, 'none', 5, '#2b2420');
  for (let i = 0; i < 12; i++) s += circ(-5 + i * 110, 338, 14, Math.sin(t * 5 + i * 1.3) > 0 ? cols[i % 4] : '#4a3a5a', 4);
  s += discoBall(CX, 160, .9, t) + dBalloon(70, 520, '#ff5c8a', t, 0, .8) + dBalloon(150, 590, '#ffd23f', t, 1, .7) + dBalloon(960, 540, '#5ec4f0', t, 2, .8) + dBalloon(1030, 610, '#7be07b', t, 3, .7);
  s += G(tr(820, 1300), rect(-150, -150, 300, 24, '#ff9a4d', 6, 5) + line(-130, -126, -130, 0, 8) + line(130, -126, 130, 0, 8) + [-100, -40, 30, 90].map((x, i) => i % 2 ? rect(x - 14, -196, 28, 46, '#e2463a', 4, 4) : ell(x, -164, 36, 14, '#ffd23f', 4)).join(''));
  s += dSpeaker(40, 1310, .9, t) + dSpeaker(1040, 1310, .9, t);
  if (o.dancers !== false) for (let i = 0; i < 5; i++) { const x = 60 + i * 240 + (o.part || 0) * (i < 2 ? -260 : i > 2 ? 260 : 0); s += op(.75, person({ age: 'adult', x, y: 1330 + (i % 2) * 40, s: .62, skin: '#4a2f5e', shirt: '#2e1a46', pants: '#1c1030', hair: KH[i], hairColor: '#1c1030', face: { eyes: 'closed', mouth: 'grin' }, armL: [200 + wave(t, 1.2, 40, i * .2), 250], armR: [-20 - wave(t, 1.2, 40, i * .2 + .5), -70], bob: 3, seed: 80 + i }, t * 1.6)); }
  s += rect(-M, 1300, W + 2 * M, 900, '#1c0f2e', 0, 0); for (let i = 0; i < 8; i++) s += rect(-80 + i * 160, 1320, 150, 70, Math.sin(t * 4 + i * 2) > 0 ? 'rgba(255,92,138,.35)' : 'rgba(94,196,240,.25)', 6, 0);
  for (let i = 0; i < 14; i++) s += rect((i * 97) % 1080, 1420 + (i * 53) % 300, 16, 26, DPAL[i % 8], 3, 0);
  return s; }
function salonF(t, o = {}) { const yb = 1250, n = o.night;
  let s = dWall('diamond', n ? '#3a3a6a' : '#fde7c8', n ? '#4a4a80' : '#f6d3a8', yb) + rect(-M, 930, W + 2 * M, yb - 930, n ? '#33335e' : '#eccb9c', 0, 0) + line(-M, 930, W + M, 930, 8, n ? '#2a2a50' : '#c9a473') + dBase(yb, '#fff');
  s += dFrame(110, 330, 150, 180, 'face', '#c38a52', -3) + dFrame(290, 300, 130, 160, 'face', '#8a5a3a', 2) + dFrame(120, 560, 130, 150, 'face', '#ff9a4d', 3) + dFrame(290, 530, 140, 170, 'face', '#5b8fd8', -2) + dFrame(420, 430, 54, 64, 'mount', '#9aa3ad', 6);
  s += wallClock(560, 200, 56, t, o.clock || 1) + dShelf(440, 690, 250, dBooks(455, 690, 110, 5) + dTrophy(600, 690, .7) + dTrophy(650, 690, .55)) + dOutlet(80, 1180) + dSwitch(1020, 880);
  s += dWindowView(720, 300, 280, 360, t, { night: n }) + dCurtain(660, 280, 100, 450, '#e86a8a', t, 1) + dCurtain(960, 280, 100, 450, '#e86a8a', t, -1) + dPot(760, 690, .45, t, 2, '#5b8fd8') + dPot(965, 690, .4, t, 1);
  if (!o.noSofa) s += sofa(CX - 40, 1290, .95, '#5ec4a0');
  s += n ? op(.3, rect(-M, -M, W + 2 * M, yb + M, '#141838', 0, 0)) : WASH();
  s += dParquet(yb, n ? '#5a4a4a' : '#c49a6c') + dRug(CX, 1470, 820, 170, '#e86a8a', '#ffd23f') + dLamp(1020, 1290, 1, 1, t, '#ffd23f') + dPot(70, 1290, 1, t, 0);
  s += dBall(250, 1580, .6, t * .3, '#5b8fd8') + dShoes(820, 1660, .7, '#e2463a') + dTeddy(960, 1620, .7) + dBox(140, 1780, .8, 'JOUETS');
  return s; }
const hangLamp = (x, y, t, k = 1) => { const sw = wave(t, .6, 8); return G(tr(x, 0, 1, sw), line(0, -M, 0, y, 6) + op(.28 * k, path(`M-50 ${y + 40}L50 ${y + 40}L380 ${y + 1200}L-380 ${y + 1200}Z`, '#fff6b0', 0)) + path(`M-90 ${y + 50}L90 ${y + 50}L40 ${y - 20}L-40 ${y - 20}Z`, '#3a3f4a', 6) + circ(0, y + 52, 22, '#fff6b0', 4)); };
function restoT(t, o = {}) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#b85a44', 0, 0);
  for (let y = -60, j = 0; y < 900; y += 56, j++) for (let x = -M + (j % 2) * 60; x < W + M; x += 120) s += rect(x + 3, y + 3, 114, 50, (j * 7 + x) % 3 ? '#cc6a52' : '#c0604a', 6, 0);
  s += rect(-M, 900, W + 2 * M, yb - 900, '#7a4a2a', 0, 0); for (let x = -M; x < W + M; x += 90) s += line(x, 900, x, yb, 4, '#5a3420'); s += rect(-M, 890, W + 2 * M, 22, '#5a3420', 4, 5) + dBase(yb, '#4a2a18');
  s += G(tr(230, 440, 1, -2), rect(-170, -210, 340, 420, '#8a5a3a', 18, 7) + rect(-150, -190, 300, 380, '#2f3a35', 10, 0) + ftext(0, -130, 'MENU', { size: 46, fill: '#fff', stroke: 'none' }) + [['BURGER', '18€'], ['FRITES', '7€'], ['SODA', '6€'], ['DESSERT', '9€']].map(([a, b], i) => ftext(-120, -60 + i * 62, a, { size: 28, fill: 'rgba(255,255,255,.85)', stroke: 'none', anchor: 'start' }) + ftext(120, -60 + i * 62, b, { size: 28, fill: SX.acc2, stroke: 'none', anchor: 'end' })).join(''));
  s += dNeon(760, 230, 'BURGER', '#ff5c8a', t, 66) + G(tr(760, 300), ftext(0, 0, '★ ★ ★', { size: 30, fill: SX.acc2, stroke: 'none' }));
  s += dWindowView(600, 380, 330, 330, t) + rect(590, 360, 350, 30, '#2f3a35', 6, 5) + [0, 1, 2, 3, 4, 5].map(i => path(`M${590 + i * 58} 390L${648 + i * 58} 390L${648 + i * 58} 440Q${619 + i * 58} ${462 + wave(t, .6, 5, i)} ${590 + i * 58} 440Z`, i % 2 ? '#fff' : '#36a85a', 4)).join('');
  s += dFrame(990, 420, 110, 140, 'sea', '#c38a52', 4) + dFrame(990, 620, 100, 120, 'mount', '#2f3a35', -3) + dFrame(440, 220, 110, 90, 'heart', '#c38a52', 3);
  s += dShelf(380, 760, 300, dJar(410, 760, '#ff9a4d', .8) + dJar(470, 760, '#7be07b', .8) + dPot(560, 760, .45, t, 2, '#e2463a') + rect(620, 700, 36, 60, '#36a85a', 8, 4) + rect(626, 680, 24, 22, '#e2463a', 4, 3)) + wallClock(540, 140, 44, t);
  s += hangLamp(300, 620, t, .6) + hangLamp(800, 640, t + 1, .6);
  if (o.diners !== false) for (let i = 0; i < 3; i++) { const x = [120, 540, 960][i]; s += op(.9, adult(i + 1, { x, y: 1180, s: .5, expr: ['happy', 'laugh', 'talk'][i], flip: i % 2, armR: [-30, -80] }, t + i) + G(tr(x, 1110), rect(-130, -10, 260, 26, '#fff', 6, 4) + ell(-50, -14, 34, 10, '#fff', 3) + ell(60, -14, 34, 10, '#fff', 3))); }
  s += WASH('rgba(255,240,230,.12)') + dTileFloor(yb, '#f2e6d0', '#3a3f4a') + dPot(60, 1290, 1.1, t, 1) + dPot(1020, 1290, 1, t, 0) + G(tr(1000, yb), line(0, 0, 0, -520, 10, '#6b3e26') + circ(-40, -480, 34, '#e2463a', 5) + circ(40, -460, 30, '#5b8fd8', 5));
  return s; }

// ---------- le héros : le gentil — cheveux blonds sages, gilet bleu ciel à cœur, AURÉOLE (o.crack 0→1 = fissurée, o.haloDim = éteinte) ----------
const HAIR_G = '#e0a83a', SHIRT_G = '#9ad7f5';
EXPR.forced = { eyes: 'wide', mouth: 'perfect', brows: 'sad', sweat: 1 };          // sourire forcé (yeux grands ouverts, dents parfaites, sourcils tristes)
EXPR.forcedSob = { eyes: 'closedSad', mouth: 'perfect', brows: 'sad', tears: 1 };  // sourire forcé… en pleurant
const halfArc = (sd, rx, ry) => `M0 ${f1(-ry)}A${f1(rx)} ${f1(ry)} 0 0 ${sd > 0 ? 1 : 0} 0 ${f1(ry)}`;
function haloSvg(r, t, o = {}) { if (o.halo === false) return ''; const c = clamp(o.crack || 0), dim = clamp(o.haloDim || 0), y = -r * 1.42 + Math.sin(t * 3) * r * .04, rx = r * .62, ry = r * .17, col = dim ? mixC('#ffd23f', '#8a8a8a', dim) : '#ffd23f';
  let g = dim < .9 ? glow(0, y, r * .95, '#fff3a0', .5 * (1 - dim)) : '';
  for (const sd of [-1, 1]) { const d = halfArc(sd, rx, ry); g += G(`translate(${f1(sd * c * r * .16)} ${f1(y + c * r * .08)}) rotate(${f1(sd * c * 16)})`, `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${f1(r * .15)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${f1(r * .08)}" stroke-linecap="round"/>`); }
  if (c > 0) g += path(`M${f1(-r * .04)} ${f1(y - ry - r * .05)}l${f1(r * .09)} ${f1(r * .09)}l${f1(-r * .08)} ${f1(r * .08)}l${f1(r * .07)} ${f1(r * .09)}`, 'none', f1(r * .035));
  if (o.band) g += G(tr(0, y - ry, 1, -12), rect(-r * .2, -r * .07, r * .4, r * .14, '#ffcf9e', r * .05, 4) + circ(-r * .08, 0, r * .015, '#d9a070', 0) + circ(r * .08, 0, r * .015, '#d9a070', 0));
  if (!dim) g += sparkle(rx * .95, y - ry, r * .0035 * (1 + .3 * Math.sin(t * 8)), '#fff');
  return g; }
function twitchSvg(r, t) { const j = Math.sin(t * 47) * r * .02; return path(`M${f1(r * .62 + j)} ${f1(-r * .28)}l${f1(r * .12)} ${f1(-r * .08)}M${f1(r * .66 + j)} ${f1(-r * .12)}l${f1(r * .14)} 0M${f1(r * .62 + j)} ${f1(r * .02)}l${f1(r * .12)} ${f1(r * .08)}`, 'none', f1(r * .035)); }
const gentilHair = (r, t, o) => { const [b, f] = hairSvg('side', o.hairColor || HAIR_G, r, t); return [b, f + haloSvg(r, t, o) + (o.twitch ? twitchSvg(r, t) : '')]; };
const gentil = (o, t) => person(Object.assign({ age: 'kid', hairFn: gentilHair, shirt: SHIRT_G, pants: '#5a6b8a', heartShirt: true, seed: 2 }, o), t);
const gentilHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: gentilHair, seed: 2 }, o), t));
const prof = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#8a5a3a', glasses: true, shirt: '#e2463a', pants: '#4b5b7a', seed: 4 }, o), t);

// ---------- accessoires de l'épisode (préfixe g) ----------
function gRobot(x, y, s, t, broken = 0) { const sp = Math.sin(t * 30) > 0;
  if (!broken) return G(tr(x, y, s, wave(t, 2, 4)), rect(-50, -110, 100, 90, '#c9d3dc', 14, 6) + circ(-22, -70, 12, '#5ec4f0', 4) + circ(22, -70, 12, '#5ec4f0', 4) + line(0, -110, 0, -140, 5) + circ(0, -146, 10, '#e2463a', 4) + rect(-60, -20, 120, 100, '#e2463a', 16, 6) + rect(-30, 0, 60, 30, '#ffd23f', 6, 4) + rect(-90, -10, 30, 70, '#c9d3dc', 10, 5) + rect(60, -10, 30, 70, '#c9d3dc', 10, 5));
  return G(tr(x, y, s), G(tr(-70, 40, 1, -40), rect(-50, -45, 100, 90, '#c9d3dc', 14, 6) + path('M-22 -5l10 10M-12 -5l-10 10M22 -5l10 10M32 -5l-10 10', 'none', 5)) + G(tr(60, 60, 1, 25), rect(-60, -50, 120, 100, '#e2463a', 16, 6) + path('M-20 -50L0 -10L-10 20', 'none', 5)) +
    path(`M0 -20q20 -20 0 -40q-20 -20 0 -40q20 -20 0 -40`, 'none', 6, '#9aa3ad') + G(tr(-150, 90, 1, 70), rect(-15, -35, 30, 70, '#c9d3dc', 10, 5)) + G(tr(150, 100, 1, -60), rect(-15, -35, 30, 70, '#c9d3dc', 10, 5)) + (sp ? impactStar(10, -130, .35, '#fff36b') : sparkle(-20, -120, .4, '#fff36b')) + circ(30, 120, 10, '#ffd23f', 3) + circ(-40, 130, 8, '#5ec4f0', 3)); }
function gTest(x, y, s, r, grade = '', name = '', t = 0, t0 = 0) { let g = rect(-150, -200, 300, 400, '#fff', 10, 6) + ftext(-120, -150, name, { size: 30, fill: '#5b8fd8', stroke: 'none', anchor: 'start', font: SX.marker }); for (let i = 0; i < 8; i++) g += line(-120, -100 + i * 36, 60 + ((i * 37) % 60), -100 + i * 36, 5, '#9aa8b5');
  g += ftext(-110, -40, 'x² = 4 ✓', { size: 22, fill: '#e2463a', stroke: 'none', anchor: 'start' });
  if (grade) { const k = pop(t, t0, .35); if (k > 0) g += G(tr(70, 110, k, -8), ell(0, 0, 92, 64, 'none', 9, '#e2463a') + ftext(0, 22, grade, { size: 62, fill: '#e2463a', stroke: 'none' })); }
  return G(tr(x, y, s, r), g); }
function gPhone(x, y, s, r, screen = '') { return G(tr(x, y, s, r), rect(-170, -330, 340, 660, '#2b2b33', 44, 6) + rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + screen + rect(-50, -318, 100, 14, '#444', 7, 0)); }
const gMsg = (x, y, str, t, t0, me = 0, w = 250) => { const k = pop(t, t0, .3); if (k <= 0) return ''; return G(tr(x, y, k), rect(-w / 2, -32, w, 64, me ? '#7fd3a0' : '#fff', 26, 4) + ftext(0, 12, str, { size: 26, fill: OL, stroke: 'none' })); };
function gFolder(x, y, s, r, str = 'EXPOSÉ', c = '#ffb03a') { return G(tr(x, y, s, r), rect(-150, -120, 120, 40, shade(c, -.15), 10, 5) + rect(-160, -100, 320, 220, c, 14, 6) + rect(-110, -50, 220, 70, '#fff', 8, 4) + ftext(0, -2, str, { size: 34, fill: OL, stroke: 'none' }) + line(-120, 60, 120, 60, 4, shade(c, -.25)) + line(-120, 85, 60, 85, 4, shade(c, -.25))); }
function gPile(x, yb, n, t, seed = 3) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const w = 260 + r() * 60, c = ['#fff', '#ffe9a8', '#cfe8ff', '#ffd0dc', '#d9f0d2'][i % 5], sw = Math.sin(t * 3 + i * .3) * i * .6; s += G(tr(x + sw + (r() - .5) * 30, yb - i * 34, 1, (r() - .5) * 8), rect(-w / 2, -30, w, 30, c, 4, 4) + (i % 3 === 0 ? rect(-w / 2 + 10, -26, 60, 22, DPAL[i % 8], 3, 0) : '')); } return s; }
const gMegaphone = (x, y, s, r = 0) => G(tr(x, y, s, r), path('M0 -30L150 -90L150 90L0 30Z', '#e2463a', 6) + ell(150, 0, 24, 90, '#c43a2e', 6) + rect(-40, -34, 50, 68, '#ffd23f', 10, 5) + rect(-10, 30, 26, 60, '#3a3f4a', 6, 5));
function gWanted(x, y, s, t, inner, str = 'ÉGOÏSTE') { return G(tr(x, y, s, wave(t, 1, 1.5)), rect(-200, -260, 400, 520, '#f3e2b8', 10, 7) + ftext(0, -190, 'AVIS', { size: 54, fill: '#7a4a2a', stroke: 'none' }) + rect(-150, -150, 300, 260, '#fff8e0', 6, 5) + inner + ftext(0, 190, str, { size: 64, fill: '#c43a2e', stroke: 'none' }) + circ(-170, -230, 10, '#e2463a', 3) + circ(170, -230, 10, '#e2463a', 3)); }
const gBulb = (x, y, s, on, t = 0) => G(tr(x, y, s, wave(t, 2, 4)), (on ? glow(0, 0, 200, '#fff6a0', .8) : '') + circ(0, -10, 60, on ? '#fff36b' : '#e8e8e8', 6) + rect(-30, 45, 60, 40, '#9aa3ad', 8, 5) + line(-20, 62, 20, 62, 4) + path('M-16 0Q0 -30 16 0', 'none', 5, on ? '#ff9a3c' : '#bbb'));
function gSign(x, y, s, r, str = 'NON.', c = '#fff') { return G(tr(x, y, s, r), rect(-12, 60, 24, 260, '#b5835a', 6, 5) + rect(-190, -110, 380, 200, c, 22, 7) + ftext(0, 26, str, { size: 110, fill: '#e2463a', stroke: 'none' })); }
function gSpine(x, y, s, k, t) { let g = ''; const n = 9; for (let i = 0; i < n; i++) { const kk = clamp(k * n - i); if (kk <= 0) continue; const yy = -240 + i * 56; g += G(tr(Math.sin(i * .7) * 6, yy, eOutBack(kk)), rect(-34, -20, 68, 40, '#f4fbff', 12, 5) + rect(-56, -8, 22, 16, '#f4fbff', 6, 4) + rect(34, -8, 22, 16, '#f4fbff', 6, 4)); } return G(tr(x, y, s), (k > .9 ? glow(0, 0, 260, '#bff6ff', .5) : '') + g); }
function gTumble(x, y, s, t) { let d = ''; for (let i = 0; i < 7; i++) d += `M${f1(Math.cos(i) * 50)} ${f1(Math.sin(i * 1.7) * 50)}Q${f1(Math.cos(i + 2) * 60)} ${f1(Math.sin(i + 1) * 60)} ${f1(Math.cos(i + 3) * 46)} ${f1(Math.sin(i * 2.3) * 46)}`; return G(tr(x, y, s, t * 300), circ(0, 0, 56, 'none', 6, '#b08a50') + path(d, 'none', 5, '#9a7440')); }
function gStormCloud(x, y, s, t, face = '') { let g = ''; for (let i = 0; i < 9; i++) { const k = (t * 2.2 + i / 9) % 1; g += line(-120 + i * 30, 40 + k * 260, -128 + i * 30, 76 + k * 260, 6, '#8fd0ff'); } return G(tr(x, y, s), g + cloud(0, 0, 1.4, '#7d8796') + face + (Math.sin(t * 9) > .85 ? lightning(-20, 40, .3, 1) : '')); }
function gTape(x, y, s, r) { return G(tr(x, y, s, r), rect(-70, -22, 140, 44, 'rgba(230,230,220,.95)', 4, 4) + line(-60, -10, 60, -10, 3, 'rgba(0,0,0,.12)') + line(-60, 10, 60, 10, 3, 'rgba(0,0,0,.12)')); }
function gBush(x, y, s, t) { return G(tr(x, y, s, wave(t, .8, 2)), circ(-90, 30, 90, '#5fb85f', 7) + circ(90, 30, 90, '#4fa64f', 7) + circ(0, -40, 100, '#6cc46c', 7) + circ(-60, 110, 80, '#4fa64f', 7) + circ(60, 110, 80, '#5fb85f', 7) + line(-40, 190, -40, 260, 8, '#8a5a3a') + line(40, 190, 40, 260, 8, '#8a5a3a') + path('M-120 0q20 -20 40 0M60 -60q20 -20 40 0', 'none', 5, '#3f8a3f')); }
function camTripod(x, y, s) { return G(tr(x, y, s), line(0, 0, -140, 500, 14) + line(0, 0, 140, 500, 14) + line(0, 0, 0, 520, 14) + rect(-170, -150, 340, 200, '#3a3f4a', 30) + circ(0, -50, 80, '#2b2b33') + circ(0, -50, 46, '#5ec4f0', 6) + rect(90, -190, 70, 40, '#555', 8)); }
function gClap(x, y, s, t, t0) { const k = seg(t, t0, t0 + .15), a = -30 * (1 - k); let st = ''; for (let i = 0; i < 5; i++) st += path(`M${-150 + i * 64} 0L${-118 + i * 64} 0L${-150 + i * 64 + 64} -40L${-182 + i * 64 + 64} -40Z`, '#fff', 0); return G(tr(x, y, s), rect(-160, 0, 320, 180, '#2b2b33', 10, 6) + ftext(-140, 70, 'SCÈNE 1', { size: 34, fill: '#fff', stroke: 'none', anchor: 'start' }) + ftext(-140, 140, 'PRISE 47', { size: 34, fill: '#fff', stroke: 'none', anchor: 'start' }) + G(`rotate(${f1(a)} -160 0)`, rect(-160, -44, 320, 44, '#2b2b33', 6, 6) + st)); }
function gMachine(x, yb, s, t, broken) { return G(tr(x, yb, s), rect(-210, -560, 420, 560, '#5ec4f0', 26, 7) + rect(-180, -520, 230, 330, '#dff4ff', 12, 5) + [0, 1, 2].map(j => [0, 1].map(i => rect(-165 + i * 105, -505 + j * 105, 90, 90, ['#ff8fb1', '#ffd23f', '#7be07b', '#fff', '#ff9a4d', '#b56cff'][j * 2 + i], 10, 4) + heart(-120 + i * 105, -460 + j * 105, .5, '#e2463a')).join('')).join('') +
  rect(70, -520, 110, 60, '#2b2b33', 8, 5) + ftext(125, -480, broken ? 'ERR' : '0 €', { size: 30, fill: broken ? '#ff4d4d' : '#7be07b', stroke: 'none' }) + [0, 1, 2, 3].map(i => circ(100 + (i % 2) * 50, -410 + Math.floor(i / 2) * 60, 18, '#fff', 5)).join('') + rect(-180, -160, 360, 90, '#2b2b33', 10, 5) + rect(-200, -560, 400, 70, SX.acc, 20, 6) + ftext(0, -512, 'GENTI-MATIC', { size: 40, fill: '#fff' }) +
  (broken ? G(tr(0, -300, 1, -8), rect(-190, -46, 380, 92, '#ffd23f', 10, 7) + ftext(0, 18, 'HORS SERVICE', { size: 44, fill: OL, stroke: 'none' })) : '')); }
function gCape(x, y, s, t) { const w = wave(t, 3, 30); return G(tr(x, y, s), path(`M-70 0Q-140 200 ${-160 - w} 420L${120 - w} 420Q60 200 70 0Z`, '#e2463a', 7)); }
function gNotes(t, x, y, n = 6) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * 1.2 + i / n) % 1; s += op(1 - k, G(tr(x + (i - n / 2) * 70 + Math.sin(k * 9 + i) * 40, y - k * 420, .8 + k * .6, Math.sin(k * 6 + i) * 20), ftext(0, 0, i % 2 ? '♪' : '♫', { size: 90, fill: DPAL[i % 8] }))); } return s; }
function gHands(x, y, s, t, t0) { const k = Math.abs(Math.sin((t - t0) * 7)); return t < t0 ? '' : G(tr(x, y, s), G(tr(-60 - k * 70, 0, 1, 20), ell(0, 0, 50, 70, SKIN, 6)) + G(tr(60 + k * 70, 0, 1, -20), ell(0, 0, 50, 70, SKIN, 6)) + (k < .2 ? impactStar(0, -10, .4, '#fff3b0') : '')); }
const gCups = (x, y, s = 1) => G(tr(x, y, s), path('M-30 -80L30 -80L22 0L-22 0Z', '#e2463a', 5) + rect(-34, -88, 68, 12, '#fff', 4, 4));
// chambre d'enfant de jour : murs à pois, fenêtre + rideaux, posters, étagère garnie, lit, tapis, jouets
function chambreG(t, o = {}) { const yb = 1250;
  let s = dWall('dot', '#d9f0d2', '#c4e6b9', yb) + dBase(yb, '#fff');
  s += dWindowView(60, 300, 260, 330, t) + dCurtain(0, 280, 90, 420, '#5b8fd8', t, 1) + dCurtain(290, 280, 90, 420, '#5b8fd8', t, -1);
  s += dPoster(480, 360, 150, 210, '#ff9a4d', -4, circ(0, -20, 40, '#fff', 4) + path('M-20 40L0 -10L20 40Z', '#e2463a', 4), t) + dPoster(660, 400, 130, 170, '#b56cff', 5, ftext(0, 10, '★', { size: 70, fill: '#ffd23f', stroke: 'none' }), t);
  s += dFrame(870, 300, 130, 110, 'heart', '#c38a52', 4) + wallClock(1010, 470, 46, t) + dShelf(720, 640, 330, dBooks(730, 640, 150, 7) + dTeddy(920, 640, .6) + dTrophy(1000, 640, .6)) + dOutlet(560, 1180) + dSwitch(420, 900);
  s += G(tr(900, yb), rect(-220, -230, 40, 230, '#b98552', 8, 6) + rect(-200, -110, 420, 90, '#b98552', 10, 6) + rect(-190, -150, 400, 60, '#fff', 20, 5) + path('M-120 -150Q60 -190 230 -150L230 -40L-120 -40Z', '#5b8fd8', 6) + ell(-150, -170, 60, 30, '#fff', 5));
  s += WASH() + dParquet(yb, '#c49a6c') + dRug(CX, 1480, 760, 160, '#5ec4f0', '#ffd23f');
  s += dBox(170, 1330, .8, 'JOUETS') + dShoes(820, 1660, .7, '#36a85a') + dBag(960, 1400, .8, '#ff9a4d', 8) + dBall(300, 1700, .6, t * .2, '#e2463a') + dPot(60, 1290, .9, t, 0);
  return s; }
// plateau de tournage : toile de fond « parc » peinte, projecteurs sur pieds, perche, câbles, chaise de réal, faisceaux
function filmSet(t) { const yb = 1250;
  let s = grad('#2b2440', '#141026', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 60, W + 2 * M, 24, '#3a3550', 0, 0);
  for (let i = 0; i < 6; i++) { const x = -40 + i * 230; s += line(x, 84, x, 130, 5, '#555') + G(tr(x, 130, 1, wave(t, .3, 4, i)), rect(-26, 0, 52, 40, '#2b2b33', 8, 4) + circ(0, 44, 14, i % 2 ? '#fff6c8' : '#ffb3c8', 3)); }
  s += rect(100, 220, 880, 760, '#9fd6ff', 10, 7) + rect(100, 700, 880, 280, '#8fd16a', 0, 0) + circ(830, 340, 60, '#fff3b0', 5) + cloud(300 + wave(t, .2, 20), 360, .8, '#fff') + tree(240, 860, .55, t) + tree(820, 880, .5, t) + dBush(520, 900, .6) + path('M100 980L100 220', 'none', 7) + rect(100, 220, 880, 760, 'none', 10, 7) + ftext(160, 270, 'DÉCOR', { size: 26, fill: 'rgba(0,0,0,.3)', stroke: 'none', anchor: 'start' });
  for (const sd of [-1, 1]) { const x = CX + sd * 470; s += line(x, yb, x, 520, 10, '#3a3f4a') + line(x, yb, x - 80, yb + 20, 8, '#3a3f4a') + line(x, yb, x + 80, yb + 20, 8, '#3a3f4a') + G(tr(x, 500, 1, sd * -25), rect(-70, -50, 140, 100, '#2b2b33', 12, 6) + circ(sd * 60, 0, 40, '#fff6c8', 5)) + op(.16 + .03 * Math.sin(t * 3), path(`M${x} 500L${CX - sd * 40 - 260} 1250L${CX - sd * 40 + 160} 1250Z`, '#fff6c8', 0)); }
  s += G(tr(CX + 60, 0), line(-400, 120, 200, 380, 10, '#3a3f4a') + G(tr(200, 380), rect(-30, -20, 90, 40, '#555', 14, 5) + ell(60, 0, 26, 30, '#8a8f99', 4)));
  s += WASH('rgba(255,255,255,.05)') + rect(-M, yb, W + 2 * M, 1400, '#3a3550', 0, 0) + line(-M, yb, W + M, yb, 7, '#26203a') + path(`M-100 1400Q300 1340 500 1420T1200 1380`, 'none', 10, '#1a1a1a') + path(`M-100 1500Q400 1560 700 1480T1200 1540`, 'none', 10, '#1a1a1a');
  s += G(tr(980, 1330), rect(-70, -140, 140, 20, '#2b2b33', 4, 4) + rect(-70, -260, 140, 90, '#2b2b33', 4, 4) + ftext(0, -205, 'RÉAL.', { size: 30, fill: '#fff', stroke: 'none' }) + line(-60, -120, 60, 0, 7) + line(60, -120, -60, 0, 7)) + rect(40, 1300, 140, 90, '#c58e55', 6, 5) + ftext(110, 1360, 'CAFÉ', { size: 24, fill: '#fff', stroke: 'none' }) + gCups(70, 1300, .5) + gCups(130, 1300, .5);
  return s; }
const SUNSET = () => op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff7a3d', 0, 0));
const DIMR = (k = .3) => op(k, rect(-M, -M, W + 2 * M, H + 2 * M, '#141838', 0, 0));
const deskFront = (x, y, s = 1, c = '#c58e55') => G(tr(x, y, s), rect(-230, -20, 460, 34, shade(c, .15), 8, 6) + rect(-200, 14, 400, 180, c, 6, 6) + line(-150, 60, 150, 60, 4, shade(c, -.2)));

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, at(n, 'mot') - .15))
//  Cadrage 9:16 : visages/textes entre y 380 et 1150, sous 1250 = décor seulement.
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, le gentil en cut-out (auréole), « débloqué » en étoiles sur GENTIL
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Gt = at(1, 'gentil'); return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, Gt, { part: 'back', r: 480 }) +
    G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(gentil({ x: 0, y: 0, s: 1.25, expr: t > Gt ? 'forced' : 'joy', twitch: t > Gt + .2, armR: [-30, -60] }, t), 12)) + unlock(CX, 1000, t, Gt, { part: 'front', r: 480 }) + funBox(CX, 1030, 330, 330, t, Gt + .2, { label: 'gentil.png' }) +
    kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'ÊTRE LE", CX, 415, t, .3, { size: 58 }) + kword('MEC TROP GENTIL ?', CX, 540, t, at(1, 'mec') - .05, { size: 66, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'mec') - .05, 'boom', .6], [at(1, 'gentil'), 'angel', .6], [at(1, 'gentil') + .1, 'sparkle', .5]] });
// B002 — « Tu prêtes 20 euros à Kevin » : papier + gobo, le billet vole vers Kevin (yeux affamés)
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const P = at(2, 'pretes'), k = eOutCubic(seg(t, P, P + .45)); return paper(SX.paper) + gobo(T, .12) + burst(780, 980, 260, t, at(2, 'kevin'), '#ffe1b8', 16) +
    cutout(gentil({ x: 300, y: 1450, s: 1.2, expr: 'happy', armR: [-10, -5] }, t), 10) + cutout(kevin({ x: 790, y: 1450, s: 1.2, expr: 'starving', flip: 1, armR: [-10, 0] }, t), 10) +
    bill(lerp(470, 640, k), lerp(1000, 990, k) - Math.sin(k * 3.14) * 140, 1.1, k * 360) + funTag(CX, 470, '20 €', t, at(2, '20') - .05, { size: 90, bg: '#7be07b', fg: SX.ink }) + funTag(790, 640, 'KEVIN', t, at(2, 'kevin'), { size: 44, bg: '#5fb85f' }); },
  sfx: [[0, 'whoosh', .4], [at(2, '20') - .05, 'kaching', .7], [at(2, 'pretes') + .2, 'flutter', .5], [at(2, 'kevin'), 'pop', .6]] });
// B003 — « Il promet de te rembourser demain » : Kevin main sur le cœur… doigts croisés dans le dos (carte zoom)
B(3, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1, 1.05, t / d) }),
  draw: (t, d, T) => { const D = at(3, 'demain'); const fingers = G(tr(0, 10), ell(0, 40, 70, 60, SKIN, 6) + G(tr(-14, -20, 1, 18), rect(-14, -80, 28, 90, SKIN, 14, 6)) + G(tr(14, -20, 1, -18), rect(-14, -80, 28, 90, SKIN, 14, 6)) + rect(-60, 80, 120, 50, '#5fb85f', 10, 5));
    return gridBg('#1f3a44') + halftoneFade(SX.acc, .08, 1) + cutout(kevinHead(CX - 110, 900, 190, { expr: 'proud' }, t), 12) + card(830, 1080, 250, 250, fingers, t, D - .1, { ry: 0, thick: 8, r: 6, bw: 6 }) + markerCircle(830, 1080, 150, 150, t, D + .05, { col: SX.acc2 }) +
      kthin('il promet de te rembourser', CX, 400, t, at(3, 'promet') - .1, { size: 50 }) + kword('DEMAIN !', CX, 530, t, D - .05, { size: 110, fill: SX.acc2 }) + markerText('menteur', 830, 1260 - 80, t, D + .3, { size: 44, col: '#fff' }); },
  sfx: [[at(3, 'promet') - .1, 'pop_hi', .4], [at(3, 'demain') - .05, 'boom', .5], [at(3, 'demain') + .05, 'scratch', .5], [at(3, 'demain') + .3, 'rimshot', .4]] });
// B004 — « Trois mois plus tard » : rue vivante, calendrier qui s'effeuille, Kevin sur le banc (baskets neuves, glace), tu tends la main
B(4, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const months = ['JANV.', 'FÉV.', 'MARS', 'AVRIL'], m = months[Math.min(3, Math.floor(seg(t, .1, at(4, 'tard') + .2) * 3.99))], A = at(4, 'demandes');
    return depth({ zoom: 1, x: Math.sin(t) * 14 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: kevin({ x: 760, y: 1480, s: 1.3, expr: 'chill', flip: 1, holdL: G(tr(0, -20), path('M-20 0L20 0L0 70Z', '#e8b06a', 4) + circ(0, -14, 26, '#ff8fb1', 4)), armL: [200, 250] }, t) + gentil({ x: 320, y: 1480, s: 1.3, expr: t > A ? 'forced' : 'neutral', armR: t > A ? [-5, 0] : [70, 80] }, t) + G(tr(700, 1460), dShoes(0, 0, .8, '#ff5c8a')) + (Math.sin(t * 8) > 0 ? sparkle(820, 1420, .5, '#fff') : '') },
      { z: .6, svg: blur(10, dBin(80, 1820, 1.4, '#36a85a')) }]) +
      G(tr(860, 640, 1, 6), rect(-110, -120, 220, 230, '#fff', 16, 6) + rect(-110, -120, 220, 60, '#e2463a', 16, 6) + ftext(0, 50, m, { size: 46, fill: OL, stroke: 'none' })) + funTag(CX - 80, 430, 'TROIS MOIS PLUS TARD', t, at(4, 'trois') - .1, { size: 42, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .5], [at(4, 'trois') - .1, 'pop', .6], [.3, 'rewind', .5], [at(4, 'demandes'), 'hmm', .4], [at(4, 'argent'), 'coins', .5]] });
// B005 — « Il te regarde » : crash zoom sur Kevin, regard suspicieux
B(5, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.14, eOutCubic(clamp(t / .4))), hand: .3 }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2), haze: .25 }, { z: 1, svg: kevinHead(CX, 900, 190, { expr: 'suspicious', look: [-.4, 0] }, t) }]) + speedLines(t, CX, 880, 30, 'rgba(255,255,255,.55)'),
  sfx: [[0, 'whoosh', .6], [at(5, 'regarde'), 'sting', .6]] });
// B006 — « Wesh, t'es devenu bizarre avec l'argent » : Kevin te pointe du doigt, pièces qui tournent autour de ta tête
B(6, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const Bz = at(6, 'bizarre'); let coins = ''; if (t > at(6, 'argent') - .3) for (let i = 0; i < 5; i++) { const a = t * 4 + i * 1.256; coins += G(tr(320 + Math.cos(a) * 170, 640 + Math.sin(a) * 40, 1), circ(0, 0, 30, '#ffd23f', 5) + ftext(0, 12, '€', { size: 32, fill: '#c9962b', stroke: 'none' })); }
    return streetT(t, 2) + WASH() + gentil({ x: 320, y: 1500, s: 1.35, expr: t > Bz ? 'shock' : 'neutral' }, t) + kevin({ x: 780, y: 1500, s: 1.35, expr: 'mock', flip: 1, armR: [-10, -5] }, t) + coins +
      funTag(780, 470, 'WESH', t, at(6, 'wesh') - .05, { size: 56, bg: '#5fb85f' }) + kword('BIZARRE', 330, 470, t, Bz - .05, { size: 92, fill: SX.acc2, r: -4 }) + funBox(320, 960, 300, 300, t, Bz + .1, { label: 'bizarre.png' }); },
  sfx: [[at(6, 'wesh') - .05, 'pop', .6], [at(6, 'bizarre') - .05, 'boing', .7], [at(6, 'argent') - .3, 'coins', .6], [at(6, 'argent'), 'hmm', .4]] });
// B007 — « Pardon ? » : mâchoire au sol, rayons accent
B(7, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 6 }),
  draw: (t, d, T) => rays(t, CX, 900, SX.acc, '#5fd8e2', 22) + gentilHead(CX, 1000, 230, { expr: 'jawdrop' }, t) + kword('PARDON ?', CX, 430, t, at(7, 'pardon') - .05, { size: 120, fill: '#fff' }),
  sfx: [[0, 'flash_hit', .6], [at(7, 'pardon'), 'gasp', .7], [.1, 'boing', .4]] });
// B008 — « C'est moi qui suis bizarre ? » : tu te pointes toi-même, l'auréole se fissure (1re fissure)
B(8, { cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .5, r: -3 }),
  draw: (t, d, T) => { const Bz = at(8, 'bizarre'); return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2), haze: .2 }, { z: 1.15, svg: blur(4, kevin({ x: 880, y: 1500, s: 1.3, expr: 'smug', flip: 1 }, t)) },
    { z: 1, svg: gentil({ x: 400, y: 1500, s: 1.4, expr: 'confused', armL: [10, -150], crack: t > Bz ? .12 : 0 }, t) }]) + markerArrow(760, 520, 520, 760, t, at(8, 'moi') - .1, { bend: -60, col: SX.acc }) + markerText('MOI ?!', 800, 470, t, at(8, 'moi'), { size: 70, col: SX.acc2 }) + (t > Bz ? popStars(400, 720, t, Bz, 6, 120) : ''); },
  sfx: [[at(8, 'moi') - .1, 'scratch', .5], [at(8, 'bizarre'), 'crack', .6], [at(8, 'bizarre') + .1, 'hmm', .4]] });
// B009 — « Bienvenue dans la vie du mec trop gentil » : paillasson BIENVENUE, étiquettes « OUI » qui poussent autour de toi
B(9, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const tags = [['OUI !', 200, 760, SX.acc2], ['PAS DE SOUCI', 860, 720, SX.cool], ['AVEC PLAISIR', 210, 1020, '#7be07b'], ['T’INQUIÈTE', 870, 1000, '#ffb03a']];
    return paper('#ffe9c9') + gobo(T, .1) + G(tr(CX, 1300), rect(-330, -40, 660, 120, '#c58e55', 30, 7) + ftext(0, 42, 'BIENVENUE', { size: 64, fill: '#7a4a2a', stroke: 'none' })) + cutout(gentil({ x: CX, y: 1290, s: 1.3, expr: 'forced', armL: [200, 230], armR: [-20, -50] }, t), 12) +
      tags.map(([s, x, y, c], i) => funTag(x, y, s, t, .3 + i * .18, { size: 36, bg: c, fg: SX.ink, r: (i % 2 ? 6 : -6) })).join('') + kthin('bienvenue dans la vie du', CX, 400, t, at(9, 'bienvenue') - .1, { size: 52 }) + kword('MEC TROP GENTIL', CX, 520, t, at(9, 'mec') - .05, { size: 80, fill: SX.acc }); },
  sfx: [[0, 'magic', .5], [.3, 'pop_hi', .4], [.48, 'pop_hi', .4], [.66, 'pop_hi', .4], [.84, 'pop_hi', .4], [at(9, 'mec') - .05, 'tada', .6], [at(9, 'gentil'), 'angel', .5]] });
// B010 — « À 8 ans, tu prêtes ton jouet » : chambre d'enfant, le robot passe de tes mains à celles de Kevin
B(10, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const P = at(10, 'pretes'), k = eOutCubic(seg(t, P, P + .35)); return chambreG(t) + gentil({ x: 330, y: 1420, s: 1.05, expr: 'happy', armR: [-10, 0] }, t) + kevin({ x: 760, y: 1420, s: 1.05, expr: 'starving', flip: 1, armR: [-10, 0] }, t) + gRobot(lerp(490, 600, k), 1130 - Math.sin(k * 3.14) * 80, .9, t) +
    funTag(CX, 450, '8 ANS', t, at(10, '8') - .05, { size: 80, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .5], [at(10, '8') - .05, 'pop', .6], [at(10, 'pretes'), 'squeak', .6], [at(10, 'ejouer'), 'chirp', .4]] });
// B011 — « Il revient cassé » : les morceaux du robot, étincelles ; toi : sourire forcé en pleurant ; Kevin siffle
B(11, { enter: 'drop', cam: () => ({ z: 1.05, shake: 3 }),
  draw: (t, d, T) => chambreG(t) + gentil({ x: 330, y: 1420, s: 1.05, expr: 'forcedSob' }, t) + kevin({ x: 790, y: 1420, s: 1.05, expr: 'calm', face: { mouth: 'o-small' }, look: [1, -1], flip: 1 }, t) + ftext(880, 900, '♪', { size: 70, fill: '#fff' }) + gRobot(CX, 1140, .9, t, 1) + stamp(CX, 470, 'CASSÉ', t, at(11, 'casser') - .05),
  sfx: [[0, 'crack', .7], [.1, 'boing', .5], [at(11, 'casser') - .05, 'thud', .7], [.5, 'zap', .4], [.6, 'whistle', .4]] });
// B012 — « Puis à 12 ans, tu passes ton contrôle de maths à Kevin » : classe, la copie passe par-dessus ton épaule
B(12, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const P = at(12, 'passes'), k = eOutCubic(seg(t, P, P + .5)); const board = ftext(540, 560, 'CONTRÔLE', { size: 70, fill: 'rgba(255,255,255,.85)', stroke: 'none', font: SX.marker }) + ftext(540, 660, 'DE MATHS', { size: 60, fill: 'rgba(255,255,255,.7)', stroke: 'none' }) + ftext(540, 760, '2x + 3 = 7', { size: 50, fill: 'rgba(255,255,255,.6)', stroke: 'none' });
    return classroomT(t, board) + prof({ x: 140, y: 1250, s: .8, expr: 'calm', armL: [200, 250] }, t) + gentil({ x: 330, y: 1520, s: 1.25, expr: 'worried', armR: [-60 - 40 * k, -90] }, t) + kevin({ x: 790, y: 1450, s: 1.1, expr: 'smug', flip: 1, armL: [200, 220] }, t) + deskFront(330, 1270, .9) + deskFront(790, 1230, .75) +
      gTest(lerp(470, 680, k), lerp(980, 950, k) - Math.sin(k * 3.14) * 160, .5, lerp(-10, 10, k), '', 'Moi') + funTag(CX, 400, '12 ANS', t, at(12, '12') - .05, { size: 70, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'school_bell', .4], [at(12, '12') - .05, 'pop', .6], [at(12, 'passes'), 'whoosh', .6], [at(12, 'kevin'), 'tiptoe', .5]] });
// B013 — « Il recopie tout » : Kevin recopie à la vitesse de la lumière (stylo fumant, traits de vitesse)
B(13, { enter: 'crash', cam: () => ({ z: 1.08, shake: 5 }),
  draw: (t, d, T) => blur(6, classroomT(t)) + speedLines(t, CX, 900, 36, 'rgba(255,255,255,.6)') + kevinHead(CX, 760, 200, { expr: 'effort', look: [0, 1] }, t) + gTest(CX - 210, 1120, .7, -6, '', 'Moi') + gTest(CX + 210, 1120, .7, 6, '', 'Kevin') +
    G(tr(CX + 200 + Math.sin(t * 60) * 40, 1060 + Math.cos(t * 50) * 20, 1, 30), rect(-12, -90, 24, 120, '#ffd23f', 6, 5) + path('M-12 30L0 60L12 30Z', '#f2c9a0', 4)) + steam(CX + 230, 980, t, .7) + funTag(CX, 420, 'COPIER-COLLER', t, at(13, 'recopie'), { size: 50, bg: SX.acc }),
  sfx: [[0, 'whoosh', .5], [.05, 'typing', .7], [at(13, 'recopie'), 'scratch', .5], [at(13, 'tout'), 'sizzle', .4]] });
// B014 — « Il obtient 16 » : Kevin brandit 16/20, extase, confettis
B(14, { enter: 'punch', cam: zin(1.04, 1.1),
  draw: (t, d, T) => rays(t, CX, 900, '#ffe9a6', '#ffd76b', 20) + kevin({ x: CX + 180, y: 1500, s: 1.35, expr: 'ecstatic', armL: [230, 250], armR: [-50, -80] }, t) + gTest(380, 860, .95, -8, '16/20', 'Kevin', t, at(14, '16') - .05) + confetti(t, at(14, '16'), 30) + popStars(380, 860, t, at(14, '16'), 7, 260),
  sfx: [[0, 'whoosh', .4], [at(14, '16') - .05, 'tada', .7], [at(14, '16') + .1, 'sparkle', .5]] });
// B015 — « Toi, 15 » : ta copie 15/20, regard vide, un criquet ; l'auréole se fissure un peu plus
B(15, { enter: 'none', trans: 'glitch', transD: .2, cam: () => ({ z: 1.06 }),
  draw: (t, d, T) => classroomT(t) + DIMR(.15) + gentil({ x: CX + 200, y: 1500, s: 1.35, expr: 'deadpan', crack: .25 }, t) + gTest(380, 900, .95, 6, '15/20', 'Moi', t, at(15, '15') - .05) + G(tr(860, 480), ftext(0, 0, '…', { size: 90, fill: '#fff' })),
  sfx: [[at(15, '15') - .05, 'error_beep', .6], [.3, 'crickets', .5]] });
// B016 — « Le prof te demande de prendre exemple sur lui » : Kevin sur un podium (couronne, médaille, projecteur), la prof le montre
B(16, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const E = at(16, 'exemple'); return classroomT(t) + op(.35, path('M700 0L520 1300L1000 1300Z', '#fff6c8', 0)) + G(tr(780, 1300), rect(-170, -120, 340, 120, '#ffd23f', 10, 6) + ftext(0, -40, '1', { size: 70, fill: OL, stroke: 'none' })) +
    kevin({ x: 780, y: 1180, s: 1.05, expr: 'smugger', armL: [210, 240] }, t) + G(tr(780, 640), path('M-60 0L-70 -70L-30 -40L0 -90L30 -40L70 -70L60 0Z', '#ffd23f', 6)) + G(tr(780, 1000), path('M-14 -50L0 -10L14 -50Z', '#e2463a', 4) + circ(0, 6, 24, '#ffd23f', 5)) +
    prof({ x: 440, y: 1560, s: 1.2, expr: 'proud', armR: [-30, -20] }, t) + gentilHead(185, 1060, 90, { expr: 'jawdrop', crack: .3 }, t) + funTag(780, 430, 'EXEMPLE', t, E - .05, { size: 64, bg: SX.acc }) + (t > E ? popStars(780, 800, t, E, 7, 240) : ''); },
  sfx: [[at(16, 'prof'), 'hmm', .4], [at(16, 'exemple') - .05, 'angel', .6], [at(16, 'exemple') + .1, 'tada', .5], [at(16, 'lui'), 'rimshot', .4]] });
// B017 — « Mais c'est mon contrôle espèce de… Bref. » : rage (vapeur, BIP censuré) puis cut : sourire forcé, auréole pansée
B(17, { enter: 'crash', cam: (t, d) => ({ z: t < at(17, 'bref') ? 1.12 : 1.04, shake: t < at(17, 'bref') ? 8 : 0 }),
  draw: (t, d, T) => { const Bf = at(17, 'bref'); if (t < Bf) return rays(t, CX, 900, '#e2463a', '#ff6b4a', 22) + gentilHead(CX, 970, 240, { expr: 'rage', crack: .5 }, t) + kthin("c'est MON contrôle !", CX, 420, t, at(17, 'mon') - .1, { size: 58 }) + (t > at(17, 'espece') ? G(tr(CX, 1150, 1, -4), rect(-200, -55, 400, 110, OL, 18, 0) + ftext(0, 24, 'BIP !', { size: 70, fill: SX.acc2, stroke: 'none' })) : '');
    return classroomT(t) + WASH() + gentilHead(CX, 980, 230, { expr: 'forced', crack: .5, band: 1, twitch: 1 }, t) + kword('BREF.', CX, 470, t, Bf - .02, { size: 120, fill: '#fff' }); },
  sfx: [[0, 'growl', .6], [at(17, 'controle'), 'fire', .5], [at(17, 'espece'), 'error_beep', .8], [at(17, 'bref') - .02, 'scratch', .6], [at(17, 'bref') + .1, 'ding', .5]] });
// B018 — « Tu souris parce que tu ne veux jamais déranger » : gros plan sourire tenu au scotch, œil qui tique
B(18, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.04, 1.14, t / d), hand: .3 }),
  draw: (t, d, T) => { const S = at(18, 'souris'); return blur(8, hallway(t)) + WASH('rgba(255,255,255,.2)') + gentilHead(CX, 990, 250, { expr: 'forced', twitch: 1, crack: .5, band: 1 }, t) + (t > S ? gTape(CX - 190, 1090, .85, -35) + gTape(CX + 190, 1090, .85, 35) : '') +
    funBox(CX, 1080, 480, 170, t, S + .2, { label: 'sourire.exe' }) + funTag(CX, 430, 'NE PAS DÉRANGER', t, at(18, 'jamais') - .05, { size: 50, bg: SX.cool, fg: SX.ink }); },
  sfx: [[at(18, 'souris'), 'squeak', .6], [at(18, 'souris') + .1, 'snip', .4], [at(18, 'jamais') - .05, 'pop', .5], [at(18, 'compt'), 'glint', .5]] });
// B019 — « À 16 ans, tes amis organisent une sortie » : chambre, le groupe WhatsApp explose de messages
B(19, { enter: 'whip', cam: camHand(1.05, .4),
  draw: (t, d, T) => { const O = at(19, 'organisent'); const scr = rect(-150, -295, 300, 70, SX.acc, 24, 0) + ftext(0, -250, 'LES POTES 🔥', { size: 28, fill: '#fff', stroke: 'none' }) + gMsg(-10, -170, 'SORTIE SAMEDI !!', t, O - .2) + gMsg(10, -80, 'resto + soirée 🎉', t, O + .05) + gMsg(-10, 10, 'tout le monde vient', t, O + .3) + gMsg(0, 100, '@toi tu viens ?', t, O + .55, 1);
    return chambreG(t) + gentil({ x: 280, y: 1530, s: 1.2, expr: 'worried', armR: [-40, -60] }, t) + gPhone(720, 800, 1.15, 6 + wave(t, 1, 2), scr) + funTag(280, 440, '16 ANS', t, at(19, '16') - .05, { size: 70, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[at(19, '16') - .05, 'pop', .6], [at(19, 'organisent') - .2, 'vibrate', .5], [at(19, 'organisent') + .05, 'ding', .4], [at(19, 'organisent') + .3, 'ding', .4], [at(19, 'organisent') + .55, 'ding', .5]] });
// B020 — « Tu n'as pas envie d'y aller. Tu dis oui. » : bulle de pensée (toi en pyjama sous la couette) qui éclate sur « oui »
B(20, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const O = at(20, 'oui'); const inner = G(tr(0, 30), rect(-170, -40, 340, 120, '#5b8fd8', 30, 6) + gentilHead(-90, -30, 60, { expr: 'zen', halo: false }, t) + ftext(80, 10, 'Zzz', { size: 40, fill: '#fff' }));
    return salonF(t) + gentil({ x: CX + 120, y: 1500, s: 1.35, expr: t > O ? 'forced' : 'sad', armR: t > O ? [-60, -100] : [70, 80], twitch: t > O }, t) + (t < O ? G(tr(330, 640, pop(t, .2, .3)), cloud(0, 0, 2.2, '#fff') + inner) + circ(470, 820, 26, '#fff', 5) + circ(520, 880, 16, '#fff', 4) + funTag(330, 470, 'NON MERCI', t, at(20, 'envie'), { size: 44, bg: '#ff8fb1', fg: SX.ink }) : burst(330, 640, 200, t, O, '#fff', 14) + kword('OUI !', 330, 640, t, O - .02, { size: 110, fill: SX.acc2 })); },
  sfx: [[.2, 'pop_hi', .4], [at(20, 'envie'), 'hmm', .5], [at(20, 'oui') - .02, 'pop', .8], [at(20, 'oui') + .1, 'boing', .5]] });
// B021 — « Tu détestes le restaurant » : resto en briques, une pieuvre vivante dans ton assiette ; tu souris, vert de dégoût
B(21, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { let tent = ''; for (let i = 0; i < 6; i++) tent += path(`M${-60 + i * 24} -10Q${-90 + i * 36 + Math.sin(t * 8 + i) * 30} ${-70 - (i % 2) * 30} ${-70 + i * 30 + Math.sin(t * 9 + i) * 40} ${-120 - (i % 3) * 20}`, 'none', 18, '#e86a8a');
    return restoT(t, { diners: false }) + kid(1, { x: 180, y: 1340, s: 1.0, expr: 'laugh' }, t) + kid(3, { x: 900, y: 1340, s: 1.0, expr: 'laugh', flip: 1 }, t) + gentil({ x: CX, y: 1330, s: 1.15, expr: 'forced', skin: '#c8e6a8', twitch: 1 }, t) +
      G(tr(CX, 1240), rect(-480, 0, 960, 40, '#fff', 8, 6) + ell(0, 0, 150, 34, '#fff', 6) + tent + ell(0, -20, 70, 50, '#e86a8a', 6) + circ(-24, -30, 14, '#fff', 4) + circ(24, -30, 14, '#fff', 4) + circ(-24 + Math.sin(t * 5) * 4, -30, 6, OL, 0) + circ(24 + Math.sin(t * 5) * 4, -30, 6, OL, 0)) +
      cross(880, 470, .5, t, at(21, 'restaurant')) + funTag(CX - 80, 470, 'LE RESTO', t, at(21, 'restaurant') - .1, { size: 54, bg: '#ff8fb1', fg: SX.ink }); },
  sfx: [[0, 'sizzle', .5], [.2, 'squeak', .5], [at(21, 'detestes'), 'gulp', .6], [at(21, 'restaurant'), 'error_beep', .5]] });
// B022 — « Tu détestes la musique » : enceintes géantes, cheveux soufflés, notes qui t'agressent
B(22, { enter: 'punch', cam: (t, d) => ({ z: 1.06, shake: 4 + 3 * Math.sin(t * 30) }),
  draw: (t, d, T) => partyT(t, { dancers: false }) + dSpeaker(150, 1300, 1.5, t) + dSpeaker(930, 1300, 1.5, t) + gNotes(t, CX, 1000, 7) + gentilHead(CX, 880, 210, { expr: 'pain', twitch: 1, crack: .5, band: 1 }, t) + motionLines(CX - 300, 860, 4, 90, 0, '#fff') + motionLines(CX + 300, 860, 4, 90, 180, '#fff') +
    cross(880, 470, .5, t, at(22, 'musique')) + funTag(CX - 80, 470, 'LA MUSIQUE', t, at(22, 'musique') - .1, { size: 54, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'drum', .7], [.2, 'buzz', .4], [at(22, 'detestes'), 'wind', .5], [at(22, 'musique'), 'error_beep', .5]] });
// B023 — « Tu détestes la soirée » : soirée qui danse, toi seul dans le coin à côté de la plante, verre à la main
B(23, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => partyT(t) + DIMR(.1) + dPot(980, 1330, 1.6, t, 1) + gentil({ x: 800, y: 1500, s: 1.25, expr: 'forced', holdR: gCups(0, 0, .8), armR: [-40, -100], twitch: 1, crack: .5, band: 1 }, t) + funBox(800, 960, 260, 300, t, .3, { label: 'toi.png' }) +
    cross(300, 470, .5, t, at(23, 'soiree')) + funTag(CX + 60, 470, 'LA SOIRÉE', t, at(23, 'soiree') - .1, { size: 54, bg: SX.cool, fg: SX.ink }),
  sfx: [[0, 'drum', .4], [.25, 'crickets', .5], [at(23, 'soiree'), 'error_beep', .5], [.9, 'tick', .4]] });
// B024 — « Mais quand on te demande : ça te plaît ? » : une amie te tend le micro comme à la télé
B(24, { enter: 'none', trans: 'push', transD: .25, cam: camHand(1.06, .5),
  draw: (t, d, T) => { const P = at(24, 'ca'); return partyT(t) + WASH('rgba(30,10,50,.25)') + kid(4, { x: 280, y: 1500, s: 1.3, expr: 'joy', armR: [-10, 0], holdR: G(tr(30, 0, 1, 90), rect(-14, -10, 28, 90, '#3a3f4a', 8, 4) + circ(0, -24, 30, '#9aa3ad', 5)) }, t) +
    gentil({ x: 780, y: 1500, s: 1.35, expr: 'scared', flip: 1, crack: .5, band: 1 }, t) + sweatSpray(780, 1000, t) + funTag(CX, 450, 'ÇA TE PLAÎT ?', t, P - .05, { size: 64, bg: '#fff', fg: SX.ink }); },
  sfx: [[at(24, 'demande'), 'pop', .5], [at(24, 'ca') - .05, 'boing', .6], [.6, 'heartbeat', .6]] });
// B025 — « Tu réponds… » : très gros plan sur les yeux, suspense (battements)
B(25, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.15, 1.25, t / d) }),
  draw: (t, d, T) => gridBg('#160d24') + glow(CX, 900, 500, '#ff8fb1', .25) + gentilHead(CX, 880, 250, { expr: 'scared', look: [.4, 0], crack: .5, band: 1 }, t) + sweatSpray(CX, 780, t, 4),
  sfx: [[0, 'heartbeat', .8], [at(25, 'reponds'), 'gulp', .7]] });
// B026 — « Oui, grave ! » : pouce levé, yeux étoiles… et l'œil qui tique
B(26, { enter: 'punch', flash: 1, cam: zin(1.05, 1.1),
  draw: (t, d, T) => partyT(t, { dancers: false }) + burst(CX, 560, 330, t, at(26, 'oui') - .05, SX.acc2, 16) + gentil({ x: CX, y: 1500, s: 1.4, expr: 'wow', face: { mouth: 'perfect' }, armR: [-40, -75], twitch: 1, crack: .5, band: 1 }, t) + kword('OUI, GRAVE !', CX, 560, t, at(26, 'oui') - .05, { size: 92, fill: '#fff', puff: false }) + confetti(t, at(26, 'grave'), 30) + popStars(CX, 900, t, at(26, 'grave'), 7, 300),
  sfx: [[at(26, 'oui') - .05, 'boom', .6], [at(26, 'grave'), 'tada', .6], [at(26, 'grave') + .2, 'sparkle', .5]] });
// B027 — « Magnifique. » : applaudissements lents, MAGNIFIQUE ironique sur papier
B(27, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1, 1.05, t / d) }),
  draw: (t, d, T) => paper(SX.paper) + gobo(T, .1) + gHands(CX, 980, 1.3, t, .1) + kword('MAGNIFIQUE.', CX, 560, t, at(27, 'magnifique') - .05, { size: 108, fill: SX.acc2 }) + markerText('(non)', CX + 260, 720, t, at(27, 'magnifique') + .3, { size: 52, col: SX.acc }),
  sfx: [[at(27, 'magnifique') - .05, 'flash_hit', .5], [.1, 'thud', .5], [.55, 'thud', .5], [at(27, 'magnifique') + .3, 'scratch', .4]] });
// B028 — « Tu es devenu un figurant dans ta propre vie » : plateau de tournage, tes potes sous le projo… toi déguisé en buisson au fond
B(28, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const F = at(28, 'figurant'); return filmSet(t) + glow(CX - 120, 1000, 380, '#fff6c8', .4) + kid(1, { x: 300, y: 1360, s: 1.15, expr: 'laugh', armL: [200, 230] }, t) + kid(3, { x: 540, y: 1360, s: 1.15, expr: 'joy', armR: [-30, -60] }, t) +
    gBush(860, 1080, .75, t) + gentilHead(860, 960, 80, { expr: 'forced', crack: .5, band: 1 }, t) + funTag(860, 760, 'FIGURANT N°7', t, F - .05, { size: 38, bg: '#fff', fg: SX.ink }) + gClap(250, 760, .7, t, .05) + blur(8, camTripod(120, 1640, 1.0)) +
    kthin('dans ta propre vie', CX, 430, t, at(28, 'dans') - .1, { size: 54 }); },
  sfx: [[.05, 'snip', .7], [.2, 'drum', .3], [at(28, 'figurant') - .05, 'pop', .6], [at(28, 'propre'), 'hmm', .4]] });
// B029 — « Puis un jour, Kevin te demande de faire son exposé » : couloir à casiers, Kevin (lunettes noires) te largue son dossier
B(29, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const E = at(29, 'expose'), k = eOutCubic(seg(t, E - .4, E)); return hallway(t) + WASH() + kevin({ x: 780, y: 1500, s: 1.35, expr: 'cool', flip: 1, armR: [-10, 0] }, t) + gentil({ x: 320, y: 1500, s: 1.35, expr: 'worried', armL: [20, -60], armR: [160, 240] }, t) +
    gPile(330, 1400, 4, t, 2) + gFolder(lerp(620, 360, k), lerp(980, 1250, k) - Math.sin(k * 3.14) * 120, .7, lerp(20, -6, k)) + funTag(780, 440, 'KEVIN', t, at(29, 'kevin'), { size: 46, bg: '#5fb85f' }) + funTag(CX - 60, 560, 'SON EXPOSÉ', t, E - .05, { size: 54, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'steps', .5], [at(29, 'kevin'), 'pop', .5], [at(29, 'expose') - .4, 'whoosh', .5], [at(29, 'expose'), 'thud', .7]] });
// B030 — « Tu es déjà débordé » : tour de dossiers jusqu'au plafond, horloge qui s'affole
B(30, { enter: 'drop', cam: (t, d) => ({ z: 1.04, shake: 3, cy: 900 }),
  draw: (t, d, T) => hallway(t) + DIMR(.12) + gPile(CX, 1250, 30, t, 5) + gentilHead(CX, 960, 120, { expr: 'panic', crack: .5, band: 1 }, t) + G(tr(CX - 210, 1030), ell(0, 0, 30, 30, SKIN, 5)) + G(tr(CX + 210, 1000), ell(0, 0, 30, 30, SKIN, 5)) + G(tr(860, 480), circ(0, 0, 90, '#fff', 6) + G(`rotate(${f1(t * 900)})`, line(0, 0, 0, -70, 6, SX.acc)) + G(`rotate(${f1(t * 90)})`, line(0, 0, 0, -50, 8))) + funTag(330, 480, 'DÉBORDÉ', t, at(30, 'deborde') - .05, { size: 60, bg: '#e2463a' }),
  sfx: [[0, 'thud', .7], [.05, 'clock_fast', .6], [at(30, 'deborde') - .05, 'pop', .6], [.7, 'flutter', .4]] });
// B031 — « Alors, pour la première fois, tu dis NON » : contre-plongée héroïque, cape au vent, « débloqué » sur NON
B(31, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(31, 'non') && t < at(31, 'non') + .3 ? 8 : 0 }),
  draw: (t, d, T) => { const N = at(31, 'non'); return rays(t, CX, 900, SX.acc, '#5fd8e2', 24) + unlock(CX, 760, t, N, { part: 'back', r: 520 }) + gCape(CX, 1010, 1.2, t) + gentil({ x: CX, y: 1560, s: 1.5, expr: t > N ? 'effort' : 'worried', face: t > N ? { mouth: 'grin' } : {}, armL: [140, 160], armR: [-45, -75], crack: .5, band: 1 }, t) + unlock(CX, 760, t, N, { part: 'front', r: 520 }) +
    kthin('pour la première fois', CX, 380, t, at(31, 'premiere') - .1, { size: 54 }) + kword('NON.', CX, 520, t, N - .03, { size: 170, fill: '#fff' }); },
  sfx: [[0, 'wind', .5], [at(31, 'premiere') - .1, 'whoosh_up', .5], [at(31, 'non') - .03, 'boom', .8], [at(31, 'non') + .05, 'sparkle', .6]] });
// B032 — « Silence. » : couloir figé en gris, virevoltant, criquets
B(32, { enter: 'none', cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => hallway(t) + op(.45, rect(-M, -M, W + 2 * M, H + 2 * M, '#8a8f99', 0, 0)) + kevin({ x: 780, y: 1500, s: 1.35, expr: 'shock', flip: 1 }, t) + gentil({ x: 320, y: 1500, s: 1.35, expr: 'deadpan', crack: .5, band: 1 }, t) + gTumble(lerp(-100, 1180, t / .6), 1220 - Math.abs(Math.sin(t * 8)) * 60, 1, t) + kthin('silence.', CX, 460, t, at(32, 'silence') - .05, { size: 60 }),
  sfx: [[0, 'crickets', .7], [.1, 'wind', .4]] });
// B033 — « Il te regarde. » : Kevin, yeux plissés, zoom lent dramatique
B(33, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.05, 1.18, t / d) }),
  draw: (t, d, T) => blur(8, hallway(t)) + DIMR(.35) + kevinHead(CX, 880, 210, { expr: 'suspicious', face: { eyes: 'squint' } }, t),
  sfx: [[0, 'whoosh', .5], [at(33, 'regarde'), 'sting', .6]] });
// B034 — « Frère, t'as changé. » : Kevin outré, main sur le cœur, larmes de théâtre
B(34, { enter: 'whip', cam: camHand(1.06, .5),
  draw: (t, d, T) => hallway(t) + WASH() + rays(t, 780, 900, 'rgba(255,143,177,.25)', 'rgba(255,255,255,0)', 16) + kevin({ x: 780, y: 1500, s: 1.4, expr: 'cry', flip: 1, armR: [160, 200], headTilt: 10 }, t) + gentil({ x: 300, y: 1500, s: 1.3, expr: 'confused', crack: .5, band: 1 }, t) + funTag(780, 460, "T'AS CHANGÉ", t, at(34, 'change') - .05, { size: 60, bg: SX.cool, fg: SX.ink }),
  sfx: [[at(34, 'frere'), 'gasp', .6], [at(34, 'change') - .05, 'sting', .6], [.6, 'ghost', .3]] });
// B035 — « Ah bon ? J'ai développé une colonne vertébrale ? » : radio X qui révèle une colonne qui pousse vertèbre par vertèbre
B(35, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const C = at(35, 'colonne'), k = seg(t, C - .2, at(35, 'vertebrale') + .3); const xray = rect(-200, -330, 400, 660, '#0f2a44', 18, 0) + op(.35, gentil({ x: 0, y: 300, s: 1.1, expr: 'neutral', halo: false, heartShirt: false, shirt: '#5aa0d0', pants: '#5aa0d0', skin: '#6fb0e0' }, t)) + gSpine(0, 40, .9, k, t);
    return hallway(t) + WASH() + gentil({ x: 280, y: 1500, s: 1.35, expr: t > C ? 'smugger' : 'confused', crack: .5, band: 1 }, t) + card(780, 880, 420, 700, xray, t, .1, { ry: 0, thick: 10, bw: 7, bg: '#0f2a44' }) +
      funTag(CX, 440, 'COLONNE VERTÉBRALE', t, C - .05, { size: 46, bg: SX.acc2, fg: SX.ink }) + (k > .9 ? popStars(780, 880, t, at(35, 'vertebrale') + .3, 7, 260) : ''); },
  sfx: [[at(35, 'ah'), 'hmm', .5], [.1, 'pop_hi', .4], [at(35, 'colonne') - .2, 'magic', .6], [at(35, 'colonne'), 'zap', .4], [at(35, 'vertebrale') + .3, 'tada', .5]] });
// B036a — « Le lendemain, il raconte à tout le monde » : cour d'école, Kevin au mégaphone sur un banc, la foule s'attroupe
B(36, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { let crowd = ''; for (let i = 0; i < 5; i++) crowd += kid(i + 1, { x: 120 + i * 210 + (i === 2 ? 40 : 0), y: 1430, s: .95, expr: ['shock', 'wow', 'shock', 'talk', 'wow'][i], flip: i > 2, look: [0, -1] }, t);
    return schoolyard(t) + kevin({ x: CX, y: 1260, s: 1.2, expr: 'angry', armR: [-50, -40], holdR: gMegaphone(0, 0, .6, -20) }, t) + G(tr(CX, 1260), dBench(0, 0, 1)) + crowd + funTag(CX, 430, 'LE LENDEMAIN', t, .05, { size: 50, bg: SX.acc2, fg: SX.ink }) + motionLines(CX + 260, 760, 4, 80, -20, '#fff'); },
  sfx: [[0, 'school_bell', .4], [.05, 'pop', .5], [at(36, 'raconte'), 'buzz', .5], [at(36, 'monde'), 'steps', .5]] });
// B036b — « que tu es devenu égoïste » : affiche AVIS ÉGOÏSTE avec ta tête, la foule halète
B(36, { enter: 'crash', flash: 1, cam: () => ({ z: 1.05, shake: 3 }),
  draw: (t, d, T) => { const E = at(36, 'egoiste') - at(36, 'que') + .15; return hallway(t) + WASH() + gWanted(CX, 830, 1.05, t, gentilHead(0, 0, 100, { expr: 'shock', crack: .7, band: 1 }, t)) + stamp(CX, 1080, 'ÉGOÏSTE', t, E - .05) +
    kid(2, { x: 140, y: 1440, s: 1.0, expr: 'terror', armR: [-60, -40] }, t) + kid(5, { x: 940, y: 1440, s: 1.0, expr: 'jawdrop', flip: 1 }, t); },
  sfx: [[0, 'flash_hit', .5], [at(36, 'egoiste') - at(36, 'que') + .1, 'thud', .8], [at(36, 'egoiste') - at(36, 'que') + .2, 'gasp', .6], [at(36, 'egoiste') - at(36, 'que') + .3, 'crack', .5]] }, at(36, 'que') - .15);
// B037 — « Et tu culpabilises » : chambre de nuit, nuage d'orage (avec la tête de Kevin) qui te pleut dessus
B(37, { enter: 'drop', cam: () => ({ z: 1.05, hand: .3 }),
  draw: (t, d, T) => bedroomN(t) + gentil({ x: 400, y: 1500, s: 1.35, expr: 'sob', crack: .7, band: 1, haloDim: .6 }, t) + gStormCloud(400, 560, 1.1, t, kevinHead(0, 10, 50, { expr: 'mock' }, t)) + funTag(820, 460, 'CULPABILITÉ', t, at(37, 'culpabilises') - .05, { size: 46, bg: '#8a6ad8' }),
  sfx: [[0, 'thunder', .6], [.1, 'wind', .4], [at(37, 'culpabilises') - .05, 'pop', .5]] });
// B038 — « Tu envisages même de t'excuser » : bureau de nuit, lettre PARDON à cœurs, boules de papier, brouillons de SMS
B(38, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const X = at(38, 'excuser'); let balls = ''; for (let i = 0; i < 4; i++) { const k = ((t * 1.4 + i * .25) % 1); balls += G(tr(lerp(560, 960, k), 1000 - Math.sin(k * 3.14) * 360 + k * 230, .9, k * 400), circ(0, 0, 34, '#fff', 5) + path('M-20 -10l20 14l14 -20', 'none', 3, '#9aa')); }
    const scr = rect(-150, -295, 300, 70, '#5b8fd8', 24, 0) + ftext(0, -250, 'Kevin', { size: 30, fill: '#fff', stroke: 'none' }) + gMsg(0, -150, 'dsl frère…', t, .2, 1) + gMsg(0, -60, 'vraiment dsl 🙏', t, .6, 1) + gMsg(0, 30, 'je ferai ton expo', t, X, 1, 270);
    return bedroomN(t, 1) + gentil({ x: 330, y: 1500, s: 1.3, expr: 'worried', armR: [-20, 10], crack: .7, band: 1, haloDim: .5 }, t) + deskFront(400, 1280, 1.1) + dDeskLamp(600, 1260, .8, t) + G(tr(470, 1250, 1, -4), rect(-110, -70, 220, 70, '#fff', 6, 5) + ftext(0, -20, 'PARDON', { size: 34, fill: '#e2463a', stroke: 'none', font: SX.marker }) + heart(80, -50, .4)) + dBin(980, 1260, .8) + balls + gPhone(800, 760, .95, -6, scr) + funTag(330, 440, "T'EXCUSER ?", t, X - .05, { size: 54, bg: SX.cool, fg: SX.ink }); },
  sfx: [[.2, 'typing', .5], [.4, 'pop', .4], [at(38, 'meme'), 'scratch', .4], [at(38, 'excuser') - .05, 'pop', .6], [at(38, 'excuser') + .2, 'ding', .4]] });
// B039 — « Puis tu réalises quelque chose » : ampoule qui s'allume, « débloqué » en étoiles
B(39, { enter: 'punch', cam: zin(1.04, 1.1),
  draw: (t, d, T) => { const Rz = at(39, 'realises'); return bedroomN(t) + DIMR(t > Rz ? 0 : .25) + unlock(CX, 560, t, Rz, { part: 'back', r: 460 }) + gentil({ x: CX, y: 1500, s: 1.4, expr: t > Rz ? 'wow' : 'sad', crack: .7, band: 1, haloDim: t > Rz ? 0 : .5 }, t) + gBulb(CX, 560 - 30, 1.0, t > Rz, t) + unlock(CX, 560, t, Rz, { part: 'front', r: 460 }) + kthin('quelque chose…', CX, 400, t, at(39, 'quelque') - .05, { size: 54 }); },
  sfx: [[0, 'hmm', .4], [at(39, 'realises'), 'ding', .8], [at(39, 'realises') + .05, 'magic', .6], [at(39, 'chose'), 'sparkle', .5]] });
// B040 — « Kevin ne s'est jamais plaint quand tu disais oui » : 4 cartes OUI (20 €, jouet, contrôle, exposé), Kevin aux anges
B(40, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1, 1.05, t / d) }),
  draw: (t, d, T) => { const icons = [bill(0, 0, .7), gRobot(0, 40, .5, t), gTest(0, 0, .3, -6, '16/20', '', 1, 0), gFolder(0, 0, .38, 0)], O = at(40, 'oui'); let s = paper('#e9f8f9') + gobo(T, .1);
    for (let i = 0; i < 4; i++) { const t0 = .25 + i * .25, a = R(-150 + i * 40), x = CX + Math.cos(a) * 360, y = 980 + Math.sin(a) * 300; s += card(x, y, 200, 190, icons[i], t, t0, { ry: 0, thick: 8, r: (i - 1.5) * 8, bw: 6 }) + funTag(x, y + 120, 'OUI ✓', t, t0 + .2, { size: 30, bg: '#7be07b', fg: SX.ink, r: (i - 1.5) * 8 }); }
    return s + cutout(kevinHead(CX, 1060, 150, { expr: 'ecstatic' }, t), 10) + heartsUp(t, CX, 900, 5) + kthin('jamais plaint quand tu disais', CX, 380, t, at(40, 'jamais') - .1, { size: 48 }) + kword('OUI', CX, 500, t, O - .05, { size: 120, fill: '#7be07b' }); },
  sfx: [[.25, 'pop', .5], [.5, 'pop', .5], [.75, 'pop', .5], [1.0, 'pop', .5], [at(40, 'oui') - .05, 'kaching', .6]] });
// B041 — « Seulement quand tu as commencé à dire non » : la carte NON tombe, Kevin explose (gyrophare rouge)
B(41, { enter: 'crash', cam: (t, d) => ({ z: 1.06, shake: t > at(41, 'non') ? 7 : 2 }),
  draw: (t, d, T) => { const N = at(41, 'non'), al = t > N && Math.sin(t * 14) > 0; return hallway(t) + (al ? op(.25, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff2a2a', 0, 0)) : '') + kevin({ x: 760, y: 1500, s: 1.4, expr: t > N ? 'rage' : 'suspicious', flip: 1, armL: [230, 250], armR: [-50, -70] }, t) +
    card(280, 900, 300, 220, ftext(0, 34, 'NON', { size: 100, fill: '#e2463a', stroke: 'none' }), t, N - .15, { ry: 0, thick: 10, r: -8, bw: 7 }) + kthin('seulement quand tu as commencé', CX, 400, t, 0, { size: 46 }) + G(tr(280, 640), circ(0, 0, 50, al ? '#ff4d4d' : '#9a2a2a', 6) + rect(-60, 40, 120, 30, '#3a3f4a', 8, 5)); },
  sfx: [[0, 'whoosh', .4], [at(41, 'non') - .15, 'thud', .7], [at(41, 'non'), 'siren', .5], [at(41, 'non') + .1, 'growl', .6]] });
// B042 — « Alors tu gardes ta réponse » : pancarte NON tenue à deux mains, Kevin tire dessus, ça ne bouge pas
B(42, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const tug = Math.sin(t * 18) * 8 * seg(t, .3, .5); return streetT(t, 2) + WASH() + gentil({ x: 330, y: 1500, s: 1.35, expr: 'cool', armR: [-40, -70], crack: .7, band: 1 }, t) + gSign(560, 760, .85, 4, 'NON.') +
    kevin({ x: 870 + tug, y: 1500, s: 1.3, expr: 'effort', flip: 1, armL: [0, 5], armR: [-10, 0], rot: -8 }, t) + motionLines(720, 900, 3, 50, 0) + funTag(330, 430, 'RÉPONSE GARDÉE', t, at(42, 'gardes') - .05, { size: 46, bg: SX.acc, fg: '#fff' }); },
  sfx: [[.3, 'squeak', .6], [at(42, 'gardes') - .05, 'pop', .6], [at(42, 'reponse'), 'glint', .6], [.9, 'thud', .5]] });
// B043a — « Et pour une fois, tu rentres chez toi » : rue au coucher de soleil, tu marches, chill de ouf, oiseaux
B(43, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: 1.04, hand: .3 }),
  draw: (t, d, T) => depth({ zoom: 1, x: -t * 60 }, [{ z: 1.5, svg: streetT(t, 3) + SUNSET(), haze: .05 }, { z: 1, svg: gentil({ x: 420 + t * 60, y: 1500, s: 1.35, expr: 'chill', walk: 3, crack: .7, band: 1 }, t) + heartsUp(t, 420 + t * 60, 900, 3) }, { z: .6, svg: blur(10, dPot(980, 1900, 2, t, 0)) }]) + funTag(CX, 430, 'POUR UNE FOIS', t, at(43, 'fois') - .05, { size: 56, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'steps', .5], [.2, 'chirp', .5], [at(43, 'fois') - .05, 'pop', .5], [at(43, 'rentres'), 'whistle', .4]] });
// B043b — « …sans devoir régler le problème de quelqu'un d'autre » : affalé dans le canapé (zen), Kevin tape à la fenêtre avec son carton PROBLÈME
B(43, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const P = at(43, 'probleme') - at(43, 'sans') + .15, knock = Math.abs(Math.sin(t * 9)) * 10; return salonF(t, { noSofa: false }) + G(tr(860, 520), kevinHead(0, -20, 70, { expr: 'angry' }, t) + G(tr(0, 60 + knock * .3), rect(-90, -20, 180, 80, '#d9a86c', 6, 5) + ftext(0, 32, 'PROBLÈME', { size: 26, fill: '#7a4a2a', stroke: 'none' }))) +
    gentil({ x: CX - 60, y: 1300, s: 1.25, expr: 'zen', armL: [200, 240], armR: [-20, -60], legL: [20, 0], legR: [10, 0], rot: -10 }, t) + funBox(860, 540, 260, 200, t, P, { label: 'probleme_de_kevin.zip', col: '#e2463a' }) + cross(860, 540, .6, t, P + .4) + ftext(CX - 220, 760, 'Zzz', { size: 60, fill: '#fff' }); },
  sfx: [[0, 'thud', .5], [.3, 'thud', .5], [.6, 'thud', .5], [at(43, 'probleme') - at(43, 'sans') + .15, 'pop', .6], [at(43, 'probleme') - at(43, 'sans') + .55, 'error_beep', .4]] }, at(43, 'sans') - .15);
// B044 — « Parce que le pire, quand tu es trop gentil, c'est que certaines personnes… » : ombres aux mains crochues qui se rapprochent de l'auréole
B(44, { enter: 'none', trans: 'glitch', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const C = at(44, 'certaines'), cl = seg(t, 0, d); let sh = ''; for (let i = 0; i < 4; i++) { const sd = i % 2 ? 1 : -1, x = CX + sd * (520 - 200 * cl) + sd * Math.floor(i / 2) * 130, y = 1200 - Math.floor(i / 2) * 60; sh += G(tr(x, y, 1.1 - Math.floor(i / 2) * .15), ell(0, 0, 130, 180, '#0d0820', 0) + circ(0, -230, 95, '#0d0820', 0) + (t > C ? circ(-30, -240, 12, '#ffd23f', 0) + circ(30, -240, 12, '#ffd23f', 0) : '') + G(tr(-sd * 120, -120, 1, -sd * 40), rect(-16, -110, 32, 130, '#0d0820', 16, 0) + circ(0, -110, 34, '#0d0820', 0))); }
    return gridBg('#1a1430') + halftoneFade(SX.acc, .06, 1) + glow(CX, 900, 420, '#fff3a0', .35) + gentil({ x: CX, y: 1500, s: 1.35, expr: t > C ? 'scared' : 'happy', crack: .7, band: 1 }, t) + sh +
      kthin('le pire, quand tu es', CX, 360, t, at(44, 'pire') - .1, { size: 54 }) + kword('TROP GENTIL', CX, 480, t, at(44, 'gentil') - .05, { size: 92, fill: SX.acc2 }) + kthin('certaines personnes…', CX, 620, t, C - .05, { size: 48, fill: '#ffb3c8' }); },
  sfx: [[at(44, 'pire'), 'ghost', .5], [at(44, 'gentil') - .05, 'boom', .5], [at(44, 'certaines'), 'growl', .5], [at(44, 'personnes'), 'sting', .5]] });
// B045a — « ne remarquent ta gentillesse » : Kevin à la loupe découvre ton auréole qui brille
B(45, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Gt = at(45, 'gentillesse'); return streetT(t, 2) + WASH() + gentil({ x: 330, y: 1500, s: 1.35, expr: 'calm', crack: 0 }, t) + glow(330, 780, 220, '#fff3a0', .5) + kevin({ x: 800, y: 1500, s: 1.35, expr: 'wow', flip: 1, armR: [-20, -30], holdR: magnifier(0, 0, .7, 0) }, t) +
    kword('GENTILLESSE', CX, 470, t, Gt - .05, { size: 90, fill: SX.acc2 }) + (t > Gt ? popStars(330, 780, t, Gt, 6, 150) : ''); },
  sfx: [[0, 'whoosh', .4], [at(45, 'remarquent'), 'glint', .6], [at(45, 'gentillesse') - .05, 'magic', .6], [at(45, 'gentillesse') + .2, 'sparkle', .5]] });
// B045b — FIN : « …que le jour où elles ne peuvent plus en profiter » : le GENTI-MATIC est HORS SERVICE, Kevin le tape ; toi, chill au sommet, auréole réparée
B(45, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: Math.abs(Math.sin(t * 6)) > .9 ? 5 : 0 }),
  draw: (t, d, T) => { const off = at(45, 'jour') - .15, P = at(45, 'profiter') - off, kick = Math.max(0, Math.sin(t * 6)); return rays(t, CX, 900, '#ffe9a6', '#ffd76b', 26) + gMachine(680, 1250, .9, t, 1) + gentilHead(680, 640, 100, { expr: 'chill' }, t) +
    kevin({ x: 260, y: 1500, s: 1.25, expr: 'rage', legR: [10 - kick * 60, 0], armL: [200, 230], armR: [-20, -10] }, t) + (kick > .9 ? impactStar(470, 1290, .6) : '') + G(tr(470, 1150), ftext(0, 0, kick > .9 ? 'PAF' : '', { size: 50, fill: SX.acc2 })) +
    kthin('le jour où elles ne peuvent', CX, 330, t, at(45, 'jour') - off - .05, { size: 54 }) + kword('PLUS EN PROFITER.', CX, 450, t, P - .05, { size: 74, fill: SX.acc2 }) + (t > P ? confetti(t, P, 40) + popStars(680, 600, t, P, 8, 260) : ''); },
  sfx: [[0, 'flash_hit', .5], [.26, 'thud', .7], [1.31, 'thud', .7], [at(45, 'peuvent') - at(45, 'jour') + .15, 'error_beep', .5], [at(45, 'profiter') - at(45, 'jour') + .1, 'tada', .7], [at(45, 'profiter') - at(45, 'jour') + .6, 'rimshot', .5]] }, at(45, 'jour') - .15);

SCENES.sort((a, b) => a.s - b.s);
