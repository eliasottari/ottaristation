// ============================================================
//  B013–B058 : flashback de l'œuf, éclosion, course vers la mer
// ============================================================
// ============================================================
//  FLASHBACK — l'œuf sous le sable
// ============================================================
B(13, { enter: 'none', flash: 1,
  draw: t => bgSand(t, { sy: 160 }) + eggsPile(CX, 900, 22, .9, t, 3) + egg(CX, 640, 1.2, 0, t) + bow(CX - 30, 600, .4, -20) +
    G(tr(1520, 300, 1, 10 - t * 40), calendarPage(0, 0, 1, 0, '')) + bigText(['DEUX MOIS', 'PLUS TÔT'], t, .2, CX, 330, '#ffd23f', 120),
  sfx: [[0, 'el:time_pass', .9], [.2, 'whoosh', .7], [.5, 'el:hit_cine', .5]] });
B(14, { cam: zin(1.05, 1.15),
  draw: t => bgSand(t, { sy: -100 }) + glow(CX, 560, 420, '#fff6c8', .5 + .2 * Math.sin(t * 5)) + egg(CX, 580, 4.2, 0, t, { r: wave(t, .8, 4) }) + bow(CX - 120, 410, 1.4, -20) + heart(CX + 300, 340, .7 * pop(t, .5)),
  sfx: [[0, 'pop', .8], [.3, 'heartbeat', .7]] });
B(15, { enter: 'drop', cam: (t, d) => ({ z: lerp(1.05, 1.0, t / d) }),
  draw: t => { let s = bgSand(t, { sy: 120 }); s += crab({ x: 300 + t * 300, y: 80, s: .35, walk: 2 }, t);
    for (let i = 0; i < 6; i++) s += sandFlying(400 + i * 220, 330 + (t * 200) % 300, t, 3, i);
    return s + egg(CX, 820, 2.6, 0, t) + bow(CX - 70, 720, .9, -20) + path(`M${CX} 260L${CX} 600`, 'none', 10, 'rgba(255,255,255,.7)') + path(`M${CX - 40} 560L${CX} 620L${CX + 40} 560`, 'none', 10, 'rgba(255,255,255,.7)') + tag(CX + 420, 420, '-50 cm', t, .4, '#fff', OL, 60); },
  sfx: [[0, 'thud', .8], [.2, 'el:dig', .6], [.5, 'pop', .6]] });
B(16, { cam: zout(1.25, 1.0),
  draw: t => { let s = bgSand(t, { sy: -200 }); const r = rng(5); let n = Math.floor(seg(t, 0, 1.6) * 100);
    for (let i = 0; i < 100; i++) { const c = i % 14, rw = Math.floor(i / 14); if (i < n) s += egg(220 + c * 115 + (rw % 2) * 55, 160 + rw * 120, .9, 0, t, { r: wave(t, .6, 5, i / 9) }); }
    s += bow(220 + 7 * 115 - 30 + 0, 160 + 3 * 120 - 40, .45, -20);
    return s + tag(CX, 990, '≈ 100', t, 1.5, '#ffd23f', OL, 80); },
  sfx: [[0, 'pop', .6], [.3, 'pop_hi', .6], [.6, 'pop', .6], [.9, 'pop_hi', .6], [1.5, 'tada', .7]] });
B(17, { cam: zin(1, 1.08),
  draw: t => bgSand(t, { sy: 360 }) + path('M600 330Q960 120 1320 330', 'none', 10, 'rgba(255,255,255,.9)').replace('stroke-linecap', 'stroke-dasharray="30 24" stroke-linecap') +
    G(tr(1480, 300), Array.from({ length: 6 }, (_, i) => ell(i * 70, (i % 2) * 30, 18, 12, '#c9a26a', 0)).join('')) + egg(CX, 720, 2.2, 0, t, { r: wave(t, 1, 6) }) + bow(CX - 60, 630, .8, -20) +
    qmark(CX - 260, 560, .9 * pop(t, .2)) + tag(CX, 180, 'PARTIE.', t, .8, '#ff6b6b', '#fff', 70),
  sfx: [[.2, 'hmm', .7], [.8, 'el:record', .7], [1.1, 'el:crowd_aww', .5]] });
