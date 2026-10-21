// ============================================================
//  « Pourquoi c'est horrible d'être une fille ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Sujet sociétal sensible : on rit des clichés, des règles absurdes et des remarques des autres, JAMAIS de l'héroïne
//  ni des filles. Rien de sexualisé ; les règles = une mascotte goutte rouge avec sa valise (symbole pudique).
//  Fil rouge : le « rouleau de conditions » (la liste de choses à ne pas faire) qui revient de B003 à la fin.
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

// ---------- SIZEX fun : accent PASTÈQUE (rouge rosé), jaune marqueur, vert menthe ----------
sxFun('#ef476f'); SX.acc2 = '#ffd23f'; SX.cool = '#4cc9a0';

// ============================================================
//  L'HÉROÏNE : queue de cheval châtain qui se balance + chouchou jaune (toujours), t-shirt pastèque.
//  o.mk = maquillage (0 rien, 1 léger, 2 « trop » : fard bleu, grosses joues, paillettes) ; o.wet = trempée.
//  heroP = enfant/ado, heroA = adulte (à partir de « Les années passent »).
// ============================================================
const HERO_SHIRT = '#ef476f', HERO_HAIR = '#5a2e1a', HERO_SKIN = '#e8b48a', SCRUNCH = '#ffd23f';
function heroHair(r, t, o) {
  const [b, f] = hairSvg('ponytail', HERO_HAIR, r, t);
  const sw = o.wet ? 14 : Math.sin(t * 5) * 7;
  const back = G(`rotate(${f1(sw)} ${f1(r * .75)} ${f1(-r * .5)})`, b) + circ(r * .8, -r * .52, r * .15, SCRUNCH, 5) + circ(r * .8, -r * .52, r * .05, shade(SCRUNCH, -.3), 0);
  let fr = f; const mk = o.mk || 0;
  if (mk >= 1) for (const sd of [-1, 1]) fr += ell(sd * r * .55, r * .3, r * .17, r * .1, 'rgba(255,90,140,.45)', 0);
  if (mk >= 2) { for (const sd of [-1, 1]) fr += path(`M${f1(sd * r * .34 - r * .2)} ${f1(-r * .04)}Q${f1(sd * r * .34)} ${f1(-r * .3)} ${f1(sd * r * .34 + r * .2)} ${f1(-r * .04)}`, 'none', r * .12, '#4fb8ff') + circ(sd * r * .58, r * .32, r * .2, 'rgba(255,60,130,.55)', 0);
    fr += sparkle(-r * .7, -r * .3, r / 260, '#fff') + sparkle(r * .72, r * .05, r / 300, '#fff') + sparkle(-r * .2, r * .62, r / 340, '#fff6a0'); }
  if (o.wet) { fr += path(`M${f1(-r * .95)} ${f1(-r * .1)}q${f1(-r * .05)} ${f1(r * .3)} 0 ${f1(r * .5)}M${f1(r * .9)} ${f1(-r * .2)}q${f1(r * .06)} ${f1(r * .3)} 0 ${f1(r * .55)}`, 'none', r * .1, HERO_HAIR);
    for (let i = 0; i < 4; i++) { const k = (t * 1.6 + i / 4) % 1; fr += op(1 - k, sweat((i - 1.5) * r * .5, -r * .8 + k * r * 1.5, r / 300)); } }
  return [back, fr];
}
const heroP = (o, t) => person(Object.assign({ age: 'kid', hairFn: heroHair, shirt: HERO_SHIRT, pants: '#3b3f4a', skin: HERO_SKIN, seed: 2 }, o), t);
const heroA = (o, t) => heroP(Object.assign({ age: 'adult', pants: '#2f3b4e', shirt: HERO_SHIRT }, o), t);
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: heroHair, skin: HERO_SKIN, seed: 2 }, o), t));
// bébé héroïne : touffe + chouchou
const babyHair = (r, t) => ['', path(`M${f1(-r * .1)} ${f1(-r * .98)}C${f1(-r * .1)} ${f1(-r * 1.3)} ${f1(r * .3)} ${f1(-r * 1.3)} ${f1(r * .2)} ${f1(-r * 1.1)}`, 'none', 9, HERO_HAIR) + circ(r * .02, -r * 1.02, r * .12, SCRUNCH, 5)];
// le frère (casquette verte, même châtain), la mère (chignon), le collègue/« donneur de leçons »
const broP = (o, t) => person(Object.assign({ age: 'kid', hair: 'short', hairColor: HERO_HAIR, shirt: '#5b8fd8', skin: HERO_SKIN, pants: '#3b3f4a', seed: 5, cap: '#36a85a' }, o), t);
const momP = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#3a2216', shirt: '#9b6fd0', skin: HERO_SKIN, pants: '#4a3f5e', seed: 7, necklace: true }, o), t);
const profP = (o, t) => adult(0, Object.assign({ shirt: '#d9a066', hair: 'short', hairColor: '#6b6b6b', glasses: true, mustache: false }, o), t);
const guyP = (o, t) => adult(2, Object.assign({ shirt: '#7aa6d8', hair: 'short', hairColor: '#2b1a12', skin: '#f2c9a0', glasses: false, seed: 81 }, o), t);
const mateP = (o, t) => kid(3, Object.assign({ hair: 'curly', hairColor: '#1f1a18', shirt: '#ffb03a', skin: '#c98a5e' }, o), t);

// ---------- motion / accessoires propres à l'épisode ----------
// ondes de voix (arcs qui partent) : dir en degrés
function fWaves(x, y, t, col = SX.acc2, dir = 0, spread = 40, n = 3, Rr = 200, sw = 10) { let s = '';
  for (let i = 0; i < n; i++) { const k = (t * 1.3 + i / n) % 1, r = 30 + k * Rr, a0 = R(dir - spread), a1 = R(dir + spread);
    s += op(1 - k, path(`M${f1(x + Math.cos(a0) * r)} ${f1(y + Math.sin(a0) * r)}A${f1(r)} ${f1(r)} 0 0 1 ${f1(x + Math.cos(a1) * r)} ${f1(y + Math.sin(a1) * r)}`, 'none', sw, col)); }
  return s; }
// le ROULEAU de conditions : haut à (x, y), longueur len, lignes « • … » (texte réduit)
function fScroll(x, y, w, len, items, t, o = {}) { const sz = o.size || 26; let s = rect(-w / 2, 0, w, len, '#fff8e8', 4, 6);
  for (let i = 0; i < 60; i++) { const yy = 56 + i * sz * 1.7; if (yy > len - 20) break; s += i % 3 === 2 ? line(-w / 2 + 30, yy - sz * .3, w / 2 - 40 - (i * 37 % 60), yy - sz * .3, 6, '#d8c9a8') : ftext(0, yy, items[i % items.length], { size: sz, fill: '#6b4a2a', stroke: 'none' }); }
  s += rect(-w / 2 - 24, -22, w + 48, 44, '#e8cf98', 22, 6) + rect(-w / 2 - 24, len - 22, w + 48, 44, '#e8cf98', 22, 6);
  return G(tr(x, y, o.s || 1, o.r || 0), s); }
const LIST = ['pas trop fort', 'pas trop tard', 'souris !', 'sois douce', 'pas seule', "fais attention", 'pas trop court', 'envoie un message'];
// post-it
const fPostit = (x, y, str, s = 1, r = 0, c = '#fff27a') => G(tr(x, y, s, r), rect(-130, -100, 260, 200, c, 6, 6) + rect(-50, -112, 100, 30, 'rgba(255,255,255,.6)', 4, 0) + str.split('\n').map((l, i) => ftext(0, -20 + i * 50, l, { size: 36, fill: OL, stroke: 'none' })).join(''));
// la mascotte « LES RÈGLES » : goutte rouge toute mignonne, chapeau de voyage, valise « 5 JOURS »
function fDrop(x, y, s, t, o = {}) { const b = Math.abs(Math.sin(t * 7)) * 14;
  const g = G(tr(0, -b), path('M0 -170C40 -110 110 -40 110 30C110 100 60 140 0 140C-60 140 -110 100 -110 30C-110 -40 -40 -110 0 -170Z', '#e2463a', 7) + ell(-40, -10, 22, 30, 'rgba(255,255,255,.35)', 0) +
    circ(-34, 20, 12, OL, 0) + circ(34, 20, 12, OL, 0) + circ(-30, 16, 4, '#fff', 0) + circ(38, 16, 4, '#fff', 0) + path('M-26 60Q0 84 26 60', 'none', 7) + ell(-66, 52, 16, 9, '#ff9eb0', 0) + ell(66, 52, 16, 9, '#ff9eb0', 0) +
    path('M-70 -120Q0 -150 70 -120L60 -96Q0 -112 -60 -96Z', '#ffd23f', 6) + line(110, 40, 160 + Math.sin(t * 9) * 10, -30, 12) + circ(160 + Math.sin(t * 9) * 10, -30, 16, '#e2463a', 6));
  const bag = G(tr(-170, 80), rect(-80, -60, 160, 120, '#5b8fd8', 14, 6) + rect(-30, -84, 60, 26, 'none', 8, 6) + ftext(0, 14, '5 JOURS', { size: 28, fill: '#fff', stroke: 'none' }));
  return G(tr(x, y, s) + (o.flip ? ' scale(-1 1)' : ''), bag + g); }
// avion en papier
const fPlane = (x, y, s = 1, r = 0, c = '#fff8e8') => G(tr(x, y, s, r), path('M-120 0L120 -40L-40 40Z', c, 6) + path('M-40 40L120 -40L-20 10Z', shade(c, -.12), 6) + path('M-120 0L-20 10', 'none', 4));
// pluie (traits obliques) dans une zone
function fRain(x0, x1, y0, y1, t, n = 26, c = '#5aaee0') { let s = ''; for (let i = 0; i < n; i++) { const x = x0 + ((i * 97) % (x1 - x0)), k = (t * 1.8 + i * .37) % 1, y = y0 + k * (y1 - y0); s += line(x, y, x - 14, y + 46, 7, c); } return s; }
// curseur de réglage (motion) : track x0..x1 à y, k = position 0..1 ; o.hole = trou au milieu (B018)
function fSlider(x0, x1, y, k, t, o = {}) { const w = x1 - x0; let s = rect(x0 - 16, y - 70, w + 32, 140, '#fff', 30, 7);
  s += rect(x0 + 20, y - 14, w * .3, 28, '#9fd6ff', 14, 5) + rect(x0 + 20 + w * .62, y - 14, w * .3 - 40, 28, '#ff8fb1', 14, 5);
  if (!o.hole) s += rect(x0 + 20 + w * .32, y - 14, w * .28, 28, '#7be07b', 14, 5);
  else s += path(`M${x0 + w * .34} ${y - 30}L${x0 + w * .4} ${y + 6}L${x0 + w * .45} ${y - 20}L${x0 + w * .52} ${y + 20}L${x0 + w * .58} ${y - 26}L${x0 + w * .6} ${y + 40}L${x0 + w * .34} ${y + 40}Z`, '#1d1d26', 6);
  s += ftext(x0 + w * .17, y - 30, 'PAS ASSEZ', { size: 26, fill: '#3e7cc0', stroke: 'none' }) + ftext(x0 + w * .81, y - 30, 'TROP', { size: 26, fill: '#d9467a', stroke: 'none' }) + (o.hole ? '' : ftext(x0 + w * .46, y - 30, 'PARFAIT', { size: 26, fill: '#2f9a4a', stroke: 'none' }));
  const kx = x0 + 20 + k * (w - 40), ky = y + (o.fall || 0);
  s += G(tr(kx, ky, 1, (o.fall || 0) * .6), circ(0, 0, 40, SX.acc2, 7) + circ(-10, -12, 10, 'rgba(255,255,255,.7)', 0));
  return s; }
