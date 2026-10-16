// ============================================================
//  « Pourquoi c'est horrible d'avoir des vergetures à 16 ans ? » — style SIZEX fun — 9:16, calé mot à mot
//  (words.js + timing.js générés par tools/prep.py). Intro motion (3 plans), puis vrais décors vivants + couche motion.
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

// ---------- aides (template) ----------
const rays = (t, cx, cy, c1, c2, n = 20) => sunburst(cx, cy, n, c1, c2, t * 12);
function cross(x, y, s, t, t0 = 0) { const k = pop(t, t0, .3); return k <= 0 ? '' : G(tr(x, y, s * k), path('M-80 -80L80 80M80 -80L-80 80', 'none', 46) + path('M-80 -80L80 80M80 -80L-80 80', 'none', 28, '#ff4d4d')); }
function stamp(x, y, str, t, t0, col = '#e2463a', r = -12, size = 84) { const k = seg(t, t0, t0 + .18); if (k <= 0) return ''; const s = lerp(2.2, 1, eOutCubic(k)); const w = str.length * size * .62 + 70; return G(tr(x, y, s, r), rect(-w / 2, -size * .72, w, size * 1.44, 'rgba(255,255,255,.85)', 14, 12, col) + text(0, size * .36, 'none', str, col, size)); }
function confetti(t, t0 = 0, n = 40, seed = 4) { const r = rng(seed); let s = ''; const k = t - t0; if (k < 0) return ''; const cols = ['#ff6fa5', '#ffd23f', '#5ec4f0', '#7be07b', '#ff8a3d']; for (let i = 0; i < n; i++) { const x = r() * W, y = -50 + (r() * 300 + k * (300 + r() * 300)) % (H + 100); s += rect(x, y, 18, 30, cols[i % 5], 4, 0).replace('/>', ` transform="rotate(${f1(k * 200 + i * 40)} ${f1(x)} ${f1(y)})"/>`); } return s; }
function sweatSpray(x, y, t, n = 6) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * 2 + i / n) % 1, sd = i % 2 ? 1 : -1; s += op(1 - k, sweat(x + sd * (60 + 220 * k), y - 120 * k + 260 * k * k, .8)); } return s; }
const zin = (a = 1, b = 1.12, hand = 0) => (t, d) => ({ z: lerp(a, b, eInOut(clamp(t / d))), hand });
const camHand = (z = 1.06, a = 1) => () => ({ z, hand: a });
function clipR(x, y, w, h, svg, rx = 18) { const id = 'cl' + (_gid++); return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }
function clipC(x, y, r, svg) { const id = 'cc' + (_gid++); return `<defs><clipPath id="${id}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }

// ============================================================
//  SIZEX fun : accent rose « vergeture », jaune marqueur, turquoise piscine
// ============================================================
sxFun('#ff4f87'); SX.acc2 = '#ffd23f'; SX.cool = '#36c5b4';

// ---------- les vergetures : fines lignes ondulées rosées (ou argentées) ----------
const MARK = '#e9799d', MARK_L = '#fdd5e1', MARK_S = '#efe1d8';
function striae(x, y, s, t, k = 1, o = {}) {
  if (k <= 0) return ''; const n = o.n || 4, L = o.len || 170, col = o.col || MARK; let g = '';
  for (let i = 0; i < n; i++) { const l = L * (.7 + .3 * ((i * 37) % 10) / 10), ox = ((i * 53) % 7 - 3) * 6, oy = i * (o.gap || 24); let d = `M${f1(-l / 2 + ox)} ${oy}`;
    for (let j = 0; j < 6; j++) d += `q${f1(l / 12)} ${j % 2 ? 6 : -6} ${f1(l / 6)} 0`;
    const da = `stroke-dasharray="${f1(l * 1.15 * clamp(k))} ${f1(l * 2)}"`; g += path(d, 'none', o.w || 9, col, da) + path(d, 'none', (o.w || 9) * .35, o.hi || MARK_L, da); }
  if (o.shine) for (let i = 0; i < 3; i++) g += sparkle(-L * .4 + i * L * .4, (i % 2) * 30 - 10, .35 + .2 * Math.sin(t * 9 + i), '#fff');
  return G(tr(x, y, s, o.r ?? -18), g); }
// gros plan de peau (hanche + bord de short) — insert pudique
function skinClose(x, y, w, h, t, k, o = {}) { const sk = o.skin || SKIN; let s = grad(sk, shade(sk, -.08), x, y, w, h);
  s += ell(x + w * .3, y + h * .25, w * .3, h * .2, 'rgba(255,255,255,.18)', 0);
  if (o.shorts !== false) s += path(`M${x - 10} ${y + h * .78}Q${x + w / 2} ${y + h * .7} ${x + w + 10} ${y + h * .78}L${x + w + 10} ${y + h + 10}L${x - 10} ${y + h + 10}Z`, o.shortsCol || '#33415e', 7) + path(`M${x} ${y + h * .8}Q${x + w / 2} ${y + h * .72} ${x + w} ${y + h * .8}`, 'none', 4, 'rgba(255,255,255,.4)', 'stroke-dasharray="14 12"');
  s += striae(x + w * .5, y + h * .3, o.ms || w / 300, t, k, { n: o.n || 5, len: 200, r: -24, col: o.col, shine: o.shine });
  return s; }

// ---------- personnages ----------
const HAIR_H = '#3a2a20', SHIRT_H = '#4d7cf0', SKIN_C = '#c98a5e';
const ado = (o, t) => person(Object.assign({ age: 'kid', hair: 'side', hairColor: HAIR_H, shirt: SHIRT_H, pants: '#33415e', seed: 2 }, o), t);
const adoHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'side', hairColor: HAIR_H, seed: 2 }, o), t));
const cuz = (o, t) => person(Object.assign({ age: 'kid', hair: 'curly', hairColor: '#1f1a18', skin: SKIN_C, shirt: '#ff9a3c', pants: '#2f6f8f', seed: 6 }, o), t);
const cuzHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'curly', hairColor: '#1f1a18', skin: SKIN_C, seed: 6 }, o), t));
const kevin = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#c4521b', shirt: '#5fb85f', pants: '#3b3f4a', freckles: true, seed: 3 }, o), t);
const kevinHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#c4521b', freckles: true, seed: 3 }, o), t));
const ptr = o => tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : '');
// maillot / short par-dessus un perso (repère local du perso : hanches vers y -64)
const trunks = (o, col, top = -98) => G(ptr(o), path(`M-82 ${top}L82 ${top}L86 -34L12 -34L0 -54L-12 -34L-86 -34Z`, col, 6) + line(-80, top + 12, 80, top + 12, 4, 'rgba(255,255,255,.45)'));
// torse nu + maillot (+ vergetures sur les hanches si o.marks)
function bare(fn, o, t) { const sk = o.skin || SKIN; let s = fn(Object.assign({}, o, { shirt: sk, sleeve: sk, pants: sk, collar: false, shoes: sk }), t);
  if (o.marks) s += G(ptr(o), striae(-50, -150, .3, t, o.marks, { n: 3, r: -62, col: o.mcol, shine: o.shine }) + striae(50, -150, .3, t, o.marks, { n: 3, r: 62, col: o.mcol, shine: o.shine }));
  return s + trunks(o, o.trunks || SX.acc); }
// t-shirt + short (jambes nues)
const inShorts = (fn, o, t) => fn(Object.assign({}, o, { pants: o.skin || SKIN, shoes: '#fff' }), t) + trunks(o, o.shortsCol || '#33415e', -62);
// vue de DOS : visage caché par les cheveux, vergetures dans le bas du dos
const backHair = col => r => { let d = `M${-r * 1.04} ${r * .3}`; for (let i = 0; i <= 10; i++) { const a = R(165 + i * 21), rr = r * (i % 2 ? 1.16 : 1.04); d += `L${f1(Math.cos(a) * rr)} ${f1(Math.sin(a) * rr)}`; } d += `L${r * 1.04} ${r * .3}Q0 ${r * .62} ${-r * 1.04} ${r * .3}Z`; return ['', path(d, col, 6)]; };
function backV(fn, o, t) { const sk = o.skin || SKIN; let s = fn(Object.assign({}, o, { shirt: sk, sleeve: sk, pants: sk, collar: false, shoes: sk, cheeks: false, expr: 'neutral', face: { eyes: 'none', mouth: 'none' }, hairFn: backHair(o.hairCol || '#1f1a18') }), t);
  s += G(ptr(o), path('M0 -205L0 -110', 'none', 4, 'rgba(0,0,0,.18)') + striae(-42, -150, .3, t, o.marks ?? 1, { n: 4, r: -8, col: o.mcol || MARK_S, hi: '#fff8f2', gap: 20 }) + striae(42, -150, .3, t, o.marks ?? 1, { n: 4, r: 8, col: o.mcol || MARK_S, hi: '#fff8f2', gap: 20 }));
  return s + trunks(o, o.trunks || '#2f6f8f'); }
const pizzaiolo = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#1f1a18', mustache: true, shirt: '#fff', apron: '#e2463a', pants: '#2b2b33', seed: 8 }, o), t);
const doc = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#8a5a3a', glasses: true, shirt: '#fff', coat: 1, stetho: 1, pants: '#4b5b7a', seed: 4 }, o), t);
const prof = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#9a9aa0', glasses: true, mustache: true, shirt: '#b56cff', pants: '#4b3b6e', seed: 9 }, o), t);
// casque commando + peintures de guerre (repère local du perso)
const commando = o => G(ptr(o), path('M-112 -300A112 112 0 0 1 112 -300Q0 -330 -112 -300Z', '#5d7a3a', 6) + path('M-60 -395l-30 -60M10 -405l10 -70M70 -380l40 -50', 'none', 8, '#3f5a2a') + leafy(-90, -455) + leafy(20, -475) + leafy(110, -430) +
  path('M-80 -262l40 0M-80 -248l40 0M40 -262l40 0M40 -248l40 0', 'none', 7, '#2f4a24'));
const leafy = (x, y) => G(tr(x, y, .9, -20), path('M0 0C20 -30 60 -30 80 0C60 30 20 30 0 0Z', '#7cc46a', 5));

// ---------- décors vivants ----------
const M = 700;
const SKY = (t, a = '#8fd3ff', b = '#e6f6ff') => grad(a, b, -M, -M, W + 2 * M, 1900) + cloud(((t * 30) % 1600) - 300, 220, 1.3, '#fff') + cloud(((t * 18 + 700) % 1700) - 300, 420, .9, '#fff');
function tiles(c1, c2, size = 120, x0 = -M, y0 = -M, w = W + 2 * M, h = H + 2 * M) { let s = rect(x0, y0, w, h, c1, 0, 0); for (let x = x0; x < x0 + w; x += size) s += line(x, y0, x, y0 + h, 4, c2); for (let y = y0; y < y0 + h; y += size) s += line(x0, y, x0 + w, y, 4, c2); return s; }
function kidsBg(t, y = 1150, n = 4, sc = .45) { let s = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * (60 + i * 25) * (i % 2 ? 1 : -1)) % 1600 + 1600) % 1600 - 260; s += person({ age: 'kid', x, y, s: sc, hair: ['curly', 'bun', 'short', 'ponytail'][i % 4], hairColor: ['#2b2420', '#8a5a3a', '#c4521b', '#e0a040'][i % 4], shirt: ['#ff8fb1', '#7aa6d8', '#ffd23f', '#7be07b'][i % 4], expr: 'happy', walk: 3, flip: i % 2, seed: 20 + i }, t); } return s; }
function bedroom(t, night = 0) { let s = night ? grad('#1d2350', '#2e3570', -M, -M, W + 2 * M, H + 2 * M) : grad('#d7e6ff', '#c3d6f7', -M, -M, W + 2 * M, H + 2 * M);
  for (let i = -6; i < 16; i++) s += rect(i * 120, -M, 50, H + 2 * M, night ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.3)', 0, 0);
  s += night ? rect(620, 260, 360, 420, '#0f163a', 12) + circ(820, 400, 60, '#fff6d6', 0) + rect(620, 260, 360, 420, 'none', 12) + line(800, 260, 800, 680, 8) + Array.from({ length: 6 }, (_, i) => sparkle(660 + i * 55, 320 + (i * 71) % 300, .15 + .1 * Math.sin(t * 4 + i), '#fff6d6')).join('')
    : windowFrame(620, 260, 360, 420) + cloud(680 + (t * 40) % 220, 380, .45) + cloud(860 - (t * 25) % 180, 560, .35);
  s += rect(100, 300, 240, 330, night ? '#3a3f7a' : '#ff8fb1', 14) + ftext(220, 470, 'SKATE', { size: 50, fill: '#fff' }) + ftext(220, 540, '4 LIFE', { size: 36, fill: SX.acc2 });
  return s + rect(-M, 1250, W + 2 * M, 1400, night ? '#3a3040' : '#c49a6c', 0, 0) + line(-M, 1250, W + M, 1250, 6) + rect(-120, 1150, 460, 180, night ? '#5b5fa8' : '#ff9a3c', 30) + rect(-120, 1120, 200, 70, '#fff', 30) + plant(980, 1250, 1.1); }
function mirrorV(x, y, w, h) { return rect(x - 22, y - 22, w + 44, h + 44, '#f1c27d', 30) + grad('#e6f6ff', '#b9dcef', x, y, w, h).replace('<rect', '<rect rx="18"') + rect(x, y, w, h, 'none', 18); }
const mirrorShine = (x, y) => line(x + 60, y + 80, x + 160, y + 20, 14, 'rgba(255,255,255,.7)') + line(x + 90, y + 140, x + 240, y + 40, 8, 'rgba(255,255,255,.5)');
function sink(x, y) { return path(`M${x - 260} ${y}L${x + 260} ${y}Q${x + 240} ${y + 160} ${x} ${y + 170}Q${x - 240} ${y + 160} ${x - 260} ${y}Z`, '#fff') + rect(x - 30, y - 110, 60, 110, '#c9ced6', 10) + path(`M${x - 30} ${y - 100}Q${x - 100} ${y - 110} ${x - 110} ${y - 60}`, 'none', 22, '#c9ced6'); }
function bathroom(t) { return tiles('#cfeaf0', '#b2d6de') + rect(-M, 1250, W + 2 * M, 1400, '#e8eef0', 0, 0) + Array.from({ length: 4 }, (_, i) => op(.35, cloud(150 + i * 260 + wave(t, .1, 40, i / 4), 260 + (i % 2) * 120 - (t * 25 % 60), 1 + (i % 2) * .4, '#fff'))).join(''); }
function lockerRoom(t) { let s = grad('#e3ebf2', '#c9d6e0', -M, -M, W + 2 * M, H + 2 * M);
  for (let i = -2; i < 8; i++) { const x = -60 + i * 160; s += rect(x, 230, 150, 1030, i % 2 ? '#5b8fd8' : '#4a7cc4', 10) + [0, 1, 2].map(j => line(x + 35, 290 + j * 22, x + 115, 290 + j * 22, 6, 'rgba(0,0,0,.25)')).join('') + circ(x + 120, 720, 12, '#c9d1db', 4) + ftext(x + 75, 420, String(12 + i), { size: 36, fill: '#fff', stroke: 'none' }); }
  s += path(`M${290 + Math.sin(t * 2) * 20} 640Q300 820 ${300 + Math.sin(t * 2) * 30} 900L380 900Q370 820 ${370 + Math.sin(t * 2) * 20} 640Z`, '#ff8fb1', 6);
  s += rect(-M, 1260, W + 2 * M, 1400, '#9aa6b0', 0, 0) + line(-M, 1260, W + M, 1260, 6) + rect(-M, 1290, W + 2 * M, 46, '#c49a6c', 10);
  for (let i = 0; i < 3; i++) s += op(.3, cloud(((t * 40 + i * 420) % 1400) - 200, 300 + i * 160, 1.2, '#fff'));
  return s; }
function pool(t) { let s = tiles('#e9f6fb', '#cfe8f2', 110, -M, -M, W + 2 * M, M + 1000) + windowFrame(80, 200, 400, 300) + windowFrame(600, 200, 400, 300) + cloud(140 + (t * 30) % 280, 300, .4) + cloud(660 + (t * 20) % 300, 330, .45);
  s += grad('#5fd0ee', '#2fa3c9', -M, 990, W + 2 * M, 330);
  for (let i = 0; i < 6; i++) { const y = 1010 + i * 50, off = (t * (30 + i * 10)) % 200; s += path(`M${-200 - off} ${y}` + Array.from({ length: 10 }, () => 'q50 -10 100 0t100 0').join(''), 'none', 4, 'rgba(255,255,255,.4)'); }
  for (const y of [1080, 1200]) for (let x = -40; x < W + 40; x += 44) s += circ(x, y, 12, (x / 44) % 2 ? '#fff' : '#ff4d4d', 3);
  for (let i = 0; i < 3; i++) { const x = ((i * 390 + t * 70 * (i % 2 ? 1 : -1)) % 1300 + 1300) % 1300 - 110; s += G(tr(x, 1130 + (i % 2) * 70 + Math.sin(t * 3 + i) * 6), head({ hr: 34, hair: 'none', cap: ['#ff8fb1', '#ffd23f', '#7be07b'][i], expr: 'happy', seed: 30 + i }, t)); }
  s += rect(-M, 1300, W + 2 * M, 1400, '#f1e6d2', 0, 0) + line(-M, 1300, W + M, 1300, 6);
  return s + G(tr(980, 1300), rect(-14, -560, 28, 560, '#fff', 8) + rect(-110, -440, 220, 24, '#fff', 8) + rect(-110, -570, 220, 40, '#e2463a', 10)); }
function classroom(t) { return grad('#fff1d6', '#ffe2b0', -M, -M, W + 2 * M, H + 2 * M) + rect(60, 280, 960, 560, '#3c5a48', 18) + rect(80, 300, 920, 520, '#456b55', 10, 0) + wallClock(940, 200, 60, t, 6) + rect(-M, 1250, W + 2 * M, 900, '#c49a6c', 0, 0) + line(-M, 1250, W + M, 1250, 6); }
function pizzeria(t) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0); for (let y = -M; y < 1250; y += 110) for (let x = -M + (((y + M) / 110) % 2) * 110; x < W + M; x += 220) s += rect(x, y, 110, 110, '#e8554a', 0, 0);
  s += path('M640 1250L640 760Q820 560 1000 760L1000 1250Z', '#c96a3c', 7) + path('M700 1250L700 860Q820 740 940 860L940 1250Z', '#2b1a14', 6) + flames(820, 1240, 200, 200, t);
  return s + rect(-M, 1250, W + 2 * M, 900, '#a8743f', 0, 0) + rect(-M, 1240, W + 2 * M, 30, '#7a4f2a', 0, 0); }
function doctorRoom(t) { return grad('#d8f3ec', '#bfe9de', -M, -M, W + 2 * M, H + 2 * M) + rect(120, 300, 240, 180, '#c38a52', 8) + rect(140, 320, 200, 140, '#fdf6e3', 0, 4) + ftext(240, 410, 'DIPLÔME', { size: 30, fill: OL, stroke: 'none' }) + circ(240, 440, 16, '#e2463a', 4) + windowFrame(660, 300, 300, 330) + cloud(720 + (t * 30) % 180, 420, .35) + rect(-M, 1250, W + 2 * M, 900, '#9fc7d6', 0, 0) + line(-M, 1250, W + M, 1250, 6); }
function gear(x, y, r, a, col = '#8d96a3') { let d = ''; for (let i = 0; i < 24; i++) { const an = R(a + i * 15), rr = i % 2 ? r : r * 1.18; d += (i ? 'L' : 'M') + f1(x + Math.cos(an) * rr) + ' ' + f1(y + Math.sin(an) * rr); } return path(d + 'Z', col, 6) + circ(x, y, r * .35, '#c9ced6', 6); }
function factory(t) { let s = grad('#c9ced6', '#aab3bf', -M, -M, W + 2 * M, H + 2 * M) + gear(150, 420, 120, t * 60) + gear(330, 300, 80, -t * 90, '#a3abb6') + gear(930, 460, 140, t * 50) + rect(-M, 1250, W + 2 * M, 900, '#7d848c', 0, 0);
  s += rect(-M, 1500, W + 2 * M, 60, '#3a3f4a', 20) + Array.from({ length: 14 }, (_, i) => G(tr(-40 + i * 90, 1530, 1, t * 300), circ(0, 0, 22, '#c9d1db', 5) + line(-14, 0, 14, 0, 4))).join('');
  for (let i = -1; i < 14; i++) s += path(`M${i * 90 - (t * 120) % 90} 1500l40 0l-30 60l-40 0Z`, i % 2 ? '#ffd23f' : '#2b2420', 0);
  return s + G(tr(540, 220), circ(0, 0, 50, Math.sin(t * 10) > 0 ? '#ff3b30' : '#a8302a', 6) + op(.25 + .25 * Math.sin(t * 10), circ(0, 0, 140, '#ff3b30', 0))); }
// plage 9:16 : horizon vers y 820, rivage vers y 1180 (sable dessous = zone sous-titres, décor seulement)
function beach(t, o = {}) { const hz = o.hz ?? 820, sy = o.sy ?? 1180, dusk = o.dusk || 0;
  let s = grad(dusk ? '#ff9f7a' : '#8fd3ff', dusk ? '#ffd9a8' : '#e6f6ff', -M, -M, W + 2 * M, hz + M);
  s += circ(o.sunX ?? 860, o.sunY ?? (dusk ? 700 : 250), 80, dusk ? '#ffb15a' : '#fff3b0', 0) + glow(o.sunX ?? 860, o.sunY ?? (dusk ? 700 : 250), 280, '#fff3b0', .5);
  s += cloud(((t * 26) % 1500) - 250, 200, 1.1, dusk ? '#ffe0d0' : '#fff') + cloud(((t * 15 + 800) % 1600) - 300, 470, .8, dusk ? '#ffe0d0' : '#fff');
  s += grad(dusk ? '#4aa6c9' : SEA, dusk ? '#2c6f9a' : SEA_D, -M, hz, W + 2 * M, sy - hz + 80);
  if (dusk) s += op(.5, rect(760, hz + 10, 200, 14, '#ffd9a8', 7, 0) + rect(790, hz + 50, 140, 10, '#ffd9a8', 5, 0) + rect(820, hz + 90, 80, 8, '#ffd9a8', 4, 0));
  for (let i = 0; i < 6; i++) { const y = hz + 30 + i * (sy - hz) / 6, off = (t * (20 + i * 10)) % 200; s += path(`M${-300 - off} ${y}` + Array.from({ length: 12 }, () => 'q50 -10 100 0t100 0').join(''), 'none', 4, 'rgba(255,255,255,.35)'); }
  const wv = wave(t, .3, 22, o.seed || 0);
  s += path(`M${-M} ${sy + wv}` + Array.from({ length: 26 }, () => 'q50 -18 100 0').join('') + `L${W + M} ${sy + 90}L${-M} ${sy + 90}Z`, 'rgba(255,255,255,.88)', 0);
  s += grad(SAND, SAND_D, -M, sy + 24 + wv, W + 2 * M, H - sy + M);
  const r = rng(5); for (let i = 0; i < 22; i++) s += ell(r() * W, sy + 120 + r() * 600, 6 + r() * 8, 3 + r() * 3, SAND_W, 0);
  if (o.gulls !== false) for (let i = 0; i < 2; i++) { const x = ((t * (90 + i * 40) + i * 600) % 1500) - 200; s += eagle({ gull: 1, x, y: 330 + i * 110 + Math.sin(t * 2 + i) * 20, s: .22 - i * .05, flip: 1, seed: i }, t); }
  return s; }
const parasol = (x, y, s, col = '#ff4f87') => G(tr(x, y, s), line(0, 0, 0, -420, 14) + path('M-260 -380Q0 -560 260 -380Z', col, 7) + path('M-90 -390Q0 -540 90 -390Z', '#fff', 0));
// téléphone géant (repère : écran -150..150 × -295..295)
function phoneXL(x, y, s, r, screen) { return G(tr(x, y, s, r), rect(-170, -330, 340, 660, '#2b2b33', 44) + rect(-150, -295, 300, 590, '#fde8f0', 24, 0) + screen + rect(-50, -318, 100, 14, '#444', 7, 0)); }
const tshirtShape = (x, y, s, r, col = '#ff9a3c') => G(tr(x, y, s, r), path('M-60 -70L-110 -40L-90 0L-60 -15L-60 80L60 80L60 -15L90 0L110 -40L60 -70Q0 -40 -60 -70Z', col, 6));
const bulb = (x, y, s, on) => G(tr(x, y, s), (on ? glow(0, 0, 160, '#fff6a0', .8) : '') + circ(0, -10, 60, on ? '#fff36b' : '#e8e8e8') + rect(-30, 45, 60, 40, '#9aa3ad', 8) + line(-30, 60, 30, 60, 4) + (on ? path('M-20 -10l10 20l10 -20l10 20', 'none', 5, '#e0a020') : ''));
const flamingo = (x, y, s, t) => G(tr(x, y, s, wave(t, .4, 4)), ell(0, 0, 240, 80, '#ff8fb8') + ell(0, -6, 150, 40, '#3fb6d9', 5) + path('M200 -30Q280 -200 220 -280Q190 -320 150 -290', 'none', 34, OL) + path('M200 -30Q280 -200 220 -280Q190 -320 150 -290', 'none', 22, '#ff8fb8') + circ(160, -295, 36, '#ff8fb8') + path('M126 -300L96 -280L126 -270Z', '#2b2420', 4) + circ(165, -305, 7, OL, 0));

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, at(n, 'mot') - .15))
// ============================================================
// B001 — SIGNATURE SIZEX : grille encre, ado en cut-out, échantillon de peau, titre cinétique + étoiles « débloqué »
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const V = at(1, 'verges') - .05; return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + unlock(CX, 980, t, V, { part: 'back', r: 480 }) + burst(CX, 980, 300, t, .45, SX.acc, 16) +
    G(tr(CX, 1000, 1 + .03 * Math.sin(t * 6)), cutout(adoHead(0, 0, 165, { expr: t > V + .1 ? 'terror' : 'worried', look: [.6, .3] }, t), 14)) +
    card(830, 760, 250, 170, clipR(-125, -85, 250, 170, skinClose(-125, -85, 250, 170, t, seg(t, V, V + .5), { ms: .7, n: 4 })), t, V + .05, { ry: 0, thick: 8, r: 8, bw: 6 }) +
    funTag(240, 770, '16 ANS', t, at(1, '16') - .05, { size: 52, bg: SX.cool, r: -8 }) + unlock(CX, 980, t, V, { part: 'front', r: 480 }) +
    kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'AVOIR DES", CX, 415, t, .3, { size: 56 }) + kword('VERGETURES ?', CX, 540, t, V, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [.45, 'boing', .4], [at(1, 'verges') - .05, 'boom', .6], [at(1, 'verges'), 'sparkle', .6], [at(1, '16') - .05, 'pop', .6]] });

// B002a — « Tu as 16 ans » : papier + ombre de feuillage, ado cut-out, gâteau 16, mot-clé slam
const o2 = at(2, 'tu', 2) - .15;
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const S = at(2, '16', 2) - .05; return paper(SX.paper) + gobo(T, .12) + burst(CX, 980, 330, t, S, '#ffe1b8', 18) +
    cutout(ado({ x: CX, y: 1460, s: 1.4, expr: 'joy', armL: [200, 230], armR: [-20, -50] }, t), 12) + confetti(t, S, 26) +
    kthin('tu as', CX, 350, t, 0, { size: 60, fill: SX.ink, out: 2 }) + kword('16 ANS', CX, 480, t, S, { size: 130, fill: SX.acc }); },
  sfx: [[.02, 'whoosh', .5], [at(2, '16', 2) - .05, 'boom', .6], [at(2, '16', 2), 'tada', .5], [at(2, 'ans', 2), 'pop', .5]] });
// B002b — « tu grandis de plusieurs centimètres » : il pousse comme un ressort à côté d'une toise, compteur de cm
B(2, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Gt = at(2, 'grandis') - o2, k = eOutBack(seg(t, Gt - .05, Gt + .7)), s = lerp(1.1, 1.55, k), headY = 1500 - 292 * s, C = at(2, 'centimetres') - o2;
    let ruler = rect(830, 640, 70, 820, SX.acc2, 10, 6); for (let i = 0; i < 16; i++) ruler += line(830, 660 + i * 50, i % 2 ? 860 : 875, 660 + i * 50, 5);
    return gridBg('#2a2440') + ruler + G(tr(865, headY - 110), path('M-60 0L60 0', 'none', 8, SX.acc)) +
      cutout(ado({ x: CX - 60, y: 1500, s, expr: k > .3 ? 'shock' : 'neutral', face: k > .3 ? { eyes: 'huge' } : {} }, t), 12) + (t > Gt ? motionLines(CX - 60, headY - 160, 3, 70, -90, '#fff') : '') +
      funTag(860, headY - 200, `+${counter(0, 12, t, Gt, .8)} cm`, t, Gt, { size: 48, bg: SX.acc }) +
      kthin('tu grandis de plusieurs', CX, 340, t, 0, { size: 52 }) + kword('CENTIMÈTRES', CX, 455, t, C - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[at(2, 'grandis') - o2 - .05, 'whoosh_up', .6], [at(2, 'grandis') - o2 + .3, 'boing', .7], [at(2, 'plusieurs') - o2, 'tick', .5], [at(2, 'centimetres') - o2 - .05, 'pop', .6]] }, o2);

// B003 — « ta peau décide de garder un souvenir du voyage » : la Peau, en touriste, prend un selfie-souvenir (carte postale)
B(3, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => { const S = at(3, 'souvenir'), P = at(3, 'peau'), k = popEl(t, P - .1, .6);
    const peau = k <= 0 ? '' : G(tr(770, 990 + Math.sin(t * 4) * 8, k), blob(0, 0, 150, t, SKIN, 2) + striae(10, 40, .45, t, 1, { n: 3 }) + circ(-45, -30, 14, OL, 0) + circ(45, -30, 14, OL, 0) + path('M-40 20Q0 60 40 20', 'none', 8) + ell(-80, 10, 22, 12, CHEEK, 0) + ell(80, 10, 22, 12, CHEEK, 0) +
      path('M-120 -110Q0 -200 120 -110L150 -95L-150 -95Z', '#ffd23f', 6) + rect(-70, -150, 140, 40, '#ff8fb1', 14, 5) + G(tr(-150, 60, 1, -10), rect(-55, -40, 110, 80, '#2b2b33', 14) + circ(0, 0, 26, '#5ec4f0', 6)));
    return bedroom(t) + ado({ x: 300, y: 1500, s: 1.35, expr: t > S ? 'shock' : 'confused', look: [1, 0] }, t) + peau +
      funTag(770, 760, 'LA PEAU', t, P - .05, { size: 46, bg: SKIN, fg: OL }) + (t > S ? op(1 - seg(t, S, S + .3), rect(-200, -200, W + 400, H + 400, '#fff', 0, 0)) : '') +
      card(CX, 500, 620, 210, ftext(0, -18, 'SOUVENIR DE', { size: 46, fill: SX.ink, stroke: 'none' }) + ftext(0, 52, 'LA CROISSANCE', { size: 58, fill: SX.acc }), t, at(3, 'voyage') - .1, { ry: 12, bg: '#fff7e6', r: -4 }); },
  sfx: [[0, 'whoosh', .5], [at(3, 'peau') - .1, 'boing', .5], [at(3, 'decide'), 'hmm', .4], [at(3, 'souvenir'), 'shutter', .9], [at(3, 'voyage') - .1, 'pop_hi', .5]] });

// B004 — « Des vergetures. » : crash zoom sur la hanche, les lignes se dessinent, étoiles « débloqué »
B(4, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(clamp(t / .4))), shake: t < .3 ? 8 : 0 }),
  draw: (t, d, T) => { const V = at(4, 'verges'); return skinClose(-M, -M, W + 2 * M, H + 2 * M, t, 0, { shorts: false }) + G(tr(0, 0), path(`M-200 1290Q540 1230 1280 1290L1280 2200L-200 2200Z`, '#33415e', 7) + path('M-200 1310Q540 1250 1280 1310', 'none', 5, 'rgba(255,255,255,.4)', 'stroke-dasharray="16 12"')) +
    unlock(CX, 900, t, V, { part: 'back', r: 520 }) + striae(CX, 830, 1.55, t, seg(t, V - .1, V + .45), { n: 5, len: 320, r: -22, gap: 30 }) + unlock(CX, 900, t, V, { part: 'front', r: 520 }) +
    kword('VERGETURES', CX, 470, t, V - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .7], [at(4, 'verges') - .1, 'zap', .5], [at(4, 'verges') - .05, 'boom', .6], [at(4, 'verges') + .15, 'gasp', .6]] });

// B005a — « sur tes hanches, ou tes cuisses » : devant le miroir, loupe ; 2 cartes-inserts qui poussent sur chaque mot
const o5 = at(5, 'ou', 2) - .15;
B(5, { enter: 'drop', cam: camHand(1.04, .4),
  draw: (t, d, T) => { const Hh = at(5, 'hanches') - .1, Cu = at(5, 'cuisses') - .1;
    const insert = (seed) => clipR(-180, -140, 360, 280, skinClose(-180, -140, 360, 280, t, 1, { ms: .9, n: 4 + seed }), 22);
    return bathroom(t) + mirrorV(140, 240, 800, 560) + mirrorShine(140, 240) + adoHead(CX, 560, 150, { expr: t > Hh ? 'shock' : 'confused', look: [0, 1], face: t > Hh ? { eyes: 'huge' } : {} }, t) +
      G(tr(CX + 190, 650, 1, -30), circ(0, 0, 60, 'rgba(200,235,255,.5)', 10) + line(0, 60, 0, 170, 18)) +
      card(300, 960, 360, 280, insert(0), t, Hh, { ry: 0, thick: 10, r: -5, bw: 7 }) + card(780, 960, 360, 280, insert(1), t, Cu, { ry: 0, thick: 10, r: 5, bw: 7 }) +
      funTag(300, 1130, 'HANCHES', t, Hh + .1, { size: 44, bg: SX.acc }) + funTag(780, 1130, 'CUISSES', t, Cu + .1, { size: 44, bg: SX.cool }); },
  sfx: [[0, 'whoosh', .4], [at(5, 'remarques'), 'gasp', .5], [at(5, 'hanches') - .1, 'pop', .7], [at(5, 'cuisses') - .1, 'pop', .7]] });
// B005b — « ou ton dos » : torse nu après la douche, il se tord pour voir son dos dans le miroir
B(5, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: 1.05, hand: .4, r: -3 }),
  draw: (t, d, T) => { const D = at(5, 'dos') - o5;
    const refl = clipR(140, 240, 800, 860, backV(ado, { x: 420, y: 1420, s: 1.45, hairCol: HAIR_H, trunks: '#fff', mcol: MARK, marks: 1, armL: [120, 100], armR: [60, 80] }, t) + mirrorShine(140, 240));
    return bathroom(t) + mirrorV(140, 240, 800, 860) + refl + sink(300, 1300) + bare(ado, { x: 820, y: 1520, s: 1.4, expr: 'dizzy', look: [-1, -.3], trunks: '#fff', rot: -8 + Math.sin(t * 8) * 3, armL: [200, 260], armR: [-40, -100], marks: 1 }, t) +
      markerCircle(420, 1010, 150, 80, t, D + .05, { col: SX.acc }) + funTag(420, 420, 'MON DOS ?!', t, D - .05, { size: 56, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'squeak', .5], [.15, 'boing', .4], [at(5, 'dos') - o5 - .05, 'pop', .6], [at(5, 'dos') - o5 + .05, 'scratch', .5]] }, o5);

// B006 — « De fines lignes que tu n'avais jamais vues » : macro sur la peau, la loupe balaye, les lignes grossissent
B(6, { enter: 'none', trans: 'zoom', transD: .25, cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const lx = lerp(330, 760, eInOut(seg(t, .1, d - .3))), ly = 880, rr = 230, k = seg(t, at(6, 'fine') - .1, at(6, 'ligne') + .3);
    const base = skinClose(-M, -M, W + 2 * M, H + 2 * M, t, k, { shorts: false, ms: 2.4, n: 6 });
    const big = G(`translate(${f1(lx)} ${ly}) scale(1.9) translate(${f1(-lx)} ${-ly})`, base);
    return base + G(tr(0, 0), path('M-200 1300Q540 1250 1280 1300L1280 2200L-200 2200Z', '#33415e', 7)) + clipC(lx, ly, rr, big) + circ(lx, ly, rr, 'none', 22, '#2b2b33') + circ(lx, ly, rr - 14, 'none', 6, 'rgba(255,255,255,.6)') +
      G(tr(lx + rr * .72, ly + rr * .72, 1, -45), rect(-26, 0, 52, 300, '#8a5a3a', 20)) + funBox(lx, ly, rr * 2 + 40, rr * 2 + 40, t, at(6, 'ligne'), { label: 'lignes.png', col: SX.acc }) +
      markerText('JAMAIS VUES !', CX, 440, t, at(6, 'jamais') - .05, { size: 76, col: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(6, 'fine'), 'magic', .5], [at(6, 'ligne'), 'tick', .6], [at(6, 'jamais') - .05, 'scratch', .5], [at(6, 'auparavant'), 'hmm', .4]] });

// B007 — « Au vestiaire, quelqu'un demande » : vestiaire vivant (figurants, vapeur), Kevin pointe du doigt
B(7, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t) * 15 }, [{ z: 1.5, svg: lockerRoom(t) + kidsBg(t, 1250, 3, .5), haze: .08 },
    { z: 1, svg: inShorts(ado, { x: 300, y: 1500, s: 1.35, expr: t > at(7, 'demande') ? 'worried' : 'neutral' }, t) + kevin({ x: 790, y: 1500, s: 1.35, expr: 'suspicious', flip: 1, armL: [190, 195] }, t) },
    { z: .6, svg: blur(10, G(tr(CX, 1800), rect(-800, -110, 1600, 220, '#c49a6c', 40))) }]) +
    funTag(CX, 430, 'VESTIAIRE', t, at(7, 'vestiaire') - .05, { size: 60, bg: SX.cool }) + blob(790, 830, 60, t, '#fff', 3, { t0: at(7, 'demande') }) + (t > at(7, 'demande') ? ftext(790, 858, '?', { size: 80, fill: SX.acc }) : ''),
  sfx: [[0, 'whoosh', .5], [.1, 'steps', .4], [at(7, 'vestiaire') - .05, 'pop', .6], [at(7, 'quelqu'), 'hmm', .5]] });

// B008 — « C'est quoi ces marques ? » : crash zoom Kevin, les figurants se retournent, mot-clé slam
B(8, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 5, r: 4 }),
  draw: (t, d, T) => { const C = at(8, 'ces') - .05; return blur(8, lockerRoom(t)) + rays(t, CX, 900, 'rgba(255,255,255,.12)', 'rgba(255,255,255,0)', 18) +
    G(tr(110, 980), op(.9, head({ hr: 85, hair: 'bun', hairColor: '#8a5a3a', expr: 'shock', look: [1, 0], seed: 21 }, t))) + G(tr(975, 1000), head({ hr: 85, hair: 'curly', hairColor: '#2b2420', expr: 'jawdrop', look: [-1, 0], seed: 22 }, t)) +
    kevinHead(CX, 860, 210, { expr: 'suspicious', face: { mouth: 'talk' } }, t) + G(tr(CX + 250, 1080, 1, -30), circ(0, 0, 50, SKIN) + rect(-14, -110, 28, 90, SKIN, 14)) +
    kword('CES MARQUES ?', CX, 450, t, C, { size: 88, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .7], [at(8, 'quoi'), 'gasp', .5], [at(8, 'ces') - .05, 'boom', .6], [at(8, 'marques'), 'sting', .4]] });

// B009 — « Tu hausses les épaules, tu tires ton t-shirt vers le bas » : haussement, puis t-shirt tiré jusqu'au sol (robe XXL)
B(9, { enter: 'punch', cam: camHand(1.04, .5),
  draw: (t, d, T) => { const Hs = at(9, 'hausses'), Ti = at(9, 'tires'), sh = seg(t, Hs, Hs + .2) * (1 - seg(t, Ti - .3, Ti)), k = eOutCubic(seg(t, Ti, at(9, 'bas') + .2)), s = 1.4;
    const arms = t < Ti - .1 ? { armL: [lerp(110, 170, sh), lerp(100, 250, sh)], armR: [lerp(70, 10, sh), lerp(80, -70, sh)] } : { armL: [100, 85], armR: [80, 95] };
    const shirtL = G(tr(CX, 1500, s), rect(-76, -70, 152, 40 + 120 * k, SHIRT_H, 18, 7) + [-40, 0, 40].map(x => line(x, -50, x * 1.1, -40 + 110 * k, 4, 'rgba(0,0,0,.15)')).join(''));
    return lockerRoom(t) + inShorts(ado, Object.assign({ x: CX, y: 1500, s, expr: 'embarrassed', look: [0, .5] }, arms), t) + (k > 0 ? shirtL : '') + (sh > .5 ? motionLines(CX - 170, 1150, 3, 50, -90) + motionLines(CX + 170, 1150, 3, 50, -90) : '') +
      funTag(CX, 440, 'T-SHIRT XXL', t, at(9, 'bas') - .1, { size: 60, bg: SX.acc2, fg: SX.ink }) + markerArrow(CX + 300, 560, CX + 140, 1160, t, at(9, 'bas'), { bend: -60, col: SX.acc }) + sweatSpray(CX, 1000, t, 4); },
  sfx: [[at(9, 'hausses'), 'boing', .5], [at(9, 'tires'), 'squeak', .6], [at(9, 'tires') + .2, 'whoosh', .4], [at(9, 'bas') - .1, 'pop', .6], [at(9, 'bas') + .2, 'whistle', .4]] });

// B010a — « À partir de ce jour » : concept papier, calendrier qui s'effeuille, JOUR 1
const o10 = at(10, 'la') - .15;
B(10, { enter: 'none', trans: 'wipe', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const J = at(10, 'jour') - .05; let pages = ''; for (let i = 0; i < 3; i++) { const k = seg(t, .1 + i * .25, .6 + i * .25); if (k > 0 && k < 1) pages += G(tr(CX + k * 500, 860 - k * 300, 1, k * 70), rect(-200, -220, 400, 440, '#fff', 18)); }
    const cal = rect(-200, -220, 400, 440, '#fff', 18) + rect(-200, -220, 400, 100, SX.acc, 18) + rect(-200, -150, 400, 30, SX.acc, 0, 0) + line(-200, -120, 200, -120, 7) + ftext(0, -150, 'PISCINE', { size: 44, fill: '#fff' }) + ftext(0, 80, t > J ? '1' : '0', { size: 200, fill: SX.ink, stroke: 'none' }) + ftext(0, 170, 'JOUR', { size: 44, fill: '#7a8a99', stroke: 'none' });
    return paper(SX.paper) + gobo(T, .12) + G(tr(CX, 860, 1 + .04 * popEl(t, J, .5) - .04), cal) + pages + cutout(adoHead(870, 1080, 100, { expr: 'worried' }, t), 10) +
      kthin('à partir de', CX, 350, t, 0, { size: 58, fill: SX.ink }) + kword('CE JOUR', CX, 470, t, J, { size: 110, fill: SX.acc }); },
  sfx: [[0, 'whoosh', .5], [.1, 'flutter', .4], [at(10, 'partir'), 'tick', .5], [at(10, 'jour') - .05, 'boom', .5], [at(10, 'jour') + .2, 'drum', .4]] });
// B010b — « la piscine devient une opération militaire » : commando en t-shirt, casque à feuilles, HUD vision tactique
B(10, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.05, hand: .6 }),
  draw: (t, d, T) => { const Op = at(10, 'operation') - o10, Mi = at(10, 'militaire') - o10, x = lerp(300, 620, seg(t, 0, d)); const ho = { x, y: 1500, s: 1.35 };
    let hud = ''; for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) hud += path(`M${CX + a * 470} ${960 + b * 620 - b * 90}L${CX + a * 470} ${960 + b * 620}L${CX + a * 470 - a * 90} ${960 + b * 620}`, 'none', 10, '#7dff7a');
    hud += G(tr(x, 1106), circ(0, 0, 170, 'none', 5, 'rgba(125,255,122,.8)') + line(-210, 0, -130, 0, 5, '#7dff7a') + line(130, 0, 210, 0, 5, '#7dff7a')) + ftext(110, 330, 'REC', { size: 36, anchor: 'start', fill: '#7dff7a', stroke: 'none' }) + circ(85, 318, 12, Math.sin(t * 8) > 0 ? '#ff3b30' : 'none', 0);
    return pool(t) + op(.18, rect(-M, -M, W + 2 * M, H + 2 * M, '#2f6f2a', 0, 0)) + inShorts(ado, Object.assign({ expr: 'suspicious', walk: 1.5, look: [1, 0], armR: [-30, -80] }, ho), t) + commando(ho) +
      hud + kword('OPÉRATION', CX, 430, t, Op, { size: 96, fill: '#7dff7a' }) + kword('MILITAIRE', CX, 540, t, Mi, { size: 96, fill: '#fff' }) +
      funTag(CX, 700, 'MISSION : GARDER LE T-SHIRT', t, Mi + .35, { size: 38, bg: '#5d7a3a' }); },
  sfx: [[0, 'flash_hit', .5], [at(10, 'piscine') - o10, 'waves', .4], [at(10, 'operation') - o10, 'drum', .6], [at(10, 'militaire') - o10, 'boom', .5], [at(10, 'militaire') - o10 + .35, 'tiptoe', .5]] }, o10);

// B011a — « Pourtant, les vergetures peuvent apparaître » : changement de ton, cours de SVT, schéma de la peau au tableau
const o11 = at(11, 'quand') - .15;
B(11, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const A = at(11, 'apparaitre'), k = seg(t, A - .1, A + .5);
    const board = rect(200, 470, 680, 90, '#ffb3c6', 10, 5, '#fff') + rect(200, 560, 680, 120, '#ffe08a', 0, 5, '#fff') + rect(200, 680, 680, 90, '#ffd0a8', 10, 5, '#fff') +
      striae(540, 600, .9, t, k, { n: 4, col: '#fff', hi: '#ff4f87', len: 260 }) + ftext(540, 380, 'LA PEAU', { size: 56, fill: 'rgba(255,255,255,.9)', stroke: 'none' });
    return classroom(t) + board + (k > 0 && k < 1 ? popStars(540, 620, t, A, 6, 260) : '') + prof({ x: 870, y: 1560, s: 1.25, expr: 'talk', flip: 1, armL: [200, 220] }, t) + G(tr(760, 950, 1, -140), line(0, 0, 0, 260, 10, '#8a5a3a')) +
      ado({ x: 280, y: 1500, s: 1.3, expr: 'confused', look: [1, -.5] }, t) + funTag(300, 920, 'POURTANT…', t, at(11, 'pourtant'), { size: 46, bg: SX.cool, r: -6 }); },
  sfx: [[0, 'whoosh', .4], [at(11, 'pourtant'), 'pop', .5], [at(11, 'vergesetures'), 'scratch', .4], [at(11, 'apparaitre'), 'magic', .6]] });
// B011b — « quand la peau s'étire rapidement » : le pizzaiolo étire une pâte-peau à toute vitesse → elle se raye
B(11, { enter: 'whip', cam: (t, d) => ({ z: 1.05, shake: t > at(11, 'etire') - o11 ? 4 : 0 }),
  draw: (t, d, T) => { const E = at(11, 'etire') - o11, Rp = at(11, 'rapidement') - o11, k = eOutBack(seg(t, E - .1, E + .4)), rx = lerp(170, 430, k);
    const dough = G(tr(CX, 760 + Math.sin(t * 6) * 10, 1, Math.sin(t * 20) * 3 * k), ell(0, 0, rx, 110 - 30 * k, SKIN) + ell(0, 0, rx - 22, 86 - 26 * k, '#f8d9b8', 0) + striae(-rx * .45, -20, .5, t, seg(t, Rp - .1, Rp + .4), { n: 3, r: 80 }) + striae(rx * .45, -20, .5, t, seg(t, Rp - .1, Rp + .4), { n: 3, r: 80 }) +
      circ(-36, -10, 12, OL, 0) + circ(36, -10, 12, OL, 0) + ell(0, 34, 22, 28 * (.6 + .4 * k), '#7a2b2b', 6));
    return pizzeria(t) + pizzaiolo({ x: CX, y: 1580, s: 1.25, expr: 'ecstatic', armL: [235, 250], armR: [-55, -70] }, t) + dough + (k > .5 ? speedLines(t, CX, 760, 24, 'rgba(255,255,255,.8)') : '') +
      funTag(CX, 590, 'LA PEAU', t, at(11, 'peau') - o11 - .05, { size: 40, bg: SKIN, fg: OL }) + kword("S'ÉTIRE", CX, 360, t, E - .05, { size: 90, fill: '#fff' }) + kword('RAPIDEMENT', CX, 1000, t, Rp - .05, { size: 80, fill: SX.acc2, r: -4 }); },
  sfx: [[0, 'whoosh_up', .5], [at(11, 'etire') - o11, 'squeak', .7], [at(11, 'etire') - o11 + .2, 'boing', .5], [at(11, 'rapidement') - o11, 'zap', .5]] }, o11);

// B012 — « notamment pendant la puberté » : mise à jour en cours, il bugge et grandit par à-coups
B(12, { enter: 'punch', cam: () => ({ z: 1.05, shake: 3 }),
  draw: (t, d, T) => { const P = at(12, 'puberte') - .05, j = 1 + .06 * Math.max(0, Math.sin(t * 22)) * seg(t, 0, P);
    const hero_ = ado({ x: CX, y: 1500, s: 1.35 * j, expr: 'dizzy', look: [0, -.4] }, t);
    return bedroom(t) + burst(CX, 450, 330, t, P, SX.acc, 16) + glitch(hero_, T, .5 * (1 - seg(t, P, P + .3)) + .15, 3) + bar(CX, 660, 640, seg(t, 0, d - .2) * .87 + .1, { label: 'MISE À JOUR…', col: SX.acc }) +
      kword('PUBERTÉ', CX, 450, t, P, { size: 110, fill: '#fff' }); },
  sfx: [[0, 'printer', .4], [at(12, 'notamment'), 'typing', .4], [at(12, 'puberte') - .05, 'boom', .6], [at(12, 'puberte') + .25, 'squeak', .4]] });

// B013 — « chez des personnes de morphologies très différentes » : bord de piscine, 5 silhouettes, toutes avec des lignes
B(13, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const P = at(13, 'personnes'); let s = pool(t);
    const ppl = [[130, .82, 1.25, '#f2c9a0', 'ponytail', '#e0a040', 1, '#ff8fb1'], [330, 1.25, 1.0, '#c98a5e', 'short', '#1f1a18', 0, '#4d7cf0'], [540, 1, 1.12, '#8a5a3a', 'curly', '#1f1a18', 1, '#ffd23f'], [750, 1.1, 1.18, '#f6d7b8', 'spiky', '#c4521b', 0, '#7be07b'], [950, .9, .95, '#e0b088', 'bun', '#5a3a26', 1, '#b56cff']];
    ppl.forEach(([x, sx, sy, sk, hair, hc, girl, sw], i) => { const pk = seg(t, P + i * .12, P + i * .12 + .4); const o = { x: 0, y: 0, s: 1, skin: sk, hair, hairColor: hc, expr: ['happy', 'cool', 'joy', 'smug', 'proud'][i], seed: 40 + i, trunks: sw, marks: pk, mcol: i === 2 ? MARK_S : MARK };
      const body = girl ? person(Object.assign({}, o, { age: 'kid', shirt: sw, sleeve: sk, pants: sk, shoes: sk, collar: false }), t) + G('', striae(-90, -150, .26, t, pk, { n: 3, r: -70, col: o.mcol })) : bare(person, Object.assign({ age: 'kid' }, o), t);
      s += G(`translate(${x} ${1420 + Math.sin(t * 3 + i) * 4}) scale(${sx} ${sy})`, body) + (pk > 0 && pk < 1 ? popStars(x, 1270, t, P + i * .12, 5, 90) : ''); });
    return s + kthin('des morphologies', CX, 350, t, at(13, 'morphologie') - .1, { size: 56 }) + kword('TRÈS DIFFÉRENTES', CX, 460, t, at(13, 'tres') - .05, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(13, 'existent'), 'pop', .5], [at(13, 'personnes'), 'pop_hi', .5], [at(13, 'personnes') + .36, 'pop_hi', .5], [at(13, 'tres') - .05, 'boom', .5]] });

// B014 — « ne signifient pas automatiquement un problème de santé » : médecin chill de ouf, alarme barrée, tampon BONNE SANTÉ
B(14, { enter: 'whip', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Pa = at(14, 'pas'), Sa = at(14, 'sante') - .05, siren = t < Pa;
    return doctorRoom(t) + G(tr(CX, 1330), rect(-200, -60, 400, 70, '#fff', 20) + line(-160, 10, -160, 120, 12) + line(160, 10, 160, 120, 12)) +
      inShorts(ado, { x: CX - 40, y: 1300, s: 1.25, expr: t > Sa ? 'joy' : 'worried', legL: [0, 90], legR: [10, 90] }, t) +
      doc({ x: 870, y: 1560, s: 1.2, expr: 'chill', flip: 1, armL: [150, 250], holdL: G(tr(0, -20), rect(-24, -50, 48, 56, '#fff', 8) + steam(0, -60, t, .4)) }, t) +
      G(tr(250, 600), path('M-70 40L-70 -10A70 70 0 0 1 70 -10L70 40Z', siren && Math.sin(t * 14) > 0 ? '#ff3b30' : '#a8302a', 6) + rect(-90, 40, 180, 30, '#59616c', 8) + (siren ? op(.3, circ(0, 0, 160, '#ff3b30', 0)) : '')) + cross(250, 600, .9, t, Pa) +
      ftext(250, 730, 'PROBLÈME ?', { size: 40, fill: '#fff' }) + stamp(CX + 40, 470, 'BONNE SANTÉ', t, Sa, '#2e9e5b', -8, 74); },
  sfx: [[0, 'ding', .3], [at(14, 'signifient'), 'siren', .3], [at(14, 'pas'), 'error_beep', .5], [at(14, 'probleme'), 'hmm', .4], [at(14, 'sante') - .05, 'thud', .8]] });

// B015a — « Mais sur les réseaux » : nuit, lit, visage éclairé par l'écran, notifs qui poussent
const o15 = at(15, 'tout') - .15;
B(15, { enter: 'none', trans: 'glitch', transD: .25, cam: zin(1.04, 1.1),
  draw: (t, d, T) => { const Rz = at(15, 'reseaux'); return bedroom(t, 1) + glow(CX, 900, 460, '#8fd3ff', .55) + adoHead(CX, 860, 210, { expr: 'neutral', look: [0, 1] }, t) + G(tr(CX, 1170, 1, 0), rect(-110, -70, 220, 140, '#2b2b33', 20) + rect(-96, -58, 192, 116, '#bfe6ff', 10, 0)) +
    [0, 1, 2].map(i => G(tr(220 + i * 320, 560 + (i % 2) * 90), heart(0, 0, popEl(t, Rz + i * .12, .5) * 1.1, i === 1 ? SX.acc : '#ff5d73'))).join('') + funTag(CX, 420, 'RÉSEAUX', t, Rz - .05, { size: 60, bg: SX.acc }); },
  sfx: [[0, 'vibrate', .6], [at(15, 'reseaux') - .05, 'pop_hi', .5], [at(15, 'reseaux') + .12, 'ding', .4], [at(15, 'reseaux') + .24, 'ding', .3]] });
// B015b — « tout le monde possède une peau parfaitement lisse » : feed filtré, peau-miroir… une mouche glisse dessus
B(15, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pf = at(15, 'parfaitement') - o15, Li = at(15, 'lisse') - o15, fk = seg(t, Li, Li + .6);
    const scr = grad('#ffd1e3', '#fff1f6', -150, -295, 300, 590) + path('M-120 160Q-120 40 0 40Q120 40 120 160L120 295L-120 295Z', '#fbe3d0', 6) + G(tr(0, -60), head({ hr: 88, hair: 'long', hairColor: '#e0b040', skin: '#fbe3d0', expr: 'perfect', seed: 12 }, t)) +
      ell(-40, -100, 26, 14, 'rgba(255,255,255,.85)', 0) + ell(60, 110, 40, 12, 'rgba(255,255,255,.8)', 0) + sparkle(90, -130, .4 + .2 * Math.sin(t * 9), '#fff') + sparkle(-90, 90, .3 + .2 * Math.sin(t * 7), '#fff') +
      rect(-150, 220, 300, 75, '#fff', 0, 0) + heart(-100, 258, .5, SX.acc) + ftext(10, 272, `${counter(12, 999, t, 0, d)}K`, { size: 40, fill: SX.ink, stroke: 'none' });
    const flyX = lerp(30, 160, fk), flyY = lerp(80, 300, fk * fk);
    return bedroom(t, 1) + glow(CX, 900, 520, '#ffb3d0', .45) + phoneXL(CX, 900, 1.1, -3, scr) + (t > Li - .4 ? fly(CX + flyX * 1.1, 900 + flyY * 1.1 - 40, .5, t, {}) : '') +
      funTag(190, 1000, 'FILTRE', t, at(15, 'possede') - o15, { size: 40, bg: SX.cool, r: -10 }) + funTag(890, 700, 'LISSE', t, Li - .05, { size: 54, bg: '#fff', fg: SX.ink, r: 8 }) +
      kthin('tout le monde : peau', CX, 330, t, 0, { size: 50 }) + kword('PARFAITE', CX, 440, t, Pf - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(15, 'possede') - o15, 'pop_hi', .5], [at(15, 'parfaitement') - o15 - .05, 'sparkle', .6], [at(15, 'lisse') - o15, 'glint', .8], [at(15, 'lisse') - o15 + .25, 'squeak', .5]] }, o15);

// B016a — « Et toi, tu commences à penser que… » : assis sur le lit, la nuit, nuage de pensée qui grossit
const o16 = at(16, 'ton') - .15;
B(16, { enter: 'drop', cam: zin(1.03, 1.1, .2),
  draw: (t, d, T) => { const Pe = at(16, 'penser'), k = popEl(t, Pe - .1, .6);
    return bedroom(t, 1) + glow(CX, 1100, 300, '#8fd3ff', .3) + ado({ x: 420, y: 1500, s: 1.35, expr: 'sad', look: [0, .6], armR: [110, 200] }, t) +
      [[620, 900, 22], [700, 820, 34]].map(([x, y, r], i) => circ(x, y, r * popEl(t, Pe - .3 + i * .1, .5), '#fff', 6)).join('') +
      (k > 0 ? G(tr(760, 620, k), cloud(0, 0, 1.6, '#fff', 7) + ftext(0, 30, '?', { size: 110, fill: SX.acc })) : '') + kthin('et toi…', CX - 220, 400, t, at(16, 'toi') - .05, { size: 66 }); },
  sfx: [[0, 'hmm', .4], [at(16, 'toi'), 'heartbeat', .4], [at(16, 'penser') - .3, 'pop', .4], [at(16, 'penser') - .1, 'flutter', .4]] });
// B016b — « ton corps a été mal fabriqué » : usine, tapis roulant, tampon MAL FABRIQUÉ ?, larmes en fontaine
B(16, { enter: 'crash', flash: 1, cam: () => ({ z: 1.05, shake: 3, hand: .4 }),
  draw: (t, d, T) => { const Ma = at(16, 'mal') - o16, Fa = at(16, 'fabrique') - o16, x = lerp(360, 600, t / d), arm = seg(t, Ma - .25, Ma) * (1 - seg(t, Ma + .15, Ma + .45));
    return factory(t) + ado({ x, y: 1500, s: 1.35, expr: t > Ma ? 'sob' : 'worried' }, t) + G(tr(x, lerp(-60, 760, arm)), rect(-16, -900, 32, 820, '#59616c', 10) + rect(-90, -90, 180, 80, '#ffd23f', 14)) +
      stamp(CX, 520, 'MAL FABRIQUÉ ?', t, Ma, '#e2463a', -10, 70) + funBox(x, 1100, 330, 300, t, Fa, { label: 'erreur.exe', col: '#e2463a' }); },
  sfx: [[0, 'printer', .5], [at(16, 'corps') - o16, 'hammer', .5], [at(16, 'mal') - o16, 'error_beep', .6], [at(16, 'mal') - o16 + .02, 'thud', .7], [at(16, 'fabrique') - o16, 'gasp', .4]] }, o16);

// B017 — « Un été, tu pars à la plage avec ton cousin » : plage vivante (mouettes, vagues), les deux marchent
B(17, { enter: 'none', trans: 'wipe', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const dx = t * 30; return depth({ zoom: 1, x: Math.sin(t * .8) * 20 }, [{ z: 1.6, svg: beach(t) + sun(860, 300, .4, t, 'happy') },
    { z: 1, svg: parasol(170, 1330, .9) + ado({ x: 330 + dx, y: 1500, s: 1.35, expr: 'happy', walk: 2, look: [1, 0] }, t) + cuz({ x: 720 + dx, y: 1500, s: 1.4, expr: 'cool', walk: 2, flip: 1, look: [-1, 0] }, t) },
    { z: .55, svg: blur(10, fgShell(120, 1760, 1.4, 20) + fgShell(960, 1820, 1.1, -30)) }]) +
    funTag(CX - 140, 430, 'UN ÉTÉ', t, at(17, 'ete') - .05, { size: 70, bg: SX.acc2, fg: SX.ink }) + funTag(720 + dx, 880, 'LE COUSIN', t, at(17, 'cousin') - .05, { size: 44, bg: '#ff9a3c' }); },
  sfx: [[0, 'waves', .5], [.2, 'steps', .3], [at(17, 'ete') - .05, 'pop', .6], [at(17, 'plage'), 'chirp', .4], [at(17, 'cousin') - .05, 'pop_hi', .6]] });

// B018 — « Il enlève son t-shirt » : le t-shirt part en hélicoptère, cousin torse nu, chill de ouf
B(18, { enter: 'punch', cam: zin(1.03, 1.08, .3),
  draw: (t, d, T) => { const E = at(18, 'enleve'), Sh = at(18, 'shirt'), k = seg(t, E, Sh + .1), off = k > .6, fk = seg(t, Sh - .05, Sh + .8);
    const o = { x: 600, y: 1500, s: 1.42, expr: off ? 'cool' : 'happy', armL: k > 0 && !off ? [250, 270] : off ? [200, 240] : [110, 100], armR: k > 0 && !off ? [-70, -90] : off ? [-20, -60] : [70, 80] };
    return beach(t) + glow(600, 1050, 420, '#fff3b0', off ? .5 : 0) + ado({ x: 170, y: 1500, s: 1.3, expr: off ? 'shock' : 'neutral', look: [1, 0] }, t) + (off ? bare(cuz, Object.assign({ skin: SKIN_C, trunks: '#2f6f8f' }, o), t) : cuz(o, t)) +
      (off ? tshirtShape(lerp(600, 880, fk), lerp(1000, 360, eOutCubic(fk)), .9, t * 900) + popStars(600, 1000, t, Sh + .1, 7, 260) : '') + funTag(CX, 450, 'CHILL', t, Sh + .2, { size: 64, bg: SX.cool }); },
  sfx: [[.05, 'waves', .3], [at(18, 'enleve'), 'whoosh_up', .6], [at(18, 'shirt'), 'flutter', .6], [at(18, 'shirt') + .2, 'sparkle', .5]] });

// B019 — « les mêmes lignes sur son dos » : gros plan dos du cousin, lignes argentées entourées, l'ado passe la tête
B(19, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Me = at(19, 'memes'), Li = at(19, 'lignes');
    return beach(t, { hz: 640 }) + backV(cuz, { x: 470, y: 1240, s: 2.6, skin: SKIN_C, armL: [115, 95], armR: [65, 85] }, t) + markerCircle(360, 860, 110, 120, t, Me, { col: SX.acc2 }) + markerCircle(580, 860, 110, 120, t, Me + .15, { col: SX.acc2 }) +
      adoHead(900, 620, 115, { expr: 'shock', face: { eyes: 'huge' }, look: [-1, .3], tilt: -10 }, t) + funBox(470, 860, 460, 280, t, Li, { label: 'pareil.png', col: SX.acc }); },
  sfx: [[0, 'whoosh', .4], [at(19, 'remarques'), 'gasp', .5], [at(19, 'memes'), 'scratch', .5], [at(19, 'lignes'), 'tick', .5], [at(19, 'dos'), 'pop', .5]] });

// B020 — « Toi aussi ? » : crash zoom, mâchoire au sol
B(20, { enter: 'crash', flash: 1, cam: () => ({ z: 1.08, shake: 8 }),
  draw: (t, d, T) => rays(t, CX, 820, '#ff8fb8', '#ff4f87', 22) + adoHead(CX, 760, 230, { expr: 'jawdrop' }, t) + kword('TOI AUSSI ?', CX, 430, t, at(20, 'toi') - .05, { size: 100, fill: SX.acc2 }),
  sfx: [[0, 'flash_hit', .6], [at(20, 'toi'), 'boing', .5], [at(20, 'aussi'), 'boom', .5]] });

// B021 — « Il regarde. Ah, ça ! » : le cousin jette un œil par-dessus l'épaule, zen total
B(21, { enter: 'whip', cam: camHand(1.04, .4),
  draw: (t, d, T) => { const A = at(21, 'ah') - .05; return beach(t) + bare(cuz, { x: CX + 60, y: 1500, s: 1.42, skin: SKIN_C, trunks: '#2f6f8f', expr: t > A ? 'zen' : 'cool', look: [-1, .6], marks: 1, mcol: MARK_S, armL: [130, 200] }, t) +
    ado({ x: 140, y: 1500, s: 1.25, expr: 'wow', look: [1, 0] }, t) + burst(CX + 60, 520, 210, t, A, SX.acc2) + ftext(CX + 60, 545, 'AH, ÇA !', { size: t > A ? 66 * popEl(t, A, .5) : 0.1, fill: SX.ink, stroke: '#fff', sw: 10 }); },
  sfx: [[at(21, 'regarde'), 'hmm', .5], [at(21, 'ah') - .05, 'pop', .6], [at(21, 'ca'), 'boing', .4]] });

// B022 — « Depuis ma poussée de croissance » : flashback carte, mini-cousin qui pousse comme un haricot magique
B(22, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Po = at(22, 'poussee') - .05, k = eOutBack(seg(t, Po, Po + .6)), s = lerp(.5, .95, k);
    let rul = ''; for (let i = 0; i < 9; i++) rul += line(230, 300 - i * 50, 260, 300 - i * 50, 5) + (i % 2 ? '' : ftext(200, 312 - i * 50, String(8 + i), { size: 26, fill: SX.ink, stroke: 'none', anchor: 'end' }));
    const inner = rect(-340, -260, 680, 520, '#fbe7c9', 20, 0) + G(tr(0, 0), rect(222, -170, 40, 480, '#e8c38a', 8, 4)) + G(tr(-340, -40), rul) + cuz({ x: -20, y: 240, s, expr: k > .3 ? 'ecstatic' : 'happy' }, t) + (k > 0 && k < 1 ? motionLines(-20, 240 - 292 * s - 60, 3, 50, -90) : '');
    return paper('#ffe9c9') + gobo(T, .1) + card(CX, 880, 700, 540, filmBW(inner, T), t, 0, { ry: lerp(16, 0, seg(t, 0, .4)), bg: '#fff', r: -3 }) +
      kthin('depuis ma', CX, 340, t, 0, { size: 60, fill: SX.ink }) + kword('POUSSÉE', CX, 450, t, Po, { size: 106, fill: SX.acc }) + funTag(820, 1160, 'DE CROISSANCE', t, at(22, 'croissance') - .05, { size: 36, bg: SX.cool }); },
  sfx: [[0, 'rewind', .5], [at(22, 'poussee') - .05, 'boom', .5], [at(22, 'poussee'), 'whoosh_up', .6], [at(22, 'croissance'), 'boing', .5]] });

// B023 — « Puis, il court dans l'eau » : sprint vers la mer, éclaboussure géante
B(23, { enter: 'whip', cam: (t, d) => ({ z: 1.04, shake: t > at(23, 'eau') ? 5 : 0 }),
  draw: (t, d, T) => { const C = at(23, 'court'), Ea = at(23, 'eau'), k = seg(t, C - .2, Ea), sp = seg(t, Ea, Ea + .7);
    const cx = lerp(380, 770, k), cy = lerp(1500, 1230, k), cs = lerp(1.35, .75, k);
    let splash = ''; if (sp > 0 && sp < 1) for (let i = 0; i < 14; i++) { const a = R(-170 + i * 12.5), dd = 60 + 380 * eOutCubic(sp); splash += circ(770 + Math.cos(a) * dd, 1120 + Math.sin(a) * dd * .9 + 300 * sp * sp, 26 * (1 - sp) + 6, '#e8f8ff', 4, '#5ab8dc'); }
    return beach(t) + ado({ x: 140, y: 1500, s: 1.25, expr: 'wow', look: [1, 0] }, t) + (sp < .2 ? bare(cuz, { x: cx, y: cy, s: cs, skin: SKIN_C, trunks: '#2f6f8f', expr: 'ecstatic', walk: 4, flip: 1, armL: [200, 200], armR: [-20, -20] }, t) : '') +
      (sp > 0 ? ell(770, 1150, 200 * (1 - sp) + 40, 40, 'rgba(255,255,255,.9)', 0) : '') + splash + (k > 0 && k < 1 ? motionLines(cx - 150 * cs, cy - 200 * cs, 3, 80, 180) : '') +
      kword('PLOUF !', 770, 700, t, Ea + .05, { size: 100, fill: '#5ec4f0' }); },
  sfx: [[at(23, 'puis'), 'whoosh', .5], [at(23, 'court'), 'steps', .7], [at(23, 'eau'), 'waves', .7], [at(23, 'eau') + .05, 'boing', .5]] });

// B024 — « Comme si rien d'extraordinaire ne venait de se passer » : bouée flamant, coco, une mouette se pose sur sa tête
B(24, { enter: 'drop', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Ri = at(24, 'rien'), Pa = at(24, 'passer'), gk = seg(t, Pa - .6, Pa);
    return beach(t, { hz: 700, sy: 1900, gulls: false }) + flamingo(CX, 1180 + Math.sin(t * 2) * 10, 1.1, t) +
      bare(cuz, { x: CX - 20, y: 1250 + Math.sin(t * 2) * 10, s: 1.25, skin: SKIN_C, trunks: '#2f6f8f', expr: 'chill', armR: [-60, -120], holdR: G(tr(0, -20), circ(0, 0, 40, '#8a5a3a') + line(0, -40, 20, -90, 6, '#ff4f87')) }, t) +
      eagle({ gull: 1, x: lerp(1100, CX + 10, eOutCubic(gk)), y: lerp(400, 820 + Math.sin(t * 2) * 10, eOutCubic(gk)), s: .28, flip: 1, wingA: gk >= 1 ? -30 : undefined, expr: 'happy' }, t) +
      funTag(CX, 440, 'RIEN À SIGNALER', t, Ri - .05, { size: 52, bg: '#fff', fg: SX.ink }) + markerText('tranquille.', 780, 600, t, at(24, 'extraordinaire'), { size: 54, col: SX.acc2 }); },
  sfx: [[0, 'waves', .5], [at(24, 'rien') - .05, 'pop', .5], [at(24, 'extraordinaire'), 'scratch', .4], [at(24, 'passer') - .5, 'flutter', .5], [at(24, 'passer'), 'chirp', .5]] });

// B025 — « Tu restes un instant sur le sable » : plan large, coucher de soleil, seul assis, un crabe passe
B(25, { enter: 'none', trans: 'circle', transD: .35, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => beach(t, { dusk: 1 }) + ado({ x: 420, y: 1420, s: 1.35, expr: 'sad', look: [1, -.2], legL: [0, 90], legR: [-10, 85], armL: [70, 20], armR: [60, 30] }, t) +
    crab({ x: lerp(1150, 700, t / d), y: 1480, s: .45, walk: 1 }, t) + kthin('un instant…', 760, 430, t, at(25, 'instant') - .1, { size: 60 }),
  sfx: [[0, 'waves', .6], [.3, 'wind', .3], [at(25, 'instant'), 'tick', .3], [at(25, 'sable'), 'snip', .3]] });

// B026a — « Parce que tu viens de comprendre que… » : gros plan, ampoule qui s'allume
const o26 = at(26, 'ton') - .15;
B(26, { enter: 'none', cam: zin(1.04, 1.12),
  draw: (t, d, T) => { const Co = at(26, 'comprendre'); return beach(t, { dusk: 1, gulls: false }) + adoHead(CX, 930, 230, { expr: t > Co ? 'wow' : 'neutral', look: [0, -.4] }, t) + bulb(CX, 520, 1.1, t > Co) + (t > Co ? popStars(CX, 520, t, Co, 8, 200) : ''); },
  sfx: [[0, 'whoosh', .3], [at(26, 'viens'), 'hmm', .3], [at(26, 'comprendre'), 'ding', .7], [at(26, 'comprendre') + .1, 'magic', .5]] });
// B026b — « ton corps n'a pas été abîmé » : insert hanche au soleil couchant, ABÎMÉ barré, les lignes brillent
B(26, { enter: 'none', trans: 'zoom', transD: .22, cam: zin(1.02, 1.08),
  draw: (t, d, T) => { const Pa = at(26, 'pas') - o26, Ab = at(26, 'abime') - o26;
    return skinClose(-M, -M, W + 2 * M, H + 2 * M, t, 1, { shorts: false, ms: 2.4, n: 5, shine: t > Ab }) + glow(900, 300, 700, '#ffb15a', .35) + G(tr(0, 0), path('M-200 1290Q540 1230 1280 1290L1280 2200L-200 2200Z', '#33415e', 7)) +
      funTag(CX, 470, 'ABÎMÉ', t, at(26, 'corps') - o26, { size: 80, bg: '#9aa3ad' }) + cross(CX, 470, 1.4, t, Pa) + kword('INTACT', CX, 1080, t, Ab, { size: 90, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(26, 'corps') - o26, 'pop', .5], [at(26, 'pas') - o26, 'thud', .6], [at(26, 'abime') - o26, 'sparkle', .6]] }, o26);

// B027 — « Il a grandi. » : debout, fier, devant une toise avec ses tailles (12, 14, 16 ans), étoiles « débloqué »
B(27, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Gr = at(27, 'grandi'); let toise = rect(700, 640, 90, 860, '#e8c38a', 10, 6);
    [[1240, '10'], [1110, '12'], [990, '14'], [870, '16']].forEach(([y, l], i) => { const k = seg(t, .1 + i * .2, .3 + i * .2); toise += line(700, y, 700 + 90 * k, y, 6, i === 3 ? SX.acc : OL) + (k > .5 ? ftext(810, y + 14, l + ' ans', { size: 34, anchor: 'start', fill: i === 3 ? SX.acc : '#fff' }) : ''); });
    return beach(t, { dusk: 1 }) + unlock(450, 1000, t, Gr, { part: 'back', r: 460 }) + toise + ado({ x: 450, y: 1500, s: 1.45, expr: t > Gr ? 'proud' : 'neutral', armL: [150, 230], armR: [30, -50] }, t) +
      unlock(450, 1000, t, Gr, { part: 'front', r: 460 }) + kword('IL A GRANDI.', CX, 450, t, Gr - .05, { size: 100, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [.3, 'tick', .4], [.7, 'tick', .4], [at(27, 'grandi') - .05, 'boom', .5], [at(27, 'grandi') + .1, 'angel', .5]] });

// B028 — FIN : « Et tu n'as pas à t'excuser d'avoir grandi. » : il jette son t-shirt et court rejoindre le cousin… le t-shirt coiffe une mouette
B(28, { enter: 'none', trans: 'wipe', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Ex = at(28, 'excuser') - .05, Gr = at(28, 'grandi') - .05, off = t > Ex + .1, fk = seg(t, Ex + .1, Ex + 1.0), run = seg(t, Gr, d);
    const gx = lerp(1150, 820, seg(t, 0, Ex + 1.0)), gy = 760 + Math.sin(t * 3) * 20;
    const hx = lerp(380, 620, run), ho = { x: hx, y: lerp(1500, 1400, run), s: lerp(1.4, 1.15, run), expr: off ? 'ecstatic' : 'happy', armL: off ? [200, 240] : [110, 100], armR: off ? [-20, -60] : [70, 80], walk: run > 0 ? 4 : 0, flip: 0 };
    return beach(t, { dusk: 1, gulls: false }) + cuzHead(860, 1110 + Math.sin(t * 2) * 8, 70, { expr: 'joy' }, t) + G(tr(940, 1060, 1, wave(t, 1.5, 30)), circ(0, 0, 20, SKIN_C)) +
      (off ? bare(ado, Object.assign({ trunks: SX.acc, marks: 1, shine: 1 }, ho), t) : ado(ho, t)) +
      eagle({ gull: 1, x: gx, y: gy, s: .3, flip: 0, expr: fk >= 1 ? 'shock' : 'neutral' }, t) + (off ? tshirtShape(lerp(hx, gx - 20, fk), lerp(1050, gy - 40, fk) - Math.sin(fk * Math.PI) * 260, fk >= 1 ? .55 : .8, fk >= 1 ? -10 : fk * 700, SHIRT_H) : '') +
      kthin("et tu n'as pas à", CX, 330, t, 0, { size: 58 }) + kword("T'EXCUSER", CX, 440, t, Ex, { size: 104, fill: SX.acc2 }) + kword("D'AVOIR GRANDI.", CX, 560, t, Gr, { size: 72, fill: '#fff' }) + (t > Gr ? confetti(t, Gr, 30) : ''); },
  sfx: [[0, 'waves', .5], [at(28, 'excuser') - .05, 'boom', .5], [at(28, 'excuser') + .1, 'whoosh_up', .6], [at(28, 'grandi') - .05, 'tada', .7], [at(28, 'excuser') + 1.0, 'squeak', .5], [at(28, 'grandi') + .5, 'rimshot', .4]] });

SCENES.sort((a, b) => a.s - b.s);
