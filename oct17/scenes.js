// ============================================================
//  « Voici la journée qui a secoué la France — 17 octobre 2026 » — CHRONIQUE D'ACTUALITÉ 9:16, style SIZEX (Fredoka) adapté à l'info
//  Ton sérieux « flash info » : pas de gags, cartoon pudique (flammes stylisées, fumée, gaz = nuages, vitres = étoiles de fissure, aucun blessé).
//  Bandeau JT (FLASH INFO + heure + ville), carte de France avec épingles, plan de Paris pour le cortège, compteurs.
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
const zin = (a = 1, b = 1.12, hand = 0) => (t, d) => ({ z: lerp(a, b, eInOut(clamp(t / d))), hand });

sxFun('#e8263a'); SX.acc2 = '#ffd23f'; SX.cool = '#2f6fd8';
const M = 700, RED = '#e8263a', NAVY = '#14182b', BLUE = '#2f6fd8';
const DPAL = ['#e2463a', '#5b8fd8', '#ffd23f', '#36a85a', '#ff8fb1', '#8a6ad8', '#ff9a4d', '#5ec4f0'];

// ============================================================
//  HABILLAGE « JT »
// ============================================================
function oClock(x, y, r, mins, o = {}) { const ah = R(mins / 720 * 360 - 90), am = R((mins % 60) * 6 - 90);
  return circ(x, y, r, o.bg || '#fff', o.sw ?? 5) + (o.ticks ? Array.from({ length: 12 }, (_, i) => { const a = R(i * 30); return line(x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8, x + Math.cos(a) * r * .92, y + Math.sin(a) * r * .92, i % 3 ? 4 : 8); }).join('') : '') +
    line(x, y, x + Math.cos(ah) * r * .5, y + Math.sin(ah) * r * .5, r * .12 + 2) + line(x, y, x + Math.cos(am) * r * .78, y + Math.sin(am) * r * .78, r * .07 + 2, o.mc || OL) + circ(x, y, r * .08 + 2, OL, 0); }
// bandeau du haut : FLASH INFO (point qui clignote) + heure (horloge qui tourne à l'entrée) + ville. Tout entre x 175 et 910, y ≈ 300.
function oHud(t, time, city, o = {}) {
  const t0 = o.t0 ?? 0, k = popEl(t, t0, .5); if (k <= 0) return ''; const y = o.y || 300; let s = '';
  const blink = Math.sin(t * 9) > 0;
  s += G(tr(300, y, k), rect(-125 + 6, -34 + 8, 250, 68, OL, 34, 0) + rect(-125, -34, 250, 68, RED, 34, 6) + circ(-92, 0, 11, blink ? '#fff' : '#ff9a9a', 0) + ftext(14, 12, 'FLASH INFO', { size: 32, fill: '#fff', stroke: 'none' }));
  if (time) { const mm = o.min ?? 0, sp = o.spin ? (1 - eOutCubic(seg(t, t0, t0 + .8))) * 600 : 0, sz = Math.min(36, 175 / (time.length * .6));
    s += G(tr(560, y, k), rect(-120 + 6, -34 + 8, 240, 68, OL, 16, 0) + rect(-120, -34, 240, 68, '#fff', 16, 6) + oClock(-80, 0, 24, mm - sp, { sw: 4 }) + ftext(24, sz * .36, time, { size: sz, fill: NAVY, stroke: 'none' })); }
  if (city) s += G(tr(805, y, k, -3), rect(-105 + 6, -34 + 8, 210, 68, OL, 34, 0) + rect(-105, -34, 210, 68, SX.acc2, 34, 6) + ftext(0, 12, city, { size: city.length > 8 ? 27 : 34, fill: NAVY, stroke: 'none' }));
  return s;
}
// tag « nom » (lieu / personne) : étiquette sobre blanche + liseré rouge
function oTag(x, y, str, t, t0, o = {}) { const k = popEl(t, t0, .5); if (k <= 0) return ''; const sz = o.size || 44, w = str.length * sz * .6 + sz * 1.3, h = sz * 1.6;
  return G(tr(x, y, k, o.r ?? -2), rect(-w / 2 + 8, -h / 2 + 10, w, h, OL, 14, 0) + rect(-w / 2, -h / 2, w, h, o.bg || '#fff', 14, 6) + rect(-w / 2, -h / 2, 22, h, o.bar || RED, 0, 0) + rect(-w / 2, -h / 2, w, h, 'none', 14, 6) + ftext(11, sz * .36, str, { size: sz, fill: o.fg || NAVY, stroke: 'none' })); }
// gros chiffre dans une carte
function oNumCard(x, y, str, label, t, t0, o = {}) { const k = popEl(t, t0, .55); if (k <= 0) return ''; const w = o.w || 640, h = o.h || 300;
  return G(tr(x, y, k, o.r ?? 0), rect(-w / 2 + 12, -h / 2 + 16, w, h, OL, 30, 0) + rect(-w / 2, -h / 2, w, h, o.bg || '#fff', 30, 7) + rect(-w / 2, -h / 2, w, 70, o.top || RED, 30, 0) + rect(-w / 2, -h / 2 + 40, w, 30, o.top || RED, 0, 0) + rect(-w / 2, -h / 2, w, h, 'none', 30, 7) +
    ftext(0, -h / 2 + 50, label, { size: 36, fill: '#fff', stroke: 'none' }) + ftext(0, h * .3, str, { size: o.size || 150, fill: o.fg || NAVY, stroke: 'none' })); }
// éclats sobres (flash rouge/blanc) — remplace l'« unlock » étoilé pour l'info
function oShards(x, y, t, t0, o = {}) { const k = seg(t, t0, t0 + .9); if (t < t0 || k >= 1) return ''; const n = o.n || 14, r = o.r || 420; let s = '';
  const fl = 1 - seg(t, t0, t0 + .22); if (fl > 0) s += op(fl * .7, circ(x, y, r * .8 * eOutCubic(seg(t, t0, t0 + .22)), '#fff', 0));
  for (let i = 0; i < n; i++) { const a = i / n * 6.283 + (i % 3) * .3, d = r * (.2 + (.8 + .4 * ((i * 37) % 10) / 10) * eOutCubic(k)), c = i % 3 ? RED : '#fff';
    s += op(1 - k, G(tr(x + Math.cos(a) * d, y + Math.sin(a) * d, 1 - k * .4, a * 57 + k * 200), path('M0 -26L12 18L-12 14Z', c, 4))); }
  return s; }
// bande « BREAKING » qui défile
function oBreaking(y, t, t0, str = 'BREAKING  •  FLASH INFO  •  17 OCTOBRE  •  ') { const k = eOutCubic(seg(t, t0, t0 + .35)); if (k <= 0) return '';
  let tx = ''; for (let i = 0; i < 4; i++) tx += ftext(-((t * 160) % 1400) + i * 1400 - 300, y + 14, str, { size: 38, fill: '#fff', stroke: 'none', anchor: 'start' });
  return G(`translate(${f1((1 - k) * -W)} 0)`, rect(-M, y - 34, W + 2 * M, 68, RED, 0, 0) + line(-M, y - 34, W + M, y - 34, 6) + line(-M, y + 34, W + M, y + 34, 6) + tx); }

// ============================================================
//  PERSONNAGES (génériques : cagoulés, CRS, pompiers, manifestants, silhouettes)
// ============================================================
const HSHIRT = ['#2a2d36', '#3a3340', '#23303a', '#33363f'], HHOOD = ['#1b1d24', '#2b2630', '#1c252d', '#26282e'];
const balaclava = col => (r, t) => [ell(0, r * .1, r * 1.16, r * 1.12, col, 6), `<path fill-rule="evenodd" d="M${f1(-r * 1.03)} 0A${f1(r * 1.03)} ${f1(r * 1.03)} 0 1 1 ${f1(r * 1.03)} 0A${f1(r * 1.03)} ${f1(r * 1.03)} 0 1 1 ${f1(-r * 1.03)} 0ZM${f1(-r * .66)} ${f1(-r * .22)}Q0 ${f1(-r * .34)} ${f1(r * .66)} ${f1(-r * .22)}L${f1(r * .62)} ${f1(r * .2)}Q0 ${f1(r * .3)} ${f1(-r * .62)} ${f1(r * .2)}Z" fill="${col}" stroke="${OL}" stroke-width="6"/>` + path(`M${f1(-r * .5)} ${f1(-r * .75)}Q0 ${f1(-r * .9)} ${f1(r * .5)} ${f1(-r * .75)}`, 'none', 4, 'rgba(255,255,255,.12)')];
const oHooded = (i, o, t) => person(Object.assign({ age: 'adult', hairFn: balaclava(HHOOD[i % 4]), shirt: HSHIRT[i % 4], pants: '#1a1c22', shoes: '#111', expr: 'neutral', face: { mouth: 'none', brows: 'flat' }, cheeks: false, seed: 30 + i }, o), t);
const helmet = (col, visor = 1) => (r, t) => ['', path(`M${f1(-r * 1.1)} ${f1(-r * .02)}A${f1(r * 1.1)} ${f1(r * 1.14)} 0 0 1 ${f1(r * 1.1)} ${f1(-r * .02)}L${f1(r * 1.1)} ${f1(r * .1)}L${f1(-r * 1.1)} ${f1(r * .1)}Z`, col, 6) + path(`M${f1(-r * .9)} ${f1(-r * .65)}Q0 ${f1(-r * 1.0)} ${f1(r * .9)} ${f1(-r * .65)}`, 'none', 5, 'rgba(255,255,255,.25)') +
  (visor ? path(`M${f1(-r * .95)} ${f1(r * .05)}L${f1(r * .95)} ${f1(r * .05)}Q${f1(r * .9)} ${f1(r * .62)} 0 ${f1(r * .7)}Q${f1(-r * .9)} ${f1(r * .62)} ${f1(-r * .95)} ${f1(r * .05)}Z`, 'rgba(150,195,235,.33)', 5) + line(-r * .6, r * .2, -r * .2, r * .5, 4, 'rgba(255,255,255,.5)') : '')];
function oShield(x, y, s, flip = 0) { return G(tr(x, y, s, flip ? 4 : -4), rect(-78, -130, 156, 260, 'rgba(36,48,78,.55)', 20, 6) + rect(-62, -114, 124, 228, 'none', 12, 3, 'rgba(255,255,255,.35)') + ftext(0, -66, 'POLICE', { size: 30, fill: '#fff', stroke: 'none' }) + rect(-50, -40, 100, 10, 'rgba(255,255,255,.3)', 4, 0)); }
function oCrs(o, t) { const s = o.s || 1, x = o.x || 0, y = o.y || 0, fl = o.flip ? -1 : 1;
  return person(Object.assign({ age: 'adult', hairFn: helmet('#1d2742'), shirt: '#24305a', pants: '#192038', shoes: '#111', expr: 'deadpan', face: { brows: 'flat', mouth: 'flat' }, armL: [120, 60], armR: [60, 120], seed: 50 }, o), t) + (o.noShield ? '' : oShield(x + 26 * s * fl, y - 190 * s, s, o.flip)); }
const oPompier = (o, t) => person(Object.assign({ age: 'adult', hairFn: helmet('#e8b923', 0), shirt: '#1f2b48', pants: '#1f2b48', shoes: '#111', expr: 'worried', face: { mouth: 'flat' }, seed: 70 }, o), t);
const AH = ['side', 'bun', 'short', 'long', 'curly', 'ponytail'], AC = ['#1f1a18', '#8a5a3a', '#3a2a20', '#c4521b', '#2b2420', '#e0a040'], AS = ['#5b8fd8', '#e2463a', '#36a85a', '#ff9a4d', '#8a6ad8', '#2fa3a0'], SKS = ['#f2c9a0', '#c98a5e', '#f6d7b8', '#8a5a3a', '#e0b088', '#f2c9a0'];
const oCivil = (i, o, t) => person(Object.assign({ age: 'adult', hair: AH[i % 6], hairColor: AC[i % 6], shirt: AS[i % 6], skin: SKS[i % 6], pants: '#2f3b4e', seed: 60 + i, glasses: i % 4 === 1 }, o), t);
const oCivilHead = (i, x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: AH[i % 6], hairColor: AC[i % 6], skin: SKS[i % 6], seed: 60 + i, glasses: i % 4 === 1 }, o), t));
// silhouette simple (foule lointaine) : tête + buste, couleur unie, petit balancement
function oCrowd(x0, x1, yb, s, t, col, seed = 1, o = {}) { const r = rng(seed); let g = ''; const step = 70 * s;
  for (let x = x0; x < x1; x += step * (.7 + r() * .5)) { const b = wave(t, 1.4 + r(), 6 * s, r()), hh = (1 + (r() - .5) * .2) * s, xx = x + (o.walk ? (t * o.walk) % step : 0);
    g += G(tr(xx, yb + b, hh), path('M-46 0L-40 -110Q0 -140 40 -110L46 0Z', col, 0) + circ(0, -150, 34, col, 0) + (o.flags && r() < .18 ? line(26, -120, 34, -300, 6, '#555') + path(`M34 -300L${f1(110 + wave(t, 1.6, 10, x))} -280L34 -240Z`, ['#ffffff', '#5b8fd8', RED][Math.floor(r() * 3)], 4) : '')); }
  return g; }
// homme en costume vu de dos / de loin (aucun visage)
function oSuitBack(x, y, s, o = {}) { return G(tr(x, y, s), rect(-46, -230, 38, 230, '#151a26', 10, 5) + rect(8, -230, 38, 230, '#151a26', 10, 5) + path('M-80 -220L-70 -470Q0 -500 70 -470L80 -220Z', o.suit || '#1d2436', 6) + line(-80, -440, -96, -250, 30, OL) + line(-80, -440, -96, -250, 20, o.suit || '#1d2436') + line(80, -440, 96, -250, 30, OL) + line(80, -440, 96, -250, 20, o.suit || '#1d2436') +
  circ(-74, -520, 14, SKIN, 5) + circ(74, -520, 14, SKIN, 5) + circ(0, -540, 70, SKIN, 6) + path('M-71 -530A71 71 0 0 1 71 -530Q60 -490 0 -485Q-60 -490 -71 -530Z', o.hair || '#6d6a68', 6) + rect(-24, -480, 48, 20, SKIN, 6, 0)); }

// ============================================================
//  EFFETS SOBRES : fumée, flammes, gaz, fissures, projectiles, gyrophares
// ============================================================
function oSmoke(x, y, t, s = 1, n = 7, col = '#4a4550', seed = 1, wind = 1) { let g = ''; for (let i = 0; i < n; i++) { const k = (t * .3 + i / n + seed * .13) % 1, px = x + Math.sin(k * 3 + i) * 40 * s + k * 160 * s * wind, py = y - k * 720 * s, rr = (40 + k * 140) * s; g += op((1 - k) * .8, circ(px, py, rr, col, 0)); } return blurPx(5, g); }
function oFire(x, yb, w, h, t, seed = 1, o = {}) { return op(.5, glow(x, yb - h * .4, w * .9 + 40, '#ff9a3c', .5)) + (o.smoke === false ? '' : oSmoke(x, yb - h * .8, t, w / 220, 6, o.smokeCol || '#4a4550', seed, o.wind ?? 1)) + flames(x - w / 2, yb, w, h, t, seed); }
function oEmbers(x, y, t, n = 10, w = 200, seed = 3) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const k = (t * (.6 + r() * .5) + r()) % 1; s += op(1 - k, circ(x + (r() - .5) * w + Math.sin(k * 6 + i) * 30, y - k * 500, 6 * (1 - k) + 2, i % 2 ? '#ffd23f' : '#ff7a1a', 0)); } return s; }
function oGas(x, y, t, k, seed = 1, sz = 1, col = '#bfc8a8') { if (k <= 0) return ''; const r = rng(seed); let g = ''; for (let i = 0; i < 12; i++) { const a = r() * 6.28, d = (60 + r() * 220) * k * sz, rr = (60 + r() * 90) * (.3 + .7 * k) * sz; g += circ(x + Math.cos(a) * d + wave(t, .3, 20, i), y + Math.sin(a) * d * .6 - k * 60 * r(), rr, i % 3 ? col : shade(col, -.12), 0); } return op(.82, blurPx(7, g)); }
function oCanister(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-16, -36, 32, 72, '#6b7a5a', 8, 5) + rect(-16, -36, 32, 14, '#d9c34a', 4, 4)); }
function oCrack(x, y, s, k, seed = 1) { if (k <= 0) return ''; const r = rng(seed); let g = ''; const n = 9;
  for (let i = 0; i < n; i++) { const a = i / n * 6.283 + r() * .4, L = (90 + r() * 120) * k; let d = 'M0 0', px = 0, py = 0; for (let j = 1; j <= 3; j++) { px = Math.cos(a + (r() - .5) * .4) * L * j / 3; py = Math.sin(a + (r() - .5) * .4) * L * j / 3; d += `L${f1(px)} ${f1(py)}`; } g += path(d, 'none', 7, 'rgba(43,36,32,.6)') + path(d, 'none', 3, '#fff'); }
  if (k > .5) { let d = ''; for (let i = 0; i <= n; i++) { const a = i / n * 6.283, rr = 60 * k; d += (i ? 'L' : 'M') + f1(Math.cos(a) * rr) + ' ' + f1(Math.sin(a) * rr); } g += path(d, 'none', 3, '#fff'); }
  return G(tr(x, y, s), g + circ(0, 0, 10, '#fff', 3)); }
function oRock(x, y, s, r = 0, c = '#8a8f99') { return G(tr(x, y, s, r), path('M-24 -6L-12 -24L14 -22L26 -2L16 20L-14 22Z', c, 5) + line(-6, -10, 8, -4, 3, 'rgba(255,255,255,.4)')); }
function oBottle(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-14, -30, 28, 56, '#5aa06a', 8, 5) + rect(-6, -48, 12, 20, '#5aa06a', 3, 4)); }
function oGyro(x, y, t, s = 1, ph = 0) { const on = Math.sin(t * 14 + ph) > 0; return G(tr(x, y, s), (on ? op(.55, glow(0, 0, 90, '#5aa0ff', .8)) : '') + rect(-26, -16, 52, 28, on ? '#7fb8ff' : '#2a4a8a', 10, 5)); }
function oCuffs(x, y, s, r = 0) { return G(tr(x, y, s, r), circ(-40, 0, 34, 'none', 16, OL) + circ(-40, 0, 34, 'none', 9, '#c8ced6') + circ(40, 0, 34, 'none', 16, OL) + circ(40, 0, 34, 'none', 9, '#c8ced6') + line(-8, 0, 8, 0, 10)); }

