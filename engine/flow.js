// ============================================================
//  STYLE « FLOW » (option A) — inspiré des vidéos explicatives en plan-séquence :
//  - persos « stick » : grosse tête blanche, corps capsule en volume, membres fil, mains points
//  - passe lumière : rayons diagonaux, bloom, grain, aberration chromatique
//  - caméra 3D-lite (P3) : vrais sols/murs en perspective (carrelage qui fuit, plongée)
//  - transitions (gérées par player.js via sc.tin) : 'portal' (zoom DANS un écran / une photo),
//    'portalOut' (on ressort d'un écran), 'dissolve' (fondu raccord), 'glitch'
// ============================================================
const HEADW = '#f8f5ef';
window.FLOW = true;
// dégradé de volume (corps capsule) : déclaré une fois par frame par player.js
const FLOW_DEFS = `<linearGradient id="stVol" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".30"/><stop offset=".28" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity=".04"/><stop offset=".82" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></linearGradient>
<linearGradient id="stVolV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
<filter id="rimF" x="-15%" y="-15%" width="130%" height="130%"><feMorphology in="SourceAlpha" operator="dilate" radius="8" result="d"/><feFlood flood-color="#fffdf6" flood-opacity=".92"/><feComposite in2="d" operator="in" result="w"/><feGaussianBlur in="w" stdDeviation="1.2" result="wb"/><feMerge><feMergeNode in="wb"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="rayG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="grainF" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="1" seed="SEED" result="n"/><feColorMatrix type="saturate" values="0"/></filter>`;

// ---------- expressions supplémentaires (yeux « anneau », dents serrées…) ----------
const _eyesSvg0 = eyesSvg, _mouthSvg0 = mouthSvg;
eyesSvg = function (type, r, t, lx, ly, seed) {
  if (type === 'ring' || type === 'ringS') {
    const blink = type === 'ring' && ((t + seed * 1.7) % 3.6) < .1;
    let s = '';
    for (const sd of [-1, 1]) {
      const x = sd * r * .34, y = r * .02;
      s += blink ? path(`M${x - r * .15} ${y}Q${x} ${y + r * .1} ${x + r * .15} ${y}`, 'none', 6)
        : circ(x, y, r * (type === 'ringS' ? .13 : .17), '#fff', 5) + circ(x + lx * .7, y + ly * .7, r * .06, OL, 0);
    }
    return s;
  }
  if (type === 'lid') { // paupières lourdes, regard blasé de côté
    let s = '';
    for (const sd of [-1, 1]) { const x = sd * r * .34 + lx, y = r * .03 + ly; s += circ(x + r * .05, y + r * .02, r * .07, OL, 0) + line(x - r * .16, y - r * .05, x + r * .16, y - r * .05, 6); }
    return s;
  }
  return _eyesSvg0(type, r, t, lx, ly, seed);
};
mouthSvg = function (type, r, t, lx, ly) {
  const x = lx * .6, y = r * .36 + ly * .6;
  if (type === 'grit') {
    let s = rect(x - r * .3, y - r * .08, r * .6, r * .2, '#fff', r * .05, 5) + line(x - r * .3, y + r * .02, x + r * .3, y + r * .02, 3);
    for (let i = 1; i < 5; i++) s += line(x - r * .3 + i * r * .12, y - r * .08, x - r * .3 + i * r * .12, y + r * .12, 3);
    return s;
  }
  if (type === 'tiny') return ell(x, y + r * .04, r * .05, r * .035, OL, 0);
  return _mouthSvg0(type, r, t, lx, ly);
};
Object.assign(EXPR, {
  grit: { eyes: 'squint', mouth: 'grit', brows: 'angry' },
  gritR: { eyes: 'ring', mouth: 'grit', brows: 'sad', sweat: 1 },
  ring: { eyes: 'ring', mouth: 'wavy', brows: 'sad', sweat: 1 },
  ringO: { eyes: 'ring', mouth: 'o', brows: 'up' },
  ringN: { eyes: 'ring', mouth: 'flat' },
  blase: { eyes: 'lid', mouth: 'flat', brows: 'flat' },
  blaseS: { eyes: 'lid', mouth: 'smirk', brows: 'skeptic' },
  hehe: { eyes: 'closedHappy2', mouth: 'smirk', brows: 'skeptic' },
  glee: { eyes: 'closedHappy2', mouth: 'grin', brows: 'up' },
  dot: { eyes: 'dot', mouth: 'smile' },
  dotO: { eyes: 'dot', mouth: 'tiny', brows: 'up' },
});

