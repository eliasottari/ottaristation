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
//  SIZEX fun : accent orange « petit dernier », jaune marqueur, turquoise
// ============================================================
sxFun('#ff7a2f'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';
const M = 700;

// ---------- le héros, Nino, le petit dernier : épi sur le crâne + t-shirt HÉRITÉ (délavé, rapiécé) ----------
const HAIR_N = '#7a4a2a', SHIRT_N = '#9cc0d6';
const epi = (r, col) => path(`M${f1(-r * .06)} ${f1(-r * .97)}Q${f1(-r * .04)} ${f1(-r * 1.38)} ${f1(r * .24)} ${f1(-r * 1.44)}Q${f1(r * .06)} ${f1(-r * 1.22)} ${f1(r * .14)} ${f1(-r * .95)}`, col, f1(r * .05));
const ninoHair = (r, t, o) => { const c = o.hairColor || HAIR_N; const [b, f] = hairSvg('short', c, r, t); return [b, f + epi(r, c)]; };
// pièce rapiécée (coutures en pointillés) — marque visuelle du vêtement hérité
const patchSvg = (x, y, c = '#ffb03a', r = -8, s = 1) => G(tr(x, y, s, r), rect(-27, -23, 54, 46, c, 8, 5) + `<rect x="-19" y="-15" width="38" height="30" rx="5" fill="none" stroke="${OL}" stroke-width="3" stroke-dasharray="6 5"/>`);
function nino(o, t) { const a = o.age || 'kid'; let s = person(Object.assign({ age: 'kid', hairFn: ninoHair, shirt: SHIRT_N, pants: '#5a6b4a', seed: 2 }, o), t);
  if (a !== 'baby' && o.patch !== false) s += G(ptr(o), patchSvg(a === 'adult' ? 36 : 30, a === 'adult' ? -235 : -122) + patchSvg(a === 'adult' ? -40 : -34, a === 'adult' ? -170 : -84, '#e86a8a', 10, .7));
  return s; }
const ninoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: ninoHair, seed: 2 }, o), t));
const bebe = (o, t) => person(Object.assign({ age: 'baby', hair: 'tuft', hairColor: HAIR_N, shirt: '#bfe3ff', seed: 2 }, o), t);
const bebeHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'tuft', hairColor: HAIR_N, seed: 2 }, o), t));

// ---------- les parents : cernes violets permanents (ils ont DÉJÀ élevé 4 enfants) ; o.old = 0→1 cheveux qui blanchissent ----------
const bags = r => path(`M${f1(-r * .54)} ${f1(r * .17)}Q${f1(-r * .34)} ${f1(r * .34)} ${f1(-r * .14)} ${f1(r * .17)}M${f1(r * .14)} ${f1(r * .17)}Q${f1(r * .34)} ${f1(r * .34)} ${f1(r * .54)} ${f1(r * .17)}`, 'none', f1(r * .05), '#9b6fa8');
const tiredHair = (style, col) => (r, t, o) => { const [b, f] = hairSvg(style, o.old ? mixC(col, '#e6e6ec', o.old) : col, r, t); return [b, f + (o.bags === false ? '' : bags(r))]; };
const MOM = { age: 'adult', hairFn: tiredHair('bun', '#6b3e26'), shirt: '#e86a8a', pants: '#4b3b6e', seed: 4, necklace: true };
const DAD = { age: 'adult', hairFn: tiredHair('side', '#3a2a20'), glasses: true, shirt: '#5b8fd8', pants: '#2f3b4e', seed: 8 };
const maman = (o, t) => person(Object.assign({}, MOM, { wrinkles: (o.old || 0) > .5 }, o), t);
const papa = (o, t) => person(Object.assign({}, DAD, { wrinkles: (o.old || 0) > .5 }, o), t);
const mamanHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, MOM, { wrinkles: (o.old || 0) > .5 }, o), t));
const papaHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, DAD, { wrinkles: (o.old || 0) > .5 }, o), t));

// ---------- les 4 grands : Hugo (23 ans, barbu), Léa, Max, Jade ----------
const SIBS = [
  { name: 'HUGO', age: 'adult', hair: 'short', hairColor: '#2b2420', beard: true, shirt: '#36a85a', pants: '#3b3f4a', seed: 11 },
  { name: 'LÉA', age: 'adult', hair: 'long', hairColor: '#c4521b', shirt: '#b56cff', pants: '#3b3b5e', seed: 12 },
  { name: 'MAX', age: 'adult', hair: 'curly', hairColor: '#1f1a18', shirt: '#ff9a4d', pants: '#2f3b4e', skin: '#e0b088', seed: 13 },
  { name: 'JADE', age: 'kid', hair: 'ponytail', hairColor: '#e0a040', shirt: '#ff8fb1', pants: '#4b5b7a', seed: 14 }];
const sib = (i, o, t) => person(Object.assign({}, SIBS[i], o), t);
const sibHead = (i, x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r }, SIBS[i], o), t));
const hugo = (o, t) => sib(0, o, t), hugoHead = (x, y, r, o, t) => sibHead(0, x, y, r, o, t);
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
  [['HUGO', 640], ['LÉA', 690], ['MAX', 740], ['JADE', 830], ['NINO', 1010]].forEach(([nm, y]) => { s += line(700, y, 740, y, 5) + ftext(746, y + 8, nm, { size: 20, fill: '#2b2420', stroke: 'none', anchor: 'start' }); });
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
// chambre du héros : t-shirts hérités en pile, fanion « HUGO » barré, posters, étagère, lit, tapis
function chambreH(t, o = {}) { const yb = 1250;
  let s = dWall('dot', '#d9f0d2', '#c4e6b9', yb) + dBase(yb, '#fff');
  s += dWindowView(60, 300, 260, 330, t) + dCurtain(0, 280, 90, 420, '#5b8fd8', t, 1) + dCurtain(290, 280, 90, 420, '#5b8fd8', t, -1);
  s += dPoster(480, 360, 150, 210, '#ff9a4d', -4, circ(0, -20, 40, '#fff', 4) + path('M-20 40L0 -10L20 40Z', '#e2463a', 4), t) + dPoster(660, 400, 130, 170, '#b56cff', 5, ftext(0, 10, '★', { size: 70, fill: '#ffd23f', stroke: 'none' }), t);
  s += G(tr(860, 300, 1, 6 + wave(t, .5, 2)), path('M-90 -40L120 0L-90 40Z', '#36a85a', 6) + ftext(-20, 12, 'HUGO', { size: 32, fill: '#fff', stroke: 'none' }) + line(-70, 2, 30, -2, 6, '#e2463a') + ftext(-10, -40, 'NINO', { size: 26, fill: '#e2463a', stroke: 'none', font: SX.marker }));
  s += wallClock(1010, 470, 46, t) + dShelf(720, 640, 330, dBooks(730, 640, 150, 7) + dTeddy(920, 640, .6) + dTrophy(1000, 640, .6)) + dOutlet(560, 1180);
  s += G(tr(900, yb), rect(-220, -230, 40, 230, '#b98552', 8, 6) + rect(-200, -110, 420, 90, '#b98552', 10, 6) + rect(-190, -150, 400, 60, '#fff', 20, 5) + path('M-120 -150Q60 -190 230 -150L230 -40L-120 -40Z', '#5b8fd8', 6) + ell(-150, -170, 60, 30, '#fff', 5));
  s += WASH() + dParquet(yb, '#c49a6c') + dRug(CX, 1480, 760, 160, '#5ec4f0', '#ffd23f');
  s += G(tr(170, 1320), [0, 1, 2, 3].map(i => path(`M${-90 + i * 8} ${-i * 34}L${90 - i * 6} ${-i * 34}L${84 - i * 6} ${-i * 34 - 30}L${-84 + i * 8} ${-i * 34 - 30}Z`, DPAL[i + 1], 4)).join('') + funTagS('DE HUGO', 0, -150));
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

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, la fratrie en cut-out (4 grands)… et toi, minuscule au bout, « débloqué » en étoiles sur DERNIER
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const D = at(1, 'dernier'); const fam = sib(0, { x: 160, y: 1290, s: .9, expr: 'smug' }, t) + sib(1, { x: 365, y: 1290, s: .82, expr: 'mock' }, t) + sib(2, { x: 560, y: 1290, s: .74, expr: 'laugh' }, t) + sib(3, { x: 735, y: 1290, s: .82, expr: 'smug' }, t);
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + cutout(fam, 12) + unlock(918, 1110, t, D, { part: 'back', r: 480 }) + G(tr(918, 1290, 1 + .04 * Math.sin(t * 7)), cutout(nino({ x: 0, y: 0, s: .6, expr: t > D ? 'shock' : 'worried', face: t > D ? { eyes: 'huge' } : {} }, t), 10)) + unlock(918, 1110, t, D, { part: 'front', r: 480 }) + funBox(918, 1120, 180, 250, t, D + .3, { label: 'dernier.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'ÊTRE LE", CX, 415, t, .3, { size: 58 }) + kword('DERNIER ?', CX, 540, t, D - .05, { size: 96, fill: SX.acc2 }) + funTag(CX, 660, 'DE LA FAMILLE', t, at(1, 'famille') - .05, { size: 46, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'dernier') - .05, 'boom', .6], [at(1, 'dernier'), 'sparkle', .6], [at(1, 'famille'), 'pop', .5]] });
// B002 — « Tu viens de naître » : papier + gobo, bébé en cut-out, BÉBÉ N°5
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => paper(SX.paper) + gobo(T, .12) + burst(CX, 900, 360, t, 0, '#ffe1b8', 18) + cutout(bebe({ x: CX, y: 1200, s: 1.75, expr: 'wow' }, t), 12) + popStars(CX, 820, t, .1, 7, 300) + funTag(CX, 470, 'BÉBÉ N°5', t, at(2, 'naitre') - .1, { size: 70, bg: SX.acc }),
  sfx: [[0, 'whoosh', .4], [.05, 'baby_coo', .7], [at(2, 'naitre') - .1, 'pop', .7], [.3, 'sparkle', .4]] });
// B003 — « Tes parents ont déjà élevé 4 enfants » : parents en cut-out (cernes violets), 4 cartes d'enfants qui tombent sur « 4 »
B(3, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1, 1.05, t / d) }),
  draw: (t, d, T) => { const F = at(3, '4'); let s = gridBg('#2a2440') + halftoneFade(SX.acc, .08, 1) + cutout(mamanHead(CX - 175, 760, 125, { expr: t > F ? 'dizzy' : 'deadpan' }, t) + papaHead(CX + 175, 760, 125, { expr: t > F ? 'dizzy' : 'deadpan' }, t), 12);
    for (let i = 0; i < 4; i++) s += card(165 + i * 250, 1040, 190, 200, sibHead(i, 0, 18, 64, { expr: ['smug', 'mock', 'laugh', 'joy'][i] }, t), t, F - .25 + i * .09, { ry: 0, thick: 8, r: (i - 1.5) * 7, bw: 6 });
    return s + kthin('ont déjà élevé', CX, 400, t, at(3, 'eleve') - .1, { size: 54 }) + kword('4 ENFANTS', CX, 520, t, F - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[at(3, 'eleve') - .1, 'pop_hi', .4], [at(3, '4') - .25, 'pop', .5], [at(3, '4') - .16, 'pop', .5], [at(3, '4') - .05, 'boom', .6], [at(3, '4') + .02, 'pop', .5], [at(3, 'enfants'), 'gasp', .4]] });
