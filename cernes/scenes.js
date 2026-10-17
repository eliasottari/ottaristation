// ============================================================
//  « Pourquoi c'est horrible d'avoir des cernes permanents ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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

// ---------- décors 9:16 (pièces pour depth) ----------
const M = 700;
function tiles(c1, c2, size = 120, x0 = -M, y0 = -M, w = W + 2 * M, h = H + 2 * M) { let s = rect(x0, y0, w, h, c1, 0, 0); for (let x = x0; x < x0 + w; x += size) s += line(x, y0, x, y0 + h, 4, c2); for (let y = y0; y < y0 + h; y += size) s += line(x0, y, x0 + w, y, 4, c2); return s; }
function bathroomWall(t) { return tiles('#cfeaf0', '#b2d6de') + rect(-M, 1250, W + 2 * M, 1400, '#e8eef0', 0, 0); }
function sink(x, y) { return path(`M${x - 260} ${y}L${x + 260} ${y}Q${x + 240} ${y + 160} ${x} ${y + 170}Q${x - 240} ${y + 160} ${x - 260} ${y}Z`, '#fff') + rect(x - 30, y - 110, 60, 110, '#c9ced6', 10) + path(`M${x - 30} ${y - 100}Q${x - 100} ${y - 110} ${x - 110} ${y - 60}`, 'none', 22, '#c9ced6'); }
function classroom(t) { return grad('#f4ecd8', '#e8dcc0', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 1300, W + 2 * M, 1400, '#c9a77a', 0, 0) + rect(-100, 300, 1280, 620, '#3c5a48', 14) + rect(-80, 320, 1240, 580, '#456b55', 8, 0) + text(300, 520, 'none', 'x² + y² = ?', 'rgba(255,255,255,.85)', 70) + text(760, 700, 'none', 'π ≈ 3,14', 'rgba(255,255,255,.75)', 56) + text(380, 800, 'none', '∫ f(x) dx', 'rgba(255,255,255,.7)', 52); }
function street(t, o = {}) { let s = grad(o.sky1 || '#9fd6ff', o.sky2 || '#e6f5ff', -M, -M, W + 2 * M, 1600); for (let i = -2; i < 6; i++) s += building(-200 + i * 300, 1250, 260, 500 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4]); s += rect(-M, 1250, W + 2 * M, 1400, '#a7adb5', 0, 0) + line(-M, 1250, W + M, 1250, 8, '#7d848c'); return s; }
function laptop(x, y, s, glow = 1, screen = '') { return G(tr(x, y, s), (glow ? `<ellipse cx="0" cy="-200" rx="420" ry="300" fill="rgba(140,200,255,${.25 * glow})"/>` : '') + rect(-260, -340, 520, 340, '#2b2b33', 18) + rect(-236, -316, 472, 292, '#dff0ff', 8, 0) + screen + path('M-320 0L320 0L360 40L-360 40Z', '#9aa3ad')); }
function showerBg(t) { let s = tiles('#d9e7f7', '#bfd2e8', 110); for (let i = 0; i < 26; i++) { const x = (i * 97) % W, y = ((i * 211 + t * 900) % (H + 200)) - 100; s += line(x, y, x - 10, y + 60, 6, 'rgba(255,255,255,.7)'); } return s; }
function steamClouds(t, n = 5) { let s = ''; for (let i = 0; i < n; i++) s += op(.55, cloud(100 + i * 230 + wave(t, .1, 40, i / 5), 300 + (i % 3) * 200 - (t * 30 % 100), 1.2 + (i % 2) * .5, '#ffffff')); return s; }

function bigClock(x, y, str, col, s = 1) { return G(tr(x, y, s), rect(-210, -90, 420, 180, '#2b2b33', 30) + text(0, 35, 'none', str, col, 100)); }
function heartsUp(t, x, y, n = 5) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * .8 + i / n) % 1; s += op(1 - k, heart(x + Math.sin(k * 9 + i) * 60 + (i - n / 2) * 30, y - k * 380, .6 + k * .3)); } return s; }
function schoolyard(t) { return grad('#9fd6ff', '#e6f5ff', -M, -M, W + 2 * M, 1500) + building(-100, 1150, 600, 520, '#f0d9b5') + building(560, 1150, 700, 440, '#e8c9a0') + rect(-M, 1150, W + 2 * M, 1500, '#c9b8a0', 0, 0); }


// ============================================================
//  SIZEX fun : intro = signature motion (fond graphique), ensuite VRAIS DÉCORS vivants + couche motion rebondie.
//  Police Fredoka (défaut de sxFun), contours cartoon épais, un accent violet « cerne ».
// ============================================================
sxFun('#9b5cff'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';

// ---------- LES CERNES (overlay dessiné sous les yeux, dans le repère de head) ----------
// k = intensité (1 = normal, 1.5 = énormes). Dessiné après la peau/joues, avant sourcils/yeux.
function cernes(r, k = 1) { let s = '';
  for (const sd of [-1, 1]) { const cx = sd * r * .34, y0 = r * .12, w = r * .2 * (1 + .2 * (k - 1)), d = r * .19 * k;
    s += path(`M${f1(cx - w)} ${f1(y0)}Q${f1(cx)} ${f1(y0 + d * 1.6)} ${f1(cx + w)} ${f1(y0)}Q${f1(cx)} ${f1(y0 + d * .5)} ${f1(cx - w)} ${f1(y0)}Z`, 'rgba(120,60,175,.58)', 0);
    s += path(`M${f1(cx - w * 1.02)} ${f1(y0 + d * .15)}Q${f1(cx)} ${f1(y0 + d * 1.75)} ${f1(cx + w * 1.02)} ${f1(y0 + d * .15)}`, 'none', Math.max(3, r * .032), 'rgba(88,36,140,.75)');
    if (k > 1.15) s += path(`M${f1(cx - w * .8)} ${f1(y0 + d * 1.2)}Q${f1(cx)} ${f1(y0 + d * 2.2)} ${f1(cx + w * .8)} ${f1(y0 + d * 1.2)}`, 'none', Math.max(2, r * .022), 'rgba(88,36,140,.5)'); }
  return s; }
const hfC = (k = 1, hair = 'side', col = '#3a2a22') => (r, t) => { const [b, f] = hairSvg(hair, col, r, t); return [b, f + cernes(r, k)]; };

// ---------- personnages ----------
const HERO = '#ff7a59';
const ado = (o, t) => person(Object.assign({ age: 'kid', hairFn: hfC(o.ck ?? 1), shirt: HERO, pants: '#34405e', seed: 2 }, o), t);
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: hfC(o.ck ?? 1), seed: 2 }, o), t));
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const voisine = (o, t) => person(Object.assign({ age: 'adult', hair: 'curly', hairColor: '#2b2420', shirt: '#ff8fb1', pants: '#4b3b6e', skin: '#c98a5e', seed: 5 }, o), t);
const voisineHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'curly', hairColor: '#2b2420', skin: '#c98a5e', seed: 5 }, o), t));
const recruteur = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#1f1a18', glasses: true, shirt: '#5b6b8a', collar: '#fff', pants: '#2b2b33', seed: 8 }, o), t);
const recruteurHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'side', hairColor: '#1f1a18', glasses: true, seed: 8 }, o), t));
const mamieHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'bun', hairColor: '#d9d9de', glasses: true, wrinkles: true, seed: 4 }, o), t));
const photoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'short', hairColor: '#8a5a3a', mustache: true, seed: 9 }, o), t));
const patron = (o, t) => person(Object.assign({ age: 'adult', hair: 'bald', hairColor: '#5a4a3a', mustache: true, shirt: '#e9edf3', collar: '#c43a2e', pants: '#2b2b33', seed: 11 }, o), t);
const patronHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'bald', hairColor: '#5a4a3a', mustache: true, seed: 11 }, o), t));

