// ============================================================
//  « Pourquoi c'est horrible d'être toujours comparé à son frère ou sa sœur ? » — format SIZEX fun — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Héros fixe (cheveux bouclés châtains, t-shirt orange avec un « 2 » éternel sur la poitrine), grande sœur « parfaite »
//  (queue de cheval blonde + AURÉOLE de perfection), maman qui compare, petit frère (moment tendre), Kevin (7/20 fêté).
//  Les CAPITALES du script = moments criés → kword slam + flash.
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

// ---------- SIZEX fun : accent BLEU CANARD (propre à l'épisode), jaune marqueur ----------
sxFun('#13a5a5'); SX.acc2 = '#ffd23f'; SX.cool = '#8fd0ff';
const TEAL = '#13a5a5', GOLD = '#ffd23f', PINK = '#ff6fa5';

// ============================================================
//  PERSONNAGES
// ============================================================
// le héros : bouclé châtain, t-shirt orange, un « 2 » cousu sur la poitrine (l'éternel deuxième)
const HERO_SHIRT = '#ff8a3d', HERO_HAIR = '#5a3a26';
const cmpHeroHair = (r, t, o) => hairSvg('curly', o.hairColor || HERO_HAIR, r, t);
function cmpChest(o, t, mark) { const s = o.s || 1, bob = (o.bob ?? 1) * wave(t, .8, 4, o.seed ?? 2), age = o.age || 'kid', y0 = age === 'adult' ? -235 : -140;
  return G(tr(o.x || 0, o.y || 0, s, o.rot || 0), G(tr(0, y0 + bob), mark)); }
const cmpMark = (b) => b === 'bib' ? rect(-46, -40, 92, 74, '#fff', 8, 5) + circ(-34, -30, 4, '#9aa3ad', 0) + circ(34, -30, 4, '#9aa3ad', 0) + ftext(0, 22, '2', { size: 54, fill: '#e2463a', stroke: 'none' })
  : b === 'star' ? circ(0, 0, 34, GOLD, 5) + path('M0 -22L6 -7L22 -6L10 4L14 20L0 11L-14 20L-10 4L-22 -6L-6 -7Z', '#fff', 3)
  : circ(0, 0, 32, '#fff', 5) + ftext(0, 15, '2', { size: 42, fill: '#9aa3ad', stroke: 'none' });
const heroP = (o, t) => { const q = Object.assign({ age: 'kid', hairFn: cmpHeroHair, shirt: HERO_SHIRT, pants: '#3b4a6b', seed: 2 }, o); return person(q, t) + (o.badge === false ? '' : cmpChest(q, t, cmpMark(o.badge))); };
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: cmpHeroHair, seed: 2 }, o), t));

// l'auréole de perfection de la grande sœur
function cmpHalo(r, t, o = {}) { const y = -r * 1.45 + Math.sin(t * 3) * r * .05, rx = r * .62, ry = r * .17, crook = o.haloCrook || 0;
  let g = glow(0, y, r * .95, '#fff3a0', .55) + ell(0, y, rx, ry, 'none', r * .15) + ell(0, y, rx, ry, 'none', r * .08, GOLD);
  for (let i = 0; i < 2; i++) { const a = t * 2 + i * 3.14; g += sparkle(Math.cos(a) * rx * 1.25, y + Math.sin(a) * ry * 2 - r * .1, r * .0035 * (1 + .4 * Math.sin(t * 9 + i)), '#fff'); }
  if (o.tape) g += G(tr(rx * .7, y + ry, 1, 30), rect(-r * .16, -r * .06, r * .32, r * .12, '#e8e2c8', 3, 3));
  return crook ? G(`rotate(${crook} 0 ${f1(y)})`, g) : g; }
const SIS = { hair: 'ponytail', hairColor: '#e0a040', shirt: PINK, pants: '#5b4b8a', skin: SK[2], seed: 7 };
const cmpSisHair = (r, t, o) => { const [b, f] = hairSvg('ponytail', '#e0a040', r, t); return [b, f + (o.halo === false ? '' : cmpHalo(r, t, o))]; };
const sisP = (o, t) => person(Object.assign({ age: 'kid', hairFn: cmpSisHair, shirt: PINK, pants: '#5b4b8a', skin: SK[2], seed: 7 }, o, { s: (o.s || 1) * 1.08 }), t);
const sisHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: cmpSisHair, skin: SK[2], seed: 7 }, o), t));
// le héros déguisé en sa sœur (perruque blonde de travers, auréole scotchée)
const cmpCostHair = (r, t, o) => { const [b0, f0] = hairSvg('curly', HERO_HAIR, r, t), [b, f] = hairSvg('ponytail', '#e0a040', r, t);
  return [b0 + G(`rotate(-10)`, b), f0 + G(`rotate(-10)`, f) + cmpHalo(r, t, { haloCrook: -14, tape: 1 })]; };
// maman (chignon, gilet violet), papa, grand frère capitaine, petit frère
const momP = (o, t) => person(Object.assign({ age: 'adult', hair: 'bun', hairColor: '#6b3e26', shirt: '#8a6ad8', pants: '#3b3f5a', skin: SKIN, seed: 64 }, o), t);
const momHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'bun', hairColor: '#6b3e26', seed: 64 }, o), t));
const dadP = (o, t) => person(Object.assign({ age: 'adult', hair: 'side', hairColor: '#4a3428', shirt: '#5b8fd8', pants: '#2f3b4e', mustache: true, seed: 61 }, o), t);
const broP = (o, t) => person(Object.assign({ age: 'adult', hair: 'short', hairColor: HERO_HAIR, shirt: '#e2463a', pants: '#fff', seed: 66 }, o), t) +
  cmpChest(Object.assign({ age: 'adult' }, o), t, ftext(0, 22, '10', { size: 60, fill: '#fff' })) +
  G(tr(o.x || 0, o.y || 0, o.s || 1), rect(-104, -305, 40, 50, GOLD, 8, 5) + ftext(-84, -268, 'C', { size: 30, fill: OL, stroke: 'none' }));
const petitP = (o, t) => person(Object.assign({ age: 'kid', hair: 'curly', hairColor: HERO_HAIR, shirt: GOLD, pants: '#5b8fd8', seed: 9 }, o, { s: (o.s || 1) * .78 }), t);
const petitHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'curly', hairColor: HERO_HAIR, seed: 9 }, o), t));
// pas de course (bras/jambes alternés)
const cmpRun = (t, k = 1, sp = 14) => { const a = Math.sin(t * sp) * 35 * k; return { legL: [90 + a, 90 + a * .3], legR: [90 - a, 90 - a * .3], armL: [110 - a, 60], armR: [70 + a, 120] }; };

// ============================================================
//  ACCESSOIRES (préfixe cmp)
// ============================================================
// copie double : note rouge entourée
const cmpCopy = (note = '', col = '#e2463a', k = 1, title = 'CONTRÔLE') => rect(-170, -210, 340, 420, '#fff', 8, 6) + ftext(0, -150, title, { size: 36, fill: OL, stroke: 'none' }) + line(-130, -120, 130, -120, 4, '#e2463a') +
  [0, 1, 2, 3].map(i => line(-130, -70 + i * 46, i === 3 ? 40 : 130, -70 + i * 46, 5, '#9fb3d8')).join('') +
  (note && k > 0 ? op(k, G(tr(40, 130, 1, -8), ftext(0, 0, note, { size: 84, fill: col, stroke: 'none' }) + ell(0, -28, 140, 66, 'none', 8, col))) : '');
const cmpCopyAt = (x, y, s, note, r = 0, col, k) => G(tr(x, y, s, r), cmpCopy(note, col, k));
// balance à plateaux
function cmpScale(x, y, s, a, L = '', Rt = '') { const ex = Math.cos(R(a)) * 300, ey = Math.sin(R(a)) * 300;
  const pan = (px, py, inner) => G(tr(px, py), line(0, 0, -120, 200, 5) + line(0, 0, 120, 200, 5) + G(tr(0, 200), inner) + path('M-170 200Q0 260 170 200Z', '#c9a24a', 6));
  return G(tr(x, y, s), path('M-120 620L120 620L60 560L-60 560Z', '#8a6a3a', 6) + rect(-22, 0, 44, 570, '#c9a24a', 8, 6) + circ(0, 0, 34, GOLD, 6) +
    G(`rotate(${f1(a)})`, rect(-320, -16, 640, 32, '#c9a24a', 14, 6)) + pan(-ex, -ey, L) + pan(ex, ey, Rt)); }
// arche d'arrivée + ruban
const cmpFinish = (x, yb, w, t, broke = 0) => { let ch = ''; for (let i = 0; i < 14; i++) ch += rect(-w / 2 + 20 + i * (w - 40) / 14, -640 + (i % 2) * 30, (w - 40) / 14, 30, i % 2 ? '#fff' : OL, 0, 0) + rect(-w / 2 + 20 + i * (w - 40) / 14, -640 + ((i + 1) % 2) * 30, (w - 40) / 14, 30, (i + 1) % 2 ? '#fff' : OL, 0, 0);
  return G(tr(x, yb), rect(-w / 2, -700, 40, 700, '#e2463a', 8, 6) + rect(w / 2 - 40, -700, 40, 700, '#e2463a', 8, 6) + rect(-w / 2, -720, w, 140, TEAL, 16, 7) + ftext(0, -665, 'ARRIVÉE', { size: 56, fill: '#fff' }) + ch +
    (broke ? path(`M${-w / 2 + 40} -300Q${-w / 4} ${-250 + broke * 200} ${-60} ${-200 + broke * 260}`, 'none', 12, '#ff5c5c') + path(`M${w / 2 - 40} -300Q${w / 4} ${-250 + broke * 200} ${60} ${-200 + broke * 260}`, 'none', 12, '#ff5c5c')
      : line(-w / 2 + 40, -300, w / 2 - 40, -300, 12, '#ff5c5c'))); };
// trophée géant
const cmpTrophy = (x, y, s = 1, t = 0) => G(tr(x, y, s), op(.5, glow(0, -150, 200, '#fff3a0', .7)) + rect(-90, -40, 180, 40, '#6b3e26', 6, 6) + rect(-60, -80, 120, 40, '#8a5a3a', 6, 6) + rect(-18, -150, 36, 70, '#e8b923', 0, 6) +
  path('M-100 -300L100 -300Q100 -150 0 -150Q-100 -150 -100 -300Z', GOLD, 7) + path('M-100 -280Q-170 -280 -150 -220Q-130 -180 -80 -190', 'none', 12, '#e8b923') + path('M100 -280Q170 -280 150 -220Q130 -180 80 -190', 'none', 12, '#e8b923') +
  ftext(0, -210, '1', { size: 70, fill: '#fff' }) + op(.6, path('M-70 -285Q-60 -200 -30 -175', 'none', 10, '#fff')) + sparkle(80, -290, .6 + .2 * Math.sin(t * 9), '#fff'));
const cmpMedal = (x, y, s = 1, num = '2', col = '#c9d3dc', r = 0) => G(tr(x, y, s, r), path('M-40 -120L-10 -20L10 -20L40 -120L20 -120L0 -50L-20 -120Z', TEAL, 5) + circ(0, 10, 44, col, 6) + circ(0, 10, 30, 'none', 4, shade(col, -.2)) + ftext(0, 28, num, { size: 46, fill: OL, stroke: 'none' }));
// podium 1-2-3
const cmpPodium = (x, yb, s = 1) => G(tr(x, yb, s), rect(-330, -200, 220, 200, '#c9d3dc', 8, 7) + ftext(-220, -80, '2', { size: 90, fill: '#fff' }) + rect(-110, -300, 220, 300, GOLD, 8, 7) + ftext(0, -150, '1', { size: 110, fill: '#fff' }) +
  rect(110, -140, 220, 140, '#e0a070', 8, 7) + ftext(220, -50, '3', { size: 80, fill: '#fff' }));
