// ============================================================
//  « Pourquoi c'est horrible d'être accro à Snapchat ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Appli FICTIVE « SNAP » (fantôme générique jaune avec une bouille, PAS le vrai logo). Héros = sweat jaune + cernes.
//  Les CAPITALES du script = moments criés → kword slam + flash. Kevin = celui de la flamme (et du genou).
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
const BEDS = [];

// ---------- SIZEX fun : accent VIOLET (propre à l'épisode), jaune marqueur, jaune « SNAP » pour l'appli fictive ----------
sxFun('#8b5cf6'); SX.acc2 = '#ffd23f'; SX.cool = '#8fd0ff';
const SNAPY = '#ffe14d', SNV = '#8b5cf6', FIRE = '#ff7a1a';

// ============================================================
//  LE HÉROS : sweat jaune, cernes violettes (nuits sur le téléphone). Kevin = kevin() de decor.js.
// ============================================================
const snBags = r => path(`M${-r * .54} ${r * .2}Q${-r * .34} ${r * .36} ${-r * .14} ${r * .2}`, 'none', r * .07, 'rgba(120,70,160,.5)') + path(`M${r * .14} ${r * .2}Q${r * .34} ${r * .36} ${r * .54} ${r * .2}`, 'none', r * .07, 'rgba(120,70,160,.5)');
const heroHair = (r, t, o) => { const [b, f] = hairSvg('short', o.hairColor || '#3a2a22', r, t); return [b, f + (o.noBags ? '' : snBags(r))]; };
const heroP = (o, t) => person(Object.assign({ age: 'kid', hairFn: heroHair, shirt: SNAPY, pants: '#3b3f4a', skin: SK[1], seed: 2 }, o), t);
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: heroHair, skin: SK[1], seed: 2 }, o), t));
// la crush (cheveux longs, t-shirt rose)
const crushHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'long', hairColor: '#6b3e26', skin: SK[3], seed: 31 }, o), t));
// éclair blanc au milieu d'un plan
const snFlash = (t, t0, k = .85) => t < t0 || t > t0 + .25 ? '' : op(k * (1 - seg(t, t0, t0 + .25)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0));

// ============================================================
//  L'APPLI FICTIVE « SNAP » : fantôme générique (avec yeux + sourire), flamme, écrans
// ============================================================
const snGhost = (x, y, s = 1, c = '#fff', o = {}) => G(tr(x, y, s, o.r || 0), path('M-60 44L-60 -14Q-60 -84 0 -84Q60 -84 60 -14L60 44Q45 64 30 44Q15 64 0 44Q-15 64 -30 44Q-45 64 -60 44Z', c, 6) +
  circ(-20, -20, 9, OL, 0) + circ(20, -20, 9, OL, 0) + (o.sad ? path('M-16 16Q0 4 16 16', 'none', 5) : path('M-16 6Q0 22 16 6', 'none', 5)) + ell(-36, 2, 9, 5, '#ff9ab5', 0) + ell(36, 2, 9, 5, '#ff9ab5', 0));
const snIcon = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-90, -90, 180, 180, SNAPY, 44, 7) + snGhost(0, 0, .95) + ell(-50, -62, 24, 10, 'rgba(255,255,255,.6)', 0));
// flamme qui vacille (k = intensité, 0 = éteinte)
function snFlame(x, y, s, t, k = 1, o = {}) { if (k <= 0) return ''; const f = 1 + .07 * Math.sin(t * 17) + .05 * Math.sin(t * 29 + 1);
  return G(tr(x, y, s * k * f, Math.sin(t * 9) * 5 * (o.wob ?? 1)), (o.glow !== false ? op(.35 * k, circ(0, 0, 120, '#ffb03a', 0)) : '') +
    path('M0 -110C40 -60 72 -30 62 20C56 62 30 82 0 82C-30 82 -56 62 -62 20C-68 -22 -30 -40 -20 -82C-6 -52 2 -64 0 -110Z', FIRE, 6) +
    path('M2 -34C22 -4 36 18 30 44C26 62 14 70 0 70C-14 70 -26 62 -30 44C-34 22 -14 8 2 -34Z', '#ffd23f', 4)); }
// flamme + nombre de jours (le streak)
const snStreak = (x, y, s, t, n, k = 1, o = {}) => G(tr(x, y, s), snFlame(-90, 0, .9, t, k, o) + ftext(20, 40, String(n), { size: 120, fill: '#fff', anchor: 'start' }));
// petit téléphone tenu (écran = jaune SNAP par défaut)
const snPh = (s = .5, scr = 'snap', t = 0) => G(tr(0, -40, s), phone(0, 0, 1, 0, scr === 'snap' ? rect(-66, -128, 132, 250, SNAPY, 12, 0) + snGhost(0, -10, .55) :
  scr === 'black' ? rect(-66, -128, 132, 250, '#111', 12, 0) : scr === 'glow' ? rect(-66, -128, 132, 250, '#bfe3ff', 12, 0) + [0, 1, 2, 3].map(i => rect(-50, -100 + i * 56, 100, 36, '#fff', 8, 0)).join('') : scr));
// gros téléphone (gros plans) : écran local x ±210, y ±380
function snBig(x, y, s, inner, o = {}) { const w = 420, h = 760;
  return G(tr(x, y, s, o.r || 0), op(.3, glow(0, 0, 520, '#bfe3ff', .7)) + rect(-w / 2 - 24, -h / 2 - 24, w + 48, h + 48, '#22222b', 58, 7) + clipR(-w / 2, -h / 2, w, h, rect(-w / 2, -h / 2, w, h, o.bg || '#fff', 0, 0) + inner, 38) +
    rect(-60, -h / 2 - 8, 120, 24, '#22222b', 12, 0) + rect(w / 2 + 20, -200, 10, 90, '#22222b', 4, 0)); }
// barre du haut de l'appli + bouton déclencheur (UI caméra fictive)
const snTop = (title, c = '#fff', fg = OL) => rect(-210, -380, 420, 110, c, 0, 0) + ftext(0, -310, title, { size: 38, fill: fg, stroke: 'none' }) + circ(-160, -322, 28, SNAPY, 4) + snGhost(-160, -322, .26);
const snShutter = (t, press = 0) => circ(0, 300, 52 * (1 - .15 * press), 'none', 12, '#fff') + op(.3, circ(0, 300, 40, '#fff', 0));
// ligne de conversation
function snRow(y, name, status, col, t, o = {}) { const sq = status === 'snap' ? rect(-110, -14, 28, 28, '#e2463a', 5, 0) : status === 'vu' ? path('M-110 -14L-82 0L-110 14Z', 'none', 4, SNV) : rect(-110, -14, 28, 28, 'none', 5, 4, '#bbb');
  return G(tr(0, y), rect(-200, -54, 400, 108, o.hi ? '#fff6c8' : '#fff', 0, 0) + line(-200, 54, 200, 54, 2, '#e4e4ea') + circ(-150, 0, 36, col, 5) + snGhost(-150, 4, .3, '#fff') +
    ftext(-96, -10, name, { size: 30, fill: OL, stroke: 'none', anchor: 'start' }) + G(tr(110, 34), sq) + ftext(14, 34, o.sub || (status === 'snap' ? 'Nouveau snap' : status === 'vu' ? 'Vu' : 'Ouvert'), { size: 22, fill: '#8a8f99', stroke: 'none', anchor: 'start' }) +
    (o.streak ? snFlame(160, -6, .22, t, 1, { glow: false }) + ftext(150, -8, o.streak, { size: 24, fill: OL, stroke: 'none', anchor: 'end' }) : '')); }

// ============================================================
//  DÉCORS
// ============================================================
// chambre de nuit + réveil de chevet réglé à l'heure voulue
const snRoom = (t, clk = '23:59') => bedroomN(t) + G(tr(470, 1250), rect(-56, -204, 112, 58, '#141a3a', 8, 4) + ftext(0, -162, Math.sin(t * 6) > -.7 ? clk : clk.replace(':', ' '), { size: 30, fill: '#ff5c8a', stroke: 'none' }));
// gros lit au premier plan : tête sur l'oreiller, couette jusqu'au cou
function snBed(x, yb, s, headSvg, t, o = {}) {
  return G(tr(x, yb, s), rect(-470, -560, 60, 600, '#6b4a8a', 18, 7) + rect(-430, -470, 30, 380, '#8a6ad8', 8, 4) +
    rect(-430, -200, 920, 260, '#8a6ad8', 24, 7) + ell(-250, -300, 150, 70, '#fff', 6) + path('M-330 -320Q-250 -350 -170 -320', 'none', 4, '#dde3ef') + headSvg +
    path(`M-360 ${-230 - (o.up || 0)}Q-100 ${-290 - (o.up || 0)} 500 -250L500 -40L-380 -40Z`, '#5ec4f0', 7) + path('M-300 -200Q0 -240 460 -210', 'none', 5, '#3a9ac0') + [0, 1, 2, 3, 4].map(i => star5(-200 + i * 150, -130 + (i % 2) * 30, 16, '#fff')).join('')); }
const star5 = (x, y, r, c) => { let d = ''; for (let i = 0; i < 10; i++) { const a = R(-90 + i * 36), rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + f1(x + Math.cos(a) * rr) + ' ' + f1(y + Math.sin(a) * rr); } return path(d + 'Z', c, 4); };
// table de chevet avec téléphone posé (écran allumé/éteint)
const snNight = (x, yb, s, t, o = {}) => G(tr(x, yb, s), rect(-110, -200, 220, 200, '#6b4a8a', 10, 6) + line(-100, -100, 100, -100, 4) + circ(0, -150, 9, '#ffd23f', 3) + circ(0, -50, 9, '#ffd23f', 3) +
  (o.phone !== false ? G(tr(o.px || 10, -214), rect(-70, -16, 140, 32, '#22222b', 10, 5) + rect(-60, -10, 120, 20, o.lit ? '#bfe3ff' : '#3a3f4a', 6, 0)) : '') + dLamp(-60, -200, .45, 1, t, '#ff8fb1'));
// plafond vu d'en bas (POV allongé)
function snCeiling(t) { let s = grad('#3a4380', '#262c5e', -M, -M, W + 2 * M, H + 2 * M) + dWall('star', 'rgba(0,0,0,0)', 'rgba(255,240,200,.25)', 1900);
  s += path('M200 300L330 420L300 520L420 640', 'none', 6, '#1d2350') + path('M820 1200L760 1100L800 980', 'none', 5, '#1d2350');
  s += G(tr(CX, 760), circ(0, 0, 150, '#e8e4f0', 7) + circ(0, 0, 100, '#fff6c8', 6) + op(.25 + .05 * Math.sin(t * 3), circ(0, 0, 260, '#fff6c8', 0)));
  s += G(tr(800, 420 + Math.sin(t * 2) * 30), line(0, -500, 0, 0, 3) + ell(0, 18, 22, 26, OL, 0) + [-1, 1].map(sd => [0, 1, 2].map(i => path(`M${sd * 14} ${10 + i * 10}q${sd * 30} -20 ${sd * 44} ${4 + i * 8}`, 'none', 5)).join('')).join('') + circ(-7, 10, 4, '#fff', 0) + circ(7, 10, 4, '#fff', 0));
  for (let i = 0; i < 7; i++) s += star5(140 + (i * 157) % 820, 1000 + (i * 89) % 300, 22, '#d9ff9a');
  return s; }
