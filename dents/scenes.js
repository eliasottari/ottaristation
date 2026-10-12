// ============================================================
//  « Pourquoi c'est horrible d'avoir un appareil dentaire ? » — 9:16, 33 blocs, calé mot à mot (words.js)
//  Style V2 : fausse 3D (depth/flou), caméra épaule, crash zooms, expressions extrêmes. SFX synthétisés uniquement.
// ============================================================
const TOTAL = 53.5;
const BT = [0, 2.16, 3.1, 3.58, 5.0, 5.96, 7.78, 8.24, 9.86, 11.06, 11.54, 13.62, 17.16, 18.8, 21.7, 22.16, 23.42, 27.12, 29.34, 31.6, 33.8, 36.26, 37.84, 38.92, 40.28, 41.2, 42.38, 44.54, 45.92, 47.26, 48.6, 49.02, 50.28, 53.5];
const SCENES = [];
function B(n, o, off = 0) { o.s = +(BT[n - 1] + off).toFixed(3); o.n = n; SCENES.push(o); return o; }
const _norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
function at(n, word, k = 1) {
  const a = BT[n - 1] - .3, b = BT[n] + .3, q = _norm(word);
  for (const [s, e, w] of WORDS) if (s >= a && s <= b && _norm(w).startsWith(q) && --k === 0) return +(s - BT[n - 1]).toFixed(2);
  console.error('at(): mot introuvable', n, word); return 0;
}
const CX = W / 2;

// ---------- personnages ----------
const TEAL = '#2fa3a0';
// le héros : ado à bagues (bouche « metal* »)
const ado = (o, t) => person(Object.assign({ age: 'kid', hair: 'short', hairColor: '#5a3a26', shirt: TEAL, pants: '#3b3f4a', seed: 2, expr: 'metal' }, o), t);
const adoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'short', hairColor: '#5a3a26', seed: 2, expr: 'metal' }, o), t));
const crush = (o, t) => person(Object.assign({ age: 'kid', hair: 'ponytail', hairColor: '#e0a040', shirt: '#ff8fb1', pants: '#5b4b6e', seed: 6 }, o), t);
const crushHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'ponytail', hairColor: '#e0a040', seed: 6 }, o), t));
const ortho = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#7a7a80', glasses: true, shirt: '#f4f7fa', coat: 1, pants: '#5b7bd6', seed: 7 }, o), t);
const orthoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'side', hairColor: '#7a7a80', glasses: true, seed: 7 }, o), t));
function bigText(lines, t, t0, x, y, col = '#fff', size = 110, gap = 1.08) { return lines.map((l, i) => { const k = pop(t, t0 + i * .15, .35); return k <= 0 ? '' : G(tr(x, y + i * size * gap, k), text(0, size * .35, OL, l, col, size)); }).join(''); }
function tag(x, y, str, t, t0, bg = '#ffd23f', fg = OL, size = 60, r = 0) { const k = pop(t, t0, .35); if (k <= 0) return ''; const w = str.length * size * .58 + size; return G(tr(x, y, k, r), rect(-w / 2, -size * .8, w, size * 1.6, bg, size * .5) + text(0, size * .36, 'none', str, fg, size)); }
// titre d'accroche : plus petit et loin des bords (YouTube Shorts recadre) — largeur max ≈ 760 px (x 160→920)
function title(t) {
  const k1 = pop(t, .05, .45), k2 = pop(t, .25, .45), k3 = pop(t, .45, .5);
  return G(tr(CX, 330, k1), text(0, 26, OL, "POURQUOI C'EST", '#fff', 74)) + G(tr(CX, 420, k2), text(0, 26, OL, "HORRIBLE D'AVOIR", '#fff', 70)) +
    G(tr(CX, 525, k3, wave(t * 4, .6, 3)), text(0, 30, OL, '<tspan fill="#7fd3f7">UN APPAREIL ?</tspan>', '#fff', 88));
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

// ---------- décors de l'épisode ----------
function bigClock(x, y, str, col, s = 1) { return G(tr(x, y, s), rect(-210, -90, 420, 180, '#2b2b33', 30) + text(0, 35, 'none', str, col, 100)); }
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
//  PLANS
// ============================================================
// B001 — accroche : sourire métal géant qui brille (la lumière se reflète dans les bagues), titre en haut
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .4 }),
  draw: t => rays(t, CX, 950, '#2f8fa0', '#3aa6b6', 22) + glow(CX, 950, 500, '#bff6ff', .3) + adoHead(CX, 950, 240, { expr: 'metal' }, t) + sparkle(CX - 60, 1020, .5 + .3 * Math.sin(t * 10), '#fff') + sparkle(CX + 70, 1030, .35 + .3 * Math.cos(t * 9), '#fff') + glow(CX, 1030, 160, '#fff', .35 + .2 * Math.sin(t * 8)) + title(t),
  sfx: [[0, 'whoosh', .7], [.3, 'glint', .9], [.9, 'sparkle', .6], [1.5, 'glint', .6]] });
