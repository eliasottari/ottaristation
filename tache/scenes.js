// ============================================================
//  « Pourquoi c'est horrible d'avoir une tache de naissance sur le visage ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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
//  SIZEX fun : intro = signature motion (fond graphique), ensuite VRAIS DÉCORS vivants + couche motion rebondie.
//  Police Fredoka (défaut de sxFun), contours cartoon épais, un accent rose. Ton : drôle puis touchant (jamais moqueur envers le héros).
// ============================================================
sxFun('#ff5c8a'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';
const M = 700;

// ---------- la tache de naissance (overlay sur head via hairFn : dessinée après les joues, avant les yeux) ----------
const MARK = '#b8336a';
// forme organique irrégulière, rose foncé translucide, contour léger. k = opacité (0 = filtre qui l'efface)
function markShape(r, k = 1, o = {}) {
  if (k <= 0) return '';
  const P = [[-.2, -.11], [-.06, -.19], [.08, -.14], [.2, -.18], [.26, -.06], [.19, .04], [.24, .15], [.1, .18], [-.02, .12], [-.13, .19], [-.23, .1], [-.17, 0]];
  const n = P.length, sc = o.sc || 1, cx = (o.x ?? .46) * r, cy = (o.y ?? .3) * r, col = o.col || MARK;
  const pt = i => { const [a, b] = P[(i + n) % n]; return [cx + a * r * sc, cy + b * r * sc]; };
  const [x0, y0] = pt(-1), [xa, ya] = pt(0); let d = `M${f1((x0 + xa) / 2)} ${f1((y0 + ya) / 2)}`;
  for (let i = 0; i < n; i++) { const [x1, y1] = pt(i), [x2, y2] = pt(i + 1); d += `Q${f1(x1)} ${f1(y1)} ${f1((x1 + x2) / 2)} ${f1((y1 + y2) / 2)}`; }
  return `<g opacity="${(.62 * k).toFixed(3)}" transform="rotate(${o.rot || 0} ${f1(cx)} ${f1(cy)})"><path d="${d}Z" fill="${col}" stroke="${shade(col, -.3)}" stroke-width="${f1(r * .022)}"/>` +
    ell(cx + .28 * r * sc, cy + .2 * r * sc, .045 * r * sc, .035 * r * sc, col, 0) + ell(cx - .27 * r * sc, cy - .14 * r * sc, .03 * r * sc, .025 * r * sc, col, 0) + '</g>';
}
const HAIRC = '#3a2a20', HERO = '#ffc83d';
const markHair = (r, t, o) => { const [b, f] = hairSvg('short', HAIRC, r, t); return [b, f + markShape(r, o.mark ?? 1)]; };
const leo = (o, t) => person(Object.assign({ age: 'kid', hairFn: markHair, shirt: HERO, pants: '#3b4a6b', seed: 2 }, o), t);
const leoA = (o, t) => person(Object.assign({ age: 'adult', hairFn: markHair, shirt: HERO, pants: '#3b4a6b', seed: 2 }, o), t);
const leoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: markHair, seed: 2 }, o), t));
const markAt = (x, y, r) => [x + .46 * r, y + .3 * r];                 // centre de la tache pour une tête (x,y,r) non retournée
const headOf = (x, y, s, age = 'kid') => [x, y - (age === 'kid' ? 292 : 402) * s, (age === 'kid' ? 100 : 92) * s];  // [x, y, r] de la tête d'un person
// autres personnages
const ines = (o, t) => person(Object.assign({ age: 'adult', hair: 'curly', hairColor: '#2b2420', skin: '#c98a5e', shirt: '#b56cff', pants: '#4b3b6e', seed: 5 }, o), t);
const inesHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'curly', hairColor: '#2b2420', skin: '#c98a5e', seed: 5 }, o), t));
const KH = ['curly', 'bun', 'spiky', 'ponytail', 'short', 'long'], KC = ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040', '#1f1a18', '#6b3e26'], KS = ['#ff8fb1', '#7aa6d8', '#7be07b', '#ff9a4d', '#b56cff', '#5ec4f0'], SK = ['#f2c9a0', '#c98a5e', '#f6d7b8', '#8a5a3a', '#e0b088', '#f2c9a0'];
const kid = (i, o, t) => person(Object.assign({ age: 'kid', hair: KH[i % 6], hairColor: KC[i % 6], shirt: KS[i % 6], skin: SK[i % 6], pants: '#3b3f4a', seed: 20 + i }, o), t);
const kidHead = (i, x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: KH[i % 6], hairColor: KC[i % 6], skin: SK[i % 6], seed: 20 + i }, o), t));
const AH = ['side', 'bun', 'bald', 'long', 'short'], AC = ['#1f1a18', '#8a5a3a', '#7a6a5a', '#c4521b', '#d9d9de'], AS = ['#5b8fd8', '#e2463a', '#36a85a', '#ff9a4d', '#8a6ad8'];
const adult = (i, o, t) => person(Object.assign({ age: 'adult', hair: AH[i % 5], hairColor: AC[i % 5], shirt: AS[i % 5], skin: SK[(i + 2) % 6], pants: '#2f3b4e', seed: 60 + i, glasses: i % 3 === 0, mustache: i === 2 }, o), t);
const adultHead = (i, x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: AH[i % 5], hairColor: AC[i % 5], skin: SK[(i + 2) % 6], seed: 60 + i, glasses: i % 3 === 0, mustache: i === 2 }, o), t));

// ---------- décors vivants ----------
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff');
function tree(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c')); }
function kidsBg(t, y = 1150, n = 4, s = .45) { let r = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; r += kid(i + 1, { x, y, s, expr: 'happy', walk: 3, flip: i % 2 }, t); } return r; }
function schoolyard(t) { return SKY(t) + building(-120, 1180, 640, 560, '#f0d9b5') + building(560, 1180, 700, 470, '#e8c9a0') + rect(-M, 1180, W + 2 * M, 1500, '#c9b8a0', 0, 0) + tree(950, 1200, .9, t) + kidsBg(t, 1230, 3); }
function classroomT(t, inner = '') { return grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + rect(60, 250, 960, 560, '#8a6a4a', 18) + rect(80, 270, 920, 520, '#456b55', 10, 0) + inner + rect(120, 790, 840, 18, '#8a6a4a', 6, 4) + wallClock(960, 170, 60, t) + windowFrame(-200, 300, 220, 420) + rect(-M, 1250, W + 2 * M, 900, '#c49a6c', 0, 0); }
function hallway(t) { let s = grad('#d6ecf7', '#bcdcee', -M, -M, W + 2 * M, H + 2 * M); for (let i = -2; i < 12; i++) { const x = i * 130 - 60; s += rect(x, 640, 124, 610, ['#ff8fb1', '#5ec4f0', '#ffd23f', '#7be07b'][(i + 4) % 4], 8) + rect(x + 20, 690, 84, 16, 'rgba(0,0,0,.25)', 4, 0) + rect(x + 20, 720, 84, 16, 'rgba(0,0,0,.25)', 4, 0) + circ(x + 100, 960, 9, '#fff', 3); } return s + rect(-M, 1250, W + 2 * M, 900, '#d9c7a8', 0, 0) + line(-M, 1250, W + M, 1250, 8, '#b8a582'); }
function bathroomT(t) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#cfeaf0', 0, 0); for (let x = -M; x < W + M; x += 120) s += line(x, -M, x, H + M, 4, '#b2d6de'); for (let y = -M; y < H + M; y += 120) s += line(-M, y, W + M, y, 4, '#b2d6de'); return s + mirror(170, 280, 740, 860) + rect(-M, 1250, W + 2 * M, 1400, '#e8eef0', 0, 0) + path(`M${CX - 300} 1250L${CX + 300} 1250Q${CX + 280} 1420 ${CX} 1430Q${CX - 280} 1420 ${CX - 300} 1250Z`, '#fff'); }
function stageT(t, screen = '') { let s = grad('#3a1d3e', '#1c0e22', -M, -M, W + 2 * M, H + 2 * M) + rect(130, 270, 820, 560, '#0f0a14', 16, 8) + rect(150, 290, 780, 520, '#fdf6ea', 8, 0) + screen;
  for (const sd of [-1, 1]) { let c = ''; for (let i = 0; i < 4; i++) c += path(`M${i * 45} -100Q${i * 45 + 25 + wave(t, .4, 6, i)} 700 ${i * 45 + 5} 1400`, 'none', 10, '#7a1426'); s += G(sd < 0 ? tr(-60, 0) : `translate(${W + 60} 0) scale(-1 1)`, path('M-100 -100L200 -100Q150 600 230 1400L-100 1400Z', '#b81f3a', 7) + c); }
  s += path('M-100 -100L1180 -100L1180 120Q900 180 540 140Q180 180 -100 120Z', '#b81f3a', 7);
  s += op(.22, path(`M${360 + wave(t, .2, 30)} 120L${140} 1450L${600} 1450Z`, '#fff6c8', 0));
  s += rect(-M, 1300, W + 2 * M, 900, '#6b3e26', 0, 0) + line(-M, 1300, W + M, 1300, 10, '#4a2a18');
  for (let i = 0; i < 7; i++) s += circ(80 + i * 160, 1760 + wave(t, .7, 6, i * .3), 120, '#140a18', 0) + ell(80 + i * 160, 1900, 150, 120, '#140a18', 0);
  return s; }
