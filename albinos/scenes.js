// ============================================================
//  « Pourquoi c'est horrible d'avoir un naître albinos ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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
//  SIZEX fun : intro motion, puis VRAIS DÉCORS riches (bibliothèque d'accessoires reprise de tache/, préfixe d…) + couche motion.
//  Accent orange « soleil ». Ton : drôle mais bienveillant, jamais moqueur envers le héros.
// ============================================================
sxFun('#ff7a2e'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';
const M = 700;
const KH = ['curly', 'bun', 'spiky', 'ponytail', 'short', 'long'], KC = ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040', '#1f1a18', '#6b3e26'], KS = ['#ff8fb1', '#7aa6d8', '#7be07b', '#ff9a4d', '#b56cff', '#5ec4f0'], SK = ['#f2c9a0', '#c98a5e', '#f6d7b8', '#8a5a3a', '#e0b088', '#f2c9a0'];
const kid = (i, o, t) => person(Object.assign({ age: 'kid', hair: KH[i % 6], hairColor: KC[i % 6], shirt: KS[i % 6], skin: SK[i % 6], pants: '#3b3f4a', seed: 20 + i }, o), t);
const kidHead = (i, x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: KH[i % 6], hairColor: KC[i % 6], skin: SK[i % 6], seed: 20 + i }, o), t));
const AH = ['side', 'bun', 'bald', 'long', 'short'], AC = ['#1f1a18', '#8a5a3a', '#7a6a5a', '#c4521b', '#d9d9de'], AS = ['#5b8fd8', '#e2463a', '#36a85a', '#ff9a4d', '#8a6ad8'];
const adult = (i, o, t) => person(Object.assign({ age: 'adult', hair: AH[i % 5], hairColor: AC[i % 5], shirt: AS[i % 5], skin: SK[(i + 2) % 6], pants: '#2f3b4e', seed: 60 + i, glasses: i % 3 === 0, mustache: i === 2 }, o), t);
const adultHead = (i, x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: AH[i % 5], hairColor: AC[i % 5], skin: SK[(i + 2) % 6], seed: 60 + i, glasses: i % 3 === 0, mustache: i === 2 }, o), t));

// ---------- décors vivants (passe « DÉCORS RICHES » : accessoires factorisés + 3 couches + éléments animés) ----------
// accessoires préfixés d… (pas de collision avec le moteur). Tous posés « pieds » en (x, y) sauf mention.
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

// ============================================================
//  HÉROS ALBINOS : cheveux blancs, peau très claire, yeux clairs (iris bleu pâle autour de la pupille).
//  Accessoires soleil : chapeau (hat), crème (cream), lunettes (face:{eyes:'shades'}). Ton bienveillant : le gag vise les autres, jamais le héros.
// ============================================================
const ALB_HAIR = '#f8f5ee', ALB_SKIN = '#fdeee4', ALB_IRIS = '#8fc6ea', HERO = '#7a6ad8';
function sunHat(r, c = '#f2d27a') { return ell(0, -r * .52, r * 1.45, r * .2, c, 6) + path(`M${-r * .82} ${-r * .55}Q${-r * .8} ${-r * 1.38} 0 ${-r * 1.32}Q${r * .8} ${-r * 1.38} ${r * .82} ${-r * .55}Z`, c, 6) + path(`M${-r * .82} ${-r * .6}Q0 ${-r * .74} ${r * .82} ${-r * .6}L${r * .8} ${-r * .78}Q0 ${-r * .9} ${-r * .8} ${-r * .78}Z`, '#ff7a2e', 5) + path(`M${-r * .5} ${-r * 1.1}Q${-r * .2} ${-r * 1.24} ${r * .2} ${-r * 1.2}`, 'none', 4, shade(c, -.2)); }
function albHF(r, t, o) {
  const [b, f] = hairSvg(o.hstyle || 'short', ALB_HAIR, r, t); let s = f;
  const ex = Object.assign({}, EXPR[o.expr || 'neutral'] || EXPR.neutral, o.face || {});
  const blink = ((t + (o.seed || 0) * 1.7) % 3.3) < .11;
  if (ex.eyes === 'dot' && !blink) { const [lx, ly] = (o.look || [0, 0]).map(v => v * r * .12); for (const sd of [-1, 1]) s += circ(sd * r * .34 + lx, r * .02 + ly, r * .16, ALB_IRIS, Math.max(3, r * .03)) + circ(sd * r * .34 + lx - r * .07, r * .02 + ly - r * .07, r * .035, '#fff', 0); }
  if (o.cream) { const cw = (x, y, a, b) => ell(x, y, a, b, '#fff', Math.max(3, r * .03), '#9fb6c8') + ell(x - a * .3, y - b * .3, a * .3, b * .25, '#e6f3fb', 0); s += op(Math.min(1, o.cream * 1.6), cw(-r * .55, r * .22, r * .24, r * .15) + cw(r * .55, r * .22, r * .24, r * .15) + cw(0, r * .18, r * .1, r * .12) + cw(-r * .15, -r * .52, r * .3, r * .1) + cw(r * .3, -r * .42, r * .13, r * .08)); }
  if (o.hat) s += sunHat(r, o.hat === 1 ? '#f2d27a' : o.hat);
  return [b, s];
}
const alb = (o, t) => person(Object.assign({ age: 'kid', hairFn: albHF, skin: ALB_SKIN, shirt: HERO, pants: '#3b4a6b', seed: 2 }, o), t);
const albHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: albHF, skin: ALB_SKIN, seed: 2 }, o), t));
const albBaby = (o, t) => person(Object.assign({ age: 'baby', hairFn: albHF, hstyle: 'babyRed', skin: ALB_SKIN, shirt: '#c9b8f2', seed: 2 }, o), t);
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
// écharpe (posée sur un person kid à (x,y,s))
const scarf = (x, y, s, c = '#e2463a') => G(tr(x, y - 214 * s, s), path('M-62 -6Q0 26 62 -6L62 20Q0 50 -62 20Z', c, 6) + path('M30 18L44 90L74 84L58 14Z', c, 6) + line(36, 70, 66, 66, 4, '#fff'));
// oreilles de lapin (serre-tête) à poser au-dessus d'une tête (x, y, r)
const bunnyEars = (x, y, r, t) => G(tr(x, y, r / 100), [-1, 1].map(sd => G(tr(sd * 42, -95, 1, sd * 12 + wave(t, 1.4, 6, sd)), ell(0, -70, 26, 78, '#fff', 6) + ell(0, -66, 12, 56, '#ffb3c8', 0))).join('') + path('M-80 -78Q0 -120 80 -78', 'none', 12, '#ff8fb1'));
// personnage « mélanine » : grain de pigment brun avec cape (super-héros)
function melano(x, y, s, t, o = {}) { const sq = 1 + .05 * Math.sin(t * 8); return G(tr(x, y, s, o.r || 0),
  (o.cape !== false ? path(`M-70 -40Q-150 ${60 + wave(t, 1.6, 20)} -120 150L120 150Q150 ${60 + wave(t, 1.6, 20, .5)} 70 -40Z`, '#e2463a', 6) : '') +
  G(`scale(${f1(sq)} ${f1(2 - sq)})`, blob(0, 0, 110, t, '#8a5a3a', 3, { sw: 7 })) + ell(-30, -40, 22, 12, 'rgba(255,255,255,.35)', 0) +
  G(tr(0, 10), head({ hr: 70, hair: 'none', skin: 'none', cheeks: true, expr: o.expr || 'proud', look: o.look || [0, 0], seed: 9 }, t).replace(/<circle cx="0" cy="0" r="70"[^>]*\/>/, '')) +
  (o.arm ? path('M80 0Q150 -40 190 -110', 'none', 22, OL) + path('M80 0Q150 -40 190 -110', 'none', 10, '#8a5a3a') + circ(192, -112, 20, '#8a5a3a', 5) : '') +
  (o.label !== false ? G(tr(0, 70), rect(-34, -22, 68, 44, '#ffd23f', 10, 5) + ftext(0, 14, 'M', { size: 34, fill: '#e2463a', stroke: 'none' })) : '')); }
// éclair « UV » (zigzag violet)
const uvBolt = (x1, y1, x2, y2, k, c = '#a259ff') => { if (k <= 0) return ''; const xe = lerp(x1, x2, k), ye = lerp(y1, y2, k), n = 6; let d = `M${f1(x1)} ${f1(y1)}`; for (let i = 1; i <= n; i++) { const u = i / n, px = lerp(x1, xe, u), py = lerp(y1, ye, u), off = (i % 2 ? 1 : -1) * (i < n ? 22 : 0); d += `L${f1(px + off)} ${f1(py - off)}`; } return path(d, 'none', 20, OL) + path(d, 'none', 10, c); };
function swatch(x, y, col, label, hex, t, t0, r = 0) { return card(x, y, 280, 250, rect(-110, -100, 220, 120, col, 16, 6) + ftext(0, 62, label, { size: 40, fill: SX.ink, stroke: 'none' }) + ftext(0, 104, hex, { size: 26, fill: '#7a6a5a', stroke: 'none' }), t, t0, { ry: 0, thick: 10, r }); }
function thoughtA(x, y, w, h, inner, k) { if (k <= 0) return ''; return G(tr(x, y, eOutBack(k)), ell(0, 0, w / 2, h / 2, '#fff', 7) + ell(-w * .32, h * .5, 32, 24, '#fff', 6) + ell(-w * .44, h * .68, 18, 13, '#fff', 5) + inner); }
const aBaguette = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-170, -26, 340, 52, '#e0a050', 26, 6) + [-110, -40, 30, 100].map(dx => path(`M${dx - 22} -8Q${dx} -26 ${dx + 22} -10`, 'none', 5, '#a0661f')).join(''));
const croissant = (x, y, s = 1) => G(tr(x, y, s), path('M-60 10Q-70 -40 0 -44Q70 -40 60 10Q30 -6 0 -4Q-30 -6 -60 10Z', '#e8a548', 5) + path('M-24 -40L-16 -6M0 -44L0 -4M24 -40L16 -6', 'none', 4, '#b8742a'));
const qBubble = (x, y, str, t, t0, c = '#fff', size = 40, r = 0) => { const k = popEl(t, t0, .4); if (k <= 0) return ''; const w = str.length * size * .6 + 60; return G(tr(x, y, k, r + Math.sin(t * 3 + x) * 2), rect(-w / 2, -size * 1.1, w, size * 2.2, c, size * .9, 6) + path(`M-20 ${size * 1.1 - 3}L-36 ${size * 1.1 + 34}L10 ${size * 1.1 - 3}Z`, c, 6) + rect(-w / 2 + 8, size * .6, w - 16, 14, c, 0, 0) + ftext(0, size * .36, str, { size, fill: SX.ink, stroke: 'none' })); };
const battery = (x, y, s, k, t) => { const c = k > .5 ? '#5fb85f' : k > .2 ? '#ffb03a' : '#e2463a'; return G(tr(x, y, s), rect(-130, -60, 260, 120, '#fff', 20, 8) + rect(130, -24, 24, 48, OL, 6, 0) + rect(-114, -44, 228 * clamp(k), 88, (k < .1 && Math.sin(t * 12) > 0) ? '#fff' : c, 10, 0) + ftext(0, 22, `${Math.round(k * 100)} %`, { size: 54, fill: SX.ink, stroke: 'none' })); };