// ---------- coiffures « stick » : renvoient [arrière, avant] ----------
const HAIRS = {
  beret: (c) => (r) => ['', path(`M${-r * .95} ${-r * .38}C${-r * 1.0} ${-r * .95} ${r * .2} ${-r * 1.25} ${r * .95} ${-r * .62}C${r * 1.05} ${-r * .5} ${r * .9} ${-r * .38} ${r * .7} ${-r * .44}C${r * .2} ${-r * .62} ${-r * .4} ${-r * .55} ${-r * .95} ${-r * .38}Z`, c, 6)],
  bowl: (c) => (r) => ['', path(`M${-r * 1.0} ${-r * .05}C${-r * 1.08} ${-r * 1.0} ${r * 1.08} ${-r * 1.0} ${r * 1.0} ${-r * .05}L${r * .8} ${-r * .05}L${r * .76} ${-r * .3}C${r * .3} ${-r * .38} ${-r * .3} ${-r * .38} ${-r * .76} ${-r * .3}L${-r * .8} ${-r * .05}Z`, c, 6)],
  bob: (c) => (r) => [path(`M${-r * 1.05} ${-r * .1}C${-r * 1.2} ${r * .5} ${-r * 1.1} ${r * .75} ${-r * .82} ${r * .72}L${r * .82} ${r * .72}C${r * 1.1} ${r * .75} ${r * 1.2} ${r * .5} ${r * 1.05} ${-r * .1}Z`, c, 6),
    path(`M${-r * 1.04} ${r * .3}C${-r * 1.2} ${-r * 1.1} ${r * 1.2} ${-r * 1.1} ${r * 1.04} ${r * .3}C${r * .9} ${-r * .1} ${r * .5} ${-r * .48} ${-r * .05} ${-r * .5}C${-r * .4} ${-r * .3} ${-r * .8} ${-r * .2} ${-r * 1.04} ${r * .3}Z`, c, 6)],
  bun: (c) => (r) => [circ(r * .1, -r * 1.08, r * .3, c, 6), path(`M${-r * 1.0} ${-r * .1}C${-r * 1.0} ${-r * 1.02} ${r * 1.0} ${-r * 1.02} ${r * 1.0} ${-r * .1}C${r * .6} ${-r * .62} ${-r * .6} ${-r * .62} ${-r * 1.0} ${-r * .1}Z`, c, 6)],
  curly: (c) => (r) => { let s = ''; for (let i = 0; i < 9; i++) { const a = R(170 + i * 25); s += circ(Math.cos(a) * r * .9, Math.sin(a) * r * .9 - r * .1, r * .26, c, 5); } return [s, '']; },
  bald: (c) => (r) => ['', ell(-r * .98, -r * .05, r * .16, r * .24, c, 5) + ell(r * .98, -r * .05, r * .16, r * .24, c, 5)],
  cap: (c) => (r) => ['', path(`M${-r * .98} ${-r * .25}C${-r * 1.0} ${-r * 1.05} ${r * 1.0} ${-r * 1.05} ${r * .98} ${-r * .25}Z`, c, 6) + rect(-r * .98, -r * .32, r * 1.96, r * .16, shade(c, -.2), r * .06, 5) + circ(0, -r * .62, r * .1, '#f2c94c', 4)],
  scrub: (c) => (r) => ['', path(`M${-r * 1.0} ${-r * .2}C${-r * 1.05} ${-r * 1.1} ${r * 1.05} ${-r * 1.1} ${r * 1.0} ${-r * .2}C${r * .6} ${-r * .34} ${-r * .6} ${-r * .34} ${-r * 1.0} ${-r * .2}Z`, c, 6)],
  chef: (c) => (r) => ['', rect(-r * .75, -r * 1.55, r * 1.5, r * 1.0, '#fff', r * .2, 6) + rect(-r * .9, -r * .7, r * 1.8, r * .28, '#fff', r * .1, 6) + line(-r * .85, -r * .56, r * .85, -r * .56, 8, '#5aa9e6')],
  none: () => () => ['', ''],
};

// membre fil (trait foncé, bouts ronds)
function stLimb(x, y, a1, l1, a2, l2, w = 9, col = OL) {
  const x1 = x + Math.cos(R(a1)) * l1, y1 = y + Math.sin(R(a1)) * l1;
  const x2 = x1 + Math.cos(R(a2)) * l2, y2 = y1 + Math.sin(R(a2)) * l2;
  return { svg: path(`M${f1(x)} ${f1(y)}L${f1(x1)} ${f1(y1)}L${f1(x2)} ${f1(y2)}`, 'none', w, col), x: x2, y: y2 };
}

