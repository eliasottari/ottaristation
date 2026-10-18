// ============================================================
//  « Pourquoi c'est horrible de garder des cicatrices d'acné ? » — style SIZEX fun — 9:16, calé mot à mot (words.js + timing.js générés par tools/prep.py)
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
//  Police Fredoka (défaut de sxFun), contours cartoon épais, un accent corail. Ton : drôle puis bienveillant (jamais moqueur envers le héros).
// ============================================================
sxFun('#ff6b4a'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';
const M = 700;

// ---------- cicatrices d'acné (overlay sur head via hairFn : après les joues, avant les yeux) ----------
// petits creux rosés discrets : ovale rosé + ombre en croissant en haut (= creux). lit = la lumière les révèle (reflets).
const SCAR = [[.24, .15, 1], [-.36, .25, 1.1], [.5, .2, .9], [.62, .34, 1.15], [.42, .4, .8], [.72, .18, .75], [-.52, .37, 1], [-.64, .2, .9], [-.44, .48, .8], [.56, .5, .7], [-.72, .33, .7]];
function scarsSvg(r, k = 1, o = {}) {
  if (k <= 0) return ''; let s = '', g = '';
  SCAR.forEach(([x, y, sc], i) => { const cx = x * r, cy = y * r, rr = r * .042 * sc;
    s += ell(cx, cy, rr * 1.3, rr, '#e59a8c', 0) + path(`M${f1(cx - rr * 1.1)} ${f1(cy)}A${f1(rr * 1.1)} ${f1(rr * .8)} 0 0 1 ${f1(cx + rr * 1.1)} ${f1(cy)}`, 'none', Math.max(1.5, r * .012), '#b9675c');
    if (o.lit) g += op(o.lit * (.6 + .4 * Math.sin((o.tt || 0) * 9 + i * 2)), circ(cx, cy, rr * 2.2, 'rgba(255,240,170,.55)', 0) + sparkle(cx + rr, cy - rr * 1.6, r / 900 * (1 + (i % 3) * .3), '#fff')); });
  return `<g opacity="${(.9 * k).toFixed(3)}">${s}</g>` + g;
}
// boutons d'ado (photo de 15 ans) : k = fraction visible (0 = disparus)
const PIMP = [[.5, .22], [.62, .36], [-.48, .3], [-.62, .18], [.3, -.5], [-.2, -.62], [.12, .55], [-.3, .5], [.7, .1], [-.7, .38], [.42, -.3], [0, -.4], [.45, .45], [-.55, -.1]];
function pimplesSvg(r, k = 0) {
  if (k <= 0) return ''; let s = ''; const n = Math.ceil(PIMP.length * k);
  PIMP.forEach(([x, y], i) => { if (i >= n) return; const cx = x * r, cy = y * r, rr = r * (.045 + .015 * (i % 3));
    s += circ(cx, cy, rr, '#ef6f6f', Math.max(2, r * .012), '#c2414b') + circ(cx - rr * .3, cy - rr * .35, rr * .3, '#fff6e0', 0); });
  return s;
}
const HAIRC = '#4a3020', HERO = '#3fa7a0';
const scarHair = (r, t, o) => { const [b, f] = hairSvg(o.hs || 'side', o.hc || HAIRC, r, t); return [b, f + scarsSvg(r, o.scar ?? 1, { lit: o.lit, tt: t }) + pimplesSvg(r, o.acne || 0)]; };
const noah = (o, t) => person(Object.assign({ age: 'adult', hairFn: scarHair, shirt: HERO, pants: '#35425a', seed: 2 }, o), t);
const noahHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: scarHair, seed: 2 }, o), t));
const teen = (o, t) => person(Object.assign({ age: 'kid', hairFn: scarHair, scar: 0, acne: 1, shirt: '#ff9a4d', pants: '#35425a', seed: 2 }, o), t);
const teenHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: scarHair, scar: 0, acne: 1, seed: 2 }, o), t));
const kevin = (o, t) => person(Object.assign({ age: 'adult', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinTeen = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
// [x, y] d'une cicatrice i pour une tête (x, y, r)
const scarAt = (x, y, r, i) => [x + SCAR[i][0] * r, y + SCAR[i][1] * r];
const headOf = (x, y, s, age = 'adult') => [x, y - (age === 'kid' ? 292 : 402) * s, (age === 'kid' ? 100 : 92) * s];
const KH = ['curly', 'bun', 'spiky', 'ponytail', 'short', 'long'], KC = ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040', '#1f1a18', '#6b3e26'], KS = ['#ff8fb1', '#7aa6d8', '#7be07b', '#ff9a4d', '#b56cff', '#5ec4f0'], SK = ['#f2c9a0', '#c98a5e', '#f6d7b8', '#8a5a3a', '#e0b088', '#f2c9a0'];
const kid = (i, o, t) => person(Object.assign({ age: 'kid', hair: KH[i % 6], hairColor: KC[i % 6], shirt: KS[i % 6], skin: SK[i % 6], pants: '#3b3f4a', seed: 20 + i }, o), t);
const kidHead = (i, x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: KH[i % 6], hairColor: KC[i % 6], skin: SK[i % 6], seed: 20 + i }, o), t));
const AH = ['side', 'bun', 'bald', 'long', 'short'], AC = ['#1f1a18', '#8a5a3a', '#7a6a5a', '#c4521b', '#d9d9de'], AS = ['#5b8fd8', '#e2463a', '#36a85a', '#ff9a4d', '#8a6ad8'];
const adult = (i, o, t) => person(Object.assign({ age: 'adult', hair: AH[i % 5], hairColor: AC[i % 5], shirt: AS[i % 5], skin: SK[(i + 2) % 6], pants: '#2f3b4e', seed: 60 + i, glasses: i % 3 === 0, mustache: i === 2 }, o), t);
const adultHead = (i, x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: AH[i % 5], hairColor: AC[i % 5], skin: SK[(i + 2) % 6], seed: 60 + i, glasses: i % 3 === 0, mustache: i === 2 }, o), t));

// ---------- décors vivants (passe « DÉCORS RICHES » : accessoires factorisés + 3 couches + éléments animés) ----------
// accessoires préfixés d… (pas de collision avec le moteur). Tous posés « pieds » en (x, y) sauf mention.
const DPAL = ['#e2463a', '#5b8fd8', '#ffd23f', '#36a85a', '#ff8fb1', '#8a6ad8', '#ff9a4d', '#5ec4f0'];
const dHaze = (k = .35, col = '230,240,250', y1 = 1300) => rect(-M, -M, W + 2 * M, y1 + M, `rgba(${col},${k})`, 0, 0);
function dWall(kind, c1, c2, yb = 1250) { let s = rect(-M, -M, W + 2 * M, yb + M, c1, 0, 0);
  if (kind === 'stripe') for (let x = -M; x < W + M; x += 120) s += rect(x, -M, 48, yb + M, c2, 0, 0);
  if (kind === 'dot') for (let y = -40; y < yb; y += 90) for (let x = -M + ((y / 90) % 2 ? 45 : 0); x < W + M; x += 90) s += circ(x, y, 7, c2, 0);
  if (kind === 'diamond') for (let y = 0; y < yb; y += 110) for (let x = -M + ((y / 110) % 2 ? 55 : 0); x < W + M; x += 110) s += path(`M${x} ${y - 14}L${x + 10} ${y}L${x} ${y + 14}L${x - 10} ${y}Z`, c2, 0);
  if (kind === 'star') for (let y = 30; y < yb; y += 140) for (let x = -M + ((y / 140) % 2 ? 70 : 0); x < W + M; x += 140) s += ftext(x, y, '✦', { size: 26, fill: c2, stroke: 'none' });
  return s; }
const dBase = (yb, col = '#fff', h = 34) => rect(-M, yb - h, W + 2 * M, h, col, 0, 0) + line(-M, yb - h, W + M, yb - h, 5, shade(col, -.25));
function dParquet(yb, c) { let s = rect(-M, yb, W + 2 * M, 1500, c, 0, 0); const ys = [0, 28, 64, 112, 176, 260, 370, 510, 690]; ys.forEach((dy, i) => { s += line(-M, yb + dy, W + M, yb + dy, 4, shade(c, -.2)); const nx = ys[i + 1]; if (nx !== undefined) for (let x = -M + (i % 2) * 110; x < W + M; x += 220) s += line(x, yb + dy, x, yb + nx, 4, shade(c, -.2)); }); return s + line(-M, yb, W + M, yb, 8, shade(c, -.35)); }
function dTileFloor(yb, c1, c2) { let s = rect(-M, yb, W + 2 * M, 1500, c1, 0, 0); const ys = [0, 40, 95, 170, 270, 400, 570, 800]; for (let i = 0; i < ys.length - 1; i++) { const h = ys[i + 1] - ys[i], w = h * 1.6; for (let k = 0, x = -M; x < W + M; x += w, k++) if ((k + i) % 2) s += rect(x, yb + ys[i], w, h, c2, 0, 0); } return s + line(-M, yb, W + M, yb, 7, shade(c1, -.3)); }
const dOutlet = (x, y) => rect(x - 22, y - 30, 44, 60, '#f4f1ea', 8, 4) + circ(x - 8, y, 4, OL, 0) + circ(x + 8, y, 4, OL, 0);
const dSwitch = (x, y) => rect(x - 24, y - 34, 48, 68, '#f4f1ea', 8, 4) + rect(x - 9, y - 16, 18, 32, '#dcd6cc', 4, 3);
function dPic(kind, w, h) { const a = -w / 2 + 12, b = -h / 2 + 12, iw = w - 24, ih = h - 24;
  if (kind === 'mount') return rect(a, b, iw, ih, '#cfe8f5', 0, 0) + path(`M${a} ${b + ih}L${a + iw * .35} ${b + ih * .35}L${a + iw * .6} ${b + ih * .7}L${a + iw * .75} ${b + ih * .5}L${a + iw} ${b + ih}Z`, '#7bbf5a', 3) + circ(a + iw * .78, b + ih * .25, ih * .12, '#ffd23f', 3);
  if (kind === 'heart') return rect(a, b, iw, ih, '#ffe1ee', 0, 0) + heart(0, 4, Math.min(iw, ih) / 120, '#ff5d73');
  if (kind === 'face') return rect(a, b, iw, ih, '#fff1c8', 0, 0) + circ(0, ih * .08, ih * .28, '#f2c9a0', 3) + path(`M${-ih * .28} ${-ih * .02}Q0 ${-ih * .38} ${ih * .28} ${-ih * .02}`, '#6b3e26', 3) + path(`M${-ih * .1} ${ih * .18}Q0 ${ih * .25} ${ih * .1} ${ih * .18}`, 'none', 3);
  if (kind === 'sea') return rect(a, b, iw, ih, '#bfe3ff', 0, 0) + rect(a, b + ih * .55, iw, ih * .45, '#4d9fd8', 0, 0) + path(`M${a + iw * .3} ${b + ih * .55}L${a + iw * .45} ${b + ih * .2}L${a + iw * .5} ${b + ih * .55}Z`, '#fff', 3);
  return rect(a, b, iw, ih, '#e1f5d6', 0, 0) + circ(0, 0, ih * .25, '#ff9a4d', 3); }
const dFrame = (x, y, w, h, kind = 'mount', col = '#c38a52', r = 0) => G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, col, 6, 6) + dPic(kind, w, h) + rect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 'none', 2, 3));
function dPoster(x, y, w, h, bg, r, inner = '', t = 0) { const fl = Math.sin(t * 2.4 + x) * 3; return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, bg, 6, 5) + inner + path(`M${w / 2 - 34} ${h / 2}L${w / 2} ${h / 2 - 34 + fl}L${w / 2} ${h / 2}Z`, shade(bg, -.2), 3) + rect(-18, -h / 2 - 10, 36, 18, 'rgba(255,255,255,.75)', 3, 0)); }
function dBooks(x, y, w, seed = 1) { const r = rng(seed); let s = '', cx = x; while (cx < x + w - 20) { const bw = 18 + r() * 14, bh = 56 + r() * 34, c = DPAL[Math.floor(r() * 8)]; if (r() < .12 && cx + bh < x + w) { s += rect(cx, y - bw, bh, bw, c, 3, 4); cx += bh + 4; continue; } s += rect(cx, y - bh, bw, bh, c, 3, 4) + line(cx + 4, y - bh + 12, cx + bw - 4, y - bh + 12, 3, 'rgba(255,255,255,.6)'); cx += bw + 2; } return s; }
const dShelf = (x, y, w, items = '', col = '#b5835a') => items + rect(x, y, w, 18, col, 4, 5) + path(`M${x + 24} ${y + 18}L${x + 24} ${y + 50}L${x + 56} ${y + 18}`, 'none', 5) + path(`M${x + w - 24} ${y + 18}L${x + w - 24} ${y + 50}L${x + w - 56} ${y + 18}`, 'none', 5);
const dJar = (x, y, c = '#ffd23f', s = 1) => G(tr(x, y, s), rect(-24, -64, 48, 64, 'rgba(220,240,255,.85)', 10, 4) + rect(-20, -40, 40, 36, c, 6, 0) + rect(-26, -76, 52, 16, '#c96a3a', 5, 4));
const dTrophy = (x, y, s = 1) => G(tr(x, y, s), rect(-30, -16, 60, 16, '#6b3e26', 3, 4) + rect(-8, -46, 16, 30, '#e8b923', 0, 4) + path('M-34 -96L34 -96Q34 -46 0 -46Q-34 -46 -34 -96Z', '#ffd23f', 4) + path('M-34 -88Q-56 -84 -46 -64M34 -88Q56 -84 46 -64', 'none', 4) + ftext(0, -64, '1', { size: 22, fill: '#a0703f', stroke: 'none' }));
const dTeddy = (x, y, s = 1, c = '#c9935c') => G(tr(x, y, s), ell(0, -38, 40, 40, c, 5) + circ(-30, -96, 13, c, 5) + circ(30, -96, 13, c, 5) + circ(0, -82, 30, c, 5) + ell(0, -74, 12, 9, '#f1d2a8', 0) + circ(-10, -88, 4, OL, 0) + circ(10, -88, 4, OL, 0) + circ(0, -77, 4, OL, 0) + ell(-28, -8, 16, 11, c, 4) + ell(28, -8, 16, 11, c, 4));
function dPot(x, y, s, t, kind = 0, potC = '#d9825b') { const sw = wave(t, .5, 4, x * .01); let lv = '';
  if (kind === 0) for (let i = 0; i < 5; i++) lv += G(tr(0, -60, 1, -60 + i * 30 + sw), ell(0, -55, 18, 55, ['#5fb85f', '#4fa64f', '#6cc46c'][i % 3], 4));
  else if (kind === 1) lv += G(tr(0, -60, 1, sw), rect(-18, -150, 36, 150, '#5aa76a', 18, 4) + rect(-58, -110, 26, 70, '#5aa76a', 13, 4) + rect(32, -126, 26, 60, '#5aa76a', 13, 4));
  else for (let i = 0; i < 7; i++) lv += G(tr(0, -60, 1, -75 + i * 25 + sw), path('M0 0Q-16 -60 0 -120Q16 -60 0 0Z', '#4fa64f', 3));
  return G(tr(x, y, s), lv + path('M-46 -62L46 -62L36 0L-36 0Z', potC, 5) + rect(-52, -74, 104, 18, shade(potC, -.15), 5, 5)); }
function dCurtain(x, y, w, h, col, t, side = 1) { let d = `M${x} ${y}L${x + w} ${y}`; const n = 5; for (let i = 0; i <= n; i++) { const yy = y + h * i / n; d = d; } const sw = wave(t, .5, 14, x * .01);
  const xb = x + (side > 0 ? w * .7 + sw : w * .3 + sw), dd = side > 0 ? `M${x} ${y}L${x + w} ${y}Q${x + w * .55} ${y + h * .5} ${xb} ${y + h}L${x - 6} ${y + h}Z` : `M${x} ${y}L${x + w} ${y}L${x + w + 6} ${y + h}L${xb} ${y + h}Q${x + w * .45} ${y + h * .5} ${x} ${y}Z`;
  let s = path(dd, col, 6); for (let i = 1; i < 4; i++) s += path(`M${x + w * i / 4} ${y + 10}Q${x + w * i / 4 + sw * .4} ${y + h * .5} ${x + w * i / 4 + (side > 0 ? -1 : 1) * w * .12} ${y + h - 10}`, 'none', 4, shade(col, -.25)); return s + rect(x - 20, y - 14, w + 40, 18, '#8a5a3a', 8, 4); }