// cuisine (repas avec maman)
function snKitchen(t) { const yb = 1250;
  let s = dWall('dot', '#fff1d6', '#ffe0b0', yb) + rect(-M, 960, W + 2 * M, yb - 960, '#9fd6c4', 0, 0);
  for (let x = -M; x < W + M; x += 60) s += line(x, 960, x, yb, 3, '#86c2ae'); for (let y = 960; y < yb; y += 60) s += line(-M, y, W + M, y, 3, '#86c2ae');
  s += dWindowView(620, 260, 340, 380, t) + dCurtain(570, 240, 100, 440, '#ff8fb1', t, 1) + dCurtain(910, 240, 100, 440, '#ff8fb1', t, -1) + dPot(700, 650, .45, t, 2) + dPot(880, 650, .4, t, 1);
  s += dShelf(60, 560, 420, dJar(100, 560, '#ff9a4d', .9) + dJar(170, 560, '#7be07b', .9) + dJar(240, 560, '#e2463a', .9) + dMug(320, 560, 1, t, '#5b8fd8') + dMug(390, 560, 1, t + 1, '#ffd23f'));
  s += wallClock(270, 300, 60, t) + dFrame(110, 760, 110, 130, 'heart', '#c38a52', -3) + dFrame(440, 760, 120, 100, 'sea', '#8a6ad8', 4);
  s += G(tr(1000, 1250), rect(-140, -330, 240, 330, '#e8eef2', 12, 6) + line(-140, -180, 100, -180, 5) + rect(70, -300, 14, 80, '#9aa3ad', 6, 3) + rect(70, -150, 14, 80, '#9aa3ad', 6, 3) + rect(-120, -320, 70, 40, '#ffd23f', 6, 4));
  s += dOutlet(80, 1120) + hangLamp(CX, 520, t, .5);
  return s + dTileFloor(yb, '#f2e6d0', '#c9b8a0'); }
// table de repas (premier plan) avec assiettes
const snTable = (yb, t, o = {}) => rect(-M, yb, W + 2 * M, 60, '#c58e55', 0, 7) + rect(-M, yb + 60, W + 2 * M, 900, '#a8743f', 0, 0) + path(`M-100 ${yb + 60}L1180 ${yb + 60}`, 'none', 7) +
  (o.cloth !== false ? path(`M80 ${yb - 2}L1000 ${yb - 2}L1040 ${yb + 220}L40 ${yb + 220}Z`, '#fff', 6) + [0, 1, 2, 3, 4, 5, 6, 7].map(i => line(100 + i * 120, yb, 80 + i * 126, yb + 220, 6, '#ff8fb1')).join('') : '');
const snPlate = (x, y, s = 1, food = 'pasta', t = 0) => G(tr(x, y, s), ell(0, 0, 110, 36, '#fff', 6) + ell(0, -2, 76, 24, '#f2f2f2', 4) +
  (food === 'pasta' ? path('M-50 -8Q-30 -40 0 -24Q30 -44 50 -8Z', '#ffd23f', 5) + circ(-10, -22, 10, '#e2463a', 3) + circ(16, -18, 8, '#e2463a', 3) + op(.6, path(`M-10 -40Q${-20 + wave(t, 1, 6)} -70 -6 -96`, 'none', 5, '#fff')) :
    food === 'burger' ? ell(0, -40, 56, 30, '#e8a24a', 5) + rect(-60, -26, 120, 14, '#7be07b', 6, 4) + rect(-58, -14, 116, 16, '#7a3b1e', 6, 4) + ell(0, 2, 56, 12, '#e8a24a', 5) + [-20, 0, 20].map(x => circ(x, -52, 3, '#fff6c8', 0)).join('') :
    [0, 1, 2, 3, 4].map(i => rect(-46 + i * 20, -40 - (i % 2) * 8, 12, 40, '#ffd23f', 3, 3)).join(''))); // frites
// 6 potes à table (resto) : idx 0 = héros, 1 = Kevin
const PALS = [0, 1, 2, 3, 4, 5].map(i => 105 + i * 174);
function snPal(i, o, t) { const b = Object.assign({ x: PALS[i], y: 1265, s: .78 }, o);
  if (i === 0) return heroP(b, t); if (i === 1) return kevin(b, t);
  return kid([0, 1, 3, 5][i - 2], Object.assign({ shirt: ['#ff8fb1', '#7aa6d8', '#ff9a4d', '#b56cf0'][i - 2] }, b), t + i); }
// petit téléphone allumé devant un visage (lueur bleue)
const snGlowPh = (x, y, t, k = 1) => op(k, op(.35, glow(x, y - 40, 120, '#9fd0ff', .8)) + G(tr(x, y, .34, -8), phone(0, 0, 1, 0, rect(-66, -128, 132, 250, '#bfe3ff', 12, 0) + rect(-50, -100, 100, 60, SNAPY, 8, 0))));
// tableau en liège de détective
function snBoard(t) { let s = snRoom(t, '03:12') + WASH('rgba(10,10,40,.25)') + dDeskLamp(120, 1250, 1.2, t);
  s += rect(50, 455, 980, 620, '#8a5a3a', 18, 7) + rect(70, 475, 940, 580, '#d4a26a', 8, 4);
  for (let i = 0; i < 70; i++) s += circ(80 + (i * 97) % 920, 485 + (i * 61) % 560, 3, '#b8854f', 0);
  return s; }
// mini carte (localisation) : rues, parc, rivière ; coordonnées locales w×h centrées
function snMap(w, h, t) { let s = rect(-w / 2, -h / 2, w, h, '#eef1e4', 0, 0) + path(`M${-w / 2} ${h * .2}Q0 ${h * .05} ${w / 2} ${h * .3}`, 'none', 40, '#9fd0ff') +
    ell(-w * .22, -h * .22, w * .2, h * .13, '#bfe6a8', 0);
  for (let i = -3; i <= 3; i++) s += line(i * w / 7, -h / 2, i * w / 7 + 30, h / 2, 12, '#fff') + line(-w / 2, i * h / 7, w / 2, i * h / 7 - 20, 12, '#fff');
  for (let i = 0; i < 9; i++) s += rect(-w / 2 + 30 + (i * 137) % (w - 80), -h / 2 + 30 + (i * 89) % (h - 80), 50, 34, '#dfe3d6', 4, 0);
  return s; }

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001a — SIGNATURE : grille encre, héros (téléphone à la main) en cut-out, titre 3 lignes, « débloqué » en étoiles sur SNAPCHAT
const O1 = at(1, 'il') - .12;
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'snapchat');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.25, expr: t > K ? 'ecstatic' : 'love', look: [1, -.5], armR: [20, -60], holdR: snPh(.5, 'snap') }, t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1030, 330, 330, t, K + .2, { label: 'accro.png' }) +
      (t > K ? snIcon(820, 820, .7, 10 + Math.sin(t * 5) * 6) : '') +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'ÊTRE", CX, 415, t, .3, { size: 58 }) +
      kword('ACCRO À SNAPCHAT ?', CX, 540, t, K - .05, { size: 68, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'snapchat') - .05, 'boom', .6], [at(1, 'snapchat'), 'sparkle', .5], [at(1, 'snapchat') + .1, 'ding', .4]] });

// B001b — « Il est 23 h 59 » : chambre de nuit, gros réveil 23:59 qui clignote, flamme sur le téléphone
B(1, { enter: 'none', trans: 'black', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Hh = at(1, '23') - O1;
    return snRoom(t) + WASH('rgba(10,10,40,.25)') + snBed(560, 1420, 1, heroHead(-250, -340, 95, { expr: 'calm', look: [1, -.5] }, t), t) + snNight(130, 1320, 1, t, { lit: 1 }) +
      (t > Hh ? G(tr(CX, 760, pop(t, Hh, .35)), bigClockF(0, 0, Math.sin(t * 6) > -.6 ? '23:59' : '23 59', '#ff5c8a', 1.25)) : '') + kthin('il est', CX, 470, t, 0, { size: 60 }); },
  sfx: [[0, 'whoosh', .3], [at(1, '23') - O1, 'tick', .6], [at(1, '23') - O1 + .5, 'tick', .5], [at(1, '23') - O1 + .2, 'crickets', .3]] }, O1);

// B002 — « Tu es dans ton lit, » : plan large, chambre douillette, couette remontée, Zzz qui approchent
B(2, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d) }),
  draw: (t, d, T) => { const Li = at(2, 'lit');
    return snRoom(t) + WASH('rgba(10,10,40,.2)') + snBed(560, 1420, 1, heroHead(-250, -340, 95, { expr: 'happy', face: { eyes: 'closed' } }, t), t, { up: 20 * seg(t, 0, Li) }) + snNight(130, 1320, 1, t) +
      funTag(CX, 470, 'AU LIT', t, Li - .1, { size: 60, bg: SNV, r: -4 }) + op(seg(t, Li, Li + .3), ftext(560, 840, 'z', { size: 60, fill: '#fff' })); },
  sfx: [[0, 'whoosh', .3], [at(2, 'lit') - .1, 'pop', .5], [at(2, 'lit') + .1, 'thud', .3]] });

// B003 — « Tes yeux se ferment. » : gros plan sur la tête sur l'oreiller, paupières qui tombent, Zzz
B(3, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Fe = at(3, 'ferment');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: snRoom(t), haze: .2 }]) + ell(CX, 1080, 380, 140, '#fff', 7) + heroHead(CX, 900, 200, { expr: t > Fe ? 'sleep' : 'calm', tilt: -10 }, t) +
      path('M-300 1150Q540 1060 1380 1130L1380 2700L-300 2700Z', '#5ec4f0', 7) + (t > Fe ? [0, 1, 2].map(i => op(seg(t, Fe + i * .12, Fe + i * .12 + .2), ftext(760 + i * 70, 640 - i * 70, 'Z', { size: 70 + i * 20, fill: '#fff' }))).join('') : '') +
      kthin('tes yeux se ferment…', CX, 450, t, 0, { size: 58 }); },
  sfx: [[at(3, 'yeux'), 'hmm', .3], [at(3, 'ferment'), 'flutter', .3], [at(3, 'ferment') + .1, 'crickets', .3]] });

// B004 — « Mais soudain, » : les yeux s'ouvrent d'un coup, crash, « ! »
B(4, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.08, 1.14, t / d), shake: t > at(4, 'soudain') ? 8 : 2 }),
  draw: (t, d, T) => { const So = at(4, 'soudain');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: snRoom(t), haze: .2 }]) + speedLines(t, CX, 900, 30, 'rgba(255,255,255,.45)') + ell(CX, 1080, 380, 140, '#fff', 7) +
      heroHead(CX, 900, 200, { expr: t > So ? 'shock' : 'sleep', tilt: -10 }, t) + path('M-300 1150Q540 1060 1380 1130L1380 2700L-300 2700Z', '#5ec4f0', 7) +
      (t > So ? emark(820, 640, 1.2, '#ff5c5c', 12) : '') + kword('MAIS SOUDAIN…', CX, 450, t, .02, { size: 96, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .5], [.02, 'boom', .5], [at(4, 'soudain'), 'sting', .6]] });

