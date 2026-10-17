// ============================================================
//  « Pourquoi c'est horrible quand ta barbe ne pousse pas ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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
//  Police Fredoka (défaut sxFun), contours cartoon épais, un accent violet.
// ============================================================
sxFun('#8a5cff'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';

// ---------- personnages ----------
const HC = '#3a2a20', KC = '#c4521b', HERO_SHIRT = '#4d9de0';
// les 3 poils du héros : 1 à gauche, 2 à droite (o.pk = longueur, o.shine = brillants, o.hide = indices cachés)
const HAIRS3 = [[-.42, .74, 195], [.3, .8, 170], [.5, .68, 155]];
function fewHairs(r, t, o = {}) { if (o.noHairs) return ''; const L = r * .27 * (o.pk ?? 1), w = Math.max(4, r * .045); let s = '';
  HAIRS3.forEach(([x, y, a], i) => { if (o.hide && o.hide.includes(i)) return; const d = `M0 0C${f1(L * .35)} ${f1(-L * .35)} ${f1(-L * .35)} ${f1(-L * .65)} ${f1(L * .12)} ${f1(-L)}`;
    s += G(tr(x * r, y * r, 1, a + wave(t, .9, 8, i * .37)), `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${f1(w)}" stroke-linecap="round"/>`) + circ(x * r, y * r, w * .55, OL, 0);
    if (o.shine) s += sparkle(x * r + (x < 0 ? -1 : 1) * L * .5, y * r + L * .7, r / 380 * (.7 + .3 * Math.sin(t * 9 + i)), '#fff'); });
  return s; }
const heroHairFn = (r, t, o) => { const [b, f] = hairSvg('short', HC, r, t); return [b, f + fewHairs(r, t, o)]; };
const heroP = (o, t) => person(Object.assign({ age: 'adult', hairFn: heroHairFn, shirt: HERO_SHIRT, pants: '#3b3f4a', seed: 2 }, o), t);
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: heroHairFn, seed: 2 }, o), t));
// barbe énorme de Kevin (nuage roux bouclé ; k = taille 0..3)
function megaBeard(r, t, k = 1, col = KC) { if (k <= 0) return ''; const n = 13, rx = r * (1.02 + .12 * k), ry = r * (.95 + .75 * k); let d = '', curls = '';
  const P = a => [Math.cos(a) * rx, r * .05 + Math.sin(a) * ry];
  for (let i = 0; i <= n; i++) { const a = Math.PI - i / n * Math.PI, [x, y] = P(a); if (!i) { d += `M${f1(x)} ${f1(y)}`; continue; } const am = a + Math.PI / n / 2, bulge = 1.13 + .03 * Math.sin(t * 4 + i); d += `Q${f1(Math.cos(am) * rx * bulge)} ${f1(r * .05 + Math.sin(am) * ry * bulge)} ${f1(x)} ${f1(y)}`; }
  d += `Q${f1(r * .55)} ${f1(r * .62)} 0 ${f1(r * .5)}Q${f1(-r * .55)} ${f1(r * .62)} ${f1(-rx)} ${f1(r * .05)}Z`;
  for (let i = 0; i < 7; i++) { const a = R(30 + i * 20), rr = .55 + .25 * (i % 2); curls += path(`M${f1(Math.cos(a) * rx * rr)} ${f1(r * .3 + Math.sin(a) * ry * rr)}q${f1(r * .08)} ${f1(-r * .1)} ${f1(r * .14)} 0`, 'none', Math.max(3, r * .03), shade(col, -.3)); }
  return path(d, col, 6) + curls; }
const kevHairFn = (r, t, o) => { const [b, f] = hairSvg('spiky', KC, r, t); return [b, f + megaBeard(r, t, o.bk ?? 1) + (o.bk === 0 && o.kHairs ? fewHairs(r, t, {}) : '')]; };
const kevin = (o, t) => person(Object.assign({ age: 'adult', hairFn: kevHairFn, hairColor: KC, beard: true, shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: kevHairFn, hairColor: KC, beard: (o.bk ?? 1) > 0, freckles: true, seed: 3 }, o), t));
const oncle = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#9a9aa2', mustache: true, glasses: true, shirt: '#c94f4f', pants: '#3b3f4a', wrinkles: true, seed: 8 }, o), t);
const oncleHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'side', hairColor: '#9a9aa2', mustache: true, glasses: true, wrinkles: true, seed: 8 }, o), t));
const crush = (o, t) => person(Object.assign({ age: 'adult', hair: 'long', hairColor: '#2b2420', shirt: '#ff6fa5', pants: '#4b3b6e', skin: '#c98a5e', necklace: true, seed: 5 }, o), t);
const crushHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'long', hairColor: '#2b2420', skin: '#c98a5e', seed: 5 }, o), t));

// ============================================================
//  DÉCORS RICHES (retour client) : petits accessoires factorisés → composés en décors denses
//  (3 couches : fond / plan moyen / premier plan flou ; 2–3 éléments animés par décor)
// ============================================================
const PAL = ['#ff8fb1', '#ffd23f', '#5ec4f0', '#7be07b', '#b56cff', '#ff8a3d', '#e2463a', '#4d7cf0'];
let _wvid = 0;
const fgBlur = (svg, px = 8) => blur(px, svg);
// --- murs & sols ---
function wallpaper(c2, kind = 'stripes', y0 = -M, y1 = H + M) { let s = '';
  if (kind === 'stripes') for (let x = -M; x < W + M; x += 120) s += rect(x, y0, 44, y1 - y0, c2, 0, 0);
  else if (kind === 'dots') for (let y = y0 + 40, r = 0; y < y1; y += 110, r++) for (let x = -300 + (r % 2 ? 55 : 0); x < W + 300; x += 110) s += circ(x, y, 9, c2, 0);
  else if (kind === 'diamonds') for (let y = y0, r = 0; y < y1; y += 120, r++) for (let x = -300 + (r % 2 ? 60 : 0); x < W + 300; x += 120) s += path(`M${x} ${y - 22}L${x + 16} ${y}L${x} ${y + 22}L${x - 16} ${y}Z`, c2, 0);
  else if (kind === 'bricks') for (let y = y0, r = 0; y < y1; y += 70, r++) for (let x = -300 + (r % 2 ? 70 : 0); x < W + 300; x += 140) s += rect(x + 4, y + 4, 132, 62, c2, 6, 0);
  return s; }
function plinth(y, col = '#fff8ee', h = 34) { return rect(-M, y - h, W + 2 * M, h, col, 0, 4); }
function parquet(y, c1 = '#c49a6c', c2 = '#a87c50', h = 1000) { let s = rect(-M, y, W + 2 * M, h, c1, 0, 0); for (let j = 0, yy = y; yy < y + h; yy += 70, j++) { s += line(-M, yy, W + M, yy, 3, c2); for (let x = -300 + (j % 3) * 120; x < W + 300; x += 360) s += line(x, yy, x, yy + 70, 3, c2); } return s; }
function outlet(x, y, s = 1) { return G(tr(x, y, s), rect(-24, -32, 48, 64, '#f6f3ec', 8, 4) + circ(-8, -6, 4.5, OL, 0) + circ(8, -6, 4.5, OL, 0) + rect(-3, 8, 6, 10, OL, 2, 0)); }
function lightSwitch(x, y, s = 1) { return G(tr(x, y, s), rect(-28, -40, 56, 80, '#f6f3ec', 8, 4) + rect(-11, -22, 22, 44, '#e2ddd2', 5, 3)); }
// --- étagères & objets posés (y = surface où ils reposent) ---
function shelfP(x, y, w, col = '#c58e55') { return rect(x, y, w, 18, col, 4, 5) + path(`M${x + 26} ${y + 18}l0 26l26 -26M${x + w - 26} ${y + 18}l0 26l-26 -26`, 'none', 5); }
function bookRow(x, y, n = 6, seed = 1, tilt = 1) { const r = rng(seed); let s = '', cx = x; for (let i = 0; i < n; i++) { const w = 18 + r() * 14, h = 58 + r() * 40, c = PAL[(i * 3 + seed) % 8];
  s += tilt && i === n - 1 ? G(tr(cx + 6, y, 1, 18), rect(0, -h, w, h, c, 3, 4)) : rect(cx, y - h, w, h, c, 3, 4) + line(cx + 5, y - h + 14, cx + w - 5, y - h + 14, 3, 'rgba(255,255,255,.55)'); cx += w + 2; } return s; }
function jar(x, y, s = 1, c = '#ffd23f') { return G(tr(x, y, s), rect(-22, -56, 44, 56, 'rgba(220,240,255,.85)', 10, 4) + rect(-18, -34, 36, 30, c, 6, 0) + rect(-24, -66, 48, 14, '#c58e55', 4, 4)); }
function flask(x, y, s = 1, c = '#5ec4f0', h = 70) { return G(tr(x, y, s), rect(-18, -h, 36, h, c, 10, 4) + rect(-9, -h - 22, 18, 24, '#fff', 4, 4) + rect(-12, -h * .65, 24, h * .3, 'rgba(255,255,255,.75)', 4, 0)); }
function trophy(x, y, s = 1) { return G(tr(x, y, s), rect(-26, -14, 52, 14, '#8a5a3a', 3, 4) + rect(-6, -40, 12, 28, '#ffc93c', 2, 4) + path('M-30 -84q-24 0 -16 22M30 -84q24 0 16 22', 'none', 5) + path('M-30 -90L30 -90Q30 -40 0 -40Q-30 -40 -30 -90Z', '#ffc93c', 4)); }
function potPlant(x, y, s, t, c = '#d9825b', leaf = '#5aa76a', seed = 0) { let l = ''; for (let i = 0; i < 5; i++) l += G(tr(0, -50, 1, -64 + i * 32 + wave(t, .5, 4, seed + i * .2)), path('M0 0C-22 -30 -18 -80 0 -100C18 -80 22 -30 0 0Z', i % 2 ? leaf : shade(leaf, .18), 4));
  return G(tr(x, y, s), l + path('M-34 0L-28 -54L28 -54L34 0Z', c, 5) + rect(-38, -62, 76, 16, shade(c, -.1), 5, 5)); }
function hangPlant(x, y, t, len = 240) { const sw = wave(t, .35, 5); let v = '';
  for (let k = 0; k < 3; k++) { const x0 = -30 + k * 30, L = len * (1 - k * .18); let d = `M${x0} 0`; for (let j = 1; j <= 5; j++) d += `Q${x0 + (j % 2 ? 18 : -18)} ${f1(j * L / 5 - L / 10)} ${x0} ${f1(j * L / 5)}`; v += path(d, 'none', 5, '#3f8a4f'); for (let j = 1; j <= 5; j++) v += ell(x0 + (j % 2 ? 14 : -14), j * L / 5 - 18, 16, 10, j % 2 ? '#6dbb7a' : '#5aa76a', 3); }
  return G(tr(x, y), line(0, -y - 100, 0, -60, 4) + G(`rotate(${f1(sw)})`, v) + path('M-50 -60L50 -60L38 0L-38 0Z', '#e98a5b', 5)); }
function mug(x, y, s, t, c = '#e2463a') { return G(tr(x, y, s), path('M28 -48q28 0 28 20t-28 18', 'none', 7) + rect(-30, -62, 60, 62, c, 10, 5) + rect(-30, -44, 60, 12, 'rgba(255,255,255,.5)', 0, 0) + G(tr(0, -70), path('M0 0c-14 -16 14 -30 0 -50M-18 -6c-10 -14 10 -24 0 -40', 'none', 5, `rgba(255,255,255,${f1(.45 + .35 * Math.sin(t * 3))})`))); }
// --- cadres, posters, lampes, rideaux, fenêtres ---
function photoFrame(x, y, w, h, kind = 0, col = '#c38a52') { const ix = x + 12, iy = y + 12, iw = w - 24, ih = h - 24, m = Math.min(iw, ih); let inner = rect(ix, iy, iw, ih, ['#bfe3f5', '#ffd1dc', '#d8f0dc', '#fff1c4'][kind % 4], 0, 0);
  if (kind % 4 === 0) inner += path(`M${ix} ${iy + ih}L${f1(ix + iw * .35)} ${f1(iy + ih * .4)}L${f1(ix + iw * .6)} ${f1(iy + ih * .75)}L${f1(ix + iw * .8)} ${f1(iy + ih * .5)}L${ix + iw} ${iy + ih}Z`, '#7cc46a', 0) + circ(ix + iw * .78, iy + ih * .25, m * .1, '#ffd23f', 0);
  else if (kind % 4 === 1) inner += heart(ix + iw / 2, iy + ih / 2, m / 130);
  else if (kind % 4 === 2) for (let i = 0; i < 2; i++) inner += rect(ix + iw * (.35 + i * .3) - iw * .12, iy + ih * .62, iw * .24, ih * .4, PAL[i + 2], 6, 3) + circ(ix + iw * (.35 + i * .3), iy + ih * .45, m * .15, SKIN, 3);
  else inner += sparkle(ix + iw / 2, iy + ih / 2, m / 110, '#ff8a3d');
  return rect(x, y, w, h, col, 6, 5) + inner + rect(ix, iy, iw, ih, 'none', 0, 3); }
function poster(x, y, w, h, bg, inner = '', r = 0) { return G(tr(x + w / 2, y + h / 2, 1, r), rect(-w / 2, -h / 2, w, h, bg, 6, 5) + inner + rect(-w / 2 - 6, -h / 2 - 8, 30, 14, 'rgba(255,255,255,.7)', 2, 0) + rect(w / 2 - 24, -h / 2 - 8, 30, 14, 'rgba(255,255,255,.7)', 2, 0)); }
function deskLamp(x, y, s = 1, on = 0, col = '#4d9de0') { return G(tr(x, y, s), (on ? circ(20, -120, 130, 'rgba(255,240,170,.25)', 0) : '') + ell(0, 0, 50, 12, col, 5) + line(0, -6, -30, -110, 9) + line(-30, -110, 20, -170, 9) + G(tr(30, -170, 1, 30), path('M-44 10L44 10L30 -40L-30 -40Z', col, 5))); }
function ceilingLamp(x, y, t, col = '#ffd23f', on = 1) { const sw = wave(t, .35, 2.5, x * .002); return G(`translate(${f1(x)} 0) rotate(${f1(sw)})`, line(0, -M, 0, y - 60, 5) + (on ? circ(0, y + 20, 110, 'rgba(255,240,170,.25)', 0) : '') + path(`M-90 ${y}Q-80 ${y - 70} 0 ${y - 70}Q80 ${y - 70} 90 ${y}Z`, col, 5) + circ(0, y + 6, 18, on ? '#fff6c8' : '#ddd', 4)); }
function barLight(x, y, w) { return glow(x, y + 30, w * .6, '#fff8d8', .35) + rect(x - w / 2, y, w, 30, '#fbf6ee', 15, 5) + Array.from({ length: 4 }, (_, i) => circ(x - w / 2 + w * (i + .5) / 4, y + 42, 15, '#fff6c8', 4)).join(''); }
function curtain(x, y, w, h, t, col = '#ff8fb1') { const sk = wave(t, .3, 3, x * .003); let d = `M0 0L${w} 0L${w} ${h}`; for (let i = 0; i < 4; i++) d += `Q${f1(w - (i + .5) * w / 4)} ${h + 24} ${f1(w - (i + 1) * w / 4)} ${h}`; d += 'Z'; let f = ''; for (let i = 1; i < 4; i++) f += line(i * w / 4, 10, i * w / 4 + 6, h - 10, 4, shade(col, -.18));
  return G(`translate(${f1(x)} ${f1(y)}) skewX(${f1(sk)})`, path(d, col, 5) + f) + rect(x - 20, y - 16, w + 40, 18, '#8a5a3a', 8, 4); }
