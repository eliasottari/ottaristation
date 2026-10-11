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
B(16, { enter: 'none', overlay: t => { const n = Math.min(100, Math.floor(1 + 99 * eInCubic(seg(t, .1, at(16, '100') + .15)))); return G(tr(CX, 110, 1 + .15 * Math.max(0, Math.sin(t * 20)) * (n < 100 ? 1 : 0)), rect(-200, -70, 400, 140, '#ffd23f', 40) + text(0, 30, 'none', '×' + n, OL, 90)); }, cam: (t, d) => ({ z: lerp(1.9, 1.0, eInOut(seg(t, 0, 1.6))), cx: 1440, cy: 475, r: lerp(10, 0, eOutCubic(seg(t, 0, 1.6))) }),
  draw: t => { const n = Math.min(100, Math.floor(1 + 99 * eInCubic(seg(t, .1, at(16, '100') + .15)))), F = at(16, 'freres');
    return sandTop(t, 21) + a2_nest(t, n, 52, F) + (t > F ? confetti(t, F, 30) : ''); },
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

// ============================================================
//  ÉCLOSION
// ============================================================
// B030a — plan d'ensemble, nuit : grue vers le nid ; le monticule commence à trembler
B(30, { enter: 'none', cam: () => ({ z: 1.02, hand: .25 }),
  draw: (t, d) => { const c = camMove(t, d, { y: -260, zoom: 1.0 }, { y: 30, zoom: 1.15 }, eOutCubic), tb = seg(t, .6, d);
    return depth(c, [...a2_nightLayers(t, { hz: 400, sy: 580, moonX: 1450, moonY: 170 }),
      { z: 1, svg: G(tr(800 + Math.sin(t * 50) * 4 * tb, 780), path('M-320 40Q0 -150 320 40Z', '#b9a27a', 6) + G(tr(0, -40, 1, Math.sin(t * 30) * 6 * tb), egg(0, 0, .5, 0, t))) + (tb > 0 ? motionLines(560, 720, 3, 60, 200, '#fff') + motionLines(1040, 720, 3, 60, -20, '#fff') : '') + tag(560, 200, 'UN SOIR…', t, at(30, 'soir') - .2, '#2b2b55', '#fff', 64) },
      { z: .5, svg: fgGrass(1750, 1150, 1.7, t, '#3d5a3a') + fgGrass(150, 1170, 1.4, t, '#3d5a3a', 6), blur: 9 }]); },
  sfx: [[0, 'el:a_night', .6], [.2, 'crickets', .6], [.8, 'el:riser', .4], [1.1, 'tick', .5]] });
// B030b — très gros plan : la fissure court sur la coquille, rais de lumière, éclats
function a2_crackPath(k) { const P = [[-330, -120], [-250, -170], [-190, -90], [-110, -160], [-40, -80], [40, -170], [110, -90], [190, -170], [260, -100], [330, -150]]; const n = Math.max(1, Math.floor(k * (P.length - 1))); return 'M' + P.slice(0, n + 1).map(p => p.join(' ')).join('L'); }
B(30, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(30, 'fissure') - at(30, 'coquille') ? 6 : 1.5 }),
  draw: (t, d) => { const F = at(30, 'fissure') - at(30, 'coquille'), k = seg(t, .1, F), br = t > F;
    return rect(-200, -200, W + 400, H + 400, '#3a2e48', 0, 0) + glow(CX, 560, 700, '#fff6c8', .25) + G(tr(CX, 520, 6.4), egg(0, 0, 1, 0, t, { r: Math.sin(t * 40) * 1.5 })) +
      G(tr(CX, 520), path(a2_crackPath(k), 'none', 16) + (br ? path(a2_crackPath(1), 'none', 30, 'rgba(255,240,160,.8)') + `<path d="M-40 -110L-160 -620L80 -620Z" fill="rgba(255,240,160,.25)"/><path d="M120 -120L300 -620L420 -560Z" fill="rgba(255,240,160,.2)"/>` : '')) +
      G(tr(CX, 520), a2_eggF(0, 60, 3, t, { eyes: 'huge', mouth: br ? 'scream' : 'o', look: [0, -1], cheeks: true }).replace(/<ellipse cx="0" cy="0" rx="52" ry="56"[^>]*\/>/, '').replace(/<ellipse cx="-18" cy="-22"[^>]*\/>/, '')) +
      (br ? [[-1, 0], [1, .2], [-.5, .4]].map(([dx, ph], i) => G(tr(CX + dx * 300 + dx * (t - F) * 900, 400 - (t - F) * 700 + 1600 * (t - F) * (t - F), 1, (t - F) * 500 * dx), path('M-40 0L0 -50L50 -10L20 40Z', '#fbf6ea'))).join('') + G(tr(1520, 300, pop(t, F), 10), text(0, 0, OL, 'CRAC !', '#ffd23f', 100)) : ''); },
  sfx: [[.1, 'el:egg_crack', .8], [.6, 'crack', .6], [at(30, 'fissure') - at(30, 'coquille'), 'crack', 1], [at(30, 'fissure') - at(30, 'coquille') + .05, 'el:egg_crack', 1], [at(30, 'fissure') - at(30, 'coquille') + .2, 'el:baby_squeak', .6]] }, at(30, 'coquille'));

// B031 — plan large en coupe : toute la fratrie creuse vers le haut, fontaines de sable
B(31, { enter: 'crash', cam: () => ({ z: 1.04, shake: 5 }),
  draw: t => { let s = a2_cut(t, { sy: 140, night: 1, seed: 16 }); const r = rng(4);
    for (let i = 0; i < 9; i++) { const x = 180 + i * 200 + r() * 40, y = 900 - r() * 150 - t * 160; if (Math.abs(x - CX) < 140) continue; s += tor({ x, y, s: .75, rot: -70, flail: 1, expr: ['effort', 'panic', 'dizzy'][i % 3], bow: 0, lashes: 0, seed: i }, t) + sandFlying(x, y - 120, t, 5, i); }
    return s + tor({ x: CX, y: 760 - t * 180, s: 1.05, rot: -70, flail: 1, expr: 'effort' }, t) + sandFlying(CX, 620 - t * 180, t, 10, 9) + motionLines(CX, 380 - t * 180, 3, 70, -90, '#fff') + tag(CX + 420, 200, 'CREUSE !', t, .1, '#ffd23f', OL, 64); },
  sfx: [[0, 'el:dig', 1], [.1, 'scratch', .7], [.4, 'el:dig', .7], [.6, 'el:baby_squeak', .4]] });

// B032a — gros plan : elle gratte comme une furie, sable qui gicle
B(32, { enter: 'whip', cam: () => ({ z: 1.06, hand: 1.1 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#8a6a44', 0, 0) + a2_cut(t, { sy: -400, night: 1, seed: 21 }) + path(`M-200 -200L${W + 200} -200L${W + 200} 200Q1500 260 1200 210T600 230T-200 200Z`, '#b28d5c', 7) +
    torF({ x: CX, y: 860, r: 150, expr: 'effort', look: [0, -1], armL: 240 + wave(t, 7, 45), armR: -60 - wave(t, 7, 45, .25), tremble: .6 }, t) + sandFlying(CX - 300, 330, t * 2, 14, 2) + sandFlying(CX + 300, 330, t * 2, 14, 7) +
    motionLines(CX - 330, 420, 3, 80, 200) + motionLines(CX + 330, 420, 3, 80, -20) + G(tr(1550, 450, pop(t, .2), 8), text(0, 0, OL, 'GRAT GRAT', '#fff', 64)),
  sfx: [[0, 'scratch', .9], [.25, 'scratch', .8], [.5, 'el:dig', .8], [.75, 'scratch', .7]] });
// B032b — très gros plan : elle pousse le plafond de sable avec la tête, visage écrasé, vapeur
B(32, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.05, 1.12, t / d), shake: 4 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#8a6a44', 0, 0) + a2_cut(t, { sy: -400, night: 1, seed: 22 }) + G(`translate(${CX} 920) scale(1.15 .9) translate(${-CX} -920)`, torF({ x: CX, y: 960, r: 200, expr: 'effort', face: { mouth: 'teeth' }, armL: 255, armR: -75, tremble: 1.2 }, t)) +
    path(`M-200 -200L${W + 200} -200L${W + 200} 300Q1400 330 ${CX + 200} 300Q${CX} ${270 - Math.abs(Math.sin(t * 9)) * 15} ${CX - 200} 300Q500 330 -200 300Z`, '#b28d5c', 7) + path(`M${CX - 60} 300l30 -60l-20 -40l40 -60M${CX + 80} 300l-20 -50l30 -50`, 'none', 7) +
    steam(CX - 230, 330, t, 1) + steam(CX + 230, 330, t + .4, 1) + G(tr(1550, 560, pop(t, .1), -6), text(0, 0, OL, 'HNNNG !', '#ff6b6b', 80)) + sweat(CX + 260, 450, 1.1),
  sfx: [[0, 'el:struggle', .7], [.1, 'hmm', .9], [.5, 'crack', .5], [.8, 'el:struggle', .5]] }, at(32, 'tu', 2));