// B005 — « TU TE SOUVIENS QUE TA FLAMME AVEC KEVIN VA DISPARAÎTRE ! » : rayons rouges, flamme 487 qui vacille et s'éteint presque
B(5, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(5, 'disparaitre') ? 7 : 2 }),
  draw: (t, d, T) => { const Sv = at(5, 'souviens'), Fl = at(5, 'flamme'), K = at(5, 'kevin'), Di = at(5, 'disparaitre');
    const k = t < Di ? 1 : Math.max(.25, 1 - .75 * seg(t, Di, Di + .5)) * (.8 + .2 * Math.sin(t * 40));
    return rays(t, CX, 900, '#ff6b6b', '#c92f3a', 22) + cutout(heroHead(250, 1060, 130, { expr: t > Di ? 'terror' : 'shock' }, t), 10) + cutout(kevinHead(830, 1060, 110, { expr: t > Di ? 'sob' : 'happy' }, t), 10) +
      (t > K ? funTag(830, 1210, 'KEVIN', t, K - .05, { size: 40, bg: '#5fb85f', r: 5 }) : '') +
      (t > Fl ? G(tr(CX, 830, pop(t, Fl, .35)), snStreak(-30, 0, 1.1, t, 487, k)) : '') + (t > Di + .2 ? path('M300 1060Q540 1200 760 1060', 'none', 6, 'rgba(255,255,255,.6)') : '') +
      kthin('tu te souviens que', CX, 400, t, Sv - .1, { size: 54, out: Di - .1 }) + kword('TA FLAMME', CX, 520, t, Fl - .05, { size: 110, fill: SX.acc2, op: t > Di ? 0 : 1 }) +
      kword('VA DISPARAÎTRE !', CX, 470, t, Di - .05, { size: 80, fill: '#fff' }) + snFlash(t, Di, .5); },
  sfx: [[0, 'flash_hit', .5], [at(5, 'souviens'), 'gasp', .5], [at(5, 'flamme') - .05, 'fire', .6], [at(5, 'flamme'), 'boom', .4], [at(5, 'kevin'), 'pop', .5], [at(5, 'disparaitre') - .05, 'siren', .5], [at(5, 'disparaitre') + .1, 'heartbeat', .5]] });

// B006 — « Tu bondis, » : le héros jaillit du lit (couette qui vole), traits de vitesse
B(6, { enter: 'whip', cam: (t, d) => ({ z: 1.04, shake: 6 }),
  draw: (t, d, T) => { const Bo = at(6, 'bondis'), up = eOutBack(seg(t, Bo - .1, Bo + .25));
    return snRoom(t) + WASH('rgba(10,10,40,.2)') + speedLines(t, CX, 700, 26, 'rgba(255,255,255,.5)') + snBed(560, 1420, 1, '', t) + snNight(130, 1320, 1, t, { lit: 1 }) +
      G(tr(560, 1400 - 380 * up, 1, -10 + 20 * up), heroP({ x: 0, y: 0, s: 1.2, expr: 'panic', armL: [-140, -120], armR: [-40, -60], legL: [120, 150], legR: [60, 30] }, t)) +
      G(tr(560 + 300 * up, 1200 - 500 * up, 1, 60 * up), path('M-160 0Q0 -60 160 0L140 60L-140 60Z', '#5ec4f0', 7)) + kword('TU BONDIS', CX, 450, t, Bo - .1, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [at(6, 'bondis') - .1, 'boing', .7], [at(6, 'bondis'), 'whoosh_up', .5], [at(6, 'bondis') + .1, 'boom', .3]] });

// B007 — « tu attrapes ton téléphone, » : main géante qui fond sur le téléphone (ralenti), l'écran s'allume
B(7, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), hand: .4 }),
  draw: (t, d, T) => { const At = at(7, 'attrapes'), Te = at(7, 'telephone'), k = eOutCubic(seg(t, At - .1, At + .3)), lit = t > Te;
    const hand = G(tr(lerp(-150, 520, k), lerp(600, 880, k), 1.4, -20), rect(-260, -50, 260, 100, SNAPY, 30, 7) + circ(30, 0, 70, SK[1], 7) + [0, 1, 2, 3].map(i => rect(50, -60 + i * 34, 70, 28, SK[1], 14, 5)).join(''));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: snRoom(t), haze: .2 }]) + rect(-M, 1000, W + 2 * M, 900, '#6b4a8a', 0, 7) + line(-M, 1060, W + M, 1060, 5, '#4a3266') +
      G(tr(600, 980, 1.4), rect(-150, -30, 300, 60, '#22222b', 18, 6) + rect(-136, -20, 272, 40, lit ? '#bfe3ff' : '#3a3f4a', 10, 0) + (lit ? snGhost(-90, 0, .22) + ftext(20, 10, '23:59', { size: 24, fill: OL, stroke: 'none' }) : '')) +
      (lit ? op(.4, glow(600, 980, 300, '#9fd0ff', .8)) : '') + hand + kthin('tu attrapes', CX, 450, t, 0, { size: 60 }) + kword('TON TÉLÉPHONE', CX, 580, t, Te - .05, { size: 90, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(7, 'attrapes'), 'whoosh', .5], [at(7, 'attrapes') + .3, 'thud', .5], [at(7, 'telephone'), 'ding', .5]] });

// B008 — « tu prends une photo du plafond, » : POV écran caméra pointé sur le plafond (araignée, fissure), clic
B(8, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .5 }),
  draw: (t, d, T) => { const Ph = at(8, 'photo'), Pl = at(8, 'plafond'), cl = Pl + .15;
    const inner = G(tr(0, 0, .5), G(tr(-CX, -900), snCeiling(t))) + snTop('CAMÉRA', 'rgba(0,0,0,.35)', '#fff') + snShutter(t, t > cl && t < cl + .15 ? 1 : 0) + (t > cl ? op(1 - seg(t, cl, cl + .3), rect(-210, -380, 420, 760, '#fff', 0, 0)) : '');
    return snCeiling(t) + WASH('rgba(10,10,40,.3)') + snBig(CX, 830, .85, inner, { bg: '#262c5e' }) +
      funTag(CX, 400, 'PHOTO DU PLAFOND', t, Pl - .1, { size: 46, bg: SNV, r: -3 }) + (t > cl ? markerText('chef-d’œuvre', 860, 1080, t, cl + .1, { size: 44, r: -8 }) : ''); },
  sfx: [[at(8, 'photo'), 'pop_hi', .4], [at(8, 'plafond') - .1, 'pop', .5], [at(8, 'plafond') + .15, 'shutter', .8], [at(8, 'plafond') + .25, 'flash_hit', .3]] });

// B009 — « tu l'envoies. » : bouton ENVOYER, la photo part comme une fusée vers « KEVIN »
B(9, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d) }),
  draw: (t, d, T) => { const En = at(9, 'envoies'), k = eOutCubic(seg(t, En, En + .35));
    const inner = rect(-210, -380, 420, 760, '#f4f1ea', 0, 0) + snTop('ENVOYER À…', SNAPY) + snRow(-220, 'Kevin', 'snap', '#5fb85f', t, { streak: '487', hi: 1 }) + snRow(-110, 'Maman', 'open', '#ff8fb1', t) + snRow(0, 'Lucas', 'open', '#5b8fd8', t) +
      G(tr(0, 290, t > En && t < En + .15 ? .9 : 1), rect(-170, -46, 340, 92, SNV, 46, 6) + ftext(0, 16, 'ENVOYER ➜', { size: 40, fill: '#fff', stroke: 'none' }));
    return gridBg('#2a1f4a', 'rgba(255,255,255,.07)') + halftoneFade('#fff', .05, 1) + snBig(CX, 830, .85, inner) +
      (t > En ? G(tr(lerp(CX, 980, k), lerp(830, 380, k), 1 - .5 * k, 30), rect(-60, -80, 120, 160, '#3a4380', 10, 6) + snGhost(0, 0, .4)) + speedLines(t, 900, 450, 14, 'rgba(255,255,255,.5)') : '') +
      kword("TU L'ENVOIES", CX, 400, t, En - .1, { size: 80, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(9, 'envoies') - .1, 'pop', .5], [at(9, 'envoies'), 'whoosh_up', .7], [at(9, 'envoies') + .2, 'ding', .4]] });

// B010 — « OUF, 487 JOURS SAUVÉS. » : la flamme repart en grand, compteur 487, héros s'effondre de soulagement, confettis
B(10, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Of = at(10, 'ouf'), N = at(10, '487'), Sa = at(10, 'sauves');
    return rays(t, CX, 820, '#ffe680', '#ffb03a', 22) + snFlame(CX, 800, 2.4 * eOutBack(seg(t, Of, Of + .4)), t) +
      (t > N ? G(tr(CX, 860), ftext(0, 40, String(counter(400, 487, t, N, .9)), { size: 170, fill: '#fff' })) : '') +
      cutout(heroP({ x: 230, y: 1480, s: 1.15, expr: 'ecstatic', rot: -8, armL: [-150, -120], armR: [-30, -60] }, t), 10) + sweat(330, 980 + (t * 40) % 30, 1.3) +
      kword('OUF.', CX, 420, t, Of - .05, { size: 130, fill: '#fff', op: t > N ? 0 : 1 }) + kword('487 JOURS', CX, 420, t, N - .05, { size: 110, fill: '#fff' }) +
      (t > Sa ? stamp(800, 1100, 'SAUVÉS', t, Sa - .05, '#36a85a', -10, 70) : '') + confetti(t, Sa, 30); },
  sfx: [[0, 'flash_hit', .4], [at(10, 'ouf'), 'gasp', .5], [at(10, 'ouf') + .05, 'fire', .5], [at(10, '487') - .05, 'boom', .5], [at(10, '487'), 'slot', .4], [at(10, 'sauves') - .05, 'tada', .6]] });

// B011 — « Bienvenue dans la vie d'un accro à Snapchat. » : chambre, néon « BIENVENUE », héros zombie, notifs qui pleuvent
B(11, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bv = at(11, 'bienvenue'), Ac = at(11, 'accro');
    let notifs = ''; for (let i = 0; i < 6; i++) { const k = ((t * .9 + i / 6) % 1); notifs += op(1 - k * .5, G(tr(140 + (i * 173) % 820, 600 + k * 500, .9, (i % 2 ? 8 : -8)), rect(-80, -30, 160, 60, '#fff', 30, 5) + circ(-50, 0, 18, SNAPY, 4) + rect(-22, -8, 80, 16, '#ccc', 8, 0))); }
    return snRoom(t, '00:00') + WASH('rgba(10,10,40,.2)') + (t > Bv ? notifs : '') + op(.35, glow(560, 1000, 320, '#9fd0ff', .8)) +
      heroP({ x: 540, y: 1490, s: 1.3, expr: 'dizzy', look: [0, 1], armR: [20, -60], holdR: snPh(.5, 'glow') }, t) +
      funTag(CX, 390, 'BIENVENUE', t, Bv - .05, { size: 60, bg: '#ff5c8a', r: -3 }) + kthin("dans la vie d'un", CX, 500, t, Bv + .2, { size: 54 }) + kword('ACCRO', CX, 620, t, Ac - .05, { size: 120, fill: SX.acc2 }) + snIcon(860, 760, .55, 12); },
  sfx: [[0, 'whoosh', .4], [at(11, 'bienvenue'), 'magic', .5], [at(11, 'vie'), 'vibrate', .4], [at(11, 'accro') - .05, 'boom', .5], [at(11, 'snapchat'), 'ding', .4]] });