function dWindowView(x, y, w, h, t, o = {}) { const night = o.night; let s = grad(night ? '#0f163a' : '#9fd6ff', night ? '#2a3170' : '#e6f6ff', x, y, w, h);
  s += night ? circ(x + w * .72, y + h * .22, 34, '#fff6d6', 0) : cloud(x + ((t * 20) % (w + 160)) - 80, y + h * .25, .45, '#fff');
  for (let i = 0; i < 5; i++) { const bx = x + i * w / 5, bh = h * (.25 + ((i * 37) % 30) / 100); s += rect(bx, y + h - bh, w / 5 + 2, bh, night ? '#1a2048' : '#b9cfe0', 0, 0); for (let j = 0; j < 3; j++) s += rect(bx + 14, y + h - bh + 16 + j * 34, 14, 16, night ? (Math.sin(t * .7 + i * 3 + j) > -.3 ? '#ffe08a' : '#2e3570') : '#e6f2fb', 2, 0); }
  if (!night) s += circ(x + w * .2, y + h - 30, 46, '#6cc46c', 0) + circ(x + w * .3, y + h - 50, 40, '#5fb85f', 0);
  return s + rect(x, y, w, h, 'none', 8, 10, '#fff') + rect(x - 6, y - 6, w + 12, h + 12, 'none', 10, 6) + line(x + w / 2, y, x + w / 2, y + h, 8, '#fff') + line(x, y + h / 2, x + w, y + h / 2, 8, '#fff') + rect(x - 24, y + h, w + 48, 20, '#f4f1ea', 4, 5); }
const dRug = (x, y, w, h, c1, c2) => ell(x, y, w / 2, h / 2, c1, 6) + ell(x, y, w * .38, h * .36, 'none', 6, c2) + ell(x, y, w * .22, h * .2, c2, 0);
const dBin = (x, y, s = 1, c = '#7aa6d8') => G(tr(x, y, s), path('M-46 -110L46 -110L36 0L-36 0Z', c, 5) + line(-20, -90, -16, -14, 4, shade(c, -.25)) + line(20, -90, 16, -14, 4, shade(c, -.25)) + path('M-30 -110Q-10 -136 6 -112Q20 -130 34 -110', '#fff', 4));
const dBag = (x, y, s = 1, c = '#e2463a', r = 0) => G(tr(x, y, s, r), rect(-60, -130, 120, 130, c, 26, 5) + rect(-40, -60, 80, 46, shade(c, -.15), 12, 4) + path('M-30 -130Q0 -176 30 -130', 'none', 8) + circ(0, -80, 6, '#ffd23f', 3));
const dShoes = (x, y, s = 1, c = '#5b8fd8') => G(tr(x, y, s), path('M-80 0L-80 -34Q-60 -46 -40 -30L-6 -20Q4 -10 0 0Z', c, 5) + path('M10 0L10 -34Q30 -46 50 -30L84 -20Q94 -10 90 0Z', c, 5) + line(-82, -3, 0, -3, 6, '#fff') + line(8, -3, 92, -3, 6, '#fff'));
const dBall = (x, y, s = 1, t = 0, c = '#e2463a') => G(tr(x, y - 40 * s, s, t * 40), circ(0, 0, 40, c, 5) + path('M-40 0Q0 -20 40 0M0 -40Q-20 0 0 40', 'none', 5, '#fff'));
const dBox = (x, y, s = 1, str = '') => G(tr(x, y, s), rect(-80, -110, 160, 110, '#d9a86c', 4, 5) + path('M-80 -110L-100 -140L-20 -140L0 -110M80 -110L100 -140L20 -140L0 -110', '#c8955a', 4) + rect(-14, -110, 28, 40, '#e8c690', 0, 0) + (str ? ftext(0, -30, str, { size: 22, fill: '#7a5a3a', stroke: 'none' }) : ''));
const dGift = (x, y, s = 1, c = '#5ec4f0', c2 = '#ffd23f') => G(tr(x, y, s), rect(-60, -100, 120, 100, c, 6, 5) + rect(-12, -100, 24, 100, c2, 0, 0) + rect(-60, -100, 120, 100, 'none', 6, 5) + path('M0 -100Q-40 -150 -30 -104M0 -100Q40 -150 30 -104', 'none', 7, c2));
function dLamp(x, y, s = 1, on = 1, t = 0, c = '#ffd23f') { return G(tr(x, y, s), (on ? op(.25 + .05 * Math.sin(t * 3), circ(0, -300, 140, '#fff6c8', 0)) : '') + rect(-40, -10, 80, 14, '#5a4a3a', 6, 4) + line(0, -10, 0, -260, 8) + path('M-60 -250L60 -250L36 -350L-36 -350Z', c, 5)); }
const dDeskLamp = (x, y, s = 1, t = 0) => G(tr(x, y, s), op(.3 + .05 * Math.sin(t * 4), path('M40 -150L-60 0L160 0Z', '#fff6c8', 0)) + ell(0, -6, 40, 10, '#5b8fd8', 4) + line(0, -10, -20, -100, 8) + line(-20, -100, 40, -150, 8) + path('M20 -170L80 -140L60 -110L4 -134Z', '#5b8fd8', 5));
const dMug = (x, y, s = 1, t = 0, c = '#ff8fb1') => G(tr(x, y, s), rect(-26, -54, 52, 54, c, 8, 4) + path('M26 -42Q46 -36 26 -14', 'none', 5) + op(.6, path(`M-6 -64Q${-14 + wave(t, 1, 6)} -84 -4 -104M10 -64Q${2 + wave(t, 1, 6, .5)} -86 12 -108`, 'none', 4, '#fff')));
const dGlobe = (x, y, s = 1, t = 0) => G(tr(x, y, s), rect(-40, -10, 80, 14, '#6b3e26', 5, 4) + line(0, -10, 0, -40, 6) + circ(0, -110, 66, '#5ec4f0', 5) + G(`translate(${f1(((t * 30) % 120) - 60)} -110)`, ell(0, -14, 26, 18, '#7be07b', 0) + ell(30, 22, 16, 12, '#7be07b', 0)) + circ(0, -110, 66, 'none', 5) + path('M-74 -110A74 74 0 0 1 0 -184', 'none', 6, '#8a5a3a'));
function dBird(x, y, s, t, ph = 0) { const f = Math.sin(t * 10 + ph) * 14; return G(tr(x, y, s), path(`M-30 ${f1(-f)}Q-14 -6 0 4Q14 -6 30 ${f1(-f)}`, 'none', 6)); }
const dBirds = (t, n = 3, y = 300, seed = 1) => { let s = ''; for (let i = 0; i < n; i++) s += dBird(((t * (50 + i * 12) + i * 420 + seed * 200) % 1700) - 300, y + i * 46 + Math.sin(t * 2 + i) * 14, .7 - i * .1, t, i * 2); return s; };
function dSkyline(yb, col, seed = 3, win = 'rgba(255,255,255,.35)') { const r = rng(seed); let s = '', x = -M; while (x < W + M) { const w = 120 + r() * 140, h = 280 + r() * 380; s += rect(x, yb - h, w, h, col, 0, 0); if (r() < .4) s += rect(x + w * .4, yb - h - 50, 10, 50, col, 0, 0); for (let j = yb - h + 40; j < yb - 40; j += 70) for (let i = x + 18; i < x + w - 30; i += 46) s += rect(i, j, 20, 28, win, 2, 0); x += w + 6; } return s; }
// immeuble détaillé : corniche, fenêtres (rideaux / plantes / lumière), balcons, rez-de-chaussée commerçant (store rayé + enseigne)
function dBuilding(x, yb, w, h, c, seed, t, o = {}) { const r = rng(seed); let s = rect(x, yb - h, w, h, c, 4, 6) + rect(x - 10, yb - h - 18, w + 20, 26, shade(c, -.18), 4, 5);
  const cols = Math.max(1, Math.floor(w / 95)), cw = (w - 30) / cols, top = yb - h + 40, shopH = o.shop === false ? 0 : 190;
  for (let j = top; j < yb - shopH - 90; j += 120) for (let i = 0; i < cols; i++) { const wx = x + 15 + i * cw + 10, ww = cw - 20, lit = o.night ? Math.sin(t * .6 + i * 2.1 + j * .07) > -.2 : r() < .2;
    s += rect(wx, j, ww, 74, lit ? '#ffe08a' : '#cfe8ff', 4, 4); const k = r(); if (k < .3) s += path(`M${wx + 3} ${j + 3}L${wx + ww * .35} ${j + 3}Q${wx + ww * .2} ${j + 40} ${wx + 6} ${j + 70}Z`, DPAL[(seed + i) % 8], 0); else if (k < .45) s += rect(wx - 6, j + 66, ww + 12, 14, '#8a5a3a', 3, 3) + circ(wx + ww * .3, j + 62, 12, '#5fb85f', 3) + circ(wx + ww * .65, j + 60, 14, '#ff8fb1', 3); else s += line(wx + ww / 2, j, wx + ww / 2, j + 74, 4);
    if (r() < .18) s += rect(wx - 10, j + 74, ww + 20, 10, '#7d848c', 2, 4) + Array.from({ length: 4 }, (_, q) => line(wx - 6 + q * (ww + 12) / 3, j + 84, wx - 6 + q * (ww + 12) / 3, j + 116, 4)).join('') + line(wx - 10, j + 116, wx + ww + 10, j + 116, 5); }
  if (shopH) { const ac = o.awn || DPAL[seed % 8]; s += rect(x + 14, yb - 160, w - 28, 160, '#cfe8ff', 4, 5) + rect(x + w * .62, yb - 150, w * .22, 150, shade(c, -.3), 4, 5);
    for (let i = 0; i < 6; i++) s += path(`M${x + i * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 196}L${x + (i + 1) * w / 6} ${yb - 160}Q${x + (i + .5) * w / 6} ${yb - 140} ${x + i * w / 6} ${yb - 160}Z`, i % 2 ? '#fff' : ac, 4);
    if (o.sign) s += rect(x + w / 2 - o.sign.length * 11 - 16, yb - 250, o.sign.length * 22 + 32, 44, '#fff8e0', 8, 4) + ftext(x + w / 2, yb - 218, o.sign, { size: 26, fill: ac, stroke: 'none' }); }
  return s; }
const dLampPost = (x, yb, s = 1, on = 0) => G(tr(x, yb, s), (on ? op(.35, circ(0, -470, 70, '#fff6c8', 0)) : '') + rect(-22, -20, 44, 20, '#3a4250', 4, 4) + rect(-8, -440, 16, 420, '#3a4250', 4, 4) + path('M0 -440Q0 -480 50 -480', 'none', 10, '#3a4250') + path('M30 -486L90 -486L80 -456L40 -456Z', '#ffe08a', 4));
const dBench = (x, yb, s = 1) => G(tr(x, yb, s), rect(-120, -110, 240, 22, '#b5835a', 5, 4) + rect(-120, -80, 240, 22, '#b5835a', 5, 4) + rect(-130, -44, 260, 20, '#c8955a', 5, 4) + line(-100, -24, -100, 0, 8) + line(100, -24, 100, 0, 8) + line(-100, -110, -100, -44, 6) + line(100, -110, 100, -44, 6));
const dBike = (x, yb, s = 1, c = '#36a85a') => G(tr(x, yb - 50 * s, s), circ(-70, 0, 48, 'none', 7) + circ(70, 0, 48, 'none', 7) + path('M-70 0L-20 -70L50 -70L70 0M-20 -70L0 0L50 -70M0 0L-70 0', 'none', 7, c) + line(-30, -90, -6, -90, 8) + path('M50 -70L44 -96L66 -100', 'none', 7));
function dCar(x, yb, s = 1, c = '#ff6b6b', flip = 0) { return G(`translate(${f1(x)} ${f1(yb)}) scale(${flip ? -s : s} ${s})`, path('M-200 -40L-200 -100Q-190 -120 -150 -124L-100 -190Q-80 -200 40 -200Q90 -196 120 -124L190 -114Q210 -104 210 -70L210 -40Z', c, 6) + path('M-84 -130L-56 -180L10 -180L10 -130Z', '#cfe8ff', 4) + path('M30 -130L30 -180L80 -180L106 -130Z', '#cfe8ff', 4) + circ(-110, -36, 42, '#3a4250', 6) + circ(-110, -36, 16, '#c8ced6', 4) + circ(120, -36, 42, '#3a4250', 6) + circ(120, -36, 16, '#c8ced6', 4) + rect(186, -98, 22, 16, '#ffe08a', 4, 3)); }
const dBush = (x, yb, s = 1, c = '#5fb85f') => G(tr(x, yb, s), circ(-60, -40, 50, shade(c, -.1), 5) + circ(50, -44, 54, shade(c, -.05), 5) + circ(0, -70, 64, c, 5) + rect(-110, -12, 220, 12, c, 0, 0));
function dFlowers(x, yb, n = 5, seed = 2, t = 0) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const fx = x + i * 34 + r() * 10, h = 40 + r() * 30, sw = wave(t, .6, 4, i); s += line(fx, yb, fx + sw, yb - h, 5, '#4fa64f') + circ(fx + sw, yb - h, 14, DPAL[Math.floor(r() * 8)], 4) + circ(fx + sw, yb - h, 5, '#ffd23f', 0); } return s; }
const dPine = (x, yb, s = 1, t = 0) => G(tr(x, yb, s, wave(t, .3, 1.5, x)), rect(-16, -60, 32, 60, '#8a5a3a', 6, 5) + path('M-90 -60L0 -200L90 -60Z', '#3f9a5a', 5) + path('M-74 -150L0 -280L74 -150Z', '#4fa66a', 5) + path('M-56 -240L0 -350L56 -240Z', '#5fb87a', 5));
const dFence = (x0, x1, yb, c = '#fff') => { let s = rect(x0, yb - 90, x1 - x0, 14, c, 3, 4) + rect(x0, yb - 46, x1 - x0, 14, c, 3, 4); for (let x = x0; x < x1; x += 46) s += path(`M${x} ${yb}L${x} ${yb - 110}L${x + 14} ${yb - 128}L${x + 28} ${yb - 110}L${x + 28} ${yb}Z`, c, 4); return s; };
const dSign = (x, yb, str, c = '#5b8fd8', s = 1) => G(tr(x, yb, s), rect(-8, -300, 16, 300, '#8a8f99', 4, 4) + rect(-110, -380, 220, 90, c, 12, 5) + ftext(0, -322, str, { size: 34, fill: '#fff', stroke: 'none' }));
const dBalloon = (x, y, c, t, ph = 0, s = 1) => { const bx = x + wave(t, .5, 10, ph), by = y + wave(t, .7, 12, ph + 1); return path(`M${f1(bx)} ${f1(by + 70 * s)}Q${f1(bx + 20)} ${f1(by + 160 * s)} ${f1(bx - 6)} ${f1(by + 260 * s)}`, 'none', 3) + G(tr(bx, by, s), ell(0, 0, 52, 64, c, 5) + path('M-8 62L8 62L0 74Z', c, 4) + ell(-18, -24, 10, 16, 'rgba(255,255,255,.6)', 0)); };
const dSpeaker = (x, yb, s = 1, t = 0) => { const p = 1 + .08 * Math.max(0, Math.sin(t * 13)); return G(tr(x, yb, s), rect(-90, -340, 180, 340, '#241830', 14, 6) + circ(0, -240, 52 * p, '#3a2a4a', 5) + circ(0, -240, 18, '#5ec4f0', 4) + circ(0, -100, 66 * p, '#3a2a4a', 5) + circ(0, -100, 22, '#ff5c8a', 4)); };
const dNeon = (x, y, str, c, t, size = 54) => { const on = Math.sin(t * 7) > -.6 || Math.sin(t * 23) > .2; return op(on ? 1 : .35, ftext(x, y, str, { size, fill: 'none', stroke: c, sw: 6 }) + (on ? op(.35, glow(x, y - size * .3, size * 1.6, c, .5)) : '')); };
const dStreamers = (t, y = -20, n = 9) => { let s = ''; for (let i = 0; i < n; i++) { const x = -40 + i * 140, l = 120 + (i * 53) % 90; s += path(`M${x} ${y}Q${x + 20 + wave(t, .9, 12, i)} ${y + l * .5} ${x + wave(t, .9, 18, i + 1)} ${y + l}`, 'none', 10, DPAL[i % 8]); } return s; };
// premier plan flou (coins bas, sous la zone sous-titres) — ajouté par plan via FG plus bas
function fgLayer(kind, t) { let s = '';
  if (kind === 'street') s = dBush(-40, 1980, 2.2, '#4f9a4f') + G(tr(1110, 1960, 2), rect(-30, -260, 60, 260, '#3a4250', 10, 6) + circ(0, -270, 40, '#3a4250', 6));
  if (kind === 'school') s = dBush(-20, 1990, 2.4, '#5aa65a') + dBag(1060, 1990, 2.4, '#5b8fd8', -14);
  if (kind === 'room') s = dPot(-10, 2000, 2.6, t, 2, '#5b8fd8') + dBox(1090, 1990, 2.2, 'JOUETS');
  if (kind === 'class') s = G(tr(-60, 2060, 2.4), rect(-200, -200, 400, 40, '#c58e55', 6, 6) + rect(-180, -160, 360, 200, '#b07a45', 4, 6)) + dGlobe(1080, 1980, 2.2, t);
  if (kind === 'hall') s = dBin(-10, 1990, 2.4, '#36a85a') + dBag(1080, 1990, 2.2, '#ff9a4d', 12);
  if (kind === 'bath') s = G(tr(-30, 1990, 2.4), rect(-60, -200, 120, 200, '#ff8fb1', 30, 6) + rect(-26, -250, 52, 60, '#fff', 10, 5)) + G(tr(1090, 1990, 2.6), ell(0, -50, 70, 50, '#ffd23f', 6) + circ(30, -110, 36, '#ffd23f', 6) + path('M60 -110L90 -100L60 -94Z', '#ff9a4d', 4));
  if (kind === 'bed') s = dTeddy(-10, 2000, 2.6) + dLamp(1110, 2040, 1.6, 0, t, '#8a6ad8');
  if (kind === 'stage') s = G(tr(-60, 2060, 1.8), circ(0, -150, 120, '#120a18', 0) + ell(0, 0, 170, 140, '#120a18', 0)) + G(tr(1140, 2060, 1.8), circ(0, -150, 120, '#120a18', 0) + ell(0, 0, 170, 140, '#120a18', 0));
  if (kind === 'party') s = G(tr(-20, 1990, 2.4), rect(-60, -180, 120, 180, '#ff5c8a', 14, 6) + ell(0, -180, 60, 18, '#ffd23f', 5)) + G(tr(1100, 1990, 2.6), circ(0, -150, 120, '#1c1030', 0) + ell(0, 0, 170, 140, '#1c1030', 0));
  if (kind === 'gallery') s = G(tr(-30, 1990, 2.6), circ(0, -150, 110, '#3a3040', 0) + ell(0, 0, 170, 140, '#5b4a6e', 0)) + G(tr(1080, 2000, 2.2), rect(-12, -260, 24, 260, '#d9a441', 6, 5) + circ(0, -270, 30, '#d9a441', 5));
  return s ? blur(9, s) : ''; }

