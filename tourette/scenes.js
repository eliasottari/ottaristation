// ============================================================
//  « Pourquoi c'est horrible d'avoir le syndrome de Gilles de la Tourette ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Sujet sensible : TRÈS bienveillant. On rit des réactions absurdes des autres (le prof, Dr Kevin, le tonton, les gens du bus/ciné),
//  JAMAIS du héros ni de ses tics. Les tics = traits de mouvement + petits éclairs « zip » jaunes, clignements, bulles « hm ! ».
//  Le passage « insultes » démonte le cliché sans afficher la moindre insulte (bips, symboles barrés, tampon CLICHÉ).
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

// ---------- SIZEX fun : accent ÉMERAUDE (propre à l'épisode), jaune marqueur, éclairs « zip » jaunes ----------
sxFun('#10a37f'); SX.acc2 = '#ffd23f'; SX.cool = '#8fd0ff';
const ZIP = '#ffd23f';

// ============================================================
//  LE HÉROS : cheveux bouclés bruns, sweat indigo. Il PORTE le sujet : de petits tics reviennent tout l'épisode
//  (o.tics = [[t0, 'arm'|'head'|'blink'|'shrug'], …] ; sans o.tics, petits tics « idle » de la tête + clignements réguliers).
//  Chaque tic = mouvement sec + éclairs « zip » + traits de mouvement. Neutre, jamais moqué.
// ============================================================
const HERO_SHIRT = '#5b6ee1', HERO_HAIR = '#3a2418';
const heroHair = (r, t, o) => hairSvg('curly', o.hairColor || HERO_HAIR, r, t);
// impulsion de tic : 0 → 1 → 0 en d secondes
const ticP = (t, t0, d = .24) => { const k = (t - t0) / d; return k <= 0 || k >= 1 ? 0 : Math.sin(k * Math.PI); };
const ticIdle = (t, ph = 0, per = 2.3) => { const u = ((t + ph) % per + per) % per; return ticP(u, per - .4); };
const touRep = (a, b, step, kind) => { const o = []; for (let x = a; x < b; x += step) o.push([x, kind]); return o; };
function heroTics(o, t) { let ka = 0, kh = 0, kb = 0, ks = 0;
  if (o.tics) for (const [t0, kd] of o.tics) { const k = ticP(t, t0, kd === 'blink' ? .2 : .24); if (kd === 'arm') ka = Math.max(ka, k); else if (kd === 'head') kh = Math.max(kh, k); else if (kd === 'blink') kb = Math.max(kb, k); else if (kd === 'shrug') ks = Math.max(ks, k); }
  else if (o.idle !== false) { kh = ticIdle(t, o.ph || 0) * .6; kb = ticIdle(t, (o.ph || 0) + 1.2, 2.9); }
  return { ka, kh, kb, ks }; }
// petits éclairs « zip » (jaunes, cernés) autour d'un point
function touZips(x, y, t, k, r = 90, n = 4, ph = 0) { if (k <= .04) return ''; let s = '';
  for (let i = 0; i < n; i++) { const ad = ph + i * 360 / n + Math.sin(t * 40 + i) * 8, a = R(ad), rr = r * (.8 + .35 * k), d = 'M0 0L16 -14L5 -20L22 -42';
    s += G(tr(x + Math.cos(a) * rr, y + Math.sin(a) * rr, .7 + .7 * k, ad + 90), path(d, 'none', 15, OL) + path(d, 'none', 7, ZIP)); }
  return op(Math.min(1, k * 2.2), s); }
// traits de mouvement en arc
const touArcs = (x, y, r, a0, a1, k) => k <= .05 ? '' : op(Math.min(1, k * 2), [0, 1].map(i => { const rr = r + i * 24, A = R(a0), Bb = R(a1); return path(`M${f1(x + Math.cos(A) * rr)} ${f1(y + Math.sin(A) * rr)}A${rr} ${rr} 0 0 1 ${f1(x + Math.cos(Bb) * rr)} ${f1(y + Math.sin(Bb) * rr)}`, 'none', 6); }).join(''));
// petits traits de clignement autour des yeux
const touBlinkFx = (x, y, r, k) => k <= .2 ? '' : [-1, 1].map(sd => [-40, 0, 40].map(a => { const A = R(a + (sd < 0 ? 180 : 0)), cx = x + sd * r * .62, cy = y - r * .05; return line(cx + Math.cos(A) * r * .22, cy + Math.sin(A) * r * .22, cx + Math.cos(A) * r * .38, cy + Math.sin(A) * r * .38, 5); }).join('')).join('');
function heroP(o, t) {
  o = Object.assign({ age: 'kid', hairFn: heroHair, shirt: HERO_SHIRT, pants: '#3b3f4a', seed: 2 }, o);
  const { ka, kh, kb, ks } = heroTics(o, t);
  if (ka) { const a = o.armR || [70, 80]; o.armR = [a[0] - 80 * ka, a[1] - 130 * ka]; }
  if (ks) { o.armL = [lerp(110, 140, ks), lerp(100, 200, ks)]; o.armR = [lerp(70, 40, ks), lerp(80, -20, ks)]; }
  if (kh) o.headTilt = (o.headTilt || 0) + 16 * kh;
  if (kb > .2) o.face = Object.assign({}, o.face || {}, { eyes: 'closed' });
  let fx = '';
  if (ka > .04) { const a = o.armR, hx = 69 + Math.cos(R(a[0])) * 56 + Math.cos(R(a[1])) * 54, hy = -188 + Math.sin(R(a[0])) * 56 + Math.sin(R(a[1])) * 54;
    fx += touZips(hx, hy, t, ka, 60, 4, 15) + touArcs(69, -188, 120, -60, 40, ka); }
  if (kh > .04) fx += touZips(0, -300, t, kh, 120, 5, 30);
  if (ks > .04) fx += touZips(-80, -195, t, ks, 40, 3, 200) + touZips(80, -195, t, ks, 40, 3, -20);
  if (kb > .2) fx += touBlinkFx(0, -292, 100, kb);
  return person(o, t) + G(ptr(o), fx); }
function heroHead(x, y, r, o, t) { o = Object.assign({}, o); const { kh, kb } = heroTics(o, t);
  if (kb > .2) o.face = Object.assign({}, o.face || {}, { eyes: 'closed' });
  return G(tr(x + kh * r * .12, y, 1, (o.tilt || 0) + kh * 14), head(Object.assign({ hr: r, hairFn: heroHair, seed: 2 }, o), t)) + touZips(x, y, t, kh, r * 1.3, 5, 20) + touBlinkFx(x, y, r, kb); }
// héros vu de dos (ciné) : nuque bouclée + épaules
const touBackHero = (x, y, s, t) => G(tr(x, y, s), rect(-130, 70, 260, 200, HERO_SHIRT, 60, 7) + circ(-86, 0, 18, SKIN, 6) + circ(86, 0, 18, SKIN, 6) + circ(0, 0, 86, HERO_HAIR, 7) + [0, 1, 2, 3, 4, 5, 6].map(i => { const a = R(-180 + i * 30); return circ(Math.cos(a) * 70, Math.sin(a) * 70, 24, HERO_HAIR, 0); }).join('') + path('M-40 -30Q-20 -50 0 -30Q20 -50 40 -30', 'none', 5, shade(HERO_HAIR, .3)));
// bulle de son « hm ! » (pop puis disparaît)
function touSay(x, y, str, t, t0, o = {}) { const k = pop(t, t0, .25); if (k <= 0) return ''; const D = o.dur || .9, f = 1 - seg(t, t0 + D, t0 + D + .25); if (f <= 0) return '';
  const sz = o.size || 44, w = str.length * sz * .6 + sz * 1.1, h = sz * 1.7, sd = o.side || -1;
  return op(f, G(tr(x, y, k, (o.r ?? -6) + Math.sin(t * 30) * 2), path(`M${f1(sd * w * .12)} ${f1(h / 2 - 6)}L${f1(sd * w * .36)} ${f1(h / 2 + 36)}L${f1(sd * w * .3)} ${f1(h / 2 - 6)}Z`, o.bg || '#fff', 6) + rect(-w / 2, -h / 2, w, h, o.bg || '#fff', h / 2, 6) + ftext(0, sz * .36, str, { size: sz, fill: o.fg || SX.ink, stroke: 'none' }))); }

// ---------- les autres (on rit de LEURS réactions) ----------
const touProf = (o, t) => adult(2, Object.assign({ hair: 'bald', hairColor: '#7a6a5a', mustache: true, glasses: true, shirt: '#a0784e', pants: '#4a3a2a', seed: 62 }, o), t);
const touProfHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'bald', hairColor: '#7a6a5a', mustache: true, glasses: true, skin: SK[4], seed: 62 }, o), t));
const touTonton = (o, t) => adult(1, Object.assign({ hair: 'short', hairColor: '#4a3428', mustache: false, glasses: false, shirt: '#e2463a', pants: '#2f3b4e', seed: 77 }, o), t);
const touTontonHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'short', hairColor: '#4a3428', skin: SK[3], seed: 77 }, o), t));
const touDoc = (i, o, t) => adult(i, Object.assign({ shirt: '#f4f6f8', coat: 1, glasses: true, pants: '#3a4250' }, o), t);
// Dr Kevin : blouse blanche, stéthoscope, miroir frontal
const touDrKevin = (o, t) => kevin(Object.assign({ shirt: '#f4f6f8', coat: 1, stetho: 1 }, o), t) + G(ptr(o), G(tr(0, -292 - 72), circ(0, 0, 30, '#dfe7ee', 6) + circ(0, 0, 14, '#fff', 3) + line(-30, 0, -96, 30, 8)));

// ---------- accessoires ----------
const touPencil = () => G(tr(0, -6, 1, -30), rect(-7, -64, 14, 80, '#ffd23f', 3, 4) + path('M-7 16L0 32L7 16Z', '#f2c9a0', 3) + rect(-7, -70, 14, 12, '#ff8fb1', 3, 3));
const touExam = (t, k = 1) => rect(-170, -210, 340, 420, '#fff', 8, 0) + ftext(0, -150, 'CONTRÔLE', { size: 40, fill: OL, stroke: 'none' }) + line(-130, -120, 130, -120, 4, '#e2463a') +
  ['2 + 2 = 4', '7 × 8 = 56', '12 − 5 = …'].map((q, i) => ftext(-130, -60 + i * 80, q, { size: 38, fill: '#3a5bff', stroke: 'none', anchor: 'start' })).join('') + op(k, circ(110, 150, 40, 'none', 6, '#e2463a') + ftext(110, 162, '?', { size: 40, fill: '#e2463a', stroke: 'none' }));
// regard fixe : ligne pointillée animée + petit œil
function touGaze(x1, y1, x2, y2, t, t0, col = '#e2463a') { const k = eOutCubic(seg(t, t0, t0 + .25)); if (k <= 0) return ''; const xe = lerp(x1, x2, k), ye = lerp(y1, y2, k);
  return `<path d="M${f1(x1)} ${f1(y1)}L${f1(xe)} ${f1(ye)}" stroke="${col}" stroke-width="9" stroke-dasharray="22 14" stroke-dashoffset="${f1(-t * 90)}" stroke-linecap="round" fill="none"/>`; }
function touGauge(x, y, r, p, label, t) { const a = R(lerp(-210, 30, clamp(p)) + Math.sin(t * 40) * 3 * p);
  return G(tr(x, y), circ(0, 0, r + 14, '#9aa3ad', 7) + circ(0, 0, r, '#fff', 5) + path(`M${f1(Math.cos(R(-60)) * r * .8)} ${f1(Math.sin(R(-60)) * r * .8)}A${f1(r * .8)} ${f1(r * .8)} 0 0 1 ${f1(Math.cos(R(30)) * r * .8)} ${f1(Math.sin(R(30)) * r * .8)}`, 'none', 18, '#e2463a') +
    path(`M${f1(Math.cos(R(-210)) * r * .8)} ${f1(Math.sin(R(-210)) * r * .8)}A${f1(r * .8)} ${f1(r * .8)} 0 0 1 ${f1(Math.cos(R(-60)) * r * .8)} ${f1(Math.sin(R(-60)) * r * .8)}`, 'none', 18, '#7be07b') +
    line(0, 0, Math.cos(a) * r * .75, Math.sin(a) * r * .75, 10) + circ(0, 0, 14, OL, 0) + ftext(0, r * .62, label, { size: r * .26, fill: OL, stroke: 'none' })); }
const touLaptop = (x, y, s, screen = '', r = 0) => G(tr(x, y, s, r), rect(-210, -280, 420, 280, '#3a3f4a', 18, 7) + rect(-190, -260, 380, 240, '#eef4ff', 8, 0) + screen + path('M-250 0L250 0L280 40L-280 40Z', '#9aa3ad', 7) + rect(-50, 8, 100, 14, '#7d848c', 6, 0));
const touTable = (x, yb, w = 700) => G(tr(x, yb), rect(-w / 2, -20, w, 40, '#fff', 10, 7) + rect(-w / 2 + 10, 20, w - 20, 300, '#e9e2d4', 6, 6) + path(`M${-w / 2 + 10} 20L${-w / 2 + 60} 140L${-w / 2 + 110} 20M${w / 2 - 110} 20L${w / 2 - 60} 140L${w / 2 - 10} 20`, '#10a37f', 0) +
  ell(-150, -24, 70, 16, '#fff', 5) + ell(150, -24, 70, 16, '#fff', 5) + G(tr(0, -60), rect(-22, -40, 44, 80, 'rgba(200,235,255,.7)', 10, 5)) + G(tr(-250, -50), rect(-30, -10, 60, 50, '#ffb03a', 8, 5) + ell(0, -10, 30, 10, '#fff', 4)));
