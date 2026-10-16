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

// ---------- décors vivants ----------
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff');
function drip(x, y, t) { const k = (t * 1.3) % 1; return circ(x, y + k * 160, 9, '#8fd0ff', 4); }
function bathroom2(t, c1 = '#cfeaf0', c2 = '#b2d6de') { return tiles(c1, c2) + rect(-M, 1250, W + 2 * M, 1400, '#e8eef0', 0, 0) + mirror(190, 300, 700, 820) + sink(CX, 1300) + drip(CX - 110, 1250, t) + towel(990, 760, 120, 300, '#ff8fb1', '#ffb3cb'); }
// macro du menton (le menton devient un paysage) : nez en haut, bouche, joues, cou
function chinMacro(t, o = {}) { const mouth = o.mouth || 'smile', my = 430;
  let s = tiles('#cfeaf0', '#b2d6de') + rect(CX - 300, 900, 600, 1400, SKIN, 7) + path(`M-200 1300Q${CX} 1150 ${W + 200} 1300L${W + 200} ${H + 400}L-200 ${H + 400}Z`, HERO_SHIRT, 7);
  s += ell(CX, 260, 800, 860, SKIN, 7) + ell(CX - 430, 420, 120, 60, CHEEK, 0) + ell(CX + 430, 420, 120, 60, CHEEK, 0) + path(`M${CX - 90} 120Q${CX} 190 ${CX + 90} 120`, 'none', 9) + ell(CX - 45, 110, 22, 14, '#c99a78', 0) + ell(CX + 45, 110, 22, 14, '#c99a78', 0);
  const m = { smile: `M${CX - 200} ${my}Q${CX} ${my + 110} ${CX + 200} ${my}`, flat: `M${CX - 170} ${my + 30}L${CX + 170} ${my + 30}`, wavy: `M${CX - 200} ${my + 30}q50 -40 100 0t100 0t100 0t100 0`, frown: `M${CX - 180} ${my + 70}Q${CX} ${my - 30} ${CX + 180} ${my + 70}` }[mouth];
  return s + path(m, 'none', 14); }
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
function bedroomDay(t) { return grad('#ffe6c8', '#ffd9b0', -M, -M, W + 2 * M, H + 2 * M) + windowFrame(640, 280, 320, 380) + cloud(((t * 25) % 500) + 600, 380, .4, '#fff') + frame(140, 330, 240, 200, '#9fd3a7') + rect(-M, 1250, W + 2 * M, 1400, '#c49a6c', 0, 0); }
function bedNight(t) { return bedroomNight(t) + Array.from({ length: 12 }, (_, i) => circ((i * 173) % W, 80 + (i * 97) % 250, 4 + (i % 3), Math.sin(t * 3 + i) > 0 ? '#fff6d6' : 'rgba(255,246,214,.3)', 0)).join(''); }
function bed(x, y, col = '#7aa6d8') { return rect(x - 520, y - 40, 1040, 600, col, 40) + rect(x - 560, y - 120, 80, 700, '#8a5a3a', 14) + path(`M${x - 500} ${y - 30}Q${x} ${y - 90} ${x + 520} ${y - 30}`, 'none', 7, shade(col, -.25)); }
// réunion de famille : papier peint, fanions, cadres, table garnie, cousins en fond
function famille(t, o = {}) { let s = grad(o.c1 || '#ffe8c4', o.c2 || '#ffd9a0', -M, -M, W + 2 * M, H + 2 * M); for (let i = -6; i < 16; i++) s += rect(i * 110, -M, 40, H + 2 * M, 'rgba(255,255,255,.3)', 0, 0);
  s += frame(120, 380, 200, 160, '#bfe3f5') + frame(780, 340, 170, 210, '#ffd1dc');
  let fl = `M-40 250`; for (let i = 0; i < 12; i++) fl += `Q${i * 100 + 10} ${290 + wave(t, .7, 8, i * .2)} ${i * 100 + 60} 250`; s += path(fl, 'none', 5);
  for (let i = 0; i < 11; i++) s += G(tr(i * 100 + 30, 262 + wave(t, .7, 6, i * .2), 1, wave(t, .9, 6, i * .3)), path('M-28 0L28 0L0 56Z', ['#ff6fa5', '#ffd23f', '#5ec4f0', '#7be07b'][i % 4], 5));
  for (let i = 0; i < 3; i++) s += person({ age: 'adult', x: 160 + i * 380 + (i === 1 ? 60 : 0), y: 1200, s: .55, hair: ['curly', 'bun', 'short'][i], hairColor: ['#2b2420', '#8a5a3a', '#e0a040'][i], shirt: ['#7aa6d8', '#ffd23f', '#b56cff'][i], expr: ['laugh', 'happy', 'talk'][i], seed: 30 + i }, t);
  return s; }
