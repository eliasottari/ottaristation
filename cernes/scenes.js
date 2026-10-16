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
function park(t) { return SKY(t, '#9fe0ff', '#fff4dc') + rect(-M, 1100, W + 2 * M, 1000, '#8fd16a', 0, 0) + treeC(120, 1160, 1, t) + treeC(980, 1140, 1.1, t) + Array.from({ length: 10 }, (_, i) => circ((i * 211) % W, 1300 + (i * 97) % 500, 10, ['#ffd23f', '#ff8fb1', '#fff'][i % 3], 3)).join(''); }
function rueMatin(t) { let s = SKY(t, '#ffd6a8', '#fff3e0'); for (let i = -2; i < 6; i++) s += building(-200 + i * 300, 1250, 260, 520 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4]); s += rect(-M, 1250, W + 2 * M, 1400, '#b9bec6', 0, 0) + line(-M, 1250, W + M, 1250, 8, '#7d848c'); return s + kidsBg(t, 1290, 3, .5); }
function bedroomDay(t, sky = ['#bfe0ff', '#e3f2ff']) { return grad('#ffe6c8', '#ffd9b0', -M, -M, W + 2 * M, H + 2 * M) + windowFrame(640, 280, 320, 380, sky[0], sky[1]) + rect(110, 320, 260, 340, '#9b5cff', 12) + ftext(240, 520, 'ZZZ', { size: 60, fill: '#fff' }) + rect(-M, 1250, W + 2 * M, 1400, '#c49a6c', 0, 0); }
function bathroom2(t) { return bathroomWall(t) + mirror(190, 300, 700, 820) + sink(CX, 1300); }
function bureauRH(t) { return grad('#e9eef5', '#d3dce8', -M, -M, W + 2 * M, H + 2 * M) + windowFrame(640, 300, 340, 400) + cloud(640 + ((t * 40) % 340), 420, .5, '#fff') + Array.from({ length: 7 }, (_, i) => line(640, 330 + i * 52, 980, 330 + i * 52, 6, 'rgba(120,130,150,.35)')).join('') + wallClock(240, 360, 70, t) + frame(150, 520, 200, 150, '#ffe6a0') + plant(100, 1250, 1) + rect(-M, 1250, W + 2 * M, 1400, '#b8a48c', 0, 0); }
function bureauDesk(y = 1240) { return rect(40, y - 40, 1000, 60, '#d9a066', 14) + rect(70, y + 20, 940, 400, '#b9824e', 6); }
function cuisine(t) { let s = grad('#fff3c4', '#ffe7a0', -M, -M, W + 2 * M, H + 2 * M); for (let i = -6; i < 16; i++) s += rect(i * 110, -M, 40, H + 2 * M, 'rgba(255,170,90,.18)', 0, 0);
  return s + windowFrame(380, 260, 320, 330, '#bfe8ff', '#e8f7ff') + path('M370 250Q460 330 380 420L380 250Z', '#ff8fb1', 5) + path('M710 250Q620 330 700 420L700 250Z', '#ff8fb1', 5) + wallClock(880, 360, 60, t) + frame(80, 380, 170, 210, '#cfe9c0') + rect(-M, 1250, W + 2 * M, 1400, '#a5d6a7', 0, 0); }
function nappe(y = 1230) { return rect(20, y - 30, 1040, 50, '#ffffff', 16) + Array.from({ length: 13 }, (_, i) => rect(20 + i * 80, y - 30, 40, 50, 'rgba(226,70,58,.55)', 0, 0)).join('') + rect(20, y - 30, 1040, 50, 'none', 16) + rect(60, y + 20, 960, 400, '#c58e55', 6); }
function plateC(x, y, s, food = 0, t = 0) { const f = [['#ffe08a', '#f2b33d'], ['#ff8a5c', '#d9532b'], ['#8fd16a', '#5a9e3c']][food % 3];
  return G(tr(x, y, s), ell(0, 0, 150, 40, '#fff') + ell(0, -6, 100, 24, 'none', 5, 'rgba(0,0,0,.15)') + path(`M-90 -10Q-80 -110 0 -120Q80 -110 90 -10Z`, f[0], 6) + circ(-30, -70, 14, f[1], 0) + circ(30, -50, 12, f[1], 0) + circ(5, -95, 10, f[1], 0) + steam(-20, -150, t, .6)); }