const touUmbrella = (x, y, s, k, c = '#e2463a') => k <= 0 ? '' : G(tr(x, y, s * eOutBack(k), -15), path('M-130 0Q-130 -120 0 -130Q130 -120 130 0Q100 -20 65 0Q32 -20 0 0Q-32 -20 -65 0Q-100 -20 -130 0Z', c, 7) + path('M0 -130L-30 0M0 -130L30 0', 'none', 4, shade(c, -.3)) + line(0, 0, 0, 150, 9) + path('M0 150Q0 180 -26 176', 'none', 9));
function touDiploma(x, y, w, h, t1, t2, r = 0) { return G(tr(x, y, 1, r), rect(-w / 2, -h / 2, w, h, '#c99a3a', 6, 6) + rect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, '#fff8e6', 2, 3) + ftext(0, -h * .12, t1, { size: Math.min(30, w * .13), fill: '#7a4a2a', stroke: 'none' }) +
  ftext(0, h * .16, t2, { size: Math.min(22, w * .085), fill: '#3a5bff', stroke: 'none' }) + circ(w / 2 - 34, h / 2 - 32, 18, '#e2463a', 4)); }
// mini-foule (pictogrammes) pour le panneau « minorité »
function touCrowd(t, hi, okK = 0) { let s = ''; for (let j = 0; j < 5; j++) for (let i = 0; i < 8; i++) { const x = -196 + i * 56, y = -112 + j * 56, idx = j * 8 + i, h = hi.includes(idx);
  const c = h ? SX.acc : okK > 0 ? mixC('#c9d3dc', '#7be07b', okK) : '#c9d3dc'; s += circ(x, y - 6, 17, c, 4) + rect(x - 14, y + 10, 28, 14, c, 7, 3) + circ(x - 6, y - 8, 2.5, OL, 0) + circ(x + 6, y - 8, 2.5, OL, 0) + (h ? touZips(x, y - 6, t, .4 + .3 * Math.abs(Math.sin(t * 6 + i)), 22, 3, idx * 40) : ''); }
  return s; }

// ---------- le cerveau pilote (salle de contrôle dans la tête) ----------
function touBrain(x, y, s, t, o = {}) { const c = '#ff9ec0', c2 = '#e8789e', lx = (o.look || 0) * 8;
  let g = ell(-50, 128, 34, 16, c2, 6) + ell(50, 128, 34, 16, c2, 6) + line(-50, 100, -50, 124, 10, c2) + line(50, 100, 50, 124, 10, c2);
  g += path('M-150 30Q-175 -60 -110 -110Q-80 -160 -10 -150Q40 -175 95 -135Q160 -120 160 -50Q185 10 140 60Q120 110 50 105Q0 125 -50 100Q-130 110 -150 30Z', c, 7);
  g += path('M-90 -110Q-60 -80 -95 -50M-20 -140Q0 -110 -30 -90M60 -135Q40 -100 75 -75M120 -80Q95 -55 125 -25M-130 40Q-95 30 -90 70M40 80Q70 55 110 70', 'none', 6, c2);
  const bl = Math.sin(t * 2.3) > .96;
  g += circ(-45, -10, 32, '#fff', 6) + circ(45, -10, 32, '#fff', 6) + (bl ? line(-70, -10, -20, -10, 6) + line(20, -10, 70, -10, 6) : circ(-40 + lx, -6, 14, OL, 0) + circ(50 + lx, -6, 14, OL, 0) + circ(-35 + lx, -12, 4, '#fff', 0) + circ(55 + lx, -12, 4, '#fff', 0));
  g += o.mood === 'oops' ? ell(0, 52, 16, 20, OL, 0) : path('M-30 44Q0 70 30 44', 'none', 7) + ell(-80, 30, 16, 9, '#ff6f9a', 0) + ell(80, 30, 16, 9, '#ff6f9a', 0);
  return G(tr(x, y, s, o.r || 0), g); }
// bras-neurone ondulé du cerveau jusqu'au bouton
const touNeuArm = (x1, y1, x2, y2, t) => { const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 80 + Math.sin(t * 6) * 14, d = `M${f1(x1)} ${f1(y1)}Q${f1(mx)} ${f1(my)} ${f1(x2)} ${f1(y2)}`; return path(d, 'none', 26, OL) + path(d, 'none', 14, '#ff9ec0') + circ(x2, y2, 24, '#ff9ec0', 6); };
const touButton = (x, y, label, pressed, col) => G(tr(x, y), ell(0, 26, 92, 30, '#3a4280', 6) + ell(0, pressed ? 22 : 6, 74, 26, col, 6) + (pressed ? '' : rect(-74, 6, 148, 18, shade(col, -.25), 0, 0) + ell(0, 6, 74, 26, col, 6)) + ftext(0, 96, label, { size: 34, fill: '#fff' }));
function touControlRoom(t, scr = '') { const yb = 1250;
  let s = grad('#2a2f6a', '#151a40', -M, -M, W + 2 * M, yb + M);
  s += rect(-M, 60, W + 2 * M, 40, '#4a5290', 0, 5) + rect(-M, 130, W + 2 * M, 24, '#3a4280', 0, 4);
  for (let i = 0; i < 6; i++) s += rect(-40 + i * 220, 40, 30, 130, '#5a62a0', 8, 4);
  for (let i = 0; i < 4; i++) s += path(`M-200 ${220 + i * 36}Q300 ${170 + i * 44 + wave(t, .3, 10, i)} 540 ${250 + i * 26}T1300 ${210 + i * 40}`, 'none', 10, ['#ff8fb1', '#8fd0ff', '#ffd23f', '#7be07b'][i]);
  for (let i = 0; i < 4; i++) { const k = (t * .8 + i / 4) % 1; s += circ(lerp(-100, 1200, k), 230 + i * 34 + Math.sin(k * 6) * 20, 9, '#fff', 0); }
  s += rect(400, 540, 640, 380, '#0d1030', 20, 8) + clipR(418, 558, 604, 344, scr, 10) + op(.12, rect(418, 558 + ((t * 300) % 344), 604, 16, '#fff', 0, 0));
  s += G(tr(720, 515), rect(-130, -26, 260, 52, '#c9d3dc', 10, 5) + ftext(0, 13, 'CORTEX', { size: 32, fill: OL, stroke: 'none' }));
  s += G(tr(990, 600, 1, 6), rect(-60, -40, 120, 80, '#ffd23f', 4, 4) + ftext(0, -6, 'NE PAS', { size: 22, fill: OL, stroke: 'none' }) + ftext(0, 22, 'TOUCHER', { size: 22, fill: OL, stroke: 'none' }));
  for (const [mx, my] of [[40, 420], [40, 700]]) { let wv = ''; for (let i = 0; i <= 20; i++) wv += (i ? 'L' : 'M') + f1(mx + 10 + i * 12) + ' ' + f1(my + 90 + Math.sin(t * 8 + i * .8 + my) * 30 * Math.sin(i * .5)); s += rect(mx, my, 260, 200, '#0d1030', 16, 7) + path(wv, 'none', 5, '#7be07b'); }
  s += path('M-200 1260L-160 980L1240 980L1280 1260Z', '#5a62a0', 7) + rect(-M, 960, W + 2 * M, 40, '#6f78b8', 6, 6);
  for (let i = 0; i < 12; i++) { const x = 30 + i * 92, on = Math.sin(t * 5 + i * 1.7) > .2; s += circ(x, 1180, 16, on ? DPAL[i % 8] : shade(DPAL[i % 8], -.45), 4); }
  for (let i = 0; i < 6; i++) s += rect(40 + i * 180, 1210, 120, 26, '#3a4280', 8, 4) + rect(50 + i * 180 + ((t * 40 + i * 30) % 80), 1204, 26, 38, '#c9d3dc', 6, 4);
  s += dMug(1010, 960, .9, t, '#ff8fb1') + dPot(330, 960, .5, t, 1);
  return s + rect(-M, yb, W + 2 * M, 1400, '#1d2250', 0, 0) + [0, 1, 2, 3].map(i => line(-M, yb + 40 + i * 70, W + M, yb + 40 + i * 70, 4, '#2c3370')).join(''); }

// ---------- cuisine + cocotte-minute (retenir un tic = cocotte sous pression) ----------
function touKitchen(t) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#fdf1dc', 0, 0);
  for (let y = 640; y < 960; y += 50) for (let x = -M; x < W + M; x += 60) s += rect(x + 2, y + 2, 56, 46, ((x + M) / 60 + (y - 640) / 50) % 2 ? '#d6f0ea' : '#c4e8df', 4, 0);
  for (let i = 0; i < 5; i++) if (i !== 2) s += rect(-80 + i * 250, 150, 230, 300, '#ffb38a', 10, 6) + rect(-60 + i * 250, 170, 190, 260, 'none', 8, 4, '#e8946a') + circ(-80 + i * 250 + (i % 2 ? 40 : 190), 420, 9, '#fff', 4);
  s += dWindowView(440, 160, 200, 260, t) + dCurtain(420, 150, 70, 300, '#ff8fb1', t, 1) + dCurtain(590, 150, 70, 300, '#ff8fb1', t, -1);
  s += path('M380 470L700 470L660 560L420 560Z', '#c9d3dc', 6) + rect(500, 420, 80, 60, '#c9d3dc', 4, 5);
  s += dShelf(30, 600, 300, dJar(70, 600, '#ff9a4d', .8) + dJar(130, 600, '#7be07b', .8) + dJar(190, 600, '#ffd23f', .8) + dMug(260, 600, .8, t, '#5b8fd8')) + dShelf(760, 600, 300, dPot(810, 600, .5, t, 2, '#e2463a') + dJar(900, 600, '#ff8fb1', .8) + dJar(960, 600, '#8fd0ff', .8));
  for (let i = 0; i < 4; i++) { const x = 790 + i * 60, sw = wave(t, .5, 4, i); s += G(tr(x, 470, 1, sw), line(0, 0, 0, 60, 4) + (i % 2 ? ell(0, 80, 16, 24, '#9aa3ad', 4) : rect(-6, 60, 12, 60, '#c58e55', 3, 3) + ell(0, 120, 18, 10, '#c58e55', 3))); }
  s += wallClock(260, 520, 40, t * 3);
  s += rect(-M, 960, W + 2 * M, 40, '#e9e2d4', 6, 6) + rect(-M, 1000, W + 2 * M, 250, '#ff9a6a', 0, 6);
  for (let i = 0; i < 6; i++) s += rect(-60 + i * 200, 1020, 180, 210, 'none', 10, 5, '#e2784a') + rect(-60 + i * 200 + 70, 1040, 40, 12, '#fff', 6, 3);
  s += rect(330, 975, 420, 20, '#3a3f4a', 6, 5);
  s += G(tr(1010, 1250), rect(-110, -760, 220, 760, '#eef4ff', 20, 7) + line(-110, -470, 110, -470, 6) + rect(70, -700, 16, 120, '#9aa3ad', 6, 4) + rect(70, -420, 16, 120, '#9aa3ad', 6, 4) + circ(-50, -620, 16, '#e2463a', 4) + rect(-70, -560, 60, 40, '#ffd23f', 4, 4) + circ(20, -560, 14, '#5b8fd8', 4));
  return s + dTileFloor(yb, '#f2e6d0', '#c9b79a') + dPot(70, 1300, 1.1, t, 0); }
function touCooker(x, yb, s, t, o = {}) { const sh = o.shake ? Math.sin(t * 70) * 5 * o.shake : 0, lift = o.lift || 0;
  let g = rect(-250, -30, 50, 26, '#3a3f4a', 8, 5) + rect(200, -30, 50, 26, '#3a3f4a', 8, 5);
  g += rect(-210, -260, 420, 260, '#c9d3dc', 34, 7) + rect(-190, -240, 60, 220, 'rgba(255,255,255,.45)', 20, 0) + rect(-280, -210, 80, 34, '#3a3f4a', 14, 6) + rect(200, -210, 80, 34, '#3a3f4a', 14, 6);
  g += (o.label ? G(tr(60, -130), rect(-110, -34, 220, 68, '#fff', 14, 5) + ftext(0, 12, o.label, { size: 34, fill: SX.acc, stroke: 'none' })) : '');
  const lid = G(tr(sh * 1.5, -260 - lift, 1, lift ? Math.min(40, lift * .08) : sh * .4), path('M-230 0Q-220 -70 0 -76Q220 -70 230 0Z', '#aeb8c2', 7) + rect(-240, -10, 480, 22, '#8a94a0', 10, 6) + rect(-30, -110, 60, 40, '#3a3f4a', 8, 5) + rect(-12, -136, 24, 30, '#e2463a', 6, 5) + rect(150, -48, 140, 30, '#3a3f4a', 14, 6));
  return G(tr(x + sh, yb, s), g + lid + (o.gauge != null ? touGauge(-90, -120, 66, o.gauge, 'TICS', t) : '')); }