// PERSONNAGE « STICK ». Origine = sol entre les pieds. Hauteur ≈ 500 px à s = 1.
// o : x y s rot flip lean tilt | body bw bh | hr hair hairColor expr face look mustache glasses mask
//     legs [[a1,a2],[a1,a2]] arms [[a1,a2],[a1,a2]] (degrés, 90 = vers le bas) | holdL holdR (svg à la main)
//     coat (blouse) tie tag apron | shoes | shadow:false | armsBack
function stick(o, t = 0) {
  const r = o.hr || 100, col = o.body || '#e8724a';
  const bw = o.bw || 136, bh = o.bh || 182, legLen = o.legLen ?? 140;
  const hipY = -legLen, bob = (o.bob ?? 1) * wave(t, .9, 3, o.seed || 0);
  const bot = hipY + 22, top = bot - bh + bob;
  let s = '';
  // jambes
  const legs = o.legs || [[97, 92], [83, 88]];
  if (legLen > 0) [-1, 1].forEach((sd, i) => {
    const [a1, a2] = legs[i], L = stLimb(sd * 24, hipY, a1, legLen * .52, a2, legLen * .5);
    const dir = Math.cos(R(a2)) * 6 + (o.flip ? -8 : 8);
    s += L.svg + ell(L.x + dir, L.y + 2, 23, 11, o.shoes || '#f0a0b4', 5);
  });
  // corps capsule en volume
  // corps en cloche (épaules étroites, bas large et arrondi)
  const tw = bw * .34, rb = bw * .3;
  const bodyD = `M${-tw} ${top + tw}Q${-tw} ${top} 0 ${top}Q${tw} ${top} ${tw} ${top + tw}L${bw / 2} ${bot - rb}Q${bw / 2} ${bot} ${bw / 2 - rb} ${bot}L${-bw / 2 + rb} ${bot}Q${-bw / 2} ${bot} ${-bw / 2} ${bot - rb}Z`;
  const bodyR = (fill, sw) => path(bodyD, fill, sw);
  let body = bodyR(col, 0) + bodyR('url(#stVol)', 0) + bodyR('url(#stVolV)', 0);
  if (o.coat) body += path(`M${-bw * .2} ${top + 6}L0 ${top + bh * .42}L${bw * .2} ${top + 6}`, o.tie ? '#fff' : 'none', 0) + (o.tie ? path(`M-10 ${top + 10}L10 ${top + 10}L6 ${top + bh * .32}L0 ${top + bh * .4}L-6 ${top + bh * .32}Z`, o.tie, 4) : '') + path(`M${-bw * .22} ${top + 4}L${-bw * .04} ${top + bh * .5}M${bw * .22} ${top + 4}L${bw * .04} ${top + bh * .5}L${bw * .04} ${bot - 4}`, 'none', 5);
  if (o.apron) body += path(`M${-bw * .36} ${top + bh * .3}L${bw * .36} ${top + bh * .3}L${bw * .42} ${bot - 6}L${-bw * .42} ${bot - 6}Z`, o.apron, 5) + path(`M${-bw * .34} ${top + bh * .3}Q0 ${top - 10} ${bw * .34} ${top + bh * .3}`, 'none', 5);
  if (o.tag) body += rect(bw * .08, top + bh * .3, bw * .3, bw * .2, '#fff', 4, 4) + rect(bw * .08, top + bh * .3, bw * .3, bw * .07, o.tag, 2, 0);
  if (o.badge) body += rect(-bw * .38, top + bh * .3, bw * .28, bw * .2, '#fff', 4, 4) + circ(-bw * .24, top + bh * .3 + bw * .1, bw * .05, '#5aa9e6', 0);
  body += bodyR('none', SW);
  // bras
  const arms = o.arms || [[105, 95], [75, 85]];
  const shY = top + 42 + (o.shY || 0);
  let armS = '';
  [-1, 1].forEach((sd, i) => {
    const [a1, a2] = arms[i], A = stLimb(sd * (bw / 2 - 12), shY, a1, 76, a2, 70);
    armS += A.svg + circ(A.x, A.y, 11, OL, 0);
    const h = i ? o.holdR : o.holdL; if (h) armS += G(tr(A.x, A.y, 1, i ? (o.holdRrot || 0) : (o.holdLrot || 0)), h);
  });
  // tête
  const hs = HAIRS[o.hair || 'none'];
  const hd = head(Object.assign({}, o, { hr: r, skin: o.skin || HEADW, cheeks: o.cheeks ?? false, hairFn: hs ? hs(o.hairColor || '#3b3040') : undefined, x: 0, y: 0 }), t);
  const must = o.must ? path(`M${-r * .32} ${r * .3}Q${-r * .16} ${r * .14} 0 ${r * .24}Q${r * .16} ${r * .14} ${r * .32} ${r * .3}Q${r * .16} ${r * .36} 0 ${r * .3}Q${-r * .16} ${r * .36} ${-r * .32} ${r * .3}Z`, o.must, 4) : '';
  const headS = G(tr(0, top - r * .78, 1, o.tilt || 0), o.headWrap ? o.headWrap(hd + must, r, t) : hd + must);
  const upper = (o.armsBack ? armS + body : body) + headS + (o.armsBack ? '' : armS) + (o.over || '');
  s += G(`rotate(${o.lean || 0} 0 ${hipY})`, upper);
  const shadow = o.shadow === false ? '' : ell(0, 6, 90 * (o.shadowK || 1), 15, 'rgba(0,0,0,.17)', 0);
  if (o.rim !== false) s = `<g filter="url(#rimF)">${s}</g>`;
  return G(tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''), shadow + s);
}
// cycle de marche : renvoie {legs, arms, bob}
function walkPose(t, sp = 1, amp = 1) {
  const p = t * sp * Math.PI * 2 * 1.5, a = Math.sin(p) * 26 * amp, k = Math.cos(p);
  return {
    legs: [[90 + a, 90 + a + 30 * Math.max(0, k) * amp], [90 - a, 90 - a + 30 * Math.max(0, -k) * amp]],
    arms: [[100 - a * .8, 92 - a * .6], [80 + a * .8, 88 + a * .6]],
  };
}
// pose assise (sur une chaise / un banc à hauteur ~ -150)
const SIT = { legs: [[20, 92], [12, 88]], legLen: 140 };