// piano à queue vu de face (le pianiste se place DERRIÈRE : dessiner cmpPianoBack, le perso, puis cmpPianoFront)
const cmpPianoBack = (x, yb, s = 1) => G(tr(x, yb, s), path('M-330 -420L-180 -760L340 -640L340 -420Z', '#2b2b33', 7) + line(120, -420, 160, -660, 10, '#7d848c') + op(.25, path('M-250 -460L-150 -700', 'none', 14, '#fff')));
const cmpPianoFront = (x, yb, s = 1, t = 0, play = 0) => { let keys = ''; for (let i = 0; i < 20; i++) { const dn = play && Math.sin(t * 22 + i * 1.7) > .6 ? 6 : 0; keys += rect(-320 + i * 32, -300 + dn, 32, 60, '#fff', 3, 4); }
  for (let i = 0; i < 20; i++) if (i % 7 !== 2 && i % 7 !== 6) keys += rect(-298 + i * 32, -300, 20, 34, OL, 3, 0);
  return G(tr(x, yb, s), rect(-310, -250, 40, 250, '#1d1d24', 8, 6) + rect(270, -250, 40, 250, '#1d1d24', 8, 6) + rect(-30, -150, 60, 20, '#c9a24a', 4, 4) + rect(-350, -430, 700, 140, '#1d1d24', 22, 7) + keys + rect(-350, -240, 700, 30, '#1d1d24', 10, 6) + op(.25, line(-300, -400, 200, -400, 8, '#fff')) +
    rect(-120, -520, 240, 90, '#2b2b33', 6, 5) + [0, 1, 2].map(i => line(-100, -500 + i * 22, 100, -500 + i * 22, 3, '#9aa3ad')).join('')); };
const cmpNotes = (x, y, t, n = 5, col = '#fff') => { let s = ''; for (let i = 0; i < n; i++) { const k = (t * .7 + i / n) % 1; s += op(Math.sin(k * 3.14), ftext(x + Math.sin(k * 7 + i) * 80 + (i - n / 2) * 50, y - k * 360, i % 2 ? '♪' : '♫', { size: 64, fill: col })); } return s; };
// carnet de dessin (dragon gribouillé)
const cmpSketch = (x, y, s = 1, r = 0, k = 1) => G(tr(x, y, s, r), rect(-170, -130, 340, 260, '#fff', 8, 6) + rect(-170, -150, 340, 26, '#5b8fd8', 8, 5) +
  op(k, path('M-110 60Q-90 -40 0 -30Q60 -80 110 -40Q80 -10 100 30Q40 20 20 60Z', '#7be07b', 5) + circ(70, -40, 7, OL, 0) + path('M-40 -30L-20 -70L0 -30M0 -32L20 -66L36 -36', '#ff9a4d', 4) + path('M110 -20Q150 -30 160 -10Q140 0 130 -10', '#ffd23f', 3) + path('M-110 60Q-150 40 -140 10', 'none', 6, '#36a85a')));
const cmpPencil = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), rect(-8, -80, 16, 110, GOLD, 3, 4) + path('M-8 30L8 30L0 52Z', '#f1d2a8', 4) + rect(-8, -92, 16, 14, '#ff8fb1', 3, 4));
// gâteau « BRAVO » + bougie 7
const cmpCake = (x, yb, s = 1, t = 0) => { const fl = 1 + .15 * Math.sin(t * 18);
  return G(tr(x, yb, s), ell(0, 0, 230, 34, '#f4f6f8', 6) + rect(-180, -150, 360, 150, '#ff8fb1', 16, 7) + path('M-180 -150Q-150 -100 -120 -150Q-90 -90 -60 -150Q-30 -100 0 -150Q30 -90 60 -150Q90 -100 120 -150Q150 -90 180 -150', '#fff', 5) +
    rect(-130, -250, 260, 100, '#fff2d6', 14, 7) + ftext(0, -184, 'BRAVO', { size: 44, fill: '#e2463a', stroke: 'none' }) + ftext(0, -40, '7/20', { size: 52, fill: '#fff' }) +
    ftext(0, -262, '7', { size: 120, fill: '#5ec4f0' }) + line(0, -360, 0, -380, 4) + G(tr(0, -400, fl), path('M0 -30Q18 0 0 14Q-18 0 0 -30Z', '#ffb03a', 4)) + op(.4, circ(0, -400, 40, '#fff3a0', 0))); };
const cmpCrown = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-80 30L-90 -50L-45 -10L0 -70L45 -10L90 -50L80 30Z', GOLD, 7) + circ(0, -10, 12, '#e2463a', 4) + circ(-50, 10, 9, '#5ec4f0', 4) + circ(50, 10, 9, '#7be07b', 4));
// cornet acoustique (pour ENTENDRE enfin « on est fiers de toi »)
const cmpTrumpet = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M0 -14L260 -120Q300 0 260 120L0 14Z', '#e8b923', 7) + ell(268, 0, 40, 120, '#c9962a', 7) + ell(268, 0, 22, 80, '#7a5a1a', 0) + op(.4, path('M30 -10L240 -90', 'none', 8, '#fff')));
// ampoule
const cmpBulb = (x, y, s = 1, on = 1, t = 0) => G(tr(x, y, s), (on ? op(.5 + .2 * Math.sin(t * 10), glow(0, -20, 180, '#fff3a0', .9)) : '') + circ(0, -30, 70, on ? '#fff3a0' : '#e8eef2', 7) + rect(-34, 30, 68, 50, '#9aa3ad', 8, 6) + line(-30, 48, 30, 48, 4) + path('M-20 -10L-10 -40L0 -10L10 -40L20 -10', 'none', 5, '#e8b923') +
  (on ? [0, 1, 2, 3, 4].map(i => { const a = R(-150 + i * 30); return line(Math.cos(a) * 95, -30 + Math.sin(a) * 95, Math.cos(a) * 130, -30 + Math.sin(a) * 130, 9, GOLD); }).join('') : ''));
// cadre doré « portrait de la sœur »
const cmpPortrait = (x, y, w, h, t, o = {}) => G(tr(x, y, o.s || 1, o.r || 0), op(.5, glow(0, 0, w * .9, '#fff3a0', .6)) + rect(-w / 2 - 22, -h / 2 - 22, w + 44, h + 44, '#e8b923', 14, 7) + rect(-w / 2, -h / 2, w, h, o.bg || '#ffe1ec', 6, 5) +
  clipR(-w / 2, -h / 2, w, h, G(tr(0, h * .12), sisHead(0, 0, w * .3, { expr: o.expr || 'proud' }, t)) + rect(-w / 2, h * .32, w, h, PINK, 0, 5), 6) + (o.label ? G(tr(0, h / 2 + 10), rect(-w * .42, -24, w * .84, 48, '#fff8e0', 10, 5) + ftext(0, 14, o.label, { size: 30, fill: '#b8861a', stroke: 'none' })) : ''));
// mini-papier aimanté sur le frigo
const cmpFridgeNote = (x, y, r, inner, mag = '#e2463a', s = 1) => G(tr(x, y, s, r), rect(-62, -78, 124, 156, '#fff', 6, 5) + inner + circ(0, -78, 13, mag, 4));
const fnNote = (n, c = '#e2463a') => ftext(0, 30, n, { size: 40, fill: c, stroke: 'none' }) + [0, 1].map(i => line(-44, -40 + i * 22, 44, -40 + i * 22, 4, '#b9c4d0')).join('');
const fnSis = (t) => G(tr(0, -10), sisHead(0, 0, 36, { expr: 'happy' }, t)) + ftext(0, 60, 'BRAVO', { size: 20, fill: '#e2463a', stroke: 'none' });
const fnDragon = () => G(tr(0, 0, .32), path('M-110 60Q-90 -40 0 -30Q60 -80 110 -40Q80 -10 100 30Q40 20 20 60Z', '#7be07b', 10) + path('M-40 -30L-20 -70L0 -30', '#ff9a4d', 8));
// toise (graduations sur le mur)
const cmpToise = (x, y0, y1) => { let s = rect(x - 40, y1, 80, y0 - y1, '#fff8e0', 8, 5); for (let y = y0 - 20, i = 0; y > y1 + 10; y -= 40, i++) s += line(x - 40, y, x - (i % 2 ? 20 : 4), y, 4, '#b8861a'); return s; };
const cmpFlash = (t, t0, k = .8) => t < t0 || t > t0 + .25 ? '' : op(k * (1 - seg(t, t0, t0 + .25)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0));
const cmpCloudRain = (x, y, t, s = 1) => { let r = ''; for (let i = 0; i < 7; i++) { const k = (t * 2.2 + i / 7) % 1; r += line(x - 110 + i * 36, y + 40 + k * 260, x - 116 + i * 36, y + 70 + k * 260, 6, '#5aaee0'); } return G(tr(0, 0), r) + cloud(x, y, 1.5 * s, '#9aa3ad', 6); };

// ============================================================
//  DÉCORS PROPRES À L'ÉPISODE
// ============================================================
// cuisine (frigo couvert des exploits de la sœur)
function cmpKitchen(t, o = {}) { const yb = 1250;
  let s = dWall('stripe', '#e3f4ef', '#d3ece6', yb);
  s += rect(-60, 170, 330, 270, '#9fd6cf', 12, 6) + line(105, 170, 105, 440, 5) + circ(85, 330, 9, OL, 0) + circ(125, 330, 9, OL, 0) + rect(-60, 170, 330, 270, 'none', 12, 6);
  s += dWindowView(330, 280, 300, 300, t) + rect(318, 268, 324, 324, 'none', 8, 10, '#fff') + dCurtain(310, 260, 80, 340, TEAL, t, 1) + dCurtain(570, 260, 80, 340, TEAL, t, -1);
  s += wallClock(800, 210, 52, t) + dShelf(680, 430, 240, dJar(715, 430, '#ff9a4d', .8) + dJar(770, 430, '#7be07b', .8) + dMug(835, 430, .9, t, '#ff8fb1') + dPot(890, 430, .4, t, 2));
  s += hangLamp(480, 150, t, .45);
  s += rect(-M, 930, 830 + M, 330, '#c58e55', 0, 6) + rect(-M, 900, 850 + M, 40, '#f4f1ea', 8, 6) + [0, 1, 2].map(i => rect(-20 + i * 270, 980, 240, 120, '#d9a06a', 10, 5) + rect(80 + i * 270, 1030, 40, 14, OL, 6, 0)).join('');
  s += G(tr(170, 900), path('M-60 0L-50 -110Q0 -140 50 -110L60 0Z', '#e2463a', 6) + path('M50 -90Q100 -100 110 -60', 'none', 9) + rect(-20, -150, 40, 30, OL, 8, 0)) + steam(200, 760, t, .8);
  s += G(tr(420, 900), path('M-80 0Q-80 -60 0 -60Q80 -60 80 0Z', '#fff', 6) + circ(-30, -66, 26, '#e2463a', 5) + circ(20, -70, 24, '#ffd23f', 5) + circ(-2, -92, 22, '#7be07b', 5)) + dPot(640, 900, .6, t, 1, TEAL);
  s += rect(830, 470, 320, 780, '#f4f6f8', 26, 7) + line(830, 760, 1150, 760, 6) + rect(860, 600, 18, 120, '#9aa3ad', 6, 4) + rect(860, 800, 18, 160, '#9aa3ad', 6, 4);
  s += o.fridge != null ? o.fridge : cmpFridgeNote(930, 560, -6, fnNote('20/20')) + cmpFridgeNote(1050, 590, 5, fnSis(t), '#5b8fd8') + cmpFridgeNote(940, 880, 4, fnNote('19/20'), '#36a85a') + cmpFridgeNote(1060, 920, -5, fnNote('20/20'), GOLD);
  s += dTileFloor(yb, '#f2e6d0', '#d9c9ae') + dBin(60, 1300, .9, TEAL);
  return s; }