// B004a — couches + nuits blanches : chambre de bébé la nuit, pluie de couches, parents zombies
B(4, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .7, r: -3 }),
  draw: (t, d, T) => { const C = at(4, 'couches'), N = at(4, 'nuits'); return depth({ zoom: 1, x: wave(t, .3, 14) }, [{ z: 1.5, svg: nurseryN(t), haze: .06, hazeCol: '#2a3170' }, { z: 1, svg: maman({ x: 290, y: 1580, s: 1.2, expr: t > N ? 'dizzy' : 'sleep', armL: [140, 120], armR: [40, 60], headTilt: 10 }, t) + papa({ x: 780, y: 1580, s: 1.2, expr: t > N ? 'dizzy' : 'dead', armR: [-30, -60], holdR: diaper(0, 0, 1, 20), headTilt: -8 }, t) }]) + diaperRain(t, C) +
      funTag(CX, 450, `COUCHES : ${counter(0, 12000, t, C, .6)}`, t, C - .05, { size: 50, bg: '#fff', fg: SX.ink }) + funTag(CX, 580, 'NUITS BLANCHES', t, N - .05, { size: 54, bg: '#8a6ad8' }); },
  sfx: [[0, 'whoosh', .5], [at(4, 'couches') - .05, 'pop', .6], [at(4, 'couches') + .1, 'slot', .4], [at(4, 'nuits') - .05, 'clock_fast', .5], [at(4, 'blanches'), 'ghost', .4]] });
// B004b — crises + mensonges : salon, Jade en pleine crise, Max nez qui pousse (vase cassé)
B(4, { enter: 'punch', cam: (t, d) => ({ z: 1.05, hand: .5, shake: t < .3 ? 6 : 0 }),
  draw: (t, d, T) => { const o4 = at(4, 'crises') - .15, Mn = at(4, 'mensonges') - o4, nose = eOutBack(seg(t, Mn, Mn + .5)) * 210;
    return salonF(t) + sib(3, { x: 270, y: 1520, s: 1.25, expr: 'rage', face: { steamHead: 1 }, armL: [200 + wave(t, 4, 30), 230], armR: [-20 - wave(t, 4, 30), -60], legL: [100 + wave(t, 4, 20), 90], rot: wave(t, 4, 4) }, t) + sweatSpray(270, 1080, t, 4) +
      sib(2, { x: 800, y: 1540, s: 1.05, expr: 'mock', flip: 1, armR: [60, 30] }, t) + G(tr(800 - 20, 1540 - 402 * 1.05 + 20), path(`M0 -10L${-nose} 0L0 14Z`, '#e0b088', 6)) + G(tr(700, 1250), path('M-50 0L-30 -50L0 -30Z', '#5ec4f0', 5) + path('M10 0L30 -60L50 0Z', '#5ec4f0', 5)) +
      funTag(270, 520, 'CRISES', t, .05, { size: 64, bg: '#e2463a' }) + funTag(790, 620, 'MENSONGES', t, Mn - .05, { size: 56, bg: SX.cool }) + markerText("c'est pas moi", 760, 800, t, Mn + .2, { size: 40, col: '#fff' }); },
  sfx: [[0, 'growl', .5], [.05, 'thud', .7], [.2, 'pop', .5], [at(4, 'mensonges') - at(4, 'crises') + .1, 'squeak', .6], [at(4, 'mensonges') - at(4, 'crises') + .4, 'boing', .5]] }, at(4, 'crises') - .15);
// B005a — « Bref, tu viens d'arriver dans une famille » : la porte s'ouvre, maman rentre avec le bébé, fratrie blasée
B(5, { enter: 'whip', cam: zin(1.0, 1.08, .4),
  draw: (t, d, T) => { const A = at(5, 'arriver'); return entree(t, { open: eOutCubic(seg(t, 0, .4)) }) + hugo({ x: 150, y: 1560, s: 1.0, expr: 'deadpan', armL: [60, 150], armR: [120, 30] }, t) + sib(3, { x: 330, y: 1530, s: 1.1, expr: 'deadpan' }, t) +
      maman({ x: 560, y: 1580, s: 1.15, expr: 'sleep', armL: [80, 20], armR: [100, 160] }, t) + bebe({ x: 665, y: 1250, s: .55, expr: 'joy' }, t) + sib(2, { x: 880, y: 1560, s: 1.0, expr: 'deadpan', flip: 1, armR: [-40, -100], holdR: rect(-30, -50, 60, 100, '#2b2b33', 12, 5) }, t) +
      funTag(CX, 450, 'ARRIVÉE N°5', t, A - .05, { size: 60, bg: SX.acc }) + markerText('clap… clap.', 230, 760, t, at(5, 'famille') - .1, { size: 46, col: '#fff' }); },
  sfx: [[0, 'steps', .6], [at(5, 'arriver') - .1, 'ding', .6], [at(5, 'arriver') - .05, 'pop', .5], [at(5, 'famille'), 'crickets', .6]] });
// B005b — « où plus personne ne tombe dans tes pièges » : peau de banane du bébé, papa l'enjambe sans lever les yeux du journal
B(5, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const o = at(5, 'ou') - .15, Tb = at(5, 'tombe') - o, P = at(5, 'pieges') - o, px = lerp(1000, 430, eInOut(seg(t, .1, P + .1))), up = seg(t, Tb - .2, Tb) * (1 - seg(t, Tb + .25, Tb + .45));
    return salonF(t) + bananaPeel(560, 1440, 1.2) + markerCircle(560, 1430, 140, 60, t, .15, { col: SX.acc2 }) + funTag(560, 1250, 'PIÈGE', t, .15, { size: 40, bg: SX.acc2, fg: SX.ink }) + bebe({ x: 190, y: 1420, s: 1.05, expr: t > P ? 'rage' : 'smugger' }, t) +
      papa({ x: px, y: 1580, s: 1.2, expr: 'deadpan', flip: 1, walk: 3, legL: [95 - up * 70, 90 + up * 30], armL: [70, -10], armR: [110, -170], look: [0, .6] }, t) + G(tr(px - 40, 1580 - 225 * 1.2, 1, -6), rect(-110, -70, 220, 150, '#f4f1ea', 4, 5) + [0, 1, 2, 3].map(i => line(-90, -40 + i * 30, 90, -40 + i * 30, 5, '#9aa3ad')).join('') + ftext(0, -46, 'JOURNAL', { size: 24, fill: OL, stroke: 'none' })) +
      stamp(CX, 520, 'ÉCHEC', t, P, '#e2463a', -8, 90); },
  sfx: [[.15, 'scratch', .4], [at(5, 'personne') - at(5, 'ou'), 'steps', .6], [at(5, 'tombe') - at(5, 'ou') - .1, 'whoosh', .5], [at(5, 'pieges') - at(5, 'ou') + .15, 'thud', .8], [at(5, 'pieges') - at(5, 'ou') + .3, 'rimshot', .5]] }, at(5, 'ou') - .15);