// ---------- décors riches de l'épisode (préfixe a…) ----------
function aGarland(str, y, t, x0 = 60, step = 80) { let s = path(`M${x0 - 40} ${y - 10}Q${x0 + str.length * step / 2} ${y + 100} ${x0 + str.length * step} ${y - 10}`, 'none', 4);
  for (let i = 0; i < str.length; i++) { const x = x0 + i * step, yy = y + Math.sin(i / (str.length - 1) * Math.PI) * 48 + wave(t, 1, 3, i); s += G(tr(x, yy, 1, wave(t, 1, 5, i)), path('M-34 0L34 0L0 70Z', DPAL[i % 8], 4) + ftext(0, 34, str[i], { size: 26, fill: '#fff', stroke: 'none' })); } return s; }
function aMobile(x, y, t) { const cols = ['#ffd23f', '#ff8fb1', '#5ec4f0', '#7be07b']; let g = line(-160, 0, 160, 0, 6, '#c38a52');
  [-150, -50, 50, 150].forEach((dx, i) => { const L = 60 + (i % 2) * 40; g += line(dx, 0, dx, L, 3) + G(tr(dx, L + 26, 1, wave(t, 1.5, 12, i)), i % 2 ? circ(0, 0, 24, cols[i], 5) : path('M0 -30L9 -10L30 -9L13 5L19 27L0 15L-19 27L-13 5L-30 -9L-9 -10Z', cols[i], 5)); });
  return line(x, -200, x, y, 4) + G(tr(x, y, 1, Math.sin(t * 1.2) * 10), g); }
const aCrib = (x, yb, s = 1) => { let g = rect(-280, -360, 560, 30, '#fff', 12, 6) + rect(-280, -130, 560, 50, '#fff', 10, 6) + rect(-280, -360, 26, 360, '#fff', 8, 6) + rect(254, -360, 26, 360, '#fff', 8, 6); for (let i = 1; i < 10; i++) g += rect(-280 + i * 56 - 7, -330, 14, 200, '#fff', 6, 4); return G(tr(x, yb, s), path('M-250 -130Q-200 -190 -120 -150Q-40 -200 40 -150Q140 -190 250 -130Z', '#c9b8f2', 5) + g + ell(-120, -175, 60, 26, '#fff', 4)); };
const aBlocks = (x, yb, s = 1) => G(tr(x, yb, s), [['A', '#e2463a', -60, 0], ['B', '#5b8fd8', 10, 0], ['C', '#ffd23f', -25, -66]].map(([l, c, dx, dy]) => rect(dx - 32, dy - 64, 64, 64, c, 8, 5) + ftext(dx, dy - 18, l, { size: 36, fill: '#fff', stroke: 'none' })).join(''));
function nurseryA(t, o = {}) { const yb = 1250; let s = dWall('dot', '#e4eeff', '#cfdcf7', yb) + dBase(yb, '#fff');
  s += dWindowView(620, 250, 360, 400, t) + (o.sun ? '' : '') + dCurtain(560, 230, 110, 460, '#ffd23f', t, 1) + dCurtain(930, 230, 110, 460, '#ffd23f', t, -1);
  s += op(o.sun ? .3 : .14, path('M620 650L980 650L760 1250L120 1250Z', '#fff6c8', 0));
  s += dFrame(130, 330, 150, 120, 'heart', '#ff9a4d', -3) + dFrame(330, 320, 120, 150, 'sea', '#8a6ad8', 4) + wallClock(500, 190, 46, t) + dShelf(40, 590, 400, dBooks(60, 590, 130, 3) + dTeddy(260, 590, .7, '#ff9a4d') + dJar(340, 590, '#7be07b', .8) + dJar(400, 590, '#ff8fb1', .7));
  s += aCrib(300, yb, .85) + aMobile(300, 860, t) + dLamp(1010, yb, .85, 1, t, '#ff8fb1') + dOutlet(540, 1180) + dSwitch(1040, 860);
  return s + dParquet(yb, '#d8b083') + dRug(560, 1460, 780, 150, '#b5d8ff', '#ffd23f') + dBall(900, 1330, .6, t, '#ff5c8a') + aBlocks(160, 1360, .8) + dBox(1000, 1500, .6, 'JOUETS') + dTeddy(80, 1560, .7, '#c9935c'); }
function aSofa(x, yb, s = 1, c = '#5ec4f0') { return G(tr(x, yb, s), rect(-320, -330, 640, 200, c, 40, 6) + rect(-300, -160, 600, 110, shade(c, -.1), 24, 6) + rect(-360, -250, 90, 220, shade(c, -.2), 30, 6) + rect(270, -250, 90, 220, shade(c, -.2), 30, 6) + rect(-240, -300, 150, 120, '#ffd23f', 30, 5) + rect(80, -300, 150, 120, '#ff8fb1', 30, 5) + line(-280, -50, -280, 0, 10) + line(280, -50, 280, 0, 10)); }
function livingA(t, o = {}) { const yb = 1250; let s = dWall('stripe', '#fff0e0', '#ffe4c8', yb) + dBase(yb, '#fff');
  if (o.banner) s += aGarland(o.banner, 150, t, 120, 95);
  s += dWindowView(700, 330, 290, 340, t) + dCurtain(640, 310, 90, 420, '#e2463a', t, 1) + dCurtain(950, 310, 90, 420, '#e2463a', t, -1);
  s += dFrame(140, 420, 170, 130, 'mount', '#c38a52', -2) + dFrame(350, 400, 120, 160, 'face', '#8a6ad8', 3) + dFrame(520, 430, 110, 110, 'heart', '#ff9a4d', -4) + wallClock(560, 250, 44, t) + dShelf(80, 640, 480, dBooks(100, 640, 200, 6) + dPot(380, 640, .55, t, 0, '#5b8fd8') + dTrophy(470, 640, .8));
  s += aSofa(380, yb, .9) + G(tr(860, yb), rect(-90, -150, 180, 20, '#b5835a', 6, 5) + line(-70, -130, -70, 0, 8) + line(70, -130, 70, 0, 8)) + dMug(830, yb - 150, 1, t) + dLamp(980, yb, .9, 1, t, '#ffd23f') + dOutlet(640, 1180) + dSwitch(1040, 860);
  return s + dParquet(yb, '#c49a6c') + dRug(540, 1470, 820, 160, '#e2463a', '#ffd23f') + dShoes(200, 1350, .6, '#5b8fd8') + dBag(960, 1380, .6, '#36a85a', 10) + dBall(760, 1640, .7, t, '#5ec4f0'); }
function factoryA(t, o = {}) { const yb = 1250, prod = o.prod ?? 1; let s = rect(-M, -M, W + 2 * M, yb + M, '#c9ccd6', 0, 0);
  for (let y = -40, r = 0; y < yb; y += 60, r++) for (let x = -M + (r % 2) * 60; x < W + M; x += 120) s += rect(x, y, 116, 56, 'none', 3, 3, '#b5b9c5');
  for (let i = 0; i < 4; i++) { const x = 100 + i * 290, on = Math.sin(t * 9 + i * 2) > -.8; s += line(x, -100, x, 70, 5) + path(`M${x - 50} 110L${x + 50} 110L${x + 30} 70L${x - 30} 70Z`, '#3a4250', 5) + (on ? op(.16, path(`M${x - 40} 110L${x + 40} 110L${x + 170} 900L${x - 170} 900Z`, '#fff6c8', 0)) : ''); }
  s += rect(-M, 180, W + 2 * M, 34, '#8a919c', 0, 6) + [140, 520, 900].map(x => rect(x - 22, 172, 44, 50, '#6f7681', 6, 5)).join('') + rect(40, 214, 34, 800, '#8a919c', 0, 6) + rect(1010, 214, 34, 700, '#8a919c', 0, 6);
  [[57, 520], [1027, 460]].forEach(([x, y], i) => { const a = -60 + 30 * prod + 10 * Math.sin(t * (3 + i)); s += circ(x, y, 52, '#fff', 6) + G(tr(x, y, 1, a), line(0, 0, 0, -38, 6, '#e2463a')) + circ(x, y, 7, OL, 0); });
  s += dPoster(1010, 760, 110, 150, '#ffd23f', 4, ftext(0, -20, '⚠', { size: 50, fill: OL, stroke: 'none' }) + ftext(0, 40, 'CASQUE', { size: 20, fill: OL, stroke: 'none' }), t) + wallClock(160, 330, 42, t);
  s += rect(290, 520, 500, 520, '#e2463a', 30, 7) + rect(320, 550, 440, 70, '#fff8e0', 12, 5) + ftext(540, 600, 'MÉLANINE', { size: 46, fill: '#8a5a3a', stroke: 'none' }) + rect(350, 650, 380, 200, '#1c2433', 14, 6) + rect(720 - 40, 940, 60, 40, '#555', 6, 4) +
    rect(400, 380, 70, 140, '#8a919c', 6, 6) + [0, 1, 2].map(i => { const k = (t * .6 + i / 3) % 1; return op((1 - k) * (.4 + .6 * prod), cloud(435 + k * 60, 340 - k * 260, .4 + k * .5, '#e6e8ee')); }).join('') +
    [0, 1, 2, 3].map(i => circ(340 + i * 50, 900, 14, Math.sin(t * 6 + i) > 0 ? ['#7be07b', '#ffd23f', '#e2463a', '#5ec4f0'][i] : '#555', 4)).join('') + rect(620, 880, 120, 40, '#8a919c', 8, 4);
  s += rect(-M, 1060, W + 2 * M, 40, '#3a4250', 10, 6); for (let x = -M; x < W + M; x += 70) s += circ(x + ((t * 120) % 70), 1110, 20, '#8a919c', 5);
  if (o.pellet) { const px = ((t * 120) % 1600) - 200; s += circ(px, 1040, 22, '#8a5a3a', 5); }
  s += dTileFloor(yb, '#9aa0aa', '#8a909a') + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => path(`M${-60 + i * 100} ${yb + 10}l40 0l-30 30l-40 0Z`, i % 2 ? '#ffd23f' : OL, 0)).join('');
  s += dBox(120, 1330, .9, 'PIGMENT') + dBox(180, 1220, .6, 'VIDE') + G(tr(960, 1330), rect(-60, -150, 120, 150, '#5b8fd8', 14, 6) + line(-60, -110, 60, -110, 5) + line(-60, -40, 60, -40, 5)) + dBin(740, 1300, .6, '#7d848c');
  return s; }