function bedroomN(t, lamp = 0) { let s = grad('#1d2350', '#2e3570', -M, -M, W + 2 * M, H + 2 * M) + rect(620, 230, 360, 420, '#0f163a', 12) + circ(820, 360, 56, '#fff6d6', 0);
  for (let i = 0; i < 6; i++) s += sparkle(650 + (i * 67) % 300, 270 + (i * 113) % 340, .18 + .1 * Math.sin(t * 3 + i), '#fff6d6');
  s += rect(620, 230, 360, 420, 'none', 12) + line(800, 230, 800, 650, 8) + rect(90, 300, 230, 300, '#ff8fb1', 10) + ftext(205, 470, '★', { size: 120, fill: '#fff', stroke: 'none' });
  return s + rect(-M, 1250, W + 2 * M, 1400, '#3a3050', 0, 0); }
function streetT(t, n = 3) { let s = SKY(t, '#9fd6ff', '#fff1dc'); for (let i = -2; i < 6; i++) s += building(-200 + i * 300, 1250, 260, 520 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4]);
  s += rect(-M, 1250, W + 2 * M, 1400, '#a7adb5', 0, 0) + line(-M, 1250, W + M, 1250, 8, '#7d848c');
  for (let i = 0; i < n; i++) { const x = ((i * 520 + t * (70 + i * 20) * (i % 2 ? -1 : 1)) % 1700 + 1700) % 1700 - 300; s += op(.8, adult(i + 2, { x, y: 1270, s: .5, expr: 'neutral', walk: 3, flip: i % 2 }, t)); }
  return s; }
function galleryT(t) { let s = grad('#f4ecdf', '#e9dcc6', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 1180, W + 2 * M, 80, '#c9b08a', 0, 0); for (let i = 0; i < 3; i++) s += op(.25, path(`M${200 + i * 340} 140L${80 + i * 340} 1200L${320 + i * 340} 1200Z`, '#fff6c8', 0));
  return s + rect(-M, 1260, W + 2 * M, 900, '#a0703f', 0, 0) + Array.from({ length: 12 }, (_, i) => line(-M + i * 220, 1260, -M + i * 220 - 120, H + M, 5, '#8a5c30')).join(''); }
function discoBall(x, y, s, t) { let g = circ(0, 0, 90, '#c9d3dc', 7); for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) { if (i * i + j * j > 10) continue; const lit = Math.sin(t * 6 + i * 1.7 + j * 2.3) > .4; g += rect(i * 24 - 10, j * 24 - 10, 20, 20, lit ? '#fff' : '#9aa8b5', 3, 0); } return G(tr(x, y, s), line(0, -400, 0, -90, 6) + g); }
function partyT(t, o = {}) { let s = grad('#3a1a5c', '#170b2a', -M, -M, W + 2 * M, H + 2 * M); const cols = ['#ff5c8a', '#5ec4f0', '#ffd23f', '#7be07b'];
  for (let i = 0; i < 4; i++) { const a = Math.sin(t * .9 + i * 1.6) * 30; s += op(.16, G(tr(150 + i * 260, -50, 1, a), path('M-30 0L30 0L260 1500L-260 1500Z', cols[i], 0))); }
  let gd = 'M-60 300'; for (let i = 0; i < 12; i++) gd += `Q${-60 + i * 110 + 55} ${360} ${-60 + (i + 1) * 110} 300`; s += path(gd, 'none', 5, '#2b2420');
  for (let i = 0; i < 12; i++) s += circ(-5 + i * 110, 338, 14, Math.sin(t * 5 + i * 1.3) > 0 ? cols[i % 4] : '#4a3a5a', 4);
  s += discoBall(CX, 160, .9, t);
  if (o.dancers !== false) for (let i = 0; i < 5; i++) { const x = 60 + i * 240 + (o.part || 0) * (i < 2 ? -260 : i > 2 ? 260 : 0); s += op(.75, person({ age: 'adult', x, y: 1330 + (i % 2) * 40, s: .62, skin: '#4a2f5e', shirt: '#2e1a46', pants: '#1c1030', hair: KH[i], hairColor: '#1c1030', face: { eyes: 'closed', mouth: 'grin' }, armL: [200 + wave(t, 1.2, 40, i * .2), 250], armR: [-20 - wave(t, 1.2, 40, i * .2 + .5), -70], bob: 3, seed: 80 + i }, t * 1.6)); }
  s += rect(-M, 1300, W + 2 * M, 900, '#1c0f2e', 0, 0); for (let i = 0; i < 8; i++) s += rect(-80 + i * 160, 1320, 150, 70, Math.sin(t * 4 + i * 2) > 0 ? 'rgba(255,92,138,.35)' : 'rgba(94,196,240,.25)', 6, 0);
  return s; }

// ---------- accessoires ----------
// main qui pointe (bout du doigt en tx,ty ; ang = direction du doigt ; k = entrée 0→1 depuis l'extérieur)
function pointHand(tx, ty, ang, sleeve, k = 1, len = 700) { if (k <= 0) return ''; const a = R(ang), off = (1 - k) * 800;
  return G(tr(tx - Math.cos(a) * off, ty - Math.sin(a) * off, 1, ang), line(-len, 0, -100, 0, 74, OL) + line(-len, 0, -100, 0, 60, sleeve) + rect(-54, -18, 70, 36, SKIN, 18, 6) + rect(-130, -46, 96, 92, SKIN, 38, 6) + path('M-100 -10L-50 -10M-100 14L-50 14', 'none', 5) + ell(-82, -46, 30, 16, SKIN, 6)); }
