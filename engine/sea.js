// ============================================================
//  Faune marine & plage — même langage graphique (contours épais, yeux points, joues roses)
//  tortue (profil / face / dessus), œuf, aigle & mouette, crabe, poissons, requin, méduse,
//  sac plastique, algues, filet, hôtels, route, voiture, lampadaire, thermomètre, Terre magnétique.
//  Décors 16:9 : bgBeach, bgNightBeach, bgSand (coupe du sable), bgUnder, bgSplit (surface).
// ============================================================
const T_SKIN = '#9ed68c', T_SKIN_D = '#7bbb6a';
const T_SHELL = '#5f9a55', T_SHELL_L = '#86bd6b', T_SHELL_D = '#3f7a3f';
const T_BABY_SHELL = '#5d6f58', T_BABY_SHELL_L = '#7f9478', T_BABY_SKIN = '#8fb8a0';
const PLASTRON = '#efe0a8';
const SAND = '#f3d9a4', SAND_D = '#e2bf7f', SAND_W = '#d9b273';
const SEA = '#3fb6d9', SEA_D = '#1f7fae';

// palette selon l'âge
function tPal(o) {
  const baby = o.age === 'baby';
  return {
    skin: o.skin || (baby ? T_BABY_SKIN : T_SKIN),
    shell: o.shell || (baby ? T_BABY_SHELL : T_SHELL),
    shellL: o.shellL || (baby ? T_BABY_SHELL_L : T_SHELL_L),
  };
}

// petit nœud rose = l'héroïne (pour la repérer parmi ses frères et sœurs)
function bow(x, y, s = 1, r = 0, c = '#ff6fa5') {
  return G(tr(x, y, s, r), path('M0 0C-30 -34 -62 -22 -58 4C-54 28 -24 22 0 0Z', c, 5) + path('M0 0C30 -34 62 -22 58 4C54 28 24 22 0 0Z', c, 5) + circ(0, 0, 11, shade(c, -.15), 5));
}

// nageoire en forme de pagaie (ou de petite cuillère pour le bébé)
function flipper(len, w, col, spoon) {
  if (spoon) return line(0, 0, len * .62, 0, w * .5 + SW * 2 - 2) + line(0, 0, len * .62, 0, w * .5, col) + ell(len * .78, 0, len * .26, w * .52, col);
  return path(`M0 ${-w * .45}C${len * .4} ${-w * .7} ${len * .85} ${-w * .55} ${len} ${-w * .05}C${len * .9} ${w * .35} ${len * .4} ${w * .5} 0 ${w * .45}Z`, col);
}

// tête de tortue (réutilise head() de lib.js : yeux, bouche, joues, expressions)
function tHead(o, r, t, skin) {
  let s = head(Object.assign({}, o, { hr: r, skin, hair: 'none', seed: o.seed || 2, look: o.look || [.7, 0] }), t);
  // écailles sur le crâne
  s += path(`M${-r * .25} ${-r * .72}l${r * .14} ${-r * .08}l${r * .14} ${r * .06}l${-r * .04} ${r * .12}l${-r * .18} ${r * .02}Z`, shade(skin, -.12), 0);
  s += path(`M${r * .12} ${-r * .8}l${r * .12} ${-r * .04}l${r * .1} ${r * .08}l${-r * .08} ${r * .1}l${-r * .12} ${-r * .04}Z`, shade(skin, -.12), 0);
  if (o.lashes) for (const sd of [-1, 1]) { const ex = sd * r * .34 + (o.look ? o.look[0] : .7) * r * .12; s += line(ex + sd * r * .1, -r * .08, ex + sd * r * .2, -r * .18, 5) + line(ex + sd * r * .02, -r * .12, ex + sd * r * .06, -r * .24, 5); }
  if (o.bow) s += bow(-r * .55, -r * .78, r / 95, -25);
  if (o.tuft) s += path(`M${-r * .05} ${-r}C${-r * .02} ${-r * 1.2} ${r * .2} ${-r * 1.24} ${r * .16} ${-r * 1.06}`, 'none', 6);
  return s;
}

