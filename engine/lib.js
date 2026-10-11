// ============================================================
//  Mini moteur d'animation 2D (SVG) — style "cartoon flat"
//  Toutes les fonctions renvoient des chaînes SVG.
// ============================================================
// format : 9:16 par défaut ; un épisode 16:9 déclare `var STAGE = [1920, 1080]` avant de charger lib.js
const W = (typeof STAGE !== 'undefined' ? STAGE[0] : 1080), H = (typeof STAGE !== 'undefined' ? STAGE[1] : 1920);
const OL = '#2b2420';          // couleur de contour
const SW = 7;                  // épaisseur de contour
const SKIN = '#f2c9a0';
const SKIN_PALE = '#fbe3d0';
const CHEEK = '#f4a3a3';
const RED_HAIR = '#e8692a';
const RED_HAIR_D = '#c4521b';

// ---------- maths / easing ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eOutCubic = k => 1 - Math.pow(1 - k, 3);
const eInCubic = k => k * k * k;
const eInOut = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const eOutBack = (k, s = 1.9) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);
const eOutElastic = k => k === 0 ? 0 : k === 1 ? 1 : Math.pow(2, -10 * k) * Math.sin((k * 10 - .75) * (2 * Math.PI) / 3) + 1;
const pop = (t, t0, d = .35) => eOutBack(seg(t, t0, t0 + d));
const popEl = (t, t0, d = .6) => eOutElastic(seg(t, t0, t0 + d));
const wave = (t, f = 1, a = 1, ph = 0) => Math.sin((t * f + ph) * Math.PI * 2) * a;
const R = d => d * Math.PI / 180;
const f1 = n => Math.round(n * 10) / 10;

// PRNG déterministe
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
// bruit lisse pour le tremblement caméra
function shake(t, amp, f = 22) { return [Math.sin(t * f * 1.3) * amp + Math.sin(t * f * 2.7) * amp * .5, Math.cos(t * f * 1.1) * amp + Math.sin(t * f * 3.1) * amp * .4]; }

// ---------- primitives ----------
const tr = (x, y, s = 1, r = 0) => `translate(${f1(x)} ${f1(y)}) rotate(${f1(r)}) scale(${s})`;
const G = (t, c, extra = '') => `<g transform="${t}" ${extra}>${c}</g>`;
const op = (o, c) => o >= 1 ? c : o <= 0 ? '' : `<g opacity="${o.toFixed(3)}">${c}</g>`;
// pinceau à pression (style flow) : si window.INK, le contour devient une forme pleine d'épaisseur variable (inkStroke, flow.js)
const _ik = (sw, stroke, extra = '') => window.INK && sw >= 2.5 && stroke && stroke !== 'none' && !/stroke-dash/.test(extra);
const _arcD = (x, y, rx, ry) => `M${f1(x - rx)} ${f1(y)}A${f1(rx)} ${f1(ry)} 0 1 0 ${f1(x + rx)} ${f1(y)}A${f1(rx)} ${f1(ry)} 0 1 0 ${f1(x - rx)} ${f1(y)}Z`;
const _rectD = (x, y, w, h, r) => { r = Math.max(0, Math.min(+r || 0, w / 2, h / 2)); return r ? `M${f1(x + r)} ${f1(y)}L${f1(x + w - r)} ${f1(y)}A${r} ${r} 0 0 1 ${f1(x + w)} ${f1(y + r)}L${f1(x + w)} ${f1(y + h - r)}A${r} ${r} 0 0 1 ${f1(x + w - r)} ${f1(y + h)}L${f1(x + r)} ${f1(y + h)}A${r} ${r} 0 0 1 ${f1(x)} ${f1(y + h - r)}L${f1(x)} ${f1(y + r)}A${r} ${r} 0 0 1 ${f1(x + r)} ${f1(y)}Z` : `M${f1(x)} ${f1(y)}L${f1(x + w)} ${f1(y)}L${f1(x + w)} ${f1(y + h)}L${f1(x)} ${f1(y + h)}Z`; };
const rect = (x, y, w, h, fill, rx = 0, sw = SW, stroke = OL) => _ik(sw, stroke) && w > 0 && h > 0 ? `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" fill="${fill}"/>` + inkStroke(_rectD(x, y, w, h, rx), sw, stroke) : `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" fill="${fill}" stroke="${sw ? stroke : 'none'}" stroke-width="${sw}"/>`;
const circ = (x, y, r, fill, sw = SW, stroke = OL) => _ik(sw, stroke) && r > 0 ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${fill}"/>` + inkStroke(_arcD(x, y, r, r), sw, stroke) : `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Math.max(r, 0))}" fill="${fill}" stroke="${sw ? stroke : 'none'}" stroke-width="${sw}"/>`;
const ell = (x, y, rx, ry, fill, sw = SW, stroke = OL) => _ik(sw, stroke) && rx > 0 && ry > 0 ? `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${fill}"/>` + inkStroke(_arcD(x, y, rx, ry), sw, stroke) : `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(Math.max(rx, 0))}" ry="${f1(Math.max(ry, 0))}" fill="${fill}" stroke="${sw ? stroke : 'none'}" stroke-width="${sw}"/>`;
const path = (d, fill = 'none', sw = SW, stroke = OL, extra = '') => _ik(sw, stroke, extra) ? (fill !== 'none' ? `<path d="${d}" fill="${fill}" ${extra}/>` : '') + inkStroke(d, sw, stroke) : `<path d="${d}" fill="${fill}" stroke="${sw ? stroke : 'none'}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const line = (x1, y1, x2, y2, sw = SW, stroke = OL) => _ik(sw, stroke) ? inkStroke(`M${f1(x1)} ${f1(y1)}L${f1(x2)} ${f1(y2)}`, sw, stroke) : `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`;
const text = (x, y, s, str, fill = '#fff', size = 90, extra = '') =>
  `<text x="${x}" y="${y}" font-family="Fredoka, Inter, sans-serif" font-weight="700" font-size="${size}" text-anchor="middle" fill="${fill}" stroke="${s}" stroke-width="${s === 'none' ? 0 : size * .16}" paint-order="stroke" stroke-linejoin="round" ${extra}>${str}</text>`;

// ---------- fonds ----------
let _gid = 0;
function grad(top, bot, x = 0, y = 0, w = W, h = H) {
  const id = 'g' + (_gid++);
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>`;
}
function radial(cx, cy, r, c1, c2, o2 = 0) {
  const id = 'r' + (_gid++);
  return `<defs><radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}" stop-opacity="${o2}"/></radialGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#${id})"/>`;
}
function glow(cx, cy, r, c, o = .6) { return radial(cx, cy, r, c, c, 0).replace('stop-color="' + c + '"/>', `stop-color="${c}" stop-opacity="${o}"/>`); }
function floor(y, top, bot) { return grad(top, bot, -400, y, W + 800, H - y + 600) + line(-400, y, W + 400, y, 4, 'rgba(0,0,0,.15)'); }
function sunburst(cx, cy, n, c1, c2, rot = 0) {
  let s = `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="${c1}"/>`;
  const L = 3000;
  for (let i = 0; i < n; i++) {
    const a1 = R(rot + i * 360 / n), a2 = R(rot + (i + .5) * 360 / n);
    s += `<path d="M${cx} ${cy}L${cx + Math.cos(a1) * L} ${cy + Math.sin(a1) * L}L${cx + Math.cos(a2) * L} ${cy + Math.sin(a2) * L}Z" fill="${c2}"/>`;
  }
  return s;
}
function dust(t, seed = 3, n = 26, c = 'rgba(255,255,255,.55)') {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x = r() * W, y = r() * H, sp = 10 + r() * 25, rr = 2 + r() * 4;
    const yy = ((y - t * sp) % H + H) % H, xx = x + wave(t, .1 + r() * .2, 14, r());
    s += `<circle cx="${f1(xx)}" cy="${f1(yy)}" r="${f1(rr)}" fill="${c}"/>`;
  }
  return s;
}
function vignette(o = .35) {
  const id = 'v' + (_gid++);
  return `<defs><radialGradient id="${id}" cx="${W / 2}" cy="${H / 2}" r="${f1(Math.hypot(W, H) * .57)}" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${o}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
}
function speedLines(t, cx, cy, n = 40, c = 'rgba(255,255,255,.7)', seed = 9) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, r0 = 520 + r() * 300 + ((t * 2400 + r() * 900) % 600), len = 140 + r() * 260;
    s += `<path d="M${f1(cx + Math.cos(a) * r0)} ${f1(cy + Math.sin(a) * r0)}L${f1(cx + Math.cos(a) * (r0 + len))} ${f1(cy + Math.sin(a) * (r0 + len))}" stroke="${c}" stroke-width="${6 + r() * 10}" stroke-linecap="round"/>`;
  }
  return s;
}
function windowFrame(x, y, w, h, sky = '#bfe0ff', sky2 = '#e3f2ff') {
  return grad(sky, sky2, x, y, w, h).replace('<rect', '<rect rx="6"') + rect(x, y, w, h, 'none', 6) + line(x + w / 2, y, x + w / 2, y + h, 6) + line(x, y + h / 2, x + w, y + h / 2, 6) + line(x + 18, y + 16, x + 34, y + 40, 5, 'rgba(255,255,255,.9)');
}
function wallClock(x, y, r, t, speed = 1) {
  const a = t * 6 * speed, b = t * .5 * speed;
  return circ(x, y, r, '#fbf6e8') + line(x, y, x + Math.sin(R(a)) * r * .75, y - Math.cos(R(a)) * r * .75, 5) + line(x, y, x + Math.sin(R(b)) * r * .5, y - Math.cos(R(b)) * r * .5, 6) + circ(x, y, 5, OL, 0);
}
function frame(x, y, w, h, inner = '#9fd3a7') {
  return rect(x, y, w, h, '#c38a52') + rect(x + 14, y + 14, w - 28, h - 28, '#f7f0dc', 0, 4) + path(`M${x + w / 2} ${y + 34}L${x + w - 34} ${y + h - 34}L${x + 34} ${y + h - 34}Z`, inner, 0);
}
function plant(x, y, s = 1) {
  return G(tr(x, y, s), path('M-40 0L-32 -70L32 -70L40 0Z', '#d9825b') + path('M0 -70C-60 -120 -70 -200 -20 -230C-10 -170 0 -120 0 -70Z', '#6dbb7a') + path('M0 -70C50 -130 90 -170 60 -250C20 -200 5 -130 0 -70Z', '#5aa76a') + path('M0 -70C-10 -140 10 -220 0 -280', 'none', 5));
}
function cloud(x, y, s = 1, c = '#fff', sw = 0) {
  return G(tr(x, y, s), path('M-120 30C-170 30 -170 -30 -120 -30C-120 -80 -40 -90 -20 -50C0 -100 90 -90 90 -30C140 -40 160 30 110 30Z', c, sw));
}