const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + circ(930, 150, 60, '#fff3b0', 0) + op(.35, circ(930, 150, 100, '#fff3b0', 0)) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff') + cloud(((t * 12 + 1200) % 1800) - 300, 120, .7, 'rgba(255,255,255,.85)') + dBirds(t, 3, 280);
function tree(x, y, s, t) { return G(tr(x, y, s, wave(t, .3, 2, x)), rect(-24, -260, 48, 260, '#8a5a3a', 10) + circ(0, -330, 150, '#5fb85f') + circ(-90, -260, 100, '#4fa64f') + circ(90, -270, 110, '#6cc46c') + circ(-40, -380, 14, '#e2463a', 4) + circ(60, -300, 14, '#e2463a', 4) + circ(-80, -240, 12, '#e2463a', 4)); }
function kidsBg(t, y = 1150, n = 4, s = .45) { let r = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; r += kid(i + 1, { x, y, s, expr: 'happy', walk: 3, flip: i % 2 }, t); } return r; }
function schoolBuilding(x, yb, w, h, t) { let s = path(`M${x - 30} ${yb - h}L${x + w / 2} ${yb - h - 130}L${x + w + 30} ${yb - h}Z`, '#d9534f', 6) + rect(x, yb - h, w, h, '#f0d9b5', 4, 6);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) { if (j === 2 && (i === 1 || i === 2)) continue; const wx = x + 40 + i * (w - 60) / 4, wy = yb - h + 50 + j * 150; s += rect(wx, wy, (w - 60) / 4 - 30, 90, '#cfe8ff', 4, 5) + circ(wx + 20, wy + 60, 12, DPAL[(i + j) % 8], 0) + path(`M${wx + 40} ${wy + 70}L${wx + 52} ${wy + 46}L${wx + 64} ${wy + 70}`, DPAL[(i + j + 3) % 8], 0) + line(wx, wy + 45, wx + (w - 60) / 4 - 30, wy + 45, 4); }
  s += rect(x + w / 2 - 80, yb - 200, 160, 200, '#3e7cc0', 8, 6) + line(x + w / 2, yb - 200, x + w / 2, yb, 5) + rect(x + w / 2 - 130, yb - 270, 260, 56, '#fff8e0', 10, 5) + ftext(x + w / 2, yb - 230, 'ÉCOLE', { size: 36, fill: '#d9534f', stroke: 'none' }) + wallClock(x + w / 2, yb - h - 50, 40, t);
  const fx = x + w - 40, fy = yb - h - 160; s += line(fx, yb - h, fx, fy, 6) + path(`M${fx} ${fy}Q${fx + 40} ${fy - 10 + wave(t, 2, 8)} ${fx + 80} ${fy + wave(t, 2, 10, .5)}L${fx + 80} ${fy + 50 + wave(t, 2, 10, .5)}Q${fx + 40} ${fy + 40 + wave(t, 2, 8)} ${fx} ${fy + 50}Z`, '#5b8fd8', 4);
  return s; }
function schoolyard(t) { const yb = 1180;
  return SKY(t) + op(.8, dSkyline(1120, '#c3d6e4', 3)) + circ(-20, 1080, 90, '#9ccf8a', 0) + circ(1020, 1060, 110, '#9ccf8a', 0) + dHaze(.15) +
    schoolBuilding(-120, yb, 640, 560, t) + dBuilding(560, yb, 700, 470, '#e8c9a0', 4, t, { shop: false }) + dFence(-M, W + M, yb, '#fff') +
    rect(-M, yb, W + 2 * M, 1500, '#c9b8a0', 0, 0) + line(-M, yb, W + M, yb, 7, '#a8987f') +
    [0, 1, 2, 3, 4].map(i => rect(CX - 60 + (i % 2) * 0, 1300 + i * 70, 120, 64, 'none', 4, 5, '#fff')).join('') + ftext(CX, 1660, '★', { size: 60, fill: '#fff', stroke: 'none' }) +
    G(tr(40, yb), rect(-8, -480, 16, 480, '#7d848c', 4, 4) + rect(-90, -520, 120, 80, '#fff', 6, 5) + circ(-40, -436, 30, 'none', 5, '#e2463a')) +
    dBench(260, 1230, .8) + dBush(700, 1200, .8) + dFlowers(780, 1225, 6, 3, t) + tree(950, 1200, .9, t) + dPine(1060, 1200, .7, t) + dBin(470, 1225, .6, '#36a85a') + dBall(620, 1290, .7, t) + dBag(160, 1290, .6, '#ff8fb1', -8) +
    kidsBg(t, 1230, 3); }
function classroomT(t, inner = '') { const yb = 1250;
  let s = dWall('stripe', '#fff1d6', '#ffe8c2', yb) + rect(-M, 960, W + 2 * M, yb - 960, '#d9b88c', 0, 0) + line(-M, 960, W + M, 960, 6, '#b8956a') + dBase(yb, '#a0784e');
  for (let i = 0; i < 8; i++) { const x = 100 + i * 105, y = 160 + Math.sin(i * .7) * 10 + wave(t, .8, 3, i); s += G(tr(x, y, 1, wave(t, .8, 5, i)), rect(-34, -40, 68, 70, DPAL[i % 8], 6, 4) + ftext(0, 14, 'ABCDEFGH'[i], { size: 36, fill: '#fff', stroke: 'none' })); }
  s += path('M40 120Q470 160 900 120', 'none', 4) + rect(60, 250, 960, 560, '#8a6a4a', 18) + rect(80, 270, 920, 520, '#456b55', 10, 0) + op(.15, path('M120 300Q400 340 700 300M150 700Q500 650 900 720', 'none', 12, '#fff')) + inner + rect(120, 790, 840, 18, '#8a6a4a', 6, 4) + rect(180, 774, 50, 18, '#fff', 4, 3) + rect(260, 776, 70, 16, '#ff8fb1', 4, 3) + rect(780, 770, 90, 22, '#3a3a3a', 4, 3);
  s += wallClock(960, 170, 60, t) + windowFrame(-200, 300, 220, 420) + dCurtain(-60, 290, 90, 450, '#ff8fb1', t, -1);
  s += dShelf(-20, 1000, 200, dBooks(-10, 1000, 180, 4)) + dPoster(1040, 600, 90, 300, '#7aa6d8', 4, ftext(0, 0, '1+1', { size: 34, fill: '#fff', stroke: 'none' }), t) + dOutlet(1010, 1170) + dSwitch(40, 900);
  for (let i = 0; i < 4; i++) s += circ(380 + i * 110, 880, 9, '#7d848c', 3) + (i % 2 ? dBag(380 + i * 110, 1010, .5, DPAL[i + 1]) : '');
  return s + dParquet(yb, '#c49a6c') + dBin(1010, 1300, .7) + dPot(60, 1290, .9, t, 1) + dRug(CX, 1520, 700, 140, '#7aa6d8', '#ffd23f'); }
function hallway(t) { const yb = 1250; let s = dWall('diamond', '#d6ecf7', '#c4e0ef', yb) + rect(-M, 600, W + 2 * M, 20, '#9fc6dc', 0, 0);
  for (let i = 0; i < 4; i++) { const x = 40 + i * 290, fl = i === 2 && Math.sin(t * 17) > .3; s += rect(x, 40, 200, 26, fl ? '#9aa8b5' : '#fffbe6', 12, 5) + (fl ? '' : op(.18, path(`M${x} 66L${x + 200} 66L${x + 260} 300L${x - 60} 300Z`, '#fffbe6', 0))); }
  s += rect(70, 300, 400, 260, '#c8955a', 10, 6) + rect(86, 316, 368, 228, '#e8c690', 4, 0) + [[130, 350, '#fff', -4], [250, 340, '#ffe066', 3], [360, 360, '#ff8fb1', -2], [160, 450, '#7be07b', 5], [300, 440, '#fff', -6]].map(([x, y, c, r]) => G(tr(x + 40, y + 40, 1, r + wave(t, 1.3, 1.5, x)), rect(-44, -44, 88, 80, c, 3, 3) + line(-30, -20, 30, -20, 3, '#9aa') + line(-30, 0, 20, 0, 3, '#9aa') + circ(0, -40, 7, '#e2463a', 3))).join('');
  s += dPoster(600, 420, 150, 200, '#ff9a4d', 3, ftext(0, -30, 'CANTINE', { size: 26, fill: '#fff', stroke: 'none' }) + circ(0, 30, 40, '#fff', 4) + ell(0, 30, 24, 10, '#e2463a', 0), t) + dPoster(800, 420, 140, 200, '#36a85a', -3, ftext(0, -40, 'CHUT !', { size: 30, fill: '#fff', stroke: 'none' }) + circ(0, 30, 36, '#f2c9a0', 4) + line(0, 0, 0, 56, 8, '#f2c9a0'), t) + rect(940, 300, 150, 60, '#2fa84f', 8, 5) + ftext(1015, 342, 'SORTIE', { size: 30, fill: '#fff', stroke: 'none' }) + wallClock(1000, 470, 46, t);
  for (let i = -2; i < 12; i++) { const x = i * 130 - 60; s += rect(x, 640, 124, 610, ['#ff8fb1', '#5ec4f0', '#ffd23f', '#7be07b'][(i + 4) % 4], 8) + rect(x + 20, 690, 84, 16, 'rgba(0,0,0,.25)', 4, 0) + rect(x + 20, 720, 84, 16, 'rgba(0,0,0,.25)', 4, 0) + circ(x + 100, 960, 9, '#fff', 3) + rect(x + 44, 760, 36, 26, '#fff', 4, 3) + ftext(x + 62, 780, `${12 + i}`, { size: 18, fill: OL, stroke: 'none' }) + (i % 3 === 0 ? G(tr(x + 60, 860, 1, -10), circ(0, 0, 22, DPAL[(i + 9) % 8], 3) + ftext(0, 8, '★', { size: 22, fill: '#fff', stroke: 'none' })) : ''); }
  return s + extinguisher(1060, 1100, .5) + dTileFloor(yb, '#e3d5bb', '#d4c3a3') + op(.25, rect(-M, yb + 6, W + 2 * M, 30, '#fff', 0, 0)) + dBag(120, 1330, .7, '#5b8fd8', -10) + dBall(980, 1320, .7, t, '#ff9a4d') + dShoes(300, 1360, .6, '#e2463a'); }
function bathroomT(t) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#cfeaf0', 0, 0); for (let x = -M; x < W + M; x += 120) s += line(x, -M, x, H + M, 4, '#b2d6de'); for (let y = -M; y < H + M; y += 120) s += line(-M, y, W + M, y, 4, '#b2d6de');
  for (let x = -M; x < W + M; x += 120) s += rect(x, 190, 120, 60, ((x / 120) % 2 + 2) % 2 ? '#7fd3e6' : '#ffd23f', 0, 0); s += line(-M, 190, W + M, 190, 4, '#9cc8d2') + line(-M, 250, W + M, 250, 4, '#9cc8d2');
  s += rect(250, 120, 580, 44, '#e8eef0', 22, 5) + [0, 1, 2, 3].map(i => op(.6 + .3 * Math.sin(t * 3 + i), circ(320 + i * 145, 142, 18, '#fff6c8', 4))).join('');
  s += mirror(170, 280, 740, 860) + rect(770, 320, 80, 70, '#ffe066', 3, 3) + rect(700, 330, 70, 60, '#ff8fb1', 3, 3);
  s += line(-10, 520, 120, 520, 10, '#c8ced6') + towel(10, 520, 100, 300, '#ff8fb1', '#fff') + dShelf(940, 640, 150, dJar(980, 640, '#7be07b') + rect(1020, 560, 40, 80, '#5ec4f0', 10, 4) + rect(1028, 540, 24, 22, '#fff', 4, 3)) + dShelf(940, 900, 150, dPot(1010, 900, .6, t, 2, '#fff')) + dOutlet(60, 1000);
  s += rect(-M, 1250, W + 2 * M, 1400, '#e8eef0', 0, 0) + line(-M, 1250, W + M, 1250, 7, '#b8c4c8') + path(`M${CX - 300} 1250L${CX + 300} 1250Q${CX + 280} 1420 ${CX} 1430Q${CX - 280} 1420 ${CX - 300} 1250Z`, '#fff');
  s += rect(CX - 20, 1170, 40, 80, '#c8ced6', 8, 5) + path(`M${CX - 20} 1180L${CX - 20} 1150Q${CX - 20} 1130 ${CX + 30} 1130L${CX + 60} 1130L${CX + 60} 1160`, 'none', 14, '#c8ced6') + (() => { const k = (t * 1.3) % 1; return circ(CX + 60, 1170 + k * 120, 8, '#9fd6ff', 3); })();
  s += G(tr(170, 1250), rect(-36, -110, 72, 110, '#7fd3e6', 14, 5) + line(-10, -110, -16, -170, 7, '#ff8fb1') + line(12, -110, 22, -176, 7, '#5ec4f0')) + G(tr(900, 1250), rect(-40, -120, 80, 120, '#fff', 20, 5) + rect(-10, -150, 20, 30, '#c8ced6', 4, 4) + path('M10 -150L46 -150', 'none', 8, '#c8ced6')) + G(tr(990, 1250 + wave(t, 1.2, 3)), ell(0, -30, 44, 30, '#ffd23f', 5) + circ(24, -70, 24, '#ffd23f', 5) + path('M44 -72L66 -66L44 -60Z', '#ff9a4d', 3) + circ(30, -76, 4, OL, 0));
  return s; }
