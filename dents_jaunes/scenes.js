// ============================================================
//  « Pourquoi c'est horrible d'avoir les dents jaunes ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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
function mirror(x, y, w, h) { return rect(x - 22, y - 22, w + 44, h + 44, '#f1c27d', 30) + grad('#e6f6ff', '#b9dcef', x, y, w, h).replace('<rect', '<rect rx="18"') + rect(x, y, w, h, 'none', 18) + line(x + 60, y + 80, x + 160, y + 20, 14, 'rgba(255,255,255,.7)') + line(x + 90, y + 140, x + 240, y + 40, 8, 'rgba(255,255,255,.5)'); }
function sink(x, y) { return path(`M${x - 260} ${y}L${x + 260} ${y}Q${x + 240} ${y + 160} ${x} ${y + 170}Q${x - 240} ${y + 160} ${x - 260} ${y}Z`, '#fff') + rect(x - 30, y - 110, 60, 110, '#c9ced6', 10) + path(`M${x - 30} ${y - 100}Q${x - 100} ${y - 110} ${x - 110} ${y - 60}`, 'none', 22, '#c9ced6'); }
function classroom(t) { return grad('#f4ecd8', '#e8dcc0', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 1300, W + 2 * M, 1400, '#c9a77a', 0, 0) + rect(-100, 300, 1280, 620, '#3c5a48', 14) + rect(-80, 320, 1240, 580, '#456b55', 8, 0) + text(300, 520, 'none', 'x² + y² = ?', 'rgba(255,255,255,.85)', 70) + text(760, 700, 'none', 'π ≈ 3,14', 'rgba(255,255,255,.75)', 56) + text(380, 800, 'none', '∫ f(x) dx', 'rgba(255,255,255,.7)', 52); }
function street(t, o = {}) { let s = grad(o.sky1 || '#9fd6ff', o.sky2 || '#e6f5ff', -M, -M, W + 2 * M, 1600); for (let i = -2; i < 6; i++) s += building(-200 + i * 300, 1250, 260, 500 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4]); s += rect(-M, 1250, W + 2 * M, 1400, '#a7adb5', 0, 0) + line(-M, 1250, W + M, 1250, 8, '#7d848c'); return s; }
function bedroomNight(t) { return grad('#1d2350', '#2e3570', -M, -M, W + 2 * M, H + 2 * M) + rect(620, 260, 360, 420, '#0f163a', 12) + circ(820, 400, 60, '#fff6d6', 0) + rect(620, 260, 360, 420, 'none', 12) + line(800, 260, 800, 680, 8) + rect(-M, 1250, W + 2 * M, 1400, '#5a4a3a', 0, 0); }
function laptop(x, y, s, glow = 1, screen = '') { return G(tr(x, y, s), (glow ? `<ellipse cx="0" cy="-200" rx="420" ry="300" fill="rgba(140,200,255,${.25 * glow})"/>` : '') + rect(-260, -340, 520, 340, '#2b2b33', 18) + rect(-236, -316, 472, 292, '#dff0ff', 8, 0) + screen + path('M-320 0L320 0L360 40L-360 40Z', '#9aa3ad')); }
function showerBg(t) { let s = tiles('#d9e7f7', '#bfd2e8', 110); for (let i = 0; i < 26; i++) { const x = (i * 97) % W, y = ((i * 211 + t * 900) % (H + 200)) - 100; s += line(x, y, x - 10, y + 60, 6, 'rgba(255,255,255,.7)'); } return s; }
function steamClouds(t, n = 5) { let s = ''; for (let i = 0; i < n; i++) s += op(.55, cloud(100 + i * 230 + wave(t, .1, 40, i / 5), 300 + (i % 3) * 200 - (t * 30 % 100), 1.2 + (i % 2) * .5, '#ffffff')); return s; }

function bigClock(x, y, str, col, s = 1) { return G(tr(x, y, s), rect(-210, -90, 420, 180, '#2b2b33', 30) + text(0, 35, 'none', str, col, 100)); }
function heartsUp(t, x, y, n = 5) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * .8 + i / n) % 1; s += op(1 - k, heart(x + Math.sin(k * 9 + i) * 60 + (i - n / 2) * 30, y - k * 380, .6 + k * .3)); } return s; }
function schoolyard(t) { return grad('#9fd6ff', '#e6f5ff', -M, -M, W + 2 * M, 1500) + building(-100, 1150, 600, 520, '#f0d9b5') + building(560, 1150, 700, 440, '#e8c9a0') + rect(-M, 1150, W + 2 * M, 1500, '#c9b8a0', 0, 0); }

// ============================================================
//  SIZEX fun : intro = signature motion (fond graphique), ensuite VRAIS DÉCORS vivants + couche motion rebondie.
//  Police Fredoka, contours cartoon épais, accent violet (complémentaire du jaune des dents).
// ============================================================
sxFun('#7b5cff'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';

// ---------- LES DENTS JAUNES : bouches maison (surcouche locale de mouthSvg, engine/ intact) ----------
const YEL = '#f0cc55', YEL_D = '#b98f22', YEL_L = '#f8e292';
const _mouthBase = mouthSvg;
function _yBand(x, top, w, r) { // rangée de dents du haut, jaunâtres, avec petites taches
  let s = path(`M${x - w * .93} ${top + r * .01}Q${x} ${top + r * .03} ${x + w * .93} ${top + r * .01}L${x + w * .8} ${top + r * .12}Q${x} ${top + r * .14} ${x - w * .8} ${top + r * .12}Z`, YEL, 0);
  for (let i = -2; i <= 2; i++) s += line(x + i * w * .32, top + r * .02, x + i * w * .3, top + r * .12, 2.5, YEL_D);
  return s + ell(x - w * .55, top + r * .09, r * .025, r * .012, YEL_D, 0) + ell(x + w * .25, top + r * .1, r * .02, r * .01, YEL_D, 0) + ell(x - w * .1, top + r * .035, r * .05, r * .012, YEL_L, 0);
}
mouthSvg = function (type, r, t, lx, ly) {
  const x = lx * .6, y = r * .36 + ly * .6;
  switch (type) {
    case 'yGrin': { const w = r * .3, h = r * .25, top = y - r * .05;
      const d = `M${x - w} ${top}Q${x} ${top + r * .02} ${x + w} ${top}Q${x + w * .85} ${top + h} ${x} ${top + h}Q${x - w * .85} ${top + h} ${x - w} ${top}Z`;
      return path(d, '#7a2b2b', 0) + _yBand(x, top, w, r) + path(`M${x - w * .55} ${top + h - r * .025}Q${x} ${top + h - r * .09} ${x + w * .55} ${top + h - r * .025}Q${x} ${top + h + r * .005} ${x - w * .55} ${top + h - r * .025}Z`, YEL, 0) + path(d, 'none', 6); }
    case 'yLaugh': { const o = .8 + .2 * Math.abs(Math.sin(t * 18)), w = r * .27, top = y - r * .06, b = y + r * .3 * o;
      const d = `M${x - w} ${top}Q${x} ${top + r * .03} ${x + w} ${top}Q${x + w * .85} ${b} ${x} ${b}Q${x - w * .85} ${b} ${x - w} ${top}Z`;
      return path(d, '#7a2b2b', 0) + _yBand(x, top, w, r) + ell(x, b - r * .07, r * .11, r * .05, '#ff8a8a', 0) + path(d, 'none', 6); }
    case 'yScream': return _mouthBase('scream', r, t, lx, ly).replace(/fill="#fff"/g, `fill="${YEL}"`);
    case 'yGrit': return _mouthBase('teeth', r, t, lx, ly).replace(/fill="#fff"/g, `fill="${YEL}"`) + ell(x - r * .06, y + r * .02, r * .025, r * .012, YEL_D, 0);
    case 'yChatter': return _mouthBase('chatter', r, t, lx, ly).replace(/fill="#fff"/g, `fill="${YEL}"`);
    case 'pressed': { const q = Math.sin(t * 30) * r * .006; // lèvres serrées, sourire crispé
      return path(`M${x - r * .17} ${y + r * .02 + q}Q${x} ${y + r * .085} ${x + r * .17} ${y + r * .02 - q}`, 'none', 9) + line(x - r * .19, y - r * .01, x - r * .16, y + r * .05, 5) + line(x + r * .19, y - r * .01, x + r * .16, y + r * .05, 5); }
    case 'zip': { let s = line(x - r * .2, y + r * .04, x + r * .2, y + r * .04, 10, OL) + line(x - r * .2, y + r * .04, x + r * .2, y + r * .04, 5, '#c9d1db');
      for (let i = -4; i <= 4; i++) s += line(x + i * r * .045, y + r * .015, x + i * r * .045, y + r * .065, 3, OL);
      return s + rect(x + r * .19, y + r * .02, r * .06, r * .12, '#c9d1db', 4, 4) + circ(x + r * .22, y + r * .16, r * .025, 'none', 4); }
  }
  return _mouthBase(type, r, t, lx, ly);
};
Object.assign(EXPR, {
  yHappy: { eyes: 'happy', mouth: 'yGrin' }, yJoy: { eyes: 'happy', mouth: 'yGrin', brows: 'up' }, yWow: { eyes: 'star', mouth: 'yGrin', brows: 'up' },
  yProud: { eyes: 'closed', mouth: 'yGrin', brows: 'up' },
  yLaugh: { eyes: 'happy', mouth: 'yLaugh', brows: 'up' }, yEcstatic: { eyes: 'star', mouth: 'yLaugh', brows: 'up' }, yTears: { eyes: 'closedHappy2', mouth: 'yLaugh', brows: 'up', fountain: 1 },
  yTerror: { eyes: 'huge', mouth: 'yScream', brows: 'sad', sweatSpray: 1 }, yPanic: { eyes: 'pop', mouth: 'yScream', brows: 'sad', sweatSpray: 1 },
  yEffort: { eyes: 'squint', mouth: 'yGrit', brows: 'angry', sweat: 1 }, yRage: { eyes: 'crazy', mouth: 'yGrit', brows: 'angry', steamHead: 1 },
  yChatter: { eyes: 'huge', mouth: 'yChatter', brows: 'sad', sweat: 1 },
  pressed: { eyes: 'dot', mouth: 'pressed', brows: 'sad' }, pressedHappy: { eyes: 'happy', mouth: 'pressed', brows: 'up' }, zipped: { eyes: 'dot', mouth: 'zip', brows: 'sad', sweat: 1 },
  pressedShock: { eyes: 'pop', mouth: 'pressed', brows: 'up', sweatSpray: 1 },
});
// gros plan bouche (teeth.js) recoloré en jaune
const yMouth = (x, y, s, t, o = {}) => bigMouth(x, y, s, t, o).replace(/#fffdf6/g, YEL) + G(tr(x, y, s), ell(-150, -40, 26, 14, YEL_D, 0) + ell(110, -30, 20, 10, YEL_D, 0) + ell(-40, 60 + 150 * (o.open ?? .45), 22, 10, YEL_D, 0));

// ---------- personnages ----------
const HSH = '#7b5cff';
const ado = (o, t) => person(Object.assign({ age: 'kid', hair: 'side', hairColor: '#3a2a20', shirt: HSH, pants: '#2f3a5a', seed: 2 }, o), t);
const adoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'side', hairColor: '#3a2a20', seed: 2 }, o), t));
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const crushP = (o, t) => person(Object.assign({ age: 'kid', hair: 'long', hairColor: '#2b2420', shirt: '#ff8fb1', pants: '#4b3b6e', skin: '#c98a5e', seed: 5 }, o), t);
const crushHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'long', hairColor: '#2b2420', skin: '#c98a5e', seed: 5 }, o), t));
const maman = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#8a5a3a', shirt: '#e2463a', pants: '#4b5b7a', seed: 4 }, o), t);
const papa = (o, t) => person(Object.assign({ age: 'adult', hair: 'short', hairColor: '#2b2420', mustache: true, shirt: '#4d7cf0', pants: '#2b2b33', seed: 6 }, o), t);
const dentiste = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#6b6b6b', glasses: true, shirt: '#eaf6ff', coat: true, pants: '#7aa6d8', seed: 7 }, o), t);
const meca = (o, t) => person(Object.assign({ age: 'adult', hair: 'short', hairColor: '#1f1a18', cap: '#e2463a', shirt: '#3b6fd8', pants: '#3b6fd8', mustache: true, seed: 8 }, o), t);
const influHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'ponytail', hairColor: '#f0c040', expr: 'perfect', seed: 9 }, o), t));