// petites bouffées de vapeur
const touPuffs = (x, y, t, n = 4, sp = 1, sc = 1) => { let s = ''; for (let i = 0; i < n; i++) { const k = (t * 1.6 * sp + i / n) % 1; s += op(1 - k, cloud(x + Math.sin(k * 7 + i) * 40 * sc, y - k * 220 * sc, (.25 + k * .4) * sc, '#fff', 4)); } return s; };

// ---------- cinéma (vu de derrière le public) ----------
function touCinema(t, o = {}) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#2a1420', 0, 0); for (let x = -M; x < W + M; x += 70) s += rect(x, -M, 34, 1300 + M, 'rgba(255,255,255,.03)', 0, 0);
  const fl = .8 + .2 * Math.sin(t * 9) * Math.sin(t * 3.1);
  s += op(.18 * fl, path('M540 1900L-100 600L1180 600Z', '#bfe3ff', 0));
  s += rect(90, 150, 900, 450, '#141820', 14, 7) + rect(110, 170, 860, 410, mixC('#7fc8ff', '#ffe08a', .5 + .5 * Math.sin(t * 1.3)), 6, 0) + op(.6, path('M110 580L300 380L420 500L600 290L800 480L970 360L970 580Z', '#2f6fb0', 0)) + circ(800, 270, 50, '#fff6c8', 0) +
    G(tr(330 + Math.sin(t * 2) * 30, 470), ell(0, 0, 80, 50, '#7be07b', 5) + circ(70, -40, 34, '#7be07b', 5) + circ(80, -46, 6, OL, 0) + rect(-50, 30, 18, 40, '#5fb85f', 4, 4) + rect(30, 30, 18, 40, '#5fb85f', 4, 4));
  s += dCurtain(-60, 120, 200, 560, '#a8203a', t, 1) + dCurtain(940, 120, 200, 560, '#a8203a', t, -1) + rect(-M, 100, W + 2 * M, 50, '#7a1428', 0, 5);
  s += G(tr(990, 730), rect(-80, -30, 160, 60, '#1f8a4a', 8, 4) + ftext(0, 12, 'SORTIE', { size: 28, fill: '#fff', stroke: 'none' }));
  for (let i = 0; i < 6; i++) s += op(.6 + .4 * Math.sin(t * 2 + i), circ(100 + i * 176, 690, 8, '#ffd88a', 0));
  return s; }
const touSeats = (y, s = 1, n = 8, off = 0) => { let r = ''; for (let i = -1; i < n; i++) { const x = off + i * 170 * s; r += rect(x - 74 * s, y, 148 * s, 150 * s, '#c8243e', 30 * s, 6) + rect(x - 60 * s, y + 14 * s, 120 * s, 20 * s, '#e0405a', 8, 0); } return r; };

// ---------- bus (intérieur) ----------
function touBus(t) { const yb = 1250; let s = grad('#e8eef3', '#cfd9e2', -M, -M, W + 2 * M, yb + M);
  const scroll = (t * 520) % 1200, sc2 = (t * 1100) % 700;
  s += clipR(-M, 290, W + 2 * M, 420, grad('#9fd6ff', '#e6f6ff', -M, 290, W + 2 * M, 420) + G(`translate(${f1(-scroll)} 0)`, [0, 1].map(k => dSkyline(700, '#bccde0', 7).replace(/^/, `<g transform="translate(${k * 1200} 0)">`) + '</g>').join('') +
    [0, 1, 2, 3, 4, 5].map(i => dBuilding(-200 + i * 400, 710, 300, 260 + (i * 97 % 140), ['#e7c9a0', '#f0b8a8', '#bcd7c4'][i % 3], i + 3, t)).join('')) + G(`translate(${f1(-sc2)} 0)`, [0, 1, 2, 3, 4].map(i => tree(100 + i * 700, 730, .45, t) + dLampPost(450 + i * 700, 730, .7)).join('')), 0);
  for (let i = 0; i < 5; i++) s += rect(-90 + i * 300, 280, 50, 440, '#b9c4ce', 10, 6);
  s += rect(-M, 140, W + 2 * M, 140, '#f4f1ea', 0, 6) + G(tr(250, 210), rect(-170, -50, 340, 100, '#ff8fb1', 10, 5) + ftext(0, 14, 'SOLDES -50 %', { size: 38, fill: '#fff' })) + G(tr(800, 210), rect(-200, -46, 400, 92, '#1d1d26', 10, 5) + ftext(0, 14, Math.sin(t * 3) > 0 ? 'ARRÊT DEMANDÉ' : 'LIGNE 12', { size: 36, fill: '#ff5c4a', stroke: 'none' }));
  s += rect(-M, 110, W + 2 * M, 16, '#ffd23f', 8, 5);
  for (let i = 0; i < 6; i++) { const x = 60 + i * 190; s += G(tr(x, 118, 1, wave(t, .6, 6, i)), line(0, 0, 0, 120, 6, '#3a3f4a') + circ(0, 140, 24, 'none', 8, '#3a3f4a')); }
  s += rect(-M, 720, W + 2 * M, 30, '#b9c4ce', 0, 5);
  s += rect(-M, yb, W + 2 * M, 1400, '#5a626e', 0, 0) + rect(-M, yb + 60, W + 2 * M, 14, '#ffd23f', 0, 0); for (let i = 0; i < 30; i++) s += circ((i * 97) % (W + 200) - 100, yb + 120 + (i * 53) % 400, 6, '#4a525e', 0);
  return s; }
const touBusSeat = (x, yb, s = 1, c = '#3a5bff') => G(tr(x, yb, s), rect(-110, -300, 220, 300, c, 30, 7) + [0, 1, 2].map(i => path(`M${-90 + i * 70} -280L${-60 + i * 70} -250L${-90 + i * 70} -220`, 'none', 5, shade(c, .3))).join('') + rect(-110, -60, 220, 50, shade(c, -.2), 14, 5));
const touPole = (x, y0, y1) => rect(x - 12, y0, 24, y1 - y0, '#ffd23f', 12, 5) + G(tr(x, y0 + 260), rect(-20, -20, 40, 40, '#e2463a', 10, 4));

// ---------- cabinet du « Dr » / labo ----------
function touOffice(t, o = {}) { const yb = 1250;
  let s = dWall('dot', '#e3f1ee', '#cfe6e1', yb) + rect(-M, 980, W + 2 * M, yb - 980, '#b9d8d2', 0, 0) + line(-M, 980, W + M, 980, 6, '#93bdb5') + dBase(yb, '#6b8f88');
  s += dWindowView(780, 250, 260, 330, t);
  s += touDiploma(160, 240, 250, 180, o.d1 || 'DIPLÔME', o.d1b || 'vu sur Internet', -3) + touDiploma(430, 220, 220, 160, o.d2 || 'NEUROLOGUE', o.d2b || '(en 5 minutes)', 3) + touDiploma(660, 250, 190, 140, o.d3 || 'MÉDECIN', o.d3b || 'auto-proclamé', -2);
  s += wallClock(910, 160, 46, t) + dShelf(40, 760, 380, dBooks(50, 760, 360, 7)) + dShelf(620, 760, 420, dJar(660, 760, '#ff8fb1', .8) + dGlobe(760, 760, .8, t) + dTrophy(870, 760, .9) + dJar(960, 760, '#8fd0ff', .8));
  s += G(tr(560, 640, 1, 2), rect(-70, -60, 140, 120, '#fff', 6, 5) + path('M-40 10Q-50 -30 -10 -36Q10 -50 34 -30Q56 -10 40 16Q20 34 -10 26Q-34 30 -40 10Z', '#ff9ec0', 4) + ftext(0, 50, 'CERVO', { size: 20, fill: '#e2463a', stroke: 'none' }));
  return s + dParquet(yb, '#c9a27a') + dLamp(70, 1290, 1, 1, t) + dPot(1010, 1290, 1, t, 2); }

// ---------- tribunal ----------
function touCourt(t) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#d9b07a', 0, 0); for (let x = -M; x < W + M; x += 90) s += rect(x, -M, 10, yb + M, '#c49a64', 0, 0);
  s += rect(-M, 880, W + 2 * M, yb - 880, '#a87445', 0, 0) + line(-M, 880, W + M, 880, 6, '#7a5230'); for (let x = -M; x < W + M; x += 180) s += rect(x + 20, 910, 140, 300, 'none', 8, 4, '#8a5a30');
  s += windowFrame(-130, 230, 200, 480) + windowFrame(1010, 230, 200, 480) + dCurtain(110, 130, 140, 600, '#7a1428', t, 1) + dCurtain(830, 130, 140, 600, '#7a1428', t, -1);
  s += G(tr(540, 150), circ(0, 0, 86, '#ffd23f', 7) + line(0, -50, 0, 50, 8) + line(-56, -30, 56, -30, 8) + path('M-56 -30L-76 16L-36 16Z', 'none', 5) + path('M56 -30L36 16L76 16Z', 'none', 5) + ell(-56, 18, 24, 8, '#fff', 5) + ell(56, 18, 24, 8, '#fff', 5));
  s += G(tr(540, 285), rect(-190, -34, 380, 68, '#7a1428', 12, 6) + ftext(0, 14, 'TRIBUNAL', { size: 44, fill: '#ffd23f', stroke: 'none' }));
  return s + dParquet(yb, '#8a5a3a') + dPot(60, 1300, 1, t, 1); }
const touGavel = (k) => G(`rotate(${f1(-40 + 70 * k)})`, rect(-8, -10, 16, 110, '#8a5a3a', 6, 5) + rect(-50, -40, 100, 44, '#6b3e26', 10, 6));

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001 — SIGNATURE : grille encre, héros en cut-out (petits tics + éclairs), titre 3 lignes, « débloqué » en étoiles sur TOURETTE
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'tourette'), Sy = at(1, 'syndrome');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.25, expr: t > K ? 'joy' : 'happy', tics: [[.8, 'arm'], [1.6, 'head'], [2.2, 'blink'], [K + .35, 'arm']] }, t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1060, 330, 330, t, K + .2, { label: 'tics.png' }) +
      kthin("POURQUOI C'EST HORRIBLE", CX, 320, t, .05, { size: 54 }) + kthin("D'AVOIR LE SYNDROME DE", CX, 400, t, Sy - .1, { size: 50 }) +
      funTag(CX, 462, 'GILLES DE', t, at(1, 'gilles') - .05, { size: 28, bg: SX.acc, fg: '#fff', r: -3 }) + kword('LA TOURETTE ?', CX, 548, t, K - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [at(1, 'syndrome') - .1, 'pop_hi', .4], [.8, 'zap', .3], [at(1, 'tourette') - .05, 'boom', .6], [at(1, 'tourette'), 'sparkle', .5]] });

// B002 — « Tu as 8 ans, en plein contrôle de maths » : papier + gobo, héros cut-out à son pupitre, copie de contrôle
B(2, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const A8 = at(2, '8'), Ct = at(2, 'controle');
    return paper(SX.paper) + gobo(T, .12) + burst(760, 900, 300, t, .05, '#ffe1b8', 16) +
      cutout(heroP({ x: 320, y: 1450, s: 1.25, expr: t > Ct ? 'worried' : 'happy', armR: [40, 10], holdR: touPencil(), idle: false, tics: [] }, t) + desk(320, 1290, 1.05), 10) +
      card(770, 900, 380, 460, touExam(t, seg(t, Ct + .3, Ct + .6)), t, Ct - .15, { ry: 0, thick: 10, r: 5, bw: 6 }) +
      funTag(CX, 480, '8 ANS', t, A8 - .1, { size: 96, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 480, t, A8, 6, 180) + funTag(770, 640, 'CONTRÔLE DE MATHS', t, Ct, { size: 36, bg: SX.acc, fg: '#fff', r: 4 }); },
  sfx: [[0, 'whoosh', .4], [at(2, '8') - .1, 'pop', .7], [at(2, '8'), 'sparkle', .3], [at(2, 'controle') - .15, 'pop_hi', .5], [at(2, 'maths'), 'scratch', .4]] });

// B003 — « Soudain, ton bras bouge tout seul ! » : grille émeraude, le bras part tout seul (traits + éclairs), TOUT SEUL
B(3, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(3, 'bras') ? 3 : 0 }),
  draw: (t, d, T) => { const Br = at(3, 'bras'), Sl = at(3, 'seul');
    return gridBg('#0d4f40', 'rgba(255,255,255,.07)') + halftoneFade('#fff', .05, 1) + burst(CX, 1000, 320, t, Br, SX.acc2, 18) +
      G(tr(CX, 1470), cutout(heroP({ x: 0, y: 0, s: 1.4, expr: t > Br ? 'shock' : 'neutral', tics: touRep(Br - .05, d, .3, 'arm'), holdL: '' }, t), 12)) +
      funTag(330, 460, 'SOUDAIN…', t, at(3, 'soudain') - .05, { size: 54, bg: '#fff', fg: SX.ink, r: -6 }) + kword('TOUT SEUL !', CX, 600, t, Sl - .05, { size: 104, fill: SX.acc2 }) + (t > Br ? speedLines(t, CX, 1000, 18, 'rgba(255,255,255,.35)') : ''); },
  sfx: [[at(3, 'soudain') - .05, 'sting', .5], [at(3, 'bras') - .05, 'zap', .5], [at(3, 'bouge'), 'whoosh', .4], [at(3, 'seul') - .05, 'boom', .5], [at(3, 'seul') + .1, 'zap', .3]] });