// chambre : rangée et brillante (sœur) ou en désordre (héros)
function cmpRoom(t, o = {}) { const yb = 1250, m = o.messy;
  let s = m ? dWall('stripe', '#dcecff', '#cfe2fb', yb) : dWall('dot', '#ffe6ef', '#ffcadb', yb);
  s += dWindowView(100, 280, 280, 300, t) + rect(88, 268, 304, 324, 'none', 8, 10, '#fff') + dCurtain(80, 260, 80, 340, m ? '#5b8fd8' : PINK, t, 1) + dCurtain(320, 260, 80, 340, m ? '#5b8fd8' : PINK, t, -1);
  s += m ? dPoster(560, 330, 170, 220, '#36a85a', 9, ftext(0, 10, 'ROCK', { size: 40, fill: '#fff', stroke: 'none' }), t) + dPoster(800, 300, 150, 190, '#8a6ad8', -12, circ(0, 0, 40, '#ffd23f', 4), t)
    : dFrame(560, 320, 150, 170, 'heart', '#e8b923', -2) + dFrame(780, 300, 170, 140, 'mount', '#e8b923', 2) + G(tr(940, 320), rect(-70, -50, 140, 100, '#fff8e0', 10, 5) + ftext(0, 12, 'N°1', { size: 40, fill: '#e8b923', stroke: 'none' }));
  s += m ? dShelf(470, 560, 380, dBooks(480, 560, 170, 3) + G(tr(720, 560, 1, 20), rect(-20, -70, 40, 70, '#e2463a', 4, 4)) + dGlobe(800, 560, .6, t))
    : dShelf(470, 560, 400, dTrophy(510, 560, .7) + dTrophy(570, 560, .85) + dTrophy(640, 560, .7) + dTrophy(710, 560, .85) + dTrophy(780, 560, .7) + dTrophy(840, 560, .6));
  s += wallClock(260, 160, 44, t);
  // lit à droite
  s += rect(1010, 820, 130, 440, m ? '#5b8fd8' : '#ffb3cc', 18, 7) + rect(620, 1040, 520, 130, '#fff', 14, 7) + ell(900, 1020, 100, 40, '#fff', 6);
  s += m ? path('M600 1050Q680 980 760 1060Q860 990 920 1070Q1000 1010 1130 1060L1130 1180L600 1180Z', '#7aa6d8', 7) + path('M660 1100Q720 1060 780 1110', 'none', 5, '#5a86c0')
    : rect(610, 1060, 530, 120, PINK, 10, 7) + line(610, 1090, 1140, 1090, 6, '#fff') + dTeddy(780, 1050, .9);
  s += dParquet(yb, '#e8cfa8') + dRug(420, 1330, 520, 110, m ? '#9fc6dc' : '#ffcadb', '#fff');
  if (m) { // le chaos
    s += [[160, 1270, '#e2463a'], [330, 1300, '#36a85a'], [520, 1280, '#8a6ad8'], [700, 1310, '#ffd23f'], [880, 1290, '#ff9a4d']].map(([x, y, c], i) => path(`M${x - 90} ${y}Q${x - 60} ${y - 70} ${x} ${y - 60}Q${x + 70} ${y - 80} ${x + 90} ${y}Z`, c, 6) + path(`M${x - 40} ${y - 40}Q${x} ${y - 20} ${x + 30} ${y - 50}`, 'none', 5, shade(c, -.25))).join('');
    s += G(tr(980, 1240, 1, -8), rect(-80, -20, 160, 26, '#d9a86c', 4, 5) + ftext(0, -2, 'PIZZA', { size: 18, fill: '#e2463a', stroke: 'none' })) + [0, 1, 2].map(i => circ(250 + i * 300, 1380 + (i % 2) * 30, 22, '#fff', 4)).join('');
    s += G(tr(820, 545, 1, 10), path('M0 0L10 60L40 70L44 50L24 40L20 0Z', '#fff', 4)) + dBooks(160, 1250, 120, 7).replace(/<g/, '<g transform="rotate(-6 200 1250)"');
    const fx = 700 + Math.sin(t * 3) * 120, fy = 700 + Math.sin(t * 5) * 60; s += circ(fx, fy, 8, OL, 0) + op(.6, ell(fx - 6, fy - 10, 8, 5, '#fff', 2) + ell(fx + 6, fy - 10, 8, 5, '#fff', 2));
  } else { // brillant
    for (let i = 0; i < 7; i++) { const x = [200, 480, 690, 900, 1040, 300, 560][i], y = [700, 230, 470, 640, 760, 1000, 900][i], k = .5 + .5 * Math.sin(t * 5 + i * 1.3); s += sparkle(x, y, .3 + .4 * k, '#fff'); }
    s += G(tr(220, 1250), [0, 1, 2, 3].map(i => rect(-80, -30 - i * 30, 160, 30, DPAL[i * 2 % 8], 6, 5)).join(''));
  }
  return s; }
// stade de foot
function cmpField(t, o = {}) { let s = SKY(t, '#8fd3ff', '#e6f6ff') + dBirds(t, 3, 250);
  s += rect(-M, 560, W + 2 * M, 380, '#5b6b8a', 0, 7); for (let r = 0; r < 4; r++) for (let i = 0; i < 16; i++) { const x = -40 + i * 76 + (r % 2) * 38, y = 610 + r * 80 - (o.cheer ? Math.abs(Math.sin(t * 9 + i + r)) * 18 : 0); s += circ(x, y, 26, SK[(i + r) % 6], 4) + rect(x - 30, y + 20, 60, 40, DPAL[(i * 3 + r) % 8], 14, 4); }
  s += rect(-M, 900, W + 2 * M, 70, TEAL, 0, 6) + ['ALLEZ !', 'FOOT', 'BUT !'].map((w, i) => ftext(180 + i * 360, 950, w, { size: 40, fill: '#fff' })).join('');
  s += rect(-M, 970, W + 2 * M, 1300, '#7cc96a', 0, 0); for (let i = 0; i < 6; i++) s += rect(-M + i * 360, 970, 180, 1300, '#6cbb5c', 0, 0);
  s += line(-M, 1080, W + M, 1080, 8, '#fff') + G(tr(900, 1080), rect(-160, -230, 16, 230, '#fff', 4, 5) + rect(160, -230, 16, 230, '#fff', 4, 5) + rect(-160, -240, 336, 16, '#fff', 4, 5) +
    [0, 1, 2, 3, 4, 5, 6].map(i => line(-150 + i * 50, -230, -150 + i * 50 + (o.net || 0) * 20, 0, 3, 'rgba(255,255,255,.7)')).join('') + [0, 1, 2, 3].map(i => line(-150, -200 + i * 55, 166, -200 + i * 55, 3, 'rgba(255,255,255,.7)')).join(''));
  s += G(tr(60, 1090), line(0, 0, 0, -160, 6) + path(`M0 -160L${50 + wave(t, 1.4, 8)} -140L0 -120Z`, '#ffd23f', 4));
  return s; }
// gymnase de la compétition
function cmpGym(t, o = {}) { const yb = 1300;
  let s = dWall('stripe', '#f3e2c4', '#ead6b2', yb) + rect(-M, 140, W + 2 * M, 40, '#c58e55', 0, 6);
  for (let i = 0; i < 12; i++) s += path(`M${-40 + i * 100} 180L${10 + i * 100} 260L${60 + i * 100} 180Z`, DPAL[i % 8], 4);
  s += G(tr(CX, 330, 1, wave(t, .5, 2)), line(-300, -150, -300, -40, 5) + line(300, -150, 300, -40, 5) + rect(-380, -50, 760, 110, TEAL, 18, 7) + ftext(0, 25, o.banner || 'COMPÉTITION', { size: 64, fill: '#fff' }));
  for (const sd of [-1, 1]) { const bx = sd < 0 ? 0 : 760; s += rect(bx - 60, 620, 380, 420, '#8a5a3a', 8, 6); for (let r = 0; r < 4; r++) { s += rect(bx - 60, 660 + r * 95, 380, 18, '#6b3e26', 0, 0); for (let i = 0; i < 5; i++) { const x = bx - 20 + i * 72, y = 640 + r * 95 - (o.cheer ? Math.abs(Math.sin(t * 9 + i * 2 + r)) * 16 : 0); s += circ(x, y, 24, SK[(i + r + bx) % 6], 4) + rect(x - 26, y + 18, 52, 30, DPAL[(i + r * 3) % 8], 10, 4); } } }
  s += op(.2 + .05 * Math.sin(t * 3), path('M380 120L180 1300L900 1300L700 120Z', '#fff6c8', 0)) + dSpeaker(980, 600, .5, t) + dSpeaker(100, 600, .5, t);
  s += dParquet(yb - 50, '#e9c48a') + path(`M-${M} ${yb + 40}L${W + M} ${yb + 40}`, 'none', 8, '#fff') + ell(CX, yb + 260, 300, 70, 'none', 8, '#fff');
  return s; }

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001a — SIGNATURE : grille encre, héros en cut-out, titre 3 lignes, « débloqué » en étoiles sur COMPARÉ ; la sœur auréolée débarque sur « sœur »
const O1 = at(1, 'tu') - .12;
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'compare'), Fr = at(1, 'frere'), Sa = at(1, 'sa');
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(400, 1050, 300, t, .4, SX.acc, 16) + unlock(400, 1000, t, K, { part: 'back', r: 460 }) +
      (t > Sa - .1 ? G(tr(820, 1460, eOutBack(seg(t, Sa - .1, Sa + .2))), cutout(sisP({ x: 0, y: 0, s: 1.05, expr: 'smugger', armR: [-60, -80] }, t), 10)) : '') +
      G(tr(400, 1440, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.25, expr: t > Sa ? 'worried' : t > K ? 'jawdrop' : 'happy' }, t), 12)) +
      unlock(400, 1000, t, K, { part: 'front', r: 460 }) + funBox(400, 1030, 320, 320, t, K + .2, { label: 'heros.png' }) +
      funTag(840, 740, 'FRÈRE ?', t, Fr - .05, { size: 40, bg: '#5b8fd8', r: 6 }) + funTag(840, 840, 'SŒUR ?', t, Sa - .05, { size: 40, bg: PINK, r: -5 }) +
      kthin("POURQUOI C'EST HORRIBLE", CX, 330, t, .05, { size: 54 }) + kthin("D'ÊTRE TOUJOURS", CX, 415, t, .4, { size: 58 }) +
      kword('COMPARÉ ?', CX, 540, t, K - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.4, 'pop_hi', .4], [at(1, 'compare') - .05, 'boom', .6], [at(1, 'compare'), 'sparkle', .5], [at(1, 'frere') - .05, 'pop', .5], [at(1, 'sa') - .1, 'angel', .4]] });

// B001b — « Tu rentres de l'école. » : rue, le héros court avec sa copie, cartable au dos
B(1, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => { const Ec = at(1, 'ecole') - O1, x = lerp(200, 520, t / d);
    return depth({ zoom: 1, x: -t * 60 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: G(tr(x - 70, 1270), rect(-50, -60, 100, 120, '#5b8fd8', 20, 6)) + heroP(Object.assign({ x, y: 1490, s: 1.3, expr: 'happy' }, cmpRun(t), { armR: [-60, -80], holdR: G(tr(10, -60, .3, 8), cmpCopy('?')) }), t) + speedLines(t, x - 300, 1100, 10, 'rgba(255,255,255,.6)') },
      { z: .6, svg: blur(10, dBush(1000, 1900, 1.6)) }]) +
      kthin("tu rentres de l'école", CX, 440, t, 0, { size: 60 }) + funTag(800, 600, '16H30', t, Ec - .1, { size: 46, bg: TEAL, r: 6 }); },
  sfx: [[0, 'whoosh', .4], [.05, 'steps', .5], [at(1, 'ecole') - O1 - .1, 'pop_hi', .4], [at(1, 'ecole') - O1 + .1, 'school_bell', .3]] }, O1);

