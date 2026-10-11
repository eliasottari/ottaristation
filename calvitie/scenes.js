// ============================================================
//  « Pourquoi c'est horrible de devenir chauve ? » — 9:16, 36 blocs, calé mot à mot (words.js)
//  Style V2 : fausse 3D (depth), caméra épaule, POV, expressions extrêmes. SFX synthétisés uniquement.
// ============================================================
const TOTAL = 66.7;
const BT = [0, 1.86, 3.9, 5.86, 7.64, 9.94, 12.56, 13.9, 15.74, 18.24, 19.3, 20.6, 22.6, 28.04, 30.62, 32.3, 33, 33.92, 35.12, 38.18, 39.1, 40.58, 42.82, 44.18, 45.92, 48.98, 51.16, 52.6, 53.62, 54.42, 55.44, 57.56, 58.62, 60.8, 62.24, 63.2, 66.12];
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
const RUST = '#c4512b';
// le héros : loss = perte de cheveux (0 crinière → 1 chauve), comb = mèche ramenée, wind = vent, shaved = rasé
const me = (o, t) => person(Object.assign({ age: 'adult', shirt: RUST, pants: '#3b3f4a', seed: 1, hairFn: mane({ loss: o.loss || 0, comb: o.comb, wind: o.wind, shaved: o.shaved }) }, o), t);
const teen = (o, t) => person(Object.assign({ age: 'kid', shirt: RUST, pants: '#3b3f4a', seed: 1, hairFn: mane({ loss: 0 }) }, o), t);
const meHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, seed: 1, hairFn: mane({ loss: o.loss || 0, comb: o.comb, wind: o.wind, shaved: o.shaved }) }, o), t));
const prof = (o, t) => person(Object.assign({ age: 'adult', hair: 'bald', hairColor: '#8a7a6a', glasses: true, mustache: true, shirt: '#e8e2d0', pants: '#6b5b4b', seed: 4, wrinkles: true }, o), t);
const pote = (o, t) => person(Object.assign({ age: 'adult', hair: 'spiky', hairColor: '#2b2420', shirt: '#4d7cf0', pants: '#2f3b4e', seed: 6 }, o), t);
const poteHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: o.bald ? 'bald' : 'spiky', hairColor: '#2b2420', seed: 6 }, o), t));

// ---------- aides ----------
function bigText(lines, t, t0, x, y, col = '#fff', size = 110, gap = 1.08) { return lines.map((l, i) => { const k = pop(t, t0 + i * .15, .35); return k <= 0 ? '' : G(tr(x, y + i * size * gap, k), text(0, size * .35, OL, l, col, size)); }).join(''); }
function tag(x, y, str, t, t0, bg = '#ffd23f', fg = OL, size = 60, r = 0) { const k = pop(t, t0, .35); if (k <= 0) return ''; const w = str.length * size * .58 + size; return G(tr(x, y, k, r), rect(-w / 2, -size * .8, w, size * 1.6, bg, size * .5) + text(0, size * .36, 'none', str, fg, size)); }
// titre d'accroche : plus petit et loin des bords (YouTube Shorts recadre) — largeur max ≈ 760 px (x 160→920)
function title(t) {
  const k1 = pop(t, .05, .45), k2 = pop(t, .25, .45), k3 = pop(t, .45, .5);
  return G(tr(CX, 330, k1), text(0, 26, OL, "POURQUOI C'EST", '#fff', 74)) + G(tr(CX, 420, k2), text(0, 26, OL, 'HORRIBLE DE', '#fff', 74)) +
    G(tr(CX, 525, k3, wave(t, .6, 1.5)), text(0, 30, OL, 'DEVENIR <tspan fill="#ffb84d">CHAUVE ?</tspan>', '#fff', 84));
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

// ============================================================
//  PLANS
// ============================================================
// B001 — accroche : le crâne dégarni, la dernière mèche s'envole ; titre en haut (dans la zone sûre)
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .4 }),
  draw: t => depth({ zoom: 1 }, [{ z: 3, svg: rays(t, CX, 900, '#3b2f52', '#4a3c66', 22) },
    { z: 1, svg: meHead(CX, 940, 230, { loss: .9, expr: 'terror', look: [0, -1] }, t) + G(tr(CX + 120 + t * 160, 650 - t * 120, 1, t * 200), path('M0 0q30 -40 0 -80', 'none', 7, HAIR_BROWN)) + hairFall(t, CX, 700, 300, 6) + sweatSpray(CX, 760, t, 4) },
    { z: .5, svg: rect(-200, 1500, 1500, 600, '#2a2238', 0, 0), blur: 6 }]) + title(t),
  sfx: [[0, 'whoosh', .8], [.3, 'flash_hit', .7], [.9, 'flutter', .6], [1.4, 'sting', .6]] });
// B002 — 16 ans : crinière de pub de shampoing, ralenti, ventilateur, étincelles
B(2, { cam: zin(1.02, 1.1, .5),
  draw: t => rays(t, CX, 700, '#ffe9b0', '#ffd27a', 24) +
    meHead(CX, 760, 260, { loss: 0, expr: 'proud', tilt: wave(t, .6, 8) }, t) + stars(CX, 520, t, 7, 380) + sparkle(CX - 300, 520, .9 * pop(t, .3), '#fff') + sparkle(CX + 280, 600, .7 * pop(t, .6), '#fff') +
    G(tr(CX + 330, 1180, 1, 0), path('M-20 -40Q-90 -10 -60 40', 'none', 10, '#fff')) + tag(CX, 1110, '16 ANS', t, at(2, '16') - .1, '#ffd23f', OL, 64),
  sfx: [[0, 'magic', .7], [.2, 'angel', .5], [at(2, 'magnifique'), 'glint', .9], [at(2, 'chevelure'), 'sparkle', .7]] });
