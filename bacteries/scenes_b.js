// ============================================================
//  « bactéries » — seconde moitié (39.34 → fin)
// ============================================================
// =========================================================== 16. Lui-même. Pratique. (39.34 → 40.46)
S(39.34, {
  enter: 'crash',
  sfx: [[0, 'whoosh_up', .6], [.55, 'glint', .9], [.6, 'ding', .5]],
  draw(t) {
    const c = ck(t, [[0, { y: 1.3, z: .9, f: 950 }], [1.1, { y: 1.3, z: 1.2, f: 980 }]]);
    let s = labSet(c, t);
    s += toon3(c, 0, 2.6, Object.assign({}, BARRY, { expr: t < .5 ? 'proudX' : 'smugX', face: 0, arms: [[160, 200], [-40, -80]], handR: 'thumb', sq: 1 + .05 * Math.sin(t * 10) }), t);
    const [hx, hy] = P3(c, .05, 1.45, 2.6);
    if (t > .55) s += sparkle(hx + 40, hy + 30, .9 * pop(t, .55, .3), '#fff');
    return s;
  },
});

// =========================================================== 17. Le formulaire de consentement (40.46 → 42.62)
S(40.46, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[.2, 'scratch', .7], [.6, 'scratch', .7], [1.0, 'scratch', .7], [1.66, 'stamp', 1], [1.7, 'ding', .6]],
  draw(t, d, T) {
    const c = ck(t, [[0, { y: 2.0, z: .9, pitch: 26, f: 860 }], [2.16, { y: 2.0, z: 1.1, pitch: 28, f: 900 }]]);
    let s = labSet(c, t, { bench: false });
    s += toon3(c, 0, 3.15, Object.assign({}, BARRY, { expr: 'determined', face: 0, arms: [[60 + Math.sin(t * 30) * 12, 20], [120 - Math.sin(t * 34) * 12, 160]], holdL: rect(-6, -50, 12, 60, '#3f7df0', 4, 3), holdR: rect(-6, -50, 12, 60, '#e2463a', 4, 3) }), t);
    s += box3(c, -1.3, 1.3, 0, .8, 2.0, 2.8, '#9a6a4a');
    const [fx, fy] = P3(c, 0, .81, 2.35);
    s += G(tr(fx, fy, 1, 0) + ' scale(1 .6)', formPaper(0, 0, .6, 0, seg(T, 40.6, 41.9), t));
    s += stampMark(fx, fy - 40, .9, 'APPROUVÉ', seg(T, 42.12, 42.4), '#2f9a4a');
    s += speedLines(t, fx, fy, 22, 'rgba(255,255,255,.5)');
    return s;
  },
});

