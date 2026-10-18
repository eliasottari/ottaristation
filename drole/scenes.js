// ============================================================
//  « Pourquoi c'est horrible d'être le mec drôle de la classe ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js : tools/prep.py)
//  TOTAL et BT viennent de timing.js. BT[n-1] = début du bloc n. Décors : bibliothèque reprise de aine/ et tache/ (préfixe q).
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
const M = 700;
// ---------- figurants + bibliothèque de décors (reprise de dernier/ et tache/, préfixe d) ----------
// figurants (utilisés par les décors copiés : kidsBg, streetT, galleryT)
const KH = ['curly', 'bun', 'spiky', 'ponytail', 'short', 'long'], KC = ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040', '#1f1a18', '#6b3e26'], KS = ['#ff8fb1', '#7aa6d8', '#7be07b', '#ff9a4d', '#b56cff', '#5ec4f0'], SK = ['#f2c9a0', '#c98a5e', '#f6d7b8', '#8a5a3a', '#e0b088', '#f2c9a0'];
const kid = (i, o, t) => person(Object.assign({ age: 'kid', hair: KH[i % 6], hairColor: KC[i % 6], shirt: KS[i % 6], skin: SK[i % 6], pants: '#3b3f4a', seed: 20 + i }, o), t);
const AH = ['side', 'bun', 'bald', 'long', 'short'], AC = ['#1f1a18', '#8a5a3a', '#7a6a5a', '#c4521b', '#d9d9de'], AS = ['#5b8fd8', '#e2463a', '#36a85a', '#ff9a4d', '#8a6ad8'];
const adult = (i, o, t) => person(Object.assign({ age: 'adult', hair: AH[i % 5], hairColor: AC[i % 5], shirt: AS[i % 5], skin: SK[(i + 2) % 6], pants: '#2f3b4e', seed: 60 + i, glasses: i % 3 === 0 }, o), t);
// ---------- décors : bibliothèque d'accessoires (reprise de tache/, préfixe d) ----------
const QPAL = ['#e2463a', '#5b8fd8', '#ffd23f', '#36a85a', '#ff8fb1', '#8a6ad8', '#ff9a4d', '#5ec4f0'];
const qHaze = (k = .35, col = '230,240,250', y1 = 1300) => rect(-M, -M, W + 2 * M, y1 + M, `rgba(${col},${k})`, 0, 0);
function qWall(kind, c1, c2, yb = 1250) { let s = rect(-M, -M, W + 2 * M, yb + M, c1, 0, 0);
  if (kind === 'stripe') for (let x = -M; x < W + M; x += 120) s += rect(x, -M, 48, yb + M, c2, 0, 0);
  if (kind === 'dot') for (let y = -40; y < yb; y += 90) for (let x = -M + ((y / 90) % 2 ? 45 : 0); x < W + M; x += 90) s += circ(x, y, 7, c2, 0);
  if (kind === 'diamond') for (let y = 0; y < yb; y += 110) for (let x = -M + ((y / 110) % 2 ? 55 : 0); x < W + M; x += 110) s += path(`M${x} ${y - 14}L${x + 10} ${y}L${x} ${y + 14}L${x - 10} ${y}Z`, c2, 0);
  if (kind === 'star') for (let y = 30; y < yb; y += 140) for (let x = -M + ((y / 140) % 2 ? 70 : 0); x < W + M; x += 140) s += ftext(x, y, '✦', { size: 26, fill: c2, stroke: 'none' });
  return s; }
const qBase = (yb, col = '#fff', h = 34) => rect(-M, yb - h, W + 2 * M, h, col, 0, 0) + line(-M, yb - h, W + M, yb - h, 5, shade(col, -.25));
function qParquet(yb, c) { let s = rect(-M, yb, W + 2 * M, 1500, c, 0, 0); const ys = [0, 28, 64, 112, 176, 260, 370, 510, 690]; ys.forEach((dy, i) => { s += line(-M, yb + dy, W + M, yb + dy, 4, shade(c, -.2)); const nx = ys[i + 1]; if (nx !== undefined) for (let x = -M + (i % 2) * 110; x < W + M; x += 220) s += line(x, yb + dy, x, yb + nx, 4, shade(c, -.2)); }); return s + line(-M, yb, W + M, yb, 8, shade(c, -.35)); }
function qTileFloor(yb, c1, c2) { let s = rect(-M, yb, W + 2 * M, 1500, c1, 0, 0); const ys = [0, 40, 95, 170, 270, 400, 570, 800]; for (let i = 0; i < ys.length - 1; i++) { const h = ys[i + 1] - ys[i], w = h * 1.6; for (let k = 0, x = -M; x < W + M; x += w, k++) if ((k + i) % 2) s += rect(x, yb + ys[i], w, h, c2, 0, 0); } return s + line(-M, yb, W + M, yb, 7, shade(c1, -.3)); }
const qOutlet = (x, y) => rect(x - 22, y - 30, 44, 60, '#f4f1ea', 8, 4) + circ(x - 8, y, 4, OL, 0) + circ(x + 8, y, 4, OL, 0);
const qSwitch = (x, y) => rect(x - 24, y - 34, 48, 68, '#f4f1ea', 8, 4) + rect(x - 9, y - 16, 18, 32, '#dcd6cc', 4, 3);
function qPic(kind, w, h) { const a = -w / 2 + 12, b = -h / 2 + 12, iw = w - 24, ih = h - 24;
  if (kind === 'mount') return rect(a, b, iw, ih, '#cfe8f5', 0, 0) + path(`M${a} ${b + ih}L${a + iw * .35} ${b + ih * .35}L${a + iw * .6} ${b + ih * .7}L${a + iw * .75} ${b + ih * .5}L${a + iw} ${b + ih}Z`, '#7bbf5a', 3) + circ(a + iw * .78, b + ih * .25, ih * .12, '#ffd23f', 3);
  if (kind === 'heart') return rect(a, b, iw, ih, '#ffe1ee', 0, 0) + heart(0, 4, Math.min(iw, ih) / 120, '#ff5d73');
  if (kind === 'face') return rect(a, b, iw, ih, '#fff1c8', 0, 0) + circ(0, ih * .08, ih * .28, '#f2c9a0', 3) + path(`M${-ih * .28} ${-ih * .02}Q0 ${-ih * .38} ${ih * .28} ${-ih * .02}`, '#6b3e26', 3) + path(`M${-ih * .1} ${ih * .18}Q0 ${ih * .25} ${ih * .1} ${ih * .18}`, 'none', 3);
  if (kind === 'sea') return rect(a, b, iw, ih, '#bfe3ff', 0, 0) + rect(a, b + ih * .55, iw, ih * .45, '#4d9fd8', 0, 0) + path(`M${a + iw * .3} ${b + ih * .55}L${a + iw * .45} ${b + ih * .2}L${a + iw * .5} ${b + ih * .55}Z`, '#fff', 3);
  return rect(a, b, iw, ih, '#e1f5d6', 0, 0) + circ(0, 0, ih * .25, '#ff9a4d', 3); }
const qFrame = (x, y, w, h, kind = 'mount', col = '#c38a52', r = 0) => G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, col, 6, 6) + qPic(kind, w, h) + rect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 'none', 2, 3));
function qPoster(x, y, w, h, bg, r, inner = '', t = 0) { const fl = Math.sin(t * 2.4 + x) * 3; return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, bg, 6, 5) + inner + path(`M${w / 2 - 34} ${h / 2}L${w / 2} ${h / 2 - 34 + fl}L${w / 2} ${h / 2}Z`, shade(bg, -.2), 3) + rect(-18, -h / 2 - 10, 36, 18, 'rgba(255,255,255,.75)', 3, 0)); }
function qBooks(x, y, w, seed = 1) { const r = rng(seed); let s = '', cx = x; while (cx < x + w - 20) { const bw = 18 + r() * 14, bh = 56 + r() * 34, c = QPAL[Math.floor(r() * 8)]; if (r() < .12 && cx + bh < x + w) { s += rect(cx, y - bw, bh, bw, c, 3, 4); cx += bh + 4; continue; } s += rect(cx, y - bh, bw, bh, c, 3, 4) + line(cx + 4, y - bh + 12, cx + bw - 4, y - bh + 12, 3, 'rgba(255,255,255,.6)'); cx += bw + 2; } return s; }
const qShelf = (x, y, w, items = '', col = '#b5835a') => items + rect(x, y, w, 18, col, 4, 5) + path(`M${x + 24} ${y + 18}L${x + 24} ${y + 50}L${x + 56} ${y + 18}`, 'none', 5) + path(`M${x + w - 24} ${y + 18}L${x + w - 24} ${y + 50}L${x + w - 56} ${y + 18}`, 'none', 5);
const qJar = (x, y, c = '#ffd23f', s = 1) => G(tr(x, y, s), rect(-24, -64, 48, 64, 'rgba(220,240,255,.85)', 10, 4) + rect(-20, -40, 40, 36, c, 6, 0) + rect(-26, -76, 52, 16, '#c96a3a', 5, 4));
const qTrophy = (x, y, s = 1) => G(tr(x, y, s), rect(-30, -16, 60, 16, '#6b3e26', 3, 4) + rect(-8, -46, 16, 30, '#e8b923', 0, 4) + path('M-34 -96L34 -96Q34 -46 0 -46Q-34 -46 -34 -96Z', '#ffd23f', 4) + path('M-34 -88Q-56 -84 -46 -64M34 -88Q56 -84 46 -64', 'none', 4) + ftext(0, -64, '1', { size: 22, fill: '#a0703f', stroke: 'none' }));
const qTeddy = (x, y, s = 1, c = '#c9935c') => G(tr(x, y, s), ell(0, -38, 40, 40, c, 5) + circ(-30, -96, 13, c, 5) + circ(30, -96, 13, c, 5) + circ(0, -82, 30, c, 5) + ell(0, -74, 12, 9, '#f1d2a8', 0) + circ(-10, -88, 4, OL, 0) + circ(10, -88, 4, OL, 0) + circ(0, -77, 4, OL, 0) + ell(-28, -8, 16, 11, c, 4) + ell(28, -8, 16, 11, c, 4));
function qPot(x, y, s, t, kind = 0, potC = '#d9825b') { const sw = wave(t, .5, 4, x * .01); let lv = '';
  if (kind === 0) for (let i = 0; i < 5; i++) lv += G(tr(0, -60, 1, -60 + i * 30 + sw), ell(0, -55, 18, 55, ['#5fb85f', '#4fa64f', '#6cc46c'][i % 3], 4));
  else if (kind === 1) lv += G(tr(0, -60, 1, sw), rect(-18, -150, 36, 150, '#5aa76a', 18, 4) + rect(-58, -110, 26, 70, '#5aa76a', 13, 4) + rect(32, -126, 26, 60, '#5aa76a', 13, 4));
  else for (let i = 0; i < 7; i++) lv += G(tr(0, -60, 1, -75 + i * 25 + sw), path('M0 0Q-16 -60 0 -120Q16 -60 0 0Z', '#4fa64f', 3));
  return G(tr(x, y, s), lv + path('M-46 -62L46 -62L36 0L-36 0Z', potC, 5) + rect(-52, -74, 104, 18, shade(potC, -.15), 5, 5)); }
function qCurtain(x, y, w, h, col, t, side = 1) { let d = `M${x} ${y}L${x + w} ${y}`; const n = 5; for (let i = 0; i <= n; i++) { const yy = y + h * i / n; d = d; } const sw = wave(t, .5, 14, x * .01);
  const xb = x + (side > 0 ? w * .7 + sw : w * .3 + sw), dd = side > 0 ? `M${x} ${y}L${x + w} ${y}Q${x + w * .55} ${y + h * .5} ${xb} ${y + h}L${x - 6} ${y + h}Z` : `M${x} ${y}L${x + w} ${y}L${x + w + 6} ${y + h}L${xb} ${y + h}Q${x + w * .45} ${y + h * .5} ${x} ${y}Z`;
  let s = path(dd, col, 6); for (let i = 1; i < 4; i++) s += path(`M${x + w * i / 4} ${y + 10}Q${x + w * i / 4 + sw * .4} ${y + h * .5} ${x + w * i / 4 + (side > 0 ? -1 : 1) * w * .12} ${y + h - 10}`, 'none', 4, shade(col, -.25)); return s + rect(x - 20, y - 14, w + 40, 18, '#8a5a3a', 8, 4); }
function qWindowView(x, y, w, h, t, o = {}) { const night = o.night; let s = grad(night ? '#0f163a' : '#9fd6ff', night ? '#2a3170' : '#e6f6ff', x, y, w, h);
  s += night ? circ(x + w * .72, y + h * .22, 34, '#fff6d6', 0) : cloud(x + ((t * 20) % (w + 160)) - 80, y + h * .25, .45, '#fff');
  for (let i = 0; i < 5; i++) { const bx = x + i * w / 5, bh = h * (.25 + ((i * 37) % 30) / 100); s += rect(bx, y + h - bh, w / 5 + 2, bh, night ? '#1a2048' : '#b9cfe0', 0, 0); for (let j = 0; j < 3; j++) s += rect(bx + 14, y + h - bh + 16 + j * 34, 14, 16, night ? (Math.sin(t * .7 + i * 3 + j) > -.3 ? '#ffe08a' : '#2e3570') : '#e6f2fb', 2, 0); }
  if (!night) s += circ(x + w * .2, y + h - 30, 46, '#6cc46c', 0) + circ(x + w * .3, y + h - 50, 40, '#5fb85f', 0);
  return s + rect(x, y, w, h, 'none', 8, 10, '#fff') + rect(x - 6, y - 6, w + 12, h + 12, 'none', 10, 6) + line(x + w / 2, y, x + w / 2, y + h, 8, '#fff') + line(x, y + h / 2, x + w, y + h / 2, 8, '#fff') + rect(x - 24, y + h, w + 48, 20, '#f4f1ea', 4, 5); }