function eyeChart(x, y, s, bl = 0) { const rows = [['E', 120], ['F P', 84], ['T O Z', 62], ['L P E D', 48], ['P E C F D', 38], ['E D F C Z P', 30]]; let g = rect(-180, -280, 360, 560, '#fff', 10, 6), yy = -170;
  let tx = ''; rows.forEach(([str, sz], i) => { tx += ftext(0, yy + sz * .36, str, { size: sz, fill: i === 0 ? '#e2463a' : OL, stroke: 'none', ls: sz * .2 }); yy += sz * 1.15 + 6; });
  return G(tr(x, y, s), g + blurPx(bl, tx) + line(-150, 230, 150, 230, 5, '#e2463a')); }
function officeA(t, o = {}) { const yb = 1250; let s = dWall('dot', '#e6f6f2', '#cfeae3', yb) + dBase(yb, '#fff') + rect(-M, 900, W + 2 * M, 16, '#a9d8cc', 0, 0);
  s += rect(50, 400, 300, 340, '#cfe8ff', 6, 6); for (let i = 0; i < 9; i++) s += rect(44, 410 + i * 36 + wave(t, .6, 2, i), 312, 20, '#f4f1ea', 4, 3); s += line(330, 400, 330, 700 + wave(t, .6, 10), 3);
  s += eyeChart(780, 520, 1, o.blur || 0) + dFrame(200, 260, 210, 140, 'mount', '#c38a52', 0) + G(tr(470, 280, 1, 3), rect(-90, -60, 180, 120, '#fff8e0', 6, 6) + ftext(0, -10, 'DIPLÔME', { size: 28, fill: SX.ink, stroke: 'none' }) + ftext(0, 30, 'ophtalmo', { size: 22, fill: '#7a6a5a', stroke: 'none' }) + circ(60, 40, 16, '#e2463a', 4));
  s += dShelf(420, 780, 300, dBooks(440, 780, 120, 5) + G(tr(640, 740), circ(0, 0, 38, '#fff', 5) + circ(14, 0, 18, ALB_IRIS, 4) + circ(14, 0, 8, OL, 0)) + dJar(700, 780, '#5ec4f0', .7)) + wallClock(1010, 230, 46, t);
  s += G(tr(1040, 700), line(60, 0, -60, 0, 14, '#7d848c') + rect(-200, -60, 160, 120, '#3a4250', 30, 6) + circ(-160, 0, 34, '#cfe8ff', 5) + circ(-80, 0, 34, '#cfe8ff', 5) + circ(-160, 0, 12, OL, 0) + circ(-80, 0, 12, OL, 0));
  s += dPot(1010, yb, .95, t, 0, '#5b8fd8') + dDeskLamp(140, 1110, .9, t) + G(tr(170, yb), rect(-130, -140, 260, 20, '#b5835a', 6, 5) + line(-110, -120, -110, 0, 8) + line(110, -120, 110, 0, 8)) + dMug(230, 1110, .9, t, '#5ec4f0') + dOutlet(600, 1180) + dSwitch(1040, 960);
  return s + dTileFloor(yb, '#e9e4da', '#dcd5c8') + dBin(860, 1330, .7, '#5ec4f0') + G(tr(600, 1420), ell(0, 0, 80, 20, '#3a4250', 5) + line(0, 0, 0, -80, 10) + ell(0, -90, 70, 22, '#5b8fd8', 5)) + dShoes(320, 1500, .6, '#8a6ad8'); }
function snowfall(t, n = 60, seed = 5) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x0 = r() * (W + 200) - 100, sp = 80 + r() * 120, sz = 5 + r() * 9; const y = ((r() * H + t * sp) % (H + 100)) - 50; s += circ(x0 + Math.sin(t * 1.5 + i) * 30, y, sz, '#fff', 0); } return s; }
function snowman(x, yb, s, t) { return G(tr(x, yb, s), circ(0, -90, 95, '#fff', 6) + circ(0, -240, 70, '#fff', 6) + circ(0, -350, 52, '#fff', 6) + circ(-18, -360, 7, OL, 0) + circ(18, -360, 7, OL, 0) + path('M0 -346L56 -336L0 -330Z', '#ff8a3d', 4) + path('M-50 -300Q0 -280 50 -300L50 -284Q0 -262 -50 -284Z', '#e2463a', 5) + rect(-44, -430, 88, 24, '#2b2b33', 6, 5) + rect(-30, -480, 60, 56, '#2b2b33', 6, 5) + line(-60, -240, -150, -300 + wave(t, 1, 8), 6, '#8a5a3a') + line(60, -240, 150, -290, 6, '#8a5a3a') + circ(0, -250, 7, OL, 0) + circ(0, -210, 7, OL, 0)); }
const snowCap = (x, y, w) => path(`M${x - 10} ${y}Q${x + w * .25} ${y - 26} ${x + w * .5} ${y - 10}Q${x + w * .75} ${y - 30} ${x + w + 10} ${y}Z`, '#fff', 5);
function winterA(t, o = {}) { const yb = 1250; let s = grad('#aebfd6', '#eef3f8', -M, -M, W + 2 * M, 1900) + cloud(((t * 20) % 1600) - 300, 200, 1.6, '#dfe6ee') + cloud(((t * 12 + 800) % 1700) - 300, 380, 1.2, '#e8edf3');
  s += op(.85, dSkyline(1000, '#c9d6e6', 7, 'rgba(255,240,200,.5)')) + dHaze(.2, '235,242,250');
  if (o.sun) s += o.sun;
  const signs = ['CAFÉ', 'JOUETS', 'PHARMACIE', 'FLEURS', 'BOULANGERIE'];
  for (let i = -1; i < 4; i++) { const h = 560 + (i * 137 % 250), x = -120 + i * 300; s += dBuilding(x, yb, 280, h, ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4], i + 20, t, { sign: signs[(i + 5) % 5], awn: DPAL[(i + 8) % 8] }) + snowCap(x - 10, yb - h - 18, 300) + snowCap(x + 14, yb - 196, 252); }
  let gl = 'M-60 250'; for (let i = 0; i < 6; i++) gl += `Q${-60 + i * 220 + 110} 330 ${-60 + (i + 1) * 220} 250`; s += path(gl, 'none', 4);
  for (let i = 0; i < 14; i++) s += circ(-40 + i * 90, 270 + Math.abs(Math.sin((i * 90 + 60) / 220 * Math.PI)) * 50, 11, Math.sin(t * 5 + i * 1.3) > 0 ? DPAL[i % 8] : '#7a7f88', 3);
  s += dHaze(.12, '240,245,252', yb);
  s += rect(-M, yb, W + 2 * M, 1400, '#f4f7fb', 0, 0) + line(-M, yb, W + M, yb, 7, '#c9d3de') + rect(-M, yb + 110, W + 2 * M, 1400, '#8a919c', 0, 0) + path(`M-${M} ${yb + 110}Q300 ${yb + 90} 600 ${yb + 115}T${W + M} ${yb + 108}L${W + M} ${yb + 140}L-${M} ${yb + 140}Z`, '#fff', 0) + Array.from({ length: 6 }, (_, i) => rect(-100 + i * 260, yb + 320, 150, 18, '#e8edf3', 4, 0)).join('');
  s += dLampPost(70, yb, 1, 1) + dLampPost(1010, yb, 1, 1) + dPine(250, yb, .7, t) + snowCap(190, yb - 250 * .7 - 10, 120) + snowman(850, yb + 10, .55, t) + dBench(560, yb, .7) + snowCap(470, yb - 80, 180) + dCar(-40, yb + 260, .9, '#5ec4f0') + snowCap(-160, yb + 70, 250) + dSign(1060, yb, 'NOËL', '#e2463a', .7);
  for (let i = 0; i < 2; i++) { const x = ((i * 700 + t * (60 + i * 30) * (i % 2 ? -1 : 1)) % 1700 + 1700) % 1700 - 300; s += op(.8, adult(i + 1, { x, y: 1270, s: .5, expr: 'neutral', walk: 3, flip: i % 2, cap: '#e2463a' }, t)); }
  return s + snowfall(t, 50); }
function parkA(t, o = {}) { const yb = 1150; let s = SKY(t, '#8fd3ff', '#fff4dc') + op(.7, dSkyline(980, '#c3d6e4', 8)) + circ(-40, 1060, 200, '#a6d98f', 0) + circ(900, 1080, 260, '#9ccf8a', 0) + dHaze(.15);
  s += tree(80, yb, .8, t) + dPine(380, yb, .6, t) + tree(1000, yb, .9, t) + dFence(-M, W + M, yb + 10, '#fff');
  s += rect(-M, yb, W + 2 * M, 1500, '#8fd16a', 0, 0) + line(-M, yb, W + M, yb, 6, '#6fae4f') + path(`M300 ${yb}Q520 1400 380 ${H + 100}L760 ${H + 100}Q820 1400 520 ${yb}Z`, '#e8d6a8', 0);
  const sw = Math.sin(t * 2.6) * 22; s += G(tr(720, yb + 30), line(-110, 0, -80, -330, 10, '#e2463a') + line(110, 0, 80, -330, 10, '#e2463a') + line(-90, -330, 90, -330, 12, '#e2463a') + G(tr(0, -330, 1, sw), line(-30, 0, -30, 220, 4) + line(30, 0, 30, 220, 4) + rect(-46, 214, 92, 18, '#ffd23f', 5, 4)));
  s += G(tr(930, yb + 40), path('M-120 0L-120 -250L-80 -250L120 0Z', '#5ec4f0', 6) + line(-150, 0, -150, -300, 8) + line(-110, -300, -110, 0, 8) + [0, 1, 2, 3].map(i => line(-150, -60 - i * 60, -110, -60 - i * 60, 6)).join(''));
  s += dBench(220, yb + 40, .7) + dLampPost(500, yb + 20, .8) + dBin(600, yb + 40, .5, '#36a85a') + dBush(60, yb + 50, .8) + dFlowers(150, yb + 70, 6, 4, t) + dFlowers(820, yb + 90, 5, 8, t) + dBike(380, yb + 60, .5, '#ff5c8a') + kidsBg(t, yb + 70, 3, .4);
  if (o.shade) s += op(.3, ell(o.shade, 1520, 300, 70, '#1f4a2a', 0));
  for (let i = 0; i < 16; i++) s += circ((i * 211) % W, 1300 + (i * 97) % 560, 9, ['#ffd23f', '#ff8fb1', '#fff'][i % 3], 3);
  return s; }