// =========================================================== 18. Endoscopie de contrôle (42.62 → 44.2)
const MONE = { x: 80, y: 330, w: 300, h: 533 };
function S18cam(t) { return ck(t, [[0, { x: -.4, y: 1.5, z: .9, pitch: 12, f: 820 }], [1.0, { x: -.4, y: 1.5, z: 1.1, pitch: 12, f: 860 }]]); }
S(42.62, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[.3, 'squeak', .6], [.5, 'gag', .6], [1.0, 'ecg_beep', .4], [1.3, 'whoosh_up', .6]],
  portal: (t) => { const k = seg(t, 1.0, 1.55); return { x: MONE.x, y: MONE.y, w: MONE.w, h: MONE.h }; },
  draw(t, d, T) {
    const c = S18cam(t);
    let s = room3(c, { w: 7, d: 6, h: 3.2, wall: '#e0eef0', f1: '#d8e4e6', f2: '#c6d6da', tile: .7 });
    s += box3(c, -2.6, .4, .7, .85, 2.6, 3.4, '#f4f4f2') + box3(c, -1.3, -.9, 0, .7, 2.8, 3.2, '#9aa3ad');
    const lying = Object.assign({}, BARRY, { expr: T > 43.0 ? 'gagX' : 'fear', face: 0, rot: -90, legs: [[90, 90], [90, 90]], shadow: false });
    s += sprite3(c, .3, .85, 3.0, G(tr(0, -90, 1), toon(lying, t)), 330);
    const [mx, my] = P3(c, -1.2, 1.15, 3.0);
    s += path(`M${f1(mx)} ${f1(my)}Q${f1(mx + 120)} ${f1(my - 260)} ${f1(mx + 420)} ${f1(my - 200)}`, 'none', 18, '#2b2b33');
    s += toon3(c, .9, 3.4, Object.assign({}, ROBIN, { expr: 'hehe', face: -1, arms: [[100, 94], [-150, -170]] }), t);
    s += monitorCRT(MONE.x, MONE.y, MONE.w, MONE.h, img3(g3StomachFrame({ t, n: 0, acid: -9, inflam: 0, cam: { p: [0, 1, 8], l: [0, -3, 0], fov: 70 } }, 300, 533), MONE.x, MONE.y, MONE.w, MONE.h));
    return s;
  },
});
// =========================================================== 19. 3D : estomac propre, aucune infection (44.2 → 45.44)
S(44.2, {
  tin: { type: 'portal', d: .5, rr: 14 }, dust: false,
  sfx: [[.5, 'ding', .8], [.55, 'sparkle', .5]],
  draw(t, d, T) {
    let s = img3(g3StomachFrame({ t, n: 0, acid: -8, inflam: 0, cam: { p: [lerp(0, 1.5, t / 1.3), lerp(1, 0, t / 1.3), lerp(8, 5, t / 1.3)], l: [-3, -3, -5], fov: 66 } }, 540, 960), 0, 0, W, H);
    s += endoHud(t);
    if (T > 44.7) s += G(tr(540, 560, pop(T, 44.7, .3)), rect(-330, -70, 660, 140, 'rgba(10,40,20,.8)', 20, 6, '#7dff9a') + text(0, 28, 'none', '✓ AUCUNE INFECTION', '#7dff9a', 60));
    return s;
  },
});

// =========================================================== 20. Il avale les bactéries — chute dans l'œsophage (45.44 → 46.86)
S(45.44, {
  tin: { type: 'glitch', d: .2 }, dust: false,
  sfx: [[0, 'gulp', 1], [.1, 'whoosh', .8], [.4, 'tiny_scream', .7], [.8, 'whoosh_up', .5]],
  draw(t) { return img3(g3TubeFrame({ t, u: .05 + t * .28 }, 540, 960), 0, 0, W, H) + G(tr(540, 520, pop(t, .1, .3), -6), text(0, 0, OL, 'GLOUPS', '#b8f070', 120)); },
});

// =========================================================== 21. Au début… rien. (46.86 → 47.8)
S(46.86, {
  tin: { type: 'dissolve', d: .2 },
  sfx: [[0, 'crickets', .8], [.3, 'tick', .5], [.6, 'tick', .5]],
  draw(t) {
    const c = ck(t, [[0, { y: 1.2, z: .7, f: 820 }], [.94, { y: 1.2, z: .85, f: 840 }]]);
    let s = labSet(c, t);
    s += toon3(c, -.2, 2.6, Object.assign({}, BARRY, { expr: 'blaseX', face: 0, arms: [[40, 150], [140, 30]], tilt: -6 }), t);
    s += sprite3(c, lerp(-3, 3, t / .94), 0, 3.6, tumbleweed(0, -80, 1, t * 400), 330);
    return s;
  },
});

