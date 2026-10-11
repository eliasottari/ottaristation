// ============================================================
//  B059–B121 (V2 « ciné ») : tout le monde veut te manger, les sargasses, la respiration,
//  les années, le chill, le sac plastique, le filet, la remontée.
//  Préfixe des aides de ce fichier : b_
// ============================================================

// ---------- aides de la section ----------
// premier plan sous-marin flou (bulles + kelp)
const b_fg = (t, o = {}) => ({ z: o.z ?? .5, blur: o.blur ?? 9, svg: fgBubbles(t, o.seed ?? 3, o.n ?? 6) + (o.kelp === false ? '' : fgKelp(o.kx ?? 60, 1300, o.ks ?? 1.3, t) + (o.k2 !== false ? fgKelp(o.k2 ?? 1900, 1300, 1.15, t, '#26694a') : '')) });
// ciel / eau en couches (marges larges pour la parallaxe)
function b_sky(wl, c1 = '#8fd3ff', c2 = '#e4f6ff') { return grad(c1, c2, -900, -900, W + 1800, wl + 960) + glow(1500, 120, 340, '#fff3b0', .5) + circ(1500, 120, 60, '#fff3b0', 0) + cloud(380, 150, .9) + cloud(1150, 90, .7) + cloud(-250, 190, .8) + cloud(2150, 130, .8); }
function b_water(t, wl, o = {}) {
  let s = grad(o.w1 || '#4cc3e3', o.w2 || '#14588a', -900, wl, W + 1800, H - wl + 900);
  for (let i = 0; i < 7; i++) { const x = -300 + i * 380 + wave(t, .05, 50, i / 5); s += `<path d="M${x} ${wl}L${x + 90} ${wl}L${x + 380} ${H + 600}L${x + 160} ${H + 600}Z" fill="rgba(255,255,255,.07)"/>`; }
  return s + b_surf(t, wl);
}
const b_surf = (t, wl, c = 'rgba(255,255,255,.65)') => path(`M-900 ${wl}` + Array.from({ length: 38 }, (_, k) => `q50 ${f1(wave(t, .5, 8, k / 5) - 12)} 100 0`).join('') + `L${W + 900} ${wl + 26}L-900 ${wl + 26}Z`, c, 0);
// eau devant un perso (le corps sous la ligne d'eau paraît immergé)
const b_waterFront = (t, wl, a = .38) => `<rect x="-900" y="${wl}" width="${W + 1800}" height="${H + 900}" fill="rgba(40,150,205,${a})"/>` + b_surf(t, wl, 'rgba(255,255,255,.55)');
// pipi de peur sous l'eau : nuage jaune (pudique)
function b_pee(x, y, k, t) { if (k <= 0) return ''; let s = ''; for (let i = 0; i < 6; i++) s += circ(x - i * 26 * k + wave(t, .6, 6, i / 6), y + wave(t, .5, 8, i / 4) - i * 6, (26 + i * 8) * k, 'rgba(255,220,60,.5)', 0); return s; }
// joues gonflées (apnée) : r = rayon de tête, (cx, hy) = centre de la tête
function b_puff(cx, hy, r, k = 1, t = 0) { const p = 1 + .06 * Math.sin(t * 9); return [-1, 1].map(sd => ell(cx + sd * r * .6, hy + r * .3, r * .3 * k * p, r * .25 * k * p, '#ff9fb0', 6) + ell(cx + sd * r * .66, hy + r * .22, r * .08 * k, r * .05 * k, 'rgba(255,255,255,.7)', 0)).join(''); }
// regards lumineux dans le noir
function b_eyes(x, y, s, t, seed = 0, c = '#fff36b') { const bl = ((t + seed * .7) % 2.4) < .1; return G(tr(x, y, s), bl ? line(-40, 0, -10, 0, 6, c) + line(10, 0, 40, 0, 6, c) : glow(0, 0, 90, c, .25) + ell(-26, 0, 20, 14, c, 0) + ell(26, 0, 20, 14, c, 0) + circ(-24, 2, 6, OL, 0) + circ(28, 2, 6, OL, 0) + line(-46, -22, -10, -12, 6, c) + line(46, -22, 10, -12, 6, c)); }
// poisson affamé (bavoir + bave)
function b_hfish(o, t) { const k = (t * 1.3 + (o.seed || 0)) % 1; return G(tr(o.x, o.y, o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''), fish({ x: 0, y: 0, s: 1, teeth: 1, color: o.color, tf: 5 }, t) + G(tr(-40, 46, .38), bib(0, 0)) + path(`M-78 28q-4 ${30 + k * 60} 2 ${40 + k * 70}`, 'none', 7, 'rgba(190,232,255,.95)') + circ(-76, 72 + k * 70, 7, '#bfe8ff', 3, '#7cc4e8')); }
// POV du requin : dents en haut et en bas, vignette, viseur
function b_povShark(t, tx, ty, lock = 1, label = 'SNACK') {
  const id = 'bps' + (_gid++), o = .85 + .15 * Math.sin(t * 5);
  let s = `<rect width="${W}" height="${H}" fill="rgba(0,40,70,.22)"/><defs><radialGradient id="${id}" cx="${W / 2}" cy="${H / 2}" r="${W * .6}" gradientUnits="userSpaceOnUse"><stop offset=".45" stop-color="#001424" stop-opacity="0"/><stop offset="1" stop-color="#001424" stop-opacity=".85"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  const gum = 46 * o, th = 120 * o;
  let top = rect(-20, -20, W + 40, gum + 20, '#8a2b3a', 0), bot = rect(-20, H - gum, W + 40, gum + 20, '#8a2b3a', 0);
  for (let x = -40; x < W + 40; x += 128) { top += path(`M${x} ${gum}L${x + 64} ${gum + th}L${x + 128} ${gum}Z`, '#fffbea', 6); bot += path(`M${x + 64} ${H - gum}L${x + 128} ${H - gum - th}L${x + 192} ${H - gum}Z`, '#fffbea', 6); }
  const r = lerp(250, 110, lock), rot = (1 - lock) * 120 + t * 25;
  s += G(tr(tx, ty, 1, rot), circ(0, 0, r, 'none', 7, '#ff3b30') + [0, 90, 180, 270].map(a => G(`rotate(${a})`, line(r - 30, 0, r + 40, 0, 8, '#ff3b30'))).join(''));
  if (lock >= 1) s += G(tr(tx, ty - r - 60, pop(t, .1)), text(0, 0, OL, label, '#ff3b30', 64));
  return s + top + bot;
}
// algues flottantes vues de dessus
function b_sargTop(x, y, s, t, seed = 1) { const r = rng(seed); let g = ''; for (let i = 0; i < 16; i++) { const a = r() * 360, l = 60 + r() * 90; g += G(tr(0, 0, 1, a + wave(t, .3, 6, r())), path(`M0 0Q${l * .5} -20 ${l} 0`, 'none', 20) + path(`M0 0Q${l * .5} -20 ${l} 0`, 'none', 10, '#c99a3c') + circ(l, 0, 12, '#e0b24a', 4) + circ(l * .55, -12, 9, '#e0b24a', 4)); } return G(tr(x, y, s), circ(0, 0, 70, '#b8862e') + g + circ(-20, -10, 14, '#e0b24a', 4) + circ(24, 16, 12, '#e0b24a', 4)); }
// surface vue de dessus
function b_waterTop(t, c1 = '#3fb6d9', c2 = '#1f7fae', glint = 'rgba(255,255,255,.45)') { let s = grad(c1, c2, -900, -900, W + 1800, H + 1800); const r = rng(9); for (let i = 0; i < 26; i++) { const x = -200 + r() * (W + 400), y = -200 + r() * (H + 400); s += path(`M${f1(x + wave(t, .3, 20, r()))} ${f1(y)}q40 -14 80 0t80 0`, 'none', 6, glint); } return s; }
// fond sableux vu de dessus (sous l'eau)
function b_floorTop(t) { let s = grad('#d9c48e', '#b9a372', -900, -900, W + 1800, H + 1800); const r = rng(14); for (let i = 0; i < 40; i++) s += ell(-300 + r() * (W + 600), -300 + r() * (H + 600), 10 + r() * 30, 6 + r() * 14, 'rgba(120,100,60,.18)', 0); for (let i = 0; i < 8; i++) { const x = -200 + i * 320 + wave(t, .1, 40, i); s += `<path d="M${x} -300L${x + 140} -300L${x + 420} ${H + 300}L${x + 200} ${H + 300}Z" fill="rgba(255,255,255,.08)"/>`; } return s + `<rect x="-900" y="-900" width="${W + 1800}" height="${H + 1800}" fill="rgba(40,140,190,.25)"/>`; }
// radiographie vue de dessus (k = gonflement, red = alerte)
function b_lungs(x, y, s, t, k = 1, red = 0) {
  const col = lerpColor('#ff9db5', '#ff3b3b', red), ln = lerpColor('#bfe9ff', '#ffb3b3', red);
  let g = ell(0, 0, 230, 290, 'rgba(160,220,255,.18)', 7, ln) + circ(0, -360, 90, 'rgba(160,220,255,.18)', 7, ln);
  for (const sd of [-1, 1]) g += G(tr(sd * 200, -170, 1, sd * 25), ell(0, 0, 90, 34, 'none', 6, ln)) + G(tr(sd * 170, 220, 1, -sd * 30), ell(0, 0, 60, 26, 'none', 6, ln));
  for (const sd of [-1, 1]) g += G(tr(sd * 80, -60, .55 + .45 * k), glow(0, 0, 200, col, .35) + path(`M0 -150C${sd * 110} -150 ${sd * 120} 40 ${sd * 60} 150C${sd * 10} 170 ${-sd * 10} 120 0 80Z`, col, 6));
  g += path('M0 -270L0 -150', 'none', 14, ln);
  return G(tr(x, y, s), g);
}
// jauge d'oxygène
function b_o2(x, y, s, k, label = 'O₂', t = 0) {
  const col = k > .5 ? '#5fd068' : k > .25 ? '#ffb340' : '#ff4d4d', bl = k < .25 && Math.sin(t * 14) > 0;
  return G(tr(x, y, s), (bl ? glow(0, 0, 320, '#ff3b30', .5) : '') + rect(-70, -220, 140, 440, '#fff', 30) + rect(-52, -200 + 400 * (1 - k), 104, Math.max(4, 400 * k), col, 18, 0) + rect(-70, -220, 140, 440, 'none', 30) + rect(-30, -250, 60, 34, '#fff', 8) + (label ? text(0, -280, OL, label, '#fff', 70) : ''));
}
function b_net(t, o = {}) { return net(o.x ?? CX, o.y ?? -40, o.w ?? 2400, o.h ?? 1200, t, Object.assign({ n: 18, sw: 7 }, o)); }
// tortue adulte prise dans le filet (cordes autour de la nageoire)
function b_tangled(x, y, s, t, o = {}) {
  let g = torA(Object.assign({ x: 0, y: 0, s: 1, expr: 'scared', flail: o.calm ? 0 : 1 }, o), t);
  g += path('M60 -20C120 40 200 0 240 60M90 -60C160 -10 230 -40 260 20M30 10C110 80 220 60 280 110M-160 -20C-120 30 -60 10 0 40', 'none', 9, 'rgba(235,235,220,.95)');
  return G(tr(x, y, s), g);
}
// bulles qui montent (depuis la bouche)
function b_bub(x, y, t, n = 6, sp = 1, sz = 1) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * .9 * sp + i / n) % 1; s += circ(x + wave(t, 1, 16, i / n), y - k * 420, (8 + k * 16) * sz, 'rgba(255,255,255,.35)', 4, 'rgba(255,255,255,.85)'); } return s; }
// notes de musique
function b_notes(x, y, t, n = 4) { let s = ''; for (let i = 0; i < n; i++) { const k = (t * .5 + i / n) % 1; s += op(Math.sin(k * Math.PI), G(tr(x + wave(t, .6, 40, i / n) + i * 60, y - k * 300, .8 + k * .4, wave(t, .8, 15, i / 3)), ell(0, 0, 22, 16, '#fff', 5) + line(18, -4, 18, -80, 7) + path('M18 -80q30 10 26 40', 'none', 7))); } return s; }
// cocktail à ombrelle
function b_cocktail(x, y, s = 1, r = 0) { return G(tr(x, y, s, r), line(14, -60, 46, -130, 7, '#ff6fa5') + path('M-56 -62L56 -62L0 14Z', 'rgba(255,170,90,.95)') + path('M-40 -50L40 -50', 'none', 5, 'rgba(255,255,255,.7)') + line(0, 14, 0, 74, 9) + line(-34, 76, 34, 76, 9) + G(tr(-26, -110, 1, -20), path('M-50 0Q0 -60 50 0Z', '#5ec4f0', 5) + path('M-16 0Q0 -50 16 0', 'none', 4) + line(0, 0, 10, 50, 4)) + circ(-38, -66, 12, '#7be07b', 4)); }
// bouée donut : moitié arrière / avant
const b_ringB = (x, y, rx, ry) => path(`M${x - rx} ${y}A${rx} ${ry} 0 0 1 ${x + rx} ${y}`, 'none', 70 + 14) + path(`M${x - rx} ${y}A${rx} ${ry} 0 0 1 ${x + rx} ${y}`, 'none', 70, '#ff6fa5');
const b_ringF = (x, y, rx, ry) => path(`M${x - rx} ${y}A${rx} ${ry} 0 0 0 ${x + rx} ${y}`, 'none', 70 + 14) + path(`M${x - rx} ${y}A${rx} ${ry} 0 0 0 ${x + rx} ${y}`, 'none', 70, '#ff6fa5') + [-.6, 0, .6].map(a => { const px = x + Math.sin(a) * rx, py = y + Math.cos(a) * ry; return line(px - 14, py - 30, px + 6, py + 30, 22, '#fff'); }).join('');
function b_mug(x, y, s = 1, t = 0) { return G(tr(x, y, s), path('M40 -30q40 0 40 30t-40 30', 'none', 12) + rect(-40, -50, 80, 100, '#ff8fb1', 14) + heart(0, 0, .45, '#fff') + steam(0, -70, t, .5)); }
function b_sailorHat(x, y, s = 1) { return G(tr(x, y, s), ell(0, 10, 110, 30, '#fff') + path('M-80 10Q-80 -70 0 -70Q80 -70 80 10Z', '#fff') + rect(-80, -10, 160, 24, '#3a6fd8', 4, 5)); }
function b_map(x, y, s = 1, r = 0) { return G(tr(x, y, s, r), rect(-120, -80, 240, 160, '#fff4d6', 6) + path('M-90 40Q-40 -50 10 10T90 -40', 'none', 6, '#e2463a').replace('stroke-linecap', 'stroke-dasharray="14 12" stroke-linecap') + path('M76 -54L104 -26M104 -54L76 -26', 'none', 8, '#e2463a')); }
function b_flag(x, y, s, t) { return G(tr(x, y, s), line(0, 0, 0, -220, 10) + path(`M0 -220Q60 ${-240 + wave(t, 2, 14)} 130 -220L130 -140Q60 ${-160 + wave(t, 2, 14, .3)} 0 -140Z`, '#fff')); }
function b_alarm(x, y, s, t, ring = 1) { const sh = ring ? Math.sin(t * 50) * 6 : 0; return G(tr(x + sh, y, s, sh), circ(-70, -110, 34, '#ffd23f') + circ(70, -110, 34, '#ffd23f') + wallClock(0, 0, 120, t * 3) + line(-70, 120, -90, 160, 12) + line(70, 120, 90, 160, 12) + (ring ? motionLines(-170, -60, 3, 50, 180) + motionLines(170, -60, 3, 50, 0) : '')); }
function b_tally(x, y, n, t, t0) { let s = rect(-260, -150, 520, 300, '#3c5a48', 14) + text(0, -80, 'none', 'SURVIES', '#fff', 50); for (let i = 0; i < n; i++) { const k = i === n - 1 ? seg(t, t0, t0 + .25) : 1, gx = -170 + (i % 5) * 70 + Math.floor(i / 5) * 40; if (i % 5 === 4) s += line(gx - 300, 40, gx - 300 + 330 * k, -10 + 80 * (1 - k), 10, '#fff'); else s += line(gx, -20, gx, -20 + 120 * k, 10, '#fff'); } return G(tr(x, y), s); }
function b_boatTop(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M0 -320C110 -220 130 0 120 260L-120 260C-130 0 -110 -220 0 -320Z', '#e2463a') + path('M0 -270C80 -190 96 0 88 230L-88 230C-96 0 -80 -190 0 -270Z', '#f4efe2', 5) + rect(-70, -60, 140, 160, '#fff', 12) + rect(-50, -40, 100, 50, '#bfe3f5', 8, 5) + circ(0, 180, 26, '#ffd23f')); }
// petit aliment (algue) râleur
function b_food(x, y, s, t, c = '#7cc46a') { return G(tr(x, y + wave(t, 3, 4, x / 300), s), circ(0, 0, 50, c) + path('M-30 -40q-10 -40 10 -50M10 -46q10 -40 30 -36', 'none', 8, c) + line(-28, -20, -8, -12, 7) + line(28, -20, 8, -12, 7) + circ(-18, -4, 6, OL, 0) + circ(18, -4, 6, OL, 0) + path('M-14 22Q0 12 14 22', 'none', 6)); }
// panneau d'options (application « TORTUE MARINE »)
function b_toggle(x, y, s, on, t = 0, err = 0) { const jx = err ? Math.sin(t * 40) * 8 : 0; return G(tr(x, y, s), rect(-80, -36, 160, 72, on ? '#5fd068' : err ? '#ff9b9b' : '#cfd6dc', 36) + circ((on ? 44 : -44) + jx, 0, 28, '#fff', 5)); }
// texte contrat
const b_tiny = (x, y) => text(x, y, 'none', '* respiration sous l\'eau non incluse', '#e2463a', 22);

// ============================================================
//  L'OCÉAN : tout le monde veut te manger
// ============================================================
// B059a — grue qui plonge dans le grand bleu : bébé émerveillée, bancs de poissons
B(59, { enter: 'tilt', cam: () => ({ z: 1, hand: .3 }),
  draw: (t, d) => { const c = camMove(t, d + .9, { y: -120, zoom: 1 }, { y: 30, zoom: 1.1 }, eOutCubic);
    return depth(c, [...underLayers(t, { floor: 1000, seed: 4 }),
      { z: 1.7, svg: Array.from({ length: 14 }, (_, i) => fish({ x: ((2200 - t * 160 - i * 140) % 2400) - 200, y: 260 + (i % 4) * 60 + wave(t, .5, 20, i / 7), s: .32, color: ['#ffb347', '#ff8fb1', '#ffd23f'][i % 3], tf: 4 }, t)).join(''), haze: .2, hazeCol: '#5fc6e6' },
      { z: 1, svg: tor({ x: 780 + t * 70, y: 600, s: 1.35, expr: 'wow', swim: 1.2, rot: -6 }, t) + stars(1000, 420, t, 6, 240) + sparkle(1450, 300, .8 * pop(t, .6)) + sparkle(560, 360, .6 * pop(t, 1.1)) },
      b_fg(t, { seed: 5 })]); },
  sfx: [[0, 'el:plunge', .7], [.2, 'el:chime', .8], [at(59, 'decouvrir'), 'sparkle', .6], [1.5, 'el:fish_school', .4]] });
// B059b — crash zoom « merveilleux » : yeux étoiles… et un aileron passe derrière, flou
B(59, { enter: 'crash', cam: camPush(1.02, 1.1, .5),
  draw: t => depth({ zoom: 1 }, [{ z: 5, svg: rays(t, CX, 560, '#bff0ff', '#8fdcf5', 24) },
    { z: 2.4, svg: op(.8, shark({ x: 2300 - t * 900, y: 420, s: .9, jaw: .1, color: '#3d6c8c' }, t)), blur: 5 },
    { z: 1, svg: torF({ x: CX, y: 900, r: 150, expr: 'ecstatic', armL: 230 + wave(t, 2, 20), armR: -50 - wave(t, 2, 20), headTilt: wave(t, 1, 6) }, t) + stars(CX, 330, t, 8, 360) + heart(560, 380 - t * 80, .8) + heart(1380, 460 - t * 60, .7) + sparkle(1500, 220, pop(t, .2), '#fff') }]),
  sfx: [[0, 'el:hit_cine', .5], [.05, 'magic', .7], [.3, 'el:baby_squeak', .7], [.6, 'sting', .3]] }, at(59, 'merveilleux'));

// B060a — profil : elle nage, ravie… des dizaines d'yeux s'allument dans le noir ; TOUT LE MONDE VEUT TE MANGER (pipi de peur)
B(60, { enter: 'whip', cam: camPush(1.0, 1.1, .7),
  draw: t => { const E = at(60, 'tout'), M = at(60, 'manger'), k = seg(t, M, M + .3);
    const eyes = [[200, 260], [420, 900], [1620, 220], [1780, 620], [260, 600], [1400, 920], [1120, 160], [640, 150], [1720, 860], [90, 860]];
    return depth({ x: wave(t, .3, 20), zoom: 1 }, [...underLayers(t, { dark: .35 + .3 * k, seed: 7 }),
      { z: 1.4, svg: eyes.map(([x, y], i) => op(seg(t, E + i * .08, E + i * .08 + .15), b_eyes(x, y, .9 + (i % 3) * .2, t, i))).join(''), blur: 1 },
      { z: 1, svg: b_pee(780, 600, seg(t, M + .2, M + 1), t) + tor({ x: 820, y: 660, s: 1.6, expr: k > .5 ? 'terror' : 'happy', swim: k > .5 ? 0 : 1, tremble: k, look: [-1, 0] }, t) + bigText(['TOUT LE MONDE', 'VEUT TE MANGER'], t, M - .05, CX, 130, '#ff5d5d', 96) },
      b_fg(t, { seed: 8, kelp: false })]); },
  sfx: [[0, 'el:swim_whoosh', .5], [at(60, 'tout'), 'sting', .8], [at(60, 'monde'), 'growl', .6], [at(60, 'manger'), 'el:hit_cine', .9], [at(60, 'manger') + .3, 'spray', .3]] });
// B060b — contre-plongée : gang de poissons à dents, bavoirs, fourchettes, bave
B(60, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), cy: 300, hand: .6 }),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { dark: .3, seed: 3 }),
    { z: 1, svg: b_hfish({ x: 1500, y: 500, s: 2.4, color: '#ff8a3d', seed: .2 }, t) + b_hfish({ x: 930, y: 380, s: 2.0, color: '#9b6bd6', seed: .5 }, t) + b_hfish({ x: 420, y: 560, s: 2.2, color: '#ffd23f', flip: 1, seed: .8 }, t) +
      fork(1180, 330, 1.2, -20) + knife(240, 330, 1.2, 20) + G(tr(960, 150, pop(t, .15)), text(0, 0, OL, 'MIAM !', '#fff', 80)) },
    b_fg(t, { seed: 2, kelp: false, n: 4 })]),
  sfx: [[0, 'el:chomp_water', .9], [.1, 'chomp', .7], [.3, 'growl', .5]] }, at(60, 'poissons') - .1);

// B061 — très large : un requin GÉANT traverse au premier plan ; la petite, minuscule, au fond
B(61, { enter: 'crash', cam: () => ({ z: 1.04, shake: 5 }),
  draw: t => depth({ x: -t * 120, zoom: 1 }, [...underLayers(t, { dark: .25, floor: 1000, seed: 9 }),
    { z: 2.2, svg: tor({ x: 960, y: 640, s: .7, expr: 'terror', tremble: 1 }, t) + emark(1090, 520, .5), haze: .15, hazeCol: '#4aa6cc' },
    { z: 1, svg: shark({ x: lerp(2500, -500, t / 1.06), y: 560, s: 2.7, jaw: .8 }, t) + streaks(t, -1, 8, 'rgba(255,255,255,.4)') },
    b_fg(t, { seed: 6, kelp: false })]),
  sfx: [[0, 'el:shark', 1], [.05, 'whoosh', .9], [.4, 'el:chomp_water', .6]] });

// B062a — POV DU REQUIN : mâchoires dans le cadre, le viseur verrouille la petite
B(62, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.3, eInOut(t / d)), cx: 960, cy: 560, hand: .5 }),
  overlay: t => b_povShark(t, 960, 560, seg(t, .1, 1.1), 'SNACK') + G(tr(960, 230), text(0, 0, OL, 'PROIE : BÉBÉ TORTUE', '#ff6b5e', 46)),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { dark: .2, floor: 980, seed: 12 }), { z: 1, svg: tor({ x: 900, y: 600, s: .9, expr: 'happy', swim: 1 }, t) }]),
  sfx: [[0, 'el:shark', .7], [.2, 'el:sonar', .7], [.6, 'heartbeat', .6], [1.1, 'ding', .7]] });
// B062b — « contrairement à toi » : elle lit sa carte à l'envers, nage à reculons… BONK
B(62, { enter: 'whip', cam: (t, d) => ({ z: 1.06, r: 5, hand: .7 }),
  draw: t => { const b = t > .75;
    return depth({ zoom: 1 }, [...underLayers(t, { floor: 960, seed: 2 }),
      { z: 1, svg: fgRock(1420, 840, 2.4, '#7d8a8f') + tor({ x: b ? 1080 : 760 + t * 420, y: 700, s: 1.7, flip: 0, expr: b ? 'dizzy' : 'confused', swim: b ? 0 : .8, hold: b_map(0, 0, .55, 180), headTilt: b ? 20 : 0, rot: b ? 10 : 0 }, t) + (b ? impactStar(1440, 500, .5) + stars(1300, 470, t, 5, 110) : qmark(1300, 380, .8 * pop(t, .1))) },
      b_fg(t, { seed: 4 })]); },
  sfx: [[0, 'whoosh', .6], [.2, 'hmm', .7], [.75, 'thud', 1], [.8, 'boing', .7]] }, at(62, 'contrairement'));
// B062c — contre-plongée : le requin PRO, monocle, diplôme, sourire satisfait
B(62, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.02, 1.12, t / d), cy: 700, r: -4, bars: 1 }),
  draw: t => depth({ x: wave(t, .2, 30), zoom: 1 }, [...underLayers(t, { dark: .15, seed: 5 }),
    { z: 1, svg: glow(1150, 520, 600, '#fff6c8', .35) + shark({ x: 1180, y: 640, s: 1.6, jaw: .15 }, t) + G(tr(1180, 640, 1.6), circ(-170, -40, 36, 'rgba(255,255,255,.35)', 7) + path('M-140 -20Q-110 40 -60 60', 'none', 4, '#c9a227')) +
      G(tr(470, 330, pop(t, .2), -8), rect(-220, -130, 440, 260, '#fffbe8', 12) + rect(-200, -110, 400, 220, 'none', 0, 5, '#c9a227') + text(0, -40, 'none', 'DIPLÔME', '#c9a227', 60) + text(0, 30, 'none', 'Prédateur', OL, 48) + circ(150, 80, 30, '#e2463a', 5)) +
      sparkle(1050, 470, pop(t, .9) * .7, '#fff') + tag(1500, 220, 'PRO', t, at(62, 'parfaitement') - at(62, 'savent'), '#5fd068', OL, 70) },
    b_fg(t, { seed: 9, k2: false })]),
  sfx: [[0, 'el:hit_cine', .5], [.25, 'pop', .7], [.9, 'glint', .8], [at(62, 'parfaitement') - at(62, 'savent'), 'ding', .8], [1.4, 'el:chomp_water', .4]] }, at(62, 'savent'));

// B063 — contre-plongée : elle fonce vers la lumière, nageoires en hélice ; le requin remonte derrière, fourchette en main
B(63, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: 1.2 }),
  draw: t => depth({ y: -t * 60, zoom: 1 }, [...underLayers(t, { surface: 120, seed: 6 }),
    { z: 1, svg: speedLines(t, 960, 120, 26, 'rgba(255,255,255,.4)') + b_bub(900, 560, t, 7, 2) + tor({ x: 960, y: 640 - t * 60, s: 1.7, rot: -70, swim: 5, expr: 'terror' }, t) + sweat(1150, 300, 1) + sweat(780, 330, .8) },
    { z: .65, svg: G(tr(1040, 1150 - t * 120, 1, -80), shark({ x: 0, y: 0, s: 1.3, jaw: .7 }, t)) + fork(1400, 980 - t * 120, 1.6, 20), blur: 4 }]),
  sfx: [[0, 'el:swim_whoosh', 1], [.3, 'whoosh_up', .7], [.8, 'el:swim_whoosh', .8], [1.2, 'el:bubbles', .6], [1.4, 'el:shark', .4]] });

// B064 — plongée verticale : la surface vue d'en haut, elle se jette dans un îlot de sargasses ; ombre du requin dessous
B(64, { enter: 'tilt', cam: (t, d) => ({ z: lerp(1.0, 1.12, eInOut(t / d)), r: lerp(8, 0, eOutCubic(t / d)) }),
  draw: t => { const A = at(64, 'algues'), k = eInOut(seg(t, 0, A)), hid = seg(t, A - .2, A + .1);
    return b_waterTop(t) + op(.28, G(tr(lerp(1900, 300, t / 2.2), 800, 1.4, 20), shark({ x: 0, y: 0, s: 1, jaw: .3, color: '#0c3550' }, t).replace(/stroke="#2b2420"/g, 'stroke="none"'))) +
      b_sargTop(1600, 260, 1.1, t, 3) + b_sargTop(300, 820, 1.3, t, 5) +
      b_sargTop(960, 560, 2.0, t, 8) + op(1 - hid, torT({ x: lerp(420, 960, k), y: lerp(1000, 600, k), s: lerp(1.4, .8, k), rot: 40 * (1 - k), swim: 4 }, t)) +
      (hid > .5 ? G(tr(960, 540), circ(-34, 0, 24, '#fff', 5) + circ(34, 0, 24, '#fff', 5) + circ(-30 + Math.sin(t * 3) * 8, 2, 10, OL, 0) + circ(38 + Math.sin(t * 3) * 8, 2, 10, OL, 0)) : '') +
      (hid > .5 ? G(tr(1180, 400, pop(t, A + .2)), text(0, 0, OL, 'chut…', '#fff', 60)) : ''); },
  sfx: [[0, 'whoosh', .6], [.4, 'el:swim_whoosh', .7], [at(64, 'algues') - .1, 'el:splash', .7], [at(64, 'algues'), 'el:bag_rustle', .4], [1.6, 'tiptoe', .6]] });

// B065a — sous les sargasses : perruque d'algues, regard en coin ; le requin passe derrière, perdu
B(65, { enter: 'none', cam: (t, d) => ({ z: lerp(1.06, 1.0, t / d), hand: .4 }),
  draw: t => depth({ x: -t * 40, zoom: 1 }, [...underLayers(t, { surface: 230, seed: 3 }),
    { z: 2.2, svg: shark({ x: lerp(-300, 1500, t / 1.5), y: 640, s: .9, jaw: .1, flip: 1 }, t) + qmark(lerp(-300, 1500, t / 1.5) + 120, 470, .6), blur: 3, haze: .2, hazeCol: '#4aa6cc' },
    { z: 1, svg: sargassum(CX, 240, 2600, t, 21) + tor({ x: 860, y: 560, s: 1.7, expr: 'smugger', look: [-1, 0], bob: 0 }, t) + G(tr(1112, 400, .45), sargassum(0, 0, 360, t, 4)) },
    b_fg(t, { seed: 11, kelp: false })]),
  sfx: [[0, 'el:bubbles', .5], [.3, 'tiptoe', .7], [.8, 'el:shark', .4], [1.2, 'hmm', .5]] });
// B065b — « ta maison » : hamac d'algues, mug fumant, lampe-poisson, panneau MAISON, cœurs
B(65, { enter: 'whip', cam: camPush(1.0, 1.08, .3),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { surface: 150, seed: 8 }),
    { z: 1.5, svg: glow(560, 420, 300, '#ffe9a0', .5) + G(tr(560, 420), circ(0, 0, 44, '#fff3b0', 6) + line(0, -44, 0, -260, 6)) + sargassum(CX, 160, 2600, t, 13), blur: 2 },
    { z: 1, svg: line(640, 160, 680, 600, 12, '#b8862e') + line(1300, 160, 1260, 600, 12, '#b8862e') + path('M680 600Q970 820 1260 600', 'none', 26) + path('M680 600Q970 820 1260 600', 'none', 16, '#c99a3c') +
      tor({ x: 880, y: 700, s: 1.4, expr: 'zen', rot: -8, hold: b_mug(0, 0, .8, t), bob: .5 }, t) + heart(1230, 380 - (t * 60) % 120, .6) + heart(1300, 470 - (t * 50) % 100, .45) +
      G(tr(1520, 300, pop(t, .5), wave(t, .5, 4)), line(0, -140, 0, -60, 6) + rect(-150, -60, 300, 110, '#a0522d', 18) + text(0, 22, 'none', 'MAISON', '#fff', 54)) + G(tr(1300, 230, pop(t, 1.0)), heart(0, 0, 1.1)) }]),
  sfx: [[0, 'whoosh', .6], [.3, 'el:chime', .6], [.5, 'pop', .7], [1.0, 'kiss', .5], [1.4, 'baby_coo', .5]] }, at(65, 'ces'));

// B066a — profil serré : elle sirote… scratch ! elle se fige, le mug penche
B(66, { enter: 'none', cam: (t, d) => ({ z: t < at(66, 'petit') ? 1.0 : 1.12, cx: 1000, cy: 560 }),
  overlay: t => (t > at(66, 'petit') ? `<rect width="${W}" height="${H}" fill="rgba(255,240,200,.12)"/>` : ''),
  draw: t => { const P = at(66, 'petit'), f = t > P;
    return depth({ zoom: 1 }, [...underLayers(f ? P : t, { surface: 150, seed: 8 }).slice(0, 2), { z: 1.8, svg: sargassum(CX, 140, 2600, f ? P : t, 13), blur: 4 },
      { z: 1, svg: tor({ x: 700, y: 780, s: 2.4, expr: f ? 'shock' : 'zen', look: f ? [-1, 0] : [.7, 0], hold: G(tr(0, 0, 1, f ? 50 : 0), b_mug(0, 0, .8, t)), bob: f ? 0 : 1 }, f ? P : t) + (f ? qmark(1320, 360, .9 * pop(t, P + .1)) : '') }]); },
  sfx: [[.15, 'el:record', 1], [at(66, 'petit'), 'el:hit_cine', .5], [at(66, 'petit') + .3, 'hmm', .6]] });
// B066b — insert : le contrat, la loupe révèle les petites lignes
B(66, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), r: -2 }),
  draw: t => { const k = eInOut(seg(t, .1, .9)), lx = lerp(1700, lerp(760, 1160, seg(t, .5, 1.2)), seg(t, 0, .5)), ly = 500, id = 'bct' + (_gid++);
    const paper = rect(440, 100, 1040, 460, '#fffdf4', 14) + text(960, 175, 'none', 'CONTRAT : TORTUE MARINE', OL, 52) + line(520, 205, 1400, 205, 5, '#c9b98f') +
      check(580, 265, .3, t, 0) + text(860, 282, 'none', 'Carapace', OL, 46) + check(580, 340, .3, t, 0) + text(860, 357, 'none', 'Nageoires', OL, 46) + check(580, 415, .3, t, 0) + text(860, 432, 'none', 'Tout l\'océan', OL, 46) + b_tiny(960, 507);
    const lens = `<defs><clipPath id="${id}"><circle cx="${lx}" cy="${ly}" r="130"/></clipPath></defs><g clip-path="url(#${id})"><circle cx="${lx}" cy="${ly}" r="130" fill="#fffdf4"/>${G(`translate(${lx} ${ly}) scale(2.2) translate(${-lx} ${-ly})`, b_tiny(960, 507))}</g>`;
    return rays(t, CX, CY, '#fff4d9', '#ffe6b0', 20) + paper + lens + line(lx + 92, ly + 92, lx + 200, ly + 200, 34) + line(lx + 92, ly + 92, lx + 200, ly + 200, 20, '#8b5a3c') + circ(lx, ly, 130, 'none', 16) + tag(960, 610, 'RESPIRATION NON INCLUSE', t, 1.15, '#ff4d4d', '#fff', 40); },
  sfx: [[0, 'whoosh', .7], [.2, 'printer', .4], [.7, 'glint', .7], [1.15, 'sting', .7]] }, at(66, 'personne'));

// B067 — très large, grue arrière : minuscule dans l'immensité, béret de marin, salut ; MARINE
B(67, { enter: 'whip', cam: () => ({ z: 1, hand: .3 }),
  draw: (t, d) => { const c = camMove(t, d, { zoom: 1.35, y: 80 }, { zoom: 1.0, y: 0 }, eOutCubic), hx = 960 + 148 * 1.3, hy = 640 - 51 * 1.3;
    return depth(c, [...underLayers(t, { floor: 1010, seed: 10 }), { z: 1.3, svg: rays(t, CX, 200, 'rgba(255,255,255,.12)', 'rgba(255,255,255,0)', 18) },
      { z: 1, svg: tor({ x: 960, y: 640, s: 1.3, expr: 'proud', flipUp: 1, swim: 0 }, t) + b_sailorHat(hx - 6, hy - 70, .7) + tag(CX, 130, 'TORTUE', t, at(67, 'tortue'), '#fff', SEA_D, 60) + bigText(['MARINE'], t, at(67, 'marine'), CX, 270, '#5ec4f0', 170) },
      b_fg(t, { seed: 13, ks: 1.1 })]); },
  sfx: [[0, 'whoosh', .7], [.2, 'whistle', .6], [at(67, 'marine'), 'el:hit_cine', .7], [at(67, 'marine') + .05, 'tada', .5]] });

// B068 — gros plan : « tu vis dans l'eau », des poissons tournent autour de sa tête, pouce levé
B(68, { enter: 'punch', cam: camHand(1.04, .5),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { seed: 14 }).slice(0, 2),
    { z: 1, svg: torF({ x: CX, y: 880, r: 140, expr: 'happy', armL: 200 + wave(t, 1, 10), armR: t > .8 ? -95 : -20 }, t) + b_bub(CX + 30, 540, t, 5, 1.4, .7) +
      Array.from({ length: 4 }, (_, i) => { const a = t * 3 + i * 1.57, f = Math.sin(a) < 0; return fish({ x: CX + Math.cos(a) * 330, y: 480 + Math.sin(a) * 80, s: .5, color: ['#ffb347', '#7fd3ff', '#ff8fb1', '#ffd23f'][i], flip: f ? 0 : 1 }, t); }).join('') + sparkle(1240, 470, .6 * pop(t, .85), '#fff') },
    b_fg(t, { seed: 15 })]),
  sfx: [[0, 'el:bubbles', .8], [.3, 'el:fish_school', .5], [.85, 'ding', .7]] });

// B069a — contre-plongée : « et pourtant… » la musique se coupe, son sourire fond, l'image s'assombrit
B(69, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), cy: 380, r: 4 }),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { surface: 120, seed: 16 }),
    { z: 1, svg: tor({ x: 820, y: 760, s: 2.2, expr: t > .5 ? 'worried' : 'happy', look: [.3, -1] }, t) },
    b_fg(t, { seed: 17, kelp: false, n: 4 })]) + rect(-300, -300, W + 600, H + 600, `rgba(10,10,40,${.45 * seg(t, .2, 1.1)})`, 0, 0),
  sfx: [[0, 'el:record', .9], [.3, 'hmm', .6], [.6, 'heartbeat', .7]] });
// B069b — très gros plan : joues gonflées, yeux qui jaillissent, visage rouge — TU NE PEUX PAS RESPIRER
B(69, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 6 }),
  draw: t => { const r = 190, hy = 1000 - 2.05 * r, R2 = at(69, 'respirer') - at(69, 'tu');
    return rays(t, CX, hy, '#ff8a8a', '#ff5d5d', 22) + torF({ x: CX, y: 1000, r, expr: 'panic', face: { mouth: 'o-small' }, burn: .25 + .3 * seg(t, 0, 1.5), tremble: 1, armL: 240, armR: -60 }, t) + b_puff(CX, hy, r, 1, t) + sweat(CX + 260, hy - 120, 1.2) + sweat(CX - 270, hy - 60, 1) +
      bigText(['TU NE PEUX PAS', 'RESPIRER !'], t, R2 - .05, CX, 120, '#fff', 104); },
  sfx: [[0, 'el:hit_cine', .9], [.05, 'boing', .5], [at(69, 'respirer') - at(69, 'tu'), 'error_beep', .8], [at(69, 'eau') - at(69, 'tu'), 'siren', .4]] }, at(69, 'tu'));

// B070 — plongée zénithale : radio, scanner qui balaie, OUI. tampon, POUMONS
B(70, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), r: lerp(-6, 0, eOutCubic(t / d)) }),
  draw: t => { const sy = 150 + ((t * 600) % 900);
    return grad('#0e2a44', '#123a5a', -200, -200, W + 400, H + 400) + Array.from({ length: 14 }, (_, i) => line(-200, i * 90, W + 200, i * 90, 2, 'rgba(120,200,255,.13)') + line(i * 160, -200, i * 160, H + 200, 2, 'rgba(120,200,255,.13)')).join('') +
      b_lungs(CX, 620, 1.0, t, .75 + .25 * Math.sin(t * 3)) + rect(-200, sy, W + 400, 8, 'rgba(120,255,200,.6)', 0, 0) +
      G(tr(380, 230, pop(t, at(70, 'oui')), -12), rect(-150, -70, 300, 140, 'none', 16, 12, '#ff6b6b') + text(0, 28, 'none', 'OUI.', '#ff6b6b', 90)) +
      tag(1500, 330, 'POUMONS', t, at(70, 'poumons'), '#ff9db5', OL, 64) + (t > at(70, 'poumons') ? path('M1340 380Q1200 420 1100 500', 'none', 10, '#ff9db5') : ''); },
  sfx: [[0, 'zap', .8], [.1, 'scratch', .3], [at(70, 'oui'), 'hammer', .7], [at(70, 'poumons'), 'pop', .8], [at(70, 'poumons') + .2, 'el:inhale', .4]] });

// B071a — moyen : le réveil sonne « RESPIRER ! », elle soupire
B(71, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: .5 }),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { floor: 980, seed: 18 }),
    { z: 1, svg: tor({ x: 700, y: 760, s: 1.8, expr: t > .7 ? 'annoyed' : 'shock', look: [1, -.3] }, t) + b_alarm(1350, 470, 1.1, t, 1) + tag(1350, 180, 'RESPIRER !', t, at(71, 'dois'), '#ff4d4d', '#fff', 64) + (t > .8 ? G(tr(1080, 400), text(0, 0, OL, 'pfff…', '#fff', 56)) : '') },
    b_fg(t, { seed: 19 })]),
  sfx: [[0, 'school_bell', .6], [.1, 'el:hit_cine', .3], [at(71, 'dois'), 'pop', .6], [.8, 'hmm', .8]] });
// B071b — grue verticale : elle file vers la surface, la tête crève l'eau, ÉNORME inspiration
B(71, { enter: 'none', cam: () => ({ z: 1.02, hand: .6 }),
  draw: (t, d) => { const wl = 300, S = at(71, 'surface') - at(71, 'remonter'), k = eOutCubic(seg(t, 0, S)), br = t > S, Rp = at(71, 'respirer') - at(71, 'remonter');
    const c = { y: lerp(380, -40, eInOut(seg(t, 0, S + .3))), zoom: 1.05 }, y = lerp(1250, wl + 95, k);
    return depth(c, [{ z: 3, svg: b_sky(wl) }, { z: 1, svg: b_water(t, wl) + (br ? '' : b_bub(960, y - 100, t, 6, 2)) +
      tor({ x: 900, y, s: 1.5, rot: lerp(-70, -12, k), swim: br ? .6 : 5, expr: t > Rp ? 'joy' : br ? 'shock' : 'effort', face: t > Rp ? { mouth: 'scream' } : {} }, t) + b_waterFront(t, wl, br ? .3 : 0) +
      (br ? shockRing(1100, wl, t, S, '#fff') + Array.from({ length: 8 }, (_, i) => { const a = R(200 + i * 18), q = seg(t, S, S + .7); return circ(1100 + Math.cos(a) * 260 * q, wl + Math.sin(a) * 200 * q + 300 * q * q, 12, '#fff', 4, '#9be2f5'); }).join('') : '') +
      (t > Rp ? G(tr(1380, 100, pop(t, Rp)), text(0, 0, OL, 'HAAAAA', '#fff', 90)) : '') }]); },
  sfx: [[0, 'el:swim_whoosh', .9], [.2, 'whoosh_up', .7], [at(71, 'surface') - at(71, 'remonter'), 'el:surface', .9], [at(71, 'respirer') - at(71, 'remonter'), 'el:inhale', 1]] }, at(71, 'remonter'));

// B072 — profil : applaudissements ironiques, elle tape mollement des nageoires ; un buisson roulant passe
B(72, { enter: 'none', cam: (t, d) => ({ z: 1.0 }),
  draw: t => { const cl = Math.sin(t * 7) > 0;
    return depth({ zoom: 1 }, [...underLayers(t, { floor: 900, seed: 20 }),
      { z: 1, svg: tor({ x: 640, y: 780, s: 1.7, expr: 'deadpan', fa: cl ? -40 : 30, bob: 0, look: [-.4, 0] }, t) +
        [1150, 1380, 1610].map((x, i) => fish({ x, y: 600 + i * 30 + wave(t, 2, 10, i / 3), s: .8, color: ['#ffb347', '#7fd3ff', '#ff8fb1'][i], rot: wave(t, 3, 10, i / 3) }, t)).join('') +
        G(tr(1380, 400, pop(t, .5), -4), line(-120, 60, -120, 130, 6) + rect(-260, -60, 520, 120, '#fff', 14) + text(0, 22, 'none', 'BRAVO LA NATURE', OL, 46)) +
        tumbleweed(lerp(-200, 2100, t / 2), 860 - Math.abs(Math.sin(t * 5)) * 60, .7, t * 400) }]); },
  sfx: [[0, 'el:applause', .3], [.2, 'crickets', .7], [.6, 'hmm', .5], [1.2, 'rimshot', .5]] });

// B073 — large : la nature t'offre l'océan en paquet cadeau ; le couvercle saute, paillettes
B(73, { enter: 'drop', cam: camPush(1.0, 1.06, .3),
  draw: t => { const D = at(73, 'donne'), k = eOutCubic(seg(t, D, D + .4));
    return depth({ zoom: 1 }, [...underLayers(t, { floor: 960, seed: 21 }),
      { z: 1, svg: (k > 0 ? rays(t, 1150, 430, 'rgba(255,240,170,.5)', 'rgba(255,255,255,0)', 16) : '') + G(tr(1150, 620, 1 + .03 * Math.sin(t * 8)), rect(-280, -180, 560, 360, '#ff6fa5', 20) + rect(-35, -180, 70, 360, '#ffd23f', 0, 6)) +
        G(tr(1150, 440 - k * 300, 1, k * 25), rect(-310, -60, 620, 100, '#ff8fb8', 18) + rect(-35, -60, 70, 100, '#ffd23f', 0, 6) + bow(0, -70, 2.2, 0, '#ffd23f')) +
        (k > 0 ? stars(1150, 300, t, 8, 260) + confetti(t, D, 30) : '') + tor({ x: 480, y: 740, s: 1.3, expr: k > 0 ? 'ecstatic' : 'wow', look: [1, -.4] }, t) + tag(1150, 130, 'UNE MAISON !', t, at(73, 'maison'), '#fff', '#ff6fa5', 60) },
      b_fg(t, { seed: 22, kelp: false })]); },
  sfx: [[0, 'drum', .5], [at(73, 'donne'), 'magic', .9], [at(73, 'donne') + .05, 'pop', .8], [at(73, 'maison'), 'tada', .5]] });

// B074a — gros plan écran : options de la TORTUE MARINE, la nageoire-curseur active tout…
B(74, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: t => { const rows = [['Nager', 290], ['Carapace', 420], ['Respiration aquatique', 550]], tg = i => t > .2 + i * .35;
    const cur = t < .55 ? [1180, 290] : t < .9 ? [1180, 420] : [1180, 550];
    return grad('#2a7fb0', '#0c3b63', -200, -200, W + 400, H + 400) + rect(330, 110, 1260, 560, '#fff', 30) + rect(330, 110, 1260, 100, '#5ec4f0', 30) + rect(330, 170, 1260, 40, '#5ec4f0', 0, 0) + text(CX, 182, 'none', 'TORTUE MARINE  v1.0 — Options', '#fff', 50) +
      rows.map(([s, y], i) => text(730, y + 18, 'none', s, OL, 52) + b_toggle(1250, y, 1, i < 2 && tg(i), t)).join('') +
      G(tr(cur[0] + 40, cur[1] + 30 + Math.abs(Math.sin(t * 9)) * 12, 1, -120), flipper(150, 56, T_BABY_SKIN, true)); },
  sfx: [[0, 'whoosh', .6], [.2, 'slot', .6], [.55, 'slot', .6], [.9, 'pop', .5]] });
// B074b — très gros plan : « Respiration aquatique » NON INSTALLÉE, téléchargement en échec, elle hallucine
B(74, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), r: -3, shake: t > .3 && t < .6 ? 6 : 0 }),
  draw: t => { const E = at(74, 'aquatique') - at(74, 'respiration'), pk = seg(t, .2, E);
    return grad('#2a7fb0', '#0c3b63', -200, -200, W + 400, H + 400) + rect(140, 130, 1420, 520, '#fff', 30) + text(700, 290, 'none', 'Respiration aquatique', OL, 76) + b_toggle(1300, 265, 1.5, 0, t, t > .3 ? 1 : 0) +
      rect(260, 380, 1180, 60, '#e8eef5', 30) + rect(268, 388, Math.max(0, 1164 * Math.min(pk, .04)), 44, pk > .03 ? '#ff4d4d' : '#5ec4f0', 22, 0) + text(850, 425, 'none', pk > .03 ? 'TÉLÉCHARGEMENT : 0 %… ÉCHEC' : 'Téléchargement…', '#7a8a99', 34) +
      tag(850, 550, 'NON INSTALLÉE', t, .3, '#ff4d4d', '#fff', 70) + torF({ x: 1730, y: 870, r: 105, expr: 'jawdrop', armL: 230, armR: -40 }, t); },
  sfx: [[0, 'el:hit_cine', .6], [.3, 'error_beep', 1], [.9, 'error_beep', .7], [1.4, 'boing', .5]] }, at(74, 'respiration'));

// ============================================================
//  LES ANNÉES PASSENT — elle grandit, devient respectée
// ============================================================
// B075 — contre-plongée depuis le fond : soleil et lune tournent au-dessus de l'eau, calendriers qui pleuvent
B(75, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 300 }),
  draw: t => { const a = t * 9, dn = (Math.sin(a) + 1) / 2;
    return grad(lerpColor('#5fd0ea', '#0b2346', dn), lerpColor('#1b6fa3', '#061a33', dn), -200, -200, W + 400, H + 400) + glow(CX + Math.cos(a) * 600, 160 + Math.sin(a) * 90, 220, dn > .5 ? '#eef' : '#fff3b0', .7) + circ(CX + Math.cos(a) * 600, 160 + Math.sin(a) * 90, 60, dn > .5 ? '#eef' : '#fff3b0', 0) +
      b_surf(t, 260, 'rgba(255,255,255,.4)') + Array.from({ length: 6 }, (_, i) => calendarPage(200 + i * 300, ((t * 700 + i * 260) % 1300) - 200, .55, t * 200 + i * 50)).join('') +
      tor({ x: lerp(300, 1500, t / 1.28), y: 640, s: lerp(1.0, 1.6, t / 1.28), swim: 2, expr: 'happy', rot: -10 }, t) + tag(CX, 130, '+' + Math.min(10, 1 + Math.floor(t * 8)) + ' ANS', t, 0, '#fff', OL, 64); },
  sfx: [[0, 'el:time_pass', 1], [.1, 'clock_fast', .6], [.6, 'flutter', .5]] });
// B076 — plongée zénithale : POUF, bébé → adulte, la règle explose
B(76, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.15, 1.0, eOutCubic(t / d)) }),
  draw: t => { const P = at(76, 'grandis') + .05, g = t > P;
    return b_floorTop(t) + (g ? torAT({ x: CX, y: 580, s: 1.6, swim: .6 }, t) : torT({ x: CX, y: 580, s: 1.4 + t, swim: 1 }, t)) +
      (t > P - .05 && t < P + .35 ? Array.from({ length: 9 }, (_, i) => { const q = seg(t, P - .05, P + .35), a = i * .7; return circ(CX + Math.cos(a) * 260 * q, 580 + Math.sin(a) * 200 * q, 90 * (1 - q * .5), '#fff', 5); }).join('') : '') +
      G(tr(1550, 600), rect(-40, -420, 80, 840, '#ffd23f', 10) + Array.from({ length: 9 }, (_, i) => line(-40, -400 + i * 100, 0, -400 + i * 100, 6)).join('')) + G(tr(1550, lerp(300, -60, eOutBack(seg(t, P, P + .3)))), path('M-90 0L90 0', 'none', 14, '#e2463a')); },
  sfx: [[0, 'whoosh_up', .7], [at(76, 'grandis'), 'magic', .9], [at(76, 'grandis') + .05, 'pop', .9]] });

// B077 — moyen : elle gonfle les biceps ; un poisson s'écrase sur la carapace — TOC — et repart en spirale
B(77, { enter: 'whip', cam: camHand(1.04, .5),
  draw: t => { const H1 = at(77, 'devient'), k = seg(t, H1 - .35, H1), b = seg(t, H1, H1 + .9);
    return depth({ zoom: 1 }, [...underLayers(t, { floor: 980, seed: 23 }),
      { z: 1, svg: glow(820, 560, 420, '#fff6c8', .35 * seg(t, at(77, 'solide'), at(77, 'solide') + .3)) + torA({ x: 820, y: 780, s: 1.7, expr: t > H1 ? 'smugger' : 'proud', flipUp: 1, fa: wave(t, 2, 8) }, t) +
        (t < H1 ? fish({ x: lerp(-100, 700, eInCubic(k)), y: lerp(250, 520, k), s: .9, flip: 1, rot: 25, color: '#9b6bd6', teeth: 1 }, t) : G(tr(lerp(700, 300, b), lerp(520, 240, b) + 400 * b * b, 1, b * 720), fish({ x: 0, y: 0, s: .9, color: '#9b6bd6' }, t)) + stars(lerp(700, 300, b), lerp(450, 170, b), t, 4, 70)) +
        (t > H1 && t < H1 + .25 ? impactStar(760, 530, .7) : '') + (t > H1 ? G(tr(700, 400, pop(t, H1)), text(0, 0, OL, 'TOC !', '#fff', 80)) : '') +
        sparkle(760, 600, pop(t, at(77, 'solide')) * .8, '#fff') + tag(1450, 180, '+ SOLIDE', t, at(77, 'solide'), '#cfd6dc', OL, 64) },
      b_fg(t, { seed: 24, k2: false })]); },
  sfx: [[0, 'whoosh', .6], [at(77, 'devient'), 'hammer', 1], [at(77, 'devient') + .05, 'boing', .7], [at(77, 'solide'), 'glint', .9], [at(77, 'solide') + .1, 'el:hit_cine', .4]] });

// B078a — ralenti héroïque, travelling latéral en profondeur : lunettes noires, bandes cinéma
B(78, { enter: 'none', cam: () => ({ z: 1.02, bars: 1 }),
  draw: (t, d) => { const s = t * .45, c = camMove(t, d, { x: -150 }, { x: 250 });
    return depth(c, [...underLayers(s, { floor: 1000, seed: 25 }), { z: 1.6, svg: rays(t, 900, -100, 'rgba(255,255,255,.14)', 'rgba(255,255,255,0)', 14) },
      { z: 1, svg: glow(900 + t * 150, 600, 420, '#fff6c8', .4) + torA({ x: 700 + t * 170, y: 700, s: 1.6, expr: 'cool', swim: .35 }, s) + b_bub(1100 + t * 150, 580, s, 5, 1) },
      b_fg(s, { seed: 26, kx: 1300, k2: 2300 })]); },
  sfx: [[0, 'el:hit_cine', .6], [.1, 'el:riser', .4], [.4, 'el:swim_whoosh', .4], [1.2, 'glint', .7]] });
// B078b — contre-plongée sur « les autres » : poissons qui s'inclinent, requin en sueur… drapeau blanc
B(78, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 860, r: 3, bars: 1 }),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { dark: .1, seed: 27 }),
    { z: 1.5, svg: G(tr(480, 460), shark({ x: 0, y: 0, s: .95, jaw: .05, flip: 1 }, t) + sweat(250, -80, 1) + sweat(300, 0, .8)) + b_flag(720, 470, .9, t), blur: 1 },
    { z: 1, svg: torAF({ x: 1120, y: 960, r: 120, expr: 'smugger', armL: 200, armR: -20 }, t) +
      [1450, 1640, 1820].map((x, i) => G(tr(x, 640 + i * 40, 1, -25 - 15 * Math.abs(Math.sin(t * 2 + i))), fish({ x: 0, y: 0, s: .8, color: ['#ffd23f', '#7fd3ff', '#ff8fb1'][i] }, t))).join('') +
      tag(CX, 190, 'RESPECT.', t, at(78, 'serieux') - at(78, 'autres'), '#fff', OL, 72) },
    b_fg(t, { seed: 28, kelp: false })]),
  sfx: [[0, 'el:hit_cine', .5], [.3, 'el:crowd_gasp', .4], [.7, 'flutter', .5], [at(78, 'serieux') - at(78, 'autres'), 'ding', .8]] }, at(78, 'autres'));

// ============================================================
//  LA VIE CHILL (DE OUF)
// ============================================================
// B079a — très large doré : elle plane bras ouverts, poissons en orbite, bokeh
B(79, { enter: 'tilt', cam: (t, d) => ({ z: 1.0, hand: .2 }),
  draw: (t, d) => { const c = camMove(t, d, { y: -120, zoom: 1.12 }, { y: 0, zoom: 1.0 });
    return depth(c, [...underLayers(t, { seed: 29 }), { z: 3, svg: glow(CX, 0, 1000, '#fff1b0', .55) + bokeh(t, 7, 14) },
      { z: 1, svg: torA({ x: 820, y: 620 + wave(t, .3, 15), s: 1.2, expr: 'zen', fa: -45, bob: 0 }, t) + Array.from({ length: 6 }, (_, i) => { const a = t * 1.4 + i * 1.05; return fish({ x: 960 + Math.cos(a) * 520, y: 500 + Math.sin(a) * 160, s: .45, color: ['#ffd23f', '#ff8fb1', '#7fd3ff'][i % 3], flip: Math.sin(a) > 0 ? 0 : 1 }, t); }).join('') + heart(1180, 360 - (t * 40) % 100, .5) },
      b_fg(t, { seed: 30, kelp: false, n: 5 })]); },
  sfx: [[0, 'el:chime', .7], [.3, 'angel', .4], [1.0, 'el:bubbles', .4]] });
// B079b — moyen, à la surface : sur le dos dans sa bouée, lunettes noires, cocktail, notes de musique
B(79, { enter: 'whip', cam: camPush(1.0, 1.06, .2),
  draw: t => { const wl = 690;
    return depth({ zoom: 1 }, [{ z: 3, svg: b_sky(wl, '#ffcf9a', '#fff1d9') }, { z: 1, svg: b_water(t, wl, { w1: '#55c8e6' }) + b_ringB(960, 712, 250, 60) +
      G(tr(960, 820 + wave(t, .4, 6), 1, -12), torAF({ x: 0, y: 0, r: 110, face: { eyes: 'shades', mouth: 'bliss' }, armL: 245, armR: -40, holdR: b_cocktail(0, -20, .8, 40), bob: 0 }, t)) +
      b_waterFront(t, wl, .3) + b_ringF(960, 712, 250, 60) + b_notes(1250, 420, t) + G(tr(1100, 360), op(.8, text(0, 0, OL, 'z', '#fff', 50 + 10 * Math.sin(t * 2)))) +
      tag(CX, 120, 'PRESQUE AGRÉABLE', t, at(79, 'presque') - at(79, 'la'), '#ffd23f', OL, 60) }]); },
  sfx: [[0, 'el:splash', .4], [.2, 'el:a_beach', .4], [.6, 'kiss', .4], [at(79, 'presque') - at(79, 'la'), 'ding', .6]] }, at(79, 'la'));

// B080a — gros plan face : elle nage vers nous, mode chill, le kelp défile
B(80, { enter: 'crash', cam: camHand(1.04, .4),
  draw: t => depth({ x: t * 300, zoom: 1 }, [...underLayers(t, { seed: 31 }).slice(0, 2),
    { z: 1, svg: torAF({ x: CX - t * 300, y: 880, r: 140, expr: 'chill', armL: 200 + wave(t, 1.4, 35), armR: -20 - wave(t, 1.4, 35) }, t) + b_bub(CX + 60 - t * 300, 520, t, 4, 1.2, .7) },
    { z: .5, blur: 9, svg: fgKelp(300, 1300, 1.3, t) + fgKelp(1300, 1300, 1.2, t, '#26694a') + fgKelp(2300, 1300, 1.3, t) }]),
  sfx: [[0, 'el:swim_whoosh', .8], [.4, 'el:bubbles', .4], [.8, 'el:swim_whoosh', .5]] });
// B080b — très gros plan : elle aspire un brin d'herbier comme un spaghetti
B(80, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
  draw: t => { const r = 190, hy = 1000 - 2.05 * r, k = seg(t, 0, .7), my = hy + r * .45;
    return rays(t, CX, hy, '#c9f2ff', '#a6e6f7', 20) + torAF({ x: CX, y: 1000, r, expr: 'joy', face: { mouth: 'o-small' }, armL: 210, armR: -30 }, t) +
      path(`M${CX} ${my}Q${CX + 120} ${my + 120 - k * 100} ${lerp(1500, 1100, k)} ${lerp(1150, 900, k)}`, 'none', 26) + path(`M${CX} ${my}Q${CX + 120} ${my + 120 - k * 100} ${lerp(1500, 1100, k)} ${lerp(1150, 900, k)}`, 'none', 14, '#62c26a') + b_puff(CX, hy, r, .55, t) +
      heart(1300, 330 - t * 80, .8) + heart(620, 360 - t * 60, .6) + G(tr(1480, 220, pop(t, .15), 8), text(0, 0, OL, 'SLURP', '#7be07b', 90)); },
  sfx: [[0, 'el:munch', 1], [.1, 'chomp', .5], [.4, 'gulp', .7]] }, at(80, 'manges') - .1);

// B081 — contre-plongée : elle passe au-dessus de nous comme un avion de ligne ; compteur de kilomètres
B(81, { enter: 'whip', cam: (t, d) => ({ z: 1.03, cy: 300, hand: .5 }),
  draw: t => { const k = t / 1.76;
    return grad('#a7ecff', '#1b6fa3', -200, -200, W + 400, H + 400) + rays(t, CX, -100, 'rgba(255,255,255,.18)', 'rgba(255,255,255,0)', 18) + b_surf(t, 150, 'rgba(255,255,255,.45)') + streaks(t, 1, 12, 'rgba(255,255,255,.35)') +
      torAT({ x: lerp(-250, 2150, k), y: 470, s: 1.4, rot: 90, swim: 3 }, t) + b_bub(lerp(-450, 1950, k), 600, t, 5, 2) +
      tag(CX, 960 - 830, Math.floor(lerp(12, 5200, eInOut(k))).toLocaleString('fr-FR').replace(/ | /g, ' ') + ' km', t, 0, '#fff', OL, 70) +
      G(tr(1550, 330, pop(t, .5), 12), rect(-120, -60, 240, 120, 'none', 16, 10, '#5ec4f0') + text(0, 20, 'none', 'BRÉSIL', '#5ec4f0', 46)) + G(tr(420, 360, pop(t, 1.1), -10), rect(-130, -60, 260, 120, 'none', 16, 10, '#ff8a3d') + text(0, 20, 'none', 'AFRIQUE', '#ff8a3d', 46)); },
  sfx: [[0, 'el:swim_whoosh', 1], [.2, 'clock_fast', .4], [.5, 'hammer', .5], [1.1, 'hammer', .5]] });

// B082a — plongée zénithale : elle flotte ; une main humaine tend un ordi avec un tableau Excel
B(82, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), r: lerp(4, 0, t / d) }),
  draw: t => { const k = eOutCubic(seg(t, at(82, 'demande') - .3, at(82, 'demande') + .2));
    return b_waterTop(t) + torAT({ x: 700, y: 560, s: 1.4, rot: 20 + wave(t, .3, 4) }, t) + G(tr(640, 330), text(0, 0, OL, 'z', '#fff', 60)) +
      G(tr(lerp(2300, 1500, k), 520), laptopSheet(-300, 80, .9, 0) + hand(0, 0, 1.3, 180, '#3d4b63')) + (k > .9 ? G(tr(980, 300, pop(t, at(82, 'remplir'))), text(0, 0, OL, 'NON.', '#fff', 80)) : ''); },
  sfx: [[0, 'el:a_wind', .3], [at(82, 'demande'), 'el:typing', .7], [at(82, 'remplir'), 'hmm', .7]] });
// B082b — gros plan profil : coup de nageoire, l'ordi part en vrille dans le bleu ; elle se marre
B(82, { enter: 'whip', cam: (t, d) => ({ z: 1.05, hand: .6, shake: t < .25 ? 6 : 0 }),
  draw: t => { const k = seg(t, .05, .9);
    return depth({ zoom: 1 }, [...underLayers(t, { seed: 32 }),
      { z: 1, svg: torA({ x: 640, y: 780, s: 2.0, expr: 'laugh', fa: t < .2 ? -70 : 30 }, t) + G(tr(lerp(1150, 1750, k), lerp(560, 200, k) + 300 * k * k, lerp(1, .5, k), k * 900), laptopSheet(0, 100, .8)) + (t < .2 ? impactStar(1150, 560, .5) : '') +
        cross(lerp(1150, 1750, k), lerp(480, 140, k) + 300 * k * k, .8, t, .3) + b_bub(lerp(1150, 1750, k), lerp(600, 260, k) + 300 * k * k, t, 4, 2) },
      b_fg(t, { seed: 33, kelp: false })]); },
  sfx: [[0, 'thud', .9], [.05, 'whoosh', .9], [.3, 'error_beep', .6], [.4, 'el:bubbles', .6]] }, at(82, 'tableau'));

// B083a — moyen à la surface : bouée, noix de coco à paille, soupir de bonheur
B(83, { enter: 'none', cam: camPush(1.0, 1.05, .2),
  draw: t => { const wl = 640;
    return depth({ zoom: 1 }, [{ z: 3, svg: b_sky(wl, '#8fd3ff', '#fff1d9') }, { z: 1, svg: b_water(t, wl) + b_ringB(820, 650, 270, 50) +
      torA({ x: 820, y: 650 + wave(t, .4, 6), s: 1.5, face: { eyes: 'shades', mouth: 'bliss' }, bob: 0 }, t) + line(1300, 520, 1190, 600, 8, '#ff6fa5') + circ(1320, 560 + wave(t, .4, 6), 60, '#8a5a3a') + ell(1320, 515 + wave(t, .4, 6), 40, 14, '#fff4e0', 5) +
      b_waterFront(t, wl, .3) + b_ringF(820, 650, 270, 50) + b_notes(1300, 400, t, 3) + G(tr(1350, 300, pop(t, .4)), text(0, 0, OL, 'aaah…', '#fff', 64)) }]); },
  sfx: [[0, 'el:splash', .3], [.2, 'el:a_beach', .4], [.4, 'hmm', .6]] });
// B083b — très gros plan : elle fond de bonheur, deux poissons l'éventent avec des feuilles
B(83, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
  draw: t => { const r = 180, hy = 960 - 2.05 * r;
    return grad('#ffd6e8', '#bfe9ff', -200, -200, W + 400, H + 400) + bokeh(t, 3, 10, ['#fff', '#ffe0f0', '#fff3c8']) + torAF({ x: CX, y: 960, r, face: { eyes: 'chill', mouth: 'bliss', blush: 1 }, expr: 'zen', squash: .2, armL: 210, armR: -30, headTilt: wave(t, .4, 6) }, t) +
      [[-1, 520], [1, 1400]].map(([sd, x]) => G(tr(x, 520), fish({ x: 0, y: 120, s: .8, color: '#ffb347', flip: sd > 0 ? 0 : 1 }, t) + G(tr(sd * -30, 40, 1, (sd > 0 ? 200 : -20) + wave(t, 2.5, 30)), leaf(0, 0, 1)))).join('') +
      heart(CX + 280, hy - 200 - (t * 70) % 140, .7) + heart(CX - 300, hy - 120 - (t * 60) % 120, .5); },
  sfx: [[0, 'kiss', .6], [.2, 'flutter', .6], [.6, 'baby_coo', .4], [1.0, 'flutter', .5]] }, at(83, 'ca'));
// B083c — CHILL DE OUF : rayons pastel, 5 étoiles, elle se liquéfie de bonheur
B(83, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: t => rays(t * .5, CX, 620, '#ffe1f0', '#d6f2ff', 26) + confetti(t, 0, 24, 9) +
    G(tr(CX, 860 + wave(t, .3, 10), 1, -18), torAF({ x: 0, y: 0, r: 115, face: { eyes: 'shades', mouth: 'bliss' }, armsBack: 1, armL: 255, armR: -75, squash: .35, holdR: '' }, t)) + b_cocktail(1300, 760, 1, 15) +
    b_notes(1350, 560, t, 3) + G(tr(1150, 470), Array.from({ length: 3 }, (_, i) => { const q = (t * .6 + i / 3) % 1; return op(1 - q, text(q * 90, -q * 160, OL, 'z', '#fff', 50 + q * 50)); }).join('')) +
    bigText(['CHILL DE OUF'], t, 0, CX, 150, '#ff6fa5', 140) + Array.from({ length: 5 }, (_, i) => G(tr(660 + i * 150, 330, pop(t, .4 + i * .12)), path('M0 -55L16 -16L58 -14L26 12L36 54L0 32L-36 54L-26 12L-58 -14L-16 -16Z', '#ffd23f', 6))).join(''),
  sfx: [[0, 'el:hit_cine', .5], [.05, 'tada', .6], [.4, 'ding', .5], [.65, 'ding', .55], [.9, 'ding', .6], [1.2, 'angel', .5]] }, at(83, 'excellente'));

// ============================================================
//  LE SAC PLASTIQUE
// ============================================================
// B084a — profil : elle nage, cool… et s'arrête net, les yeux vers le haut
B(84, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: t => { const A = at(84, 'jour'), st = t > A;
    return depth({ x: st ? A * 120 : t * 120, zoom: 1 }, [...underLayers(t, { floor: 990, seed: 34 }),
      { z: 1, svg: torA({ x: 640 + (st ? A : t) * 120, y: 740, s: 1.6, expr: st ? 'shock' : 'cool', swim: st ? 0 : .8, look: st ? [.4, -1] : [.7, 0] }, t) + (st ? emark(1150, 420, .8 * pop(t, A)) : '') },
      b_fg(t, { seed: 35, k2: false })]); },
  sfx: [[0, 'el:swim_whoosh', .5], [at(84, 'jour'), 'el:record', .8], [at(84, 'jour') + .1, 'sting', .5]] });
// B084b — POV de la tortue : là-haut, contre le soleil, quelque chose flotte…
B(84, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.25, eInOut(t / d)), cx: 1150, cy: 400, hand: .7 }), overlay: t => povEyes(t, [.3, 1.5]),
  draw: t => grad('#bff2ff', '#1f7fae', -200, -200, W + 400, H + 400) + rays(t * .3, 1150, 200, 'rgba(255,255,255,.25)', 'rgba(255,255,255,0)', 18) + glow(1150, 150, 500, '#fff', .5) + b_surf(t, 120, 'rgba(255,255,255,.5)') +
    plasticBag({ x: 1150, y: 400, s: 1.1, print: false }, t) + sparkle(1260, 300, .5 + .2 * Math.sin(t * 5), '#fff') + b_bub(500, 1000, t, 6, 1),
  sfx: [[0, 'el:bubbles', .5], [.3, 'el:riser', .5], [1.0, 'el:bag_rustle', .4]] }, at(84, 'apercois'));

// B085a — large : le sac danse comme une ballerine dans un rai de lumière ; elle, petite, observe
B(85, { enter: 'none', cam: camPush(1.0, 1.04, .3),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { dark: .15, floor: 1000, seed: 36 }),
    { z: 1.3, svg: `<path d="M1000 -100L1300 -100L1500 1100L800 1100Z" fill="rgba(255,255,240,.18)"/>` },
    { z: 1, svg: plasticBag({ x: 1150 + wave(t, .3, 40), y: 420, s: 1.4, print: false, rot: wave(t, .5, 25) }, t) + sparkle(1300, 300, .5 * pop(t, at(85, 'transparent')), '#fff') +
      torA({ x: 380, y: 760, s: .9, expr: 'confused', look: [1, -1] }, t) + tag(1150, 120, 'TRANSPARENT', t, at(85, 'transparent'), '#fff', SEA_D, 56) },
    b_fg(t, { seed: 37, kx: 1900, k2: false })]),
  sfx: [[0, 'el:bag_rustle', .6], [.3, 'angel', .3], [at(85, 'transparent'), 'glint', .7]] });
// B085b — insert : il gigote, tout mou — boing
B(85, { enter: 'punch', cam: () => ({ z: 1.06 }),
  draw: t => { const sq = Math.sin(t * 14) * .18 * (1 - seg(t, 0, .8));
    return rays(t, CX, 470, '#d9f1fa', '#bfe6f5', 20) + G(`translate(${CX} 470) scale(${1 + sq} ${1 - sq}) translate(${-CX} -470)`, plasticBag({ x: CX, y: 420, s: 2.3, print: false }, t)) + motionLines(560, 420, 3, 70, 180) + motionLines(1360, 420, 3, 70, 0) + tag(CX, 120, 'SOUPLE', t, .05, '#fff', OL, 60); },
  sfx: [[0, 'boing', .9], [.1, 'el:bag_rustle', .7], [.3, 'boing', .5]] }, at(85, 'souple'));

// B086 — gros plan : yeux en cœur, bave… elle s'imagine une méduse servie sur assiette
B(86, { enter: 'crash', cam: camPush(1.0, 1.08, .4),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { seed: 38 }).slice(0, 2),
    { z: 1, svg: torAF({ x: 1150, y: 930, r: 150, face: { eyes: 'heart', mouth: 'drool', brows: 'up' }, armL: 210, armR: -30, headTilt: 8 }, t) +
      thought(560, 330, 640, 380, plate(0, 60, .9, '') + jelly({ x: 0, y: -10, s: .8 }, t) + fork(-210, 0, .7, -20) + knife(210, 0, .7, 20), pop(t, .3)) },
    b_fg(t, { seed: 39, kx: 2000, k2: false })]),
  sfx: [[0, 'el:hit_cine', .3], [.3, 'pop', .7], [.6, 'kiss', .6], [1.2, 'gulp', .7]] });

// B087 — contre-plongée : une vraie méduse vexée brandit un panneau « C'EST PAS MOI ! »
B(87, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), cy: 700, r: -3 }),
  draw: t => depth({ zoom: 1 }, [{ z: 4, svg: grad('#e9fbff', '#2a8fc0', -900, -900, W + 1800, H + 1800) + glow(CX, 0, 700, '#fff', .6) + b_surf(t, 90, 'rgba(255,255,255,.5)') },
    { z: 1, svg: op(.9, plasticBag({ x: 1250, y: 400, s: 1.4, print: false }, t)) + G(tr(560, 420, 1, wave(t, 3, 10)), jelly({ x: 0, y: 0, s: 1.4, color: 'rgba(255,120,170,.85)' }, t) + line(-48, -40, -12, -24, 7) + line(48, -40, 12, -24, 7)) +
      G(tr(560, 170, pop(t, .2), -5), line(0, 40, 0, 120, 7) + rect(-230, -55, 460, 110, '#fff', 14) + text(0, 20, 'none', 'C\'EST PAS MOI !', '#ff4d6d', 46)) +
      G(tr(900, 420, pop(t, at(87, 'pas'))), text(0, 50, OL, '≠', '#ff4d4d', 220)) },
    b_fg(t, { seed: 40, kelp: false })]),
  sfx: [[0, 'whoosh', .5], [.2, 'pop', .7], [.5, 'hmm', .6], [at(87, 'pas'), 'error_beep', .8]] });

// B088 — plongée dramatique : le sac se retourne, imprimé « 3 tomates » ; mâchoire au sol — SAC PLASTIQUE
B(88, { flash: 1, enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), r: 6, shake: 4 }),
  draw: t => rays(t, CX, 470, '#c9d3dc', '#aab8c4', 24) + G(tr(700, 470, 1, wave(t, 1, 12)), plasticBag({ x: 0, y: 0, s: 1.9 }, t)) +
    torAF({ x: 1450, y: 900, r: 120, expr: 'jawdrop', armL: 230, armR: -50, tremble: .5 }, t) + bigText(['SAC PLASTIQUE'], t, at(88, 'plastique') - .05, CX, 130, '#ff5d5d', 112),
  sfx: [[0, 'el:hit_cine', .8], [.1, 'el:bag_rustle', .9], [at(88, 'sac'), 'sting', .7], [at(88, 'plastique'), 'boing', .4]] });

// B089a — labo des humains : un savant brandit le sac sous un projecteur, EUREKA, confettis
B(89, { enter: 'whip', cam: camPush(1.0, 1.06, .3),
  draw: t => { const E = at(89, 'reussi');
    return grad('#eef3f7', '#d6e2ec', -200, -200, W + 400, H + 400) + rect(-200, 860, W + 400, 400, '#b9c6d2', 0, 0) + `<path d="M860 -100L1060 -100L1260 900L660 900Z" fill="rgba(255,250,200,.35)"/>` +
      rect(200, 700, 500, 40, '#fff', 8) + G(tr(320, 650), rect(-30, -60, 60, 100, 'rgba(160,230,180,.7)', 14)) + G(tr(450, 640), circ(0, 0, 50, 'rgba(255,170,200,.7)') + rect(-14, -90, 28, 50, 'rgba(255,255,255,.5)', 6)) +
      person({ age: 'adult', x: 960, y: 1000, s: 1.0, expr: t > E ? 'ecstatic' : 'joy', shirt: '#ffffff', coat: 1, glasses: true, hair: 'spiky', hairColor: '#7a5a3a', armR: [-60, -85], armL: [140, 120], holdR: plasticBag({ x: 0, y: -110, s: .45, print: false }, t) }, t) +
      person({ age: 'adult', x: 1500, y: 1020, s: .9, expr: 'laugh', shirt: '#ffffff', coat: 1, hair: 'bun', hairColor: '#3a2a20', armL: [150, -60], armR: [30, -120], seed: 3 }, t) +
      (t > E ? confetti(t, E, 40) + tag(CX, 140, 'EURÊKA !', t, E, '#ffd23f', OL, 70) : ''); },
  sfx: [[0, 'whoosh', .6], [.3, 'angel', .5], [at(89, 'reussi'), 'tada', .8], [at(89, 'reussi') + .1, 'el:applause', .6]] });
// B089b — insert usine : la machine crache des sacs à la chaîne, compteur fou
B(89, { enter: 'crash', cam: () => ({ z: 1.04, shake: 3 }),
  draw: t => { const n = Math.floor(lerp(1000, 999999999, Math.pow(seg(t, 0, 1.4), 3)));
    return grad('#4a5563', '#2c333d', -200, -200, W + 400, H + 400) + rect(-200, 780, W + 400, 60, '#20252c', 0, 0) + Array.from({ length: 12 }, (_, i) => circ(((i * 180 - t * 600) % 2200 + 2200) % 2200 - 100, 810, 22, '#888', 5)).join('') +
      rect(120, 360, 460, 420, '#e2463a', 20) + rect(170, 420, 360, 120, '#2b2b33', 12) + circ(220, 640, 26, Math.sin(t * 12) > 0 ? '#ffd23f' : '#7a5a00') + circ(320, 640, 26, '#5fd068') + rect(560, 560, 80, 140, '#2b2b33', 6) +
      Array.from({ length: 7 }, (_, i) => plasticBag({ x: ((640 + i * 230 + t * 600) % 1800) + 200, y: 640, s: .55, print: false }, t + i)).join('') +
      tag(CX + 200, 160, n.toLocaleString('fr-FR').replace(/ | /g, ' '), t, 0, '#fff', OL, 70) + G(tr(1600, 300), text(0, 0, OL, 'sacs', '#fff', 56)); },
  sfx: [[0, 'printer', .9], [.3, 'clock_fast', .5], [.8, 'printer', .7], [1.2, 'jackpot', .3]] }, at(89, 'inventer'));
// B089c — caisse du supermarché : TROIS tomates dans le sac… chrono : 10 MINUTES
B(89, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3 }),
  draw: t => { const T3 = at(89, 'tomates') - at(89, 'transporter'), T10 = at(89, '10') - at(89, 'transporter');
    let s = grad('#f6efe2', '#e7dccb', -200, -200, W + 400, H + 400) + rect(-200, 820, W + 400, 400, '#cbb89c', 0, 0) + rect(260, 700, 1100, 140, '#5b6068', 10) + rect(260, 680, 1100, 30, '#8a929c', 6) + cardTerminal(1220, 600, .5, 0, '');
    s += person({ age: 'adult', x: 560, y: 1080, s: 1.0, expr: 'happy', shirt: '#5b7bd6', hair: 'short', armR: [-10, -40], armL: [120, 100] }, t);
    s += G(tr(900, 600), plasticBag({ x: 0, y: 0, s: .8, print: false }, t) + [[-34, 40], [30, 50], [-4, 0]].map(([x, y], i) => op(seg(t, T3 - .3 + i * .15, T3 + i * .15), circ(x, y - 40 * (1 - seg(t, T3 - .3 + i * .15, T3 + i * .15)), 30, '#ff5d4d', 5) + path(`M${x - 8} ${y - 26}l8 -10l8 10`, 'none', 5, '#4f9a45'))).join(''));
    return s + tag(CX, 150, '3 TOMATES', t, T3, '#ff5d4d', '#fff', 64) + (t > T10 - .05 ? G(tr(1550, 330, pop(t, T10 - .05)), circ(0, 0, 110, '#fff') + line(0, 0, 0, -80, 10) + line(0, 0, 60, 20, 10) + rect(-20, -140, 40, 30, '#fff', 6) + text(0, 190, OL, '10 MIN', '#ffd23f', 60)) : ''); },
  sfx: [[0, 'el:bag_rustle', .7], [at(89, 'tomates') - at(89, 'transporter') - .2, 'pop', .6], [at(89, 'tomates') - at(89, 'transporter'), 'pop_hi', .6], [at(89, 'tomates') - at(89, 'transporter') + .15, 'kaching', .6], [at(89, '10') - at(89, 'transporter'), 'tick', .9]] }, at(89, 'transporter'));

// B090a — large dehors : arrivée à la maison, on vide les tomates, on lâche le sac… le vent l'emporte vers la mer
B(90, { enter: 'none', cam: (t, d) => ({ z: 1.02 }),
  draw: t => { const k = seg(t, .35, 1.6);
    return depth({ zoom: 1 }, [{ z: 4, svg: grad('#8fd3ff', '#e4f6ff', -900, -900, W + 1800, 1700) + cloud(400, 160, 1) + cloud(1500, 120, .8) },
      { z: 2, svg: rect(-900, 640, W + 1800, 100, SEA, 0, 0) + building(60, 760, 360, 520, '#e9c9a0') + building(1500, 760, 300, 380, '#cfd8e2'), haze: .25 },
      { z: 1, svg: rect(-900, 820, W + 1800, 600, '#c9ccd1', 0, 0) + G(tr(580, 160), rect(-110, -40, 220, 80, '#fff', 16) + text(0, 22, 'none', '10:00', OL, 56)) + person({ age: 'adult', x: 560, y: 1000, s: .9, expr: 'happy', shirt: '#5b7bd6', hair: 'short', armR: t < .35 ? [-30, -60] : [20, -30], armL: [120, 100] }, t) +
        [0, 1, 2].map(i => circ(700 + i * 60 + t * 60, 990 - i * 4, 26, '#ff5d4d', 5)).join('') +
        plasticBag({ x: lerp(760, 1900, k), y: lerp(620, 120, k) + Math.sin(k * 9) * 60, s: .7, print: false, rot: k * 300 }, t) + (k > 0 ? motionLines(lerp(620, 1700, k), lerp(640, 160, k), 4, 140, 180, '#fff') : '') }]); },
  sfx: [[0, 'tick', .6], [.2, 'pop', .5], [.4, 'el:a_wind', .8], [.5, 'whoosh', .8], [1.2, 'el:bag_rustle', .5]] });
// B090b — profil sous l'eau : le sac dérive pendant que les calendriers défilent ; les poissons fuient — DES ANNÉES
B(90, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: t => { const y = Math.floor(seg(t, .1, 2.0) * 50);
    return depth({ x: t * 80, zoom: 1 }, [...underLayers(t * 3, { dark: .25, floor: 1000, seed: 41 }),
      { z: 1, svg: plasticBag({ x: 700 + t * 160, y: 520, s: 1.3 }, t) + G(tr(420 + t * 160, 420, pop(t, 0)), path('M0 -70L66 50L-66 50Z', '#ffd23f', 7) + text(0, 38, 'none', '!', OL, 90)) +
        [1500, 1700].map((x, i) => G(tr(x + t * 300, 640 + i * 120), fish({ x: 0, y: 0, s: .7, color: i ? '#7fd3ff' : '#ffb347', flip: 1 }, t) + sweat(40, -60, .5))).join('') +
        calendarPage(300 + t * 80, 300, .7, t * 120) + tag(CX + t * 80, 140, '+ ' + y + ' ANS', t, 0, '#fff', OL, 64) +
        bigText(['DES ANNÉES'], t, at(90, 'annees') - at(90, 'danger') - .05, CX + t * 80, 300, '#ff5d5d', 100) },
      b_fg(t, { seed: 42, kelp: false })]); },
  sfx: [[0, 'el:time_pass', .8], [.05, 'sting', .5], [.6, 'clock_fast', .6], [at(90, 'annees') - at(90, 'danger'), 'el:hit_cine', .6]] }, at(90, 'danger'));

// B091a — tableau pédagogique : un prof-poisson à lunettes montre une tortue (silhouette) qui avale un bout de plastique
B(91, { enter: 'tilt', cam: camPush(1.0, 1.05, .2),
  draw: t => { const A = at(91, 'avale'), k = seg(t, A, A + 1.3);
    const px = lerp(1180, 860, seg(k, 0, .3)), py = lerp(380, 520, seg(k, .3, 1)), pxx = lerp(px, 760, seg(k, .3, 1));
    return grad('#f3efe4', '#e2dccb', -200, -200, W + 400, H + 400) + blackboard(380, 120, 1160, 560, '') +
      G(tr(900, 560, 1.05), path('M-260 0C-260 -220 220 -230 260 0Z', 'rgba(255,255,255,.12)', 6, '#fff') + circ(330, -110, 70, 'rgba(255,255,255,.12)', 6, '#fff') + path('M300 -80C200 -60 120 -40 40 -40C-60 -40 -120 -20 -140 20', 'none', 22, 'rgba(255,170,170,.7)')) +
      G(tr(pxx, py, .35, k * 300), plasticBag({ x: 0, y: 0, s: 1, print: false }, t)) + text(960, 200, 'none', 'Déchets avalés', '#fff', 50) +
      G(tr(1700, 600), fish({ x: 0, y: 0, s: 1.3, color: '#7fd3ff', rot: -10 }, t) + circ(-65, -18, 26, 'rgba(255,255,255,.3)', 5) + line(-150, 60, -320, -120, 10, '#8a5a3a')); },
  sfx: [[0, 'scratch', .5], [.3, 'pop', .5], [at(91, 'avale'), 'gulp', .9], [at(91, 'avale') + .8, 'whoosh', .4]] });
// B091b — dans le tube digestif : les aliments font la queue, bloqués derrière le plastique — BOUCHON
B(91, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .4 }),
  draw: t => grad('#ffd0d6', '#f4a7b3', -200, -200, W + 400, H + 400) + path('M-200 300Q960 230 2120 300L2120 640Q960 700 -200 640Z', '#ff8fa3') + path('M-200 330Q960 270 2120 330M-200 610Q960 670 2120 610', 'none', 8, '#e2687f') +
    G(tr(1450, 470, 1, wave(t, 1, 4)), plasticBag({ x: 0, y: -40, s: 1, print: false }, t)) +
    [300, 560, 820, 1080].map((x, i) => b_food(x + Math.sin(t * 9 + i) * 6, 480, 1.35, t, ['#7cc46a', '#ffb347', '#62c26a', '#ff8fb1'][i]) + (i === 3 ? G(tr(x + 60, 380, pop(t, .4)), text(0, 0, OL, 'TUUUT !', '#fff', 46)) : '')).join('') +
    G(tr(1700, 220, pop(t, .2)), path('M0 -90L90 70L-90 70Z', '#ffd23f', 8) + text(0, 55, 'none', '!', OL, 110)) + tag(760, 160, 'BOUCHÉ', t, at(91, 'obstruer') - at(91, 'ils'), '#ff4d4d', '#fff', 70),
  sfx: [[0, 'el:hit_cine', .4], [.4, 'el:car_horn', .5], [at(91, 'obstruer') - at(91, 'ils'), 'error_beep', .8], [1.4, 'el:traffic', .3]] }, at(91, 'ils'));

// B092 — gros plan : elle toise le sac… et le contourne avec un petit air supérieur
B(92, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.08, 1.0, t / d), hand: .4 }),
  draw: t => { const P = at(92, 'passes'), k = eInOut(seg(t, P - .2, P + .6));
    return depth({ x: k * 150, zoom: 1 }, [...underLayers(t, { seed: 43 }),
      { z: 1, svg: plasticBag({ x: 1450, y: 380, s: 1.1, print: false }, t) + G(tr(lerp(500, 1150, k), 760 - Math.sin(k * Math.PI) * 300, 1, -20 * Math.sin(k * Math.PI)), torA({ x: 0, y: 0, s: 2.0, expr: k > .1 ? 'smugger' : 'suspicious', swim: k > .1 ? 1.5 : 0, look: [1, -.6] }, t)) + check(1720, 260, .8, t, P + .5) },
      b_fg(t, { seed: 44, k2: false })]); },
  sfx: [[0, 'hmm', .8], [at(92, 'passes') - .1, 'el:swim_whoosh', .8], [at(92, 'passes') + .5, 'ding', .7]] });
// B093 — contre-plongée : elle file vers la lumière, guillerette
B(93, { enter: 'drop', cam: (t, d) => ({ z: 1.04, cy: 300, r: -4 }),
  draw: t => { const k = t / 1.18;
    return depth({ zoom: 1 }, [...underLayers(t, { surface: 100, seed: 45 }), { z: 1, svg: rays(t, CX, -50, 'rgba(255,255,255,.18)', 'rgba(255,255,255,0)', 14) + torA({ x: lerp(400, 1500, k), y: lerp(760, 460, k), s: 1.3, rot: -25, swim: 2, expr: 'joy' }, t) + b_notes(lerp(500, 1600, k), 500, t, 2) },
      b_fg(t, { seed: 46, kelp: false })]); },
  sfx: [[0, 'el:swim_whoosh', .8], [.3, 'whistle', .5]] });

// ============================================================
//  LE FILET
// ============================================================
// B094 — plongée depuis le ciel : aube orange, un chalutier vu d'en haut traîne ses lignes
B(94, { enter: 'none', cam: (t, d) => ({ z: lerp(1.15, 1.02, eOutCubic(t / d)), r: lerp(-6, 0, t / d) }),
  draw: t => b_waterTop(t, '#f7a35c', '#2a6f96', 'rgba(255,230,180,.5)') + G(tr(1075, 415, .9), op(.25, path('M0 -320C110 -220 130 0 120 260L-120 260C-130 0 -110 -220 0 -320Z', '#000', 0))) +
    path('M1000 700L700 1200M1060 700L1300 1200M1030 700L1030 1200', 'none', 6, 'rgba(255,255,255,.6)') + Array.from({ length: 6 }, (_, i) => circ(760 + i * 110, 1000 + Math.sin(i) * 30, 16, '#ff8a2a', 5)).join('') +
    b_boatTop(1030, 360, .9, 0) + glow(300, 100, 400, '#fff1c0', .5),
  sfx: [[0, 'el:a_wind', .5], [.1, 'el:car_engine', .25], [.5, 'sting', .4]] });

// B095 — moyen → recul brutal : elle nage… puis la caméra recule et dévoile un filet IMMENSE
B(95, { enter: 'none', cam: () => ({ z: 1.0, hand: .4 }),
  draw: (t, d) => { const I = at(95, 'immense'), k = eInOut(seg(t, I - .1, I + .5)), z = lerp(1.7, 1.0, k);
    const c = { x: lerp(-150 * 1.7, 0, k), y: lerp(140 * 1.7, 0, k), zoom: z };
    return depth(c, [...underLayers(t, { dark: .35, floor: 1010, seed: 47 }),
      { z: 1.3, svg: b_net(t, { x: 1350, y: 0, w: 1700, h: 1050, n: 16 }) + Array.from({ length: 6 }, (_, i) => fish({ x: 900 + i * 220, y: 300 + (i % 3) * 200, s: .5, color: '#ffb347', rot: wave(t, 4, 20, i / 6), tf: 6 }, t)).join(''), haze: .15, hazeCol: '#163a5a' },
      { z: 1, svg: torA({ x: 520, y: 730, s: 1.3, expr: t > at(95, 'filet') - .1 ? 'jawdrop' : 'happy', swim: t > I ? 0 : 1, look: [1, -.3] }, t) },
      b_fg(t, { seed: 48, kx: -80, k2: false })]) + (t > I && t < I + .15 ? `<rect width="${W}" height="${H}" fill="rgba(255,255,255,.6)"/>` : ''); },
  sfx: [[0, 'el:swim_whoosh', .5], [at(95, 'immense') - .1, 'el:hit_cine', .9], [at(95, 'immense'), 'sting', .8], [at(95, 'filet'), 'el:net_creak', .7]] });

// B096 — profil : des poissons paniquent dans les mailles ; elle, au premier plan, horrifiée
B(96, { enter: 'whip', cam: (t, d) => ({ z: 1.04, hand: .8 }),
  draw: t => { let f = ''; for (let i = 0; i < 7; i++) f += G(tr(820 + i * 160 + wave(t, 3, 20, i / 7), 300 + (i % 3) * 170 + wave(t, 2.5, 30, i / 3), 1, wave(t, 4, 25, i / 5)), fish({ x: 0, y: 0, s: .75, color: ['#ffb347', '#7fd3ff', '#ff8fb1', '#ffd23f'][i % 4], tf: 7, flip: i % 2 }, t) + sweat(i % 2 ? 60 : -60, -60, .5));
    return depth({ zoom: 1 }, [...underLayers(t, { dark: .35, seed: 49 }),
      { z: 1, svg: f + net(1300, 150, 1300, 760, t, { n: 14, tight: .3 + .1 * Math.sin(t * 3) }) + G(tr(1250, 120, pop(t, .5), -4), rect(-230, -50, 460, 100, '#fff', 14) + text(0, 18, 'none', 'AU SECOURS !', '#ff4d4d', 52)) },
      { z: .7, svg: torA({ x: 160, y: 760, s: 1.5, expr: 'scared', tremble: 1, look: [1, 0] }, t), blur: 2 }]); },
  sfx: [[0, 'el:fish_school', .9], [.3, 'el:struggle', .6], [.5, 'pop', .5], [1.2, 'el:net_creak', .6]] });

// B097 — très large : demi-tour en dérapage… le filet l'avale — gel de l'image, TROP TARD
B(97, { enter: 'none', cam: (t, d) => ({ z: 1.02, shake: t < at(97, 'trop') ? 4 : 0 }),
  overlay: t => (t > at(97, 'trop') ? `<rect width="${W}" height="${H}" fill="rgba(255,40,40,.18)"/>` : ''),
  draw: t => { const T1 = at(97, 'trop'), tt = Math.min(t, T1), k = eOutCubic(seg(tt, 0, .5)), n = seg(tt, .3, T1);
    return depth({ zoom: 1 }, [...underLayers(tt, { dark: .35, floor: 1010, seed: 50 }),
      { z: 1, svg: (k > .3 ? path(`M${lerp(1100, 800, n) + 200} 720q120 -40 260 0`, 'none', 8, 'rgba(255,255,255,.5)') + b_bub(lerp(1100, 800, n) + 300, 820, tt, 6, 3) : '') +
        torA({ x: lerp(1100, 800, n), y: 730, s: 1.3, flip: k > .5 ? 1 : 0, expr: k > .5 ? 'terror' : 'shock', swim: 5 }, tt) + b_net(tt, { x: lerp(2600, 1200, eInCubic(n)), y: 0, w: 2200, h: 1100, tight: .2 }) +
        tag(CX, 150, 'TROP TARD', t, T1, '#ff4d4d', '#fff', 80) },
      b_fg(tt, { seed: 51, kx: 1950, k2: false })]); },
  sfx: [[0, 'el:brake', .7], [.1, 'whoosh', .8], [.6, 'el:net_creak', .7], [at(97, 'trop'), 'el:hit_cine', 1], [at(97, 'trop') + .05, 'sting', .7]] });

// B098 — gros plan : la nageoire, la maille se referme, les cordes s'enroulent
B(98, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.14, t / d), hand: .6 }),
  draw: t => { const k = seg(t, .2, at(98, 'coince'));
    let s = grad('#1d4e72', '#0a2440', -200, -200, W + 400, H + 400) + G(tr(560, 640, 3.2, -15 + wave(t, 3, 6 * (1 - k))), flipper(150, 46, T_SKIN, false));
    for (let i = 0; i < 4; i++) s += op(clamp(k * 4 - i), path(`M${820 + i * 80} 300C${900 + i * 80} 480 ${780 + i * 80} 640 ${880 + i * 80} 840`, 'none', 20) + path(`M${820 + i * 80} 300C${900 + i * 80} 480 ${780 + i * 80} 640 ${880 + i * 80} 840`, 'none', 11, '#ebebdc'));
    return s + net(1150, 60, 1500, 1000, t, { n: 12, floats: false, rope: false, tight: .2 * k }) + torAF({ x: 1580, y: 880, r: 110, expr: t > at(98, 'coince') ? 'terror' : 'shock', armL: 220, armR: -40 }, t) + (t > at(98, 'coince') ? emark(1340, 300, .9 * pop(t, at(98, 'coince'))) : ''); },
  sfx: [[0, 'el:net_creak', .9], [.4, 'el:struggle', .4], [at(98, 'coince'), 'squeak', .9], [at(98, 'coince') + .05, 'sting', .6]] });

// B099 — contre-plongée épaule : elle tire, le filet s'étire comme un élastique
B(99, { enter: 'whip', cam: (t, d) => ({ z: 1.06, cy: 900, r: -6, hand: 1.2, shake: 4 }),
  draw: t => { const p = .35 + .2 * Math.abs(Math.sin(t * 7));
    return depth({ zoom: 1 }, [...underLayers(t, { dark: .4, surface: 60, seed: 52 }),
      { z: 1, svg: net(1400, 60, 1300, 1000, t, { n: 12, pull: [960, 640, p], floats: false }) + torA({ x: 760 - p * 120, y: 760, s: 1.7, flip: 1, rot: 12, expr: 'effort', flail: 1 }, t) + motionLines(260, 580, 3, 120, 180, '#fff') + sweat(380, 560, 1) },
      b_fg(t, { seed: 53, kelp: false })]); },
  sfx: [[0, 'hmm', 1], [.1, 'el:net_creak', .9], [.4, 'el:struggle', .7]] });

// B100 — plongée zénithale : le filet se resserre autour d'elle
B(100, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.15, eInOut(t / d)), r: lerp(0, 8, t / d) }),
  draw: t => { const k = eOutCubic(seg(t, 0, at(100, 'resserre') + .2));
    return b_floorTop(t) + `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="rgba(10,30,60,.45)"/>` + torAT({ x: CX, y: CY + 40, s: 1.4, swim: 4 }, t) + G(tr(CX, CY + 40), sweat(160, -260, .9) + sweat(-170, -200, .7)) +
      net(CX, CY - lerp(900, 380, k), lerp(2600, 780, k), lerp(1800, 760, k), t, { n: 14, floats: false, rope: false, rot: 45, sw: 9 }); },
  sfx: [[0, 'el:net_creak', 1], [.3, 'whoosh', .6], [at(100, 'resserre'), 'snip', .7], [at(100, 'resserre') + .1, 'el:struggle', .5]] });

// B101 — moyen, épaule + débullé : elle se débat comme une furie
B(101, { enter: 'punch', cam: (t, d) => ({ z: 1.08, r: 8, hand: 1.5, shake: 8 }),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { dark: .45, seed: 54 }),
    { z: 1, svg: torA({ x: 760, y: 720, s: 1.5, expr: 'panic', flail: 1, tremble: 1 }, t) + b_net(t, { x: 900, y: 200, w: 1500, h: 900, n: 14, tight: .35, floats: false }) + b_bub(900, 600, t, 8, 3, 1.3) + motionLines(400, 500, 3, 100, 200, '#fff') + motionLines(1400, 520, 3, 100, -20, '#fff') }]),
  sfx: [[0, 'el:struggle', 1], [.2, 'el:bubbles', .7]] });

// B102a — profil débullé : ENCORE !
B(102, { enter: 'whip', cam: (t, d) => ({ z: 1.06, r: -8, hand: 1, shake: 6 }),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { dark: .45, floor: 1000, seed: 55 }),
    { z: 1, svg: b_tangled(800, 670, 1.2, t, { expr: 'effort' }) + b_net(t, { x: CX, y: 160, w: 1700, h: 900, n: 14, tight: .35, floats: false }) + tag(CX, 150, 'ENCORE !', t, at(102, 'encore'), '#fff', OL, 72) },
    b_fg(t, { seed: 56, kelp: false })]),
  sfx: [[0, 'el:struggle', .9], [at(102, 'encore'), 'thud', .6], [.6, 'el:net_creak', .6]] });
// B102b — gros plan visage : effort, sueur, tremblements — ENCORE !!
B(102, { enter: 'crash', cam: (t, d) => ({ z: 1.08, r: 7, hand: 1, shake: 8 }),
  draw: t => depth({ zoom: 1 }, [...underLayers(t, { dark: .5, seed: 57 }).slice(0, 2),
    { z: 1, svg: torAF({ x: CX, y: 920, r: 150, expr: 'effort', tremble: 1.5, armL: 240, armR: -60 }, t) + sweat(CX + 230, 380, 1.2) + sweat(CX - 240, 420, 1) + tag(CX, 130, 'ENCORE !!', t, 0, '#ffd23f', OL, 76) },
    { z: .6, svg: path('M-200 200L2200 900M-200 900L2200 260', 'none', 26) + path('M-200 200L2200 900M-200 900L2200 260', 'none', 14, '#ebebdc'), blur: 4 }]),
  sfx: [[0, 'el:struggle', 1], [.05, 'hmm', 1], [.5, 'el:net_creak', .6]] }, at(102, 'encore', 2));
// B102c — « et soudain… » : tout s'arrête, très gros plan, yeux grands ouverts
B(102, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), bars: 1 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#08182c', 0, 0) + glow(CX, 560, 700, '#1d4e72', .8) + torAF({ x: CX, y: 1150, r: 260, expr: 'shock', face: { mouth: 'flat' }, bob: 0 }, t),
  sfx: [[0, 'el:record', .8], [.1, 'el:heart_slow', .9]] }, at(102, 'et'));

// B103 — très large : minuscule dans le filet, la surface est TRÈS loin là-haut
B(103, { enter: 'none', cam: (t, d) => ({ z: lerp(1.3, 1.0, eOutCubic(t / d)), cy: 760 }),
  draw: t => bgUnder(t, { dark: .55, surface: 70, seed: 58 }) + glow(CX, 40, 700, '#fff8c8', .35) + path(`M${CX} 640L${CX} 170`, 'none', 10, 'rgba(255,255,255,.6)').replace('stroke-linecap', 'stroke-dasharray="20 22" stroke-linecap') +
    path(`M${CX - 40} 210L${CX} 160L${CX + 40} 210`, 'none', 10, 'rgba(255,255,255,.7)') + tag(CX, 110, 'SURFACE', t, .2, '#5ec4f0', '#fff', 56) +
    b_tangled(CX - 60, 720, .55, t, { calm: 1, expr: 'shock' }) + net(CX, 600, 700, 260, t, { n: 10, floats: false }) + G(tr(CX + 150, 590, pop(t, .5)), qmark(0, 0, .45)),
  sfx: [[0, 'sting', .8], [.2, 'el:heart_slow', .6], [.6, 'el:sonar', .5]] });

// B104 — gros plan : apnée, joues gonflées à bloc, yeux exorbités, le visage vire au rouge
B(104, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 3 }),
  draw: t => { const r = 160, hy = 950 - 2.05 * r, hb = .5 + .5 * Math.max(0, Math.sin(t * 9));
    return grad('#16304d', '#081a2e', -200, -200, W + 400, H + 400) + glow(CX, hy, 700, '#ff3b30', .25 * hb) + torAF({ x: CX, y: 950, r, expr: 'terror', face: { mouth: 'o-small' }, burn: .2 + .35 * seg(t, 0, 1.4), tremble: 1, armL: 230, armR: -50 }, t) + b_puff(CX, hy, r, 1.15, t) +
      thought(1450, 300, 360, 240, text(0, 30, 'none', 'AIR', SEA_D, 100), pop(t, at(104, 'respirer'))); },
  sfx: [[0, 'heartbeat', 1], [.3, 'boing', .4], [at(104, 'respirer'), 'pop', .6], [.9, 'heartbeat', 1]] });

// B105 — contre-plongée : elle s'étire vers la lumière… la corde la ramène comme un élastique
B(105, { enter: 'drop', cam: (t, d) => ({ z: 1.04, cy: 300, r: 5, hand: .7 }),
  draw: t => { const Rm = at(105, 'remonter'), up = t < Rm ? eOutCubic(seg(t, 0, Rm)) : 1 - eOutBack(seg(t, Rm, Rm + .4)) * 1, y = 840 - up * 260;
    return depth({ zoom: 1 }, [...underLayers(t, { dark: .5, surface: 90, seed: 59 }), { z: 1, svg: glow(CX, 0, 700, '#fff8c8', .4) + line(960, y + 40, 1000, 1300, 14, '#ebebdc') + line(960, y + 40, 1000, 1300, 6, '#bdb9a6') +
      torA({ x: 960, y, s: 1.4, rot: -70, swim: 4, expr: t > Rm ? 'pain' : 'effort' }, t) + cross(CX, 150, .8, t, Rm + .1) + (t > Rm ? impactStar(1000, y + 60, .4) : '') }]); },
  sfx: [[0, 'whoosh_up', .7], [.3, 'el:swim_whoosh', .6], [at(105, 'remonter'), 'boing', .9], [at(105, 'remonter') + .1, 'error_beep', .7]] });

// B106 — plongée zénithale : radio rouge, poumons qui se vident, ALERTE
B(106, { enter: 'none', cam: (t, d) => ({ z: lerp(1.04, 1.12, t / d), r: lerp(4, -2, t / d) }),
  draw: t => grad('#2a0e1a', '#3a1424', -200, -200, W + 400, H + 400) + Array.from({ length: 14 }, (_, i) => line(-200, i * 90, W + 200, i * 90, 2, 'rgba(255,120,120,.12)')).join('') +
    b_lungs(CX, 620, 1.0, t, .55 - .25 * seg(t, 0, 1.8) + .06 * Math.sin(t * 6), .5 + .5 * Math.abs(Math.sin(t * 5))) +
    G(tr(360, 220, 1, -8), op(Math.sin(t * 10) > 0 ? 1 : .4, path('M0 -90L90 70L-90 70Z', '#ff4d4d', 8) + text(0, 55, 'none', '!', '#fff', 110))) + tag(1480, 330, 'AIR ?!', t, at(106, 'air'), '#ff4d4d', '#fff', 70),
  sfx: [[0, 'heartbeat', .9], [.2, 'siren', .4], [at(106, 'air'), 'error_beep', .8], [1.0, 'heartbeat', .9]] });

// B107a — moyen : dans le filet, la jauge d'O₂ se vide
B(107, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .8 }),
  draw: t => { const k = lerp(.6, .3, seg(t, 0, 1.3));
    return depth({ zoom: 1 }, [...underLayers(t, { dark: .6, floor: 1000, seed: 60 }),
      { z: 1, svg: b_tangled(650, 690, 1.3, t, { expr: 'worried' }) + net(700, 260, 1100, 800, t, { n: 12, floats: false, rope: false }) + b_o2(1500, 470, 1.0, k, 'O₂', t) + tag(1500, 130, Math.round(k * 100) + ' %', t, 0, '#ffb340', '#fff', 64) },
      b_fg(t, { seed: 61, kelp: false })]); },
  sfx: [[0, 'el:heart_slow', .9], [.6, 'tick', .6], [1.0, 'tick', .6]] });
// B107b — très gros plan compte à rebours : O₂ BATTERIE FAIBLE, chrono rouge ; elle panique dans le coin
B(107, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), shake: 2 }),
  draw: t => { const sec = Math.max(3, 9 - Math.floor(t * 4)), bl = Math.sin(t * 12) > 0;
    return rect(-200, -200, W + 400, H + 400, '#12060c', 0, 0) + glow(1120, 380, 700, '#ff2a2a', bl ? .35 : .15) +
      text(1120, 470, '#000', '00:0' + sec, bl ? '#ff3b3b' : '#b02020', 260) +
      G(tr(1120, 150), rect(-160, -50, 300, 100, 'none', 16, 10, '#ff3b3b') + rect(150, -20, 20, 40, '#ff3b3b', 4, 0) + rect(-146, -36, 40, 72, '#ff3b3b', 8, 0) + text(10, 20, 'none', 'O₂ 8 %', '#ff3b3b', 50)) +
      torAF({ x: 330, y: 900, r: 110, expr: 'panic', tremble: 1, armL: 230, armR: -50 }, t) + b_puff(330, 900 - 2.05 * 110, 110, .8, t); },
  sfx: [[0, 'el:hit_cine', .5], [.1, 'ecg_beep', .8], [.35, 'tick', .9], [.6, 'tick', .9], [.85, 'tick', .9], [1.1, 'error_beep', .7]] }, at(107, 'oxygene'));

// B108 — profil serré, débullé : elle tire de TOUTES ses forces, vapeur, filet étiré à mort
B(108, { enter: 'crash', cam: (t, d) => ({ z: 1.08, r: -10, shake: 12, hand: 1 }),
  draw: t => { const p = .5 + .2 * Math.sin(t * 9);
    return depth({ zoom: 1 }, [...underLayers(t, { dark: .6, seed: 62 }),
      { z: 1, svg: net(1500, 120, 1200, 900, t, { n: 12, pull: [1000, 600, p], floats: false }) + torA({ x: 900 - p * 120, y: 670, s: 2.0, flip: 1, expr: 'rage', flipUp: 1, tremble: 1.5 }, t) + motionLines(200, 520, 4, 150, 180, '#fff') + G(tr(500, 300, pop(t, .3), -10), text(0, 0, OL, 'HNNNGH !', '#fff', 80)) }]); },
  sfx: [[0, 'el:struggle', 1], [.2, 'el:net_creak', 1], [.4, 'hmm', 1], [1.2, 'el:rope_snap', .2]] });

// B109 — large + médaillon loupe : la corde entaille la nageoire (pudique : petites marques rouges)
B(109, { enter: 'tilt', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .5 }),
  draw: t => { const E = at(109, 'entaille'), id = 'bmd' + (_gid++), k = pop(t, E - .1, .4);
    const inset = `<defs><clipPath id="${id}"><circle cx="1420" cy="380" r="230"/></clipPath></defs><g clip-path="url(#${id})">${rect(1180, 140, 480, 480, '#1d4e72', 0, 0) + G(tr(1300, 420, 1.8, -20), flipper(150, 46, T_SKIN, false) + (t > E ? path('M70 -22l12 12l-10 8l12 12M100 -18l10 10', 'none', 5, '#e2463a') : '')) + path('M1500 160C1450 380 1510 500 1460 640', 'none', 22) + path('M1500 160C1450 380 1510 500 1460 640', 'none', 12, '#ebebdc')}</g>`;
    return depth({ zoom: 1 }, [...underLayers(t, { dark: .55, floor: 1000, seed: 63 }),
      { z: 1, svg: b_tangled(560, 780, 1.0, t, { expr: t > E ? 'pain' : 'scared' }) + net(700, 330, 1100, 700, t, { n: 12, floats: false, rope: false }) + line(860, 680, 1250, 520, 6, '#fff') +
        (k > 0 ? G(`translate(1420 380) scale(${k}) translate(-1420 -380)`, inset + circ(1420, 380, 230, 'none', 12, '#fff')) : '') + (t > E ? G(tr(1180, 160, pop(t, E + .1)), text(0, 0, OL, 'AÏE !', '#ff6b6b', 70)) : '') },
      b_fg(t, { seed: 64, kelp: false })]); },
  sfx: [[0, 'el:net_creak', .8], [at(109, 'entaille') - .1, 'whoosh', .6], [at(109, 'entaille'), 'snip', .8], [at(109, 'entaille') + .05, 'squeak', .8]] });

// B110 — gros plan : elle tourne la tête à gauche, à droite (whip pans), le filet suit
B(110, { enter: 'whip', cam: (t, d) => { const s = Math.sin(t * 6); return { z: 1.06, x: s * 90, hand: .8 }; },
  draw: t => { const s = Math.sin(t * 6);
    return depth({ x: s * 120, zoom: 1 }, [...underLayers(t, { dark: .6, seed: 65 }).slice(0, 2),
      { z: 1, svg: torAF({ x: CX, y: 930, r: 150, expr: 'scared', look: [s > 0 ? 1 : -1, 0], headTilt: s * 14, armL: 220, armR: -40 }, t) + motionLines(CX - s * 420, 520, 3, 90, s > 0 ? 180 : 0, '#fff') },
      { z: .7, svg: b_net(t, { x: CX, y: -60, w: 2600, h: 1300, n: 16, floats: false, rope: false }), blur: 3 }]); },
  sfx: [[0, 'whoosh', .8], [.5, 'whoosh', .7], [1.0, 'whoosh', .7], [1.2, 'el:net_creak', .6]] });

// B111 — contre-plongée, flash : IMPOSSIBLE ; larmes en fontaine (sous l'eau : en bulles)
B(111, { flash: 1, enter: 'crash', cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), cy: 860, r: -6, shake: 6 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#2a0e1a', 0, 0) + rays(t, CX, 400, '#3a1424', '#2a0e1a', 18) + cross(CX, 520, 2.4, t, 0) + torAF({ x: CX, y: 920, r: 125, expr: 'sob', armL: 230, armR: -50 }, t) + b_bub(CX - 240, 600, t, 4, 2, .8) + b_bub(CX + 240, 600, t, 4, 2, .8) +
    bigText(['IMPOSSIBLE'], t, at(111, 'impossible') - .05, CX, 150, '#ff4d4d', 140),
  sfx: [[0, 'el:hit_cine', 1], [at(111, 'impossible'), 'error_beep', .8], [.5, 'el:crowd_aww', .4]] });

// B112a — plongée vers les profondeurs : elle s'enfonce, la lumière s'éteint, la caméra s'éloigne vers le haut
B(112, { enter: 'none', cam: (t, d) => ({ z: lerp(1.2, 1.0, eOutCubic(t / d)), r: lerp(0, -8, t / d) }),
  draw: t => { let s = grad('#123a5a', '#030b16', -200, -200, W + 400, H + 400); s += glow(CX, 560, lerp(700, 300, seg(t, 0, 2)), '#2f6f9a', .6);
    return s + torAT({ x: CX, y: 560 + t * 30, s: lerp(1.3, 1.0, t / 2), swim: .3 }, t) + net(CX, 300 + t * 30, 700, 560, t, { n: 12, floats: false, rope: false, rot: 30 }) + b_bub(CX, 400, t, 5, .6, .8); },
  sfx: [[0, 'el:heart_slow', .8], [.5, 'el:bubbles', .4], [1.2, 'el:sonar', .3]] });
// B112b — pédagogique, pudique : silhouettes de tortues dans des filets… un petit fantôme s'élève doucement
B(112, { enter: 'none', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
  draw: t => { const M = at(112, 'mourir') - at(112, 'tortues');
    return grad('#0b2236', '#050f1b', -200, -200, W + 400, H + 400) + [[500, 640], [960, 600], [1420, 640]].map(([x, y], i) => op(i === 1 ? (t > M ? 0 : 1) : .5, turtle({ age: 'adult', x, y, s: .9, seed: 4 + i, expr: 'sad', shell: '#4f6a5e', shellL: '#6a8576', skin: '#87a59a', bob: 0 }, 0) + net(x, y - 260, 420, 330, t, { n: 8, floats: false, rope: false, col: 'rgba(200,200,190,.6)' }))).join('') +
      (t > M ? op(.75, turtle({ age: 'adult', x: 960, y: 600, s: .9, ghost: seg(t, M, M + 1.2), expr: 'sad', seed: 5, bob: 0, shell: '#4f6a5e', shellL: '#6a8576', skin: '#87a59a' }, t)) : '') + tag(CX, 140, 'NOYADE', t, M, '#5a6b7c', '#fff', 60); },
  sfx: [[0, 'el:heart_slow', .7], [at(112, 'mourir') - at(112, 'tortues'), 'ghost', .5], [at(112, 'mourir') - at(112, 'tortues') + .3, 'angel', .3]] }, at(112, 'tortues'));

// B113 — moyen pédagogique : en piscine olympique, bonnet de bain, chrono record, médaille — elle SAIT nager
B(113, { enter: 'whip', cam: (t, d) => ({ z: 1.02, hand: .3 }),
  draw: t => { const k = t / 1.74;
    return grad('#7fe0f5', '#2a9fd0', -200, -200, W + 400, H + 400) + Array.from({ length: 7 }, (_, i) => line(-200 + i * 380 + (t * 20) % 40, 900, -100 + i * 380, 1100, 6, 'rgba(255,255,255,.3)')).join('') +
      [300, 860].map(y => Array.from({ length: 22 }, (_, i) => circ(i * 95 - (t * 300) % 95, y, 20, i % 2 ? '#ff4d4d' : '#fff', 4)).join('')).join('') +
      torA({ x: lerp(400, 1150, k), y: 680, s: 1.3, expr: 'effort', swim: 4, rot: -5 }, t) + G(tr(lerp(400, 1150, k) + 290, 610), path('M-60 -20Q0 -90 60 -20Z', '#ff4d6d', 6)) +
      G(tr(1650, 520), circ(0, 0, 100, '#fff') + line(0, 0, Math.sin(t * 8) * 70, -Math.cos(t * 8) * 70, 10) + rect(-20, -130, 40, 30, '#fff', 6)) + medal(1650, 260, pop(t, .9)) + tag(CX, 140, 'NAGER', t, .3, '#5fd068', OL, 64) + check(1180, 140, .6, t, .6); },
  sfx: [[0, 'el:splash', .6], [.2, 'el:swim_whoosh', .7], [.3, 'whistle', .7], [.9, 'tada', .6], [1.0, 'el:applause', .4]] });

// B114a — profil schéma : la surface là-haut, la flèche monte… et bute sur la corde
B(114, { enter: 'none', cam: zin(1, 1.04),
  draw: t => { const k = seg(t, .2, 1.0);
    return bgWhite() + rect(-200, -200, W + 400, 380, '#cdeffa', 0, 0) + b_surf(t, 180, '#5ec4f0') + tag(CX, 110, 'SURFACE', t, 0, '#5ec4f0', '#fff', 56) +
      net(CX, 850, 1300, 300, t, { n: 12, col: '#8a8f99', sw: 5, floats: false }) + line(860, 860, 860, 690, 8, '#8a8f99') +
      torA({ x: 760, y: 680, s: 1.1, expr: 'worried', swim: 2 }, t) + path(`M1100 560L1100 ${lerp(560, 330, k)}`, 'none', 18, '#5fd068') + (k >= 1 ? path('M1060 360L1100 310L1140 360', 'none', 18, '#5fd068') : '') + cross(1100, 300, .7, t, 1.0); },
  sfx: [[0, 'pop', .5], [.2, 'whoosh_up', .7], [1.0, 'error_beep', .8]] });
// B114b — gros plan contre-plongée : la nageoire tendue vers la lumière, si près…
B(114, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 300, r: 4 }),
  draw: t => grad('#bff2ff', '#123a5a', -200, -200, W + 400, H + 400) + rays(t * .3, 1050, 0, 'rgba(255,255,255,.25)', 'rgba(255,255,255,0)', 16) + b_surf(t, 140, 'rgba(255,255,255,.55)') +
    torA({ x: 900, y: 1000, s: 2.0, rot: -60, expr: 'sob', flipUp: 1, fa: -20 + wave(t, 2, 6) }, t) + line(1500, 160, 1500, 470, 8, '#fff') + line(1470, 160, 1530, 160, 8, '#fff') + line(1470, 470, 1530, 470, 8, '#fff') + G(tr(1620, 330), text(0, 0, OL, '2 m', '#fff', 64)) + tag(560, 230, 'SI PRÈS…', t, .3, '#fff', SEA_D, 56),
  sfx: [[0, 'el:heart_slow', .8], [.3, 'hmm', .6], [.8, 'el:bubbles', .4]] }, at(114, 'surface') - .2);

// B115 — très large, épaule violente : elle se débat dans un nuage de sable
B(115, { enter: 'whip', cam: (t, d) => ({ z: 1.06, r: 10 * Math.sin(t * 3), hand: 1.5, shake: 9 }),
  draw: t => { const r = rng(7); let sand = ''; for (let i = 0; i < 14; i++) { const q = (t * .8 + r()) % 1; sand += circ(400 + r() * 1100 + (r() - .5) * 400 * q, 960 - 300 * q, 40 + 70 * q, `rgba(200,170,120,${.5 * (1 - q)})`, 0); }
    return depth({ zoom: 1 }, [...underLayers(t, { dark: .6, floor: 960, seed: 66 }), { z: 1, svg: sand + b_tangled(760, 700, 1.2, t, { expr: 'rage' }) + b_net(t, { x: CX, y: 200, w: 1700, h: 900, n: 14, tight: .35, floats: false }) + b_bub(1000, 600, t, 8, 3) + b_o2(1700, 380, .5, .08, '', t) }]); },
  sfx: [[0, 'el:struggle', 1], [.3, 'el:net_creak', .7], [.6, 'el:bubbles', .5]] });

// B116a — très gros plan : une maille abîmée, les fibres lâchent une à une
B(116, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.2, eInOut(t / d)), shake: 1 + 4 * t / d }),
  draw: (t, d) => { const k = seg(t, 0, d), n = 7 - Math.floor(k * 5);
    let s = grad('#1d4e72', '#0a2440', -200, -200, W + 400, H + 400) + path(`M-200 ${480}L${CX - 60} 470`, 'none', 70) + path(`M-200 480L${CX - 60} 470`, 'none', 54, '#ebebdc') + path(`M${CX + 60} 470L${W + 200} 460`, 'none', 70) + path(`M${CX + 60} 470L${W + 200} 460`, 'none', 54, '#ebebdc');
    for (let i = 0; i < 7; i++) s += i < n ? line(CX - 70, 448 + i * 7, CX + 70, 446 + i * 7, 6, '#d9d6c4') : path(`M${CX - 70} ${448 + i * 7}q30 ${-20 - i * 4} 50 ${-36 - i * 3}M${CX + 70} ${446 + i * 7}q-30 ${20 + i * 4} -50 ${30 + i * 3}`, 'none', 5, '#d9d6c4');
    return s + (k > .2 ? G(tr(1400, 250, pop(t, .4 * d)), text(0, 0, OL, 'crrr…', '#fff', 70)) : '') + G(tr(400, 280, pop(t, at(116, 'maille'))), path('M0 -70L66 50L-66 50Z', '#ffd23f', 7) + text(0, 38, 'none', '!', OL, 90)); },
  sfx: [[0, 'el:net_creak', 1], [at(116, 'maille'), 'crack', .5], [1.2, 'crack', .6], [1.6, 'crack', .7]] });
// B116b — CRAC ! la maille cède au ralenti
B(116, { flash: 1, enter: 'punch', cam: (t, d) => ({ z: 1.12, shake: t < .2 ? 14 : 0 }),
  draw: t => { const k = eOutCubic(seg(t, 0, .5));
    return grad('#2a6f96', '#0a2440', -200, -200, W + 400, H + 400) + rays(t, CX, 470, 'rgba(255,255,255,.12)', 'rgba(255,255,255,0)', 18) +
      G(tr(-k * 260, k * 80, 1, -k * 10), path(`M-200 480L${CX - 60} 470`, 'none', 70) + path(`M-200 480L${CX - 60} 470`, 'none', 54, '#ebebdc')) + G(tr(k * 260, -k * 80, 1, -k * 10), path(`M${CX + 60} 470L${W + 200} 460`, 'none', 70) + path(`M${CX + 60} 470L${W + 200} 460`, 'none', 54, '#ebebdc')) +
      impactStar(CX, 470, .9 * pop(t, 0)) + shockRing(CX, 470, t, 0, '#fff') + G(tr(CX, 220, pop(t, .05)), text(0, 0, OL, 'CRAC !', '#ffd23f', 120)); },
  sfx: [[0, 'el:rope_snap', 1], [.02, 'crack', .9], [.1, 'el:hit_cine', .6]] }, at(116, 'ceder') - .1);

// B117 — contre-plongée : elle jaillit par le trou vers la caméra
B(117, { flash: 1, enter: 'crash', cam: (t, d) => ({ z: 1.06, shake: 5 }),
  draw: t => { const k = eOutCubic(seg(t, 0, .8)), r = lerp(70, 170, k);
    return grad('#2a6f96', '#0e2a44', -200, -200, W + 400, H + 400) + speedLines(t, CX, 560, 34, 'rgba(255,255,255,.55)') + net(CX, -200, 2600, 1500, t, { n: 10, floats: false, rope: false, sw: 12, pull: [CX, 560, -.9] }) +
      torAF({ x: CX, y: lerp(820, 950, k), r, expr: 'effort', armL: 250, armR: -70 }, t) + b_bub(CX - 330, 900, t, 5, 3, 1.2) + b_bub(CX + 330, 900, t, 5, 3, 1.2); },
  sfx: [[0, 'whoosh_up', 1], [.05, 'el:swim_whoosh', .9], [.4, 'el:bubbles', .6]] });

// B118 — plongée sur l'abîme : elle remonte vers nous, -8 m… -1 m, O₂ qui clignote
B(118, { enter: 'drop', cam: (t, d) => ({ z: 1.02, r: wave(t, .5, 2), hand: .6 }),
  draw: t => { const k = seg(t, 0, 2.0), m = Math.max(1, Math.round(lerp(8, 1, k)));
    return radial(CX, CY, 1300, '#04101f', '#2a7fb0') + streaks(t * .4, 1, 0) + Array.from({ length: 10 }, (_, i) => { const q = (t * .7 + i / 10) % 1; return circ(CX + Math.cos(i * 2.4) * 900 * q, CY + Math.sin(i * 2.4) * 600 * q, 6 + q * 30, 'rgba(255,255,255,.3)', 4, 'rgba(255,255,255,.7)'); }).join('') +
      torAT({ x: CX, y: lerp(640, 560, k), s: lerp(.5, 1.6, eInCubic(k)), swim: 4 }, t) + tag(1540, 300, '-' + m + ' m', t, 0, '#0f4c74', '#fff', 70) + b_o2(330, 450, .7, .05, 'O₂', t) +
      tag(CX, 130, 'ENCORE UN PEU !', t, at(118, 'encore'), '#ffd23f', OL, 60); },
  sfx: [[0, 'el:swim_whoosh', .9], [.3, 'heartbeat', .8], [.7, 'el:bubbles', .6], [at(118, 'encore'), 'heartbeat', 1], [1.6, 'el:riser', .5]] });

// B119 — moyen, RALENTI : sortie de l'eau explosive, couronne d'éclaboussures
B(119, { flash: 1, enter: 'none', cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(t / d)), shake: t < .25 ? 10 : 0 }),
  draw: t => { const wl = 640, k = eOutCubic(seg(t, 0, 1.2)), y = lerp(1000, 650, k);
    let drops = ''; for (let i = 0; i < 16; i++) { const a = R(195 + i * 10), q = seg(t, 0, 1.4); drops += circ(1060 + Math.cos(a) * 520 * q, wl - 40 + Math.sin(a) * 420 * q + 260 * q * q, 12 + (i % 3) * 6, '#fff', 4, '#9be2f5'); }
    return depth({ zoom: 1 }, [{ z: 3, svg: b_sky(wl, '#ffd7a8', '#fff1d9') + rays(t, 1060, 250, 'rgba(255,240,180,.4)', 'rgba(255,255,255,0)', 20) }, { z: 1, svg: b_water(t, wl) +
      path(`M${1060 - 300} ${wl}Q${1060 - 240} ${wl - 260 * k} ${1060 - 140} ${wl - 40}Q${1060} ${wl - 320 * k} ${1060 + 140} ${wl - 40}Q${1060 + 240} ${wl - 260 * k} ${1060 + 300} ${wl}Z`, 'rgba(255,255,255,.75)', 5, '#9be2f5') +
      torA({ x: 900, y, s: 1.7, rot: -40, swim: .3, expr: 'panic', face: { mouth: 'o-small' } }, t * .4) + b_waterFront(t, wl, .25) + drops }]); },
  sfx: [[0, 'el:surface', 1], [.05, 'el:splash', 1], [.1, 'el:hit_cine', .6], [.5, 'el:wave_crash', .4]] });

// B120 — gros plan : L'INSPIRATION — elle aspire tout, l'air, les nuages, elle gonfle comme un ballon
B(120, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 3 }),
  draw: t => { const k = eOutCubic(seg(t, .1, 1.1)), r = 150 * (1 + .18 * k), hy = 960 - 2.05 * r;
    let suck = ''; for (let i = 0; i < 14; i++) { const a = i * 0.45, q = (t * 2 + i / 14) % 1, d0 = 900 * (1 - q); suck += line(CX + Math.cos(a) * d0, hy + 80 + Math.sin(a) * d0 * .6, CX + Math.cos(a) * (d0 + 160), hy + 80 + Math.sin(a) * (d0 + 160) * .6, 8, 'rgba(255,255,255,.7)'); }
    return depth({ zoom: 1 }, [{ z: 3, svg: b_sky(820, '#8fd3ff', '#fff1d9') }, { z: 1, svg: b_water(t, 820) + suck + G(tr(lerp(1600, CX, k), lerp(150, hy, k), 1 - k * .8), cloud(0, 0, .8)) +
      torAF({ x: CX, y: 960, r, expr: 'joy', face: { mouth: 'scream', eyes: 'closed' }, armL: 230, armR: -50, s: 1 }, t) + b_waterFront(t, 820, .3) + bigText(['HHHAAAAAAA !'], t, at(120, 'respires') - .2, CX, 140, '#fff', 120) }]); },
  sfx: [[0, 'el:gasp', 1], [at(120, 'respires') - .2, 'el:inhale', 1], [.4, 'whoosh_up', .6]] });

// B121a — très large au coucher du soleil : elle flotte, épuisée, pansement sur la carapace — SURVIE
B(121, { enter: 'tilt', cam: (t, d) => ({ z: 1.0, hand: .2 }),
  draw: (t, d) => { const wl = 640, c = camMove(t, d, { zoom: 1.12, y: 40 }, { zoom: 1.0, y: 0 });
    return depth(c, [{ z: 4, svg: b_sky(wl, '#ff9f7a', '#ffe1b0') + glow(CX, wl, 600, '#ffd27a', .6) + circ(CX, wl - 30, 120, '#ffb15a', 0) }, { z: 1, svg: b_water(t, wl, { w1: '#3b8fb5', w2: '#1a4466' }) +
      torA({ x: 900, y: 700 + wave(t, .3, 8), s: 1.1, expr: 'calm', band: 1, bob: 0, fa: 10 }, t) + b_waterFront(t, wl, .25) + tag(CX - 60, 150, 'SURVIE', t, at(121, 'survivre'), '#5fd068', OL, 70) + check(CX + 170, 150, .5, t, at(121, 'survivre') + .2) }]); },
  sfx: [[0, 'el:a_beach', .4], [.2, 'el:wave_crash', .3], [at(121, 'survivre'), 'tada', .6], [1.5, 'el:gull', .4]] });
// B121b — gros plan face caméra, regard blasé : on ajoute un bâton au tableau — « Encore. »
B(121, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d) }),
  draw: t => grad('#ffcf9a', '#ff9f7a', -200, -200, W + 400, H + 400) + torAF({ x: 760, y: 930, r: 150, expr: 'deadpan', band: 1, armL: 200, armR: -20 }, t) + b_tally(1420, 340, 5, t, .15),
  sfx: [[0, 'hmm', .6], [.15, 'scratch', .8], [.4, 'ding', .6]] }, at(121, 'encore'));