const qRug = (x, y, w, h, c1, c2) => ell(x, y, w / 2, h / 2, c1, 6) + ell(x, y, w * .38, h * .36, 'none', 6, c2) + ell(x, y, w * .22, h * .2, c2, 0);
const qBin = (x, y, s = 1, c = '#7aa6d8') => G(tr(x, y, s), path('M-46 -110L46 -110L36 0L-36 0Z', c, 5) + line(-20, -90, -16, -14, 4, shade(c, -.25)) + line(20, -90, 16, -14, 4, shade(c, -.25)) + path('M-30 -110Q-10 -136 6 -112Q20 -130 34 -110', '#fff', 4));
const qBag = (x, y, s = 1, c = '#e2463a', r = 0) => G(tr(x, y, s, r), rect(-60, -130, 120, 130, c, 26, 5) + rect(-40, -60, 80, 46, shade(c, -.15), 12, 4) + path('M-30 -130Q0 -176 30 -130', 'none', 8) + circ(0, -80, 6, '#ffd23f', 3));
const qShoes = (x, y, s = 1, c = '#5b8fd8') => G(tr(x, y, s), path('M-80 0L-80 -34Q-60 -46 -40 -30L-6 -20Q4 -10 0 0Z', c, 5) + path('M10 0L10 -34Q30 -46 50 -30L84 -20Q94 -10 90 0Z', c, 5) + line(-82, -3, 0, -3, 6, '#fff') + line(8, -3, 92, -3, 6, '#fff'));
const qBall = (x, y, s = 1, t = 0, c = '#e2463a') => G(tr(x, y - 40 * s, s, t * 40), circ(0, 0, 40, c, 5) + path('M-40 0Q0 -20 40 0M0 -40Q-20 0 0 40', 'none', 5, '#fff'));
const qBox = (x, y, s = 1, str = '') => G(tr(x, y, s), rect(-80, -110, 160, 110, '#d9a86c', 4, 5) + path('M-80 -110L-100 -140L-20 -140L0 -110M80 -110L100 -140L20 -140L0 -110', '#c8955a', 4) + rect(-14, -110, 28, 40, '#e8c690', 0, 0) + (str ? ftext(0, -30, str, { size: 22, fill: '#7a5a3a', stroke: 'none' }) : ''));
const qGift = (x, y, s = 1, c = '#5ec4f0', c2 = '#ffd23f') => G(tr(x, y, s), rect(-60, -100, 120, 100, c, 6, 5) + rect(-12, -100, 24, 100, c2, 0, 0) + rect(-60, -100, 120, 100, 'none', 6, 5) + path('M0 -100Q-40 -150 -30 -104M0 -100Q40 -150 30 -104', 'none', 7, c2));
function qLamp(x, y, s = 1, on = 1, t = 0, c = '#ffd23f') { return G(tr(x, y, s), (on ? op(.25 + .05 * Math.sin(t * 3), circ(0, -300, 140, '#fff6c8', 0)) : '') + rect(-40, -10, 80, 14, '#5a4a3a', 6, 4) + line(0, -10, 0, -260, 8) + path('M-60 -250L60 -250L36 -350L-36 -350Z', c, 5)); }
const qDeskLamp = (x, y, s = 1, t = 0) => G(tr(x, y, s), op(.3 + .05 * Math.sin(t * 4), path('M40 -150L-60 0L160 0Z', '#fff6c8', 0)) + ell(0, -6, 40, 10, '#5b8fd8', 4) + line(0, -10, -20, -100, 8) + line(-20, -100, 40, -150, 8) + path('M20 -170L80 -140L60 -110L4 -134Z', '#5b8fd8', 5));
const qMug = (x, y, s = 1, t = 0, c = '#ff8fb1') => G(tr(x, y, s), rect(-26, -54, 52, 54, c, 8, 4) + path('M26 -42Q46 -36 26 -14', 'none', 5) + op(.6, path(`M-6 -64Q${-14 + wave(t, 1, 6)} -84 -4 -104M10 -64Q${2 + wave(t, 1, 6, .5)} -86 12 -108`, 'none', 4, '#fff')));
const qGlobe = (x, y, s = 1, t = 0) => G(tr(x, y, s), rect(-40, -10, 80, 14, '#6b3e26', 5, 4) + line(0, -10, 0, -40, 6) + circ(0, -110, 66, '#5ec4f0', 5) + G(`translate(${f1(((t * 30) % 120) - 60)} -110)`, ell(0, -14, 26, 18, '#7be07b', 0) + ell(30, 22, 16, 12, '#7be07b', 0)) + circ(0, -110, 66, 'none', 5) + path('M-74 -110A74 74 0 0 1 0 -184', 'none', 6, '#8a5a3a'));
function qBird(x, y, s, t, ph = 0) { const f = Math.sin(t * 10 + ph) * 14; return G(tr(x, y, s), path(`M-30 ${f1(-f)}Q-14 -6 0 4Q14 -6 30 ${f1(-f)}`, 'none', 6)); }
const qBirds = (t, n = 3, y = 300, seed = 1) => { let s = ''; for (let i = 0; i < n; i++) s += qBird(((t * (50 + i * 12) + i * 420 + seed * 200) % 1700) - 300, y + i * 46 + Math.sin(t * 2 + i) * 14, .7 - i * .1, t, i * 2); return s; };
function qSkyline(yb, col, seed = 3, win = 'rgba(255,255,255,.35)') { const r = rng(seed); let s = '', x = -M; while (x < W + M) { const w = 120 + r() * 140, h = 280 + r() * 380; s += rect(x, yb - h, w, h, col, 0, 0); if (r() < .4) s += rect(x + w * .4, yb - h - 50, 10, 50, col, 0, 0); for (let j = yb - h + 40; j < yb - 40; j += 70) for (let i = x + 18; i < x + w - 30; i += 46) s += rect(i, j, 20, 28, win, 2, 0); x += w + 6; } return s; }
// immeuble détaillé : corniche, fenêtres (rideaux / plantes / lumière), balcons, rez-de-chaussée commerçant (store rayé + enseigne)
function qBuilding(x, yb, w, h, c, seed, t, o = {}) { const r = rng(seed); let s = rect(x, yb - h, w, h, c, 4, 6) + rect(x - 10, yb - h - 18, w + 20, 26, shade(c, -.18), 4, 5);
  const cols = Math.max(1, Math.floor(w / 95)), cw = (w - 30) / cols, top = yb - h + 40, shopH = o.shop === false ? 0 : 190;
  for (let j = top; j < yb - shopH - 90; j += 120) for (let i = 0; i < cols; i++) { const wx = x + 15 + i * cw + 10, ww = cw - 20, lit = o.night ? Math.sin(t * .6 + i * 2.1 + j * .07) > -.2 : r() < .2;
    s += rect(wx, j, ww, 74, lit ? '#ffe08a' : '#cfe8ff', 4, 4); const k = r(); if (k < .3) s += path(`M${wx + 3} ${j + 3}L${wx + ww * .35} ${j + 3}Q${wx + ww * .2} ${j + 40} ${wx + 6} ${j + 70}Z`, QPAL[(seed + i) % 8], 0); else if (k < .45) s += rect(wx - 6, j + 66, ww + 12, 14, '#8a5a3a', 3, 3) + circ(wx + ww * .3, j + 62, 12, '#5fb85f', 3) + circ(wx + ww * .65, j + 60, 14, '#ff8fb1', 3); else s += line(wx + ww / 2, j, wx + ww / 2, j + 74, 4);
    if (r() < .18) s += rect(wx - 10, j + 74, ww + 20, 10, '#7d848c', 2, 4) + Array.from({ length: 4 }, (_, q) => line(wx - 6 + q * (ww + 12) / 3, j + 84, wx - 6 + q * (ww + 12) / 3, j + 116, 4)).join('') + line(wx - 10, j + 116, wx + ww + 10, j + 116, 5); }
  if (shopH) { const ac = o.awn || QPAL[seed % 8]; s += rect(x + 14, yb - 160, w - 28, 160, '#cfe8ff', 4, 5) + rect(x + w * .62, yb - 150, w * .22, 150, shade(c, -.3), 4, 5);
    for (let i = 0; i < 6; i++) s += path(`M${x + i * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 160}Q${x + (i + .5) * w / 6} ${yb - 140} ${x + i * w / 6} ${yb - 160}Z`, i % 2 ? '#fff' : ac, 4);
    if (o.sign) s += rect(x + w / 2 - o.sign.length * 11 - 16, yb - 250, o.sign.length * 22 + 32, 44, '#fff8e0', 8, 4) + ftext(x + w / 2, yb - 218, o.sign, { size: 26, fill: ac, stroke: 'none' }); }
  return s; }
const qLampPost = (x, yb, s = 1, on = 0) => G(tr(x, yb, s), (on ? op(.35, circ(0, -470, 70, '#fff6c8', 0)) : '') + rect(-22, -20, 44, 20, '#3a4250', 4, 4) + rect(-8, -440, 16, 420, '#3a4250', 4, 4) + path('M0 -440Q0 -480 50 -480', 'none', 10, '#3a4250') + path('M30 -486L90 -486L80 -456L40 -456Z', '#ffe08a', 4));
const qBench = (x, yb, s = 1) => G(tr(x, yb, s), rect(-120, -110, 240, 22, '#b5835a', 5, 4) + rect(-120, -80, 240, 22, '#b5835a', 5, 4) + rect(-130, -44, 260, 20, '#c8955a', 5, 4) + line(-100, -24, -100, 0, 8) + line(100, -24, 100, 0, 8) + line(-100, -110, -100, -44, 6) + line(100, -110, 100, -44, 6));
const qBike = (x, yb, s = 1, c = '#36a85a') => G(tr(x, yb - 50 * s, s), circ(-70, 0, 48, 'none', 7) + circ(70, 0, 48, 'none', 7) + path('M-70 0L-20 -70L50 -70L70 0M-20 -70L0 0L50 -70M0 0L-70 0', 'none', 7, c) + line(-30, -90, -6, -90, 8) + path('M50 -70L44 -96L66 -100', 'none', 7));
function qCar(x, yb, s = 1, c = '#ff6b6b', flip = 0) { return G(`translate(${f1(x)} ${f1(yb)}) scale(${flip ? -s : s} ${s})`, path('M-200 -40L-200 -100Q-190 -120 -150 -124L-100 -190Q-80 -200 40 -200Q90 -196 120 -124L190 -114Q210 -104 210 -70L210 -40Z', c, 6) + path('M-84 -130L-56 -180L10 -180L10 -130Z', '#cfe8ff', 4) + path('M30 -130L30 -180L80 -180L106 -130Z', '#cfe8ff', 4) + circ(-110, -36, 42, '#3a4250', 6) + circ(-110, -36, 16, '#c8ced6', 4) + circ(120, -36, 42, '#3a4250', 6) + circ(120, -36, 16, '#c8ced6', 4) + rect(186, -98, 22, 16, '#ffe08a', 4, 3)); }
const qBush = (x, yb, s = 1, c = '#5fb85f') => G(tr(x, yb, s), circ(-60, -40, 50, shade(c, -.1), 5) + circ(50, -44, 54, shade(c, -.05), 5) + circ(0, -70, 64, c, 5) + rect(-110, -12, 220, 12, c, 0, 0));
function qFlowers(x, yb, n = 5, seed = 2, t = 0) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const fx = x + i * 34 + r() * 10, h = 40 + r() * 30, sw = wave(t, .6, 4, i); s += line(fx, yb, fx + sw, yb - h, 5, '#4fa64f') + circ(fx + sw, yb - h, 14, QPAL[Math.floor(r() * 8)], 4) + circ(fx + sw, yb - h, 5, '#ffd23f', 0); } return s; }
const qPine = (x, yb, s = 1, t = 0) => G(tr(x, yb, s, wave(t, .3, 1.5, x)), rect(-16, -60, 32, 60, '#8a5a3a', 6, 5) + path('M-90 -60L0 -200L90 -60Z', '#3f9a5a', 5) + path('M-74 -150L0 -280L74 -150Z', '#4fa66a', 5) + path('M-56 -240L0 -350L56 -240Z', '#5fb87a', 5));
const qFence = (x0, x1, yb, c = '#fff') => { let s = rect(x0, yb - 90, x1 - x0, 14, c, 3, 4) + rect(x0, yb - 46, x1 - x0, 14, c, 3, 4); for (let x = x0; x < x1; x += 46) s += path(`M${x} ${yb}L${x} ${yb - 110}L${x + 14} ${yb - 128}L${x + 28} ${yb - 110}L${x + 28} ${yb}Z`, c, 4); return s; };
const qSign = (x, yb, str, c = '#5b8fd8', s = 1) => G(tr(x, yb, s), rect(-8, -300, 16, 300, '#8a8f99', 4, 4) + rect(-110, -380, 220, 90, c, 12, 5) + ftext(0, -322, str, { size: 34, fill: '#fff', stroke: 'none' }));
const qBalloon = (x, y, c, t, ph = 0, s = 1) => { const bx = x + wave(t, .5, 10, ph), by = y + wave(t, .7, 12, ph + 1); return path(`M${f1(bx)} ${f1(by + 70 * s)}Q${f1(bx + 20)} ${f1(by + 160 * s)} ${f1(bx - 6)} ${f1(by + 260 * s)}`, 'none', 3) + G(tr(bx, by, s), ell(0, 0, 52, 64, c, 5) + path('M-8 62L8 62L0 74Z', c, 4) + ell(-18, -24, 10, 16, 'rgba(255,255,255,.6)', 0)); };
const qSpeaker = (x, yb, s = 1, t = 0) => { const p = 1 + .08 * Math.max(0, Math.sin(t * 13)); return G(tr(x, yb, s), rect(-90, -340, 180, 340, '#241830', 14, 6) + circ(0, -240, 52 * p, '#3a2a4a', 5) + circ(0, -240, 18, '#5ec4f0', 4) + circ(0, -100, 66 * p, '#3a2a4a', 5) + circ(0, -100, 22, '#ff5c8a', 4)); };
const qNeon = (x, y, str, c, t, size = 54) => { const on = Math.sin(t * 7) > -.6 || Math.sin(t * 23) > .2; return op(on ? 1 : .35, ftext(x, y, str, { size, fill: 'none', stroke: c, sw: 6 }) + (on ? op(.35, glow(x, y - size * .3, size * 1.6, c, .5)) : '')); };
const qStreamers = (t, y = -20, n = 9) => { let s = ''; for (let i = 0; i < n; i++) { const x = -40 + i * 140, l = 120 + (i * 53) % 90; s += path(`M${x} ${y}Q${x + 20 + wave(t, .9, 12, i)} ${y + l * .5} ${x + wave(t, .9, 18, i + 1)} ${y + l}`, 'none', 10, QPAL[i % 8]); } return s; };
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + circ(930, 150, 60, '#fff3b0', 0) + op(.35, circ(930, 150, 100, '#fff3b0', 0)) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff') + cloud(((t * 12 + 1200) % 1800) - 300, 120, .7, 'rgba(255,255,255,.85)') + qBirds(t, 3, 280);
function tree(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c') + circ(-40, -380, 14, '#e2463a', 4) + circ(60, -300, 14, '#e2463a', 4) + circ(-80, -240, 12, '#e2463a', 4)); }
function kidsBg(t, y = 1150, n = 4, s = .45) { let r = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; r += kid(i + 1, { x, y, s, expr: 'happy', walk: 3, flip: i % 2 }, t); } return r; }
function streetT(t, n = 3) { const yb = 1250; let s = SKY(t, '#9fd6ff', '#fff1dc') + op(.85, qSkyline(1000, '#bccde0', 5)) + qHaze(.2);
  const signs = ['CAFÉ', '', 'BOULANGERIE', '', 'PHARMACIE', 'FLEURS', '', 'CINÉ'];
  for (let i = -2; i < 6; i++) s += qBuilding(-200 + i * 300, yb, 280, 540 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4], i + 10, t, { sign: signs[(i + 8) % 8], awn: QPAL[(i + 8) % 8] });
  s += qHaze(.16, '255,250,240', 1250);
  s += rect(-M, yb, W + 2 * M, 1400, '#c8ccd2', 0, 0) + [0, 1, 2].map(i => line(-M, yb + 20 + i * 26, W + M, yb + 20 + i * 26, 3, '#b0b5bc')).join('') + rect(-M, yb + 90, W + 2 * M, 20, '#8f959d', 0, 0) + rect(-M, yb + 110, W + 2 * M, 1400, '#6e747c', 0, 0) + Array.from({ length: 10 }, (_, i) => rect(-M + i * 300 - ((t * 0) % 300), yb + 300, 160, 18, '#fff', 4, 0)).join('') + line(-M, yb, W + M, yb, 8, '#7d848c');
  s += qLampPost(70, yb, 1) + qLampPost(830, yb, 1) + tree(470, yb, .62, t) + qBench(640, yb, .7) + qBin(950, yb, .6, '#36a85a') + qBike(260, yb + 10, .6, '#ff5c8a') + qSign(1050, yb, 'RUE', '#5b8fd8', .8) + qFlowers(900, yb, 4, 5, t) + qCar(-60, yb + 250, .9, '#5ec4f0') + qCar(1000, yb + 260, .9, '#ffd23f', 1);
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
  s += G(tr(1000, 1300), rect(-60, -200, 120, 200, '#fff', 4, 5) + circ(0, -250, 44, '#e8e2d8', 5) + path('M-40 -206Q0 -230 40 -206', '#e8e2d8', 5)) + qBench(CX, 1500, 1.1) + qPot(40, 1290, .9, t, 1) +
    op(.75, adult(4, { x: ((t * 50) % 1500) - 200, y: 1330, s: .55, expr: 'smug', walk: 2 }, t));
  return s; }