// =========================================================== 22. Perte d'appétit, ventre qui gonfle (47.8 → 50.84)
S(47.8, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[.4, 'hmm', .5], [1.24, 'gag', .7], [1.3, 'whoosh', .5], [2.06, 'boing', .9], [2.3, 'pop', .9], [2.4, 'pop_hi', .9], [2.5, 'pop', .9]],
  draw(t, d, T) {
    const c = ck(t, [[0, { x: .3, y: 1.45, z: .9, pitch: 10, yaw: -3, f: 820 }], [3.04, { x: 0, y: 1.4, z: 1.3, pitch: 9, f: 900 }]]);
    let s = homeSet(c, t);
    s += box3(c, -1.3, 1.3, 0, .75, 2.4, 3.0, '#d9b07a');
    const bl = eOutElastic(seg(T, 49.86, 50.6));
    s += toon3(c, 0, 3.35, Object.assign({}, BARRY, { expr: exprAt(T, [[0, 'dot'], [49.04, 'sick'], [49.86, 'shockX']]), sick: T > 49.0 ? .8 : 0, belly: bl * 1.1, face: 0, arms: T > 49.1 && T < 49.8 ? [[100, 94], [20, 10]] : [[110, 100], [70, 86]] }), t);
    const push = seg(T, 49.1, 49.5);
    const [px, py] = P3(c, lerp(0, .7, push), .76, 2.6);
    s += plate(px, py, .9);
    if (bl > .4) for (let i = 0; i < 3; i++) { const k = seg(T, 50.3 + i * .1, 50.84); const [bx, by] = P3(c, 0, 1.1 - i * .15, 3.4); s += k > 0 && k < 1 ? circ(bx + (i - 1) * 400 * k, by - 300 * k + 600 * k * k, 14, '#fff', 4) : ''; }
    return s;
  },
});

// =========================================================== 23. À l'aube, il court vomir… chaque matin (50.84 → 53.7)
S(50.84, {
  enter: 'whip',
  sfx: [[0, 'ring', .7], [.6, 'steps', .7], [.9, 'steps', .7], [1.25, 'vomit', .9], [1.6, 'clock_fast', .5], [1.9, 'vomit', .6], [2.4, 'vomit', .6]],
  draw(t, d, T) {
    const run = T > 51.42, inWC = T > 52.05;
    const bx = run ? lerp(-1.5, 1.45, seg(T, 51.42, 52.05)) : -1.5;
    const c = ck(t, [[0, { x: -.6, y: 1.3, z: .8, yaw: -8, f: 780 }], [.6, { x: -.6, y: 1.3, z: .8, yaw: -8, f: 780 }], [1.2, { x: .4, y: 1.3, z: .9, yaw: 10, f: 800 }], [2.86, { x: .5, y: 1.35, z: 1.1, yaw: 12, f: 820 }]]);
    const lapse = T > 52.38, dayk = lapse ? (Math.sin((T - 52.38) * 9) * .5 + .5) : seg(T, 50.84, 51.4);
    let s = room3(c, { w: 3.6, d: 4.2, h: 3, wall: lerpColor('#3a4070', '#efe4d0', dayk), f1: '#d6dbe0', f2: '#c3cad2', tile: .7 });
    s += onBack(c, 4.2, -.6, .9, 1.2, 2.5, lerpColor('#1a2050', '#ffd9a0', dayk)) + (dayk > .2 ? sprite3(c, .15, 1.3 + dayk, 4.19, sunFace(0, 0, .3, t), 330) : '');
    const shake = inWC ? Math.sin(t * 60) * .03 * (T % .7 < .4 ? 1 : 0) : 0;
    s += onSide(c, 1.8, 1.9 + shake, 3.0 + shake, 0, 2.2, '#d9b07a') + sprite3(c, 1.79, 1.6, 2.45, text(0, 0, 'none', 'WC', '#fff', 90), 330);
    s += sprite3(c, -1.2, 0, 3.6, G('', rect(-200, -120, 400, 120, '#9ab0d6', 20, 6) + rect(-200, -200, 120, 90, '#fff', 20, 5)), 330);
    if (!run) s += sprite3(c, -.9, .55, 3.4, G('', rect(-60, -170, 120, 170, '#e2463a', 20, 6) + circ(0, -110, 44, '#fff', 5) + line(0, -110, 0, -140, 5) + line(0, -110, 22, -110, 5) + circ(-40, -180, 20, '#ffd23f', 5) + circ(40, -180, 20, '#ffd23f', 5)), 330);
    if (!inWC) s += toon3(c, bx, 2.5, Object.assign({}, BARRY, { expr: run ? 'terrorX' : 'exhausted', sick: 1, face: run ? 1 : 0, ...(run ? gait(t, { run: 1, f: 1 }) : {}) }), t);
    if (inWC) { const [dx, dy] = P3(c, 1.75, 2.5, 2.45); s += G(tr(dx - 300 + Math.sin(t * 50) * 6, dy - 40, 1, -8), text(0, 0, OL, 'BLEUARGH', '#b8f070', 80)); }
    if (lapse) s += G(tr(300, 420, 1, -6), calendar(0, 0, .55, String(7 + Math.floor((T - 52.38) * 4)), 'AOÛT', 0));
    return s;
  },
});