// TORTUE DE PROFIL (tournée vers la droite). origine = sous la carapace, au sol.
// o: age 'baby'|'adult', expr, look, bow, lashes, neck(0..1 sortie du cou), walk (vitesse pattes), swim (brasse),
//    headTilt, headDx/headDy, fly (pattes écartées), squash, hold (svg tenu par la nageoire avant)
function turtle(o, t = 0) {
  const baby = o.age === 'baby', P = tPal(o);
  const rx = baby ? 100 : 150, h = (baby ? 82 : 100) * (o.dome || 1), hr = baby ? 68 : 56;
  const seed = o.seed || 0;
  let fa = 0, ra = 0;
  if (o.walk) { fa = wave(t, 2.2 * o.walk, 28, seed); ra = wave(t, 2.2 * o.walk, 22, seed + .5); }
  if (o.swim) { fa = wave(t, .9 * o.swim, 42, seed); ra = wave(t, .9 * o.swim, 18, seed + .3); }
  if (o.flail) { fa = wave(t, 5, 50, seed); ra = wave(t, 5.5, 40, seed + .3); }
  if (o.fa !== undefined) fa = o.fa;
  const neck = o.neck ?? 1;
  const hx0 = rx * .72, hy0 = -h * .42;
  const hx = lerp(hx0, rx + hr * (baby ? .7 : 1.3), neck) + (o.headDx || 0);
  const hy = lerp(hy0, -h * (baby ? .62 : .55), neck) + (o.headDy || 0) + (o.bob ?? 1) * wave(t, 1.1, 3, seed);
  const flen = baby ? 70 : 150, fw = baby ? 30 : 46;
  let back = '', front = '';
  // nageoires côté lointain (plus sombres)
  back += G(tr(rx * .42, -h * .12, 1, 40 - fa * .8), flipper(flen * .9, fw * .9, shade(P.skin, -.18), baby && !o.swim));
  back += G(tr(-rx * .7, -h * .05, 1, 160 + ra * .8), flipper(flen * .55, fw * .7, shade(P.skin, -.18), false));
  // cou + tête
  const nk = `M${rx * .55} ${-h * .3}L${hx} ${hy}`;
  const neckS = path(nk, 'none', hr * 1.05 + SW * 2) + path(nk, 'none', hr * 1.05, P.skin);
  const headS = G(tr(hx, hy, 1, o.headTilt || 0), tHead(o, hr, t, P.skin));
  // queue
  back += path(`M${-rx * .9} ${-h * .18}L${-rx * 1.12} ${-h * .05}L${-rx * .88} ${-h * .02}Z`, P.skin);
  // carapace
  const id = 'sh' + (_gid++);
  const dome = `M${-rx} 0C${-rx * 1.02} ${-h * 1.3} ${rx * .92} ${-h * 1.36} ${rx} 0Z`;
  let shell = `<defs><clipPath id="${id}"><path d="${dome}"/></clipPath></defs>`;
  shell += path(`M${-rx * 1.04} 2Q0 ${h * .22} ${rx * 1.04} 2Z`, PLASTRON, 6);
  shell += path(dome, P.shell, 0);
  let sc = '';
  sc += path(`M${-rx * .28} ${-h * .62}L${-rx * .12} ${-h * 1.02}L${rx * .16} ${-h * 1.02}L${rx * .32} ${-h * .62}L${rx * .16} ${-h * .3}L${-rx * .12} ${-h * .3}Z`, P.shellL, 5, shade(P.shell, -.25));
  sc += path(`M${-rx * .38} ${-h * .62}L${-rx * .25} ${-h * .3}L${-rx * .62} ${-h * .22}L${-rx * .78} ${-h * .52}L${-rx * .55} ${-h * .9}Z`, P.shellL, 5, shade(P.shell, -.25));
  sc += path(`M${rx * .42} ${-h * .62}L${rx * .28} ${-h * .3}L${rx * .64} ${-h * .22}L${rx * .8} ${-h * .5}L${rx * .58} ${-h * .88}Z`, P.shellL, 5, shade(P.shell, -.25));
  for (let i = -4; i <= 4; i++) sc += line(i * rx * .22, -h * .16, i * rx * .24, 0, 5, shade(P.shell, -.25));
  sc += path(`M${-rx} ${-h * .14}Q0 ${-h * .2} ${rx} ${-h * .14}`, 'none', 5, shade(P.shell, -.25));
  sc += path(`M${-rx * .55} ${-h * .95}Q${-rx * .2} ${-h * 1.18} ${rx * .2} ${-h * 1.1}`, 'none', 9, 'rgba(255,255,255,.35)');
  shell += `<g clip-path="url(#${id})">${sc}</g>` + path(dome, 'none');
  if (o.crack) shell += path(`M${-rx * .1} ${-h * .95}l${rx * .1} ${h * .2}l${-rx * .12} ${h * .16}l${rx * .14} ${h * .2}`, 'none', 5);
  if (o.band) shell += path(`M${-rx * .3} ${-h * .95}L${rx * .1} ${-h * .3}`, 'none', 26, '#fff4e0') + path(`M${-rx * .3} ${-h * .95}L${rx * .1} ${-h * .3}`, 'none', 4, 'rgba(0,0,0,.2)');
  // nageoires côté proche
  front += G(tr(-rx * .62, -h * .02, 1, 165 - ra), flipper(flen * .6, fw * .75, P.skin, false));
  front += G(tr(rx * .5, -h * .12, 1, (o.flipUp ? -60 : 35) + fa), flipper(flen, fw, P.skin, baby && !o.swim) + (o.hold ? G(tr(flen * .9, 0, 1, -35 - fa), o.hold) : ''));
  if (o.hurt) front += G(tr(rx * .5, -h * .12, 1, 35 + fa), path(`M${flen * .45} -14l10 14l-8 6l10 12`, 'none', 5, '#e2463a'));
  const body = back + (neck > .15 ? neckS : '') + (o.headBehind ? headS : '') + shell + (o.headBehind ? '' : headS) + front;
  const sq = o.squash || 0;
  const tj = o.tremble ? [Math.sin(t * 61) * 4 * o.tremble, Math.cos(t * 57) * 3 * o.tremble] : [0, 0];
  let under = '', over = '';
  if (o.pee) { const k = clamp(o.pee); under += ell(-rx * .55, 6, rx * 1.3 * k, 16 + 22 * k, 'rgba(255,214,60,.75)', 4, 'rgba(200,150,20,.6)') + ell(-rx * .7, 2, rx * .4 * k, 6 * k, 'rgba(255,255,255,.6)', 0);
    if (k < 1) for (let i = 0; i < 3; i++) { const q = (t * 3 + i / 3) % 1; over += circ(-rx * .8, -h * .1 + q * h * .2, 6, '#ffd63c', 3, '#c9961a'); } }
  if (o.zzz) for (let i = 0; i < 3; i++) { const q = (t * .5 + i / 3) % 1; over += op(1 - q, G(tr(hx + 40 + q * 90, hy - hr - 20 - q * 150, .5 + q * .6), text(0, 0, OL, 'z', '#fff', 70))); }
  if (o.ghost) { const q = clamp(o.ghost); over += op(.75 * q, G(tr(hx, hy - hr * 1.6 - q * 120, 1, wave(t, 1, 8)), path(`M${-hr * .8} 0C${-hr} ${-hr * 1.7} ${hr} ${-hr * 1.7} ${hr * .8} 0Q${hr * .5} ${-hr * .2} ${hr * .3} ${hr * .2}Q0 ${-hr * .1} ${-hr * .3} ${hr * .2}Q${-hr * .5} ${-hr * .2} ${-hr * .8} 0Z`, '#ffffff', 5) + circ(-hr * .3, -hr * .8, 8, OL, 0) + circ(hr * .3, -hr * .8, 8, OL, 0) + ell(0, -hr * .45, 12, 16, OL, 0))); }
  return G(tr((o.x || 0) + tj[0], (o.y || 0) + tj[1], o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : '') + (sq ? ` scale(${1 + sq * .2} ${1 - sq * .2})` : ''), under + body + over);
}

// TORTUE DE FACE (gros plans) — origine au sol. r = rayon de la tête. armL/armR = angles des nageoires.
function turtleFront(o, t = 0) {
  const P = tPal(o), r = o.r || 120;
  const bobY = (o.bob ?? 1) * wave(t, .9, 5, o.seed || 0);
  let s = '';
  // carapace derrière
  s += ell(0, -r * 1.0, r * 1.55, r * 1.05, P.shell);
  for (let i = 0; i < 9; i++) { const a = R(200 + i * 17.5); s += line(Math.cos(a) * r * 1.2, -r * 1.0 + Math.sin(a) * r * .8, Math.cos(a) * r * 1.52, -r * 1.0 + Math.sin(a) * r * 1.03, 5, shade(P.shell, -.25)); }
  // nageoires arrière
  s += G(tr(-r * .7, -r * .15, 1, 150), flipper(r * .7, r * .38, P.skin, false)) + G(tr(r * .7, -r * .15, 1, 30), flipper(r * .7, r * .38, P.skin, false));
  // plastron
  s += ell(0, -r * .85, r * .95, r * .85, PLASTRON);
  s += path(`M${-r * .8} ${-r * 1.05}Q0 ${-r * .95} ${r * .8} ${-r * 1.05}M${-r * .9} ${-r * .7}Q0 ${-r * .6} ${r * .9} ${-r * .7}M${-r * .75} ${-r * .35}Q0 ${-r * .28} ${r * .75} ${-r * .35}M0 ${-r * 1.65}L0 ${-r * .05}`, 'none', 5, 'rgba(120,90,40,.45)');
  // nageoires avant (bras)
  const aL = o.armL ?? 200, aR = o.armR ?? -20;
  const fl = (a, sd, hold) => G(tr(sd * r * .8, -r * 1.25, 1, a), flipper(r * 1.05, r * .5, P.skin, o.age === 'baby') + (hold ? G(tr(r * 1.0, 0, 1, -a), hold) : ''));
  const arms = fl(aL, -1, o.holdL) + fl(aR, 1, o.holdR);
  // tête
  const hs = G(tr(0, -r * 2.05 + bobY, 1, o.headTilt || 0), tHead(Object.assign({ look: [0, 0] }, o), r, t, P.skin));
  s += path(`M0 ${-r * 1.4}L0 ${-r * 2.0}`, 'none', r * 1.0 + SW * 2) + path(`M0 ${-r * 1.4}L0 ${-r * 2.0}`, 'none', r * 1.0, P.skin);
  s += o.armsBack ? arms + hs : hs + arms;
  if (o.pee) s = ell(0, 0, r * 1.9 * clamp(o.pee), r * .3 * clamp(o.pee) + 6, 'rgba(255,214,60,.75)', 4, 'rgba(200,150,20,.6)') + s;
  const tj = o.tremble ? [Math.sin(t * 61) * 5 * o.tremble, Math.cos(t * 57) * 4 * o.tremble] : [0, 0];
  return G(tr((o.x || 0) + tj[0], (o.y || 0) + tj[1], o.s || 1, o.rot || 0), s);
}