// ============================================================
//  DÉCORS (ciel, façades par ville, rue, accessoires urbains)
// ============================================================
const SKYC = { dawn: ['#34477f', '#f5b39a'], day: ['#7fc0ee', '#e6f3fb'], warm: ['#86c0ea', '#ffe0b4'], late: ['#6f9fd8', '#ffd0a0'], dusk: ['#33285e', '#ff8a5a'], night: ['#070b22', '#1f2a5a'] };
const SKYFAR = { dawn: '#6a6f9a', day: '#b7cde0', warm: '#c6cfd8', late: '#a8b6cf', dusk: '#4a3a6a', night: '#141b3e' };
const dHaze = (k = .35, col = '230,240,250', y1 = 1300) => rect(-M, -M, W + 2 * M, y1 + M, `rgba(${col},${k})`, 0, 0);
function dBird(x, y, s, t, ph = 0) { const f = Math.sin(t * 10 + ph) * 14; return G(tr(x, y, s), path(`M-30 ${f1(-f)}Q-14 -6 0 4Q14 -6 30 ${f1(-f)}`, 'none', 6)); }
const dBirds = (t, n = 3, y = 300, seed = 1) => { let s = ''; for (let i = 0; i < n; i++) s += dBird(((t * (50 + i * 12) + i * 420 + seed * 200) % 1700) - 300, y + i * 46 + Math.sin(t * 2 + i) * 14, .7 - i * .1, t, i * 2); return s; };
function oSky(t, mode = 'day') { const [a, b] = SKYC[mode]; let s = grad(a, b, -M, -M, W + 2 * M, 1900 + M);
  if (mode === 'night') { for (let i = 0; i < 40; i++) s += circ((i * 197) % 1600 - 260, (i * 89) % 900 - 100, 3 + (i % 3), '#fff', 0).replace('/>', ` opacity="${f1(.4 + .4 * Math.sin(t * 3 + i))}"/>`); s += circ(860, 260, 56, '#fff6d6', 0) + circ(884, 248, 50, a, 0); }
  if (mode === 'dawn') s += op(.7, glow(760, 1050, 420, '#ffcf8a', .7)) + circ(760, 1080, 110, '#ffd98a', 0);
  if (mode === 'dusk') s += op(.8, glow(260, 980, 460, '#ffb36a', .7)) + circ(260, 1000, 130, '#ffc27a', 0);
  if (mode === 'day' || mode === 'warm' || mode === 'late') s += circ(900, 200, 64, '#fff3b0', 0) + op(.35, circ(900, 200, 110, '#fff3b0', 0));
  const cc = mode === 'night' ? 'rgba(80,90,140,.5)' : mode === 'dusk' ? 'rgba(255,170,150,.6)' : mode === 'dawn' ? 'rgba(255,200,190,.7)' : '#fff';
  s += cloud(((t * 26) % 1700) - 300, 230, 1.2, cc) + cloud(((t * 16 + 800) % 1800) - 300, 430, .85, cc) + cloud(((t * 10 + 1300) % 1900) - 300, 140, .7, cc);
  if (mode === 'day' || mode === 'warm' || mode === 'late') s += dBirds(t, 3, 330);
  return s; }
function dSkyline(yb, col, seed = 3, win = 'rgba(255,255,255,.35)') { const r = rng(seed); let s = '', x = -M; while (x < W + M) { const w = 120 + r() * 140, h = 280 + r() * 380; s += rect(x, yb - h, w, h, col, 0, 0); if (r() < .4) s += rect(x + w * .4, yb - h - 50, 10, 50, col, 0, 0); for (let j = yb - h + 40; j < yb - 40; j += 70) for (let i = x + 18; i < x + w - 30; i += 46) s += rect(i, j, 20, 28, win, 2, 0); x += w + 6; } return s; }
const FAC = { haus: { body: ['#efe2c8', '#e8d6b4', '#f3e7d2'], roof: '#6f819c' }, ochre: { body: ['#eab779', '#f0c99a', '#e59f6f', '#f3d5a5'], roof: '#c25b3a' }, pink: { body: ['#e9a58a', '#f2c2a2', '#e5b38a', '#d98f74'], roof: '#b8553a' },
  timber: { body: ['#f3e5c3', '#efd9b0', '#f6ead0'], roof: '#5d4b4b' }, brick: { body: ['#b4553c', '#a84a34', '#c06248'], roof: '#4a3f3f' }, stone: { body: ['#e6dccb', '#ddd2bf'], roof: '#6f819c' } };
const SHUT = ['#3f8f6a', '#4d7cc0', '#7aa6d8', '#9a5a3a'];
function oFacade(x, yb, w, h, kind, seed, t, o = {}) { const r = rng(seed), F = FAC[kind], c = o.c || F.body[seed % F.body.length], night = o.night; let s = '';
  if (kind === 'haus' || kind === 'stone') { s += path(`M${x - 8} ${yb - h}L${x + 20} ${yb - h - 110}L${x + w - 20} ${yb - h - 110}L${x + w + 8} ${yb - h}Z`, F.roof, 6); const n = Math.max(1, Math.floor(w / 120));
    for (let i = 0; i < n; i++) { const dx = x + (i + .5) * w / n, lit = night && Math.sin(seed + i * 3) > 0; s += path(`M${dx - 30} ${yb - h - 30}L${dx - 30} ${yb - h - 84}L${dx} ${yb - h - 112}L${dx + 30} ${yb - h - 84}L${dx + 30} ${yb - h - 30}Z`, c, 5) + rect(dx - 17, yb - h - 80, 34, 46, lit ? '#ffd98a' : '#bcd6ea', 3, 4); }
    s += rect(x + w * .66, yb - h - 170, 54, 64, '#c98a6a', 3, 5) + [0, 1, 2].map(i => rect(x + w * .66 + 6 + i * 16, yb - h - 192, 12, 22, '#d9734a', 2, 3)).join(''); }
  if (kind === 'ochre' || kind === 'pink') s += rect(x - 18, yb - h - 26, w + 36, 32, F.roof, 4, 5) + Array.from({ length: Math.floor(w / 30) + 2 }, (_, i) => path(`M${x - 18 + i * 30} ${yb - h + 6}q15 14 30 0`, 'none', 4, shade(F.roof, -.2))).join('');
  if (kind === 'timber') s += path(`M${x - 24} ${yb - h}L${x + w / 2} ${yb - h - w * .6}L${x + w + 24} ${yb - h}Z`, F.roof, 6) + rect(x + w / 2 - 22, yb - h - w * .32, 44, 54, night ? '#ffd98a' : '#bcd6ea', 4, 4);
  if (kind === 'brick') { let d = `M${x} ${yb - h}`; const st = 5, sw = w / (2 * st), sh = 34; for (let i = 0; i < st; i++) d += `L${x + i * sw} ${yb - h - (i + 1) * sh}L${x + (i + 1) * sw} ${yb - h - (i + 1) * sh}`; for (let i = st; i > 0; i--) d += `L${x + w - i * sw} ${yb - h - i * sh}L${x + w - (i - 1) * sw} ${yb - h - (i - 1) * sh}`; s += path(d + 'Z', c, 6) + circ(x + w / 2, yb - h - 90, 24, night ? '#ffd98a' : '#d6e6f2', 5); }
  s += rect(x, yb - h, w, h, c, 2, 6);
  if (kind === 'haus' || kind === 'stone') for (let j = yb - h + 34; j < yb - 200; j += 34) s += line(x + 4, j, x + w - 4, j, 2, 'rgba(0,0,0,.06)');
  if (kind === 'brick') for (let j = yb - h + 20, q = 0; j < yb - 200; j += 22, q++) s += line(x + 4, j, x + w - 4, j, 2, 'rgba(0,0,0,.12)');
  const shopH = o.shop === false ? 0 : 200, cols = Math.max(1, Math.floor(w / 100)), cw = w / cols; let fi = 0;
  for (let j = yb - h + 40; j + 100 < yb - shopH - 10; j += 130, fi++) { if (kind === 'timber') s += rect(x - 4, j - 20, w + 8, 12, '#6b3e26', 0, 3);
    for (let i = 0; i < cols; i++) { const wx = x + i * cw + cw * .22, ww = cw * .56, wh = 92, lit = night ? Math.sin(t * .4 + i * 2.3 + j * .05 + seed) > -.1 : false;
      if (kind === 'ochre' || kind === 'pink') { const sc = SHUT[(seed + i) % 4], open = r() < .6; s += open ? rect(wx - ww * .44, j, ww * .4, wh, sc, 2, 4) + rect(wx + ww * 1.04, j, ww * .4, wh, sc, 2, 4) : ''; }
      if (kind === 'timber') s += path(`M${wx - 18} ${j - 8}L${wx - 18} ${j + wh + 10}M${wx + ww + 18} ${j - 8}L${wx + ww + 18} ${j + wh + 10}M${wx - 18} ${j + wh + 10}L${wx + ww + 18} ${j - 8}`, 'none', 9, '#6b3e26');
      s += rect(wx, j, ww, wh, lit ? '#ffd98a' : (kind === 'brick' ? '#d6e6f2' : '#bcd6ea'), 3, 4) + line(wx + ww / 2, j, wx + ww / 2, j + wh, 3) + line(wx, j + wh * .45, wx + ww, j + wh * .45, 3);
      if (kind === 'haus' || kind === 'stone') s += line(wx - 8, j - 12, wx + ww + 8, j - 12, 6, shade(c, -.15));
      if (kind === 'brick') s += path(`M${wx - 6} ${j}Q${wx + ww / 2} ${j - 26} ${wx + ww + 6} ${j}`, 'none', 6, '#e8dccb');
      const k = r(); if (k < .25) s += path(`M${wx + 3} ${j + 3}L${wx + ww * .4} ${j + 3}Q${wx + ww * .2} ${j + 40} ${wx + 6} ${j + wh - 4}Z`, DPAL[(seed + i) % 8], 0); else if (k < .38 && kind !== 'haus') s += rect(wx - 6, j + wh - 8, ww + 12, 14, '#8a5a3a', 3, 3) + circ(wx + ww * .3, j + wh - 12, 11, '#5fb85f', 3) + circ(wx + ww * .7, j + wh - 12, 12, '#ff8fb1', 3);
      if (kind === 'haus' && fi !== 1 && fi !== 4) s += rect(wx - 6, j + wh - 6, ww + 12, 8, OL, 2, 0) + [1, 2, 3, 4].map(q => line(wx - 6 + q * (ww + 12) / 5, j + wh - 6, wx - 6 + q * (ww + 12) / 5, j + wh - 30, 3)).join(''); }
    if (kind === 'haus' && (fi === 1 || fi === 4)) { s += rect(x + 4, j + 92, w - 8, 10, OL, 2, 0) + line(x + 4, j + 56, x + w - 4, j + 56, 5); for (let q = x + 12; q < x + w - 8; q += 18) s += line(q, j + 56, q, j + 92, 3); } }
  if (shopH) { const ac = o.awn || DPAL[seed % 8], lit = night; s += rect(x + 12, yb - 170, w - 24, 170, o.shutter ? '#9aa3ad' : (lit ? '#ffe3a0' : '#bcdcef'), 4, 5) + rect(x + w * .64, yb - 160, w * .24, 160, shade(c, -.35), 4, 5) + circ(x + w * .68, yb - 80, 5, '#ffd23f', 0);
    if (o.shutter) for (let q = yb - 160; q < yb; q += 16) s += line(x + 14, q, x + w - 14, q, 3, '#7d848c');
    else s += op(.35, path(`M${x + 30} ${yb - 160}L${x + 70} ${yb - 160}L${x + 40} ${yb - 20}L${x + 20} ${yb - 20}Z`, '#fff', 0)) + rect(x + 30, yb - 70, 60, 50, DPAL[(seed + 3) % 8], 4, 4) + rect(x + 100, yb - 60, 50, 40, DPAL[(seed + 5) % 8], 4, 4);
    if (o.crack) s += oCrack(x + w * .35, yb - 100, .6, 1, seed);
    for (let i = 0; i < 6; i++) s += path(`M${x + i * w / 6} ${yb - 206}L${x + (i + 1) * w / 6} ${yb - 206}L${x + (i + 1) * w / 6} ${yb - 170}Q${x + (i + .5) * w / 6} ${yb - 150} ${x + i * w / 6} ${yb - 170}Z`, i % 2 ? '#fff' : ac, 4);
    if (o.sign) s += rect(x + w / 2 - o.sign.length * 11 - 16, yb - 262, o.sign.length * 22 + 32, 44, '#fff8e0', 8, 4) + ftext(x + w / 2, yb - 230, o.sign, { size: 26, fill: ac, stroke: 'none' }); }
  return s; }
// accessoires urbains
const dLampPost = (x, yb, s = 1, on = 0) => G(tr(x, yb, s), (on ? op(.4, circ(0, -470, 80, '#fff6c8', 0)) : '') + rect(-22, -20, 44, 20, '#2f3a33', 4, 4) + rect(-8, -440, 16, 420, '#2f3a33', 4, 4) + path('M-10 -440L10 -440L18 -470L-18 -470Z', '#2f3a33', 4) + path('M-30 -470L30 -470L22 -520L-22 -520Z', on ? '#ffe08a' : '#dfe6ea', 5) + path('M-30 -520L0 -548L30 -520Z', '#2f3a33', 4));
function dTree(x, yb, s, t, c = '#5fa85a') { return G(tr(x, yb, s, wave(t, .3, 1.5, x * .01)), rect(-18, -300, 36, 300, '#8a5a3a', 8, 5) + circ(0, -360, 120, c, 5) + circ(-90, -300, 80, shade(c, -.08), 5) + circ(90, -310, 86, shade(c, .08), 5) + circ(-30, -420, 70, shade(c, .05), 5) + rect(-70, -10, 140, 14, '#5a5f66', 3, 4)); }
function dCar(x, yb, s = 1, c = '#ff6b6b', flip = 0) { return G(`translate(${f1(x)} ${f1(yb)}) scale(${flip ? -s : s} ${s})`, path('M-200 -40L-200 -100Q-190 -120 -150 -124L-100 -190Q-80 -200 40 -200Q90 -196 120 -124L190 -114Q210 -104 210 -70L210 -40Z', c, 6) + path('M-84 -130L-56 -180L10 -180L10 -130Z', '#cfe8ff', 4) + path('M30 -130L30 -180L80 -180L106 -130Z', '#cfe8ff', 4) + circ(-110, -36, 42, '#3a4250', 6) + circ(-110, -36, 16, '#c8ced6', 4) + circ(120, -36, 42, '#3a4250', 6) + circ(120, -36, 16, '#c8ced6', 4) + rect(186, -98, 22, 16, '#ffe08a', 4, 3)); }
const dBin = (x, y, s = 1, c = '#36a85a', r = 0) => G(tr(x, y, s, r), path('M-46 -110L46 -110L36 0L-36 0Z', c, 5) + line(-20, -90, -16, -14, 4, shade(c, -.25)) + line(20, -90, 16, -14, 4, shade(c, -.25)) + rect(-52, -124, 104, 18, shade(c, -.15), 6, 5));
const dBike = (x, yb, s = 1, c = '#36a85a') => G(tr(x, yb - 50 * s, s), circ(-70, 0, 48, 'none', 7) + circ(70, 0, 48, 'none', 7) + path('M-70 0L-20 -70L50 -70L70 0M-20 -70L0 0L50 -70M0 0L-70 0', 'none', 7, c) + line(-30, -90, -6, -90, 8) + path('M50 -70L44 -96L66 -100', 'none', 7));
const dBollard = (x, yb, s = 1) => G(tr(x, yb, s), rect(-12, -80, 24, 80, '#5a2d3a', 10, 4) + circ(0, -84, 14, '#5a2d3a', 4));
const dBench = (x, yb, s = 1) => G(tr(x, yb, s), rect(-120, -110, 240, 22, '#3f7a4a', 5, 4) + rect(-120, -80, 240, 22, '#3f7a4a', 5, 4) + rect(-130, -44, 260, 20, '#3f7a4a', 5, 4) + line(-100, -24, -100, 0, 8) + line(100, -24, 100, 0, 8));
function dKiosk(x, yb, s = 1) { return G(tr(x, yb, s), rect(-90, -330, 180, 330, '#2f5a3a', 10, 6) + rect(-70, -300, 140, 180, '#f3ead8', 6, 4) + rect(-60, -290, 56, 70, '#e2463a', 3, 3) + rect(4, -290, 56, 70, '#5b8fd8', 3, 3) + rect(-60, -210, 120, 70, '#ffd23f', 3, 3) + path('M-110 -330L110 -330L80 -400Q0 -440 -80 -400Z', '#2f5a3a', 6) + circ(0, -440, 14, '#2f5a3a', 5) + ftext(0, -352, 'JOURNAUX', { size: 26, fill: '#ffd23f', stroke: 'none' })); }
function dMetro(x, yb, s = 1) { return G(tr(x, yb, s), path('M-120 0L-120 -90M120 0L120 -90', 'none', 10, '#2f5a3a') + path('M-120 -90Q-100 -120 -120 -150M120 -90Q100 -120 120 -150', 'none', 10, '#2f5a3a') + rect(-120, -90, 240, 14, '#2f5a3a', 4, 4) + line(-110, -260, -110, -90, 10, '#2f5a3a') + rect(-180, -320, 140, 60, '#ffd23f', 10, 5) + ftext(-110, -278, 'MÉTRO', { size: 30, fill: '#2f5a3a', stroke: 'none' })); }
function dSidewalk(yb, night, o = {}) { let s = rect(-M, yb, W + 2 * M, 1400, night ? '#5a5e70' : '#c3c6cc', 0, 0) + [0, 1, 2].map(i => line(-M, yb + 18 + i * 22, W + M, yb + 18 + i * 22, 3, night ? '#4c5062' : '#b0b5bc')).join('') + rect(-M, yb + 80, W + 2 * M, 18, night ? '#45495a' : '#8f959d', 0, 0) + rect(-M, yb + 98, W + 2 * M, 1400, night ? '#33364a' : '#6e747c', 0, 0) + line(-M, yb, W + M, yb, 8, night ? '#3e4252' : '#7d848c');
  for (let i = 0; i < 9; i++) s += rect(-M + i * 320, yb + 330, 170, 18, night ? '#aab' : '#fff', 4, 0); for (let i = 0; i < 9; i++) s += rect(CX - 420 + i * 100, yb + 470, 60, 260, o.zebra ? (night ? '#99a' : '#fff') : 'none', 4, 0); return s; }
// rue complète par ville : sky, skyline brumeuse, rangée de façades, trottoir/chaussée, mobilier
function oStreet(t, o = {}) { const yb = 1250, sky = o.sky || 'day', night = sky === 'night' || sky === 'dusk'; let s = oSky(t, sky);
  s += o.far || '';
  s += op(.75, dSkyline(1080, SKYFAR[sky], o.seed || 3, night ? 'rgba(255,220,140,.45)' : 'rgba(255,255,255,.3)')) + dHaze(.12, night ? '20,20,50' : '230,240,250');
  const kinds = o.kinds || ['haus'], signs = o.signs || ['CAFÉ', 'BOULANGERIE', 'PHARMACIE', 'TABAC', 'FLEURS', 'LIBRAIRIE', 'BRASSERIE', 'OPTIQUE'];
  if (o.facades !== false) for (let i = -2; i < 6; i++) { const x = -260 + i * 300 + (o.shift || 0); s += oFacade(x, yb, 294, 640 + (((i + 7) * 137 + (o.seed || 0) * 53) % 260), kinds[(i + 20) % kinds.length], i + 11 + (o.seed || 0), t, { night, sign: signs[(i + 8) % signs.length], awn: DPAL[(i + 8) % 8], shutter: o.shutters && i % 2 === 0, crack: o.cracks && i % 2 === 1 }); }
  s += o.mid || '';
  s += dHaze(.08, night ? '20,20,50' : '255,250,240', 1250) + dSidewalk(yb, night, o);
  if (o.props !== false) { s += dLampPost(70, yb + 40, 1, night) + dLampPost(1010, yb + 40, 1, night) + dTree(300, yb + 30, .7, t, night ? '#3f6a4a' : '#5fa85a') + dBollard(520, yb + 60) + dBollard(580, yb + 60) + dBin(860, yb + 50, .55, '#2f6a3a') + dBike(700, yb + 60, .55, '#e2463a');
    if (o.kiosk) s += dKiosk(180, yb + 40, .8); if (o.metro) s += dMetro(860, yb + 50, .75);
    if (o.cars !== false) s += dCar(-80, yb + 300, .9, '#5ec4f0') + dCar(1120, yb + 310, .9, '#ffd23f', 1); }
  return s; }