// ---------- accessoires ----------
function tbrush(x, y, s, r = 0, col = '#36c5f0') { let g = rect(50, -14, 300, 28, col, 14) + rect(-60, -18, 130, 36, col, 14) + rect(-56, -60, 112, 44, '#f4fbff', 8, 5);
  for (let i = 0; i < 6; i++) g += line(-44 + i * 18, -55, -44 + i * 18, -22, 4, '#bfe3f5'); return G(tr(x, y, s, r), g); }
function foam(x, y, t, n = 8, rr = 90, seed = 2) { const q = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const a = q() * 6.28 + t * (1 + q()), d = rr * (.4 + q() * .6); s += circ(x + Math.cos(a) * d, y + Math.sin(a) * d * .6, 10 + q() * 18, '#fff', 4, '#bfe3f5'); } return s; }
function tube(x, y, s, r = 0, label = 'DENTI', col = '#36c5f0') { return G(tr(x, y, s, r), path('M-80 -170L80 -170L60 150L-60 150Z', '#fff') + rect(-80, -60, 160, 70, col, 0, 0) + path('M-80 -170L80 -170L60 150L-60 150Z', 'none') + rect(-34, 150, 68, 50, col, 8) + rect(-70, -190, 140, 26, '#dfe6ee', 8, 5) + ftext(0, -12, label, { size: 34, fill: '#fff' })); }
function floss(x1, y1, x2, y2, t, vib = 1) { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + Math.sin(t * 50) * 14 * vib; return path(`M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}`, 'none', 9, OL) + path(`M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}`, 'none', 4, '#fff'); }
function cake16(x, y, s, t) { let g = rect(-220, -120, 440, 200, '#7b5cff', 30) + path('M-220 -80Q-160 -40 -110 -80T0 -80T110 -80T220 -80', 'none', 14, '#fff') + rect(-250, 70, 500, 30, '#fff', 14);
  for (let i = 0; i < 16; i++) { const cx = -195 + i * 26; g += rect(cx - 6, -185, 12, 65, ['#ffd23f', '#ff8fb1', '#7be07b'][i % 3], 4, 4) + G(tr(cx, -198, 1 + .15 * Math.sin(t * 20 + i)), path('M0 -20Q11 -2 0 7Q-11 -2 0 -20Z', '#ffb340', 3)); } return G(tr(x, y, s), g); }
function camBig(x, y, s, t, flashK = 0) { return G(tr(x, y, s), rect(-170, -100, 340, 200, '#3a3f4a', 30) + rect(-120, -140, 100, 50, '#555', 10) + circ(40, 0, 80, '#2b2b33') + circ(40, 0, 46, '#5ec4f0', 6) + rect(-150, -80, 60, 30, flashK > 0 ? '#fff' : '#ffe9a6', 6) + (flashK > 0 ? op(flashK, glow(-120, -65, 260, '#ffffff', .9)) : '')); }
function padlock(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M-40 0L-40 -50Q-40 -95 0 -95Q40 -95 40 -50L40 0', 'none', 18, '#9aa3ad') + path('M-40 0L-40 -50Q-40 -95 0 -95Q40 -95 40 -50L40 0', 'none', 6, OL).replace('stroke-width="6"', 'stroke-width="4"') + rect(-65, -10, 130, 110, '#ffd23f', 18) + circ(0, 35, 14, OL, 0) + rect(-5, 38, 10, 30, OL, 3, 0)); }
function menuCard(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-230, -300, 460, 600, '#7a2f3a', 22) + rect(-200, -270, 400, 540, '#fff3dc', 14, 5) + ftext(0, -190, 'MENU', { size: 70, fill: '#7a2f3a', stroke: 'none' }) + Array.from({ length: 6 }, (_, i) => line(-150, -110 + i * 60, 150 - (i % 2) * 60, -110 + i * 60, 8, '#d8c4a0')).join('')); }
function shutter(x, y, w, h, k, label = 'FERMÉ') { const hh = h * clamp(k); if (hh <= 0) return ''; let g = rect(-w / 2, -h / 2, w, hh, '#9aa3ad', 10); for (let yy = -h / 2 + 22; yy < -h / 2 + hh; yy += 22) g += line(-w / 2 + 4, yy, w / 2 - 4, yy, 4, '#6b737c'); g += rect(-w / 2 - 14, -h / 2 - 20, w + 28, 26, '#59616c', 8);
  return G(tr(x, y), g + (k >= 1 ? G(tr(0, h / 2 - 50, 1, -6), rect(-90, -26, 180, 52, '#e2463a', 10, 5) + ftext(0, 14, label, { size: 34, fill: '#fff', stroke: 'none' })) : '')); }
function shadeGuide(x, y, s, t, t0) { const cols = ['#fffdf6', '#fbf2d8', '#f6e7b8', '#f1d996', '#ebcb78', '#e2ba5c']; let g = rect(-330, -110, 660, 220, '#3a3f4a', 26);
  cols.forEach((c, i) => { const k = pop(t, t0 + i * .1, .3); if (k > 0) g += G(tr(-262 + i * 105, 0, k), rect(-40, -70, 80, 120, c, 30, 5) + ftext(0, 85, 'A' + (i + 1), { size: 26, fill: '#fff', stroke: 'none' })); }); return G(tr(x, y, s), g); }
function toothCut(x, y, s, t, k = 1) { // coupe de dent : émail translucide, dentine jaune, pulpe rose
  const out = 'M-170 -200Q-190 -290 -90 -290Q0 -270 90 -290Q190 -290 170 -200L150 60Q140 260 80 280Q50 160 0 160Q-50 160 -80 280Q-140 260 -150 60Z';
  return G(tr(x, y, s), path(out, 'rgba(240,250,255,.85)') + G('scale(.8) translate(0 10)', path(out, '#ebc35a', 5)) + G('scale(.42) translate(0 40)', path(out, '#ff8fa3', 4)) + ell(-90, -230, 40, 18, 'rgba(255,255,255,.9)', 0)); }
function sunGlasses(x, y, s) { return G(tr(x, y, s), rect(-150, -40, 130, 80, OL, 30, 0) + rect(20, -40, 130, 80, OL, 30, 0) + line(-20, -20, 20, -20, 12) + ell(-110, -15, 25, 10, 'rgba(255,255,255,.5)', 0) + ell(60, -15, 25, 10, 'rgba(255,255,255,.5)', 0)); }
function recFrame(t) { let s = ''; for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) s += path(`M${CX + a * 420} ${900 + b * 520 - b * 90}L${CX + a * 420} ${900 + b * 520}L${CX + a * 420 - a * 90} ${900 + b * 520}`, 'none', 10, '#fff'); return s + circ(170, 420, 16, Math.sin(t * 6) > 0 ? '#ff3b30' : 'rgba(0,0,0,0)', 0) + ftext(200, 434, 'REC', { size: 40, anchor: 'start', fill: '#fff' }) + path(`M${CX - 40} 900L${CX + 40} 900M${CX} 860L${CX} 940`, 'none', 5, '#fff'); }
const sweatDrops = (x, y, t) => sweatSpray(x, y, t, 4);
const wFlash = (t, t0, d = .3) => t > t0 && t < t0 + d ? op(1 - seg(t, t0, t0 + d), rect(-300, -300, W + 600, H + 600, '#fff', 0, 0)) : '';
// pour les têtes de brosse sur la bouche : main + brosse qui frotte
function brushing(x, y, s, t, sp = 30, amp = 30, col) { return G(tr(x + Math.sin(t * sp) * amp, y, s), tbrush(0, 0, 1, 0, col)) + foam(x - 20, y - 10, t, 6, 90 * s); }

