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

// ---------- décors vivants (DÉCORS RICHES : accessoires factorisés + 3 couches + éléments animés) ----------
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff') + cloud(((t * 12 + 300) % 1800) - 400, 640, .6, 'rgba(255,255,255,.85)');
function tree(x, y, s, t, c = '#5fb85f') { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, c) + circ(-90, -260, 100, shade(c, -.08)) + circ(90, -270, 110, shade(c, .08)) + circ(-40, -380, 30, 'rgba(255,255,255,.18)', 0)); }
function kidsBg(t, y = 1150, n = 4, sc = .45) { let s = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; s += person({ age: 'kid', x, y, s: sc, hair: ['curly', 'bun', 'short', 'ponytail'][i % 4], hairColor: ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040'][i % 4], shirt: ['#ff8fb1', '#7aa6d8', '#ffd23f', '#7be07b'][i % 4], expr: 'happy', walk: 3, flip: i % 2, seed: 20 + i }, t); } return s; }
const lite = (o = .14, c = '#fff') => rect(-M, -M, W + 2 * M, H + 2 * M, c, 0, 0).replace('/>', ` opacity="${o}"/>`); // voile pour adoucir le fond derrière les visages
const fl = (x, y, str, size, fill = OL, o = {}) => ftext(x, y, str, Object.assign({ size, fill, stroke: 'none' }, o));

// --- murs / sols ---
function xStripes(c1, c2, y0 = -M, y1 = 1250, w = 60) { let s = rect(-M, y0, W + 2 * M, y1 - y0, c1, 0, 0); for (let x = -M; x < W + M; x += w * 2) s += rect(x, y0, w, y1 - y0, c2, 0, 0); return s; }
function xDots(c, y0 = -M, y1 = 1250, step = 120, r = 7) { let s = ''; for (let y = y0 + step / 2, j = 0; y < y1; y += step, j++) for (let x = -400 + (j % 2) * step / 2; x < W + 400; x += step) s += path(`M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`, c, 0); return s; }
function xBricks(c1, c2, y0, y1, bw = 150, bh = 62) { let s = rect(-M, y0, W + 2 * M, y1 - y0, c1, 0, 0); for (let y = y0, j = 0; y < y1; y += bh, j++) { s += line(-M, y, W + M, y, 4, c2); for (let x = -300 + (j % 2) * bw / 2; x < W + 300; x += bw) s += line(x, y, x, Math.min(y + bh, y1), 4, c2); } return s; }
function xWainscot(y0, y1, col, gro = 'rgba(0,0,0,.12)') { let s = rect(-M, y0, W + 2 * M, y1 - y0, col, 0, 0) + rect(-M, y0 - 14, W + 2 * M, 20, shade(col, .12), 0, 5); for (let x = -260; x < W + 260; x += 180) s += rect(x + 20, y0 + 30, 140, y1 - y0 - 60, 'none', 10, 4, gro); return s; }
function xBaseboard(y, col = '#fff') { return rect(-M, y - 34, W + 2 * M, 34, col, 0, 5) + line(-M, y - 24, W + M, y - 24, 3, 'rgba(0,0,0,.12)'); }
function xParquet(y, c1 = '#c49a6c', c2 = '#a97e52', h = 900) { let s = rect(-M, y, W + 2 * M, h, c1, 0, 0), rh = 46, j = 0; for (let yy = y; yy < y + h; yy += rh, rh *= 1.18, j++) { s += line(-M, yy, W + M, yy, 4, c2); for (let x = -300 + (j * 137) % 260; x < W + 300; x += 260) s += line(x, yy, x, yy + rh, 4, c2); } return s; }
function xCheck(y, c1, c2, sz = 110, h = 900) { let s = rect(-M, y, W + 2 * M, h, c1, 0, 0); for (let yy = y, j = 0; yy < y + h; yy += sz, j++) for (let x = -440 + (j % 2) * sz; x < W + 440; x += sz * 2) s += rect(x, yy, sz, sz, c2, 0, 0); return s; }
function xOutlet(x, y) { return G(tr(x, y), rect(-26, -36, 52, 72, '#fbfbf6', 8, 4) + circ(0, -12, 4, OL, 0) + circ(0, 12, 4, OL, 0)); }
function xSwitch(x, y) { return G(tr(x, y), rect(-28, -40, 56, 80, '#fbfbf6', 8, 4) + rect(-10, -22, 20, 26, '#dfe3e8', 4, 3)); }
// --- cadres, posters, étagères ---
function xPic(x, y, w, h, kind = 'mount', col = '#c38a52', bg = '#f7f0dc', r = 0) { let inn = '';
  if (kind === 'mount') inn = path(`M${-w / 2 + 16} ${h / 2 - 14}L${-w * .1} ${-h * .15}L${w * .08} ${h * .1}L${w * .22} ${-h * .05}L${w / 2 - 16} ${h / 2 - 14}Z`, '#7bbf8a', 0) + circ(w * .22, -h * .22, Math.min(w, h) * .1, '#ffd23f', 0);
  else if (kind === 'heart') inn = heart(0, 0, Math.min(w, h) / 180);
  else if (kind === 'face') inn = circ(0, h * .05, Math.min(w, h) * .26, '#f1c9a5', 3) + circ(-w * .08, 0, 3, OL, 0) + circ(w * .08, 0, 3, OL, 0) + path(`M${-w * .08} ${h * .12}Q0 ${h * .2} ${w * .08} ${h * .12}`, 'none', 3);
  else if (kind === 'sea') inn = rect(-w / 2 + 14, 0, w - 28, h / 2 - 14, '#5ec4f0', 0, 0) + circ(0, -h * .1, Math.min(w, h) * .14, '#ff9a5a', 0);
  else if (kind === 'abs') inn = circ(-w * .15, -h * .1, Math.min(w, h) * .2, '#ff8fb1', 0) + rect(0, -h * .05, w * .3, h * .3, '#7b5cff', 0, 0);
  return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, col, 6, 5) + rect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, bg, 0, 3) + inn); }
function xPoster(x, y, w, h, bg, label, r = 0, fg = '#fff') { return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, bg, 6, 5) + circ(0, -h * .1, w * .22, 'rgba(255,255,255,.35)', 0) + sparkle(w * .25, -h * .3, .25, '#fff') + fl(0, h * .36, label, Math.min(44, w / (label.length * .62)), fg) + rect(-w / 2 - 8, -h / 2 - 10, 36, 18, 'rgba(255,255,255,.7)', 2, 0) + rect(w / 2 - 28, -h / 2 - 10, 36, 18, 'rgba(255,255,255,.7)', 2, 0)); }
function xBooks(x, y, w, seed = 1) { const q = rng(seed); let s = '', cx = x; const cols = ['#e2463a', '#4d7cf0', '#ffd23f', '#5fb85f', '#7b5cff', '#ff8fb1', '#36c5b4', '#ff8a3d'];
  while (cx < x + w - 20) { const bw = 18 + q() * 16, bh = 60 + q() * 50; if (q() < .12) { s += G(tr(cx + 20, y, 1, 18), rect(-bw / 2, -bh, bw, bh, cols[Math.floor(q() * 8)], 3, 4)); cx += bw + 22; continue; } s += rect(cx, y - bh, bw, bh, cols[Math.floor(q() * 8)], 3, 4) + line(cx + 4, y - bh * .7, cx + bw - 4, y - bh * .7, 3, 'rgba(255,255,255,.6)'); cx += bw + 2; } return s; }