// premier plan flou (3e couche) : bord de trottoir + plots / barrière
function oFg(kind, t) { let s = '';
  if (kind === 'barrier') s = G(tr(-60, 1960, 2.2), rect(-200, -160, 400, 22, '#c8ced6', 6, 5) + rect(-200, -90, 400, 22, '#c8ced6', 6, 5) + line(-180, -160, -180, 0, 12) + line(180, -160, 180, 0, 12)) + G(tr(1130, 1980, 2.2), rect(-12, -260, 24, 260, '#2f3a33', 8, 5) + circ(0, -270, 30, '#2f3a33', 5));
  if (kind === 'cone') s = G(tr(-10, 1990, 2.4), path('M-50 0L-14 -170L14 -170L50 0Z', '#ff7a1a', 5) + rect(-34, -110, 68, 24, '#fff', 0, 0) + rect(-70, -14, 140, 18, '#ff7a1a', 4, 5)) + G(tr(1100, 1990, 2.2), rect(-80, -200, 160, 200, '#2f6a3a', 12, 6));
  if (kind === 'bush') s = G(tr(-40, 1990, 2.4), circ(-60, -40, 60, '#4f8a4f', 5) + circ(40, -70, 70, '#5a9a5a', 5)) + G(tr(1110, 1990, 2.2), circ(0, -60, 80, '#4f8a4f', 5));
  return s ? blur(9, s) : ''; }
// ---------- lieux ----------
function oCnews(x, yb, t, o = {}) { let s = rect(x - 330, yb - 980, 660, 980, '#9ab3c8', 6, 6);
  for (let j = 0; j < 9; j++) for (let i = 0; i < 6; i++) { const lit = Math.sin(i * 2.1 + j * 1.3) > .2; s += rect(x - 300 + i * 100, yb - 950 + j * 80, 86, 64, lit ? '#e7f2fa' : '#6f8ea8', 2, 3); }
  s += rect(x - 350, yb - 300, 700, 40, '#5d6e80', 4, 6) + rect(x - 180, yb - 400, 360, 90, '#fff', 12, 6) + ftext(x, yb - 335, 'CNEWS', { size: 64, fill: NAVY, stroke: 'none' });
  s += rect(x - 300, yb - 260, 600, 260, '#cfe4f2', 4, 6) + [0, 1, 2, 3].map(i => line(x - 300 + i * 150, yb - 260, x - 300 + i * 150, yb, 5)).join('') + rect(x - 110, yb - 230, 220, 230, '#b4d3e8', 4, 6) + line(x, yb - 230, x, yb, 6) + circ(x - 18, yb - 120, 6, OL, 0) + circ(x + 18, yb - 120, 6, OL, 0);
  s += rect(x - 160, yb - 330, 320, 22, '#ffd23f', 4, 4) + dPot2(x - 380, yb, t) + dPot2(x + 380, yb, t) + dBollard(x - 220, yb + 50) + dBollard(x + 220, yb + 50);
  if (o.cracks) s += o.cracks; return s; }
function dPot2(x, yb, t) { return G(tr(x, yb), rect(-50, -90, 100, 90, '#6d7680', 6, 5) + G(tr(0, -90, 1, wave(t, .4, 3)), circ(0, -60, 60, '#4f8a4f', 5) + circ(-34, -30, 38, '#5a9a5a', 5) + circ(34, -36, 40, '#5a9a5a', 5))); }
function oGareNord(t) { const yb = 1250, x = CX; let s = rect(x - 600, yb - 760, 1200, 760, '#e8dcc6', 4, 6);
  s += path(`M${x - 600} ${yb - 760}L${x} ${yb - 900}L${x + 600} ${yb - 760}Z`, '#dccfb6', 6) + circ(x, yb - 820, 40, '#fff8e0', 6) + oClock(x, yb - 820, 32, 690, { sw: 4 });
  for (let i = -1; i <= 1; i++) { const bx = x + i * 340; s += path(`M${bx - 130} ${yb - 120}L${bx - 130} ${yb - 520}Q${bx} ${yb - 680} ${bx + 130} ${yb - 520}L${bx + 130} ${yb - 120}Z`, '#a9c9de', 6);
    for (let q = -2; q <= 2; q++) s += line(bx + q * 50, yb - 120, bx + q * 50, yb - 600 + Math.abs(q) * 30, 4, '#5d6e80'); for (let q = 0; q < 5; q++) s += line(bx - 128, yb - 160 - q * 80, bx + 128, yb - 160 - q * 80, 4, '#5d6e80'); }
  for (const cxx of [-510, -170, 170, 510]) s += rect(x + cxx - 24, yb - 600, 48, 480, '#d8cbb2', 4, 5) + rect(x + cxx - 34, yb - 620, 68, 26, '#cbbda2', 4, 4);
  for (let i = 0; i < 8; i++) { const sx = x - 525 + i * 150; s += G(tr(sx, yb - 790), circ(0, -40, 16, '#c8bba2', 4) + path('M-18 0L-14 -26Q0 -34 14 -26L18 0Z', '#c8bba2', 4)); }
  s += rect(x - 210, yb - 120, 420, 60, '#1d2742', 8, 5) + ftext(x, yb - 78, 'GARE DU NORD', { size: 38, fill: '#fff', stroke: 'none' }) + rect(x - 600, yb - 60, 1200, 60, '#d8cbb2', 0, 5);
  return s; }
function oStatueRep(x, yb, s, t) { return G(tr(x, yb, s), rect(-200, -60, 400, 60, '#c9c2b4', 4, 6) + rect(-150, -120, 300, 60, '#d6d0c2', 4, 6) + rect(-100, -480, 200, 360, '#e3ddcf', 6, 6) + rect(-120, -500, 240, 30, '#c9c2b4', 4, 5) + [-1, 1].map(sd => G(tr(sd * 150, -170), circ(0, -40, 26, '#6a8a7a', 5) + path('M-30 0L-24 -30Q0 -40 24 -30L30 0Z', '#6a8a7a', 5))).join('') +
  path('M-70 -500L-50 -760Q0 -790 50 -760L70 -500Z', '#6a8a7a', 6) + path('M-50 -700Q-70 -620 -90 -520', 'none', 6, '#557565') + circ(0, -810, 42, '#6a8a7a', 6) + path('M-36 -840L0 -870L36 -840', 'none', 6, '#557565') + line(30, -760, 90, -930, 24, OL) + line(30, -760, 90, -930, 14, '#6a8a7a') + circ(92, -936, 14, '#6a8a7a', 5) + G(tr(96, -960, 1, wave(t, .3, 4)), path('M0 0Q30 -40 70 -36M0 0Q-10 -40 20 -70', 'none', 7, '#557565') + ell(40, -40, 12, 7, '#557565', 0) + ell(14, -58, 12, 7, '#557565', 0))); }
function oRepublique(t, o = {}) { const sky = o.sky || 'day'; let s = oStreet(t, { sky, kinds: ['haus'], seed: 5, props: false, cars: false });
  s += dTree(120, 1260, .95, t) + dTree(960, 1260, .9, t) + oStatueRep(CX, 1270, .9, t) + dLampPost(300, 1290, .9, sky === 'night') + dLampPost(780, 1290, .9, sky === 'night') + dBench(200, 1320, .7) + dMetro(900, 1330, .6);
  return s; }
function oElysee(t, k = 1) { let s = oSky(t, 'day') + op(.75, dSkyline(1080, SKYFAR.day, 9)) + rect(-M, 760, W + 2 * M, 500, '#ece4d4', 0, 6);
  s += rect(140, 520, 800, 500, '#f2ead9', 4, 6) + path('M100 520L540 390L980 520Z', '#e6dcc6', 6) + rect(170, 600, 740, 18, '#d8cdb5', 0, 0); for (let i = 0; i < 6; i++) s += rect(190 + i * 130, 640, 70, 120, '#bcd6ea', 3, 4) + rect(190 + i * 130, 820, 70, 140, '#bcd6ea', 3, 4);
  for (const fx of [400, 680]) s += line(fx, 520, fx, 330, 6) + path(`M${fx} 330L${fx + 40 + wave(t, 1.4, 6)} 336L${fx + 40 + wave(t, 1.4, 6)} 396L${fx} 390Z`, '#3a5fc8', 3) + path(`M${fx + 40 + wave(t, 1.4, 6)} 336L${fx + 80 + wave(t, 1.4, 10, .3)} 342L${fx + 80 + wave(t, 1.4, 10, .3)} 402L${fx + 40 + wave(t, 1.4, 6)} 396Z`, '#fff', 3) + path(`M${fx + 80 + wave(t, 1.4, 10, .3)} 342L${fx + 120 + wave(t, 1.4, 12, .6)} 348L${fx + 120 + wave(t, 1.4, 12, .6)} 408L${fx + 80 + wave(t, 1.4, 10, .3)} 402Z`, RED, 3);
  s += rect(-M, 1000, W + 2 * M, 260, '#e8dfcf', 0, 6); for (let x = -40; x < W + 40; x += 34) s += line(x, 1250, x, 1010, 6, '#2b2420') + path(`M${x - 8} 1012L${x} 990L${x + 8} 1012Z`, '#d9a441', 3); s += line(-M, 1030, W + M, 1030, 8) + line(-M, 1230, W + M, 1230, 8);
  s += rect(CX - 120, 1000, 240, 250, 'none', 0, 0) + G(tr(CX, 960), rect(-130, -40, 260, 50, '#1d2742', 8, 5) + ftext(0, -6, 'PALAIS', { size: 30, fill: '#d9a441', stroke: 'none' }));
  return s + dSidewalk(1250, false); }