// ---------- effets ----------
function sweat(x, y, s = 1) { return G(tr(x, y, s), path('M0 -30C10 -10 18 0 18 10C18 22 9 30 0 30C-9 30 -18 22 -18 10C-18 0 -10 -10 0 -30Z', '#8fd0ff', 5) + ell(-5, 12, 4, 7, '#fff', 0)); }
function sparkle(x, y, s = 1, c = '#ffe066', r = 0) { return G(tr(x, y, s, r), path('M0 -40Q6 -6 40 0Q6 6 0 40Q-6 6 -40 0Q-6 -6 0 -40Z', c, 5)); }
function heart(x, y, s = 1, c = '#ff5d73') { return G(tr(x, y, s), path('M0 30C-40 0 -50 -20 -40 -38C-30 -54 -8 -50 0 -32C8 -50 30 -54 40 -38C50 -20 40 0 0 30Z', c, 5)); }
function qmark(x, y, s = 1, c = '#fff', r = 0) { return G(tr(x, y, s, r), text(0, 40, OL, '?', c, 130)); }
function emark(x, y, s = 1, c = '#ff4d4d', r = 0) { return G(tr(x, y, s, r), text(0, 40, OL, '!', c, 130)); }
function motionLines(x, y, n = 3, len = 60, ang = 0, c = OL, sw = 6) {
  let s = ''; for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 26; s += line(0, o, len - Math.abs(o) * .6, o, sw, c); }
  return G(tr(x, y, 1, ang), s);
}
function impactStar(x, y, s = 1, c = '#fff3b0', r = 0) {
  let d = ''; for (let i = 0; i < 14; i++) { const a = R(i * 360 / 14), rr = i % 2 ? 60 : 120; d += (i ? 'L' : 'M') + f1(Math.cos(a) * rr) + ' ' + f1(Math.sin(a) * rr); }
  return G(tr(x, y, s, r), path(d + 'Z', c, 6));
}
function steam(x, y, t, s = 1) {
  let o = ''; for (let i = 0; i < 3; i++) { const k = ((t * .9 + i / 3) % 1); o += op(1 - k, path(`M${(i - 1) * 40} ${-k * 120}c-20 -20 20 -40 0 -60`, 'none', 7, 'rgba(255,255,255,.9)')); }
  return G(tr(x, y, s), o);
}
function flames(x, y, w, h, t, seed = 1, c1 = '#ff7a1a', c2 = '#ffd23f') {
  const r = rng(seed); let s = '';
  const n = Math.max(3, Math.round(w / 70));
  for (let layer = 0; layer < 2; layer++) {
    let d = `M${x} ${y}`;
    for (let i = 0; i <= n; i++) {
      const px = x + i * w / n, ph = r();
      const hh = h * (layer ? .55 : 1) * (.55 + .45 * Math.abs(Math.sin(t * 7 + ph * 9))) * (.6 + r() * .4);
      d += `Q${f1(px - w / n * .5)} ${f1(y - hh * .3)} ${f1(px - w / n * .2)} ${f1(y - hh)}Q${f1(px)} ${f1(y - hh * .4)} ${f1(px + w / n * .05)} ${y}`;
    }
    s += path(d + 'Z', layer ? c2 : c1, layer ? 0 : 6);
  }
  return s;
}

// ---------- personnages ----------
const AGE = {
  kid: { hr: 100, legL: 64, legW: 24, bodyH: 150, bodyTop: 118, bodyBot: 150, upper: 56, lower: 54, armW: 26 },
  adult: { hr: 92, legL: 120, legW: 26, bodyH: 210, bodyTop: 132, bodyBot: 150, upper: 82, lower: 76, armW: 26 },
  baby: { hr: 105 },
};
const EXPR = {
  neutral: { eyes: 'dot', mouth: 'smile' },
  happy: { eyes: 'happy', mouth: 'grin' },
  joy: { eyes: 'happy', mouth: 'grin', brows: 'up' },
  calm: { eyes: 'closed', mouth: 'smile' },
  sleep: { eyes: 'closed', mouth: 'o-small' },
  shock: { eyes: 'wide', mouth: 'o', brows: 'up' },
  scared: { eyes: 'wide', mouth: 'wavy', brows: 'sad', sweat: 1 },
  sad: { eyes: 'dot', mouth: 'frown', brows: 'sad' },
  cry: { eyes: 'closedSad', mouth: 'wail', brows: 'sad', tears: 1 },
  angry: { eyes: 'dot', mouth: 'teeth', brows: 'angry' },
  annoyed: { eyes: 'half', mouth: 'flat', brows: 'flat' },
  deadpan: { eyes: 'half', mouth: 'flat' },
  smug: { eyes: 'half', mouth: 'smirk', brows: 'skeptic' },
  suspicious: { eyes: 'squint', mouth: 'flat', brows: 'angry' },
  worried: { eyes: 'dot', mouth: 'wavy', brows: 'sad', sweat: 1 },
  embarrassed: { eyes: 'dot', mouth: 'wavy', brows: 'sad', blush: 1, sweat: 1 },
  pain: { eyes: 'x', mouth: 'wail', brows: 'sad' },
  laugh: { eyes: 'happy', mouth: 'laugh', brows: 'up' },
  mock: { eyes: 'closedHappy2', mouth: 'laugh', brows: 'angry' },
  talk: { eyes: 'dot', mouth: 'talk' },
  wow: { eyes: 'star', mouth: 'grin', brows: 'up' },
  love: { eyes: 'heart', mouth: 'grin' },
  confused: { eyes: 'dot', mouth: 'wavy', brows: 'skeptic' },
  proud: { eyes: 'closed', mouth: 'grin', brows: 'up' },
  cool: { eyes: 'shades', mouth: 'smirk' },
  shadesGrin: { eyes: 'shades', mouth: 'grin' },
  // --- expressions cartoon EXTRÊMES ---
  terror: { eyes: 'huge', mouth: 'scream', brows: 'sad', sweatSpray: 1 },
  panic: { eyes: 'pop', mouth: 'scream', brows: 'sad', sweatSpray: 1 },
  chatter: { eyes: 'huge', mouth: 'chatter', brows: 'sad', sweat: 1 },
  jawdrop: { eyes: 'pop', mouth: 'jaw', brows: 'up' },
  starving: { eyes: 'crazy', mouth: 'drool', brows: 'angry' },
  dizzy: { eyes: 'spiral', mouth: 'wavy' },
  chill: { eyes: 'chill', mouth: 'bliss' },
  zen: { eyes: 'closed', mouth: 'bliss', blush: 1 },
  sob: { eyes: 'closedSad', mouth: 'wail', brows: 'sad', fountain: 1 },
  rage: { eyes: 'crazy', mouth: 'teeth', brows: 'angry', steamHead: 1 },
  ecstatic: { eyes: 'star', mouth: 'laugh', brows: 'up' },
  dead: { eyes: 'x', mouth: 'tongue' },
  effort: { eyes: 'squint', mouth: 'teeth', brows: 'angry', sweat: 1 },
  smugger: { eyes: 'half', mouth: 'smirk', brows: 'skeptic', blush: 1 },
};