// B002 — profil : tu souris à ton crush (cœurs, petit nuage)
B(2, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: t => schoolyard(t) + depth({ zoom: 1 }, [{ z: 1, svg: ado({ x: 300, y: 1500, s: 1.4, expr: 'metal', look: [1, 0], armR: [-20, 30] }, t) + crush({ x: 800, y: 1500, s: 1.35, expr: 'neutral', look: [-1, 0], flip: 1 }, t) }]) + heartsUp(t, 330, 900, 5) + blur(10, G(tr(CX, 1800), rect(-700, -120, 1400, 240, '#7bbf5a', 60))),
  sfx: [[0, 'whoosh', .5], [at(2, 'souris') , 'glint', .8], [at(2, 'crush'), 'kiss', .5]] });
// B003 — contrechamp gros plan : elle te sourit (« hiii »)
B(3, { enter: 'none', cam: zin(1.04, 1.1),
  draw: t => rays(t, CX, 900, '#ffd0e0', '#ffc0d6', 18) + crushHead(CX, 900, 240, { expr: 'joy', look: [-.5, 0] }, t) + sparkle(CX + 260, 650, .6, '#fff'),
  sfx: [[0, 'sparkle', .7], [.1, 'pop_hi', .5]] });
// B004 — elle pointe tes dents : « T'as un truc entre les dents. » — ton sourire se fige
B(4, { cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .3 }),
  draw: t => { const T_ = at(4, 'truc'); return schoolyard(t) + crush({ x: 780, y: 1500, s: 1.35, expr: t > T_ ? 'embarrassed' : 'talk', look: [-1, 0], armL: [190, 190] }, t) + ado({ x: 300, y: 1500, s: 1.4, expr: t > T_ + .2 ? 'metal' : 'metal', face: t > T_ + .2 ? { eyes: 'huge', brows: 'sad' } : {}, tremble: t > T_ + .2 ? 1 : 0 }, t) +
    G(tr(700, 560, pop(t, .05)), rect(-300, -100, 600, 200, '#fff', 40) + text(0, -12, 'none', "T'as un truc", OL, 50) + text(0, 50, 'none', 'entre les dents…', OL, 46)) + (t > T_ + .2 ? sweatSpray(300, 1000, t, 4) : ''); },
  sfx: [[0, 'pop', .6], [at(4, 'truc'), 'sting', .7], [at(4, 'dents'), 'scratch', .6]] });
// B005 — CRASH ZOOM dans la bouche : une feuille de salade
B(5, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.15, 1.05, eOutCubic(clamp(t / .4))), shake: t < .4 ? 8 : 1 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#ffd6c8', 0, 0) + bigMouth(CX, 860, 1.25, t, { braces: 1, salad: 1, open: .35 }) + tag(CX, 400, 'SALADE', t, at(5, 'salade') - .1, '#6fcf4f', '#fff', 64) + speedLines(t, CX, 860, 24, 'rgba(255,255,255,.6)'),
  sfx: [[0, 'flash_hit', .8], [.05, 'zap', .5], [at(5, 'salade') - .1, 'boing', .7]] });
// B006 — « coincée depuis midi » : l'horloge défile de 12 h à 16 h, la salade se fait des amis
B(6, { cam: zin(1.02, 1.08, .5),
  draw: t => { const k = seg(t, at(6, 'midi') - .4, 1.8); const hh = 12 + Math.floor(k * 4.8), mm = Math.floor((k * 288) % 60); return rect(-200, -200, W + 400, H + 400, '#ffd6c8', 0, 0) + bigMouth(CX, 1000, 1.05, t, { braces: 1, salad: 1, open: .3 }) + G(tr(CX - 70 * 1.05, 980, 1.05), G(tr(-60, -20), head({ hr: 26, hair: 'none', skin: 'none', cheeks: false, expr: 'smug' }, t).replace(/<circle cx="0" cy="0" r="26"[^>]*\/>/, ''))) +
    bigClock(CX, 470, `${hh}:${String(mm).padStart(2, '0')}`, '#ff4d4d', .9) + tag(CX, 640, 'DEPUIS MIDI', t, at(6, 'midi') - .1, '#fff', OL, 50); },
  sfx: [[at(6, 'coincee'), 'squeak', .6], [at(6, 'midi') - .4, 'clock_fast', .7], [at(6, 'midi') - .1, 'pop', .7]] });
// B007 — « Magnifique. » : il reste figé, elle s'en va (traînée de poussière)
B(7, { enter: 'none', cam: () => ({ z: 1.06 }),
  draw: t => schoolyard(t) + ado({ x: 360, y: 1500, s: 1.4, expr: 'deadpan', face: { mouth: 'metalSalad' } }, t) + G(tr(lerp(800, 1300, seg(t, 0, .5)), 0), crush({ x: 0, y: 1500, s: 1.3, expr: 'embarrassed', walk: 4, flip: 1 }, t)) + cloud(820, 1450, .8, '#e8e0d0') + tumbleweed(lerp(-100, 400, t / .5), 1420, .5, t * 300),
  sfx: [[0, 'whistle', .6], [.1, 'whoosh', .5]] });