function bakeryA(t) { const yb = 1250; let s = dWall('diamond', '#fff4e0', '#ffe6c0', yb) + dBase(yb, '#c8955a');
  s += rect(140, 150, 800, 90, '#8a5a3a', 18, 6) + ftext(540, 216, 'BOULANGERIE', { size: 60, fill: '#ffe08a', stroke: 'none' }) + [0, 1, 2].map(i => { const x = 260 + i * 280; return line(x, -100, x, 270, 4) + path(`M${x - 46} 320L${x + 46} 320L${x + 26} 270L${x - 26} 270Z`, '#36a85a', 5) + op(.2 + .05 * Math.sin(t * 3 + i), path(`M${x - 40} 320L${x + 40} 320L${x + 120} 600L${x - 120} 600Z`, '#fff6c8', 0)); }).join('');
  s += rect(40, 360, 330, 420, '#2f3b33', 14, 7) + ftext(205, 430, 'MENU', { size: 40, fill: '#fff', stroke: 'none' }) + ftext(205, 500, 'baguette 1,20', { size: 28, fill: '#fff', stroke: 'none' }) + ftext(205, 550, 'croissant 1,10', { size: 28, fill: '#fff', stroke: 'none' }) + ftext(205, 600, 'pain choc 1,30', { size: 28, fill: '#fff', stroke: 'none' }) + path('M90 650Q205 700 320 650', 'none', 4, '#ffd23f');
  s += dShelf(430, 520, 600, [0, 1, 2, 3, 4].map(i => ell(480 + i * 110, 485, 48, 32, i % 2 ? '#d9913f' : '#c27a2e', 5) + path(`M${460 + i * 110} 470L${495 + i * 110} 490`, 'none', 4, '#8a5420')).join('')) + dShelf(430, 720, 600, G(tr(560, 720), rect(-80, -60, 160, 60, '#b5835a', 10, 5) + [-50, -20, 10, 40].map((dx, i) => G(tr(dx, -70, 1, -15 + i * 10), rect(-12, -80, 24, 110, '#e0a050', 12, 4))).join('')) + croissant(760, 690, .8) + croissant(880, 690, .8) + dJar(980, 720, '#ff8fb1', .8));
  s += wallClock(1010, 300, 42, t) + dPot(60, 1100, .8, t, 2) + dOutlet(380, 1180);
  s += rect(380, 900, 720, 160, 'rgba(220,240,255,.55)', 14, 6) + [0, 1, 2, 3].map(i => croissant(450 + i * 90, 1030, .7)).join('') + G(tr(900, 1030), path('M-60 0L60 0L50 -60L-50 -60Z', '#ff8fb1', 5) + ell(0, -66, 50, 12, '#fff', 4) + circ(0, -84, 12, '#e2463a', 4)) + rect(380, 1050, 720, 200, '#b5835a', 10, 7) + rect(380, 1050, 720, 30, '#8a5a3a', 6, 6) + [0, 1, 2].map(i => rect(420 + i * 230, 1100, 190, 120, '#c8955a', 8, 4)).join('');
  s += G(tr(1000, 890), rect(-70, -80, 140, 80, '#5b8fd8', 10, 5) + rect(-50, -66, 100, 30, '#bfe8c8', 4, 4) + rect(-80, -10, 160, 20, '#3a4250', 4, 4));
  return s + dTileFloor(yb, '#f4efe6', '#c9bfae') + G(tr(140, 1400), rect(-70, -150, 140, 150, '#c8955a', 14, 6) + [-30, 0, 30].map(dx => G(tr(dx, -150, 1, dx / 3), rect(-12, -130, 24, 150, '#e0a050', 12, 4))).join('')) + dBag(960, 1380, .6, '#ffd23f', 8); }
function fgA(kind, t) { let s = '';
  if (kind === 'park') s = dBush(-40, 1990, 2.4, '#4f9a4f') + dFlowers(940, 1990, 4, 3, t).replace(/stroke-width="5"/g, 'stroke-width="9"');
  if (kind === 'office') s = G(tr(-40, 2000, 2.2), rect(-60, -200, 120, 200, '#5b8fd8', 20, 6)) + dPot(1090, 2020, 2.4, t, 1);
  if (kind === 'snow') s = G(tr(-60, 2000, 2.4), circ(0, -80, 120, '#fff', 6)) + G(tr(1120, 2000, 2.2), rect(-30, -280, 60, 280, '#3a4250', 10, 6) + snowCap(-40, -280, 80));
  if (kind === 'bakery') s = G(tr(-30, 2000, 2.2), rect(-80, -160, 160, 160, '#c8955a', 14, 6)) + G(tr(1100, 1990, 2.2), aBaguette(0, -60, .6, -60));
  if (kind === 'factory') s = dBox(-40, 2000, 2.4, '') + G(tr(1110, 2000, 2.2), rect(-70, -220, 140, 220, '#e2463a', 18, 6));
  return s ? blur(9, s) : ''; }
const SUNSET = (k = .25) => op(k, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff9a4d', 0, 0));

// ============================================================
//  PLANS (31 blocs → 37 plans)
// ============================================================
const off = (n, w) => +(at(n, w) - .15).toFixed(2);   // décalage d'un sous-plan (début = mot − 0,15 s)
// B001 — SIGNATURE SIZEX : grille encre, tête du héros en cut-out, « débloqué » en étoiles sur ALBINOS, titre cinétique
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const A = at(1, 'albinos') - .05;
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 1010, t, A, { part: 'back', r: 480 }) + G(tr(CX, 1010, 1 + .03 * Math.sin(t * 6)), cutout(albHead(0, 0, 175, { expr: t > A ? 'happy' : 'neutral' }, t), 14)) + unlock(CX, 1010, t, A, { part: 'front', r: 480 }) +
      funBox(CX, 880, 430, 230, t, A + .25, { label: 'albinos.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin('HORRIBLE DE NAÎTRE', CX, 415, t, .3, { size: 58 }) + kword('ALBINOS ?', CX, 540, t, A, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'albinos') - .05, 'boom', .6], [at(1, 'albinos'), 'sparkle', .6], [at(1, 'albinos') + .25, 'tick', .5]] });
// B002a — tu viens de naître : papier + gobo, bébé en cut-out, JOUR 1
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const N = at(2, 'naitre'); return paper(SX.paper) + gobo(T, .12) + burst(CX, 980, 340, t, .05, '#ffe1b8', 18) + cutout(albBaby({ x: CX, y: 1290, s: 1.6, expr: t > N ? 'joy' : 'calm' }, t), 12) + popStars(CX, 980, t, N) +
    funTag(CX, 470, 'JOUR 1', t, N - .1, { size: 80, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .5], [at(2, 'viens'), 'baby_coo', .7], [at(2, 'naitre') - .1, 'pop', .6], [at(2, 'naitre'), 'sparkle', .5]] });
// B002b — cheveux presque blancs, peau très claire : nuancier (cartes 2.5D) pointé au marqueur
const O2 = off(2, 'cheveux');
B(2, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const C = at(2, 'cheveux') - O2, P = at(2, 'peau') - O2;
    return gridBg('#2a2440') + halftoneFade('#fff', .05, 1) + cutout(albHead(CX, 1000, 185, { expr: 'happy', hstyle: 'babyRed' }, t), 12) +
      swatch(270, 520, ALB_HAIR, 'CHEVEUX', '#F8F5EE', t, C, -6) + swatch(810, 520, ALB_SKIN, 'PEAU', '#FDEEE4', t, P, 6) +
      markerArrow(300, 660, 470, 800, t, C + .25, { bend: -40, col: SX.acc2 }) + markerArrow(780, 660, 700, 960, t, P + .25, { bend: 40, col: SX.acc2 }) + markerText('presque blancs', 300, 1120, t, at(2, 'blancs') - O2, { size: 40, col: '#fff' }); },
  sfx: [[at(2, 'cheveux') - O2, 'pop', .6], [at(2, 'cheveux') - O2 + .25, 'scratch', .4], [at(2, 'peau') - O2, 'pop', .6], [at(2, 'peau') - O2 + .25, 'scratch', .4], [at(2, 'claire') - O2, 'glint', .5]] }, O2);
// B003 — avant même d'avoir appris à marcher : chambre de bébé, bébé qui tente de se lever… et retombe
B(3, { enter: 'whip', cam: zin(1.0, 1.07, .4),
  draw: (t, d, T) => { const Mr = at(3, 'marcher'), fall = eOutBack(seg(t, Mr, Mr + .3)), w = Math.sin(t * 9) * 9 * (1 - fall);
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: nurseryA(t), haze: .06 }, { z: 1, svg: albBaby({ x: 620, y: 1340 + fall * 30, s: 1.5, expr: t > Mr ? 'dizzy' : 'effort', rot: w - fall * 10 }, t) }, { z: .6, svg: fgLayer('room', t) }]) +
      funTag(CX, 450, 'ÉTAPE 1 : MARCHER', t, at(3, 'appris') - .1, { size: 48, bg: SX.cool }) + popStars(620, 1100, t, Mr + .05); },
  sfx: [[0, 'whoosh', .5], [at(3, 'avant'), 'tiptoe', .6], [at(3, 'appris') - .1, 'pop', .6], [at(3, 'marcher'), 'boing', .7], [at(3, 'marcher') + .2, 'baby_coo', .5]] });
// B004 — le soleil est déjà ton pire ennemi : soleil maléfique à la fenêtre, rayon qui fonce sur le berceau
B(4, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: t > at(4, 'pire') ? 1.1 : lerp(1.0, 1.04, t / d), shake: t > at(4, 'ennemi') ? 5 : 0, hand: .4 }),
  draw: (t, d, T) => { const S = at(4, 'soleil'), k = eOutBack(seg(t, S - .1, S + .4));
    return nurseryA(t, { sun: 1 }) + op(.4 * clamp(k), path('M640 480L980 480L620 1350L220 1350Z', '#fff3a0', 0)) + G(tr(800, 520, .5 * k), sun(0, 0, 1, t, 'evil')) +
      albBaby({ x: 330, y: 1350, s: 1.5, expr: t > S ? 'terror' : 'happy', look: [1, -1] }, t) + kword('PIRE ENNEMI', CX, 330, t, at(4, 'pire') - .05, { size: 72, fill: SX.acc2 }); },
  sfx: [[at(4, 'soleil') - .1, 'whoosh_up', .6], [at(4, 'soleil') + .1, 'sizzle', .6], [at(4, 'pire') - .05, 'boom', .6], [at(4, 'ennemi'), 'growl', .6]] });
// B005 — bienvenue dans la vie… : salon, banderole BIENVENUE, famille qui applaudit, « débloqué » sur ALBINISME
B(5, { enter: 'drop', cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const A = at(5, 'albinisme') - .05; return livingA(t, { banner: 'BIENVENUE' }) + adult(1, { x: 150, y: 1460, s: 1.0, expr: 'happy', armL: [200 + wave(t, 3, 20), 230], armR: [-20 - wave(t, 3, 20), -50] }, t) + adult(0, { x: 930, y: 1460, s: 1.0, expr: 'happy', flip: 1, armL: [200 + wave(t, 3, 20, .5), 230], armR: [-20, -50] }, t) +
    unlock(CX, 1100, t, A, { part: 'back', r: 420 }) + alb({ x: CX, y: 1500, s: 1.35, expr: t > A ? 'ecstatic' : 'happy', armR: [-40 + wave(t, 3, 25), -80] }, t) + unlock(CX, 1100, t, A, { part: 'front', r: 420 }) + confetti(t, at(5, 'bienvenue'), 30) +
    kword('ALBINISME', CX, 520, t, A, { size: 100, fill: '#fff' }); },
  sfx: [[at(5, 'bienvenue'), 'tada', .6], [at(5, 'vie'), 'pop', .4], [at(5, 'albinisme') - .05, 'boom', .5], [at(5, 'albinisme'), 'sparkle', .7]] });