// B003 — contre-plongée : le prof chauve au tableau, son crâne éblouit ; le gamin se moque
B(3, { enter: 'drop', cam: (t, d) => ({ z: 1.05, cy: 700, hand: .4 }),
  draw: t => depth({ zoom: 1 }, [{ z: 2.2, svg: classroom(t), blur: 2 },
    { z: 1.3, svg: prof({ x: 740, y: 1300, s: 1.25, expr: 'annoyed', armR: [-60, -80], holdR: rect(-6, -40, 12, 40, '#fff', 4, 3) }, t) + glow(740, 650, 140, '#fff6c8', .9) + sparkle(700, 610, .8 + .2 * Math.sin(t * 9), '#fff') },
    { z: 1, svg: teen({ x: 280, y: 1520, s: 1.35, expr: 'mock', armR: [-30, -20] }, t) + G(tr(420, 760), text(0, 0, OL, 'HA HA HA', '#fff', 64)) },
    { z: .5, svg: rect(-100, 1450, 1300, 600, '#a5794e', 20) + rect(-100, 1450, 1300, 40, '#c9a77a', 0, 0), blur: 8 }]),
  sfx: [[0, 'scratch', .5], [.3, 'glint', 1], [at(3, 'crane') - .1, 'boing', .5], [at(3, 'maths'), 'rimshot', .6]] });
// B004 — plongée : arrêt sur image « ERREUR », puis le calendrier passe à 23 ans
B(4, { enter: 'none', cam: (t, d) => ({ z: t < at(4, 'parce') ? 1.12 : 1.0, r: t < at(4, 'parce') ? -5 : 0 }),
  draw: t => { const P = at(4, 'parce');
    if (t < P) return classroom(0) + teen({ x: 540, y: 1500, s: 1.5, expr: 'mock' }, .1) + rect(-200, -200, W + 400, H + 400, 'rgba(255,40,40,.18)', 0, 0) + stamp(540, 520, 'ERREUR', t, .1);
    return rays(t, CX, 900, '#d8eeff', '#c2e2ff', 20) + calendar(CX, 820, 1.6, String(Math.min(23, 16 + Math.floor((t - P) * 22))), t, P) + confetti(t, P + .3, 15); },
  sfx: [[0, 'scratch', .9], [.1, 'thud', .9], [at(4, 'parce'), 'clock_fast', .6], [at(4, '23'), 'ding', .9]] });
// B005 — le front gagne du territoire : drapeau planté sur le front, la ligne recule
B(5, { cam: zin(1.0, 1.12, .5),
  draw: t => { const k = lerp(.1, .45, eInOut(seg(t, .3, 1.8)));
    return depth({ zoom: 1 }, [{ z: 2, svg: bathroomWall(t) + mirror(140, 300, 800, 1000), blur: 1 },
      { z: 1, svg: meHead(CX, 830, 250, { loss: k, expr: 'shock', look: [0, -1] }, t) + G(tr(CX + 40, 830 - 250 * lerp(.4, .7, k) - 10, pop(t, .9), -8), line(0, 0, 0, -160, 10) + path('M0 -160L110 -130L0 -100Z', '#e2463a', 5)) + G(tr(CX - 160, 520), path('M0 40L0 -40M-20 -20L0 -40L20 -20', 'none', 12, '#e2463a')) + G(tr(CX + 160, 520), path('M0 40L0 -40M-20 -20L0 -40L20 -20', 'none', 12, '#e2463a')) },
      { z: .5, svg: sink(CX, 1330), blur: 8 }]) + tag(CX, 400, 'TERRITOIRE +', t, at(5, 'territoire') - .1, '#e2463a', '#fff', 56); },
  sfx: [[0, 'hmm', .6], [.9, 'thud', .6], [1.0, 'whistle', .5], [at(5, 'territoire'), 'tada', .4]] });
// B006 — gros plan miroir : deux petits trous sur les côtés, loupes
B(6, { cam: zin(1.04, 1.15, .6),
  draw: t => mirror(60, 260, 960, 1100) + meHead(CX, 860, 300, { loss: .3, expr: 'suspicious', look: [0, -1] }, t) +
    G(tr(CX - 165, 600, pop(t, at(6, 'trous') - .2)), circ(0, 0, 90, 'none', 12, '#e2463a')) + G(tr(CX + 165, 600, pop(t, at(6, 'trous'))), circ(0, 0, 90, 'none', 12, '#e2463a')) + magnifier(CX + 300, 480, .9 * pop(t, .5), 20) + tag(CX, 360, '2 TROUS', t, at(6, 'cotes'), '#fff', OL, 56),
  sfx: [[.4, 'whoosh', .5], [at(6, 'trous') - .2, 'pop', .8], [at(6, 'trous'), 'pop_hi', .8], [at(6, 'cotes'), 'sting', .4]] });
// B007 — large : il se rassure, doigts-pistolets nerveux au miroir
B(7, { cam: camHand(1.04, .7),
  draw: t => depth({ zoom: 1 }, [{ z: 2, svg: bathroomWall(t) + mirror(60, 300, 560, 820) + G(tr(340, 760, .9), head({ hr: 150, hairFn: mane({ loss: .3 }), expr: 'smugger', look: [1, 0] }, t)), blur: 1.5 },
    { z: 1, svg: me({ x: 760, y: 1720, s: 1.6, loss: .3, expr: 'smugger', look: [-1, 0], armL: [200, 170], armR: [-20, -10] }, t) + sweat(930, 640, 1) + sweatSpray(760, 700, t, 3) + G(tr(CX, 400, pop(t, at(7, 'c') - .1)), rect(-310, -60, 620, 120, '#fff', 30) + text(0, 18, 'none', '« C\'est juste ma coupe »', OL, 40)) }]),
  sfx: [[0, 'hmm', .5], [at(7, 'c') - .1, 'pop', .7], [at(7, 'coupe'), 'squeak', .6]] });