// B008 — plan large, débullé : le cabinet de l'orthodontiste (lampe, ombre inquiétante, outils qui brillent)
B(8, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), r: -6, hand: .4 }),
  draw: t => { const k = seg(t, .4, 1.0); return depth({ zoom: 1 + .03 * t, x: t * 10 }, [
    { z: 1.6, svg: office(t), haze: .1 },
    { z: 1, svg: dentalChair(560, 1150, 1.15, 1, t) + ado({ x: 520, y: 1160, s: 1.1, rot: -72, expr: 'scared' }, t) + ortho({ x: lerp(1150, 860, k), y: 1500, s: 1.25, expr: 'smugger', armR: [-60, -80], holdR: pliers(0, -40, .6, 0, .3 + .2 * Math.sin(t * 8)), flip: 1 }, t) },
    { z: .6, svg: blur(12, G(tr(120, 1700), orthoKey(0, 0, 2.2, 40))) }]) + sparkle(820, 760, .5 + .3 * Math.sin(t * 9), '#fff') + tag(CX, 400, "L'ORTHODONTISTE", t, at(8, 'ortho') - .1, '#5ec4c4', '#fff', 50); },
  sfx: [[0, 'thud', .6], [.3, 'glint', .7], [at(8, 'ortho') - .1, 'sting', .7], [1.0, 'snip', .5]] });
// B009 — gros plan : « Ça va juste serrer un peu » — il tourne la clé, sourire sadique
B(9, { cam: zin(1.02, 1.1, .4),
  draw: t => grad('#e6f4f2', '#cfe6e2', -200, -200, W + 400, H + 400) + `<path d="M${CX - 100} -50L${CX + 100} -50L${CX + 500} 1400L${CX - 500} 1400Z" fill="rgba(255,250,200,.25)"/>` + orthoHead(CX, 780, 230, { expr: 'smugger', look: [0, 1] }, t) + G(tr(CX + 260, 1150, 1, t * 400), orthoKey(0, 0, 1.0, 0)) + tag(CX, 400, 'UN PEU…', t, at(9, 'peu') - .1, '#fff', OL, 56),
  sfx: [[0, 'hmm', .5], [at(9, 'serrer'), 'squeak', .8], [at(9, 'serrer') + .3, 'squeak', .7], [at(9, 'peu'), 'tick', .6]] });
// B010 — « Un peu ?! » : la bouche se resserre comme un étau, yeux exorbités
B(10, { enter: 'crash', flash: 1, cam: () => ({ z: 1.08, shake: 12 }),
  draw: t => rays(t, CX, 900, '#ff7a5a', '#ff4d3d', 24) + adoHead(CX, 900, 250, { expr: 'metalPain', face: { eyes: 'pop' } }, t) + G(tr(CX - 300, 900), path('M0 -80L60 0L0 80', 'none', 14)) + G(tr(CX + 300, 900), path('M0 -80L-60 0L0 80', 'none', 14)) + text(CX, 470, OL, 'UN PEU ?!', '#fff', 100),
  sfx: [[0, 'crack', .9], [.05, 'flash_hit', .7], [.2, 'squeak', .7]] });
// B011 — le lendemain : il croque une baguette… CRAC (les dents vibrent)
B(11, { enter: 'whip', cam: (t, d) => ({ z: 1.05, hand: .5, shake: t > at(11, 'baguette') + .3 ? 6 : 0 }),
  draw: t => { const C_ = at(11, 'baguette') + .3; return kitchen(t) + tag(CX, 400, 'LE LENDEMAIN', t, .05, '#ffd23f', OL, 50) + ado({ x: 450, y: 1500, s: 1.5, expr: t > C_ ? 'metalPain' : 'happy', armR: [-10, -30], holdR: baguette(130, 0, .5, -10, t > C_ ? 1 : 0) }, t) +
    (t > C_ ? impactStar(620, 990, .7) + text(780, 820, OL, 'CRAC', '#ffd23f', 100) + lightning(820, 900, .3, .8) : ''); },
  sfx: [[0, 'whoosh', .6], [at(11, 'manger'), 'chomp', .6], [at(11, 'baguette') + .3, 'crack', 1], [at(11, 'baguette') + .4, 'boing', .5]] });
// B012a — la douleur : il pleure devant une purée
B(12, { cam: zin(1.02, 1.08, .5),
  draw: t => kitchen(t) + adoHead(CX, 880, 230, { expr: 'sob', face: { mouth: 'metalGrit' } }, t) + pureeBowl(CX, 1230, 1.2, t),
  sfx: [[0, 'hmm', .4], [.4, 'sizzle', .3], [1, 'gasp', .5]] });