// B006 — ton corps produit très peu, voire pas, de mélanine : l'usine à mélanine, ouvrier endormi, jauge à 0 %
B(6, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const P = at(6, 'peu'), V = at(6, 'pas'), pr = lerp(1, .1, seg(t, at(6, 'tres'), P + .2)) * (t > V ? 0 : 1), pct = t > V ? 0 : counter(100, 3, t, at(6, 'tres'), .8);
    return depth({ zoom: 1, x: Math.sin(t * .8) * 10 }, [{ z: 1.4, svg: factoryA(t, { prod: pr, pellet: t < V }), haze: .06 }, { z: 1, svg: adult(2, { x: 860, y: 1560, s: 1.2, expr: 'sleep', cap: '#ffd23f', rot: -6, armL: [120, 100] }, t) + ftext(990, 900, 'z', { size: 60 }) + ftext(1030, 840, 'Z', { size: 80 }) }, { z: .6, svg: fgA('factory', t) }]) +
      G(tr(540, 750), ftext(0, 40, `${pct} %`, { size: 110, fill: pct < 10 ? '#ff5a5a' : '#7be07b', stroke: 'none' })) + funTag(CX, 400, 'PRODUCTION', t, at(6, 'produit') - .1, { size: 54, bg: SX.cool }) + (t > V ? cross(540, 750, .9, t, V) : ''); },
  sfx: [[0, 'whoosh', .5], [at(6, 'produit') - .1, 'pop', .6], [at(6, 'tres'), 'rewind', .5], [at(6, 'pas'), 'error_beep', .7], [at(6, 'melanine'), 'crickets', .5]] });
// B007a — c'est le pigment qui colore : pot de peinture « MÉLANINE » qui peint un grand trait brun
B(7, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const C = at(7, 'colorne'), k = seg(t, C - .1, C + .6);
    return classroomT(t, ftext(540, 470, 'ARTS PLASTIQUES', { size: 54, fill: 'rgba(255,255,255,.85)', font: SX.marker, stroke: 'none' })) +
      G(tr(460, 1060, 1, wave(t, 2, 6)), rect(-120, -160, 240, 200, '#fff', 20, 7) + path('M-120 -160Q-60 -120 0 -160T120 -160L120 -110Q60 -80 0 -110T-120 -110Z', '#8a5a3a', 6) + path('M-80 -110Q-90 -40 -70 -20Q-60 -40 -60 -110Z', '#8a5a3a', 5) + ftext(0, -20, 'MÉLANINE', { size: 34, fill: '#8a5a3a', stroke: 'none' }) + circ(-40, -70, 10, OL, 0) + circ(40, -70, 10, OL, 0) + path('M-30 -50Q0 -30 30 -50', 'none', 6)) +
      `<path d="M220 700Q540 560 860 720" fill="none" stroke="#8a5a3a" stroke-width="70" stroke-linecap="round" stroke-dasharray="${f1(800 * k)} 900"/>` + G(tr(lerp(220, 860, k), lerp(700, 720, k) - 80 * Math.sin(k * Math.PI), 1, 30), rect(-14, -170, 28, 180, '#ffd23f', 8, 5) + path('M-24 10L24 10L16 70L-16 70Z', '#8a5a3a', 5)) +
      kword('PIGMENT', CX, 360, t, at(7, 'pigment') - .05, { size: 110, fill: '#c9874a' }); },
  sfx: [[at(7, 'pigment') - .05, 'boom', .5], [at(7, 'colorne') - .1, 'spray', .6], [at(7, 'normalement'), 'squeak', .4]] });
// B007b — ta peau, tes cheveux et tes yeux : salle de bain, 3 étiquettes-nuancier qui poussent sur chaque mot
const O7 = off(7, 'peau');
B(7, { enter: 'none', trans: 'push', transD: .25, cam: camHand(1.04, .3),
  draw: (t, d, T) => { const P = at(7, 'peau') - O7, C = at(7, 'cheveux') - O7, Y = at(7, 'yeux') - O7;
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.4, svg: bathroomT(t), haze: .1 }, { z: 1, svg: albHead(CX, 930, 230, { expr: t > Y ? 'wow' : 'happy' }, t) }, { z: .6, svg: fgLayer('bath', t) }]) +
      funTag(200, 470, 'PEAU', t, P - .05, { size: 50, bg: ALB_SKIN, fg: SX.ink, r: -6 }) + funTag(CX, 400, 'CHEVEUX', t, C - .05, { size: 50, bg: '#fff', fg: SX.ink, r: 3 }) + funTag(880, 470, 'YEUX', t, Y - .05, { size: 50, bg: ALB_IRIS, fg: SX.ink, r: 6 }) +
      markerArrow(220, 540, 370, 960, t, P + .1, { bend: -30 }) + markerArrow(CX, 470, CX + 40, 690, t, C + .1, { bend: 30 }) + markerArrow(860, 540, 640, 900, t, Y + .05, { bend: 30, d: .25 }); },
  sfx: [[at(7, 'peau') - O7 - .05, 'pop', .6], [at(7, 'cheveux') - O7 - .05, 'pop', .6], [at(7, 'yeux') - O7 - .05, 'pop_hi', .6], [at(7, 'yeux') - O7 + .1, 'glint', .5]] }, O7);
// B008 — sauf que la mélanine aide aussi : SUPER-MÉLANINE, rayons, pose de super-héros
B(8, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(clamp(t / .5))), cy: 1000 }),
  draw: (t, d, T) => { const Mn = at(8, 'melanine'); return rays(t, CX, 940, '#ffb36b', '#ff8a3d', 22) + G(tr(CX, 960, eOutBack(seg(t, Mn - .3, Mn + .1))), melano(0, 0, 2.1, t, { expr: 'proud', arm: 1 })) + popStars(CX, 900, t, Mn, 8, 360) +
    funTag(CX, 470, 'SUPER-MÉLANINE', t, Mn - .05, { size: 62, bg: '#e2463a' }) + markerText('aide aussi !', 760, 1170, t, at(8, 'aide'), { size: 46, col: '#fff' }); },
  sfx: [[0, 'whoosh_up', .6], [at(8, 'melanine') - .05, 'tada', .6], [at(8, 'aide'), 'scratch', .4], [at(8, 'aussi'), 'glint', .5]] });
// B009 — à protéger ta peau des UV : rue au soleil, les éclairs UV rebondissent sur le bouclier de Super-Mélanine
B(9, { enter: 'none', trans: 'circle', transD: .3, ty: 900, cam: zin(1.0, 1.06, .4),
  draw: (t, d, T) => { const Ry = at(9, 'rayons'), k1 = seg(t, Ry - .2, Ry + .15), k2 = seg(t, Ry + .1, Ry + .45), bounce = t > Ry + .15;
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: streetT(t), haze: .1 }, { z: 1, svg: kid(3, { x: 420, y: 1500, s: 1.35, expr: 'chill', armR: [-40, -60] }, t) + G(tr(640, 900, 1, -20), melano(0, 0, .8, t, { expr: 'effort', label: false }) + G(tr(-40, -140, 1, -10), path('M-120 0Q0 -90 120 0Q0 40 -120 0Z', '#5b8fd8', 7) + ftext(0, 0, 'M', { size: 40, fill: '#fff', stroke: 'none' }))) }]) +
      G(tr(930, 620, .36), sun(0, 0, 1, t, 'evil')) + uvBolt(860, 700, 630, 770, k1) + uvBolt(900, 740, 700, 800, k2) + (bounce ? impactStar(620, 770, .5, '#a259ff') + uvBolt(620, 770, 300 + 60 * Math.sin(t * 9), 600, seg(t, Ry + .15, Ry + .4)) : '') +
      funTag(930, 470, 'UV', t, Ry - .1, { size: 54, bg: '#a259ff' }) + kword('ULTRAVIOLETS', CX, 400, t, at(9, 'ultraviolets') - .05, { size: 84, fill: '#d9b8ff' }); },
  sfx: [[at(9, 'proteger'), 'whoosh', .5], [at(9, 'rayons') - .2, 'zap', .7], [at(9, 'rayons') + .15, 'ding', .7], [at(9, 'ultraviolets') - .05, 'boom', .5]] });
// B010 — Kevin peut passer l'après-midi dehors : parc, Kevin chill de ouf, ballon, horloge qui file
B(10, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const K = at(10, 'kevin'), J = at(10, 'jouer'), bx = 700 + Math.sin(t * 4) * 200, by = 900 - Math.abs(Math.sin(t * 4)) * 260;
    return depth({ zoom: 1, x: Math.sin(t) * 15 }, [{ z: 1.5, svg: parkA(t), haze: .08 }, { z: 1, svg: kevin({ x: 380, y: 1500, s: 1.35, expr: t > J ? 'ecstatic' : 'chill', armL: [200, 230], armR: [-30, -70], legR: [40, 60] }, t) + dBall(bx, by, 1.2, t) }, { z: .6, svg: fgA('park', t) }]) +
      G(tr(870, 600), circ(0, 0, 90, '#fff', 7) + line(0, 0, 0, -62, 8) + G(`rotate(${f1(t * 500)})`, line(0, 0, 0, -76, 5, SX.acc))) + funTag(870, 740, `${counter(14, 18, t, at(10, 'apres'), .8)} H`, t, at(10, 'apres') - .1, { size: 46, bg: SX.cool }) + funTag(380, 430, 'KEVIN', t, K - .05, { size: 58, bg: '#5fb85f' }); },
  sfx: [[0, 'whoosh', .5], [at(10, 'kevin') - .05, 'pop', .6], [at(10, 'apres'), 'clock_fast', .5], [at(10, 'jouer'), 'boing', .6], [at(10, 'dehors'), 'chirp', .5]] });
// B011a — toi : crème solaire en tartine, SPF 50+
B(11, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const C = at(11, 'creme'), k = seg(t, C - .1, C + .5);
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.4, svg: bathroomT(t), haze: .1 }, { z: 1, svg: alb({ x: 360, y: 1500, s: 1.45, expr: t > C + .4 ? 'deadpan' : 'effort', cream: k, armR: [-30, -110] }, t) }, { z: .6, svg: fgLayer('bath', t) }]) +
      G(tr(820, 920, 1, -30 + 8 * Math.sin(t * 20) * (k > 0 && k < 1 ? 1 : 0)), sunscreen(0, 0, 1.7)) + (k > 0 && k < 1 ? [0, 1, 2].map(i => circ(lerp(720, 470, (k * 3 + i / 3) % 1), lerp(820, 1000, (k * 3 + i / 3) % 1), 22, '#fff', 4)).join('') : '') +
      funTag(820, 620, 'SPF 50+', t, at(11, 'solaire') - .05, { size: 56, bg: SX.acc }) + funTag(380, 430, 'TOI', t, at(11, 'toi') - .05, { size: 54, bg: HERO }); },
  sfx: [[at(11, 'toi') - .05, 'pop', .6], [at(11, 'creme') - .1, 'spray', .7], [at(11, 'creme') + .2, 'squeak', .5], [at(11, 'solaire') - .05, 'pop_hi', .6]] });
