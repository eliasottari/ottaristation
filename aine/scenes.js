// ============================================================
//  « Pourquoi c'est horrible d'être le dernier de la famille ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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

// ---------- aides (reprises de dernier/) ----------
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

sxFun('#2fa3ff'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';
const M = 700;

// ---------- figurants + bibliothèque de décors (reprise de dernier/ et tache/, préfixe d) ----------
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
function galleryT(t) { let s = grad('#f4ecdf', '#e9dcc6', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 60, W + 2 * M, 20, '#d8c6a6', 0, 0);
  for (let i = 0; i < 6; i++) s += rect(-150 + i * 260, 120, 220, 1040, 'none', 6, 4, '#e0cfb2');
  for (let i = 0; i < 5; i++) { const x = 100 + i * 220; s += line(x, 60, x, 100, 5) + G(tr(x, 100, 1, 20 * Math.sin(t * .8 + i)), rect(-20, 0, 40, 46, '#3a3a44', 8, 4)); }
  s += rect(-M, 1180, W + 2 * M, 80, '#c9b08a', 0, 0); for (let i = 0; i < 3; i++) s += op(.25 + .05 * Math.sin(t * 2 + i), path(`M${200 + i * 340} 140L${80 + i * 340} 1200L${320 + i * 340} 1200Z`, '#fff6c8', 0));
  s += G(tr(1050, 280, 1, -25 + 25 * Math.sin(t * .9)), rect(-30, -20, 60, 40, '#ddd', 6, 4) + circ(-30, 0, 10, '#e2463a', 0)) + line(1050, 240, 1080, 200, 5);
  s += [300, 780].map(x => rect(x - 70, 1196, 140, 40, '#fff8e0', 4, 3) + line(x - 50, 1210, x + 40, 1210, 3, '#9a8a7a') + line(x - 50, 1224, x + 20, 1224, 3, '#9a8a7a')).join('');
  s += rect(-M, 1260, W + 2 * M, 900, '#a0703f', 0, 0) + Array.from({ length: 12 }, (_, i) => line(-M + i * 220, 1260, -M + i * 220 - 120, H + M, 5, '#8a5c30')).join('');
  for (let i = 0; i < 4; i++) { const x = 120 + i * 280; s += rect(x - 10, 1180, 20, 160, '#d9a441', 6, 4) + circ(x, 1176, 18, '#d9a441', 4) + (i < 3 ? path(`M${x} 1200Q${x + 140} 1270 ${x + 280} 1200`, 'none', 12, '#b8253a') : ''); }
  s += G(tr(1000, 1300), rect(-60, -200, 120, 200, '#fff', 4, 5) + circ(0, -250, 44, '#e8e2d8', 5) + path('M-40 -206Q0 -230 40 -206', '#e8e2d8', 5)) + dBench(CX, 1500, 1.1) + dPot(40, 1290, .9, t, 1) +
    op(.75, adult(4, { x: ((t * 50) % 1500) - 200, y: 1330, s: .55, expr: 'smug', walk: 2 }, t));
  return s; }

// ---------- accessoires propres à l'épisode ----------
const WASH = (c = 'rgba(255,255,255,.14)') => rect(-M, -M, W + 2 * M, H + 2 * M, c, 0, 0); // voile léger : décor moins saturé derrière les persos
function sofa(x, yb, s = 1, c = '#5ec4a0') { return G(tr(x, yb, s), rect(-330, -260, 660, 180, shade(c, -.12), 44, 6) + rect(-290, -235, 160, 115, '#ffd23f', 34, 5) + rect(-70, -225, 150, 105, '#fff', 34, 5) + rect(130, -232, 150, 112, '#e86a8a', 34, 5) + rect(-290, -125, 580, 95, c, 22, 6) + rect(-385, -160, 105, 160, c, 32, 6) + rect(280, -160, 105, 160, c, 32, 6) + rect(-340, -30, 34, 30, '#6b3e26', 4, 4) + rect(306, -30, 34, 30, '#6b3e26', 4, 4) + G(tr(-200, -150, 1, -10), rect(-60, -10, 120, 18, '#5b8fd8', 6, 4))); }
function crtTV(x, yb, s, t, on = 1, screen = '') { const fl = .85 + .15 * Math.sin(t * 40); return G(tr(x, yb, s), rect(-180, -130, 360, 130, '#8a5a3a', 10, 6) + line(-160, -66, 160, -66, 4, '#6b3e26') + circ(-80, -98, 7, OL, 0) + circ(80, -98, 7, OL, 0) +
  rect(-150, -410, 300, 280, '#c9c4b8', 34, 6) + rect(-132, -392, 214, 230, on ? `rgba(150,214,200,${fl})` : '#4a5a5a', 44, 5) + screen + [0, 1, 2, 3, 4, 5].map(i => line(-120, -370 + i * 36, 70, -370 + i * 36, 3, 'rgba(0,0,0,.08)')).join('') + circ(112, -350, 13, '#8a8478', 4) + circ(112, -305, 13, '#8a8478', 4) + rect(97, -250, 30, 60, '#8a8478', 4, 4) +
  line(-30, -410, -110, -500, 5) + line(30, -410, 110, -500, 5) + circ(-110, -500, 9, OL, 0) + circ(110, -500, 9, OL, 0) + ps2(0, -130, .55) + path('M-40 -10Q-90 60 -40 90', 'none', 5)); }
// vieille console noire « 2 » + manette filaire
const ps2 = (x, y, s = 1) => G(tr(x, y, s), rect(-130, -46, 260, 46, '#22232a', 8, 5) + line(-110, -30, 110, -30, 3, '#3a3c46') + line(-110, -16, 110, -16, 3, '#3a3c46') + circ(100, -24, 6, '#5ec4f0', 0) + ftext(-80, -12, '2', { size: 30, fill: '#9aa3ad', stroke: 'none' }));
const padOld = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-90 -20Q-100 50 -60 60Q-40 60 -30 30L30 30Q40 60 60 60Q100 50 90 -20Q80 -40 50 -40L-50 -40Q-80 -40 -90 -20Z', '#2b2c33', 5) + circ(-50, -5, 12, '#555', 3) + [[50, -18], [70, -2], [30, -2], [50, 14]].map(([a, b], i) => circ(a, b, 7, ['#7be07b', '#e2463a', '#5ec4f0', '#ff8fb1'][i], 3)).join(''));
const consoleNew = (x, y, s, t) => G(tr(x, y, s), glow(0, -120, 200, '#9fd6ff', .5) + path('M-60 0L-70 -260Q-40 -280 0 -270L0 0Z', '#fff', 6) + path('M0 0L0 -270Q40 -280 70 -260L60 0Z', '#e8eef5', 6) + rect(-8, -270, 16, 270, '#2b2c33', 4, 4) + line(-4, -250, -4, -20, 5, '#5ec4f0') + sparkle(80, -240, .5 + .2 * Math.sin(t * 9), '#fff') + sparkle(-90, -120, .35, '#ffd23f'));
function bikeOld(x, yb, s, t) { return G(tr(x, yb, s), dBike(0, 0, 1, '#8a6a4a') + [[-40, -110], [20, -118], [55, -80], [-15, -60], [5, -90]].map(([a, b]) => circ(a, b, 8, '#b8662e', 0)).join('') + path('M22 -50Q60 -40 80 -20', 'none', 3, '#ccc') + path('M-120 -50L-118 -10M-118 -10L-25 -50', 'none', 2, 'rgba(255,255,255,.8)') + ell(70, -4, 44, 14, '#555', 4) + G(tr(-20, -150), path('M-30 0L30 0M0 -30L0 30M-22 -22L22 22M22 -22L-22 22', 'none', 2, 'rgba(255,255,255,.85)') + circ(0, 0, 12, 'none', 2, 'rgba(255,255,255,.85)'))); }
function bikeNew(x, yb, s, t) { return G(tr(x, yb, s), dBike(0, 0, 1, '#e2463a') + sparkle(-60, -140, .4 + .2 * Math.sin(t * 8), '#fff') + sparkle(80, -100, .3 + .15 * Math.sin(t * 8 + 2), '#ffd23f') + path('M-90 -90L-60 -80', 'none', 6, 'rgba(255,255,255,.9)')); }
const diaper = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-60 -30L60 -30L40 20Q0 50 -40 20Z', '#fff', 5) + rect(-70, -40, 26, 22, '#5ec4f0', 6, 4) + rect(44, -40, 26, 22, '#5ec4f0', 6, 4) + circ(0, 0, 8, '#ffd23f', 0));
function diaperRain(t, t0, n = 14) { if (t < t0) return ''; let s = ''; for (let i = 0; i < n; i++) { const k = t - t0, x = (i * 173 + 60) % 1100, y = -100 + (k * (500 + (i % 4) * 120) + i * 90) % 1400; s += diaper(x, y, .7 + (i % 3) * .15, k * 120 * (i % 2 ? 1 : -1) + i * 30); } return s; }
const bananaPeel = (x, y, s = 1) => G(tr(x, y, s), path('M0 0Q-60 -10 -80 20Q-40 10 -10 5ZM0 0Q60 -10 80 22Q40 10 10 5ZM0 0Q-10 -50 10 -70Q10 -40 6 0Z', '#ffd23f', 5) + ell(0, 4, 26, 10, '#ffd23f', 5) + circ(10, -70, 5, '#6b4a2a', 0));
const nMedal = (x, y, s = 1, c = '#ffd23f') => G(tr(x, y, s), path('M-14 -50L0 -10L14 -50Z', '#e2463a', 4) + circ(0, 6, 22, c, 5) + ftext(0, 14, '★', { size: 22, fill: '#fff', stroke: 'none' }));
const bulb = (x, y, s, on) => G(tr(x, y, s), (on ? glow(0, 0, 160, '#fff6a0', .8) : '') + circ(0, -10, 60, on ? '#fff36b' : '#e8e8e8') + rect(-30, 45, 60, 40, '#9aa3ad', 8, 5) + line(-20, 62, 20, 62, 4) + path('M-16 0Q0 -30 16 0', 'none', 5, on ? '#ff9a3c' : '#bbb'));
const hardHat = (x, y, r) => G(tr(x, y), path(`M${-r * 1.05} ${-r * .45}A${r * 1.05} ${r * 1.05} 0 0 1 ${r * 1.05} ${-r * .45}Z`, '#ffd23f', 6) + rect(-r * 1.25, -r * .5, r * 2.5, r * .16, '#ffc21a', r * .08, 5) + rect(-r * .12, -r * 1.42, r * .24, r * .9, '#ffe066', 4, 0));
const crown = (x, y, s = 1) => G(tr(x, y, s), path('M-70 0L-80 -80L-40 -40L0 -100L40 -40L80 -80L70 0Z', '#ffd23f', 6) + circ(0, -30, 10, '#e2463a', 4) + circ(-44, -24, 8, '#5ec4f0', 4) + circ(44, -24, 8, '#7be07b', 4));
const pacifier = (x, y, s = 1) => G(tr(x, y, s), ell(0, 0, 34, 22, '#5ec4f0', 5) + circ(0, 0, 10, '#fff', 4) + path('M-14 18Q0 52 14 18', 'none', 7, '#ff8fb1'));
const babyBonnet = (x, y, r) => G(tr(x, y), path(`M${-r * 1.08} ${r * .2}Q${-r * 1.2} ${-r * 1.25} 0 ${-r * 1.18}Q${r * 1.2} ${-r * 1.25} ${r * 1.08} ${r * .2}Q${r * .9} ${-r * .55} 0 ${-r * .62}Q${-r * .9} ${-r * .55} ${-r * 1.08} ${r * .2}Z`, '#ffd0e0', 6) + path(`M${-r * .95} ${r * .1}Q${-r * .7} ${r * .8} ${-r * .4} ${r * .95}M${r * .95} ${r * .1}Q${r * .7} ${r * .8} ${r * .4} ${r * .95}`, 'none', 8, '#ff8fb1') + circ(0, -r * 1.18, r * .14, '#fff', 5));
const nBib = (x, y, s = 1) => G(tr(x, y, s), path('M-50 -10Q0 30 50 -10L46 60Q0 90 -46 60Z', '#fff', 5) + ftext(0, 50, 'BÉBÉ', { size: 24, fill: '#ff8fb1', stroke: 'none' }));
function battery(x, y, s, lvl, t) { const c = lvl < .25 ? '#e2463a' : lvl < .5 ? '#ffb03a' : '#7be07b'; return G(tr(x, y, s), rect(-90, -44, 180, 88, '#fff', 16, 7) + rect(90, -18, 18, 36, OL, 4, 0) + (lvl > 0 ? rect(-78, -32, 156 * lvl, 64, (lvl < .25 && Math.sin(t * 14) > 0) ? '#ffb3a8' : c, 8, 0) : '')); }
function polaroid(x, y, s, r, inner, t, t0) { const k = pop(t, t0, .4); if (k <= 0) return ''; return G(tr(x, y, s * k, r + (1 - k) * 30), rect(-110, -120, 220, 250, '#fff', 8, 6) + clipR(-92, -102, 184, 176, rect(-92, -102, 184, 176, '#bfe6ff', 0, 0) + inner, 4) + rect(-92, -102, 184, 176, 'none', 4, 4) + rect(-30, -136, 60, 30, 'rgba(255,240,180,.8)', 3, 0)); }
// cadre de famille : petites têtes dans la photo (jeunes ou vieux parents + 1 enfant)
const famPic = (old, kidFn, t) => mamanHead(-42, 10, 34, { expr: 'happy', old, bags: !!old }, t) + papaHead(40, 6, 34, { expr: 'happy', old, bags: !!old }, t) + kidFn + rect(-92, 50, 184, 30, '#8fd16a', 0, 0);
function nTumble(x, y, s, t) { let d = ''; for (let i = 0; i < 7; i++) d += `M${f1(Math.cos(i) * 50)} ${f1(Math.sin(i * 1.7) * 50)}Q${f1(Math.cos(i + 2) * 60)} ${f1(Math.sin(i + 2) * 60)} ${f1(Math.cos(i + 4) * 50)} ${f1(Math.sin(i * 1.3 + 4) * 50)}`; return G(tr(x, y, s, t * 300), circ(0, 0, 55, 'rgba(200,160,100,.25)', 0) + path(d, 'none', 6, '#a8804a')); }
function truck(x, yb, s, t) { return G(tr(x, yb, s), rect(-360, -360, 470, 320, '#fff', 14, 7) + rect(-340, -330, 430, 70, '#ff7a2f', 8, 0) + ftext(-125, -278, 'DÉMÉNAGEMENT', { size: 40, fill: '#fff', stroke: 'none' }) + path('M110 -260L230 -260Q290 -250 300 -170L310 -40L110 -40Z', '#ff7a2f', 7) + path('M140 -240L220 -240Q262 -232 270 -170L140 -170Z', '#cfe8ff', 5) + rect(-380, -50, 700, 20, '#59616c', 6, 5) + [-260, -150, 200].map(cx => circ(cx, -10, 50, '#2b2b33', 6) + circ(cx, -10, 20, '#c9ced6', 4)).join('') + dBox(-250, -40, .8, 'HUGO') + dBox(-90, -40, .8, 'MAX') + circ(305, -110, 12, '#ffd23f', 4)); }

// ---------- décors vivants (riches : 15–30 éléments, 3 couches, 2–3 éléments animés) ----------
// salon familial : mur des photos (4 grands cadres pour les aînés + un minuscule pour toi), étagère à trophées, fenêtre + rideaux, canapé, lampe, tapis, jouets
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
// cuisine : frigo couvert de dessins des aînés, placards, crédence, fenêtre bistrot, plan de travail (grosse marmite fumante), calendrier des corvées
function cuisine(t, o = {}) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#fff1c4', 0, 0);
  for (let y = 820, j = 0; y < 1000; y += 60, j++) for (let x = -M + (j % 2) * 45; x < W + M; x += 90) s += rect(x, y, 90, 60, '#e8f4f8', 0, 3, '#c9dde6');
  for (let i = 0; i < 4; i++) { const x = 250 + i * 110; s += rect(x, 150, 104, 260, '#7fc8b0', 8, 6) + rect(x + 14, 170, 76, 220, 'none', 6, 3, '#5aa58c') + rect(x + 46, 340, 12, 40, '#fff', 5, 3); }
  s += rect(240, 132, 460, 22, '#5aa58c', 4, 5) + dJar(300, 130, '#ff9a4d', .7) + dJar(360, 130, '#7be07b', .7) + dPot(640, 130, .45, t, 2, '#e2463a');
  s += dWindowView(740, 300, 270, 330, t); for (let i = 0; i < 6; i++) s += path(`M${720 + i * 52} 290L${772 + i * 52} 290L${772 + i * 52} 380Q${746 + i * 52} ${410 + wave(t, .6, 6, i)} ${720 + i * 52} 380Z`, i % 2 ? '#fff' : '#e2463a', 4); s += rect(712, 278, 326, 16, '#8a5a3a', 6, 4);
  s += rect(-40, 380, 260, 870, '#eef3f6', 26, 7) + line(-40, 700, 220, 700, 6) + rect(186, 460, 16, 160, '#c9d3dc', 6, 4) + rect(186, 760, 16, 200, '#c9d3dc', 6, 4);
  s += [[30, 480, '#ff8fb1', -6], [120, 520, '#5ec4f0', 5], [40, 820, '#7be07b', 4], [130, 880, '#ffd23f', -5]].map(([x, y, c, r]) => G(tr(x, y, 1, r + wave(t, .8, 1.5, x)), rect(-40, -50, 80, 100, '#fff', 4, 4) + circ(0, -12, 22, c, 3) + path('M-20 26L0 14L20 30', 'none', 4, c) + circ(0, -54, 8, '#e2463a', 3))).join('') + G(tr(110, 1020, 1, 8), rect(-14, -14, 28, 28, '#ffd23f', 2, 3)) + circ(60, 650, 12, '#5b8fd8', 4) + circ(150, 1100, 12, '#ff9a4d', 4);
  s += wallClock(330, 520, 48, t) + G(tr(560, 540), rect(-80, -90, 160, 190, '#fff', 8, 5) + rect(-80, -90, 160, 34, SX.acc, 8, 5) + ftext(0, -64, 'CORVÉES', { size: 20, fill: '#fff', stroke: 'none' }) + [0, 1, 2, 3, 4].map(i => rect(-64, -42 + i * 26, 128, 16, DPAL[i], 4, 0)).join(''));
  s += line(250, 760, 690, 760, 8, '#9aa3ad') + [300, 380, 460, 540, 620].map((x, i) => G(tr(x, 760, 1, wave(t, .7, 4, i)), line(0, 0, 0, 50, 5, '#9aa3ad') + (i % 2 ? circ(0, 66, 18, '#c9d3dc', 4) : rect(-10, 50, 20, 36, '#c9d3dc', 4, 4)))).join('');
  s += WASH() + rect(220, 1000, 900, 30, '#b98552', 6, 6) + rect(220, 1030, 900, 230, '#7fc8b0', 0, 6);
  for (let i = 0; i < 2; i++) s += rect(240 + i * 170, 1050, 150, 90, '#8fd4bc', 8, 4) + rect(295 + i * 170, 1080, 40, 12, '#fff', 5, 3);
  s += rect(600, 1045, 220, 205, '#3a3f4a', 10, 5) + rect(620, 1100, 180, 120, '#ffb36b', 8, 4) + op(.4, glow(710, 1160, 120, '#ffd88a', .6)) + [0, 1, 2, 3].map(i => circ(630 + i * 52, 1070, 9, '#c9ced6', 3)).join('');
  s += G(tr(420, 1000), rect(-80, -110, 160, 110, '#c9d3dc', 12, 6) + rect(-100, -122, 200, 22, '#9aa3ad', 8, 5) + line(-100, -90, -128, -90, 10) + line(100, -90, 128, -90, 10)) + steam(400, 860, t, .8) + steam(450, 870, t + .4, .6);
  s += G(tr(930, 1000), path('M-80 -50Q0 40 80 -50Z', '#ff9a4d', 5) + circ(-30, -60, 22, '#e2463a', 4) + circ(10, -70, 22, '#ffd23f', 4) + circ(40, -56, 20, '#7be07b', 4)) + dMug(1060, 1000, .9, t, '#5b8fd8');
  s += dTileFloor(yb, '#f0e6da', '#d9c4a8') + dBin(1050, 1340, .7, '#36a85a') + dShoes(150, 1700, .7, '#5b8fd8');
  return s; }
