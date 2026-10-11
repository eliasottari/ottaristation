// ============================================================
//  "Pourquoi c'est l'enfer de naître roux ?" — découpage 33 plans
//  Temps calés sur roux.mp3 (74,37 s)
// ============================================================
const TOTAL = 75.0;

// ---------- persos secondaires ----------
const DAD = { age: 'adult', hair: 'short', hairColor: '#4a3428', shirt: '#5b7bd6', pants: '#33384a', seed: 2 };
const MOM = { age: 'adult', hair: 'long', hairColor: '#f1cf6b', shirt: '#ef8fa3', pants: '#5a4a6a', seed: 3 };
const BULLY = { hair: 'spiky', hairColor: '#3a2a22', shirt: '#e2463a', pants: '#2f3b52', seed: 5 };
const BULLY_AD = Object.assign({}, BULLY, { age: 'adult', shirt: '#2f3b52', pants: '#22283a', beard: false });
const KID2 = { hair: 'curly', hairColor: '#f1cf6b', shirt: '#6bbf73', pants: '#36507a', seed: 6 };
const DOC = { age: 'adult', hair: 'side', hairColor: '#6b5344', shirt: '#ffffff', coat: true, collar: '#9fd6e6', stetho: true, pants: '#7aa6c2', glasses: true, seed: 8 };
const STYLIST = { age: 'adult', hair: 'ponytail', hairColor: '#7b3fa0', shirt: '#2b2b33', apron: '#f2a7c3', pants: '#2b2b33', seed: 9 };
const TAN = '#c98a5a';

function walk(t, sp = 2.2, amp = 22) {
  const k = Math.sin(t * sp * Math.PI * 2);
  return { legL: [90 + k * amp, 90 + k * amp * 1.2], legR: [90 - k * amp, 90 - k * amp * 1.2], armL: [100 - k * 25, 95 - k * 25], armR: [80 + k * 25, 85 + k * 25], bob: 0 };
}
const hop = (t, f = 2.2, a = 14) => -Math.abs(Math.sin(t * f * Math.PI)) * a;
const talkUntil = (t, a, b) => t > a && t < b;

// ---------- décors ----------
function bgHospital(t) {
  return grad('#d7ede2', '#c3e2d2') + windowFrame(400, 260, 280, 300) + floor(1480, '#a9d4bf', '#90c3aa') + dust(t, 2, 20);
}
function bgClass(t, tint = 0) {
  return grad('#f4e1c6', '#ead1ae') + blackboard(150, 300, 560, 330, path('M240 470Q420 400 600 470', 'none', 6, 'rgba(255,255,255,.6)')) + wallClock(880, 380, 70, t * 3) + floor(1400, '#c99a68', '#b78653');
}
function bgStreet(t, top = '#bfe3ff', bot = '#eaf6ff') {
  return grad(top, bot) + cloud(250 + t * 20, 330, 1.1, 'rgba(255,255,255,.9)') + cloud(820 - t * 15, 480, .8, 'rgba(255,255,255,.8)') +
    building(-40, 1420, 330, 820, '#e6b89c') + building(300, 1420, 260, 640, '#9fb8d9') + building(560, 1420, 300, 900, '#c9d6a3') + building(860, 1420, 280, 700, '#e8a3a3') +
    rect(-60, 1420, 1200, 600, '#b8bfc7', 0, 0) + rect(-60, 1420, 1200, 50, '#d6dbe0', 0, 4) + line(-60, 1700, 1140, 1700, 10, 'rgba(255,255,255,.5)');
}
function bgSalon(t) {
  return grad('#f9e3df', '#f0cfc9') + mirror(300, 300, 480, 640) + circ(200, 220, 50, '#fff7c2', 6) + circ(880, 220, 50, '#fff7c2', 6) + plant(110, 1420, 1.3) + floor(1420, '#e7e2dc', '#d3ccc4') +
    (() => { let s = ''; for (let i = 0; i < 9; i++) s += line(i * 140 - 60, 1420, i * 200 - 300, 1920, 4, 'rgba(0,0,0,.08)'); return s; })();
}
function bgOR(t) {
  return grad('#cfe9ea', '#b4dadd') + glow(540, 250, 500, '#fffbe0', .8) + ell(540, 170, 260, 70, '#e9f0f2') + ell(540, 190, 200, 40, '#fffbe0', 4) + floor(1400, '#9fc9cd', '#86b6bb');
}
function bgBeachSide(t) {
  return grad('#8fd3ff', '#d8f1ff') + rect(-60, 1050, 1200, 200, '#3ab0d6', 0, 0) + path(`M-60 1050 ${Array.from({ length: 14 }, (_, i) => `Q${i * 90 - 15} ${1030 + wave(t, .8, 8, i / 4)} ${i * 90 + 30} 1050`).join(' ')}`, 'none', 8, '#fff') +
    rect(-60, 1240, 1200, 800, '#f4d79a', 0, 0) + path('M-60 1240Q540 1210 1140 1240', 'none', 6, '#e6c27c');
}

// ---------- éléments récurrents ----------
function title(t) {
  const w1 = pop(t, .05), w2 = pop(t, .35), w3 = pop(t, .7);
  return G(tr(540, 360, w1), text(0, 0, OL, "POURQUOI C'EST", '#fff', 96)) +
    G(tr(540, 480, w2, wave(t, .5, 2)), text(0, 0, OL, "L'ENFER DE NAÎTRE", '#fff', 96)) +
    G(tr(540, 640, w3 * (1 + wave(t, 2, .03)), -4), text(0, 0, OL, 'ROUX ?', RED_HAIR, 170));
}
function embers(t, seed = 5, n = 30) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const x = r() * W, sp = 120 + r() * 200, y = H - ((t * sp + r() * H) % H), rr = 4 + r() * 7; s += circ(x + wave(t, .6, 20, r()), y, rr, r() > .5 ? '#ffd23f' : '#ff7a1a', 0); }
  return s;
}
function slotMachine(x, y, s, t, stops, lever) {
  const sw = ['#4a3428', '#f1cf6b', '#1f1b1a', '#8a5a3a', '#d9b26a', '#3b2a22'];
  let win = '';
  for (let k = 0; k < 3; k++) {
    const wx = -210 + k * 150;
    const stopped = t >= stops[k];
    let col = '';
    if (stopped) {
      const b = pop(t, stops[k], .3);
      col = G(tr(wx + 60, 90, .6 + .4 * b), path('M-50 20C-60 -50 60 -50 50 20L35 0L20 18L0 -2L-20 18L-35 0Z', RED_HAIR, 6));
    } else {
      const off = (t * 1400) % 120;
      for (let j = -1; j < 3; j++) col += G(tr(wx + 60, 30 + j * 120 + off - 60), path('M-40 16C-48 -40 48 -40 40 16L28 0L16 14L0 -2L-16 14L-28 0Z', sw[(j + k + Math.floor(t * 12)) % sw.length], 5));
    }
    win += `<clipPath id="cw${k}"><rect x="${wx}" y="10" width="120" height="160" rx="12"/></clipPath>` + rect(wx, 10, 120, 160, '#fff', 12) + `<g clip-path="url(#cw${k})">${col}</g>` + rect(wx, 10, 120, 160, 'none', 12);
  }
  const la = lever;
  return G(tr(x, y, s), rect(-260, -120, 520, 420, '#e2463a', 40) + rect(-230, -200, 460, 110, '#ffd23f', 30) +
    (() => { let b = ''; for (let i = 0; i < 7; i++) b += circ(-180 + i * 60, -145, 14, (Math.floor(t * 8) + i) % 2 ? '#fff' : '#ff8a8a', 3); return b; })() +
    win + rect(-200, 220, 400, 50, '#b8302a', 14) +
    G(tr(275, 40, 1, la * 70), line(0, 0, 0, -170, 16) + circ(0, -180, 30, '#ff4d4d')) + rect(258, 20, 40, 60, '#999', 10));
}
function dnaChar(x, y, s, t, o = {}) {
  let face = circ(0, -400, 80, '#fff', 6) + circ(-28, -405, 11, OL, 0) + circ(28, -405, 11, OL, 0) + path('M-26 -375Q0 -350 26 -375', 'none', 6);
  if (o.shades) face = circ(0, -400, 80, '#fff', 6) + eyesSvg('shades', 80, t, 0, -400 / 80 * 0, 0).replace(/^/, '') ;
  if (o.shades) face = circ(0, -400, 80, '#fff', 6) + G(tr(0, -405), eyesSvg('shades', 80, t, 0, 0, 0)) + path('M-30 -365Q0 -340 30 -368', '#7a2b2b', 6);
  const armA = o.wave ? -60 + wave(t, 3, 30) : -20;
  const LA = limb(-110, -200, 200, 70, 180 - armA, 60, '#6b7bd6', 18), RA = limb(110, -200, -20, 70, armA, 60, '#e86b9a', 18);
  const arms = LA.svg + circ(LA.x, LA.y, 18, '#fff', 5) + RA.svg + circ(RA.x, RA.y, 18, '#fff', 5);
  return G(tr(x, y, s, o.rot || 0), arms + dna(0, 0, 1, t, 10, o.hi ?? 6) + face);
}
function headOnly(o, x, y, s, t) { return G(tr(x, y, s, o.rot || 0), head(o, t)); }
function bubble(x, y, w, h, inner, k = 1) {
  return G(tr(x, y, k), circ(-w * .45, h * .62, 18, '#fff', 6) + circ(-w * .55, h * .82, 11, '#fff', 5) +
    path(`M${-w / 2} 0C${-w / 2} ${-h * .7} ${w / 2} ${-h * .7} ${w / 2} 0C${w / 2 + 30} ${h * .5} ${-w / 2} ${h * .7} ${-w / 2} 0Z`, '#fff', 7) + inner);
}