function xShelf(x, y, w, inner = '', col = '#b07a4a') { return inner + rect(x, y, w, 22, col, 5, 5) + path(`M${x + 30} ${y + 22}l0 34l40 -34Z`, shade(col, -.15), 4) + path(`M${x + w - 30} ${y + 22}l0 34l-40 -34Z`, shade(col, -.15), 4); }
function xJar(x, y, col = '#ffd23f', h = 70) { return rect(x - 26, y - h, 52, h, 'rgba(220,240,255,.75)', 12, 4) + rect(x - 22, y - h * .6, 44, h * .6 - 4, col, 8, 0) + rect(x - 28, y - h - 14, 56, 18, '#8a5a3a', 5, 4); }
function xTrophy(x, y, s = 1) { return G(tr(x, y, s), path('M-34 -110L34 -110Q34 -50 0 -40Q-34 -50 -34 -110Z', '#ffd23f', 4) + path('M-34 -96Q-60 -96 -50 -70Q-44 -60 -28 -62M34 -96Q60 -96 50 -70Q44 -60 28 -62', 'none', 5) + rect(-8, -42, 16, 22, '#e0b030', 0, 4) + rect(-30, -22, 60, 22, '#8a5a3a', 4, 4) + sparkle(18, -96, .2, '#fff')); }
function xMiniPlant(x, y, t, s = 1) { return G(tr(x, y, s, wave(t, .6, 4, x)), path('M0 -30C-30 -60 -40 -90 -14 -110C-6 -80 0 -56 0 -30Z', '#6dbb7a', 4) + path('M0 -30C30 -64 46 -80 30 -116C8 -90 2 -60 0 -30Z', '#5aa76a', 4)) + rect(x - 24 * s, y - 30 * s, 48 * s, 34 * s, '#d9825b', 6, 4); }
function xCactus(x, y, s = 1) { return G(tr(x, y, s), path('M-12 -24L-12 -90Q0 -104 12 -90L12 -24Z', '#7bbf5a', 4) + path('M-12 -60Q-34 -60 -34 -80', 'none', 8, '#7bbf5a') + rect(-24, -26, 48, 30, '#e2463a', 6, 4)); }
function xBottle(x, y, col = '#36c5f0', h = 90, cap = '#fff') { return rect(x - 18, y - h, 36, h, col, 12, 4) + rect(x - 10, y - h - 22, 20, 24, cap, 4, 4) + rect(x - 12, y - h * .6, 24, h * .3, 'rgba(255,255,255,.7)', 4, 0); }
// --- lumières ---
function xLamp(x, y, s = 1, on = 1, col = '#ffb3c8') { return (on ? glow(x, y - 330 * s, 200 * s, '#fff3c0', .4) : '') + G(tr(x, y, s), line(0, 0, 0, -300, 8) + ell(0, 0, 60, 14, '#555', 4) + path('M-70 -290L70 -290L45 -380L-45 -380Z', col, 5)); }
function xSconce(x, y, on = 1) { return (on ? glow(x, y - 20, 110, '#fff3c0', .45) : '') + G(tr(x, y), rect(-10, -10, 20, 40, '#c9a050', 4, 4) + path('M-40 -10L40 -10L26 -70L-26 -70Z', '#fff6d6', 5)); }
function xPendant(x, y, len, t, col = '#7b5cff', ph = 0) { const a = Math.sin(t * 1.4 + ph) * 5; return G(tr(x, y, 1, a), line(0, 0, 0, len, 5) + path(`M-90 ${len + 60}L90 ${len + 60}L50 ${len}L-50 ${len}Z`, col, 5) + ell(0, len + 62, 30, 10, '#fff6c8', 3) + glow(0, len + 100, 180, '#fff3c0', .35)); }
function xBulbs(x0, x1, y, t, cols = ['#ffd23f', '#ff8fb1', '#7be0ff', '#7be07b']) { let s = path(`M${x0} ${y}Q${(x0 + x1) / 2} ${y + 60} ${x1} ${y}`, 'none', 4); const n = Math.round((x1 - x0) / 70); for (let i = 1; i < n; i++) { const k = i / n, px = lerp(x0, x1, k), py = y + 2 * k * (1 - k) * 60; const on = Math.sin(t * 5 + i * 1.9) > -.2; s += (on ? circ(px, py + 16, 22, cols[i % cols.length].replace('#', '#') + '', 0).replace('<circle', '<circle opacity=".35"') : '') + ell(px, py + 14, 9, 13, on ? cols[i % cols.length] : '#6b6b7a', 3); } return s; }
// --- fenêtre avec vue (couche lointaine, brumeuse) ---
function xView(x, y, w, h, t, view = 'day') { const night = view === 'night'; let v = grad(night ? '#0b1030' : '#9fd6ff', night ? '#26306a' : '#e6f6ff', x, y, w, h);
  if (view === 'frost') return grad('#e8f4ff', '#cfe3f2', x, y, w, h) + Array.from({ length: 5 }, (_, i) => circ(x + (i * 53 % w), y + (i * 71 % h), 18 + i * 4, 'rgba(255,255,255,.6)', 0)).join('');
  if (night) { v += circ(x + w * .72, y + h * .25, Math.min(w, h) * .12, '#fff6d6', 0); for (let i = 0; i < 7; i++) v += circ(x + (i * 61 % w), y + (i * 43 % (h * .5)), 3, Math.sin(t * 4 + i) > 0 ? '#fff' : '#556', 0); }
  else v += cloud(x + ((t * 30) % (w + 200)) - 100, y + h * .25, .4, '#fff');
  const q = rng(Math.round(x + y)); let cx = x - 20; while (cx < x + w) { const bw = 50 + q() * 60, bh = h * (.25 + q() * .35); v += rect(cx, y + h - bh, bw, bh, night ? '#1b2250' : '#b9c9d8', 0, 0); for (let j = 0; j < 4; j++) v += rect(cx + 10 + (j % 2) * (bw / 2 - 4), y + h - bh + 14 + Math.floor(j / 2) * 34, 12, 16, night ? (q() < .6 ? '#ffe9a6' : '#2e3570') : '#e6f2ff', 0, 0); cx += bw + 6; }
  if (view === 'trees') v += circ(x + w * .2, y + h, w * .25, '#7bbf6a', 0) + circ(x + w * .7, y + h + 10, w * .3, '#6aae5a', 0);
  return `<clipPath id="vw${Math.round(x)}${Math.round(y)}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#vw${Math.round(x)}${Math.round(y)})">${haze(.18, night ? '#2a3170' : '#e6f4ff', v)}</g>`; }
function xWin(x, y, w, h, t, view = 'day', fr = '#fff') { return rect(x - 16, y - 16, w + 32, h + 32, fr, 8) + xView(x, y, w, h, t, view) + rect(x, y, w, h, 'none', 4, 6) + line(x + w / 2, y, x + w / 2, y + h, 8, fr) + line(x, y + h / 2, x + w, y + h / 2, 8, fr) + line(x + 18, y + 18, x + 40, y + 50, 5, 'rgba(255,255,255,.8)') + rect(x - 34, y + h + 10, w + 68, 24, fr, 6, 5); }
function xCurtain(x, y, w, h, col, t, side = 1) { const sw = Math.sin(t * 1.3 + x) * 14; let s = path(`M${x} ${y}L${x + w} ${y}Q${x + w + sw * side} ${y + h * .5} ${x + w * .7 + sw} ${y + h}L${x - 10 + sw * .3} ${y + h}Q${x - 6} ${y + h * .5} ${x} ${y}Z`, col, 5);
  for (let i = 1; i < 4; i++) s += path(`M${x + w * i / 4} ${y + 10}Q${x + w * i / 4 + sw * .6} ${y + h * .5} ${x + w * i / 4 * .8 + sw} ${y + h - 10}`, 'none', 4, shade(col, -.18)); return s; }
function xRod(x0, x1, y) { return line(x0, y, x1, y, 10, '#8a5a3a') + circ(x0, y, 14, '#c9a050', 4) + circ(x1, y, 14, '#c9a050', 4); }
function xBlinds(x, y, w, h, t) { let s = ''; const k = .55 + .05 * Math.sin(t * .8); for (let yy = y; yy < y + h * k; yy += 26) s += rect(x - 6, yy, w + 12, 18, '#f4f4ee', 3, 3); return s + line(x + w - 30, y, x + w - 30, y + h * k + 60, 3); }
// --- plantes, objets au sol ---
function xPot(x, y, s, t, kind = 'fern', pot = '#d9825b') { let lv = ''; const n = kind === 'tall' ? 6 : 8;
  for (let i = 0; i < n; i++) { const a = -70 + i * 140 / (n - 1) + Math.sin(t * 1.5 + i) * 4, L = kind === 'tall' ? 200 + (i % 3) * 50 : 120 + (i % 3) * 30; lv += G(`rotate(${f1(a)})`, kind === 'monstera' ? ell(0, -L * .6, 34, L * .45, i % 2 ? '#5aa76a' : '#6dbb7a', 4) : path(`M0 0Q-26 ${-L * .5} 0 ${-L}Q26 ${-L * .5} 0 0Z`, i % 2 ? '#5aa76a' : '#6dbb7a', 4)); }
  return G(tr(x, y, s), G('translate(0 -80)', lv) + path('M-60 -90L60 -90L44 0L-44 0Z', pot, 5) + rect(-68, -100, 136, 20, shade(pot, -.1), 5, 5)); }
function xRug(x, y, rx, ry, c1, c2) { let s = ''; for (let i = -6; i <= 6; i++) s += line(x + i * rx / 7, y + ry * Math.sqrt(1 - (i / 7) ** 2), x + i * rx / 7, y + ry * Math.sqrt(1 - (i / 7) ** 2) + 18, 4, c2); return s + ell(x, y, rx, ry, c1, 5) + ell(x, y, rx * .75, ry * .7, 'none', 8, c2) + ell(x, y, rx * .45, ry * .4, c2, 0); }
function xShoes(x, y, col = '#e2463a') { return path(`M${x - 60} ${y}L${x - 60} ${y - 30}Q${x - 40} ${y - 44} ${x - 20} ${y - 30}Q${x + 10} ${y - 20} ${x + 10} ${y}Z`, col, 4) + path(`M${x + 20} ${y + 10}L${x + 20} ${y - 20}Q${x + 40} ${y - 34} ${x + 60} ${y - 20}Q${x + 90} ${y - 10} ${x + 90} ${y + 10}Z`, col, 4) + line(x - 60, y - 4, x + 10, y - 4, 6, '#fff') + line(x + 20, y + 6, x + 90, y + 6, 6, '#fff'); }
function xBag(x, y, col = '#4d7cf0') { return path(`M${x - 70} ${y}L${x - 60} ${y - 140}Q${x} ${y - 170} ${x + 60} ${y - 140}L${x + 70} ${y}Z`, col, 5) + rect(x - 40, y - 80, 80, 50, shade(col, -.15), 10, 4) + path(`M${x - 30} ${y - 150}Q${x} ${y - 200} ${x + 30} ${y - 150}`, 'none', 7); }
function xBox(x, y, s = 1, r = 0) { return G(tr(x, y, s, r), rect(-90, -110, 180, 110, '#d6a96a', 4, 5) + rect(-90, -110, 180, 20, '#c4955a', 0, 4) + rect(-14, -110, 28, 60, '#e8d3a8', 0, 3) + fl(0, -30, 'FRAGILE', 22, '#a0522d')); }
function xBin(x, y, col = '#7aa6d8') { return path(`M${x - 50} ${y - 130}L${x + 50} ${y - 130}L${x + 40} ${y}L${x - 40} ${y}Z`, col, 5) + rect(x - 58, y - 146, 116, 20, shade(col, -.15), 6, 5) + G(tr(x + 10, y - 150, 1, -20), circ(0, 0, 18, '#fff', 4)); }
function xBall(x, y, r = 36, col = '#ff8a3d') { return circ(x, y - r, r, col, 5) + path(`M${x - r} ${y - r}Q${x} ${y - r * 1.4} ${x + r} ${y - r}M${x} ${y - 2 * r}Q${x - r * .4} ${y - r} ${x} ${y}`, 'none', 4); }
function xPlush(x, y, s = 1, col = '#c9965a') { return G(tr(x, y, s), circ(-34, -110, 20, col, 4) + circ(34, -110, 20, col, 4) + ell(0, -40, 48, 44, col, 5) + circ(0, -90, 40, col, 5) + ell(0, -80, 16, 12, '#f2d6b0', 3) + circ(-14, -96, 4, OL, 0) + circ(14, -96, 4, OL, 0) + circ(0, -84, 4, OL, 0)); }
function xGuitar(x, y, s = 1, r = -12) { return G(tr(x, y, s, r), rect(-12, -330, 24, 230, '#8a5a3a', 4, 4) + rect(-18, -370, 36, 50, '#2b2420', 6, 0) + path('M0 -110C-80 -110 -90 -40 -50 -20C-100 10 -80 80 0 80C80 80 100 10 50 -20C90 -40 80 -110 0 -110Z', '#e2463a', 5) + circ(0, -40, 18, OL, 0)); }
function xMug(x, y, col, t, hot = 1) { return (hot ? steam(x, y - 70, t, .5) : '') + rect(x - 28, y - 60, 56, 60, col, 10, 4) + path(`M${x + 28} ${y - 46}Q${x + 52} ${y - 30} ${x + 28} ${y - 12}`, 'none', 6); }
function xCalendarW(x, y, n = '16') { return G(tr(x, y), rect(-60, -70, 120, 140, '#fff', 8, 4) + rect(-60, -70, 120, 34, '#e2463a', 8, 4) + fl(0, 40, n, 54, OL) + circ(-30, -70, 6, OL, 0) + circ(30, -70, 6, OL, 0)); }
function xBed(x, y, w, col, t) { const br = 1 + .01 * Math.sin(t * 2); return rect(x - 20, y - 300, 40, 300, '#8a5a3a', 8, 5) + rect(x, y - 150, w, 110, '#f4f4ee', 10, 5) + rect(x + 40, y - 200, 180, 70, '#fff', 30, 5) + G(tr(x + w / 2, y - 150, 1, 0), G(`scale(1 ${br.toFixed(3)})`, path(`M${-w / 2 + 150} 0Q${-w / 2 + 160} -60 ${-w / 2 + 240} -60L${w / 2} -60L${w / 2} 60L${-w / 2 + 150} 60Z`, col, 5))) + rect(x, y - 40, w, 40, '#a97e52', 0, 5) + xPlush(x + 120, y - 170, .6, '#ff8fb1'); }
function xDesk(x, y, w, t, screen = '#7be0ff') { return rect(x, y - 300, w, 30, '#c58e55', 6, 5) + rect(x + 20, y - 270, 26, 270, '#a97e52', 4, 5) + rect(x + w - 46, y - 270, 26, 270, '#a97e52', 4, 5) + rect(x + w * .55, y - 270, w * .45 - 46, 150, '#b88452', 6, 5) + circ(x + w * .77, y - 195, 8, OL, 0) +
  G(tr(x + w * .45, y - 300), rect(-110, -150, 220, 140, '#2b2b33', 10, 5) + rect(-96, -136, 192, 112, screen, 4, 0) + rect(-40 + (t * 30 % 60), -110, 60, 10, '#fff', 3, 0) + path('M-130 0L130 0L110 -12L-110 -12Z', '#9aa3ad', 4)) +
  G(tr(x + 50, y - 300), line(0, 0, 30, -110, 7) + line(30, -110, 80, -150, 7) + path('M60 -170L120 -130L90 -110Z', '#ffd23f', 4)) + xMug(x + w - 60, y - 300, '#ff8fb1', t) + rect(x + w - 140, y - 360, 30, 60, '#7b5cff', 6, 4) + line(x + w - 130, y - 380, x + w - 134, y - 330, 5, '#e2463a') + line(x + w - 118, y - 384, x + w - 120, y - 330, 5, '#36c5f0'); }
