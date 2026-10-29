// ============================================================
//  slot.js — INTRO « machine à sous » (demande client) : « tu n'as rien choisi, c'est tombé sur toi au hasard ».
//  Machine de casino en fausse 3D, titre de l'épisode sur le fronton lumineux, levier, 3 rouleaux qui tournent
//  puis s'arrêtent un par un sur le sujet de l'épisode (JACKPOT… pour le pire), ampoules, pièces qui jaillissent.
//  Usage (plan 1) :
//    draw: (t) => casinoBg(t) + slotMachine(t, { l1: "POURQUOI C'EST", l2: "HORRIBLE D'ÊTRE LE", key: 'MEC TROP GENTIL ?',
//            t0: .35, stops: [1.0, 1.35, 1.75], win: [(x,y,s,t)=>heroHead(x,y,70*s,{expr:'jawdrop'},t), …] })
//    sfx: slotSfx(.35, [1.0, 1.35, 1.75])
//  À charger après motion.js et decor.js (utilise vgrad, ftext, clipR, sparkle, kword).
// ============================================================
const SLOT = { x: 160, y: 590, w: 760, h: 700, cell: 210 };

// ---------- symboles par défaut (centrés sur 0,0, taille ~150 px pour s = 1) ----------
const SLOT_SYMS = {
  cherry: (x, y, s) => G(tr(x, y, s), path('M-10 -60Q0 -20 -34 14M-10 -60Q16 -24 30 8', 'none', 7, '#3f8a3f') + path('M-10 -62Q20 -80 40 -60Q14 -52 -10 -62Z', '#5fb85f', 5) + circ(-34, 30, 30, '#e2463a', 6) + circ(30, 26, 30, '#e2463a', 6) + ell(-44, 18, 8, 6, 'rgba(255,255,255,.7)', 0) + ell(20, 14, 8, 6, 'rgba(255,255,255,.7)', 0)),
  bell: (x, y, s) => G(tr(x, y, s), path('M0 -62Q-44 -60 -46 0L-58 34L58 34L46 0Q44 -60 0 -62Z', '#ffd23f', 6) + circ(0, 44, 13, '#e8a020', 5) + circ(0, -66, 9, '#e8a020', 5) + path('M-26 -30Q-30 0 -34 22', 'none', 7, 'rgba(255,255,255,.65)')),
  seven: (x, y, s) => G(tr(x, y, s), ftext(4, 52, '7', { size: 170, fill: '#e2463a', stroke: OL, sw: 16, font: 'Fredoka, sans-serif' })),
  star: (x, y, s) => G(tr(x, y, s), path('M0 -62L18 -20L64 -18L28 10L40 56L0 30L-40 56L-28 10L-64 -18L-18 -20Z', '#ffd23f', 6) + circ(-12, -8, 5, OL, 0) + circ(12, -8, 5, OL, 0) + path('M-10 10Q0 18 10 10', 'none', 4)),
  bar: (x, y, s) => G(tr(x, y, s), rect(-70, -30, 140, 60, '#2b2420', 12, 6) + ftext(0, 16, 'BAR', { size: 46, fill: '#ffd23f', stroke: 'none', font: 'Fredoka, sans-serif' })),
  diamond: (x, y, s) => G(tr(x, y, s), path('M-50 -24L-26 -50L26 -50L50 -24L0 50Z', '#5ec4f0', 6) + path('M-50 -24L50 -24M-26 -50L-12 -24L0 50M26 -50L12 -24L0 50', 'none', 4)),
  clover: (x, y, s) => G(tr(x, y, s), circ(-22, -18, 24, '#36a85a', 5) + circ(22, -18, 24, '#36a85a', 5) + circ(-22, 22, 24, '#36a85a', 5) + circ(22, 22, 24, '#36a85a', 5) + path('M0 0Q10 40 26 60', 'none', 7, '#2a7a40')),
};
const SLOT_ORDER = ['cherry', 'bell', 'seven', 'star', 'bar', 'diamond', 'clover'];

