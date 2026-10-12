// ============================================================
//  « Il a avalé un milliard de bactéries » (Barry Marshall) — 9:16, style FLOW v2
//  Retours intégrés : membres collés (toon), cadrage plus large (toute la scène, persos de bonne taille),
//  vraies articulations, expressions exagérées, décors en VRAIE perspective (room3/box3, focale courte),
//  intérieur du corps en 3D (gut3d.js). Temps globaux = mots de words.js.
// ============================================================
const TOTAL = 98.4;
const SCENES = [];
function S(s, o) { o.s = s; o.cam = o.cam || (() => ({ z: 1 })); if (!o.tin && o.enter === undefined) o.enter = 'none'; SCENES.push(o); return o; }
const RED = '#e8724a', BLUE = '#4a78c9', YEL = '#f2b632', GREEN = '#5fb15a', PINK = '#f29ab8', PURP = '#a98be8', TEAL = '#3fa7a0';
const BARRY = { body: '#f4f4f2', coat: true, tie: '#3f7df0', hair: 'side', hairColor: '#4a2f1c', shoes: '#6a5040', seed: 1 };
const ROBIN = { body: '#f4f4f2', coat: true, tie: '#b0522d', hair: 'bald', hairColor: '#e8e6e0', glasses: true, must: '#dcdad4', shoes: '#6a5040', seed: 2 };
const WIFE = { body: '#e86a8a', hair: 'bob', hairColor: '#7a4a2a', shoes: '#a33a4a', seed: 5 };
const OLDDOC = (o) => Object.assign({ body: '#f4f4f2', coat: true, tie: '#777', hair: 'bald', hairColor: '#cfcfcf', glasses: true, must: '#cfcfcf', shoes: '#444' }, o);
const CAM0 = { x: 0, y: 1.25, z: 0, pitch: 2, yaw: 0, f: 900 };
const ck = (t, keys, e) => c3k(t, keys.map(([tt, o]) => [tt, Object.assign({}, CAM0, o)]), e);

// ---------- décors en perspective ----------
function labSet(c, t, o = {}) {
  let s = room3(c, { w: 7.5, d: 6.5, h: 3.2, wall: '#dcebe3', f1: '#e6dfcc', f2: '#cec3a8', tile: .75 });
  s += onBack(c, 6.5, -3.2, -.8, 1.15, 2.7, '#bfe6ff') + onBack(c, 6.5, -2.05, -1.95, 1.15, 2.7, '#e8e8e8', 0);
  s += sprite3(c, 1.3, 1.85, 6.49, rect(-150, -170, 300, 340, '#fffdf7', 10, 6) + happyStomach(0, -40, .8, 'sad', .3, t) + [[-50, -30], [40, 20], [0, 60]].map(([x, y]) => circ(x, y - 40, 12, '#c0202f', 4)).join('') + text(0, 140, 'none', 'ULCÈRE ?', '#c0202f', 44), 330);
  s += box3(c, -3.75, 3.75, 2.1, 2.16, 6.1, 6.5, '#b88a5a', 4);
  for (let i = 0; i < 7; i++) s += sprite3(c, -3.2 + i * 1.05, 2.16, 6.3, rect(-28, -90, 56, 90, ['#bfe6ff', '#c8f0b0', '#ffd6a8'][i % 3], 10, 5) + rect(-32, -104, 64, 18, '#888', 5, 4), 330);
  if (o.bench !== false) s += box3(c, -3.75, -1.7, 0, .95, 3.2, 6.4, '#c49a6a') + box3(c, 1.9, 3.75, 0, .95, 3.4, 6.4, '#c49a6a');
  return s;
}
function bathSet(c, t, o = {}) {
  let s = room3(c, { w: 5, d: 4.5, h: 3, wall: '#d6ecf3', f1: '#eef3f6', f2: '#cfe0e8', tile: .5, joint: 'rgba(80,110,130,.3)' });
  const day = o.day ?? 1;
  s += onBack(c, 4.5, .6, 2.1, 1.4, 2.6, lerpColor('#2a3070', '#ffd9a0', day)) + (day > .1 ? sprite3(c, 1.35, 1.4 + day * .7, 4.48, sunFace(0, 0, .35, t, 'happy'), 330) : '');
  s += onBack(c, 4.5, -2.2, -1.2, 1.3, 2.3, '#cfe9f5') ;
  return s;
}
function homeSet(c, t) {
  let s = room3(c, { w: 7, d: 6, h: 3, wall: '#f6e3c8', f1: '#c9965f', f2: '#b88550', tile: .9, joint: 'rgba(80,50,20,.3)' });
  for (let i = 0; i < 8; i++) s += sprite3(c, -3 + i * .9, 2.4, 5.99, circ(0, 0, 18, '#e9c99a', 0), 330);
  s += onBack(c, 6, -1, 1, 1.2, 2.4, '#bfe6ff') + box3(c, 2.4, 3.4, 0, 2.1, 4.8, 5.8, '#e8eef2') + box3(c, -3.5, -2.2, 0, .9, 4, 6, '#d9b07a');
  return s;
}
function corridorSet(c, t, o = {}) {
  let s = room3(c, { w: o.w || 3.2, d: o.d || 22, h: 3, wall: o.wall || '#e4ece6', f1: '#d6dbe0', f2: '#c3cad2', tile: .8 });
  for (let z = 2; z < (o.d || 22) - 1; z += 3.4) { s += onSide(c, -(o.w || 3.2) / 2, z, z + 1.3, 0, 2.2, '#c49a6a') + onSide(c, (o.w || 3.2) / 2, z + 1.7, z + 2.9, 1.1, 2.3, '#bfe6ff'); s += poly3(c, [[-.5, 2.99, z], [.5, 2.99, z], [.5, 2.99, z + .8], [-.5, 2.99, z + .8]], '#fffbe0', 0); }
  return s;
}
function outback(c, t) {
  let s = grad('#6ec3ff', '#ffe7b0', 0, 0, W, H);
  s += poly3(c, [[-60, 0, 1], [60, 0, 1], [60, 0, 120], [-60, 0, 120]], '#e9c07a') + poly3(c, [[-1.6, .01, 1], [1.6, .01, 1], [1.6, .01, 120], [-1.6, .01, 120]], '#8a8f99');
  for (let z = 2; z < 60; z += 4) s += poly3(c, [[-.08, .02, z], [.08, .02, z], [.08, .02, z + 2], [-.08, .02, z + 2]], '#fff');
  return s;
}
function stageSet(c, t, o = {}) {
  let s = room3(c, { w: 12, d: 9, h: 6, wall: o.wall || '#3a1e3e', f1: '#5a2a3a', f2: '#4a2232', tile: 1.2, joint: 'rgba(0,0,0,.2)' });
  for (let i = 0; i < 9; i++) s += onBack(c, 8.99, -6 + i * 1.34, -5.3 + i * 1.34, 0, 6, '#b3263a', 4);
  return s;
}