// grande table familiale (7 chaises : il y a du monde… ou plus personne)
function famTable(x, yb, s, t, o = {}) { let g = ''; for (let i = 0; i < 5; i++) { const cx = -380 + i * 190; g += rect(cx - 50, -330, 100, 150, '#c58e55', 14, 5) + line(cx - 36, -180, cx - 36, -40, 8) + line(cx + 36, -180, cx + 36, -40, 8); }
  g += rect(-520, -200, 1040, 40, '#b07a45', 8, 6) + path('M-520 -200L520 -200L540 -110L-540 -110Z', '#fff', 6) + [0, 1, 2, 3, 4, 5].map(i => path(`M${-540 + i * 180} -110l90 0l-45 30Z`, '#e2463a', 0)).join('') + line(-480, -110, -480, 0, 12) + line(480, -110, 480, 0, 12);
  if (!o.empty) g += [-380, -190, 0, 190, 380].map((cx, i) => ell(cx, -206, 60, 16, '#fff', 4) + ell(cx, -208, 34, 8, ['#ffd23f', '#7be07b', '#ff8fb1', '#ff9a4d', '#5ec4f0'][i], 0)).join('');
  else g += [-380, -190, 190, 380].map(cx => ell(cx, -206, 60, 16, '#fff', 4) + op(.5, path(`M${cx - 40} -240Q${cx} -${270 + wave(t, .5, 8)} ${cx + 40} -240`, 'none', 3, '#ccc'))).join('');
  return G(tr(x, yb, s), g); }
// entrée : porte (o.open → nuit dehors), porte-manteau surchargé (7 manteaux), montagne de chaussures, miroir, console + bol à clés, suspension qui balance, toise des aînés
function entree(t, o = {}) { const yb = 1250, op_ = o.open || 0;
  let s = dWall('stripe', '#d6ecf7', '#c4e0ef', yb) + rect(-M, 960, W + 2 * M, yb - 960, '#9fc6dc', 0, 0) + line(-M, 960, W + M, 960, 6, '#7fa8c0') + dBase(yb, '#fff');
  s += rect(392, 512, 296, 746, '#fff', 6, 7);
  if (op_ > 0) s += clipR(400, 520, 280, 730, grad('#141a40', '#3a3070', 400, 520, 280, 730) + circ(620, 600, 26, '#fff6d6', 0) + rect(400, 1080, 280, 170, '#3a4060', 0, 0) + dLampPost(450, 1180, .55, 1) + (o.friends ? kid(1, { x: 560, y: 1290, s: .8, expr: 'joy', armR: [-60, -100] }, t) + kid(3, { x: 650, y: 1300, s: .75, expr: 'happy', armL: [200, 240], flip: 1 }, t) : ''), 0);
  const dw = lerp(280, 60, op_); s += rect(400, 520, dw, 730, '#e2463a', 4, 6) + (dw > 120 ? rect(400 + dw * .2, 570, dw * .6, 200, '#cfe8ff', 10, 5) + rect(400 + dw * .2, 830, dw * .6, 330, 'none', 8, 4, '#b8352b') + circ(400 + dw * .85, 920, 14, '#ffd23f', 4) : '');
  // toise des aînés sur le chambranle (+ le tien, tout en bas)
  [['TOI', 640], ['THÉO', 820], ['LILA', 900]].forEach(([nm, y]) => { s += line(700, y, 740, y, 5) + ftext(746, y + 8, nm, { size: 20, fill: '#2b2420', stroke: 'none', anchor: 'start' }); });
  s += line(40, 360, 340, 360, 10, '#8a5a3a'); for (let i = 0; i < 6; i++) { const x = 60 + i * 52, c = [...DPAL, '#5a6b4a'][i], sw = wave(t, .4, 3, i); s += circ(x, 360, 8, '#ffd23f', 3) + G(tr(x, 366, 1, sw), path('M-30 0L30 0L44 230L-44 230Z', c, 5) + line(0, 0, 0, 230, 3, shade(c, -.2))); }
  s += G(tr(290, 330, 1, -8), path('M-50 0Q0 -60 50 0Z', '#36a85a', 5) + rect(-60, -4, 120, 12, '#36a85a', 6, 4));
  s += rect(40, 1130, 320, 20, '#b98552', 4, 5) + rect(40, 1190, 320, 20, '#b98552', 4, 5) + line(50, 1130, 50, 1250, 8) + line(350, 1130, 350, 1250, 8);
  const sc = ['#e2463a', '#5b8fd8', '#ffd23f', '#36a85a', '#ff8fb1', '#b56cff', '#ff9a4d']; for (let i = 0; i < 7; i++) s += dShoes(90 + (i % 3) * 100, 1128 + (i > 2 ? 60 : 0) - (i > 5 ? 60 : 0), .45, sc[i]);
  s += circ(880, 520, 110, '#f1c27d', 7) + circ(880, 520, 88, '#cfe8f5', 5) + line(840, 470, 880, 430, 8, 'rgba(255,255,255,.7)');
  s += rect(760, 900, 260, 22, '#b98552', 6, 5) + line(780, 922, 780, 1250, 8) + line(1000, 922, 1000, 1250, 8) + ell(830, 896, 40, 14, '#5ec4f0', 4) + circ(820, 880, 9, '#ffd23f', 3) + dPot(950, 900, .5, t, 0) + rect(880, 860, 50, 36, '#fff', 3, 3);
  s += line(CX + 30, -M, CX + 30 + wave(t, .5, 20), 300, 4) + G(tr(CX + 30 + wave(t, .5, 20), 300), path('M-60 40L60 40L30 -10L-30 -10Z', '#ffd23f', 5) + op(.3, circ(0, 60, 90, '#fff6c8', 0)));
  s += WASH('rgba(255,255,255,.1)');
  s += dParquet(yb, '#b98a5c') + rect(240, 1300, 600, 900, '#5b8fd8', 10, 6) + rect(270, 1320, 540, 900, 'none', 6, 5, '#ffd23f') + dBag(940, 1360, .8, '#e2463a', 10) + dBall(1030, 1600, .6, 0, '#ffd23f');
  if (o.night) s += op(.28, rect(-M, -M, W + 2 * M, H + 2 * M, '#1a1d48', 0, 0));
  return s; }
// chambre du héros : pile de linge, fanion « N°1 », posters, étagère, lit, tapis
function chambreH(t, o = {}) { const yb = 1250;
  let s = dWall('dot', '#d9f0d2', '#c4e6b9', yb) + dBase(yb, '#fff');
  s += dWindowView(60, 300, 260, 330, t) + dCurtain(0, 280, 90, 420, '#5b8fd8', t, 1) + dCurtain(290, 280, 90, 420, '#5b8fd8', t, -1);
  s += dPoster(480, 360, 150, 210, '#ff9a4d', -4, circ(0, -20, 40, '#fff', 4) + path('M-20 40L0 -10L20 40Z', '#e2463a', 4), t) + dPoster(660, 400, 130, 170, '#b56cff', 5, ftext(0, 10, '★', { size: 70, fill: '#ffd23f', stroke: 'none' }), t);
  s += G(tr(860, 300, 1, 6 + wave(t, .5, 2)), path('M-90 -40L120 0L-90 40Z', '#36a85a', 6) + ftext(-20, 12, 'N°1', { size: 34, fill: '#fff', stroke: 'none' }));
  s += wallClock(1010, 470, 46, t) + dShelf(720, 640, 330, dBooks(730, 640, 150, 7) + dTeddy(920, 640, .6) + dTrophy(1000, 640, .6)) + dOutlet(560, 1180);
  s += G(tr(900, yb), rect(-220, -230, 40, 230, '#b98552', 8, 6) + rect(-200, -110, 420, 90, '#b98552', 10, 6) + rect(-190, -150, 400, 60, '#fff', 20, 5) + path('M-120 -150Q60 -190 230 -150L230 -40L-120 -40Z', '#5b8fd8', 6) + ell(-150, -170, 60, 30, '#fff', 5));
  s += WASH() + dParquet(yb, '#c49a6c') + dRug(CX, 1480, 760, 160, '#5ec4f0', '#ffd23f');
  s += G(tr(170, 1320), [0, 1, 2, 3].map(i => path(`M${-90 + i * 8} ${-i * 34}L${90 - i * 6} ${-i * 34}L${84 - i * 6} ${-i * 34 - 30}L${-84 + i * 8} ${-i * 34 - 30}Z`, DPAL[i + 1], 4)).join('') + funTagS('À PLIER', 0, -150));
  s += dShoes(820, 1660, .7, '#36a85a') + dBag(960, 1400, .8, '#ff9a4d', 8) + dBall(300, 1700, .6, t * .2, '#e2463a');
  return s; }
