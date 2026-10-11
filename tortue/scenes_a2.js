// ============================================================
//  B013–B058 (V2 « ciné ») : flashback de l'œuf, éclosion, course vers la mer, l'aigle, la vague
//  helpers préfixés a2_
// ============================================================

// ŒUF EXPRESSIF (l'héroïne avant l'éclosion) : eyes dot|huge|happy|half|closed|star|heart|x|shades, mouth smile|grin|o|flat|wail|jaw|wavy|teeth
function a2_eggF(x, y, s, t, o = {}) {
  const tj = o.tremble ? [Math.sin(t * 61) * 4 * o.tremble, Math.cos(t * 57) * 3 * o.tremble] : [0, 0];
  let e = ell(0, 0, 52, 56, o.col || '#fbf6ea') + ell(-18, -22, 10, 14, 'rgba(255,255,255,.9)', 0);
  if (o.crack) e += path('M-50 -4l16 -12l12 14l14 -16l14 12l12 -10l12 10', 'none', 5);
  const lk = o.look || [0, 0], lx = lk[0] * 7, ly = lk[1] * 6, E = o.eyes || 'dot', M = o.mouth || 'smile';
  const bl = (o.blink ?? 1) && ((t * .7 + (o.seed || 0) * .37) % 3) < .08;
  for (const sd of [-1, 1]) {
    const ex = sd * 17 + lx, ey = 2 + ly;
    if (bl && (E === 'dot' || E === 'huge')) e += line(ex - 6, ey, ex + 6, ey, 4);
    else if (E === 'dot') e += circ(ex, ey, 5.5, OL, 0) + circ(ex + 2, ey - 2, 1.8, '#fff', 0);
    else if (E === 'huge') e += circ(ex, ey, 15, '#fff', 4) + circ(ex + Math.sin(t * 40) * 1.5, ey + 1, 5, OL, 0);
    else if (E === 'happy') e += path(`M${ex - 7} ${ey + 3}Q${ex} ${ey - 8} ${ex + 7} ${ey + 3}`, 'none', 4);
    else if (E === 'half') e += line(ex - 8, ey - 2, ex + 8, ey - 2, 4) + circ(ex, ey + 2, 3.5, OL, 0);
    else if (E === 'closed') e += path(`M${ex - 7} ${ey}Q${ex} ${ey + 6} ${ex + 7} ${ey}`, 'none', 4);
    else if (E === 'sad') e += path(`M${ex - 7} ${ey - 2}Q${ex} ${ey + 5} ${ex + 7} ${ey - 2}`, 'none', 4);
    else if (E === 'star') e += sparkle(ex, ey, .32, '#ffd23f');
    else if (E === 'heart') e += heart(ex, ey + 3, .26);
    else if (E === 'x') e += path(`M${ex - 6} ${ey - 6}l12 12M${ex + 6} ${ey - 6}l-12 12`, 'none', 4);
    else if (E === 'spiral') e += path(`M${ex} ${ey}m-2 0a2 2 0 1 1 4 0a5 5 0 1 1 -9 0a8 8 0 1 1 15 0`, 'none', 3);
  }
  if (E === 'shades') e += path('M-36 -6L36 -6L32 8Q20 16 6 6L-6 6Q-20 16 -32 8Z', OL, 0) + line(-26, -2, -18, -2, 3, 'rgba(255,255,255,.6)');
  if (o.brows === 'sad') e += line(-26, -10, -10, -16, 4) + line(26, -10, 10, -16, 4);
  if (o.brows === 'angry') e += line(-26, -16, -10, -9, 4) + line(26, -16, 10, -9, 4);
  if (o.brows === 'up') e += path('M-26 -16q8 -6 16 0M10 -16q8 -6 16 0', 'none', 4);
  const my = 24;
  if (M === 'smile') e += path(`M-8 ${my - 3}Q0 ${my + 5} 8 ${my - 3}`, 'none', 4);
  else if (M === 'grin') e += path(`M-11 ${my - 5}Q0 ${my + 12} 11 ${my - 5}Z`, '#7a2b2b', 4);
  else if (M === 'o') e += ell(0, my, 5, 7, '#7a2b2b', 3);
  else if (M === 'flat') e += line(-7, my, 7, my, 4);
  else if (M === 'wail') e += path(`M-11 ${my + 6}Q0 ${my - 12} 11 ${my + 6}Z`, '#7a2b2b', 4);
  else if (M === 'jaw') e += ell(0, my + 10, 10, 20, '#7a2b2b', 4) + ell(0, my + 22, 6, 6, '#ff8a9a', 0);
  else if (M === 'wavy') e += path(`M-11 ${my}q5 -5 11 0t11 0`, 'none', 4);
  else if (M === 'teeth') e += rect(-12, my - 6, 24, 12, '#fff', 3, 4) + line(-12, my, 12, my, 2);
  else if (M === 'scream') e += ell(0, my + 4, 12, 14, '#7a2b2b', 4);
  if (o.cheeks !== false) e += ell(-32, 14, 8 * (o.blush ? 1.6 : 1), 4.5 * (o.blush ? 1.6 : 1), CHEEK, 0) + ell(32, 14, 8 * (o.blush ? 1.6 : 1), 4.5 * (o.blush ? 1.6 : 1), CHEEK, 0);
  if (o.sweat) e += sweat(46, -30 + (t * 30 % 14), .38);
  if (o.spray) for (let i = 0; i < 6; i++) { const k = (t * 2.2 + i / 6) % 1, sd = i % 2 ? 1 : -1; e += op(1 - k, sweat(sd * (40 + 70 * k), -40 - 40 * k + 140 * k * k, .3)); }
  if (o.tears) for (const sd of [-1, 1]) for (let i = 0; i < 5; i++) { const k = (t * 2.5 + i / 5) % 1; e += circ(sd * (20 + 80 * k), 2 - 40 * k + 110 * k * k, 4, '#8fd0ff', 2, '#5aaee0'); }
  if (o.scarf) e += path('M-50 26Q0 46 50 26L48 42Q0 62 -48 42Z', '#ff6b6b', 4) + path('M30 40l8 30l14 -4l-6 -28', '#ff6b6b', 4);
  if (o.bow) e += bow(-28, -46, .42, -25);
  return G(tr(x + tj[0], y + tj[1], s, o.r || 0) + (o.sq ? ` scale(${1 + o.sq * .2} ${1 - o.sq * .2})` : ''), e);
}
// coupe du sable avec grandes marges (pour depth / caméra)
function a2_cut(t, o = {}) {
  const sy = o.sy ?? 180, M = 800, n = o.night;
  let s = o.noSky ? '' : grad(n ? '#152246' : '#9fdcff', n ? '#3a4682' : '#e3f5ff', -M, -M, W + 2 * M, sy + M + 40);
  if (n) { const r = rng(9); for (let i = 0; i < 50; i++) s += circ(-300 + r() * (W + 600), -M + r() * (sy + M - 20), 2 + r() * 2, `rgba(255,255,240,${(.4 + .5 * Math.abs(Math.sin(t + i))).toFixed(2)})`, 0); }
  s += grad(n ? '#cdb184' : '#e9c98d', n ? '#8a6a44' : '#b98d55', -M, sy, W + 2 * M, H - sy + M);
  for (let i = 1; i < 6; i++) s += path(`M${-M} ${sy + i * 170}` + Array.from({ length: 18 }, (_, k) => `q100 ${k % 2 ? 22 : -22} 200 0`).join(''), 'none', 5, 'rgba(120,80,40,.15)');
  const r = rng(o.seed || 4);
  for (let i = 0; i < 46; i++) s += ell(-400 + r() * (W + 800), sy + 40 + r() * (H - sy + 300), 5 + r() * 14, 4 + r() * 8, ['#c9a26a', '#d8b47a', '#a98758'][i % 3], 0);
  return s + line(-M, sy, W + M, sy, 8, '#c49a5c');
}
// plage de nuit en pièces (marges larges) {sky, sea, sand}
function a2_night(t, o = {}) {
  const hz = o.hz ?? 430, sy = o.sy ?? 640, M = 900, mx = o.moonX ?? 1500, my = o.moonY ?? 160;
  let sky = grad('#152246', '#3d4c8c', -M, -M, W + 2 * M, hz + M + 100); const r = rng(8);
  for (let i = 0; i < 90; i++) sky += circ(-500 + r() * (W + 1000), -M + r() * (hz + M - 30), 1.5 + r() * 2.5, `rgba(255,255,240,${(.4 + .5 * Math.abs(Math.sin(t * .7 + i))).toFixed(2)})`, 0);
  sky += glow(mx, my, 260, '#fff6d6', .35) + circ(mx, my, 62, '#fff6d6', 0) + circ(mx - 18, my - 10, 12, 'rgba(0,0,0,.06)', 0);
  let sea = grad('#1d3f6e', '#0f2448', -M, hz, W + 2 * M, sy - hz + 80) + `<path d="M${mx - 40} ${hz}L${mx + 40} ${hz}L${mx + 180} ${sy}L${mx - 180} ${sy}Z" fill="rgba(255,246,214,.18)"/>`;
  for (let i = 0; i < 5; i++) { const y = hz + 20 + i * (sy - hz) / 5, off = (t * (14 + i * 6)) % 200; sea += path(`M${-M - off} ${y}` + Array.from({ length: 20 }, () => 'q50 -10 100 0t100 0').join(''), 'none', 4, 'rgba(200,220,255,.25)'); }
  const wv = wave(t, .18, 22);
  let sand = path(`M${-M} ${sy + wv}` + Array.from({ length: 38 }, () => 'q50 -18 100 0').join('') + `L${W + M} ${sy + 80}L${-M} ${sy + 80}Z`, 'rgba(220,235,255,.6)', 0) + grad('#c4ad84', '#8c7652', -M, sy + 20 + wv, W + 2 * M, H - sy + M);
  for (let i = 0; i < 30; i++) sand += ell(-500 + r() * (W + 1000), sy + 80 + r() * (H - sy + 200), 6 + r() * 8, 3 + r() * 3, '#a8916a', 0);
  return { sky, sea, sand };
}
const a2_nightLayers = (t, o) => { const p = a2_night(t, o); return [{ z: 6, svg: p.sky }, { z: 2.4, svg: p.sea }, { z: 1, svg: p.sand }]; };
// plage à l'aube (course) : beachLayers teintées lever de soleil
const a2_DAWN = { dusk: .32, sunX: 1450, sunY: 300, hotels: 1 };
const a2_beach = (t, o = {}) => beachLayers(t, Object.assign({}, a2_DAWN, o));
const a2_parts = (t, o = {}) => beachParts(t, Object.assign({}, a2_DAWN, o));
// voile plein écran
const a2_tint = (c) => rect(-900, -900, W + 1800, H + 1800, c, 0, 0);
// jumelles (POV mouette)
function a2_binoc(t) {
  const id = 'bn' + (_gid++);
  return `<defs><mask id="${id}"><rect x="-10" y="-10" width="${W + 20}" height="${H + 20}" fill="#fff"/><circle cx="${CX - 250}" cy="${CY}" r="380" fill="#000"/><circle cx="${CX + 250}" cy="${CY}" r="380" fill="#000"/></mask></defs><rect x="-10" y="-10" width="${W + 20}" height="${H + 20}" fill="#0b0b10" mask="url(#${id})"/>` +
    line(CX - 60, CY, CX + 60, CY, 4, 'rgba(255,255,255,.7)') + line(CX, CY - 60, CX, CY + 60, 4, 'rgba(255,255,255,.7)') + `<rect width="${W}" height="${H}" fill="rgba(60,255,120,.06)"/>`;
}
// moitié de coquille posée sur la tête (chapeau)
function a2_shellHat(x, y, s = 1, r = 0) { return G(tr(x, y, s, r), path('M-50 10Q-48 -50 0 -54Q48 -50 50 10L36 0L24 14L12 0L0 14L-12 0L-24 14L-36 0Z', '#fbf6ea') + ell(-18, -26, 8, 12, 'rgba(255,255,255,.9)', 0)); }
// gouttes de bave/eau qui éclaboussent l'objectif
function a2_lensDrops(t, t0, n = 7, seed = 3, c = 'rgba(190,232,255,.55)') { if (t < t0) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * W, y = r() * H * .8, k = clamp((t - t0) * 6 - i * .3); s += circ(x, y + (t - t0) * 40, (40 + r() * 70) * k, c, 5, 'rgba(255,255,255,.7)'); } return s; }
// petits pâtés de sable qui tombent (avalanche)
function a2_sandRain(x, y, w, t, t0, n = 16, seed = 5) { if (t < t0) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const k = t - t0 - r() * .3; if (k < 0) continue; s += circ(x + (r() - .5) * w, y + k * 900 + 400 * k * k, 10 + r() * 18, ['#e2bf7f', '#c9a26a', '#d8b47a'][i % 3], 4); } return s; }
// carte « météo »
function a2_map(x, y, s) { return G(tr(x, y, s), rect(-420, -260, 840, 520, '#7fd3f0', 24) + path('M-300 -120Q-200 -220 -60 -160Q40 -200 120 -120Q260 -160 300 -40Q340 80 200 140Q60 220 -80 160Q-240 200 -300 80Q-360 -20 -300 -120Z', '#9be37b') + rect(-420, -260, 840, 520, 'none', 24)); }
// tampon encreur
function a2_stamp(x, y, s, inner) { return G(tr(x, y, s), rect(-30, -220, 60, 140, '#8b5a3c', 14) + circ(0, -240, 50, '#8b5a3c') + rect(-110, -90, 220, 70, '#5a3d26', 14) + rect(-100, -24, 200, 30, '#e2463a', 6) + inner); }
// médaille
function a2_medal(x, y, s, t) { return G(tr(x, y, s, wave(t, .8, 8)), path('M-40 -160L0 -40L40 -160', 'none', 26, '#e2463a') + circ(0, 0, 60, '#ffd23f') + circ(0, 0, 40, 'none', 6, '#e9a93b') + text(0, 18, 'none', '1', '#c97f1f', 56)); }