function bandAid(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-120, -40, 240, 80, '#f3c08a', 40, 6) + rect(-42, -36, 84, 72, '#e6a66a', 10, 0) + [-80, 80].map(dx => circ(dx, -12, 5, '#d9945a', 0) + circ(dx + 18, 10, 5, '#d9945a', 0)).join('')); }
function sponge(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-90, -60, 180, 120, '#ffd23f', 26, 7) + rect(-90, 20, 180, 40, '#5fb85f', 14, 7) + circ(-40, -20, 9, '#e0a820', 0) + circ(20, -30, 7, '#e0a820', 0) + circ(50, -5, 10, '#e0a820', 0)); }
function soapBar(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-120, -64, 240, 128, '#9fe6ff', 46, 7) + ell(-60, -32, 40, 12, 'rgba(255,255,255,.7)', 0) + ftext(0, 14, 'SAVON', { size: 40, fill: '#3a8fb0', stroke: 'none' })); }
function bubbles(t, x, y, w, n = 10, seed = 3, k = 1) { if (k <= 0) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < n * k; i++) { const rr = 18 + r() * 40, ph = r(), px = x + (r() - .5) * w + wave(t, .6, 20, ph), py = y - ((t * (60 + r() * 80) + ph * 300) % 400); s += circ(px, py, rr, 'rgba(255,255,255,.55)', 4, 'rgba(120,190,230,.9)') + ell(px - rr * .35, py - rr * .35, rr * .25, rr * .15, '#fff', 0); } return s; }
function foam(x, y, s, t) { let g = ''; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28; g += circ(Math.cos(a) * 220 * (1 + .1 * (i % 2)), Math.sin(a) * 220 * (1 + .1 * (i % 3)) + 30, 70 + 15 * Math.sin(t * 3 + i), '#fff', 6, '#9fd6ff'); } return G(tr(x, y, s), g); }
function firstAid(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-90, -66, 180, 132, '#fff', 18) + rect(-30, -90, 60, 30, '#ddd', 8) + rect(-16, -46, 32, 92, '#e2463a', 4, 0) + rect(-46, -16, 92, 32, '#e2463a', 4, 0)); }
function phoneBig(x, y, s, r, screen) { return G(tr(x, y, s, r), rect(-170, -330, 340, 660, '#2b2b33', 44) + rect(-150, -295, 300, 590, '#eef3f8', 24, 0) + screen + rect(-50, -318, 100, 14, '#444', 7, 0)); }
function nameBadge(x, y, s, name, t, t0, r = -6) { const k = popEl(t, t0, .6); if (k <= 0) return ''; return G(tr(x, y, s * k, r + Math.sin(t * 3) * 1.5), rect(-200 + 10, -115 + 12, 400, 230, OL, 26, 0) + rect(-200, -115, 400, 230, '#fff', 26, 7) + path('M-196 -40L196 -40L196 -86Q196 -111 171 -111L-171 -111Q-196 -111 -196 -86Z', SX.acc, 0) + line(-200, -40, 200, -40, 6) + ftext(0, -60, 'BONJOUR', { size: 46, fill: '#fff' }) + ftext(0, -6, 'je m\'appelle', { size: 28, fill: '#7a6a5a', stroke: 'none' }) + (name ? ftext(0, 82, name, { size: 74, fill: SX.ink, stroke: 'none', font: SX.marker }) : line(-120, 78, 120, 78, 5, '#c8bfb2'))); }
function diploma(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-150, -100, 300, 200, '#fff8e0', 12) + ftext(0, -38, 'DIPLÔME', { size: 40, fill: SX.ink, stroke: 'none' }) + ftext(0, 10, 'dermato', { size: 34, fill: '#7a6a5a', stroke: 'none', font: SX.marker }) + circ(90, 60, 30, '#e2463a', 6) + path('M75 85L68 120L90 108L112 120L105 85', '#e2463a', 5)); }
function gradCap(x, y, s, r = 0, t = 0) { return G(tr(x, y, s, r), path('M-120 0L0 -50L120 0L0 50Z', '#2b2b33', 6) + path('M-70 22L-70 60Q0 90 70 60L70 22', '#2b2b33', 6) + path(`M0 0L100 10L${104 + Math.sin(t * 5) * 6} 70`, 'none', 5, '#ffd23f')); }
function heartsUp(t, x, y, n = 5, sp = 380) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * .8 + i / n) % 1; s += op(1 - k, heart(x + Math.sin(k * 9 + i) * 60 + (i - n / 2) * 30, y - k * sp, .6 + k * .3)); } return s; }
function thought(x, y, w, h, inner, k) { if (k <= 0) return ''; return G(tr(x, y, eOutBack(k)), ell(0, 0, w / 2, h / 2, '#fff', 7) + ell(-w * .3, h * .45, 30, 22, '#fff', 6) + ell(-w * .42, h * .62, 16, 12, '#fff', 5) + inner); }
// coupe de peau (inserts « science ») : mode 'pig' (cellules pigmentées) ou 'vas' (petits vaisseaux)
function skinCut(t, mode, k = 1) { let s = rect(-390, -280, 780, 560, '#ffe9dc', 18, 0) + rect(-390, -280, 780, 90, '#f6c4a8', 18, 0) + rect(-390, -210, 780, 20, '#f6c4a8', 0, 0) + path('M-390 -190Q-200 -170 0 -195T390 -185', 'none', 6, '#e8a98a') + rect(-390, 120, 780, 160, '#fff1b8', 0, 0) + Array.from({ length: 9 }, (_, i) => circ(-350 + i * 88, 200, 34, '#ffe58a', 4, '#e8c560')).join('');
  if (mode === 'pig') for (let i = 0; i < 9; i++) { const kk = seg(k, i / 12, i / 12 + .3), x = -250 + (i % 5) * 120 + (i > 4 ? 60 : 0), y = -140 + (i > 4 ? 80 : 0) + wave(t, .7, 6, i * .2); if (kk > 0) s += G(tr(x, y, eOutBack(kk)), circ(0, 0, 34, '#8a5a3a', 5) + circ(-11, -5, 5, '#fff', 0) + circ(11, -5, 5, '#fff', 0) + path('M-8 10Q0 16 8 10', 'none', 4, '#fff')) + op(.5, circ(x, y - 60, 16, '#a0703f', 0)); }
  if (mode === 'vas') { for (let j = 0; j < 3; j++) { const yy = -120 + j * 80, d = `M-390 ${yy}C-200 ${yy - 60} -100 ${yy + 60} 50 ${yy}S300 ${yy - 50} 390 ${yy + 10}`; s += path(d, 'none', 30, OL) + path(d, 'none', 20, '#e2463a'); for (let i = 0; i < 6; i++) { const u = ((t * .5 + i / 6 + j * .13) % 1) * k, px = -390 + u * 780; s += circ(px, yy + Math.sin(u * 9 + j) * 30, 9, '#ff9aa8', 3); } } s += op(.35 * k, ell(0, -160, 300, 90, MARK, 0)); }
  return s + rect(-390, -280, 780, 560, 'none', 18, 7); }

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, tête de Léo en cut-out, « débloqué » en étoiles sur TACHE, titre cinétique, cadre « tache.png »
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const T0 = at(1, 'tache') - .05, V = at(1, 'visage'), [mx, my] = markAt(CX, 1010, 175);
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 1010, t, T0, { part: 'back', r: 480 }) + G(tr(CX, 1010, 1 + .03 * Math.sin(t * 6)), cutout(leoHead(0, 0, 175, { expr: t > V ? 'embarrassed' : 'happy' }, t), 14)) + unlock(CX, 1010, t, T0, { part: 'front', r: 480 }) +
      funBox(mx, my, 150, 120, t, V, { label: 'tache.png' }) + markerText('sur le visage !', CX - 230, 760, t, V + .05, { size: 44, col: SX.acc2 }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'AVOIR UNE", CX, 415, t, .3, { size: 56 }) + kword('TACHE DE NAISSANCE ?', CX, 540, t, T0, { size: 62, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'tache') - .05, 'boom', .6], [at(1, 'tache'), 'sparkle', .6], [at(1, 'visage'), 'tick', .6], [at(1, 'visage') + .1, 'scratch', .4]] });
// B002 — tu rencontres quelqu'un : papier + gobo, l'inconnu glisse en cut-out, poignée de main, « 1ÈRE FOIS »
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Q = at(2, 'quelqu'), k = eOutBack(seg(t, Q - .25, Q + .25)); return paper(SX.paper) + gobo(T, .12) + burst(CX, 960, 300, t, at(2, 'premiere'), '#ffe1b8', 18) +
    cutout(leoHead(CX - 220, 960, 150, { expr: 'happy', look: [1, 0] }, t), 12) + (k > 0 ? cutout(adultHead(0, lerp(1350, CX + 220, k), 960, 150, { expr: 'happy', look: [-1, 0] }, t), 12) : '') +
    G(tr(CX - 70, 1190), hand(0, 0, .55, Math.sin(t * 14) * 4, HERO)) + (k > .5 ? G(`translate(${f1(CX + 70)} 1190) scale(-1 1)`, hand(0, 0, .55, Math.sin(t * 14) * 4, AS[0])) : '') +
    funTag(CX, 600, '1ÈRE FOIS', t, at(2, 'premiere') - .05, { size: 60, bg: SX.acc }); },
  sfx: [[at(2, 'quelqu') - .25, 'whoosh', .6], [at(2, 'quelqu') + .2, 'boing', .4], [at(2, 'premiere') - .05, 'pop', .7], [at(2, 'fois'), 'ding', .4]] });
// B003 — il ne demande pas ton prénom : badge « BONJOUR je m'appelle » vide, barré sur PRÉNOM
B(3, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const P = at(3, 'prenom'); return gridBg('#2a2440') + halftoneFade('#fff', .05, 1) + cutout(leoHead(CX, 1030, 165, { expr: t > P ? 'confused' : 'happy' }, t), 12) + nameBadge(CX, 690, .85, '', t, .05) + cross(CX, 700, .9, t, P + .12) +
    kthin('il ne te demande pas ton', CX, 335, t, 0, { size: 50 }) + kword('PRÉNOM', CX, 450, t, P - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[.05, 'pop', .6], [at(3, 'prenom') - .05, 'boom', .5], [at(3, 'prenom') + .12, 'error_beep', .6], [at(3, 'prenom') + .4, 'hmm', .4]] });
// B004 — rue : l'inconnu se penche et pointe ta joue, cercle au marqueur sur la tache
B(4, { enter: 'whip', cam: (t, d) => ({ z: t > at(4, 'visage') ? 1.12 : lerp(1.0, 1.05, t / d), hand: .5, cy: 1000 }),
  draw: (t, d, T) => { const V = at(4, 'visage'), C = at(4, 'ce'), lean = eOutCubic(seg(t, C - .3, C + .2)), [hx, hy, hr] = headOf(340, 1500, 1.35), [mx, my] = markAt(hx, hy, hr);
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: streetT(t), haze: .1 }, { z: 1, svg: leo({ x: 340, y: 1500, s: 1.35, expr: t > V ? 'embarrassed' : 'neutral', look: [1, 0] }, t) + adult(0, { x: 780, y: 1560, s: 1.25, flip: 1, rot: -10 * lean, expr: t > V ? 'wow' : 'confused', armR: [-12 - 10 * lean, -8] }, t) }]) +
      markerCircle(mx, my, 80, 62, t, V, { col: SX.acc }) + qmark(820, 640, .8 + .1 * Math.sin(t * 8), '#fff', 10) + funTag(CX, 420, "C'EST QUOI ÇA ?", t, C - .05, { size: 58, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'steps', .5], [at(4, 'demande'), 'hmm', .5], [at(4, 'ce') - .05, 'pop', .6], [at(4, 'visage'), 'scratch', .6], [at(4, 'visage') + .1, 'gasp', .5]] });
