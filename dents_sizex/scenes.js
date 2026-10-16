// ============================================================
//  « TITRE DE L'ÉPISODE » — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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

// ---------- titre d'accroche (3 lignes, dernier mot en couleur) ----------
const TITLE = ["POURQUOI C'EST", 'HORRIBLE DE NAÎTRE', 'XXXXX ?'], TITLE_COL = '#ffb84d';


// ---------- personnages ----------
// ---------- personnages ----------
const TEAL = '#2fa3a0';
// le héros : ado à bagues (bouche « metal* »)
const ado = (o, t) => person(Object.assign({ age: 'kid', hair: 'short', hairColor: '#5a3a26', shirt: TEAL, pants: '#3b3f4a', seed: 2, expr: 'metal' }, o), t);
const adoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'short', hairColor: '#5a3a26', seed: 2, expr: 'metal' }, o), t));
const crush = (o, t) => person(Object.assign({ age: 'kid', hair: 'ponytail', hairColor: '#e0a040', shirt: '#ff8fb1', pants: '#5b4b6e', seed: 6 }, o), t);
const crushHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'ponytail', hairColor: '#e0a040', seed: 6 }, o), t));
const ortho = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#7a7a80', glasses: true, shirt: '#f4f7fa', coat: 1, pants: '#5b7bd6', seed: 7 }, o), t);
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
function heartsUp_(t, x, y, n = 5) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * .8 + i / n) % 1; s += op(1 - k, heart(x + Math.sin(k * 9 + i) * 60 + (i - n / 2) * 30, y - k * 380, .6 + k * .3)); } return s; }
function schoolyard_(t) { return grad('#9fd6ff', '#e6f5ff', -M, -M, W + 2 * M, 1500) + building(-100, 1150, 600, 520, '#f0d9b5') + building(560, 1150, 700, 440, '#e8c9a0') + rect(-M, 1150, W + 2 * M, 1500, '#c9b8a0', 0, 0); }


const orthoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'side', hairColor: '#7a7a80', glasses: true, seed: 7 }, o), t));
// ---------- décors (repris de dents) ----------
function office(t) { return tiles('#e6f4f2', '#cfe6e2', 140) + rect(-M, 1250, W + 2 * M, 1400, '#b9d6d2', 0, 0) + rect(700, 300, 300, 220, '#fff', 12) + toothChar(850, 410, .55, t, { expr: 'happy' }) + windowFrame(80, 300, 300, 360); }
function kitchen(t) { return grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 300, W + 2 * M, 40, '#c58e55', 0, 0) + [0, 1, 2, 3].map(i => rect(80 + i * 240, 120, 200, 170, '#f4d9a8', 10)).join('') + rect(-M, 1250, W + 2 * M, 1400, '#d9b68a', 0, 0) + rect(-M, 1200, W + 2 * M, 70, '#c58e55', 0, 0); }
function schoolyard(t) { return grad('#9fd6ff', '#e6f5ff', -M, -M, W + 2 * M, 1500) + building(-100, 1150, 600, 520, '#f0d9b5') + building(560, 1150, 700, 440, '#e8c9a0') + rect(-M, 1150, W + 2 * M, 1500, '#c9b8a0', 0, 0); }
function bathroom(t) { return bathroomWall(t) + mirror(190, 300, 700, 820); }
function busInside(t) { let s = grad('#dfe7ee', '#c9d4de', -M, -M, W + 2 * M, H + 2 * M); for (let i = 0; i < 3; i++) s += rect(40 + i * 340, 260, 300, 360, '#bfe3f5', 20) + G(tr(-((t * 900) % 600) + i * 0, 0), building(60 + i * 340, 620, 160, 200, '#e7c9a0')); s += line(-M, 220, W + M, 220, 18, '#ffd23f') + rect(-M, 1250, W + 2 * M, 1400, '#6b7480', 0, 0); for (let i = 0; i < 4; i++) s += line(140 + i * 270, 220, 140 + i * 270, 1250, 14, '#ffd23f'); return s; }
function prisonYard(t) { return grad('#8a8f99', '#b5bac2', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 1250, W + 2 * M, 1400, '#6b6f78', 0, 0); }
function nightStreet(t) { return street(t, { sky1: '#1d2350', sky2: '#3a3f7a' }) + rect(-M, -M, W + 2 * M, H + 2 * M, 'rgba(10,10,40,.35)', 0, 0); }
function stripedShirt(x, y, s) { let g = ''; for (let i = 0; i < 5; i++) g += rect(-80, -230 + i * 34, 160, 16, '#2b2420', 0, 0); return G(tr(x, y, s), g); }
function heartsUp(t, x, y, n = 5) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * .8 + i / n) % 1; s += op(1 - k, heart(x + Math.sin(k * 9 + i) * 60 + (i - n / 2) * 30, y - k * 380, .6 + k * .3)); } return s; }
function coinRain(t, n = 16) { let s = ''; for (let i = 0; i < n; i++) { const x = (i * 137) % W, y = ((i * 211 + t * 700) % (H + 200)) - 100; s += G(tr(x, y, 1, t * 200 + i * 40), ell(0, 0, 34, 34, '#ffd23f', 5) + text(0, 14, 'none', '€', '#c99a1a', 40)); } return s; }