// B006 — « Bienvenue dans la vie du petit dernier » : banderole recyclée « BIENVENUE HUGO » (barré, NINO ? au marqueur)
B(6, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const Pd = at(6, 'petit'); return salonF(t) + G(tr(CX, 420, 1, -2 + wave(t, .5, 1)), path('M-470 -60Q0 -30 470 -60L470 60Q0 90 -470 60Z', '#fff8e0', 7) + [-400, -200, 0, 200, 400].map((x, i) => circ(x, -50, 10, DPAL[i], 4)).join('') + ftext(-120, 24, 'BIENVENUE', { size: 64, fill: '#e2463a', stroke: 'none' }) + ftext(270, 24, 'HUGO', { size: 64, fill: '#5b8fd8', stroke: 'none' })) +
      (t > .5 ? G(tr(CX + 270, 420), path(`M-110 0L${f1(-110 + 220 * seg(t, .5, .75))} -6`, 'none', 14, '#2b2420')) : '') + markerText('NINO ?', CX + 290, 530, t, .8, { size: 54, col: SX.acc }) +
      maman({ x: 420, y: 1600, s: 1.25, expr: 'deadpan', armL: [70, 10], armR: [110, 170] }, t) + bebe({ x: 575, y: 1265, s: .6, expr: 'wow' }, t) + papa({ x: 800, y: 1610, s: 1.2, expr: 'sleep', flip: 1, armR: [-50, -110], holdR: dMug(0, 0, 1, t, '#fff') }, t) +
      kword('PETIT DERNIER', CX, 690, t, Pd - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'pop', .5], [.5, 'scratch', .6], [.8, 'scratch', .5], [at(6, 'petit') - .05, 'boom', .5], [at(6, 'dernier'), 'baby_coo', .5]] });
// B007 — « À 5 ans, tu veux un nouveau vélo » : collé à la vitrine du magasin, yeux en cœur
B(7, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => depth({ zoom: 1, x: wave(t, .2, 20) }, [{ z: 1.4, svg: shopFront(t), haze: .05 }, { z: 1, svg: nino({ x: 250, y: 1470, s: 1.15, expr: 'love', look: [1, -.3], armR: [-20, -40], armL: [-30, -50] }, t) + heartsUp(t, 250, 1050, 4, 300) }]) +
    funTag(250, 640, '5 ANS', t, at(7, '5') - .05, { size: 70, bg: SX.acc }) + funTag(760, 640, 'NOUVEAU !', t, at(7, 'velo') - .05, { size: 50, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'whoosh', .6], [at(7, '5') - .05, 'pop', .6], [at(7, 'nouveau'), 'glint', .6], [at(7, 'velo') - .05, 'sparkle', .6], [at(7, 'velo') + .3, 'kiss', .4]] });
// B008 — « Ta mère te répond : prends celui de ton frère » : cuisine, maman café à la main, PRENDS en slam
B(8, { enter: 'drop', cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const Pr = at(8, 'prends'); return cuisine(t) + nino({ x: 290, y: 1510, s: 1.15, expr: t > Pr ? 'confused' : 'love', look: [1, -.3] }, t) + maman({ x: 760, y: 1580, s: 1.25, expr: 'deadpan', flip: 1, armR: [-10, -50], holdR: dMug(0, 0, 1, t, '#fff'), armL: [130, 200] }, t) +
      kword('PRENDS', CX, 440, t, Pr - .05, { size: 110, fill: '#fff' }) + funTag(CX, 570, 'CELUI DE TON FRÈRE', t, at(8, 'frere') - .1, { size: 46, bg: SX.acc }) + (t > Pr ? markerText('?!', 300, 860, t, Pr + .2, { size: 70, col: SX.acc2 }) : ''); },
  sfx: [[0, 'whoosh', .5], [at(8, 'repond'), 'hmm', .5], [at(8, 'prends') - .05, 'boom', .6], [at(8, 'frere') - .1, 'pop', .6]] });
// B009 — « Sauf que ton frère a 23 ans » : contre-plongée sur Hugo, géant barbu, 23 ANS
B(9, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(clamp(t / .5))), cy: 900, hand: .3 }),
  draw: (t, d, T) => { const V = at(9, '23'); return entree(t) + hugo({ x: 720, y: 1660, s: 1.48, expr: 'chill', flip: 1, armR: [-30, -70], holdR: dMug(0, 0, 1, t, '#36a85a') }, t) + nino({ x: 240, y: 1440, s: 1.0, expr: t > V ? 'jawdrop' : 'worried', look: [1, -1] }, t) +
      kword('23 ANS', 690, 430, t, V - .05, { size: 120, fill: SX.acc2 }) + markerArrow(440, 470, 300, 900, t, V + .2, { bend: -60, col: '#fff' }) + funTag(300, 640, 'toi : 5', t, V + .35, { size: 40, bg: SX.cool }); },
  sfx: [[0, 'thud', .7], [at(9, 'frere', 2), 'steps', .5], [at(9, '23') - .05, 'boom', .6], [at(9, '23') + .2, 'gasp', .6], [at(9, 'ans'), 'scratch', .4]] });
// B010 — « Et son vélo ressemble à une pièce de musée » : galerie, vélo rouillé sous cloche/spot, cartel, toiles d'araignée
B(10, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => galleryT(t) + op(.5, glow(620, 900, 340, '#fff6c8', .7)) + G(tr(620, 1260), rect(-200, -150, 400, 150, '#f4f1ea', 6, 6) + rect(-220, -170, 440, 26, '#e0d4c0', 6, 5)) + bikeOld(620, 1110, 1.5, t) + line(350, 1180, 890, 1180, 10, '#b8253a') +
    G(tr(620, 1180), rect(-170, -18, 340, 50, '#fff8e0', 6, 4) + ftext(0, 20, 'VÉLO DE HUGO — 2009', { size: 24, fill: '#7a5a3a', stroke: 'none' })) + nino({ x: 200, y: 1480, s: 1.1, expr: 'deadpan', look: [1, 0] }, t) +
    kword('PIÈCE DE MUSÉE', CX, 440, t, at(10, 'musee') - .35, { size: 84, fill: SX.acc2 }) + funTag(860, 620, 'ANTIQUITÉ', t, at(10, 'ressemble'), { size: 40, bg: '#8a6ad8' }),
  sfx: [[0, 'whoosh', .5], [at(10, 'velo'), 'squeak', .5], [at(10, 'ressemble'), 'pop', .5], [at(10, 'musee') - .35, 'boom', .5], [at(10, 'musee'), 'ghost', .4]] });
// B011 — « À 10 ans, tu demandes une PlayStation » : chambre, mains jointes, bulle de rêve (console neuve qui brille)
B(11, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const P = at(11, 'playstation'); return chambreH(t) + nino({ x: 300, y: 1530, s: 1.3, expr: 'love', armL: [-60, -110], armR: [-120, -70], look: [1, -.6] }, t) +
      (t > .3 ? bubble(720, 790, 480, 400, consoleNew(0, 60, .8, t) + padOld(130, 40, .5, -10).replace('#2b2c33', '#fff'), eOutBack(seg(t, .3, .7))) : '') + funTag(300, 520, '10 ANS', t, at(11, '10') - .05, { size: 64, bg: SX.acc }) + popStars(720, 700, t, P, 6, 220); },
  sfx: [[0, 'whoosh', .5], [at(11, '10') - .05, 'pop', .6], [.3, 'magic', .5], [at(11, 'playstation'), 'sparkle', .7]] });
// B012 — « Mais on en a déjà une ! » : papa fier, montre la vieille télé cathodique
B(12, { enter: 'none', trans: 'push', transD: .2, cam: () => ({ z: 1.05, hand: .4 }),
  draw: (t, d, T) => salonF(t, { noSofa: 1 }) + crtTV(300, 1330, 1.05, t, 1) + papa({ x: 760, y: 1590, s: 1.25, expr: 'smugger', flip: 1, armL: [175, 180], armR: [60, 20] }, t) + motionLines(560, 1000, 3, 50, 0) +
    funTag(CX, 460, 'ON EN A DÉJÀ UNE !', t, at(12, 'deja') - .1, { size: 48, bg: SX.acc2, fg: SX.ink }) + sparkle(300, 900, .5 + .2 * Math.sin(t * 9), '#fff'),
  sfx: [[0, 'pop', .4], [at(12, 'deja') - .1, 'boing', .6], [at(12, 'une'), 'ding', .5]] });