// B008 — douche : il chante, yeux fermés, vapeur, canard
B(8, { cam: zin(1.02, 1.1, .4),
  draw: t => showerBg(t) + steamClouds(t) + meHead(CX, 900, 250, { loss: .4, expr: 'zen', face: { mouth: 'o' } }, t) + G(tr(CX, 720), cloud(0, 0, 1.0, '#fff', 6)) +
    Array.from({ length: 3 }, (_, i) => G(tr(CX + 220 + i * 50, 600 - ((t * 60 + i * 40) % 200)), text(0, 0, OL, '♪', '#fff', 70))).join('') + G(tr(260, 1200, 1, wave(t, 1, 8)), ell(0, 0, 70, 50, '#ffd23f') + circ(-50, -50, 34, '#ffd23f') + path('M-84 -50L-110 -40L-84 -32Z', '#ff8a3d', 4) + circ(-56, -58, 6, OL, 0)),
  sfx: [[0, 'spray', .7], [.4, 'hmm', .4], [1.0, 'spray', .5]] });
// B009 — contre-plongée : la poignée de cheveux… assez pour une perruque (pipi de peur)
B(9, { enter: 'crash', cam: (t, d) => ({ z: 1.06, cy: 700, shake: t > .3 && t < .9 ? 7 : 0, hand: .6 }),
  draw: t => { const P = at(9, 'perruque');
    return showerBg(t) + steamClouds(t, 3) + me({ x: CX, y: 1820, s: 1.9, loss: .55, expr: t > .3 ? 'terror' : 'shock', armL: [250, 230], armR: [-70, -90], holdR: hairPile(0, -20, .8) }, t) + puddle(CX, 1700, seg(t, .6, 1.6)) +
      (t > P - .1 ? G(tr(CX + 200, 450, pop(t, P - .1), wave(t, 1, 8)), wig(0, 0, 1.6)) + sparkle(CX + 330, 360, .7, '#fff') + tag(CX, 300, 'PERRUQUE', t, P, '#ffd23f', OL, 56) : '') + sweatSpray(CX, 600, t, 5); },
  sfx: [[0, 'flash_hit', .8], [.2, 'gulp', .8], [.4, 'sting', .7], [.8, 'spray', .4], [at(9, 'perruque') - .1, 'magic', .7]] });
// B010 — plongée : il fonce sur l'ordi en pleine nuit (lumière bleue)
B(10, { enter: 'whip', cam: zin(1.08, 1.0, .3),
  draw: t => bedroomNight(t) + rect(80, 1520, 920, 60, '#7a5a3a', 8) + me({ x: CX, y: 1470, s: 1.4, loss: .6, expr: 'worried', armL: [60, 20], armR: [120, 160] }, t) + laptop(CX, 1520, .9, 1, G(tr(0, -170), text(0, 0, 'none', 'Google', '#4d7cf0', 60))) + glow(CX, 950, 320, '#bfe4ff', .4),
  sfx: [[0, 'whoosh', .8], [.3, 'typing', .7]] });
// B011 — la recherche s'écrit, sueur qui gicle
B(11, { cam: camHand(1.06, .8),
  draw: t => rect(-200, -200, W + 400, H + 400, '#1b2148', 0, 0) + glow(CX, 700, 600, '#bfe4ff', .4) + searchBar(CX, 520, 820, 'Comment arrêter la calvitie ?', t, 0) + meHead(CX, 1000, 230, { loss: .6, expr: 'chatter', look: [0, -1] }, t) + sweatSpray(CX, 900, t, 5),
  sfx: [[0, 'typing', .9], [.8, 'heartbeat', .6]] });
// B012 — révélation : la DHT, méchante, avec ciseaux
B(12, { enter: 'none', cam: (t, d) => t < at(12, 'dht') ? { z: lerp(1, 1.1, t / at(12, 'dht')), hand: .4 } : { z: 1.06, shake: 6 },
  draw: t => { const D = at(12, 'dht');
    if (t < D) return rect(-200, -200, W + 400, H + 400, '#1b2148', 0, 0) + glow(CX, 700, 600, '#bfe4ff', .4) + meHead(CX, 840, 240, { loss: .6, expr: 'worried' }, t);
    return rays(t, CX, 700, '#3a1f52', '#4d2a6b', 22) + dhtMonster(CX, 720, 1.6 * pop(t, D), t, { scissors: 1 }) + G(tr(CX, 1160), head({ hr: 120, hairFn: mane({ loss: .6 }), expr: 'jawdrop' }, t)); },
  sfx: [[0, 'hmm', .5], [at(12, 'dht') - .05, 'sting', .9], [at(12, 'dht'), 'thunder', .6], [at(12, 'dht') + .3, 'growl', .6]] });