B(18, { cam: zin(1, 1.05),
  draw: t => { const k1 = seg(t, 0, .9), k2 = seg(t, .9, 1.75), k3 = seg(t, 1.75, 4.4);
    let s = bgBeach(t, { dusk: .55, hotels: 1, sy: 600 });
    const mx = 760 + eInOut(k3) * 900, my = 900 - eInOut(seg(k3, .6, 1)) * 300;
    s += ell(760, 940, 260, 50, SAND_D, 0);
    if (k2 > 0) s += ell(760, 930, 240 * Math.min(1, k2 * 1.2), 60, '#e9c98d', 0);
    s += mom({ x: mx, y: my, s: 1.4, expr: k3 > 0 ? 'cool' : 'calm', walk: k3 > 0 ? 1.4 : 0, flip: 0, fa: k2 > 0 && k3 <= 0 ? wave(t, 4, 40) : undefined }, t);
    if (k1 > 0 && k1 < 1) for (let i = 0; i < 3; i++) s += egg(560, 900 + ((t * 2.5 + i / 3) % 1) * 60, .5, 0, t);
    if (k2 > 0 && k2 < 1) s += sandFlying(560, 930, t, 10);
    if (k3 > .55) s += G(tr(mx, my - 80, 1), path('M0 0q20 -40 40 0', 'none', 6, '#fff'));
    return s + tag(lerp(560, 1300, eInOut(seg(t, 0, 3))), 200, ['PONDU', 'ENTERRÉ', 'BYE !'][k3 > 0 ? 2 : k2 > 0 ? 1 : 0], t, 0, '#fff', OL, 60); },
  sfx: [[0, 'pop', .6], [.3, 'pop', .6], [.6, 'pop', .6], [.9, 'el:dig', .8], [1.75, 'el:patter', .5], [3.2, 'el:splash', .7], [3.6, 'kiss', .6]] });
B(19, { cam: zin(1, 1.06),
  draw: t => bgSand(t, { sy: -100 }) + eggsPile(CX, 980, 14, .9, t, 8) + noSign(620, 420, 1.1, hugIcon(0, 0, 1.1), t, .1) + noSign(1300, 420, 1.1, bottle(0, 0, 1.1), t, .9),
  sfx: [[.1, 'error_beep', .8], [.9, 'error_beep', .8]] });
B(20, { cam: zin(1.02, 1.1),
  draw: t => bgSand(t, { sy: -100 }) + egg(560, 760, 2.4, 0, t, { r: wave(t, 1, 5) }) + bow(500, 660, .85, -20) +
    chatPhone(1250, 560, 2.2, 6, t, { typing: t > .6 && t < 2.2, seen: t > 2.3 }) + (t > 2.4 ? text(1250, 1000, OL, 'Vu ✔', '#fff', 64) : ''),
  sfx: [[.1, 'pop', .7], [.6, 'ding', .7], [2.3, 'el:record', .6], [2.6, 'crickets', .6]] });
B(21, { cam: (t, d) => ({ z: 1.02 + t * .02, cy: 700 }),
  draw: t => { let s = bgSand(t, { sy: 120 }) + eggsPile(CX, 980, 14, .9, t, 9);
    let flags = ''; for (let i = 0; i < 9; i++) flags += path(`M${300 + i * 165} ${230 + Math.sin(i / 8 * Math.PI) * 60}l40 0l-20 60Z`, ['#ff6fa5', '#ffd23f', '#5ec4f0'][i % 3], 4);
    s += path('M260 220Q960 360 1660 220', 'none', 6) + op(seg(t, .1, .4), flags) + bigText(['BIENVENUE !'], t, .2, CX, 420, '#ffd23f', 110);
    return s + (t > 1.6 ? tag(CX, 690, 'INFO ABSURDE N°1', t, 1.7, '#ff6b6b', '#fff', 64) : ''); },
  sfx: [[.2, 'el:applause', .5], [1.7, 'el:hit_cine', .6], [1.75, 'ding', .7]] });
B(22, { cam: zin(1.0, 1.08),
  draw: t => { const lv = .5 + .35 * Math.sin(t * 2.5);
    return sandTop(t, 11) + eggsPile(CX - 200, 800, 12, 1, t, 4) + thermometer(1400, 620, 1.4, lv, lerpColor('#4d9de0', '#ff5d4d', lv)) +
      G(tr(820, 260, 1), sexSym(0, 0, .8 * pop(t, .5), 0, '#4d9de0') + sexSym(260, 0, .8 * pop(t, .8), 1, '#ff6fa5')); },
  sfx: [[.2, 'tick', .7], [.5, 'pop', .8], [.8, 'pop_hi', .8], [1.4, 'magic', .7]] });