// ---------- décors vivants ----------
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff');
function tree(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c')); }
function kidsBg(t, y = 1150, n = 4, sc = .45) { let s = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; s += person({ age: 'kid', x, y, s: sc, hair: ['curly', 'bun', 'short', 'ponytail'][i % 4], hairColor: ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040'][i % 4], shirt: ['#ff8fb1', '#7aa6d8', '#ffd23f', '#7be07b'][i % 4], expr: 'happy', walk: 3, flip: i % 2, seed: 20 + i }, t); } return s; }
function schoolyard(t) { return SKY(t) + building(-120, 1180, 640, 560, '#f0d9b5') + building(560, 1180, 700, 470, '#e8c9a0') + rect(-M, 1180, W + 2 * M, 1500, '#c9b8a0', 0, 0) + tree(950, 1200, .9, t) + kidsBg(t, 1230, 3); }
function park(t) { return SKY(t, '#9fe0ff', '#fff4dc') + rect(-M, 1100, W + 2 * M, 1000, '#8fd16a', 0, 0) + tree(120, 1160, 1, t) + tree(980, 1140, 1.1, t) + Array.from({ length: 10 }, (_, i) => circ((i * 211) % W, 1300 + (i * 97) % 500, 10, ['#ffd23f', '#ff8fb1', '#fff'][i % 3], 3)).join(''); }
function bathroom2(t) { return bathroomWall(t) + mirror(190, 300, 700, 820) + sink(CX, 1300) + towel(1010, 700, 120, 300, '#ff8fb1', '#ffc2d6', wave(t, .5, 3)) + G(tr(240, 1180), rect(-40, -90, 80, 90, '#7be07b', 14) + tbrush(10, -120, .35, -80)); }
function bedroomDay(t) { return grad('#ffe6c8', '#ffd9b0', -M, -M, W + 2 * M, H + 2 * M) + windowFrame(640, 280, 320, 380) + cloud(((t * 40) % 500) + 600, 400, .5, '#fff') + rect(110, 320, 260, 340, '#7aa6d8', 12) + ftext(240, 520, 'ROCK', { size: 60, fill: '#fff' }) + rect(-M, 1250, W + 2 * M, 1400, '#c49a6c', 0, 0); }
function restaurant(t) { let s = grad('#a8463f', '#7a2f3a', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 900, W + 2 * M, 400, '#5a2229', 0, 0) + line(-M, 900, W + M, 900, 10, '#e0b070');
  s += rect(80, 300, 380, 300, '#1d2350', 14) + Array.from({ length: 6 }, (_, i) => rect(110 + i * 58, 600 - 80 - (i * 47 % 120), 40, 80 + (i * 47 % 120), '#2e3570', 0, 0) + rect(118 + i * 58, 540 - (i * 47 % 120), 10, 10, Math.sin(t * 3 + i) > 0 ? '#ffe9a6' : '#3a4280', 0, 0)).join('') + line(270, 300, 270, 600, 8) + rect(80, 300, 380, 300, 'none', 14);
  s += frame(640, 360, 300, 220, '#f0c070');
  for (let i = 0; i < 3; i++) { const x = 200 + i * 340, a = Math.sin(t * 1.6 + i) * 6; s += G(tr(x, -40, 1, a), line(0, 0, 0, 260, 5) + path('M-70 300L70 300L40 250L-40 250Z', '#e0b070') + glow(0, 330, 140, '#ffe9a6', .35)); }
  s += person({ age: 'adult', x: ((t * 160) % 1600) - 250, y: 1230, s: .55, hair: 'side', hairColor: '#2b2420', shirt: '#fff', pants: '#2b2b33', expr: 'happy', walk: 3, seed: 31 }, t);
  return s + rect(-M, 1240, W + 2 * M, 900, '#3a1d22', 0, 0); }
function restoTable(y = 1250) { return rect(-M, y, W + 2 * M, 700, '#fff', 0, 0) + Array.from({ length: 12 }, (_, i) => rect(-100 + i * 120, y, 60, 700, 'rgba(226,70,58,.35)', 0, 0)).join('') + line(-M, y, W + M, y, 8) + circ(CX, y + 80, 70, '#fff', 6) + rect(CX - 10, y - 90, 20, 70, '#fff6c8', 4, 4) + path(`M${CX} ${y - 120}q12 16 0 26q-12 -10 0 -26Z`, '#ffb340', 3); }
function garage(t) { let s = grad('#c9d1db', '#aab4bf', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 260, W + 2 * M, 30, '#e2463a', 0, 0);
  s += rect(60, 380, 300, 360, '#8a8f96', 10) + Array.from({ length: 12 }, (_, i) => circ(100 + (i % 4) * 70, 420 + Math.floor(i / 4) * 100, 7, '#5b6168', 0)).join('') + G(tr(140, 520, 1, 20), rect(-12, -60, 24, 120, '#e2463a', 6, 4)) + G(tr(250, 520, 1, -15), rect(-10, -70, 20, 140, '#555', 6, 4));
  s += rect(700, 360, 300, 420, '#ffd23f', 14) + Array.from({ length: 4 }, (_, i) => rect(720, 380 + i * 100, 260, 80, i % 2 ? '#2b2420' : '#ffd23f', 0, 0)).join('').slice(0, 0);
  s += G(tr(850, 560), circ(0, 0, 90, '#2b2b33') + circ(0, 0, 40, '#9aa3ad', 6));
  for (let i = 0; i < 8; i++) s += path(`M${-M + i * 260 - ((t * 60) % 260)} 1250l120 0l-60 140l-120 0Z`, i % 2 ? '#2b2420' : '#ffd23f', 0);
  return s + rect(-M, 1300, W + 2 * M, 900, '#6b737c', 0, 0); }
function dentistRoom(t) { let s = grad('#d9f5ef', '#bfe9e0', -M, -M, W + 2 * M, H + 2 * M) + windowFrame(660, 300, 320, 360) + cloud(((t * 40) % 400) + 640, 420, .45, '#fff');
  s += rect(110, 300, 280, 380, '#fff', 14) + G(tr(250, 470, .7), toothChar(0, 0, 1, t, { expr: 'happy' })) + ftext(250, 640, 'SOURIEZ !', { size: 38, fill: '#36c5b4', stroke: 'none' });
  return s + rect(-M, 1250, W + 2 * M, 900, '#9fd6e6', 0, 0) + Array.from({ length: 12 }, (_, i) => line(-100 + i * 120, 1250, -260 + i * 160, H + 100, 4, 'rgba(255,255,255,.4)')).join(''); }
function dining(t) { let s = grad('#ffe7c2', '#ffd59a', -M, -M, W + 2 * M, H + 2 * M); for (let i = -6; i < 16; i++) s += rect(i * 110, -M, 50, H + 2 * M, 'rgba(255,255,255,.3)', 0, 0);
  s += windowFrame(640, 260, 340, 380, '#ffb36b', '#ffe3c2') + cloud(((t * 30) % 500) + 600, 380, .5, '#fff3e0') + frame(120, 320, 300, 230, '#9fd3a7') + plant(1000, 1250, 1);
  const a = Math.sin(t * 1.4) * 5; s += G(tr(CX, -60, 1, a), line(0, 0, 0, 300, 6) + path('M-120 360L120 360L70 290L-70 290Z', '#7b5cff') + glow(0, 400, 220, '#fff3c0', .4));
  return s + rect(-M, 1240, W + 2 * M, 900, '#b07a4a', 0, 0); }
function diningTable(t, jump = 0, y = 1235) { let s = rect(-M, y, W + 2 * M, 900, '#fff6e6', 0, 0) + line(-M, y, W + M, y, 8) + rect(-M, y + 40, W + 2 * M, 18, '#ff8fb1', 0, 0);
  for (let i = 0; i < 4; i++) { const x = 140 + i * 270, j = jump * Math.abs(Math.sin(t * 22 + i * 1.3)) * 30; s += G(tr(x, y + 60 - j), ell(0, 0, 90, 26, '#fff', 6) + ell(0, -6, 50, 14, ['#ff7a3d', '#7be07b', '#ffd23f', '#e2463a'][i], 0)) + G(tr(x + 100, y + 10 - j * .8), rect(-20, -60, 40, 70, 'rgba(180,220,255,.7)', 8, 5)); }
  return s; }
function shopAisle(t) { let s = grad('#f4f7fb', '#dfe7ef', -M, -M, W + 2 * M, H + 2 * M) + G(tr(CX, 300), rect(-330, -60, 660, 120, '#2b2420', 30) + ftext(0, 26, 'BLANC+++', { size: 70, fill: Math.sin(t * 8) > -.3 ? '#7be0ff' : '#3a5a70', stroke: 'none' }));
  for (let r = 0; r < 4; r++) { const y = 520 + r * 200; s += rect(-M, y + 90, W + 2 * M, 24, '#9aa3ad', 0, 5); for (let i = 0; i < 11; i++) { const x = 20 + i * 100 + (r % 2) * 40; s += rect(x, y - 30 + (i * 37 % 30), 70, 120 - (i * 37 % 30), ['#36c5f0', '#fff', '#7b5cff', '#ff8fb1', '#7be0ff'][(i + r) % 5], 10, 5) + rect(x + 10, y + 20, 50, 16, '#ffd23f', 3, 0); } }
  s += person({ age: 'adult', x: ((t * -140) % 1600 + 1600) % 1600 - 250, y: 1260, s: .5, hair: 'bun', hairColor: '#8a5a3a', shirt: '#ff8fb1', expr: 'happy', walk: 3, flip: 1, seed: 33 }, t);
  return s + rect(-M, 1260, W + 2 * M, 900, '#e8eef2', 0, 0) + Array.from({ length: 10 }, (_, i) => line(-200 + i * 160, 1260, -400 + i * 200, H + 100, 4, '#c9d1db')).join(''); }
function stageNight(t) { let s = grad('#1b1440', '#0d0a22', -M, -M, W + 2 * M, H + 2 * M);
  for (let i = 0; i < 4; i++) { const a = Math.sin(t * 1.5 + i * 1.7) * 30; s += G(tr(120 + i * 280, 1250, 1, a), path('M-30 0L30 0L260 -1500L-260 -1500Z', 'rgba(255,255,220,.13)', 0)); }
  return s + rect(-M, 1250, W + 2 * M, 900, '#2b2040', 0, 0) + Array.from({ length: 9 }, (_, i) => circ(60 + i * 120, 1270, 26, Math.sin(t * 9 + i) > 0 ? '#ffd23f' : '#ff4fa0', 5)).join(''); }
function classroomB(t) { return grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + rect(60, 300, 960, 520, '#3c5a48', 18) + rect(80, 320, 920, 480, '#456b55', 10, 0) + wallClock(940, 200, 60, t) + rect(-M, 1250, W + 2 * M, 900, '#c49a6c', 0, 0); }
function nightRoom(t, light = 0) { return grad('#141a3a', '#222a58', -M, -M, W + 2 * M, H + 2 * M) + rect(640, 250, 340, 400, '#0b1030', 12) + circ(840, 380, 50, '#fff6d6', 0) + Array.from({ length: 6 }, (_, i) => circ(680 + (i * 53) % 280, 300 + (i * 97) % 300, 4, Math.sin(t * 4 + i) > 0 ? '#fff' : '#556', 0)).join('') + rect(640, 250, 340, 400, 'none', 12) + line(810, 250, 810, 650, 8) + rect(-M, 1250, W + 2 * M, 900, '#2a2238', 0, 0) + (light ? glow(CX, 900, 600, '#fff6c8', .35 * light) : ''); }

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, tête en cut-out (lèvres serrées → sourire jaune), étoiles « débloqué », titre cinétique, brosse qui frotte
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const J = at(1, 'jaunes'), Mm = at(1, 'meme');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 1010, t, J, { part: 'back', r: 480 }) + burst(CX, 1010, 300, t, .45, SX.acc, 16) +
      G(tr(CX, 1010, 1 + .03 * Math.sin(t * 6)), cutout(adoHead(0, 0, 170, { expr: t > J ? 'yJoy' : 'pressed' }, t), 14)) + (t > Mm ? brushing(CX + 135, 1082, .7, t, 34, 14) : '') +
      unlock(CX, 1010, t, J, { part: 'front', r: 480 }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'AVOIR LES", CX, 415, t, .3, { size: 58 }) + kword('DENTS JAUNES ?', CX, 540, t, at(1, 'dents') - .05, { size: 80, fill: SX.acc2 }) +
      funBox(CX, 1075, 300, 130, t, J + .25, { label: 'dents.png', col: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'dents') - .05, 'boom', .6], [at(1, 'jaunes'), 'sparkle', .6], [at(1, 'meme') + .1, 'scratch', .5], [at(1, 'brossant'), 'spray', .4]] });
// B002 — matin et soir : papier + ombre de feuillage, brossage frénétique, soleil puis lune
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Ma = at(2, 'matin'), So = at(2, 'soir');
    return paper(SX.paper) + gobo(T, .12) + blob(CX, 1000, 300, t, '#ffe1b8', 2) + G(tr(CX, 1000), cutout(adoHead(0, 0, 190, { expr: 'yEffort' }, t), 12)) + brushing(CX + 130, 1078, .85, t, 40, 34) +
      (t > Ma ? G(tr(250, 640, pop(t, Ma, .4)), sun(0, 0, .45, t, 'happy')) + funTag(250, 820, 'MATIN', t, Ma, { size: 46, bg: SX.acc2, fg: SX.ink }) : '') +
      (t > So ? G(tr(830, 640, pop(t, So, .4), -10), path('M40 -110A120 120 0 1 0 40 110A90 90 0 1 1 40 -110Z', '#fff3a0') + sparkle(-120, -90, .4, '#fff')) + funTag(830, 820, 'SOIR', t, So, { size: 46, bg: SX.acc }) : '') +
      kthin('tu te brosses les dents', CX, 400, t, 0, { size: 54 }); },
  sfx: [[0, 'whoosh', .5], [at(2, 'brosses'), 'scratch', .6], [at(2, 'matin'), 'chirp', .6], [at(2, 'soir'), 'crickets', .5], [at(2, 'soir') + .1, 'pop', .5]] });