// TORTUE VUE DE DESSUS (plans en plongée) — tête vers le haut (rot pour orienter)
function turtleTop(o, t = 0) {
  const P = tPal(o), baby = o.age === 'baby';
  const L = baby ? 90 : 140, Wd = baby ? 78 : 110;
  const ph = o.walk ? wave(t, 2.2 * o.walk, 26, o.seed || 0) : o.swim ? wave(t, .9 * o.swim, 40, o.seed || 0) : 0;
  let s = '';
  for (const sd of [-1, 1]) {
    s += G(tr(sd * Wd * .7, -L * .45, 1, (sd < 0 ? 200 : -20) + sd * ph), flipper(baby ? 70 : 140, baby ? 28 : 44, P.skin, baby));
    s += G(tr(sd * Wd * .6, L * .6, 1, (sd < 0 ? 140 : 40) - sd * ph * .7), flipper(baby ? 40 : 70, baby ? 20 : 32, P.skin, false));
  }
  s += path(`M0 ${L * .8}L0 ${L * 1.05}`, 'none', 10 + SW * 2) + path(`M0 ${L * .8}L0 ${L * 1.05}`, 'none', 10, P.skin);
  const hr = baby ? 46 : 46;
  let hd = circ(0, 0, hr, P.skin) + circ(-hr * .42, -hr * .25, hr * .13, OL, 0) + circ(hr * .42, -hr * .25, hr * .13, OL, 0) + circ(-hr * .38, -hr * .3, hr * .05, '#fff', 0) + circ(hr * .46, -hr * .3, hr * .05, '#fff', 0);
  if (o.bow) hd += bow(0, hr * .4, .55);
  s += G(tr(0, -L - hr * .55), hd);
  s += ell(0, 0, Wd, L, P.shell);
  s += path(`M0 ${-L * .6}L${Wd * .3} ${-L * .3}L${Wd * .3} ${L * .2}L0 ${L * .5}L${-Wd * .3} ${L * .2}L${-Wd * .3} ${-L * .3}Z`, P.shellL, 5, shade(P.shell, -.25));
  for (const sd of [-1, 1]) s += path(`M${sd * Wd * .3} ${-L * .3}L${sd * Wd * .82} ${-L * .45}M${sd * Wd * .3} ${L * .2}L${sd * Wd * .86} ${L * .35}`, 'none', 5, shade(P.shell, -.25));
  s += ell(0, 0, Wd * .86, L * .88, 'none', 5, shade(P.shell, -.25));
  return G(tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0), s);
}

// ŒUF (crack 0..1 : fissures puis bébé qui sort la tête)
function egg(x, y, s = 1, crack = 0, t = 0, o = {}) {
  let e = ell(0, 0, 52, 56, '#fbf6ea') + ell(-16, -18, 12, 16, 'rgba(255,255,255,.9)', 0);
  if (crack > .05) e += path(`M-50 -4l16 -12l12 14l14 -16l14 12l12 -10l12 10`, 'none', 5);
  if (crack > .5) {
    const k = seg(crack, .5, 1);
    e = ell(0, 10, 52, 46, '#fbf6ea') + G(tr(0, -20 - k * 40, 1, k * -20), path('M-50 -4l16 -12l12 14l14 -16l14 12l12 -10l12 10C50 -60 -50 -60 -50 -4Z', '#fbf6ea'));
    e += G(tr(0, -10 - k * 10), circ(0, 0, 38, T_BABY_SKIN) + circ(-12, -4, 5, OL, 0) + circ(12, -4, 5, OL, 0) + ell(-24, 8, 7, 4, CHEEK, 0) + ell(24, 8, 7, 4, CHEEK, 0) + (o.bow ? bow(-22, -28, .35, -25) : ''));
    e += ell(0, 18, 52, 30, '#fbf6ea', 0) + path('M-52 10Q-50 60 0 62Q50 60 52 10', 'none') + path('M-52 10l14 -10l12 12l14 -14l14 12l12 -10l12 10', 'none', 5);
  }
  return G(tr(x, y, s, o.r || 0), e);
}

// AIGLE / MOUETTE de profil (tourné vers la gauche). flap = battements/s, talons 'open'|'closed'|'grab'
function eagle(o, t = 0) {
  const gull = o.gull;
  const C = gull ? { body: '#f4f4f2', wing: '#aab6c2', wingD: '#7d8b99', head: '#ffffff', beak: '#f39c32', tail: '#e9ecef' }
    : { body: '#6b4a2f', wing: '#5a3d26', wingD: '#3f2a1a', head: '#ffffff', beak: '#ffc93c', tail: '#ffffff' };
  const fl = o.wingA !== undefined ? o.wingA : wave(t, o.flap ?? 1.6, 38, o.seed || 0);
  let s = '';
  const wing = (dy, col, k) => G(tr(30, -20 + dy, 1, fl * k - 10), path('M0 0C60 -120 200 -210 360 -230L330 -190L380 -170L330 -140L360 -110L300 -95L320 -60C220 -40 100 -10 0 30Z', col) + path('M120 -70L250 -150M90 -30L230 -90', 'none', 5, 'rgba(0,0,0,.2)'));
  s += wing(0, C.wingD, 1);
  // queue
  s += path('M150 0L270 -30L285 10L270 50L150 30Z', C.tail);
  // pattes / serres
  const tal = o.talons || 'closed';
  const legDown = tal === 'open' || tal === 'grab' ? 1 : .4;
  for (const dx of [20, 60]) {
    const ly = 50 + 50 * legDown;
    s += line(dx, 20, dx - 10, ly, 16, OL) + line(dx, 20, dx - 10, ly, 8, '#ffc93c');
    const op_ = tal === 'open' ? 1 : tal === 'grab' ? .3 : 0;
    for (const a of [-50, 0, 50]) s += G(tr(dx - 10, ly, 1, 90 + a * (.4 + op_ * .9)), path('M0 0L26 0Q36 2 38 12', 'none', 8) + path('M0 0L26 0', 'none', 4, '#ffc93c'));
  }
  // corps
  s += path('M-70 -30C-40 -70 120 -60 170 -10C190 20 120 50 40 50C-20 50 -80 20 -70 -30Z', C.body);
  if (!gull) s += path('M60 30Q100 40 140 20M30 10Q80 22 120 0', 'none', 5, 'rgba(0,0,0,.25)');
  // tête
  const hx = -80, hy = -55;
  s += circ(hx, hy, 62, C.head);
  s += path(`M${hx - 52} ${hy - 6}C${hx - 110} ${hy - 10} ${hx - 125} ${hy + 30} ${hx - 100} ${hy + 46}C${hx - 104} ${hy + 22} ${hx - 80} ${hy + 18} ${hx - 52} ${hy + 22}Z`, C.beak);
  if (o.mouthOpen) s += path(`M${hx - 52} ${hy + 22}L${hx - 98} ${hy + 30}L${hx - 52} ${hy + 40 + o.mouthOpen * 20}Z`, '#7a2b2b', 5);
  const ex = o.expr || (gull ? 'neutral' : 'angry');
  const eyeX = hx - 20, eyeY = hy - 12;
  if (ex === 'shock') s += circ(eyeX, eyeY, 18, '#fff', 5) + circ(eyeX - 3, eyeY, 7, OL, 0);
  else if (ex === 'happy') s += path(`M${eyeX - 14} ${eyeY + 4}Q${eyeX} ${eyeY - 12} ${eyeX + 14} ${eyeY + 4}`, 'none', 7);
  else if (ex === 'sad') s += circ(eyeX, eyeY, 9, OL, 0) + line(eyeX - 22, eyeY - 30, eyeX + 12, eyeY - 18, 7);
  else if (ex !== 'starving') s += circ(eyeX, eyeY, 13, '#ffd23f', 5) + circ(eyeX - 3, eyeY, 7, OL, 0);
  if (ex === 'angry' || ex === 'hungry') s += line(eyeX - 26, eyeY - 30, eyeX + 16, eyeY - 14, 9);
  if (ex === 'hungry') s += path(`M${hx - 90} ${hy + 44}q-4 20 4 34`, 'none', 7, '#8fd0ff') + circ(hx - 86, hy + 82, 7, '#8fd0ff', 0);
  if (ex === 'starving') {
    s += circ(eyeX, eyeY, 22, '#fff7c2', 5) + path(`M${eyeX - 20} ${eyeY}l9 2M${eyeX + 18} ${eyeY - 8}l-8 4M${eyeX} ${eyeY + 20}l1 -8`, 'none', 3, '#ff4d4d') + circ(eyeX - 4 + Math.sin(t * 29) * 3, eyeY, 5, OL, 0) + line(eyeX - 30, eyeY - 38, eyeX + 20, eyeY - 18, 10);
    s += path(`M${hx - 70} ${hy + 30}q-10 30 -40 26`, '#ff8a9a', 5);
    for (let i = 0; i < 3; i++) { const k = (t * 1.1 + i / 3) % 1; const dx = hx - 95 + i * 22; s += path(`M${dx} ${hy + 40}q${-6 + i * 3} ${60 + k * 160} ${2} ${80 + k * 200}`, 'none', 10 - i * 2, 'rgba(190,232,255,.95)') + circ(dx + 2, hy + 84 + k * 200, 9 - i * 2, '#bfe8ff', 3, '#7cc4e8'); }
    s += op(.8, G(tr(60, 70), path('M-30 0q10 -14 20 0t20 0t20 0', 'none', 5, '#fff')));
  }
  if (o.bib) s += G(tr(hx + 10, hy + 40, .55), bib(0, 0));
  s += wing(0, C.wing, 1.15);
  if (o.held) s += G(tr(30, 120), o.held);
  return G(tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''), s);
}
// ombre portée d'oiseau sur le sable
function birdShadow(x, y, s = 1, o = .25) { return G(tr(x, y, s), `<path d="M-260 0C-120 -40 -40 -30 0 -10C40 -30 120 -40 260 0C120 20 40 20 0 30C-40 20 -120 20 -260 0Z" fill="rgba(40,20,10,${o})"/>`); }

