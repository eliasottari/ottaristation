// ============================================================
//  « Pourquoi c'est horrible d'avoir un grand front ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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
//  Police Komika Axis, contours cartoon épais sur toutes les formes, un accent orange.
// ============================================================
sxFun('#ff5a36'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';

// ---------- personnages ----------
const HERO = '#ffb03a';
const hf = (o = {}) => bigForehead(Object.assign({ color: '#5a3a26' }, o));
const gamin = (o, t) => person(Object.assign({ age: 'kid', hairFn: hf(o.hf), shirt: HERO, pants: '#3b4a6b', seed: 2 }, o), t);
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: hf(o.hf), seed: 2 }, o), t));
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const coiffeur = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#1f1a18', mustache: true, shirt: '#fff', apron: '#5b8fd8', pants: '#2b2b33', seed: 8 }, o), t);
const coifHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'side', hairColor: '#1f1a18', mustache: true, seed: 8 }, o), t));
const amie = (o, t) => person(Object.assign({ age: 'kid', hair: 'curly', hairColor: '#2b2420', shirt: '#b56cff', pants: '#4b3b6e', skin: '#c98a5e', seed: 5 }, o), t);
const amieHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'curly', hairColor: '#2b2420', skin: '#c98a5e', seed: 5 }, o), t));
const prof = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#8a5a3a', glasses: true, shirt: '#e2463a', pants: '#4b5b7a', seed: 4 }, o), t);