// ============================================================
//  FLASHBACK — l'œuf sous le sable
// ============================================================
// B013 — plan d'ensemble de nuit, grue qui descend du ciel étoilé vers le nid ; rembobinage qui s'arrête
B(13, { enter: 'none', flash: 1, cam: () => ({ z: 1.02, hand: .3 }),
  overlay: t => (t < .35 ? vhs(t) : ''),
  draw: (t, d) => { const c = camMove(t, d, { y: -300, zoom: 1.0 }, { y: 40, zoom: 1.12 }, eOutCubic);
    return depth(c, [...a2_nightLayers(t, { hz: 520, sy: 700 }),
      { z: 1, svg: Array.from({ length: 9 }, (_, i) => ell(1300 - i * 70, 820 + Math.sin(i) * 14, 16, 8, '#8a7452', 0)).join('') + path('M560 790Q700 720 840 790Z', '#b9a27a', 6) + G(tr(700, 700, 1, -6), line(0, 0, 0, 90, 8) + rect(-70, -40, 140, 60, '#fff', 8) + text(0, 4, 'none', 'NID', OL, 34)) +
        G(tr(1500, lerp(200, 520, seg(t, 0, 1.2)), 1, 20 - t * 160), calendarPage(0, 0, .7, 0, '')) + G(tr(1700, lerp(60, 420, seg(t, .2, 1.3)), 1, -t * 200), calendarPage(0, 0, .55, 0, '')) },
      { z: .5, svg: fgGrass(160, 1150, 1.7, t, '#3d5a3a') + fgDune(1750, 1000, 800, 260, '#7a6748'), blur: 9 }]) + bigText(['DEUX MOIS', 'PLUS TÔT…'], t, at(13, 'deux'), CX, 210, '#ffd23f', 120); },
  sfx: [[0, 'rewind', .6], [.05, 'el:time_pass', .9], [at(13, 'deux'), 'el:hit_cine', .6], [.5, 'el:a_night', .5], [.8, 'crickets', .5]] });