// ============================================================
//  SIZEX — ADN cartoon (persos, expressions, gags) + motion design (typo cinétique, cut-outs, cartes 2.5D,
//  cadres de design, marqueur, trame, grain, transitions). Palette : encre/papier + accent unique.
// ============================================================
SX.acc = '#ff3d6e'; SX.acc2 = '#ffd23f';
const ink = (t) => gridBg(SX.ink) + halftoneFade('#fff', .06, 1);
const pap = (t, T) => paper(SX.paper) + gobo(T || t, .12);

// B001 — accroche : héros en cut-out sur grille encre, anneaux, titre cinétique (fin / fin / MOT-CLÉ slam)
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => ink(t) + rings(CX, 980, t, .5) + G(tr(CX, 980, 1 + .03 * Math.sin(t * 6)), cutout(adoHead(0, 0, 230, { expr: 'metal' }, t), 14)) + sparkle(CX - 50, 1050, .5 + .3 * Math.sin(t * 10), '#fff') + sparkle(CX + 60, 1060, .35 + .3 * Math.cos(t * 9), '#fff') +
    kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 66 }) + kthin("HORRIBLE D'AVOIR", CX, 410, t, .3, { size: 66 }) + kword('UN APPAREIL ?', CX, 535, t, .6, { size: 118, fill: SX.acc2 }) + selBox(CX, 980, 560, 560, t, 1.1, { label: 'bagues.png', r: -3 }),
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [.6, 'boom', .6], [.62, 'flash_hit', .4], [1.1, 'tick', .5], [1.4, 'glint', .7]] });
// B002 — « Tu souris à ton crush » : papier + ombre de feuillage, deux cut-outs, mot-clé CRUSH
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => pap(t, T) + cutout(ado({ x: 300, y: 1450, s: 1.35, expr: 'metal', look: [1, 0] }, t), 12) + cutout(crush({ x: 790, y: 1450, s: 1.3, expr: 'neutral', look: [-1, 0], flip: 1 }, t), 12) + heartsUp_(t, 320, 880, 4) +
    kthin('tu souris à ton', CX, 430, t, 0, { size: 60, fill: SX.ink }) + kword('CRUSH', CX, 560, t, at(2, 'crush') - .08, { size: 150, fill: SX.acc, acc: SX.ink }) + markerArrow(560, 640, 740, 820, t, at(2, 'crush') + .15, { col: SX.acc }),
  sfx: [[0, 'whoosh', .5], [at(2, 'souris'), 'glint', .8], [at(2, 'crush') - .08, 'boom', .5], [at(2, 'crush') + .15, 'scratch', .4]] });