function stageT(t, screen = '') { let s = grad('#3a1d3e', '#1c0e22', -M, -M, W + 2 * M, H + 2 * M) + dWall('star', 'rgba(0,0,0,0)', 'rgba(255,220,160,.12)', 1300) + rect(130, 270, 820, 560, '#0f0a14', 16, 8) + rect(150, 290, 780, 520, '#fdf6ea', 8, 0) + screen;
  s += rect(-M, 175, W + 2 * M, 22, '#4a4a55', 4, 5); for (let i = 0; i < 5; i++) { const x = 120 + i * 210, a = wave(t, .5, 10, i); s += G(tr(x, 197, 1, a), rect(-22, 0, 44, 60, '#2b2b33', 8, 5) + circ(0, 64, 18, i % 2 ? '#ffe08a' : '#ff8fb1', 4)); }
  for (const sd of [-1, 1]) { let c = ''; for (let i = 0; i < 4; i++) c += path(`M${i * 45} -100Q${i * 45 + 25 + wave(t, .4, 6, i)} 700 ${i * 45 + 5} 1400`, 'none', 10, '#7a1426'); s += G(sd < 0 ? tr(-60, 0) : `translate(${W + 60} 0) scale(-1 1)`, path('M-100 -100L200 -100Q150 600 230 1400L-100 1400Z', '#b81f3a', 7) + c + path('M150 700Q230 720 210 780', 'none', 12, '#ffd23f') + circ(205, 790, 14, '#ffd23f', 4)); }
  s += path('M-100 -100L1180 -100L1180 120Q900 180 540 140Q180 180 -100 120Z', '#b81f3a', 7) + [0, 1, 2, 3, 4, 5, 6].map(i => circ(80 + i * 150, 140 + Math.sin(i) * 8, 10, '#ffd23f', 3)).join('');
  s += op(.22, path(`M${360 + wave(t, .2, 30)} 120L${140} 1450L${600} 1450Z`, '#fff6c8', 0)) + op(.14, path(`M${760 - wave(t, .25, 40)} 120L${520} 1450L${1000} 1450Z`, '#ffb3c8', 0));
  s += G(tr(930, 1300), line(0, 0, 0, -300, 7, '#555') + path('M-50 0L50 0', 'none', 8, '#555') + G(tr(0, -310, 1, -20), rect(-14, -40, 28, 50, '#333', 12, 4))) + dPot(70, 1300, .8, t, 0, '#b81f3a') + dPot(1010, 1300, .8, t, 2, '#b81f3a') + G(tr(150, 1300), rect(-40, -120, 80, 16, '#8a5a3a', 4, 4) + line(-30, -104, -36, 0, 6) + line(30, -104, 36, 0, 6));
  s += rect(-M, 1300, W + 2 * M, 900, '#6b3e26', 0, 0) + [0, 1, 2, 3].map(i => line(-M, 1330 + i * 40, W + M, 1330 + i * 40, 3, '#5a3320')).join('') + line(-M, 1300, W + M, 1300, 10, '#4a2a18') + rect(-M, 1480, W + 2 * M, 40, '#3a2010', 0, 0);
  for (let i = 0; i < 9; i++) s += ell(-40 + i * 145, 1480, 30, 14, '#ffe08a', 4) + op(.25, circ(-40 + i * 145, 1470, 40, '#fff6c8', 0));
  for (let i = 0; i < 7; i++) { const bx = 80 + i * 160, by = 1760 + wave(t, .7, 6, i * .3); s += circ(bx, by, 120, '#140a18', 0) + ell(bx, 1900, 150, 120, '#140a18', 0) + (i % 2 ? path(`M${bx - 60} ${by - 110}Q${bx} ${by - 150} ${bx + 60} ${by - 110}`, 'none', 14, '#241430') : '') + (i === 2 || i === 5 ? G(tr(bx + 70, by - 150, 1, 10), rect(-24, -40, 48, 80, '#222', 8, 4) + rect(-18, -32, 36, 62, Math.sin(t * 3 + i) > 0 ? '#bfe3ff' : '#fff6c8', 4, 0)) : ''); }
  return s; }
function bedroomN(t, lamp = 0) { const yb = 1250; let s = dWall('star', '#1d2350', '#2e3a80', yb) + rect(-M, 900, W + 2 * M, yb - 900, '#262c5e', 0, 0) + line(-M, 900, W + M, 900, 5, '#3a4290');
  s += dWindowView(620, 230, 360, 420, t, { night: true }); for (let i = 0; i < 6; i++) s += sparkle(650 + (i * 67) % 300, 270 + (i * 113) % 200, .18 + .1 * Math.sin(t * 3 + i), '#fff6d6');
  s += dCurtain(560, 210, 110, 480, '#5a3a8a', t, 1) + dCurtain(930, 210, 110, 480, '#5a3a8a', t, -1);
  s += rect(90, 300, 230, 300, '#ff8fb1', 10) + ftext(205, 470, '★', { size: 120, fill: '#fff', stroke: 'none' }) + dFrame(400, 380, 120, 150, 'sea', '#8a6ad8', 3) + dShelf(60, 720, 420, dBooks(80, 720, 180, 7) + dTrophy(310, 720, .9) + dTeddy(410, 720, .7));
  s += G(tr(820, 1260), rect(-260, -260, 40, 300, '#6b4a8a', 10, 6) + rect(-240, -90, 520, 110, '#8a6ad8', 16, 6) + path('M-220 -100Q20 -150 270 -100L280 0L-220 0Z', '#5ec4f0', 6) + path('M-200 -70Q0 -100 260 -70', 'none', 4, '#3a9ac0') + ell(-160, -130, 70, 34, '#fff', 5) + dTeddy(-40, -110, .6, '#ff9a4d'));
  s += G(tr(470, 1250), rect(-70, -150, 140, 150, '#6b4a8a', 8, 5) + line(-60, -75, 60, -75, 4) + rect(-50, -200, 100, 50, '#141a3a', 8, 4) + ftext(0, -164, Math.sin(t * 6) > 0 ? '02:47' : '02 47', { size: 26, fill: '#ff5c8a', stroke: 'none' }) + op(.25, circ(0, -176, 70, '#ff5c8a', 0)));
  s += dOutlet(70, 1100) + dSwitch(1040, 960);
  return s + rect(-M, yb, W + 2 * M, 1400, '#3a3050', 0, 0) + line(-M, yb, W + M, yb, 6, '#2a2240') + dRug(330, 1420, 520, 120, '#5a3a8a', '#ff8fb1') + dShoes(180, 1330, .55, '#ff8fb1') + dBall(940, 1360, .5, 0, '#ffc83d'); }
function streetT(t, n = 3) { const yb = 1250; let s = SKY(t, '#9fd6ff', '#fff1dc') + op(.85, dSkyline(1000, '#bccde0', 5)) + dHaze(.2);
  const signs = ['CAFÉ', '', 'BOULANGERIE', '', 'PHARMACIE', 'FLEURS', '', 'CINÉ'];
  for (let i = -2; i < 6; i++) s += dBuilding(-200 + i * 300, yb, 280, 540 + (i * 137 % 300), ['#e7c9a0', '#cfd8e2', '#f0b8a8', '#bcd7c4'][(i + 4) % 4], i + 10, t, { sign: signs[(i + 8) % 8], awn: DPAL[(i + 8) % 8] });
  s += dHaze(.16, '255,250,240', 1250);
  s += rect(-M, yb, W + 2 * M, 1400, '#c8ccd2', 0, 0) + [0, 1, 2].map(i => line(-M, yb + 20 + i * 26, W + M, yb + 20 + i * 26, 3, '#b0b5bc')).join('') + rect(-M, yb + 90, W + 2 * M, 20, '#8f959d', 0, 0) + rect(-M, yb + 110, W + 2 * M, 1400, '#6e747c', 0, 0) + Array.from({ length: 10 }, (_, i) => rect(-M + i * 300 - ((t * 0) % 300), yb + 300, 160, 18, '#fff', 4, 0)).join('') + line(-M, yb, W + M, yb, 8, '#7d848c');
  s += dLampPost(70, yb, 1) + dLampPost(830, yb, 1) + tree(470, yb, .62, t) + dBench(640, yb, .7) + dBin(950, yb, .6, '#36a85a') + dBike(260, yb + 10, .6, '#ff5c8a') + dSign(1050, yb, 'RUE', '#5b8fd8', .8) + dFlowers(900, yb, 4, 5, t) + dCar(-60, yb + 250, .9, '#5ec4f0') + dCar(1000, yb + 260, .9, '#ffd23f', 1);
  for (let i = 0; i < n; i++) { const x = ((i * 520 + t * (70 + i * 20) * (i % 2 ? -1 : 1)) % 1700 + 1700) % 1700 - 300; s += op(.8, adult(i + 2, { x, y: 1270, s: .5, expr: 'neutral', walk: 3, flip: i % 2 }, t)); }
  return s; }
function galleryT(t) { let s = grad('#f4ecdf', '#e9dcc6', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 60, W + 2 * M, 20, '#d8c6a6', 0, 0);
  for (let i = 0; i < 6; i++) s += rect(-150 + i * 260, 120, 220, 1040, 'none', 6, 4, '#e0cfb2');
  for (let i = 0; i < 5; i++) { const x = 100 + i * 220; s += line(x, 60, x, 100, 5) + G(tr(x, 100, 1, 20 * Math.sin(t * .8 + i)), rect(-20, 0, 40, 46, '#3a3a44', 8, 4)); }
  s += rect(-M, 1180, W + 2 * M, 80, '#c9b08a', 0, 0); for (let i = 0; i < 3; i++) s += op(.25 + .05 * Math.sin(t * 2 + i), path(`M${200 + i * 340} 140L${80 + i * 340} 1200L${320 + i * 340} 1200Z`, '#fff6c8', 0));
  s += G(tr(1050, 280, 1, -25 + 25 * Math.sin(t * .9)), rect(-30, -20, 60, 40, '#ddd', 6, 4) + circ(-30, 0, 10, '#e2463a', 0)) + line(1050, 240, 1080, 200, 5);
  s += [300, 780].map(x => rect(x - 70, 1196, 140, 40, '#fff8e0', 4, 3) + line(x - 50, 1210, x + 40, 1210, 3, '#9a8a7a') + line(x - 50, 1224, x + 20, 1224, 3, '#9a8a7a')).join('');
  s += rect(-M, 1260, W + 2 * M, 900, '#a0703f', 0, 0) + Array.from({ length: 12 }, (_, i) => line(-M + i * 220, 1260, -M + i * 220 - 120, H + M, 5, '#8a5c30')).join('');
  for (let i = 0; i < 4; i++) { const x = 120 + i * 280; s += rect(x - 10, 1180, 20, 160, '#d9a441', 6, 4) + circ(x, 1176, 18, '#d9a441', 4) + (i < 3 ? path(`M${x} 1200Q${x + 140} 1270 ${x + 280} 1200`, 'none', 12, '#b8253a') : ''); }
  s += G(tr(1000, 1300), rect(-60, -200, 120, 200, '#fff', 4, 5) + circ(0, -250, 44, '#e8e2d8', 5) + path('M-40 -206Q0 -230 40 -206', '#e8e2d8', 5)) + dBench(CX, 1500, 1.1) + dPot(40, 1290, .9, t, 1) +
    op(.75, adult(4, { x: ((t * 50) % 1500) - 200, y: 1330, s: .55, expr: 'smug', walk: 2 }, t));
  return s; }
function discoBall(x, y, s, t) { let g = circ(0, 0, 90, '#c9d3dc', 7); for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) { if (i * i + j * j > 10) continue; const lit = Math.sin(t * 6 + i * 1.7 + j * 2.3) > .4; g += rect(i * 24 - 10, j * 24 - 10, 20, 20, lit ? '#fff' : '#9aa8b5', 3, 0); } return G(tr(x, y, s), line(0, -400, 0, -90, 6) + g); }
function partyT(t, o = {}) { let s = grad('#3a1a5c', '#170b2a', -M, -M, W + 2 * M, H + 2 * M) + dWall('dot', 'rgba(0,0,0,0)', 'rgba(255,255,255,.05)', 1300); const cols = ['#ff5c8a', '#5ec4f0', '#ffd23f', '#7be07b'];
  s += dWindowView(-120, 640, 220, 300, t, { night: true }) + dWindowView(980, 640, 220, 300, t, { night: true }) + dNeon(940, 1010, 'PARTY', '#ff5c8a', t, 48);
  for (let i = 0; i < 4; i++) { const a = Math.sin(t * .9 + i * 1.6) * 30; s += op(.16, G(tr(150 + i * 260, -50, 1, a), path('M-30 0L30 0L260 1500L-260 1500Z', cols[i], 0))); }
  s += dStreamers(t, -20, 9);
  let gd = 'M-60 300'; for (let i = 0; i < 12; i++) gd += `Q${-60 + i * 110 + 55} ${360} ${-60 + (i + 1) * 110} 300`; s += path(gd, 'none', 5, '#2b2420');
  for (let i = 0; i < 12; i++) s += circ(-5 + i * 110, 338, 14, Math.sin(t * 5 + i * 1.3) > 0 ? cols[i % 4] : '#4a3a5a', 4);
  s += discoBall(CX, 160, .9, t) + dBalloon(70, 520, '#ff5c8a', t, 0, .8) + dBalloon(150, 590, '#ffd23f', t, 1, .7) + dBalloon(960, 540, '#5ec4f0', t, 2, .8) + dBalloon(1030, 610, '#7be07b', t, 3, .7);
  s += G(tr(820, 1300), rect(-150, -150, 300, 24, '#ff9a4d', 6, 5) + line(-130, -126, -130, 0, 8) + line(130, -126, 130, 0, 8) + [-100, -40, 30, 90].map((x, i) => i % 2 ? rect(x - 14, -196, 28, 46, '#e2463a', 4, 4) : ell(x, -164, 36, 14, '#ffd23f', 4)).join(''));
  s += dSpeaker(40, 1310, .9, t) + dSpeaker(1040, 1310, .9, t);
  if (o.dancers !== false) for (let i = 0; i < 5; i++) { const x = 60 + i * 240 + (o.part || 0) * (i < 2 ? -260 : i > 2 ? 260 : 0); s += op(.75, person({ age: 'adult', x, y: 1330 + (i % 2) * 40, s: .62, skin: '#4a2f5e', shirt: '#2e1a46', pants: '#1c1030', hair: KH[i], hairColor: '#1c1030', face: { eyes: 'closed', mouth: 'grin' }, armL: [200 + wave(t, 1.2, 40, i * .2), 250], armR: [-20 - wave(t, 1.2, 40, i * .2 + .5), -70], bob: 3, seed: 80 + i }, t * 1.6)); }
  s += rect(-M, 1300, W + 2 * M, 900, '#1c0f2e', 0, 0); for (let i = 0; i < 8; i++) s += rect(-80 + i * 160, 1320, 150, 70, Math.sin(t * 4 + i * 2) > 0 ? 'rgba(255,92,138,.35)' : 'rgba(94,196,240,.25)', 6, 0);
  for (let i = 0; i < 14; i++) s += rect((i * 97) % 1080, 1420 + (i * 53) % 300, 16, 26, DPAL[i % 8], 3, 0);
  return s; }
// B005 : chambre de jour, anniversaire
function kidRoomDay(t) { const yb = 1250; let s = dWall('stripe', '#ffe6c8', '#ffdcb6', yb) + dBase(yb, '#fff');
  let fl = ''; const L = 'JOYEUX ANNIV'; for (let i = 0; i < L.length; i++) { const x = 70 + i * 80, y = 200 + Math.sin(i / (L.length - 1) * Math.PI) * 50 + wave(t, 1, 3, i); fl += G(tr(x, y, 1, wave(t, 1, 5, i)), path('M-34 0L34 0L0 70Z', DPAL[i % 8], 4) + ftext(0, 34, L[i], { size: 26, fill: '#fff', stroke: 'none' })); } s += path('M30 190Q500 290 980 190', 'none', 4) + fl;
  s += dWindowView(660, 320, 300, 340, t) + dCurtain(600, 300, 100, 420, '#7be07b', t, 1) + dCurtain(920, 300, 100, 420, '#7be07b', t, -1);
  s += dShelf(60, 720, 380, dBooks(80, 720, 150, 9) + dTeddy(290, 720, .8) + dJar(380, 720, '#ff8fb1', .9)) + dFrame(170, 520, 160, 130, 'heart', '#ff9a4d', -3) + dPoster(400, 500, 140, 190, '#5ec4f0', 4, circ(0, -10, 40, '#ffd23f', 4) + path('M-50 70L-20 30L10 60L30 40L50 70Z', '#fff', 0), t);
  s += dBalloon(70, 560, '#ff5c8a', t, 0, .8) + dBalloon(1010, 780, '#5ec4f0', t, 2, .8) + dOutlet(560, 1180) + dLamp(1030, 1260, .9, 1, t, '#ff8fb1');
  return s + dParquet(yb, '#c49a6c') + dRug(560, 1440, 700, 150, '#ff8fb1', '#ffd23f') + dGift(570, 1330, .7) + dGift(1000, 1340, .6, '#ff8fb1', '#7be07b') + dBall(150, 1330, .6, t, '#5b8fd8') + dShoes(320, 1700, .7, '#e2463a'); }

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