// ---------- passe lumière ----------
function lightRays(T, o = {}) {
  const ang = o.ang ?? 22, n = o.n ?? 5, op_ = o.o ?? .16, col = o.c || '#fff6d8', x0 = o.x ?? -200;
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * (o.gap ?? 300) + wave(T, .05, 40, i * .3), w = 70 + (i * 53 % 120);
    const a = op_ * (.6 + .4 * Math.sin(T * .7 + i * 1.7));
    s += `<path d="M${f1(x)} -100L${f1(x + w)} -100L${f1(x + w + 1400)} ${H + 200}L${f1(x + 1400 - w)} ${H + 200}Z" fill="${col}" opacity="${a.toFixed(3)}" transform="rotate(${-ang} ${f1(x)} 0)"/>`;
  }
  return blur(26, `<g style="mix-blend-mode:screen">${s}</g>`);
}
function bloom(svg, px = 18, o = .8) { return svg + `<g style="mix-blend-mode:screen" opacity="${o}">${blur(px, svg)}</g>`; }
function grain(T, o = .06) {
  const seed = Math.floor(T * 30) % 24;
  return `<defs>${FLOW_DEFS.match(/<filter id="grainF"[\s\S]*?<\/filter>/)[0].replace('grainF', 'grainF' + seed).replace('SEED', seed)}</defs><rect width="${W}" height="${H}" filter="url(#grainF${seed})" opacity="${o}" style="mix-blend-mode:overlay"/>`;
}
// aberration chromatique (décalage rouge / bleu) sur un bloc
function chroma(svg, px = 3) {
  if (px < .5) return svg;
  const id = 'ca' + Math.round(px * 10);
  return `<defs><filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
<feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/><feOffset in="r" dx="${px}" result="r2"/>
<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g"/>
<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b"/><feOffset in="b" dx="${-px}" result="b2"/>
<feComposite in="r2" in2="g" operator="arithmetic" k2="1" k3="1" result="rg"/><feComposite in="rg" in2="b2" operator="arithmetic" k2="1" k3="1"/></filter></defs><g filter="url(#${id})">${svg}</g>`;
}
// glitch : bandes horizontales décalées + RGB
function glitchFx(svg, k, T, seed = 1) {
  if (k <= .01) return svg;
  const r = rng(seed + Math.floor(T * 24)); let s = '';
  const n = 9, hb = H / n;
  for (let i = 0; i < n; i++) {
    const dx = (r() - .5) * 260 * k * (r() < .6 ? 1 : 0), id = 'gl' + (_gid++);
    s += `<defs><clipPath id="${id}"><rect x="-50" y="${f1(i * hb)}" width="${W + 100}" height="${f1(hb + 1)}"/></clipPath></defs><g clip-path="url(#${id})"><g transform="translate(${f1(dx)} 0)">${svg}</g></g>`;
  }
  return chroma(s, 6 + 18 * k) + (k > .4 ? `<rect y="${f1(r() * H)}" width="${W}" height="${f1(20 + r() * 60)}" fill="#ff2bd6" opacity=".35" style="mix-blend-mode:screen"/>` : '');
}