// B012 — « Au début, tu voulais simplement parler à tes potes. » : cour (souvenir sépia), le héros et ses potes discutent pour de vrai
B(12, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const De = at(12, 'debut'), Pa = at(12, 'parler'), Po = at(12, 'potes');
    return schoolyard(t) + WASH('rgba(255,220,160,.22)') +
      heroP({ x: 300, y: 1490, s: 1.25, expr: 'laugh', face: t > Pa ? { mouth: 'talk' } : {}, armL: [150, 60] }, t) + kevin({ x: 620, y: 1490, s: 1.2, expr: 'laugh', flip: 1 }, t) + kid(3, { x: 880, y: 1490, s: 1.15, expr: 'happy', flip: 1 }, t + 1) +
      chatBubble(300, 840, 240, 90, 'Salut !', t, Pa, true, 40) + chatBubble(740, 760, 260, 90, 'Trop bien !', t, Po, false, 40) +
      funTag(CX, 420, 'AU DÉBUT', t, De - .1, { size: 60, bg: SNV, r: -4 }) + kthin('juste parler à tes potes', CX, 560, t, Pa - .1, { size: 52 }); },
  sfx: [[0, 'whoosh', .4], [at(12, 'debut') - .1, 'pop', .5], [at(12, 'parler'), 'pop_hi', .5], [at(12, 'potes'), 'pop_hi', .5], [at(12, 'potes') + .2, 'chirp', .3]] });

// B013a — « Maintenant, tu envoies 15 photos noires par jour » : rafale de photos noires, compteur 1→15
const O13 = at(13, 'des') - .15;
B(13, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const Mt = at(13, 'maintenant'), En = at(13, 'envoies'), N = at(13, '15'), No = at(13, 'noires'), Jo = at(13, 'jour');
    const n = t > N ? counter(1, 15, t, N, .9) : 0;
    let ph = ''; for (let i = 0; i < 14; i++) { const t0 = En + i * .1; if (t < t0) continue; const k = ((t - t0) * .9) % 1;
      ph += G(tr(560 + Math.cos(i * 2.1) * (100 + 600 * k), 960 - 520 * k + Math.sin(i * 1.3) * 80, .5 + .6 * k, i * 23), rect(-60, -80, 120, 160, '#111', 8, 6) + rect(-60, -80, 120, 160, 'none', 8, 4, '#fff')); }
    return snRoom(t, '18:30') + WASH('rgba(10,10,40,.2)') + ph +
      heroP({ x: 540, y: 1490, s: 1.3, expr: 'deadpan', look: [0, 1], armR: [20, -60], holdR: snPh(.5, 'black'), armL: [-150, -120] }, t) +
      funTag(CX, 400, 'MAINTENANT', t, Mt - .1, { size: 50, bg: SNV, r: -3 }) + (n ? kword(n + ' PHOTOS NOIRES', CX, 540, t, N - .05, { size: 78, fill: '#fff' }) : '') +
      (t > Jo ? funTag(840, 700, 'PAR JOUR', t, Jo - .05, { size: 40, bg: '#e2463a', r: 6 }) : ''); },
  sfx: [[0, 'flash_hit', .4], [at(13, 'maintenant') - .1, 'pop', .5], [at(13, 'envoies'), 'shutter', .5], [at(13, '15') - .05, 'boom', .5], [at(13, 'photos'), 'shutter', .5], [at(13, 'noires'), 'shutter', .5], [at(13, 'jour'), 'pop_hi', .4]] });
// B013b — « …à des gens avec qui tu ne discutes même plus. » : liste de contacts poussiéreuse, toiles d'araignée, « dernier message : 2021 »
B(13, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ge = at(13, 'gens') - O13, Di = at(13, 'discutes') - O13, Pl = at(13, 'plus') - O13;
    const ppl = [['Inconnu 1', '#8a8f99', '2019'], ['Le mec du camping', '#ff9a4d', '2020'], ['Cousin Théo', '#5b8fd8', '2021'], ['???', '#b56cf0', '2018'], ['Ex-voisin', '#36a85a', '2017']];
    const inner = rect(-210, -380, 420, 760, '#f4f1ea', 0, 0) + snTop('AMIS', SNAPY) + ppl.map(([nm, c, y], i) => op(seg(t, Ge + i * .1, Ge + i * .1 + .2), snRow(-210 + i * 112, nm, 'snap', c, t, { sub: t > Di ? 'Dernier msg : ' + y : 'Nouveau snap' }))).join('') +
      (t > Pl ? op(.5, path('M-210 -270L-110 -170M-210 -230L-150 -170M-170 -270L-110 -210', 'none', 3, '#555') + path('M210 300L110 200M210 260L150 200M170 300L110 240', 'none', 3, '#555')) : '');
    return gridBg('#2a1f4a', 'rgba(255,255,255,.07)') + halftoneFade('#fff', .05, 1) + snBig(CX, 830, .85, inner) +
      cutout(heroHead(170, 1080, 90, { expr: 'deadpan' }, t), 8) + kthin('à des gens avec qui', CX, 400, t, Ge - .2, { size: 52 }) +
      (t > Di ? funTag(CX, 1220, 'TU NE DISCUTES MÊME PLUS', t, Di - .05, { size: 34, bg: '#e2463a', r: -2 }) : ''); },
  sfx: [[0, 'whoosh', .3], [at(13, 'gens') - O13, 'pop_hi', .4], [at(13, 'gens') - O13 + .2, 'pop_hi', .4], [at(13, 'discutes') - O13, 'crickets', .4], [at(13, 'plus') - O13, 'wind', .3]] }, O13);

// B014 — « Kevin t'envoie son genou, » : sur l'écran, un snap de Kevin… c'est un genou (poilu, avec un pansement)
B(14, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(14, 'kevin'), Ge = at(14, 'genou');
    const knee = rect(-210, -380, 420, 760, '#c9b8a0', 0, 0) + ell(0, 60, 190, 250, SK[0], 7) + ell(0, 0, 90, 70, shade(SK[0], -.08), 0) + [0, 1, 2, 3, 4, 5].map(i => path(`M${-120 + i * 46} ${180 + (i % 2) * 20}q6 -20 0 -34`, 'none', 4)).join('') +
      G(tr(40, -10, 1, 20), rect(-60, -22, 120, 44, '#f4d6a8', 12, 5) + rect(-20, -16, 40, 32, '#e8c690', 4, 0)) + rect(-210, -380, 420, 90, 'rgba(0,0,0,.35)', 0, 0) + circ(-160, -335, 26, '#5fb85f', 4) + ftext(-120, -325, 'Kevin', { size: 30, fill: '#fff', stroke: 'none', anchor: 'start' });
    return snRoom(t, '00:02') + WASH('rgba(10,10,40,.3)') + (t > K ? snBig(CX, 830, .85, t > Ge - .1 ? knee : rect(-210, -380, 420, 760, SNV, 0, 0) + snGhost(0, 0, 1.2), {}) : '') +
      cutout(kevinHead(170, 1060, 95, { expr: 'smugger' }, t), 8) + kthin("Kevin t'envoie", CX, 400, t, K - .1, { size: 56 }) + (t > Ge ? kword('SON GENOU', CX, 520, t, Ge - .05, { size: 96, fill: SX.acc2 }) : ''); },
  sfx: [[at(14, 'kevin'), 'ding', .6], [at(14, 'kevin') + .1, 'vibrate', .4], [at(14, 'genou') - .05, 'boom', .4], [at(14, 'genou'), 'squeak', .5]] });

// B015 — « tu réponds avec ton oreiller. » : le héros photographie son oreiller, très sérieusement
B(15, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Re = at(15, 'reponds'), Or = at(15, 'oreiller'), cl = Or + .1;
    return snRoom(t, '00:03') + WASH('rgba(10,10,40,.2)') + G(tr(760, 1060, 1.2, Math.sin(t * 3) * 3), ell(0, 0, 170, 90, '#fff', 7) + path('M-120 -20Q0 -60 120 -20', 'none', 5, '#dde3ef') + ftext(0, 20, 'zzz', { size: 40, fill: '#9aa3ad', stroke: 'none' })) +
      heroP({ x: 280, y: 1490, s: 1.3, expr: 'cool', look: [1, 0], armR: [-20, -10], holdR: snPh(.5, 'snap') }, t) + (t > cl ? op(1 - seg(t, cl, cl + .3), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0)) : '') +
      kthin('tu réponds avec', CX, 400, t, Re - .1, { size: 56 }) + kword('TON OREILLER', CX, 520, t, Or - .05, { size: 96, fill: SX.acc2 }) + (t > cl ? funTag(760, 880, 'ENVOYÉ ✓', t, cl + .1, { size: 36, bg: SNV, r: 5 }) : ''); },
  sfx: [[at(15, 'reponds'), 'pop_hi', .4], [at(15, 'oreiller') - .05, 'boom', .4], [at(15, 'oreiller') + .1, 'shutter', .7], [at(15, 'oreiller') + .3, 'whoosh_up', .4]] });

// B016a — « Magnifique, » : rayons dorés, le genou et l'oreiller encadrés comme au musée, héros et Kevin applaudissent
const O16 = at(16, 'la') - .15;
B(16, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), shake: t < .3 ? 5 : 0 }),
  draw: (t, d, T) => { const Mg = at(16, 'magnifique'), clap = Math.sin(t * 22) > 0;
    const frame = (x, inner, r) => G(tr(x, 830, 1, r), rect(-150, -180, 300, 360, '#e8b923', 10, 7) + rect(-124, -154, 248, 308, '#fff', 4, 4) + inner);
    return rays(t, CX, 850, '#ffe680', '#ffc93a', 22) + frame(320, ell(0, 20, 90, 120, SK[0], 6) + ell(0, -10, 40, 30, shade(SK[0], -.1), 0), -4) + frame(760, ell(0, 0, 100, 56, '#fff', 6) + path('M-70 -10Q0 -40 70 -10', 'none', 4, '#dde3ef'), 4) +
      cutout(heroP({ x: 200, y: 1490, s: 1.0, expr: 'ecstatic', armL: [70, clap ? -5 : -30], armR: [110, clap ? -175 : -150] }, t), 8) + cutout(kevin({ x: 880, y: 1490, s: 1.0, expr: 'ecstatic', flip: 1, armL: [70, clap ? -5 : -30], armR: [110, clap ? -175 : -150] }, t), 8) +
      kword('MAGNIFIQUE.', CX, 440, t, Mg - .05, { size: 110, fill: '#fff' }) + popStars(CX, 440, t, Mg + .1, 8, 300); },
  sfx: [[0, 'flash_hit', .4], [at(16, 'magnifique') - .05, 'boom', .6], [at(16, 'magnifique'), 'angel', .5], [at(16, 'magnifique') + .2, 'sparkle', .4]] });