// B013a — « personnes prédisposées génétiquement » : ADN, la famille chauve
B(13, { cam: zin(1, 1.06),
  draw: t => grad('#ffffff', '#eef4fa', -200, -200, W + 400, H + 400) + dna(CX, 760, 1.0, t, 9, 4, '#ffb84d') + tag(CX, 300, 'HORMONE', t, .1, '#8e44ff', '#fff', 56) +
    (t > at(13, 'genet') - .3 ? [0, 1, 2].map(i => G(tr(260 + i * 280, 1180, pop(t, at(13, 'genet') - .3 + i * .15)), head({ hr: 80, hair: 'bald', hairColor: '#8a7a6a', expr: 'deadpan', mustache: i === 0, glasses: i === 2, wrinkles: true, seed: i }, t))).join('') + tag(CX, 1040, 'PAPA · PAPI · TONTON', t, at(13, 'genet'), '#fff', OL, 40) : ''),
  sfx: [[.1, 'pop', .7], [.4, 'magic', .5], [at(13, 'genet') - .3, 'pop', .6], [at(13, 'genet') - .15, 'pop', .6], [at(13, 'genet'), 'pop_hi', .7]] });
// B013b — « miniaturise progressivement certains follicules » : coupe du cuir chevelu, la DHT rétrécit les follicules
B(13, { enter: 'whip', cam: zin(1.0, 1.08),
  draw: t => { const k = 1 - .8 * eInOut(seg(t, .2, 2.0));
    let s = grad('#ffffff', '#eef4fa', -200, -200, W + 400, H + 400) + rect(-100, 700, 1280, 900, '#ffd9c2', 0, 0) + rect(-100, 700, 1280, 60, '#f4b89a', 0, 0) + line(-100, 700, 1180, 700, 7);
    for (let i = 0; i < 4; i++) s += follicle(200 + i * 230, 760, .9, i < 2 ? k : lerp(1, .5, 1 - k), t);
    s += dhtMonster(360 + Math.sin(t * 3) * 40, 420, .55, t) + G(tr(360, 420), line(80, 60, 160, 260, 10, '#e6ccff').replace('/>', ' stroke-dasharray="20 14"/>'));
    return s + tag(CX, 300, 'MINIATURISÉS', t, .4, '#8e44ff', '#fff', 52); },
  sfx: [[0, 'zap', .7], [.5, 'buzz', .4], [1.2, 'zap', .5], [2.0, 'error_beep', .5]] }, at(13, 'miniatur') - .3);
// B014 — gros plan : le cheveu devient fil, puis fil de soie
B(14, { cam: zin(1.04, 1.14, .4),
  draw: t => { const k = 1 - eInOut(seg(t, .2, 2.2));
    return rays(t, CX, 700, '#fff3e0', '#ffe6c2', 18) + G(tr(CX, 900), path('M0 -500C60 -250 -60 0 0 250', 'none', lerp(4, 70, k) + 12) + path('M0 -500C60 -250 -60 0 0 250', 'none', lerp(4, 70, k), HAIR_BROWN)) +
      tag(CX + 230, 420, k > .5 ? 'CHEVEU' : k > .2 ? 'FIL' : 'FIL DE SOIE', t, 0, '#fff', OL, 48) + meHead(CX - 260, 1080, 110, { loss: .65, expr: 'worried', look: [1, -1] }, t); },
  sfx: [[0, 'whoosh', .5], [.6, 'squeak', .5], [1.6, 'squeak', .4]] });
// B015 — contre-plongée : la pousse fanée, l'arrosoir n'y peut rien
B(15, { cam: (t, d) => ({ z: 1.06, cy: 900 }),
  draw: t => { const w = seg(t, .3, 1.4);
    return grad('#ffe9c2', '#fff6e0', -200, -200, W + 400, H + 400) + rect(-200, 1100, W + 400, 900, '#ffd9c2', 0, 0) + line(-200, 1100, W + 200, 1100, 7) +
      G(tr(CX, 1100) + ' scale(2.4)', path(`M0 0Q${20 + w * 40} -120 ${w * 120} ${-200 + w * 160}`, 'none', 16) + path(`M0 0Q${20 + w * 40} -120 ${w * 120} ${-200 + w * 160}`, 'none', 8, HAIR_BROWN) + G(tr(w * 120, -200 + w * 160), circ(0, 0, 14, HAIR_BROWN, 4) + circ(-5, -2, 2.5, OL, 0) + circ(5, -2, 2.5, OL, 0))) +
      G(tr(760, 700, 1, -25 + wave(t, 1, 4)), rect(-90, -60, 180, 120, '#5ec4f0', 20) + path('M90 -20L190 -90', 'none', 18) + path('M90 -20L190 -90', 'none', 8, '#5ec4f0')) + Array.from({ length: 4 }, (_, i) => circ(900 - i * 30, 640 + ((t * 300 + i * 60) % 300), 8, '#8fd0ff', 3)).join(''); },
  sfx: [[0, 'spray', .4], [.4, 'squeak', .5], [1.3, 'flutter', .4]] });
// B016 — « Magnifique. » : plongée sur le sommet du crâne qui brille, applaudissements ironiques
B(16, { enter: 'drop', cam: () => ({ z: 1.05 }),
  draw: t => grad('#d9ecf7', '#bfdcee', -200, -200, W + 400, H + 400) + G(tr(CX, 860), circ(0, 0, 330, SKIN) + path('M-330 40C-300 260 300 260 330 40', 'none', 40, HAIR_BROWN) + ell(-80, -100, 120, 50, 'rgba(255,255,255,.85)', 0) + sparkle(-150, -150, 1 + .3 * Math.sin(t * 7), '#fff') + Array.from({ length: 5 }, (_, i) => path(`M${-60 + i * 30} -10q10 -20 0 -40`, 'none', 4, HAIR_BROWN)).join('')) + tag(CX, 360, 'MAGNIFIQUE.', t, .05, '#fff', OL, 60),
  sfx: [[0, 'glint', 1], [.1, 'rimshot', .5]] });