// =========================================================== 1. LABO : il boit le bocal d'asticots (0 → 3.86)
S(0, {
  sfx: [[.1, 'tiny_scream', .8], [.62, 'gulp', 1], [.95, 'gulp', 1], [1.0, 'tiny_scream', .7], [1.3, 'gulp', 1], [1.65, 'gulp', 1], [1.9, 'tiny_scream', .6], [2.05, 'gulp', 1], [2.46, 'gag', .8], [3.06, 'whoosh', .6], [3.4, 'burp', 1], [3.45, 'flash_hit', .3]],
  cam: (t) => ({ z: 1, shake: t > 3.4 && t < 3.86 ? 8 : 0 }),
  draw(t) {
    const c = ck(t, [[0, { y: 1.0, z: .45, pitch: -6, f: 820 }], [2.4, { y: 1.05, z: .6, pitch: -4, f: 860 }], [3.4, { y: 1.1, z: .7, pitch: -2, f: 900 }], [3.86, { y: 1.15, z: .95, pitch: 0, f: 950 }]]);
    const drink = seg(t, .55, 2.4), lvl = .82 * (1 - drink);
    const ex = exprAt(t, [[0, 'determined'], [.55, 'gulp'], [2.46, 'gagX'], [3.06, 'sick'], [3.4, 'burp'], [3.75, 'joyX']]);
    const gul = (t > .55 && t < 2.4) ? ((t - .55) % .35) / .35 : -1;
    let o = Object.assign({}, BARRY, { expr: ex, face: 0, sick: t > 2.46 && t < 3.4 ? .7 : 0, shiver: t > 2.46 && t < 3.06 ? 7 : 0 });
    if (t < .55) Object.assign(o, { arms: [[100, 94], [-30, -80]], holdR: G(tr(0, 0, 1, 10 + Math.sin(t * 30) * 8), slimeJar(0, 60, .55, t, { level: .82, cry: true, stink: true })) });
    else if (t < 2.46) Object.assign(o, { tilt: -18, hsq: -.04, arms: [[100, 94], [-70, -120]], over: G(tr(118, -560, .62, -143), slimeJar(0, 0, 1, t, { level: lvl, cry: true })) + (gul >= 0 ? ell(0, lerp(-330, -180, gul), 34, 26, 'rgba(0,0,0,.18)', 0) : '') + path(`M40 -350Q70 -400 100 -440`, 'none', 26 * (1 - drink * .3), '#86b03a') });
    else if (t < 3.06) Object.assign(o, { arms: [[100, 94], [70, 90]], holdR: slimeJar(0, 60, .45, t, { level: 0, maggots: 0 }) });
    else if (t < 3.4) Object.assign(o, { arms: [[100, 94], [lerp(-170, -200, seg(t, 3.06, 3.35)), lerp(-200, -340, seg(t, 3.06, 3.35))]] });
    else Object.assign(o, { hsq: .12 * Math.sin(seg(t, 3.4, 3.7) * Math.PI), sq: 1 + .1 * Math.sin(seg(t, 3.4, 3.7) * Math.PI), arms: [[160, 200], [20, -20]] });
    let s = labSet(c, t) + toon3(c, 0, 2.3, o, t);
    if (t > 3.4) { const k = seg(t, 3.4, 3.86); const [bx, by] = P3(c, .05, 1.35, 2.3); s += op(1 - k, circ(bx, by, 60 + k * 700, 'none', 18 * (1 - k), '#b8e06a')) + stinkCloud(bx + 40, by - 40 - k * 200, 1 + k, t, k) + fly(bx + 260, by - 300 + k * 600, 1.5, t, 1); }
    return s;
  },
});