// ---------- décors propres à l'épisode (riches : 15–30 éléments, 3 couches, 2–3 éléments animés) ----------
const laptopA = (x, y, s, t) => G(tr(x, y, s), op(.25, ell(0, -120, 260, 160, '#bfe3ff', 0)) + rect(-170, -230, 340, 220, '#2b2b33', 14, 5) + rect(-150, -212, 300, 184, '#bfe3ff', 6, 0) + rect(-130, -190, 120, 70, '#ff8fb1', 4, 0) + line(10, -180, 120, -180, 8, '#fff') + line(10, -150, 100, -150, 8, '#fff') + op(.5 + .3 * Math.sin(t * 3), rect(-130, -100, 250, 40, '#fff', 4, 0)) + path('M-200 0L200 0L220 20L-220 20Z', '#9aa3ad', 5));
const pencilCup = (x, y) => G(tr(x, y), line(-6, -60, -12, -96, 6, '#e2463a') + line(6, -60, 12, -92, 6, '#ffd23f') + line(0, -60, 0, -100, 6, '#5b8fd8') + rect(-18, -64, 36, 64, '#7aa6d8', 8, 4));
// chambre d'adulte (jour)
function roomA(t, o = {}) { const yb = 1250;
  let s = dWall('dot', '#e7f0ff', '#d3e2fa', yb) + dBase(yb, '#fff');
  s += dWindowView(620, 250, 360, 400, t) + dCurtain(560, 230, 110, 470, '#ff9a4d', t, 1) + dCurtain(930, 230, 110, 470, '#ff9a4d', t, -1);
  s += dPoster(130, 330, 170, 230, '#36c5b4', -4, ftext(0, 22, '♫', { size: 100, fill: '#fff', stroke: 'none' }), t) + dFrame(330, 300, 130, 110, 'mount', '#c38a52', 3) + dFrame(350, 460, 110, 130, 'sea', '#8a6ad8', -2) + wallClock(470, 190, 46, t);
  s += dShelf(40, 660, 420, dBooks(60, 660, 200, 3) + dPot(320, 660, .5, t, 2, '#ff8fb1') + dTrophy(410, 660, .7));
  s += dOutlet(80, 1150) + dSwitch(540, 760);
  s += G(tr(800, 1250), rect(-230, -330, 460, 30, '#c58e55', 6, 5) + rect(-210, -300, 30, 300, '#b07a45', 4, 5) + rect(180, -300, 30, 300, '#b07a45', 4, 5) + rect(40, -300, 140, 160, '#b07a45', 4, 5) + line(50, -220, 170, -220, 4) + circ(110, -250, 6, OL, 0) + circ(110, -180, 6, OL, 0));
  s += laptopA(790, 920, .55, t) + dDeskLamp(960, 920, .8, t) + dMug(650, 920, .9, t) + pencilCup(700, 920);
  s += G(tr(220, 1250), rect(-260, -260, 36, 290, '#8a6ad8', 10, 6) + rect(-240, -120, 520, 120, '#a58bea', 14, 6) + path('M-220 -130Q40 -170 290 -130L300 -10L-220 -10Z', '#ffd23f', 6) + path('M-200 -100Q40 -130 280 -100', 'none', 4, '#e0b020') + ell(-160, -150, 70, 32, '#fff', 5) + dTeddy(-60, -130, .55, '#ff9a4d'));
  s += dParquet(yb, '#c49a6c') + dRug(CX, 1450, 640, 140, '#7aa6d8', '#ffd23f') + dShoes(140, 1360, .6, '#e2463a') + dBag(980, 1350, .7, '#5b8fd8', 8) + dBin(560, 1330, .6, '#36a85a') + (o.box ? dBox(860, 1420, 1.1, 'SOUVENIRS') : '');
  return s; }
// salon (canapé, télé, étagères)
function salonA(t, o = {}) { const yb = 1250; let s = dWall('diamond', '#fdeccf', '#f6dcae', yb) + dBase(yb, '#fff');
  s += dWindowView(80, 260, 340, 420, t, { night: o.night }) + dCurtain(20, 240, 110, 480, '#36c5b4', t, 1) + dCurtain(380, 240, 110, 480, '#36c5b4', t, -1);
  s += dFrame(620, 330, 160, 120, 'face', '#c38a52', -2) + dFrame(820, 320, 140, 160, 'heart', '#ff9a4d', 3) + dFrame(720, 500, 120, 100, 'mount', '#8a6ad8', 0) + wallClock(970, 520, 46, t);
  s += dShelf(560, 720, 460, dBooks(580, 720, 220, 6) + dJar(840, 720, '#ffd23f', .8) + dPot(930, 720, .5, t, 0, '#5b8fd8'));
  s += G(tr(260, 1250), rect(-200, -200, 400, 200, '#a0703f', 10, 6) + line(-200, -100, 200, -100, 5) + circ(-100, -150, 8, OL, 0) + circ(100, -150, 8, OL, 0)) + G(tr(260, 1050), rect(-190, -230, 380, 230, '#2b2b33', 14, 6) + rect(-172, -212, 344, 194, Math.sin(t * 5) > 0 ? '#7fd3e6' : '#9fe0ff', 6, 0) + circ(-60, -130, 30, '#ffd23f', 4) + path('M-172 -40L-60 -110L40 -60L172 -140L172 -18L-172 -18Z', '#7be07b', 0));
  s += G(tr(780, 1250), rect(-260, -230, 520, 160, '#ff6b4a', 30, 6) + rect(-290, -130, 580, 110, '#ff8a6b', 26, 6) + rect(-300, -190, 70, 170, '#e85a3c', 26, 6) + rect(230, -190, 70, 170, '#e85a3c', 26, 6) + G(tr(-150, -150, 1, -10), rect(-50, -50, 100, 90, '#ffd23f', 20, 5)) + G(tr(150, -150, 1, 8), rect(-50, -50, 100, 90, '#36c5b4', 20, 5)) + line(-230, -20, -230, 10, 10) + line(230, -20, 230, 10, 10));
  s += dLamp(1040, 1250, 1.1, 1, t, '#ffd23f') + dPot(-10, 1250, 1, t, 1);
  s += dParquet(yb, '#b98a5c') + dRug(CX, 1440, 760, 160, '#8a6ad8', '#ffd23f') + G(tr(CX, 1420), rect(-170, -60, 340, 24, '#a0703f', 8, 5) + line(-140, -36, -140, 30, 8) + line(140, -36, 140, 30, 8)) + dMug(CX - 60, 1360, .8, t) + dMug(CX + 60, 1360, .8, t + 1, '#5ec4f0') + dShoes(160, 1600, .7) + dBall(980, 1560, .6, t, '#5b8fd8');
  return s; }
// cabinet de dermato (écran = intérieur à dessiner centré sur 0,0, zone 780×500)
function cabinetA(t, screen = '') { const yb = 1250; let s = dWall('stripe', '#e6f6f2', '#d6efe9', yb) + dBase(yb, '#fff');
  s += rect(130, 260, 820, 540, '#3a4250', 18, 7) + rect(150, 280, 780, 500, '#fdf6ea', 8, 0) + G(tr(540, 530), screen) + rect(150, 280, 780, 500, 'none', 8, 4) + circ(540, 780, 8, '#5ec4f0', 0);
  s += wallClock(1010, 200, 44, t) + G(tr(70, 380), diploma(0, 0, .42, -3)) + G(tr(70, 560), diploma(0, 0, .42, 2)) + dPoster(1010, 560, 110, 200, '#ff8fb1', 2, circ(0, -30, 34, '#f2c9a0', 4) + circ(-10, -30, 5, '#e59a8c', 0) + circ(12, -22, 5, '#e59a8c', 0) + ftext(0, 60, 'PEAU', { size: 26, fill: '#fff', stroke: 'none' }), t);
  s += dShelf(40, 980, 300, dJar(80, 980, '#ff8fb1', .8) + dJar(150, 980, '#7be07b', .8) + dJar(220, 980, '#ffd23f', .8) + dPot(300, 980, .45, t, 2, '#fff')) + dOutlet(1020, 1150) + dSwitch(400, 900);
  s += G(tr(850, 1250), rect(-200, -150, 400, 40, '#7fd3e6', 16, 6) + rect(-200, -112, 400, 20, '#fff', 6, 4) + line(-170, -110, -170, 0, 10) + line(170, -110, 170, 0, 10) + ell(-150, -160, 50, 16, '#fff', 4));
  s += G(tr(470, 1250), rect(-60, -110, 120, 110, '#e8eef0', 10, 5) + circ(0, -60, 12, '#c8ced6', 4)) + dPot(-20, 1250, 1, t, 0, '#5b8fd8');
  return s + dTileFloor(yb, '#e9f1f3', '#d7e5e9') + dBin(980, 1330, .7, '#ff8fb1') + G(tr(260, 1420), rect(-90, -20, 180, 30, '#5b8fd8', 12, 5) + line(0, 10, 0, 90, 10) + line(-60, 100, 60, 100, 10)); }
// parc (jour ou doré)
function parkA(t, o = {}) { const yb = 1200;
  let s = SKY(t, o.gold ? '#ffc37a' : '#8fd3ff', o.gold ? '#fff1d6' : '#e6f6ff') + op(.7, dSkyline(1060, o.gold ? '#e8c7a8' : '#c3d6e4', 7)) + dHaze(.18, o.gold ? '255,236,210' : '230,240,250');
  s += circ(-60, 1110, 160, '#9ccf8a', 0) + circ(300, 1130, 140, '#a8d896', 0) + circ(800, 1120, 170, '#9ccf8a', 0) + circ(1150, 1110, 150, '#a8d896', 0);
  s += rect(-M, yb, W + 2 * M, 1500, '#8fd16a', 0, 0) + line(-M, yb, W + M, yb, 6, '#6fb04a') + path(`M${CX - 160} ${H + M}Q${CX - 60} 1420 ${CX + 40} ${yb}L${CX + 120} ${yb}Q${CX + 90} 1420 ${CX + 240} ${H + M}Z`, '#e8d6a8', 0);
  s += tree(90, yb + 10, .95, t) + dPine(1010, yb, .8, t) + tree(860, yb - 10, .7, t) + dLampPost(300, yb, .8) + dBench(620, yb + 20, .75) + dBush(470, yb + 20, .7) + dBush(1070, yb + 40, .8, '#4f9a4f') + dSign(180, yb + 30, 'PARC', '#36a85a', .6);
  s += dFlowers(140, yb + 90, 6, 2, t) + dFlowers(760, yb + 80, 5, 4, t) + dBin(730, yb + 30, .55) + dBike(990, yb + 70, .55, '#ff5c8a');
  s += ell(230, 1440, 200, 50, '#7fd3e6', 6) + G(tr(230 + wave(t, .3, 60), 1430), ell(0, -14, 30, 20, '#ffd23f', 4) + circ(20, -36, 14, '#ffd23f', 4) + path('M32 -38L46 -34L32 -30Z', '#ff9a4d', 3) + circ(24, -40, 3, OL, 0));
  for (let i = 0; i < 2; i++) { const x = ((i * 700 + t * (60 + i * 30) * (i % 2 ? -1 : 1)) % 1600 + 1600) % 1600 - 260; s += op(.85, adult(i + 2, { x, y: yb + 40, s: .42, expr: 'happy', walk: 3, flip: i % 2 }, t)); }
  return s; }

// ---------- accessoires ----------
const bottleA = (x, y, s, c, r = 0) => G(tr(x, y, s, r), rect(-26, -110, 52, 110, c, 12, 5) + rect(-14, -140, 28, 32, '#fff', 6, 4) + rect(-18, -80, 36, 40, '#fff', 6, 0) + line(-10, -64, 10, -64, 4, c));
const tubeA = (x, y, s, c, r = 0) => G(tr(x, y, s, r), path('M-30 0L30 0L22 -120L-22 -120Z', c, 5) + rect(-16, -146, 32, 28, '#fff', 6, 4) + line(-14, -60, 14, -60, 5, '#fff'));
const suitcase = (x, y, s, c = '#e2463a') => G(tr(x, y, s), rect(-80, -120, 160, 120, c, 14, 5) + path('M-30 -120L-30 -150L30 -150L30 -120', 'none', 8) + line(-80, -60, 80, -60, 4, shade(c, -.25)) + circ(-50, 6, 10, OL, 0) + circ(50, 6, 10, OL, 0));
function cakeA(x, y, s, t, n = 15, r = 0) { let g = rect(-200, -100, 400, 180, '#ff8fb1', 30) + path('M-200 -60Q-140 -20 -90 -60T10 -60T110 -60T200 -60', 'none', 14, '#fff') + rect(-230, 70, 460, 28, '#fff', 14);
  for (let i = 0; i < Math.min(n, 8); i++) { const cx = -165 + i * 47; g += rect(cx - 7, -170, 14, 70, ['#7aa6d8', '#ffd23f', '#7be07b'][i % 3], 4, 4) + G(tr(cx, -186, 1 + .15 * Math.sin(t * 20 + i)), path('M0 -22Q12 -2 0 8Q-12 -2 0 -22Z', '#ffb340', 3)); }
  return G(tr(x, y, s, r), g + ftext(0, 30, `${n}`, { size: 80, fill: '#fff' })); }
function pauseBtn(x, y, s, t, play = 0) { const k = clamp(play); return G(tr(x, y, s, Math.sin(t * 3) * 4), circ(10, 14, 170, OL, 0) + circ(0, 0, 170, k > .5 ? '#36a85a' : SX.acc, 8) + ell(-60, -90, 50, 24, 'rgba(255,255,255,.4)', 0) +
  (k > .5 ? path('M-50 -90L90 0L-50 90Z', '#fff', 8) : rect(-70, -85, 50, 170, '#fff', 12, 7) + rect(20, -85, 50, 170, '#fff', 12, 7))); }
// coupe de peau : kI = inflammation (bouton en colère qui chauffe), kS = cicatrice (creux qui reste)
function acneCut(t, kI = 1, kS = 0) { const top = -110, bump = 110 * kI * (1 - kS), dip = 70 * kS, cy = top - bump + dip;
  const d = `M-350 ${top}L-140 ${top}C-70 ${top} -70 ${f1(cy)} 0 ${f1(cy)}C70 ${f1(cy)} 70 ${top} 140 ${top}L350 ${top}L350 220L-350 220Z`;
  let s = rect(-350, -230, 700, 450, '#d9f0fb', 0, 0) + path(d, '#f6c9ae', 0) + rect(-350, top + 60, 700, 180, '#ffe1cf', 0, 0) + rect(-350, 120, 700, 100, '#fff1b8', 0, 0);
  for (let i = 0; i < 8; i++) s += circ(-310 + i * 88, 170, 30, '#ffe58a', 4);
  for (let i = 0; i < 5; i++) { const xx = -320 + i * 150; if (kS > .5 && Math.abs(xx + 50) < 120) continue; s += path(`M${xx} ${top + 90}q30 -16 60 0t60 0`, 'none', 5, '#e8a98a'); }
  if (kI > 0 && kS < 1) { const k = kI * (1 - kS); s += op(.75 * k, circ(0, top + 20, 130 * k, '#ff6b6b', 0)) + op(k, flames(-60, top + 60, 120, 120 * k, t, 3)) + G(tr(0, cy + 40, k), path('M-50 -30L-14 -14M50 -30L14 -14', 'none', 8) + circ(-28, 0, 8, OL, 0) + circ(28, 0, 8, OL, 0) + path('M-24 34Q0 18 24 34', 'none', 7)); }
  if (kS > 0) s += op(kS, path(`M-110 ${top}C-60 ${top} -60 ${f1(cy)} 0 ${f1(cy)}C60 ${f1(cy)} 60 ${top} 110 ${top}`, 'none', 10, '#c97a6a') + ell(0, cy + 6, 70, 16, '#e59a8c', 0));
  return s + path(`M-350 ${top}L-140 ${top}C-70 ${top} -70 ${f1(cy)} 0 ${f1(cy)}C70 ${f1(cy)} 70 ${top} 140 ${top}L350 ${top}`, 'none', 7) + rect(-350, -230, 700, 450, 'none', 10, 6); }