function windowView(x, y, w, h, t, o = {}) { const night = o.night, id = 'wv' + (_wvid++); let v = grad(night ? '#0d1540' : '#8fd3ff', night ? '#26306a' : '#e6f6ff', x, y, w, h);
  v += night ? circ(x + w * .72, y + h * .22, Math.min(w, h) * .09, '#fff6d6', 0) + sparkle(x + w * .2, y + h * .15, .25, '#fff6d6') + sparkle(x + w * .45, y + h * .3, .18 + .08 * Math.sin(t * 4), '#fff6d6')
    : cloud(x + ((t * 24 + w * .3) % (w + 200)) - 100, y + h * .22, .45, '#fff') + cloud(x + ((t * 14 + w * .8) % (w + 260)) - 130, y + h * .4, .32, '#fff');
  for (let i = 0; i < 4; i++) { const bw = w * .27, bh = h * (.32 + ((i * 37) % 30) / 100), bx = x + i * w * .26 - 10; v += rect(bx, y + h - bh, bw, bh, night ? '#1f2a5e' : ['#c9d6e8', '#e5cdb8', '#d8c8e6', '#bfd8c8'][i], 0, 3);
    for (let j = 0; j < 3; j++) for (let k = 0; k < 2; k++) { const lit = Math.sin(t * .9 + i * 3 + j * 5 + k * 2) > -.3; v += rect(bx + 10 + k * bw * .46, y + h - bh + 14 + j * 32, bw * .3, 16, night ? (lit ? '#ffe08a' : '#2b3570') : 'rgba(255,255,255,.75)', 2, 0); } }
  if (!night) v += rect(x + w * .2 - 5, y + h * .8, 10, h * .2, '#8a5a3a', 0, 3) + circ(x + w * .2, y + h * .76, w * .12, '#6dbb7a', 4) + circ(x + w * .3, y + h * .82, w * .09, '#5aa76a', 4);
  const bars = line(x + w / 2, y, x + w / 2, y + h, 22) + line(x, y + h / 2, x + w, y + h / 2, 22) + line(x + w / 2, y, x + w / 2, y + h, 12, '#fbf6ee') + line(x, y + h / 2, x + w, y + h / 2, 12, '#fbf6ee');
  return `<defs><clipPath id="${id}"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}"/></clipPath></defs><g clip-path="url(#${id})">${v}</g>` + bars + rect(x, y, w, h, 'none', 4, 24) + rect(x, y, w, h, 'none', 4, 14, '#fbf6ee') + rect(x - 24, y + h, w + 48, 24, '#fbf6ee', 6, 5); }
// --- sol & bazar ---
function rug(x, y, w, h, c1 = '#ff8fb1', c2 = '#ffd1dc') { return ell(x, y, w, h, c1, 5) + ell(x, y, w * .78, h * .68, c2, 0) + ell(x, y, w * .5, h * .4, c1, 0); }
function sneaker(x, y, s = 1, c = '#e2463a', fl = 1) { return G(`translate(${f1(x)} ${f1(y)}) scale(${s * fl} ${s})`, path('M-50 0L-50 -34Q-40 -50 -10 -46L20 -20Q50 -20 56 -6L56 0Z', c, 5) + rect(-54, -8, 114, 12, '#fff', 6, 4) + line(-22, -36, -6, -26, 4, '#fff')); }
function backpack(x, y, s = 1, c = '#4d7cf0') { return G(tr(x, y, s), path('M-30 -150Q0 -190 30 -150', 'none', 7) + rect(-60, -150, 120, 150, c, 30, 5) + rect(-44, -70, 88, 56, shade(c, -.15), 14, 4)); }
function cardboard(x, y, s = 1, label = '') { return G(tr(x, y, s), rect(-80, -110, 160, 110, '#d9a96a', 4, 5) + line(-80, -88, 80, -88, 4) + rect(-16, -110, 32, 40, '#f0d79a', 0, 3) + (label ? ftext(0, -30, label, { size: 24, fill: OL, stroke: 'none' }) : '')); }
function trashBin(x, y, s = 1, c = '#9aa3ad') { return G(tr(x, y, s), path('M-50 -120L50 -120L40 0L-40 0Z', c, 5) + line(-20, -100, -16, -20, 4, shade(c, -.25)) + line(20, -100, 16, -20, 4, shade(c, -.25)) + path('M-24 -128q10 -36 34 -12', '#fff', 4) + rect(-58, -134, 116, 20, shade(c, -.15), 6, 5)); }
function teddy(x, y, s = 1, c = '#c98a5e') { return G(tr(x, y, s), ell(0, 0, 60, 66, c, 5) + ell(-50, 40, 22, 18, c, 5) + ell(50, 40, 22, 18, c, 5) + circ(-38, -100, 20, c, 5) + circ(38, -100, 20, c, 5) + circ(0, -74, 48, c, 5) + ell(0, -60, 18, 13, '#f2d0a8', 3) + circ(-16, -82, 5, OL, 0) + circ(16, -82, 5, OL, 0) + circ(0, -64, 5, OL, 0) + path('M0 -24L-24 -38L-24 -10Z', '#e2463a', 4) + path('M0 -24L24 -38L24 -10Z', '#e2463a', 4)); }
function guitar(x, y, s = 1, r = -10) { return G(tr(x, y, s, r), rect(-12, -440, 24, 270, '#8a5a3a', 4, 5) + rect(-20, -480, 40, 50, '#5a3e28', 6, 5) + ell(0, -190, 62, 70, '#e98a3d', 5) + ell(0, -70, 82, 90, '#e98a3d', 5) + path('M-56 -150Q0 -120 56 -150', 'none', 0) + circ(0, -140, 24, OL, 0) + rect(-30, -60, 60, 14, '#5a3e28', 3, 0) + line(-4, -420, -4, -60, 2, '#fff') + line(4, -420, 4, -60, 2, '#fff')); }
function lavaLamp(x, y, s, t) { return glow(x, y - 90 * s, 130 * s, '#ff8fd0', .35) + G(tr(x, y, s), path('M-20 -30L20 -30L34 -150L-34 -150Z', '#ff9fd0', 4) + circ(wave(t, .3, 8), -50 - (t * 22 % 80), 12, '#ff4fa0', 0) + circ(-6, -115 + wave(t, .25, 14), 10, '#ff4fa0', 0) + path('M-30 0L30 0L20 -30L-20 -30Z', '#7a7f8a', 4) + path('M-34 -150L34 -150L22 -190L-22 -190Z', '#7a7f8a', 4)); }
function nightstand(x, y, s = 1, c = '#c58e55') { return G(tr(x, y, s), rect(-110, 0, 220, 220, c, 8, 5) + rect(-90, 20, 180, 70, shade(c, .12), 6, 4) + circ(0, 55, 8, OL, 0) + rect(-120, -14, 240, 20, shade(c, .2), 6, 5)); }
function glassW(x, y, s = 1) { return G(tr(x, y, s), path('M-22 -80L22 -80L18 0L-18 0Z', 'rgba(220,240,255,.8)', 4) + path('M-20 -46L20 -46L18 -2L-18 -2Z', 'rgba(140,200,255,.6)', 0)); }
// --- salle de bain ---
function tbCup(x, y, s = 1, c = '#5ec4f0') { const br = (cx, r, col) => G(tr(cx, -50, 1, r), rect(-5, -70, 10, 70, col, 4, 3) + rect(-8, -88, 16, 22, '#fff', 4, 3)); return G(tr(x, y, s), br(-10, -14, '#ff6fa5') + br(12, 12, '#7be07b') + path('M-30 -70L30 -70L24 0L-24 0Z', c, 5)); }
function soapPump(x, y, s = 1, c = '#ffb3cb') { return G(tr(x, y, s), rect(-6, -118, 12, 30, '#fff', 3, 4) + rect(-6, -124, 38, 12, '#fff', 4, 4) + rect(-28, -90, 56, 90, c, 14, 5) + ell(-10, -60, 6, 16, 'rgba(255,255,255,.6)', 0)); }
function duck(x, y, s, t) { return G(tr(x, y, s, wave(t, .8, 6)), ell(0, -26, 44, 28, '#ffd23f', 5) + path('M-40 -36q-14 -16 4 -20', 'none', 5) + circ(24, -62, 22, '#ffd23f', 5) + path('M42 -64L64 -58L42 -50Z', '#ff8a3d', 4) + circ(28, -68, 4, OL, 0)); }
function foamCan(x, y, s = 1) { return G(tr(x, y, s), rect(-12, -130, 24, 24, '#fff', 4, 4) + rect(-24, -110, 48, 110, '#e8ecf2', 8, 0) + rect(-24, -80, 48, 40, '#4d7cf0', 0, 0) + rect(-24, -110, 48, 110, 'none', 8, 5)); }
function medCab(x, y, w, h, c = '#fbf6ee') { return rect(x, y, w, h, c, 10, 5) + line(x + w / 2, y + 8, x + w / 2, y + h - 8, 4) + circ(x + w / 2 - 14, y + h / 2, 5, OL, 0) + circ(x + w / 2 + 14, y + h / 2, 5, OL, 0) + G(tr(x + w * .25, y + h * .3), rect(-8, -22, 16, 44, '#e2463a', 2, 0) + rect(-22, -8, 44, 16, '#e2463a', 2, 0)); }
function hairDryer(x, y, s = 1, c = '#b56cff') { return G(tr(x, y, s), circ(0, -24, 12, 'none', 4) + rect(-14, 0, 28, 110, c, 12, 5) + path('M-50 -10L60 -10Q80 -10 80 20Q80 50 60 50L-50 50Q-70 50 -70 20Q-70 -10 -50 -10Z', c, 5) + rect(80, 0, 26, 40, '#8a96a3', 4, 4)); }
// --- famille / table ---
function sideboard(x, y, w, h = 200, c = '#a8774e') { let s = rect(x, y, w, h, c, 8, 5); for (let i = 0; i < Math.floor(w / 160); i++) s += rect(x + 16 + i * 160, y + 24, 140, h - 44, shade(c, .1), 6, 4) + circ(x + 86 + i * 160, y + 44, 6, OL, 0); return s + rect(x - 10, y - 16, w + 20, 22, shade(c, .15), 6, 5); }
function vase(x, y, s, t) { let f = ''; for (let i = 0; i < 5; i++) f += G(tr(0, -66, 1, -40 + i * 20 + wave(t, .4, 3, i * .2)), line(0, 0, 0, -90, 4, '#3f8a4f') + circ(0, -96, 16, PAL[i], 4) + circ(0, -96, 6, '#fff', 0)); return G(tr(x, y, s), f + path('M-24 0L24 0Q42 -40 14 -70L-14 -70Q-42 -40 -24 0Z', '#5ec4f0', 5)); }
function balloon(x, y, s, t, c, ph = 0) { return G(tr(x, y + wave(t, .5, 10, ph), s, wave(t, .35, 5, ph)), path('M0 76q-14 40 6 80t-4 80', 'none', 3) + ell(0, 0, 56, 68, c, 5) + path('M-8 66L8 66L0 78Z', c, 4) + ell(-20, -24, 10, 18, 'rgba(255,255,255,.55)', 0)); }
function pendulumClock(x, y, s, t) { const a = wave(t, .5, 18); return G(tr(x, y, s), rect(-60, -150, 120, 330, '#8a5a3a', 18, 5) + circ(0, -80, 46, '#fbf6e8', 5) + line(0, -80, 0, -112, 5) + line(0, -80, 22, -80, 5) + rect(-36, -18, 72, 170, '#5a3e28', 10, 4) + G(`translate(0 -18) rotate(${f1(a)})`, line(0, 0, 0, 120, 4, '#c9a24a') + circ(0, 130, 20, '#ffc93c', 4))); }
function gift(x, y, s, c = '#ff6fa5', c2 = '#ffd23f') { return G(tr(x, y, s), rect(-50, -90, 100, 90, c, 6, 5) + rect(-10, -90, 20, 90, c2, 0, 0) + rect(-50, -90, 100, 90, 'none', 6, 5) + path('M0 -90q-30 -40 -40 -10q20 6 40 10q30 -40 40 -10q-20 6 -40 10', c2, 5)); }
function wineGlass(x, y, s = 1, c = '#c94f6a') { return G(tr(x, y, s), ell(0, 0, 24, 6, 'rgba(230,245,255,.9)', 4) + line(0, 0, 0, -44, 5) + path('M-24 -100L24 -100Q24 -44 0 -44Q-24 -44 -24 -100Z', 'rgba(230,245,255,.8)', 5) + path('M-21 -80L21 -80Q18 -50 0 -50Q-18 -50 -21 -80Z', c, 0)); }
function roast(x, y, s = 1) { return G(tr(x, y, s), ell(0, 0, 110, 20, '#fff', 5) + ell(0, -36, 80, 46, '#c47a3a', 5) + path('M-40 -50q20 -20 50 -12', 'none', 5, '#e8a868') + G(tr(66, -60, 1, -40), rect(-6, -30, 12, 40, '#fff', 5, 4) + circ(-6, -34, 9, '#fff', 4) + circ(6, -34, 9, '#fff', 4))); }
function saladBowl(x, y, s = 1) { return G(tr(x, y, s), ell(-30, -50, 30, 20, '#7be07b', 4) + ell(20, -56, 32, 22, '#5aa76a', 4) + circ(-4, -60, 12, '#e2463a', 3) + path('M-80 -40L80 -40Q70 10 0 10Q-70 10 -80 -40Z', '#fff', 5) + line(-74, -24, 74, -24, 4, '#5ec4f0')); }
function bread(x, y, s = 1) { return G(tr(x, y, s), path('M-90 0Q-100 -50 -40 -56L40 -56Q100 -50 90 0Z', '#e0a050', 5) + path('M-50 -40l14 -12M-10 -42l14 -12M30 -40l14 -12', 'none', 5, '#b07030')); }
// --- soirée ---
function speaker(x, y, s, t) { const p = 1 + .08 * Math.max(0, Math.sin(t * 13)); return G(tr(x, y, s), rect(-90, -320, 180, 320, '#2a2533', 14, 5) + circ(0, -235, 44 * p, '#4a4458', 5) + circ(0, -235, 16, '#7a7390', 0) + circ(0, -100, 62 * p, '#4a4458', 5) + circ(0, -100, 24, '#7a7390', 0) + circ(60, -300, 6, Math.sin(t * 13) > 0 ? '#7be07b' : '#2f5f3a', 0)); }
function discoBall(x, y, s, t) { let f = ''; for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) f += rect(-60 + i * 20, -60 + j * 20, 18, 18, Math.sin(t * 6 + i * 1.7 + j * 2.3) > .5 ? '#fff' : ['#c9d3dd', '#9aa6b4'][(i + j) % 2], 2, 0);
  const id = 'db' + (_wvid++); return G(tr(x, y, s), line(0, -M, 0, -54, 4) + `<defs><clipPath id="${id}"><circle cx="0" cy="0" r="56"/></clipPath></defs><g clip-path="url(#${id})">${circ(0, 0, 56, '#b9c3cf', 0)}${f}</g>` + circ(0, 0, 56, 'none', 5) + sparkle(30, -22, .35 + .2 * Math.sin(t * 9), '#fff')); }