// panneau de note du jury
const fScore = (x, y, str, t, t0, c = '#fff') => { const k = pop(t, t0, .3); return k <= 0 ? '' : G(tr(x, y, k, Math.sin(t * 4 + x) * 3), line(0, 40, 0, 200, 10, '#8a5a3a') + rect(-70, -60, 140, 110, c, 12, 7) + ftext(0, 22, str, { size: 64, fill: OL, stroke: 'none' })); };

// ---------- DÉCORS propres au sujet ----------
// façade de la maison (porte bleue n°12) : o.open = porte ouverte, o.mat = paillasson BIENVENUE
function fHouse(t, o = {}) { const yb = 1250;
  let s = SKY(t, '#9fd6ff', '#fff1dc') + op(.6, dSkyline(820, '#c7d6e6', 8)) + dBirds(t, 3, 230);
  s += path(`M${-M} 380L${W + M} 380L${W + M} 300L${-M} 300Z`, '#c96a4a', 6) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => path(`M${-80 + i * 150} 300L${-10 + i * 150} 380`, 'none', 4, '#a8553a')).join('');
  s += rect(-M, 380, W + 2 * M, yb - 380, '#f3dcc0', 0, 0) + [0, 1, 2, 3, 4, 5].map(i => line(-M, 470 + i * 140, W + M, 470 + i * 140, 3, 'rgba(160,110,70,.18)')).join('');
  s += windowFrame(60, 480, 260, 300) + dCurtain(40, 470, 80, 320, '#ff8fb1', t, 1) + rect(40, 790, 300, 50, '#b5835a', 8, 6) + dFlowers(70, 800, 7, 4, t);
  s += windowFrame(60, 930, 200, 200, '#ffe9b0', '#fff6dc') + dPot(300, 1250, .7, t, 1);
  // porte
  const dx = 600, dw = 260, dt = 760;
  s += rect(dx - 24, dt - 30, dw + 48, yb - dt + 30, '#c99b6d', 8, 6);
  if (o.open) s += rect(dx, dt, dw, yb - dt, '#3a2a22', 4, 6) + op(.5, rect(dx + 20, dt + 30, dw - 40, 220, '#ffe6a8', 4, 0)) + G(tr(dx + dw, dt), path(`M0 0L70 30L70 ${yb - dt - 10}L0 ${yb - dt}Z`, '#3e7cc0', 6));
  else s += rect(dx, dt, dw, yb - dt, '#3e7cc0', 6, 6) + rect(dx + 40, dt + 40, dw - 80, 140, '#9fd6ff', 30, 5) + rect(dx + 40, dt + 230, dw - 80, 200, 'none', 8, 5) + circ(dx + dw - 40, dt + 260, 14, '#ffd23f', 5);
  s += rect(dx + dw / 2 - 40, dt - 90, 80, 50, '#fff', 8, 5) + ftext(dx + dw / 2, dt - 52, '12', { size: 34, fill: OL, stroke: 'none' });
  s += dLamp(dx - 70, dt + 120, .45, 1, t) + G(tr(960, 900), rect(-50, -40, 100, 80, '#e2463a', 14, 6) + rect(-30, -10, 60, 10, OL, 4, 0) + line(0, 40, 0, 350, 10, '#8a5a3a'));
  s += dPot(540, 1250, .8, t, 2, '#5b8fd8') + dPot(940, 1250, .8, t, 0);
  // sol : marche, allée, herbe
  s += rect(dx - 60, yb - 6, dw + 120, 40, '#d8d0c4', 6, 6) + rect(-M, yb + 34, W + 2 * M, 1400, '#7bc96f', 0, 0) + rect(dx - 20, yb + 34, dw + 40, 1400, '#e6dccd', 0, 5);
  for (let i = 0; i < 7; i++) s += ell(dx + dw / 2 + (i % 2 ? 50 : -50), yb + 120 + i * 110, 60, 22, '#cfc4b2', 4);
  s += dBush(120, yb + 120, 1.2) + dBush(1000, yb + 140, 1.3, '#4fa64f') + dBike(250, yb + 80, .7, '#ff5c8a');
  if (o.mat) s += G(tr(dx + dw / 2, yb + 70), rect(-200, -34, 400, 80, '#c58e55', 22, 6) + ftext(0, 22, 'BIENVENUE', { size: 40, fill: '#7a4a2a', stroke: 'none' }));
  return s; }
// salle de bain : carrelage, grand miroir à ampoules (o.refl = reflet), étagère, plante, serviette, lucarne
function fBath(t, o = {}) { const yb = 1250;
  let s = dWall('stripe', '#dff3ef', '#cfeae4', yb) + rect(-M, 780, W + 2 * M, yb - 780, '#ffffff', 0, 0);
  for (let y = 780; y < yb; y += 70) for (let x = -M; x < W + M; x += 70) s += rect(x, y, 70, 70, 'none', 0, 2, '#bfe0da');
  s += dWindowView(80, 170, 220, 180, t) + dShelf(60, 560, 300, dJar(100, 560, '#ff8fb1', .8) + dJar(160, 560, '#5ec4f0', .7) + rect(210, 490, 40, 70, '#ffd23f', 10, 4) + rect(270, 470, 30, 90, '#c58cff', 8, 4) + dPot(330, 560, .35, t, 1));
  s += G(tr(130, 700), circ(0, 0, 40, 'none', 7, '#b9b9c4') + rect(-50, 30, 100, 260, '#ff8fb1', 14, 6) + [0, 1, 2].map(i => line(-50, 80 + i * 70, 50, 80 + i * 70, 4, '#ff6fa0')).join(''));
  // miroir (x 520..980, y 330..1000)
  s += rect(500, 310, 500, 710, '#f1c27d', 30, 7) + grad('#e6f6ff', '#b9dcef', 525, 335, 450, 660).replace('<rect', '<rect rx="18"') + (o.refl || '') + op(.5, path('M560 380L640 380L560 520Z', '#fff', 0));
  for (let i = 0; i < 5; i++) { const on = Math.sin(t * 3 + i) > -.7; s += circ(560 + i * 95, 290, 22, on ? '#fff6b0' : '#e8e0c0', 5) + (on ? op(.3, circ(560 + i * 95, 290, 44, '#fff6b0', 0)) : ''); }
  s += rect(480, 1080, 540, 60, '#fff', 14, 7) + rect(500, 1140, 500, 140, '#cfe7f0', 6, 6) + ell(750, 1100, 150, 26, '#d8eef6', 5) + line(750, 1060, 750, 1020, 10, '#aab') + rect(820, 1040, 34, 50, '#ff8fb1', 8, 4) + rect(870, 1030, 26, 60, '#7be07b', 8, 4);
  s += dPot(1020, 1250, .9, t, 0) + dTileFloor(yb, '#cfe7f0', '#b8dbe8');
  return s; }
// plateau TV « MAQUILLAGE SHOW » : spots, écran, ampoules, caméra, public au premier plan (sous 1250)
function fStudio(t) { const yb = 1250;
  let s = grad('#3a2a7a', '#130c30', -M, -M, W + 2 * M, H + 2 * M) + dWall('dot', 'rgba(0,0,0,0)', 'rgba(255,255,255,.07)', yb);
  for (let i = 0; i < 4; i++) { const x = 120 + i * 280, a = Math.sin(t * 1.2 + i) * 60; s += op(.13, path(`M${x} -40L${x + a - 200} ${yb}L${x + a + 200} ${yb}Z`, ['#fff6b0', '#ff8fb1', '#9fd6ff', '#fff6b0'][i], 0)) + G(tr(x, -10), rect(-40, -20, 80, 60, '#2b2b33', 10, 6)); }
  s += rect(210, 120, 660, 200, '#1d1440', 16, 7) + dNeon(540, 210, 'MAQUILLAGE', '#ff8fb1', t, 54) + ftext(540, 280, 'LE JEU', { size: 34, fill: '#ffd23f', stroke: 'none' });
  for (let i = 0; i < 14; i++) { const on = Math.sin(t * 8 + i * 1.3) > 0; s += circ(220 + i * 49, 108, 10, on ? '#fff6b0' : '#7a6a40', 4) + circ(220 + i * 49, 332, 10, on ? '#7a6a40' : '#fff6b0', 4); }
  s += rect(-M, yb, W + 2 * M, 1400, '#2a1f5a', 0, 0) + rect(-M, yb, W + 2 * M, 18, '#ffd23f', 0, 0) + op(.25, rect(-M, yb + 40, W + 2 * M, 6, '#fff', 0, 0));
  s += G(tr(70, yb), line(0, 0, -40, -260, 8) + line(0, 0, 40, -260, 8) + rect(-70, -360, 140, 100, '#2b2b33', 14, 6) + circ(70, -310, 30, '#555', 6) + circ(-40, -340, 6, '#e2463a', 0));
  for (let i = 0; i < 9; i++) { const x = -40 + i * 140, y = yb + 330 + (i % 2) * 30 + Math.abs(Math.sin(t * 6 + i)) * -14; s += circ(x, y, 70, '#0e0920', 0) + rect(x - 90, y + 40, 180, 300, '#0e0920', 60, 0); }
  return s; }
// jury de 3 (derrière un pupitre, à droite), notes brandies
function fJury(t, ex, scores, t0, x0 = 600) { let s = '';
  for (let i = 0; i < 3; i++) s += adult([1, 3, 4][i], { x: x0 + i * 170, y: 1330, s: .8, expr: ex[i], armR: [-80, -100], armL: [200, 160] }, t + i);
  s += rect(x0 - 110, 1130, 560, 220, '#ef476f', 14, 7) + ftext(x0 + 170, 1225, 'JURY', { size: 56, fill: '#fff' }) + [0, 1, 2].map(i => rect(x0 - 70 + i * 170, 1110, 80, 20, '#fff', 6, 4)).join('');
  for (let i = 0; i < 3; i++) s += fScore(x0 + i * 170 + 40, 690, scores[i], t, t0 + i * .1, scores[i] === '10' ? SX.acc2 : '#fff');
  return s; }
// open space : baie vitrée sur la ville, tableau blanc (o.board), plante, fontaine à eau, horloge, étagère, figurants
function fOffice(t, o = {}) { const yb = 1250;
  let s = dWall('stripe', '#eef2f7', '#e3e9f1', yb) + dWindowView(-60, 200, 440, 520, t) + dWindowView(420, 200, 300, 520, t);
  s += rect(760, 300, 300, 230, '#fff', 10, 7) + (o.board || (path('M790 500L860 460L920 480L990 380L1030 340', 'none', 8, '#36a85a') + ftext(910, 345, 'Q3', { size: 28, fill: OL, stroke: 'none' })));
  s += wallClock(900, 170, 46, t) + dShelf(760, 640, 300, dBooks(775, 640, 140, 3) + dMug(960, 640, .8, t, '#5b8fd8') + dTrophy(1020, 640, .5));
  s += op(.75, adult(1, { x: 300, y: 1060, s: .45, expr: 'talk', shirt: '#7aa6d8' }, t) + adult(4, { x: 470, y: 1060, s: .45, expr: 'laugh', flip: 1 }, t + 1));
  s += rect(-M, 1000, W + 2 * M, 30, '#c9d3dc', 0, 5) + dParquet(yb, '#d8b58a');
  s += G(tr(1010, 1250), rect(-50, -300, 100, 300, '#e9eef3', 12, 6) + rect(-40, -440, 80, 140, 'rgba(160,210,255,.8)', 20, 6) + rect(-20, -210, 40, 20, '#5b8fd8', 4, 4)) + dPot(80, 1250, 1.0, t, 0);
  return s; }
// bureau + portable vu de face (cache les jambes)
const fDesk = (x, yb, w = 640, screen = '') => G(tr(x, yb), rect(-w / 2, -20, w, 40, '#c58e55', 8, 7) + rect(-w / 2 + 20, 20, 40, 300, '#8a5a3a', 0, 5) + rect(w / 2 - 60, 20, 40, 300, '#8a5a3a', 0, 5) +
  G(tr(w * .22, -20), rect(-110, -150, 220, 140, '#3a3f4a', 12, 6) + rect(-98, -138, 196, 116, '#eef4ff', 6, 0) + screen + path('M-130 0L130 0L120 -14L-120 -14Z', '#9aa3ad', 5)));