// fenêtre de recherche (mémoire)
function searchCard(q, t, tq, tr0) { const n = Math.floor(clamp((t - tq) / .9) * q.length), res = t > tr0;
  return rect(-400, -260, 800, 520, '#fff', 26, 0) + rect(-400, -260, 800, 70, SX.cool, 26, 0) + rect(-400, -220, 800, 30, SX.cool, 0, 0) + [0, 1, 2].map(i => circ(-360 + i * 40, -225, 12, ['#ff6b6b', '#ffd23f', '#7be07b'][i], 4)).join('') + ftext(0, -212, 'MES SOUVENIRS', { size: 32, fill: '#fff', stroke: 'none' }) +
    rect(-340, -150, 680, 90, '#f2f4f7', 45, 5) + circ(-290, -105, 22, 'none', 6) + line(-274, -89, -256, -71, 7) + ftext(-240, -90, q.slice(0, n) + (Math.sin(t * 10) > 0 && !res ? '|' : ''), { size: 44, fill: SX.ink, stroke: 'none', anchor: 'start' }) +
    (res ? ftext(0, 50, '0 RÉSULTAT', { size: 84, fill: SX.acc }) + ftext(0, 130, 'introuvable…', { size: 40, fill: '#7a6a5a', stroke: 'none' }) : ''); }

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, tête de Noah en cut-out, « débloqué » en étoiles sur CICATRICES, titre cinétique, cadre « joue.png »
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const C0 = at(1, 'cicatrices') - .05, A = at(1, 'acne');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 1000, t, C0, { part: 'back', r: 480 }) + G(tr(CX, 1000, 1 + .03 * Math.sin(t * 6)), cutout(noahHead(0, 0, 180, { expr: t > A ? 'worried' : 'happy', lit: t > C0 ? 1 : 0 }, t), 14)) + unlock(CX, 1000, t, C0, { part: 'front', r: 480 }) +
      funBox(CX + 100, 1062, 150, 120, t, A, { label: 'joue.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin('HORRIBLE DE GARDER DES', CX, 415, t, .3, { size: 50 }) + kword("CICATRICES D'ACNÉ ?", CX, 540, t, C0, { size: 66, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'cicatrices') - .05, 'boom', .6], [at(1, 'cicatrices'), 'sparkle', .6], [at(1, 'acne'), 'tick', .6]] });
// B002a — les boutons ont enfin disparu : papier + gobo, les boutons sautent un à un, « BYE BYE »
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const D = at(2, 'disparu'), k = 1 - seg(t, at(2, 'boutons'), D + .2);
    let fly = ''; for (let i = 0; i < 8; i++) { const kk = seg(t, at(2, 'boutons') + i * .12, at(2, 'boutons') + i * .12 + .6); if (kk > 0 && kk < 1) fly += op(1 - kk, circ(CX + Math.cos(i * 2.1) * (180 + 380 * kk), 960 + Math.sin(i * 2.1) * 120 - 500 * kk + 600 * kk * kk, 16, '#ef6f6f', 4)); }
    return paper(SX.paper) + gobo(T, .12) + burst(CX, 960, 330, t, D, '#ffe1b8', 18) + cutout(noahHead(CX, 960, 190, { expr: t > D ? 'ecstatic' : 'effort', scar: 1, acne: k }, t), 12) + fly + popStars(CX, 960, t, D, 8, 320) +
      kthin('tes boutons ont', CX, 360, t, 0, { size: 54, fill: SX.ink }) + funTag(CX, 470, 'ENFIN DISPARU !', t, D - .05, { size: 64, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[at(2, 'boutons'), 'pop', .6], [at(2, 'boutons') + .24, 'pop_hi', .5], [at(2, 'boutons') + .48, 'pop', .5], [at(2, 'disparu') - .05, 'tada', .6], [at(2, 'disparu') + .2, 'sparkle', .5]] });
// B002b — mais le miroir a gardé les preuves : miroir cut-out, cônes « scène de crime » numérotés sur les cicatrices
const S2 = at(2, 'mais') - .15;
B(2, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const P = at(2, 'preuves') - S2, Mi = at(2, 'miroir') - S2; let ev = '';
    [2, 3, 6].forEach((i, j) => { const [x, y] = scarAt(CX, 900, 210, i); ev += funTag(x + (i === 6 ? -40 : 40), y + 40, `${j + 1}`, t, P - .1 + j * .1, { size: 30, bg: SX.acc2, fg: SX.ink, r: 0 }); });
    return gridBg('#2a2440') + halftoneFade('#fff', .05, 1) + cutout(mirror(250, 560, 580, 680), 10) + noahHead(CX, 900, 210, { expr: t > P ? 'jawdrop' : 'worried', lit: .6 }, t) + markerCircle(CX + 110, 980, 90, 80, t, Mi + .1, { col: SX.acc }) + ev +
      kthin('le miroir a gardé', CX, 345, t, 0, { size: 52 }) + kword('LES PREUVES', CX, 455, t, P - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [at(2, 'miroir') - S2, 'glint', .6], [at(2, 'miroir') - S2 + .1, 'scratch', .5], [at(2, 'preuves') - S2 - .05, 'boom', .5], [at(2, 'preuves') - S2 + .1, 'pop_hi', .5]] }, S2);
// B003 — tu as 20 ans : premier vrai décor, chambre, slam 20 ANS
B(3, { enter: 'crash', flash: 1, cam: () => ({ z: 1.05, shake: 4 }),
  draw: (t, d, T) => roomA(t) + noah({ x: CX, y: 1500, s: 1.35, expr: 'cool', armR: [-40, -70], armL: [140, 120] }, t) + burst(CX, 470, 230, t, 0, SX.acc2, 16) + kword('20 ANS', CX, 470, t, .02, { size: 120, fill: '#fff' }) + fgLayer('room', t),
  sfx: [[0, 'flash_hit', .6], [.02, 'boom', .6], [.15, 'tada', .5]] });
// B004 — en quittant l'adolescence : couloir du lycée, porte « SORTIE ADOLESCENCE », valise, marche triomphale
B(4, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const Q = at(4, 'quittant'), A = at(4, 'adolescence'), x = lerp(260, 600, eInOut(seg(t, Q - .2, d)));
    return depth({ zoom: 1, x: Math.sin(t) * 14 }, [{ z: 1.4, svg: hallway(t), haze: .1 }, { z: 1, svg: G(tr(820, 1250), rect(-170, -620, 340, 620, '#fff6c8', 10, 6) + op(.5 + .2 * Math.sin(t * 6), rect(-150, -600, 300, 600, '#fffbe6', 6, 0)) + rect(-200, -700, 400, 70, '#2fa84f', 12, 6) + ftext(0, -650, 'SORTIE', { size: 44, fill: '#fff', stroke: 'none' })) +
      noah({ x, y: 1500, s: 1.3, expr: 'joy', walk: 4, armL: [130, 110], holdL: suitcase(0, 60, .8) }, t) }, { z: .6, svg: fgLayer('hall', t) }]) +
      kthin("en quittant l'", CX, 380, t, 0, { size: 50 }) + funTag(CX, 480, 'ADOLESCENCE', t, A - .05, { size: 62, bg: SX.cool }) + (t > A + .3 ? cross(820, 470, .45, t, A + .3) : ''); },
  sfx: [[0, 'steps', .6], [at(4, 'quittant'), 'whoosh', .5], [at(4, 'adolescence') - .05, 'pop', .7], [at(4, 'adolescence') + .3, 'ding', .5]] });
// B005 — tu quitterais aussi les remarques : les bulles de moqueries s'envolent comme des oiseaux, Noah fait coucou
B(5, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const R_ = at(5, 'remarques'), rem = ["T'AS UN BOUTON", 'ÇA VA TA PEAU ?', 'PIZZA ?!']; let b = '';
    rem.forEach((str, i) => { const t0 = R_ - .3 + i * .15, k = clamp((t - t0) / 1.6); if (t < t0) return; b += G(tr(lerp([300, 760, 520][i], [240, 840, 560][i], k), lerp(980 - i * 60, 380 - i * 40, eOutCubic(k)), 1 - k * .35, Math.sin(t * 6 + i) * 6), chatBubble(0, 0, str.length * 26 + 70, 90, str, t, t0, false, 38) + path('M-50 -40q-30 -40 -70 -30M50 -40q30 -40 70 -30', 'none', 8, '#fff')); });
    return parkA(t) + noah({ x: CX, y: 1500, s: 1.35, expr: 'ecstatic', armR: [-70 + Math.sin(t * 14) * 15, -100], armL: [150, 140] }, t) + b + funTag(CX, 420, 'BYE BYE !', t, at(5, 'peau') - .05, { size: 64, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[at(5, 'quitterais'), 'whoosh_up', .5], [at(5, 'remarques') - .3, 'flutter', .6], [at(5, 'remarques'), 'chirp', .5], [at(5, 'peau') - .05, 'pop', .6]] });
// B006 — sauf qu'il reste de petites cicatrices : salle de bain, reflet, loupe sur la joue, mâchoire au sol
B(6, { enter: 'drop', cam: (t, d) => ({ z: t > at(6, 'cicatrices') ? 1.12 : lerp(1.0, 1.05, t / d), hand: .4, shake: t > at(6, 'cicatrices') && t < at(6, 'cicatrices') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const C = at(6, 'cicatrices'), J = at(6, 'joues'), mg = eOutBack(seg(t, at(6, 'petites') - .3, at(6, 'petites') + .1)), [sx, sy] = scarAt(CX, 760, 230, 3);
    return bathroomT(t) + noahHead(CX, 760, 230, { expr: t > C ? 'jawdrop' : 'happy', lit: t > C ? .7 : 0 }, t) + (mg > 0 ? G(tr(lerp(1300, sx + 20, mg), sy + 10), magnifier(0, 0, 1.2, -10)) : '') + markerCircle(CX - 120, 830, 80, 70, t, J, { col: SX.acc }) +
      funTag(CX - 200, 420, 'SAUF QUE…', t, 0, { size: 54, bg: '#fff', fg: SX.ink }) + funTag(CX + 160, 1130, 'petites, mais là', t, C + .1, { size: 40, bg: SX.acc }) + fgLayer('bath', t); },
  sfx: [[at(6, 'sauf'), 'hmm', .5], [at(6, 'petites') - .3, 'whoosh', .6], [at(6, 'cicatrices'), 'gasp', .6], [at(6, 'cicatrices') + .05, 'thud', .6], [at(6, 'joues'), 'scratch', .5]] });
// B007 — tu les connais par cœur : la joue = constellation, les cicatrices reliées au marqueur (plan concept)
B(7, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.05, 1.12, t / d) }),
  draw: (t, d, T) => { const order = [0, 2, 3, 4, 9, 5], k = seg(t, .05, d - .1); let ln = '';
    for (let i = 0; i < order.length - 1; i++) { const kk = clamp(k * (order.length - 1) - i); if (kk <= 0) break; const [a, b] = scarAt(CX, 920, 320, order[i]), [c, e] = scarAt(CX, 920, 320, order[i + 1]); ln += line(a, b, lerp(a, c, kk), lerp(b, e, kk), 6, SX.acc2) + sparkle(a, b, .35, '#fff'); }
    return grad('#1d2350', '#3a2a6a', -M, -M, W + 2 * M, H + 2 * M) + Array.from({ length: 30 }, (_, i) => op(.4 + .4 * Math.sin(t * 4 + i), circ((i * 137) % W, (i * 241) % 1200, 4, '#fff', 0))).join('') + cutout(noahHead(CX, 920, 320, { expr: 'smug', look: [-1, 0] }, t), 12) + ln +
      kthin('tu les connais', CX, 340, t, 0, { size: 54 }) + kword('PAR CŒUR', CX, 450, t, at(7, 'par') - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [.1, 'tick', .5], [.35, 'tick', .5], [at(7, 'par') - .05, 'boom', .5], [.7, 'sparkle', .5]] });
// B008 — celle près du nez, celle sous l'œil : très gros plan, flèches au marqueur sur chaque mot
B(8, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.08, 1.14, t / d), hand: .5 }),
  draw: (t, d, T) => { const N = at(8, 'nez'), O = at(8, 'sous') + .15, [nx, ny] = scarAt(CX, 870, 290, 0), [ox, oy] = scarAt(CX, 870, 290, 1);
    return bathroomT(t) + rect(-M, -M, W + 2 * M, H + 2 * M, 'rgba(234,246,250,.25)', 0, 0) + noahHead(CX, 870, 290, { expr: 'deadpan', look: [t > O ? -1 : 1, .3] }, t) +
      markerArrow(CX + 330, 520, nx + 20, ny - 20, t, N - .2, { col: SX.acc, bend: 60 }) + markerText('NEZ', CX + 330, 470, t, N - .05, { size: 64, col: SX.acc2 }) +
      markerArrow(CX - 330, 560, ox - 20, oy - 20, t, O - .2, { col: SX.acc, bend: -60 }) + markerText('ŒIL', CX - 330, 500, t, O - .05, { size: 64, col: SX.acc2 }); },
  sfx: [[at(8, 'celle'), 'hmm', .4], [at(8, 'nez') - .2, 'scratch', .6], [at(8, 'nez'), 'pop_hi', .5], [at(8, 'sous') - .05, 'scratch', .6], [at(8, 'sous') + .15, 'pop_hi', .5]] });
// B009a — la lumière du soleil révèle : rue, soleil méchant avec projecteur braqué sur Noah
B(9, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const S = at(9, 'soleil'), Rv = at(9, 'revele'), k = seg(t, S - .2, S + .3), [hx, hy] = headOf(380, 1500, 1.35);
    return streetT(t) + sun(860, 400, .55 * eOutBack(k) + .001, t, 'evil') + op(.35 * k, path(`M820 460L${hx - 170} ${hy + 160}L${hx + 170} ${hy + 160}L900 460Z`, '#fff3a0', 0)) +
      noah({ x: 380, y: 1500, s: 1.35, expr: t > Rv ? 'scared' : 'neutral', lit: t > Rv ? 1 : 0, look: [1, -.5] }, t) + funTag(380, 560, 'RÉVÉLÉES', t, Rv - .05, { size: 54, bg: SX.acc }) + fgLayer('street', t); },
  sfx: [[0, 'whoosh', .5], [at(9, 'lumiere'), 'zap', .4], [at(9, 'soleil') - .2, 'whoosh_up', .6], [at(9, 'revele') - .05, 'flash_hit', .6], [at(9, 'revele') + .1, 'glint', .7]] });
const S9 = at(9, 'des') - .15;
// B009b — dès que tu tournes la tête : gros plan, la tête tourne, chaque cicatrice fait « TING »
B(9, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.05, 1.15, t / d), shake: t > at(9, 'tournes') - S9 && t < at(9, 'tournes') - S9 + .3 ? 5 : 0 }),
  draw: (t, d, T) => { const Tn = at(9, 'tournes') - S9, k = eOutBack(seg(t, Tn - .1, Tn + .3));
    return depth({ zoom: 1 }, [{ z: 1.5, svg: streetT(t), haze: .3 }]) + glow(CX + 200, 500, 500, '#fff3a0', .5) + noahHead(CX, 860, 270, { expr: t > Tn ? 'terror' : 'worried', look: [lerp(-1, 1.2, k), 0], tilt: lerp(-8, 8, k), lit: t > Tn ? 1 : .3 }, t) +
      (t > Tn ? ['TING', 'TING', 'TING'].map((w, i) => funTag(CX + [260, -300, 330][i], [600, 700, 980][i], w, t, Tn + .1 + i * .15, { size: 40, bg: '#fff', fg: SX.ink, r: [-10, 8, 4][i] })).join('') : ''); },
  sfx: [[0, 'flash_hit', .5], [at(9, 'tournes') - S9, 'whoosh', .7], [at(9, 'tournes') - S9 + .1, 'glint', .7], [at(9, 'tournes') - S9 + .25, 'glint', .6], [at(9, 'tournes') - S9 + .4, 'ding', .5]] }, S9);