const funTagS = (str, x, y) => G(tr(x, y, 1, -6), rect(-str.length * 9 - 14, -18, str.length * 18 + 28, 36, '#fff8e0', 8, 4) + ftext(0, 9, str, { size: 22, fill: '#7a5a3a', stroke: 'none' }));
// chambre de nuit (bébé) : berceau, mobile qui tourne, veilleuse, table à langer, colonnes de paquets de couches, réveil 03:12
function nurseryN(t) { const yb = 1250;
  let s = dWall('star', '#1d2350', '#2e3a80', yb) + dBase(yb, '#2a3170');
  s += dWindowView(700, 280, 280, 330, t, { night: 1 }) + dCurtain(640, 260, 100, 420, '#5a3a8a', t, 1) + dCurtain(940, 260, 100, 420, '#5a3a8a', t, -1);
  s += line(320, -M, 320, 330, 4, '#c9d3dc') + G(tr(320, 340, 1, 0), line(-140, 0, 140, 0, 5, '#c9d3dc') + [-140, -50, 50, 140].map((x, i) => { const xx = x * Math.cos(t * 1.4 + i), sc = .75 + .25 * Math.sin(t * 1.4 + i); return line(x * Math.cos(t * 1.4), 0, xx, 60, 3, '#c9d3dc') + G(tr(xx, 80, sc), i % 2 ? path('M0 -26L8 -8L28 -8L12 4L18 24L0 12L-18 24L-12 4L-28 -8L-8 -8Z', '#ffd23f', 4) : path('M10 -26A26 26 0 1 0 10 26A20 20 0 1 1 10 -26Z', '#fff6c8', 4)); }).join(''));
  s += G(tr(320, yb), rect(-220, -400, 440, 30, '#e8d8f0', 10, 6) + rect(-220, -120, 440, 30, '#e8d8f0', 10, 6) + Array.from({ length: 10 }, (_, i) => line(-200 + i * 44, -370, -200 + i * 44, -120, 8, '#e8d8f0')).join('') + rect(-240, -420, 30, 420, '#e8d8f0', 10, 6) + rect(210, -420, 30, 420, '#e8d8f0', 10, 6));
  s += dShelf(560, 640, 200, dTeddy(610, 640, .6) + dJar(700, 640, '#ff8fb1', .7));
  s += G(tr(900, yb), rect(-150, -330, 300, 30, '#c9b8e8', 8, 6) + rect(-140, -300, 280, 300, '#a898d8', 6, 6) + line(-140, -200, 140, -200, 4) + line(-140, -100, 140, -100, 4) + circ(0, -250, 8, OL, 0) + circ(0, -150, 8, OL, 0)) + [0, 1, 2].map(i => diaper(840 + i * 18, 900 - i * 34, .7, 0)).join('');
  s += G(tr(600, yb), dBox(0, 0, .9, 'COUCHES') + dBox(0, -100, .9, 'COUCHES') + dBox(10, -200, .9, 'COUCHES'));
  s += rect(560, 400, 150, 70, '#141a3a', 10, 5) + ftext(635, 450, Math.sin(t * 6) > 0 ? '03:12' : '03 12', { size: 40, fill: '#ff5c8a', stroke: 'none' }) + op(.3, circ(635, 435, 90, '#ff5c8a', 0));
  s += op(.4 + .05 * Math.sin(t * 3), glow(1030, 1180, 200, '#ffd88a', .7)) + circ(1030, 1190, 30, '#ffe9a8', 5);
  s += rect(-M, yb, W + 2 * M, 1400, '#3a3050', 0, 0) + line(-M, yb, W + M, yb, 6, '#2a2240') + dRug(CX, 1450, 760, 150, '#5a3a8a', '#ff8fb1') + dTeddy(150, 1600, .8, '#ff9a4d') + dBall(980, 1600, .6, 0, '#ffc83d') + dBin(80, 1350, .7, '#8a6ad8') + [0, 1].map(i => diaper(60 + i * 40, 1230 - i * 30, .5, i * 20)).join('');
  return s; }
// maison familiale (extérieur) : ciel + oiseaux, ville lointaine, maison détaillée (cheminée qui fume, fenêtres à rideaux, jardinières), clôture, arbres, boîte aux lettres, trottoir, lampadaire, voiture
function houseExt(t, o = {}) { const yb = 1250, dk = o.dusk || 0;
  let s = SKY(t, mixC('#8fd3ff', '#ff9a6b', dk), mixC('#e6f6ff', '#ffe0b0', dk)) + dBirds(t, 3, 260) + op(.8, dSkyline(1010, mixC('#c3d6e4', '#d9a8a0', dk), 4)) + dHaze(.18, '255,245,235') + ell(200, 1080, 500, 120, '#9ccf8a', 0) + ell(900, 1090, 500, 110, '#8fc47c', 0);
  for (let i = 0; i < 4; i++) { const k = (t * .4 + i / 4) % 1; s += op(.7 * (1 - k), circ(770 + k * 60 + wave(t, .5, 10, i), 470 - k * 260, 26 + k * 40, '#eef0f4', 0)); }
  s += rect(730, 470, 70, 150, '#b8352b', 4, 6) + path('M140 640L540 380L940 640Z', '#d9534f', 7) + rect(180, 640, 720, 610, '#f6e3c0', 6, 7) + [0, 1, 2, 3, 4].map(i => line(180, 700 + i * 110, 900, 700 + i * 110, 3, '#ead2a8')).join('');
  [[260, 700], [660, 700]].forEach(([x, y]) => { s += rect(x, y, 160, 150, mixC('#cfe8ff', '#ffd88a', dk), 6, 6) + line(x + 80, y, x + 80, y + 150, 5) + path(`M${x} ${y}L${x + 50} ${y}Q${x + 30} ${y + 70} ${x} ${y + 150}Z`, '#e86a8a', 4) + rect(x - 10, y + 150, 180, 30, '#b98552', 4, 5) + dFlowers(x + 20, y + 150, 4, x, t); });
  s += rect(260, 960, 160, 150, '#cfe8ff', 6, 6) + line(340, 960, 340, 1110, 5) + rect(470, 920, 140, 330, '#5b8fd8', 6, 6) + circ(585, 1090, 10, '#ffd23f', 4) + rect(450, 1230, 180, 20, '#c9b8a0', 3, 5) + rect(660, 960, 160, 150, '#cfe8ff', 6, 6) + line(740, 960, 740, 1110, 5);
  s += rect(500, 870, 80, 34, '#fff8e0', 6, 4) + ftext(540, 896, 'N°7', { size: 22, fill: '#7a5a3a', stroke: 'none' });
  s += tree(1000, 1250, .85, t) + dPine(80, 1250, .8, t) + dBush(160, 1250, .6) + dBush(880, 1250, .55, '#4fa64f') + G(tr(980, 1260), rect(-6, -150, 12, 150, '#8a5a3a', 3, 4) + rect(-50, -200, 100, 60, '#e2463a', 18, 5) + ftext(0, -160, 'FAMILLE', { size: 16, fill: '#fff', stroke: 'none' }));
  s += dFence(-M, 440, 1260, '#fff') + dFence(640, W + M, 1260, '#fff') + rect(-M, 1260, W + 2 * M, 200, '#8fd16a', 0, 0) + rect(440, 1260, 200, 200, '#d8c8a8', 0, 4) + rect(-M, 1460, W + 2 * M, 110, '#c8ccd2', 0, 0) + line(-M, 1460, W + M, 1460, 6, '#9aa0a8') + rect(-M, 1570, W + 2 * M, 600, '#6e747c', 0, 0) + Array.from({ length: 8 }, (_, i) => rect(-M + i * 300, 1720, 160, 16, '#fff', 4, 0)).join('');
  s += dLampPost(40, 1470, .9, dk > .4) + (o.car !== false ? dCar(900, 1690, .8, '#ffd23f', 1) : '');
  if (dk) s += op(.2 * dk, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff7a3a', 0, 0));
  return s; }
// chantier « leur vie » : grue (charge qui balance), échafaudage, murs de briques à moitié montés, cônes, brouette, palissade
function chantier(t) { const yb = 1250;
  let s = SKY(t, '#9fd6ff', '#fff4dc') + dBirds(t, 2, 300) + op(.8, dSkyline(1050, '#c3d6e4', 7)) + dHaze(.15);
  s += G(tr(900, yb), rect(-20, -1100, 40, 1100, '#ffc21a', 0, 6) + Array.from({ length: 11 }, (_, i) => line(-20, -i * 100, 20, -i * 100 - 100, 4)).join('') + rect(-700, -1120, 860, 36, '#ffc21a', 4, 6) + rect(80, -1150, 90, 90, '#ffc21a', 8, 6));
  const hx = 340 + wave(t, .3, 30); s += line(340, 130, hx, 520, 4) + G(tr(hx, 540, 1, wave(t, .3, 6)), [0, 1, 2].map(j => [0, 1, 2].map(i => rect(-75 + i * 50, j * 26, 50, 26, '#d9734f', 2, 3)).join('')).join(''));
  for (let j = 0; j < 12; j++) for (let i = 0; i < 9; i++) { const x = 160 + i * 80 + (j % 2) * 40; if (x > 860 || (j > 8 && i > 5)) continue; s += rect(x, yb - 40 - j * 40, 80, 40, j % 3 ? '#d9734f' : '#c8603e', 2, 3); }
  s += rect(380, 1010, 180, 240, '#5a4030', 4, 5) + line(130, 700, 130, yb, 8, '#9aa3ad') + line(900, 700, 900, yb, 8, '#9aa3ad') + line(130, 760, 900, 760, 8, '#9aa3ad') + rect(120, 744, 790, 16, '#c58e55', 3, 4);
  s += G(tr(CX, 640), rect(-200, -50, 400, 100, '#fff8e0', 10, 6) + ftext(0, 14, 'LEUR VIE', { size: 50, fill: '#e2463a', stroke: 'none' })) + G(tr(230, 640, 1, wave(t, .5, 5)), rect(-24, -18, 48, 36, '#fff', 4, 3));
  s += rect(-M, yb, W + 2 * M, 1400, '#c9a77a', 0, 0) + line(-M, yb, W + M, yb, 6, '#a8875a') + dCone(80, 1330, .7) + dCone(1000, 1360, .7) + G(tr(880, 1420), path('M-90 -60L80 -60L50 0L-60 0Z', '#5b8fd8', 5) + circ(-30, 20, 26, '#2b2b33', 5) + line(80, -60, 150, -20, 8) + rect(-70, -100, 120, 40, '#d9734f', 3, 3)) + rect(-M, 1680, W + 2 * M, 30, '#ff9a4d', 0, 5);
  return s; }
const dCone = (x, y, s = 1) => G(tr(x, y, s), rect(-50, -10, 100, 14, '#ff7a2f', 4, 4) + path('M-34 -10L0 -150L34 -10Z', '#ff7a2f', 5) + path('M-24 -50L24 -50', 'none', 12, '#fff'));
// devanture du magasin de vélos (vitrine : vélo neuf sur podium sous spot, ballons, prix), immeubles voisins, trottoir
function shopFront(t) { const yb = 1250;
  let s = SKY(t) + op(.85, dSkyline(900, '#bccde0', 6)) + dHaze(.15) + dBuilding(-300, yb, 380, 980, '#cfd8e2', 3, t, { shop: false }) + dBuilding(960, yb, 380, 940, '#f0b8a8', 5, t, { shop: false });
  s += rect(80, 300, 920, 960, '#4d7cf0', 6, 7) + rect(60, 290, 960, 40, '#3a5fc0', 6, 6) + rect(250, 360, 580, 110, '#fff8e0', 14, 6) + ftext(540, 438, 'VÉLOS NEUFS', { size: 64, fill: '#e2463a', stroke: 'none' });
  for (let i = 0; i < 10; i++) s += circ(270 + i * 60, 360, 10, Math.sin(t * 8 + i) > 0 ? '#ffd23f' : '#c9a020', 3) + circ(270 + i * 60, 470, 10, Math.sin(t * 8 + i + 1) > 0 ? '#ffd23f' : '#c9a020', 3);
  for (let i = 0; i < 8; i++) s += path(`M${80 + i * 115} 490L${195 + i * 115} 490L${195 + i * 115} 540Q${137 + i * 115} 565 ${80 + i * 115} 540Z`, i % 2 ? '#fff' : '#e2463a', 5);
  s += rect(130, 580, 820, 580, '#d6ecfa', 10, 7) + op(.5, glow(640, 760, 260, '#fffbe0', .8)) + ell(640, 1080, 220, 40, '#fff', 5) + rect(420, 1080, 440, 70, '#e8eef5', 0, 5) + bikeNew(640, 1070, 1.5, t) + G(tr(820, 760, 1, 8 + wave(t, .6, 3)), rect(-70, -40, 140, 80, '#ffd23f', 10, 5) + ftext(0, 14, '499 €', { size: 34, fill: OL, stroke: 'none' })) + dBalloon(220, 700, '#ff5c8a', t, 0, .8) + dBalloon(300, 760, '#ffd23f', t, 1, .7) + line(160, 620, 300, 600, 10, 'rgba(255,255,255,.6)') + line(180, 680, 360, 640, 6, 'rgba(255,255,255,.5)') + rect(130, 580, 820, 580, 'none', 10, 7);
  s += rect(-M, yb, W + 2 * M, 1400, '#c8ccd2', 0, 0) + [0, 1, 2].map(i => line(-M, yb + 30 + i * 30, W + M, yb + 30 + i * 30, 3, '#b0b5bc')).join('') + line(-M, yb, W + M, yb, 8, '#7d848c') + dLampPost(1040, 1260, 1) + dPot(60, 1260, .9, t, 0) + dBin(980, 1270, .6, '#36a85a') + dBike(150, 1300, .6, '#ffd23f');
  return s; }

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
function pointHand(tx, ty, ang, sleeve, k = 1, len = 700) { if (k <= 0) return ''; const a = R(ang), off = (1 - k) * 800;
  return G(tr(tx - Math.cos(a) * off, ty - Math.sin(a) * off, 1, ang), line(-len, 0, -100, 0, 74, OL) + line(-len, 0, -100, 0, 60, sleeve) + rect(-54, -18, 70, 36, SKIN, 18, 6) + rect(-130, -46, 96, 92, SKIN, 38, 6) + path('M-100 -10L-50 -10M-100 14L-50 14', 'none', 5) + ell(-82, -46, 30, 16, SKIN, 6)); }

// ============================================================
//  « Pourquoi c'est horrible d'être l'aîné de la famille ? » — SIZEX fun (Fredoka), accent corail
// ============================================================
SX.acc = '#ff5a5f';

// ---------- le héros, l'aîné (7 ans → ado → adulte) : t-shirt bleu + badge étoile « 1 » (premier enfant) ----------
const HAIR_A = '#5a3a26', SHIRT_A = '#2fa3ff';
const STAR5 = 'M0 -50L14 -16L50 -14L22 8L32 46L0 24L-32 46L-22 8L-50 -14L-14 -16Z';
const badge1 = (x, y, s = 1) => G(tr(x, y, s * .6), path(STAR5, '#ffd23f', 7) + ftext(0, 14, '1', { size: 40, fill: OL, stroke: 'none' }));
// g : 0 = enfant, 1 = ado, 2 = adulte (barbe)
function aine(o, t) { const g = o.g || 0; const base = g ? { age: 'adult', beard: g === 2 } : { age: 'kid' };
  let s = person(Object.assign({ hair: 'short', hairColor: HAIR_A, shirt: SHIRT_A, pants: '#3b4a6b', seed: 2 }, base, o), t);
  if (o.badge !== false) s += G(ptr(o), g ? badge1(-36, -270, 1.1) : badge1(-30, -158));
  return s; }
const aineHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'short', hairColor: HAIR_A, seed: 2, beard: o.g === 2 }, o), t));
// petit frère Théo (blond à pics, t-shirt orange) / petite sœur Lila (queue de cheval, rose)
const THEO = { hair: 'spiky', hairColor: '#e0a040', shirt: '#ff9a4d', pants: '#4b5b7a', seed: 5 };
const LILA = { hair: 'ponytail', hairColor: '#8a5a3a', shirt: '#ff8fb1', pants: '#6b4b8a', seed: 6 };
const theo = (o, t) => person(Object.assign({ age: 'kid' }, THEO, o), t);
const theoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, THEO, o), t));
const lila = (o, t) => person(Object.assign({ age: 'kid' }, LILA, o), t);
const lilaHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, LILA, o), t));
const bebeLila = (o, t) => person(Object.assign({ age: 'baby', hair: 'tuft', hairColor: '#8a5a3a', shirt: '#ffc2d6', seed: 6 }, o), t);
// parents (cernes seulement si o.bags)
const tiredHair2 = (style, col) => (r, t, o) => { const [b, f] = hairSvg(style, o.old ? mixC(col, '#e6e6ec', o.old) : col, r, t); return [b, f + (o.bags ? bags(r) : '')]; };
const bags = r => path(`M${f1(-r * .54)} ${f1(r * .17)}Q${f1(-r * .34)} ${f1(r * .34)} ${f1(-r * .14)} ${f1(r * .17)}M${f1(r * .14)} ${f1(r * .17)}Q${f1(r * .34)} ${f1(r * .34)} ${f1(r * .54)} ${f1(r * .17)}`, 'none', f1(r * .05), '#9b6fa8');
const MOM = { age: 'adult', hairFn: tiredHair2('bun', '#6b3e26'), shirt: '#e86a8a', pants: '#4b3b6e', seed: 4, necklace: true };
const DAD = { age: 'adult', hairFn: tiredHair2('side', '#3a2a20'), glasses: true, shirt: '#36a85a', pants: '#2f3b4e', seed: 8 };
const maman = (o, t) => person(Object.assign({}, MOM, o), t);
const papa = (o, t) => person(Object.assign({}, DAD, o), t);
const mamanHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, MOM, o), t));
const papaHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, DAD, o), t));