// B033a — contre-plongée dans le tunnel : elle grimpe vers la lumière… avalanche, retour en bas
B(33, { cam: (t, d) => ({ z: 1.04, cy: 300, r: 4, hand: .6, shake: t > at(33, 'efforts') + .3 && t < at(33, 'efforts') + .7 ? 8 : 0 }),
  draw: t => { const A = at(33, 'efforts') + .2, hit = t > A + .25, sl = seg(t, A + .25, A + .7);
    return rect(-200, -200, W + 400, H + 400, '#6d5132', 0, 0) + `<path d="M${CX - 70} -100L${CX + 70} -100L${CX + 520} 1200L${CX - 520} 1200Z" fill="#a8845a"/>` + glow(CX, 40, 260, '#fff6c8', .8) + circ(CX, 20, 50, '#fff6c8', 0) +
      torF({ x: CX, y: 860 + sl * 120, r: 120, expr: hit ? 'dizzy' : 'effort', look: [0, -1], armL: hit ? 200 : 250 + wave(t, 4, 30), armR: hit ? -20 : -70 - wave(t, 4, 30, .5) }, t) +
      a2_sandRain(CX, -100, 300, t, A, 22, 6) + (hit ? path(`M${CX - 360} 1100Q${CX} ${780 + 120 * sl} ${CX + 360} 1100Z`, '#c9a26a', 7) + stars(CX, 560 + sl * 120, t, 4, 120) : '') + tag(CX + 520, 200, 'EFFORT N°1', t, .1, '#fff', OL, 54); },
  sfx: [[0, 'el:dig', .6], [at(33, 'efforts') + .2, 'whoosh', .6], [at(33, 'efforts') + .45, 'thud', .9], [at(33, 'efforts') + .5, 'boing', .5], [at(33, 'efforts') + .9, 'hmm', .6]] });
// B033b — montage « entraînement » : elle soulève UN grain de sable, tremblement maximal
B(33, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 2 }),
  draw: t => rays(t, CX, 520, '#ffcf8a', '#ffb36b', 24) + torF({ x: CX - 100, y: 880, r: 140, expr: 'effort', face: { mouth: 'teeth' }, armL: 200, armR: -88 + Math.sin(t * 50) * 4, tremble: 1.5, holdR: circ(0, 0, 22, '#e2bf7f', 5) + sparkle(20, -20, .3, '#fff') }, t) +
    sweat(CX + 60, 420, 1) + sweat(CX - 240, 460, .8) + G(tr(1420, 250, pop(t, .1), 6), rect(-250, -60, 500, 120, '#fff', 20) + text(0, 22, 'none', '1 GRAIN = 200 KG', OL, 50)) + meter(220, 180, 460, 70, .03, '#ffd23f', 'SURFACE 3 %') + steam(CX - 100, 420, t, 1.1),
  sfx: [[0, 'whoosh', .6], [.1, 'el:struggle', .8], [.4, 'squeak', .5], [.8, 'el:struggle', .6]] }, at(33, 'ridicules'));
// B033c — contre-plongée : épuisée, langue pendante… un frère lui marche sur la tête pour passer
B(33, { cam: (t, d) => ({ z: 1.04, cy: 400, r: -5, hand: .4 }),
  draw: t => { const k = seg(t, .1, 1.1);
    return rect(-200, -200, W + 400, H + 400, '#6d5132', 0, 0) + `<path d="M${CX - 70} -100L${CX + 70} -100L${CX + 620} 1200L${CX - 620} 1200Z" fill="#a8845a"/>` + glow(CX, 40, 260, '#fff6c8', .8) +
      tor({ x: 700, y: 820, s: 1.9, expr: 'dead', squash: .25, neck: 1, headTilt: 15 }, t) + sib({ x: lerp(400, 1200, k), y: lerp(640, 560, k) - Math.abs(Math.sin(t * 8)) * 20, s: 1.1, expr: 'smugger', walk: 1.5, rot: -10, seed: 3 }, t) +
      meter(1300, 160, 480, 70, .04, '#ffd23f', 'SURFACE 4 %') + G(tr(1100, 360, pop(t, .9)), text(0, 0, OL, 'pardon !', '#fff', 54)); },
  sfx: [[0, 'hmm', .6], [.3, 'steps', .7], [.7, 'squeak', .5], [1.0, 'el:baby_squeak', .5]] }, at(33, 'animal'));

// B034 — plongée depuis le ciel à l'aube : le sable gonfle, se fissure… POP ! la tête surgit, chœur d'anges
B(34, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.12, 1.0, eOutCubic(seg(t, 0, d))), shake: t < at(34, 'surface') ? 2 * seg(t, .3, 1.2) : (t < at(34, 'surface') + .3 ? 10 : 0) }),
  overlay: t => { const S = at(34, 'surface'); return t > S ? op(1 - seg(t, S, S + .25), `<rect width="${W}" height="${H}" fill="#fff"/>`) : ''; },
  draw: t => { const S = at(34, 'surface'), b = seg(t, .2, S), k = eOutBack(seg(t, S, S + .4));
    return sandTop(t, 13) + a2_tint('rgba(255,170,120,.18)') + `<path d="M-200 -200L700 -200L1400 1300L600 1300Z" fill="rgba(255,240,190,.25)"/>` +
      (t < S ? ell(CX, 560, 120 + 140 * b, 60 + 80 * b, 'rgba(160,120,70,.35)', 0) + path(`M${CX - 40} 520l30 40l-20 30M${CX + 60} 530l-20 40l30 20`, 'none', 6 * b) : ell(CX, 580, 280, 150, '#b38d5c', 0) + sandFlying(CX, 560, t, 18, 5) + G(tr(CX, 560, k), torT({ x: 0, y: 30, s: 2.1, expr: 'ecstatic' }, t)) + stars(CX, 300, t, 6, 260)) +
      (t > S ? tag(CX, 130, 'SURFACE 100 %', t, S + .1, '#7be07b', OL, 64) : ''); },
  sfx: [[.2, 'el:dig', .6], [.6, 'el:riser', .5], [at(34, 'surface') - .05, 'el:sand_pop', 1], [at(34, 'surface'), 'pop', .8], [at(34, 'surface') + .1, 'angel', .8]] });

// ============================================================
//  L'OCÉAN
// ============================================================
// B035a — POV de la tortue qui sort du sable : clignements, le bord du trou, puis le ciel immense… et l'océan
B(35, { enter: 'none', cam: () => ({ z: 1.02, hand: .7 }), overlay: t => povEyes(t, [.3, .62]),
  draw: (t, d) => { const O = at(35, 'ocean'); const c = { y: lerp(420, -60, eInOut(seg(t, .2, O))) , zoom: lerp(1.25, 1.0, eInOut(seg(t, .2, O + .3))) }; const p = a2_parts(t, { hz: 520, sy: 720, sunX: 1250, sunY: 470 });
    return depth(c, [{ z: 5, svg: p.sky + Array.from({ length: 3 }, (_, i) => path(`M${300 + i * 90} ${200 + i * 30}q20 -20 40 0q20 -20 40 0`, 'none', 6)).join('') }, { z: 2.5, svg: p.sea + Array.from({ length: 8 }, (_, i) => sparkle(900 + i * 70, 560 + (i % 3) * 30, .25 + .2 * Math.abs(Math.sin(t * 3 + i)), '#fff')).join('') }, { z: 1.4, svg: p.sand, blur: 2 },
      { z: .5, svg: path(`M-900 1500L-900 700Q-200 980 300 1300Q700 1500 1200 1300Q1700 980 2800 700L2800 1500Z`, '#a8845a', 0) + circ(100, 1000, 120, '#c9a26a', 0) + circ(1800, 980, 140, '#b38d5c', 0), blur: 10 }]) + (t > O + .3 ? bigText(['WOAAAH'], t, O + .3, CX, 160, '#fff', 90) : ''); },
  sfx: [[.1, 'el:sand_pop', .4], [.3, 'el:a_beach', .6], [.62, 'pop', .3], [at(35, 'ocean'), 'angel', .9], [at(35, 'ocean') + .1, 'el:wave_crash', .4]] });