// CRABE (face). snap = ouverture des pinces 0..1, walk = vitesse
function crab(o, t = 0) {
  const c = o.color || '#ef6a3e', d = shade(c, -.2);
  const sn = o.snap !== undefined ? o.snap : (.5 + .5 * Math.sin(t * (o.snapF || 6)));
  const wk = o.walk ? wave(t, 3 * o.walk, 12) : 0;
  let s = '';
  for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) {
    const a = sd < 0 ? 160 - i * 22 : 20 + i * 22;
    s += G(tr(sd * 70, 10 + i * 8, 1, a + (i % 2 ? wk : -wk) * sd), path('M0 0L60 -20L95 30', 'none', 18) + path('M0 0L60 -20L95 30', 'none', 8, c));
  }
  // pinces
  for (const sd of [-1, 1]) {
    const arm = G(tr(sd * 80, -20, 1, sd < 0 ? -140 : -40), path('M0 0L80 0', 'none', 22) + path('M0 0L80 0', 'none', 12, c) +
      G(tr(95, 0, 1, 0), ell(10, 0, 42, 32, c) + G(`rotate(${-sn * 35 * sd})`, path('M30 -6C70 -40 100 -20 96 -2L36 6Z', c)) + path('M30 6C70 30 90 26 92 14L36 12Z', d)));
    s += arm;
  }
  // corps
  s += path('M-110 10C-110 -60 110 -60 110 10C110 50 -110 50 -110 10Z', c);
  s += path('M-70 -18Q-60 -30 -50 -18M50 -18Q60 -30 70 -18', 'none', 5, d);
  // yeux pédonculés
  for (const sd of [-1, 1]) s += line(sd * 30, -40, sd * 36, -90, 10) + circ(sd * 38, -100, 20, '#fff') + circ(sd * 38 + (o.look || 0) * 6, -98, 8, OL, 0);
  if (o.angry) s += line(-62, -132, -18, -116, 8) + line(62, -132, 18, -116, 8);
  const m = o.mouth || 'grin';
  if (m === 'grin') s += path('M-34 6Q0 34 34 6Q0 18 -34 6Z', '#7a2b2b', 5);
  else if (m === 'o') s += ell(0, 12, 12, 14, '#7a2b2b', 5);
  else s += path('M-24 10Q0 22 24 10', 'none', 6);
  s += ell(-62, 6, 14, 8, CHEEK, 0) + ell(62, 6, 14, 8, CHEEK, 0);
  if (o.bib) s += G(tr(0, 18, .6), bib(0, 0));
  if (o.fork) s += fork(-150, -40, .8, -20);
  return G(tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''), s);
}

// POISSON (tourné vers la gauche). teeth = prédateur
function fish(o, t = 0) {
  const c = o.color || '#ffb347', d = shade(c, -.2);
  const tw = wave(t, o.tf || 2.4, 14, o.seed || 0);
  let s = '';
  s += G(tr(70, 0, 1, tw), path('M0 0L70 -50Q60 0 70 50Z', d));
  s += path('M-10 -40Q20 -80 50 -40Z', d);
  s += path('M-90 0C-90 -60 60 -60 90 0C60 60 -90 60 -90 0Z', c);
  s += path('M10 -44Q0 0 10 44M40 -36Q30 0 40 36', 'none', 5, 'rgba(0,0,0,.18)');
  if (o.teeth) {
    s += circ(-50, -14, 14, '#fff', 5) + circ(-54, -14, 6, OL, 0) + line(-70, -36, -34, -24, 7);
    s += path('M-92 6L-40 14L-92 30Z', '#7a2b2b', 5) + path('M-86 9L-80 18L-74 10L-68 20L-62 11L-56 21L-50 13', '#fff', 3);
  } else s += circ(-50, -12, 11, OL, 0) + circ(-46, -16, 4, '#fff', 0) + path('M-82 14Q-74 20 -66 14', 'none', 5) + ell(-36, 10, 9, 5, CHEEK, 0);
  return G(tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''), s);
}

// REQUIN (tourné vers la gauche)
function shark(o, t = 0) {
  const c = o.color || '#8fa3b5', d = shade(c, -.2);
  const tw = wave(t, 1.2, 10, o.seed || 0), jaw = o.jaw ?? (.4 + .3 * Math.sin(t * 3));
  let s = '';
  s += G(tr(270, -10, 1, tw), path('M0 0L120 -110Q100 -10 130 70Z', d));
  s += path('M40 -80L90 -190L150 -70Z', d);
  s += path('M60 50L130 110L150 40Z', d);
  s += path('M-280 0C-260 -110 80 -130 290 -10C80 90 -200 100 -280 0Z', c);
  s += path('M-250 20C-150 70 60 70 250 0C60 90 -200 100 -250 20Z', '#f2f5f7', 0);
  for (let i = 0; i < 3; i++) s += path(`M${-80 + i * 26} -20q-10 20 0 40`, 'none', 5, 'rgba(0,0,0,.3)');
  // gueule
  s += G(tr(-200, 30, 1, 0), path(`M-70 -20Q0 ${10 + jaw * 60} 80 -10Q0 ${-10 + jaw * 10} -70 -20Z`, '#7a2b2b', 6) +
    path(`M-60 -16L-50 0L-40 -14L-30 2L-20 -12L-10 4L0 -10L10 4L20 -10L30 2L40 -10L50 0L60 -10`, '#fff', 3));
  s += circ(-170, -40, 18, '#fff', 5) + circ(-176, -40, 8, OL, 0) + line(-200, -70, -140, -54, 9);
  return G(tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''), s);
}