// B003 — fil dentaire : grille, fil tendu qui vibre comme une corde de guitare, mains de chaque côté
B(3, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const F = at(3, 'fil'); const saw = Math.sin(t * 25) * 20;
    return gridBg('#2a2440') + halftoneFade(SX.acc, .12, 1) + G(tr(CX, 1000), cutout(adoHead(0, 0, 190, { expr: 'yEffort', face: { eyes: 'huge' } }, t), 12)) +
      floss(150 + saw, 1060, 930 + saw, 1060, t, t > F ? 1 : .2) + hand(140 + saw, 1060, .7, 0, HSH) + G(tr(940 + saw, 1060, 1, 180), hand(0, 0, .7, 0, HSH)) +
      kthin('tu utilises du', CX, 360, t, 0, { size: 56 }) + kword('FIL DENTAIRE', CX, 480, t, F - .05, { size: 90, fill: SX.acc2 }) + (t > F ? popStars(CX, 1060, t, F, 6, 320) : ''); },
  sfx: [[.05, 'pop', .5], [at(3, 'fil') - .05, 'boom', .5], [at(3, 'fil'), 'boing', .7], [at(3, 'dentaire'), 'squeak', .6]] });
// B004 — tout correctement : salle de bain, checklist qui se coche, tampon PARFAIT
B(4, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const To = at(4, 'tout'), C = at(4, 'correctement'); const items = ['BROSSE', 'FIL', 'BAIN DE BOUCHE'];
    return bathroom2(t) + ado({ x: 330, y: 1500, s: 1.35, expr: t > C ? 'pressedHappy' : 'smugger', armR: [-40, -70] }, t) +
      G(tr(760, 780, 1, 4), rect(-220, -260, 440, 520, '#fff', 24) + items.map((w, i) => ftext(-150, -130 + i * 150, w, { size: 40, fill: SX.ink, anchor: 'start', stroke: 'none' }) + rect(-200, -168 + i * 150, 40, 40, 'none', 6, 5) + (t > To + i * .15 ? path(`M-196 ${-150 + i * 150}l14 18l30 -40`, 'none', 10, '#36a85a') : '')).join('')) +
      stamp(760, 1110, 'PARFAIT', t, C, '#36a85a', -10) + (t > C ? popStars(330, 900, t, C) : ''); },
  sfx: [[0, 'whoosh', .5], [at(4, 'tout'), 'tick', .6], [at(4, 'tout') + .15, 'tick', .6], [at(4, 'tout') + .3, 'tick', .6], [at(4, 'correctement'), 'thud', .7], [at(4, 'correctement') + .1, 'ding', .5]] });
// B005a — Kevin dans la cour : il te pointe du doigt en rigolant
B(5, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t) * 15 }, [{ z: 1.5, svg: schoolyard(t), haze: .08 }, { z: 1, svg: ado({ x: 300, y: 1500, s: 1.35, expr: 'pressedHappy' }, t) + kevin({ x: 780, y: 1500, s: 1.35, expr: t > at(5, 'demande') ? 'mock' : 'smug', flip: 1, armL: [190, 195] }, t) }, { z: .6, svg: blur(10, G(tr(CX, 1820), rect(-800, -120, 1600, 240, '#7bbf5a', 60))) }]) +
    funTag(780, 470, 'KEVIN', t, at(5, 'kevin'), { size: 50, bg: '#5fb85f' }) + markerArrow(640, 560, 740, 760, t, at(5, 'kevin') + .2, { col: SX.acc2 }),
  sfx: [[0, 'school_bell', .4], [at(5, 'kevin'), 'pop', .6], [at(5, 'kevin') + .2, 'scratch', .4], [at(5, 'demande'), 'hmm', .5]] });
// B005b — « découvrir le dentifrice » : Kevin en explorateur brandit un tube sacré sous les rayons, tu restes bouche bée (lèvres serrées)
B(5, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), hand: .4 }),
  draw: (t, d, T) => { const D = at(5, 'dentifrice') - at(5, 'decouvrir') + .15; const k = pop(t, .05, .45);
    return rays(t, CX, 760, '#ffe9a6', '#ffd76b', 22) + glow(CX, 760, 420, '#ffffff', .6) + G(tr(CX, 760 - 30 * k, 1.15 * k, Math.sin(t * 4) * 6), tube(0, 0, 1, 0, 'DENTI', SX.acc)) + popStars(CX, 760, t, .1, 8, 300) +
      kevinHead(800, 1050, 120, { expr: 'mock', look: [-1, 0] }, t) + G(tr(800, 1050 - 110), path('M-150 0Q-140 -120 0 -130Q140 -120 150 0Z', '#e8d8a0') + rect(-180, -10, 360, 26, '#c9b880', 13)) +
      adoHead(280, 1050, 120, { expr: 'pressedShock' }, t) + kword('LE DENTIFRICE', CX, 420, t, D - .1, { size: 84, fill: SX.acc2 }) + kthin('tu comptes découvrir…', CX, 320, t, 0, { size: 46 }); },
  sfx: [[0, 'flash_hit', .5], [.05, 'angel', .7], [at(5, 'dentifrice') - at(5, 'decouvrir') + .05, 'boom', .5], [.9, 'rimshot', .4]] }, at(5, 'decouvrir') - .15);
// B006 — « Magnifique. » : gros plan blasé, crickets
B(6, { enter: 'punch', cam: zin(1.06, 1.12),
  draw: (t, d, T) => blur(8, schoolyard(t)) + adoHead(CX, 940, 250, { expr: 'deadpan' }, t) + kword('MAGNIFIQUE.', CX, 420, t, at(6, 'magnifique') - .05, { size: 96, fill: '#fff', puff: false }) + text(860, 700, OL, '...', '#fff', 90),
  sfx: [[at(6, 'magnifique') - .05, 'glint', .5], [0, 'crickets', .6]] });