// =========================================================== 24. Le détail étrange : liquide clair, sans acide (53.7 → 56.88)
S(53.7, {
  tin: { type: 'dissolve', d: .3 },
  sfx: [[.2, 'hmm', .6], [1.1, 'glint', .7], [1.6, 'magic', .5], [2.6, 'sting', .6], [2.7, 'gasp', .6]],
  draw(t, d, T) {
    const c = ck(t, [[0, { x: .2, y: 1.3, z: .3, f: 880 }], [3.1, { x: 0, y: 1.35, z: 1.1, f: 950 }]]);
    let s = labSet(c, t);
    s += toon3(c, -.2, 2.6, Object.assign({}, BARRY, { expr: exprAt(T, [[0, 'dot'], [54.02, 'blaseS'], [56.3, 'shockX']]), face: 0, arms: [[100, 94], [-40, -100]], holdR: G(tr(0, -20, 1, 10), rect(-30, -150, 60, 200, 'rgba(225,245,255,.6)', 26, 6) + rect(-22, -50, 44, 90, 'rgba(200,240,255,.9)', 20, 0) + rect(-38, -168, 76, 28, '#999', 8, 5)) }), t);
    const ph = T > 55.6 ? 1 : 0;
    s += G(tr(820, 1000, pop(T, 55.24, .3)), rect(-150, -90, 300, 180, '#2b2f3a', 18, 7) + `<text x="0" y="-20" font-family="monospace" font-weight="700" font-size="40" fill="#9fe7ff" text-anchor="middle">pH</text>` + `<text x="0" y="60" font-family="monospace" font-weight="700" font-size="84" fill="${ph ? '#7dff9a' : '#9fe7ff'}" text-anchor="middle">${ph ? '7,0' : '…'}</text>`);
    if (T > 56.3) s += G(tr(820, 820, pop(T, 56.3, .3)), text(0, 0, OL, 'SANS ACIDE ?!', '#ffd23f', 66));
    return s;
  },
});

// =========================================================== 25. 3D : les bactéries s'installent (56.88 → 61.2)
S(56.88, {
  tin: { type: 'glitch', d: .25 }, dust: false,
  sfx: [[.2, 'tiny_scream', .4], [1.0, 'magic', .4], [2.7, 'tada', .5], [3.2, 'sparkle', .5]],
  draw(t, d, T) {
    const a = t * .25;
    const n = Math.round(val(T, [[56.9, 6], [60.7, 40]], k => k));
    return img3(g3StomachFrame({ t, n, mode: 'settle', acid: -9, inflam: .25, bs: 1.4, cam: { p: [Math.cos(a) * 5, .5, Math.sin(a) * 5], l: [Math.cos(a + 2) * 10, 0, Math.sin(a + 2) * 10], fov: 64 } }, 540, 960), 0, 0, W, H);
  },
});