// ---------- décors vivants ----------
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff');
function tree(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c')); }
function kidsBg(t, y = 1150, n = 4) { let s = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; s += person({ age: 'kid', x, y, s: .45, hair: ['curly', 'bun', 'short', 'ponytail'][i % 4], hairColor: ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040'][i % 4], shirt: ['#ff8fb1', '#7aa6d8', '#ffd23f', '#7be07b'][i % 4], expr: 'happy', walk: 3, flip: i % 2, seed: 20 + i }, t); } return s; }
function schoolyard(t) { return SKY(t) + building(-120, 1180, 640, 560, '#f0d9b5') + building(560, 1180, 700, 470, '#e8c9a0') + rect(-M, 1180, W + 2 * M, 1500, '#c9b8a0', 0, 0) + tree(950, 1200, .9, t) + kidsBg(t, 1230, 3); }
function salon(t) { let s = grad('#c9f1e8', '#a6e3d6', -M, -M, W + 2 * M, H + 2 * M); for (let i = -6; i < 16; i++) s += rect(i * 120, -M, 60, H + 2 * M, 'rgba(255,255,255,.35)', 0, 0);
  s += rect(150, 230, 780, 820, '#f6c86b', 40) + grad('#eaf8ff', '#bfe0f2', 190, 270, 700, 740).replace('<rect', '<rect rx="24"') + rect(190, 270, 700, 740, 'none', 24);
  for (let i = 0; i < 7; i++) s += circ(190 + i * 116, 245, 20, Math.sin(t * 6 + i) > -.6 ? '#fff6c8' : '#e8d8a0', 5);
  s += rect(-M, 1250, W + 2 * M, 900, '#f4f4f4', 0, 0);
  for (let y = 1250; y < H + M; y += 110) for (let x = -M + ((y - 1250) / 110 % 2) * 110; x < W + M; x += 220) s += rect(x, y, 110, 110, '#3b3f4a', 0, 0);
  return s + rect(-M, 1240, W + 2 * M, 20, '#2b2420', 0, 0) + plant(980, 1250, 1.1); }
function classroom2(t, txt = 1) { return grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + rect(80, 260, 920, 520, '#3c5a48', 18) + rect(100, 280, 880, 480, '#456b55', 10, 0) + (txt ? ftext(540, 470, 'FRANÇAIS', { size: 60, fill: 'rgba(255,255,255,.8)', font: SX.marker, stroke: 'none' }) + ftext(540, 600, 'le front ≠ la tête', { size: 46, fill: 'rgba(255,255,255,.6)', font: 'Fredoka', stroke: 'none' }) : '') + wallClock(900, 180, 70, t) + rect(-M, 1250, W + 2 * M, 900, '#c49a6c', 0, 0); }
function rainStreet(t, k = 1) { let s = street(t, { sky1: '#7d8a9c', sky2: '#b9c3cf' }); s += cloud(300, 220, 2.2, '#6b7686') + cloud(780, 260, 2, '#5f6a7a'); for (let i = 0; i < 70 * k; i++) { const x = (i * 97 + 37) % (W + 200) - 100, y = ((i * 211 + t * 1600) % (H + 300)) - 150; s += line(x, y, x - 12, y + 70, 6, 'rgba(220,235,255,.75)'); } for (let i = 0; i < 4; i++) { const kk = (t * 1.2 + i / 4) % 1; s += ell(200 + i * 220, 1420 + (i % 2) * 120, 60 * kk + 10, 16 * kk + 4, 'none', 4, `rgba(255,255,255,${f1(1 - kk)})`); } return s; }
function park(t) { return SKY(t, '#9fe0ff', '#fff4dc') + rect(-M, 1100, W + 2 * M, 1000, '#8fd16a', 0, 0) + tree(120, 1160, 1, t) + tree(980, 1140, 1.1, t) + Array.from({ length: 10 }, (_, i) => circ((i * 211) % W, 1300 + (i * 97) % 500, 10, ['#ffd23f', '#ff8fb1', '#fff'][i % 3], 3)).join(''); }
function bedroomDay(t) { return grad('#ffe6c8', '#ffd9b0', -M, -M, W + 2 * M, H + 2 * M) + windowFrame(640, 280, 320, 380) + rect(110, 320, 260, 340, '#7aa6d8', 12) + ftext(240, 520, 'ROCK', { size: 60, fill: '#fff' }) + rect(-M, 1250, W + 2 * M, 1400, '#c49a6c', 0, 0); }
function newsStudio(t) { let s = grad('#173a7a', '#0d1f45', -M, -M, W + 2 * M, H + 2 * M); for (let i = 0; i < 12; i++) s += line(CX, 600, CX + Math.cos(i / 12 * 6.28 + t * .3) * 1600, 600 + Math.sin(i / 12 * 6.28 + t * .3) * 1600, 50, 'rgba(255,255,255,.04)');
  return s + rect(-M, 1150, W + 2 * M, 1000, '#1d2c55', 0, 0) + path('M-50 1150L1130 1150L1060 1350L20 1350Z', '#e2463a', 7); }
function bathroom2(t) { return bathroomWall(t) + mirror(190, 300, 700, 820) + sink(CX, 1300); }

// ---------- accessoires ----------
function cake13(x, y, s, t) { let g = rect(-220, -120, 440, 200, '#ff8fb1', 30) + path('M-220 -80Q-160 -40 -110 -80T0 -80T110 -80T220 -80', 'none', 14, '#fff') + rect(-250, 70, 500, 30, '#fff', 14);
  for (let i = 0; i < 13; i++) { const cx = -190 + i * 31.6; g += rect(cx - 7, -190, 14, 70, ['#7aa6d8', '#ffd23f', '#7be07b'][i % 3], 4, 4) + G(tr(cx, -205, 1 + .15 * Math.sin(t * 20 + i)), path('M0 -22Q12 -2 0 8Q-12 -2 0 -22Z', '#ffb340', 3)); } return G(tr(x, y, s), g); }
function plane(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M-200 -20Q-220 0 -200 20L180 30Q240 0 180 -30Z', '#fff') + path('M-20 -20L-90 -150L-40 -150L60 -20Z', '#4d7cf0') + path('M-20 20L-90 150L-40 150L60 20Z', '#4d7cf0') + path('M-180 -20L-230 -90L-190 -90L-140 -20Z', '#e2463a')); }
function mushroom(x, y, s, t, face = 'happy') { return G(tr(x, y, s, wave(t, .6, 3)), rect(-70, -40, 140, 220, '#fff3dc', 40) + path('M-260 -20C-280 -300 280 -300 260 -20Q0 30 -260 -20Z', '#e2463a') + circ(-120, -150, 34, '#fff', 5) + circ(60, -200, 40, '#fff', 5) + circ(170, -90, 28, '#fff', 5) + G(tr(0, 80), head({ hr: 60, hair: 'none', skin: 'none', cheeks: true, expr: face, seed: 9 }, t).replace(/<circle cx="0" cy="0" r="60"[^>]*\/>/, ''))); }
function ambulance(x, y, s, t) { return G(tr(x, y, s), rect(-300, -220, 600, 220, '#fff', 30) + rect(100, -180, 180, 100, '#bfe3f5', 14) + rect(-300, -90, 600, 30, '#e2463a', 0, 0) + rect(-60, -200, 50, 120, '#e2463a', 4, 0) + rect(-95, -165, 120, 50, '#e2463a', 4, 0) + rect(-60, -270, 120, 40, Math.sin(t * 3) > 0 ? '#5ec4f0' : '#8ab', 10) + circ(-180, 20, 55, '#333') + circ(180, 20, 55, '#333') + circ(-180, 20, 20, '#ccc', 4) + circ(180, 20, 20, '#ccc', 4)); }
function camTripod(x, y, s) { return G(tr(x, y, s), line(0, 0, -140, 500, 14) + line(0, 0, 140, 500, 14) + line(0, 0, 0, 520, 14) + rect(-170, -150, 340, 200, '#3a3f4a', 30) + circ(0, -50, 80, '#2b2b33') + circ(0, -50, 46, '#5ec4f0', 6) + rect(90, -190, 70, 40, '#555', 8)); }
function recFrame(t) { let s = ''; for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) s += path(`M${CX + a * 420} ${960 + b * 560 - b * 90}L${CX + a * 420} ${960 + b * 560}L${CX + a * 420 - a * 90} ${960 + b * 560}`, 'none', 10, '#fff'); return s + circ(170, 300, 16, Math.sin(t * 6) > 0 ? '#ff3b30' : 'rgba(0,0,0,0)', 0) + ftext(200, 314, 'REC', { size: 40, anchor: 'start', fill: '#fff' }) + path(`M${CX - 40} 960L${CX + 40} 960M${CX} 920L${CX} 1000`, 'none', 5, '#fff'); }
const sweatDrops = (x, y, t) => sweatSpray(x, y, t, 4);

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, tête-œuf en cut-out, anneaux, titre cinétique
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1020, 330, t, .45, SX.acc, 16) + rings(CX, 1020, t, .5) + G(tr(CX, 1080, 1 + .03 * Math.sin(t * 6)), cutout(heroHead(0, 0, 170, { expr: 'worried' }, t), 14)) + popStars(CX, 820, t, 1.0, 6, 300) +
    kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'AVOIR UN", CX, 415, t, .3, { size: 58 }) + kword('GRAND FRONT ?', CX, 540, t, at(1, 'grand') - .05, { size: 84, fill: SX.acc2 }) + funBox(CX, 905, 380, 250, t, 1.1, { label: 'front.png' }),
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'grand') - .05, 'boom', .6], [.45, 'boing', .5], [1.1, 'tick', .5], [1.4, 'glint', .7]] });
// B002 — « les cheveux ne reculent pas » : papier, la ligne des cheveux tient bon (flèche barrée, compteur 0 cm)
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => paper(SX.paper) + gobo(T, .12) + burst(CX, 960, 330, t, .1, '#ffe1b8', 18) + cutout(heroHead(CX, 1050, 190, { expr: 'smug' }, t), 12) + markerArrow(CX + 330, 640, CX + 330, 820, t, .3, { bend: 0, col: SX.acc }) + cross(CX + 330, 730, .55, t, at(2, 'reculent')) +
    funTag(CX - 220, 470, 'RECUL : 0 cm', t, at(2, 'reculent') - .05, { size: 54, bg: SX.cool }),
  sfx: [[.3, 'scratch', .5], [at(2, 'reculent') - .05, 'pop', .7], [at(2, 'reculent'), 'error_beep', .5], [at(2, 'pas'), 'boing', .4]] });