// B011b — vêtements protecteurs et l'ombre : chapeau + lunettes + parasol, checklist qui se coche
const O11 = off(11, 'vetements');
B(11, { enter: 'none', trans: 'wipe', cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const V = at(11, 'vetements') - O11, P = at(11, 'protecteurs') - O11, Om = at(11, 'et') + .1 - O11, items = [['CRÈME', -1], ['VÊTEMENTS', V], ['OMBRE', Om]];
    let list = rect(-200, -170, 400, 340, '#fff', 24, 7) + ftext(0, -110, 'CHECKLIST', { size: 34, fill: SX.acc, stroke: 'none' });
    items.forEach(([s, w], i) => { const y = -40 + i * 80; list += rect(-170, y - 26, 44, 44, '#fff', 8, 5) + ftext(-110, y + 10, s, { size: 34, fill: SX.ink, stroke: 'none', anchor: 'start' }) + (t > w ? path(`M${-162} ${y - 4}L${-148} ${y + 12}L${-122} ${y - 26}`, 'none', 9, '#36a85a') : ''); });
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: parkA(t, { shade: 340 }), haze: .08 }, { z: 1, svg: umbrella(470, 860, .85, '#ff7a2e', '#fff') + alb({ x: 340, y: 1500, s: 1.35, expr: 'proud', hat: t > V ? 1 : 0, face: t > P ? { eyes: 'shades' } : {}, armR: [-20, -80], sleeve: '#5b4aa8' }, t) }, { z: .6, svg: fgA('park', t) }]) +
      G(tr(810, 560, 1, 4), list) + popStars(340, 960, t, V) + popStars(340, 1100, t, P); },
  sfx: [[at(11, 'vetements') - O11, 'pop', .6], [at(11, 'vetements') - O11 + .05, 'tick', .6], [at(11, 'protecteurs') - O11, 'glint', .6], [at(11, 'et') + .1 - O11, 'tick', .7], [at(11, 'et') + .1 - O11 + .05, 'ding', .5]] }, O11);
// B012 — et ce n'est même pas le pire : nuit d'orage graphique, héros inquiet
B(12, { enter: 'none', trans: 'glitch', transD: .2, cam: () => ({ z: 1.05, shake: 3 }),
  draw: (t, d, T) => { const P = at(12, 'pire'); return gridBg('#231a35') + halftoneFade('#000', .25, 1) + (Math.sin(t * 25) > .7 ? rect(-M, -M, W + 2 * M, H + 2 * M, 'rgba(255,255,255,.25)', 0, 0) : '') + cloud(300, 300, 1.8, '#3a2f52') + cloud(800, 260, 1.6, '#3a2f52') + lightning(720, 420, .4, .5 + .5 * Math.sin(t * 30)) +
    cutout(albHead(CX, 1010, 190, { expr: t > P ? 'terror' : 'worried' }, t), 12) + kthin('et ce n’est même pas', CX, 470, t, 0, { size: 54 }) + kword('LE PIRE', CX, 600, t, P - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'thunder', .7], [at(12, 'meme'), 'sting', .5], [at(12, 'pire') - .05, 'boom', .6]] });
// B013a — parce que la mélanine participe aussi… : cabinet d'ophtalmo, Super-Mélanine à la baguette devant le tableau
B(13, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const Mn = at(13, 'melanine'), Pa = at(13, 'participe');
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.4, svg: officeA(t), haze: .08 }, { z: 1, svg: G(tr(420, 1020, eOutBack(seg(t, Mn - .3, Mn + .1))), melano(0, 0, 1.2, t, { expr: 'joy', arm: 1 })) }, { z: .6, svg: fgA('office', t) }]) +
      funTag(420, 760, 'SUPER-MÉLANINE', t, Mn - .05, { size: 42, bg: '#e2463a' }) + markerArrow(560, 860, 700, 600, t, Pa, { bend: 40 }) + funTag(CX, 400, 'MISSION N°2', t, Pa - .05, { size: 54, bg: SX.cool }); },
  sfx: [[0, 'whoosh', .5], [at(13, 'melanine') - .05, 'boing', .6], [at(13, 'participe') - .05, 'pop', .6], [at(13, 'participe'), 'scratch', .4]] });
// B013b — au développement normal de tes yeux : gros plan, yeux clairs, « débloqué » sur YEUX
const O13 = off(13, 'developpement');
B(13, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d) }),
  draw: (t, d, T) => { const Y = at(13, 'yeux') - O13, D = at(13, 'developpement') - O13;
    return blur(5, officeA(t)) + unlock(CX, 940, t, Y - .05, { part: 'back', r: 460 }) + albHead(CX, 940, 270, { expr: 'neutral', look: [0, -.2] }, t) + unlock(CX, 940, t, Y - .05, { part: 'front', r: 460 }) +
      markerCircle(CX - 92, 945, 80, 70, t, Y, { col: SX.acc2 }) + markerCircle(CX + 92, 945, 80, 70, t, Y + .1, { col: SX.acc2 }) + funTag(CX, 400, 'DÉVELOPPEMENT', t, D, { size: 52, bg: SX.cool }) + kword('TES YEUX', CX, 530, t, Y - .05, { size: 96, fill: ALB_IRIS }); },
  sfx: [[at(13, 'developpement') - O13, 'pop', .6], [at(13, 'normal') - O13, 'tick', .5], [at(13, 'yeux') - O13 - .05, 'boom', .5], [at(13, 'yeux') - O13, 'sparkle', .7]] }, O13);
// B014 — vision réduite : le tableau des lettres devient flou, le héros plisse les yeux
B(14, { enter: 'none', trans: 'wipe', cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const V = at(14, 'vision'), bl = lerp(0, 9, seg(t, V, at(14, 'reduite') + .3));
    return officeA(t, { blur: bl }) + G(tr(0, 0), eyeChart(440, 720, 1.15, bl)) + albHead(860, 1000, 160, { expr: t > V ? 'suspicious' : 'neutral', tilt: -8, look: [-1, -.5] }, t) + qmark(1000, 760, .7 + .1 * Math.sin(t * 8), '#fff', 10) +
      funTag(CX, 340, 'VISION RÉDUITE', t, V - .05, { size: 56, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [at(14, 'vision') - .05, 'pop', .6], [at(14, 'reduite'), 'hmm', .6]] });
// B015a — très sensible à la lumière : la lampe d'examen s'allume → éblouissement total
B(15, { enter: 'punch', cam: (t, d) => ({ z: 1.05, shake: t > at(15, 'lumiere') ? 6 : 0 }),
  draw: (t, d, T) => { const L = at(15, 'lumiere'), k = seg(t, L - .1, L + .1);
    return officeA(t) + G(tr(250, 380, 1, 25), rect(-30, -300, 60, 300, '#7d848c', 10, 6) + ell(0, 30, 130, 70, '#3a4250', 7) + ell(0, 50, 100, 40, k > 0 ? '#fff6c8' : '#cfd6dc', 5)) +
      (k > 0 ? op(.55 * k, path('M180 440L380 400L1200 1200L400 1500Z', '#fff6c8', 0)) : '') + albHead(720, 950, 230, { expr: t > L ? 'terror' : 'neutral', look: [-1, -1] }, t) + (k > 0 ? op(.7 * (1 - seg(t, L + .1, L + .6)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0)) : '') +
      funTag(CX, 380, 'SENSIBLE', t, at(15, 'sensible') - .05, { size: 54, bg: SX.cool }) + kword('LUMIÈRE', CX, 520, t, L, { size: 100, fill: SX.acc2 }); },
  sfx: [[at(15, 'sensible') - .05, 'pop', .6], [at(15, 'lumiere') - .1, 'zap', .6], [at(15, 'lumiere'), 'flash_hit', .8], [at(15, 'lumiere') + .1, 'gasp', .6]] });
// B015b — mouvements involontaires des yeux : gros plan, les yeux font des allers-retours (nystagmus), flèches ↔
const O15 = off(15, 'mouvements');
B(15, { enter: 'none', trans: 'up', transD: .2, cam: () => ({ z: 1.06, hand: .3 }),
  draw: (t, d, T) => { const Mv = at(15, 'mouvements') - O15, jig = t > Mv ? Math.sin(t * 24) : 0;
    return blur(6, officeA(t)) + albHead(CX, 930, 280, { expr: 'neutral', look: [jig, 0] }, t) + G(tr(CX, 700), path('M-160 0L160 0M-160 0l40 -30M-160 0l40 30M160 0l-40 -30M160 0l-40 30', 'none', 12, SX.acc2).replace('<path', `<path transform="translate(${f1(jig * 20)} 0)"`)) +
      funTag(CX, 420, 'NYSTAGMUS', t, Mv, { size: 62, bg: SX.acc }) + markerText('= mouvements involontaires', CX, 540, t, at(15, 'involontaires') - O15, { size: 38, col: '#fff', r: -3 }); },
  sfx: [[at(15, 'mouvements') - O15, 'pop', .6], [at(15, 'mouvements') - O15 + .1, 'vibrate', .5], [at(15, 'involontaires') - O15, 'scratch', .4], [at(15, 'yeux') - O15, 'boing', .4]] }, O15);
// B016 — « Magnifique. » : fond accent, pouce levé ironique
B(16, { enter: 'punch', flash: 1, cam: () => ({ z: 1.05 }),
  draw: (t, d, T) => gridBg(SX.acc, 'rgba(255,255,255,.12)') + cutout(albHead(CX, 930, 210, { expr: 'deadpan', tilt: -6 }, t), 12) + G(tr(850, 1080, 1, 6 * Math.sin(t * 10)), rect(-34, 30, 68, 160, HERO, 10, 6) + rect(-24, -150, 48, 110, ALB_SKIN, 24, 6) + rect(-64, -60, 128, 110, ALB_SKIN, 44, 6) + line(-40, -20, 30, -20, 4) + line(-40, 10, 30, 10, 4)) + kword('MAGNIFIQUE.', CX, 470, t, 0, { size: 104, fill: '#fff', puff: false }),
  sfx: [[0, 'rimshot', .6], [.05, 'pop', .5]] });
// B017 — tu sors dehors, le soleil t'éblouit, tu mets tes lunettes
B(17, { enter: 'whip', cam: (t, d) => ({ z: t > at(17, 'bloui') ? 1.1 : 1.02, hand: .5, shake: t > at(17, 'bloui') && t < at(17, 'bloui') + .3 ? 8 : 0 }),
  draw: (t, d, T) => { const E = at(17, 'bloui'), L = at(17, 'lunettes') - .1, on = t > L;
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: streetT(t) + G(tr(880, 300, .4), sun(0, 0, 1, t, on ? 'happy' : 'evil')), haze: .08 }, { z: 1, svg: alb({ x: CX, y: 1500, s: 1.35, expr: on ? 'cool' : t > E ? 'terror' : 'happy', hat: 1, walk: t < E ? 3 : 0, armR: on ? [-60, -120] : t > E ? [-90, -150] : [70, 80] }, t) }, { z: .6, svg: fgLayer('street', t) }]) +
      (t > E && !on ? op(.75 * (1 - seg(t, E, L)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fffbe0', 0, 0)) : '') + (on ? sparkle(CX + 60, 1090, .7 + .3 * Math.sin(t * 12), '#fff') : '') +
      funTag(CX, 420, 'DEHORS', t, at(17, 'sors') - .05, { size: 54, bg: SX.cool }) + (on ? funTag(CX, 560, 'LUNETTES ON', t, L, { size: 50, bg: SX.acc2, fg: SX.ink }) : ''); },
  sfx: [[at(17, 'sors') - .05, 'steps', .6], [at(17, 'bloui'), 'flash_hit', .8], [at(17, 'bloui') + .05, 'gasp', .6], [at(17, 'lunettes') - .1, 'glint', .8]] });
// B018 — Kevin : « pourquoi tu portes des lunettes de soleil ? » : rue en hiver, neige
B(18, { enter: 'drop', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const Q = at(18, 'pourquoi');
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: winterA(t), haze: .06 }, { z: 1, svg: alb({ x: 300, y: 1500, s: 1.3, expr: 'cool', hat: 1, sleeve: '#5b4aa8' }, t) + kevin({ x: 790, y: 1500, s: 1.3, expr: 'suspicious', flip: 1, cap: '#e2463a', shirt: '#2f7a3f', armL: [190, 195] }, t) + scarf(790, 1500, 1.3) }, { z: .6, svg: fgA('snow', t) }]) +
      qBubble(760, 560, 'POURQUOI DES LUNETTES ?', t, Q - .1, '#fff', 36) + funTag(800, 410, 'KEVIN', t, at(18, 'kevin'), { size: 46, bg: '#5fb85f' }); },
  sfx: [[0, 'wind', .5], [at(18, 'kevin'), 'pop', .5], [at(18, 'pourquoi') - .1, 'pop', .6], [at(18, 'soleil'), 'hmm', .5]] });