// ---------- accessoires propres à l'épisode ----------
const WASH = (c = 'rgba(255,255,255,.14)') => rect(-M, -M, W + 2 * M, H + 2 * M, c, 0, 0); // voile léger : décor moins saturé derrière les persos
function sofa(x, yb, s = 1, c = '#5ec4a0') { return G(tr(x, yb, s), rect(-330, -260, 660, 180, shade(c, -.12), 44, 6) + rect(-290, -235, 160, 115, '#ffd23f', 34, 5) + rect(-70, -225, 150, 105, '#fff', 34, 5) + rect(130, -232, 150, 112, '#e86a8a', 34, 5) + rect(-290, -125, 580, 95, c, 22, 6) + rect(-385, -160, 105, 160, c, 32, 6) + rect(280, -160, 105, 160, c, 32, 6) + rect(-340, -30, 34, 30, '#6b3e26', 4, 4) + rect(306, -30, 34, 30, '#6b3e26', 4, 4) + G(tr(-200, -150, 1, -10), rect(-60, -10, 120, 18, '#5b8fd8', 6, 4))); }
function crtTV(x, yb, s, t, on = 1, screen = '') { const fl = .85 + .15 * Math.sin(t * 40); return G(tr(x, yb, s), rect(-180, -130, 360, 130, '#8a5a3a', 10, 6) + line(-160, -66, 160, -66, 4, '#6b3e26') + circ(-80, -98, 7, OL, 0) + circ(80, -98, 7, OL, 0) +
  rect(-150, -410, 300, 280, '#c9c4b8', 34, 6) + rect(-132, -392, 214, 230, on ? `rgba(150,214,200,${fl})` : '#4a5a5a', 44, 5) + screen + [0, 1, 2, 3, 4, 5].map(i => line(-120, -370 + i * 36, 70, -370 + i * 36, 3, 'rgba(0,0,0,.08)')).join('') + circ(112, -350, 13, '#8a8478', 4) + circ(112, -305, 13, '#8a8478', 4) + rect(97, -250, 30, 60, '#8a8478', 4, 4) +
  line(-30, -410, -110, -500, 5) + line(30, -410, 110, -500, 5) + circ(-110, -500, 9, OL, 0) + circ(110, -500, 9, OL, 0) + ps2(0, -130, .55) + path('M-40 -10Q-90 60 -40 90', 'none', 5)); }
// vieille console noire « 2 » + manette filaire
function schoolBuilding(x, yb, w, h, t) { let s = path(`M${x - 30} ${yb - h}L${x + w / 2} ${yb - h - 130}L${x + w + 30} ${yb - h}Z`, '#d9534f', 6) + rect(x, yb - h, w, h, '#f0d9b5', 4, 6);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) { if (j === 2 && (i === 1 || i === 2)) continue; const wx = x + 40 + i * (w - 60) / 4, wy = yb - h + 50 + j * 150; s += rect(wx, wy, (w - 60) / 4 - 30, 90, '#cfe8ff', 4, 5) + circ(wx + 20, wy + 60, 12, QPAL[(i + j) % 8], 0) + path(`M${wx + 40} ${wy + 70}L${wx + 52} ${wy + 46}L${wx + 64} ${wy + 70}`, QPAL[(i + j + 3) % 8], 0) + line(wx, wy + 45, wx + (w - 60) / 4 - 30, wy + 45, 4); }
  s += rect(x + w / 2 - 80, yb - 200, 160, 200, '#3e7cc0', 8, 6) + line(x + w / 2, yb - 200, x + w / 2, yb, 5) + rect(x + w / 2 - 130, yb - 270, 260, 56, '#fff8e0', 10, 5) + ftext(x + w / 2, yb - 230, 'ÉCOLE', { size: 36, fill: '#d9534f', stroke: 'none' }) + wallClock(x + w / 2, yb - h - 50, 40, t);
  const fx = x + w - 40, fy = yb - h - 160; s += line(fx, yb - h, fx, fy, 6) + path(`M${fx} ${fy}Q${fx + 40} ${fy - 10 + wave(t, 2, 8)} ${fx + 80} ${fy + wave(t, 2, 10, .5)}L${fx + 80} ${fy + 50 + wave(t, 2, 10, .5)}Q${fx + 40} ${fy + 40 + wave(t, 2, 8)} ${fx} ${fy + 50}Z`, '#5b8fd8', 4);
  return s; }
function schoolyard(t) { const yb = 1180;
  return SKY(t) + op(.8, qSkyline(1120, '#c3d6e4', 3)) + circ(-20, 1080, 90, '#9ccf8a', 0) + circ(1020, 1060, 110, '#9ccf8a', 0) + qHaze(.15) +
    schoolBuilding(-120, yb, 640, 560, t) + qBuilding(560, yb, 700, 470, '#e8c9a0', 4, t, { shop: false }) + qFence(-M, W + M, yb, '#fff') +
    rect(-M, yb, W + 2 * M, 1500, '#c9b8a0', 0, 0) + line(-M, yb, W + M, yb, 7, '#a8987f') +
    [0, 1, 2, 3, 4].map(i => rect(CX - 60 + (i % 2) * 0, 1300 + i * 70, 120, 64, 'none', 4, 5, '#fff')).join('') + ftext(CX, 1660, '★', { size: 60, fill: '#fff', stroke: 'none' }) +
    G(tr(40, yb), rect(-8, -480, 16, 480, '#7d848c', 4, 4) + rect(-90, -520, 120, 80, '#fff', 6, 5) + circ(-40, -436, 30, 'none', 5, '#e2463a')) +
    qBench(260, 1230, .8) + qBush(700, 1200, .8) + qFlowers(780, 1225, 6, 3, t) + tree(950, 1200, .9, t) + qPine(1060, 1200, .7, t) + qBin(470, 1225, .6, '#36a85a') + qBall(620, 1290, .7, t) + qBag(160, 1290, .6, '#ff8fb1', -8) +
    kidsBg(t, 1230, 3); }
function classroomT(t, inner = '') { const yb = 1250;
  let s = qWall('stripe', '#fff1d6', '#ffe8c2', yb) + rect(-M, 960, W + 2 * M, yb - 960, '#d9b88c', 0, 0) + line(-M, 960, W + M, 960, 6, '#b8956a') + qBase(yb, '#a0784e');
  for (let i = 0; i < 8; i++) { const x = 100 + i * 105, y = 160 + Math.sin(i * .7) * 10 + wave(t, .8, 3, i); s += G(tr(x, y, 1, wave(t, .8, 5, i)), rect(-34, -40, 68, 70, QPAL[i % 8], 6, 4) + ftext(0, 14, 'ABCDEFGH'[i], { size: 36, fill: '#fff', stroke: 'none' })); }
  s += path('M40 120Q470 160 900 120', 'none', 4) + rect(60, 250, 960, 560, '#8a6a4a', 18) + rect(80, 270, 920, 520, '#456b55', 10, 0) + op(.15, path('M120 300Q400 340 700 300M150 700Q500 650 900 720', 'none', 12, '#fff')) + inner + rect(120, 790, 840, 18, '#8a6a4a', 6, 4) + rect(180, 774, 50, 18, '#fff', 4, 3) + rect(260, 776, 70, 16, '#ff8fb1', 4, 3) + rect(780, 770, 90, 22, '#3a3a3a', 4, 3);
  s += wallClock(960, 170, 60, t) + windowFrame(-200, 300, 220, 420) + qCurtain(-60, 290, 90, 450, '#ff8fb1', t, -1);
  s += qShelf(-20, 1000, 200, qBooks(-10, 1000, 180, 4)) + qPoster(1040, 600, 90, 300, '#7aa6d8', 4, ftext(0, 0, '1+1', { size: 34, fill: '#fff', stroke: 'none' }), t) + qOutlet(1010, 1170) + qSwitch(40, 900);
  for (let i = 0; i < 4; i++) s += circ(380 + i * 110, 880, 9, '#7d848c', 3) + (i % 2 ? qBag(380 + i * 110, 1010, .5, QPAL[i + 1]) : '');
  return s + qParquet(yb, '#c49a6c') + qBin(1010, 1300, .7) + qPot(60, 1290, .9, t, 1) + qRug(CX, 1520, 700, 140, '#7aa6d8', '#ffd23f'); }
function bedroomN(t, lamp = 0) { const yb = 1250; let s = qWall('star', '#1d2350', '#2e3a80', yb) + rect(-M, 900, W + 2 * M, yb - 900, '#262c5e', 0, 0) + line(-M, 900, W + M, 900, 5, '#3a4290');
  s += qWindowView(620, 230, 360, 420, t, { night: true }); for (let i = 0; i < 6; i++) s += sparkle(650 + (i * 67) % 300, 270 + (i * 113) % 200, .18 + .1 * Math.sin(t * 3 + i), '#fff6d6');
  s += qCurtain(560, 210, 110, 480, '#5a3a8a', t, 1) + qCurtain(930, 210, 110, 480, '#5a3a8a', t, -1);
  s += rect(90, 300, 230, 300, '#ff8fb1', 10) + ftext(205, 470, '★', { size: 120, fill: '#fff', stroke: 'none' }) + qFrame(400, 380, 120, 150, 'sea', '#8a6ad8', 3) + qShelf(60, 720, 420, qBooks(80, 720, 180, 7) + qTrophy(310, 720, .9) + qTeddy(410, 720, .7));
  s += G(tr(820, 1260), rect(-260, -260, 40, 300, '#6b4a8a', 10, 6) + rect(-240, -90, 520, 110, '#8a6ad8', 16, 6) + path('M-220 -100Q20 -150 270 -100L280 0L-220 0Z', '#5ec4f0', 6) + path('M-200 -70Q0 -100 260 -70', 'none', 4, '#3a9ac0') + ell(-160, -130, 70, 34, '#fff', 5) + qTeddy(-40, -110, .6, '#ff9a4d'));
  s += G(tr(470, 1250), rect(-70, -150, 140, 150, '#6b4a8a', 8, 5) + line(-60, -75, 60, -75, 4) + rect(-50, -200, 100, 50, '#141a3a', 8, 4) + ftext(0, -164, Math.sin(t * 6) > 0 ? '02:47' : '02 47', { size: 26, fill: '#ff5c8a', stroke: 'none' }) + op(.25, circ(0, -176, 70, '#ff5c8a', 0)));
  s += qOutlet(70, 1100) + qSwitch(1040, 960);
  return s + rect(-M, yb, W + 2 * M, 1400, '#3a3050', 0, 0) + line(-M, yb, W + M, yb, 6, '#2a2240') + qRug(330, 1420, 520, 120, '#5a3a8a', '#ff8fb1') + qShoes(180, 1330, .55, '#ff8fb1') + qBall(940, 1360, .5, 0, '#ffc83d'); }
function pointHand(tx, ty, ang, sleeve, k = 1, len = 700) { if (k <= 0) return ''; const a = R(ang), off = (1 - k) * 800;
  return G(tr(tx - Math.cos(a) * off, ty - Math.sin(a) * off, 1, ang), line(-len, 0, -100, 0, 74, OL) + line(-len, 0, -100, 0, 60, sleeve) + rect(-54, -18, 70, 36, SKIN, 18, 6) + rect(-130, -46, 96, 92, SKIN, 38, 6) + path('M-100 -10L-50 -10M-100 14L-50 14', 'none', 5) + ell(-82, -46, 30, 16, SKIN, 6)); }