function oPodium(t, o = {}) { let s = grad('#20305e', '#0f1630', -M, -M, W + 2 * M, H + 2 * M); for (let i = 0; i < 9; i++) s += path(`M${-100 + i * 150} -100Q${-60 + i * 150 + wave(t, .3, 10, i)} 700 ${-100 + i * 150} 1400`, 'none', 14, 'rgba(255,255,255,.05)');
  const flag = (fx, eu) => line(fx, 1250, fx, 470, 10, '#d9a441') + circ(fx, 462, 14, '#d9a441', 5) + (eu ? path(`M${fx} 480Q${fx + 70} ${500 + wave(t, .8, 10)} ${fx + 60} 760Q${fx + 20} 740 ${fx} 760Z`, '#2a4fb8', 5) + [0, 1, 2, 3, 4, 5].map(i => circ(fx + 30 + Math.cos(i) * 12, 600 + Math.sin(i) * 40, 4, '#ffd23f', 0)).join('')
    : path(`M${fx} 480Q${fx + 24} ${500 + wave(t, .8, 8)} ${fx + 22} 760L${fx} 760Z`, '#3a5fc8', 5) + path(`M${fx + 22} ${500 + wave(t, .8, 8) * .5}Q${fx + 48} ${510 + wave(t, .8, 10)} ${fx + 44} 760L${fx + 22} 760Z`, '#fff', 5) + path(`M${fx + 44} ${510}Q${fx + 70} ${520 + wave(t, .8, 12)} ${fx + 66} 760L${fx + 44} 760Z`, RED, 5));
  s += flag(250, 0) + flag(330, 1) + flag(750, 0) + flag(830, 1);
  if (o.speaker !== false) s += G(tr(CX, 1150, .62), oSuitBack(0, 0, 1).replace(/#f2c9a0/g, SKIN));
  s += G(tr(CX, 1250), path('M-170 -330L170 -330L140 0L-140 0Z', '#b98a52', 7) + rect(-190, -360, 380, 40, '#c99a62', 8, 6) + rect(-70, -260, 140, 120, '#1d2742', 60, 5) + circ(0, -200, 40, '#f3ead8', 4) + line(0, -360, 30, -440, 7) + ell(34, -450, 14, 22, '#333', 4));
  s += rect(-M, 1250, W + 2 * M, 900, '#5a3b2a', 0, 0) + line(-M, 1250, W + M, 1250, 8);
  if (o.press) for (let i = 0; i < 6; i++) s += G(tr(80 + i * 190, 1700 + (i % 2) * 40), circ(0, -120, 70, '#0c0f1c', 0) + ell(0, 0, 120, 100, '#0c0f1c', 0) + (i % 2 ? rect(30, -170, 70, 50, '#222', 8, 4) + (Math.sin(t * 7 + i * 2) > .85 ? op(.8, glow(64, -150, 80, '#fff', .9)) : '') : ''));
  return s; }
// Marseille : Notre-Dame-de-la-Garde sur sa colline (lointain)
function oNDGarde(x, y, s) { return G(tr(x, y, s), path('M-500 200Q-260 -40 0 -40Q260 -40 500 200Z', '#9aa88a', 0) + rect(-120, -150, 240, 110, '#e6dccb', 4, 5) + rect(-40, -330, 80, 190, '#e6dccb', 4, 5) + path('M-40 -330L0 -370L40 -330Z', '#e6dccb', 5) + rect(-10, -420, 20, 50, '#e8b923', 4, 4) + circ(0, -430, 12, '#e8b923', 4) + circ(-70, -170, 40, '#e6dccb', 5) + circ(70, -170, 40, '#e6dccb', 5)); }
function oBoats(t, yb) { let s = rect(-M, yb, W + 2 * M, 200, '#3f7fb8', 0, 0); for (let i = 0; i < 4; i++) s += line(-M, yb + 30 + i * 40, W + M, yb + 30 + i * 40, 4, 'rgba(255,255,255,.35)');
  for (let i = 0; i < 6; i++) { const bx = -40 + i * 220, by = yb + 70 + wave(t, .5, 6, i * .3); s += G(tr(bx, by, 1, wave(t, .5, 2, i)), line(0, -60, 0, -360, 6) + path('M-110 -60L110 -60L80 0L-80 0Z', ['#fff', '#e2463a', '#5b8fd8'][i % 3], 5) + line(0, -340, 90, -70, 3, '#7d848c')); } return s; }
function oMarseilleHDV(t, o = {}) { const yb = 1250; let s = oSky(t, 'warm') + oNDGarde(800, 820, .9) + op(.6, dSkyline(1050, SKYFAR.warm, 12)) + dHaze(.12) + oBoats(t, 1080);
  s += rect(110, 450, 860, 680, '#e8d3b0', 4, 6) + rect(90, 430, 900, 40, '#d4bd96', 4, 6) + path('M300 430L540 330L780 430Z', '#e0c9a2', 6) + circ(540, 395, 26, '#fff8e0', 5);
  for (const fx of [460, 620]) s += line(fx, 330, fx, 200, 6) + path(`M${fx} 200L${fx + 30} 204L${fx + 30} 250L${fx} 246Z`, '#3a5fc8', 3) + path(`M${fx + 30} 204L${fx + 60 + wave(t, 1.4, 4)} 208L${fx + 60 + wave(t, 1.4, 4)} 254L${fx + 30} 250Z`, '#fff', 3) + path(`M${fx + 60 + wave(t, 1.4, 4)} 208L${fx + 90 + wave(t, 1.4, 8)} 212L${fx + 90 + wave(t, 1.4, 8)} 258L${fx + 60 + wave(t, 1.4, 4)} 254Z`, RED, 3);
  for (let i = 0; i < 6; i++) s += rect(150 + i * 135, 500, 70, 130, '#bcd6ea', 4, 4) + rect(150 + i * 135, 680, 70, 130, '#bcd6ea', 4, 4) + rect(140 + i * 135, 640, 90, 12, '#2b2420', 2, 0);
  s += rect(110, 860, 860, 20, '#d4bd96', 0, 5); const pk = o.push || 0;
  s += path('M440 1130L440 960Q540 880 640 960L640 1130Z', '#5a3b2a', 6) + G(tr(490 - pk * 8, 1045), rect(-46, -80, 92, 170, '#7a4e33', 4, 5) + circ(30, 0, 7, '#d9a441', 3)) + G(tr(590 + pk * 8, 1045), rect(-46, -80, 92, 170, '#7a4e33', 4, 5) + circ(-30, 0, 7, '#d9a441', 3));
  s += rect(-M, 1130, W + 2 * M, 120, '#d8cdb5', 0, 6) + dSidewalk(yb, false) + dLampPost(60, yb + 40, 1) + dLampPost(1020, yb + 40, 1);
  return s; }
// Lyon : Fourvière (basilique + tour métallique) sur la colline
function oFourviere(x, y, s) { return G(tr(x, y, s), path('M-700 260Q-300 -60 0 -60Q300 -60 700 260Z', '#8fae7a', 0) + circ(-300, 60, 70, '#7a9a6a', 0) + circ(260, 40, 80, '#7a9a6a', 0) + rect(-150, -200, 300, 150, '#ece4d4', 4, 5) + [-150, -60, 60, 150].map(dx => rect(dx - 18, -270, 36, 90, '#ece4d4', 3, 4) + path(`M${dx - 18} -270L${dx} -290L${dx + 18} -270Z`, '#ece4d4', 4)).join('') + path('M-60 -200L0 -250L60 -200Z', '#ece4d4', 4) + path('M360 -50L380 -330L400 -50Z', '#9aa3ad', 4) + line(370, -180, 390, -180, 3)); }
function oHorseStatue(x, yb, s) { const c = '#5a6a62'; return G(tr(x, yb, s), rect(-190, -260, 380, 260, '#d9d2c2', 6, 6) + rect(-210, -290, 420, 34, '#c9c2b2', 4, 5) + G(tr(0, -290), ell(0, -170, 150, 70, c, 6) + line(-110, -130, -130, 0, 22, OL) + line(-110, -130, -130, 0, 14, c) + line(-60, -130, -50, 0, 22, OL) + line(-60, -130, -50, 0, 14, c) + line(90, -130, 120, -40, 22, OL) + line(90, -130, 120, -40, 14, c) + line(120, -140, 160, -60, 22, OL) + line(120, -140, 160, -60, 14, c) + path('M120 -200L190 -300L240 -280L200 -200Z', c, 6) + path('M-150 -180Q-220 -150 -200 -60', 'none', 14, c) + path('M-40 -230L-30 -370Q0 -390 30 -370L40 -230Z', c, 6) + circ(0, -410, 34, c, 6) + line(20, -350, 100, -320, 16, c))); }
function oTourismPavilion(x, yb, t, fire = 0) { let s = rect(x - 260, yb - 300, 520, 300, '#cfe4f2', 6, 6) + rect(x - 290, yb - 340, 580, 50, '#3a6a8a', 6, 6) + ftext(x, yb - 303, 'OFFICE DE TOURISME', { size: 32, fill: '#fff', stroke: 'none' });
  for (let i = 0; i < 5; i++) s += line(x - 260 + i * 130, yb - 290, x - 260 + i * 130, yb, 5); s += rect(x - 60, yb - 200, 120, 200, '#9fc4dc', 4, 5) + rect(x - 220, yb - 260, 90, 60, '#fff', 4, 3) + ftext(x - 175, yb - 222, 'i', { size: 40, fill: BLUE, stroke: 'none' });
  if (fire > 0) s += oFire(x - 120, yb - 40, 220 * fire, 260 * fire, t, 3) + oFire(x + 140, yb - 10, 260 * fire, 360 * fire, t, 5);
  return s; }
function oBellecour(t, o = {}) {
  let s = oSky(t, 'warm') + oFourviere(CX, 900, 1) + dHaze(.12);
  for (let i = -2; i < 6; i++) s += oFacade(-260 + i * 300, 1080, 294, 380 + ((i + 7) * 97 % 120), i % 2 ? 'ochre' : 'pink', i + 30, t, { shop: false });
  s += dHaze(.12, '255,240,220', 1100) + rect(-M, 1080, W + 2 * M, 1400, '#d98a5a', 0, 0) + line(-M, 1080, W + M, 1080, 6, '#b86a3a');
  for (let i = 0; i < 6; i++) s += dTree(-80 + i * 240, 1110, .45, t, '#6aa85a');
  if (o.statue !== false) s += oHorseStatue(o.sx ?? 300, 1260, .8);
  if (o.pav) s += oTourismPavilion(o.px ?? 760, 1250, t, o.fire || 0);
  for (let i = 0; i < 10; i++) s += circ((i * 173) % 1080, 1300 + (i * 61) % 400, 6, '#c47a4a', 0);
  return s; }
// Rennes : maisons à colombages ; Lille : beffroi + pignons flamands ; Limoges : hôtel de ville
function oRennes(t, o = {}) { return oStreet(t, { sky: 'late', kinds: ['timber'], seed: 7, signs: ['CRÊPERIE', 'LIBRAIRIE', 'CAFÉ', 'BIJOUX'], cars: false, ...o }); }
function oBeffroi(x, yb, s, t) { return G(tr(x, yb, s), rect(-90, -900, 180, 900, '#c9b89a', 4, 6) + rect(-110, -940, 220, 50, '#b8a586', 4, 6) + circ(0, -800, 60, '#fff8e0', 6) + oClock(0, -800, 50, t * 30 + 600, { sw: 0, ticks: 1 }) + rect(-70, -1100, 140, 160, '#c9b89a', 4, 6) + [-1, 1].map(sd => rect(sd * 120 - 20, -1000, 40, 70, '#b8a586', 4, 5) + path(`M${sd * 120 - 24} -1000L${sd * 120} -1050L${sd * 120 + 24} -1000Z`, '#5f7f7a', 5)).join('') + path('M-80 -1100L0 -1340L80 -1100Z', '#5f7f7a', 6) + line(0, -1340, 0, -1400, 6) + circ(0, -1404, 10, '#e8b923', 4) + [0, 1, 2, 3].map(j => rect(-40, -700 + j * 140, 80, 100, '#d6e6f2', 30, 5)).join('')); }
function oLille(t, o = {}) { const far = op(.9, oBeffroi(CX + 180, 1250, .82, t)); return oStreet(t, { sky: 'late', kinds: ['brick'], seed: 9, signs: ['ESTAMINET', 'GAUFRES', 'CAFÉ', 'MODE'], far, cars: false, ...o }); }
function oLimogesHDV(t, o = {}) { const yb = 1250, sky = o.sky || 'dusk', fire = o.fire || 0, roof = o.roof || 0; let s = oSky(t, sky) + op(.7, dSkyline(1080, SKYFAR[sky], 14, 'rgba(255,220,140,.45)')) + dHaze(.1, '40,20,60');
  s += path('M40 600L120 450L960 450L1040 600Z', '#5d6f8a', 6) + [0, 1, 2, 3, 4].map(i => path(`M${200 + i * 170} 600L${200 + i * 170} 520L${240 + i * 170} 490L${280 + i * 170} 520L${280 + i * 170} 600Z`, '#e3d6bf', 5) + rect(222 + i * 170, 524, 36, 50, fire > .5 ? '#ff9a3c' : '#2a3050', 3, 4)).join('');
  s += rect(CX - 90, 280, 180, 200, '#e3d6bf', 4, 6) + path(`M${CX - 110} 280Q${CX} 160 ${CX + 110} 280Z`, '#5d6f8a', 6) + line(CX, 180, CX, 120, 6) + circ(CX, 380, 54, '#fff8e0', 6) + oClock(CX, 380, 46, 18 * 60 + 5 + t * 2, { sw: 0, ticks: 1 });
  s += rect(40, 600, 1000, 650, '#e3d6bf', 4, 6) + rect(20, 590, 1040, 26, '#cdbfa5', 4, 6);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 7; i++) { const lit = fire > 0 && (j < 2 && (i + j) % 3 !== 1) && fire > .3 + i * .05; s += rect(90 + i * 135, 650 + j * 170, 70, 120, lit ? '#ff9a3c' : (sky === 'dusk' ? '#ffd98a' : '#bcd6ea'), 30, 5).replace('rx="30"', 'rx="30" ry="30"') + rect(84 + i * 135, 774 + j * 170, 82, 10, '#cdbfa5', 2, 3); }
  for (let i = 0; i < 4; i++) s += rect(130 + i * 270, 620, 30, 630, '#d6c8ad', 4, 4);
  s += path('M440 1250L440 1120Q540 1050 640 1120L640 1250Z', '#5a3b2a', 6) + rect(-M, 1240, W + 2 * M, 20, '#cdbfa5', 0, 5);
  for (const fx of [300, 780]) s += line(fx, 600, fx, 520, 5) + path(`M${fx} 520L${fx + 26 + wave(t, 1.3, 4)} 524L${fx + 26} 560L${fx} 556Z`, '#3a5fc8', 3) + path(`M${fx + 26 + wave(t, 1.3, 4)} 524L${fx + 52 + wave(t, 1.3, 6)} 528L${fx + 52} 564L${fx + 26} 560Z`, '#fff', 3) + path(`M${fx + 52 + wave(t, 1.3, 6)} 528L${fx + 78 + wave(t, 1.3, 8)} 532L${fx + 78} 568L${fx + 52} 564Z`, RED, 3);
  if (fire > 0) s += oFire(300, 1000, 200 * fire, 260 * fire, t, 2) + oFire(720, 830, 180 * fire, 220 * fire, t, 4);
  if (roof > 0) s += oFire(330, 470, 420 * roof, 360 * roof, t, 6, { smokeCol: '#3a3540' }) + oFire(760, 470, 420 * roof, 420 * roof, t, 8, { smokeCol: '#3a3540' }) + oEmbers(CX, 500, t, 14, 800);
  return s + dSidewalk(yb, true) + dLampPost(40, yb + 40, 1, 1) + dLampPost(1040, yb + 40, 1, 1); }
// véhicules
function oVan(x, yb, s, t, flip = 0) { return G(`translate(${f1(x)} ${f1(yb)}) scale(${flip ? -s : s} ${s})`, path('M-260 -40L-260 -300Q-260 -320 -240 -320L150 -320Q190 -320 210 -280L260 -170L260 -40Z', '#eef1f5', 6) + rect(-260, -170, 520, 40, '#2f4fa8', 0, 0) + rect(-260, -130, 520, 14, '#e2463a', 0, 0) + path('M150 -300L200 -190L120 -190L120 -300Z', '#9fc4e0', 5) + rect(-220, -290, 120, 90, '#9fc4e0', 6, 5) + rect(-80, -290, 160, 90, '#9fc4e0', 6, 5) + ftext(-40, -138, 'POLICE', { size: 36, fill: '#fff', stroke: 'none' }).replace('<text', `<text transform="scale(${flip ? -1 : 1} 1)" `).replace(/x="-40"/, `x="${flip ? 40 : -40}"`) + circ(-160, -40, 50, '#2f3640', 6) + circ(-160, -40, 18, '#c8ced6', 4) + circ(160, -40, 50, '#2f3640', 6) + circ(160, -40, 18, '#c8ced6', 4)) + oGyro(x - 80 * s * (flip ? -1 : 1), yb - 336 * s, t, s) + oGyro(x + 20 * s * (flip ? -1 : 1), yb - 336 * s, t, s, 3); }
function oWaterCannon(x, yb, s, t, k = 1) { let g = path('M-320 -40L-320 -360L120 -360L120 -40Z', '#eef1f5', 6) + rect(-320, -200, 440, 40, '#2f4fa8', 0, 0) + path('M120 -40L120 -300L260 -300L320 -180L320 -40Z', '#eef1f5', 6) + path('M140 -280L240 -280L290 -190L140 -190Z', '#9fc4e0', 5) + rect(-60, -420, 120, 60, '#c8ced6', 10, 6) + G(tr(0, -400, 1, -18), rect(0, -18, 220, 36, '#8a939e', 10, 6)) + [-220, -80, 220].map(wx => circ(wx, -40, 54, '#2f3640', 6) + circ(wx, -40, 20, '#c8ced6', 4)).join('');
  let water = ''; if (k > 0) for (let i = 0; i < 4; i++) { const ph = (t * 3 + i * .25) % 1; water += path(`M210 -470Q${520 + i * 20} ${-640 + i * 10} ${900 + i * 40} ${-260 + i * 30}`, 'none', 30 - i * 5, `rgba(${180 + i * 15},${220 + i * 8},255,${.85 - i * .15})`).replace('fill="none"', `fill="none" stroke-dasharray="${f1(160 + i * 40)} 40" stroke-dashoffset="${f1(-ph * 400)}"`); }
  return G(tr(x, yb, s), g) + (k > 0 ? G(tr(x, yb, s), op(k, water)) : '') + oGyro(x - 180 * s, yb - 384 * s, t, s) + oGyro(x - 60 * s, yb - 384 * s, t, s, 3); }
function oFireTruck(x, yb, s, t, ang = 30) { return G(tr(x, yb, s), path('M-360 -40L-360 -300L160 -300L160 -40Z', '#d8302a', 6) + path('M160 -40L160 -330L280 -330L340 -200L340 -40Z', '#d8302a', 6) + path('M180 -310L260 -310L310 -210L180 -210Z', '#9fc4e0', 5) + rect(-360, -180, 520, 22, '#e8e8e8', 0, 0) + [-260, -100, 240].map(wx => circ(wx, -40, 54, '#2f3640', 6) + circ(wx, -40, 20, '#c8ced6', 4)).join('') +
  G(tr(-200, -320, 1, -ang), rect(0, -26, 760, 52, '#c8ced6', 6, 6) + Array.from({ length: 12 }, (_, i) => line(30 + i * 60, -24, 30 + i * 60, 24, 5)).join(''))) + oGyro(x + 220 * s, yb - 350 * s, t, s) + oGyro(x + 300 * s, yb - 350 * s, t, s, 3).replace(/#7fb8ff/g, '#ff9a9a').replace(/#2a4a8a/g, '#8a2a2a').replace(/#5aa0ff/g, '#ff6a6a'); }
function oBarricade(x, yb, s, t, k = 1) { return G(tr(x, yb, s), path('M-260 0L-240 -90L-120 -110L-60 -170L40 -150L120 -190L220 -120L270 0Z', '#7a5a3a', 6) + rect(-220, -70, 160, 40, '#a07a4a', 3, 5) + rect(20, -110, 180, 40, '#a07a4a', 3, 5) + G(tr(-80, -150, 1, -20), rect(-60, -40, 120, 80, '#2f6a3a', 8, 5)) + circ(160, -40, 46, '#2b2b2b', 6) + circ(160, -40, 18, '#555', 4)) + (k > 0 ? oFire(x, yb - 60 * s, 460 * s * k, 330 * s * k, t, 7) : ''); }

// ============================================================
//  CARTES : France (épingles + trajets) et plan de Paris (cortèges)
// ============================================================
const FR = [[2.37, 51.05], [1.6, 50.85], [1.55, 50.2], [.2, 49.7], [-.3, 49.3], [-1.25, 49.65], [-1.9, 49.7], [-1.55, 48.65], [-2.2, 48.6], [-3.2, 48.85], [-4.7, 48.5], [-4.3, 48.0], [-3.4, 47.7], [-2.3, 47.25], [-2.0, 46.8], [-1.2, 46.2], [-1.15, 45.6], [-1.25, 44.6], [-1.5, 43.5], [-1.3, 43.1], [0, 42.75], [1.5, 42.45], [3.15, 42.45], [3.05, 42.95], [3.6, 43.35], [4.2, 43.5], [4.8, 43.35], [5.35, 43.25], [6.0, 43.1], [6.9, 43.45], [7.5, 43.8], [7.0, 44.25], [6.9, 45.0], [7.1, 45.85], [6.15, 46.2], [6.5, 46.45], [6.1, 46.75], [7.0, 47.45], [7.6, 47.6], [7.75, 48.5], [8.2, 48.95], [7.0, 49.15], [6.35, 49.45], [5.8, 49.55], [4.85, 49.85], [4.75, 50.15], [4.15, 50.25], [3.2, 50.75], [2.55, 51.1]];
const CITY = { PARIS: [2.35, 48.86], MARSEILLE: [5.37, 43.3], LYON: [4.83, 45.76], RENNES: [-1.68, 48.11], LILLE: [3.06, 50.63], LIMOGES: [1.26, 45.83] };
const LBL = { PARIS: [1, -1], MARSEILLE: [-1, 1], LYON: [1, 0], RENNES: [-1, -1], LILLE: [1, -1], LIMOGES: [-1, 0] };
const frP = (p, k) => [(p[0] - 1.8) * k * .69, -(p[1] - 46.8) * k];
function oPin(x, y, t, t0, o = {}) { const k = popEl(t, t0, .55); if (k <= 0) return ''; const c = o.col || RED, cur = o.cur;
  return (cur ? op(.5 * (1 - ((t - t0) % 1)), circ(x, y, 20 + 70 * ((t - t0) % 1), 'none', 6, c)) : '') + G(tr(x, y, k * (o.s || 1)), ell(0, 0, 18, 7, 'rgba(0,0,0,.3)', 0) + path('M0 0C-24 -34 -36 -52 -36 -72A36 36 0 1 1 36 -72C36 -52 24 -34 0 0Z', c, 6) + circ(0, -72, 13, '#fff', 0)); }
// cities = [[NOM, t0]] ; cur = ville courante ; route = [DE, VERS, t0, d]
function oFrance(cx, cy, k, t, o = {}) { let d = FR.map((p, i) => { const [x, y] = frP(p, k); return (i ? 'L' : 'M') + f1(x) + ' ' + f1(y); }).join('') + 'Z';
  const [cxo, cyo] = frP([9.15, 42.15], k); let s = G('translate(14 18)', path(d, 'rgba(0,0,0,.35)', 0)) + path(d, o.fill || SX.paper, 8) + path(`M${f1(cxo)} ${f1(cyo - k * .6)}Q${f1(cxo + k * .4)} ${f1(cyo - k * .2)} ${f1(cxo + k * .1)} ${f1(cyo + k * .6)}Q${f1(cxo - k * .35)} ${f1(cyo + k * .1)} ${f1(cxo)} ${f1(cyo - k * .6)}Z`, o.fill || SX.paper, 6);
  s += op(.12, path('M-200 -120Q0 -60 220 -140M-260 120Q0 60 260 160M-60 -300Q-20 0 -40 300', 'none', 5, NAVY));
  for (const [nm, t0] of o.cities || []) { const [x, y] = frP(CITY[nm], k), cur = nm === o.cur; s += oPin(x, y, t, t0, { cur, col: cur ? RED : '#7d8794', s: cur ? 1.15 : .8 }); }
  if (o.route) { const [a, b, t0, dd] = o.route, [x1, y1] = frP(CITY[a], k), [x2, y2] = frP(CITY[b], k), mx = (x1 + x2) / 2 + (y2 - y1) * .25, my = (y1 + y2) / 2 - (x2 - x1) * .25, kk = eInOut(seg(t, t0, t0 + (dd || .5)));
    if (kk > 0) { const L = Math.hypot(x2 - x1, y2 - y1) * 1.2; s += `<path d="M${f1(x1)} ${f1(y1 - 30)}Q${f1(mx)} ${f1(my - 30)} ${f1(x2)} ${f1(y2 - 30)}" fill="none" stroke="${RED}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${f1(L * kk)} ${f1(L * 2)}"/>`;
      const u = kk, px = (1 - u) * (1 - u) * x1 + 2 * u * (1 - u) * mx + u * u * x2, py = (1 - u) * (1 - u) * y1 + 2 * u * (1 - u) * my + u * u * y2 - 30; if (kk < 1) s += circ(px, py, 14, '#fff', 5); } }
  if (o.cur) { const [x, y] = frP(CITY[o.cur], k), [lx, ly] = LBL[o.cur]; const t0 = (o.cities.find(c => c[0] === o.cur) || [0, 0])[1]; s += oTag(x + lx * (o.cur.length * 14 + 60), y - 120 + ly * 30, o.cur, t, t0 - .05, { size: 40 }); }
  return G(tr(cx, cy, o.s || 1), s); }
function oMapBg(t, col = '#173055') { let s = rect(-M, -M, W + 2 * M, H + 2 * M, col, 0, 0); for (let i = -10; i < 30; i++) s += line(-M + i * 90, -M, -M + i * 90, H + M, 2, 'rgba(255,255,255,.05)') + line(-M, -M + i * 90, W + M, -M + i * 90, 2, 'rgba(255,255,255,.05)');
  for (let i = 0; i < 6; i++) s += path(`M${-200 + ((t * 30 + i * 300) % 1600)} ${1400 + i * 60}q40 -20 80 0t80 0`, 'none', 4, 'rgba(255,255,255,.1)'); return s + halftoneFade('#000', .15, 1); }
// plan de Paris (schéma) : rues grises, boulevards, Seine, parcs ; points nommés
const PM = { GDN: [560, 640], FSD: [585, 800], REP: [740, 900], BAR: [460, 600], PIG: [330, 640], CLI: [200, 690], ELY: [150, 1010], STOP: [300, 960], W0: [560, 840] };
const PMN = { GDN: 'Gare du Nord', FSD: 'Fg St-Denis', REP: 'République', BAR: 'Barbès', PIG: 'Pigalle', CLI: 'Clichy', ELY: 'Élysée' };
function oParisMap(t, o = {}) { const bg = rect(-M, -M, W + 2 * M, H + 2 * M, '#e9e3d6', 0, 0); let s = ''; const r = rng(4);
  for (let i = 0; i < 40; i++) s += rect(r() * 1300 - 120, 300 + r() * 1100, 60 + r() * 90, 40 + r() * 70, ['#ddd5c4', '#e2dccd', '#d8cfbd'][i % 3], 6, 0);
  for (let i = 0; i < 26; i++) { const x1 = r() * 1400 - 160, y1 = 380 + r() * 1000, a = r() * 3.14, L = 300 + r() * 600; s += line(x1, y1, x1 + Math.cos(a) * L, y1 + Math.sin(a) * L, 10, '#fff'); }
  s += ell(500, 820, 440, 330, 'none', 18, '#fff') + ell(500, 820, 440, 330, 'none', 3, '#d6cdb9');
  s += ell(180, 520, 120, 60, '#b9d9a0', 0) + ell(860, 560, 90, 70, '#b9d9a0', 0) + ell(980, 1060, 120, 80, '#b9d9a0', 0) + ell(90, 1140, 140, 70, '#b9d9a0', 0);
  s += path('M-200 1200Q100 1080 300 1150T700 1180T1300 1080', 'none', 46, '#8ec6e6') + path('M-200 1200Q100 1080 300 1150T700 1180T1300 1080', 'none', 4, '#6aa8cc');
  s += path(`M${PM.GDN[0] - 60} ${PM.GDN[1] - 40}l120 0l0 80l-120 0Z`, '#d6cdb9', 4);
  const show = o.points || []; for (const [key, t0] of show) { const [x, y] = PM[key], k = popEl(t, t0, .5); if (k <= 0) continue; const hi = key === o.hi; s += G(tr(x, y, k), circ(0, 0, hi ? 20 : 14, hi ? RED : NAVY, 5)) + op(k, G(tr(x + (key === 'FSD' || key === 'REP' ? 60 : 0), y - 34), ftext(0, 0, PMN[key], { size: hi ? 36 : 30, fill: NAVY, stroke: '#fff', sw: 8, anchor: key === 'FSD' || key === 'REP' ? 'start' : 'middle' }))); }
  for (const [pts, t0, dd, col] of o.routes || []) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(PM[pts[i]][0] - PM[pts[i - 1]][0], PM[pts[i]][1] - PM[pts[i - 1]][1]); const kk = eInOut(seg(t, t0, t0 + dd)); if (kk <= 0) continue;
    const dpath = 'M' + pts.map(p => PM[p].join(' ')).join('L'); s += `<path d="${dpath}" fill="none" stroke="${OL}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${f1(L * kk)} ${f1(L * 2)}"/><path d="${dpath}" fill="none" stroke="${col || RED}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${f1(L * kk)} ${f1(L * 2)}"/>`;
    let rem = L * kk, hx = PM[pts[0]][0], hy = PM[pts[0]][1], ang = 0; for (let i = 1; i < pts.length && rem > 0; i++) { const [ax, ay] = PM[pts[i - 1]], [bx, by] = PM[pts[i]], sl = Math.hypot(bx - ax, by - ay), u = Math.min(1, rem / sl); hx = ax + (bx - ax) * u; hy = ay + (by - ay) * u; ang = Math.atan2(by - ay, bx - ax); rem -= sl; }
    s += G(tr(hx, hy, 1, ang * 57.3), path('M-10 -22L26 0L-10 22Z', col || RED, 5)) + op(.9, oCrowd(hx - 30, hx + 30, hy + 10, .22, t, NAVY, 3)); }
  s += o.extra || ''; const [fx, fy] = o.f || [540, 820], z = o.z || 1;
  return bg + G(`translate(${CX} ${o.cy || 860}) scale(${z}) translate(${-fx} ${-fy})`, s); }

// ============================================================
//  PLANS
// ============================================================
// B001 — SIGNATURE : fond encre, carte de France en cut-out qui tremble sur « secoué », éclats rouges, titre cinétique
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(1, 'secoue') && t < at(1, 'secoue') + .5 ? 9 : 0 }),
  draw: (t, d, T) => { const S = at(1, 'secoue'), F = at(1, 'france') - .05, sh = t > S ? Math.sin(t * 50) * 10 * (1 - seg(t, S, S + .7)) : 0;
    return gridBg('#10131f') + halftoneFade(RED, .1, 1) + oShards(CX, 900, t, S, { r: 520, n: 16 }) + G(tr(CX + sh, 900, 1, sh * .3), cutout(oFrance(0, 0, 66, t, { cities: [] }), 12)) +
      (t > S ? op(seg(t, S, S + .15), path('M300 760L420 860L380 960L520 1020L560 1160', 'none', 6, RED)) : '') + oBreaking(225, t, .2) +
      kthin('VOICI LA JOURNÉE', CX, 340, t, .02, { size: 62 }) + kthin('QUI A SECOUÉ', CX, 425, t, S - .1, { size: 60 }) + kword('LA FRANCE', CX, 545, t, F, { size: 92, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'drum', .5], [at(1, 'secoue'), 'boom', .6], [at(1, 'secoue') + .05, 'crack', .5], [at(1, 'france') - .05, 'sting', .6]] });