// ---------- accessoires ----------
function flatTV(x, yb, s, t, k = 0) { let g = rect(-20, -40, 40, 40, '#3a3f4a', 4, 5) + rect(-120, -14, 240, 16, '#3a3f4a', 6, 5) + rect(-260, -340, 520, 310, '#22232a', 16, 7) + rect(-238, -318, 476, 266, k > 0 ? '#1a1d24' : '#5ec4f0', 6, 0);
  if (k <= 0) g += rect(-238, -120, 476, 68, '#7be07b', 0, 0) + circ(110, -230, 40, '#ffd23f', 0) + G(tr(-80 + wave(t, 1, 40), -150), circ(0, 0, 40, '#ff8fb1', 5) + circ(-14, -8, 6, OL, 0) + circ(14, -8, 6, OL, 0));
  else { g += path('M10 -190L-60 -250L-130 -230M10 -190L60 -300M10 -190L120 -150L200 -170M10 -190L-20 -100L-90 -70M10 -190L90 -80M-60 -250L-80 -300', 'none', 6, '#e8eef5') + circ(10, -190, 18, '#e8eef5', 0);
    for (let i = 0; i < 5; i++) { const a = t * 9 + i * 1.3; g += sparkle(10 + Math.cos(a) * 130 * (i % 2 ? 1 : .6), -190 + Math.sin(a * 1.3) * 80, .3 + .2 * Math.abs(Math.sin(t * 20 + i)), '#ffd23f'); }
    g += op(.7, steam(-80, -340, t, .9) + steam(120, -340, t + .4, .7)); }
  return G(tr(x, yb, s), g); }
const remote = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-26, -80, 52, 160, '#2b2b33', 18, 5) + circ(0, -54, 9, '#e2463a', 3) + [0, 1, 2].map(j => [0, 1].map(i => circ(-11 + i * 22, -20 + j * 24, 6, '#9aa3ad', 0)).join('')).join(''));
const diploma = (x, y, s = 1, r = 0, str = 'DIPLÔME') => G(tr(x, y, s, r), rect(-190, -120, 380, 240, '#fff8e0', 10, 6) + rect(-170, -100, 340, 200, 'none', 6, 3, '#c9a020') + ftext(0, -46, str, { size: 34, fill: '#7a5a3a', stroke: 'none' }) + ftext(0, -6, 'SPÉCIALISÉ', { size: 24, fill: '#a08050', stroke: 'none' }) + [0, 1].map(i => line(-120, 34 + i * 26, 60, 34 + i * 26, 4, '#d8c8a0')).join('') + path('M110 90L96 150L125 132L154 150L140 90Z', '#e2463a', 4) + circ(125, 70, 34, '#e2463a', 5) + circ(125, 70, 20, '#ffd23f', 4));
function scribble(x, y, w, h, k, col, seed = 1) { if (k <= 0) return ''; const r = rng(seed); let d = `M${x} ${y + h / 2}`; const n = Math.max(1, Math.floor(16 * k)); for (let i = 0; i < n; i++) d += `Q${f1(x + r() * w)} ${f1(y + r() * h)} ${f1(x + r() * w)} ${f1(y + r() * h)}`; return path(d, 'none', 11, col); }
const crayonSun = (x, y, k) => k <= 0 ? '' : op(clamp(k * 2), circ(x, y, 50, 'none', 10, '#ffb03a') + Array.from({ length: 8 }, (_, i) => { const a = i / 8 * 6.28; return line(x + Math.cos(a) * 66, y + Math.sin(a) * 66, x + Math.cos(a) * 96, y + Math.sin(a) * 96, 9, '#ffb03a'); }).join(''));
const crayon = (x, y, s = 1, r = 0, c = '#e2463a') => G(tr(x, y, s, r), rect(-14, -90, 28, 150, c, 6, 5) + path('M-14 60L0 100L14 60Z', '#f1d2a8', 4) + path('M-6 84L0 100L6 84Z', c, 0));
const whistle = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-40, -20, 70, 40, '#c9ced6', 18, 5) + circ(30, 0, 26, '#c9ced6', 5) + rect(-72, -10, 36, 20, '#c9ced6', 4, 5));
const piggy = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), ell(0, 0, 110, 85, '#ff9ab8', 6) + circ(98, -10, 34, '#ff9ab8', 6) + ell(122, -10, 13, 17, '#ff7aa0', 4) + circ(62, -40, 7, OL, 0) + path('M-24 -84L20 -84', 'none', 8) + path('M-40 -70L-58 -112L-14 -82Z', '#ff9ab8', 5) + rect(-70, 66, 26, 32, '#ff9ab8', 6, 5) + rect(40, 66, 26, 32, '#ff9ab8', 6, 5) + path('M-110 -10Q-140 -30 -126 -50', 'none', 6));
const coin = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), circ(0, 0, 30, '#ffd23f', 5) + ftext(0, 12, '€', { size: 32, fill: '#c9a020', stroke: 'none' }));
const calPage = (x, y, s, r, str) => G(tr(x, y, s, r), rect(-120, -140, 240, 280, '#fff', 14, 6) + rect(-120, -140, 240, 70, SX.acc, 14, 6) + circ(-60, -140, 10, '#9aa3ad', 4) + circ(60, -140, 10, '#9aa3ad', 4) + ftext(0, 50, str, { size: 76, fill: OL, stroke: 'none' }));
const micro = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-12, 0, 24, 170, '#2b2b33', 8, 5) + circ(0, -24, 42, '#9aa3ad', 6) + path('M-30 -40L30 -10M-30 -10L30 -40', 'none', 3, '#6b737c') + rect(-50, 30, 100, 46, SX.acc, 8, 5) + ftext(0, 64, 'TV', { size: 30, fill: '#fff', stroke: 'none' }));
const brocoli = (x, y, s = 1) => G(tr(x, y, s), rect(-10, 0, 20, 50, '#8fd16a', 6, 4) + circ(-22, -6, 26, '#36a85a', 4) + circ(20, -10, 28, '#36a85a', 4) + circ(0, -30, 28, '#4fa66a', 4));
const alarmClock = (x, y, s = 1, t = 0) => G(tr(x + wave(t, 12, 4), y, s), circ(-40, -56, 18, '#e2463a', 5) + circ(40, -56, 18, '#e2463a', 5) + circ(0, 0, 60, '#e2463a', 6) + circ(0, 0, 44, '#fff', 4) + line(0, 0, 0, -30, 5) + line(0, 0, 22, 0, 5));
const bookB = (x, y, s = 1, r = 0, c = '#5b8fd8', str = 'MATHS') => G(tr(x, y, s, r), rect(-80, -100, 160, 200, c, 10, 6) + rect(-60, -70, 120, 40, '#fff', 6, 4) + ftext(0, -42, str, { size: 24, fill: c, stroke: 'none' }));
function noSign(x, y, s, t, t0, icon) { const k = popEl(t, t0, .5); if (k <= 0) return ''; return G(tr(x, y, s * k, Math.sin(t * 3 + x) * 4), circ(0, 0, 100, '#fff', 8) + icon + circ(0, 0, 84, 'none', 22, '#e2463a') + line(-60, -60, 60, 60, 22, '#e2463a') + circ(0, 0, 100, 'none', 7)); }
const icoPhone = rect(-30, -52, 60, 104, '#2b2b33', 12, 5) + rect(-20, -38, 40, 70, '#5ec4f0', 4, 0);
const icoCandy = ell(0, 0, 34, 26, '#ff8fb1', 5) + path('M-34 0L-64 -22L-64 22Z', '#ff8fb1', 5) + path('M34 0L64 -22L64 22Z', '#ff8fb1', 5);
const icoGame = path('M-60 -14Q-66 36 -40 40Q-26 40 -20 20L20 20Q26 40 40 40Q66 36 60 -14Q54 -30 34 -30L-34 -30Q-54 -30 -60 -14Z', '#5b8fd8', 5) + circ(-30, -2, 8, '#fff', 0) + circ(30, -2, 8, '#ffd23f', 0);
const icoMoon = path('M10 -50A50 50 0 1 0 40 30A40 40 0 1 1 10 -50Z', '#ffd23f', 5);
function ruleScroll(x, y, k, lines) { const h = 640 * eOutCubic(clamp(k)); let g = rect(-330, 0, 660, h, '#fff8e0', 0, 6);
  lines.forEach((l, i) => { if (80 + i * 76 < h - 10) g += ftext(-280, 80 + i * 76, `${i + 1}. ${l}`, { size: 38, fill: '#5a3a26', stroke: 'none', anchor: 'start' }); });
  return G(tr(x, y), g + rect(-360, -30, 720, 50, '#c8955a', 25, 6) + rect(-360, h - 20, 720, 50, '#c8955a', 25, 6)); }
function betaBox(x, y, s, t, ver, sub, col, bugs = 0) { let g = rect(-170, -230, 340, 460, col, 18, 7) + rect(-150, -210, 300, 150, '#fff', 12, 5) + ftext(0, -150, 'PARENTALITÉ', { size: 36, fill: col, stroke: 'none' }) + ftext(0, -95, sub, { size: 26, fill: '#7a8a99', stroke: 'none' }) + ftext(0, 60, ver, { size: 80, fill: '#fff' }) + rect(-150, 140, 300, 60, 'rgba(0,0,0,.18)', 10, 0);
  for (let i = 0; i < bugs; i++) { const a = t * 2 + i * 1.7, bx = Math.cos(a) * 140, by = Math.sin(a * 1.3) * 180; g += G(tr(bx, by, .8, a * 57), ell(0, 0, 18, 24, '#2b2420', 0) + line(-26, -10, 26, -10, 4) + line(-26, 6, 26, 6, 4) + circ(0, -24, 10, '#2b2420', 0)); }
  return G(tr(x, y, s, wave(t, .8, 3)), g); }
function cabrio(x, yb, s, t, riders = '') { const b = wave(t, 6, 3); return G(tr(x, yb + b, s), riders + path('M-340 -60L-330 -150Q-310 -175 -220 -175L250 -170Q340 -160 350 -100L350 -60Z', '#e2463a', 7) + path('M90 -172L130 -240', 'none', 8, '#9aa3ad') + line(-300, -120, 320, -120, 5, '#b8352b') + circ(-200, -50, 62, '#2b2b33', 7) + circ(-200, -50, 24, '#c9ced6', 4) + circ(220, -50, 62, '#2b2b33', 7) + circ(220, -50, 24, '#c9ced6', 4) + rect(318, -138, 30, 24, '#ffe08a', 6, 4)); }
const capC = (x, y, r) => G(tr(x, y), path(`M${-r * .9} ${-r * .5}L${-r * .8} ${-r * 1.05}Q0 ${-r * 1.35} ${r * .8} ${-r * 1.05}L${r * .9} ${-r * .5}Z`, '#2b2b33', 6) + rect(-r * .95, -r * .6, r * 1.9, r * .2, '#1a1a20', 6, 5) + circ(0, -r * .85, r * .12, '#ffd23f', 4));
const flask = (x, y, t, c = '#7be07b', s = 1) => G(tr(x, y, s), path('M-12 -90L12 -90L12 -50L44 0L-44 0L-12 -50Z', 'rgba(220,240,255,.85)', 5) + path('M-30 -20L30 -20L44 0L-44 0Z', c, 0) + [0, 1, 2].map(i => { const k = (t * 1.5 + i / 3) % 1; return op(1 - k, circ(-8 + i * 8, -20 - k * 100, 6 + i * 2, c, 3)); }).join(''));
// labo des parents : carrelage, écran de mesures, étagères de bocaux et fioles qui bouillonnent, gyrophare, câbles, affiches, paillasse
function laboA(t) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#e3f0f4', 0, 0);
  for (let y = -M; y < yb; y += 100) for (let x = -M + ((Math.round(y / 100)) % 2 ? 50 : 0); x < W + M; x += 100) s += rect(x, y, 100, 100, 'none', 0, 2, '#cde0e6');
  s += rect(60, 230, 460, 300, '#22303a', 16, 7) + rect(80, 250, 420, 260, '#0f2a2a', 6, 0);
  let d = 'M90 420'; for (let i = 0; i < 40; i++) d += `L${90 + i * 10} ${f1(420 + Math.sin(i * .6 + t * 6) * 30 * (i % 7 === 3 ? 2.6 : 1))}`; s += path(d, 'none', 5, '#7be07b');
  s += ftext(290, 300, 'TEST N°1 : AÎNÉ', { size: 28, fill: '#7be07b', stroke: 'none' }) + rect(100, 470, 120, 20, '#ffd23f', 4, 0) + rect(240, 470, 60, 20, '#e2463a', 4, 0);
  s += dShelf(600, 420, 430, dJar(640, 420, '#7be07b') + dJar(710, 420, '#ff8fb1') + dJar(780, 420, '#5ec4f0') + dJar(850, 420, '#ffd23f') + dJar(920, 420, '#b56cff') + dJar(990, 420, '#ff9a4d'));
  s += dShelf(600, 650, 430, dBooks(610, 650, 200, 8) + flask(860, 650, t) + flask(960, 650, t + .5, '#ff8fb1', .9));
  s += wallClock(560, 160, 50, t, 3) + G(tr(860, 130), rect(-50, 20, 100, 30, '#3a3f4a', 6, 5) + path('M-40 20Q-40 -50 0 -50Q40 -50 40 20Z', Math.sin(t * 8) > 0 ? '#ff5a5f' : '#b8352b', 5) + (Math.sin(t * 8) > 0 ? op(.3, circ(0, -10, 110, '#ff5a5f', 0)) : ''));
  s += dPoster(160, 700, 170, 230, '#ffd23f', -3, path('M0 -70L60 40L-60 40Z', '#fff', 5) + ftext(0, 26, '!', { size: 70, fill: OL, stroke: 'none' }), t) + dPoster(400, 690, 170, 210, '#5ec4f0', 4, ftext(0, -30, 'ENFANT', { size: 26, fill: '#fff', stroke: 'none' }) + ftext(0, 20, 'V1.0', { size: 40, fill: '#fff', stroke: 'none' }), t);
  s += path(`M-M 80Q300 ${140 + wave(t, .4, 10)} 540 60`.replace('-M', -M), 'none', 8, '#3a3f4a') + path(`M540 60Q800 ${150 + wave(t, .4, 10, 1)} ${W + M} 90`, 'none', 8, '#e2463a') + dOutlet(560, 1100) + dSwitch(1040, 880);
  s += WASH() + dTileFloor(yb, '#d9e4ea', '#c4d3db');
  s += rect(-M, 1000, 340 + M, 26, '#9aa3ad', 6, 6) + rect(-M, 1026, 320 + M, 230, '#cfd8e0', 0, 6) + flask(120, 1000, t + .2, '#5ec4f0', 1.1) + flask(230, 1000, t + .7, '#ffd23f', .9) + dMug(40, 1000, .9, t, '#e2463a');
  s += rect(780, 1000, W + M - 780, 26, '#9aa3ad', 6, 6) + rect(800, 1026, W + M, 230, '#cfd8e0', 0, 6) + G(tr(900, 1000), rect(-70, -120, 140, 120, '#3a3f4a', 10, 5) + rect(-56, -106, 112, 70, '#7be07b', 6, 0) + ftext(0, -56, Math.sin(t * 5) > 0 ? 'OK' : '...', { size: 30, fill: OL, stroke: 'none' })) + flask(1030, 1000, t + .4, '#b56cff');
  s += dBin(980, 1340, .7, '#9aa3ad') + dBox(120, 1760, .8, 'ESSAIS');
  return s; }
