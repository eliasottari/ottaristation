// ============================================================
//  Dents / appareil dentaire : grosse bouche en gros plan, dent-personnage, fauteuil de dentiste,
//  outils d'orthodontiste, nourriture piège, élastiques, meuble en kit, gouttière de contention, prison.
// ============================================================

// GROS PLAN BOUCHE (centrée 0,0, largeur ~ 760*s). o = {braces, salad, elastics, open (0..1), tight (0..1), shine, gap}
function bigMouth(x, y, s, t, o = {}) {
  const op_ = o.open ?? .45, n = 6, tw = 104, gy = 150 * op_;
  let g = path(`M-400 -40Q-300 -150 0 -130Q300 -150 400 -40Q300 ${120 + gy * 1.6} 0 ${130 + gy * 1.7}Q-300 ${120 + gy * 1.6} -400 -40Z`, '#e98a8a', SW);
  g += path(`M-360 -30Q0 -100 360 -30Q300 ${100 + gy * 1.5} 0 ${110 + gy * 1.6}Q-300 ${100 + gy * 1.5} -360 -30Z`, '#6b1f24', 0);
  g += ell(0, 70 + gy * 1.2, 150, 40 + gy * .3, '#ff8a9a', 0);
  const sq = 1 - (o.tight || 0) * .12 * (1 + .3 * Math.sin(t * 40));
  // dents du haut
  for (let i = 0; i < n; i++) { const tx = (i - (n - 1) / 2) * tw * sq, cy = -60 + Math.abs(i - (n - 1) / 2) * 10;
    g += rect(tx - tw / 2 + 4, cy - 30, tw - 8, 112 - Math.abs(i - (n - 1) / 2) * 8, '#fffdf6', 22, 5); }
  // dents du bas
  for (let i = 0; i < n; i++) { const tx = (i - (n - 1) / 2) * tw * .92 * sq, cy = 40 + gy - Math.abs(i - (n - 1) / 2) * 6;
    g += rect(tx - tw / 2 + 8, cy, tw - 16, 80 - Math.abs(i - (n - 1) / 2) * 6, '#fffdf6', 20, 5); }
  if (o.braces) {
    const wy = 0;
    g += path(`M${-290 * sq} ${wy + 14}Q0 ${wy - 14} ${290 * sq} ${wy + 14}`, 'none', 9, '#59616c') + path(`M${-290 * sq} ${wy + 12}Q0 ${wy - 16} ${290 * sq} ${wy + 12}`, 'none', 4, '#dfe6ee');
    g += path(`M${-250 * sq} ${wy + 90 + gy}Q0 ${wy + 110 + gy} ${250 * sq} ${wy + 90 + gy}`, 'none', 8, '#59616c');
    for (let i = 0; i < n; i++) { const tx = (i - (n - 1) / 2) * tw * sq, cy = -14 + Math.abs(i - (n - 1) / 2) * 6 - (Math.abs(i - (n - 1) / 2) < 1 ? 6 : 0);
      g += rect(tx - 24, cy, 48, 40, '#c9d1db', 8, 5, '#59616c') + line(tx - 12, cy + 10, tx + 12, cy + 10, 3, '#fff'); }
    for (let i = 0; i < n; i++) { const tx = (i - (n - 1) / 2) * tw * .92 * sq;
      g += rect(tx - 20, 72 + gy, 40, 34, '#c9d1db', 8, 5, '#59616c'); }
    if (o.shine) g += sparkle(-120, -10, .5 + .2 * Math.sin(t * 9), '#fff') + sparkle(160, 20, .35 + .2 * Math.cos(t * 7), '#fff');
  } else if (o.shine) g += sparkle(-80, -30, .7 + .25 * Math.sin(t * 8), '#fff') + sparkle(150, -10, .45 + .2 * Math.cos(t * 6), '#fff') + sparkle(20, 100 + gy, .4, '#fff');
  if (o.elastics) for (const sd of [-1, 1]) { const k = o.elastics, stretch = 1 + .15 * Math.sin(t * 12);
    g += line(sd * 230, 10, sd * 210, 80 + gy * stretch * k + 20, 10, '#ff5d8f') + circ(sd * 230, 10, 10, '#ff5d8f', 3) + circ(sd * 210, 100 + gy * stretch * k, 10, '#ff5d8f', 3); }
  if (o.salad) g += G(tr(-60, -10, 1.25, -12 + 6 * Math.sin(t * 3)), path('M-90 10Q-110 -40 -70 -60Q-60 -100 -20 -90Q0 -120 40 -95Q80 -110 90 -60Q120 -40 100 0Q120 40 80 60Q70 100 30 85Q0 110 -30 85Q-70 100 -80 55Q-120 40 -90 10Z', '#8fe06a', 6, '#2f7a2a') + path('M-60 40Q0 0 70 -50M-20 15L-40 -40M20 -10L10 -70M30 -15L80 0M-10 20L20 60', 'none', 5, '#3f9a35') + ell(-30, -40, 18, 10, 'rgba(255,255,255,.4)', 0));
  // lèvres (bord)
  g += path(`M-400 -40Q-300 -150 0 -130Q300 -150 400 -40`, 'none', 22, '#e46a6a') + path(`M-400 -40Q-300 ${120 + gy * 1.6} 0 ${130 + gy * 1.7}Q300 ${120 + gy * 1.6} 400 -40`, 'none', 26, '#e46a6a');
  g += path(`M-400 -40Q-300 -150 0 -130Q300 -150 400 -40Q300 ${120 + gy * 1.6} 0 ${130 + gy * 1.7}Q-300 ${120 + gy * 1.6} -400 -40Z`, 'none', SW);
  return G(tr(x, y, s, o.r || 0), g);
}