// --- extérieurs ---
function xBird(x, y, s, t, ph = 0) { const f = Math.sin(t * 12 + ph) * 18; return path(`M${x - 22 * s} ${y - f * s * .5}Q${x - 10 * s} ${y - 6 * s} ${x} ${y}Q${x + 10 * s} ${y - 6 * s} ${x + 22 * s} ${y - f * s * .5}`, 'none', 5); }
function xBirds(t, y = 520, n = 4, sp = 70) { let s = ''; for (let i = 0; i < n; i++) s += xBird(((t * sp + i * 90) % 1500) - 200 + i * 30, y + (i % 2) * 40 + Math.sin(t * 2 + i) * 14, 1 - i * .12, t, i); return s; }
function xLampPost(x, y, s = 1, on = 0) { return G(tr(x, y, s), rect(-10, -520, 20, 520, '#3a3f4a', 4, 4) + rect(-24, -20, 48, 24, '#3a3f4a', 6, 4) + path('M0 -520Q0 -580 60 -580', 'none', 12, '#3a3f4a') + path('M30 -590L100 -590L90 -550L40 -550Z', '#3a3f4a', 4) + ell(65, -548, 22, 8, on ? '#fff3a0' : '#e6e0c8', 3)); }
function xCar(x, y, s = 1, col = '#e2463a', flip = 0) { return G(tr(x, y, s) + (flip ? ' scale(-1 1)' : ''), path('M-170 -40L-150 -90L-80 -150L80 -150L130 -90L180 -80Q200 -76 200 -50L200 -20L-180 -20Z', col, 5) + path('M-66 -136L-120 -90L-10 -90L-10 -136Z', '#cfe8ff', 4) + path('M6 -136L6 -90L110 -90L70 -136Z', '#cfe8ff', 4) + circ(-100, -16, 40, '#2b2b33', 5) + circ(-100, -16, 16, '#9aa3ad', 0) + circ(120, -16, 40, '#2b2b33', 5) + circ(120, -16, 16, '#9aa3ad', 0) + rect(176, -76, 22, 16, '#fff3a0', 4, 3)); }
function xBike(x, y, s = 1, col = '#36c5b4') { return G(tr(x, y, s), circ(-70, -50, 50, 'none', 6) + circ(70, -50, 50, 'none', 6) + path('M-70 -50L-20 -50L30 -110L-40 -110Z M30 -110L70 -50 M-40 -110L-46 -130', 'none', 8, col) + rect(-64, -138, 40, 12, OL, 4, 0) + line(30, -110, 40, -140, 7, col) + line(26, -144, 58, -140, 7)); }
function xBench(x, y, s = 1) { return G(tr(x, y, s), rect(-160, -150, 320, 26, '#c58e55', 6, 4) + rect(-160, -110, 320, 26, '#c58e55', 6, 4) + rect(-170, -70, 340, 24, '#b07a4a', 6, 4) + rect(-150, -50, 18, 50, '#3a3f4a', 3, 4) + rect(132, -50, 18, 50, '#3a3f4a', 3, 4)); }
function xBush(x, y, s = 1, col = '#5fb85f') { return G(tr(x, y, s), circ(-60, -40, 50, col, 5) + circ(0, -60, 64, shade(col, .08), 5) + circ(64, -40, 50, col, 5) + rect(-110, -40, 220, 40, col, 0, 0) + circ(-20, -80, 10, 'rgba(255,255,255,.25)', 0)); }
function xFlowers(x, y, w, seed = 1, t = 0) { const q = rng(seed); let s = ''; for (let i = 0; i < 9; i++) { const fx = x + q() * w, fy = y - 20 - q() * 40, c = ['#ff8fb1', '#ffd23f', '#fff', '#b49cff'][i % 4]; s += line(fx, y, fx + Math.sin(t * 2 + i) * 4, fy, 4, '#3f8a3f') + circ(fx + Math.sin(t * 2 + i) * 4, fy, 12, c, 4) + circ(fx + Math.sin(t * 2 + i) * 4, fy, 4, '#ff8a3d', 0); } return s; }
function xCityRow(y, seed, t, far = 0) { const q = rng(seed); let s = '', x = -320; const cols = far ? ['#c3d3e6', '#b4c6dc', '#cbd9e8'] : ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4', '#f2dfb6'];
  while (x < W + 300) { const w = 160 + q() * 140, h = (far ? 300 : 360) + q() * 340, c = cols[Math.floor(q() * cols.length)]; s += rect(x, y - h, w, h, c, 4, far ? 0 : 5);
    if (!far) { s += rect(x - 8, y - h - 16, w + 16, 20, shade(c, -.15), 4, 4); for (let r = 0; r < Math.floor((h - 160) / 90); r++) for (let k = 0; k < Math.floor(w / 70); k++) { const wx = x + 18 + k * (w - 20) / Math.floor(w / 70), wy = y - h + 40 + r * 90; s += rect(wx, wy, 34, 46, q() < .25 ? '#ffe9a6' : '#cfe8ff', 3, 3); if (r % 2 && k === 0 && q() < .6) s += rect(wx - 8, wy + 46, 60, 10, '#3a3f4a', 2, 3) + line(wx - 6, wy + 30, wx - 6, wy + 50, 3) + line(wx + 50, wy + 30, wx + 50, wy + 50, 3); }
      if (q() < .5) s += path(`M${x + 10} ${y - 130}L${x + w - 10} ${y - 130}L${x + w + 4} ${y - 90}L${x - 4} ${y - 90}Z`, ['#e2463a', '#36c5b4', '#7b5cff'][Math.floor(q() * 3)], 4) + rect(x + 20, y - 90, w - 40, 90, '#f4ecd8', 0, 4);
      if (q() < .4) s += rect(x + w / 2 - 20, y - h - 70, 40, 54, '#8a5a3a', 4, 4) + line(x + w / 2 + 30, y - h - 16, x + w / 2 + 30, y - h - 90, 4); }
    else for (let r = 0; r < 5; r++) s += rect(x + 20, y - h + 30 + r * 60, w - 40, 14, 'rgba(255,255,255,.35)', 0, 0);
    x += w + (far ? 10 : 20); }
  return far ? haze(.35, '#e6f2ff', s) : s; }
function xFence(y, col = '#fff') { let s = rect(-M, y - 80, W + 2 * M, 14, col, 0, 4) + rect(-M, y - 40, W + 2 * M, 14, col, 0, 4); for (let x = -300; x < W + 300; x += 60) s += path(`M${x} ${y}L${x} ${y - 100}L${x + 14} ${y - 116}L${x + 28} ${y - 100}L${x + 28} ${y}Z`, col, 4); return s; }
function xFlag(x, y, t, col = '#e2463a') { let d = `M${x} ${y}`; for (let i = 1; i <= 6; i++) d += `L${x + i * 25} ${y + Math.sin(t * 6 - i * .8) * 8 * i / 6}`; d += `L${x + 150} ${y + 80 + Math.sin(t * 6 - 4.8) * 8}`; for (let i = 5; i >= 0; i--) d += `L${x + i * 25} ${y + 80 + Math.sin(t * 6 - i * .8) * 8 * i / 6}`; return line(x, y - 20, x, y + 420, 8, '#9aa3ad') + path(d + 'Z', col, 5); }
// --- premier plan flou (3e couche) ---
function fgBlur(kind, x, y, s = 1, t = 0) { let g = '';
  if (kind === 'plant') g = xPot(x, y, s, t, 'monstera');
  else if (kind === 'chair') g = G(tr(x, y, s), rect(-140, -420, 280, 60, '#b07a4a', 20, 6) + rect(-140, -200, 280, 50, '#c58e55', 14, 6) + rect(-120, -360, 30, 360, '#a97e52', 8, 6) + rect(90, -360, 30, 360, '#a97e52', 8, 6));
  else if (kind === 'glass') g = G(tr(x, y, s), path('M-70 -260L70 -260L50 -60L-50 -60Z', 'rgba(200,230,255,.6)', 6) + rect(-50, -150, 100, 90, 'rgba(255,214,120,.7)', 0, 0) + rect(-10, -60, 20, 60, 'rgba(200,230,255,.6)', 0, 5) + ell(0, 0, 70, 14, 'rgba(200,230,255,.6)', 5));
  else if (kind === 'towel') g = towel(x, y, 260 * s, 420 * s, '#ff8fb1', '#ffc2d6', 8);
  else if (kind === 'bush') g = xBush(x, y, s * 1.6, '#4f9a4f');
  else if (kind === 'shelf') g = G(tr(x, y, s), rect(-60, -900, 120, 900, '#9aa3ad', 0, 6) + Array.from({ length: 4 }, (_, i) => rect(-60, -200 - i * 200, 260, 20, '#c9d1db', 4, 5) + rect(-40 + (i % 2) * 70, -280 - i * 200, 60, 80, ['#36c5f0', '#ff8fb1', '#7b5cff', '#7be0ff'][i], 10, 5)).join(''));
  else if (kind === 'bottle') g = G(tr(x, y, s), rect(-60, -340, 120, 340, 'rgba(60,140,80,.85)', 30, 6) + rect(-24, -440, 48, 110, 'rgba(60,140,80,.85)', 10, 6) + rect(-60, -240, 120, 100, '#fff3dc', 0, 5));
  return blur(9, g); }