// B007 — 16 ans : chambre, gâteau à 16 bougies, sourire lèvres serrées
B(7, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => bedroomDay(t) + ado({ x: CX, y: 1430, s: 1.4, expr: 'pressedHappy', armL: [200, 230], armR: [-20, -50] }, t) + cake16(CX, 1330, .9, t) + confetti(t, 0, 30) + funTag(CX, 430, '16 ANS', t, at(7, '16') - .1, { size: 80, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'whoosh', .6], [at(7, '16') - .1, 'tada', .6], [at(7, '16') + .2, 'pop', .5]] });
// B008a — à chaque photo : flash de l'appareil, les potes sourient, toi bouche cousue
B(8, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const P = at(8, 'photo'); let s = park(t);
    s += person({ age: 'kid', x: 200, y: 1480, s: 1.05, hair: 'curly', hairColor: '#2b2420', shirt: '#ff8fb1', expr: 'joy', armR: [-60, -90], seed: 40 }, t) + ado({ x: CX, y: 1480, s: 1.1, expr: 'pressed' }, t) + person({ age: 'kid', x: 880, y: 1480, s: 1.05, hair: 'bun', hairColor: '#8a5a3a', shirt: '#ffd23f', expr: 'joy', armL: [240, 270], seed: 41 }, t);
    return s + funBox(CX, 1080, 230, 120, t, P + .15, { label: 'toi.jpg', col: SX.acc }) + blur(8, camBig(CX, 1700, 1.3, t, 0)) + wFlash(t, P, .3) + funTag(CX, 420, 'CHEESE !', t, at(8, 'chaque'), { size: 60, bg: '#fff', fg: SX.ink }); },
  sfx: [[at(8, 'chaque'), 'pop', .5], [at(8, 'photo'), 'shutter', .9], [at(8, 'photo') + .2, 'hmm', .4]] });
// B008b — lèvres fermées : gros plan, fermeture éclair sur la bouche + cadenas
B(8, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d) }),
  draw: (t, d, T) => { const L = at(8, 'levres') - at(8, 'souris') + .15, Fe = at(8, 'fermees') - at(8, 'souris') + .15;
    return grad('#c9b8ff', '#9f8cff', -M, -M, W + 2 * M, H + 2 * M) + halftoneFade('#fff', .12, 1) + adoHead(CX, 900, 270, { expr: t > Fe ? 'zipped' : 'pressedHappy' }, t) + (t > Fe ? G(tr(CX + 120, 1100 + Math.sin(t * 6) * 8, pop(t, Fe, .35), Math.sin(t * 4) * 10), padlock(0, 0, .8)) : '') +
      funTag(CX, 430, 'MODE CADENAS', t, Fe, { size: 58, bg: SX.acc }) + markerCircle(CX, 1000, 150, 70, t, L, { col: SX.acc2 }); },
  sfx: [[at(8, 'levres') - at(8, 'souris') + .15, 'scratch', .5], [at(8, 'fermees') - at(8, 'souris') + .15, 'snip', .7], [at(8, 'fermees') - at(8, 'souris') + .35, 'thud', .6]] }, at(8, 'souris') - .15);
// B009a — au restaurant : lampes qui se balancent, serveur qui passe, tout le monde rigole
B(9, { enter: 'whip', cam: zin(1.02, 1.07, .4),
  draw: (t, d, T) => restaurant(t) + crushP({ x: 230, y: 1460, s: 1.15, expr: 'laugh' }, t) + ado({ x: CX, y: 1460, s: 1.2, expr: 'pressed' }, t) + kevin({ x: 860, y: 1460, s: 1.15, expr: 'laugh', flip: 1 }, t) + restoTable() + funTag(CX, 420, 'AU RESTO', t, at(9, 'restaurant'), { size: 56, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'whoosh', .5], [at(9, 'restaurant'), 'pop', .5], [.3, 'ding', .3]] });
// B009b — tu caches ta bouche quand tu ris : un menu GÉANT devant la bouche, les HA HA dépassent
B(9, { enter: 'punch', cam: camHand(1.06, .6),
  draw: (t, d, T) => { const C = at(9, 'caches') - at(9, 'caches') + .15, Ri = at(9, 'ris') - at(9, 'caches') + .15; const up = eOutBack(seg(t, C - .1, C + .3));
    return restaurant(t) + adoHead(CX, 880, 230, { expr: 'yLaugh' }, t) + G(tr(CX, lerp(1600, 1250, up), 1, Math.sin(t * 20) * 2), menuCard(0, 0, 1)) + restoTable(1330) +
      funTag(260, 560, 'HA', t, Ri - .2, { size: 60, bg: '#fff', fg: SX.ink, r: -12 }) + funTag(820, 520, 'HA HA', t, Ri - .05, { size: 54, bg: '#fff', fg: SX.ink, r: 10 }) + sweatDrops(CX, 760, t); },
  sfx: [[.15, 'whoosh_up', .6], [.4, 'thud', .5], [at(9, 'ris') - at(9, 'caches') - .05, 'pop', .5], [at(9, 'ris') - at(9, 'caches') + .1, 'pop_hi', .5]] }, at(9, 'caches') - .15);
// B010a — ton crush : « montre tes dents ! » (cœurs), toi en sueur
B(10, { enter: 'drop', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const Mo = at(10, 'montre'); return park(t) + crushP({ x: 290, y: 1500, s: 1.35, expr: 'love', armR: [-30, -50] }, t) + heartsUp(t, 290, 900, 4) + ado({ x: 780, y: 1500, s: 1.35, expr: t > Mo ? 'pressedShock' : 'pressedHappy', flip: 1, tremble: t > Mo ? 1 : 0 }, t) +
    funTag(290, 650, 'CRUSH', t, at(10, 'crush'), { size: 46, bg: '#ff8fb1' }) + burst(CX, 440, 230, t, Mo - .1, '#fff', 14) + ftext(CX, 410, 'MONTRE', { size: 54, fill: SX.ink, stroke: 'none' }).repeat(t > Mo ? 1 : 0) + (t > at(10, 'dents') ? ftext(CX, 480, 'TES DENTS !', { size: 54, fill: SX.acc, stroke: 'none' }) : ''); },
  sfx: [[at(10, 'crush'), 'kiss', .6], [at(10, 'montre') - .1, 'pop', .7], [at(10, 'dents'), 'gasp', .6], [at(10, 'dents') + .3, 'heartbeat', .6]] });
// B010b — contrôle technique : au garage, sur le pont élévateur, le mécano inspecte ta bouche à la lampe → CONTRE-VISITE
B(10, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t < .3 ? 6 : 0 }),
  draw: (t, d, T) => { const C = at(10, 'controle') - at(10, 'impression') + .15, Te = at(10, 'technique') - at(10, 'impression') + .15; const lift = eInOut(seg(t, 0, .8)) * 120;
    return garage(t) + rect(110, 1270 - lift, 480, 40, '#e2463a', 8) + rect(320, 1310 - lift, 60, lift + 20, '#9aa3ad', 4) + ado({ x: 350, y: 1270 - lift, s: 1.25, expr: 'zipped', tremble: 1 }, t) +
      meca({ x: 820, y: 1520, s: 1.2, expr: 'suspicious', flip: 1, armL: [200, 190] }, t) + G(tr(640, 1000, 1, 15), path('M0 -10L-260 -150L-260 120Z', 'rgba(255,250,200,.35)', 0) + rect(0, -20, 90, 40, '#ffd23f', 10)) +
      G(tr(980, 900, 1, 6), rect(-70, -100, 140, 200, '#fff', 10) + Array.from({ length: 4 }, (_, i) => line(-45, -60 + i * 40, 45, -60 + i * 40, 6, '#c9d1db')).join('')) +
      funTag(CX, 380, 'CONTRÔLE TECHNIQUE', t, C - .1, { size: 46, bg: SX.acc2, fg: SX.ink }) + stamp(CX, 560, 'CONTRE-VISITE', t, Te + .35, '#e2463a', -8); },
  sfx: [[0, 'flash_hit', .5], [.05, 'hammer', .5], [.2, 'squeak', .5], [at(10, 'controle') - at(10, 'impression') + .05, 'pop', .6], [at(10, 'technique') - at(10, 'impression') + .5, 'thud', .8]] }, at(10, 'impression') - .15);
// B011a — LE PROBLÈME : concept (fond violet, blob), tête perplexe
B(11, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => grad('#5a3fd8', '#7b5cff', -M, -M, W + 2 * M, H + 2 * M) + halftoneFade('#fff', .08, 1) + blob(CX, 960, 260, t, SX.acc2, 3) + G(tr(CX, 960), cutout(adoHead(0, 0, 170, { expr: 'confused' }, t), 12)) + qmark(CX + 250, 760, 1, '#fff', 12) +
    kword('LE PROBLÈME', CX, 450, t, at(11, 'probleme') - .05, { size: 92, fill: '#fff' }),
  sfx: [[0, 'whoosh', .5], [at(11, 'probleme') - .05, 'boom', .6], [at(11, 'probleme') + .4, 'hmm', .5]] });
// B011b — « pas blanches comme du papier » : une feuille A4 snob vs une dent jaunâtre souriante, ≠ géant
B(11, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Bl = at(11, 'blanches') - at(11, 'naturellement') + .15, Pa = at(11, 'papier') - at(11, 'naturellement') + .15;
    return paper('#fff6e0') + gobo(T, .1) + G(tr(270, 900, pop(t, .05, .4), -6 + Math.sin(t * 3) * 3), rect(-160, -220, 320, 440, '#ffffff', 8) + path('M90 -220L160 -150L90 -150Z', '#e6eef5', 6) + G(tr(0, -40), head({ hr: 70, hair: 'none', skin: 'none', cheeks: false, expr: 'smug', seed: 12 }, t).replace(/<circle cx="0" cy="0" r="70"[^>]*\/>/, ''))) +
      G(tr(810, 900, pop(t, .25, .4)), toothChar(0, 0, 1.25, t, { col: YEL, expr: 'happy' })) + G(tr(CX, 900, pop(t, Bl, .3)), text(0, 40, OL, '≠', '#fff', 170)) +
      funTag(270, 1180, 'PAPIER', t, Pa, { size: 40, bg: '#fff', fg: SX.ink }) + funTag(810, 1180, 'DENT', t, Pa + .1, { size: 40, bg: YEL, fg: SX.ink }) + kthin('pas naturellement', CX, 380, t, 0, { size: 54 }) + kword('BLANCHES', CX, 500, t, Bl - .05, { size: 100, fill: '#fff' }); },
  sfx: [[.05, 'pop', .5], [.25, 'pop', .5], [at(11, 'blanches') - at(11, 'naturellement') + .1, 'boom', .5], [at(11, 'papier') - at(11, 'naturellement') + .15, 'printer', .4]] }, at(11, 'naturellement') - .15);