function mamieHouse(t) { return SKY(t) + rect(-M, 1150, W + 2 * M, 1000, '#8fd16a', 0, 0) + path('M180 620L540 320L900 620Z', '#e2463a') + rect(220, 620, 640, 600, '#fff1d6') + windowFrame(280, 700, 180, 180) + windowFrame(640, 700, 180, 180) + rect(470, 860, 140, 360, '#8a5a3a', 10) + circ(585, 1050, 10, '#ffd23f', 4) + treeC(1000, 1180, .9, t) + Array.from({ length: 8 }, (_, i) => G(tr(80 + i * 135, 1210 + (i % 2) * 30, 1, wave(t, .7, 6, i)), line(0, 0, 0, -50, 5, '#4fa64f') + circ(0, -60, 18, ['#ff8fb1', '#ffd23f', '#fff', '#b56cff'][i % 4], 4))).join(''); }
function studioPhoto(t) { return grad('#c9ced8', '#8f97a6', -M, -M, W + 2 * M, H + 2 * M) + glow(CX, 800, 520, '#ffffff', .45) + G(tr(110, 520, 1, -12), rect(-90, -130, 180, 260, '#fff', 20) + line(0, 130, 0, 760, 10)) + G(tr(970, 520, 1, 12), rect(-90, -130, 180, 260, '#fff', 20) + line(0, 130, 0, 760, 10)) + rect(-M, 1300, W + 2 * M, 1400, '#6c7380', 0, 0); }
function openSpace(t) { let s = grad('#f2f6fb', '#dfe7f1', -M, -M, W + 2 * M, H + 2 * M);
  for (let i = 0; i < 3; i++) s += windowFrame(60 + i * 340, 250, 280, 380) + cloud(60 + i * 340 + ((t * 35 + i * 90) % 280), 380, .45, '#fff');
  s += rect(-M, 1250, W + 2 * M, 1400, '#9aa7b8', 0, 0) + rect(-M, 980, W + 2 * M, 30, '#7d8a9c', 0, 0);
  for (let i = 0; i < 3; i++) s += person({ age: 'adult', x: 150 + i * 390, y: 1180, s: .55, hair: ['bun', 'short', 'curly'][i], hairColor: ['#8a5a3a', '#2b2420', '#e0a040'][i], shirt: ['#7aa6d8', '#ffd23f', '#7be07b'][i], expr: 'talk', seed: 60 + i }, t) + rect(60 + i * 390, 1020, 180, 120, '#2b2b33', 10) + rect(72 + i * 390, 1030, 156, 96, '#bfe0ff', 6, 0);
  return s; }
function darkRoom(t, k = 1) { let s = grad(lerpColor('#1d2350', '#06081a', k), lerpColor('#2e3570', '#0b0e24', k), -M, -M, W + 2 * M, H + 2 * M) + rect(620, 260, 360, 420, '#0f163a', 12) + circ(820, 400, 60, '#fff6d6', 0);
  for (let i = 0; i < 12; i++) s += sparkle(650 + (i * 83) % 300, 290 + (i * 131) % 360, .25 + .15 * Math.sin(t * 4 + i), '#fff6c8');
  return s + rect(620, 260, 360, 420, 'none', 12) + line(800, 260, 800, 680, 8) + rect(-M, 1250, W + 2 * M, 1400, lerpColor('#5a4a3a', '#1a1510', k), 0, 0); }

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
  draw: (t, d, T) => { let s = grad('#ffe0e8', '#ffd0dc', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 1250, W + 2 * M, 1400, '#c49a6c', 0, 0);
    const fam = [['short', '#3a2a22', 'adult'], ['long', '#5a3a26', 'adult'], ['bald', '#9a9a9a', 'old'], ['tuft', '#3a2a22', 'baby']];
    fam.forEach((f, i) => { const x = 250 + (i % 2) * 580, y = 560 + Math.floor(i / 2) * 400, k = pop(t, .05 + i * .12, .35);
      if (k > 0) s += G(tr(x, y, k, (i % 2 ? 5 : -5)), rect(-170, -170, 340, 340, '#f6c86b', 20) + rect(-140, -140, 280, 280, '#cfe9ff', 10, 4) + G(tr(0, 20), head({ hr: 95, hairFn: hfC(1.4, f[0], f[1]), wrinkles: f[2] === 'old', expr: 'deadpan', seed: 30 + i }, t))); });
    return s + G(tr(CX, 760), dna(0, 0, .8, t, 8)) + funTag(CX, 380, 'GÉNÉTIQUE', t, at(14, 'genetique') - .1, { size: 64, bg: SX.acc }) + markerText('(toute la famille)', CX, 1180, t, .5, { size: 42, col: SX.acc2 }); },
  sfx: [[.05, 'pop', .5], [.17, 'pop', .5], [.29, 'pop', .5], [.41, 'pop', .5], [at(14, 'genetique') - .1, 'magic', .5]] });