// maternité : mur menthe, fenêtre, ballons, guirlande, berceau, nounours, cadeaux, moniteur
function fMater(t) { const yb = 1250;
  let s = dWall('dot', '#e4f6ef', '#cdeee0', yb) + dWindowView(60, 260, 320, 380, t) + dCurtain(40, 250, 90, 420, '#ffd23f', t, 1);
  s += dBalloon(860, 330, '#ef476f', t, 0) + dBalloon(960, 300, '#ffd23f', t, 1.3) + dBalloon(760, 360, '#5ec4f0', t, 2.1);
  s += path('M440 200Q640 280 840 200', 'none', 5) + [0, 1, 2, 3, 4, 5].map(i => path(`M${470 + i * 64} ${218 + Math.sin(i / 5 * 3.14) * 50}l26 50l26 -50Z`, DPAL[i], 4)).join('');
  s += dFrame(560, 470, 160, 130, 'heart', '#c38a52', -3) + G(tr(980, 760), rect(-70, -60, 140, 110, '#2b2b33', 10, 6) + path(`M-56 0L-30 0L-20 -30L-6 30L8 0L56 0`, 'none', 6, '#7be07b') + line(0, 50, 0, 490, 10, '#9aa3ad'));
  s += dParquet(yb, '#e8cfa8') + dTeddy(150, 1250, 1.1) + dGift(300, 1250, .9) + dGift(380, 1250, .7, '#ff8fb1', '#fff');
  return s; }
// berceau (devant le bébé) : barreaux
const fCrib = (x, yb, w = 560) => G(tr(x, yb), rect(-w / 2, -40, w, 40, '#f4e2c2', 10, 7) + Array.from({ length: 9 }, (_, i) => rect(-w / 2 + 20 + i * (w - 40) / 8 - 10, 0, 20, 220, '#f4e2c2', 6, 5)).join('') + rect(-w / 2 - 10, 210, w + 20, 40, '#e8cfa8', 10, 7));
// couloir + porte WC
const fWC = (x, yb) => G(tr(x, yb), rect(-130, -500, 260, 500, '#7aa6d8', 8, 7) + circ(90, -250, 14, '#ffd23f', 5) + rect(-70, -640, 140, 90, '#fff', 12, 6) + ftext(0, -580, 'WC', { size: 48, fill: '#3e7cc0', stroke: 'none' }));
// casier (couloir) qui tremble
const fLocker = (x, yb, c, sh = 0) => G(tr(x + sh, yb), rect(-70, -560, 140, 560, c, 6, 6) + [0, 1, 2].map(i => line(-40, -520 + i * 20, 40, -520 + i * 20, 5, shade(c, -.25))).join('') + rect(40, -300, 14, 60, '#9aa3ad', 4, 4));

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001 — SIGNATURE : grille encre, héroïne en cut-out, titre 3 lignes, « débloqué » en étoiles sur FILLE
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'fille');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.25, expr: t > K ? 'suspicious' : 'happy', armL: t > K ? [200, 250] : [110, 100] }, t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1040, 330, 330, t, K + .2, { label: 'fille.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'ÊTRE", CX, 415, t, .3, { size: 58 }) +
      kword('UNE FILLE ?', CX, 540, t, K - .05, { size: 84, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'fille') - .05, 'boom', .6], [at(1, 'fille'), 'sparkle', .5]] });

// B002 — « Tu as 12 ans, tu sors de chez toi. » : papier + gobo, la porte en cut-out, elle sort, sac au dos, étiquette 12 ANS
B(2, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => { const Sr = at(2, 'sors'), k = eOutCubic(seg(t, Sr - .1, Sr + .6));
    return paper(SX.paper) + gobo(T, .12) + burst(600, 1000, 260, t, .05, '#ffe1b8', 16) +
      cutout(G(tr(260, 1450), rect(-150, -470, 300, 470, '#c99b6d', 8, 7) + rect(-120, -440, 240, 440, '#3a2a22', 4, 6) + op(.5, rect(-100, -410, 200, 200, '#ffe6a8', 4, 0)) + path('M120 -440L190 -410L190 -20L120 0Z', '#3e7cc0', 6)), 10) +
      cutout(heroP({ x: lerp(300, 640, k), y: 1450, s: 1.25, expr: 'joy', walk: k > 0 && k < 1 ? 7 : 0, armL: [120, 90], armR: [40, 60], holdR: dBag(0, 60, .7, '#5ec4f0', 10) }, t), 10) +
      funTag(CX, 470, '12 ANS', t, at(2, '12') - .1, { size: 90, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 470, t, at(2, '12'), 6, 180) +
      (t > Sr ? markerArrow(380, 760, 820, 720, t, Sr, { bend: 50, col: SX.acc }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(2, '12') - .1, 'pop', .7], [at(2, '12'), 'sparkle', .4], [at(2, 'sors'), 'steps', .5], [at(2, 'toi'), 'scratch', .3]] });

// B003 — « Ta mère dit : fais attention à ta tenue, à l'heure, à tes affaires, » : maman déroule le ROULEAU de conditions
B(3, { enter: 'none', trans: 'push', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const At = at(3, 'attention'), L = lerp(80, 1150, eOutCubic(seg(t, At - .1, d)));
    const tags = [['TA TENUE', at(3, 'tenue'), SX.acc2, SX.ink], ["L'HEURE", at(3, 'heure'), SX.cool, SX.ink], ['TES AFFAIRES', at(3, 'affaires'), SX.acc, '#fff']];
    return paper('#fff1e6') + gobo(T, .1) + cutout(momP({ x: 200, y: 1460, s: 1.1, expr: t > At ? 'worried' : 'talk', armR: [-60, -40], armL: [200, 240] }, t), 10) +
      cutout(fScroll(450, 620, 230, L, LIST, t, { size: 24 }), 8) +
      tags.map(([s_, t0, bg, fg], i) => funTag(740, 660 + i * 120, s_, t, t0 - .08, { size: 44, bg, fg, r: [-5, 4, -3][i] }) + (t > t0 + .1 ? ftext(985, 676 + i * 120, '✓', { size: 56, fill: SX.cool }) : '')).join('') +
      funTag(CX, 400, 'MAMAN DIT :', t, at(3, 'mere') - .1, { size: 54, bg: '#9b6fd0', fg: '#fff' }) + kthin('fais attention à…', CX, 520, t, At - .05, { size: 50, fill: SX.ink }); },
  sfx: [[at(3, 'mere') - .1, 'pop', .6], [at(3, 'attention'), 'flutter', .5], [at(3, 'tenue') - .08, 'pop_hi', .5], [at(3, 'heure') - .08, 'pop_hi', .5], [at(3, 'affaires') - .08, 'pop_hi', .5], [at(3, 'affaires') + .3, 'tick', .4]] });

// B004 — « Et envoie-moi un message en arrivant. » : la rue, gros téléphone, notifications MAMAN qui s'empilent
B(4, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Ms = at(4, 'message'), Ar = at(4, 'arrivant'), n = counter(1, 12, t, Ms, .7);
    const notif = [0, 1, 2, 3].map(i => t > Ms + i * .12 ? rect(-58, -110 + i * 54, 116, 44, '#fff', 10, 3) + circ(-38, -88 + i * 54, 12, '#9b6fd0', 0) + rect(-20, -96 + i * 54, 64, 8, '#9aa3ad', 4, 0) + rect(-20, -82 + i * 54, 44, 8, '#c7cdd4', 4, 0) : '').join('');
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: heroP({ x: 280, y: 1490, s: 1.3, expr: t > Ar ? 'dizzy' : 'neutral', walk: 5, armR: [-30, -60], holdR: phone(0, -10, .35, 10), holdL: dBag(0, 50, .5, '#5ec4f0') }, t) },
      { z: .6, svg: blur(10, dBin(1000, 1850, 1.4, '#36a85a')) }]) +
      G(tr(760, 860, 1.9, 6 + Math.sin(t * 20) * (t > Ms ? 2 : 0)), phone(0, 0, 1, 0, notif) + (t > Ms ? G(tr(70, -140, 1 + .1 * Math.sin(t * 12)), circ(0, 0, 34, '#e2463a', 5) + ftext(0, 12, '' + n, { size: 32, fill: '#fff', stroke: 'none' })) : '')) +
      funTag(CX, 440, 'ENVOIE-MOI UN MESSAGE', t, at(4, 'envoie') - .1, { size: 46, bg: '#9b6fd0', fg: '#fff' }) + markerText('en arrivant !', 280, 640, t, Ar - .05, { size: 48 }); },
  sfx: [[0, 'whoosh', .4], [at(4, 'envoie') - .1, 'pop', .6], [at(4, 'message'), 'vibrate', .6], [at(4, 'message') + .25, 'ding', .4], [at(4, 'arrivant'), 'vibrate', .5]] });

// B005 — « Ton frère sort derrière toi. » : maison, porte ouverte, le frère sort en skate, cool, lunettes de soleil
B(5, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Fr = at(5, 'frere'), k = eOutCubic(seg(t, at(5, 'sort') - .1, d));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: fHouse(t, { open: 1 }), haze: .06 },
      { z: 1, svg: broP({ x: lerp(730, 760, k), y: 1490 - 20, s: 1.2, expr: 'cool', face: { eyes: 'chill' }, flip: 1, armR: [-30, -60] }, t) + G(tr(lerp(730, 760, k), 1500), rect(-130, -14, 260, 22, '#ff5c8a', 10, 5) + circ(-90, 16, 16, '#fff', 5) + circ(90, 16, 16, '#fff', 5)) +
        heroP({ x: 270, y: 1500, s: 1.3, expr: 'suspicious', look: [1, 0], holdL: dBag(0, 50, .5, '#5ec4f0') }, t) },
      { z: .6, svg: blur(10, dBush(60, 1920, 1.6)) }]) +
      funTag(CX, 440, 'TON FRÈRE', t, Fr - .1, { size: 64, bg: '#5b8fd8', fg: '#fff' }) + (t > at(5, 'derriere') ? markerArrow(400, 820, 640, 900, t, at(5, 'derriere'), { bend: -40, col: SX.acc2 }) : ''); },
  sfx: [[at(5, 'frere') - .1, 'pop', .6], [at(5, 'sort'), 'squeak', .4], [at(5, 'sort') + .1, 'whoosh', .4], [at(5, 'derriere'), 'scratch', .5]] });

// B006 — « Amuse-toi bien ! » : crash, maman au balcon de la porte envoie des cœurs, le frère file en skate
B(6, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, eOutCubic(clamp(t / .3))), shake: t < .2 ? 5 : 0 }),
  draw: (t, d, T) => { const Am = at(6, 'amuse');
    return fHouse(t, { open: 1 }) + WASH() + momP({ x: 730, y: 1490, s: 1.05, expr: 'ecstatic', armR: [-50 + Math.sin(t * 16) * 20, -80], armL: [200, 240] }, t) + heartsUp(t, 700, 900, 5) +
      broP({ x: 300 + t * 300, y: 1470, s: 1.2, expr: 'cool', face: { eyes: 'chill' } }, t) + G(tr(300 + t * 300, 1480), rect(-130, -14, 260, 22, '#ff5c8a', 10, 5)) + speedLines(t, 300, 1000, 16) +
      kword('AMUSE-TOI BIEN !', CX, 520, t, Am - .05, { size: 80, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(6, 'amuse') - .05, 'boom', .5], [at(6, 'amuse'), 'kiss', .5], [at(6, 'bien'), 'whoosh', .5]] });

