// ============================================================
//  « Pourquoi c'est horrible de naître hyperactif ? » — 9:16, 36 blocs, calé mot à mot (words.js)
//  Style V2 : fausse 3D (depth), caméra épaule, POV, expressions extrêmes. SFX synthétisés uniquement.
// ============================================================
const TOTAL = 62.9;
const BT = [0, 2.22, 3.68, 4.74, 6.7, 8.02, 10.46, 11.32, 12.4, 13.36, 14.58, 16.2, 17.02, 19.56, 21.1, 21.86, 23.58, 26.1, 27.54, 28.9, 29.88, 33.04, 34.08, 35.72, 37.12, 39.9, 42.1, 44.96, 46.5, 49.94, 51.78, 53.1, 54.62, 55.82, 57.04, 60.52, 62.3];
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
// le héros : enfant de 6 ans, épi de cheveux en bataille
const kid = (o, t) => person(Object.assign({ age: 'kid', hair: 'spiky', hairColor: '#3a2a20', shirt: RUST, pants: '#3b3f4a', seed: 1 }, o), t);
const kidHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'spiky', hairColor: '#3a2a20', seed: 1 }, o), t));
const maitresse = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#8a5a3a', glasses: true, shirt: '#7aa6d8', pants: '#4b5b7a', seed: 4 }, o), t);
const maitHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'bun', hairColor: '#8a5a3a', glasses: true, seed: 4 }, o), t));
const maman = (o, t) => person(Object.assign({ age: 'adult', hair: 'long', hairColor: '#4a3428', shirt: '#e8a0b4', pants: '#5b4b6e', seed: 5 }, o), t);
// ---------- aides ----------
function bigText(lines, t, t0, x, y, col = '#fff', size = 110, gap = 1.08) { return lines.map((l, i) => { const k = pop(t, t0 + i * .15, .35); return k <= 0 ? '' : G(tr(x, y + i * size * gap, k), text(0, size * .35, OL, l, col, size)); }).join(''); }
function tag(x, y, str, t, t0, bg = '#ffd23f', fg = OL, size = 60, r = 0) { const k = pop(t, t0, .35); if (k <= 0) return ''; const w = str.length * size * .58 + size; return G(tr(x, y, k, r), rect(-w / 2, -size * .8, w, size * 1.6, bg, size * .5) + text(0, size * .36, 'none', str, fg, size)); }
// titre d'accroche : plus petit et loin des bords (YouTube Shorts recadre) — largeur max ≈ 760 px (x 160→920)
function title(t) {
  const k1 = pop(t, .05, .45), k2 = pop(t, .25, .45), k3 = pop(t, .45, .5);
  return G(tr(CX, 330, k1), text(0, 26, OL, "POURQUOI C'EST", '#fff', 74)) + G(tr(CX, 420, k2), text(0, 26, OL, 'HORRIBLE DE NAÎTRE', '#fff', 70)) +
    G(tr(CX, 525, k3, wave(t * 4, .6, 3)), text(0, 30, OL, '<tspan fill="#ffb84d">HYPERACTIF ?</tspan>', '#fff', 88));
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

// ---------- accessoires de l'épisode ----------
// cerveau personnage (gants de boxe en option)
function brain(x, y, s, t, o = {}) {
  let g = path('M-150 20C-190 -60 -130 -150 -50 -140C-20 -190 60 -190 90 -140C170 -150 210 -60 160 20C190 90 120 150 40 130C0 160 -80 160 -110 120C-180 120 -200 60 -150 20Z', o.col || '#ff9db5');
  g += path('M-90 -90Q-60 -60 -90 -20M-20 -140Q0 -100 -30 -60M60 -120Q30 -80 70 -40M120 -60Q90 -20 130 30M-110 60Q-60 40 -40 90M30 60Q70 40 90 90', 'none', 6, 'rgba(160,40,80,.45)');
  g += G(tr(0, 10), head({ hr: 70, hair: 'none', skin: 'none', cheeks: true, expr: o.expr || 'mock', seed: 9 }, t).replace(/<circle cx="0" cy="0" r="70"[^>]*\/>/, ''));
  if (o.gloves) for (const sd of [-1, 1]) { const p = o.punch && sd === 1 ? 60 * Math.max(0, Math.sin(t * 12)) : 0; g += line(sd * 150, 40, sd * (220 + p), 20, 12) + circ(sd * (250 + p), 15, 50, '#e2463a') + path(`M${sd * (230 + p)} -20q${sd * 30} 10 ${sd * 20} 40`, 'none', 5, '#fff'); }
  if (o.legs) g += line(-60, 130, -80, 230, 12) + line(60, 130, 80, 230, 12) + ell(-90, 235, 30, 14, OL, 0) + ell(90, 235, 30, 14, OL, 0);
  return G(tr(x, y, s, o.r || 0), g);
}
function wallClock830(x, y, r, t, spin = 0) { const a = spin ? t * 720 : 0; return circ(x, y, r, '#fff') + Array.from({ length: 12 }, (_, i) => line(x + Math.sin(R(i * 30)) * r * .82, y - Math.cos(R(i * 30)) * r * .82, x + Math.sin(R(i * 30)) * r * .92, y - Math.cos(R(i * 30)) * r * .92, 5)).join('') + G(`rotate(${f1(255 + a / 12)} ${x} ${y})`, line(x, y, x, y - r * .5, 10)) + G(`rotate(${f1(180 + a)} ${x} ${y})`, line(x, y, x, y - r * .72, 7)) + circ(x, y, 9, OL, 0); }
function pen(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-12, -110, 24, 200, '#4d7cf0', 8, 5) + path('M-12 90L0 125L12 90Z', '#f2d7b0', 5) + rect(-14, -120, 28, 26, '#2b3e8a', 6, 5)); }
function school(t) { return classroom(t) + rect(-M, 1150, W + 2 * M, 90, '#d9b68a', 0, 0); }
function playground(t) { return grad('#9fd6ff', '#e6f5ff', -M, -M, W + 2 * M, 1500) + building(-100, 1150, 600, 500, '#f0d9b5') + building(560, 1150, 700, 420, '#e8c9a0') + rect(-M, 1150, W + 2 * M, 1500, '#c9b8a0', 0, 0) + Array.from({ length: 6 }, (_, i) => line(-200 + i * 260, 1150, -100 + i * 260, 1900, 6, 'rgba(255,255,255,.5)')).join(''); }
function bedroom(t, mess = 0) { let s = grad('#ffe6c8', '#ffd9b0', -M, -M, W + 2 * M, H + 2 * M) + windowFrame(640, 280, 320, 380) + rect(-M, 1250, W + 2 * M, 1400, '#c49a6c', 0, 0) + rect(60, 1000, 420, 260, '#7aa6d8', 20) + rect(60, 960, 420, 80, '#fff', 20);
  const r = rng(7); const items = Math.floor(mess * 40);
  for (let i = 0; i < items; i++) { const x = r() * W, y = 1100 + r() * 700, c = ['#ff6fa5', '#5ec4f0', '#ffd23f', '#7be07b', '#ff8a3d', '#b56cff'][i % 6], k = i % 4;
    s += k === 0 ? rect(x - 40, y - 30, 80, 60, c, 8, 5) : k === 1 ? circ(x, y, 32, c, 5) : k === 2 ? path(`M${x - 50} ${y}l40 -50l50 30l-30 40Z`, c, 5) : rect(x - 60, y - 14, 120, 28, c, 6, 5); }
  return s; }