// parc (flashback) : ciel, ville lointaine, collines, arbres variés, étang + canard, banc, lampadaire, fleurs, figurants
function parkA(t) { const yb = 1200;
  let s = SKY(t, '#9fe0ff', '#fff4dc') + op(.8, dSkyline(1060, '#c3d6e4', 8)) + dHaze(.15) + ell(200, 1130, 540, 130, '#9ccf8a', 0) + ell(900, 1120, 540, 120, '#8fc77d', 0);
  s += tree(110, 1200, 1, t) + dPine(330, 1180, .8, t) + tree(990, 1190, 1.05, t) + dPine(770, 1170, .7, t) + dLampPost(560, 1200, .85) + dBench(840, 1215, .75) + dBin(660, 1210, .55, '#36a85a') + dBirds(t, 2, 330);
  s += rect(-M, yb, W + 2 * M, 1500, '#8fd16a', 0, 0) + line(-M, yb, W + M, yb, 6, '#6fb84a') + path(`M-${M} 1520Q300 1330 540 1400Q800 1470 ${W + M} 1300L${W + M} 1420Q800 1580 540 1520Q300 1460 -${M} 1660Z`, '#e8d8b0', 0);
  s += ell(880, 1290, 180, 40, '#7fc8e8', 5) + G(tr(860 + wave(t, .4, 30), 1280), ell(0, 0, 26, 16, '#fff', 4) + circ(18, -16, 12, '#fff', 4) + path('M28 -16L40 -12L28 -9Z', '#ffb03a', 3));
  s += dBush(60, 1270, .7) + dFlowers(160, 1300, 6, 4, t) + dBush(1010, 1340, .6, '#4fa64f') + kidsBg(t, 1240, 2, .4);
  return s; }
const SEPIA = () => rect(-M, -M, W + 2 * M, H + 2 * M, 'rgba(255,190,120,.2)', 0, 0);
// ombres derrière les bulles de texte : fond un peu moins saturé
const O24 = at(24, 'tes') - .15, O35 = at(35, 'qui') - .15, O40 = at(40, 'essayer') - .15;

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, l'aîné en cut-out (frère et sœur accrochés à lui), « débloqué » en étoiles sur AÎNÉ
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const A = at(1, 'aine'), y0 = 1330;
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 980, t, A, { part: 'back', r: 480 }) +
      cutout(theo({ x: 250, y: y0, s: .8, expr: 'mock', armR: [-30, -20] }, t) + lila({ x: 830, y: y0, s: .75, expr: 'laugh', armL: [210, 200], flip: 1 }, t), 10) +
      G(tr(CX, y0, 1 + .03 * Math.sin(t * 7)), cutout(aine({ x: 0, y: 0, s: 1.15, expr: t > A ? 'shock' : 'worried', face: t > A ? { eyes: 'huge' } : {}, armL: [160, 150], armR: [20, 30] }, t), 12)) +
      unlock(CX, 980, t, A, { part: 'front', r: 480 }) + funBox(CX, 1000, 280, 330, t, A + .3, { label: 'aîné.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'ÊTRE", CX, 415, t, .3, { size: 58 }) + kword("L'AÎNÉ ?", CX, 540, t, A - .05, { size: 96, fill: SX.acc2 }) + funTag(CX, 665, 'DE LA FAMILLE', t, at(1, 'famille') - .05, { size: 44, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'aine') - .05, 'boom', .6], [at(1, 'aine'), 'sparkle', .6], [at(1, 'famille'), 'pop', .5]] });
// B002 — « 7 ans, ton petit frère vient de casser la télé » : papier + gobo, cut-outs, la télé se fissure sur CASSER
B(2, { enter: 'none', trans: 'wipe', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .3, shake: t > at(2, 'casser') && t < at(2, 'casser') + .3 ? 8 : 0 }),
  draw: (t, d, T) => { const C = at(2, 'casser'), k = t > C ? 1 : 0;
    return paper(SX.paper) + gobo(T, .12) + burst(720, 870, 330, t, C, SX.acc2, 16) + cutout(flatTV(720, 1060, .8, t, k), 10) +
      cutout(theo({ x: 430, y: 1330, s: 1.05, expr: k ? 'jawdrop' : 'happy', holdR: G(tr(0, 0, 1, k ? -30 : 20), rect(-12, -110, 24, 120, '#8a5a3a', 6, 5) + rect(-50, -150, 100, 60, '#9aa3ad', 10, 5)), armR: k ? [-60, -80] : [10, 40] }, t), 10) +
      cutout(aine({ x: 160, y: 1330, s: .9, expr: k ? 'terror' : 'neutral' }, t), 10) +
      funTag(260, 450, '7 ANS', t, at(2, '7') - .05, { size: 66, bg: SX.cool }) + kword('CRAC !', 720, 560, t, C, { size: 110, fill: SX.acc2 }) + popStars(720, 860, t, C + .05, 8, 300); },
  sfx: [[0, 'whoosh', .5], [at(2, '7') - .05, 'pop', .6], [at(2, 'frere'), 'boing', .4], [at(2, 'casser'), 'crack', .9], [at(2, 'casser') + .05, 'boom', .6], [at(2, 'television'), 'zap', .5]] });
// B003 — « Tes parents arrivent » : grille, les têtes des parents débarquent en glissade (alerte)
B(3, { enter: 'none', trans: 'push', transD: .2, cam: () => ({ z: 1.04, shake: 5 }),
  draw: (t, d, T) => { const k = eOutBack(seg(t, 0, .3));
    return gridBg('#2a2440') + halftoneFade(SX.acc, .08, 1) + speedLines(t, CX, 860, 30, 'rgba(255,255,255,.25)') + cutout(mamanHead(lerp(-300, CX - 190, k), 860, 160, { expr: 'angry' }, t) + papaHead(lerp(1380, CX + 190, k), 860, 160, { expr: 'shock', face: { eyes: 'huge' } }, t), 12) +
      funTag(CX, 470, 'PARENTS !', t, at(3, 'parents') - .1, { size: 70, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .7], [at(3, 'parents') - .1, 'siren', .4], [at(3, 'arrivent'), 'steps', .7]] });
// B004 — « Qui a fait ça ? » : gros plan maman furieuse dans le salon, vapeur
B(4, { enter: 'crash', flash: 1, cam: () => ({ z: 1.08, shake: 6 }),
  draw: (t, d, T) => salonF(t) + rays(t, CX, 880, 'rgba(255,90,95,.18)', 'rgba(255,255,255,0)', 18) + mamanHead(CX, 900, 250, { expr: 'rage', face: { steamHead: 1 } }, t) + kword('QUI A FAIT ÇA ?!', CX, 470, t, at(4, 'qui') - .05, { size: 76, fill: '#fff' }),
  sfx: [[0, 'flash_hit', .6], [at(4, 'qui') - .05, 'boom', .6], [at(4, 'fait'), 'growl', .4]] });
// B005 — tu pointes ton frère : salon large, télé fumante, Théo l'air innocent (télécommande en main)
B(5, { enter: 'whip', cam: zin(1.0, 1.06, .4),
  draw: (t, d, T) => { const P = at(5, 'pointes');
    return salonF(t) + flatTV(880, 1250, .75, t, 1) + aine({ x: 280, y: 1500, s: 1.35, expr: 'rage', armR: t > P ? [-8, -6] : [70, 80] }, t) + theo({ x: 720, y: 1500, s: 1.3, expr: 'embarrassed', look: [-1, 0], holdL: remote(0, 0, .8, 20), flip: 1 }, t) + motionLines(560, 960, 3, 60, 0) +
      funTag(280, 520, 'LUI !', t, P, { size: 72, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .6], [at(5, 'pointes'), 'pop', .7], [at(5, 'pointes') + .1, 'scratch', .5], [at(5, 'frere'), 'boing', .4]] });
// B006 — il a encore la télécommande dans la main : insert géant, Théo siffle l'air de rien
B(6, { enter: 'punch', cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => { const Tc = at(6, 'telecommande');
    return depth({ zoom: 1, x: wave(t, .3, 10) }, [{ z: 1.5, svg: salonF(t), haze: .25 }, { z: 1, svg: theoHead(300, 760, 170, { expr: 'smug', look: [-1, -.6], face: { mouth: 'o-small' } }, t) + ['♪', '♫'].map((n, i) => op(.9, ftext(470 + i * 60 + wave(t, 1.2, 10, i), 600 - ((t * 120 + i * 60) % 140), n, { size: 60, fill: '#fff' }))).join('') +
      G(tr(700, 900, 1, -12 + wave(t, 1, 3)), rect(-110, 120, 220, 400, THEO.shirt, 60, 7) + remote(0, -60, 2.4, 8) + rect(-95, 0, 190, 150, SKIN, 60, 7) + path('M-60 40L60 40M-60 80L60 80M-60 118L50 118', 'none', 5) + ell(-100, 30, 34, 56, SKIN, 6)) }]) +
      markerCircle(700, 820, 160, 250, t, Tc, { col: SX.acc }) + funBox(700, 860, 380, 560, t, at(6, 'main') - .1, { label: 'preuve.png', col: SX.acc }); },
  sfx: [[0, 'whistle', .4], [at(6, 'telecommande'), 'scratch', .6], [at(6, 'main') - .1, 'tick', .6], [at(6, 'main'), 'glint', .6]] });
// B007 — mais ta mère te regarde (toi) : gros plan, regard qui se tourne vers la caméra, vignette sombre
B(7, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.15, eInOut(t / d)) }),
  draw: (t, d, T) => { const R_ = at(7, 'regarde'), lk = lerp(1, 0, eOutCubic(seg(t, R_ - .3, R_)));
    return salonF(t) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, '#1a1030', 0, 0)) + theo({ x: 900, y: 1500, s: .9, expr: 'mock', flip: 1 }, t) + mamanHead(CX - 40, 880, 240, { expr: lk < .2 ? 'suspicious' : 'angry', look: [lk, 0], tilt: lk * 8 }, t) +
      kthin('mais…', CX, 470, t, at(7, 'mais'), { size: 64 }) + (t > R_ ? funTag(CX, 1180 - 60, 'TOI.', t, R_, { size: 54, bg: SX.acc }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(7, 'mere'), 'hmm', .5], [at(7, 'regarde'), 'sting', .7]] });
// B008 — « Et toi, pourquoi tu le surveillais pas ? » : contre-plongée, maman géante te pointe, tu rétrécis
B(8, { enter: 'drop', cam: (t, d) => ({ z: 1.04, hand: .5, r: -4 }),
  draw: (t, d, T) => { const To = at(8, 'toi'), sh = 1 - .15 * eOutCubic(seg(t, at(8, 'surveillais'), at(8, 'surveillais') + .4));
    return salonF(t) + maman({ x: 360, y: 1520, s: 2.0, expr: 'angry', armR: t > To ? [10, 25] : [70, 80], face: { steamHead: t > To ? 1 : 0 } }, t) + aine({ x: 840, y: 1450, s: 1.1 * sh, expr: 'terror', tremble: 1 }, t) + sweatSpray(840, 1450 - 320 * sh, t, 4) +
      kword('ET TOI ?!', CX + 140, 430, t, To - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'thud', .6], [at(8, 'toi') - .05, 'boom', .6], [at(8, 'surveillais'), 'gasp', .6], [at(8, 'pas'), 'squeak', .4]] });
// B009 — PARDON ?! : crash zoom sur toi, mâchoire au sol, fond à rayons
B(9, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.2, 1.05, eOutCubic(clamp(t / .25))), shake: 6 }),
  draw: (t, d, T) => rays(t, CX, 880, '#ffd3d4', '#ff9a9c', 22) + aineHead(CX, 900, 250, { expr: 'jawdrop' }, t) + kword('PARDON ?!', CX, 480, t, 0, { size: 110, fill: '#fff' }),
  sfx: [[0, 'flash_hit', .6], [.05, 'boing', .7], [.15, 'gasp', .5]] });
// B010 — « J'ai 7 ans, pas un diplôme d'éducateur spécialisé » : chambre, toi + doudou, le diplôme tamponné NON
B(10, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Dp = at(10, 'diplome');
    return chambreH(t) + aine({ x: 300, y: 1500, s: 1.35, expr: t > at(10, 'specialise') ? 'annoyed' : 'deadpan', armL: [120, 90], holdL: dTeddy(0, 40, .9) }, t) +
      funTag(300, 470, '7 ANS', t, at(10, '7') - .05, { size: 66, bg: SX.cool }) + card(740, 800, 420, 290, diploma(0, 0, 1, 0, 'ÉDUCATEUR'), t, Dp - .1, { ry: 0, r: 6, bg: '#fff8e0' }) + cross(740, 800, 1.2, t, at(10, 'specialise')) + stamp(740, 1040, 'PAS FAIT !', t, at(10, 'specialise') + .1, '#e2463a', -8, 64); },
  sfx: [[0, 'whoosh', .5], [at(10, '7') - .05, 'pop', .6], [at(10, 'diplome') - .1, 'pop_hi', .6], [at(10, 'specialise'), 'error_beep', .6], [at(10, 'specialise') + .1, 'thud', .7]] });