// B003 — « ils ont commencé très loin » : ligne de DÉPART tout en haut, mètre qui se déroule jusqu'aux sourcils
B(3, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const k = eOutCubic(seg(t, at(3, 'tres') - .2, at(3, 'loin') + .3)); const top = 1080 - 1.55 * 200, brow = 1080 - 40;
    return gridBg('#2a2440') + cutout(heroHead(CX, 1080, 200, { expr: 'deadpan' }, t), 12) + G(tr(CX, top - 40), funTag(0, 0, 'DÉPART', t, .05, { size: 40, bg: SX.acc, r: 0 })) +
      G(tr(CX + 300, top), rect(-26, 0, 52, (brow - top) * k, SX.acc2, 8, 6) + Array.from({ length: Math.floor(8 * k) }, (_, i) => line(-26, i * 50 + 25, 0, i * 50 + 25, 5)).join('')) + ftext(CX + 300, top + (brow - top) * k + 70, `${counter(0, 47, t, at(3, 'tres') - .2, .9)} cm`, { size: 64, fill: '#fff' }) +
      kthin('ils ont commencé', CX, 340, t, 0, { size: 58 }) + kword('TRÈS LOIN.', CX, 460, t, at(3, 'tres') - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[.05, 'pop', .6], [at(3, 'tres') - .2, 'squeak', .6], [at(3, 'tres') - .05, 'boom', .5], [at(3, 'loin') + .3, 'ding', .6]] });
// B004 — 13 ans : chambre, gâteau à 13 bougies, frange intacte, confettis
B(4, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => bedroomDay(t) + gamin({ x: CX, y: 1430, s: 1.4, expr: 'joy', hf: { bang: 1 }, armL: [200, 230], armR: [-20, -50] }, t) + cake13(CX, 1330, .9, t) + confetti(t, 0, 30) + funTag(CX, 430, '13 ANS', t, at(4, '13') - .1, { size: 80, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'whoosh', .6], [at(4, '13') - .1, 'tada', .6], [.3, 'pop', .5]] });
// B005 — salon : le coiffeur coupe la frange… le front se révèle (aura)
B(5, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const R_ = at(5, 'retire'), b = 1 - eOutCubic(seg(t, R_, R_ + .6)); return salon(t) + G(tr(CX, 0), path('M-260 1500Q0 1200 260 1500Z', '#e8eef2')) + (b < .5 ? glow(CX - 120, 820, 360, '#fff6c8', .5 * (1 - b)) : '') +
    gamin({ x: CX - 120, y: 1500, s: 1.4, expr: b < .3 ? 'shock' : 'neutral', hf: { bang: b }, apron: '#e8eef2' }, t) + coiffeur({ x: 820, y: 1560, s: 1.25, expr: 'effort', flip: 1, armL: [210, 200], holdL: scissors(0, 0, .5, 0, .5 + .5 * Math.sin(t * 30)) }, t) + hairFall(t, CX - 120, 760, 260, 8, 3, '#5a3a26') + (b < .3 ? funBox(CX - 120, 955, 300, 170, t, R_ + .5, { label: 'révélation' }) : ''); },
  sfx: [[0, 'snip', .7], [at(5, 'retire'), 'snip', .9], [at(5, 'retire') + .2, 'snip', .8], [at(5, 'frange'), 'angel', .6]] });
// B006 — il recule d'un pas (empreinte « 1 »)
B(6, { cam: () => ({ z: 1.04, hand: .3 }),
  draw: (t, d, T) => { const k = eOutBack(seg(t, at(6, 'recule'), at(6, 'recule') + .35)); return salon(t) + gamin({ x: 330, y: 1500, s: 1.35, expr: 'deadpan', hf: {}, apron: '#e8eef2' }, t) + coiffeur({ x: 700 + k * 130, y: 1560, s: 1.25, expr: 'shock', flip: 1, face: { eyes: 'huge' } }, t) + (k > 0 ? funTag(800, 470, '1 PAS', t, at(6, 'pas') - .05, { size: 56, bg: SX.cool }) : '') + motionLines(700 + k * 130 - 120, 1100, 3, 60, 0); },
  sfx: [[at(6, 'recule'), 'steps', .8], [at(6, 'pas') - .05, 'pop', .6]] });
// B007 — puis d'un deuxième : plan large, il est collé au mur, le front éblouit (rayons)
B(7, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.1, .98, eOutCubic(clamp(t / .4))) }),
  draw: (t, d, T) => salon(t) + glow(330, 860, 420, '#fff6c8', .55) + rays(t, 330, 860, 'rgba(255,240,170,.25)', 'rgba(255,255,255,0)', 16) + gamin({ x: 330, y: 1500, s: 1.35, expr: 'deadpan', hf: {}, apron: '#e8eef2' }, t) + coiffeur({ x: 960, y: 1560, s: 1.25, expr: 'terror', flip: 1, armL: [200, 160], tremble: 1 }, t) + funTag(800, 470, '2 PAS', t, .05, { size: 56, bg: SX.acc }) + sparkle(260, 760, .6 + .3 * Math.sin(t * 10), '#fff'),
  sfx: [[0, 'steps', .8], [.05, 'pop', .6], [.2, 'glint', .8]] });