// B005 — tu as six ans : chambre, gâteau à 6 bougies, saut de joie
B(5, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const j = Math.abs(Math.sin(t * 7)) * 40; let cake = rect(-200, -100, 400, 180, '#ff8fb1', 30) + path('M-200 -60Q-140 -20 -90 -60T10 -60T110 -60T200 -60', 'none', 14, '#fff');
    for (let i = 0; i < 6; i++) { const cx = -150 + i * 60; cake += rect(cx - 8, -170, 16, 70, ['#7aa6d8', '#ffd23f', '#7be07b'][i % 3], 4, 4) + G(tr(cx, -186, 1 + .15 * Math.sin(t * 20 + i)), path('M0 -22Q12 -2 0 8Q-12 -2 0 -22Z', '#ffb340', 3)); }
    return grad('#ffe6c8', '#ffd9b0', -M, -M, W + 2 * M, H + 2 * M) + windowFrame(660, 300, 300, 360) + rect(-M, 1250, W + 2 * M, 1400, '#c49a6c', 0, 0) + leo({ x: 330, y: 1500 - j, s: 1.35, expr: 'joy', armL: [210, 230], armR: [-30, -60] }, t) + G(tr(790, 1260, .85), cake) + confetti(t, 0, 30) + funTag(CX, 440, '6 ANS', t, at(5, 'six') - .1, { size: 96, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .6], [at(5, 'six') - .1, 'tada', .6], [.2, 'boing', .4]] });
// B006a — à l'école : cour vivante, Léo arrive avec son cartable
B(6, { enter: 'drop', cam: zin(1.0, 1.05, .3),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t) * 15 }, [{ z: 1.5, svg: schoolyard(t), haze: .08 }, { z: 1, svg: kid(1, { x: 140, y: 1480, s: 1.0, expr: 'happy', flip: 0 }, t) + leo({ x: 520, y: 1520, s: 1.3, expr: 'happy', walk: 3 }, t) + kid(2, { x: 920, y: 1470, s: 1.0, expr: 'happy', flip: 1 }, t) }, { z: .6, svg: blur(10, G(tr(CX, 1820), rect(-800, -120, 1600, 240, '#7bbf5a', 60))) }]) + funTag(CX, 420, "L'ÉCOLE", t, at(6, 'ecole') - .1, { size: 64, bg: SX.cool }),
  sfx: [[0, 'school_bell', .5], [at(6, 'ecole') - .1, 'pop', .6], [.3, 'steps', .4]] });
// B006b — les enfants MONTRENT DU DOIGT : 5 mains géantes surgissent des bords et pointent la tache
B(6, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .4 }),
  draw: (t, d, T) => { const D = at(6, 'doigt') - at(6, 'montrent') + .15, [mx, my] = markAt(CX - 60, 880, 210);
    const H5 = [[180, 200, 0], [-140, 190, 1], [140, 240, 2], [-60, 240, 3], [110, 190, 4]]; let hs = '';
    H5.forEach(([ang, dist, i], j) => { const a = R(ang), k = eOutBack(seg(t, .05 + j * .18, .35 + j * .18)); hs += pointHand(mx - Math.cos(a) * dist, my - Math.sin(a) * dist, ang, KS[(i + 1) % 6], k); });
    return blur(6, schoolyard(t)) + leoHead(CX - 60, 880, 210, { expr: t > D ? 'embarrassed' : 'worried', look: [.6, 0] }, t) + hs + (t > D ? markerCircle(mx, my, 70, 55, t, D, { col: SX.acc2, w: 10 }) : '') + funTag(CX - 60, 440, 'REGARDEZ !', t, .1, { size: 58, bg: SX.acc }); },
  sfx: [[.05, 'whoosh', .6], [.23, 'pop', .5], [.41, 'pop', .5], [.59, 'pop', .5], [.77, 'pop', .5], [at(6, 'doigt') - at(6, 'montrent') + .15, 'boing', .6]] }, at(6, 'montrent') - .15);
// B007 — certains pensent que tu t'es blessé : un camarade-secouriste colle un pansement géant
B(7, { enter: 'whip', cam: () => ({ z: 1.05, hand: .5 }),
  draw: (t, d, T) => { const Bl = at(7, 'blesse'), [hx, hy, hr] = headOf(380, 1500, 1.35), [mx, my] = markAt(hx, hy, hr), k = pop(t, Bl, .3);
    return schoolyard(t) + leo({ x: 380, y: 1500, s: 1.35, expr: t > Bl ? 'deadpan' : 'neutral' }, t) + kid(3, { x: 820 - 60 * eOutCubic(seg(t, 0, .5)), y: 1500, s: 1.3, flip: 1, expr: 'panic', armR: [-30, -20], holdR: firstAid(40, 0, .6) }, t) +
      (k > 0 ? G(tr(mx, my, k), bandAid(0, 0, .55, -25)) : '') + (Math.sin(t * 16) > 0 ? circ(820, 690, 26, '#ff3b30', 5) : circ(820, 690, 26, '#5ec4f0', 5)) + funTag(CX, 420, 'BOBO ?!', t, at(7, 'pensent'), { size: 64, bg: '#fff', fg: SX.ink }); },
  sfx: [[0, 'siren', .45], [at(7, 'pensent'), 'pop', .6], [at(7, 'blesse'), 'thud', .7], [at(7, 'blesse') + .1, 'squeak', .5]] });
// B008 — « ça s'enlève avec du savon ? » : éponge qui frotte, bulles partout, la tache reste
B(8, { enter: 'drop', cam: () => ({ z: 1.05, shake: 2 }),
  draw: (t, d, T) => { const S = at(8, 'savon'), E = at(8, 'enleve'), [mx, my] = markAt(CX - 40, 860, 210), sq = 1 + .05 * Math.sin(t * 30) * seg(t, E - .3, E);
    return bathroomT(t) + G(tr(CX - 40, 860, 1), G(`scale(${f1(sq)} ${f1(2 - sq)})`, leoHead(0, 0, 210, { expr: t > E ? 'dizzy' : 'shock' }, t))) + bubbles(t, CX, 900, 700, 14, 3, seg(t, E - .4, S + .2)) +
      (t > E - .4 ? sponge(mx + 60 + Math.cos(t * 22) * 30, my + 40 + Math.sin(t * 22) * 20, .8, -20) : '') + (t > S ? G(tr(820, 560), soapBar(0, 0, pop(t, S, .35), 12)) : '') + funTag(CX - 40, 420, 'ÇA PART ?', t, at(8, 'demandent'), { size: 58, bg: SX.cool }); },
  sfx: [[at(8, 'demandent'), 'pop', .5], [at(8, 'enleve') - .4, 'squeak', .6], [at(8, 'enleve'), 'squeak', .6], [at(8, 'savon'), 'boing', .7], [at(8, 'savon') + .2, 'pop_hi', .5]] });
// B009 — « Magnifique. » : couvert de mousse, la tache toujours là (ironie)
B(9, { enter: 'punch', cam: zin(1.04, 1.1),
  draw: (t, d, T) => { const [mx, my] = markAt(CX, 880, 200); return bathroomT(t) + foam(CX, 860, 1.05, t) + leoHead(CX, 880, 200, { expr: 'deadpan' }, t) + bubbles(t, CX, 1000, 800, 8, 7) + sparkle(mx + 40, my - 40, .5 + .2 * Math.sin(t * 12), '#fff') +
    kword('MAGNIFIQUE.', CX, 420, t, Math.max(0, at(9, 'magnifique') - .05), { size: 96, fill: '#fff', puff: false }) + markerText('toujours là', CX + 270, 1150, t, .35, { size: 42, col: SX.acc }); },
  sfx: [[0, 'pop_hi', .4], [Math.max(0, at(9, 'magnifique') - .05), 'glint', .6], [.35, 'scratch', .4], [.45, 'rimshot', .5]] });
// B010 — tu expliques : Léo prof au tableau, schéma de la tache
B(10, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.02, 1.07),
  draw: (t, d, T) => { const E = at(10, 'expliques'); const board = op(.9, circ(330, 520, 140, 'none', 8, '#fff') + G(tr(330, 520), markShape(140, 1.2, { col: '#ff8fb1' })) + circ(285, 495, 10, '#fff', 0) + circ(375, 495, 10, '#fff', 0)) + markerArrow(560, 620, 450, 570, t, E, { col: '#fff', bend: -40 }) + (t > E ? ftext(720, 470, 'NÉ AVEC', { size: 58, fill: '#fff', stroke: 'none' }) + ftext(720, 560, '= normal', { size: 48, fill: 'rgba(255,255,255,.8)', stroke: 'none', font: SX.marker }) : '');
    return classroomT(t, board) + leo({ x: 800, y: 1520, s: 1.3, flip: 1, expr: 'talk', armR: [-30, -40], holdR: line(0, 0, 160, -40, 10, '#8a5a3a') }, t) + desk(200, 1420, 1.1) + desk(900, 1440, 1.1); },
  sfx: [[0, 'whoosh', .5], [at(10, 'expliques'), 'scratch', .6], [at(10, 'expliques') + .3, 'pop', .4]] });
