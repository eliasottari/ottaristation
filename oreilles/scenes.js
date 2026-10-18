// ============================================================
//  « Pourquoi c'est horrible d'avoir les oreilles décollées ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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

// ---------- aides (texte punch, tampons, rayons, sueur…) ----------
function bigText(lines, t, t0, x, y, col = '#fff', size = 110, gap = 1.08) { return lines.map((l, i) => { const k = pop(t, t0 + i * .15, .35); return k <= 0 ? '' : G(tr(x, y + i * size * gap, k), text(0, size * .35, OL, l, col, size)); }).join(''); }
function tag(x, y, str, t, t0, bg = '#ffd23f', fg = OL, size = 60, r = 0) { const k = pop(t, t0, .35); if (k <= 0) return ''; const w = str.length * size * .58 + size; return G(tr(x, y, k, r), rect(-w / 2, -size * .8, w, size * 1.6, bg, size * .5) + text(0, size * .36, 'none', str, fg, size)); }
// titre d'accroche : plus petit et loin des bords (YouTube Shorts recadre) — largeur max ≈ 760 px (x 160→920)
function title(t) {
  const k1 = pop(t, .05, .45), k2 = pop(t, .25, .45), k3 = pop(t, .45, .5);
  return G(tr(CX, 330, k1), text(0, 26, OL, TITLE[0], '#fff', 74)) + G(tr(CX, 420, k2), text(0, 26, OL, TITLE[1], '#fff', 70)) +
    G(tr(CX, 525, k3, wave(t * 4, .6, 3)), text(0, 30, OL, `<tspan fill="${TITLE_COL}">${TITLE[2]}</tspan>`, '#fff', 88));
}
const rays = (t, cx, cy, c1, c2, n = 20) => sunburst(cx, cy, n, c1, c2, t * 12);
function cross(x, y, s, t, t0 = 0) { const k = pop(t, t0, .3); return k <= 0 ? '' : G(tr(x, y, s * k), path('M-80 -80L80 80M80 -80L-80 80', 'none', 46) + path('M-80 -80L80 80M80 -80L-80 80', 'none', 28, '#ff4d4d')); }
function stamp(x, y, str, t, t0, col = '#e2463a', r = -12) { const k = seg(t, t0, t0 + .18); if (k <= 0) return ''; const s = lerp(2.2, 1, eOutCubic(k)); const w = str.length * 52 + 70; return G(tr(x, y, s, r), rect(-w / 2, -60, w, 120, 'none', 14, 12, col) + text(0, 30, 'none', str, col, 84)); }
function calendar(x, y, s, str, t, t0, r = 0) { const k = pop(t, t0, .35); return k <= 0 ? '' : G(tr(x, y, s * k, r), rect(-150, -170, 300, 340, '#fff', 18) + rect(-150, -170, 300, 90, '#e2463a', 18) + rect(-150, -110, 300, 30, '#e2463a', 0, 0) + line(-150, -80, 150, -80, 7) + text(0, 70, 'none', str, OL, 120) + text(0, 130, 'none', 'ANS', '#7a8a99', 40)); }
function stars(x, y, t, n = 5, rr = 90) { let s = ''; for (let i = 0; i < n; i++) { const a = t * 4 + i * 6.28 / n; s += sparkle(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .35, .4, '#ffe066'); } return s; }
function confetti(t, t0 = 0, n = 40, seed = 4) { const r = rng(seed); let s = ''; const k = t - t0; if (k < 0) return ''; const cols = ['#ff6fa5', '#ffd23f', '#5ec4f0', '#7be07b', '#ff8a3d']; for (let i = 0; i < n; i++) { const x = r() * W, y = -50 + (r() * 300 + k * (300 + r() * 300)) % (H + 100); s += rect(x, y, 18, 30, cols[i % 5], 4, 0).replace('/>', ` transform="rotate(${f1(k * 200 + i * 40)} ${f1(x)} ${f1(y)})"/>`); } return s; }
function hairFall(t, x, y, w, n = 10, seed = 2, col = HAIR_BROWN) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const k = (t * .5 + r()) % 1, px = x + (r() - .5) * w + Math.sin(k * 8 + i) * 40; s += op(1 - k, path(`M${f1(px)} ${f1(y + k * 700)}q20 -16 0 -40`, 'none', 5, col)); } return s; }
function phoneBig(x, y, s, r, screen) { return G(tr(x, y, s, r), rect(-170, -330, 340, 660, '#2b2b33', 44) + rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + screen + rect(-50, -318, 100, 14, '#444', 7, 0)); }
function chatBubble(x, y, w, h, str, t, t0, me_ = false, size = 40) { const k = pop(t, t0, .3); if (k <= 0) return ''; const lines = str.split('\n'); return G(tr(x, y, k), rect(-w / 2, -h / 2, w, h, me_ ? '#7fd3a0' : '#fff', 28, 5) + lines.map((l, i) => text(0, -h / 2 + 60 + i * size * 1.25, 'none', l, OL, size)).join('')); }
function sweatSpray(x, y, t, n = 6) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * 2 + i / n) % 1, sd = i % 2 ? 1 : -1; s += op(1 - k, sweat(x + sd * (60 + 220 * k), y - 120 * k + 260 * k * k, .8)); } return s; }
function puddle(x, y, k) { return k <= 0 ? '' : ell(x, y, 160 * k, 26 * k + 4, 'rgba(255,214,60,.8)', 4, 'rgba(200,150,20,.7)'); }
const zin = (a = 1, b = 1.12, hand = 0) => (t, d) => ({ z: lerp(a, b, eInOut(clamp(t / d))), hand });
const camHand = (z = 1.06, a = 1) => () => ({ z, hand: a });

// ============================================================
//  SIZEX fun : intro motion (fond graphique), puis VRAIS DÉCORS riches et vivants + couche motion rebondie. Police Fredoka.
// ============================================================
sxFun('#ff6b35'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';
const M = 700;

// ---------- figurants (repris de tache/) ----------
const KH = ['curly', 'bun', 'spiky', 'ponytail', 'short', 'long'], KC = ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040', '#1f1a18', '#6b3e26'], KS = ['#ff8fb1', '#7aa6d8', '#7be07b', '#ff9a4d', '#b56cff', '#5ec4f0'], SK = ['#f2c9a0', '#c98a5e', '#f6d7b8', '#8a5a3a', '#e0b088', '#f2c9a0'];
const kid = (i, o, t) => person(Object.assign({ age: 'kid', hair: KH[i % 6], hairColor: KC[i % 6], shirt: KS[i % 6], skin: SK[i % 6], pants: '#3b3f4a', seed: 20 + i }, o), t);
const kidHead = (i, x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: KH[i % 6], hairColor: KC[i % 6], skin: SK[i % 6], seed: 20 + i }, o), t));
const AH = ['side', 'bun', 'bald', 'long', 'short'], AC = ['#1f1a18', '#8a5a3a', '#7a6a5a', '#c4521b', '#d9d9de'], AS = ['#5b8fd8', '#e2463a', '#36a85a', '#ff9a4d', '#8a6ad8'];
const adult = (i, o, t) => person(Object.assign({ age: 'adult', hair: AH[i % 5], hairColor: AC[i % 5], shirt: AS[i % 5], skin: SK[(i + 2) % 6], pants: '#2f3b4e', seed: 60 + i, glasses: i % 3 === 0, mustache: i === 2 }, o), t);
const adultHead = (i, x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: AH[i % 5], hairColor: AC[i % 5], skin: SK[(i + 2) % 6], seed: 60 + i, glasses: i % 3 === 0, mustache: i === 2 }, o), t));

// ---------- bibliothèque de décor (reprise de tache/scenes.js) ----------
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
// premier plan flou (coins bas, sous la zone sous-titres) — ajouté par plan via FG plus bas
function fgLayer(kind, t) { let s = '';
  if (kind === 'street') s = dBush(-40, 1980, 2.2, '#4f9a4f') + G(tr(1110, 1960, 2), rect(-30, -260, 60, 260, '#3a4250', 10, 6) + circ(0, -270, 40, '#3a4250', 6));
  if (kind === 'school') s = dBush(-20, 1990, 2.4, '#5aa65a') + dBag(1060, 1990, 2.4, '#5b8fd8', -14);
  if (kind === 'room') s = dPot(-10, 2000, 2.6, t, 2, '#5b8fd8') + dBox(1090, 1990, 2.2, 'JOUETS');
  if (kind === 'class') s = G(tr(-60, 2060, 2.4), rect(-200, -200, 400, 40, '#c58e55', 6, 6) + rect(-180, -160, 360, 200, '#b07a45', 4, 6)) + dGlobe(1080, 1980, 2.2, t);
  if (kind === 'hall') s = dBin(-10, 1990, 2.4, '#36a85a') + dBag(1080, 1990, 2.2, '#ff9a4d', 12);
  if (kind === 'bath') s = G(tr(-30, 1990, 2.4), rect(-60, -200, 120, 200, '#ff8fb1', 30, 6) + rect(-26, -250, 52, 60, '#fff', 10, 5)) + G(tr(1090, 1990, 2.6), ell(0, -50, 70, 50, '#ffd23f', 6) + circ(30, -110, 36, '#ffd23f', 6) + path('M60 -110L90 -100L60 -94Z', '#ff9a4d', 4));
  if (kind === 'bed') s = dTeddy(-10, 2000, 2.6) + dLamp(1110, 2040, 1.6, 0, t, '#8a6ad8');
  if (kind === 'stage') s = G(tr(-60, 2060, 1.8), circ(0, -150, 120, '#120a18', 0) + ell(0, 0, 170, 140, '#120a18', 0)) + G(tr(1140, 2060, 1.8), circ(0, -150, 120, '#120a18', 0) + ell(0, 0, 170, 140, '#120a18', 0));
  if (kind === 'party') s = G(tr(-20, 1990, 2.4), rect(-60, -180, 120, 180, '#ff5c8a', 14, 6) + ell(0, -180, 60, 18, '#ffd23f', 5)) + G(tr(1100, 1990, 2.6), circ(0, -150, 120, '#1c1030', 0) + ell(0, 0, 170, 140, '#1c1030', 0));
  if (kind === 'gallery') s = G(tr(-30, 1990, 2.6), circ(0, -150, 110, '#3a3040', 0) + ell(0, 0, 170, 140, '#5b4a6e', 0)) + G(tr(1080, 2000, 2.2), rect(-12, -260, 24, 260, '#d9a441', 6, 5) + circ(0, -270, 30, '#d9a441', 5));
  return s ? blur(9, s) : ''; }

const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + circ(930, 150, 60, '#fff3b0', 0) + op(.35, circ(930, 150, 100, '#fff3b0', 0)) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff') + cloud(((t * 12 + 1200) % 1800) - 300, 120, .7, 'rgba(255,255,255,.85)') + dBirds(t, 3, 280);
function tree(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c') + circ(-40, -380, 14, '#e2463a', 4) + circ(60, -300, 14, '#e2463a', 4) + circ(-80, -240, 12, '#e2463a', 4)); }
function kidsBg(t, y = 1150, n = 4, s = .45) { let r = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; r += kid(i + 1, { x, y, s, expr: 'happy', walk: 3, flip: i % 2 }, t); } return r; }
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
function bathroomT(t) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#cfeaf0', 0, 0); for (let x = -M; x < W + M; x += 120) s += line(x, -M, x, H + M, 4, '#b2d6de'); for (let y = -M; y < H + M; y += 120) s += line(-M, y, W + M, y, 4, '#b2d6de');
  for (let x = -M; x < W + M; x += 120) s += rect(x, 190, 120, 60, ((x / 120) % 2 + 2) % 2 ? '#7fd3e6' : '#ffd23f', 0, 0); s += line(-M, 190, W + M, 190, 4, '#9cc8d2') + line(-M, 250, W + M, 250, 4, '#9cc8d2');
  s += rect(250, 120, 580, 44, '#e8eef0', 22, 5) + [0, 1, 2, 3].map(i => op(.6 + .3 * Math.sin(t * 3 + i), circ(320 + i * 145, 142, 18, '#fff6c8', 4))).join('');
  s += mirror(170, 280, 740, 860) + rect(770, 320, 80, 70, '#ffe066', 3, 3) + rect(700, 330, 70, 60, '#ff8fb1', 3, 3);
  s += line(-10, 520, 120, 520, 10, '#c8ced6') + towel(10, 520, 100, 300, '#ff8fb1', '#fff') + dShelf(940, 640, 150, dJar(980, 640, '#7be07b') + rect(1020, 560, 40, 80, '#5ec4f0', 10, 4) + rect(1028, 540, 24, 22, '#fff', 4, 3)) + dShelf(940, 900, 150, dPot(1010, 900, .6, t, 2, '#fff')) + dOutlet(60, 1000);
  s += rect(-M, 1250, W + 2 * M, 1400, '#e8eef0', 0, 0) + line(-M, 1250, W + M, 1250, 7, '#b8c4c8') + path(`M${CX - 300} 1250L${CX + 300} 1250Q${CX + 280} 1420 ${CX} 1430Q${CX - 280} 1420 ${CX - 300} 1250Z`, '#fff');
  s += rect(CX - 20, 1170, 40, 80, '#c8ced6', 8, 5) + path(`M${CX - 20} 1180L${CX - 20} 1150Q${CX - 20} 1130 ${CX + 30} 1130L${CX + 60} 1130L${CX + 60} 1160`, 'none', 14, '#c8ced6') + (() => { const k = (t * 1.3) % 1; return circ(CX + 60, 1170 + k * 120, 8, '#9fd6ff', 3); })();
  s += G(tr(170, 1250), rect(-36, -110, 72, 110, '#7fd3e6', 14, 5) + line(-10, -110, -16, -170, 7, '#ff8fb1') + line(12, -110, 22, -176, 7, '#5ec4f0')) + G(tr(900, 1250), rect(-40, -120, 80, 120, '#fff', 20, 5) + rect(-10, -150, 20, 30, '#c8ced6', 4, 4) + path('M10 -150L46 -150', 'none', 8, '#c8ced6')) + G(tr(990, 1250 + wave(t, 1.2, 3)), ell(0, -30, 44, 30, '#ffd23f', 5) + circ(24, -70, 24, '#ffd23f', 5) + path('M44 -72L66 -66L44 -60Z', '#ff9a4d', 3) + circ(30, -76, 4, OL, 0));
  return s; }