function hallway(t) { const yb = 1250; let s = qWall('diamond', '#d6ecf7', '#c4e0ef', yb) + rect(-M, 600, W + 2 * M, 20, '#9fc6dc', 0, 0);
  for (let i = 0; i < 4; i++) { const x = 40 + i * 290, fl = i === 2 && Math.sin(t * 17) > .3; s += rect(x, 40, 200, 26, fl ? '#9aa8b5' : '#fffbe6', 12, 5) + (fl ? '' : op(.18, path(`M${x} 66L${x + 200} 66L${x + 260} 300L${x - 60} 300Z`, '#fffbe6', 0))); }
  s += rect(70, 300, 400, 260, '#c8955a', 10, 6) + rect(86, 316, 368, 228, '#e8c690', 4, 0) + [[130, 350, '#fff', -4], [250, 340, '#ffe066', 3], [360, 360, '#ff8fb1', -2], [160, 450, '#7be07b', 5], [300, 440, '#fff', -6]].map(([x, y, c, r]) => G(tr(x + 40, y + 40, 1, r + wave(t, 1.3, 1.5, x)), rect(-44, -44, 88, 80, c, 3, 3) + line(-30, -20, 30, -20, 3, '#9aa') + line(-30, 0, 20, 0, 3, '#9aa') + circ(0, -40, 7, '#e2463a', 3))).join('');
  s += qPoster(600, 420, 150, 200, '#ff9a4d', 3, ftext(0, -30, 'CANTINE', { size: 26, fill: '#fff', stroke: 'none' }) + circ(0, 30, 40, '#fff', 4) + ell(0, 30, 24, 10, '#e2463a', 0), t) + qPoster(800, 420, 140, 200, '#36a85a', -3, ftext(0, -40, 'CHUT !', { size: 30, fill: '#fff', stroke: 'none' }) + circ(0, 30, 36, '#f2c9a0', 4) + line(0, 0, 0, 56, 8, '#f2c9a0'), t) + rect(940, 300, 150, 60, '#2fa84f', 8, 5) + ftext(1015, 342, 'SORTIE', { size: 30, fill: '#fff', stroke: 'none' }) + wallClock(1000, 470, 46, t);
  for (let i = -2; i < 12; i++) { const x = i * 130 - 60; s += rect(x, 640, 124, 610, ['#ff8fb1', '#5ec4f0', '#ffd23f', '#7be07b'][(i + 4) % 4], 8) + rect(x + 20, 690, 84, 16, 'rgba(0,0,0,.25)', 4, 0) + rect(x + 20, 720, 84, 16, 'rgba(0,0,0,.25)', 4, 0) + circ(x + 100, 960, 9, '#fff', 3) + rect(x + 44, 760, 36, 26, '#fff', 4, 3) + ftext(x + 62, 780, `${12 + i}`, { size: 18, fill: OL, stroke: 'none' }) + (i % 3 === 0 ? G(tr(x + 60, 860, 1, -10), circ(0, 0, 22, QPAL[(i + 9) % 8], 3) + ftext(0, 8, '★', { size: 22, fill: '#fff', stroke: 'none' })) : ''); }
  return s + extinguisher(1060, 1100, .5) + qTileFloor(yb, '#e3d5bb', '#d4c3a3') + op(.25, rect(-M, yb + 6, W + 2 * M, 30, '#fff', 0, 0)) + qBag(120, 1330, .7, '#5b8fd8', -10) + qBall(980, 1320, .7, t, '#ff9a4d') + qShoes(300, 1360, .6, '#e2463a'); }
function stageT(t, screen = '') { let s = grad('#3a1d3e', '#1c0e22', -M, -M, W + 2 * M, H + 2 * M) + qWall('star', 'rgba(0,0,0,0)', 'rgba(255,220,160,.12)', 1300) + rect(130, 270, 820, 560, '#0f0a14', 16, 8) + rect(150, 290, 780, 520, '#fdf6ea', 8, 0) + screen;
  s += rect(-M, 175, W + 2 * M, 22, '#4a4a55', 4, 5); for (let i = 0; i < 5; i++) { const x = 120 + i * 210, a = wave(t, .5, 10, i); s += G(tr(x, 197, 1, a), rect(-22, 0, 44, 60, '#2b2b33', 8, 5) + circ(0, 64, 18, i % 2 ? '#ffe08a' : '#ff8fb1', 4)); }
  for (const sd of [-1, 1]) { let c = ''; for (let i = 0; i < 4; i++) c += path(`M${i * 45} -100Q${i * 45 + 25 + wave(t, .4, 6, i)} 700 ${i * 45 + 5} 1400`, 'none', 10, '#7a1426'); s += G(sd < 0 ? tr(-60, 0) : `translate(${W + 60} 0) scale(-1 1)`, path('M-100 -100L200 -100Q150 600 230 1400L-100 1400Z', '#b81f3a', 7) + c + path('M150 700Q230 720 210 780', 'none', 12, '#ffd23f') + circ(205, 790, 14, '#ffd23f', 4)); }
  s += path('M-100 -100L1180 -100L1180 120Q900 180 540 140Q180 180 -100 120Z', '#b81f3a', 7) + [0, 1, 2, 3, 4, 5, 6].map(i => circ(80 + i * 150, 140 + Math.sin(i) * 8, 10, '#ffd23f', 3)).join('');
  s += op(.22, path(`M${360 + wave(t, .2, 30)} 120L${140} 1450L${600} 1450Z`, '#fff6c8', 0)) + op(.14, path(`M${760 - wave(t, .25, 40)} 120L${520} 1450L${1000} 1450Z`, '#ffb3c8', 0));
  s += G(tr(930, 1300), line(0, 0, 0, -300, 7, '#555') + path('M-50 0L50 0', 'none', 8, '#555') + G(tr(0, -310, 1, -20), rect(-14, -40, 28, 50, '#333', 12, 4))) + qPot(70, 1300, .8, t, 0, '#b81f3a') + qPot(1010, 1300, .8, t, 2, '#b81f3a') + G(tr(150, 1300), rect(-40, -120, 80, 16, '#8a5a3a', 4, 4) + line(-30, -104, -36, 0, 6) + line(30, -104, 36, 0, 6));
  s += rect(-M, 1300, W + 2 * M, 900, '#6b3e26', 0, 0) + [0, 1, 2, 3].map(i => line(-M, 1330 + i * 40, W + M, 1330 + i * 40, 3, '#5a3320')).join('') + line(-M, 1300, W + M, 1300, 10, '#4a2a18') + rect(-M, 1480, W + 2 * M, 40, '#3a2010', 0, 0);
  for (let i = 0; i < 9; i++) s += ell(-40 + i * 145, 1480, 30, 14, '#ffe08a', 4) + op(.25, circ(-40 + i * 145, 1470, 40, '#fff6c8', 0));
  for (let i = 0; i < 7; i++) { const bx = 80 + i * 160, by = 1760 + wave(t, .7, 6, i * .3); s += circ(bx, by, 120, '#140a18', 0) + ell(bx, 1900, 150, 120, '#140a18', 0) + (i % 2 ? path(`M${bx - 60} ${by - 110}Q${bx} ${by - 150} ${bx + 60} ${by - 110}`, 'none', 14, '#241430') : '') + (i === 2 || i === 5 ? G(tr(bx + 70, by - 150, 1, 10), rect(-24, -40, 48, 80, '#222', 8, 4) + rect(-18, -32, 36, 62, Math.sin(t * 3 + i) > 0 ? '#bfe3ff' : '#fff6c8', 4, 0)) : ''); }
  return s; }
const tiredHair2 = (style, col) => (r, t, o) => { const [b, f] = hairSvg(style, o.old ? mixC(col, '#e6e6ec', o.old) : col, r, t); return [b, f + (o.bags ? bags(r) : '')]; };
const bags = r => path(`M${f1(-r * .54)} ${f1(r * .17)}Q${f1(-r * .34)} ${f1(r * .34)} ${f1(-r * .14)} ${f1(r * .17)}M${f1(r * .14)} ${f1(r * .17)}Q${f1(r * .34)} ${f1(r * .34)} ${f1(r * .54)} ${f1(r * .17)}`, 'none', f1(r * .05), '#9b6fa8');
const MOM = { age: 'adult', hairFn: tiredHair2('bun', '#6b3e26'), shirt: '#e86a8a', pants: '#4b3b6e', seed: 4, necklace: true };
const DAD = { age: 'adult', hairFn: tiredHair2('side', '#3a2a20'), glasses: true, shirt: '#36a85a', pants: '#2f3b4e', seed: 8 };
const maman = (o, t) => person(Object.assign({}, MOM, o), t);
const papa = (o, t) => person(Object.assign({}, DAD, o), t);
const mamanHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, MOM, o), t));
const papaHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, DAD, o), t));
function noSign(x, y, s, t, t0, icon) { const k = popEl(t, t0, .5); if (k <= 0) return ''; return G(tr(x, y, s * k, Math.sin(t * 3 + x) * 4), circ(0, 0, 100, '#fff', 8) + icon + circ(0, 0, 84, 'none', 22, '#e2463a') + line(-60, -60, 60, 60, 22, '#e2463a') + circ(0, 0, 100, 'none', 7)); }

// ============================================================
//  « Pourquoi c'est horrible d'être le mec drôle de la classe ? » — SIZEX fun (Fredoka), accent rose
//  Le héros Léo porte un NEZ DE CLOWN = son « mode drôle » (o.nose : 0 → 1). Il le perd à la fin.
// ============================================================
sxFun('#ff3d8b'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';

// ---------- personnages ----------
const HAIR_L = '#6b3e26', SHIRT_L = '#ffcf3a';
const clownNose = (r, k = 1, dy = 0) => k <= 0 ? '' : G(tr(0, r * .2 + dy, k), circ(0, 0, r * .14, '#ff2e3d', Math.max(3, r * .035)) + ell(-r * .045, -r * .05, r * .045, r * .03, 'rgba(255,255,255,.8)', 0));
const leoHair = (r, t, o) => { const [b, f] = hairSvg('curly', HAIR_L, r, t); return [b, f + (o.bags ? bags(r) : '') + clownNose(r, o.nose ?? 1, o.noseDy || 0)]; };
const leo = (o, t) => person(Object.assign({ age: 'kid', hairFn: leoHair, shirt: SHIRT_L, pants: '#3b4a6b', seed: 2 }, o), t);
const leoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: leoHair, seed: 2 }, o), t));
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const PROF = { age: 'adult', hair: 'bald', hairColor: '#7a6a5a', glasses: true, mustache: true, shirt: '#8a6ad8', pants: '#3b3f4a', seed: 9 };
const prof = (o, t) => person(Object.assign({}, PROF, o), t);
const profHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, PROF, o), t));
const CRUSH = { age: 'kid', hair: 'long', hairColor: '#2b2420', shirt: '#ff8fb1', pants: '#4b3b6e', skin: '#c98a5e', seed: 5 };
const crush = (o, t) => person(Object.assign({}, CRUSH, o), t);
const crushHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, CRUSH, o), t));

// ---------- aides motion / gags ----------
// « HA ! » qui jaillissent d'une foule
function hahas(t, t0, n = 6, seed = 3, y0 = 1000, y1 = 520, x0 = 140, x1 = 940) { if (t < t0) return ''; const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), rr = (r() - .5) * 30, sz = 44 + r() * 26, w = r() < .5 ? 'HA !' : 'HAHA', d = t0 + i * .11, k = seg(t, d, d + 1.3); if (k <= 0) continue;
    s += op(1 - seg(t, d + .9, d + 1.3), G(tr(x, lerp(y0, y1, eOutCubic(k)), popEl(t, d, .4), rr), ftext(0, 0, w, { size: sz, fill: [SX.acc2, '#fff', SX.acc][i % 3] }))); } return s; }
// pupitre (couvre le bas du corps d'un élève assis)
const pupitre = (x, y, s = 1, c = '#c58e55', seed = 1) => G(tr(x, y, s), rect(-150, -150, 300, 28, shade(c, .15), 6, 6) + rect(-135, -124, 270, 124, c, 4, 6) + rect(-100, -176, 70, 26, QPAL[seed % 8], 3, 4) + rect(-20, -168, 90, 18, '#fff', 3, 3) + line(40, -164, 100, -178, 6, QPAL[(seed + 3) % 8]));
// rangée d'élèves assis derrière leurs pupitres ; o.ex : expressions ; o.kev : index de Kevin ; o.leo : index de Léo
function pupils(t, xs, y, sc, o = {}) { let s = ''; xs.forEach((x, i) => { const ex = Array.isArray(o.ex) ? o.ex[i % o.ex.length] : (o.ex || 'happy'), up = o.up ? [[200 + wave(t, 2.4, 20, i), 230], [-20 - wave(t, 2.4, 20, i + .5), -50]] : [];
    const p = { x, y, s: sc, expr: ex, look: o.look || [x < CX ? .8 : -.8, 0], armL: up[0], armR: up[1], bob: o.bob ?? 1, rot: o.rot ? o.rot(i) : 0 };
    s += i === o.kev ? kevin(Object.assign(p, { expr: o.kevEx || ex }), t) : i === o.leo ? leo(Object.assign(p, o.leoO || {}), t) : kid(i + (o.seed || 0), p, t);
    s += pupitre(x, y, sc, '#c58e55', i + 2); }); return s; }
// salle de classe + élèves ; o.grey = jour triste
function classR(t, o = {}) { let s = classroomT(t, o.board || boardTxt('Lundi', 'x + 2 = 5'));
  if (o.grey) s += rect(-M, -M, W + 2 * M, H + 2 * M, `rgba(70,80,110,${o.grey})`, 0, 0);
  return s; }
const boardTxt = (a, b) => ftext(540, 430, a, { size: 52, fill: 'rgba(255,255,255,.85)', stroke: 'none' }) + ftext(540, 560, b, { size: 64, fill: 'rgba(255,255,255,.75)', stroke: 'none' }) + ftext(820, 700, '☺', { size: 60, fill: 'rgba(255,255,255,.5)', stroke: 'none' });
// photo de famille qui se déchire (k : 0 → 1)
function famPhoto(x, y, s, t, k = 0, sadL = 0) { const inner = (sad) => rect(-260, -180, 520, 360, '#bfe6ff', 0, 0) + rect(-260, 60, 520, 120, '#9ccf8a', 0, 0) + circ(180, -110, 34, '#fff3b0', 0) + mamanHead(-150, 0, 70, { expr: sad ? 'sad' : 'happy', bags: false }, t) + papaHead(150, 0, 70, { expr: sad ? 'sad' : 'happy' }, t) + leoHead(0, 50, 60, { expr: sad ? 'worried' : 'joy', nose: 0 }, t);
  const tear = 'M0 -200L-14 -150L10 -100L-12 -40L8 20L-10 80L12 140L0 200';
  const half = (sd) => { const id = 'fp' + (_gid++); const clip = sd < 0 ? `M-300 -220L0 -220${tear.replace(/^M0 -200/, 'L0 -200').slice(0)}L0 220L-300 220Z` : `M300 -220L0 -220${tear.replace(/^M0 -200/, 'L0 -200')}L0 220L300 220Z`;
    return G(tr(sd * k * 90, k * 30, 1, sd * k * 12), `<defs><clipPath id="${id}"><path d="${clip}"/></clipPath></defs><g clip-path="url(#${id})">${rect(-290, -210, 580, 420, '#fff', 10, 6) + inner(k > .2 || sadL)}</g>` + (k > 0 ? path(tear, 'none', 6) : '')); };
  return G(tr(x, y, s, wave(t, .6, 2)), k <= 0 ? rect(-290, -210, 580, 420, '#fff', 10, 6) + inner(sadL) + rect(-260, -180, 520, 360, 'none', 2, 4) : half(-1) + half(1)); }
// copie de contrôle
function copie(x, y, s, t, t0, note = '2/20', r = -4) { let g = rect(-230, -300, 460, 600, '#fff', 10, 6) + rect(-230, -300, 460, 70, '#e8f1ff', 10, 0) + ftext(-200, -252, 'CONTRÔLE — MATHS', { size: 30, fill: '#5b8fd8', stroke: 'none', anchor: 'start' });
  for (let i = 0; i < 9; i++) g += line(-200, -180 + i * 52, 200, -180 + i * 52, 3, '#bcd3ef') + (i < 7 ? path(`M-190 ${-196 + i * 52}q30 -14 60 0t60 0t${40 + (i * 37) % 60} 0`, 'none', 4, '#5a6b8a') : '') + (i % 2 && i < 7 ? path(`M${150} ${-206 + i * 52}l30 30M${180} ${-206 + i * 52}l-30 30`, 'none', 7, '#e2463a') : '');
  g += line(-160, -230, -160, 300, 3, '#ff9ab8');
  const k = seg(t, t0, t0 + .18), sc = lerp(2.4, 1, eOutCubic(k));
  if (k > 0) g += G(tr(110, -170, sc, -12), circ(0, 0, 110, 'none', 10, '#e2463a') + ftext(0, 24, note, { size: 74, fill: '#e2463a', stroke: 'none' }));
  return G(tr(x, y, s, r), g); }