// B007a — « Les conditions générales d'utilisation » : devant la maison, le rouleau de l'héroïne déroule jusqu'au sol,
//          le frère, lui, a un post-it « AMUSE-TOI BIEN ♥ »
const O7 = at(7, 'ne') - .15;
B(7, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Cd = at(7, 'conditions'), Ut = at(7, 'utilisation'), L = lerp(60, 1300, eOutCubic(seg(t, Cd, Cd + 1.4)));
    return fHouse(t) + WASH() + heroP({ x: 230, y: 1500, s: 1.25, expr: t > Ut ? 'jawdrop' : 'confused', armR: [-50, -30], look: [1, -1] }, t) + fScroll(560, 640, 260, L, LIST, t, { size: 24 }) +
      broP({ x: 880, y: 1500, s: 1.2, expr: 'cool', face: { eyes: 'chill' }, flip: 1, armL: [-120, -100] }, t) + fPostit(880, 760, 'AMUSE-TOI\nBIEN ♥', .8, 6) +
      kthin('les conditions générales', CX, 410, t, Cd - .1, { size: 54 }) + kword("D'UTILISATION", CX, 540, t, Ut - .05, { size: 68, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(7, 'conditions'), 'flutter', .6], [at(7, 'generales'), 'printer', .4], [at(7, 'utilisation') - .05, 'boom', .5]] });
// B007b — « …ne sont pas les mêmes. » : (concept) deux fichiers : FILLE.pdf 847 pages vs GARÇON.txt 1 ligne, tampon
B(7, { enter: 'none', trans: 'glitch', transD: .2, cam: () => ({ z: 1.05, hand: .2 }),
  draw: (t, d, T) => { const Mm = at(7, 'memes') - O7;
    const doc = (title, pages, col, big) => rect(-190, -230, 380, 460, '#fff', 14, 0) + rect(-190, -230, 380, 70, col, 14, 0) + ftext(0, -180, title, { size: 36, fill: '#fff', stroke: 'none' }) +
      (big ? Array.from({ length: 9 }, (_, i) => rect(-150, -130 + i * 34, 300 - (i * 47 % 90), 14, '#c7cdd4', 6, 0)).join('') : rect(-150, -120, 220, 14, '#c7cdd4', 6, 0)) + ftext(0, 200, pages, { size: 36, fill: col, stroke: 'none' });
    return gridBg(SX.ink) + halftoneFade('#fff', .05, 1) + card(290, 940, 400, 480, doc('FILLE.pdf', '847 pages', SX.acc, 1), t, 0, { ry: 0, thick: 12, r: -5, bw: 6 }) +
      card(800, 940, 400, 480, doc('GARÇON.txt', '1 ligne', '#5b8fd8', 0), t, .15, { ry: 0, thick: 12, r: 5, bw: 6 }) +
      kword('≠', CX, 960, t, .3, { size: 160, fill: SX.acc2 }) + kthin('ne sont pas', CX, 430, t, .05, { size: 56 }) + stamp(CX, 590, 'LES MÊMES', t, Mm - .05, SX.acc, -6, 80); },
  sfx: [[0, 'zap', .4], [.05, 'pop', .5], [.2, 'pop', .5], [.3, 'boing', .4], [at(7, 'memes') - O7 - .05, 'thud', .7]] }, O7);

// B008 — « Bienvenue dans la vie d'une fille. » : paillasson BIENVENUE, débloqué en étoiles sur FILLE
B(8, { enter: 'none', trans: 'circle', transD: .25, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const Fl = at(8, 'fille');
    return fHouse(t, { mat: 1 }) + WASH() + unlock(CX, 1000, t, Fl, { part: 'back', r: 470 }) + heroP({ x: 730, y: 1450, s: 1.3, expr: t > Fl ? 'proud' : 'happy', armL: [200, 240], armR: [-20, -60] }, t) +
      unlock(CX, 1000, t, Fl, { part: 'front', r: 470 }) + kthin("bienvenue dans la vie d'une", CX, 410, t, at(8, 'bienvenue') - .1, { size: 50 }) + kword('FILLE', CX, 550, t, Fl - .05, { size: 130, fill: SX.acc2 }); },
  sfx: [[0, 'magic', .5], [at(8, 'bienvenue'), 'pop_hi', .4], [at(8, 'fille') - .05, 'tada', .6], [at(8, 'fille'), 'sparkle', .5]] });

// B009 — « À l'école, tu parles fort. » : classe, elle lève le bras et parle (ondes jaunes), FORT
B(9, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Ft = at(9, 'fort'), Pa = at(9, 'parles');
    const board = ftext(540, 620, 'DÉBAT', { size: 80, fill: 'rgba(255,255,255,.85)', stroke: 'none' });
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.3, svg: classroomT(t, board), haze: .06 },
      { z: 1, svg: kid(1, { x: 860, y: 1490, s: 1.05, expr: 'neutral', flip: 1 }, t) + kid(4, { x: 1020, y: 1490, s: 1.0, expr: 'happy', flip: 1 }, t + 1) +
        heroP({ x: 350, y: 1490, s: 1.3, expr: t > Pa ? 'laugh' : 'happy', armR: [-80, -100], armL: [160, 120] }, t) + (t > Pa ? fWaves(470, 1080, t, SX.acc2, 0, 40, 3, 260, 12) : '') },
      { z: .6, svg: blur(10, dBag(80, 1860, 1.4, '#ff8fb1', -10)) }]) +
      funTag(CX, 430, "À L'ÉCOLE", t, at(9, 'ecole') - .1, { size: 56, bg: SX.acc2, fg: SX.ink }) + kword('FORT !', 700, 760, t, Ft - .05, { size: 110, fill: '#fff', r: 6 }); },
  sfx: [[0, 'school_bell', .4], [at(9, 'ecole') - .1, 'pop', .5], [at(9, 'parles'), 'whoosh', .4], [at(9, 'fort') - .05, 'boom', .5]] });

// B010 — « Tu pourrais être un peu plus douce. » : la prof baisse son volume (curseur) ; ses ondes rétrécissent
B(10, { enter: 'none', trans: 'push', transD: .2, cam: camHand(1.05, .4),
  draw: (t, d, T) => { const Dc = at(10, 'douce'), vol = lerp(1, .15, eOutCubic(seg(t, at(10, 'pourrais'), Dc + .2)));
    return classroomT(t) + WASH() + heroP({ x: 300, y: 1500, s: 1.3, expr: t > Dc ? 'confused' : 'talk', armL: [200, 240] }, t) + op(vol, fWaves(420, 1100, t, SX.acc2, 0, 40, 3, 60 + 200 * vol, 10)) +
      profP({ x: 820, y: 1500, s: 1.15, expr: 'smug', flip: 1, armR: [-40, -70], armL: [200, 240] }, t) +
      G(tr(CX, 700), rect(-300, -50, 600, 100, '#fff', 30, 7) + ftext(-220, 18, '🔈', { size: 44, stroke: 'none' }) + rect(-160, -14, 400, 28, '#e6e0d6', 14, 5) + rect(-160, -14, 400 * vol, 28, SX.acc, 14, 5) + circ(-160 + 400 * vol, 0, 32, SX.acc2, 7)) +
      kthin('un peu plus…', CX, 420, t, at(10, 'peu') - .1, { size: 54 }) + kword('DOUCE', CX, 550, t, Dc - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[at(10, 'pourrais'), 'hmm', .4], [at(10, 'pourrais') + .1, 'squeak', .4], [at(10, 'douce') - .05, 'boom', .4], [at(10, 'douce') + .2, 'pop_hi', .4]] });

// B011 — « Kevin hurle dans le couloir. » : couloir, Kevin hurle, les casiers tremblent, feuilles qui volent
B(11, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(11, 'hurle') ? 9 : 0 }),
  draw: (t, d, T) => { const Hu = at(11, 'hurle'), sh = t > Hu ? Math.sin(t * 60) * 6 : 0;
    let papers = ''; if (t > Hu) for (let i = 0; i < 6; i++) { const k = ((t - Hu) * .9 + i / 6) % 1; papers += G(tr((i % 2 ? 300 : 780) + (i % 2 ? -1 : 1) * 400 * k, 760 - 300 * k + i * 30, 1, k * 400 + i * 50), rect(-40, -50, 80, 100, '#fff', 4, 4)); }
    return hallway(t) + WASH() + fLocker(80, 1250, '#5ec4f0', sh) + fLocker(230, 1250, '#ff8fb1', -sh) + fLocker(870, 1250, '#7be07b', sh) + fLocker(1020, 1250, '#ffd23f', -sh) +
      kevin({ x: CX, y: 1500, s: 1.4, expr: t > Hu ? 'rage' : 'smugger', face: t > Hu ? { mouth: 'scream' } : {}, armL: [200, 220], armR: [-20, -40] }, t) + (t > Hu ? fWaves(CX, 1050, t * 2, '#fff', -90, 70, 4, 420, 14) + speedLines(t, CX, 1000, 26) : '') + papers +
      funTag(CX, 420, 'KEVIN', t, at(11, 'kevin') - .05, { size: 60, bg: '#5fb85f', fg: '#fff' }) + kword('AAAAAH !', CX, 560, t, Hu, { size: 110, fill: SX.acc2, r: -4 }) + kthin('dans le couloir', CX, 680, t, at(11, 'couloir') - .1, { size: 46 }); },
  sfx: [[0, 'flash_hit', .4], [at(11, 'kevin') - .05, 'pop', .5], [at(11, 'hurle'), 'growl', .5], [at(11, 'hurle') + .05, 'boom', .6], [at(11, 'couloir'), 'thud', .4]] });

// B012 — « Quel caractère ! » : la prof, cœurs dans les yeux, applaudit ; Kevin bombe le torse
B(12, { enter: 'whip', cam: (t, d) => ({ z: 1.07, hand: .4, r: -3 }),
  draw: (t, d, T) => { const Qc = at(12, 'caractere');
    return hallway(t) + WASH() + fLocker(80, 1250, '#5ec4f0') + fLocker(1020, 1250, '#ffd23f') + profP({ x: 300, y: 1500, s: 1.2, expr: 'love', armL: [30, -20 + Math.sin(t * 20) * 25], armR: [150, 200 - Math.sin(t * 20) * 25] }, t) + heartsUp(t, 320, 900, 5) +
      kevin({ x: 790, y: 1500, s: 1.35, expr: 'proud', flip: 1, armL: [140, 60], armR: [40, 120] }, t) + sparkle(900, 820, .5 + .1 * Math.sin(t * 9)) +
      kword('QUEL CARACTÈRE !', CX, 520, t, Qc - .1, { size: 76, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(12, 'quel'), 'angel', .4], [at(12, 'caractere') - .1, 'boom', .4], [at(12, 'caractere') + .2, 'drum', .4]] });

// B013 — « Ce garçon ira loin. » : (concept) rayons, Kevin décolle en fusée, trophée en main
B(13, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.06, shake: 4 }),
  draw: (t, d, T) => { const Ir = at(13, 'ira'), up = eOutCubic(seg(t, Ir - .1, d + .3)) * 150;
    return rays(t, CX, 950, '#7be07b', '#5fb85f', 22) + G(tr(CX + 20, 1430 - up), op(.9, cloud(0, 120, 1.4, '#fff', 6)) + path('M-60 0L-90 120L-30 70L0 160L30 70L90 120L60 0Z', '#ffb03a', 6) + rect(-60, -260, 120, 260, '#e2463a', 40, 7) + circ(0, -170, 30, '#9fd6ff', 6)) +
      kevin({ x: CX, y: 1250 - up, s: 1.1, expr: 'ecstatic', armR: [-80, -100], holdR: dTrophy(0, 0, 1.1), armL: [200, 230] }, t) + speedLines(t, CX, 900, 22) +
      kthin('ce garçon', CX, 420, t, at(13, 'garcon') - .1, { size: 60, fill: SX.ink }) + kword('IRA LOIN', CX, 550, t, Ir - .05, { size: 120, fill: '#fff' }); },
  sfx: [[0, 'flash_hit', .4], [at(13, 'garcon'), 'pop_hi', .4], [at(13, 'ira') - .05, 'whoosh_up', .7], [at(13, 'loin'), 'tada', .5]] });