// ---------- géométrie portail (zoom d'un rectangle vers le plein cadre) ----------
// renvoie la transform qui amène progressivement `rc` sur le cadre entier (k = 0 → identité, 1 → rc plein cadre)
function portalTf(rc, k) {
  const S = W / rc.w, s = Math.pow(S, k);
  if (Math.abs(S - 1) < 1e-4) return '';
  const px = S * rc.x / (S - 1), py = S * rc.y / (S - 1);
  return `translate(${(px - px * s).toFixed(2)} ${(py - py * s).toFixed(2)}) scale(${s.toFixed(5)})`;
}
// place un contenu plein cadre dans le rectangle rc (avec coins arrondis) — pour dessiner « l'écran »
function inRect(rc, svg, rr = 8) {
  const id = 'pr' + (_gid++);
  return `<defs><clipPath id="${id}"><rect x="${f1(rc.x)}" y="${f1(rc.y)}" width="${f1(rc.w)}" height="${f1(rc.h)}" rx="${rr}"/></clipPath></defs><g clip-path="url(#${id})"><g transform="translate(${f1(rc.x)} ${f1(rc.y)}) scale(${(rc.w / W).toFixed(5)})">${svg}</g></g>`;
}
// point de la couche z=1 de depth(cam) → coordonnées écran
function dpt(cam, x, y) { const z = cam.zoom ?? 1; return [CXc - (cam.x || 0) + (x - CXc) * z, CYc - (cam.y || 0) + (y - CYc) * z]; }
function drect(cam, x, y, w, h) { const [a, b] = dpt(cam, x, y), z = cam.zoom ?? 1; return { x: a, y: b, w: w * z, h: h * z }; }

// ---------- caméra 3D-lite : décors en vraie perspective ----------
// c = {x, y, z (position, m), pitch (° vers le bas), yaw (°), f (focale px)}
function cam3(o) { const p = R(o.pitch || 0), yw = R(o.yaw || 0); return Object.assign({ f: 1500, x: 0, y: 1.6, z: 0 }, o, { cp: Math.cos(p), sp: Math.sin(p), cyw: Math.cos(yw), syw: Math.sin(yw) }); }
function P3(c, X, Y, Z) {
  const dx = X - c.x, dy = Y - c.y, dz0 = Z - c.z;
  const dx2 = dx * c.cyw - dz0 * c.syw, dz = dx * c.syw + dz0 * c.cyw;
  const y2 = dy * c.cp + dz * c.sp, z2 = dz * c.cp - dy * c.sp;
  return [W / 2 + c.f * dx2 / z2, H / 2 - c.f * y2 / z2, z2];
}
// polygone 3D (liste de [X,Y,Z])
function poly3(c, pts, fill, sw = 0, stroke = OL, extra = '') {
  const P = pts.map(p => P3(c, ...p));
  if (P.some(p => p[2] < .05)) return '';
  return `<path d="M${P.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L')}Z" fill="${fill}" stroke="${sw ? stroke : 'none'}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>`;
}
// sol carrelé (plan Y=0) de x0..x1, z0..z1
function floor3(c, x0, x1, z0, z1, step, c1, c2, joint = 'rgba(40,50,70,.35)') {
  let s = '';
  for (let x = x0; x < x1; x += step) for (let z = z0; z < z1; z += step) {
    const odd = (Math.round((x - x0) / step) + Math.round((z - z0) / step)) % 2;
    s += poly3(c, [[x, 0, z], [x + step, 0, z], [x + step, 0, z + step], [x, 0, z + step]], odd ? c1 : c2, 2.5, joint);
  }
  return s;
}
// mur vertical (plan Z = zw) : rectangle x0..x1, y0..y1
function wall3(c, zw, x0, x1, y0, y1, fill, sw = 0) { return poly3(c, [[x0, y0, zw], [x1, y0, zw], [x1, y1, zw], [x0, y1, zw]], fill, sw); }
// sprite 2D posé au point 3D (pied) — échelle = px par mètre / pxm
function sprite3(c, X, Y, Z, fn, pxm = 290) { const [x, y, z] = P3(c, X, Y, Z); if (z < .1) return ''; return G(tr(x, y, c.f / z / pxm), fn); }
// rectangle écran (portail) d'un plan vertical 3D
function rect3(c, zw, x0, x1, y0, y1) { const a = P3(c, x0, y1, zw), b = P3(c, x1, y0, zw); return { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] }; }