// B002 — 17 OCTOBRE 2026 : date en slam, éphéméride, « hier »
B(2, { enter: 'none', trans: 'glitch', transD: .25, cam: zin(1.0, 1.07),
  draw: (t, d, T) => { const D = at(2, '17'), Y = at(2, '2026'), Hi = at(2, 'hier'), kc = popEl(t, D - .1, .5);
    return gridBg('#10131f') + halftoneFade(RED, .08, 1) + lightLeak(T, .25, RED) + oShards(CX, 820, t, D, { r: 460 }) +
      (kc > 0 ? G(tr(CX, 860, kc, -4), rect(-230 + 14, -250 + 18, 460, 500, OL, 30, 0) + rect(-230, -250, 460, 500, '#fff', 30, 7) + rect(-230, -250, 460, 120, RED, 30, 0) + rect(-230, -170, 460, 40, RED, 0, 0) + rect(-230, -250, 460, 500, 'none', 30, 7) + circ(-130, -250, 18, '#c8ced6', 5) + circ(130, -250, 18, '#c8ced6', 5) +
        ftext(0, -158, 'OCTOBRE', { size: 58, fill: '#fff', stroke: 'none' }) + ftext(0, 120, '17', { size: 260, fill: NAVY, stroke: 'none' })) : '') +
      kword('17 OCTOBRE', CX, 430, t, D, { size: 100, fill: '#fff' }) + kword('2026', CX, 560, t, Y, { size: 96, fill: SX.acc2 }) + funTag(CX + 250, 1150, 'HIER', t, Hi - .05, { size: 54, bg: RED }); },
  sfx: [[at(2, '17'), 'boom', .6], [at(2, 'octobre'), 'pop_hi', .4], [at(2, '2026'), 'flash_hit', .5], [at(2, 'hier') - .05, 'tick', .6]] });
// B003 — 7 HEURES. PARIS : grande horloge qui file jusqu'à 7 h, toits de Paris à l'aube
B(3, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.0, 1.05),
  draw: (t, d, T) => { const P = at(3, 'paris'), mins = lerp(0, 7 * 60, eOutCubic(seg(t, 0, .45)));
    return oSky(t, 'dawn') + op(.85, dSkyline(1150, '#5a5f8a', 21, 'rgba(255,220,140,.5)')) + G(tr(820, 1150, .7), path('M-60 0L-10 -560L10 -560L60 0Z', '#3e4170', 5) + line(-40, -200, 40, -200, 6, '#3e4170') + line(-26, -380, 26, -380, 5, '#3e4170')) +
      oFacade(-40, 1250, 360, 560, 'haus', 3, t, { shop: false }) + oFacade(760, 1250, 360, 600, 'haus', 5, t, { shop: false }) + rect(-M, 1250, W + 2 * M, 900, '#3a3d55', 0, 0) +
      G(tr(CX, 860), circ(0, 0, 230, NAVY, 0) + oClock(0, 0, 210, mins, { ticks: 1, mc: RED })) + kword('7 H 00', CX, 470, t, .3, { size: 110, fill: '#fff' }) + oHud(t, '07 H 00', 'PARIS', { t0: P - .05, min: 420 }); },
  sfx: [[0, 'clock_fast', .5], [.3, 'drum', .5], [at(3, 'paris') - .05, 'pop_hi', .5]] });
// B004a — une centaine de personnes cagoulées : rue de Paris au petit matin, groupe de silhouettes cagoulées
const o4 = at(4, 'prennent') - .15;
B(4, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const C = at(4, 'centaine'), Cg = at(4, 'cagoulees'); let g = '';
    for (let i = 0; i < 6; i++) g += oHooded(i, { x: 110 + i * 175, y: 1430 + (i % 2) * 70, s: 1.0 + (i % 2) * .08, walk: 2, flip: i > 2 ? 1 : 0 }, t + i * .2);
    return depth({ zoom: 1, x: Math.sin(t * .6) * 10 }, [{ z: 1.5, svg: oStreet(t, { sky: 'dawn', kiosk: 1, seed: 1 }), haze: .1 }, { z: 1.2, svg: oCrowd(-100, 1200, 1300, .9, t, '#2a2a38', 5) }, { z: 1, svg: g }, { z: .6, svg: oFg('barrier', t) }]) +
      oHud(t, '07 H 00', 'PARIS', { min: 420 }) + oNumCard(CX, 560, `≈ ${counter(0, 100, t, C, .7)}`, 'PERSONNES', t, C - .1, { w: 460, h: 210, size: 110 }) + oTag(CX, 760, 'CAGOULÉES', t, Cg, { size: 46 }); },
  sfx: [[0, 'steps', .5], [at(4, 'centaine') - .1, 'pop_hi', .5], [at(4, 'centaine'), 'typing', .4], [at(4, 'cagoulees'), 'sting', .5]] });
// B004b — cible : les accès du siège de CNews (immeuble de bureaux générique, enseigne texte)
B(4, { enter: 'none', trans: 'push', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 1250 }),
  draw: (t, d, T) => { const Ci = at(4, 'cible') - o4, Ac = at(4, 'acces') - o4, Si = at(4, 'siege') - o4; let g = '';
    for (let i = 0; i < 5; i++) g += oHooded(i + 1, { x: 120 + i * 210 + (t * 20), y: 1560 + (i % 2) * 60, s: 1.1, walk: 2 }, t + i * .3);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: oSky(t, 'dawn') + op(.7, dSkyline(1080, SKYFAR.dawn, 4)) + oFacade(-300, 1250, 300, 700, 'haus', 2, t) + oFacade(1080, 1250, 300, 700, 'haus', 4, t) + oCnews(CX, 1250, t) + dSidewalk(1250, false) + dLampPost(40, 1290, 1) + dLampPost(1040, 1290, 1), haze: .05 }, { z: 1, svg: g }]) +
      funBox(CX, 1120, 640, 290, t, Ac, { label: 'accès', col: RED }) + markerArrow(860, 720, 700, 920, t, Ci, { col: SX.acc2 }) + oHud(t, '07 H 00', 'PARIS', { min: 420 }) + oTag(CX, 520, 'SIÈGE DE CNEWS', t, Si, { size: 48 }); },
  sfx: [[0, 'whoosh', .5], [at(4, 'cible') - o4, 'scratch', .4], [at(4, 'acces') - o4, 'tick', .6], [at(4, 'siege') - o4, 'pop_hi', .5], [at(4, 'cnews') - o4, 'sting', .4]] }, o4);
// B005 — vitres brisées : insert sur la porte vitrée, étoiles de fissure
B(5, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.04, shake: t < .4 ? 6 : 0 }),
  draw: (t, d, T) => { const V = at(5, 'vitre'), Bz = at(5, 'brise');
    return grad('#9fc0d6', '#d7e8f2', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, -M, 300 + M, H + 2 * M, '#5d6e80', 0, 0) + rect(780, -M, 300 + M, H + 2 * M, '#5d6e80', 0, 0) + rect(300, -100, 480, 2200, '#b9d6e8', 0, 8) + line(540, -100, 540, 2100, 8) + op(.4, path('M330 200L460 200L340 900L330 900Z', '#fff', 0)) + rect(480, 800, 30, 160, '#c8ced6', 10, 5) + rect(570, 800, 30, 160, '#c8ced6', 10, 5) +
      op(.6, ftext(CX, 600, 'CNEWS', { size: 70, fill: '#fff', stroke: 'none' })) + oCrack(420, 780, 1.4, seg(t, V, V + .12), 2) + oCrack(660, 1040, 1.6, seg(t, Bz, Bz + .12), 5) + oCrack(440, 1150, .9, seg(t, Bz + .15, Bz + .25), 8) +
      oHud(t, '07 H 00', 'PARIS', { min: 420 }) + kword('VITRES BRISÉES', CX, 470, t, V, { size: 84, fill: '#fff' }); },
  sfx: [[at(5, 'vitre'), 'crack', .8], [at(5, 'brise'), 'crack', .8], [at(5, 'brise') + .15, 'crack', .5], [at(5, 'brise') + .2, 'thud', .4]] });
// B006 — projectiles : objets qui volent vers la façade (cailloux, bouteilles), traînées
B(6, { enter: 'whip', cam: (t, d) => ({ z: 1.05, hand: .6 }),
  draw: (t, d, T) => { const P = at(6, 'projectile'); let pr = ''; for (let i = 0; i < 6; i++) { const k = seg(t, P - .2 + i * .07, P + .35 + i * .07); if (k <= 0 || k >= 1) continue; const x = lerp(-80 + i * 60, 520 + i * 60, k), y = lerp(1400 - i * 30, 760 + i * 60, k) - Math.sin(k * 3.14) * 260; pr += motionLines(x - 60, y + 30, 3, 70, 200) + (i % 2 ? oBottle(x, y, 1.1, k * 400) : oRock(x, y, 1.3, k * 300)); }
    return depth({ zoom: 1 }, [{ z: 1.3, svg: oSky(t, 'dawn') + oCnews(CX + 140, 1250, t, { cracks: oCrack(CX + 60, 1080, .9, 1, 3) }) + dSidewalk(1250, false), haze: .05 }, { z: 1, svg: pr }]) + oHud(t, '07 H 00', 'PARIS', { min: 420 }) + kword('PROJECTILES', CX, 500, t, P, { size: 92, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [at(6, 'projectile') - .1, 'whoosh', .6], [at(6, 'projectile') + .3, 'thud', .6], [at(6, 'projectile') + .45, 'crack', .4]] });
// B007 — la police intervient : ligne de CRS casqués avec boucliers, fourgon, gyrophares
B(7, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 1300 }),
  draw: (t, d, T) => { const P = at(7, 'police'), adv = eOutCubic(seg(t, P, P + .8)); let g = '';
    for (let i = 0; i < 5; i++) g += oCrs({ x: 110 + i * 210, y: 1520 + (i % 2) * 40 - adv * 30, s: 1.05, walk: adv < 1 ? 2 : 0 }, t + i * .2);
    return depth({ zoom: 1 }, [{ z: 1.5, svg: oStreet(t, { sky: 'dawn', seed: 3, cars: false }) + oVan(260, 1360, .9, t) + oVan(840, 1370, .9, t, 1), haze: .08 }, { z: 1, svg: g }, { z: .6, svg: oFg('cone', t) }]) +
      op(.25 * (Math.sin(t * 14) > 0), rect(-M, -M, W + 2 * M, H + 2 * M, '#3f7fff', 0, 0)) + oHud(t, '07 H 00', 'PARIS', { min: 420 }) + kword('LA POLICE INTERVIENT', CX, 500, t, P - .05, { size: 66, fill: '#fff' }); },
  sfx: [[0, 'siren', .5], [at(7, 'police'), 'steps', .6], [at(7, 'intervient'), 'drum', .5], [at(7, 'intervient') + .3, 'thud', .4]] });
// B008 — 21 interpellations : compteur, menottes
B(8, { enter: 'none', trans: 'zoom', transD: .22, cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const N = at(8, '21'); return blur(10, oStreet(t, { sky: 'dawn', seed: 3 }) + oVan(CX, 1380, 1.2, t)) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, NAVY, 0, 0)) + oHud(t, '07 H 00', 'PARIS', { min: 420 }) +
    oNumCard(CX, 780, `${counter(0, 21, t, N - .1, .6)}`, 'INTERPELLATIONS', t, N - .15, { w: 600, h: 380, size: 230 }) + G(tr(CX, 1070, popEl(t, N + .3, .5), wave(t, .7, 5)), oCuffs(0, 0, 1.3)); },
  sfx: [[at(8, '21') - .15, 'pop_hi', .5], [at(8, '21'), 'ding', .6], [at(8, 'interpellations'), 'typing', .4], [at(8, '21') + .3, 'thud', .3]] });
// B009a — en fin de matinée : l'horloge file, le ciel s'éclaire
const o9 = at(9, 'cortege') - .15;
B(9, { enter: 'none', trans: 'up', transD: .25, cam: zin(1.0, 1.05),
  draw: (t, d, T) => { const mins = lerp(420, 690, eInOut(seg(t, 0, d))); return oSky(t, 'day') + op(.85, dSkyline(1150, SKYFAR.day, 22)) + oFacade(-40, 1250, 360, 560, 'haus', 3, t, { shop: false }) + oFacade(760, 1250, 360, 600, 'haus', 5, t, { shop: false }) + rect(-M, 1250, W + 2 * M, 900, '#9aa0aa', 0, 0) +
    G(tr(CX, 860), circ(0, 0, 230, NAVY, 0) + oClock(0, 0, 210, mins, { ticks: 1, mc: RED })) + kthin('en fin de', CX, 440, t, at(9, 'fin') - .05, { size: 60 }) + kword('MATINÉE', CX, 555, t, at(9, 'matinee') - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'clock_fast', .5], [at(9, 'matinee') - .05, 'drum', .5], [at(9, 'matinee') + .3, 'tick', .4]] });
// B009b — un cortège sauvage part de la gare du Nord
B(9, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.08, 1.0, eInOut(clamp(t / d))) }),
  draw: (t, d, T) => { const Sv = at(9, 'sauvage') - o9, Gn = at(9, 'garde') - o9; let g = '';
    for (let i = 0; i < 6; i++) g += (i % 3 === 0 ? oHooded(i, { x: 80 + i * 190 + t * 40, y: 1500 + (i % 2) * 70, s: 1, walk: 3 }, t + i * .2) : oCivil(i, { x: 80 + i * 190 + t * 40, y: 1500 + (i % 2) * 70, s: 1, walk: 3, expr: 'worried' }, t + i * .2));
    return depth({ zoom: 1, x: Math.sin(t * .5) * 10 }, [{ z: 1.5, svg: oSky(t, 'day') + oGareNord(t) + dSidewalk(1250, false), haze: .06 }, { z: 1.2, svg: oCrowd(-100, 1200, 1320, .85, t, '#3a3f55', 8, { walk: 30 }) }, { z: 1, svg: g }]) +
      oHud(t, 'FIN MATINÉE', 'PARIS', { min: 690 }) + oTag(CX, 500, 'CORTÈGE SAUVAGE', t, Sv - .05, { size: 46 }) + markerArrow(260, 620, 120, 760, t, Gn, { col: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(9, 'cortege') - o9, 'steps', .6], [at(9, 'sauvage') - o9, 'pop_hi', .5], [at(9, 'garde') - o9, 'scratch', .4]] }, o9);
// B010 — direction rue du Faubourg-Saint-Denis : plan de Paris, trajet, plaque de rue
B(10, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Di = at(10, 'direction'), Fb = at(10, 'faubourg');
    return oParisMap(t, { z: 2.0, f: [575, 720], cy: 900, points: [['GDN', 0], ['FSD', Fb]], hi: 'FSD', routes: [[['GDN', 'FSD'], Di, Fb - Di + .4]] }) + oHud(t, 'FIN MATINÉE', 'PARIS', { min: 690 }) +
      G(tr(CX, 470, popEl(t, Fb - .1, .5), -2), rect(-370 + 10, -90 + 12, 740, 180, OL, 24, 0) + rect(-370, -90, 740, 180, '#1d3f8a', 24, 8) + rect(-350, -70, 700, 140, 'none', 16, 5, '#fff') + ftext(0, -20, 'RUE DU FAUBOURG', { size: 46, fill: '#fff', stroke: 'none' }) + ftext(0, 42, 'SAINT-DENIS', { size: 54, fill: '#fff', stroke: 'none' })) +
      kthin('direction', CX, 640, t, Di, { size: 50, fill: NAVY, out: Fb - .2 }); },
  sfx: [[at(10, 'direction'), 'whoosh', .5], [at(10, 'faubourg') - .1, 'pop', .5], [at(10, 'saint'), 'tick', .4], [at(10, 'denis'), 'tick', .4]] });
// B011 — place de la République : statue, foule qui arrive
B(11, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), cy: 1100 }),
  draw: (t, d, T) => { const Rp = at(11, 'republique'); return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.4, svg: oRepublique(t), haze: .06 }, { z: 1, svg: oCrowd(-100, 1200, 1500, 1.3, t, '#33384d', 11, { flags: 1 }) + oCrowd(-60, 1200, 1640, 1.6, t, '#262a3a', 12) }]) +
    oHud(t, 'FIN MATINÉE', 'PARIS', { min: 690 }) + oTag(CX, 500, 'PLACE DE LA RÉPUBLIQUE', t, Rp - .1, { size: 42 }); },
  sfx: [[0, 'steps', .5], [at(11, 'place'), 'whoosh', .4], [at(11, 'republique') - .1, 'pop_hi', .5]] });