// B014 — « Tu te prépares pour une photo. » : salle de bain, miroir à ampoules (reflet), selfie, flash
B(14, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ph = at(14, 'photo'), fl = 1 - seg(t, Ph, Ph + .25);
    return fBath(t, { refl: clipR(525, 335, 450, 660, heroHead(750, 760, 150, { expr: 'happy', look: [-1, 0] }, t), 18) }) + heroP({ x: 300, y: 1500, s: 1.3, expr: t > Ph ? 'smug' : 'happy', look: [1, 0], armR: [-20, -50], holdR: phone(0, -20, .4, -10) }, t) +
      (t > Ph && fl > 0 ? op(fl * .8, rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0)) : '') + funTag(CX, 430, 'PRÉPARATION…', t, at(14, 'prepares') - .1, { size: 54, bg: SX.cool, fg: SX.ink }) + funTag(380, 600, '📸 PHOTO', t, Ph - .05, { size: 50, bg: SX.acc2, fg: SX.ink, r: -6 }); },
  sfx: [[0, 'whoosh', .4], [at(14, 'prepares') - .1, 'pop', .5], [at(14, 'prepares') + .2, 'spray', .3], [at(14, 'photo'), 'shutter', .7], [at(14, 'photo') + .05, 'flash_hit', .3]] });

// B015 — « Pas assez maquillée, tu pourrais faire un effort. » : plateau TV, curseur à gauche, le jury note 2, 3, 1
B(15, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const As = at(15, 'assez'), Ef = at(15, 'effort');
    return fStudio(t) + heroP({ x: 250, y: 1490, s: 1.25, expr: t > Ef ? 'annoyed' : 'happy', mk: 0, armL: [200, 240] }, t) + fJury(t, ['suspicious', 'deadpan', 'mock'], ['2', '3', '1'], As) +
      fSlider(150, 930, 560, .1, t) + funTag(CX, 420, 'PAS ASSEZ', t, As - .1, { size: 64, bg: '#9fd6ff', fg: SX.ink }) + markerText('fais un effort…', 330, 760, t, Ef - .05, { size: 44 }); },
  sfx: [[0, 'flash_hit', .4], [at(15, 'assez') - .1, 'pop', .6], [at(15, 'assez'), 'pop_hi', .4], [at(15, 'assez') + .2, 'pop_hi', .4], [at(15, 'effort'), 'error_beep', .5]] });

// B016 — « Trop maquillée, tu cherches l'attention. » : le curseur file à droite, fard bleu + paillettes, le jury se moque
B(16, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .4 }),
  draw: (t, d, T) => { const Tr = at(16, 'trop'), k = eOutBack(seg(t, Tr - .1, Tr + .35)), At = at(16, 'attention');
    return fStudio(t) + heroP({ x: 250, y: 1490, s: 1.25, expr: t > At ? 'suspicious' : 'proud', mk: k > .5 ? 2 : 0, armL: [200, 240] }, t) + fJury(t, ['mock', 'shock', 'mock'], ['1', '0', '2'], Tr + .2) +
      fSlider(150, 930, 560, lerp(.1, .95, k), t) + funTag(CX, 420, 'TROP !', t, Tr - .05, { size: 74, bg: '#ff8fb1', fg: SX.ink }) + markerText("« tu cherches l'attention »", 330, 760, t, at(16, 'cherches') - .05, { size: 38 }); },
  sfx: [[at(16, 'trop') - .05, 'pop', .6], [at(16, 'trop'), 'whoosh', .5], [at(16, 'maquille'), 'sparkle', .5], [at(16, 'cherches'), 'scratch', .4], [at(16, 'attention'), 'rimshot', .4]] });

// B017 — « Magnifique. » : Kevin débarque, pas coiffé, pas lavé… le jury lui met 10/10
B(17, { enter: 'crash', flash: 1, cam: () => ({ z: 1.08, shake: 4 }),
  draw: (t, d, T) => { const Mg = at(17, 'magnifique');
    return fStudio(t) + heroP({ x: 160, y: 1490, s: 1.1, expr: 'jawdrop', mk: 0 }, t) + kevin({ x: 400, y: 1500, s: 1.2, expr: 'smugger', armR: [-30, -60], armL: [200, 240] }, t) + op(.6, steam(400, 980, t, 1)) + fJury(t, ['love', 'ecstatic', 'love'], ['10', '10', '10'], Mg - .15) +
      confetti(t, Mg, 26) + kword('MAGNIFIQUE.', CX, 500, t, Mg - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(17, 'magnifique') - .1, 'jackpot', .5], [at(17, 'magnifique') - .05, 'boom', .4], [.3, 'tada', .4]] });

// B018 — « Le bon réglage n'existe pas. » : (motion) gros curseur : la zone PARFAIT est un trou, le bouton tombe dedans
B(18, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ex = at(18, 'existe'), Rg = at(18, 'reglage'), mv = eInOut(seg(t, .1, Rg + .3)), fall = t > Ex ? Math.pow(t - Ex, 2) * 2400 : 0;
    return fStudio(t) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, '#0e0920', 0, 0)) + heroP({ x: 250, y: 1490, s: 1.2, expr: t > Ex ? 'deadpan' : 'confused', mk: 1, look: [1, -1] }, t) +
      fSlider(130, 950, 840, lerp(.05, .47, mv), t, { hole: 1, fall: Math.min(fall, 900) }) + (t > Ex ? funTag(560, 980, '404', t, Ex + .1, { size: 46, bg: '#fff', fg: SX.acc }) : '') +
      kthin('le bon', CX, 410, t, at(18, 'bon') - .1, { size: 56 }) + kword('RÉGLAGE', CX, 530, t, Rg - .05, { size: 100, fill: SX.acc2 }) + stamp(CX, 680, "N'EXISTE PAS", t, Ex - .05, SX.acc, -6, 60); },
  sfx: [[at(18, 'bon'), 'pop_hi', .4], [at(18, 'reglage'), 'squeak', .4], [at(18, 'existe') - .05, 'thud', .7], [at(18, 'existe') + .1, 'error_beep', .5], [at(18, 'pas'), 'whoosh', .3]] });

// B019 — « Puis arrivent les règles. » : salon, la mascotte goutte rouge arrive avec sa valise « 5 JOURS » (coucou !)
B(19, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ar = at(19, 'arrive'), Rg = at(19, 'regles'), k = eOutBack(seg(t, Ar - .1, Ar + .4));
    return salonF(t) + WASH() + heroP({ x: 280, y: 1500, s: 1.3, expr: t > Rg ? 'jawdrop' : 'neutral', look: [1, 0] }, t) + fDrop(lerp(1250, 800, k), 1250, 1.15, t) +
      (t > Rg ? chatBubble(780, 760, 300, 90, 'COUCOU !', t, Rg + .1, false, 44) : '') + kword('LES RÈGLES', CX, 500, t, Rg - .05, { size: 100, fill: SX.acc2 }) + funTag(CX, 380, 'PUIS ARRIVENT…', t, at(19, 'puis') - .1, { size: 46, bg: '#fff', fg: SX.ink }); },
  sfx: [[at(19, 'puis') - .1, 'pop_hi', .4], [at(19, 'arrive'), 'steps', .5], [at(19, 'regles') - .05, 'sting', .5], [at(19, 'regles') + .1, 'boing', .5]] });

// B020 — « Ton ventre te fait mal. » : nuage d'orage au-dessus d'elle, éclairs qui tombent sur le ventre, bouillotte
B(20, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, eOutCubic(clamp(t / .4))), shake: t > at(20, 'mal') ? 6 : 1 }),
  draw: (t, d, T) => { const Mal = at(20, 'mal'), Vt = at(20, 'ventre'), zap = Math.sin(t * 22) > 0;
    return salonF(t) + WASH('rgba(30,30,70,.25)') + heroP({ x: 360, y: 1500, s: 1.35, expr: t > Mal ? 'pain' : 'worried', armL: [60, 0], armR: [120, 180], tremble: 1 }, t) +
      G(tr(400, 640), cloud(0, 0, 1.6, '#5a5f73', 7) + (t > Vt && zap ? lightning(-40, 30, .55) : '') + (t > Mal && !zap ? lightning(60, 30, .7) : '')) + fDrop(860, 1300, .7, t) +
      G(tr(780, 1000), rect(-90, -70, 180, 140, '#ff6b6b', 50, 7) + rect(-24, -100, 48, 34, '#ff6b6b', 8, 6) + ftext(0, 20, '♥', { size: 50, fill: '#fff', stroke: 'none' })) +
      funTag(CX, 400, 'TON VENTRE', t, Vt - .1, { size: 56, bg: SX.acc2, fg: SX.ink }) + kword('AÏE !', 760, 760, t, Mal - .05, { size: 110, fill: '#fff', r: 8 }); },
  sfx: [[0, 'whoosh', .4], [at(20, 'ventre'), 'thunder', .5], [at(20, 'ventre') + .05, 'zap', .4], [at(20, 'mal') - .05, 'boom', .5], [at(20, 'mal'), 'zap', .5]] });

// B021 — « Tu vas aux toilettes. » : couloir, porte WC, elle file sur la pointe des pieds, trousse planquée
B(21, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const Wc = at(21, 'toilettes'), k = seg(t, 0, d);
    return hallway(t) + WASH() + fLocker(80, 1250, '#5ec4f0') + fLocker(230, 1250, '#ff8fb1') + fWC(820, 1250) +
      heroP({ x: lerp(300, 560, k), y: 1490 - Math.abs(Math.sin(t * 14)) * 14, s: 1.25, expr: 'embarrassed', look: [-1, 0], armL: [130, 190], holdL: G(tr(0, 0), rect(-40, -26, 80, 52, '#c58cff', 16, 5)) }, t) +
      funTag(CX, 450, 'AUX TOILETTES', t, Wc - .1, { size: 60, bg: '#7aa6d8', fg: '#fff' }) + markerArrow(500, 700, 760, 760, t, at(21, 'vas'), { bend: 40, col: SX.acc2 }); },
  sfx: [[0, 'tiptoe', .5], [at(21, 'vas'), 'scratch', .4], [at(21, 'toilettes') - .1, 'pop', .5], [.5, 'tiptoe', .4]] });

// B022 — « Et quelqu'un te dit : oh, ça va. » : un camarade appuyé au casier, main qui balaie, yeux au ciel
B(22, { enter: 'whip', cam: camHand(1.06, .5),
  draw: (t, d, T) => { const Oh = at(22, 'oh'), Qu = at(22, 'quelqu');
    return hallway(t) + WASH() + fLocker(980, 1250, '#7be07b') + fWC(140, 1250) + heroP({ x: 320, y: 1500, s: 1.3, expr: 'pain', armL: [60, 0], armR: [120, 180] }, t) +
      mateP({ x: 790, y: 1500, s: 1.3, expr: t > Oh ? 'mock' : 'neutral', flip: 1, rot: -4, armR: [-30 + Math.sin(t * 14) * 25, -60], armL: [220, 260] }, t) +
      funTag(790, 420, "QUELQU'UN", t, Qu - .1, { size: 50, bg: SX.acc2, fg: SX.ink, r: 4 }) + chatBubble(700, 640, 400, 110, 'OH, ÇA VA…', t, Oh - .1, false, 54); },
  sfx: [[at(22, 'quelqu') - .1, 'pop', .5], [at(22, 'dit'), 'hmm', .4], [at(22, 'oh') - .1, 'pop', .6], [at(22, 'va'), 'whoosh', .4]] });