function neonSign(x, y, str, t, col = '#ff4fa0', size = 64) { const on = Math.sin(t * 23) > -.85 && (t % 2.3) > .15, w = str.length * size * .66 + 60;
  return G(tr(x, y), rect(-w / 2, -size * .95, w, size * 1.4, '#1c1530', 18, 5) + (on ? glow(0, -size * .2, w * .7, col, .45) : '') + ftext(0, size * .22, str, { size, fill: on ? '#fff' : '#5a4a6a', stroke: on ? col : '#3a2e4a', sw: size * .14 })); }
function partyCup(x, y, s = 1) { return G(tr(x, y, s), path('M-90 -220L90 -220L70 0L-70 0Z', '#e2463a', 6) + rect(-96, -236, 192, 22, '#fff', 8, 6) + line(-60, -150, 60, -150, 5, 'rgba(255,255,255,.5)')); }
// --- école / labo ---
function schoolDesk(x, y, s = 1) { return G(tr(x, y, s), line(-90, -126, -90, 0, 8) + line(90, -126, 90, 0, 8) + rect(-80, -126, 160, 40, '#b8864f', 0, 4) + rect(-110, -150, 220, 24, '#d9a96a', 4, 5)); }
function paperPlane(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M-60 0L60 -10L-40 24Z', '#fff', 4) + path('M-60 0L60 -10L-20 6Z', '#e6eef5', 4)); }
function globeP(x, y, s) { return G(tr(x, y, s), rect(-40, -10, 80, 12, '#8a5a3a', 4, 4) + line(0, -10, 0, -40, 6) + G(tr(0, -100, 1, -20), circ(0, 0, 60, '#5ec4f0', 5) + path('M-30 -40Q-6 -20 -28 0Q-46 20 -20 40Q-40 30 -48 6Q-50 -24 -30 -40Z', '#7be07b', 3) + path('M12 -50Q42 -30 32 0Q22 20 42 30Q56 0 44 -30Q30 -50 12 -50Z', '#7be07b', 3))); }
function tubeLight(x, y, w, t, flick = 0) { const on = !flick || (t % 1.7) > .12; return (on ? glow(x, y + 30, w * .7, '#fffbe0', .3) : '') + rect(x - w / 2, y, w, 26, on ? '#fffbe6' : '#c9ced6', 13, 5) + line(x - w / 2 + 20, y - 40, x - w / 2 + 20, y, 4) + line(x + w / 2 - 20, y - 40, x + w / 2 - 20, y, 4); }
function beaker(x, y, s, t, c = '#7be07b', seed = 0) { let b = ''; for (let i = 0; i < 4; i++) { const k = (t * .9 + i / 4 + seed * .13) % 1; b += op(1 - k, circ(-14 + i * 9, -50 - k * 60, 5 + (i % 2) * 3, 'rgba(255,255,255,.8)', 2, shade(c, -.3))); }
  return G(tr(x, y, s), path('M-33 -4L33 -4L33 -46L-33 -46Z', c, 0) + path('M-36 0L36 0L36 -80L30 -88L-30 -88L-36 -80Z', 'rgba(220,240,255,.45)', 5) + line(-30, -46, 30, -46, 3, shade(c, -.2)) + b); }
function erlen(x, y, s, t, c = '#ff8fb1') { return G(tr(x, y, s), path('M-30 -30L30 -30L46 -4L-46 -4Z', c, 0) + path('M-14 -110L14 -110L14 -70L50 0L-50 0L-14 -70Z', 'rgba(220,240,255,.45)', 5) + steam(0, -120, t, .4)); }
function microscope(x, y, s) { return G(tr(x, y, s), rect(-60, -14, 120, 14, '#3b3f4a', 4, 4) + path('M30 -14L30 -120L0 -150', 'none', 16) + path('M30 -14L30 -120L0 -150', 'none', 8, '#9aa6b4') + rect(-44, -64, 80, 12, '#9aa6b4', 2, 4) + G(tr(-6, -150, 1, -35), rect(-14, -60, 28, 90, '#e8ecf2', 6, 4))); }
function tubeRack(x, y, s) { let r = ''; for (let i = 0; i < 4; i++) r += rect(-74 + i * 42, -110, 22, 100, 'rgba(220,240,255,.8)', 10, 4) + rect(-74 + i * 42, -60, 22, 50, PAL[i + 1], 10, 0); return G(tr(x, y, s), r + rect(-90, -40, 180, 40, '#c58e55', 4, 4)); }
// --- placard ---
function shirtHang(x, y, s, c, t, ph = 0) { return G(tr(x, y, s, wave(t, .4, 3, ph)), path('M0 0q0 -18 12 -18q12 0 10 12', 'none', 4) + path('M-56 26L-80 70L-58 84L-50 70L-50 230L50 230L50 70L58 84L80 70L56 26Q30 14 20 18Q0 40 -20 18Q-30 14 -56 26Z', c, 5) + path('M-60 30L0 4L60 30', 'none', 5) + line(0, 40, 0, 220, 3, shade(c, -.2))); }
function bulbChain(x, y, t) { const sw = wave(t, .5, 6); return G(`translate(${f1(x)} 0) rotate(${f1(sw)})`, line(0, -M, 0, y - 30, 4) + glow(0, y, 200, '#fff3b0', .35) + rect(-12, y - 40, 24, 18, '#9aa6b4', 3, 4) + circ(0, y, 26, '#fff6c8', 4) + line(16, y - 28, 16, y + 70, 3) + circ(16, y + 74, 6, '#c9a24a', 3)); }
function birdie(x, y, s, t) { const hop = Math.abs(Math.sin(t * 3)) * 14; return G(tr(x, y - hop, s), ell(0, -24, 30, 22, '#5ec4f0', 4) + circ(22, -44, 16, '#5ec4f0', 4) + circ(26, -48, 3.5, OL, 0) + path('M36 -46L50 -42L36 -38Z', '#ffb340', 3) + path('M-26 -30L-48 -40L-40 -20Z', '#3a9fd0', 4)); }

// ---------- décors vivants ----------
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => { let s = grad(a, b, -M, -M, W + 2 * M, H + 2 * M);
  for (let i = 0; i < 9; i++) s += op(.4 + .4 * Math.sin(t * 3 + i * 1.7), sparkle((i * 263) % W, 120 + (i * 151) % 560, .22 + (i % 3) * .08, '#fff'));
  s += cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff') + op(.7, cloud(((t * 10 + 300) % 1700) - 300, 640, .6, '#fff'));
  for (let i = 0; i < 3; i++) { const bx = ((t * 90 + i * 140) % 1500) - 200, by = 300 + i * 50 + wave(t, .6, 10, i * .3), f = wave(t, 3, 10, i * .3); s += path(`M${f1(bx - 24)} ${f1(by - f)}Q${f1(bx - 10)} ${f1(by - 10)} ${f1(bx)} ${f1(by)}Q${f1(bx + 10)} ${f1(by - 10)} ${f1(bx + 24)} ${f1(by - f)}`, 'none', 5, '#6a4fb0'); }
  s += ell(150, 1380, 620, 260, '#d9c4ff', 0) + ell(900, 1360, 560, 240, '#f2c4e6', 0) + ell(CX, 1600, 900, 300, '#c7b0f5', 5);
  for (let i = 0; i < 5; i++) { const x = 60 + i * 240; s += line(x, 1420, x, 1340, 6, '#8a5a3a') + circ(x, 1320, 40 + (i % 2) * 10, ['#a9e0b0', '#ffc6e0'][i % 2], 4); }
  return s; };
function drip(x, y, t) { const k = (t * 1.3) % 1; return circ(x, y + k * 160, 9, '#8fd0ff', 4); }
// salle de bain détaillée : carrelage + frise, plafonnier, plante suspendue, étagères, armoire à pharmacie, serviette, sèche-cheveux,
// reflet (porte) dans le miroir, post-it, meuble-vasque avec portes, objets sur le plan (gobelet, savon, tasse fumante, canard, mousse, plante), sol, plante floue au 1er plan
function bathroom2(t, c1 = '#cfeaf0', c2 = '#b2d6de') { const dk = shade(c1, -.22), lt = shade(c1, .5);
  let s = tiles(c1, c2) + rect(-M, 172, W + 2 * M, 30, dk, 0, 4) + Array.from({ length: 13 }, (_, i) => path(`M${i * 90 - 40} 187l14 -10l14 10l-14 10Z`, lt, 0)).join('') + barLight(CX, 214, 360);
  s += hangPlant(84, 300, t, 220) + shelfP(10, 640, 150) + flask(44, 640, .9, '#ff8fb1', 70) + flask(88, 640, .8, '#7be07b', 50) + jar(130, 640, .8, '#ffd23f') +
    shelfP(10, 880, 150) + circ(46, 856, 22, '#fff', 4) + circ(94, 856, 22, '#ffb3cb', 4) + circ(70, 818, 22, '#5ec4f0', 4) + hairDryer(62, 960, .62) + outlet(84, 1190, .9);
  s += medCab(922, 300, 140, 220) + line(915, 614, 1070, 614, 10, '#c9ced6') + towel(990, 760, 120, 300, '#ff8fb1', '#ffb3cb') + lightSwitch(992, 1000, .9);
  s += mirror(190, 300, 700, 820) + op(.3, rect(720, 560, 150, 560, shade(c1, -.1), 6, 4) + circ(742, 860, 9, OL, 0) + circ(260, 880, 14, '#c9ced6', 4)) + G(tr(960, 380, .55, 6), rect(0, 0, 84, 80, '#fff27a', 4, 4) + circ(28, 30, 5, OL, 0) + circ(56, 30, 5, OL, 0) + path('M24 50Q42 64 60 50', 'none', 4));
  s += rect(-M, 1290, W + 2 * M, 30, '#f4f1ea', 6, 5) + rect(-M, 1320, W + 2 * M, 460, '#d9b48a', 0, 5) + [40, 380, 720].map(x => rect(x, 1350, 320, 380, '#e2c29a', 10, 4) + rect(x + 130, 1380, 60, 12, '#8a6a4a', 6, 3)).join('') + tiles('#9fb7c0', '#8aa4ae', 110, -M, 1780, W + 2 * M, 600);
  s += sink(CX, 1300) + drip(CX - 110, 1250, t) + tbCup(70, 1290, 1) + soapPump(160, 1290, .9) + mug(236, 1290, .8, t, '#ffd23f') + duck(860, 1290, .9, t) + foamCan(948, 1290, .85) + potPlant(1032, 1290, .6, t, '#e98a5b');
  return s + fgBlur(potPlant(30, 2000, 2.4, t, '#e98a5b', '#4f9a5f', 1), 8); }
// macro du menton (le menton devient un paysage) : pores, grain de beauté, bouton, poil de nez, goutte de sueur, acarien qui se balade, col de chemise
function chinMacro(t, o = {}) { const mouth = o.mouth || 'smile', my = 430, r = rng(11);
  let s = tiles('#cfeaf0', '#b2d6de') + shelfP(-40, 1120, 170) + flask(40, 1120, .9, '#ff8fb1') + flask(90, 1120, .7, '#ffd23f', 50) + towel(1050, 1090, 120, 280, '#ff8fb1', '#ffb3cb') + line(990, 950, 1110, 950, 10, '#c9ced6');
  s += rect(CX - 300, 900, 600, 1400, SKIN, 7) + path(`M${CX - 120} 1010Q${CX} 1040 ${CX + 120} 1010`, 'none', 5, '#c99a78') + path(`M-200 1300Q${CX} 1150 ${W + 200} 1300L${W + 200} ${H + 400}L-200 ${H + 400}Z`, HERO_SHIRT, 7);
  for (let x = 40; x < W; x += 90) s += line(x, 1320, x + 10, H + 50, 6, 'rgba(255,255,255,.14)');
  s += path(`M${CX - 340} 1268L${CX - 10} 1236L${CX - 120} 1400Z`, '#fff', 6) + path(`M${CX + 340} 1268L${CX + 10} 1236L${CX + 120} 1400Z`, '#fff', 6) + circ(CX, 1460, 12, '#fff', 4) + circ(CX, 1580, 12, '#fff', 4) + rect(CX + 200, 1480, 140, 120, shade(HERO_SHIRT, -.12), 8, 5);
  s += ell(CX, 260, 800, 860, SKIN, 7) + ell(CX - 430, 420, 120, 60, CHEEK, 0) + ell(CX + 430, 420, 120, 60, CHEEK, 0) + path(`M${CX - 90} 120Q${CX} 190 ${CX + 90} 120`, 'none', 9) + ell(CX - 45, 110, 22, 14, '#c99a78', 0) + ell(CX + 45, 110, 22, 14, '#c99a78', 0);
  for (let i = 0; i < 40; i++) { const a = r() * Math.PI, rr = .35 + r() * .55, px = CX + Math.cos(a) * 760 * rr, py = 260 + Math.sin(a) * 820 * rr; if (py > 280) s += circ(px, py, 3 + r() * 3, 'rgba(170,110,80,.25)', 0); }
  s += circ(CX + 250, 640, 11, '#8a5a3a', 0) + circ(CX - 300, 610, 17, '#ff9d8a', 3, '#e07a6a') + circ(CX - 305, 603, 5, '#fff', 0) + path(`M${CX - 45} 118q${f1(wave(t, 1.2, 8))} 22 -6 44`, 'none', 4);
  const sk = (t * .35) % 1; s += op(1 - sk * sk, sweat(CX + 360, 280 + sk * 360, .8));
  const mx = CX - 220 + ((t * 70) % 440), lg = Math.sin(t * 18) * 5; s += G(tr(mx, 1078, .8), [-12, 0, 12].map(dx => line(dx, 0, dx - 8 + lg, 14, 3) + line(dx, 0, dx + 8 - lg, -14, 3)).join('') + ell(0, 0, 22, 12, '#c9b2a0', 3) + circ(20, -2, 8, '#c9b2a0', 3) + circ(23, -4, 2, OL, 0));
  const m = { smile: `M${CX - 200} ${my}Q${CX} ${my + 110} ${CX + 200} ${my}`, flat: `M${CX - 170} ${my + 30}L${CX + 170} ${my + 30}`, wavy: `M${CX - 200} ${my + 30}q50 -40 100 0t100 0t100 0t100 0`, frown: `M${CX - 180} ${my + 70}Q${CX} ${my - 30} ${CX + 180} ${my + 70}` }[mouth];
  return s + path(m, 'none', 14) + fgBlur(circ(40, 1820, 110, 'rgba(255,255,255,.7)', 0) + circ(170, 1900, 80, 'rgba(255,255,255,.6)', 0) + circ(1030, 1860, 120, 'rgba(255,255,255,.6)', 0), 10); }
// chambre de jour : papier peint, fenêtre (nuages, immeubles, arbre) + rideaux, oiseau sur le rebord, cadres, étagère, horloge, bureau (lampe, ordi, tasse fumante), poster, parquet, tapis, baskets, sac
function bedroomDay(t) { let s = grad('#ffe6c8', '#ffd9b0', -M, -M, W + 2 * M, H + 2 * M) + wallpaper('rgba(255,255,255,.3)', 'stripes', -M, 1250) + wallpaper('rgba(230,150,110,.16)', 'dots', 0, 1220);
  s += windowView(640, 280, 320, 380, t) + curtain(576, 266, 92, 470, t, '#7be07b') + curtain(932, 266, 92, 470, t, '#7be07b') + potPlant(690, 660, .5, t, '#e98a5b') + birdie(890, 660, .9, t);
  s += photoFrame(140, 330, 240, 200, 0) + photoFrame(60, 580, 110, 130, 1) + photoFrame(196, 590, 150, 110, 2) + wallClock(520, 210, 52, t, 3) + lightSwitch(530, 770, .9);
  s += shelfP(30, 830, 300) + bookRow(46, 830, 6, 5) + trophy(256, 830, .8) + jar(306, 830, .7, '#ff8fb1');
  s += poster(990, 760, 130, 180, '#5ec4f0', sparkle(0, 0, .9, '#ffd23f'), 4) + desk(880, 1030, .8) + deskLamp(1010, 1006, .8, 0, '#ff8a3d') + rect(740, 988, 190, 18, '#9aa3ad', 6, 4) + mug(960, 1006, .65, t, '#5ec4f0') + rect(700, 950, 30, 56, '#ffd23f', 6, 4) + line(708, 950, 702, 920, 5, '#e2463a') + line(720, 950, 726, 924, 5, '#4d7cf0');
  s += outlet(620, 1200, .9) + plinth(1250) + parquet(1250) + rug(CX, 1520, 430, 100, '#b56cff', '#e0c8ff') + sneaker(170, 1440, 1.1, '#e2463a') + sneaker(270, 1450, 1.1, '#e2463a', -1) + backpack(960, 1460, 1.1) + cardboard(780, 1430, .9, 'BAZAR');
  return s + fgBlur(potPlant(1050, 2010, 2.3, t, '#d9825b', '#4f9a5f', 2), 8); }
// chambre de nuit : papier peint losanges, étoiles phosphorescentes, fenêtre ville la nuit + rideaux, poster planète, étagère (livres, coupe, lampe à lave), guitare, table de nuit (lampe, verre), fanion
function bedNight(t) { let s = grad('#1d2350', '#2e3570', -M, -M, W + 2 * M, H + 2 * M) + wallpaper('rgba(255,255,255,.04)', 'diamonds', -200, 1250);
  for (let i = 0; i < 12; i++) s += op(.35 + .5 * (Math.sin(t * 3 + i) > 0), sparkle((i * 173) % W, 70 + (i * 97) % 200, .22 + (i % 3) * .06, '#d8ffb0'));
  s += windowView(620, 260, 360, 420, t, { night: 1 }) + curtain(556, 246, 90, 520, t, '#6b5bd6') + curtain(950, 246, 90, 520, t, '#6b5bd6');
  s += poster(40, 290, 220, 280, '#2b2f6a', circ(0, -20, 56, '#ff8a3d', 5) + path('M-100 -10Q0 30 100 -30', 'none', 7, '#ffd23f') + sparkle(-60, 80, .3, '#fff') + sparkle(70, -90, .25, '#fff'), -3);
  s += shelfP(20, 720, 280) + bookRow(36, 720, 5, 3) + trophy(198, 720, .85) + lavaLamp(262, 720, .6, t) + guitar(230, 1220, .9, -8);
  s += G(tr(800, 760), path('M0 0L230 40L0 80Z', '#e2463a', 5) + ftext(78, 54, 'GO!', { size: 34, fill: '#fff', stroke: 'none' })) + rect(-M, 1250, W + 2 * M, 1400, '#5a4a3a', 0, 0);
  s += nightstand(940, 1040, .8) + deskLamp(890, 1029, .7, 0, '#ffd23f') + glassW(990, 1029, .9) + rect(1012, 1012, 60, 16, '#e2463a', 3, 3) + rect(1018, 996, 52, 16, '#7be07b', 3, 3);
  return s; }
function bed(x, y, col = '#7aa6d8') { let s = rect(x - 560, y - 300, 80, 900, '#8a5a3a', 14) + circ(x - 520, y - 300, 34, '#a8774e', 5) + ell(x - 360, y - 70, 150, 60, '#fff', 6) + path(`M${x - 460} ${y - 70}q100 -20 200 0`, 'none', 4, '#dfe6ee') + rect(x - 520, y - 40, 1040, 600, col, 40);
  for (let i = 0; i < 14; i++) s += circ(x - 480 + i * 75, y + 40 + (i % 2) * 60, 10, shade(col, .3), 0);
  return s + path(`M${x - 500} ${y - 30}Q${x} ${y - 90} ${x + 520} ${y - 30}`, 'none', 7, shade(col, -.25)) + teddy(x + 380, y - 30, .8); }
// réunion de famille : papier peint rayé + soubassement, lustre, fanions, cadres, horloge à balancier, ballons, buffet (vase, cadeau, bouteille), plante, cousins
function famille(t, o = {}) { const c2 = o.c2 || '#ffd9a0'; let s = grad(o.c1 || '#ffe8c4', c2, -M, -M, W + 2 * M, H + 2 * M); for (let i = -6; i < 16; i++) s += rect(i * 110, -M, 40, H + 2 * M, 'rgba(255,255,255,.3)', 0, 0);
  s += rect(-M, 960, W + 2 * M, 300, shade(c2, -.12), 0, 4) + rect(-M, 952, W + 2 * M, 18, shade(c2, -.25), 0, 4); for (let x = -40; x < W + 40; x += 70) s += line(x, 975, x, 1250, 3, shade(c2, -.2));
  s += ceilingLamp(CX, 150, t, '#ffd23f') + photoFrame(120, 380, 200, 160, 2) + photoFrame(780, 340, 170, 210, 1) + photoFrame(370, 340, 110, 130, 0) + photoFrame(560, 380, 150, 110, 3) + pendulumClock(1010, 720, .7, t);
  let fl = `M-40 250`; for (let i = 0; i < 12; i++) fl += `Q${i * 100 + 10} ${f1(290 + wave(t, .7, 8, i * .2))} ${i * 100 + 60} 250`; s += path(fl, 'none', 5);
  for (let i = 0; i < 11; i++) s += G(tr(i * 100 + 30, 262 + wave(t, .7, 6, i * .2), 1, wave(t, .9, 6, i * .3)), path('M-28 0L28 0L0 56Z', ['#ff6fa5', '#ffd23f', '#5ec4f0', '#7be07b'][i % 4], 5));
  s += balloon(60, 560, .9, t, '#ff6fa5', 0) + balloon(150, 650, .75, t, '#5ec4f0', .4) + balloon(1040, 470, .8, t, '#ffd23f', .2);
  s += sideboard(-20, 1040, 1120, 220) + vase(380, 1024, .8, t) + gift(770, 1024, .7) + gift(830, 1024, .5, '#5ec4f0', '#fff') + flask(1040, 1024, 1.1, '#3f9a54', 80) + potPlant(40, 1250, 1.3, t, '#d9825b', '#5aa76a', 3);
  for (let i = 0; i < 3; i++) s += person({ age: 'adult', x: 160 + i * 380 + (i === 1 ? 60 : 0), y: 1200, s: .55, hair: ['curly', 'bun', 'short'][i], hairColor: ['#2b2420', '#8a5a3a', '#e0a040'][i], shirt: ['#7aa6d8', '#ffd23f', '#b56cff'][i], expr: ['laugh', 'happy', 'talk'][i], seed: 30 + i }, t);
  return s; }
function table(y = 1240, t = 0) { return rect(-M, y, W + 2 * M, 900, '#fff', 0, 7) + path(`M-200 ${y + 40}${Array.from({ length: 14 }, (_, i) => `q40 30 80 0`).join('')}`, 'none', 6, '#e2463a') + saladBowl(90, y, .8) + roast(300, y, .9) + wineGlass(450, y, .9) + wineGlass(700, y, .9, '#ffd23f') + bread(1010, y, .7) +
  G(tr(870, y - 10), path('M-70 0L70 0L50 -110L-50 -110Z', '#f4c27a', 6) + rect(-10, -150, 20, 40, '#ff8fb1', 4, 4) + G(tr(0, -165, 1 + .15 * Math.sin(t * 20)), path('M0 -22Q12 -2 0 8Q-12 -2 0 -22Z', '#ffb340', 3))) + rect(560, y - 160, 50, 160, '#5fb85f', 8, 6) + rect(573, y - 200, 24, 50, '#5fb85f', 4, 5); }
// soirée : mur de briques, fenêtres sur la ville, boule à facettes + taches de lumière, guirlande, néon PARTY qui clignote, enceintes qui pulsent, danseurs, piste lumineuse, gobelet flou au 1er plan
function soiree(t, dim = 0) { let s = grad('#2a1f55', '#4b2b6e', -M, -M, W + 2 * M, H + 2 * M) + wallpaper('rgba(255,255,255,.04)', 'bricks', 300, 1250);
  s += windowView(40, 360, 220, 300, t, { night: 1 }) + windowView(820, 360, 220, 300, t, { night: 1 });
  for (let i = 0; i < 14; i++) s += op(.35, circ((i * 233) % (W + 200) - 100, 200 + (i * 151) % 900, 30 + (i % 4) * 18, ['#ff6fa5', '#ffd23f', '#5ec4f0', '#b56cff'][i % 4], 0));
  for (let i = 0; i < 6; i++) s += op(.2, ell(CX + 480 * Math.sin(t * .8 + i), 560 + 320 * Math.cos(t * .6 + i * 1.3), 50, 32, PAL[i], 0));
  s += neonSign(CX, 720, 'PARTY', t, '#ff4fa0', 54) + discoBall(CX, 96, 1, t);
  let wire = 'M-60 170'; for (let i = 0; i < 6; i++) wire += `Q${i * 200 + 40} 260 ${i * 200 + 140} 170`; s += path(wire, 'none', 5);
  for (let i = 0; i < 12; i++) { const x = i * 100 - 10, y = 170 + 45 * Math.sin(((i % 2) + .5) * Math.PI / 2) * (i % 2 ? .6 : 1) + 18; s += circ(x + 40, y, 16, Math.sin(t * 5 + i * 1.3) > -.3 ? ['#fff6a8', '#ff9fd0', '#a8f0ff'][i % 3] : '#6b5a7a', 4); }
  s += balloon(70, 330, .7, t, '#ff6fa5', 0) + balloon(1010, 320, .7, t, '#ffd23f', .3) + speaker(70, 1250, 1, t) + speaker(1010, 1250, 1, t);
  for (let i = 0; i < 4; i++) s += person({ age: 'adult', x: 90 + i * 300, y: 1220 + wave(t, 2, 12, i * .25), s: .5, hair: ['curly', 'ponytail', 'short', 'bun'][i], hairColor: ['#2b2420', '#e0a040', '#8a5a3a', '#c4521b'][i], shirt: ['#5ec4f0', '#7be07b', '#ffd23f', '#ff8fb1'][i], expr: 'joy', armL: [200 + wave(t, 2, 30, i * .3), 230], armR: [-20, -50 + wave(t, 2, 30, i * .3)], seed: 60 + i }, t);
  s += rect(-M, 1250, W + 2 * M, 1400, '#2b2440', 0, 0); for (let j = 0; j < 7; j++) for (let i = -2; i < 10; i++) { const on = Math.sin(t * 4 + i * 1.3 + j * 2.1) > .4; s += rect(i * 140, 1250 + j * 110, 140, 110, on ? PAL[(i + j + 16) % 8] : 'rgba(255,255,255,.03)', 0, 3, '#1c1530').replace('/>', on ? ' fill-opacity=".38"/>' : '/>'); }
  s += fgBlur(partyCup(60, 2000, 1.6), 8);
  return s + (dim ? rect(-M, -M, W + 2 * M, H + 2 * M, `rgba(10,5,30,${dim})`, 0, 0) : ''); }
// salle d'examen : néons (un clignote), frise alphabet, tableau + craies, carte, globe, soubassement, horloge, pupitres vides, avion en papier, parquet, sac, poubelle
function examRoom(t) { let s = grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 900, W + 2 * M, 350, '#a9d1b2', 0, 4) + rect(-M, 892, W + 2 * M, 18, '#7fa88a', 0, 4); for (let x = -40; x < W + 40; x += 60) s += line(x, 912, x, 1250, 3, 'rgba(0,0,0,.08)');
  s += tubeLight(200, 50, 240, t) + tubeLight(540, 50, 240, t, 1) + tubeLight(880, 50, 240, t);
  for (let i = 0; i < 8; i++) s += G(tr(130 + i * 117, 160, 1, wave(t, .3, 2, i * .2)), rect(-40, -34, 80, 68, '#fff', 6, 4) + ftext(0, 18, 'ABCDEFGH'[i], { size: 46, fill: PAL[i], stroke: 'none' }));
  s += blackboard(80, 230, 920, 380, ftext(700, 450, 'silence.', { size: 60, fill: 'rgba(255,255,255,.7)', stroke: 'none' }) + ftext(280, 330, '2 + 2 = 4', { size: 40, fill: 'rgba(255,255,255,.45)', stroke: 'none' })) + rect(300, 600, 40, 12, '#fff', 4, 3) + rect(360, 600, 30, 12, '#ffd23f', 4, 3) + rect(720, 594, 90, 20, '#8a5a3a', 4, 4);
  s += poster(470, 660, 220, 160, '#bfe3f5', path('M-80 -30Q-40 -60 -10 -30Q10 10 -30 40Q-70 30 -80 -30Z', '#7be07b', 4) + path('M20 -40Q70 -50 80 0Q60 50 30 30Q10 0 20 -40Z', '#7be07b', 4), 2) + wallClock(960, 700, 60, t, 3) + globeP(1010, 892, .7);
  s += plinth(1250, '#7fa88a') + parquet(1250) + schoolDesk(140, 1250, .75) + schoolDesk(1000, 1250, .75) + backpack(960, 1420, 1, '#ff8a3d') + trashBin(70, 1420, 1);
  s += paperPlane(-160 + ((t * 300) % 1500), 650 + wave(t, .7, 26), .8, 6 + wave(t, .7, 8));
  return s; }