// B004 — « Puis, tu clignes des yeux. » : gros plan, clignements rapides, étiquettes CLIGNE
B(4, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), hand: .3 }),
  draw: (t, d, T) => { const Cl = at(4, 'clignes'), bl = [Cl, Cl + .22, Cl + .44];
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .32 }, { z: 1, svg: heroHead(CX, 960, 230, { expr: 'worried', tics: bl.map(x => [x, 'blink']) }, t) }]) +
      bl.map((x, i) => funTag([240, 840, 250][i], [640, 700, 1100][i], 'CLIGNE', t, x, { size: 44, bg: i % 2 ? SX.acc : SX.acc2, fg: i % 2 ? '#fff' : SX.ink, r: [-8, 6, -4][i] })).join('') +
      kthin('puis…', CX, 450, t, at(4, 'puis') - .1, { size: 60 }); },
  sfx: [[0, 'whoosh', .4], [at(4, 'clignes'), 'pop_hi', .5], [at(4, 'clignes') + .22, 'pop_hi', .5], [at(4, 'clignes') + .44, 'pop_hi', .5], [at(4, 'yeux'), 'flutter', .3]] });

// B005 — « Encore et encore, le professeur te regarde. » : le prof se retourne du tableau, regard pointillé qui fixe
B(5, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const E1 = at(5, 'encore'), E2 = at(5, 'encore', 2), Pr = at(5, 'professeur'), Rg = at(5, 'regarde'), turned = t > Pr;
    const board = ftext(540, 600, '7 × 8 = ?', { size: 80, fill: 'rgba(255,255,255,.85)', stroke: 'none' });
    return classroomT(t, board) + WASH() + touProf({ x: 840, y: 1480, s: 1.2, expr: turned ? 'suspicious' : 'neutral', flip: turned ? 1 : 0, look: turned ? [1, 0] : [0, -1], armR: turned ? [70, 80] : [-50, -70], holdR: turned ? '' : G(tr(0, 0), rect(-8, -40, 16, 50, '#fff', 4, 3)) }, t) +
      heroP({ x: 280, y: 1480, s: 1.3, expr: 'worried', armR: [40, 10], holdR: touPencil(), tics: [[E1, 'blink'], [E1 + .2, 'blink'], [E2, 'blink'], [E2 + .2, 'blink'], [Rg + .1, 'blink']] }, t) + desk(280, 1310, 1.0) +
      touGaze(800, 1010, 330, 1080, t, Rg) + touGaze(860, 1010, 340, 1110, t, Rg + .05) +
      funTag(300, 470, 'ENCORE', t, E1 - .05, { size: 58, bg: SX.acc2, fg: SX.ink, r: -6 }) + funTag(720, 600, 'ET ENCORE', t, E2 - .05, { size: 58, bg: SX.acc, fg: '#fff', r: 5 }) + (turned ? emark(930, 830, .55, '#e2463a', 10) : ''); },
  sfx: [[at(5, 'encore') - .05, 'pop_hi', .5], [at(5, 'encore', 2) - .05, 'pop_hi', .5], [at(5, 'professeur'), 'squeak', .5], [at(5, 'regarde'), 'hmm', .5], [at(5, 'regarde') + .05, 'zap', .3]] });

// B006 — « Arrête de faire l'intéressant ! » : crash zoom sur le prof furieux (fumée), ARRÊTE !
B(6, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, eOutCubic(clamp(t / .4))), shake: t < .4 ? 6 : 1 }),
  draw: (t, d, T) => { const Ar = at(6, 'arrete'), In = at(6, 'interessant');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .35 }, { z: 1, svg: touProfHead(CX, 1000, 210, { expr: 'rage', look: [-1, 0] }, t) +
      G(tr(CX + 260, 1060, 1, -30 + Math.sin(t * 16) * 8), rect(-16, -200, 32, 240, '#d9a86c', 6, 6) + circ(0, 40, 38, SK[4], 6)) }]) +
      kword('ARRÊTE !', CX, 470, t, Ar - .05, { size: 120, fill: '#fff' }) + kthin("de faire l'intéressant !", CX, 630, t, In - .2, { size: 56 }) + (t > In ? impactStar(820, 820, .5) : ''); },
  sfx: [[0, 'whoosh', .4], [at(6, 'arrete') - .05, 'boom', .6], [at(6, 'faire'), 'growl', .3], [at(6, 'interessant'), 'thud', .6]] });

// B007 — « Sauf qu'il y a un problème. » : arrêt sur image (rayons rouges), PROBLÈME
B(7, { enter: 'none', trans: 'glitch', transD: .2, cam: () => ({ z: 1.06, shake: 2 }),
  draw: (t, d, T) => { const Pb = at(7, 'probleme');
    return rays(t, CX, 950, '#ff6b6b', '#d93a3a', 22) + heroHead(CX, 990, 210, { expr: 'worried', tics: [[Pb + .1, 'head']] }, t) +
      kthin("sauf qu'il y a un", CX, 420, t, at(7, 'sauf') - .05, { size: 58 }) + kword('PROBLÈME', CX, 560, t, Pb - .05, { size: 112, fill: '#fff' }) + funBox(CX, 990, 520, 520, t, Pb + .1, { label: 'pause.png', col: SX.acc2 }); },
  sfx: [[at(7, 'sauf'), 'scratch', .6], [at(7, 'probleme') - .05, 'boom', .6], [at(7, 'probleme') + .1, 'zap', .4]] });

// B008 — « Tu ne le fais pas exprès. » : le bras repart, le héros n'y peut rien, tampon PAS EXPRÈS
B(8, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.03, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Fa = at(8, 'fais'), Ex = at(8, 'expres');
    return classroomT(t) + WASH() + touProf({ x: 860, y: 1480, s: 1.15, expr: 'confused', flip: 1, armL: [200, 250] }, t) + qmark(950, 820, .5, SX.acc2, 10) +
      heroP({ x: 330, y: 1480, s: 1.35, expr: 'embarrassed', tics: [[Fa - .05, 'arm'], [Fa + .3, 'arm']] }, t) + desk(330, 1320, 1.05) +
      kthin('tu ne le fais pas', CX, 440, t, at(8, 'tu') - .05, { size: 60 }) + stamp(CX, 590, 'PAS EXPRÈS', t, Ex - .05, SX.acc, -6, 84); },
  sfx: [[at(8, 'fais') - .05, 'zap', .5], [at(8, 'fais') + .3, 'zap', .4], [at(8, 'expres') - .05, 'thud', .7], [at(8, 'expres'), 'pop', .4]] });

// B009 — « Bienvenue dans la vie avec le syndrome de Gilles de la Tourette. » : paillasson BIENVENUE, débloqué en étoiles (2/3)
B(9, { enter: 'none', trans: 'circle', transD: .3, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const K = at(9, 'tourette'), Gi = at(9, 'gilles');
    return paper('#e3f7ef') + gobo(T, .1) + unlock(CX, 980, t, K, { part: 'back', r: 470 }) + G(tr(CX, 1300), rect(-330, -40, 660, 120, '#c58e55', 30, 7) + ftext(-150, 42, 'BIEN', { size: 60, fill: '#7a4a2a', stroke: 'none' }) + ftext(150, 42, 'VENUE', { size: 60, fill: '#7a4a2a', stroke: 'none' })) +
      cutout(heroP({ x: CX, y: 1290, s: 1.3, expr: 'joy', armL: [-150 + Math.sin(t * 12) * 20, -120], ph: .4 }, t), 12) + unlock(CX, 980, t, K, { part: 'front', r: 470 }) +
      kthin('bienvenue dans la vie avec', CX, 400, t, at(9, 'bienvenue') - .1, { size: 50 }) + funTag(CX, 478, 'LE SYNDROME DE', t, at(9, 'syndrome') - .1, { size: 38, bg: SX.acc, fg: '#fff' }) +
      kword('GILLES DE LA TOURETTE', CX, 590, t, Gi - .05, { size: 60, fill: SX.acc2 }); },
  sfx: [[0, 'magic', .5], [at(9, 'bienvenue'), 'pop_hi', .4], [at(9, 'syndrome') - .1, 'pop', .5], [at(9, 'gilles') - .05, 'boom', .4], [at(9, 'tourette'), 'tada', .6], [at(9, 'tourette') + .05, 'sparkle', .5]] });

// B010a — « Ton cerveau provoque des mouvements » : salle de contrôle dans la tête, le cerveau appuie sur BRAS → le bras part à l'écran
const O10 = at(10, 'ou') - .12;
const scrHero = (t, o) => rect(418, 558, 604, 344, '#fff1d6', 0, 0) + rect(418, 820, 604, 90, '#c49a6c', 0, 0) + rect(470, 600, 300, 160, '#456b55', 6, 6) + heroP(Object.assign({ x: 760, y: 1000, s: .62, expr: 'neutral' }, o), t) + desk(760, 925, .55);
B(10, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Cv = at(10, 'cerveau'), Pv = at(10, 'provoque'), Mv = at(10, 'mouvements'), press = t > Pv && t < Pv + .5 || t > Mv && t < Mv + .4;
    return touControlRoom(t, scrHero(t, { tics: [[Pv + .1, 'arm'], [Mv + .05, 'arm']], expr: t > Pv + .1 ? 'shock' : 'neutral' })) +
      touButton(700, 1080, 'BRAS', press, '#e2463a') + touButton(920, 1080, 'HM !', false, '#3a5bff') +
      touBrain(240, 980, .95, t, { look: 1 }) + touNeuArm(360, 990, press ? 700 : 600, press ? 1090 : 1030, t) +
      funTag(CX, 400, 'TON CERVEAU', t, Cv - .1, { size: 50, bg: '#ff9ec0', fg: SX.ink, r: -4 }) + kword('MOUVEMENTS', CX, 520, t, Mv - .05, { size: 90, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(10, 'cerveau') - .1, 'pop', .5], [at(10, 'provoque'), 'tick', .6], [at(10, 'provoque') + .1, 'zap', .4], [at(10, 'mouvements') - .05, 'boom', .4], [at(10, 'mouvements'), 'tick', .5]] });
// B010b — « …ou des sons involontaires. » : il appuie sur HM ! → bulle à l'écran ; « pilote automatique »
B(10, { enter: 'none', cam: (t, d) => ({ z: lerp(1.07, 1.12, t / d), hand: .3 }),
  draw: (t, d, T) => { const Sn = at(10, 'sons') - O10, Iv = at(10, 'involontaires') - O10, press = t > Sn && t < Sn + .45;
    return touControlRoom(t, scrHero(t, { tics: [[Iv + .1, 'head']], expr: 'neutral' }) + touSay(620, 640, 'hm !', t, Sn + .1, { size: 40, side: 1 })) +
      touButton(700, 1080, 'BRAS', false, '#e2463a') + touButton(920, 1080, 'HM !', press, '#3a5bff') +
      touBrain(240, 980, .95, t, { look: 1, mood: t > Iv ? 'oops' : '' }) + touNeuArm(360, 990, press ? 920 : 760, press ? 1090 : 1000, t) +
      funTag(CX, 400, 'DES SONS', t, Sn - .1, { size: 50, bg: '#3a5bff', fg: '#fff', r: -4 }) + kword('INVOLONTAIRES', CX, 520, t, Iv - .05, { size: 80, fill: SX.acc2 }) +
      (t > Iv ? op(.5 + .5 * Math.sin(t * 14), G(tr(240, 760), rect(-150, -30, 300, 60, '#e2463a', 12, 5) + ftext(0, 12, 'PILOTE AUTO', { size: 30, fill: '#fff', stroke: 'none' }))) : ''); },
  sfx: [[at(10, 'sons') - O10 - .1, 'pop', .5], [at(10, 'sons') - O10, 'tick', .6], [at(10, 'sons') - O10 + .1, 'hmm', .4], [at(10, 'involontaires') - O10 - .05, 'boom', .5], [at(10, 'involontaires') - O10 + .1, 'error_beep', .3]] }, O10);

// B011 — « On appelle ça des tics. » : couloir de l'école, fiche du dictionnaire TIC (n.m.), DES TICS
B(11, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Tq = at(11, 'tiques');
    const dict = ftext(-170, -60, 'TIC', { size: 64, fill: SX.acc, stroke: 'none', anchor: 'start' }) + ftext(-30, -60, '(n. m.)', { size: 30, fill: '#7d848c', stroke: 'none', anchor: 'start' }) +
      ftext(-170, 10, 'mouvement ou son', { size: 32, fill: OL, stroke: 'none', anchor: 'start' }) + ftext(-170, 54, 'INVOLONTAIRE.', { size: 32, fill: OL, stroke: 'none', anchor: 'start' }) + line(-170, 80, 120, 80, 5, ZIP);
    return hallway(t) + WASH() + heroP({ x: 280, y: 1490, s: 1.3, expr: 'happy', tics: [[Tq - .1, 'arm'], [Tq + .35, 'head']] }, t) +
      card(730, 880, 460, 260, dict, t, Tq - .3, { ry: 0, thick: 10, r: 4, bw: 6 }) +
      kthin('on appelle ça', CX, 430, t, at(11, 'appelle') - .1, { size: 58 }) + kword('DES TICS', CX, 560, t, Tq - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[at(11, 'appelle'), 'pop_hi', .4], [at(11, 'tiques') - .3, 'pop', .5], [at(11, 'tiques') - .05, 'boom', .5], [at(11, 'tiques') - .1, 'zap', .4]] });