// ---------- DÉCORS ----------
function bathroom2(t) { let s = tiles('#d6eef3', '#b9dbe3', 100, -M, -M, W + 2 * M, 960 + M) + tiles('#a9d8e2', '#8fc3cf', 70, -M, 960, W + 2 * M, 300) + rect(-M, 946, W + 2 * M, 28, '#fff', 0, 5) + Array.from({ length: 22 }, (_, i) => circ(-120 + i * 70, 960, 6, '#36c5b4', 0)).join('');
  s += xWin(40, 330, 130, 220, t, 'frost') + xMiniPlant(105, 572, t, .8);
  s += lite(.1);
  s += mirror(250, 330, 580, 560) + Array.from({ length: 6 }, (_, i) => { const on = Math.sin(t * 7 + i * 2.3) > -.85; return circ(290 + i * 100, 300, 18, on ? '#fff6c8' : '#cfc9a8', 4) + (on ? glow(290 + i * 100, 300, 50, '#fff6c8', .5) : ''); }).join('');
  s += xSconce(195, 620) + xSconce(885, 620);
  s += xShelf(290, 930, 500, rect(330, 860, 60, 70, '#ff8fb1', 10, 4) + G(tr(345, 860, 1, -15), rect(-6, -70, 12, 70, '#36c5f0', 4, 3)) + G(tr(370, 860, 1, 12), rect(-6, -70, 12, 70, '#ffd23f', 4, 3)) + xBottle(450, 930, '#7b5cff', 80) + xBottle(520, 930, '#fff', 60, '#36c5b4') + rect(560, 880, 70, 50, '#36c5f0', 10, 4) + G(tr(700, 930), ell(0, -26, 40, 26, '#ffd23f', 4) + circ(26, -56, 22, '#ffd23f', 4) + path('M44 -56l22 6l-22 6Z', '#ff8a3d', 3) + circ(32, -62, 3, OL, 0)));
  s += line(950, 610, 1070, 610, 8, '#c9ced6') + towel(1010, 700, 120, 300, '#ff8fb1', '#ffc2d6', wave(t, .5, 3));
  s += G(tr(70, 760), circ(0, -40, 10, '#c9ced6', 4) + path('M-50 -30Q0 -50 50 -30L60 230L-60 230Z', '#7be0ff', 5) + line(0, -30, 0, 230, 4, 'rgba(0,0,0,.15)'));
  s += G(tr(1010, 1110), rect(-40, -16, 80, 16, '#c9ced6', 4, 4) + circ(0, 24, 38, '#fff', 5) + circ(0, 24, 12, '#eee', 3) + rect(-38, 24, 22, 80, '#fff', 0, 4).replace('<rect', '<rect opacity=".9"'));
  s += xOutlet(940, 880);
  s += sink(CX, 1300) + (((t * 1.6) % 1) < .7 ? ell(CX - 108, 1250 + ((t * 1.6) % 1) * 60, 7, 10, '#7be0ff', 3) : '');
  s += xCheck(1250, '#f4f7f9', '#dbe5ec', 100) + xBaseboard(1254, '#e8eef0');
  s += rect(330, 1560, 420, 120, '#7be0ff', 40, 5) + Array.from({ length: 5 }, (_, i) => line(380 + i * 80, 1570, 380 + i * 80, 1670, 6, '#fff')).join('');
  s += G(tr(900, 1440), rect(-90, -26, 180, 52, '#fff', 14, 5) + rect(-30, -14, 60, 24, '#2b2b33', 4, 0)) + G(tr(110, 1440), path('M-80 -150L80 -150L66 0L-66 0Z', '#e8d3a8', 5) + Array.from({ length: 4 }, (_, i) => line(-74 + i * 4, -110 + i * 30, 74 - i * 4, -110 + i * 30, 4, '#c4a070')).join('') + path('M-40 -150Q-20 -200 20 -160Q40 -190 60 -150', '#ffd23f', 4));
  for (let i = 0; i < 3; i++) { const k = (t * .3 + i / 3) % 1; s += op(.35 * (1 - k), cloud(200 + i * 330 + Math.sin(t + i) * 30, 260 - k * 200, .5 + k * .4, '#fff')); }
  return s; }
function schoolyard(t) { let s = SKY(t) + xBirds(t, 560, 3, 60) + xCityRow(1000, 7, t, 1);
  s += building(-120, 1180, 640, 560, '#f0d9b5') + rect(-140, 600, 680, 34, '#c4955a', 4, 5) + rect(170, 1000, 160, 180, '#b07a4a', 10, 5) + line(250, 1000, 250, 1180, 5) + G(tr(250, 950), rect(-120, -36, 240, 72, '#fff', 12, 5) + fl(0, 14, 'ÉCOLE', 40, '#e2463a')) + G(tr(250, 680), circ(0, 0, 44, '#fff', 5)) + wallClock(250, 680, 40, t, 3);
  s += building(560, 1180, 700, 470, '#e8c9a0') + rect(560, 1080, 700, 100, '#d6b88a', 0, 5) + fl(780, 1145, 'GYMNASE', 40, '#fff', { stroke: OL, sw: 5 });
  s += xFlag(520, 360, t, SX.acc);
  s += xFence(1185, '#fff') + tree(980, 1200, .9, t) + tree(40, 1210, .7, t, '#4fa64f') + xBush(700, 1190, .7);
  s += rect(-M, 1180, W + 2 * M, 1500, '#c9b8a0', 0, 0) + rect(-M, 1180, W + 2 * M, 16, '#b3a088', 0, 0);
  for (let i = 0; i < 6; i++) s += rect(420 + (i % 3) * 80 + (i > 2 ? 40 : 0), 1600 - Math.floor(i / 3) * 90, 80, 90, 'none', 0, 6, '#fff') + fl(460 + (i % 3) * 80 + (i > 2 ? 40 : 0), 1660 - Math.floor(i / 3) * 90, String(i + 1), 40, '#fff');
  s += kidsBg(t, 1230, 3);
  s += xBike(140, 1330, .7, '#e2463a') + xBike(60, 1350, .7, SX.cool) + xBench(880, 1330, .8) + xBag(930, 1260, '#ffd23f') + xBall(760, 1680, 34, '#ff8a3d') + xBin(1040, 1320, '#5fb85f') + xLampPost(-20, 1260, .9);
  return s; }
function park(t) { let s = SKY(t, '#9fe0ff', '#fff4dc') + xBirds(t, 600, 4, 80) + xCityRow(1060, 11, t, 1);
  s += path(`M${-M} 1110Q200 1010 520 1080T${W + M} 1060L${W + M} 1300L${-M} 1300Z`, '#a6dc80', 0) + haze(.25, '#e6f4ff', tree(380, 1080, .45, t, '#7bbf6a') + tree(640, 1070, .4, t, '#6aae5a') + tree(820, 1085, .5, t));
  s += rect(-M, 1100, W + 2 * M, 1000, '#8fd16a', 0, 0) + path(`M${CX - 60} 1100Q${CX - 160} 1400 ${CX - 380} ${H + 100}L${CX + 380} ${H + 100}Q${CX + 140} 1400 ${CX + 60} 1100Z`, '#f2deb0', 0);
  s += G(tr(170 + Math.sin(t * .8) * 30, 720 + Math.sin(t * 1.3) * 20, 1, Math.sin(t * 1.6) * 8), path('M0 -60L44 0L0 70L-44 0Z', '#ff8fb1', 5) + line(0, -60, 0, 70, 3) + line(-44, 0, 44, 0, 3) + path('M0 70q-20 30 0 60q20 30 0 60', 'none', 4)) + path(`M${170 + Math.sin(t * .8) * 30} ${790 + Math.sin(t * 1.3) * 20}Q120 1000 60 1120`, 'none', 2, '#fff');
  s += xLampPost(40, 1130, .8) + xLampPost(1040, 1120, .8) + xBench(760, 1150, .6);
  s += tree(120, 1160, 1, t) + tree(980, 1140, 1.1, t, '#4fa64f');
  s += ell(830, 1200, 170, 40, '#7fd0f0', 5) + G(tr(800 + Math.sin(t * .7) * 60, 1196 + Math.sin(t * 3) * 3), ell(0, 0, 24, 14, '#fff', 4) + circ(18, -16, 12, '#fff', 4) + path('M28 -16l14 4l-14 4Z', '#ffb340', 3));
  s += xBush(360, 1140, .6) + xBush(620, 1130, .55, '#6cc46c') + xFlowers(200, 1180, 260, 3, t) + xFlowers(600, 1180, 200, 5, t);
  s += person({ age: 'adult', x: ((t * 70) % 1500) - 200, y: 1150, s: .32, hair: 'short', hairColor: '#8a5a3a', shirt: '#36c5b4', pants: '#2b2b33', expr: 'happy', walk: 3, seed: 61 }, t);
  s += G(tr(240 + Math.sin(t * 3) * 60, 900 + Math.sin(t * 5) * 30), path(`M0 0Q${-30} ${-30 * Math.abs(Math.sin(t * 20))} -36 -6Z M0 0Q30 ${-30 * Math.abs(Math.sin(t * 20))} 36 -6Z`, '#ffd23f', 3));
  s += rect(80, 1620, 300, 140, '#ff8fb1', 10, 5) + Array.from({ length: 4 }, (_, i) => line(110 + i * 75, 1620, 110 + i * 75, 1760, 6, '#fff')).join('') + G(tr(900, 1700), path('M-70 0L-60 -80L60 -80L70 0Z', '#c58e55', 5) + path('M-50 -80Q0 -140 50 -80', 'none', 8)) + xBin(1020, 1400, '#5fb85f');
  s += Array.from({ length: 10 }, (_, i) => circ((i * 211) % W, 1300 + (i * 97) % 500, 10, ['#ffd23f', '#ff8fb1', '#fff'][i % 3], 3)).join('');
  return s; }