function stageT(t, screen = '') { let s = grad('#3a1d3e', '#1c0e22', -M, -M, W + 2 * M, H + 2 * M) + dWall('star', 'rgba(0,0,0,0)', 'rgba(255,220,160,.12)', 1300) + rect(130, 270, 820, 560, '#0f0a14', 16, 8) + rect(150, 290, 780, 520, '#fdf6ea', 8, 0) + screen;
  s += rect(-M, 175, W + 2 * M, 22, '#4a4a55', 4, 5); for (let i = 0; i < 5; i++) { const x = 120 + i * 210, a = wave(t, .5, 10, i); s += G(tr(x, 197, 1, a), rect(-22, 0, 44, 60, '#2b2b33', 8, 5) + circ(0, 64, 18, i % 2 ? '#ffe08a' : '#ff8fb1', 4)); }
  for (const sd of [-1, 1]) { let c = ''; for (let i = 0; i < 4; i++) c += path(`M${i * 45} -100Q${i * 45 + 25 + wave(t, .4, 6, i)} 700 ${i * 45 + 5} 1400`, 'none', 10, '#7a1426'); s += G(sd < 0 ? tr(-60, 0) : `translate(${W + 60} 0) scale(-1 1)`, path('M-100 -100L200 -100Q150 600 230 1400L-100 1400Z', '#b81f3a', 7) + c + path('M150 700Q230 720 210 780', 'none', 12, '#ffd23f') + circ(205, 790, 14, '#ffd23f', 4)); }
  s += path('M-100 -100L1180 -100L1180 120Q900 180 540 140Q180 180 -100 120Z', '#b81f3a', 7) + [0, 1, 2, 3, 4, 5, 6].map(i => circ(80 + i * 150, 140 + Math.sin(i) * 8, 10, '#ffd23f', 3)).join('');
  s += op(.22, path(`M${360 + wave(t, .2, 30)} 120L${140} 1450L${600} 1450Z`, '#fff6c8', 0)) + op(.14, path(`M${760 - wave(t, .25, 40)} 120L${520} 1450L${1000} 1450Z`, '#ffb3c8', 0));
  s += G(tr(930, 1300), line(0, 0, 0, -300, 7, '#555') + path('M-50 0L50 0', 'none', 8, '#555') + G(tr(0, -310, 1, -20), rect(-14, -40, 28, 50, '#333', 12, 4))) + dPot(70, 1300, .8, t, 0, '#b81f3a') + dPot(1010, 1300, .8, t, 2, '#b81f3a') + G(tr(150, 1300), rect(-40, -120, 80, 16, '#8a5a3a', 4, 4) + line(-30, -104, -36, 0, 6) + line(30, -104, 36, 0, 6));
  s += rect(-M, 1300, W + 2 * M, 900, '#6b3e26', 0, 0) + [0, 1, 2, 3].map(i => line(-M, 1330 + i * 40, W + M, 1330 + i * 40, 3, '#5a3320')).join('') + line(-M, 1300, W + M, 1300, 10, '#4a2a18') + rect(-M, 1480, W + 2 * M, 40, '#3a2010', 0, 0);
  for (let i = 0; i < 9; i++) s += ell(-40 + i * 145, 1480, 30, 14, '#ffe08a', 4) + op(.25, circ(-40 + i * 145, 1470, 40, '#fff6c8', 0));
  for (let i = 0; i < 7; i++) { const bx = 80 + i * 160, by = 1760 + wave(t, .7, 6, i * .3); s += circ(bx, by, 120, '#140a18', 0) + ell(bx, 1900, 150, 120, '#140a18', 0) + (i % 2 ? path(`M${bx - 60} ${by - 110}Q${bx} ${by - 150} ${bx + 60} ${by - 110}`, 'none', 14, '#241430') : '') + (i === 2 || i === 5 ? G(tr(bx + 70, by - 150, 1, 10), rect(-24, -40, 48, 80, '#222', 8, 4) + rect(-18, -32, 36, 62, Math.sin(t * 3 + i) > 0 ? '#bfe3ff' : '#fff6c8', 4, 0)) : ''); }
  return s; }
function bedroomN(t, lamp = 0) { const yb = 1250; let s = dWall('star', '#1d2350', '#2e3a80', yb) + rect(-M, 900, W + 2 * M, yb - 900, '#262c5e', 0, 0) + line(-M, 900, W + M, 900, 5, '#3a4290');
  s += dWindowView(620, 230, 360, 420, t, { night: true }); for (let i = 0; i < 6; i++) s += sparkle(650 + (i * 67) % 300, 270 + (i * 113) % 200, .18 + .1 * Math.sin(t * 3 + i), '#fff6d6');
  s += dCurtain(560, 210, 110, 480, '#5a3a8a', t, 1) + dCurtain(930, 210, 110, 480, '#5a3a8a', t, -1);
  s += rect(90, 300, 230, 300, '#ff8fb1', 10) + ftext(205, 470, '★', { size: 120, fill: '#fff', stroke: 'none' }) + dFrame(400, 380, 120, 150, 'sea', '#8a6ad8', 3) + dShelf(60, 720, 420, dBooks(80, 720, 180, 7) + dTrophy(310, 720, .9) + dTeddy(410, 720, .7));
  s += G(tr(820, 1260), rect(-260, -260, 40, 300, '#6b4a8a', 10, 6) + rect(-240, -90, 520, 110, '#8a6ad8', 16, 6) + path('M-220 -100Q20 -150 270 -100L280 0L-220 0Z', '#5ec4f0', 6) + path('M-200 -70Q0 -100 260 -70', 'none', 4, '#3a9ac0') + ell(-160, -130, 70, 34, '#fff', 5) + dTeddy(-40, -110, .6, '#ff9a4d'));
  s += G(tr(470, 1250), rect(-70, -150, 140, 150, '#6b4a8a', 8, 5) + line(-60, -75, 60, -75, 4) + rect(-50, -200, 100, 50, '#141a3a', 8, 4) + ftext(0, -164, Math.sin(t * 6) > 0 ? '02:47' : '02 47', { size: 26, fill: '#ff5c8a', stroke: 'none' }) + op(.25, circ(0, -176, 70, '#ff5c8a', 0)));
  s += dOutlet(70, 1100) + dSwitch(1040, 960);
  return s + rect(-M, yb, W + 2 * M, 1400, '#3a3050', 0, 0) + line(-M, yb, W + M, yb, 6, '#2a2240') + dRug(330, 1420, 520, 120, '#5a3a8a', '#ff8fb1') + dShoes(180, 1330, .55, '#ff8fb1') + dBall(940, 1360, .5, 0, '#ffc83d'); }
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
// B005 : chambre de jour, anniversaire
function kidRoomDay(t) { const yb = 1250; let s = dWall('stripe', '#ffe6c8', '#ffdcb6', yb) + dBase(yb, '#fff');
  let fl = ''; const L = 'JOYEUX ANNIV'; for (let i = 0; i < L.length; i++) { const x = 70 + i * 80, y = 200 + Math.sin(i / (L.length - 1) * Math.PI) * 50 + wave(t, 1, 3, i); fl += G(tr(x, y, 1, wave(t, 1, 5, i)), path('M-34 0L34 0L0 70Z', DPAL[i % 8], 4) + ftext(0, 34, L[i], { size: 26, fill: '#fff', stroke: 'none' })); } s += path('M30 190Q500 290 980 190', 'none', 4) + fl;
  s += dWindowView(660, 320, 300, 340, t) + dCurtain(600, 300, 100, 420, '#7be07b', t, 1) + dCurtain(920, 300, 100, 420, '#7be07b', t, -1);
  s += dShelf(60, 720, 380, dBooks(80, 720, 150, 9) + dTeddy(290, 720, .8) + dJar(380, 720, '#ff8fb1', .9)) + dFrame(170, 520, 160, 130, 'heart', '#ff9a4d', -3) + dPoster(400, 500, 140, 190, '#5ec4f0', 4, circ(0, -10, 40, '#ffd23f', 4) + path('M-50 70L-20 30L10 60L30 40L50 70Z', '#fff', 0), t);
  s += dBalloon(70, 560, '#ff5c8a', t, 0, .8) + dBalloon(1010, 780, '#5ec4f0', t, 2, .8) + dOutlet(560, 1180) + dLamp(1030, 1260, .9, 1, t, '#ff8fb1');
  return s + dParquet(yb, '#c49a6c') + dRug(560, 1440, 700, 150, '#ff8fb1', '#ffd23f') + dGift(570, 1330, .7) + dGift(1000, 1340, .6, '#ff8fb1', '#7be07b') + dBall(150, 1330, .6, t, '#5b8fd8') + dShoes(320, 1700, .7, '#e2463a'); }

// ---------- accessoires ----------
// main qui pointe (bout du doigt en tx,ty ; ang = direction du doigt ; k = entrée 0→1 depuis l'extérieur)
function pointHand(tx, ty, ang, sleeve, k = 1, len = 700) { if (k <= 0) return ''; const a = R(ang), off = (1 - k) * 800;
  return G(tr(tx - Math.cos(a) * off, ty - Math.sin(a) * off, 1, ang), line(-len, 0, -100, 0, 74, OL) + line(-len, 0, -100, 0, 60, sleeve) + rect(-54, -18, 70, 36, SKIN, 18, 6) + rect(-130, -46, 96, 92, SKIN, 38, 6) + path('M-100 -10L-50 -10M-100 14L-50 14', 'none', 5) + ell(-82, -46, 30, 16, SKIN, 6)); }
function bandAid(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-120, -40, 240, 80, '#f3c08a', 40, 6) + rect(-42, -36, 84, 72, '#e6a66a', 10, 0) + [-80, 80].map(dx => circ(dx, -12, 5, '#d9945a', 0) + circ(dx + 18, 10, 5, '#d9945a', 0)).join('')); }
function sponge(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-90, -60, 180, 120, '#ffd23f', 26, 7) + rect(-90, 20, 180, 40, '#5fb85f', 14, 7) + circ(-40, -20, 9, '#e0a820', 0) + circ(20, -30, 7, '#e0a820', 0) + circ(50, -5, 10, '#e0a820', 0)); }
function soapBar(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-120, -64, 240, 128, '#9fe6ff', 46, 7) + ell(-60, -32, 40, 12, 'rgba(255,255,255,.7)', 0) + ftext(0, 14, 'SAVON', { size: 40, fill: '#3a8fb0', stroke: 'none' })); }
function bubbles(t, x, y, w, n = 10, seed = 3, k = 1) { if (k <= 0) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < n * k; i++) { const rr = 18 + r() * 40, ph = r(), px = x + (r() - .5) * w + wave(t, .6, 20, ph), py = y - ((t * (60 + r() * 80) + ph * 300) % 400); s += circ(px, py, rr, 'rgba(255,255,255,.55)', 4, 'rgba(120,190,230,.9)') + ell(px - rr * .35, py - rr * .35, rr * .25, rr * .15, '#fff', 0); } return s; }
function foam(x, y, s, t) { let g = ''; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28; g += circ(Math.cos(a) * 220 * (1 + .1 * (i % 2)), Math.sin(a) * 220 * (1 + .1 * (i % 3)) + 30, 70 + 15 * Math.sin(t * 3 + i), '#fff', 6, '#9fd6ff'); } return G(tr(x, y, s), g); }
function firstAid(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-90, -66, 180, 132, '#fff', 18) + rect(-30, -90, 60, 30, '#ddd', 8) + rect(-16, -46, 32, 92, '#e2463a', 4, 0) + rect(-46, -16, 92, 32, '#e2463a', 4, 0)); }
function phoneBig(x, y, s, r, screen) { return G(tr(x, y, s, r), rect(-170, -330, 340, 660, '#2b2b33', 44) + rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + screen + rect(-50, -318, 100, 14, '#444', 7, 0)); }
function nameBadge(x, y, s, name, t, t0, r = -6) { const k = popEl(t, t0, .6); if (k <= 0) return ''; return G(tr(x, y, s * k, r + Math.sin(t * 3) * 1.5), rect(-200 + 10, -115 + 12, 400, 230, OL, 26, 0) + rect(-200, -115, 400, 230, '#fff', 26, 7) + path('M-196 -40L196 -40L196 -86Q196 -111 171 -111L-171 -111Q-196 -111 -196 -86Z', SX.acc, 0) + line(-200, -40, 200, -40, 6) + ftext(0, -60, 'BONJOUR', { size: 46, fill: '#fff' }) + ftext(0, -6, 'je m\'appelle', { size: 28, fill: '#7a6a5a', stroke: 'none' }) + (name ? ftext(0, 82, name, { size: 74, fill: SX.ink, stroke: 'none', font: SX.marker }) : line(-120, 78, 120, 78, 5, '#c8bfb2'))); }
function diploma(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-150, -100, 300, 200, '#fff8e0', 12) + ftext(0, -38, 'DIPLÔME', { size: 40, fill: SX.ink, stroke: 'none' }) + ftext(0, 10, 'dermato', { size: 34, fill: '#7a6a5a', stroke: 'none', font: SX.marker }) + circ(90, 60, 30, '#e2463a', 6) + path('M75 85L68 120L90 108L112 120L105 85', '#e2463a', 5)); }
function gradCap(x, y, s, r = 0, t = 0) { return G(tr(x, y, s, r), path('M-120 0L0 -50L120 0L0 50Z', '#2b2b33', 6) + path('M-70 22L-70 60Q0 90 70 60L70 22', '#2b2b33', 6) + path(`M0 0L100 10L${104 + Math.sin(t * 5) * 6} 70`, 'none', 5, '#ffd23f')); }
function heartsUp(t, x, y, n = 5, sp = 380) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * .8 + i / n) % 1; s += op(1 - k, heart(x + Math.sin(k * 9 + i) * 60 + (i - n / 2) * 30, y - k * sp, .6 + k * .3)); } return s; }
function thought(x, y, w, h, inner, k) { if (k <= 0) return ''; return G(tr(x, y, eOutBack(k)), ell(0, 0, w / 2, h / 2, '#fff', 7) + ell(-w * .3, h * .45, 30, 22, '#fff', 6) + ell(-w * .42, h * .62, 16, 12, '#fff', 5) + inner); }