// B012 — les tensions montent : face-à-face, jauge qui monte
B(12, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .5 }),
  draw: (t, d, T) => { const Tn = at(12, 'tensions'), Mo = at(12, 'montent'), k = eOutCubic(seg(t, Tn, Mo + .6)); let g = '';
    for (let i = 0; i < 3; i++) g += oCrs({ x: 680 + i * 160, y: 1500 + i * 30, s: 1.0, flip: 1 }, t + i);
    for (let i = 0; i < 3; i++) g += oHooded(i, { x: 80 + i * 150, y: 1520 + (i % 2) * 40, s: 1.0 }, t + i * .4);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: oRepublique(t), haze: .1 }, { z: 1, svg: g }]) + op(.18 * k, rect(-M, -M, W + 2 * M, H + 2 * M, RED, 0, 0)) + oHud(t, 'FIN MATINÉE', 'PARIS', { min: 690 }) +
      G(tr(CX, 640), bar(0, 0, 560, k, { col: RED, bg: 'rgba(20,24,43,.6)' }) + ftext(-280, -40, 'TENSION', { size: 34, fill: '#fff', anchor: 'start' })) + kword('LES TENSIONS MONTENT', CX, 500, t, Tn, { size: 64, fill: '#fff' }); },
  sfx: [[at(12, 'tensions'), 'heartbeat', .6], [at(12, 'montent'), 'whoosh_up', .5], [at(12, 'montent') + .3, 'drum', .4]] });
// B013 — gaz lacrymogènes : nuages gris-vert qui envahissent la place, grenades
B(13, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .6 }),
  draw: (t, d, T) => { const Gz = at(13, 'gaz'), k = eOutCubic(seg(t, Gz - .1, Gz + 1.4)); let cans = ''; for (let i = 0; i < 3; i++) { const kk = seg(t, Gz - .3 + i * .15, Gz + .2 + i * .15); if (kk > 0 && kk < 1) cans += oCanister(lerp(900, 300 + i * 200, kk), lerp(800, 1250, kk) - Math.sin(kk * 3.14) * 300, 1, kk * 500) + oSmoke(lerp(900, 300 + i * 200, kk), lerp(800, 1250, kk), t, .3, 3, '#cfd6be', i); }
    return depth({ zoom: 1 }, [{ z: 1.4, svg: oRepublique(t), haze: .1 }, { z: 1, svg: oCrowd(-100, 1200, 1500, 1.3, t, '#33384d', 13) + oCivil(1, { x: 260, y: 1560, s: 1.15, expr: 'worried', armL: [-130, -40], look: [1, 0] }, t) + oCivil(3, { x: 820, y: 1580, s: 1.1, expr: 'scared', flip: 1, armR: [-50, -140] }, t) }]) +
      cans + oGas(300, 1150, t, k, 1, 1.3) + oGas(760, 1100, t, k * .9, 2, 1.2) + oGas(CX, 900, t, seg(t, Gz + .5, d) * .9, 3, 1.4) + oHud(t, 'FIN MATINÉE', 'PARIS', { min: 690 }) + oTag(CX, 500, 'GAZ LACRYMOGÈNES', t, at(13, 'lacrymo') - .1, { size: 46, bar: '#6b7a5a' }); },
  sfx: [[at(13, 'gaz') - .3, 'whoosh', .5], [at(13, 'gaz'), 'spray', .6], [at(13, 'lacrymo'), 'spray', .4], [at(13, 'sortie'), 'wind', .4]] });
// B014 — 14 H 30 : horloge à volets
B(14, { enter: 'none', trans: 'glitch', transD: .2, cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const fl = (str, x, t0) => { const k = seg(t, t0, t0 + .25); return G(tr(x, 880), rect(-110, -150, 220, 300, '#1d2238', 18, 7) + line(-110, 0, 110, 0, 6, '#0d101c') + G(`scale(1 ${f1(k < .5 ? 1 - 2 * k : 2 * k - 1)})`, ftext(0, 70, str, { size: 210, fill: '#fff', stroke: 'none' }))); };
    return gridBg('#10131f') + halftoneFade(RED, .08, 1) + G('translate(540 880) scale(.78) translate(-540 -880)', fl('1', 180, 0) + fl('4', 420, .06) + circ(CX, 840, 14, '#fff', 0) + circ(CX, 920, 14, '#fff', 0) + fl('3', 660, .12) + fl('0', 900, .18)) + oHud(t, '14 H 30', 'PARIS', { min: 870, spin: 1 }) + kthin('début d\'après-midi', CX, 520, t, .05, { size: 54 }); },
  sfx: [[0, 'clock_fast', .5], [.05, 'tick', .6], [.2, 'tick', .6], [at(14, '14h30') + .1, 'drum', .5]] });
// B015a — le cortège principal s'élance vers Barbès : grande foule avec drapeaux, plongée
const o15 = at(15, 'pigalle') - .15;
B(15, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const Pr = at(15, 'principal'), Ba = at(15, 'barbes'); let g = ''; for (let i = 0; i < 5; i++) g += oCivil(i + 2, { x: 100 + i * 220 + t * 30, y: 1560 + (i % 2) * 50, s: 1.1, walk: 3, expr: i % 2 ? 'neutral' : 'suspicious', armR: i === 1 ? [-70, -100] : undefined, holdR: i === 1 ? G('', line(0, 0, 0, -260, 8) + path(`M0 -260L${f1(110 + wave(t, 1.4, 10))} -250L${f1(110 + wave(t, 1.4, 10))} -170L0 -180Z`, '#5b8fd8', 5)) : undefined }, t + i * .2);
    return depth({ zoom: 1, x: Math.sin(t * .5) * 12 }, [{ z: 1.5, svg: oStreet(t, { sky: 'day', seed: 6, metro: 1, cars: false }), haze: .06 }, { z: 1.2, svg: oCrowd(-150, 1250, 1340, .9, t, '#4a5068', 14, { flags: 1, walk: 40 }) + oCrowd(-150, 1250, 1420, 1.05, t, '#3a3f55', 15, { flags: 1, walk: 50 }) }, { z: 1, svg: g }]) +
      oHud(t, '14 H 30', 'PARIS', { min: 870 }) + oTag(CX, 500, 'CORTÈGE PRINCIPAL', t, Pr - .1, { size: 46 }) + funTag(CX + 160, 640, '→ BARBÈS', t, Ba - .05, { size: 46, bg: RED }); },
  sfx: [[0, 'steps', .6], [at(15, 'principal') - .1, 'pop_hi', .5], [at(15, 'elance'), 'whoosh', .5], [at(15, 'barbes') - .05, 'pop', .5]] });
// B015b — Pigalle et la place de Clichy : trajet sur le plan
B(15, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Pg = at(15, 'pigalle') - o15, Cl = at(15, 'clich') - o15;
    return oParisMap(t, { z: 1.55, f: [440, 680], points: [['GDN', 0], ['REP', 0], ['BAR', 0], ['PIG', Pg], ['CLI', Cl]], hi: 'CLI', routes: [[['GDN', 'BAR'], -1, .1], [['BAR', 'PIG', 'CLI'], 0, Cl + .3]] }) + oHud(t, '14 H 30', 'PARIS', { min: 870 }) +
      kthin('Barbès → Pigalle →', CX, 470, t, 0, { size: 52, fill: NAVY }) + kword('PLACE DE CLICHY', CX, 1150, t, Cl, { size: 74, fill: '#fff' }); },
  sfx: [[at(15, 'pigalle') - o15, 'pop_hi', .5], [at(15, 'pigalle') - o15 + .1, 'whoosh', .4], [at(15, 'clich') - o15, 'pop', .6], [at(15, 'clich') - o15 + .1, 'ding', .4]] }, o15);
// B016 — mais derrière lui, à République… : retour sur la place, fumée qui monte
B(16, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Dr = at(16, 'derriere'), Rp = at(16, 'republique'), k = seg(t, Dr, Rp + .6);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: oRepublique(t, { sky: 'late' }) + op(k, oSmoke(220, 1150, t, 1.3, 7, '#4a4550', 2) + oSmoke(880, 1180, t, 1.1, 6, '#55505a', 4)), haze: .08 }, { z: 1, svg: oCrowd(-100, 1200, 1560, 1.4, t, '#2a2e40', 16) }]) +
      oHud(t, '14 H 30', 'PARIS', { min: 870 }) + kthin('pendant ce temps…', CX, 480, t, at(16, 'mais'), { size: 54 }) + oTag(CX, 600, 'RÉPUBLIQUE', t, Rp - .05, { size: 50 }); },
  sfx: [[0, 'whoosh', .5], [at(16, 'derriere'), 'sting', .5], [at(16, 'republique') - .05, 'pop_hi', .4], [at(16, 'republique') + .3, 'wind', .4]] });
// B017 — des véhicules brûlent : voitures stylisées en flammes, fumée noire
B(17, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .7 }),
  draw: (t, d, T) => { const Br = at(17, 'brulent'), k = .5 + .5 * eOutCubic(seg(t, 0, Br + .3));
    return depth({ zoom: 1 }, [{ z: 1.5, svg: oRepublique(t, { sky: 'late' }) + oSmoke(CX, 900, t, 1.6, 8, '#3a3540', 5), haze: .12, hazeCol: '#5a4a50' }, { z: 1, svg: dCar(280, 1390, 1.15, '#7a8a9a') + oFire(280, 1190, 330 * k, 300 * k, t, 1) + dCar(820, 1420, 1.1, '#9a8a7a', 1) + oFire(820, 1220, 300 * k, 280 * k, t, 2) + oEmbers(CX, 1200, t, 12, 900) }]) +
      oHud(t, '14 H 30', 'PARIS', { min: 870 }) + kword('VÉHICULES EN FEU', CX, 520, t, at(17, 'vehicules') - .05, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'boom', .5], [at(17, 'vehicules'), 'fire', .7], [at(17, 'brulent'), 'whoosh_up', .5], [at(17, 'brulent') + .3, 'sizzle', .4]] });
// B018 — le canon à eau entre en action
B(18, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const Ca = at(18, 'canon'), Ac = at(18, 'action'), k = seg(t, at(18, 'entre') - .2, at(18, 'entre') + .2);
    return depth({ zoom: 1 }, [{ z: 1.5, svg: oRepublique(t, { sky: 'late' }) + oSmoke(800, 1100, t, 1.2, 6, '#3a3540', 6), haze: .1 }, { z: 1, svg: oWaterCannon(330, 1450, 1.0, t, k) + (k > 0 ? oFire(860, 1500, 220 * (1 - k * .7), 240 * (1 - k * .7), t, 3) + op(k, oSmoke(860, 1400, t, .7, 5, '#e8eef4', 2)) : oFire(860, 1500, 220, 240, t, 3)) }]) +
      oHud(t, '14 H 30', 'PARIS', { min: 870 }) + oTag(CX, 500, 'CANON À EAU', t, Ca - .05, { size: 54, bar: BLUE }); },
  sfx: [[at(18, 'canon') - .05, 'pop_hi', .5], [at(18, 'eau'), 'siren', .3], [at(18, 'entre') - .2, 'spray', .8], [at(18, 'action') + .3, 'sizzle', .5]] });
// B019a — à l'ouest, un autre cortège, non déclaré : flèche vers l'ouest sur le plan, tampon
const o19 = at(19, 'tente') - .15;
B(19, { enter: 'none', trans: 'zoom', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Ou = at(19, 'ouest'), Au = at(19, 'autre'), Nd = at(19, 'non');
    return oParisMap(t, { z: 1.35, f: [430, 820], points: [['GDN', 0], ['REP', 0], ['CLI', 0], ['ELY', 0]], routes: [[['GDN', 'BAR', 'PIG', 'CLI'], -1, .1], [['W0', 'ELY'], Au, 1.4, '#ff9a1a']] }) +
      G(tr(900, 1060, popEl(t, Ou - .1, .5)), circ(0, 0, 80, '#fff', 6) + ftext(0, -30, 'N', { size: 34, fill: RED, stroke: 'none' }) + path('M0 -20L-60 0L0 20Z', RED, 4) + ftext(-40, 60, 'OUEST', { size: 24, fill: NAVY, stroke: 'none' })) +
      oHud(t, '14 H 30', 'PARIS', { min: 870 }) + kthin("à l'ouest, un autre cortège", CX, 470, t, Ou, { size: 50, fill: NAVY }) + stampX(CX, 640, 'NON DÉCLARÉ', t, Nd); },
  sfx: [[at(19, 'ouest') - .1, 'whoosh', .5], [at(19, 'autre'), 'tick', .4], [at(19, 'non'), 'thud', .7], [at(19, 'declare'), 'scratch', .3]] });
function stampX(x, y, str, t, t0, col = RED, r = -10) { const k = seg(t, t0, t0 + .18); if (k <= 0) return ''; const s = lerp(2.2, 1, eOutCubic(k)), w = str.length * 34 + 60; return G(tr(x, y, s, r), rect(-w / 2, -50, w, 100, 'rgba(255,255,255,.75)', 14, 0) + rect(-w / 2, -50, w, 100, 'none', 14, 10, col) + ftext(0, 22, str, { size: 60, fill: col, stroke: 'none' })); }
// B019b — tente de rejoindre l'Élysée : le palais (grille dorée, drapeaux), groupe qui approche
B(19, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), cy: 1200 }),
  draw: (t, d, T) => { const El = at(19, 'elysee') - o19; let g = ''; for (let i = 0; i < 4; i++) g += oHooded(i + 2, { x: 140 + i * 250 + t * 30, y: 1600 + (i % 2) * 40, s: 1.05, walk: 3 }, t + i * .3);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: oElysee(t), haze: .06 }, { z: 1, svg: oCrowd(-100, 1200, 1460, 1.0, t, '#3a3f55', 19, { walk: 30 }) + g }]) + oHud(t, '14 H 30', 'PARIS', { min: 870 }) + oTag(CX, 500, "CAP SUR L'ÉLYSÉE", t, El - .1, { size: 48 }); },
  sfx: [[0, 'steps', .6], [at(19, 'rejoindre') - o19, 'whoosh', .4], [at(19, 'elysee') - o19 - .1, 'pop_hi', .5]] }, o19);
// B020 — stoppé à moins de 500 m du palais : barrage sur le plan + mesure
B(20, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const St = at(20, 'stoppe'), F5 = at(20, '500'); const kb = popEl(t, St, .5);
    const ex = (kb > 0 ? G(tr(PM.STOP[0] - 10, PM.STOP[1] - 10, kb * .55, 30), rect(-80, -20, 160, 40, '#fff', 8, 6) + [0, 1, 2].map(i => rect(-74 + i * 54, -16, 30, 32, RED, 0, 0)).join('') + rect(-80, -20, 160, 40, 'none', 8, 6)) : '') +
      (t > F5 ? markerPath(`M${PM.STOP[0] - 40} ${PM.STOP[1] + 30}L${PM.ELY[0] + 20} ${PM.ELY[1] + 10}`, t, F5, { col: SX.acc2, w: 6, len: 300 }) : '');
    return oParisMap(t, { z: 2.2, f: [240, 950], cy: 860, points: [['ELY', 0]], hi: 'ELY', routes: [[['W0', 'STOP'], -1, .1, '#ff9a1a']], extra: ex }) +
      oNumCard(CX, 1080, `< ${counter(0, 500, t, F5 - .1, .6)} m`, 'DU PALAIS', t, F5 - .15, { w: 440, h: 190, size: 76, r: -3 }) + kword('STOPPÉ', CX, 500, t, St - .05, { size: 100, fill: RED }) + oHud(t, '14 H 30', 'PARIS', { min: 870 }); },
  sfx: [[at(20, 'stoppe') - .05, 'thud', .8], [at(20, 'stoppe'), 'sting', .4], [at(20, '500') - .1, 'typing', .4], [at(20, 'metres'), 'ding', .5]] });
// B021 — changement de ville : Marseille (carte de France, trajet Paris → Marseille)
B(21, { enter: 'none', trans: 'zoom', transD: .28, cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const Ma = at(21, 'marseille'); return oMapBg(t) + oFrance(CX, 860, 62, t, { cities: [['PARIS', -1], ['MARSEILLE', Ma - .05]], cur: t > Ma - .05 ? 'MARSEILLE' : null, route: ['PARIS', 'MARSEILLE', at(21, 'changement'), Ma - at(21, 'changement')] }) +
    kthin('changement de ville', CX, 450, t, 0, { size: 56 }) + oHud(t, '17 OCT', null, {}); },
  sfx: [[0, 'whoosh', .6], [at(21, 'ville'), 'whoosh_up', .4], [at(21, 'marseille') - .05, 'pop', .7], [at(21, 'marseille'), 'ding', .4]] });
// B022 — un poste de police municipale vandalisé (rue marseillaise, Notre-Dame-de-la-Garde au loin)
function oPostePM(x, yb, t, k) { return rect(x - 300, yb - 520, 600, 520, '#f0e4cc', 4, 6) + rect(x - 320, yb - 540, 640, 36, '#c25b3a', 4, 5) + rect(x - 250, yb - 470, 500, 70, '#2f4fa8', 8, 5) + ftext(x, yb - 422, 'POLICE MUNICIPALE', { size: 36, fill: '#fff', stroke: 'none' }) +
  rect(x - 250, yb - 370, 200, 160, '#bcd6ea', 4, 5) + rect(x + 50, yb - 370, 200, 160, '#bcd6ea', 4, 5) + rect(x - 80, yb - 200, 160, 200, '#2f4fa8', 4, 5) + oCrack(x - 150, yb - 290, .7, seg(k, 0, .3), 3) + oCrack(x + 150, yb - 300, .8, seg(k, .3, .6), 6) +
  (k > .5 ? op(seg(k, .5, .8), path(`M${x - 280} ${yb - 120}q40 -40 80 0t80 0t60 -20M${x + 120} ${yb - 160}q30 30 60 0t60 10`, 'none', 10, '#6a6a6a')) : '') + G(tr(x + 240, yb + 10, 1, k > .6 ? 80 : 0), dBin(0, 0, .7, '#2f6a3a')); }
B(22, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d) }),
  draw: (t, d, T) => { const Po = at(22, 'poste'), Va = at(22, 'vandalise'), k = seg(t, Va - .3, Va + .7);
    return depth({ zoom: 1, x: Math.sin(t * .6) * 10 }, [{ z: 1.5, svg: oStreet(t, { sky: 'warm', kinds: ['ochre', 'pink'], seed: 4, far: oNDGarde(820, 760, .8), signs: ['SAVON', 'PANISSE', 'CAFÉ', 'MARINE'], facades: true }), haze: .08 }, { z: 1, svg: oPostePM(CX, 1270, t, k) + oHooded(1, { x: 160, y: 1600, s: 1.05, armR: [-40, -80] }, t) + oHooded(3, { x: 930, y: 1620, s: 1.05, flip: 1 }, t) }, { z: .6, svg: oFg('bush', t) }]) +
      oHud(t, '17 OCT', 'MARSEILLE') + oTag(CX, 520, 'POSTE DE POLICE MUNICIPALE', t, Po, { size: 38 }) + stampX(CX, 680, 'VANDALISÉ', t, Va); },
  sfx: [[at(22, 'poste'), 'pop_hi', .5], [at(22, 'vandalise') - .3, 'crack', .7], [at(22, 'vandalise'), 'thud', .6], [at(22, 'vandalise') + .2, 'spray', .4]] });