function rocket(x, y, s, t, fire = 0) { return G(tr(x, y, s), (fire ? flames(-60, 230, 120, 120 + 60 * Math.sin(t * 20), t, 3) : '') + rect(-90, -150, 180, 380, '#c9a06a', 10) + path('M-90 -150L0 -330L90 -150Z', '#e2463a') + circ(0, -40, 50, '#bfe3f5', 8) + path('M-90 140L-170 240L-90 220Z', '#e2463a') + path('M90 140L170 240L90 220Z', '#e2463a') + text(0, 120, 'none', 'NASA', OL, 40) + line(-60, 30, 60, 30, 4, '#a07a4a')); }
function controller(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M-150 -50Q-160 -90 -100 -90L100 -90Q160 -90 150 -50L180 60Q190 110 140 110Q110 110 80 60L-80 60Q-110 110 -140 110Q-190 110 -180 60Z', '#3a3f4a') + circ(80, -30, 16, '#e2463a', 4) + circ(115, -5, 16, '#5fd068', 4) + rect(-110, -40, 60, 18, '#ccc', 4, 0) + rect(-89, -61, 18, 60, '#ccc', 4, 0)); }
function bigClock(x, y, str, col, s = 1) { return G(tr(x, y, s), rect(-210, -90, 420, 180, '#2b2b33', 30) + text(0, 35, 'none', str, col, 100)); }
function slider(x, y, w, k, label, col) { return G(tr(x, y), text(0, -40, OL, label, '#fff', 44) + rect(-w / 2, -14, w, 28, '#cfd6dc', 14) + rect(-w / 2, -14, w * k, 28, col, 14, 0) + circ(-w / 2 + w * k, 0, 34, '#fff')); }
function reportCard(x, y, s, t, r = 0, show = 1) { return G(tr(x, y, s, r), rect(-300, -380, 600, 760, '#fffdf3', 14) + text(0, -300, 'none', 'BULLETIN', '#4b5b7a', 56) + Array.from({ length: 5 }, (_, i) => line(-240, -200 + i * 70, 240, -200 + i * 70, 5, '#d8dee6')).join('') + (show ? G(tr(0, 200, 1, -5), text(0, -40, 'none', '« Ne fait aucun', '#e2463a', 52).replace('<text', `<text opacity="${clamp(show)}"`) + text(0, 30, 'none', 'effort. »', '#e2463a', 52).replace('<text', `<text opacity="${clamp(show * 2 - 1)}"`)) : '')); }
function thoughtIcons(x, y, t, n = 8, rr = 260) { let s = ''; const ic = [k => rocket(0, 0, .25, t), k => brain(0, 0, .3, t, {}), k => controller(0, 0, .5), k => fly(0, 0, 1.2, t), k => text(0, 30, OL, '?', '#fff', 110), k => text(0, 30, OL, '!', '#ffd23f', 110), k => text(0, 30, OL, '♪', '#fff', 100), k => pen(0, 0, .6, 30)];
  for (let i = 0; i < n; i++) { const a = t * (.8 + i * .1) + i * 6.28 / n; s += G(tr(x + Math.cos(a) * rr * (1 + .1 * Math.sin(t * 3 + i)), y + Math.sin(a) * rr * .8, 1 + .1 * Math.sin(t * 5 + i), Math.sin(t * 2 + i) * 15), ic[i % ic.length](i)); } return s; }
function battery(x, y, s, k, t) { const col = k > .8 ? '#5fd068' : '#ffb340'; return G(tr(x, y, s), rect(-90, -220, 180, 440, '#fff', 30) + rect(-40, -255, 80, 40, '#fff', 10) + rect(-70, -200 + 400 * (1 - k), 140, 400 * k, col, 18, 0) + (k > .95 ? glow(0, 0, 260, '#ffe9a0', .4 + .2 * Math.sin(t * 6)) : '') + rect(-90, -220, 180, 440, 'none', 30)); }
function words(t, x, y, list, sp = 1) { let s = ''; list.forEach((w, i) => { const k = ((t * sp * 1.6 + i / list.length) % 1); s += op(1 - k * .7, G(tr(x + 120 + k * 700, y - 160 + ((i * 97) % 320), .7 + k * .5, (i % 2 ? 1 : -1) * 10), text(0, 0, OL, w, ['#fff', '#ffd23f', '#5ec4f0', '#ff8fb1'][i % 4], 56))); }); return s; }

// ============================================================
//  PLANS
// ============================================================
// B001 — accroche : il vibre littéralement sur sa chaise (traînées de mouvement), titre en haut
B(1, { enter: 'none', cam: () => ({ z: 1.04, shake: 3, hand: .5 }),
  draw: t => { let s = rays(t, CX, 1000, '#3b6fd8', '#4f82e8', 22); for (let i = 3; i > 0; i--) s += op(.18 * (4 - i) / 3, kid({ x: CX + Math.sin(t * 40 + i) * 60 * i, y: 1450, s: 1.5, expr: 'ecstatic' }, t));
    return s + kid({ x: CX + Math.sin(t * 40) * 18, y: 1450, s: 1.5, expr: 'ecstatic', armL: [200 + Math.sin(t * 30) * 40, 160], armR: [-20 - Math.sin(t * 30) * 40, 20] }, t) + rect(260, 1300, 560, 50, '#c9a06a', 10) + motionLines(CX - 230, 950, 3, 70, 180) + motionLines(CX + 230, 950, 3, 70, 0) + sparkle(CX - 260, 760, .6, '#ffe066') + sparkle(CX + 270, 820, .5, '#ffe066') + title(t); },
  sfx: [[0, 'whoosh', .8], [.3, 'boing', .6], [.6, 'zap', .5], [1.2, 'boing', .6], [1.8, 'sting', .5]] });
// B002 — 6 ans, l'école : gros plan émerveillé
B(2, { cam: zin(1.02, 1.1, .5),
  draw: t => grad('#bfe6ff', '#eaf7ff', -200, -200, W + 400, H + 400) + building(560, 1250, 520, 560, '#f0c9a0') + rect(700, 640, 240, 70, '#e2463a', 8) + text(820, 692, 'none', 'ÉCOLE', '#fff', 48) + kidHead(420, 880, 250, { expr: 'wow', look: [1, -.5] }, t) + tag(420, 470, '6 ANS', t, at(2, '6') - .1, '#ffd23f', OL, 60),
  sfx: [[0, 'school_bell', .5], [at(2, '6'), 'pop', .8], [at(2, 'ecole'), 'sparkle', .7]] });
// B003 — contre-plongée : la chaise, puis la table (comme une cellule)
B(3, { enter: 'drop', cam: (t, d) => ({ z: lerp(1, 1.08, t / d), cy: 900 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#2b2238', 0, 0) + `<path d="M${CX - 120} -50L${CX + 120} -50L${CX + 520} 1600L${CX - 520} 1600Z" fill="rgba(255,240,180,.28)"/>` +
    G(tr(360, 1150, pop(t, at(3, 'chaise') - .1)), chair(0, 0, .9)) + G(tr(720, 1150, pop(t, at(3, 'table') - .1)), desk(0, 0, .9)) + tag(360, 520, 'CHAISE', t, at(3, 'chaise'), '#fff', OL, 48) + tag(720, 520, 'TABLE', t, at(3, 'table'), '#fff', OL, 48),
  sfx: [[at(3, 'chaise') - .1, 'thud', .9], [at(3, 'table') - .1, 'thud', .9]] });
// B004 — plongée : la consigne « RESTE TRANQUILLE », il est minuscule
B(4, { cam: (t, d) => ({ z: 1.04, hand: .3 }),
  draw: t => { const R_ = at(4, 'reste'); return school(t) + maitresse({ x: 760, y: 1500, s: 1.3, expr: 'annoyed', armL: [190, 200] }, t) + kid({ x: 300, y: 1550, s: .9, expr: t > R_ + 1 ? 'jawdrop' : 'happy' }, t) +
    G(tr(CX, 420, pop(t, R_ - .05)), rect(-380, -90, 760, 180, '#fff', 20) + text(0, 30, 'none', 'RESTE TRANQUILLE.', '#e2463a', 70)) + (t > R_ + 1 ? G(tr(300, 760, pop(t, R_ + 1)), text(0, 0, OL, 'Ah.', '#fff', 80)) : ''); },
  sfx: [[at(4, 'consigne'), 'ding', .6], [at(4, 'reste') - .05, 'sting', .8], [at(4, 'reste') + 1, 'scratch', .7]] });
// B005 — premier jour : calendrier « JOUR 1 », cloche
B(5, { cam: zin(1.0, 1.08),
  draw: t => rays(t, CX, 900, '#d8eeff', '#c2e2ff', 20) + calendar(CX, 820, 1.5, '1', t, .05).replace('>ANS<', '>JOUR<') + kidHead(CX + 260, 1150, 110, { expr: 'worried' }, t),
  sfx: [[0, 'school_bell', .8], [.1, 'pop', .7]] });
// B006 — ring de boxe : toi contre ton propre cerveau
B(6, { enter: 'whip', cam: (t, d) => ({ z: 1.05, hand: .8, shake: t > at(6, 'cerveau') ? 4 : 0 }),
  draw: t => { const C = at(6, 'combat'); return rect(-200, -200, W + 400, H + 400, '#1f1a2e', 0, 0) + glow(CX, 600, 700, '#ffe9a0', .3) + rect(-100, 1180, 1280, 120, '#3b6fd8', 0, 0) + [980, 1060, 1140].map(y => line(-100, y, 1180, y, 8, '#e2463a')).join('') + line(60, 900, 60, 1300, 20) + line(1020, 900, 1020, 1300, 20) +
    kid({ x: 300, y: 1420, s: 1.2, expr: 'effort', armL: [-60, -100], armR: [-20, -60] }, t) + brain(760, 820, 1.1, t, { gloves: 1, punch: 1, legs: 1, expr: 'mock' }) + (t > C - .1 ? tag(CX, 380, 'ROUND 1', t, C - .1, '#ffd23f', OL, 64) : '') + (t > at(6, 'cerveau') ? impactStar(420, 860, .5) : ''); },
  sfx: [[at(6, 'combat') - .1, 'school_bell', .9], [at(6, 'cerveau'), 'thud', .9], [at(6, 'cerveau') + .25, 'boing', .6]] });
// B007 — large : la jambe qui secoue (la table vibre, les crayons sautent)
B(7, { cam: () => ({ z: 1.04, shake: 5 }),
  draw: t => school(t) + kid({ x: CX, y: 1500, s: 1.4, expr: 'smug', legR: [60 + Math.sin(t * 60) * 25, 90] }, t) + G(tr(Math.sin(t * 60) * 6, 0), rect(240, 1330, 600, 50, '#c9a06a', 10) + pen(330, 1290 - Math.abs(Math.sin(t * 30)) * 30, .45, 70) + pen(760, 1295 - Math.abs(Math.cos(t * 28)) * 26, .45, 100)) + motionLines(CX + 180, 1430, 3, 70, 0) + motionLines(CX + 180, 1480, 3, 70, 180),
  sfx: [[0, 'tiptoe', .9], [.3, 'tick', .5]] });
// B008 — gros plan : le stylo tourne comme une hélice… et s'envole
B(8, { cam: zin(1.04, 1.12, .6),
  draw: t => { const fly_ = seg(t, .55, 1.0); return grad('#fff4e0', '#ffe6c2', -200, -200, W + 400, H + 400) + kidHead(CX, 1000, 220, { expr: fly_ > .1 ? 'shock' : 'zen', look: [0, -1] }, t) + G(tr(CX + fly_ * 500, 640 - fly_ * 400, 1.6, t * 1400), pen(0, 0, 1)) + (fly_ > 0 && fly_ < 1 ? motionLines(CX + fly_ * 500 - 160, 640 - fly_ * 400, 3, 80, 210) : '') + (fly_ >= 1 ? G(tr(900, 260), impactStar(0, 0, .5) + text(0, 120, OL, 'AÏE', '#fff', 50)) : ''); },
  sfx: [[0, 'whoosh', .5], [.2, 'whoosh', .4], [.55, 'boing', .7], [.95, 'thud', .6]] });
// B009 — contre-plongée : la mouche fait des loopings, ses yeux suivent
B(9, { cam: (t, d) => ({ z: 1.05, cy: 800, hand: .5 }),
  draw: t => { const fx = CX + Math.cos(t * 5) * 300, fy = 560 + Math.sin(t * 10) * 140; return grad('#f4ecd8', '#e8dcc0', -200, -200, W + 400, H + 400) + kidHead(CX, 1080, 260, { expr: 'wow', look: [(fx - CX) / 300, (fy - 700) / 300], face: { mouth: 'o' } }, t) + path(`M${CX - 300} 560Q${CX} 300 ${CX + 300} 560T${CX - 300} 560`, 'none', 5, 'rgba(0,0,0,.2)').replace('stroke-linecap', 'stroke-dasharray="14 16" stroke-linecap') + fly(fx, fy, 2.4, t); },
  sfx: [[0, 'buzz', .8]] });
// B010 — plongée : la maîtresse t'interroge, toute la classe se retourne
B(10, { cam: zin(1.0, 1.1),
  draw: t => { let s = school(t); for (let i = 0; i < 6; i++) s += G(tr(170 + (i % 3) * 370, 1050 + Math.floor(i / 3) * 300, .8), head({ hr: 80, hair: ['curly', 'short', 'long', 'bun', 'side', 'ponytail'][i], hairColor: ['#4a3428', '#c4521b', '#2b2420'][i % 3], expr: 'neutral', look: [i % 3 === 0 ? 1 : i % 3 === 2 ? -1 : 0, 1], seed: i + 2 }, t));
    return s + `<path d="M${CX - 60} -50L${CX + 60} -50L${CX + 180} 1400L${CX - 180} 1400Z" fill="rgba(255,240,180,.3)"/>` + kidHead(CX, 900, 150, { expr: 'shock' }, t) + G(tr(860, 520, 1, -20), line(0, 0, -200, 200, 12) + line(0, 0, -200, 200, 6, '#8a5a3a')); },
  sfx: [[0, 'hmm', .5], [.3, 'whoosh', .6], [.6, 'sting', .5]] });
// B011 — la question ? Vide total : buisson qui roule dans sa tête, grillons
B(11, { cam: camHand(1.05, .5),
  draw: t => grad('#f4ecd8', '#e8dcc0', -200, -200, W + 400, H + 400) + kidHead(CX, 1050, 220, { expr: 'deadpan' }, t) + bubble(CX + 60, 520, 640, 380, rect(-260, 40, 520, 8, '#d8c8a8', 4, 0) + tumbleweed(lerp(-220, 220, (t * .6) % 1), 0, .8, t * 200), 1) + cricket(820, 1300, .6, t),
  sfx: [[0, 'crickets', .9], [.6, 'whistle', .4]] });
// B012 — profil : « Tu peux faire un effort ? »
B(12, { enter: 'whip', cam: zin(1.02, 1.08, .4),
  draw: t => grad('#d9eaf7', '#bfd8ee', -200, -200, W + 400, H + 400) + maitHead(700, 900, 280, { expr: 'angry', look: [-1, 0] }, t) + G(tr(330, 520, pop(t, .05)), rect(-260, -110, 520, 220, '#fff', 40) + text(0, -10, 'none', 'Tu peux faire', OL, 48) + text(0, 56, 'none', 'un effort ?', OL, 48)),
  sfx: [[0, 'pop', .7], [.2, 'hmm', .6]] });
// B013 — il explose : « C'EST CE QUE JE FAIS DEPUIS 8 H 30 ! » (rage, vapeur, horloge)
B(13, { enter: 'crash', flash: 1, cam: () => ({ z: 1.07, shake: 9 }),
  draw: t => { const F = at(13, 'c'); return rays(t, CX, 900, '#ff7a5a', '#ff4d3d', 24) + kidHead(CX, 1000, 260, { expr: t > F ? 'rage' : 'worried', face: t > F ? { mouth: 'scream' } : {} }, t) + wallClock830(CX + 300, 520, 130, t, 0) + (t > F ? bigText(['DEPUIS', '8 H 30 !!'], t, at(13, 'depuis'), CX - 120, 360, '#fff', 100) : ''); },
  sfx: [[at(13, 'c'), 'thunder', .6], [at(13, 'c') + .05, 'flash_hit', .9], [at(13, 'depuis'), 'error_beep', .6], [1.4, 'growl', .5]] });
// B014 — récré : il parle trop vite, les mots jaillissent
B(14, { enter: 'whip', cam: camHand(1.05, .8),
  draw: t => playground(t) + kidHead(330, 900, 210, { expr: 'talk', look: [1, 0] }, t) + words(t, 330, 900, ['bla', 'et', 'puis', 'alors', 'ATTENDS', 'trop bien', 'dino', 'ET LÀ'], 2) + speedLines(t, 330, 900, 18, 'rgba(255,255,255,.5)'),
  sfx: [[0, 'whoosh', .7], [.2, 'typing', .8], [1.0, 'boing', .4]] });
// B015 — contre-plongée : ta bulle coupe la sienne en deux
B(15, { cam: (t, d) => ({ z: 1.05, cy: 900 }),
  draw: t => { const k = seg(t, .2, .5); return playground(t) + kid({ x: 760, y: 1500, s: 1.3, expr: k > .5 ? 'shock' : 'talk', hair: 'curly', hairColor: '#c4521b', shirt: '#7be07b', seed: 3 }, t) + kid({ x: 300, y: 1500, s: 1.3, expr: 'talk', armR: [-40, -20] }, t) +
    G(tr(760, 560, 1, k * 20), rect(-200, -80, 200 - k * 60, 160, '#fff', 30) + text(-100, 15, 'none', 'Moi j…', OL, 44)) + G(tr(760 + k * 60, 560 + k * 40, 1, k * -25), rect(0, -80, 200 - k * 60, 160, '#fff', 30)) + G(tr(330, 560, pop(t, .2)), rect(-230, -80, 460, 160, '#ffd23f', 30) + text(0, 15, 'none', 'MOI MOI MOI', OL, 48)) + (k > 0 ? scissors(560, 560, .6, 0, .5 + .5 * Math.sin(t * 30)) : ''); },
  sfx: [[.2, 'snip', 1], [.3, 'pop', .6]] });
// B016 — plongée : il buzze avant la question
B(16, { cam: zin(1.0, 1.08),
  draw: t => school(t) + rect(140, 1250, 800, 60, '#c9a06a', 10) + kid({ x: CX, y: 1550, s: 1.3, expr: 'ecstatic', armR: [-90, -95] }, t) + G(tr(CX + 200, 1240), circ(0, 0, 60, '#e2463a') + ell(0, 18, 70, 26, '#555', 5)) + G(tr(CX, 420, pop(t, .1)), rect(-320, -80, 640, 160, '#fff', 30) + text(0, 18, 'none', 'Quelle est la cap…', OL, 46)) + G(tr(CX + 280, 640, pop(t, .4)), text(0, 0, OL, 'PARIS !', '#ffd23f', 80)) + cross(CX + 280, 780, .4, t, 1),
  sfx: [[.4, 'error_beep', .9], [1, 'rimshot', .5]] });
// B017 — les adultes pensent que tu fais exprès (bras croisés, regards noirs)
B(17, { cam: camHand(1.04, .4),
  draw: t => grad('#d9d4cc', '#bdb6ac', -200, -200, W + 400, H + 400) + maitresse({ x: 200, y: 1500, s: 1, expr: 'suspicious', armL: [20, 150], armR: [160, 30] }, t) + person({ age: 'adult', x: 540, y: 1520, s: 1.05, hair: 'bald', mustache: true, glasses: true, shirt: '#6b5b4b', expr: 'angry', armL: [20, 150], armR: [160, 30], seed: 8 }, t) + maman({ x: 880, y: 1500, s: 1, expr: 'annoyed', armL: [20, 150], armR: [160, 30] }, t) + stamp(CX, 460, 'EXPRÈS', t, at(17, 'expres') - .05),
  sfx: [[0, 'hmm', .6], [at(17, 'expres') - .05, 'thud', .9]] });
// B018 — profil : en rentrant, maman à la porte
B(18, { cam: zin(1, 1.06),
  draw: t => bedroom(t, 0).replace('#ffe6c8', '#f0e4d0') + doorFrame(780, 1400, 900) + maman({ x: 700, y: 1500, s: 1.3, expr: 'talk', look: [-1, 0] }, t) + kid({ x: 300, y: 1520, s: 1.1, expr: 'happy', walk: 1 }, t),
  sfx: [[0, 'steps', .6], [.6, 'hmm', .4]] });
// B019 — « Va ranger ta chambre. » puis il fonce dans l'escalier
B(19, { cam: (t, d) => ({ z: 1.04, hand: .6 }),
  draw: t => { const M_ = at(19, 'montes'); let s = grad('#f0e4d0', '#e0cdb0', -200, -200, W + 400, H + 400); for (let i = 0; i < 8; i++) s += rect(300 + i * 90, 1500 - i * 110, 400, 110, '#c49a6c', 0, 5);
    return s + maman({ x: 200, y: 1520, s: 1.1, expr: 'talk', armR: [-60, -40] }, t) + G(tr(330, 600, pop(t, .05)), rect(-240, -70, 480, 140, '#fff', 30) + text(0, 15, 'none', 'Va ranger !', OL, 50)) +
      (t > M_ ? kid({ x: lerp(400, 950, seg(t, M_, M_ + .6)), y: lerp(1450, 750, seg(t, M_, M_ + .6)), s: 1, expr: 'ecstatic', walk: 4 }, t) + streaks(t, 1, 8, 'rgba(255,255,255,.6)') : kid({ x: 450, y: 1500, s: 1, expr: 'deadpan' }, t)); },
  sfx: [[0, 'pop', .6], [at(19, 'montes'), 'whoosh', .9], [at(19, 'montes') + .1, 'steps', .8]] });
// B020 — gros plan : un vieux jouet ! (extase)
B(20, { enter: 'crash', cam: zin(1.04, 1.1),
  draw: t => rays(t, CX, 800, '#fff1c2', '#ffd76b', 22) + kidHead(CX, 1050, 220, { expr: 'ecstatic' }, t) + G(tr(CX, 600, 1 + .05 * Math.sin(t * 8), wave(t, 1, 8)), path('M-120 60C-140 -40 -60 -120 20 -100C60 -160 140 -140 130 -70C170 -60 170 0 130 10L130 80L80 80L80 40L-40 40L-40 80L-90 80Z', '#7be07b') + circ(60, -100, 10, OL, 0) + path('M100 -60L140 -40', 'none', 5)) + stars(CX, 600, t, 6, 260),
  sfx: [[0, 'magic', .8], [.2, 'sparkle', .7]] });
// B021a — puis une photo…
B(21, { cam: zin(1.02, 1.08, .4),
  draw: t => bedroom(t, .3) + kid({ x: 380, y: 1500, s: 1.3, expr: 'happy' }, t) + G(tr(700, 760, pop(t, at(21, 'photo') - .15), -8), rect(-170, -200, 340, 380, '#fff', 8) + rect(-140, -170, 280, 260, '#bfe3f5', 4, 4) + G(tr(0, -30), head({ hr: 60, hair: 'spiky', hairColor: '#3a2a20', expr: 'joy', seed: 1 }, t))),
  sfx: [[at(21, 'photo') - .15, 'shutter', .8], [.6, 'hmm', .4]] });
// B021b — … puis une fusée en carton (décollage !)
B(21, { enter: 'drop', cam: (t, d) => ({ z: 1.06, cy: 800, shake: t > 1.3 ? 6 : 0 }),
  draw: t => { const L = eInCubic(seg(t, 1.4, 2.4)); return bedroom(t, .5) + G(tr(0, -L * 900), rocket(CX + 120, 1150, 1.2, t, t > 1.2 ? 1 : 0)) + kid({ x: 300, y: 1550, s: 1.1, expr: t > 1.3 ? 'panic' : 'proud', armR: [-90, -95], holdR: rect(-20, -30, 40, 60, '#c9a06a', 6) }, t) + tag(CX, 400, 'FUSÉE MAISON', t, .4, '#ff8a3d', '#fff', 52) + (t > 1.2 ? speedLines(t, CX + 120, 1300, 16, 'rgba(255,200,120,.6)') : ''); },
  sfx: [[.2, 'scratch', .5], [.6, 'hammer', .5], [1.2, 'fire', .7], [1.4, 'whoosh_up', .9], [1.6, 'boom', .5]] }, at(21, 'puis', 2) - .1);
// B022 — plongée : l'horloge s'emballe, +2 H
B(22, { cam: zin(1, 1.08),
  draw: t => rays(t, CX, 900, '#d8eeff', '#c2e2ff', 18) + wallClock830(CX, 860, 260, t, 1) + tag(CX, 420, '+ 2 HEURES', t, .1, '#4d7cf0', '#fff', 60),
  sfx: [[0, 'clock_fast', .9]] });
// B023 — la chambre est encore pire : maman pétrifiée à la porte
B(23, { enter: 'crash', cam: () => ({ z: 1.06, shake: 4 }),
  draw: t => bedroom(t, 1) + doorFrame(860, 1450, 900) + maman({ x: 860, y: 1500, s: 1.2, expr: 'jawdrop' }, t) + kid({ x: 340, y: 1500, s: 1.1, expr: 'smugger', armR: [-30, -60] }, t) + G(tr(340, 600, 1, 15), text(0, 0, OL, '✨ RANGÉ ✨', '#fff', 56)),
  sfx: [[0, 'boom', .6], [.1, 'gasp', .7], [.6, 'rimshot', .4]] });
// B024 — « Magnifique. » / « Mais le plus étrange ? »
B(24, { cam: zin(1.0, 1.08),
  draw: t => { const Q = at(24, 'mais'); return t < Q ? bedroom(t, 1) + tag(CX, 420, 'MAGNIFIQUE.', t, .05, '#fff', OL, 64) + kidHead(CX, 950, 180, { expr: 'smugger' }, t) :
    rect(-200, -200, W + 400, H + 400, '#2b2238', 0, 0) + G(tr(CX, 820, pop(t, Q), wave(t, 1, 8)), text(0, 120, OL, '?', '#ffd23f', 420)) + kidHead(CX, 1180, 120, { expr: 'confused' }, t); },
  sfx: [[0, 'glint', .7], [at(24, 'mais'), 'whoosh', .6], [at(24, 'etrange'), 'sting', .6]] });
// B025 — large : hyperfocus sur le jeu (zen, toiles d'araignée, 3 h)
B(25, { cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: t => { const h = Math.min(3, Math.floor(seg(t, 0, 2.4) * 3)); return grad('#1d2350', '#2e3570', -200, -200, W + 400, H + 400) + rect(160, 560, 760, 460, '#2b2b33', 20) + rect(180, 580, 720, 420, '#5fd068', 8, 0) + text(540, 820, 'none', 'NIVEAU 99', '#fff', 64) + glow(540, 800, 500, '#bfffcf', .3) +
    kid({ x: CX, y: 1700, s: 1.4, expr: 'zen', armL: [60, 20], armR: [120, 160], holdR: controller(0, 0, .3) }, t) + bigClock(CX, 400, `${h}:00:00`, '#5fd068', .9) + path('M0 0L160 120M0 60L120 160M60 0L160 80', 'none', 3, 'rgba(255,255,255,.4)') + path(`M${W} 0L${W - 160} 120M${W} 60L${W - 120} 160`, 'none', 3, 'rgba(255,255,255,.4)'); },
  sfx: [[0, 'slot', .4], [.8, 'clock_fast', .4], [2.2, 'tada', .4]] });
// B026 — gros plan : l'exercice… les yeux en spirale, il fond
B(26, { cam: zin(1.02, 1.12, .5),
  draw: t => { const m = seg(t, .8, 2); return grad('#fff', '#eef2f6', -200, -200, W + 400, H + 400) + G(tr(CX, 1250, 1), rect(-380, -200, 760, 400, '#fffdf3', 10) + text(0, -100, 'none', '12 × 7 = ?', OL, 70) + text(0, 10, 'none', '45 ÷ 9 = ?', OL, 70)) +
    G(tr(CX, 820) + ` scale(${1 + m * .25} ${1 - m * .3})`, head({ hr: 220, hair: 'spiky', hairColor: '#3a2a20', expr: 'dizzy', seed: 1 }, t)) + bigClock(CX, 360, '00:05', '#ff4d4d', .9); },
  sfx: [[0, 'tick', .7], [.8, 'squeak', .6], [1.4, 'flutter', .4]] });
// B027 — contre-plongée : « TDAH »
B(27, { enter: 'drop', cam: (t, d) => ({ z: lerp(1, 1.08, t / d), cy: 800 }),
  draw: t => rays(t, CX, 800, '#efe0ff', '#dcc4ff', 22) + brain(CX, 900, 1.6, t, { expr: 'neutral' }) + tag(CX, 400, "L'HYPERACTIVITÉ", t, at(27, 'hyper') - .1, '#fff', OL, 52) + tag(CX, 1300, 'TDAH', t, at(27, 'tdah') - .1, '#b56cff', '#fff', 80),
  sfx: [[at(27, 'hyper') - .1, 'pop', .7], [at(27, 'tdah') - .1, 'ding', .9]] });
// B028 — plongée : pas JUSTE trop d'énergie (batterie qui déborde, barrée)
B(28, { cam: zin(1, 1.08),
  draw: t => grad('#fff', '#eef4fa', -200, -200, W + 400, H + 400) + battery(CX, 860, 1.4, 1, t) + Array.from({ length: 6 }, (_, i) => lightning(CX - 260 + i * 100, 420 + (i % 2) * 60, .25, .5 + .5 * Math.sin(t * 20 + i))).join('') + tag(CX, 1300, 'PAS JUSTE ÇA', t, at(28, 'juste') - .1, '#e2463a', '#fff', 56) + cross(CX + 260, 600, .6, t, at(28, 'juste')),
  sfx: [[0, 'zap', .7], [at(28, 'juste'), 'error_beep', .7]] });
// B029 — le tableau de bord du cerveau : ATTENTION et IMPULSIONS impossibles à régler
B(29, { cam: camHand(1.04, .5),
  draw: t => grad('#2b2238', '#3a2f4f', -200, -200, W + 400, H + 400) + brain(CX, 560, .9, t, { expr: 'effort' }) +
    slider(CX, 980, 760, .5 + .45 * Math.sin(t * 4.5), 'ATTENTION', '#5ec4f0') + slider(CX, 1180, 760, .5 + .45 * Math.sin(t * 6.3 + 1), 'IMPULSIONS', '#ff8a3d') + sweatSpray(CX, 460, t, 4),
  sfx: [[0, 'buzz', .4], [at(29, 'attention'), 'squeak', .6], [at(29, 'impulsions'), 'squeak', .6], [at(29, 'reguler'), 'error_beep', .5]] });
// B030 — profil : la nuit, tout le monde dort (zzz)
B(30, { cam: zin(1, 1.06),
  draw: t => grad('#141b38', '#2a3266', -200, -200, W + 400, H + 400) + circ(820, 320, 70, '#fff6d6', 0) + glow(820, 320, 240, '#fff6d6', .3) + building(160, 1300, 760, 700, '#3a4270', '#2a3256') + Array.from({ length: 4 }, (_, i) => G(tr(300 + i * 160, 700 - ((t * 60 + i * 50) % 200)), text(0, 0, OL, 'z', '#fff', 60))).join(''),
  sfx: [[0, 'crickets', .6]] });
// B031 — large : lui, les yeux grands ouverts, ses pensées tourbillonnent bruyamment
B(31, { cam: camHand(1.04, .6),
  draw: t => grad('#1d2350', '#2e3570', -200, -200, W + 400, H + 400) + rect(140, 1100, 800, 200, '#7aa6d8', 30) + rect(140, 1060, 300, 90, '#fff', 30) + kidHead(330, 1020, 140, { expr: 'chatter', look: [1, -1] }, t) + thoughtIcons(640, 640, t, 8, 300) + tag(CX, 300, 'BZZZ', t, at(31, 'bon') - .2, '#ffd23f', OL, 56),
  sfx: [[0, 'buzz', .6], [.3, 'pop', .4], [.6, 'boing', .4], [.9, 'ding', .4], [1.1, 'whoosh', .4]] });
// B032 — gros plan : la maîtresse écrit au stylo rouge
B(32, { cam: zin(1.02, 1.1),
  draw: t => grad('#d9eaf7', '#bfd8ee', -200, -200, W + 400, H + 400) + maitHead(CX, 760, 230, { expr: 'smugger', look: [0, 1] }, t) + reportCard(CX, 1250, .6, t, 0, 0) + G(tr(CX + 120 + Math.sin(t * 12) * 40, 1170, 1, 30), pen(0, 0, .8).replace(/#4d7cf0/g, '#e2463a')),
  sfx: [[0, 'scratch', .8]] });
// B033 — contre-plongée : le bulletin géant « Ne fait aucun effort. »
B(33, { enter: 'crash', cam: () => ({ z: 1.06, shake: 5 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#2b2238', 0, 0) + reportCard(CX, 720, 1.05, t, -4, seg(t, .05, .7)) + stamp(CX + 170, 1080, 'ZÉRO', t, .7),
  sfx: [[0, 'flash_hit', .7], [.05, 'scratch', .7], [.7, 'thud', .8]] });
// B034 — plongée : personne n'a vu (seul dans la classe vide)
B(34, { enter: 'none', cam: zin(1.08, 1.0),
  draw: t => school(t).replace('#f4ecd8', '#d8d2c4') + rect(-200, -200, W + 400, H + 400, 'rgba(30,30,60,.25)', 0, 0) + rect(360, 1250, 360, 50, '#c9a06a', 10) + kid({ x: CX, y: 1500, s: 1, expr: 'sad' }, t),
  sfx: [[0, 'hmm', .3]] });
// B035 — moyen : il se retient de toutes ses forces (tremble, sueur, jauge qui monte)
B(35, { cam: () => ({ z: 1.05, shake: 2 }),
  draw: t => { const k = seg(t, 0, 3.2); return school(t) + rect(240, 1300, 600, 50, '#c9a06a', 10) + kid({ x: CX, y: 1560, s: 1.5, expr: 'effort', tremble: 1, armL: [80, 60], armR: [100, 120] }, t) + sweatSpray(CX, 760, t, 5) +
    tag(CX - 180, 380, 'ASSIS', t, at(35, 'assis') - .1, '#fff', OL, 44) + tag(CX + 180, 380, 'ÉCOUTER', t, at(35, 'ecouter') - .1, '#fff', OL, 44) + tag(CX, 500, 'SE RETENIR', t, at(35, 'retenir') - .1, '#fff', OL, 44) + battery(930, 900, .6, k, t); },
  sfx: [[0, 'heartbeat', .5], [at(35, 'assis') - .1, 'pop', .6], [at(35, 'ecouter') - .1, 'pop', .6], [at(35, 'retenir') - .1, 'pop', .6], [2.4, 'heartbeat', .6]] });
// B036 — fin : la batterie déborde de lumière, médaille, « TON PLUS GROS EFFORT »
B(36, { flash: 1, cam: zin(1.0, 1.06, .3),
  draw: t => rays(t, CX, 900, '#fff1c2', '#ffd76b', 26) + glow(CX, 900, 500, '#fff', .5) + kid({ x: CX, y: 1620, s: 1.5, expr: 'proud', armR: [-90, -95] }, t) + G(tr(CX + 260, 820), medal(0, 0, 1.0 * pop(t, .3))) + bigText(['TON PLUS', 'GROS EFFORT'], t, at(36, 'plus') - .1, CX, 340, '#fff', 100),
  sfx: [[0, 'angel', .7], [.3, 'ding', .8], [at(36, 'plus') - .1, 'tada', .7]] });

SCENES.sort((a, b) => a.s - b.s);