// dent-personnage (pour la douleur, la victoire…)
function toothChar(x, y, s, t, o = {}) {
  let g = path('M-90 -110Q-100 -150 -50 -150Q0 -140 50 -150Q100 -150 90 -110L80 40Q75 140 40 150Q20 90 0 90Q-20 90 -40 150Q-75 140 -80 40Z', o.col || '#fffdf6');
  g += G(tr(0, -40), head({ hr: 70, hair: 'none', skin: 'none', cheeks: true, expr: o.expr || 'happy', seed: 6 }, t).replace(/<circle cx="0" cy="0" r="70"[^>]*\/>/, ''));
  if (o.braces) g += line(-88, 30, 88, 30, 8, '#59616c') + rect(-28, 14, 56, 34, '#c9d1db', 8, 5, '#59616c');
  if (o.crack) g += path('M20 -150L0 -100L30 -60L5 -20', 'none', 6);
  return G(tr(x, y, s, o.r || 0), g);
}

// fauteuil de dentiste + lampe
function dentalChair(x, y, s = 1, lamp = 1, t = 0) {
  let g = rect(-40, 40, 80, 160, '#9aa3ad', 10) + rect(-180, 190, 360, 40, '#7d848c', 14);
  g += path('M-260 0L200 0Q250 0 250 40L250 60L-280 60Q-300 60 -300 30Z', '#5ec4c4');
  g += path('M180 0L320 -360Q330 -400 290 -410L250 -410Q230 -400 230 -370L130 0Z', '#5ec4c4');
  if (lamp) g += line(-200, -620, -60, -520, 14, '#7d848c') + G(tr(-60, -520, 1, 20), ell(0, 0, 110, 60, '#e8eef2') + ell(0, 30, 80, 26, '#fffbe0', 4)) + `<path d="M-120 -480L120 -480L300 40L-300 40Z" fill="rgba(255,250,200,${(.22 + .05 * Math.sin(t * 3)).toFixed(2)})"/>`;
  return G(tr(x, y, s), g);
}

// clé de serrage / pince d'orthodontiste
function orthoKey(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-16, -150, 32, 220, '#c9d1db', 10, 5, '#59616c') + circ(0, -160, 46, '#c9d1db', 6, '#59616c') + circ(0, -160, 20, '#fff', 4) + rect(-30, 70, 60, 110, '#4d7cf0', 16)); }
function pliers(x, y, s, r = 0, open = .2) { return G(tr(x, y, s, r), G(`rotate(${-open * 20})`, path('M0 0L-30 -170L-10 -180L14 0Z', '#c9d1db', 5, '#59616c') + rect(-20, 0, 34, 200, '#e2463a', 14, 5)) + G(`rotate(${open * 20})`, path('M0 0L30 -170L10 -180L-14 0Z', '#c9d1db', 5, '#59616c') + rect(-14, 0, 34, 200, '#e2463a', 14, 5)) + circ(0, 0, 16, '#9aa3ad', 5)); }