// labo : néons, panneau LABO, danger, aération, tableau, poster tableau périodique, paillasse avec microscope, béchers qui bouillonnent, tubes, erlen fumant
function labBoard(t) { let s = grad('#e8f4ff', '#cfe6fb', -M, -M, W + 2 * M, H + 2 * M) + tiles('rgba(0,0,0,0)', 'rgba(120,150,180,.22)', 80, -M, 900, W + 2 * M, 260);
  s += tubeLight(200, 40, 220, t) + tubeLight(880, 40, 220, t, 1) + rect(420, 120, 240, 90, '#fff', 12, 5) + ftext(CX, 185, 'LABO', { size: 56, fill: '#4d7cf0', stroke: 'none' });
  s += G(tr(970, 180), path('M0 -50L50 40L-50 40Z', '#ffd23f', 5) + ftext(0, 30, '!', { size: 50, fill: OL, stroke: 'none' })) + rect(60, 120, 150, 80, '#cfd8e2', 8, 5) + [0, 1, 2, 3].map(i => line(76, 138 + i * 16, 194, 138 + i * 16, 4)).join('');
  s += blackboard(60, 250, 960, 640, '');
  let pt = rect(40, 930, 200, 140, '#fff', 8, 5); for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) if (!(j < 2 && i > 0 && i < 5)) pt += rect(52 + i * 31, 944 + j * 30, 26, 24, PAL[(i + j) % 8], 3, 2); s += pt + rect(880, 940, 120, 80, '#36a85a', 8, 5) + rect(925, 952, 30, 56, '#fff', 3, 0) + rect(912, 965, 56, 30, '#fff', 3, 0);
  s += rect(-M, 1150, W + 2 * M, 30, '#3b3f4a', 4, 5) + rect(-M, 1180, W + 2 * M, 900, '#cfd8e2', 0, 5) + [30, 380, 730].map(x => rect(x, 1210, 320, 160, '#e3e9f0', 8, 4) + rect(x + 130, 1236, 60, 12, '#8a96a3', 6, 3)).join('');
  s += beaker(150, 1150, .8, t, '#7be07b') + flask(232, 1150, .8, '#b56cff', 60) + microscope(330, 1150, .9) + tubeRack(820, 1150, .7) + erlen(950, 1150, .8, t, '#ff8fb1') + beaker(1040, 1150, .6, t, '#5ec4f0', 2);
  return s; }