// B011 — une fois, dix fois, 100 fois : compteur qui monte, Léo s'épuise, bâtons au tableau
B(11, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), shake: t > at(11, '100') ? 3 : 0 }),
  draw: (t, d, T) => { const U = at(11, 'une'), D = at(11, 'dix'), C = at(11, '100'); const v = t < D ? 1 : t < C ? counter(1, 10, t, D, .35) : counter(10, 100, t, C, .45), last = t < D ? U : t < C ? D : C, kb = popEl(t, last, .45);
    let tally = ''; for (let i = 0; i < Math.min(v, 60); i++) { const g = Math.floor(i / 5), j = i % 5, x = 140 + (g % 8) * 105, y = 330 + Math.floor(g / 8) * 120; tally += j < 4 ? line(x + j * 18, y, x + j * 18, y + 80, 7, 'rgba(255,255,255,.85)') : line(x - 8, y + 60, x + 70, y + 20, 7, 'rgba(255,255,255,.85)'); }
    const ex = t < D ? 'talk' : t < C ? 'deadpan' : 'dizzy';
    return classroomT(t, tally) + leo({ x: CX, y: 1520, s: 1.35, expr: ex, armL: [200, 230], armR: [-20, -50 + 30 * Math.sin(t * 12)] }, t) + (t > C ? steam(CX - 60, 900, t, 1.2) + steam(CX + 60, 900, t + .3, 1.2) : '') +
      G(tr(CX, 900, .6 + .4 * kb), rect(-230, -95, 460, 190, SX.acc, 95, 8) + ftext(0, 40, `${v} FOIS`, { size: 96, fill: '#fff' })) ; },
  sfx: [[at(11, 'une'), 'ding', .6], [at(11, 'dix'), 'ding', .6], [at(11, 'dix') + .05, 'clock_fast', .4], [at(11, '100'), 'kaching', .6], [at(11, '100') + .1, 'boing', .5]] });
// B012 — à chaque nouvelle classe : la plaque de la porte défile CP → CM2, nouveaux visages, RESTART
B(12, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const N = at(12, 'nouvelle'), Rc = at(12, 'recommences'), cls = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], i = Math.min(4, Math.max(0, Math.floor((t - N) / .22) + 1)), flip = ((t - N) % .22) / .22;
    return hallway(t) + rect(560, 520, 420, 730, '#c99b6d', 8) + rect(590, 550, 360, 700, '#e8c08a', 6) + circ(910, 900, 16, '#ffd23f', 5) + G(tr(770, 640, 1, 0), G(`scale(1 ${t > N && t < N + 1.1 ? f1(Math.abs(Math.cos(flip * Math.PI))) : 1})`, rect(-120, -60, 240, 120, '#fff', 14) + ftext(0, 26, cls[i], { size: 72, fill: SX.ink, stroke: 'none' }))) +
      leo({ x: 330, y: 1520, s: 1.35, expr: t > Rc ? 'deadpan' : 'talk', armR: [-40, -60] }, t) + [0, 1, 2].map(j => kidHead((i + j) % 6, 690 + j * 120, 930 + (j % 2) * 40, 62, { expr: 'confused' }, t) + qmark(690 + j * 120, 830, .45, '#fff', -10 + j * 10)).join('') +
      funTag(CX, 410, '↺ RESTART', t, Rc - .05, { size: 62, bg: SX.acc }); },
  sfx: [[at(12, 'nouvelle'), 'slot', .5], [at(12, 'classe'), 'school_bell', .4], [at(12, 'recommences') - .05, 'rewind', .7], [at(12, 'recommences') + .3, 'pop', .4]] });
// B013 — présenter ton visage : scène de théâtre, diapo « MON VISAGE » sur grand écran
B(13, { enter: 'none', trans: 'circle', transD: .35, cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const V = at(13, 'visage'), [mx, my] = markAt(CX, 590, 150); const scr = ftext(CX, 350, 'DIAPO 1 / 48 : MON VISAGE', { size: 38, fill: SX.ink, stroke: 'none' }) + leoHead(CX, 590, 150, { expr: 'smile' in EXPR ? 'smile' : 'neutral' }, t) + funBox(mx, my, 130, 100, t, V, { label: 'visage.ppt', col: SX.acc });
    return stageT(t, scr) + leo({ x: 280, y: 1560, s: 1.25, expr: 'worried', armR: [-40, -50], holdR: line(0, 0, 200, -120, 10, '#8a5a3a') }, t) + markerText('présenter…', 820, 1000, t, at(13, 'presenter'), { size: 46, col: SX.acc2 }); },
  sfx: [[0, 'drum', .5], [at(13, 'presenter'), 'scratch', .4], [at(13, 'visage'), 'tick', .6], [at(13, 'visage') + .2, 'shutter', .4]] });
// B014 — …avant ta personnalité : diapo suivante « PERSONNALITÉ », chargement bloqué à 2 %
B(14, { cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const P = at(14, 'personnalite'), pc = counter(0, 2, t, P, 1); const scr = kword('PERSONNALITÉ', CX, 460, t, P - .05, { size: 88, fill: SX.acc2 }) + bar(CX, 640, 600, pc / 100 + .015, { col: SX.acc, bg: '#e6dccb' }) + ftext(CX, 730, `chargement… ${pc} %`, { size: 40, fill: '#7a6a5a', stroke: 'none' }) + G(tr(CX, 360, 1, t * 300), circ(0, 0, 26, 'none', 8, '#c8bfb2') + path('M0 -26A26 26 0 0 1 26 0', 'none', 8, SX.acc));
    return stageT(t, scr) + leo({ x: 300, y: 1560, s: 1.25, expr: t > P + .6 ? 'deadpan' : 'worried', armL: [190, 200], armR: [-10, 20] }, t) + G(tr(820, 1050, 1, Math.sin(t * 2) * 8), rect(-60, -90, 120, 180, 'rgba(255,255,255,.2)', 20, 6) + path('M-50 -80L50 -80L0 0Z', '#ffd23f', 5) + path(`M0 0L-50 80L50 80Z`, '#ffd23f', 5)); },
  sfx: [[at(14, 'avant'), 'typing', .4], [at(14, 'personnalite') - .05, 'boom', .5], [at(14, 'personnalite') + .4, 'error_beep', .5], [at(14, 'personnalite') + .8, 'tick', .4]] });
// B015 — en grandissant (pousse d'un coup), tu découvres LES FILTRES : téléphone sacré + débloqué
B(15, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Gr = at(15, 'grandissant'), F = at(15, 'filtres') - .05, g = eOutBack(seg(t, Gr, Gr + .4)), fl = 1 + .04 * Math.sin(t * 4);
    const scr = rect(-150, -295, 300, 590, '#ffe1ee', 24, 0) + G(tr(0, -60), head({ hr: 95, hairFn: markHair, seed: 2, expr: 'happy', mark: 1 }, t)) + ftext(0, 140, 'FILTRES', { size: 46, fill: SX.acc }) + sparkle(-90, -200, .5, '#ffd23f') + sparkle(100, 60, .4, '#ffd23f');
    return bedroomN(t) + (t > F ? glow(780, 640, 420, '#fff6c8', .5) : '') + unlock(780, 640, t, F, { part: 'back', r: 460 }) + (g < .5 ? leo({ x: 380, y: 1520, s: 1.3, expr: 'neutral' }, t) : leoA({ x: 380, y: 1560, s: 1.2 * lerp(.85, 1, g), expr: t > F ? 'wow' : 'shock', armR: [-40, -10] }, t)) +
      (t > F - .3 ? G(tr(780, 640 + Math.sin(t * 3) * 10, .78 * fl * pop(t, F - .3, .4)), phoneBig(0, 0, 1, 0, scr)) : '') + unlock(780, 640, t, F, { part: 'front', r: 460 }) + (t < F ? funTag(CX, 380, 'EN GRANDISSANT', t, Gr - .05, { size: 46, bg: SX.cool }) : '') + kword('LES FILTRES', CX, 390, t, F, { size: 84, fill: SX.acc2 }); },
  sfx: [[at(15, 'grandissant'), 'whoosh_up', .7], [at(15, 'grandissant') + .3, 'boing', .5], [at(15, 'filtres') - .05, 'angel', .6], [at(15, 'filtres'), 'sparkle', .7], [at(15, 'filtres') + .1, 'flash_hit', .4]] });
// B016 — en un clic, ta tache disparaît : gros plan écran, doigt qui tape, la tache s'efface en paillettes
B(16, { enter: 'none', trans: 'zoom', transD: .25, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const C = at(16, 'clic'), Dp = at(16, 'disparait'), m = 1 - seg(t, Dp - .2, Dp + .35), tap = pop(t, C - .25, .25) * (1 - seg(t, C + .1, C + .4));
    const scr = grad('#bfe3ff', '#ffe1ee', -150, -295, 300, 590).replace('<rect', '<rect rx="24"') + G(tr(0, -70), head({ hr: 120, hairFn: markHair, seed: 2, expr: t > Dp ? 'wow' : 'neutral', mark: m }, t)) + (m < 1 && m > 0 ? sparkle(55, -30, .6 * (1 - m) + .2, '#fff') + sparkle(80, -60, .4, '#ffd23f') : '') +
      G(tr(0, 200, 1 + .1 * Math.sin(t * 6)), rect(-110, -38, 220, 76, t > C ? SX.acc : '#fff', 38, 6) + ftext(0, 16, 'FILTRE ✦', { size: 36, fill: t > C ? '#fff' : SX.ink, stroke: 'none' }));
    return bedroomN(t) + glow(CX, 820, 500, '#bfe3ff', .4) + phoneBig(CX, 820, 1.3, -3, scr) + (tap > 0 ? pointHand(CX + 20, 1095 + (1 - tap) * 20, -70, HERO, Math.min(1, tap + .2)) : '') + (t > Dp ? funBox(CX + 40, 690, 240, 200, t, Dp + .1, { label: 'retouche.app', col: SX.acc }) : '') + kthin('en un', 230, 390, t, at(16, 'en') , { size: 50 }) + kword('CLIC', 420, 395, t, C - .05, { size: 80, fill: SX.acc2, puff: false }); },
  sfx: [[at(16, 'clic') - .05, 'tick', .8], [at(16, 'clic'), 'pop_hi', .5], [at(16, 'disparait') - .2, 'magic', .7], [at(16, 'disparait') + .1, 'sparkle', .6]] });