// B002 — « Tu as 18 sur 20. » : papier + gobo, la copie en carte 2.5D, 18/20 slam
B(2, { enter: 'none', trans: 'wipe', transD: .22, cam: zin(1.0, 1.06, .2),
  draw: (t, d, T) => { const N = at(2, '18'), k = seg(t, N, N + .15);
    return paper(SX.paper) + gobo(T, .12) + blob(720, 900, 300, t, '#cfeeee', 2) + burst(720, 900, 280, t, N, SX.acc, 16) +
      card(720, 900, 340, 420, cmpCopy('18/20', '#e2463a', k), t, .02, { ry: 0, thick: 10, r: 6, bw: 6 }) +
      cutout(heroP({ x: 270, y: 1480, s: 1.2, expr: t > N ? 'ecstatic' : 'happy', armL: t > N ? [-140, -110] : [110, 100] }, t), 10) +
      kthin('tu as', CX, 420, t, 0, { size: 60 }) + kword('18/20', CX, 560, t, N - .05, { size: 140, fill: SX.acc2 }) + popStars(720, 900, t, N + .05, 8, 280); },
  sfx: [[0, 'whoosh', .4], [.02, 'pop', .5], [at(2, '18') - .05, 'boom', .6], [at(2, '18'), 'tada', .5], [at(2, 'sur'), 'sparkle', .4]] });

// B003 — « Tu cours montrer ta copie à ta mère. » : papier, le héros traverse en courant (copie brandie), maman en cut-out
B(3, { enter: 'none', trans: 'circle', transD: .25, cam: zin(1.0, 1.05, .3),
  draw: (t, d, T) => { const Co = at(3, 'cours'), Cp = at(3, 'copie'), Me = at(3, 'mere'), x = lerp(120, 420, eOutCubic(seg(t, 0, d)));
    return paper('#e3f4ef') + gobo(T, .1) + blob(800, 1020, 260, t, '#ffe1ec', 3) +
      cutout(momP({ x: 820, y: 1480, s: 1.05, expr: t > Me ? 'happy' : 'neutral', flip: 1, armL: [150, 60] }, t), 10) +
      speedLines(t, x - 250, 1100, 12, 'rgba(19,165,165,.5)') + cutout(heroP(Object.assign({ x, y: 1480, s: 1.15, expr: 'ecstatic' }, cmpRun(t, 1, 18), { armR: [-70, -90], holdR: G(tr(10, -70, .38, 6), cmpCopy('18/20')) }), t), 10) +
      kthin('tu cours montrer', CX, 420, t, Co - .1, { size: 60 }) + funTag(380, 560, 'TA COPIE', t, Cp - .1, { size: 50, bg: SX.acc2, fg: SX.ink, r: -5 }) + funTag(820, 640, 'MAMAN', t, Me - .1, { size: 50, bg: '#8a6ad8', r: 5 }); },
  sfx: [[0, 'whoosh', .4], [at(3, 'cours'), 'steps', .6], [at(3, 'copie') - .1, 'pop_hi', .4], [at(3, 'mere') - .1, 'pop', .5]] });

// B004 — « Elle sourit. Puis demande : » : cuisine, maman sourit… puis plisse les yeux
B(4, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .3 }),
  draw: (t, d, T) => { const So = at(4, 'sourit'), Pu = at(4, 'puis');
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.4, svg: cmpKitchen(t), haze: .08 },
      { z: 1, svg: momP({ x: 700, y: 1470, s: 1.1, expr: t > Pu ? 'suspicious' : 'happy', look: [-1, 0], face: t > Pu ? { mouth: 'flat' } : {} }, t) +
        heroP({ x: 290, y: 1490, s: 1.25, expr: 'ecstatic', armR: [-60, -80], holdR: G(tr(10, -70, .4, 6), cmpCopy('18/20')) }, t) },
      { z: .6, svg: blur(10, dPot(1040, 1960, 1.6, t, 2)) }]) +
      kthin('elle sourit…', CX, 430, t, So - .15, { size: 62, out: Pu - .1 }) + kword('PUIS DEMANDE :', CX, 430, t, Pu - .05, { size: 84, fill: SX.acc2 }) + (t > So && t < Pu ? sparkle(760, 1020, .8, '#fff') : ''); },
  sfx: [[0, 'whoosh', .4], [at(4, 'sourit'), 'glint', .5], [at(4, 'puis') - .05, 'sting', .5], [at(4, 'demande'), 'hmm', .4]] });

// B005 — « Et ta sœur, elle avait eu combien à ton âge ? » : gros plan maman, bulle « la sœur auréolée », COMBIEN ?
B(5, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ta = at(5, 'ta'), Cb = at(5, 'combien'), Ag = at(5, 'age'), kb = pop(t, Ta + .1, .35);
    const bub = kb <= 0 ? '' : G(tr(780, 720, kb), cloud(0, 0, 2.0, '#fff', 7) + circ(-200, 180, 24, '#fff', 6) + circ(-250, 240, 14, '#fff', 5) + sisHead(0, 30, 80, { expr: 'smugger' }, t));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: cmpKitchen(t), haze: .3 }, { z: 1, svg: momHead(360, 980, 200, { expr: t > Cb ? 'smug' : 'suspicious', look: [1, -.4], face: { mouth: 'talk' } }, t) }]) + bub +
      heroHead(930, 1180, 110, { expr: t > Ag ? 'panic' : t > Cb ? 'worried' : 'happy', tilt: 8 }, t) +
      kthin('et ta sœur, elle avait eu', CX, 410, t, Ta - .1, { size: 52 }) + kword('COMBIEN ?', CX, 540, t, Cb - .05, { size: 110, fill: SX.acc2 }) + (t > Ag ? funTag(780, 920, 'À TON ÂGE', t, Ag - .05, { size: 34, bg: TEAL, r: 4 }) : ''); },
  sfx: [[at(5, 'ta'), 'pop_hi', .4], [at(5, 'ta') + .1, 'angel', .4], [at(5, 'combien') - .05, 'boom', .5], [at(5, 'age'), 'gulp', .5]] });

// B006 — « 19. Silence. » : la balance : la copie 18 monte, la 19 auréolée l'écrase ; puis grisaille + grillons
B(6, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(6, '19') && t < at(6, '19') + .35 ? 8 : 0 }),
  draw: (t, d, T) => { const N = at(6, '19'), Si = at(6, 'silence'), a = lerp(-14, 18, eOutBack(seg(t, N, N + .3)));
    const L = G(tr(0, -110, .42, -6), cmpCopy('18/20')), Rr = t > N - .1 ? G(tr(0, -110 - 200 * (1 - eOutCubic(seg(t, N - .1, N + .12))), .42, 6), cmpCopy('19/20', '#e2463a', 1) + G(tr(0, -260), cmpHalo(180, t))) : '';
    return depth({ zoom: 1 }, [{ z: 1.4, svg: cmpKitchen(t), haze: .4 }]) + cmpScale(CX, 640, .95, a, L, Rr) + heroHead(170, 1080, 110, { expr: t > Si ? 'deadpan' : t > N ? 'jawdrop' : 'happy', tilt: -8 }, t) +
      momHead(910, 1090, 100, { expr: 'smug', look: [-1, 0] }, t) +
      kword('19/20', CX, 440, t, N - .05, { size: 130, fill: '#fff' }) + (t > Si ? op(.4, rect(-M, -M, W + 2 * M, H + 2 * M, '#6a6f7a', 0, 0)) + funTag(CX, 1130, 'SILENCE…', t, Si, { size: 44, bg: '#fff', fg: SX.ink }) : ''); },
  sfx: [[at(6, '19') - .05, 'boom', .7], [at(6, '19') + .05, 'thud', .6], [at(6, '19') + .1, 'angel', .4], [at(6, 'silence'), 'crickets', .7]] });

// B007a — « FÉLICITATIONS ! » : rayons, confettis, le héros en chapeau de fête… dépité
const O7b = at(7, 'tu') - .12, O7c = at(7, 'auquel') - .12;
B(7, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t < .3 ? 6 : 0 }),
  draw: (t, d, T) => rays(t, CX, 950, '#2cc0c0', '#0f7f86', 22) + confetti(t, 0, 40) +
    cutout(heroP({ x: CX, y: 1480, s: 1.3, expr: 'deadpan', armL: [-150, -120] }, t) + G(tr(CX + 10, 1480 - 1.3 * 392, 1, 12), path('M-60 0L0 -150L60 0Z', TEAL, 6) + circ(0, -150, 18, GOLD, 5) + circ(-20, -50, 9, '#fff', 0) + circ(20, -90, 8, '#fff', 0)), 12) +
    kword('FÉLICITATIONS !', CX, 480, t, .02, { size: 82, fill: SX.acc2 }) + popStars(CX, 480, t, .1, 8, 380),
  sfx: [[0, 'flash_hit', .5], [.02, 'boom', .6], [.05, 'tada', .5], [.3, 'rimshot', .4]] });
// B007b — « Tu viens de perdre un concours » : ligne d'arrivée, la sœur casse le ruban, le héros (dossard 2) n'a même pas bougé
B(7, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const Pe = at(7, 'perdre') - O7b, Co = at(7, 'concours') - O7b, k = seg(t, Pe - .2, Pe + .3), sx = lerp(-200, 560, eOutCubic(k));
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.5, svg: streetT(t, 2), haze: .1 },
      { z: 1, svg: cmpFinish(560, 1320, 760, t, seg(t, Pe, Pe + .2)) +
        sisP(Object.assign({ x: sx, y: 1490, s: 1.15, expr: 'ecstatic' }, cmpRun(t, 1 - seg(t, Pe + .3, Pe + .5), 16), t > Pe + .3 ? { armL: [-140, -110], armR: [-40, -70] } : {}), t) + (t > Pe ? confetti(t, Pe, 24) : '') +
        heroP({ x: 900, y: 1490, s: 1.15, expr: t > Pe ? 'jawdrop' : 'confused', badge: 'bib', flip: 1 }, t) },
      { z: .6, svg: blur(10, dBush(80, 1900, 1.6)) }]) +
      kthin('tu viens de perdre', CX, 420, t, 0, { size: 58 }) + kword('UN CONCOURS', CX, 560, t, Co - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(7, 'perdre') - O7b - .2, 'steps', .5], [at(7, 'perdre') - O7b, 'snip', .6], [at(7, 'perdre') - O7b + .05, 'whistle', .5], [at(7, 'concours') - O7b - .05, 'boom', .5]] }, O7b);
// B007c — « auquel tu n'étais même pas inscrit. » : liste des inscrits (que la sœur), tampon PAS INSCRIT
B(7, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Me = at(7, 'meme') - O7c, In = at(7, 'inscrit') - O7c;
    const list = ftext(0, -150, 'INSCRITS', { size: 40, fill: OL, stroke: 'none' }) + line(-130, -125, 130, -125, 4, TEAL) + G(tr(-70, -60), sisHead(0, 0, 34, { expr: 'happy' }, t)) + ftext(-20, -48, 'TA SŒUR ✓', { size: 30, fill: '#36a85a', stroke: 'none', anchor: 'start' }) +
      [0, 1, 2].map(i => line(-130, 20 + i * 50, 130, 20 + i * 50, 4, '#c9d3dc')).join('') + ftext(0, 180, '(toi : nulle part)', { size: 24, fill: '#9aa3ad', stroke: 'none' });
    return depth({ zoom: 1 }, [{ z: 1.4, svg: streetT(t, 2), haze: .35 }]) + cmpFinish(560, 1320, 760, t, 1).replace('<g', '<g opacity=".35"') +
      card(720, 860, 340, 440, list, t, .02, { ry: 0, thick: 10, r: 4, bw: 6 }) + stamp(720, 920, 'PAS INSCRIT', t, In - .05, '#e2463a', -14, 54) +
      heroP({ x: 250, y: 1490, s: 1.25, expr: t > In ? 'dizzy' : 'confused', badge: 'bib' }, t) +
      kthin("auquel tu n'étais", CX, 420, t, 0, { size: 58 }) + kword('MÊME PAS INSCRIT', CX, 560, t, Me - .05, { size: 76, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [.02, 'pop', .5], [at(7, 'meme') - O7c - .05, 'boom', .4], [at(7, 'inscrit') - O7c - .05, 'thud', .7], [at(7, 'inscrit') - O7c + .1, 'rimshot', .4]] }, O7c);

