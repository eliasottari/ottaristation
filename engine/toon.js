// ============================================================
//  TOON — perso « stick » v2 (retours utilisateur après « cerveau ») :
//  - membres ANCRÉS dans le corps (racine cachée/à l'intérieur, pas d'effilement à la racine), mains et pieds collés
//  - vraies articulations : cuisse + genou, bras + coude ; cycles de marche/course réalistes (gait)
//  - grosse tête, corps en cloche, squash & stretch, tremblement, ventre qui gonfle
//  - expressions cartoon EXAGÉRÉES (peur, joie, fatigue, dégoût, nausée, rot…)
//  Charger après flow.js.
// ============================================================

// ---------- yeux / bouches supplémentaires ----------
const _eyesSvg1 = eyesSvg, _mouthSvg1 = mouthSvg;
eyesSvg = function (type, r, t, lx, ly, seed) {
  if (type === 'lidHeavy' || type === 'lidDead') {
    let s = '';
    for (const sd of [-1, 1]) {
      const x = sd * r * .34 + lx * .5, y = r * .04 + ly * .5, k = type === 'lidDead' ? .75 : .55;
      s += circ(x, y, r * .17, '#fff', 5) + circ(x + lx * .4, y + r * .06, r * .065, OL, 0);
      s += path(`M${x - r * .19} ${y - r * .02}A${r * .19} ${r * .19} 0 0 1 ${x + r * .19} ${y - r * .02}L${x + r * .19} ${y - r * .17 + r * .34 * k}L${x - r * .19} ${y - r * .17 + r * .34 * k}Z`, HEADW, 0) + line(x - r * .2, y - r * .17 + r * .34 * k, x + r * .2, y - r * .17 + r * .34 * k, 6);
      s += path(`M${x - r * .16} ${y + r * .2}Q${x} ${y + r * .3} ${x + r * .16} ${y + r * .2}`, 'none', 5, '#9a7fb0') + path(`M${x - r * .12} ${y + r * .27}Q${x} ${y + r * .34} ${x + r * .12} ${y + r * .27}`, 'none', 4, '#b9a2cc');
    }
    return s;
  }
  if (type === 'tearful') { let s = _eyesSvg1('huge', r, t, lx, ly, seed); for (const sd of [-1, 1]) { const k = (t * 2.4 + (sd > 0 ? .5 : 0)) % 1; s += path(`M${sd * r * .34} ${r * .2}q${sd * r * .04} ${r * .3} ${sd * r * .02} ${r * (.4 + k * .4)}`, 'none', 9, '#8fd0ff'); } return s; }
  return _eyesSvg1(type, r, t, lx, ly, seed);
};
mouthSvg = function (type, r, t, lx, ly) {
  const x = lx * .6, y = r * .36 + ly * .6;
  switch (type) {
    case 'megagrin': return path(`M${x - r * .5} ${y - r * .1}Q${x} ${y} ${x + r * .5} ${y - r * .1}Q${x + r * .42} ${y + r * .48} ${x} ${y + r * .5}Q${x - r * .42} ${y + r * .48} ${x - r * .5} ${y - r * .1}Z`, '#6b1f24', 6) +
      path(`M${x - r * .44} ${y - r * .07}Q${x} ${y + r * .02} ${x + r * .44} ${y - r * .07}L${x + r * .4} ${y + r * .07}Q${x} ${y + r * .14} ${x - r * .4} ${y + r * .07}Z`, '#fff', 0) + ell(x, y + r * .38, r * .2, r * .09, '#ff8a9a', 0);
    case 'gag': { const w = Math.sin(t * 20) * r * .02; return path(`M${x - r * .3} ${y}q${r * .1} ${-r * .1 + w} ${r * .2} 0t${r * .2} 0t${r * .2} 0Q${x + r * .26} ${y + r * .3} ${x} ${y + r * .3}Q${x - r * .26} ${y + r * .3} ${x - r * .3} ${y}Z`, '#5a2a1f', 6) + path(`M${x - r * .06} ${y + r * .2}q${-r * .04} ${r * .34} ${r * .1} ${r * .36}q${r * .12} ${-r * .04} ${r * .06} ${-r * .36}Z`, '#ff8a9a', 5); }
    case 'puff': return ell(-r * .5, r * .48, r * .24, r * .2, 'rgba(255,255,255,.0)', 6) + ell(r * .5, r * .48, r * .24, r * .2, 'rgba(255,255,255,.0)', 6) + ell(-r * .5, r * .5, r * .13, r * .08, '#9fd46a', 0) + ell(r * .5, r * .5, r * .13, r * .08, '#9fd46a', 0) + ell(x, y + r * .12, r * .1, r * .06, '#6b1f24', 5);
    case 'burp': { const o = 1 + .12 * Math.sin(t * 30); return ell(x, y + r * .12, r * .22 * o, r * .3 * o, '#5a1f24', 6) + ell(x, y + r * .28, r * .13, r * .08, '#ff8a9a', 0); }
    case 'gulp': return ell(x, y + r * .05, r * .2, r * .14, '#6b1f24', 6) + rect(x - r * .12, y - r * .02, r * .24, r * .06, '#7ad04a', 3, 0);
  }
  return _mouthSvg1(type, r, t, lx, ly);
};
Object.assign(EXPR, {
  fear: { eyes: 'huge', mouth: 'scream', brows: 'sad', sweatSpray: 1 },
  terrorX: { eyes: 'pop', mouth: 'scream', brows: 'sad', sweatSpray: 1 },
  joyX: { eyes: 'happy', mouth: 'megagrin', brows: 'up', blush: 1 },
  proudX: { eyes: 'closedHappy2', mouth: 'megagrin', brows: 'up', blush: 1 },
  tired: { eyes: 'lidHeavy', mouth: 'wavy', brows: 'sad', sweat: 1 },
  exhausted: { eyes: 'lidDead', mouth: 'drool', brows: 'sad' },
  sick: { eyes: 'ring', mouth: 'puff', brows: 'sad', sweat: 1 },
  gagX: { eyes: 'squint', mouth: 'gag', brows: 'angry', sweat: 1 },
  burp: { eyes: 'closed', mouth: 'burp', brows: 'up' },
  gulp: { eyes: 'squint', mouth: 'gulp', brows: 'angry', sweat: 1 },
  smugX: { eyes: 'half', mouth: 'megagrin', brows: 'skeptic', blush: 1 },
  cryX: { eyes: 'tearful', mouth: 'wail', brows: 'sad' },
  shockX: { eyes: 'pop', mouth: 'jaw', brows: 'up' },
  blaseX: { eyes: 'lidHeavy', mouth: 'flat', brows: 'flat' },
  determined: { eyes: 'squint', mouth: 'grit', brows: 'angry', steamHead: 1 },
});