// B012a — les teintes varient : chez le dentiste, nuancier géant qui se déploie
B(12, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Te = at(12, 'teintes'); return dentistRoom(t) + dentiste({ x: 840, y: 1520, s: 1.25, expr: 'happy', flip: 1, armL: [200, 220] }, t) + ado({ x: 260, y: 1500, s: 1.2, expr: 'pressed' }, t) + shadeGuide(CX, 760, 1, t, Te - .1) + funTag(CX, 470, 'NUANCIER', t, at(12, 'varient'), { size: 56, bg: SX.cool }); },
  sfx: [[0, 'whoosh', .5], [at(12, 'teintes') - .1, 'pop_hi', .4], [at(12, 'teintes') + .1, 'pop_hi', .4], [at(12, 'teintes') + .3, 'pop_hi', .4], [at(12, 'varient'), 'ding', .5]] });
// B012b — l'émail et la dentine : coupe d'une dent géante (émail translucide, dentine jaune dessous), flèches au marqueur
B(12, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .25 }),
  draw: (t, d, T) => { const o = at(12, 'notamment') - .15, E = at(12, 'mailles') - o, De = at(12, 'dentine') - o, Ds = at(12, 'dessous') - o;
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: blur(10, dentistRoom(t)), haze: .2 }, { z: 1, svg: G(tr(CX, 860, 1.25), toothCut(0, 0, 1, t)) + adoHead(860, 1110, 70, { expr: 'wow', look: [-1, -1] }, t) }]) +
      markerArrow(230, 560, 360, 650, t, E, { bend: -40, col: '#fff' }) + funTag(230, 500, 'ÉMAIL', t, E, { size: 46, bg: '#fff', fg: SX.ink }) +
      markerArrow(870, 560, 640, 760, t, De, { bend: 60, col: YEL }) + funTag(870, 500, 'DENTINE', t, De, { size: 46, bg: YEL, fg: SX.ink }) + (t > Ds ? markerText('dessous !', CX, 1180, t, Ds, { size: 54, col: SX.acc2 }) : ''); },
  sfx: [[.05, 'whoosh', .4], [at(12, 'mailles') - at(12, 'notamment') + .15, 'scratch', .5], [at(12, 'dentine') - at(12, 'notamment') + .15, 'scratch', .5], [at(12, 'dessous') - at(12, 'notamment') + .15, 'pop', .5]] }, at(12, 'notamment') - .15);
// B013 — parfaitement saines : la dent jaune en pleine forme (muscles, médaille), dentiste pouce levé, DÉBLOQUÉ
B(13, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const S = at(13, 'saines'), Pa = at(13, 'parfaitement'); return dentistRoom(t) + unlock(CX, 860, t, S, { part: 'back', r: 460 }) + dentiste({ x: 850, y: 1520, s: 1.25, expr: 'joy', flip: 1, armL: [250, 280] }, t) +
    G(tr(420, 900 + Math.sin(t * 8) * 10), toothChar(0, 0, 1.5, t, { col: YEL, expr: t > Pa ? 'proud' : 'happy' }) + (t > Pa ? G(tr(0, 230), circ(0, 0, 46, '#ffd23f') + ftext(0, 14, '1', { size: 40, fill: SX.ink, stroke: 'none' })) : '')) +
    unlock(420, 860, t, S, { part: 'front', r: 460 }) + funTag(420, 560, 'LÉGÈREMENT JAUNE', t, at(13, 'legerement'), { size: 40, bg: YEL, fg: SX.ink }) + stamp(CX, 1150, '100% SAINES', t, S, '#36a85a', -6); },
  sfx: [[0, 'whoosh', .5], [at(13, 'legerement'), 'pop', .5], [at(13, 'parfaitement'), 'ding', .5], [at(13, 'saines'), 'tada', .7], [at(13, 'saines') + .1, 'sparkle', .5]] });
// B014a — sur Internet : chambre, téléphone, fil d'influenceurs aux sourires blancs, cœurs qui volent
B(14, { enter: 'whip', cam: camHand(1.05, .4),
  draw: (t, d, T) => { const scroll = (t * 380) % 300; let feed = '';
    for (let i = -1; i < 3; i++) feed += G(tr(0, -180 + i * 300 - scroll + 300), rect(-130, -120, 260, 240, '#fff', 14, 4) + influHead(0, 0, 80, { hair: ['ponytail', 'short', 'curly', 'long'][(i + 4) % 4], hairColor: ['#f0c040', '#2b2420', '#8a5a3a', '#c4521b'][(i + 4) % 4], seed: 50 + i }, t));
    return bedroomDay(t) + ado({ x: 270, y: 1520, s: 1.3, expr: 'pressedShock', flip: 0 }, t) + G(tr(700, 820, 1.25, 6), rect(-170, -330, 340, 660, '#2b2b33', 44) + `<clipPath id="fd"><rect x="-150" y="-295" width="300" height="590" rx="24"/></clipPath>` + rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + `<g clip-path="url(#fd)">${feed}</g>`) +
      heartsUp(t, 760, 600, 5) + funTag(700, 330, 'INTERNET', t, at(14, 'internet') - .1, { size: 50, bg: SX.acc }); },
  sfx: [[0, 'vibrate', .5], [at(14, 'internet') - .1, 'pop', .6], [at(14, 'monde'), 'typing', .4], [at(14, 'possede'), 'glint', .5]] });
// B014b — 32 projecteurs LED dans la bouche : l'influenceuse sourit, faisceaux de stade, toi soufflé avec des lunettes noires
B(14, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), shake: 5 }),
  draw: (t, d, T) => { const o = at(14, '32') - .15, P = at(14, 'projecteurs') - o, Bo = at(14, 'bouche') - o; let beams = '';
    for (let i = 0; i < 9; i++) { const a = -70 + i * 17.5 + Math.sin(t * 3 + i) * 4; beams += G(tr(420, 920, 1, a), path('M0 -20L1400 -160L1400 160L0 20Z', 'rgba(255,255,230,.22)', 0)); }
    return stageNight(t) + beams + influHead(420, 860, 210, { hair: 'ponytail' }, t) + glow(420, 940, 260, '#ffffff', .8) + sparkle(380, 930, .9 + .3 * Math.sin(t * 12), '#fff') + sparkle(470, 940, .7, '#fff') +
      G(tr(860, 1060, 1, -12 + Math.sin(t * 30) * 4), adoHead(0, 0, 120, { expr: 'pressedShock', face: { eyes: 'closed' } }, t) + sunGlasses(0, 0, .82)) + motionLines(720, 1000, 3, 80, 0, '#fff') +
      ftext(CX, 390, `${counter(0, 32, t, .05, .8)}`, { size: 150, fill: SX.acc2 }) + kword('PROJECTEURS LED', CX, 520, t, P - .05, { size: 76, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .6], [.05, 'slot', .5], [at(14, 'projecteurs') - at(14, '32') + .1, 'boom', .6], [at(14, 'leds') - at(14, '32') + .15, 'zap', .6], [at(14, 'bouche') - at(14, '32') + .15, 'glint', .8]] }, at(14, '32') - .15);
// B015 — produits blanchissants : rayon BLANC+++, caddie qui déborde, ticket qui défile
B(15, { enter: 'drop', cam: zin(1.0, 1.07, .4),
  draw: (t, d, T) => { const A = at(15, 'achetes'), Bl = at(15, 'blanchissants'); let cart = rect(-260, -160, 520, 220, 'none', 20, 10, '#59616c') + Array.from({ length: 6 }, (_, i) => line(-240 + i * 96, -160, -230 + i * 92, 60, 6, '#59616c')).join('') + circ(-180, 110, 34, '#333') + circ(180, 110, 34, '#333') + line(260, -160, 340, -260, 12, '#59616c');
    const n = Math.floor(clamp((t - A) / (d - A)) * 9); for (let i = 0; i < n; i++) cart += G(tr(-200 + (i % 5) * 100, -170 - Math.floor(i / 5) * 120, .45, (i * 23) % 30 - 15), tube(0, 0, 1, 0, '', ['#36c5f0', '#7b5cff', '#ff8fb1'][i % 3]));
    return shopAisle(t) + ado({ x: 320, y: 1500, s: 1.3, expr: 'pressedHappy', armR: [-10, 0] }, t) + G(tr(700, 1290), cart) + funTag(CX, 420, 'BLANCHISSANT', t, Bl - .1, { size: 60, bg: '#7be0ff', fg: SX.ink }) + funTag(800, 560, `-${counter(0, 89, t, A, d - A)} €`, t, A, { size: 46, bg: SX.acc, r: 6 }); },
  sfx: [[0, 'whoosh', .5], [at(15, 'achetes'), 'kaching', .8], [at(15, 'produits'), 'coins', .5], [at(15, 'blanchissants') - .1, 'pop', .6], [at(15, 'blanchissants') + .3, 'kaching', .5]] });