// B012a — « Tu peux secouer la tête, hausser les épaules, » : cour d'école, deux cartes-vignettes
const O12 = at(12, 'racler') - .15;
const vign = (bg, svg) => clipR(-180, -190, 360, 330, rect(-180, -190, 360, 330, bg, 0, 0) + svg, 16);
B(12, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Sc = at(12, 'secouer'), Ep = at(12, 'epaules'), Os = at(12, 'oser');
    const c1 = vign('#d6f0ea', heroHead(0, -10, 110, { expr: 'neutral', tics: touRep(Sc + .1, Sc + 1.2, .3, 'head') }, t - .0)) + funTag(0, 190, 'SECOUER LA TÊTE', t, Sc, { size: 28, bg: SX.acc2, fg: SX.ink });
    const c2 = vign('#ffe1b8', heroP({ x: 0, y: 290, s: .85, expr: 'neutral', tics: touRep(Os, Os + 1.2, .35, 'shrug') }, t)) + funTag(0, 190, 'HAUSSER LES ÉPAULES', t, Ep, { size: 26, bg: SX.acc, fg: '#fff' });
    return schoolyard(t) + WASH() + card(290, 830, 400, 420, c1, t, Sc - .15, { ry: 0, thick: 10, r: -4, bw: 6 }) + card(790, 880, 400, 420, c2, t, Os - .15, { ry: 0, thick: 10, r: 4, bw: 6 }) +
      kthin('tu peux…', CX, 440, t, at(12, 'tu') - .05, { size: 60 }); },
  sfx: [[0, 'whoosh', .4], [at(12, 'secouer') - .15, 'pop', .5], [at(12, 'tete'), 'zap', .3], [at(12, 'oser') - .15, 'pop', .5], [at(12, 'epaules'), 'boing', .4]] });
// B012b — « …te racler la gorge ou répéter certains sons. »
B(12, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.03, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Rc = at(12, 'racler') - O12, Rp = at(12, 'repeter') - O12;
    const c1 = vign('#e3e9ff', heroHead(0, -10, 110, { expr: 'neutral', face: t > Rc + .2 ? { mouth: 'o' } : {} }, t) + touSay(70, -150, 'hm-hm !', t, Rc + .2, { size: 30, dur: 2 })) + funTag(0, 190, 'RACLER LA GORGE', t, Rc, { size: 28, bg: '#8fd0ff', fg: SX.ink });
    const c2 = vign('#ffe0ec', heroHead(0, -10, 110, { expr: 'happy', face: { mouth: 'talk' } }, t) + touSay(-80, -150, 'tac !', t, Rp + .15, { size: 30, dur: 3 }) + touSay(90, -120, 'tac !', t, Rp + .4, { size: 30, dur: 3 })) + funTag(0, 190, 'RÉPÉTER DES SONS', t, Rp, { size: 28, bg: '#ff9ec0', fg: SX.ink });
    return schoolyard(t) + WASH() + card(290, 830, 400, 420, c1, t, Rc - .1, { ry: 0, thick: 10, r: -4, bw: 6 }) + card(790, 880, 400, 420, c2, t, Rp - .15, { ry: 0, thick: 10, r: 4, bw: 6 }) +
      kthin('…ou répéter certains sons', CX, 440, t, Rp - .1, { size: 52 }); },
  sfx: [[at(12, 'racler') - O12 - .1, 'pop', .5], [at(12, 'gorge') - O12, 'hmm', .5], [at(12, 'repeter') - O12 - .15, 'pop', .5], [at(12, 'sons') - O12, 'pop_hi', .4]] }, O12);

// B013a — « Et non. Contrairement à ce que Kevin a vu sur Internet, » : Kevin devant une vidéo « piège à clics »
const O13 = at(13, 'tourette') - .15, O13c = at(13, 'crier') - .15;
const clickbait = (t) => rect(-190, -260, 380, 240, '#1d1d26', 8, 0) + rect(-180, -250, 360, 170, '#e2463a', 4, 0) + ftext(0, -190, 'LA VÉRITÉ', { size: 40, fill: '#fff' }) + ftext(0, -130, 'CHOC !!!', { size: 44, fill: '#ffd23f' }) +
  path('M-20 -110L20 -90L-20 -70Z', '#fff', 4) + rect(-180, -66, 260 * ((t * .2) % 1) + 20, 10, '#e2463a', 4, 0) + ftext(120, -36, '12 M vues', { size: 18, fill: '#fff', stroke: 'none' });
B(13, { enter: 'none', trans: 'glitch', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const No = at(13, 'non'), Kv = at(13, 'kevin'), It = at(13, 'internet');
    return bedroomN(t) + WASH() + kevin({ x: 330, y: 1500, s: 1.3, expr: t > It ? 'wow' : 'happy', look: [1, 0], armR: [20, -30], holdR: G(tr(0, -10), path('M-40 0L-30 -70L30 -70L40 0Z', '#ffd23f', 5) + ell(0, -70, 30, 10, '#ffe680', 4)) }, t) +
      G(tr(760, 1330), rect(-260, -30, 520, 40, '#c58e55', 8, 7) + rect(-240, 10, 30, 260, '#8a5a3a', 0, 5) + rect(210, 10, 30, 260, '#8a5a3a', 0, 5)) + touLaptop(760, 1300, 1.0, clickbait(t)) +
      funTag(CX, 440, 'ET NON.', t, at(13, 'et') - .05, { size: 72, bg: SX.acc, fg: '#fff', r: -5 }) + funTag(330, 640, 'KEVIN', t, Kv - .05, { size: 46, bg: '#5fb85f', fg: '#fff' }) +
      markerText('vu sur Internet', 760, 760, t, It, { size: 50 }) + markerArrow(760, 790, 760, 960, t, It + .1, { bend: 30, col: SX.acc2 }); },
  sfx: [[at(13, 'et') - .05, 'pop', .6], [at(13, 'non'), 'thud', .4], [at(13, 'kevin') - .05, 'boing', .4], [at(13, 'internet'), 'scratch', .5], [at(13, 'internet') + .1, 'typing', .3]] });
// B013b — « …Tourette ne veut pas dire » : le héros, calme, fait « non » du doigt devant l'écran ; carte cliché
B(13, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Vt = at(13, 'veut') - O13, Di = at(13, 'dire') - O13;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: bedroomN(t), haze: .25 }, { z: 1, svg: touLaptop(700, 1180, 1.25, clickbait(t) + G(tr(0, -140), rect(-170, -40, 340, 80, '#fff', 10, 5) + ftext(0, 16, 'TOURETTE = ???', { size: 36, fill: OL, stroke: 'none' }))) +
      heroP({ x: 220, y: 1500, s: 1.25, expr: 'smug', armR: [-60, -100 + Math.sin(t * 14) * 15], idle: false }, t) }]) +
      kthin('Tourette', CX, 430, t, 0, { size: 60 }) + kword('NE VEUT PAS DIRE', CX, 560, t, Vt - .05, { size: 76, fill: SX.acc2 }) + (t > Di ? markerCircle(700, 900, 240, 70, t, Di, { col: SX.acc2 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(13, 'veut') - O13 - .05, 'boom', .5], [at(13, 'pas') - O13, 'tick', .4], [at(13, 'dire') - O13, 'scratch', .5]] }, O13);
// B013c — « …crier des insultes toute la journée. » : le cliché dans la tête de Kevin — bulle de symboles bipés, tampon CLICHÉ
B(13, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.03, 1.08, t / d), shake: t > at(13, 'journee') - O13c ? 2 : 0 }),
  draw: (t, d, T) => { const In = at(13, 'insultes') - O13c, Jr = at(13, 'journee') - O13c, k = pop(t, .05, .35);
    const sym = G(tr(0, 0), rect(-230, -70, 460, 140, '#fff', 60, 6) + ftext(-80, 24, '#@!%', { size: 64, fill: '#7d848c', stroke: 'none' }) + (t > In ? G(tr(70, -6, 1, -4), rect(-150, -40, 300, 80, '#1d1d26', 10, 5) + ftext(0, 16, 'BIP !', { size: 48, fill: '#fff', stroke: 'none' })) : ''));
    return bedroomN(t) + WASH('rgba(255,255,255,.1)') + kevin({ x: 280, y: 1500, s: 1.25, expr: t > Jr + .2 ? 'shock' : 'confused', look: [1, -1] }, t) +
      G(tr(640, 860, k), cloud(0, 0, 2.4, '#fff', 7) + circ(-250, 210, 30, '#fff', 6) + circ(-310, 270, 18, '#fff', 5) + G(tr(0, -10, .8), sym) + G(tr(170, 110, .6), wallClock(0, 0, 60, t * 20) + ftext(0, 100, '24 h/24', { size: 40, fill: OL, stroke: 'none' }))) +
      kthin('crier des insultes', CX, 430, t, at(13, 'crier') - O13c - .05, { size: 58 }) + funTag(CX, 560, 'TOUTE LA JOURNÉE ?', t, at(13, 'toute') - O13c - .05, { size: 46, bg: SX.acc2, fg: SX.ink }) +
      stamp(640, 860, 'CLICHÉ', t, Jr + .1, '#e2463a', -10, 110) + cross(640, 860, 1.4, t, Jr + .35); },
  sfx: [[0, 'whoosh', .4], [at(13, 'insultes') - O13c, 'error_beep', .5], [at(13, 'insultes') - O13c + .25, 'error_beep', .4], [at(13, 'toute') - O13c, 'clock_fast', .4], [at(13, 'journee') - O13c + .1, 'thud', .7], [at(13, 'journee') - O13c + .35, 'buzz', .4]] }, O13c);

// B014 — « Ça existe chez une minorité de personnes. » : rue, grand panneau de 40 bonhommes, 2 en émeraude
B(14, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Mn = at(14, 'minorite');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .1 },
      { z: 1, svg: G(tr(CX, 1250), rect(-20, -460, 40, 460, '#8a8f99', 6, 6)) + heroP({ x: 250, y: 1500, s: 1.2, expr: 'calm', look: [0, -1] }, t) + kevin({ x: 840, y: 1500, s: 1.2, expr: t > Mn ? 'shock' : 'confused', look: [0, -1], flip: 1 }, t) },
      { z: .6, svg: blur(10, dBush(1000, 1900, 1.6)) }]) +
      card(CX, 790, 560, 380, touCrowd(t, [12, 29]), t, at(14, 'existe') - .1, { ry: 0, thick: 10, r: -2, bw: 6 }) + (t > Mn ? markerCircle(CX - 196 + 4 * 56, 790 - 112 + 56 - 6, 40, 40, t, Mn, { col: SX.acc2 }) + markerCircle(CX - 196 + 5 * 56, 790 - 112 + 3 * 56 - 6, 40, 40, t, Mn + .1, { col: SX.acc2 }) : '') +
      kthin('ça existe chez', CX, 420, t, at(14, 'existe') - .1, { size: 56 }) + funTag(CX, 520, 'UNE MINORITÉ', t, Mn - .05, { size: 56, bg: SX.acc, fg: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(14, 'existe') - .1, 'pop', .5], [at(14, 'minorite') - .05, 'pop_hi', .6], [at(14, 'minorite'), 'scratch', .4], [at(14, 'personnes'), 'ding', .4]] });

// B015 — « Mais la plupart n'ont pas ce symptôme. » : tous les autres bonhommes passent au vert, Kevin mâchoire au sol
B(15, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.06, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pl = at(15, 'plupart'), Sy = at(15, 'symptome'), ok = seg(t, Pl, Pl + .4);
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .1 },
      { z: 1, svg: G(tr(CX, 1250), rect(-20, -460, 40, 460, '#8a8f99', 6, 6)) + heroP({ x: 250, y: 1500, s: 1.2, expr: 'smug', armL: [200, 250] }, t) + kevin({ x: 840, y: 1500, s: 1.2, expr: t > Pl ? 'jawdrop' : 'shock', flip: 1 }, t) },
      { z: .6, svg: blur(10, dBush(1000, 1900, 1.6)) }]) +
      card(CX, 790, 560, 380, touCrowd(t, [12, 29], ok), t, -1, { ry: 0, thick: 10, r: -2, bw: 6 }) + (t > Pl + .2 ? ftext(CX + 240, 960, '✓', { size: 120, fill: '#7be07b' }) : '') +
      kword('LA PLUPART', CX, 440, t, Pl - .05, { size: 96, fill: SX.acc2 }) + funTag(CX, 580, "N'ONT PAS CE SYMPTÔME", t, Sy - .1, { size: 38, bg: '#7be07b', fg: SX.ink }); },
  sfx: [[at(15, 'plupart') - .05, 'boom', .5], [at(15, 'plupart') + .1, 'magic', .4], [at(15, 'symptome') - .1, 'pop', .5], [at(15, 'symptome') + .2, 'ding', .4]] });