// ---------- gait : cycles de marche / course (cuisse + genou + coude) ----------
// renvoie {legs, arms, bob, lean} ; f = sens (+1 vers la droite, -1 vers la gauche)
function gait(t, o = {}) {
  const run = o.run || 0, f = o.f ?? 1, sp = o.speed ?? 1;
  const p = t * sp * Math.PI * 2 * (1.4 + run * .5);
  const amp = lerp(26, 46, run), knee = lerp(55, 110, run);
  const leg = ph => { const s = Math.sin(p + ph), c = Math.cos(p + ph); const th = 90 - f * amp * s; const bend = (c > 0 ? knee * Math.pow(c, 1.3) : 8) * (s > -.2 ? 1 : .6); return [th, th + f * bend]; };
  const arm = ph => { const s = Math.sin(p + ph); const up = 90 + f * lerp(24, 50, run) * s; return [up, up - f * lerp(18, 95, run)]; };
  return {
    legs: [leg(0), leg(Math.PI)],
    arms: [arm(0), arm(Math.PI)],
    bobY: -lerp(9, 22, run) * Math.cos(2 * p),
    lean: f * lerp(4, 16, run),
  };
}

// ---------- le perso ----------
// o : x y s rot flip face(-1/0/1) lean tilt sq(squash) hsq(squash tête) shiver belly sick |
//     body bw bh legLen hr hair hairColor expr face look glasses must mask | legs arms bob |
//     holdL holdR handR:'thumb' | coat tie tag apron badge | shoes shadow armsBack
function toon(o, t = 0) {
  const r = o.hr || 118, col = o.body || '#e8724a';
  const belly = o.belly || 0;
  const bw = (o.bw || 168) * (1 + belly * .7), bh = o.bh || 200, legLen = o.legLen ?? 150;
  const hipY = -legLen, bob = (o.bobY ?? 0) + (o.bob ?? 1) * wave(t, .9, 3, o.seed || 0);
  const bot = hipY + 32, top = bot - bh + bob;
  const face = o.face ?? 0;
  const LW = o.limbW || 12;
  const limb = (x, y, a1, l1, a2, l2, w = LW) => {
    const x1 = x + Math.cos(R(a1)) * l1, y1 = y + Math.sin(R(a1)) * l1, x2 = x1 + Math.cos(R(a2)) * l2, y2 = y1 + Math.sin(R(a2)) * l2;
    const d = `M${f1(x)} ${f1(y)}Q${f1(x1 + (x1 - (x + x2) / 2) * .25)} ${f1(y1 + (y1 - (y + y2) / 2) * .25)} ${f1(x2)} ${f1(y2)}`;
    return { svg: window.INK ? inkStroke(d, w, OL, 'limb') : path(d, 'none', w), x: x2, y: y2 };
  };
  let legsS = '';
  const legs = o.legs || [[96, 92], [84, 88]];
  if (legLen > 0) [-1, 1].forEach((sd, i) => {
    const [a1, a2] = legs[i], L = limb(sd * bw * .2, bot - 34, a1, legLen * .55 + 4, a2, legLen * .52);
    const fx = face || (Math.cos(R(a2)) > .2 ? 1 : Math.cos(R(a2)) < -.2 ? -1 : 0);
    legsS += L.svg + G(tr(L.x + fx * 12, L.y + 4, 1, fx * 6), ell(0, 0, 30 - Math.abs(fx) * 0, 14, o.shoes || '#f0a0b4', 5) + ell(-fx * 6 - 6, -4, 9, 4, 'rgba(255,255,255,.5)', 0));
  });
  // corps en cloche (+ ventre)
  const tw = bw * .33 / (1 + belly * .5), rb = bw * .3;
  const bodyD = `M${-tw} ${top + tw}Q${-tw} ${top} 0 ${top}Q${tw} ${top} ${tw} ${top + tw}C${tw + 10} ${top + bh * .35} ${bw / 2} ${bot - rb * 1.6} ${bw / 2} ${bot - rb}Q${bw / 2} ${bot} ${bw / 2 - rb} ${bot}L${-bw / 2 + rb} ${bot}Q${-bw / 2} ${bot} ${-bw / 2} ${bot - rb}C${-bw / 2} ${bot - rb * 1.6} ${-tw - 10} ${top + bh * .35} ${-tw} ${top + tw}Z`;
  let body = path(bodyD, col, 0) + path(bodyD, 'url(#stVol)', 0) + path(bodyD, 'url(#stVolV)', 0);
  if (o.coat) body += path(`M${-tw * .55} ${top + 8}L0 ${top + bh * .45}L${tw * .55} ${top + 8}`, o.tie ? '#fff' : 'none', 0) + (o.tie ? path(`M-12 ${top + 12}L12 ${top + 12}L7 ${top + bh * .34}L0 ${top + bh * .43}L-7 ${top + bh * .34}Z`, o.tie, 5) : '') + path(`M${-tw * .62} ${top + 6}L${-bw * .03} ${top + bh * .5}M${tw * .62} ${top + 6}L${bw * .03} ${top + bh * .5}L${bw * .03} ${bot - 6}`, 'none', 5) + rect(bw * .14, top + bh * .55, bw * .2, bw * .14, 'none', 4, 4) + line(bw * .2, top + bh * .5, bw * .2, top + bh * .6, 6, '#3f7df0');
  if (o.apron) body += path(`M${-bw * .34} ${top + bh * .32}L${bw * .34} ${top + bh * .32}L${bw * .4} ${bot - 8}L${-bw * .4} ${bot - 8}Z`, o.apron, 5);
  if (o.tag) body += rect(-bw * .34, top + bh * .3, bw * .26, bw * .17, '#fff', 4, 4) + rect(-bw * .34, top + bh * .3, bw * .26, bw * .06, o.tag, 2, 0);
  if (belly > .05) body += path(`M${-bw * .3} ${bot - bh * .45}Q0 ${bot - bh * .62} ${bw * .3} ${bot - bh * .45}`, 'none', 4, 'rgba(0,0,0,.25)') + [0, 1, 2].map(i => circ(0, top + bh * (.45 + i * .16), 6, '#fff', 3)).join('');
  body += path(bodyD, 'none', SW);
  // bras (racine DANS le corps)
  const arms = o.arms || [[100, 94], [80, 86]];
  const shY = top + tw * .95;
  let armS = '';
  [-1, 1].forEach((sd, i) => {
    const [a1, a2] = arms[i], A = limb(sd * tw * .62, shY, a1, 84, a2, 78, LW - 1);
    armS += A.svg;
    const hand = i ? o.handR : o.handL;
    armS += hand === 'thumb' ? G(tr(A.x, A.y, 1, i ? 0 : 0), circ(0, 0, 16, OL, 0) + rect(-6, -40, 13, 30, OL, 6, 0)) : circ(A.x, A.y, 13, OL, 0);
    const h = i ? o.holdR : o.holdL; if (h) armS += G(tr(A.x, A.y, 1, i ? (o.holdRrot || 0) : (o.holdLrot || 0)), h);
  });
  // tête
  const hs = HAIRS[o.hair || 'none'];
  const skin = o.sick ? lerpColor(HEADW, '#b5dc84', clamp(o.sick)) : (o.skin || HEADW);
  const hd = head(Object.assign({}, o, { hr: r, skin, cheeks: o.cheeks ?? false, hairFn: hs ? hs(o.hairColor || '#3b3040') : undefined, x: 0, y: 0, glasses: false }), t);
  const gl = o.glasses ? circ(-r * .34, r * .02, r * .24, 'rgba(255,255,255,.18)', 6) + circ(r * .34, r * .02, r * .24, 'rgba(255,255,255,.18)', 6) + line(-r * .1, 0, r * .1, 0, 6) : '';
  const must = o.must ? path(`M${-r * .34} ${r * .3}Q${-r * .17} ${r * .13} 0 ${r * .24}Q${r * .17} ${r * .13} ${r * .34} ${r * .3}Q${r * .17} ${r * .37} 0 ${r * .3}Q${-r * .17} ${r * .37} ${-r * .34} ${r * .3}Z`, o.must, 4) : '';
  const hq = o.hsq || 0;
  const headS = G(tr(0, top - r * .72, 1, o.tilt || 0) + ` scale(${(1 + hq).toFixed(3)} ${(1 - hq).toFixed(3)})`, o.headWrap ? o.headWrap(hd + gl + must, r, t) : hd + gl + must);
  const sq = o.sq || 1;
  let upper = (o.armsBack ? armS + body : body) + headS + (o.armsBack ? '' : armS) + (o.over || '');
  upper = G(`translate(0 ${bot}) scale(${(1 / Math.sqrt(sq)).toFixed(3)} ${sq.toFixed(3)}) translate(0 ${-bot})`, upper);
  let s = legsS + G(`rotate(${o.lean || 0} 0 ${hipY})`, upper);
  if (o.shiver) s = G(`translate(${f1(Math.sin(t * 61) * o.shiver)} ${f1(Math.cos(t * 53) * o.shiver * .6)})`, s);
  const shadow = o.shadow === false ? '' : ell(0, 8, 105 * (o.shadowK || 1), 17, 'rgba(0,0,0,.18)', 0);
  return G(tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''), shadow + s);
}