function bedroomDay(t) { let s = xStripes('#ffe6c8', '#ffdcb8', -M, 1250, 50) + xDots('rgba(255,170,120,.35)', -M, 1250, 100, 6) + lite(.08);
  s += xRod(590, 1010, 250) + xWin(640, 290, 320, 360, t, 'day') + xCurtain(580, 250, 90, 520, '#7b5cff', t, -1) + xCurtain(930, 250, 90, 520, '#7b5cff', t, 1);
  s += xPoster(240, 490, 260, 340, '#7aa6d8', 'ROCK', -2) + xPoster(470, 400, 140, 190, '#ff8fb1', 'SKATE', 5);
  s += path('M60 220Q300 280 560 220', 'none', 3) + [[120, 0], [230, 6], [340, -5], [450, 4]].map(([x, r], i) => G(tr(x, 260 - Math.abs(x - 310) * .1, 1, r + Math.sin(t * 1.5 + i) * 2), rect(-36, 0, 72, 84, '#fff', 3, 4) + rect(-28, 8, 56, 52, ['#7be0ff', '#ffd23f', '#ff8fb1', '#7be07b'][i], 0, 0))).join('');
  s += xShelf(60, 800, 380, xBooks(80, 800, 190, 3) + xTrophy(320, 800, .8) + xMiniPlant(400, 800, t, .8)) + xCalendarW(1010, 770, '16') + xSwitch(1030, 900) + xOutlet(180, 1180);
  s += xBed(-60, 1250, 420, '#7be07b', t) + xDesk(640, 1250, 400, t);
  s += xParquet(1250) + xBaseboard(1254) + xRug(CX, 1520, 380, 110, '#ffd23f', '#ff8a3d');
  s += xGuitar(470, 1250, .7, -10) + xShoes(140, 1600, '#e2463a') + xBag(900, 1560, '#4d7cf0') + xBall(1000, 1700, 40) + xBox(220, 1820, 1, -4) + xPlush(760, 1800, .8);
  return s; }
function restaurant(t) { let s = grad('#a8463f', '#8a3a3a', -M, -M, W + 2 * M, H + 2 * M) + xDots('rgba(255,210,150,.18)', -M, 900, 110, 10) + xWainscot(900, 1240, '#5a2229', 'rgba(255,220,180,.12)') + line(-M, 900, W + M, 900, 10, '#e0b070');
  s += rect(80, 300, 380, 300, '#1d2350', 14) + xView(80, 300, 380, 300, t, 'night') + line(270, 300, 270, 600, 8, '#e0b070') + rect(80, 300, 380, 300, 'none', 14, 10, '#e0b070') + rect(60, 600, 420, 22, '#e0b070', 4, 5);
  s += xPic(790, 470, 300, 220, 'mount', '#e0b070');
  const on = Math.sin(t * 9) > -.7 || ((t * 2) % 1) > .2; s += (on ? glow(790, 720, 180, '#ff4fa0', .35) : '') + G(tr(790, 720), rect(-150, -50, 300, 100, '#2b1418', 30, 5) + fl(0, 16, 'PIZZA', 50, on ? '#ff6fc0' : '#6a3a50', { stroke: on ? '#fff' : 'none', sw: 2 }));
  s += xShelf(560, 840, 460, Array.from({ length: 7 }, (_, i) => xBottle(590 + i * 62, 840, ['#2f6b3a', '#7a1f2a', '#c4a050'][i % 3], 70 + (i % 2) * 14, '#e0b070')).join(''));
  s += xPot(40, 900, .7, t, 'tall') + xPot(1060, 900, .7, t, 'fern');
  s += G(tr(470, 760), rect(-80, -100, 160, 200, '#2b2420', 10, 6, '#e0b070') + fl(0, -50, 'MENU', 28, '#fff') + line(-50, -10, 50, -10, 3, '#fff') + line(-50, 20, 30, 20, 3, '#fff') + line(-50, 50, 40, 50, 3, '#fff'));
  for (let i = 0; i < 3; i++) s += xPendant(200 + i * 340, -40, 260, t, '#e0b070', i);
  s += person({ age: 'adult', x: ((t * 160) % 1600) - 250, y: 1230, s: .55, hair: 'side', hairColor: '#2b2420', shirt: '#fff', pants: '#2b2b33', expr: 'happy', walk: 3, seed: 31 }, t);
  return s + xCheck(1240, '#3a1d22', '#4a252b', 90); }
function restoTable(y = 1250) { let s = rect(-M, y, W + 2 * M, 700, '#fff', 0, 0) + Array.from({ length: 12 }, (_, i) => rect(-100 + i * 120, y, 60, 700, 'rgba(226,70,58,.35)', 0, 0)).join('') + line(-M, y, W + M, y, 8);
  s += circ(CX, y + 80, 70, '#fff', 6) + rect(CX - 10, y - 90, 20, 70, '#fff6c8', 4, 4) + path(`M${CX} ${y - 120}q12 16 0 26q-12 -10 0 -26Z`, '#ffb340', 3);
  s += G(tr(370, y + 30), path('M-26 -110L26 -110L18 -50L-18 -50Z', 'rgba(200,230,255,.7)', 4) + rect(-16, -86, 32, 34, '#9c2f3a', 0, 0) + line(0, -50, 0, 0, 5) + ell(0, 0, 26, 8, 'rgba(200,230,255,.7)', 4));
  s += G(tr(720, y + 30), path('M-26 -110L26 -110L18 -50L-18 -50Z', 'rgba(200,230,255,.7)', 4) + line(0, -50, 0, 0, 5) + ell(0, 0, 26, 8, 'rgba(200,230,255,.7)', 4));
  s += G(tr(130, y + 90), ell(0, 0, 90, 26, '#c58e55', 5) + ell(-30, -20, 34, 18, '#f0c070', 4) + ell(20, -24, 34, 18, '#e0b060', 4)) + G(tr(960, y + 60), rect(-14, -70, 28, 70, '#fff', 8, 4) + rect(26, -60, 24, 60, '#2b2420', 8, 4));
  return s; }
function garage(t) { let s = grad('#c9d1db', '#aab4bf', -M, -M, W + 2 * M, H + 2 * M); for (let x = -300; x < W + 300; x += 46) s += line(x, 260, x, 1250, 3, 'rgba(0,0,0,.08)');
  s += rect(-M, 0, W + 2 * M, 60, '#8a929c', 0, 0) + Array.from({ length: 3 }, (_, i) => { const on = !(i === 1 && Math.sin(t * 13) > .6); return rect(80 + i * 340, 70, 240, 26, on ? '#fdfdf0' : '#9aa3ad', 13, 4) + (on ? glow(200 + i * 340, 110, 150, '#ffffff', .35) : ''); }).join('');
  s += rect(-M, 260, W + 2 * M, 30, '#e2463a', 0, 0);
  s += rect(60, 380, 300, 360, '#8a8f96', 10) + Array.from({ length: 12 }, (_, i) => circ(100 + (i % 4) * 70, 420 + Math.floor(i / 4) * 100, 7, '#5b6168', 0)).join('') + G(tr(140, 520, 1, 20), rect(-12, -60, 24, 120, '#e2463a', 6, 4)) + G(tr(250, 520, 1, -15), rect(-10, -70, 20, 140, '#555', 6, 4)) + G(tr(320, 640, 1, 0), path('M-20 -50L20 -50L14 40L-14 40Z', '#ffd23f', 4)) + G(tr(110, 650), circ(0, 0, 30, 'none', 10, '#555'));
  s += G(tr(480, 520), rect(-80, -110, 160, 220, '#fff', 6, 5) + rect(-80, -110, 160, 50, '#36c5b4', 6, 0) + fl(0, -72, 'AOÛT', 28, '#fff') + Array.from({ length: 12 }, (_, i) => rect(-64 + (i % 4) * 34, -40 + Math.floor(i / 4) * 40, 26, 28, i === 7 ? '#e2463a' : '#eef2f6', 3, 0)).join(''));
  s += rect(700, 360, 300, 420, '#ffd23f', 14) + G(tr(850, 560), circ(0, 0, 90, '#2b2b33') + circ(0, 0, 40, '#9aa3ad', 6)) + fl(850, 730, 'PNEUS', 40, OL);
  s += G(tr(600, 340), circ(0, 0, 50, '#dfe3e8', 5) + G(`rotate(${f1(t * 720)})`, path('M0 0L-12 -44L12 -44Z M0 0L44 -12L44 12Z M0 0L12 44L-12 44Z M0 0L-44 12L-44 -12Z', '#9aa3ad', 3)) + circ(0, 0, 8, OL, 0));
  s += xShelf(560, 900, 480, Array.from({ length: 6 }, (_, i) => rect(590 + i * 74, 820, 54, 80, ['#e2463a', '#36c5f0', '#ffd23f'][i % 3], 8, 4) + rect(604 + i * 74, 806, 20, 16, OL, 3, 0)).join(''), '#7d848c');
  s += path(`M960 300Q${1040 + Math.sin(t * 2) * 10} 600 980 900`, 'none', 14, '#2b2b33');
  s += G(tr(70, 1250), rect(-80, -330, 220, 330, '#e2463a', 10, 5) + Array.from({ length: 4 }, (_, i) => rect(-64, -310 + i * 78, 188, 60, '#c93a30', 6, 4) + rect(10, -284 + i * 78, 40, 10, '#dfe3e8', 4, 0)).join(''));
  s += G(tr(1000, 1250), Array.from({ length: 4 }, (_, i) => ell(0, -40 - i * 70, 110, 38, '#2b2b33', 5) + ell(0, -40 - i * 70, 60, 18, '#555', 3)).join(''));
  for (let i = 0; i < 8; i++) s += path(`M${-M + i * 260 - ((t * 60) % 260)} 1250l120 0l-60 140l-120 0Z`, i % 2 ? '#2b2420' : '#ffd23f', 0);
  s += rect(-M, 1300, W + 2 * M, 900, '#6b737c', 0, 0) + ell(700, 1700, 220, 50, 'rgba(30,30,40,.45)', 0) + ell(300, 1820, 120, 30, 'rgba(30,30,40,.35)', 0) + G(tr(960, 1620), path('M-50 0L0 -170L50 0Z', '#ff8a3d', 5) + rect(-24, -110, 48, 22, '#fff', 0, 0) + rect(-70, -10, 140, 20, '#ff8a3d', 4, 5)) + G(tr(140, 1650), rect(-80, -200, 160, 200, '#36c5f0', 10, 5) + line(-80, -140, 80, -140, 5) + line(-80, -70, 80, -70, 5));
  return s; }