// B023 — on force les portes de l'hôtel de ville (Vieux-Port)
B(23, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 1050 }),
  draw: (t, d, T) => { const Fo = at(23, 'forcent'), Ho = at(23, 'hotel'), pk = t > Fo ? Math.abs(Math.sin((t - Fo) * 9)) * seg(t, Fo, Fo + .2) : 0; let g = ''; for (let i = 0; i < 4; i++) g += oHooded(i, { x: 330 + i * 140, y: 1440 + (i % 2) * 40, s: 1.0, flip: i > 1 ? 1 : 0, armR: [-60, -60], armL: [-120, -120] }, t + i * .1);
    return depth({ zoom: 1 }, [{ z: 1.3, svg: oMarseilleHDV(t, { push: pk }), haze: .04 }, { z: 1, svg: g }]) + oHud(t, '17 OCT', 'MARSEILLE') + oTag(CX, 430, 'HÔTEL DE VILLE', t, Ho - .05, { size: 46 }) + (t > Fo ? motionLines(CX - 160, 1000, 3, 60, 0, '#fff') + motionLines(CX + 160, 1000, 3, 60, 180, '#fff') : ''); },
  sfx: [[at(23, 'individus'), 'steps', .5], [at(23, 'forcent'), 'thud', .8], [at(23, 'forcent') + .35, 'thud', .7], [at(23, 'hotel') - .05, 'pop_hi', .4]] });
// B024 — des commerces pillés : vitrines fissurées, rideaux métalliques forcés
B(24, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: .6 }),
  draw: (t, d, T) => { const Pi = at(24, 'pilles'); let g = ''; for (let i = 0; i < 3; i++) { const x = 200 + i * 340 + ((t * 120 * (i % 2 ? -1 : 1)) % 200); g += oHooded(i + 1, { x, y: 1560, s: 1.05, walk: 4, flip: i % 2, holdR: dBoxS(), holdRrot: 0 }, t + i * .3); }
    return depth({ zoom: 1 }, [{ z: 1.4, svg: oStreet(t, { sky: 'warm', kinds: ['ochre', 'pink'], seed: 8, shutters: 1, cracks: 1, signs: ['MODE', 'TÉLÉPHONIE', 'CHAUSSURES', 'BIJOUX'], cars: false }), haze: .06 }, { z: 1, svg: g }]) + oHud(t, '17 OCT', 'MARSEILLE') + kword('COMMERCES PILLÉS', CX, 520, t, at(24, 'commerces') - .05, { size: 72, fill: '#fff' }) + oCrack(CX + 200, 1080, .8, seg(t, Pi, Pi + .15), 9); },
  sfx: [[0, 'whoosh', .5], [at(24, 'commerces'), 'crack', .6], [at(24, 'pilles'), 'crack', .6], [at(24, 'pilles') + .2, 'steps', .5]] });
function dBoxS() { return G(tr(0, 10, 1, -8), rect(-50, -40, 100, 80, '#d9a86c', 4, 5) + line(-50, -10, 50, -10, 3, '#b07a45')); }
// B025 — Lyon, place Bellecour : carte (épingle) en incrustation + la place
B(25, { enter: 'none', trans: 'zoom', transD: .25, cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const Ly = at(25, 'lyon'), Be = at(25, 'bellec');
    return depth({ zoom: 1, x: Math.sin(t * .6) * 10 }, [{ z: 1.4, svg: oBellecour(t, { sx: 680 }), haze: .05 }, { z: 1, svg: oCrowd(-100, 1200, 1560, 1.2, t, '#3a3f55', 25) }]) +
      card(260, 760, 330, 330, oFrance(0, 10, 26, t, { cities: [['PARIS', -1], ['MARSEILLE', -1], ['LYON', Ly]], s: 1 }), t, Ly - .15, { ry: 0, thick: 10, r: -4, bg: '#20325a' }) +
      oHud(t, '17 OCT', 'LYON', { t0: Ly - .1 }) + oTag(CX, 500, 'PLACE BELLECOUR', t, Be - .05, { size: 48 }); },
  sfx: [[0, 'whoosh', .5], [at(25, 'lyon') - .1, 'pop', .6], [at(25, 'bellec') - .05, 'pop_hi', .5]] });
// B026 — l'office de tourisme prend feu
B(26, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 1150 }),
  draw: (t, d, T) => { const Fe = at(26, 'feu'), k = .25 + .75 * eOutCubic(seg(t, Fe - .2, d)); return depth({ zoom: 1 }, [{ z: 1.3, svg: oBellecour(t, { statue: false, pav: 1, px: CX, fire: k }) + oSmoke(CX, 900, t, 1.4, 7, '#3a3540', 9), haze: .05 }]) +
    oHud(t, '17 OCT', 'LYON') + oTag(CX, 500, 'OFFICE DE TOURISME', t, at(26, 'office') - .05, { size: 46 }) + kword('PREND FEU', CX, 640, t, Fe - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[at(26, 'office') - .05, 'pop_hi', .5], [at(26, 'prend'), 'whoosh_up', .5], [at(26, 'feu'), 'fire', .8], [at(26, 'feu') + .2, 'sting', .4]] });
// B027 — les flammes montent : contre-plongée, flammes hautes, braises
B(27, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.05, 1.15, t / d), cy: 1600, hand: .5 }),
  draw: (t, d, T) => { const Mo = at(27, 'montent'), k = .6 + .5 * eOutCubic(seg(t, Mo - .2, d)); return grad('#3b2240', '#ff8a4a', -M, -M, W + 2 * M, H + 2 * M) + oSmoke(CX, 900, t, 2, 9, '#2a2530', 3) + G(tr(CX, 1250, 1.3), oTourismPavilion(0, 0, t, 0)) +
    oFire(CX - 200, 1300, 420 * k, 700 * k, t, 11) + oFire(CX + 220, 1320, 380 * k, 800 * k, t, 12) + oEmbers(CX, 1100, t, 20, 900) + oHud(t, '17 OCT', 'LYON') + kword('LES FLAMMES MONTENT', CX, 500, t, at(27, 'flammes') - .05, { size: 64, fill: '#fff' }); },
  sfx: [[0, 'fire', .8], [at(27, 'montent'), 'whoosh_up', .6], [at(27, 'montent') + .2, 'sizzle', .4]] });
// B028 — les forces de l'ordre interviennent (Bellecour, statue)
B(28, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const In = at(28, 'interviennent'), adv = eOutCubic(seg(t, 0, In + .5)); let g = ''; for (let i = 0; i < 5; i++) g += oCrs({ x: 1100 - adv * 200 - i * 200, y: 1470 + (i % 2) * 40, s: 1.05, flip: 1, walk: 2 }, t + i * .3);
    return depth({ zoom: 1 }, [{ z: 1.5, svg: oBellecour(t, { sx: 260, pav: 1, px: 860, fire: .4 }) + oVan(700, 1240, .6, t), haze: .1 }, { z: 1, svg: g }]) + op(.2 * (Math.sin(t * 14) > 0), rect(-M, -M, W + 2 * M, H + 2 * M, '#3f7fff', 0, 0)) + oHud(t, '17 OCT', 'LYON') + oTag(CX, 500, "FORCES DE L'ORDRE", t, at(28, 'forces') - .05, { size: 48, bar: BLUE }); },
  sfx: [[0, 'siren', .5], [at(28, 'forces'), 'steps', .6], [at(28, 'interviennent'), 'drum', .5]] });
// B029 — des boutiques vandalisées (rue lyonnaise)
B(29, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Va = at(29, 'vandalisees'); return depth({ zoom: 1 }, [{ z: 1.3, svg: oStreet(t, { sky: 'warm', kinds: ['pink', 'ochre'], seed: 12, cracks: 1, shutters: 1, signs: ['BOUCHON', 'MODE', 'SOIERIE', 'CAFÉ'] }), haze: .04 }, { z: 1, svg: oCrack(300, 1110, 1.1, seg(t, Va - .2, Va), 4) + oCrack(780, 1120, 1.2, seg(t, Va, Va + .15), 7) + oHooded(2, { x: 540, y: 1580, s: 1.1, walk: 4 }, t) }]) +
    oHud(t, '17 OCT', 'LYON') + kword('BOUTIQUES VANDALISÉES', CX, 520, t, at(29, 'boutiques') - .05, { size: 62, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(29, 'boutiques'), 'crack', .5], [at(29, 'vandalisees'), 'crack', .7], [at(29, 'vandalisees') + .2, 'thud', .4]] });
// B030 — Rennes (carte) ; B031 — barricades en feu sous les colombages
B(30, { enter: 'none', trans: 'zoom', transD: .2, cam: zin(1.0, 1.05),
  draw: (t, d, T) => oMapBg(t) + oFrance(CX, 860, 62, t, { cities: [['PARIS', -1], ['MARSEILLE', -1], ['LYON', -1], ['RENNES', at(30, 'rennes')]], cur: 'RENNES', route: ['LYON', 'RENNES', -.1, .4] }) + oHud(t, '17 OCT', 'RENNES'),
  sfx: [[0, 'whoosh', .6], [at(30, 'rennes'), 'pop', .7]] });
B(31, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .6 }),
  draw: (t, d, T) => { const Br = at(31, 'brulent'), k = .5 + .5 * eOutCubic(seg(t, 0, Br + .3)); return depth({ zoom: 1 }, [{ z: 1.4, svg: oRennes(t) + oSmoke(CX, 1000, t, 1.5, 7, '#3a3540', 4), haze: .1, hazeCol: '#6a5050' }, { z: 1, svg: oBarricade(300, 1500, 1.0, t, k) + oBarricade(820, 1540, .9, t, k * .9) }]) +
    oHud(t, '17 OCT', 'RENNES') + kword('BARRICADES EN FEU', CX, 520, t, at(31, 'barricades') - .05, { size: 72, fill: SX.acc2 }); },
  sfx: [[0, 'boom', .4], [at(31, 'barricades'), 'fire', .8], [at(31, 'brulent'), 'whoosh_up', .5]] });
// B032 — Lille (carte) ; B033 — on force les portes de la mairie (beffroi)
B(32, { enter: 'none', trans: 'zoom', transD: .2, cam: zin(1.0, 1.05),
  draw: (t, d, T) => oMapBg(t) + oFrance(CX, 860, 62, t, { cities: [['PARIS', -1], ['MARSEILLE', -1], ['LYON', -1], ['RENNES', -1], ['LILLE', at(32, 'lille')]], cur: 'LILLE', route: ['RENNES', 'LILLE', -.1, .35] }) + oHud(t, '17 OCT', 'LILLE'),
  sfx: [[0, 'whoosh', .6], [at(32, 'lille'), 'pop', .7]] });
function oMairieDoor(x, yb, pk) { return rect(x - 260, yb - 420, 520, 420, '#c9b89a', 6, 6) + path(`M${x - 260} ${yb - 420}L${x} ${yb - 520}L${x + 260} ${yb - 420}Z`, '#b8a586', 6) + rect(x - 200, yb - 470, 400, 46, '#1d2742', 8, 5) + ftext(x, yb - 436, 'MAIRIE', { size: 34, fill: '#d9a441', stroke: 'none' }) +
  path(`M${x - 130} ${yb}L${x - 130} ${yb - 260}Q${x} ${yb - 380} ${x + 130} ${yb - 260}L${x + 130} ${yb}Z`, '#4a2e1e', 6) + G(tr(x - 64 - pk * 10, yb - 150, 1, -pk * 2), rect(-60, -150, 120, 300, '#7a4e33', 4, 5) + circ(40, 10, 8, '#d9a441', 3)) + G(tr(x + 64 + pk * 10, yb - 150, 1, pk * 2), rect(-60, -150, 120, 300, '#7a4e33', 4, 5) + circ(-40, 10, 8, '#d9a441', 3)); }
B(33, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d), cy: 1100 }),
  draw: (t, d, T) => { const Fo = at(33, 'forcent'), Ma = at(33, 'mairie'), pk = t > Fo ? Math.abs(Math.sin((t - Fo) * 9)) * seg(t, Fo, Fo + .2) : 0; let g = ''; for (let i = 0; i < 4; i++) g += oHooded(i, { x: 300 + i * 160, y: 1540 + (i % 2) * 40, s: 1.0, flip: i > 1 ? 1 : 0, armR: [-60, -60], armL: [-120, -120] }, t + i * .2);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: oLille(t) + oMairieDoor(CX, 1260, pk), haze: .06 }, { z: 1, svg: g }]) + oHud(t, '17 OCT', 'LILLE') + oTag(CX, 500, 'LA MAIRIE', t, Ma - .1, { size: 48 }) + (t > Fo ? motionLines(CX - 200, 1080, 3, 60, 0, '#fff') + motionLines(CX + 200, 1080, 3, 60, 180, '#fff') : ''); },
  sfx: [[at(33, 'individus'), 'steps', .5], [at(33, 'forcent'), 'thud', .8], [at(33, 'portes'), 'thud', .7], [at(33, 'mairie') - .1, 'pop_hi', .4]] });
// B034 — Limoges, 18 h passées : carte + horloge du soir
B(34, { enter: 'none', trans: 'zoom', transD: .22, cam: zin(1.0, 1.05),
  draw: (t, d, T) => { const Li = at(34, 'limoges'), H8 = at(34, '18h'); return oMapBg(t, '#2a2050') + oFrance(CX, 900, 58, t, { cities: [['PARIS', -1], ['MARSEILLE', -1], ['LYON', -1], ['RENNES', -1], ['LILLE', -1], ['LIMOGES', Li]], cur: 'LIMOGES', route: ['LILLE', 'LIMOGES', -.1, .45] }) +
    G(tr(820, 560, popEl(t, H8 - .1, .5)), circ(0, 0, 110, NAVY, 0) + oClock(0, 0, 96, 18 * 60 + 5 + t * 10, { ticks: 1, mc: RED })) + oHud(t, '18 H', 'LIMOGES', { t0: H8 - .1, min: 1085, spin: 1 }) + kthin('18 heures passées', 330, 560, t, H8, { size: 46 }); },
  sfx: [[0, 'whoosh', .6], [at(34, 'limoges'), 'pop', .7], [at(34, '18h') - .1, 'clock_fast', .5], [at(34, 'passees'), 'tick', .5]] });
// B035 — l'hôtel de ville est attaqué ; B036 — puis incendié ; B037 — le feu gagne la toiture ; B038 — les pompiers
B(35, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), cy: 1000 }),
  draw: (t, d, T) => { const At = at(35, 'attaque'); let pr = ''; for (let i = 0; i < 5; i++) { const k = seg(t, At - .3 + i * .08, At + .2 + i * .08); if (k > 0 && k < 1) pr += oRock(lerp(150 + i * 200, 300 + i * 120, k), lerp(1450, 760, k) - Math.sin(k * 3.14) * 200, 1, k * 300); }
    return depth({ zoom: 1 }, [{ z: 1.4, svg: oLimogesHDV(t), haze: .04 }, { z: 1, svg: oCrowd(-100, 1200, 1560, 1.3, t, '#1e1a2a', 35) + pr + oCrack(300, 830, .8, seg(t, At, At + .15), 3) + oCrack(720, 1000, .8, seg(t, At + .2, At + .35), 5) }]) +
      oHud(t, '18 H', 'LIMOGES', { min: 1085 }) + oTag(CX, 450, 'HÔTEL DE VILLE', t, at(35, 'hotel'), { size: 46 }) + stampX(CX, 600, 'ATTAQUÉ', t, At); },
  sfx: [[at(35, 'hotel'), 'pop_hi', .4], [at(35, 'attaque') - .2, 'whoosh', .5], [at(35, 'attaque'), 'crack', .7], [at(35, 'attaque') + .2, 'thud', .5]] });
B(36, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .4 }),
  draw: (t, d, T) => { const In = at(36, 'incendi'), k = eOutCubic(seg(t, In - .2, d)); return oLimogesHDV(t, { fire: .3 + .7 * k }) + oCrowd(-100, 1200, 1600, 1.4, t, '#1e1a2a', 36) + oHud(t, '18 H', 'LIMOGES', { min: 1085 }) + kword('INCENDIÉ', CX, 500, t, In - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'boom', .5], [at(36, 'incendi'), 'fire', .9], [at(36, 'incendi') + .2, 'whoosh_up', .5]] });
B(37, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.15, 1.25, t / d), cy: 400, hand: .5 }),
  draw: (t, d, T) => { const To = at(37, 'toiture'), k = .35 + .65 * eOutCubic(seg(t, at(37, 'gagne') - .2, d)); return oLimogesHDV(t, { fire: 1, roof: k }) + oHud(t, '18 H', 'LIMOGES', { min: 1085 }) + oTag(CX, 1000, 'LA TOITURE', t, To - .05, { size: 48 }); },
  sfx: [[0, 'fire', .9], [at(37, 'gagne'), 'whoosh_up', .6], [at(37, 'toiture'), 'crack', .4], [at(37, 'toiture') + .3, 'sizzle', .5]] });
B(38, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Po = at(38, 'pompiers'), Sa = at(38, 'sauver'), kw = seg(t, Po - .2, Po + .3); let w = ''; for (let i = 0; i < 3; i++) { const ph = (t * 3 + i * .3) % 1; w += path(`M${560 + i * 20} ${560 - i * 10}Q${700 + i * 30} ${380} ${780 + i * 20} ${560 + i * 40}`, 'none', 22 - i * 5, `rgba(${190 + i * 20},225,255,${.9 - i * .2})`).replace('fill="none"', `fill="none" stroke-dasharray="120 30" stroke-dashoffset="${f1(-ph * 300)}"`); }
    return depth({ zoom: 1 }, [{ z: 1.3, svg: oLimogesHDV(t, { fire: 1 - .4 * seg(t, Sa, d), roof: 1 - .4 * seg(t, Sa, d) }), haze: .05 }, { z: 1, svg: oFireTruck(380, 1560, .85, t, 38) + op(kw, w) + op(kw, oSmoke(760, 560, t, .8, 5, '#e8eef4', 7)) + oPompier({ x: 820, y: 1600, s: 1.05, flip: 1, armR: [-50, -60], armL: [-70, -50] }, t) + oPompier({ x: 980, y: 1640, s: 1.0, flip: 1, armR: [-40, -60] }, t + .5) }]) +
      oHud(t, '18 H', 'LIMOGES', { min: 1085 }) + oTag(CX, 450, 'LES POMPIERS', t, Po - .05, { size: 48, bar: '#d8302a' }); },
  sfx: [[0, 'siren', .5], [at(38, 'pompiers') - .05, 'pop_hi', .5], [at(38, 'pompiers'), 'spray', .8], [at(38, 'sauver'), 'sizzle', .5]] });
// B039 — 20 h, premier bilan
B(39, { enter: 'none', trans: 'glitch', transD: .22, cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const Pb = at(39, 'premier'); return gridBg('#10131f') + halftoneFade(RED, .08, 1) + G(tr(CX, 900, popEl(t, 0, .5)), circ(0, 0, 230, '#fff', 0) + oClock(0, 0, 210, lerp(1085, 1200, eOutCubic(seg(t, 0, .5))), { ticks: 1, mc: RED })) +
    oHud(t, '20 H 00', 'FRANCE', { min: 1200 }) + kword('PREMIER BILAN', CX, 500, t, Pb - .05, { size: 86, fill: SX.acc2 }); },
  sfx: [[0, 'clock_fast', .5], [at(39, '20h'), 'drum', .6], [at(39, 'premier') - .05, 'sting', .6]] });
