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
    return kidRoomDay(t) + leo({ x: 330, y: 1500 - j, s: 1.35, expr: 'joy', armL: [210, 230], armR: [-30, -60] }, t) + G(tr(790, 1260, .85), cake) + confetti(t, 0, 30) + funTag(CX, 440, '6 ANS', t, at(5, 'six') - .1, { size: 96, bg: SX.acc2, fg: SX.ink }); },
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
// premier plan flou par plan (3e couche de profondeur) : clé = n° de bloc (+ a/b pour les sous-plans)
const FG = { 4: 'street', 5: 'room', '6a': 'school', 7: 'school', 8: 'bath', 9: 'bath', 10: 'class', 11: 'class', 12: 'hall', 13: 'stage', 14: 'stage', 15: 'bed', '17a': 'bed', '17b': 'street', 21: 'gallery', '22a': 'street', '22b': 'street', 23: 'party', 24: 'party', '32a': 'party', '32b': 'party' };
{ const cnt = {}; SCENES.forEach(sc => { cnt[sc.n] = (cnt[sc.n] || 0) + 1; });
  const seen = {}; SCENES.forEach(sc => { const i = seen[sc.n] = (seen[sc.n] || 0) + 1, key = cnt[sc.n] > 1 ? sc.n + 'ab'[i - 1] : sc.n, kind = FG[key];
    if (kind) { const d0 = sc.draw; sc.draw = (t, d, T) => d0(t, d, T) + fgLayer(kind, t); } }); }