function eyesSvg(type, r, t, lx, ly, seed) {
  const ex = r * .34, ey = r * .02;
  let s = '';
  const blink = ((t + seed * 1.7) % 3.3) < .11;
  if ((type === 'dot' || type === 'wide') && blink) type = 'closed';
  for (const side of [-1, 1]) {
    const x = side * ex + lx, y = ey + ly;
    switch (type) {
      case 'dot': s += ell(x, y, r * .085, r * .11, OL, 0) + circ(x + r * .03, y - r * .04, r * .03, '#fff', 0); break;
      case 'wide': s += circ(side * ex, ey - r * .02, r * .19, '#fff', 5) + circ(x, y, r * .075, OL, 0) + circ(x + r * .025, y - r * .03, r * .025, '#fff', 0); break;
      case 'happy': s += path(`M${x - r * .12} ${y + r * .04}Q${x} ${y - r * .14} ${x + r * .12} ${y + r * .04}`, 'none', 7); break;
      case 'closedHappy2': s += path(`M${x - r * .12} ${y + r * .02}Q${x} ${y - r * .12} ${x + r * .12} ${y + r * .02}`, 'none', 7); break;
      case 'closed': s += path(`M${x - r * .11} ${y}Q${x} ${y + r * .1} ${x + r * .11} ${y}`, 'none', 7); break;
      case 'closedSad': s += path(`M${x - r * .12} ${y - side * r * .0}Q${x} ${y + r * .1} ${x + r * .12} ${y}`, 'none', 7); break;
      case 'half': s += path(`M${x - r * .1} ${y}A${r * .1} ${r * .1} 0 0 0 ${x + r * .1} ${y}Z`, OL, 0) + line(x - r * .14, y, x + r * .14, y, 6); break;
      case 'squint': s += line(x - r * .12, y, x + r * .12, y, 8); break;
      case 'x': s += path(`M${x - side * r * .11} ${y - r * .09}L${x + side * r * .09} ${y}L${x - side * r * .11} ${y + r * .09}`, 'none', 7); break;
      case 'star': s += G(tr(x, y, r / 260, t * 90), path('M0 -40Q6 -6 40 0Q6 6 0 40Q-6 6 -40 0Q-6 -6 0 -40Z', '#ffd23f', 6)); break;
      case 'heart': s += heart(x, y, r / 230); break;
      case 'huge': { const jx = Math.sin(t * 47 + side) * r * .02, jy = Math.cos(t * 53 + side) * r * .02;
        s += ell(side * ex * 1.08 + lx * .5, ey - r * .06, r * .3, r * .36, '#fff', 6) + path(`M${side * ex * 1.05 - r * .2} ${ey + r * .05}l${r * .07} ${-r * .03}M${side * ex * 1.05 + r * .19} ${ey + r * .08}l${-r * .06} ${-r * .05}`, 'none', 3, '#ff7a7a') + circ(x + jx, y + jy, r * .045, OL, 0); break; }
      case 'pop': { const k = 1 + .08 * Math.sin(t * 20); const px = side * r * .5 + lx, py = -r * .62;
        s += line(side * ex * .8, ey, px, py, 6) + ell(px, py, r * .36 * k, r * .42 * k, '#fff', 6) + path(`M${px - r * .25} ${py + r * .1}l${r * .1} ${-r * .04}M${px + r * .24} ${py + r * .14}l${-r * .09} ${-r * .07}`, 'none', 4, '#ff7a7a') + circ(px + lx * .5, py + ly * .5, r * .08, OL, 0) + circ(px + lx * .5 + r * .03, py + ly * .5 - r * .03, r * .025, '#fff', 0); break; }
      case 'spiral': { let d = ''; for (let a = 0; a < 14; a++) { const rr = r * .015 * a, an = a * .9 + t * 8 * side; d += (a ? 'L' : 'M') + f1(x + Math.cos(an) * rr) + ' ' + f1(y + Math.sin(an) * rr); } s += path(d, 'none', 5); break; }
      case 'crazy': { const big = side < 0 ? 1.25 : .95, tw = Math.sin(t * 31) * r * .015;
        s += circ(side * ex, ey - r * .02, r * .2 * big, '#fff7c2', 6) + path(`M${side * ex - r * .17 * big} ${ey}l${r * .08} ${r * .02}M${side * ex + r * .15 * big} ${ey - r * .08}l${-r * .07} ${r * .04}M${side * ex} ${ey + r * .17 * big}l${r * .01} ${-r * .07}`, 'none', 3, '#ff5a5a') + circ(x + tw, y, r * .04, OL, 0); break; }
      case 'chill': s += path(`M${x - r * .12} ${y - r * .01}Q${x} ${y + r * .07} ${x + r * .12} ${y - r * .01}`, 'none', 7) + line(x - r * .13, y - r * .03, x + r * .13, y - r * .03, 5) + path(`M${x - r * .12} ${y - r * .03}A${r * .12} ${r * .06} 0 0 0 ${x + r * .12} ${y - r * .03}Z`, OL, 0); break;
    }
  }
  if (type === 'shades') {
    s += path(`M${-r * .62} ${-r * .1}L${r * .62} ${-r * .1}L${r * .55} ${r * .12}Q${r * .34} ${r * .26} ${r * .1} ${r * .1}L${-r * .1} ${r * .1}Q${-r * .34} ${r * .26} ${-r * .55} ${r * .12}Z`, '#1d1d24', 5) + line(-r * .45, -r * .02, -r * .3, -r * .02, 5, 'rgba(255,255,255,.6)') + line(r * .25, -r * .02, r * .4, -r * .02, 5, 'rgba(255,255,255,.6)');
  }
  return s;
}
function browsSvg(type, r, lx, ly) {
  if (!type) return '';
  const y = -r * .2 + ly, x = r * .34;
  const L = (x1, y1, x2, y2) => line(x1 + lx, y1, x2 + lx, y2, 7);
  switch (type) {
    case 'up': return path(`M${-x - r * .12 + lx} ${y - r * .06}Q${-x + lx} ${y - r * .16} ${-x + r * .12 + lx} ${y - r * .06}`, 'none', 7) + path(`M${x - r * .12 + lx} ${y - r * .06}Q${x + lx} ${y - r * .16} ${x + r * .12 + lx} ${y - r * .06}`, 'none', 7);
    case 'angry': return L(-x - r * .13, y - r * .07, -x + r * .12, y + r * .03) + L(x + r * .13, y - r * .07, x - r * .12, y + r * .03);
    case 'sad': return L(-x - r * .13, y + r * .02, -x + r * .12, y - r * .07) + L(x + r * .13, y + r * .02, x - r * .12, y - r * .07);
    case 'flat': return L(-x - r * .12, y, -x + r * .12, y) + L(x - r * .12, y, x + r * .12, y);
    case 'skeptic': return L(-x - r * .12, y + r * .02, -x + r * .12, y + r * .02) + path(`M${x - r * .12 + lx} ${y - r * .04}Q${x + lx} ${y - r * .17} ${x + r * .12 + lx} ${y - r * .07}`, 'none', 7);
  }
  return '';
}
function mouthSvg(type, r, t, lx, ly) {
  const x = lx * .6, y = r * .36 + ly * .6;
  switch (type) {
    case 'smile': return path(`M${x - r * .1} ${y}Q${x} ${y + r * .09} ${x + r * .1} ${y}`, 'none', 6);
    case 'grin': return path(`M${x - r * .2} ${y - r * .04}Q${x} ${y - r * .02} ${x + r * .2} ${y - r * .04}Q${x + r * .17} ${y + r * .2} ${x} ${y + r * .2}Q${x - r * .17} ${y + r * .2} ${x - r * .2} ${y - r * .04}Z`, '#7a2b2b', 6) + path(`M${x - r * .09} ${y + r * .16}Q${x} ${y + r * .08} ${x + r * .09} ${y + r * .16}`, '#ff8a8a', 0);
    case 'laugh': { const o = .8 + .2 * Math.abs(Math.sin(t * 18)); return path(`M${x - r * .24} ${y - r * .06}Q${x} ${y - r * .02} ${x + r * .24} ${y - r * .06}Q${x + r * .2} ${y + r * .28 * o} ${x} ${y + r * .28 * o}Q${x - r * .2} ${y + r * .28 * o} ${x - r * .24} ${y - r * .06}Z`, '#7a2b2b', 6) + ell(x, y + r * .2 * o, r * .1, r * .05, '#ff8a8a', 0); }
    case 'o': return ell(x, y + r * .06, r * .09, r * .12, '#7a2b2b', 6);
    case 'o-small': return ell(x, y + r * .04, r * .04, r * .05, '#7a2b2b', 4);
    case 'frown': return path(`M${x - r * .11} ${y + r * .07}Q${x} ${y - r * .04} ${x + r * .11} ${y + r * .07}`, 'none', 6);
    case 'flat': return line(x - r * .1, y + r * .03, x + r * .1, y + r * .03, 6);
    case 'wavy': return path(`M${x - r * .15} ${y + r * .04}q${r * .05} ${-r * .06} ${r * .1} 0t${r * .1} 0t${r * .1} 0`, 'none', 6);
    case 'smirk': return path(`M${x - r * .1} ${y + r * .05}Q${x + r * .05} ${y + r * .07} ${x + r * .14} ${y - r * .03}`, 'none', 6);
    case 'teeth': return rect(x - r * .16, y - r * .02, r * .32, r * .13, '#fff', 8, 5) + line(x - r * .16, y + r * .045, x + r * .16, y + r * .045, 3);
    case 'wail': return path(`M${x - r * .16} ${y + r * .2}Q${x - r * .16} ${y - r * .04} ${x} ${y - r * .04}Q${x + r * .16} ${y - r * .04} ${x + r * .16} ${y + r * .2}Z`, '#7a2b2b', 6);
    case 'scream': { const o = .9 + .1 * Math.sin(t * 25);
      return path(`M${x - r * .32} ${y - r * .1}Q${x} ${y - r * .2} ${x + r * .32} ${y - r * .1}Q${x + r * .36} ${y + r * .62 * o} ${x} ${y + r * .66 * o}Q${x - r * .36} ${y + r * .62 * o} ${x - r * .32} ${y - r * .1}Z`, '#6b1f24', 6) +
        path(`M${x - r * .26} ${y - r * .1}L${x + r * .26} ${y - r * .1}L${x + r * .22} ${y - r * .01}L${x - r * .22} ${y - r * .01}Z`, '#fff', 0) + ell(x, y + r * .5 * o, r * .17, r * .1, '#ff8a9a', 0) + path(`M${x} ${y - r * .02}q${-r * .03} ${r * .08} 0 ${r * .12}q${r * .03} ${-r * .04} 0 ${-r * .12}Z`, '#ff8a9a', 3); }
    case 'jaw': return path(`M${x - r * .26} ${y - r * .06}Q${x} ${y - r * .12} ${x + r * .26} ${y - r * .06}L${x + r * .3} ${y + r * 1.1}Q${x} ${y + r * 1.25} ${x - r * .3} ${y + r * 1.1}Z`, '#6b1f24', 6) + ell(x, y + r * 1.0, r * .2, r * .1, '#ff8a9a', 0);
    case 'drool': { const k = (t * 1.3) % 1;
      return path(`M${x - r * .24} ${y - r * .06}Q${x} ${y - r * .02} ${x + r * .24} ${y - r * .06}Q${x + r * .2} ${y + r * .26} ${x} ${y + r * .26}Q${x - r * .2} ${y + r * .26} ${x - r * .24} ${y - r * .06}Z`, '#7a2b2b', 6) +
        path(`M${x + r * .02} ${y + r * .1}q${r * .06} ${r * .3} ${r * .02} ${r * .5}q${-r * .08} ${-r * .02} ${-r * .06} ${-r * .3}Z`, '#ff8a9a', 5) +
        path(`M${x - r * .16} ${y + r * .18}q${-r * .02} ${r * (.25 + k * .6)} ${r * .01} ${r * (.3 + k * .7)}`, 'none', 9, '#bfe8ff') + circ(x - r * .15, y + r * (.5 + k * .75), r * .05, '#bfe8ff', 3, '#7cc4e8'); }
    case 'chatter': { const g = Math.abs(Math.sin(t * 40)) * r * .07;
      return rect(x - r * .2, y - r * .04, r * .4, r * .1 + g, '#6b1f24', 6, 5) + rect(x - r * .2, y - r * .06, r * .4, r * .07, '#fff', 4, 4) + rect(x - r * .2, y + r * .04 + g, r * .4, r * .07, '#fff', 4, 4) + line(x - r * .07, y - r * .06, x - r * .07, y + r * .01, 3) + line(x + r * .07, y - r * .06, x + r * .07, y + r * .01, 3); }
    case 'bliss': return path(`M${x - r * .22} ${y - r * .02}Q${x} ${y + r * .22} ${x + r * .22} ${y - r * .02}`, 'none', 7) + ell(x + r * .08, y + r * .12, r * .05, r * .04, '#ff8a9a', 0);
    case 'tongue': return path(`M${x - r * .14} ${y}Q${x} ${y + r * .06} ${x + r * .14} ${y}`, 'none', 6) + path(`M${x - r * .02} ${y + r * .03}q${-r * .01} ${r * .16} ${r * .08} ${r * .16}q${r * .08} ${-r * .02} ${r * .04} ${-r * .17}Z`, '#ff8a9a', 5);
    case 'talk': { const o = Math.abs(Math.sin(t * 15)) * .9 + Math.abs(Math.sin(t * 7.3)) * .3; return o < .25 ? path(`M${x - r * .1} ${y}Q${x} ${y + r * .08} ${x + r * .1} ${y}`, 'none', 6) : ell(x, y + r * .05, r * .1, r * .05 + r * .07 * Math.min(o, 1), '#7a2b2b', 5); }
  }
  return '';
}