// B016b — « …la communication humaine a atteint son apogée. » : frise de l'évolution (grotte → lettre → téléphone → GENOU couronné)
B(16, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Co = at(16, 'communication') - O16, Hu = at(16, 'humaine') - O16, At = at(16, 'atteint') - O16, Ap = at(16, 'apogee') - O16;
    const steps = [
      [150, 1030, G(tr(0, 0), rect(-80, -70, 160, 140, '#b8854f', 12, 6) + path('M-50 30L-20 -20L10 30M-30 10L0 10', 'none', 6, '#5a3320') + circ(30, -30, 16, '#5a3320', 0)), 'GROTTE'],
      [390, 930, G(tr(0, 0), rect(-80, -55, 160, 110, '#fff8e6', 6, 6) + path('M-80 -55L0 10L80 -55', 'none', 5) + circ(0, 20, 14, '#e2463a', 4)), 'LETTRE'],
      [630, 830, phone(0, 0, .5, 0, rect(-66, -128, 132, 250, '#bfe3ff', 12, 0)), 'TÉLÉPHONE'],
      [880, 700, G(tr(0, 0), rect(-80, -100, 160, 200, '#fff', 10, 6) + ell(0, 10, 56, 72, SK[0], 5) + ell(0, -6, 26, 20, shade(SK[0], -.1), 0) + path('M-50 -130L-30 -170L0 -140L30 -170L50 -130Z', '#ffd23f', 5)), 'GENOU']];
    const tt = [Co, Hu, At, Ap];
    return streetT(t, 2) + WASH('rgba(255,240,200,.35)') + path('M100 1150L980 760', 'none', 14, '#fff') + path('M100 1150L980 760', 'none', 6, SNV) +
      steps.map(([x, y, s, lb], i) => t > tt[i] ? G(tr(x, y, pop(t, tt[i], .35) * (i === 3 ? 1.2 : 1)), s + funTag(0, 150, lb, t, tt[i] + .05, { size: 26, bg: i === 3 ? SNV : '#fff', fg: i === 3 ? '#fff' : SX.ink, r: 0 })) : '').join('') +
      (t > Ap ? popStars(880, 700, t, Ap, 8, 260) + markerCircle(880, 700, 150, 170, t, Ap + .1, { col: '#e2463a' }) : '') +
      kthin('la communication humaine', CX, 400, t, Co - .2, { size: 52 }) + kword('SON APOGÉE', CX, 520, t, Ap - .1, { size: 96, fill: SX.acc2 }); },
  sfx: [[at(16, 'communication') - O16, 'pop', .4], [at(16, 'humaine') - O16, 'pop', .4], [at(16, 'atteint') - O16, 'pop', .4], [at(16, 'apogee') - O16 - .1, 'tada', .6], [at(16, 'apogee') - O16 + .1, 'scratch', .4]] }, O16);

// B017 — « À l'école, tu regardes ton score Snap, il augmente. » : classe, téléphone sous la table, score géant qui grimpe
B(17, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ec = at(17, 'ecole'), Sc = at(17, 'score'), Au = at(17, 'augmente');
    const sc = counter(12480, 12497, t, Au - .1, 1.2);
    return classroomT(t, ftext(540, 560, 'Leçon 4 : …', { size: 70, fill: 'rgba(255,255,255,.85)', stroke: 'none' })) + WASH() +
      adult(1, { x: 900, y: 1300, s: .7, expr: 'talk', flip: 1, armR: [-30, -60] }, t) +
      heroP({ x: 330, y: 1490, s: 1.3, expr: t > Au ? 'love' : 'suspicious', look: [.5, 1], armR: [-10, -60], holdR: snPh(.5, 'snap') }, t) + desk(330, 1330, 1.05) +
      funTag(CX, 400, "À L'ÉCOLE", t, Ec - .1, { size: 54, bg: '#36a85a', r: -4 }) +
      (t > Sc ? G(tr(720, 820, pop(t, Sc, .35)), rect(-230, -100, 460, 200, '#fff', 30, 7) + snGhost(-160, 0, .6, SNAPY) + ftext(-100, -30, 'SCORE SNAP', { size: 30, fill: '#8a8f99', stroke: 'none', anchor: 'start' }) +
        ftext(-100, 50, sc.toLocaleString('fr-FR').replace(/\s/g, ' '), { size: 68, fill: SNV, stroke: 'none', anchor: 'start' })) : '') +
      (t > Au ? kword('IL AUGMENTE', CX, 560, t, Au - .05, { size: 80, fill: SX.acc2 }) + markerArrow(1000, 1000, 980, 900, t, Au, { bend: 30 }) : ''); },
  sfx: [[0, 'school_bell', .3], [at(17, 'ecole') - .1, 'pop', .5], [at(17, 'score'), 'pop_hi', .5], [at(17, 'augmente') - .1, 'clock_fast', .4], [at(17, 'augmente'), 'kaching', .5]] });

// B018 — « Tu es heureux. » : gros plan, extase totale, cœurs et étoiles
B(18, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const He = at(18, 'heureux');
    return rays(t, CX, 920, '#ffd9f0', '#ff9ad0', 20) + cutout(heroHead(CX, 940, 230, { expr: 'ecstatic', face: { blush: 1 } }, t), 12) + heartsUp(t, CX, 900, 6) + popStars(CX, 900, t, He, 8, 340) +
      kword('HEUREUX', CX, 470, t, He - .1, { size: 120, fill: '#fff' }); },
  sfx: [[at(18, 'heureux') - .1, 'boom', .4], [at(18, 'heureux'), 'angel', .5], [at(18, 'heureux') + .1, 'sparkle', .4]] });

// B019 — « Pourquoi ? AUCUNE IDÉE. » : grille, héros qui hausse les épaules, « ? » géant, grillons
B(19, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), shake: t > at(19, 'aucune') && t < at(19, 'aucune') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const Po = at(19, 'pourquoi'), Au = at(19, 'aucune');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 900, 300, t, Po, SX.acc, 16) +
      (t > Po && t < Au ? G(tr(CX, 860, pop(t, Po, .35)), ftext(0, 80, '?', { size: 340, fill: SX.acc2 })) : '') +
      cutout(heroP({ x: CX, y: 1480, s: 1.25, expr: t > Au ? 'deadpan' : 'confused', armL: t > Au ? [180, -110] : [110, 100], armR: t > Au ? [0, -70] : [70, 80] }, t), 12) +
      kword('POURQUOI ?', CX, 430, t, Po - .05, { size: 110, fill: '#fff', op: t > Au ? 0 : 1 }) + kword('AUCUNE IDÉE.', CX, 430, t, Au - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .3], [at(19, 'pourquoi'), 'hmm', .5], [at(19, 'aucune') - .05, 'boom', .6], [at(19, 'aucune') + .2, 'crickets', .5]] });

// B020 — « Ta crush t'envoie un message, tu l'ouvres. » : notif à cœur, le héros fond, ouvre le message
B(20, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Cr = at(20, 'crush'), Me = at(20, 'message'), Ou = at(20, 'ouvres');
    const notif = G(tr(720, 760, pop(t, Me, .35), 4), rect(-260, -70, 520, 140, '#fff', 30, 7) + circ(-190, 0, 46, '#ff8fb1', 5) + G(tr(-190, 6), crushHead(0, 0, 34, { expr: 'happy' }, t)) +
      ftext(-125, -12, 'Léa ♥', { size: 36, fill: OL, stroke: 'none', anchor: 'start' }) + ftext(-125, 34, t > Ou ? 'Ouvert ✓' : 'Nouveau message', { size: 26, fill: t > Ou ? SNV : '#e2463a', stroke: 'none', anchor: 'start' }));
    return snRoom(t, '21:14') + WASH('rgba(10,10,40,.2)') + op(.35, glow(330, 1000, 320, '#ffb3d0', .8)) +
      heroP({ x: 300, y: 1490, s: 1.3, expr: t > Me ? 'love' : 'neutral', look: [1, -.5], armR: [20, -60], holdR: snPh(.5, 'glow') }, t) + (t > Me ? heartsUp(t, 320, 950, 4) + notif : '') +
      funTag(CX, 400, 'TA CRUSH', t, Cr - .1, { size: 60, bg: '#ff5c8a', r: -4 }) + (t > Ou ? kword("TU L'OUVRES", CX, 540, t, Ou - .05, { size: 80, fill: SX.acc2 }) : ''); },
  sfx: [[at(20, 'crush') - .1, 'pop', .5], [at(20, 'message'), 'ding', .6], [at(20, 'message') + .1, 'kiss', .4], [at(20, 'ouvres'), 'pop_hi', .5]] });

// B021 — « Elle te laisse en vu, tu attends. » : écran « VU ✓ » géant, le héros se fige
B(21, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), shake: t > at(21, 'vu') && t < at(21, 'vu') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const Vu = at(21, 'vu'), Att = at(21, 'attends');
    const inner = rect(-210, -380, 420, 760, '#f4f1ea', 0, 0) + snTop('Léa ♥', '#fff') + G(tr(60, -150), rect(-130, -40, 260, 80, SNV, 30, 0) + ftext(0, 14, 'Coucou !! :)', { size: 32, fill: '#fff', stroke: 'none' })) +
      G(tr(-50, -40), rect(-140, -40, 280, 80, '#fff', 30, 4) + ftext(0, 14, 'tu fais quoi ?', { size: 30, fill: OL, stroke: 'none' })) +
      (t > Vu ? G(tr(0, 120, pop(t, Vu, .35)), ftext(0, 40, 'VU', { size: 150, fill: '#e2463a', stroke: 'none' }) + path('M-120 90L-40 140L120 40', 'none', 12, '#e2463a')) : '');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: snRoom(t, '21:15'), haze: .4 }]) + snBig(700, 880, .8, inner) + cutout(heroHead(220, 1020, 120, { expr: t > Vu ? 'jawdrop' : 'love' }, t), 8) +
      kword('LAISSÉ EN VU', CX, 400, t, Vu - .05, { size: 84, fill: '#fff' }) + (t > Att ? funTag(220, 1220, 'TU ATTENDS…', t, Att - .05, { size: 34, bg: SNV, r: -4 }) : ''); },
  sfx: [[0, 'flash_hit', .4], [at(21, 'laisse'), 'pop_hi', .4], [at(21, 'vu') - .05, 'boom', .5], [at(21, 'vu'), 'error_beep', .5], [at(21, 'attends'), 'clock_fast', .4]] });

// B022 — « Une minute, » : le héros fixe l'écran, horloge 00:01, sueur
B(22, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d) }),
  draw: (t, d, T) => { const Mi = at(22, 'minute');
    return snRoom(t, '21:16') + WASH('rgba(10,10,40,.25)') + heroP({ x: 330, y: 1490, s: 1.3, expr: 'worried', look: [1, -.3], armR: [20, -60], holdR: snPh(.5, 'glow') }, t) + sweat(440, 960 + (t * 40) % 30, 1.1) +
      G(tr(780, 820), bigClockF(0, 0, '00:01', SX.acc2, .9)) + kword('UNE MINUTE', CX, 450, t, Mi - .1, { size: 100, fill: '#fff' }); },
  sfx: [[at(22, 'une'), 'tick', .6], [at(22, 'minute'), 'tick', .6], [at(22, 'minute') + .3, 'tick', .5]] });

// B023 — « dix minutes. » : toiles d'araignée, le héros est devenu une statue poussiéreuse
B(23, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d) }),
  draw: (t, d, T) => { const Di = at(23, 'dix');
    return snRoom(t, '21:25') + WASH('rgba(80,80,100,.35)') + heroP({ x: 330, y: 1490, s: 1.3, expr: 'dead', look: [1, -.3], armR: [20, -60], holdR: snPh(.5, 'glow'), skin: '#d8d2c8', shirt: '#c9c2a8' }, t) +
      op(.7, path('M180 700L300 820M180 760L250 830M230 700L300 780', 'none', 3, '#fff') + path('M480 820L560 700M520 830L560 760', 'none', 3, '#fff')) + G(tr(780, 820), bigClockF(0, 0, '00:10', '#ff5c5c', .9)) +
      kword('DIX MINUTES', CX, 450, t, Di - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[at(23, 'dix') - .05, 'boom', .4], [at(23, 'dix'), 'clock_fast', .5], [at(23, 'minutes'), 'wind', .4]] });