// B023 — « C'est naturel. » : le camarade en mode documentaire nature : couronne de feuilles, papillons
B(23, { enter: 'crash', cam: () => ({ z: 1.08, hand: .3, r: 3 }),
  draw: (t, d, T) => { const Nt = at(23, 'naturel');
    const bfly = (x, y, ph) => G(tr(x + Math.sin(t * 3 + ph) * 40, y + Math.cos(t * 4 + ph) * 30), ell(-18, 0, 18, 26 * Math.abs(Math.sin(t * 14 + ph)) + 4, '#ffb03a', 4) + ell(18, 0, 18, 26 * Math.abs(Math.sin(t * 14 + ph)) + 4, '#ffb03a', 4) + line(0, -16, 0, 16, 6));
    return hallway(t) + WASH('rgba(160,230,150,.3)') + G(tr(CX, 1000), head({ hr: 220, hair: 'curly', hairColor: '#1f1a18', skin: '#c98a5e', expr: 'smug', seed: 23 }, t)) +
      G(tr(CX, 790), [-160, -80, 0, 80, 160].map((x, i) => G(tr(x, Math.abs(x) * .25, 1, x * .25), path('M0 0Q-34 -40 0 -80Q34 -40 0 0Z', ['#5fb85f', '#7be07b', '#4fa64f'][i % 3], 5))).join('')) +
      bfly(260, 760, 0) + bfly(820, 880, 2) + bfly(300, 1100, 4) + kword('NATUREL', CX, 470, t, Nt - .05, { size: 120, fill: '#7be07b' }) + kthin("c'est", CX, 340, t, 0, { size: 50 }); },
  sfx: [[0, 'whoosh', .4], [.05, 'chirp', .5], [at(23, 'naturel') - .05, 'magic', .6], [at(23, 'naturel') + .2, 'flutter', .4]] });

// B024 — « Oui, la pluie aussi. » : dehors, l'héroïne pointe le ciel, un nuage arrive au-dessus du camarade et pleut
B(24, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pl = at(24, 'pluie'), k = eOutCubic(seg(t, Pl - .3, Pl + .1));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2) + op(.3 * k, rect(-M, -M, W + 2 * M, H + 2 * M, '#5a6b8a', 0, 0)), haze: .06 },
      { z: 1, svg: heroP({ x: 300, y: 1490, s: 1.3, expr: 'smugger', armR: [-40, -60] }, t) + mateP({ x: 790, y: 1500, s: 1.3, expr: t > Pl ? 'confused' : 'mock', flip: 1, look: [0, -1] }, t) +
        G(tr(lerp(1300, 790, k), 720), cloud(0, 0, 1.7, '#7d8396', 7)) + (t > Pl ? fRain(620, 960, 700, 1450, t) : '') },
      { z: .6, svg: blur(10, dBush(1000, 1900, 1.6)) }]) +
      funTag(250, 440, 'OUI…', t, at(24, 'oui') - .1, { size: 56, bg: '#fff', fg: SX.ink, r: -6 }) + kword('LA PLUIE AUSSI.', CX, 560, t, Pl - .05, { size: 82, fill: SX.acc2 }); },
  sfx: [[at(24, 'oui') - .1, 'pop', .5], [at(24, 'pluie') - .3, 'whoosh', .4], [at(24, 'pluie'), 'thunder', .4], [at(24, 'aussi'), 'waves', .3]] });

// B025 — « Ça n'empêche pas d'être trempée. » : l'averse sur les deux ; elle, trempée, imperturbable, le camarade aussi
B(25, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: 1.07, shake: t < .3 ? 5 : 0 }),
  draw: (t, d, T) => { const Tp = at(25, 'trempe');
    return streetT(t, 1) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, '#4a5878', 0, 0)) + G(tr(CX, 560), cloud(-220, 0, 1.6, '#6d7386', 7) + cloud(200, 20, 1.7, '#6d7386', 7)) +
      heroP({ x: 300, y: 1490, s: 1.3, expr: 'deadpan', wet: 1, armL: [200, 260] }, t) + mateP({ x: 800, y: 1500, s: 1.3, expr: t > Tp ? 'jawdrop' : 'shock', flip: 1, face: { tears: 1 } }, t) +
      fRain(-40, 1120, 560, 1500, t, 60) + ell(300, 1500, 200, 30, 'rgba(90,174,224,.6)', 4) + ell(800, 1510, 200, 30, 'rgba(90,174,224,.6)', 4) +
      kthin("ça n'empêche pas d'être", CX, 410, t, at(25, 'empeche') - .15, { size: 50 }) + kword('TREMPÉE.', CX, 760, t, Tp - .05, { size: 110, fill: '#9fd6ff' }); },
  sfx: [[0, 'flash_hit', .4], [.05, 'waves', .5], [at(25, 'empeche'), 'pop_hi', .4], [at(25, 'trempe') - .05, 'boom', .5], [at(25, 'trempe') + .1, 'gulp', .4]] });

// B026 — « Les années passent. » : pages de calendrier qui s'envolent, l'héroïne grandit (12 → 25 ans)
B(26, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pa = at(26, 'passent'), g = eInOut(seg(t, .1, d - .1));
    let pages = ''; for (let i = 0; i < 6; i++) { const k = (t * 1.8 + i / 6) % 1; pages += op(1 - k, G(tr(700 + Math.cos(i * 2) * 340 * k, 820 - 420 * k, 1, k * 300 * (i % 2 ? 1 : -1)), rect(-60, -70, 120, 140, '#fff', 8, 5) + rect(-60, -70, 120, 34, SX.acc, 8, 0) + ftext(0, 40, '' + (12 + i * 3), { size: 50, fill: OL, stroke: 'none' }))); }
    return salonF(t, { clock: 30 }) + WASH() + op(1 - g, heroP({ x: 330, y: 1500, s: 1.3, expr: 'happy' }, t)) + op(g, heroA({ x: 330, y: 1500, s: 1.15, expr: 'proud' }, t)) + pages +
      kword((12 + Math.round(g * 13)) + ' ANS', 760, 1050, t, .1, { size: 90, fill: '#fff' }) + kword('LES ANNÉES PASSENT', CX, 480, t, Pa - .2, { size: 68, fill: SX.acc2 }); },
  sfx: [[0, 'rewind', .5], [.1, 'clock_fast', .5], [at(26, 'annees'), 'flutter', .5], [at(26, 'passent') - .2, 'boom', .4]] });

// B027 — « Tu veux être ambitieuse. » : open space, elle présente, la courbe monte en flèche, pose de super-héroïne
B(27, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4, cy: 900 }),
  draw: (t, d, T) => { const Am = at(27, 'ambitieuse'), k = eOutCubic(seg(t, .1, Am + .3));
    const board = path(`M790 500L${790 + 240 * k} ${500 - 170 * k}`, 'none', 10, '#36a85a') + ftext(910, 345, 'OBJECTIFS', { size: 26, fill: OL, stroke: 'none' });
    return fOffice(t, { board }) + G(tr(400, 1050), path(`M-80 -110Q-180 40 ${-200 + Math.sin(t * 8) * 30} 220L-40 160Z`, '#ffd23f', 6)) + heroA({ x: 400, y: 1500, s: 1.25, expr: 'proud', armR: [-40, -60], armL: [150, 100] }, t) +
      (t > Am ? markerArrow(560, 900, 900, 560, t, Am, { bend: 60, col: SX.acc }) + popStars(900, 450, t, Am, 6, 160) : '') +
      kthin('tu veux être', CX, 420, t, at(27, 'veux') - .1, { size: 54 }) + kword('AMBITIEUSE', CX, 550, t, Am - .05, { size: 104, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(27, 'veux'), 'pop_hi', .4], [.2, 'whoosh_up', .4], [at(27, 'ambitieuse') - .05, 'boom', .5], [at(27, 'ambitieuse') + .1, 'tada', .4]] });

// B028 — « On te trouve autoritaire. » : deux collègues chuchotent derrière leur main ; tampon AUTORITAIRE sur elle
B(28, { enter: 'none', trans: 'glitch', transD: .2, cam: camHand(1.05, .4),
  draw: (t, d, T) => { const Au = at(28, 'autoritaire');
    return fOffice(t) + WASH() + heroA({ x: 300, y: 1500, s: 1.2, expr: t > Au ? 'shock' : 'proud', armL: [200, 240] }, t) +
      guyP({ x: 720, y: 1500, s: 1.1, expr: 'suspicious', flip: 1, armR: [30, -60], look: [-1, 0] }, t) + adult(3, { x: 920, y: 1500, s: 1.1, expr: 'mock', flip: 1, armR: [30, -60], look: [-1, 0] }, t + 1) +
      (t > at(28, 'trouve') ? chatBubble(820, 720, 260, 80, 'pss pss…', t, at(28, 'trouve'), false, 36) : '') + stamp(330, 820, 'AUTORITAIRE', t, Au - .05, '#e2463a', -10, 64) + kthin('on te trouve…', CX, 430, t, at(28, 'on') - .1, { size: 56 }); },
  sfx: [[at(28, 'on') - .1, 'pop_hi', .4], [at(28, 'trouve'), 'hmm', .5], [at(28, 'autoritaire') - .05, 'thud', .8], [at(28, 'autoritaire') + .1, 'gasp', .4]] });

// B029 — « Tu veux rester tranquille. » : à son bureau, casque, tasse fumante, mode zen absolu (chill de ouf)
B(29, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.06, 1.02, t / d), hand: .2 }),
  draw: (t, d, T) => { const Tq = at(29, 'tranquille');
    return fOffice(t) + WASH('rgba(160,230,200,.22)') + heroA({ x: 420, y: 1460, s: 1.2, expr: 'zen', armL: [140, 60], armR: [40, 120] }, t) +
      G(tr(420, 1460 - 1.2 * 406), path('M-100 0Q0 -140 100 0', 'none', 14, OL) + rect(-120, -10, 40, 70, SX.cool, 14, 6) + rect(80, -10, 40, 70, SX.cool, 14, 6)) + fDesk(500, 1290, 760, '') + dMug(260, 1270, 1.1, t, '#ffd23f') +
      [0, 1, 2].map(i => { const k = (t * .6 + i / 3) % 1; return op(1 - k, ftext(620 + i * 60, 900 - k * 200, ['♪', 'z', '♫'][i], { size: 60, fill: SX.cool })); }).join('') +
      kthin('tu veux rester', CX, 420, t, at(29, 'rester') - .2, { size: 54 }) + kword('TRANQUILLE', CX, 550, t, Tq - .05, { size: 104, fill: SX.cool }); },
  sfx: [[0, 'whoosh', .3], [at(29, 'rester') - .2, 'pop_hi', .4], [at(29, 'tranquille') - .05, 'magic', .5], [.3, 'ding', .2]] });

// B030 — « On te demande pourquoi tu ne souris pas. » : le collègue surgit avec un sourire en carton sur un bâton
B(30, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.07, eOutCubic(clamp(t / .3))), hand: .3 }),
  draw: (t, d, T) => { const Sr = at(30, 'souris'), k = eOutBack(seg(t, 0, .35));
    const smile = G(tr(0, -200), line(0, 0, 0, 200, 10, '#8a5a3a') + ell(0, -40, 110, 70, '#fff', 7) + path('M-70 -60Q0 20 70 -60', 'none', 12) + ell(-80, -50, 18, 10, '#ff9eb0', 0) + ell(80, -50, 18, 10, '#ff9eb0', 0));
    return fOffice(t) + WASH() + heroA({ x: 300, y: 1460, s: 1.2, expr: 'deadpan' }, t) + fDesk(300, 1300, 560, '') +
      guyP({ x: lerp(1300, 820, k), y: 1500, s: 1.15, expr: 'laugh', flip: 1, armR: [-40, -20], holdR: t > Sr - .1 ? smile : '' }, t) +
      chatBubble(800, 600, 400, 100, 'SOURIS UN PEU !', t, at(30, 'demande'), false, 42) + kthin('pourquoi tu ne', 330, 420, t, at(30, 'pourquoi') - .1, { size: 48 }) +
      kword('SOURIS PAS ?', 330, 540, t, Sr - .05, { size: 76, fill: SX.acc2, r: -4 }); },
  sfx: [[0, 'whoosh', .5], [at(30, 'demande'), 'pop', .6], [at(30, 'pourquoi'), 'pop_hi', .4], [at(30, 'souris') - .05, 'boing', .6], [at(30, 'pas'), 'crickets', .4]] });