// B013 — « Oui, une PlayStation 2 » : insert sur la console poussiéreuse, toile d'araignée, « 2 » géant
B(13, { enter: 'none', trans: 'glitch', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.14, t / d), hand: .2 }),
  draw: (t, d, T) => { const D2 = at(13, '2'); return depth({ zoom: 1 }, [{ z: 1.6, svg: chambreH(t), blur: 8 }, { z: 1, svg: G(tr(CX, 1080, 3.2), ps2(0, 0, 1)) + G(tr(CX + 300, 1150, 2.2, -12), padOld(0, 0, 1)) + path('M420 910Q500 880 560 940M300 960Q380 900 470 920', 'none', 3, 'rgba(255,255,255,.8)') + Array.from({ length: 14 }, (_, i) => op(.6, circ((i * 97 + t * 30) % 1000 + 40, 700 + (i * 61) % 400 - t * 40, 5, '#e8e0d0', 0))).join('') }]) +
      funTag(300, 470, 'OUI…', t, at(13, 'oui') - .05, { size: 56, bg: '#fff', fg: SX.ink }) + kword('2', 760, 640, t, D2 - .05, { size: 260, fill: SX.acc2 }) + funTag(760, 790, '(2000)', t, D2 + .25, { size: 40, bg: SX.cool }); },
  sfx: [[0, 'zap', .4], [at(13, 'oui'), 'hmm', .5], [at(13, '2') - .05, 'boom', .7], [at(13, '2') + .25, 'crickets', .5]] });
// B014 — « On est en 2026, maman » : ado en rage, brandit un calendrier 2026, maman hausse les épaules
B(14, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.06, shake: t > at(14, '2026') && t < at(14, '2026') + .3 ? 8 : 0 }),
  draw: (t, d, T) => { const Y = at(14, '2026'), k = pop(t, Y - .1, .35); return salonF(t) + nino({ x: 300, y: 1540, s: 1.3, expr: 'rage', face: { steamHead: 1 }, armL: [-110, -90], armR: [-70, -90] }, t) + maman({ x: 790, y: 1590, s: 1.22, expr: 'deadpan', flip: 1, armL: [150, 250], armR: [30, -70] }, t) +
      (k > 0 ? G(tr(330, 640, k, -6), rect(-210, -150, 420, 300, '#fff', 18, 7) + rect(-210, -150, 420, 70, '#e2463a', 18, 7) + circ(-120, -150, 12, OL, 0) + circ(120, -150, 12, OL, 0) + ftext(0, 70, '2026', { size: 130, fill: OL, stroke: 'none' })) : '') +
      funTag(790, 560, 'MAMAN !', t, at(14, 'maman') - .05, { size: 56, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .5], [at(14, '2026') - .1, 'flash_hit', .7], [at(14, '2026'), 'thud', .6], [at(14, 'maman') - .05, 'boing', .6]] });
// B015 — « À 14 ans, tu veux sortir avec tes amis » : entrée, le soir, porte entrouverte, les potes attendent dehors
B(15, { enter: 'whip', cam: zin(1.0, 1.08, .4),
  draw: (t, d, T) => entree(t, { open: .75, friends: 1, night: 1 }) + nino({ x: 260, y: 1530, s: 1.45, expr: 'ecstatic', armR: [-30, -20], armL: [200, 240] }, t) +
    funTag(260, 480, '14 ANS', t, at(15, '14') - .05, { size: 64, bg: SX.acc }) + funTag(760, 470, 'SORTIR !', t, at(15, 'sortir') - .05, { size: 56, bg: SX.acc2, fg: SX.ink }) + popStars(600, 900, t, at(15, 'amis'), 6, 160),
  sfx: [[0, 'whoosh', .5], [at(15, '14') - .05, 'pop', .6], [at(15, 'sortir') - .05, 'whistle', .5], [at(15, 'amis'), 'chirp', .5]] });
// B016 — « Ton grand frère intervient » : Hugo tombe du ciel devant la porte, bras croisés, lunettes noires
B(16, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.06, shake: t > .22 && t < .5 ? 10 : 0 }),
  draw: (t, d, T) => { const k = eOutCubic(seg(t, 0, .22)); return entree(t, { open: .75, night: 1 }) + burst(560, 950, 360, t, .2, SX.acc2, 16) + hugo({ x: 560, y: lerp(700, 1660, k), s: 1.42, expr: 'cool', armL: [60, 150], armR: [120, 30] }, t) + (t > .22 ? impactStar(560, 1600, 1.4) : '') + nino({ x: 160, y: 1540, s: 1.3, expr: 'shock', rot: -8 }, t) +
      funTag(560, 440, 'GRAND FRÈRE', t, .2, { size: 64, bg: '#36a85a' }); },
  sfx: [[0, 'whoosh', .7], [.22, 'thud', .9], [.25, 'boom', .5], [at(16, 'intervient'), 'siren', .4]] });
// B017 — « Moi, à ton âge, je rentrais à 18h » : Hugo nostalgique, souvenir déchiré en noir & blanc, 18H qui claque
B(17, { enter: 'none', trans: 'zoom', transD: .25, cam: zin(1.0, 1.08, .2),
  draw: (t, d, T) => { const H18 = at(17, '18'), mem = filmBW(entree(t, { open: 0 }) + hugo({ x: 720, y: 820, s: .8, expr: 'proud', age: 'kid', beard: false }, t) + bigClockF(390, 620, '18:00', '#fff', .75), T);
    return depth({ zoom: 1 }, [{ z: 1.6, svg: entree(t, { night: 1 }), blur: 7 }, { z: 1, svg: hugo({ x: CX, y: 1830, s: 2.05, expr: 'calm', look: [.5, -1] }, t) }]) + tornWindow(CX, 630, 640, 320, mem, seg(t, at(17, 'age') - .3, at(17, 'age') + .2)) +
      kthin('moi, à ton âge…', CX, 410, t, at(17, 'moi') - .05, { size: 52 }) + kword('18H', 820, 760, t, H18 - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[at(17, 'moi'), 'rewind', .5], [at(17, 'age') - .3, 'flutter', .5], [at(17, 'rentrais'), 'tick', .4], [at(17, '18') - .05, 'ding', .7]] });
// B018 — « Mais personne t'a demandé, toi ! » : l'ado pointe Hugo, Hugo mâchoire au sol
B(18, { enter: 'punch', cam: (t, d) => ({ z: 1.07, hand: .6, shake: t > at(18, 'toi') ? 6 : 0 }),
  draw: (t, d, T) => { const Ti = at(18, 'toi'); return entree(t, { night: 1 }) + nino({ x: 290, y: 1540, s: 1.45, expr: 'rage', armR: [-5, -5], face: { steamHead: 1 } }, t) + hugo({ x: 820, y: 1640, s: 1.35, expr: t > Ti ? 'jawdrop' : 'shock', flip: 1, rot: t > Ti ? 8 : 0 }, t) +
      funTag(CX, 450, "PERSONNE T'A DEMANDÉ", t, at(18, 'personne') - .05, { size: 44, bg: SX.acc }) + burst(800, 650, 150, t, Ti - .05, SX.acc2, 12) + kword('TOI !', 800, 680, t, Ti - .05, { size: 90, fill: '#fff', puff: false }); },
  sfx: [[0, 'whoosh', .5], [at(18, 'personne') - .05, 'pop', .6], [at(18, 'toi') - .05, 'boom', .6], [at(18, 'toi') + .1, 'gasp', .6]] });
// B019a — « Et le pire, tes frères et sœurs ont déjà… » : la fratrie médaillée, vétérans de l'excuse
B(19, { enter: 'whip', cam: zin(1.0, 1.07, .3),
  draw: (t, d, T) => { const P = at(19, 'pire'), F = at(19, 'freres'); return cuisine(t) + [[0, 160, 1500, 1.0], [1, 395, 1500, .96], [2, 630, 1500, .96], [3, 875, 1440, 1.25]].map(([i, x, y, s]) => sib(i, { x, y, s, expr: 'smugger', armL: [60, 150], armR: [120, 30] }, t) + nMedal(x + 22 * s, y - (i === 3 ? 160 : 260) * s, s * 1.1)).join('') +
      kword('LE PIRE', CX, 450, t, P - .05, { size: 110, fill: SX.acc2 }) + funTag(CX, 590, 'VÉTÉRANS', t, F - .05, { size: 50, bg: SX.cool }); },
  sfx: [[at(19, 'pire') - .05, 'boom', .6], [at(19, 'freres') - .05, 'drum', .6], [at(19, 'deja'), 'glint', .5], [at(19, 'deja') + .1, 'tada', .4]] });
// B019b — « …testé toutes les excuses possibles » : registre géant des excuses, tout est TESTÉ ✓
B(19, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const ex = ['Je dors chez un pote', "C'est pour l'école", 'Plus de batterie', 'Le bus est parti', 'Tout le monde y va', 'Le chien a mangé…'], o = at(19, 'teste') - .15, Tt = at(19, 'toutes') - o;
    let inner = ftext(0, -270, 'REGISTRE DES EXCUSES', { size: 38, fill: SX.acc, stroke: 'none' }) + line(-320, -240, 320, -240, 5);
    ex.forEach((e, i) => { const t0 = .1 + i * .16; if (t > t0) inner += ftext(-300, -180 + i * 74, e, { size: 34, fill: OL, stroke: 'none', anchor: 'start' }) + (t > t0 + .08 ? G(tr(250, -192 + i * 74, pop(t, t0 + .08, .25), -8), rect(-62, -22, 124, 44, 'none', 8, 5, '#36a85a') + ftext(0, 12, 'TESTÉ', { size: 24, fill: '#36a85a', stroke: 'none' })) : ''); });
    return depth({ zoom: 1 }, [{ z: 1.5, svg: cuisine(t), blur: 7 }]) + card(CX, 820, 760, 640, inner, t, 0, { ry: lerp(14, 0, seg(t, 0, .4)), bg: '#fffdf4' }) + kword('TOUTES', CX, 420, t, Tt - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'printer', .4], [.26, 'tick', .5], [.42, 'tick', .5], [.58, 'tick', .5], [.74, 'tick', .5], [at(19, 'toutes') - at(19, 'teste') + .1, 'boom', .5], [at(19, 'possibles') - at(19, 'teste') + .15, 'kaching', .5]] }, at(19, 'teste') - .15);