// B014 — très gros plan : l'œuf, sourire de pub, flèche « TOI »
B(14, { cam: (t, d) => ({ z: lerp(1.0, 1.12, eInOut(t / d)), hand: .4 }),
  draw: t => { const O = at(14, 'oeuf');
    return depth({ zoom: 1 }, [{ z: 2.5, svg: a2_cut(t, { sy: -300, seed: 7 }), blur: 4 },
      { z: 1, svg: glow(CX, 560, 520, '#fff6c8', .55 + .2 * Math.sin(t * 6)) + a2_eggF(CX, 560, 5.2, t, { eyes: t > O ? 'star' : 'dot', mouth: t > O ? 'grin' : 'smile', bow: 1, sq: t > O ? .25 * Math.max(0, Math.sin((t - O) * 12)) * (1 - seg(t, O, O + .5)) : 0 }) +
        (t > O ? sparkle(CX + 260, 330, pop(t, O) * .9, '#fff') + sparkle(CX - 280, 420, pop(t, O + .1) * .6, '#fff') : '') + G(tr(CX + 470, 260, pop(t, at(14, 'tu')), -12), path('M-80 -40L60 -40L60 -80L140 0L60 80L60 40L-80 40Z', '#ff6fa5').replace('M-80', 'M-80') ) + G(tr(CX + 470, 140, pop(t, at(14, 'tu'))), text(0, 0, OL, 'TOI', '#ff6fa5', 80)) },
      { z: .45, svg: circ(180, 980, 120, '#c9a26a', 0) + circ(1780, 120, 90, '#d8b47a', 0) + circ(1700, 1000, 140, '#a98758', 0), blur: 10 }]); },
  sfx: [[0, 'pop', .8], [at(14, 'tu'), 'boing', .5], [at(14, 'oeuf'), 'el:chime', .8], [at(14, 'oeuf') + .1, 'sparkle', .6]] });

// B015 — contre-plongée sous le sable : des pelletées tombent sur l'œuf (BONK), un crabe passe là-haut
B(15, { enter: 'drop', cam: (t, d) => ({ z: 1.04, r: -5, cy: 300, shake: t > at(15, 'enterre') + .1 && t < at(15, 'enterre') + .4 ? 9 : 0 }),
  draw: t => { const E = at(15, 'enterre'), hit = t > E + .15;
    return depth({ zoom: 1 }, [{ z: 1.6, svg: a2_cut(t, { sy: 200, seed: 3 }) + crab({ x: 300 + t * 500, y: 150, s: .45, walk: 2, mouth: 'smile' }, t) + G(tr(1500, 120), line(0, 0, 0, 70, 6) + rect(-60, -40, 120, 50, '#fff', 8) + text(0, -6, 'none', 'ICI', OL, 30)), blur: 2 },
      { z: 1, svg: line(CX + 420, 230, CX + 420, 560, 10, '#fff') + path(`M${CX + 390} 520L${CX + 420} 570L${CX + 450} 520`, 'none', 10, '#fff') + tag(CX + 420, 640 - 360 + 380, '-50 CM', t, .3, '#fff', OL, 54) +
        a2_sandRain(CX, 160, 260, t, E - .2, 18) + a2_eggF(CX, 600, 2.6, t, { eyes: hit ? (t < E + .6 ? 'x' : 'half') : 'dot', mouth: hit ? 'flat' : 'smile', bow: 1, sq: hit ? .35 * (1 - seg(t, E + .15, E + .7)) : 0 }) + (hit && t < E + .6 ? impactStar(CX + 110, 460, .5) : '') + (t > E + .7 ? G(tr(CX - 260, 460, pop(t, E + .7)), text(0, 0, OL, 'aïe.', '#fff', 56)) : '') },
      { z: .5, svg: circ(160, 980, 140, '#a98758', 0) + circ(1760, 1000, 160, '#c9a26a', 0), blur: 9 }]); },
  sfx: [[at(15, 'enterre') - .2, 'el:dig', .9], [at(15, 'enterre') + .15, 'thud', 1], [at(15, 'enterre') + .2, 'boing', .5], [.6, 'el:crab_scuttle', .3], [1.1, 'hmm', .5]] });