// ============================================================
//  LES OREILLES DÉCOLLÉES (dessinées ici, en couche arrière de head() via hairFn : elles dépassent de chaque côté)
// ============================================================
const EARC = '#f6a99a', EARI = '#e27a72', HAIRC = '#5a3a26', HERO = '#4d8fe8';
// e = { k (taille), kL/kR (par côté), flap (battement en degrés), fs (vitesse), rot, col, inner, glow }
function bigEars(r, t, e = {}) { let s = '';
  for (const sd of [-1, 1]) { const k = (sd < 0 ? e.kL : e.kR) ?? e.k ?? 1; if (k <= 0) continue;
    const fl = (e.flap || 0) * Math.sin(t * (e.fs || 16) + (sd > 0 ? 0 : 1.3)), a = sd * (12 + (e.rot || 0) + fl), c = e.col || EARC, ci = e.inner || EARI;
    const P = (x, y) => `${f1(x * r)} ${f1(y * r)}`;
    let g = (e.glow ? glow(r * .55, 0, r * 1.1, e.glow, .55) : '') +
      path(`M${P(0, -.42)}C${P(.45, -1.0)} ${P(1.1, -.64)} ${P(1.0, -.04)}C${P(.94, .5)} ${P(.48, .68)} ${P(0, .42)}Z`, c, SW) +
      path(`M${P(.14, -.3)}C${P(.48, -.7)} ${P(.86, -.44)} ${P(.8, -.04)}C${P(.76, .32)} ${P(.44, .44)} ${P(.16, .26)}Z`, ci, 0) +
      path(`M${P(.32, -.24)}C${P(.6, -.38)} ${P(.66, -.02)} ${P(.46, .14)}`, 'none', r * .05, shade(c, -.28)) + ell(.62 * r, -.5 * r, .1 * r, .05 * r, 'rgba(255,255,255,.55)', 0);
    s += G(`translate(${f1(sd * r * .86)} ${f1(r * .08)}) rotate(${f1(a)}) scale(${f1(sd * k)} ${f1(k)})`, g); }
  return s; }
// cheveux « rideau » qui cachent les oreilles (c = 0..1 couverture, w = vent qui soulève)
function hairCurtain(r, t, c, w = 0) { if (c <= 0) return ''; let s = '';
  for (const sd of [-1, 1]) { const xo = r * (.9 + 1.0 * c), bl = w * r * (.55 + .12 * Math.sin(t * 14 + sd)), yb = r * (.98 - w * .9);
    s += path(`M${f1(sd * r * .05)} ${f1(-r * 1.1)}Q${f1(sd * (xo + bl * .5))} ${f1(-r * 1.08 - bl * .4)} ${f1(sd * (xo + bl))} ${f1(r * .1 - bl * .7)}L${f1(sd * (xo * .94 + bl))} ${f1(yb)}Q${f1(sd * xo * .72)} ${f1(yb + r * .12)} ${f1(sd * r * .76)} ${f1(r * .62)}Q${f1(sd * r * .86)} ${f1(-r * .1)} ${f1(sd * r * .42)} ${f1(-r * .74)}Z`, HAIRC, SW);
    for (let i = 1; i < 4; i++) s += path(`M${f1(sd * r * (.4 + i * .3 * c))} ${f1(-r * .8)}Q${f1(sd * (r * (.6 + i * .32 * c) + bl * .6))} ${f1(-r * .1)} ${f1(sd * (r * (.6 + i * .3 * c) + bl * .8))} ${f1(yb - r * .1)}`, 'none', 4, shade(HAIRC, -.3)); }
  return s + path(`M${f1(-r * .98)} ${f1(-r * .3)}Q0 ${f1(-r * 1.45)} ${f1(r * .98)} ${f1(-r * .3)}Q${f1(r * .45)} ${f1(-r * .62)} 0 ${f1(-r * .5)}Q${f1(-r * .45)} ${f1(-r * .62)} ${f1(-r * .98)} ${f1(-r * .3)}Z`, HAIRC, SW); }
const earHair = (e = {}) => (r, t) => { const [b, f] = hairSvg(e.style || 'short', HAIRC, r, t); return [b + bigEars(r, t, e), f + hairCurtain(r, t, e.cover || 0, e.wind || 0)]; };
// le héros (enfant puis adulte) — o.e = options d'oreilles / cheveux
const toi = (o, t) => person(Object.assign({ age: 'kid', shirt: HERO, pants: '#3b4a6b', seed: 2 }, o, { hairFn: earHair(o.e) }), t);
const toiA = (o, t) => person(Object.assign({ age: 'adult', shirt: HERO, pants: '#2f3b4e', seed: 2 }, o, { hairFn: earHair(o.e) }), t);
const toiHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, seed: 2 }, o, { hairFn: earHair(o.e) }), t));
const headOf = (x, y, s, age = 'kid') => [x, y - (age === 'kid' ? 292 : 402) * s, (age === 'kid' ? 100 : 92) * s];
// Kevin (rouquin à pics, t-shirt vert, taches de rousseur) — enfant puis adulte
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinA = (o, t) => person(Object.assign({ age: 'adult', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const photog = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#1f1a18', mustache: true, glasses: true, shirt: '#e2463a', pants: '#2b2b33', seed: 8 }, o), t);
const docO = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#8a5a3a', glasses: true, shirt: '#ffffff', coat: true, stetho: true, pants: '#5b8fd8', seed: 4 }, o), t);
const elle = (o, t) => person(Object.assign({ age: 'adult', hair: 'long', hairColor: '#2b2420', skin: '#c98a5e', shirt: '#b56cff', pants: '#4b3b6e', seed: 5 }, o), t);
const elleHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'long', hairColor: '#2b2420', skin: '#c98a5e', seed: 5 }, o), t));
// tête d'enfant figurant avec ses propres oreilles (k = taille)
const kidEarHead = (i, x, y, r, k, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, skin: SK[i % 6], seed: 20 + i }, o, { hairFn: (rr, tt) => { const [b, f] = hairSvg(['curly', 'bun', 'short', 'ponytail', 'side', 'tuft'][i % 6], KC[i % 6], rr, tt); return [b + bigEars(rr, tt, { k, col: SK[i % 6], inner: shade(SK[i % 6], -.15) }), f]; } }), t));

// ---------- accessoires ----------
function camFront(x, y, s, t, fl = 0) { return G(tr(x, y, s), line(0, 60, -150, 560, 14) + line(0, 60, 150, 560, 14) + line(0, 60, 0, 580, 14) + rect(-190, -150, 380, 230, '#3a3f4a', 34) + rect(-150, -200, 120, 60, '#2b2b33', 12) + circ(0, -30, 110, '#2b2b33') + circ(0, -30, 74, '#4a6a8a', 6) + circ(0, -30, 40, '#1a2a3a', 4) + ell(-22, -54, 18, 10, 'rgba(255,255,255,.7)', 0) + rect(80, -240, 90, 70, '#eee', 10) + (fl > 0 ? op(fl, glow(125, -205, 260, '#fff', .9)) : '') + circ(150, 30, 12, Math.sin(t * 8) > 0 ? '#ff3b30' : '#7a2a2a', 3)); }
function softbox(x, yb, s, t) { return G(tr(x, yb, s), line(0, 0, -70, 0, 10) + line(0, 0, 70, 0, 10) + line(0, 0, 0, -620, 10) + op(.25 + .05 * Math.sin(t * 5), glow(0, -700, 260, '#fff6c8', .8)) + path('M-130 -800L130 -800L90 -620L-90 -620Z', '#f4f4f4', 6) + rect(-130, -812, 260, 24, '#3a3f4a', 6, 5)); }
function thermo(x, y, s, lv, t) { return G(tr(x, y, s), rect(-40, -300, 80, 340, '#fff', 40) + rect(-14, -270, 28, 300, '#f0e6e6', 14, 0) + rect(-14, 30 - 300 * lv, 28, 300 * lv, '#ff3b30', 14, 0) + circ(0, 60, 56, '#ff3b30') + [0, 1, 2, 3, 4, 5].map(i => line(14, -240 + i * 50, 34, -240 + i * 50, 4)).join('') + op(.4 + .3 * Math.sin(t * 12), circ(0, 60, 80, '#ff8a3d', 0))); }
function leaf(x, y, s, a, c = '#7bbf5a') { return G(tr(x, y, s, a), path('M0 -30Q24 0 0 30Q-24 0 0 -30Z', c, 4) + line(0, -26, 0, 26, 3)); }
function windLeaves(t, n = 16, seed = 5) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const sp = 700 + r() * 600, x = ((r() * 1600 + t * sp) % 1700) - 300, y = r() * 1150 + Math.sin(t * 5 + i) * 60; s += leaf(x, y, .8 + r() * .6, t * 400 + i * 40, ['#7bbf5a', '#e0a040', '#d9534f', '#ffd23f'][i % 4]); } for (let i = 0; i < 9; i++) { const x = ((i * 233 + t * 1500) % 1500) - 200, y = 200 + i * 110; s += line(x, y, x + 160, y, 5, 'rgba(255,255,255,.75)'); } return s; }
function micro(r = 0) { return G(tr(0, 0, 1, r), rect(-8, -10, 16, 70, '#2b2b33', 6, 4) + circ(0, -24, 22, '#9aa3ad', 5)); }
function bulb(x, y, s, on, t) { return G(tr(x, y, s), (on ? glow(0, -10, 150, '#fff3a0', .8) + Array.from({ length: 8 }, (_, i) => { const a = i / 8 * 6.283 + t; return line(Math.cos(a) * 80, Math.sin(a) * 80 - 10, Math.cos(a) * 120, Math.sin(a) * 120 - 10, 8, '#ffd23f'); }).join('') : '') + circ(0, -10, 56, on ? '#fff3a0' : '#e8e8e8', 6) + rect(-26, 40, 52, 40, '#9aa3ad', 6, 5) + line(-26, 54, 26, 54, 4) + line(-26, 66, 26, 66, 4)); }
function waves(x, y, t, n = 3, ang = 0, col = '#fff', rr = 60) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * 1.6 + i / n) % 1, R_ = rr + k * 160; s += op(1 - k, path(`M${f1(Math.cos(R(ang - 35)) * R_)} ${f1(Math.sin(R(ang - 35)) * R_)}A${f1(R_)} ${f1(R_)} 0 0 1 ${f1(Math.cos(R(ang + 35)) * R_)} ${f1(Math.sin(R(ang + 35)) * R_)}`, 'none', 10, col)); } return G(tr(x, y), s); }
function note(x, y, s, c = '#ffd23f') { return G(tr(x, y, s), path('M0 0L0 -70L40 -86L40 -16', 'none', 7) + ell(-10, 2, 18, 13, c, 5) + ell(30, -14, 18, 13, c, 5)); }
function hand(x, y, s = 1, skin = SKIN) { return G(tr(x, y, s), circ(0, 0, 30, skin, 6) + circ(-18, -22, 12, skin, 5) + circ(2, -30, 12, skin, 5) + circ(22, -24, 12, skin, 5)); }
function tomato(x, y, s, a = 0) { return G(tr(x, y, s, a), circ(0, 0, 40, '#e2463a', 6) + path('M-16 -36L0 -24L16 -36L6 -40L0 -48L-6 -40Z', '#5fb85f', 4) + ell(-14, -12, 10, 6, 'rgba(255,255,255,.6)', 0)); }
function splat(x, y, k) { if (k <= 0) return ''; let d = ''; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283, rr = (i % 2 ? 50 : 90) * k; d += (i ? 'L' : 'M') + f1(x + Math.cos(a) * rr) + ' ' + f1(y + Math.sin(a) * rr * .8); } return path(d + 'Z', '#e2463a', 5); }
function eiffel(x, yb, s, t) { let g = path('M-160 0Q-70 -220 -34 -560L34 -560Q70 -220 160 0L100 0Q70 -120 0 -120Q-70 -120 -100 0Z', '#7a5a4a', 6) + rect(-80, -290, 160, 24, '#7a5a4a', 4, 5) + rect(-50, -440, 100, 18, '#7a5a4a', 4, 5) + path('M-16 -560L0 -690L16 -560Z', '#7a5a4a', 5);
  for (let i = 0; i < 6; i++) g += line(-120 + i * 18, -40 - i * 40, 120 - i * 18, -80 - i * 40, 3, '#5a3a2a') + line(120 - i * 18, -40 - i * 40, -120 + i * 18, -80 - i * 40, 3, '#5a3a2a');
  return G(tr(x, yb, s), g + circ(0, -700, 10, Math.sin(t * 6) > 0 ? '#ffe08a' : '#e2463a', 3)); }