// B003 — elle te sourit : son visage dans une carte 2.5D qui pivote, anneaux roses
B(3, { enter: 'none', trans: 'zoom', transD: .22, cam: zin(1.04, 1.1),
  draw: (t, d, T) => paper('#ffd6e3') + halftone(-200, -200, W + 400, H + 400, 'rgba(255,61,110,.18)', 26) + rings(CX, 860, t, 0, [SX.acc, '#fff', SX.acc2]) + card(CX, 860, 620, 700, crushHead(0, 20, 230, { expr: 'joy', look: [-.4, 0] }, t), t, 0, { ry: lerp(28, -8, seg(t, 0, .5)), bg: '#fff3f7' }),
  sfx: [[0, 'pop', .6], [.1, 'sparkle', .7]] });
// B004 — « T'as un truc entre les dents » : notification qui glisse, texte qui se décode, ton sourire se fige
B(4, { enter: 'none', trans: 'glitch', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const T_ = at(4, 'truc'); const k = eOutBack(seg(t, .05, .4)); return pap(t, T) + cutout(adoHead(CX, 1000, 220, { expr: 'metal', face: t > T_ + .2 ? { eyes: 'huge', brows: 'sad' } : {} }, t), 12) + (t > T_ + .2 ? sweatSpray(CX, 1000, t, 4) : '') +
    G(tr(CX, lerp(160, 520, k)), rect(-400, -110, 800, 220, 'rgba(255,255,255,.96)', 40, 5, SX.ink) + circ(-310, 0, 54, '#ff8fb1', 5) + G(tr(-310, 0), head({ hr: 44, hair: 'ponytail', hairColor: '#e0a040', expr: 'talk', seed: 6 }, t)) +
      ftext(-230, -30, 'Crush 💗', { size: 34, font: SX.thin, weight: 200, anchor: 'start', fill: '#666' }) + ftext(-230, 40, scramble("T'as un truc entre les dents", t, .2, T_ + .2), { size: 40, font: 'Fredoka', weight: 700, anchor: 'start', fill: SX.ink })); },
  sfx: [[.05, 'ding', .7], [.2, 'typing', .6], [at(4, 'truc'), 'sting', .6], [at(4, 'dents'), 'scratch', .5]] });
// B005 — CRASH ZOOM : la bouche en cut-out, la salade entourée au marqueur
B(5, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.12, 1.04, eOutCubic(clamp(t / .4))), shake: t < .4 ? 8 : 1 }),
  draw: (t, d, T) => gridBg(SX.ink) + rings(CX, 880, t, 0) + cutout(bigMouth(CX, 880, 1.15, t, { braces: 1, salad: 1, open: .35 }), 14) + markerCircle(CX - 80, 860, 150, 130, t, .25, { col: SX.acc2 }) + markerText('SALADE !', CX + 160, 560, t, at(5, 'salade') - .1, { size: 90 }) + markerArrow(CX + 120, 600, CX - 20, 760, t, at(5, 'salade'), { bend: -60 }),
  sfx: [[0, 'flash_hit', .8], [.25, 'scratch', .6], [at(5, 'salade') - .1, 'boing', .6]] });
// B006 — compteur géant 12:00 → 16:xx, jauge « DEPUIS MIDI »
B(6, { enter: 'none', trans: 'up', transD: .25, cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const k = seg(t, at(6, 'midi') - .4, d); const mins = Math.floor(k * 287); return paper(SX.cream) + halftoneFade(SX.ink, .1, 1) +
    ftext(CX, 780, `${12 + Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`, { size: 300, fill: SX.ink }) + bar(CX, 900, 700, k, { label: 'coincée depuis…', fg: SX.ink, bg: 'rgba(0,0,0,.08)' }) +
    kword('MIDI', CX, 390, t, at(6, 'midi') - .08, { size: 130, fill: SX.acc2, acc: SX.ink }) + G(tr(CX, 1110, .5), cutout(bigMouth(0, 0, 1, t, { braces: 1, salad: 1, open: .3 }), 16)); },
  sfx: [[0, 'whoosh', .5], [at(6, 'midi') - .4, 'clock_fast', .7], [at(6, 'midi') - .08, 'pop', .7]] });