// B016 — plongée : grue qui s'élève, le compteur file jusqu'à 100 ; tous les frères et sœurs disent coucou
function a2_nest(t, n, hiI = 52, wakeT = 99, seed = 2) {
  const r = rng(seed); let s = ''; const ex = ['dot', 'happy', 'huge', 'half', 'closed', 'star'], mo = ['smile', 'grin', 'o', 'flat', 'wavy'];
  for (let i = 0; i < 112; i++) { const c = i % 14, rw = Math.floor(i / 14); const x = 180 + c * 120 + (rw % 2) * 60, y = 130 + rw * 115; const a = r(), b = r(); if (i >= n) continue;
    if (i === hiI) continue;
    s += a2_eggF(x, y, .95, t, { eyes: t > wakeT ? (a < .5 ? 'happy' : 'star') : ex[Math.floor(a * 6)], mouth: t > wakeT ? 'grin' : mo[Math.floor(b * 5)], seed: i, r: wave(t, .6, 6, a), cheeks: true }); }
  const c = hiI % 14, rw = Math.floor(hiI / 14);
  return s + a2_eggF(180 + c * 120 + (rw % 2) * 60, 130 + rw * 115, 1.15, t, { eyes: t > wakeT ? 'happy' : 'huge', mouth: t > wakeT ? 'grin' : 'o', bow: 1 });
}
B(16, { enter: 'none', cam: (t, d) => ({ z: lerp(1.9, 1.0, eInOut(seg(t, 0, 1.6))), cx: 1050, cy: 590, r: lerp(10, 0, eOutCubic(seg(t, 0, 1.6))) }),
  draw: t => { const n = Math.min(100, Math.floor(1 + 99 * eInCubic(seg(t, .1, at(16, '100') + .15)))), F = at(16, 'freres');
    return sandTop(t, 21) + a2_nest(t, n, 52, F) + G(tr(CX, 110, 1 + .15 * Math.max(0, Math.sin(t * 20)) * (n < 100 ? 1 : 0)), rect(-200, -70, 400, 140, '#ffd23f', 40) + text(0, 30, 'none', '×' + n, OL, 90)) + (t > F ? confetti(t, F, 30) : ''); },
  sfx: [[0, 'whoosh_up', .6], [.3, 'coins', .5], [at(16, '100'), 'jackpot', .7], [at(16, 'freres'), 'el:baby_squeak', .8], [at(16, 'freres') + .3, 'el:crowd_aww', .4]] });

// B017a — plan moyen : « Ta mère ? » l'œuf cherche autour de lui
B(17, { cam: camPush(1.02, 1.1, .6),
  draw: t => { const lk = Math.sin(t * 5);
    return depth({ zoom: 1 }, [{ z: 2, svg: a2_cut(t, { sy: -200, seed: 11 }) + eggsPile(CX, 1000, 12, .9, t, 4), blur: 4 },
      { z: 1, svg: a2_eggF(CX - 120, 640, 3.2, t, { eyes: 'huge', mouth: 'o', look: [lk, -.3], bow: 1, brows: 'up' }) + qmark(CX + 140, 380, pop(t, .2), '#fff', wave(t, 1, 10)) +
        thought(CX + 470, 300, 340, 220, op(.8, mom({ x: 0, y: 40, s: .55, expr: 'calm' }, t)) + text(0, -40, 'none', '?', OL, 70), pop(t, .3)) },
      { z: .5, svg: circ(1780, 960, 160, '#a98758', 0), blur: 9 }]); },
  sfx: [[.1, 'hmm', .7], [.3, 'pop', .7], [.7, 'tick', .4]] });
// B017b — « Partie. » : plage déserte de nuit, traces vers la mer, virevoltant, grillon ; « Oui. »
B(17, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d) => { const O = at(17, 'oui') - at(17, 'partit');
    return depth({ x: t * 60, zoom: 1 }, [...a2_nightLayers(t, { hz: 420, sy: 600 }),
      { z: 1, svg: Array.from({ length: 14 }, (_, i) => ell(500 + i * 90, 900 - i * 20, 18, 9, '#7d6948', 0) + ell(520 + i * 90, 940 - i * 20, 18, 9, '#7d6948', 0)).join('') + G(tr(lerp(-200, 1100, t / 1.4), 860 - Math.abs(Math.sin(t * 6)) * 60), tumbleweed(0, 0, .8, t * 400)) + cricket(1650, 900, .5, t) +
        tag(760, 200, 'PARTIE.', t, .1, '#ff6b6b', '#fff', 80) + (t > O ? G(tr(1250, 330, pop(t, O), 6), rect(-150, -70, 300, 120, '#fff', 30) + text(0, 22, 'none', 'Oui.', OL, 64)) : '') },
      { z: .5, svg: fgDune(300, 980, 900, 240, '#6f5d40'), blur: 9 }]); },
  sfx: [[0, 'whoosh', .7], [.1, 'el:record', .7], [.3, 'el:a_wind', .6], [.4, 'crickets', .7], [at(17, 'oui') - at(17, 'partit'), 'ding', .5]] }, at(17, 'partit'));

// B018a — profil : la mère pond en scrollant son téléphone, les œufs tombent « pop pop pop »
B(18, { cam: (t, d) => ({ z: 1.06, hand: .7 }),
  draw: t => { let eg = ''; for (let i = 0; i < 6; i++) { const k = (t * 2.4 + i / 6) % 1; eg += a2_eggF(560 + (i % 3) * 30, 720 + k * 150, .7, t, { eyes: 'huge', mouth: 'o' }); }
    return depth({ zoom: 1 }, [...a2_nightLayers(t, { hz: 330, sy: 480 }),
      { z: 1, svg: ell(580, 900, 240, 70, '#6e5c3f', 0) + eg + mom({ x: 1020, y: 760, s: 1.7, expr: 'zen', hold: phone(0, 0, .3, 20) }, t) + G(tr(560, 520, pop(t, .3)), text(0, 0, OL, 'pop', '#fff', 54)) + G(tr(470, 610, pop(t, .6)), text(0, 0, OL, 'pop', '#fff', 46)) + tag(1360, 200, 'PONDUE ✔', t, .2, '#fff', OL, 58) },
      { z: .5, svg: fgGrass(1800, 1150, 1.6, t, '#3d5a3a'), blur: 9 }]); },
  sfx: [[.1, 'pop', .8], [.35, 'pop_hi', .8], [.6, 'pop', .8], [.85, 'pop_hi', .8], [1.1, 'pop', .7], [.4, 'el:typing', .4]] });
// B018b — « enterrée » : elle balance le sable en arrière sans regarder, ça arrose la caméra
B(18, { enter: 'crash', cam: () => ({ z: 1.08, shake: 6 }),
  draw: t => depth({ zoom: 1 }, [...a2_nightLayers(t, { hz: 300, sy: 450 }),
    { z: 1, svg: ell(560, 880, 300, 80, '#6e5c3f', 0) + a2_eggF(470, 830, 1.1, t, { eyes: 'huge', mouth: 'scream', spray: 1 }) + a2_eggF(640, 840, 1.1, t, { eyes: 'x', mouth: 'wail', bow: 1 }) + G(tr(560, 790), path('M-300 60Q0 -120 300 60Z', '#b9a27a', 0)).replace('M-300', 'M-300') +
      sandFlying(600, 820, t * 1.5, 16, 3) + sandFlying(500, 800, t * 1.5 + .4, 16, 8) + mom({ x: 1050, y: 760, s: 1.7, expr: 'deadpan', fa: 30, walk: 6 }, t) + motionLines(820, 700, 3, 90, 180) + tag(1350, 200, 'ENTERRÉE ✔', t, .1, '#fff', OL, 58) },
    { z: .45, svg: a2_sandRain(CX, -300, 1800, t, 0, 14, 4), blur: 8 }]),
  sfx: [[0, 'el:dig', 1], [.2, 'scratch', .6], [.35, 'el:dig', .7], [.5, 'squeak', .6]] }, at(18, 'enterr'));