function dentistRoom(t) { let s = grad('#d9f5ef', '#c6ece3', -M, -M, W + 2 * M, H + 2 * M) + xDots('rgba(54,197,180,.18)', -M, 960, 120, 7) + tiles('#f4fbfa', '#d6ece8', 80, -M, 960, W + 2 * M, 290) + rect(-M, 946, W + 2 * M, 22, '#36c5b4', 0, 5);
  s += xWin(670, 300, 300, 340, t, 'trees') + xBlinds(670, 300, 300, 340, t) + xMiniPlant(720, 678, t, .7) + xCactus(910, 680, .8);
  s += rect(110, 300, 280, 380, '#fff', 14) + G(tr(250, 470, .7), toothChar(0, 0, 1, t, { expr: 'happy' })) + ftext(250, 640, 'SOURIEZ !', { size: 38, fill: '#36c5b4', stroke: 'none' });
  s += xPic(480, 250, 110, 140, 'face', '#c9a050', '#fffaf0', -2) + xPic(570, 410, 110, 90, 'mount', '#c9a050', '#fffaf0', 3) + wallClock(500, 600, 46, t, 2);
  s += lite(.1);
  s += G(tr(820, 820), rect(-130, -90, 260, 180, '#3a3f4a', 10, 5) + rect(-116, -76, 232, 152, Math.sin(t * 11) > -.9 ? '#cfefff' : '#9fc6da', 4, 0) + Array.from({ length: 6 }, (_, i) => path(`M${-96 + i * 34} -40Q${-80 + i * 34} -60 ${-66 + i * 34} -40L${-70 + i * 34} 20L${-92 + i * 34} 20Z`, 'rgba(255,255,255,.85)', 3, '#5a7a90')).join(''));
  s += xSconce(60, 760) + G(tr(250, 820), rect(-60, -40, 120, 80, '#fff', 10, 5) + rect(-40, -60, 80, 26, '#7be0ff', 8, 4) + fl(0, 12, 'GANTS', 22, '#36c5b4'));
  s += rect(560, 1000, 520, 250, '#fff', 10, 5) + rect(540, 990, 560, 26, '#bfe9e0', 6, 5) + Array.from({ length: 4 }, (_, i) => rect(580 + (i % 2) * 250, 1040 + Math.floor(i / 2) * 100, 220, 80, '#f4fbfa', 8, 4) + rect(670 + (i % 2) * 250, 1074 + Math.floor(i / 2) * 100, 40, 10, '#9aa3ad', 4, 0)).join('') + xJar(620, 990, '#fff', 60) + xJar(700, 990, '#ff8fb1', 50) + G(tr(800, 990), rect(-20, -50, 40, 50, '#7be0ff', 4, 4) + rect(26, -50, 40, 50, '#7be0ff', 4, 4)) + xBottle(1000, 990, '#36c5b4', 80);
  s += G(tr(1040, 300), line(0, -400, 0, 0, 10, '#9aa3ad') + G(`rotate(${f1(Math.sin(t * .9) * 6)})`, line(0, 0, -180, 60, 10, '#9aa3ad') + G('translate(-180 60)', ell(0, 0, 60, 34, '#fff', 5) + ell(0, 10, 40, 14, '#fff9c8', 3))));
  s += xCheck(1250, '#bfe9e0', '#acdcd2', 100) + xBaseboard(1254, '#e9f7f4') + xPot(1000, 1330, .8, t, 'monstera') + xBin(100, 1330, '#9aa3ad');
  return s; }
function shopAisle(t) { let s = grad('#f4f7fb', '#dfe7ef', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, -M, W + 2 * M, M + 120, '#e8edf3', 0, 0);
  for (let i = 0; i < 4; i++) s += rect(-80 + i * 330, 40, 220, 26, '#fdfdf0', 13, 4) + glow(30 + i * 330, 70, 160, '#ffffff', .4);
  s += G(tr(CX, 300), rect(-330, -60, 660, 120, '#2b2420', 30) + ftext(0, 26, 'BLANC+++', { size: 70, fill: Math.sin(t * 8) > -.3 ? '#7be0ff' : '#3a5a70', stroke: 'none' }));
  s += G(tr(130, 180, 1, Math.sin(t * 1.8) * 6), line(0, -100, 0, 0, 3) + path('M0 0L80 40L60 120L-60 120L-80 40Z', '#ffd23f', 5) + fl(0, 90, '-50%', 36, '#e2463a'));
  s += G(tr(950, 180, 1, Math.sin(t * 1.6 + 1) * 6), line(0, -100, 0, 0, 3) + rect(-80, 0, 160, 110, '#e2463a', 14, 5) + fl(0, 70, 'PROMO', 32, '#fff'));
  s += G(tr(1010, 430), rect(-30, -20, 60, 40, '#fff', 8, 4) + G(`rotate(${f1(Math.sin(t * .8) * 25)})`, rect(-10, 10, 60, 30, '#3a3f4a', 8, 4) + circ(44, 25, 7, Math.sin(t * 5) > 0 ? '#ff3b30' : '#7a2020', 0)));
  for (let r = 0; r < 4; r++) { const y = 520 + r * 200; s += rect(-M, y + 90, W + 2 * M, 24, '#9aa3ad', 0, 5); for (let i = 0; i < 11; i++) { const x = 20 + i * 100 + (r % 2) * 40; s += rect(x, y - 30 + (i * 37 % 30), 70, 120 - (i * 37 % 30), ['#36c5f0', '#fff', '#7b5cff', '#ff8fb1', '#7be0ff'][(i + r) % 5], 10, 5) + rect(x + 10, y + 20, 50, 16, '#ffd23f', 3, 0) + (i % 3 === 0 ? sparkle(x + 50, y - 10 + (i * 37 % 30), .18 + .1 * Math.sin(t * 6 + i), '#fff') : ''); } for (let i = 0; i < 6; i++) s += rect(60 + i * 180, y + 96, 70, 14, (i + r) % 3 ? '#fff' : '#ffd23f', 2, 3); }
  s += lite(.1);
  s += person({ age: 'adult', x: ((t * -140) % 1600 + 1600) % 1600 - 250, y: 1260, s: .5, hair: 'bun', hairColor: '#8a5a3a', shirt: '#ff8fb1', expr: 'happy', walk: 3, flip: 1, seed: 33 }, t);
  s += rect(-M, 1260, W + 2 * M, 900, '#e8eef2', 0, 0) + Array.from({ length: 10 }, (_, i) => line(-200 + i * 160, 1260, -400 + i * 200, H + 100, 4, '#c9d1db')).join('') + Array.from({ length: 4 }, (_, i) => ell(150 + i * 260, 1400 + (i % 2) * 120, 70, 12, 'rgba(255,255,255,.8)', 0)).join('');
  s += G(tr(1010, 1460), path('M-70 -110L70 -110L56 0L-56 0Z', '#e2463a', 5) + path('M-50 -110Q0 -170 50 -110', 'none', 7) + rect(-50, -150, 30, 50, '#36c5f0', 6, 4) + rect(-10, -160, 30, 60, '#7b5cff', 6, 4)) + G(tr(90, 1500), rect(-50, -160, 100, 160, '#ffd23f', 8, 5) + fl(0, -90, '!', 70, '#e2463a') + path('M-50 0L-70 30L70 30L50 0Z', '#ffd23f', 4));
  return s; }
function stageNight(t) { let s = grad('#1b1440', '#0d0a22', -M, -M, W + 2 * M, H + 2 * M);
  s += rect(60, 260, 960, 560, '#120d2e', 20, 6) + Array.from({ length: 60 }, (_, i) => circ(100 + (i % 12) * 80, 300 + Math.floor(i / 12) * 100, 14, Math.sin(t * 6 + i * .7) > .3 ? '#7b5cff' : '#2a2060', 0)).join('');
  s += rect(-M, 120, W + 2 * M, 34, '#3a3f4a', 0, 5) + Array.from({ length: 24 }, (_, i) => line(-200 + i * 70, 120, -165 + i * 70, 154, 4, '#5a606c')).join('');
  for (let i = 0; i < 5; i++) { const a = Math.sin(t * 1.5 + i * 1.7) * 30, c = ['#ffe9a6', '#ff8fb1', '#7be0ff', '#ffe9a6', '#b49cff'][i]; s += G(tr(60 + i * 240, 160, 1, a), path('M-20 0L20 0L240 1400L-240 1400Z', c, 0).replace('<path', '<path opacity=".12"') + rect(-30, -20, 60, 50, '#2b2b33', 8, 4) + ell(0, 30, 24, 10, c, 0)); }
  s += G(tr(80, 1250), rect(-90, -460, 180, 460, '#1f1f28', 10, 5) + circ(0, -340, 60, '#2b2b33', 5) + circ(0, -340, 22 + 3 * Math.sin(t * 20), '#555', 0) + circ(0, -130, 76, '#2b2b33', 5) + circ(0, -130, 30 + 4 * Math.sin(t * 20), '#555', 0));
  s += G(tr(1000, 1250), rect(-90, -460, 180, 460, '#1f1f28', 10, 5) + circ(0, -340, 60, '#2b2b33', 5) + circ(0, -340, 22 + 3 * Math.sin(t * 20 + 1), '#555', 0) + circ(0, -130, 76, '#2b2b33', 5) + circ(0, -130, 30 + 4 * Math.sin(t * 20 + 1), '#555', 0));
  for (let i = 0; i < 3; i++) s += op(.25, cloud(150 + i * 380 + Math.sin(t * .6 + i) * 60, 1200, 1.2, '#b49cff'));
  s += rect(-M, 1250, W + 2 * M, 900, '#2b2040', 0, 0) + Array.from({ length: 9 }, (_, i) => circ(60 + i * 120, 1270, 26, Math.sin(t * 9 + i) > 0 ? '#ffd23f' : '#ff4fa0', 5)).join('');
  for (let i = 0; i < 9; i++) { const x = 40 + i * 125, b = Math.abs(Math.sin(t * 7 + i)) * 24; s += circ(x, 1560 - b, 70, '#120d2e', 0) + rect(x - 80, 1600 - b, 160, 400, '#120d2e', 40, 0) + (i % 2 ? G(tr(x + 50, 1430 - b, 1, 10), rect(-24, -40, 48, 80, '#2b2b33', 8, 3) + rect(-18, -32, 36, 60, Math.sin(t * 9 + i) > .7 ? '#fff' : '#7be0ff', 4, 0)) + line(x + 30, 1520 - b, x + 50, 1460 - b, 22, '#120d2e') : line(x - 40, 1530 - b, x - 70, 1400 - b, 24, '#120d2e')); }
  return s; }