function barberPole(x, y, s, t) { let st = ''; for (let i = -3; i < 6; i++) { const yy = ((i * 50 + t * 120) % 300) - 150; st += path(`M-30 ${f1(yy)}L30 ${f1(yy - 30)}L30 ${f1(yy - 8)}L-30 ${f1(yy + 22)}Z`, i % 2 ? '#e2463a' : '#4d8fe8', 0); } const id = _sxid('bp');
  return G(tr(x, y, s), circ(0, -170, 30, '#c8ced6', 5) + `<defs><clipPath id="${id}"><rect x="-30" y="-150" width="60" height="300" rx="10"/></clipPath></defs>` + rect(-30, -150, 60, 300, '#fff', 10, 0) + `<g clip-path="url(#${id})">${st}</g>` + rect(-30, -150, 60, 300, 'none', 10, 6) + circ(0, 170, 30, '#c8ced6', 5)); }
function stylePoster(x, y, w, hs, t, r = 0, label = '') { return dPoster(x, y, w, w * 1.15, '#fff8e8', r, G(tr(0, 10), head({ hr: w * .26, hair: hs[0], hairColor: hs[1], expr: 'cool', seed: 31 }, t)) + (label ? ftext(0, w * .5, label, { size: w * .13, fill: SX.ink, stroke: 'none' }) : ''), t); }

// ---------- décors riches ----------
// studio photo de classe (gymnase) : fond bleu, softbox, guirlande, bannière, gradins
function photoSet(t) { const yb = 1250; let s = dWall('dot', '#d8e6f4', '#c4d8ec', yb) + dBase(yb, '#fff');
  s += rect(-M, 120, W + 2 * M, 30, '#b8c8d8', 0, 0) + [0, 1, 2, 3, 4, 5, 6].map(i => rect(-40 + i * 170, 40, 120, 70, '#fff', 8, 4) + op(.2, path(`M${-40 + i * 170} 110L${80 + i * 170} 110L${120 + i * 170} 300L${-80 + i * 170} 300Z`, '#fff6c8', 0))).join('');
  s += wallClock(80, 260, 50, t) + dFrame(990, 260, 120, 100, 'mount', '#c38a52', 3) + dOutlet(1030, 1150) + extinguisher(30, 1100, .45);
  // grand fond de studio bleu avec plis
  s += path('M110 220L970 220L990 1250L90 1250Z', '#6fa8dc', 7) + [0, 1, 2, 3, 4].map(i => path(`M${220 + i * 160} 230Q${200 + i * 160 + wave(t, .4, 8, i)} 700 ${230 + i * 160} 1240`, 'none', 6, 'rgba(255,255,255,.18)')).join('') + glow(CX, 700, 520, '#cfe6ff', .4) + rect(80, 196, 920, 32, '#8a6a4a', 10, 5);
  // bannière + fanions
  let fl = ''; for (let i = 0; i < 11; i++) { const x = 120 + i * 84, y = 240 + Math.sin(i / 10 * Math.PI) * 40; fl += G(tr(x, y, 1, wave(t, 1, 5, i)), path('M-26 0L26 0L0 50Z', DPAL[i % 8], 4)); } s += path('M110 236Q540 316 970 236', 'none', 4) + fl;
s += G(tr(CX, 330, 1, wave(t, .7, 1)), rect(-260, -44, 520, 88, '#ff6b35', 20, 6) + ftext(0, 16, 'PHOTO 2016', { size: 46, fill: '#fff', stroke: 'none' }));
  s += softbox(-30, yb + 10, .9, t) + softbox(1110, yb + 10, .9, t) + dPot(1010, yb, .8, t, 1) + dBin(70, yb, .55, '#36a85a');
  // gradins (3 niveaux)
  s += rect(150, 1010, 780, 40, '#c9935c', 6, 5) + rect(120, 1150, 840, 40, '#b5835a', 6, 5) + line(170, 1050, 170, 1250, 8) + line(910, 1050, 910, 1250, 8);
  return s + dParquet(yb, '#d9a86c') + G(tr(CX, 1330), rect(-60, -10, 120, 20, '#e2463a', 4, 0) + rect(-10, -60, 20, 120, '#e2463a', 4, 0)) + dBag(140, 1340, .7, '#ff8fb1', -10) + dBall(960, 1350, .7, t, '#5b8fd8'); }
// rangée d'enfants figurants (rangs du gradin)
function kidRow(t, y, s, xs, skip = -1, seed = 0) { return xs.map((x, i) => i === skip ? '' : kid(i + seed, { x, y, s, expr: ['happy', 'joy', 'smug', 'happy', 'laugh', 'neutral'][(i + seed) % 6] }, t)).join(''); }
// salon de coiffure
function salonT(t) { const yb = 1250; let s = dWall('stripe', '#e6f5f0', '#d6ede6', yb) + rect(-M, 980, W + 2 * M, yb - 980, '#4d8fe8', 0, 0) + line(-M, 980, W + M, 980, 6, '#3a6fc0') + dBase(yb, '#fff');
  s += rect(-M, 170, W + 2 * M, 16, '#ff6b35', 0, 0) + G(tr(CX, 120, 1, wave(t, .6, 1)), rect(-200, -46, 400, 92, '#2b2b33', 46, 6) + ftext(0, 18, 'COIFF\'TOUT', { size: 48, fill: '#ffd23f', stroke: 'none' }));
  s += mirror(300, 300, 480, 640) + dShelf(290, 990, 500, dJar(340, 990, '#5ec4f0') + dJar(400, 990, '#ff8fb1', .9) + rect(450, 920, 40, 70, '#7be07b', 12, 4) + rect(500, 940, 90, 20, '#2b2b33', 8, 3) + G(tr(640, 975, .35, -30), scissors(0, 0, 1, 0, .3)) + dMug(720, 990, .8, t));
  s += stylePoster(150, 420, 180, ['spiky', '#c4521b'], t, -4, 'LE PIC') + stylePoster(150, 720, 180, ['side', '#1f1a18'], t, 3, 'LA RAIE') + stylePoster(930, 420, 180, ['tuft', '#e0a040'], t, 4, 'LA HOUPPE') + stylePoster(930, 720, 180, ['curly', '#2b2420'], t, -3, 'LE AFRO');
  s += barberPole(1040, 1050, .6, t) + wallClock(1000, 230, 44, t) + dOutlet(60, 1150) + dPot(70, yb, .9, t, 0);
  // fauteuil + sèche-cheveux sur pied + balai
  s += G(tr(880, yb), rect(-90, -260, 180, 160, '#e2463a', 30, 6) + rect(-110, -120, 220, 50, '#e2463a', 20, 6) + line(0, -70, 0, 0, 14) + ell(0, 0, 80, 14, '#9aa3ad', 5)) + G(tr(1060, yb), line(0, 0, 0, -380, 8) + path('M-60 -380Q0 -470 60 -380Z', '#c8ced6', 6)) + G(tr(200, yb, 1, -8), line(0, 0, 0, -330, 8, '#b5835a') + path('M-50 0L50 0L36 -60L-36 -60Z', '#ffd23f', 5));
  s += dTileFloor(yb, '#f4efe6', '#c9d6e0'); const r = rng(9); for (let i = 0; i < 14; i++) s += path(`M${f1(100 + r() * 880)} ${f1(1290 + r() * 300)}q20 -16 0 -40`, 'none', 5, ['#5a3a26', '#c4521b', '#1f1a18'][i % 3]);
  return s; }
