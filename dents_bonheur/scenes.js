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
  s += rect(110, 330, 860, 640, '#2b2420', 18) + rect(130, 350, 820, 600, '#fff3f7', 10, 0) + (poster || '') + line(340, 970, 340, 1250, 18, '#59616c') + line(740, 970, 740, 1250, 18, '#59616c') + [300, 780].map(x => line(x, 330, x + 30, 290, 8, '#59616c') + path(`M${x + 10} 280h50l-10 24h-30Z`, '#59616c', 4)).join('');
  s += rect(-M, 1250, W + 2 * M, 90, '#cfd3d8', 0, 0) + line(-M, 1340, W + M, 1340, 10, '#8a939e') + rect(-M, 1340, W + 2 * M, 900, '#a7adb5', 0, 0); for (let x = -M; x < W + M; x += 220) s += rect(x, 1560, 120, 16, '#fff', 4, 0);
  s += dWalkers(t, 1300, 3, .36, 1) + dLamppost(50, 1300, .9, 0) + dLamppost(1030, 1300, .9, 0) + dHydrant(470, 1310) + dBin(170, 1310, .55, '#36a85a') + bikeS(880, 1270, .55) + dTrafficLight(600, 1310, t) + G(tr(940, 1310), rect(-40, -60, 80, 60, '#d9825b', 6, 4)) + treeB(940, 1250, .45, t);
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
  const r = rng(seed); for (let i = 0; i < 2; i++) { const px = x + w * (.25 + i * .5), py = y + h * .7; v += circ(px, py - 60, 46, ['#c98a5e', '#f2c9a0'][i], 4) + rect(px - 60, py - 14, 120, 140, ['#7aa6d8', '#b56cff'][i], 40, 4) + G(tr(px + 40, py + 10 + Math.sin(t * 3 + i) * 6), dMug(0, 0, '#fff')); }
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
    for (let i = 0; i < 3; i++) s += adultX(i, { x: 200 + i * 340, y: 1700, s: 1.0, expr: i === 1 ? 'wow' : 'shock', coat: 1, shirt: '#fff', glasses: true, armR: [-60, -80] }, t);
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