// B008 — « Bienvenue dans la vie de l'enfant toujours comparé. » : salon-musée à la gloire de la sœur, le héros minuscule
B(8, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bv = at(8, 'bienvenue'), En = at(8, 'enfant'), Cp = at(8, 'compare');
    const spot = op(.25, path('M760 120L560 1250L960 1250Z', '#fff6c8', 0));
    return salonF(t) + WASH() + spot + cmpPortrait(760, 820, 260, 300, t, { label: 'NOTRE FIERTÉ' }) + dTrophy(560, 1120, 1.1) + dTrophy(960, 1120, 1.3) +
      heroP({ x: 280, y: 1490, s: 1.25, expr: t > Cp ? 'sad' : 'worried', look: [1, -1] }, t) + (t > Cp ? sweat(380, 1020 + (t * 40) % 30, 1) : '') +
      kthin('bienvenue dans la vie de', CX, 410, t, Bv - .1, { size: 54 }) + kthin("l'enfant", CX, 500, t, En - .15, { size: 56 }) + kword('TOUJOURS COMPARÉ', CX, 610, t, Cp - .2, { size: 72, fill: SX.acc2 }); },
  sfx: [[at(8, 'bienvenue'), 'magic', .5], [at(8, 'vie'), 'pop_hi', .4], [at(8, 'compare') - .2, 'boom', .5], [at(8, 'compare'), 'angel', .3]] });

// B009 — « À huit ans, ta sœur range sa chambre. » : chambre rose impeccable, trophées, la sœur plie, tout brille
B(9, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const A8 = at(9, '8'), Ra = at(9, 'range');
    const stack = G(tr(0, -20), [0, 1, 2].map(i => rect(-60, -i * 24, 120, 24, DPAL[(i + 4) % 8], 6, 4)).join(''));
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.4, svg: cmpRoom(t), haze: .06 },
      { z: 1, svg: sisP({ x: 430, y: 1480, s: 1.2, expr: 'proud', armL: [-30, -10], armR: [-150, -170], holdL: stack }, t) + (t > Ra ? sparkle(600, 1020, .8 + .3 * Math.sin(t * 12), '#fff') + sparkle(300, 900, .5, '#fff') : '') },
      { z: .6, svg: blur(10, dPot(60, 1950, 1.6, t, 0)) }]) +
      funTag(CX, 430, '8 ANS', t, A8 - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 430, t, A8, 6, 180) + kthin('ta sœur range sa chambre', CX, 600, t, Ra - .2, { size: 56 }); },
  sfx: [[0, 'whoosh', .4], [at(9, '8') - .1, 'pop', .7], [at(9, 'range'), 'sparkle', .6], [at(9, 'chambre'), 'glint', .5], [at(9, 'chambre') + .2, 'angel', .3]] });

// B010 — « On te demande pourquoi la tienne est en désordre. » : chambre du héros = champ de bataille, maman à la porte
B(10, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4, shake: t > at(10, 'desordre') ? 4 : 0 }),
  draw: (t, d, T) => { const Po = at(10, 'pourquoi'), Ti = at(10, 'tienne'), De = at(10, 'desordre');
    const door = rect(800, 540, 280, 720, '#d9a06a', 8, 7) + rect(820, 560, 300, 700, '#5a3a26', 0, 0);
    return cmpRoom(t, { messy: 1 }) + door + momP({ x: 900, y: 1470, s: 1.05, expr: t > De ? 'angry' : 'annoyed', look: [-1, 0], armR: [-160, -170], flip: 1 }, t) +
      heroP({ x: 380, y: 1490, s: 1.25, expr: t > De ? 'embarrassed' : 'neutral', look: [1, 0] }, t) + G(tr(380, 1490 - 1.25 * 392 - 40), path('M-30 0Q0 -40 30 0', 'none', 6, '#7aa6d8') + path('M-50 -30Q0 -70 50 -30', 'none', 6, '#7aa6d8')) +
      kthin('on te demande', CX, 420, t, 0, { size: 56, out: Po - .1 }) + kword('POURQUOI ?', CX, 420, t, Po - .05, { size: 90, fill: '#fff' }) + kthin('la tienne est en', CX, 560, t, Ti - .15, { size: 54 }) + kword('DÉSORDRE', CX, 680, t, De - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [.1, 'buzz', .3], [at(10, 'pourquoi') - .05, 'pop', .5], [at(10, 'tienne'), 'hmm', .4], [at(10, 'desordre') - .05, 'boom', .6]] });

// B011 — « À douze ans, elle joue du piano. » : piano à queue, la sœur virtuose auréolée, notes qui s'envolent
B(11, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const A12 = at(11, '12'), Pi = at(11, 'piano'), pl = t > at(11, 'joue');
    return salonF(t) + WASH() + op(.3, path('M540 100L220 1300L860 1300Z', '#fff6c8', 0)) + cmpPianoBack(CX, 1460) +
      sisP({ x: CX, y: 1500, s: 1.2, expr: pl ? 'zen' : 'proud', armL: [60 + (pl ? Math.sin(t * 20) * 10 : 0), 40], armR: [120 + (pl ? Math.sin(t * 20 + 2) * 10 : 0), 140] }, t) + cmpPianoFront(CX, 1460, 1, t, pl) + (pl ? cmpNotes(CX + 250, 900, t, 5) : '') +
      funTag(CX, 430, '12 ANS', t, A12 - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 430, t, A12, 6, 180) + kthin('elle joue du', 400, 600, t, at(11, 'joue') - .15, { size: 56 }) + kword('PIANO', 780, 600, t, Pi - .05, { size: 90, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(11, '12') - .1, 'pop', .7], [at(11, 'joue'), 'magic', .5], [at(11, 'piano') - .05, 'ding', .5], [at(11, 'piano') + .1, 'sparkle', .4]] });

// B012 — « Tu préfères dessiner. » : le héros au bureau, le dragon prend vie sur le carnet
B(12, { enter: 'none', trans: 'circle', transD: .22, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ds = at(12, 'dessiner');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: cmpRoom(t, { messy: 1 }), haze: .2 }]) + heroP({ x: 300, y: 1490, s: 1.3, expr: 'joy', armR: [-10, -30], holdR: cmpPencil(0, -20, 1, 30) }, t) + desk(400, 1330, 1.1) +
      card(760, 920, 340, 260, cmpSketch(0, 0, 1, 0, seg(t, 0, Ds + .2)), t, .02, { ry: 0, thick: 10, r: 6, bw: 6 }) + (t > Ds ? squiggle(760, 1100, 300, t, SX.acc2) : '') +
      kthin('tu préfères', CX, 430, t, 0, { size: 60 }) + kword('DESSINER', CX, 570, t, Ds - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [.05, 'scratch', .5], [at(12, 'dessiner') - .05, 'boom', .4], [at(12, 'dessiner') + .1, 'sparkle', .5]] });

// B013 — « Tu devrais essayer le piano, comme elle. » : maman pousse le piano jusqu'au bureau du héros, flèche vers le portrait de la sœur
B(13, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Dv = at(13, 'devrais'), Pi = at(13, 'piano'), Cm = at(13, 'comme'), px = lerp(1300, 760, eOutCubic(seg(t, Dv, Pi + .2)));
    return salonF(t) + WASH() + cmpPortrait(270, 640, 170, 200, t, { s: .9 }) + markerArrow(420, 470, 300, 560, t, Cm, { bend: -40 }) +
      heroP({ x: 300, y: 1490, s: 1.25, expr: t > Pi ? 'worried' : 'happy', armR: [-10, -30], holdR: cmpPencil(0, -20, 1, 30) }, t) + desk(330, 1330, .9) +
      cmpPianoFront(px, 1460, .75, t) + momP({ x: px + 260, y: 1480, s: 1.05, expr: 'smug', armL: [180, 190], flip: 0 }, t) +
      kthin('tu devrais essayer', CX, 420, t, Dv - .1, { size: 56 }) + kword('LE PIANO', 680, 560, t, Pi - .05, { size: 90, fill: '#fff' }) + funTag(640, 700, 'COMME ELLE', t, Cm - .05, { size: 46, bg: PINK, r: 5 }); },
  sfx: [[0, 'whoosh', .4], [at(13, 'devrais'), 'squeak', .5], [at(13, 'piano') - .05, 'thud', .5], [at(13, 'comme'), 'scratch', .5], [at(13, 'elle'), 'angel', .3]] });

// B014 — « MAIS J'AIME PAS LE PIANO ! » : rayons, le héros explose (vapeur), le piano barré
B(14, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 6 }),
  draw: (t, d, T) => { const Ma = at(14, 'mais'), Pi = at(14, 'piano');
    return rays(t, CX, 950, '#ff6b6b', '#c92f3a', 22) + G(tr(800, 1040, .7, 8), cmpPianoBack(0, 300) + cmpPianoFront(0, 300, 1, t)) + cross(800, 980, 1.4, t, Pi) +
      cutout(heroP({ x: 320, y: 1480, s: 1.3, expr: 'rage', face: { mouth: 'scream', steamHead: 1 }, armL: [-150, -110], armR: [-30, -70] }, t), 12) +
      kword("MAIS J'AIME PAS", CX, 450, t, Ma - .05, { size: 92, fill: '#fff' }) + kword('LE PIANO !', CX, 610, t, Pi - .1, { size: 100, fill: SX.acc2 }) + cmpFlash(t, Pi, .5); },
  sfx: [[0, 'flash_hit', .5], [at(14, 'mais') - .05, 'boom', .7], [at(14, 'aime'), 'growl', .5], [at(14, 'piano') - .1, 'crack', .6], [at(14, 'piano'), 'thud', .6]] });

// B015 — « À quinze ans, tu décroches une bonne note. » : classe, le héros (ado) décroche LITTÉRALEMENT une étoile « 17 » pendue au plafond
B(15, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const A15 = at(15, '15'), Dc = at(15, 'decroches'), No = at(15, 'note'), jump = Math.sin(clamp(seg(t, Dc - .2, Dc + .4)) * Math.PI) * 120, got = t > Dc + .1;
    const star = (x, y) => G(tr(x, y, 1, Math.sin(t * 3) * 6), path('M0 -70L20 -24L70 -20L32 12L44 64L0 36L-44 64L-32 12L-70 -20L-20 -24Z', GOLD, 7) + ftext(0, 22, '17', { size: 44, fill: '#e2463a', stroke: 'none' }));
    return classroomT(t, ftext(540, 640, 'E = mc²', { size: 70, fill: 'rgba(255,255,255,.85)', stroke: 'none' })) + WASH() + kid(1, { x: 900, y: 1300, s: .72, expr: 'wow' }, t) + desk(900, 1220, .62) +
      (got ? '' : line(560, -100, 560, 820, 5) + star(560, 880)) +
      heroP({ x: 430, y: 1490 - jump, s: 1.4, expr: got ? 'ecstatic' : 'effort', armR: [-60, -80], holdR: got ? G(tr(0, -40, .9), star(0, 0)) : '' }, t) +
      funTag(CX, 430, '15 ANS', t, A15 - .1, { size: 80, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 430, t, A15, 6, 180) + kthin('tu décroches', 300, 600, t, Dc - .15, { size: 52 }) + kword('UNE BONNE NOTE', 700, 600, t, No - .2, { size: 54, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(15, '15') - .1, 'pop', .7], [at(15, 'decroches') - .2, 'boing', .5], [at(15, 'decroches') + .1, 'snip', .5], [at(15, 'note'), 'ding', .5]] });