// B016 — « À 12 ans, tu es en classe. » : classe, héros plus grand, copains au fond
B(16, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const A12 = at(16, '12');
    const board = ftext(540, 740, 'HISTOIRE — 1789', { size: 46, fill: 'rgba(255,255,255,.75)', stroke: 'none' });
    return classroomT(t, board) + WASH() + kid(1, { x: 640, y: 1300, s: .72, expr: 'happy' }, t) + desk(640, 1220, .62) + kid(4, { x: 900, y: 1300, s: .72, expr: 'neutral', flip: 1 }, t + 1) + desk(900, 1220, .62) +
      heroP({ x: 300, y: 1490, s: 1.4, expr: 'happy', armR: [40, 10], holdR: touPencil() }, t) + desk(300, 1330, 1.1) +
      funTag(CX, 470, '12 ANS', t, A12 - .1, { size: 96, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 470, t, A12, 6, 180) + kthin('tu es en classe', CX, 620, t, at(16, 'classe') - .3, { size: 56 }); },
  sfx: [[0, 'school_bell', .4], [at(16, '12') - .1, 'pop', .7], [at(16, '12'), 'sparkle', .3], [at(16, 'classe'), 'tick', .4]] });

// B017 — « Tu sens un tic arriver. » : gros plan inquiet, jauge « TIC EN APPROCHE » qui se remplit
B(17, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, eOutCubic(clamp(t / .4))), shake: t > at(17, 'arrive') ? 3 : 0 }),
  draw: (t, d, T) => { const Se = at(17, 'sens'), Ar = at(17, 'arrive'), k = seg(t, Se, Ar + .2), on = Math.sin(t * 18) > 0;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .32 }, { z: 1, svg: heroHead(CX, 1000, 210, { expr: 'worried', idle: false }, t) + touZips(CX, 1000, t, .25 + .5 * k, 270, 6, t * 60) }]) +
      G(tr(CX, 600), rect(-300, -36, 600, 72, '#1d1d26', 36, 6) + rect(-292, -28, 584 * k, 56, mixC('#7be07b', '#e2463a', k), 28, 0) + ftext(0, -60, 'TIC EN APPROCHE', { size: 40, fill: '#fff' }) + ftext(0, 14, Math.round(k * 100) + ' %', { size: 36, fill: '#fff', stroke: 'none' })) +
      (t > Ar ? G(tr(CX, 440), rect(-60, -10, 120, 30, '#3a3f4a', 8, 5) + path('M-44 -10Q-44 -84 0 -84Q44 -84 44 -10Z', on ? '#ff3b30' : '#a02020', 6) + (on ? op(.5, glow(0, -40, 140, '#ff3b30', .8)) : '')) : ''); },
  sfx: [[0, 'whoosh', .4], [at(17, 'sens'), 'heartbeat', .5], [at(17, 'tic'), 'tick', .5], [at(17, 'arrive'), 'siren', .35], [at(17, 'arrive') + .05, 'ding', .4]] });

// B018 — « Tu essaies de le retenir. » : il plaque son bras sur le pupitre (le bras vibre, les éclairs sont étouffés)
B(18, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: 1.08, hand: .2, shake: 2 }),
  draw: (t, d, T) => { const Rt = at(18, 'retenir'), j = Math.sin(t * 60) * 4;
    return classroomT(t) + WASH() + kid(1, { x: 700, y: 1300, s: .72, expr: 'confused', look: [-1, 0] }, t) + desk(700, 1220, .62) +
      G(tr(j, 0), heroP({ x: 360, y: 1490, s: 1.4, expr: 'effort', armR: [60, 20], armL: [60, 0], idle: false }, t)) + desk(360, 1330, 1.1) +
      op(.6, touZips(470, 1250, t, .5, 60, 4, t * 90)) + G(tr(540, 1280), ell(0, 0, 40, 30, SKIN, 6)) +
      kthin('tu essaies de', CX, 440, t, at(18, 'essaies') - .1, { size: 58 }) + kword('LE RETENIR', CX, 580, t, Rt - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'squeak', .4], [at(18, 'essaies'), 'thud', .4], [at(18, 'retenir') - .05, 'boom', .5], [at(18, 'retenir') + .1, 'buzz', .3]] });

// B019 — « C'est un peu comme essayer de ne pas éternuer. » : le fameux « AAAH… », le voisin sort un parapluie
B(19, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.03, 1.1, t / d), hand: .4, r: -2 }),
  draw: (t, d, T) => { const Es = at(19, 'essayer'), Et = at(19, 'eternuer'), k = seg(t, .1, Et);
    const aah = 'AAA' + 'H'.repeat(1 + Math.floor(k * 4)) + '…';
    return classroomT(t) + WASH() + kid(4, { x: 820, y: 1480, s: 1.15, expr: t > Et - .3 ? 'scared' : 'neutral', flip: 1, armL: [-120, -100] }, t) + touUmbrella(760, 980, 1, seg(t, Et - .35, Et), '#ff8fb1') +
      heroP({ x: 330, y: 1490, s: 1.4, expr: 'effort', face: { mouth: 'o', eyes: 'squint' }, headTilt: -12 * k, armR: [-40, -150], idle: false }, t) +
      ftext(330, 800 - k * 20, aah, { size: 44 + k * 22, fill: '#fff' }) +
      kthin("c'est un peu comme", CX, 440, t, at(19, 'peu') - .2, { size: 54 }) + kword('NE PAS ÉTERNUER', CX, 580, t, Et - .05, { size: 64, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(19, 'essayer'), 'whoosh_up', .4], [at(19, 'eternuer') - .35, 'flutter', .5], [at(19, 'eternuer') - .05, 'boom', .4], [at(19, 'eternuer') + .1, 'gasp', .5]] });

// B020 — « Tu te concentres, tu résistes. » : visage tout rouge, joues gonflées, vapeur, manomètre dans le rouge
B(20, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, eOutCubic(clamp(t / .4))), shake: 1 + 3 * seg(t, at(20, 'resistes'), d) }),
  draw: (t, d, T) => { const Cc = at(20, 'concentres'), Rs = at(20, 'resistes'), p = seg(t, 0, d);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .32 }, { z: 1, svg: heroHead(400, 1000, 200, { expr: 'effort', face: { mouth: 'flat', blush: 1 }, burn: .2 + .5 * p, idle: false }, t) +
      steam(230, 900, t, 1.1) + steam(570, 900, t + .3, 1.1) + touGauge(830, 960, 140, .3 + .65 * p, 'PRESSION', t) }]) +
      funTag(CX, 440, 'CONCENTRATION', t, Cc - .1, { size: 48, bg: '#8fd0ff', fg: SX.ink, r: -4 }) + kword('TU RÉSISTES', CX, 590, t, Rs - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(20, 'concentres') - .1, 'pop', .5], [at(20, 'concentres'), 'heartbeat', .5], [at(20, 'resistes') - .05, 'boom', .5], [at(20, 'resistes') + .1, 'sizzle', .5]] });

// B021 — « Le professeur te félicite. » : étoile dorée BRAVO !, le héros encore tout rouge, joues gonflées
B(21, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Fl = at(21, 'felicite');
    return classroomT(t) + WASH() + touProf({ x: 800, y: 1490, s: 1.2, expr: 'joy', flip: 1, armR: [-60, -100], holdR: G(tr(0, -40, 1 + .05 * Math.sin(t * 9)), path('M0 -50L14 -16L50 -14L22 8L32 46L0 24L-32 46L-22 8L-50 -14L-14 -16Z', '#ffd23f', 6)) }, t) +
      heroP({ x: 300, y: 1490, s: 1.35, expr: 'effort', face: { mouth: 'flat', blush: 1 }, burn: .45, idle: false }, t) + desk(300, 1330, 1.05) + confetti(t, Fl, 26) +
      kthin('le professeur', CX, 430, t, at(21, 'professeur') - .1, { size: 58 }) + funTag(690, 600, 'BRAVO !', t, Fl - .05, { size: 70, bg: SX.acc2, fg: SX.ink, r: 5 }) + popStars(690, 600, t, Fl, 6, 200); },
  sfx: [[at(21, 'professeur'), 'pop_hi', .4], [at(21, 'felicite') - .05, 'tada', .6], [at(21, 'felicite'), 'sparkle', .5], [at(21, 'felicite') + .1, 'ding', .3]] });

// B022 — « Tu vois ? Quand tu veux, tu peux. » : Kevin, au premier rang, se retourne en donneur de leçons
B(22, { enter: 'whip', cam: (t, d) => ({ z: 1.07, hand: .4, r: 2 }),
  draw: (t, d, T) => { const Vo = at(22, 'vois'), Qd = at(22, 'quand');
    return classroomT(t) + WASH() + heroP({ x: 280, y: 1490, s: 1.3, expr: 'deadpan', burn: .25, idle: false }, t) + desk(280, 1330, 1.0) +
      kevin({ x: 790, y: 1490, s: 1.3, expr: 'smugger', flip: 1, armR: [-70, -100 + Math.sin(t * 12) * 10] }, t) + desk(790, 1330, 1.0) +
      chatBubble(800, 700, 260, 100, 'TU VOIS ?', t, Vo - .1, false, 44) + kword('QUAND TU VEUX, TU PEUX.', CX, 480, t, Qd - .05, { size: 56, fill: SX.acc2 }); },
  sfx: [[at(22, 'vois') - .1, 'pop', .6], [at(22, 'quand') - .05, 'boom', .4], [at(22, 'peux'), 'ding', .4], [at(22, 'peux') + .2, 'crickets', .3]] });

// B023a — « Ah oui ! Merci… » : le héros, pince-sans-rire, pouce levé
const O23 = at(23, 'dr') - .15;
B(23, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => depth({ zoom: 1 }, [{ z: 1.4, svg: classroomT(t), haze: .32 }, { z: 1, svg: heroHead(CX, 990, 220, { expr: 'deadpan' }, t) + G(tr(820, 1100, eOutBack(seg(t, at(23, 'oui'), at(23, 'oui') + .3))), rect(-40, -20, 80, 90, SKIN, 26, 6) + rect(-18, -90, 36, 80, SKIN, 18, 6)) }]) +
    funTag(CX, 460, 'AH OUI !', t, at(23, 'ah') - .05, { size: 72, bg: SX.acc2, fg: SX.ink, r: -4 }) + kthin('merci…', CX, 620, t, at(23, 'merci') - .1, { size: 60 }),
  sfx: [[at(23, 'ah') - .05, 'pop', .6], [at(23, 'oui'), 'boing', .4], [at(23, 'merci'), 'crickets', .4]] });
// B023b — « …Dr Kevin, spécialiste en neurologie. » : cabinet, Kevin en blouse, diplômes « vu sur Internet »
B(23, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Kv = at(23, 'kevin') - O23, Sp = at(23, 'specialiste') - O23, Nr = at(23, 'neurologie') - O23;
    return touOffice(t) + WASH() + G(tr(780, 1300), rect(-240, -30, 480, 40, '#fff', 8, 7) + rect(-220, 10, 440, 260, '#dfe7ee', 6, 6)) +
      touDrKevin({ x: 420, y: 1490, s: 1.35, expr: 'proud', armR: [-30, -60], holdR: G(tr(0, -30, .6, 180), path('M-40 10Q-50 -30 -10 -36Q10 -50 34 -30Q56 -10 40 16Q20 34 -10 26Q-34 30 -40 10Z', '#ff9ec0', 5)) }, t) +
      kword('DR KEVIN', CX, 470, t, Kv - .05, { size: 110, fill: '#fff' }) + funTag(CX, 610, 'SPÉCIALISTE EN NEUROLOGIE', t, Sp - .05, { size: 34, bg: SX.acc, fg: '#fff', r: -2 }) +
      (t > Nr ? markerCircle(160, 240, 150, 110, t, Nr, { col: SX.acc2 }) + markerText('(Internet)', 300, 760, t, Nr + .1, { size: 44 }) : ''); },
  sfx: [[0, 'flash_hit', .4], [at(23, 'kevin') - O23 - .05, 'tada', .5], [at(23, 'specialiste') - O23 - .05, 'pop', .5], [at(23, 'neurologie') - O23, 'scratch', .5], [at(23, 'neurologie') - O23 + .2, 'rimshot', .6]] }, O23);

// B024a — « Sauf que retenir tes tics peut te demander » : cuisine, le héros assis sur le couvercle d'une cocotte-minute « TICS »
const O24 = at(24, 'enormement') - .15;
B(24, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Rt = at(24, 'retenir'), p = seg(t, 0, d + 1.5) * .7;
    return touKitchen(t) + touCooker(CX, 1180, 1, t, { shake: .5 + p, gauge: p, label: 'TICS' }) + touPuffs(CX + 20, 780, t, 3, 1, .7) +
      heroP({ x: CX, y: 925, s: .9, expr: 'effort', armL: [120, 80], armR: [60, 100], legL: [100, 80], legR: [80, 100], idle: false }, t) +
      kthin('sauf que…', CX, 400, t, at(24, 'sauf') - .05, { size: 54 }) + funTag(CX, 500, 'RETENIR TES TICS', t, Rt - .05, { size: 46, bg: SX.acc, fg: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(24, 'retenir') - .05, 'pop', .5], [at(24, 'tics'), 'sizzle', .4], [at(24, 'demander'), 'squeak', .4]] });
