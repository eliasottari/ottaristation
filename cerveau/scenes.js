// ============================================================
//  « Et si on mettait ton cerveau dans un ordinateur ? » — 9:16, style FLOW (option A)
//  Plans enchaînés sans coupe : travellings, fondus raccord, zooms DANS les écrans, glitch,
//  persos stick, passe lumière, sol en perspective, séquence 3D (mouche) en Three.js.
//  Temps = début réel des mots (words.js, faster-whisper).
// ============================================================
const TOTAL = 70.4;
const SCENES = [];
const NOCAM = () => ({ z: 1 });
const foc = (px, py, z) => ({ x: (px - W / 2) * z, y: (py - H / 2) * z, zoom: z });
function S(s, o) { o.s = s; SCENES.push(o); return o; }
const RED = '#e8724a', BLUE = '#4a78c9', TEAL = '#3fa7a0', YEL = '#f2b632', PURP = '#a98be8', GREEN = '#5fb15a', PINK = '#f29ab8';
const HAIRD = '#3b3040';
const rouge = (o, t) => stick(Object.assign({ body: RED, hair: 'beret', hairColor: HAIRD, seed: 1 }, o), t);
const mug = (k = 1) => G(tr(14, -10, 1), rect(-26, -40, 52, 56, '#fff', 8, 5) + path('M26 -26Q50 -24 46 -4Q44 8 26 6', 'none', 6) + rect(-20, -22, 40, 10, '#e2463a', 2, 0));
const thought = (x, y, s, inner) => G(tr(x, y, s), circ(-120, 170, 18, '#fff', 5) + circ(-80, 120, 28, '#fff', 5) + cloud(0, 0, 1.6, '#fff', 6) + inner);
const bulb = (x, y, s, on = 1) => G(tr(x, y, s), (on ? glow(0, -10, 120, '#fff3a0', .8) : '') + circ(0, -20, 50, on ? '#ffe45c' : '#eee', 6) + rect(-24, 26, 48, 34, '#aab', 6, 5) + (on ? path('M-80 -60l-30 -20M80 -60l30 -20M0 -100l0 -34', 'none', 7, '#ffd23f') : ''));
const exclam = (x, y, s) => G(tr(x, y, s), rect(-26, -110, 52, 130, '#ffd23f', 14, 6) + circ(0, 60, 28, '#ffd23f', 6));
const hud = (score, food, t) => rect(40, 230, 330, 70, 'rgba(10,30,70,.65)', 12, 4, '#5ad1ff') + `<text x="60" y="280" font-family="monospace" font-weight="700" font-size="46" fill="#fff">${String(score).padStart(6, '0')}</text>` + `<text x="40" y="340" font-family="Fredoka" font-weight="700" font-size="30" fill="#fff" stroke="${OL}" stroke-width="5" paint-order="stroke">NOURRITURE</text>` + bar(220, 314, 300, 36, food, '#4be06b') + heart(900, 262, .7) + text(990, 284, OL, 'x3', '#fff', 50);

// =========================================================== 1. ATELIER (0 → 5.0)
S(0, {
  cam: NOCAM, enter: 'none', rays: { ang: 25, x: -300, o: .2 },
  sfx: [[.84, 'squeak', .8], [1.3, 'pop', .7], [2.74, 'gulp', .9], [2.8, 'pop_hi', .6], [3.42, 'boing', .6], [3.75, 'thud', .9], [3.94, 'whoosh_up', .5], [4.1, 'sparkle', .5]],
  draw(t) {
    const cam = kf(t, [[0, foc(535, 1010, 1.9)], [3.3, foc(540, 1010, 2.0)], [3.95, foc(600, 1040, 2.0)], [4.9, foc(680, 1100, 2.7)]]);
    const open = val(t, [[.8, 0], [1.15, 1], [2.9, 1], [3.3, 0]], eOutBack);
    const brainIn = t < 1.3;
    const r = 100;
    const headWrap = (hd) => {
      if (open <= .01) return hd;
      const cut = -r * .32, a = -115 * open;
      return clipR(-2 * r, cut, 4 * r, 3 * r, hd) + ell(0, cut, r * .93, r * .2, '#8a2c45', 6) + (brainIn ? ell(0, cut - 4, r * .66, r * .14, BRAIN, 4, BRAIN_D) : '') +
        G(`rotate(${a} ${-r * .95} ${cut})`, clipR(-2 * r, -2 * r, 4 * r, 2 * r + cut, hd) + ell(0, cut, r * .93, r * .2, HEADW, 6));
    };
    const fall = seg(t, 3.42, 3.9);
    const ex = exprAt(t, [[0, 'blase'], [.84, 'ringN'], [1.5, 'dot'], [2.3, 'hehe'], [2.8, 'glee'], [3.42, 'dead']]);
    // bras : main droite vers le crâne puis vers le bocal
    const armR = t < .8 ? [[-60, -100], [-60, -100]] : t < 1.3 ? [[-70, -110], [-70, -110]] : t < 2.6 ? [[val(t, [[1.3, -70], [2.4, -20]]), val(t, [[1.3, -110], [2.4, -10]])], [0, 0]] : [[40, 80], [0, 0]];
    const guy = rouge({ x: 390, y: 1330, expr: ex, headWrap, arms: [[105, 95], armR[0]], lean: -fall * 0 }, t);
    const guyF = fall > 0 ? G(`rotate(${-75 * eInCubic(fall)} 390 1330) translate(0 ${f1(300 * eInCubic(fall))})`, guy) : guy;
    // cerveau en vol (main → bocal)
    let fly = '';
    if (t >= 1.3 && t < 2.74) {
      const k = seg(t, 1.3, 2.4), k2 = seg(t, 2.4, 2.74);
      const bx = lerp(390, 680, eInOut(k)), by = lerp(760, 820, k) - Math.sin(k * Math.PI) * 160 + 300 * k2 * k2;
      fly = brain(bx, by, .62, t, { float: 0 });
    }
    const inJar = t >= 2.74;
    const splash = inJar && t < 3.2 ? [0, 1, 2, 3, 4].map(i => { const k = seg(t, 2.74, 3.2), a = R(-150 + i * 30); return op(1 - k, circ(680 + Math.cos(a) * 160 * k, 950 + Math.sin(a) * 120 * k + 200 * k * k, 12, '#ffd36a', 3)); }).join('') : '';
    const glowK = val(t, [[3.9, .3], [4.6, 1.2]]);
    return depth(cam, [
      { z: 1.15, svg: workshop(), blur: 5 },
      { z: 1, svg: guyF },
      { z: 1, svg: workbench() + jar(680, 1240, .95, t, { inner: inJar ? brain(0, -130, .78, t, { spark: t > 4.5 }) : '', glow: glowK }) + splash + fly + rect(150, 1180, 90, 70, '#3f7df0', 10, 5) },
      { z: .6, svg: G(tr(-40, 1500, 1.4), mug()), blur: 9 },
    ]);
  },
});