// B020 — « Je dors chez Kevin. Refusé. » : oreiller sous le bras, Kevin qui fait coucou à la fenêtre, maman tamponne
B(20, { enter: 'drop', cam: (t, d) => ({ z: 1.05, hand: .3, shake: t > at(20, 'refus') && t < at(20, 'refus') + .25 ? 7 : 0 }),
  draw: (t, d, T) => { const Rf = at(20, 'refus'); return cuisine(t) + kevinHead(875, 520, 70, { expr: 'joy' }, t) + G(tr(875 + 70, 560, 1, wave(t, 3, 20)), circ(0, 0, 22, '#f2c9a0', 5)) +
      nino({ x: 290, y: 1540, s: 1.4, expr: t > Rf ? 'shock' : 'smug', armL: [120, 60], armR: [70, 120], holdL: rect(-70, -40, 140, 80, '#fff', 30, 5) }, t) + maman({ x: 780, y: 1590, s: 1.22, expr: 'deadpan', flip: 1, armR: [-60 + seg(t, Rf - .2, Rf) * 80, -60 + seg(t, Rf - .2, Rf) * 80] }, t) +
      funTag(290, 560, 'CHEZ KEVIN', t, at(20, 'kevin') - .1, { size: 50, bg: '#5fb85f' }) + stamp(640, 780, 'REFUSÉ', t, Rf, '#e2463a', -12, 96); },
  sfx: [[at(20, 'dors'), 'pop', .4], [at(20, 'kevin') - .1, 'pop', .6], [at(20, 'refus'), 'hammer', .9], [at(20, 'refus') + .05, 'error_beep', .5]] });
// B021 — « C'est pour un exposé. Refusé. » : affiche EXPOSÉ… chapeau de fête mal caché, papa tamponne
B(21, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: 1.06, hand: .3, shake: t > at(21, 'refus', 2) && t < at(21, 'refus', 2) + .25 ? 7 : 0 }),
  draw: (t, d, T) => { const Rf = at(21, 'refus', 2); return cuisine(t) + nino({ x: 300, y: 1540, s: 1.4, expr: t > Rf ? 'sob' : 'smug', armL: [-40, -60], armR: [-140, -120] }, t) + G(tr(300, 1540 - 292 * 1.4 - 130, 1, 10), path('M-50 0L0 -110L50 0Z', '#ff8fb1', 5) + circ(0, -114, 14, '#ffd23f', 4) + circ(-10, -40, 8, '#5ec4f0', 0)) +
      G(tr(300, 700, pop(t, at(21, 'expose') - .1, .3), -4), rect(-170, -100, 340, 200, '#fff', 12, 6) + ftext(0, -20, 'EXPOSÉ', { size: 60, fill: '#5b8fd8', stroke: 'none' }) + ftext(0, 50, '(sérieux)', { size: 32, fill: '#9aa3ad', stroke: 'none' })) +
      papa({ x: 800, y: 1600, s: 1.22, expr: 'deadpan', flip: 1, armR: [-60 + seg(t, Rf - .2, Rf) * 80, -60 + seg(t, Rf - .2, Rf) * 80] }, t) + stamp(660, 880, 'REFUSÉ', t, Rf, '#e2463a', 10, 96); },
  sfx: [[at(21, 'expose') - .1, 'pop', .6], [at(21, 'refus', 2), 'hammer', .9], [at(21, 'refus', 2) + .1, 'rimshot', .5]] });
// B022 — « Tout le monde a le droit » : bras écartés, carte « tout le monde » pleine de copains contents
B(22, { enter: 'punch', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const Mo = at(22, 'monde'); let crowd = ''; for (let i = 0; i < 6; i++) crowd += G(tr(-250 + i * 100, 30 + (i % 2) * 30), head({ hr: 46, hair: KH[i], hairColor: KC[i], skin: SK[i], expr: 'joy', seed: 30 + i }, t));
    return cuisine(t) + card(CX, 680, 680, 300, crowd + ftext(0, -100, 'TOUT LE MONDE', { size: 40, fill: SX.acc, stroke: 'none' }), t, Mo - .15, { ry: 0, thick: 10, r: -3, bg: '#fffdf4' }) +
      nino({ x: CX, y: 1560, s: 1.4, expr: 'panic', armL: [200, 230], armR: [-20, -50] }, t) + sweatSpray(CX, 1080, t, 4) + funTag(CX, 450, 'A LE DROIT !', t, at(22, 'droit') - .1, { size: 56, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [at(22, 'monde') - .15, 'pop', .6], [at(22, 'droit') - .1, 'boing', .6], [at(22, 'droit') + .2, 'hmm', .4]] });
// B023 — « Refusé avant même la fin de ta phrase » : la bulle est coupée net par le tampon, record 0,2 s
B(23, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.08, shake: t < .3 ? 10 : 0 }),
  draw: (t, d, T) => cuisine(t) + nino({ x: 330, y: 1560, s: 1.4, expr: 'jawdrop' }, t) + chatBubble(400, 800, 520, 150, 'Mais tout le mo—', t, 0, true, 50) + stamp(560, 820, 'REFUSÉ', t, .02, '#e2463a', -14, 120) +
    papa({ x: 860, y: 1600, s: 1.2, expr: 'deadpan', flip: 1 }, t) + funTag(CX, 450, 'RECORD : 0,2 s', t, at(23, 'fin') - .1, { size: 52, bg: SX.cool }) + markerArrow(780, 520, 640, 720, t, at(23, 'phrase') - .1, { bend: 40, col: SX.acc2 }),
  sfx: [[0, 'hammer', .9], [.03, 'flash_hit', .6], [at(23, 'fin') - .1, 'pop', .6], [at(23, 'phrase'), 'ding', .5]] });