B(23, { cam: zin(1.0, 1.06),
  draw: t => bgSand(t, { sy: 280 }) + cloud(500, 120, 1.1, '#e8eef5') + cloud(1300, 150, 1.0, '#e8eef5') +
    rect(-100, 280, W + 200, 900, 'rgba(120,180,255,.25)', 0, 0) + thermometer(260, 700, 1.1, .25, '#4d9de0') +
    turtle({ x: 900, y: 920, s: 1.3, age: 'baby', expr: 'cool', seed: 2 }, t) + turtle({ x: 1350, y: 920, s: 1.1, age: 'baby', expr: 'smug', seed: 4, flip: 1 }, t) + sexSym(1150, 520, .9 * pop(t, .5), 0, '#4d9de0') + tag(CX + 150, 140, 'FRAIS → MÂLES', t, .2, '#4d9de0', '#fff', 64),
  sfx: [[.2, 'el:a_wind', .4], [.5, 'pop', .8], [1, 'whistle', .4]] });
B(24, { cam: zin(1.0, 1.06),
  draw: t => bgSand(t, { sy: 280 }) + rect(-200, -200, W + 400, 480, 'rgba(255,190,90,.45)', 0, 0) + sun(1650, 120, .5, t, 'nice') +
    rect(-100, 280, W + 200, 900, 'rgba(255,120,60,.18)', 0, 0) + thermometer(260, 700, 1.1, .9, '#ff5d4d') +
    turtle({ x: 900, y: 920, s: 1.3, age: 'baby', bow: 1, lashes: 1, expr: 'happy', seed: 2 }, t) + turtle({ x: 1350, y: 920, s: 1.1, age: 'baby', bow: 1, lashes: 1, expr: 'love', seed: 4, flip: 1 }, t) + sexSym(1150, 520, .9 * pop(t, .5), 1, '#ff6fa5') + tag(CX - 100, 140, 'CHAUD → FEMELLES', t, .2, '#ff6fa5', '#fff', 64),
  sfx: [[.1, 'sizzle', .5], [.5, 'pop_hi', .8], [1, 'sparkle', .6]] });
B(25, { cam: zout(1.15, 1.0),
  draw: t => bgSand(t, { sy: 420 }) + sun(1500, 170, .45, t, 'nice') + cloud(500, 160, 1, '#fff') + eggsPile(CX, 950, 16, .9, t, 12) + egg(CX, 700, 1.1, 0, t) + bow(CX - 30, 660, .4, -20),
  sfx: [[0, 'whoosh', .6], [.3, 'hmm', .5]] });
B(26, { cam: zin(1.0, 1.08),
  draw: t => { let s = grad('#5ec4f0', '#bfe9ff', -200, -200, W + 400, H + 400) + rect(160, 140, 1000, 640, '#eaf6ff', 30) + path('M260 600Q420 300 620 440T1060 360', 'none', 10, '#7be07b');
    s += G(tr(420, 300), cloud(0, 0, .8, '#fff', 6)) + sun(900, 330, .38, t, 'nice') + egg(700, 640, 1.2, 0, t) + bow(670, 600, .45, -20) + qmark(700, 470, .6);
    s += sun(1520, 560, .9, t, 'nice') + G(tr(1300, 560, 1, -30 + wave(t, 1, 10)), line(0, 0, -240, 0, 12) + line(0, 0, -240, 0, 6, '#8b5a3c'));
    return s + tag(660, 900, 'MÉTÉO DU SEXE', t, .3, '#ffd23f', OL, 60); },
  sfx: [[0, 'ding', .7], [.4, 'magic', .7], [1.6, 'el:chime', .5]] });