// B018c — travelling latéral : lunettes de soleil, coucou sans se retourner, plongeon dans l'océan
B(18, { enter: 'whip', cam: () => ({ z: 1.02, hand: .4 }),
  draw: (t, d) => { const S = at(18, 'ocean') - at(18, 'puis'), k = seg(t, 0, S), sp = t > S;
    return depth({ x: lerp(-100, 380, eInOut(seg(t, 0, d))), zoom: 1 }, [...a2_nightLayers(t, { hz: 430, sy: 640 }),
      { z: 1, svg: (sp ? '' : mom({ x: lerp(300, 1350, k), y: lerp(880, 700, k), s: 1.35, expr: 'cool', walk: 1.3, flipUp: 1 }, t) + G(tr(lerp(300, 1350, k) + 120, lerp(880, 700, k) - 280, pop(t, .2)), text(0, 0, OL, 'BYE', '#ffd23f', 60))) +
        (sp ? shockRing(1400, 660, t, S, '#fff') + sandFlying(1400, 660, t * 2, 18).replace(/#e2bf7f/g, '#dff3ff') + G(tr(1400, 520, pop(t, S)), text(0, 0, OL, 'PLOUF', '#fff', 70)) : '') + tag(600, 180, 'BYE BYE ✔', t, .3, '#5ec4f0', '#fff', 58) },
      { z: .5, svg: fgGrass(200, 1180, 1.6, t, '#3d5a3a') + fgGrass(1700, 1160, 1.4, t, '#3d5a3a', 5), blur: 9 }]); },
  sfx: [[0, 'el:patter', .6], [.2, 'whistle', .4], [at(18, 'ocean') - at(18, 'puis'), 'el:splash', 1], [at(18, 'ocean') - at(18, 'puis') + .05, 'el:plunge', .5]] }, at(18, 'puis'));

// B019 — plan d'ensemble : le nid tout petit dans le sable, deux énormes panneaux interdits
B(19, { cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: t => { const C1 = at(19, 'calin'), C2 = at(19, 'biberon');
    return depth({ zoom: 1 }, [{ z: 1, svg: a2_cut(t, { sy: 300, night: 1, seed: 5 }) + G(tr(CX, 860, .7), eggsPile(0, 0, 18, 1, t, 6)) + a2_eggF(CX, 650, 1.3, t, { eyes: t > C2 ? 'sad' : 'dot', mouth: t > C1 ? 'wavy' : 'smile', brows: t > C1 ? 'sad' : '', bow: 1 }) +
      noSign(560, 470, 1.15, hugIcon(0, 0, 1.2), t, C1) + noSign(1360, 470, 1.15, bottle(0, 0, 1.1), t, C2) },
      { z: .5, svg: circ(1800, 1040, 180, '#8a6a44', 0) + circ(80, 1060, 160, '#8a6a44', 0), blur: 9 }]); },
  sfx: [[at(19, 'calin'), 'error_beep', .8], [at(19, 'calin') + .1, 'el:hit_cine', .4], [at(19, 'biberon'), 'error_beep', .8], [at(19, 'biberon') + .2, 'el:crowd_aww', .4]] });

// B020a — gros plan : l'œuf fixe un téléphone planté dans le sable, la lumière de l'écran sur le visage
B(20, { cam: camPush(1.02, 1.1, .5),
  draw: t => depth({ zoom: 1 }, [{ z: 2.5, svg: a2_cut(t, { sy: -300, night: 1, seed: 8 }), blur: 5 },
    { z: 1, svg: glow(1250, 520, 420, '#cfe9ff', .45) + a2_eggF(680, 560, 4.2, t, { eyes: 'huge', mouth: 'o', look: [1, 0], bow: 1 }) + chatPhone(1320, 560, 1.7, -8, t, { name: 'Maman' }) + G(tr(1500, 250, pop(t, .4)), text(0, 0, OL, '…', '#fff', 90)) },
    { z: .45, svg: circ(1800, 1000, 170, '#8a6a44', 0), blur: 10 }]),
  sfx: [[.1, 'tick', .6], [.4, 'el:typing', .5], [.9, 'hmm', .5]] });
// B020b — insert écran : « Maman écrit… » pendant des heures… « Vu ». Sanglots-fontaine.
B(20, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.05, 1.15, t / d), hand: .5 }),
  draw: (t, d) => { const V = at(20, 'bien') - at(20, 'message');
    return rect(-200, -200, W + 400, H + 400, '#1b2650', 0, 0) + glow(800, 540, 600, '#cfe9ff', .35) + chatPhone(800, 430, 2.6, 0, t, { typing: t < V, seen: t >= V }) +
      wallClock(1720, 150, 70, t * 30) + G(tr(1720, 270), text(0, 0, OL, t < V ? '3 h…' : '', '#fff', 50)) +
      (t >= V ? a2_eggF(1450, 640, 2.6, t, { eyes: 'closed', mouth: 'wail', tears: 1, brows: 'sad', bow: 1 }) + G(tr(1450, 330, pop(t, V)), text(0, 0, OL, 'VU.', '#ff6b6b', 80)) : ''); },
  sfx: [[0, 'el:typing', .6], [.5, 'tick', .5], [at(20, 'bien') - at(20, 'message'), 'ding', .7], [at(20, 'bien') - at(20, 'message') + .15, 'el:crowd_aww', .5]] }, at(20, 'message'));

// B021a — contre-plongée : banderole « BIENVENUE » sous terre, ballon dégonflé, trompette qui pendouille
B(21, { enter: 'tilt', cam: (t, d) => ({ z: 1.05, r: -7, cy: 350, hand: .4 }),
  draw: t => depth({ zoom: 1 }, [{ z: 2, svg: a2_cut(t, { sy: -200, night: 1, seed: 12 }) + path('M200 60Q600 -60 960 100T1700 40', 'none', 14, '#6e5232'), blur: 3 },
    { z: 1, svg: path('M300 200Q960 360 1620 200', 'none', 6) + Array.from({ length: 9 }, (_, i) => path(`M${360 + i * 150} ${238 + Math.sin(i / 8 * Math.PI) * 70}l44 0l-22 64Z`, ['#ff6fa5', '#ffd23f', '#5ec4f0'][i % 3], 4)).join('') +
      bigText(['BIENVENUE !'], t, at(21, 'bienvenue'), CX, 470, '#ffd23f', 120) + G(tr(1560, 470 + wave(t, .5, 10), 1, 20), ell(0, 0, 50, 34, '#ff6fa5') + line(0, 34, 10, 160, 4)) +
      a2_eggF(600, 740, 2.2, t, { eyes: 'happy', mouth: 'grin', look: [0, -1], bow: 1 }) + a2_eggF(1000, 790, 1.8, t, { eyes: 'half', mouth: 'flat', look: [0, -1] }) + partyHorn(1300, 760, 1.2, 70, .2) },
    { z: .5, svg: confetti(t, at(21, 'famille') - .3, 25, 7), blur: 6 }]),
  sfx: [[at(21, 'bienvenue'), 'tada', .5], [at(21, 'famille'), 'el:applause', .3], [at(21, 'famille') + .3, 'whistle', .4], [1.5, 'el:record', .3]] });