// B012b — … la purée devient un boxeur : sport de combat
B(12, { enter: 'whip', cam: (t, d) => ({ z: 1.05, hand: .8, shake: Math.sin(t * 12) > .7 ? 6 : 0 }),
  draw: t => { const p = 80 * Math.max(0, Math.sin(t * 12)); return rect(-200, -200, W + 400, H + 400, '#1f1a2e', 0, 0) + glow(CX, 600, 700, '#ffe9a0', .3) + rect(-100, 1180, 1280, 120, '#3b6fd8', 0, 0) + [980, 1060, 1140].map(y => line(-100, y, 1180, y, 8, '#e2463a')).join('') +
    ado({ x: 280, y: 1450, s: 1.2, expr: 'metalPain', rot: -p * .1 }, t) + G(tr(690, 900, 1.15), pureeBowl(0, 0, 1, t) + G(tr(0, -40), head({ hr: 60, hair: 'none', skin: 'none', cheeks: true, expr: 'rage', seed: 9 }, t).replace(/<circle cx="0" cy="0" r="60"[^>]*\/>/, '')) + line(-160, 0, -230 - p, -40, 12) + circ(-250 - p, -45, 46, '#e2463a') + line(160, 0, 220, -40, 12) + circ(240, -45, 46, '#e2463a')) +
    tag(CX, 400, 'SPORT DE COMBAT', t, at(12, 'sport') - at(12, 'puree') + .05, '#ffd23f', OL, 52) + (Math.sin(t * 12) > .7 ? impactStar(400, 900, .5) : ''); },
  sfx: [[0, 'school_bell', .8], [.25, 'thud', .9], [.77, 'thud', .9], [1.3, 'thud', .8], [1.6, 'boing', .5]] }, at(12, 'puree') - .15);
// B013 — à l'école, on t'appelle « GRILLAGE » (les autres se moquent, doigts pointés)
B(13, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 900 }),
  draw: t => { let s = schoolyard(t); for (let i = 0; i < 3; i++) s += person({ age: 'kid', x: 160 + i * 380 + (i === 1 ? 2000 : 0), y: 1500, s: 1.1, hair: ['curly', 'spiky', 'bun'][i], hairColor: ['#2b2420', '#c4521b', '#4a3428'][i], shirt: ['#7be07b', '#b56cff', '#ffb340'][i], expr: 'mock', armR: [-20, -10], seed: i + 3 }, t);
    return s + ado({ x: CX, y: 1520, s: 1.3, expr: 'embarrassed', face: { mouth: 'metalGrit' } }, t) + person({ age: 'kid', x: 920, y: 1500, s: 1.1, hair: 'spiky', hairColor: '#c4521b', shirt: '#b56cff', expr: 'mock', armL: [200, 190], seed: 4, flip: 1 }, t) + stamp(CX, 450, 'GRILLAGE', t, at(13, 'grillage') - .05, '#59616c', -6) + G(tr(CX, 1040), rect(-90, -40, 180, 80, 'none', 0, 6, '#59616c')); },
  sfx: [[0, 'school_bell', .5], [.3, 'hmm', .5], [at(13, 'grillage') - .05, 'thud', .9], [at(13, 'grillage') + .2, 'rimshot', .5]] });
// B014 — opération de déminage : casque, fils rouge/bleu, sueur (sur un sandwich-bombe)
B(14, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.12, t / d), hand: .6 }),
  draw: t => { const D_ = at(14, 'deminage'); return rect(-200, -200, W + 400, H + 400, '#2b2238', 0, 0) + `<path d="M${CX - 80} -50L${CX + 80} -50L${CX + 520} 1500L${CX - 520} 1500Z" fill="rgba(255,240,180,.22)"/>` +
    G(tr(CX, 900), circ(0, 0, 240, '#fff', SW) + bomb(0, -20, .9, t)) + bigClock(CX + 300, 1120, `00:0${Math.max(0, 9 - Math.floor(t * 2))}`, '#ff4d4d', .5) +
    adoHead(CX, 470, 150, { expr: 'effort', face: { mouth: 'metalGrit' } }, t) + path(`M${CX - 170} 470Q${CX - 170} 280 ${CX} 280Q${CX + 170} 280 ${CX + 170} 470`, 'rgba(120,140,90,.9)') + rect(CX - 130, 420, 260, 80, 'rgba(160,220,255,.4)', 20, 5) + sweatSpray(CX, 470, t, 4) +
    G(tr(CX + 220, 760, 1, 30), wireCutter(0, 0, .8)) + path(`M${CX - 60} 780Q${CX - 160} 680 ${CX - 260} 760`, 'none', 10, '#e2463a') + path(`M${CX + 40} 780Q${CX + 160} 690 ${CX + 260} 740`, 'none', 10, '#4d7cf0') + (t > D_ ? tag(CX - 270, 1120, 'DÉMINAGE', t, D_, '#e2463a', '#fff', 46) : ''); },
  sfx: [[0, 'heartbeat', .6], [.5, 'tick', .6], [1.0, 'tick', .6], [at(14, 'deminage'), 'sting', .7], [2.2, 'snip', .9]] });
// B015 — « Caramel : risqué » (panneau ⚠)
B(15, { enter: 'punch', cam: () => ({ z: 1.06, shake: 3 }),
  draw: t => rays(t, CX, 850, '#ffe0a0', '#ffd27a', 18) + caramel(CX, 850, 1.6, wave(t, 2, 6)) + tag(CX, 470, 'RISQUÉ ⚠', t, .05, '#ffb340', OL, 64),
  sfx: [[0, 'pop', .8], [.1, 'error_beep', .6]] });