// B024 — « Tu vérifies si elle est active. » : loupe sur la pastille verte « active il y a 2 min »
B(24, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ve = at(24, 'verifies'), Ac = at(24, 'active');
    const inner = rect(-210, -380, 420, 760, '#f4f1ea', 0, 0) + snTop('PROFIL', '#fff') + circ(0, -130, 110, '#ff8fb1', 6) + G(tr(0, -120), crushHead(0, 0, 80, { expr: 'happy' }, t)) +
      ftext(0, 50, 'Léa ♥', { size: 44, fill: OL, stroke: 'none' }) + circ(-120, 120, 16, '#36d06a', 4) + ftext(-92, 130, t > Ac ? 'active il y a 2 min' : 'active…', { size: 26, fill: '#36a85a', stroke: 'none', anchor: 'start' });
    return snRoom(t, '21:27') + WASH('rgba(10,10,40,.3)') + snBig(680, 880, .8, inner) + (t > Ac ? magnifier(590 + Math.sin(t * 6) * 10, 940, .8, 0) : '') +
      cutout(heroHead(200, 1020, 115, { expr: 'suspicious', look: [1, 0] }, t), 8) + kthin('tu vérifies si elle est', CX, 400, t, Ve - .1, { size: 52 }) + kword('ACTIVE', CX, 495, t, Ac - .05, { size: 88, fill: '#7be07b' }); },
  sfx: [[at(24, 'verifies'), 'typing', .4], [at(24, 'active') - .05, 'boom', .4], [at(24, 'active'), 'hmm', .5], [at(24, 'active') + .2, 'ding', .3]] });

// B025 — « Puis sa localisation, si elle la partage. » : carte fictive, pin avec sa tête, le héros en chapeau de détective
const snDetHat = (r) => path(`M${-r * 1.15} ${-r * .55}Q0 ${-r * .75} ${r * 1.15} ${-r * .55}Q${r * .9} ${-r * .35} 0 ${-r * .42}Q${-r * .9} ${-r * .35} ${-r * 1.15} ${-r * .55}Z`, '#8a6a4a', 6) +
  path(`M${-r * .72} ${-r * .55}Q${-r * .7} ${-r * 1.25} 0 ${-r * 1.25}Q${r * .7} ${-r * 1.25} ${r * .72} ${-r * .55}Z`, '#a8865e', 6) + path(`M${-r * .7} ${-r * .7}Q0 ${-r * .82} ${r * .7} ${-r * .7}`, 'none', r * .1, '#5a3a26');
const detHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: heroHair, skin: SK[1], seed: 2 }, o), t) + snDetHat(r));
B(25, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Lo = at(25, 'localisation'), Pa = at(25, 'partage'), k = eOutBack(seg(t, Lo, Lo + .4));
    const pin = G(tr(120, -40 - 40 * (1 - k)), path('M0 70L-50 0A60 60 0 1 1 50 0Z', '#ff5c8a', 6) + G(tr(0, -30), crushHead(0, 0, 38, { expr: 'happy' }, t)));
    const inner = snMap(420, 760, t) + snTop('CARTE', '#fff') + (t > Lo ? pin + op(.3, circ(120, 10, 60 + 30 * Math.sin(t * 6), '#ff5c8a', 0)) : '') + circ(-100, 180, 20, '#5b8fd8', 5) + ftext(-100, 230, 'toi', { size: 24, fill: OL, stroke: 'none' });
    return snRoom(t, '21:31') + WASH('rgba(10,10,40,.3)') + snBig(680, 880, .8, inner) + cutout(detHead(200, 1040, 115, { expr: 'suspicious', look: [1, 0] }, t), 8) +
      kthin('puis sa', CX, 400, t, at(25, 'puis') - .1, { size: 56 }) + kword('LOCALISATION', CX, 520, t, Lo - .05, { size: 92, fill: SX.acc2 }) +
      (t > Pa ? funTag(220, 1240, 'si elle la partage…', t, Pa - .1, { size: 30, bg: '#fff', fg: SX.ink, r: -3 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(25, 'localisation') - .05, 'boom', .4], [at(25, 'localisation') + .1, 'pop', .6], [at(25, 'partage'), 'hmm', .4]] });

// B026 — « TU VOULAIS TOMBER AMOUREUX, T'ES DEVENU ENQUÊTEUR PRIVÉ. » : tableau en liège, fils rouges, imperméable, débloqué (2/3)
B(26, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Am = at(26, 'amoureux'), Dv = at(26, 'devenu'), Eq = at(26, 'enqueteur');
    const items = [[230, 600, -4, 'photo'], [540, 590, 3, 'map'], [850, 610, -3, 'vu'], [260, 900, 3, 'clock'], [820, 910, -4, 'active']];
    const it = (kind) => kind === 'photo' ? rect(-90, -70, 180, 140, '#fff', 6, 5) + rect(-76, -58, 152, 100, '#ffd9e6', 4, 0) + G(tr(0, -6), crushHead(0, 0, 38, { expr: 'happy' }, t)) :
      kind === 'map' ? rect(-110, -70, 220, 140, '#fff', 6, 5) + clipR(-100, -60, 200, 120, snMap(200, 120, t), 4) + path('M30 0L18 -16A16 16 0 1 1 42 -16Z', '#ff5c8a', 4) :
      kind === 'vu' ? rect(-90, -60, 180, 120, '#fff8b0', 4, 5) + ftext(0, -6, 'VU', { size: 50, fill: '#e2463a', stroke: 'none' }) + ftext(0, 36, '21:15', { size: 26, fill: OL, stroke: 'none' }) :
      kind === 'clock' ? rect(-90, -60, 180, 120, '#fff8b0', 4, 5) + ftext(0, -4, 'active', { size: 32, fill: '#36a85a', stroke: 'none' }) + ftext(0, 36, 'il y a 2 min', { size: 22, fill: OL, stroke: 'none' }) :
      rect(-90, -60, 180, 120, '#fff', 4, 5) + ftext(0, 10, '???', { size: 48, fill: SNV, stroke: 'none' });
    const strings = [[0, 1], [1, 2], [0, 3], [2, 4], [3, 4], [1, 4]].map(([a, b], i) => { const kk = eOutCubic(seg(t, Dv + i * .08, Dv + i * .08 + .3)); const [x1, y1] = items[a], [x2, y2] = items[b]; return kk > 0 ? line(x1, y1, lerp(x1, x2, kk), lerp(y1, y2, kk), 6, '#e2463a') : ''; }).join('');
    return snBoard(t) + items.map(([x, y, r, k], i) => G(tr(x, y, pop(t, i * .1, .3), r), it(k) + circ(0, -62, 11, DPAL[i], 4))).join('') + strings + unlock(CX, 1050, t, Eq, { part: 'back', r: 420 }) +
      cutout(detHead(CX, 1060, 120, { expr: t > Eq ? 'smug' : 'love', look: [0, -.4] }, t), 8) + (t > Eq ? magnifier(680, 1080, .7, -20) : '') + unlock(CX, 1050, t, Eq, { part: 'front', r: 420 }) +
      kthin('tu voulais tomber amoureux…', CX, 400, t, .02, { size: 50, out: Dv - .1 }) + kword('ENQUÊTEUR PRIVÉ', CX, 420, t, Eq - .05, { size: 84, fill: SX.acc2 }) +
      (t > Am && t < Dv ? heartsUp(t, CX, 1000, 4) : ''); },
  sfx: [[0, 'flash_hit', .4], [at(26, 'amoureux'), 'kiss', .4], [at(26, 'devenu'), 'scratch', .4], [at(26, 'devenu') + .2, 'tick', .4], [at(26, 'enqueteur') - .05, 'boom', .6], [at(26, 'enqueteur'), 'sparkle', .5], [at(26, 'prive'), 'sting', .5]] });

// B027 — « À table, ta mère te demande de poser ton téléphone. » : cuisine, maman pointe le doigt, pancarte « 0 TÉLÉPHONE »
B(27, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ta = at(27, 'table'), Me = at(27, 'mere'), Po = at(27, 'poser');
    return snKitchen(t) + WASH() + adult(3, { x: 800, y: 1440, s: 1.1, hair: 'long', expr: t > Po ? 'angry' : 'neutral', flip: 1, face: t > Me ? { mouth: 'talk' } : {}, armR: t > Po ? [-10, -5] : [70, 80] }, t) +
      heroP({ x: 280, y: 1480, s: 1.2, expr: t > Po ? 'shock' : 'deadpan', look: [0, 1], armR: [20, -60], holdR: snPh(.5, 'glow') }, t) +
      snTable(1250, t) + snPlate(300, 1290, 1, 'pasta', t) + snPlate(780, 1290, 1, 'pasta', t + 1) +
      funTag(CX, 400, 'À TABLE', t, Ta - .1, { size: 60, bg: '#ff9a4d', r: -4 }) + (t > Po ? kword('POSE TON TÉLÉPHONE', CX, 540, t, Po - .05, { size: 64, fill: '#fff' }) : '') +
      (t > Me ? chatBubble(760, 760, 180, 80, '!!!', t, Me, false, 44) : ''); },
  sfx: [[0, 'whoosh', .4], [at(27, 'table') - .1, 'pop', .5], [at(27, 'mere'), 'hmm', .4], [at(27, 'poser') - .05, 'boom', .4], [at(27, 'telephone'), 'error_beep', .4]] });

// B028 — « Tu acceptes. » : le téléphone posé sur la table, le héros le lâche comme un adieu déchirant
B(28, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
  draw: (t, d, T) => { const Ac = at(28, 'acceptes');
    return snKitchen(t) + WASH() + heroP({ x: 420, y: 1480, s: 1.25, expr: 'sob', look: [.5, 1], armR: [-20, 20] }, t) + snTable(1250, t) + snPlate(560, 1300, 1, 'pasta', t) +
      G(tr(780, 1240), rect(-80, -18, 160, 36, '#22222b', 10, 5) + rect(-70, -11, 140, 22, '#3a3f4a', 6, 0)) + (t > Ac ? heart(780, 1150 - (t - Ac) * 80, .5, '#ff5d73') : '') +
      kword('TU ACCEPTES.', CX, 450, t, Ac - .1, { size: 96, fill: '#fff' }); },
  sfx: [[at(28, 'acceptes') - .1, 'thud', .5], [at(28, 'acceptes'), 'sting', .4], [at(28, 'acceptes') + .2, 'gulp', .5]] });

// B029 — « 30 secondes plus tard… » : carton façon dessin animé, fond à rayons, horloge qui file
B(29, { enter: 'none', trans: 'circle', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d) }),
  draw: (t, d, T) => { const S = at(29, '30');
    return rays(t, CX, 900, '#8b5cf6', '#5a3ab8', 22) + G(tr(CX, 900, pop(t, S, .35), -3), rect(-420, -170, 840, 340, '#fff3c4', 40, 8) +
      ftext(0, -20, String(counter(0, 30, t, S, .6)) + ' SECONDES', { size: 92, fill: SNV }) + ftext(0, 100, 'PLUS TARD…', { size: 76, fill: '#ff7a1a' })) + popStars(CX, 900, t, S + .1, 8, 440); },
  sfx: [[at(29, '30'), 'rewind', .4], [at(29, '30') + .05, 'pop', .6], [at(29, 'secondes'), 'clock_fast', .4], [at(29, 'tard'), 'tada', .4]] });