// B008 — « on va essayer de garder du volume devant » : gros plan coiffeur gêné, sèche-cheveux à fond
B(8, { enter: 'whip', cam: camHand(1.05, .6),
  draw: (t, d, T) => salon(t) + coifHead(CX + 120, 860, 230, { expr: 'worried', look: [-1, 0] }, t) + sweatDrops(CX + 120, 860, t) + G(tr(CX - 260, 1100, 1, -20 + Math.sin(t * 20) * 3), rect(-90, -60, 260, 120, '#e2463a', 50) + rect(-60, 40, 70, 180, '#e2463a', 20) + circ(170, 0, 50, '#555')) +
    Array.from({ length: 5 }, (_, i) => line(CX - 40 + ((t * 600 + i * 90) % 400), 1080 + (i - 2) * 30, CX + 40 + ((t * 600 + i * 90) % 400), 1080 + (i - 2) * 30, 6, 'rgba(255,255,255,.7)')).join('') +
    funTag(CX, 450, 'VOLUME ↑', t, at(8, 'volume') - .05, { size: 64, bg: SX.acc2, fg: SX.ink }) + blob(CX - 320, 600, 60, t, SX.cool, 2, { t0: at(8, 'volume') }),
  sfx: [[0, 'hmm', .5], [.3, 'wind', .6], [at(8, 'volume') - .05, 'boing', .6], [at(8, 'devant'), 'pop', .5]] });
// B009 — « Merci pour la confiance » : reflet dans le miroir, regard blasé, MERCI ironique
B(9, { cam: zin(1.04, 1.1),
  draw: (t, d, T) => salon(t) + heroHead(540, 840, 200, { expr: 'deadpan', hf: {} }, t) + kword('MERCI', CX, 420, t, at(9, 'merci') - .05, { size: 120, fill: '#fff', puff: false }) + markerText('…pour la confiance', CX + 60, 1180, t, at(9, 'confiance') - .1, { size: 46, col: SX.acc }),
  sfx: [[at(9, 'merci') - .05, 'glint', .6], [at(9, 'confiance'), 'scratch', .4]] });
// B010a — à l'école, Kevin te pointe du doigt
B(10, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t) * 15 }, [{ z: 1.5, svg: schoolyard(t), haze: .08 }, { z: 1, svg: gamin({ x: 300, y: 1500, s: 1.35, expr: 'neutral', hf: {} }, t) + kevin({ x: 780, y: 1500, s: 1.35, expr: 'mock', flip: 1, armL: [190, 195] }, t) }, { z: .6, svg: blur(10, G(tr(CX, 1820), rect(-800, -120, 1600, 240, '#7bbf5a', 60))) }]) + funTag(780, 470, 'KEVIN', t, at(10, 'kevin'), { size: 50, bg: '#5fb85f' }),
  sfx: [[0, 'school_bell', .4], [at(10, 'kevin'), 'pop', .6], [at(10, 'demande'), 'hmm', .5]] });
// B010b — fantasme : ton front = PISTE D'ATTERRISSAGE (balisage, avion qui se pose)
B(10, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.05, shake: t > .9 && t < 1.2 ? 6 : 0 }),
  draw: (t, d, T) => { const k = seg(t, .1, 1.0); return SKY(t, '#ffb36b', '#ffe3c2') + G(tr(CX, 1010), heroHead(0, 0, 300, { expr: 'deadpan', hf: { shine: 0 } }, t)) + G(tr(CX, 1010 - 300 * .9), Array.from({ length: 5 }, (_, i) => rect(-14, -170 + i * 70, 28, 40, '#fff', 4, 0)).join('') + Array.from({ length: 6 }, (_, i) => circ((i % 2 ? 1 : -1) * 150, -180 + Math.floor(i / 2) * 110, 12, Math.sin(t * 10 + i) > 0 ? '#ffd23f' : '#ff7a3d', 3)).join('')) +
    plane(lerp(1300, CX + 40, eOutCubic(k)), lerp(250, 660, eOutCubic(k)), .7, lerp(-15, 0, k)) + kword("PISTE D'ATTERRISSAGE", CX, 430, t, at(10, 'piste', 1) - at(10, 'piste') + .02, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .6], [.1, 'whoosh', .6], [.6, 'wind', .5], [1.0, 'thud', .7], [1.1, 'boing', .5]] }, at(10, 'piste') - .15);
// B011 — tu ris pour faire semblant (rire forcé, « HA HA » qui se fissure)
B(11, { cam: camHand(1.04, .4),
  draw: (t, d, T) => schoolyard(t) + gamin({ x: 330, y: 1500, s: 1.35, expr: 'laugh', face: { brows: 'sad' }, hf: {} }, t) + sweatDrops(330, 1000, t) + kevin({ x: 800, y: 1500, s: 1.3, expr: 'laugh', flip: 1 }, t) +
    funTag(330, 520, 'HA HA', t, at(11, 'ris') - .05, { size: 70, bg: '#fff', fg: SX.ink }) + (t > at(11, 'semblant') ? path('M290 470L320 520L300 545L335 590', 'none', 7) : '') + markerText('(ça touche)', 330, 700, t, at(11, 'touche'), { size: 46, col: SX.acc }),
  sfx: [[at(11, 'ris') - .05, 'pop', .6], [at(11, 'semblant'), 'crack', .6], [at(11, 'touche'), 'scratch', .4]] });