// =========================================================== 2. SALLE DE BAIN : il vomit tous les matins (3.86 → 6.04)
S(3.86, {
  tin: { type: 'dissolve', d: .3 },
  sfx: [[.1, 'ring', .5], [.4, 'vomit', .9], [1.0, 'ring', .4], [1.08, 'vomit', .9], [1.6, 'ring', .4], [1.7, 'vomit', .9]],
  draw(t, d, T) {
    const c = ck(t, [[0, { x: .3, y: 1.55, z: 1.25, pitch: 14, yaw: -6, f: 820 }], [2.2, { x: .2, y: 1.5, z: 1.4, pitch: 13, yaw: -4, f: 860 }]]);
    const day = Math.floor(t / .62), ph = (t % .62) / .62;
    let s = bathSet(c, t, { day: ph });
    s += sprite3(c, -1.7, 1.8, 4.48, calendar(0, 0, .8, String(2 + day), ['LUN', 'MAR', 'MER', 'JEU'][day % 4], -3), 330);
    s += sprite3(c, 1.0, 0, 3.3, toilet(0, 0, 1), 330);
    const v = clamp((ph - .3) / .5);
    const o = Object.assign({}, BARRY, { face: 1, expr: v > 0 && v < 1 ? 'gagX' : 'exhausted', sick: 1, legs: [[90, 180], [95, 185]], lean: 38 + 6 * Math.sin(ph * 6.28), arms: [[40, 70], [20, 50]], bob: 0 });
    s += sprite3(c, -.4, 0, 3.0, G(tr(0, 76, 1), toon(o, t)), 330);
    const [mx, my] = P3(c, -.05, .95, 3.0), [tx, ty] = P3(c, .9, .55, 3.3);
    s += vomitArc(mx, my, tx, ty, v);
    return s;
  },
});

// =========================================================== 3. « une excellente nouvelle » (6.04 → 8.2)
S(6.04, {
  sfx: [[.1, 'boing', .7], [.65, 'tada', .7], [.7, 'sparkle', .6], [1.48, 'ding_ding', .6]],
  draw(t) {
    const c = ck(t, [[0, { x: .1, y: 1.3, z: .6, pitch: 0, f: 900 }], [.4, { x: 0, y: 1.3, z: 1.2, pitch: -2, f: 950 }], [2.16, { x: 0, y: 1.3, z: 1.3, pitch: -2, f: 980 }]], eOutCubic);
    const up = eOutBack(seg(t, 0, .4));
    let s = bathSet(c, t, { day: 1 });
    const [sx, sy] = P3(c, 0, 1.5, 3.2);
    s += op(seg(t, .55, .9), G('', sunburst(sx, sy, 22, 'rgba(255,240,180,0)', 'rgba(255,220,120,.35)', t * 20)));
    s += sprite3(c, 1.0, 0, 3.6, toilet(0, 0, 1), 330);
    s += toon3(c, 0, 2.7, Object.assign({}, BARRY, { expr: t < .55 ? 'exhausted' : 'joyX', sick: t < .55 ? .8 : 0, sq: 1 + .08 * Math.sin(t * 9) * (t > .55 ? 1 : 0), bobY: -40 * up + (t > .55 ? -Math.abs(Math.sin(t * 8)) * 30 : 0), arms: t > .55 ? [[-130, -100], [-50, -80]] : [[100, 94], [80, 86]], handL: t > .55 ? 'thumb' : '', handR: t > .55 ? 'thumb' : '' }), t);
    if (t > .65) for (let i = 0; i < 6; i++) { const a = i * 1.05 + t * 2; s += sparkle(sx + Math.cos(a) * 330, sy - 250 + Math.sin(a) * 160, .7 + .3 * Math.sin(t * 8 + i)); }
    return s;
  },
});