// MÉDUSE
function jelly(o, t = 0) {
  const c = o.color || 'rgba(255,150,200,.75)';
  const pul = 1 + .08 * Math.sin(t * 3 + (o.seed || 0));
  let s = '';
  for (let i = 0; i < 5; i++) { const x = -60 + i * 30; s += path(`M${x} 20q${wave(t, 1, 14, i / 5)} 50 0 100t0 100`, 'none', 7, 'rgba(255,120,180,.7)'); }
  s += G(`scale(${pul} ${2 - pul})`, path('M-90 20C-90 -100 90 -100 90 20Q60 8 30 22Q0 8 -30 22Q-60 8 -90 20Z', c));
  s += circ(-28, -20, 8, OL, 0) + circ(28, -20, 8, OL, 0) + path('M-12 0Q0 10 12 0', 'none', 5) + ell(-50, -4, 10, 6, CHEEK, 0) + ell(50, -4, 10, 6, CHEEK, 0);
  return G(tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0), s);
}

// SAC PLASTIQUE qui flotte (ressemble à une méduse)
function plasticBag(o, t = 0) {
  const wv = k => wave(t, .7, 10, k + (o.seed || 0));
  let s = '';
  s += path(`M-80 -60C-90 -150 -40 -170 -30 -110L30 -110C40 -170 90 -150 80 -60C110 20 ${100 + wv(.1)} 120 ${60 + wv(.2)} 170Q${20 + wv(.3)} 150 0 175Q${-20 + wv(.4)} 150 ${-60 + wv(.5)} 170C${-100 + wv(.6)} 120 -110 20 -80 -60Z`, 'rgba(255,255,255,.55)', 6, 'rgba(60,60,80,.7)');
  s += path('M-50 -40Q-60 60 -40 140M40 -40Q60 60 30 140', 'none', 4, 'rgba(255,255,255,.8)');
  if (o.print !== false) s += G(tr(0, 40), circ(-18, 0, 20, '#ff5d4d', 4, 'rgba(60,60,80,.6)') + circ(18, 0, 20, '#ff5d4d', 4, 'rgba(60,60,80,.6)') + circ(0, -26, 20, '#ff5d4d', 4, 'rgba(60,60,80,.6)'));
  return op(o.o ?? 1, G(tr(o.x || 0, o.y || 0, o.s || 1, (o.rot || 0) + wave(t, .4, 6)), s));
}

// ALGUES FLOTTANTES (sargasses) : tapis à la surface, y = niveau de l'eau
function sargassum(x, y, w, t, seed = 3) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < w / 40; i++) {
    const px = x - w / 2 + r() * w, len = 60 + r() * 120, a = 60 + r() * 60;
    const ex = px + Math.cos(R(a)) * len * .4 + wave(t, .4, 10, r()), ey = y + Math.sin(R(a)) * len;
    s += path(`M${f1(px)} ${y}Q${f1(px + 30)} ${f1(y + len * .5)} ${f1(ex)} ${f1(ey)}`, 'none', 14) + path(`M${f1(px)} ${y}Q${f1(px + 30)} ${f1(y + len * .5)} ${f1(ex)} ${f1(ey)}`, 'none', 7, '#c99a3c');
    s += circ(ex, ey, 9, '#e0b24a', 4) + circ((px + ex) / 2 + 14, (y + ey) / 2, 7, '#e0b24a', 4);
  }
  s += path(`M${x - w / 2} ${y}Q${x} ${y - 30} ${x + w / 2} ${y}Q${x} ${y + 40} ${x - w / 2} ${y}Z`, '#b8862e');
  for (let i = 0; i < w / 60; i++) s += circ(x - w / 2 + 30 + i * 60, y - 4 + wave(t, .5, 4, i / 3), 10, '#e0b24a', 4);
  return s;
}
// algues dressées (kelp) depuis le fond
function kelp(x, y, h, t, c = '#4fae6a', seed = 0) {
  let d = `M${x} ${y}`;
  for (let i = 1; i <= 6; i++) d += `Q${f1(x + (i % 2 ? 40 : -40) + wave(t, .3, 20, seed + i / 6))} ${f1(y - h * (i - .5) / 6)} ${f1(x + wave(t, .3, 25, seed + i / 5))} ${f1(y - h * i / 6)}`;
  return path(d, 'none', 30) + path(d, 'none', 18, c);
}

// FILET de pêche (mailles en losange). tight 0..1 resserre, k = déformation
function net(x, y, w, h, t, o = {}) {
  const n = o.n || 8, tight = o.tight || 0;
  const pts = (i, j) => {
    const u = i / n, v = j / n;
    let px = x + (u - .5) * w * (1 - tight * .35 * Math.sin(Math.PI * v)), py = y + v * h;
    px += wave(t, .5, 10, u + v); py += wave(t, .4, 8, u * 2);
    if (o.pull) { const dx = px - o.pull[0], dy = py - o.pull[1], dd = Math.hypot(dx, dy); const k = o.pull[2] * Math.exp(-dd / 260); px -= dx * k; py -= dy * k; }
    return [f1(px), f1(py)];
  };
  let d = '';
  for (let i = 0; i <= n; i++) { d += 'M' + pts(i, 0).join(' '); for (let j = 1; j <= n; j++) d += 'L' + pts(i, j).join(' '); }
  for (let j = 0; j <= n; j++) { d += 'M' + pts(0, j).join(' '); for (let i = 1; i <= n; i++) d += 'L' + pts(i, j).join(' '); }
  let s = `<path d="${d}" fill="none" stroke="${o.col || 'rgba(235,235,220,.9)'}" stroke-width="${o.sw || 6}" stroke-linejoin="round" transform="rotate(${o.rot || 0} ${x} ${y + h / 2})"/>`;
  if (o.floats !== false) for (let i = 0; i <= n; i += 2) { const [px, py] = pts(i, 0); s += circ(+px, +py, 18, '#ff8a2a', 5); }
  if (o.rope !== false) s += path(`M${x - w / 2} ${y}Q${x} ${y - 20} ${x + w / 2} ${y}`, 'none', 10, '#c9a56a');
  return s;
}