// B016a — tu frottes plus fort : salle de bain, mousse partout, effort maximal
B(16, { enter: 'whip', cam: camHand(1.05, .8),
  draw: (t, d, T) => bathroom2(t) + adoHead(CX, 880, 230, { expr: 'yEffort' }, t) + brushing(CX + 160, 965, 1.1, t, 45, 40) + foam(CX, 1000, t, 14, 300, 5) + motionLines(CX + 380, 930, 3, 80, 0) + motionLines(CX - 200, 930, 3, 80, 180) + funTag(CX, 430, 'PLUS FORT', t, at(16, 'plus') - .05, { size: 64, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'scratch', .6], [at(16, 'frottes'), 'scratch', .7], [at(16, 'plus') - .05, 'pop', .6], [at(16, 'fort'), 'spray', .5]] });
// B016b — TROP FORT : la brosse devient perceuse, étincelles, fumée, miroir qui se fissure
B(16, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.06, 1.12, t / d), shake: 10, r: -4 }),
  draw: (t, d, T) => { const o = at(16, 'trop') - .15; let sp = ''; for (let i = 0; i < 12; i++) { const k = (t * 3 + i / 12) % 1, a = R(-160 + i * 25); sp += op(1 - k, line(CX + 120 + Math.cos(a) * 60 * k * 4, 960 + Math.sin(a) * 60 * k * 4, CX + 120 + Math.cos(a) * 80 * k * 4, 960 + Math.sin(a) * 80 * k * 4, 8, '#ffd23f')); }
    return bathroom2(t) + path('M300 340L380 480L340 560L420 700', 'none', 8, '#fff') + adoHead(CX - 60, 880, 230, { expr: 'yRage' }, t) + G(tr(CX + 200 + Math.sin(t * 60) * 12, 960), tbrush(-100, 0, 1, 0, '#e2463a') + rect(180, -60, 200, 120, '#ffd23f', 20) + rect(240, 50, 70, 160, '#e2463a', 16) + circ(380, 0, 30, '#9aa3ad')) + sp +
      steam(CX - 260, 640, t, 1.2) + kword('TROP FORT', CX, 440, t, at(16, 'trop') - o - .05, { size: 104, fill: SX.acc2 }) + markerText('parfois…', CX + 120, 1170, t, at(16, 'parfois') - o, { size: 50, col: '#fff' }); },
  sfx: [[0, 'buzz', .6], [.05, 'flash_hit', .5], [.2, 'crack', .6], [at(16, 'trop') - at(16, 'trop') + .1, 'boom', .5], [at(16, 'parfois') - at(16, 'trop') + .15, 'sizzle', .5]] }, at(16, 'trop') - .15);
// B017a — briller dans le noir : chambre de nuit, ton sourire ne s'allume pas (jauge 0 %), les sourires LED rêvés brillent
B(17, { enter: 'none', trans: 'glitch', transD: .25, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Br = at(17, 'brillent'), N = at(17, 'noir');
    return nightRoom(t) + op(.9, adoHead(330, 920, 190, { expr: t > Br ? 'yJoy' : 'neutral', look: [1, 0] }, t)) + rect(-M, -M, W + 2 * M, H + 2 * M, 'rgba(10,12,40,.35)', 0, 0) +
      G(tr(780, 620), bubble(0, 0, 360, 280, influHead(0, 10, 90, {}, t) + glow(0, 50, 160, '#ffffff', .8), pop(t, at(17, 'croire'), .4))) +
      G(tr(330, 1180), rect(-170, -26, 340, 52, '#2b2040', 26, 5) + rect(-164, -20, 8 + 4 * Math.sin(t * 30), 40, '#ff4d4d', 20, 0)) + funTag(330, 1110, 'LUMIÈRE : 0%', t, N, { size: 36, bg: '#ff4d4d' }) +
      kthin('si tes dents ne brillent pas', CX, 330, t, at(17, 'si') - .05, { size: 46 }) + kword('DANS LE NOIR', CX, 440, t, N - .3, { size: 68, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(17, 'croire'), 'magic', .4], [at(17, 'brillent'), 'glint', .5], [at(17, 'noir'), 'error_beep', .6]] });
// B017b — « c'est que tu es sale » : sous la douche, tu te récures en pleurant, tampon SALE, mouches
B(17, { enter: 'crash', flash: 1, cam: camHand(1.06, .7),
  draw: (t, d, T) => { const o = at(17, 'noir') + .3, S = at(17, 'sale') - o; let flies = ''; for (let i = 0; i < 3; i++) { const a = t * (4 + i) + i * 2; flies += G(tr(CX + Math.cos(a) * 320, 760 + Math.sin(a * 1.3) * 120), circ(0, 0, 14, OL, 0) + ell(-10, -14, 10, 6, 'rgba(255,255,255,.8)', 3) + ell(10, -14, 10, 6, 'rgba(255,255,255,.8)', 3)); }
    return showerBg(t) + steamClouds(t, 4) + ado({ x: CX, y: 1520, s: 1.4, expr: 'sob', armR: [-20, 20], holdR: tbrush(0, 0, .55, 60 + Math.sin(t * 30) * 20) }, t) + foam(CX, 1250, t, 10, 260, 7) + flies + stamp(CX, 450, 'SALE ?!', t, S, '#7a5a20', -8); },
  sfx: [[0, 'spray', .6], [.1, 'buzz', .4], [at(17, 'sale') - at(17, 'noir') - .3, 'thud', .8], [at(17, 'sale') - at(17, 'noir') - .1, 'gasp', .4]] }, at(17, 'noir') + .3);
// B018 — un jour, tu racontes une blague à table : dîner de famille, Kevin est là
B(18, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => dining(t) + maman({ x: 170, y: 1500, s: 1.0, expr: 'happy' }, t) + ado({ x: 450, y: 1440, s: 1.2, expr: t > at(18, 'blague') ? 'talk' : 'pressedHappy', armR: [-40, -70] }, t) + papa({ x: 720, y: 1500, s: 1.0, expr: 'neutral' }, t) + kevin({ x: 950, y: 1440, s: 1.05, expr: 'smug', flip: 1 }, t) + diningTable(t) +
    funTag(CX, 380, 'UN JOUR', t, at(18, 'jour') - .1, { size: 50, bg: SX.cool }) + funTag(450, 560, 'BLAGUE.TXT', t, at(18, 'blague'), { size: 44, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'whoosh', .5], [at(18, 'jour') - .1, 'pop', .5], [at(18, 'blague'), 'pop_hi', .6], [at(18, 'table'), 'drum', .5]] });
// B019 — tout le monde éclate de rire : la table tremble, assiettes qui sautent, explosion HA HA HA
B(19, { enter: 'punch', flash: 1, cam: (t, d) => ({ z: 1.06, shake: t > at(19, 'eclate') ? 7 : 0 }),
  draw: (t, d, T) => { const E = at(19, 'eclate'), j = t > E ? 1 : 0; return dining(t) + maman({ x: 170, y: 1500, s: 1.0, expr: j ? 'ecstatic' : 'happy', face: j ? { eyes: 'closedHappy2' } : {} }, t) + ado({ x: 450, y: 1440, s: 1.2, expr: 'pressedHappy' }, t) + papa({ x: 720, y: 1500, s: 1.0, expr: j ? 'laugh' : 'happy' }, t) + kevin({ x: 950, y: 1440, s: 1.05, expr: j ? 'mock' : 'happy', flip: 1 }, t) + diningTable(t, j) +
    burst(CX, 470, 280, t, E - .05, SX.acc2, 16) + kword('HA HA HA', CX, 470, t, E, { size: 90, fill: '#fff', puff: false }); },
  sfx: [[at(19, 'tout'), 'drum', .4], [at(19, 'eclate') - .05, 'boom', .6], [at(19, 'eclate'), 'rimshot', .6], [at(19, 'rire'), 'thud', .4]] });
// B020 — toi aussi : crash zoom, les lèvres lâchent
B(20, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.15, eOutCubic(clamp(t / .3))) }),
  draw: (t, d, T) => blur(8, dining(t)) + adoHead(CX, 900, 260, { expr: t > at(20, 'aussi') ? 'yLaugh' : 'pressedShock' }, t) + funTag(CX, 430, 'TOI AUSSI', t, at(20, 'toi') - .05, { size: 64, bg: SX.acc }),
  sfx: [[0, 'whoosh', .5], [at(20, 'toi') - .05, 'pop', .6], [at(20, 'aussi'), 'boing', .6]] });
// B021a — un vrai rire : tête renversée, larmes de joie, dents jaunes au grand jour
B(21, { enter: 'none', trans: 'wipe', transD: .22, cam: camHand(1.05, .7),
  draw: (t, d, T) => rays(t, CX, 900, '#ffe9a6', '#ffd76b', 22) + G(tr(CX, 900, 1, -10 + Math.sin(t * 14) * 4), adoHead(0, 0, 250, { expr: 'yTears' }, t)) + funTag(CX, 430, 'UN VRAI RIRE', t, at(21, 'vrai') - .05, { size: 60, bg: '#fff', fg: SX.ink }) + popStars(CX, 900, t, at(21, 'rire'), 8, 360),
  sfx: [[.05, 'whoosh', .4], [at(21, 'vrai') - .05, 'pop', .6], [at(21, 'rire'), 'sparkle', .6], [at(21, 'rire') + .3, 'boing', .4]] });
// B021b — immense, incontrôlable : gros plan bouche géante aux dents jaunes, ça vibre, ça déborde
B(21, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), shake: 6 }),
  draw: (t, d, T) => { const o = at(21, 'immense') - .15, In = at(21, 'incontrolable') - o; const op_ = .55 + .15 * Math.abs(Math.sin(t * 16));
    return grad('#ffb36b', '#ff7a59', -M, -M, W + 2 * M, H + 2 * M) + halftoneFade('#fff', .08, 0) + yMouth(CX, 900, 1.2 + seg(t, 0, d) * .2, t, { open: op_ }) + funTag(CX, 400, 'IMMENSE', t, .1, { size: 60, bg: SX.acc2, fg: SX.ink }) + kword('INCONTRÔLABLE', CX, 1200, t, In - .05, { size: 86, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .5], [.1, 'boom', .5], [.4, 'boing', .5], [at(21, 'incontrolable') - at(21, 'immense') + .1, 'boom', .6]] }, at(21, 'immense') - .15);