// B015 — « la pigmentation » : nuancier de peinture « violet cerne »
B(15, { enter: 'none', trans: 'up', transD: .2, cam: () => ({ z: 1.04 }),
  draw: (t, d, T) => { const cols = ['#d9c2f5', '#b994ec', '#9466d8', '#6e3fb8'], names = ['lilas', 'mauve', 'aubergine', 'nuit blanche']; let s = paper('#fbf2ff') + gobo(T, .08);
    cols.forEach((c, i) => s += card(200 + i * 227, 1010, 190, 260, rect(-80, -110, 160, 150, c, 10, 4) + ftext(0, 85, names[i], { size: i === 3 ? 22 : 28, fill: SX.ink, stroke: 'none' }), t, .1 + i * .1, { ry: 0, r: (i - 1.5) * 5, thick: 8 }));
    return s + heroHead(CX, 680, 150, { expr: 'worried', ck: 1.3 }, t) + markerArrow(760, 620, 880, 860, t, .55, { bend: -40, col: SX.acc }) + funTag(CX, 400, 'PIGMENTATION', t, at(15, 'pigmentation') - .1, { size: 58, bg: SX.acc }); },
  sfx: [[.1, 'pop_hi', .4], [.2, 'pop_hi', .4], [.3, 'pop_hi', .4], [.4, 'pop_hi', .4], [at(15, 'pigmentation') - .1, 'pop', .6], [.55, 'scratch', .4]] });
// B016 — « l'anatomie du visage » : salle de classe, schéma à la craie du visage avec cotes
B(16, { enter: 'none', trans: 'wipe', transD: .25, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const k = seg(t, .1, .8); return grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + blackboard(80, 300, 920, 760) + wallClock(960, 230, 60, t) + rect(-M, 1250, W + 2 * M, 900, '#c49a6c', 0, 0) +
    op(.9, G(tr(CX, 700), circ(0, 0, 230 * k, 'none', 8, '#fff') + circ(-80, 0, 30 * k, 'none', 6, '#fff') + circ(80, 0, 30 * k, 'none', 6, '#fff') + path('M-130 60Q-80 110 -30 60M30 60Q80 110 130 60', 'none', 7 * k, '#d9c2f5'))) +
    markerArrow(780, 920, 640, 780, t, at(16, 'visage') - .2, { col: '#fff', bend: 40 }) + markerText('creux !', 820, 960, t, at(16, 'visage'), { size: 52, col: SX.acc2 }) +
    G(tr(CX + 300, 1000), cutout(heroHead(0, 0, 110, { expr: 'shock' }, t), 8)) + funTag(CX, 380, 'ANATOMIE', t, at(16, 'anatomie') - .1, { size: 60, bg: SX.cool }); },
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
  draw: (t, d, T) => { const up = eOutBack(seg(t, .05, .45)); return rays(t, CX, 950, '#ffe9a6', '#ffd76b', 22) + ado({ x: CX, y: 1500, s: 1.45, expr: 'ecstatic', armR: [-20, -20 - 70 * up], holdR: dumbbellC(0), armL: [160, 200] }, t) +
    bar(CX, 470, 600, seg(t, .1, .6), { label: 'énergie', col: '#36a85a', fg: SX.ink, bg: 'rgba(0,0,0,.15)' }) + funTag(CX + 220, 600, '100 %', t, .5, { size: 60, bg: '#36a85a' }) + popStars(CX + 150, 800, t, .4); },
  sfx: [[.05, 'whoosh_up', .6], [.45, 'thud', .6], [.5, 'ding', .6], [at(19, 'pas'), 'tada', .4]] });