// B016 — « Popcorn : mauvaise idée » (un grain coincé, croix rouge)
B(16, { enter: 'whip', cam: () => ({ z: 1.06 }),
  draw: t => rays(t, CX, 850, '#ffd0d0', '#ffb8b8', 18) + G(tr(0, Math.abs(Math.sin(t * 10)) * -20), popcorn(CX, 950, 1.5, t)) + cross(CX + 230, 700, .7, t, at(16, 'mauvaise')) + tag(CX, 430, 'MAUVAISE IDÉE', t, at(16, 'mauvaise') - .05, '#e2463a', '#fff', 56),
  sfx: [[0, 'pop', .6], [.15, 'pop_hi', .6], [.3, 'pop', .5], [at(16, 'mauvaise'), 'error_beep', .8]] });
// B017a — croquer dans une pomme… PING : une bague s'envole
B(17, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), hand: .4, shake: t > at(17, 'pomme') + .25 ? 5 : 0 }),
  draw: t => { const P = at(17, 'pomme') + .2; const f = seg(t, P, P + .8); return grad('#d9f0d0', '#bfe3b0', -200, -200, W + 400, H + 400) + adoHead(420, 900, 220, { expr: t > P ? 'metalShock' : 'happy', look: [1, 0] }, t) + apple(720, 960, 1.2, 0, t > P ? 1 : 0) +
    (f > 0 ? G(tr(lerp(560, 950, f), 900 - Math.sin(f * 3.1) * 500, 1, f * 900), rect(-26, -22, 52, 44, '#c9d1db', 8, 5, '#59616c')) + motionLines(lerp(560, 950, f) - 60, 900 - Math.sin(f * 3.1) * 500, 3, 50, 200) : '') + (t > P ? text(850, 520, OL, 'PING !', '#fff', 80) : ''); },
  sfx: [[at(17, 'croquer'), 'chomp', .7], [at(17, 'pomme') + .2, 'crack', .9], [at(17, 'pomme') + .25, 'ding', .9], [at(17, 'pomme') + .5, 'whoosh_up', .6]] });
// B017b — … tu finances les vacances de ton orthodontiste (plage, cocktail, pluie de billets)
B(17, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: t => depth({ zoom: 1, x: Math.sin(t) * 20 }, [
    { z: 1.8, svg: grad('#7fd3f7', '#e8f8ff', -M, -M, W + 2 * M, 1900) + circ(820, 360, 80, '#ffe680', 6) + plane(lerp(-300, 1300, (t * .35) % 1), 260, .5) + rect(-M, 1100, W + 2 * M, 200, '#4fb6e0', 0, 0), haze: .05 },
    { z: 1, svg: rect(-M, 1250, W + 2 * M, 900, '#f4dca0', 0, 0) + palm(170, 1300, 1.3, t) + ortho({ x: 640, y: 1500, s: 1.3, expr: 'cool', shirt: '#ff8fb1', coat: 0, armR: [-60, -90], holdR: G(tr(0, -40), path('M-30 -50L30 -50L0 20Z', '#ffb340', 5) + line(0, 20, 0, 70, 6) + circ(18, -60, 12, '#e2463a', 4)) }, t) + coinRain(t, 14) },
    { z: .6, svg: blur(10, G(tr(950, 1750), umbrella(0, 0, 1.6))) }]) + tag(CX, 400, 'MERCI POUR LES VACANCES', t, at(17, 'vacances') - at(17, 'financer') + .1, '#fff', OL, 42),
  sfx: [[0, 'kaching', .9], [.2, 'coins', .7], [.6, 'waves', .5], [1.2, 'jackpot', .5], [1.8, 'coins', .4]] }, at(17, 'financer') - .25);
// B018 — « Et puis, il y a les élastiques » : entrée dramatique, contre-plongée, anneaux roses en orbite
B(18, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), cy: 800 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#2b2238', 0, 0) + glow(CX, 850, 600, '#ff8fb1', .35) + Array.from({ length: 6 }, (_, i) => { const a = t * 1.6 + i * 6.28 / 6; return elasticRing(CX + Math.cos(a) * 330, 800 + Math.sin(a) * 170, 1.2 * pop(t, at(18, 'elastiques') - .15 + i * .05), a * 40, 1 + .2 * Math.sin(t * 6 + i)); }).join('') + adoHead(CX, 1020, 140, { expr: 'terror' }, t) + tag(CX, 420, 'LES ÉLASTIQUES', t, at(18, 'elastiques') - .1, '#ff5d8f', '#fff', 56),
  sfx: [[0, 'thunder', .4], [at(18, 'elastiques') - .15, 'sting', .9], [at(18, 'elastiques'), 'boing', .6]] });