// Cheveux : renvoie [arrière, avant]
function hairSvg(style, color, r, t) {
  const dk = shade(color, -.18);
  const cap = `M${-r * 1.02} ${r * .02}A${r * 1.03} ${r * 1.03} 0 0 1 ${r * 1.02} ${r * .02}`;
  switch (style) {
    case 'tuft': return ['', path(`M${-r * .05} ${-r}C${-r * .02} ${-r * 1.18} ${r * .18} ${-r * 1.22} ${r * .16} ${-r * 1.08}`, 'none', 6)];
    case 'babyRed': return ['', path(`M${-r * .3} ${-r * .93}C${-r * .3} ${-r * 1.25} ${r * .05} ${-r * 1.3} ${r * .02} ${-r * 1.0}C${r * .1} ${-r * 1.3} ${r * .4} ${-r * 1.22} ${r * .3} ${-r * .93}C${r * .1} ${-r * 1.02} ${-r * .1} ${-r * 1.02} ${-r * .3} ${-r * .93}Z`, color, 6)];
    case 'short': return ['', path(cap + `C${r * .9} ${-r * .3} ${r * .5} ${-r * .48} ${r * .05} ${-r * .44}C${-r * .4} ${-r * .55} ${-r * .9} ${-r * .3} ${-r * 1.02} ${r * .02}Z`, color, 6) + path(`M${r * .02} ${-r * 1.02}C${r * .05} ${-r * 1.2} ${r * .25} ${-r * 1.22} ${r * .22} ${-r * 1.08}`, 'none', 6) + path(`M${-r * .5} ${-r * .82}Q${-r * .3} ${-r * .9} ${-r * .15} ${-r * .86}`, 'none', 5, dk)];
    case 'red': { // coupe ébouriffée rousse, volumineuse
      const back = path(`M${-r * 1.1} ${r * .25}C${-r * 1.25} ${-r * .6} ${-r * .7} ${-r * 1.22} ${0} ${-r * 1.18}C${r * .7} ${-r * 1.22} ${r * 1.25} ${-r * .6} ${r * 1.1} ${r * .25}L${r * .9} ${r * .05}L${r * .95} ${r * .3}L${r * .8} ${r * .1}Z`, color, 6);
      const d = `M${-r * 1.08} ${r * .1}C${-r * 1.15} ${-r * .7} ${-r * .6} ${-r * 1.14} ${0} ${-r * 1.12}C${r * .6} ${-r * 1.14} ${r * 1.15} ${-r * .7} ${r * 1.08} ${r * .1}L${r * .86} ${-r * .2}L${r * .76} ${-r * .05}L${r * .58} ${-r * .4}L${r * .38} ${-r * .2}L${r * .2} ${-r * .48}L${0} ${-r * .26}L${-r * .2} ${-r * .5}L${-r * .38} ${-r * .24}L${-r * .58} ${-r * .44}L${-r * .74} ${-r * .12}L${-r * .88} ${-r * .3}Z`;
      return [back, path(d, color, 6) + path(`M${-r * .15} ${-r * 1.08}C${-r * .25} ${-r * 1.4} ${r * .05} ${-r * 1.42} ${r * .02} ${-r * 1.3}C${r * .15} ${-r * 1.44} ${r * .35} ${-r * 1.3} ${r * .2} ${-r * 1.08}Z`, color, 6) + path(`M${-r * .6} ${-r * .78}Q${-r * .35} ${-r * .95} ${-r * .1} ${-r * .9}M${r * .25} ${-r * .9}Q${r * .5} ${-r * .86} ${r * .68} ${-r * .66}M${-r * .9} ${-r * .3}Q${-r * .85} ${-r * .55} ${-r * .7} ${-r * .7}`, 'none', 5, dk)];
    }
    case 'spiky': {
      let d = `M${-r * 1.0} ${-r * .05}`; const n = 7;
      for (let i = 0; i <= n; i++) { const a = R(195 + i * 150 / n); const rr = i % 2 ? r * 1.0 : r * 1.32; d += `L${f1(Math.cos(a) * rr)} ${f1(Math.sin(a) * rr)}`; }
      d += `L${r * 1.0} ${-r * .05}C${r * .6} ${-r * .45} ${-r * .6} ${-r * .45} ${-r * 1.0} ${-r * .05}Z`;
      return ['', path(d, color, 6)];
    }
    case 'curly': {
      let d = `M${-r * 1.0} ${r * .1}`;
      for (let i = 0; i < 9; i++) { const a1 = R(180 + i * 20), a2 = R(180 + (i + 1) * 20), am = R(180 + (i + .5) * 20); d += `Q${f1(Math.cos(am) * r * 1.32)} ${f1(Math.sin(am) * r * 1.32)} ${f1(Math.cos(a2) * r * 1.05)} ${f1(Math.sin(a2) * r * 1.05)}`; }
      d += `Q${r * .7} ${-r * .55} ${r * .3} ${-r * .48}Q${0} ${-r * .62} ${-r * .3} ${-r * .48}Q${-r * .7} ${-r * .55} ${-r * 1.0} ${r * .1}Z`;
      return ['', path(d, color, 6)];
    }
    case 'long': return [path(`M${-r * 1.05} ${-r * .2}C${-r * 1.2} ${r * .7} ${-r * 1.1} ${r * 1.25} ${-r * .8} ${r * 1.35}L${r * .8} ${r * 1.35}C${r * 1.1} ${r * 1.25} ${r * 1.2} ${r * .7} ${r * 1.05} ${-r * .2}Z`, color, 6),
      path(cap + `C${r * .95} ${-r * .3} ${r * .4} ${-r * .62} ${-r * .1} ${-r * .5}C${-r * .3} ${-r * .3} ${-r * .8} ${-r * .1} ${-r * 1.02} ${r * .3}Z`, color, 6)];
    case 'bun': return [circ(0, -r * 1.12, r * .38, color, 6), path(cap + `C${r * .9} ${-r * .45} ${r * .4} ${-r * .62} ${0} ${-r * .55}C${-r * .4} ${-r * .62} ${-r * .9} ${-r * .45} ${-r * 1.02} ${r * .02}Z`, color, 6) + path(`M${-r * .4} ${-r * .8}Q${-r * .1} ${-r * .95} ${r * .3} ${-r * .82}`, 'none', 4, dk)];
    case 'ponytail': return [path(`M${r * .7} ${-r * .7}C${r * 1.4} ${-r * .8} ${r * 1.5} ${r * .2} ${r * 1.15} ${r * .55}C${r * 1.25} ${r * .1} ${r * 1.0} ${-r * .3} ${r * .7} ${-r * .3}Z`, color, 6),
      path(cap + `C${r * .9} ${-r * .4} ${r * .5} ${-r * .55} ${0} ${-r * .5}C${-r * .5} ${-r * .55} ${-r * .9} ${-r * .3} ${-r * 1.02} ${r * .02}Z`, color, 6)];
    case 'bald': return ['', ell(-r * .98, -r * .05, r * .2, r * .26, color, 6) + ell(r * .98, -r * .05, r * .2, r * .26, color, 6)];
    case 'side': return ['', path(cap + `C${r * .7} ${-r * .55} ${-r * .1} ${-r * .75} ${-r * .55} ${-r * .3}C${-r * .7} ${-r * .15} ${-r * .9} ${-r * .05} ${-r * 1.02} ${r * .02}Z`, color, 6)];
  }
  return ['', ''];
}

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.round(clamp(k < 0 ? c * (1 + k) : c + (255 - c) * k, 0, 255));
  return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
}