// radio du dos (3 vertèbres qui s'envolent : k)
function xray(x, y, s, t, k = 0) { let g = rect(-170, -300, 340, 600, '#141a2a', 16, 7) + rect(-150, -280, 300, 560, '#1f2a44', 8, 0);
  for (let i = 0; i < 9; i++) { const fly = i >= 3 && i < 6 ? eOutCubic(k) : 0, dx = fly * (i % 2 ? 1 : -1) * (180 + i * 20), dy = -fly * 120 * (i - 2); g += G(tr(dx, -230 + i * 56 + dy, 1, fly * 200 * (i % 2 ? 1 : -1)), rect(-44, -20, 88, 40, '#e8f0ff', 12, 4) + rect(-70, -8, 140, 16, '#c8d6f0', 6, 3)); }
  return G(tr(x, y, s), g + ftext(0, 330, 'RADIO', { size: 34, fill: '#fff' })); }
// cape de super-héros (à dessiner AVANT le perso)
const cape = (x, y, s, t, c = SX.acc) => G(tr(x, y, s), path(`M-60 -330Q-160 -150 ${-170 + wave(t, 1.6, 30)} 0Q0 ${30 + wave(t, 1.6, 20, .3)} ${170 + wave(t, 1.6, 30, .5)} 0Q160 -150 60 -330Z`, c, 6));
const tieSvg = (x, y, s = 1) => G(tr(x, y, s), path('M-16 0L16 0L10 18L24 120L0 146L-24 120L-10 18Z', '#2f3b6e', 5) + path('M-30 -6L0 14L30 -6', 'none', 6, '#fff'));
const bouquet = (s = 1) => G(`scale(${s})`, line(0, 0, -10, -90, 6, '#4fa64f') + line(0, 0, 14, -96, 6, '#4fa64f') + line(0, 0, 30, -80, 6, '#4fa64f') + circ(-12, -100, 18, '#ff5c8a', 4) + circ(16, -108, 18, '#ffd23f', 4) + circ(34, -86, 16, '#b56cff', 4) + path('M-24 -40L36 -40L14 20L-6 20Z', '#fff', 4));
const sandwich = (s = 1) => G(`scale(${s})`, rect(-50, -20, 100, 20, '#e8b46a', 8, 4) + path('M-54 -24Q0 -40 54 -24', 'none', 10, '#7be07b') + rect(-50, -44, 100, 20, '#e8b46a', 8, 4));
const rubberChicken = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-20 0Q-30 -90 0 -120Q20 -134 30 -110Q60 -60 40 0Q60 40 20 60Q-30 60 -20 0Z', '#ffd23f', 5) + path('M20 -126L30 -146L40 -128Z', '#e2463a', 4) + path('M34 -112L58 -106L36 -98Z', '#ff9a4d', 4) + circ(14, -114, 4, OL, 0));
const smileMask = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), ell(0, 0, 130, 150, '#fff', 7) + path('M-70 -40Q-50 -60 -30 -40M30 -40Q50 -60 70 -40', 'none', 8) + path('M-80 30Q0 120 80 30Q0 70 -80 30Z', '#e2463a', 6) + circ(0, 0, 26, '#ff2e3d', 5) + ell(-80, 20, 20, 12, '#ff8fb1', 0) + ell(80, 20, 20, 12, '#ff8fb1', 0) + line(-120, -10, -200, -30, 4) + line(120, -10, 200, -30, 4));
const phoneRec = (x, y, s, r, t) => G(tr(x, y, s, r), rect(-50, -90, 100, 180, '#2b2b33', 18, 5) + rect(-40, -74, 80, 148, '#bfe3ff', 6, 0) + circ(-20, -56, 8, Math.sin(t * 8) > 0 ? '#ff3b30' : '#bfe3ff', 0));
const thumbDown = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-50, -50, 100, 90, SKIN, 26, 6) + rect(-24, 30, 40, 80, SKIN, 18, 6) + line(-50, -20, 50, -20, 4) + line(-50, 6, 50, 6, 4));
const muteIco = (x, y, s, t, t0) => { const k = popEl(t, t0, .5); return k <= 0 ? '' : G(tr(x, y, s * k), circ(0, 0, 80, '#fff', 7) + path('M-40 -20L-16 -20L10 -44L10 44L-16 20L-40 20Z', OL, 0) + path('M24 -22L56 22M56 -22L24 22', 'none', 9, '#e2463a')); };
function errorWin(x, y, t, t0, title_ = 'probleme.exe', msg = 'PROBLÈME') { const k = popEl(t, t0, .5); if (k <= 0) return ''; return G(tr(x, y, k, -3 + Math.sin(t * 20) * (t - t0 < .4 ? 3 : 0)), rect(-300, -150, 600, 300, OL, 18, 0).replace('/>', ' transform="translate(12 14)"/>') + rect(-300, -150, 600, 300, '#fff', 18, 7) + rect(-300, -150, 600, 64, SX.acc, 18, 7) + ftext(-270, -104, title_, { size: 32, fill: '#fff', stroke: 'none', anchor: 'start' }) + circ(255, -118, 18, '#ffd23f', 5) + G(tr(-190, 40), circ(0, 0, 60, '#e2463a', 6) + ftext(0, 28, '!', { size: 80, fill: '#fff', stroke: 'none' })) + ftext(80, 62, msg, { size: 64, fill: OL, stroke: 'none' })); }
const sadIco = circ(0, 0, 54, '#ffd23f', 5) + circ(-18, -10, 7, OL, 0) + circ(18, -10, 7, OL, 0) + path('M-22 28Q0 8 22 28', 'none', 6) + circ(-20, 8, 6, '#8fd0ff', 0);
const SEPIA = () => rect(-M, -M, W + 2 * M, H + 2 * M, 'rgba(255,190,120,.18)', 0, 0);
const GREY = (k = .35) => rect(-M, -M, W + 2 * M, H + 2 * M, `rgba(60,70,100,${k})`, 0, 0);
const spot = (x, y0, x0, x1, yb, o = .25) => op(o, path(`M${x - 50} ${y0}L${x0} ${yb}L${x1} ${yb}L${x + 50} ${y0}Z`, '#fff6c8', 0));
const backpack = (s = 1) => G(`scale(${s})`, rect(-90, -150, 180, 210, '#e2463a', 40, 6) + rect(-60, -40, 120, 70, '#c43a2e', 18, 5) + circ(0, -90, 14, '#ffd23f', 4));

// escalier du collège : marches en diagonale, rampe, fenêtre, affiches, extincteur, néon SORTIE, plantes, néons au plafond
function stairsT(t) { const yb = 1250; let s = qWall('stripe', '#e6f2e2', '#d9ebd3', yb) + rect(-M, 820, W + 2 * M, yb - 820, '#bfdcb4', 0, 0) + line(-M, 820, W + M, 820, 6, '#9cc28f');
  for (let i = 0; i < 3; i++) { const x = 120 + i * 360, fl = i === 1 && Math.sin(t * 19) > .4; s += rect(x, 30, 220, 26, fl ? '#9aa8b5' : '#fffbe6', 12, 5) + (fl ? '' : op(.16, path(`M${x} 56L${x + 220} 56L${x + 300} 360L${x - 80} 360Z`, '#fffbe6', 0))); }
  s += qWindowView(700, 180, 300, 360, t) + rect(690, 170, 320, 380, 'none', 8, 8) + line(850, 180, 850, 540, 6);
  s += qPoster(160, 330, 150, 200, '#5b8fd8', -3, ftext(0, -40, 'CLUB', { size: 30, fill: '#fff', stroke: 'none' }) + ftext(0, 10, 'THÉÂTRE', { size: 26, fill: '#ffd23f', stroke: 'none' }) + circ(0, 60, 26, '#fff', 4), t) + qPoster(360, 300, 140, 180, '#ff9a4d', 4, ftext(0, 0, 'NE PAS', { size: 24, fill: '#fff', stroke: 'none' }) + ftext(0, 34, 'COURIR', { size: 24, fill: '#fff', stroke: 'none' }), t);
  s += qNeon(560, 250, 'SORTIE', '#3fd27a', t, 40) + wallClock(560, 400, 44, t) + extinguisher(1030, 760, .45) + qSwitch(620, 700) + qOutlet(120, 760);
  // marches (du haut gauche vers le bas droite)
  let d = 'M-200 520'; for (let i = 0; i < 11; i++) { const x = -200 + i * 130, y = 520 + i * 75; d += `L${x + 130} ${y}L${x + 130} ${y + 75}`; } d += `L1300 ${yb + 600}L-200 ${yb + 600}Z`;
  s += path(d, '#d8c8a8', 7); for (let i = 0; i < 11; i++) { const x = -200 + i * 130, y = 520 + i * 75; s += rect(x, y - 6, 130, 12, '#ffd23f', 0, 3) + rect(x + 10, y + 20, 110, 40, '#cbb995', 4, 0); }
  // rampe
  s += line(-200, 300, 1300, 1160, 16, '#e2463a'); for (let i = 0; i < 8; i++) { const x = -150 + i * 190, y = 300 + (x + 200) * 860 / 1500, sy = 520 + Math.floor((x + 200) / 130) * 75; s += line(x, y, x, sy, 8, '#9aa3ad'); }
  s += WASH('rgba(255,255,255,.08)') + qPot(1010, yb, .9, t, 1) + qBin(70, yb + 20, .7, '#36a85a') + rect(-M, yb + 300, W + 2 * M, 900, '#c9b8a0', 0, 0);
  return s; }
// plafond vu du sol (POV allongé) : néons, dalles, bouche d'aération
function ceilingPOV(t) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#eef1f4', 0, 0); for (let x = -M; x < W + M; x += 180) s += line(x, -M, x, H + M, 4, '#d4dae0'); for (let y = -M; y < H + M; y += 180) s += line(-M, y, W + M, y, 4, '#d4dae0');
  for (let i = 0; i < 3; i++) s += rect(160 + i * 300, 220 + (i % 2) * 120, 160, 50, '#fffbe6', 14, 5) + op(.25 + .1 * Math.sin(t * 9 + i), circ(240 + i * 300, 245 + (i % 2) * 120, 120, '#fffbe6', 0));
  s += rect(780, 1300, 200, 120, '#cfd6dd', 6, 5) + [0, 1, 2, 3].map(i => line(800, 1320 + i * 26, 960, 1320 + i * 26, 5, '#9aa3ad')).join('') + circ(150, 1350, 40, '#fff', 5) + circ(150, 1350, 12, '#e2463a', 0);
  return s; }

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, Léo au nez rouge en cut-out, « débloqué » étoiles sur MEC DRÔLE
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'mec') - .05; return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
    G(tr(CX, 1010, 1 + .03 * Math.sin(t * 6)), cutout(leoHead(0, 0, 170, { expr: t > K ? 'laugh' : 'joy' }, t), 14)) + unlock(CX, 1000, t, K, { part: 'front', r: 480 }) +
    funTag(220, 820, 'HA !', t, .55, { size: 46, bg: '#fff', fg: SX.ink, r: -12 }) + funTag(880, 1180, 'LOL', t, .8, { size: 46, bg: SX.cool, r: 8 }) + funBox(CX, 1010, 430, 430, t, 1.2, { label: 'clown.png' }) +
    kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'ÊTRE LE", CX, 415, t, .3, { size: 58 }) + kword('MEC DRÔLE ?', CX, 540, t, K, { size: 88, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [.55, 'squeak', .5], [at(1, 'mec') - .05, 'boom', .6], [at(1, 'mec'), 'sparkle', .6], [1.2, 'tick', .5]] });
// B002 — la photo de famille se déchire sur « divorcer »
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const D = at(2, 'divorcer'); return paper(SX.paper) + gobo(T, .12) + burst(CX, 900, 360, t, D, '#ffe1e8', 16) + cutout(famPhoto(CX, 900, 1.25, t, eOutCubic(seg(t, D, D + .5))), 12) +
    kthin('tes parents vont…', CX, 380, t, at(2, 'parents') - .1, { size: 56, fill: SX.ink }) + kword('DIVORCER', CX, 500, t, D - .05, { size: 104, fill: SX.acc }) + markerText('crac', 860, 1180, t, D + .1, { size: 54, col: SX.acc }); },
  sfx: [[at(2, 'parents') - .1, 'pop', .5], [at(2, 'divorcer') - .05, 'boom', .5], [at(2, 'divorcer'), 'crack', .8], [at(2, 'divorcer') + .1, 'scratch', .4]] });
// B003 — nuit blanche : grille nuit, Léo cerné, réveil 03:12
B(3, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { let s = gridBg('#1d2350'); for (let i = 0; i < 14; i++) s += sparkle((i * 173) % W, 120 + (i * 311) % 700, .2 + .12 * Math.sin(t * 4 + i), '#fff6d6');
    return s + cutout(leoHead(CX, 1040, 165, { expr: 'deadpan', nose: 0, bags: 1, face: { mouth: 'flat' } }, t), 12) + G(tr(CX + 300, 760, 1, wave(t, 14, 4)), alarmClockQ(t)) +
      funTag(CX - 280, 700, Math.sin(t * 6) > 0 ? '03:12' : '03 12', t, .05, { size: 52, bg: '#141a3a', fg: '#ff5c8a', r: -6 }) + kword('0 H DE SOMMEIL', CX, 480, t, at(3, 'dormi') - .05, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'clock_fast', .5], [at(3, 'dormi') - .05, 'boom', .5], [at(3, 'nuit'), 'ring', .4]] });
function alarmClockQ(t) { return circ(-40, -56, 18, '#e2463a', 5) + circ(40, -56, 18, '#e2463a', 5) + circ(0, 0, 60, '#e2463a', 6) + circ(0, 0, 44, '#fff', 4) + line(0, 0, 0, -30, 5) + line(0, 0, 22, 0, 5); }
// B004 — le lendemain : il entre en classe, traînant les pieds, cerné ; Kevin le repère
B(4, { enter: 'whip', cam: zin(1.02, 1.07, .3),
  draw: (t, d, T) => classR(t) + pupils(t, [560, 760, 950], 1330, .72, { ex: ['neutral', 'happy', 'smug'], kev: 2, look: [-1, 0] }) +
    leo({ x: lerp(120, 300, t / d), y: 1520, s: 1.3, expr: 'deadpan', nose: 0, bags: 1, walk: 2, look: [1, 0], armL: [100, 95], armR: [80, 85] }, t) + G(tr(lerp(120, 300, t / d) + 120, 1300, .7), backpack()) +
    funTag(CX, 360, 'LE LENDEMAIN', t, .05, { size: 50, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'whoosh', .5], [.05, 'pop', .5], [.2, 'steps', .6], [at(4, 'classe'), 'school_bell', .4]] });