// B035b — « Immense » : crash zoom, yeux exorbités, mâchoire qui tombe JUSQU'AU SOL
B(35, { enter: 'crash', cam: () => ({ z: 1.06, shake: 4 }),
  draw: t => { const k = eOutBack(seg(t, .05, .35)); const r = 150, hy = 860 - 2.05 * r;
    return depth({ zoom: 1 }, [{ z: 3, svg: a2_parts(t, { hz: 560, sy: 760, sunX: CX, sunY: 520 }).sky + a2_parts(t, { hz: 560, sy: 760 }).sea, blur: 4 }, { z: 1, svg: rays(t, CX, 520, 'rgba(255,240,200,.0)', 'rgba(255,240,200,.35)', 20) + a2_parts(t, { hz: 560, sy: 760 }).sand +
      torF({ x: CX, y: 860, r, expr: 'jawdrop', armL: 230, armR: -50 }, t) + path(`M${CX - 70} ${hy + 40}L${CX - 110} ${hy + 60 + 360 * k}Q${CX} ${hy + 150 + 360 * k} ${CX + 110} ${hy + 60 + 360 * k}L${CX + 70} ${hy + 40}Z`, T_BABY_SKIN, 7) + path(`M${CX - 46} ${hy + 50}L${CX - 80} ${hy + 50 + 340 * k}Q${CX} ${hy + 110 + 340 * k} ${CX + 80} ${hy + 50 + 340 * k}L${CX + 46} ${hy + 50}Z`, '#7a2b2b', 6) + ell(CX, hy + 60 + 340 * k, 60 * k, 26 * k, '#ff8a9a', 0) + (k > .9 ? impactStar(CX + 160, hy + 420, .5) + shockRing(CX, hy + 440, t, .35, '#fff') : '') +
      tag(CX, 130, 'IMMENSE', t, .1, '#5ec4f0', '#fff', 80) }]); },
  sfx: [[0, 'el:hit_cine', .6], [.15, 'whistle', .6], [.35, 'thud', .9], [.4, 'boing', .7]] }, at(35, 'immense'));
// B035c — très large : l'océan magnifique au lever du soleil, elle minuscule, larmes de joie
B(35, { enter: 'none', cam: () => ({ z: 1.0, hand: .2 }),
  draw: (t, d) => { const c = camMove(t, d, { y: -40, zoom: 1.05 }, { y: 20, zoom: 1.12 });
    return depth(c, [{ z: 6, svg: a2_parts(t, { hz: 470, sy: 650, sunX: 1250, sunY: 410 }).sky + glow(1250, 420, 600, '#fff2c4', .6) }, { z: 3, svg: a2_parts(t, { hz: 470, sy: 650 }).sea + Array.from({ length: 14 }, (_, i) => sparkle(800 + (i * 97) % 900, 500 + (i * 53) % 130, .2 + .25 * Math.abs(Math.sin(t * 2.5 + i)), '#fff')).join('') + path('M200 300q30 -30 60 0q30 -30 60 0M1600 250q20 -20 40 0q20 -20 40 0', 'none', 6) },
      { z: 1, svg: a2_parts(t, { hz: 470, sy: 650 }).sand + tor({ x: 520, y: 730, s: 1.0, expr: 'sob', look: [1, -.3] }, t) + Array.from({ length: 3 }, (_, i) => heart(650 + i * 60, 560 - ((t * 70 + i * 40) % 160), .4, '#ff6fa5')).join('') },
      { z: .5, svg: fgGrass(150, 1150, 1.7, t) + fgShell(1750, 1050, 1.6, -20), blur: 9 }]); },
  sfx: [[0, 'el:chime', .8], [.2, 'sparkle', .6], [.5, 'el:crowd_aww', .4], [.8, 'el:wave_crash', .3]] }, at(35, 'magnifique'));

// B036 — profil : position de sprinteuse, bandeau, GPS en pointillés jusqu'à la mer
B(36, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .5 }),
  draw: t => { const hx = 520 + 148 * 2, hy = 760 - 51 * 2 + wave(t, 1.1, 6, 1);
    return depth({ zoom: 1 }, [...a2_beach(t, { hz: 380, sy: 540 }), { z: 1, svg: path(`M950 700Q1250 520 ${lerp(950, 1600, seg(t, .2, 1))} 520`, 'none', 12, '#fff', 'stroke-dasharray="26 26"') + G(tr(1620, 520, pop(t, 1)), line(0, 0, 0, -220, 10) + path('M0 -220L120 -180L0 -140Z', '#7be07b')) +
      tor({ x: 520, y: 760, s: 2, expr: 'smugger', squash: .12 + .05 * Math.sin(t * 6), headTilt: wave(t, 1, 8) }, t) + G(tr(hx, hy - 30, 1, wave(t, 1, 8)), path('M-130 -40Q0 -80 130 -40', 'none', 30, '#ff4d4d') + path('M-130 -40Q0 -80 130 -40', 'none', 30 - 14, '#ff6b6b')) + tag(1420, 220, 'OBJECTIF', t, .9, '#7be07b', OL, 58) },
      { z: .5, svg: fgGrass(1800, 1160, 1.5, t), blur: 9 }]); },
  sfx: [[0, 'whoosh', .6], [.2, 'tick', .5], [.5, 'el:patter', .4], [1.0, 'ding', .8]] });

// B037 — très large, léger travelling : elle minuscule à gauche… la mer tout là-bas à droite, « ≈ 30 m »
B(37, { enter: 'none', cam: () => ({ z: 1.0, hand: .2 }),
  draw: (t, d) => { const c = camMove(t, d, { x: -160, zoom: 1.08 }, { x: 160, zoom: 1.02 });
    const ground = rect(-1800, 640, W + 3600, 900, SAND, 0, 0) + path(`M1560 600Q1500 700 1600 820L${W + 1800} 820L${W + 1800} 600Z`, '#fff', 0) + path(`M1610 590Q1560 690 1660 800L${W + 1800} 800L${W + 1800} 590Z`, SEA, 0) + path(`M1610 590Q1560 690 1660 800`, 'none', 10, '#fff') + Array.from({ length: 4 }, (_, i) => path(`M${1720 + i * 60} ${620 + i * 40}q30 -12 60 0`, 'none', 5, 'rgba(255,255,255,.6)')).join('');
    return depth(c, [{ z: 6, svg: a2_parts(t, { hz: 560, sy: 700 }).sky }, { z: 2.5, svg: path(`M-1800 680Q-600 520 400 600T2200 560L${W + 1800} 700L-1800 700Z`, '#e8c690', 0) },
      { z: 1, svg: ground + Array.from({ length: 30 }, (_, i) => ell(-1500 + i * 190, 720 + (i % 4) * 60, 10, 5, SAND_W, 0)).join('') + tor({ x: 260, y: 700, s: .6, expr: 'happy', walk: .8 }, t) + G(tr(lerp(-200, 1500, t / d), 690 - Math.abs(Math.sin(t * 6)) * 40), tumbleweed(0, 0, .5, t * 500)) +
        line(420, 560, 1560, 560, 10, '#fff') + path(`M460 530L420 560L460 590M1520 530L1560 560L1520 590`, 'none', 10, '#fff') + tag(990, 450, '≈ 30 MÈTRES', t, .3, '#fff', OL, 64) },
      { z: .5, svg: fgDune(-100, 1000, 900, 220) + fgDune(2100, 980, 900, 240), blur: 8 }]); },
  sfx: [[0, 'whoosh_up', .6], [.3, 'pop', .7], [.8, 'el:a_wind', .5], [1.4, 'hmm', .4]] });

// B038a — gros plan : « Facile ! » clin d'œil, pouce levé, dent qui brille
B(38, { enter: 'punch', cam: camPush(1.0, 1.08, .4),
  draw: t => depth({ zoom: 1 }, [{ z: 3, svg: a2_parts(t, { hz: 420, sy: 620 }).sky + a2_parts(t, { hz: 420, sy: 620 }).sea, blur: 5 }, { z: 1.5, svg: a2_parts(t, { hz: 420, sy: 620 }).sand, blur: 3 },
    { z: 1, svg: torF({ x: 860, y: 860, r: 150, expr: 'smugger', armL: 200, armR: -35 + wave(t, 2, 6) }, t) + sparkle(880, 600, pop(t, .4) * .7, '#fff') + tag(1450, 250, 'FACILE !', t, .1, '#7be07b', OL, 80) }]),
  sfx: [[0, 'ding', .7], [.4, 'glint', .9], [.6, 'whistle', .4]] });