// B024 — « Tes parents connaissent les mensonges par cœur » : karaoké au salon, les parents chantent les excuses en duo
B(24, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pc = at(24, 'par') + .25, ly = ['Je dors chez Kevin…', "C'est pour un exposé…", 'Tout le monde a le droit…'], hi = clamp(t / d);
    let scr = rect(150, 480, 780, 380, '#151a3a', 20, 8) + rect(150, 480, 780, 380, 'none', 20, 8);
    ly.forEach((l, i) => { const k = clamp(hi * 3 - i); scr += ftext(540, 590 + i * 100, l, { size: 42, fill: '#fff', stroke: 'none' }) + (k > 0 ? clipR(540 - 300, 590 + i * 100 - 45, 600 * k, 60, ftext(540, 590 + i * 100, l, { size: 42, fill: SX.acc2, stroke: 'none' }), 0) : ''); });
    const lights = [0, 1, 2, 3].map(i => op(.15, G(tr(150 + i * 260, -50, 1, Math.sin(t * 2 + i * 1.6) * 30), path('M-30 0L30 0L260 1500L-260 1500Z', DPAL[i * 2], 0)))).join('');
    return salonF(t, { night: 1, noSofa: 1 }) + lights + scr + maman({ x: 300, y: 1600, s: 1.22, expr: 'joy', armR: [-60, -100], holdR: G(tr(0, 0, 1, -30), rect(-12, -10, 24, 70, '#2b2b33', 6, 4) + circ(0, -20, 22, '#9aa3ad', 4)) }, t) + papa({ x: 780, y: 1610, s: 1.22, expr: 'laugh', flip: 1, armR: [-60, -100], holdR: G(tr(0, 0, 1, -30), rect(-12, -10, 24, 70, '#2b2b33', 6, 4) + circ(0, -20, 22, '#9aa3ad', 4)) }, t) +
      funTag(CX, 400, 'PAR CŒUR', t, Pc - .05, { size: 56, bg: SX.acc }) + heartsUp(t, CX, 1100, 4, 240); },
  sfx: [[0, 'drum', .5], [at(24, 'connaissent'), 'magic', .4], [at(24, 'par') + .2, 'tada', .5], [at(24, 'par') + .4, 'sparkle', .4]] });
// B025 — « Parce qu'ils les ont déjà entendus 4 fois » : les 4 aînés, même excuse, 4 bâtons au marqueur
B(25, { enter: 'whip', cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const E = at(25, 'entendu'), Q = at(25, '4'); let s = depth({ zoom: 1 }, [{ z: 1.5, svg: salonF(t), blur: 7 }]);
    for (let i = 0; i < 4; i++) { const t0 = .1 + i * (E - .1) / 4, x = 160 + i * 253; s += card(x, 820, 210, 230, sibHead(i, 0, 30, 70, { expr: 'smug', age: SIBS[i].age }, t), t, t0, { ry: 0, thick: 8, r: (i - 1.5) * 6, bw: 6 }) + chatBubble(x, 600, 220, 90, 'chez Kevin !', t, t0 + .1, false, 30) + (t > Q ? markerPath(`M${x - 20} 1000L${x + 10} 1080`, t, Q + i * .06, { col: SX.acc2, w: 16, len: 120 }) : ''); }
    return s + (t > Q ? markerPath('M120 1050L1000 1030', t, Q + .3, { col: SX.acc, w: 16 }) : '') + kword('4 FOIS', CX, 430, t, Q - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[.1, 'pop', .5], [.35, 'pop', .5], [.6, 'pop', .5], [.85, 'pop', .5], [at(25, '4') - .05, 'boom', .6], [at(25, '4') + .1, 'scratch', .5], [at(25, 'fois'), 'rimshot', .5]] });
// B026 — « Mais attends, il y a un avantage » : arrêt sur image, ampoule, « débloqué » en étoiles
B(26, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const A = at(26, 'avantage'); return paper(SX.paper) + gobo(T, .12) + unlock(CX, 900, t, A, { part: 'back', r: 460 }) + cutout(ninoHead(CX, 940, 210, { expr: t > A ? 'ecstatic' : 'suspicious', look: [0, -.6] }, t), 12) + bulb(CX + 230, 640, 1, t > A) + unlock(CX, 900, t, A, { part: 'front', r: 460 }) +
      funTag(CX, 420, 'ATTENDS…', t, at(26, 'attends') - .05, { size: 50, bg: '#fff', fg: SX.ink }) + kword('AVANTAGE', CX, 560, t, A - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[at(26, 'attends') - .05, 'scratch', .7], [at(26, 'avantage') - .05, 'magic', .6], [at(26, 'avantage'), 'sparkle', .7], [at(26, 'avantage') + .2, 'ding', .5]] });
// B027 — « Tu es le bébé de la famille » : ado de 14 ans en bonnet, tétine et bavoir, la famille gâtifie
B(27, { enter: 'drop', cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => { const Bb = at(27, 'bebe'), hx = CX, hy = 1560 - 292 * 1.4, r = 140; return salonF(t) + maman({ x: 170, y: 1600, s: 1.15, expr: 'love', armR: [-10, -30] }, t) + sib(1, { x: 920, y: 1600, s: 1.1, expr: 'love', flip: 1, armR: [-10, -30] }, t) +
      nino({ x: hx, y: 1560, s: 1.4, expr: 'deadpan' }, t) + babyBonnet(hx, hy, r) + pacifier(hx, hy + r * .42, 1.1) + nBib(hx, 1560 - 205 * 1.4, 1.3) + heartsUp(t, hx, hy - 120, 5, 260) +
      funTag(CX, 450, 'BÉBÉ', t, Bb - .05, { size: 80, bg: '#ff8fb1' }) + markerText('(14 ans)', CX + 250, 580, t, Bb + .3, { size: 44, col: '#fff' }); },
  sfx: [[0, 'baby_coo', .5], [at(27, 'bebe') - .05, 'pop', .7], [at(27, 'famille'), 'kiss', .6], [at(27, 'famille') + .2, 'squeak', .4]] });
// B028 — « Tout le monde te protège » : garde rapprochée de la fratrie, lunettes noires, oreillettes, dans la rue
B(28, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.0, t / d), hand: .4 }),
  draw: (t, d, T) => depth({ zoom: 1, x: wave(t, .3, 12) }, [{ z: 1.5, svg: streetT(t, 2), haze: .06 }, { z: 1, svg: hugo({ x: 140, y: 1600, s: 1.05, expr: 'cool', armL: [60, 150], armR: [120, 30] }, t) + sib(2, { x: 940, y: 1600, s: 1.05, expr: 'cool', flip: 1, armL: [60, 150], armR: [120, 30] }, t) + nino({ x: CX, y: 1500, s: 1.3, expr: 'chill' }, t) + sib(1, { x: 330, y: 1560, s: .95, expr: 'cool', armR: [-40, -80] }, t) + sib(3, { x: 760, y: 1560, s: 1.15, expr: 'cool', armL: [200, 230], flip: 1 }, t) }]) +
    funTag(CX, 450, 'PROTECTION MAX', t, at(28, 'protege') - .1, { size: 56, bg: '#2b2420', fg: SX.acc2 }) + G(tr(130, 1600 - 402 * 1.05 + 10), path('M-80 -10Q-110 20 -90 60', 'none', 4)),
  sfx: [[0, 'whoosh', .5], [at(28, 'monde'), 'steps', .6], [at(28, 'protege') - .1, 'pop', .6], [at(28, 'protege') + .3, 'whistle', .4]] });
// B029 — « Tout le monde s'occupe de toi » : roi du canapé (couronne), Léa évente, Jade coiffe, Max sert le jus — chill de ouf
B(29, { enter: 'none', trans: 'push', transD: .2, cam: zin(1.0, 1.07),
  draw: (t, d, T) => { const O = at(29, 'occupe'); return salonF(t) + op(.35, glow(CX, 950, 380, '#fff6c8', .8)) + nino({ x: CX, y: 1500, s: 1.35, expr: 'chill', armL: [160, 230], armR: [20, -50] }, t) + crown(CX, 1500 - 292 * 1.35 - 120, .9) +
      sib(1, { x: 180, y: 1580, s: 1.05, expr: 'joy', armR: [-60 + wave(t, 3, 25), -100] }, t) + palm(250, 1100, .45, t) + sib(3, { x: 900, y: 1530, s: 1.15, expr: 'happy', flip: 1, armR: [-60, -100] }, t) + sib(2, { x: 760, y: 1640, s: 1.0, expr: 'happy', flip: 1, armR: [-20, -40], holdR: G(tr(0, 0), rect(-26, -80, 52, 80, '#ff9a4d', 10, 5) + line(10, -80, 20, -120, 5, '#e2463a')) }, t) +
      funTag(CX, 450, 'SERVICE 5★', t, O - .1, { size: 56, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 900, t, at(29, 'toi'), 7, 260); },
  sfx: [[0, 'angel', .5], [at(29, 'occupe') - .1, 'pop', .6], [at(29, 'toi'), 'sparkle', .6], [at(29, 'toi') + .2, 'kaching', .4]] });
// B030 — « Sauf que les années passent » : feuilles de calendrier qui s'envolent, l'horloge s'emballe, Nino grandit en 3 temps
B(30, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const A = at(30, 'annees'), st = t < A ? 0 : t < A + .4 ? 1 : 2; let pages = ''; for (let i = 0; i < 9; i++) { const k = (t * 1.6 + i / 9) % 1; pages += op(1 - k, G(tr(560 + k * 500 * (i % 2 ? 1 : -.6), 640 - k * 400 + Math.sin(k * 6 + i) * 60, 1, k * 300 * (i % 2 ? 1 : -1)), rect(-50, -60, 100, 120, '#fff', 6, 5) + rect(-50, -60, 100, 28, '#e2463a', 6, 5))); }
    const hero_ = st === 0 ? nino({ x: CX, y: 1520, s: 1.15, expr: 'happy' }, t) : st === 1 ? nino({ x: CX, y: 1530, s: 1.45, expr: 'wow' }, t) : nino({ x: CX, y: 1620, s: 1.2, age: 'adult', expr: 'shock' }, t);
    return salonF(t, { clock: 40 }) + pages + G(tr(560, 640), rect(-130, -150, 260, 300, '#fff', 14, 7) + rect(-130, -150, 260, 70, '#e2463a', 14, 7) + ftext(0, 70, `${2026 + Math.floor(counter(0, 12, t, .2, d - .4))}`, { size: 70, fill: OL, stroke: 'none' })) + speedLines(t, CX, 900, 26, 'rgba(255,255,255,.5)') + hero_ + funTag(CX, 420, 'LES ANNÉES PASSENT', t, A - .1, { size: 46, bg: SX.cool }); },
  sfx: [[0, 'clock_fast', .6], [.1, 'flutter', .5], [at(30, 'annees') - .1, 'whoosh_up', .6], [at(30, 'annees') + .4, 'whoosh_up', .5], [at(30, 'passent'), 'pop', .5]] });