// B012 — toute la récré à vérifier ta coiffure dans le reflet d'une fenêtre (horloge qui file, les autres jouent)
B(12, { enter: 'drop', cam: zin(1.0, 1.08, .3),
  draw: (t, d, T) => { const mins = counter(0, 15, t, .3, d - .6); return SKY(t) + rect(-M, 280, W + 2 * M, 1000, '#f0d9b5', 0, 0) + windowFrame(160, 330, 760, 800, '#cfe8f5', '#a9d2e8') + op(.55, heroHead(540, 760, 190, { expr: 'worried', hf: {}, look: [0, -.4] }, t)) +
    rect(-M, 1260, W + 2 * M, 900, '#c9b8a0', 0, 0) + kidsBg(t, 1300, 3) + gamin({ x: 400, y: 1600, s: 1.45, expr: 'worried', hf: {}, armR: [-80, -100], look: [1, -1] }, t) + G(tr(860, 460), circ(0, 0, 90, '#fff') + line(0, 0, 0, -60, 8) + G(`rotate(${f1(t * 400)})`, line(0, 0, 0, -75, 5, SX.acc))) + funTag(860, 600, `RÉCRÉ +${mins} min`, t, .3, { size: 38, bg: SX.cool }); },
  sfx: [[0, 'school_bell', .5], [.3, 'clock_fast', .6], [at(12, 'verifier'), 'squeak', .5], [at(12, 'fenetre'), 'glint', .6]] });
// B013 — le lendemain : frange V2 posée devant le miroir, fier
B(13, { enter: 'whip', cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const F = at(13, 'frange') - .1, b = eOutBack(seg(t, F, F + .35)); return bathroom2(t) + heroHead(CX, 880, 200, { expr: b > .5 ? 'cool' : 'neutral', hf: { bang: b } }, t) + funTag(CX, 360, 'LE LENDEMAIN', t, .05, { size: 46, bg: SX.acc2, fg: SX.ink }) + (b > .9 ? funTag(CX + 240, 1130, 'FRANGE V2', t, F + .3, { size: 48, bg: SX.acc }) + popStars(CX, 650, t, F + .3) : ''); },
  sfx: [[0, 'whoosh', .5], [at(13, 'frange') - .1, 'boing', .7], [at(13, 'frange') + .3, 'sparkle', .6]] });
// B014 — il pleut (nuage perso au-dessus de la tête)
B(14, { enter: 'drop', cam: () => ({ z: 1.05, shake: 3 }),
  draw: (t, d, T) => rainStreet(t) + gamin({ x: CX, y: 1500, s: 1.35, expr: 'shock', hf: { bang: 1, wet: 1 } }, t) + cloud(CX, 600, 1.6, '#5f6a7a') + lightning(CX + 60, 620, .35, .5 + .5 * Math.sin(t * 30)),
  sfx: [[0, 'thunder', .8], [.05, 'wind', .5]] });
// B015 — la frange se sépare (gros plan, raie au milieu, gouttes)
B(15, { enter: 'crash', cam: zin(1.05, 1.12, .4),
  draw: (t, d, T) => rainStreet(t, .6) + heroHead(CX, 880, 240, { expr: 'terror', hf: { bang: 1, split: eOutCubic(seg(t, at(15, 'separe') - .3, at(15, 'separe') + .4)), wet: 1 } }, t) + funBox(CX, 560, 300, 160, t, at(15, 'separe') + .2, { label: 'bug', col: SX.acc }),
  sfx: [[.1, 'squeak', .6], [at(15, 'separe') - .2, 'zap', .6], [at(15, 'separe') + .2, 'error_beep', .6]] });
// B016 — CATASTROPHE NATIONALE : plateau du JT, bandeau FLASH INFO, ta photo à l'écran
B(16, { enter: 'crash', flash: 1, cam: () => ({ z: 1.05, shake: 4 }),
  draw: (t, d, T) => newsStudio(t) + rect(140, 540, 800, 480, '#0a0f1f', 20, 8) + G(tr(CX, 800), heroHead(0, 30, 130, { expr: 'terror', hf: { bang: 1, split: 1 } }, t)) +
    G(tr(CX, 1080), rect(-540, -60, 1080, 120, '#e2463a', 0, 6) + ftext(-500, 26, 'FLASH INFO', { size: 56, anchor: 'start', fill: '#fff' }) + rect(-120, -50, 4, 100, '#fff', 0, 0)) + kword('CATASTROPHE', CX, 330, t, .05, { size: 104, fill: SX.acc2 }) + kword('NATIONALE', CX, 450, t, at(16, 'nationale') - .05, { size: 96, fill: '#fff' }),
  sfx: [[0, 'siren', .5], [.05, 'boom', .7], [at(16, 'nationale') - .05, 'flash_hit', .6]] });
// B017 — la casquette : rayons, pose de star
B(17, { enter: 'whip', cam: zin(1.02, 1.08),
  draw: (t, d, T) => rays(t, CX, 900, '#ffe9a6', '#ffd76b', 22) + classroom2(t).slice(0, 0) + gamin({ x: CX, y: 1500, s: 1.4, expr: 'cool', hf: { cap: '#e2463a' }, armR: [-40, -60] }, t) + funTag(CX, 430, 'CASQUETTE', t, at(17, 'casquette') - .1, { size: 60, bg: '#e2463a' }) + popStars(CX, 900, t, at(17, 'casquette')),
  sfx: [[0, 'whoosh', .5], [at(17, 'casquette') - .1, 'pop', .7], [at(17, 'casquette'), 'sparkle', .6]] });
// B018 — interdite en classe : la prof siffle, tampon INTERDIT, la casquette s'envole
B(18, { enter: 'punch', cam: () => ({ z: 1.06, shake: 5 }),
  draw: (t, d, T) => { const f = seg(t, .15, .6); return classroom2(t) + prof({ x: 820, y: 1560, s: 1.25, expr: 'angry', flip: 1, armL: [200, 200] }, t) + gamin({ x: 320, y: 1500, s: 1.3, expr: 'shock', hf: {} }, t) + G(tr(320 + f * 500, 900 - Math.sin(f * 3.1) * 400, 1, f * 500), path('M-80 0C-80 -80 80 -80 80 0Z', '#e2463a', 6) + path('M20 0L140 -10L130 15Z', '#c43a2e', 5)) + stamp(CX, 470, 'INTERDIT', t, .05); },
  sfx: [[0, 'whistle', .9], [.05, 'thud', .8], [.15, 'whoosh_up', .6]] });