// =========================================================== 2. RUE → STATION (5.0 → 14.75) — un seul travelling
const ST_X0 = 380, PUMP_X = 2560;
S(5.0, {
  cam: NOCAM, enter: 'whip', rays: { ang: 30, o: .18 },
  sfx: [[0, 'whoosh', .7], [0, 'steps', .6], [1.2, 'steps', .6], [2.4, 'steps', .6], [1.5, 'hmm', .4], [3.44, 'thud', .7], [4.84, 'snip', .6], [5.5, 'ding', .5], [6.1, 'spray', .7], [6.6, 'whoosh_up', .5], [7.3, 'zap', .6], [7.5, 'sparkle', .6], [8.7, 'pop', .8], [9.0, 'ding', .6]],
  draw(t) {
    const walkT = Math.min(t, 3.3);
    const gx = ST_X0 + 560 * walkT - (t > 3.3 ? 0 : 0);
    const fx = t < 3.3 ? ST_X0 + 560 * t + 90 : lerp(ST_X0 + 560 * 3.3 + 90, PUMP_X - 140, eInOut(seg(t, 3.3, 4.3)));
    const zoom = val(t, [[0, 2.0], [3.3, 2.0], [4.4, 1.85], [8.6, 1.95], [9.75, 2.05]]);
    const cam = foc(fx, val(t, [[0, 1060], [3.3, 1060], [4.4, 1090], [8.6, 1020]]), zoom);
    const walking = t < 3.3;
    const wp = walking ? walkPose(t, 1.3, 1.1) : { legs: t < 4.6 ? [[60, 120], [120, 60]] : [[70, 110], [110, 70]] };
    const crouch = val(t, [[3.2, 0], [3.5, 1], [4.6, 1], [4.9, .6]]);
    const ex = exprAt(t, [[0, 'grit'], [1.54, 'ring'], [2.5, 'gritR'], [3.44, 'effort'], [4.84, 'blaseS'], [6.1, 'grit'], [7.26, 'glee'], [8.66, 'ringO'], [9.1, 'hehe']]);
    const jarX = walking ? gx + 70 : lerp(gx + 70, PUMP_X - 170, eInOut(seg(t, 3.3, 3.5)));
    const jarY = walking ? 1200 + Math.abs(Math.sin(t * 9.4)) * 8 : lerp(1200, 1290, eInOut(seg(t, 3.3, 3.5)));
    const pumping = seg(t, 6.1, 7.2), alive = seg(t, 7.26, 8.0);
    const hose = t > 4.84 ? (() => { const k = eOutCubic(seg(t, 4.84, 5.3)); const hx = lerp(PUMP_X + 60, PUMP_X - 170, k), hy = lerp(800, 960, k); return path(`M${PUMP_X + 70} 790Q${PUMP_X + 120} 1250 ${(PUMP_X + hx) / 2} 1200T${hx} ${hy}`, 'none', 22, '#222') + path(`M${PUMP_X + 70} 790Q${PUMP_X + 120} 1250 ${(PUMP_X + hx) / 2} 1200T${hx} ${hy}`, 'none', 10, '#444') + rect(hx - 14, hy - 10, 28, 70, '#999', 6, 5); })() : '';
    // neurones qui s'échappent (6.54 → 8.4)
    let leak = '';
    if (t > 1.54 && t < 3.4) for (let i = 0; i < 8; i++) { const k = ((t - 1.54) * 1.4 + i / 8) % 1; leak += op(1 - k, sparkle(jarX - 60 + i * 18, jarY - 250 - k * 160, .35 * (1 - k), '#cfd6e0')); }
    const guy = stick({ x: walking ? gx : gx, y: 1300 + crouch * 30, body: BLUE, hair: 'bald', hairColor: '#8a7f86', must: '#3a2f2f', expr: ex, seed: 3, shoes: '#f0a0b4',
      legs: wp.legs, arms: walking ? [[50, 120], [130, 60]] : t < 4.8 ? [[80, 100], [100, 80]] : [[30, 20], [100, 70]], lean: walking ? 10 : crouch * 24, legLen: walking ? 140 : 140 - crouch * 30 }, t);
    const jarS = jarBrain(jarX, jarY, walking ? .62 : .72, t, { glow: .4 + pumping * .8 + alive * .6, spark: t > 7.26, liquid: lerpColor('#ffb23f', '#ffd36a', pumping) });
    const thinkK = pop(t, 8.66, .4);
    const think = thinkK > 0 ? G(tr(PUMP_X - 120, 700, thinkK), thought(0, 0, .8, bulb(0, 0, .9, t > 9.1))) : '';
    const station = path(`M${PUMP_X - 700} 250L${PUMP_X + 900} 250L${PUMP_X + 900} 330L${PUMP_X - 700} 330Z`, '#f4f4f2', 7) + rect(PUMP_X - 650, 330, 50, 820, '#e8e8e4', 6) + rect(PUMP_X + 820, 330, 50, 820, '#e8e8e4', 6) + rect(PUMP_X + 300, 520, 300, 120, '#e2463a', 8) + text(PUMP_X + 450, 600, 'none', 'BOUTIQUE', '#fff', 46);
    return depth(cam, [
      { z: 4, svg: grad('#8fd0ff', '#e8f6ff', -M, -M, 9000, 2400) },
      { z: 1.35, svg: houses(-600), blur: 6, haze: .2 },
      { z: 1.12, svg: bushes(-600, 1010) + fence(-600, 1000) + gasSign(1900, 640, .9), blur: 3 },
      { z: 1, svg: rect(-M, 1180, 9000, 1200, '#d9d6cf', 0, 0) + rect(-M, 1180, 9000, 26, '#c3bfb6', 0, 0) + station + airPump(PUMP_X + 30, 1290, 1, t, { psi: t > 5.5 ? (t > 6.1 ? 'PSI ' + Math.round(20 + pumping * 40) : 'PRÊT') : '----', needle: pumping }) + hose + guy + jarS + leak + think },
      { z: .55, svg: rect(1500, -400, 90, 2800, '#bfc5cd', 6, 7) + fgGrass(900, 1900, 2.2, t) + fgGrass(2300, 1900, 2.2, t) + fgGrass(3400, 1900, 2.2, t), blur: 12 },
    ]);
  },
});

// =========================================================== 3. SALON DE MAMIE (14.75 → 16.85)
S(14.75, {
  cam: NOCAM, tin: { type: 'dissolve', d: .5 }, rays: { ang: 20, o: .22, x: 100 },
  sfx: [[0, 'whoosh', .5], [.75, 'sparkle', .6], [1.0, 'magic', .5], [1.5, 'pop', .7], [1.6, 'boing', .5]],
  draw(t) {
    const cam = kf(t, [[0, foc(600, 1090, 1.85)], [2.1, foc(620, 1100, 2.0)]]);
    const n = Math.round(val(t, [[.6, 3], [1.5, 46]], k => k * k));
    const old = pop(t, 1.51, .35);
    const room = rect(-M, -M, W + 2 * M, H + 2 * M, '#f3e6c8', 0, 0) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => circ(-200 + i * 180, 140, 14, '#e8c9a0', 0) + circ(-110 + i * 180, 300, 14, '#e8c9a0', 0)).join('') +
      rect(260, 240, 560, 560, '#bfe6ff', 8) + cloud(420, 400, .8) + line(540, 240, 540, 800, 8) + line(260, 520, 820, 520, 8) +
      path('M120 200L300 200L280 900L80 900Z', '#e2564a', 7) + path('M960 200L780 200L800 900L1000 900Z', '#e2564a', 7) + rect(60, 180, 960, 40, '#a0522d', 8, 6);
    const chair = path('M80 1000Q60 640 300 640L780 640Q1000 640 980 1000Z', '#5aa88a', 8) + rect(40, 900, 1000, 260, '#4f9a7d', 40);
    const granny = stick({ x: 800, y: 1250, body: PINK, hair: 'bun', hairColor: '#d5d5dc', glasses: true, expr: exprAt(t, [[0, 'glee'], [.75, 'dot'], [1.5, 'ringO'], [1.9, 'hehe']]), lean: -22, tag: '#4caf6a', arms: [[140, 120], [150, 110]], seed: 5 }, t);
    const table = rect(-M, 1200, W + 2 * M, 60, '#b8743c', 6) + rect(-M, 1260, W + 2 * M, 900, '#a0632e', 0, 0) + G('', [0, 1, 2, 3, 4, 5, 6].map(i => path(`M${-300 + i * 260} 1700l130 -110l130 110l-130 110Z`, i % 2 ? '#d9a067' : '#c98a52', 0)).join(''));
    return depth(cam, [
      { z: 1.2, svg: room, blur: 6 },
      { z: 1.06, svg: chair, blur: 3 },
      { z: 1, svg: granny + table + rect(70, 1160, 120, 50, '#fff', 8, 5) + jarBrain(380, 1210, .9, t, { glow: .5, lid: old > 0 ? '#9b6fd6' : '#c9ccd4', lidKnob: old > 0, specs: old > .5 }) + cake(720, 1220, .95, n, t) + op(old, sparkle(250, 760, .7 * old)) },
      { z: .6, svg: G(tr(980, 1700, 1.5), rect(-60, -200, 120, 200, '#fff', 10, 6)), blur: 9 },
    ]);
  },
});

