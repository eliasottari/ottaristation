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
//  Police Fredoka (défaut sxFun), contours cartoon épais, un accent rose « bonheur ».
// ============================================================
sxFun('#ff4f8b'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';

// ---------- LE SOURIRE « DENTS DU BONHEUR » (écart entre les 2 incisives du haut) ----------
// La bouche est dessinée dans hairFn (calque avant, sous les yeux) ; la bouche d'origine du head est neutralisée ('_gap').
const GAPSET = { grin: 1, laugh: 1, teeth: 1, scream: 1, jaw: 1, wail: 1, chatter: 1 };
function gapTeeth(x, top, r, ih) { const g = r * .055, iw = r * .115, sw = r * .1;
  return rect(x - g - iw, top - r * .02, iw, ih, '#fffdf6', r * .035, 4) + rect(x + g, top - r * .02, iw, ih, '#fffdf6', r * .035, 4) +
    rect(x - g - iw - sw, top - r * .02, sw - r * .01, ih * .72, '#fffdf6', r * .03, 4) + rect(x + g + iw + r * .01, top - r * .02, sw - r * .01, ih * .72, '#fffdf6', r * .03, 4); }
function gapMouth(type, r, t, lx, ly) {
  const x = lx * .6, y = r * .36 + ly * .6;
  if (type === 'lips') { // lèvres pincées (on cache l'écart)
    const q = 1 + .06 * Math.sin(t * 30);
    return path(`M${x - r * .22} ${y + r * .03}Q${x} ${y - r * .07 * q} ${x + r * .22} ${y + r * .03}Q${x} ${y + r * .12 * q} ${x - r * .22} ${y + r * .03}Z`, '#e46a6a', 5) + line(x - r * .2, y + r * .03, x + r * .2, y + r * .03, 4) +
      line(x - r * .28, y - r * .02, x - r * .24, y + r * .03, 3) + line(x + r * .28, y - r * .02, x + r * .24, y + r * .03, 3); }
  if (!GAPSET[type]) return mouthSvg(type, r, t, lx, ly);
  const id = 'gm' + (_gid++);
  let w, top, h;
  if (type === 'scream' || type === 'jaw' || type === 'wail') { w = r * .3; top = y - r * .1; h = r * (type === 'jaw' ? 1.0 : .55) * (.92 + .08 * Math.sin(t * 25)); }
  else if (type === 'laugh' || type === 'chatter') { w = r * .3; top = y - r * .07; h = r * .32 * (.8 + .2 * Math.abs(Math.sin(t * 18))); }
  else { w = r * .31; top = y - r * .06; h = r * .27; }
  const d = `M${x - w} ${top}Q${x} ${top + r * .03} ${x + w} ${top}Q${x + w * .86} ${top + h} ${x} ${top + h}Q${x - w * .86} ${top + h} ${x - w} ${top}Z`;
  let s = `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>` + path(d, '#6b1f24', 0);
  s += `<g clip-path="url(#${id})">` + ell(x, top + h * .85, w * .5, h * .25, '#ff8a9a', 0) + gapTeeth(x, top, r, r * .17) + '</g>';
  return s + path(d, 'none', 6);
}
function withGap(o) { const ex = Object.assign({}, EXPR[o.expr || 'neutral'] || EXPR.neutral, o.face || {}); return Object.assign({}, o, { _m: o.gm || ex.mouth, face: Object.assign({}, o.face || {}, { mouth: '_gap' }) }); }
const gapHair = (style = 'short', col = '#5a3a26') => (r, t, o) => { const [b, f] = hairSvg(style, o.hc || col, r, t); const [lx, ly] = (o.look || [0, 0]).map(v => v * r * .12); return [b, f + gapMouth(o._m, r, t, lx, ly)]; };
// gros plan bouche (bigMouth de teeth.js) + écart sombre au milieu des incisives du haut
function gapBig(x, y, s, t, o = {}) { return bigMouth(x, y, s, t, o) + G(tr(x, y, s, o.r || 0), rect(-27, -88, 54, 22, '#e98a8a', 0, 0) + rect(-27, -68, 54, 96, '#6b1f24', 12, 0) + line(-27, -84, -27, 18, 6) + line(27, -84, 27, 18, 6)); }

// ---------- personnages ----------
const HSHIRT = '#4d9bf0';
const heroK = (o, t) => person(withGap(Object.assign({ age: 'kid', hairFn: gapHair(), shirt: HSHIRT, pants: '#3b3f4a', seed: 2 }, o)), t);
const heroA = (o, t) => person(withGap(Object.assign({ age: 'adult', hairFn: gapHair(), shirt: HSHIRT, pants: '#2f3a55', seed: 2 }, o)), t);
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(withGap(Object.assign({ hr: r, hairFn: gapHair(), seed: 2 }, o)), t));
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinA = (o, t) => person(Object.assign({ age: 'adult', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const modelP = (o, t) => person(withGap(Object.assign({ age: 'adult', hairFn: gapHair('long', '#2b2420'), skin: '#c98a5e', shirt: '#ff4f8b', pants: '#2b2420', necklace: true, seed: 7 }, o)), t);
const modelHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(withGap(Object.assign({ hr: r, hairFn: gapHair('long', '#2b2420'), skin: '#c98a5e', seed: 7 }, o)), t));
const kidX = (i, o, t) => person(Object.assign({ age: 'kid', hair: ['curly', 'bun', 'short', 'ponytail'][i % 4], hairColor: ['#2b2420', '#8a5a3a', '#e0a040', '#1f1a18'][i % 4], shirt: ['#ff8fb1', '#b56cff', '#ffd23f', '#7be07b'][i % 4], skin: ['#f2c9a0', '#c98a5e', '#f6d7b8', '#8a5a3a'][i % 4], seed: 20 + i }, o), t);
const adultX = (i, o, t) => person(Object.assign({ age: 'adult', hair: ['bun', 'side', 'curly', 'short'][i % 4], hairColor: ['#8a5a3a', '#1f1a18', '#2b2420', '#d9d9de'][i % 4], shirt: ['#7aa6d8', '#e2463a', '#b56cff', '#36a85a'][i % 4], skin: ['#f2c9a0', '#c98a5e', '#8a5a3a', '#f6d7b8'][i % 4], glasses: i % 2 === 1, seed: 40 + i }, o), t);

// ---------- ACCESSOIRES DE DÉCOR (décors riches : 15–30 éléments, 3 couches lointain/moyen/premier plan flou, 2–3 éléments animés) ----------
const PAL = ['#ff8fb1', '#ffd23f', '#5ec4f0', '#7be07b', '#ff8a3d', '#b56cff', '#4d7cf0', '#e2463a', '#36c5b4'];
const wash = (o, c = '#ffffff') => op(o, rect(-M, -M, W + 2 * M, H + 2 * M, c, 0, 0));   // voile : décor moins saturé derrière les persos
const dtx = (x, y, str, size = 30, fill = OL, anchor = 'middle') => ftext(x, y, str, { size, fill, stroke: 'none', anchor });
// murs
function dStripes(c1, c2, y1 = 1250, w = 60) { let d = ''; for (let x = -M; x < W + M; x += w * 2) d += `M${x} ${-M}h${w}V${y1}h${-w}Z`; return rect(-M, -M, W + 2 * M, y1 + M, c1, 0, 0) + path(d, c2, 0); }
function dDots(c1, c2, y1 = 1250, st = 100, r = 8) { let d = ''; for (let j = 0, y = -M + 40; y < y1; y += st, j++) for (let x = -M + (j % 2) * st / 2; x < W + M; x += st) d += `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`; return rect(-M, -M, W + 2 * M, y1 + M, c1, 0, 0) + path(d, c2, 0); }
function dBricks(x0, y0, w, h, c, m = 'rgba(0,0,0,.14)', bw = 110, bh = 46) { let d = ''; for (let j = 0, y = y0; y < y0 + h; y += bh, j++) { d += `M${x0} ${y}H${x0 + w}`; for (let x = x0 + (j % 2) * bw / 2; x < x0 + w; x += bw) d += `M${x} ${y}V${Math.min(y + bh, y0 + h)}`; } return rect(x0, y0, w, h, c, 0, 0) + path(d, 'none', 4, m); }
// sol : lattes / carrelage en perspective
function dFloor(y0, c, c2 = 'rgba(0,0,0,.13)', n = 70) { let d = ''; for (let i = -18; i <= 18; i++) d += `M${CX + i * n} ${y0}L${CX + i * n * 4.2} ${H + M}`; for (let j = 1, y = y0; y < H + M; j++) { y = y0 + 16 * j + 5 * j * j; d += `M${-M} ${y}H${W + M}`; } return rect(-M, y0, W + 2 * M, H + 2 * M - y0, c, 0, 0) + path(d, 'none', 4, c2); }
const dBase = (y, c = '#fffdf6') => rect(-M, y - 34, W + 2 * M, 36, c, 0, 5);
const dOutlet = (x, y) => rect(x - 24, y - 24, 48, 48, '#fbfbf6', 8, 4) + circ(x - 9, y, 4, OL, 0) + circ(x + 9, y, 4, OL, 0);
const dSwitch = (x, y) => rect(x - 22, y - 32, 44, 64, '#fbfbf6', 8, 4) + rect(x - 9, y - 15, 18, 30, '#e6e2d6', 4, 3);
// cadres, posters
function dFrame(x, y, w, h, k = 0, col = '#c38a52', r = 0) {
  const iw = w - 26, ih = h - 26, bg = c => rect(-iw / 2, -ih / 2, iw, ih, c, 0, 0); let inn;
  if (k === 0) inn = bg('#bfe6ff') + path(`M${-iw / 2} ${ih / 2}L${-iw * .15} ${-ih * .05}L${iw * .05} ${ih * .2}L${iw * .25} ${-ih * .15}L${iw / 2} ${ih / 2}Z`, '#7bbf5a', 0) + circ(iw * .25, -ih * .28, Math.min(iw, ih) * .1, '#ffd23f', 0);
  else if (k === 1) inn = bg('#ffe3ec') + heart(0, 0, Math.min(iw, ih) / 110, '#ff5d73');
  else if (k === 2) inn = bg('#fff3d6') + rect(-iw * .4, ih * .18, iw * .8, ih * .32, '#7aa6d8', 0, 0) + circ(-iw * .2, ih * .02, ih * .17, '#f2c9a0', 3) + circ(iw * .2, 0, ih * .19, '#c98a5e', 3);
  else if (k === 3) inn = bg('#fffdf6') + rect(-iw * .38, -ih * .32, iw * .3, ih * .6, '#ff4f8b', 0, 0) + circ(iw * .15, -ih * .08, Math.min(iw, ih) * .22, '#5ec4f0', 0) + rect(-iw * .1, ih * .16, iw * .46, ih * .14, '#ffd23f', 0, 0);
  else inn = bg('#e9f7ff') + line(0, ih * .4, 0, -ih * .05, 4, '#3f9a54') + circ(0, -ih * .12, Math.min(iw, ih) * .14, '#ff8fb1', 3) + circ(0, -ih * .12, Math.min(iw, ih) * .05, '#ffd23f', 0);
  return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, col, 6, 5) + inn + rect(-iw / 2, -ih / 2, iw, ih, 'none', 0, 3));
}
function dPoster(x, y, w, h, bg, str = '', r = 0, fg = '#fff', size = 36, deco = '') { const tape = (tx, a) => G(tr(tx, -h / 2, 1, a), rect(-22, -9, 44, 18, 'rgba(255,255,235,.8)', 2, 0)); return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, bg, 6, 5) + deco + (str ? dtx(0, h * .32, str, size, fg) : '') + tape(-w / 2 + 12, -30) + tape(w / 2 - 12, 30)); }
// étagère + objets
function dBooks(x, y, n = 5, seed = 1) { const r = rng(seed); let s = '', cx = x; for (let i = 0; i < n; i++) { const h = 54 + r() * 36, w = 18 + r() * 12, c = PAL[Math.floor(r() * 9)]; s += rect(cx, y - h, w, h, c, 3, 4) + line(cx + 4, y - h + 14, cx + w - 4, y - h + 14, 3, 'rgba(255,255,255,.6)'); cx += w + 2; } return s; }
const dJar = (x, y, c = '#ffd23f') => rect(x - 22, y - 60, 44, 60, 'rgba(225,245,255,.85)', 10, 4) + rect(x - 17, y - 34, 34, 30, c, 6, 0) + rect(x - 24, y - 72, 48, 16, '#b07a4a', 4, 4);
const dTrophy = (x, y) => path(`M${x - 26} ${y - 80}h52q0 46 -26 50q-26 -4 -26 -50Z`, '#ffc93a', 4) + rect(x - 6, y - 30, 12, 18, '#e0a020', 0, 3) + rect(x - 20, y - 14, 40, 14, '#8a5a3a', 3, 4) + path(`M${x - 26} ${y - 72}q-20 4 -8 22M${x + 26} ${y - 72}q20 4 8 22`, 'none', 4);
const dPotSmall = (x, y, t = 0, c = '#d9825b') => G(tr(x, y - 34, 1, wave(t, .4, 5, x * .01)), path('M0 0C-30 -20 -42 -56 -16 -66C-10 -40 -4 -20 0 0ZM0 0C26 -26 40 -50 24 -78C6 -58 0 -30 0 0Z', '#6dbb7a', 4)) + path(`M${x - 24} ${y}l-6 -36h60l-6 36Z`, c, 4);
const dMug = (x, y, c = '#ff8fb1', t = -1) => (t >= 0 ? steam(x, y - 50, t, .45) : '') + rect(x - 22, y - 44, 44, 44, c, 8, 4) + path(`M${x + 22} ${y - 34}q18 0 18 14q0 14 -18 14`, 'none', 5);
const dGlobe = (x, y) => rect(x - 22, y - 12, 44, 12, '#8a5a3a', 3, 4) + line(x, y - 12, x, y - 30, 5) + circ(x, y - 66, 38, '#5ec4f0', 5) + path(`M${x - 28} ${y - 80}q14 -14 28 2q-6 18 -20 16q-12 -6 -8 -18ZM${x + 6} ${y - 52}q16 -10 22 6q-8 14 -20 8Z`, '#7be07b', 3);
const dDuck = (x, y) => ell(x, y - 22, 30, 22, '#ffd23f', 4) + circ(x + 18, y - 50, 16, '#ffd23f', 4) + path(`M${x + 32} ${y - 52}l16 4l-16 5Z`, '#ff8a3d', 3) + circ(x + 22, y - 54, 3, OL, 0);
function dShelf(x, y, w, items = 'bpjb', seed = 1, t = 0) {
  let s = ''; const n = items.length, sl = w / n;
  [...items].forEach((c, i) => { const cx = x + sl * i + sl / 2, col = PAL[(seed * 3 + i) % 9];
    s += c === 'b' ? dBooks(cx - sl * .38, y, Math.max(2, Math.floor(sl / 30)), seed + i) : c === 'p' ? dPotSmall(cx, y, t) : c === 'j' ? dJar(cx, y, col) : c === 't' ? dTrophy(cx, y) : c === 'm' ? dMug(cx, y, col) : c === 'g' ? dGlobe(cx, y) : c === 'd' ? dDuck(cx, y) : ''; });
  return s + rect(x, y, w, 18, '#b07a4a', 4, 4) + path(`M${x + 30} ${y + 18}v26l26 -26M${x + w - 30} ${y + 18}v26l-26 -26`, 'none', 5);
}
// lampes
function dPendant(x, y, t, c = '#ff8a3d', cone = 1) { const a = wave(t, .3, 3, x * .003); return G(`translate(${x} ${-M}) rotate(${f1(a)})`, (cone ? path(`M-50 ${y + M + 54}L-200 ${y + M + 480}L200 ${y + M + 480}L50 ${y + M + 54}Z`, 'rgba(255,246,200,.22)', 0) : '') + line(0, 0, 0, y + M, 4) + path(`M-62 ${y + M + 52}Q-56 ${y + M} 0 ${y + M}Q56 ${y + M} 62 ${y + M + 52}Z`, c, 5) + ell(0, y + M + 54, 22, 9, '#fff6c8', 3)); }
const dSconce = (x, y, t) => glow(x, y, 120, '#fff3c0', .5 + .06 * Math.sin(t * 4 + x)) + rect(x - 10, y + 10, 20, 30, '#c9a26a', 4, 4) + path(`M${x - 34} ${y + 12}L${x + 34} ${y + 12}L${x + 22} ${y - 34}L${x - 22} ${y - 34}Z`, '#fff1c8', 4);
// fenêtre avec vue (ciel, nuage qui passe, immeubles, arbre) + rideaux qui ondulent
function dWindow(x, y, w, h, t, o = {}) {
  const id = 'wv' + (_gid++), r = rng(o.seed || 3), N = o.night;
  let v = grad(N ? '#1d2350' : (o.sky1 || '#9fd6ff'), N ? '#3a4486' : (o.sky2 || '#eaf7ff'), x, y, w, h);
  v += N ? circ(x + w * .74, y + h * .2, Math.min(w, h) * .08, '#fff6d6', 0) : cloud(x + ((t * 26 + (o.seed || 0) * 60) % (w + 300)) - 150, y + h * .2, Math.min(w, h) / 700, '#fff');
  for (let i = 0; i < 5; i++) { const bw = w * (.18 + r() * .12), bh = h * (.25 + r() * .3), bx = x + i * w * .22 - 12; v += rect(bx, y + h - bh, bw, bh, N ? '#2a3366' : ['#cfd8e2', '#e7c9a0', '#bcd7c4', '#f0b8a8'][i % 4], 0, 3); for (let k = 0; k < 3; k++) v += rect(bx + bw * .2, y + h - bh + 14 + k * 26, bw * .25, 12, N && r() > .5 ? '#ffe9a0' : 'rgba(255,255,255,.7)', 0, 0); }
  if (!o.noTree) v += circ(x + w * .85, y + h * .82, w * .2, '#6cc46c', 4) + circ(x + w * .7, y + h * .9, w * .14, '#5fb85f', 4);
  let s = `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${v}</g>`;
  s += rect(x, y, w, h, 'none', 6, 22, '#fffdf6') + rect(x - 11, y - 11, w + 22, h + 22, 'none', 8, 5) + line(x + w / 2, y, x + w / 2, y + h, 12, '#fffdf6') + line(x, y + h * .45, x + w, y + h * .45, 12, '#fffdf6') + rect(x - 30, y + h + 6, w + 60, 24, '#fffdf6', 6, 5);
  if (o.curt !== 0) { const c = o.curt || '#ff8fb1', cw = w * .26, sw = wave(t, .25, 12); s += line(x - 90, y - 46, x + w + 90, y - 46, 8) + circ(x - 92, y - 46, 12, '#c9a26a', 4) + circ(x + w + 92, y - 46, 12, '#c9a26a', 4);
    s += path(`M${x - 80} ${y - 46}H${x + cw}Q${x + cw * .4 + sw} ${y + h * .5} ${x + cw * .5 + sw} ${y + h + 50}H${x - 80}Z`, c, 5) + path(`M${x + w + 80} ${y - 46}H${x + w - cw}Q${x + w - cw * .4 - sw} ${y + h * .5} ${x + w - cw * .5 - sw} ${y + h + 50}H${x + w + 80}Z`, c, 5);
    s += path(`M${x - 20} ${y - 40}Q${x - 10 + sw * .5} ${y + h * .5} ${x - 4 + sw} ${y + h + 44}M${x + w + 20} ${y - 40}Q${x + w + 10 - sw * .5} ${y + h * .5} ${x + w + 4 - sw} ${y + h + 44}`, 'none', 4, 'rgba(0,0,0,.18)'); }
  return s;
}
// sol : tapis, objets posés
const dRug = (x, y, w, h, c1, c2) => ell(x, y, w, h, c1, 5) + ell(x, y, w * .8, h * .72, 'none', 5, c2) + ell(x, y, w * .5, h * .42, c2, 0) + ell(x, y, w * .22, h * .18, c1, 0);
const dShoes = (x, y, c = '#e2463a') => [0, 74].map(o => path(`M${x - 70 + o} ${y}q0 -32 24 -32q14 18 40 22q8 10 4 10Z`, c, 4) + line(x - 68 + o, y - 4, x - 4 + o, y - 4, 4, '#fff')).join('');
const dBag = (x, y, c = '#4d7cf0') => path(`M${x - 36} ${y - 110}q36 -50 72 0`, 'none', 8) + rect(x - 62, y - 112, 124, 112, c, 26, 5) + rect(x - 42, y - 62, 84, 44, shade(c, .25), 10, 4);
const dBin = (x, y, s = 1, c = '#7aa6d8') => G(tr(x, y, s), path('M-50 0L-60 -120L60 -120L50 0Z', c, 5) + rect(-68, -138, 136, 22, shade(c, -.15), 6, 5) + line(-22, -100, -18, -18, 4, 'rgba(0,0,0,.2)') + line(22, -100, 18, -18, 4, 'rgba(0,0,0,.2)'));
const dBall = (x, y, r = 40, c = '#ff8a3d') => circ(x, y - r, r, c, 5) + path(`M${x - r} ${y - r}Q${x} ${y - r * .4} ${x + r} ${y - r}M${x} ${y - 2 * r}V${y}`, 'none', 4);
function dPlantBig(x, y, s, t, c = '#d9825b') { let l = ''; for (let i = 0; i < 7; i++) { const a = -150 + i * 20 + wave(t, .3, 5, i * .2); l += G(`rotate(${f1(a + 90)})`, path('M0 0C-30 -60 -26 -170 0 -230C26 -170 30 -60 0 0Z', i % 2 ? '#5aa76a' : '#6dbb7a', 5) + line(0, -10, 0, -200, 3, 'rgba(0,0,0,.18)')); } return G(tr(x, y, s), G('translate(0 -120)', l) + path('M-70 0L-84 -130L84 -130L70 0Z', c, 5) + rect(-92, -150, 184, 30, shade(c, -.12), 8, 5)); }
// extérieur
function dTower(x, y, w, h, c, seed = 1, o = {}) {
  const r = rng(seed), N = o.night; let s = rect(x, y - h, w, h, c, 4) + rect(x - 10, y - h - 24, w + 20, 28, shade(c, -.12), 4, 5);
  if (r() > .5) s += line(x + w * .7, y - h - 24, x + w * .7, y - h - 110, 5) + line(x + w * .7 - 24, y - h - 80, x + w * .7 + 24, y - h - 80, 4);
  const shopH = o.shop ? 200 : 0, cols = Math.max(2, Math.floor(w / 95)), cw = (w - 24) / cols, rows = Math.floor((h - shopH - 50) / 118);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const wx = x + 12 + i * cw + 10, wy = y - h + 36 + j * 118, ww = cw - 20, lit = r() > .62;
    s += rect(wx, wy, ww, 70, lit ? '#ffe9a0' : (N ? '#2a3366' : '#cfe8ff'), 4, 4);
    if (r() > .6) s += path(`M${wx - 6} ${wy}h${ww + 12}l-8 22h${-ww + 4}Z`, PAL[Math.floor(r() * 9)], 3);
    else if (j % 2 && r() > .4) s += rect(wx - 8, wy + 58, ww + 16, 14, '#fffdf6', 3, 4) + line(wx, wy + 72, wx, wy + 84, 4) + line(wx + ww, wy + 72, wx + ww, wy + 84, 4);
    if (r() > .82) s += circ(wx + 14, wy + 62, 12, '#6cc46c', 3) + circ(wx + 30, wy + 64, 10, '#ff8fb1', 3); }
  if (o.shop) { const sy = y - shopH, ac = o.awn || PAL[seed % 9]; s += rect(x, sy, w, shopH, shade(c, -.08), 0, 5) + rect(x + 20, sy + 70, w * .55, shopH - 70, N ? '#ffe9a0' : '#dff1ff', 4, 5) + rect(x + w * .62, sy + 80, w * .3, shopH - 80, '#8a5a3a', 4, 5) + circ(x + w * .66, sy + 140, 5, '#ffd23f', 0);
    let d = ''; const n = Math.max(3, Math.floor(w / 60)); for (let i = 0; i < n; i++) d += `M${x + i * w / n} ${sy}h${w / n / 2}v40h${-w / n / 2}Z`; s += rect(x - 6, sy, w + 12, 40, '#fff', 0, 5) + path(d, ac, 0) + rect(x - 6, sy, w + 12, 40, 'none', 0, 5);
    if (o.sign) s += rect(x + w / 2 - 90, sy - 46, 180, 40, '#fffdf6', 8, 4) + dtx(x + w / 2, sy - 16, o.sign, 26); }
  return s;
}
function dSkyline(y, col = '#c9d6e8', seed = 9) { const r = rng(seed); let d = `M${-M} ${y}`, x = -M; while (x < W + M) { const h = 120 + r() * 300, w = 80 + r() * 140; d += `V${y - h}H${x + w}`; x += w; } return path(d + `V${y}Z`, col, 0); }
const dLamppost = (x, y, s = 1, on = 0) => G(tr(x, y, s), (on ? glow(60, -520, 160, '#fff3c0', .55) : '') + rect(-16, -20, 32, 20, '#3f4650', 4, 4) + line(0, -20, 0, -500, 12, '#3f4650') + path('M0 -500Q0 -540 50 -540', 'none', 10, '#3f4650') + path('M30 -540L90 -540L80 -510L40 -510Z', '#3f4650', 4) + ell(60, -508, 18, 7, on ? '#fff6c8' : '#e8e8e8', 3));
const dSign = (x, y, str, c = '#36a85a', s = 1) => G(tr(x, y, s), line(0, 0, 0, -300, 10, '#8a939e') + rect(-110, -380, 220, 90, c, 12, 5) + dtx(0, -322, str, 34, '#fff'));
const dHydrant = (x, y) => rect(x - 26, y - 80, 52, 80, '#e2463a', 10, 4) + rect(x - 36, y - 56, 72, 16, '#e2463a', 6, 4) + path(`M${x - 28} ${y - 80}q28 -34 56 0Z`, '#e2463a', 4);
const dBush = (x, y, s = 1, c = '#5fb85f') => G(tr(x, y, s), circ(-50, -40, 50, c, 5) + circ(40, -46, 56, shade(c, .12), 5) + circ(0, -70, 56, c, 5) + circ(-20, -60, 10, '#ff8fb1', 0) + circ(30, -80, 10, '#fff', 0));
function dFlowers(x, y, n = 6, seed = 1, t = 0) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const fx = x + i * 34 + r() * 10, h = 40 + r() * 40, a = wave(t, .5, 6, i * .3); s += G(tr(fx, y, 1, a), line(0, 0, 0, -h, 4, '#3f9a54') + circ(0, -h, 13, PAL[Math.floor(r() * 9)], 3) + circ(0, -h, 4, '#ffd23f', 0)); } return s; }
const dBird = (x, y, s, t, ph = 0) => { const f = Math.sin(t * 14 + ph) * 18; return G(tr(x, y, s), path(`M-40 ${f1(f)}Q-20 -10 0 4Q20 -10 40 ${f1(f)}`, 'none', 6)); };
function dBirds(t, n = 3, y = 260, seed = 2, sp = 90) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = ((t * sp * (1 + r() * .5) + r() * 1600) % 1700) - 300; s += dBird(x, y + r() * 140 + Math.sin(t * 2 + i) * 12, .7 + r() * .4, t, i * 2); } return s; }
const dPine = (x, y, s, t) => G(tr(x, y, s, wave(t, .3, 1.5, x * .01)), rect(-16, -80, 32, 80, '#8a5a3a', 6) + path('M0 -420L120 -200L60 -200L150 -60L-150 -60L-60 -200L-120 -200Z', '#3f9a54'));
const dFence = (x0, x1, y, c = '#fffdf6') => { let s = rect(x0, y - 90, x1 - x0, 16, c, 3, 4) + rect(x0, y - 40, x1 - x0, 16, c, 3, 4); for (let x = x0; x < x1; x += 50) s += path(`M${x} ${y}V${y - 120}l15 -18l15 18V${y}Z`, c, 4); return s; };
const dBench = (x, y, s = 1, c = '#c58e55') => G(tr(x, y, s), rect(-140, -100, 280, 22, c, 6, 5) + rect(-140, -64, 280, 22, c, 6, 5) + rect(-150, -30, 300, 22, shade(c, -.1), 6, 5) + line(-120, -8, -120, 0, 10) + line(120, -8, 120, 0, 10));
function dWalkers(t, y, n = 3, s = .42, seed = 0) { let o = ''; for (let i = 0; i < n; i++) { const dir = i % 2 ? 1 : -1, x = (((i * 520 + t * (55 + i * 18) * dir) % 1700) + 1700) % 1700 - 300; o += adultX(i + seed, { x, y, s, expr: 'happy', walk: 3, flip: dir < 0 ? 1 : 0 }, t); } return o; }
const dTrafficLight = (x, y, t) => { const g = Math.floor(t / 1.2) % 2; return line(x, y, x, y - 420, 10, '#3f4650') + rect(x - 34, y - 560, 68, 160, '#3f4650', 14, 5) + circ(x, y - 520, 20, g ? '#ff6b6b' : '#5a2a2a', 3) + circ(x, y - 450, 20, g ? '#2a4a2a' : '#7be07b', 3); };
// premier plan flou (3e couche) — en bas de cadre, sous les pieds : ne cache aucun visage
const dFg = (svg, px = 9) => blur(px, svg);