// B016 — « Ta sœur faisait mieux. » : maman sort un cadre doré « 20/20 », la petite étoile du héros se dégonfle
B(16, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(16, 'mieux') ? 4 : 0 }),
  draw: (t, d, T) => { const Fa = at(16, 'faisait'), Mi = at(16, 'mieux'), sag = seg(t, Mi, Mi + .4);
    const frame = G(tr(0, -30, 1, -4), op(.6, glow(0, 0, 220, '#fff3a0', .8)) + rect(-130, -160, 260, 320, '#e8b923', 12, 7) + G(tr(0, 0, .62), cmpCopy('20/20')) + cmpHalo(140, t));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: cmpKitchen(t), haze: .25 }, { z: 1, svg: momP({ x: 760, y: 1480, s: 1.1, expr: 'smugger', armL: [-120, -100], holdL: G(tr(0, 0, .8), frame) }, t) +
      heroP({ x: 270, y: 1490, s: 1.3, expr: t > Mi ? 'sob' : 'happy', armR: [-60 + 100 * sag, -80 + 120 * sag], holdR: G(tr(0, -40, .7 - .3 * sag, 40 * sag), path('M0 -70L20 -24L70 -20L32 12L44 64L0 36L-44 64L-32 12L-70 -20L-20 -24Z', mixC(GOLD, '#9aa3ad', sag), 7)) }, t) }]) +
      kthin('ta sœur faisait', CX, 420, t, 0, { size: 60 }) + kword('MIEUX', CX, 570, t, Mi - .05, { size: 130, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(16, 'faisait'), 'angel', .5], [at(16, 'mieux') - .05, 'boom', .6], [at(16, 'mieux') + .1, 'whoosh', .4]] });

// B017 — « Tu réussis au foot. » : stade, frappe, le filet se gonfle, BUT !
B(17, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .5 }),
  draw: (t, d, T) => { const Re = at(17, 'reussis'), Fo = at(17, 'foot'), k = seg(t, Re, Fo + .1), bx = lerp(420, 930, k), by = lerp(1450, 960, k) - Math.sin(k * 3.14) * 200;
    return cmpField(t, { net: seg(t, Fo, Fo + .2), cheer: t > Fo }) + heroP({ x: 300, y: 1490, s: 1.3, expr: t > Fo ? 'ecstatic' : 'effort', legR: t > Re ? [20, 60] : [85, 90], armL: t > Fo ? [-140, -110] : [150, 120], badge: 'bib' }, t) +
      dBall(bx, by, 1.1, t * 3, '#fff') + (t > Re ? speedLines(t, bx - 120, by - 40, 8, 'rgba(255,255,255,.7)') : '') +
      kthin('tu réussis au', CX, 420, t, 0, { size: 60 }) + kword('FOOT', CX, 560, t, Fo - .05, { size: 120, fill: SX.acc2 }) + (t > Fo ? burst(930, 940, 200, t, Fo, '#fff', 14) : ''); },
  sfx: [[0, 'whoosh', .4], [at(17, 'reussis'), 'thud', .5], [at(17, 'foot') - .05, 'boom', .5], [at(17, 'foot') + .05, 'whistle', .5], [at(17, 'foot') + .1, 'tada', .4]] });

// B018 — « Oui, mais ton frère était capitaine. » : le grand frère géant (brassard C) surgit, le héros rétrécit
B(18, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3, shake: t > at(18, 'capitaine') && t < at(18, 'capitaine') + .3 ? 6 : 0 }),
  draw: (t, d, T) => { const Ou = at(18, 'oui'), Fr = at(18, 'frere'), Ca = at(18, 'capitaine'), ub = eOutBack(seg(t, Fr - .2, Fr + .3));
    return cmpField(t, { cheer: t > Ca }) + op(.4, glow(760, 1000, 500, '#fff3a0', .7)) +
      (ub > 0 ? G(tr(0, (1 - ub) * 700), broP({ x: 760, y: 1500, s: 1.45, expr: 'cool', armL: [-150, -120], armR: [-30, -60] }, t)) : '') +
      heroP({ x: 250, y: 1490, s: 1.25 - .25 * seg(t, Ca, Ca + .4), expr: t > Ca ? 'sad' : t > Ou ? 'worried' : 'ecstatic', badge: 'bib' }, t) +
      kword('OUI, MAIS…', CX, 420, t, Ou - .05, { size: 92, fill: '#fff', op: t > Ca ? .0 : 1 }) + kthin('ton frère était', CX, 420, t, Fr - .05, { size: 56, out: Ca - .1 }) + kword('CAPITAINE', CX, 560, t, Ca - .05, { size: 110, fill: SX.acc2 }) +
      (t > Ca ? popStars(760, 800, t, Ca, 8, 300) : ''); },
  sfx: [[at(18, 'oui'), 'sting', .5], [at(18, 'frere') - .2, 'whoosh_up', .5], [at(18, 'frere') + .1, 'thud', .5], [at(18, 'capitaine') - .05, 'boom', .6], [at(18, 'capitaine') + .1, 'whistle', .4]] });

// B019 — « Et Kevin, lui, obtient 7 sur 20. » : cour, Kevin brandit fièrement son 7/20
B(19, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(19, 'kevin'), Ob = at(19, 'obtient'), N = at(19, '7');
    return schoolyard(t) + WASH() + kidsBg(t, 1150, 3, .45) + kevin({ x: 600, y: 1490, s: 1.35, expr: t > N ? 'smugger' : 'happy', armL: [-140, -110], holdL: G(tr(0, -60, .45, -8), cmpCopy('7/20', '#e2463a', seg(t, N, N + .15))) }, t) +
      heroP({ x: 180, y: 1490, s: 1.1, expr: t > N ? 'confused' : 'neutral', look: [1, 0] }, t) +
      funTag(CX, 420, 'KEVIN', t, K - .1, { size: 70, bg: '#5fb85f' }) + kthin('lui, obtient', CX, 570, t, Ob - .15, { size: 56 }) + kword('7/20', 820, 760, t, N - .05, { size: 110, fill: '#ff5c5c' }); },
  sfx: [[0, 'whoosh', .4], [at(19, 'kevin') - .1, 'pop', .6], [at(19, 'obtient'), 'pop_hi', .4], [at(19, '7') - .05, 'boom', .5], [at(19, '7') + .2, 'rimshot', .4]] });

// B020a — « Ses parents l'emmènent au restaurant » : resto, Kevin couronné entre ses parents
const O20 = at(20, 'pour') - .12;
B(20, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pa = at(20, 'parents'), Re = at(20, 'restaurant');
    const table = G(tr(CX, 1280), rect(-420, -30, 840, 50, '#fff', 10, 6) + rect(-400, 20, 800, 200, '#f4f1ea', 0, 6) + ell(-200, -40, 70, 20, '#fff', 5) + ell(200, -40, 70, 20, '#fff', 5) + rect(-20, -110, 40, 80, '#e2463a', 6, 5) + G(tr(0, -130), path('M0 -20Q12 0 0 10Q-12 0 0 -20Z', '#ffb03a', 3)));
    return restoT(t, { diners: false }) + dadP({ x: 200, y: 1430, s: 1.0, expr: 'joy', armL: [-140, -110] }, t) + adult(3, { x: 880, y: 1430, s: 1.0, expr: 'joy', armR: [-40, -70], flip: 1 }, t) +
      kevin({ x: CX, y: 1440, s: 1.15, expr: 'ecstatic' }, t) + cmpCrown(CX, 1440 - 1.15 * 392 + 10, 1, Math.sin(t * 4) * 6) + table + (t > Re ? confetti(t, Re, 24) : '') +
      kthin("ses parents l'emmènent", CX, 420, t, Pa - .15, { size: 56 }) + funTag(CX, 560, 'AU RESTAURANT', t, Re - .1, { size: 54, bg: TEAL }); },
  sfx: [[0, 'whoosh', .4], [at(20, 'parents'), 'pop_hi', .4], [at(20, 'restaurant') - .1, 'pop', .5], [at(20, 'restaurant'), 'tada', .5]] });
// B020b — « …pour le féliciter de ses efforts. » : le gâteau BRAVO 7/20, bougie « 7 »
B(20, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Fe = at(20, 'feliciter') - O20, Ef = at(20, 'efforts') - O20;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: restoT(t), haze: .3 }]) + cmpCake(640, 1300, 1.4, t) + kevinHead(240, 1000, 150, { expr: 'ecstatic', look: [1, 0] }, t) + cmpCrown(240, 840, 1.1, -8) +
      confetti(t, Fe, 30) + kthin('pour le féliciter', CX, 420, t, Fe - .2, { size: 58 }) + kword('DE SES EFFORTS', CX, 560, t, Ef - .1, { size: 82, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .3], [at(20, 'feliciter') - O20, 'tada', .5], [at(20, 'feliciter') - O20 + .1, 'pop', .5], [at(20, 'efforts') - O20 - .1, 'boom', .5], [at(20, 'efforts') - O20 + .1, 'sparkle', .4]] }, O20);

// B021a — « MOI, J'AI 18 » : rayons, le héros hurle en brandissant son 18/20
const O21 = at(21, 'et') - .12;
B(21, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 6 }),
  draw: (t, d, T) => { const Mo = at(21, 'moi'), N = at(21, '18');
    return rays(t, CX, 950, '#2cc0c0', '#0f7f86', 22) + cutout(heroP({ x: 380, y: 1480, s: 1.35, expr: 'rage', face: { mouth: 'scream' }, armR: [-70, -90], holdR: G(tr(10, -80, .5, 8), cmpCopy('18/20')) }, t), 12) +
      kword('MOI,', CX, 440, t, Mo - .05, { size: 110, fill: '#fff' }) + kword("J'AI 18", CX, 610, t, N - .05, { size: 130, fill: SX.acc2 }) + cmpFlash(t, N, .5); },
  sfx: [[0, 'flash_hit', .5], [at(21, 'moi') - .05, 'boom', .6], [at(21, '18') - .05, 'boom', .6], [at(21, '18'), 'growl', .4]] });
// B021b — « …ET JE DOIS PRÉSENTER DES EXCUSES ? » : à genoux devant maman et la sœur (bras croisés), pancarte PARDON
B(21, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Do = at(21, 'dois') - O21, Ex = at(21, 'excuses') - O21;
    const sign = G(tr(0, -120, 1, -6), line(0, 120, 0, 0, 9, '#8a5a3a') + rect(-110, -70, 220, 100, '#fff', 12, 6) + ftext(0, 0, 'PARDON…', { size: 40, fill: '#3a5bff', stroke: 'none' }));
    return depth({ zoom: 1, x: Math.sin(t) * 6 }, [{ z: 1.4, svg: cmpKitchen(t), haze: .12 },
      { z: 1, svg: momP({ x: 660, y: 1470, s: 1.05, expr: 'deadpan', armL: [30, 170], armR: [150, 10] }, t) + sisP({ x: 900, y: 1480, s: 1.0, expr: 'smugger', armL: [30, 170], armR: [150, 10] }, t) +
        heroP({ x: 270, y: 1530, s: 1.25, expr: 'sob', legL: [150, 90], legR: [30, 90], armR: [-80, -95], holdR: sign }, t) }]) +
      kthin('et je dois présenter', CX, 420, t, Do - .2, { size: 56 }) + kword('DES EXCUSES ?', CX, 560, t, Ex - .2, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(21, 'dois') - O21, 'thud', .5], [at(21, 'presenter') - O21, 'pop', .5], [at(21, 'excuses') - O21 - .2, 'boom', .5], [at(21, 'excuses') - O21 + .2, 'crickets', .3]] }, O21);