// =========================================================== 4. LES SCIENTIFIQUES (16.85 → 20.45)
S(16.85, {
  cam: NOCAM, tin: { type: 'dissolve', d: .45 }, rays: { ang: 18, o: .14 },
  sfx: [[0, 'whoosh', .4], [.9, 'hmm', .5], [1.99, 'whoosh', .8], [2.5, 'thud', .8], [2.55, 'crack', .3], [3.1, 'ding', .5]],
  draw(t) {
    const cam = kf(t, [[0, foc(545, 1040, 1.7)], [3.6, foc(560, 1040, 1.85)]]);
    const toss = seg(t, 1.99, 2.5);
    const jx = lerp(560, 930, toss), jy = lerp(1060, 1160, toss) - Math.sin(toss * Math.PI) * 420;
    const jarS = toss >= 1 ? '' : jarBrain(jx, jy, .5, t, { r: toss * 300, glow: .3 });
    const bg = rect(-M, -M, W + 2 * M, H + 2 * M, '#f1efe8', 0, 0) + rect(120, 260, 840, 700, '#fff', 8, 7) + [0, 1, 2, 3, 4, 5].map(i => rect(180, 330 + i * 100, 720, 34, i % 2 ? '#bfe6c9' : '#cfe8f7', 4, 0)).join('') + rect(-M, 1250, W + 2 * M, 900, '#e9e3d6', 0, 0) + [0, 1, 2, 3, 4, 5].map(i => line(-200 + i * 300, 1250, -500 + i * 420, 2200, 4, '#d6cfbf')).join('');
    const her = stick({ x: 320, y: 1330, body: '#f4f4f2', coat: true, tie: '#f2c94c', hair: 'bob', hairColor: '#2b2b33', glasses: true, expr: exprAt(t, [[0, 'hehe'], [.9, 'dot'], [2.3, 'glee']]), arms: [[110, 100], [30, 60]], seed: 6, shoes: '#556' }, t);
    const him = stick({ x: 770, y: 1330, body: '#f4f4f2', coat: true, tie: '#3f7df0', hair: 'bald', hairColor: '#9a9a9a', glasses: true, expr: exprAt(t, [[0, 'blase'], [.9, 'blaseS'], [1.99, 'hehe'], [2.6, 'glee']]), arms: [[t > 1.9 && t < 2.3 ? 200 : 150, t > 1.9 && t < 2.3 ? 190 : 120], [75, 95]], seed: 7, shoes: '#556' }, t);
    return depth(cam, [
      { z: 1.2, svg: bg, blur: 6 },
      { z: 1, svg: her + him + roundTable(540, 1290, 1) + laptop(470, 1100, .8) + recycleBin(930, 1330, .75) + jarS + (toss >= 1 ? op(1 - seg(t, 2.5, 2.9), impactStar(930, 1100, .6)) : '') },
      { z: .6, svg: G(tr(60, 1750, 1.6), plant(0, 0, 1)), blur: 10 },
    ]);
  },
});

// =========================================================== 5. LE VÉLO (20.45 → 22.15)
const S5 = S(20.45, {
  cam: NOCAM, tin: { type: 'dissolve', d: .45 }, rays: { ang: 30, o: .25, c: '#fff3c4' },
  sfx: [[0, 'whoosh', .4], [.2, 'chirp', .5], [.6, 'ring', .4], [1.2, 'chirp', .4]],
  draw(t) {
    const cam = foc(470 + t * 260, 1020, 1.9);
    const trees = (() => { let s = ''; for (let i = 0; i < 14; i++) s += rect(-300 + i * 340, 500, 40, 700, '#8a6a4a', 6, 0) + circ(-280 + i * 340, 420, 200, ['#9bc75a', '#86b84f', '#a8d066'][i % 3], 0); return s; })();
    const rider = rouge({ x: 520 + t * 260, y: 1250, expr: exprAt(t, [[0, 'glee'], [1.0, 'dot']]), legs: [[40 + Math.sin(t * 8) * 25, 100], [60 - Math.sin(t * 8) * 25, 110]], arms: [[20, 0], [10, -10]], lean: 18, bob: 0, shadow: false }, t);
    const pal = stick({ x: 220 + t * 260, y: 1300, body: GREEN, hair: 'curly', hairColor: '#2b2b33', expr: 'glee', ...walkPose(t, 1.8, 1.2), arms: [[-120, -100], [-60, -80]], seed: 9 }, t);
    return depth(cam, [
      { z: 3, svg: grad('#fff3c9', '#d8eec0', -M, -M, 6000, 2400) + trees, blur: 9 },
      { z: 1.4, svg: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => rect(-300 + i * 300, 1000, 30, 200, '#b98a5a', 4, 5)).join('') + rect(-M, 1060, 6000, 22, '#b98a5a', 4, 5), blur: 2 },
      { z: 1, svg: rect(-M, 1180, 6000, 900, '#79b84e', 0, 0) + rect(-M, 1200, 6000, 120, '#8a8f99', 0, 0) + pal + bikeSvg(560 + t * 260, 1210, .82, t) + rider },
      { z: .5, svg: fgGrass(300 + t * 30, 2050, 2.6, t) + fgGrass(1300 + t * 30, 2050, 2.6, t), blur: 12 },
    ]);
  },
});

// =========================================================== 6. LIÈGE : souvenirs = connexions (22.15 → 24.25)
const PINS = [[290, 560], [760, 470], [880, 900], [560, 1040], [200, 1000], [420, 760], [700, 720], [300, 1240], [820, 1200]];
const S6photo = (t) => ({ x: 410, y: 770, w: 230, h: 230 * H / W });
S(22.15, {
  cam: NOCAM, tin: { type: 'portalOut', d: .6, rr: 4 }, sfx: [[.15, 'thud', .7], [.2, 'pop', .6], [.95, 'scratch', .3], [1.0, 'whoosh', .5], [1.2, 'tick', .5], [1.4, 'tick', .5], [1.6, 'tick', .5]],
  portal: (t) => { const c = S6cam(t), r = S6photo(t); return drect(c, r.x, r.y, r.w, r.h); },
  draw(t) {
    const cam = S6cam(t), ph = S6photo(t);
    const strK = seg(t, .95, 1.9);
    let strings = '';
    const order = [0, 5, 1, 6, 2, 3, 4, 7, 3, 8, 6];
    for (let i = 0; i < order.length - 1; i++) { const k = clamp(strK * (order.length - 1) - i); if (k <= 0) break; const [a, b] = [PINS[order[i]], PINS[order[i + 1]]]; strings += line(a[0], a[1], lerp(a[0], b[0], k), lerp(a[1], b[1], k), 5, '#d62f2f'); }
    const photos = [['beach', 290, 600, -8], ['duck', 760, 520, 6], ['cake', 880, 950, -5], ['me', 560, 1090, 4], ['bike', 200, 1050, 7], ['cake', 820, 1250, -9], ['beach', 300, 1290, 5], ['duck', 700, 770, -4]];
    const pointer = t > 1.0 ? G(tr(lerp(1150, 760, eOutCubic(seg(t, 1.0, 1.6))), lerp(1700, 1200, eOutCubic(seg(t, 1.0, 1.6))), 1, -35), line(0, 0, 0, 900, 22, '#3a2a1a') + circ(0, 0, 14, '#e2463a', 4)) : '';
    // photo principale : contient le plan vélo (figé)
    const main = rect(ph.x - 22, ph.y - 22, ph.w + 44, ph.h + 110, '#fdfbf5', 6, 5) + inRect(ph, S5.draw(1.7, 1.7, 22.15), 2);
    return depth(cam, [
      { z: 1, svg: cork() + photos.map(([k, x, y, r]) => polaroid(x, y, .62, r, PH[k]())).join('') + main + strings + PINS.map(([x, y]) => pin(x, y)).join('') + pin(ph.x + ph.w / 2, ph.y - 6) + pointer },
      { z: .5, svg: bokeh(t, 6, 8, ['#fff1c8', '#ffe2a8']), blur: 14 },
    ]);
  },
});
function S6cam(t) { const z = val(t, [[0, 1.5], [2.2, 1.1]]); return foc(val(t, [[0, 525], [2.2, 540]]), val(t, [[0, 900], [2.2, 900]]), z); }

// =========================================================== 7. BUREAU : copie (24.25 → 26.15)
const MON7 = { x: 690, y: 560, w: 260, h: 462 };
S(24.25, {
  cam: NOCAM, tin: { type: 'dissolve', d: .35 }, rays: { ang: 15, o: .12 },
  sfx: [[.13, 'hammer', .6], [.2, 'printer', .5], [.5, 'zap', .4], [1.25, 'whoosh', .6], [1.4, 'typing', .4]],
  portal: (t) => drect(S7cam(t), MON7.x, MON7.y, MON7.w, MON7.h),
  draw(t) {
    const cam = S7cam(t);
    const press = t > .1 && t < .4;
    const flash = t > .13 ? op(.8 * (1 - seg(t, .13, .9)), glow(560, 980, 500, '#c8f6ff', .9)) : '';
    const guy = rouge({ x: 300, y: 1340, expr: exprAt(t, [[0, 'grit'], [.5, 'glee'], [1.2, 'hehe']]), arms: [[100, 95], press ? [-10, 30] : [-30, -10]], lean: press ? 10 : 0 }, t);
    const screen = desktop(t, stick({ x: 540, y: 1250, s: 1.4, body: PURP, hair: 'beret', hairColor: '#6b52b8', expr: 'dot' }, t));
    return depth(cam, [
      { z: 1.2, svg: officeBg(), blur: 6 },
      { z: 1, svg: rect(-M, 1240, W + 2 * M, 1000, '#9aa6bb', 0, 0) + guy + copier(560, 1330, .8, t, press || t < .9 ? 1 : 0) + rect(560, 1080, 520, 30, '#e8e8e4', 6) + monitor(MON7.x, MON7.y, MON7.w, MON7.h, scr(MON7.x, MON7.y, MON7.w, MON7.h, screen), { standH: 60 }) + flash },
      { z: .55, svg: G(tr(1050, 1750, 1.5), rect(-120, -260, 240, 260, '#e8e8e4', 10, 7)), blur: 10 },
    ]);
  },
});
function S7cam(t) { return kf(t, [[0, foc(420, 1040, 1.9)], [1.1, foc(440, 1030, 1.95)], [1.9, foc(820, 790, 1.95)]]); }