// B021b — jeu télé : « INFO ABSURDE N°1 » qui tourne, rayons violets, buzzers
B(21, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), shake: t < .3 ? 8 : 0 }),
  draw: t => rays(t * 2, CX, 470, '#6b3fa0', '#8d5bd1', 24) + glow(CX, 470, 500, '#ffd23f', .35) + Array.from({ length: 12 }, (_, i) => circ(160 + i * 145, 1000, 26, (Math.floor(t * 6) + i) % 2 ? '#ffd23f' : '#fff3b0', 5)).join('') +
    G(tr(CX, 330, pop(t, .1), wave(t, .6, 4)), text(0, 0, OL, 'INFO', '#fff', 150)) + G(tr(CX, 510, pop(t, .3), -wave(t, .6, 4)), text(0, 0, OL, 'ABSURDE', '#ffd23f', 170)) + G(tr(CX + 560, 200, pop(t, .6), 15), circ(0, 0, 100, '#ff6fa5') + text(0, 28, 'none', 'N°1', '#fff', 70)) +
    a2_eggF(330, 640, 1.8, t, { eyes: 'star', mouth: 'grin' }) + a2_eggF(1590, 640, 1.8, t, { eyes: 'huge', mouth: 'o', bow: 1 }),
  sfx: [[0, 'el:hit_cine', .8], [.1, 'drum', .6], [.6, 'ding', .8], [1.0, 'el:applause', .4]] }, at(21, 'et'));
// B021c — crash zoom : l'œuf mâchoire décrochée « ABSURDE ?! »
B(21, { enter: 'crash', cam: () => ({ z: 1.08, shake: 5 }),
  draw: t => rays(t, CX, 520, '#ffe9a8', '#ffd36b', 22) + a2_eggF(CX, 560, 5.5, t, { eyes: 'huge', mouth: 'jaw', brows: 'up', bow: 1, spray: 1 }) + emark(CX + 380, 330, pop(t, .1), '#ff4d4d', 12) + emark(CX - 380, 330, pop(t, .15), '#ff4d4d', -12),
  sfx: [[0, 'boing', .8], [.05, 'el:crowd_gasp', .5], [.2, 'whistle', .5]] }, at(21, 'absurde'));

// B022a — plongée sur le nid : un thermomètre géant se plante au milieu des œufs
B(22, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.15, 1.02, eOutCubic(seg(t, 0, 1))), shake: t > .5 && t < .8 ? 10 : 0 }),
  draw: t => { const k = eInCubic(seg(t, .1, .5));
    return sandTop(t, 13) + G(tr(0, 0), a2_nest(t, 112, 52, 99, 6).replace(/translate\(/g, 'translate(')) + ell(1200, 560, 70 * k, 26 * k, 'rgba(0,0,0,.25)', 0) + G(tr(1200, lerp(-700, 520, k), 1.5), thermometer(0, 0, 1, .5, '#ff8a3d')) + (k >= 1 ? shockRing(1200, 560, t, .5, '#fff') + impactStar(1080, 600, .5 * (1 - seg(t, .5, .8))) : ''); },
  sfx: [[.1, 'whoosh', .8], [.5, 'thud', 1], [.55, 'el:baby_squeak', .6], [.9, 'tick', .5]] });
// B022b — insert : le mercure monte et descend, machine à sous ♂ / ♀ ; « ton sexe ?! » l'œuf rougit
B(22, { enter: 'whip', cam: camPush(1.02, 1.1, .5),
  draw: (t, d) => { const lv = .5 + .38 * Math.sin(t * 4), S = at(22, 'sexe') - at(22, 'temperature');
    return rays(t, CX, CY, '#fff3d9', '#ffe2a8', 22) + G(tr(330, 620, 1.8), thermometer(0, 0, 1, lv, lerpColor('#4d9de0', '#ff5d4d', lv))) +
      G(tr(1040, 400), rect(-300, -150, 600, 300, '#2b2b33', 40) + rect(-270, -120, 250, 240, '#fff', 20) + rect(20, -120, 250, 240, '#fff', 20) + G(tr(-145, 0, 1, 0), sexSym(0, 0, .9, Math.floor(t * 8) % 2, Math.floor(t * 8) % 2 ? '#ff6fa5' : '#4d9de0')) + G(tr(145, 0), sexSym(0, 0, .9, Math.floor(t * 8 + 1) % 2, Math.floor(t * 8 + 1) % 2 ? '#ff6fa5' : '#4d9de0'))) +
      a2_eggF(1580, 640, 2.4, t, { eyes: t > S ? 'huge' : 'dot', mouth: t > S ? 'wavy' : 'o', blush: t > S, sweat: t > S, bow: 1, look: [-1, 0] }) + (t > S ? G(tr(1560, 330, pop(t, S), 8), text(0, 0, OL, 'SEXE ?!', '#ff6fa5', 80)) : ''); },
  sfx: [[0, 'whoosh', .6], [.2, 'slot', .8], [.8, 'slot', .6], [at(22, 'sexe') - at(22, 'temperature'), 'boing', .7], [at(22, 'sexe') - at(22, 'temperature') + .1, 'whistle', .5]] }, at(22, 'temperature'));