// B019 — une autre coupe : défilé express de coupes (flashs)
B(19, { cam: () => ({ z: 1.05 }),
  draw: (t, d, T) => { const n = Math.floor(t / .2) % 4, styles = [{ bang: .6 }, { mush: 1 }, { bang: 1, split: .5 }, { cap: '#4d7cf0' }]; return salon(t) + heroHead(CX, 840, 220, { expr: ['wow', 'worried', 'smug', 'cool'][n], hf: styles[n] }, t) + funTag(CX, 400, `COUPE N°${27 + Math.floor(t / .2)}`, t, .05, { size: 54, bg: SX.cool }) + op(1 - (t % .2) / .08, rect(-200, -200, W + 400, H + 400, '#fff', 0, 0)); },
  sfx: [[0, 'shutter', .6], [.2, 'shutter', .6], [.4, 'shutter', .6], [.6, 'shutter', .6], [.8, 'shutter', .6], [1.0, 'shutter', .5]] });
// B020 — Kevin : « tu ressembles à un champignon » (toi + champignon géant, signe =)
B(20, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => park(t) + gamin({ x: 290, y: 1500, s: 1.3, expr: 'deadpan', hf: { mush: 1 } }, t) + G(tr(560, 950), text(0, 30, OL, '=', '#fff', 140)) + mushroom(820, 1200, 1.05, t, 'deadpan') + kevinHead(880, 520, 110, { expr: 'mock' }, t) + funTag(CX, 380, 'CHAMPIGNON', t, at(20, 'champignon') - .1, { size: 64, bg: '#e2463a' }),
  sfx: [[0, 'whoosh', .5], [at(20, 'kevin'), 'hmm', .5], [at(20, 'champignon') - .1, 'boing', .8], [at(20, 'champignon') + .3, 'rimshot', .5]] });
// B021 — il existe toujours une nouvelle blague : éventail de coupes, chacune tamponnée par Kevin
B(21, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const jokes = ['PISTE', 'CHAMPI', 'LAMPE', 'ÉCRAN', 'PATINOIRE'], st = [{}, { mush: 1 }, { bang: .5 }, { cap: '#4d7cf0' }, { bang: 1, split: 1 }]; let s = classroom2(t, 0);
    for (let i = 0; i < 5; i++) { const t0 = .2 + i * .45, a = R(-160 + i * 35), x = CX + Math.cos(a) * 340, y = 860 + Math.sin(a) * 300; s += card(x, y, 190, 230, heroHead(0, 30, 62, { expr: 'sad', hf: st[i] }, t), t, t0, { ry: 0, thick: 8, r: (i - 2) * 8, bw: 6 }) + funTag(x, y + 140, jokes[i], t, t0 + .25, { size: 30, bg: SX.acc, r: (i - 2) * 8 }); }
    return s + kevinHead(CX, 1060, 120, { expr: 'mock' }, t) + kthin('toujours une', CX, 380, t, at(21, 'toujours'), { size: 54 }) + kword('NOUVELLE BLAGUE', CX, 480, t, at(21, 'nouvelle') - .05, { size: 82, fill: SX.acc2 }); },
  sfx: [[.2, 'pop', .5], [.65, 'pop', .5], [1.1, 'pop', .5], [1.55, 'pop', .5], [2.0, 'pop', .5], [at(21, 'nouvelle') - .05, 'boom', .5], [3.2, 'rimshot', .4]] });
// B022 — « la hauteur du front varie naturellement » : ton qui change, rangée de gens tous différents + règle
B(22, { enter: 'none', trans: 'circle', transD: .35, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const hs = [1.2, 1.45, 1.75, 1.3, 1.6], sk = ['#f2c9a0', '#c98a5e', '#8a5a3a', '#f6d7b8', '#e0b088'], hc = ['#2b2420', '#c4521b', '#e0a040', '#5a3a26', '#1f1a18']; let s = park(t);
    for (let i = 0; i < 5; i++) { const x = 130 + i * 205; s += G(tr(x, 990 + Math.sin(t * 3 + i) * 6), head({ hr: 80, skin: sk[i], hairFn: bigForehead({ h: hs[i], color: hc[i] }), expr: ['happy', 'joy', 'proud', 'smug', 'happy'][i], seed: 30 + i }, t)) + G(tr(x, 1180), funTag(0, 0, `${Math.round(hs[i] * 4)} cm`, t, at(22, 'varie') + i * .12, { size: 30, bg: SX.cool, r: 0 })); }
    return s + G(tr(CX, 760), rect(-500, -18, 1000, 36, SX.acc2, 10, 6) + Array.from({ length: 21 }, (_, i) => line(-480 + i * 48, -18, -480 + i * 48, i % 5 ? -2 : 8, 4)).join('')) + kword('NATURELLEMENT', CX, 450, t, at(22, 'naturellement') - .05, { size: 92, fill: '#fff' }); },
  sfx: [[0, 'magic', .5], [at(22, 'varie'), 'pop_hi', .5], [at(22, 'varie') + .3, 'pop_hi', .5], [at(22, 'naturellement') - .05, 'sparkle', .6]] });