// B017a — sur la photo : post Insta, compteur de cœurs qui s'affole
B(17, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ph = at(17, 'photo'), n = counter(0, 2847, t, Ph, .9);
    const scr = rect(-150, -295, 300, 590, '#fff', 24, 0) + circ(-110, -255, 20, HERO, 4) + ftext(-80, -244, 'leo', { size: 28, fill: SX.ink, stroke: 'none', anchor: 'start' }) + rect(-150, -220, 300, 300, '#ffe1ee', 0, 0) + G(tr(0, -60), head({ hr: 105, hairFn: markHair, seed: 2, expr: 'cool', mark: 0 }, t)) + heart(-110, 130, .55, '#ff3b5c') + ftext(-70, 145, `${n}`, { size: 40, fill: SX.ink, stroke: 'none', anchor: 'start' });
    return bedroomN(t) + phoneBig(CX, 820, 1.3, 2, scr) + heartsUp(t, CX + 280, 900, 7, 500) + heartsUp(t + .5, CX - 300, 950, 5, 450) + funTag(CX, 400, 'PHOTO', t, Ph - .1, { size: 56, bg: SX.acc }); },
  sfx: [[at(17, 'photo') - .1, 'shutter', .8], [at(17, 'photo'), 'pop', .5], [at(17, 'photo') + .2, 'pop_hi', .4], [at(17, 'photo') + .5, 'pop_hi', .4]] });
// B017b — tout le monde te trouve MAGNIFIQUE : foule aux yeux-cœurs, téléphones levés
B(17, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const Mg = at(17, 'magnifique') - (at(17, 'tout') - .15); let s = streetT(t, 2);
    for (let i = 0; i < 5; i++) { const x = 120 + i * 210, y = 1000 + (i % 2) * 90 + Math.sin(t * 5 + i) * 8; s += adultHead(i, x, y, 92, { expr: 'love' }, t) + G(tr(x + (i % 2 ? -70 : 70), y + 120, .32, (i % 2 ? -12 : 12)), phoneBig(0, 0, 1, 0, G(tr(0, -40), head({ hr: 110, hairFn: markHair, seed: 2, expr: 'cool', mark: 0 }, t)))); }
    return s + heartsUp(t, 300, 900, 6, 450) + heartsUp(t + .4, 800, 900, 6, 450) + kword('MAGNIFIQUE !', CX, 470, t, Mg, { size: 94, fill: SX.acc2 }) + burst(CX, 470, 0, t, 0); },
  sfx: [[0, 'whoosh', .5], [.2, 'kiss', .5], [at(17, 'magnifique') - (at(17, 'tout') - .15), 'tada', .6], [at(17, 'magnifique') - (at(17, 'tout') - .15) + .4, 'kiss', .5]] }, at(17, 'tout') - .15);
// B018a — et toi : la nuit, visage éclairé par l'écran, tu fixes « l'autre visage »
B(18, { enter: 'none', trans: 'circle', transD: .35, tx: 760, ty: 860, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d) }),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t * .5) * 10 }, [{ z: 1.4, svg: bedroomN(t), haze: .15, hazeCol: '#0d1030' }, { z: 1, svg: glow(560, 880, 480, '#9fd0ff', .35) + leoHead(330, 900, 175, { expr: 'sad', look: [1, .2] }, t) + phoneBig(780, 880, .7, -6, rect(-150, -295, 300, 590, '#ffe1ee', 24, 0) + G(tr(0, -40), head({ hr: 120, hairFn: markHair, seed: 2, expr: 'happy', mark: 0 }, t))) }, { z: .6, svg: blur(12, rect(-200, 1500, 1500, 600, '#141a40', 60, 0)) }]) +
    kthin('et toi…', CX, 400, t, at(18, 'toi'), { size: 58 }),
  sfx: [[0, 'whoosh', .3], [at(18, 'toi'), 'heartbeat', .5], [at(18, 'fixes'), 'hmm', .3], [at(18, 'visage'), 'glint', .4]] });
// B018b — ressemble au tien… mais pas complètement : deux cartes MOI / FILTRE, cercle sur la joue vide
B(18, { cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .2 }),
  draw: (t, d, T) => { const o = at(18, 'qui') - .15, P = at(18, 'pas') - o, Cm = at(18, 'completement') - o;
    return blur(8, bedroomN(t)) + op(.4, rect(-M, -M, W + 2 * M, H + 2 * M, '#0d1030', 0, 0)) + card(300, 860, 380, 440, leoHead(0, 10, 130, { expr: 'sad' }, t) + ftext(0, 180, 'MOI', { size: 44, fill: SX.ink, stroke: 'none' }), t, .02, { ry: 10, r: -4 }) +
      card(780, 860, 380, 440, G(tr(0, 10), head({ hr: 130, hairFn: markHair, seed: 2, expr: 'happy', mark: 0 }, t)) + ftext(0, 180, 'FILTRE', { size: 44, fill: SX.acc, stroke: 'none' }), t, .15, { ry: -10, r: 4 }) +
      G(tr(CX, 860), ftext(0, 30, t > P ? '≠' : '≈', { size: 120, fill: '#fff' })) + markerCircle(780 + .46 * 130, 870 + .3 * 130, 60, 48, t, P + .1, { col: SX.acc2, w: 10 }) +
      kthin('mais pas', CX, 400, t, P, { size: 54 }) + kword('COMPLÈTEMENT', CX, 510, t, Cm - .05, { size: 82, fill: SX.acc2, puff: false }); },
  sfx: [[.02, 'pop', .4], [.15, 'pop', .4], [at(18, 'pas') - (at(18, 'qui') - .15), 'scratch', .5], [at(18, 'completement') - (at(18, 'qui') - .15), 'sting', .4]] }, at(18, 'qui') - .15);
// B019 — certaines sont liées à la pigmentation : insert « science », coupe de peau, cellules pigmentées rigolotes
B(19, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const P = at(19, 'pigmentation'); return paper('#fff4e4') + gobo(T, .1) + card(CX, 850, 800, 580, skinCut(t, 'pig', seg(t, .2, P + .3)), t, 0, { ry: lerp(16, 0, seg(t, 0, .6)), bg: '#fff' }) + G(tr(820, 650, 1, Math.sin(t * 2) * 6), magnifier(0, 0, 1.1)) +
    kthin('certaines taches :', CX, 380, t, at(19, 'certaines'), { size: 50 }) + funTag(CX, 480, 'PIGMENTATION', t, P - .1, { size: 56, bg: '#a0703f' }); },
  sfx: [[0, 'magic', .4], [.3, 'pop_hi', .4], [.7, 'pop_hi', .4], [at(19, 'pigmentation') - .1, 'pop', .6], [at(19, 'pigmentation') + .2, 'ding', .4]] });
// B020 — d'autres, à des vaisseaux sanguins : même coupe, petits tuyaux rouges où défilent des globules
B(20, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.02, 1.07),
  draw: (t, d, T) => { const Vs = at(20, 'vaisseaux'); return paper('#ffeef2') + gobo(T, .1) + card(CX, 850, 800, 580, skinCut(t, 'vas', seg(t, .1, .8)), t, 0, { ry: 0, bg: '#fff' }) + kthin("d'autres :", CX, 380, t, 0, { size: 50 }) + funTag(CX, 480, 'VAISSEAUX SANGUINS', t, Vs - .1, { size: 48, bg: '#e2463a' }); },
  sfx: [[0, 'whoosh', .4], [at(20, 'vaisseaux') - .1, 'pop', .6], [at(20, 'sanguins'), 'flutter', .4]] });