// B024b — « …énormément d'efforts. » : la cocotte tremble, la jauge plonge dans le rouge, ÉNORMÉMENT
B(24, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), shake: 3 + 3 * seg(t, 0, d) }),
  draw: (t, d, T) => { const En = at(24, 'enormement') - O24, Ef = at(24, 'efforts') - O24, p = .7 + .3 * seg(t, 0, d);
    return touKitchen(t) + touCooker(CX, 1180, 1, t, { shake: 2, gauge: p, label: 'TICS' }) + touPuffs(CX + 20, 780, t, 5, 1.6, .8) + touPuffs(CX - 230, 1000, t + .3, 3, 2, .6) + touPuffs(CX + 260, 1000, t + .6, 3, 2, .6) +
      heroP({ x: CX, y: 925, s: .9, expr: 'effort', burn: .4, armL: [120, 80], armR: [60, 100], legL: [100, 80], legR: [80, 100], idle: false }, t) + sweatSpray(CX, 680, t, 6) +
      kword('ÉNORMÉMENT', CX, 410, t, En - .05, { size: 100, fill: SX.acc2 }) + funTag(CX, 520, "D'EFFORTS", t, Ef - .05, { size: 56, bg: '#e2463a', fg: '#fff' }); },
  sfx: [[0, 'whistle', .4], [at(24, 'enormement') - O24 - .05, 'boom', .5], [at(24, 'enormement') - O24 + .2, 'heartbeat', .5], [at(24, 'efforts') - O24, 'sizzle', .5]] }, O24);

// B025 — « Et parfois, dès que tu relâches la pression, il revient. » : il descend, ouf… et le couvercle s'envole — tic !
B(25, { enter: 'none', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), shake: t > at(25, 'revient') && t < at(25, 'revient') + .5 ? 9 : 1 }),
  draw: (t, d, T) => { const Rl = at(25, 'relaches'), Rv = at(25, 'revient'), off = t > Rl, boom = t > Rv, j = eOutCubic(seg(t, Rl - .1, Rl + .25));
    const lift = boom ? 1400 * eOutCubic(seg(t, Rv, Rv + .6)) : 0;
    return touKitchen(t) + touCooker(CX, 1180, 1, t, { shake: off && !boom ? 0 : 1.5, gauge: boom ? .3 : .95, lift, label: 'TICS' }) + (boom ? touPuffs(CX, 880, t, 7, 2.2, 1.3) + touZips(CX, 880, t, 1 - seg(t, Rv + .6, Rv + 1.2), 260, 8, t * 80) : touPuffs(CX + 20, 780, t, 3, 1, .7)) +
      heroP({ x: lerp(CX, 230, j), y: lerp(925, 1490, j), s: lerp(.9, 1.3, j), expr: boom ? 'shock' : off ? 'chill' : 'effort', tics: boom ? [[Rv + .05, 'arm'], [Rv + .4, 'head']] : [], armL: off ? undefined : [120, 80], armR: off ? undefined : [60, 100] }, t) +
      (boom ? touSay(330, 860, 'hm !', t, Rv + .4, { size: 42, side: 1, dur: 1 }) : '') +
      funTag(320, 420, 'ET PARFOIS…', t, at(25, 'parfois') - .1, { size: 50, bg: '#fff', fg: SX.ink, r: -6 }) + kthin('tu relâches la pression', CX, 540, t, Rl - .1, { size: 54, out: Rv - .1 }) +
      kword('IL REVIENT !', CX, 560, t, Rv - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[at(25, 'parfois'), 'pop_hi', .4], [at(25, 'relaches'), 'whoosh', .5], [at(25, 'pression'), 'whistle', .4], [at(25, 'revient') - .05, 'boom', .7], [at(25, 'revient') + .05, 'zap', .5], [at(25, 'revient') + .4, 'hmm', .4]] });

// B026 — « Au cinéma, les gens se retournent. » : salle de ciné vue de derrière ; à « retournent », toutes les têtes pivotent à 180° (hiboux)
B(26, { enter: 'none', trans: 'black', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Cn = at(26, 'cinema'), Rt = at(26, 'retournent');
    const turnHead = (x, y, r, i) => { const k = seg(t, Rt - .1 + i * .04, Rt + .15 + i * .04), sc = Math.abs(Math.cos(k * Math.PI)) * .85 + .15, face = k > .5, hc = KC[(i + 1) % 6], sk = SK[(i + 2) % 6];
      return G(`translate(${x} ${y}) scale(${f1(sc)} 1)`, face ? head({ hr: r, hair: KH[(i + 1) % 6], hairColor: hc, skin: sk, expr: i % 2 ? 'suspicious' : 'shock', seed: 80 + i }, t) : circ(0, 0, r, hc, 6) + circ(-r, 6, r * .2, sk, 5) + circ(r, 6, r * .2, sk, 5)) + (k > 0 && k < 1 ? touArcs(x, y, r * 1.2, -150, -30, 1) : ''); };
    const row1 = [140, 330, 720, 910].map((x, i) => turnHead(x, 800, 48, i)).join('') + touSeats(840, .8, 8, 50);
    const row2 = [110, 320, 760, 970].map((x, i) => turnHead(x, 940, 58, i + 4)).join('') + touSeats(990, .95, 7, 20);
    return touCinema(t) + row1 + row2 + touBackHero(CX, 1080, 1, t) + touSeats(1180, 1.2, 6, -30) + touZips(CX, 1080, t, ticP(t, Cn + .3, .3) + ticP(t, Rt - .3, .3), 120, 5, 0) +
      touSay(CX + 130, 930, 'hm !', t, Cn + .35, { size: 40, side: -1, dur: 1.2 }) +
      funTag(300, 420, 'AU CINÉMA', t, Cn - .1, { size: 52, bg: '#a8203a', fg: '#fff', r: -5 }) + (t > Rt ? kword('SE RETOURNENT', CX, 560, t, Rt - .05, { size: 82, fill: SX.acc2 }) : '') + popStars(CX, 760, t, Rt + .1, 6, 300, ['#fff', SX.acc2]); },
  sfx: [[0, 'whoosh', .4], [at(26, 'cinema') - .1, 'pop', .5], [at(26, 'cinema') + .35, 'hmm', .4], [at(26, 'retournent') - .1, 'squeak', .5], [at(26, 'retournent') - .05, 'whoosh', .5], [at(26, 'retournent') + .2, 'gasp', .5]] });

// B027 — « Dans le bus, on te fixe. » : intérieur de bus, TOUS les passagers fixent le héros (yeux exorbités, regards pointillés)
B(27, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .5 }),
  draw: (t, d, T) => { const Bu = at(27, 'bus'), Fx = at(27, 'fixe'), st = t > Fx - .1;
    const pass = (x, i, sx) => { const px = person({ age: 'adult', x, y: 1420, s: .95, hair: AH[i % 5], hairColor: AC[i % 5], shirt: AS[i % 5], skin: SK[(i + 2) % 6], expr: st ? (i % 2 ? 'jawdrop' : 'shock') : 'neutral', look: st ? [-1, 0] : [0, 0], flip: sx, seed: 90 + i, glasses: i === 2 }, t);
      return px + touBusSeat(x, 1460, 1, ['#3a5bff', '#e2463a', '#3a5bff', '#e2463a'][i]); };
    return touBus(t) + touPole(170, 120, 1250) + pass(560, 0, 1) + pass(780, 1, 1) + pass(1000, 2, 1) +
      heroP({ x: 290, y: 1490, s: 1.25, expr: 'deadpan', armL: [-120, -100], tics: [[Bu + .1, 'head']] }, t) +
      (st ? touGaze(540, 1000, 320, 1060, t, Fx - .1) + touGaze(760, 1000, 340, 1040, t, Fx - .05) + touGaze(980, 1000, 360, 1020, t, Fx) : '') +
      funTag(700, 430, 'DANS LE BUS', t, Bu - .1, { size: 50, bg: '#ffd23f', fg: SX.ink, r: 4 }) + kword('ON TE FIXE', CX, 580, t, Fx - .05, { size: 96, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(27, 'bus') - .1, 'pop', .5], [at(27, 'bus'), 'ding', .3], [at(27, 'fixe') - .1, 'boing', .5], [at(27, 'fixe') + .1, 'crickets', .4]] });

// B028a — « Et quand tu expliques ton syndrome, » : salon, le héros fait un exposé au tableau de conférence, le tonton sur le canapé
const O28b = at(28, 'quelqu') - .15, O28c = at(28, 'mais') - .15;
const flipchart = (t, k) => G(tr(780, 1250), line(-150, 0, -110, -620, 10) + line(150, 0, 110, -620, 10) + rect(-180, -660, 360, 420, '#fff', 8, 7) + ftext(0, -600, 'TOURETTE', { size: 40, fill: SX.acc, stroke: 'none' }) +
  ['• neurologique', '• involontaire', '• pas exprès !'].map((s, i) => op(seg(k, i * .25, i * .25 + .2), ftext(-150, -530 + i * 60, s, { size: 32, fill: OL, stroke: 'none', anchor: 'start' }))).join('') + path('M-140 -320Q-60 -360 0 -320T140 -320', 'none', 6, '#e2463a'));
B(28, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ex = at(28, 'expliques'), Sy = at(28, 'syndrome');
    return salonF(t) + WASH() + flipchart(t, seg(t, Ex, d)) + sofa(260, 1500, .8, '#5ec4a0') + touTonton({ x: 170, y: 1420, s: 1.0, expr: 'deadpan', look: [1, 0] }, t) + adult(3, { x: 360, y: 1420, s: .95, expr: 'neutral', look: [1, 0] }, t + 1) +
      heroP({ x: 560, y: 1490, s: 1.2, expr: 'happy', armR: [-50, -60], holdR: line(0, 0, 90, -120, 9, '#8a5a3a'), flip: 0 }, t) +
      funTag(CX, 440, 'TU EXPLIQUES', t, Ex - .1, { size: 60, bg: SX.acc, fg: '#fff' }) + kthin('ton syndrome', CX, 560, t, Sy - .1, { size: 54 }); },
  sfx: [[0, 'whoosh', .4], [at(28, 'expliques') - .1, 'pop', .5], [at(28, 'expliques') + .2, 'scratch', .4], [at(28, 'syndrome'), 'scratch', .4]] });
// B028b — « …quelqu'un finit toujours par dire » : le tonton lève le doigt ; compteur « déjà entendu » qui s'affole
B(28, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .4 }),
  draw: (t, d, T) => { const Qu = at(28, 'quelqu') - O28b, Tj = at(28, 'toujours') - O28b;
    return salonF(t) + WASH() + sofa(400, 1500, 1.0, '#5ec4a0') + touTonton({ x: 400, y: 1460, s: 1.2, expr: 'smugger', armR: [-80, -100], look: [1, 0] }, t) + emark(560, 830, .5, SX.acc2, 10) +
      card(820, 860, 340, 220, ftext(0, -40, 'DÉJÀ ENTENDU', { size: 30, fill: OL, stroke: 'none' }) + ftext(0, 60, '×' + counter(1, 999, t, Tj, .6), { size: 90, fill: '#e2463a', stroke: 'none' }), t, Tj - .1, { ry: 0, thick: 10, r: 4, bw: 6 }) +
      kthin("quelqu'un finit", CX, 430, t, Qu - .05, { size: 56 }) + funTag(CX, 560, 'TOUJOURS PAR DIRE…', t, Tj - .05, { size: 50, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[at(28, 'quelqu') - O28b, 'pop_hi', .4], [at(28, 'toujours') - O28b - .1, 'pop', .5], [at(28, 'toujours') - O28b, 'slot', .5], [at(28, 'dire') - O28b, 'ding', .4]] }, O28b);
// B028c — « Mais essaie juste de te contrôler. » : gros plan du tonton, très fier de son conseil ; le héros, de marbre
B(28, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, eOutCubic(clamp(t / .4))), shake: t < .3 ? 5 : 0 }),
  draw: (t, d, T) => { const Ct = at(28, 'controler') - O28c;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: salonF(t), haze: .3 }, { z: 1, svg: touTontonHead(700, 1000, 200, { expr: 'smugger', look: [-1, 0] }, t) + heroHead(220, 1080, 140, { expr: 'deadpan', idle: false }, t) }]) +
      chatBubble(560, 560, 820, 200, 'MAIS ESSAIE JUSTE\nDE TE CONTRÔLER !', t, .05, false, 56) + (t > Ct ? markerCircle(220, 1080, 180, 170, t, Ct, { col: SX.acc2 }) + markerText('…ah.', 220, 840, t, Ct + .2, { size: 54 }) : ''); },
  sfx: [[0, 'flash_hit', .4], [.05, 'pop', .6], [at(28, 'controler') - O28c, 'scratch', .6], [at(28, 'controler') - O28c + .3, 'crickets', .4]] }, O28c);