// B022 — « Alors tu travailles davantage. » : nuit, pile de livres qui grimpe, horloge qui s'emballe
B(22, { enter: 'none', trans: 'black', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Tr = at(22, 'travailles'), Da = at(22, 'davantage'), n = Math.floor(seg(t, 0, d) * 9) + 2;
    let books = ''; for (let i = 0; i < n; i++) books += rect(780 - 90 + (i % 2) * 14, 1250 - 36 - i * 36, 180, 36, DPAL[i % 8], 6, 5);
    return bedroomN(t) + WASH('rgba(10,10,40,.2)') + dDeskLamp(140, 1250, 1.2, t) + heroP({ x: 420, y: 1490, s: 1.3, expr: 'effort', face: { sweat: 1 }, armR: [-10, -30], holdR: cmpPencil(0, -20, 1, 30 + Math.sin(t * 30) * 20) }, t) + desk(450, 1330, 1.1) +
      books + G(tr(860, 520), rect(-120, -70, 240, 140, '#2b2b33', 20, 6) + ftext(0, 30, counter(20, 3, t, 0, d).toString().padStart(2, '0') + ':' + (Math.floor(t * 300) % 60).toString().padStart(2, '0'), { size: 70, fill: '#ff5c5c', stroke: 'none' })) +
      kthin('alors tu travailles', CX, 420, t, Tr - .2, { size: 58 }) + kword('DAVANTAGE', CX, 640, t, Da - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'clock_fast', .4], [at(22, 'travailles'), 'typing', .5], [at(22, 'travailles') + .3, 'scratch', .4], [at(22, 'davantage') - .05, 'boom', .5]] });

// B023 — « Tu veux enfin entendre : » : gros plan, le héros tend un énorme cornet acoustique vers maman
B(23, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ve = at(23, 'veux'), En = at(23, 'enfin'), Et = at(23, 'entendre'), k = eOutBack(seg(t, Et - .2, Et + .2));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: cmpKitchen(t), haze: .35 }, { z: 1, svg: heroHead(330, 960, 200, { expr: t > Et ? 'wow' : 'worried', look: [1, 0], tilt: -6 }, t) }]) +
      (k > 0 ? cmpTrumpet(520, 960, k, -8) : '') + momHead(1000, 1060, 120, { expr: 'neutral', look: [-1, 0] }, t) +
      kthin('tu veux', CX, 420, t, Ve - .1, { size: 60 }) + kthin('enfin', CX, 510, t, En - .1, { size: 60 }) + kword('ENTENDRE :', CX, 640, t, Et - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[at(23, 'veux'), 'pop_hi', .4], [at(23, 'enfin'), 'hmm', .4], [at(23, 'entendre') - .2, 'boing', .5], [at(23, 'entendre'), 'whoosh_up', .4]] });

// B024 — « On est fiers de toi. » : le RÊVE (flou doré) : maman ouvre les bras, cœurs
B(24, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: (t, d, T) => { const Fi = at(24, 'fiers');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: salonF(t), haze: .3 }]) + op(.55, rect(-M, -M, W + 2 * M, H + 2 * M, '#ffe6a8', 0, 0)) + op(.35, rays(t, CX, 950, '#fff6c8', '#ffd98a', 18)) +
      momP({ x: 720, y: 1480, s: 1.1, expr: 'joy', armL: [-150, -110], armR: [-30, -70] }, t) + heroP({ x: 300, y: 1490, s: 1.25, expr: 'zen', face: { blush: 1 } }, t) + heartsUp(t, 520, 1000, 6) +
      [[120, 300], [960, 360], [100, 900], [990, 980]].map(([x, y], i) => cloud(x, y, .9, '#fff', 0)).join('') +
      kword('ON EST FIERS', CX, 450, t, .02, { size: 96, fill: '#fff' }) + kword('DE TOI', CX, 590, t, Fi + .1, { size: 96, fill: SX.acc2 }) + funTag(820, 760, '(dans tes rêves)', t, Fi + .3, { size: 30, bg: '#fff', fg: SX.ink, r: 6 }); },
  sfx: [[0, 'angel', .5], [.02, 'pop', .4], [at(24, 'fiers'), 'magic', .5], [at(24, 'toi'), 'sparkle', .5]] });

// B025 — « Puis arrive une compétition. » : gymnase, banderole, roulement de tambour, la sœur s'échauffe auréolée
B(25, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ar = at(25, 'arrive'), Co = at(25, 'competition');
    return cmpGym(t) + sisP({ x: 760, y: 1480, s: 1.15, expr: 'cool', armL: [-150, -120 + Math.sin(t * 8) * 20], armR: [-30, -60 - Math.sin(t * 8) * 20] }, t) +
      heroP({ x: 300, y: 1490, s: 1.25, expr: 'worried', badge: 'bib', face: { sweat: 1 } }, t) +
      kthin('puis arrive une', CX, 500, t, Ar - .15, { size: 58 }) + kword('COMPÉTITION', CX, 640, t, Co - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(25, 'arrive'), 'drum', .6], [at(25, 'competition') - .05, 'boom', .5], [at(25, 'competition') + .1, 'whistle', .4]] });

// B026 — « Ta sœur gagne un trophée. » : podium, la sœur en haut, trophée géant, flashs
B(26, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ga = at(26, 'gagne'), Tp = at(26, 'trophee');
    let flashes = ''; for (let i = 0; i < 5; i++) { const ph = (t * 2.3 + i * .37) % 1; if (ph < .12) flashes += op(1 - ph / .12, G(tr([140, 960, 200, 900, 540][i], [820, 760, 1080, 1040, 700][i]), circ(0, 0, 60, '#fff', 0) + impactStar(0, 0, .5))); }
    return cmpGym(t, { cheer: 1 }) + cmpPodium(CX, 1330) + sisP({ x: CX, y: 1030, s: 1.0, expr: 'ecstatic', armR: [-70, -100], holdR: t > Tp - .1 ? G(tr(0, 40, pop(t, Tp - .1, .35)), cmpTrophy(0, 0, .75, t)) : '' }, t) +
      flashes + (t > Ga ? confetti(t, Ga, 30) : '') +
      kthin('ta sœur gagne', CX, 420, t, Ga - .2, { size: 58 }) + kword('UN TROPHÉE', CX, 540, t, Tp - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[at(26, 'gagne'), 'tada', .5], [at(26, 'gagne') + .1, 'shutter', .5], [at(26, 'trophee') - .05, 'boom', .5], [at(26, 'trophee'), 'jackpot', .4]] });

// B027 — « Toi, tu termines deuxième dans ta catégorie. » : marche n°2, médaille d'argent, dans l'OMBRE du trophée
B(27, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const To = at(27, 'toi'), De = at(27, 'deuxieme'), Ca = at(27, 'categorie');
    return cmpGym(t) + cmpPodium(CX, 1330) + op(.3, path('M560 900L330 1130L120 1130L330 900Z', '#000', 0)) +
      sisP({ x: CX, y: 1030, s: 1.0, expr: 'proud', armR: [-70, -100], holdR: G(tr(0, 40), cmpTrophy(0, 0, .75, t)), armL: [150, 140] }, t) +
      heroP({ x: CX - 220, y: 1130, s: 1.0, expr: t > De ? 'sad' : 'neutral', badge: 'bib' }, t) + (t > De ? cmpMedal(CX - 220, 1130 - 150, .7 * pop(t, De, .3), '2') : '') +
      kthin('toi, tu termines', CX, 420, t, To - .1, { size: 58 }) + kword('DEUXIÈME', CX, 550, t, De - .05, { size: 110, fill: '#fff' }) + funTag(800, 690, 'DANS TA CATÉGORIE', t, Ca - .1, { size: 34, bg: TEAL, r: 4 }); },
  sfx: [[0, 'whoosh', .4], [at(27, 'toi'), 'pop_hi', .4], [at(27, 'deuxieme') - .05, 'thud', .6], [at(27, 'deuxieme') + .1, 'ding', .4], [at(27, 'categorie') - .1, 'pop', .4]] });

// B028 — « Tu rentres déçu. » : rue au crépuscule, nuage de pluie perso au-dessus du héros
B(28, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const De = at(28, 'decu'), x = lerp(320, 560, t / d);
    return depth({ zoom: 1, x: -t * 30 }, [{ z: 1.5, svg: streetT(t, 2) + op(.35, rect(-M, -M, W + 2 * M, H + 2 * M, '#3a2a6a', 0, 0)), haze: .05 },
      { z: 1, svg: heroP(Object.assign({ x, y: 1490, s: 1.3, expr: 'sob' }, cmpRun(t, .3, 6), { armR: [80, 90], holdR: cmpMedal(0, 30, .6, '2', '#c9d3dc', 10) }), t) + cmpCloudRain(x, 760, t) }]) +
      kthin('tu rentres', CX, 430, t, 0, { size: 60 }) + kword('DÉÇU', CX, 560, t, De - .05, { size: 130, fill: SX.cool }); },
  sfx: [[0, 'wind', .4], [.1, 'steps', .3], [at(28, 'decu') - .05, 'thunder', .4], [at(28, 'decu') + .1, 'thud', .4]] });

// B029 — « Et ton petit frère te dit : » : salon, le héros effondré sur le canapé, le petit frère accourt
B(29, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pe = at(29, 'petit'), Di = at(29, 'dit'), px = lerp(1150, 760, eOutCubic(seg(t, 0, Pe + .3)));
    return salonF(t) + WASH() + sofa(360, 1500, .95, '#5ec4a0') + heroP({ x: 330, y: 1450, s: 1.2, expr: 'sad', armR: [80, 90], holdR: cmpMedal(0, 30, .6, '2') }, t) +
      petitP(Object.assign({ x: px, y: 1490, s: 1.3, expr: 'joy', flip: 1 }, t < Pe + .3 ? cmpRun(t, 1, 16) : {}), t) +
      kthin('et ton', CX, 420, t, 0, { size: 60 }) + funTag(CX, 560, 'PETIT FRÈRE', t, Pe - .1, { size: 64, bg: SX.acc2, fg: SX.ink, r: -4 }) + kthin('te dit :', CX, 700, t, Di - .1, { size: 58 }); },
  sfx: [[0, 'whoosh', .4], [.05, 'tiptoe', .5], [at(29, 'petit') - .1, 'pop', .6], [at(29, 'dit'), 'pop_hi', .4]] });

// B030 — « Moi, je trouve ça incroyable. » : MOMENT TENDRE — le petit frère brandit la médaille, yeux étoilés, débloqué (2/3)
B(30, { enter: 'none', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Mo = at(30, 'moi'), In = at(30, 'incroyable');
    return salonF(t) + WASH('rgba(255,230,170,.22)') + unlock(700, 1000, t, In, { part: 'back', r: 470 }) + sofa(360, 1500, .95, '#5ec4a0') +
      heroP({ x: 330, y: 1450, s: 1.2, expr: t > In ? 'shock' : 'sad', look: [1, 0] }, t) +
      petitP({ x: 760, y: 1490, s: 1.35, expr: t > In ? 'wow' : 'joy', face: t > In ? { eyes: 'star' } : {}, flip: 1, armL: [-130, -100], holdL: G(tr(0, -30), cmpMedal(0, 0, .9, '2', '#e8eef2')) }, t) +
      unlock(700, 1000, t, In, { part: 'front', r: 470 }) +
      kthin('moi, je trouve ça', CX, 430, t, Mo - .1, { size: 60 }) + kword('INCROYABLE', CX, 580, t, In - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[at(30, 'moi'), 'baby_coo', .3], [at(30, 'trouve'), 'pop_hi', .4], [at(30, 'incroyable') - .05, 'tada', .6], [at(30, 'incroyable'), 'sparkle', .6]] });

// B031 — « Tu le regardes. » : gros plan, les yeux du héros brillent, larme
B(31, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d) }),
  draw: (t, d, T) => { const Re = at(31, 'regardes');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: salonF(t), haze: .4 }]) + op(.2, rect(-M, -M, W + 2 * M, H + 2 * M, '#ffe6a8', 0, 0)) +
      heroHead(CX - 60, 990, 220, { expr: 'sad', face: t > Re ? { tears: 1, brows: 'up' } : {}, look: [1, 0] }, t) + petitHead(930, 1150, 90, { expr: 'joy', look: [-1, 0] }, t) +
      (t > Re ? sparkle(CX - 120, 980, .6 + .2 * Math.sin(t * 20), '#fff') : '') + kthin('tu le regardes.', CX, 440, t, 0, { size: 64 }); },
  sfx: [[0, 'whoosh', .3], [at(31, 'regardes'), 'glint', .5], [at(31, 'regardes') + .1, 'heartbeat', .4]] });