// =========================================================== 8. DANS L'ORDINATEUR (26.15 → 28.05)
S(26.15, {
  cam: NOCAM, tin: { type: 'portal', d: .7, rr: 6 },
  sfx: [[0, 'whoosh_up', .7], [.85, 'clock_fast', .5], [1.35, 'error_beep', .9], [1.45, 'glint', .4]],
  draw(t) {
    const yr = Math.round(val(t, [[.85, 2026], [1.9, 9999]], k => k * k));
    const err = pop(t, 1.35, .3);
    const guy = stick({ x: 540, y: 1560, s: 2.3, body: PURP, hair: 'beret', hairColor: '#6b52b8', expr: exprAt(t, [[0, 'dot'], [.85, 'dotO'], [1.35, 'gritR']]), arms: t < 1.35 ? [[105, 95], [-80, -150]] : [[-120, -100], [-60, -80]], seed: 2 }, t);
    return G(tr(0, 0, 1), desktop(t, guy, `01/01/${yr}`) + (err > 0 ? G(tr(540, 820, err), errBox(0, 0, 1)) : '')) + (t > 1.35 ? glitchFx('', 0, t) : '');
  },
});

// =========================================================== 9. SOL EN PERSPECTIVE : le câble (28.05 → 31.0)
function S9cam(t) { return cam3({ x: val(t, [[0, 0], [1.6, .3]]), y: 1.6, z: val(t, [[.6, -1.2], [1.9, 1.0]]), pitch: val(t, [[.6, 0], [1.9, 19]]), f: 1500 }); }
const S9scr = { z: 7.4, x0: -.6, x1: .6, y0: 1.05, y1: 3.1 };
S(28.05, {
  cam: NOCAM, tin: { type: 'portalOut', d: .7, rr: 6 }, rays: { ang: 12, o: .1 },
  sfx: [[.6, 'whoosh', .5], [1.0, 'steps', .5], [1.57, 'boing', .8], [1.65, 'gasp', .6], [1.9, 'spray', .7], [2.11, 'crack', .9], [2.12, 'zap', .7], [2.43, 'rewind', .5], [2.5, 'error_beep', .5]],
  portal: (t) => rect3(S9cam(t), S9scr.z, S9scr.x0, S9scr.x1, S9scr.y0, S9scr.y1),
  draw(t) {
    const c = S9cam(t);
    let s = rect(-50, -50, W + 100, H + 100, '#f2f2ee', 0, 0);
    s += wall3(c, 7.6, -8, 8, 0, 4.5, '#f2f2ee');
    for (let i = 0; i < 5; i++) s += wall3(c, 7.59, -7 + i * 3.1, -4.8 + i * 3.1, 1.2, 3.9, '#bfe0f7', 6);
    s += floor3(c, -7, 7, -2, 7.6, .9, '#8f9bb1', '#a2adc1');
    // bureau du fond + écran (portrait)
    s += poly3(c, [[-1.6, .95, 7.0], [1.6, .95, 7.0], [1.6, .95, 7.6], [-1.6, .95, 7.6]], '#e8e8e4', 5) + poly3(c, [[-1.6, .95, 7.0], [1.6, .95, 7.0], [1.6, 0, 7.0], [-1.6, 0, 7.0]], '#dcdcd6', 5);
    const scrR = rect3(c, S9scr.z, S9scr.x0, S9scr.x1, S9scr.y0, S9scr.y1);
    const off = seg(t, 2.43, 2.75);
    const world = desktop(t + 1.9, stick({ x: 560, y: 1310, s: 1.15, body: PURP, hair: 'beret', hairColor: '#6b52b8', expr: 'gritR' }, t), '01/01/9999') + G(tr(540, 820, 1), errBox(0, 0, 1));
    const screenIn = off <= 0 ? inRect(scrR, world, 4) : rect(scrR.x, scrR.y, scrR.w, scrR.h, '#05070c', 4, 0) + op(1 - seg(t, 2.75, 2.95), bloom(rect(scrR.x + scrR.w * .5 * (1 - (1 - off)) , scrR.y + scrR.h / 2 - 3, scrR.w * (1 - off) + 6, 6, '#fff', 3, 0) + circ(scrR.x + scrR.w / 2, scrR.y + scrR.h / 2, 6 + 6 * (1 - off), '#fff', 0), 10, 1));
    s += rect(scrR.x - 14, scrR.y - 14, scrR.w + 28, scrR.h + 28, '#262b36', 10) + screenIn;
    // câble orange du bureau à la multiprise
    const yank = seg(t, 2.11, 2.3);
    const cab = []; for (let i = 0; i <= 26; i++) { const k = i / 26, z = lerp(7.0, 4.3, k), x = lerp(0, .95, k) + Math.sin(k * 9) * .35 * (1 - k * .5) + (k > .7 ? Math.sin((k - .7) * 20) * .25 * yank : 0); cab.push(P3(c, x, .01 + (k > .75 ? yank * .25 * Math.sin((k - .75) * 12) : 0), z)); }
    s += `<path d="M${cab.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L')}" fill="none" stroke="${OL}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M${cab.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L')}" fill="none" stroke="#f08a24" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += sprite3(c, 1.15, 0, 4.25, powerStrip(0, 0, 1.0, eOutBack(yank)), 900);
    // café renversé
    const spill = seg(t, 1.85, 2.4);
    if (spill > 0) s += sprite3(c, .25, 0, 3.25, ell(0, 0, 170 * spill, 45 * spill, '#6b3e1f', 5, '#4a2a12'), 290);
    // le perso qui trébuche
    const wx = val(t, [[.9, -2.4], [1.57, -.3]], k => k), trip = seg(t, 1.57, 2.0), rec = seg(t, 2.2, 2.6);
    if (t > .9) {
      const wp = walkPose(t, 1.4, 1);
      const guy = stick({ body: YEL, hair: 'bowl', hairColor: '#e8892a', expr: exprAt(t, [[0, 'hehe'], [1.57, 'ringO'], [1.75, 'grit'], [2.43, 'gritR']]), tag: '#4caf6a', seed: 8, legs: trip > 0 && rec < 1 ? [[50, 80], [130, 100]] : wp.legs, arms: trip > 0 ? [[-140, -160], [-30, -60]] : [[100, 90], [60, 0]], lean: 34 * Math.sin(trip * Math.PI * .8) * (1 - rec) + (rec > 0 ? -8 : 0), holdR: trip <= 0 ? mug() : '' }, t);
      s += sprite3(c, wx, 0, 3.15, guy, 290);
    }
    // tasse + gouttes qui volent
    if (trip > 0 && spill < 1) { const k = seg(t, 1.57, 2.0); const [mx, my] = P3(c, lerp(.1, .6, k), 1.2 + Math.sin(k * Math.PI) * .8 - k * 1.2, 3.1); s += G(tr(mx, my, 1.4, k * 400), mug()); for (let i = 0; i < 6; i++) { const [dx, dy] = P3(c, .1 + i * .08 * k, 1.2 + Math.sin(k * Math.PI) * .5 - k * 1.2 - i * .04, 3.1); s += circ(dx, dy, 10, '#6b3e1f', 3, '#4a2a12'); } }
    if (yank > 0 && yank < 1) { const [px, py] = P3(c, 1.2, .3, 4.25); s += op(1 - yank, impactStar(px, py, .8) + sparkle(px + 40, py - 60, .6, '#fff3a0')); }
    return s;
  },
});

// =========================================================== 10. LABO NEUROCOPIE (31.0 → 38.75)
const MON10 = { x: 700, y: 520, w: 300, h: 533 };
const DOME10 = [300, 1160];
function S10cam(t) { return kf(t, [[0, foc(450, 1000, 1.7)], [1.3, foc(460, 1000, 1.8)], [2.4, foc(380, 1010, 2.0)], [2.95, foc(300, 1010, 2.6)], [4.3, foc(300, 1000, 2.75)], [4.7, foc(850, 790, 2.0)], [6.6, foc(850, 790, 2.05)], [7.2, foc(700, 900, 1.75)], [7.75, foc(800, 860, 1.85)]]); }
S(31.0, {
  cam: NOCAM, tin: { type: 'dissolve', d: .45 }, rays: { ang: 18, o: .1 },
  sfx: [[0, 'whoosh', .4], [2.4, 'whoosh', .6], [2.98, 'whoosh_up', .6], [3.36, 'scratch', .4], [3.4, 'buzz', .6], [4.68, 'whoosh', .8], [4.9, 'typing', .5], [5.36, 'ding', .6], [5.5, 'printer', .4], [6.2, 'ding', .7], [7.52, 'crack', .8], [7.55, 'zap', .7], [7.6, 'tada', .5]],
  portal: (t) => drect(S10cam(t), MON10.x, MON10.y, MON10.w, MON10.h),
  draw(t) {
    const cam = S10cam(t);
    const scan = seg(t, 3.36, 4.2), holo = t > 3.8;
    const lever = seg(t, 7.52, 7.68);
    // dôme : mouche 2D puis hologramme fil de fer
    let inner = '';
    if (!holo) inner = fly2(0, -160, .9, t);
    else inner = G(tr(-170, -380, 1), clipR(0, 0, 340, 330, img3(t3ScanFrame({ t, build: 1, solid: 0, rot: t * .9 }, 340, 600), 0, -110, 340, 604), 160));
    if (scan > 0 && scan < 1) inner += rect(-180, -390 + 340 * scan, 360, 14, '#5af0ff', 6, 0) + `<rect x="-180" y="${f1(-390 + 340 * scan - 80)}" width="360" height="80" fill="#5af0ff" opacity=".25"/>`;
    const domeS = bloom(dome(DOME10[0], DOME10[1], .92, inner), holo ? 14 : 6, holo ? .6 : .2);
    // écran
    let scrS = '';
    const m = MON10;
    if (t < 4.6) scrS = rect(m.x, m.y, m.w, m.h, '#0b1a36', 0, 0) + termText(m.x + 24, m.y + 70, ['NEUROCOPIE', 'en attente...'], 24);
    else if (t < 5.36) scrS = rect(m.x, m.y, m.w, m.h, '#0b1a36', 0, 0) + termText(m.x + 20, m.y + 60, ['drosophila_v1', 'CERVEAU COPIÉ', `${Math.round(val(t, [[4.6, 40], [5.1, 100]]))} %`], 24) + bloom(circ(m.x + m.w / 2, m.y + 330, 8, '#9fe7ff', 0), 8, 1);
    else if (t < 7.52) { const b = val(t, [[5.36, .02], [6.2, 1]], k => k); scrS = img3(t3ScanFrame({ t, build: b, solid: t > 6.4 ? 1 : 0, rot: t * .7 }, 300, 533), m.x, m.y, m.w, m.h) + rect(m.x, m.y, m.w, 120, 'rgba(8,21,48,.75)', 0, 0) + termText(m.x + 16, m.y + 44, ['drosophila_v1', t < 6.2 ? `CORPS : ${Math.round(b * 100)} %` : 'PRÊT'], 22, t < 6.2 ? '#9fe7ff' : '#7dff9a'); }
    else scrS = img3(t3WorldFrame({ t, walkZ: -(t - 7.52) * 1.5, walk: 1, cam: { dx: 2.2, dy: 1.3, dz: 3.4 } }, 300, 533), m.x, m.y, m.w, m.h) + rect(m.x, m.y, m.w, 70, 'rgba(8,21,48,.6)', 0, 0) + termText(m.x + 16, m.y + 44, ['EN MARCHE ●'], 22, '#7dff9a');
    const her = stick({ x: 540, y: 1300, body: '#f4f4f2', coat: true, tie: '#3fa7a0', hair: 'bob', hairColor: '#2b2b33', glasses: true, expr: exprAt(t, [[0, 'blase'], [1.7, 'dot'], [3.36, 'ringO'], [4.6, 'blaseS'], [5.36, 'hehe'], [7.52, 'glee']]), arms: [[150, 170], t > 6.6 ? [20, lever > 0 ? 60 : 20] : [60, 100]], seed: 6, shoes: '#556' }, t);
    const poster = rect(80, 240, 280, 520, '#fff', 14) + fly2(220, 400, .5, t) + text(220, 580, 'none', 'NEURO', '#3fa7a0', 50) + text(220, 640, 'none', 'COPIE', '#3fa7a0', 50);
    const bg = rect(-M, -M, W + 2 * M, H + 2 * M, '#f3f3ef', 0, 0) + poster + rect(1050, 160, 500, 600, '#cdeec8', 8) + rect(-M, 1450, W + 2 * M, 700, '#3c9c98', 0, 0);
    const bench = rect(-M, 1150, W + 2 * M, 40, '#e9ece8', 6) + rect(-M, 1190, W + 2 * M, 900, '#3fa7a0', 0, 6) + [0, 1, 2].map(i => rect(-40 + i * 400, 1240, 360, 280, '#46b0a9', 8, 5) + rect(130 + i * 400, 1270, 60, 12, '#fff', 6, 3)).join('');
    const box = G(tr(640, 1150, 1), rect(-60, -70, 120, 70, '#f2c94c', 8, 5) + text(0, -22, 'none', 'POWER', '#333', 26) + G(`rotate(${-30 + 60 * lever} 0 -60)`, line(0, -60, 0, -150, 10) + circ(0, -150, 18, '#e2463a', 5)));
    return depth(cam, [
      { z: 1.15, svg: bg, blur: 5 },
      { z: 1, svg: her + bench + domeS + monitor(m.x, m.y, m.w, m.h, scrS, { standH: 80 }) + box + rect(900, 1080, 140, 70, '#e5e5e0', 6, 5) },
      { z: .5, svg: [0, 1, 2, 3, 4].map(i => rect(-100 + i * 110, 1500, 60, 400, '#cfe9f0', 20, 6) + rect(-100 + i * 110, 1700, 60, 200, '#f2c94c', 10, 0)).join(''), blur: 11 },
    ]);
  },
});

// =========================================================== 11. LE MONDE 3D DE LA MOUCHE (38.75 → 43.85)
S(38.75, {
  cam: NOCAM, tin: { type: 'portal', d: .7, rr: 4 }, post: true, dust: false,
  sfx: [[0, 'whoosh_up', .7], [.4, 'tiptoe', .5], [1.3, 'tiptoe', .5], [2.15, 'pop_hi', .8], [2.7, 'chomp', .9], [2.75, 'coins', .6], [3.1, 'chomp', .9], [3.15, 'coins', .6], [3.5, 'chomp', .9], [3.55, 'coins', .6], [4.45, 'error_beep', .9], [4.5, 'scratch', .6]],
  draw(t) {
    const z = -6.9 * eOutCubic(seg(t, 0, 2.3));
    const eat = t > 2.6 && t < 4.4 ? 1 : 0;
    const look = t > 1.5 && t < 2.4 ? Math.sin((t - 1.5) * 7) * .35 : 0;
    const camO = (() => { const k = eInOut(seg(t, 2.2, 3.0)); return { dx: lerp(4.4, 3.0, k), dy: lerp(2.3, 2.1, k), dz: lerp(6.0, 3.4, k), lz: lerp(-1.6, -2.2, k), ly: lerp(.8, 1.0, k), fov: lerp(46, 44, k) }; })();
    const gl = t > 4.4 ? (Math.floor(t * 20) % 3 ? 1 : 0) || t > 4.7 : 0;
    let s = img3(t3WorldFrame({ t, walkZ: z, walk: t < 2.3 ? 1 : eat * .2, eat, yaw: look, glitch: gl, cam: camO }, W, H), 0, 0, W, H);
    const score = t < 2.7 ? 0 : t < 3.1 ? 100 : t < 3.5 ? 200 : 300, food = val(t, [[2.6, .12], [3.6, .85]]);
    s += hud(score, food, t);
    if (t > 2.15 && t < 2.7) s += G(tr(600, 640, pop(t, 2.15, .3)), exclam(0, 0, 1.2));
    [2.7, 3.1, 3.5].forEach((t0, i) => { const k = seg(t, t0, t0 + .7); if (k > 0 && k < 1) s += op(1 - k, G(tr(460 + i * 60, 820 - k * 200, pop(t, t0, .25), -8), text(0, 0, OL, 'MIAM !', '#ffd23f', 84) + text(0, -80, OL, '+100', '#7dff9a', 54))); });
    if (t > 4.5) s += G(tr(560, 560, pop(t, 4.5, .3)), rect(-230, -46, 460, 80, '#14001a', 6, 0) + `<text x="0" y="12" font-family="monospace" font-size="40" font-weight="700" text-anchor="middle" fill="#ff5cf0">banane_01.png</text>`);
    return t > 4.4 ? glitchFx(s, .25 * (Math.sin(t * 40) > .3 ? 1 : 0), t) : s;
  },
});

// =========================================================== 12. HÔPITAL : le petit problème (43.85 → 50.15)
S(43.85, {
  cam: NOCAM, tin: { type: 'glitch', d: .45 }, rays: { ang: 16, o: .1 },
  sfx: [[0, 'zap', .6], [.15, 'heartbeat', .6], [1.0, 'gasp', .6], [1.8, 'hmm', .5], [3.17, 'whoosh', .7], [3.3, 'thud', .5], [3.6, 'spray', .5], [4.15, 'buzz', .5], [4.95, 'whoosh', .6], [5.97, 'sting', .7]],
  draw(t) {
    const cam = kf(t, [[0, foc(380, 980, 2.0)], [1.7, foc(420, 990, 2.0)], [2.8, foc(560, 1010, 1.75)], [4.9, foc(540, 1010, 1.8)], [5.97, foc(330, 900, 2.6)]]);
    const panel = val(t, [[3.17, -700], [3.45, 300], [4.95, 300], [5.3, -800]], eOutCubic);
    const fill = seg(t, 3.63, 4.9);
    const guy = rouge({ x: 330, y: 1240, legs: [[0, 90], [-10, 85]], expr: exprAt(t, [[0, 'dot'], [.1, 'ring'], [1.8, 'ringN'], [3.3, 'gritR'], [4.95, 'ring'], [5.97, 'ringO']]), arms: [[110, 100], [80, 80]], seed: 1 }, t);
    const doc = stick({ x: 780, y: 1360, body: TEAL, hair: 'bun', hairColor: '#4a3428', expr: exprAt(t, [[0, 'blase'], [1.8, 'blaseS'], [3.17, 'hehe']]), arms: t > 1.8 && t < 3.1 ? [[105, 95], [-170, -175]] : [[30, 160], [150, 20]], tag: '#e2463a', seed: 4 }, t);
    const doc2 = stick({ x: panel - 40, y: 1360, body: '#f4f4f2', coat: true, hair: 'curly', hairColor: '#5a3a2a', glasses: true, expr: 'hehe', arms: [[-10, -20], [-5, 10]], seed: 5 }, t);
    const bg = rect(-M, -M, W + 2 * M, H + 2 * M, '#e8f2ee', 0, 0) + rect(560, 240, 600, 640, '#fff', 8, 7) + [0, 1, 2, 3, 4].map(i => rect(600, 300 + i * 110, 520, 40, '#cfe8f7', 4, 0)).join('') + rect(-M, 640, W + 2 * M, 30, '#cfe2da', 0, 0) + circ(60, 640, 16, '#3f7df0', 5) + circ(160, 640, 16, '#fff', 5) + rect(-M, 1300, W + 2 * M, 900, '#dfe7e3', 0, 0);
    const table = rect(80, 1100, 560, 50, '#f4f4f2', 14) + rect(100, 1150, 520, 30, '#c9d3dc', 8, 5) + rect(560, 1150, 40, 330, '#e2463a', 10) + circ(580, 1360, 26, '#fff', 5);
    return depth(cam, [
      { z: 1.15, svg: bg, blur: 5 },
      { z: 1, svg: table + guy + doc + (panel > -400 ? doc2 + xray(panel + 60, 960, .95, t, fill) : '') },
      { z: .55, svg: [0, 1, 2].map(i => path(`M${-260 + i * 80} -300Q${-220 + i * 80} 900 ${-260 + i * 80} 2200`, 'none', 70, i % 2 ? '#9fd9c4' : '#8ccfb8')).join(''), blur: 8 },
    ]);
  },
});

// =========================================================== 13. TRAITEUR CÉRÉBRAL (50.15 → 52.3)
S(50.15, {
  cam: NOCAM, enter: 'whip', rays: { ang: 20, o: .1 },
  sfx: [[0, 'whoosh', .7], [.59, 'snip', .8], [.6, 'buzz', .7], [.9, 'snip', .6], [1.2, 'snip', .6], [1.69, 'slot', .7], [1.95, 'whoosh_up', .6]],
  draw(t) {
    const cam = kf(t, [[0, foc(450, 1000, 1.6)], [1.7, foc(480, 1010, 1.7)], [2.15, foc(600, 1050, 3.2)]]);
    const spin = t > .59 ? (t - .59) * 2 : 0;
    const n = val(t, [[.6, 0], [1.69, 1000]], k => k * k);
    const chef = stick({ x: 330, y: 1300, body: '#f4f4f2', apron: '#cfe3f3', hair: 'chef', must: '#3a2f2f', expr: exprAt(t, [[0, 'blase'], [.59, 'blaseS'], [1.69, 'hehe']]), arms: [[90, 60], [20, 0]], seed: 3 }, t);
    let slices = ''; for (let i = 0; i < Math.min(14, Math.floor(spin * 7)); i++) slices += ell(840 + i * 4, 1180 - i * 7, 70, 10, BRAIN, 3, BRAIN_D);
    return depth(cam, [
      { z: 1.4, svg: rect(-M, -M, W + 2 * M, H + 2 * M, '#f1ede4', 0, 0) + rect(-M, 260, W + 2 * M, 150, '#1f3352', 0, 0) + text(540, 360, 'none', 'TRAITEUR CÉRÉBRAL', '#f6f1e4', 74) + [0, 1, 2, 3].map(i => rect(60 + i * 260, 520, 200, 200, '#fff', 10, 5) + brain(160 + i * 260, 620, .5, 0, { float: 0 })).join(''), blur: 1.5 },
      { z: 1, svg: chef + rect(-M, 1200, W + 2 * M, 40, '#dfe3e8', 6) + rect(-M, 1240, W + 2 * M, 900, '#c4ccd6', 0, 6) + slicer(600, 1200, .9, t, spin) + brain(400, 1120, .7, t, { float: .3 }) + slices + counter(540, 1340, 1.1, n) },
      { z: .5, svg: G(tr(1000, 1750, 1.4), rect(-150, -150, 300, 150, '#e8d6b0', 10, 6)), blur: 10 },
    ]);
  },
});
// =========================================================== 14. MACRO : un cheveu (52.3 → 53.3)
S(52.3, {
  cam: (t) => ({ z: lerp(1.25, 1.0, eOutCubic(clamp(t))) }), tin: { type: 'dissolve', d: .25 },
  sfx: [[0, 'whoosh_up', .6], [.56, 'glint', .7]],
  draw(t) {
    const fingers = (y, r) => G(tr(760, y, 1, 180 + r), rect(-420, -120, 840, 240, '#f2cdb0', 120, 7) + ell(320, 0, 80, 92, '#fbe6da', 5) + path('M180 -70Q225 0 180 70M60 -80Q90 0 60 80', 'none', 5, '#d9a88a'));
    const lab = (x, y, str, k) => k <= 0 ? '' : G(tr(x, y, k), path('M-80 -20L-80 0L80 0L80 -20', 'none', 6, '#fff') + text(0, 64, OL, str, '#fff', 46));
    return bokeh(t, 3, 14, ['#fff1c8', '#f6d9c0', '#ffe9b0']) + rect(0, 0, W, H, 'rgba(120,100,90,.35)', 0, 0) + blur(14, bokeh(t, 9, 10)) +
      rect(420, -100, 110, 2200, '#5a3a22', 0, 6) + path('M440 -100L440 2100', 'none', 10, 'rgba(255,255,255,.18)') +
      bloom(rect(860, 200, 6, 1100, '#ffb3c7', 3, 0), 8, .9) + fingers(470, -12) + fingers(820, 12) +
      lab(475, 1380, 'un cheveu', pop(t, .05, .3)) + lab(863, 1380, 'une tranche', pop(t, .56, .3));
  },
});

// =========================================================== 15. LE STAND « ÉTERNO » (53.3 → 55.3)
const neon = (x, y, str, size, col) => bloom(text(x, y, 'none', str, col, size), 10, .9);
S(53.3, {
  cam: NOCAM, enter: 'whip',
  sfx: [[0, 'whoosh', .8], [.15, 'buzz', .3], [1.08, 'tada', .6], [1.1, 'sparkle', .6], [1.6, 'kaching', .5]],
  draw(t) {
    const cam = kf(t, [[0, foc(520, 960, 1.9)], [2.0, foc(560, 960, 1.7)]]);
    const sell = stick({ x: 380, y: 1290, body: '#2f3a5a', tie: '#e2463a', coat: true, hair: 'bowl', hairColor: '#f2d24c', expr: exprAt(t, [[0, 'glee'], [.76, 'hehe'], [1.08, 'glee']]), arms: t > 1.08 ? [[-150, -120], [-30, -60]] : [[110, 95], [20, -40]], seed: 2 }, t);
    const cli = stick({ x: 850, y: 1380, s: 1.05, body: YEL, hair: 'bob', hairColor: '#1f1f26', expr: exprAt(t, [[0, 'dot'], [1.08, 'hehe']]), arms: [[110, 95], [70, 90]], seed: 7, shoes: '#333' }, t);
    const counterB = rect(-60, 1040, 960, 300, '#26304f', 10) + text(420, 1200, 'none', 'TÉLÉCHARGEZ-VOUS', '#9fffd6', 50) + rect(660, 960, 120, 90, '#fff', 6, 5);
    const booth = rect(-80, 280, 1000, 760, '#1d1640', 16, 8) + neon(420, 420, 'ÉTERNO', 120, '#9fffd6') + neon(420, 520, 'vivez pour toujours*', 64, '#ff7ad9') + `<text x="420" y="580" font-family="Fredoka" font-size="24" fill="#8f86c0" text-anchor="middle">*votre corps est temporaire. Vous, non.</text>` + rect(40, 640, 240, 180, '#bfe2ff', 10, 6) + G(tr(160, 730, .45), head({ hr: 100, skin: HEADW, cheeks: false, expr: 'glee' }, t));
    const mall = rect(-M, -M, W + 2 * M, H + 2 * M, '#2a2f48', 0, 0) + [0, 1, 2, 3].map(i => neon(-300 + i * 520, 200, ['VIVRE+', 'POURQUOI MOURIR ?', 'ÉTERNO', 'NUAGE'][i], 60, ['#7ad0ff', '#ffd23f', '#9fffd6', '#ff7ad9'][i])).join('') + rect(-M, 1300, W + 2 * M, 900, '#3a3f5c', 0, 0);
    return depth(cam, [
      { z: 1.6, svg: mall, blur: 4 },
      { z: 1, svg: booth + sell + counterB + cli + op(seg(t, 1.08, 1.3) * (1 - seg(t, 1.6, 2)), sparkle(250, 760, .8) + sparkle(560, 700, .6)) },
      { z: .5, svg: G(tr(-60, 1600, 1.4), rect(-80, -800, 160, 900, '#ffd23f', 8, 7) + rect(-80, -800, 160, 900, 'none', 8, 7)), blur: 10 },
    ]);
  },
});
// =========================================================== 16. LE FORMULAIRE (55.3 → 57.6)
S(55.3, {
  cam: NOCAM, enter: 'crash',
  sfx: [[0, 'whoosh_up', .7], [1.04, 'sting', .8], [1.78, 'scratch', .7], [1.8, 'boom', .5]],
  draw(t) {
    const cam = kf(t, [[0, { zoom: .95 }], [1.0, { zoom: 1.0 }], [1.5, { zoom: 1.45, y: 210, x: 0 }], [2.3, { zoom: 1.55, y: 230, x: 60 }]]);
    return depth(cam, [
      { z: 1.4, svg: rect(-M, -M, W + 2 * M, H + 2 * M, '#1d1640', 0, 0) + rect(-M, 1300, W + 2 * M, 900, '#26304f', 0, 0), blur: 5 },
      { z: 1, svg: form(540, 860, 1.0, t, { circle: seg(t, 1.78, 2.15), r: -2 }) },
    ]);
  },
});
// =========================================================== 17. LA FILE D'ATTENTE (57.6 → 59.1)
S(57.6, {
  cam: NOCAM, tin: { type: 'dissolve', d: .3 },
  sfx: [[0, 'whoosh', .5], [.14, 'ding', .7], [.82, 'tada', .4]],
  draw(t) {
    const cam = kf(t, [[0, { zoom: 1.5, y: -120, x: -160 }], [1.4, { zoom: 1.0 }]], eOutCubic);
    const cols = [RED, BLUE, YEL, GREEN, PURP, TEAL, PINK, '#f08a24'], hairs = ['beret', 'bowl', 'bob', 'curly', 'bald', 'bun', 'cap'];
    let crowd = ''; const r = rng(21);
    for (let row = 0; row < 6; row++) for (let i = 0; i < 7; i++) {
      const x = 80 + i * 150 + (row % 2) * 70 + r() * 30, y = 820 + row * 95, k = rng(row * 10 + i)();
      crowd += stick({ x, y, s: .42 + row * .03, body: cols[(row * 3 + i) % 8], hair: hairs[(row + i * 2) % 7], hairColor: ['#2b2b33', '#e8892a', '#f2d24c', '#5a3a2a'][(i + row) % 4], expr: t > .82 && k < .7 ? 'glee' : ['dot', 'hehe', 'blase', 'dotO'][(row + i) % 4], seed: row * 7 + i, arms: t > .82 && k < .4 ? [[-130, -110], [-50, -70]] : undefined, shadow: false }, t);
    }
    const bg = rect(-M, -M, W + 2 * M, H + 2 * M, '#2a2f48', 0, 0) + rect(-M, 900, W + 2 * M, 1300, '#3a3f5c', 0, 0) + rect(620, 260, 400, 260, '#111', 10, 7) + `<text x="820" y="330" font-family="Fredoka" font-weight="700" font-size="34" fill="#ccc" text-anchor="middle">NUMÉRO SERVI</text>` + bloom(`<text x="820" y="460" font-family="monospace" font-weight="700" font-size="120" fill="#ffb23f" text-anchor="middle">4813</text>`, 10, .8) + rect(60, 300, 420, 500, '#1d1640', 10, 7) + neon(270, 420, 'ÉTERNO', 80, '#9fffd6');
    return depth(cam, [{ z: 1.2, svg: bg, blur: 2 }, { z: 1, svg: crowd + [0, 1, 2, 3, 4].map(i => line(-100, 1000 + i * 100, 1200, 980 + i * 100, 8, '#c9a0ff')).join('') }]);
  },
});

// =========================================================== 18. COULOIR DES SERVEURS (59.1 → 61.4)
function S18cam(t) { return cam3({ x: 0, y: 1.6, z: val(t, [[0, 0], [.9, .6], [2.3, 7.6]], k => k * k * (3 - 2 * k)), pitch: -2, f: 1350 }); }
const S18scr = { z: 14.4, x0: -.62, x1: .62, y0: .3, y1: 2.5 };
S(59.1, {
  cam: NOCAM, tin: { type: 'dissolve', d: .4 }, dust: false,
  sfx: [[0, 'ghost', .4], [.2, 'steps', .4], [.4, 'gasp', .5], [.95, 'whoosh', .6], [1.5, 'ding', .5], [1.72, 'magic', .5]],
  portal: (t) => rect3(S18cam(t), S18scr.z, S18scr.x0, S18scr.x1, S18scr.y0, S18scr.y1),
  draw(t) {
    const c = S18cam(t);
    let s = grad('#0b1030', '#1b2250', 0, 0, W, H);
    s += wall3(c, 15, -3, 3, 0, 3.4, '#141a40');
    s += floor3(c, -2.2, 2.2, -1, 15, .55, '#182050', '#1d2660', 'rgba(90,140,255,.45)');
    for (const sd of [-1, 1]) for (let z = 0; z < 14.4; z += 1.2) {
      const x = sd * 1.7;
      s += poly3(c, [[x, 0, z], [x, 2.9, z], [x, 2.9, z + 1.15], [x, 0, z + 1.15]], '#252e63', 3, '#0a0f2a');
      for (let j = 0; j < 9; j++) for (let k2 = 0; k2 < 3; k2++) { const [px, py, pz] = P3(c, x - sd * .01, .3 + j * .28, z + .2 + k2 * .35); if (pz > .2) { const on = Math.sin(t * 7 + j * 3.1 + k2 * 1.7 + z * 2) > 0; s += circ(px, py, Math.max(1.5, 14 / pz), on ? ['#5ad1ff', '#7dff9a', '#ffd23f'][(j + k2) % 3] : '#2c3a7a', 0); } }
    }
    for (let z = 1; z < 15; z += 2) s += poly3(c, [[-.5, 3.3, z], [.5, 3.3, z], [.5, 3.3, z + .8], [-.5, 3.3, z + .8]], '#cfe6ff');
    const sr = rect3(c, S18scr.z, S18scr.x0, S18scr.x1, S18scr.y0, S18scr.y1);
    const up = val(t, [[.95, 0], [1.6, 1]]);
    s += rect(sr.x - 10, sr.y - 10, sr.w + 20, sr.h + 20, '#0a0f2a', 6, 0) + bloom(rect(sr.x, sr.y, sr.w, sr.h, '#1f2a78', 4, 0) + G(tr(sr.x + sr.w / 2, sr.y + sr.h * .45, sr.w / 300), text(0, -40, 'none', up < 1 ? 'TÉLÉCHARGEMENT' : 'TERMINÉ', '#cfe6ff', 30) + bar(-120, 0, 240, 30, up, '#7dff9a') + text(0, 80, 'none', Math.round(up * 100) + ' %', '#cfe6ff', 34)), 16, .7);
    // le vigile
    const gz = val(t, [[0, 6.0], [1.4, 4.2]], k => k);
    const guard = stick({ body: '#2c3c78', hair: 'cap', hairColor: '#24306a', expr: exprAt(t, [[0, 'blase'], [.4, 'ring'], [.95, 'ringO']]), badge: 1, ...walkPose(t, 1, .7), arms: [[100, 90], [40, -10]], holdR: G(tr(0, 0, 1, -20), rect(-12, -40, 24, 60, '#333', 6, 4)), seed: 4, shoes: '#222' }, t);
    if (gz - c.z > 1.6) { s += sprite3(c, .45, 0, gz, guard, 290); const [lx, ly] = P3(c, .7, 1.05, gz - .2); s += `<path d="M${f1(lx)} ${f1(ly)}L${f1(lx - 260)} ${f1(ly + 900)}L${f1(lx + 260)} ${f1(ly + 900)}Z" fill="#fff6c8" opacity=".18"/>`; }
    return s + lightRays(t, { ang: 0, n: 3, o: .05, c: '#9fc4ff', x: 260 });
  },
});

// =========================================================== 19. LE MONDE VIOLET : « ça » se réveille (61.4 → 66.05)
const S19 = S(61.4, {
  cam: NOCAM, tin: { type: 'portal', d: .7, rr: 4 },
  sfx: [[0, 'whoosh_up', .7], [.8, 'magic', .5], [.85, 'gasp', .4], [2.15, 'pop', .6], [2.4, 'pop', .6], [2.7, 'pop', .6], [3.0, 'pop', .6], [3.3, 'pop_hi', .6], [3.64, 'shutter', .6], [4.3, 'ding', .5]],
  draw(t) {
    const cam = { zoom: val(t, [[0, 1.0], [4.6, 1.12]]), x: 0, y: 40 };
    let bg = grad('#5b3fc4', '#9a7ce6', -M, -M, W + 2 * M, H + 2 * M);
    const vx = 540, vy = 820;
    for (let i = -12; i <= 12; i++) bg += line(vx + i * 40, vy, vx + i * 420, H + 400, 3, 'rgba(255,255,255,.35)');
    for (let j = 0; j < 12; j++) { const y = vy + Math.pow(j / 11, 2) * 1400; bg += line(-M, y, W + M, y, 3, 'rgba(255,255,255,.3)'); }
    for (let i = -6; i <= 6; i++) bg += line(vx + i * 160, -M, vx + i * 160, vy, 2, 'rgba(255,255,255,.18)');
    bg += bloom(rect(120, 380, 280, 280, '#f6d9ff', 4, 0), 20, .8) + rect(760, 520, 220, 160, 'none', 4, 3, 'rgba(255,255,255,.6)') + path('M800 600Q830 550 870 580Q910 540 940 600Q930 640 870 640Q820 650 800 600Z', 'none', 4, 'rgba(255,255,255,.7)');
    const wake = seg(t, .78, 1.4);
    const ex = exprAt(t, [[0, 'calm'], [.78, 'blase'], [1.2, 'dotO'], [2.15, 'glee'], [3.64, 'hehe'], [4.3, 'dot']]);
    const guy = stick({ x: 540, y: 1560, s: 1.9, body: '#c9b4ff', hair: 'beret', hairColor: '#6b52b8', expr: ex, lean: lerp(-18, 0, wake), tilt: lerp(-14, 0, wake), legs: wake < 1 ? [[60, 100], [120, 80]] : undefined, legLen: lerp(100, 140, wake),
      arms: t > 3.64 ? [[105, 95], [-40, -80]] : t > 2.15 ? [[-140, -120], [-40, -60]] : [[100, 90], [80, 90]], holdR: t > 3.64 ? G(tr(40, -60, pop(t, 3.64, .35)), idCard(0, 0, .6, -8)) : '', seed: 2 }, t);
    const photos = [['beach', 220, 640, -10, 2.15], ['duck', 860, 760, 8, 2.4], ['cake', 180, 1080, 6, 2.7], ['bike', 900, 1120, -7, 3.0], ['me', 760, 450, 4, 3.3]];
    const ph = photos.map(([k, x, y, r, t0]) => { const p = pop(t, t0, .4); return p > 0 && t < 3.7 ? G(tr(x + wave(t, .4, 8, x), y + wave(t, .3, 10, y), p * .8, r), polaroid(0, 0, 1, 0, PH[k]())) : ''; }).join('');
    return depth(cam, [{ z: 1, svg: bg + guy + ph + (t > 3.64 ? '' : '') }]);
  },
});

// =========================================================== 20. BLOC OPÉRATOIRE (66.05 → 70.4)
const MON20 = { x: 90, y: 300, w: 270, h: 480 };
function S20cam(t) { return kf(t, [[0, foc(540, 960, 1.0)], [.9, foc(540, 960, 1.0)], [1.6, foc(520, 980, 1.6)], [2.2, foc(620, 980, 1.55)], [4.3, foc(640, 990, 1.65)]]); }
S(66.05, {
  cam: NOCAM, tin: { type: 'portalOut', d: .75, rr: 4 }, rays: { ang: 0, o: .08, n: 3, x: 300, c: '#ffffff' },
  sfx: [[.1, 'ecg_beep', .4], [1.1, 'ecg_beep', .4], [2.09, 'whoosh', .7], [2.15, 'scratch', .3], [2.7, 'squeak', .5], [3.3, 'hmm', .5], [3.6, 'sting', .6]],
  portal: (t) => drect(S20cam(t), MON20.x, MON20.y, MON20.w, MON20.h),
  draw(t) {
    const cam = S20cam(t);
    const formK = eOutBack(seg(t, 2.09, 2.6));
    const bg = rect(-M, -M, W + 2 * M, H + 2 * M, '#eef2f0', 0, 0) + ell(560, 140, 260, 70, '#fff', 7) + glow(560, 200, 500, '#fff', .6) + rect(-M, 760, W + 2 * M, 40, '#cfe8e2', 0, 0) + rect(-M, 1350, W + 2 * M, 900, '#dfe7e5', 0, 0);
    const mon = rect(MON20.x - 16, MON20.y - 16, MON20.w + 32, MON20.h + 32, '#262b36', 10) + inRect(MON20, S19.draw(4.6 + t * .3, 4.65, 66), 4) + line(MON20.x + MON20.w / 2, MON20.y + MON20.h + 16, MON20.x + MON20.w / 2, 1000, 10, '#9aa3ad');
    const table = rect(80, 1060, 900, 60, '#f4f4f2', 20) + rect(140, 1120, 780, 30, '#c9d3dc', 8, 5) + rect(500, 1150, 50, 220, '#9aa3ad', 6, 5) + rect(380, 1360, 300, 30, '#9aa3ad', 10, 5);
    const patient = G(tr(280, 1000, 1, 0), path('M-60 40L620 40Q660 40 660 0L-60 0Z', '#bcd9f0', 6)) + G(tr(270, 980, .85, -82), head({ hr: 100, skin: HEADW, cheeks: false, expr: exprAt(t, [[0, 'ring'], [1.5, 'ringN'], [2.09, 'gritR']]), hairFn: HAIRS.beret(HAIRD), look: [0, 0] }, t)) + rect(330, 960, 560, 70, '#e8724a', 30, 6) + rect(330, 960, 560, 70, '#bcd9f0', 30, 6);
    const surgeon = stick({ x: 830, y: 1450, s: 1.05, body: TEAL, hair: 'scrub', hairColor: '#5ab8b0', mask: true, expr: exprAt(t, [[0, 'blase'], [2.09, 'blaseS'], [3.3, 'blase']]), arms: [[150, 150], [100, 60]], holdR: G(tr(0, 0, 1, -30), rect(-10, -90, 20, 120, '#3f7df0', 6, 4) + path('M-10 30L0 60L10 30Z', '#f2c94c', 4)), seed: 4 }, t);
    const formS = formK > 0 ? G(tr(lerp(900, 430, formK), lerp(1500, 860, formK), lerp(.3, .78, formK), lerp(20, -4, formK)), rect(-400, -560, 800, 70, '#c9a26b', 10, 6) + form(0, 0, 1, t, { brand: 'ÉTERNO' }).replace('Vivez pour toujours*', 'FORMULAIRE DE CONSENTEMENT')) : '';
    return depth(cam, [
      { z: 1.3, svg: bg, blur: 2 },
      { z: 1, svg: mon + table + patient + surgeon + formS },
    ]);
  },
});
SCENES.sort((a, b) => a.s - b.s);