// HÔTEL (bâtiment moderne avec balcons). lit 0..1 = fenêtres allumées
function hotel(x, y, w, h, lit = 0, c = '#e7e2d8', seed = 1) {
  const r = rng(seed); let s = rect(x, y - h, w, h, c, 6);
  const cols = Math.max(2, Math.floor(w / 70)), rows = Math.max(2, Math.floor(h / 70));
  const cw = (w - 30) / cols, rh = (h - 50) / rows;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const on = r() < .4 + lit * .55;
    const col = lit > 0 && on ? lerpColor('#9fc7e6', '#ffe08a', lit) : '#9fc7e6';
    s += rect(x + 15 + i * cw + 6, y - h + 25 + j * rh + 6, cw - 12, rh - 20, col, 3, 4);
  }
  for (let j = 0; j < rows; j++) s += line(x + 6, y - h + 25 + j * rh + rh - 10, x + w - 6, y - h + 25 + j * rh + rh - 10, 6, shade(c, -.25));
  s += rect(x - 10, y - h - 20, w + 20, 26, shade(c, -.15), 4);
  if (lit > .5) s = glow(x + w / 2, y - h / 2, Math.max(w, h) * .9, '#ffd36b', .35 * lit) + s;
  return s;
}
// lampadaire (avec halo si lit)
function streetLight(x, y, h = 300, lit = 0) {
  let s = line(x, y, x, y - h, 14) + line(x, y, x, y - h, 6, '#6b7480') + path(`M${x} ${y - h}Q${x + 10} ${y - h - 40} ${x + 70} ${y - h - 30}`, 'none', 10) + path(`M${x + 50} ${y - h - 40}L${x + 100} ${y - h - 40}L${x + 92} ${y - h - 22}L${x + 58} ${y - h - 22}Z`, lit ? '#fff3b0' : '#ccd', 5);
  if (lit) s = glow(x + 75, y - h - 20, 220, '#ffe9a0', .55 * lit) + `<path d="M${x + 58} ${y - h - 22}L${x + 92} ${y - h - 22}L${x + 200} ${y}L${x - 50} ${y}Z" fill="rgba(255,240,170,${.18 * lit})"/>` + s;
  return s;
}
// VOITURE de profil (vers la gauche). lights 0..1 = phares (faisceau vers la gauche)
function car(x, y, s = 1, t = 0, o = {}) {
  const c = o.color || '#e2463a';
  let b = '';
  if (o.lights) b += `<path d="M-200 -40L-1400 -260L-1400 160L-200 0Z" fill="rgba(255,245,190,${.35 * o.lights})"/>`;
  b += path('M-210 -20L-200 -80Q-190 -100 -150 -105L-90 -110L-40 -175Q-20 -195 20 -195L120 -195Q160 -195 180 -170L220 -110Q250 -108 260 -80L262 -20Z', c);
  b += path('M-30 -110L0 -165Q10 -178 30 -178L60 -178L60 -110Z', '#bfe3f5', 5) + path('M80 -110L80 -178L115 -178Q140 -178 155 -160L190 -110Z', '#bfe3f5', 5);
  b += rect(-205, -70, 30, 22, o.lights ? '#fff7c2' : '#ffe9a0', 6, 5) + rect(232, -78, 24, 20, '#ff6b6b', 6, 5);
  const wr = (t * 400 / 50) * 57.3;
  for (const wx of [-120, 170]) b += G(tr(wx, -18, 1, -wr), circ(0, 0, 48, '#2b2b33') + circ(0, 0, 22, '#cfd6dc', 5) + line(-20, 0, 20, 0, 4));
  return G(tr(x, y, s) + (o.flip ? ' scale(-1 1)' : ''), b);
}
// voiture vue de face avec phares éblouissants
function carFront(x, y, s = 1, lights = 1) {
  let b = glow(-130, -70, 260, '#fff6c8', .9 * lights) + glow(130, -70, 260, '#fff6c8', .9 * lights);
  b += path('M-230 0L-220 -110Q-200 -150 -150 -160L-110 -240Q-90 -270 -50 -270L50 -270Q90 -270 110 -240L150 -160Q200 -150 220 -110L230 0Z', '#3e5c8a');
  b += path('M-95 -165L-70 -230Q-60 -248 -40 -248L40 -248Q60 -248 70 -230L95 -165Z', '#bfe3f5', 5);
  b += circ(-150, -95, 34, '#fff7c2') + circ(150, -95, 34, '#fff7c2') + rect(-70, -110, 140, 40, '#2b2b33', 8, 5);
  b += rect(-220, -10, 70, 40, '#222', 8, 5) + rect(150, -10, 70, 40, '#222', 8, 5);
  return G(tr(x, y, s), b);
}
function road(y, h = 160, t = 0, speed = 0) {
  let s = rect(-200, y, W + 400, h, '#5b6068', 0, 0) + line(-200, y, W + 200, y, 8, '#c9ccd1') + line(-200, y + h, W + 200, y + h, 8, '#c9ccd1');
  const off = (t * speed) % 240;
  for (let x = -240; x < W + 240; x += 240) s += rect(x - off, y + h / 2 - 7, 120, 14, '#f4f1e6', 4, 0);
  return s;
}
// thermomètre (level 0..1)
function thermometer(x, y, s = 1, level = .5, col = '#ff5d4d') {
  return G(tr(x, y, s), rect(-30, -260, 60, 280, '#fff', 30) + circ(0, 40, 50, col) + rect(-14, -230 + (1 - level) * 210, 28, 260 - (1 - level) * 210, col, 14, 0) + circ(0, 40, 36, col, 0) + line(18, -200, 34, -200, 5) + line(18, -140, 34, -140, 5) + line(18, -80, 34, -80, 5) + ell(-8, 26, 8, 12, 'rgba(255,255,255,.6)', 0));
}
// symbole ♂ / ♀ dessiné
function sexSym(x, y, s, female, col) {
  return G(tr(x, y, s), female ? circ(0, -30, 60, 'none', 22, OL) + circ(0, -30, 60, 'none', 12, col) + path('M0 30L0 120M-40 80L40 80', 'none', 22) + path('M0 30L0 120M-40 80L40 80', 'none', 12, col)
    : circ(-10, 10, 60, 'none', 22, OL) + circ(-10, 10, 60, 'none', 12, col) + path('M32 -32L90 -90M50 -90L90 -90L90 -50', 'none', 22) + path('M32 -32L90 -90M50 -90L90 -90L90 -50', 'none', 12, col));
}
// Terre avec lignes du champ magnétique
function magEarth(x, y, s, t) {
  let f = '';
  for (let i = 1; i <= 4; i++) { const k = .55 + i * .35; f += path(`M0 -140C${280 * k} ${-260 * k} ${280 * k} ${260 * k} 0 140`, 'none', 6, 'rgba(120,200,255,.8)') + path(`M0 -140C${-280 * k} ${-260 * k} ${-280 * k} ${260 * k} 0 140`, 'none', 6, 'rgba(120,200,255,.8)'); }
  const dash = `stroke-dasharray="18 22" stroke-dashoffset="${f1(-t * 60)}"`;
  f = f.replace(/stroke-linecap="round"/g, 'stroke-linecap="round" ' + dash);
  let e = circ(0, 0, 150, '#4aa3e0') + path('M-90 -90C-40 -110 -20 -60 -50 -30C-80 0 -120 -30 -130 -50ZM20 -40C60 -70 110 -30 100 20C90 70 40 90 30 50C20 20 0 0 20 -40ZM-60 60C-30 50 -10 80 -30 110C-60 110 -80 90 -60 60Z', '#6cc46a', 5);
  return G(tr(x, y, s), f + e + path('M-100 -110Q-60 -140 -20 -144', 'none', 10, 'rgba(255,255,255,.4)'));
}
// ordinateur portable avec tableau Excel
function laptopSheet(x, y, s = 1, r = 0) {
  let g = rect(-200, -260, 400, 260, '#2b2b33', 16) + rect(-180, -240, 360, 220, '#fff', 6, 0);
  g += rect(-180, -240, 360, 34, '#1f8a4c', 0, 0);
  for (let i = 0; i < 6; i++) g += line(-180, -206 + i * 31, 180, -206 + i * 31, 3, '#9ac9a8');
  for (let i = 1; i < 5; i++) g += line(-180 + i * 72, -206, -180 + i * 72, -20, 3, '#9ac9a8');
  g += path('M-240 0L240 0L270 30L-270 30Z', '#9aa3ad');
  return G(tr(x, y, s, r), g);
}
// téléphone avec conversation (messages vides)
function chatPhone(x, y, s, r, t, o = {}) {
  let sc = rect(-66, -128, 132, 34, '#e8eef5', 0, 0) + text(0, -104, 'none', o.name || 'Maman', OL, 22);
  if (o.typing) { for (let i = 0; i < 3; i++) sc += circ(-20 + i * 20, 60, 8, 'rgba(0,0,0,' + (.3 + .5 * Math.abs(Math.sin(t * 5 + i))) + ')', 0); sc = rect(-46, 40, 92, 40, '#fff', 20, 0) + sc; }
  if (o.seen) sc += text(40, 110, 'none', 'Vu', '#7a8a99', 20);
  if (o.msg) sc += rect(-10, -60, 70, 36, '#7fd3a0', 14, 0) + text(25, -35, 'none', o.msg, '#fff', 20);
  return phone(x, y, s, r, sc);
}