// B007 — « Magnifique. » : mot 3D extrudé ironique + « (non) » au marqueur, héros blasé
B(7, { enter: 'punch', cam: () => ({ z: 1.06 }),
  draw: (t, d, T) => gridBg('#2a2440') + extrude('MAGNIFIQUE.', CX, 560, t, 0, { size: 140, side: '#ffb3c8', fill: '#fff' }) + markerText('(non)', CX + 250, 720, t, .22, { size: 64, col: SX.acc2 }) + cutout(adoHead(CX, 1020, 170, { expr: 'deadpan', face: { mouth: 'metalSalad' } }, t), 12),
  sfx: [[0, 'glint', .7], [.22, 'scratch', .5]] });
// B008 — l'orthodontiste : fond encre, poursuite, cut-out avec cadre « orthodontiste.exe », outils qui brillent
B(8, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), r: -4, hand: .3 }),
  draw: (t, d, T) => gridBg(SX.ink) + `<path d="M${CX - 90} -100L${CX + 90} -100L${CX + 520} 1500L${CX - 520} 1500Z" fill="rgba(255,250,210,.13)"/>` + cutout(ortho({ x: CX, y: 1500, s: 1.4, expr: 'smugger', armR: [-60, -80], holdR: pliers(0, -40, .6, 0, .3 + .2 * Math.sin(t * 8)) }, t), 12) +
    selBox(CX, 980, 420, 470, t, .25, { label: 'orthodontiste.exe', col: SX.acc }) + kthin('tout commence chez', CX, 350, t, 0, { size: 56 }) + kword("L'ORTHODONTISTE", CX, 470, t, at(8, 'ortho') - .08, { size: 104, fill: '#fff', glow: SX.acc }),
  sfx: [[0, 'whoosh', .6], [.25, 'tick', .5], [.4, 'glint', .7], [at(8, 'ortho') - .08, 'sting', .7]] });
// B009 — « ça va juste serrer un peu » : pilules qui poussent sur les mots, clé qui tourne
B(9, { enter: 'none', trans: 'push', transD: .25, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => pap(t, T) + cutout(orthoHead(CX - 180, 900, 210, { expr: 'smugger', look: [1, .5] }, t), 12) + G(tr(CX + 250, 1000, 1, t * 400), orthoKey(0, 0, 1.0)) +
    pill(CX - 170, 470, 'JUSTE', t, at(9, 'juste') - .05, { col: SX.ink }) + pill(CX + 180, 470, 'UN PEU', t, at(9, 'peu') - .1, { col: SX.acc, border: '#fff' }) + markerText('…promis', CX + 240, 620, t, at(9, 'peu') + .25, { size: 54 }),
  sfx: [[at(9, 'juste') - .05, 'pop', .6], [at(9, 'serrer'), 'squeak', .8], [at(9, 'peu') - .1, 'pop_hi', .6], [at(9, 'peu') + .25, 'scratch', .4]] });
// B010 — « UN PEU ?! » : glitch + tunnel, visage au bord de l'implosion
B(10, { enter: 'crash', flash: 1, cam: () => ({ z: 1.08, shake: 12 }),
  draw: (t, d, T) => glitch(tunnel(CX, 900, T, [SX.acc, '#b05cff', SX.acc2]) + cutout(adoHead(CX, 900, 240, { expr: 'metalPain', face: { eyes: 'pop' } }, t), 14) + kword('UN PEU ?!', CX, 450, t, 0, { size: 150, fill: '#fff', glow: SX.acc }), T, t < .3 ? 1 - t / .3 : (Math.sin(t * 9) > .85 ? .4 : 0)),
  sfx: [[0, 'crack', .9], [.05, 'flash_hit', .7], [.15, 'zap', .6]] });

SCENES.sort((a, b) => a.s - b.s);