// B005 — gros plan Kevin qui te fixe (crash zoom)
B(5, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.12, eOutCubic(clamp(t / d))) }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.5, svg: classR(t), haze: .25 }, { z: 1, svg: kevinHead(CX, 880, 240, { expr: 'smug', look: [-.7, 0] }, t) + sparkle(CX - 90, 860, .5 + .3 * Math.sin(t * 12), '#fff') }]) + funTag(800, 520, 'KEVIN', t, at(5, 'kevin'), { size: 52, bg: '#5fb85f' }) + markerText('il te fixe…', CX, 1200, t, at(5, 'regarde'), { size: 50, col: SX.acc2 }),
  sfx: [[0, 'whoosh', .6], [at(5, 'kevin'), 'pop', .5], [at(5, 'regarde'), 'glint', .7]] });
// B006 — « Allez ! Fais-nous rire ! » : toute la classe scande, Kevin debout te pointe
B(6, { enter: 'punch', flash: 1, cam: (t, d) => ({ z: 1.05, hand: .6, shake: t > at(6, 'fais') ? 5 : 0 }),
  draw: (t, d, T) => classR(t) + pupils(t, [130, 340, 740, 950], 1330, .72, { ex: ['laugh', 'mock', 'laugh', 'joy'], up: 1, look: [0, 0] }) + burst(CX, 900, 300, t, at(6, 'fais') - .1, SX.acc2, 16) +
    kevin({ x: CX, y: 1560, s: 1.3, expr: 'mock', armR: [-90, -95], armL: [200, 230], look: [0, .3] }, t) + funTag(CX - 250, 620, 'ALLEZ !', t, at(6, 'allez'), { size: 56, bg: '#fff', fg: SX.ink }) + kword('FAIS-NOUS RIRE !', CX, 470, t, at(6, 'fais') - .05, { size: 74, fill: SX.acc2 }),
  sfx: [[0, 'drum', .5], [at(6, 'allez'), 'pop', .6], [at(6, 'fais') - .05, 'boom', .6], [at(6, 'nourrir'), 'whistle', .4]] });
// B007 — « Et là, tu comprends » : tout s'éteint, projecteur, vertige
B(7, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.16, eInOut(clamp(t / d))), r: lerp(0, -4, t / d) }),
  draw: (t, d, T) => { const C = at(7, 'comprends'); return classR(t) + op(.72, rect(-M, -M, W + 2 * M, H + 2 * M, '#120c1e', 0, 0)) + spot(CX, -200, 120, 960, 1500, .3) + leoHead(CX, 900, 230, { expr: t > C ? 'jawdrop' : 'shock', nose: 0, bags: 1 }, t) +
    markerText('…oh non.', CX + 170, 560, t, C + .05, { size: 60, col: SX.acc }) + (t > C ? speedLines(t, CX, 900, 30, 'rgba(255,255,255,.35)') : ''); },
  sfx: [[0, 'heartbeat', .6], [at(7, 'comprends'), 'sting', .7]] });
// B008 — plus le droit d'être triste : larme… panneau INTERDIT, et le nez de clown se plaque tout seul (sourire forcé)
B(8, { enter: 'drop', cam: camHand(1.05, .4),
  draw: (t, d, T) => { const Dr = at(8, 'droit'), Tr = at(8, 'triste'), nk = popEl(t, Tr, .5); return classR(t) + pupils(t, [120, 960], 1330, .72, { ex: ['smug', 'mock'], kev: 1 }) +
    leo({ x: CX, y: 1520, s: 1.35, expr: t > Tr ? 'laugh' : 'sob', face: t > Tr ? { brows: 'sad' } : {}, nose: nk, bags: 1 }, t) + pupitre(CX, 1520, 1.35, '#c58e55', 4) + (t > Tr ? sweatSpray(CX, 1000, t, 4) : '') +
    noSign(CX, 560, 1, t, Dr, sadIco) + funTag(CX, 760, 'TRISTESSE INTERDITE', t, Dr + .15, { size: 40, bg: '#e2463a' }) + (nk > 0 && nk < 1 ? popStars(CX, 1080, t, Tr, 6, 140) : ''); },
  sfx: [[0, 'gulp', .4], [at(8, 'droit'), 'whistle', .7], [at(8, 'droit') + .15, 'error_beep', .5], [at(8, 'triste'), 'squeak', .8], [at(8, 'triste') + .1, 'boing', .5]] });
// B009 — Bienvenue dans la vie du mec drôle : scène de théâtre, néon, salut, confettis
B(9, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const scr = ftext(540, 600, 'LE MEC DRÔLE', { size: 92, fill: Math.sin(t * 9) > -.5 ? '#ff3d8b' : '#ffd0e2', stroke: OL, sw: 10 }) + ftext(540, 700, '★ ★ ★', { size: 60, fill: SX.acc2, stroke: 'none' });
    return stageT(t, scr) + spot(CX, 100, 260, 820, 1500, .25) + leo({ x: CX, y: 1500, s: 1.35, expr: 'joy', armL: [200, 160], armR: [-20, 20], headTilt: wave(t, 1, 6) }, t) + confetti(t, at(9, 'bienvenue'), 36) + kword('BIENVENUE', CX, 400, t, at(9, 'bienvenue') - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [at(9, 'bienvenue') - .05, 'tada', .7], [at(9, 'drole'), 'sparkle', .5], [at(9, 'classe'), 'pop', .5]] });
// B010 — Tout commence en 6e : flashback sépia, petit Léo (sans nez) et son cartable géant devant le collège
B(10, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.0, 1.06),
  draw: (t, d, T) => schoolyard(t) + G(tr(lerp(380, 460, t / d) - 70, 1270, 1.05, -6), backpack(1.2)) + leo({ x: lerp(380, 460, t / d), y: 1480, s: 1.1, expr: 'joy', nose: 0, walk: 3 }, t) + SEPIA() +
    kword('6e', 820, 600, t, at(10, '6e') - .05, { size: 190, fill: SX.acc2 }) + kthin('tout commence en', CX, 380, t, .05, { size: 56 }),
  sfx: [[0, 'rewind', .5], [.1, 'school_bell', .4], [at(10, '6e') - .05, 'boom', .6]] });
// B011 — imitation du prof de maths : fausse moustache, lunettes, règle, devant le tableau
B(11, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => classR(t, { board: boardTxt('MATHS', 'x + 2 = ?') }) + leo({ x: 380, y: 1500, s: 1.3, expr: 'suspicious', nose: 0, glasses: true, mustache: true, armR: [-40 + wave(t, 3, 20), -60], holdR: G('rotate(-30)', rect(-10, -170, 20, 200, '#ffd23f', 4, 4)), armL: [130, 160] }, t) +
    pupils(t, [800, 1010], 1330, .72, { ex: ['joy', 'laugh'], look: [-1, 0] }) + funTag(CX, 330, 'IMITATION', t, at(11, 'imitation') - .05, { size: 54, bg: SX.cool }) + markerArrow(640, 820, 440, 1000, t, at(11, 'prof'), { col: SX.acc2, bend: 60 }) + markerText('fausse moustache', 720, 790, t, at(11, 'prof'), { size: 40, col: SX.acc2 }),
  sfx: [[0, 'whoosh', .5], [at(11, 'imitation') - .05, 'pop', .6], [at(11, 'prof'), 'scratch', .4], [at(11, 'maths'), 'hmm', .6]] });
// B012 — toute la classe explose de rire : élèves pliés, l'un tombe de sa chaise, « HA ! » partout
B(12, { enter: 'punch', flash: 1, cam: (t, d) => ({ z: 1.04, shake: t > at(12, 'explose') ? 7 : 0 }),
  draw: (t, d, T) => { const E = at(12, 'explose'); return classR(t) + burst(CX, 760, 380, t, E - .1, SX.acc2, 18) + pupils(t, [130, 370, 620, 870], 1330, .75, { ex: ['ecstatic', 'mock', 'laugh', 'ecstatic'], kev: 2, rot: i => t > E ? (i % 2 ? 8 : -8) * Math.sin(t * 16 + i) : 0 }) +
    hahas(t, E, 8, 4, 1000, 560) + kword('EXPLOSE', CX, 450, t, E - .05, { size: 130, fill: SX.acc2 }) + (t > E ? kid(5, { x: 1010, y: 1400, s: .7, expr: 'ecstatic', rot: lerp(0, 70, eOutCubic(seg(t, E + .2, E + .6))) }, t) : ''); },
  sfx: [[0, 'drum', .4], [at(12, 'explose') - .05, 'boom', .8], [at(12, 'explose') + .2, 'boing', .5], [at(12, 'rire'), 'thud', .6], [at(12, 'rire') + .2, 'pop', .5]] });
// B013 — même le prof sourit : gros plan, entouré au marqueur
B(13, { enter: 'whip', cam: zin(1.04, 1.12),
  draw: (t, d, T) => { const S = at(13, 'sourit'); return depth({ zoom: 1 }, [{ z: 1.4, svg: classR(t), haze: .25 }, { z: 1, svg: profHead(CX, 880, 250, { expr: t > S ? 'smugger' : 'deadpan' }, t) }]) +
    markerCircle(CX, 975, 190, 90, t, S, { col: SX.acc }) + markerText('il sourit !!', CX + 160, 520, t, S + .1, { size: 64, col: SX.acc2 }) + (t > S ? sparkle(CX + 170, 980, .6 + .3 * Math.sin(t * 10), '#fff') : '') + funTag(CX - 250, 420, 'MÊME LE PROF', t, .05, { size: 40, bg: '#8a6ad8' }); },
  sfx: [[.05, 'pop', .5], [at(13, 'sourit'), 'glint', .8], [at(13, 'sourit') + .1, 'scratch', .5]] });
// B014 — Magnifique ! → super pouvoir : cape, le NEZ ROUGE apparaît (débloqué)
B(14, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(14, 'super') && t < at(14, 'super') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const S = at(14, 'super') - .05, nk = popEl(t, S, .6); return rays(t, CX, 950, '#ffe9a6', '#ffd76b', 24) + unlock(CX, 1010, t, S, { part: 'back', r: 520 }) + (t > S ? cape(CX, 1500, 1.35, t) : '') +
    leo({ x: CX, y: 1500, s: 1.35, expr: t > S ? 'ecstatic' : 'wow', nose: nk, armL: t > S ? [200, 180] : [130, 140], armR: t > S ? [-60, -90] : [50, 40] }, t) + unlock(CX, 1050, t, S, { part: 'front', r: 520 }) + confetti(t, 0, 26) +
    kword('MAGNIFIQUE !', CX, 440, t, .05, { size: 92, fill: '#fff', op: 1 - seg(t, S - .2, S) }) + kword('SUPER POUVOIR', CX, 440, t, S, { size: 84, fill: SX.acc2 }) + funTag(CX + 230, 760, 'NEZ.exe', t, S + .3, { size: 38, bg: SX.acc }); },
  sfx: [[.05, 'tada', .6], [at(14, 'super') - .3, 'magic', .6], [at(14, 'super') - .05, 'boom', .6], [at(14, 'super'), 'squeak', .7], [at(14, 'pouvoir'), 'sparkle', .6]] });
// B015 — Sauf qu'il y a un problème : arrêt sur image, fenêtre d'erreur
B(15, { enter: 'none', trans: 'glitch', transD: .25, cam: () => ({ z: 1.06 }),
  draw: (t, d, T) => { const P = at(15, 'probleme'); return rays(0, CX, 950, '#e6e0d0', '#d6cfbf', 24) + cape(CX, 1500, 1.35, 0, '#b0a8a0') + leo({ x: CX, y: 1500, s: 1.35, expr: 'shock', armL: [200, 180], armR: [-60, -90] }, 0) + GREY(.25) + errorWin(CX, 620, t, P - .1); },
  sfx: [[0, 'scratch', .8], [at(15, 'probleme') - .1, 'error_beep', .8], [at(15, 'probleme') + .1, 'pop', .4]] });
// B016 — tout le monde attend la suite : sur scène, micro, le public (popcorn) attend ; barre de chargement
B(16, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const S = at(16, 'suite'), k = seg(t, .2, d - .1); let s = stageT(t, '') + spot(760, 100, 520, 1000, 1500, .3) + G(tr(760, 1460, 1.15), line(0, 0, 0, -260, 7, '#555') + G(tr(0, -270, 1, -15), rect(-14, -40, 28, 50, '#333', 12, 4))) +
    leo({ x: 820, y: 1480, s: 1.2, expr: 'worried', look: [-1, 0] }, t);
    for (let i = 0; i < 3; i++) { const x = 110 + i * 170, y = 1460 + (i % 2) * 30; s += (i === 1 ? kevin : (o, tt) => kid(i + 2, o, tt))({ x, y, s: .95, expr: 'wow', look: [1, -.3] }, t) + G(tr(x + 75, y - 120), path('M-40 -40L40 -40L30 30L-30 30Z', '#fff', 5) + [[-20, -50], [0, -60], [20, -48], [-8, -44]].map(([a, b]) => circ(a, b, 14, '#fff6c8', 4)).join('') + path('M-30 -40L-24 30M0 -40L0 30M24 -40L20 30', 'none', 6, '#e2463a')); }
    return s + bar(CX, 640, 560, k, { label: 'LA SUITE…' }) + kword('LA SUITE ?', CX, 450, t, S - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [.3, 'tick', .5], [.7, 'tick', .5], [1.1, 'tick', .5], [at(16, 'suite') - .05, 'boom', .5]] });
// B017 — en retard : il déboule dans le couloir, horloge 8h17
B(17, { enter: 'whip', cam: () => ({ z: 1.05, hand: .8 }),
  draw: (t, d, T) => hallway(t) + leo({ x: lerp(1000, 520, eOutCubic(clamp(t / .5))), y: 1520, s: 1.3, expr: 'panic', walk: 8, flip: 1, armL: [200, 220], armR: [-20, -50] }, t) + motionLines(lerp(1000, 520, eOutCubic(clamp(t / .5))) + 200, 1150, 3, 90, 0) +
    funTag(CX, 420, 'RETARD : 8 h 17', t, at(17, 'retard') - .1, { size: 54, bg: '#e2463a' }),
  sfx: [[0, 'steps', .8], [.1, 'whoosh', .6], [at(17, 'retard') - .1, 'clock_fast', .6]] });