// placard : portes ouvertes (1er plan flou), planches, étagère haute (cartons, chapeau), tringle + chemises, ampoule à chaînette qui balance, étagère du milieu, chaussures, carton souvenirs, ballon, poussières
function closetBg(t) { let s = grad('#c49a6c', '#a87c50', -M, -M, W + 2 * M, H + 2 * M) + wallpaper('rgba(255,255,255,.07)', 'stripes', -M, 1250) + parquet(1250, '#8a5a3a', '#6b4a2a');
  s += rect(80, 250, 920, 1000, '#5a3e28', 20) + rect(110, 280, 860, 940, '#3b2a1c', 10, 0); for (let x = 196; x < 970; x += 86) s += line(x, 282, x, 1218, 3, 'rgba(0,0,0,.3)');
  s += path('M440 330L260 1220L820 1220L640 330Z', 'rgba(255,240,180,.06)', 0);
  s += cardboard(210, 400, .8, 'NOËL') + cardboard(360, 400, .7, 'PAPIERS') + cardboard(300, 330, .55, '') + G(tr(880, 400), ell(0, 0, 80, 16, '#2b2b33', 4) + path('M-46 0Q-46 -60 0 -60Q46 -60 46 0Z', '#2b2b33', 4) + rect(-46, -16, 92, 12, '#e2463a', 0, 0)) + rect(110, 400, 860, 22, '#8a5a3a', 0, 5);
  s += line(560, 460, 960, 460, 8, '#c9ced6') + shirtHang(620, 460, .72, '#4d9de0', t, 0) + shirtHang(720, 460, .72, '#ff8fb1', t, .2) + shirtHang(820, 460, .72, '#7be07b', t, .4) + shirtHang(910, 460, .72, '#ffd23f', t, .6);
  s += rect(110, 900, 860, 30, '#8a5a3a', 0, 5) + flask(180, 900, 1, '#5ec4f0', 90) + flask(240, 900, .8, '#ff8a3d', 60) + cardboard(890, 900, .6, '');
  s += sneaker(200, 1215, 1.1, '#e2463a') + sneaker(310, 1215, 1.1, '#e2463a', -1) + circ(560, 1172, 44, '#ff8a3d', 5) + path('M520 1160Q560 1190 600 1160', 'none', 4) + cardboard(820, 1215, 1, 'SOUVENIRS');
  for (let i = 0; i < 14; i++) s += op(.6, circ(300 + (i * 89) % 480, 1200 - ((t * 40 + i * 83) % 800), 3, '#fff3c8', 0));
  s += bulbChain(540, 340, t);
  return s + fgBlur(path('M80 250L-90 190L-90 1320L80 1250Z', '#7a5236', 6) + circ(-20, 760, 14, '#c9a24a', 4) + path('M1000 250L1170 190L1170 1320L1000 1250Z', '#7a5236', 6), 5); }
// poil-personnage (macro) : base au sol (x, y), visage près du bout
function hairGuy(x, y, s, t, o = {}) { const sw = o.sway ?? wave(t, .8, 6, x * .01); const L = 260; let g = '';
  const d = `M0 0C34 -80 -34 -160 8 -${L}`;
  g += `<path d="${d}" fill="none" stroke="${OL}" stroke-width="40" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${o.col || HC}" stroke-width="24" stroke-linecap="round"/>`;
  if (o.shine) g += path(`M${-2} -60C20 -110 -14 -150 6 -200`, 'none', 6, 'rgba(255,255,255,.6)');
  const fy = -L + 50, mood = o.mood || 'happy';
  if (o.shades) g += path(`M-34 ${fy - 14}L34 ${fy - 14}L30 ${fy + 6}Q16 ${fy + 14} 4 ${fy + 2}L-4 ${fy + 2}Q-16 ${fy + 14} -30 ${fy + 6}Z`, '#1f1a18', 4);
  else for (const sd of [-1, 1]) g += circ(sd * 15, fy, 13, '#fff', 4) + (mood === 'sleep' ? line(sd * 15 - 9, fy, sd * 15 + 9, fy, 4) : circ(sd * 15 + 3, fy + 2, 5, OL, 0));
  if (mood === 'angry') g += line(-28, fy - 22, -6, fy - 14, 5) + line(28, fy - 22, 6, fy - 14, 5);
  g += mood === 'happy' || mood === 'chill' ? path(`M-12 ${fy + 24}Q0 ${fy + 36} 12 ${fy + 24}`, 'none', 5) : mood === 'angry' ? rect(-12, fy + 20, 24, 12, '#fff', 3, 4) : mood === 'scared' ? ell(0, fy + 28, 8, 11, '#7a2b2b', 4) : line(-10, fy + 26, 10, fy + 26, 5);
  if (o.sword) g += G(tr(14, -150, 1, o.sword), rect(-6, -150, 12, 150, '#dfe6ee', 4) + rect(-24, -6, 48, 12, '#c9a24a', 4) + rect(-6, 6, 12, 34, '#6b4a2a', 4));
  if (o.helmet) g += path(`M-46 ${fy - 26}Q0 ${fy - 90} 46 ${fy - 26}Z`, '#ffd23f', 5) + rect(-56, fy - 32, 112, 14, '#ffd23f', 6, 5);
  if (o.towel) g += path(`M-44 ${fy - 24}Q0 ${fy - 96} 44 ${fy - 24}Q0 ${fy - 40} -44 ${fy - 24}Z`, '#fff', 5);
  return G(tr(x, y, s, sw), g); }

// ---------- accessoires ----------
function cone(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M-40 0L-14 -150L14 -150L40 0Z', '#ff7a2a', 6) + path('M-30 -40L30 -40L24 -70L-24 -70Z', '#fff', 0) + path('M-20 -100L20 -100L16 -120L-16 -120Z', '#fff', 0) + rect(-60, -8, 120, 20, '#ff7a2a', 6, 6)); }
function tape(x1, y1, x2, y2) { const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; let s = rect(0, -24, L, 48, '#ffd23f', 0, 6); for (let i = 0; i < L / 80; i++) s += path(`M${i * 80} -24L${i * 80 + 40} -24L${i * 80 + 10} 24L${i * 80 - 30} 24Z`, '#2b2420', 0); return G(tr(x1, y1, 1, a), s + rect(0, -24, L, 48, 'none', 0, 6)); }
function signPost(x, y, s, l1, l2) { return G(tr(x, y, s), rect(-10, -40, 20, 220, '#8a5a3a', 6) + rect(-180, -200, 360, 200, '#fff', 20) + rect(-180, -200, 360, 200, 'none', 20, 10, '#e2463a') + ftext(0, -110, l1, { size: 52, fill: '#e2463a' }) + ftext(0, -40, l2, { size: 36, fill: OL, stroke: 'none' })); }
function razor(x, y, s, r = 0, broken = 0, t = 0) { const head_ = rect(-90, -40, 180, 70, '#c9ced6', 14) + rect(-80, -22, 160, 14, '#8a96a3', 4, 0) + rect(-80, 4, 160, 10, '#8a96a3', 4, 0); const handle = rect(-22, 26, 44, 230, '#4d7cf0', 18) + rect(-22, 120, 44, 50, '#2f5fd0', 0, 0);
  if (!broken) return G(tr(x, y, s, r), handle + head_);
  return G(tr(x, y, s, r), G(tr(0, 40, 1, 18), handle) + G(tr(-30, -40, 1, -24), head_ + Array.from({ length: 7 }, (_, i) => path(`M${-70 + i * 22} -40q8 -30 -4 -60`, 'none', 7, KC)).join('')) + path('M-6 0L14 10L-4 22L12 36', 'none', 6) + impactStar(60, -10, .4 + .1 * Math.sin(t * 20), '#fff3b0') + steam(-40, -140, t, .6)); }
function shield(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M0 -130Q90 -110 110 -90Q110 60 0 130Q-110 60 -110 -90Q-90 -110 0 -130Z', '#4d7cf0', 7) + path('M0 -90Q60 -76 74 -62Q74 40 0 88Q-74 40 -74 -62Q-60 -76 0 -90Z', '#ffd23f', 5) + ftext(0, 22, '!', { size: 90, fill: '#e2463a' })); }
function glove(x, y, s, r = 0) { return G(tr(x, y, s, r), ell(0, 0, 50, 42, '#e2463a', 6) + ell(-30, -18, 22, 18, '#e2463a', 5) + rect(-30, 26, 60, 34, '#fff', 8, 5)); }
function dreamBubble(x, y, rr, inner, k) { if (k <= 0) return ''; return G(tr(x, y, k), circ(-rr * .55, rr * 1.15, rr * .12, '#fff', 6) + circ(-rr * .75, rr * 1.42, rr * .07, '#fff', 5) + circ(0, 0, rr, '#fff', 7) + circ(-rr * .8, -rr * .4, rr * .45, '#fff', 7) + circ(rr * .8, -rr * .45, rr * .42, '#fff', 7) + circ(0, 0, rr * .92, '#fff', 0) + circ(-rr * .8, -rr * .4, rr * .37, '#fff', 0) + circ(rr * .8, -rr * .45, rr * .34, '#fff', 0) + inner); }
function cobweb(x, y, s) { let d = ''; for (let i = 0; i < 6; i++) { const a = R(i * 18); d += `M0 0L${f1(Math.cos(a) * 160)} ${f1(Math.sin(a) * 160)}`; } for (const rr of [50, 95, 140]) { d += `M${rr} 0`; for (let i = 1; i < 6; i++) { const a = R(i * 18); d += `Q${f1(Math.cos(a - R(9)) * rr * .8)} ${f1(Math.sin(a - R(9)) * rr * .8)} ${f1(Math.cos(a) * rr)} ${f1(Math.sin(a) * rr)}`; } } return G(tr(x, y, s), path(d, 'none', 4, 'rgba(255,255,255,.85)')); }
function thumbBuff(t) { return rect(-130, -250, 260, 200, '#ffb36b', 10, 0) + G(tr(0, -140, .62), head({ hr: 100, hair: 'side', hairColor: '#2b2420', expr: 'cool', seed: 70, hairFn: (r, tt) => { const [b, f] = hairSvg('side', '#2b2420', r, tt); return [b, f + megaBeard(r, tt, 1.3, '#2b2420')]; } }, t)) + rect(-130, -60, 260, 40, '#e2463a', 0, 0) + ftext(0, -30, 'EN 7 JOURS !!', { size: 30, fill: '#fff', stroke: 'none' }) + circ(0, -150, 34, 'rgba(255,255,255,.85)', 0) + path('M-10 -168L18 -150L-10 -132Z', '#e2463a', 0); }

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, tête en cut-out (3 poils), étoiles « débloqué », titre cinétique
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const U = at(1, 'barbe') - .05; return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 920, t, U, { part: 'back', r: 480 }) +
    G(tr(CX, 920, 1 + .03 * Math.sin(t * 6)), cutout(heroHead(0, 0, 175, { expr: t > at(1, 'pousse') ? 'jawdrop' : 'worried', pk: 1.3 }, t), 14)) + unlock(CX, 920, t, U, { part: 'front', r: 480 }) +
    funBox(CX, 1050, 330, 120, t, at(1, 'pas'), { label: 'barbe.png' }) +
    kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin('HORRIBLE QUAND TA BARBE', CX, 415, t, .3, { size: 52 }) + kword('NE POUSSE PAS ?', CX, 540, t, at(1, 'ne') - .05, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'barbe') - .05, 'sparkle', .6], [at(1, 'ne') - .05, 'boom', .6], [at(1, 'pas'), 'tick', .5]] });
// B002 — Kevin à 16 ans : papier + gobo, tête de Kevin en cut-out, la barbe JAILLIT
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Bb = at(2, 'barbe') - .1, bk = 1.2 * eOutBack(seg(t, Bb, Bb + .45)); return paper(SX.paper) + gobo(T, .12) + burst(CX, 900, 380, t, .05, '#ffd9a0', 18) +
    cutout(kevinHead(CX, 860, 165, { expr: bk > .5 ? 'cool' : 'smug', bk }, t), 12) + popStars(CX, 1050, t, Bb + .2, 8, 330) +
    funTag(CX - 230, 450, 'KEVIN', t, at(2, 'kevin'), { size: 50, bg: '#5fb85f' }) + funTag(CX + 220, 480, '16 ANS', t, at(2, '16') - .05, { size: 72, bg: SX.acc2, fg: SX.ink, r: 5 }); },
  sfx: [[at(2, 'kevin'), 'pop', .6], [at(2, 'barbe') - .1, 'boing', .8], [at(2, 'barbe'), 'whoosh_up', .5], [at(2, '16') - .05, 'tada', .6]] });