// B023 — ça ne dit rien de ton intelligence / beauté / avenir : 3 bulles qui poussent sur chaque mot
B(23, { cam: camHand(1.04, .3),
  draw: (t, d, T) => { const I = at(23, 'intelligence'), Bt = at(23, 'beaute'), A = at(23, 'avenir'); return bedroomDay(t) + gamin({ x: CX, y: 1530, s: 1.35, expr: t > A ? 'proud' : 'neutral', hf: {} }, t) +
    G(tr(220, 560), blob(0, 0, 130, t, '#ff8fb1', 1, { t0: I - .1 }) + (t > I ? ftext(0, 30, '🧠', { size: 110, stroke: 'none' }) : '')) + G(tr(CX, 470), blob(0, 0, 130, t, SX.acc2, 2, { t0: Bt - .1 }) + (t > Bt ? ftext(0, 30, '✨', { size: 110, stroke: 'none' }) : '')) + G(tr(860, 560), blob(0, 0, 130, t, SX.cool, 3, { t0: A - .1 }) + (t > A ? ftext(0, 30, '🚀', { size: 110, stroke: 'none' }) : '')) +
    funTag(CX, 760, 'FRONT = RIEN À VOIR', t, A + .05, { size: 46, bg: SX.acc }); },
  sfx: [[at(23, 'intelligence') - .1, 'pop', .7], [at(23, 'beaute') - .1, 'pop', .7], [at(23, 'avenir') - .1, 'pop', .7], [at(23, 'avenir') + .05, 'tada', .5]] });
// B024 — photo de groupe : tu te caches tout derrière (seul ton front dépasse), appareil en premier plan flou
B(24, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { let s = park(t); const D = at(24, 'derriere');
    s += G(tr(CX, 0), heroHead(0, lerp(960, 1010, seg(t, D - .3, D + .3)), 95, { expr: 'worried', hf: {} }, t));
    for (let i = 0; i < 4; i++) s += person({ age: 'kid', x: 180 + i * 240, y: 1440, s: .95, hair: ['curly', 'bun', 'short', 'ponytail'][i], hairColor: ['#2b2420', '#8a5a3a', '#e0a040', '#c4521b'][i], shirt: ['#ff8fb1', '#7aa6d8', '#ffd23f', '#7be07b'][i], expr: 'happy', armL: i % 2 ? [200, 220] : undefined, seed: 40 + i }, t);
    s += kevin({ x: 900, y: 1440, s: .95, expr: 'smug' }, t);
    return s + (t > D ? funBox(CX, 860, 230, 150, t, D, { label: 'toi', col: SX.acc }) : '') + blur(9, camTripod(150, 1720, 1.1)) + funTag(CX, 400, 'PHOTO DE GROUPE', t, at(24, 'photo') - .1, { size: 50, bg: SX.cool }); },
  sfx: [[at(24, 'photo') - .1, 'pop', .6], [at(24, 'derriere'), 'tiptoe', .7], [at(24, 'derriere') + .3, 'hmm', .4]] });
// B025 — une amie te tire par le bras
B(25, { enter: 'whip', cam: camHand(1.05, .7),
  draw: (t, d, T) => { const k = eOutBack(seg(t, .1, .6)); return park(t) + amie({ x: 300 + k * 60, y: 1500, s: 1.35, expr: 'happy', armR: [-10, 0], legL: [110, 100] }, t) + gamin({ x: 640 - k * 120, y: 1500, s: 1.3, expr: 'shock', hf: {}, armL: [180, 180], rot: -6 * k }, t) + motionLines(820 - k * 120, 1150, 3, 70, 0) + motionLines(820 - k * 120, 1260, 3, 70, 0); },
  sfx: [[.1, 'whoosh', .8], [.3, 'boing', .5]] });
// B026 — « Mais viens devant ! »
B(26, { enter: 'punch', cam: zin(1.04, 1.1),
  draw: (t, d, T) => park(t) + amieHead(CX, 900, 230, { expr: 'joy' }, t) + burst(CX, 450, 300, t, 0, '#fff', 16) + funTag(CX, 450, 'VIENS DEVANT !', t, .05, { size: 66, bg: SX.acc2, fg: SX.ink }),
  sfx: [[0, 'pop', .7], [.1, 'boing', .5]] });
// B027 — tu murmures « on va voir mon front » (tout petit texte, rouge de honte)
B(27, { cam: zin(1.06, 1.12),
  draw: (t, d, T) => park(t) + heroHead(CX, 880, 230, { expr: 'embarrassed', hf: {} }, t) + kthin('on va voir mon front…', CX, 470, t, at(27, 'on') - .05, { size: 46, fill: '#fff' }) + G(tr(CX + 250, 620), blob(0, 0, 40, t, '#ff8fb1', 4, { t0: at(27, 'front') })),
  sfx: [[at(27, 'murmures'), 'hmm', .4], [at(27, 'front'), 'squeak', .4]] });
// B028 — « Oui. Et alors ? » : elle hausse les épaules, ET ALORS ? en explosion
B(28, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => park(t) + amie({ x: CX, y: 1500, s: 1.4, expr: 'cool', armL: [160, 230], armR: [20, -50] }, t) + funTag(CX - 230, 450, 'OUI.', t, at(28, 'oui') - .05, { size: 70, bg: '#fff', fg: SX.ink }) + burst(CX + 150, 610, 240, t, at(28, 'alors') - .1, SX.acc2) + kword('ET ALORS ?', CX + 150, 610, t, at(28, 'alors') - .05, { size: 76, fill: '#fff', puff: false }),
  sfx: [[at(28, 'oui') - .05, 'pop', .6], [at(28, 'alors') - .1, 'boom', .6]] });