// B018 — « Vas-y ! Trouve une excuse drôle ! » : toute la classe se retourne et attend, Léo improvise
B(18, { enter: 'punch', cam: zin(1.03, 1.08, .3),
  draw: (t, d, T) => { const E = at(18, 'excuse'); return classR(t, { board: ' ' }) + prof({ x: 980, y: 1560, s: 1.15, expr: 'suspicious', flip: 1, armL: [150, 200], armR: [30, -20] }, t) + pupils(t, [560, 760], 1340, .72, { ex: ['smug', 'mock'], kev: 1, look: [-1, 0] }) +
    leo({ x: 230, y: 1520, s: 1.3, expr: 'worried', armR: [-30, -70], look: [1, 0] }, t) + sweatSpray(230, 1000, t, 5) + funTag(760, 700, 'VAS-Y !', t, at(18, 'y'), { size: 48, bg: '#5fb85f' }) +
    funTag(CX, 400, 'EXCUSE DRÔLE ?', t, E - .1, { size: 60, bg: SX.acc2, fg: SX.ink }) + markerText('« un pigeon a volé mon bus ! »', CX, 580, t, E + .2, { size: 46, col: '#fff' }); },
  sfx: [[at(18, 'y'), 'pop', .6], [at(18, 'excuse') - .1, 'boing', .6], [at(18, 'excuse') + .2, 'scratch', .4], [at(18, 'drole'), 'hmm', .5]] });
// B019 — contrôle raté : copie géante, 2/20 tamponné
B(19, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => paper('#fff1d6') + gobo(T, .1) + cutout(copie(CX - 60, 820, 1.05, t, at(19, 'controle')), 10) + cutout(leoHead(860, 1120, 120, { expr: t > at(19, 'controle') ? 'terror' : 'worried', look: [-1, -.5] }, t), 10) + funTag(CX, 380, 'CONTRÔLE', t, .05, { size: 52, bg: SX.cool }),
  sfx: [[0, 'printer', .4], [.05, 'pop', .5], [at(19, 'controle'), 'thud', .8], [at(19, 'controle') + .1, 'gasp', .5]] });
// B020 — « fais une blague sur ta note » : copie brandie comme un micro, rire forcé, ba-dum-tss
B(20, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const N = at(20, 'note'); return classR(t, { board: ' ' }) + pupils(t, [130, 960], 1330, .72, { ex: ['laugh', 'mock'], kev: 1 }) + leo({ x: CX, y: 1520, s: 1.35, expr: 'laugh', face: { brows: 'sad' }, armR: [-60, -100], holdR: G('rotate(20)', copie(0, -60, .28, 1, 0)) }, t) + sweatSpray(CX, 1000, t, 4) +
    funTag(CX, 420, 'BLAGUE !', t, at(20, 'blague') - .05, { size: 58, bg: SX.acc }) + markerText('2/20 = mon QI ?', CX, 600, t, N - .1, { size: 64, col: SX.acc2 }) + hahas(t, N + .1, 4, 7, 980, 700); },
  sfx: [[at(20, 'blague') - .05, 'pop', .6], [at(20, 'note') - .1, 'scratch', .4], [at(20, 'note') + .1, 'rimshot', .7]] });
// B021 — chute dans les escaliers : Léo dévale en tourbillon
B(21, { enter: 'crash', cam: (t, d) => ({ z: 1.04, hand: .6, shake: Math.floor(t / .25) % 2 ? 6 : 0 }),
  draw: (t, d, T) => { const k = clamp(t / d), x = lerp(60, 820, k), y = 520 + (x + 200) / 130 * 75 + 30 - Math.abs(Math.sin(k * 12)) * 60; return stairsT(t) + G(tr(x, y - 140, 1, k * 900), leo({ x: 0, y: 140, s: .9, expr: 'dizzy', armL: [200, 260], armR: [-20, -80], legL: [60, 30], legR: [140, 170] }, t)) +
    motionLines(x - 220, y - 160, 3, 100, 30) + [0, 1, 2].map(i => G(tr(x - 120 - i * 90, y - 300 - i * 40 + k * 200, 1, t * 200 + i * 60), rect(-40, -50, 80, 100, '#fff', 4, 4))).join('') + funTag(CX, 380, 'ESCALIERS', t, at(21, 'escaliers') - .1, { size: 54, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .6], [.25, 'thud', .6], [.5, 'thud', .6], [.75, 'thud', .6], [at(21, 'escaliers'), 'boing', .5]] });
// B022 — personne ne t'aide : allongé en bas, étoiles qui tournent, les autres regardent, criquets
B(22, { enter: 'drop', cam: () => ({ z: 1.05 }),
  draw: (t, d, T) => { let s = stairsT(t) + leo({ x: 820, y: 1180, s: 1.0, rot: -90, expr: 'dead' }, t) + stars(500, 1020, t);
    for (let i = 0; i < 3; i++) s += kid(i + 1, { x: [120, 290, 980][i], y: 1320 - (i % 2) * 20, s: 1.0, expr: ['deadpan', 'smug', 'deadpan'][i], look: [1, .5] }, t);
    return s + funTag(CX, 420, 'AIDE REÇUE : 0', t, at(22, 'personne') - .05, { size: 54, bg: '#fff', fg: SX.ink }); },
  sfx: [[0, 'thud', .7], [.1, 'crickets', .7], [at(22, 'personne') - .05, 'pop', .5]] });
function stars(x, y, t, n = 5, rr = 90) { let s = ''; for (let i = 0; i < n; i++) { const a = t * 4 + i * 6.28 / n; s += sparkle(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .35, .4, '#ffe066'); } return s; }
// B023 — ils attendent la punchline : POV au sol, cercle de visages + téléphones qui filment, roulement de tambour
B(23, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), r: wave(t, .5, 2) }),
  draw: (t, d, T) => { let s = ceilingPOV(t); const n = 6;
    for (let i = 0; i < n; i++) { const a = i / n * 6.283 - 1.57 + .3, x = CX + Math.cos(a) * 340, y = 860 + Math.sin(a) * 300, ex = i === 1 ? 'smug' : ['wow', 'suspicious', 'joy', 'wow', 'smug'][i % 5];
      s += G(tr(x, y, 1, (a - 1.57) * 57.3), (i === 1 ? kevinHead(0, 0, 100, { expr: 'mock', look: [0, .6] }, t) : head({ hr: 100, hair: KH[i], hairColor: KC[i], skin: SK[i], expr: ex, look: [0, .6], seed: 30 + i }, t))) + phoneRec(x + Math.cos(a) * -40 + 60, y + Math.sin(a) * -40 + 40, .7, (a - 1.57) * 57.3, t); }
    return s + burst(CX, 860, 180, t, at(23, 'punchline') - .1, SX.acc2, 14) + kword('PUNCHLINE ?', CX, 860, t, at(23, 'punchline') - .05, { size: 70, fill: '#fff' }) ; },
  sfx: [[0, 'drum', .7], [at(23, 'attendent'), 'shutter', .6], [at(23, 'punchline') - .05, 'boom', .5], [at(23, 'punchline') + .3, 'shutter', .5]] });
// B024 — « Frère, je viens de perdre 3 vertèbres ! » : assis en bas des marches, rire jaune, radio du dos
B(24, { enter: 'whip', cam: camHand(1.05, .4),
  draw: (t, d, T) => { const V = at(24, '3'); return stairsT(t) + leo({ x: 330, y: 1500, s: 1.3, expr: 'laugh', face: { brows: 'sad' }, armL: [160, 200], armR: [-40, -80], rot: -6 }, t) + sweatSpray(330, 1000, t, 4) +
    cutout(xray(800, 900, 1.0, t, seg(t, V, V + .6)), 8) + funTag(330, 640, 'FRÈRE…', t, at(24, 'frere'), { size: 50, bg: '#fff', fg: SX.ink }) + kword('-3 VERTÈBRES', CX, 430, t, V - .05, { size: 84, fill: SX.acc2 }) + hahas(t, at(24, 'vertebres') + .2, 4, 9, 1000, 700, 600, 1000); },
  sfx: [[at(24, 'frere'), 'pop', .5], [at(24, '3'), 'crack', .8], [at(24, '3') + .15, 'crack', .6], [at(24, '3') + .3, 'crack', .6], [at(24, 'vertebres') + .3, 'rimshot', .6]] });
// B025a — « Et le pire » : rayons rouges, slam
B(25, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 4 }),
  draw: (t, d, T) => rays(t, CX, 900, '#ff6b8f', '#d42f63', 22) + G(tr(CX, 1040), cutout(leoHead(0, 0, 160, { expr: 'terror' }, t), 12)) + kword('LE PIRE…', CX, 520, t, at(25, 'pire') - .1, { size: 110, fill: SX.acc2 }),
  sfx: [[0, 'flash_hit', .6], [at(25, 'pire') - .1, 'boom', .7]] });
// B025b — mode sérieux (cravate !) : personne ne te croit, toute la classe rigole
B(25, { enter: 'none', trans: 'wipe', transD: .25, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const S = at(25, 'serieux'), P = at(25, 'personne'); return classR(t) + pupils(t, [130, 960], 1330, .72, { ex: t > P ? ['mock', 'ecstatic'] : ['smug', 'smug'], kev: 1 }) + leo({ x: CX, y: 1520, s: 1.35, expr: 'suspicious', nose: 0, face: { mouth: 'flat' }, armL: [120, 60], armR: [60, 120] }, t) + tieSvg(CX, 1520 - 1.35 * 210, 1.2) +
    funTag(CX, 760, 'MODE SÉRIEUX', t, S - .1, { size: 46, bg: '#2f3b6e' }) + funTag(CX, 420, 'PERSONNE NE TE CROIT', t, P - .05, { size: 46, bg: SX.acc }) + (t > P ? hahas(t, P + .1, 5, 5, 1000, 600) : ''); },
  sfx: [[0, 'whoosh', .5], [at(25, 'serieux') - .1, 'ding', .5], [at(25, 'personne') - .05, 'pop', .6], [at(25, 'croit'), 'rimshot', .5]] }, at(25, 'quand') - .15);
// B026 — mal au ventre : teint vert, orage dans le ventre
B(26, { enter: 'drop', cam: camHand(1.06, .6),
  draw: (t, d, T) => classR(t) + leo({ x: 380, y: 1520, s: 1.35, expr: 'pain', nose: 0, skin: '#c8e6a8', armL: [60, 0], armR: [120, 180], tremble: 1 }, t) +
    G(tr(800, 760), blob(0, 0, 170, t, '#fff', 3, { t0: at(26, 'mal') }) + (t > at(26, 'mal') ? cloud(0, -10, .9, '#6b7686') + lightning(-20, 20, .3, .5 + .5 * Math.sin(t * 30)) : '')) + funTag(CX, 420, 'MAL AU VENTRE', t, at(26, 'ventre') - .1, { size: 52, bg: '#7be07b', fg: SX.ink }),
  sfx: [[0, 'growl', .7], [at(26, 'mal'), 'thunder', .4], [at(26, 'ventre') - .1, 'pop', .5]] });
// B027 — Kevin rigole : plié en deux, larmes, tape sur le pupitre
B(27, { enter: 'punch', cam: () => ({ z: 1.08, shake: 5 }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: classR(t), haze: .2 }, { z: 1, svg: kevinHead(CX, 900, 240, { expr: 'mock', face: { tears: 1 }, tilt: wave(t, 4, 8) }, t) }]) + hahas(t, 0, 5, 11, 760, 380) + funTag(CX, 420, 'KEVIN', t, at(27, 'kevin'), { size: 48, bg: '#5fb85f' }),
  sfx: [[at(27, 'kevin'), 'pop', .5], [at(27, 'rigole'), 'boing', .6], [at(27, 'rigole') + .2, 'thud', .5]] });
// B028 — amoureux : yeux-cœurs, bouquet, cœurs qui montent
B(28, { enter: 'whip', cam: zin(1.02, 1.08),
  draw: (t, d, T) => schoolyard(t) + leo({ x: 330, y: 1500, s: 1.3, expr: 'love', armR: [-20, -40], holdR: bouquet(1) }, t) + crush({ x: 800, y: 1500, s: 1.25, expr: 'neutral', flip: 1 }, t) + heartsUp(t, 330, 1000, 5) + funTag(CX, 420, 'AMOUREUX', t, at(28, 'amoureux') - .1, { size: 60, bg: '#ff8fb1' }),
  sfx: [[0, 'whoosh', .4], [at(28, 'amoureux') - .1, 'angel', .6], [at(28, 'amoureux'), 'sparkle', .5]] });
// B029 — sa crush cherche la caméra cachée (Kevin dans le buisson filme), cadre REC
B(29, { enter: 'none', trans: 'push', transD: .25, cam: camHand(1.04, .5),
  draw: (t, d, T) => { const C = at(29, 'camera'); return schoolyard(t) + G(tr(1000, 1230), kevinHead(0, -150, 70, { expr: 'mock' }, t) + phoneRec(-60, -150, .6, -10, t) + qBush(0, 0, 1.1)) + leo({ x: 260, y: 1500, s: 1.25, expr: 'sad', armR: [80, 80], holdR: bouquet(.9) }, t) +
    crush({ x: 660, y: 1500, s: 1.25, expr: 'suspicious', look: [1, -.3], armR: [-30, -20] }, t) + recFrameQ(t) + stamp(CX, 460, 'CAMÉRA CACHÉE', t, C - .05, '#e2463a', -8, 64); },
  sfx: [[0, 'hmm', .5], [at(29, 'pense'), 'shutter', .5], [at(29, 'camera') - .05, 'thud', .8], [at(29, 'cachee'), 'sting', .4]] });
function recFrameQ(t) { let s = ''; for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) s += path(`M${CX + a * 440} ${830 + b * 420 - b * 90}L${CX + a * 440} ${830 + b * 420}L${CX + a * 440 - a * 90} ${830 + b * 420}`, 'none', 10, '#fff'); return s + circ(160, 340, 16, Math.sin(t * 6) > 0 ? '#ff3b30' : 'rgba(0,0,0,0)', 0) + ftext(190, 354, 'REC', { size: 40, anchor: 'start', fill: '#fff' }); }
// B030 — même quand tu ne fais rien : assis sur un banc avec un sandwich, les gens rigolent quand même
B(30, { enter: 'drop', cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const Ri = at(30, 'rien'), G_ = at(30, 'rigolent'); return schoolyard(t) + qBench(CX, 1420, 1.4) + leo({ x: CX, y: 1500, s: 1.3, expr: 'deadpan', armR: [-70, -120], holdR: sandwich(1) }, t) +
    kid(1, { x: 150, y: 1480, s: 1.0, expr: t > G_ ? 'mock' : 'smug', armR: [-10, -10], look: [1, 0] }, t) + kid(4, { x: 940, y: 1480, s: 1.0, expr: t > G_ ? 'ecstatic' : 'joy', flip: 1, look: [-1, 0] }, t) +
    funTag(300, 420, 'BLAGUES : 0', t, Ri - .1, { size: 46, bg: '#fff', fg: SX.ink, r: -6 }) + funTag(780, 560, `RIRES : ${counter(0, 132, t, G_, .6)}`, t, G_ - .1, { size: 46, bg: SX.acc, r: 5 }) + hahas(t, G_ + .1, 4, 13, 1000, 700); },
  sfx: [[0, 'chomp', .6], [at(30, 'rien') - .1, 'pop', .5], [at(30, 'rigolent') - .1, 'pop', .6], [at(30, 'rigolent'), 'kaching', .5]] });