// B003a — toi, à 25 ans : grille sombre, compteur 16 → 25, fier de rien
B(3, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => gridBg('#2a2440') + halftoneFade(SX.acc, .12, 1) + G(tr(CX, 960, 1 + .02 * Math.sin(t * 5)), cutout(heroHead(0, 0, 200, { expr: 'proud', pk: 1.2 }, t), 12)) +
    kthin('toi,', CX, 360, t, 0, { size: 62 }) + funTag(CX, 490, `${counter(16, 25, t, .1, at(3, '25') - .1)} ANS`, t, .1, { size: 78, bg: SX.acc, r: -3 }) + markerArrow(CX + 360, 640, CX + 190, 1080, t, at(3, '25') + .2, { bend: -70, col: SX.acc2 }) + markerText('adulte !', CX + 330, 620, t, at(3, '25') + .25, { size: 54, col: SX.acc2, r: 6 }),
  sfx: [[.1, 'clock_fast', .4], [at(3, '25'), 'ding', .7], [at(3, '25') + .2, 'scratch', .5]] });
// B003b — trois poils qui se battent en DUEL : macro du menton, épées, étincelles
B(3, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.04, shake: (t + .15) % .5 < .1 && t > .9 ? 7 : 0, r: -3 }),
  draw: (t, d, T) => { const D = at(3, 'battent') - at(3, 'tu') + .15, clash = t > D ? Math.sin(t * 12) : 0; return chinMacro(t, { mouth: 'wavy' }) +
    hairGuy(260 + clash * 30, 980, 1.05, t, { mood: 'angry', sword: 40 + clash * 30 }) + hairGuy(820 - clash * 30, 1000, 1.05, t, { mood: 'angry', sword: -40 - clash * 30, sway: -6 }) + hairGuy(960, 860, .8, t, { mood: 'scared', sway: 4 }) +
    (t > D && Math.abs(clash) > .8 ? impactStar(CX, 740, .7, '#fff3b0') + sparkle(CX - 60, 700, .6, '#fff') : '') + funTag(270, 600, '3 POILS', t, at(3, 'trois') - at(3, 'tu') + .1, { size: 54, bg: SX.cool }) + kword('EN DUEL !', CX, 300, t, at(3, 'duel') - at(3, 'tu') + .1, { size: 92, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .5], [.3, 'pop', .5], [at(3, 'battent') - at(3, 'tu') + .15, 'zap', .5], [at(3, 'battent') - at(3, 'tu') + .45, 'crack', .4], [at(3, 'duel') - at(3, 'tu') + .1, 'boom', .5]] }, at(3, 'tu') - .15);
// B004 — tu te regardes dans le miroir : salle de bain, reflet confiant, crash léger sur « miroir »
B(4, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.1, eInOut(seg(t, at(4, 'miroir') - .2, d))), hand: .4 }),
  draw: (t, d, T) => bathroom2(t) + heroHead(CX, 740, 220, { expr: t > at(4, 'miroir') ? 'suspicious' : 'cool', look: [0, .3] }, t) + glow(CX, 700, 380, '#ffffff', .15),
  sfx: [[0, 'steps', .5], [at(4, 'regardes'), 'whoosh', .4], [at(4, 'miroir'), 'glint', .7]] });
// B005 — un poil à gauche, deux à droite : gros plan reflet, entourés au marqueur, compteurs
B(5, { enter: 'punch', cam: zin(1.04, 1.1, .3),
  draw: (t, d, T) => { const r = 300, y = 720, G1 = at(5, 'gauche'), D = at(5, 'droite'); return bathroom2(t) + heroHead(CX, y, r, { expr: 'suspicious', pk: 1.4 }, t) +
    markerCircle(CX - .55 * r, y + .7 * r, 75, 70, t, G1 - .1, { col: SX.acc }) + markerCircle(CX + .5 * r, y + .72 * r, 120, 85, t, D - .1, { col: SX.acc2 }) +
    funTag(CX - 330, y + 340, '1', t, G1, { size: 70, bg: SX.acc }) + funTag(CX + 340, y + 360, '2', t, D, { size: 70, bg: SX.acc2, fg: SX.ink }) + kthin('à gauche', CX - 280, 380, t, G1, { size: 50 }) + kthin('à droite', CX + 280, 380, t, D, { size: 50 }); },
  sfx: [[at(5, 'poil'), 'pop_hi', .5], [at(5, 'gauche') - .1, 'scratch', .5], [at(5, 'deux'), 'pop_hi', .5], [at(5, 'droite') - .1, 'scratch', .5]] });
// B006 — au milieu, rien : le menton désert, une boule d'herbe sèche traverse, grillons
B(6, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), r: 2 }),
  draw: (t, d, T) => { const k = seg(t, 0, d), R_ = at(6, 'rien'); return chinMacro(t, { mouth: 'flat' }) + hairGuy(170, 930, .7, t, { mood: 'neutral', sway: 10 }) + hairGuy(900, 960, .7, t, { mood: 'neutral', sway: -10 }) + hairGuy(1010, 840, .55, t, { mood: 'neutral', sway: -12 }) +
    Array.from({ length: 4 }, (_, i) => line(((t * 700 + i * 300) % 1400) - 200, 700 + i * 70, ((t * 700 + i * 300) % 1400) - 80, 700 + i * 70, 5, 'rgba(255,255,255,.7)')).join('') +
    tumbleweed(lerp(-150, 1250, k), 880 - Math.abs(Math.sin(t * 6)) * 60, .9, t * 400) + markerCircle(CX, 860, 180, 120, t, R_ - .1, { col: SX.acc }) + kword('RIEN.', CX, 300, t, R_ - .05, { size: 110, fill: '#fff' }); },
  sfx: [[0, 'wind', .6], [.1, 'crickets', .6], [at(6, 'rien') - .05, 'thud', .5], [at(6, 'rien'), 'scratch', .4]] });
// B007 — un chantier abandonné : plots, rubalise, panneau « TRAVAUX depuis 2019 », un poil casqué qui dort
B(7, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const C = at(7, 'chantier'); return chinMacro(t, { mouth: 'frown' }) + (t > C - .1 ? cone(CX - 180, 1010, 1, 0) + cone(CX + 170, 1030, 1.1, 8) + signPost(CX, 900, .85, 'TRAVAUX', 'depuis 2019') + tape(60, 1010, 1020, 960) + hairGuy(900, 1000, .7, t, { mood: 'sleep', helmet: 1, sway: 20 }) + ftext(980, 640 - (t * 40 % 40), 'z', { size: 56 }) : hairGuy(900, 1000, .7, t, { mood: 'neutral' })) +
    hairGuy(190, 950, .7, t, { mood: 'sleep', sway: -15 }) + kthin('on dirait un', CX, 260, t, .1, { size: 54 }) + stamp(CX, 400, 'ABANDONNÉ', t, at(7, 'abandonne') - .05, '#e2463a', -8); },
  sfx: [[at(7, 'chantier') - .1, 'hammer', .6], [at(7, 'chantier') + .1, 'pop', .5], [at(7, 'abandonne') - .05, 'thud', .8], [at(7, 'abandonne') + .2, 'wind', .5]] });
// B008a — tu achètes une huile : rayon salle de bain, ticket de caisse, extase
B(8, { enter: 'whip', cam: camHand(1.04, .5),
  draw: (t, d, T) => { const Hh = at(8, 'huile') - .1, k = pop(t, Hh, .4); return bathroom2(t, '#e9ddff', '#d6c6fa') + heroP({ x: CX, y: 1520, s: 1.4, expr: 'ecstatic', armR: [-60, -100], holdR: k > 0 ? G(tr(0, -40, k), rosemaryOil(0, 0, 1.1)) : '' }, t) + (k > 0 ? glow(CX + 190, 820, 200, '#fff6c8', .5) + popStars(CX + 190, 820, t, Hh + .1) : '') +
    funTag(CX, 420, 'HUILE MAGIQUE', t, Hh, { size: 56, bg: SX.acc }) + funTag(CX - 260, 620, '29,99 €', t, Hh + .25, { size: 44, bg: '#fff', fg: SX.ink, r: -10 }); },
  sfx: [[0, 'whoosh', .5], [at(8, 'huile') - .1, 'pop', .7], [at(8, 'huile'), 'kaching', .6], [at(8, 'huile') + .3, 'sparkle', .5]] });
// B008b — puis une brosse : gros plan, brosse géante qui coiffe… 3 poils
B(8, { enter: 'punch', cam: zin(1.05, 1.1, .3),
  draw: (t, d, T) => { const Bt = at(8, 'brosse') - at(8, 'puis') + .1, sw = Math.sin(t * 14) * 70; return bathroom2(t, '#e9ddff', '#d6c6fa') + heroHead(CX, 760, 260, { expr: 'zen', pk: 1.3, shine: 1 }, t) + G(tr(CX + 60 + sw, 1000, 1, -100), brush(0, 0, 1.6, 0, '#ffd23f')) +
    funTag(CX, 420, 'BROSSE', t, Bt - .1, { size: 64, bg: SX.acc2, fg: SX.ink }) + funTag(CX + 260, 560, '+19,99 €', t, Bt + .15, { size: 40, bg: '#fff', fg: SX.ink, r: 8 }); },
  sfx: [[.05, 'squeak', .4], [at(8, 'brosse') - at(8, 'puis'), 'pop', .6], [at(8, 'brosse') - at(8, 'puis') + .15, 'kaching', .5], [.5, 'squeak', .4]] }, at(8, 'puis') - .1);
// B009a — puis une TONDEUSE : contre-plongée, brandie comme une épée légendaire, rayons
B(9, { enter: 'crash', flash: 1, cam: () => ({ z: 1.05, cy: 1300, hand: .3 }),
  draw: (t, d, T) => { const Tt = at(9, 'tondeuse') - .1; return rays(t, CX, 760, '#b9a2ff', '#9a7cff', 22) + glow(CX + 150, 650, 360, '#fff6c8', .6) + heroP({ x: CX - 60, y: 1560, s: 1.45, expr: 'ecstatic', armR: [-55, -80], holdR: G(tr(0, -120, 1, 0), clippers(0, 0, 1.0, 0, t)) }, t) +
    (t > Tt ? popStars(CX + 60, 560, t, Tt, 8, 260) : '') + funTag(CX, 420, 'TONDEUSE PRO 3000', t, Tt, { size: 50, bg: SX.acc }); },
  sfx: [[0, 'flash_hit', .4], [at(9, 'tondeuse') - .1, 'angel', .6], [at(9, 'tondeuse'), 'buzz', .4], [at(9, 'tondeuse') + .3, 'kaching', .5]] });
// B009b — utilisée une fois tous les 4 mois : placard, toile d'araignée, poussière, calendrier qui défile
B(9, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.02, 1.08, .2),
  draw: (t, d, T) => { const t0 = at(9, 'que') - .1, Q = at(9, 'quatre') - t0; return closetBg(t) +
    G(tr(CX + 40, 880, 1, -75), clippers(0, 0, .9, 0, 0)) + Array.from({ length: 30 }, (_, i) => circ(330 + (i * 53) % 440, 820 + (i * 31) % 70 - ((t * 20 + i * 7) % 30), 4, 'rgba(230,220,200,.7)', 0)).join('') + cobweb(110, 280, 1.4) + cobweb(970, 280, 1.2).replace('<g transform="', '<g transform="scale(-1 1) translate(-1940 0) ') +
    G(tr(810, 500 + wave(t, .5, 20)), line(0, -240, 0, 0, 3, '#fff') + circ(0, 10, 22, '#2b2420', 0)) + calendarPage(300, 520, .9, wave(t, 2, 4), `${Math.min(4, 1 + Math.floor(seg(t, .1, Q) * 4))}`) + funTag(300, 690, 'MOIS', t, .1, { size: 40, bg: '#fff', fg: SX.ink }) +
    kword('4 MOIS', CX, 1090, t, Q - .05, { size: 100, fill: SX.acc2 }) + kthin('1 fois tous les…', CX, 1000, t, at(9, 'fois') - t0 - .1, { size: 46, out: Q - .1 }); },
  sfx: [[0, 'whoosh', .5], [.1, 'clock_fast', .5], [at(9, 'fois') - at(9, 'que') + .1, 'wind', .4], [at(9, 'quatre') - at(9, 'que') + .05, 'boom', .5], [at(9, 'mois') - at(9, 'que') + .3, 'rimshot', .4]] }, at(9, 'que') - .1);
// B010a — Kevin, lui, se plaint : sa salle de bain, barbe XXL, il pleure en fontaine
B(10, { enter: 'whip', cam: camHand(1.04, .6),
  draw: (t, d, T) => bathroom2(t, '#ffe0e6', '#f7c6d0') + kevin({ x: CX, y: 1540, s: 1.35, expr: t > at(10, 'lui') ? 'sob' : 'annoyed', bk: 1.25, armL: [200, 240], armR: [-20, -60] }, t) + funTag(CX, 420, 'KEVIN', t, at(10, 'kevin'), { size: 56, bg: '#5fb85f' }) + funTag(CX + 290, 600, 'OUIN', t, at(10, 'lui'), { size: 46, bg: '#fff', fg: SX.ink, r: 10 }),
  sfx: [[at(10, 'kevin'), 'pop', .6], [at(10, 'lui'), 'hmm', .5], [at(10, 'lui') + .1, 'boing', .5]] });