B(27, { cam: (t, d) => ({ z: lerp(1.0, 1.12, eInOut(t / d)), cy: 640 }),
  draw: t => rect(-200, -200, W + 400, H + 400, '#2b2238', 0, 0) + `<path d="M${CX - 120} -50L${CX + 120} -50L${CX + 420} 1000L${CX - 420} 1000Z" fill="rgba(255,240,180,.35)"/>` + eggsPile(CX, 1000, 12, .9, t, 14).replace(/#fbf6ea/g, '#6b6278') + egg(CX, 760, 2.2, 0, t, { r: wave(t, 1.2, 6) }) + bow(CX - 70, 660, .8, -20),
  sfx: [[0, 'drum', .8], [.2, 'el:riser', .6]] });
B(28, { flash: 1, cam: zin(1.0, 1.06),
  draw: t => rays(t, CX, CY, '#ffe1ef', '#ffc2dd') + confetti(t, 0, 60) + egg(CX, 620, 3.4, seg(t, .1, .6), t, { bow: 1 }) + sexSym(CX + 420, 420, .9 * pop(t, .4), 1, '#ff6fa5') + bigText(['FÉLICITATIONS !'], t, .9, CX, 980, '#ff6fa5', 100),
  sfx: [[0, 'tada', .9], [.1, 'el:egg_crack', .6], [.9, 'el:applause', .7]] });
B(29, { cam: (t, d) => ({ z: lerp(1, 1.12, t / d) }),
  draw: t => { let s = bgSand(t, { sy: 330, night: 1 }) + rect(-200, -200, W + 400, H + 400, 'rgba(120,0,20,.25)', 0, 0);
    s += op(.75, crab({ x: 500, y: 300, s: .5, angry: 1 }, t).replace(/#ef6a3e/g, '#2b2420')) + op(.75, eagle({ x: 1400, y: 140, s: .4 }, t).replace(/#6b4a2f|#5a3d26|#3f2a1a/g, '#2b2420'));
    return s + egg(CX, 760, 2.4, 0, t, { r: wave(t, 3, 4) }) + bow(CX - 70, 660, .85, -20) + sweat(CX + 160, 600, 1.1) + tag(CX, 980, 'NE MEURS PAS.', t, .6, '#ff4d4d', '#fff', 60); },
  sfx: [[0, 'sting', .9], [.4, 'heartbeat', .7], [1, 'el:crab', .4]] });

// ============================================================
//  ÉCLOSION & COURSE VERS LA MER
// ============================================================
B(30, { cam: zin(1.05, 1.15),
  draw: t => bgSand(t, { sy: -100, night: 1 }) + glow(CX, 560, 400, '#fff6c8', .35) + egg(CX, 600, 4.4, seg(t, .3, 2.6) * .9, t, { bow: 1, r: Math.sin(t * 30) * 3 * (t > .2 ? 1 : 0) }) + (t > .3 ? motionLines(CX + 330, 400, 3, 60, -30) : ''),
  sfx: [[.3, 'el:egg_crack', .9], [1.2, 'crack', .7], [2.0, 'el:egg_crack', .7]] });
function digger(x, y, s, t, o = {}) { return turtle(Object.assign({ age: 'baby', x, y, s, rot: -70, flail: 1, expr: 'pain', seed: x % 5 }, o), t); }
B(31, { cam: zin(1, 1.05),
  draw: t => { let s = bgSand(t, { sy: 150, night: 1 }); for (let i = 0; i < 6; i++) s += digger(380 + i * 240, 840 - t * 120 - (i % 2) * 60, .7, t) + sandFlying(380 + i * 240, 760 - t * 120, t, 4, i); return s + digger(CX, 760 - t * 140, .95, t, { bow: 1, lashes: 1 }); },
  sfx: [[0, 'el:dig', .9], [.6, 'el:dig', .5]] });
B(32, { cam: shk(1.06, 5),
  draw: t => bgSand(t, { sy: -100, night: 1 }) + sandFlying(CX - 250, 500, t, 10, 1) + sandFlying(CX + 250, 500, t, 10, 3) + torF({ x: CX, y: 1130, r: 165, expr: t < .7 ? 'angry' : 'pain', armL: 230 + wave(t, 4, 40), armR: -50 - wave(t, 4, 40) }, t) + (t > .7 ? motionLines(CX, 140, 3, 80, -90) : ''),
  sfx: [[0, 'el:dig', 1], [.1, 'hmm', .8], [.75, 'hmm', .9], [.8, 'scratch', .5]] });
B(33, { cam: zin(1, 1.08),
  draw: t => { const k = seg(t, 0, 5); const pr = k < .8 ? k * .25 : .2 + (k - .8) * 4; return bgSand(t, { sy: 140, night: 1 }) + digger(CX, lerp(900, 420, eInOut(k)), 1.0, t, { bow: 1, lashes: 1 }) + sandFlying(CX, lerp(850, 380, k), t, 6) +
    wallClock(280, 300, 90, t * 40) + meter(1300, 260, 480, 70, clamp(pr), '#ffd23f', 'SURFACE ' + Math.floor(clamp(pr) * 100) + '%') + sweat(CX + 150, lerp(700, 220, k), .9); },
  sfx: [[0, 'clock_fast', .6], [.4, 'el:dig', .7], [2.2, 'hmm', .7], [3.2, 'el:dig', .6], [4.4, 'tick', .7]] });
B(34, { flash: 1, cam: (t, d) => ({ z: 1.04, shake: t < .4 ? 6 : 0 }),
  draw: t => { const k = eOutBack(seg(t, .1, .6)); return sandTop(t, 13).replace(/#f5ddb0|#e8c68c/g, m => m === '#f5ddb0' ? '#c9b08a' : '#a99068') + ell(CX, 560, 260, 120, '#8f7854', 0) + sandFlying(CX, 560, t, 16, 5) +
    G(tr(CX, 560 - k * 40, k), torT({ x: 0, y: 0, s: 2.2 }, t)) + stars(CX, 300, t, 4, 200); },
  sfx: [[.1, 'el:sand_pop', 1], [.2, 'pop', .8], [.6, 'tada', .7]] });
B(35, { cam: (t, d) => ({ z: lerp(1.12, 1.0, eOutCubic(t / d)), cy: 400 }),
  draw: t => rays(t, CX, 380, '#ffd9a8', '#ffc58a') + bgBeach(t, { dusk: .6, hz: 380, sy: 650, sunX: CX, sunY: 330 }).replace(/<defs>.*?<\/rect>/, '') + tor({ x: 560, y: 980, s: 1.5, expr: 'wow', look: [1, -.5] }, t) + stars(560, 520, t, 5, 160),
  sfx: [[0, 'el:wave_crash', .4], [.1, 'el:chime', .9], [.8, 'sparkle', .6]] });
B(36, { cam: zin(1, 1.06),
  draw: t => bgBeach(t, { dusk: .6, sunX: 1700, sunY: 300 }) + path(`M600 880Q1100 760 ${lerp(600, 1700, seg(t, .2, 1.4))} 640`, 'none', 14, '#fff').replace('stroke-linecap', 'stroke-dasharray="30 30" stroke-linecap') + tor({ x: 420, y: 920, s: 1.3, expr: 'happy', walk: .8 }, t) + tag(1500, 280, 'OBJECTIF', t, 1.0, '#7be07b', OL, 56),
  sfx: [[.2, 'whoosh', .7], [1, 'ding', .7]] });
B(37, { cam: zout(1.25, 1.0),
  draw: t => bgBeach(t, { dusk: .6, sy: 500, sunX: 1700, sunY: 280 }) + tor({ x: 260, y: 1000, s: .45, expr: 'happy', walk: .7 }, t) +
    path('M330 920L1700 600', 'none', 8, '#fff') + path('M330 920l40 -40M330 920l55 10M1700 600l-55 -10M1700 600l-40 40', 'none', 8, '#fff') + tag(1060, 700, '≈ 30 m', t, .8, '#fff', OL, 64),
  sfx: [[0, 'whoosh_up', .7], [.8, 'pop', .8]] });
B(38, { cam: zin(1, 1.06),
  draw: t => { const k = t > 1.6; return bgBeach(t, { dusk: .6 }) + torF({ x: k ? 560 : CX, y: 1080, r: 140, expr: k ? 'worried' : 'smug', armR: k ? -20 : -110 + wave(t, 1, 6) }, t) +
    (k ? G(tr(1300, 560, pop(t, 1.7)), line(0, 0, 0, 420, 16) + rect(-260, -130, 520, 220, '#fff', 20) + text(0, -20, 'none', 'MATERNITÉ', '#ff6fa5', 66) + heart(0, 50, .6)) : tag(CX, 180, 'FACILE !', t, .3, '#7be07b', OL, 70)); },
  sfx: [[.3, 'ding', .7], [1.7, 'pop', .8], [2.6, 'el:record', .4]] });
B(39, { flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 300 }),
  draw: t => { let s = bgBeach(t, { dusk: .6, hz: 820, sy: 900, sunX: 300, sunY: 260 });
    s += G(tr(CX, 300, pop(t, .1)), line(-380, 0, -380, 600, 16) + line(380, 0, 380, 600, 16) + rect(-460, -110, 920, 220, '#ffd23f', 24) + text(0, 30, 'none', 'BUFFET À VOLONTÉ', '#e2463a', 76));
    s += eagle({ x: 1550, y: 520, s: .9, expr: 'hungry', bib: 1 }, t) + eagle({ x: 330, y: 560, s: .7, gull: 1, expr: 'happy', flip: 1, bib: 1 }, t);
    s += crab({ x: 760, y: 900, s: .9, bib: 1, fork: 1 }, t) + crab({ x: 1180, y: 910, s: .85, bib: 1, flip: 1, snapF: 8 }, t);
    return s; },
  sfx: [[0, 'kaching', .9], [.2, 'el:crab', .7], [.6, 'el:gull', .6], [1.2, 'chomp', .7]] });
B(40, { cam: zin(1, 1.06),
  draw: t => { let s = sandTop(t, 15); for (const [x, y] of [[400, 300], [1500, 280], [700, 820], [1350, 800]]) s += ell(x, y + 50, 70, 40, '#a88a5c', 0) + crab({ x, y, s: .5, walk: 1, look: Math.sin(t * 2) }, t);
    s += birdShadow(CX + Math.cos(t * 1.4) * 500, 540 + Math.sin(t * 1.4) * 200, 1.2, .25) + birdShadow(CX - Math.cos(t * 1.1) * 400, 540 - Math.sin(t * 1.1) * 260, .9, .2);
    return s + torT({ x: CX, y: 560, s: 1.1, expr: 'scared' }, t); },
  sfx: [[0, 'el:crab_scuttle', .8], [1, 'el:gull', .8], [1.6, 'el:wings', .4]] });
B(41, { cam: zin(1, 1.08),
  draw: t => { let s = bgBeach(t, { dusk: .6 }) + tor({ x: 640, y: 960, s: 1.6, expr: t < 2.2 ? 'smug' : 'embarrassed', hold: '' }, t) + G(tr(880, 790, 1.1, -12), path('M-50 10Q-40 -40 0 -46Q40 -40 50 10L30 0L18 14L0 0L-18 14L-30 0Z', '#fbf6ea'));
    s += G(tr(1300, 560, pop(t, .3), wave(t, .5, 3)), rect(-240, -320, 480, 640, '#fff', 14) + text(0, -230, 'none', 'CV', OL, 80) + rect(-170, -170, 120, 130, '#cfe9ff', 8, 5) + line(-20, -150, 180, -150, 8, '#ccc') + line(-20, -100, 150, -100, 8, '#ccc') +
      text(0, 60, 'none', 'Expérience :', '#555', 44) + (t > 2.0 ? text(0, 150, 'none', 'AUCUNE', '#e2463a', 70) : ''));
    return s + (t > 3.4 ? cricket(1700, 960, .6, t) : ''); },
  sfx: [[.3, 'pop', .8], [2.0, 'el:record', .7], [2.1, 'error_beep', .6], [3.4, 'crickets', .8]] });
B(42, { cam: shk(1.06, 4),
  draw: t => { const k = eOutCubic(seg(t, .2, .7)); return bgBeach(t, { dusk: .6 }) + tor({ x: 380, y: 960, s: .9, expr: 'shock', walk: .8 }, t) +
    sib({ x: 1000 + k * 120, y: 960 - k * 40, s: 1.1, expr: k > .5 ? 'scared' : 'happy', flail: k > .5 ? 1 : 0, rot: -k * 20 }, t) + crab({ x: 1420, y: 960, s: 1.1, snap: k > .6 ? 0 : 1, angry: 1, flip: 0 }, t) + (k > .6 ? impactStar(1180, 820, .5) : ''); },
  sfx: [[0, 'el:crab_scuttle', .6], [.5, 'el:crab', 1], [.55, 'squeak', .8]] });
B(43, { cam: zin(1, 1.05),
  draw: t => { const k = seg(t, .3, 1.6); return bgBeach(t, { dusk: .6 }) + ell(1100, 980, 160, 50, '#8f7854', 0) + G(tr(1100, 960 + k * 140, 1), sib({ x: 0, y: 0, s: 1, expr: 'scared', flail: 1 }, t) + crab({ x: 120, y: 30, s: .7, mouth: 'grin' }, t)).replace('<g transform', `<g clip-path="url(#hole)"><g transform`) .replace(/$/, '</g>') +
    `<defs><clipPath id="hole"><rect x="-200" y="-200" width="${W + 400}" height="1180"/></clipPath></defs>` + sandFlying(1100, 970, t, 12) + (k >= 1 ? G(tr(1100, 900), text(0, 0, OL, 'plop', '#fff', 60)) : '') + tor({ x: 420, y: 960, s: 1, expr: 'cry' }, t); },
  sfx: [[.3, 'el:dig', .7], [1.2, 'gulp', .8], [1.6, 'el:sand_pop', .7], [1.8, 'el:crowd_aww', .4]] });
B(44, { cam: shk(1.05, 4),
  draw: t => { const k = seg(t, .4, 1.2); return bgBeach(t, { dusk: .6, sy: 520 }) + eagle({ x: lerp(1500, 1050, k), y: lerp(-100, 520, eInCubic(k)), s: .8, gull: 1, rot: -40 * (1 - k), talons: 'open', expr: 'angry' }, t) +
    torF({ x: 620, y: 1100, r: 140, expr: 'scared', armL: 220 + wave(t, 3, 20), armR: -40 - wave(t, 3, 20) }, t) + emark(900, 400, .7 * pop(t, .5)); },
  sfx: [[0, 'el:patter', .7], [.4, 'el:dive', 1], [.7, 'el:gull', .8]] });
B(45, { cam: (t, d) => ({ z: 1.05, cy: 300 }),
  draw: t => { const k = seg(t, 0, 1.4); return bgBeach(t, { dusk: .6, hz: 900, sy: 980, sunX: 400, sunY: 250 }) + eagle({ x: lerp(1100, 1700, k), y: lerp(700, 150, k), s: 1.1, gull: 1, expr: 'happy', rot: -15, held: sib({ x: 0, y: 0, s: .7, expr: 'shock', flail: 1, rot: 10 }, t) }, t); },
  sfx: [[0, 'el:wings', .8], [.2, 'el:gull', .9], [.6, 'squeak', .6]] });
B(46, { enter: 'whip', cam: shk(1.06, 6),
  draw: t => { const x = 200 + t * 1500; return sandTop(t, 17) + sandFlying(x - 200, 620, t * 2, 10) + speedLines(t, x, 540, 24, 'rgba(255,255,255,.6)') + motionLines(x - 230, 540, 4, 140, 0) + torT({ x, y: 540, s: 1.5, rot: 90, walk: 7 }, t); },
  sfx: [[0, 'el:patter', 1], [.1, 'whoosh', .9]] });
B(47, { cam: zin(1.0, 1.15),
  draw: t => bgBeach(t, { dusk: .75 }) + rect(-200, -200, W + 400, H + 400, `rgba(20,10,40,${.35 * seg(t, 0, .6)})`, 0, 0) + tor({ x: 900, y: 940, s: 1.6, expr: 'worried', look: [-1, -1] }, t),
  sfx: [[0, 'sting', .7], [.2, 'heartbeat', .8]] });
B(48, { flash: 1, cam: zin(1.0, 1.1),
  draw: t => rays(t, CX, CY, '#3b2a4f', '#4c3763') + eagle({ x: 1100, y: 560, s: 1.6, expr: 'hungry', bib: 1, flap: .8, mouthOpen: .5 + .5 * Math.sin(t * 6) }, t) + fork(520, 640, 1.5, -20) + bigText(['LE RETOUR'], t, .4, 600, 180, '#ffd23f', 100),
  sfx: [[0, 'el:hit_cine', .9], [.2, 'el:eagle2', 1], [1.2, 'el:wings', .6]] });
B(49, { cam: zin(1, 1.05),
  draw: t => { const sx = lerp(-400, W + 400, seg(t, .2, 1.6)); return bgBeach(t, { dusk: .6 }) + birdShadow(sx, 950, 2.8, .35) + tor({ x: 940, y: 960, s: 1.1, expr: 'scared', look: [0, -1] }, t) + rect(-200, -200, W + 400, H + 400, `rgba(0,0,30,${.25 * Math.max(0, 1 - Math.abs(sx - 940) / 600)})`, 0, 0); },
  sfx: [[.2, 'el:wings', .9], [.5, 'whoosh', .8]] });
B(50, { enter: 'whip', cam: shk(1.05, 5),
  draw: t => { const turn = t > .5; return bgBeach(t, { dusk: .6, sy: 520 }) + G(tr(CX, 0, 1) + (turn ? ' scale(-1 1)' : ''), torF({ x: 0, y: 1100, r: 145, expr: 'scared', look: [turn ? 1 : -1, 0], armL: 230, armR: -60 }, t)) + motionLines(turn ? 600 : 1300, 600, 4, 120, turn ? 0 : 180); },
  sfx: [[.45, 'whoosh', 1], [.5, 'squeak', .8]] });
B(51, { cam: (t, d) => ({ z: lerp(1, 1.15, t / d), cy: 450, shake: 4 }),
  draw: t => { const k = seg(t, 0, 1); return bgBeach(t, { dusk: .6, hz: 950, sy: 1020, sunX: 300, sunY: 260 }) + speedLines(t, CX, 400, 24, 'rgba(255,255,255,.5)') + eagle({ x: CX, y: lerp(150, 480, k), s: lerp(.9, 1.7, k), rot: -55, talons: 'open', expr: 'angry' }, t); },
  sfx: [[0, 'el:dive', 1], [.4, 'el:eagle', .8]] });
B(52, { cam: (t, d) => ({ z: lerp(1.0, 1.2, eInOut(t / d)), shake: 3 }),
  draw: t => { const k = eInOut(seg(t, 0, 2)); let s = sandTop(t, 19) + birdShadow(CX, 560, lerp(3, 1.6, k), .4) + torT({ x: CX, y: 560, s: 1.4, expr: 'scared' }, t);
    for (const sd of [-1, 1]) s += G(tr(CX + sd * lerp(500, 200, k), 560, lerp(2.2, 1.4, k), sd * 20), path('M0 -80L0 40', 'none', 40) + path('M0 -80L0 40', 'none', 24, '#ffc93c') + [-40, 0, 40].map(a => G(`rotate(${a + 180})`, path('M0 -40L0 -120Q-10 -150 -30 -150', 'none', 22) + path('M0 -40L0 -110', 'none', 10, '#ffc93c'))).join(''));
    return s; },
  sfx: [[0, 'el:riser', .9], [.4, 'heartbeat', .9], [1.4, 'heartbeat', .9]] });
B(53, { flash: 1, cam: shk(1.08, 12),
  draw: t => { const k = eOutCubic(seg(t, 0, .8)); return bgBeach(t, { dusk: .6 }) + tor({ x: 900, y: 940, s: 1.3, expr: 'shock' }, t) +
    G(tr(lerp(1900, 700, k), 0), path('M0 1200L0 500C0 260 200 140 380 220C470 260 480 380 400 420C340 450 300 400 320 360C200 380 160 500 200 600L700 1200Z', '#4fc3e6') + path('M0 500C0 260 200 140 380 220C470 260 480 380 400 420', 'none', 30, '#fff')) +
    G(tr(lerp(1900, 700, k), 0), sandFlying(200, 600, t, 12).replace(new RegExp(SAND_D, 'g'), '#fff')); },
  sfx: [[0, 'el:wave_crash', 1], [.2, 'el:splash', .6]] });
B(54, { cam: zin(1, 1.06),
  draw: t => { const k = seg(t, 0, 1.2); return bgBeach(t, { dusk: .6 }) + rect(-200, 700, W + 400, 500, 'rgba(255,255,255,.35)', 0, 0) +
    G(tr(lerp(900, 300, k), 760 + wave(t, 1, 20), 1, t * 300), tor({ x: 0, y: 40, s: 1, expr: 'pain' }, t)) +
    eagle({ x: 1250, y: lerp(700, 860, seg(t, .3, .8)), s: 1.1, rot: 70 * seg(t, .3, .8), expr: 'shock', talons: 'grab' }, t) + (t > .8 ? impactStar(1150, 960, .7) + sandFlying(1150, 960, t, 10) : '') + (t > 1.1 ? qmark(1400, 500, .8) : ''); },
  sfx: [[0, 'el:splash', .8], [.8, 'thud', 1], [.85, 'el:eagle', .8], [1.2, 'rimshot', .6]] });
B(55, { cam: zout(1.15, 1.0),
  draw: t => bgBeach(t, { dusk: .75, sy: 900, sunX: CX, sunY: 280 }) + G(tr(CX, 640 + wave(t, .5, 8)), tor({ x: 0, y: 0, s: .9, expr: 'joy', swim: .5 }, t)) + bigText(['JOUR 1 : ✔'], t, .6, CX, 200, '#7be07b', 110),
  sfx: [[0, 'el:a_beach', .4], [.6, 'tada', .8]] });
B(56, { cam: zin(1.02, 1.1),
  draw: t => bgSplit(t, { wl: 600, sky1: '#ffb38a', sky2: '#ffe2c4' }) + torF({ x: 560, y: 900, r: 140, expr: 'deadpan', armL: 200, armR: -10 }, t) + G(tr(1350, 420, pop(t, .2)), rect(-280, -110, 560, 220, '#2b2b33', 26) + text(0, 40, 'none', '00:07 min', '#ff5d4d', 96)),
  sfx: [[.2, 'tick', .8], [.6, 'el:record', .6]] });
B(57, { cam: (t, d) => ({ z: lerp(1, 1.1, t / d), cy: 300 }),
  draw: t => bgUnder(t, { surface: 120 }) + G(tr(CX, 300, 1), op(.9, tor({ x: 0, y: 0, s: 1.4, expr: 'shock', swim: 1 }, t))) + glow(CX, 120, 500, '#fff', .3),
  sfx: [[0, 'el:plunge', 1], [.3, 'el:bubbles', .6]] });
B(58, { cam: zout(1.3, 1.0),
  draw: t => grad('#2a9fd0', '#0f5c8c', -200, -200, W + 400, H + 400) + Array.from({ length: 9 }, (_, i) => path(`M${(i * 260 + t * 30) % (W + 300) - 150} ${120 + (i * 137) % 860}q40 -14 80 0t80 0`, 'none', 5, 'rgba(255,255,255,.3)')).join('') + torT({ x: CX, y: CY, s: .7, swim: 1 }, t),
  sfx: [[0, 'el:bubbles', .7], [.2, 'whoosh_up', .5]] });