// tête complète (centrée sur 0,0)
function head(o, t = 0) {
  const r = o.hr || 100;
  const ex = Object.assign({}, EXPR[o.expr || 'neutral'] || EXPR.neutral, o.face || {});
  const [lx, ly] = (o.look || [0, 0]).map(v => v * r * .12);
  const [hb, hf] = o.hairFn ? o.hairFn(r, t, o) : hairSvg(o.hair || 'short', o.hairColor || '#4a3428', r, t);
  const skin = o.skin || SKIN;
  let s = hb;
  s += circ(0, 0, r, skin, SW);
  if (o.wrinkles) s += path(`M${-r * .5} ${-r * .55}q${r * .15} ${-r * .06} ${r * .3} 0M${r * .2} ${-r * .55}q${r * .15} ${-r * .06} ${r * .3} 0`, 'none', 4, 'rgba(0,0,0,.25)');
  const blushK = ex.blush ? 1.6 : 1;
  if (o.cheeks !== false) s += ell(-r * .55 + lx * .3, r * .26, r * .14 * blushK, r * .08 * blushK, o.cheekColor || CHEEK, 0) + ell(r * .55 + lx * .3, r * .26, r * .14 * blushK, r * .08 * blushK, o.cheekColor || CHEEK, 0);
  if (o.freckles) { for (const sd of [-1, 1]) for (const [fx, fy] of [[.42, .12], [.55, .16], [.48, .22], [.62, .1], [.36, .2]]) s += circ(sd * r * fx + lx * .3, r * fy + r * .02, r * .022, '#c9763e', 0); }
  s += hf;
  s += browsSvg(ex.brows, r, lx, ly);
  s += eyesSvg(ex.eyes, r, t, lx, ly, o.seed || 0);
  if (o.glasses) s += circ(-r * .34 + lx, r * .02 + ly, r * .22, 'rgba(255,255,255,.25)', 6) + circ(r * .34 + lx, r * .02 + ly, r * .22, 'rgba(255,255,255,.25)', 6) + line(-r * .12 + lx, ly, r * .12 + lx, ly, 6);
  if (o.mustache) s += path(`M${-r * .3} ${r * .3}Q${-r * .15} ${r * .16} 0 ${r * .26}Q${r * .15} ${r * .16} ${r * .3} ${r * .3}Q${r * .15} ${r * .38} 0 ${r * .3}Q${-r * .15} ${r * .38} ${-r * .3} ${r * .3}Z`, '#fff', 4);
  if (o.beard) s += path(`M${-r * .85} ${r * .2}Q${-r * .8} ${r * 1.0} 0 ${r * 1.02}Q${r * .8} ${r * 1.0} ${r * .85} ${r * .2}Q${r * .6} ${r * .6} ${r * .25} ${r * .55}Q0 ${r * .45} ${-r * .25} ${r * .55}Q${-r * .6} ${r * .6} ${-r * .85} ${r * .2}Z`, o.hairColor, 6);
  if (!o.beard || ex.mouth !== 'smile') s += mouthSvg(ex.mouth, r, t, lx, ly);
  if (o.mask) s += path(`M${-r * .7} ${r * .05}Q0 ${-r * .05} ${r * .7} ${r * .05}L${r * .6} ${r * .55}Q0 ${r * .75} ${-r * .6} ${r * .55}Z`, '#9fd6e6', 6) + line(-r * .7, r * .1, -r * .98, -r * .1, 4) + line(r * .7, r * .1, r * .98, -r * .1, 4);
  if (o.cap) s += path(`M${-r * .95} ${-r * .3}A${r} ${r} 0 0 1 ${r * .95} ${-r * .3}Q0 ${-r * .45} ${-r * .95} ${-r * .3}Z`, o.cap, 6);
  if (ex.sweat) s += sweat(r * .85, -r * .55 + (t * 30 % 20), r / 110);
  if (ex.sweatSpray) for (let i = 0; i < 6; i++) { const k = (t * 2.2 + i / 6) % 1, sd = i % 2 ? 1 : -1, a = R(-60 - i * 12); s += op(1 - k, sweat(sd * (r * .7 + Math.cos(a) * r * 1.1 * k), -r * .5 + Math.sin(a) * r * .9 * k + r * 1.4 * k * k, r / 140 * (1 - k * .3))); }
  if (ex.fountain) for (const sd of [-1, 1]) for (let i = 0; i < 6; i++) { const k = (t * 2.5 + i / 6) % 1; s += circ(sd * (r * .35 + r * 1.2 * k), r * .05 - r * .6 * k + r * 1.6 * k * k, r * .07, '#8fd0ff', 3, '#5aaee0'); }
  if (ex.steamHead) s += steam(-r * .6, -r * .9, t, r / 120) + steam(r * .6, -r * .9, t + .3, r / 120);
  if (ex.tears) { const k = (t * 2) % 1; s += path(`M${-r * .34} ${r * .1}q${-r * .05} ${r * .3} ${-r * .02} ${r * .5}`, 'none', 10, '#8fd0ff') + path(`M${r * .34} ${r * .1}q${r * .05} ${r * .3} ${r * .02} ${r * .5}`, 'none', 10, '#8fd0ff') + circ(-r * .4, r * (.6 + k * .5), r * .05, '#8fd0ff', 0) + circ(r * .4, r * (.6 + k * .5), r * .05, '#8fd0ff', 0); }
  if (o.burn) s += op(o.burn, circ(0, 0, r - 3, '#ff3b30', 0, OL).replace('/>', ' opacity=".55"/>'));
  return s;
}

