// ============================================================
//  "Pourquoi c'est horrible de naître mante religieuse ?" — 35 plans
//  Voix : assets/voix.wav (63,92 s)
//  RÈGLE DE CADRAGE : visages / infos clés entre y≈380 et y≈1150.
//  Sous 1250 px : décor uniquement (zone sous-titres + UI TikTok).
// ============================================================
const TOTAL = 64.6;
const GROUND = 1200;          // ligne de sol / branche principale

// ---------- décors ----------
function cityFaint() {
  let s = '';
  const bs = [[-40, 260, 520], [200, 200, 640], [380, 240, 470], [600, 220, 700], [800, 300, 560]];
  for (const [x, w, h] of bs) { s += rect(x, GROUND - 80 - h, w, h, 'rgba(160,190,205,.35)', 6, 0); for (let j = 0; j < Math.floor(h / 90); j++) s += rect(x + 30, GROUND - 40 - h + j * 90, w - 60, 30, 'rgba(255,255,255,.25)', 4, 0); }
  return s;
}
function bgGarden(t, top = '#e2f4e8', bot = '#c9e9d4') {
  return grad(top, bot) + cityFaint() + bgLeaves(t, 'rgba(110,180,110,.22)') + grassBed(GROUND + 120, t);
}
function bgDusk(t) {
  return grad('#5b4b8a', '#f19a7b') + cityFaint().replace(/rgba\(160,190,205,\.35\)/g, 'rgba(60,40,80,.45)') + grassBed(GROUND + 120, t, '#3d5a3a', '#4f7448');
}
function bgNight(t) {
  let s = grad('#1f2447', '#3d3466');
  for (let i = 0; i < 12; i++) { const x = 60 + i * 90, y = 260 + Math.sin(i * 1.3) * 40; s += line(x, y - 30, x + 90, y + Math.sin(i * 1.3 + 1.3) * 40 - 30, 3, '#555'); s += circ(x, y, 14, (Math.floor(t * 3) + i) % 3 ? '#ffe08a' : '#fff4c8', 3); }
  return s + glow(540, 300, 600, '#ffd27a', .18) + grassBed(GROUND + 120, t, '#2c4a35', '#3a5e40');
}
function rays(t, c1, c2, cx = 540, cy = 760, n = 20) { return sunburst(cx, cy, n, c1, c2, t * 15); }
function bird(x, y, s, t, o = {}) {
  const fl = wave(t, 4, 18);
  return G(tr(x, y, s, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''),
    path(`M-20 -10Q-80 ${-70 + fl} -120 ${-30 + fl}Q-70 -10 -20 10Z`, '#3f7fd6', SW) +
    ell(0, 0, 90, 75, '#5b9cf0') + ell(20, 25, 50, 40, '#cfe6ff', 0) + path('M80 -10L140 5L80 20Z', '#ffb703', 6) +
    circ(45, -20, 14, '#fff', 5) + circ(49 + (o.look || 0) * 4, -20, 6, OL, 0) + path('M-60 70L-50 100M-20 75L-15 105', 'none', 6, '#ffb703'));
}
function hearts(t, cx, cy, n = 6, spread = 220, seed = 3) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const k = (t * .7 + r()) % 1; s += op(1 - k, heart(cx + (r() - .5) * spread, cy - k * 300, .5 + r() * .4)); }
  return s;
}
function crumbs(t, cx, cy, seed = 4) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < 12; i++) { const k = (t * 1.4 + r()) % 1, a = -Math.PI / 2 + (r() - .5) * 2.6, v = 260 + r() * 200; s += circ(cx + Math.cos(a) * v * k, cy + Math.sin(a) * v * k + 500 * k * k, 9 + r() * 8, r() > .5 ? M_GREEN : '#c9e9a8', 4); }
  return s;
}
function pauseBars(t) { return op(Math.floor(t * 3) % 2 ? 1 : .25, rect(90, 300, 34, 110, '#fff', 4, 0) + rect(144, 300, 34, 110, '#fff', 4, 0)); }
function bigText(lines, t, t0 = 0, y0 = 430, col = '#fff', size = 120, gap = 130) {
  return lines.map((l, i) => G(tr(540, y0 + i * gap, pop(t, t0 + i * .12) * (1 + wave(t, 2, .02))), text(0, 0, OL, l, Array.isArray(col) ? col[i] : col, Array.isArray(size) ? size[i] : size))).join('');
}
const HERO = { seed: 1 };
const neck = (x, y, len, w, c) => limb(x, 2100, -90, 2100 - y, 0, 0, c, 95).svg + G(tr(x, y + 330, 2.0), path('M-70 0L-40 -110L-5 -40M70 0L40 -110L5 -40', 'none', 22 + SW * 2 - 2, OL) + path('M-70 0L-40 -110L-5 -40M70 0L40 -110L5 -40', 'none', 22, c));
const FEM = { female: true, seed: 4 };