// B011 — « Bienvenue dans la vie de l'aîné » : devant la maison, banderole BIENVENUE, toi en écharpe « AÎNÉ », confettis ironiques
B(11, { enter: 'drop', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Bv = at(11, 'bienvenue');
    let ban = ''; const L = 'BIENVENUE'; for (let i = 0; i < L.length; i++) { const x = 140 + i * 100, y = 720 + Math.sin(i / (L.length - 1) * Math.PI) * 40 + wave(t, 1, 4, i); ban += G(tr(x, y, popEl(t, Bv + i * .04, .4), wave(t, 1, 5, i)), path('M-44 0L44 0L0 90Z', DPAL[i % 8], 5) + ftext(0, 42, L[i], { size: 34, fill: '#fff', stroke: 'none' })); }
    return houseExt(t) + path('M90 720Q540 800 990 720', 'none', 5) + ban + aine({ x: CX, y: 1500, s: 1.35, expr: 'deadpan' }, t) + G(tr(CX, 1500 - 220 * 1.35, 1.35, -24), rect(-70, -14, 150, 34, '#ffd23f', 8, 5) + ftext(5, 10, 'AÎNÉ', { size: 24, fill: OL, stroke: 'none' })) +
      confetti(t, Bv, 30) + funTag(CX, 470, "VIE D'AÎNÉ", t, at(11, 'aine') - .1, { size: 64, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .4], [at(11, 'bienvenue'), 'tada', .6], [at(11, 'aine') - .1, 'pop', .6], [at(11, 'aine') + .3, 'crickets', .5]] });
// B012 — le petit frère fait une bêtise (gribouille le mur)… « parce qu'il est petit » : les parents fondent (cœurs)
B(12, { enter: 'whip', cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const Bt = at(12, 'betise'), P = at(12, 'parce'), k = seg(t, .2, Bt + .4);
    return salonF(t, { noSofa: 1 }) + scribble(60, 760, 420, 260, k, '#e2463a', 3) + scribble(120, 820, 300, 200, seg(t, .6, Bt + .6), '#5b8fd8', 7) + crayonSun(400, 760, seg(t, Bt, Bt + .4)) +
      theo({ x: 300, y: 1500, s: 1.3, expr: 'laugh', armR: [-70 + wave(t, 6, 25), -90], holdR: crayon(0, 0, .8, 200), flip: 0 }, t) +
      maman({ x: 720, y: 1520, s: 1.0, expr: t > P ? 'love' : 'shock', armL: t > P ? [150, 200] : [110, 100], flip: 1 }, t) + papa({ x: 930, y: 1520, s: 1.0, expr: t > P ? 'love' : 'shock', flip: 1 }, t) + (t > P ? heartsUp(t, 820, 1050, 6) : '') +
      funTag(270, 450, 'BÊTISE', t, Bt - .05, { size: 56, bg: SX.acc }) + funTag(800, 600, 'IL EST PETIT ♥', t, at(12, 'petit', 2) - .1, { size: 46, bg: '#ff8fb1' }); },
  sfx: [[.2, 'scratch', .5], [at(12, 'betise') - .05, 'pop', .6], [at(12, 'parce'), 'angel', .5], [at(12, 'petit', 2) - .1, 'kiss', .5], [at(12, 'petit', 2) + .2, 'sparkle', .4]] });
// B013 — toi, exactement la même chose → les parents explosent : cadre « exemple.png » qui tombe sur toi
B(13, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(13, 'devrais') && t < at(13, 'devrais') + .3 ? 7 : 0 }),
  draw: (t, d, T) => { const Dv = at(13, 'devrais'), Ex = at(13, 'exemple'), k = seg(t, .3, at(13, 'meme') + .4), fr = eOutBack(seg(t, Ex - .3, Ex + .1));
    return salonF(t, { noSofa: 1 }) + scribble(60, 760, 420, 260, k, '#e2463a', 3) + crayonSun(400, 760, seg(t, at(13, 'meme'), at(13, 'meme') + .4)) +
      aine({ x: 300, y: 1500, s: 1.3, expr: t > Dv ? 'terror' : 'happy', armR: t > Dv ? [70, 80] : [-70 + wave(t, 6, 25), -90], holdR: t > Dv ? '' : crayon(0, 0, .8, 200) }, t) +
      maman({ x: 720, y: 1520, s: 1.0, expr: t > Dv ? 'rage' : 'suspicious', armR: t > Dv ? [-150, -170] : [70, 80], face: { steamHead: t > Dv ? 1 : 0 }, flip: 1 }, t) + papa({ x: 930, y: 1520, s: 1.0, expr: t > Dv ? 'rage' : 'suspicious', face: { steamHead: t > Dv ? 1 : 0 }, flip: 1 }, t) +
      (fr > 0 ? G(tr(300, lerp(-400, 1060, fr)), rect(-210, -300, 420, 600, 'none', 14, 26, '#e8b923') + rect(-210, -300, 420, 600, 'none', 14, 7) + G(tr(0, 330), rect(-150, -30, 300, 60, '#e8b923', 10, 5) + ftext(0, 14, 'MODÈLE', { size: 36, fill: OL, stroke: 'none' }))) : '') +
      funTag(300, 450, 'MÊME CHOSE', t, at(13, 'exactement') - .05, { size: 50, bg: SX.cool }) + kword("L'EXEMPLE !", 790, 450, t, Ex - .05, { size: 80, fill: SX.acc2 }); },
  sfx: [[.3, 'scratch', .5], [at(13, 'exactement') - .05, 'pop', .6], [at(13, 'devrais'), 'boom', .6], [at(13, 'exemple') - .3, 'whoosh', .6], [at(13, 'exemple') + .1, 'thud', .8]] });
// B014 — 10 ans : baby-sitter (Lila bébé dans les bras, Théo sur les épaules), salaire 0 €
B(14, { enter: 'whip', cam: camHand(1.05, .6),
  draw: (t, d, T) => { const Bs = at(14, 'baby');
    return depth({ zoom: 1, x: wave(t, .3, 12) }, [{ z: 1.4, svg: chambreH(t), haze: .1 }, { z: 1, svg: aine({ x: CX, y: 1520, s: 1.35, expr: 'dizzy', armL: [150, 60], armR: [30, 120], rot: wave(t, 2, 3) }, t) + theo({ x: CX + 10, y: 1150, s: .72, expr: 'laugh', armL: [200, 220], armR: [-20, -40], legL: [140, 100], legR: [40, 80] }, t) + bebeLila({ x: CX + 150, y: 1240, s: .6, expr: 'cry', face: { fountain: 1 } }, t) }]) +
      funTag(250, 450, '10 ANS', t, at(14, '10') - .05, { size: 62, bg: SX.cool }) + funTag(760, 450, 'BABY-SITTER', t, Bs - .05, { size: 54, bg: SX.acc }) + funTag(760, 580, 'SALAIRE : 0 €', t, Bs + .4, { size: 40, bg: '#fff', fg: SX.ink }); },
  sfx: [[0, 'whoosh', .5], [at(14, '10') - .05, 'pop', .6], [at(14, 'baby') - .05, 'pop', .6], [at(14, 'baby') + .1, 'baby_coo', .5], [at(14, 'baby') + .4, 'error_beep', .5]] });
// B015 — 12 ans : professeur particulier (lunettes, baguette, tableau ; Théo s'endort)
B(15, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const Pf = at(15, 'professeur');
    return classroomT(t, ftext(540, 470, '2 + 2 = ?', { size: 110, fill: 'rgba(255,255,255,.85)', stroke: 'none' }) + ftext(540, 640, 'facile...', { size: 56, fill: 'rgba(255,255,255,.6)', stroke: 'none' })) +
      aine({ x: 250, y: 1520, s: 1.35, expr: 'effort', glasses: true, armR: [-40, -60], holdR: line(0, 0, 160, -60, 10, '#8a5a3a') }, t) + theo({ x: 800, y: 1520, s: 1.15, expr: 'sleep', headTilt: 18, flip: 1 }, t) + G(tr(800, 1440), rect(-170, -90, 340, 30, '#c58e55', 8, 6) + line(-150, -60, -150, 80, 10) + line(150, -60, 150, 80, 10)) + ftext(900, 1000 - ((t * 60) % 80), 'z', { size: 60, fill: '#fff' }) +
      funTag(250, 450, '12 ANS', t, at(15, '12') - .05, { size: 62, bg: SX.cool }) + funTag(700, 760, 'PROF PARTICULIER', t, Pf, { size: 40, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .4], [at(15, '12') - .05, 'pop', .6], [at(15, 'professeur'), 'scratch', .6], [at(15, 'particulier'), 'school_bell', .3], [at(15, 'particulier') + .3, 'hmm', .4]] });
// B016 — 14 ans : médiateur familial (arbitre au sifflet entre Théo et Lila qui se disputent le doudou)
B(16, { enter: 'drop', cam: () => ({ z: 1.05, hand: .6, shake: 3 }),
  draw: (t, d, T) => { const Md = at(16, 'mediateur'), tug = wave(t, 5, 30);
    return cuisine(t) + theo({ x: 220 + tug, y: 1520, s: 1.1, expr: 'rage', armR: [-10, 0], legL: [110, 100] }, t) + lila({ x: 860 + tug, y: 1520, s: 1.1, expr: 'rage', armL: [190, 180], flip: 1 }, t) + dTeddy(540 + tug, 1260, .8) +
      aine({ x: CX, y: 1460, s: 1.15, expr: 'effort', shirt: '#fff', armL: [200, 230], armR: [-90, -120], holdR: whistle(0, 0, .6, 10) }, t) + G(tr(CX, 1460 - 300 * 1.15), whistle(40, 70, .55)) +
      funTag(250, 450, '14 ANS', t, at(16, '14') - .05, { size: 62, bg: SX.cool }) + funTag(760, 450, 'MÉDIATEUR', t, Md - .05, { size: 56, bg: SX.acc }); },
  sfx: [[0, 'whistle', .7], [at(16, '14') - .05, 'pop', .6], [at(16, 'mediateur') - .05, 'whistle', .8], [at(16, 'familial'), 'boing', .5]] });
// B017 — 16 ans : chauffeur officiel (casquette, clés, devant la maison)
B(17, { enter: 'whip', cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const Ch = at(17, 'chauffeur'), hy = 1500 - 402 * 1.05;
    return houseExt(t, { car: false }) + dCar(820, 1560, 1.0, '#5ec4f0', 1) + aine({ x: 340, y: 1500, s: 1.05, g: 1, expr: t > Ch ? 'proud' : 'neutral', armR: [-40, -70], holdR: G(tr(0, 0), circ(0, 0, 18, 'none', 6, '#c9a020') + rect(10, -8, 50, 16, '#c9a020', 4, 4)) }, t) + (t > Ch ? capC(340, hy, 92 * 1.05) : '') +
      funTag(250, 450, '16 ANS', t, at(17, '16') - .05, { size: 62, bg: SX.cool }) + kword('CHAUFFEUR', 700, 450, t, Ch - .05, { size: 82, fill: SX.acc2 }) + funTag(760, 580, 'OFFICIEL', t, at(17, 'officiel') - .05, { size: 46, bg: SX.acc }) + popStars(340, hy - 80, t, Ch); },
  sfx: [[0, 'whoosh', .5], [at(17, '16') - .05, 'pop', .6], [at(17, 'chauffeur') - .05, 'boom', .5], [at(17, 'chauffeur'), 'ding', .5], [at(17, 'officiel') - .05, 'pop', .6]] });
// B018 — dès que tu as le permis : cabriolet en ville, la fratrie à l'arrière, permis qui pop
B(18, { enter: 'none', trans: 'wipe', transD: .25, cam: () => ({ z: 1.05, hand: .4 }),
  draw: (t, d, T) => { const Pm = at(18, 'permis'), riders = aineHead(110, -270, 70, { g: 1, expr: 'deadpan' }, t) + capC(110, -270, 70) + theoHead(-110, -260, 60, { expr: 'ecstatic' }, t) + lilaHead(-250, -255, 58, { expr: 'joy' }, t);
    return depth({ zoom: 1, x: 0 }, [{ z: 1.5, svg: G(`translate(${f1(-(t * 300) % 300)} 0)`, streetT(t, 2)), haze: .1 }, { z: 1, svg: cabrio(CX, 1330, 1.4, t, riders) + motionLines(90, 1100, 4, 90, 0, '#fff') }]) +
      card(CX, 560, 420, 250, rect(-190, -110, 380, 220, '#ffc2d6', 14, 0) + ftext(-40, -50, 'PERMIS', { size: 46, fill: SX.ink, stroke: 'none' }) + G(tr(110, 10), aineHead(0, 0, 55, { g: 1, expr: 'neutral' }, t)) + [0, 1, 2].map(i => line(-170, 0 + i * 30, 30, i * 30, 5, 'rgba(0,0,0,.2)')).join(''), t, Pm - .1, { ry: 0, r: -5 }) + (t > Pm + .2 ? funTag(820, 690, '✓', t, Pm + .2, { size: 60, bg: '#36a85a' }) : ''); },
  sfx: [[0, 'whoosh', .6], [.1, 'wind', .4], [at(18, 'permis') - .1, 'pop_hi', .6], [at(18, 'permis') + .2, 'ding', .6]] });
// B019 — tu veux sortir avec tes amis ? : entrée, les potes à la porte, toi lunettes de soleil
B(19, { enter: 'whip', cam: zin(1.02, 1.08),
  draw: (t, d, T) => entree(t, { open: 1, friends: 1 }) + aine({ x: 250, y: 1500, s: 1.0, g: 1, expr: 'cool', armR: [-60, -100] }, t) + funTag(250, 560, 'SORTIR ?', t, at(19, 'sortir') - .05, { size: 56, bg: SX.cool }) + popStars(250, 1060, t, at(19, 'amis')),
  sfx: [[0, 'ring', .5], [at(19, 'sortir') - .05, 'pop', .6], [at(19, 'amis'), 'sparkle', .5]] });
// B020 — « Tu peux garder ta sœur ? » : maman te colle Lila dans les bras, tampon GARDE
B(20, { enter: 'punch', cam: () => ({ z: 1.06, shake: 4 }),
  draw: (t, d, T) => { const k = eOutBack(seg(t, 0, .35));
    return entree(t, { open: 1, friends: 1 }) + maman({ x: lerp(1300, 870, k), y: 1530, s: 1.05, expr: 'happy', armL: [190, 200], flip: 1 }, t) + aine({ x: 360, y: 1500, s: 1.0, g: 1, expr: 'jawdrop', armL: [30, 0], armR: [150, 180] }, t) + lila({ x: lerp(900, 420, k), y: 1290, s: .7, expr: 'joy', armL: [200, 230], armR: [-20, -50] }, t) +
      stamp(CX + 130, 520, 'GARDE', t, at(20, 'garder'), '#e2463a', -10, 84); },
  sfx: [[0, 'whoosh', .7], [at(20, 'garder'), 'thud', .8], [at(20, 'soeur'), 'boing', .5]] });
