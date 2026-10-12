// ============================================================
//  « Pourquoi c'est horrible d'être petit ? » — 9:16, style CERVEAU (flow : persos stick, décors illustrés
//  en couches, lumière, transitions enchaînées) + pinceau à pression + persos à ~la moitié de l'écran.
//  Inserts 3D : ADN (set3 'dna'), atterrissage (set3 'sky'). Temps = mots réels (words.js).
// ============================================================
const TOTAL = 60.4;
const SCENES = [];
const NOCAM = () => ({ z: 1 });
function S(s, o) { o.s = s; o.cam = o.cam || NOCAM; if (!o.tin && o.enter === undefined) o.enter = 'none'; SCENES.push(o); return o; }
const foc = (px, py, z) => ({ x: (px - W / 2) * z, y: (py - H / 2) * z, zoom: z });
const SC = 1.6; // échelle des persos : ~la moitié de l'écran
const HERO = { body: '#e8724a', hair: 'beret', hairColor: '#3b3040', shoes: '#f0a0b4', seed: 1 };
const KEVIN = { body: '#3fa7a0', hair: 'bowl', hairColor: '#c98a3a', shoes: '#2b2b33', legLen: 240, bh: 250, seed: 2 };
const KID = (o) => Object.assign({ hr: 100, bh: 150, bw: 130, legLen: 95, shadow: false }, o);
const moi = (o, t) => stick(Object.assign({}, HERO, { s: SC }, o), t);
const kevin = (o, t) => stick(Object.assign({}, KEVIN, { s: SC }, o), t);