// B019 — salle de bain : doigts dans la bouche pour accrocher… l'élastique part dans le miroir
B(19, { cam: (t, d) => ({ z: 1.05, hand: .6 }),
  draw: t => { const F = seg(t, at(19, 'bouche'), at(19, 'bouche') + .35); return bathroom(t) + G(tr(CX, 0), adoHead(0, 820, 230, { expr: 'effort', face: { mouth: 'metalOpen' } }, t)) + G(tr(CX - 60, 1020, 1, -30), hand(0, 0, .7, 0, TEAL)) + G(tr(CX + 90, 1030, 1, -150), hand(0, 0, .7, 0, TEAL).replace('scale(0.7)', 'scale(0.7 -0.7)')) +
    (F > 0 ? G(tr(lerp(CX + 60, 940, F), lerp(1000, 420, F), 1, F * 720), elasticRing(0, 0, .6)) : '') + (F >= 1 ? impactStar(940, 420, .5) + path('M900 380L980 470M960 370L900 460', 'none', 5, '#fff') : '') + sink(CX, 1300); },
  sfx: [[0, 'squeak', .6], [.6, 'squeak', .5], [at(19, 'bouche'), 'boing', .9], [at(19, 'bouche') + .35, 'glint', .7]] });
// B020 — comme monter un meuble IKEA avec tes molaires (une dent-ouvrier avec clé Allen)
B(20, { enter: 'whip', cam: zin(1.02, 1.1, .6),
  draw: t => rect(-200, -200, W + 400, H + 400, '#ffd6c8', 0, 0) + bigMouth(CX, 1000, 1.0, t, { braces: 1, open: .8, elastics: 1 }) + toothChar(CX - 130, 1020, .45, t, { expr: 'effort', braces: 1 }) + G(tr(CX - 50, 980, 1, Math.sin(t * 10) * 30), allenKey(0, 0, .6)) + G(tr(CX + 140, 1060, .35), flatBox(0, 0, 1, 10)) +
    notice(860, 520, .9, 8, t) + tag(CX - 140, 460, 'MEUBLE EN KIT', t, at(20, 'ikea') - .1, '#4d7cf0', '#ffd23f', 44),
  sfx: [[0, 'whoosh', .5], [at(20, 'ikea') - .1, 'pop', .7], [at(20, 'montais'), 'hammer', .7], [at(20, 'molaires'), 'hammer', .7], [1.8, 'squeak', .5]] });
// B021 — deux ans de souffrance… puis LE GRAND JOUR (calendrier, rayons dorés)
B(21, { cam: zin(1.0, 1.08),
  draw: t => { const J = at(21, 'grand'); return t < J - .15 ? rect(-200, -200, W + 400, H + 400, '#5a6478', 0, 0) + calendar(CX, 800, 1.5, '2', t, .05) + Array.from({ length: 6 }, (_, i) => G(tr(CX + (i - 2.5) * 140 + Math.sin(t * 5 + i) * 30, 1100 + ((t * 300 + i * 80) % 300)), calendarPage(0, 0, .35, i * 20))).join('') + adoHead(CX + 270, 1120, 100, { expr: 'sob', face: { mouth: 'metalGrit' } }, t)
    : rays(t, CX, 850, '#fff1c2', '#ffd76b', 26) + glow(CX, 850, 500, '#fff', .5) + bigText(['LE GRAND', 'JOUR !'], t, J - .1, CX, 520, '#fff', 110) + adoHead(CX, 1050, 150, { expr: 'ecstatic', face: { mouth: 'metal' } }, t); },
  sfx: [[0, 'tick', .5], [.3, 'flutter', .5], [at(21, 'souffrance'), 'hmm', .5], [at(21, 'grand') - .15, 'angel', .8], [at(21, 'arrive'), 'tada', .6]] });
// B022 — on retire enfin tes bagues : la pince arrache, les bagues s'envolent une par une
B(22, { cam: (t, d) => ({ z: 1.06, hand: .4, shake: t > .5 ? 3 : 0 }),
  draw: t => { let s = rect(-200, -200, W + 400, H + 400, '#ffd6c8', 0, 0) + bigMouth(CX, 1000, 1.05, t, { braces: t < .5 ? 1 : 0, open: .4, shine: t > 1.1 }); for (let i = 0; i < 8; i++) { const f = seg(t, .5 + i * .07, 1.2 + i * .07); if (f > 0) s += G(tr(CX + (i - 3.5) * 100 + (i - 3.5) * 200 * f, 990 - Math.sin(f * 3) * 600 + f * 300, 1, f * 720), rect(-26, -22, 52, 44, '#c9d1db', 8, 5, '#59616c')); }
    return s + G(tr(CX + 180, lerp(860, 700, seg(t, .4, .7))), pliers(0, 0, 1.1, 30, .3 + .3 * Math.sin(t * 12))) + tag(CX, 440, 'ENFIN !', t, at(22, 'enfin') - .1, '#5fd068', '#fff', 60); },
  sfx: [[0, 'squeak', .6], [.5, 'ding', .8], [.65, 'ding', .7], [.8, 'ding', .7], [.95, 'ding', .6], [1.1, 'sparkle', .7]] });
// B023 — tu te regardes dans le miroir (yeux fermés… suspense)
B(23, { cam: zin(1.04, 1.12),
  draw: t => bathroom(t) + adoHead(CX, 760, 230, { expr: 'calm', face: { mouth: 'flat' } }, t) + sink(CX, 1300) + glow(CX, 760, 400, '#fff', .2 + .2 * Math.sin(t * 6)),
  sfx: [[0, 'drum', .5], [.4, 'drum', .5], [.8, 'drum', .6]] });