// ---------------- décors 16:9 ----------------
// plage de jour : ciel, mer (horizon hz), sable (rivage sy). hotels = silhouettes modernes au loin
function bgBeach(t, o = {}) {
  const hz = o.hz ?? 430, sy = o.sy ?? 640;
  const night = o.dusk || 0;
  let s = grad(lerpColor('#8fd3ff', '#5b5d9e', night), lerpColor('#dff3ff', '#ffb38a', night), -200, -200, W + 400, hz + 200);
  if (o.sun !== false) s += circ(o.sunX ?? 1550, o.sunY ?? 150, 70, night ? '#ffb15a' : '#fff3b0', 0) + glow(o.sunX ?? 1550, o.sunY ?? 150, 260, '#fff3b0', .5);
  s += cloud(300 + wave(t, .02, 40), 140, .8) + cloud(1100 + wave(t, .015, 50, .3), 90, .6);
  if (o.hotels) for (let i = 0; i < 6; i++) s += op(.55, hotel(80 + i * 300, hz, 160 + (i % 3) * 40, 120 + (i * 37 % 90), 0, '#d7dde6', i + 2).replace(/stroke="#2b2420"/g, 'stroke="#9aa6b5"'));
  s += grad(SEA, SEA_D, -200, hz, W + 400, sy - hz + 60);
  for (let i = 0; i < 6; i++) { const y = hz + 20 + i * (sy - hz) / 6, off = (t * (20 + i * 8)) % 200; s += path(`M${-200 - off} ${y}` + Array.from({ length: 14 }, (_, k) => `q50 -10 100 0t100 0`).join(''), 'none', 4, 'rgba(255,255,255,.35)'); }
  // écume qui va et vient
  const wv = wave(t, .18, 26, o.seed || 0);
  s += path(`M-200 ${sy + wv}` + Array.from({ length: 24 }, () => 'q50 -18 100 0').join('') + `L${W + 200} ${sy + 80}L-200 ${sy + 80}Z`, 'rgba(255,255,255,.85)', 0);
  s += grad(SAND, SAND_D, -200, sy + 20 + wv, W + 400, H - sy + 400);
  s += path(`M-200 ${sy + 20 + wv}` + Array.from({ length: 24 }, () => 'q50 14 100 0').join(''), 'none', 5, 'rgba(255,255,255,.7)');
  const r = rng(o.seed || 5);
  for (let i = 0; i < 26; i++) { const x = r() * W, y = sy + 80 + r() * (H - sy); s += ell(x, y, 6 + r() * 8, 3 + r() * 3, SAND_W, 0); }
  return s;
}
// plage de nuit (lune, étoiles) + éventuelle ville lumineuse au fond (city 0..1)
function bgNightBeach(t, o = {}) {
  const hz = o.hz ?? 430, sy = o.sy ?? 640;
  let s = grad('#152246', '#34407a', -200, -200, W + 400, hz + 200);
  const r = rng(8);
  for (let i = 0; i < 60; i++) s += circ(r() * W, r() * hz * .9, 1.5 + r() * 2.5, `rgba(255,255,240,${.4 + .5 * Math.abs(Math.sin(t * .7 + i))})`, 0);
  if (o.moon !== false) s += circ(o.moonX ?? 1600, 130, 55, '#fff6d6', 0) + glow(o.moonX ?? 1600, 130, 220, '#fff6d6', .35);
  s += grad('#1d3f6e', '#0f2448', -200, hz, W + 400, sy - hz + 60);
  for (let i = 0; i < 5; i++) { const y = hz + 20 + i * (sy - hz) / 5, off = (t * (14 + i * 6)) % 200; s += path(`M${-200 - off} ${y}` + Array.from({ length: 14 }, () => 'q50 -10 100 0t100 0').join(''), 'none', 4, 'rgba(200,220,255,.25)'); }
  if (o.moonPath !== false) s += `<path d="M${(o.moonX ?? 1600) - 40} ${hz}L${(o.moonX ?? 1600) + 40} ${hz}L${(o.moonX ?? 1600) + 160} ${sy}L${(o.moonX ?? 1600) - 160} ${sy}Z" fill="rgba(255,246,214,.18)"/>`;
  const wv = wave(t, .18, 22);
  s += path(`M-200 ${sy + wv}` + Array.from({ length: 24 }, () => 'q50 -18 100 0').join('') + `L${W + 200} ${sy + 80}L-200 ${sy + 80}Z`, 'rgba(220,235,255,.6)', 0);
  s += grad('#b9a27a', '#8c7652', -200, sy + 20 + wv, W + 400, H - sy + 400);
  return s;
}
// coupe du sable (sous terre) : surface à sy
function bgSand(t, o = {}) {
  const sy = o.sy ?? 180;
  let s = grad(o.night ? '#1b2650' : '#9fdcff', o.night ? '#3a4682' : '#e3f5ff', -200, -200, W + 400, sy + 200);
  s += grad('#e9c98d', '#b98d55', -200, sy, W + 400, H - sy + 300);
  for (let i = 1; i < 5; i++) s += path(`M-200 ${sy + i * 190}` + Array.from({ length: 12 }, (_, k) => `q100 ${k % 2 ? 22 : -22} 200 0`).join(''), 'none', 5, 'rgba(120,80,40,.15)');
  const r = rng(o.seed || 4);
  for (let i = 0; i < 40; i++) s += ell(r() * W, sy + 40 + r() * (H - sy), 5 + r() * 14, 4 + r() * 8, ['#c9a26a', '#d8b47a', '#a98758'][i % 3], 0);
  s += line(-200, sy, W + 200, sy, 8, '#c49a5c');
  return s;
}
// sous l'eau : rayons de lumière, bulles, fond de sable optionnel (floor = y)
function bgUnder(t, o = {}) {
  const dk = o.dark || 0;
  let s = grad(lerpColor('#5fd0ea', '#123a5a', dk), lerpColor('#1b6fa3', '#061a33', dk), -200, -200, W + 400, H + 400);
  for (let i = 0; i < 6; i++) { const x = 200 + i * 330 + wave(t, .05, 60, i / 6); s += `<path d="M${x} -50L${x + 120} -50L${x + 420} ${H + 50}L${x + 160} ${H + 50}Z" fill="rgba(255,255,255,${.07 * (1 - dk)})"/>`; }
  if (o.surface) s += path(`M-200 ${o.surface}` + Array.from({ length: 24 }, (_, k) => `q50 ${wave(t, .4, 10, k / 7) + 10} 100 0`).join('') + `L${W + 200} -300L-200 -300Z`, 'rgba(220,250,255,.4)', 0);
  const r = rng(o.seed || 11);
  for (let i = 0; i < 18; i++) { const x = r() * W, sp = 40 + r() * 60, y = ((r() * H - t * sp) % H + H) % H; s += circ(x + wave(t, .5, 8, r()), y, 4 + r() * 8, 'rgba(255,255,255,.35)', 3, 'rgba(255,255,255,.6)'); }
  if (o.fishFar) for (let i = 0; i < 5; i++) { const x = ((r() * W - t * 60 * (1 + i * .2)) % (W + 300) + W + 300) % (W + 300) - 150; s += op(.25, fish({ x, y: 150 + r() * 600, s: .35, color: '#0d4c74' }, t)); }
  if (o.floor) { s += path(`M-200 ${o.floor}Q${W * .3} ${o.floor - 40} ${W * .6} ${o.floor + 10}T${W + 200} ${o.floor}L${W + 200} ${H + 200}L-200 ${H + 200}Z`, lerpColor('#e8d29a', '#3e4b5a', dk), 0); for (let i = 0; i < 5; i++) s += kelp(100 + i * 430 + r() * 80, o.floor + 30, 220 + r() * 160, t, '#4fae6a', i); }
  return s;
}
// plan coupé surface : ciel en haut, eau dessous (wl = niveau de l'eau)
function bgSplit(t, o = {}) {
  const wl = o.wl ?? 420;
  let s = grad(o.sky1 || '#8fd3ff', o.sky2 || '#e4f6ff', -200, -200, W + 400, wl + 200);
  s += cloud(400, 140, .9) + cloud(1400, 100, .7);
  s += grad('#4cc3e3', '#14588a', -200, wl, W + 400, H - wl + 300);
  s += path(`M-200 ${wl}` + Array.from({ length: 24 }, (_, k) => `q50 ${wave(t, .5, 8, k / 5) - 12} 100 0`).join('') + `L${W + 200} ${wl + 30}L-200 ${wl + 30}Z`, 'rgba(255,255,255,.6)', 0);
  for (let i = 0; i < 5; i++) { const x = 150 + i * 380 + wave(t, .05, 50, i / 5); s += `<path d="M${x} ${wl}L${x + 90} ${wl}L${x + 300} ${H + 50}L${x + 120} ${H + 50}Z" fill="rgba(255,255,255,.07)"/>`; }
  return s;
}