// B040 — environ 400 interpellations annoncées
B(40, { enter: 'none', trans: 'push', transD: .22, cam: zin(1.0, 1.05),
  draw: (t, d, T) => { const N = at(40, '400'); let dots = ''; const n = Math.floor(80 * seg(t, N, N + 1)); for (let i = 0; i < n; i++) dots += circ(220 + (i % 16) * 43, 1000 + Math.floor(i / 16) * 38, 13, i % 5 ? '#c8ced6' : RED, 3);
    return gridBg('#141a30') + halftoneFade('#000', .2, 1) + oHud(t, '20 H 00', 'FRANCE', { min: 1200 }) + kthin('environ', CX, 470, t, at(40, 'environ'), { size: 54 }) + oNumCard(CX, 720, `${counter(0, 400, t, N - .1, .8)}`, 'INTERPELLATIONS', t, N - .15, { w: 640, h: 330, size: 200 }) + dots + funTag(CX + 200, 940, 'ANNONCÉES', t, at(40, 'annoncees'), { size: 36, bg: RED }); },
  sfx: [[at(40, '400') - .15, 'pop_hi', .5], [at(40, '400'), 'typing', .5], [at(40, '400') + .8, 'ding', .6], [at(40, 'annoncees'), 'pop', .4]] });
// B041 — 550 000 selon le gouvernement ; B042 — 800 000 selon les organisateurs : barres comparatives
function oBars(t, k1, k2, t1, t2, c1, c2) { let s = rect(110, 520, 860, 700, '#fff', 30, 7) + line(170, 1130, 910, 1130, 6);
  const b = (x, k, col, lab, val, t0) => { const h = 440 * k; return (k > 0 ? rect(x - 120, 1130 - h, 240, h, col, 12, 6) + ftext(x, 1110 - h - 20, val, { size: 52, fill: NAVY, stroke: 'none' }) : '') + op(popEl(t, t0, .5), ftext(x, 1185, lab, { size: 32, fill: NAVY, stroke: 'none' })); };
  s += b(350, k1 * 550 / 800, '#7d8794', 'GOUVERNEMENT', `${c1} 000`, t1) + b(730, k2, RED, 'ORGANISATEURS', `${c2} 000`, t2);
  for (let i = 0; i < 9; i++) s += circ(190 + i * 18, 580, 7, NAVY, 0) + rect(184 + i * 18, 590, 12, 20, NAVY, 4, 0); return s + ftext(380, 610, 'MANIFESTANTS', { size: 36, fill: NAVY, stroke: 'none', anchor: 'start' }); }
B(41, { enter: 'none', trans: 'wipe', transD: .22, cam: zin(1.0, 1.04),
  draw: (t, d, T) => { const N = at(41, '550'); return gridBg('#141a30') + halftoneFade('#000', .2, 1) + oHud(t, '20 H 00', 'FRANCE', { min: 1200 }) + oBars(t, eOutCubic(seg(t, N - .1, N + .7)), 0, N - .1, 99, counter(0, 550, t, N - .1, .8), 0) + kword('550 000', CX, 440, t, N - .05, { size: 90, fill: '#fff' }); },
  sfx: [[at(41, '550') - .05, 'whoosh_up', .5], [at(41, '550') + .7, 'ding', .5], [at(41, 'manifestants'), 'tick', .4], [at(41, 'gouvernement'), 'pop_hi', .5]] });
B(42, { enter: 'none', cam: zin(1.04, 1.08),
  draw: (t, d, T) => { const N = at(42, '800'); return gridBg('#141a30') + halftoneFade('#000', .2, 1) + oHud(t, '20 H 00', 'FRANCE', { min: 1200 }) + oBars(t, 1, eOutCubic(seg(t, N - .1, N + .7)), -9, at(42, 'organisateurs') - .1, 550, counter(0, 800, t, N - .1, .8)) + kword('800 000', CX, 440, t, N - .05, { size: 90, fill: SX.acc2 }); },
  sfx: [[at(42, '800') - .05, 'whoosh_up', .6], [at(42, '800') + .7, 'ding', .6], [at(42, 'organisateurs'), 'pop_hi', .5]] });
// B043 — mais la nuit n'est pas terminée : Paris de nuit, lueurs d'incendie au loin, gyrophares
B(43, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const Nu = at(43, 'nuit'); return depth({ zoom: 1 }, [{ z: 1.5, svg: oStreet(t, { sky: 'night', seed: 2, kiosk: 1 }) + op(.7, glow(820, 1000, 260, '#ff8a3a', .6)) + oSmoke(820, 980, t, 1, 5, '#2a2530', 3), haze: .05 }, { z: 1, svg: oVan(CX, 1480, 1.0, t) }]) +
    op(.18 * (Math.sin(t * 12) > 0), rect(-M, -M, W + 2 * M, H + 2 * M, '#3f7fff', 0, 0)) + oHud(t, 'LA NUIT', 'FRANCE', { min: 1380 }) + kthin('mais la nuit', CX, 460, t, at(43, 'mais'), { size: 60 }) + kword("N'EST PAS TERMINÉE", CX, 570, t, at(43, 'pas') - .05, { size: 70, fill: '#fff' }); },
  sfx: [[0, 'crickets', .3], [at(43, 'nuit'), 'siren', .4], [at(43, 'terminee'), 'sting', .5]] });
// B044 — le lendemain matin : lever du soleil, éphéméride 17 → 18
B(44, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.0, 1.05),
  draw: (t, d, T) => { const k = seg(t, .1, .45); return oSky(t, 'dawn') + op(.85, dSkyline(1150, '#5a5f8a', 21, 'rgba(255,220,140,.3)')) + rect(-M, 1250, W + 2 * M, 900, '#3a3d55', 0, 0) +
    G(tr(CX, 830, 1, -3), rect(-200, -220, 400, 440, '#fff', 26, 7) + rect(-200, -220, 400, 100, RED, 26, 0) + rect(-200, -150, 400, 30, RED, 0, 0) + rect(-200, -220, 400, 440, 'none', 26, 7) + ftext(0, -150, 'OCTOBRE', { size: 50, fill: '#fff', stroke: 'none' }) + ftext(0, 110, '18', { size: 220, fill: NAVY, stroke: 'none' }) +
      (k < 1 ? G(`translate(0 -120) scale(1 ${f1(1 - k * 1.9)})`, rect(-200, 0, 400, 340, '#f6f2ea', 6, 6) + ftext(0, 230, '17', { size: 220, fill: NAVY, stroke: 'none' })) : '')) + oHud(t, '18 OCT', 'MATIN') + kword('LE LENDEMAIN', CX, 480, t, at(44, 'lendemain') - .05, { size: 80, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [.15, 'flutter', .6], [at(44, 'matin'), 'chirp', .4]] });
// B045 — le bilan grimpe à 1 200 interpellations : courbe qui monte
B(45, { enter: 'none', trans: 'push', transD: .22, cam: zin(1.0, 1.05),
  draw: (t, d, T) => { const N = at(45, '1200'), k = eOutCubic(seg(t, at(45, 'grimpe') - .1, N + .6)); const pts = [[180, 1120], [420, 1030], [640, 990], [900, lerp(990, 700, k)]];
    return gridBg('#141a30') + halftoneFade('#000', .2, 1) + rect(140, 600, 800, 580, 'rgba(255,255,255,.06)', 20, 0) + `<path d="M${pts.map(p => p.join(' ')).join('L')}" fill="none" stroke="${OL}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><path d="M${pts.map(p => p.join(' ')).join('L')}" fill="none" stroke="${RED}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>` +
      circ(180, 1120, 16, '#fff', 5) + circ(900, pts[3][1], 22, RED, 6) + ftext(180, 1180, '400', { size: 40, fill: '#fff' }) + oHud(t, '18 OCT', 'FRANCE') + kthin('le bilan grimpe à', CX, 450, t, at(45, 'bilan'), { size: 54 }) +
      kword(`${counter(400, 1200, t, N - .1, .8).toLocaleString('fr-FR').replace(/\s/g, ' ')}`, CX, 560, t, N - .1, { size: 120, fill: SX.acc2 }) + oTag(CX, 1290 - 60, 'INTERPELLATIONS', t, at(45, 'interpellations'), { size: 42 }); },
  sfx: [[at(45, 'grimpe'), 'whoosh_up', .6], [at(45, '1200') - .1, 'typing', .4], [at(45, '1200') + .7, 'ding', .6], [at(45, 'interpellations'), 'pop_hi', .4]] });
// B046a — 150 policiers et gendarmes blessés : compteur + rangée de casques (aucune blessure montrée)
const o46 = at(46, 'selon') - .15;
B(46, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.0, 1.05),
  draw: (t, d, T) => { const N = at(46, '150'), Bl = at(46, 'blesses'); let hs = ''; for (let i = 0; i < 10; i++) { const k = popEl(t, N + .2 + i * .06, .4); if (k > 0) hs += G(tr(190 + (i % 5) * 175, 990 + Math.floor(i / 5) * 150, k * .7), path('M-90 30A90 90 0 0 1 90 30Z', i % 2 ? '#24305a' : '#2d4a8a', 6) + rect(-100, 24, 200, 18, '#1d2742', 6, 5) + circ(50, -20, 18, '#fff', 4) + rect(44, -32, 12, 24, RED, 0, 0) + rect(38, -26, 24, 12, RED, 0, 0)); }
    return gridBg('#141a30') + halftoneFade('#000', .2, 1) + oHud(t, '18 OCT', 'FRANCE') + oNumCard(CX, 690, `${counter(0, 150, t, N - .1, .8)}`, 'POLICIERS ET GENDARMES', t, N - .15, { w: 700, h: 300, size: 180, top: BLUE }) + hs + funTag(CX, 470, 'BLESSÉS', t, Bl - .05, { size: 54, bg: RED }); },
  sfx: [[at(46, '150') - .15, 'pop_hi', .5], [at(46, '150') + .7, 'ding', .5], [at(46, 'gendarmes'), 'tick', .4], [at(46, 'blesses') - .05, 'sting', .5]] });
// B046b — selon le Premier ministre : pupitre officiel, silhouette de loin, tag
B(46, { enter: 'none', trans: 'zoom', transD: .2, cam: zin(1.0, 1.04),
  draw: (t, d, T) => oPodium(t, { press: 1 }) + oHud(t, '18 OCT', 'FRANCE') + oTag(CX, 500, 'LE PREMIER MINISTRE', t, at(46, 'premier') - o46 - .1, { size: 46 }) + kthin('selon', CX, 410, t, 0, { size: 50 }),
  sfx: [[0, 'shutter', .5], [.3, 'shutter', .4], [at(46, 'premier') - o46 - .1, 'pop_hi', .5]] }, o46);
// B047a — Emmanuel Macron (pupitre, silhouette de dos au premier plan, flashs) ; B047b — promet des poursuites
const o47 = at(47, 'poursuites') - .15;
B(47, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => oPodium(t, { press: 1 }) + oHud(t, '18 OCT', 'FRANCE') + oTag(CX, 480, 'EMMANUEL MACRON', t, at(47, 'emmanuel') - .05, { size: 50, bar: BLUE }) + kthin('président de la République', CX, 590, t, at(47, 'macron'), { size: 40 }) + op(Math.sin(t * 9) > .7 ? .5 : 0, rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0)),
  sfx: [[0, 'shutter', .5], [at(47, 'emmanuel') - .05, 'pop_hi', .5], [at(47, 'macron'), 'shutter', .5], [at(47, 'promet'), 'shutter', .4]] });
B(47, { enter: 'crash', cam: zin(1.0, 1.06),
  draw: (t, d, T) => { const Po = at(47, 'poursuites') - o47, De = at(47, 'destructions') - o47, kg = seg(t, De - .25, De);
    return blur(10, oPodium(t, {})) + op(.4, rect(-M, -M, W + 2 * M, H + 2 * M, NAVY, 0, 0)) + oHud(t, '18 OCT', 'FRANCE') + kword('POURSUITES', CX, 520, t, Po, { size: 104, fill: SX.acc2 }) + kthin('contre les auteurs des destructions', CX, 650, t, at(47, 'contre') - o47, { size: 42 }) +
      G(tr(CX + 40, 1080), rect(-170, 40, 340, 50, '#7a4e33', 10, 6) + G(tr(80, -140 + 120 * eInCubic(kg), 1, -40 + 40 * eInCubic(kg)), rect(-30, 0, 60, 220, '#a0703f', 10, 6) + rect(-90, -50, 180, 70, '#7a4e33', 16, 6))) + (kg >= 1 ? impactStar(CX + 40, 1110, .6 * (1 - seg(t, De, De + .3)) + .01, '#fff3b0') : ''); },
  sfx: [[at(47, 'poursuites') - o47, 'boom', .5], [at(47, 'contre') - o47, 'tick', .4], [at(47, 'destructions') - o47, 'hammer', .7], [at(47, 'destructions') - o47 + .1, 'thud', .5]] }, o47);
// B048 — pendant que la France découvre les images : salon de nuit, famille de dos devant la télé, téléphones
B(48, { enter: 'none', trans: 'circle', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const Im = at(48, 'images'); let s = grad('#1d2040', '#0e1024', -M, -M, W + 2 * M, H + 2 * M) + rect(-M, 1150, W + 2 * M, 900, '#3a2f3a', 0, 0) + line(-M, 1150, W + M, 1150, 6);
    s += rect(60, 260, 220, 300, '#262a4a', 8, 5) + oFacade(1000, 760, 0, 0, 'haus', 1, t, { shop: false }) + rect(850, 260, 200, 280, '#0b1030', 6, 6) + circ(960, 330, 30, '#fff6d6', 0) + rect(-M, 980, W + 2 * M, 14, '#2a2240', 0, 0);
    s += G(tr(CX, 850), rect(-330, -230, 660, 410, '#111', 18, 8) + rect(-306, -206, 612, 362, '#000', 6, 0) + G(`translate(-306 -206) scale(.567 .19)`, oLimogesHDV(t, { fire: 1, roof: 1 }).replace(/<defs>[\s\S]*?<\/defs>/g, '')) + rect(-306, 110, 612, 46, RED, 0, 0) + ftext(-290, 144, 'FLASH INFO • 17 OCTOBRE', { size: 28, fill: '#fff', stroke: 'none', anchor: 'start' }) + rect(-60, 180, 120, 40, '#222', 6, 5));
    s += op(.25 + .1 * Math.sin(t * 6), glow(CX, 880, 520, '#9fc4ff', .5));
    s += path('M-100 1500L-100 1260Q0 1180 540 1190Q1080 1180 1180 1260L1180 1500Z', '#5a3a5a', 7) + G(tr(320, 1400, 1.0), oSuitBack(0, 0, 1, { suit: '#3a5a8a', hair: '#3a2a20' })) + G(tr(760, 1420, .9), oSuitBack(0, 0, 1, { suit: '#8a3a5a', hair: '#8a5a3a' })) + G(tr(560, 1440, .7), oSuitBack(0, 0, 1, { suit: '#3a8a6a', hair: '#e0a040' }));
    s += G(tr(980, 1000, popEl(t, Im - .3, .5), 8), rect(-80, -150, 160, 300, '#222', 20, 6) + rect(-66, -130, 132, 250, '#9fc4ff', 8, 0) + rect(-66, -10, 132, 90, '#ff9a3c', 0, 0) + rect(-66, -130, 132, 30, RED, 0, 0));
    return s + oHud(t, '18 OCT', 'FRANCE') + kthin('pendant que la France', CX, 430, t, at(48, 'pendant'), { size: 52 }) + kword('DÉCOUVRE LES IMAGES', CX, 540, t, at(48, 'decouvre') - .05, { size: 66, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(48, 'france'), 'typing', .3], [at(48, 'decouvre'), 'pop_hi', .4], [at(48, 'images') - .3, 'vibrate', .5]] });
// B049 — une question reste
B(49, { enter: 'none', trans: 'black', transD: .25, cam: zin(1.0, 1.08),
  draw: (t, d, T) => gridBg('#0c0e18') + halftoneFade(RED, .08, 1) + kthin('une question', CX, 800, t, at(49, 'une'), { size: 80 }) + kword('RESTE.', CX, 960, t, at(49, 'reste') - .05, { size: 150, fill: SX.acc2 }) + oShards(CX, 960, t, at(49, 'reste'), { r: 380, n: 10 }),
  sfx: [[0, 'heartbeat', .5], [at(49, 'reste') - .05, 'sting', .6]] });
// B050 — QUELLE IMAGE DU 17 OCTOBRE T'A LE PLUS MARQUÉ ? : mosaïque de cartes des moments-clés + question en gros
function oThumb(svg, w, h, sc, ox, oy) { const id = _sxid('th'); return `<defs><clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="14"/></clipPath></defs><g clip-path="url(#${id})"><g transform="translate(${f1(-ox * sc)} ${f1(-oy * sc)}) scale(${sc})">${svg}</g></g>` + rect(-w / 2, -h / 2, w, h, 'none', 14, 6); }
B(50, { enter: 'none', trans: 'zoom', transD: .3, cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d) }),
  draw: (t, d, T) => { const Q = at(50, 'quelle'), Im = at(50, 'image'), Oc = at(50, '17'), Ma = at(50, 'marque'); const ts = 1.3;
    const thumbs = [[() => oCnews(CX, 1250, ts) + oCrack(CX - 100, 1100, 1, 1, 3), 'CNEWS'], [() => oRepublique(ts, { sky: 'late' }) + dCar(CX, 1460, 1.2, '#7a8a9a') + oFire(CX, 1260, 330, 300, ts, 1, { smoke: false }), 'RÉPUBLIQUE'], [() => oMarseilleHDV(ts), 'MARSEILLE'],
      [() => oBellecour(ts, { statue: false, pav: 1, px: CX, fire: 1 }), 'LYON'], [() => oRennes(ts, { props: false }) + oBarricade(CX, 1500, 1.2, ts, 1), 'RENNES'], [() => oLimogesHDV(ts, { fire: 1, roof: 1 }), 'LIMOGES']];
    let cards = ''; thumbs.forEach(([fn, lab], i) => { const x = 220 + (i % 3) * 320, y = 770 + Math.floor(i / 3) * 310, t0 = Im - .4 + i * .12; cards += card(x, y, 280, 290, oThumb(fn(), 250, 230, .3, CX - 400, 1050 - 120) + G(tr(0, 128), rect(-110, -24, 220, 48, NAVY, 12, 5) + ftext(0, 12, lab, { size: 26, fill: '#fff', stroke: 'none' })), t, t0, { ry: 0, thick: 10, r: (i % 2 ? 3 : -3) + wave(t, .4, 1.5, i), bw: 6 }); });
    return gridBg('#10131f') + halftoneFade(RED, .08, 1) + cards + kthin('quelle image du', CX, 340, t, Q - .05, { size: 56 }) + kword('17 OCTOBRE', CX, 450, t, Oc - .05, { size: 96, fill: SX.acc2 }) + kthin("t'a le plus marqué ?", CX, 560, t, at(50, 't'), { size: 60 }) +
      markerPath('M300 600Q540 630 800 595', t, Ma, { col: RED, w: 10, len: 600 }); },
  sfx: [[at(50, 'quelle') - .05, 'whoosh', .5], [at(50, 'image') - .4, 'pop_hi', .4], [at(50, 'image') - .1, 'pop_hi', .4], [at(50, 'image') + .2, 'pop_hi', .4], [at(50, '17') - .05, 'boom', .5], [at(50, 'marque'), 'sting', .6]] });

SCENES.sort((a, b) => a.s - b.s);