// B024 — DES DENTS PARFAITES : sourire étincelant, chœur d'anges
B(24, { enter: 'crash', flash: 1, cam: zin(1.04, 1.1),
  draw: t => rays(t, CX, 900, '#fff6c8', '#ffe27a', 28) + glow(CX, 900, 600, '#fff', .55) + bigMouth(CX, 950, 1.1, t, { open: .3, shine: 1 }) + stars(CX, 950, t, 7, 420) + bigText(['DENTS', 'PARFAITES'], t, .1, CX, 380, '#fff', 100),
  sfx: [[0, 'angel', .9], [.1, 'glint', .9], [.6, 'sparkle', .7]] });
// B025 — tu souris à tout le monde : les passants sont éblouis (lunettes de soleil)
B(25, { enter: 'whip', cam: camHand(1.05, .6),
  draw: t => { let s = street(t); for (let i = 0; i < 3; i++) s += person({ age: 'adult', x: 680 + i * 170, y: 1500, s: .85, hair: ['bun', 'short', 'bald'][i], hairColor: ['#8a5a3a', '#2b2420', '#888'][i], shirt: ['#e8a0b4', '#7aa6d8', '#c9a06a'][i], expr: 'shock', face: { eyes: 'shades' }, armL: [200, 220], seed: i + 10, flip: 1 }, t);
    return s + glow(330, 1000, 380, '#fff', .45 + .2 * Math.sin(t * 9)) + ado({ x: 330, y: 1500, s: 1.4, expr: 'perfect', armR: [-40, -60], look: [1, 0] }, t) + sparkle(380, 1010, .6, '#fff') + Array.from({ length: 5 }, (_, i) => line(400, 1010, 1000, 700 + i * 120, 8, 'rgba(255,255,220,.45)')).join(''); },
  sfx: [[0, 'whoosh', .6], [.15, 'glint', .9], [.5, 'sparkle', .6], [.8, 'gasp', .5]] });
// B026 — même au contrôleur du bus (il fond de bonheur malgré lui)
B(26, { enter: 'whip', cam: zin(1.02, 1.1, .4),
  draw: t => { const K = at(26, 'controleur'); return busInside(t) + person({ age: 'adult', x: 760, y: 1500, s: 1.25, hair: 'short', hairColor: '#3a2a20', mustache: true, cap: '#2b3e8a', shirt: '#2b3e8a', expr: t > K + .3 ? 'love' : 'annoyed', armR: [-40, -20], holdR: rect(-30, -20, 60, 40, '#ffd23f', 6, 4), flip: 1 }, t) + ado({ x: 300, y: 1500, s: 1.35, expr: 'perfect', look: [1, 0] }, t) + sparkle(350, 1010, .6, '#fff') + (t > K + .3 ? heartsUp(t, 760, 900, 4) : '') + tag(760, 480, 'TICKET ?', t, .05, '#fff', OL, 46); },
  sfx: [[0, 'whoosh', .5], [.2, 'hmm', .5], [at(26, 'controleur'), 'glint', .9], [at(26, 'controleur') + .3, 'kiss', .6]] });
// B027 — l'orthodontiste te tend une petite boîte (contre-plongée menaçante, lumière qui grésille)
B(27, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), cy: 700, r: 4 }),
  draw: t => office(t).replace('#e6f4f2', '#cfd8d6') + rect(-200, -200, W + 400, H + 400, `rgba(20,20,40,${(.25 + .1 * (Math.sin(t * 30) > .8)).toFixed(2)})`, 0, 0) + ortho({ x: CX, y: 1700, s: 1.6, expr: 'smugger', armR: [-30, -70], holdR: retainerBox(0, -40, .5, t, 0) }, t) + tag(CX, 420, 'PETITE BOÎTE', t, at(27, 'boite') - .1, '#fff', OL, 48) + adoHead(170, 1120, 90, { expr: 'perfect' }, t),
  sfx: [[0, 'thud', .5], [.4, 'hmm', .5], [at(27, 'tend'), 'whoosh', .5], [at(27, 'boite'), 'sting', .6]] });
// B028 — « Voici ton appareil de contention » : la boîte s'ouvre comme un trésor… maudit
B(28, { enter: 'crash', cam: zin(1.04, 1.12),
  draw: t => { const O_ = seg(t, .1, .6); return rect(-200, -200, W + 400, H + 400, '#1f1a2e', 0, 0) + glow(CX, 900, 500, '#bfe8ff', .5 * O_) + rays(t, CX, 900, 'rgba(160,220,255,.15)', 'rgba(0,0,0,0)', 18) + retainerBox(CX + 100, 900, 1.6, t, O_) + tag(CX, 440, 'CONTENTION', t, at(28, 'contention') - .1, '#7fd3f7', OL, 56); },
  sfx: [[.1, 'squeak', .6], [.4, 'magic', .7], [at(28, 'contention') - .1, 'ghost', .5]] });