// membre: renvoie {svg, x, y}
function limb(x, y, a1, l1, a2, l2, color, w, cap = 'round') {
  const x1 = x + Math.cos(R(a1)) * l1, y1 = y + Math.sin(R(a1)) * l1;
  const x2 = x1 + Math.cos(R(a2)) * l2, y2 = y1 + Math.sin(R(a2)) * l2;
  const d = `M${f1(x)} ${f1(y)}L${f1(x1)} ${f1(y1)}L${f1(x2)} ${f1(y2)}`;
  return { svg: `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w + SW * 2 - 2}" stroke-linecap="${cap}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="round"/>`, x: x2, y: y2 };
}

// personnage complet. origine = au sol, entre les pieds.
function person(o, t = 0) {
  const A = AGE[o.age || 'kid'];
  const skin = o.skin || SKIN;
  const shirt = o.shirt || '#eaa93a', pants = o.pants || '#3b3f4a';
  const bob = (o.bob ?? 1) * wave(t, .8, 4, o.seed || 0);
  if (o.age === 'baby') {
    const r = A.hr; let s = '';
    s += path(`M${-r * .95} ${-r * .2}C${-r * 1.2} ${-r * 1.6} ${-r * .5} ${-r * 1.4} 0 ${-r * 1.4}C${r * .5} ${-r * 1.4} ${r * 1.2} ${-r * 1.6} ${r * .95} ${-r * .2}L${r * .8} ${-r * .02}Q0 ${r * .12} ${-r * .8} ${-r * .02}Z`, o.shirt || '#9dbcec', SW);
    s += path(`M${-r * .6} ${-r * .5}L${r * .5} ${-r * .95}M${-r * .5} ${-r * .22}L${r * .65} ${-r * .68}`, 'none', 5, 'rgba(40,40,80,.35)');
    s += G(tr(0, -r * 1.75 + bob, 1, o.headTilt || 0), head(Object.assign({ hr: r }, o), t));
    return G(tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0), s, o.flip ? '' : '');
  }
  const hipY = -A.legL, topY = hipY - A.bodyH + bob;
  let s = '';
  // jambes
  const lL = o.legL || [95, 90], lR = o.legR || [85, 90];
  for (const [lx, la] of [[-A.bodyBot * .22, lL], [A.bodyBot * .22, lR]]) {
    const L = limb(lx, hipY + 4, la[0], A.legL * .52, la[1], A.legL * .5, pants, A.legW, 'butt');
    s += L.svg + ell(L.x + (la[1] > 90 ? -8 : 8), L.y + 6, 26, 15, o.shoes || '#2b2b2b', 5);
  }
  // bras arrière (si croisés etc. on garde simple : bras dessinés après le corps)
  const shY = topY + 26;
  // corps
  const bt = A.bodyTop / 2, bb = A.bodyBot / 2;
  let body = `M${-bt} ${topY}Q${-bt - 20} ${topY} ${-bt - 22} ${topY + 40}L${-bb} ${hipY - 6}Q${-bb} ${hipY + 6} ${-bb + 12} ${hipY + 6}L${bb - 12} ${hipY + 6}Q${bb} ${hipY + 6} ${bb} ${hipY - 6}L${bt + 22} ${topY + 40}Q${bt + 20} ${topY} ${bt} ${topY}Z`;
  s += path(body, shirt, SW);
  if (o.coat) s += path(`M${-bt + 6} ${topY + 4}L${-12} ${hipY + 6}M${bt - 6} ${topY + 4}L${12} ${hipY + 6}`, 'none', 5) ;
  if (o.apron) s += path(`M${-bt * .7} ${topY + 40}L${bt * .7} ${topY + 40}L${bb * .8} ${hipY + 4}L${-bb * .8} ${hipY + 4}Z`, o.apron, 5);
  if (o.collar !== false) s += path(`M${-bt * .55} ${topY + 2}Q0 ${topY + 30} ${bt * .55} ${topY + 2}`, 'none', 9, o.collar || shade(shirt, -.35));
  if (o.necklace) for (let i = -3; i <= 3; i++) s += circ(i * 12, topY + 20 + Math.cos(i / 3) * -6 + 6, 6, '#fff', 3);
  if (o.stetho) s += path(`M${-bt * .5} ${topY + 6}Q${-bt * .6} ${topY + 90} ${-10} ${topY + 100}Q${bt * .5} ${topY + 90} ${bt * .4} ${topY + 6}`, 'none', 6, '#555') + circ(-10, topY + 106, 12, '#bbb', 4);
  if (o.heartShirt) s += heart(0, topY + A.bodyH * .45, .9, '#e2463a');
  // bras
  const aL = o.armL || [110, 100], aR = o.armR || [70, 80];
  const sleeve = o.sleeve || shirt;
  const AL = limb(-bt - 10, shY, aL[0], A.upper, aL[1], A.lower, sleeve, A.armW);
  const AR = limb(bt + 10, shY, aR[0], A.upper, aR[1], A.lower, sleeve, A.armW);
  let arms = AL.svg + circ(AL.x, AL.y, 17, skin, 5) + AR.svg + circ(AR.x, AR.y, 17, skin, 5);
  if (o.holdR) arms += G(tr(AR.x, AR.y, 1, o.holdRrot || 0), o.holdR);
  if (o.holdL) arms += G(tr(AL.x, AL.y, 1, o.holdLrot || 0), o.holdL);
  const headS = G(tr(0, topY - A.hr * .78, 1, o.headTilt || 0), head(Object.assign({ hr: A.hr }, o), t));
  if (o.armsFront === false) s = arms + s + headS; else s += headS + arms;
  return G(tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''), s);
}