// =========================================================== 26. Haleine infecte. Magnifique. (61.2 → 63.44)
S(61.2, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[.1, 'stink', .9], [.5, 'gag', .6], [.7, 'thud', .7], [.9, 'flutter', .4], [1.72, 'glint', .7], [1.75, 'ding', .5]],
  draw(t, d, T) {
    const c = ck(t, [[0, { x: .1, y: 1.25, z: .6, f: 820 }], [2.24, { x: -.1, y: 1.3, z: .9, f: 880 }]]);
    let s = labSet(c, t);
    const k = seg(T, 61.28, 62.2), faint = seg(T, 61.7, 62.1);
    s += sprite3(c, 1.9, .95, 4.0, plantPot(0, 0, 1, k), 330);
    s += toon3(c, 1.2, 3.0, Object.assign({ body: TEAL, hair: 'bun', hairColor: '#6a4a3a', shoes: '#335', seed: 7 }, { expr: faint > .5 ? 'dead' : 'gagX', sick: k, face: -1, rot: faint * -85, legs: faint > .5 ? [[90, 90], [90, 90]] : undefined }), t);
    s += toon3(c, -.8, 2.6, Object.assign({}, BARRY, { expr: T > 62.92 ? 'smugX' : 'talk', face: 1, arms: T > 62.92 ? [[150, 200], [-40, -80]] : undefined, handR: T > 62.92 ? 'thumb' : '' }), t);
    const [mx, my] = P3(c, -.55, 1.25, 2.6);
    s += stinkCloud(mx + 200 * k, my - 30, 1.2, t, clamp(k * 1.5));
    s += fly(mx + 260, my - 260 + 600 * k * k, 1.6, t, k > .3 ? 1 : 0);
    return s;
  },
});

// =========================================================== 27. Il leur parle… de loin (63.44 → 67.36)
S(63.44, {
  enter: 'whip',
  sfx: [[0, 'whoosh', .7], [.8, 'hmm', .4], [1.6, 'siren', .25], [2.8, 'gag', .5]],
  draw(t, d, T) {
    const c = ck(t, [[0, { x: 0, y: 1.3, z: .3, pitch: 1, f: 720 }], [3.9, { x: 0, y: 1.3, z: .7, pitch: 1, f: 760 }]]);
    let s = corridorSet(c, t, { d: 24, w: 3.4 });
    const [bx, by] = P3(c, 0, 1.4, 21);
    s += toon3(c, 0, 21, Object.assign({}, BARRY, { expr: 'joyX', face: 0, arms: [[100, 94], [-100, -110]], holdR: megaphone(0, 0, .9, -100) }), t);
    for (let i = 0; i < 3; i++) { const k = (t * 1.2 + i / 3) % 1; s += op(1 - k, circ(bx, by - 20, 20 + 90 * k, 'none', 6, '#fff')); }
    [-.75, .75].forEach((x, i) => { s += toon3(c, x, 2.4 + i * .3, Object.assign({ body: [TEAL, PINK][i], hair: ['bun', 'bob'][i], hairColor: '#5a3a2a', shoes: '#333', seed: 20 + i }, { expr: 'blaseX', face: 0, sick: .3, over: G(tr(0, -390, 1), gasMask(0, 40, 1)), arms: [[40, 150], [140, 30]] }), t); });
    if (T > 64.6) s += G(tr(540, 520, pop(T, 64.6, .3)), rect(-260, -50, 520, 100, '#fff', 20, 6) + text(0, 20, 'none', '— 20 MÈTRES —', '#333', 50));
    return s;
  },
});

// =========================================================== 28. 3D : endoscopie n°2, forte inflammation (67.36 → 71.0)
S(67.36, {
  tin: { type: 'dissolve', d: .3 }, dust: false,
  sfx: [[.1, 'ecg_beep', .4], [1.6, 'heartbeat', .6], [2.5, 'tiny_scream', .6], [3.2, 'boing', .5]],
  draw(t, d, T) {
    const inf = val(T, [[67.4, .3], [69.6, 1]]);
    let s = img3(g3StomachFrame({ t, n: 40, mode: 'settle', acid: -9, inflam: inf, bs: 1.5, cam: { p: [lerp(1, 3, t / 3.6), lerp(1, -1, t / 3.6), lerp(6, 4, t / 3.6)], l: [10, -1, -6], fov: 64 } }, 540, 960), 0, 0, W, H);
    s += endoHud(t, 'ENDOSCOPIE N°2', '#ff8a8a');
    if (T > 69.1) s += G(tr(540, 560, pop(T, 69.1, .3)), rect(-330, -70, 660, 140, 'rgba(60,10,10,.8)', 20, 6, '#ff6b6b') + text(0, 28, 'none', 'INFLAMMATION !', '#ff8a8a', 66));
    return s;
  },
});