// =========================================================== 4. AUSTRALIE, 1984 (8.2 → 9.7)
S(8.2, {
  enter: 'whip',
  sfx: [[0, 'whoosh', .8], [.1, 'chirp', .5], [.3, 'boing', .6], [.7, 'boing', .6], [1.1, 'boing', .6], [.42, 'drum', .6]],
  draw(t) {
    const c = ck(t, [[0, { x: -.5, y: .7, z: -1.5, pitch: -5, yaw: 6, f: 700 }], [1.5, { x: .3, y: .8, z: -.6, pitch: -4, yaw: -4, f: 760 }]]);
    let s = outback(c, t);
    s += sprite3(c, 6, 0, 30, eucalyptus(0, 0, 1), 60) + sprite3(c, -7, 0, 22, eucalyptus(0, 0, 1), 60) + sprite3(c, 4, 0, 14, eucalyptus(0, 0, .9), 80);
    s += sprite3(c, -2.2, 0, 6.2, billboard(0, 0, 1, 'AUSTRALIE', '1984'), 110);
    s += sprite3(c, 3.4, 0, 18, rect(-300, -520, 600, 520, '#f4efe4', 8, 8) + rect(-300, -560, 600, 60, '#c0202f', 8, 6) + text(0, -515, 'none', 'HÔPITAL', '#fff', 48) + [0, 1, 2, 3].map(i => [0, 1].map(j => rect(-250 + i * 130, -440 + j * 170, 90, 110, '#bfe6ff', 6, 5)).join('')).join(''), 60);
    s += sprite3(c, lerp(-2.6, 2.6, t / 1.5), 0, 2.4, kangaroo(0, 0, 1, t + .3, 1), 330);
    s += sprite3(c, -1.2, 0, 1.6, fgGrass(0, 0, 1.2, t, '#c9a24a'), 330);
    return s;
  },
});

// =========================================================== 5. Barry Marshall, 32 ans (9.7 → 11.4)
S(9.7, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[0, 'steps', .5], [.3, 'whoosh_up', .5], [.4, 'pop', .7], [1.1, 'pop_hi', .8], [1.12, 'sparkle', .5]],
  draw(t) {
    const c = ck(t, [[0, { y: 1.2, z: .3, f: 820 }], [1.7, { y: 1.2, z: .5, f: 900 }]]);
    const zz = lerp(5, 2.2, eOutCubic(seg(t, 0, .9)));
    let s = corridorSet(c, t, { d: 14 });
    const walk = t < .9;
    s += toon3(c, 0, zz, Object.assign({}, BARRY, { expr: t < .9 ? 'dot' : 'proudX', ...(walk ? gait(t, { f: 1 }) : {}), face: 0, arms: walk ? gait(t).arms : [[150, 200], [-40, -80]], handR: walk ? '' : 'thumb' }), t);
    const k = pop(t, .4, .4);
    if (k > 0) s += G(tr(540, 480, k, -4), rect(-340, -110, 680, 220, '#fff', 20, 8) + rect(-340, -110, 680, 70, '#3f7df0', 20, 0) + text(0, -60, 'none', 'Dr BARRY MARSHALL', '#fff', 46) + text(0, 70, 'none', '32 ANS', '#333', 90));
    if (t > 1.1) s += G(tr(820, 760, pop(t, 1.1, .3), 20), path('M-60 40L0 -80L60 40Z', '#ffd23f', 6) + circ(0, -86, 16, '#ff6fa5', 4));
    return s;
  },
});

// =========================================================== 6. Robin Warren + microscope (11.4 → 15.36)
const S6eyeRect = (c) => { const [x, y, z] = P3(c, -.62, 1.62, 2.9); const sc = c.f / z / 330; const w = 90 * sc; return { x: x - w / 2, y: y - w * 1.78 / 2, w, h: w * 1.78 }; };
function S6cam(t) { return ck(t, [[0, { x: .2, y: 1.3, z: .4, f: 860 }], [2.4, { x: .1, y: 1.3, z: .6, f: 880 }], [3.4, { x: -.3, y: 1.45, z: 1.1, pitch: 6, f: 950 }], [3.96, { x: -.55, y: 1.55, z: 1.9, pitch: 10, f: 1000 }]]); }
S(11.4, {
  tin: { type: 'dissolve', d: .3 },
  sfx: [[.34, 'steps', .5], [.72, 'hmm', .5], [1.2, 'ding', .5], [2.58, 'zap', .4], [3.3, 'whoosh_up', .6]],
  portal: (t) => S6eyeRect(S6cam(t)),
  draw(t, d, T) {
    const c = S6cam(t);
    let s = labSet(c, t);
    s += box3(c, -1.5, .4, 0, .95, 2.8, 3.6, '#c49a6a');
    s += sprite3(c, -.6, .95, 3.1, microscope(0, 0, 1.1, T > 15.0 ? 1 : 0), 330);
    const rx = lerp(3.5, 1.2, eOutCubic(seg(T, 11.6, 12.4)));
    s += toon3(c, rx, 2.6, Object.assign({}, ROBIN, { expr: exprAt(T, [[0, 'blase'], [12.12, 'glee'], [13.98, 'hehe']]), face: -1, ...(T < 12.4 ? gait(t, { f: -1 }) : {}), arms: T > 12.12 && T < 13 ? [[100, 94], [-60, -110 + Math.sin(t * 14) * 30]] : undefined }), t);
    s += toon3(c, -.7, 2.25, Object.assign({}, BARRY, { expr: exprAt(T, [[0, 'dot'], [12.94, 'determined'], [13.98, 'smugX'], [15.0, 'shockX']]), face: 1, arms: [[100, 94], T > 13.9 ? [-40, -90] : [70, 80]] }), t);
    if (T > 13.98 && T < 15.2) { const k = pop(T, 13.98, .35); const [px, py] = P3(c, 1.3, 1.85, 6.49); s += op(.0, '') + G(tr(px, py - 260, k), rect(-200, -60, 400, 120, '#fff', 20, 6) + text(0, 22, 'none', 'ULCÈRES', '#c0202f', 60)); }
    return s;
  },
});