// B029 — trois mots, aucun drame (compteur 3, tampon)
B(29, { enter: 'none', trans: 'up', transD: .2, cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => park(t) + ['OUI.', 'ET', 'ALORS ?'].map((w, i) => funTag(260 + i * 270, 640, w, t, .05 + i * .12, { size: 56, bg: [SX.acc2, SX.cool, '#ff8fb1'][i], fg: SX.ink, r: (i - 1) * 6 })).join('') + kword('3 MOTS', CX, 430, t, .05, { size: 110, fill: '#fff' }) + stamp(CX, 900, 'AUCUN DRAME', t, at(29, 'aucun') - .05, '#36a85a', -8),
  sfx: [[.05, 'pop', .6], [.17, 'pop', .6], [.29, 'pop', .6], [at(29, 'aucun') - .05, 'thud', .8]] });
// B030 — personne n'a appelé les secours : ambulance garée, ambulanciers qui s'ennuient, téléphone muet
B(30, { enter: 'whip', cam: zin(1.02, 1.08),
  draw: (t, d, T) => street(t) + ambulance(CX, 1250, 1.2, t) + person({ age: 'adult', x: 200, y: 1420, s: 1.0, hair: 'short', hairColor: '#2b2420', shirt: '#36a85a', expr: 'sleep', seed: 50 }, t) + G(tr(880, 760), rect(-90, -160, 180, 320, '#2b2b33', 30) + rect(-70, -130, 140, 240, '#dfe8f0', 14, 0) + ftext(0, -10, '0', { size: 120, fill: SX.ink }) + ftext(0, 70, 'appel', { size: 34, fill: SX.ink })) + text(260, 820, OL, 'z', '#fff', 60) + funTag(CX, 420, 'RAS', t, at(30, 'secours') - .1, { size: 70, bg: '#36a85a' }),
  sfx: [[0, 'crickets', .6], [at(30, 'secours') - .1, 'pop', .6]] });
// B031 — tu souris enfin face à l'objectif : POV appareil photo (viseur REC), flash au déclenchement
B(31, { enter: 'crash', cam: zin(1.02, 1.1),
  draw: (t, d, T) => { const S = at(31, 'objectif') + .1; return park(t) + amie({ x: 260, y: 1500, s: 1.15, expr: 'joy', armR: [-60, -90] }, t) + gamin({ x: CX, y: 1500, s: 1.35, expr: 'joy', hf: {} }, t) + sparkle(CX - 60, 820, .6 + .3 * Math.sin(t * 10), '#fff') + recFrame(t) + (t > S ? op(1 - seg(t, S, S + .3), rect(-200, -200, W + 400, H + 400, '#fff', 0, 0)) : ''); },
  sfx: [[0, 'whoosh', .4], [at(31, 'souris'), 'sparkle', .6], [at(31, 'objectif') + .1, 'shutter', 1]] });
// B032 — sauf Kevin, derrière : la photo imprimée (carte), Kevin fait des cornes, encadré + flèche
B(32, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const inner = rect(-400, -300, 800, 600, '#9fe0ff', 10, 0) + rect(-400, 50, 800, 250, '#8fd16a', 0, 0) + G(tr(-150, 140, .55), amie({ x: 0, y: 200, s: 1, expr: 'joy' }, t)) + G(tr(80, 140, .55), gamin({ x: 0, y: 200, s: 1, expr: 'joy', hf: {} }, t)) + G(tr(260, 40, .5), kevin({ x: 0, y: 200, s: 1, expr: 'tongue' in EXPR ? 'dead' : 'mock', face: { mouth: 'tongue', eyes: 'crazy' }, armL: [240, 270], armR: [-60, -90] }, t));
    return paper('#ffe9c9') + gobo(T, .1) + card(CX, 860, 860, 660, inner, t, 0, { ry: lerp(20, 0, seg(t, 0, .5)), bg: '#fff' }) + funBox(CX + 260, 760, 170, 210, t, at(32, 'kevin') + .1, { label: 'kevin.exe', col: SX.acc }) + markerArrow(CX + 420, 420, CX + 300, 620, t, at(32, 'blague') - .2, { bend: -60, col: SX.acc }) + markerText('encore...', CX + 300, 400, t, at(32, 'encore'), { size: 52, col: SX.acc2 }); },
  sfx: [[0, 'printer', .4], [at(32, 'kevin') + .1, 'tick', .6], [at(32, 'encore'), 'scratch', .5], [at(32, 'blague'), 'rimshot', .5]] });
// B033 — FIN : le seul truc vraiment trop grand sur cette photo, c'est son BESOIN D'ATTENTION (Kevin gonfle comme un ballon)
B(33, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(33, 'attention') ? 4 : 0 }),
  draw: (t, d, T) => { const B_ = at(33, 'besoin'), g = eOutBack(seg(t, B_ - .3, B_ + .8)); return rays(t, CX, 900, '#ffe9a6', '#ffd76b', 26) +
    G(tr(CX, 1000), heroHead(-350, 70, 105, { expr: 'laugh', hf: {} }, t) + amieHead(350, 70, 105, { expr: 'laugh' }, t)) + G(tr(CX, 960, 1 + g * .4), kevinHead(0, 0, 140, { expr: t > at(33, 'attention') ? 'panic' : 'smug' }, t)) +
    kthin('le seul truc trop grand, c’est son', CX, 300, t, at(33, 'seul'), { size: 46 }) + kword('BESOIN', CX, 405, t, B_ - .05, { size: 110, fill: SX.acc2 }) + kword("D'ATTENTION", CX, 515, t, at(33, 'attention') - .05, { size: 100, fill: '#fff' }) + (t > at(33, 'attention') ? popStars(CX, 900, t, at(33, 'attention'), 8, 380) + confetti(t, at(33, 'attention'), 40) : ''); },
  sfx: [[0, 'whoosh', .5], [at(33, 'besoin') - .3, 'whoosh_up', .6], [at(33, 'besoin') - .05, 'boom', .6], [at(33, 'attention') - .05, 'tada', .8], [at(33, 'attention') + .4, 'rimshot', .5]] });

SCENES.sort((a, b) => a.s - b.s);