// B010b — se raser tous les matins : la barbe repousse instantanément (boing), réveil qui sonne
B(10, { enter: 'punch', cam: () => ({ z: 1.06, shake: 3 }),
  draw: (t, d, T) => { const cyc = (t * 2.2) % 1, bk = cyc < .55 ? 1.2 * (1 - eOutCubic(cyc / .55)) : 1.2 * eOutBack((cyc - .55) / .45); return bathroom2(t, '#ffe0e6', '#f7c6d0') + kevinHead(CX, 740, 230, { expr: 'rage', bk }, t) + razor(CX + 260 - cyc * 120, 980 - cyc * 140, 1.2, -30) +
    G(tr(200, 1020, 1, wave(t, 8, 8)), circ(0, 0, 80, '#e2463a') + circ(0, 0, 60, '#fff', 4) + line(0, 0, 0, -40, 6) + line(0, 0, 30, 0, 6) + circ(-60, -70, 26, '#e2463a') + circ(60, -70, 26, '#e2463a')) + motionLines(200, 900, 3, 40, -90) +
    funTag(CX, 420, `TOUS LES MATINS`, t, at(10, 'matins') - at(10, 'plaint') + .2, { size: 54, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[.05, 'buzz', .5], [.25, 'boing', .5], [.7, 'buzz', .4], [.7 + .25, 'boing', .5], [at(10, 'matins') - at(10, 'plaint') + .2, 'ring', .5]] }, at(10, 'plaint') - .3);
// B011a — tutoriels la nuit : lit, visage éclairé par le téléphone, 02:47
B(11, { enter: 'drop', cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => bedNight(t) + bed(CX, 1240) + glow(CX, 860, 420, '#9fd8ff', .45) + heroHead(CX, 880, 210, { expr: 'wow', look: [0, .5] }, t) + G(tr(CX, 1170, 1, 180), phone(0, 0, .9, 0)) + rect(-M, 1200, W + 2 * M, 900, '#7aa6d8', 30, 7) +
    bigClock(820, 450, '02:47', '#ff6b6b', .7) + funTag(250, 450, 'TUTOS', t, at(11, 'tutoriels') - .1, { size: 56, bg: SX.acc }),
  sfx: [[0, 'crickets', .4], [at(11, 'regarder'), 'typing', .5], [at(11, 'tutoriels') - .1, 'pop', .6]] });
// B011b — « BARBE COMPLÈTE EN 7 JOURS » : écran du téléphone, miniature, vues
B(11, { enter: 'crash', cam: zin(1.04, 1.1, .4),
  draw: (t, d, T) => { const t0 = at(11, 'intitules') - .15, S = at(11, 'sept') - t0; return bedNight(t) + glow(CX, 860, 520, '#9fd8ff', .5) + G(tr(CX, 900, 1.15 * (1 + .02 * Math.sin(t * 3))), rect(-170, -330, 340, 660, '#2b2b33', 44) + rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + G(tr(0, 60), thumbBuff(t)) + rect(-130, 70, 260, 18, '#c9d3dd', 9, 0) + rect(-130, 100, 180, 18, '#c9d3dd', 9, 0) + ftext(-130, 160, '12 M vues', { size: 28, fill: '#7a8a99', anchor: 'start', stroke: 'none' }) + rect(-50, -318, 100, 14, '#444', 7, 0)) +
    funTag(CX, 380, 'BARBE COMPLÈTE', t, at(11, 'barbes') - t0 - .1, { size: 50, bg: '#fff', fg: SX.ink }) + kword('EN 7 JOURS', CX, 510, t, S - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[0, 'pop_hi', .5], [at(11, 'barbes') - at(11, 'intitules'), 'pop', .5], [at(11, 'sept') - at(11, 'intitules') + .1, 'boom', .5], [at(11, 'jours') - at(11, 'intitules') + .3, 'sparkle', .5]] }, at(11, 'intitules') - .15);
// B012 — 7 jours plus tard : calendrier qui défile, même reflet, poils toujours là
B(12, { enter: 'none', trans: 'up', transD: .25, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const n = Math.min(7, 1 + Math.floor(seg(t, .05, at(12, 'tard')) * 7)), Tj = at(12, 'toujours'); return bathroom2(t) + heroHead(CX, 800, 230, { expr: t > Tj ? 'deadpan' : 'wow', pk: 1.2 }, t) + calendarPage(840, 470, .75, wave(t, 3, 3), `J+${n}`) +
    kthin('7 jours plus tard…', CX - 120, 380, t, .05, { size: 54 }) + markerCircle(CX + 20, 1010, 250, 80, t, Tj - .1, { col: SX.acc }) + markerText('toujours là.', CX, 1160, t, Tj + .1, { size: 56, col: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [.05, 'clock_fast', .5], [at(12, 'tard'), 'ding', .6], [at(12, 'toujours') - .1, 'scratch', .5], [at(12, 'la') + .1, 'rimshot', .4]] });
// B013 — mieux hydratés : macro spa, les 3 poils en serviette + lunettes, brillants, chill de ouf
B(13, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Hy = at(13, 'hydrat') - .1; return chinMacro(t, { mouth: 'smile' }) + Array.from({ length: 8 }, (_, i) => circ(150 + (i * 137) % 800, 1150 - ((t * 120 + i * 90) % 500), 12 + (i % 3) * 6, 'rgba(255,255,255,.6)', 4)).join('') +
    hairGuy(250, 980, 1, t, { mood: 'chill', shades: 1, towel: 1, shine: 1, sway: wave(t, .4, 4) }) + hairGuy(780, 1010, 1, t, { mood: 'chill', shades: 1, shine: 1, sway: wave(t, .4, 4, .3) }) + hairGuy(940, 880, .8, t, { mood: 'chill', towel: 1, shine: 1, sway: wave(t, .4, 4, .6) }) +
    sparkle(320, 700, .6 + .3 * Math.sin(t * 8), '#fff') + sparkle(850, 720, .5 + .3 * Math.sin(t * 9), '#fff') + kword('MIEUX HYDRATÉS', CX, 290, t, Hy, { size: 80, fill: SX.cool }); },
  sfx: [[0, 'waves', .4], [at(13, 'juste'), 'glint', .5], [at(13, 'hydrat') - .1, 'sparkle', .7], [at(13, 'hydrat') + .3, 'magic', .4]] });
// B014 — la densité dépend de la génétique : tableau « labo », barres Kevin 100 % vs toi 3 %, ADN
B(14, { enter: 'whip', cam: zin(1.02, 1.07, .2),
  draw: (t, d, T) => { const Dn = at(14, 'densite'), Gn = at(14, 'genetique'); return labBoard(t) + ftext(CX, 340, 'DENSITÉ DE BARBE', { size: 54, fill: 'rgba(255,255,255,.85)', stroke: 'none' }) +
    kevinHead(300, 540, 95, { expr: 'smug', bk: 1 }, t) + heroHead(780, 540, 95, { expr: 'worried' }, t) + G(tr(300, 780), bar(0, 0, 330, eOutCubic(seg(t, Dn, Dn + .8)), { col: '#7be07b' })) + G(tr(780, 780), bar(0, 0, 330, .03 + .0 * t, { col: SX.acc })) +
    ftext(300, 860, `${counter(0, 100, t, Dn, .8)} %`, { size: 50, fill: '#fff' }) + ftext(780, 860, '3 %', { size: 50, fill: '#fff' }) + (t > Gn - .3 ? G(tr(CX, 1080, 1, 90), dna(0, 0, .55, t)) : '') + kword('GÉNÉTIQUE', CX, 1080, t, Gn - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [at(14, 'densite'), 'whoosh_up', .4], [at(14, 'barbe'), 'pop_hi', .5], [at(14, 'genetique') - .05, 'boom', .5], [at(14, 'genetique') + .2, 'magic', .4]] });
// B015 — hormones + follicules pileux : 2 cartes 2.5D (molécule, follicule paresseux qui dort)
B(15, { enter: 'none', trans: 'wipe', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Ho = at(15, 'hormones') - .1, Fo = at(15, 'follicules') - .1; const mol = Array.from({ length: 3 }, (_, i) => G(tr(-60 + i * 60, -20 + (i % 2) * 50, 1, t * 30), path('M0 -40L35 -20L35 20L0 40L-35 20L-35 -20Z', ['#ff8fb1', '#ffd23f', '#5ec4f0'][i], 6))).join('');
    return paper(SX.paper) + gobo(T, .1) + card(290, 780, 380, 440, mol, t, Ho, { ry: lerp(30, 0, seg(t, Ho, Ho + .4)), bg: '#fff' }) + card(790, 780, 380, 440, G(tr(0, -40), follicle(0, 0, .85, .3, t)) + ftext(110, -140 - (t * 30 % 30), 'z', { size: 46, fill: SX.acc }), t, Fo, { ry: lerp(-30, 0, seg(t, Fo, Fo + .4)), bg: '#fff' }) +
    funTag(290, 1060, 'HORMONES', t, Ho + .1, { size: 46, bg: '#ff8fb1' }) + funTag(790, 1060, 'FOLLICULES', t, Fo + .1, { size: 46, bg: SX.cool }) + kthin('des hormones et de la sensibilité des', CX, 400, t, 0, { size: 44, fill: SX.ink }) + kword('FOLLICULES PILEUX', CX, 500, t, Fo, { size: 74, fill: SX.acc2 }); },
  sfx: [[at(15, 'hormones') - .1, 'pop', .6], [at(15, 'sensibilite'), 'tick', .5], [at(15, 'follicules') - .1, 'pop', .6], [at(15, 'pileux'), 'boing', .4]] });
// B016 — ce n'est PAS un examen de masculinité : copie barrée, ANNULÉ, étoiles « débloqué », soulagement
B(16, { enter: 'drop', cam: () => ({ z: 1.04, hand: .3 }),
  draw: (t, d, T) => { const Ex = at(16, 'examen') - .1, Ma = at(16, 'masculinite'); return examRoom(t) + unlock(760, 1000, t, Ma, { part: 'back', r: 420 }) + desk(760, 1300, 1.2) + heroP({ x: 760, y: 1520, s: 1.3, expr: t > Ma ? 'ecstatic' : 'scared', armL: [200, 230], armR: [-20, -50] }, t) + unlock(760, 1000, t, Ma, { part: 'front', r: 420 }) +
    G(tr(330, 780, pop(t, .05, .35), -8), rect(-210, -270, 420, 540, '#fff', 14) + ftext(0, -190, 'EXAMEN DE', { size: 40, fill: SX.ink, stroke: 'none' }) + ftext(0, -140, 'MASCULINITÉ', { size: 40, fill: SX.ink, stroke: 'none' }) + Array.from({ length: 5 }, (_, i) => line(-160, -60 + i * 60, 160, -60 + i * 60, 5, '#c9d3dd')).join('') + ftext(90, 210, '3/20', { size: 60, fill: '#e2463a', stroke: 'none' })) +
    (t < Ma - .05 ? cross(330, 780, 1.6, t, Ex + .2) : '') + stamp(330, 780, 'ANNULÉ', t, Ma - .05, '#36a85a', -14); },
  sfx: [[0, 'thud', .5], [at(16, 'pas'), 'heartbeat', .4], [at(16, 'examen') + .1, 'error_beep', .5], [at(16, 'masculinite') - .05, 'thud', .6], [at(16, 'masculinite') + .1, 'tada', .6]] });
// B017 — essaie d'expliquer ça à ton oncle : réunion de famille, schéma ADN, tonton mange son pilon
B(17, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const On = at(17, 'oncle') - .1; return depth({ zoom: 1, x: Math.sin(t) * 14 }, [{ z: 1.4, svg: famille(t), haze: .06 }, { z: 1, svg: heroP({ x: 300, y: 1500, s: 1.3, expr: 'effort', armR: [-40, -70] }, t) + G(tr(330, 760, 1, 6), rect(-150, -110, 300, 220, '#fff', 12) + G(tr(0, 0, 1, 90), dna(0, 0, .28, t, 8))) + oncle({ x: 800, y: 1500, s: 1.3, expr: 'deadpan', flip: 1, armL: [200, 250], holdL: G(tr(0, -20, 1, 30), ell(0, -30, 30, 44, '#c47a3a') + rect(-6, 0, 12, 50, '#fff', 4)) }, t) + table(1250, t) }]) +
    funTag(800, 450, 'TONTON', t, On, { size: 60, bg: SX.acc }) + funTag(300, 470, '… GÉNÉTIQUE !', t, at(17, 'expliquer'), { size: 40, bg: '#fff', fg: SX.ink }); },
  sfx: [[0, 'whoosh', .5], [at(17, 'expliquer'), 'typing', .4], [at(17, 'oncle') - .1, 'pop', .6], [at(17, 'oncle') + .3, 'chomp', .6]] });
// B018 — à chaque réunion de famille : flashs Noël / anniversaire / mariage, même tonton, même question
B(18, { cam: () => ({ z: 1.05, hand: .4 }),
  draw: (t, d, T) => { const n = Math.floor(t / .42) % 3, bg = [['#d8f0dc', '#b9e0c0'], ['#ffe8c4', '#ffd9a0'], ['#fbe3ff', '#efc6f7']][n]; return famille(t, { c1: bg[0], c2: bg[1] }) + (n === 0 ? G(tr(130, 900), path('M0 -300L140 0L-140 0Z', '#3f9a54', 7) + path('M0 -400L20 -360L60 -360L28 -336L40 -296L0 -320L-40 -296L-28 -336L-60 -360L-20 -360Z', '#ffd23f', 5)) : n === 1 ? G(tr(150, 900), circ(0, -200, 70, '#ff6fa5') + line(0, -130, 0, 80, 4) + circ(60, -260, 60, '#5ec4f0') + line(60, -200, 20, 80, 4)) : G(tr(150, 900), path('M-60 0L60 0L40 -120L-40 -120Z', '#fff', 6) + path('M-40 -120L40 -120L25 -210L-25 -210Z', '#fff', 6) + heart(0, -250, .6))) +
    oncleHead(CX + 60, 820, 240, { expr: 'mock', tilt: wave(t, 2, 4) }, t) + table(1250, t) + funTag(230, 420, ['NOËL', 'ANNIV', 'MARIAGE'][n], t, n * .42, { size: 46, bg: SX.cool }) + funTag(CX + 120, 1130, `RÉUNION N°${46 + Math.floor(t / .42)}`, t, .05, { size: 42, bg: SX.acc2, fg: SX.ink }) + op(1 - (t % .42) / .1, rect(-200, -200, W + 400, H + 400, '#fff', 0, 0)); },
  sfx: [[0, 'shutter', .6], [.42, 'shutter', .6], [.84, 'shutter', .6], [1.26, 'shutter', .6], [at(18, 'reunion'), 'pop_hi', .4], [at(18, 'famille'), 'hmm', .4]] });
// B019 — « Alors, ça pousse ? » : contre-plongée, crash zoom sur tonton, doigt pointé, flash
B(19, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.05, 1.15, t / d), cy: 1250, shake: t > at(19, 'pousse') ? 6 : 0 }),
  draw: (t, d, T) => famille(t) + burst(CX, 860, 520, t, 0, SX.acc2, 18) + oncleHead(CX, 860, 300, { expr: 'mock', tilt: -6 }, t) + G(tr(CX + 250, 1130, 1.1, -120), hand(0, 0, 1, 0, '#c94f4f')) +
    kword('ALORS,', CX, 370, t, at(19, 'alors') - .05, { size: 80, fill: '#fff' }) + kword('ÇA POUSSE ?', CX, 490, t, at(19, 'pousse') - .1, { size: 96, fill: SX.acc2 }),
  sfx: [[0, 'flash_hit', .5], [at(19, 'alors') - .05, 'pop', .5], [at(19, 'pousse') - .1, 'boom', .7], [at(19, 'pousse') + .25, 'rimshot', .5]] });
// B020 — un soir, tu rencontres quelqu'un : soirée, guirlande, coup de foudre (cœurs)
B(20, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const Q = at(20, 'quelqu'); return soiree(t) + heroP({ x: 320, y: 1500, s: 1.35, expr: t > Q - .3 ? 'love' : 'happy', look: [1, 0] }, t) + crush({ x: 780, y: 1500, s: 1.3, expr: 'happy', flip: 1, armL: [200, 230] }, t) + (t > Q - .3 ? heartsUp(t, 320, 900, 5) : '') +
    funTag(CX, 420, 'UN SOIR', t, at(20, 'soir') - .1, { size: 58, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .5], [at(20, 'soir') - .1, 'pop', .5], [at(20, 'quelqu') - .3, 'kiss', .5], [at(20, 'quelqu'), 'sparkle', .5]] });
// B021a — tu passes 20 minutes à expliquer : il parle à 200 à l'heure, horloge qui file, elle fige
B(21, { enter: 'whip', cam: camHand(1.05, .7),
  draw: (t, d, T) => { const Mi = at(21, '20') - .1; return soiree(t) + G(tr(900, 470, .9), circ(0, 0, 90, '#fff') + line(0, 0, 0, -60, 8) + G(`rotate(${f1(t * 900)})`, line(0, 0, 0, -75, 5, SX.acc))) + heroP({ x: 340, y: 1500, s: 1.35, expr: 'talk', face: { eyes: 'wide', brows: 'sad' }, armL: [200 + wave(t, 4, 30), 230], armR: [-30, -60 + wave(t, 4, 40, .5)] }, t) + sweatSpray(340, 900, t, 4) +
    crush({ x: 800, y: 1500, s: 1.3, expr: 'deadpan', flip: 1 }, t) + funTag(900, 640, `${counter(0, 20, t, Mi, d - Mi)} MIN`, t, Mi, { size: 52, bg: SX.acc2, fg: SX.ink }) + funTag(360, 450, 'BLA BLA BLA', t, .05, { size: 44, bg: '#fff', fg: SX.ink, r: wave(t, 3, 4) }); },
  sfx: [[0, 'whoosh', .5], [at(21, '20') - .1, 'clock_fast', .6], [at(21, 'expliquer'), 'typing', .4]] });