// B023a — sable frais : neige sous terre, écharpe, l'œuf claque des dents
B(23, { cam: (t, d) => ({ z: 1.06, hand: .5 }),
  draw: t => { let sn = ''; const r = rng(3); for (let i = 0; i < 40; i++) sn += circ((r() * W + wave(t, .3, 30, r())), (r() * H + t * 120) % H, 5 + r() * 6, '#fff', 0);
    return depth({ zoom: 1 }, [{ z: 2, svg: a2_cut(t, { sy: 120, seed: 14 }).replace(/#e9c98d/g, '#bcd6e6').replace(/#b98d55/g, '#7f9fb8'), blur: 3 },
      { z: 1, svg: G(tr(330, 620, 1.3), thermometer(0, 0, 1, .2, '#4d9de0')) + a2_eggF(1000, 620, 3.6, t, { eyes: 'huge', mouth: 'teeth', brows: 'sad', tremble: 2.5, scarf: 1 }) + path('M840 450l14 40l14 -40M1130 440l12 34l12 -34', '#dff3ff', 4) + tag(1000, 160, 'FRAIS', t, .2, '#4d9de0', '#fff', 70) + sn }]); },
  sfx: [[0, 'el:a_wind', .6], [.2, 'el:struggle', .3], [.5, 'squeak', .4], [.8, 'tick', .5]] });
// B023b — naissance de mâles : bébés à moustache et lunettes, pose de culturiste
B(23, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: t => { const M = at(23, 'male') - at(23, 'favorise');
    return rays(t, CX, CY, '#d6ecff', '#b9dcff', 22) + [300, 860, 1400].map((x, i) => G(tr(x, 0, pop(t, .1 + i * .15)), sib({ x: 0, y: i === 1 ? 760 : 720, s: i === 1 ? 2.4 : 1.9, expr: 'cool', mustache: 1, hairColor: OL, flipUp: 1, seed: i + 2 }, t))).join('') +
      sexSym(1650, 280, .9 * pop(t, .3), 0, '#4d9de0') + (t > M ? tag(CX, 130, 'MÂLES', t, M, '#4d9de0', '#fff', 80) : '') + sparkle(480, 400, .5, '#fff') + sparkle(1460, 420, .6, '#fff'); },
  sfx: [[0, 'whoosh', .6], [.15, 'pop', .8], [.3, 'pop', .8], [.45, 'pop', .8], [at(23, 'male') - at(23, 'favorise'), 'el:hit_cine', .5]] }, at(23, 'favorise'));

// B024a — profil, sable chaud : l'œuf bronze en transat, cocktail, lunettes… chiiiill
B(24, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), hand: .3 }),
  draw: t => depth({ zoom: 1 }, [{ z: 4, svg: grad('#ffb36b', '#ffe1a8', -900, -900, W + 1800, H + 1800) + sun(1550, 220, .55, t, 'nice') },
    { z: 1, svg: rect(-900, 700, W + 1800, 900, '#f0c27a', 0, 0) + G(tr(860, 760, 1, -12), rect(-260, -40, 520, 40, '#ff6fa5', 14) + line(-200, 0, -240, 120, 10) + line(200, 0, 240, 120, 10)) +
      a2_eggF(860, 600, 2.8, t, { eyes: 'shades', mouth: 'smile', r: -22, bow: 1 }) + G(tr(1200, 640), path('M-40 -60L40 -60L0 20Z', '#8fe0ff', 6) + line(0, 20, 0, 90, 6) + line(-30, 90, 30, 90, 6) + G(tr(20, -90, 1, 20), path('M0 0L-60 0Q-30 -40 0 0Z', '#ff6b6b', 4) + line(0, 0, -10, 40, 4))) +
      G(tr(560, 380, pop(t, .4), -8), text(0, 0, OL, 'chiiiill', '#fff', 80)) + G(tr(330, 620, 1.2), thermometer(0, 0, 1, .9, '#ff5d4d')) + steam(1000, 430, t, .8) + Array.from({ length: 3 }, (_, i) => heart(700 + i * 120, 330 - ((t * 60 + i * 50) % 150), .5, '#ff6fa5')).join('') },
    { z: .5, svg: fgShell(1700, 1000, 1.8, 20), blur: 9 }]),
  sfx: [[0, 'sizzle', .6], [.2, 'el:chime', .5], [.6, 'angel', .4], [1.2, 'kiss', .4]] });
// B024b — naissance de femelles : nœuds, cils qui battent, cœurs
B(24, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: t => rays(t, CX, CY, '#ffe1ef', '#ffc2dd', 22) + [300, 860, 1400].map((x, i) => G(tr(x, 0, pop(t, .1 + i * .12)), sib({ x: 0, y: i === 1 ? 760 : 720, s: i === 1 ? 2.4 : 1.9, expr: 'love', bow: 1, lashes: 1, seed: i + 2 }, t))).join('') +
    sexSym(1650, 260, .9 * pop(t, .2), 1, '#ff6fa5') + tag(CX, 130, 'FEMELLES', t, at(24, 'femelle') - at(24, 'celle'), '#ff6fa5', '#fff', 80) + heart(300, 300, .8 * pop(t, .3)) + heart(1000, 330, .9 * pop(t, .4)),
  sfx: [[0, 'sparkle', .7], [.1, 'pop_hi', .8], [.25, 'pop_hi', .8], [.4, 'kiss', .6], [at(24, 'femelle') - at(24, 'celle'), 'el:chime', .6]] }, at(24, 'celle'));

// B025 — plan d'ensemble en accéléré : nuages qui filent, le soleil traverse le ciel, le nid minuscule
B(25, { enter: 'none', cam: (t, d) => ({ z: 1.0, hand: .2 }),
  draw: (t, d) => { const c = camMove(t, d, { y: 120, zoom: 1.12 }, { y: -40, zoom: 1.0 }), a = seg(t, 0, d);
    return depth(c, [{ z: 6, svg: grad(lerpColor('#8fd3ff', '#ffb38a', a), '#ffe8d0', -900, -900, W + 1800, H + 1800) + sun(lerp(200, 1700, a), 260 - Math.sin(a * Math.PI) * 120, .3, t, 'nice') },
      { z: 3, svg: Array.from({ length: 5 }, (_, i) => cloud(((i * 500 + t * 900) % (W + 1200)) - 600, 130 + (i % 3) * 70, .9)).join('') },
      { z: 1, svg: a2_cut(t, { sy: 520, seed: 15, noSky: 1 }) + G(tr(CX, 900, .6), eggsPile(0, 0, 16, 1, t, 12)) + a2_eggF(CX, 800, .95, t, { bow: 1, eyes: 'huge', mouth: 'o', look: [0, -1] }) + wallClock(1600, 760, 90, t * 120) },
      { z: .5, svg: fgGrass(200, 640, 1.4, t) + fgGrass(1750, 650, 1.2, t, '#5f8a35', 5), blur: 8 }]); },
  sfx: [[0, 'el:time_pass', .7], [.2, 'clock_fast', .5], [1.2, 'hmm', .4]] });

// B026a — gros plan : le Soleil, présentateur météo, baguette sur la carte
B(26, { cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .3 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#2a5fb0', 0, 0) + a2_map(560, 520, 1) + a2_eggF(560, 520, .9, t, { bow: 1 }) + G(tr(420, 380), cloud(0, 0, .5, '#fff', 5)) +
    sun(1380, 520, .95, t, 'nice') + G(tr(1380, 760), path('M-40 0L40 0L20 120L0 140L-20 120Z', '#e2463a', 6)) + G(tr(1150, 560, 1, -150 + wave(t, 1, 10)), line(0, 0, 360, 0, 12) + line(0, 0, 360, 0, 6, '#8b5a3c')) +
    G(tr(220, 150), rect(-150, -50, 300, 100, '#ffd23f', 16) + text(0, 22, 'none', 'MÉTÉO', OL, 56)),
  sfx: [[0, 'ding', .7], [.2, 'el:chime', .5], [.6, 'magic', .5]] });