// rue en canicule
function hotStreet(t) { let s = streetT(t, 2) + op(.22, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff9a3c', 0, 0)) + sun(880, 300, .9, t, 'evil');
  for (let i = 0; i < 6; i++) s += op(.35, path(`M${-100 + i * 220} ${1240}q30 -40 0 -80q-30 -40 0 -80q30 -40 0 -80`.replace(/q30/g, `q${f1(30 + 10 * Math.sin(t * 6 + i))}`), 'none', 6, '#fff')); return s; }
function windStreet(t) { return streetT(t, 2) + op(.15, rect(-M, -M, W + 2 * M, H + 2 * M, '#8aa0b8', 0, 0)) + cloud(((t * 200) % 1700) - 300, 260, 1.4, '#e8eef4') + cloud(((t * 160 + 800) % 1700) - 300, 420, 1, '#dfe6ee') + windLeaves(t); }
// cabinet du médecin (ORL)
function doctorT(t) { const yb = 1250; let s = dWall('diamond', '#e3f3f7', '#cfe8ef', yb) + dBase(yb, '#fff') + rect(-M, 900, W + 2 * M, 14, '#9fd6e6', 0, 0);
  s += G(tr(150, 560), rect(-110, -210, 220, 420, '#fff', 10, 6) + [['E', 90, -130], ['F P', 56, -40], ['T O Z', 40, 30], ['L P E D', 28, 90], ['P E C F D', 20, 140], ['E D F C Z P', 14, 178]].map(([l, sz, y]) => ftext(0, y, l, { size: sz, fill: SX.ink, stroke: 'none' })).join(''));
  s += dPoster(920, 520, 220, 300, '#fff4e0', 3, G(tr(-10, -10, .9), bigEars(110, t, { kR: 1, kL: 0 }).replace(/^/, '') ) + ftext(0, 120, "L'OREILLE", { size: 26, fill: SX.ink, stroke: 'none' }), t);
  s += dFrame(450, 300, 150, 110, 'face', '#d9a441', -2) + dFrame(630, 300, 130, 110, 'heart', '#c38a52', 2) + wallClock(810, 290, 46, t) + dOutlet(60, 1150) + dSwitch(1040, 960);
  s += dShelf(330, 930, 300, dJar(370, 930, '#7be07b') + dJar(440, 930, '#ffd23f', .9) + dJar(510, 930, '#ff8fb1') + rect(560, 860, 50, 70, '#fff', 10, 4) + rect(572, 880, 26, 26, '#e2463a', 0, 0));
  // bureau + écran avec ECG + lampe + tasse
  const ecg = Array.from({ length: 30 }, (_, i) => { const x = -110 + i * 7.6, ph = (i / 30 + t * .8) % 1; return (i ? 'L' : 'M') + f1(x) + ' ' + f1(ph > .45 && ph < .5 ? -40 : ph > .5 && ph < .55 ? 30 : 0); }).join('');
  s += G(tr(880, yb), rect(-200, -300, 400, 30, '#b5835a', 6, 5) + line(-170, -270, -170, 0, 10) + line(170, -270, 170, 0, 10) + rect(-140, -560, 260, 200, '#2b2b33', 14, 5) + rect(-126, -546, 232, 172, '#0f2a1a', 6, 0) + G(tr(-10, -460), path(ecg, 'none', 5, '#5bff8a')) + rect(-30, -360, 40, 60, '#3a3f4a', 4, 4)) + dDeskLamp(1010, yb - 300, .8, t) + dMug(760, yb - 300, .8, t, '#5ec4f0');
  // table d'examen + rouleau de papier
  s += G(tr(180, yb), rect(-170, -260, 340, 60, '#5ec4f0', 20, 6) + rect(-170, -262, 340, 20, '#fff', 8, 4) + line(-130, -200, -130, 0, 12) + line(130, -200, 130, 0, 12) + circ(-180, -260, 26, '#fff', 5));
  return s + dTileFloor(yb, '#eef4f6', '#d6e4ea') + dBin(1020, 1330, .6, '#e2463a') + dPot(560, 1300, .9, t, 1, '#5b8fd8'); }
// parc vivant
function parkT(t) { const yb = 1160; let s = SKY(t, '#9fe0ff', '#fff4dc') + op(.6, dSkyline(1000, '#c8dbe8', 12)) + ell(150, 1170, 500, 160, '#a8dc8a', 0) + ell(900, 1170, 560, 190, '#9ccf7e', 0) + dHaze(.1);
  s += rect(-M, yb, W + 2 * M, 1000, '#8fd16a', 0, 0) + path(`M${CX - 90} ${yb}L${CX + 90} ${yb}L${CX + 380} ${H + M}L${CX - 380} ${H + M}Z`, '#e8d6a8', 5);
  s += tree(110, 1180, 1, t) + tree(990, 1170, 1.1, t) + dPine(780, 1160, .7, t) + dPine(280, 1160, .6, t) + dBush(420, 1170, .7) + dBench(650, 1185, .65) + dLampPost(880, 1190, .75) + dFlowers(60, 1240, 6, 2, t) + dFlowers(830, 1250, 6, 6, t) + dFence(-M, 220, 1180, '#fff');
  // cerf-volant + papillons + canard
  const kx = 760 + wave(t, .3, 40), ky = 330 + wave(t, .5, 30); s += path(`M${f1(kx)} ${f1(ky + 60)}Q${f1(kx - 120)} ${f1(ky + 400)} 600 1180`, 'none', 3) + G(tr(kx, ky, 1, wave(t, .6, 10)), path('M0 -70L50 0L0 70L-50 0Z', '#ff5c8a', 5) + line(0, -70, 0, 70, 3) + line(-50, 0, 50, 0, 3));
  for (let i = 0; i < 3; i++) { const bx = 200 + i * 300 + wave(t, .4, 60, i), by = 1000 + wave(t, .7, 40, i + 2), fl = Math.abs(Math.sin(t * 14 + i)); s += G(tr(bx, by), ell(-14, 0, 16 * fl + 3, 14, DPAL[i + 4], 3) + ell(14, 0, 16 * fl + 3, 14, DPAL[i + 4], 3)); }
  s += ell(220, 1400, 200, 50, '#7ec8f0', 5) + G(tr(200 + wave(t, .4, 30), 1395), ell(0, 0, 30, 18, '#fff', 4) + circ(22, -18, 14, '#fff', 4) + path('M34 -20L50 -16L34 -12Z', '#ff9a4d', 3));
  return s + kidsBg(t, 1230, 2, .4) + dBall(960, 1330, .6, t, '#ffd23f'); }
// terrasse de café au coucher de soleil
function cafeT(t) { const yb = 1250; let s = SKY(t, '#ffb38a', '#ffe8cc') + op(.75, dSkyline(1000, '#e6bcb0', 8)) + dHaze(.12, '255,230,210');
  s += dBuilding(-260, yb, 400, 820, '#f0b8a8', 21, t, { sign: 'LIVRES', awn: '#5b8fd8' }) + dBuilding(960, yb, 400, 760, '#bcd7c4', 22, t, { sign: 'FLEURS', awn: '#ff8fb1' });
  s += rect(140, 300, 820, 950, '#8a4a36', 8, 6) + rect(160, 330, 780, 120, '#a85a42', 4, 0) + ftext(CX, 410, 'CAFÉ DU COIN', { size: 54, fill: '#ffe8b0', stroke: 'none' });
  s += rect(190, 620, 700, 440, '#ffe6b0', 8, 6) + op(.5, person({ age: 'adult', x: 330, y: 1100, s: .55, hair: 'bun', hairColor: '#8a5a3a', shirt: '#7aa6d8', seed: 70, expr: 'happy' }, t)) + op(.5, person({ age: 'adult', x: 720, y: 1100, s: .55, hair: 'short', hairColor: '#2b2420', shirt: '#e2463a', seed: 71, expr: 'talk' }, t)) + line(540, 620, 540, 1060, 8) + rect(190, 900, 700, 16, '#b5835a', 0, 4);
  for (let i = 0; i < 8; i++) s += path(`M${150 + i * 100} 470L${250 + i * 100} 470L${250 + i * 100} 560Q${200 + i * 100} 590 ${150 + i * 100} 560Z`, i % 2 ? '#fff' : '#e2463a', 5);
  let gd = 'M120 470'; for (let i = 0; i < 8; i++) gd += `Q${170 + i * 105} 520 ${225 + i * 105} 470`; s += path(gd, 'none', 4);
  for (let i = 0; i < 9; i++) s += circ(125 + i * 105, 492 + (i % 2) * 6, 12, Math.sin(t * 4 + i * 1.4) > -.2 ? '#fff3a0' : '#c9b06a', 4);
  s += G(tr(980, yb), rect(-70, -260, 140, 200, '#2b3a2f', 10, 6) + ftext(0, -210, 'MENU', { size: 30, fill: '#fff', stroke: 'none' }) + line(-44, -170, 40, -170, 4, '#fff') + line(-44, -140, 30, -140, 4, '#fff') + line(-40, -60, -70, 0, 8) + line(40, -60, 70, 0, 8));
  s += dPot(120, yb, .9, t, 2, '#c96a3a') + dPot(960, yb + 10, .6, t, 0) + dLampPost(60, yb, .9, 1) + dBike(860, yb + 5, .55, '#ffd23f') + dBirds(t, 2, 220, 3);
  s += rect(-M, yb, W + 2 * M, 1400, '#d9c9b0', 0, 0) + [0, 1, 2, 3].map(i => line(-M, yb + 30 + i * 60, W + M, yb + 30 + i * 60, 3, '#c4b49a')).join('') + line(-M, yb, W + M, yb, 7, '#a8987f');
  s += G(tr(CX, 1450), ell(0, -170, 150, 26, '#fff', 6) + line(0, -150, 0, 0, 12) + ell(0, 0, 70, 14, '#9aa3ad', 5) + dMug(-50, -176, .8, t, '#fff') + dMug(60, -176, .8, t, '#ff8fb1'));
  return s + op(.75, adult(3, { x: ((t * 60) % 1600) - 300, y: 1290, s: .5, expr: 'neutral', walk: 3 }, t)); }
// Paris (pour « les conversations à Paris »)
function parisT(t) { const yb = 1150; let s = SKY(t, '#ffc4a8', '#fff0dc') + op(.7, dSkyline(1080, '#e8c4c8', 14)) + eiffel(800, 1100, 1.05, t) + dHaze(.12, '255,236,220');
  s += rect(-M, 1080, W + 2 * M, 70, '#7ab8e0', 0, 0) + [0, 1, 2].map(i => path(`M${-100 + ((t * 40 + i * 300) % 1300)} ${1100 + i * 16}q30 -10 60 0`, 'none', 4, '#fff')).join('');
  s += path('M300 1080Q420 990 540 1080', 'none', 18, '#c9b08a') + rect(-M, yb, W + 2 * M, 1000, '#d9c9a8', 0, 0) + line(-M, yb, W + M, yb, 7, '#b8a888');
  s += dLampPost(120, 1250, .8, 1) + dLampPost(960, 1250, .8, 1) + dBench(560, 1260, .7) + tree(330, 1240, .7, t) + dBush(780, 1250, .6);
  for (let i = 0; i < 4; i++) { const px = 420 + i * 70, py = 1300 + (i % 2) * 20, hop = Math.abs(Math.sin(t * 6 + i)) * 10; s += G(tr(px, py - hop), ell(0, 0, 22, 16, '#9aa3ad', 4) + circ(16, -14, 10, '#9aa3ad', 4) + path('M24 -14L34 -12L24 -8Z', '#ff9a4d', 0)); }
  return s; }

// ---------- premier plan flou (3e couche) ----------
function fgO(kind, t) { let s = '';
  if (kind === 'photo') s = camFront(980, 1720, 1.1, t) + G(tr(-40, 1990, 2), rect(-60, -140, 120, 140, '#ff8fb1', 20, 6));
  if (kind === 'salon') s = G(tr(-40, 1990, 2.4), rect(-50, -160, 100, 160, '#5ec4f0', 20, 6) + rect(-20, -200, 40, 40, '#fff', 8, 4)) + G(tr(1100, 2000, 2.2), path('M-80 0L80 0L60 -160L-60 -160Z', '#ffd23f', 6));
  if (kind === 'street') s = dBush(-40, 1980, 2.2, '#4f9a4f') + G(tr(1110, 1960, 2), rect(-30, -260, 60, 260, '#3a4250', 10, 6) + circ(0, -270, 40, '#3a4250', 6));
  if (kind === 'doctor') s = dPot(-10, 2000, 2.4, t, 2, '#5b8fd8') + G(tr(1100, 2000, 2.2), rect(-80, -200, 160, 200, '#fff', 14, 6) + rect(-16, -150, 32, 90, '#e2463a', 0, 0) + rect(-45, -122, 90, 32, '#e2463a', 0, 0));
  if (kind === 'park') s = dBush(-30, 1990, 2.4, '#5aa65a') + dFlowers(940, 1960, 5, 4, t).replace(/^/, '');
  if (kind === 'cafe') s = G(tr(-60, 2040, 2.2), ell(0, -170, 150, 26, '#fff', 6) + line(0, -150, 0, 0, 12)) + dPot(1100, 2000, 2.4, t, 0, '#c96a3a');
  if (kind === 'hall') s = dBin(-10, 1990, 2.4, '#36a85a') + dBag(1080, 1990, 2.2, '#ff9a4d', 12);
  if (kind === 'stage') s = G(tr(-60, 2060, 1.8), circ(0, -150, 120, '#120a18', 0) + ell(0, 0, 170, 140, '#120a18', 0)) + G(tr(1140, 2060, 1.8), circ(0, -150, 120, '#120a18', 0) + ell(0, 0, 170, 140, '#120a18', 0));
  if (kind === 'yard') s = dBush(-20, 1990, 2.4, '#5aa65a') + dBag(1060, 1990, 2.4, '#5b8fd8', -14);
  return s ? blur(9, s) : ''; }

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE : grille encre, tête en cut-out avec ÉNORMES oreilles, titre cinétique, « débloqué » en étoiles sur DÉCOLLÉES
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const D = at(1, 'decollees'), k = eOutBack(seg(t, D - .1, D + .35));
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 960, 330, t, .45, SX.acc, 16) + unlock(CX, 960, t, D, { part: 'back', r: 480 }) +
      G(tr(CX, 960, 1 + .03 * Math.sin(t * 6)), cutout(toiHead(0, 0, 160, { expr: t > D ? 'embarrassed' : 'worried', e: { k: .7 + .45 * k, flap: t > D ? 10 * (1 - seg(t, D + .2, D + .9)) : 0 } }, t), 14)) +
      funBox(CX, 960, 780, 400, t, .8, { label: 'oreilles.png' }) + unlock(CX, 960, t, D, { part: 'front', r: 480 }) +
      kthin("POURQUOI C'EST HORRIBLE", CX, 330, t, .05, { size: 54 }) + kthin("D'AVOIR LES OREILLES", CX, 410, t, .3, { size: 56 }) + kword('DÉCOLLÉES ?', CX, 535, t, D - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [.8, 'tick', .5], [at(1, 'decollees') - .05, 'boom', .6], [at(1, 'decollees'), 'boing', .7], [at(1, 'decollees') + .1, 'sparkle', .6]] });
// B002 — « Tu entres en classe » : papier + ombre de feuillage, perso cut-out qui marche vers la porte CM1
B(2, { enter: 'none', trans: 'wipe', transD: .25, cam: zin(1.02, 1.07, .3),
  draw: (t, d, T) => { const x = lerp(220, 470, eOutCubic(clamp(t / d)));
    return paper(SX.paper) + gobo(T, .12) + blob(800, 900, 260, t, '#ffe1b8', 2) + cutout(G(tr(800, 1480), rect(-170, -640, 340, 640, '#c98a5e', 10, 7) + rect(-110, -580, 220, 160, '#cfe8ff', 8, 5) + circ(120, -300, 18, '#ffd23f', 5) + rect(-120, -360, 120, 60, '#fff', 6, 4) + ftext(-60, -318, 'CM1', { size: 34, fill: SX.ink, stroke: 'none' })), 10) +
      cutout(toi({ x, y: 1480, s: 1.2, expr: 'worried', walk: 4, e: {} }, t), 10) + funTag(800, 760, 'CLASSE', t, at(2, 'classe') - .1, { size: 48, bg: SX.cool }) + kthin('tu entres en classe…', CX, 380, t, 0, { size: 60, fill: SX.ink, font: 'Fredoka' }); },
  sfx: [[0, 'steps', .7], [at(2, 'entres'), 'squeak', .5], [at(2, 'classe') - .1, 'pop', .6]] });
// B003 — « tes oreilles sont DÉJÀ ARRIVÉES » : porte fermée… mais les oreilles dépassent déjà de chaque côté
B(3, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d) }),
  draw: (t, d, T) => { const O = at(3, 'oreilles'), A = at(3, 'arrivees'), k = eOutBack(seg(t, O - .1, O + .3));
    return gridBg('#2a2440') + halftoneFade('#fff', .05, 1) + (k > 0 ? G(tr(CX, 900), bigEars(210, t, { k: k * 1.05, flap: t > A ? 12 : 3, fs: 18 })) : '') +
      cutout(G(tr(CX, 1250), rect(-150, -620, 300, 620, '#c98a5e', 10, 7) + rect(-100, -560, 200, 140, '#cfe8ff', 8, 5) + circ(105, -300, 16, '#ffd23f', 5) + rect(-90, -380, 180, 50, '#fff', 6, 4) + ftext(0, -344, 'CM1', { size: 32, fill: SX.ink, stroke: 'none' })), 10) +
      markerArrow(CX + 420, 640, CX + 330, 820, t, O + .2, { bend: -40, col: SX.acc2 }) + kthin('tes oreilles, elles,', CX, 360, t, O - .2, { size: 54 }) + kword('DÉJÀ ARRIVÉES', CX, 480, t, at(3, 'deja') - .05, { size: 86, fill: SX.acc2 }) +
      markerText('(toi : pas encore)', CX + 120, 1150, t, A + .15, { size: 40, col: '#fff' }); },
  sfx: [[at(3, 'oreilles') - .1, 'boing', .7], [at(3, 'deja') - .05, 'boom', .5], [at(3, 'arrivees'), 'flutter', .6], [at(3, 'arrivees') + .15, 'scratch', .4]] });