// B031 — blague ambulante : couloir, nez géant, poulet en caoutchouc, néon BLAGUE au-dessus de la tête
B(31, { enter: 'whip', cam: (t, d) => ({ z: 1.04, x: lerp(30, -30, t / d) }),
  draw: (t, d, T) => { const x = lerp(260, 700, t / d); return hallway(t) + kid(2, { x: 120, y: 1460, s: .95, expr: 'mock', look: [1, 0] }, t) + kid(5, { x: 960, y: 1460, s: .95, expr: 'laugh', flip: 1, look: [-1, 0] }, t) +
    leo({ x, y: 1510, s: 1.3, expr: 'deadpan', walk: 3, noseDy: 0, armR: [-10, -40], holdR: rubberChicken(0, 0, .8, 20) }, t) + G(tr(x, 1150), clownNose(130, 2.0 + .15 * Math.sin(t * 8))) + funTag(x, 900, 'BLAGUE', t, .1, { size: 46, bg: SX.acc }) +
    kword('BLAGUE AMBULANTE', CX, 430, t, at(31, 'blague') - .05, { size: 72, fill: SX.acc2 }); },
  sfx: [[0, 'squeak', .5], [.3, 'boing', .4], [at(31, 'blague') - .05, 'boom', .5], [at(31, 'ambulante'), 'rimshot', .6]] });
// B032 — puis un jour : classe grise, Léo entre sans nez, tête basse
B(32, { enter: 'none', trans: 'black', transD: .35, cam: zin(1.0, 1.05),
  draw: (t, d, T) => classR(t, { grey: .35 }) + pupils(t, [620, 840], 1330, .72, { ex: ['neutral', 'smug'], kev: 1, look: [-1, 0] }) + GREY(.15) + leo({ x: lerp(160, 300, t / d), y: 1520, s: 1.3, expr: 'sad', nose: 0, bags: 1, walk: 1.5, look: [0, .8] }, t) +
    kthin('puis un jour…', CX, 400, t, .1, { size: 64 }),
  sfx: [[0, 'wind', .5], [.2, 'steps', .5], [at(32, 'classe'), 'thud', .3]] });
// B033 — il s'assied, silencieux : icône muet, « … »
B(33, { enter: 'none', cam: zin(1.04, 1.1),
  draw: (t, d, T) => { const Si = at(33, 'silencieux'); return classR(t, { grey: .35 }) + GREY(.12) + leo({ x: CX, y: 1520, s: 1.35, expr: 'sad', nose: 0, bags: 1, face: { eyes: 'half' }, look: [0, .9] }, t) + pupitre(CX, 1520, 1.35, '#a08a70', 6) +
    muteIco(820, 640, 1, t, Si) + funTag(CX - 220, 640, '…', t, Si + .1, { size: 60, bg: '#fff', fg: SX.ink }); },
  sfx: [[0, 'thud', .5], [at(33, 'silencieux'), 'pop', .4], [at(33, 'silencieux') + .3, 'tick', .4]] });
// B034 — Kevin te pousse
B(34, { enter: 'punch', cam: (t, d) => ({ z: 1.06, shake: t > at(34, 'pousse') ? 6 : 0 }),
  draw: (t, d, T) => { const P = at(34, 'pousse'), k = eOutBack(seg(t, P - .1, P + .2)); return classR(t, { grey: .35 }) + GREY(.1) + kevin({ x: 870, y: 1520, s: 1.3, expr: 'annoyed', flip: 1, armL: [180 - k * 10, 180] }, t) +
    leo({ x: 380 - k * 60, y: 1520, s: 1.3, expr: 'sad', nose: 0, bags: 1, rot: -10 * k }, t) + motionLines(560 - k * 60, 1100, 3, 80, 0) + (k > .5 ? impactStar(520, 1050, .6) : ''); },
  sfx: [[at(34, 'kevin'), 'hmm', .4], [at(34, 'pousse') - .1, 'whoosh', .7], [at(34, 'pousse'), 'thud', .7]] });
// B035 — « Frère, t'es pas drôle aujourd'hui » : Kevin déçu, pouce en bas, 0/10
B(35, { enter: 'whip', cam: zin(1.04, 1.1),
  draw: (t, d, T) => classR(t, { grey: .35 }) + GREY(.1) + kevinHead(CX, 880, 230, { expr: 'annoyed' }, t) + G(tr(CX + 300, 1120), thumbDown(0, 0, 1.2, wave(t, 3, 6))) + funTag(CX, 450, 'PAS DRÔLE', t, at(35, 'pas') - .05, { size: 64, bg: '#e2463a' }) +
    markerText('note : 0/10', CX - 230, 640, t, at(35, 'aujourd'), { size: 50, col: SX.acc2 }),
  sfx: [[at(35, 'frere'), 'hmm', .5], [at(35, 'pas') - .05, 'error_beep', .6], [at(35, 'aujourd'), 'scratch', .4]] });
// B036 — « mes parents se séparent » : gros plan, voix basse, la photo déchirée
B(36, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.04, 1.1),
  draw: (t, d, T) => { const Se = at(36, 'separent'); return classR(t, { grey: .4 }) + GREY(.15) + leoHead(CX, 900, 240, { expr: 'sad', nose: 0, bags: 1, look: [0, .6], face: { tears: t > Se ? 1 : 0 } }, t) +
    G(tr(220, 1120, 1, -8), famPhoto(0, 0, .38, t, 1, 1)) + kthin('mes parents se séparent.', CX, 440, t, at(36, 'mes') - .05, { size: 56 }); },
  sfx: [[0, 'heartbeat', .5], [at(36, 'separent'), 'crack', .5]] });
// B037 — ils rigolent
B(37, { enter: 'punch', cam: () => ({ z: 1.05, shake: 4 }),
  draw: (t, d, T) => classR(t, { grey: .25 }) + pupils(t, [130, 370, 620, 870], 1330, .75, { ex: ['mock', 'ecstatic', 'laugh', 'mock'], kev: 0, rot: i => (i % 2 ? 6 : -6) * Math.sin(t * 16 + i) }) + hahas(t, 0, 6, 17, 1000, 560),
  sfx: [[0, 'boing', .5], [at(37, 'rigolent'), 'rimshot', .5]] });
// B038 — « Ha ouais ! Elle est sombre celle-là ! » : Kevin s'essuie une larme de rire
B(38, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const So = at(38, 'sombre'); return classR(t, { grey: .25 }) + kevin({ x: CX, y: 1520, s: 1.35, expr: 'mock', face: { tears: 1 }, armR: [-90, -40], armL: [200, 220] }, t) +
    funTag(CX - 230, 640, 'HA OUAIS !', t, at(38, 'ha'), { size: 46, bg: '#fff', fg: SX.ink }) + burst(CX, 450, 230, t, So - .1, '#3a2a4a', 14) + kword('SOMBRE !', CX, 450, t, So - .05, { size: 110, fill: '#fff' }); },
  sfx: [[at(38, 'ha'), 'pop', .5], [at(38, 'sombre') - .05, 'boom', .6], [at(38, 'la') , 'rimshot', .5]] });
// B039a — tu le regardes : Léo fixe Kevin, le son s'éteint (noir et blanc)
B(39, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => filmBW(classR(t, { grey: .2 }) + kevin({ x: 860, y: 1560, s: 1.1, expr: 'mock', flip: 1 }, t * .3) + leoHead(330, 920, 230, { expr: 'deadpan', nose: 0, bags: 1, look: [1, 0] }, t), T),
  sfx: [[0, 'heartbeat', .6]] });
// B039b — pour la première fois : le nez de clown glisse, tombe et rebondit — plus aucune envie de faire rire
B(39, { enter: 'none', trans: 'zoom', transD: .25, cam: zin(1.02, 1.1),
  draw: (t, d, T) => { const A = at(39, 'aucune') - (at(39, 'pour') - .15), P = at(39, 'personne') - (at(39, 'pour') - .15), f = seg(t, A, A + .6), L = 1330, bo = seg(t, A + .6, A + 1.1), ny = t < A + .6 ? 880 + f * f * (L - 880) : L - Math.sin(bo * 3.14) * 110;
    return classR(t, { grey: .45 }) + GREY(.2) + leoHead(CX, 880, 240, { expr: 'sad', nose: 0, bags: 1, face: { eyes: 'half', mouth: 'flat' } }, t) + G(tr(CX + f * 60 + bo * 50, ny, 1, f * 200 + bo * 120), clownNose(240, 1)) +
      kthin('pour la première fois…', CX, 420, t, .05, { size: 58 }) + funTag(CX, 560, 'MODE DRÔLE : OFF', t, P - .05, { size: 46, bg: '#3a3f4a' }); },
  sfx: [[0, 'whoosh', .3], [at(39, 'aucune') - (at(39, 'pour') - .15), 'squeak', .6], [at(39, 'aucune') - (at(39, 'pour') - .15) + .7, 'boing', .5], [at(39, 'personne') - (at(39, 'pour') - .15) - .05, 'error_beep', .4]] }, at(39, 'pour') - .15);
// B040 — le plus horrible : scène vide, le nez rouge seul sous le projecteur ; MEC DRÔLE barré
B(40, { enter: 'none', trans: 'wipe', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const Dr = at(40, 'drole'); return stageT(t, '') + op(.5, rect(-M, -M, W + 2 * M, H + 2 * M, '#0e0716', 0, 0)) + spot(CX, 60, 300, 780, 1300, .35) + ell(CX, 1260, 200, 36, 'rgba(255,246,200,.35)', 0) + G(tr(CX, 1215), clownNose(240, 1.1)) +
    kword('LE PLUS HORRIBLE', CX, 420, t, at(40, 'horrible') - .05, { size: 74, fill: SX.acc2 }) + funTag(CX, 680, 'MEC DRÔLE', t, at(40, 'pas') - .05, { size: 64, bg: SX.acc }) + cross(CX, 680, .9, t, Dr); },
  sfx: [[at(40, 'horrible') - .05, 'sting', .6], [at(40, 'pas') - .05, 'pop', .5], [at(40, 'drole'), 'thud', .7]] });
function cross(x, y, s, t, t0 = 0) { const k = pop(t, t0, .3); return k <= 0 ? '' : G(tr(x, y, s * k), path('M-80 -80L80 80M80 -80L-80 80', 'none', 46) + path('M-80 -80L80 80M80 -80L-80 80', 'none', 28, '#ff4d4d')); }
// B041 — tout le monde adore tes blagues : public en cœurs, compteur de likes, Léo nez rouge qui salue
B(41, { enter: 'drop', cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const Ad = at(41, 'adore'); let s = stageT(t, '') + spot(CX, 100, 300, 780, 1500, .3) + leo({ x: CX, y: 1460, s: 1.2, expr: 'laugh', armL: [200, 160], armR: [-20, 20] }, t);
    for (let i = 0; i < 2; i++) s += G(tr(i ? 960 : 120, 1060), head({ hr: 90, hair: KH[i + 2], hairColor: KC[i + 2], skin: SK[i + 1], expr: t > Ad ? 'love' : 'joy', seed: 40 + i }, t)) + heartsUp(t, i ? 960 : 120, 950, 4);
    return s + confetti(t, Ad, 30) + funTag(CX, 640, `♥ ${counter(0, 9999, t, Ad - .1, .8)}`, t, Ad - .1, { size: 60, bg: SX.acc }) + kthin('tout le monde adore tes', CX, 380, t, .05, { size: 52 }) + kword('BLAGUES', CX, 480, t, at(41, 'blagues') - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(41, 'adore') - .1, 'kaching', .5], [at(41, 'adore'), 'sparkle', .5], [at(41, 'blagues') - .05, 'tada', .6]] });
// B042a — presque personne ne sait : il baisse le masque souriant, une seule personne regarde vraiment (sa crush)
B(42, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const Pr = at(42, 'presque'), Pe = at(42, 'personne'), m = eInOut(seg(t, Pe - .2, Pe + .4)); return classR(t, { grey: .4 }) + GREY(.15) + crush({ x: 900, y: 1440, s: .95, expr: t > Pr ? 'worried' : 'neutral', look: [-1, 0], flip: 1 }, t) +
    leo({ x: 400, y: 1520, s: 1.35, expr: 'sob', nose: 0, bags: 1, armR: [-70 + m * 40, -100 + m * 60] }, t) + G(tr(400, lerp(1080, 1330, m)), smileMask(0, 0, .8, m * 20)) + (t > Pr ? markerArrow(780, 640, 880, 860, t, Pr, { col: SX.acc2, bend: -60 }) + markerText('elle, elle sait.', 700, 600, t, Pr + .1, { size: 44, col: SX.acc2 }) : '') +
    funTag(CX, 420, 'PRESQUE PERSONNE', t, Pr - .05, { size: 52, bg: '#3a3f4a' }); },
  sfx: [[0, 'whoosh', .3], [at(42, 'presque') - .05, 'pop', .5], [at(42, 'personne'), 'gasp', .4], [at(42, 'sait'), 'scratch', .3]] });
// B042b — FIN : « quand tu ne rigoles plus » en gros ; dernier gag : elle met le nez de clown… sur elle. Il sourit enfin (un vrai).
B(42, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d) }),
  draw: (t, d, T) => { const Ri = at(42, 'rigoles') - (at(42, 'quand') - .15), nz = popEl(t, Ri + .2, .5); return classR(t, { grey: lerp(.4, .1, seg(t, Ri, Ri + .8)) }) + leoHead(330, 960, 190, { expr: t > Ri + .4 ? 'neutral' : 'sad', nose: 0, bags: 1, look: [1, 0] }, t) +
    crushHead(770, 960, 190, { expr: 'happy', look: [-1, 0] }, t) + G(tr(770, 960), clownNose(190, nz)) + (nz > .9 ? popStars(770, 1000, t, Ri + .4, 6, 160) + heart(550, 800, .7 + .1 * Math.sin(t * 8)) : '') +
    kword('QUAND TU NE', CX, 400, t, .05, { size: 86, fill: '#fff' }) + kword('RIGOLES PLUS.', CX, 520, t, Ri - .05, { size: 96, fill: SX.acc }); },
  sfx: [[.05, 'boom', .4], [at(42, 'rigoles') - (at(42, 'quand') - .15) - .05, 'boom', .6], [at(42, 'rigoles') - (at(42, 'quand') - .15) + .2, 'squeak', .8], [at(42, 'rigoles') - (at(42, 'quand') - .15) + .5, 'sparkle', .6]] }, at(42, 'quand') - .15);

SCENES.sort((a, b) => a.s - b.s);