// =========================================================== 29. Gastrite ✓ — ulcère : pas encore (71.0 → 73.3)
S(71.0, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[.7, 'stamp', .8], [1.9, 'error_beep', .5], [2.0, 'hmm', .4]],
  draw(t, d, T) {
    const c = ck(t, [[0, { y: 1.3, z: .2, f: 860 }], [2.3, { y: 1.3, z: .6, f: 900 }]]);
    let s = labSet(c, t);
    s += toon3(c, -1.0, 2.7, Object.assign({}, BARRY, { expr: T > 72.38 ? 'blaseS' : 'smugX', sick: .3, face: 1, arms: [[100, 94], [-30, -60]] }), t);
    const board = rect(-260, -320, 520, 640, '#fffdf7', 14, 7) + rect(-80, -350, 160, 50, '#9aa3ad', 10, 5) + text(0, -230, 'none', 'DIAGNOSTIC', '#333', 54) +
      rect(-200, -120, 60, 60, '#fff', 8, 6) + `<text x="-110" y="-72" font-family="Fredoka" font-weight="700" font-size="54" fill="#333">GASTRITE</text>` + (T > 71.7 ? path('M-195 -95l20 25l40 -55', 'none', 12, '#2f9a4a') : '') +
      rect(-200, 60, 60, 60, '#fff', 8, 6) + `<text x="-110" y="108" font-family="Fredoka" font-weight="700" font-size="54" fill="#333">ULCÈRE</text>` + (T > 72.88 ? stampMark(60, 200, .55, 'PAS ENCORE', 1, '#e2463a', -8) : '');
    const [bx, by] = P3(c, .9, 1.4, 2.8);
    s += G(tr(bx, by, .95, 4), board);
    return s;
  },
});

// =========================================================== 30. Il l'a prouvé ! (73.3 → 76.46)
S(73.3, {
  enter: 'drop',
  sfx: [[0, 'boom', .5], [.5, 'fanfare', .8], [1.0, 'applause', .6], [2.4, 'tada', .5]],
  draw(t, d, T) {
    const c = ck(t, [[0, { y: .7, z: 1.4, pitch: -12, f: 760 }], [3.1, { y: .8, z: 1.8, pitch: -10, f: 820 }]]);
    let s = stageSet(c, t, { wall: '#22264a' });
    const [sx, sy] = P3(c, 0, 1.5, 4);
    s += G('', sunburst(sx, sy, 24, 'rgba(0,0,0,0)', 'rgba(255,220,120,.18)', t * 15));
    s += box3(c, -.8, .8, 0, .7, 3.5, 4.5, '#ffd23f');
    s += toon3(c, 0, 4.0, Object.assign({}, BARRY, { y: 0, expr: 'proudX', face: 0, sq: 1 + .05 * Math.sin(t * 6), arms: [[-140, -100], [-40, -80]], holdR: happyStomach(0, -60, .4, 'joyX', 0, t) }), t);
    s += confetti(t, .4, 60, 7);
    return s;
  },
  overlay: () => '',
});