// B017 — il change de shampoing : avalanche de flacons
B(17, { enter: 'whip', cam: camHand(1.05, .7),
  draw: t => tiles('#fde2e4', '#f4c4c8', 140) + Array.from({ length: 7 }, (_, i) => bottleProd(150 + i * 130, lerp(-300, 900 + (i % 2) * 60, eOutBack(seg(t, i * .08, i * .08 + .4))), .8, ['#ff8fb1', '#5ec4f0', '#7be07b', '#ffd23f', '#b56cff', '#ff8a3d', '#5fd068'][i], 'ANTI-CHUTE', (i - 3) * 6)).join('') + me({ x: CX, y: 1750, s: 1.3, loss: .65, expr: 'effort', armL: [230, 200], armR: [-50, -20] }, t),
  sfx: [[0, 'whoosh', .7], [.1, 'pop', .6], [.25, 'pop_hi', .6], [.4, 'pop', .6], [.55, 'kaching', .5]] });
// B018 — profil : l'huile de romarin au compte-gouttes, espoir
B(18, { cam: zin(1.02, 1.1, .4),
  draw: t => grad('#eef7e6', '#d8ecc8', -200, -200, W + 400, H + 400) + Array.from({ length: 6 }, (_, i) => G(tr(120 + i * 180, 1500, 1, -20 + i * 8), path('M0 0Q10 -200 0 -380', 'none', 10, '#5b8a3c') + Array.from({ length: 6 }, (_, j) => ell(14 * (j % 2 ? 1 : -1), -60 * j - 40, 30, 10, '#7aa84a', 0)).join(''))).join('') +
    meHead(CX, 900, 230, { loss: .7, expr: 'zen' }, t) + rosemaryOil(CX + 30, 420, 1.2, 180) + circ(CX + 30, 560 + ((t * 2.5) % 1) * 140, 12, '#c9b84a', 4) + G(tr(CX + 280, 640), heart(0, 0, .8)),
  sfx: [[0, 'magic', .6], [.3, 'pop_hi', .5], [.8, 'pop_hi', .5], [1.0, 'angel', .4]] });
// B019a — large : massage frénétique (flou de mouvement)
B(19, { cam: (t, d) => ({ z: 1.05, shake: 6, hand: 1 }),
  draw: t => depth({ zoom: 1 }, [{ z: 2, svg: bathroomWall(t), blur: 2 },
    { z: 1, svg: me({ x: CX + Math.sin(t * 30) * 12, y: 1720, s: 1.6, loss: .7, expr: 'effort', armL: [-120 + Math.sin(t * 40) * 25, -60], armR: [-60 - Math.sin(t * 40) * 25, -120] }, t) + motionLines(CX - 260, 640, 3, 80, 180) + motionLines(CX + 260, 640, 3, 80, 0) + sweatSpray(CX, 600, t, 6) }]),
  sfx: [[0, 'scratch', .6], [.4, 'squeak', .5], [.9, 'scratch', .6]] });
// B019b — … comme pour redémarrer une voiture : câbles de démarrage sur la tête, étincelles
B(19, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 10 }),
  draw: t => rays(t, CX, 800, '#fff3a0', '#ffd23f', 24) + meHead(CX, 820, 240, { loss: .7, expr: 'dead', look: [0, 0] }, t) +
    [-1, 1].map(sd => path(`M${CX + sd * 170} ${560}C${CX + sd * 300} ${300} ${CX + sd * 420} ${1300} ${CX + sd * 300} ${1500}`, 'none', 18, sd < 0 ? '#e2463a' : '#2b2420') + G(tr(CX + sd * 170, 560, 1, sd * 30), rect(-30, -50, 60, 70, sd < 0 ? '#e2463a' : '#3a3a3a', 10)) + impactStar(CX + sd * 200, 520, .4 + .1 * Math.sin(t * 30), '#fff3b0')).join('') +
    G(tr(CX, 1560), rect(-200, -90, 400, 180, '#33373d', 20) + rect(-150, -120, 60, 40, '#e2463a', 6) + rect(90, -120, 60, 40, '#2b2420', 6) + text(0, 30, 'none', '12V', '#fff', 60)) + lightning(CX - 380, 300, .6, .5 + .5 * Math.sin(t * 25)) + lightning(CX + 250, 260, .5, .5 + .5 * Math.cos(t * 25)),
  sfx: [[0, 'zap', 1], [.1, 'sizzle', .7], [.4, 'zap', .8], [.7, 'thud', .5]] }, at(19, 'voiture') - .25);
// B020 — gros plan : tête fumante, un cheveu tombe, « 0 % »
B(20, { cam: zin(1.04, 1.12),
  draw: t => grad('#d9d4cc', '#bdb6ac', -200, -200, W + 400, H + 400) + meHead(CX, 900, 250, { loss: .72, expr: 'deadpan' }, t) + steam(CX - 120, 600, t, 1.4) + steam(CX + 120, 600, t + .4, 1.4) + G(tr(CX + 60, 600 + t * 300, 1, t * 200), path('M0 0q20 -20 0 -40', 'none', 6, HAIR_BROWN)) + tag(CX, 380, 'RÉSULTAT : 0 %', t, .2, '#e2463a', '#fff', 52),
  sfx: [[0, 'sizzle', .4], [.2, 'error_beep', .7], [.6, 'flutter', .4]] });