// ---------- décors vivants (RICHES : fond lointain voilé / plan moyen détaillé / premier plan flou en bas de cadre) ----------
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff');
function treeB(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c')); }
function kidsBg(t, y = 1150, n = 4) { let s = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; s += kidX(i, { x, y, s: .45, expr: 'happy', walk: 3, flip: i % 2 }, t); } return s; }
const flagWave = (x, y, t, cols = ['#4d7cf0', '#fff', '#e2463a']) => { const w = wave(t, 1.2, 10); return line(x, y, x, y - 300, 8, '#8a939e') + cols.map((c, i) => path(`M${x + i * 40} ${y - 300 + (i ? w * i * .3 : 0)}q20 ${-w * .5} 40 ${w * .3}v80q-20 ${w * .5} -40 ${-w * .3}Z`, c, 4)).join(''); };
function schoolyard(t) {
  let s = SKY(t) + dSkyline(1000, '#cfdcec', 4) + wash(.25, '#e6f6ff') + dBirds(t, 3, 180, 5);
  s += path('M-60 586L190 470L440 586Z', '#e7c9a0') + wallClock(190, 535, 36, t) + flagWave(470, 586, t);
  s += dTower(-140, 1180, 660, 600, '#f0d9b5', 11, { shop: 1, sign: 'ÉCOLE', awn: '#e2463a' }) + dTower(560, 1180, 700, 470, '#e8c9a0', 12);
  s += line(905, 1180, 905, 790, 12, '#8a939e') + rect(850, 740, 140, 90, '#fff', 8, 5) + rect(895, 770, 50, 34, 'none', 0, 4, '#e2463a') + ell(920, 838, 34, 9, 'none', 6, '#ff8a3d');
  s += dPine(-30, 1200, .8, t) + treeB(1000, 1200, .9, t) + dBush(520, 1200, .8) + dFence(600, 860, 1200);
  s += rect(-M, 1180, W + 2 * M, 1500, '#c9b8a0', 0, 0) + path('M480 1300h120v50h-120ZM470 1350h140v60h-140ZM455 1410h80v70h-80ZM535 1410h80v70h-80Z', 'none', 5, 'rgba(255,255,255,.75)') + dtx(540, 1338, '1', 30, '#fff');
  s += dBench(110, 1290, .7) + dBag(110, 1240, '#ff8fb1') + dBall(650, 1300, 30) + dLamppost(1040, 1260, .8) + kidsBg(t, 1230, 3);
  return s + dFg(dBush(40, 1960, 1.7) + dBush(1060, 1990, 1.5, '#4fa64f') + dFlowers(700, 1930, 6, 3, t));
}
function photoStudio(t) { let s = grad('#3a5f9a', '#24406e', -M, -M, W + 2 * M, H + 2 * M); const r = rng(5); for (let i = 0; i < 14; i++) s += op(.18, circ(r() * W, r() * 1300, 80 + r() * 140, '#8fb6ea', 0));
  return s + path(`M-${M} 1250Q${CX} 1180 ${W + M} 1250L${W + M} ${H + M}L-${M} ${H + M}Z`, '#2c4a7c', 0) + G(tr(110, 520), rect(-70, -110, 140, 220, '#f4f4f4', 12) + line(0, 110, 0, 760, 10)) + glow(110, 520, 260, '#fff6d6', .35 + .1 * Math.sin(t * 9)); }