// B004 — 9 ans : chambre d'anniversaire (décor riche), bougies, confettis
B(4, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => kidRoomDay(t) + toi({ x: CX, y: 1500, s: 1.35, expr: 'joy', armL: [200, 230], armR: [-20, -50], e: {} }, t) + confetti(t, 0, 30) + burst(CX, 470, 150, t, at(4, '9') - .1, SX.acc2, 14) + kword('9 ANS', CX, 470, t, at(4, '9') - .05, { size: 96, fill: '#fff', puff: false }),
  sfx: [[0, 'whoosh', .6], [at(4, '9') - .05, 'tada', .6], [.2, 'pop', .4]] });
// B005 — jour de la photo de classe : gymnase, fond bleu, gradins, softbox, appareil flou au premier plan
B(5, { enter: 'drop', cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => photoSet(t) + kidRow(t, 1010, .78, [230, 380, 700, 850], -1, 0) + kidRow(t, 1150, .88, [200, 360, 720, 880], -1, 3) + toi({ x: CX, y: 1440, s: 1.15, expr: 'worried', e: {} }, t) + funTag(CX, 430, 'PHOTO DE CLASSE', t, at(5, 'photo') - .1, { size: 56, bg: SX.acc }),
  sfx: [[0, 'school_bell', .4], [at(5, 'photo') - .1, 'pop', .6], [at(5, 'classe'), 'shutter', .4]] });
// B006a — le photographe derrière son appareil : « tourne un peu la tête ! »
B(6, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: photoSet(t), haze: .25 }, { z: 1, svg: photog({ x: 760, y: 1560, s: 1.2, expr: 'talk', armL: [200, 160], armR: [-40, -70] }, t) + camFront(330, 1000, .85, t) }]) +
    chatBubble(560, 470, 640, 190, 'Tourne un peu\nla tête !', t, at(6, 'demande') - .1, false, 50),
  sfx: [[0, 'whoosh', .4], [at(6, 'photographe'), 'shutter', .4], [at(6, 'demande') - .1, 'pop', .6]] });
// B006b — tu tournes LÉGÈREMENT la tête… une oreille grandit dans le cadre
B(6, { enter: 'none', trans: 'push', transD: .2, cam: zin(1.04, 1.1),
  draw: (t, d, T) => { const o = at(6, 'tourner') - .15, k = eInOut(seg(t, at(6, 'legerement') - o, at(6, 'tete') - o + .2));
    return photoSet(t) + glow(CX, 900, 500, '#fff6c8', .35) + G(tr(CX, 900) + ` scale(${f1(1 - .12 * k)} 1)`, toiHead(0, 0, 220, { expr: 'worried', look: [lerp(0, 1, k), 0], e: { kL: 1 - .35 * k, kR: 1 + .45 * k } }, t)) +
      markerArrow(CX - 200, 560, CX + 220, 560, t, at(6, 'tourner') - o, { bend: 60, col: SX.acc }) + funTag(CX + 300, 460, '15°', t, at(6, 'legerement') - o, { size: 56, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [.1, 'squeak', .5], [.6, 'tick', .5]] }, at(6, 'tourner') - .15);
// B007 — MAUVAISE IDÉE : l'oreille devient une voile géante, crash + flash
B(7, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.08, shake: 8 * (1 - clamp(t / .4)), r: -4 }),
  draw: (t, d, T) => photoSet(t) + rays(t, CX, 900, 'rgba(255,107,53,.25)', 'rgba(255,255,255,0)', 18) + G(tr(CX - 160, 920) + ' scale(.86 1)', toiHead(0, 0, 220, { expr: 'jawdrop', look: [1, 0], e: { kL: .6, kR: 2.3, flap: 6, fs: 20 } }, t)) + stamp(CX, 440, 'MAUVAISE IDÉE', t, at(7, 'mauvaise') - .05),
  sfx: [[0, 'flash_hit', .7], [.05, 'boing', .8], [at(7, 'idee'), 'error_beep', .5]] });
// B008a — Kevin, au 3e rang, fait l'avion (et regarde tes oreilles-ailes)
B(8, { enter: 'drop', cam: zin(1.0, 1.08, .4),
  draw: (t, d, T) => { const I = at(8, 'imiter'), A = at(8, 'avion'), fly = seg(t, I, d), kx = 550, [hx, hy] = headOf(kx, 1010, .85);
    return photoSet(t) + kidRow(t, 1010, .78, [210, 370, 730, 880], -1, 1) + kevin({ x: kx, y: 1010, s: .85, expr: t > I ? 'mock' : 'smug', armL: t > I ? [180, 180] : [110, 100], armR: t > I ? [0, 0] : [70, 80], rot: t > I ? 10 * Math.sin(t * 5) : 0 }, t) +
      kidRow(t, 1150, .88, [200, 360, 720, 880], -1, 4) + toi({ x: CX, y: 1440, s: 1.15, expr: 'sad', e: { k: 1.1 } }, t) +
      funTag(kx, hy - 170, 'KEVIN', t, at(8, 'kevin'), { size: 44, bg: '#5fb85f' }) + funTag(220, 560, '3e RANG', t, at(8, '3e') - .05, { size: 44, bg: SX.cool, r: 4 }) + markerArrow(260, 610, kx - 110, hy - 20, t, at(8, 'rang'), { bend: -60, col: SX.acc2 }) +
      (t > A ? markerText('VROUUUM', kx - 40, hy - 260 + 0, t, A, { size: 56, col: SX.acc2 }) + plane(lerp(-200, 1300, fly), 470 + Math.sin(t * 4) * 30, .45, -5) : ''); },
  sfx: [[at(8, 'kevin'), 'pop', .6], [at(8, '3e') - .05, 'pop_hi', .5], [at(8, 'rang'), 'scratch', .4], [at(8, 'imiter'), 'whoosh', .6], [at(8, 'avion'), 'whoosh_up', .7]] });
// B008b — « Magnifique. » : la photo imprimée (carte 2.5D) — tes oreilles en ailes, Kevin en avion
B(8, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const inner = rect(-400, -300, 800, 600, '#6fa8dc', 10, 0) + rect(-400, 120, 800, 180, '#c9935c', 0, 0) +
      [-260, -100, 100, 260].map((x, i) => G(tr(x, -40, .42), kid(i, { x: 0, y: 200, s: 1, expr: 'happy' }, t))).join('') + G(tr(300, -90, .42), kevin({ x: 0, y: 200, s: 1, expr: 'mock', armL: [180, 180], armR: [0, 0] }, t)) +
      G(tr(0, 150, .62), toi({ x: 0, y: 200, s: 1, expr: 'sad', e: { k: 1.5 } }, t));
    return paper('#ffe9c9') + gobo(T, .1) + card(CX, 860, 860, 660, inner, t, 0, { ry: lerp(16, 0, seg(t, 0, .4)), bg: '#fff' }) + stamp(CX, 400, 'MAGNIFIQUE', t, at(8, 'magnifique') - (at(8, 'magnifique') - .15) + .02, '#36a85a', -8) + popStars(CX, 860, t, .1, 8, 380); },
  sfx: [[0, 'shutter', .9], [.05, 'printer', .3], [.1, 'thud', .6], [.25, 'rimshot', .5]] }, at(8, 'magnifique') - .15);
// B009 — à partir de ce jour : catalogue du coiffeur, les coupes qui te plaisent sont barrées une à une
B(9, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const ts = [at(9, 'choisis'), at(9, 'coiffure'), at(9, 'plait')]; let s = salonT(t) + toi({ x: 300, y: 1500, s: 1.3, expr: t > ts[2] ? 'sob' : 'sad', look: [1, -.3], e: {} }, t);
    [[700, 560, ['spiky', '#5a3a26'], -4], [880, 820, ['tuft', '#5a3a26'], 4], [690, 1060, ['side', '#5a3a26'], -2]].forEach(([x, y, hs, r], i) => { s += card(x, y, 230, 240, G(tr(0, 0), head({ hr: 62, hair: hs[0], hairColor: hs[1], expr: 'cool', seed: 2 }, t)) + heart(70, -80, .5), t, .1 + i * .15, { ry: 0, thick: 8, r, bw: 6 }) + cross(x, y, .9, t, ts[i]); });
    return s + kthin('à partir de ce jour…', CX, 340, t, 0, { size: 52 }) + funTag(CX, 440, 'COUPES QUI TE PLAISENT', t, .3, { size: 40, bg: SX.cool }); },
  sfx: [[.1, 'pop', .5], [.25, 'pop', .5], [.4, 'pop', .5], [at(9, 'choisis'), 'error_beep', .5], [at(9, 'coiffure'), 'error_beep', .5], [at(9, 'plait'), 'error_beep', .6]] });
// B010 — la coiffure « RIDEAU » qui cache les oreilles (le coiffeur pose le casque de cheveux)
B(10, { enter: 'punch', cam: zin(1.04, 1.1, .3),
  draw: (t, d, T) => { const C = at(10, 'coiffure'), k = eOutBack(seg(t, C, at(10, 'cache') + .2));
    return salonT(t) + toiHead(CX, 860, 220, { expr: k > .9 ? 'smugger' : 'worried', e: { cover: clamp(k, 0, 1.1) } }, t) + hairFall(t, CX, 600, 600, 10, 4, HAIRC) +
      G(tr(CX + 330 + Math.sin(t * 30) * 8, 620, .9, -30), scissors(0, 0, 1, 0, .5 + .5 * Math.sin(t * 30))) + funTag(CX, 430, 'MODÈLE « RIDEAU »', t, at(10, 'cache') - .05, { size: 50, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 860, t, at(10, 'oreilles'), 8, 330); },
  sfx: [[0, 'snip', .6], [at(10, 'coiffure'), 'snip', .8], [at(10, 'coiffure') + .2, 'snip', .7], [at(10, 'cache') - .05, 'boing', .7], [at(10, 'oreilles'), 'sparkle', .6]] });
// B011 — 30 degrés, cheveux longs : canicule, soleil méchant, thermomètre, sueur en fontaine
B(11, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d), hand: .4 }),
  draw: (t, d, T) => { const T3 = at(11, '30'), lv = eOutCubic(seg(t, T3 - .2, T3 + .6)) * .85;
    return hotStreet(t) + kid(2, { x: 840, y: 1500, s: 1.05, expr: 'chill', face: { eyes: 'shades' } }, t) + G(tr(840, 1500), G(tr(0, -230, 1), rect(-60, -10, 120, 30, '#fff', 8, 4))) +
      toi({ x: 360, y: 1500, s: 1.35, expr: t > at(11, 'gardes') ? 'effort' : 'worried', e: { cover: 1 } }, t) + sweatSpray(360, 1050, t, 8) + thermo(620, 760, .8, lv, t) +
      funTag(620, 420, `${counter(0, 30, t, T3 - .2, .6)}°C`, t, T3 - .2, { size: 80, bg: '#ff3b30' }) + markerText('(cheveux longs)', 360, 860, t, at(11, 'longs') - .1, { size: 42, col: SX.acc2, r: -8 }); },
  sfx: [[0, 'sizzle', .5], [at(11, '30') - .2, 'fire', .5], [at(11, '30'), 'ding', .5], [at(11, 'gardes'), 'gulp', .5], [at(11, 'longs'), 'scratch', .4]] });
// B012 — le vent : les cheveux s'envolent, les oreilles font VOILE, tu fonces à l'intérieur (porte qui claque)
B(12, { enter: 'whip', cam: (t, d) => ({ z: 1.05, shake: 3, r: -3 }),
  draw: (t, d, T) => { const V = at(12, 'vent'), Rn = at(12, 'rentres'), I = at(12, 'interieur'), w = seg(t, V - .2, V + .3), run = eInOut(seg(t, Rn, I)), x = lerp(320, 830, run), slam = seg(t, I, I + .15);
    const door = G(tr(860, 1500), rect(-170, -660, 340, 660, '#5a3a26', 8, 7) + rect(-150, -640, 300, 640, '#ffe6b0', 0, 0)) + (slam < 1 ? '' : '');
    const leaf_ = G(tr(860 - 150, 1500), G(`scale(${f1(lerp(.25, 1, slam))} 1)`, rect(0, -640, 300, 640, '#c98a5e', 6, 7) + circ(260, -320, 16, '#ffd23f', 5) + rect(60, -580, 180, 140, '#cfe8ff', 8, 5)));
    return windStreet(t) + door + (slam < .5 ? toi({ x, y: 1500, s: 1.3, expr: 'panic', rot: -8 * w, e: { cover: 1, wind: w, flap: 20 * w, fs: 22 } }, t) + motionLines(x - 220, 1100, 3, 80, 0) : '') + leaf_ +
      funTag(CX, 430, 'ALERTE VENT', t, V - .1, { size: 64, bg: SX.acc }) + (slam > 0 ? burst(860, 900, 160, t, I, '#fff', 12) : ''); },
  sfx: [[0, 'wind', .8], [at(12, 'vent') - .1, 'siren', .3], [at(12, 'vent'), 'flutter', .7], [at(12, 'rentres'), 'whoosh', .7], [at(12, 'interieur'), 'thud', .9]] });