// B032a — « Pour la première fois, » : le projecteur quitte le portrait de la sœur… et se braque sur le héros
const O32 = at(32, 'quelqu') - .12;
B(32, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pr = at(32, 'premiere'), Fo = at(32, 'fois'), k = eInOut(seg(t, Pr - .1, Fo + .1)), sx = lerp(780, 330, k);
    return salonF(t) + WASH('rgba(20,20,50,.45)') + cmpPortrait(780, 700, 200, 230, t, { s: .9 }) + op(.32, path(`M${sx} 80L${sx - 260} 1300L${sx + 260} 1300Z`, '#fff6c8', 0)) + op(.25, ell(sx, 1310, 260, 50, '#fff6c8', 0)) +
      heroP({ x: 330, y: 1490, s: 1.3, expr: k > .9 ? 'wow' : 'sad', look: [k > .9 ? 0 : 1, -1] }, t) +
      kthin('pour la', CX, 420, t, 0, { size: 60 }) + kword('PREMIÈRE FOIS', CX, 560, t, Pr - .05, { size: 92, fill: SX.acc2 }) + (t > Fo ? popStars(330, 1000, t, Fo, 8, 260) : ''); },
  sfx: [[0, 'whoosh', .3], [at(32, 'premiere') - .1, 'whoosh_up', .5], [at(32, 'premiere') - .05, 'boom', .4], [at(32, 'fois') + .1, 'shutter', .5]] });
// B032b — « …quelqu'un s'intéresse à ce que TU as accompli. » : le petit frère accroche le dessin + la médaille du héros sur le frigo
B(32, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Iq = at(32, 'interesse') - O32, Tu = at(32, 'tu') - O32, Ac = at(32, 'accompli') - O32;
    const fridge = cmpFridgeNote(930, 560, -6, fnNote('20/20')) + cmpFridgeNote(1060, 590, 5, fnSis(t), '#5b8fd8') +
      (t > .1 ? G(tr(990, 860, pop(t, .1, .35)), cmpFridgeNote(0, 0, 4, fnDragon(), TEAL, 1.3)) : '') + (t > Tu ? G(tr(1000, 1080, pop(t, Tu, .35)), cmpMedal(0, 0, .8, '2', '#e8eef2', -6)) : '');
    return cmpKitchen(t, { fridge }) + WASH('rgba(255,230,170,.15)') +
      petitP({ x: 760, y: 1490, s: 1.3, expr: 'joy', armR: [-40, -30] }, t) + heroP({ x: 300, y: 1490, s: 1.3, expr: t > Tu ? 'wow' : 'neutral', look: [1, 0] }, t) +
      kthin("quelqu'un s'intéresse", CX, 420, t, Iq - .3, { size: 56 }) + kthin('à ce que', 330, 560, t, Tu - .3, { size: 54 }) + kword('TU', 590, 560, t, Tu - .05, { size: 150, fill: SX.acc2 }) + kthin('as accompli', CX, 700, t, Ac - .15, { size: 58 }) + (t > Tu ? popStars(590, 560, t, Tu, 8, 220) : ''); },
  sfx: [[.1, 'pop', .5], [at(32, 'interesse') - O32, 'pop_hi', .4], [at(32, 'tu') - O32 - .05, 'boom', .5], [at(32, 'tu') - O32, 'pop', .5], [at(32, 'accompli') - O32, 'sparkle', .5]] }, O32);

// B033 — « Pas à ce que ta sœur aurait fait. » : la bulle « sœur auréolée » se fait barrer, les papiers 20/20 tombent du frigo
B(33, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pa = at(33, 'pas'), Au = at(33, 'aurait'), fall = seg(t, Pa, Pa + .6);
    const fridge = G(tr(0, fall * 900, 1), cmpFridgeNote(930, 560, -6 + fall * 90, fnNote('20/20')) + cmpFridgeNote(1060, 590, 5 - fall * 80, fnSis(t), '#5b8fd8')) +
      G(tr(990, 860), cmpFridgeNote(0, 0, 4, fnDragon(), TEAL, 1.3)) + G(tr(1000, 1080), cmpMedal(0, 0, .8, '2', '#e8eef2', -6));
    return cmpKitchen(t, { fridge }) + WASH('rgba(255,230,170,.15)') + G(tr(340, 840), cloud(0, 0, 1.7, '#fff', 7) + sisHead(0, 20, 70, { expr: 'smugger' }, t)) + cross(340, 860, 1.1, t, Au) +
      heroP({ x: 640, y: 1490, s: 1.3, expr: 'happy', look: [-1, -1] }, t) +
      kthin('pas à ce que', CX, 420, t, Pa - .1, { size: 58 }) + kword('TA SŒUR AURAIT FAIT', CX, 560, t, Au - .2, { size: 64, fill: '#fff' }); },
  sfx: [[at(33, 'pas'), 'whoosh', .4], [at(33, 'pas') + .3, 'thud', .3], [at(33, 'aurait') - .2, 'pop', .4], [at(33, 'aurait'), 'buzz', .4], [at(33, 'fait'), 'scratch', .4]] });

// B034 — « Et tu comprends quelque chose. » : gros plan, l'ampoule s'allume
B(34, { enter: 'none', trans: 'up', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: (t, d, T) => { const Co = at(34, 'comprends'), Qc = at(34, 'quelque');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: cmpKitchen(t), haze: .4 }]) + heroHead(CX, 1000, 210, { expr: t > Co ? 'wow' : 'neutral' }, t) +
      (t > Co ? cmpBulb(830, 760, pop(t, Co, .35), 1, t) : '') + kthin('et tu comprends', CX, 420, t, Co - .2, { size: 60 }) + kword('QUELQUE CHOSE', CX, 560, t, Qc - .05, { size: 86, fill: SX.acc2 }); },
  sfx: [[at(34, 'comprends'), 'ding', .6], [at(34, 'comprends') + .05, 'zap', .3], [at(34, 'quelque') - .05, 'boom', .4], [at(34, 'chose'), 'sparkle', .4]] });

// B035a — « LE PIRE, » : grille sombre, le héros en cut-out, slam
const O35 = at(35, 'ce') - .12;
B(35, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 5 }),
  draw: (t, d, T) => gridBg('#0b3b40', 'rgba(255,255,255,.07)') + halftoneFade('#fff', .05, 1) + burst(CX, 1000, 300, t, .05, SX.acc, 16) +
    cutout(heroP({ x: CX, y: 1470, s: 1.3, expr: 'shock' }, t), 12) + kword('LE PIRE,', CX, 520, t, at(35, 'pire') - .1, { size: 150, fill: '#fff' }) + cmpFlash(t, at(35, 'pire'), .5),
  sfx: [[0, 'flash_hit', .5], [at(35, 'pire') - .1, 'boom', .7], [at(35, 'pire'), 'sting', .5]] });
// B035b — « …ce n'est pas d'avoir un frère ou une sœur plus fort que toi. » : toise : la sœur et le grand frère, géants ; le héros, petit… ça, ça va
B(35, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Fr = at(35, 'frere') - O35, Un = at(35, 'une') - O35, Pl = at(35, 'plus') - O35;
    return hallway(t) + WASH() + cmpToise(540, 1250, 560) +
      (t > Fr - .1 ? G(tr(0, (1 - eOutBack(seg(t, Fr - .1, Fr + .2))) * 600), broP({ x: 860, y: 1490, s: 1.2, expr: 'cool', armL: [-150, -120], armR: [-30, -60] }, t)) : '') +
      (t > Un - .1 ? G(tr(0, (1 - eOutBack(seg(t, Un - .1, Un + .2))) * 600), sisP({ x: 640, y: 1490, s: 1.2, expr: 'smugger' }, t)) : '') +
      heroP({ x: 260, y: 1490, s: 1.15, expr: t > Pl ? 'chill' : 'neutral', look: [1, -1] }, t) +
      kthin("ce n'est pas d'avoir", CX, 400, t, 0, { size: 56 }) + kthin('un frère ou une sœur', CX, 490, t, Fr - .1, { size: 56 }) + kword('PLUS FORT QUE TOI', CX, 610, t, Pl - .05, { size: 72, fill: SX.acc2 }) +
      (t > Pl ? funTag(260, 900, 'ÇA, ÇA VA', t, Pl + .3, { size: 36, bg: '#7be07b', fg: SX.ink, r: -6 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(35, 'frere') - O35 - .1, 'whoosh_up', .4], [at(35, 'une') - O35, 'thud', .5], [at(35, 'plus') - O35 - .05, 'boom', .5], [at(35, 'toi') - O35, 'pop', .4]] }, O35);

// B036a — « C'EST DE DEVOIR LUI RESSEMBLER » : le héros déguisé en sa sœur (perruque blonde de travers, auréole scotchée)
const O36 = at(36, 'pour') - .12;
B(36, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t < .3 ? 5 : 0, hand: .3 }),
  draw: (t, d, T) => { const De = at(36, 'devoir'), Re = at(36, 'ressembler');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: cmpRoom(t, { messy: 1 }), haze: .15 }]) + cmpPortrait(820, 760, 180, 210, t, { s: .9 }) + (t > Re ? markerArrow(700, 820, 520, 900, t, Re, { bend: 40 }) : '') +
      heroP({ x: 360, y: 1490, s: 1.35, expr: 'embarrassed', hairFn: cmpCostHair, shirt: PINK, armL: [-120, -60] }, t) +
      kthin("c'est de devoir", CX, 420, t, De - .2, { size: 60 }) + kword('LUI RESSEMBLER', CX, 570, t, Re - .05, { size: 90, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .4], [at(36, 'devoir') - .1, 'boom', .5], [at(36, 'ressembler') - .05, 'boom', .5], [at(36, 'ressembler') + .1, 'squeak', .5], [at(36, 'ressembler') + .3, 'rimshot', .3]] });
// B036b — FIN « POUR QU'ON REMARQUE QUI TU ES. » : il jette la perruque, l'étoile remplace le « 2 », débloqué (3/3), le petit frère applaudit
B(36, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Rm = at(36, 'remarque') - O36, Qu = at(36, 'qui') - O36, wig = seg(t, 0, .6);
    return salonF(t) + WASH('rgba(255,230,170,.2)') + unlock(CX, 1000, t, Qu, { part: 'back', r: 480 }) +
      G(tr(lerp(470, 1200, wig), lerp(860, 300, wig) + wig * wig * 400, 1, wig * 600), hairSvg('ponytail', '#e0a040', 90, t)[1] + cmpHalo(90, t, { tape: 1 })) +
      petitP({ x: 860, y: 1490, s: 1.25, expr: 'ecstatic', flip: 1, armL: [-120 + Math.sin(t * 16) * 25, -80], armR: [-60 - Math.sin(t * 16) * 25, -100] }, t) +
      momP({ x: 150, y: 1480, s: 1.0, expr: t > Qu ? 'wow' : 'neutral', look: [1, 0] }, t) +
      heroP({ x: CX - 40, y: 1490, s: 1.35, expr: t > Qu ? 'proud' : 'happy', badge: t > Qu ? 'star' : undefined, armL: t > Qu ? [-140, -110] : [110, 100] }, t) +
      unlock(CX, 1000, t, Qu, { part: 'front', r: 480 }) +
      kthin("pour qu'on remarque", CX, 420, t, Rm - .3, { size: 62 }) + kword('QUI TU ES.', CX, 570, t, Qu - .05, { size: 130, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .5], [.1, 'boing', .4], [at(36, 'remarque') - O36, 'pop_hi', .4], [at(36, 'qui') - O36 - .05, 'tada', .6], [at(36, 'qui') - O36, 'sparkle', .6], [at(36, 'qui') - O36 + .6, 'baby_coo', .3]] }, O36);

SCENES.sort((a, b) => a.s - b.s);