// B031 — « Évidemment, toutes les filles ne vivent pas les mêmes choses. » : rue, 5 femmes différentes, chacune son histoire
B(31, { enter: 'none', trans: 'up', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Fl = at(31, 'filles'), Mm = at(31, 'memes');
    const W5 = [['long', '#1f1a18', '#8a5a3a', '#7be07b'], ['curly', '#2b1a12', '#c98a5e', '#ffd23f'], [null, 0, 0, 0], ['bun', '#d9d9de', '#f2c9a0', '#9b6fd0'], ['short', '#c4521b', '#f6d7b8', '#5ec4f0']];
    const icons = ['⚽', '🎸', '📚', '🧪', '🎨'];
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2), haze: .1 },
      { z: 1, svg: W5.map(([h, hc, sk, sh], i) => i === 2 ? heroA({ x: 540, y: 1500, s: 1.0, expr: 'happy' }, t) : person({ age: 'adult', x: 120 + i * 210, y: 1500 + (i % 2) * 15, s: .95, hair: h, hairColor: hc, skin: sk, shirt: sh, pants: '#3b3f4a', expr: ['joy', 'cool', '', 'proud', 'laugh'][i], seed: 90 + i }, t + i)).join('') }]) +
      icons.map((ic, i) => G(tr(120 + i * 210, 830 + (i % 2) * 15, eOutBack(seg(t, Fl + i * .12, Fl + i * .12 + .3))), circ(0, 0, 54, ['#7be07b', '#ffd23f', '#ff8fb1', '#9b6fd0', '#5ec4f0'][i], 6) + ftext(0, 20, ic, { size: 54, stroke: 'none' }))).join('') +
      funTag(CX, 400, 'ÉVIDEMMENT', t, at(31, 'evidemment') - .1, { size: 50, bg: '#fff', fg: SX.ink }) + kthin('toutes ne vivent pas', CX, 520, t, Fl - .05, { size: 52 }) + kword('LES MÊMES CHOSES', CX, 640, t, Mm - .05, { size: 64, fill: SX.acc2 }); },
  sfx: [[at(31, 'evidemment') - .1, 'pop', .5], [at(31, 'filles'), 'pop_hi', .4], [at(31, 'filles') + .24, 'pop_hi', .4], [at(31, 'filles') + .48, 'pop_hi', .4], [at(31, 'memes') - .05, 'ding', .5]] });

// B032 — « Et personne n'a exactement le même parcours. » : (concept) papier, 4 chemins au marqueur, chacun vers son étoile
B(32, { enter: 'none', trans: 'circle', transD: .22, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const Pc = at(32, 'parcours'), Ex = at(32, 'exactement');
    const P = [['M150 1250C150 1050 400 1050 300 850S150 700 220 760', SX.acc], ['M420 1250C500 1000 300 1000 460 900S700 800 520 760', SX.cool], ['M660 1250C560 1100 900 1050 760 900S600 780 760 760', '#9b6fd0'], ['M930 1250C1000 1000 800 950 950 880S1000 800 960 760', '#ffb03a']];
    return paper('#fff1e6') + gobo(T, .08) + G(tr(0, -110), P.map(([d_, c], i) => markerPath(d_, t, .1 + i * .15, { col: c, d: 1.2 }) + (t > 1 + i * .15 ? G(tr([220, 520, 760, 960][i], 720, eOutBack(seg(t, 1 + i * .15, 1.3 + i * .15))), path('M0 -50L14 -16L50 -14L22 8L32 46L0 24L-32 46L-22 8L-50 -14L-14 -16Z', c, 6)) : '')).join('') +
      [0, 1, 2, 3].map(i => cutout(i === 1 ? heroHead(420, 1300, 70, { expr: 'happy' }, t) : G(tr([150, 0, 660, 930][i], 1300), head({ hr: 70, hair: ['long', '', 'curly', 'bun'][i], hairColor: ['#1f1a18', '', '#2b1a12', '#c4521b'][i], skin: SK[i + 1], expr: 'happy', seed: 40 + i }, t)), 6)).join('')) +
      kthin("personne n'a exactement", CX, 410, t, Ex - .3, { size: 52 }) + kword('LE MÊME PARCOURS', CX, 540, t, Pc - .1, { size: 62, fill: SX.ink }); },
  sfx: [[0, 'scratch', .4], [.3, 'scratch', .4], [at(32, 'exactement'), 'pop_hi', .4], [at(32, 'parcours') - .1, 'boom', .4], [1.1, 'sparkle', .4]] });

// B033a — « Mais certains commentaires semblent… » : maternité, bébé héroïne, les bulles de commentaires entrent par la fenêtre
const O33 = at(33, 'livrer') - .15;
B(33, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Cm = at(33, 'commentaires');
    const C = ['souris !', 'plus douce', 'fais un effort', 'pas trop fort', 'sois sage'];
    return fMater(t) + person({ age: 'baby', x: 560, y: 1160, s: 1.2, hairFn: babyHair, skin: HERO_SKIN, expr: t > Cm + .3 ? 'confused' : 'joy', shirt: '#ffe1b8' }, t) + fCrib(560, 1180) +
      C.map((c, i) => { const t0 = Cm - .1 + i * .15, k = eOutCubic(seg(t, t0, t0 + .5)); return t > t0 ? G(tr(lerp(220, [250, 820, 300, 780, 560][i], k), lerp(450, [560, 600, 760, 820, 470][i], k), .9), chatBubble(0, 0, c.length * 22 + 60, 74, c, t, t0, false, 34)) : ''; }).join('') +
      funTag(CX, 380, 'CERTAINS COMMENTAIRES', t, Cm - .1, { size: 44, bg: SX.acc, fg: '#fff' }); },
  sfx: [[0, 'baby_coo', .5], [at(33, 'commentaires') - .1, 'pop', .5], [at(33, 'commentaires') + .05, 'pop_hi', .4], [at(33, 'commentaires') + .2, 'pop_hi', .4], [at(33, 'commentaires') + .35, 'pop_hi', .4]] });
// B033b — « …livrés gratuitement avec ton acte de naissance. » : le livreur apporte le colis « COMMENTAIRES — OFFERTS »
B(33, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Gr = at(33, 'gratuitement') - O33, Ac = at(33, 'acte') - O33, k = eOutCubic(seg(t, 0, .5));
    const box = G(tr(0, 0), rect(-120, -100, 240, 160, '#d9a86c', 6, 6) + rect(-20, -100, 40, 160, '#ef476f', 0, 0) + ftext(0, 0, 'COMMENTAIRES', { size: 26, fill: OL, stroke: 'none' }));
    const cert = rect(-200, -140, 400, 280, '#fffaf0', 10, 0) + rect(-180, -120, 360, 240, 'none', 6, 4, '#c9a24a') + ftext(0, -70, 'ACTE DE NAISSANCE', { size: 30, fill: OL, stroke: 'none' }) + ftext(0, -10, 'FILLE  ✓', { size: 40, fill: SX.acc, stroke: 'none' }) +
      ftext(0, 60, '+ commentaires offerts', { size: 26, fill: '#7a6a50', stroke: 'none' }) + circ(140, 90, 34, '#e2463a', 4);
    return fMater(t) + person({ age: 'baby', x: 360, y: 1160, s: 1.15, hairFn: babyHair, skin: HERO_SKIN, expr: t > Gr ? 'shock' : 'confused', shirt: '#ffe1b8' }, t) + fCrib(360, 1180, 480) +
      adult(2, { x: lerp(1300, 820, k), y: 1500, s: 1.15, expr: 'happy', flip: 1, cap: '#ffb03a', shirt: '#8a5a3a', armR: [-10, 10], armL: [190, 170], holdR: G('translate(-60 0) scale(-1 1)', box) }, t) +
      card(380, 640, 430, 300, cert, t, Ac - .1, { ry: 0, thick: 10, r: -4, bw: 6 }) + stamp(800, 600, 'GRATUIT', t, Gr - .05, SX.acc, 8, 64) +
      funTag(CX, 400, 'LIVRÉS', t, .05, { size: 56, bg: '#ffb03a', fg: SX.ink }); },
  sfx: [[0, 'steps', .5], [.05, 'pop', .5], [at(33, 'gratuitement') - O33 - .05, 'kaching', .6], [at(33, 'acte') - O33 - .1, 'printer', .4], [at(33, 'naissance') - O33, 'ding', .5]] }, O33);

// B034a — « Un jour, ton petit frère te demande… » : salon le soir, elle rentre, le petit frère (grandi) la tire par la manche
const O34 = at(34, 'pourquoi') - .15;
B(34, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.02, 1.07, t / d), hand: .3 }),
  draw: (t, d, T) => { const Jr = at(34, 'jour'), Dm = at(34, 'demande');
    return salonF(t, { night: 1 }) + WASH('rgba(20,20,60,.12)') + heroA({ x: 330, y: 1500, s: 1.15, expr: 'happy', armL: [200, 230], holdL: dBag(0, 40, .5, '#ef476f') }, t) +
      broP({ x: 760, y: 1500, s: 1.1, expr: 'confused', flip: 1, armR: [-20, 0] }, t) + funTag(CX, 400, 'UN JOUR…', t, Jr - .1, { size: 56, bg: '#fff', fg: SX.ink }) +
      funTag(760, 560, 'PETIT FRÈRE', t, at(34, 'petit') - .1, { size: 44, bg: '#5b8fd8', fg: '#fff', r: 4 }) + (t > Dm ? chatBubble(760, 720, 220, 90, 'DIS…', t, Dm, false, 44) : ''); },
  sfx: [[0, 'whoosh', .4], [at(34, 'jour') - .1, 'pop', .5], [at(34, 'petit') - .1, 'pop_hi', .4], [at(34, 'demande'), 'hmm', .4]] });
// B034b — « …pourquoi tu rentres plus tôt que lui ? » : deux horloges TOI 22:00 / LUI 01:00
B(34, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, eOutCubic(clamp(t / .4))), hand: .3 }),
  draw: (t, d, T) => { const Rt = at(34, 'rentres') - O34, Tt = at(34, 'tot') - O34;
    return salonF(t, { night: 1 }) + WASH('rgba(20,20,60,.12)') + heroA({ x: 280, y: 1500, s: 1.15, expr: t > Tt ? 'worried' : 'neutral' }, t) + broP({ x: 800, y: 1500, s: 1.1, expr: 'confused', flip: 1 }, t) + qmark(900, 840, .5, SX.acc2, 10) +
      G(tr(290, 740, eOutBack(seg(t, Rt - .1, Rt + .2))), bigClockF(0, 0, '22:00', '#7be07b', .7) + funTag(0, -110, 'TOI', t, Rt, { size: 40, bg: SX.acc, fg: '#fff' })) +
      G(tr(790, 740, eOutBack(seg(t, Tt - .2, Tt + .1))), bigClockF(0, 0, '01:00', '#ff8a3d', .7) + funTag(0, -110, 'LUI', t, Tt - .1, { size: 40, bg: '#5b8fd8', fg: '#fff' })) +
      kword('PLUS TÔT ?', CX, 440, t, Tt - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[at(34, 'pourquoi') - O34, 'pop_hi', .4], [at(34, 'rentres') - O34 - .1, 'tick', .5], [at(34, 'tot') - O34 - .2, 'tick', .5], [at(34, 'tot') - O34 - .05, 'boom', .5], [at(34, 'que') - O34, 'clock_fast', .3]] }, O34);