// B021 — pas toutes la même origine ni la même évolution : galerie de portraits, chacun sa tache
B(21, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), x: Math.sin(t) * 10 }),
  draw: (t, d, T) => { const O = at(21, 'origine'), E = at(21, 'evolution'); const fr = [[300, 620, '#8a5a3a', .4, .25, 1.0, 0], [780, 620, MARK, -.3, -.55, .9, 1], [300, 1010, '#c99a6e', .1, .55, 1.2, 2], [780, 1010, '#7d5ba6', -.5, .2, .8, 3]]; let s = galleryT(t);
    fr.forEach(([x, y, col, mx, my, sc, i], j) => { const k = pop(t, .05 + j * .12, .35); if (k <= 0) return; const hd = head({ hr: 105, hair: AH[(i + 1) % 5], hairColor: AC[(i + 1) % 5], skin: SK[(i * 2 + 1) % 6], expr: ['happy', 'proud', 'smug', 'joy'][i], seed: 70 + i }, t) + markShape(105, 1, { x: mx, y: my, sc, col, rot: j * 40 });
      s += G(tr(x, y, k, (j % 2 ? 2 : -2)), rect(-185, -175, 370, 350, '#d9a441', 14) + rect(-160, -150, 320, 300, ['#cfe8f5', '#ffe1ee', '#e1f5d6', '#fff1c8'][j], 6) + G(tr(0, 10), hd)); });
    return s + funTag(CX, 815, '≠ ORIGINE', t, O - .1, { size: 48, bg: SX.cool, r: -6 }) + (t > E - .1 ? funTag(CX, 400, '≠ ÉVOLUTION', t, E - .1, { size: 54, bg: SX.acc, r: 4 }) : ''); },
  sfx: [[.05, 'pop', .4], [.17, 'pop', .4], [.29, 'pop', .4], [.41, 'pop', .4], [at(21, 'origine') - .1, 'boing', .5], [at(21, 'evolution') - .1, 'boing', .5]] });
// B022a — les inconnus : passants qui débarquent avec des loupes
B(22, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .5 }),
  draw: (t, d, T) => { const I = at(22, 'inconnus'), k = eOutCubic(seg(t, I - .2, I + .5)), [hx, hy, hr] = headOf(330, 1520, 1.12, 'adult');
    return streetT(t) + leoA({ x: 330, y: 1520, s: 1.12, expr: 'embarrassed' }, t) + adult(1, { x: lerp(1250, 760, k), y: 1540, s: 1.1, flip: 1, expr: 'suspicious', rot: -6, armR: [-20, -30], holdR: magnifier(60, -20, .5, -40) }, t) + adult(3, { x: lerp(1500, 990, k), y: 1560, s: 1.05, flip: 1, expr: 'suspicious', armR: [-60, -80], holdR: magnifier(40, -40, .45, -60) }, t) +
      funTag(CX, 410, 'LES INCONNUS', t, I - .05, { size: 56, bg: SX.cool }) + markerArrow(640, 600, markAt(hx, hy, hr)[0] + 40, markAt(hx, hy, hr)[1] - 40, t, at(22, 'comportent'), { col: SX.acc, bend: -60 }); },
  sfx: [[at(22, 'inconnus') - .2, 'steps', .7], [at(22, 'inconnus') - .05, 'pop', .5], [at(22, 'comportent'), 'scratch', .5], [at(22, 'comportent') + .3, 'hmm', .5]] });
// B022b — …un DIPLÔME DE DERMATOLOGIE : blouses blanches, toques de diplômés, lancer de chapeaux
B(22, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.04, shake: t > at(22, 'dermatologie') - at(22, 'avaient') + .15 ? 3 : 0 }),
  draw: (t, d, T) => { const o = at(22, 'avaient') - .15, Dp = at(22, 'diplome') - o, Dm = at(22, 'dermatologie') - o; let s = streetT(t, 2);
    for (let i = 0; i < 3; i++) { const x = 220 + i * 320, up = seg(t, Dm + .2, Dm + 1.0); s += adult(i, { x, y: 1530, s: 1.05, coat: true, shirt: '#fff', stetho: true, expr: t > Dm ? 'proud' : 'smug', armR: [-50, -80], holdR: diploma(40, -60, .45, -10 + i * 8) }, t) + G(tr(x + (i - 1) * 140 * up, 1530 - 430 * 1.05 - 60 - 900 * up * (1 - up * .5), 1.05 * .55, up * 300 * (i % 2 ? 1 : -1)), gradCap(0, 0, 1, 0, t)); }
    return s + funTag(CX, 400, 'DIPLÔMÉS ?', t, Dp - .1, { size: 54, bg: '#fff', fg: SX.ink }) + kword('DERMATOLOGIE', CX, 520, t, Dm - .05, { size: 90, fill: SX.acc2 }) + (t > Dm ? confetti(t, Dm, 30) : ''); },
  sfx: [[0, 'flash_hit', .5], [at(22, 'diplome') - at(22, 'avaient') + .05, 'pop', .6], [at(22, 'dermatologie') - at(22, 'avaient') + .1, 'tada', .7], [at(22, 'dermatologie') - at(22, 'avaient') + .5, 'whoosh_up', .5]] }, at(22, 'avaient') - .15);
// B023 — un jour, tu arrives à une fête : boule disco, guirlandes, danseurs ; Léo entre par la porte
B(23, { enter: 'none', trans: 'wipe', transD: .3, cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const k = eOutCubic(seg(t, at(23, 'arrives') - .2, at(23, 'fete'))); return partyT(t) + rect(-40, 560, 260, 740, '#120820', 8) + leoA({ x: lerp(60, 360, k), y: 1560, s: 1.15, expr: 'worried', walk: k < 1 ? 3 : 0 }, t) + funTag(CX + 160, 440, 'FÊTE !', t, at(23, 'fete') - .05, { size: 76, bg: SX.acc }) + burst(CX + 160, 440, 0, t, 0); },
  sfx: [[0, 'drum', .5], [at(23, 'arrives'), 'steps', .6], [at(23, 'fete') - .05, 'pop', .7], [at(23, 'fete'), 'sparkle', .4]] });
// B024 — une personne s'approche : la foule s'écarte, Inès avance au ralenti, Léo claque des dents
B(24, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.12, t / d) }),
  draw: (t, d, T) => { const k = seg(t, 0, d); return partyT(t, { part: eOutCubic(k) }) + glow(640, 900, 380, '#fff6c8', .35) + ines({ x: 660, y: 1500, s: lerp(.95, 1.2, k), expr: 'happy', walk: 1.2 }, t * .5) + leoHead(250, 1000, 160, { expr: 'chatter', look: [1, 0] }, t) + sweatSpray(250, 980, t, 4) + funTag(660, 420, "S'APPROCHE…", t, at(24, 'approche') - .1, { size: 50, bg: '#fff', fg: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [.1, 'heartbeat', .7], [at(24, 'approche') - .1, 'pop', .5], [at(24, 'approche'), 'steps', .4]] });
// B025 — tu prépares déjà ta réponse habituelle : fiches de révision en éventail, « reponses.pdf »
B(25, { enter: 'punch', cam: camHand(1.05, .4),
  draw: (t, d, T) => { const Rp = at(25, 'reponse'), lbl = ['OUI', 'NÉ AVEC', 'NON', 'PAS MAL']; return blur(8, partyT(t)) + leoHead(CX, 1000, 185, { expr: 'effort' }, t) + sweatSpray(CX, 980, t, 4) + cardArc(CX, 1000, 4, 360, t, at(25, 'prepares') - .1, i => ftext(0, 14, lbl[i], { size: 34, fill: SX.ink, stroke: 'none' }), { w: 200, h: 120 }) +
    funBox(CX, 815, 900, 280, t, Rp, { label: 'reponses.pdf', col: SX.acc }) + funTag(CX, 400, 'HABITUELLE', t, at(25, 'habituelle') - .1, { size: 52, bg: SX.cool }); },
  sfx: [[at(25, 'prepares') - .1, 'pop', .5], [at(25, 'prepares') + .14, 'pop', .4], [at(25, 'reponse'), 'tick', .6], [at(25, 'habituelle') - .1, 'typing', .5]] });
// B026 — « Oui, je suis né avec » : bulle de pensée, bébé Léo avec la même tache
B(26, { enter: 'none', trans: 'up', transD: .22, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const A = at(26, 'avec'), Ne = at(26, 'ne'); return blur(8, partyT(t)) + leoHead(330, 1020, 165, { expr: 'talk', look: [.5, -.4] }, t) + thought(720, 700, 440, 400, person({ age: 'baby', x: 0, y: 190, s: 1.1, hairFn: markHair, shirt: '#9dbcec', expr: 'happy', mark: 1 }, t), seg(t, Ne - .3, Ne)) +
    funTag(330, 470, 'OUI,', t, at(26, 'oui') - .05, { size: 64, bg: SX.acc2, fg: SX.ink }) + markerText('né avec !', 760, 960, t, A, { size: 50, col: SX.acc }); },
  sfx: [[at(26, 'oui') - .05, 'pop', .6], [at(26, 'ne') - .3, 'magic', .4], [at(26, 'ne'), 'baby_coo', .5], [at(26, 'avec'), 'scratch', .4]] });