// B021 — contre-plongée épique : le peigne brandi comme une épée, chœur
B(21, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 700, bars: 1 }),
  draw: t => rays(t, CX, 500, '#fff1c2', '#ffd76b', 26) + glow(CX, 400, 500, '#fff', .6) + me({ x: CX, y: 1800, s: 1.8, loss: .8, expr: 'proud', armR: [-90, -95], holdR: G('rotate(0)', rect(-24, -330, 48, 300, '#ff6fa5', 12) + Array.from({ length: 11 }, (_, i) => line(24, -320 + i * 26, 70, -320 + i * 26, 7, '#ff6fa5')).join('')) }, t) + sparkle(CX + 160, 360, pop(t, .5), '#fff'),
  sfx: [[0, 'angel', .9], [.3, 'glint', .8], [.7, 'tada', .4]] });
// B022 — plongée : la mèche de derrière ramenée vers l'avant (flèches)
B(22, { cam: zin(1.0, 1.08, .3),
  draw: t => { const k = eInOut(seg(t, .2, 1.8)); return grad('#d9ecf7', '#bfdcee', -200, -200, W + 400, H + 400) + G(tr(CX, 860), circ(0, 0, 330, SKIN) + ell(-80, -100, 110, 40, 'rgba(255,255,255,.7)', 0) + G(`rotate(${lerp(180, 0, k)} 0 250)`, path('M-260 250C-250 -150 250 -150 260 250C150 120 -150 120 -260 250Z', HAIR_BROWN, 6) + Array.from({ length: 6 }, (_, i) => path(`M${-200 + i * 80} 230C${-180 + i * 70} 0 ${-120 + i * 50} -80 ${-100 + i * 40} -90`, 'none', 5, shade(HAIR_BROWN, -.3))).join(''))) +
    path('M860 1300C960 1000 960 700 820 480', 'none', 14, '#fff').replace('stroke-linecap', 'stroke-dasharray="26 20" stroke-linecap') + path('M790 520L820 470L870 500', 'none', 14, '#fff') + G(tr(240, 1300, 1, -30 + k * 60), rect(-20, -150, 40, 200, '#ff6fa5', 10)); },
  sfx: [[0, 'whoosh', .5], [.4, 'scratch', .5], [1.2, 'whoosh', .4], [1.8, 'ding', .6]] });
// B023 — « ça passe » : il frime dans la rue, lunettes, étincelles
B(23, { enter: 'whip', cam: camHand(1.04, .5),
  draw: t => depth({ x: t * 40, zoom: 1 }, [{ z: 2.5, svg: street(t), blur: 2.5 }, { z: 1, svg: me({ x: CX, y: 1700, s: 1.7, loss: .86, comb: 1, expr: 'cool', armL: [200, 170], armR: [-20, -10] }, t) + sparkle(CX + 120, 560, .7 * pop(t, .3), '#fff') + sparkle(CX - 140, 620, .5 * pop(t, .6), '#fff') + tag(CX, 360, 'ÇA PASSE', t, at(23, 'passe') - .1, '#7be07b', OL, 56) }]),
  sfx: [[0, 'steps', .5], [.3, 'glint', .8], [at(23, 'passe'), 'ding', .7]] });
// B024 — profil : le vent se lève (feuilles, sacs), la mèche frémit
B(24, { cam: (t, d) => ({ z: 1.05, hand: .5 + seg(t, at(24, 'vent') - .3, at(24, 'vent')) }),
  draw: t => { const V = at(24, 'vent'), w = seg(t, V - .4, V + .2) * .25;
    return depth({ zoom: 1 }, [{ z: 2.5, svg: street(t, { sky1: '#8fa8c2', sky2: '#d8e2ec' }), blur: 2 },
      { z: 1, svg: me({ x: CX, y: 1700, s: 1.7, loss: .86, comb: 1, wind: w + .05 * Math.sin(t * 20) * (t > V - .4 ? 1 : 0), expr: t > V - .3 ? 'worried' : 'cool', look: [-1, 0] }, t) + (t > V - .5 ? streaks(t, -1, 14, 'rgba(255,255,255,.6)') + Array.from({ length: 4 }, (_, i) => G(tr(((1200 - (t - V + .5) * 1800 - i * 260) % 1400 + 1400) % 1400 - 200, 500 + i * 180, 1, t * 400 + i * 90), leaf(0, 0, .3))).join('') : '') }]); },
  sfx: [[.3, 'hmm', .4], [at(24, 'vent') - .5, 'wind', 1], [at(24, 'vent'), 'sting', .5]] });
// B025a — la stratégie capillaire s'envole : la mèche se soulève comme un couvercle, il se fait pipi dessus
B(25, { enter: 'crash', cam: () => ({ z: 1.08, shake: 8, hand: 1 }),
  draw: t => { const w = eOutBack(seg(t, .1, .6));
    return depth({ zoom: 1 }, [{ z: 2.5, svg: street(t, { sky1: '#8fa8c2', sky2: '#d8e2ec' }), blur: 3 },
      { z: 1, svg: streaks(t, -1, 22, 'rgba(255,255,255,.7)') + me({ x: CX, y: 1720, s: 1.8, loss: .86, comb: 1, wind: w, expr: 'panic', tremble: 1 }, t) + puddle(CX, 1710, seg(t, .5, 1.4)) + sweatSpray(CX, 640, t, 6) + G(tr(CX + 300, 380, pop(t, at(25, 's') + .1)), text(0, 0, OL, 'FLAP FLAP', '#fff', 60)) }]); },
  sfx: [[0, 'wind', .9], [.15, 'flutter', 1], [.3, 'boing', .5], [.6, 'spray', .4]] });