// ============================================================
const SCENES = [
  // B001 — HOOK
  {
    s: 0, enter: 'none', sfx: [[0, 'boom', .7], [0, 'fire', .8], [.05, 'pop', .6], [.35, 'pop', .6], [.7, 'pop_hi', .8], [1.0, 'fire', .6]],
    cam: (t, d) => ({ z: lerp(1, 1.07, eInOut(t / d)), shake: 2 }),
    draw: (t) => sunburst(540, 1500, 18, '#d8432c', '#c3362a', t * 12) + glow(540, 1500, 900, '#ffb15a', .5) + embers(t) +
      hero({ x: 540, y: 1660, s: 1.65, expr: t < 1.05 ? 'annoyed' : 'worried', armL: [130, 60], armR: [50, 120], headTilt: wave(t, .7, 3) }, t) +
      flames(-40, 1960, 1160, 330 + wave(t, 1.3, 30), t, 3) + title(t),
  },
  // B002 — bébé qui vient de naître (gros plan)
  {
    s: 1.98, sfx: [[0, 'whoosh', .6], [.45, 'baby_coo', .9], [.7, 'glint', .8]],
    cam: (t, d) => ({ z: lerp(1.05, 1.2, eOutCubic(t / d)), cy: 1150 }),
    draw: (t) => bgHospital(t) + crib(540, 1560, 1.6) +
      heroBaby({ x: 540, y: 1560, s: 1.75, expr: t < .55 ? 'calm' : (t < 1.05 ? 'neutral' : 'happy'), headTilt: wave(t, .8, 4) }, t) +
      op(seg(t, .65, .8), sparkle(690, 760, .9 * pop(t, .65)) + sparkle(400, 820, .5 * pop(t, .8))) +
      op(seg(t, .9, 1.1), heart(760, 1000 - (t - .9) * 120, .7) + heart(330, 1050 - (t - .9) * 100, .5)),
  },
  // B003 — contre-plongée : la grand-mère se penche
  {
    s: 3.38, enter: 'drop', sfx: [[0, 'whoosh', .7], [.55, 'glint', 1], [.95, 'hmm', .9]],
    cam: (t, d) => ({ z: lerp(1, 1.12, eInOut(t / d)), r: lerp(-3, 2, t / d), cy: 1100 }),
    draw: (t) => {
      const lean = eOutBack(seg(t, 0, .7));
      return grad('#e9f5ee', '#cfe7da') + glow(540, 120, 400, '#fffbe0', .9) + ell(540, 90, 200, 50, '#fffbe0', 5) +
        line(-100, 520, 1180, 380, 6, 'rgba(0,0,0,.08)') +
        grandma({ x: 540, y: 2350 - lean * 180, s: 2.7, expr: t < .9 ? 'shock' : 'suspicious', armL: [160, 100], armR: [20, 80], headTilt: lerp(0, 8, lean) }, t) +
        op(seg(t, .5, .6) * (1 - seg(t, .85, 1)), sparkle(430, 800, 1.2, '#fff') + sparkle(700, 800, .8, '#fff')) +
        G(tr(540, 1880), rect(-560, -40, 1120, 200, '#ffffff', 30) + rect(-560, -40, 1120, 50, '#eeeeee', 20)) +
        G(tr(540, 1830, 1.2), path('M-60 0C-60 -50 60 -50 60 0Z', RED_HAIR, 6));
    },
  },
  // B004 — plongée : "Mais… il tient ça de qui ?"
  {
    s: 5.02, enter: 'whip', sfx: [[0, 'sting', .9], [.35, 'pop', .7], [.6, 'pop_hi', .7], [1.0, 'glint', .7]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
    draw: (t) => {
      const mail = seg(t, .85, 1.73);
      let s = grad('#d7ede2', '#c3e2d2') + rect(330, 230, 420, 380, '#bfe3ff', 8) +
        G(tr(lerp(220, 860, mail), 860), person({ age: 'adult', hair: 'red', hairColor: RED_HAIR, cap: '#3a6fb0', shirt: '#3a6fb0', expr: 'smug', s: .9, freckles: true, skin: SKIN_PALE, ...walk(t, 2) }, t)) +
        `<path d="M0 0H1080V230H330V610H750V230H1080V1920H0Z" fill="#d7ede2"/>` + rect(330, 230, 420, 380, 'none', 8) + line(540, 230, 540, 610, 6) +
        // sol en plongée (carrelage)
        `<path d="M-200 900H1280L1400 2100H-320Z" fill="#a9d4bf"/>`;
      for (let i = 0; i < 12; i++) s += line(-200 + i * 140, 900, -400 + i * 180, 2000, 4, 'rgba(0,0,0,.07)');
      for (let j = 0; j < 8; j++) s += line(-300, 950 + j * j * 22, 1400, 950 + j * j * 22, 4, 'rgba(0,0,0,.07)');
      const shiver = Math.sin(t * 50) * 3;
      s += person(Object.assign({}, MOM, { x: 540, y: 1270, s: 1.0, expr: 'confused', armL: [60, 10], armR: [120, 170], look: [0, -.5] }), t) + G(tr(540, 1105, .55), heroBaby({ expr: 'neutral' }, t));
      s += grandma({ x: 250, y: 1660, s: 1.25, expr: t > .1 && t < 1.6 ? 'suspicious' : 'suspicious', face: { mouth: talkUntil(t, 0, 1.6) ? 'talk' : 'flat' }, look: [1, 0], armL: [120, 80], armR: [-10, -100] }, t);
      s += person(Object.assign({}, DAD, { x: 830 + shiver, y: 1680, s: 1.25, expr: 'embarrassed', look: [-1, 0], armL: [130, 70], armR: [60, 110] }), t);
      s += op(seg(t, .35, .4), qmark(250, 840, .9 * pop(t, .35), '#fff', -10)) + op(seg(t, .6, .65), qmark(380, 760, .7 * pop(t, .6), '#fff', 12));
      return s;
    },
  },
  // B005a — "Calme-toi, mamie."
  {
    s: 6.75, sfx: [[0, 'whoosh', .6], [.1, 'boing', .5]],
    cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(t / d)), shake: t < .9 ? 4 : 0 }),
    draw: (t) => {
      const tr_ = Math.sin(t * 45) * 6 * (1 - seg(t, .9, 1.4));
      return bgHospital(t) +
        grandma({ x: 360 + tr_, y: 1700, s: 1.35, expr: t < 1.0 ? 'scared' : 'worried', armL: [-40, -80], armR: [-140, -100], look: [0, -.3] }, t) +
        motionLines(170, 1000, 3, 70, 180) + motionLines(560, 1000, 3, 70, 0) +
        person(Object.assign({}, MOM, { x: 790, y: 1700, s: 1.3, expr: t < .9 ? 'calm' : 'neutral', look: [-1, 0], armL: [200 + wave(t, 2.5, 15), 180 + wave(t, 2.5, 25)], armR: [70, 85] }), t);
    },
  },
  // B005b — "C'est un bébé, pas une erreur d'impression."
  {
    s: 8.65, enter: 'whip', sfx: [[0, 'whoosh', .7], [.15, 'printer', .9], [1.55, 'error_beep', .8], [2.05, 'boing', .7], [2.5, 'glint', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.1, eInOut(t / d)), cy: 1000 }),
    draw: (t) => {
      const out = eOutCubic(seg(t, .2, 1.5));
      const err = t > 1.5;
      const photo = heroBaby({ x: 0, y: 70, s: .6, expr: t > 2.3 ? 'happy' : 'neutral' }, t);
      let s = grad('#eaf1f7', '#d8e4ee') + frame(110, 300, 220, 260) + rect(-60, 1350, 1200, 600, '#c99a68', 0, 0) + rect(-60, 1350, 1200, 40, '#dcae7c', 0, 4);
      s += paperPhoto(540, 1110 + lerp(-260, 120, out), 1.1, lerp(0, -4, out), photo);
      s += printer(540, 1100, 1.4, t, seg(t, .2, 1.5));
      if (err) s += op(Math.floor(t * 6) % 2 ? 1 : .3, emark(780, 760, .9 * pop(t, 1.5)));
      s += G(tr(lerp(1150, 610, eOutBack(seg(t, 1.9, 2.4))), 1170 + wave(t, 1.5, 15), 1.3, -20), magnifier(0, 0, 1));
      return s;
    },
  },
  // B006a — "Ton ADN a simplement décidé de jouer"
  {
    s: 11.47, flash: true, sfx: [[0, 'magic', .7], [.55, 'thud', .6], [.6, 'slot', 1.0]],
    cam: (t, d) => ({ z: lerp(1, 1.06, t / d) }),
    draw: (t) => {
      const pull = t > .45 && t < .9 ? Math.sin(seg(t, .45, .9) * Math.PI) : 0;
      return sunburst(540, 960, 20, '#3b3570', '#463f86', t * 10) + glow(540, 1000, 700, '#7f6bff', .35) +
        slotMachine(380, 1080, 1.05, t, [99, 99, 99], pull) +
        dnaChar(860, 1500, .85, t, { hi: -1, wave: t < .4 }) +
        op(1 - seg(t, .3, .5), sparkle(750, 700, .7));
    },
  },
  // B006b — "avec un gène appelé MC1R."
  {
    s: 13.6, enter: 'none', sfx: [[.15, 'thud', .6], [.55, 'thud', .6], [.95, 'thud', .6], [1.05, 'jackpot', 1], [1.2, 'coins', .9], [1.8, 'sparkle', .8]],
    cam: (t, d) => ({ z: lerp(1.06, 1.18, eInOut(seg(t, 1.3, d))), cx: lerp(540, 860, eInOut(seg(t, 1.3, 2.2))), cy: lerp(960, 1150, eInOut(seg(t, 1.3, 2.2))), shake: t > 1.05 && t < 1.4 ? 6 : 0 }),
    draw: (t) => {
      const T2 = t + 2.13;
      let s = sunburst(540, 960, 20, '#3b3570', '#463f86', T2 * 10) + glow(540, 1000, 700, '#ff9a3c', .25 + .3 * seg(t, 1.0, 1.3)) +
        slotMachine(380, 1080, 1.05, T2, [2.13 + .15, 2.13 + .55, 2.13 + .95], 0) +
        dnaChar(860, 1500, .85, T2, { hi: t > 1.3 ? 6 : -1, wave: t > 1.1 });
      if (t > 1.05) { const r = rng(3); for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + (r() - .5) * 2.2, v = 600 + r() * 500, k = t - 1.05; s += circ(380 + Math.cos(a) * v * k, 950 + Math.sin(a) * v * k + 900 * k * k, 22, '#ffd23f', 5); } }
      if (t > 1.5) s += G(tr(860, 1200 - 480 + (6 - 5) * 70 + 70, pop(t, 1.5) * 1.0), rect(-150, -60, 300, 110, '#fff', 26) + text(0, 30, 'none', 'MC1R', RED_HAIR, 80)) + line(780, 1280 - 300, 860, 1360 - 300, 0);
      return s;
    },
  },
  // B007 — grille : 1 à 2 % de la planète
  {
    s: 16.32, sfx: [[0, 'whoosh', .5], [.1, 'pop', .5], [.3, 'pop', .5], [.5, 'pop', .5], [.7, 'pop', .5], [.9, 'pop', .5], [1.7, 'thud', .9], [1.75, 'sparkle', .8], [2.4, 'whoosh', .6]],
    cam: (t, d) => { const k = eInOut(seg(t, 2.4, 3.6)); return { z: lerp(1, 1.9, k), cx: 540, cy: lerp(960, 1000, k) }; },
    overlay: (t) => t > 1.75 ? G(tr(540, 1640, pop(t, 1.75, .45)), text(0, 0, OL, '1 à 2 %', RED_HAIR, 190)) : '',
    draw: (t) => {
      const hairs = ['#4a3428', '#1f1b1a', '#f1cf6b', '#8a5a3a', '#3b2a22', '#d9b26a'];
      const styles = ['short', 'long', 'curly', 'ponytail', 'side', 'spiky'];
      const skins = [SKIN, '#e0ac80', '#c98a5a', '#8d5a3b', SKIN, '#f5d3b3'];
      const r = rng(11);
      const dim = seg(t, 1.6, 1.9);
      let s = grad('#7d86c9', '#5f68ad') + glow(690, 1040, 300 + 30 * wave(t, 1.5), '#ffd27a', .9 * dim);
      for (let j = 0; j < 8; j++) for (let i = 0; i < 5; i++) {
        const x = 160 + i * 190, y = 330 + j * 175, red = (i === 2 && j === 4);
        const k = pop(t, .05 + j * .11 + i * .02);
        const o = red ? { hair: 'red', hairColor: RED_HAIR, freckles: true, skin: SKIN_PALE, shirt: '#3fa7a0', expr: t > 1.7 ? 'shock' : 'neutral' } :
          { hair: styles[Math.floor(r() * 6)], hairColor: hairs[Math.floor(r() * 6)], skin: skins[Math.floor(r() * 6)], shirt: ['#5b7bd6', '#6bbf73', '#a685c9', '#e8a3a3', '#7fb7c9'][Math.floor(r() * 5)], expr: 'neutral', seed: i + j };
        const p = person(Object.assign({ x: 0, y: 0, s: .38, armR: red && t > 1.75 ? [-60, -100] : [70, 80], bob: 0 }, o), t + i * .3);
        s += G(tr(x, y + 70 + (red ? hop(t - 1.7, 3, 10) : 0), k), red ? p : op(1 - dim * .6, p));
      }
      return s;
    },
  },
  // B008 — gros plan : "Et le premier qui va te déclarer la guerre…"
  {
    s: 20.48, enter: 'whip', sfx: [[.1, 'drum', .9], [.95, 'drum', .9], [1.75, 'drum', 1], [2.1, 'heartbeat', .8]],
    cam: (t, d) => ({ z: lerp(1, 1.18, eInCubic(t / d)), shake: [0.1, .95, 1.75].some(a => t > a && t < a + .15) ? 10 : 0 }),
    draw: (t) => {
      const heat = seg(t, 0, 2.7);
      return grad(shade('#8fd3ff', -.0), '#ffe2a8') + op(heat, grad('#ffb36b', '#ff7b54')) + glow(540, -100, 900, '#fff4b8', .4 + .5 * heat) +
        G(tr(540, 1350, 3.3), head({ hr: 100, hair: 'red', hairColor: RED_HAIR, freckles: true, skin: SKIN_PALE, expr: t < 1.7 ? 'worried' : 'scared', look: [0, -1], seed: 1 }, t)) +
        G(tr(540, 1850, 3.3), path('M-110 0Q-110 -60 -60 -70L60 -70Q110 -60 110 0Z', '#3fa7a0', 7)) +
        op(seg(t, 1.75, 1.85), emark(860, 760, 1.1 * pop(t, 1.75)));
    },
  },
  // B009 — contre-plongée : "c'est le soleil."
  {
    s: 23.22, flash: true, enter: 'none', sfx: [[0, 'flash_hit', 1], [0, 'boom', .8], [.5, 'sizzle', .4]],
    cam: (t, d) => ({ z: lerp(1.25, 1.0, eOutCubic(seg(t, 0, .5))), shake: 14 * (1 - seg(t, 0, .8)) }),
    draw: (t) => {
      let s = grad('#ff8b3d', '#ffcf6b') + glow(540, 650, 900, '#fff2a0', .8);
      // immeubles en contre-plongée
      s += path('M-100 1920L120 1180L380 1240L330 1920Z', '#c0563a', 6) + path('M760 1920L700 1220L980 1150L1200 1920Z', '#b04a33', 6) + path('M300 1920L380 1350L700 1330L780 1920Z', '#d8704a', 6);
      for (let i = 0; i < 4; i++) s += rect(170 + i * 10, 1300 + i * 140, 90, 60, '#ffd27a', 4, 4) + rect(800 - i * 8, 1330 + i * 140, 90, 60, '#ffd27a', 4, 4);
      s += sun(540, 700, 1.25 + wave(t, 2, .02), t, 'evil');
      return s;
    },
  },
  // B010 — plongée sur la plage : les potes bronzent
  {
    s: 24.34, sfx: [[0, 'waves', .8], [1.8, 'glint', .5], [2.6, 'sparkle', .5]],
    cam: (t, d) => ({ z: lerp(1.0, 1.12, eInOut(t / d)), r: lerp(-2, 2, t / d) }),
    draw: (t) => {
      const tan = seg(t, .2, 3.0);
      const sk = (base) => lerpColor(base, TAN, tan);
      let s = rect(-200, -200, 1480, 2400, '#f4d79a', 0, 0);
      const r = rng(4); for (let i = 0; i < 160; i++) s += circ(r() * 1200 - 60, r() * 2100 - 90, 3, '#e6c27c', 0);
      s += rect(-200, -200, 1480, 520, '#3ab0d6', 0, 0) + path(`M-200 320 ${Array.from({ length: 18 }, (_, i) => `Q${i * 90 - 155} ${300 + wave(t, .5, 20, i / 5)} ${i * 90 - 110} 320`).join(' ')} L1300 320`, 'none', 14, '#fff');
      s += towel(330, 1050, 300, 620, '#ff7b7b', '#ffc2c2', -6) + towel(760, 1100, 300, 620, '#6bc4e8', '#c2ecff', 5);
      s += G(tr(330, 1220, 1, -6), person(Object.assign({}, KID2, { x: 0, y: 0, s: 1.05, expr: 'cool', skin: sk(SKIN), armL: [200, 260], armR: [-20, -80], bob: 0, rot: 0 }), t));
      s += G(tr(760, 1270, 1, 5), person(Object.assign({}, BULLY, { hair: 'short', hairColor: '#1f1b1a', shirt: '#ffd23f', x: 0, y: 0, s: 1.05, expr: 'shadesGrin', skin: sk('#e0ac80'), armL: [120, 140], armR: [60, 40], bob: 0 }), t));
      // parasol vu du dessus
      s += G(tr(140, 1650, 1, t * 8), (() => { let p = ''; for (let i = 0; i < 8; i++) p += path(`M0 0L${f1(Math.cos(R(i * 45)) * 240)} ${f1(Math.sin(R(i * 45)) * 240)}A240 240 0 0 1 ${f1(Math.cos(R(i * 45 + 45)) * 240)} ${f1(Math.sin(R(i * 45 + 45)) * 240)}Z`, i % 2 ? '#fff' : '#ffb703', 6); return p; })());
      s += sunscreen(560, 1650, .9, 70);
      if (t > 1.8) s += sparkle(250, 900, .7 * pop(t, 1.8), '#fff') + sparkle(840, 960, .6 * pop(t, 2.1), '#fff');
      s += glow(1000, -100, 700, '#fff2a0', .5);
      return s;
    },
  },
  // B011 — plan moyen : peau sensible aux UV
  {
    s: 27.71, sfx: [[.4, 'zap', .8], [.9, 'zap', .8], [1.4, 'zap', .8], [1.9, 'zap', .8], [2.3, 'pop', .5]],
    cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d) }),
    draw: (t) => {
      const dodge = Math.sin(t * 7) * 60;
      let s = bgBeachSide(t) + glow(1000, 0, 800, '#fff2a0', .7) + sun(950, 150, .45, t, 'evil');
      // rayons UV
      for (let i = 0; i < 4; i++) {
        const t0 = .35 + i * .5, k = seg(t, t0, t0 + .35);
        if (t > t0 && t < t0 + .6) {
          const x0 = 900, y0 = 250, x1 = 540 + dodge * (i % 2 ? 1 : -1) + (i % 2 ? 130 : -130), y1 = 1050;
          const xm = lerp(x0, x1, k), ym = lerp(y0, y1, k);
          let d = `M${x0} ${y0}`; for (let j = 1; j <= 8; j++) { const q = j / 8 * k; d += `L${f1(lerp(x0, x1, q) + (j % 2 ? 25 : -25))} ${f1(lerp(y0, y1, q))}`; }
          s += op(1 - seg(t, t0 + .4, t0 + .6), path(d, 'none', 14, '#b46bff') + path(d, 'none', 5, '#f0d9ff')) + (k >= 1 ? impactStar(x1, y1, .4, '#e3c8ff') : '');
        }
      }
      s += hero({ x: 540 + dodge, y: 1620, s: 1.45, expr: 'scared', armL: [-130, -100], armR: [-50, -80], blush: 1, legL: [100 + dodge / 6, 95], legR: [80 + dodge / 6, 85], rot: dodge / 20 }, t);
      s += umbrella(540 + dodge * .9 - 10, 840, .55, '#5ec4f0', '#fff').replace('line(0, 0, 0, 420, 12)', '');
      return s;
    },
  },
  // B012 — profil : il oublie la crème solaire
  {
    s: 30.62, enter: 'whip', sfx: [[0, 'whistle', .8], [.1, 'steps', .5], [1.0, 'glint', .9], [1.2, 'pop', .6]],
    cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d) }),
    draw: (t) => {
      const hx = lerp(560, 950, t / 1.78);
      let s = bgBeachSide(t) + towel(380, 1420, 420, 140, '#ff7b7b', '#ffc2c2', 0);
      const sad = t > 1.0;
      s += G(tr(380, 1340), sunscreen(0, 0, 1.1, 0) + (sad ? path('M-20 -10Q0 -25 20 -10', 'none', 5) + circ(-14, -30, 5, OL, 0) + circ(14, -30, 5, OL, 0) + G(tr(-50, -40, 1, -30 - wave(t, 3, 25)), line(0, 0, -70, -40, 10)) : ''));
      if (sad) s += qmark(380, 1100, .7 * pop(t, 1.0), '#fff', -8);
      s += hero(Object.assign({ x: hx, y: 1560, s: 1.25, expr: 'happy', face: { mouth: 'o-small' }, flip: true }, walk(t, 2.2)), t);
      s += G(tr(hx - 90, 880 + wave(t, 1.5, 10)), `<text font-family="Fredoka" font-size="70" fill="${OL}">♪</text>`) + G(tr(hx - 160, 820 + wave(t, 1.2, 10, .5)), `<text font-family="Fredoka" font-size="54" fill="${OL}">♫</text>`);
      return s;
    },
  },
  // B013 — large : il rentre comme une écrevisse
  {
    s: 32.40, sfx: [[0, 'sizzle', 1], [.9, 'boing', .8], [1.4, 'pop', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
    draw: (t) => {
      const cx = lerp(1500, 830, eOutCubic(seg(t, .6, 1.4)));
      let s = bgStreet(t, '#ff9e7a', '#ffd8a8') + glow(540, 1300, 900, '#ff7b54', .25);
      s += rect(80, 900, 300, 520, '#8a5a3a', 10) + circ(330, 1180, 12, '#ffd23f', 4) + rect(60, 870, 340, 40, '#6b4528', 6);
      s += hero(Object.assign({ x: 470, y: 1690, s: 1.35, expr: 'pain', skin: '#ff6b55', burn: 0, ...walk(t, 1.4, 10), armL: [100, 100], armR: [80, 80] }), t) + steam(470, 1050, t, 1.2) + steam(560, 1200, t + .4, .8);
      s += crayfish(cx, 1580, .95, t) + op(seg(t, 1.4, 1.5), G(tr(cx - 60, 1390, pop(t, 1.4)), heart(0, 0, .6, '#ff5d73')));
      return s;
    },
  },
  // B014 — gros plan : À l'école, c'est pire
  {
    s: 34.70, sfx: [[0, 'school_bell', .8], [.6, 'thud', .5]],
    cam: (t, d) => ({ z: lerp(1.0, 1.1, t / d), cy: 1100 }),
    draw: (t) => {
      let s = bgClass(t) + desk(540, 1640, 1.8);
      s += G(tr(540, 1330, 2.2), head({ hr: 100, hair: 'red', hairColor: RED_HAIR, freckles: true, skin: SKIN_PALE, expr: 'sad', look: [0, .5], seed: 1 }, t));
      s += G(tr(540, 1620, 2.2), path('M-110 0Q-110 -60 -60 -70L60 -70Q110 -60 110 0Z', '#3fa7a0', 7));
      const k = eOutBack(seg(t, .3, .8));
      let rain = ''; for (let i = 0; i < 9; i++) { const yy = ((t * 900 + i * 97) % 300); rain += line(380 + i * 40, 760 + yy, 375 + i * 40, 790 + yy, 7, '#7fb4e6'); }
      s += op(seg(t, .3, .5), G(tr(540, 640, k), cloud(0, 0, 1.6, '#7b8494', 6)) + rain);
      return s;
    },
  },
  // B015 — contre-plongée : "Poil de carotte !"
  {
    s: 36.46, enter: 'drop', sfx: [[0, 'whoosh', .6], [.15, 'boing', .9], [.45, 'pop', .6], [.7, 'pop', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 3 }),
    draw: (t) => sunburst(540, 1100, 22, '#ffb04a', '#ffc46b', t * 30) +
      person(Object.assign({}, BULLY, { x: 540, y: 2250, s: 2.5, expr: 'mock', face: { mouth: talkUntil(t, 0, 1.0) ? 'laugh' : 'laugh' }, armR: [-20, -15], armL: [140, 60], headTilt: wave(t, 4, 4) }), t) +
      G(tr(lerp(-200, 240, eOutBack(seg(t, .4, .7))), 600, 1.0, wave(t, 2, 20)), carrot(0, 0, 1.1)) +
      G(tr(lerp(1300, 860, eOutBack(seg(t, .65, .95))), 520, 1.0, -30 + wave(t, 2, 20)), carrot(0, 0, .9)) +
      motionLines(890, 1080, 3, 90, 0),
  },
  // B016 — plongée : "T'as pris feu ?" Magnifique.
  {
    s: 37.82, enter: 'whip', sfx: [[0, 'fire', .6], [.1, 'spray', .9], [.6, 'hmm', .4]],
    cam: (t, d) => ({ z: lerp(1.05, 1.0, t / d) }),
    draw: (t) => {
      let s = rect(-100, -100, 1300, 2200, '#c99a68', 0, 0);
      for (let i = 0; i < 10; i++) s += line(-100, i * 220, 1300, i * 220 + 100, 4, 'rgba(0,0,0,.07)');
      s += hero({ x: 470, y: 1620, s: 1.45, expr: 'deadpan', armL: [110, 95], armR: [70, 85], look: [0, -.6] }, t);
      s += G(tr(470, 1620 - 1.45 * (64 + 150 + 78)), flames(-150, 0, 300, 160, t, 7));
      s += person(Object.assign({}, KID2, { x: 880, y: 1700, s: 1.15, expr: 'shock', face: { mouth: talkUntil(t, 0, .5) ? 'talk' : 'o' }, armL: [190, 200], armR: [170, 190], holdL: extinguisher(0, 0, .55, -60) }), t);
      const r = rng(9); for (let i = 0; i < 26; i++) { const k = ((t * 1.6 + r()) % 1); s += circ(lerp(700, 470 + (r() - .5) * 200, k), lerp(1270, 1080 + (r() - .5) * 160, k), 18 + r() * 18, 'rgba(255,255,255,.9)', 3, '#cfd8dc'); }
      return s;
    },
  },
  // B017 — saut temporel : Dix ans d'éducation nationale
  {
    s: 38.83, flash: true, sfx: [[0, 'clock_fast', .9], [.1, 'whoosh', .5], [.7, 'whoosh', .5], [1.3, 'whoosh', .5]],
    cam: (t, d) => ({ z: lerp(1, 1.1, t / d), r: wave(t, .5, 1.5) }),
    draw: (t) => {
      let s = sunburst(540, 900, 16, '#4e8f6e', '#5aa07b', -t * 40) + wallClock(540, 680, 230, t, 60);
      const n = Math.min(10, 1 + Math.floor(t * 5.5));
      for (let i = 1; i <= n; i++) {
        const k = seg(t, (i - 1) / 5.5, (i - 1) / 5.5 + .45);
        if (i < n) s += op(1 - k, calendarPage(540 + k * 700 * (i % 2 ? 1 : -1), 1350 - k * 500, 1.3, k * 90 * (i % 2 ? 1 : -1), i));
        else s += calendarPage(540, 1350, 1.3 * (1 + .1 * (1 - seg(t, (i - 1) / 5.5, (i - 1) / 5.5 + .15))), 0, i);
      }
      return s;
    },
  },
  // B018 — profil : pour produire deux blagues
  {
    s: 40.81, sfx: [[.1, 'crickets', .9], [.4, 'whoosh', .4], [.2, 'pop', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
    draw: (t) => {
      let s = bgClass(t);
      s += person(Object.assign({}, BULLY, { x: 540, y: 1650, s: 1.5, expr: 'proud', armL: [-160, -150], armR: [-20, -30], holdL: G(tr(0, -80, pop(t, .1)), rect(-90, -90, 180, 180, '#fff', 14) + carrot(0, 0, .45, 20)), holdR: G(tr(0, -80, pop(t, .25)), rect(-90, -90, 180, 180, '#fff', 14) + G(tr(-80, 60), flames(0, 0, 160, 120, t, 4))) }), t);
      s += G(tr(lerp(-200, 1300, seg(t, .3, 1.39)), 1620 + hop(t, 2.5, 60), 1, t * 400), tumbleweed(0, 0, 1, 0));
      s += cricket(860, 1520, .8, t);
      return s;
    },
  },
  // B019 — large : et comme si ça suffisait pas (les têtes se tournent)
  {
    s: 42.20, enter: 'whip', sfx: [[0, 'whoosh', .5], [.5, 'pop', .6], [.75, 'pop', .6], [1.0, 'pop_hi', .7], [1.2, 'steps', .4]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
    draw: (t) => {
      let s = bgStreet(t);
      const ppl = [[150, 1560, 'long', '#1f1b1a', '#ef8fa3', .5], [870, 1580, 'short', '#8a5a3a', '#7fb7c9', .75], [960, 1800, 'curly', '#4a3428', '#a685c9', 1.0], [120, 1830, 'bald', '#9a9a9a', '#6bbf73', .6]];
      for (const [x, y, h, hc, sh, tt] of ppl) {
        const turned = t > tt;
        s += person({ x, y, s: .95, age: 'adult', hair: h, hairColor: hc, shirt: sh, expr: turned ? 'shock' : 'neutral', look: turned ? [x < 540 ? 1 : -1, 0] : [x < 540 ? -1 : 1, 0], seed: x }, t);
        if (turned) s += emark(x, y - 470, .55 * pop(t, tt), '#ff4d4d', x < 540 ? 10 : -10);
      }
      s += hero(Object.assign({ x: lerp(380, 640, t / 1.79), y: 1700, s: 1.2, expr: 'neutral' }, walk(t, 2)), t);
      return s;
    },
  },
  // B020 — gros plan : les gens veulent toucher tes cheveux
  {
    s: 43.99, sfx: [[.35, 'squeak', .9], [.6, 'squeak', .9], [.85, 'squeak', .9], [1.1, 'squeak', .9], [1.35, 'boing', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 1050 }),
    draw: (t) => {
      const sq = 1 - .06 * Math.abs(Math.sin(t * 14)) * seg(t, .35, .5);
      let s = grad('#ffe0b8', '#ffc996') + glow(540, 900, 700, '#fff', .4);
      s += G(tr(540, 1320, 2.6), G(`scale(1 ${sq})`, head({ hr: 100, hair: 'red', hairColor: RED_HAIR, freckles: true, skin: SKIN_PALE, expr: 'annoyed', seed: 1 }, t)));
      s += G(tr(540, 1700, 2.6), path('M-110 60Q-110 -60 -60 -70L60 -70Q110 -60 110 60Z', '#3fa7a0', 7));
      const pat = k => wave(t, 3.5, 25, k);
      s += hand(lerp(-300, 300, eOutBack(seg(t, .2, .5))) + pat(0), 900 + pat(.3), 1.1, 20, '#ef8fa3', '#e0ac80');
      s += G(tr(lerp(1380, 780, eOutBack(seg(t, .4, .7))) - pat(.5), 820 + pat(.1)) + ' scale(-1 1)', hand(0, 0, 1.1, 20, '#5b7bd6', SKIN));
      s += G(tr(540 + pat(.7), lerp(-300, 520, eOutBack(seg(t, .6, .9))), 1, 90), hand(0, 0, 1.0, 0, '#6bbf73', '#c98a5a'));
      s += G(tr(lerp(1380, 900, eOutBack(seg(t, .9, 1.2))), 1100 + pat(.9)) + ' scale(-1 1)', hand(0, 0, 1.0, -10, '#a685c9', '#8d5a3b'));
      return s;
    },
  },
  // B021 — contre-plongée : Pokémon légendaire (carte rare + photos)
  {
    s: 45.97, flash: true, sfx: [[0, 'magic', 1], [.5, 'shutter', .9], [.8, 'shutter', .9], [1.15, 'shutter', .9], [1.5, 'shutter', .9], [1.6, 'sparkle', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), r: wave(t, .4, 1.5) }),
    draw: (t) => {
      let s = sunburst(540, 900, 24, '#2c2a5a', '#3b3778', t * 20) + glow(540, 900, 700, '#ffd23f', .5);
      const card = rareCard(0, 0, 1, t, G(tr(0, 80), hero({ x: 0, y: 0, s: .95, expr: 'wow', armL: [-150, -120], armR: [-30, -60] }, t)) + `<clipPath id="cc"><rect x="-220" y="-310" width="440" height="400"/></clipPath>`);
      s += G(tr(540, 960 + wave(t, .8, 15), lerp(.6, 1.15, eOutBack(seg(t, 0, .5))), wave(t, .5, 4)), card);
      for (let i = 0; i < 6; i++) s += sparkle(540 + Math.cos(t * 1.5 + i) * 420, 960 + Math.sin(t * 1.5 + i) * 520, .6 + .3 * Math.sin(t * 5 + i), '#fff3a0');
      // téléphones en bas (contre-plongée)
      const ph = [[200, 1780, -15, .5], [540, 1830, 0, .8], [880, 1780, 15, 1.15]];
      for (const [x, y, r, tt] of ph) s += G(tr(x, y + 40 * (1 - eOutCubic(seg(t, tt - .3, tt))), 1, r), hand(0, 120, .8, -90, '#5b7bd6') + phone(0, -40, .9, 0) + op(1 - seg(t, tt, tt + .15), circ(0, -40, 120, '#fff', 0)));
      if ([.5, .8, 1.15, 1.5].some(a => t > a && t < a + .06)) s += `<rect width="1080" height="1920" fill="#fff" opacity=".5"/>`;
      return s;
    },
  },
  // B022 — plongée : "Mais attends, il y a plus bizarre." (scratch / arrêt sur image)
  {
    s: 48.14, enter: 'none', sfx: [[0, 'scratch', 1], [.9, 'pop', .6]],
    cam: (t, d) => ({ z: lerp(1.15, 1.0, eOutCubic(seg(t, 0, .4))), r: lerp(-6, 0, eOutCubic(seg(t, 0, .4))) }),
    draw: (t) => {
      let s = rect(-100, -100, 1300, 2200, '#d9d2c3', 0, 0);
      for (let i = 0; i < 14; i++) s += line(-100, i * 160 + (t * 40 % 160), 1300, i * 160 + (t * 40 % 160), 3, 'rgba(0,0,0,.05)');
      s += radial(540, 1100, 900, 'rgba(255,255,255,.6)', '#d9d2c3', 0);
      s += hero({ x: 540, y: 1700, s: 1.6, expr: t < .5 ? 'shock' : 'confused', look: [0, -1], armR: t > .8 ? [-70, -95] : [70, 85], armL: [110, 95] }, t);
      if (t > .9) s += G(tr(540 + 1.6 * 100, 1700 - 1.6 * 420), op(1, sparkle(0, -40, .4 * pop(t, .9), '#fff')));
      s += op(Math.floor(t * 3) % 2 ? 1 : .2, rect(80, 260, 34, 110, '#fff', 4, 0) + rect(134, 260, 34, 110, '#fff', 4, 0));
      s += qmark(820, 760, .8 * pop(t, 1.0), RED_HAIR, 10);
      return s;
    },
  },
  // B023a — "Certaines études suggèrent même…" (preuve : la courbe)
  {
    s: 50.42, enter: 'whip', sfx: [[0, 'whoosh', .5], [.4, 'pop', .5], [.6, 'pop', .5], [.8, 'pop', .5], [1.05, 'pop_hi', .8], [1.4, 'hmm', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
    draw: (t) => {
      let s = grad('#eef6f8', '#d9eaee') + frame(820, 260, 180, 220, '#ffb3b3') + floor(1450, '#cfdde2', '#bccdd3');
      // tableau d'étude
      s += G(tr(360, 900, 1.0, -3), rect(-260, -300, 520, 600, '#fff', 16) + rect(-60, -330, 120, 60, '#999', 10) + line(-200, 200, 200, 200, 6) + line(-200, 200, -200, -200, 6) +
        [['#9aa7b5', 120, .4], ['#9aa7b5', 150, .6], ['#9aa7b5', 110, .8], [RED_HAIR, 340, 1.05]].map(([c, h, tt], i) => { const k = eOutBack(seg(t, tt, tt + .3)); return rect(-170 + i * 95, 200 - h * k, 70, h * k, c, 6, 5); }).join(''));
      s += person(Object.assign({}, DOC, { x: 780, y: 1720, s: 1.25, expr: t < 1.05 ? 'neutral' : 'shock', look: [-1, 0], armL: [200, 230], armR: [70, 85] }), t);
      if (t > 1.05) s += emark(760, 870, .7 * pop(t, 1.05)) + sparkle(470, 520, .6 * pop(t, 1.1));
      return s;
    },
  },
  // B023b — "…que les roux réagissent différemment à certains anesthésiants."
  {
    s: 52.60, enter: 'whip', sfx: [[0, 'ecg_beep', .7], [.75, 'ecg_beep', .7], [1.5, 'ecg_beep', .7], [2.25, 'ecg_beep', .7], [.9, 'hmm', .7], [1.7, 'boing', .7], [2.0, 'pop', .5]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
    draw: (t) => {
      let s = bgOR(t) + ecg(700, 560, 300, 160, t);
      s += hospitalBed(470, 1470, 1.1);
      s += G(tr(330, 1330, 1, -90), head({ hr: 95, hair: 'red', hairColor: RED_HAIR, freckles: true, skin: SKIN_PALE, expr: t < 1.4 ? 'neutral' : 'smug', look: [1, 0], seed: 1 }, t)) + path('M420 1280Q600 1250 800 1290L800 1400L420 1400Z', '#9fd6e6', 6);
      const big = 1 + seg(t, 1.6, 2.0) * .8;
      s += person(Object.assign({}, DOC, { x: 860, y: 1830, s: 1.15, mask: true, cap: '#7cc4cf', expr: t < 1.0 ? 'neutral' : 'confused', face: { mouth: 'flat' }, look: [-1, 0], armL: [200, 180], armR: [100, 110], holdL: syringe(0, 0, .5 * big, -90) }), t);
      if (t > .9) s += qmark(950, 860, .7 * pop(t, .9), '#fff', 12);
      s += op(seg(t, .3, .5), G(tr(330, 1180), path('M-10 0Q-30 -30 0 -50', 'none', 0)));
      return s;
    },
  },
  // B024 — profil : "Oui. Même chez le médecin, ton ADN veut se faire remarquer."
  {
    s: 55.30, sfx: [[0, 'thud', .5], [.5, 'tada', .9], [.6, 'magic', .6], [2.2, 'sparkle', .6], [2.8, 'pop', .5]],
    cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
    draw: (t) => {
      let s = bgOR(t) + op(seg(t, .4, .7), glow(540, 900, 600, '#ffd23f', .55));
      s += hospitalBed(470, 1500, 1.1);
      s += G(tr(330, 1360, 1, -90), head({ hr: 95, hair: 'red', hairColor: RED_HAIR, freckles: true, skin: SKIN_PALE, expr: 'embarrassed', look: [0, -1], seed: 1 }, t)) + path('M420 1310Q600 1280 800 1320L800 1430L420 1430Z', '#9fd6e6', 6);
      const k = eOutBack(seg(t, .4, .9));
      s += G(tr(540, lerp(1500, 1180, k), k), dnaChar(0, 0, .75, t, { shades: true, wave: true, hi: 6, rot: wave(t, 1.8, 8) }));
      if (t > .6) for (let i = 0; i < 5; i++) s += sparkle(540 + Math.cos(t * 2 + i * 1.3) * 300, 900 + Math.sin(t * 2 + i * 1.3) * 300, .5, '#fff3a0');
      s += person(Object.assign({}, DOC, { x: 900, y: 1800, s: 1.15, expr: t < 1.5 ? 'shock' : 'confused', look: [-1, -.5], armL: [-120, -60], armR: [70, 85] }), t);
      return s;
    },
  },
  // B025 — large : Et puis tu grandis
  {
    s: 59.10, enter: 'whip', sfx: [[0, 'whoosh_up', .8], [.5, 'pop', .7], [1.0, 'pop_hi', .8]],
    cam: (t, d) => ({ z: lerp(1.04, 1.0, t / d) }),
    draw: (t) => {
      let s = grad('#fbeedd', '#f3dcc0') + windowFrame(640, 330, 280, 320) + plant(920, 1560, 1.1) + floor(1560, '#d7b48c', '#c49c70');
      const st = t < .5 ? 0 : t < 1.0 ? 1 : 2;
      const k = pop(t, st * .5, .3);
      s += doorFrame(330, 1560, 1100, st + 1);
      if (st === 0) s += hero({ x: 540, y: 1580, s: 1.3, expr: 'neutral' }, t);
      if (st === 1) s += G(tr(540, 1580, 1, 0), G(`scale(${lerp(.8, 1, k)} ${lerp(.8, 1, k)})`, person({ age: 'adult', hair: 'red', hairColor: RED_HAIR, freckles: true, skin: SKIN_PALE, shirt: '#3fa7a0', pants: '#35425a', s: 1.0, expr: 'happy', seed: 1 }, t)));
      if (st === 2) s += G(tr(540, 1580, 1, 0), G(`scale(${lerp(.85, 1, k)} ${lerp(.85, 1, k)})`, person({ age: 'adult', hair: 'red', hairColor: RED_HAIR, freckles: true, skin: SKIN_PALE, shirt: '#2f6f8f', pants: '#2a2f3a', s: 1.22, expr: 'cool', armL: [130, 60], armR: [50, 120], seed: 1 }, t)));
      s += op(1 - seg(t, st * .5, st * .5 + .3), G(tr(540, 900), sparkle(-200, 0, .6) + sparkle(220, -80, .5)));
      return s;
    },
  },
  // B026 — gros plan : les mêmes personnes qui se moquaient de toi
  {
    s: 60.71, sfx: [[0, 'whoosh', .5], [.2, 'rewind', .8]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 1100 }),
    draw: (t) => {
      let s = grad('#e7eef6', '#cfdbe8') + glow(540, 1200, 700, '#fff', .4);
      s += G(tr(540, 1380, 2.6), head(Object.assign({}, BULLY_AD, { hr: 100, expr: 'embarrassed', look: [-.6, -.3], beard: false }), t));
      s += G(tr(540, 1760, 2.6), path('M-110 60Q-110 -60 -60 -70L60 -70Q110 -60 110 60Z', BULLY_AD.shirt, 7));
      const k = eOutBack(seg(t, .2, .6));
      s += G(tr(300, 520, k), bubble(0, 0, 440, 360, `<g filter="url(#sep)">${person(Object.assign({}, BULLY, { x: 0, y: 110, s: .55, expr: 'mock', armR: [-20, -15] }), t)}</g>`)) +
        `<defs><filter id="sep"><feColorMatrix type="matrix" values=".39 .77 .19 0 0 .35 .69 .17 0 0 .27 .53 .13 0 0 0 0 0 1 0"/></filter></defs>`;
      return s;
    },
  },
  // B027 — contre-plongée : chez le coiffeur avec une photo
  {
    s: 62.46, enter: 'whip', sfx: [[0, 'whoosh', .5], [.4, 'pop', .6], [.9, 'snip', .9], [1.3, 'snip', .9], [1.8, 'glint', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d) }),
    draw: (t) => {
      let s = bgSalon(t) + chair(380, 1650, 1.3);
      s += person(Object.assign({}, BULLY_AD, { x: 380, y: 1760, s: 1.35, expr: 'happy', armR: [-40, -80], armL: [110, 80], holdR: phone(0, -100, .9 * pop(t, .3), 10, G(tr(0, -10, .32), head({ hr: 100, hair: 'red', hairColor: RED_HAIR, freckles: true, skin: SKIN_PALE, expr: 'cool' }, t))), legL: [60, 90], legR: [80, 90] }), t) + G(tr(380, 1650, 1.3), rect(-160, -40, 320, 90, '#3d4b63', 30));
      s += person(Object.assign({}, STYLIST, { x: 850, y: 1800, s: 1.3, expr: t < 1.2 ? 'neutral' : 'wow', look: [-1, -.4], armL: [190, 220], armR: [70, 60], holdR: scissors(0, 0, .5, -60, Math.abs(Math.sin(t * 9))) }), t);
      return s;
    },
  },
  // B028 — plongée : "Je voudrais exactement ce roux naturel."
  {
    s: 64.65, sfx: [[0, 'whoosh', .4], [.3, 'spray', .5], [.9, 'whoosh', .4], [1.5, 'whoosh', .4], [2.0, 'sparkle', .8]],
    cam: (t, d) => ({ z: lerp(1.05, 1.12, t / d) }),
    draw: (t) => {
      const k = seg(t, .3, 2.0);
      let s = rect(-100, -100, 1300, 2200, '#e7e2dc', 0, 0);
      for (let i = 0; i < 10; i++) s += line(i * 140 - 100, -100, i * 140 + 200, 2100, 4, 'rgba(0,0,0,.06)');
      s += G(tr(470, 1250), ell(0, 0, 330, 360, '#2f3b4e'));
      s += person(Object.assign({}, BULLY_AD, { x: 470, y: 1650, s: 1.35, hairColor: lerpColor('#3a2a22', RED_HAIR, eInOut(k)), expr: t < 2.0 ? 'talk' : 'love', look: [0, -1], armL: [110, 95], armR: [70, 85] }), t);
      s += G(tr(470, 1650), path('M-250 -230L250 -230L320 0L-320 0Z', '#e9e4ee', 6).replace('/>', ' opacity=".95"/>'));
      s += person(Object.assign({}, STYLIST, { x: 870, y: 1720, s: 1.2, expr: 'calm', look: [-1, -.5], armL: [215 + wave(t, 2.5, 12), 200 + wave(t, 2.5, 20)], armR: [70, 85], holdL: brush(0, 0, .6, -110) }), t);
      s += bowl(880, 1830, 1.0);
      if (t > 2.0) s += sparkle(320, 850, .7 * pop(t, 2.0), '#fff') + sparkle(620, 790, .5 * pop(t, 2.1), '#fff');
      return s;
    },
  },
  // B029 — 180 euros
  {
    s: 67.12, flash: true, enter: 'none', sfx: [[0, 'kaching', 1], [.35, 'flutter', .8], [.4, 'boing', .5]],
    cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(seg(t, 0, .3))), shake: 8 * (1 - seg(t, 0, .4)) }),
    draw: (t) => {
      let s = sunburst(540, 1000, 20, '#7cc47c', '#8fd18a', t * 25);
      s += person(Object.assign({}, BULLY_AD, { x: 600, y: 1850, s: 1.4, hairColor: RED_HAIR, expr: 'shock', armL: [-140, -110], armR: [-40, -70] }), t);
      s += G(tr(300, 950, eOutBack(seg(t, 0, .3)), -8), cardTerminal(0, 0, 1.4, 0, '180 €'));
      const fk = seg(t, .3, 1.1);
      s += wallet(lerp(780, 1100, fk), lerp(1150, 450, fk), .8, 10, t, 1);
      for (let i = 0; i < 4; i++) s += bill(lerp(760, 1000 + i * 40, fk), lerp(1150, 600 - i * 70, fk), .6, i * 30 + t * 200);
      return s;
    },
  },
  // B030 — profil : Donc résumons
  {
    s: 68.23, enter: 'whip', sfx: [[0, 'whoosh', .8], [.45, 'thud', .7]],
    cam: (t, d) => ({ z: 1.0 }),
    draw: (t) => {
      const k = eOutBack(seg(t, 0, .45));
      let s = rect(-100, -100, 640, 2200, '#bfe6e3', 0, 0) + rect(540, -100, 640, 2200, '#ffd9b8', 0, 0) + floor(1500, 'rgba(0,0,0,.08)', 'rgba(0,0,0,.12)');
      s += hero({ age: 'adult', x: lerp(-200, 290, k), y: 1580, s: 1.15, shirt: '#2f6f8f', pants: '#2a2f3a', expr: 'neutral', look: [1, 0], flip: false }, t);
      s += person(Object.assign({}, BULLY_AD, { x: lerp(1280, 790, k), y: 1580, s: 1.15, hairColor: RED_HAIR, expr: 'smug', look: [-1, 0] }), t);
      s += G(tr(540, lerp(-1000, 960, eOutCubic(seg(t, .1, .45)))), rect(-10, -1000, 20, 2000, '#fff', 0, 6));
      s += G(tr(540, 960, pop(t, .45)), impactStar(0, 0, .5, '#fff'));
      return s;
    },
  },
  // B031 — large : quand tu nais avec, c'est une blague (scène de stand-up + ba-dum-tss)
  {
    s: 69.37, sfx: [[0, 'whoosh', .4], [.2, 'thud', .5], [1.15, 'rimshot', 1]],
    cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > 1.6 && t < 1.8 ? 5 : 0 }),
    draw: (t) => {
      let s = rect(-100, -100, 1300, 2200, '#2a1d2e', 0, 0);
      // rideaux
      for (let i = 0; i < 6; i++) s += path(`M${-100 + i * 60} -100Q${-60 + i * 60} 900 ${-100 + i * 60} 1500`, 'none', 40, i % 2 ? '#b8263a' : '#9e1f31') + path(`M${1180 - i * 60} -100Q${1140 - i * 60} 900 ${1180 - i * 60} 1500`, 'none', 40, i % 2 ? '#b8263a' : '#9e1f31');
      s += `<path d="M540 -100L260 1500L820 1500Z" fill="rgba(255,240,180,.25)"/>` + ell(540, 1500, 300, 60, 'rgba(255,240,180,.35)', 0);
      s += rect(-100, 1500, 1300, 120, '#6b4528', 0, 6);
      s += hero({ x: 540, y: 1520, s: 1.3, expr: 'deadpan', armR: [-40, -100], holdR: G(tr(0, 0), rect(-12, -10, 24, 60, '#333', 6) + circ(0, -30, 26, '#666')) }, t);
      // batterie
      s += G(tr(900, 1500), ell(0, -40, 90, 30, '#ddd') + rect(-90, -40, 180, 90, '#e2463a', 0, 6) + ell(0, 50, 90, 30, '#ddd') + G(tr(-150, -160, 1, t > 1.55 && t < 1.7 ? -10 : 0), ell(0, 0, 90, 18, '#ffd23f') + line(0, 0, 0, 170, 6)));
      // public
      const r = rng(5);
      for (let i = 0; i < 7; i++) { const x = 70 + i * 160, b = t > 1.5 ? -Math.abs(Math.sin(t * 9 + i)) * 20 : 0; s += G(tr(x, 1880 + b), path('M-80 60C-80 -40 80 -40 80 60Z', '#120c14', 0) + circ(0, -60, 60, '#120c14', 0)); }
      if (t > 1.5) s += G(tr(540, 700, pop(t, 1.5)), text(0, 0, OL, 'BA-DUM-TSS', '#ffd23f', 110));
      return s;
    },
  },
  // B032 — gros plan : quand eux paient pour l'avoir…
  {
    s: 71.55, enter: 'whip', sfx: [[0, 'whoosh', .5], [.2, 'coins', .9], [.8, 'coins', .8], [.5, 'kaching', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 1100 }),
    draw: (t) => {
      let s = sunburst(540, 1100, 18, '#7cc47c', '#8fd18a', t * 20);
      for (let i = 0; i < 12; i++) { const k = ((t * .9 + i / 12) % 1); s += bill(lerp(540, 540 + (i % 2 ? 1 : -1) * (150 + i * 30), k), lerp(1500, 200, k), .9, i * 40 + t * 300); }
      s += G(tr(540, 1350, 2.4), head(Object.assign({}, BULLY_AD, { hr: 100, hairColor: RED_HAIR, expr: 'proud' }), t));
      s += G(tr(540, 1720, 2.4), path('M-110 60Q-110 -60 -60 -70L60 -70Q110 -60 110 60Z', BULLY_AD.shirt, 7));
      s += wallet(540, 1720, 1.2, 0, t, 0);
      return s;
    },
  },
  // B033 — PAYOFF contre-plongée : c'est une tendance
  {
    s: 73.31, flash: true, enter: 'none', sfx: [[0, 'magic', 1], [0, 'boom', .5], [.2, 'shutter', .8], [.45, 'shutter', .8], [.7, 'shutter', .8], [1.0, 'sparkle', .6]],
    cam: (t, d) => ({ z: lerp(1.12, 1.0, eOutCubic(seg(t, 0, .6))) }),
    draw: (t) => {
      let s = sunburst(540, 1100, 22, '#ff8a3d', '#ffa45c', t * 20) + glow(540, 1000, 800, '#fff2a0', .5);
      const fans = [[150, 1500, .8], [930, 1500, .8], [330, 1420, .7], [760, 1420, .7]];
      for (const [x, y, sc] of fans) s += person({ x, y, s: sc, age: 'adult', hair: x < 540 ? 'long' : 'spiky', hairColor: RED_HAIR, shirt: x < 540 ? '#ef8fa3' : '#5b7bd6', expr: 'shadesGrin', armL: [130, 60], armR: [50, 120], seed: x }, t);
      s += person({ x: 540, y: 1880, s: 1.55, age: 'adult', hair: 'red', hairColor: RED_HAIR, freckles: true, skin: SKIN_PALE, shirt: '#2f6f8f', pants: '#2a2f3a', expr: 'cool', armL: [130, 60], armR: [-40, -150], seed: 1 }, t);
      for (let i = 0; i < 6; i++) s += sparkle(540 + Math.cos(t * 2 + i) * 430, 900 + Math.sin(t * 2 + i) * 380, .6, '#fff');
      if ([.2, .45, .7].some(a => t > a && t < a + .06)) s += `<rect x="-100" y="-100" width="1300" height="2200" fill="#fff" opacity=".6"/>`;
      return s;
    },
  },
];

function lerpColor(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map(s => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, k)));
  return '#' + ((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2]).toString(16).slice(1);
}