// B021b — « pourquoi je n'ai pas de barbe » : il sort une présentation (diaporama 12/47), camembert
B(21, { enter: 'punch', cam: zin(1.03, 1.08),
  draw: (t, d, T) => { const t0 = at(21, 'pourquoi') - .15, Bb = at(21, 'barbe') - t0, sl = 12 + Math.floor(t / .35); const pie = circ(0, 0, 120, '#ff8fb1', 6) + path('M0 0L0 -120A120 120 0 0 1 114 37Z', '#ffd23f', 6) + path('M0 0L114 37A120 120 0 0 1 -40 113Z', '#5ec4f0', 6);
    return soiree(t, .15) + G(tr(CX, 700), rect(-400, -280, 800, 520, '#fff', 20) + ftext(0, -200, 'POURQUOI PAS DE BARBE ?', { size: 40, fill: SX.ink, stroke: 'none' }) + G(tr(-160, 30, pop(t, .1)), pie) + ftext(150, -40, 'génétique', { size: 34, fill: '#d0507a', stroke: 'none' }) + ftext(150, 30, 'hormones', { size: 34, fill: '#c49a00', stroke: 'none' }) + ftext(150, 100, 'malchance', { size: 34, fill: '#2a8fc0', stroke: 'none' }) + ftext(330, 220, `${sl}/47`, { size: 28, fill: '#7a8a99', stroke: 'none' })) +
    heroP({ x: 250, y: 1560, s: 1.15, expr: 'effort', armR: [-40, -50] }, t) + line(390, 980, 560 + wave(t, 2, 40), 760, 8, '#8a5a3a') + funTag(820, 1080, '47 SLIDES', t, Bb - .2, { size: 46, bg: SX.acc }); },
  sfx: [[.1, 'pop_hi', .5], [.45, 'pop_hi', .4], [.8, 'pop_hi', .4], [at(21, 'barbe') - at(21, 'pourquoi'), 'pop', .6]] }, at(21, 'pourquoi') - .15);
// B022 — la personne te regarde, perplexe : gros plan, points d'interrogation, grillons
B(22, { enter: 'none', trans: 'glitch', transD: .2, cam: zin(1.04, 1.12),
  draw: (t, d, T) => { const P = at(22, 'perplexe') - .1; return soiree(t) + crushHead(CX, 820, 260, { expr: t > P ? 'confused' : 'deadpan', tilt: t > P ? 10 : 0 }, t) + qmark(CX + 320, 560, pop(t, P, .3) * 1.1, '#fff', 12) + qmark(CX - 330, 620, pop(t, P + .15, .3) * .8, SX.acc2, -14) + qmark(CX + 260, 1060, pop(t, P + .3, .3) * .7, SX.cool, 8) +
    funTag(CX, 420, 'PERPLEXE', t, P, { size: 56, bg: SX.cool }); },
  sfx: [[0, 'crickets', .5], [at(22, 'regarde'), 'hmm', .4], [at(22, 'perplexe') - .1, 'pop', .5], [at(22, 'perplexe') + .2, 'pop_hi', .4]] });
// B023 — « Mais je ne t'ai rien demandé » : plan à deux, elle blasée, toi mâchoire au sol
B(23, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(23, 'rien') ? 5 : 0 }),
  draw: (t, d, T) => { const Ri = at(23, 'rien') - .05; return soiree(t) + crush({ x: 300, y: 1500, s: 1.35, expr: 'annoyed', armL: [160, 230], armR: [20, -50] }, t) + heroP({ x: 790, y: 1500, s: 1.3, expr: t > Ri ? 'jawdrop' : 'talk', flip: 1 }, t) + (t > Ri ? emark(830, 760, pop(t, Ri, .3), '#ff4d4d', 10) : '') +
    kthin('mais je ne t’ai', CX, 370, t, 0, { size: 56 }) + kword('RIEN DEMANDÉ.', CX, 490, t, Ri, { size: 88, fill: SX.acc2 }); },
  sfx: [[0, 'scratch', .6], [at(23, 'rien') - .05, 'boom', .6], [at(23, 'rien') + .1, 'gasp', .6], [at(23, 'demande') + .3, 'crickets', .4]] });
// B024a — tu réalises : prise de conscience (étoiles « débloqué »), bouclier levé pour rien
B(24, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d) }),
  draw: (t, d, T) => { const Re = at(24, 'realises') - .05, De = at(24, 'defendu') - .1; return soiree(t, .35) + unlock(CX, 880, t, Re, { part: 'back', r: 460 }) + heroP({ x: CX, y: 1520, s: 1.4, expr: 'shock', armR: [-50, -80], holdR: t > De ? G(tr(0, -60, pop(t, De, .35)), shield(0, 0, .9)) : '' }, t) + unlock(CX, 880, t, Re, { part: 'front', r: 460 }) +
    kthin('tu réalises…', CX, 380, t, 0, { size: 60 }) + funTag(CX, 500, 'MODE DÉFENSE', t, De, { size: 52, bg: SX.acc }); },
  sfx: [[at(24, 'realises') - .05, 'magic', .6], [at(24, 'realises') + .2, 'gasp', .5], [at(24, 'defendu') - .1, 'pop', .6]] });
// B024b — contre une critique qui n'existait même pas : il boxe dans le vide, cadre « critique.png » VIDE, 404
B(24, { enter: 'whip', cam: camHand(1.05, .8),
  draw: (t, d, T) => { const t0 = at(24, 'contre') - .15, Cr = at(24, 'critique') - t0, Ex = at(24, 'existait') - t0, p = Math.abs(Math.sin(t * 9)); return soiree(t) + heroP({ x: 330, y: 1500, s: 1.35, expr: 'rage', armR: [-10 + p * 20, -10], armL: [180, 190], holdR: glove(0, 0, .9), holdL: glove(0, 0, .9, 180) }, t) + motionLines(560, 1000, 3, 70, 0) +
    funBox(790, 940, 330, 440, t, Cr - .1, { label: 'critique.png', col: SX.acc2 }) + (t > Ex ? funTag(790, 940, '404', t, Ex, { size: 80, bg: '#e2463a' }) + kthin('introuvable', 790, 1080, t, Ex + .1, { size: 44 }) : '') + kword("N'EXISTAIT PAS", CX, 430, t, Ex + .2, { size: 78, fill: SX.acc2 }); },
  sfx: [[.1, 'whoosh', .5], [.4, 'whoosh', .5], [.7, 'whoosh', .5], [at(24, 'existait') - at(24, 'contre') + .15, 'error_beep', .6], [at(24, 'meme') - at(24, 'contre') + .3, 'crickets', .4]] }, at(24, 'contre') - .15);
// B025a — le lendemain : chambre au matin, le téléphone vibre (notif Kevin)
B(25, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Kv = at(25, 'kevin') - .1, vib = t > Kv ? wave(t, 12, 6) : 0; return bedroomDay(t) + bed(CX, 1260, '#ffb36b') + heroHead(400, 1000, 190, { expr: t > Kv ? 'shock' : 'sleep', tilt: -10 }, t) + rect(-M, 1150, W + 2 * M, 900, '#ffb36b', 30, 7) +
    G(tr(800 + vib, 800, 1.2, 8), phone(0, 0, 1, 0, rect(-60, -110, 120, 70, '#fff', 12, 4) + ftext(0, -66, 'KEVIN', { size: 26, fill: SX.ink, stroke: 'none' }))) + (t > Kv ? motionLines(700, 760, 3, 40, 180) + motionLines(900, 760, 3, 40, 0) : '') + funTag(CX, 420, 'LE LENDEMAIN', t, .05, { size: 52, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'chirp', .5], [at(25, 'kevin') - .1, 'vibrate', .7], [at(25, 'envoie'), 'pop_hi', .5]] });
// B025b — photo de son rasoir CASSÉ : écran du téléphone, rasoir explosé, poils roux coincés
B(25, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 3 }),
  draw: (t, d, T) => { const t0 = at(25, 'photo') - .3, Ca = at(25, 'casse') - t0; return bedroomDay(t) + glow(CX, 860, 520, '#fff6c8', .4) + G(tr(CX, 880, 1.15), rect(-170, -330, 340, 660, '#2b2b33', 44) + rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + rect(-130, -230, 260, 300, '#dfe6ee', 12, 4) + razor(0, -100, .7, 0, t > Ca ? 1 : 0, t) + rect(-130, 110, 200, 50, '#7fd3a0', 20, 4) + ftext(-30, 145, 'regarde ça', { size: 24, fill: SX.ink, stroke: 'none' })) +
    funTag(CX - 250, 420, 'PHOTO', t, .1, { size: 48, bg: '#fff', fg: SX.ink }) + kword('RASOIR CASSÉ', CX, 520, t, Ca - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'shutter', .6], [at(25, 'rasoir') - at(25, 'photo') + .3, 'buzz', .5], [at(25, 'casse') - at(25, 'photo') + .25, 'crack', .8], [at(25, 'casse') - at(25, 'photo') + .35, 'zap', .5]] }, at(25, 'photo') - .3);
// B026 — « Frère, j'en peux plus de ma barbe » : Kevin noyé dans sa barbe géante, un oiseau y a fait son nid
B(26, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .5 }),
  draw: (t, d, T) => { const bk = lerp(1.6, 2.6, eOutCubic(seg(t, 0, d))), Pe = at(26, 'peux') - .05; return bathroom2(t, '#ffe0e6', '#f7c6d0') + kevinHead(CX, 720, 220, { expr: 'sob', bk }, t) +
    G(tr(CX + 150, 1000), ell(0, 0, 90, 40, '#8a5a3a', 6) + G(tr(0, -40), circ(0, 0, 36, '#5ec4f0') + circ(10, -8, 6, OL, 0) + path('M30 -4L52 2L30 8Z', '#ffb340', 4))) + funTag(CX - 250, 400, 'FRÈRE…', t, at(26, 'frere') - .05, { size: 54, bg: '#fff', fg: SX.ink }) + kword("J'EN PEUX PLUS", CX, 520, t, Pe, { size: 80, fill: SX.acc2 }); },
  sfx: [[at(26, 'frere') - .05, 'pop', .6], [.4, 'chirp', .5], [at(26, 'peux') - .05, 'boom', .5], [at(26, 'barbe'), 'boing', .5]] });
// B027a — tu souris : gros plan, sourire sincère, lumière douce
B(27, { enter: 'none', trans: 'zoom', transD: .25, cam: zin(1.04, 1.1),
  draw: (t, d, T) => bedroomDay(t) + glow(CX, 820, 460, '#fff6c8', .55) + heroHead(CX, 820, 270, { expr: 'happy', pk: 1.2 }, t) + sparkle(CX + 70, 930, .5 + .3 * Math.sin(t * 10), '#fff'),
  sfx: [[at(27, 'souris'), 'glint', .7], [at(27, 'souris') + .1, 'sparkle', .5]] });
// B027b — le seul point commun entre vous deux : écran partagé toi | Kevin
B(27, { enter: 'whip', cam: zin(1.02, 1.06),
  draw: (t, d, T) => { const t0 = at(27, 'le') - .15, Co = at(27, 'commun') - t0; return rect(-M, -M, CX + M, H + 2 * M, '#c6e6ff', 0, 0) + rect(CX, -M, CX + M, H + 2 * M, '#ffd9c6', 0, 0) + heroHead(290, 860, 190, { expr: 'smug' }, t) + kevinHead(790, 830, 170, { expr: 'sob', bk: 1.6 }, t) +
    G(tr(CX, 960, 1, 90), squiggle(0, 0, 900, t, SX.acc2, { t0: .05 })) + funTag(CX, 440, 'POINT COMMUN ?', t, Co - .1, { size: 56, bg: SX.acc }) + markerArrow(330, 590, 760, 590, t, Co, { bend: 60, col: SX.acc }); },
  sfx: [[0, 'whoosh', .5], [.05, 'scratch', .4], [at(27, 'commun') - at(27, 'le') + .05, 'ding', .6], [at(27, 'deux') - at(27, 'le') + .15, 'pop', .4]] }, at(27, 'le') - .15);
// B027c — FIN : chacun rêve du problème de l'autre (bulles de rêve inversées) + un poil saute chez Kevin
B(27, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const t0 = at(27, 'vous', 2) - .1, Rv = at(27, 'revez') - t0, Pb = at(27, 'probleme') - t0, Au = at(27, 'autre') - t0, fk = seg(t, Au + .1, Au + .8);
    const dreamA = G(tr(0, 20), head({ hr: 80, hairFn: (r, tt) => { const [b, f] = hairSvg('short', HC, r, tt); return [b, f + megaBeard(r, tt, 1.3, HC)]; }, expr: 'cool', seed: 2 }, t)), dreamB = G(tr(0, 20), head({ hr: 80, hair: 'spiky', hairColor: KC, freckles: true, expr: 'zen', seed: 3 }, t));
    const hx = lerp(290 + .38 * 140, 790 - .1 * 140, eInOut(fk)), hy = lerp(1020 + .66 * 140, 1120, fk) - Math.sin(fk * Math.PI) * 420;
    return SKY(t, '#b8a6ff', '#ffe3f1') + heroHead(290, 1020, 140, { expr: fk > 0 ? 'shock' : 'love', hide: fk > 0 ? [1] : [] }, t) + kevinHead(790, 1010, 135, { expr: 'love', bk: 1.4 }, t) +
      dreamBubble(290, 680, 140, dreamA, pop(t, Rv, .4)) + dreamBubble(790, 680, 140, dreamB, pop(t, Rv + .15, .4)) + (fk > 0 && fk < 1 ? G(tr(hx, hy, 3, fk * 720), path('M0 0C10 -10 -10 -20 4 -30', 'none', 6)) : '') + (fk >= 1 ? popStars(790, 1120, t, Au + .8, 6, 120) : '') +
      kword('LE PROBLÈME', CX, 330, t, Pb - .05, { size: 92, fill: '#fff' }) + kword("DE L'AUTRE", CX, 450, t, Au - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[at(27, 'revez') - at(27, 'vous', 2) + .1, 'magic', .5], [at(27, 'probleme') - at(27, 'vous', 2) + .05, 'boom', .5], [at(27, 'autre') - at(27, 'vous', 2) + .05, 'tada', .7], [at(27, 'autre') - at(27, 'vous', 2) + .2, 'boing', .6], [at(27, 'autre') - at(27, 'vous', 2) + .55, 'rimshot', .5]] }, at(27, 'vous', 2) - .1);

SCENES.sort((a, b) => a.s - b.s);