// B013a — « Et le plus absurde » : concept, mot ABSURDE qui tremble, tête cut-out qui hausse les sourcils
B(13, { enter: 'none', trans: 'glitch', transD: .25, cam: () => ({ z: 1.04, hand: .3 }),
  draw: (t, d, T) => gridBg(SX.acc) + halftoneFade(SX.ink, .1, 1) + squiggle(CX, 640, 600, t, SX.acc2, { t0: .1 }) + G(tr(CX, 960), cutout(toiHead(0, 0, 180, { expr: 'confused', e: {} }, t), 12)) +
    kthin('et le plus', CX, 360, t, 0, { size: 56 }) + kword('ABSURDE', CX + Math.sin(t * 40) * 4 * seg(t, at(13, 'absurde'), at(13, 'absurde') + .2), 490, t, at(13, 'absurde') - .05, { size: 120, fill: SX.acc2 }),
  sfx: [[0, 'zap', .4], [at(13, 'absurde') - .05, 'boom', .6], [at(13, 'absurde') + .1, 'boing', .5]] });
// B013b — chez l'ORL : audition 100 %, tout fonctionne PARFAITEMENT
B(13, { enter: 'drop', cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const o = at(13, 'c') - .1, P = at(13, 'parfaitement') - o, k = eOutCubic(seg(t, at(13, 'fonctionnent') - o, P + .3));
    return doctorT(t) + toi({ x: 330, y: 1500, s: 1.3, expr: t > P ? 'proud' : 'neutral', e: { glow: t > P ? '#fff3a0' : 0 } }, t) + docO({ x: 800, y: 1560, s: 1.15, expr: 'wow', flip: 1, armL: [200, 190], holdL: G(tr(0, 0, 1, 0), rect(-8, -50, 16, 60, '#3a3f4a', 6, 4) + circ(0, -56, 14, '#9aa3ad', 4)) }, t) +
      bar(CX, 470, 700, k, { col: '#36a85a', label: 'AUDITION' }) + funTag(CX + 280, 560, `${counter(0, 100, t, at(13, 'fonctionnent') - o, P - (at(13, 'fonctionnent') - o) + .3)} %`, t, at(13, 'fonctionnent') - o, { size: 54, bg: '#36a85a' }) + (t > P ? popStars(330, 900, t, P, 8, 260) : ''); },
  sfx: [[0, 'ecg_beep', .5], [.6, 'ecg_beep', .4], [1.0, 'tick', .4], [1.4, 'ding', .7], [1.5, 'tada', .5]] }, at(13, 'c') - .1);
// B014 — elles captent les sons : parc, oiseaux / notes / abeille, ondes qui convergent vers les oreilles
B(14, { enter: 'whip', cam: zin(1.04, 1.1),
  draw: (t, d, T) => { const C = at(14, 'captent'); let s = parkT(t) + toiHead(CX, 900, 210, { expr: 'wow', e: { glow: t > C ? '#fff3a0' : 0, flap: 3 } }, t);
    for (let i = 0; i < 6; i++) { const k = ((t * .9 + i / 6) % 1), sd = i % 2 ? 1 : -1, sx = sd > 0 ? 1150 : -70, sy = 400 + (i % 3) * 260; s += note(lerp(sx, CX + sd * 330, k), lerp(sy, 880, k), .8, DPAL[i]); }
    return s + waves(CX - 360, 900, t, 3, 180, '#fff') + waves(CX + 360, 900, t, 3, 0, '#fff') + funTag(CX, 450, 'CAPTÉ !', t, C, { size: 64, bg: SX.cool }); },
  sfx: [[0, 'chirp', .6], [at(14, 'captent'), 'sparkle', .6], [at(14, 'sons'), 'ding', .5], [.4, 'buzz', .3]] });
// B015 — pas malades : le docteur tamponne « EN PARFAITE SANTÉ », pouce levé
B(15, { enter: 'punch', cam: () => ({ z: 1.05, shake: 2 }),
  draw: (t, d, T) => doctorT(t) + toi({ x: 330, y: 1500, s: 1.3, expr: 'happy', e: {} }, t) + docO({ x: 800, y: 1560, s: 1.15, expr: 'happy', flip: 1, armL: [250, 260] }, t) + G(tr(790, 900), hand(0, 0, 1.2)) +
    stamp(CX, 470, 'PAS MALADES', t, at(15, 'malades') - .1, '#36a85a', -8) + burst(330, 700, 70, t, at(15, 'malades'), '#7be07b', 10),
  sfx: [[0, 'hmm', .4], [at(15, 'malades') - .1, 'thud', .8], [at(15, 'malades'), 'ding', .6]] });
// B016a — plus VISIBLES : cour d'école, néon fléché, projecteur sur les oreilles
B(16, { enter: 'drop', cam: zin(1.0, 1.08, .4),
  draw: (t, d, T) => { const V = at(16, 'visibles'), [hx, hy, hr] = headOf(CX, 1500, 1.35);
    return schoolyard(t) + op(.35, path(`M${CX - 80} -100L${CX + 80} -100L${CX + 520} 1500L${CX - 520} 1500Z`, '#fff6c8', 0)) + toi({ x: CX, y: 1500, s: 1.35, expr: 'embarrassed', e: { k: 1.1 } }, t) +
      markerCircle(hx - hr * 1.35, hy, hr * .55, hr * .7, t, V - .1, { col: SX.acc }) + markerCircle(hx + hr * 1.35, hy, hr * .55, hr * .7, t, V, { col: SX.acc }) +
      dNeon(CX, 560, '→ VISIBLES ←', SX.acc2, t, 70) + kthin('simplement plus', CX, 420, t, at(16, 'simplement') - .1, { size: 52 }); },
  sfx: [[0, 'zap', .4], [at(16, 'simplement'), 'buzz', .4], [at(16, 'visibles') - .1, 'scratch', .5], [at(16, 'visibles'), 'scratch', .5]] });
// B016b — que celles de certains autres enfants : alignement de têtes, règle et étiquettes
B(16, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const o = at(16, 'que') - .15, C = at(16, 'certains') - o, ks = [.35, .45, 1.05, .3, .5], lab = ['2 cm', '3 cm', 'TOI', '2 cm', '3 cm']; let s = schoolyard(t);
    for (let i = 0; i < 5; i++) { const x = 140 + i * 200, y = 960 + Math.sin(t * 3 + i) * 6; s += i === 2 ? toiHead(x, y - 20, 86, { expr: 'worried', e: { k: ks[i] } }, t) : kidEarHead(i, x, y, 80, ks[i], { expr: ['happy', 'smug', '', 'joy', 'neutral'][i] }, t);
      s += G(tr(x, 1130), funTag(0, 0, lab[i], t, C + i * .1, { size: 30, bg: i === 2 ? SX.acc : SX.cool, r: 0 })); }
    return s + G(tr(CX, 760), rect(-500, -18, 1000, 36, SX.acc2, 10, 6) + Array.from({ length: 21 }, (_, i) => line(-480 + i * 48, -18, -480 + i * 48, i % 5 ? -2 : 8, 4)).join('')) + kword('AUTRES ENFANTS', CX, 470, t, at(16, 'enfants') - o - .25, { size: 62, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [.5, 'pop_hi', .5], [.7, 'pop_hi', .5], [.9, 'pop', .6], [1.3, 'boom', .4]] }, at(16, 'que') - .15);
// B017 — les gens transforment une différence en SPECTACLE : scène, projecteurs, public, écran « LE SHOW DES OREILLES »
B(17, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const S = at(17, 'spectacle'), scr = rect(150, 290, 780, 260, '#ff6b35', 8, 0) + ftext(CX, 400, 'LE SHOW', { size: 70, fill: '#fff' }) + ftext(CX, 500, 'DES OREILLES', { size: 60, fill: SX.acc2 });
    return stageT(t, scr) + toi({ x: CX, y: 1310, s: 1.1, expr: 'embarrassed', e: { k: 1.15, glow: '#fff6c8' } }, t) + (t > S ? confetti(t, S, 40) : '') + kthin('une différence en', CX, 640, t, at(17, 'difference') - .1, { size: 48 }) + kword('SPECTACLE', CX, 760, t, S - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'drum', .5], [at(17, 'adorent'), 'whistle', .4], [at(17, 'transformer'), 'magic', .5], [at(17, 'spectacle') - .05, 'tada', .8]] });
// B018 — Kevin : « Tu captes la radio ? » (antenne + fréquence sur ton oreille)
B(18, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const Rd = at(18, 'radio'), [hx, hy, hr] = headOf(330, 1500, 1.3);
    return hallway(t) + toi({ x: 330, y: 1500, s: 1.3, expr: 'deadpan', e: {} }, t) + (t > Rd - .1 ? G(tr(hx + hr * 1.7, hy - hr * .5, 1, 20), line(0, 0, 0, -200, 8) + circ(0, -206, 14, '#e2463a', 4)) + waves(hx + hr * 1.7, hy - hr * .5 - 200, t, 3, -90, SX.acc2, 30) : '') +
      kevin({ x: 800, y: 1500, s: 1.3, expr: 'mock', flip: 1, armL: [190, 195] }, t) + chatBubble(760, 470, 520, 130, 'Tu captes la radio ?', t, at(18, 'captes') - .1, false, 42) + funTag(hx + 40, 640, 'FM 98.2', t, Rd, { size: 44, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[at(18, 'captes') - .1, 'pop', .6], [at(18, 'radio') - .1, 'buzz', .5], [at(18, 'radio') + .1, 'zap', .4]] });
// B019 — « les conversations à Paris ? » : bulles qui volent depuis la tour Eiffel jusqu'à ton oreille
B(19, { enter: 'none', trans: 'wipe', transD: .25, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const E = at(19, 'entendre'), Pa = at(19, 'paris'), bubs = ['bla bla', 'croissant ?', 'oh là là', 'bonjour'];
    let s = parisT(t) + toiHead(300, 880, 170, { expr: 'shock', e: { k: 1.1, glow: '#fff3a0' } }, t);
    bubs.forEach((b, i) => { const k = ((t - E) * .7 + i * .25) % 1; if (t < E + i * .15) return; s += G(tr(lerp(820, 600, k), lerp(380, 860, k), .8 + .3 * (1 - k)), rect(-b.length * 13 - 20, -36, b.length * 26 + 40, 72, '#fff', 30, 5) + ftext(0, 12, b, { size: 32, fill: SX.ink, stroke: 'none' })); });
    return s + kevinHead(860, 1080, 110, { expr: 'mock' }, t) + funTag(800, 330 + 0, 'PARIS', t, Pa - .1, { size: 54, bg: SX.acc }) + markerPath('M600 860Q700 600 800 420', t, E, { col: 'rgba(255,255,255,.7)', w: 8 }); },
  sfx: [[at(19, 'entendre'), 'whoosh', .5], [at(19, 'conversations'), 'pop_hi', .5], [at(19, 'conversations') + .3, 'pop_hi', .5], [at(19, 'paris') - .1, 'pop', .6], [at(19, 'paris') + .2, 'rimshot', .5]] });
// B020 — la même blague pendant 6 ans : les années défilent, Kevin grandit, la bulle revient toujours
B(20, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d) }),
  draw: (t, d, T) => { const a = at(20, 'repete'), b = at(20, '6') + .15, yr = 1 + Math.min(5, Math.floor(6 * clamp((t - a) / (b - a)))), ks = 1.15 + (yr - 1) * .04;
    return hallway(t) + toi({ x: 270, y: 1500, s: 1.15 + (yr - 1) * .03, expr: yr > 3 ? 'deadpan' : 'annoyed', e: {} }, t) + kevin({ x: 790, y: 1500, s: ks, expr: 'mock', flip: 1, armL: [190, 195] }, t) +
      chatBubble(760, 560, 500, 120, 'Tu captes la radio ?', t, a + (yr - 1) * (b - a) / 6, false, 38) + calendar(250, 520, .7, `${yr}`, t, .05, -6).replace('ANS', 'ANS') + funTag(CX + 160, 380, `ANNÉE ${yr}`, t, .1, { size: 46, bg: SX.cool }) +
      (t > at(20, 'blague') ? markerText('même blague', 780, 700, t, at(20, 'blague'), { size: 42, col: SX.acc2 }) : ''); },
  sfx: [[at(20, 'kevin'), 'hmm', .4], [at(20, 'repete'), 'tick', .5], [at(20, 'blague'), 'rimshot', .5], [at(20, 'pendant'), 'clock_fast', .4], [at(20, '6'), 'ding', .6]] });
// B021 — « il pense toujours être humoriste » : Kevin adulte au micro, criquets, tomate
B(21, { enter: 'whip', cam: camHand(1.04, .4),
  draw: (t, d, T) => { const Hm = at(21, 'humoriste'), f = seg(t, Hm - .2, Hm + .25), hit = t > Hm + .25;
    return stageT(t, ftext(CX, 450, 'STAND-UP', { size: 90, fill: SX.ink, stroke: 'none' })) + kevinA({ x: CX, y: 1310, s: 1.05, expr: hit ? 'dizzy' : 'smugger', armR: [-80, -100], holdR: micro(), armL: [150, 220] }, t) +
      (!hit && f > 0 ? tomato(lerp(1100, CX + 20, f), lerp(1300, 860, f) - Math.sin(f * 3.14) * 200, .9, t * 600) : '') + splat(CX + 10, 880, hit ? 1 : 0) +
      funTag(CX, 620, 'HUMORISTE ?', t, Hm - .1, { size: 56, bg: SX.acc }) + text(260, 700, OL, 'cri cri', '#fff', 40); },
  sfx: [[0, 'crickets', .7], [at(21, 'toujours'), 'hmm', .3], [at(21, 'humoriste') - .1, 'pop', .5], [at(21, 'humoriste') + .25, 'thud', .8]] });