function table(y = 1240, t = 0) { return rect(-M, y, W + 2 * M, 900, '#fff', 0, 7) + path(`M-200 ${y + 40}${Array.from({ length: 14 }, (_, i) => `q40 30 80 0`).join('')}`, 'none', 6, '#e2463a') + G(tr(870, y - 10), path('M-70 0L70 0L50 -110L-50 -110Z', '#f4c27a', 6) + rect(-10, -150, 20, 40, '#ff8fb1', 4, 4) + G(tr(0, -165, 1 + .15 * Math.sin(t * 20)), path('M0 -22Q12 -2 0 8Q-12 -2 0 -22Z', '#ffb340', 3))) + rect(560, y - 160, 50, 160, '#5fb85f', 8, 6) + rect(573, y - 200, 24, 50, '#5fb85f', 4, 5); }
// soirée : nuit violette, guirlande d'ampoules, bokeh, danseurs en fond
function soiree(t, dim = 0) { let s = grad('#2a1f55', '#4b2b6e', -M, -M, W + 2 * M, H + 2 * M);
  for (let i = 0; i < 14; i++) s += op(.35, circ((i * 233) % (W + 200) - 100, 200 + (i * 151) % 900, 30 + (i % 4) * 18, ['#ff6fa5', '#ffd23f', '#5ec4f0', '#b56cff'][i % 4], 0));
  let wire = 'M-60 170'; for (let i = 0; i < 6; i++) wire += `Q${i * 200 + 40} 260 ${i * 200 + 140} 170`; s += path(wire, 'none', 5);
  for (let i = 0; i < 12; i++) { const x = i * 100 - 10, y = 170 + 45 * Math.sin(((i % 2) + .5) * Math.PI / 2) * (i % 2 ? .6 : 1) + 18; s += circ(x + 40, y, 16, Math.sin(t * 5 + i * 1.3) > -.3 ? ['#fff6a8', '#ff9fd0', '#a8f0ff'][i % 3] : '#6b5a7a', 4); }
  for (let i = 0; i < 4; i++) s += person({ age: 'adult', x: 90 + i * 300, y: 1220 + wave(t, 2, 12, i * .25), s: .5, hair: ['curly', 'ponytail', 'short', 'bun'][i], hairColor: ['#2b2420', '#e0a040', '#8a5a3a', '#c4521b'][i], shirt: ['#5ec4f0', '#7be07b', '#ffd23f', '#ff8fb1'][i], expr: 'joy', armL: [200 + wave(t, 2, 30, i * .3), 230], armR: [-20, -50 + wave(t, 2, 30, i * .3)], seed: 60 + i }, t);
  s += rect(-M, 1250, W + 2 * M, 1400, '#2b2440', 0, 0); for (let x = -M; x < W + M; x += 140) s += rect(x, 1250, 70, 1400, 'rgba(255,255,255,.04)', 0, 0);
  return s + (dim ? rect(-M, -M, W + 2 * M, H + 2 * M, `rgba(10,5,30,${dim})`, 0, 0) : ''); }
function examRoom(t) { return grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + blackboard(80, 230, 920, 380, ftext(700, 450, 'silence.', { size: 60, fill: 'rgba(255,255,255,.7)', stroke: 'none' })) + wallClock(960, 700, 60, t, 3) + rect(-M, 1250, W + 2 * M, 900, '#c49a6c', 0, 0); }
function labBoard(t) { return grad('#e8f4ff', '#cfe6fb', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 1250, W + 2 * M, 900, '#9fb4c9', 0, 0) + blackboard(60, 250, 960, 640, '') + plant(1000, 1260, 1); }

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
  draw: (t, d, T) => { const U = at(1, 'barbe') - .05; return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 960, t, U, { part: 'back', r: 480 }) +
    G(tr(CX, 960, 1 + .03 * Math.sin(t * 6)), cutout(heroHead(0, 0, 175, { expr: t > at(1, 'pousse') ? 'jawdrop' : 'worried', pk: 1.3 }, t), 14)) + unlock(CX, 960, t, U, { part: 'front', r: 480 }) +
    funBox(CX, 1090, 330, 120, t, at(1, 'pas'), { label: 'barbe.png' }) +
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
  draw: (t, d, T) => { const t0 = at(9, 'que') - .1, Q = at(9, 'quatre') - t0; return grad('#c49a6c', '#a87c50', -M, -M, W + 2 * M, H + 2 * M) + rect(80, 250, 920, 1000, '#5a3e28', 20) + rect(110, 280, 860, 940, '#3b2a1c', 10, 0) + rect(110, 900, 860, 30, '#8a5a3a', 0, 5) +
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