// B035 — « Tu hésites. » : gros plan, goutte de sueur, barre de chargement
B(35, { enter: 'whip', cam: () => ({ z: 1.08, hand: .5, r: -3 }),
  draw: (t, d, T) => { const Hs = at(35, 'hesites');
    return salonF(t, { night: 1 }) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, '#141838', 0, 0)) + heroHead(CX, 980, 220, { expr: 'worried', face: { sweat: 1 }, look: [-1, 0] }, t) +
      G(tr(CX, 700), rect(-260, -30, 520, 60, '#fff', 30, 6) + rect(-250, -20, 500 * clamp(t / d) * .7, 40, SX.acc, 20, 0)) + funTag(CX, 450, 'TU HÉSITES…', t, Hs - .1, { size: 64, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[0, 'whoosh', .4], [at(35, 'hesites') - .1, 'pop', .5], [.1, 'heartbeat', .5]] });

// B036 — « Tu pourrais lui faire un cours entier. » : en classe, elle en prof (847 diapos), le petit frère enseveli sous les livres
B(36, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Co = at(36, 'cours'), Ent = at(36, 'entier');
    const board = ftext(540, 560, 'COURS N°1', { size: 60, fill: 'rgba(255,255,255,.85)', stroke: 'none' }) + ftext(540, 660, 'diapo 1 / 847', { size: 48, fill: 'rgba(255,255,255,.7)', stroke: 'none' });
    let books = ''; for (let i = 0; i < 8; i++) if (t > Co + i * .06) books += rect(870 + (i % 2) * 20, 1440 - i * 40, 190, 38, DPAL[i % 8], 6, 5);
    return classroomT(t, board) + heroA({ x: 260, y: 1500, s: 1.15, expr: 'proud', armR: [-40, -60], holdR: line(0, 0, 60, -160, 10, '#8a5a3a'), armL: [150, 100] }, t) +
      broP({ x: 700, y: 1420, s: .95, expr: t > Ent ? 'dizzy' : 'confused', flip: 1 }, t) + G(tr(780, 1440), rect(-200, -20, 420, 30, '#c58e55', 6, 6)) + books +
      kthin('tu pourrais lui faire', CX, 420, t, at(36, 'pourrais') - .1, { size: 50, fill: '#fff' }) + kword('UN COURS ENTIER', CX, 760, t, Co - .05, { size: 80, fill: SX.acc2 }); },
  sfx: [[0, 'school_bell', .3], [at(36, 'cours') - .05, 'boom', .5], [at(36, 'cours') + .1, 'thud', .4], [at(36, 'entier'), 'thud', .4], [at(36, 'entier') + .2, 'typing', .3]] });

// B037a — « Puis tu dis simplement, » : sur le canapé, elle s'assoit à sa hauteur, douce
const O37 = at(37, 'parce') - .15;
B(37, { enter: 'none', trans: 'black', transD: .25, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d) }),
  draw: (t, d, T) => { const Sp = at(37, 'simplement');
    return salonF(t, { night: 1, noSofa: 1 }) + WASH('rgba(255,220,180,.12)') + sofa(CX, 1400, 1.2, '#5ec4a0') + heroA({ x: 380, y: 1380, s: 1.05, expr: 'calm', armR: [10, -20] }, t) + broP({ x: 700, y: 1380, s: 1.0, expr: 'neutral', flip: 1 }, t) +
      heartsUp(t, 540, 1000, 3, 200) + kthin('tu dis simplement…', CX, 450, t, Sp - .2, { size: 60 }); },
  sfx: [[0, 'magic', .3], [at(37, 'simplement') - .2, 'pop_hi', .4], [.4, 'heartbeat', .3]] });
// B037b — « …parce qu'on ne nous apprend pas à avoir peur des mêmes choses. » : 2 bulles de pensée : lui = monstre du placard ; elle = la rue la nuit
B(37, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pr = at(37, 'peur') - O37, Mm = at(37, 'memes') - O37, Ap = at(37, 'apprend') - O37;
    const monster = rect(-170, -120, 340, 240, '#2e3a80', 10, 0) + rect(-150, -40, 300, 160, '#5a4030', 6, 4) + G(tr(0, 0 + Math.sin(t * 5) * 6), ell(0, 20, 90, 60, '#7be07b', 6) + circ(-30, 0, 16, '#fff', 4) + circ(30, 0, 16, '#fff', 4) + circ(-30, 0, 6, OL, 0) + circ(30, 0, 6, OL, 0) + path('M-30 40L-20 54L-10 40L0 54L10 40L20 54L30 40', 'none', 5));
    const street = rect(-170, -120, 340, 240, '#151a3a', 10, 0) + op(.4, path('M-40 -90L-120 120L60 120Z', '#fff6c8', 0)) + G(tr(-40, 120), rect(-6, -220, 12, 220, '#3a4250', 0, 0) + circ(0, -220, 16, '#fff6c8', 4)) + rect(-170, 90, 340, 30, '#2a2f4a', 0, 0) + ftext(90, -60, '22:47', { size: 30, fill: '#ffd23f', stroke: 'none' });
    return salonF(t, { night: 1 }) + op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#141838', 0, 0)) + heroA({ x: 280, y: 1500, s: 1.1, expr: 'calm' }, t) + broP({ x: 800, y: 1500, s: 1.0, expr: t > Pr ? 'wow' : 'neutral', flip: 1 }, t) +
      card(780, 800, 400, 280, clipR(-170, -120, 340, 240, monster, 10), t, Ap - .1, { ry: 0, thick: 10, r: 4, bw: 6 }) + card(300, 760, 400, 280, clipR(-170, -120, 340, 240, street, 10), t, Ap + .1, { ry: 0, thick: 10, r: -4, bw: 6 }) +
      kthin("on ne nous apprend pas à avoir", CX, 400, t, Ap - .3, { size: 44 }) + kword('PEUR', CX, 520, t, Pr - .05, { size: 110, fill: SX.acc2 }) + funTag(CX, 1060, 'DES MÊMES CHOSES', t, Mm - .1, { size: 46, bg: SX.acc, fg: '#fff' }); },
  sfx: [[at(37, 'parce') - O37, 'pop_hi', .4], [at(37, 'apprend') - O37 - .1, 'pop', .5], [at(37, 'apprend') - O37 + .1, 'pop', .5], [at(37, 'peur') - O37 - .05, 'boom', .5], [at(37, 'memes') - O37 - .1, 'ding', .4]] }, O37);

// B038a — « Et le plus absurde, » : (concept) rayons, ABSURDE
const O38 = at(38, 'on') - .15;
B(38, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 2 }),
  draw: (t, d, T) => rays(t, CX, 950, SX.acc, '#ff7d97', 22) + heroHead(CX, 990, 210, { expr: 'suspicious' }, t) +
    kthin('le plus', CX, 410, t, at(38, 'plus') - .1, { size: 60 }) + kword('ABSURDE', CX, 540, t, at(38, 'absurde') - .05, { size: 120, fill: SX.acc2 }),
  sfx: [[0, 'flash_hit', .4], [at(38, 'plus'), 'pop_hi', .4], [at(38, 'absurde') - .05, 'boom', .6]] });
// B038b — « …on te demande d'être libre » : rue, un monsieur au mégaphone « SOIS LIBRE ! », elle cape au vent
B(38, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Lb = at(38, 'libre') - O38;
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2) + dBirds(t * 1.5, 4, 420), haze: .06 },
      { z: 1, svg: G(tr(330, 1050), path(`M-80 -110Q-180 40 ${-220 + Math.sin(t * 8) * 30} 240L-40 160Z`, '#ffd23f', 6)) + heroA({ x: 330, y: 1500, s: 1.2, expr: t > Lb ? 'ecstatic' : 'happy', armL: [-150, -170], armR: [-30, -10] }, t) +
        guyP({ x: 820, y: 1500, s: 1.15, expr: 'talk', flip: 1, armR: [-20, -10], holdR: G(tr(0, 0, 1, 180), path('M0 -20L80 -50L80 50L0 20Z', '#e2463a', 6) + rect(-20, -20, 30, 40, '#e2463a', 4, 5)) }, t) + (t > Lb ? fWaves(700, 1020, t, '#fff', 180, 40, 3, 160) : '') },
      { z: .6, svg: blur(10, dFlowers(950, 1900, 5, 3, t)) }]) +
      chatBubble(760, 760, 340, 90, 'SOIS LIBRE !', t, .1, false, 46) + kthin('on te demande d\'être', CX, 410, t, at(38, 'demande') - O38 - .1, { size: 54 }) + kword('LIBRE', CX, 540, t, Lb - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [.1, 'pop', .5], [at(38, 'demande') - O38, 'pop_hi', .4], [at(38, 'libre') - O38 - .05, 'tada', .5], [at(38, 'libre') - O38 + .1, 'chirp', .4]] }, O38);

// B039a — « Tout en te donnant une liste… » : le monsieur lui tend LE rouleau, qui déroule jusqu'au sol (callback B003)
const O39 = at(39, 'choses') - .15;
B(39, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ls = at(39, 'liste'), Dn = at(39, 'donnant'), L = lerp(60, 1100, eOutCubic(seg(t, Dn, Ls + .4)));
    return streetT(t, 1) + WASH() + heroA({ x: 280, y: 1500, s: 1.15, expr: t > Ls ? 'jawdrop' : 'happy', armR: [-20, -10] }, t) + guyP({ x: 860, y: 1500, s: 1.1, expr: 'smug', flip: 1, armR: [-30, -10] }, t) +
      fScroll(580, 640, 260, L, LIST, t, { size: 24 }) + kthin('tout en te donnant', CX, 410, t, at(39, 'tout') - .1, { size: 52 }) + funTag(CX, 530, 'UNE LISTE', t, Ls - .05, { size: 70, bg: SX.acc2, fg: SX.ink }); },
  sfx: [[at(39, 'tout'), 'pop_hi', .4], [at(39, 'donnant'), 'flutter', .6], [at(39, 'liste') - .05, 'pop', .6], [at(39, 'liste') + .1, 'printer', .4]] });
// B039b — FIN : « …de choses à ne surtout pas faire. » : elle plie la liste en avion en papier et la fait s'envoler (étoiles)
B(39, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Fa = at(39, 'faire') - O39, Su = at(39, 'surtout') - O39, fly = seg(t, Fa, Fa + 1.2);
    const items = ['PAS TROP FORT', 'PAS SEULE', 'PAS SANS SOURIRE', 'PAS TROP TARD'];
    return streetT(t, 2) + WASH() + unlock(330, 900, t, Fa, { part: 'back', r: 420 }) +
      items.map((s_, i) => t < Fa ? funTag(i % 2 ? 760 : 380, 670 + i * 75, s_, t, .05 + i * .14, { size: 34, bg: '#fff8e8', fg: '#6b4a2a', r: i % 2 ? 4 : -4 }) + cross(i % 2 ? 760 : 380, 670 + i * 75, .3, t, Su + i * .06) : '').join('') +
      heroA({ x: 330, y: 1500, s: 1.15, expr: t > Fa ? 'smugger' : 'deadpan', armR: t > Fa ? [-60, -80] : [40, 60], armL: [200, 240] }, t) + guyP({ x: 880, y: 1500, s: 1.05, expr: t > Fa + .3 ? 'jawdrop' : 'smug', flip: 1, look: [0, -1] }, t) +
      (t > Fa ? fPlane(lerp(460, 1100, fly), lerp(980, 360, fly) - Math.sin(fly * 3.14) * 120, 1.2, -20) + motionLines(lerp(380, 1000, fly), lerp(1000, 400, fly), 3, 60, 160) : '') +
      unlock(330, 900, t, Fa, { part: 'front', r: 420 }) + kthin('de choses à ne surtout pas', CX, 410, t, .05, { size: 48 }) + kword('FAIRE.', CX, 560, t, Fa - .05, { size: 140, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [.05, 'pop_hi', .3], [.33, 'pop_hi', .3], [at(39, 'surtout') - O39, 'error_beep', .4], [at(39, 'faire') - O39 - .05, 'boom', .6], [at(39, 'faire') - O39 + .05, 'whoosh_up', .6], [at(39, 'faire') - O39 + .3, 'sparkle', .5]] }, O39);

SCENES.sort((a, b) => a.s - b.s);