// ---------- décors vivants ----------
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff');
function treeC(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c')); }
function kidsBg(t, y = 1150, n = 4, sc = .45) { let s = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; s += person({ age: i % 2 ? 'adult' : 'kid', x, y, s: sc, hair: ['curly', 'bun', 'short', 'ponytail'][i % 4], hairColor: ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040'][i % 4], shirt: ['#ff8fb1', '#7aa6d8', '#ffd23f', '#7be07b'][i % 4], expr: 'happy', walk: 3, flip: i % 2, seed: 20 + i }, t); } return s; }
function plateC(x, y, s, food = 0, t = 0) { const f = [['#ffe08a', '#f2b33d'], ['#ff8a5c', '#d9532b'], ['#8fd16a', '#5a9e3c']][food % 3];
  return G(tr(x, y, s), ell(0, 0, 150, 40, '#fff') + ell(0, -6, 100, 24, 'none', 5, 'rgba(0,0,0,.15)') + path(`M-90 -10Q-80 -110 0 -120Q80 -110 90 -10Z`, f[0], 6) + circ(-30, -70, 14, f[1], 0) + circ(30, -50, 12, f[1], 0) + circ(5, -95, 10, f[1], 0) + steam(-20, -150, t, .6)); }


// ============================================================
//  DÉCORS RICHES (retour client) — accessoires factorisés (préfixe d… : n'écrase rien du moteur)
//  Trait fin (DSW = 4 px) pour le décor : les persos gardent leur contour 7 px et restent lisibles.
// ============================================================
const FL = 1250, DSW = 4;
const PALD = ['#ff8fb1', '#7aa6d8', '#ffd23f', '#7be07b', '#b994ec', '#ff8a3d', '#5ec4f0', '#e2463a', '#36c5b4'];
function dClip(x, y, w, h, svg, rx = 6) { const id = 'dc' + (_gid++); return `<defs><clipPath id="${id}"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }
// murs / sols
function dWall(c1, c2, kind = 'stripe', c3 = 'rgba(255,255,255,.25)', y1 = FL) {
  let s = grad(c1, c2, -M, -M, W + 2 * M, y1 + M + 10);
  if (kind === 'stripe') for (let x = -360; x < W + 360; x += 90) s += rect(x, -M, 34, y1 + M, c3, 0, 0);
  else if (kind === 'dots') for (let y = -160, r = 0; y < y1; y += 80, r++) for (let x = -360 + (r % 2) * 40; x < W + 360; x += 80) s += circ(x, y, 6, c3, 0);
  else if (kind === 'diamond') for (let y = -160, r = 0; y < y1; y += 100, r++) for (let x = -360 + (r % 2) * 50; x < W + 360; x += 100) s += path(`M${x} ${y - 18}L${x + 13} ${y}L${x} ${y + 18}L${x - 13} ${y}Z`, c3, 0);
  else if (kind === 'brick') for (let y = -300, r = 0; y < y1; y += 60, r++) for (let x = -400 + (r % 2) * 60; x < W + 400; x += 120) s += rect(x + 4, y + 4, 112, 52, c3, 6, 0);
  return s;
}
function dBase(y = FL, c = '#fffaf0') { return rect(-M, y - 26, W + 2 * M, 30, c, 0, DSW); }
function dParquet(y = FL, c1 = '#c99a66', c2 = 'rgba(90,55,25,.3)') { let s = rect(-M, y, W + 2 * M, H + M - y, c1, 0, 0);
  for (let r = 0, yy = y; yy < H + 300; r++) { const h = 40 + r * 9; s += line(-M, yy, W + M, yy, 3, c2); for (let x = -M + (r * 137) % 240; x < W + M; x += 240) s += line(x, yy, x, yy + h, 3, c2); yy += h; } return s; }
function dTiles(y, c1, c2, sz = 110) { let s = rect(-M, y, W + 2 * M, H + M - y, c1, 0, 0);
  for (let r = 0, yy = y; yy < H + 300; r++) { const h = sz * (.5 + r * .12); for (let x = -M + (r % 2) * sz; x < W + M; x += sz * 2) s += rect(x, yy, sz, h, c2, 0, 0); yy += h; } return s; }
function dRug(x, y, w, h, c1, c2, round = 0) {
  let s = round ? ell(x, y, w / 2, h / 2, c1, DSW) + ell(x, y, w / 2 - 24, h / 2 - 14, 'none', 6, c2) + ell(x, y, w / 4, h / 4, c2, 0)
    : rect(x - w / 2, y - h / 2, w, h, c1, 18, DSW) + rect(x - w / 2 + 20, y - h / 2 + 14, w - 40, h - 28, 'none', 14, 6, c2) + path(`M${x - w / 4} ${y}L${x} ${y - h / 4}L${x + w / 4} ${y}L${x} ${y + h / 4}Z`, c2, 0);
  if (!round) for (let i = 0; i < 6; i++) { const yy = y - h / 2 + 12 + i * (h - 24) / 5; s += line(x - w / 2 - 16, yy, x - w / 2, yy, 4, c2) + line(x + w / 2, yy, x + w / 2 + 16, yy, 4, c2); }
  return s; }
function dOutlet(x, y) { return rect(x - 22, y - 30, 44, 60, '#fdfbf6', 8, DSW) + circ(x - 8, y - 6, 4, OL, 0) + circ(x + 8, y - 6, 4, OL, 0); }
function dSwitch(x, y) { return rect(x - 24, y - 34, 48, 68, '#fdfbf6', 8, DSW) + rect(x - 9, y - 18, 18, 30, '#e8e2d6', 4, 3); }
// cadres, posters, étagères
function dFrameP(x, y, w, h, k = 0, fc = '#c38a52', r = 0) { const iw = w - 24, ih = h - 24, m = Math.min(iw, ih);
  const inner = [rect(-iw / 2, -ih / 2, iw, ih, '#bfe3ff', 0, 0) + circ(iw * .22, -ih * .2, m * .12, '#ffd23f', 0) + path(`M${-iw / 2} ${ih / 2}L${-iw * .15} ${-ih * .05}L${iw * .05} ${ih * .2}L${iw * .25} 0L${iw / 2} ${ih / 2}Z`, '#7bc47b', 0),
    rect(-iw / 2, -ih / 2, iw, ih, '#ffe0c0', 0, 0) + path(`M${-m * .38} ${ih / 2}Q0 ${ih * .02} ${m * .38} ${ih / 2}Z`, '#7aa6d8', 0) + circ(0, -ih * .1, m * .22, '#f2c9a0', 3) + circ(-m * .07, -ih * .12, 3, OL, 0) + circ(m * .07, -ih * .12, 3, OL, 0),
    rect(-iw / 2, -ih / 2, iw, ih, '#ffd6e3', 0, 0) + heart(0, 4, m / 110),
    rect(-iw / 2, -ih / 2, iw, ih, '#fff', 0, 0) + circ(-iw * .15, -ih * .1, m * .2, '#ff8fb1', 0) + rect(0, -ih * .05, iw * .3, ih * .35, '#5ec4f0', 0, 0) + circ(iw * .1, ih * .25, m * .1, '#ffd23f', 0),
    rect(-iw / 2, -ih / 2, iw, ih, '#fff8e0', 0, 0) + rect(-m * .18, ih * .05, m * .36, ih * .4, '#7aa6d8', 4, 3) + circ(-m * .12, -ih * .12, m * .12, '#ff8fb1', 3) + circ(m * .12, -ih * .16, m * .12, '#ffd23f', 3) + circ(0, -ih * .3, m * .12, '#b994ec', 3)][k % 5];
  return G(tr(x, y, 1, r), path(`M${-w * .3} ${-h / 2}L0 ${-h / 2 - 30}L${w * .3} ${-h / 2}`, 'none', 3) + rect(-w / 2, -h / 2, w, h, fc, 6, DSW) + inner + rect(-iw / 2, -ih / 2, iw, ih, 'none', 0, 3)); }
function dPoster(x, y, w, h, bg, inner = '', r = 0) { return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, bg, 6, DSW) + inner + rect(-w / 2 - 6, -h / 2 - 8, 30, 16, 'rgba(255,255,255,.75)', 2, 0) + rect(w / 2 - 24, -h / 2 - 8, 30, 16, 'rgba(255,255,255,.75)', 2, 0)); }
function dDiploma(x, y, r = 0) { return G(tr(x, y, 1, r), rect(-100, -70, 200, 140, '#c38a52', 6, DSW) + rect(-86, -56, 172, 112, '#fffaf0', 0, 3) + line(-60, -30, 60, -30, 5, '#9aa3ad') + line(-60, -10, 40, -10, 3, '#c9d2dc') + line(-60, 6, 50, 6, 3, '#c9d2dc') + path('M44 44l-8 22M56 44l8 22', 'none', 5, '#e2463a') + circ(50, 32, 16, '#e2463a', 3)); }
function dBooks(x, y, n = 7, seed = 1, h0 = 90) { const r = rng(seed); let s = '', cx = x;
  for (let i = 0; i < n; i++) { const w = 18 + r() * 14, h = h0 * (.72 + r() * .3), c = PALD[Math.floor(r() * PALD.length)];
    if (i === n - 1) s += G(tr(cx + 4, y, 1, 22), rect(0, -h, w, h, c, 3, DSW)); else s += rect(cx, y - h, w, h, c, 3, DSW) + line(cx + 5, y - h * .78, cx + w - 5, y - h * .78, 3, 'rgba(255,255,255,.65)'); cx += w + 2; }
  return s; }
function dShelf(x, y, w, items = '', c = '#b98656') { return items + rect(x, y, w, 16, c, 4, DSW) + path(`M${x + 26} ${y + 16}l0 24l24 -24`, 'none', DSW) + path(`M${x + w - 26} ${y + 16}l0 24l-24 -24`, 'none', DSW); }
function dJar(x, y, s = 1, c = '#ffd23f', lid = '#e2463a') { return G(tr(x, y, s), rect(-28, -70, 56, 70, 'rgba(225,242,255,.85)', 12, DSW) + rect(-22, -42, 44, 36, c, 8, 0) + rect(-32, -84, 64, 18, lid, 6, DSW)); }
function dTrophy(x, y, s = 1) { return G(tr(x, y, s), rect(-30, -22, 60, 22, '#8a5a3a', 4, DSW) + rect(-8, -50, 16, 30, '#ffcf3f', 0, DSW) + path('M-38 -110L38 -110Q38 -50 0 -48Q-38 -50 -38 -110Z', '#ffcf3f', DSW) + path('M-38 -100Q-62 -96 -50 -72M38 -100Q62 -96 50 -72', 'none', DSW) + sparkle(16, -90, .25, '#fff')); }
// plantes en pot (0 boule, 1 cactus, 2 fougère, 3 fleurs) — se balancent
function dPot(x, y, s = 1, kind = 0, t = 0, pot = '#d9825b') { const w = wave(t, .35, 4, x * .013); let p = '';
  if (kind === 0) p = circ(-30 + w * .3, -100, 50, '#5fb85f', DSW) + circ(30 + w * .3, -110, 55, '#6cc46c', DSW) + circ(w * .5, -150, 50, '#4fa64f', DSW);
  else if (kind === 1) p = path('M-24 -100Q-60 -100 -60 -140', 'none', 18, OL) + path('M-24 -100Q-60 -100 -60 -140', 'none', 10, '#6cc46c') + rect(-24, -170, 48, 130, '#6cc46c', 24, DSW) + circ(0, -172, 10, '#ff8fb1', 3);
  else if (kind === 2) for (let i = 0; i < 5; i++) { const a = -150 + i * 30 + w; p += path(`M0 -40Q${f1(Math.cos(R(a)) * 60)} ${f1(-40 + Math.sin(R(a)) * 90)} ${f1(Math.cos(R(a)) * 120)} ${f1(-40 + Math.sin(R(a)) * 120)}`, 'none', 18, i % 2 ? '#4fa64f' : '#5fb85f'); }
  else for (let i = 0; i < 3; i++) { const a = -120 + i * 30 + w, ex = Math.cos(R(a)) * 110, ey = -40 + Math.sin(R(a)) * 110; p += line(0, -40, ex, ey, 5, '#4fa64f') + circ(ex, ey, 18, ['#ff8fb1', '#ffd23f', '#b994ec'][i], DSW) + circ(ex, ey, 6, '#fff', 0); }
  return G(tr(x, y, s), p + path('M-40 -44L40 -44L32 0L-32 0Z', pot, DSW) + rect(-46, -54, 92, 16, shade(pot, .15), 5, DSW)); }
// lampes, rideaux, fenêtres
function dLamp(x, y, s = 1, on = 1, c = '#ffd23f') { return G(tr(x, y, s), (on ? circ(0, -150, 150, 'rgba(255,230,140,.2)', 0) + circ(0, -150, 90, 'rgba(255,236,160,.25)', 0) : '') + ell(0, -8, 50, 12, '#8a5a3a', DSW) + line(0, -10, 0, -120, 7) + path('M-60 -110L60 -110L40 -190L-40 -190Z', c, DSW)); }
function dPendant(x, y, t, c = '#ffd23f', len = 300, on = 1) { const a = wave(t, .3, 3, x * .01);
  return G(tr(x, y - len, 1, a), line(0, -700, 0, len - 40, 4) + (on ? circ(0, len + 10, 120, 'rgba(255,230,140,.22)', 0) : '') + path(`M-70 ${len + 10}Q-60 ${len - 50} 0 ${len - 50}Q60 ${len - 50} 70 ${len + 10}Z`, c, DSW) + circ(0, len + 14, 14, '#fff6c8', 3)); }
function dCurtain(x, y, w, h, c, t) { const sw = wave(t, .25, 10, x * .01);
  const L = `M${x - 20} ${y}L${x + w * .3 + sw} ${y}Q${x + w * .18 + sw} ${y + h * .45} ${x + w * .08} ${y + h * .55}Q${x + w * .12 + sw * .6} ${y + h * .8} ${x + w * .05 + sw} ${y + h + 20}L${x - 20} ${y + h + 20}Z`;
  const Rr = `M${x + w + 20} ${y}L${x + w * .7 - sw} ${y}Q${x + w * .82 - sw} ${y + h * .45} ${x + w * .92} ${y + h * .55}Q${x + w * .88 - sw * .6} ${y + h * .8} ${x + w * .95 - sw} ${y + h + 20}L${x + w + 20} ${y + h + 20}Z`;
  return path(L, c, DSW) + path(Rr, c, DSW) + line(x + w * .06, y + 24, x + w * .06 + sw * .3, y + h * .5, 3, 'rgba(0,0,0,.15)') + line(x + w * .94, y + 24, x + w * .94 - sw * .3, y + h * .5, 3, 'rgba(0,0,0,.15)') +
    line(x - 40, y - 4, x + w + 40, y - 4, 9, '#8a5a3a') + circ(x - 44, y - 4, 10, '#8a5a3a', DSW) + circ(x + w + 44, y - 4, 10, '#8a5a3a', DSW); }
// vue extérieure (lointaine, brumeuse) : ciel, nuages qui défilent, immeubles, arbres — ou nuit étoilée
function dView(x, y, w, h, t, o = {}) { const n = o.night; let s = n ? grad('#0f163a', '#27306a', x, y, w, h) : grad(o.sky1 || '#9fd6ff', o.sky2 || '#e6f6ff', x, y, w, h);
  if (n) { s += circ(x + w * .7, y + h * .25, Math.min(w, h) * .12, '#fff6d6', 0); for (let i = 0; i < 9; i++) s += circ(x + (i * 97 % w), y + 20 + (i * 53 % (h * .45)), 3 + 2 * Math.sin(t * 3 + i), '#fff6c8', 0); }
  else s += circ(x + w * .78, y + h * .2, Math.min(w, h) * .1, '#fff3a0', 0) + cloud(x + ((t * 22 + (o.ph || 0)) % (w + 300)) - 150, y + h * .22, .45, '#fff') + cloud(x + ((t * 14 + 160 + (o.ph || 0)) % (w + 300)) - 150, y + h * .42, .32, '#fff');
  const r = rng(o.seed || 5); let b = '';
  for (let i = 0; i < 5; i++) { const bw = w * (.18 + r() * .14), bh = h * (.25 + r() * .3), bx = x + i * w * .21 - 10; b += rect(bx, y + h - bh, bw, bh + 4, n ? '#3a4380' : ['#c9d6e6', '#e6cfc0', '#d4e3d0'][i % 3], 0, 0);
    for (let j = 0; j < 3; j++) b += rect(bx + bw * .2, y + h - bh + 16 + j * 34, bw * .2, 16, n ? (r() > .4 ? '#ffd86b' : '#2a3168') : 'rgba(255,255,255,.7)', 2, 0) + rect(bx + bw * .6, y + h - bh + 16 + j * 34, bw * .2, 16, n ? (r() > .5 ? '#ffd86b' : '#2a3168') : 'rgba(255,255,255,.7)', 2, 0); }
  if (!n && !o.noTree) b += circ(x + w * .15, y + h * .84, w * .16, '#7bc47b', 0) + circ(x + w * .32, y + h * .9, w * .13, '#6cb86c', 0);
  return dClip(x, y, w, h, s + haze(.25, n ? '#27306a' : '#e6f6ff', b)); }
function dWindow(x, y, w, h, t, o = {}) { const fc = o.fc || '#fffaf0';
  return dView(x, y, w, h, t, o) + rect(x, y, w, h, 'none', 6, 10, fc) + rect(x - 5, y - 5, w + 10, h + 10, 'none', 8, DSW) + line(x + w / 2, y, x + w / 2, y + h, 8, fc) + line(x, y + h * .45, x + w, y + h * .45, 8, fc) +
    line(x + 18, y + 18, x + 40, y + 50, 5, 'rgba(255,255,255,.8)') + rect(x - 24, y + h, w + 48, 22, fc, 4, DSW) + (o.curtain ? dCurtain(x - 30, y - 30, w + 60, h + 60, o.curtain, t) : ''); }
// guirlande lumineuse qui clignote
function dGarland(x0, x1, y, t, n = 10, sag = 80) { let s = path(`M${x0} ${y}Q${(x0 + x1) / 2} ${y + sag * 2} ${x1} ${y}`, 'none', 3);
  for (let i = 1; i < n; i++) { const k = i / n, x = lerp(x0, x1, k), yy = y + 4 * k * (1 - k) * sag, on = Math.sin(t * 5 + i * 1.7) > -.3, c = PALD[i % 5];
    s += (on ? circ(x, yy + 16, 22, 'rgba(255,240,170,.35)', 0) : '') + rect(x - 5, yy - 2, 10, 10, '#555', 2, 0) + ell(x, yy + 16, 9, 13, on ? c : shade(c, .35), 3); }
  return s; }
// extérieurs
function dBld(x, y, w, h, c, seed, t, o = {}) { const r = rng(seed); let s = rect(x, y - h, w, h, c, 4, DSW) + rect(x - 10, y - h - 20, w + 20, 24, shade(c, .18), 4, DSW);
  if (r() > .5) s += rect(x + w * .7, y - h - 70, 40, 50, shade(c, .25), 3, DSW); else s += line(x + w * .3, y - h - 20, x + w * .3, y - h - 90, 4) + line(x + w * .3 - 20, y - h - 80, x + w * .3 + 20, y - h - 80, 4);
  const cols = Math.max(2, Math.floor((w - 30) / 90)), cw = (w - 40) / cols, gf = o.shop ? 200 : 40, rows = Math.floor((h - gf - 40) / 115);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const wx = x + 20 + i * cw + 10, wy = y - h + 40 + j * 115, ww = cw - 20, lit = r() > .7;
    s += rect(wx, wy, ww, 70, lit ? '#ffe9a0' : '#cfe8ff', 4, DSW) + line(wx + ww / 2, wy, wx + ww / 2, wy + 70, 3);
    const q = r(); if (q > .72) s += rect(wx - 8, wy + 56, ww + 16, 22, 'none', 2, 4) + line(wx, wy + 62, wx, wy + 78, 3) + line(wx + ww / 2, wy + 62, wx + ww / 2, wy + 78, 3) + line(wx + ww, wy + 62, wx + ww, wy + 78, 3);
    else if (q > .5) s += path(`M${f1(wx - 6)} ${wy}L${f1(wx + ww + 6)} ${wy}L${f1(wx + ww)} ${wy + 24}L${f1(wx)} ${wy + 24}Z`, PALD[(i + j + seed) % PALD.length], 3); }
  if (o.shop) { const sy = y - 180, aw = (w - 12) / 6; s += rect(x + 12, sy + 56, w - 24, 124, '#cfe8ff', 4, DSW) + rect(x + w - 90, sy + 70, 60, 110, '#8a5a3a', 4, DSW) + line(x + 30, sy + 80, x + 60, sy + 120, 5, 'rgba(255,255,255,.8)');
    for (let i = 0; i < 6; i++) s += path(`M${f1(x + 6 + i * aw)} ${sy + 10}l${f1(aw)} 0l0 36q${f1(-aw / 2)} 18 ${f1(-aw)} 0Z`, i % 2 ? '#fff' : o.shop, 3);
    s += rect(x + w * .1, sy - 44, w * .8, 46, '#fffaf0', 8, DSW) + text(x + w / 2, sy - 10, 'none', o.sign || '', o.shop, 26); }
  return s; }
function dLampPost(x, y, s = 1, on = 0) { return G(tr(x, y, s), rect(-16, -24, 32, 24, '#3b4a5a', 4, DSW) + line(0, -20, 0, -420, 10, '#3b4a5a') + path('M0 -410Q0 -462 60 -462', 'none', 8, '#3b4a5a') + (on ? circ(60, -420, 50, 'rgba(255,230,140,.35)', 0) : '') + path('M38 -464L82 -464L74 -432L46 -432Z', '#ffe9a0', DSW)); }
function dSignP(x, y, s = 1, str = 'P', c = '#3a7bd5', round = 0) { return G(tr(x, y, s), line(0, 0, 0, -300, 8, '#8a95a3') + (round ? circ(0, -330, 50, c, DSW) : rect(-46, -376, 92, 92, c, 12, DSW)) + text(0, round ? -312 : -312, 'none', str, '#fff', 56)); }
function dBike(x, y, s = 1, c = '#e2463a') { return G(tr(x, y, s), circ(-70, -45, 45, 'none', 7) + circ(70, -45, 45, 'none', 7) + path('M-70 -45L-20 -110L50 -110L70 -45M-20 -110L10 -45L50 -110M-70 -45L10 -45', 'none', 7, c) + line(-34, -126, -6, -126, 8) + path('M50 -110L44 -140L66 -140', 'none', 6)); }
function dCarP(x, y, s = 1, c = '#5ec4f0') { return G(tr(x, y, s), path('M-200 -40L-200 -100Q-190 -120 -150 -122L-100 -180Q-80 -196 -40 -196L60 -196Q90 -196 110 -176L160 -122Q200 -118 205 -90L205 -40Z', c, DSW) + path('M-88 -128L-50 -176L0 -176L0 -128Z', '#dff2ff', DSW) + path('M18 -128L18 -176L66 -176Q86 -174 100 -158L120 -128Z', '#dff2ff', DSW) + circ(-120, -36, 38, '#2b2b33', DSW) + circ(-120, -36, 16, '#bbb', 0) + circ(120, -36, 38, '#2b2b33', DSW) + circ(120, -36, 16, '#bbb', 0) + rect(186, -100, 20, 16, '#fff3a0', 4, 3)); }
function dBin(x, y, s = 1, c = '#4f9a5a') { return G(tr(x, y, s), path('M-50 -150L50 -150L42 0L-42 0Z', c, DSW) + rect(-58, -168, 116, 22, shade(c, .2), 6, DSW) + line(-20, -120, -16, -24, 3, 'rgba(0,0,0,.25)') + line(20, -120, 16, -24, 3, 'rgba(0,0,0,.25)')); }
function dBush(x, y, s = 1, c = '#5fb85f', fl = '') { let b = circ(-60, -50, 60, c, DSW) + circ(60, -50, 60, c, DSW) + circ(0, -90, 70, c, DSW) + rect(-100, -50, 200, 50, c, 20, 0); if (fl) for (let i = 0; i < 5; i++) b += circ(-70 + i * 35, -60 - (i % 2) * 50, 9, fl, 3); return G(tr(x, y, s), b); }
function dFlowers(x0, x1, y, t, seed = 3) { const r = rng(seed); let s = ''; for (let x = x0; x < x1; x += 40 + r() * 30) { const h = 40 + r() * 40, sw = wave(t, .6, 5, x * .01); s += line(x, y, x + sw, y - h, 4, '#4fa64f') + circ(x + sw, y - h, 12, PALD[Math.floor(r() * 5)], 3) + circ(x + sw, y - h, 4, '#fff', 0); } return s; }
function dBirds(t, y0, n = 3, seed = 7, sp = 70) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = ((t * (sp + r() * 40) + r() * 1400) % 1500) - 200, y = y0 + r() * 160 + Math.sin(t * 2 + i) * 14, f = Math.sin(t * 12 + i * 2) * 14; s += path(`M${f1(x - 24)} ${f1(y - f)}Q${f1(x - 10)} ${f1(y - 12)} ${f1(x)} ${f1(y)}Q${f1(x + 10)} ${f1(y - 12)} ${f1(x + 24)} ${f1(y - f)}`, 'none', 5); } return s; }
function dBench(x, y, s = 1) { return G(tr(x, y, s), line(-140, -150, -140, 0, 7, '#3b4a5a') + line(140, -150, 140, 0, 7, '#3b4a5a') + rect(-160, -150, 320, 22, '#c58e55', 6, DSW) + rect(-160, -112, 320, 22, '#c58e55', 6, DSW) + rect(-170, -70, 340, 24, '#c58e55', 6, DSW)); }
function dFence(x0, x1, y, c = '#fffaf0', h = 110) { let s = ''; for (let x = x0; x < x1; x += 56) s += path(`M${x} ${y}L${x} ${y - h}L${x + 16} ${y - h - 18}L${x + 32} ${y - h}L${x + 32} ${y}Z`, c, DSW); return rect(x0, y - h * .75, x1 - x0, 16, c, 4, DSW) + rect(x0, y - h * .35, x1 - x0, 16, c, 4, DSW) + s; }
function dHills(y, c1, c2) { return path(`M${-M} ${y}Q100 ${y - 180} 420 ${y - 60}Q700 ${y - 220} 1000 ${y - 80}Q1300 ${y - 160} ${W + M} ${y - 40}L${W + M} ${y + 300}L${-M} ${y + 300}Z`, c1, 0) + path(`M${-M} ${y + 60}Q250 ${y - 60} 600 ${y + 20}Q900 ${y - 70} ${W + M} ${y + 30}L${W + M} ${y + 300}L${-M} ${y + 300}Z`, c2, 0); }
function dSkyline(y, c, seed = 2) { const r = rng(seed); let s = ''; for (let x = -400; x < W + 400; x += 70 + r() * 60) { const h = 140 + r() * 260, w = 70 + r() * 70; s += rect(x, y - h, w, h + 10, c, 0, 0); if (r() > .6) s += rect(x + w * .4, y - h - 40, 8, 40, c, 0, 0); } return s; }
function dTreeV(x, y, s, t, kind = 0) { const w = wave(t, .3, 2, x * .01);
  if (kind === 1) return G(tr(x, y, s, w), rect(-16, -60, 32, 60, '#8a5a3a', 6, DSW) + path('M0 -380L120 -160L-120 -160Z', '#3f8f55', DSW) + path('M0 -300L140 -50L-140 -50Z', '#4fa064', DSW));
  if (kind === 2) return G(tr(x, y, s, w), rect(-18, -200, 36, 200, '#8a5a3a', 8, DSW) + ell(0, -340, 110, 180, '#6cbf6c', DSW) + path('M-40 -300Q0 -280 30 -330', 'none', 4, 'rgba(0,0,0,.2)'));
  if (kind === 3) return G(tr(x, y, s, w), rect(-22, -240, 44, 240, '#8a5a3a', 10, DSW) + circ(0, -330, 140, '#ffc2d6', DSW) + circ(-90, -260, 90, '#ffb0c8', DSW) + circ(90, -270, 100, '#ffd0e0', DSW) + circ(-30, -360, 10, '#fff', 0) + circ(50, -300, 10, '#fff', 0) + circ(-100, -250, 8, '#fff', 0));
  return treeC(x, y, s, t); }
function dKite(x, y, t, c = '#e2463a') { const kx = x + wave(t, .3, 40), ky = y + wave(t, .45, 30); return path(`M${f1(kx)} ${f1(ky + 80)}Q${f1(kx + 80)} ${f1(ky + 400)} ${f1(kx + 30)} 1100`, 'none', 2) + G(tr(kx, ky, 1, wave(t, .5, 12)), path('M0 90q-20 30 0 50q20 20 0 50', 'none', 3) + path('M0 -70L50 0L0 90L-50 0Z', c, DSW) + line(0, -70, 0, 90, 3) + line(-50, 0, 50, 0, 3)); }
function dButterfly(x, y, t, c = '#ffd23f') { const fx = x + wave(t, .2, 120), fy = y + wave(t, .33, 50), f = .4 + .6 * Math.abs(Math.sin(t * 14)); return G(tr(fx, fy), ell(-16 * f, -6, 16 * f, 12, c, 3) + ell(16 * f, -6, 16 * f, 12, c, 3) + line(0, -14, 0, 8, 4)); }
// petits objets
function dShoes(x, y, c = '#e2463a') { const sh = dx => path(`M${dx - 40} 0L${dx - 40} -26Q${dx - 30} -40 ${dx - 6} -36L${dx + 10} -22Q${dx + 40} -20 ${dx + 44} 0Z`, c, DSW) + line(dx - 38, -5, dx + 42, -5, 5, '#fff'); return G(tr(x, y), sh(-40) + sh(52)); }
function dBag(x, y, c = '#7aa6d8', r = 0) { return G(tr(x, y, 1, r), path('M-30 -172Q0 -210 30 -172', 'none', 6) + path('M-60 0L-66 -120Q-60 -170 0 -172Q60 -170 66 -120L60 0Z', c, DSW) + rect(-40, -80, 80, 56, shade(c, .15), 12, DSW)); }
function dBall(x, y, c = '#ff8a3d', rot = 0, r = 40) { return G(tr(x, y - r, 1, rot), circ(0, 0, r, c, DSW) + path(`M${-r} 0Q0 ${r * .4} ${r} 0M0 ${-r}Q${-r * .4} 0 0 ${r}`, 'none', 3)); }
function dBox(x, y, s = 1, r = 0) { return G(tr(x, y, s, r), rect(-80, -110, 160, 110, '#d9a066', 4, DSW) + path('M-80 -110L-100 -140L-20 -140L0 -110M80 -110L100 -140L20 -140L0 -110', '#e6b47c', DSW) + rect(-20, -110, 40, 24, '#e8d3a8', 0, 0)); }
function dCalW(x, y, s = 1, n = '12') { return G(tr(x, y, s), circ(0, -96, 6, OL, 0) + rect(-60, -86, 120, 140, '#fff', 8, DSW) + rect(-60, -86, 120, 36, '#e2463a', 8, DSW) + text(0, 30, 'none', n, OL, 50) + line(-40, 44, 40, 44, 3, '#cbd2da')); }
function dMug(x, y, s = 1, c = '#fff', t = 0) { return G(tr(x, y, s), path('M30 -50Q62 -46 56 -24Q50 -8 30 -10', 'none', 8) + rect(-34, -64, 68, 64, c, 10, DSW) + steam(0, -80, t, .45)); }
function dMonitor(x, y, s = 1, t = 0, seed = 1) { let l = ''; for (let i = 0; i < 4; i++) l += line(-70, -150 + i * 22, -30 + ((i * 37 + seed * 13 + Math.floor(t * 3) * 17) % 100), -150 + i * 22, 6, ['#5ec4f0', '#b994ec', '#7be07b', '#ffd23f'][i]);
  return G(tr(x, y, s), rect(-14, -50, 28, 50, '#555', 0, DSW) + rect(-60, -8, 120, 14, '#555', 5, DSW) + rect(-100, -190, 200, 140, '#2b2b33', 10, DSW) + rect(-88, -178, 176, 116, '#1d2a3a', 4, 0) + l); }
function dPenCup(x, y, s = 1) { return G(tr(x, y, s), line(-14, -40, -24, -96, 6, '#e2463a') + line(0, -40, 4, -104, 6, '#3a7bd5') + line(12, -40, 26, -90, 6, '#ffd23f') + rect(-28, -50, 56, 50, '#7aa6d8', 6, DSW)); }
function dPapers(x, y, s = 1) { return G(tr(x, y, s), G(tr(0, 0, 1, -6), rect(-60, -40, 120, 40, '#fff', 3, DSW)) + rect(-56, -52, 120, 14, '#f4f4f4', 2, 3) + rect(-60, -64, 120, 14, '#fff', 2, 3)); }
function dCooler(x, y, s = 1, t = 0) { let b = ''; for (let i = 0; i < 3; i++) { const k = (t * .6 + i / 3) % 1; b += circ(-10 + i * 12, -200 - k * 100, 6 * (1 - k * .5), 'rgba(255,255,255,.85)', 2, '#5ec4f0'); }
  return G(tr(x, y, s), rect(-55, -170, 110, 170, '#e9eef5', 10, DSW) + rect(-20, -120, 14, 20, '#3a7bd5', 3, 3) + rect(6, -120, 14, 20, '#e2463a', 3, 3) + path('M-45 -170L-45 -300Q-45 -330 0 -330Q45 -330 45 -300L45 -170Z', 'rgba(140,205,255,.75)', DSW) + b); }
function dFiling(x, y, s = 1) { let d = ''; for (let i = 0; i < 3; i++) d += rect(-70, -330 + i * 108, 140, 96, '#aeb8c6', 6, DSW) + rect(-26, -300 + i * 108, 52, 12, '#6c7380', 4, 0) + rect(-36, -324 + i * 108, 72, 18, '#fff', 2, 2); return G(tr(x, y, s), rect(-80, -340, 160, 340, '#c3ccd8', 8, DSW) + d); }
function dWBoard(x, y, w, h, title = '') { const pts = [0, .35, .25, .6, .5, .85].map((v, i) => [x + 30 + i * (w - 60) / 5, y + h - 30 - v * (h - 90)]);
  return rect(x, y, w, h, '#fff', 8, DSW) + rect(x + 8, y + 8, w - 16, h - 16, 'none', 4, 3, '#c9d2dc') + text(x + w / 2, y + 44, 'none', title, '#3a7bd5', 30) + path('M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L'), 'none', 7, '#36a85a') + circ(pts[5][0], pts[5][1], 9, '#36a85a', 0) + line(x + 20, y + h - 20, x + w - 20, y + h - 20, 3, '#8a95a3'); }
function dBinders(x, y, n = 6, seed = 2) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const c = PALD[Math.floor(r() * PALD.length)]; s += rect(x + i * 40, y - 110, 36, 110, c, 4, DSW) + circ(x + i * 40 + 18, y - 26, 7, '#fff', 2) + rect(x + i * 40 + 6, y - 92, 24, 30, '#fff', 2, 0); } return s; }
function dCoatRack(x, y, s = 1, c = '#5b6b8a') { return G(tr(x, y, s), ell(0, -6, 60, 14, '#6b4a2a', DSW) + line(0, -10, 0, -520, 10, '#6b4a2a') + line(-40, -500, 40, -470, 7, '#6b4a2a') + path('M-10 -480Q-70 -440 -70 -300L-10 -300Z', c, DSW) + path('M10 -470Q50 -440 46 -380', 'none', 10, '#e2463a')); }
function dCupboard(x, y, w, h, c = '#ffffff') { const n = Math.max(1, Math.round(w / 160)); let s = rect(x, y, w, h, c, 6, DSW); for (let i = 0; i < n; i++) { const dx = x + i * w / n; s += rect(dx + 10, y + 10, w / n - 20, h - 20, 'none', 6, 3, 'rgba(0,0,0,.2)') + circ(dx + (i % 2 ? 24 : w / n - 24), y + h - 30, 7, '#c9a77a', 3); } return s; }
function dStove(x, y, s = 1, t = 0) { return G(tr(x, y, s), rect(-150, -12, 300, 24, '#3b3f4a', 6, DSW) + line(-110, -78, -180, -96, 10) + rect(-110, -100, 220, 90, '#9aa3ad', 14, DSW) + rect(-120, -112, 240, 22, '#7d848c', 8, DSW) + steam(0, -130, t, .7)); }
function dUtensils(x, y, t) { const a = wave(t, .4, 4); return line(x - 20, y, x + 280, y, 8, '#9aa3ad') + G(tr(x + 30, y, 1, a), line(0, 0, 0, 110, 6) + ell(0, 126, 22, 16, '#c9ced6', DSW)) + G(tr(x + 100, y, 1, -a), line(0, 0, 0, 100, 6) + rect(-20, 100, 40, 50, '#e2463a', 6, DSW)) + G(tr(x + 170, y, 1, a * .7), line(0, 0, 0, 90, 6) + path('M-16 90L16 90L12 140L-12 140Z', '#ffd23f', DSW)) + G(tr(x + 240, y, 1, -a * .6), line(0, 0, 0, 20, 6) + circ(0, 74, 54, '#3b3f4a', DSW) + circ(0, 74, 36, '#555b66', 0)); }
function dTowel(x, y, c = '#ff8fb1', t = 0) { const sw = wave(t, .3, 3); return circ(x, y, 34, 'none', 7, '#c9ced6') + G(tr(x, y + 20, 1, sw), path('M-60 0L60 0L56 240L-56 240Z', c, DSW) + line(-56, 200, 56, 200, 6, 'rgba(255,255,255,.7)') + line(-56, 214, 56, 214, 4, 'rgba(255,255,255,.7)')); }
function dBottles(x, y, s = 1) { return G(tr(x, y, s), rect(-70, -110, 44, 110, '#7be07b', 12, DSW) + rect(-60, -130, 24, 22, '#fff', 4, 3) + rect(-18, -80, 40, 80, '#b994ec', 14, DSW) + circ(2, -90, 12, '#fff', 3) + rect(30, -130, 40, 130, '#5ec4f0', 8, DSW) + rect(38, -160, 24, 32, '#fff', 4, 3)); }
function dToothCup(x, y, s = 1) { return G(tr(x, y, s), line(-12, -50, -26, -130, 8, '#5ec4f0') + line(10, -50, 22, -134, 8, '#ff8fb1') + rect(-36, -150, 20, 22, '#fff', 4, 3) + rect(12, -156, 20, 22, '#fff', 4, 3) + path('M-36 -64L36 -64L30 0L-30 0Z', '#ffd23f', DSW)); }
function dSoftbox(x, y, s = 1, r = 0, k = 1) { return G(tr(x, y, s, r), circ(0, 0, 200, `rgba(255,255,255,${(.18 * k).toFixed(2)})`, 0) + line(0, 140, 0, 760, 10) + line(0, 760, -110, 900, 8) + line(0, 760, 110, 900, 8) + rect(-100, -140, 200, 280, '#3b3f4a', 16, DSW) + rect(-82, -122, 164, 244, `rgba(255,255,250,${Math.min(1, .75 + .25 * k).toFixed(2)})`, 10, 0)); }
function dCan(x, y, c, s = 1) { return G(tr(x, y, s), path('M-30 -80Q0 -120 30 -80', 'none', 3) + rect(-38, -80, 76, 80, '#d0d6de', 6, DSW) + rect(-38, -62, 76, 40, c, 0, 3) + ell(0, -80, 38, 8, '#aeb8c6', 3)); }
// PREMIER PLAN FLOU (3e couche de profondeur), toujours dans la zone basse (décor)
function fgB(kind, x, y, s = 1, t = 0, b = 10) { let g = '';
  if (kind === 'leaf') for (let i = 0; i < 5; i++) { const a = -160 + i * 32 + wave(t, .3, 4, i * .2); g += G(`rotate(${f1(a)})`, path('M0 0Q140 -70 300 0Q140 70 0 0Z', ['#3f8f55', '#4fa064', '#5fb85f'][i % 3], 6) + line(20, 0, 280, 0, 5, 'rgba(0,0,0,.25)')); }
  else if (kind === 'mug') g = dMug(0, 0, 3, '#ff8fb1', t);
  else if (kind === 'books') g = dBooks(-120, 0, 6, 9, 200);
  else if (kind === 'lamp') g = dLamp(0, 0, 2.2, 1, '#ffd23f');
  else if (kind === 'bush') g = dBush(0, 0, 2.4, '#4fa064', '#ff8fb1');
  else if (kind === 'chair') g = rect(-170, -380, 340, 380, '#e2463a', 40, 6) + rect(-140, -350, 280, 120, 'rgba(255,255,255,.25)', 24, 0);
  else if (kind === 'bottle') g = dBottles(0, 0, 2.6);
  else if (kind === 'pot') g = rect(-200, -200, 400, 200, '#3b3f4a', 30, 6) + rect(-240, -220, 480, 40, '#5b616e', 14, 6) + steam(0, -260, t, 1.6);
  else if (kind === 'plant') g = dPot(0, 0, 3, 2, t);
  else if (kind === 'flowers') g = dFlowers(-260, 260, 0, t, 8);
  else if (kind === 'cam') g = camTripod(0, 0, 1.4);
  else if (kind === 'cup') g = dPenCup(0, 0, 3.2);
  else if (kind === 'can') g = dCan(0, 0, '#9466d8', 3);
  else if (kind === 'weights') g = rect(-220, -60, 440, 40, '#9aa3ad', 10, 6) + rect(-260, -140, 70, 200, '#2b2b33', 16, 6) + rect(190, -140, 70, 200, '#2b2b33', 16, 6);
  return blur(b, G(tr(x, y, s), g)); }

// ---------- DÉCORS COMPOSÉS (15–30 éléments, 3 couches, 2–3 éléments animés) ----------
// chambre de jour : guirlande qui clignote, rideaux qui bougent, nuages dans la fenêtre
function bedroomDay(t, sky = ['#bfe0ff', '#e3f2ff']) {
  return dWall('#ffe6c8', '#ffd9b0', 'stripe', 'rgba(255,255,255,.3)') + rect(-M, 150, W + 2 * M, 16, '#fffaf0', 0, DSW) +
    dWindow(640, 290, 320, 370, t, { sky1: sky[0], sky2: sky[1], curtain: '#7aa6d8', seed: 3 }) + dPot(700, 683, .5, 3, t, '#ff8fb1') + dPot(905, 683, .45, 1, t) +
    dPoster(240, 490, 250, 330, '#9b5cff', ftext(0, 30, 'ZZZ', { size: 60, fill: '#fff' }) + sparkle(-80, -110, .35, '#fff6c8') + sparkle(76, -96, .25, '#fff6c8') + path('M-40 104Q0 134 40 104', 'none', 6, '#fff'), -3) +
    dFrameP(480, 380, 120, 150, 1) + dFrameP(490, 570, 110, 90, 2, '#ff8fb1', 4) + dGarland(30, 1050, 200, t, 12, 40) +
    dShelf(80, 800, 340, dBooks(100, 800, 7, 3) + dTrophy(320, 800, .75) + dJar(390, 800, .55, '#ff8fb1')) +
    // bureau à droite + table de chevet à gauche
    rect(850, 1080, 300, 26, '#c58e55', 6, DSW) + rect(870, 1106, 260, 150, '#b47a45', 6, DSW) + rect(890, 1128, 120, 50, '#c58e55', 4, 3) + circ(950, 1153, 6, OL, 0) + dLamp(1030, 1080, .75, 1, '#ff8fb1') + dPenCup(900, 1080, .8) +
    rect(-40, 1090, 190, 24, '#c58e55', 6, DSW) + rect(-30, 1114, 170, 140, '#b47a45', 6, DSW) + dLamp(70, 1090, .65, 0, '#ffd23f') + dSwitch(1040, 760) + dOutlet(570, 1190) +
    dBase(FL) + dParquet(FL) + dRug(CX, 1460, 760, 200, '#ff8fb1', '#fff') + dShoes(830, 1350, '#e2463a') + dBag(990, 1330, '#5ec4f0', 8) + dBall(130, 1420, '#ff8a3d', 20) + dBox(300, 1330, .7, -4);
}
// chambre de nuit : étoiles phosphorescentes qui scintillent, rideaux, ville allumée, réveil rouge
function nightRoom(t) {
  let s = dWall('#4a55a0', '#39428a', 'dots', 'rgba(255,255,255,.1)') + rect(-M, 150, W + 2 * M, 16, '#cfd6ff', 0, DSW) +
    dFrameP(470, 360, 110, 140, 0) + dFrameP(90, 640, 90, 110, 2, '#b994ec', -4) + G(tr(380, 230), circ(0, 0, 50, '#e6dcff', DSW) + circ(22, -14, 42, '#4a55a0', 0)) +
    dShelf(70, 780, 340, dBooks(90, 780, 7, 5) + dJar(320, 780, .5, '#b994ec') + ell(385, 750, 34, 30, '#c9a07a', DSW) + circ(372, 728, 12, '#c9a07a', DSW) + circ(398, 728, 12, '#c9a07a', DSW)) +
    rect(-40, 1090, 200, 24, '#8a6a4a', 6, DSW) + rect(-30, 1114, 180, 140, '#6e5236', 6, DSW) + dLamp(60, 1090, .6, 0, '#9aa3ad') + rect(110, 1040, 80, 50, '#2b2b33', 10, DSW) +
    rect(860, 1090, 300, 24, '#8a6a4a', 6, DSW) + rect(880, 1114, 260, 140, '#6e5236', 6, DSW) + dBooks(900, 1090, 4, 8, 70) +
    dBase(FL, '#cfd6ff') + dParquet(FL, '#7a5e44') + dRug(CX, 1460, 760, 200, '#6a4fc0', '#b994ec') + dShoes(820, 1350, '#ff8fb1') + dBox(980, 1340, .7, 6) + dOutlet(570, 1190);
  s += op(.4, rect(-M, -M, W + 2 * M, H + 2 * M, '#141a48', 0, 0));
  s += dWindow(620, 260, 360, 420, t, { night: 1, curtain: '#2d3a7a', fc: '#cfd6ff', seed: 9 });
  for (let i = 0; i < 9; i++) { const x = [120, 330, 520, 60, 420, 560, 1020, 1040, 190][i], y = [250, 230, 300, 620, 640, 880, 860, 300, 980][i]; s += op(.55 + .45 * Math.sin(t * 3 + i * 1.3), sparkle(x, y, .3 + (i % 3) * .08, '#d8ffb0')); }
  return s + text(150, 1078, 'none', '07:00', '#ff4d4d', 30) + circ(570, 1190, 46, 'rgba(255,220,120,.25)', 0);
}
function bedroomNight(t) { return nightRoom(t); }
function darkRoom(t, k = 1) { return nightRoom(t) + op(.62 * k, rect(-M, -M, W + 2 * M, H + 2 * M, '#05060f', 0, 0)) + op(.5 * k, circ(872, 365, 44, '#fff6d6', 0)); }
// salle de bain : serviette et fougère qui se balancent, goutte du robinet, reflets dans le miroir
function mirror(x, y, w, h) {
  const refl = op(.5, rect(x + 10, y + 40, 150, h, '#ffd6e3', 0, 0) + [0, 1, 2, 3].map(i => rect(x + 20 + i * 36, y + 40, 14, h, '#ff8fb1', 0, 0)).join('') + line(x, y + 40, x + 190, y + 40, 8, '#c9ced6') +
    rect(x + w - 150, y + 120, 130, h, '#e8d3b8', 4, 4) + circ(x + w - 130, y + 520, 9, '#c9a77a', 0) + rect(x + 170, y + h - 120, w - 340, 120, '#e8eef0', 0, 0));
  return rect(x - 22, y - 22, w + 44, h + 44, '#f1c27d', 30) + grad('#e6f6ff', '#b9dcef', x, y, w, h).replace('<rect', '<rect rx="18"') + dClip(x, y, w, h, refl, 18) + rect(x, y, w, h, 'none', 18) + line(x + 60, y + 80, x + 160, y + 20, 14, 'rgba(255,255,255,.7)') + line(x + 90, y + 140, x + 240, y + 40, 8, 'rgba(255,255,255,.5)'); }
function bathroom2(t) { const dr = (t * .9) % 1;
  return tiles('#cfeaf0', '#b2d6de') + rect(-M, 130, W + 2 * M, 50, '#8fc9d6', 0, DSW) + Array.from({ length: 30 }, (_, i) => path(`M${-300 + i * 70} 140l14 15l-14 15l-14 -15Z`, '#fff', 0)).join('') +
    dTowel(85, 470, '#ff8fb1', t) + dShelf(8, 900, 150, dBottles(85, 900, .5)) + dOutlet(90, 1100) +
    dShelf(918, 420, 160, dPot(1000, 420, .5, 2, t, '#7aa6d8')) + dShelf(918, 650, 160, dJar(960, 650, .5, '#b994ec', '#5ec4f0') + dJar(1035, 650, .45, '#7be07b', '#fff')) +
    circ(1000, 760, 10, '#c9ced6', DSW) + path('M1000 770Q960 800 950 1000L1060 1000Q1050 800 1000 770Z', '#7aa6d8', DSW) + line(985, 860, 1040, 860, 6, 'rgba(255,255,255,.6)') +
    line(950, 1130, 1050, 1130, 6, '#c9ced6') + rect(965, 1130, 70, 70, '#fff', 30, DSW) +
    rect(250, 224, 580, 34, '#fff', 14, DSW) + [0, 1, 2, 3].map(i => circ(320 + i * 147, 241, 26, `rgba(255,246,190,${(.25 + .1 * Math.sin(t * 7 + i)).toFixed(2)})`, 0) + circ(320 + i * 147, 241, 12, '#fff6c8', 3)).join('') +
    mirror(190, 300, 700, 820) +
    rect(60, 1290, 960, 40, '#f4efe6', 10, DSW) + rect(90, 1330, 900, 520, '#7aa6d8', 10, DSW) + rect(120, 1360, 410, 440, 'none', 10, 3, 'rgba(0,0,0,.2)') + rect(550, 1360, 410, 440, 'none', 10, 3, 'rgba(0,0,0,.2)') + circ(500, 1500, 9, '#fff', 3) + circ(580, 1500, 9, '#fff', 3) +
    sink(CX, 1300) + op(1 - dr, ell(CX - 108, 1250 + dr * 120, 7, 10, '#8fd0ff', 3)) + dToothCup(250, 1290, .85) + G(tr(840, 1290), rect(-30, -90, 60, 90, '#ff8fb1', 14, DSW) + rect(-8, -120, 16, 32, '#fff', 3, 3) + path('M8 -116L36 -116', 'none', 6)) + G(tr(940, 1290, 1, -8), rect(-50, -24, 100, 24, '#fff', 8, DSW) + rect(30, -20, 20, 16, '#7be07b', 4, 0));
}
// rue au matin : 3 couches (ville lointaine brumeuse / immeubles + commerces / trottoir, mobilier, voiture), néon qui clignote, oiseaux, passants
function rueMatin(t) {
  let s = SKY(t, '#ffd6a8', '#fff3e0') + dBirds(t, 140, 4, 3) + haze(.4, '#fff3e0', dSkyline(1000, '#e8b9a0', 6));
  const BL = [[-230, 300, 620, '#e7c9a0'], [70, 300, 780, '#cfd8e2', '#e2463a', 'BOULANGERIE'], [370, 290, 560, '#f0b8a8'], [660, 300, 820, '#bcd7c4', '#36a85a', 'PHARMACIE'], [960, 320, 660, '#f3d9a4', '#7aa6d8', 'CAFÉ']];
  BL.forEach((b, i) => s += dBld(b[0], FL, b[1], b[2], b[3], 11 + i, t, b[4] ? { shop: b[4], sign: b[5] } : {}));
  const on = Math.sin(t * 9) > -.4; s += G(tr(930, FL - 300), (on ? circ(0, 0, 50, 'rgba(80,220,120,.35)', 0) : '') + rect(-12, -36, 24, 72, on ? '#3ee07a' : '#2a7a4a', 3, DSW) + rect(-36, -12, 72, 24, on ? '#3ee07a' : '#2a7a4a', 3, DSW));
  s += rect(-M, FL, W + 2 * M, 340, '#d8cfc0', 0, 0) + Array.from({ length: 22 }, (_, i) => line(-300 + i * 90, FL, -380 + i * 90, FL + 340, 3, 'rgba(0,0,0,.08)')).join('') + [100, 200].map(y => line(-M, FL + y, W + M, FL + y, 3, 'rgba(0,0,0,.08)')).join('') + rect(-M, FL + 340, W + 2 * M, 20, '#b0a898', 0, DSW) + rect(-M, FL + 360, W + 2 * M, 600, '#8a9099', 0, 0) +
    Array.from({ length: 10 }, (_, i) => rect(-200 + i * 200, FL + 600, 100, 14, '#f4f4f4', 4, 0)).join('');
  s += dTreeV(560, FL + 30, .6, t, 2) + rect(510, FL - 6, 100, 40, '#b47a45', 6, DSW) + dLampPost(220, FL + 40, .9) + dLampPost(880, FL + 40, .9) + dSignP(410, FL + 50, .65, 'P') + dBike(120, FL + 70, .8, '#36c5b4') + dBin(1000, FL + 60, .7) + dFlowers(470, 650, FL + 10, t, 5);
  return s + kidsBg(t, 1290, 3, .5) + dCarP(760, FL + 580, 1.1, '#ff8a3d');
}
// parc : collines brumeuses + sapins lointains / arbres, banc, étang, clôture / fleurs ; cerf-volant, oiseaux, papillons, canard
function park(t) { const dk = wave(t, .15, 60);
  return SKY(t, '#9fe0ff', '#fff4dc') + dKite(840, 300, t) + dBirds(t, 180, 3, 9) +
    haze(.3, '#e6f6ff', dHills(1020, '#a8dca0', '#94d08a') + dTreeV(300, 1070, .42, t, 1) + dTreeV(380, 1080, .36, t, 1) + dTreeV(690, 1060, .45, t, 2) + dTreeV(770, 1070, .38, t, 1)) +
    rect(-M, 1100, W + 2 * M, 1000, '#8fd16a', 0, 0) + dFence(-120, 1220, 1110, '#fffaf0', 60) + path('M480 1100L600 1100Q700 1400 900 2000L100 2000Q350 1400 480 1100Z', '#efdfb8', 0) +
    ell(840, 1220, 170, 40, '#7fd0f0', DSW) + G(tr(840 + dk, 1214), ell(0, 0, 26, 14, '#fff', 3) + circ(18, -16, 11, '#fff', 3) + path('M28 -16l12 3l-12 3Z', '#ffb23f', 2)) +
    treeC(110, 1160, 1, t) + dTreeV(990, 1150, 1.05, t, 3) + dBench(560, 1140, .6) + dLampPost(410, 1130, .7) + dBin(260, 1150, .5) +
    G(tr(660, 1130), line(0, 0, 0, -110, 8, '#8a5a3a') + rect(-60, -150, 120, 50, '#c58e55', 6, DSW) + text(0, -114, 'none', 'PARC', '#fff', 30)) +
    dBush(-30, 1240, .9, '#5fb85f', '#ff8fb1') + dBush(1110, 1240, .9, '#4fa64f', '#ffd23f') + dFlowers(0, 1080, 1300, t, 4) +
    Array.from({ length: 10 }, (_, i) => circ((i * 211) % W, 1340 + (i * 97) % 500, 10, ['#ffd23f', '#ff8fb1', '#fff'][i % 3], 3)).join('') +
    dButterfly(300, 1040, t) + dButterfly(760, 960, t + 3, '#ff8fb1');
}
// bureau RH : fontaine à bulles, horloge, nuages ; diplômes, classeurs, portemanteau, placard, moquette
function bureauRH(t) {
  return dWall('#e9eef5', '#d3dce8', 'stripe', 'rgba(255,255,255,.35)') + rect(-M, 900, W + 2 * M, 350, '#cdd7e5', 0, DSW) + Array.from({ length: 20 }, (_, i) => line(-300 + i * 90, 900, -300 + i * 90, FL, 3, 'rgba(0,0,0,.07)')).join('') +
    line(CX, -M, CX, 140, 4) + circ(CX, 175, 120, 'rgba(255,250,220,.25)', 0) + rect(CX - 160, 140, 320, 34, '#fff', 14, DSW) +
    dWindow(640, 300, 340, 400, t, { sky1: '#bfe0ff', seed: 7, noTree: 1 }) + Array.from({ length: 7 }, (_, i) => line(640, 330 + i * 52, 980, 330 + i * 52, 6, 'rgba(120,130,150,.35)')).join('') + dPot(700, 722, .45, 1, t) +
    wallClock(240, 330, 66, t) + dDiploma(250, 540, -2) + dPoster(480, 360, 140, 190, '#36c5b4', sparkle(0, -20, .8, '#ffd23f') + text(0, 66, 'none', 'TEAM', '#fff', 34), 3) +
    dShelf(50, 790, 390, dBinders(70, 790, 7, 3) + dPot(400, 790, .42, 0, t)) + dCalW(560, 620, .8, '15') +
    dFiling(560, FL, .72) + dCooler(930, FL, .8, t) + dCoatRack(1050, FL, .9) + plant(100, FL, 1.15) + dOutlet(450, 1180) +
    dBase(FL, '#fff') + dTiles(FL, '#b8a48c', '#ae9a82', 120);
}
function bureauDesk(y = 1240, t = 0) { return rect(40, y - 40, 1000, 60, '#d9a066', 14) + rect(70, y + 20, 940, 400, '#b9824e', 6) + rect(110, y + 60, 300, 140, 'none', 8, 3, 'rgba(0,0,0,.25)') + rect(670, y + 60, 300, 140, 'none', 8, 3, 'rgba(0,0,0,.25)') + circ(390, y + 130, 8, OL, 0) + circ(690, y + 130, 8, OL, 0) +
  dPapers(560, y - 40, .9) + dPenCup(650, y - 40, .75) + G(tr(470, y - 40), path('M-56 0L56 0L46 -40L-46 -40Z', '#3b3f4a', DSW) + text(0, -10, 'none', 'RH', '#ffd23f', 26)) + dMug(990, y - 40, .8, '#fff', t) + dPot(110, y - 40, .4, 1, t); }
// cuisine de mamie : lampe suspendue qui oscille, casserole qui fume, toasts qui sautent, rideaux
function cuisine(t) { let s = grad('#fff3c4', '#ffe7a0', -M, -M, W + 2 * M, H + 2 * M); for (let i = -6; i < 16; i++) s += rect(i * 110, -M, 40, H + 2 * M, 'rgba(255,170,90,.18)', 0, 0);
  for (let y = 960; y < 1160; y += 50) for (let x = -200 + ((y / 50) % 2) * 25; x < W + 200; x += 50) s += rect(x, y, 50, 50, (x / 50 + y / 50) % 2 ? '#fffaf0' : '#e6f3ff', 0, 2, 'rgba(0,0,0,.08)');
  const toast = Math.max(0, Math.sin(t * 2.2)) * 50;
  return s + dWindow(380, 270, 320, 320, t, { sky1: '#bfe8ff', sky2: '#e8f7ff', curtain: '#ff8fb1', seed: 4 }) + dPot(450, 612, .42, 3, t) + dPot(630, 612, .4, 0, t) +
    wallClock(170, 300, 56, t) + dFrameP(165, 520, 170, 200, 4) + dCalW(165, 790, .85, '24') + dPendant(CX, 190, t, '#e2463a', 200) +
    dCupboard(760, 200, 320, 220, '#fff') + dShelf(750, 560, 330, dJar(800, 560, .7, '#ffe08a') + dJar(875, 560, .7, '#c58e55', '#7aa6d8') + dJar(950, 560, .7, '#fff', '#36a85a') + dBooks(995, 560, 3, 7, 80)) + dUtensils(780, 690, t) +
    rect(-M, 1150, W + 2 * M, 30, '#c58e55', 0, DSW) + dStove(900, 1150, .8, t) + G(tr(170, 1150), rect(-34, -60 - toast, 30, 50, '#e6b47c', 6, DSW) + rect(6, -60 - toast * .8, 30, 50, '#e6b47c', 6, DSW) + rect(-70, -76, 140, 76, '#ff8fb1', 18, DSW) + rect(-46, -72, 30, 8, OL, 3, 0) + rect(16, -72, 30, 8, OL, 3, 0)) + dOutlet(330, 1100) +
    rect(-M, FL, W + 2 * M, 1400, '#a5d6a7', 0, 0);
}
function nappe(y = 1230) { return rect(20, y - 30, 1040, 50, '#ffffff', 16) + Array.from({ length: 13 }, (_, i) => rect(20 + i * 80, y - 30, 40, 50, 'rgba(226,70,58,.55)', 0, 0)).join('') + rect(20, y - 30, 1040, 50, 'none', 16) + rect(60, y + 20, 960, 400, '#c58e55', 6); }
// maison de mamie : cheminée qui fume, oiseaux, fleurs qui dansent ; volets, jardinière, couronne, boîte aux lettres, nain de jardin, clôture
function mamieHouse(t) { let s = SKY(t) + dBirds(t, 140, 3, 4) + haze(.3, '#e6f6ff', dHills(1090, '#a8dca0', '#94d08a') + dTreeV(70, 1110, .5, t, 1) + dTreeV(1030, 1100, .45, t, 1)) + rect(-M, 1150, W + 2 * M, 1000, '#8fd16a', 0, 0);
  for (let i = 0; i < 4; i++) { const k = (t * .35 + i / 4) % 1; s += op((1 - k) * .85, circ(755 + k * 90 + wave(t, .5, 10, i), 300 - k * 260, 24 + k * 40, '#f2f2f2', 3, 'rgba(0,0,0,.1)')); }
  s += rect(720, 330, 70, 170, '#c46a4a', 4, DSW) + rect(708, 316, 94, 26, '#a85a3e', 4, DSW) + path('M180 620L540 320L900 620Z', '#e2463a', DSW);
  for (let j = 1; j < 5; j++) s += line(180 + j * 72, 620 - j * 60, 900 - j * 72, 620 - j * 60, 4, 'rgba(0,0,0,.18)');
  s += circ(540, 510, 40, '#bfe0ff', DSW) + line(500, 510, 580, 510, 4) + line(540, 470, 540, 550, 4) + rect(220, 620, 640, 600, '#fff1d6', 0, DSW) + [[250, 980], [300, 1010], [780, 700], [820, 730], [790, 1100]].map(([x, y]) => rect(x, y, 50, 24, '#f0d2a8', 4, 3)).join('');
  for (const wx of [280, 640]) s += dWindow(wx, 700, 180, 170, t, { seed: wx, noTree: 1 }) + rect(wx - 74, 690, 56, 190, '#5fb85f', 6, DSW) + rect(wx + 198, 690, 56, 190, '#5fb85f', 6, DSW) + [0, 1, 2, 3].map(i => line(wx - 66, 720 + i * 40, wx - 26, 720 + i * 40, 3) + line(wx + 206, 720 + i * 40, wx + 246, 720 + i * 40, 3)).join('') + rect(wx - 10, 892, 200, 40, '#c46a4a', 6, DSW) + dFlowers(wx + 4, wx + 190, 894, t, wx);
  s += rect(470, 860, 140, 360, '#8a5a3a', 10, DSW) + rect(490, 880, 100, 140, 'none', 6, 3, 'rgba(0,0,0,.25)') + rect(490, 1040, 100, 150, 'none', 6, 3, 'rgba(0,0,0,.25)') + circ(585, 1050, 10, '#ffd23f', 4) + circ(540, 945, 36, 'none', 12, '#4fa64f') + circ(540, 912, 9, '#e2463a', 3) +
    rect(640, 860, 60, 44, '#3a7bd5', 6, DSW) + text(670, 893, 'none', '12', '#fff', 28) + G(tr(430, 900), rect(-16, -30, 32, 50, '#ffe9a0', 6, DSW) + circ(0, -5, 24, 'rgba(255,230,140,.35)', 0)) + rect(450, 1210, 180, 20, '#c9b8a0', 4, DSW) +
    path(`M222 1220Q200 1000 240 820Q210 700 230 640`, 'none', 7, '#3f8f55') + [0, 1, 2, 3, 4, 5].map(i => circ(222 + (i % 2 ? 14 : -6), 1180 - i * 90, 16, '#5fb85f', 3)).join('');
  s += treeC(1000, 1180, .9, t) + G(tr(110, 1230), line(0, 0, 0, -120, 10, '#8a5a3a') + rect(-46, -180, 92, 64, '#3a7bd5', 14, DSW) + rect(40, -200, 10, 50, '#e2463a', 2, 2)) +
    dFence(-60, 440, 1250, '#fffaf0', 100) + dFence(650, 1160, 1250, '#fffaf0', 100) + [0, 1, 2, 3].map(i => ell(540 + (i % 2 ? 20 : -20), 1270 + i * 70, 50 + i * 8, 16 + i * 3, '#d8cfc0', 3)).join('') +
    G(tr(960, 1300, .9), ell(0, 0, 40, 10, 'rgba(0,0,0,.15)', 0) + rect(-26, -60, 52, 60, '#3a7bd5', 12, DSW) + path('M-26 -40Q0 0 26 -40L20 -70L-20 -70Z', '#fff', DSW) + circ(0, -80, 20, '#f2c9a0', DSW) + path('M-24 -90L0 -150L24 -90Z', '#e2463a', DSW));
  return s + Array.from({ length: 8 }, (_, i) => G(tr(80 + i * 135, 1300 + (i % 2) * 30, 1, wave(t, .7, 6, i)), line(0, 0, 0, -50, 5, '#4fa64f') + circ(0, -60, 18, ['#ff8fb1', '#ffd23f', '#fff', '#b56cff'][i % 4], 4))).join('');
}
// studio photo : softbox qui pulsent, poussières dans la lumière ; fond papier, photos d'identité, câbles, réflecteur, sacs de sable
function studioPhoto(t) { const pl = .8 + .2 * Math.sin(t * 3);
  let s = dWall('#c9ced8', '#aab1be', 'stripe', 'rgba(255,255,255,.08)', 1300) + wallClock(110, 220, 46, t) +
    G(tr(110, 470), rect(-80, -110, 160, 220, '#fff', 8, DSW) + [0, 1, 2, 3, 4, 5].map(i => { const x = -36 + (i % 2) * 72, y = -66 + Math.floor(i / 2) * 68; return rect(x - 26, y - 28, 52, 58, '#cfe3ff', 3, 2) + circ(x, y - 4, 13, ['#f2c9a0', '#c98a5e', '#f6d7b8'][i % 3], 2); }).join('')) +
    G(tr(970, 230, 1, 4), rect(-100, -44, 200, 88, '#ffd23f', 12, DSW) + text(0, -6, 'none', 'PHOTO', OL, 30) + text(0, 26, 'none', '5 MIN', '#e2463a', 26)) +
    rect(170, 132, 740, 46, '#7d93ad', 23, DSW) + rect(196, 170, 688, 1130, '#a9bfd6', 0, DSW) + path('M196 1300Q196 1380 120 1400L960 1400Q884 1380 884 1300Z', '#a9bfd6', 0) +
    glow(CX, 800, 520, '#ffffff', .4 * pl) + dSoftbox(110, 620, .95, -10, pl) + dSoftbox(970, 620, .95, 10, pl) +
    rect(-M, 1400, W + 2 * M, 1400, '#6c7380', 0, 0) + path(`M${CX - 50} 1440L${CX + 50} 1500M${CX + 50} 1440L${CX - 50} 1500`, 'none', 8, '#ffd23f') +
    path('M110 1480Q300 1560 420 1520T700 1600T1000 1520', 'none', 6, '#2b2b33') + rect(60, 1460, 100, 46, '#7d6a4a', 18, DSW) + rect(920, 1460, 100, 46, '#7d6a4a', 18, DSW) +
    G(tr(1030, 1180, 1, 18), ell(0, 0, 56, 90, '#ffd76b', DSW) + ell(-10, -20, 20, 40, 'rgba(255,255,255,.5)', 0)) + dPot(40, 1400, .8, 2, t) + dBag(150, 1420, '#3b3f4a', -6);
  for (let i = 0; i < 14; i++) { const x = 300 + (i * 131) % 480, y = 500 + ((i * 197 + t * 20) % 600); s += circ(x + wave(t, .2, 14, i * .3), y, 3, 'rgba(255,255,255,.7)', 0); }
  return s; }
// open space : nuages dans les vitres, collègues qui parlent, écrans qui défilent, avion en papier
function openSpace(t) { let s = dWall('#f2f6fb', '#dfe7f1', 'stripe', 'rgba(255,255,255,.45)');
  for (let i = 0; i < 3; i++) s += dWindow(60 + i * 340, 250, 280, 360, t, { seed: 20 + i, noTree: 1, ph: i * 120 }) + line(200 + i * 340, -M, 200 + i * 340, 120, 3) + circ(200 + i * 340, 140, 110, 'rgba(255,250,220,.2)', 0) + rect(110 + i * 340, 118, 180, 24, '#fff', 12, DSW);
  s += dWBoard(80, 680, 300, 230, 'OBJECTIFS') + wallClock(540, 760, 58, t) + G(tr(640, 720), [0, 1, 2, 3].map(i => rect((i % 2) * 64, Math.floor(i / 2) * 64, 54, 54, ['#fff59d', '#ffc2d6', '#bfe3ff', '#c8f2c0'][i], 3, 3)).join('')) +
    dShelf(730, 930, 300, dBinders(750, 930, 5, 4) + dPot(985, 930, .42, 0, t));
  const px = ((t * 260) % 1700) - 300; s += G(tr(px, 640 + wave(t, .5, 20), 1, wave(t, .5, 6)), path('M0 0L-70 -16L-56 0L-70 16Z', '#fff', 3) + line(-56, 0, 0, 0, 2));
  s += rect(-M, 980, W + 2 * M, 30, '#7d8a9c', 0, DSW) + dBase(FL, '#fff') + dTiles(FL, '#9aa7b8', '#909db0', 120);
  for (let i = 0; i < 3; i++) s += person({ age: 'adult', x: 150 + i * 390, y: 1180, s: .55, hair: ['bun', 'short', 'curly'][i], hairColor: ['#8a5a3a', '#2b2420', '#e0a040'][i], shirt: ['#7aa6d8', '#ffd23f', '#7be07b'][i], expr: 'talk', seed: 60 + i }, t);
  s += rect(-M, 1130, W + 2 * M, 22, '#d9a066', 0, DSW);
  for (let i = 0; i < 3; i++) s += dMonitor(150 + i * 390 - 90, 1132, .7, t, i) + dMug(150 + i * 390 + 110, 1130, .55, PALD[i], t) + (i === 1 ? dPot(150 + i * 390 + 170, 1130, .35, 1, t) : dPenCup(150 + i * 390 + 170, 1130, .6));
  return s + dCooler(1040, FL, .7, t); }
// salon de famille (B014) : papier peint losanges, appliques, console, lampe, vase, plante, tapis, chat qui remue la queue
function famWall(t) { const tail = wave(t, .6, 18);
  return dWall('#ffe0e8', '#ffd0dc', 'diamond', 'rgba(255,255,255,.5)') + rect(-M, 170, W + 2 * M, 20, '#fff', 0, DSW) + rect(-M, 260, W + 2 * M, 10, '#fff', 0, 0) +
    [40, 1040].map(x => G(tr(x, 760), circ(0, -40, 90, 'rgba(255,230,140,.25)', 0) + rect(-12, -10, 24, 50, '#c9a77a', 6, DSW) + path('M-36 -10L36 -10L24 -70L-24 -70Z', '#fff6d6', DSW))).join('') +
    dFrameP(540, 300, 90, 70, 3, '#ffd23f') + dFrameP(60, 420, 80, 100, 0) + dFrameP(1020, 420, 80, 100, 4) +
    rect(150, 1160, 780, 26, '#c58e55', 6, DSW) + rect(180, 1186, 20, 70, '#a87444', 0, DSW) + rect(880, 1186, 20, 70, '#a87444', 0, DSW) + dLamp(250, 1160, .75, 1, '#ff8fb1') + dPot(840, 1160, .55, 3, t, '#7aa6d8') + ell(560, 1146, 50, 14, '#b994ec', DSW) + dFrameP(680, 1110, 70, 90, 1, '#7aa6d8') + dOutlet(980, 1190) +
    dBase(FL) + dParquet(FL) + dRug(CX, 1480, 720, 190, '#b994ec', '#fff') + dPot(30, FL + 30, 1.1, 2, t) +
    G(tr(760, 1430), path(`M60 0Q110 -10 ${f1(120 + tail)} -60`, 'none', 14, OL) + path(`M60 0Q110 -10 ${f1(120 + tail)} -60`, 'none', 7, '#9aa3ad') + ell(0, 0, 80, 34, '#9aa3ad', DSW) + circ(-70, -20, 30, '#9aa3ad', DSW) + path('M-92 -40L-88 -64L-72 -46M-60 -46L-50 -64L-46 -40', '#9aa3ad', 3) + path('M-82 -18q6 4 12 0', 'none', 3));
}
// rayon peinture (B015) : étagère de pots, nuanciers, échelle, goutte qui tombe, lampe suspendue
function paintShop(t) { const cols = ['#ff8fb1', '#ffd23f', '#7be07b', '#5ec4f0', '#b994ec', '#ff8a3d', '#e2463a', '#36c5b4', '#9466d8', '#f6d7b8', '#6e3fb8', '#7aa6d8'], dr = (t * .8) % 1;
  let s = dWall('#f4efe6', '#e9e0d0', 'stripe', 'rgba(255,255,255,.4)') + dPendant(200, 140, t, '#3b3f4a', 120) + dPendant(880, 140, t + .7, '#3b3f4a', 120) +
    dShelf(20, 300, 1040, cols.map((c, i) => dCan(70 + i * 86, 300, c, .85)).join('')) + op(1 - dr, ell(674 + 6, 316 + dr * 260, 7, 11, '#9466d8', 3)) + path('M664 230Q676 250 672 286', 'none', 8, '#9466d8');
  for (const bx of [50, 830]) { s += rect(bx, 360, 200, 440, '#fff', 10, DSW); for (let c = 0; c < 4; c++) for (let r = 0; r < 7; r++) s += rect(bx + 16 + c * 45, 378 + r * 58, 38, 48, lerpColor(cols[(c + (bx > 400 ? 6 : 0)) % 12], '#ffffff', r / 8), 4, 2); }
  s += G(tr(1050, FL, 1, 10), line(-50, 0, -50, -760, 10, '#c9a77a') + line(50, 0, 50, -760, 10, '#c9a77a') + [0, 1, 2, 3, 4, 5].map(i => line(-50, -60 - i * 120, 50, -60 - i * 120, 8, '#c9a77a')).join('')) +
    dShelf(20, 1170, 1040, cols.slice(0, 11).map((c, i) => dCan(80 + i * 92, 1170, cols[(i + 5) % 12], .75)).join('')) +
    dBase(FL) + dTiles(FL, '#d9d2c4', '#cfc6b6', 100) + path('M-50 1500Q300 1440 700 1500L760 1700L-50 1700Z', '#f4f1ea', DSW) + [[120, 1560, '#ff8fb1'], [380, 1600, '#5ec4f0'], [560, 1540, '#ffd23f']].map(([x, y, c]) => ell(x, y, 40, 16, c, 0)).join('') +
    G(tr(880, 1420), path('M-90 0L90 0L70 40L-70 40Z', '#9aa3ad', DSW) + ell(0, 10, 60, 10, '#9466d8', 0) + G(tr(30, -20, 1, -20), rect(-60, -24, 120, 48, '#9466d8', 20, DSW) + line(60, 0, 120, -40, 6))) + G(tr(150, 1380), dJar(0, 0, 1.2, '#e9e0d0', '#9aa3ad') + line(-10, -84, -20, -150, 8, '#c58e55') + line(10, -84, 20, -146, 8, '#c58e55'));
  return s; }
// salle de classe (B016) : fanions qui flottent, horloge, squelette qui se balance ; tableau, bureau du prof, globe, pomme, livres
function classAnat(t) { let g = '';
  for (let i = 0; i < 11; i++) { const x = 40 + i * 80, y = 175 + 20 * Math.sin(i / 10 * Math.PI); g += path(`M${x} ${y}L${x + 70} ${y + 4}L${x + 35 + wave(t, .8, 6, i * .2)} ${y + 60}Z`, PALD[i % PALD.length], 3); }
  return grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 1000, W + 2 * M, 260, '#f0d0a0', 0, DSW) + path('M40 175Q480 215 920 175', 'none', 3) + g +
    blackboard(80, 300, 920, 760) + text(200, 360, 'none', 'lundi 12', 'rgba(255,255,255,.6)', 30) + heart(920, 360, .45, 'rgba(255,255,255,.2)') + rect(180, 1056, 40, 10, '#fff', 3, 0) + rect(240, 1056, 30, 10, '#ffb0c8', 3, 0) + rect(820, 1046, 80, 22, '#5b6b8a', 4, 3) +
    wallClock(990, 230, 56, t) +
    rect(370, 1140, 440, 26, '#c58e55', 6, DSW) + rect(390, 1166, 400, 120, '#b47a45', 6, DSW) + circ(430, 1110, 28, '#e2463a', DSW) + path('M430 1082q10 -20 24 -18', 'none', 5, '#4fa64f') +
    G(tr(570, 1140), path('M-30 0L30 0L20 -16L-20 -16Z', '#8a5a3a', DSW) + line(0, -16, 0, -36, 6) + circ(0, -90, 54, '#5ec4f0', DSW) + path('M-30 -110Q-10 -130 10 -110Q20 -90 0 -80Q-20 -90 -30 -110Z', '#7be07b', 0) + path('M14 -70Q30 -76 36 -60', 'none', 8, '#7be07b') + path('M-50 -140Q-80 -90 -50 -40', 'none', 5, '#c9a77a')) +
    rect(660, 1100, 110, 20, '#7aa6d8', 3, DSW) + rect(670, 1080, 100, 20, '#ffd23f', 3, DSW) + rect(655, 1060, 105, 20, '#ff8fb1', 3, DSW) +
    G(tr(110, FL, 1, wave(t, .4, 3)), line(0, 0, 0, -80, 8, '#8a95a3') + ell(0, 0, 50, 10, '#8a95a3', DSW) + line(0, -80, 0, -330, 7, '#f4f1ea') + [0, 1, 2, 3].map(i => path(`M-40 ${-300 + i * 36}Q0 ${-316 + i * 36} 40 ${-300 + i * 36}`, 'none', 7, '#f4f1ea')).join('') + circ(0, -370, 42, '#f4f1ea', DSW) + circ(-14, -374, 9, OL, 0) + circ(14, -374, 9, OL, 0) + line(-12, -346, 12, -346, 4) + path('M-40 -300L-70 -200M40 -300L70 -200', 'none', 7, '#f4f1ea')) +
    dBase(FL) + dParquet(FL);
}
// salle de sport (B019) : briques, banderole, râteliers d'haltères, disques, kettlebells, lampes industrielles qui oscillent
function gymBg(t) {
  return dWall('#e9d7c4', '#dcc4ac', 'brick', 'rgba(200,120,90,.25)') + dPendant(250, 150, t, '#3b3f4a', 160) + dPendant(830, 150, t + .5, '#3b3f4a', 160) +
    rect(150, 190, 780, 80, '#e2463a', 12, DSW) + text(CX, 248, 'none', 'NO PAIN NO GAIN', '#fff', 46) +
    dPoster(110, 470, 140, 190, '#ffd23f', path('M-40 40Q-40 -10 -10 -20Q0 -60 30 -50Q50 -20 20 0Q50 20 30 50Z', '#f2c9a0', 4), -4) + dPoster(970, 470, 140, 190, '#5ec4f0', G('scale(.45)', dumbbellC(-30)), 4) + wallClock(970, 700, 50, t) +
    rect(20, 1020, 320, 22, '#3b3f4a', 6, DSW) + rect(20, 1130, 320, 22, '#3b3f4a', 6, DSW) + line(40, 1020, 40, FL, 10, '#3b3f4a') + line(320, 1020, 320, FL, 10, '#3b3f4a') +
    [0, 1, 2].map(i => G(tr(80 + i * 100, 1002, .32), dumbbellC(0)) + G(tr(80 + i * 100, 1112, .36), dumbbellC(0))).join('') +
    line(960, FL, 960, 960, 12, '#3b3f4a') + [0, 1, 2].map(i => circ(960, 1180 - i * 26, 80 - i * 14, ['#2b2b33', '#e2463a', '#3a7bd5'][i], DSW) + circ(960, 1180 - i * 26, 14, '#9aa3ad', 3)).join('') +
    dBase(FL, '#3b3f4a') + dTiles(FL, '#4a4f5a', '#444955', 140) +
    [[310, 1330, '#e2463a'], [770, 1340, '#3a7bd5']].map(([x, y, c]) => G(tr(x, y), path('M-26 -60Q-26 -96 0 -96Q26 -96 26 -60', 'none', 12, OL) + circ(0, -34, 40, c, DSW))).join('') +
    G(tr(880, 1320), rect(-20, -90, 40, 90, 'rgba(140,205,255,.8)', 10, DSW) + rect(-12, -110, 24, 22, '#3b3f4a', 4, 3)) + G(tr(150, 1340, 1, -6), rect(-90, -16, 180, 32, '#ff8fb1', 8, DSW));
}

// ---------- accessoires ----------
// lit vu de face : tête posée sur l'oreiller (o = options heroHead), couverture
function lit(x, y, s, t, o = {}, col = '#9b5cff') { const br = 1.5 * Math.sin(t * 2.2);
  return G(tr(x, y, s), rect(-360, -300, 80, 380, '#8a5a3a', 24) + rect(-330, -40, 700, 100, '#fff', 24) + rect(-320, 60, 30, 120, '#8a5a3a', 8) + rect(330, 60, 30, 120, '#8a5a3a', 8) + ell(-180, -70, 130, 55, '#fff') +
    heroHead(-180, -150, 95, Object.assign({ tilt: -8 }, o), t) + path(`M-80 ${-60 - br}Q120 ${-120 - br} 360 ${-70}L360 70L-60 70Q-110 0 -80 ${-60 - br}Z`, col) + path(`M-40 ${-30 - br}Q140 ${-80 - br} 340 -40`, 'none', 5, 'rgba(255,255,255,.4)')); }
function zzz(x, y, t, s = 1) { let g = ''; for (let i = 0; i < 3; i++) { const k = (t * .7 + i / 3) % 1; g += op(1 - k, ftext(x + k * 120 + Math.sin(k * 6) * 20, y - k * 260, 'Z', { size: (40 + k * 50) * s, fill: '#fff' })); } return g; }
function glassW(fill = 1) { return path('M-30 -60L30 -60L24 40L-24 40Z', 'rgba(220,240,255,.8)', 5) + (fill > 0 ? path(`M${f1(-24 - 6 * fill)} ${f1(40 - 96 * fill)}L${f1(24 + 6 * fill)} ${f1(40 - 96 * fill)}L24 40L-24 40Z`, '#7fc8ff', 0) : ''); }
function jarC(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-80, -60, 160, 110, '#fff', 20) + rect(-90, -100, 180, 50, '#9b5cff', 16) + ftext(0, 20, 'ANTI', { size: 34, fill: '#9b5cff', stroke: 'none' }) + ftext(0, 48, 'CERNES', { size: 26, fill: '#9b5cff', stroke: 'none' })); }
function camTripod(x, y, s) { return G(tr(x, y, s), line(0, 0, -140, 500, 14) + line(0, 0, 140, 500, 14) + line(0, 0, 0, 520, 14) + rect(-170, -150, 340, 200, '#3a3f4a', 30) + circ(0, -50, 80, '#2b2b33') + circ(0, -50, 46, '#5ec4f0', 6) + rect(90, -190, 70, 40, '#555', 8)); }
function pillowC(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M-120 -70Q0 -95 120 -70Q140 0 120 70Q0 95 -120 70Q-140 0 -120 -70Z', '#fff') + path('M-60 -20Q0 -30 60 -20', 'none', 4, 'rgba(0,0,0,.15)')); }
function coffeeXXL(x, y, s, r = 0, t = 0) { return G(tr(x, y, s, r), path('M88 -50Q160 -40 140 20Q130 60 76 50', 'none', 18) + path('M-90 -100L90 -100L70 100L-70 100Z', '#fff') + rect(-86, -40, 172, 50, '#9b5cff', 0, 0) + path('M-90 -100L90 -100L70 100L-70 100Z', 'none') + ftext(0, 0, 'XXL', { size: 42, fill: '#fff', stroke: 'none' }) + steam(-20, -160, t, .8) + steam(30, -150, t + .4, .8)); }
function envelopeC(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-110, -70, 220, 140, '#fff', 10) + path('M-110 -70L0 10L110 -70', 'none', 6) + circ(0, 10, 18, '#e2463a', 4)); }
function bulbC(x, y, s, on = 1) { return G(tr(x, y, s), (on ? glow(0, -20, 180, '#fff6a0', .7) : '') + circ(0, -30, 70, on ? '#fff36b' : '#ddd') + rect(-34, 30, 68, 50, '#9aa3ad', 10) + path('M-20 -30Q0 -60 20 -30', 'none', 5)); }
function dumbbellC(r = 0) { return G(`rotate(${r})`, rect(-110, -12, 220, 24, '#9aa3ad', 10) + rect(-150, -50, 50, 100, '#2b2b33', 12) + rect(100, -50, 50, 100, '#2b2b33', 12)); }
function recFrame(t) { let s = ''; for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) s += path(`M${CX + a * 420} ${800 + b * 400 - b * 90}L${CX + a * 420} ${800 + b * 400}L${CX + a * 420 - a * 90} ${800 + b * 400}`, 'none', 10, '#fff'); return s + circ(170, 450, 16, Math.sin(t * 6) > 0 ? '#ff3b30' : 'rgba(0,0,0,0)', 0) + ftext(200, 464, 'REC', { size: 40, anchor: 'start', fill: '#fff' }); }
function flashW(t, t0, d = .3) { return t > t0 ? op(1 - seg(t, t0, t0 + d), rect(-300, -300, W + 600, H + 600, '#fff', 0, 0)) : ''; }

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, tête cut-out aux cernes, « débloqué » en étoiles, titre cinétique
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const P = at(1, 'permanents') - .05; return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 900, t, P, { part: 'back', r: 480 }) +
    G(tr(CX, 900, 1 + .03 * Math.sin(t * 6)), cutout(heroHead(0, 0, 175, { expr: t > P ? 'jawdrop' : 'joy', ck: 1.35 }, t), 14)) + unlock(CX, 900, t, P, { part: 'front', r: 480 }) + funBox(CX, 940, 330, 115, t, P + .3, { label: 'cernes.png' }) +
    kthin("POURQUOI C'EST HORRIBLE", CX, 330, t, .05, { size: 52 }) + kthin("D'AVOIR DES CERNES", CX, 415, t, .3, { size: 58 }) + kword('PERMANENTS ?', CX, 540, t, P, { size: 82, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'cernes'), 'glint', .6], [at(1, 'permanents') - .05, 'boom', .6], [at(1, 'permanents') + .25, 'tick', .5]] });
// B002a — « Tu dors dix heures » : papier, lit en cut-out, compteur 10 H
const o2 = at(2, 'bois') - .15;
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => paper(SX.paper) + gobo(T, .12) + burst(CX, 980, 380, t, .05, '#e6dcff', 18) + cutout(lit(CX + 40, 1120, 1.15, t, { expr: 'zen' }), 12) + zzz(CX - 60, 860, t) +
    funTag(CX, 470, `${counter(0, 10, t, at(2, 'dix') - .1, .5)} H`, t, at(2, 'dix') - .15, { size: 90, bg: SX.acc }) + kthin('de sommeil', CX, 610, t, at(2, 'heures'), { size: 52, fill: SX.ink }),
  sfx: [[0, 'pop', .5], [at(2, 'dors'), 'hmm', .3], [at(2, 'dix') - .15, 'pop_hi', .6], [at(2, 'heures'), 'ding', .5]] });
// B002b — « tu bois de l'eau, tu te réveilles reposé » : grille violette, verre d'eau cul sec puis réveil extatique
B(2, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Rv = at(2, 'reveilles') - o2, fill = 1 - seg(t, .1, Rv - .1), up = t > Rv;
    return gridBg('#2a1f45') + halftoneFade(SX.acc, .12, 1) + (up ? burst(CX, 1000, 360, t, Rv, SX.acc2, 16) : '') +
      cutout(ado({ x: CX, y: 1500, s: 1.4, expr: up ? 'ecstatic' : 'zen', armR: up ? [-30, -70] : [30, -115], armL: up ? [210, 250] : undefined, holdR: up ? '' : glassW(fill) }, t), 12) +
      (up ? popStars(CX, 1000, t, Rv, 8, 330) : '') + funTag(CX - 230, 450, "EAU ✓", t, .05, { size: 54, bg: SX.cool }) + funTag(CX + 200, 560, 'REPOSÉ', t, at(2, 'reposer') - o2 - .05, { size: 64, bg: SX.acc2, fg: SX.ink }) +
      (up ? bar(CX, 690, 560, seg(t, Rv, Rv + .4), { label: 'énergie 100 %', col: SX.acc2 }) : ''); },
  sfx: [[0, 'whoosh', .4], [.15, 'gulp', .7], [.5, 'gulp', .6], [at(2, 'reveilles') - o2, 'whoosh_up', .6], [at(2, 'reposer') - o2, 'sparkle', .7]] }, o2);
// B003 — la première personne que tu croises : rue au matin, tu passes en mode soleil, la voisine se fige
B(3, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const C = at(3, 'croises'), wx = lerp(180, 360, eOutCubic(seg(t, 0, C))); return depth({ zoom: 1, x: Math.sin(t) * 15 }, [
    { z: 1.5, svg: rueMatin(t), haze: .08 },
    { z: 1, svg: ado({ x: wx, y: 1520, s: 1.35, expr: 'chill', walk: t < C ? 4 : 0 }, t) + sparkle(wx + 120, 1000, .5 + .3 * Math.sin(t * 9), '#fff') + voisine({ x: 800, y: 1560, s: 1.15, expr: t > C ? 'shock' : 'neutral', flip: 1, armL: [200, 260], holdL: path('M-30 -60L30 -60L22 30L-22 30Z', '#fff') + rect(-30, -40, 60, 24, '#8a5a3a', 0, 0) }, t) },
    { z: .6, svg: blur(10, G(tr(CX, 1830), rect(-800, -120, 1600, 240, '#8fb0c9', 60))) }]) + funTag(800, 450, '1ʳᵉ PERSONNE', t, at(3, 'premiere') - .1, { size: 48, bg: SX.cool }) + (t > C ? emark(800, 600, 1.1) : ''); },
  sfx: [[0, 'whoosh', .5], [.1, 'steps', .5], [at(3, 'premiere') - .1, 'pop', .6], [at(3, 'croises'), 'gasp', .5], [at(3, 'demande'), 'hmm', .4]] });
// B004 — « T'as passé la nuit à faire quoi ? » : gros plan voisine soupçonneuse, loupe sur tes cernes
B(4, { enter: 'crash', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const F = at(4, 'faire'); return rueMatin(t) + glow(CX, 900, 500, '#fff', .35) + voisineHead(330, 900, 230, { expr: 'suspicious', look: [1, 0] }, t) +
    G(tr(790, 960), heroHead(0, 0, 150, { expr: 'happy' }, t)) + magnifier(780 + 10 * Math.sin(t * 5), 990, .95, -20) + qmark(150, 700, 1, '#fff', -10) +
    kthin("t'as passé la nuit", CX, 380, t, .05, { size: 56 }) + kword('À FAIRE QUOI ?', CX, 500, t, F - .05, { size: 80, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [.1, 'hmm', .6], [at(4, 'nuit'), 'glint', .5], [at(4, 'faire') - .05, 'boom', .5]] });
// B005 — « Pardon ? » : crash zoom, mâchoire au sol, rayons violets
B(5, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 9 }),
  draw: (t, d, T) => rays(t, CX, 950, '#7a45e0', '#9b5cff', 24) + heroHead(CX, 850, 240, { expr: 'jawdrop' }, t) + kword('PARDON ?!', CX, 470, t, .02, { size: 110, fill: '#fff' }),
  sfx: [[0, 'flash_hit', .8], [.05, 'gasp', .7], [.25, 'boing', .5]] });
// B006 — 17 ans : chambre, calendrier, confettis
B(6, { enter: 'drop', cam: zin(1.02, 1.07, .3),
  draw: (t, d, T) => bedroomDay(t) + ado({ x: 380, y: 1500, s: 1.4, expr: 'joy', armL: [200, 230], armR: [-20, -50] }, t) + calendar(820, 760, .85, '17', t, at(6, '17') - .15, 8) + confetti(t, at(6, '17'), 30),
  sfx: [[0, 'whoosh', .4], [at(6, '17') - .15, 'pop', .7], [at(6, 'ans'), 'tada', .5]] });
// B007 — miroir : zoom lent sur les ombres sous les yeux (encerclées au marqueur)
B(7, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => { const O = at(7, 'ombres'); return { z: lerp(1.0, 1.75, eInOut(seg(t, O - .4, O + .5))), cx: CX, cy: 800, hand: .2 }; },
  draw: (t, d, T) => { const O = at(7, 'ombres'); return bathroom2(t) + heroHead(CX, 760, 220, { expr: t > O ? 'deadpan' : 'neutral', look: [0, .2] }, t) + op(.25, path('M200 330L420 330L250 1100L190 1100Z', '#fff', 0)) +
    markerCircle(CX - 75, 810, 70, 38, t, O + .1, { col: SX.acc2, w: 10 }) + markerCircle(CX + 75, 810, 70, 38, t, O + .25, { col: SX.acc2, w: 10 }) + markerText('ombres', CX, 940, t, at(7, 'sous') - .1, { size: 48, col: SX.acc2 }) +
    funTag(CX, 420, 'MIROIR', t, at(7, 'miroir') - .1, { size: 48, bg: SX.cool }); },
  sfx: [[0, 'whoosh', .4], [at(7, 'miroir') - .1, 'pop', .5], [at(7, 'ombres') - .3, 'sting', .5], [at(7, 'ombres') + .1, 'scratch', .5], [at(7, 'sous') - .1, 'pop_hi', .5]] });
// B008 — « Alors tu dors davantage » : lit, compteur qui grimpe, horloge qui s'emballe
B(8, { enter: 'drop', cam: zin(1.02, 1.1, .2),
  draw: (t, d, T) => bedroomNight(t) + wallClock(220, 430, 90, t, 30) + lit(CX + 40, 1150, 1.2, t, { expr: 'sleep' }) + zzz(CX - 80, 900, t, 1.2) +
    funTag(CX + 60, 520, `${counter(10, 14, t, at(8, 'davantage') - .3, .8)} H`, t, at(8, 'dors') - .1, { size: 90, bg: SX.acc }),
  sfx: [[0, 'whoosh', .4], [at(8, 'dors') - .1, 'pop', .6], [at(8, 'davantage') - .3, 'clock_fast', .6], [.2, 'hmm', .3]] });
// B009 — « Rien ne change » : retour miroir, même tête, tampon
B(9, { enter: 'punch', cam: () => ({ z: 1.1, shake: 3 }),
  draw: (t, d, T) => bathroom2(t) + heroHead(CX, 780, 230, { expr: 'deadpan' }, t) + stamp(CX, 470, 'RIEN', t, at(9, 'rien') - .02) + funTag(CX, 1110, 'même cernes', t, at(9, 'change') - .1, { size: 44, bg: SX.acc }),
  sfx: [[0, 'thud', .6], [at(9, 'rien'), 'error_beep', .5], [at(9, 'change') - .1, 'pop', .5]] });
// B010 — la crème : pot ANTI-CERNES, tartinage frénétique… toujours rien
B(10, { enter: 'none', trans: 'push', transD: .25, cam: camHand(1.05, .5),
  draw: (t, d, T) => { const Tj = at(10, 'toujours'), cream = t < Tj ? seg(t, at(10, 'creme') - .2, at(10, 'creme') + .2) : 1 - seg(t, Tj, Tj + .3), rub = t < Tj ? Math.sin(t * 30) * 30 : 0;
    return bathroom2(t) + heroHead(CX, 780, 220, { expr: t > Tj ? 'rage' : 'effort' }, t) + op(cream, ell(CX - 75, 830, 70, 30, '#fff', 0) + ell(CX + 75, 830, 70, 30, '#fff', 0)) +
      G(tr(CX + 250 + rub, 900), hand(0, 0, 1, -30, HERO)) + jarC(260, 1060, 1, -8) + funTag(260, 960, '29,99 €', t, at(10, 'creme') - .1, { size: 36, bg: SX.acc2, fg: SX.ink }) +
      (t > Tj ? cross(CX, 820, 1.4, t, at(10, 'rien') - .05) : '') + kword('TOUJOURS RIEN', CX, 440, t, Tj - .05, { size: 64, fill: '#fff' }); },
  sfx: [[at(10, 'creme') - .2, 'squeak', .6], [.5, 'scratch', .4], [at(10, 'toujours') - .05, 'thud', .6], [at(10, 'rien') - .05, 'error_beep', .6]] });
// B011a — Kevin « docteur » (blouse, stéthoscope) te conseille
const o11 = at(11, 'fermer') - .15;
B(11, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t) * 15 }, [{ z: 1.5, svg: park(t), haze: .08 },
    { z: 1, svg: ado({ x: 300, y: 1500, s: 1.35, expr: 'confused' }, t) + kevin({ x: 780, y: 1500, s: 1.35, expr: 'smug', flip: 1, shirt: '#fff', coat: 1, stetho: 1, armL: [200, 240] }, t) },
    { z: .6, svg: blur(10, G(tr(CX, 1820), rect(-800, -120, 1600, 240, '#6fb24f', 60))) }]) + funTag(780, 450, 'Dr KEVIN', t, at(11, 'kevin') - .05, { size: 54, bg: '#5fb85f' }) + funTag(300, 620, 'conseil :', t, at(11, 'conseille'), { size: 40, bg: '#fff', fg: SX.ink }),
  sfx: [[0, 'whoosh', .5], [at(11, 'kevin') - .05, 'pop', .6], [at(11, 'conseille'), 'hmm', .5]] });
// B011b — « fermer les yeux la nuit » : Kevin mime, yeux fermés, révélation du siècle
B(11, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d) }),
  draw: (t, d, T) => park(t) + rays(t, 720, 900, 'rgba(255,240,170,.35)', 'rgba(255,255,255,0)', 16) + kevinHead(720, 880, 230, { expr: 'proud' }, t) +
    heroHead(250, 1030, 120, { expr: 'deadpan' }, t) + kthin('ferme les yeux…', CX, 390, t, .05, { size: 58, fill: SX.ink }) + kword('LA NUIT.', CX, 510, t, at(11, 'nuit') - o11 - .05, { size: 96, fill: SX.acc2 }) + popStars(720, 700, t, at(11, 'nuit') - o11),
  sfx: [[0, 'magic', .4], [at(11, 'yeux') - o11, 'angel', .4], [at(11, 'nuit') - o11 - .05, 'boom', .5]] }, o11);
// B012 — « Merci docteur. » : regard blasé, Kevin salue, diplôme bidon
B(12, { enter: 'none', trans: 'push', transD: .2, cam: zin(1.04, 1.1),
  draw: (t, d, T) => park(t) + kevin({ x: 840, y: 1500, s: 1.1, expr: 'proud', flip: 1, shirt: '#fff', coat: 1, stetho: 1, rot: -10 * eOutBack(seg(t, .3, .7)) }, t) + heroHead(400, 900, 220, { expr: 'smugger' }, t) +
    card(840, 620, 230, 170, ftext(0, -10, 'DIPLÔME', { size: 34, fill: SX.ink, stroke: 'none' }) + ftext(0, 40, 'de Kevin', { size: 30, fill: SX.acc, stroke: 'none' }), t, .2, { ry: 0, r: 8, thick: 8 }) +
    kword('MERCI DOCTEUR.', CX, 440, t, at(12, 'merci') - .05, { size: 78, fill: '#fff', puff: false }),
  sfx: [[at(12, 'merci') - .05, 'glint', .6], [.2, 'pop', .5], [at(12, 'docteur'), 'rimshot', .5]] });
// B013 — concept : CERNES ≠ MANQUE DE SOMMEIL (débloqué en étoiles sur « forcément »)
B(13, { enter: 'none', trans: 'glitch', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Fc = at(13, 'forcement'); return gridBg(SX.ink) + halftoneFade(SX.acc, .1, 1) + unlock(CX, 950, t, Fc, { part: 'back', r: 460 }) +
    G(tr(300, 950), cutout(heroHead(0, 0, 150, { expr: t > Fc ? 'wow' : 'confused' }, t), 10)) + G(tr(CX, 960), ftext(0, 40, '≠', { size: 200, fill: SX.acc2 })) + G(tr(800, 950, 1, 6), cutout(pillowC(0, 0, 1.15) + zzz(-40, -40, t, .8), 10)) +
    unlock(CX, 950, t, Fc, { part: 'front', r: 460 }) + kthin('les cernes ne viennent pas', CX, 380, t, at(13, 'cernes') - .1, { size: 52 }) + kword('FORCÉMENT', CX, 500, t, Fc - .05, { size: 90, fill: SX.acc2 }) +
    funTag(800, 1130, 'manque de sommeil', t, at(13, 'manque') - .1, { size: 36, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .5], [at(13, 'cernes') - .1, 'pop_hi', .4], [at(13, 'forcement') - .05, 'boom', .6], [at(13, 'forcement') + .1, 'sparkle', .6], [at(13, 'manque') - .1, 'pop', .5]] });
// B014 — « La génétique » : mur de famille, TOUT LE MONDE a des cernes (même le bébé)
B(14, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { let s = famWall(t);
    const fam = [['short', '#3a2a22', 'adult'], ['long', '#5a3a26', 'adult'], ['bald', '#9a9a9a', 'old'], ['tuft', '#3a2a22', 'baby']];
    fam.forEach((f, i) => { const x = 250 + (i % 2) * 580, y = 560 + Math.floor(i / 2) * 400, k = pop(t, .05 + i * .12, .35);
      if (k > 0) s += G(tr(x, y, k, (i % 2 ? 5 : -5)), rect(-170, -170, 340, 340, '#f6c86b', 20) + rect(-140, -140, 280, 280, '#cfe9ff', 10, 4) + G(tr(0, 20), head({ hr: 95, hairFn: hfC(1.4, f[0], f[1]), wrinkles: f[2] === 'old', expr: 'deadpan', seed: 30 + i }, t))); });
    return s + G(tr(CX, 760), dna(0, 0, .8, t, 8)) + funTag(CX, 380, 'GÉNÉTIQUE', t, at(14, 'genetique') - .1, { size: 64, bg: SX.acc }) + markerText('(toute la famille)', CX, 1180, t, .5, { size: 42, col: SX.acc2 }) + fgB('plant', 1000, 1900, 1, t); },
  sfx: [[.05, 'pop', .5], [.17, 'pop', .5], [.29, 'pop', .5], [.41, 'pop', .5], [at(14, 'genetique') - .1, 'magic', .5]] });
// B015 — « la pigmentation » : nuancier de peinture « violet cerne »
B(15, { enter: 'none', trans: 'up', transD: .2, cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => { const cols = ['#d9c2f5', '#b994ec', '#9466d8', '#6e3fb8'], names = ['lilas', 'mauve', 'aubergine', 'nuit blanche']; let s = paintShop(t);
    cols.forEach((c, i) => s += card(200 + i * 227, 1010, 190, 260, rect(-80, -110, 160, 150, c, 10, 4) + ftext(0, 85, names[i], { size: i === 3 ? 22 : 28, fill: SX.ink, stroke: 'none' }), t, .1 + i * .1, { ry: 0, r: (i - 1.5) * 5, thick: 8 }));
    return s + heroHead(CX, 680, 150, { expr: 'worried', ck: 1.3 }, t) + markerArrow(760, 620, 880, 860, t, .55, { bend: -40, col: SX.acc }) + funTag(CX, 400, 'PIGMENTATION', t, at(15, 'pigmentation') - .1, { size: 58, bg: SX.acc }) + fgB('can', 980, 1880, 1, t); },
  sfx: [[.1, 'pop_hi', .4], [.2, 'pop_hi', .4], [.3, 'pop_hi', .4], [.4, 'pop_hi', .4], [at(15, 'pigmentation') - .1, 'pop', .6], [.55, 'scratch', .4]] });
// B016 — « l'anatomie du visage » : salle de classe, schéma à la craie du visage avec cotes
B(16, { enter: 'none', trans: 'wipe', transD: .25, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const k = seg(t, .1, .8); return classAnat(t) +
    op(.9, G(tr(CX, 700), circ(0, 0, 230 * k, 'none', 8, '#fff') + circ(-80, 0, 30 * k, 'none', 6, '#fff') + circ(80, 0, 30 * k, 'none', 6, '#fff') + path('M-130 60Q-80 110 -30 60M30 60Q80 110 130 60', 'none', 7 * k, '#d9c2f5'))) +
    markerArrow(780, 920, 640, 780, t, at(16, 'visage') - .2, { col: '#fff', bend: 40 }) + markerText('creux !', 820, 960, t, at(16, 'visage'), { size: 52, col: SX.acc2 }) +
    G(tr(CX + 300, 1000), cutout(heroHead(0, 0, 110, { expr: 'shock' }, t), 8)) + funTag(CX, 380, 'ANATOMIE', t, at(16, 'anatomie') - .1, { size: 60, bg: SX.cool }) + fgB('chair', 140, 1940, 1) + fgB('chair', 960, 1960, 1); },
  sfx: [[.1, 'scratch', .5], [at(16, 'anatomie') - .1, 'pop', .6], [at(16, 'visage') - .2, 'scratch', .5], [at(16, 'visage'), 'boing', .4]] });
// B017 — « la finesse de la peau » : une lampe derrière la tête… on voit à travers
B(17, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const L = seg(t, at(17, 'finesse') - .1, at(17, 'finesse') + .3); return darkRoom(t, .6) + (L > 0 ? glow(CX, 840, 520, '#fff2b0', .7 * L) : '') + G(tr(CX, 840), bulbC(0, -20, 1.3, L > 0)) +
    op(1 - .35 * L, heroHead(CX, 860, 240, { expr: 'shock', ck: 1 + .5 * L }, t)) +
    funTag(CX, 400, `PEAU : 0,${counter(9, 2, t, at(17, 'peau') - .2, .6)} mm`, t, at(17, 'peau') - .25, { size: 54, bg: SX.acc }) + markerText('transparente', CX + 150, 1160, t, at(17, 'jouer'), { size: 46, col: SX.acc2 }); },
  sfx: [[at(17, 'finesse') - .1, 'zap', .6], [at(17, 'peau') - .25, 'pop', .6], [at(17, 'peau'), 'glint', .5], [at(17, 'jouer'), 'scratch', .4]] });
// B018 — « ton visage a simplement l'air fatigué » : footing au parc, tu pètes la forme… mais le visage
B(18, { enter: 'whip', cam: camHand(1.04, .5),
  draw: (t, d, T) => { const bob = Math.abs(Math.sin(t * 9)) * 30; return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: park(t) + kidsBg(t, 1180, 2, .4), haze: .06 },
    { z: 1, svg: ado({ x: CX, y: 1500 - bob, s: 1.4, expr: 'joy', walk: 6, armL: [150, 200], armR: [30, -40] }, t) + motionLines(CX - 200, 1200, 3, 70, 0) },
    { z: .6, svg: blur(10, G(tr(CX, 1830), rect(-800, -120, 1600, 240, '#6fb24f', 60))) }]) +
    funBox(CX, 1095 - bob, 230, 70, t, at(18, 'visage') - .1, { label: 'visage.png', col: SX.acc }) + funTag(CX, 450, 'AIR FATIGUÉ', t, at(18, 'fatigue') - .15, { size: 60, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'steps', .5], [.5, 'steps', .5], [at(18, 'visage') - .1, 'tick', .6], [at(18, 'fatigue') - .15, 'error_beep', .5], [at(18, 'simplement'), 'whoosh', .3]] });
// B019 — « alors que tu ne l'es pas » : haltère soulevé d'une main, jauge à 100 %
B(19, { enter: 'none', trans: 'zoom', transD: .25, cam: () => ({ z: 1.05, shake: 2 }),
  draw: (t, d, T) => { const up = eOutBack(seg(t, .05, .45)); return gymBg(t) + op(.28, rays(t, CX, 950, '#ffe9a6', '#ffd76b', 22)) + ado({ x: CX, y: 1500, s: 1.45, expr: 'ecstatic', armR: [-20, -20 - 70 * up], holdR: G(tr(20, 0), dumbbellC(90)), armL: [160, 200] }, t) +
    bar(CX, 470, 600, seg(t, .1, .6), { label: 'énergie', col: '#36a85a', fg: SX.ink, bg: 'rgba(0,0,0,.15)' }) + funTag(CX + 220, 600, '100 %', t, .5, { size: 60, bg: '#36a85a' }) + popStars(CX + 150, 800, t, .4) + fgB('weights', CX, 1900, 1); },
  sfx: [[.05, 'whoosh_up', .6], [.45, 'thud', .6], [.5, 'ding', .6], [at(19, 'pas'), 'tada', .4]] });
// B020 — « personne ne te croit » : foule de têtes sceptiques
B(20, { enter: 'drop', cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => { let s = rueMatin(t); const sk = ['#f2c9a0', '#c98a5e', '#8a5a3a', '#f6d7b8', '#e0b088', '#f2c9a0'], hc = ['#2b2420', '#c4521b', '#1f1a18', '#e0a040', '#5a3a26', '#8a5a3a'], hs = ['curly', 'bun', 'short', 'ponytail', 'side', 'bald'];
    for (let i = 0; i < 6; i++) { const x = 140 + (i % 3) * 400 + (i > 2 ? 200 : 0), y = i > 2 ? 1050 : 700, k = pop(t, .05 + i * .07, .3); if (x > 1000) continue; if (k > 0) s += G(tr(x, y + Math.sin(t * 3 + i) * 6, k, Math.sin(t * 8 + i) * 8), head({ hr: 90, skin: sk[i], hair: hs[i], hairColor: hc[i], expr: i % 2 ? 'suspicious' : 'smug', seed: 40 + i }, t)); }
    return s + heroHead(CX, 900, 150, { expr: 'sob' }, t) + kword('PERSONNE', CX, 420, t, at(20, 'personne') - .05, { size: 96, fill: SX.acc2 }) + funTag(CX, 1150, 'ne te croit', t, at(20, 'croit') - .1, { size: 44, bg: SX.acc }); },
  sfx: [[at(20, 'personne') - .05, 'boom', .5], [.3, 'hmm', .5], [at(20, 'croit') - .1, 'pop', .5], [at(20, 'croit') + .1, 'gasp', .3]] });
// B021 — l'entretien : bureau RH, tu es sûr de toi
B(21, { enter: 'none', trans: 'wipe', transD: .25, cam: zin(1.02, 1.06),
  draw: (t, d, T) => bureauRH(t) + ado({ x: 300, y: 1450, s: 1.3, expr: 'proud', collar: '#fff' }, t) + sparkle(380, 980, .5 + .3 * Math.sin(t * 9), '#fff') + recruteur({ x: 790, y: 1520, s: 1.15, expr: 'neutral', flip: 1 }, t) + bureauDesk(1250, t) + funTag(CX, 440, 'ENTRETIEN', t, at(21, 'entretien') - .1, { size: 62, bg: SX.cool }),
  sfx: [[0, 'whoosh', .4], [.1, 'steps', .4], [at(21, 'entretien') - .1, 'pop', .6], [.5, 'glint', .5]] });
// B022a — le recruteur scrute ton CV (photo aux cernes encerclée)
const o22 = at(22, 'assez') - .15;
B(22, { enter: 'punch', cam: camHand(1.05, .4),
  draw: (t, d, T) => bureauRH(t) + recruteurHead(330, 860, 220, { expr: 'suspicious', look: [1, .3] }, t) + G(tr(770, 900, 1, 6), rect(-200, -270, 400, 540, '#fff', 14) + rect(-170, -240, 150, 180, '#cfe9ff', 8, 4) + G(tr(-95, -150), head({ hr: 55, hairFn: hfC(1.6), expr: 'happy', seed: 2 }, t)) + Array.from({ length: 6 }, (_, i) => line(-170, -20 + i * 44, 170 - (i % 2) * 70, -20 + i * 44, 8, '#c9d2dc')).join('') + ftext(70, -170, 'CV', { size: 60, fill: SX.ink, stroke: 'none' })) +
    markerCircle(675, 760, 100, 60, t, at(22, 'demande') - .1, { col: SX.acc, w: 10 }) + markerText('?!', 860, 640, t, at(22, 'demande') + .2, { size: 70, col: SX.acc }) + funTag(CX, 420, 'RECRUTEUR', t, .05, { size: 50, bg: '#5b6b8a' }),
  sfx: [[0, 'printer', .3], [.3, 'hmm', .6], [at(22, 'demande') - .1, 'scratch', .5], [at(22, 'demande') + .2, 'pop', .5]] });
// B022b — « assez en forme pour le poste ? » : il te glisse un café XXL
B(22, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.03, 1.1, t / d) }),
  draw: (t, d, T) => { const P = at(22, 'poste') - o22, k = eOutBack(seg(t, P - .3, P + .1)); return bureauRH(t) + heroHead(330, 900, 200, { expr: t > P ? 'jawdrop' : 'ecstatic' }, t) + recruteurHead(820, 760, 150, { expr: 'worried', look: [-1, 0] }, t) + bureauDesk(1250, t) +
    coffeeXXL(lerp(1200, 700, k), 1080, 1.1, 0, t) + funTag(CX, 440, 'EN FORME ?', t, at(22, 'forme') - o22 - .1, { size: 66, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [at(22, 'forme') - o22 - .1, 'pop', .6], [at(22, 'poste') - o22 - .3, 'whoosh', .6], [at(22, 'poste') - o22 + .1, 'thud', .6]] }, o22);
// B023 — chez grand-mère : maison fleurie, mamie bras ouverts
B(23, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => mamieHouse(t) + ado({ x: lerp(120, 300, eOutCubic(seg(t, 0, .7))), y: 1520, s: 1.3, expr: 'happy', walk: t < .7 ? 4 : 0 }, t) + grandma({ x: 760, y: 1560, s: 1.2, expr: 'joy', flip: 1, armL: [200, 230], armR: [-20, -50] }, t) + heartsUp(t, 760, 900, 4) + funTag(CX, 430, 'MAMIE', t, at(23, 'grand') - .1, { size: 60, bg: '#ff8fb1' }),
  sfx: [[0, 'chirp', .5], [.1, 'steps', .4], [at(23, 'grand') - .1, 'pop', .6], [at(23, 'mere'), 'kiss', .5]] });
// B024a — elle te sert TROIS assiettes (pile qui monte)
const o24 = at(24, 'parce') - .15;
B(24, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const t3 = at(24, 'trois'), ts = [at(24, 'sert') - .1, t3 - .05, t3 + .25]; let pl = ''; ts.forEach((t0, i) => { const k = eOutBack(seg(t, t0, t0 + .3)); if (k > 0) pl += plateC(560, lerp(700, 1200 - i * 40, k), .9 - i * .05, i, t); });
    const n = ts.filter(x => t > x).length;
    return cuisine(t) + ado({ x: 250, y: 1460, s: 1.25, expr: t > t3 + .3 ? 'shock' : 'happy' }, t) + grandma({ x: 860, y: 1560, s: 1.2, expr: 'happy', flip: 1, armL: [180, 190] }, t) + nappe(1240) + pl +
      funTag(CX, 430, `${n} ASSIETTE${n > 1 ? 'S' : ''}`, t, ts[0], { size: 62, bg: SX.acc }); },
  sfx: [[at(24, 'sert') - .1, 'thud', .5], [at(24, 'trois') - .05, 'thud', .6], [at(24, 'trois') + .25, 'thud', .7], [at(24, 'assiettes'), 'gulp', .5]] });
// B024b — « parce que tu as mauvaise mine » : mamie te pince les joues
B(24, { enter: 'crash', cam: camHand(1.06, .5),
  draw: (t, d, T) => { const Mn = at(24, 'mauvaise') - o24; return cuisine(t) + mamieHead(760, 800, 210, { expr: 'worried', look: [-1, .2] }, t) + heroHead(300, 950, 190, { expr: 'embarrassed', ck: 1.3 }, t) + G(tr(180, 1000), hand(0, 0, .9, 30, '#a685c9')) + G(tr(420, 1000), hand(0, 0, .9, -30, '#a685c9')) +
    nappe(1260) + plateC(300, 1220, .8, 1, t) + plateC(560, 1200, .9, 0, t) + plateC(800, 1220, .8, 2, t) + kword('MAUVAISE MINE', CX, 440, t, Mn - .05, { size: 78, fill: SX.acc2 }); },
  sfx: [[0, 'squeak', .5], [.2, 'hmm', .4], [at(24, 'mauvaise') - o24 - .05, 'boom', .5], [at(24, 'mine') - o24, 'boing', .5]] }, o24);
// B025 — photo d'identité : studio, tabouret, tu te recoiffes
B(25, { enter: 'none', trans: 'zoom', transD: .25, cam: zin(1.02, 1.07, .2),
  draw: (t, d, T) => studioPhoto(t) + ado({ x: CX, y: 1500, s: 1.4, expr: 'proud', armR: [-60, -140] }, t) + blur(9, camTripod(880, 1500, 1.2)) + funTag(CX, 440, "PHOTO D'IDENTITÉ", t, at(25, 'photo') - .1, { size: 52, bg: SX.cool }),
  sfx: [[0, 'whoosh', .4], [at(25, 'photo') - .1, 'pop', .6], [at(25, 'identite'), 'glint', .5]] });
// B026 — « réveille-toi un peu » : POV viseur, tu écarquilles les yeux de force, flash
B(26, { enter: 'punch', cam: camHand(1.04, .4),
  draw: (t, d, T) => { const Rv = at(26, 'reveiller'); return studioPhoto(t) + heroHead(CX, 830, 230, { expr: t > Rv ? 'panic' : 'deadpan', face: t > Rv ? { mouth: 'grin' } : {}, ck: 1.2 }, t) + recFrame(t) + photoHead(880, 1080, 120, { expr: 'annoyed', look: [-1, -.5] }, t) +
    funTag(CX, 400, 'RÉVEILLE-TOI !', t, Rv - .1, { size: 58, bg: SX.acc }) + flashW(t, Rv + .45) + (t > Rv + .45 ? funTag(CX, 1140, 'toujours fatigué', t, Rv + .55, { size: 40, bg: SX.acc2, fg: SX.ink }) : ''); },
  sfx: [[at(26, 'photographe'), 'hmm', .5], [at(26, 'reveiller') - .1, 'pop', .6], [at(26, 'reveiller'), 'boing', .5], [at(26, 'reveiller') + .45, 'shutter', 1]] });
// B027 — un samedi : bandeau de combat
B(27, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const S = at(27, 'serieusement'); return bedroomDay(t) + G(tr(CX, 860), heroHead(0, 0, 210, { expr: t > S ? 'effort' : 'smug' }, t) + rect(-196, -150, 392, 54, '#e2463a', 22) + path('M190 -130Q260 -150 280 -90M190 -120Q250 -80 240 -30', 'none', 18, '#e2463a')) +
    funTag(CX, 420, 'SAMEDI', t, at(27, 'samedi') - .1, { size: 60, bg: SX.cool }) + (t > S - .05 ? burst(CX, 560, 260, t, S - .05, SX.acc2, 16) : '') + kword('SÉRIEUSEMENT', CX, 560, t, S - .05, { size: 82, fill: '#fff' }); },
  sfx: [[at(27, 'samedi') - .1, 'pop', .6], [at(27, 'decides'), 'drum', .5], [at(27, 'serieusement') - .05, 'boom', .6], [at(27, 'serieusement') + .3, 'whistle', .4]] });
// B028 — couché tôt (20:00), téléphone éteint
B(28, { enter: 'drop', cam: zin(1.02, 1.08, .2),
  draw: (t, d, T) => { const E = at(28, 'eteint'); return bedroomDay(t, ['#ff9a5c', '#ffd6a0']) + op(.25, rect(-M, -M, W + 2 * M, H + 2 * M, '#4a2a6a', 0, 0)) + lit(CX + 40, 1160, 1.15, t, { expr: 'zen' }) + bigClock(270, 480, '20:00', '#ff7a59', .8) +
    G(tr(820, 600, .55, 10), rect(-170, -330, 340, 660, '#2b2b33', 44) + rect(-150, -295, 300, 590, t > E ? '#0b0b10' : '#bfe0ff', 24, 0) + (t > E ? ftext(0, 20, 'OFF', { size: 90, fill: '#555', stroke: 'none' }) : ftext(0, 20, '🔔', { size: 120, stroke: 'none' }))) +
    funTag(270, 650, 'TÔT ✓', t, at(28, 'tot') - .1, { size: 48, bg: '#36a85a' }) + funTag(820, 860, 'OFF ✓', t, E, { size: 48, bg: '#36a85a' }); },
  sfx: [[at(28, 'couche'), 'whoosh', .5], [at(28, 'tot') - .1, 'ding', .6], [at(28, 'telephone'), 'vibrate', .5], [at(28, 'eteint'), 'error_beep', .4], [at(28, 'eteint') + .05, 'pop', .5]] });
// B029 — chambre noire, 9 h de sommeil : le lit s'envole sur un nuage (chill de ouf)
B(29, { enter: 'none', trans: 'black', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const S = at(29, 'sommeil'), fl = eInOut(seg(t, S - .3, S + .5)); return darkRoom(t, seg(t, 0, at(29, 'noire'))) + glow(CX, 1000, 500, '#cdb8ff', .3 + .3 * fl) + wallClock(220, 430, 80, t, 60) +
    G(tr(0, -140 * fl), cloud(CX + 40, 1260, 3.2, '#e8e0ff') + lit(CX + 40, 1150, 1.15, t, { expr: 'chill' })) + zzz(CX - 80, 860 - 140 * fl, t, 1.2) + (fl > 0 ? sparkle(CX - 250, 800, .6, '#fff6c8') + sparkle(CX + 300, 750, .5, '#fff6c8') : '') +
    funTag(CX, 450, `${counter(0, 9, t, at(29, 'neuf') - .1, .5)} H`, t, at(29, 'neuf') - .1, { size: 96, bg: SX.acc }); },
  sfx: [[at(29, 'chambre'), 'thud', .4], [at(29, 'noire'), 'crickets', .5], [at(29, 'neuf') - .1, 'pop', .6], [at(29, 'sommeil') - .3, 'angel', .6]] });
// B030 — le lendemain au bureau : tu rayonnes (soleil humain)
B(30, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const Ry = at(30, 'rayonnant'); return openSpace(t) + (t > Ry - .1 ? op(seg(t, Ry - .1, Ry + .3), rays(t, CX, 1000, 'rgba(255,230,120,.45)', 'rgba(255,255,255,0)', 20)) + glow(CX, 1000, 420, '#fff2a0', .6) : '') +
    ado({ x: lerp(250, CX, eOutCubic(seg(t, 0, Ry))), y: 1520, s: 1.4, expr: t > Ry ? 'ecstatic' : 'happy', walk: t < Ry ? 4 : 0, armL: t > Ry ? [200, 230] : undefined, armR: t > Ry ? [-20, -50] : undefined }, t) +
    popStars(CX, 1000, t, Ry, 8, 360) + funTag(CX, 420, 'LE LENDEMAIN', t, .05, { size: 50, bg: SX.acc2, fg: SX.ink }) + funTag(CX, 560, 'RAYONNANT', t, Ry - .05, { size: 66, bg: '#ff9a3c' }); },
  sfx: [[0, 'whoosh', .5], [.2, 'steps', .5], [at(30, 'bureau'), 'ding', .4], [at(30, 'rayonnant') - .05, 'sparkle', .8], [at(30, 'rayonnant') + .1, 'angel', .4]] });
// B031 — le patron te regarde : gros plan loupe
B(31, { enter: 'none', trans: 'push', transD: .25, cam: camHand(1.05, .4),
  draw: (t, d, T) => { const Rg = at(31, 'regarde'), k = eOutCubic(seg(t, Rg - .1, Rg + .3)); return openSpace(t) + patronHead(700, 820, 230, { expr: 'suspicious', look: [-1, .3] }, t) + heroHead(260, 1030, 130, { expr: 'ecstatic' }, t) +
    magnifier(lerp(560, 300, k), lerp(900, 1030, k), 1, -30) + funTag(700, 450, 'LE PATRON', t, at(31, 'patron') - .1, { size: 54, bg: '#c43a2e' }); },
  sfx: [[at(31, 'patron') - .1, 'pop', .6], [at(31, 'regarde'), 'hmm', .6], [at(31, 'regarde') + .3, 'glint', .5]] });
// B032 — « tu devrais vraiment dormir davantage » : oreiller lancé en pleine figure
B(32, { enter: 'punch', cam: (t, d) => ({ z: 1.05, shake: t > at(32, 'dormir') + .2 && t < at(32, 'dormir') + .5 ? 7 : 0 }),
  draw: (t, d, T) => { const Dm = at(32, 'dormir'), k = seg(t, Dm - .3, Dm + .2); return openSpace(t) + ado({ x: 280, y: 1500, s: 1.35, expr: t > Dm + .2 ? 'jawdrop' : 'ecstatic', rot: t > Dm + .2 ? -8 : 0 }, t) + patron({ x: 800, y: 1560, s: 1.2, expr: 'worried', flip: 1, armL: [200, 220] }, t) +
    (k < 1 ? pillowC(lerp(700, 300, k), lerp(1050, 1080, k) - Math.sin(k * 3.14) * 200, .7, k * 300) : pillowC(300, 1150, .7, 20)) + (t > Dm + .2 ? impactStar(280, 1060, .8) : '') +
    kthin('tu devrais vraiment', CX, 380, t, at(32, 'devrais') - .1, { size: 54, fill: SX.ink }) + kword('DORMIR DAVANTAGE', CX, 500, t, Dm - .05, { size: 72, fill: SX.acc2 }); },
  sfx: [[at(32, 'devrais') - .1, 'hmm', .4], [at(32, 'dormir') - .3, 'whoosh', .6], [at(32, 'dormir') + .2, 'thud', .8], [at(32, 'davantage'), 'boing', .5]] });
// B033 — « Et là, tu comprends » : concept, ampoule + débloqué en étoiles
B(33, { enter: 'none', trans: 'glitch', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const C = at(33, 'comprends'); return gridBg('#1d1433') + halftoneFade(SX.acc, .12, 1) + unlock(CX, 960, t, C, { part: 'back', r: 480 }) + G(tr(CX, 980), cutout(heroHead(0, 0, 200, { expr: t > C ? 'shock' : 'deadpan', ck: 1.2 }, t), 12)) +
    (t > C ? G(tr(CX + 230, 700, popEl(t, C, .5)), bulbC(0, 0, .8, 1)) : '') + unlock(CX, 960, t, C, { part: 'front', r: 480 }) +
    kthin('et là…', CX, 380, t, at(33, 'la') - .05, { size: 60 }) + kword('TU COMPRENDS.', CX, 500, t, C - .05, { size: 82, fill: SX.acc2 }); },
  sfx: [[at(33, 'la') - .05, 'hmm', .4], [at(33, 'comprends') - .05, 'boom', .5], [at(33, 'comprends'), 'magic', .7], [at(33, 'comprends') + .3, 'ding', .5]] });
// B034 — « tu peux être en pleine forme » : héros en cape au parc, jauge pleine
B(34, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), cy: 1100 }),
  draw: (t, d, T) => { const P = at(34, 'pleine'), j = Math.abs(Math.sin(t * 6)) * 40; return park(t) + rays(t, CX, 950, 'rgba(255,240,170,.4)', 'rgba(255,255,255,0)', 20) +
    path(`M${CX - 70} ${1180 - j}Q${CX - 200} ${1400 - j} ${CX - 160 + 20 * Math.sin(t * 9)} ${1480 - j}L${CX + 160 + 20 * Math.sin(t * 9)} ${1480 - j}Q${CX + 200} ${1400 - j} ${CX + 70} ${1180 - j}Z`, '#e2463a') +
    ado({ x: CX, y: 1500 - j, s: 1.4, expr: 'ecstatic', armL: [200, 250], armR: [-20, -70] }, t) + popStars(CX, 950, t, P, 8, 330) + funTag(CX, 440, 'PLEINE FORME', t, P - .1, { size: 62, bg: '#36a85a' }) + bar(CX, 580, 560, seg(t, P - .1, P + .3), { col: '#36a85a', bg: 'rgba(0,0,0,.15)' }); },
  sfx: [[0, 'flash_hit', .5], [.1, 'whoosh_up', .6], [at(34, 'pleine') - .1, 'tada', .6], [at(34, 'forme'), 'sparkle', .6]] });
// B035 — FIN : l'info « tu es en forme » rebondit sur le visage… NON REÇUE
B(35, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(35, 'recu') && t < at(35, 'recu') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const Rc = at(35, 'recu'), I = at(35, 'information'), k = seg(t, .2, Rc), bk = seg(t, Rc, Rc + .6);
    const ex = t < Rc ? lerp(1150, CX + 40, eInOut(k)) : lerp(CX + 40, 1250, bk), ey = t < Rc ? lerp(500, 820, eInOut(k)) : 820 - Math.sin(bk * 3.14) * 300 + bk * 100;
    return paper(SX.paper) + gobo(T, .1) + burst(CX, 960, 360, t, .05, '#e6dcff', 18) + cutout(heroHead(CX, 960, 230, { expr: t > Rc ? 'deadpan' : 'happy', ck: 1.5 }, t), 12) + funBox(CX, 1010, 380, 130, t, Rc + .05, { label: 'visage.exe', col: SX.acc }) +
      envelopeC(ex, ey, .7, t < Rc ? -10 : bk * 400) + (t > Rc ? impactStar(CX + 40, 820, .6 * (1 - bk)) : '') + (t > Rc ? funTag(CX + 230, 700, 'NON REÇU', t, Rc + .05, { size: 40, bg: '#e2463a', r: 8 }) : '') +
      kthin("ton visage n'a pas reçu", CX, 360, t, at(35, 'ton') - .05, { size: 52, fill: SX.ink }) + kword("L'INFORMATION.", CX, 485, t, I - .05, { size: 80, fill: SX.acc }); },
  sfx: [[.2, 'whoosh', .5], [at(35, 'recu'), 'boing', .7], [at(35, 'recu') + .05, 'error_beep', .6], [at(35, 'information') - .05, 'boom', .6], [at(35, 'information') + .7, 'rimshot', .5]] });

SCENES.sort((a, b) => a.s - b.s);

// ---------- PREMIER PLAN FLOU (3e couche de profondeur) : ajouté par-dessus chaque plan à décor, dans la zone basse (décor seulement) ----------
const FGX = {
  4: t => fgB('bush', 70, 1840, 1.2, t), 6: t => fgB('plant', 990, 1900, 1, t), 7: t => fgB('bottle', 960, 1820, 1), 8: t => fgB('books', 970, 1880, 1),
  9: t => fgB('bottle', 110, 1820, 1), 10: t => fgB('plant', 1000, 1900, 1, t), '11b': t => fgB('flowers', CX, 1860, 1.6, t), 12: t => fgB('bush', 1010, 1850, 1.2, t),
  17: t => fgB('books', 980, 1880, 1), 20: t => fgB('bush', 1010, 1840, 1.2, t), 21: t => fgB('cup', 1000, 1900, 1), '22a': t => fgB('mug', 980, 1880, 1, t),
  '22b': t => fgB('cup', 90, 1900, 1), 23: t => fgB('flowers', 200, 1860, 1.4, t), '24a': t => fgB('pot', 990, 1910, 1, t), '24b': t => fgB('pot', 90, 1910, .9, t),
  26: t => fgB('cam', 1010, 1720, 1), 27: t => fgB('plant', 990, 1900, 1, t), 28: t => fgB('lamp', 990, 1930, 1), 29: t => fgB('books', 110, 1880, 1),
  30: t => fgB('plant', 1000, 1900, 1, t), 31: t => fgB('mug', 100, 1880, 1, t), 32: t => fgB('chair', 980, 1940, 1), 34: t => fgB('flowers', CX, 1860, 1.6, t),
};
{ const cnt = {}, seen = {}; SCENES.forEach(s => cnt[s.n] = (cnt[s.n] || 0) + 1);
  for (const sc of SCENES) { seen[sc.n] = (seen[sc.n] || 0) + 1; const key = cnt[sc.n] > 1 ? sc.n + 'ab'[seen[sc.n] - 1] : sc.n, f = FGX[key];
    if (f) { const d0 = sc.draw; sc.draw = (t, d, T) => d0(t, d, T) + f(t); } } }