// le héros roux
function hero(o, t) { return person(Object.assign({ hair: 'red', hairColor: RED_HAIR, freckles: true, skin: SKIN_PALE, shirt: '#3fa7a0', pants: '#35425a', seed: 1 }, o), t); }
function heroBaby(o, t) { return person(Object.assign({ age: 'baby', hair: 'babyRed', hairColor: RED_HAIR, freckles: false, skin: SKIN_PALE }, o), t); }
function grandma(o, t) { return person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#d9d9de', glasses: true, wrinkles: true, shirt: '#a685c9', pants: '#5b4b6e', necklace: true, seed: 4 }, o), t); }

// ---------- accessoires ----------
function sun(x, y, s, t, mood = 'evil') {
  let rays = '';
  for (let i = 0; i < 14; i++) { const a = R(i * 360 / 14 + t * 25); const r1 = 200, r2 = 290 + wave(t, 2, 18, i / 3); rays += path(`M${f1(Math.cos(a - .1) * r1)} ${f1(Math.sin(a - .1) * r1)}L${f1(Math.cos(a) * r2)} ${f1(Math.sin(a) * r2)}L${f1(Math.cos(a + .1) * r1)} ${f1(Math.sin(a + .1) * r1)}Z`, '#ffb703', 6); }
  let face = circ(0, 0, 210, '#ffd23f', 7) + circ(0, 0, 175, '#ffe680', 0);
  if (mood === 'evil') face += path('M-120 -70L-40 -30M120 -70L40 -30', 'none', 12) + circ(-70, -10, 18, OL, 0) + circ(70, -10, 18, OL, 0) + path('M-90 70Q0 140 90 70Q0 100 -90 70Z', '#7a2b2b', 7) + path('M-60 82L-50 100L-38 88M40 88L52 100L62 84', '#fff', 4);
  else face += circ(-70, -20, 16, OL, 0) + circ(70, -20, 16, OL, 0) + path('M-60 50Q0 100 60 50', 'none', 8) + ell(-120, 40, 30, 16, '#ff9e6b', 0) + ell(120, 40, 30, 16, '#ff9e6b', 0);
  return G(tr(x, y, s), rays + face);
}
function crib(x, y, s = 1) { return G(tr(x, y, s), rect(-210, -60, 420, 110, '#ffffff', 24) + rect(-210, -60, 420, 34, '#eeeeee', 18)); }
function hospitalBed(x, y, s = 1) { return G(tr(x, y, s), rect(-330, -40, 660, 90, '#e8eef2', 18) + rect(-350, -140, 50, 260, '#b9c4cc', 10) + rect(-300, -80, 600, 50, '#fff', 20) + line(-280, 50, -280, 160, 14) + line(280, 50, 280, 160, 14) + circ(-280, 170, 18, '#555') + circ(280, 170, 18, '#555')); }
function printer(x, y, s, t, k = 0) {
  const sh = Math.sin(t * 60) * 3 * (k > 0 && k < 1 ? 1 : 0);
  return G(tr(x + sh, y, s), rect(-220, -150, 440, 190, '#d7dbe0', 26) + rect(-180, -190, 360, 60, '#c3c8cf', 14) + rect(-170, -40, 340, 26, '#33373d', 10) + circ(150, -100, 14, k > .95 ? '#ff4d4d' : '#62d26f', 4) + rect(-200, 40, 400, 30, '#bfc4ca', 10));
}
function paperPhoto(x, y, s, r, inner = '') { return G(tr(x, y, s, r), rect(-150, -190, 300, 380, '#fff', 8) + rect(-120, -160, 240, 240, '#cfe9ff', 6, 4) + inner); }
function magnifier(x, y, s, r = 0) { return G(tr(x, y, s, r), line(60, 60, 150, 150, 26, OL) + line(60, 60, 150, 150, 16, '#8b5a3c') + circ(0, 0, 90, 'rgba(210,240,255,.55)', 12) + path('M-50 -30Q-40 -60 -10 -66', 'none', 8, '#fff')); }
function dna(x, y, s, t, n = 10, hiIdx = -1, hiCol = RED_HAIR) {
  let back = '', front = '', rungs = '';
  const cols = ['#5ec4f0', '#ff8fb1', '#7fd77f', '#ffd23f'];
  for (let i = 0; i < n; i++) {
    const yy = (i - n / 2) * 70, ph = t * 3 + i * .65;
    const x1 = Math.sin(ph) * 120, x2 = -x1, z = Math.cos(ph);
    const c = i === hiIdx ? hiCol : cols[i % 4];
    rungs += line(x1, yy, x2, yy, i === hiIdx ? 16 : 10, c);
    const b1 = circ(x1, yy, 22, '#6b7bd6', 5), b2 = circ(x2, yy, 22, '#e86b9a', 5);
    if (z > 0) { front += b1; back += b2; } else { front += b2; back += b1; }
  }
  let glowS = '';
  if (hiIdx >= 0) glowS = circ(0, (hiIdx - n / 2) * 70, 70 + wave(t, 2, 8), 'rgba(255,140,60,.35)', 0);
  return G(tr(x, y, s), glowS + back + rungs + front);
}
function umbrella(x, y, s = 1, c1 = '#ff6b6b', c2 = '#fff') {
  let d = ''; for (let i = 0; i < 6; i++) { const a1 = 180 + i * 30, a2 = a1 + 30; d += path(`M0 0L${f1(Math.cos(R(a1)) * 260)} ${f1(Math.sin(R(a1)) * 120)}A260 120 0 0 1 ${f1(Math.cos(R(a2)) * 260)} ${f1(Math.sin(R(a2)) * 120)}Z`, i % 2 ? c2 : c1, 6); }
  return G(tr(x, y, s), line(0, 0, 0, 420, 12) + d);
}
function sunscreen(x, y, s = 1, r = 0) { return G(tr(x, y, s, r), rect(-45, -110, 90, 180, '#ffcf3f', 22) + rect(-28, -140, 56, 36, '#ff7b39', 8) + circ(0, -20, 26, '#fff', 4) + path('M0 -36L4 -24L16 -20L4 -16L0 -4L-4 -16L-16 -20L-4 -24Z', '#ffb703', 0)); }
function towel(x, y, w, h, c1, c2, r = 0) { let s = rect(-w / 2, -h / 2, w, h, c1, 10); for (let i = 1; i < 5; i++) s += rect(-w / 2 + 6, -h / 2 + i * h / 5 - 12, w - 12, 24, c2, 0, 0); return G(tr(x, y, 1, r), s + rect(-w / 2, -h / 2, w, h, 'none', 10)); }
function crayfish(x, y, s, t) {
  const cl = wave(t, 2, 10);
  let b = ell(0, 0, 140, 70, '#e8452c');
  for (let i = 1; i <= 3; i++) b += ell(130 + i * 50, 0, 40, 52 - i * 8, '#e8452c');
  b += path('M300 -40L360 0L300 40Z', '#e8452c', 6);
  b += G(tr(-120, -40, 1, -30 + cl), line(0, 0, -90, -40, 18, OL) + line(0, 0, -90, -40, 10, '#e8452c') + path('M-90 -40C-160 -110 -200 -40 -150 -20C-180 -40 -150 -70 -120 -50C-140 -10 -110 0 -90 -40Z', '#e8452c', 6));
  b += G(tr(-120, 40, 1, 30 - cl), line(0, 0, -90, 40, 18, OL) + line(0, 0, -90, 40, 10, '#e8452c') + path('M-90 40C-160 110 -200 40 -150 20C-180 40 -150 70 -120 50C-140 10 -110 0 -90 40Z', '#e8452c', 6));
  b += circ(-110, -20, 18, '#fff', 5) + circ(-114, -20, 8, OL, 0) + circ(-110, 22, 18, '#fff', 5) + circ(-114, 22, 8, OL, 0);
  b += path('M-140 -10C-260 -120 -300 -60 -320 -120M-140 10C-260 120 -300 60 -320 120', 'none', 5);
  return G(tr(x, y, s), b);
}
function carrot(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M-40 -90L40 -90L0 140Z', '#ff8a1f', 7) + path('M-20 -40L10 -40M-14 10L8 10M-6 60L6 60', 'none', 5, '#c9620d') + path('M0 -90C-30 -170 -60 -150 -40 -120M0 -90C0 -180 20 -180 10 -110M0 -90C40 -170 70 -140 40 -110', '#5bb35b', 6)); }
function extinguisher(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-50, -120, 100, 240, '#e2382f', 40) + rect(-26, -170, 52, 60, '#333', 10) + path('M20 -150Q120 -170 150 -110', 'none', 14) + rect(-30, -40, 60, 60, '#fff', 8, 4)); }
function phone(x, y, s, r = 0, screen = '') { return G(tr(x, y, s, r), rect(-80, -150, 160, 300, '#2b2b33', 26) + rect(-66, -128, 132, 250, '#cfe9ff', 12, 0) + screen); }
function syringe(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-20, -120, 40, 200, 'rgba(220,240,255,.9)', 8) + rect(-16, -40, 32, 116, '#9be37b', 4, 0) + line(0, 80, 0, 150, 6) + rect(-36, -136, 72, 18, '#ddd', 6) + rect(-8, -190, 16, 60, '#ccc', 4)); }
function ecg(x, y, w, h, t, rate = 1.2, col = '#3dff8a') {
  let d = `M0 ${h / 2}`; const step = 6;
  for (let px = 0; px <= w - 40; px += step) {
    const ph = ((px / w) * 3 - t * rate) % 1; const p = (ph + 1) % 1;
    let v = 0; if (p > .4 && p < .44) v = -.42; else if (p >= .44 && p < .48) v = .25; else if (p >= .48 && p < .52) v = -.08;
    d += `L${px} ${f1(h / 2 + v * h)}`;
  }
  return G(tr(x, y), rect(-20, -20, w + 0, h + 40, '#1f2a33', 18) + `<path d="${d}" fill="none" stroke="${col}" stroke-width="6" stroke-linejoin="round"/>`);
}
function mirror(x, y, w, h) { return rect(x - 20, y - 20, w + 40, h + 40, '#f1c27d', 30) + grad('#d9f1ff', '#a9cfe6', x, y, w, h).replace('<rect', '<rect rx="20"') + rect(x, y, w, h, 'none', 20) + line(x + 40, y + 60, x + 120, y + 20, 10, 'rgba(255,255,255,.7)') + line(x + 40, y + 120, x + 180, y + 40, 8, 'rgba(255,255,255,.5)'); }
function bill(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-90, -45, 180, 90, '#8fd18a', 8) + circ(0, 0, 26, '#bfe8b5', 4) + text(0, 16, 'none', '€', '#4b8f46', 44)); }
function wallet(x, y, s, r, t, wings = 0) {
  let w = '';
  if (wings) for (const sd of [-1, 1]) w += G(tr(sd * 90, -30, 1, sd * (20 + wave(t, 6, 25))), path(`M0 0C${sd * 80} -80 ${sd * 160} -40 ${sd * 170} 0C${sd * 120} 0 ${sd * 120} 30 ${sd * 60} 20C${sd * 60} 40 ${sd * 20} 40 0 20Z`, '#fff', 6));
  return G(tr(x, y, s, r), w + rect(-100, -70, 200, 140, '#7a4a2b', 22) + rect(20, -30, 80, 60, '#5d3720', 14));
}
function tumbleweed(x, y, s, r) { let d = ''; const rr = rng(4); for (let i = 0; i < 9; i++) { const a = rr() * 6.28, b = rr() * 6.28; d += `M${f1(Math.cos(a) * 80)} ${f1(Math.sin(a) * 80)}Q${f1(rr() * 60 - 30)} ${f1(rr() * 60 - 30)} ${f1(Math.cos(b) * 80)} ${f1(Math.sin(b) * 80)}`; } return G(tr(x, y, s, r), circ(0, 0, 80, 'rgba(201,160,99,.35)', 0) + path(d, 'none', 6, '#9a7444')); }
function cricket(x, y, s, t) { const k = Math.sin(t * 40) * 4; return G(tr(x, y, s), ell(0, 0, 60, 26, '#5a8f3c') + circ(-58, -6, 22, '#5a8f3c') + circ(-64, -12, 6, OL, 0) + path(`M-70 -20Q-120 -90 -60 -110M-60 -24Q-80 -100 -10 -110`, 'none', 4) + path(`M20 10L60 ${50 + k}L80 ${40 + k}M-10 16L-30 50M10 -20Q40 -50 60 -20`, 'none', 6) + path(`M-10 -20Q40 -60 80 -10`, 'rgba(255,255,255,.4)', 4)); }
function calendarPage(x, y, s, r = 0, n = '') { return G(tr(x, y, s, r), rect(-110, -130, 220, 260, '#fff', 14) + rect(-110, -130, 220, 64, '#e2463a', 14) + rect(-110, -90, 220, 24, '#e2463a', 0, 0) + line(-110, -66, 110, -66, SW) + text(0, 60, 'none', n, OL, 110)); }
function rareCard(x, y, s, t, inner = '') {
  const id = 'holo' + (_gid++); const sh = (t * .6) % 1;
  return G(tr(x, y, s), `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="${sh * .8}" stop-color="#ffd23f"/><stop offset="${sh * .8 + .1}" stop-color="#fff6c2"/><stop offset="${sh * .8 + .2}" stop-color="#ffb703"/></linearGradient></defs>` + rect(-260, -360, 520, 720, `url(#${id})`, 30, 9) + rect(-220, -310, 440, 400, '#8fd3ff', 18, 6) + inner + rect(-220, 120, 440, 190, '#fff6dc', 14, 5) + line(-180, 170, 180, 170, 10, '#e6c98a') + line(-180, 215, 120, 215, 10, '#e6c98a') + line(-180, 260, 160, 260, 10, '#e6c98a'));
}
function hand(x, y, s, r = 0, sleeve = '#5b7bd6', skin = SKIN) { return G(tr(x, y, s, r), line(-260, 0, -60, 0, 72, OL) + line(-260, 0, -60, 0, 58, sleeve) + path('M-60 -42C0 -50 40 -40 60 -30C90 -26 90 -6 60 -8L30 -8C60 -6 70 14 40 16C70 20 66 40 36 38C56 44 50 62 24 58C0 62 -40 52 -60 42Z', skin, 6)); }
function doorFrame(x, y, h, marks = 0) { let s = rect(x - 30, y - h, 60, h, '#c99b6d', 4); for (let i = 0; i < marks; i++) s += line(x - 50, y - 300 - i * 110, x + 50, y - 300 - i * 110, 7, '#3e5c8a'); return s; }
function cardTerminal(x, y, s, r, str = '') { return G(tr(x, y, s, r), rect(-110, -170, 220, 340, '#33363d', 30) + rect(-86, -140, 172, 100, '#bfe6c4', 10, 4) + text(0, -70, 'none', str, '#1d4026', 56) + (() => { let k = ''; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) k += rect(-70 + j * 50, -10 + i * 50, 40, 36, '#555a63', 8, 0); return k; })()); }
function chair(x, y, s = 1) { return G(tr(x, y, s), rect(-130, -330, 260, 330, '#2f3b4e', 40) + rect(-160, -40, 320, 90, '#3d4b63', 30) + rect(-20, 50, 40, 130, '#999') + rect(-110, 170, 220, 30, '#777', 15)); }
function bowl(x, y, s = 1, c = RED_HAIR) { return G(tr(x, y, s), path('M-80 -20L80 -20Q70 50 0 50Q-70 50 -80 -20Z', '#333', 6) + ell(0, -20, 80, 18, c, 6)); }
function brush(x, y, s, r, c = RED_HAIR) { return G(tr(x, y, s, r), rect(-12, -140, 24, 160, '#222', 8) + rect(-30, 10, 60, 40, '#ddd', 6) + path('M-30 50L30 50L24 100L-24 100Z', c, 5)); }
function scissors(x, y, s, r, open = .3) { return G(tr(x, y, s, r), G(`rotate(${open * 20})`, line(0, 0, 160, -10, 14, '#ccd3da') + ell(-50, 10, 40, 26, '#4dbb6a', 8)) + G(`rotate(${-open * 20})`, line(0, 0, 160, 10, 14, '#ccd3da') + ell(-50, -10, 40, 26, '#4dbb6a', 8)) + circ(0, 0, 8, '#888', 3)); }
function blackboard(x, y, w, h, inner = '') { return rect(x, y, w, h, '#3c5a48', 10) + rect(x + 10, y + 10, w - 20, h - 20, '#456b55', 6, 0) + inner + rect(x + w * .1, y + h, w * .8, 14, '#8a6a4a', 4, 4); }
function desk(x, y, s = 1, c = '#c58e55') { return G(tr(x, y, s), rect(-230, -30, 460, 40, shade(c, .15), 6) + rect(-210, 10, 420, 220, c, 4)); }
function building(x, y, w, h, c, win = '#cfe8ff') { let s = rect(x, y - h, w, h, c, 4); const cols = Math.floor(w / 80), rows = Math.floor((h - 60) / 110); for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) s += rect(x + 20 + i * (w - 40) / cols + 6, y - h + 40 + j * 110, (w - 40) / cols - 24, 64, win, 4, 4); return s; }

function bubble(x, y, w, h, inner, k = 1) {
  return G(tr(x, y, k), circ(-w * .45, h * .62, 18, '#fff', 6) + circ(-w * .55, h * .82, 11, '#fff', 5) +
    path(`M${-w / 2} 0C${-w / 2} ${-h * .7} ${w / 2} ${-h * .7} ${w / 2} 0C${w / 2 + 30} ${h * .5} ${-w / 2} ${h * .7} ${-w / 2} 0Z`, '#fff', 7) + inner);
}
function lerpColor(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map(s => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, k)));
  return '#' + ((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2]).toString(16).slice(1);
}
function lerpPose(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]; }

if (typeof module !== 'undefined') module.exports = {};