function nightRoom(t, light = 0) { let s = grad('#141a3a', '#222a58', -M, -M, W + 2 * M, H + 2 * M) + xStripes('rgba(255,255,255,0)', 'rgba(255,255,255,.035)', -M, 1250, 50);
  s += Array.from({ length: 8 }, (_, i) => sparkle(80 + (i * 137) % 900, 90 + (i * 61) % 140, .3, `rgba(190,255,200,${.4 + .3 * Math.sin(t * 2 + i)})`)).join('');
  s += xRod(600, 1020, 230) + xWin(640, 250, 340, 400, t, 'night', '#3a4270') + xCurtain(590, 230, 80, 560, '#3b2e6e', t, -1) + xCurtain(950, 230, 80, 560, '#3b2e6e', t, 1);
  s += xBulbs(40, 560, 200, t);
  s += op(.55, xPoster(140, 450, 200, 260, '#7b5cff', 'LED', -4) + xShelf(60, 700, 300, xBooks(80, 700, 200, 5)) + xPic(470, 520, 110, 140, 'heart', '#8a5a3a', '#2e3570'));
  s += xBed(560, 1250, 520, '#4d5bb0', t);
  s += G(tr(470, 1250), rect(-70, -170, 140, 170, '#5a4a3a', 8, 5) + rect(-60, -110, 120, 50, '#4a3a2e', 6, 4) + rect(-60, -230, 120, 60, '#1b1b22', 10, 4) + fl(0, -185, (Math.sin(t * 6) > 0 ? '03:12' : '03 12'), 34, '#ff3b30') + xLamp(-30, -170, .35, light));
  s += xParquet(1250, '#2a2238', '#221c30') + xBaseboard(1254, '#2e2840') + xRug(CX, 1560, 340, 90, '#3b2e6e', '#5a4aa0') + xShoes(300, 1700, '#ff8fb1').replace(/#ff8fb1/g, '#c06a90') + xPlush(880, 1720, .8, '#8a6a4a');
  return s + (light ? glow(CX, 900, 600, '#fff6c8', .35 * light) : ''); }
function showerBg(t) { let s = tiles('#d9e7f7', '#bfd2e8', 110) + rect(-M, 900, W + 2 * M, 60, '#7b5cff', 0, 5) + Array.from({ length: 30 }, (_, i) => rect(-200 + i * 50, 912, 34, 34, i % 2 ? '#b49cff' : '#fff', 4, 0)).join('');
  s += G(tr(80, 700), rect(-60, -200, 220, 220, '#bfd2e8', 10, 5) + xBottle(-10, 0, '#ff8fb1', 110, '#fff') + xBottle(50, 0, '#36c5f0', 90, '#fff') + xBottle(110, 0, '#ffd23f', 130, '#e2463a'));
  s += line(CX + 120, -100, CX + 120, 160, 12, '#c9ced6') + G(tr(CX + 120, 180), path('M-90 0L90 0L60 -40L-60 -40Z', '#c9ced6', 5) + Array.from({ length: 7 }, (_, i) => circ(-70 + i * 23, 0, 4, OL, 0)).join(''));
  for (let i = 0; i < 14; i++) { const k = (t * 2.2 + i / 14) % 1, x = CX + 50 + (i % 7) * 23 + (i % 7 - 3) * k * 120; s += line(x, 190 + k * 900, x + (i % 7 - 3) * 4, 230 + k * 900, 5, 'rgba(120,190,255,.6)'); }
  for (let i = 0; i < 26; i++) { const x = (i * 97) % W, y = ((i * 211 + t * 900) % (H + 200)) - 100; s += line(x, y, x - 10, y + 60, 6, 'rgba(255,255,255,.7)'); }
  s += xRod(820, 1160, 90) + Array.from({ length: 5 }, (_, i) => circ(840 + i * 60, 90, 14, 'none', 5)).join('') + xCurtain(820, 100, 280, 1150, '#7be0ff', t, 1);
  s += G(tr(170, 1000), circ(0, 0, 40, '#c9ced6', 5) + rect(-30, -4, 60, 8, OL, 4, 0)) + G(tr(280, 1080 + Math.sin(t * 3) * 6), ell(0, 0, 40, 26, '#ffd23f', 4) + circ(26, -30, 22, '#ffd23f', 4) + path('M44 -30l22 6l-22 6Z', '#ff8a3d', 3) + circ(32, -36, 3, OL, 0)) + G(tr(80, 1120), rect(-60, -30, 120, 60, '#ffd23f', 16, 5) + Array.from({ length: 5 }, (_, i) => circ(-36 + i * 18, -6 + (i % 2) * 14, 5, '#e0b030', 0)).join(''));
  s += tiles('#b7c9e0', '#9fb3cc', 80, -M, 1250, W + 2 * M, 900) + ell(CX, 1600, 60, 16, '#8a94a6', 5) + Array.from({ length: 4 }, (_, i) => line(CX - 40 + i * 26, 1592, CX - 40 + i * 26, 1608, 4)).join('');
  return s; }
function dining(t) { let s = grad('#ffe7c2', '#ffd59a', -M, -M, W + 2 * M, H + 2 * M); for (let i = -6; i < 16; i++) s += rect(i * 110, -M, 50, H + 2 * M, 'rgba(255,255,255,.3)', 0, 0);
  s += xDots('rgba(255,160,90,.18)', -M, 900, 110, 7) + xWainscot(900, 1240, '#f2c48a');
  s += xRod(590, 1030, 220) + xWin(640, 260, 340, 380, t, 'trees', '#fff3e0') + xCurtain(580, 220, 90, 560, '#ff8a3d', t, -1) + xCurtain(940, 220, 90, 560, '#ff8a3d', t, 1);
  s += G(tr(880 + Math.sin(t * 2) * 2, 640), ell(0, 0, 70, 40, '#3a3f4a', 5) + circ(-56, -34, 30, '#3a3f4a', 5) + path('M-76 -58l6 -26l14 20Z M-46 -60l10 -24l8 24Z', '#3a3f4a', 4) + path(`M60 10Q${110 + Math.sin(t * 3) * 30} -20 ${90 + Math.sin(t * 3) * 20} -60`, 'none', 14, '#3a3f4a') + path('M-66 -36q6 4 12 0M-50 -36q6 4 12 0', 'none', 3, '#fff'));
  s += xPic(270, 320, 300, 230, 'mount') + xPic(170, 560, 100, 120, 'face', '#c9a050', '#fffaf0', -3) + xPic(300, 580, 120, 100, 'heart', '#c9a050', '#fffaf0', 2) + xPic(430, 560, 90, 120, 'sea', '#c9a050', '#fffaf0', -2) + wallClock(80, 200, 50, t, 2);
  s += xShelf(380, 760, 220, ell(430, 740, 40, 30, '#fff', 4) + ell(500, 740, 40, 30, '#7be0ff', 4) + xJar(560, 760, '#ff8a3d', 50)) + xSwitch(1040, 780) + xOutlet(560, 1180);
  s += lite(.12);
  const a = Math.sin(t * 1.4) * 5; s += G(tr(CX, -60, 1, a), line(0, 0, 0, 300, 6) + path('M-120 360L120 360L70 290L-70 290Z', '#7b5cff') + glow(0, 400, 220, '#fff3c0', .4));
  s += xPot(1000, 1250, .9, t, 'tall');
  return s + xParquet(1240, '#b07a4a', '#966540'); }
function diningTable(t, jump = 0, y = 1235) { let s = rect(-M, y, W + 2 * M, 900, '#fff6e6', 0, 0) + line(-M, y, W + M, y, 8) + rect(-M, y + 40, W + 2 * M, 18, '#ff8fb1', 0, 0) + Array.from({ length: 14 }, (_, i) => circ(-60 + i * 90, y + 140, 8, 'rgba(255,143,177,.4)', 0)).join('');
  for (let i = 0; i < 4; i++) { const x = 140 + i * 270, j = jump * Math.abs(Math.sin(t * 22 + i * 1.3)) * 30; s += G(tr(x, y + 60 - j), ell(0, 0, 90, 26, '#fff', 6) + ell(0, -6, 50, 14, ['#ff7a3d', '#7be07b', '#ffd23f', '#e2463a'][i], 0)) + steam(x, y + 10 - j, t + i, .35) + G(tr(x + 100, y + 10 - j * .8), rect(-20, -60, 40, 70, 'rgba(180,220,255,.7)', 8, 5)) + line(x - 120, y + 70, x - 120, y + 20, 5, '#9aa3ad') + line(x + 120, y + 70, x + 124, y + 20, 5, '#9aa3ad'); }
  const j2 = jump * Math.abs(Math.sin(t * 20)) * 30; s += G(tr(CX + 10, y + 20 - j2), rect(-18, -110, 36, 110, '#2f6b3a', 10, 5) + rect(-10, -150, 20, 44, '#2f6b3a', 4, 4) + rect(-18, -70, 36, 34, '#fff3dc', 0, 4)) + G(tr(1000, y + 110 - j2), ell(0, 0, 70, 22, '#c58e55', 5) + ell(-20, -14, 30, 14, '#f0c070', 4) + ell(16, -16, 30, 14, '#e0b060', 4));
  return s; }
function classroomB(t) { let s = grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + xDots('rgba(230,160,80,.18)', -M, 900, 110, 6) + xWainscot(920, 1250, '#9fd3a7');
  s += Array.from({ length: 9 }, (_, i) => G(tr(80 + i * 105, 130, 1, (i % 2 ? 4 : -4) + Math.sin(t * 2 + i) * 2), rect(-40, -44, 80, 88, ['#ff8fb1', '#ffd23f', '#7be0ff', '#7be07b', '#b49cff'][i % 5], 8, 4) + fl(0, 18, 'ABCDEFGHI'[i], 48, OL))).join('') + path('M20 86Q540 120 1060 86', 'none', 3);
  s += rect(60, 300, 960, 520, '#3c5a48', 18) + rect(80, 320, 920, 480, '#456b55', 10, 0) + op(.25, path('M140 380Q300 340 420 420M600 700Q760 640 900 720', 'none', 12, '#fff')) + rect(60, 820, 960, 24, '#a97e52', 4, 5) + rect(200, 806, 60, 16, '#fff', 3, 3) + rect(300, 806, 80, 20, '#e2463a', 4, 3) + rect(740, 800, 110, 26, '#2b2b33', 6, 4);
  s += wallClock(940, 200, 60, t) + G(tr(1050, 560), rect(-36, -150, 72, 300, '#4d7cf0', 6, 5)) + xMiniPlant(1040, 300, t, .7);
  s += Array.from({ length: 4 }, (_, i) => line(100 + i * 120, 960, 100 + i * 120, 990, 8, '#9aa3ad') + xBag(100 + i * 120, 1140, ['#ff8fb1', '#ffd23f', '#36c5f0', '#7be07b'][i])).join('');
  s += G(tr(880, 1250), rect(-200, -320, 400, 30, '#c58e55', 6, 5) + rect(-180, -290, 360, 290, '#b07a4a', 8, 5) + G(tr(-120, -320), circ(0, -40, 34, '#e2463a', 4) + line(0, -74, 6, -90, 5, '#5a3a20') + ell(14, -82, 14, 6, '#5fb85f', 3)) + Array.from({ length: 3 }, (_, i) => rect(-30 - i * 4, -340 - i * 22, 120 + i * 8, 22, ['#4d7cf0', '#ffd23f', '#e2463a'][i], 3, 4)).join('') + G(tr(140, -320), rect(-6, -40, 12, 40, '#8a5a3a', 0, 4) + G(`rotate(${f1(t * 30)})`, circ(0, -90, 56, '#5ec4f0', 5) + path('M-30 -110Q-10 -130 10 -100Q30 -80 0 -60', '#7be07b', 3))));
  s += G(tr(((t * 260) % 1500) - 200, 640 + Math.sin(t * 3) * 40, 1, 8), path('M-40 0L40 -6L-30 20Z', '#fff', 4) + line(-40, 0, 20, 6, 3));
  s += xParquet(1250) + xBaseboard(1254, '#e8d8c0') + G(tr(500, 1700), circ(0, 0, 22, '#fff', 4) + path('M-14 -6l20 10M-6 12l14 -16', 'none', 3)) + xBox(160, 1840, .8, 4);
  return s; }

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
      stamp(760, 1110, 'PARFAIT', t, C, '#36a85a', -10) + (t > C ? popStars(330, 900, t, C) : '') + fgBlur('plant', 1010, 1960, 1.6, t); },
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
  draw: (t, d, T) => bedroomDay(t) + ado({ x: CX, y: 1430, s: 1.4, expr: 'pressedHappy', armL: [200, 230], armR: [-20, -50] }, t) + cake16(CX, 1330, .9, t) + confetti(t, 0, 30) + fgBlur('chair', 1000, 2000, 1.1) + funTag(CX, 430, '16 ANS', t, at(7, '16') - .1, { size: 80, bg: SX.acc2, fg: SX.ink }),
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
    return blur(8, park(t)) + lite(.35, '#c9b8ff') + adoHead(CX, 900, 270, { expr: t > Fe ? 'zipped' : 'pressedHappy' }, t) + (t > Fe ? G(tr(CX + 120, 1100 + Math.sin(t * 6) * 8, pop(t, Fe, .35), Math.sin(t * 4) * 10), padlock(0, 0, .8)) : '') +
      funTag(CX, 430, 'MODE CADENAS', t, Fe, { size: 58, bg: SX.acc }) + markerCircle(CX, 1000, 150, 70, t, L, { col: SX.acc2 }); },
  sfx: [[at(8, 'levres') - at(8, 'souris') + .15, 'scratch', .5], [at(8, 'fermees') - at(8, 'souris') + .15, 'snip', .7], [at(8, 'fermees') - at(8, 'souris') + .35, 'thud', .6]] }, at(8, 'souris') - .15);
