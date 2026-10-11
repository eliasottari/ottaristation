// ============================================================
//  Accessoires de l'épisode « cerveau » (style flow)
// ============================================================
const CX = W / 2;
const BRAIN = '#f4a6b8', BRAIN_D = '#d97d96';
const kf = (t, keys, ease = eInOut) => { // images clés de caméra [[t, {x,y,zoom}], ...]
  if (t <= keys[0][0]) return Object.assign({}, keys[0][1]);
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, a] = keys[i], [t1, b] = keys[i + 1];
    if (t <= t1) { const k = ease(seg(t, t0, t1)); return { x: lerp(a.x || 0, b.x || 0, k), y: lerp(a.y || 0, b.y || 0, k), zoom: lerp(a.zoom ?? 1, b.zoom ?? 1, k) }; }
  }
  return Object.assign({}, keys[keys.length - 1][1]);
};
const val = (t, keys, ease = eInOut) => { if (t <= keys[0][0]) return keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (t <= t1) return lerp(a, b, ease(seg(t, t0, t1))); } return keys[keys.length - 1][1]; };
const exprAt = (t, list) => { let e = list[0][1]; for (const [t0, x] of list) if (t >= t0) e = x; return e; };
const M = 900;

// ---------- cerveau / bocal ----------
function brain(x, y, s = 1, t = 0, o = {}) {
  const d = 'M-110 10C-130 -40 -100 -90 -50 -95C-30 -125 30 -125 50 -95C100 -95 130 -50 115 0C125 40 95 75 50 70C30 90 -30 90 -50 70C-100 75 -125 45 -110 10Z';
  let s_ = path(d, o.col || BRAIN, 6);
  s_ += path('M-70 -60Q-40 -40 -60 -10Q-80 20 -50 40M-10 -90Q10 -60 -10 -30Q-30 0 0 20Q20 40 0 70M40 -80Q70 -60 50 -30Q35 0 70 20M-95 0Q-80 10 -90 30M90 -10Q75 10 95 30', 'none', 5, o.fold || BRAIN_D);
  s_ += path('M-20 72Q-10 110 -18 130M10 72Q8 100 18 120', 'none', 14, o.col || BRAIN) + path('M-20 72Q-10 110 -18 130M10 72Q8 100 18 120', 'none', 4, BRAIN_D);
  if (o.spark) for (let i = 0; i < 5; i++) { const a = t * 3 + i * 1.26, rr = 120 + 20 * Math.sin(t * 9 + i); s_ += op(.5 + .5 * Math.sin(t * 13 + i * 2), path(`M${f1(Math.cos(a) * rr * .6)} ${f1(Math.sin(a) * rr * .5)}l${f1(Math.cos(a) * 30)} ${f1(Math.sin(a) * 20 - 14)}l-12 10l${f1(Math.cos(a) * 30)} ${f1(Math.sin(a) * 18)}`, 'none', 6, '#fff3a0')); }
  return G(tr(x, y + wave(t, .5, 6 * (o.float ?? 1)), s, wave(t, .3, 3 * (o.float ?? 1))), s_);
}
// bocal : origine = bas centre, ~260×320 à s=1
function jar(x, y, s, t, o = {}) {
  const w = 240, h = 300;
  let b = '';
  const liq = o.liquid ?? '#ffb23f', lv = o.level ?? .78;
  b += rect(-w / 2, -h, w, h, 'rgba(230,245,255,.35)', 34, 0);
  b += grad(shade(liq, .35), liq, -w / 2 + 8, -h * lv, w - 16, h * lv - 8).replace('<rect', '<rect rx="28"');
  if (o.glow) b = glow(0, -h * .45, 260, '#ffe08a', .55 * o.glow) + b;
  if (o.inner) b += o.inner;
  for (let i = 0; i < 6; i++) { const k = (t * .6 + i / 6) % 1; b += circ(-80 + i * 32, -10 - k * h * lv * .9, 5 + (i % 3) * 3, 'rgba(255,255,255,.55)', 0); }
  b += rect(-w / 2, -h, w, h, 'none', 34) + path(`M${-w / 2 + 26} ${-h + 40}L${-w / 2 + 26} ${-h * .3}`, 'none', 12, 'rgba(255,255,255,.75)') + path(`M${w / 2 - 34} ${-h + 50}L${w / 2 - 34} ${-h + 110}`, 'none', 8, 'rgba(255,255,255,.55)');
  b += rect(-w / 2 - 10, -h - 34, w + 20, 44, o.lid || '#c9ccd4', 12) + (o.lidKnob ? circ(0, -h - 46, 22, o.lid, 5) : '');
  if (o.specs) b += G(tr(0, -h * .45, 1), circ(-46, 0, 34, 'rgba(255,255,255,.2)', 7) + circ(46, 0, 34, 'rgba(255,255,255,.2)', 7) + line(-12, 0, 12, 0, 7));
  const out = G(tr(x, y, s, o.r || 0), b);
  return o.glow ? bloom(out, 16, .55 * o.glow) : out;
}
const jarBrain = (x, y, s, t, o = {}) => jar(x, y, s, t, Object.assign({ inner: brain(0, -130, .78, t, o) }, o));