// fond « casino » : velours violet, halos, bokeh de lumières, moquette à motifs
function casinoBg(t) {
  let s = grad('#2a0f3d', '#12061f', -M, -M, W + 2 * M, H + 2 * M) + glow(W / 2, 760, 900, '#ff3d9a', .28) + glow(W / 2, 760, 520, '#ffd23f', .14);
  const r = rng(7);
  for (let i = 0; i < 26; i++) { const x = r() * W, y = r() * 1300, rr = 14 + r() * 40, c = ['#ffd23f', '#ff5c8a', '#5ec4f0', '#b56cff'][i % 4]; s += op(.18 + .14 * Math.sin(t * 2 + i), circ(x, y, rr, c, 0)); }
  s += rect(-M, 1290, W + 2 * M, 1400, '#3a1046', 0, 0);
  for (let i = -8; i < 14; i++) for (let j = 0; j < 6; j++) s += circ(i * 120 + (j % 2) * 60, 1330 + j * 80, 14, '#5a1a66', 0);
  return s;
}

// position d'un rouleau (px) : départ rapide, arrêt avec rebond
function _slotPos(t, t0, t1, P) {
  if (t <= t0) return 0;
  if (t < t1) { const k = (t - t0) / (t1 - t0); return P * (1 - Math.pow(1 - k, 3)); }
  const a = t - t1; return P + Math.sin(a * 26) * 18 * Math.exp(-a * 9);
}
function _slotVel(t, t0, t1, P) { if (t <= t0 || t >= t1) return 0; const k = (t - t0) / (t1 - t0); return 3 * P * Math.pow(1 - k, 2) / (t1 - t0); }
// 3e rouleau « suspense » : ralentit, s'arrête presque sur un LEURRE, avance cran par cran… puis CLAC sur le gagnant
function _slotTease(t, t0, t1, P, cell) {
  const A = t1 - .62, B = t1 - .14;
  if (t <= t0) return 0;
  if (t < A) { const k = (t - t0) / (A - t0); return (P - .8 * cell) * (1 - Math.pow(1 - k, 3)); }
  if (t < B) { const k = (t - A) / (B - A), steps = Math.floor(k * 3) / 3, kk = steps + Math.pow((k * 3) % 1, 4) / 3; return P - .8 * cell + .55 * cell * kk; }
  if (t < t1) { const k = (t - B) / (t1 - B); return P - .25 * cell + .25 * cell * k * k; }
  const a = t - t1; return P + Math.sin(a * 30) * 22 * Math.exp(-a * 8);
}