// ---------- décors en pièces détachées pour la fausse 3D (à mettre dans depth()) ----------
// renvoie { sky, far, sea, sand } : sky (z≈6), far = hôtels lointains (z≈4, brume), sea (z≈2.5), sand (z≈1)
function beachParts(t, o = {}) {
  const hz = o.hz ?? 430, sy = o.sy ?? 640, M = 900, night = o.dusk || 0;
  const sky = grad(lerpColor('#8fd3ff', '#5b5d9e', night), lerpColor('#dff3ff', '#ffb38a', night), -M, -M, W + 2 * M, hz + M + 200) +
    (o.sun !== false ? glow(o.sunX ?? 1550, o.sunY ?? 150, 300, '#fff3b0', .5) + circ(o.sunX ?? 1550, o.sunY ?? 150, 70, night ? '#ffb15a' : '#fff3b0', 0) : '') +
    cloud(300 + wave(t, .02, 40), 140, .8) + cloud(1100 + wave(t, .015, 50, .3), 90, .6) + cloud(-300, 200, .7) + cloud(2100, 160, .9);
  let far = '';
  if (o.hotels) for (let i = -2; i < 8; i++) far += hotel(80 + i * 300, hz + 4, 160 + ((i + 9) % 3) * 40, 120 + ((i + 9) * 37 % 90), 0, '#d7dde6', i + 12).replace(/stroke="#2b2420"/g, 'stroke="#9aa6b5"');
  let sea = grad(SEA, SEA_D, -M, hz, W + 2 * M, sy - hz + 80);
  for (let i = 0; i < 6; i++) { const y = hz + 20 + i * (sy - hz) / 6, off = (t * (20 + i * 8)) % 200; sea += path(`M${-M - off} ${y}` + Array.from({ length: 20 }, () => 'q50 -10 100 0t100 0').join(''), 'none', 4, 'rgba(255,255,255,.35)'); }
  const wv = wave(t, .18, 26, o.seed || 0);
  let sand = path(`M${-M} ${sy + wv}` + Array.from({ length: 38 }, () => 'q50 -18 100 0').join('') + `L${W + M} ${sy + 80}L${-M} ${sy + 80}Z`, 'rgba(255,255,255,.85)', 0);
  sand += grad(o.sand1 || SAND, o.sand2 || SAND_D, -M, sy + 20 + wv, W + 2 * M, H - sy + M);
  sand += path(`M${-M} ${sy + 20 + wv}` + Array.from({ length: 38 }, () => 'q50 14 100 0').join(''), 'none', 5, 'rgba(255,255,255,.7)');
  const r = rng(o.seed || 5);
  for (let i = 0; i < 40; i++) { const x = -600 + r() * (W + 1200), y = sy + 80 + r() * (H - sy + 200); sand += ell(x, y, 6 + r() * 8, 3 + r() * 3, SAND_W, 0); }
  return { sky, far, sea, sand };
}
// mise en profondeur standard d'une plage : renvoie la liste de couches (ajouter perso z=1 et premier plan z<1)
function beachLayers(t, o = {}) { const p = beachParts(t, o); return [{ z: 6, svg: p.sky }, { z: 4, svg: p.far, haze: .35, hazeCol: o.dusk ? '#f3c7b0' : '#e3f1ff' }, { z: 2.4, svg: p.sea }, { z: 1, svg: p.sand }]; }
// sous l'eau en profondeur : fond (z 5), silhouettes de poissons/kelp lointains (z 2.5, brume), sol (z 1)
function underLayers(t, o = {}) {
  const dk = o.dark || 0, M = 900;
  const back = grad(lerpColor('#5fd0ea', '#123a5a', dk), lerpColor('#1b6fa3', '#061a33', dk), -M, -M, W + 2 * M, H + 2 * M) +
    Array.from({ length: 8 }, (_, i) => { const x = -400 + i * 380 + wave(t, .05, 60, i / 6); return `<path d="M${x} -300L${x + 120} -300L${x + 520} ${H + 300}L${x + 220} ${H + 300}Z" fill="rgba(255,255,255,${.07 * (1 - dk)})"/>`; }).join('') +
    (o.surface !== undefined ? path(`M${-M} ${o.surface}` + Array.from({ length: 38 }, (_, k) => `q50 ${wave(t, .4, 10, k / 7) + 10} 100 0`).join('') + `L${W + M} -600L${-M} -600Z`, 'rgba(220,250,255,.4)', 0) : '');
  const r = rng(o.seed || 11); let mid = '';
  for (let i = 0; i < 7; i++) { const x = ((r() * (W + 1200) - t * 50 * (1 + i * .2)) % (W + 1200) + W + 1200) % (W + 1200) - 600; mid += fish({ x, y: 120 + r() * 700, s: .45, color: '#0d4c74' }, t); }
  if (o.floor) for (let i = 0; i < 7; i++) mid += kelp(-300 + i * 420 + r() * 80, o.floor + 60, 300 + r() * 200, t, '#2f6f5a', i);
  let near = '';
  if (o.floor) { near += path(`M${-M} ${o.floor}Q${W * .3} ${o.floor - 40} ${W * .6} ${o.floor + 10}T${W + M} ${o.floor}L${W + M} ${H + M}L${-M} ${H + M}Z`, lerpColor('#e8d29a', '#3e4b5a', dk), 0); for (let i = 0; i < 5; i++) near += kelp(-100 + i * 500 + r() * 80, o.floor + 30, 220 + r() * 160, t, '#4fae6a', i + 3); }
  for (let i = 0; i < 14; i++) { const x = r() * W, sp = 40 + r() * 60, y = ((r() * H - t * sp) % H + H) % H; near += circ(x + wave(t, .5, 8, r()), y, 4 + r() * 8, 'rgba(255,255,255,.35)', 3, 'rgba(255,255,255,.6)'); }
  return [{ z: 5, svg: back }, { z: 2.5, svg: mid, haze: .5, hazeCol: lerpColor('#3fa6d0', '#0b2a48', dk) }, { z: 1, svg: near }];
}