// ---------- décors en perspective (3D-lite) ----------
// boîte pleine (meubles, comptoirs…) : seules les faces visibles, ombrées
function box3(c, x0, x1, y0, y1, z0, z1, col, sw = 6) {
  const F = [];
  if (c.z < z0) F.push([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], col);
  if (c.z > z1) F.push([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], col);
  if (c.x < x0) F.push([[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], shade(col, -.14));
  if (c.x > x1) F.push([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], shade(col, -.14));
  if (c.y > y1) F.push([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], shade(col, .14));
  if (c.y < y0) F.push([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], shade(col, -.25));
  let s = ''; for (let i = 0; i < F.length; i += 2) s += poly3(c, F[i], F[i + 1], sw); return s;
}
// pièce : sol carrelé, mur du fond (z = d), murs latéraux (x = ±w/2), plafond optionnel
function room3(c, o) {
  const w = o.w || 8, d = o.d || 10, h = o.h || 3.2, z0 = o.z0 ?? -4;
  let s = rect(-50, -50, W + 100, H + 100, o.wall || '#f1efe8', 0, 0);
  if (o.ceil !== false) s += poly3(c, [[-w / 2, h, z0], [w / 2, h, z0], [w / 2, h, d], [-w / 2, h, d]], o.ceil || shade(o.wall || '#f1efe8', .06));
  s += poly3(c, [[-w / 2, 0, z0], [-w / 2, h, z0], [-w / 2, h, d], [-w / 2, 0, d]], o.sideL || shade(o.wall || '#f1efe8', -.08));
  s += poly3(c, [[w / 2, 0, z0], [w / 2, h, z0], [w / 2, h, d], [w / 2, 0, d]], o.sideR || shade(o.wall || '#f1efe8', -.12));
  s += poly3(c, [[-w / 2, 0, d], [w / 2, 0, d], [w / 2, h, d], [-w / 2, h, d]], o.back || o.wall || '#f1efe8', 6);
  s += floor3(c, -w / 2, w / 2, z0, d, o.tile || .8, o.f1 || '#d9cdb5', o.f2 || '#cbbd9f', o.joint || 'rgba(60,50,40,.25)');
  s += poly3(c, [[-w / 2, 0, z0], [-w / 2, 0, d]], 'none', 6) + poly3(c, [[w / 2, 0, z0], [w / 2, 0, d]], 'none', 6);
  return s;
}
// rectangle sur un mur latéral (x = xw) ou du fond (z = zw) : fenêtres, tableaux, portes
function onBack(c, zw, x0, x1, y0, y1, fill, sw = 6) { return poly3(c, [[x0, y0, zw], [x1, y0, zw], [x1, y1, zw], [x0, y1, zw]], fill, sw); }
function onSide(c, xw, z0, z1, y0, y1, fill, sw = 6) { return poly3(c, [[xw, y0, z0], [xw, y0, z1], [xw, y1, z1], [xw, y1, z0]], fill, sw); }
// perso posé dans la scène 3D (pxm = px par mètre de perso)
const toon3 = (c, X, Z, o, t, pxm = 330) => sprite3(c, X, 0, Z, toon(o, t), pxm);