// B010 — tu développes une technique : chambre, Noah général devant un tableau de stratégie (schéma du visage, angles)
B(10, { enter: 'drop', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Tq = at(10, 'technique'); const board = G(tr(780, 640), rect(-230, -210, 460, 420, '#fff', 14, 7) + circ(-40, 0, 110, 'none', 6) + circ(-80, -10, 8, OL, 0) + circ(0, -10, 8, OL, 0) + circ(20, 40, 8, '#e59a8c', 0) + circ(40, 20, 8, '#e59a8c', 0) +
      markerArrow(120, -150, 20, 20, t, .1, { col: SX.acc, bend: 40, w: 9 }) + ftext(140, -160, '45°', { size: 40, fill: SX.acc, stroke: 'none' }) + path('M-200 150L-40 150', 'none', 6, '#5b8fd8') + ftext(100, 170, 'PLAN B', { size: 32, fill: '#5b8fd8', stroke: 'none' }) + rect(-230, 214, 460, 14, '#c8ced6', 4, 4));
    return roomA(t) + board + noah({ x: 330, y: 1500, s: 1.35, expr: t > Tq ? 'smugger' : 'suspicious', armR: [-30, -20], holdR: line(0, 0, 160, -40, 8, '#8a5a3a') }, t) + G(tr(330, 560), rect(-110, -16, 220, 30, SX.acc, 10, 5)) + kword('TECHNIQUE', CX, 420, t, Tq - .05, { size: 92, fill: SX.acc2 }) + fgLayer('room', t); },
  sfx: [[0, 'whoosh', .5], [.1, 'scratch', .5], [at(10, 'developpes'), 'hmm', .5], [at(10, 'technique') - .05, 'boom', .6], [at(10, 'technique') + .2, 'drum', .5]] });
// B011 — toujours du bon côté : photo de groupe au parc, Noah se faufile tout à gauche, flèche « BON CÔTÉ »
B(11, { enter: 'whip', cam: zin(1.02, 1.07, .4),
  draw: (t, d, T) => { const P = at(11, 'placer'), k = eInOut(seg(t, P - .2, P + .5)); let g = '';
    for (let i = 0; i < 3; i++) g += adult(i + 1, { x: 470 + i * 200, y: 1480, s: 1.0, expr: 'happy' }, t);
    return parkA(t) + g + noah({ x: lerp(980, 230, k), y: 1480, s: 1.05, expr: k < 1 ? 'effort' : 'smug', walk: k > 0 && k < 1 ? 5 : 0, flip: k < 1 ? 1 : 0, look: [1, 0] }, t) + (k > 0 && k < 1 ? motionLines(lerp(980, 230, k) + 140, 1200, 3, 70, 0) : '') +
      funTag(CX, 420, 'TOUJOURS', t, 0, { size: 50, bg: '#fff', fg: SX.ink }) + funTag(300, 600, 'BON CÔTÉ ✓', t, at(11, 'cote') - .05, { size: 48, bg: '#36a85a' }) + fgLayer('street', t); },
  sfx: [[at(11, 'toujours'), 'pop', .5], [at(11, 'placer') - .2, 'tiptoe', .7], [at(11, 'placer') + .3, 'whoosh', .5], [at(11, 'cote') - .05, 'ding', .6]] });
// B012 — toujours choisir la bonne lumière : salon, Noah règle le lampadaire au rapporteur, jauge 37 %
B(12, { enter: 'none', trans: 'wipe', cam: camHand(1.05, .5),
  draw: (t, d, T) => { const L = at(12, 'lumiere'), pc = counter(100, 37, t, at(12, 'choisir'), L - at(12, 'choisir'));
    return salonA(t, { night: 1 }) + op(.35, path(`M760 700L520 1300L1000 1300Z`, '#fff3a0', 0)) + G(tr(760, 1250), rect(-40, -10, 80, 14, '#5a4a3a', 6, 4) + line(0, -10, 0, -520, 8) + path('M-70 -510L70 -510L44 -620L-44 -620Z', '#ffd23f', 5)) +
      noah({ x: 400, y: 1500, s: 1.35, expr: 'suspicious', armR: [-20, -40], look: [1, -.5] }, t) + G(tr(640, 690, 1, -15), path('M-90 0A90 90 0 0 1 90 0Z', 'rgba(255,255,255,.7)', 5) + line(0, 0, Math.cos(R(-140 + pc)) * 80, Math.sin(R(-140 + pc)) * 80, 5, SX.acc)) +
      funTag(CX, 420, `LUMIÈRE ${pc} %`, t, at(12, 'choisir') - .1, { size: 56, bg: SX.acc2, fg: SX.ink }) + (t > L ? funTag(800, 560, 'PARFAIT', t, L, { size: 44, bg: '#36a85a', r: 6 }) : ''); },
  sfx: [[at(12, 'toujours'), 'pop', .5], [at(12, 'choisir'), 'clock_fast', .4], [at(12, 'bonne'), 'squeak', .5], [at(12, 'lumiere'), 'ding', .7]] });
// B013a — vérifier les photos : POV téléphone, zoom ×400 sur sa joue, Noah plisse les yeux
B(13, { enter: 'punch', cam: zin(1.04, 1.1, .4),
  draw: (t, d, T) => { const V = at(13, 'verifier'), z = counter(1, 400, t, V, .9), kz = seg(t, V, V + .9);
    const screen = rect(-150, -295, 300, 590, '#9fd6ff', 24, 0) + G(tr(0, 40, 1 + kz * 2.5), head({ hr: 60, hairFn: scarHair, expr: 'happy', seed: 2 }, t)) + rect(-150, 210, 300, 85, 'rgba(0,0,0,.4)', 0, 0) + ftext(0, 265, `ZOOM ×${z}`, { size: 38, fill: '#fff', stroke: 'none' });
    return depth({ zoom: 1 }, [{ z: 1.5, svg: partyT(t, { dancers: false }), haze: .25 }]) + noahHead(260, 760, 150, { expr: 'suspicious', look: [1, 0] }, t) + phoneBig(720, 800, 1.05, 4, screen) + G(tr(630, 760), magnifier(0, 0, .8, -20)) + kthin('toujours vérifier', CX, 380, t, 0, { size: 54 }); },
  sfx: [[0, 'whoosh', .5], [at(13, 'verifier'), 'typing', .5], [at(13, 'photos'), 'shutter', .5], [at(13, 'verifier') + .9, 'error_beep', .4]] });
const S13 = at(13, 'avant') - .15;
// B013b — avant que quelqu'un les publie : plongeon au ralenti « NOOON » vers le pouce de l'ami sur PUBLIER
B(13, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.05, 1.12, t / d), shake: 4, r: -4 }),
  draw: (t, d, T) => { const Pb = at(13, 'publie') - S13, k = eOutCubic(seg(t, 0, Pb + .3)), [fx, fy] = headOf(860, 1520, 1.25);
    return partyT(t, { dancers: false }) + adult(1, { x: 860, y: 1520, s: 1.25, flip: 1, expr: 'happy', armL: [200, 260] }, t) + G(tr(700, 900, 1, -10), rect(-60, -110, 120, 220, '#2b2b33', 18) + rect(-50, -96, 100, 180, '#eef3f8', 10, 0)) + funTag(700, 960, 'PUBLIER', t, .05, { size: 28, bg: '#5b8fd8', r: -10 }) +
      noah({ x: lerp(-100, 130, k), y: lerp(1150, 1080, k), s: 1.1, rot: 75, expr: 'terror', armL: [10, 0], armR: [-10, 0] }, t * .4) + motionLines(60, 900, 4, 100, 0) + kword('NOOON !', CX, 450, t, Pb - .1, { size: 110, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .7], [.1, 'gasp', .6], [at(13, 'publie') - S13 - .1, 'boom', .6], [at(13, 'publie') - S13 + .1, 'error_beep', .5]] }, S13);
// B014 — Kevin : « mais c'est bon, t'as plus de boutons » (pouce levé, fier de lui)
B(14, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => salonA(t) + noah({ x: 300, y: 1500, s: 1.3, expr: 'deadpan', look: [1, 0] }, t) + kevin({ x: 780, y: 1500, s: 1.35, flip: 1, expr: t > at(14, 'plus') ? 'proud' : 'talk', armL: [200, 250] }, t) +
    funTag(780, 400, 'KEVIN', t, at(14, 'kevin'), { size: 50, bg: '#5fb85f' }) + chatBubble(700, 560, 620, 120, "T'AS PLUS DE BOUTONS !", t, at(14, 'plus') - .1, false, 40) + fgLayer('room', t),
  sfx: [[at(14, 'kevin'), 'pop', .6], [at(14, 'dit'), 'hmm', .4], [at(14, 'plus') - .1, 'boing', .6], [at(14, 'boutons'), 'ding', .5]] });
// B015 — « Merci Kevin, je n'avais pas remarqué » : gros plan blasé, Kevin flou derrière toujours le pouce levé
B(15, { enter: 'none', trans: 'push', transD: .2, cam: zin(1.04, 1.1),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.5, svg: salonA(t), haze: .2 }, { z: 1.2, svg: blur(6, kevin({ x: 880, y: 1450, s: 1.1, flip: 1, expr: 'proud', armL: [200, 250] }, t)) }]) + noahHead(440, 860, 240, { expr: 'deadpan', look: [-.6, 0] }, t) +
    kword('MERCI KEVIN', CX, 430, t, at(15, 'merci') - .05, { size: 92, fill: '#fff', puff: false }) + markerText('(sarcasme)', 470, 1180, t, at(15, 'remarque') - .1, { size: 46, col: SX.acc }),
  sfx: [[at(15, 'merci') - .05, 'glint', .5], [at(15, 'kevin'), 'pop', .4], [at(15, 'remarque') - .1, 'scratch', .5], [at(15, 'remarque') + .3, 'rimshot', .5]] });
// B016 — certaines inflammations : cabinet dermato, à l'écran un bouton en colère qui chauffe (flammes)
B(16, { enter: 'drop', cam: zin(1.0, 1.06, .3),
  draw: (t, d, T) => { const I = at(16, 'inflammations'), kI = eOutBack(seg(t, I - .2, I + .4));
    return cabinetA(t, acneCut(t, kI, 0)) + adult(0, { x: 900, y: 1560, s: 1.2, flip: 1, coat: true, shirt: '#fff', stetho: true, expr: 'talk', armL: [215, 230] }, t) + noah({ x: 200, y: 1560, s: 1.2, expr: t > I ? 'scared' : 'neutral', look: [1, -1] }, t) +
      kword('INFLAMMATIONS', CX, 230, t, I - .05, { size: 80, fill: SX.acc2 }) + funTag(820, 360, 'GRRR', t, I + .3, { size: 40, bg: SX.acc, r: 8 }); },
  sfx: [[0, 'whoosh', .4], [at(16, 'inflammations') - .2, 'fire', .5], [at(16, 'inflammations') - .05, 'boom', .5], [at(16, 'inflammations') + .3, 'growl', .5]] });
// B017 — peuvent laisser des marques durables : zoom écran, le bouton se calme, le creux reste, tampon DURABLE
B(17, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Mq = at(17, 'marques'), kS = eInOut(seg(t, at(17, 'laisser') - .2, Mq + .4));
    return blur(6, cabinetA(t)) + card(CX, 820, 840, 560, G(tr(0, 0, 1.12), acneCut(t, 1, kS)), t, 0, { ry: lerp(16, 0, seg(t, 0, .5)), bg: '#fff' }) + (kS > .9 ? markerArrow(CX + 330, 560, CX + 40, 700, t, Mq + .3, { col: SX.acc, bend: -50 }) + markerText('creux', CX + 330, 520, t, Mq + .4, { size: 50, col: SX.acc2 }) : '') +
      stamp(CX, 1170, 'DURABLE', t, at(17, 'durables') - .05, SX.acc, -8) + kthin('des marques ou des cicatrices', CX, 400, t, Mq - .1, { size: 48 }); },
  sfx: [[at(17, 'laisser'), 'sizzle', .5], [at(17, 'marques'), 'thud', .5], [at(17, 'marques') + .3, 'scratch', .5], [at(17, 'durables') - .05, 'hammer', .6]] });
// B018 — ce n'est pas ta faute : salle de bain blindée de produits, croix sur « MAL PRIS SOIN », tampon vert « PAS TA FAUTE »
B(18, { enter: 'whip', cam: camHand(1.05, .4),
  draw: (t, d, T) => { const Ms = at(18, 'mal'), Pp = at(18, 'peau'); let prod = '';
    for (let i = 0; i < 9; i++) prod += (i % 2 ? tubeA : bottleA)(130 + i * 105, 1230 + (i % 3) * 6, .9, DPAL[i % 8], (i % 3 - 1) * 6);
    return bathroomT(t) + prod + noahHead(CX, 830, 220, { expr: t > Pp ? 'zen' : 'worried' }, t) + bubbles(t, CX, 700, 500, 8, 4) + funTag(CX, 420, 'MAL PRIS SOIN ?', t, Ms - .1, { size: 56, bg: '#fff', fg: SX.ink }) + cross(CX, 420, .9, t, Ms + .25) +
      stamp(CX, 580, 'PAS TA FAUTE', t, Pp - .05, '#36a85a', -6) + (t > Pp ? heartsUp(t - Pp, CX, 900, 4, 300) : ''); },
  sfx: [[at(18, 'signifie'), 'spray', .4], [at(18, 'mal') - .1, 'pop', .6], [at(18, 'mal') + .25, 'error_beep', .5], [at(18, 'peau') - .05, 'thud', .7], [at(18, 'peau') + .2, 'angel', .4]] });
// B019 — un jour, une ancienne photo : chambre, carton « SOUVENIRS », nuage de poussière, photo brandie
B(19, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Ph = at(19, 'photo'), k = eOutBack(seg(t, at(19, 'retrouves') - .2, Ph)), dust = seg(t, at(19, 'retrouves'), at(19, 'retrouves') + 1);
    return roomA(t, { box: 1 }) + noah({ x: 470, y: 1500, s: 1.35, expr: t > Ph ? 'wow' : 'confused', armR: [-50, -60], look: [1, -1] }, t) + (dust > 0 && dust < 1 ? op(1 - dust, cloud(860, 1250 - dust * 200, 1.2 + dust, '#e8e2d8') + cloud(760, 1300 - dust * 160, .9 + dust, '#e8e2d8')) : '') +
      (k > 0 ? paperPhoto(lerp(860, 720, k), lerp(1300, 640, k), .8 * k, lerp(20, -8, k), G(tr(0, -40), head({ hr: 70, hairFn: scarHair, scar: 0, acne: 1, expr: 'laugh', seed: 2 }, t))) : '') + funTag(CX, 400, 'UN JOUR…', t, 0, { size: 50, bg: SX.cool }) + fgLayer('room', t); },
  sfx: [[at(19, 'jour'), 'pop', .5], [at(19, 'retrouves'), 'thud', .5], [at(19, 'retrouves') + .1, 'wind', .4], [at(19, 'photo') - .1, 'whoosh_up', .6], [at(19, 'photo'), 'sparkle', .6]] });
// B020 — 15 ANS : plongée dans la photo (carte papier), slam
B(20, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => paper('#ffe9c9') + gobo(T, .1) + card(CX, 900, 560, 620, rect(-250, -280, 500, 400, '#bfe3ff', 6, 0) + G(tr(0, -60), head({ hr: 130, hairFn: scarHair, scar: 0, acne: 1, expr: 'laugh', seed: 2 }, t)), t, 0, { ry: 10, bg: '#fff' }) + kword('15 ANS', CX, 440, t, at(20, '15') - .1, { size: 120, fill: SX.acc2 }),
  sfx: [[0, 'shutter', .6], [at(20, '15') - .1, 'boom', .6], [at(20, '15') + .1, 'rewind', .4]] });