// B030 — « tu le reprends. » : la main fond sur le téléphone en un éclair, maman se prend la tête
B(30, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d), shake: 6 }),
  draw: (t, d, T) => { const Re = at(30, 'reprends');
    return snKitchen(t) + WASH() + speedLines(t, CX, 1000, 26, 'rgba(255,255,255,.5)') + adult(3, { x: 820, y: 1440, s: 1.1, hair: 'long', expr: 'annoyed', flip: 1, armL: [-130, -60], armR: [-50, -120] }, t) +
      heroP({ x: 330, y: 1480, s: 1.25, expr: 'ecstatic', look: [0, 1], armR: [20, -60], holdR: snPh(.5, 'glow') }, t) + snTable(1250, t) + snPlate(560, 1300, 1, 'pasta', t) +
      kword('TU LE REPRENDS', CX, 450, t, Re - .1, { size: 90, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(30, 'reprends') - .1, 'whoosh', .7], [at(30, 'reprends'), 'boom', .4], [at(30, 'reprends') + .2, 'ding', .4]] });

// B031 — « Tu n'as même reçu aucune notification. » : écran vide « AUCUNE NOTIFICATION », boule d'herbe sèche qui passe
B(31, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Re = at(31, 'recu'), Au = at(31, 'aucune'), No = at(31, 'notification'), tx = lerp(-260, 260, seg(t, Re, d));
    const inner = rect(-210, -380, 420, 760, '#f4f1ea', 0, 0) + snTop('NOTIFICATIONS', '#fff') + snGhost(0, -80, 1.3, '#e8e8ee', { sad: 1 }) + ftext(0, 80, 'Aucune', { size: 40, fill: '#9aa3ad', stroke: 'none' }) + ftext(0, 126, 'notification', { size: 34, fill: '#9aa3ad', stroke: 'none' }) +
      G(tr(tx, 260, .7, t * 400), circ(0, 0, 60, 'none', 7, '#b8854f') + path('M-40 -24Q0 16 40 -24M-30 30Q0 -8 30 30', 'none', 5, '#b8854f'));
    return snKitchen(t) + WASH('rgba(255,255,255,.3)') + snBig(CX, 830, .82, inner) + cutout(heroHead(180, 1060, 95, { expr: 'confused' }, t), 8) +
      kthin("tu n'as même reçu", CX, 400, t, 0, { size: 54, out: Au - .1 }) + (t > Au ? kword('AUCUNE NOTIF', CX, 410, t, Au - .05, { size: 80, fill: '#fff' }) : ''); },
  sfx: [[at(31, 'recu'), 'wind', .4], [at(31, 'aucune') - .05, 'boom', .4], [at(31, 'notification'), 'crickets', .6]] });

// B032 — « Mais tu vérifies quand même. » : rafraîchissement frénétique, pouce flou, roue de chargement
B(32, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.08, t / d), hand: .6 }),
  draw: (t, d, T) => { const Ve = at(32, 'verifies'), Qu = at(32, 'quand');
    const spin = [0, 1, 2, 3, 4, 5, 6, 7].map(i => op(.25 + .75 * (((i + Math.floor(t * 16)) % 8) / 8), line(Math.cos(i * .785) * 30, -220 + Math.sin(i * .785) * 30, Math.cos(i * .785) * 50, -220 + Math.sin(i * .785) * 50, 8, SNV))).join('');
    const inner = rect(-210, -380, 420, 760, '#f4f1ea', 0, 0) + snTop('NOTIFICATIONS', '#fff') + spin + snGhost(0, 20, 1.1, '#e8e8ee', { sad: 1 }) +
      [0, 1, 2].map(i => op(.5 - i * .15, G(tr(40, 120 - ((t * 900 + i * 60) % 260), 1), ell(0, 0, 50, 70, SK[1], 6)))).join('');
    return snKitchen(t) + WASH('rgba(255,255,255,.3)') + snBig(CX, 830, .82, inner) + cutout(heroHead(180, 1060, 95, { expr: 'panic' }, t), 8) + sweatSpray(180, 1000, t, 4) +
      kthin('mais tu vérifies', CX, 400, t, 0, { size: 56, out: Qu - .1 }) + (t > Qu ? kword('QUAND MÊME', CX, 410, t, Qu - .05, { size: 90, fill: SX.acc2 }) : ''); },
  sfx: [[at(32, 'verifies'), 'whoosh', .4], [at(32, 'verifies') + .15, 'whoosh', .4], [at(32, 'quand') - .05, 'boom', .4], [at(32, 'quand') + .1, 'tick', .5]] });

// B033 — « Puis un jour, tu sors avec tes amis. » : rue ensoleillée, la bande de 6 marche (Kevin compris)
B(33, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Jo = at(33, 'jour'), So = at(33, 'sors'), Am = at(33, 'amis');
    const pals = [0, 1, 2, 3, 4, 5].map(i => snPal(i, { x: 110 + i * 172 + Math.sin(t * 2) * 6, y: 1490, s: .85, expr: 'laugh', walk: 3, flip: i > 2 ? 1 : 0 }, t)).join('');
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 }, { z: 1, svg: pals }, { z: .6, svg: blur(10, dBush(80, 1900, 1.6)) }]) +
      kthin('puis un jour,', CX, 400, t, Jo - .2, { size: 58 }) + (t > Am ? kword('TES AMIS', CX, 530, t, Am - .05, { size: 104, fill: SX.acc2 }) + confetti(t, Am, 20) : ''); },
  sfx: [[0, 'whoosh', .4], [at(33, 'jour'), 'chirp', .4], [at(33, 'sors'), 'steps', .4], [at(33, 'amis') - .05, 'boom', .4], [at(33, 'amis'), 'tada', .4]] });

// B034 — « Vous mangez, » : resto, burgers, tout le monde croque en même temps
const snResto = (t, o = {}) => restoT(t, { diners: false }) + WASH('rgba(255,240,230,.1)') + [0, 1, 2, 3, 4, 5].map(i => snPal(i, Object.assign({ expr: 'happy' }, o.f ? o.f(i) : {}), t)).join('') +
  snTable(1225, t, { cloth: false }) + PALS.map((x, i) => snPlate(x, 1255, .7, ['burger', 'fries'][i % 2], t + i)).join('') + (o.over || '');
B(34, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ma = at(34, 'mangez'), ch = t > Ma && Math.sin(t * 18) > 0;
    return snResto(t, { f: i => ({ expr: ch ? 'starving' : 'happy', armR: [-80, -120], holdR: G(tr(0, -20, .5), ell(0, -30, 56, 30, '#e8a24a', 5) + rect(-60, -16, 120, 14, '#7be07b', 6, 4) + ell(0, 6, 56, 12, '#e8a24a', 5)) }) }) +
      kword('VOUS MANGEZ', CX, 450, t, Ma - .1, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(34, 'mangez') - .1, 'boom', .3], [at(34, 'mangez'), 'chomp', .6], [at(34, 'mangez') + .25, 'chomp', .5]] });

// B035 — « vous rigolez, » : fou rire général (Kevin a des frites dans le nez)
B(35, { enter: 'none', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const Ri = at(35, 'rigolez');
    return snResto(t, { f: i => ({ expr: 'laugh', rot: Math.sin(t * 14 + i) * 4, armL: [-150, -120] }), over: line(PALS[1] - 10, 1080, PALS[1] - 14, 1120, 9, '#ffd23f') + line(PALS[1] + 12, 1080, PALS[1] + 16, 1122, 9, '#ffd23f') }) +
      [0, 1, 2].map(i => op(seg(t, Ri + i * .1, Ri + i * .1 + .2), ftext(200 + i * 340, 760 - (i % 2) * 60, 'HA', { size: 70, fill: '#fff' }))).join('') + kword('VOUS RIGOLEZ', CX, 450, t, Ri - .1, { size: 100, fill: '#fff' }); },
  sfx: [[at(35, 'rigolez') - .1, 'boom', .3], [at(35, 'rigolez'), 'rimshot', .5], [at(35, 'rigolez') + .1, 'pop_hi', .4], [at(35, 'rigolez') + .3, 'pop_hi', .4]] });

// B036 — « Vous prenez cinquante vidéos. » : tout le monde filme, REC partout, compteur 1→50
B(36, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .4 }),
  draw: (t, d, T) => { const Pr = at(36, 'prenez'), Ci = at(36, 'cinquante'), Vi = at(36, 'videos');
    const rec = PALS.map((x, i) => t > Pr + i * .08 ? G(tr(x, 830, pop(t, Pr + i * .08, .3)), rect(-58, -22, 116, 44, '#fff', 22, 4) + op(Math.sin(t * 6 + i) > 0 ? 1 : .3, circ(-30, 0, 11, '#ff2b2b', 0)) + ftext(10, 10, 'REC', { size: 26, fill: OL, stroke: 'none' })) : '').join('');
    return snResto(t, { f: i => ({ expr: 'happy', look: [0, -.4], armR: [-70, -110], holdR: snPh(.36, 'glow') }) }) + rec +
      kthin('vous prenez', CX, 400, t, Pr - .1, { size: 56 }) + (t > Ci ? kword(counter(1, 50, t, Ci, .7) + ' VIDÉOS', CX, 530, t, Ci - .05, { size: 100, fill: SX.acc2 }) : ''); },
  sfx: [[at(36, 'prenez'), 'shutter', .5], [at(36, 'prenez') + .2, 'shutter', .4], [at(36, 'cinquante') - .05, 'boom', .4], [at(36, 'cinquante'), 'slot', .4], [at(36, 'videos'), 'shutter', .5]] });

// B037 — « Et le soir, tu regardes toutes les stories. » : chambre de nuit, au lit, stories qui défilent (barres en haut)
B(37, { enter: 'none', trans: 'black', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const So = at(37, 'soir'), St = at(37, 'stories');
    const n = Math.floor(seg(t, St - .5, d) * 4), bars = [0, 1, 2, 3, 4].map(i => rect(-190 + i * 78, -366, 70, 8, i < n ? '#fff' : 'rgba(255,255,255,.45)', 4, 0)).join('');
    const inner = clipR(-210, -380, 420, 760, G(tr(0, 120, .45), G(tr(-CX, -1100), snResto(t))), 0) + rect(-210, -380, 420, 200, 'rgba(0,0,0,.25)', 0, 0) + bars + ftext(0, -300, ['Lucas', 'Kevin', 'Inès', 'Noah', 'Jade'][n] || 'Jade', { size: 30, fill: '#fff', stroke: 'none' });
    return snRoom(t, '23:41') + WASH('rgba(10,10,40,.3)') + snBig(680, 880, .8, inner) + cutout(heroHead(210, 1040, 110, { expr: 'happy', look: [1, 0] }, t), 8) +
      funTag(CX, 400, 'LE SOIR', t, So - .1, { size: 54, bg: SNV, r: -4 }) + (t > St ? funTag(220, 1230, 'TOUTES LES STORIES', t, St - .05, { size: 30, bg: '#fff', fg: SX.ink, r: -3 }) : ''); },
  sfx: [[at(37, 'soir') - .1, 'pop', .5], [at(37, 'regardes'), 'whoosh', .3], [at(37, 'stories') - .05, 'pop_hi', .5], [at(37, 'stories') + .3, 'whoosh', .3]] });