// B038b — rêverie rose : la maternité idéale, berceau, mobile… (pour l'instant)
B(38, { enter: 'none', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d) }),
  draw: (t, d) => { const Mt = at(38, 'maternite') - at(38, 'sauf');
    return grad('#ffe1ef', '#ffd1e6', -200, -200, W + 400, H + 400) + bokeh(t, 6, 12, ['#fff', '#ffc2dd', '#ffe9f3']) + G(tr(1000, 140), line(-240, 0, 240, 0, 6) + [-200, -60, 80, 220].map((x, i) => line(x, 0, x, 120 + i % 2 * 40, 4) + sparkle(x, 140 + i % 2 * 40, .5, ['#ffd23f', '#9fdcff'][i % 2], wave(t, .5, 20, i / 4))).join('')) +
      torF({ x: 1000, y: 820, r: 110, expr: 'zen', armL: 210, armR: -30 }, t) + crib(1000, 840, 1.5) + Array.from({ length: 3 }, (_, i) => heart(1200 + i * 50, 500 - ((t * 60 + i * 40) % 160), .4, '#ff6fa5')).join('') +
      G(tr(470, 400, pop(t, Mt), -4), line(0, 100, 0, 420, 14) + rect(-250, -110, 500, 220, '#fff', 24) + text(0, -10, 'none', 'MATERNITÉ', '#ff6fa5', 64) + heart(0, 60, .55)); },
  sfx: [[0, 'el:chime', .7], [.2, 'angel', .5], [at(38, 'maternite') - at(38, 'sauf'), 'pop', .7], [at(38, 'maternite') - at(38, 'sauf') + .1, 'el:baby_squeak', .4]] }, at(38, 'sauf'));

// B039 — contre-plongée : néon « BUFFET À VOLONTÉ », crabes géants en bavoir, mouettes affamées
B(39, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), cy: 500, r: 5, hand: .4 }),
  draw: t => { const B = at(39, 'buffet'), on = t > B && (t > B + .3 || Math.floor(t * 20) % 2);
    return depth({ zoom: 1 }, [{ z: 4, svg: a2_parts(t, { hz: 820, sy: 900, sunX: 300, sunY: 500 }).sky }, { z: 2, svg: a2_parts(t, { hz: 820, sy: 900 }).sea },
      { z: 1, svg: G(tr(CX, 230), line(-420, 0, -420, 700, 18) + line(420, 0, 420, 700, 18) + rect(-520, -120, 1040, 240, '#2b2b33', 30) + text(0, 30, 'none', 'BUFFET À VOLONTÉ', on ? '#ff4d6d' : '#5a3a44', 80, on ? 'style="filter:drop-shadow(0 0 14px #ff4d6d)"' : '')) +
        eagle({ x: 1250, y: 70, s: .6, gull: 1, expr: 'starving', bib: 1, flip: 1 }, t) + crab({ x: 470, y: 800, s: 1.6, bib: 1, fork: 1, mouth: 'grin', snapF: 9 }, t) + crab({ x: 1450, y: 820, s: 1.7, bib: 1, flip: 1, snapF: 7, angry: 1 }, t) + tor({ x: 860, y: 660, s: 1.0, expr: 'terror', tremble: 1 }, t) },
      { z: .5, svg: fgShell(150, 1050, 1.8, 10) + fgGrass(1800, 1180, 1.6, t), blur: 9 }]); },
  sfx: [[0, 'el:hit_cine', .6], [at(39, 'buffet'), 'lightbuzz', .6], [at(39, 'buffet') + .05, 'kaching', .8], [at(39, 'volonte'), 'el:crab', .7], [at(39, 'volonte') + .2, 'el:gull', .6]] });

// B040a — plongée : les crabes guettent depuis leurs trous, l'un aiguise ses pinces (étincelles)
B(40, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.08, 1.0, t / d), r: -4 }),
  draw: t => { let s = sandTop(t, 15) + a2_tint('rgba(255,170,120,.12)');
    for (const [x, y, i] of [[350, 280, 0], [1550, 260, 1], [420, 820, 2], [1500, 830, 3], [980, 180, 4]]) s += ell(x, y, 80, 46, '#7d5f38', 0) + G(tr(x, y - 20), line(-22, 0, -26, -60, 9) + line(22, 0, 26, -60, 9) + circ(-28, -70, 18, '#fff') + circ(28, -70, 18, '#fff') + circ(-28 + Math.sin(t * 2 + i) * 5, -68, 7, OL, 0) + circ(28 + Math.sin(t * 2 + i) * 5, -68, 7, OL, 0) + line(-46, -96, -12, -84, 6) + line(46, -96, 12, -84, 6));
    s += crab({ x: 1350, y: 560, s: .7, angry: 1, snap: .5 + .5 * Math.sin(t * 20) }, t) + G(tr(1250, 470, 1, 30), knife(0, 0, .8)) + sparkle(1290, 450, .4 * Math.abs(Math.sin(t * 20)), '#ffd23f') + sparkle(1230, 500, .3 * Math.abs(Math.cos(t * 20)), '#fff');
    return s + torT({ x: 860, y: 560, s: 1.1, tremble: 1 }, t) + sweat(960, 400, .8); },
  sfx: [[0, 'el:crab_scuttle', .7], [at(40, 'crabes'), 'el:crab', .7], [.6, 'scratch', .5], [.8, 'glint', .7], [1.1, 'scratch', .5]] });
// B040b — POV des oiseaux : jumelles braquées sur elle, « CIBLE »
B(40, { enter: 'whip', cam: () => ({ z: 1.03, hand: .9 }), overlay: (t) => a2_binoc(t) + G(tr(CX - 420, 290), text(0, 0, 'none', '● REC', '#ff3b30', 44)) + G(tr(CX + 420, 290, pop(t, .4)), text(0, 0, 'none', 'CIBLE', '#ff3b30', 50)),
  draw: (t, d) => depth({ x: -wave(t, .3, 60), zoom: 1.2 }, [...a2_beach(t, { hz: 360, sy: 520 }).map(L => Object.assign({}, L, { blur: L.z > 1 ? 3 : 0 })),
    { z: 1, svg: tor({ x: 820 + t * 60, y: 640, s: 1.5, expr: 'worried', walk: 1, look: [-.5, 0] }, t) + crab({ x: 1500, y: 740, s: .6, snapF: 9 }, t) }]),
  sfx: [[0, 'shutter', .6], [.1, 'el:gull', .7], [.4, 'zap', .4], [.7, 'el:wings', .4]] }, at(40, 'des', 2));

// B041a — plan moyen : naïve, coquille sur la tête, elle fait coucou au crabe… qui cache sa fourchette
B(41, { cam: camPush(1.0, 1.06, .4),
  draw: t => { const hx = 560 + 148 * 1.8, hy = 700 - 51 * 1.8;
    return depth({ zoom: 1 }, [...a2_beach(t, { hz: 380, sy: 540 }), { z: 1, svg: tor({ x: 560, y: 700, s: 1.8, expr: 'happy', flipUp: 1, fa: -60 + wave(t, 2, 25) }, t) + a2_shellHat(hx - 10, hy - 110, 1.6, -10) +
      crab({ x: 1420, y: 780, s: 1.3, mouth: 'grin', snap: .3 }, t) + G(tr(1600, 680, 1, 30), fork(0, 0, .9)) + G(tr(900, 380, pop(t, .2)), text(0, 0, OL, 'coucou !', '#fff', 60)) + G(tr(1420, 470, pop(t, .6)), text(0, 0, OL, 'hé hé', '#fff', 50)) },
      { z: .5, svg: fgGrass(120, 1170, 1.6, t), blur: 9 }]); },
  sfx: [[0, 'el:baby_squeak', .7], [.3, 'kiss', .4], [.7, 'el:crab', .4], [1.1, 'hmm', .4]] });