// B021 — tu veux acheter quelque chose ? : devant la vitrine, toi + ta tirelire
B(21, { enter: 'whip', cam: zin(1.02, 1.08),
  draw: (t, d, T) => shopFront(t) + aine({ x: 300, y: 1500, s: 1.0, g: 1, expr: 'love', armL: [110, 60], armR: [70, 120] }, t) + piggy(300, 1270, .55, wave(t, 3, 5)) + funTag(760, 580, 'ACHETER ?', t, at(21, 'acheter') - .05, { size: 54, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'whoosh', .4], [at(21, 'acheter') - .05, 'kaching', .6], [at(21, 'chose'), 'sparkle', .5]] });
// B022 — pense à ton petit frère : Théo aux yeux de chat potté, les pièces s'envolent vers lui
B(22, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const F = at(22, 'frere'); let coins = ''; for (let i = 0; i < 6; i++) { const k = seg(t, .1 + i * .08, .6 + i * .08); if (k > 0) coins += coin(lerp(320, 760, k), 1150 - Math.sin(k * 3.14) * 300 + i * 10, .9, k * 360); }
    return shopFront(t) + aine({ x: 280, y: 1500, s: 1.0, g: 1, expr: 'sob' }, t) + piggy(280, 1270, .55, 180) + coins + theoHead(760, 860, 200, { expr: 'wow', face: { eyes: 'huge' } }, t) + sparkle(700, 780, .5 + .2 * Math.sin(t * 12), '#fff') + sparkle(820, 780, .5 + .2 * Math.sin(t * 12 + 1), '#fff') +
      funTag(760, 450, 'TON FRÈRE ♥', t, F - .1, { size: 54, bg: '#ff8fb1' }); },
  sfx: [[0, 'flash_hit', .4], [.1, 'coins', .7], [at(22, 'frere') - .1, 'pop', .6], [at(22, 'frere'), 'sparkle', .6]] });
// B023 — 5 minutes de tranquillité ? : toi sur le lit (casque), compte à rebours… la porte explose, Théo et Lila débarquent
B(23, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: 1.05, shake: t > at(23, 'tranquillite') && t < at(23, 'tranquillite') + .35 ? 8 : 0 }),
  draw: (t, d, T) => { const Tq = at(23, 'tranquillite'), k = seg(t, at(23, '5'), Tq), j = eOutBack(seg(t, Tq, Tq + .35)); const sec = Math.max(0, Math.round(300 * (1 - k)));
    return chambreH(t) + aine({ x: 380, y: 1520, s: 1.0, g: 1, expr: t > Tq ? 'panic' : 'chill', armL: [200, 260], armR: [-20, -80] }, t) + G(tr(380, 1520 - 402), path('M-100 -10Q0 -130 100 -10', 'none', 14, '#2b2b33') + rect(-118, -30, 36, 70, '#e2463a', 14, 5) + rect(82, -30, 36, 70, '#e2463a', 14, 5)) +
      (j > 0 ? theo({ x: lerp(1300, 760, j), y: 1500, s: 1.0, expr: 'ecstatic', armL: [200, 230], armR: [-20, -50], rot: -10 }, t) + lila({ x: lerp(1400, 930, j), y: 1500, s: .95, expr: 'ecstatic', armL: [200, 230], flip: 1 }, t) + burst(840, 900, 240, t, Tq, SX.acc2) : '') +
      G(tr(760, 520), rect(-200, -80, 400, 160, '#2b2b33', 30, 7) + ftext(0, 34, `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`, { size: 96, fill: sec < 30 ? SX.acc : '#7be07b', stroke: 'none' })); },
  sfx: [[at(23, '5'), 'tick', .5], [at(23, '5') + .2, 'clock_fast', .5], [at(23, 'tranquillite'), 'thud', .8], [at(23, 'tranquillite') + .05, 'boing', .6], [at(23, 'tranquillite') + .2, 'boom', .5]] });
// B024a — « comme tu es le premier enfant » : labo, toi dans un tube « PROTOTYPE N°1 », parents en blouse
B(24, { enter: 'none', trans: 'glitch', transD: .25, cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const Pr = at(24, 'premier');
    return laboA(t) + papa({ x: 150, y: 1540, s: 1.0, expr: 'smug', shirt: '#fff', coat: true, armR: [-30, -60], holdR: rect(-30, -50, 60, 80, '#c8955a', 6, 5) }, t) + maman({ x: 930, y: 1540, s: 1.0, expr: 'wow', shirt: '#fff', coat: true, flip: 1 }, t) +
      aine({ x: CX, y: 1500, s: 1.3, expr: 'worried' }, t) + G(tr(CX, 1500), rect(-190, -560, 380, 580, 'rgba(180,230,255,.28)', 80, 7) + ell(-110, -420, 24, 90, 'rgba(255,255,255,.5)', 0) + rect(-210, -600, 420, 50, '#9aa3ad', 20, 6) + rect(-210, -10, 420, 50, '#9aa3ad', 20, 6)) +
      funTag(CX, 430, 'PROTOTYPE N°1', t, Pr - .1, { size: 56, bg: SX.acc }) + funTag(CX + 240, 560, 'V1.0', t, at(24, 'enfant'), { size: 44, bg: SX.cool }); },
  sfx: [[0, 'zap', .5], [.2, 'magic', .4], [at(24, 'premier') - .1, 'pop', .6], [at(24, 'enfant'), 'typing', .5]] });
// B024b — « tes parents expérimentent absolument tout sur toi » : bras robots (brocoli, réveil, livre), checklist TEST
B(24, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .5 }),
  draw: (t, d, T) => { const E = at(24, 'experimentent') - O24, Ab = at(24, 'absolument') - O24, To = at(24, 'tout') - O24;
    const arm = (x0, y0, x1, y1, item, k) => k <= 0 ? '' : (() => { const x = lerp(x0, x1, eOutBack(k)), y = lerp(y0, y1, eOutBack(k)); return path(`M${x0} ${y0}Q${(x0 + x) / 2} ${y0 + 200} ${x} ${y}`, 'none', 34, '#9aa3ad').replace('/>', '/>') + path(`M${x0} ${y0}Q${(x0 + x) / 2} ${y0 + 200} ${x} ${y}`, 'none', 18, '#c9d3dc') + circ(x, y, 26, '#ffd23f', 6) + G(tr(x, y + 70), item); })();
    return laboA(t) + aine({ x: CX, y: 1500, s: 1.3, expr: t > To ? 'dizzy' : 'terror', tremble: 1 }, t) + sweatSpray(CX, 1100, t, 4) +
      arm(-120, 200, 300, 760, brocoli(0, 0, 1.2), seg(t, E, E + .3)) + arm(1200, 220, 790, 740, alarmClock(0, 0, .9, t), seg(t, Ab, Ab + .3)) + arm(CX, -150, CX + 10, 520, bookB(0, 20, .7, 8, '#5b8fd8', 'RÈGLES'), seg(t, To - .1, To + .2)) +
      ['TEST ✓', 'TEST ✓', 'TEST ✗'].map((s_, i) => funTag(i === 1 ? 870 : 200, 1000 + (i === 2 ? 120 : 0) - 60, s_, t, [E + .3, Ab + .3, To + .2][i], { size: 36, bg: i === 2 ? SX.acc : '#36a85a' })).join('') +
      kword('TOUT !', CX, 420, t, To - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[at(24, 'experimentent') - O24, 'zap', .6], [at(24, 'experimentent') - O24 + .3, 'ding', .5], [at(24, 'absolument') - O24, 'zap', .6], [at(24, 'absolument') - O24 + .3, 'ring', .4], [at(24, 'tout') - O24 - .05, 'boom', .5], [at(24, 'toi') - O24, 'error_beep', .5]] }, O24);
// B025 — les règles strictes : papier, rouleau de règlement qui se déroule jusqu'en bas
B(25, { enter: 'none', trans: 'wipe', transD: .2, cam: () => ({ z: 1.04, hand: .3 }),
  draw: (t, d, T) => paper('#fff1d6') + gobo(T, .1) + ruleScroll(CX, 470, seg(t, .05, .6), ['Pas de télé', 'Pas de bonbons', 'Devoirs AVANT', 'Lit à 20 h', 'Pas de « mais »', 'Exemple TOUJOURS', 'Voir règle n°6']) + cutout(papaHead(900, 1060, 110, { expr: 'angry' }, t), 8) +
    kword('RÈGLES STRICTES', CX, 360, t, at(25, 'regles') - .05, { size: 74, fill: SX.acc2 }),
  sfx: [[0, 'whoosh', .5], [.1, 'scratch', .5], [at(25, 'regles') - .05, 'boom', .5], [at(25, 'strictes'), 'thud', .6]] });
// B026 — les interdictions : salon, panneaux d'interdiction qui poussent autour de toi
B(26, { enter: 'drop', cam: () => ({ z: 1.05 }),
  draw: (t, d, T) => { const I = at(26, 'interdictions') - .2;
    return salonF(t) + aine({ x: CX, y: 1520, s: 1.05, g: 1, expr: 'sad' }, t) + noSign(220, 620, 1, t, I, icoPhone) + noSign(860, 600, 1, t, I + .1, icoCandy) + noSign(200, 960, .9, t, I + .2, icoGame) + noSign(880, 950, .9, t, I + .3, icoMoon) +
      kword('INTERDIT', CX, 420, t, at(26, 'interdictions'), { size: 90, fill: '#fff' }); },
  sfx: [[at(26, 'interdictions') - .2, 'pop', .6], [at(26, 'interdictions') - .1, 'pop', .6], [at(26, 'interdictions'), 'error_beep', .5], [at(26, 'interdictions') + .1, 'pop', .6]] });
// B027 — les heures de coucher : chambre de nuit, toi au lit les yeux grands ouverts, réveil 20:00
B(27, { enter: 'none', trans: 'circle', transD: .25, cam: zin(1.02, 1.1),
  draw: (t, d, T) => bedroomN(t) + aineHead(670, 1110, 80, { g: 1, expr: 'deadpan', face: { eyes: 'wide' }, tilt: -80 }, t) + G(tr(820, 1260), path('M-180 -120Q20 -160 270 -110L280 0L-180 0Z', '#5ec4f0', 6)) + G(tr(CX, 560), rect(-200, -80, 400, 160, '#141a3a', 30, 7) + ftext(0, 34, Math.sin(t * 8) > 0 ? '20:00' : '20 00', { size: 100, fill: SX.acc, stroke: 'none' })) +
    funTag(CX, 400, 'AU LIT !', t, at(27, 'couch'), { size: 56, bg: '#8a6ad8' }),
  sfx: [[0, 'crickets', .5], [at(27, 'heures'), 'tick', .6], [at(27, 'couch'), 'pop', .6]] });
// B028 — 15 ans : rentrer à 18 h (la fête commence à peine, maman te tire par le col)
B(28, { enter: 'whip', cam: (t, d) => ({ z: 1.05, hand: .5, shake: t > at(28, '18') && t < at(28, '18') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const H18 = at(28, '18'), k = eOutCubic(seg(t, H18, H18 + .6));
    return partyT(t) + aine({ x: lerp(560, 330, k), y: 1500, s: 1.0, g: 1, expr: t > H18 ? 'sob' : 'ecstatic', armL: t > H18 ? [180, 200] : [230, 250 + wave(t, 4, 20)], armR: [-50 + wave(t, 4, 20), -80], rot: -12 * k }, t) + (t > H18 ? maman({ x: lerp(-200, 90, k), y: 1530, s: 1.0, expr: 'angry', armR: [-10, -20] }, t) : '') +
      funTag(260, 450, '15 ANS', t, at(28, '15') - .05, { size: 62, bg: SX.cool }) + G(tr(780, 520, 1 + .06 * Math.sin(t * 20) * (t > H18)), rect(-200, -80, 400, 160, '#2b2b33', 30, 7) + ftext(0, 34, '18:00', { size: 100, fill: t > H18 ? SX.acc : '#fff', stroke: 'none' })); },
  sfx: [[0, 'drum', .5], [at(28, '15') - .05, 'pop', .6], [at(28, '18'), 'ring', .8], [at(28, '18') + .1, 'scratch', .6], [at(28, 'heures'), 'whoosh', .5]] });
// B029 — ton petit frère, lui, sort jusqu'à 22 h : roi de la soirée (lunettes, couronne), horloge 22:00 verte
B(29, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const L = at(29, 'lui');
    return partyT(t) + theo({ x: CX, y: 1500, s: 1.25, expr: 'shadesGrin', armL: [220, 250 + wave(t, 4, 25)], armR: [-40 + wave(t, 4, 25), -80], rot: wave(t, 4, 5) }, t) + crown(CX, 1500 - 292 * 1.25 - 95, .9) + popStars(CX, 900, t, at(29, 'sort'), 8, 320) +
      funTag(260, 450, 'LUI ?', t, L - .05, { size: 62, bg: SX.acc }) + G(tr(780, 520), rect(-200, -80, 400, 160, '#2b2b33', 30, 7) + ftext(0, 34, '22:00', { size: 100, fill: '#7be07b', stroke: 'none' })) + (t > at(29, '22') ? funTag(780, 680, 'OK !', t, at(29, '22'), { size: 50, bg: '#36a85a' }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(29, 'lui') - .05, 'pop', .6], [at(29, 'sort'), 'drum', .5], [at(29, '22'), 'jackpot', .5], [at(29, 'heures'), 'sparkle', .5]] });
// B030 — « À 13 ans. » : crash zoom, toi mâchoire au sol
B(30, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.25, 1.05, eOutCubic(clamp(t / .2))), shake: 7 }),
  draw: (t, d, T) => rays(t, CX, 880, '#ffd3d4', '#ff9a9c', 22) + aineHead(CX, 900, 240, { g: 1, expr: 'jawdrop' }, t) + kword('13 ANS ?!', CX, 480, t, 0, { size: 110, fill: '#fff' }),
  sfx: [[0, 'flash_hit', .6], [.05, 'boom', .6], [.2, 'gasp', .5]] });
// B031 — « Oui, mais on a appris à faire confiance » : parents zen sur le canapé, cœurs ; toi blasé
B(31, { enter: 'whip', cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const Cf = at(31, 'confiance');
    return salonF(t) + maman({ x: 380, y: 1430, s: .95, expr: 'zen', armL: [150, 90], armR: [30, 90] }, t) + papa({ x: 640, y: 1430, s: .95, expr: 'zen', armL: [150, 90], armR: [30, 90] }, t) + heartsUp(t, 510, 980, 6) + glow(510, 900, 320, '#fff6c8', .35) +
      aine({ x: 900, y: 1500, s: 1.0, g: 1, expr: 'deadpan', flip: 1 }, t) + funTag(510, 450, 'CONFIANCE ♥', t, Cf - .05, { size: 56, bg: '#ff8fb1' }) + markerArrow(930, 640, 900, 820, t, Cf + .2, { bend: 40, col: SX.acc }) + markerText('et moi ?', 900, 600, t, Cf + .2, { size: 48, col: SX.acc2 }); },
  sfx: [[0, 'angel', .5], [at(31, 'appris'), 'magic', .4], [at(31, 'confiance') - .05, 'pop', .6], [at(31, 'confiance') + .2, 'scratch', .5]] });