// B026b — un tampon géant « ♀ » s'abat sur l'œuf (KA-CHUNK) ; le Soleil fait un clin d'œil
B(26, { enter: 'whip', cam: (t, d) => ({ z: 1.05, shake: Math.abs(t - (at(26, 'determiner') - at(26, 'participe')) - .1) < .15 ? 12 : 0 }),
  draw: t => { const D = at(26, 'determiner') - at(26, 'participe'), k = eInCubic(seg(t, D - .35, D)), up = seg(t, D + .25, D + .6);
    return rays(t, CX, CY, '#fff3d9', '#ffe2a8', 22) + sun(1640, 200, .5, t, 'nice') + a2_eggF(CX, 680, 3.4, t, { eyes: t > D ? 'huge' : 'dot', mouth: t > D ? 'o' : 'smile', sq: t > D ? .3 * (1 - seg(t, D, D + .4)) : 0, bow: 1 }) +
      (t > D ? sexSym(CX, 572, .3, 1, '#ff6fa5') + impactStar(CX, 470, .6 * (1 - seg(t, D, D + .3))) : '') + a2_stamp(CX, lerp(-200, 560, k) - up * 500, 1.3, sexSym(0, 30, .3, 1, '#fff')); },
  sfx: [[0, 'whoosh', .6], [at(26, 'determiner') - at(26, 'participe') - .3, 'whoosh_up', .5], [at(26, 'determiner') - at(26, 'participe'), 'hammer', 1], [at(26, 'determiner') - at(26, 'participe') + .1, 'kaching', .6], [at(26, 'seras') - at(26, 'participe'), 'boing', .4]] }, at(26, 'participe'));

// B027 — contre-plongée dramatique : projecteur sur l'œuf, roulement de tambour
B(27, { cam: (t, d) => ({ z: lerp(1.0, 1.14, eInOut(t / d)), cy: 520, r: lerp(0, -4, t / d) }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#221a30', 0, 0) + `<path d="M${CX - 120} -60L${CX + 120} -60L${CX + 460} 1100L${CX - 460} 1100Z" fill="rgba(255,240,180,.3)"/>` + G(tr(CX, 1060, 1.2), eggsPile(0, 0, 10, 1, t, 14)).replace(/#fbf6ea/g, '#5e566c') +
    a2_eggF(CX, 640, 3.4, t, { eyes: 'huge', mouth: 'o', look: [0, -1], bow: 1, tremble: .4 }) + Array.from({ length: 6 }, (_, i) => sparkle(CX - 300 + i * 120, 200 + (i % 2) * 60, .2 + .2 * Math.abs(Math.sin(t * 3 + i)), '#fff')).join(''),
  sfx: [[0, 'drum', .9], [.2, 'el:riser', .6], [1.0, 'drum', .7]] });

// B028a — plongée : la coquille se fend, une petite tête à nœud fait coucou, ♀
B(28, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.1, 1.0, eOutCubic(t / d)), r: 6 }),
  draw: t => { const F = at(28, 'femelle');
    return sandTop(t, 8) + `<circle cx="${CX}" cy="560" r="420" fill="rgba(255,240,180,.35)"/>` + egg(CX, 560, 4.2, seg(t, .2, F) * .75 + (t > F ? .25 : 0), t, { bow: 1, r: Math.sin(t * 30) * 3 * (t < F ? 1 : 0) }) +
      sexSym(CX + 430, 360, 1.1 * pop(t, F), 1, '#ff6fa5') + (t > F ? heart(CX - 380, 300, .9 * pop(t, F + .1)) : '') + tag(CX, 130, 'PETITE FEMELLE', t, F, '#ff6fa5', '#fff', 66); },
  sfx: [[.2, 'el:egg_crack', .8], [at(28, 'femelle'), 'pop_hi', .9], [at(28, 'femelle') + .1, 'el:baby_squeak', .7], [1.2, 'sparkle', .5]] });
// B028b — FÉLICITATIONS : explosion de confettis, la famille d'œufs en délire, trompettes
B(28, { enter: 'crash', flash: 1, cam: () => ({ z: 1.06, shake: 4 }),
  draw: t => rays(t * 2, CX, CY, '#ffe066', '#ffb703', 26) + confetti(t, 0, 80, 3) + Array.from({ length: 7 }, (_, i) => a2_eggF(250 + i * 240, 880 + (i % 2) * 40 - Math.abs(Math.sin(t * 9 + i)) * 60, 1.5, t, { eyes: i % 2 ? 'star' : 'happy', mouth: 'grin', seed: i })).join('') +
    G(tr(CX, 600), egg(0, 0, 2.6, 1, t, { bow: 1 })) + partyHorn(1450, 440, 1.3, -20, 1) + partyHorn(470, 440, 1.3, 200, 1) + bigText(['FÉLICITATIONS !'], t, .05, CX, 190, '#ff6fa5', 130),
  sfx: [[0, 'tada', 1], [.05, 'el:applause', .8], [.1, 'whistle', .6], [.4, 'pop', .6], [.6, 'pop_hi', .6]] }, at(28, 'felicitations'));

// B029 — la fête se fige (disque rayé)… plan débullé rouge : prédateurs en ombres, « NE MEURS PAS »
B(29, { enter: 'none', cam: (t, d) => t < at(29, 'essaye') ? { z: 1.06 } : { z: lerp(1.0, 1.12, seg(t, at(29, 'essaye'), d)), r: -8, shake: 3 },
  draw: t => { const E = at(29, 'essaye');
    if (t < E) return rays(0, CX, CY, '#d8d8d8', '#c4c4c4', 26) + confetti(.6, 0, 80, 3).replace(/#ff6fa5|#ffd23f|#5ec4f0|#7be07b|#ff8a3d/g, '#999') + G(tr(CX, 600), egg(0, 0, 2.6, 1, 0, { bow: 1 })) + G(tr(CX, 200), text(0, 0, OL, 'Maintenant…', '#fff', 90));
    return rect(-200, -200, W + 400, H + 400, '#3a0d16', 0, 0) + rays(t, CX, 600, '#4a1220', '#3a0d16', 20) +
      op(.9, crab({ x: 420, y: 420, s: 1.2, angry: 1 }, t).replace(/#ef6a3e|#[0-9a-f]{6}(?=" stroke)/g, '#14060a')) + circ(382, 322, 10, '#ff3b30', 0) + circ(458, 322, 10, '#ff3b30', 0) +
      op(.9, eagle({ x: 1500, y: 360, s: 1.2, flap: 2 }, t).replace(/fill="#[0-9a-f]{6}"/g, 'fill="#14060a"')) + circ(1430, 290, 12, '#ff3b30', 0) +
      a2_eggF(CX, 570, 3.2, t, { eyes: 'huge', mouth: 'scream', brows: 'sad', tremble: 1.5, spray: 1, bow: 1 }) + tag(CX, 170, 'NE MEURS PAS.', t, at(29, 'mourir'), '#ff4d4d', '#fff', 70); },
  sfx: [[0, 'el:record', 1], [at(29, 'essaye'), 'sting', .9], [at(29, 'essaye') + .1, 'el:eagle', .5], [at(29, 'essaye') + .3, 'heartbeat', .8], [at(29, 'mourir'), 'el:hit_cine', .6]] });