// B025b — contrechamp : quinze personnes, téléphones dégainés, flashs
B(25, { enter: 'whip', flash: 1, cam: camHand(1.05, .8),
  draw: t => { let s = street(t, { sky1: '#8fa8c2', sky2: '#d8e2ec' }); const r = rng(9);
    for (let i = 0; i < 15; i++) { const row = Math.floor(i / 5), x = 140 + (i % 5) * 200 + (row % 2) * 100, y = 1250 + row * 230, sc = .55 + row * .12;
      s += person({ age: 'adult', x, y, s: sc, hair: ['short', 'curly', 'long', 'bun', 'spiky'][i % 5], hairColor: ['#4a3428', '#2b2420', '#c4521b', '#d9d9de'][i % 4], shirt: ['#5ec4f0', '#ff8fb1', '#7be07b', '#ffd23f', '#b56cff'][i % 5], expr: i % 3 ? 'shock' : 'laugh', armR: [-60, -90], holdR: phone(0, -10, .25), seed: i }, t + r());
      if (((t * 3 + i * .37) % 1) < .12) s += glow(x + 40, y - 380 * sc, 70, '#fff', .9); }
    return s + tag(CX, 360, '15 TÉMOINS', t, .2, '#e2463a', '#fff', 56); },
  sfx: [[0, 'gasp', 1], [.2, 'shutter', .8], [.5, 'shutter', .7], [.8, 'shutter', .8], [1.1, 'shutter', .7]] }, at(25, 'devant') - .2);
// B026 — 28 ans : gros plan téléphone « GREFFE TURQUIE », yeux en €
B(26, { cam: zin(1.02, 1.12, .5),
  draw: t => rect(-200, -200, W + 400, H + 400, '#2b2238', 0, 0) + calendar(250, 360, .7, '28', t, 0, -8) +
    phoneBig(700, 760, 1.1, 6, G(tr(0, -220), rect(-150, -75, 300, 150, '#e30a17', 0, 0) + circ(-30, 0, 40, '#fff', 0) + circ(-14, 0, 34, '#e30a17', 0) + path('M30 -20L42 4L18 -10L42 -10L18 4Z', '#fff', 0)) + text(0, -40, 'none', 'GREFFE ✈', OL, 44) + text(0, 30, 'none', 'TURQUIE', OL, 44) + text(0, 140, 'none', '€€€', '#5fd068', 80)) +
    meHead(330, 1050, 170, { loss: .86, expr: 'wow', look: [1, -1] }, t),
  sfx: [[0, 'ding', .7], [.4, 'kaching', .9], [1.2, 'coins', .5]] });
// B027 — contre-plongée : la décision (bandes cinéma, tondeuse brandie)
B(27, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), cy: 700, bars: 1 }),
  draw: t => rays(t, CX, 500, '#ffd9a8', '#ffb877', 22) + me({ x: CX, y: 1820, s: 1.9, loss: .86, expr: 'rage', armR: [-80, -95], holdR: clippers(0, -40, .7, 180, t) }, t),
  sfx: [[0, 'drum', .8], [.3, 'sting', .7], [.9, 'buzz', .5]] });
// B028 — plongée : il rase tout, cheveux qui volent au ralenti
B(28, { enter: 'crash', cam: () => ({ z: 1.06, shake: 4 }),
  draw: t => { const k = seg(t, 0, .9); return grad('#d9ecf7', '#bfdcee', -200, -200, W + 400, H + 400) + G(tr(CX, 860), circ(0, 0, 330, SKIN) + (k < 1 ? path(`M-330 40C-300 260 300 260 330 40`, 'none', 40 * (1 - k), HAIR_BROWN) : '') + ell(-80, -100, 120, 50, 'rgba(255,255,255,.85)', 0)) + clippers(CX + lerp(-300, 300, k), 760, .9, 90, t) + hairFall(t * 2, CX, 500, 700, 16) + tag(CX, 360, 'BZZZZZ', t, .05, '#fff', OL, 56); },
  sfx: [[0, 'buzz', 1]] });
// B029 — « Et bizarrement… » : suspense, roulement de tambour
B(29, { enter: 'none', cam: zin(1.0, 1.15),
  draw: t => rect(-200, -200, W + 400, H + 400, '#2b2238', 0, 0) + `<path d="M${CX - 160} -50L${CX + 160} -50L${CX + 480} 1600L${CX - 480} 1600Z" fill="rgba(255,240,180,.25)"/>` + meHead(CX, 880, 230, { shaved: 1, expr: 'worried', look: [Math.sin(t * 4), 0] }, t),
  sfx: [[0, 'drum', .9], [.3, 'heartbeat', .5]] });
// B030 — ça te va plutôt bien : crâne qui brille, lunettes, ultra-chill, rayons
B(30, { flash: 1, cam: zin(1.0, 1.08, .3),
  draw: t => rays(t, CX, 800, '#ffe9a8', '#ffd36b', 26) + glow(CX, 700, 500, '#fff', .5) + me({ x: CX, y: 1780, s: 1.8, shaved: 1, expr: 'cool', armL: [200, 170], armR: [-50, -100] }, t) + sparkle(CX - 120, 420, 1.1 + .3 * Math.sin(t * 8), '#fff') + stars(CX, 520, t, 6, 300) + tag(CX, 300, 'BG.', t, .3, '#fff', OL, 70) + Array.from({ length: 3 }, (_, i) => heart(260 + i * 270, 1100 - ((t * 120 + i * 80) % 300), .6)).join(''),
  sfx: [[0, 'tada', .8], [.2, 'glint', 1], [.6, 'angel', .5]] });