// nourriture
function baguette(x, y, s, r = 0, bite = 0) { let g = path('M-300 -30Q-320 0 -300 30L300 40Q330 0 300 -40Z', '#e0a050') + [-200, -80, 40, 160].map(a => path(`M${a} -20Q${a + 40} -40 ${a + 70} -10`, 'none', 6, '#b8762e')).join('');
  if (bite) g += circ(300, 0, 46 * bite, '#ffe6c8', 0) + path(`M${300 - 46 * bite} 0A${46 * bite} ${46 * bite} 0 0 1 300 ${-46 * bite}`, 'none', 0);
  return G(tr(x, y, s, r), g); }
function pureeBowl(x, y, s, t) { return G(tr(x, y, s), path('M-170 -10L170 -10Q150 120 0 120Q-150 120 -170 -10Z', '#7aa6d8') + path('M-150 -10Q-120 -80 -40 -60Q0 -110 60 -70Q130 -80 150 -10Z', '#ffe9a0') + steam(-40, -110, t, .6) + steam(50, -120, t + .4, .6)); }
function caramel(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M-110 -30L-160 -70L-150 0L-160 70L-110 30Z', '#e8a0b4') + path('M110 -30L160 -70L150 0L160 70L110 30Z', '#e8a0b4') + rect(-115, -60, 230, 120, '#c87a2a', 30) + line(-70, -30, 70, 30, 6, 'rgba(255,255,255,.4)')); }
function popcorn(x, y, s, t) { let g = ''; const rr = rng(5); for (let i = 0; i < 14; i++) g += circ(-110 + rr() * 220, -150 + rr() * 90 + Math.sin(t * 6 + i) * 4, 34 + rr() * 10, '#fff8dc', 5);
  return G(tr(x, y, s), g + path('M-140 -110L140 -110L110 160L-110 160Z', '#fff') + [-90, -30, 30, 90].map((a, i) => path(`M${a - 15} -110L${a + 15} -110L${a * .8 + 12} 160L${a * .8 - 12} 160Z`, '#e2463a', 0)).join('') + path('M-140 -110L140 -110L110 160L-110 160Z', 'none')); }
function apple(x, y, s, r = 0, bite = 0) { let g = path('M0 -90C-60 -130 -150 -90 -140 10C-130 110 -60 150 0 120C60 150 130 110 140 10C150 -90 60 -130 0 -90Z', '#e2463a') + line(0, -90, 10, -140, 10, '#6b4a2a') + path('M10 -120Q60 -160 90 -120Q50 -100 10 -120Z', '#5fd068', 5) + ell(-70, -30, 18, 34, 'rgba(255,255,255,.4)', 0);
  if (bite) g += circ(130, -10, 60 * bite, '#ffe6c8', 5) + circ(110, 50, 50 * bite, '#ffe6c8', 5);
  return G(tr(x, y, s, r), g); }
function bomb(x, y, s, t, lit = 1) { return G(tr(x, y, s), circ(0, 0, 110, '#2b2b33') + rect(-30, -140, 60, 40, '#555', 8) + path('M0 -140Q30 -200 80 -190', 'none', 8, '#8a6a3a') + (lit ? sparkle(84, -192, .6 + .3 * Math.sin(t * 30), '#ffb340') : '') + ell(-40, -40, 22, 34, 'rgba(255,255,255,.25)', 0)); }
function wireCutter(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M-10 0L-40 -120L-10 -130L10 0Z', '#c9d1db', 5) + path('M10 0L40 -120L10 -130L-10 0Z', '#c9d1db', 5) + rect(-34, 0, 28, 170, '#ffd23f', 12, 5) + rect(6, 0, 28, 170, '#ffd23f', 12, 5)); }
// vacances de l'orthodontiste : avion + palmier + cocktail
function palm(x, y, s, t) { return G(tr(x, y, s), path('M-10 0Q-30 -200 10 -400L40 -400Q10 -200 30 0Z', '#b8862e') + [0, 60, 130, 200, 260].map(a => G(`translate(25 -400) rotate(${a + wave(t, .5, 6)})`, path('M0 0Q90 -60 200 0Q90 -20 0 0Z', '#5fd068', 5))).join('') + circ(10, -390, 18, '#7a5a2a', 4) + circ(40, -380, 18, '#7a5a2a', 4)); }
function plane(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M-200 -20Q-220 0 -200 20L180 30Q240 0 180 -30Z', '#fff') + path('M-20 -20L-90 -150L-40 -150L60 -20Z', '#4d7cf0') + path('M-20 20L-90 150L-40 150L60 20Z', '#4d7cf0') + path('M-180 -20L-230 -90L-190 -90L-140 -20Z', '#4d7cf0') + [0, 50, 100, 150].map(a => circ(a - 60, -4, 10, '#bfe3f5', 3)).join('')); }

// élastique orthodontique (anneau)
function elasticRing(x, y, s, r = 0, stretch = 1) { return G(tr(x, y, s, r), ell(0, 0, 50 * stretch, 50 / Math.sqrt(stretch), 'none', 18, OL) + ell(0, 0, 50 * stretch, 50 / Math.sqrt(stretch), 'none', 10, '#ff5d8f')); }
// carton de meuble en kit + clé Allen + notice
function flatBox(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-220, -150, 440, 300, '#c9a06a', 12) + rect(-140, -60, 280, 70, '#4d7cf0', 8, 0) + text(0, -6, 'none', 'BÖKKS', '#ffd23f', 52) + path('M-200 100L-120 60L-40 100', 'none', 5) + circ(150, 90, 24, 'none', 5)); }
function allenKey(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M0 0L0 -160L70 -160', 'none', 26, OL) + path('M0 0L0 -160L70 -160', 'none', 14, '#9aa3ad')); }
function notice(x, y, s, r = 0, t = 0) { return G(tr(x, y, s, r), rect(-150, -200, 300, 400, '#fff', 10) + G(tr(-60, -110), head({ hr: 34, hair: 'none', expr: 'neutral' }, t)) + path('M30 -140L110 -140M30 -100L90 -100', 'none', 5, '#bbb') + path('M-110 20L110 20L80 120L-80 120Z', '#c9a06a', 5) + text(0, 180, 'none', '1/48', '#999', 30)); }

// boîte de la gouttière + gouttière transparente
function retainerBox(x, y, s, t, open = 0) { return G(tr(x, y, s), path('M-170 0L170 0Q170 110 0 110Q-170 110 -170 0Z', '#5ec4f0') + (open > 0 ? retainer(0, -20, .7 * open, t) : '') + G(`translate(0 0) rotate(${-110 * open} -170 0)`, path('M-170 0Q-170 -110 0 -110Q170 -110 170 0Z', '#7fd3f7'))); }
function retainer(x, y, s, t) { let g = path('M-160 40Q-170 -120 0 -130Q170 -120 160 40L110 40Q120 -70 0 -80Q-120 -70 -110 40Z', 'rgba(220,240,255,.85)', 6);
  for (let i = 0; i < 6; i++) { const a = R(200 + i * 28); g += circ(Math.cos(a) * 130, Math.sin(a) * 100 + 10, 14, 'rgba(255,255,255,.9)', 3); }
  return G(tr(x, y, s), g + line(-100, -60, 100, -60, 6, '#9aa3ad') + sparkle(80, -110, .4 + .2 * Math.sin(t * 8), '#fff')); }
// barreaux de prison + bracelet électronique
function prisonBars(k = 1, col = '#59616c') { let s = ''; for (let i = 0; i < 7; i++) { const x = 70 + i * 160; s += rect(x - 18, -200, 36, (H + 400) * k, col, 18, SW); } return s + rect(-100, 380 - 60, W + 200, 50, col, 10) ; }
function ankleMonitor(x, y, s, t) { return G(tr(x, y, s), rect(-90, -50, 180, 100, '#2b2b33', 20) + rect(-150, -18, 300, 36, '#3a3f4a', 16) + circ(40, 0, 14, Math.sin(t * 6) > 0 ? '#ff3b30' : '#5a1a1a', 4) + rect(-60, -20, 60, 36, '#5fd068', 6, 3)); }