// B027 — « Non, ça ne fait pas forcément mal » : Léo tapote sa joue, pouce levé
B(27, { enter: 'whip', cam: camHand(1.05, .4),
  draw: (t, d, T) => { const F = at(27, 'fait'), [mx, my] = markAt(CX - 40, 900, 200), boop = Math.max(0, Math.sin((t - F) * 18)) * seg(t, F, F + .6) * (1 - seg(t, F + .6, F + .8)); return blur(8, partyT(t)) + leoHead(CX - 40, 900, 200, { expr: t > F + .4 ? 'happy' : 'neutral' }, t) +
    (t > F - .2 ? pointHand(mx + 90 + boop * 20, my + 30 + boop * 10, -150, HERO, pop(t, F - .2, .25)) : '') + G(tr(240, 1150, 1, -10), circ(0, 0, 70, HERO, 7) + rect(-20, -110, 40, 80, SKIN, 20, 6) + rect(-60, -40, 120, 90, SKIN, 34, 6)) +
    funTag(CX - 40, 420, 'NON,', t, at(27, 'non') - .05, { size: 64, bg: SX.acc, fg: '#fff' }) + markerText('pas forcément mal', CX + 60, 640, t, at(27, 'mal') - .1, { size: 46, col: SX.acc2 }); },
  sfx: [[at(27, 'non') - .05, 'pop', .6], [at(27, 'fait'), 'boing', .6], [at(27, 'fait') + .2, 'squeak', .4], [at(27, 'mal'), 'ding', .5]] });
// B028 — mais elle demande simplement : « Salut. » — les fiches tombent, sourire d'Inès
B(28, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const Sm = at(28, 'simplement'), Sl = at(28, 'salut') - .05; let cards = ''; for (let i = 0; i < 4; i++) { const k = seg(t, Sm - .2 + i * .1, Sm + .9 + i * .1); if (k > 0) cards += G(tr(180 + i * 240, 300 + k * 1500, .9, k * 400 * (i % 2 ? 1 : -1)), rect(-100, -60, 200, 120, '#fff', 14) + ftext(0, 12, ['OUI', 'NÉ AVEC', 'NON', 'PAS MAL'][i], { size: 30, fill: SX.ink, stroke: 'none' })); }
    return depth({ zoom: 1 }, [{ z: 1.5, svg: partyT(t), blur: 4 }, { z: 1, svg: glow(CX, 900, 450, '#ffd9a0', .4) + ines({ x: 640, y: 1560, s: 1.25, expr: t > Sl ? 'joy' : 'happy', armR: [-60, -110 + 20 * Math.sin(t * 12)] }, t) }]) + cards + burst(CX - 180, 520, 200, t, Sl, SX.acc2) + kword('SALUT.', CX - 180, 520, t, Sl, { size: 92, fill: '#fff', puff: false }); },
  sfx: [[at(28, 'demande'), 'hmm', .3], [at(28, 'simplement') - .2, 'whoosh', .5], [at(28, 'simplement') + .5, 'thud', .4], [at(28, 'salut') - .05, 'chirp', .6], [at(28, 'salut'), 'pop', .5]] });
// B029 — « Comment tu t'appelles ? » : gros plan Inès, bulle géante
B(29, { enter: 'crash', cam: zin(1.04, 1.1),
  draw: (t, d, T) => blur(10, partyT(t)) + glow(CX, 900, 500, '#ffd9a0', .4) + inesHead(CX, 920, 220, { expr: t > at(29, 'appelles') ? 'happy' : 'talk', look: [-.3, 0] }, t) + popStars(CX, 920, t, .1, 6, 300) + funTag(CX, 470, "COMMENT TU T'APPELLES ?", t, .02, { size: 46, bg: '#fff', fg: SX.ink }) + heartsUp(t, CX + 320, 1100, 3, 300),
  sfx: [[0, 'whoosh', .4], [.02, 'pop', .6], [at(29, 'appelles'), 'glint', .6], [.6, 'chirp', .4]] });
// B030 — tu restes silencieux une seconde : temps figé, confettis suspendus, grillons, « 1 s »
B(30, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.12, eInOut(clamp(t / d))) }),
  draw: (t, d, T) => { const Sc = at(30, 'seconde'); return op(.6, partyT(1.3)) + op(.45, rect(-M, -M, W + 2 * M, H + 2 * M, '#0d0618', 0, 0)) + confetti(1.3, 0, 30) + leoHead(CX, 920, 230, { expr: 'shock', face: { mouth: 'o-small' } }, t) +
    [0, 1, 2].map(i => t > .3 + i * .3 ? circ(CX - 60 + i * 60, 620, 16, '#fff', 5) : '').join('') + funTag(CX, 420, '1 SECONDE', t, Sc - .1, { size: 54, bg: SX.cool }) + markerText('…', CX + 280, 1150, t, at(30, 'silencieux'), { size: 70, col: '#fff' }); },
  sfx: [[0, 'crickets', .6], [.3, 'tick', .4], [.6, 'tick', .4], [.9, 'tick', .4], [at(30, 'seconde') - .1, 'pop', .4]] });
// B031 — parce que pour la première fois depuis longtemps : lumière chaude, pages de calendrier qui s'envolent
B(31, { enter: 'none', trans: 'circle', transD: .35, cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d) }),
  draw: (t, d, T) => { const L = at(31, 'longtemps'); let pg = ''; for (let i = 0; i < 6; i++) { const k = seg(t, L - .3 + i * .08, L + .9 + i * .08); if (k > 0 && k < 1) pg += op(1 - k, calendarPage(CX + (i - 2.5) * 140 + k * 300 * (i % 2 ? 1 : -1), 900 - k * 700, .55, k * 300, `${2010 + i * 2}`)); }
    return grad('#ffcf9a', '#ff9ab0', -M, -M, W + 2 * M, H + 2 * M) + bokeh(t, 4, 12) + lightLeak(T, .35) + leoHead(CX, 920, 220, { expr: 'calm', look: [0, -.2] }, t) + pg + kthin('pour la première fois', CX, 380, t, at(31, 'pour'), { size: 50 }) + kword('DEPUIS LONGTEMPS', CX, 490, t, L - .05, { size: 74, fill: '#fff', puff: false }); },
  sfx: [[0, 'magic', .4], [at(31, 'premiere'), 'heartbeat', .4], [at(31, 'longtemps') - .3, 'flutter', .6], [at(31, 'longtemps'), 'whoosh_up', .4]] });
// B032a — quelqu'un a regardé ton visage : face à face, regards qui se croisent, tache bien visible et assumée
B(32, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const V = at(32, 'visage'), Rg = at(32, 'regarde'); return depth({ zoom: 1 }, [{ z: 1.5, svg: partyT(t, { dancers: true }), blur: 5 }, { z: 1, svg: glow(CX, 900, 520, '#ffd9a0', .45) + leoA({ x: 330, y: 1540, s: 1.15, expr: t > V ? 'happy' : 'shock', look: [1, 0] }, t) + ines({ x: 760, y: 1540, s: 1.15, flip: 1, expr: 'happy', look: [-1, 0] }, t) }]) +
    (t > Rg ? markerPath(`M720 1080Q${CX + 10} 1000 400 1080`, t, Rg, { col: SX.acc2, w: 8 }) + sparkle(CX + 10, 1010, .5 + .2 * Math.sin(t * 10), '#fff') : '') + funTag(CX, 420, 'REGARDÉ', t, Rg - .05, { size: 56, bg: SX.acc }); },
  sfx: [[0, 'whoosh', .4], [at(32, 'regarde') - .05, 'pop', .5], [at(32, 'regarde') + .1, 'sparkle', .5], [at(32, 'visage'), 'glint', .5]] });
// B032b — FIN : …sans oublier qu'il y avait UNE PERSONNE DERRIÈRE — débloqué, badge « LÉO » enfin rempli
B(32, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const o = at(32, 'sans') - .15, P = at(32, 'personne') - o, Dr = at(32, 'derriere') - o, [hx, hy, hr] = headOf(CX, 1460, 1.2, 'adult');
    return partyT(t) + glow(CX, 950, 560, '#ffd9a0', .4) + unlock(hx, hy, t, P, { part: 'back', r: 520 }) + leoA({ x: CX, y: 1460, s: 1.2, expr: t > P ? 'joy' : 'happy' }, t) + nameBadge(CX, 1190, .5, 'Léo', t, P + .1, -6) + unlock(hx, hy, t, P, { part: 'front', r: 520 }) + funBox(hx, hy - 10, 300, 300, t, P + .3, { label: 'léo.png', col: SX.cool }) +
      kthin("sans oublier qu'il y avait", CX, 330, t, 0, { size: 46 }) + kword('UNE PERSONNE', CX, 450, t, P - .05, { size: 96, fill: SX.acc2 }) + kword('DERRIÈRE.', CX, 570, t, Dr - .05, { size: 80, fill: '#fff' }) + (t > Dr ? confetti(t, Dr, 40) : ''); },
  sfx: [[0, 'whoosh', .4], [at(32, 'oublier') - (at(32, 'sans') - .15), 'hmm', .3], [at(32, 'personne') - (at(32, 'sans') - .15), 'boom', .5], [at(32, 'personne') - (at(32, 'sans') - .15) + .1, 'sparkle', .6], [at(32, 'derriere') - (at(32, 'sans') - .15), 'tada', .7]] }, at(32, 'sans') - .15);

SCENES.sort((a, b) => a.s - b.s);