// B038 — « Tu remarques un détail. » : gros plan, sourcil qui monte, loupe
B(38, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d) }),
  draw: (t, d, T) => { const Re = at(38, 'remarques'), De = at(38, 'detail');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: snRoom(t, '23:44'), haze: .2 }]) + op(.3, glow(CX, 950, 360, '#9fd0ff', .8)) + heroHead(CX, 950, 220, { expr: t > De ? 'suspicious' : 'neutral' }, t) +
      (t > De ? magnifier(780, 980, 1, -20) : '') + kthin('tu remarques', CX, 420, t, Re - .1, { size: 60 }) + kword('UN DÉTAIL', CX, 550, t, De - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[at(38, 'remarques'), 'hmm', .5], [at(38, 'detail') - .05, 'boom', .4], [at(38, 'detail'), 'glint', .5]] });

// B039 — « Sur presque chaque vidéo… » : la story en plein écran, on entoure les téléphones un par un
B(39, { enter: 'punch', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pr = at(39, 'presque'), Ch = at(39, 'chaque');
    const scene = snResto(t, { f: i => ({ expr: 'deadpan', look: [0, 1] }), over: PALS.map(x => snGlowPh(x + 30, 1180, t)).join('') });
    return scene + rect(-M, -M, W + 2 * M, 300 + M, 'rgba(0,0,0,.3)', 0, 0) + [0, 1, 2, 3, 4].map(i => rect(60 + i * 196, 120, 180, 10, i < 3 ? '#fff' : 'rgba(255,255,255,.45)', 5, 0)).join('') +
      PALS.map((x, i) => markerCircle(x + 30, 1170, 70, 60, t, Ch + i * .1, { col: '#e2463a', w: 10 })).join('') +
      kthin('sur presque', CX, 420, t, Pr - .1, { size: 60 }) + kword('CHAQUE VIDÉO…', CX, 550, t, Ch - .05, { size: 90, fill: '#fff' }); },
  sfx: [[at(39, 'presque'), 'hmm', .4], [at(39, 'chaque') - .05, 'boom', .3], [at(39, 'chaque'), 'scratch', .5], [at(39, 'video'), 'scratch', .4]] });

// B040 — « TOUT LE MONDE REGARDE SON TÉLÉPHONE. » : crash zoom, 6 têtes baissées, lueurs bleues, kword slam
B(40, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t < .4 ? 7 : 2 }),
  draw: (t, d, T) => { const To = at(40, 'tout'), Te = at(40, 'telephone');
    return snResto(t, { f: i => ({ expr: 'deadpan', look: [0, 1.4], headTilt: 6 }), over: PALS.map(x => snGlowPh(x + 30, 1180, t)).join('') }) + WASH('rgba(30,40,90,.35)') +
      op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#000', 0, 0)) + PALS.map(x => op(.5, glow(x + 20, 1100, 120, '#9fd0ff', .8))).join('') +
      kword('TOUT LE MONDE', CX, 420, t, To - .05, { size: 100, fill: '#fff' }) + kword('REGARDE SON TÉLÉPHONE', CX, 560, t, Te - .2, { size: 54, fill: SX.acc2 }) + snFlash(t, To, .5); },
  sfx: [[0, 'flash_hit', .5], [at(40, 'tout') - .05, 'boom', .6], [at(40, 'regarde'), 'sting', .5], [at(40, 'telephone') - .2, 'thud', .6], [at(40, 'telephone'), 'vibrate', .4]] });

// B041 — « Vous étiez six à la même table. » : les 6 numérotés un par un (1 à 6)
B(41, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Et = at(41, 'etiez'), Si = at(41, 'six'), Ta = at(41, 'table');
    return snResto(t, { f: i => ({ expr: 'deadpan', look: [0, 1.4] }), over: PALS.map(x => snGlowPh(x + 30, 1180, t)).join('') }) + WASH('rgba(30,40,90,.25)') +
      PALS.map((x, i) => funTag(x, 820, String(i + 1), t, Et + i * ((Si - Et + .2) / 6), { size: 44, bg: DPAL[i], r: (i % 2 ? 6 : -6) })).join('') +
      kword('VOUS ÉTIEZ SIX', CX, 430, t, Si - .1, { size: 92, fill: '#fff' }) + kthin('à la même table.', CX, 580, t, Ta - .2, { size: 56 }); },
  sfx: [[at(41, 'etiez'), 'pop_hi', .4], [at(41, 'etiez') + .15, 'pop_hi', .4], [at(41, 'six') - .1, 'boom', .4], [at(41, 'six'), 'pop_hi', .4], [at(41, 'table'), 'ding', .3]] });

// B042 — « Mais personne n'était vraiment là. » : les amis deviennent des silhouettes transparentes, seuls les écrans brillent
B(42, { enter: 'none', cam: (t, d) => ({ z: lerp(1.05, 1.1, t / d) }),
  draw: (t, d, T) => { const Pe = at(42, 'personne'), Vr = at(42, 'vraiment'), k = 1 - .8 * seg(t, Pe, Vr + .3);
    const bg = restoT(t, { diners: false }) + op(.55, rect(-M, -M, W + 2 * M, H + 2 * M, '#141838', 0, 0));
    const ppl = [0, 1, 2, 3, 4, 5].map(i => op(k, snPal(i, { expr: 'deadpan', look: [0, 1.4] }, t)) + (k < 1 ? op(.5 * (1 - k), G(tr(PALS[i], 1050), snGhost(0, 0, .9, 'rgba(200,220,255,.6)', { sad: 1 }))) : '')).join('');
    return bg + ppl + snTable(1225, t, { cloth: false }) + PALS.map(x => snGlowPh(x + 30, 1180, t)).join('') +
      kthin('mais personne', CX, 420, t, Pe - .1, { size: 64 }) + kword("N'ÉTAIT VRAIMENT LÀ.", CX, 560, t, Vr - .1, { size: 72, fill: SX.cool }); },
  sfx: [[at(42, 'mais'), 'wind', .4], [at(42, 'personne'), 'ghost', .5], [at(42, 'vraiment') - .1, 'sting', .5], [at(42, 'la'), 'heartbeat', .4]] });

// B043a — « TU AS PASSÉ TA JOURNÉE À PROUVER AUX AUTRES » : seul au lit, les stories du jour flottent autour avec leurs vues
const O43 = at(43, 'que') - .15;
B(43, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pa = at(43, 'passe'), Jo = at(43, 'journee'), Pr = at(43, 'prouver'), Au = at(43, 'autres');
    const cards = [[220, 760, -8, 'TROP BIEN !!'], [540, 690, 4, 'BEST DAY'], [860, 770, 8, 'LA TEAM ♥']].map(([x, y, r, lb], i) => t > Pr + i * .12 ? G(tr(x, y + Math.sin(t * 2 + i) * 10, pop(t, Pr + i * .12, .35), r),
      rect(-120, -170, 240, 340, '#22222b', 24, 6) + clipR(-110, -160, 220, 320, G(tr(0, 60, .3), G(tr(-CX, -1100), snResto(t))), 16) + rect(-100, -120, 200, 50, '#fff', 12, 4) + ftext(0, -84, lb, { size: 26, fill: SNV, stroke: 'none' }) +
      ftext(0, 140, 'vues : ' + counter(0, 12 + i * 9, t, Au, .6), { size: 26, fill: '#fff', stroke: 'none' })) : '').join('');
    return snRoom(t, '00:12') + WASH('rgba(10,10,40,.35)') + snBed(560, 1420, 1, heroHead(-250, -340, 95, { expr: 'sad', look: [1, -1] }, t), t) + cards +
      kthin('tu as passé ta journée', CX, 400, t, Pa - .1, { size: 54, out: Au + .1 }) + kword('À PROUVER AUX AUTRES', CX, 400, t, Au - .2, { size: 60, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .3], [at(43, 'journee'), 'pop_hi', .4], [at(43, 'prouver'), 'pop', .4], [at(43, 'prouver') + .12, 'pop', .4], [at(43, 'prouver') + .24, 'pop', .4], [at(43, 'autres') - .2, 'boom', .4]] });
// B043b — « …QUE TU PROFITAIS DE TA VIE… » : une story « ON PROFITE ♥ » géante… dedans, tout le monde est sur son téléphone
B(43, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: (t, d, T) => { const Pf = at(43, 'profitais') - O43, Vi = at(43, 'vie') - O43;
    const inner = clipR(-210, -380, 420, 760, G(tr(0, 130, .45), G(tr(-CX, -1100), snResto(t, { f: i => ({ expr: 'deadpan', look: [0, 1.4] }), over: PALS.map(x => snGlowPh(x + 30, 1180, t)).join('') }))), 0) +
      G(tr(0, -200, pop(t, Pf - .1, .35), -6), rect(-170, -50, 340, 100, '#fff', 20, 6) + ftext(0, 18, 'ON PROFITE ♥', { size: 40, fill: '#ff5c8a', stroke: 'none' }));
    return gridBg('#2a1f4a', 'rgba(255,255,255,.07)') + halftoneFade('#fff', .05, 1) + snBig(CX, 900, .82, inner) +
      kthin('que tu profitais', CX, 380, t, Pf - .2, { size: 54 }) + kword('DE TA VIE…', CX, 495, t, Pf + .3, { size: 80, fill: SX.acc2 }) + markerText('vraiment ?', 870, 1060, t, Vi - .2, { size: 44, r: 8 }); },
  sfx: [[0, 'whoosh', .3], [at(43, 'profitais') - O43 - .1, 'pop', .5], [at(43, 'profitais') - O43 + .1, 'sparkle', .3], [at(43, 'profitais') - O43 + .3, 'boom', .4], [at(43, 'vie') - O43 - .2, 'scratch', .5]] }, O43);

// B044 — FIN : « AU LIEU D'EN PROFITER. » : il pose le téléphone face contre la table de chevet, regarde la fenêtre ; débloqué (3/3)
//   dernier gag : le téléphone vibre (« Kevin t'a envoyé un snap »)… et il ne le regarde pas.
B(44, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Li = at(44, 'lieu'), Pf = at(44, 'profiter'), vib = t > Pf + .4 ? Math.sin(t * 70) * 5 : 0;
    return snRoom(t, '00:13') + WASH('rgba(255,220,160,.18)') + op(.35, glow(800, 440, 360, '#fff6c8', .7)) + unlock(CX, 1000, t, Pf, { part: 'back', r: 470 }) +
      heroP({ x: 420, y: 1460, s: 1.3, expr: t > Pf ? 'happy' : 'calm', look: [1, -1], noBags: t > Pf }, t) + snNight(820, 1400, 1.1, t, { phone: false }) +
      G(tr(830 + vib, 1160), rect(-80, -18, 160, 36, '#22222b', 10, 5)) + (t > Pf + .4 ? G(tr(820, 1060, pop(t, Pf + .4, .3)), rect(-150, -34, 300, 68, '#fff', 34, 5) + circ(-110, 0, 22, '#5fb85f', 4) + ftext(-80, 10, 'Kevin : snap', { size: 28, fill: OL, stroke: 'none', anchor: 'start' })) : '') +
      unlock(CX, 1000, t, Pf, { part: 'front', r: 470 }) +
      kword('AU LIEU', CX, 420, t, Li - .1, { size: 120, fill: '#fff' }) + kword("D'EN PROFITER.", CX, 570, t, Pf - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(44, 'lieu') - .1, 'boom', .5], [at(44, 'profiter') - .05, 'tada', .5], [at(44, 'profiter'), 'sparkle', .5], [at(44, 'profiter') + .4, 'vibrate', .5], [at(44, 'profiter') + .5, 'chirp', .3]] });

SCENES.sort((a, b) => a.s - b.s);