// ---------- mouche 2D (vue de profil 3/4) ----------
function fly2(x, y, s, t, o = {}) {
  let g = '';
  const legs = [-40, 0, 40];
  legs.forEach((lx, i) => { const a = Math.sin(t * 12 + i * 2) * 8 * (o.walk || 0); g += path(`M${lx} 10L${lx + 14 + a} 50L${lx + 4 + a} 86`, 'none', 6); });
  g += G(tr(30, -10, 1, -18), ell(70, -10, 90, 34, 'rgba(225,245,255,.6)', 4));
  for (let i = 0; i < 4; i++) g += ell(70 + i * 26, 6, 44 - i * 4, 46 - i * 6, i % 2 ? '#3a2412' : '#e6a43c', 5);
  g += ell(0, 0, 54, 44, '#b8702a', 6) + circ(-62, 0, 34, '#c98a3a', 6) + circ(-72, -6, 24, '#d8232c', 5) + circ(-78, -12, 6, '#fff', 0);
  g += path('M-58 -32Q-70 -70 -50 -86M-64 -30Q-90 -64 -84 -84', 'none', 4);
  return G(tr(x, y, s, o.r || 0) + (o.flip ? ' scale(-1 1)' : ''), g);
}
// dôme de verre sur socle (origine = bas)
function dome(x, y, s, inner = '', o = {}) {
  return G(tr(x, y, s), rect(-200, -40, 400, 60, '#2f3a4a', 14) + rect(-170, -70, 340, 40, '#f1e7c8', 10, 5) + inner +
    path('M-180 -60L-180 -200A180 180 0 0 1 180 -200L180 -60Z', 'rgba(205,240,255,.28)', 8, o.ring || '#2f8f95') + path('M-120 -250Q-90 -320 -20 -350', 'none', 14, 'rgba(255,255,255,.7)'));
}
// ---------- écrans ----------
function monitor(x, y, w, h, screen = '', o = {}) { // (x,y) = coin haut-gauche de l'ÉCRAN
  return (o.stand !== false ? rect(x + w / 2 - 26, y + h, 52, o.standH || 120, '#3a3f4b', 6) + rect(x + w / 2 - 110, y + h + (o.standH || 120) - 10, 220, 30, '#3a3f4b', 12) : '') +
    rect(x - 22, y - 22, w + 44, h + 44, o.frame || '#262b36', 18) + screen + rect(x, y, w, h, 'none', 6, 4, '#11141b') + path(`M${x + 20} ${y + 20}L${x + w * .35} ${y + 20}`, 'none', 8, 'rgba(255,255,255,.12)');
}
const scr = (x, y, w, h, svg) => inRect({ x, y, w, h }, svg, 6);
function termText(x, y, lines, size = 34, col = '#9fe7ff') { return lines.map((l, i) => `<text x="${x}" y="${y + i * size * 1.35}" font-family="monospace" font-weight="700" font-size="${size}" fill="${col}">${l}</text>`).join(''); }
function bar(x, y, w, h, k, c = '#5ad1ff') { return rect(x, y, w, h, 'rgba(255,255,255,.1)', h / 2, 3, c) + rect(x + 4, y + 4, Math.max(0, (w - 8) * k), h - 8, c, (h - 8) / 2, 0); }
// bureau virtuel (contenu plein cadre 1080×1920)
function desktop(t, inner = '', date = '01/01/2026') {
  return grad('#5cb8ff', '#cdeeff', 0, 0, W, 1300) + cloud(260, 300, 1.3) + cloud(820, 520, 1.0) +
    path(`M-100 1150Q300 900 700 1050Q1000 1150 1200 1000L1200 ${H}L-100 ${H}Z`, '#5ec24c', 0) + path(`M-100 1350Q400 1200 1200 1380L1200 ${H}L-100 ${H}Z`, '#4aa83c', 0) +
    rect(40, 980, 150, 190, '#f2c94c', 8, 5) + text(115, 1210, 'none', 'SOUVENIRS', '#fff', 30) + rect(860, 960, 170, 210, '#fff', 8, 5) + text(945, 1210, 'none', 'VÉLO', '#fff', 30) +
    inner + rect(0, H - 150, W, 150, '#1f3d8a', 0, 0) + rect(30, H - 120, 200, 90, '#3f7df0', 14, 0) + text(130, H - 60, 'none', 'démarrer', '#fff', 40) +
    `<text x="${W - 40}" y="${H - 90}" font-family="monospace" font-size="38" font-weight="700" text-anchor="end" fill="#fff">12:00</text><text x="${W - 40}" y="${H - 45}" font-family="monospace" font-size="34" font-weight="700" text-anchor="end" fill="#fff">${date}</text>`;
}
function errBox(x, y, s, msg = "Une erreur s'est produite.") {
  return G(tr(x, y, s), rect(-330, -170, 660, 340, '#eef0f4', 6, 6, '#2b3b6a') + rect(-330, -170, 660, 66, '#2f5fd0', 6, 0) + `<text x="-300" y="-122" font-family="Fredoka" font-size="38" font-weight="700" fill="#fff">Erreur</text>` + rect(268, -158, 46, 42, '#e2463a', 6, 3) + path('M281 -147L301 -127M301 -147L281 -127', 'none', 5, '#fff') +
    `<text x="0" y="0" font-family="Fredoka" font-size="38" font-weight="700" fill="#333" text-anchor="middle">${msg}</text>` + rect(-80, 60, 160, 66, '#fff', 6, 4, '#556') + text(0, 106, 'none', 'OK', '#333', 38));
}
// ---------- polaroïds / liège ----------
function clipR(x, y, w, h, svg, rr = 0) { const id = 'cl' + (_gid++); return `<defs><clipPath id="${id}"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rr}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }
function polaroid(x, y, s, r, inner = '', o = {}) { return G(tr(x, y, s, r), rect(-150, -170, 300, 360, '#fdfbf5', 6, 5) + clipR(-125, -145, 250, 250, G(tr(-125, -145, 1), rect(0, 0, 250, 250, o.bg || '#bfe2ff', 0, 0) + inner)) + rect(-125, -145, 250, 250, 'none', 2, 4)); }
function pin(x, y, c = '#e2463a') { return ell(x + 6, y + 8, 18, 10, 'rgba(0,0,0,.25)', 0) + circ(x, y, 18, c, 5) + circ(x - 5, y - 5, 5, 'rgba(255,255,255,.7)', 0); }
function cork(x0 = -M, y0 = -M, w = W + 2 * M, h = H + 2 * M) { let s = rect(x0, y0, w, h, '#d29a5a', 0, 0); const r = rng(5); for (let i = 0; i < 500; i++) s += circ(x0 + r() * w, y0 + r() * h, 3 + r() * 5, r() < .5 ? '#c08446' : '#e0ad70', 0); return s; }
// mini scènes pour polaroïds (250×250)
const PH = {
  beach: () => rect(0, 0, 250, 150, '#8fd3ff', 0, 0) + circ(190, 50, 26, '#ffe066', 0) + rect(0, 150, 250, 100, '#f3d9a4', 0, 0) + path('M0 150Q60 135 125 150T250 150', 'none', 8, '#fff'),
  duck: () => rect(0, 0, 250, 250, '#c9ecff', 0, 0) + ell(130, 170, 70, 46, '#ffd23f', 5) + circ(90, 120, 34, '#ffd23f', 5) + path('M58 118L30 126L58 132Z', '#ff8a3d', 4) + circ(84, 112, 6, OL, 0),
  cake: () => rect(0, 0, 250, 250, '#ffe7ef', 0, 0) + rect(55, 130, 140, 80, '#fff', 14, 5) + rect(55, 130, 140, 26, '#ff9ab8', 10, 0) + [0, 1, 2, 3].map(i => rect(78 + i * 30, 96, 10, 34, '#7ad0ff', 3, 3) + ell(83 + i * 30, 88, 6, 10, '#ffb23f', 0)).join(''),
  me: () => rect(0, 0, 250, 250, '#9ccfe8', 0, 0) + circ(125, 100, 52, HEADW, 5) + G(tr(125, 100, .52), head({ hr: 100, skin: HEADW, cheeks: false, expr: 'dot', hairFn: HAIRS.beret('#3b3040') }, 0)) + rect(85, 160, 80, 100, '#e8724a', 30, 5),
  bike: () => rect(0, 0, 250, 250, '#cfeec0', 0, 0) + circ(70, 190, 40, 'none', 7) + circ(180, 190, 40, 'none', 7) + path('M70 190L120 150L180 190M120 150L110 120', 'none', 7, '#e2463a') + G(tr(120, 150, .3), stick({ body: '#e8724a', hair: 'beret', expr: 'glee', legLen: 0, shadow: false }, 0)),
};

// ---------- décors ----------
function workshop() {
  let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#cfe5e2', 0, 0);
  for (let y = -M; y < 1300; y += 90) for (let x = -M + (y / 90 % 2) * 60; x < W + M; x += 120) s += rect(x, y, 116, 86, '#d8ece9', 4, 2, '#b7d3cf');
  s += rect(110, 280, 860, 560, '#d9a35f', 10) ; const r = rng(3); for (let i = 0; i < 22; i++) for (let j = 0; j < 12; j++) s += circ(140 + i * 37, 310 + j * 44, 4, '#8a5a2a', 0);
  s += G(tr(330, 420, 1, -8), rect(-120, -20, 240, 40, '#c9ced6', 6, 5) + rect(-150, -26, 60, 52, '#e2463a', 8, 5)) + G(tr(640, 400), line(-60, 0, 60, 0, 10) + rect(-90, -30, 60, 60, '#888', 6, 5)) + rect(780, 350, 26, 120, '#e2463a', 6, 5) + rect(820, 350, 26, 120, '#3f7df0', 6, 5) + rect(860, 350, 26, 120, '#f2c94c', 6, 5) + rect(250, 600, 170, 130, '#fffaf0', 4, 4) + `<text x="335" y="650" font-family="Fredoka" font-size="30" fill="#333" text-anchor="middle">PLAN</text>`;
  s += path('M900 500L1000 430L1060 560L960 600Z', '#2f78a8', 7);
  s += rect(-60, 160, 200, 300, '#bfe6ff', 6) + line(40, 160, 40, 460, 7);
  return s;
}
function workbench() { return rect(-M, 1240, W + 2 * M, 60, '#e3b77a', 6) + rect(-M, 1300, W + 2 * M, 900, '#c98d4e', 0, 6) + rect(40, 1340, 440, 200, '#d49a5c', 8) + rect(540, 1340, 440, 200, '#d49a5c', 8) + rect(200, 1430, 120, 18, '#eee', 8, 4) + rect(700, 1430, 120, 18, '#eee', 8, 4); }
function houses(x0) {
  let s = '';
  for (let i = 0; i < 9; i++) {
    const x = x0 + i * 620, c = ['#f1e3c8', '#e3ecd8', '#f2d6c9', '#dfe6f0'][i % 4];
    s += rect(x, 520, 560, 620, c, 6) + path(`M${x - 30} 540L${x + 280} 330L${x + 590} 540Z`, '#6d7f95', 7);
    for (const wx of [60, 330]) s += rect(x + wx, 640, 170, 180, '#bfe2ff', 6) + line(x + wx + 85, 640, x + wx + 85, 820, 6) + rect(x + wx - 26, 640, 22, 180, '#3d6b4f', 4, 4) + rect(x + wx + 174, 640, 22, 180, '#3d6b4f', 4, 4);
    s += rect(x + 220, 900, 120, 240, '#3a5fa8', 8) + circ(x + 320, 1020, 8, '#f2c94c', 3) + rect(x + 255, 860, 50, 30, '#fff', 4, 3) + text(x + 280, 884, 'none', String(12 + i * 2), '#333', 26);
  }
  return s;
}
function fence(x0, y = 1080) { let s = rect(x0, y + 50, 6000, 24, '#fff', 4, 5) + rect(x0, y + 130, 6000, 24, '#fff', 4, 5); for (let i = 0; i < 160; i++) s += path(`M${x0 + i * 40} ${y + 200}L${x0 + i * 40} ${y + 10}L${x0 + i * 40 + 13} ${y - 10}L${x0 + i * 40 + 26} ${y + 10}L${x0 + i * 40 + 26} ${y + 200}Z`, '#fbfbf8', 5); return s; }
function bushes(x0, y = 1000, n = 30, seed = 4) { let s = ''; const r = rng(seed); for (let i = 0; i < n; i++) { const x = x0 + i * 190 + r() * 60; s += circ(x, y, 80 + r() * 40, ['#6fb34a', '#5ea33f', '#7cc255'][i % 3], 6) + circ(x + 70, y + 20, 70, '#62a843', 6); } return s; }
function airPump(x, y, s, t, o = {}) {
  return G(tr(x, y, s), rect(-130, -560, 260, 560, '#e2463a', 18) + rect(-100, -520, 200, 90, '#2f5fd0', 8, 5) + text(-20, -458, 'none', 'AIR', '#fff', 54) + `<text x="40" y="-490" font-family="Fredoka" font-weight="700" font-size="24" fill="#fff">& EAU</text>` +
    rect(-90, -400, 70, 90, '#dfe3ea', 6, 5) + rect(0, -400, 100, 60, '#1d4a2e', 6, 5) + `<text x="50" y="-360" font-family="monospace" font-weight="700" font-size="28" fill="#5dff9a" text-anchor="middle">${o.psi || 'PRÊT'}</text>` +
    circ(0, -240, 52, '#fff', 6) + line(0, -240, 30 * Math.cos(R(-140 + (o.needle || 0) * 200)), -240 + 30 * Math.sin(R(-140 + (o.needle || 0) * 200)), 6, '#e2463a') + rect(-150, 0, 300, 30, '#9aa3ad', 6, 5) + rect(10, -180, 90, 50, '#f2c94c', 6, 5));
}
function gasSign(x, y, s) { return G(tr(x, y, s), rect(-22, 0, 44, 700, '#bfc5cd', 4, 5) + rect(-170, -360, 340, 360, '#fff', 10) + rect(-170, -360, 340, 110, '#e2463a', 10) + text(0, -275, 'none', 'ESSENCE', '#fff', 64) + rect(-140, -220, 280, 80, '#222', 6, 0) + `<text x="-120" y="-168" font-size="28" font-family="Fredoka" fill="#fff">SP95</text><text x="120" y="-166" font-size="40" font-family="monospace" font-weight="700" fill="#ffd23f" text-anchor="end">1,89€</text>` + rect(-140, -120, 280, 80, '#222', 6, 0) + `<text x="-120" y="-68" font-size="28" font-family="Fredoka" fill="#fff">GAZOLE</text><text x="120" y="-66" font-size="40" font-family="monospace" font-weight="700" fill="#ffd23f" text-anchor="end">1,79€</text>`); }
function cake(x, y, s, n, t, lit = 1) {
  let c = ell(0, 10, 230, 40, '#f4f4f4', 5) + rect(-190, -170, 380, 180, '#fff5e8', 40) + rect(-190, -170, 380, 60, '#ffb3c7', 30, 0) + path('M-190 -120Q-150 -90 -110 -120Q-70 -90 -30 -120Q10 -90 50 -120Q90 -90 130 -120Q160 -95 190 -120', 'none', 7, '#ff8fb0');
  const cols = ['#7ad0ff', '#ffd23f', '#9be37b', '#ff8fb0', '#c59bff'];
  for (let i = 0; i < n; i++) { const r_ = rng(i + 3); const cx = -170 + ((i * 37) % 340) + r_() * 10, cy = -170 - (Math.floor(i / 9) % 3) * 8; c += rect(cx - 7, cy - 70, 14, 72, cols[i % 5], 4, 3) + (lit ? op(.9, ell(cx, cy - 84 + wave(t, 3, 2, i * .1), 8, 14, '#ffb23f', 0) + ell(cx, cy - 80, 4, 7, '#fff4b0', 0)) : ''); }
  return bloom(G(tr(x, y, s), c), 10, .35);
}
function laptop(x, y, s, screen = '#4aa8ff') { return G(tr(x, y, s), path('M-170 0L170 0L200 30L-200 30Z', '#cfd6df', 6) + rect(-150, -200, 300, 200, '#2b2f3a', 12, 6) + rect(-132, -184, 264, 168, screen, 6, 0) + path('M-60 -110Q0 -150 50 -100Q20 -70 -60 -110Z', 'rgba(255,255,255,.6)', 0)); }
function recycleBin(x, y, s) { return G(tr(x, y, s), path('M-90 -260L90 -260L76 0L-76 0Z', '#3aa45a', 7) + rect(-100, -290, 200, 40, '#2f8a4a', 10) + G(tr(0, -140, 1.1), path('M-30 20L0 -30L30 20Z', 'none', 8, '#fff'))); }
function roundTable(x, y, s) { return G(tr(x, y, s), rect(-14, -180, 28, 180, '#8d96a3', 4, 5) + ell(0, 0, 130, 22, '#7d8693', 5) + ell(0, -190, 240, 40, '#e9c98f', 7)); }
function bikeSvg(x, y, s, t, rot = 1) {
  const wh = (cx) => circ(cx, 0, 110, 'none', 10) + circ(cx, 0, 110, 'none', 4, '#555') + [0, 1, 2].map(i => { const a = t * 8 * rot + i * 2.09; return line(cx + Math.cos(a) * 100, Math.sin(a) * 100, cx - Math.cos(a) * 100, -Math.sin(a) * 100, 3, '#777'); }).join('');
  return G(tr(x, y, s), wh(-190) + wh(190) + path('M-190 0L-40 -180L130 -180L190 0M-40 -180L-10 0L130 -180M-10 0L-190 0M130 -180L120 -250M90 -250L150 -250M-40 -180L-60 -230M-100 -235L-20 -235', 'none', 14, '#e2463a') + circ(-10, 0, 26, '#555', 5));
}
function officeBg(x0 = -M) {
  let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#f2f2ee', 0, 0);
  for (let i = 0; i < 6; i++) { const x = x0 + 120 + i * 420; s += rect(x, 120, 360, 640, '#bfe0f7', 6) + rect(x + 40, 400, 70, 360, '#d9ecf8', 0, 0) + rect(x + 150, 300, 90, 460, '#d0e6f5', 0, 0) + rect(x + 260, 450, 60, 310, '#d9ecf8', 0, 0) + rect(x, 120, 360, 640, 'none', 6) + line(x + 180, 120, x + 180, 760, 6); }
  return s;
}
function copier(x, y, s, t, k = 0) { return G(tr(x, y, s), rect(-170, -360, 340, 360, '#f4f4f2', 14) + rect(-170, -400, 340, 50, '#dcdcd8', 10) + rect(-140, -300, 280, 70, '#e8e8e4', 8, 5) + rect(-140, -200, 280, 70, '#e8e8e4', 8, 5) + rect(-140, -100, 280, 70, '#e8e8e4', 8, 5) + op(k, rect(-150, -420, 300, 16, '#fff', 4, 0) + `<rect x="-150" y="-424" width="300" height="24" fill="#bff3ff" opacity="${(.4 + .4 * Math.sin(t * 20)).toFixed(2)}"/>`)); }
function powerStrip(x, y, s, plugK = 0, cord = '#f08a24') {
  let g = rect(-260, -50, 520, 100, '#f6f6f2', 14) + [-180, -90, 0].map(px => rect(px - 30, -30, 60, 60, '#e2e2dc', 8, 4) + rect(px - 14, -14, 8, 18, OL, 2, 0) + rect(px + 6, -14, 8, 18, OL, 2, 0)).join('') + rect(170, -26, 50, 52, '#e2463a', 6, 4);
  const px = 90 + plugK * 60, py = -plugK * 120, pr = plugK * 50;
  g += G(tr(px, py, 1, pr), rect(-34, -38, 68, 76, cord, 10, 5));
  return G(tr(x, y, s), g);
}
function xray(x, y, s, t, k = 0) {
  let g = rect(-180, -260, 360, 520, '#0d1f3d', 10, 8, '#2b3550') + rect(-160, -240, 320, 480, '#16325c', 4, 0);
  g += bloom(circ(0, -120, 90, 'none', 10, '#cfe6ff') + path('M-20 -30L-20 200M20 -30L20 200', 'none', 10, '#cfe6ff') + [0, 1, 2, 3, 4].map(i => path(`M-110 ${-10 + i * 46}Q0 ${10 + i * 46} 110 ${-10 + i * 46}`, 'none', 9, '#cfe6ff')).join(''), 8, .6);
  if (k > 0) g += bloom(path(`M0 230L0 ${f1(230 - 300 * Math.min(1, k * 1.4))}`, 'none', 14, '#5af0ff') + op(clamp(k * 2 - .8), circ(0, -120, 80, 'rgba(90,240,255,.5)', 0) + brain(0, -120, .55, t, { col: '#5af0ff', fold: '#1bb0d0', float: 0 })), 14, .9);
  return G(tr(x, y, s), g);
}
function slicer(x, y, s, t, spin = 0) { return G(tr(x, y, s), rect(-230, -40, 460, 80, '#c9ced6', 12) + G(`rotate(${spin * 720})`, circ(0, -200, 170, '#e8eef4', 8) + circ(0, -200, 140, '#f6f9fc', 0) + line(-120, -200, 120, -200, 4, '#cfd8e2') + line(0, -320, 0, -80, 4, '#cfd8e2')) + circ(0, -200, 28, '#9aa3ad', 6) + path('M-150 -360Q0 -440 150 -360', 'none', 12, '#9aa3ad')); }
function counter(x, y, s, n) { const str = String(Math.round(n)).padStart(4, '0'); return G(tr(x, y, s), rect(-130, -50, 260, 100, '#fff', 8) + [...str].map((c, i) => rect(-118 + i * 60, -38, 52, 76, '#f4f4f4', 6, 4) + `<text x="${-92 + i * 60}" y="22" font-family="monospace" font-size="56" font-weight="700" text-anchor="middle" fill="#222">${c}</text>`).join('')); }
function form(x, y, s, t, o = {}) {
  let g = rect(-380, -520, 760, 1040, '#fffdf7', 16, 7) + text(0, -420, 'none', o.brand || 'ÉTERNO', '#9a7ce6', 70) + text(0, -340, 'none', 'Vivez pour toujours*', '#444', 52);
  ['Gardez tous vos souvenirs', 'Ne vieillissez plus jamais', 'Paiement en 3 fois'].forEach((l, i) => { g += path(`M-300 ${-250 + i * 70}l14 16l26 -32`, 'none', 7, '#4caf6a') + `<text x="-250" y="${-238 + i * 70}" font-family="Fredoka" font-size="40" fill="#555">${l}</text>`; });
  g += `<text x="-320" y="0" font-family="Fredoka" font-size="38" font-weight="700" fill="#9a7ce6">SIGNEZ ICI</text>` + line(-320, 90, 320, 90, 5, '#888') + path('M-310 40l30 30M-280 40l-30 30', 'none', 7, '#e2463a');
  g += `<text x="-320" y="200" font-family="Fredoka" font-size="38" fill="#666">*La procédure est mortelle à <tspan font-weight="700" fill="#222">100 %</tspan>.</text>`;
  g += `<text x="-320" y="260" font-family="Fredoka" font-size="22" fill="#aaa">Offre non remboursable. Aucune garantie de vous réveiller. Voir conditions en magasin.</text>`;
  if (o.circle > 0) { const k = o.circle; g += path(`M150 160C260 120 360 170 340 215C320 255 150 255 120 215C${f1(100 - 10 * k)} 190 140 150 ${f1(230 + 60 * (1 - k))} 145`, 'none', 9, '#e2463a', `stroke-dasharray="900" stroke-dashoffset="${f1(900 * (1 - k))}"`); }
  return G(tr(x, y, s, o.r || 0), g);
}
function idCard(x, y, s, r) { return G(tr(x, y, s, r), rect(-230, -150, 460, 300, '#fff', 18, 6) + rect(-230, -150, 460, 70, '#2f5fd0', 16, 0) + text(0, -100, 'none', 'PERMIS DE CONDUIRE', '#fff', 34) + rect(-200, -60, 150, 180, '#bfe2ff', 6, 4) + G(tr(-125, 40, .5), head({ hr: 100, skin: HEADW, cheeks: false, expr: 'dot', hairFn: HAIRS.beret('#3b3040') }, 0)) + `<text x="-20" y="-20" font-family="Fredoka" font-size="30" fill="#888">NOM</text><text x="-20" y="30" font-family="Fredoka" font-size="56" font-weight="700" fill="#222">TOI</text><text x="-20" y="80" font-family="Fredoka" font-size="24" fill="#888">YEUX : 2</text>`); }