// B019 — « on est en hiver » : gros plan Kevin emmitouflé, bonhomme de neige, HIVER givré
B(19, { enter: 'none', trans: 'up', transD: .2, cam: zin(1.04, 1.1),
  draw: (t, d, T) => blur(5, winterA(t)) + kevinHead(CX, 930, 220, { expr: 'smug', cap: '#e2463a', tilt: 6 }, t) + G(tr(CX, 930 + 220 * .95), path('M-170 -20Q0 40 170 -20L170 30Q0 90 -170 30Z', '#e2463a', 6)) + snowfall(t, 30, 9) +
    funTag(860, 640, '-2 °C', t, .05, { size: 50, bg: '#5ec4f0' }) + kword('HIVER', CX, 480, t, at(19, 'hiver') - .05, { size: 120, fill: '#d6f1ff' }),
  sfx: [[0, 'wind', .6], [.05, 'pop', .5], [at(19, 'hiver') - .05, 'boom', .5]] });
// B020 — le soleil n'a pas démissionné en décembre : lettre de démission du soleil… barrée
B(20, { enter: 'whip', cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const D = at(20, 'demissionne'), Dc = at(20, 'decembre');
    return winterA(t, { sun: G(tr(800, 330, .4), sun(0, 0, 1, t, 'happy')) }) + alb({ x: 300, y: 1500, s: 1.3, expr: 'smugger', hat: 1, face: { eyes: 'shades' }, armL: [200, 220] }, t) + kevin({ x: 830, y: 1500, s: 1.25, expr: 'jawdrop', flip: 1, cap: '#e2463a', shirt: '#2f7a3f' }, t) + scarf(830, 1500, 1.25) +
      card(340, 620, 300, 220, ftext(0, -40, 'LETTRE DE', { size: 30, fill: '#7a6a5a', stroke: 'none' }) + ftext(0, 10, 'DÉMISSION', { size: 42, fill: SX.ink, stroke: 'none' }) + ftext(0, 70, '— le Soleil', { size: 28, fill: '#7a6a5a', stroke: 'none', font: SX.marker }), t, D - .3, { ry: 0, thick: 8, r: -6 }) + cross(340, 620, .9, t, D + .2) +
      funTag(CX, 380, 'DÉCEMBRE', t, Dc - .05, { size: 56, bg: '#5ec4f0' }); },
  sfx: [[at(20, 'kevin'), 'hmm', .4], [at(20, 'demissionne') - .3, 'printer', .5], [at(20, 'demissionne') + .2, 'error_beep', .6], [at(20, 'decembre') - .05, 'pop', .6]] });
// B021 — à l'école, les questions commencent : cour, des « ? » poussent partout
B(21, { enter: 'none', trans: 'circle', transD: .3, ty: 1000, cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const Q = at(21, 'questions'); let qs = ''; [[200, 700], [880, 660], [340, 560], [760, 820], [520, 640], [120, 900], [960, 900]].forEach(([x, y], i) => qs += t > Q + i * .08 ? qmark(x, y, (.6 + .1 * Math.sin(t * 9 + i)) * eOutBack(seg(t, Q + i * .08, Q + i * .08 + .2)), [SX.acc2, '#fff', SX.acc][i % 3], (i - 3) * 8) : '');
    return depth({ zoom: 1, x: Math.sin(t) * 15 }, [{ z: 1.5, svg: schoolyard(t), haze: .08 }, { z: 1, svg: kid(1, { x: 140, y: 1470, s: 1.0, expr: 'wow', look: [1, 0] }, t) + alb({ x: CX, y: 1520, s: 1.3, expr: t > Q ? 'worried' : 'happy', walk: t < Q ? 3 : 0 }, t) + kid(2, { x: 930, y: 1470, s: 1.0, expr: 'confused', flip: 1 }, t) }, { z: .6, svg: fgLayer('school', t) }]) + qs +
      funTag(CX, 420, "L'ÉCOLE", t, at(21, 'ecole') - .1, { size: 58, bg: SX.cool }); },
  sfx: [[0, 'school_bell', .5], [at(21, 'ecole') - .1, 'pop', .6], [at(21, 'questions'), 'pop_hi', .5], [at(21, 'commencent'), 'pop_hi', .5], [at(21, 'commencent') + .2, 'hmm', .4]] });
// B022 — « c'est ta vraie couleur de cheveux ? » : une camarade, le héros répond « 100 % naturel »
B(22, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const C = at(22, 'cheveux'); return schoolyard(t) + kidHead(0, 260, 960, 170, { expr: 'wow', look: [1, -.4] }, t) + albHead(780, 930, 190, { expr: 'smug', look: [-1, 0] }, t) +
    qBubble(330, 560, 'VRAIE COULEUR ?', t, at(22, 'vraie') - .1, '#fff', 40) + markerCircle(780, 790, 210, 110, t, C - .05, { col: SX.acc2 }) + funTag(780, 1130, '100 % NATUREL', t, C - .2, { size: 42, bg: '#5fb85f', r: 4 }); },
  sfx: [[at(22, 'vraie') - .1, 'pop', .6], [at(22, 'cheveux') - .05, 'scratch', .5], [at(22, 'cheveux') + .1, 'ding', .6]] });
// B023 — « pourquoi t'es aussi blanc ? » : couloir, un élève compare avec une brique de lait
B(23, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const Bl = at(23, 'blanc'); return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: hallway(t), haze: .08 }, { z: 1, svg: kid(4, { x: 780, y: 1500, s: 1.3, expr: 'confused', flip: 1, armL: [210, 200], holdL: G(tr(0, -20, 1, 10) + ' scale(-1 1)', rect(-50, -130, 100, 140, '#fff', 8, 6) + path('M-50 -130L0 -170L50 -130Z', '#5ec4f0', 5) + ftext(0, -40, 'LAIT', { size: 30, fill: '#5b8fd8', stroke: 'none' })) }, t) + alb({ x: 300, y: 1500, s: 1.3, expr: t > Bl ? 'annoyed' : 'neutral' }, t) }, { z: .6, svg: fgLayer('hall', t) }]) +
    qBubble(760, 560, 'AUSSI BLANC ?', t, at(23, 'pourquoi') - .05, '#fff', 42) + (t > Bl + .1 ? markerText('…sérieux ?', 300, 820, t, Bl + .1, { size: 44, col: SX.acc2 }) : ''); },
  sfx: [[at(23, 'pourquoi') - .05, 'pop', .6], [at(23, 'blanc'), 'boing', .5], [at(23, 'blanc') + .1, 'scratch', .4]] });
// B024 — « t'as les yeux rouges comme les lapins ? » : Kevin en serre-tête lapin, un lapin surgit
B(24, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .4 }),
  draw: (t, d, T) => { const L = at(24, 'lapins'), R_ = at(24, 'rouges'), kb = eOutBack(seg(t, L - .2, L + .2));
    return classroomT(t) + kevin({ x: 720, y: 1500, s: 1.35, expr: 'mock', flip: 1, armL: [200, 160] }, t) + bunnyEars(720, 1106, 135, t) + alb({ x: 260, y: 1500, s: 1.25, expr: 'deadpan' }, t) +
      (kb > 0 ? G(tr(470, 1180, kb), ell(0, 0, 90, 70, '#fff', 6) + circ(0, -90, 60, '#fff', 6) + ell(-26, -180, 18, 60, '#fff', 5) + ell(26, -180, 18, 60, '#fff', 5) + circ(-20, -96, 10, '#e2463a', 0) + circ(20, -96, 10, '#e2463a', 0) + ell(0, -76, 8, 6, '#ff8fb1', 0)) : '') +
      funTag(CX, 400, 'YEUX ROUGES ?', t, R_ - .05, { size: 56, bg: '#e2463a' }) + funTag(470, 560, 'LAPIN', t, L, { size: 42, bg: '#fff', fg: SX.ink, r: 6 }); },
  sfx: [[at(24, 'evidemment'), 'hmm', .5], [at(24, 'rouges') - .05, 'pop', .6], [at(24, 'lapins') - .2, 'boing', .7], [at(24, 'lapins') + .2, 'rimshot', .5]] });
// B025 — « Non, Kevin. » : main qui stoppe, regard blasé
B(25, { enter: 'punch', cam: () => ({ z: 1.06 }),
  draw: (t, d, T) => classroomT(t) + albHead(CX - 120, 930, 210, { expr: 'annoyed', look: [1, 0] }, t) + G(tr(800, 1000, 1.1, -70 + 6 * Math.sin(t * 12)), hand(0, 0, .9, 0, HERO, ALB_SKIN)) + funTag(CX, 480, 'NON, KEVIN.', t, .02, { size: 76, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'thud', .7], [.05, 'pop', .6], [at(25, 'kevin'), 'scratch', .4]] });