function slotMachine(t, o = {}) {
  const { x, y, w, h, cell } = SLOT, cx = x + w / 2, acc = o.acc || SX.acc, t0 = o.t0 ?? .35, stops = o.stops || [t0 + .65, t0 + 1, t0 + 1.4];
  const win = o.win || [], done = t > stops[2] + .05, wk = seg(t, stops[2], stops[2] + .25);
  let s = '';
  // --- ombre au sol + flanc droit (fausse 3D) ---
  s += ell(cx + 30, y + h + 30, w * .62, 46, 'rgba(0,0,0,.45)', 0);
  s += path(`M${x + w} ${y - 40}L${x + w + 60} ${y - 70}L${x + w + 60} ${y + h - 30}L${x + w} ${y + h}Z`, '#8a1020', 7);
  s += path(`M${x + w + 4} ${y + 120}L${x + w + 56} ${y + 96}`, 'none', 5, '#c2a040');
  // --- corps avant (dégradé rouge laqué) ---
  const [d1, u1] = vgrad('#ff4a5c', '#b0142a'); s += d1;
  s += `<rect x="${x}" y="${y - 40}" width="${w}" height="${h + 40}" rx="46" fill="${u1}" stroke="${OL}" stroke-width="8"/>`;
  s += rect(x + 22, y - 18, 26, h - 10, 'rgba(255,255,255,.22)', 13, 0);               // reflet vertical
  s += rect(x + 30, y + h - 150, w - 60, 20, '#ffd23f', 10, 5);                         // liseré doré
  // --- fronton (marquee) arrondi avec le titre ---
  const my = 210, mh = 360, mx = x - 20, mw = w + 40;
  const [d2, u2] = vgrad('#ffe27a', '#e0a020'); s += d2;
  s += `<path d="M${mx} ${my + mh}L${mx} ${my + 120}Q${mx} ${my} ${cx} ${my - 30}Q${mx + mw} ${my} ${mx + mw} ${my + 120}L${mx + mw} ${my + mh}Z" fill="${u2}" stroke="${OL}" stroke-width="8"/>`;
  s += path(`M${mx + 60} ${my + mh - 30}L${mx + 60} ${my + 140}Q${mx + 60} ${my + 50} ${cx} ${my + 26}Q${mx + mw - 60} ${my + 50} ${mx + mw - 60} ${my + 140}L${mx + mw - 60} ${my + mh - 30}Z`, '#5a0a1e', 6);
  // ampoules qui chassent (toutes clignotent au jackpot)
  const nb = 26; for (let i = 0; i < nb; i++) {
    const a = Math.PI * (1 - i / (nb - 1)), bx = cx + Math.cos(a) * (mw / 2 - 26), by = my + 130 - Math.sin(a) * 150 + (Math.abs(Math.cos(a)) > .92 ? (1 - Math.abs(Math.sin(a))) * 160 : 0);
    const on = done ? Math.sin(t * 18) > 0 : ((i + Math.floor(t * 12)) % 3 === 0);
    s += circ(bx, by, 12, on ? '#fff6b0' : '#c47a1a', 4) + (on ? op(.55, circ(bx, by, 24, '#fff6b0', 0)) : '');
  }
  for (let j = 0; j < 5; j++) for (const sd of [-1, 1]) { const on = done ? Math.sin(t * 18 + j) > 0 : ((j + Math.floor(t * 12)) % 2 === 0); s += circ(cx + sd * (mw / 2 - 26), my + 170 + j * 38, 11, on ? '#fff6b0' : '#c47a1a', 4); }
  // titre (3 lignes, dernier mot en couleur) — reste dans le fronton (≤ 700 px)
  const ks = Math.min(84, 700 / (.62 * Math.max(6, (o.key || '').length)));
  s += kthin(o.l1 || "POURQUOI C'EST", cx, 300, t, .05, { size: 50 }) + kthin(o.l2 || 'HORRIBLE DE', cx, 370, t, .2, { size: 48 });
  const tk = o.tk ?? stops[2];
  if (t < tk) { const q = '?'.repeat(Math.max(3, Math.min(9, (o.key || '???').length - 2))); s += op(.55 + .45 * Math.abs(Math.sin(t * 7)), ftext(cx, 470 + ks * .36, q.split('').join(' '), { size: ks * .9, fill: '#fff', font: 'Fredoka, sans-serif' })); }
  s += kword(o.key || 'MOT-CLÉ ?', cx, 470, t, tk, { size: ks, fill: SX.acc2 });
  // --- fenêtre des rouleaux ---
  const wy = y + 30, wh = 300, rw = 210, gap = 22, rx0 = cx - (rw * 3 + gap * 2) / 2;
  s += rect(rx0 - 26, wy - 26, rw * 3 + gap * 2 + 52, wh + 52, '#2b2420', 30, 7) + rect(rx0 - 14, wy - 14, rw * 3 + gap * 2 + 28, wh + 28, '#ffd23f', 22, 5);
  for (let r = 0; r < 3; r++) {
    const X = rx0 + r * (rw + gap), N = 9 + r * 3, P = N * cell, tease = r === 2 && o.tease !== false, pf = u => tease ? _slotTease(u, t0 + r * .06, stops[r], P, cell) : _slotPos(u, t0 + r * .06, stops[r], P), p = pf(t), v = Math.abs(pf(t + .01) - p) / .01;
    const blur = Math.min(1, v / 3500), cyR = wy + wh / 2;
    let inner = rect(X, wy, rw, wh, '#fffaf0', 0, 0);
    for (let i = 0; i <= N; i++) {
      const sy = cyR - i * cell + p; if (sy < wy - cell || sy > wy + wh + cell) continue;
      const isWin = i === N, sym = isWin && win[r] ? win[r] : (i === N - 1 && r === 2 ? (o.decoy || SLOT_SYMS.seven) : SLOT_SYMS[SLOT_ORDER[(i * 3 + r * 2) % SLOT_ORDER.length]]);
      const pulse = isWin && done ? 1 + .08 * Math.sin((t - stops[2]) * 14) : 1;
      const g = sym(0, 0, .95 * pulse, t);
      inner += G(`translate(${f1(X + rw / 2)} ${f1(sy)}) scale(1 ${f1(1 + blur * .6)})`, blur > .15 ? op(1 - blur * .5, g) + op(blur * .35, G(`translate(0 ${f1(-40 * blur)})`, g)) : g);
    }
    // ombrage cylindrique (haut/bas sombres) + reflet
    const [d3, u3] = vgrad('rgba(0,0,0,.55)', 'rgba(0,0,0,0)'), [d4, u4] = vgrad('rgba(0,0,0,0)', 'rgba(0,0,0,.55)');
    inner += d3 + d4 + `<rect x="${X}" y="${wy}" width="${rw}" height="${wh * .32}" fill="${u3}"/><rect x="${X}" y="${wy + wh * .68}" width="${rw}" height="${wh * .32}" fill="${u4}"/>`;
    inner += rect(X + 14, wy + 10, 22, wh - 20, 'rgba(255,255,255,.35)', 11, 0);
    if (blur > .1) for (let k = 0; k < 6; k++) inner += op(blur * .5, line(X + 30 + k * 30, wy, X + 30 + k * 30, wy + wh, 3, 'rgba(120,120,140,.5)'));
    s += clipR(X, wy, rw, wh, inner, 14) + rect(X, wy, rw, wh, 'none', 14, 6);
    if (t > stops[r] && t < stops[r] + .25) s += op(1 - seg(t, stops[r], stops[r] + .25), rect(X, wy, rw, wh, '#fff', 14, 0));
  }
  // ligne de paiement + flèches
  const ply = wy + wh / 2, plc = done ? (Math.sin(t * 20) > 0 ? '#ff3d6e' : '#fff6b0') : '#ff3d6e';
  s += op(done ? 1 : .7, line(rx0 - 6, ply, rx0 + rw * 3 + gap * 2 + 6, ply, done ? 8 : 5, plc));
  s += path(`M${rx0 - 40} ${ply - 22}L${rx0 - 12} ${ply}L${rx0 - 40} ${ply + 22}Z`, '#ffd23f', 5) + path(`M${rx0 + rw * 3 + gap * 2 + 40} ${ply - 22}L${rx0 + rw * 3 + gap * 2 + 12} ${ply}L${rx0 + rw * 3 + gap * 2 + 40} ${ply + 22}Z`, '#ffd23f', 5);
  // --- panneau : écran crédits + boutons ---
  const py = wy + wh + 60;
  s += rect(x + 60, py, 300, 80, '#1a0a14', 14, 6) + ftext(x + 210, py + 54, done ? 'JACKPOT' : t > t0 ? (Math.sin(t * 9) > 0 ? 'QUI ?' : '') : 'CRÉDITS 001', { size: 36, fill: done && Math.sin(t * 16) > 0 ? '#ff5c8a' : '#ffd23f', stroke: 'none', font: 'Fredoka, sans-serif' });
  [['#5ec4f0', 0], ['#7be07b', 1], ['#ffd23f', 2]].forEach(([c, i]) => { const press = i === 2 && t > t0 - .2 && t < t0 + .1 ? 6 : 0; s += ell(x + 430 + i * 105, py + 52, 40, 16, shade(c, -.35), 5) + ell(x + 430 + i * 105, py + 40 + press, 40, 16, c, 5); });
  // --- bac à pièces + pièces qui jaillissent au jackpot ---
  const ty = y + h - 110;
  s += rect(cx - 220, ty, 440, 90, '#2b2420', 24, 7) + rect(cx - 196, ty + 16, 392, 50, '#c2a040', 16, 4);
  if (done) { const r = rng(11); for (let i = 0; i < 26; i++) { const a = t - stops[2] - r() * .3; if (a < 0) continue; const vx = (r() - .5) * 900, vy = -500 - r() * 700, px = cx + vx * a, pyy = ty + 30 + vy * a + 1400 * a * a; if (pyy > 1900) continue; s += G(tr(px, pyy, 1, a * 500), ell(0, 0, 26 * Math.abs(Math.cos(a * 9 + i)) + 4, 26, '#ffd23f', 5) + ftext(0, 9, '€', { size: 24, fill: '#c9962b', stroke: 'none' })); } }
  // --- levier (côté droit, tiré à t0) ---
  const lk = t < t0 - .35 ? 0 : t < t0 ? eOutCubic(seg(t, t0 - .35, t0)) : 1 - eOutBack(seg(t, t0, t0 + .5)) * 1, ang = lerp(-8, 62, clamp(lk));
  s += rect(x + w + 30, y + 180, 50, 120, '#9aa3ad', 14, 6);
  s += G(`translate(${x + w + 55} ${y + 240}) rotate(${f1(ang)})`, rect(-9, -300, 18, 300, '#c9ced6', 9, 5) + circ(0, -310, 44, '#e2463a', 6) + ell(-14, -324, 12, 9, 'rgba(255,255,255,.7)', 0));
  // suspense : tout s'assombrit sauf le 3e rouleau (projecteur), puis lumière au jackpot
  const dk = o.tease === false ? 0 : seg(t, stops[1], stops[1] + .3) * (1 - seg(t, stops[2], stops[2] + .1));
  if (dk > 0) { const X3 = rx0 + 2 * (rw + gap); s += op(.62 * dk, `<path fill-rule="evenodd" fill="#05010a" d="M${-M} ${-M}H${W + M}V${H + M}H${-M}Z M${X3 - 8} ${wy - 8}h${rw + 16}v${wh + 16}h${-rw - 16}Z"/>`) + op(dk * (.5 + .2 * Math.sin(t * 20)), glow(X3 + rw / 2, wy + wh / 2, 260, '#fff6b0', .35)); }
  // éclat final
  if (done) s += op(1 - wk * .7, glow(cx, ply, 520, '#fff6b0', .35)) + sparkle(rx0 - 50, wy - 30, .9 * pop(t, stops[2]), '#fff6b0') + sparkle(rx0 + rw * 3 + gap * 2 + 50, wy - 20, 1.1 * pop(t, stops[2] + .1), '#fff6b0');
  return s;
}
// bruitages calés : levier, rouleaux (tic-tic), arrêt de chaque rouleau, jackpot + pièces
function slotSfx(t0, stops) {
  const A = stops[2] - .62, B = stops[2] - .14;
  return [[Math.max(0, t0 - .3), 'squeak', .5], [t0, 'slot', .7], [t0 + .15, 'clock_fast', .3], [stops[0], 'thud', .5], [stops[1], 'thud', .5],
    [stops[1] + .05, 'heartbeat', .6], [A, 'tick', .6], [A + (B - A) / 3, 'tick', .6], [A + 2 * (B - A) / 3, 'tick', .65],
    [stops[2], 'boom', .6], [stops[2] + .02, 'jackpot', .7], [stops[2] + .15, 'coins', .6]];
}
// caméra du plan 1 : pousse lentement vers le 3e rouleau pendant le suspense, recule d'un coup au jackpot
function slotCam(t, t0, stops) {
  const k = eInOut(seg(t, stops[1] - .1, stops[2] - .1)) * (1 - eOutCubic(seg(t, stops[2] + .02, stops[2] + .35)));
  return { z: 1 + .5 * k, cx: 772, cy: 770, x: (540 - 772) * .9 * k, hand: .15 + .2 * k, shake: t > stops[2] && t < stops[2] + .35 ? 9 : 0 };
}