// B041b — entretien d'embauche : crabe RH à lunettes, elle sue à grosses gouttes
B(41, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), r: -2 }),
  draw: t => grad('#d9ecf5', '#c3dcea', -200, -200, W + 400, H + 400) + rect(260, 120, 560, 380, '#8fd3ff', 16) + rect(260, 330, 560, 170, SEA, 0, 0) + rect(260, 120, 560, 380, 'none', 16) + line(540, 120, 540, 500, 7) + plant(1750, 820, .9) +
    tor({ x: 330, y: 740, s: 1.7, expr: 'embarrassed', tremble: .5, hold: rect(-40, -60, 80, 110, '#fff', 6, 5) }, t) + sweat(720, 480, .9) + sweat(780, 560, .7) +
    crab({ x: 1300, y: 640, s: 1.1, mouth: 'flat', snap: .2 }, t) + circ(1258, 530, 28, 'rgba(255,255,255,.3)', 6) + circ(1342, 530, 28, 'rgba(255,255,255,.3)', 6) + line(1286, 530, 1314, 530, 6) + desk(1300, 800, 1.6) + G(tr(1150, 770, 1, -8), rect(-80, -50, 160, 100, '#fff', 6, 5)) +
    G(tr(1300, 230, pop(t, .3)), rect(-260, -70, 520, 130, '#fff', 30) + text(0, 22, 'none', 'Expérience ?', OL, 56)),
  sfx: [[0, 'whoosh', .6], [.2, 'el:typing', .5], [.4, 'pop', .6], [1.2, 'hmm', .6], [1.6, 'squeak', .4]] }, at(41, 'viens'));
// B041c — insert CV : « EXPÉRIENCE : AUCUNE », tampon « DÉBUTANTE TOTALE », grillons
B(41, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: Math.abs(t - (at(41, 'professionnelle') - at(41, 'aucune'))) < .15 ? 10 : 0 }),
  draw: t => { const P = at(41, 'professionnelle') - at(41, 'aucune');
    return rect(-200, -200, W + 400, H + 400, '#c58e55', 0, 0) + G(tr(CX, 0, 1, -2), rect(-460, 60, 920, 1100, '#fff', 14) + text(0, 170, 'none', 'CURRICULUM VITAE', OL, 56) + rect(-380, 230, 200, 210, '#cfe9ff', 10, 5) + G(tr(-280, 435), torF({ x: 0, y: 0, r: 46, expr: 'embarrassed' }, t)) +
      line(-140, 270, 360, 270, 10, '#ddd') + line(-140, 320, 300, 320, 10, '#ddd') + line(-140, 370, 330, 370, 10, '#ddd') + text(-170, 620, 'none', 'Expérience :', '#555', 54) + G(tr(200, 618, pop(t, 0)), text(0, 0, OL, 'AUCUNE', '#e2463a', 76))) +
      (t > P ? G(tr(CX + 120, 380, lerp(2, 1, eOutCubic(seg(t, P, P + .15))), -14), rect(-330, -70, 660, 140, 'rgba(255,255,255,.2)', 20, 10, '#e2463a') + text(0, 24, 'none', 'DÉBUTANTE TOTALE', '#e2463a', 62)) : '') + (t > P + .3 ? cricket(1650, 900, .6, t) : ''); },
  sfx: [[0, 'el:record', .6], [.05, 'error_beep', .6], [at(41, 'professionnelle') - at(41, 'aucune'), 'hammer', .9], [at(41, 'professionnelle') - at(41, 'aucune') + .3, 'crickets', .7]] }, at(41, 'aucune'));

// ============================================================
//  LA COURSE — crabes, oiseaux
// ============================================================
function a2_claw(x, y, s, open, r = 0, c = '#ef6a3e') { return G(tr(x, y, s, r), line(0, 0, 400, 0, 70) + line(0, 0, 400, 0, 54, c) + ell(-40, 0, 130, 95, c) + G(`rotate(${-open * 35})`, path('M-60 -30C-200 -150 -330 -80 -320 -10L-90 10Z', c)) + G(`rotate(${open * 25})`, path('M-60 30C-200 120 -300 90 -300 40L-90 20Z', shade(c, -.2)))); }
// B042 — profil : une sœur sautille en chantonnant… CLAC ! une pince géante surgit du cadre
B(42, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: .6, shake: t > at(42, 'attrape') && t < at(42, 'attrape') + .3 ? 12 : 0 }),
  draw: t => { const A = at(42, 'attrape'), g = t > A, k = eOutCubic(seg(t, A - .15, A)), up = seg(t, A + .2, A + .9);
    return depth({ zoom: 1 }, [...a2_beach(t, { hz: 360, sy: 520 }), { z: 1.8, svg: tor({ x: 300, y: 640, s: 1, expr: g ? 'terror' : 'happy', walk: g ? 0 : .8 }, t), blur: 3 },
      { z: 1, svg: (g ? '' : sib({ x: 640 + t * 200, y: 760 - Math.abs(Math.sin(t * 7)) * 30, s: 1.7, expr: 'happy', walk: 1, seed: 4 }, t) + G(tr(1000 + t * 200, 480 - t * 60), text(0, 0, OL, '♪ ♫', '#fff', 64))) +
        a2_claw(lerp(2500, 1500, k) - up * 200, 620 - up * 260, 1.4, g ? .05 : 1) + (g ? G(tr(1100 - up * 280, 600 - up * 360, 1, -20), sib({ x: 0, y: 0, s: 1.4, expr: 'panic', flail: 1, seed: 4 }, t)) + impactStar(1160, 520, .7 * (1 - seg(t, A, A + .3))) + G(tr(1450, 260, pop(t, A)), text(0, 0, OL, 'CLAC !', '#ff6b6b', 100)) : '') },
      { z: .5, svg: fgShell(180, 1060, 1.6, 10), blur: 9 }]); },
  sfx: [[0, 'el:patter', .5], [.2, 'whistle', .4], [at(42, 'attrape') - .15, 'whoosh', .8], [at(42, 'attrape'), 'snip', 1], [at(42, 'attrape') + .05, 'el:crab', .8], [at(42, 'attrape') + .2, 'el:baby_squeak', .7]] });
// B043 — plan large : elle s'enfonce dans le trou… il ne reste qu'un petit drapeau blanc. Plop.
B(43, { cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4 }),
  draw: t => { const D = at(43, 'disparait'), k = eInCubic(seg(t, D, D + .7)), id = 'a2h' + (_gid++);
    return depth({ zoom: 1 }, [...a2_beach(t, { hz: 380, sy: 540 }), { z: 1, svg: ell(1200, 820, 190, 56, '#7d5f38', 0) + `<defs><clipPath id="${id}"><rect x="-900" y="-900" width="4000" height="${900 + 820}"/></clipPath></defs><g clip-path="url(#${id})">` +
        sib({ x: 1180, y: 800 + k * 260, s: 1.3, expr: 'panic', flail: 1, rot: -10, seed: 4 }, t) + G(tr(1260, 640 + k * 300, 1, wave(t, 2, 15)), line(0, 0, 0, 160, 8) + path('M0 0L90 20L0 50Z', '#fff')) + `</g>` +
        (k >= 1 ? sandFlying(1200, 800, t, 12) + G(tr(1200, 600, pop(t, D + .7)), text(0, 0, OL, 'plop.', '#fff', 64)) : '') + tor({ x: 420, y: 760, s: 1.4, expr: 'sob' }, t) },
      { z: .5, svg: fgGrass(1800, 1170, 1.6, t), blur: 9 }]); },
  sfx: [[at(43, 'disparait'), 'el:dig', .7], [at(43, 'disparait') + .5, 'gulp', .8], [at(43, 'disparait') + .7, 'el:sand_pop', .8], [at(43, 'disparait') + .9, 'el:crowd_aww', .5]] });

// B044a — gros plan caméra épaule : elle court en pleurant, larmes à l'horizontale
B(44, { enter: 'whip', cam: () => ({ z: 1.06, hand: 1.3 }),
  draw: t => depth({ x: t * 900, zoom: 1 }, [{ z: 4, svg: a2_parts(t, { hz: 420, sy: 600 }).sky }, { z: 2.4, svg: a2_parts(t, { hz: 420, sy: 600 }).sea, blur: 3 }, { z: 1, svg: a2_parts(t, { hz: 420, sy: 600 }).sand, blur: 6 }]) + streaks(t, -1, 12) +
    torF({ x: CX, y: 860 - Math.abs(Math.sin(t * 9)) * 25, r: 150, expr: 'sob', armL: 220 + wave(t, 4.5, 40), armR: -40 - wave(t, 4.5, 40) }, t) + sweat(CX + 230, 480, 1) + motionLines(CX - 300, 560, 3, 90, 180),
  sfx: [[0, 'el:patter', 1], [.2, 'el:crowd_aww', .3], [.5, 'squeak', .4], [.8, 'el:patter', .7]] });