// =========================================================== 7. « Des bactéries » — microscope 3D (15.36 → 16.1)
S(15.36, {
  tin: { type: 'portal', d: .5, rr: 60 },
  sfx: [[.1, 'magic', .6], [.3, 'tiny_scream', .3]],
  draw(t) {
    return img3(g3MicroFrame({ t: t + 2, zoom: 1.1 + t * .3 }, 540, 960), 0, 0, W, H) + `<defs><radialGradient id="mic" cx="540" cy="960" r="640" gradientUnits="userSpaceOnUse"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset=".86" stop-color="#000" stop-opacity=".95"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#mic)"/>`;
  },
});

// =========================================================== 8. Stress et mode de vie (16.1 → 19.5)
S(16.1, {
  tin: { type: 'glitch', d: .3 },
  sfx: [[.1, 'zap', .4], [1.3, 'ring', .6], [1.36, 'vibrate', .5], [2.1, 'siren', .3], [2.0, 'whistle', .4], [2.7, 'chomp', .9], [3.0, 'chomp', .8]],
  draw(t, d, T) {
    const c = ck(t, [[0, { x: -.5, y: 1.05, z: .6, pitch: -6, yaw: 8, f: 780 }], [3.4, { x: -.2, y: 1.1, z: 1.0, pitch: -4, yaw: 4, f: 840 }]]);
    let s = room3(c, { w: 7, d: 6, h: 3, wall: '#e8e2f0', f1: '#bdb6c9', f2: '#a9a2b8', tile: .9 });
    s += onBack(c, 6, -2.8, -.4, 1.1, 2.5, '#bfe6ff') + box3(c, -.4, 2.4, 0, .9, 3.0, 4.0, '#9a6a4a');
    const stress = T > 17.7, life = T > 18.86;
    const man = Object.assign({ body: BLUE, hair: 'bald', hairColor: '#7a6f76', tie: '#e2463a', coat: false, shoes: '#333', seed: 3 }, { expr: exprAt(T, [[0, 'tired'], [17.46, 'fear'], [18.2, 'terrorX'], [18.86, 'starving']]), face: 0, shiver: stress && !life ? 6 : 0, belly: life ? .5 : 0, arms: life ? [[60, -20], [120, 200]] : [[-130, -170], [-50, -10]] });
    if (life) man.holdL = G(tr(0, 0, 1, 0), ell(0, 0, 70, 30, '#d9902a', 6) + rect(-70, -6, 140, 16, '#5a8a2a', 6, 0) + ell(0, -20, 70, 30, '#e8a83a', 6)), man.holdR = rect(-30, -70, 60, 90, '#e2463a', 8, 5);
    s += toon3(c, .9, 2.9, man, t);
    if (stress) for (let i = 0; i < 4; i++) { const [px, py] = P3(c, -.2 + i * .6, 1.0 + Math.abs(Math.sin(t * 20 + i)) * .1, 3.2); s += G(tr(px, py, .9, Math.sin(t * 40 + i) * 15), rect(-40, -26, 80, 52, '#222', 10, 5) + text(0, 50, OL, 'DRING', '#ffd23f', 34)); }
    if (stress) for (let i = 0; i < 8; i++) { const k = (t * .6 + i / 8) % 1; s += G(tr(200 + i * 100, 300 + k * 900, .7, k * 400 + i * 40), rect(-40, -50, 80, 100, '#fff', 4, 4)); }
    s += toon3(c, -1.2, 2.1, OLDDOC({ expr: 'blaseS', face: 1, arms: [[100, 94], [-20, -10]], holdR: line(0, 0, 160, -40, 10, '#8a5a2a') }), t);
    const k = pop(T, 17.46, .3), k2 = pop(T, 18.86, .3);
    if (k > 0) s += G(tr(330, 420, k, -6), rect(-200, -60, 400, 120, '#ffd23f', 18, 7) + text(0, 24, 'none', 'STRESS', '#c0202f', 72));
    if (k2 > 0) s += G(tr(760, 560, k2, 5), rect(-240, -60, 480, 120, '#7be07b', 18, 7) + text(0, 24, 'none', 'MODE DE VIE', '#1f5a3a', 60));
    return s;
  },
});