// ============================================================
const SCENES = [
  // B001 — HOOK
  {
    s: 0, enter: 'none', sfx: [[0, 'boom', .7], [.05, 'pop', .6], [.35, 'pop', .6], [.7, 'pop_hi', .8], [1.2, 'heartbeat', .7], [1.9, 'heartbeat', .7]],
    cam: (t, d) => ({ z: lerp(1, 1.06, eInOut(t / d)), shake: 1.5 }),
    draw: (t) => rays(t, '#5e2a52', '#6d3360', 540, 900) + glow(540, 900, 800, '#ff6fa8', .3) +
      mantis(Object.assign({}, FEM, { x: 960, y: 1600, s: 2.0, color: '#2c3a2a', expr: 'hungry', arms: 'up', spikes: true, lashes: false, lipstick: false, bow: false, bob: 0 }), t) +
      branch(-100, GROUND + 40, 1180, GROUND, 50) +
      mantis(Object.assign({}, HERO, { x: 400, y: GROUND + 40, s: 1.2, expr: t < 1.2 ? 'worried' : 'scared', look: [1, 0] }), t) +
      bigText(["POURQUOI C'EST", 'HORRIBLE DE NAÎTRE'], t, .05, 300, '#fff', 92, 105) +
      G(tr(540, 540, pop(t, .7) * (1 + wave(t, 2, .03)), -3), text(0, 0, OL, 'MANTE RELIGIEUSE ?', M_GREEN, 98)),
  },
  // B002 — sortie de l'oeuf
  {
    s: 2.5, sfx: [[0, 'whoosh', .5], [.2, 'crack', 1], [.65, 'pop', .8], [.9, 'baby_coo', .7]],
    cam: (t, d) => ({ z: lerp(1.05, 1.15, eOutCubic(t / d)), cy: 850 }),
    draw: (t) => {
      const up = eOutBack(seg(t, .6, .9));
      return bgGarden(t) + branch(-100, 1150, 1180, 1100, 60, '#9a6a43', [[150, 1120, .8, -30]]) +
        `<clipPath id="egg"><rect x="0" y="0" width="1080" height="${lerp(900, 760, 0) + 0}"/></clipPath>` +
        G(tr(540, lerp(980, 640, up)), mantisHead({ expr: t < 1.0 ? 'wide' : 'happy', hr: 100, seed: 1 }, 0, 0, .95, t)) +
        ootheca(540, 1020, 1.9, t, seg(t, .2, .4)) +
        op(seg(t, .65, .7), sparkle(330, 600, .7 * pop(t, .65)) + sparkle(760, 560, .5 * pop(t, .75)));
    },
  },
  // B003 — contre-plongée : des dizaines de frères et soeurs
  {
    s: 4.1, enter: 'drop', sfx: [[.05, 'pop', .6], [.2, 'pop_hi', .6], [.35, 'pop', .6], [.5, 'pop_hi', .6], [.65, 'pop', .6], [.8, 'pop_hi', .6], [.95, 'pop', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
    draw: (t) => {
      let s = grad('#bfe6ff', '#e8f7ff') + bgLeaves(t, 'rgba(110,180,110,.25)', 5) + G(tr(540, 170, 2.0, 180), ootheca(0, 0, 1, t, 1)) + branch(-100, 90, 1180, 60, 70);
      const r = rng(8);
      for (let i = 0; i < 14; i++) {
        const x = 70 + (i % 7) * 158 + (i >= 7 ? 79 : 0), len = 260 + r() * 520, k = eOutBack(seg(t, .05 + i * .07, .4 + i * .07)), sw = wave(t, .6, 6, i / 5);
        const yy = 260 + len * k;
        s += line(540 + (x - 540) * .2, 260, x + sw, yy - 150 * .55, 3, 'rgba(255,255,255,.9)');
        s += G(tr(x + sw, yy, .5, 180 + sw), mantis({ nymph: true, expr: ['happy', 'neutral', 'wow', 'joy'][i % 4], arms: 'pray', seed: i, bob: 0 }, t));
      }
      return s;
    },
  },
  // B004 — plongée : la première règle
  {
    s: 5.86, enter: 'whip', sfx: [[0, 'sting', .9], [1.25, 'glint', .9], [1.6, 'gulp', .8]],
    cam: (t, d) => ({ z: lerp(1.0, 1.1, eInOut(t / d)), cy: 900 }),
    draw: (t) => {
      let s = rect(-100, -100, 1300, 2200, '#9fd08a', 0, 0) + G(tr(540, 950, 4.2, -8), leaf(-110, 0, 1, 0, '#7cc46a'));
      const sib = [[230, 820, 'suspicious'], [820, 760, 'smug'], [250, 1150, 'suspicious']];
      for (const [x, y, e] of sib) s += mantis({ nymph: true, x, y, s: .75, expr: e, look: [x < 540 ? 1 : -1, 0], flip: x > 540, seed: x }, t);
      s += mantis({ nymph: true, x: 540, y: 1080, s: .85, expr: t < 1.3 ? 'neutral' : 'scared', look: [t < 1.3 ? 0 : 1, 0], ...HERO }, t);
      // le frère affamé
      const bk = pop(t, 1.0);
      s += mantis({ nymph: true, x: 860, y: 1130, s: .85, flip: true, expr: t > 1.2 ? 'hungry' : 'suspicious', drool: t > 1.2, look: [-1, 0], arms: 'hold', holdItem: t > 1.0 ? G(tr(0, 0, bk), fork(0, -40, .8, 20)) : '', seed: 9 }, t);
      if (t > 1.0) s += G(tr(860 - 55, 1130 - 300, bk), bib(0, 0, .5));
      return s;
    },
  },
  // B005 — "même ta famille peut te manger"
  {
    s: 8.38, sfx: [[.25, 'whoosh', .8], [.42, 'chomp', 1], [.55, 'boing', .7], [1.2, 'chomp', .8], [1.5, 'whoosh', .5]],
    cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), shake: t > .4 && t < .6 ? 9 : 0 }),
    draw: (t) => {
      const lunge = eOutCubic(seg(t, .25, .45)), back = seg(t, .9, 1.4);
      const jump = Math.sin(seg(t, .35, 1.1) * Math.PI);
      let s = bgGarden(t) + branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      s += mantis({ nymph: true, x: 380 - seg(t, .35, 1.1) * 120, y: GROUND + 20 - jump * 330, s: 1.0, expr: t < .35 ? 'neutral' : 'scared', arms: t > .35 ? 'up' : 'pray', rot: -jump * 15, ...HERO }, t);
      if (t > .35 && t < 1.1) s += motionLines(470, GROUND - 250 - jump * 300, 3, 80, 20);
      const sx = lerp(820, 560, lunge) + back * 120;
      s += mantis({ nymph: true, x: sx, y: GROUND, s: 1.05, flip: true, expr: 'hungry', drool: true, face: { mouth: t > .35 && t < .6 ? 'wail' : 'teeth' }, arms: t > .25 && t < .6 ? 'strike' : 'hold', holdItem: fork(0, -40, .8, 30), seed: 9 }, t) + G(tr(sx - 60, GROUND - 330), bib(0, 0, .55));
      if (t > .42 && t < .7) s += impactStar(480, GROUND - 300, .6 * pop(t, .42), '#fff');
      return s;
    },
  },
  // B006 — profil : Magnifique ambiance. Tu grandis.
  {
    s: 10.44, enter: 'whip', sfx: [[.65, 'whoosh_up', .8], [.75, 'pop', .7], [1.1, 'pop_hi', .8]],
    cam: (t, d) => ({ z: 1.02 }),
    draw: (t) => {
      const st = t < .75 ? 0 : t < 1.1 ? 1 : 2, k = pop(t, st === 1 ? .75 : 1.1, .3);
      let s = bgGarden(t) + branch(-100, GROUND, 1180, GROUND - 30, 56);
      if (st === 0) s += mantis({ nymph: true, x: 520, y: GROUND, s: 1.15, expr: 'deadpan', ...HERO }, t);
      if (st === 1) s += mantis({ nymph: true, x: 520, y: GROUND, s: 1.15 * lerp(1, 1.25, k), expr: 'neutral', ...HERO }, t);
      if (st === 2) s += mantis({ x: 520, y: GROUND, s: 1.35 * lerp(.85, 1, k), expr: 'proud', ...HERO }, t);
      if (st > 0) s += op(1 - seg(t, st === 1 ? .75 : 1.1, (st === 1 ? .75 : 1.1) + .35), sparkle(320, 650, .7) + sparkle(780, 560, .6));
      return s;
    },
  },
  // B007 — large : tu ressembles à une brindille
  {
    s: 11.88, sfx: [[.1, 'chirp', .9], [.55, 'pop', .6], [.8, 'chirp', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
    draw: (t) => {
      let s = bgGarden(t, '#e9f6ec', '#d2edd9');
      s += branch(-100, GROUND, 1180, GROUND - 40, 56);
      for (const [x, a] of [[180, -60], [330, -110], [800, -70], [950, -120]]) s += path(`M${x} ${GROUND - 10}l${Math.cos(R(a)) * 300} ${Math.sin(R(a)) * 300}`, 'none', 30, OL) + path(`M${x} ${GROUND - 10}l${Math.cos(R(a)) * 300} ${Math.sin(R(a)) * 300}`, 'none', 18, '#9a6a43');
      s += mantis({ x: 560, y: GROUND - 20, s: 1.2, color: '#9fb86a', expr: 'deadpan', look: [-1, 0], arms: 'rest', bob: 0, ...HERO }, t);
      s += bird(170, 560, .85, t, { look: wave(t, 1.5, 1) }) + op(seg(t, .55, .6), qmark(240, 410, .7 * pop(t, .55), '#fff', -10));
      return s;
    },
  },
  // B008 — gros plan : bras pliés comme si tu priais
  {
    s: 13.0, sfx: [[.05, 'angel', .9], [.8, 'glint', .5], [1.6, 'sparkle', .5]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 800 }),
    draw: (t) => {
      let s = rays(t, '#fff3c8', '#fff8dc', 540, 600, 24) + glow(540, 600, 700, '#fff', .6);
      s += G(tr(540, 1080, 2.0), path('M-90 0L-60 -150L60 -150L90 0Z', M_GREEN, SW));
      s += mantisHead({ expr: 'calm', halo: true, hr: 100, seed: 1 }, 540, 760, 2.4, t);
      // bras joints
      s += G(tr(540, 1060, 2.0), path('M-70 0L-40 -110L-5 -40M70 0L40 -110L5 -40', 'none', 22 + SW * 2 - 2, OL) + path('M-70 0L-40 -110L-5 -40M70 0L40 -110L5 -40', 'none', 22, M_GREEN));
      for (let i = 0; i < 5; i++) s += sparkle(540 + Math.cos(t * 1.5 + i * 1.25) * 380, 700 + Math.sin(t * 1.5 + i * 1.25) * 300, .5, '#fff3a0');
      return s;
    },
  },
  // B009 — contre-plongée : Adorable. Sauf que tu ne pries absolument pas.
  {
    s: 15.4, sfx: [[0, 'glint', .7], [.6, 'scratch', 1], [.68, 'boom', .8]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > .65 && t < 1.0 ? 10 : 0 }),
    draw: (t) => {
      const evil = t > .65;
      let s = evil ? rays(t, '#5a1630', '#6e1d3a', 540, 700, 22) + glow(540, 700, 700, '#ff3b30', .3) : rays(t, '#fff3c8', '#fff8dc', 540, 600, 24);
      s += mantis({ x: 520, y: 1450, s: 1.75, expr: evil ? 'angry' : 'happy', arms: evil ? 'up' : 'pray', spikes: evil, halo: false, ...HERO }, t);
      if (!evil) s += G(tr(520 + 55 * 1.75, 1450 - 375 * 1.75 - 125 * 1.75), ell(0, 0, 70 * 1.75, 18 * 1.75, 'none', 14, '#ffd23f'));
      else s += G(tr(520 + 55 * 1.75 + seg(t, .65, 1.2) * 60, 1450 - 375 * 1.75 - 125 * 1.75 + eInCubic(seg(t, .65, 1.2)) * 900, 1, seg(t, .65, 1.2) * 200), ell(0, 0, 70 * 1.75, 18 * 1.75, 'none', 14, '#ffd23f'));
      return s;
    },
  },
  // B010 — plongée : la mouche
  {
    s: 17.04, sfx: [[0, 'buzz', .8], [1.62, 'whoosh', 1], [1.72, 'chomp', 1], [1.8, 'pop_hi', .8], [2.05, 'boing', .7]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > 1.7 && t < 1.9 ? 10 : 0 }),
    draw: (t) => {
      const strike = t > 1.65;
      const ho = eOutCubic(seg(t, 1.72, 2.3));
      let s = bgGarden(t) + G(tr(540, GROUND + 60, 3.5, -4), leaf(-110, 0, 1, 0, '#7cc46a'));
      const fx = strike ? 860 + seg(t, 1.72, 2.6) * 200 : 760 + Math.cos(t * 3.2) * 180, fy = strike ? 640 - seg(t, 1.72, 2.6) * 150 : 620 + Math.sin(t * 4.1) * 140;
      s += mantis({ x: 420, y: GROUND + 20, s: 1.3, expr: strike ? 'angry' : 'half', look: [1, -.3], arms: t > 1.6 && t < 2.0 ? 'strike' : 'pray', spikes: strike, ...HERO }, t);
      s += fly(fx, fy, .9, t, { headOff: ho, dizzy: strike, rot: strike ? t * 300 : 0, flip: !strike && Math.sin(t * 3.2) > 0 });
      if (!strike) s += op(.6, path(`M${fx - 120} ${fy + 30}q30 -30 60 0t60 0`, 'none', 4, OL));
      if (t > 1.7 && t < 1.95) s += impactStar(880, 640, .55, '#fff');
      return s;
    },
  },
  // B011 — plan moyen : la tête tourne de presque 180°
  {
    s: 19.66, sfx: [[.3, 'clock_fast', .5], [1.15, 'pop_hi', .8], [2.35, 'ding', .7]],
    cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
    draw: (t) => {
      const k = eInOut(seg(t, .3, 1.3)), k2 = eInOut(seg(t, 1.6, 2.6));
      const ang = lerp(-85, 85, k) - k2 * 85;
      let s = bgGarden(t) + branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      const hx = 470 + 55 * 1.45, hy = GROUND + 20 - 375 * 1.45;
      s += path(`M${hx - 290} ${hy}A290 290 0 0 1 ${hx + 290} ${hy}`, 'none', 10, 'rgba(255,255,255,.95)').replace('/>', ' stroke-dasharray="26 22"/>') + path(`M${hx + 270} ${hy - 30}L${hx + 292} ${hy + 10}L${hx + 312} ${hy - 30}`, 'none', 9, '#fff');
      s += mantis({ x: 470, y: GROUND + 20, s: 1.45, expr: 'wide', headTilt: ang, ...HERO }, t);
      s += G(tr(hx, hy - 360, pop(t, 1.15)), text(0, 0, OL, '180°', '#ffd23f', 130));
      return s;
    },
  },
  // B012 — profil : pratique pour repérer les dangers
  {
    s: 22.58, enter: 'whip', sfx: [[.1, 'chirp', .8], [.55, 'pop', .8], [.9, 'whoosh', .7]],
    cam: (t, d) => ({ z: 1.03 }),
    draw: (t) => {
      const seen = t > .55, hide = eOutCubic(seg(t, .9, 1.3));
      let s = bgGarden(t) + branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      s += bird(lerp(-150, 240, eOutCubic(seg(t, 0, .8))), 620, .9, t, { look: 1 });
      s += mantis({ x: 680 + hide * 260, y: GROUND + 10 + hide * 60, s: 1.35, expr: seen ? 'shock' : 'neutral', headTilt: seen ? -150 * (1 - hide) : -60, look: [0, 0], arms: seen ? 'up' : 'pray', ...HERO }, t);
      if (seen) s += emark(700, 470, .8 * pop(t, .55));
      s += leaf(820, GROUND - 40, 1.6, -30, '#6bb35e');
      return s;
    },
  },
  // B013 — large : le vrai cauchemar quand tu deviens adulte
  {
    s: 24.12, sfx: [[.25, 'thunder', 1], [1.45, 'thunder', .7], [.1, 'sting', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: (t > .25 && t < .6) || (t > 1.45 && t < 1.7) ? 7 : 0 }),
    draw: (t) => {
      const fl = (t > .25 && t < .38) || (t > 1.45 && t < 1.55);
      let s = bgDusk(t) + cloud(250, 300, 1.8, '#3a3355', 6) + cloud(800, 360, 1.5, '#3a3355', 6) + cloud(560, 250, 1.3, '#4a4268', 6);
      s += lightning(fl ? 700 : -999, 330, .8) + branch(-100, GROUND, 1180, GROUND - 30, 56);
      s += mantis({ x: 520, y: GROUND, s: 1.45, expr: t < 1.0 ? 'neutral' : 'worried', look: [0, -1], ...HERO }, t);
      if (fl) s += `<rect width="1080" height="1920" fill="#fff" opacity=".35"/>`;
      return s;
    },
  },
  // B014 — gros plan : tu rencontres une femelle
  {
    s: 26.79, sfx: [[.4, 'ding', .8], [.55, 'heartbeat', .8]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 800 }),
    draw: (t) => {
      let s = grad('#ffe3ee', '#ffc7dc') + glow(880, 700, 500, '#fff', .6);
      s += G(tr(960, 600), sparkle(-60, -40, .6 * pop(t, .45), '#fff') + sparkle(10, 120, .4 * pop(t, .55), '#fff'));
      s += neck(420, 900, 600, 60, M_GREEN);
      s += mantisHead({ expr: t < .45 ? 'shock' : 'love', look: [1, 0], hr: 100, seed: 1, face: { blush: 1 } }, 420, 780, 2.3, t);
      if (t > .45) s += hearts(t - .45, 470, 520, 5, 260);
      return s;
    },
  },
  // B015 — contre-plongée : grande, magnifique
  {
    s: 28.06, flash: true, sfx: [[.05, 'wolf', .9], [.3, 'sparkle', .7]],
    cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(seg(t, 0, .5))) }),
    draw: (t) => {
      let s = rays(t, '#ff8fb8', '#ffa8c8', 540, 700, 22) + glow(540, 700, 600, '#fff', .5);
      s += mantis(Object.assign({}, FEM, { x: 470, y: 1650, s: 2.3, expr: 'smug', look: [0, 1], arms: 'rest', headTilt: wave(t, .8, 4) }), t);
      for (let i = 0; i < 6; i++) s += sparkle(540 + Math.cos(t * 2 + i) * 420, 640 + Math.sin(t * 2 + i) * 330, .55, '#fff');
      return s;
    },
  },
  // B016 — plongée : elle te regarde avec insistance
  {
    s: 29.10, sfx: [[0, 'heartbeat', .8], [.9, 'heartbeat', .9], [1.5, 'gulp', .7]],
    cam: (t, d) => ({ z: lerp(1.0, 1.1, eInOut(t / d)), cx: 660, cy: 700 }),
    draw: (t) => {
      let s = rect(-100, -100, 1300, 2200, '#9fd08a', 0, 0) + G(tr(540, 1150, 4.2, 10), leaf(-110, 0, 1, 0, '#7cc46a'));
      s += mantis({ x: 300, y: 1180, s: .85, expr: 'scared', look: [1, -1], ...HERO }, t);
      s += mantisHead(Object.assign({}, FEM, { expr: 'stare', look: [-1, 1], noBlink: true, hr: 100 }), 720, 560, 2.2, t);
      return s;
    },
  },
  // B017 — plan moyen : tu crois que tu lui plais
  {
    s: 30.99, sfx: [[.15, 'sparkle', .7], [.5, 'pop', .6], [.8, 'pop', .6], [1.1, 'pop_hi', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
    draw: (t) => {
      let s = grad('#ffe3ee', '#ffd0e0') + bgLeaves(t, 'rgba(255,150,190,.2)', 7) + branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      s += mantis({ x: 500, y: GROUND + 20, s: 1.45, expr: t < .8 ? 'smug' : 'proud', arms: t < .8 ? 'rest' : 'wave', face: { blush: 1 }, ...HERO }, t);
      s += hearts(t, 560, 700, 7, 400);
      s += sparkle(300, 520, .6 * pop(t, .15), '#fff') + sparkle(800, 600, .5 * pop(t, .3), '#fff');
      return s;
    },
  },
  // B018 — profil : mon frère… elle a peut-être juste faim
  {
    s: 32.84, sfx: [[.9, 'pop', .8], [1.0, 'growl', 1], [1.6, 'gulp', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d) }),
    draw: (t) => {
      let s = bgGarden(t) + branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      s += mantis(Object.assign({}, FEM, { x: 330, y: GROUND + 20, s: 1.45, expr: t < .9 ? 'smug' : 'hungry', drool: t > 1.0, look: [1, -.5] }), t);
      const k = eOutBack(seg(t, .9, 1.3));
      if (t > .9) s += G(tr(720, 430, k), bubble(0, 0, 440, 330, plate(0, 30, .75, G(tr(-40, 10, .4, -90), mantis({ expr: 'x', arms: 'pray', bob: 0, ...HERO }, t)) + G(tr(0, 0), path('M60 -10q30 -20 60 0', 'none', 6, '#5bb35b'))) + fork(-210, 20, .5, -15) + knife(210, 20, .5, 15)));
      return s;
    },
  },
  // B019 — large : tu t'approches doucement
  {
    s: 34.82, sfx: [[0, 'tiptoe', .9], [1.5, 'gulp', .7]],
    cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d) }),
    draw: (t) => {
      const k = seg(t, 0, 1.98);
      let s = bgGarden(t, '#f3e7f4', '#e3d4ef') + branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      s += mantis(Object.assign({}, FEM, { x: 860, y: GROUND - 10, s: 1.35, flip: true, expr: 'stare', noBlink: true, look: [-1, 0] }), t);
      s += mantis({ x: lerp(160, 430, k), y: GROUND + 15 - Math.abs(Math.sin(t * 3.2 * Math.PI)) * 18, s: 1.2, walk: 1.6, expr: 'worried', look: [1, 0], arms: 'hold', holdItem: flowerItem(0, -40, .9, -20), ...HERO }, t);
      return s;
    },
  },
  // B020 — gros plan : un premier rendez-vous raté peut être le dernier
  {
    s: 36.80, enter: 'whip', sfx: [[.1, 'whoosh', .4], [1.2, 'gulp', .9], [2.0, 'glint', .9]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 760 }),
    draw: (t) => {
      let s = bgNight(t);
      s += candleTable(540, 1150, 1.1, t);
      s += mantisHead({ expr: t < 1.2 ? 'worried' : 'scared', look: [1, 0], hr: 100, seed: 1 }, 330, 760, 1.9, t);
      s += mantisHead(Object.assign({}, FEM, { expr: 'stare', noBlink: true, look: [-1, 0], hr: 100 }), 790, 700, 1.9, t) + G(tr(790, 980), bib(0, 0, 1.0));
      s += fork(640, 900, 1.1, -15) + knife(950, 900, 1.1, 15) + op(seg(t, 2.0, 2.1) * (1 - seg(t, 2.3, 2.5)), sparkle(950, 790, .6, '#fff'));
      s += G(tr(470, 1020, .8, -30), flowerItem(0, 0, 1));
      return s;
    },
  },
  // B021 — contre-plongée : vous commencez à vous accoupler (pudique)
  {
    s: 39.62, sfx: [[.05, 'boing', .7], [.25, 'pop', .6], [.45, 'pop_hi', .6], [.65, 'pop', .6], [.3, 'angel', .5]],
    cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), shake: 2 }),
    draw: (t) => {
      let s = grad('#ffd6e6', '#ffeef5') + bgLeaves(t, 'rgba(255,150,190,.25)', 4);
      const sh = Math.sin(t * 22) * 4;
      s += path(`M${430 + sh} 640 q-40 -160 -80 -240M${470 + sh} 640 q20 -160 60 -240M${610 - sh} 650 q-20 -170 -70 -260M${650 - sh} 650 q40 -170 90 -250`, 'none', 7);
      s += G(tr(540 + sh, 1050, 1, -90), G('scale(3.2)', leaf(-110, 0, 1, 0, '#6bb35e')));
      s += hearts(t, 540, 620, 8, 520);
      return s;
    },
  },
  // B022 — plongée : tout se passe bien
  {
    s: 40.63, sfx: [[.15, 'ding', .8]],
    cam: (t, d) => ({ z: 1.02 }),
    draw: (t) => {
      let s = grad('#ffd6e6', '#ffeef5');
      s += mantisHead({ expr: 'love', hr: 100, seed: 1, face: { blush: 1 } }, 540, 760 + 60 * (1 - eOutBack(seg(t, 0, .3))), 2.0, t);
      s += G(tr(540, 1180, 1, -90), G('scale(3.4)', leaf(-110, 0, 1, 0, '#6bb35e')));
      s += hearts(t, 540, 520, 5, 400) + sparkle(250, 600, .6 * pop(t, .15), '#fff');
      return s;
    },
  },
  // B023 — plan moyen : jusqu'au moment où…
  {
    s: 41.49, sfx: [[0, 'scratch', .8], [.15, 'heartbeat', 1]],
    cam: (t, d) => ({ z: lerp(1.0, 1.12, eInCubic(t / d)), cx: 720, cy: 680 }),
    draw: (t) => {
      const k = seg(t, .1, .7);
      let s = grad(lerpColor('#ffd6e6', '#4a1630', k), lerpColor('#ffeef5', '#2a0e1c', k));
      s += mantisHead(Object.assign({}, FEM, { expr: k > .5 ? 'hungry' : 'love', look: [-1, 0], headTilt: lerp(0, -12, k), color: lerpColor(F_GREEN, '#2f5a2b', k), hr: 100 }), 740, 660, 2.0, t);
      s += mantisHead({ expr: 'love', hr: 100, seed: 1 }, 300, 860, 1.4, t);
      s += G(tr(540, 1230, 1, -90), G('scale(3.4)', leaf(-110, 0, 1, 0, lerpColor('#6bb35e', '#2f4a2b', k))));
      return s;
    },
  },
  // B024 — profil : elle t'attrape la tête
  {
    s: 42.44, flash: true, enter: 'none', sfx: [[.1, 'whoosh', 1], [.22, 'thud', 1], [.3, 'boing', .7]],
    cam: (t, d) => ({ z: lerp(1.1, 1.0, eOutCubic(seg(t, 0, .3))), shake: t > .2 && t < .5 ? 12 : 0 }),
    draw: (t) => {
      const g = t > .2;
      let s = rays(t, '#5a1630', '#6e1d3a', 540, 760, 22) + branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      s += mantis({ x: 760, y: GROUND + 20, s: 1.3, flip: true, expr: g ? 'shock' : 'love', look: [-1, 0], arms: g ? 'up' : 'pray', ...HERO }, t);
      s += mantis(Object.assign({}, FEM, { x: 290, y: GROUND + 20, s: 1.45, expr: 'hungry', arms: g ? 'strike' : 'pray', spikes: true, look: [1, 0] }), t);
      if (g) s += impactStar(690, 700, .7 * pop(t, .2), '#fff');
      return s;
    },
  },
  // B025 — large : et commence à te manger. VIVANT.
  {
    s: 43.54, sfx: [[.1, 'chomp', 1], [.35, 'chomp', 1], [.6, 'chomp', .9], [.88, 'boom', 1]],
    cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), shake: t > .88 ? 10 * (1 - seg(t, .88, 1.4)) : 3 }),
    overlay: (t) => t > .85 ? G(tr(540, 430, pop(t, .85, .3), -4), text(0, 0, OL, 'VIVANT !', '#ff3b3b', 190)) : '',
    draw: (t) => {
      let s = rays(t, '#5a1630', '#6e1d3a', 540, 760, 22) + branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      // corps du mâle qui gigote (tête cachée derrière la femelle)
      s += G(tr(700, GROUND + 20) + ' scale(-1 1)', G(tr(0, 0, 1.25, 8 * Math.sin(t * 20)), mantis({ headless: true, arms: [wave(t, 6, 40), -60, -120], expr: 'shock', ...HERO }, t)));
      s += mantis(Object.assign({}, FEM, { x: 380, y: GROUND + 20, s: 1.5, expr: 'happy', face: { mouth: Math.sin(t * 16) > 0 ? 'grin' : 'flat' }, arms: 'grab', look: [1, 0] }), t) + G(tr(380 + 55 * 1.5 + 15, GROUND + 20 - 375 * 1.5 + 140), bib(0, 0, .8));
      s += crumbs(t, 560, 560);
      return s;
    },
  },
  // B026 — gros plan figé : mais attends, le pire reste à venir. Chez certaines espèces,
  {
    s: 45.06, enter: 'none', sfx: [[0, 'scratch', 1], [1.0, 'pop', .7], [1.5, 'whoosh', .5]],
    cam: (t, d) => ({ z: lerp(1.12, 1.0, eOutCubic(seg(t, 0, .4))), r: lerp(-5, 0, eOutCubic(seg(t, 0, .4))) }),
    draw: (t) => {
      let s = rect(-100, -100, 1300, 2200, '#d9d2c3', 0, 0) + radial(540, 800, 900, 'rgba(255,255,255,.6)', '#d9d2c3', 0);
      s += `<g filter="url(#sepia2)">` + mantisHead(Object.assign({}, FEM, { expr: 'happy', face: { mouth: 'flat' }, hr: 100 }), 540, 760, 2.4, 0) + circ(540 - 120, 760 + 110, 55, F_GREEN, 6) + circ(540 + 120, 760 + 110, 55, F_GREEN, 6) + G(tr(540, 1060), bib(0, 0, 1.3)) + `</g>`;
      s += `<defs><filter id="sepia2"><feColorMatrix type="matrix" values=".5 .6 .2 0 0 .45 .55 .18 0 0 .35 .45 .15 0 0 0 0 0 1 0"/></filter></defs>`;
      s += pauseBars(t) + qmark(860, 470, .8 * pop(t, 1.0), '#ffd23f', 10);
      s += G(tr(lerp(1300, 760, eOutBack(seg(t, 1.5, 2.0))), 900, 1.3, -20), magnifier(0, 0, 1));
      return s;
    },
  },
  // B027 — contre-plongée : ton corps peut continuer…
  {
    s: 47.54, sfx: [[.2, 'boing', .7], [.5, 'pop', .6], [.9, 'pop_hi', .6], [1.3, 'pop', .6], [1.7, 'pop_hi', .6]],
    cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), shake: 2 }),
    draw: (t) => {
      let s = grad('#ffd6e6', '#ffeef5') + bgLeaves(t, 'rgba(255,150,190,.25)', 4);
      const sh = Math.sin(t * 22) * 4;
      s += mantisHead(Object.assign({}, FEM, { expr: 'happy', face: { mouth: Math.sin(t * 14) > 0 ? 'grin' : 'flat' }, hr: 100 }), 380, 650, 1.3, t) + crumbs(t, 380, 700, 9);
      s += G(tr(720, 1080, 1.2), mantis({ headless: true, bandage: true, arms: 'wave', armFar: 'rest', bob: 1, ...HERO }, t));
      s += G(tr(540 + sh, 1180, 1, -90), G('scale(3.2)', leaf(-110, 0, 1, 0, '#6bb35e')));
      s += hearts(t, 600, 640, 7, 480);
      return s;
    },
  },
  // B028 — plongée : même après avoir perdu sa tête. Oui.
  {
    s: 49.75, sfx: [[.05, 'ghost', .9], [1.35, 'pop', .7]],
    cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
    draw: (t) => {
      let s = bgGarden(t, '#e7e2f2', '#d4cce8') + branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      s += mantis({ x: 470, y: GROUND + 20, s: 1.3, headless: true, bandage: true, arms: 'rest', ...HERO }, t);
      const nod = t > 1.3 ? Math.sin(seg(t, 1.3, 1.8) * Math.PI * 2) * 12 : 0;
      s += G(tr(720, 560 + nod, 1.0), ghostHead(0, 0, 1.4, t)) + op(seg(t, 1.3, 1.4), G(tr(870, 400, pop(t, 1.3)), text(0, 0, OL, 'OUI.', '#fff', 90)));
      return s;
    },
  },
  // B029 — plan moyen : en train de te faire dévorer
  {
    s: 51.74, sfx: [[.1, 'chomp', .8], [.5, 'chomp', .8], [.9, 'chomp', .8], [1.3, 'chomp', .8], [1.7, 'gulp', .7]],
    cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), cy: 800 }),
    draw: (t) => {
      let s = rays(t, '#ffb3cd', '#ffc6da', 540, 760, 20);
      const ch = Math.sin(t * 16) > 0;
      s += neck(540, 900, 600, 60, F_GREEN) + G(tr(540, 1010), bib(0, 0, 1.3));
      s += mantisHead(Object.assign({}, FEM, { expr: 'love', face: { mouth: ch ? 'grin' : 'flat' }, hr: 100 }), 540, 760, 2.3, t);
      s += circ(540 - 125, 760 + 120, ch ? 50 : 40, F_GREEN, 6) + circ(540 + 125, 760 + 120, ch ? 50 : 40, F_GREEN, 6);
      s += crumbs(t, 540, 900, 11) + fork(260, 900, 1.1, -20) + knife(830, 900, 1.1, 20);
      return s;
    },
  },
  // B030 — profil : et ton corps continue le travail
  {
    s: 53.79, enter: 'whip', sfx: [[.2, 'hammer', .9], [1.15, 'ding', .6]],
    cam: (t, d) => ({ z: 1.03 }),
    draw: (t) => {
      let s = bgGarden(t) + branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      const hit = Math.abs(Math.sin(t * Math.PI * 3.3));
      s += mantis({ x: 470, y: GROUND + 20, s: 1.4, headless: true, arms: [40, -60 + hit * 50, 20 + hit * 60], holdItem: G(tr(0, 0, 1, 0), rect(-8, -10, 16, 110, '#8a5a3a', 4, 5) + rect(-40, -40, 80, 40, '#9aa3ad', 6, 5)), holdRot: -70, ...HERO }, t);
      s += G(tr(470 + 45 * 1.4, GROUND + 20 - 320 * 1.4 - 10), path('M-70 0Q0 -110 70 0Z', '#ffcf3f', 6) + rect(-85, -6, 170, 16, '#ffcf3f', 6, 6));
      s += hearts(t, 560, 600, 4, 300) + op(hit > .9 ? 1 : 0, impactStar(760, 820, .35, '#fff'));
      return s;
    },
  },
  // B031 — large : mais rassure-toi
  {
    s: 55.46, sfx: [[.05, 'chirp', .8], [.15, 'angel', .5]],
    cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d) }),
    draw: (t) => {
      let s = bgGarden(t, '#d9f1ff', '#eef9ff') + glow(900, 250, 500, '#fff2a0', .6) + sun(900, 260, .35, t, 'nice');
      s += branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      s += mantis({ x: 470, y: GROUND + 20, s: 1.4, color: '#a5dc7a', expr: 'calm', arms: 'hold', holdItem: G(tr(0, -30), rect(-26, -40, 52, 50, '#fff', 8, 5) + path('M26 -30q24 0 24 18t-24 18', 'none', 6) + steam(0, -50, t, .4)), seed: 6 }, t);
      s += bird(180, 520, .6, t, { look: 1 });
      return s;
    },
  },
  // B032 — gros plan : tous les mâles ne finissent pas comme ça
  {
    s: 56.56, sfx: [[.2, 'tada', .8], [.5, 'sparkle', .5]],
    cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), cy: 820 }),
    draw: (t) => {
      let s = rays(t, '#d7f2c8', '#e5f8d9', 540, 700, 22);
      s += neck(540, 900, 600, 60, '#a5dc7a');
      s += mantisHead({ expr: t < .5 ? 'worried' : 'proud', color: '#a5dc7a', hr: 100, seed: 6 }, 540, 740, 2.2, t);
      s += G(tr(540, lerp(1300, 1070, eOutBack(seg(t, .2, .5)))), medal(0, 0, 1.3));
      return s;
    },
  },
  // B033 — contre-plongée : simplement, chez les mantes religieuses…
  {
    s: 57.97, flash: true, sfx: [[0, 'sting', .9], [1.1, 'glint', .9]],
    cam: (t, d) => ({ z: lerp(1.08, 1.0, eOutCubic(seg(t, 0, .5))) }),
    draw: (t) => {
      let s = rays(t, '#5a1630', '#6e1d3a', 540, 700, 22) + glow(540, 700, 700, '#ff6fa8', .3);
      s += mantis(Object.assign({}, FEM, { x: 470, y: 1650, s: 2.3, expr: 'smug', look: [0, 1], arms: 'hold', holdItem: knife(0, -40, .8, 30) }), t) + G(tr(470 + 55 * 2.3 + 20, 1650 - 375 * 2.3 + 230), bib(0, 0, 1.2));
      if (t > 1.1 && t < 1.5) s += sparkle(720, 700, .8, '#fff');
      return s;
    },
  },
  // B034 — plongée : quand une fille te dit qu'elle te trouve à croquer
  {
    s: 60.0, enter: 'whip', sfx: [[.3, 'kiss', 1], [.55, 'pop', .6], [1.5, 'glint', .9]],
    cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d) }),
    draw: (t) => {
      let s = rect(-100, -100, 1300, 2200, '#ffd6e6', 0, 0) + G(tr(540, 1150, 4.2, 10), leaf(-110, 0, 1, 0, '#8fd16a'));
      s += mantisHead(Object.assign({}, FEM, { expr: 'love', face: { mouth: 'smirk' }, hr: 100, look: [-1, 1] }), 720, 560, 1.9, t);
      // fourchette cachée derrière le dos
      s += G(tr(960, lerp(1100, 860, eOutBack(seg(t, 1.4, 1.7)))), fork(0, 0, 1.0, 10));
      const k = seg(t, .3, 1.0);
      s += heart(lerp(620, 380, k), lerp(700, 900, k) - Math.sin(k * Math.PI) * 120, .8 * pop(t, .3));
      s += mantis({ x: 330, y: 1190, s: .9, expr: 'embarrassed', look: [1, -1], face: { blush: 1 }, ...HERO }, t);
      return s;
    },
  },
  // B035 — PAYOFF : PRENDS ÇA TRÈS AU SÉRIEUX.
  {
    s: 62.07, flash: true, enter: 'none', sfx: [[0, 'boom', .9], [0, 'siren', .9], [1.25, 'whoosh', 1], [1.3, 'steps', .7]],
    cam: (t, d) => ({ z: lerp(1.1, 1.0, eOutCubic(seg(t, 0, .4))), shake: 3 }),
    overlay: (t) => bigText(['PRENDS ÇA', 'TRÈS AU SÉRIEUX.'], t, .05, 340, ['#fff', '#ff3b3b'], [130, 110], 130),
    draw: (t) => {
      const red = Math.floor(t * 5) % 2 === 0;
      let s = rays(t, red ? '#7a1a2a' : '#1a2a7a', red ? '#8e2234' : '#22348e', 540, 760, 20);
      s += branch(-100, GROUND + 20, 1180, GROUND - 20, 56);
      const run = eInCubic(seg(t, 1.2, 1.8));
      s += mantis({ x: 540 + run * 900, y: GROUND + 20, s: 1.4, expr: t < 1.2 ? 'angry' : 'scared', face: t < 1.2 ? { mouth: 'flat' } : {}, walk: run > 0 ? 5 : 0, look: [0, 0], ...HERO }, t);
      if (run > 0) s += op(1 - run * .5, cloud(400 + run * 500, GROUND - 60, .7, '#e8e0d0', 5)) + motionLines(400 + run * 700, GROUND - 300, 4, 140, 180, '#fff');
      return s;
    },
  },
];