// B031 — « Tes frères quittent la maison » : camion de déménagement qui démarre, Hugo et Max font coucou
B(31, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: .3 }),
  draw: (t, d, T) => { const Q = at(31, 'quittent'), tx = lerp(540, 1400, eInOut(seg(t, Q, d + .3))); return houseExt(t, { car: false }) + truck(tx, 1640, 1.0, t) + G(tr(tx + 200, 1500), hugoHead(0, 0, 54, { expr: 'joy' }, t)) + G(tr(tx - 120, 1420), sibHead(2, 0, 0, 50, { expr: 'joy' }, t) + G(tr(60, -20, 1, wave(t, 3, 25)), circ(0, 0, 18, '#e0b088', 5))) +
      nino({ x: 200, y: 1440, s: 1.2, age: 'adult', expr: 'sad', armR: [-60 + wave(t, 2, 20), -110] }, t) + funTag(tx + 40, 1000, 'BYE !', t, Q, { size: 56, bg: SX.acc }) + motionLines(tx - 430, 1560, 3, 80, 0) + op(.6, circ(tx - 420 - (t * 300 % 100), 1620, 30 + (t * 300 % 100) * .3, '#d9dde3', 0)); },
  sfx: [[0, 'steps', .5], [at(31, 'quittent'), 'whoosh', .7], [at(31, 'quittent') + .1, 'pop', .5], [at(31, 'maison'), 'wind', .4]] });
// B032 — « Tes sœurs construisent leur vie » : Léa et Jade en casque de chantier montent la maison « LEUR VIE »
B(32, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const V = at(32, 'vie'), y1 = 1600, s1 = 1.1; return chantier(t) + sib(1, { x: 260, y: y1, s: s1, expr: 'effort', armR: [-40 + wave(t, 3, 30), -90] }, t) + hardHat(260, y1 - 402 * s1, 92 * s1) + sib(3, { x: 820, y: y1, s: s1, age: 'adult', expr: 'proud', flip: 1, armR: [-30, -80], holdR: rect(-40, -20, 80, 40, '#d9734f', 2, 4) }, t) + hardHat(820, y1 - 402 * s1, 92 * s1) +
      funTag(CX, 440, 'CONSTRUISENT', t, at(32, 'construisent') - .1, { size: 50, bg: '#ffc21a', fg: SX.ink }) + popStars(CX, 640, t, V, 6, 260); },
  sfx: [[0, 'hammer', .5], [at(32, 'construisent'), 'hammer', .7], [at(32, 'construisent') + .3, 'hammer', .6], [at(32, 'vie'), 'tada', .5]] });
// B033 — « Et toi, tu restes » : plongée, la grande table vide, chaises poussiéreuses, une boule d'herbe traverse la cuisine
B(33, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.06, 1.0, t / d), cy: 860 }),
  draw: (t, d, T) => cuisine(t) + famTable(CX, 1500, 1.0, t, { empty: 1 }) + nino({ x: CX, y: 1460, s: 1.15, age: 'adult', expr: 'deadpan', armL: [70, 20], armR: [110, 160] }, t) + nTumble(lerp(-150, 1250, t / d), 1480, 1.1, t) +
    funTag(CX, 450, 'TOI : TOUJOURS LÀ', t, at(33, 'restes') - .1, { size: 46, bg: SX.cool }),
  sfx: [[0, 'crickets', .6], [.1, 'wind', .5], [at(33, 'restes') - .1, 'pop', .5]] });
// B034 — « Un jour, tu réalises que tes parents ont vieilli » : déclic (débloqué n°3), parents grisonnants sur le canapé
B(34, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const V = at(34, 'vieilli'); return salonF(t) + unlock(640, 980, t, V, { part: 'back', r: 420 }) + maman({ x: 520, y: 1560, s: 1.1, expr: 'calm', old: .75 }, t) + papa({ x: 800, y: 1560, s: 1.1, expr: 'sleep', old: .8 }, t) + unlock(640, 980, t, V, { part: 'front', r: 420 }) +
      nino({ x: 170, y: 1600, s: 1.2, age: 'adult', expr: t > V ? 'shock' : 'neutral', look: [1, 0] }, t) + funTag(280, 440, 'UN JOUR…', t, .05, { size: 46, bg: '#fff', fg: SX.ink }) + kword('VIEILLI', 680, 560, t, V - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[.05, 'tick', .5], [at(34, 'realises'), 'gasp', .5], [at(34, 'vieilli') - .05, 'sting', .6], [at(34, 'vieilli') + .1, 'sparkle', .5]] });
// B035 — « Leurs cheveux blanchissent » : gros plan, les cheveux virent au blanc en direct
B(35, { enter: 'crash', cam: zin(1.04, 1.12, .2),
  draw: (t, d, T) => { const k = eInOut(seg(t, .05, at(35, 'blanch') + .4)); return depth({ zoom: 1 }, [{ z: 1.5, svg: salonF(t), blur: 8 }]) + mamanHead(CX - 200, 900, 175, { expr: 'worried', old: .5 + .5 * k, look: [-.3, -1] }, t) + papaHead(CX + 200, 900, 175, { expr: 'shock', old: .5 + .5 * k, look: [.3, -1] }, t) +
      popStars(CX - 200, 720, t, at(35, 'blanch'), 5, 160) + popStars(CX + 200, 720, t, at(35, 'blanch') + .1, 5, 160) + funTag(CX, 450, 'CHEVEUX BLANCS', t, at(35, 'cheveux') - .05, { size: 54, bg: '#fff', fg: SX.ink }); },
  sfx: [[0, 'magic', .5], [at(35, 'cheveux') - .05, 'pop', .5], [at(35, 'blanch'), 'sparkle', .6], [at(35, 'blanch') + .3, 'glint', .5]] });
// B036 — « Ils se fatiguent plus vite » : papa monte 3 marches avec UN sac de courses, batterie à 5 %
B(36, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const F = at(36, 'fati'), lv = lerp(.6, .05, seg(t, 0, F + .3)); return houseExt(t, { car: false }) + papa({ x: 640, y: 1560, s: 1.2, old: 1, expr: 'effort', face: { sweat: 1 }, armR: [80, 90], holdR: dBag(0, 60, .7, '#fff', 0), headTilt: 8 }, t) + sweatSpray(640, 1080, t, 5) + maman({ x: 280, y: 1580, s: 1.1, old: 1, expr: 'sleep' }, t) +
      battery(640, 700, 1.3, lv, t) + funTag(640, 820, `${Math.round(lv * 100)} %`, t, F - .1, { size: 46, bg: lv < .25 ? '#e2463a' : '#ffb03a' }) + funTag(CX, 450, 'PLUS VITE', t, at(36, 'vite') - .1, { size: 56, bg: SX.cool }); },
  sfx: [[0, 'steps', .5], [at(36, 'fati'), 'error_beep', .6], [at(36, 'plus'), 'gulp', .4], [at(36, 'vite'), 'thud', .5]] });
// B037 — « Et tu comprends quelque chose » : gros plan, battement de cœur, dolly-zoom, le salon s'éloigne
B(37, { enter: 'none', trans: 'circle', transD: .3, cam: () => ({ z: 1.0 }),
  draw: (t, d, T) => { const k = t / d; return depth({ zoom: lerp(1, 1.35, k) }, [{ z: 2.2, svg: salonF(t), blur: 6, haze: .1 }, { z: 1, svg: ninoHead(CX, 920, 230, { expr: 'worried', look: [0, -.2] }, t) }]) + kthin('et tu comprends…', CX, 430, t, at(37, 'comprends') - .1, { size: 56 }) + squiggle(CX, 560, 300, t, SX.acc2, { t0: at(37, 'quelque') }); },
  sfx: [[0, 'heartbeat', .6], [at(37, 'comprends'), 'hmm', .4], [at(37, 'chose'), 'heartbeat', .5]] });