// =========================================================== 9. L'estomac plein d'acide + la bactérie qui fond (19.5 → 23.32)
S(19.5, {
  tin: { type: 'dissolve', d: .35 }, dust: false,
  sfx: [[.1, 'whoosh_up', .6], [.2, 'sizzle', .5], [1.6, 'boing', .4], [2.6, 'tiny_scream', .6], [2.9, 'sizzle', .9], [3.2, 'pop', .6]],
  draw(t, d, T) {
    const fall = clamp((T - 21.4) / 1.8);
    const cp = [lerp(0, 1.5, seg(t, 0, 3.8)), lerp(4, 1.2, eInOut(seg(t, 0, 2))), lerp(10, 6.5, eInOut(seg(t, 0, 2.2)))];
    let s = img3(g3StomachFrame({ t, n: T > 21.0 ? 1 : 0, mode: 'sizzle', fall, bs: 1.8, acid: -6, inflam: 0, cam: { p: cp, l: [0, -3.5, -2], fov: 62 } }, 540, 960), 0, 0, W, H);
    if (T > 22.3 && T < 23.3) s += op(1 - seg(T, 22.9, 23.3), G(tr(560, 780, pop(T, 22.3, .3), -8), text(0, 0, OL, 'PSSSHHH', '#d4ff6a', 110)));
    return s;
  },
});
// =========================================================== 10. « absurde » — les vieux docteurs morts de rire (23.32 → 23.92)
S(23.32, {
  tin: { type: 'glitch', d: .2 },
  sfx: [[0, 'rimshot', .7], [.05, 'hmm', .3]],
  draw(t) {
    const c = ck(t, [[0, { y: 1.2, z: 1.3, f: 900 }], [.6, { y: 1.2, z: 1.5, f: 920 }]]);
    let s = room3(c, { w: 6, d: 5, h: 3, wall: '#e6dcc8', f1: '#a87a52', f2: '#966a46', tile: 1 }) + onBack(c, 5, -2.5, 2.5, 1.6, 2.6, '#7a5a3a');
    [-1.4, 0, 1.4].forEach((x, i) => { s += toon3(c, x, 3.2 - (i % 2) * .4, OLDDOC({ expr: 'laugh', face: 0, sq: 1 + .08 * Math.sin(t * 30 + i), lean: Math.sin(t * 20 + i) * 10, arms: [[60, 100], [120, 80]], seed: 10 + i }), t); });
    return s + G(tr(540, 420, pop(t, .05, .25)), text(0, 0, OL, 'ABSURDE !', '#fff', 110));
  },
});

// =========================================================== 11. ... ils en trouvent chez leurs patients (23.92 → 26.94)
const S11eye = (c) => S6eyeRect(c);
function S11cam(t) { return ck(t, [[0, { x: .3, y: 1.3, z: .55, f: 880 }], [1.1, { x: 0, y: 1.4, z: .9, pitch: 5, f: 920 }], [1.5, { x: -.55, y: 1.55, z: 1.9, pitch: 10, f: 1000 }]]); }
S(23.92, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[.4, 'hmm', .5], [1.1, 'gasp', .7], [1.36, 'whoosh_up', .6]],
  portal: (t) => S6eyeRect(S11cam(t)),
  draw(t, d, T) {
    const c = S11cam(t);
    let s = labSet(c, t) + box3(c, -1.5, .4, 0, .95, 2.8, 3.6, '#c49a6a') + sprite3(c, -.6, .95, 3.1, microscope(0, 0, 1.1, 1), 330);
    s += toon3(c, .6, 2.5, Object.assign({}, ROBIN, { expr: T > 25.0 ? 'shockX' : 'dot', face: -1, lean: T > 25 ? -12 : 0 }), t) + toon3(c, -.75, 2.2, Object.assign({}, BARRY, { expr: T > 25.0 ? 'shockX' : 'determined', face: 1, lean: 14, arms: [[60, 40], [40, 20]] }), t);
    return s;
  },
});
S(25.36, {
  tin: { type: 'portal', d: .45, rr: 60 },
  sfx: [[.1, 'magic', .5], [.4, 'tiny_scream', .4]],
  draw(t) { return img3(g3MicroFrame({ t: t + 5, zoom: 1.2 }, 540, 960), 0, 0, W, H) + `<defs><radialGradient id="mic2" cx="540" cy="960" r="640" gradientUnits="userSpaceOnUse"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset=".86" stop-color="#000" stop-opacity=".95"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#mic2)"/>` + G(tr(540, 1180, pop(t, .9, .3)), rect(-260, -50, 520, 100, '#fff', 20, 6) + text(0, 20, 'none', 'PATIENTS : 100 %', '#c0202f', 50)); },
});