// B031 — large : le téléphone vibre et sonne sur le lavabo, il sursaute
B(31, { cam: (t, d) => ({ z: 1.05, hand: .6, shake: t > at(31, 'sonne') ? 4 : 0 }),
  draw: t => { const S = at(31, 'sonne'), j = t > S - .2 ? Math.sin(t * 60) * 6 : 0;
    return depth({ zoom: 1 }, [{ z: 2, svg: bathroomWall(t) + mirror(160, 260, 760, 760), blur: 1.5 },
      { z: 1, svg: me({ x: 360, y: 1700, s: 1.5, shaved: 1, expr: t > S ? 'shock' : 'cool', look: [1, 0] }, t) + (t > S ? emark(560, 640, .8) : '') },
      { z: .6, svg: sink(760, 1380) + G(tr(760 + j, 1240, 1, 10), phone(0, 0, .5)) + (t > S - .2 ? motionLines(860, 1180, 3, 60, -30) + motionLines(660, 1180, 3, 60, 210) : '') }]); },
  sfx: [[at(31, 'sonne') - .3, 'vibrate', .9], [at(31, 'sonne'), 'ring', .9]] });
// B032 — gros plan : l'écran « LE POTE » appelle
B(32, { enter: 'crash', cam: zin(1.04, 1.12, .5),
  draw: t => rays(t, CX, 900, '#d8eeff', '#c2e2ff', 20) + phoneBig(CX, 880, 1.6, Math.sin(t * 40) * 2, G(tr(0, -110), circ(0, 0, 100, '#cfe9ff', 5) + G(tr(0, 10), head({ hr: 80, hair: 'spiky', hairColor: '#2b2420', expr: 'smug', seed: 6 }, t))) + text(0, 60, 'none', 'LE POTE', OL, 40) + circ(-80, 200, 40, '#e2463a', 0) + circ(80, 200, 40, '#5fd068', 0)),
  sfx: [[0, 'ring', .8], [.6, 'vibrate', .5]] });
// B033 — contre-plongée flashback sépia : le pote qui se moquait de son front, 5 ans
B(33, { cam: (t, d) => ({ z: 1.05, cy: 700, hand: .4 }),
  draw: t => { let s = classroom(t) + pote({ x: 640, y: 1600, s: 1.6, expr: 'mock', armR: [-160, -170] }, t) + G(tr(820, 560), text(0, 0, OL, 'FRONT XXL', '#fff', 54)) + me({ x: 260, y: 1650, s: 1.2, loss: .35, expr: 'embarrassed' }, t);
    s = `<g filter="url(#sepia)">${s}</g><defs><filter id="sepia"><feColorMatrix type="matrix" values=".39 .77 .19 0 0 .35 .69 .17 0 0 .27 .53 .13 0 0 0 0 0 1 0"/></filter></defs>`;
    return s + calendar(860, 1050, .6, '5', t, at(33, '5') - .2, 10); },
  sfx: [[0, 'rewind', .6], [.3, 'rimshot', .5], [at(33, '5') - .2, 'pop', .7]] });
// B034 — plongée : la photo de SON crâne arrive (énorme tonsure)
B(34, { enter: 'whip', cam: zin(1.02, 1.1),
  draw: t => grad('#2b2238', '#3a2f4f', -200, -200, W + 400, H + 400) + phoneBig(CX, 880, 1.5, 0, G(tr(0, 30, pop(t, .3)), rect(-130, -200, 260, 330, '#fff', 10, 4) + circ(0, -40, 110, SKIN) + path('M-110 -20C-110 60 110 60 110 -20', 'none', 30, '#2b2420') + ell(-30, -70, 40, 16, 'rgba(255,255,255,.8)', 0))) + tag(CX, 360, 'PHOTO REÇUE', t, .2, '#5ec4f0', '#fff', 50),
  sfx: [[0, 'whoosh', .6], [.3, 'ding', .9], [.5, 'shutter', .5]] });
// B035 — moyen : il lit le message, le sourcil se lève, sourire narquois
B(35, { cam: zin(1.0, 1.1, .5),
  draw: t => grad('#2b2238', '#3a2f4f', -200, -200, W + 400, H + 400) + glow(CX, 800, 400, '#bfe4ff', .35) + meHead(CX, 840, 260, { shaved: 1, expr: t > .5 ? 'smugger' : 'neutral', look: [0, 1] }, t) + G(tr(CX + 280, 520, pop(t, .4)), text(0, 0, OL, '…?', '#fff', 80)),
  sfx: [[0, 'hmm', .6], [.5, 'squeak', .4]] });
// B036 — le message final + fou rire, le pote en larmes
B(36, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .5 }),
  draw: t => rays(t, CX, 900, '#ffe9a8', '#ffd36b', 22) +
    chatBubble(CX, 500, 960, 400, '« Frère…\nt\'as encore\nle numéro de la clinique\nen Turquie ? »', t, .05, false, 58) +
    G(tr(790, 1000, pop(t, .9)), circ(0, 0, 165, '#cfe9ff', 6) + head({ hr: 130, hair: 'bald', hairColor: '#2b2420', expr: 'sob', seed: 6 }, t)) +
    meHead(330, 1010, 210, { shaved: 1, expr: 'mock' }, t) + G(tr(330, 750), text(0, 0, OL, 'HA HA HA', '#fff', 56).replace('<text', `<text opacity="${seg(t, 1.2, 1.4)}"`)),
  sfx: [[0, 'pop', .8], [.05, 'ding', .8], [.9, 'pop_hi', .7], [1.2, 'rimshot', .7], [2.2, 'tada', .5]] });

SCENES.sort((a, b) => a.s - b.s);