// B022 — puis un jour, tu rencontres quelqu'un : terrasse de café au coucher de soleil, cœurs
B(22, { enter: 'none', trans: 'zoom', transD: .3, cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const Q = at(22, 'rencontres'), k = eOutCubic(seg(t, Q - .3, Q + .5));
    return cafeT(t) + toiA({ x: 330, y: 1560, s: 1.12, expr: t > Q ? 'love' : 'neutral', e: { cover: 1 } }, t) + elle({ x: lerp(1250, 770, k), y: 1560, s: 1.1, expr: 'happy', walk: k < 1 ? 3 : 0, flip: 1 }, t) +
      funTag(CX, 450, 'UN JOUR…', t, at(22, 'jour') - .1, { size: 56, bg: SX.acc2, fg: SX.ink }) + (t > Q ? heartsUp(t, 330, 980, 5) : ''); },
  sfx: [[0, 'whoosh', .4], [at(22, 'jour') - .1, 'pop', .5], [at(22, 'rencontres'), 'steps', .5], [at(22, 'quelqu'), 'sparkle', .7]] });
// B023 — tu te recoiffes nerveusement (mains qui tapotent, sueur), tu caches ton profil
B(23, { enter: 'punch', cam: camHand(1.06, .9),
  draw: (t, d, T) => { const N = at(23, 'nerveusement'), Pf = at(23, 'profil'), turn = eInOut(seg(t, Pf - .3, Pf + .1)), pat = Math.sin(t * 22);
    return depth({ zoom: 1, x: 0 }, [{ z: 1.5, svg: cafeT(t), haze: .2 }, { z: 1, svg: elle({ x: 900, y: 1560, s: 1.1, expr: 'neutral', flip: 1 }, t) }]) +
      G(tr(380, 880) + ` scale(${f1(1 - .15 * turn)} 1)`, toiHead(0, 0, 210, { expr: 'embarrassed', look: [-turn, 0], e: { cover: 1 + .05 * pat } }, t)) + sweatSpray(380, 800, t, 6) +
      (t > N - .2 ? hand(380 - 330, 820 + pat * 30, 1.6) + hand(380 + 330, 820 - pat * 30, 1.6) : '') + funTag(380, 500, `RECOIFFAGE ×${counter(1, 99, t, N, Pf - N)}`, t, N - .1, { size: 42, bg: SX.acc }) + kword('DE PROFIL', 760, 1060, t, Pf - .05, { size: 64, fill: SX.acc2, puff: false }); },
  sfx: [[at(23, 'recoiffe'), 'squeak', .5], [at(23, 'nerveusement'), 'heartbeat', .7], [at(23, 'cacher'), 'squeak', .5], [at(23, 'profil') - .05, 'whoosh', .5], [at(23, 'profil') + .2, 'gulp', .5]] });
// B024a — cette personne te regarde (gros plan, regard curieux)
B(24, { enter: 'whip', cam: zin(1.04, 1.1),
  draw: (t, d, T) => cafeT(t) + elleHead(CX + 60, 880, 230, { expr: t > at(24, 'demande') ? 'confused' : 'neutral', look: [-.8, 0] }, t) + blur(10, G(tr(-30, 1100), toiHead(0, 0, 230, { expr: 'worried', e: { cover: 1 } }, t))) +
    kword('?', CX + 330, 560, t, at(24, 'demande') - .1, { size: 150, fill: SX.acc2 }),
  sfx: [[0, 'whoosh', .4], [at(24, 'regarde'), 'glint', .5], [at(24, 'demande') - .1, 'hmm', .5]] });
// B024b — « pourquoi tu passes ton temps à remettre tes cheveux ? » : compteur qui s'affole
B(24, { enter: 'none', trans: 'push', transD: .2, cam: () => ({ z: 1.04, hand: .4 }),
  draw: (t, d, T) => { const o = at(24, 'pourquoi') - .15, pat = Math.sin(t * 20);
    return cafeT(t) + toiA({ x: 330, y: 1560, s: 1.12, expr: 'embarrassed', armL: [-120 + pat * 15, -60], armR: [-60 - pat * 15, -120], e: { cover: 1 } }, t) + elle({ x: 780, y: 1560, s: 1.1, expr: 'confused', flip: 1, armL: [160, 230] }, t) +
      chatBubble(700, 470, 560, 180, 'Pourquoi tu touches\ntout le temps tes cheveux ?', t, .05, false, 36) + funTag(330, 640, `× ${counter(12, 4387, t, at(24, 'passes') - o, 1)}`, t, at(24, 'passes') - o - .1, { size: 50, bg: SX.acc }); },
  sfx: [[.05, 'pop', .6], [.3, 'squeak', .4], [.6, 'squeak', .4], [.9, 'clock_fast', .4], [1.3, 'squeak', .4]] }, at(24, 'pourquoi') - .15);
// B025 — « à cause de mes oreilles » : tu soulèves le rideau… TADAM (roulement, projecteur, oreilles qui jaillissent)
B(25, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.02, 1.12, eOutCubic(seg(t, at(25, 'oreilles') - .1, at(25, 'oreilles') + .3))), shake: t > at(25, 'oreilles') && t < at(25, 'oreilles') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const O = at(25, 'oreilles'), k = eOutBack(seg(t, O - .1, O + .3));
    return cafeT(t) + op(.45, rect(-M, -M, W + 2 * M, H + 2 * M, '#1a1020', 0, 0)) + op(.45, path(`M${CX - 70} -100L${CX + 70} -100L${CX + 480} 1400L${CX - 480} 1400Z`, '#fff6c8', 0)) +
      toiHead(CX, 880, 210, { expr: k > .5 ? 'embarrassed' : 'worried', e: { cover: 1 - clamp(k), k: .8 + .3 * k, flap: k > .5 ? 8 * (1 - seg(t, O + .3, O + 1)) : 0 } }, t) + burst(CX, 470, 170, t, O, SX.acc2, 14) + kword('TADAM', CX, 470, t, O - .02, { size: 84, fill: '#fff', puff: false }) +
      kthin('à cause de…', CX, 1150, t, at(25, 'cause') - .1, { size: 46 }); },
  sfx: [[at(25, 'reponds'), 'hmm', .3], [at(25, 'cause') - .2, 'drum', .7], [at(25, 'oreilles') - .05, 'boing', .9], [at(25, 'oreilles'), 'sting', .5]] });
// B026 — elle te fixe… « Tes quoi ? » (elle n'avait rien vu)
B(26, { enter: 'crash', cam: zin(1.06, 1.12),
  draw: (t, d, T) => { const Qq = at(26, 'quoi');
    return cafeT(t) + elleHead(CX, 900, 240, { expr: t > Qq - .2 ? 'confused' : 'deadpan', look: [0, 0] }, t) + (t > Qq ? ['?', '?', '?'].map((q, i) => G(tr(CX - 300 + i * 300, 680 - Math.abs(Math.sin(t * 6 + i)) * 20, 1, (i - 1) * 15), ftext(0, 0, q, { size: 90, fill: SX.acc2 }))).join('') : '') +
      kword('TES QUOI ?', CX, 470, t, Qq - .1, { size: 100, fill: '#fff' }); },
  sfx: [[0, 'crickets', .5], [at(26, 'fixe'), 'hmm', .4], [at(26, 'quoi') - .1, 'boing', .7]] });
// B027 — et là, tu comprends : ampoule, « débloqué » en étoiles (fond concept)
B(27, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const C = at(27, 'comprends');
    return gridBg(SX.ink) + halftoneFade('#fff', .05, 1) + unlock(CX, 900, t, C, { part: 'back', r: 500 }) + G(tr(CX, 940), cutout(toiHead(0, 0, 190, { expr: t > C ? 'wow' : 'shock', e: { k: 1 } }, t), 12)) + bulb(CX, 600, .9, t > C, t) +
      unlock(CX, 900, t, C, { part: 'front', r: 500 }) + kthin('et là…', CX, 360, t, 0, { size: 56 }) + kword('TU COMPRENDS', CX, 1180, t, C, { size: 80, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(27, 'comprends') - .05, 'magic', .7], [at(27, 'comprends'), 'sparkle', .7], [at(27, 'comprends') + .2, 'angel', .5]] });
// B028a — des années à cacher : éventail de souvenirs (photo, rideau, vent, Kevin)
B(28, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const mem = [{ cover: 0, k: 1.3 }, { cover: 1 }, { cover: 1, wind: 1 }, { cover: 1 }, { cover: 1 }], ex = ['sad', 'smugger', 'panic', 'effort', 'embarrassed'];
    return paper(SX.paper) + gobo(T, .12) + cardArc(CX, 1060, 5, 400, t, .05, i => toiHead(0, 14, 50, { expr: ex[i], e: mem[i] }, t), { w: 220, h: 200 }) +
      kthin('tu as passé des années à', CX, 360, t, 0, { size: 56, fill: SX.ink, font: 'Fredoka' }) + kword('CACHER', CX, 490, t, at(28, 'cacher') - .05, { size: 120, fill: SX.acc }); },
  sfx: [[.05, 'pop', .5], [.2, 'pop', .5], [.35, 'pop', .5], [.5, 'pop', .5], [at(28, 'cacher') - .05, 'boom', .6]] });
// B028b — FIN : « un détail que certaines personnes n'avaient même pas remarqué » — tu libères tes oreilles… et une rafale te fait décoller (Kevin passe en faisant l'avion)
B(28, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(28, 'remarque') - (at(28, 'detail') - .3) + .4 ? 3 : 0 }),
  draw: (t, d, T) => { const o = at(28, 'detail') - .3, Dt = at(28, 'detail') - o, Mm = at(28, 'meme') - o, Rq = at(28, 'remarque') - o, fly = eInOut(seg(t, Rq + .4, d)), free = eOutBack(seg(t, .1, .7));
    const kx = ((t - Rq) * 600) - 300;
    return cafeT(t) + (t > Rq ? kevinA({ x: kx, y: 1290, s: .55, expr: 'mock', armL: [180, 180], armR: [0, 0], walk: 3 }, t) : '') + elle({ x: 790, y: 1560, s: 1.1, expr: fly > .05 ? 'jawdrop' : 'laugh', flip: 1 }, t) +
      toiA({ x: 320, y: 1560 - fly * 380, s: 1.12, rot: fly * -8, expr: fly > 0 ? 'ecstatic' : 'proud', armL: fly > 0 ? [200, 180] : [110, 100], armR: fly > 0 ? [-20, 0] : [70, 80], e: { cover: 1 - clamp(free), k: 1.1, flap: fly > 0 ? 35 : 0, fs: 26 } }, t) + (fly > 0 ? motionLines(320, 1500 - fly * 380, 4, 80, 90) + windLeaves(t, 8, 3) : '') +
      funTag(320, 640, 'DÉTAIL', t, Dt, { size: 40, bg: SX.cool }) + kthin('que certaines personnes', CX, 330, t, at(28, 'certaines') - o - .1, { size: 48 }) +
      kword('MÊME PAS', CX, 445, t, Mm - .05, { size: 96, fill: '#fff' }) + kword('REMARQUÉ.', CX, 560, t, Rq - .05, { size: 104, fill: SX.acc2 }) + (t > Rq ? confetti(t, Rq, 30) : ''); },
  sfx: [[.1, 'boing', .6], [at(28, 'detail') - (at(28, 'detail') - .3), 'pop', .5], [at(28, 'certaines') - (at(28, 'detail') - .3), 'pop_hi', .4], [at(28, 'meme') - (at(28, 'detail') - .3) - .05, 'boom', .5], [at(28, 'remarque') - (at(28, 'detail') - .3) - .05, 'tada', .8], [at(28, 'remarque') - (at(28, 'detail') - .3) + .4, 'wind', .7], [at(28, 'remarque') - (at(28, 'detail') - .3) + .6, 'whoosh_up', .7]] }, at(28, 'detail') - .3);

SCENES.sort((a, b) => a.s - b.s);
// premier plan flou par plan (3e couche) : clé = n° de bloc (+ a/b pour les sous-plans)
const FGO = { 5: 'photo', '6a': 'photo', '8a': 'photo', 9: 'salon', 10: 'salon', 11: 'street', 12: 'street', '13b': 'doctor', 14: 'park', 15: 'doctor', '16a': 'yard', '16b': 'yard', 18: 'hall', 20: 'hall', 21: 'stage', 22: 'cafe', '24b': 'cafe' };
{ const cnt = {}; SCENES.forEach(sc => { cnt[sc.n] = (cnt[sc.n] || 0) + 1; });
  const seen = {}; SCENES.forEach(sc => { const i = seen[sc.n] = (seen[sc.n] || 0) + 1, key = cnt[sc.n] > 1 ? sc.n + 'ab'[i - 1] : sc.n, kind = FGO[key];
    if (kind) { const d0 = sc.draw; sc.draw = (t, d, T) => d0(t, d, T) + fgO(kind, t); } }); }