// B044b — une mouette pique droit sur la caméra, bave au vent
B(44, { enter: 'crash', cam: () => ({ z: 1.04, shake: 6 }),
  draw: t => { const k = eInCubic(seg(t, 0, .8));
    return grad('#ffc9a0', '#bfe6ff', -200, -200, W + 400, H + 400) + glow(1400, 300, 500, '#fff3b0', .6) + cloud(400, 220, 1.2) + speedLines(t, CX, 520, 26, 'rgba(255,255,255,.6)') +
      eagleFront({ x: CX + 200 * (1 - k), y: lerp(300, 600, k), s: lerp(.3, 2.0, k), gull: 1, expr: 'starving', talons: 1 }, t) + a2_lensDrops(t, .7, 5, 8); },
  sfx: [[0, 'el:dive', 1], [.2, 'el:gull', .9], [.6, 'whoosh', .8]] }, at(44, 'un'));

// B045 — contre-plongée à contre-jour : la mouette remonte avec un bébé qui gigote, plumes qui tombent
B(45, { enter: 'tilt', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), r: -6, cy: 400 }),
  draw: (t, d) => { const k = seg(t, 0, d);
    return grad('#ff9f7a', '#ffe0b0', -200, -200, W + 400, H + 400) + glow(700, 380, 500, '#fff3b0', .8) + circ(700, 380, 120, '#fff3b0', 0) + rays(t, 700, 380, 'rgba(255,240,190,0)', 'rgba(255,240,190,.3)', 18) +
      eagle({ x: lerp(1000, 1500, k), y: lerp(560, 220, k), s: 1.2, gull: 1, expr: 'happy', flap: 2.5, flip: 1, held: sib({ x: 0, y: 0, s: .7, expr: 'panic', flail: 1, rot: 15, seed: 6 }, t) }, t) +
      Array.from({ length: 4 }, (_, i) => G(tr(1100 + i * 90 + wave(t, .6, 40, i / 4), 300 + ((t * 200 + i * 120) % 500), 1, wave(t, .8, 40, i / 3)), path('M0 -30Q14 0 0 30Q-14 0 0 -30Z', '#fff', 4))).join('') +
      path(`M-200 1100L-200 960Q500 900 960 940T${W + 200} 900L${W + 200} 1100Z`, '#d9a86a', 0) + G(tr(1600, 160, pop(t, .9)), text(0, 0, OL, 'BYE…', '#fff', 60)); },
  sfx: [[0, 'el:wings', .9], [.2, 'el:gull', .8], [.5, 'el:baby_squeak', .7], [1.0, 'whoosh_up', .5]] });

// B046 — plongée : TURBO ! flammes aux fesses, traînée de sable
B(46, { enter: 'whip', cam: () => ({ z: 1.06, shake: 7, hand: .8 }),
  draw: t => { const x = 700 + t * 500;
    return G(tr(-t * 1800 % 600, 0), sandTop(t, 17)) + a2_tint('rgba(255,170,120,.12)') + streaks(t, 1, 14) + sandFlying(x - 260, 560, t * 2, 14) + G(tr(x - 200, 540, 1, -90), flames(0, 0, 140, 260, t, 3)) + torT({ x, y: 540, s: 1.6, rot: 90, walk: 10 }, t) + tag(CX, 150, 'TURBO', t, .1, '#ff8a3d', '#fff', 80); },
  sfx: [[0, 'el:patter', 1], [.05, 'fire', .6], [.1, 'whoosh', .9], [.5, 'el:patter', .7]] });

// ============================================================
//  L'AIGLE AFFAMÉ
// ============================================================
// B047 — « Et c'est là… » : arrêt net, les couleurs s'éteignent, zoom brutal
B(47, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.25, eOutCubic(seg(t, 0, d))) }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#2b2238', 0, 0) + `<path d="M${CX - 120} -60L${CX + 120} -60L${CX + 460} 1100L${CX - 460} 1100Z" fill="rgba(255,240,180,.2)"/>` + torF({ x: CX, y: 860, r: 150, expr: 'shock', armL: 210, armR: -30 }, t) + emark(CX + 260, 330, pop(t, .05)),
  sfx: [[0, 'sting', .9], [.05, 'el:record', .5]] });
// B048a — profil : l'aigle traverse le ciel en bavoir, la bave en traînée, le ventre qui gargouille
B(48, { enter: 'whip', cam: () => ({ z: 1.02, hand: .4 }),
  draw: (t, d) => { const x = lerp(1500, 750, t / d);
    return depth({ x: -t * 200, zoom: 1 }, [{ z: 6, svg: grad('#7a5aa8', '#ffb38a', -900, -900, W + 1800, H + 1800) }, { z: 3, svg: Array.from({ length: 5 }, (_, i) => cloud(-400 + i * 600, 200 + (i % 2) * 300, 1.2, '#ffd9c7')).join(''), haze: .2 },
      { z: 1, svg: eagle({ x, y: 430, s: 1.6, expr: 'starving', bib: 1, flap: 1.8 }, t) + Array.from({ length: 8 }, (_, i) => circ(x + 120 + i * 70, 560 + i * 30 + wave(t, 2, 8, i / 8), 12 - i, '#bfe8ff', 3, '#7cc4e8')).join('') + G(tr(x + 120, 300, pop(t, .5), 10), text(0, 0, OL, 'GRRRBLL', '#fff', 60)) },
      { z: .5, svg: cloud(((t * -1600) % 2400) + 2200, 900, 2.2, '#ffe2d4'), blur: 10 }]); },
  sfx: [[0, 'el:wings', .8], [.2, 'el:eagle', .8], [.5, 'growl', 1], [1.0, 'el:munch', .4]] });
// B048b — crash zoom de face : l'aigle affamé, couteau-fourchette, bave à flots, « LE RETOUR »
B(48, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), shake: 4, bars: 1 }),
  draw: t => rays(t, CX, 480, '#3b2a4f', '#55396e', 24) + glow(CX, 480, 500, '#ff5d73', .3) + eagleFront({ x: CX, y: 650, s: 1.4, expr: 'starving', bib: 1, flap: 1.8 }, t) +
    fork(360, 560, 1.6, -25 + wave(t, 2, 10)) + knife(1560, 560, 1.6, 25 - wave(t, 2, 10)) + bigText(['LE RETOUR'], t, .3, CX, 200, '#ffd23f', 100) + a2_lensDrops(t, .9, 4, 11),
  sfx: [[0, 'el:hit_cine', 1], [.1, 'el:eagle2', 1], [.5, 'growl', .8], [1.0, 'el:munch', .6]] }, at(48, 'reg'));

// B049a — POV de l'aigle : vue de chasse, le viseur verrouille la petite tortue qui court
B(49, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.2, t / d), cx: 900, cy: 560, hand: .5 }), overlay: t => povEagle(t, 900 + t * 120, 560, seg(t, .1, .7)),
  draw: t => sandTop(t, 9) + a2_tint('rgba(255,170,120,.12)') + ell(900 + t * 120, 600, 50, 20, 'rgba(0,0,0,.15)', 0) + torT({ x: 900 + t * 120, y: 560, s: .5, rot: 90, walk: 6 }, t) + crab({ x: 400, y: 300, s: .25 }, t) + crab({ x: 1500, y: 800, s: .25 }, t) + sibT({ x: 300, y: 820, s: .4, rot: 80, walk: 4 }, t),
  sfx: [[0, 'el:eagle', .7], [.2, 'el:riser', .4], [.65, 'ding', .7]] });
// B049b — plan large au ras du sol : l'ombre passe, tout s'assombrit, elle se fait pipi dessus
B(49, { enter: 'none', cam: (t, d) => ({ z: 1.04, hand: .8, shake: t > .5 ? 2 : 0 }),
  draw: (t, d) => { const sx = lerp(-500, W + 500, seg(t, 0, d)), dk = Math.max(0, 1 - Math.abs(sx - 960) / 700);
    return depth({ zoom: 1 }, [...a2_beach(t, { hz: 380, sy: 540 }), { z: 1, svg: birdShadow(sx, 800, 3.4, .45) + tor({ x: 820, y: 700, s: 1.9, expr: 'terror', look: [0, -1], tremble: 1.5, pee: seg(t, .3, 1.1), neck: .8 }, t) + emark(1250, 420, pop(t, .2), '#ff4d4d', 10) },
      { z: .5, svg: fgGrass(1800, 1170, 1.6, t), blur: 9 }]) + a2_tint(`rgba(10,0,30,${(.45 * dk).toFixed(2)})`); },
  sfx: [[0, 'el:wings', .9], [.1, 'whoosh', .8], [.4, 'el:crowd_gasp', .4], [.6, 'spray', .4], [.8, 'heartbeat', .7]] }, at(49, 'passe'));