// B038 — « Tes frères et sœurs les ont connus jeunes » : album photo, 4 polaroïds éclatants (parents jeunes + chaque aîné)
B(38, { enter: 'drop', cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const J = at(38, 'jeunes'); let s = depth({ zoom: 1 }, [{ z: 1.5, svg: salonF(t), blur: 7 }]) + rect(70, 560, 940, 640, '#8a5a3a', 26, 7) + rect(100, 585, 430, 590, '#fffdf4', 10, 5) + rect(550, 585, 430, 590, '#fffdf4', 10, 5) + line(540, 580, 540, 1180, 8);
    [[220, 760], [420, 990], [660, 760], [880, 990]].forEach(([x, y], i) => { s += polaroid(x, y, .8, (i % 2 ? 6 : -5), famPic(0, sibHead(i, 0, 40, 26, { expr: 'joy' }, t), t), t, .1 + i * .18); });
    return s + kthin('ils les ont connus', CX, 400, t, at(38, 'conn') - .1, { size: 52 }) + kword('JEUNES', CX, 500, t, J - .05, { size: 100, fill: SX.acc2 }) + heartsUp(t, 300, 900, 3, 200); },
  sfx: [[0, 'flutter', .6], [.1, 'shutter', .4], [.28, 'shutter', .4], [.46, 'shutter', .4], [.64, 'shutter', .4], [at(38, 'jeunes') - .05, 'sparkle', .6]] });
// B039 — « Toi, tu les as connus plus âgés » : TA page… une seule photo (parents gris + toi bébé), le reste vide
B(39, { enter: 'none', trans: 'push', transD: .2, cam: zin(1.02, 1.1, .2),
  draw: (t, d, T) => { const Ag = at(39, 'ages'); let s = depth({ zoom: 1 }, [{ z: 1.5, svg: salonF(t), blur: 7 }]) + rect(70, 560, 940, 640, '#8a5a3a', 26, 7) + rect(100, 585, 430, 590, '#fffdf4', 10, 5) + rect(550, 585, 430, 590, '#fffdf4', 10, 5) + line(540, 580, 540, 1180, 8);
    [[220, 760], [420, 990], [660, 760], [880, 990]].forEach(([x, y], i) => { if (i !== 1) s += rect(x - 90, y - 100, 180, 200, 'none', 8, 4, '#d9d0c0') + ftext(x, y + 20, '?', { size: 60, fill: '#d9d0c0', stroke: 'none' }); });
    s += polaroid(420, 980, .8, -4, famPic(1, bebeHead(0, 44, 24, { expr: 'happy' }, t), t), t, .1) + markerCircle(420, 980, 130, 150, t, at(39, 'conn'), { col: SX.acc });
    return s + funTag(230, 430, 'TOI', t, at(39, 'toi') - .05, { size: 60, bg: SX.acc }) + kword('PLUS ÂGÉS', 640, 450, t, Ag - .05, { size: 90, fill: '#fff' }); },
  sfx: [[0, 'flutter', .6], [at(39, 'toi') - .05, 'pop', .6], [at(39, 'conn'), 'scratch', .5], [at(39, 'ages') - .05, 'sting', .5]] });
// B040 — « Tu as passé ton enfance à vouloir grandir plus vite » : sur la pointe des pieds sous la toise des aînés, il se tire les cheveux pour grandir
B(40, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const Gr = at(40, 'grandir'), V = at(40, 'vite'), str = 1 + .18 * eOutBack(seg(t, Gr - .1, Gr + .3)) + .04 * Math.sin(t * 20) * seg(t, Gr, Gr + .1);
    return entree(t) + G(`translate(600 1540) scale(1 ${f1(str * 100) / 100}) translate(-600 -1540)`, nino({ x: 600, y: 1540, s: 1.2, expr: 'effort', armL: [-100, -80], armR: [-80, -100], legL: [100, 95], legR: [80, 85] }, t)) + G(tr(600, 1600), dBox(0, 0, .8, 'LIVRES')) +
      markerArrow(820, 900, 700, 650, t, Gr, { bend: -40, col: SX.acc2 }) + funTag(860, 960, '+ VITE !', t, Gr + .1, { size: 46, bg: SX.acc }) + kword('PLUS VITE', CX, 440, t, V - .05, { size: 100, fill: SX.acc2 }) + funTag(280, 560, 'ENFANCE', t, at(40, 'enfance') - .1, { size: 44, bg: SX.cool }); },
  sfx: [[at(40, 'passe'), 'rewind', .4], [at(40, 'enfance') - .1, 'pop', .5], [at(40, 'grandir') - .1, 'squeak', .7], [at(40, 'grandir') + .2, 'boing', .5], [at(40, 'vite') - .05, 'whoosh_up', .6]] });
// B041a — « Et maintenant, tu aimerais juste… » : coucher de soleil, banc devant la maison, Nino adulte entre ses parents âgés
B(41, { enter: 'none', trans: 'zoom', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => houseExt(t, { dusk: .8, car: false }) + dBench(CX, 1600, 1.6) + maman({ x: CX - 260, y: 1560, s: 1.05, old: 1, expr: 'calm', legL: [10, 90], legR: [0, 90] }, t) + nino({ x: CX, y: 1560, s: 1.1, age: 'adult', expr: 'calm', legL: [10, 90], legR: [0, 90] }, t) + papa({ x: CX + 260, y: 1560, s: 1.05, old: 1, expr: 'happy', legL: [10, 90], legR: [0, 90], flip: 1 }, t) +
    kthin('et maintenant…', CX, 430, t, at(41, 'maintenant') - .1, { size: 56 }) + heartsUp(t, CX, 950, 3, 220),
  sfx: [[0, 'chirp', .4], [.1, 'wind', .3], [at(41, 'aimerais'), 'hmm', .3]] });
// B041b — FIN : « …que tes parents vieillissent moins vite » : il scotche les aiguilles de l'horloge… qui continuent de tourner
B(41, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(41, 'vite', 2) - at(41, 'que') + .5 ? 3 : 0 }),
  draw: (t, d, T) => { const o = at(41, 'que') - .15, Mv = at(41, 'moins') - o, Vt = at(41, 'vite', 2) - o, tape = seg(t, .2, .5), wob = Math.sin(t * 30) * 4 * tape;
    const ck = G(tr(CX, 720), circ(0, 0, 230, '#fbf6e8', 8) + Array.from({ length: 12 }, (_, i) => line(Math.sin(R(i * 30)) * 190, -Math.cos(R(i * 30)) * 190, Math.sin(R(i * 30)) * 210, -Math.cos(R(i * 30)) * 210, 6)).join('') + G(`rotate(${f1(60 + wob)})`, line(0, 0, 0, -170, 10)) + G(`rotate(${f1(200 + wob * .5 + (t > Vt + .3 ? (t - Vt - .3) * 200 : 0))})`, line(0, 0, 0, -120, 14)) + circ(0, 0, 14, OL, 0) +
      (tape > 0 ? G(tr(40, -90, 1, 30), rect(-90 * tape, -22, 180 * tape, 44, 'rgba(240,220,160,.9)', 4, 3)) + G(tr(-50, 40, 1, -40), rect(-80 * tape, -22, 160 * tape, 44, 'rgba(240,220,160,.9)', 4, 3)) : ''));
    return houseExt(t, { dusk: 1, car: false }) + op(.25, rect(-M, -M, W + 2 * M, H + 2 * M, '#3a1d3e', 0, 0)) + ck + G(tr(CX, 1640), maman({ x: -250, y: 0, s: 1.1, old: 1, expr: 'love' }, t) + papa({ x: 250, y: 0, s: 1.1, old: 1, expr: 'love', flip: 1 }, t) + nino({ x: 0, y: 0, s: 1.15, age: 'adult', expr: 'sob', armL: [200, 170], armR: [-20, 10] }, t)) +
      kword('MOINS VITE.', CX, 400, t, Mv - .05, { size: 110, fill: SX.acc2 }) + (t > Vt + .3 ? funTag(CX + 200, 1000, '…ça marche pas', t, Vt + .3, { size: 40, bg: '#fff', fg: SX.ink }) : ''); },
  sfx: [[.2, 'tick', .5], [.3, 'snip', .5], [.5, 'squeak', .4], [at(41, 'moins') - at(41, 'que') + .1, 'boom', .5], [at(41, 'vite', 2) - at(41, 'que') + .3, 'tick', .6], [at(41, 'vite', 2) - at(41, 'que') + .5, 'boing', .5]] }, at(41, 'que') - .15);

SCENES.sort((a, b) => a.s - b.s);