function bathroom2(t) {
  let s = tiles('#cfeaf0', '#b2d6de', 110) + rect(-M, 170, W + 2 * M, 44, '#5ec4f0', 0, 5) + wash(.12);
  s += dSconce(55, 330, t) + dSconce(1025, 330, t) + rect(1000, 700, 70, 14, '#c9ced6', 6, 4) + G(tr(1035, 714, 1, wave(t, .4, 2)), rect(-40, 0, 80, 300, '#ff8fb1', 10, 5) + line(-40, 240, 40, 240, 6, '#fff') + line(-40, 260, 40, 260, 6, '#fff'));
  s += G(tr(40, 900), rect(-10, -40, 20, 30, '#c9ced6', 4, 4) + circ(0, 20, 46, '#fff', 5) + circ(0, 20, 14, '#e6e2d6', 4)) + dOutlet(1030, 1150);
  const id = 'mr' + (_gid++); let refl = grad('#e6f6ff', '#b9dcef', 170, 270, 740, 940);
  refl += op(.55, rect(170, 270, 140, 940, '#ffc2d6', 0, 0) + [0, 1, 2].map(i => line(200 + i * 40, 270, 200 + i * 40, 1210, 6, '#ff8fb1')).join('')) + op(.45, dWindow(700, 320, 170, 200, t, { curt: 0, noTree: 1, seed: 7 })) + op(.35, tiles('#cfeaf0', '#b2d6de', 110, 170, 1050, 740, 160));
  s += rect(140, 240, 800, 1000, '#f1c27d', 30) + `<defs><clipPath id="${id}"><rect x="170" y="270" width="740" height="940" rx="18"/></clipPath></defs><g clip-path="url(#${id})">${refl}</g>` + rect(170, 270, 740, 940, 'none', 18, 5);
  s += line(220, 360, 360, 280, 14, 'rgba(255,255,255,.7)') + line(250, 420, 420, 300, 8, 'rgba(255,255,255,.5)') + line(780, 1150, 880, 1080, 10, 'rgba(255,255,255,.5)');
  s += rect(-M, 1300, W + 2 * M, H, '#fffdf6', 0, 5) + rect(-M, 1290, W + 2 * M, 34, '#e9eef2', 6, 5) + [80, 330, 750, 1000].map(x => rect(x - 110, 1370, 220, 500, 'none', 14, 5) + circ(x + (x < CX ? 80 : -80), 1450, 10, '#c9ced6', 4)).join('');
  s += sink(CX, 1320);
  const dk = (t * .8) % 1; s += op(1 - dk * .3, path(`M${CX - 110} ${1262 + dk * 90}c6 10 10 16 10 22a10 10 0 1 1 -20 0c0 -6 4 -12 10 -22Z`, '#8fd0ff', 3));
  s += G(tr(280, 1300), rect(-28, -70, 56, 70, 'rgba(225,245,255,.9)', 10, 4) + G('rotate(-12)', rect(-14, -150, 12, 100, '#5ec4f0', 5, 3)) + G('rotate(14)', rect(2, -150, 12, 100, '#ff8fb1', 5, 3)));
  s += G(tr(800, 1300), rect(-30, -90, 60, 90, '#7be07b', 12, 4) + rect(-8, -120, 16, 32, '#fff', 3, 4) + line(-8, -116, -30, -116, 6)) + G(tr(890, 1294, 1, -6), path('M-60 -14H40L60 -6L40 2H-60Z', '#fff', 4) + rect(-60, -14, 30, 16, '#e2463a', 0, 0)) + dDuck(980, 1300);
  return s + dFg(G(tr(60, 1880), rect(-160, -240, 320, 480, '#ff8fb1', 40, 5) + line(-160, -120, 160, -120, 10, '#fff')) + G(tr(1020, 1860), circ(0, 0, 130, '#7be07b', 5) + circ(-40, -30, 30, '#fff', 0)));
}
function dentist(t) {
  let s = grad('#e6f7f5', '#c9ece7', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 860, W + 2 * M, 400, '#bfe6df', 0, 0) + rect(-M, 846, W + 2 * M, 22, '#fffdf6', 0, 5) + dBase(1250);
  s += dWindow(640, 250, 340, 370, t, { curt: '#7fd3c4', seed: 4 }) + wallClock(100, 170, 50, t);
  s += dPoster(200, 400, 200, 260, '#fff', '2 MIN !', -3, SX.acc, 34, toothChar(0, -30, .45, t, { expr: 'happy' })) + dFrame(420, 300, 130, 100, 3, '#e0a020') + dFrame(420, 430, 130, 100, 0, '#e0a020');
  const fl = .75 + .25 * (Math.sin(t * 23) > -.6 ? 1 : 0); s += rect(430, 570, 190, 140, '#2b3a4a', 10, 5) + op(fl, [0, 1, 2, 3, 4].map(i => rect(452 + i * 30, 600, 22, 34, '#e8f4ff', 5, 0) + rect(452 + i * 30, 646, 22, 34, '#e8f4ff', 5, 0)).join(''));
  s += rect(860, 900, 260, 350, '#fffdf6', 10, 5) + [0, 1, 2].map(i => line(860, 1000 + i * 90, 1120, 1000 + i * 90, 5) + rect(960, 960 + i * 90, 60, 12, '#c9ced6', 6, 3)).join('') + dJar(900, 900, '#fff') + G(tr(960, 900), rect(-16, -80, 32, 80, '#36c5b4', 8, 4) + rect(-10, -96, 20, 18, '#fff', 4, 4)) + toothChar(1040, 860, .32, t, { expr: 'happy' });
  s += dFloor(1250, '#d8e2e6') + dentalChair(260, 1240, .9, 1, t) + G(tr(110, 1120), rect(-80, -10, 160, 18, '#c9ced6', 4, 4) + line(-50, -10, -30, -40, 5) + line(-10, -10, 0, -44, 5) + line(30, -10, 50, -40, 5) + line(0, 8, 0, 130, 8, '#9aa3ad'));
  s += dBin(600, 1270, .6, '#ffd23f') + dPlantBig(1000, 1265, .7, t);
  return s + dFg(G(tr(1000, 1880), rect(-110, -180, 220, 220, 'rgba(225,245,255,.9)', 20, 5) + circ(-30, -60, 40, '#fff', 4) + circ(30, -80, 40, '#fff', 4) + circ(0, -20, 40, '#fff', 4)) + G(tr(70, 1900, 1, -12), rect(-30, -300, 60, 300, '#36c5b4', 20, 5)));
}
function classroom2(t) {
  let s = grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 920, W + 2 * M, 340, '#f7c98a', 0, 0) + rect(-M, 906, W + 2 * M, 22, '#c58e55', 0, 5) + dBase(1250, '#c58e55');
  s += 'ABCDEFGHIJKL'.split('').map((c, i) => G(tr(50 + i * 90, 145, 1, (i % 2 ? 4 : -4)), rect(-34, -34, 68, 68, PAL[i % 9], 10, 4) + dtx(0, 16, c, 44, '#fff'))).join('') + line(-M, 108, W + M, 108, 4, '#c58e55');
  s += rect(200, 230, 680, 420, '#3c5a48', 18) + rect(218, 248, 644, 384, '#456b55', 10, 0) + rect(260, 650, 560, 16, '#8a6a4a', 4, 4) + rect(320, 636, 40, 14, '#fff', 3, 0) + rect(700, 636, 50, 14, '#ff8fb1', 3, 0);
  s += ftext(540, 420, 'SCIENCES', { size: 56, fill: 'rgba(255,255,255,.8)', stroke: 'none' }) + op(.7, path('M280 560q30 -60 60 0t60 0M700 300l40 40l40 -40', 'none', 5, '#fff') + dtx(760, 590, '2+2=4', 34, '#fff') + G(tr(320, 330, .6), toothChar(0, 0, .5, t, { expr: 'happy' })));
  s += dWindow(-60, 270, 200, 420, t, { curt: '#7be07b', seed: 6 }) + dPotSmall(40, 708, t);
  s += dPoster(1000, 380, 170, 210, '#bfe6ff', 'MONDE', 4, OL, 26, path('M-60 -60q30 -20 50 10q-10 40 -40 30ZM10 -40q40 -10 50 20q-10 30 -40 20ZM-20 20q20 0 30 30q-20 10 -30 -10Z', '#7be07b', 3)) + wallClock(1000, 170, 50, t);
  s += dShelf(890, 720, 200, 'gb', 3, t);
  s += [40, 140].map((x, i) => circ(x, 760, 9, '#c58e55', 4) + dBag(x, 900, ['#ff8fb1', '#ffd23f'][i])).join('') + dOutlet(170, 1180);
  s += dFloor(1250, '#c49a6c') + desk(150, 1265, .6) + desk(930, 1265, .6) + dBall(1030, 1300, 26, '#e2463a');
  return s + dFg(G(tr(220, 1860), rect(-420, -60, 840, 80, '#d9a066', 10, 5) + G(tr(200, -60), rect(-30, -80, 60, 80, '#5ec4f0', 8, 4) + line(-14, -80, -20, -140, 8, '#ffd23f') + line(10, -80, 18, -150, 8, '#e2463a')) + G(tr(-150, -60), rect(-90, -20, 180, 20, '#fff', 3, 4))));
}
function auditorium(t) {
  let s = grad('#1b2850', '#0e1530', -M, -M, W + 2 * M, H + 2 * M);
  for (let i = 0; i < 6; i++) s += op(.12, path(`M${100 + i * 180} -100L${40 + i * 180 + Math.sin(t + i) * 60} 1300L${200 + i * 180 + Math.sin(t + i) * 60} 1300Z`, '#fff6c8', 0));
  s += line(-M, 60, W + M, 60, 14, '#59616c') + [120, 330, 540, 750, 960].map((x, i) => G(tr(x, 70, 1, 20 * Math.sin(t * .8 + i)), rect(-24, 0, 48, 56, '#3a3f4a', 8, 4) + ell(0, 58, 20, 8, '#fff6c8', 3))).join('');
  s += rect(150, 120, 780, 70, '#e2463a', 12, 5) + dtx(540, 168, 'CONGRÈS MONDIAL DU SOURIRE', 34, '#fff');
  s += rect(120, 560, 840, 520, '#f4f4f4', 12) + G(tr(CX, 830, .55), gapBig(0, 0, 1, t, { open: .4 }));
  for (let i = 0; i < 7; i++) s += G(tr(70 + i * 157, 520 + Math.sin(t * 4 + i) * 6), line(0, 0, 0, -120, 5, '#ccc') + rect(0, -120, 80, 50, ['#e2463a', '#4d7cf0', '#ffd23f', '#36a85a', '#fff', '#ff8a3d', '#b56cff'][i], 4, 4));
  for (const sd of [-1, 1]) { const x0 = sd < 0 ? -M : 960, w = sd < 0 ? M + 120 : M + 120; let d = ''; for (let k = 0; k < 6; k++) d += `M${sd < 0 ? 120 - k * 30 : 960 + k * 30} 0V1240`;
    s += rect(x0, -M, w, 1940 + M, '#b3202e', 0, 5) + path(d, 'none', 5, 'rgba(0,0,0,.25)') + path(`M${sd < 0 ? 120 : 960} 300q${-sd * 60} 40 ${-sd * 150} 20`, 'none', 10, '#ffd23f'); }
  s += path(`M-${M} -${M}H${W + M}V40Q${W * .75} 120 ${CX} 40Q${W * .25} 120 -${M} 40Z`, '#b3202e', 5);
  s += G(tr(110, 1240), path('M-80 0L-60 -230L60 -230L80 0Z', '#3a3f4a', 5) + circ(0, -130, 34, '#fff', 4) + toothChar(0, -130, .18, t, { expr: 'happy' }) + path('M30 -230q10 -60 -20 -90', 'none', 5, '#999') + ell(-6, -320, 12, 16, '#2b2b33', 3));
  s += rect(-M, 1150, W + 2 * M, 100, '#140d24', 0, 0);
  const r = rng(8); for (let i = 0; i < 14; i++) { const x = 30 + i * 78 + r() * 20, y = 1170 + (i % 2) * 30 + Math.sin(t * 3 + i) * 4; s += circ(x, y, 30, '#2a2140', 4) + (Math.sin(t * 5 + i * 7) > .93 ? glow(x, y - 30, 70, '#fff', .9) + circ(x + 10, y - 30, 10, '#fff', 0) : ''); }
  for (let i = 0; i < 12; i++) s += circ(20 + i * 95, 1244, 9, Math.floor(t * 6 + i) % 3 === 0 ? '#ffd23f' : '#5a4a2a', 3);
  return s + rect(-M, 1250, W + 2 * M, 900, '#2a1f3d', 0, 0);
}
function cantine(t) {
  let s = tiles('#fde7c2', '#f2d29c', 100) + rect(-M, 760, W + 2 * M, 60, '#e2463a', 0, 0) + wash(.1);
  s += rect(60, 280, 300, 380, '#3c3c44', 14, 5) + rect(76, 296, 268, 348, '#4a4a54', 8, 0) + dtx(210, 360, 'MENU', 48, '#ffd23f') + ['Purée', 'Spaghettis', 'Yaourt', 'Pomme'].map((m, i) => dtx(110, 430 + i * 56, '• ' + m, 32, '#fff', 'start')).join('');
  s += wallClock(700, 200, 46, t) + dPendant(220, 150, t, '#ff8a3d', 0) + dPendant(930, 150, t, '#36c5b4', 0);
  s += dPoster(930, 360, 200, 220, '#fff', '5 FRUITS', 3, '#36a85a', 30, circ(-40, -30, 30, '#e2463a', 4) + circ(20, -40, 26, '#ffd23f', 4) + circ(50, 10, 22, '#ff8a3d', 4) + circ(-10, 20, 24, '#7be07b', 4));
  s += rect(560, 560, 520, 220, '#cfd8e2', 10) + steam(700, 560, t) + steam(900, 560, t + .4) + person({ age: 'adult', x: 820, y: 900, s: .55, hair: 'bun', hairColor: '#d9d9de', shirt: '#fff', apron: '#7aa6d8', expr: 'happy', seed: 61 }, t);
  s += rect(560, 676, 520, 30, 'rgba(225,245,255,.55)', 4, 4) + ['#ffd23f', '#7be07b', '#ff8a3d', '#fff'].map((c, i) => rect(590 + i * 120, 720, 100, 44, '#c9ced6', 6, 4) + ell(640 + i * 120, 726, 40, 12, c, 3)).join('');
  s += [0, 1, 2, 3, 4, 5].map(i => rect(20, 1230 - i * 16, 200, 14, '#ff8fb1', 4, 4)).join('') + G(tr(1020, 1230), rect(-50, -110, 100, 110, 'rgba(225,245,255,.8)', 12, 5) + rect(-46, -60, 92, 56, '#8fd0ff', 8, 0) + path('M50 -90q30 0 30 30t-30 30', 'none', 6));
  s += dFloor(1250, '#b8c4cc') + dBin(940, 1300, .6, '#36a85a');
  return s + rect(-M, 1240, W + 2 * M, 40, '#9aa3ad', 0, 0) + dFg(G(tr(900, 1880), rect(-260, -60, 520, 120, '#ff8fb1', 20, 5) + ell(-100, -50, 90, 30, '#fff', 4) + ell(-100, -54, 60, 18, '#ffd23f', 0) + circ(110, -90, 54, '#e2463a', 5)));
}
function xmas(t) {
  let s = dStripes('#ffe0c2', '#ffd6b4', 1250, 50) + wash(.1) + dWindow(90, 300, 300, 380, t, { night: 1, curt: '#e2463a', noTree: 1 });
  for (let i = 0; i < 16; i++) s += circ(110 + (i * 53) % 260, 300 + ((i * 97 + t * 120) % 380), 6, '#fff', 0);
  let gd = ''; for (let i = 0; i < 4; i++) gd += `M${-100 + i * 320} 150Q${60 + i * 320} 230 ${220 + i * 320} 150`; s += path(gd, 'none', 14, '#3f9a54');
  for (let i = 0; i < 16; i++) { const x = -60 + i * 80, y = 150 + 50 * Math.sin(((x + 100) % 320) / 320 * Math.PI); s += circ(x, y + 10, 11, Math.sin(t * 6 + i * 1.7) > 0 ? PAL[i % 9] : '#7a6a5a', 3); }
  s += G(tr(560, 250), circ(0, 0, 62, 'none', 26, '#3f9a54') + circ(0, 0, 62, 'none', 4, '#2d7a40') + path('M-20 50l20 -16l20 16l-6 30l-14 -14l-14 14Z', '#e2463a', 4) + circ(-30, -40, 8, '#e2463a', 3) + circ(36, -20, 8, '#e2463a', 3));
  s += dFrame(520, 690, 110, 130, 2, '#c38a52', -3);
  s += rect(-80, 900, 340, 350, '#c9b8a8', 6, 5) + rect(-100, 880, 380, 34, '#8a5a3a', 6, 5) + rect(-10, 1020, 200, 230, '#2b2420', 10, 5) + flames(10, 1240, 160, 140 + 20 * Math.sin(t * 9), t) + dBricks(-80, 914, 340, 100, '#d2a080');
  s += [40, 140, 220].map((x, i) => G(tr(x, 914, 1, wave(t, .4, 3, i)), path('M-18 0V70q0 20 20 20h30q10 0 10 -14q0 -12 -14 -12h-10V0Z', ['#e2463a', '#36a85a', '#fff'][i], 4) + rect(-22, -4, 44, 20, '#fff', 4, 4))).join('') + rect(200, 830, 14, 50, '#fff', 4, 4) + ell(207, 822, 6, 12 + 2 * Math.sin(t * 15), '#ffd23f', 0);
  s += G(tr(880, 1250), path('M0 -760L190 -420L110 -420L240 -120L-240 -120L-110 -420L-190 -420Z', '#3f9a54') + rect(-30, -120, 60, 80, '#8a5a3a', 6) + path('M0 -820L18 -780L60 -778L26 -752L38 -712L0 -736L-38 -712L-26 -752L-60 -778L-18 -780Z', '#ffd23f', 5));
  for (let i = 0; i < 9; i++) s += circ(880 + Math.sin(i * 2.1) * (60 + i * 18), 650 + i * 52, 13, Math.sin(t * 8 + i) > 0 ? ['#ff4f8b', '#ffd23f', '#5ec4f0'][i % 3] : '#7a6a5a', 4);
  s += dFloor(1250, '#9a5a3a') + dRug(560, 1380, 420, 70, '#c0392b', '#ffd23f');
  const gift = (x, y, w, h, c, c2) => rect(x - w / 2, y - h, w, h, c, 6, 5) + rect(x - 8, y - h, 16, h, c2, 0, 0) + path(`M${x} ${y - h}q-30 -30 -40 0ZM${x} ${y - h}q30 -30 40 0Z`, c2, 4);
  s += gift(990, 1290, 110, 80, '#4d7cf0', '#fff') + gift(1060, 1280, 80, 110, '#ffd23f', '#e2463a') + G(tr(760, 1300), rect(-60, -70, 120, 90, '#e2463a', 8) + rect(-10, -70, 20, 90, '#ffd23f', 0, 0));
  return s + dFg(gift(110, 1960, 300, 240, '#36a85a', '#ffd23f') + G(tr(1000, 1900, 1, 18), path('M0 0V-300q0 -60 60 -60t60 60', 'none', 40, '#fff') + path('M0 -40V-80M0 -160V-200M20 -330l30 -20', 'none', 40, '#e2463a')));
}
function bedroomTeen(t) {
  let s = dDots('#e2d8ff', '#d4c6fb') + wash(.08) + dWindow(660, 260, 320, 380, t, { curt: '#b56cff', seed: 2 });
  let fl = 'M-60 120'; for (let i = 0; i < 6; i++) fl += `Q${-60 + i * 220 + 110} 200 ${-60 + (i + 1) * 220} 120`; s += path(fl, 'none', 4);
  for (let i = 0; i < 26; i++) { const x = -40 + i * 50, y = 120 + 60 * Math.sin((i % 4.4) / 4.4 * Math.PI); s += circ(x, y + 10, 10, Math.sin(t * 5 + i * 2.3) > -.2 ? ['#fff6a6', '#ffb3d1', '#a6f0ff'][i % 3] : '#9a8fb8', 3); }
  s += rect(110, 300, 240, 320, '#ff8fb1', 12) + ftext(230, 480, 'POP', { size: 70, fill: '#fff' }) + dPoster(470, 330, 140, 180, '#5ec4f0', '★', 6, '#fff', 60) + dFrame(470, 560, 120, 120, 1, '#fff');
  s += dShelf(40, 820, 300, 'bdbt', 5, t) + wallClock(560, 760, 40, t);
  s += rect(-120, 1000, 460, 30, '#c58e55', 6, 5) + line(-60, 1030, -60, 1250, 12) + line(300, 1030, 300, 1250, 12) + G(tr(120, 1000), rect(-90, -110, 180, 110, '#2b2b33', 10, 4) + rect(-78, -98, 156, 86, '#a6f0ff', 4, 0) + path('M-110 0H110', 'none', 10, '#9aa3ad')) + dMug(270, 1000, '#ffd23f', t) + G(tr(-40, 1000), line(0, 0, 0, -150, 8, '#59616c') + path('M0 -150l60 -40', 'none', 8, '#59616c') + path('M40 -210l60 30l-20 30l-60 -30Z', '#ffd23f', 4));
  s += dOutlet(400, 1180) + dFloor(1250, '#b48a6a') + dRug(560, 1400, 400, 80, '#ff8fb1', '#fff') + dShoes(830, 1320, '#4d7cf0') + G(tr(980, 1290, 1, -14), path('M0 0l-30 -20q-60 0 -60 -60q0 -40 60 -40q40 0 46 30l40 -260l20 0l-30 280q30 40 -20 70Z', '#e0a020', 5)) + path('M200 1330q30 -50 80 -40q40 -30 90 10q20 30 -20 40H210Z', '#7be07b', 5);
  s += glow(CX, 700, 500, '#fff6d6', .2 + .05 * Math.sin(t * 5));
  return s + dFg(G(tr(110, 1860), circ(0, -40, 120, '#c98a5e', 5) + circ(-90, -150, 44, '#c98a5e', 5) + circ(90, -150, 44, '#c98a5e', 5) + circ(-36, -60, 10, OL, 0) + circ(36, -60, 10, OL, 0) + ell(0, -20, 30, 20, '#e8b890', 4)));
}
function cityBill(t, poster) {
  let s = SKY(t, '#ffb7c9', '#ffe9d6') + dSkyline(1000, '#f3cfd6', 3) + wash(.18, '#ffe9e0') + dBirds(t, 3, 150, 7);
  const signs = ['PIZZA', 'FLEURS', 'LIVRES', 'CAFÉ', 'MODE', 'GLACES', 'BIO', 'PHARMA'];
  for (let i = -2; i < 6; i++) s += dTower(-200 + i * 300, 1250, 260, 560 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4], 20 + i, { shop: 1, sign: signs[i + 2] });
  s += dTrafficLight(600, 1310, t);
  s += rect(110, 330, 860, 640, '#2b2420', 18) + rect(130, 350, 820, 600, '#fff3f7', 10, 0) + (poster || '') + line(340, 970, 340, 1250, 18, '#59616c') + line(740, 970, 740, 1250, 18, '#59616c') + [300, 780].map(x => line(x, 330, x + 30, 290, 8, '#59616c') + path(`M${x + 10} 280h50l-10 24h-30Z`, '#59616c', 4)).join('');
  s += rect(-M, 1250, W + 2 * M, 90, '#cfd3d8', 0, 0) + line(-M, 1340, W + M, 1340, 10, '#8a939e') + rect(-M, 1340, W + 2 * M, 900, '#a7adb5', 0, 0); for (let x = -M; x < W + M; x += 220) s += rect(x, 1560, 120, 16, '#fff', 4, 0);
  s += dWalkers(t, 1300, 3, .36, 1) + dLamppost(50, 1300, .9, 0) + dLamppost(1030, 1300, .9, 0) + dHydrant(470, 1310) + dBin(170, 1310, .55, '#36a85a') + bikeS(880, 1270, .55) + G(tr(940, 1310), rect(-40, -60, 80, 60, '#d9825b', 6, 4)) + treeB(940, 1250, .45, t);
  s += car(((t * 500) % 1900) - 400, 1500, .8, t, { color: '#4d7cf0' }) + car(1500 - ((t * 380) % 1900), 1640, .8, t, { color: '#ffd23f', flip: 1 });
  return s + dFg(dPlantBig(60, 2000, 1.5, t) + dLamppost(1110, 2300, 2.2, 0));
}
function runway(t) {
  let s = grad('#2a1838', '#120a1c', -M, -M, W + 2 * M, H + 2 * M);
  for (let i = 0; i < 18; i++) { const h = (t * .7 + i * .13) % 1; s += rect(-200 + i * 85, 120, 60, 560, `hsl(${f1((h * 360 + i * 20) % 360)},70%,${i % 2 ? 35 : 28}%)`, 6, 0); }
  s += op(.25, ftext(CX, 520, 'MODE', { size: 300, fill: '#fff', stroke: 'none' })) + rect(-M, 680, W + 2 * M, 30, '#0c0612', 0, 0);
  s += line(-M, 70, W + M, 70, 16, '#59616c') + [100, 300, 780, 980].map((x, i) => G(tr(x, 80, 1, (x < CX ? -1 : 1) * (20 + 10 * Math.sin(t * 2 + i))), rect(-26, 0, 52, 70, '#3a3f4a', 8, 4) + ell(0, 72, 22, 8, '#fff6c8', 3))).join('');
  for (let i = 0; i < 5; i++) s += op(.14, path(`M${CX + (i - 2) * 260} -100L${CX + (i - 2) * 120 - 180} 1400L${CX + (i - 2) * 120 + 180} 1400Z`, '#fff', 0));
  s += path(`M${CX - 110} 700L${CX + 110} 700L${CX + 520} ${H + 100}L${CX - 520} ${H + 100}Z`, '#f4f4f4', 6) + op(.25, ell(CX, 1100, 120, 400, '#fff', 0));
  for (let i = 0; i < 14; i++) { const k = i / 14, on = Math.floor(t * 10 - i) % 4 === 0; for (const sd of [-1, 1]) s += circ(CX + sd * (110 + 410 * k), 700 + (H - 700) * k, 6 + 8 * k, on ? '#fff6a6' : '#6a5a3a', 0); }
  for (let sd of [-1, 1]) for (let i = 0; i < 5; i++) { const x = CX + sd * (230 + i * 75), y = 900 + i * 110; s += circ(x, y, 34 + i * 4, '#3a2a4a', 0) + rect(x - 40 - i * 4, y + 20, 80 + i * 8, 140, '#3a2a4a', 30, 0) + (i % 2 ? rect(x - sd * 30 - 10, y + 10, 22, 34, '#a6f0ff', 4, 0) : '') + (Math.sin(t * 7 + i * 3 + sd) > .85 ? glow(x + sd * 10, y - 30, 70, '#fff', .9) + circ(x + sd * 10, y - 30, 12, '#fff', 0) : ''); }
  let ph = ''; for (let i = 0; i < 5; i++) { const x = 60 + i * 240; ph += circ(x, 1850, 90, '#1a1024', 0) + rect(x - 50, 1740, 100, 70, '#2b2b33', 12, 0) + circ(x, 1775, 26, '#5ec4f0', 0) + (Math.sin(t * 6 + i * 2.5) > .9 ? glow(x, 1760, 120, '#fff', .9) : ''); }
  return s + dFg(ph, 8);
}
function museum(t) {
  let s = grad('#f6f1e7', '#ece4d4', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 1000, W + 2 * M, 250, '#e3d6c0', 0, 0) + rect(-M, 990, W + 2 * M, 18, '#c38a52', 0, 5) + rect(-M, 80, W + 2 * M, 30, '#e8dcc4', 0, 5) + dBase(1250, '#c38a52');
  s += dFloor(1250, '#b98a5e');
  s += rect(-60, 360, 200, 260, '#c38a52') + rect(-40, 380, 160, 220, '#9fd3a7', 0, 4) + rect(940, 380, 200, 240, '#c38a52') + rect(960, 400, 160, 200, '#f7c8a0', 0, 4) + circ(40, 470, 40, '#ffd23f', 0) + path('M960 560q60 -80 160 -20V600H960Z', '#e2463a', 0);
  s += dFrame(60, 200, 150, 150, 3, '#e0a020') + dFrame(1010, 220, 140, 170, 4, '#e0a020') + dFrame(70, 790, 140, 120, 0, '#e0a020') + dFrame(1010, 800, 130, 120, 1, '#e0a020') + [40, 1040].map(x => rect(x - 36, 650, 72, 26, '#fffdf6', 4, 3)).join('');
  s += dtx(160, 60, 'SALLE 3', 30, '#8a7a6a') + G(tr(980, 120), rect(-10, -30, 20, 30, '#59616c', 4, 3) + G(`rotate(${f1(20 * Math.sin(t * .8))})`, rect(-60, 0, 90, 44, '#fffdf6', 10, 4) + circ(-54, 22, 12, '#2b2b33', 3) + circ(20, 10, 5, Math.sin(t * 4) > 0 ? '#e2463a' : '#7a2a2a', 0)));
  s += G(tr(990, 1260), rect(-70, -260, 140, 260, '#fffdf6', 6, 5) + rect(-84, -276, 168, 22, '#e9e2d4', 4, 5) + path('M-50 -276q0 -60 50 -60t50 60Z', '#d9d4ca', 5) + circ(0, -380, 52, '#e9e5dc', 5) + path('M-20 -390h10M10 -390h10', 'none', 4));
  s += G(tr(80, 1260), rect(-50, -200, 100, 200, '#fffdf6', 6, 5) + path('M-30 -200q-30 -60 0 -110h60q30 50 0 110Z', '#5ec4f0', 5) + path('M-30 -260h60', 'none', 5, '#fff'));
  s += [300, 780].map(x => line(x, 1260, x, 1140, 10, '#e0a020') + circ(x, 1136, 14, '#e0a020', 4) + ell(x, 1262, 28, 8, '#e0a020', 4)).join('') + path('M300 1150Q540 1230 780 1150', 'none', 14, '#b3202e');
  s += dBench(CX, 1320, .9, '#8a5a3a');
  s += op(.25, path(`M${CX - 80} 120L${CX + 80} 120L${CX + 380} 1100L${CX - 380} 1100Z`, '#fff6c8', 0)) + rect(CX - 60, 100, 120, 40, '#59616c', 10);
  for (let i = 0; i < 8; i++) { const k = (t * .15 + i / 8) % 1; s += op(.6 * Math.sin(k * Math.PI), circ(CX - 150 + (i * 47) % 300 + Math.sin(t + i) * 20, 200 + k * 800, 4, '#fff', 0)); }
  return s + dFg(G(tr(30, 1950), line(0, 0, 0, -380, 30, '#e0a020') + circ(0, -390, 40, '#e0a020', 5)) + path('M30 1580Q300 1700 700 1640', 'none', 34, '#b3202e'));
}
function cafeWin(x, y, w, h, t, seed) {
  const id = 'cw' + (_gid++); let v = grad('#ffe9c2', '#ffd9a0', x, y, w, h) + rect(x, y + h * .2, w, 14, '#b07a4a', 0, 4);
  for (let i = 0; i < 6; i++) v += rect(x + 20 + i * w / 6, y + h * .2 - 40, 30, 40, PAL[(i + seed) % 9], 6, 3);
  v += dPendant(x + w * .3, y + 60, t, '#ff8a3d', 0) + dPendant(x + w * .75, y + 40, t + 1, '#36c5b4', 0);
  const r = rng(seed); for (let i = 0; i < 2; i++) { const px = x + w * (.25 + i * .5), py = y + h * .7; v += op(.55, circ(px, py - 40, 32, ['#c98a5e', '#f2c9a0'][i], 4) + rect(px - 44, py - 10, 88, 110, ['#7aa6d8', '#b56cff'][i], 30, 4) + G(tr(px + 34, py + 20 + Math.sin(t * 3 + i) * 6), dMug(0, 0, '#fff'))); }
  v += rect(x, y + h * .78, w, 30, '#8a5a3a', 0, 4);
  return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${v}</g>` + rect(x, y, w, h, 'none', 6, 22, '#fffdf6') + rect(x - 11, y - 11, w + 22, h + 22, 'none', 8, 5) + line(x + w / 2, y, x + w / 2, y + h, 12, '#fffdf6') + line(x + 30, y + 40, x + 90, y + 10, 10, 'rgba(255,255,255,.6)');
}
function cafe(t) {
  let s = SKY(t, '#9fe0ff', '#fff4dc') + dBricks(-M, -M, W + 2 * M, M + 310, '#e7a98a') + wash(.12);
  s += [[60, 20], [420, 20], [780, 20]].map(([x, y], i) => rect(x, y, 240, 200, '#cfe8ff', 6, 5) + line(x + 120, y, x + 120, y + 200, 6) + rect(x - 10, y + 200, 260, 40, '#8a5a3a', 6, 5) + dFlowers(x + 20, y + 204, 6, i + 2, t)).join('');
  s += rect(-M, 300, W + 2 * M, 950, '#f0d9b5', 0, 0) + dBricks(-M, 900, W + 2 * M, 350, '#d9a080') + cafeWin(90, 420, 380, 460, t, 1) + cafeWin(610, 420, 380, 460, t, 4);
  s += rect(482, 520, 116, 730, '#8a5a3a', 8, 5) + rect(500, 560, 80, 220, '#ffe9c2', 6, 4) + circ(580, 900, 8, '#ffd23f', 3) + G(tr(540, 820, 1, wave(t, .7, 8)), line(-20, -40, 0, -10, 3) + line(20, -40, 0, -10, 3) + rect(-46, -10, 92, 40, '#36a85a', 8, 4) + dtx(0, 20, 'OUVERT', 20, '#fff'));
  for (let i = 0; i < 8; i++) s += path(`M${-40 + i * 150} 300L${110 + i * 150} 300L${100 + i * 150} 380Q${35 + i * 150} 410 ${-30 + i * 150} 380Z`, i % 2 ? '#fff' : '#ff4f8b', 5);
  let sl = 'M-40 400'; for (let i = 0; i < 6; i++) sl += `Q${-40 + i * 200 + 100} 440 ${-40 + (i + 1) * 200} 400`; s += path(sl, 'none', 3);
  for (let i = 0; i < 24; i++) { const x = -30 + i * 50, y = 400 + 30 * Math.sin(((i * 50) % 200) / 200 * Math.PI); s += circ(x, y + 8, 8, Math.sin(t * 4 + i * 1.9) > -.3 ? '#fff6a6' : '#b8a070', 3); }
  s += G(tr(420, 882), ell(0, 0, 50, 26, '#59616c', 4) + circ(36, -30, 22, '#59616c', 4) + path('M24 -46l4 -16l10 12ZM42 -48l8 -14l6 14Z', '#59616c', 3) + path(`M-46 0q-30 ${-20 + 20 * Math.sin(t * 3)} -20 -60`, 'none', 8, '#59616c'));
  s += wash(.14, '#fff4e6');
  s += dFloor(1250, '#d8c8b0') + plant(60, 1250, 1.1) + G(tr(1010, 1300), path('M-70 0L-40 -220H40L70 0', 'none', 8, '#8a5a3a') + rect(-56, -200, 112, 150, '#3c3c44', 6, 5) + dtx(0, -150, 'CROISSANT', 16, '#fff') + dtx(0, -110, '1 €', 30, '#ffd23f'));
  s += G(tr(540, 1290), ell(0, -120, 90, 18, '#fffdf6', 5) + line(0, -110, 0, 0, 8) + ell(0, 0, 40, 8, OL, 0) + dMug(-30, -126, '#ff4f8b', t) + dMug(34, -126, '#5ec4f0'));
  return s + dFg(dPlantBig(1080, 2000, 1.4, t));
}
function highway(t) {
  let s = SKY(t, '#9fd6ff', '#fff2d6') + dBirds(t, 3, 220, 9) + path(`M-${M} 1080L-100 820L200 1000L500 760L820 980L1100 800L${W + M} 1080Z`, '#c3d4e8', 0) + wash(.2, '#eaf4ff');
  s += [[180, 1010, .7], [900, 990, .8]].map(([x, y, sc], i) => G(tr(x, y, sc), path('M-8 0L-4 -320H4L8 0Z', '#fff', 4) + G(`translate(0 -320) rotate(${f1(t * 90 + i * 40)})`, [0, 120, 240].map(a => G(`rotate(${a})`, path('M-6 0Q-12 -90 0 -180Q12 -90 6 0Z', '#fff', 4))).join('') + circ(0, 0, 10, '#fff', 4)))).join('');
  s += path(`M-${M} 1150Q300 1050 600 1120T${W + M} 1100L${W + M} 1300L-${M} 1300Z`, '#8fd16a', 0) + path(`M-${M} 1190Q300 1110 600 1170T${W + M} 1150`, 'none', 22, '#7bc05a') + path(`M-${M} 1230Q300 1170 600 1220T${W + M} 1200`, 'none', 22, '#7bc05a');
  s += [[-20, 1130], [140, 1110]].map(([x, y]) => rect(x, y - 70, 90, 70, '#f0d9b5', 0, 4) + path(`M${x - 10} ${y - 70}L${x + 45} ${y - 120}L${x + 100} ${y - 70}Z`, '#e2463a', 4)).join('') + dFence(250, 420, 1150, '#fffdf6');
  s += [0, 1, 2].map(i => { const x = 760 + i * 120; return line(x, 1150, x, 900, 6, '#8a6a4a') + line(x - 30, 920, x + 30, 920, 5, '#8a6a4a'); }).join('') + path('M640 920Q700 960 760 920Q820 960 880 920Q940 960 1000 920Q1060 960 1120 920', 'none', 3);
  s += path(`M${CX - 90} 1180L${CX + 90} 1180L${CX + 700} ${H + 200}L${CX - 700} ${H + 200}Z`, '#59616c', 0) + path(`M${CX - 100} 1180L${CX - 720} ${H + 200}M${CX + 100} 1180L${CX + 720} ${H + 200}`, 'none', 14, '#d8dde2');
  for (let i = 0; i < 6; i++) { const k = ((t * .9 + i / 6) % 1), y = 1180 + k * k * 800; s += rect(CX - 6 - k * 20, y, 12 + k * 40, 30 + k * 60, '#fff', 0, 0); }
  for (let i = 0; i < 5; i++) { const k = ((t * .5 + i / 5) % 1), e = k * k, y = 1180 + e * 900; for (const sd of [-1, 1]) s += dPine(CX + sd * (160 + e * 1100), y, .12 + e * 1.1, t); }
  s += G(tr(860, 1180), line(0, 0, 0, -160, 8, '#8a939e') + rect(-80, -230, 160, 80, '#36a85a', 10, 4) + dtx(0, -180, 'SORTIE 12', 24, '#fff'));
  return s + fgGrass(60, 1960, 1.5, t) + fgGrass(1030, 1970, 1.4, t, '#5a8a30', 5);
}
function hallway(t) {
  let s = grad('#ffe7d0', '#ffd8b5', -M, -M, W + 2 * M, H + 2 * M); for (let i = -6; i < 16; i++) s += rect(i * 120, -M, 50, H + 2 * M, 'rgba(255,255,255,.3)', 0, 0);
  s += rect(-M, 900, W + 2 * M, 350, '#f4c79a', 0, 0) + rect(-M, 886, W + 2 * M, 22, '#c58e55', 0, 5) + [0, 1, 2, 3, 4, 5].map(i => rect(-80 + i * 220, 950, 170, 250, 'none', 8, 4, '#d9a676')).join('') + dBase(1250, '#c58e55');
  s += dPendant(540, 120, t, '#ffd23f', 1) + dFrame(140, 260, 120, 150, 2, '#c38a52', -3) + dFrame(300, 240, 110, 110, 0, '#c38a52', 2) + dFrame(950, 260, 120, 160, 4, '#c38a52', 3);
  s += G(tr(60, 1250), line(0, 0, 0, -620, 12, '#8a5a3a') + ell(0, 0, 70, 14, '#8a5a3a', 4) + line(-60, -560, 60, -560, 8, '#8a5a3a') + G(tr(-50, -560, 1, wave(t, .3, 2)), path('M0 0L-50 60L-60 300H50L40 60Z', '#7aa6d8', 5)) + G(tr(50, -560), path('M-36 0q36 -50 72 0Z', '#e2463a', 5) + rect(-50, -4, 100, 14, '#e2463a', 6, 4)) + G(tr(40, -540, 1, wave(t, .3, 3, .5)), rect(-14, 0, 28, 220, '#ffd23f', 8, 4)));
  s += rect(870, 680, 220, 570, '#a8724a', 8, 5) + rect(900, 720, 160, 220, 'none', 6, 4) + rect(900, 980, 160, 220, 'none', 6, 4) + circ(895, 980, 12, '#ffd23f', 4) + dSwitch(820, 920) + dOutlet(220, 1180);
  s += G(tr(310, 1100), rect(-160, -14, 320, 26, '#c58e55', 6, 5) + line(-130, 12, -130, 150, 10) + line(130, 12, 130, 150, 10) + ell(-60, -24, 50, 14, '#5ec4f0', 4) + G(tr(-60, -38), rect(-12, -6, 24, 12, '#ffd23f', 3, 3)) + G(tr(80, -14), rect(-10, -100, 20, 100, '#fff', 4, 4) + path('M-40 -100L40 -100L26 -160L-26 -160Z', '#ffe6a6', 4)) + glow(390, 1000, 130, '#fff3c0', .4));
  s += dFloor(1250, '#a87a55') + path('M380 1260L700 1260L900 1920H180Z', '#c0392b', 5) + path('M400 1300L680 1300M370 1400L720 1400M330 1560L780 1560', 'none', 8, '#ffd23f') + dShoes(740, 1300, '#4d7cf0') + plant(980, 1250, 1.1);
  s += G(tr(1000, 1320), rect(-40, -110, 80, 110, '#7aa6d8', 10, 5) + line(-14, -110, -30, -230, 8, '#e2463a') + path('M-30 -230q-20 0 -20 20', 'none', 8, '#e2463a') + line(14, -110, 24, -210, 8, '#36a85a'));
  const tw = wave(t, .6, 20); s += G(tr(240, 1330), ell(0, 0, 70, 32, '#ff8a3d', 4) + circ(-60, -30, 30, '#ff8a3d', 4) + path('M-82 -52l6 -26l14 18ZM-50 -56l10 -24l8 22Z', '#ff8a3d', 3) + path(`M66 0q40 ${-30 + tw} 20 -80`, 'none', 12, '#ff8a3d') + path('M-70 -32q4 4 8 0M-54 -32q4 4 8 0', 'none', 3));
  return s + glow(CX, 400, 500, '#fff6d6', .25) + dFg(G(tr(60, 1930, 1.8), dShoes(30, 0, '#36a85a')) + G(tr(1030, 1900), rect(-100, -260, 200, 260, '#d9a86c', 6, 5)));
}
function street(t, o = {}) {
  let s = grad(o.sky1 || '#9fd6ff', o.sky2 || '#e6f5ff', -M, -M, W + 2 * M, 1600) + cloud(((t * 24) % 1600) - 300, 200, 1.1, '#fff') + dSkyline(1000, '#d4dde8', 6) + wash(.18) + dBirds(t, 2, 140, 3);
  const signs = ['KIOSQUE', 'FLEURS', 'PIZZA', 'LIVRES', 'MODE', 'CAFÉ', 'BIO', 'GLACES'];
  for (let i = -2; i < 6; i++) s += dTower(-200 + i * 300, 1250, 260, 500 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4], 30 + i, { shop: 1, sign: signs[i + 2] });
  s += rect(-M, 1250, W + 2 * M, 90, '#cfd3d8', 0, 0) + line(-M, 1340, W + M, 1340, 10, '#8a939e') + rect(-M, 1340, W + 2 * M, 1400, '#a7adb5', 0, 0);
  s += dWalkers(t, 1300, 2, .36, 2) + dLamppost(60, 1300, .9) + dLamppost(1020, 1300, .9) + dBench(300, 1320, .6) + dBin(760, 1320, .55) + dHydrant(880, 1320) + treeB(160, 1300, .5, t) + dSign(960, 1320, 'CENTRE', '#4d7cf0', .6);
  return s + dFg(dLamppost(-60, 2300, 2.2) + dBush(1060, 2000, 1.6));
}
function shopWindow(t) {
  let s = street(t, { sky1: '#bfe3ff', sky2: '#fff4e0' }) + rect(80, 300, 920, 950, '#2b2420', 16) + rect(100, 320, 880, 910, '#fde9f0', 8, 0) + [...Array(11)].map((_, i) => rect(100 + i * 80, 320, 40, 910, 'rgba(255,79,139,.08)', 0, 0)).join('');
  s += [120, 780].map((x, j) => [0, 1, 2].map(i => rect(x, 520 + i * 220, 180, 14, '#fff', 4, 4) + (i === 1 ? dShoes(x + 90, 520 + i * 220, PAL[j * 3 + i]) : G(tr(x + 90, 520 + i * 220), path('M-40 0V-70h80V0Z', PAL[j * 3 + i + 2], 4) + path('M-24 -70q24 -40 48 0', 'none', 6)))).join('')).join('');
  s += line(300, 400, 780, 400, 8, '#c9ced6') + [0, 1, 2].map(i => G(tr(330 + i * 60, 400, 1, wave(t, .3, 3, i)), path('M0 0l-10 12h20Z', 'none', 3) + path('M-30 12h60l10 120h-80Z', PAL[i + 4], 4))).join('') + [0, 1].map(i => G(tr(680 + i * 60, 400, 1, wave(t, .3, 3, i + 2)), path('M0 0l-10 12h20Z', 'none', 3) + path('M-30 12h60l10 120h-80Z', PAL[i + 6], 4))).join('');
  s += [250, 540, 830].map(x => rect(x - 20, 320, 40, 30, '#59616c', 6, 3) + op(.25, path(`M${x - 16} 350L${x - 120} 1150L${x + 120} 1150L${x + 16} 350Z`, '#fff6c8', 0))).join('');
  s += rect(100, 1150, 880, 80, '#fff', 0, 5) + dPotSmall(160, 1150, t) + rect(80, 250, 920, 90, SX.acc, 14) + ftext(CX, 312, 'BOUTIQUE', { size: 54, fill: '#fff' });
  s += G(tr(240, 1080, 1, -10), circ(0, 0, 70, '#ffd23f', 5) + dtx(0, -6, 'SOLDES', 22, OL) + dtx(0, 26, '-50%', 30, '#e2463a'));
  return s + line(220, 360, 380, 330, 12, 'rgba(255,255,255,.7)') + line(820, 1100, 940, 1000, 12, 'rgba(255,255,255,.5)');
}

// ---------- accessoires ----------
function bikeS(x, y, s, r = 0, t = 0) { const w = t * 6; return G(tr(x, y, s, r), circ(-90, 0, 60, 'none', 10) + circ(90, 0, 60, 'none', 10) + line(-90 + 50 * Math.cos(w), 50 * Math.sin(w), -90 - 50 * Math.cos(w), -50 * Math.sin(w), 4) + line(90 + 50 * Math.cos(w), 50 * Math.sin(w), 90 - 50 * Math.cos(w), -50 * Math.sin(w), 4) +
  path('M-90 0L-20 -80L60 -80L90 0M-20 -80L0 0L60 -80M0 0L-90 0', 'none', 12, '#e2463a') + line(60, -80, 70, -120, 10) + line(50, -125, 95, -120, 10) + line(-30, -80, -40, -105, 10) + line(-65, -108, -15, -108, 12)); }
function camTripod(x, y, s) { return G(tr(x, y, s), line(0, 0, -140, 500, 14) + line(0, 0, 140, 500, 14) + line(0, 0, 0, 520, 14) + rect(-170, -150, 340, 200, '#3a3f4a', 30) + circ(0, -50, 80, '#2b2b33') + circ(0, -50, 46, '#5ec4f0', 6) + rect(90, -190, 70, 40, '#555', 8)); }
function coin(x, y, s, r = 0) { return G(tr(x, y, s, r), circ(0, 0, 50, '#ffc93a', 7) + circ(0, 0, 36, 'none', 4, '#e0a020') + text(0, 18, 'none', '€', '#b07a10', 52)); }
function fistUp(x, y, s, r = 0, sk = SKIN) { return G(tr(x, y, s, r), rect(-40, -10, 80, 70, sk, 26) + rect(-22, -70, 30, 70, sk, 15) + line(-36, 22, 34, 22, 4) + line(-36, 42, 34, 42, 4)); }
function booth(x, y, s) { return G(tr(x, y, s), rect(-110, -380, 220, 380, '#f4f4f4') + rect(-80, -330, 160, 140, '#bfe3f5', 0, 5) + rect(-130, -430, 260, 70, '#e2463a', 10) + ftext(0, -380, 'PÉAGE', { size: 40, fill: '#fff' })); }
function receipt(x, y, s, k, t) { const h = 120 + 1100 * k; let g = rect(-200, 0, 400, h, '#fffdf6', 6, 6) + ftext(0, 70, 'FACTURE', { size: 52, fill: SX.ink, stroke: 'none' });
  const lines = ['compliments × 3650', 'retard : 10 ans', 'intérêts : ♥♥♥', 'TOTAL : 1 MERCI'];
  lines.forEach((l, i) => { if (140 + i * 90 < h - 40) g += ftext(-170, 160 + i * 90, l, { size: 32, fill: i === 3 ? SX.acc : SX.ink, anchor: 'start', stroke: 'none' }); });
  for (let i = 0; i < 12; i++) g += path(`M${-200 + i * 33.3} ${h}l16.6 22l16.6 -22`, '#fffdf6', 0); return G(tr(x, y, s, wave(t, .7, 2)), g); }
function photoCard(inner, label) { return rect(-150, -170, 300, 300, '#9fe0ff', 8, 0) + rect(-150, 60, 300, 70, '#8fd16a', 0, 0) + inner + ftext(0, 190, label, { size: 40, fill: SX.ink, stroke: 'none' }); }
function formPaper(x, y, s, r, t) { return G(tr(x, y, s, r), rect(-150, -190, 300, 380, '#fffdf6', 10) + ftext(0, -120, 'AUTORISATION', { size: 34, fill: SX.ink, stroke: 'none' }) + ftext(0, -80, 'DE RIRE', { size: 34, fill: SX.acc, stroke: 'none' }) + [0, 1, 2, 3].map(i => line(-110, -20 + i * 45, 110, -20 + i * 45, 4, '#b8c4cc')).join('') + rect(-110, 140, 30, 30, '#fff', 4, 4)); }
const sweatDrops = (x, y, t) => sweatSpray(x, y, t, 4);
const fg = (svg) => blur(10, svg);

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, tête du héros en cut-out, sourire à trou, étoiles « débloqué », titre cinétique
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'dents') - .05; return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) + burst(CX, 1000, 300, t, .4, SX.acc, 16) +
    G(tr(CX, 1010, 1 + .03 * Math.sin(t * 6)), cutout(heroHead(0, 0, 190, { expr: t > K ? 'joy' : 'happy', gm: 'grin' }, t), 14)) + unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1085, 210, 110, t, K + .35, { label: 'sourire.png' }) +
    kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'AVOIR LES", CX, 415, t, .3, { size: 56 }) + kword('DENTS DU BONHEUR ?', CX, 540, t, K, { size: 68, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'dents') - .05, 'boom', .6], [at(1, 'dents'), 'sparkle', .6], [at(1, 'bonheur') + .1, 'glint', .7]] });
// B002 — « Tu as 9 ans » : papier + gobo, 9 ANS qui slamme, bouille de gamin
B(2, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => paper(SX.paper) + gobo(T, .12) + burst(CX, 560, 250, t, 0, SX.acc2, 14) + kword('9 ANS', CX, 560, t, .04, { size: 150, fill: '#fff' }) + cutout(heroHead(CX, 1010, 170, { expr: 'happy', gm: 'grin' }, t), 12) + popStars(CX, 1000, t, .2, 6, 260),
  sfx: [[0, 'whoosh', .5], [.04, 'boom', .5], [at(2, '9'), 'pop', .6], [.3, 'boing', .4]] });
// B003 — photographe : « SOURIS ! » … tu souris → flash, l'écart brille
B(3, { enter: 'none', trans: 'up', transD: .25, cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const S1 = at(3, 'souris'), S2 = at(3, 'souris', 2); return gridBg('#2a2440') + halftoneFade(SX.acc, .12, 1) + G(tr(790, 760, .72), cutout(camTripod(0, 0, 1), 10)) +
    cutout(heroHead(360, 980, 165, { expr: t > S2 ? 'wow' : 'worried', gm: t > S2 ? 'grin' : undefined, look: [1, 0] }, t), 12) + funTag(780, 470, 'SOURIS !', t, S1 - .05, { size: 64, bg: SX.acc }) + kthin('le photographe…', 300, 420, t, .05, { size: 46 }) +
    (t > S2 ? sparkle(375, 1040, .7 + .3 * Math.sin(t * 20), '#fff') + op(1 - seg(t, S2, S2 + .3), rect(-200, -200, W + 400, H + 400, '#fff', 0, 0)) : ''); },
  sfx: [[.05, 'pop_hi', .4], [at(3, 'souris') - .05, 'pop', .7], [at(3, 'souris', 2), 'shutter', 1], [at(3, 'souris', 2) + .1, 'glint', .7]] });
// B004a — cour d'école, jour de la photo : Kevin pointe ton sourire
B(4, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t) * 15 }, [{ z: 1.5, svg: schoolyard(t), haze: .08 }, { z: 1, svg: heroK({ x: 300, y: 1500, s: 1.35, expr: 'happy', gm: 'grin' }, t) + kevin({ x: 780, y: 1500, s: 1.35, expr: 'mock', flip: 1, armL: [190, 195] }, t) }, { z: .6, svg: fg(G(tr(CX, 1820), rect(-800, -120, 1600, 240, '#7bbf5a', 60))) }]) + funTag(780, 470, 'KEVIN', t, at(4, 'kevin'), { size: 50, bg: '#5fb85f' }) + markerArrow(560, 720, 340, 1010, t, at(4, 'demande'), { bend: 60, col: SX.acc }),
  sfx: [[0, 'school_bell', .4], [at(4, 'kevin'), 'pop', .6], [at(4, 'demande'), 'hmm', .5], [at(4, 'demande') + .1, 'scratch', .4]] });
// B004b — gag littéral : un VÉLO garé dans l'écart (la roue avant dans le trou), panneau P
B(4, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), shake: t > .5 && t < .7 ? 6 : 0 }),
  draw: (t, d, T) => { const k = eOutBack(seg(t, .05, .5)); return haze(.5, '#ffc2d6', blur(6, schoolyard(t))) + rays(t, CX, 900, 'rgba(255,255,255,.25)', 'rgba(255,255,255,0)', 18) + gapBig(CX, 960, 1.0, t, { open: .55 }) +
    bikeS(lerp(1400, CX + 110, k), 830, 1.35, -62, t * (1 - k)) + funTag(CX, 430, 'PARKING VÉLO', t, at(4, 'velo') - at(4, 'garer') + .1, { size: 60, bg: '#4d7cf0' }) + G(tr(170, 560), rect(-60, -60, 120, 120, '#4d7cf0', 18) + ftext(0, 36, 'P', { size: 100, fill: '#fff' }) + line(0, 60, 0, 300, 14, '#59616c')) + kevinHead(900, 640, 90, { expr: 'mock' }, t); },
  sfx: [[0, 'flash_hit', .5], [.05, 'whoosh', .6], [.5, 'thud', .7], [.55, 'boing', .5], [at(4, 'dents') - at(4, 'garer'), 'rimshot', .4]] }, at(4, 'garer') - .15);
// B005 — « Magnifique ! » : la photo de classe imprimée (vélo compris), tampon ironique
B(5, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const inner = rect(-330, -280, 660, 500, '#3a5f9a', 10, 0) + G(tr(0, 60), heroHead(0, -40, 170, { expr: 'happy', gm: 'grin' }, t)) + bikeS(60, 10, .25, -62) + ftext(0, 300, 'CLASSE DE CE2', { size: 38, fill: SX.ink, stroke: 'none' });
    return schoolyard(t) + card(CX, 860, 760, 700, inner, t, 0, { ry: lerp(18, 0, seg(t, 0, .4)), bg: '#fff' }) + stamp(CX, 470, 'MAGNIFIQUE', t, at(5, 'magnifique') - .05, SX.acc, -8); },
  sfx: [[0, 'printer', .4], [at(5, 'magnifique') - .05, 'thud', .8], [at(5, 'magnifique') + .2, 'rimshot', .5]] });
// B006 — salle de bain : gros plan bouche, l'espace entre les incisives cerné au marqueur
B(6, { enter: 'drop', cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => { const E = at(6, 'espace'), I = at(6, 'incisives'); return bathroom2(t) + gapBig(CX, 900, .95, t, { open: .35 }) + funBox(CX, 880, 130, 170, t, E, { label: 'espace.png', col: SX.acc }) +
    funTag(CX, 430, 'PETIT ESPACE', t, at(6, 'petit') - .05, { size: 60, bg: SX.cool }) + markerArrow(250, 1180, CX - 120, 920, t, I - .1, { bend: -60, col: SX.acc2 }) + markerArrow(830, 1180, CX + 120, 920, t, I - .05, { bend: 60, col: SX.acc2 }) + markerText('incisives', CX, 640, t, I, { size: 54 }); },
  sfx: [[0, 'whoosh', .5], [at(6, 'petit') - .05, 'pop', .6], [at(6, 'espace'), 'tick', .6], [at(6, 'incisives') - .1, 'scratch', .5]] });
// B007 — « Ça s'appelle un diastème » (plan concept) : deux dents-persos qui s'évitent, mot savant décodé
B(7, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const D = at(7, 'diasteme'), g = 60 + 80 * eOutBack(seg(t, .1, .6)); return paper('#e9f7ff') + gobo(T, .1) + toothChar(CX - g - 60, 980, 1.6, t, { expr: 'smug', r: -6 }) + toothChar(CX + g + 60, 980, 1.6, t, { expr: 'smug', r: 6 }) + motionLines(CX, 980, 3, 50, 90) +
    kword(scramble('DIASTÈME', t, D - .15, .4), CX, 470, t, D - .15, { size: 120, fill: SX.acc2 }) + kthin('(nom masculin, très chic)', CX, 600, t, D + .2, { size: 44, fill: SX.ink }); },
  sfx: [[0, 'whoosh', .5], [.3, 'boing', .5], [at(7, 'diasteme') - .15, 'typing', .5], [at(7, 'diasteme') + .3, 'ding', .6]] });
// B008 — chez le dentiste : « pas un problème médical », pouce levé, tampon RAS
B(8, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => dentist(t) + heroK({ x: 420, y: 1500, s: 1.35, expr: 'worried' }, t) + adultX(1, { x: 800, y: 1560, s: 1.22, expr: 'happy', shirt: '#fff', coat: 1, stetho: 1, flip: 1, armL: [250, 260], holdL: magnifier(0, 0, .6, 30) }, t) + (t > at(8, 'probleme') ? fistUp(700, 840, 1.1) : '') +
    funTag(CX, 430, 'MÉDICAL ?', t, at(8, 'automatiquement'), { size: 56, bg: SX.cool }) + stamp(CX, 600, 'RAS', t, at(8, 'medical') - .05, '#36a85a', -10),
  sfx: [[0, 'whoosh', .5], [at(8, 'automatiquement'), 'pop', .5], [at(8, 'probleme'), 'boing', .5], [at(8, 'medical') - .05, 'thud', .8]] });
// B009a — en classe : tout le monde se penche sur ta bouche avec des loupes
B(9, { enter: 'drop', cam: camHand(1.05, .5),
  draw: (t, d, T) => { let s = classroom2(t) + heroK({ x: CX, y: 1500, s: 1.35, expr: 'embarrassed', gm: 'grin' }, t);
    for (let i = 0; i < 4; i++) { const sd = i % 2 ? 1 : -1, x = CX + sd * (290 + (i > 1 ? 120 : 0)), y = 1540 + (i > 1 ? 80 : 0); s += kidX(i, { x, y, s: 1.05 + (i > 1 ? .15 : 0), expr: 'wow', flip: sd > 0 ? 1 : 0, rot: -sd * 10, armR: [-30, -40], holdR: magnifier(0, 0, .55, 0) }, t); }
    return s + funTag(CX, 430, 'SUJET D’ÉTUDE', t, at(9, 'devenu') - .05, { size: 54, bg: SX.acc2, fg: SX.ink }) + funBox(CX, 1090, 150, 90, t, at(9, 'classe'), { label: 'cas n°1', col: SX.acc }); },
  sfx: [[0, 'school_bell', .4], [at(9, 'classe'), 'tick', .6], [at(9, 'devenu') - .05, 'pop', .6], [at(9, 'sujet'), 'hmm', .5]] });
// B009b — RECHERCHE INTERNATIONALE : congrès mondial, drapeaux, ton sourire projeté sur écran géant
B(9, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const I = at(9, 'internationale') - at(9, 'recherche'); let s = auditorium(t);
    for (let i = 0; i < 3; i++) s += adultX(i, { x: 200 + i * 340, y: 1530, s: 1.0, expr: i === 1 ? 'wow' : 'shock', coat: 1, shirt: '#fff', glasses: true, armR: [-60, -80] }, t);
    return s + markerCircle(CX, 830, 80, 110, t, .25, { col: SX.acc2 }) + kword('RECHERCHE', CX, 330, t, .02, { size: 96, fill: '#fff' }) + kword('INTERNATIONALE', CX, 440, t, I - .05, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .5], [.02, 'boom', .5], [.25, 'scratch', .5], [at(9, 'internationale') - at(9, 'recherche'), 'tada', .6], [.8, 'shutter', .5]] }, at(9, 'recherche') - .15);
// B010a — cantine : un camarade, fourchette de spaghettis en l'air, pose LA question
B(10, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => cantine(t) + heroK({ x: 330, y: 1500, s: 1.35, expr: 'deadpan' }, t) + kidX(2, { x: 780, y: 1500, s: 1.35, expr: 'talk', flip: 1, armL: [230, 250] }, t) + G(tr(640, 900, 1, -20), line(0, 0, 0, -150, 8, '#c9ced6') + path('M-30 -150Q0 -230 30 -150', 'none', 18, '#ffd36b') + path('M-20 -140q10 60 -5 120M15 -140q-10 70 8 130', 'none', 8, '#ffd36b')) +
    rect(-M, 1240, W + 2 * M, 60, '#e8c9a0', 0, 0) + funTag(CX, 430, 'CANTINE', t, at(10, 'cantine') - .1, { size: 56, bg: '#ff8a3d' }) + (t > at(10, 'quelqu') ? qmark(860, 640, 1, SX.acc2) : ''),
  sfx: [[0, 'whoosh', .5], [at(10, 'cantine') - .1, 'pop', .6], [at(10, 'quelqu'), 'hmm', .5], [at(10, 'demande'), 'pop_hi', .4]] });
// B010b — gros plan : un spaghetti aspiré pile dans l'écart
B(10, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.05, 1.15, t / d), hand: .4 }),
  draw: (t, d, T) => { const k = seg(t, .05, d - .1), mx = CX, my = 900 + 260 * .36 + 10; let sp = `M${mx} ${my}`;
    for (let i = 1; i <= 10; i++) { const u = i / 10, px = lerp(mx, 1200, u * (1 - k * .8)), py = lerp(my, 1150, u * (1 - k * .8)) + Math.sin(u * 12 + t * 14) * 30 * (1 - k * .6); sp += `L${f1(px)} ${f1(py)}`; }
    return cantine(t) + heroHead(CX, 900, 260, { expr: 'annoyed', gm: 'grin' }, t) + `<path d="${sp}" fill="none" stroke="${OL}" stroke-width="22" stroke-linecap="round"/><path d="${sp}" fill="none" stroke="#ffd36b" stroke-width="10" stroke-linecap="round"/>` +
      kword('AU MILIEU ?', CX, 450, t, at(10, 'milieu') - at(10, 'spaghettis') - .1, { size: 96, fill: SX.acc2 }) + funTag(250, 1150, 'SLURP', t, .2, { size: 50, bg: SX.acc, r: -10 }); },
  sfx: [[.05, 'spray', .5], [.2, 'gulp', .6], [at(10, 'passent') - at(10, 'spaghettis'), 'squeak', .5], [at(10, 'milieu') - at(10, 'spaghettis') - .1, 'boing', .7]] }, at(10, 'spaghettis') - .15);
// B011a — Noël : sapin qui clignote, neige, le cousin approche une pièce
B(11, { enter: 'drop', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const k = seg(t, at(11, 'essaie'), d); return xmas(t) + heroK({ x: 330, y: 1500, s: 1.35, expr: 'worried', gm: 'grin', cap: '#e2463a' }, t) + kidX(1, { x: 700 - 80 * k, y: 1500, s: 1.3, expr: 'smugger', flip: 1, armL: [200, 190], holdL: coin(0, 0, .6) }, t) +
    funTag(CX, 430, 'NOËL', t, at(11, 'noel') - .1, { size: 60, bg: '#36a85a' }) + funTag(760, 600, 'LE COUSIN', t, at(11, 'cousin'), { size: 44, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'magic', .5], [at(11, 'noel') - .1, 'pop', .6], [at(11, 'cousin'), 'pop_hi', .5], [at(11, 'essaie'), 'tiptoe', .6]] });
// B011b — la pièce tient pile dans l'écart : TIRELIRE HUMAINE
B(11, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.05, 1.12, t / d) }),
  draw: (t, d, T) => { const r = 250, P = at(11, 'piece') - at(11, 'tenir'), k = eOutCubic(seg(t, P - .25, P)), cy = 880; return xmas(t) + heroHead(CX, cy, r, { expr: 'dizzy', gm: 'grin' }, t) +
    G(tr(CX, cy + r * (.05 + .27 * k)), rect(-r * .06, -r * .2, r * .12, r * .3, '#ffc93a', 8, 6) + line(0, -r * .17, 0, r * .07, 4, '#e0a020')) + (k >= 1 ? sparkle(CX + 50, cy + r * .2, .6 + .3 * Math.sin(t * 15), '#fff') + popStars(CX, cy + 60, t, P, 6, 220) : '') +
    funTag(CX, 460, 'TIRELIRE', t, P, { size: 66, bg: '#ffc93a', fg: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [at(11, 'piece') - at(11, 'tenir'), 'kaching', .8], [at(11, 'piece') - at(11, 'tenir') + .1, 'slot', .5], [at(11, 'dents') - at(11, 'tenir'), 'coins', .4]] }, at(11, 'tenir') - .15);
// B012 — selfie : écran du téléphone, lèvres ultra pincées, vérification au marqueur
B(12, { enter: 'whip', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const S = at(12, 'selfie'), L = at(12, 'levres'), F = at(12, 'fermees');
    const scr = heroHead(0, -30, 120, { expr: 'worried', gm: 'lips' }, t) + circ(0, 245, 34, '#fff', 6) + (t > F ? ftext(0, -230, 'OK ✓', { size: 44, fill: '#36a85a', stroke: 'none' }) : '');
    return bedroomTeen(t) + G(tr(CX, 850), phoneBig(0, 0, 1.25, -4 + Math.sin(t * 3) * 2, scr)) + markerCircle(CX - 2, 855, 70, 40, t, L, { col: SX.acc }) + funTag(CX, 400, 'SELFIE', t, S - .05, { size: 54, bg: SX.acc }) + funTag(850, 1050, 'FERMÉES', t, F, { size: 46, bg: '#36a85a', r: 6 }) +
      (t > S && t < S + .25 ? op(1 - seg(t, S, S + .25), rect(-200, -200, W + 400, H + 400, '#fff', 0, 0)) : ''); },
  sfx: [[at(12, 'selfie') - .05, 'pop', .5], [at(12, 'selfie'), 'shutter', .9], [at(12, 'verifies'), 'hmm', .5], [at(12, 'levres'), 'scratch', .5], [at(12, 'fermees'), 'ding', .6]] });
// B013 — « Puis tu grandis » : toise sur le chambranle, le héros pousse d'un coup
B(13, { enter: 'none', trans: 'up', transD: .2, cam: () => ({ z: 1.03 }),
  draw: (t, d, T) => { const k = eOutBack(seg(t, .05, at(13, 'grandis') + .15)); return hallway(t) + doorFrame(760, 1250, 1100, 5) + heroA({ x: 480, y: 1530, s: lerp(.8, 1.2, k), expr: 'wow', gm: 'grin' }, t) + motionLines(480, lerp(1000, 900, k), 3, 60, 90) +
    funTag(820, 480, `${counter(9, 25, t, .05, .6)} ANS`, t, .02, { size: 60, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh_up', .7], [.1, 'squeak', .4], [at(13, 'grandis'), 'boing', .6], [at(13, 'grandis') + .15, 'pop', .4]] });
// B014a — ville : affiche de mode géante… la mannequin a TON sourire. Double take.
B(14, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Dc = at(14, 'decouvres'); const poster = modelHead(CX, 700, 210, { expr: 'joy', gm: 'grin' }, t) + ftext(CX, 430, 'NOUVELLE COLLECTION', { size: 40, fill: SX.ink, stroke: 'none' }) + sparkle(CX - 40, 800, .5 + .2 * Math.sin(t * 9), '#fff');
    return cityBill(t, poster) + heroA({ x: lerp(1000, 760, seg(t, 0, Dc)), y: 1560, s: 1.15, expr: t > Dc ? 'jawdrop' : 'neutral', walk: t < Dc ? 3 : 0, look: [-1, -1], headTilt: -6 }, t) + funTag(330, 300, 'AFFICHE DE MODE', t, at(14, 'affiches'), { size: 42, bg: SX.acc }) + (t > Dc ? emark(860, 880, 1.2) : ''); },
  sfx: [[0, 'whoosh', .5], [at(14, 'affiches'), 'pop', .6], [at(14, 'decouvres'), 'gasp', .6], [at(14, 'decouvres') + .05, 'boing', .5]] });
// B014b — comparaison : toi = mannequin, écarts cerclés, MÊME SOURIRE
B(14, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const o = at(14, 'mannequins'), E = at(14, 'exactement') - o, Me = at(14, 'meme') - o, To = at(14, 'toi') - o; return cityBill(t, '') + G(tr(0, 0), card(290, 860, 430, 520, heroHead(0, -10, 150, { expr: t > To ? 'jawdrop' : 'happy', gm: t > To ? undefined : 'grin' }, t), t, 0, { ry: 0, bg: '#e6f6ff', r: -4 })) +
    card(790, 860, 430, 520, modelHead(0, -10, 150, { expr: 'joy', gm: 'grin' }, t), t, .1, { ry: 0, bg: '#fff3f7', r: 4 }) + G(tr(CX, 860), text(0, 40, OL, '=', '#fff', 150)) + markerCircle(290, 910, 70, 45, t, E, { col: SX.acc }) + markerCircle(790, 910, 70, 45, t, E + .15, { col: SX.acc }) +
    funTag(290, 560, 'TOI', t, .1, { size: 44, bg: SX.cool }) + funTag(790, 560, 'MANNEQUIN', t, .2, { size: 44, bg: SX.acc }) + kword('MÊME SOURIRE', CX, 400, t, Me - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [.1, 'pop_hi', .4], [at(14, 'exactement') - at(14, 'mannequins'), 'scratch', .5], [at(14, 'meme') - at(14, 'mannequins') - .05, 'boom', .5], [at(14, 'toi') - at(14, 'mannequins'), 'gasp', .6]] }, at(14, 'mannequins') - .15);
// B015 — défilé : la mannequin arrive, flashs, on SIGNE son sourire
B(15, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Sg = at(15, 'signature'), k = seg(t, 0, d); let sig = 'M-260 40'; for (let i = 0; i < 14; i++) sig += `q${30} ${i % 2 ? -110 : 110} ${40} ${i % 3 ? -10 : 30}`;
    return runway(t) + modelP({ x: CX, y: lerp(1400, 1520, k), s: lerp(.9, 1.15, k), expr: 'joy', gm: 'grin', walk: 2 }, t) + G(tr(CX, 560, 1, -6), markerPath(sig, t, Sg - .1, { d: .5, col: SX.acc2, w: 14 })) +
      kword('SIGNATURE', CX, 400, t, Sg - .05, { size: 104, fill: '#fff' }) + funTag(CX, 260, 'SOUDAIN…', t, at(15, 'soudain'), { size: 40, bg: SX.acc }); },
  sfx: [[0, 'shutter', .5], [at(15, 'soudain'), 'pop', .5], [at(15, 'appelle'), 'shutter', .5], [at(15, 'signature') - .1, 'scratch', .6], [at(15, 'signature'), 'sparkle', .6]] });
// B016 — « Du caractère » : gros plan mannequin, explosion BD
B(16, { enter: 'punch', flash: 1, cam: () => ({ z: 1.06, shake: 3 }),
  draw: (t, d, T) => runway(t) + burst(CX, 900, 380, t, 0, SX.acc, 16) + modelHead(CX, 900, 230, { expr: 'smugger', gm: 'grin' }, t) + funTag(CX, 450, 'CARACTÈRE', t, at(16, 'caractere') - .1, { size: 70, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 900, t, .1, 8, 340),
  sfx: [[0, 'flash_hit', .5], [at(16, 'caractere') - .1, 'boom', .5], [.3, 'shutter', .5]] });
// B017 — « Une beauté singulière » : couverture de magazine au kiosque
B(17, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const inner = rect(-300, -380, 600, 760, '#ffd6e4', 18, 0) + ftext(0, -270, 'MODE MAG', { size: 90, fill: SX.acc }) + G(tr(0, 0), modelHead(0, 0, 165, { expr: 'joy', gm: 'grin' }, t)) + ftext(-280, 300, 'Le sourire', { size: 36, fill: SX.ink, anchor: 'start', stroke: 'none' }) + ftext(-280, 345, "de l'année", { size: 36, fill: SX.ink, anchor: 'start', stroke: 'none' });
    return street(t, { sky1: '#ffd1dc', sky2: '#fff2e6' }) + card(CX, 920, 620, 780, inner, t, 0, { ry: lerp(25, 0, seg(t, 0, .6)), bg: '#fff' }) + sparkle(CX - 40, 1030, .6 + .3 * Math.sin(t * 10), '#fff') + sparkle(CX + 220, 600, .5, '#fff') +
      kthin('une beauté', CX, 330, t, at(17, 'beaute') - .1, { size: 56, fill: SX.ink }) + kword('SINGULIÈRE', CX, 430, t, at(17, 'singuliere') - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [.2, 'printer', .3], [at(17, 'beaute') - .1, 'sparkle', .5], [at(17, 'singuliere') - .05, 'boom', .5], [at(17, 'singuliere') + .3, 'angel', .4]] });
// B018 — « Attends. » : arrêt sur image, glitch, main levée, gros plan regard
B(18, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.08, 1.14, t / d) }),
  draw: (t, d, T) => glitch(street(0, { sky1: '#c9c9d1', sky2: '#eeeeee' }) + heroHead(CX, 880, 250, { expr: 'suspicious' }, t) + G(tr(930, 1060, 1, -10), rect(-60, -110, 120, 180, SKIN, 50) + rect(-60, -40, 120, 110, SKIN, 30)), T, 1 - seg(t, 0, .35)) +
    funTag(CX, 420, '❚❚ PAUSE', t, at(18, 'attends') - .1, { size: 60, bg: SX.ink, fg: '#fff' }) + letterbox(seg(t, 0, .3)),
  sfx: [[0, 'scratch', .8], [.05, 'rewind', .4], [at(18, 'attends') - .1, 'pop', .5], [at(18, 'attends') + .4, 'hmm', .5]] });
// B019 — flashback N&B : sur toi = une BLAGUE (Kevin et la cour hilares)
B(19, { enter: 'none', trans: 'glitch', transD: .25, cam: camHand(1.05, .4),
  draw: (t, d, T) => filmBW(schoolyard(t) + heroK({ x: 330, y: 1500, s: 1.35, expr: 'happy', gm: 'grin' }, t) + kevin({ x: 760, y: 1500, s: 1.3, expr: 'mock', flip: 1, armL: [190, 195] }, t) + kidX(0, { x: 960, y: 1480, s: 1.0, expr: 'laugh', flip: 1 }, t), T) +
    funTag(330, 640, 'TOI', t, at(19, 'toi') - .1, { size: 50, bg: SX.cool }) + stamp(CX, 450, 'BLAGUE', t, at(19, 'blague') - .05, SX.acc, -10),
  sfx: [[0, 'rewind', .5], [at(19, 'toi') - .1, 'pop', .5], [at(19, 'blague') - .05, 'thud', .8], [at(19, 'blague') + .15, 'rimshot', .6]] });
// B020 — musée : le même sourire en cadre doré, visiteurs en extase : DE L'ART ?
B(20, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d), hand: .2 }),
  draw: (t, d, T) => { const A = at(20, 'art'); let s = museum(t) + rect(CX - 300, 470, 600, 560, '#e0a020', 20) + rect(CX - 260, 510, 520, 480, '#fff3f7', 6, 5) + G(tr(CX, 760, .55), gapBig(0, 0, 1, t, { open: .4, shine: 1 })) + rect(CX - 90, 1050, 180, 50, '#fffdf6', 6, 4);
    for (let i = 0; i < 3; i++) s += adultX(i + 1, { x: 180 + i * 360, y: 1580, s: 1.0, expr: i === 1 ? 'love' : 'wow', look: [0, -1], armR: i === 2 ? [-80, -100] : undefined }, t);
    return s + funTag(CX, 300, 'PUBLICITÉ', t, at(20, 'publicite') - .1, { size: 44, bg: SX.cool }) + kword("DE L'ART ?", CX, 420, t, A - .1, { size: 100, fill: SX.acc2 }) + (t > A ? popStars(CX, 760, t, A, 8, 320) : ''); },
  sfx: [[0, 'angel', .4], [at(20, 'publicite') - .1, 'pop', .5], [at(20, 'art') - .1, 'boom', .5], [at(20, 'art'), 'sparkle', .6]] });
// B021a — un jour, au café : Kevin (adulte) débarque
B(21, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const k = eOutCubic(seg(t, 0, at(21, 'kevin') + .3)); return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.4, svg: cafe(t), haze: .06 }, { z: 1, svg: heroA({ x: 320, y: 1600, s: 1.2, expr: 'neutral' }, t) + kevinA({ x: lerp(1250, 780, k), y: 1600, s: 1.2, expr: 'happy', flip: 1, walk: k < 1 ? 3 : 0 }, t) }, { z: .6, svg: fg(G(tr(980, 1720), circ(0, 0, 160, '#ffd6e4', 7))) }]) +
    funTag(CX, 430, 'UN JOUR…', t, at(21, 'jour') - .1, { size: 54, bg: SX.acc2, fg: SX.ink }) + funTag(780, 600, 'KEVIN', t, at(21, 'kevin'), { size: 48, bg: '#5fb85f' }); },
  sfx: [[0, 'whoosh', .5], [.2, 'steps', .6], [at(21, 'jour') - .1, 'pop', .5], [at(21, 'kevin'), 'pop_hi', .5]] });
// B021b — « En vrai, c'est stylé tes dents » : Kevin lunettes de soleil, pouce levé, étoiles
B(21, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const St = at(21, 'style') - at(21, 'en'); return cafe(t) + rays(t, CX, 880, 'rgba(255,255,255,.3)', 'rgba(255,255,255,0)', 18) + kevinHead(CX - 40, 860, 240, { expr: t > St ? 'shadesGrin' : 'talk' }, t) + fistUp(870, 1050, 1.5, 0) +
    funTag(CX, 430, 'EN VRAI…', t, .05, { size: 54, bg: SX.cool }) + kword('STYLÉ', CX, 560, t, St - .05, { size: 130, fill: SX.acc2 }) + popStars(CX, 860, t, St, 8, 330); },
  sfx: [[0, 'whoosh', .4], [.05, 'pop', .5], [at(21, 'style') - at(21, 'en') - .05, 'boom', .5], [at(21, 'style') - at(21, 'en'), 'glint', .7], [at(21, 'dents') - at(21, 'en'), 'sparkle', .4]] }, at(21, 'en') - .15);
// B022 — « Tu le regardes » : très gros plan western, regard plissé, virevoltant
B(22, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.12, 1.18, t / d) }),
  draw: (t, d, T) => cafe(t) + heroHead(CX, 900, 330, { expr: 'suspicious' }, t) + tumbleweed(lerp(-150, 1250, t / d), 1300, .8, t * 400) + letterbox(1) + funTag(830, 470, '…', t, at(22, 'regardes'), { size: 70, bg: '#fff', fg: SX.ink }),
  sfx: [[0, 'wind', .6], [.2, 'crickets', .5], [at(22, 'regardes'), 'glint', .4], [.8, 'whistle', .3]] });
// B023a — le MÊME Kevin : Kevin adulte = Kevin gamin
B(23, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => paper('#fff1e0') + gobo(T, .1) + cutout(kevinHead(300, 900, 160, { expr: 'shadesGrin' }, t), 12) + cutout(kevinHead(800, 920, 120, { expr: 'mock' }, t), 12) + G(tr(560, 900), text(0, 40, OL, '=', '#fff', 150)) +
    funTag(300, 1130, 'AUJOURD’HUI', t, .1, { size: 40, bg: SX.cool }) + funTag(800, 1130, 'AU COLLÈGE', t, .3, { size: 40, bg: SX.acc }) + funBox(800, 920, 300, 300, t, at(23, 'kevin'), { label: 'kevin.exe', col: SX.acc }) + kword('LE MÊME', CX, 450, t, at(23, 'meme') - .05, { size: 110, fill: SX.acc2 }),
  sfx: [[0, 'whoosh', .5], [.1, 'pop_hi', .4], [at(23, 'meme') - .05, 'boom', .5], [at(23, 'kevin'), 'tick', .6]] });
// B023b — PÉAGE AUTOROUTIER : ta bouche géante, des voitures passent dans l'écart, Kevin encaisse au péage
B(23, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), shake: 2 }),
  draw: (t, d, T) => { const o = at(23, 'peage'), A = at(23, 'autoroutier') - o, cy = 760, r = 300, bar = Math.sin(t * 5) > 0 ? -60 : 0; let s = highway(t) + heroHead(CX, cy, r, { expr: 'deadpan', gm: 'grin' }, t);
    s += G(tr(CX, cy + r * .32), G(`rotate(${bar} -60 0)`, rect(-60, -6, 120, 12, '#fff', 4, 4) + rect(-20, -6, 20, 12, '#e2463a', 0, 0))) + booth(170, 1250, 1.1) + kevin({ x: 170, y: 1200, s: .75, expr: 'mock', cap: '#e2463a' }, t);
    for (let i = 0; i < 3; i++) { const k = (t * .7 + i / 3) % 1; s += car(lerp(CX, CX + 40, k), lerp(1250 + 250, cy + r * .5, k), lerp(.5, .06, k), t, { color: ['#ffd23f', '#4d7cf0', '#e2463a'][i] }); }
    return s + kword('PÉAGE', CX, 330, t, .02, { size: 110, fill: SX.acc2 }) + funTag(CX, 440, 'AUTOROUTIER', t, A - .05, { size: 50, bg: SX.acc }) + funTag(820, 1150, '2,50 €', t, .4, { size: 48, bg: '#ffc93a', fg: SX.ink }); },
  sfx: [[0, 'flash_hit', .5], [.02, 'boom', .5], [.3, 'whoosh', .5], [.4, 'kaching', .6], [at(23, 'autoroutier') - at(23, 'peage') - .05, 'pop', .5], [at(23, 'college') - at(23, 'peage'), 'rimshot', .5]] }, at(23, 'peage') - .15);
// B024 — « Tu souris. » : lent sourire en coin… qui devient grand
B(24, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d) }),
  draw: (t, d, T) => { const S = at(24, 'souris'); return cafe(t) + heroHead(CX, 900, 250, { expr: t > S ? 'happy' : 'smug', gm: t > S ? 'grin' : undefined }, t) + (t > S ? sparkle(CX + 20, 990, .6 + .3 * Math.sin(t * 16), '#fff') : '') + funTag(CX, 460, 'SOURIRE', t, S, { size: 56, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .4], [at(24, 'souris') - .1, 'squeak', .4], [at(24, 'souris'), 'glint', .8]] });
// B025 — « Toutes dents dehors » : la bouche géante, écart fièrement exposé, ÉTOILES DÉBLOQUÉES
B(25, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), shake: t < .3 ? 5 : 0 }),
  draw: (t, d, T) => { const T0 = at(25, 'toutes') - .05; return rays(t, CX, 900, '#ff7aa8', '#ff4f8b', 24) + unlock(CX, 900, t, T0, { part: 'back', r: 520 }) + gapBig(CX, 920, 1.05, t, { open: .7, shine: 1 }) + unlock(CX, 900, t, T0, { part: 'front', r: 520 }) +
    kword('TOUTES DENTS', CX, 380, t, T0, { size: 84, fill: '#fff' }) + kword('DEHORS', CX, 490, t, at(25, 'dehors') - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .5], [at(25, 'toutes') - .05, 'boom', .6], [at(25, 'dents'), 'sparkle', .6], [at(25, 'dehors') - .05, 'tada', .6]] });
// B026 — « Merci. » : révérence polie, main sur le cœur, Kevin tout gêné
B(26, { enter: 'whip', cam: zin(1.02, 1.06, .3),
  draw: (t, d, T) => cafe(t) + heroA({ x: 340, y: 1600, s: 1.2, expr: 'proud', gm: 'grin', rot: 8 * Math.sin(seg(t, 0, .6) * Math.PI), armR: [130, 190] }, t) + kevinA({ x: 790, y: 1600, s: 1.2, expr: 'embarrassed', flip: 1 }, t) + kword('MERCI.', CX, 450, t, at(26, 'merci') - .05, { size: 120, fill: '#fff' }),
  sfx: [[0, 'whoosh', .4], [at(26, 'merci') - .05, 'ding', .6], [.5, 'hmm', .3]] });
// B027 — « Ça fait plaisir. » : gros sourire rayonnant, cœurs qui montent
B(27, { cam: zin(1.04, 1.1),
  draw: (t, d, T) => cafe(t) + glow(CX, 880, 420, '#fff6c8', .4) + heroHead(CX, 880, 240, { expr: 'love', gm: 'grin' }, t) + heartsUp(t, CX, 700, 6) + funTag(CX, 430, 'ÇA FAIT PLAISIR', t, at(27, 'plaisir') - .2, { size: 54, bg: SX.acc }),
  sfx: [[0, 'kiss', .4], [at(27, 'plaisir') - .2, 'pop', .6], [.6, 'sparkle', .4]] });
// B028 — « Puis tu ajoutes. » : doigt levé, ah et…
B(28, { enter: 'punch', cam: camHand(1.05, .4),
  draw: (t, d, T) => cafe(t) + heroA({ x: 380, y: 1600, s: 1.2, expr: 'smug', armR: [-70, -95] }, t) + kevinA({ x: 800, y: 1600, s: 1.2, expr: 'worried', flip: 1 }, t) + markerText('ah, et…', 640, 520, t, at(28, 'ajoutes') - .3, { size: 72, col: SX.acc2 }) + sweatDrops(800, 1110, t),
  sfx: [[0, 'pop_hi', .5], [at(28, 'ajoutes') - .3, 'scratch', .5], [.6, 'tick', .4]] });
// B029 — « Tu me dois dix ans de compliments » : facture qui sort à l'infini, Kevin terrorisé
B(29, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(29, 'compliments') ? 3 : 0 }),
  draw: (t, d, T) => { const k = eOutCubic(seg(t, .1, d)); return cafe(t) + kevinA({ x: 800, y: 1600, s: 1.2, expr: t > at(29, 'dix') ? 'terror' : 'worried', flip: 1, tremble: 1 }, t) + receipt(330, 300, .95, k, t) +
    funTag(780, 470, `${counter(0, 10, t, at(29, 'dix') - .2, .4)} ANS`, t, at(29, 'dix') - .2, { size: 70, bg: SX.acc2, fg: SX.ink }) + funTag(780, 610, 'DE COMPLIMENTS', t, at(29, 'compliments') - .05, { size: 40, bg: SX.acc }); },
  sfx: [[.1, 'printer', .6], [at(29, 'dois'), 'kaching', .6], [at(29, 'dix') - .2, 'pop', .6], [at(29, 'compliments'), 'coins', .5], [at(29, 'compliments') + .3, 'gasp', .5]] });
// B030 — couloir de famille : 3 photos (9, 15, 25 ans), le même sourire, jamais changé
B(30, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const ages = ['9 ans', '15 ans', '25 ans'], J = at(30, 'jamais'); let s = hallway(t);
    for (let i = 0; i < 3; i++) { const x = 200 + i * 340, y = 860 + (i === 1 ? -40 : 0); s += card(x, y, 310, 420, photoCard(heroHead(0, -40, 80 + i * 6, { expr: 'happy', gm: 'grin', hc: '#5a3a26' }, t), ages[i]), t, .1 + i * .2, { ry: 0, r: (i - 1) * 5, bg: '#c38a52', bw: 6 }) + markerCircle(x, y - 40 + (80 + i * 6) * .4, 58, 36, t, at(30, 'sourire') + i * .1, { col: SX.acc2, w: 8 }); }
    return s + kword('JAMAIS CHANGÉ', CX, 420, t, J - .05, { size: 86, fill: SX.acc2 }); },
  sfx: [[.1, 'pop', .5], [.3, 'pop', .5], [.5, 'pop', .5], [at(30, 'sourire'), 'scratch', .5], [at(30, 'jamais') - .05, 'boom', .5]] });
// B031 — vitrine : le mannequin change de tenue à toute vitesse, seule LA MODE change
B(31, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const n = Math.floor(t / .18), cols = ['#ff4f8b', '#ffd23f', '#36c5b4', '#b56cff', '#ff8a3d', '#4d7cf0'], years = ['2010', '2014', '2018', '2022', '2026'];
    return shopWindow(t) + person({ age: 'adult', x: CX, y: 1250, s: 1.1, hair: ['long', 'bun', 'curly', 'ponytail', 'side'][n % 5], hairColor: '#e8d8c0', skin: '#e8eef2', shirt: cols[n % 6], pants: cols[(n + 3) % 6], expr: 'smug', face: { eyes: 'closed' }, seed: 70 }, t) +
      funTag(820, 560, years[Math.min(4, Math.floor(t / .4))], t, .05, { size: 50, bg: SX.ink }) + heroA({ x: 170, y: 1640, s: 1.2, expr: 'smug', look: [1, -1] }, t) + kword('LA MODE', CX, 440, t, at(31, 'mode') - .05, { size: 120, fill: SX.acc2 }) + op(1 - (t % .18) / .07, rect(100, 320, 880, 910, '#fff', 8, 0)); },
  sfx: [[0, 'shutter', .5], [.36, 'shutter', .5], [.72, 'shutter', .5], [at(31, 'change'), 'whoosh', .5], [at(31, 'mode') - .05, 'boom', .6]] });
// B032 — FIN : tu ris à pleines dents, l'AUTORISATION de Kevin se déchire, POUR RIRE !
B(32, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(32, 'rire') && t < at(32, 'rire') + .4 ? 5 : 0 }),
  draw: (t, d, T) => { const A = at(32, 'autorisation'), Rr = at(32, 'rire'), tear = eOutCubic(seg(t, Rr, Rr + .5)); return rays(t, CX, 900, '#ffe9a6', '#ffd76b', 26) + unlock(CX, 960, t, Rr - .05, { part: 'back', r: 520 }) +
    heroHead(CX - 30, 960, 230, { expr: t > Rr ? 'ecstatic' : 'smug', gm: t > Rr ? 'laugh' : undefined }, t) + kevinHead(900, 1130, 100, { expr: t > Rr ? 'jawdrop' : 'smug' }, t) +
    (t > A ? G(tr(-tear * 500, -tear * 600, 1, -tear * 70), formPaper(800, 900, .7, 8, t)) : '') +
    unlock(CX, 960, t, Rr - .05, { part: 'front', r: 520 }) + kthin("pas besoin d'autorisation", CX, 330, t, at(32, 'jamais'), { size: 50, fill: SX.ink }) + kword('POUR RIRE !', CX, 470, t, Rr - .05, { size: 120, fill: SX.acc2 }) + (t > Rr ? confetti(t, Rr, 40) : ''); },
  sfx: [[0, 'whoosh', .5], [at(32, 'autorisation'), 'pop', .6], [at(32, 'rire') - .05, 'boom', .6], [at(32, 'rire'), 'snip', .6], [at(32, 'rire') + .2, 'tada', .8], [at(32, 'rire') + .7, 'rimshot', .4]] });

SCENES.sort((a, b) => a.s - b.s);