// B050 — gros plan épaule : virage en dérapage, fumée, « SCRIIIK »
B(50, { enter: 'whip', cam: () => ({ z: 1.06, hand: 1.5, shake: 3 }),
  draw: t => { const D = at(50, 'direction'), tn = t > D;
    return depth({ x: (tn ? -1 : 1) * t * 400, zoom: 1 }, [{ z: 4, svg: a2_parts(t, { hz: 420, sy: 600 }).sky }, { z: 2.4, svg: a2_parts(t, { hz: 420, sy: 600 }).sea, blur: 3 }, { z: 1, svg: a2_parts(t, { hz: 420, sy: 600 }).sand, blur: 6 }]) +
      G(`translate(${CX} 0) scale(${tn ? -1 : 1} 1) translate(${-CX} 0)`, torF({ x: CX, y: 860, r: 150, expr: 'panic', look: [-1, 0], armL: 250, armR: -70, rot: tn ? 0 : -8 }, t) + motionLines(CX + 300, 560, 4, 120, 0)) +
      (tn ? [0, 1, 2, 3].map(i => circ(CX - 200 + i * 130, 960 - i * 10, 60 + 50 * seg(t, D, D + .5), 'rgba(255,255,255,.7)', 0)).join('') + G(tr(CX + 420, 300, pop(t, D), 8), text(0, 0, OL, 'SCRIIIK', '#fff', 90)) : ''); },
  sfx: [[0, 'el:patter', .8], [at(50, 'direction') - .05, 'brake', .3], [at(50, 'direction'), 'squeak', 1], [at(50, 'direction') + .05, 'whoosh', .8]] });

// B051 — contre-plongée : il pique, il grossit… « encore » : crash, bave sur l'objectif
B(51, { enter: 'drop', cam: (t, d) => ({ z: 1.02, cy: 300, r: 5, shake: t > at(51, 'encore') ? 10 : 3 }),
  draw: t => { const E = at(51, 'encore'), s = t < E ? lerp(.5, 1.1, eInCubic(seg(t, 0, E))) : lerp(1.6, 2.4, eOutCubic(seg(t, E, E + .5)));
    return grad('#ffb38a', '#9fd8ff', -200, -200, W + 400, H + 400) + glow(400, 200, 400, '#fff3b0', .6) + cloud(300, 300, 1.3) + cloud(1600, 160, 1.1) + speedLines(t, CX, 400, 28, 'rgba(255,255,255,.55)') +
      eagleFront({ x: CX, y: 560, s, expr: 'starving', talons: 1, flap: 2 }, t) + (t > E ? G(tr(1560, 200, pop(t, E), 10), text(0, 0, OL, 'ENCORE !', '#ff4d4d', 80)) : '') + a2_lensDrops(t, E + .1, 6, 5) +
      path(`M-200 1100L-200 1000Q600 940 1100 980T${W + 200} 960L${W + 200} 1100Z`, '#d9a86a', 0); },
  sfx: [[0, 'el:dive', 1], [.3, 'el:eagle', .8], [at(51, 'encore'), 'el:hit_cine', .8], [at(51, 'encore') + .05, 'el:eagle2', .9], [at(51, 'encore') + .3, 'spray', .5]] });

// B052a — RALENTI (letterbox), plongée : l'ombre l'avale, les serres descendent au ralenti
function a2_talons(x, y, s, open) { let g = ''; for (const sd of [-1, 1]) g += G(tr(sd * 150, 0, 1, sd * 8), line(0, -900, 0, 0, 60) + line(0, -900, 0, 0, 40, '#ffc93c') + [-45, 0, 45].map(a => G(`rotate(${a * (.3 + open) + 90})`, path('M0 0L90 0Q130 10 136 56', 'none', 34) + path('M0 0L90 0', 'none', 18, '#ffc93c'))).join('')); return G(tr(x, y, s), g); }
B(52, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), bars: 1, hand: .3 }),
  draw: (t, d) => { const k = seg(t, 0, d);
    return sandTop(t * .1, 19) + a2_tint('rgba(30,30,60,.35)') + birdShadow(CX, 600, lerp(2, 4, k), .45 + .2 * k) + torT({ x: CX, y: 580, s: 1.3, walk: .3 }, t * .1) + sweat(CX + 100, 420, .9) + sweat(CX - 110, 440, .7) +
      a2_talons(CX, lerp(-60, 330, k), .9, 1 - k * .3); },
  sfx: [[0, 'el:riser', .9], [.1, 'heartbeat', .9], [.8, 'heartbeat', .9], [.9, 'el:wings', .4]] });
// B052b — très gros plan au ralenti : gouttes de sueur suspendues, pipi, les serres à quelques centimètres
B(52, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.14, t / d), bars: 1 }),
  draw: (t, d) => { const k = seg(t, 0, d);
    return grad('#6a5c7a', '#b9a4a0', -200, -200, W + 400, H + 400) + rect(-200, 820, W + 400, 400, '#9c8664', 0, 0) +
      torF({ x: CX, y: 910, r: 140, expr: 'terror', look: [0, -1], armL: 240, armR: -60, tremble: .3, pee: k }, t * .08) + [[-300, 480], [280, 430], [-220, 330], [330, 560], [-380, 620]].map(([x, y]) => sweat(CX + x, y, .9)).join('') +
      a2_talons(CX, lerp(-60, 200, k), 1.1, .9) + G(tr(1600, 220), text(0, 0, OL, 'ralenti…', '#fff', 50)); },
  sfx: [[0, 'heartbeat', 1], [.3, 'el:inhale', .6], [.6, 'heartbeat', 1]] }, at(52, 'serres'));

// B053 — la VAGUE explose : flash, rouleau géant, écume plein cadre
B(53, { enter: 'crash', flash: 1, cam: () => ({ z: 1.08, shake: 14 }),
  draw: t => { const k = eOutCubic(seg(t, 0, .6)), f = seg(t, .35, .8);
    return depth({ zoom: 1 }, [...a2_beach(t, { hz: 360, sy: 520 }), { z: 1, svg: torF({ x: 760, y: 860, r: 120, expr: 'shock', armL: 230, armR: -50 }, t) + a2_talons(800, 140 - k * 200, .7, .5) +
      G(tr(lerp(2100, 300, k), 0), path('M0 1300L0 520C0 200 300 40 560 160C700 220 710 380 600 440C520 480 460 420 480 360C320 400 280 560 330 680L1900 1300Z', '#4fc3e6') + path('M0 520C0 200 300 40 560 160C700 220 710 380 600 440', 'none', 40, '#fff')) +
      op(f, rect(-900, -900, W + 1800, H + 1800, 'rgba(240,252,255,.92)', 0, 0) + Array.from({ length: 16 }, (_, i) => circ((i * 233) % W, 200 + (i * 151) % 800, 60 + (i % 4) * 30, '#fff', 0)).join('')) + shockRing(900, 600, t, .3, '#fff') + bigText(['SPLAAASH !'], t, .3, CX, 200, '#5ec4f0', 130) }]); },
  sfx: [[0, 'el:wave_crash', 1], [.1, 'el:hit_cine', .7], [.3, 'el:splash', .9], [.5, 'boom', .4]] });

// B054a — dans le rouleau, profil : elle tourne comme dans une machine à laver… et kiffe
B(54, { enter: 'none', cam: () => ({ z: 1.06, hand: 1 }),
  draw: t => { let sw = ''; for (let i = 0; i < 6; i++) sw += G(tr(CX, 540, 1, t * 200 + i * 60), path(`M${150 + i * 60} 0A${150 + i * 60} ${150 + i * 60} 0 0 1 0 ${150 + i * 60}`, 'none', 14, 'rgba(255,255,255,.45)'));
    return grad('#6fd6ef', '#1f7fae', -200, -200, W + 400, H + 400) + sw + fgBubbles(t, 5, 12) + G(tr(CX, 520, 1, t * 420), tor({ x: 0, y: 70, s: 1.6, expr: t < .7 ? 'dizzy' : 'ecstatic', flail: 1 }, t)) + (t > .7 ? G(tr(1500, 250, pop(t, .7), 8), text(0, 0, OL, 'WOUHOU !', '#fff', 70)) : ''); },
  sfx: [[0, 'el:splash', .7], [.1, 'el:bubbles', .8], [.4, 'el:swim_whoosh', .6], [.7, 'el:baby_squeak', .6]] });