// B029 — « Tu devras le porter selon les conseils » : la liste interminable
B(29, { cam: camHand(1.04, .4),
  draw: t => grad('#e6f4f2', '#cfe6e2', -200, -200, W + 400, H + 400) + orthoHead(330, 800, 200, { expr: 'talk', look: [1, 0] }, t) + G(tr(780, 860 - seg(t, .3, 1.3) * 200, 1, 4), rect(-220, -380, 440, 900, '#fff', 14) + text(0, -300, 'none', 'CONSEILS', '#2f8fa0', 46) + Array.from({ length: 9 }, (_, i) => line(-170, -220 + i * 70, 170 - (i % 3) * 40, -220 + i * 70, 6, '#cfd6dc')).join('')) + retainer(330, 1150, .6, t),
  sfx: [[0, 'scratch', .5], [.5, 'flutter', .5], [at(29, 'conseils'), 'ding', .5]] });
// B030 — « parfois pendant des années » : les années défilent, il vieillit avec sa gouttière
B(30, { cam: zin(1.0, 1.1),
  draw: t => { const k = seg(t, .1, 1.3); const y = 2026 + Math.floor(k * 40); return rect(-200, -200, W + 400, H + 400, '#3a3f55', 0, 0) + bigClock(CX, 440, String(y), '#7fd3f7', 1) + Array.from({ length: 7 }, (_, i) => G(tr(CX + Math.sin(i * 2.1) * 400, ((t * 900 + i * 260) % 1700) - 100, 1, t * 300 + i * 40), calendarPage(0, 0, .45))).join('') +
    G(tr(CX, 1000), head({ hr: 200, hair: k > .5 ? 'bald' : 'short', hairColor: lerpColor('#5a3a26', '#d9d9de', k), wrinkles: k > .4, mustache: k > .7, expr: 'sad', seed: 2 }, t)) + retainer(CX, 1060, .45, t); },
  sfx: [[0, 'rewind', .7], [.3, 'clock_fast', .8], [1.1, 'hmm', .4]] });
// B031 — « Pardon ?! » : mâchoire au sol
B(31, { enter: 'crash', flash: 1, cam: () => ({ z: 1.1, shake: 10 }),
  draw: t => rays(t, CX, 800, '#ff7a5a', '#ff4d3d', 24) + adoHead(CX, 760, 230, { expr: 'jawdrop' }, t) + text(CX, 420, OL, 'PARDON ?!', '#fff', 100),
  sfx: [[0, 'flash_hit', .9], [.05, 'gasp', .8]] });
// B032 — « T'as cru que t'étais sorti de prison ? » : derrière les barreaux, l'orthodontiste en gardien
B(32, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .4 }),
  draw: t => { const k = eOutBack(seg(t, 0, .4)); return prisonYard(t) + stripedShirt(400, 1360, 1.3) + ado({ x: 420, y: 1500, s: 1.4, expr: 'sob', face: { mouth: 'metalGrit' }, shirt: '#f0f0f0' }, t) + stripedShirt(420, 1580 - 64 * 1.4, 1.4) +
    G(tr(0, (1 - k) * -1800), prisonBars(1)) + ortho({ x: 860, y: 1500, s: 1.3, expr: 'mock', cap: '#2b3e8a', shirt: '#2b3e8a', coat: 0, armR: [-60, -60], holdR: G(tr(0, -20), circ(0, 0, 40, 'none', 8, '#ffd23f') + line(30, 30, 70, 70, 10, '#ffd23f')), flip: 1 }, t) + tag(CX, 400, 'PRISON', t, at(32, 'prison') - .1, '#59616c', '#fff', 60); },
  sfx: [[0, 'thud', .9], [.05, 'crack', .5], [at(32, 'cru'), 'hmm', .5], [at(32, 'prison'), 'sting', .8]] });
// B033 — fin : « liberté surveillée » — dehors la nuit, bracelet + gouttière, projecteur, gyrophare
B(33, { cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .5 }),
  draw: t => { const L = at(33, 'liberte'); const sx = CX + Math.sin(t * 1.5) * 260; return nightStreet(t) + `<path d="M${sx} -100L${sx - 40} -100L${sx - 260} 1500L${sx + 260} 1500Z" fill="rgba(255,250,200,.25)"/>` +
    glow(80, 400, 300, Math.sin(t * 8) > 0 ? '#ff3b30' : '#3b6fff', .5) + ado({ x: CX, y: 1260, s: 1.35, expr: 'deadpan', face: { mouth: 'perfect' }, walk: 1 }, t) + retainer(CX, 770, .3, t) + ankleMonitor(CX + 30, 1215, .6, t) +
    bigText(['LIBERTÉ', 'SURVEILLÉE'], t, L - .1, CX, 380, '#fff', 100); },
  sfx: [[0, 'siren', .45], [.3, 'steps', .5], [at(33, 'liberte') - .1, 'thud', .8], [at(33, 'surveillee'), 'sting', .7], [2.0, 'error_beep', .4]] });

SCENES.sort((a, b) => a.s - b.s);
