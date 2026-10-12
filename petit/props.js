// ============================================================
//  Accessoires « petit »
// ============================================================
const CX = W / 2, M = 900;
const kf = (t, keys, ease = eInOut) => { if (t <= keys[0][0]) return Object.assign({}, keys[0][1]); for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (t <= t1) { const k = ease(seg(t, t0, t1)), o = {}; for (const key in a) o[key] = Array.isArray(a[key]) ? a[key].map((v, j) => lerp(v, b[key][j], k)) : lerp(a[key], b[key] ?? a[key], k); return o; } } return Object.assign({}, keys[keys.length - 1][1]); };
const val = (t, keys, ease = eInOut) => { if (t <= keys[0][0]) return keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (t <= t1) return lerp(a, b, ease(seg(t, t0, t1))); } return keys[keys.length - 1][1]; };
const exprAt = (t, list) => { let e = list[0][1]; for (const [t0, x] of list) if (t >= t0) e = x; return e; };
function clipR(x, y, w, h, svg, rr = 0) { const id = 'cl' + (_gid++); return `<defs><clipPath id="${id}"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rr}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }

// titre d'accroche (style calvitie : 3 lignes, dernier mot en couleur, loin des bords)
function title(t) {
  const k1 = pop(t, .05, .45), k2 = pop(t, .25, .45), k3 = pop(t, .45, .5);
  return G(tr(CX, 330, k1), text(0, 26, OL, "POURQUOI C'EST", '#fff', 74)) + G(tr(CX, 420, k2), text(0, 26, OL, "HORRIBLE D'ÊTRE", '#fff', 74)) +
    G(tr(CX, 525, k3, wave(t, .6, 1.5)), text(0, 30, OL, '<tspan fill="#ffb84d">PETIT ?</tspan>', '#fff', 96));
}
function tag(x, y, str, t, t0, bg = '#ffd23f', fg = OL, size = 60, r = 0) { const k = pop(t, t0, .35); if (k <= 0) return ''; const w = str.length * size * .6 + size; return G(tr(x, y, k, r), rect(-w / 2, -size * .8, w, size * 1.6, bg, size * .5, 7) + text(0, size * .35, 'none', str, fg, size)); }
function punch(x, y, str, t, t0, col = '#fff', size = 120, r = 0) { const k = pop(t, t0, .35); return k <= 0 ? '' : G(tr(x, y, k, r), text(0, size * .35, OL, str, col, size)); }
function ticket(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-150, -80, 300, 160, '#ffd23f', 14, 7) + line(70, -80, 70, 80, 5, '#c99a1a') + text(-40, 25, 'none', '80 €', '#c0202f', 70) + text(110, 20, 'none', '★', '#c0202f', 60)); }
function ruler(x, y0, y1, label, k = 1) { if (k <= 0) return ''; const y = lerp(y0, y1, k); let s = rect(x - 22, y, 44, y0 - y, '#ffd23f', 6, 6); for (let i = 0; i < 10; i++) s += line(x - 22, y0 - (y0 - y) * i / 10, x - (i % 5 ? 6 : -4), y0 - (y0 - y) * i / 10, 4); return s + (k > .95 ? G(tr(x + 30, y + 10, 1), rect(0, -40, 220, 80, '#fff', 14, 6) + text(110, 22, 'none', label, '#c0202f', 56)) : ''); }
function clockSpin(x, y, s, t, sp = 30) { return G(tr(x, y, s), circ(0, 0, 90, '#fff', 8) + line(0, 0, Math.sin(t * sp) * 70, -Math.cos(t * sp) * 70, 7) + line(0, 0, Math.sin(t * sp / 12) * 45, -Math.cos(t * sp / 12) * 45, 9) + circ(0, 0, 8, OL, 0)); }
function phoneUI(t, o = {}) {
  let s = grad('#ffe3ef', '#ffd0e4', 0, 0, W, H) + rect(0, 0, W, 210, '#ff5c93', 0, 0) + text(CX, 140, 'none', 'TINDOUX ♥', '#fff', 70);
  const card = (x, y, r, inner, nm, sub) => G(tr(x, y, 1, r), rect(-400, -520, 800, 1040, '#fff', 40, 8) + clipR(-370, -490, 740, 640, inner, 30) + text(-340, 260, 'none', nm, '#333', 80).replace('text-anchor="middle"', 'text-anchor="start"') + `<text x="-340" y="350" font-family="Fredoka" font-weight="700" font-size="54" fill="#888">${sub}</text>`);
  return s + (o.cards || '');
}
function giraffeOver(r, k) { if (k <= 0) return ''; return op(k, path(`M${-r * .5} ${-r * .9}L${-r * .55} ${-r * 1.45}M${r * .5} ${-r * .9}L${r * .55} ${-r * 1.45}`, 'none', 14, '#c98a3a') + circ(-r * .55, -r * 1.5, r * .12, '#8a5a2a', 5) + circ(r * .55, -r * 1.5, r * .12, '#8a5a2a', 5) + ell(-r * 1.05, -r * .55, r * .35, r * .14, '#e8b25a', 5) + ell(r * 1.05, -r * .55, r * .35, r * .14, '#e8b25a', 5)); }
function spotsOver(w, h, k) { if (k <= 0) return ''; let s = ''; const r = rng(3); for (let i = 0; i < 9; i++) s += ell((r() - .5) * w, -r() * h, 18 + r() * 14, 14 + r() * 10, '#a8682a', 0); return op(k * .8, s); }
function eyeMask(r) { return path(`M${-r * .75} ${-r * .12}Q0 ${-r * .3} ${r * .75} ${-r * .12}L${r * .7} ${r * .15}Q0 ${r * .05} ${-r * .7} ${r * .15}Z`, '#5a4ab0', 6) + text(-r * .32, r * .08, 'none', '♥', '#ff8ab0', r * .25) + text(r * .32, r * .08, 'none', '♥', '#ff8ab0', r * .25); }
function zzz(x, y, t) { let s = ''; for (let i = 0; i < 3; i++) { const k = (t * .6 + i / 3) % 1; s += op(1 - k, text(x + k * 80 + i * 10, y - k * 160, OL, 'z', '#fff', 50 + i * 16)); } return s; }
function idCard(x, y, s, r, age) { return G(tr(x, y, s, r), rect(-230, -150, 460, 300, '#fff', 18, 6) + rect(-230, -150, 460, 70, '#3f7df0', 16, 0) + text(0, -100, 'none', "CARTE D'IDENTITÉ", '#fff', 34) + rect(-200, -60, 150, 180, '#ffe0c0', 6, 4) + `<text x="-20" y="0" font-family="Fredoka" font-size="34" fill="#888">ÂGE</text><text x="-20" y="80" font-family="Fredoka" font-size="90" font-weight="700" fill="#c0202f">${age}</text>`); }
function speech(x, y, w, h, str, t, t0, size = 52, tail = 1) { const k = pop(t, t0, .3); if (k <= 0) return ''; const lines = str.split('\n'); return G(tr(x, y, k), rect(-w / 2, -h / 2, w, h, '#fff', 36, 7) + path(`M${-30 * tail} ${h / 2 - 4}L${-70 * tail} ${h / 2 + 70}L${40 * tail} ${h / 2 - 4}Z`, '#fff', 7) + rect(-w / 2 + 8, h / 2 - 20, w - 16, 18, '#fff', 0, 0) + lines.map((l, i) => text(0, -((lines.length - 1) * size * .6) + i * size * 1.2 + size * .35, 'none', l, '#333', size)).join('')); }

// ---------- décors illustrés (style cerveau : à plat, en couches pour depth()) ----------
const SKINS = ['#f8f5ef'], TOPS = ['#e2463a', '#3f7df0', '#2fa36b', '#f2b632', '#9b6fd6', '#ff6fa5', '#3fa7a0', '#f08a24'], HAIRC = ['#3b3040', '#c98a3a', '#2b2b33', '#e8892a', '#5a3a2a', '#f2d24c'];
const HAIRK = ['beret', 'bowl', 'bob', 'curly', 'bald', 'bun'];
// rangée de spectateurs (têtes + épaules) vus de face ou de dos
function crowdRow(y, s, seed, t, n = 7, o = {}) {
  let g = ''; const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = -80 + i * (W + 160) / (n - 1) + (r() - .5) * 60, jump = Math.max(0, Math.sin(t * (6 + r() * 3) + i * 1.3)) * 30 * (o.jump ?? 1);
    g += stick({ x, y: y - jump, s: s * (.9 + r() * .2), body: TOPS[Math.floor(r() * 8)], hair: HAIRK[Math.floor(r() * 6)], hairColor: HAIRC[Math.floor(r() * 6)], expr: ['glee', 'joyX', 'hehe', 'dot'][Math.floor(r() * 4)], back: o.back, armsBack: o.back, arms: r() < .5 ? [[-120 + Math.sin(t * 8 + i) * 15, -100], [-60, -80]] : undefined, shadow: false, legLen: 0, seed: i + seed }, t);
  }
  return g;
}
function concertBg(t, o = {}) {
  let s = grad('#1a0d33', '#3a1550', -M, -M, W + 2 * M, H + 2 * M);
  s += rect(-M, 760, W + 2 * M, 30, '#2a1a40', 0, 0) + rect(-60, 180, 1200, 560, '#0d0820', 14, 8);
  const scr = `<defs><linearGradient id="led" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4fd8"/><stop offset="1" stop-color="#4fc3ff"/></linearGradient></defs>`;
  s += scr + bloom(rect(0, 220, 1080, 470, 'url(#led)', 10, 0) + text(540, 500, 'none', '★ LIVE ★', '#fff', 140), 20, .7);
  s += rect(-M, 740, W + 2 * M, 120, '#2d1f4a', 0, 0) + rect(-M, 740, W + 2 * M, 16, '#ffd23f', 0, 0);
  if (o.star) s += op(o.star, bloom(stick({ x: 540, y: 760, s: .55, body: '#ffd23f', hair: 'bob', hairColor: '#ff4fd8', expr: 'joyX', arms: [[-120, -100], [80, 40]], holdR: rect(-6, -40, 12, 60, '#ccc', 4, 3), shadow: false }, t), 14, .6));
  return s;
}
function beams(t, o = .22) { let s = ''; for (let i = 0; i < 6; i++) { const a = Math.sin(t * 1.2 + i) * 22, x = 100 + i * 180, c = ['#ff4fd8', '#4fc3ff', '#ffd23f', '#7be07b', '#ff8a3d', '#c59bff'][i]; s += `<path d="M${x} 160L${x - 160} 1700L${x + 160} 1700Z" fill="${c}" opacity="${(o * (.6 + .4 * Math.sin(t * 5 + i))).toFixed(2)}" transform="rotate(${f1(a)} ${x} 160)"/>`; } return blur(18, `<g style="mix-blend-mode:screen">${s}</g>`); }
function wallTiles(c1, c2, size = 110) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, c1, 0, 0); for (let x = -M; x < W + M; x += size) s += line(x, -M, x, H + M, 3, c2); for (let y = -M; y < H + M; y += size) s += line(-M, y, W + M, y, 3, c2); return s; }
function classBg() { return grad('#bfe2ff', '#e8f6ff', -M, -M, W + 2 * M, 1300) + rect(-M, 640, W + 2 * M, 700, '#e8c9a0', 0, 0) + [0, 1, 2, 3, 4, 5].map(i => rect(-300 + i * 300, 700, 200, 240, '#bfe6ff', 8, 6)).join('') + rect(140, 300, 800, 130, '#fff', 14, 7) + text(540, 395, 'none', 'CLASSE DE CE2', '#3f7df0', 70) + rect(-M, 1200, W + 2 * M, 900, '#c9a77a', 0, 0); }
function bench(y, s = 1) { return rect(-M, y, W + 2 * M, 34, '#b8743c', 6) + rect(-M, y + 34, W + 2 * M, 90, '#9a5f2e', 0, 6); }
function hallBg() { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#f3ead8', 0, 0) + rect(-M, 1400, W + 2 * M, 900, '#c9b38f', 0, 0); for (let i = 0; i <= 12; i++) { const y = 1400 - i * 100; s += line(380, y, 700, y, i % 5 ? 4 : 7, '#8a7a6a') + `<text x="720" y="${y + 12}" font-family="Fredoka" font-weight="700" font-size="34" fill="#8a7a6a">${100 + i * 10}</text>`; } return s + rect(370, 200, 20, 1200, '#c49a6a', 4, 5) + [0, 1].map(i => rect(-260 + i * 1160, 300, 200, 600, '#bfe6ff', 8, 6)).join(''); }
function officeDocBg() { return rect(-M, -M, W + 2 * M, H + 2 * M, '#e3f1ee', 0, 0) + rect(-M, 1350, W + 2 * M, 900, '#cfe0dc', 0, 0) + rect(80, 300, 300, 420, '#fff', 10, 6) + dnaFlat(230, 510, .8) + text(230, 680, 'none', 'GÈNES', '#3fa7a0', 44) + rect(-M, 720, W + 2 * M, 24, '#bcd6d0', 0, 0); }
function dnaFlat(x, y, s) { let g = ''; for (let i = 0; i < 9; i++) { const yy = -160 + i * 40, a = i * .7; g += line(Math.cos(a) * 60, yy, -Math.cos(a) * 60, yy, 6, ['#ff6fa5', '#5ec4f0', '#ffd23f'][i % 3]) + circ(Math.cos(a) * 60, yy, 10, '#3f7df0', 4) + circ(-Math.cos(a) * 60, yy, 10, '#3f7df0', 4); } return G(tr(x, y, s), g); }
// rayon de supermarché en perspective (point de fuite au centre)
function marketBg(t) {
  const vx = 540, vy = 900; let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#f4f0e6', 0, 0);
  s += path(`M${-M} ${H + M}L${vx - 60} ${vy + 40}L${vx + 60} ${vy + 40}L${W + M} ${H + M}Z`, '#e3ded2', 0);
  for (let i = 0; i < 9; i++) { const k = i / 9; s += line(lerp(-M, vx - 60, k), lerp(H + M, vy + 40, k), lerp(W + M, vx + 60, k), lerp(H + M, vy + 40, k), 3, 'rgba(0,0,0,.08)'); }
  const colors = ['#e2463a', '#f2b632', '#3f7df0', '#2fa36b', '#ff6fa5', '#9b6fd6', '#f08a24'];
  for (const sd of [-1, 1]) {
    const xo = sd < 0 ? -M : W + M, xi = vx + sd * 60;
    for (let lv = 0; lv < 6; lv++) {
      const yo = H + M - 380 - lv * 520, yi = vy + 40 - 14 - lv * 22;
      s += path(`M${xo} ${yo}L${xi} ${yi}L${xi} ${yi + 6}L${xo} ${yo + 40}Z`, '#aeb5c0', 4);
      for (let b = 0; b < 14; b++) { const k0 = b / 14, k1 = (b + .8) / 14, e = k => Math.pow(k, 1.8); const x0 = lerp(xo, xi, e(k0)), x1 = lerp(xo, xi, e(k1)), ya = lerp(yo, yi, e(k0)), yb = lerp(yo, yi, e(k1)), h0 = lerp(380, 16, e(k0)), h1 = lerp(380, 16, e(k1)); s += path(`M${f1(x0)} ${f1(ya)}L${f1(x1)} ${f1(yb)}L${f1(x1)} ${f1(yb - h1 * .8)}L${f1(x0)} ${f1(ya - h0 * .8)}Z`, colors[(b * 3 + lv + (sd > 0 ? 2 : 0)) % 7], 3); }
    }
  }
  s += rect(vx - 60, vy - 300, 120, 340, '#fffbe0', 0, 0);
  for (let i = 0; i < 5; i++) { const k = i / 5, y = lerp(-200, vy - 300, Math.pow(k, .7)), w = lerp(300, 20, Math.pow(k, .7)); s += rect(vx - w / 2, y, w, lerp(40, 4, k), '#fffbe0', 4, 0); }
  return s;
}
function cerealBox(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-90, -130, 180, 260, '#ffcf3f', 8, 7) + rect(-90, -130, 180, 70, '#e2463a', 8, 0) + text(0, -80, 'none', 'CHOCO', '#fff', 46) + [0, 1, 2, 3, 4, 5].map(i => circ(-50 + (i % 3) * 50, 10 + Math.floor(i / 3) * 50, 18, '#7a3a1a', 3)).join('') + rect(-90, -130, 180, 260, 'none', 8, 7)); }
function livingBg() { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#f6e3c8', 0, 0); for (let i = -4; i < 14; i++) for (let j = 0; j < 9; j++) s += circ(i * 120 + (j % 2) * 60, 120 + j * 140, 12, '#e9c99a', 0); return s + rect(160, 260, 420, 440, '#bfe6ff', 8, 7) + line(370, 260, 370, 700, 7) + rect(700, 300, 220, 280, '#c9965f', 6, 6) + circ(810, 440, 70, '#ffb3c7', 5) + rect(-M, 1250, W + 2 * M, 900, '#b8875a', 0, 0) + path('M-100 1300Q-120 900 200 900L880 900Q1200 900 1180 1300Z', '#5aa88a', 8); }
function clubBg(t) { let s = grad('#0d0820', '#2a1550', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 1300, W + 2 * M, 900, '#23202e', 0, 0) + rect(100, 120, 880, 1200, '#2a2238', 10, 8) + rect(360, 560, 360, 740, '#120c1c', 10, 7); s += bloom(text(540, 380, 'none', 'LE CLUB', '#ff4fd8', 140) + rect(220, 430, 640, 12, '#4fc3ff', 6, 0), 16, .9); for (let i = 0; i < 3; i++) s += rect(80 + i * 60, 1200, 18, 120, '#d4af37', 6, 5); return s + path('M98 1220Q300 1300 560 1220', 'none', 18, '#c0202f'); }
// cabine d'avion en perspective (sièges qui fuient vers le fond)
function cabinBg(t) {
  const vx = 540, vy = 820; let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#e9edf2', 0, 0);
  s += path(`M${-M} ${H + M}L${vx - 70} ${vy + 60}L${vx + 70} ${vy + 60}L${W + M} ${H + M}Z`, '#6a7a9a', 0) + path(`M${vx - 120} ${H + M}L${vx - 6} ${vy + 60}L${vx + 6} ${vy + 60}L${vx + 120} ${H + M}Z`, '#c0202f', 0);
  s += path(`M${-M} ${-M}L${vx - 140} ${vy - 300}L${vx + 140} ${vy - 300}L${W + M} ${-M}Z`, '#f8f9fb', 0);
  for (const sd of [-1, 1]) for (let i = 7; i >= 0; i--) {
    const k = Math.pow(i / 8, 1.6), sc = lerp(1, .06, k), x = lerp(sd < 0 ? -40 : 1120, vx + sd * 90, k), y = lerp(1500, vy + 80, k);
    s += G(tr(x, y, sc), rect(-230, -520, 460, 520, '#2f4a8a', 50, 9) + rect(-160, -520, 320, 110, '#e8eef4', 30, 6) + rect(-260, -40, 520, 80, '#24396c', 20, 7));
    s += G(tr(lerp(sd < 0 ? -200 : 1280, vx + sd * 130, k), lerp(600, vy - 120, k), sc), rect(-60, -100, 120, 180, '#bfe6ff', 50, 7));
  }
  for (const sd of [-1, 1]) s += path(`M${sd < 0 ? -M : W + M} 120L${vx + sd * 140} ${vy - 300}L${vx + sd * 140} ${vy - 250}L${sd < 0 ? -M : W + M} 380Z`, '#fdfdfe', 7);
  return s;
}
function seatFront(x, y, s) { return G(tr(x, y, s), rect(-250, -420, 500, 520, '#2f4a8a', 50, 9) + rect(-180, -420, 360, 100, '#e8eef4', 30, 6) + rect(-140, -260, 280, 160, '#24396c', 16, 5)); }
function monitor(x, y, w, h, screen = '', o = {}) { return (o.stand !== false ? rect(x + w / 2 - 26, y + h, 52, o.standH || 120, '#3a3f4b', 6) + rect(x + w / 2 - 110, y + h + (o.standH || 120) - 10, 220, 30, '#3a3f4b', 12) : '') + rect(x - 22, y - 22, w + 44, h + 44, o.frame || '#262b36', 18) + screen + rect(x, y, w, h, 'none', 6, 4, '#11141b'); }
function stampMark(x, y, s, str, k, col = '#e2463a', r = -14) { if (k <= 0) return ''; const sc = lerp(2.4, 1, eOutCubic(clamp(k * 3))); const w = str.length * 58 + 80; return G(tr(x, y, s * sc, r), rect(-w / 2, -70, w, 140, 'none', 16, 12, col) + text(0, 26, 'none', str, col, 84)); }