// B054b — l'aigle rate : il se plante bec le premier dans le sable, pattes en l'air, le crabe se tord de rire
B(54, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: .4, shake: Math.abs(t - (at(54, 'rate') - at(54, 'l'))) < .2 ? 12 : 0 }),
  draw: t => { const R_ = at(54, 'rate') - at(54, 'l'), k = eInCubic(seg(t, 0, R_)), hit = t > R_;
    return depth({ zoom: 1 }, [...a2_beach(t, { hz: 360, sy: 520 }), { z: 1, svg: eagle({ x: lerp(1500, 1150, k), y: lerp(200, 690, k), s: 1.3, rot: lerp(-30, -95, k), expr: 'shock', talons: hit ? 'open' : 'grab', wingA: hit ? 30 + wave(t, 3, 30) : -20 }, t) +
      path('M840 900Q1080 640 1320 900Z', SAND_D, 6) + (hit ? impactStar(1080, 760, .8 * (1 - seg(t, R_, R_ + .3))) + sandFlying(1080, 780, t, 14) + stars(1200, 430, t, 5, 130) + G(tr(1500, 260, pop(t, R_)), text(0, 0, OL, 'RATÉ !', '#ff4d4d', 100)) : '') +
      crab({ x: 400, y: 790, s: 1, mouth: 'grin', rot: hit ? wave(t, 3, 12) : 0 }, t) + (hit ? G(tr(400, 560, pop(t, R_ + .1)), text(0, 0, OL, 'HA HA', '#fff', 56)) : '') },
      { z: .5, svg: fgShell(1780, 1050, 1.6, 20), blur: 9 }]); },
  sfx: [[0, 'el:dive', .7], [at(54, 'rate') - at(54, 'l'), 'thud', 1], [at(54, 'rate') - at(54, 'l') + .05, 'el:eagle', .8], [at(54, 'rate') - at(54, 'l') + .1, 'boing', .7], [at(54, 'rate') - at(54, 'l') + .3, 'rimshot', .7]] }, at(54, 'l'));

// B055a — plan large : elle flotte, ultra chill, lunettes de soleil, cocktail, cœurs
B(55, { enter: 'none', cam: (t, d) => ({ z: 1.0, hand: .15 }),
  draw: (t, d) => { const c = camMove(t, d, { y: 0, zoom: 1.0 }, { y: -20, zoom: 1.1 }); const p = a2_parts(t, { hz: 400, sy: 1400, sunX: 1400, sunY: 260 });
    return depth(c, [{ z: 6, svg: p.sky }, { z: 1, svg: p.sea + G(tr(CX, 660 + wave(t, .4, 14), 1, wave(t, .4, 5)), tor({ x: 0, y: 0, s: 1.6, expr: 'chill', face: { eyes: 'shades', mouth: 'bliss' }, swim: .2, hold: G(tr(0, 0, .6), path('M-40 -60L40 -60L0 20Z', '#8fe0ff', 6) + line(0, 20, 0, 80, 6)) }, t) + ell(0, 20, 220, 30, 'rgba(255,255,255,.5)', 0)) +
      Array.from({ length: 4 }, (_, i) => heart(1100 + i * 70, 500 - ((t * 50 + i * 45) % 180), .45, '#ff6fa5')).join('') + G(tr(560, 300, pop(t, .4), -6), text(0, 0, OL, 'chiiiiill…', '#fff', 80)) },
      { z: .5, svg: fgBubbles(t, 2, 5), blur: 8 }]); },
  sfx: [[0, 'el:a_beach', .6], [.2, 'el:chime', .5], [.6, 'waves', .5], [1.4, 'kiss', .3]] });
// B055b — médaille d'or « JOUR 1 ✔ », feux d'artifice
B(55, { enter: 'punch', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: t => rays(t, CX, 520, '#ffe9a8', '#ffd36b', 24) + confetti(t, 0, 50, 8) + Array.from({ length: 3 }, (_, i) => { const k = seg((t + i * .4) % 1.2, 0, .8); return G(tr(300 + i * 660, 300 + (i % 2) * 120), Array.from({ length: 10 }, (_, j) => line(Math.cos(j * .628) * 40 * k, Math.sin(j * .628) * 40 * k, Math.cos(j * .628) * 140 * k, Math.sin(j * .628) * 140 * k, 10, ['#ff6fa5', '#5ec4f0', '#7be07b'][i])).join('')); }).join('') +
    torF({ x: CX, y: 880, r: 150, expr: 'proud', armL: 240, armR: -60 }, t) + a2_medal(CX, 760, 1.2, t) + bigText(['JOUR 1 ✔'], t, .1, CX, 150, '#7be07b', 120),
  sfx: [[0, 'tada', .9], [.1, 'el:applause', .6], [.4, 'pop', .6], [.8, 'pop_hi', .6]] }, at(55, 'premier'));

// B056 — disque rayé : gros plan blasé, la médaille glisse, chrono « 00:07 »
B(56, { enter: 'none', cam: (t, d) => ({ z: lerp(1.06, 1.12, t / d) }),
  draw: t => { const P = at(56, 'premieres');
    return rect(-200, -200, W + 400, H + 400, '#a9b4bf', 0, 0) + torF({ x: 700, y: 860, r: 150, expr: 'deadpan', armL: 200, armR: -20 }, t) + a2_medal(700, lerp(760, 1200, eInCubic(seg(t, .3, 1.2))), 1.2, 0) +
      G(tr(1380, 380, pop(t, .2)), circ(0, 0, 200, '#fff') + circ(0, 0, 200, 'none', 14, '#2b2b33') + rect(-30, -250, 60, 50, '#2b2b33', 10) + text(0, 30, 'none', '00:07', '#ff5d4d', 90)) + (t > P ? tag(1380, 680 - 60, 'MINUTES', t, P, '#ff5d4d', '#fff', 60) : ''); },
  sfx: [[0, 'el:record', 1], [.2, 'tick', .8], [.6, 'tick', .8], [at(56, 'premieres'), 'error_beep', .6], [1.2, 'thud', .4]] });

// B057 — contre-plongée sous l'eau : sa silhouette contre la surface lumineuse
B(57, { enter: 'none', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), cy: 300, r: -4 }),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { surface: 160 }), { z: 1, svg: glow(CX, 160, 600, '#fff', .45) + G(tr(CX + t * 80, 360, 1, -10), tor({ x: 0, y: 0, s: 1.5, expr: 'shock', swim: 1.2 }, t)) },
    { z: .5, svg: fgBubbles(t, 8, 6), blur: 8 }]),
  sfx: [[0, 'el:plunge', 1], [.15, 'el:bubbles', .7], [.4, 'el:m_underwater', .3], [.6, 'sting', .5]] });
// B058 — plongée vertigineuse : minuscule dans le bleu immense, des ombres rôdent dessous
B(58, { enter: 'none', cam: (t, d) => ({ z: lerp(1.6, 1.0, eOutCubic(seg(t, 0, d))), cy: 480 }),
  draw: t => grad('#2a9fd0', '#061a33', -200, -200, W + 400, H + 400) + Array.from({ length: 9 }, (_, i) => `<path d="M${-300 + i * 300} -100L${-200 + i * 300} -100L${100 + i * 300} ${H + 100}L${0 + i * 300} ${H + 100}Z" fill="rgba(255,255,255,.04)"/>`).join('') +
    op(.55, shark({ x: 1350 - t * 200, y: 860, s: .9, color: '#0b2a48', flip: 1 }, t).replace(/fill="#[0-9a-f]{6}"/g, 'fill="#0b2a48"').replace(/stroke="#2b2420"/g, 'stroke="#0b2a48"')) + op(.4, shark({ x: 400 + t * 150, y: 980, s: .7, color: '#0b2a48' }, t).replace(/fill="#[0-9a-f]{6}"/g, 'fill="#0b2a48"')) +
    fgBubbles(t, 4, 6) + torT({ x: CX, y: 480, s: .7, swim: 1 }, t) + tag(CX, 150, "BIENVENUE DANS L'OCÉAN", t, at(58, 'ocean'), '#1f7fae', '#fff', 56),
  sfx: [[0, 'el:bubbles', .7], [.2, 'el:m_underwater', .4], [at(58, 'ocean'), 'el:sonar', .6], [.6, 'el:shark', .3]] });