// B026 — les albinos n'ont pas forcément les yeux rouges : nuancier d'iris, « débloqué » sur FORCÉMENT, le lapin repart
B(26, { enter: 'none', trans: 'zoom', transD: .25, cam: zin(1.02, 1.07),
  draw: (t, d, T) => { const F = at(26, 'forcement') - .05, cols = [['#8fc6ea', 'BLEU'], ['#b8c4cc', 'GRIS'], ['#c9a27a', 'NOISETTE'], ['#b9a6e0', 'VIOLET']];
    let sw_ = ''; cols.forEach(([c, n], i) => sw_ += card(180 + i * 240, 1085, 200, 170, circ(0, -20, 50, '#fff', 6) + circ(0, -20, 32, c, 5) + circ(0, -20, 12, OL, 0) + ftext(0, 62, n, { size: 26, fill: SX.ink, stroke: 'none' }), t, at(26, 'personnes') + i * .12, { ry: 0, thick: 8, r: (i - 1.5) * 5 }));
    return classroomT(t, '') + unlock(CX, 770, t, F, { part: 'back', r: 440 }) + albHead(CX, 770, 200, { expr: 'proud' }, t) + unlock(CX, 770, t, F, { part: 'front', r: 440 }) + sw_ +
      kword('PAS FORCÉMENT', CX, 400, t, F, { size: 84, fill: SX.acc2 }) + (t > at(26, 'rouges') ? funTag(CX, 510, 'ROUGES ✗', t, at(26, 'rouges'), { size: 44, bg: '#e2463a' }) : ''); },
  sfx: [[at(26, 'personnes'), 'pop_hi', .5], [at(26, 'personnes') + .24, 'pop_hi', .5], [at(26, 'forcement') - .05, 'boom', .5], [at(26, 'forcement'), 'sparkle', .7], [at(26, 'rouges'), 'error_beep', .4]] });
// B027 — pas contagieux : Kevin en combinaison anti-virus derrière une chaise… tampon PAS CONTAGIEUX
B(27, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(27, 'contagieux') && t < at(27, 'contagieux') + .25 ? 6 : 0 }),
  draw: (t, d, T) => { const C = at(27, 'contagieux');
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.4, svg: classroomT(t), haze: .08 }, { z: 1, svg: alb({ x: 300, y: 1500, s: 1.3, expr: t > C ? 'smug' : 'neutral' }, t) + kevin({ x: 800, y: 1500, s: 1.3, expr: t > C ? 'embarrassed' : 'scared', flip: 1, mask: 1, shirt: '#ffd23f', sleeve: '#ffd23f', tremble: 1, cap: '#ffd23f' }, t) }, { z: .6, svg: fgLayer('class', t) }]) +
      funTag(800, 440, 'KEVIN', t, .05, { size: 42, bg: '#5fb85f' }) + stamp(CX, 640, 'PAS CONTAGIEUX', t, C - .05, '#ffd23f', -8); },
  sfx: [[0, 'whoosh', .4], [at(27, 'albinisme'), 'squeak', .5], [at(27, 'contagieux') - .05, 'thud', .8], [at(27, 'contagieux') + .2, 'rimshot', .4]] });
// B028 — le plus épuisant, ce n'est pas toujours le soleil : batterie qui se vide, le soleil lève les mains « pas moi »
B(28, { enter: 'none', trans: 'wipe', cam: zin(1.0, 1.06, .4),
  draw: (t, d, T) => { const E = at(28, 'epuisant'), S = at(28, 'soleil'), bat = lerp(1, .04, seg(t, E - .2, E + 1.2));
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t) + SUNSET(.22) + G(tr(860, 340, .36), sun(0, 0, 1, t, 'happy')), haze: .06 }, { z: 1, svg: alb({ x: 380, y: 1500, s: 1.35, expr: bat < .3 ? 'dizzy' : 'worried', hat: 1, rot: -6 * seg(t, E, E + 1), armL: [110, 100], armR: [70, 80] }, t) }, { z: .6, svg: fgLayer('street', t) }]) +
      battery(380, 760, .9, bat, t) + kword('ÉPUISANT', CX, 470, t, E - .05, { size: 96, fill: SX.acc2 }) + funTag(860, 600, 'PAS MOI !', t, S - .05, { size: 40, bg: '#ffd23f', fg: SX.ink }); },
  sfx: [[at(28, 'epuisant') - .05, 'boom', .5], [at(28, 'epuisant') + .3, 'error_beep', .5], [at(28, 'toujours'), 'hmm', .4], [at(28, 'soleil') - .05, 'pop', .6]] });
// B029 — devoir expliquer ton apparence à des inconnus : le héros en conférencier, chevalet « ALBINISME 101 »
B(29, { enter: 'drop', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const X = at(29, 'expliquer'), I = at(29, 'inconnus');
    let crowd = ''; for (let i = 0; i < 3; i++) crowd += adult(i, { x: 640 + i * 170, y: 1560 + (i % 2) * 30, s: 1.0, expr: ['wow', 'confused', 'talk'][i], flip: 1, look: [-1, 0] }, t);
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t), haze: .1 }, { z: 1, svg: G(tr(330, 1250), line(-110, 0, -60, -560, 10, '#8a5a3a') + line(110, 0, 60, -560, 10, '#8a5a3a') + rect(-170, -620, 340, 300, '#fff', 12, 7) + ftext(0, -540, 'ALBINISME', { size: 40, fill: SX.acc, stroke: 'none' }) + ftext(0, -470, '101', { size: 64, fill: SX.ink, stroke: 'none' }) + path('M-120 -400L-40 -380L40 -420L120 -360', 'none', 6, '#5b8fd8')) + alb({ x: 170, y: 1470, s: 1.15, expr: 'talk', armR: [-50, -40] }, t) + crowd }]) +
      funTag(CX, 400, `EXPLICATION N°${counter(1, 347, t, X, 1.2)}`, t, X - .05, { size: 46, bg: SX.cool }) + funTag(810, 920, 'INCONNUS', t, I - .05, { size: 40, bg: '#fff', fg: SX.ink, r: 5 }); },
  sfx: [[at(29, 'devoir'), 'pop', .5], [at(29, 'expliquer'), 'slot', .5], [at(29, 'apparence'), 'tick', .5], [at(29, 'inconnus') - .05, 'pop', .6]] });
// B030 — qui pensent avoir le droit de poser toutes leurs questions : encerclé, bulles « ? » qui s'empilent
B(30, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.02, 1.12, t / d), hand: .5 }),
  draw: (t, d, T) => { const Q = at(30, 'questions'), Ps = at(30, 'pensent'), qs = ['TU VOIS BIEN ?', 'C\'EST NATUREL ?', 'TU BRONZES ?', 'TES PARENTS ?', 'ÇA SE SOIGNE ?', 'TU ES MALADE ?']; let s = '';
    qs.forEach((q, i) => { const a = -150 + i * 24, x = CX + Math.cos(R(a)) * 300 * (i % 2 ? 1 : .8) + (i - 2.5) * 20, y = 560 + (i % 3) * 140; s += qBubble(Math.min(860, Math.max(220, x)), y, q, t, Ps + i * .22, ['#fff', '#ffe9a6', '#d6f1ff'][i % 3], 32, (i % 2 ? 1 : -1) * 4); });
    let crowd = ''; for (let i = 0; i < 4; i++) crowd += adult(i, { x: [110, 970, 230, 850][i], y: 1500 + (i > 1 ? 40 : 0), s: 1.05, expr: ['talk', 'wow', 'confused', 'talk'][i], flip: i % 2, armR: [-30, -60] }, t);
    return streetT(t) + crowd + alb({ x: CX, y: 1530, s: 1.3, expr: t > Q - .3 ? 'dizzy' : 'worried' }, t) + s + funTag(CX, 380, `QUESTIONS : ${counter(1, 99, t, Ps, 2)}+`, t, Ps - .05, { size: 48, bg: SX.acc }); },
  sfx: [[at(30, 'pensent'), 'pop', .5], [at(30, 'droit'), 'pop', .5], [at(30, 'poser'), 'pop', .5], [at(30, 'toutes'), 'pop_hi', .6], [at(30, 'questions'), 'boing', .5]] });
// B031a — alors que toi, tu voulais juste… : soir, le héros rêve d'une baguette (bulle de pensée)
B(31, { enter: 'none', trans: 'up', transD: .25, cam: zin(1.0, 1.06, .4),
  draw: (t, d, T) => { const J = at(31, 'juste'); return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t) + SUNSET(.3), haze: .08 }, { z: 1, svg: alb({ x: 330, y: 1500, s: 1.35, expr: 'sad', hat: 1, look: [1, -1] }, t) }, { z: .6, svg: fgLayer('street', t) }]) +
    thoughtA(770, 640, 420, 280, aBaguette(0, 0, .9, -10) + sparkle(130, -80, .5, SX.acc2), seg(t, J - .3, J)) + funTag(330, 420, 'TOI', t, at(31, 'toi') - .05, { size: 50, bg: HERO }); },
  sfx: [[at(31, 'toi') - .05, 'pop', .5], [at(31, 'voulais'), 'hmm', .4], [at(31, 'juste') - .3, 'magic', .5]] });
// B031b — FIN : sortir acheter du pain… la boulangère : « c'est ta vraie couleur ? »
const O31 = off(31, 'sortir');
B(31, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(31, 'pain') - O31 && t < at(31, 'pain') - O31 + .3 ? 5 : 0 }),
  draw: (t, d, T) => { const P = at(31, 'pain') - O31, Q = P + .5;
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.4, svg: bakeryA(t), haze: .06 }, { z: 1, svg: adult(3, { x: 820, y: 1300, s: 1.0, expr: t > Q ? 'wow' : 'happy', flip: 1, cap: '#fff', look: [-1, 0] }, t) + alb({ x: 300, y: 1520, s: 1.3, expr: t > Q + .2 ? 'deadpan' : 'ecstatic', hat: 1, armR: [-50, -80], holdR: aBaguette(0, 0, .55, -60) }, t) }, { z: .6, svg: fgA('bakery', t) }]) +
      kword('DU PAIN.', CX, 420, t, P - .05, { size: 110, fill: SX.acc2 }) + qBubble(760, 600, "C'EST TA VRAIE COULEUR ?", t, Q, '#fff', 30) + popStars(300, 1000, t, P); },
  sfx: [[0, 'ring', .5], [at(31, 'acheter') - O31, 'steps', .5], [at(31, 'pain') - O31 - .05, 'tada', .7], [at(31, 'pain') - O31 + .5, 'pop', .6], [at(31, 'pain') - O31 + .8, 'rimshot', .6]] }, O31);

SCENES.sort((a, b) => a.s - b.s);