// B021 — tu souris, couvert de boutons : dans la photo (cadre polaroid), sourire XXL, compteur de boutons
B(21, { enter: 'none', trans: 'up', transD: .2, cam: zin(1.02, 1.1, .3),
  draw: (t, d, T) => { const Cv = at(21, 'couvertes'), [hx, hy] = headOf(CX, 1500, 1.4, 'kid');
    return kidRoomDay(t) + teen({ x: CX, y: 1500, s: 1.4, expr: 'ecstatic', armL: [200, 230], armR: [-20, -50] }, t) + markerCircle(hx, hy + 20, 170, 150, t, Cv, { col: SX.acc }) + funTag(hx + 250, hy - 200, `${counter(0, 14, t, Cv, .6)} boutons`, t, Cv, { size: 40, bg: SX.acc2, fg: SX.ink }) +
      funTag(CX, 400, 'TU SOURIS', t, at(21, 'souris') - .1, { size: 56, bg: '#fff', fg: SX.ink }) + rect(-M, -M, W + 2 * M, H + 2 * M, 'none', 0, 0) + `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="#fff" stroke-width="46"/>`; },
  sfx: [[at(21, 'souris') - .1, 'pop', .6], [at(21, 'souris'), 'sparkle', .5], [at(21, 'couvertes'), 'scratch', .5], [at(21, 'boutons'), 'tick', .5]] });
// B022 — tu te souviens de cette journée : Noah regarde la photo, nostalgie (lumière dorée, bulle souvenir)
B(22, { enter: 'none', trans: 'wipe', cam: zin(1.04, 1.1, .2),
  draw: (t, d, T) => { const J = at(22, 'journee');
    return roomA(t) + lightLeak(T, .35) + noah({ x: 330, y: 1500, s: 1.35, expr: 'calm', armR: [-60, -80], holdR: G(tr(30, -40, .45, -8), paperPhoto(0, 0, 1, 0, G(tr(0, -40), head({ hr: 70, hairFn: scarHair, scar: 0, acne: 1, expr: 'laugh', seed: 2 }, t)))) }, t) +
      thought(740, 620, 460, 300, G(tr(0, 20, .5), cakeA(0, 40, 1, t) + dBalloon(-200, -120, '#ff5c8a', t, 0, .7) + dBalloon(220, -120, '#5ec4f0', t, 1, .7)), seg(t, at(22, 'souviens') - .1, at(22, 'souviens') + .3)) + heartsUp(t, 330, 900, 4, 260) + funTag(740, 420, 'CETTE JOURNÉE', t, J - .05, { size: 46, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[at(22, 'souviens') - .1, 'magic', .6], [at(22, 'journee') - .05, 'pop', .5], [.3, 'heartbeat', .3]] });
// B023a — un anniversaire, des amis : la fête (chambre ado), confettis
B(23, { enter: 'whip', cam: zin(1.02, 1.07, .4),
  draw: (t, d, T) => { const A = at(23, 'anniversaire'), Am = at(23, 'amis');
    return kidRoomDay(t) + kid(0, { x: 160, y: 1500, s: 1.15, expr: 'joy', armL: [200, 230] }, t) + teen({ x: 440, y: 1500, s: 1.3, expr: 'laugh', armR: [-30, -60] }, t) + kid(3, { x: 720, y: 1500, s: 1.15, expr: 'happy', flip: 1 }, t) + kevinTeen({ x: 950, y: 1500, s: 1.15, flip: 1, expr: 'mock' }, t) + confetti(t, A, 30) +
      funTag(CX, 400, 'ANNIVERSAIRE', t, A - .1, { size: 58, bg: SX.acc2, fg: SX.ink }) + funTag(CX, 540, '+ LES AMIS', t, Am - .05, { size: 46, bg: SX.cool, r: 4 }); },
  sfx: [[at(23, 'anniversaire') - .1, 'tada', .6], [at(23, 'anniversaire'), 'pop', .4], [at(23, 'amis') - .05, 'pop', .6], [at(23, 'amis') + .1, 'whistle', .3]] });
const S23 = at(23, 'gateau') - .15;
// B023b — un gâteau renversé, un fou rire : le gâteau s'envole et atterrit sur la tête de Kevin, tout le monde explose de rire
B(23, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), shake: t > at(23, 'renverse') - S23 && t < at(23, 'renverse') - S23 + .3 ? 8 : 0 }),
  draw: (t, d, T) => { const Rv = at(23, 'renverse') - S23, F = at(23, 'fourrier') - S23, k = seg(t, 0, Rv), [kx, ky] = headOf(800, 1500, 1.3, 'kid'), splat = t > Rv;
    return kidRoomDay(t) + teen({ x: 300, y: 1500, s: 1.3, expr: t > F ? 'laugh' : 'shock', armL: [200, 220], armR: [-20, -40] }, t) + kevinTeen({ x: 800, y: 1500, s: 1.3, flip: 1, expr: splat ? 'dizzy' : 'shock' }, t) +
      (splat ? G(tr(kx, ky - 90), path('M-150 40Q-160 -60 0 -80Q160 -60 150 40Q120 20 90 70Q60 30 20 80Q-20 30 -60 70Q-100 20 -150 40Z', '#ff8fb1', 7) + path('M-140 30Q0 -10 140 30', 'none', 10, '#fff') + rect(-8, -150, 16, 70, '#ffd23f', 4, 4)) : cakeA(lerp(300, kx, k), lerp(1150, ky - 100, k) - Math.sin(k * Math.PI) * 300, .6, t, 15, k * 400)) +
      kword('FOU RIRE', CX, 440, t, F - .05, { size: 110, fill: SX.acc2 }) + (t > F ? popStars(CX, 440, t, F, 8, 380) + ['HA', 'HA', 'HA'].map((w, i) => funTag([180, 540, 900][i], 620 + (i % 2) * 40, w, t, F + i * .1, { size: 44, bg: '#fff', fg: SX.ink, r: (i - 1) * 10 })).join('') : ''); },
  sfx: [[0, 'whoosh_up', .6], [at(23, 'renverse') - S23, 'thud', .8], [at(23, 'renverse') - S23 + .05, 'boing', .5], [at(23, 'fourrier') - S23 - .05, 'boom', .5], [at(23, 'fourrier') - S23 + .1, 'rimshot', .5]] }, S23);
// B024 — tu réalises : déclic, « débloqué » en étoiles, AUCUN SOUVENIR (de boutons)
B(24, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const R_ = at(24, 'realises') - .05, A = at(24, 'aucun'), [hx, hy] = headOf(CX, 1500, 1.35);
    return roomA(t) + unlock(hx, hy, t, R_, { part: 'back', r: 460 }) + noah({ x: CX, y: 1500, s: 1.35, expr: t > A ? 'wow' : 'jawdrop', armR: [-60, -80], holdR: G(tr(30, -40, .4, -8), paperPhoto(0, 0, 1, 0)) }, t) + unlock(hx, hy, t, R_, { part: 'front', r: 460 }) +
      kthin('tu as', CX, 360, t, R_, { size: 54 }) + kword('AUCUN SOUVENIR', CX, 470, t, A - .05, { size: 86, fill: SX.acc2 }) + fgLayer('room', t); },
  sfx: [[at(24, 'realises') - .05, 'magic', .6], [at(24, 'realises'), 'sparkle', .6], [at(24, 'aucun') - .05, 'boom', .5], [at(24, 'souvenir'), 'ding', .5]] });
// B025 — de la peau horrible que les autres décrivaient : recherche dans « mes souvenirs » → 0 résultat
B(25, { enter: 'none', trans: 'up', transD: .22, cam: zin(1.02, 1.07),
  draw: (t, d, T) => { const P = at(25, 'peau') - .1, D = at(25, 'decrivaient');
    return blur(8, roomA(t)) + rect(-M, -M, W + 2 * M, H + 2 * M, 'rgba(42,36,64,.35)', 0, 0) + card(CX, 760, 820, 540, searchCard('peau horrible', t, P, D), t, 0, { ry: 0, bg: '#fff' }) + noahHead(CX, 1100, 110, { expr: t > D ? 'wow' : 'confused', look: [0, -1] }, t) + (t > D ? cross(CX + 250, 560, .5, t, D + .2) : ''); },
  sfx: [[0, 'pop_hi', .5], [at(25, 'peau') - .1, 'typing', .6], [at(25, 'decrivaient'), 'error_beep', .6], [at(25, 'decrivaient') + .2, 'hmm', .4]] });
// B026 — juste d'avoir été heureux : souvenir doré, l'ado saute de joie avec ses amis, HEUREUX
B(26, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Hx = at(26, 'heureux'), j = Math.abs(Math.sin(t * 7)) * 50;
    return parkA(t, { gold: 1 }) + rays(t, CX, 900, 'rgba(255,230,160,.25)', 'rgba(255,255,255,0)', 18) + kid(1, { x: 220, y: 1500 - j * .7, s: 1.1, expr: 'joy', armL: [210, 230], armR: [-30, -60] }, t) + teen({ x: CX, y: 1500 - j, s: 1.35, expr: 'ecstatic', armL: [210, 240], armR: [-30, -60] }, t) + kid(4, { x: 860, y: 1500 - j * .5, s: 1.1, expr: 'laugh', flip: 1, armR: [-30, -60] }, t) +
      kthin("juste d'avoir été", CX, 360, t, at(26, 'juste'), { size: 52 }) + kword('HEUREUX', CX, 470, t, Hx - .05, { size: 120, fill: SX.acc2 }) + (t > Hx ? heartsUp(t - Hx, CX, 950, 6, 420) + popStars(CX, 470, t, Hx, 8, 360) : ''); },
  sfx: [[at(26, 'souviens'), 'magic', .5], [at(26, 'juste'), 'boing', .4], [at(26, 'heureux') - .05, 'tada', .7], [at(26, 'heureux') + .2, 'sparkle', .5]] });
// B027a — alors tu prends une nouvelle photo : parc, selfie bras tendu
B(27, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const N = at(27, 'nouvelle'), Ph = at(27, 'photo');
    return parkA(t) + noah({ x: 420, y: 1500, s: 1.35, expr: 'happy', armR: [-35, -40], holdR: G(tr(10, -20, 1, 10), rect(-40, -80, 80, 160, '#2b2b33', 16, 5) + rect(-32, -70, 64, 130, Math.sin(t * 8) > 0 ? '#bfe3ff' : '#dff0ff', 8, 0)) }, t) +
      funTag(CX, 420, 'NOUVELLE PHOTO', t, N - .1, { size: 54, bg: SX.cool }) + (t > Ph ? op(1 - seg(t, Ph, Ph + .3), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0)) : '') + fgLayer('street', t); },
  sfx: [[at(27, 'prends'), 'whoosh', .5], [at(27, 'nouvelle') - .1, 'pop', .6], [at(27, 'photo'), 'shutter', .9]] });
const S27 = at(27, 'sans') - .15;
// B027b — sans filtre, sans chercher le bon angle : écran selfie de face, les boutons FILTRE / BON ANGLE barrés, Noah rayonne
B(27, { enter: 'none', trans: 'push', transD: .2, cam: zin(1.04, 1.1, .2),
  draw: (t, d, T) => { const Fi = at(27, 'filtre') - S27, Bo = at(27, 'chercher') - S27;
    return depth({ zoom: 1 }, [{ z: 1.5, svg: parkA(t), haze: .15 }]) + noahHead(CX, 910, 250, { expr: 'joy' }, t) + popStars(CX, 910, t, Bo + .4, 8, 330) +
      funTag(300, 420, 'FILTRE', t, Fi - .1, { size: 50, bg: '#b56cff' }) + cross(410, 395, .35, t, Fi + .1) + funTag(740, 420, 'BON ANGLE', t, Bo - .1, { size: 50, bg: '#5b8fd8' }) + cross(920, 395, .35, t, Bo + .2) +
      stamp(CX, 570, 'TEL QUEL', t, Bo + .45, '#36a85a', -6); },
  sfx: [[at(27, 'filtre') - S27 - .1, 'pop', .6], [at(27, 'filtre') - S27 + .1, 'snip', .6], [at(27, 'chercher') - S27 - .1, 'pop', .6], [at(27, 'chercher') - S27 + .2, 'snip', .6], [at(27, 'bon') - S27 + .3, 'thud', .6]] }, S27);
// B028 — ces marques racontent une période de ta vie : galerie, les deux photos encadrées comme des œuvres
B(28, { enter: 'none', trans: 'wipe', cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const Rc = at(28, 'racontent'), Pe = at(28, 'periode');
    const art = (x, inner, lbl, t0) => card(x, 640, 330, 380, rect(-145, -170, 290, 280, '#bfe3ff', 6, 0) + inner + ftext(0, 155, lbl, { size: 34, fill: SX.ink, stroke: 'none' }), t, t0, { ry: 0, bg: '#fff', edge: '#d9a441' });
    return galleryT(t) + art(300, G(tr(0, -20), head({ hr: 90, hairFn: scarHair, scar: 0, acne: 1, expr: 'laugh', seed: 2 }, t)), '15 ANS', .05) + art(780, G(tr(0, -20), head({ hr: 90, hairFn: scarHair, expr: 'joy', seed: 2 }, t)), '20 ANS', Rc - .1) +
      noah({ x: CX, y: 1560, s: 1.2, expr: 'proud', armL: [140, 120], armR: [40, 60] }, t) + funTag(CX, 920, 'UNE PÉRIODE DE TA VIE', t, Pe - .1, { size: 42, bg: SX.acc2, fg: SX.ink }) + kthin('ces marques racontent', CX, 340, t, Rc - .1, { size: 52, fill: SX.ink }); },
  sfx: [[at(28, 'marques'), 'pop_hi', .5], [at(28, 'racontent') - .1, 'whoosh', .5], [at(28, 'periode') - .1, 'pop', .6], [at(28, 'vie'), 'ding', .6]] });
// B029a — elles n'ont jamais été une… : un bouton PAUSE géant tombe devant Noah
B(29, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > .35 && t < .6 ? 5 : 0 }),
  draw: (t, d, T) => { const k = eOutBack(seg(t, 0, .35)), J = at(29, 'jamais');
    return parkA(t, { gold: 1 }) + noah({ x: 300, y: 1500, s: 1.35, expr: t > J ? 'smugger' : 'shock', armR: [-10, -20] }, t) + pauseBtn(760, lerp(-300, 760, k), 1, t) + kword('JAMAIS', CX, 420, t, J - .05, { size: 110, fill: '#fff' }) + fgLayer('street', t); },
  sfx: [[0, 'whoosh', .6], [.35, 'thud', .8], [at(29, 'jamais') - .05, 'boom', .5]] });
const S29 = at(29, 'raison') - .15;
// B029b — FIN : « une raison de la mettre en pause » → Noah appuie, PAUSE devient PLAY, étoiles ; dernier gag : Kevin, pouce levé, plein de gâteau
B(29, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(29, 'pause') - S29 && t < at(29, 'pause') - S29 + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const Pz = at(29, 'pause') - S29 - .05, play = t > Pz ? 1 : 0, Kv = Pz + .15;
    return parkA(t, { gold: 1 }) + unlock(760, 800, t, Pz, { part: 'back', r: 460 }) + pauseBtn(760, 800, 1, t, play) + unlock(760, 800, t, Pz, { part: 'front', r: 460 }) +
      noah({ x: 330, y: 1500, s: 1.35, expr: play ? 'ecstatic' : 'effort', armR: play ? [-60, -90] : [-15, -10] }, t) + (play ? confetti(t, Pz, 40) : '') +
      kthin('pas une raison de', CX, 330, t, 0, { size: 54 }) + kword('METTRE PAUSE', CX, 440, t, at(29, 'mettre') - S29 - .05, { size: 96, fill: SX.acc2 }) + (play ? funTag(CX, 560, 'PLAY !', t, Pz + .1, { size: 64, bg: '#36a85a' }) : '') +
      (t > Kv ? G(tr(lerp(1300, 900, eOutBack(seg(t, Kv, Kv + .35))), 0), kevinHead(0, 1060, 110, { expr: 'proud', tilt: -12 }, t) + path('M-90 990Q-96 950 0 940Q96 950 90 990Q60 980 40 1004Q10 980 -20 1004Q-50 980 -90 990Z', '#ff8fb1', 6) + ftext(-150, 1120, '👍', { size: 80, stroke: 'none' })) : ''); },
  sfx: [[at(29, 'raison') - S29, 'pop', .5], [at(29, 'mettre') - S29 - .05, 'boom', .5], [at(29, 'pause') - S29 - .05, 'kaching', .6], [at(29, 'pause') - S29, 'tada', .7], [at(29, 'pause') - S29 + .15, 'boing', .5]] }, S29);

SCENES.sort((a, b) => a.s - b.s);