// =========================================================== 31. Antibiotiques… sur ordre de sa femme (76.46 → 81.2)
S(76.46, {
  tin: { type: 'dissolve', d: .3 },
  sfx: [[.2, 'tick', .4], [.5, 'pop', .7], [1.7, 'thud', .9], [1.75, 'sting', .6], [2.4, 'thud', .7], [3.0, 'gulp', .9], [3.9, 'hmm', .5], [4.2, 'kiss', .4]],
  draw(t, d, T) {
    const low = seg(T, 78.16, 78.6);
    const c = ck(t, [[0, { x: .4, y: 1.3, z: 0, f: 840 }], [1.6, { x: .4, y: 1.3, z: .2, f: 860 }], [2.1, { x: .9, y: .45, z: 1.1, pitch: -18, yaw: -10, f: 760 }], [3.4, { x: .9, y: .5, z: 1.2, pitch: -16, yaw: -8, f: 780 }], [4.0, { x: .3, y: 1.3, z: .4, pitch: 2, f: 860 }]]);
    let s = homeSet(c, t);
    s += toon3(c, 1.3, 3.0, Object.assign({}, WIFE, { expr: exprAt(T, [[0, 'blase'], [78.16, 'rage'], [80.3, 'hehe']]), face: -1, sq: 1 + low * .06, arms: T < 78.0 ? [[40, 150], [140, 30]] : [[100, 94], [-60, -30]], holdR: T > 76.9 && T < 79.4 ? pillBottle(0, 0, .55, -20) : '' }), t);
    s += toon3(c, -.6, 2.8, Object.assign({}, BARRY, { expr: exprAt(T, [[0, 'tired'], [78.16, 'cryX'], [79.34, 'gulp'], [80.3, 'cryX']]), sick: .3, face: 1, s: .92, shiver: T > 78.16 && T < 79.3 ? 4 : 0, arms: T > 79.3 && T < 80.2 ? [[100, 94], [-130, -170]] : [[60, 150], [120, 30]], holdR: T > 79.3 && T < 80.2 ? capsule2(0, 0, .6, 40) : '' }), t);
    if (T > 78.2) s += G(tr(540, 440, pop(T, 78.2, .3), -4), rect(-260, -60, 520, 120, '#e2463a', 20, 7) + text(0, 24, 'none', 'TOUT DE SUITE.', '#fff', 60));
    return s;
  },
});

// =========================================================== 32. D'autres études… (81.2 → 84.4)
S(81.2, {
  enter: 'whip',
  sfx: [[0, 'whoosh', .7], [.4, 'printer', .5], [1.2, 'typing', .5], [2.2, 'printer', .5]],
  draw(t, d, T) {
    const c = ck(t, [[0, { y: 1.0, z: .5, pitch: -4, f: 760 }], [3.2, { y: 2.2, z: .6, pitch: 14, f: 760 }]]);
    let s = labSet(c, t, { bench: false });
    for (let i = 0; i < 5; i++) { const n = Math.floor(val(T, [[81.3 + i * .25, 0], [84.2, 18 + i * 6]], k => k)); s += sprite3(c, -2.4 + i * 1.2, 0, 4.2 + (i % 2) * .4, paperStack(0, 0, 1, n), 330); }
    s += toon3(c, -.6, 3.0, Object.assign({}, ROBIN, { expr: 'tired', face: 1, arms: [[-140, -100], [-40, -80]], holdR: rect(-60, -40, 120, 40, '#fffdf7', 4, 4) }), t);
    s += toon3(c, 1.0, 2.7, Object.assign({}, BARRY, { expr: 'exhausted', face: -1, arms: [[-120, -90], [-60, -90]] }), t);
    return s + G(tr(540, 380, pop(T, 81.7, .3)), rect(-260, -60, 520, 120, '#fff', 20, 7) + text(0, 24, 'none', 'ÉTUDES…', '#333', 66));
  },
});

// =========================================================== 33. 3D : antibiotiques + moins d'acide (84.4 → 89.52)
S(84.4, {
  tin: { type: 'glitch', d: .25 }, dust: false,
  sfx: [[1.5, 'whoosh', .6], [1.8, 'boom', .5], [2.0, 'pop', .8], [2.2, 'pop_hi', .8], [2.4, 'pop', .8], [2.7, 'tiny_scream', .6], [4.0, 'magic', .5]],
  draw(t, d, T) {
    const pills = seg(T, 85.6, 87.6), die = seg(T, 86.6, 88.4), acid = val(T, [[88.3, -6], [89.4, -11]]);
    const a = t * .15;
    let s = img3(g3StomachFrame({ t, n: 24, mode: die > 0 ? 'die' : 'swarm', die, pills, acid, inflam: val(T, [[85, .8], [89.5, .2]]), bs: 1.5, cam: { p: [Math.cos(a) * 9, 3, Math.sin(a) * 9], l: [0, -3, 0], fov: 64 } }, 540, 960), 0, 0, W, H);
    if (T > 88.38) s += G(tr(540, 520, pop(T, 88.38, .3)), rect(-280, -60, 560, 120, 'rgba(255,255,255,.9)', 20, 6) + text(0, 22, 'none', 'ACIDITÉ ↓', '#2f8a4a', 66));
    return s;
  },
});