// =========================================================== 1. CONCERT : 80 € (0 → 5.5) + TITRE
S(0, {
  rays: false,
  sfx: [[.05, 'whoosh_up', .6], [.3, 'pop', .6], [.5, 'pop', .6], [2.36, 'kaching', .8], [2.4, 'pop_hi', .6], [3.8, 'tada', .6], [4.1, 'sparkle', .5]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(540, 960, 1.0)], [5.5, foc(540, 980, 1.08)]]);
    const star = seg(T, 3.6, 4.2);
    const h = moi({ x: 540, y: 1620, expr: exprAt(T, [[0, 'joyX'], [2.36, 'proudX'], [3.8, 'joyX']]), bobY: -Math.abs(Math.sin(t * 7)) * 20, arms: T > 2.36 ? [[-130, -100], [-50, -70]] : [[-120, -90], [-60, -90]], holdR: T > 2.36 ? G(tr(0, -40, pop(T, 2.36, .3), -20), ticket(0, 0, .8)) : '' }, t);
    const hearts = T > 3.9 ? [0, 1, 2].map(i => { const k = (t * .8 + i / 3) % 1; return op(1 - k, heart(540 + (i - 1) * 140 + Math.sin(t * 3 + i) * 30, 900 - k * 500, .9)); }).join('') : '';
    return depth(cam, [
      { z: 1.4, svg: concertBg(t, { star }), blur: 3 },
      { z: 1.3, svg: beams(t, .2) },
      { z: 1.15, svg: crowdRow(1250, .9, 3, t, 8, { back: true }), blur: 3 },
      { z: 1, svg: h + hearts },
      { z: .55, svg: crowdRow(2050, 1.6, 9, t, 4, { back: true }), blur: 10 },
    ]) + title(t);
  },
});
// =========================================================== 2. … tu ne verras RIEN (5.5 → 8.04) — vu de dos
S(5.5, {
  enter: 'whip',
  sfx: [[0, 'whoosh', .7], [.5, 'boing', .5], [1.0, 'boing', .5], [1.5, 'boing', .5], [1.54, 'rimshot', .6]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(540, 940, 1.0)], [2.5, foc(540, 940, 1.06)]]);
    const jump = Math.max(0, Math.sin(t * 6.3)) * 160;
    return depth(cam, [
      { z: 1.4, svg: concertBg(t, { star: 1 }), blur: 3 },
      { z: 1.3, svg: beams(t, .22) },
      { z: 1.15, svg: crowdRow(1300, .9, 5, t, 8, { back: true }), blur: 3 },
      { z: 1.02, svg: kevin({ x: 600, y: 1640, back: true, armsBack: true, arms: [[100, 94], [80, 86]] }, t) },
      { z: 1, svg: moi({ x: 330, y: 1700 - jump, s: SC * .95, back: true, armsBack: true, arms: [[-130, -110], [-50, -70]] }, t) },
    ]) + punch(540, 380, 'RIEN.', T, 7.04, '#fff', 150);
  },
});
// =========================================================== 3. Kevin. 1,95 m (8.04 → 11.14) — de face, contre-plongée
S(8.04, {
  enter: 'whip',
  sfx: [[0, 'whoosh', .8], [.3, 'drum', .6], [1.24, 'sting', .7], [1.7, 'whoosh_up', .6], [2.4, 'ding', .6]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(560, 1000, 1.0)], [1.2, foc(560, 960, 1.04)], [3.1, foc(560, 940, 1.1)]]);
    const peek = Math.max(0, Math.sin(t * 5)) ;
    let s = depth(cam, [
      { z: 1.3, svg: grad('#2a1550', '#120a24', -M, -M, W + 2 * M, H + 2 * M) + crowdRow(1000, .8, 11, t, 8), blur: 4 },
      { z: 1.1, svg: beams(t + 2, .16) },
      { z: 1.02, svg: moi({ x: 300, y: 1640 - peek * 200, expr: 'cryX', arms: [[-130, -110], [-50, -70]] }, t) },
      { z: 1, svg: kevin({ x: 600, y: 1680, expr: exprAt(T, [[0, 'blaseX'], [9.3, 'blaseS']]), arms: [[40, 150], [140, 30]] }, t) },
    ]);
    s += tag(800, 420, 'KEVIN', T, 9.28, '#ffd23f', OL, 70, 6) + ruler(980, 1680, 420, '1,95 m', eOutCubic(seg(T, 9.72, 10.6)));
    return s;
  },
});
// =========================================================== 4. 2 heures à admirer sa nuque (11.14 → 14.26) — POV
S(11.14, {
  tin: { type: 'dissolve', d: .3 },
  sfx: [[.3, 'clock_fast', .6], [1.4, 'hmm', .4], [2.16, 'glint', .8], [2.2, 'angel', .4]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(540, 960, 1.0)], [3.1, foc(560, 1000, 1.15)]]);
    let s = depth(cam, [
      { z: 1.5, svg: concertBg(t, { star: 1 }), blur: 6 },
      { z: 1.3, svg: beams(t, .25) },
      { z: 1, svg: G(tr(560, 1060, 4.2), head({ hr: 100, back: true, hairColor: '#c98a3a', skin: HEADW, mole: 1 }, t)) + rect(330, 1460, 460, 600, '#3fa7a0', 80, 9) },
    ]);
    s += G(tr(200, 360, 1), rect(-150, -70, 300, 140, '#111', 16, 6) + `<text x="0" y="24" font-family="monospace" font-weight="700" font-size="64" fill="#7dff9a" text-anchor="middle">${String(Math.floor(seg(T, 11.46, 13.9) * 2)).padStart(1, '0')}:${String(Math.floor((seg(T, 11.46, 13.9) * 120) % 60)).padStart(2, '0')}:00</text>`);
    if (T > 13.3) { const [mx, my] = [560 + 25 * 4.2 * cam.zoom / cam.zoom, 1060 + 62 * 4.2]; s += sparkle(mx + 60, my - 60, .9 * pop(T, 13.3, .3)) + punch(540, 560, 'MAGNIFIQUE.', T, 13.3, '#ffd23f', 100, -4); }
    return s;
  },
});
// =========================================================== 5. Bienvenue dans ta vie (14.26 → 15.3)
S(14.26, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[.1, 'tada', .4], [.3, 'sting', .5]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(540, 1000, 1.05)], [1, foc(540, 960, 1.15)]]);
    return depth(cam, [
      { z: 1.3, svg: grad('#2a1550', '#120a24', -M, -M, W + 2 * M, H + 2 * M) + crowdRow(1000, .8, 21, t, 8), blur: 4 },
      { z: 1.1, svg: beams(t, .18) },
      { z: 1, svg: moi({ x: 540, y: 1650, expr: 'cryX', arms: [[100, 94], [80, 86]] }, t) },
    ]) + tag(540, 420, 'BIENVENUE ✨', T, 14.3, '#ff6fa5', '#fff', 64, -3);
  },
});
// =========================================================== 6. 8 ans : photo de classe, premier rang (15.3 → 18.38)
S(15.3, {
  tin: { type: 'dissolve', d: .3 },
  sfx: [[.06, 'pop', .6], [.96, 'shutter', .9], [.98, 'flash_hit', .6], [2.64, 'ding', .6], [2.7, 'pop_hi', .6]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(540, 1060, 1.0)], [2.6, foc(540, 1100, 1.06)], [3.08, foc(540, 1250, 1.35)]]);
    const kids = (y, seed, n, s) => { let g = ''; const r = rng(seed); for (let i = 0; i < n; i++) { const x = 100 + i * (880 / (n - 1)); g += stick(KID({ x, y, s, body: TOPS[Math.floor(r() * 8)], hair: HAIRK[Math.floor(r() * 6)], hairColor: HAIRC[Math.floor(r() * 6)], expr: ['glee', 'hehe', 'joyX', 'dot'][Math.floor(r() * 4)], seed: seed + i, arms: [[110, 100], [70, 80]] }), t); } return g; };
    let s = depth(cam, [
      { z: 1.3, svg: classBg(), blur: 3 },
      { z: 1.05, svg: bench(980) + kids(980, 4, 6, 1.25) + bench(1180) + kids(1180, 9, 6, 1.3) },
      { z: 1, svg: moi(KID({ x: 540, y: 1560, s: 1.3, expr: exprAt(T, [[0, 'dot'], [16.3, 'shockX'], [17.0, 'blaseX']]), arms: [[110, 100], [70, 80]] })) },
    ]);
    if (T > 16.26) s += op(1 - seg(T, 16.26, 16.7), `<rect width="${W}" height="${H}" fill="#fff"/>`);
    if (T > 17.94) { s += op(seg(T, 17.94, 18.1), circ(540, 1250, 220, 'none', 12, '#e2463a')) + tag(540, 820, 'PREMIER RANG', T, 17.94, '#e2463a', '#fff', 60, -4); }
    return s;
  },
});
// =========================================================== 7. 15 ans : tout le monde grandit… toi : +2 cm (18.38 → 21.14)
S(18.38, {
  enter: 'whip',
  sfx: [[0, 'whoosh', .7], [.6, 'boing', .8], [.75, 'boing', .7], [.9, 'boing', .7], [1.32, 'squeak', .7], [1.96, 'glint', .6], [2.3, 'rimshot', .5]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(540, 1000, 1.0)], [1.8, foc(540, 1000, 1.0)], [2.3, foc(540, 1130, 1.45)], [2.76, foc(540, 1140, 1.5)]]);
    const gr = eOutElastic(seg(T, 18.96, 19.7));
    const teen = (x, body, hair, hc, i) => stick({ x, y: 1600, s: 1.35, body, hair, hairColor: hc, legLen: lerp(110, 220, gr), bh: lerp(170, 240, gr), expr: gr > .5 ? 'smugX' : 'dot', seed: 30 + i, arms: [[110, 100], [70, 86]] }, t);
    const me = eOutBack(seg(T, 19.8, 20.3));
    let s = depth(cam, [
      { z: 1.25, svg: hallBg(), blur: 2 },
      { z: 1, svg: teen(170, '#2fa36b', 'curly', '#2b2b33', 0) + teen(900, '#9b6fd6', 'bob', '#5a3a2a', 1) + moi({ x: 540, y: 1600, s: 1.35, legLen: 110 + me * 4, expr: exprAt(T, [[0, 'dot'], [19.22, 'determined'], [20.2, 'blaseX']]), arms: [[110, 100], [70, 86]] }, t) },
    ]);
    if (T > 20.2) s += G(tr(780, 640, pop(T, 20.2, .3)), rect(-150, -60, 300, 120, '#fff', 20, 7) + text(0, 24, 'none', '+ 2 cm', '#2fa36b', 70));
    return s;
  },
});
// =========================================================== 8. Le médecin : tes gènes (21.14 → 23.5)
const MON8 = { x: 640, y: 340, w: 300, h: 533 };
const S8cam = (t) => kf(t, [[0, foc(540, 1000, 1.0)], [1.7, foc(560, 980, 1.05)], [2.36, foc(790, 640, 1.6)]]);
S(21.14, {
  tin: { type: 'dissolve', d: .3 },
  sfx: [[.1, 'hmm', .5], [1.0, 'tick', .4], [2.1, 'whoosh_up', .6]],
  portal: (t) => drect(S8cam(t), MON8.x, MON8.y, MON8.w, MON8.h),
  draw(t, d, T) {
    const cam = S8cam(t);
    const doc = stick({ x: 300, y: 1620, s: SC, body: '#f4f4f2', coat: true, tie: '#3f7df0', hair: 'bald', hairColor: '#cfcfcf', glasses: true, must: '#cfcfcf', expr: exprAt(T, [[0, 'blaseS'], [22.3, 'hehe']]), arms: [[100, 94], [-30, -50]], seed: 5 }, t);
    const me = moi({ x: 800, y: 1604, s: SC, ...SIT, legs: [[20 + Math.sin(t * 6) * 15, 92], [12 - Math.sin(t * 6) * 15, 88]], expr: 'ringO', arms: [[110, 100], [70, 86]] }, t);
    const scrSvg = rect(MON8.x, MON8.y, MON8.w, MON8.h, '#0d1a3a', 0, 0) + dnaFlat(MON8.x + 150, MON8.y + 270, 1.1);
    return depth(cam, [
      { z: 1.25, svg: officeDocBg(), blur: 2 },
      { z: 1, svg: monitor(MON8.x, MON8.y, MON8.w, MON8.h, scrSvg, { standH: 60 }) + rect(560, 1060, 540, 30, '#e8e8e4', 6) + rect(660, 1380, 300, 30, '#888', 8, 5) + rect(700, 1410, 24, 200, '#888', 4, 5) + doc + me },
    ]);
  },
});
// =========================================================== 9. ADN 3D + service client (23.5 → 26.3)
S(23.5, {
  tin: { type: 'portal', d: .6, rr: 6 }, dust: false,
  sfx: [[.1, 'magic', .5], [.6, 'ring', .6], [1.2, 'ding_ding', .4], [2.2, 'hmm', .5]],
  draw(t, d, T) {
    const v = set3('dna', { p: [Math.sin(t * .3) * 2, 1, 9], l: [0, 0, 0], fov: 55 }, W, H, S => S.anim(t));
    let s = v.img;
    if (T > 24.02) { const k = pop(T, 24.02, .35); s += G(tr(540, 640, k), rect(-420, -230, 840, 460, 'rgba(255,255,255,.95)', 30, 8) + text(0, -140, 'none', '☎ SERVICE CLIENT', '#3f7df0', 60) + text(0, -60, 'none', 'DE VOS GÈNES', '#3f7df0', 60) + text(0, 50, 'none', "Temps d'attente :", '#555', 46) + text(0, 140, 'none', '3 milliards d’années', '#e2463a', 56)); }
    s += moi({ x: 540, y: 1960, s: 1.7, expr: T > 25.4 ? 'exhausted' : 'tired', arms: [[100, 94], [-100, -160]], holdR: rect(-20, -60, 40, 80, '#222', 10, 5) }, t);
    for (let i = 0; i < 3; i++) { const k = (t * .7 + i / 3) % 1; s += op(1 - k, text(800 + k * 60, 1200 - k * 200, OL, '♪', '#ffd23f', 70)); }
    return s;
  },
});
// =========================================================== 10. Supermarché : les céréales en haut (26.3 → 33.5)
S(26.3, {
  enter: 'whip',
  sfx: [[0, 'whoosh', .7], [.9, 'boing', .5], [1.3, 'boing', .5], [1.7, 'boing', .5], [2.5, 'hmm', .5], [2.9, 'steps', .5], [3.6, 'whoosh', .4], [4.0, 'pop', .6], [6.2, 'ding', .6], [6.3, 'boing', .4]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(540, 1060, 1.0)], [2.3, foc(500, 980, 1.02)], [3.5, foc(560, 900, .95)], [5.5, foc(560, 860, .95)], [7.2, foc(560, 900, 1.0)]]);
    const gx = val(T, [[28.9, 1300], [29.8, 760]], k => k);
    const reach = seg(T, 29.9, 30.5), give = seg(T, 31.0, 31.6), gir = pop(T, 32.48, .4);
    const jump = T < 28.76 ? Math.max(0, Math.sin(t * 7)) * 140 : 0;
    const boxY = lerp(lerp(330, 300, reach), 1050, eInOut(give)), boxX = lerp(lerp(560, 600, reach), 390, eInOut(give));
    const giant = stick({ x: gx, y: 1680, s: SC, body: '#f2b632', hair: 'short', hairColor: '#6a4a2a', legLen: 300, bh: 270, expr: exprAt(T, [[0, 'dot'], [29.9, 'blaseS'], [32.48, 'hehe']]), seed: 7, ...(T < 29.8 ? walkPose(t, 1.1) : {}), arms: reach > 0 && give < 1 ? [[100, 94], [lerp(80, -100, reach), lerp(86, -95, reach)]] : undefined, over: gir > 0 ? G(tr(0, -626), giraffeOver(100, gir)) + G(tr(0, -330), spotsOver(140, 200, gir)) : '' }, t);
    const me = moi({ x: 330, y: 1680 - jump, expr: exprAt(T, [[0, 'determined'], [27.9, 'cryX'], [28.76, 'dot'], [30.0, 'ringO'], [31.6, 'joyX']]), arms: T < 28.76 ? [[-120, -100], [-60, -80]] : T > 31.3 ? [[-120, -100], [-60, -80]] : [[110, 100], [-40, -70]] }, t);
    return depth(cam, [
      { z: 1.08, svg: marketBg(t), blur: 1.5 },
      { z: 1, svg: giant + me + (give < 1 ? cerealBox(boxX, boxY, .9) : cerealBox(390, 1000, .9)) + (T > 30.04 && T < 31.2 ? tag(gx + 120, 1640, 'PIEDS À PLAT', T, 30.6, '#fff', OL, 40, 4) : '') },
    ]) + (T > 32.48 ? punch(540, 420, 'MERCI LA GIRAFE', T, 32.48, '#ffd23f', 84, -4) : '');
  },
});
// =========================================================== 11. Appli de rencontre : 1,80 m minimum (33.5 → 39.8)
S(33.5, {
  tin: { type: 'glitch', d: .25 },
  sfx: [[.1, 'vibrate', .6], [.92, 'error_beep', .7], [2.3, 'pop', .6], [3.1, 'typing', .5], [5.16, 'whoosh', .7], [5.4, 'snip', .8], [5.5, 'stamp', .8]],
  draw(t, d, T) {
    let s = grad('#ffe3ef', '#ffd0e4', 0, 0, W, H) + rect(0, 0, W, 230, '#ff5c93', 0, 0) + text(540, 160, 'none', 'Tindoux ♥', '#fff', 80);
    const photo = (who, bg) => rect(-370, -490, 740, 640, bg, 30, 0) + G(tr(0, 120, 1.2), stick(Object.assign({ x: 0, y: 0, shadow: false, legLen: 0 }, who), t));
    const card = (x, y, r, who, bg, nm, sub, sc = 1) => G(tr(x, y, sc, r), rect(-400, -520, 800, 1040, '#fff', 40, 8) + clipR(-370, -490, 740, 640, photo(who, bg), 30) + `<text x="-340" y="260" font-family="Fredoka" font-weight="700" font-size="76" fill="#333">${nm}</text><text x="-340" y="350" font-family="Fredoka" font-weight="700" font-size="50" fill="#888">${sub}</text>`);
    const hers = card(540, 900, 0, { body: '#ff6fa5', hair: 'bob', hairColor: '#5a3a2a', expr: 'hehe' }, '#bfe6ff', 'Léa, 27', '📸 voyages · 🍕');
    const k1 = pop(T, 34.42, .35);
    const fl = seg(T, 38.66, 39.2), sh = seg(T, 39.0, 39.8);
    let mine = '';
    if (T > 35.82) { const x = lerp(1600, 540, eOutBack(seg(T, 35.82, 36.4))); mine = card(x - fl * 900 * 0, 980 + fl * 300, -3, Object.assign({}, HERO, { expr: T > 38.66 ? 'shockX' : 'proudX' }), '#ffe0b0', 'Toi, 28', '📏 1,65 m'); }
    s += (T < 35.82 ? hers : G(tr(0, 0, 1), hers.replace('<g transform', '<g opacity=".35" transform')));
    if (k1 > 0) s += G(tr(540, 1450, k1), rect(-380, -70, 760, 140, '#e2463a', 70, 8) + text(0, 26, 'none', '📏 1,80 m MINIMUM', '#fff', 64));
    if (T > 38.66) { // le filtre : une grille qui découpe la carte
      let g = ''; for (let i = 0; i < 9; i++) g += rect(120 + i * 105, 640, 18, 760, '#555', 6, 4);
      s += op(clamp(fl * 2), g);
      if (mine) s += clipR(0, 0, W, 640 + fl * 700, mine) + (sh > 0 ? [0, 1, 2, 3, 4, 5, 6, 7].map(i => G(tr(0, sh * (300 + i * 60), 1), clipR(120 + i * 105 + 18, 640, 87, 2000, mine))).join('') : '');
      s += stampMark(540, 900, 1, 'FILTRÉ', seg(T, 39.0, 39.25));
    } else s += mine;
    return s;
  },
});
// =========================================================== 12. « Au moins tu fais plus jeune ! » (39.8 → 42.46)
S(39.8, {
  enter: 'whip',
  sfx: [[0, 'whoosh', .7], [1.0, 'squeak', .8], [1.2, 'kiss', .6], [2.4, 'hmm', .6]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(540, 1000, 1.0)], [2.66, foc(560, 960, 1.08)]]);
    const pinch = T > 40.9 ? 1 : seg(T, 40.4, 40.9);
    const aunt = stick({ x: 790, y: 1700, s: SC * 1.08, body: '#c59bff', hair: 'bun', hairColor: '#d5d5dc', glasses: true, expr: 'joyX', arms: [[100, 94], [lerp(80, 190, pinch), lerp(86, 200, pinch)]], seed: 8 }, t);
    const me = moi({ x: 380, y: 1650, expr: T > 42.18 ? 'blaseX' : 'gritR', tilt: pinch * 10, arms: [[110, 100], [70, 86]] }, t);
    return depth(cam, [
      { z: 1.2, svg: livingBg(), blur: 3 },
      { z: 1, svg: me + aunt + (pinch > .9 ? G(tr(470, 960 + Math.sin(t * 30) * 4, 1), ell(0, 0, 50, 34, '#ffb3c7', 5)) : '') },
    ]) + speech(560, 420, 860, 240, 'AU MOINS TU FAIS\nPLUS JEUNE !', T, 41.12, 62) + (T > 42.18 ? punch(300, 760, 'AH OUI ?', T, 42.18, '#fff', 80, -6) : '');
  },
});
// =========================================================== 13. 28 ans : « t'es au lycée ? » (42.46 → 45.2)
S(42.46, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[.1, 'buzz', .3], [.3, 'pop', .7], [1.0, 'hmm', .5], [1.7, 'rimshot', .7], [2.2, 'fire', .4]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(540, 1000, 1.0)], [2.74, foc(520, 980, 1.08)]]);
    const bouncer = stick({ x: 760, y: 1700, s: SC * 1.15, body: '#2b2b33', bw: 220, hair: 'bald', hairColor: '#2b2b33', expr: exprAt(T, [[0, 'blaseX'], [43.4, 'laugh']]), arms: [[100, 94], [-160, -170]], over: rect(-80, -470, 160, 40, '#111', 10, 4), seed: 9 }, t);
    const me = moi({ x: 330, y: 1650, s: SC * .95, coat: true, tie: '#e2463a', expr: exprAt(T, [[0, 'proudX'], [43.4, 'shockX'], [44.5, 'rage']]), arms: [[110, 100], [70, 86]] }, t);
    return depth(cam, [
      { z: 1.2, svg: clubBg(t), blur: 2 },
      { z: 1, svg: me + bouncer + idCard(560, 640, .8 * pop(T, 42.52, .35), -8, '28 ANS') },
    ]) + speech(560, 360, 820, 200, "T'ES AU LYCÉE, PETIT ?", T, 44.18, 56);
  },
});
// =========================================================== 14. L'avion : devine qui est à côté ? KEVIN (45.2 → 48.8)
S(45.2, {
  enter: 'whip',
  sfx: [[0, 'whoosh', .7], [.1, 'ding', .5], [.6, 'steps', .5], [1.6, 'hmm', .4], [2.96, 'boom', .6], [2.98, 'sting', .9]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(540, 1000, 1.0)], [2.9, foc(560, 1000, 1.02)], [3.1, foc(600, 900, 1.25)], [3.6, foc(600, 900, 1.3)]], (k) => k < 1 ? eInOut(k) : 1);
    const k = seg(T, 48.16, 48.4);
    const kv = T > 48.16 ? kevin({ x: 760, y: lerp(800, 1700, eOutBack(k)), expr: 'blaseX', legs: [[-80, 100], [-100, 80]], arms: [[40, 150], [140, 30]] }, t) : '';
    const me = moi({ x: 330, y: 1640, ...SIT, expr: exprAt(T, [[0, 'joyX'], [46.4, 'dot'], [48.16, 'terrorX']]), arms: [[110, 100], [70, 86]] }, t);
    return depth(cam, [
      { z: 1.1, svg: cabinBg(t), blur: 1.5 },
      { z: 1, svg: seatFront(330, 1880, 1.4) + me + kv + seatFront(800, 1880, 1.4) + (T > 47.4 && T < 48.16 ? sparkle(760, 1100, .9) + tag(760, 900, 'PLACE LIBRE ?', T, 47.4, '#fff', OL, 46, -3) : '') },
    ]) + (T > 48.16 ? punch(540, 400, 'KEVIN.', T, 48.16, '#ffd23f', 150, -4) : '');
  },
});
// =========================================================== 15. Kevin plié en 4 pendant 3 heures (48.8 → 52.42)
S(48.8, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[.2, 'crack', .6], [.5, 'squeak', .6], [1.3, 'clock_fast', .6], [2.0, 'crack', .5], [2.6, 'gasp', .5]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(620, 960, 1.05)], [3.6, foc(600, 980, 1.12)]]);
    const tw = Math.sin(t * 3);
    const kv = kevin({ x: 700, y: 1500, expr: exprAt(T, [[0, 'tired'], [50.5, 'exhausted'], [51.6, 'cryX']]), legLen: 240, legs: [[-70 + tw * 10, 120], [-110 - tw * 10, 70]], lean: -14 + tw * 6, tilt: 20 + tw * 8, arms: [[-30, 60], [210, 120]], seed: 2 }, t);
    return depth(cam, [
      { z: 1.1, svg: cabinBg(t), blur: 2 },
      { z: 1, svg: kv + seatFront(700, 1640, 1.25) + moi({ x: 260, y: 1660, ...SIT, expr: 'dot', arms: [[110, 100], [70, 86]] }, t) },
    ]) + G(tr(860, 420, 1), clockSpin(0, 0, 1, t, 40)) + tag(860, 560, '3 HEURES', T, 51.5, '#fff', OL, 46, 0);
  },
});
// =========================================================== 16. Toi : jambes croisées, dodo (52.42 → 53.98)
S(52.42, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[.3, 'magic', .5], [.9, 'angel', .5]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(380, 1000, 1.05)], [1.56, foc(360, 980, 1.15)]]);
    const cross = seg(T, 52.74, 53.2), sl = T > 53.5;
    const me = moi({ x: 360, y: 1560, ...SIT, legs: [[lerp(20, -10, cross), lerp(92, 150, cross)], [lerp(12, 30, cross), 88]], expr: sl ? 'zen' : 'chill', tilt: sl ? -10 : 0, arms: [[40, 150], [140, 30]], over: sl ? G(tr(0, -398, 1), eyeMask(100)) : '' }, t);
    return depth(cam, [
      { z: 1.1, svg: cabinBg(t), blur: 2 },
      { z: 1, svg: me + seatFront(380, 1800, 1.3) + (sl ? zzz(470, 760, t) : '') + [0, 1, 2].map(i => sparkle(200 + i * 160, 700 + Math.sin(t * 3 + i) * 40, .5)).join('') },
    ]) + tag(540, 400, 'CHILL DE OUF', T, 53.5, '#7be07b', OL, 60, -4);
  },
});
// =========================================================== 17. Atterrissage (3D) (53.98 → 55.44)
S(53.98, {
  enter: 'whip', dust: false,
  sfx: [[0, 'whoosh', .8], [.2, 'wind', .6], [.9, 'thud', .9], [.95, 'scratch', .6]],
  draw(t, d, T) {
    const k = clamp(t / 1.46);
    const v = set3('sky', { p: [16, 3.5, -6], l: [0, lerp(5, 1.5, k), lerp(20, -2, k)], fov: 46 }, W, H, S => {
      S.pl.position.set(0, Math.max(1.2, 9 - k * 11), 34 - k * 40); S.pl.rotation.y = Math.PI; S.pl.rotation.x = -Math.max(0, .12 - k * .2);
      S.smoke.forEach((m, i) => { const td = k > .65; m.visible = td; m.position.set((i % 2 ? 2.6 : -2.6), .5 + i * .05, S.pl.position.z + 2 + i * 1.2); m.scale.setScalar(.6 + i * .15); });
    });
    return v.img + punch(540, 420, 'BOUM.', T, 54.9, '#fff', 110, -4);
  },
});
// =========================================================== 18. « mec… t'as trop de chance » (55.44 → 57.04)
S(55.44, {
  tin: { type: 'dissolve', d: .25 },
  sfx: [[.1, 'hmm', .5], [.7, 'gasp', .5], [1.3, 'sting', .4]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(560, 980, 1.05)], [1.6, foc(560, 960, 1.12)]]);
    return depth(cam, [
      { z: 1.1, svg: cabinBg(t), blur: 2 },
      { z: 1, svg: moi({ x: 290, y: 1640, ...SIT, expr: 'smugX', arms: [[40, 150], [140, 30]] }, t) + kevin({ x: 780, y: 1560, expr: 'cryX', legs: [[-70, 120], [-110, 70]], tilt: 14, lean: -8, arms: [[-30, 60], [210, 120]] }, t) + seatFront(300, 1820, 1.3) + seatFront(780, 1820, 1.3) },
    ]) + speech(620, 380, 780, 220, 'MEC… T’AS TROP\nDE CHANCE.', T, 55.5, 56, -1);
  },
});
// =========================================================== 19. « La vie est courte. ET MOI AUSSI ! » (57.04 → fin)
S(57.04, {
  enter: 'crash',
  sfx: [[0, 'whoosh_up', .6], [.8, 'hmm', .4], [1.82, 'boom', .7], [1.85, 'tada', .8], [1.9, 'sparkle', .6]],
  draw(t, d, T) {
    const cam = kf(t, [[0, foc(540, 1000, 1.05)], [1.8, foc(540, 1000, 1.1)], [1.9, foc(540, 960, 1.25)], [3.36, foc(540, 960, 1.3)]]);
    const boom = T > 58.86;
    return depth(cam, [
      { z: 1.1, svg: boom ? sunburst(540, 900, 24, '#ffb84d', '#ffd27a', t * 15) : cabinBg(t), blur: boom ? 0 : 2 },
      { z: 1, svg: moi({ x: 540, y: 1660, expr: boom ? 'proudX' : 'smugX', arms: boom ? [[-140, -100], [-40, -80]] : [[40, 150], [140, 30]], handR: boom ? 'thumb' : '' }, t) },
    ]) + (T > 57.82 && !boom ? tag(540, 420, 'LA VIE EST COURTE', T, 57.82, '#fff', OL, 56, -3) : '') + (boom ? G(tr(540, 470, pop(T, 58.86, .4), -4), text(0, 0, OL, 'ET MOI', '#fff', 150) + text(0, 160, OL, '<tspan fill="#ffb84d">AUSSI !</tspan>', '#fff', 160)) : '');
  },
});
SCENES.sort((a, b) => a.s - b.s);