// =========================================================== 12. Conférence : rejeté (26.94 → 30.1)
S(26.94, {
  enter: 'whip',
  sfx: [[0, 'whoosh', .8], [.4, 'crickets', .6], [1.6, 'crumple', .7], [1.9, 'thud', .5], [2.7, 'stamp', 1], [2.75, 'boom', .4]],
  draw(t, d, T) {
    const c = ck(t, [[0, { x: -.1, y: 1.4, z: .2, pitch: 3, f: 780 }], [2.6, { x: -.2, y: 1.45, z: .4, pitch: 4, f: 820 }]]);
    let s = room3(c, { w: 9, d: 9, h: 3.6, wall: '#2f3550', f1: '#5a4a6a', f2: '#4a3d5a', tile: 1, joint: 'rgba(0,0,0,.2)' });
    for (let row = 0; row < 3; row++) for (let i = 0; i < 4; i++) {
      const x = -2.6 + i * 1.7 + (row % 2) * .5, z = 4.6 + row * 1.4;
      s += toon3(c, x, z, OLDDOC({ expr: (i + row) % 3 ? 'blaseX' : 'sleep', face: 0, seed: row * 4 + i, tilt: (i + row) % 3 ? 0 : 20, arms: [[40, 150], [140, 30]] }), t);
      s += box3(c, x - .55, x + .55, 0, .55, z - .7, z - .45, '#7a2a3a', 4);
    }
    s += sprite3(c, 1.0, 1.4, 2.9, rect(-260, -180, 520, 360, '#fdfbf2', 12, 7) + text(0, -60, 'none', 'BACTÉRIES', '#3f7df0', 74) + text(0, 30, 'none', '=', '#333', 74) + text(0, 120, 'none', 'ULCÈRES ?!', '#c0202f', 74), 330);
    s += toon3(c, -.7, 2.0, Object.assign({}, BARRY, { expr: exprAt(T, [[0, 'joyX'], [28.1, 'tired'], [29.6, 'cryX']]), face: 1, arms: [[100, 94], [-30, -50]] }), t);
    if (T > 28.5) { const k = seg(T, 28.5, 28.95); const [ax, ay] = P3(c, .8, 1.2, 5.5), [bx, by] = P3(c, -.7, 1.55, 2.0); s += k < 1 ? circ(lerp(ax, bx, k), lerp(ay, by, k) - Math.sin(k * Math.PI) * 200, 30, '#fff', 5) : ''; }
    s += stampMark(540, 900, 1.2, 'REJETÉ', seg(T, 29.64, 29.9));
    return s;
  },
});

// =========================================================== 13. Tableau blanc : prouver ! (30.1 → 33.88)
S(30.1, {
  tin: { type: 'dissolve', d: .3 },
  sfx: [[.4, 'scratch', .5], [1.0, 'scratch', .5], [1.8, 'scratch', .5], [2.4, 'whoosh', .4], [3.3, 'sting', .6], [2.2, 'fire', .3]],
  draw(t, d, T) {
    const c = ck(t, [[0, { x: -.4, y: 1.4, z: .5, pitch: 2, yaw: 4, f: 820 }], [3.78, { x: 0, y: 1.45, z: 1.0, pitch: 3, yaw: -2, f: 880 }]]);
    let s = labSet(c, t, { bench: false });
    const p1 = seg(T, 30.4, 31.2), p2 = seg(T, 31.4, 32.1), p3 = seg(T, 32.3, 33.4);
    const inner = op(p1, happyStomach(-280, -40, 1, 'joyX', 0, t)) + op(p2, text(-120, 0, 'none', '+', '#333', 120) + bactIcon(20, -20, 1.2, t)) + op(p2, text(170, 0, 'none', '=', '#333', 120)) + op(p3, happyStomach(320, -40, 1, 'sick', 1, t));
    s += sprite3(c, .3, 1.9, 5.6, whiteboard(0, 0, 1, inner), 220);
    s += toon3(c, -.7, 2.5, Object.assign({}, BARRY, { expr: exprAt(T, [[0, 'determined'], [33.44, 'smugX']]), face: 1, arms: [[100, 94], [-30 + Math.sin(t * 9) * 10, -50 + Math.sin(t * 13) * 20]], holdR: rect(-8, -50, 16, 60, '#e2463a', 4, 4) }), t);
    return s;
  },
});