// B022a — puis tu remarques… le téléphone de Kevin : le rire se fige (scratch)
B(22, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d) }),
  draw: (t, d, T) => { const Re = at(22, 'remarques'), Te = at(22, 'telephone'); return dining(t) + ado({ x: 350, y: 1440, s: 1.3, expr: t > Re ? 'yTerror' : 'yLaugh', look: [1, 0] }, t) + kevin({ x: 820, y: 1440, s: 1.15, expr: 'smug', flip: 1, armL: [200, 200], }, t) + phone(650, 1010, .7, -12, circ(0, -90, 16, Math.sin(t * 6) > 0 ? '#ff3b30' : '#ffb0a8', 0) + ftext(0, 10, 'REC', { size: 36, fill: '#ff3b30', stroke: 'none' })) + diningTable(t) +
    (t > Te ? markerCircle(640, 1020, 120, 120, t, Te, { col: SX.acc2 }) : '') + funTag(820, 560, 'KEVIN', t, at(22, 'kevin'), { size: 48, bg: '#5fb85f' }); },
  sfx: [[at(22, 'puis'), 'hmm', .3], [at(22, 'remarques'), 'scratch', .8], [at(22, 'telephone'), 'scratch', .4], [at(22, 'kevin'), 'pop', .5]] });
// B022b — pointé vers toi : POV de l'écran de Kevin, viseur REC, tu es filmé en plein fou rire
B(22, { enter: 'crash', cam: zin(1.02, 1.12, .3),
  draw: (t, d, T) => blur(4, dining(t)) + ado({ x: CX, y: 1440, s: 1.45, expr: 'yTerror' }, t) + diningTable(t) + rect(-M, -M, W + 2 * M, H + 2 * M, 'rgba(0,0,0,.12)', 0, 0) + recFrame(t) + funBox(CX, 990, 300, 300, t, at(22, 'vers') - at(22, 'pointe') + .15, { label: 'fou_rire.mp4', col: SX.acc }),
  sfx: [[0, 'whoosh', .5], [.1, 'shutter', .6], [at(22, 'vers') - at(22, 'pointe') + .15, 'tick', .6], [at(22, 'toi') - at(22, 'pointe') + .15, 'gasp', .5]] }, at(22, 'pointe') - .15);
// B023 — immédiatement tu refermes la bouche : un rideau de fer descend sur ta bouche, CLANG
B(23, { enter: 'punch', cam: (t, d) => ({ z: 1.08, shake: t > at(23, 'refermes') && t < at(23, 'refermes') + .3 ? 12 : 0 }),
  draw: (t, d, T) => { const Rf = at(23, 'refermes'), k = eOutCubic(seg(t, Rf - .1, Rf + .15)); return dining(t) + adoHead(CX, 880, 260, { expr: t > Rf + .2 ? 'pressedShock' : 'yTerror' }, t) + shutter(CX, 1030, 300, 190, k) + kword('CLAC !', CX, 440, t, Rf + .1, { size: 110, fill: SX.acc2 }); },
  sfx: [[at(23, 'immediatement'), 'whoosh', .5], [at(23, 'refermes') - .1, 'whoosh_up', .4], [at(23, 'refermes') + .1, 'thud', 1], [at(23, 'bouche'), 'crack', .5]] });
// B024a — « Pourquoi tu fais ça ? » : Kevin sincèrement perplexe
B(24, { enter: 'whip', cam: zin(1.04, 1.1),
  draw: (t, d, T) => blur(6, dining(t)) + kevinHead(CX, 900, 250, { expr: 'confused' }, t) + burst(CX, 440, 230, t, at(24, 'pourquoi') - .1, '#fff', 14) + (t > at(24, 'pourquoi') ? ftext(CX, 458, 'POURQUOI ?!', { size: 50, fill: SX.ink, stroke: 'none' }) : '') + qmark(CX + 300, 700, .9, SX.acc2, 15),
  sfx: [[0, 'whoosh', .4], [at(24, 'pourquoi') - .1, 'pop', .7], [at(24, 'ca'), 'hmm', .5]] });
// B024b — « La photo était super » : l'écran du téléphone, ton fou rire jaune magnifique, likes qui explosent
B(24, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const o = at(24, 'photo') - .15, Su = at(24, 'super') - o; return paper('#ffe9c9') + gobo(T, .1) + G(tr(CX, 860, 1.3, -4), rect(-170, -330, 340, 660, '#2b2b33', 44) + rect(-150, -295, 300, 590, '#ffe9a6', 24, 0) + adoHead(0, -40, 110, { expr: 'yTears' }, t) + ftext(-120, 250, `♥ ${counter(12, 998, t, .1, 1.2)}`, { size: 34, fill: '#ff4d6d', anchor: 'start', stroke: 'none' })) +
    heartsUp(t, CX + 250, 700, 6) + funTag(CX, 400, 'SUPER !', t, Su - .05, { size: 80, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 860, t, Su, 8, 380); },
  sfx: [[.05, 'pop', .5], [.2, 'kiss', .4], [at(24, 'super') - at(24, 'photo') + .1, 'tada', .7], [at(24, 'super') - at(24, 'photo') + .3, 'sparkle', .5]] }, at(24, 'photo') - .15);
// B025 — tu réalises quelque chose d'assez triste : prise de conscience (étoiles), puis petit nuage de pluie perso
B(25, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Re = at(25, 'realises'), Ch = at(25, 'chose'); let rain = ''; if (t > Ch) for (let i = 0; i < 14; i++) { const x = CX - 220 + (i * 37) % 440, y = 560 + ((i * 97 + t * 900) % 360); rain += line(x, y, x - 6, y + 40, 6, '#8fd0ff'); }
    return blur(6, dining(t)) + unlock(CX, 900, t, Re, { part: 'back', r: 440 }) + adoHead(CX, 900, 230, { expr: t > Ch ? 'sad' : 'wow' }, t) + unlock(CX, 900, t, Re, { part: 'front', r: 440, n: 10 }) +
      (t > Ch ? G(tr(CX, 520, pop(t, Ch, .4)), cloud(0, 0, 1.3, '#8a94a6')) + rain : '') + (t < Ch ? funTag(CX, 420, 'AH.', t, Re + .1, { size: 70, bg: '#fff', fg: SX.ink }) : ''); },
  sfx: [[at(25, 'la'), 'whoosh', .4], [at(25, 'realises'), 'magic', .6], [at(25, 'chose'), 'thunder', .4], [at(25, 'chose') + .2, 'wind', .4]] });
// B026 — tu n'as pas honte de tes dents : miroir, la dent jaune danse, DENTS OK
B(26, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.02, 1.07),
  draw: (t, d, T) => bathroom2(t) + adoHead(400, 760, 170, { expr: 'calm' }, t) + G(tr(760, 1000 + Math.abs(Math.sin(t * 8)) * -30, 1, Math.sin(t * 8) * 10), toothChar(0, 0, 1.15, t, { col: YEL, expr: 'joy' })) + funTag(CX, 400, 'DENTS : OK', t, at(26, 'honte') - .05, { size: 64, bg: '#36a85a' }) + cross(400, 1080, .5, t, at(26, 'pas')),
  sfx: [[0, 'whoosh', .4], [at(26, 'pas'), 'error_beep', .4], [at(26, 'honte'), 'pop', .6], [at(26, 'tes'), 'ding', .5]] });
// B027a — « on t'a appris » : salle de classe, leçon au tableau « CACHE TON SOURIRE », la prof pointe, influenceurs en affiche
B(27, { enter: 'whip', cam: zin(1.02, 1.07, .3),
  draw: (t, d, T) => classroomB(t) + ftext(540, 470, 'LEÇON N°1', { size: 54, fill: 'rgba(255,255,255,.8)', stroke: 'none' }) + (t > at(27, 'appris') ? ftext(540, 620, 'CACHE TON SOURIRE', { size: 62, fill: '#fff', stroke: 'none' }) : '') +
    person({ age: 'adult', x: 880, y: 1520, s: 1.15, hair: 'bun', hairColor: '#8a5a3a', glasses: true, shirt: '#e2463a', pants: '#4b5b7a', expr: 'angry', flip: 1, armL: [210, 200], seed: 4 }, t) + ado({ x: 300, y: 1500, s: 1.25, expr: 'pressed' }, t) + kevin({ x: 600, y: 1520, s: .95, expr: 'smug' }, t),
  sfx: [[0, 'school_bell', .4], [at(27, 'appris'), 'scratch', .7], [at(27, 'appris') + .3, 'tick', .4]] });
// B027b — FIN : « honte de ton sourire » → tu souris en grand, dents jaunes au soleil… et le soleil met ses lunettes
B(27, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const o = at(27, 'honte') - .15, So = at(27, 'sourire') - o; const sh = eOutBack(seg(t, So + .2, So + .6));
    return park(t) + G(tr(860, 640), sun(0, 0, .55, t, 'happy') + (sh > 0 ? G(tr(0, lerp(-300, -12, sh)), sunGlasses(0, 0, .75)) : '')) + rays(t, CX, 1000, 'rgba(255,255,255,0)', 'rgba(255,240,170,.25)', 18).replace(/<rect[^>]*\/>/, '') +
      ado({ x: CX - 120, y: 1500, s: 1.4, expr: t > So ? 'yWow' : 'pressed', armL: [200, 230], armR: [-20, -50] }, t) + (t > So ? popStars(CX - 120, 1100, t, So, 8, 300) + confetti(t, So, 30) : '') +
      kthin('honte de ton', CX, 330, t, 0, { size: 58 }) + kword('SOURIRE ?', CX, 450, t, So - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .5], [at(27, 'honte') - at(27, 'honte') + .2, 'hmm', .4], [at(27, 'sourire') - at(27, 'honte') + .1, 'boom', .6], [at(27, 'sourire') - at(27, 'honte') + .35, 'sparkle', .6], [at(27, 'sourire') - at(27, 'honte') + .7, 'rimshot', .5]] }, at(27, 'honte') - .15);

SCENES.sort((a, b) => a.s - b.s);