// B032 — « Ah ! Donc j'étais la version bêta » : prise de conscience (étoiles), boîte BÊTA pleine de bugs vs boîte v2.0 brillante
B(32, { enter: 'none', trans: 'glitch', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bt = at(32, 'beta');
    return gridBg(SX.ink) + halftoneFade(SX.acc, .07, 1) + unlock(300, 860, t, Bt, { part: 'back', r: 420 }) + betaBox(300, 880, 1, t, 'v0.1', 'BÊTA — AÎNÉ', '#9aa3ad', t > Bt ? 4 : 0) + unlock(300, 860, t, Bt, { part: 'front', r: 420 }) +
      betaBox(790, 880, .85, t, 'v2.0', 'THÉO', SX.cool, 0) + sparkle(900, 640, .5 + .2 * Math.sin(t * 9), '#fff') + cutout(aineHead(300, 1150 - 60, 80, { g: 1, expr: t > at(32, 'ah') + .3 ? 'jawdrop' : 'shock' }, t) + theoHead(790, 1150 - 60, 70, { expr: 'cool' }, t), 6) +
      funTag(CX, 380, 'AH !', t, at(32, 'ah') - .05, { size: 56, bg: '#fff', fg: SX.ink }) + kword('VERSION BÊTA', CX, 500, t, Bt - .05, { size: 90, fill: SX.acc2 }); },
  sfx: [[at(32, 'ah') - .05, 'gasp', .6], [at(32, 'version'), 'typing', .4], [at(32, 'beta') - .05, 'boom', .5], [at(32, 'beta'), 'error_beep', .5], [at(32, 'parentalite'), 'buzz', .4]] });
// B033 — puis les années passent : papier, pages de calendrier qui s'envolent, années qui défilent
B(33, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { let s = paper(SX.paper) + gobo(T, .1); const yr = counter(2009, 2019, t, .1, d - .2);
    for (let i = 0; i < 7; i++) { const k = ((t * 1.6 + i / 7) % 1); s += op(1 - k * .7, calPage(CX + (i % 2 ? 1 : -1) * (100 + k * 400), 860 - k * 500, .7, k * 200 * (i % 2 ? 1 : -1), String(2009 + i))); }
    return s + calPage(CX, 900, 1.3, wave(t, 2, 4), String(yr)) + kthin('les années', CX, 380, t, 0, { size: 60, fill: SX.ink }) + kword('PASSENT', CX, 500, t, at(33, 'passent') - .05, { size: 100, fill: SX.acc }); },
  sfx: [[0, 'whoosh', .6], [.1, 'clock_fast', .6], [at(33, 'passent') - .05, 'rewind', .4], [at(33, 'passent') + .2, 'whoosh', .5]] });
// B034 — ton frère grandit : entrée, il pousse à côté de la toise (marques), toi adulte fier
B(34, { enter: 'drop', cam: zin(1.0, 1.05),
  draw: (t, d, T) => { const g = eOutBack(seg(t, at(34, 'grandit') - .2, at(34, 'grandit') + .3));
    return entree(t) + (g < .5 ? theo({ x: 640, y: 1500, s: 1.2, expr: 'happy' }, t) : person(Object.assign({ age: 'adult' }, THEO, { x: 640, y: 1520, s: lerp(.85, 1.05, g), expr: 'proud' }), t)) + motionLines(640, 700, 3, 60, -90) +
      aine({ x: 230, y: 1520, s: 1.0, g: 2, expr: 'proud' }, t) + funTag(640, 450, 'GRANDIT', t, at(34, 'grandit') - .05, { size: 56, bg: SX.cool }); },
  sfx: [[0, 'thud', .4], [at(34, 'grandit') - .2, 'whoosh_up', .7], [at(34, 'grandit') + .3, 'boing', .5]] });
// B035a — « un jour, quelqu'un lui demande » : interview dans la rue, micro TV, caméra
B(35, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => streetT(t, 2) + person(Object.assign({ age: 'adult' }, THEO, { x: 720, y: 1530, s: 1.05, expr: 'happy', flip: 1 }), t) + adult(1, { x: 300, y: 1530, s: 1.0, expr: 'talk', armR: [-20, -40], holdR: micro(0, 0, .9, 70) }, t) +
    funTag(CX, 450, 'INTERVIEW', t, at(35, 'jour'), { size: 56, bg: SX.acc }) + G(tr(170, 360), circ(0, 0, 16, Math.sin(t * 6) > 0 ? '#ff3b30' : 'rgba(0,0,0,0)', 0) + ftext(30, 14, 'REC', { size: 40, anchor: 'start', fill: '#fff' })),
  sfx: [[0, 'whoosh', .5], [at(35, 'jour'), 'pop', .6], [at(35, 'demande'), 'hmm', .4]] });
// B035b — « qui lui a appris à faire du vélo ? » : flashback sépia au parc, toi petit qui tiens la selle
B(35, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const V = at(35, 'velo') - O35, x = lerp(300, 620, t / d);
    return parkA(t) + dBike(x + 120, 1500, 1.4, '#e2463a') + theo({ x: x + 120, y: 1400, s: .95, expr: 'terror', armL: [-10, 10], armR: [-20, 0], legL: [60, 120], legR: [100, 60] }, t) + aine({ x: x - 120, y: 1500, s: 1.1, expr: 'effort', armR: [-10, 10], walk: 3 }, t) + motionLines(x - 280, 1150, 3, 70, 0) +
      SEPIA() + funTag(CX, 450, 'LE VÉLO', t, V - .1, { size: 60, bg: SX.acc2, fg: SX.ink }) + funTag(170, 610, 'FLASHBACK', t, 0, { size: 34, bg: '#c8955a' }); },
  sfx: [[0, 'magic', .4], [.2, 'steps', .5], [at(35, 'velo') - O35 - .1, 'ring', .6], [at(35, 'velo') - O35 + .3, 'boing', .4]] }, O35);
// B036 — « Il répond : mon grand frère » : Théo adulte te désigne, toi adulte gêné et fier
B(36, { enter: 'whip', cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const Mg = at(36, 'mon');
    return streetT(t, 2) + person(Object.assign({ age: 'adult' }, THEO, { x: 300, y: 1530, s: 1.05, expr: 'joy', armR: t > Mg ? [-8, -5] : [70, 80] }), t) + aine({ x: 820, y: 1530, s: 1.05, g: 2, expr: 'embarrassed', flip: 1 }, t) + (t > Mg ? heartsUp(t, 820, 1000, 4) : '') +
      funTag(CX, 450, 'MON GRAND FRÈRE', t, Mg - .05, { size: 54, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .4], [at(36, 'mon') - .05, 'pop', .7], [at(36, 'frere'), 'sparkle', .6]] });
// B037 — « À faire ses devoirs : mon grand frère » : flashback chambre, toi qui aides Théo au bureau, compteur ×2
B(37, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const Mg = at(37, 'mon');
    return chambreH(t) + G(tr(CX, 1300), rect(-330, -40, 660, 34, '#b98552', 8, 6) + line(-300, -6, -300, 200, 12) + line(300, -6, 300, 200, 12)) + dDeskLamp(780, 1260, 1, t) + bookB(470, 1200, .6, -80, '#5b8fd8', 'MATHS') +
      theo({ x: 420, y: 1500, s: 1.05, expr: 'confused', armR: [-30, -60], holdR: crayon(0, 0, .6, 30, '#ffd23f') }, t) + aine({ x: 660, y: 1500, s: 1.15, expr: 'happy', armL: [200, 210], flip: 1 }, t) + SEPIA() +
      funTag(CX, 450, 'DEVOIRS', t, at(37, 'devoirs') - .05, { size: 56, bg: SX.cool }) + funTag(CX, 580, 'MON GRAND FRÈRE ×2', t, Mg - .05, { size: 46, bg: SX.acc }); },
  sfx: [[.1, 'scratch', .5], [at(37, 'devoirs') - .05, 'pop', .6], [at(37, 'mon') - .05, 'pop', .7], [at(37, 'frere'), 'ding', .5]] });
// B038 — « À ne pas avoir peur de la rentrée : encore toi » : cour d'école, toi qui tiens la main de Théo (gros cartable), ENCORE TOI ×3
B(38, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const En = at(38, 'encore');
    return schoolyard(t) + aine({ x: 380, y: 1500, s: 1.25, expr: 'proud', armR: [30, 40] }, t) + G(tr(730, 1440 - 170), dBag(0, 60, 1.1, '#e2463a', 8)) + theo({ x: 650, y: 1440, s: 1.0, expr: t > at(38, 'rentr') ? 'happy' : 'scared', armL: [150, 160], tremble: t < at(38, 'rentr') ? 1 : 0 }, t) + SEPIA() +
      funTag(650, 450, 'RENTRÉE', t, at(38, 'rentr') - .1, { size: 56, bg: SX.cool }) + kword('ENCORE TOI ×3', CX, 600, t, En - .05, { size: 78, fill: SX.acc2 }); },
  sfx: [[0, 'school_bell', .5], [at(38, 'peur'), 'gasp', .4], [at(38, 'rentr') - .1, 'pop', .6], [at(38, 'encore') - .05, 'boom', .5], [at(38, 'toi'), 'tada', .4]] });
// B039 — « Et là, tu réalises quelque chose » : gros plan toi adulte, déclic en étoiles
B(39, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.12, eInOut(t / d)) }),
  draw: (t, d, T) => { const Rz = at(39, 'realises');
    return salonF(t, { night: 1 }) + op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#1a1030', 0, 0)) + unlock(CX, 860, t, Rz, { part: 'back', r: 500 }) + aineHead(CX, 880, 240, { g: 2, expr: t > Rz ? 'wow' : 'deadpan' }, t) + unlock(CX, 860, t, Rz, { part: 'front', r: 500 }) + funBox(CX, 900, 560, 560, t, Rz + .3, { label: 'déclic.png' }); },
  sfx: [[0, 'hmm', .4], [at(39, 'realises'), 'magic', .6], [at(39, 'realises') + .05, 'sparkle', .6], [at(39, 'chose'), 'heartbeat', .5]] });
// B040a — « tu as passé ton enfance » : papier, polaroïds de toi petit (baby-sitter, prof, arbitre)
B(40, { enter: 'none', trans: 'wipe', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const E = at(40, 'enfance');
    const p1 = aine({ x: 0, y: 70, s: .32, expr: 'dizzy' }, t) + bebeLila({ x: 40, y: 0, s: .2, expr: 'cry' }, t), p2 = aine({ x: -20, y: 70, s: .32, expr: 'effort', glasses: true }, t) + theo({ x: 50, y: 70, s: .26, expr: 'sleep' }, t), p3 = aine({ x: 0, y: 70, s: .32, expr: 'effort', shirt: '#fff' }, t);
    return paper('#ffe9c9') + gobo(T, .1) + polaroid(260, 820, 1.4, -8, p1, t, .05) + polaroid(CX, 760, 1.4, 4, p2, t, E - .3) + polaroid(820, 840, 1.4, 9, p3, t, E) + kthin('ton enfance…', CX, 420, t, at(40, 'passe'), { size: 64, fill: SX.ink }); },
  sfx: [[.05, 'shutter', .6], [at(40, 'enfance') - .3, 'shutter', .6], [at(40, 'enfance'), 'shutter', .6], [at(40, 'enfance') + .2, 'heartbeat', .3]] });
// B040b — « à essayer de devenir grand » : toi petit sur une pile de livres, sur la pointe des pieds, pour toucher la marque GRAND
B(40, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Gr = at(40, 'grand') - O40, up = eOutBack(seg(t, at(40, 'devenir') - O40 - .2, Gr));
    return entree(t) + G(tr(560, 1500), [0, 1, 2].map(i => bookB(0, -30 - i * 50, .9, 90, DPAL[i + 1], '')).join('')) + aine({ x: 560, y: 1340 - up * 80, s: 1.15, expr: 'effort', armR: [-50, -75], armL: [-130, -105], legL: [100, 95], legR: [80, 85], tremble: 1 }, t) + sweatSpray(560, 1340 - up * 80 - 340, t, 3) +
      G(tr(720, 560), line(-30, 0, 30, 0, 8, SX.acc) + ftext(40, 12, 'GRAND', { size: 34, fill: SX.acc, stroke: 'none', anchor: 'start' })) + kword('GRAND', CX, 420, t, Gr - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'squeak', .5], [at(40, 'devenir') - O40 - .2, 'whoosh_up', .6], [at(40, 'grand') - O40 - .05, 'boom', .4], [at(40, 'grand') - O40 + .2, 'boing', .4]] }, O40);
// B041 — FIN : « parce qu'on t'a demandé de l'être avant les autres » : coucher de soleil, câlin de la fratrie adulte,
//        médaille « MEILLEUR GRAND FRÈRE »… et Théo te tend son bébé (baby-sitter à vie)
B(41, { enter: 'drop', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Av = at(41, 'avant'), Au = at(41, 'autres'), md = eOutBack(seg(t, Av - .2, Av + .3));
    return houseExt(t, { dusk: 1, car: false }) + glow(CX, 900, 500, '#ffd88a', .35) +
      maman({ x: 130, y: 1500, s: .85, expr: 'love', old: .6 }, t) + papa({ x: 960, y: 1500, s: .85, expr: 'love', old: .6, flip: 1 }, t) +
      person(Object.assign({ age: 'adult' }, LILA, { x: 330, y: 1540, s: 1.0, expr: 'joy', armR: [-10, 10] }), t) + person(Object.assign({ age: 'adult' }, THEO, { x: 750, y: 1540, s: 1.0, expr: 'joy', armL: [190, 170], flip: 1 }), t) +
      aine({ x: CX, y: 1540, s: 1.05, g: 2, expr: t > Au ? 'laugh' : 'sob', face: t > Au ? {} : { tears: 1 }, armL: [160, 120], armR: [20, 60] }, t) +
      (t > Au ? bebeLila({ x: CX + 120, y: 1190, s: .5, expr: 'happy', shirt: '#bfe3ff', hairColor: '#e0a040' }, t) : '') +
      (md > 0 ? G(tr(CX + 60, 1540 - 260 * 1.05, md), nMedal(0, 0, 1.6)) : '') + heartsUp(t, CX, 1000, 6, 420) +
      kthin("on te l'a demandé", CX, 330, t, at(41, 'demande') - .1, { size: 54 }) + kword('AVANT LES AUTRES', CX, 450, t, Av - .05, { size: 76, fill: SX.acc2 }) +
      (t > Au ? funTag(CX, 600, 'BABY-SITTER À VIE', t, Au, { size: 44, bg: SX.acc }) + popStars(CX, 1000, t, Au, 8, 360) : ''); },
  sfx: [[0, 'whoosh', .4], [at(41, 'demande'), 'angel', .5], [at(41, 'avant') - .05, 'boom', .4], [at(41, 'avant') + .1, 'sparkle', .6], [at(41, 'autres'), 'baby_coo', .6], [at(41, 'autres') + .3, 'rimshot', .4]] });

SCENES.sort((a, b) => a.s - b.s);