// =========================================================== 14. Les cochons (33.88 → 35.4)
S(33.88, {
  enter: 'whip',
  sfx: [[0, 'whoosh', .7], [.2, 'oink', .8], [.6, 'gulp', .6], [.94, 'oink', .8], [1.0, 'tada', .4], [1.2, 'error_beep', .6]],
  draw(t, d, T) {
    const c = ck(t, [[0, { y: 1.1, z: .7, pitch: 0, f: 760 }], [1.5, { y: 1.15, z: 1.0, pitch: 1, f: 820 }]]);
    let s = grad('#9fd6ff', '#e8f6ff', 0, 0, W, H) + poly3(c, [[-30, 0, 1], [30, 0, 1], [30, 0, 60], [-30, 0, 60]], '#b88a52');
    for (let i = -6; i <= 6; i++) s += box3(c, i * .9 - .05, i * .9 + .05, 0, 1.1, 5, 5.1, '#d9b07a', 3);
    s += box3(c, -6, 6, .7, .8, 5, 5.1, '#c49a6a', 3) + box3(c, -6, 6, .3, .4, 5, 5.1, '#c49a6a', 3);
    s += box3(c, -1.4, .2, 0, .4, 3.2, 3.6, '#8a6a4a') + poly3(c, [[-1.35, .41, 3.25], [.15, .41, 3.25], [.15, .41, 3.55], [-1.35, .41, 3.55]], '#9add5c');
    s += sprite3(c, -.6, 0, 2.9, pig(0, 0, .9, t, T > 34.82 ? 'joyX' : 'dot'), 330);
    s += toon3(c, .8, 2.6, Object.assign({}, BARRY, { expr: T > 34.82 ? 'blaseX' : 'dot', face: -1, arms: [[100, 94], [100, 120]] }), t);
    if (T > 34.82) s += G(tr(540, 520, pop(T, 34.82, .3)), path('M-90 -90L90 90M90 -90L-90 90', 'none', 50) + path('M-90 -90L90 90M90 -90L-90 90', 'none', 30, '#ff4d4d'));
    return s;
  },
});

// =========================================================== 15. Un autre cobaye… lui-même (35.4 → 39.34)
S(35.4, {
  tin: { type: 'dissolve', d: .3 },
  sfx: [[.1, 'boom', .4], [.4, 'drum', .6], [.9, 'squeak', .7], [1.4, 'oink', .6], [1.76, 'drum', .6], [2.0, 'flash_hit', .4], [2.2, 'gasp', .7], [3.2, 'boing', .6]],
  draw(t, d, T) {
    const c = ck(t, [[0, { x: 0, y: 1.0, z: .7, pitch: -2, f: 800 }], [3.9, { x: .35, y: 1.1, z: 1.05, pitch: 0, f: 860 }]]);
    let s = room3(c, { w: 9, d: 7, h: 3.5, wall: '#1a1d2e', f1: '#2a2e45', f2: '#232739', tile: 1, joint: 'rgba(0,0,0,.3)' });
    const xs = [-1.2, -.4, .4, 1.2];
    const spotX = val(T, [[35.6, -1.2], [36.2, -.4], [36.6, .4], [37.3, 1.2]], eOutCubic);
    const [lx, ly] = P3(c, spotX, 0, 3.4);
    s += spotlight(lx, ly, 260, 70, .55);
    s += sprite3(c, xs[0], 0, 3.4, G('', ell(0, -40, 50, 34, '#bbb', 5) + circ(40, -60, 26, '#ccc', 5) + circ(48, -64, 5, OL, 0) + path('M-50 -30q-40 10 -60 -20', 'none', 5)), 330);
    s += sprite3(c, xs[1], 0, 3.4, guineaPig(0, -60, 1, t), 330);
    s += sprite3(c, xs[2], 0, 3.4, pig(0, -110, .7, t, Math.abs(spotX - xs[2]) < .4 ? 'fear' : 'dot'), 330);
    const onMe = T > 37.16;
    s += toon3(c, xs[3], 3.4, Object.assign({}, BARRY, { expr: exprAt(T, [[0, 'dot'], [37.16, 'shockX'], [38.08, 'joyX']]), face: 0, shiver: onMe && T < 38 ? 5 : 0, arms: T > 38.4 ? [[100, 94], [-160, 160]] : [[100, 94], [80, 86]] }), t);
    for (let i = 0; i < 3; i++) if (Math.abs(spotX - xs[i]) < .3) { const [px, py] = P3(c, xs[i], .9, 3.4); s += sweat(px + 60, py - 40, 1.2); }
    if (T > 38.6) s += G(tr(540, 460, pop(T, 38.6, .3)), rect(-300, -60, 600, 120, '#ffd23f', 20, 7) + text(0, 24, 'none', 'LE COBAYE', '#333', 70));
    return s;
  },
});