// B020 — « personne ne te croit » : foule de têtes sceptiques
B(20, { enter: 'drop', cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => { let s = rueMatin(t); const sk = ['#f2c9a0', '#c98a5e', '#8a5a3a', '#f6d7b8', '#e0b088', '#f2c9a0'], hc = ['#2b2420', '#c4521b', '#1f1a18', '#e0a040', '#5a3a26', '#8a5a3a'], hs = ['curly', 'bun', 'short', 'ponytail', 'side', 'bald'];
    for (let i = 0; i < 6; i++) { const x = 140 + (i % 3) * 400 + (i > 2 ? 200 : 0), y = i > 2 ? 1050 : 700, k = pop(t, .05 + i * .07, .3); if (x > 1000) continue; if (k > 0) s += G(tr(x, y + Math.sin(t * 3 + i) * 6, k, Math.sin(t * 8 + i) * 8), head({ hr: 90, skin: sk[i], hair: hs[i], hairColor: hc[i], expr: i % 2 ? 'suspicious' : 'smug', seed: 40 + i }, t)); }
    return s + heroHead(CX, 900, 150, { expr: 'sob' }, t) + kword('PERSONNE', CX, 420, t, at(20, 'personne') - .05, { size: 96, fill: SX.acc2 }) + funTag(CX, 1150, 'ne te croit', t, at(20, 'croit') - .1, { size: 44, bg: SX.acc }); },
  sfx: [[at(20, 'personne') - .05, 'boom', .5], [.3, 'hmm', .5], [at(20, 'croit') - .1, 'pop', .5], [at(20, 'croit') + .1, 'gasp', .3]] });
// B021 — l'entretien : bureau RH, tu es sûr de toi
B(21, { enter: 'none', trans: 'wipe', transD: .25, cam: zin(1.02, 1.06),
  draw: (t, d, T) => bureauRH(t) + ado({ x: 300, y: 1450, s: 1.3, expr: 'proud', collar: '#fff' }, t) + sparkle(380, 980, .5 + .3 * Math.sin(t * 9), '#fff') + recruteur({ x: 790, y: 1520, s: 1.15, expr: 'neutral', flip: 1 }, t) + bureauDesk(1250) + funTag(CX, 440, 'ENTRETIEN', t, at(21, 'entretien') - .1, { size: 62, bg: SX.cool }),
  sfx: [[0, 'whoosh', .4], [.1, 'steps', .4], [at(21, 'entretien') - .1, 'pop', .6], [.5, 'glint', .5]] });
// B022a — le recruteur scrute ton CV (photo aux cernes encerclée)
const o22 = at(22, 'assez') - .15;
B(22, { enter: 'punch', cam: camHand(1.05, .4),
  draw: (t, d, T) => bureauRH(t) + recruteurHead(330, 860, 220, { expr: 'suspicious', look: [1, .3] }, t) + G(tr(770, 900, 1, 6), rect(-200, -270, 400, 540, '#fff', 14) + rect(-170, -240, 150, 180, '#cfe9ff', 8, 4) + G(tr(-95, -150), head({ hr: 55, hairFn: hfC(1.6), expr: 'happy', seed: 2 }, t)) + Array.from({ length: 6 }, (_, i) => line(-170, -20 + i * 44, 170 - (i % 2) * 70, -20 + i * 44, 8, '#c9d2dc')).join('') + ftext(70, -170, 'CV', { size: 60, fill: SX.ink, stroke: 'none' })) +
    markerCircle(675, 760, 100, 60, t, at(22, 'demande') - .1, { col: SX.acc, w: 10 }) + markerText('?!', 860, 640, t, at(22, 'demande') + .2, { size: 70, col: SX.acc }) + funTag(CX, 420, 'RECRUTEUR', t, .05, { size: 50, bg: '#5b6b8a' }),
  sfx: [[0, 'printer', .3], [.3, 'hmm', .6], [at(22, 'demande') - .1, 'scratch', .5], [at(22, 'demande') + .2, 'pop', .5]] });
// B022b — « assez en forme pour le poste ? » : il te glisse un café XXL
B(22, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.03, 1.1, t / d) }),
  draw: (t, d, T) => { const P = at(22, 'poste') - o22, k = eOutBack(seg(t, P - .3, P + .1)); return bureauRH(t) + heroHead(330, 900, 200, { expr: t > P ? 'jawdrop' : 'ecstatic' }, t) + recruteurHead(820, 760, 150, { expr: 'worried', look: [-1, 0] }, t) + bureauDesk(1250) +
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