// B009a — au restaurant : lampes qui se balancent, serveur qui passe, tout le monde rigole
B(9, { enter: 'whip', cam: zin(1.02, 1.07, .4),
  draw: (t, d, T) => restaurant(t) + crushP({ x: 230, y: 1460, s: 1.15, expr: 'laugh' }, t) + ado({ x: CX, y: 1460, s: 1.2, expr: 'pressed' }, t) + kevin({ x: 860, y: 1460, s: 1.15, expr: 'laugh', flip: 1 }, t) + restoTable() + fgBlur('glass', 980, 1920, 1.5) + funTag(CX, 420, 'AU RESTO', t, at(9, 'restaurant'), { size: 56, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'whoosh', .5], [at(9, 'restaurant'), 'pop', .5], [.3, 'ding', .3]] });
// B009b — tu caches ta bouche quand tu ris : un menu GÉANT devant la bouche, les HA HA dépassent
B(9, { enter: 'punch', cam: camHand(1.06, .6),
  draw: (t, d, T) => { const C = at(9, 'caches') - at(9, 'caches') + .15, Ri = at(9, 'ris') - at(9, 'caches') + .15; const up = eOutBack(seg(t, C - .1, C + .3));
    return restaurant(t) + adoHead(CX, 880, 230, { expr: 'yLaugh' }, t) + G(tr(CX, lerp(1600, 1250, up), 1, Math.sin(t * 20) * 2), menuCard(0, 0, 1)) + restoTable(1330) +
      funTag(260, 560, 'HA', t, Ri - .2, { size: 60, bg: '#fff', fg: SX.ink, r: -12 }) + funTag(820, 520, 'HA HA', t, Ri - .05, { size: 54, bg: '#fff', fg: SX.ink, r: 10 }) + sweatDrops(CX, 760, t); },
  sfx: [[.15, 'whoosh_up', .6], [.4, 'thud', .5], [at(9, 'ris') - at(9, 'caches') - .05, 'pop', .5], [at(9, 'ris') - at(9, 'caches') + .1, 'pop_hi', .5]] }, at(9, 'caches') - .15);
// B010a — ton crush : « montre tes dents ! » (cœurs), toi en sueur
B(10, { enter: 'drop', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const Mo = at(10, 'montre'); return park(t) + crushP({ x: 290, y: 1500, s: 1.35, expr: 'love', armR: [-30, -50] }, t) + heartsUp(t, 290, 900, 4) + fgBlur('bush', 1000, 1960, 1, t) + ado({ x: 780, y: 1500, s: 1.35, expr: t > Mo ? 'pressedShock' : 'pressedHappy', flip: 1, tremble: t > Mo ? 1 : 0 }, t) +
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
  draw: (t, d, T) => { const Te = at(12, 'teintes'); return dentistRoom(t) + dentiste({ x: 840, y: 1520, s: 1.25, expr: 'happy', flip: 1, armL: [200, 220] }, t) + ado({ x: 260, y: 1500, s: 1.2, expr: 'pressed' }, t) + shadeGuide(CX, 760, 1, t, Te - .1) + fgBlur('plant', 70, 1980, 1.6, t) + funTag(CX, 470, 'NUANCIER', t, at(12, 'varient'), { size: 56, bg: SX.cool }); },
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
    return shopAisle(t) + ado({ x: 320, y: 1500, s: 1.3, expr: 'pressedHappy', armR: [-10, 0] }, t) + G(tr(700, 1290), cart) + fgBlur('shelf', 1060, 2000, 1.2) + funTag(CX, 420, 'BLANCHISSANT', t, Bl - .1, { size: 60, bg: '#7be0ff', fg: SX.ink }) + funTag(800, 560, `-${counter(0, 89, t, A, d - A)} €`, t, A, { size: 46, bg: SX.acc, r: 6 }); },
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
  draw: (t, d, T) => dining(t) + maman({ x: 170, y: 1500, s: 1.0, expr: 'happy' }, t) + ado({ x: 450, y: 1440, s: 1.2, expr: t > at(18, 'blague') ? 'talk' : 'pressedHappy', armR: [-40, -70] }, t) + papa({ x: 720, y: 1500, s: 1.0, expr: 'neutral' }, t) + kevin({ x: 950, y: 1440, s: 1.05, expr: 'smug', flip: 1 }, t) + diningTable(t) + fgBlur('bottle', 60, 1960, 1.3) +
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
  draw: (t, d, T) => { const o = at(24, 'photo') - .15, Su = at(24, 'super') - o; return blur(8, dining(t)) + lite(.3, '#ffe9c9') + G(tr(CX, 860, 1.3, -4), rect(-170, -330, 340, 660, '#2b2b33', 44) + rect(-150, -295, 300, 590, '#ffe9a6', 24, 0) + adoHead(0, -40, 110, { expr: 'yTears' }, t) + ftext(-120, 250, `♥ ${counter(12, 998, t, .1, 1.2)}`, { size: 34, fill: '#ff4d6d', anchor: 'start', stroke: 'none' })) +
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
    person({ age: 'adult', x: 880, y: 1520, s: 1.15, hair: 'bun', hairColor: '#8a5a3a', glasses: true, shirt: '#e2463a', pants: '#4b5b7a', expr: 'angry', flip: 1, armL: [210, 200], seed: 4 }, t) + ado({ x: 300, y: 1500, s: 1.25, expr: 'pressed' }, t) + kevin({ x: 600, y: 1520, s: .95, expr: 'smug' }, t) + fgBlur('chair', 90, 2000, 1.1),
  sfx: [[0, 'school_bell', .4], [at(27, 'appris'), 'scratch', .7], [at(27, 'appris') + .3, 'tick', .4]] });
// B027b — FIN : « honte de ton sourire » → tu souris en grand, dents jaunes au soleil… et le soleil met ses lunettes
B(27, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const o = at(27, 'honte') - .15, So = at(27, 'sourire') - o; const sh = eOutBack(seg(t, So + .2, So + .6));
    return park(t) + G(tr(860, 640), sun(0, 0, .55, t, 'happy') + (sh > 0 ? G(tr(0, lerp(-300, -12, sh)), sunGlasses(0, 0, .75)) : '')) + rays(t, CX, 1000, 'rgba(255,255,255,0)', 'rgba(255,240,170,.25)', 18).replace(/<rect[^>]*\/>/, '') +
      ado({ x: CX - 120, y: 1500, s: 1.4, expr: t > So ? 'yWow' : 'pressed', armL: [200, 230], armR: [-20, -50] }, t) + (t > So ? popStars(CX - 120, 1100, t, So, 8, 300) + confetti(t, So, 30) : '') +
      kthin('honte de ton', CX, 330, t, 0, { size: 58 }) + kword('SOURIRE ?', CX, 450, t, So - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .5], [at(27, 'honte') - at(27, 'honte') + .2, 'hmm', .4], [at(27, 'sourire') - at(27, 'honte') + .1, 'boom', .6], [at(27, 'sourire') - at(27, 'honte') + .35, 'sparkle', .6], [at(27, 'sourire') - at(27, 'honte') + .7, 'rimshot', .5]] }, at(27, 'honte') - .15);

SCENES.sort((a, b) => a.s - b.s);