// B029 — « Mais quelle idée de génie ! » : rayons dorés, le tonton couronné de lauriers, ampoule géante, trophée (ironie totale)
B(29, { enter: 'none', trans: 'circle', transD: .22, cam: () => ({ z: 1.06, shake: 2 }),
  draw: (t, d, T) => { const Id = at(29, 'idee'), Gn = at(29, 'genie');
    return rays(t, CX, 1000, SX.acc2, '#ffe680', 22) + touTontonHead(CX, 1000, 200, { expr: 'proud' }, t) +
      G(tr(CX, 790), [-1, 1].map(sd => [0, 1, 2, 3, 4].map(i => ell(sd * (60 + i * 30), 10 - i * 18 + i * i * 4, 26, 12, '#36a85a', 4).replace('<ellipse', `<ellipse transform="rotate(${sd * (20 + i * 15)} ${sd * (60 + i * 30)} ${10 - i * 18 + i * i * 4})"`)).join('')).join('')) +
      G(tr(CX + 300, 760, eOutBack(seg(t, Id - .1, Id + .2))), circ(0, 0, 80, '#fff6a0', 7) + rect(-34, 70, 68, 50, '#9aa3ad', 8, 5) + op(.5, glow(0, 0, 180, '#fff6a0', .8))) +
      G(tr(220, 1180, eOutBack(seg(t, Gn, Gn + .3))), dTrophy(0, 0, 2.2) + G(tr(0, 40), rect(-110, -24, 220, 48, '#fff', 10, 5) + ftext(0, 12, 'PRIX DU GÉNIE', { size: 26, fill: OL, stroke: 'none' }))) + confetti(t, Gn, 30) +
      kthin('mais quelle', CX, 420, t, at(29, 'mais') - .05, { size: 60, fill: SX.ink }) + kword('IDÉE DE GÉNIE !', CX, 560, t, Gn - .1, { size: 88, fill: SX.acc }); },
  sfx: [[0, 'magic', .4], [at(29, 'idee') - .1, 'ding', .6], [at(29, 'genie') - .1, 'boom', .4], [at(29, 'genie'), 'tada', .6], [at(29, 'genie') + .1, 'sparkle', .5]] });

// B030 — « Pourquoi personne n'y avait pensé ? » : congrès de neurologues abasourdis, l'un jette son pavé, l'autre tombe dans les pommes
B(30, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Ps = at(30, 'personne'), Pn = at(30, 'pense'), th = seg(t, Pn - .1, Pn + .5);
    return touOffice(t, { d1: 'NEUROLOGIE', d1b: '20 ans d\'études', d2: 'DOCTORAT', d2b: 'cerveau & tics', d3: 'PRIX', d3b: 'recherche' }) + WASH() +
      touDoc(0, { x: 220, y: 1490, s: 1.1, expr: 'jawdrop', armL: [200, 250] }, t) + touDoc(3, { x: 540, y: 1490, s: 1.1, expr: t > Ps ? 'dizzy' : 'shock', rot: -12 * seg(t, Ps, Ps + .6) }, t + 1) +
      touDoc(4, { x: 860, y: 1490, s: 1.1, expr: 'shock', flip: 1, armR: [-90, -120] }, t + 2) +
      G(tr(lerp(900, 1150, th), lerp(820, 300, th) + th * th * 400, 1, th * 400), rect(-70, -90, 140, 180, '#3a5bff', 8, 6) + rect(-56, -80, 112, 160, '#fff', 4, 0) + ftext(0, -10, 'NEURO', { size: 26, fill: OL, stroke: 'none' }) + ftext(0, 30, '900 p.', { size: 22, fill: OL, stroke: 'none' })) +
      kthin('pourquoi personne', CX, 420, t, at(30, 'pourquoi') - .05, { size: 58 }) + kword("N'Y AVAIT PENSÉ ?!", CX, 560, t, Pn - .1, { size: 74, fill: SX.acc2 }); },
  sfx: [[at(30, 'pourquoi'), 'pop_hi', .4], [at(30, 'personne'), 'gasp', .5], [at(30, 'pense') - .1, 'boom', .4], [at(30, 'pense'), 'whoosh', .4], [at(30, 'pense') + .4, 'thud', .5]] });

// B031 — « Le pire, ce n'est même pas toujours le tic. » : cour d'école, le héros serein, le tic = un petit éclair entouré
B(31, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pi = at(31, 'pire'), Tc = at(31, 'tic');
    return schoolyard(t) + WASH() + heroP({ x: 380, y: 1490, s: 1.35, expr: 'calm', tics: [[Tc - .1, 'arm'], [Tc + .5, 'arm']] }, t) +
      (t > Tc ? markerCircle(560, 1080, 130, 120, t, Tc, { col: SX.acc2 }) + funTag(780, 960, 'LE TIC', t, Tc, { size: 48, bg: SX.acc2, fg: SX.ink, r: 6 }) + markerText('pas le pire.', 780, 1080, t, Tc + .25, { size: 40 }) : '') +
      kword('LE PIRE', CX, 450, t, Pi - .05, { size: 110, fill: SX.acc2 }) + kthin("ce n'est même pas toujours", CX, 600, t, at(31, 'meme') - .2, { size: 50 }); },
  sfx: [[at(31, 'pire') - .05, 'boom', .5], [at(31, 'meme'), 'pop_hi', .4], [at(31, 'tic') - .1, 'zap', .4], [at(31, 'tic'), 'scratch', .5], [at(31, 'tic') + .25, 'pop', .4]] });

// B032 — « C'est de devoir justifier des mouvements que tu n'as pas choisis. » : TRIBUNAL ! le juge tape du marteau, le jury (prof, tonton…) suspicieux
B(32, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Dv = at(32, 'devoir'), Js = at(32, 'justifier'), Mv = at(32, 'mouvements'), Ch = at(32, 'choisi');
    const gk = Math.max(ticP(t, Dv, .25), ticP(t, Js, .25));
    return touCourt(t) + adult(4, { x: 540, y: 1150, s: 1.0, hair: 'bald', hairColor: '#d9d9de', shirt: '#1d1d26', expr: 'suspicious', glasses: true, armR: [-60, -80], holdR: touGavel(gk) }, t) +
      G(tr(540, 1000), rect(-260, -160, 520, 300, '#7a5230', 12, 7) + rect(-240, -140, 480, 30, '#8a6240', 6, 4) + G(tr(0, 0), circ(0, 0, 40, '#ffd23f', 6))) +
      touProfHead(110, 990, 62, { expr: 'suspicious', look: [1, 0] }, t) + touTontonHead(250, 1000, 62, { expr: 'smugger', look: [1, 0] }, t) + G(tr(180, 1200), rect(-170, -150, 340, 220, '#7a5230', 10, 7)) +
      heroP({ x: 870, y: 1420, s: 1.2, expr: 'worried', flip: 1, tics: [[Mv, 'arm'], [Mv + .35, 'head']] }, t) + G(tr(870, 1330), rect(-170, -130, 340, 260, '#7a5230', 10, 7)) +
      kword('JUSTIFIER', CX, 430, t, Js - .05, { size: 104, fill: SX.acc2 }) + kthin('des mouvements', CX, 545, t, Mv - .1, { size: 50 }) + stamp(CX, 630, 'PAS CHOISIS', t, Ch - .05, SX.acc, -8, 64); },
  sfx: [[at(32, 'devoir'), 'hammer', .6], [at(32, 'justifier'), 'hammer', .6], [at(32, 'justifier') - .05, 'boom', .3], [at(32, 'mouvements'), 'zap', .4], [at(32, 'choisi') - .05, 'thud', .7]] });

// B033a — « Alors que toi, tu voudrais juste » : resto entre potes, le héros raconte (bulle avec un dino en skate)
const O33 = at(33, 'ecoute') - .25;
const dinoSk = (t) => G(tr(0, 0, 1, Math.sin(t * 4) * 6), ell(0, 0, 90, 50, '#7be07b', 5) + circ(80, -50, 40, '#7be07b', 5) + circ(92, -58, 7, OL, 0) + path('M-90 0L-150 -20L-90 20Z', '#7be07b', 5) + [-50, -20, 10, 40].map(x => path(`M${x} -46L${x + 12} -70L${x + 24} -46Z`, '#ffd23f', 4)).join('') +
  rect(-100, 56, 200, 18, '#e2463a', 9, 5) + circ(-70, 84, 12, OL, 0) + circ(70, 84, 12, OL, 0));
B(33, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Tv = at(33, 'toi'), Vd = at(33, 'voudrais');
    return restoT(t, { diners: false }) + heroP({ x: 250, y: 1440, s: 1.25, expr: 'joy', face: { mouth: 'talk' }, armL: [200, 160 + Math.sin(t * 8) * 20], armR: [-20, -50] }, t) +
      kid(1, { x: 560, y: 1440, s: 1.2, expr: 'neutral', look: [-1, 0] }, t) + kevin({ x: 840, y: 1440, s: 1.2, expr: 'neutral', flip: 1 }, t) + touTable(540, 1300, 900) +
      G(tr(400, 760, pop(t, Vd - .1, .35)), cloud(0, 0, 1.6, '#fff', 7) + G(tr(10, 10, .7), dinoSk(t))) +
      kthin('alors que toi,', CX, 420, t, at(33, 'alors') - .1, { size: 56 }) + kword('TU VOUDRAIS JUSTE', CX, 550, t, Vd - .05, { size: 70, fill: SX.acc2 }); },
  sfx: [[at(33, 'alors'), 'pop_hi', .4], [at(33, 'toi'), 'tick', .4], [at(33, 'voudrais') - .1, 'pop', .5], [at(33, 'juste'), 'magic', .4]] });
// B033b — « …qu'on écoute ce que tu dis. » : tout le monde se penche, captivé ; CE QUE TU DIS
B(33, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.09, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ec = at(33, 'ecoute') - O33, Ds = at(33, 'dis') - O33;
    return restoT(t, { diners: false }) + heroP({ x: 250, y: 1440, s: 1.25, expr: 'joy', face: { mouth: 'talk' }, armL: [200, 140], armR: [-30, -70] }, t) +
      kid(1, { x: 560, y: 1440, s: 1.2, expr: t > Ec ? 'wow' : 'happy', look: [-1, 0], rot: -8 }, t) + kevin({ x: 840, y: 1440, s: 1.2, expr: t > Ec ? 'love' : 'happy', flip: 1, rot: 8 }, t) + touTable(540, 1300, 900) +
      G(tr(400, 760), cloud(0, 0, 1.6, '#fff', 7) + G(tr(10, 10, .7), dinoSk(t))) + (t > Ec ? heartsUp(t, 700, 1000, 4) : '') +
      kthin("qu'on écoute", CX, 420, t, Ec - .05, { size: 58 }) + kword('CE QUE TU DIS', CX, 560, t, Ds - .1, { size: 92, fill: SX.acc2 }); },
  sfx: [[at(33, 'ecoute') - O33 - .05, 'pop_hi', .5], [at(33, 'ecoute') - O33 + .1, 'magic', .4], [at(33, 'dis') - O33 - .1, 'boom', .4], [at(33, 'dis') - O33, 'ding', .5]] }, O33);

// B034 — FIN : « Pas chaque bruit que tu fais. » : une petite bulle « hm ! » s'échappe… Kevin l'éclate du doigt sans même regarder,
//          et tout le monde continue d'écouter l'histoire. Débloqué en étoiles (3/3), phrase finale en gros.
B(34, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ch = at(34, 'chaque'), Br = at(34, 'bruit'), Fa = at(34, 'fais'), popT = Fa + .1;
    const bx = lerp(330, 760, seg(t, Br, popT)), by = lerp(860, 900, seg(t, Br, popT)) - Math.sin(seg(t, Br, popT) * Math.PI) * 120;
    return restoT(t, { diners: false }) + unlock(400, 800, t, Ch, { part: 'back', r: 420 }) +
      heroP({ x: 250, y: 1440, s: 1.25, expr: 'joy', face: { mouth: 'talk' }, armL: [200, 150], armR: [-30, -70], tics: [[Br - .1, 'head']] }, t) +
      kid(1, { x: 560, y: 1440, s: 1.2, expr: 'wow', look: [-1, 0], rot: -8 }, t) + kevin({ x: 840, y: 1440, s: 1.2, expr: 'love', flip: 1, rot: 8, armL: t > Fa - .1 ? [-130, -150] : [110, 100] }, t) + touTable(540, 1300, 900) +
      G(tr(400, 760), cloud(0, 0, 1.6, '#fff', 7) + G(tr(10, 10, .7), dinoSk(t))) +
      (t > Br && t < popT ? G(tr(bx, by), circ(0, 0, 56, 'rgba(255,255,255,.85)', 5) + ftext(0, 12, 'hm !', { size: 32, fill: SX.ink, stroke: 'none' })) : '') +
      (t >= popT ? popStars(760, 900, t, popT, 6, 110, ['#fff', SX.acc2]) + op(1 - seg(t, popT, popT + .5), ftext(760, 820, 'pop', { size: 44, fill: '#fff' })) : '') +
      unlock(400, 800, t, Ch, { part: 'front', r: 360 }) +
      kword('PAS CHAQUE BRUIT', CX, 440, t, Ch - .1, { size: 80, fill: SX.acc2 }) + kthin('que tu fais.', CX, 580, t, Fa - .15, { size: 64 }); },
  sfx: [[0, 'flash_hit', .4], [at(34, 'chaque') - .1, 'boom', .5], [at(34, 'chaque'), 'sparkle', .5], [at(34, 'bruit'), 'pop_hi', .4], [at(34, 'fais') + .1, 'pop', .6], [at(34, 'fais') + .3, 'tada', .4]] });

SCENES.sort((a, b) => a.s - b.s);