// =========================================================== 34. Prix Nobel 2005 (89.52 → 92.92)
S(89.52, {
  tin: { type: 'dissolve', d: .35 },
  sfx: [[0, 'fanfare', .9], [.6, 'applause', .8], [1.6, 'ding_ding', .6], [2.2, 'applause', .6]],
  draw(t, d, T) {
    const c = ck(t, [[0, { y: 1.1, z: 1.0, pitch: -4, f: 780 }], [3.4, { y: 1.2, z: 1.6, pitch: -3, f: 840 }]]);
    let s = stageSet(c, t);
    s += sprite3(c, 0, 3.6, 8.9, rect(-420, -90, 840, 180, '#2a1430', 16, 7) + text(0, 30, 'none', 'PRIX NOBEL 2005', '#ffd23f', 84), 200);
    const old = { hairColor: '#cfcfcf' };
    s += toon3(c, -.8, 3.6, Object.assign({}, BARRY, old, { expr: 'proudX', face: 0, over: G(tr(0, -230, 1), medal(0, 0, .7, t)), arms: [[-140, -100], [80, 86]] }), t);
    s += toon3(c, .9, 3.8, Object.assign({}, ROBIN, { expr: 'joyX', face: 0, over: G(tr(0, -230, 1), medal(0, 0, .7, t + 1)), arms: [[100, 94], [-40, -80]] }), t);
    return s + confetti(t, 0, 70, 3);
  },
});

// =========================================================== 35. 21 ans après ce verre (92.92 → 94.3)
S(92.92, {
  tin: { type: 'dissolve', d: .3 },
  sfx: [[.2, 'tiny_scream', .4], [.8, 'glint', .5]],
  draw(t, d, T) {
    const c = ck(t, [[0, { y: 1.35, z: .6, f: 900 }], [1.38, { y: 1.35, z: 1.1, f: 950 }]]);
    let s = labSet(c, t);
    s += toon3(c, -.5, 2.6, Object.assign({}, BARRY, { hairColor: '#cfcfcf', over: G(tr(0, -230, 1), medal(0, 0, .7, t)), expr: 'hehe', face: 1, arms: [[100, 94], [-30, -60]] }), t);
    const [jx, jy] = P3(c, .7, 1.2, 2.5);
    s += slimeJar(jx, jy, .8, t, { level: .3, maggots: 3 }) + G(tr(jx, jy + 40, 1), rect(-90, -20, 180, 50, '#fff', 8, 5) + text(0, 18, 'none', '1984', '#333', 40));
    s += G(tr(540, 420, pop(T, 92.92, .3)), rect(-260, -60, 520, 120, '#fff', 20, 7) + text(0, 24, 'none', '+ 21 ANS', '#333', 70));
    return s;
  },
});

// =========================================================== 36. Et toi ? (94.3 → fin)
S(94.3, {
  tin: { type: 'dissolve', d: .3 },
  sfx: [[.2, 'tiny_scream', .8], [1.6, 'tiny_scream', .6], [2.4, 'whoosh_up', .5], [3.0, 'gulp', .6]],
  draw(t, d, T) {
    const c = ck(t, [[0, { y: 1.3, z: .2, f: 860 }], [4.1, { y: 1.35, z: 1.0, f: 920 }]]);
    let s = labSet(c, t);
    const offer = eInOut(seg(T, 95.0, 97.0));
    s += toon3(c, 0, 2.7, Object.assign({}, BARRY, { expr: exprAt(T, [[0, 'smugX'], [96.3, 'hehe'], [97.3, 'blaseS']]), face: 0, arms: [[100, 94], [lerp(80, -10, offer), lerp(86, -20, offer)]] }), t);
    const [jx, jy] = P3(c, lerp(.45, .35, offer), lerp(.95, .7, offer), lerp(2.55, 1.75, offer));
    s += slimeJar(jx, jy + 120 * (1 + offer * 1.4), .8 * (1 + offer * 1.4), t, { level: .82, cry: true, stink: true });
    return s;
  },
});
SCENES.sort((a, b) => a.s - b.s);
