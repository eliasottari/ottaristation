// ============================================================
//  Insectes & accessoires "nature" — même langage graphique
// ============================================================
const M_GREEN = '#8fd16a', M_GREEN_D = '#6bb34e', F_GREEN = '#58a84a', F_GREEN_D = '#3f8a3a';

// visage de mante (tête triangulaire, gros yeux globuleux)
function bugFace(o, r, t) {
  const ex = Object.assign({}, EXPR[o.expr || 'neutral'] || EXPR.neutral, o.face || {});
  let type = ex.eyes;
  const [lx, ly] = (o.look || [0, 0]).map(v => v * r * .1);
  const blink = ((t + (o.seed || 0) * 1.7) % 3.1) < .11;
  if ((type === 'dot' || type === 'wide' || type === 'stare') && blink && !o.noBlink) type = 'closed';
  const col = o.color || M_GREEN, dk = shade(col, -.25);
  let s = '';
  for (const sd of [-1, 1]) {
    const bx = sd * r * .62, by = -r * .42, br = r * .38;
    s += circ(bx, by, br, type === 'happy' || type === 'closed' ? shade(col, .35) : '#fbfff0', SW);
    const px = bx + lx, py = by + ly;
    switch (type) {
      case 'dot': case 'stare': {
        const pr = type === 'stare' ? br * .55 : br * .42;
        s += circ(px, py, pr, OL, 0) + circ(px + pr * .35, py - pr * .35, pr * .3, '#fff', 0);
        if (type === 'stare') s += circ(px - pr * .3, py + pr * .3, pr * .12, '#fff', 0);
        break;
      }
      case 'wide': s += circ(px, py, br * .2, OL, 0) + circ(px + br * .07, py - br * .07, br * .07, '#fff', 0); break;
      case 'happy': s += path(`M${bx - br * .5} ${by + br * .15}Q${bx} ${by - br * .5} ${bx + br * .5} ${by + br * .15}`, 'none', 7); break;
      case 'closed': case 'closedSad': s += path(`M${bx - br * .5} ${by}Q${bx} ${by + br * .45} ${bx + br * .5} ${by}`, 'none', 7); break;
      case 'closedHappy2': s += path(`M${bx - br * .5} ${by + br * .1}Q${bx} ${by - br * .45} ${bx + br * .5} ${by + br * .1}`, 'none', 7); break;
      case 'half': case 'squint':
        s += circ(px, py + br * .15, br * .38, OL, 0) + path(`M${bx - br} ${by + (type === 'squint' ? br * .25 : 0)}A${br} ${br} 0 0 1 ${bx + br} ${by + (type === 'squint' ? br * .25 : 0)}Z`, shade(col, .1), 6); break;
      case 'x': s += path(`M${bx - br * .4} ${by - br * .4}L${bx + br * .4} ${by + br * .4}M${bx + br * .4} ${by - br * .4}L${bx - br * .4} ${by + br * .4}`, 'none', 8); break;
      case 'star': s += G(tr(bx, by, br / 50, t * 90), path('M0 -40Q6 -6 40 0Q6 6 0 40Q-6 6 -40 0Q-6 -6 0 -40Z', '#ffd23f', 6)); break;
      case 'heart': s += heart(bx, by + 4, br / 52); break;
      case 'shades': break;
      case 'hungry': s += circ(px, py, br * .32, '#d6283a', 0) + ell(px, py, br * .08, br * .26, OL, 0) + path(`M${bx - br} ${by - br * .2}L${bx + br} ${by - br * .2 + sd * -br * .5}L${bx + br} ${by - br}L${bx - br} ${by - br}Z`, col, 0) + line(bx - br * .95, by - br * .2 - (sd < 0 ? 0 : 0), bx + br * .95, by - br * .2 - sd * br * .5, 7); break;
    }
    if (type === 'angry') s += circ(px, py + br * .1, br * .4, OL, 0) + path(`M${bx - br * 1.05} ${by - br * 1.05}L${bx + br * 1.05} ${by - br * 1.05}L${bx + br * 1.05} ${by - br * .1 + sd * br * .35}L${bx - br * 1.05} ${by - br * .1 - sd * br * .35}Z`, col, 0) + line(bx - br * .95, by - br * .1 - sd * br * .35, bx + br * .95, by - br * .1 + sd * br * .35, 7);
    if (o.lashes) for (let k = 0; k < 3; k++) { const a = R(-150 + k * 30) * (sd < 0 ? 1 : 1); const ax = bx + sd * Math.cos(R(-100 + sd * 0) + (k - 1) * .45 * sd) * br, ay = by + Math.sin(R(-90) + (k - 1) * .45) * br; s += line(ax, ay, ax + (ax - bx) * .45, ay + (ay - by) * .45, 6); }
  }
  if (type === 'shades') s += path(`M${-r * 1.05} ${-r * .7}L${r * 1.05} ${-r * .7}L${r * .95} ${-r * .25}Q${r * .6} ${-r * .05} ${r * .2} ${-r * .3}L${-r * .2} ${-r * .3}Q${-r * .6} ${-r * .05} ${-r * .95} ${-r * .25}Z`, '#1d1d24', 6);
  // sourcils
  const by = -r * .9;
  const B = (x1, y1, x2, y2) => line(x1, y1, x2, y2, 7);
  switch (ex.brows) {
    case 'angry': s += B(-r * .95, by - r * .1, -r * .3, by + r * .1) + B(r * .95, by - r * .1, r * .3, by + r * .1); break;
    case 'sad': s += B(-r * .95, by + r * .08, -r * .3, by - r * .1) + B(r * .95, by + r * .08, r * .3, by - r * .1); break;
    case 'up': s += path(`M${-r * .95} ${by}Q${-r * .62} ${by - r * .25} ${-r * .3} ${by}M${r * .3} ${by}Q${r * .62} ${by - r * .25} ${r * .95} ${by}`, 'none', 7); break;
    case 'skeptic': s += B(-r * .95, by, -r * .3, by) + path(`M${r * .3} ${by}Q${r * .62} ${by - r * .25} ${r * .95} ${by - r * .05}`, 'none', 7); break;
  }
  if (o.cheeks !== false) s += ell(-r * .42, r * .12, r * .14 * (ex.blush ? 1.5 : 1), r * .08 * (ex.blush ? 1.5 : 1), CHEEK, 0) + ell(r * .42, r * .12, r * .14 * (ex.blush ? 1.5 : 1), r * .08 * (ex.blush ? 1.5 : 1), CHEEK, 0);
  let m = mouthSvg(ex.mouth, r * .7, t, 0, 0);
  if (o.lipstick) m = m.replace(/fill="#7a2b2b"/g, 'fill="#d6283a"') + (ex.mouth === 'smile' || ex.mouth === 'smirk' || ex.mouth === 'flat' ? '' : '');
  s += G(tr(0, r * .2), m);
  if (o.lipstick && (ex.mouth === 'smile' || ex.mouth === 'smirk' || ex.mouth === 'flat')) s += G(tr(0, r * .2), mouthSvg(ex.mouth, r * .7, t, 0, 0).replace(/stroke="#2b2420"/g, 'stroke="#d6283a"').replace(/stroke-width="6"/g, 'stroke-width="10"'));
  if (o.drool) s += path(`M${r * .12} ${r * .5}q${r * .04} ${r * .2 + wave(t, 1, r * .05)} 0 ${r * .35}`, 'none', 9, '#bfe8ff');
  if (ex.sweat) s += sweat(r * 1.05, -r * .2 + (t * 30 % 20), r / 90);
  if (ex.tears) s += path(`M${-r * .62} ${-r * .05}q${-r * .05} ${r * .3} 0 ${r * .55}M${r * .62} ${-r * .05}q${r * .05} ${r * .3} 0 ${r * .55}`, 'none', 10, '#8fd0ff');
  return s;
}

function bugHead(o, r, t) {
  const col = o.color || M_GREEN, dk = shade(col, -.25);
  const turn = o.headTurn || 0; // -180..180 ; |turn|>90 = on voit l'arrière
  const cx = Math.cos(R(turn)), back = cx < 0;
  let s = '';
  // antennes
  const aw = wave(t, .7, 6, o.seed || 0);
  s += path(`M${-r * .25} ${-r * .75}Q${-r * .5} ${-r * 1.6} ${-r * 1.0 + aw} ${-r * 2.0}`, 'none', 6) + path(`M${r * .25} ${-r * .75}Q${r * .5} ${-r * 1.6} ${r * 1.0 - aw} ${-r * 2.0}`, 'none', 6);
  const shape = `M${-r * .95} ${-r * .3}Q${-r * 1.0} ${-r * .85} ${-r * .4} ${-r * .82}L${r * .4} ${-r * .82}Q${r * 1.0} ${-r * .85} ${r * .95} ${-r * .3}Q${r * .62} ${r * .45} 0 ${r * .85}Q${-r * .62} ${r * .45} ${-r * .95} ${-r * .3}Z`;
  let face = path(shape, col, SW);
  if (!back) face += bugFace(o, r, t);
  else face += path(`M${-r * .4} ${-r * .3}Q0 ${-r * .1} ${r * .4} ${-r * .3}`, 'none', 5, dk) + circ(-r * .62, -r * .42, r * .38, dk, SW) + circ(r * .62, -r * .42, r * .38, dk, SW);
  if (o.bow) face += G(tr(-r * .55, -r * .95, 1, -15), path(`M0 0L${-r * .45} ${-r * .3}L${-r * .45} ${r * .3}Z M0 0L${r * .45} ${-r * .3}L${r * .45} ${r * .3}Z`, '#ff6fa8', 5) + circ(0, 0, r * .12, '#ff6fa8', 5));
  if (o.halo) face += ell(0, -r * 1.25 + wave(t, .8, 6), r * .7, r * .18, 'none', 12, '#ffd23f').replace('stroke-width="12"', 'stroke-width="14"');
  if (o.hardhat) face += path(`M${-r * .95} ${-r * .7}Q0 ${-r * 1.7} ${r * .95} ${-r * .7}Z`, '#ffcf3f', 6) + rect(-r * 1.1, -r * .78, r * 2.2, r * .16, '#ffcf3f', 6, 6);
  s += G(`scale(${(back ? -1 : 1) * Math.max(Math.abs(cx), .08)} 1)`, face);
  return s;
}

// mante complète, de profil (regarde à droite). origine = sol, sous le corps
function mantis(o, t = 0) {
  const s0 = o.s || 1;
  const fem = !!o.female, nymph = !!o.nymph;
  const col = o.color || (fem ? F_GREEN : M_GREEN), dk = shade(col, -.28), far = shade(col, -.18);
  const bob = (o.bob ?? 1) * wave(t, .7, 3, o.seed || 0);
  const r = o.hr || (nymph ? 112 : 100);
  const walkK = o.walk ? Math.sin(t * (o.walk || 2) * Math.PI * 2) : 0;
  let s = '';
  const H = [-20, -150 + bob], N = [45, -320 + bob];
  // pattes (arrière-plan)
  const leg = (p, k, f, c) => { const d = `M${p[0]} ${p[1]}L${k[0]} ${k[1]}L${f[0]} ${f[1]}`; return `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${10 + SW * 2 - 2}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`; };
  s += leg([-10, -150 + bob], [40, -205 + bob], [60 + walkK * 18, 0], far) + leg([-50, -145 + bob], [-100, -205 + bob], [-120 - walkK * 18, 0], far);
  // abdomen
  if (!o.headless || true) {
    const ab = nymph ? `M${H[0]} ${H[1] + 10}C-80 -120 -150 -200 -170 -290C-150 -300 -120 -290 -100 -250C-70 -200 -30 -180 ${H[0] + 20} ${H[1] - 30}Z`
      : `M${H[0] + 10} ${H[1] - 25}C-90 -210 -220 -190 -290 -130C-300 -110 -280 -95 -250 -100C-170 -110 -90 -120 ${H[0] + 10} ${H[1] + 15}Z`;
    s += path(ab, col, SW);
    if (!nymph) for (let i = 1; i <= 4; i++) s += path(`M${-40 - i * 50} ${-160 + i * 8}q${-6} ${20 - i * 2} 0 ${40 - i * 4}`, 'none', 4, dk);
    if (!nymph) s += path(`M${H[0] + 10} ${H[1] - 28}C-90 -225 -200 -205 -275 -150C-200 -150 -110 -150 ${H[0]} ${H[1] - 6}Z`, shade(col, .25), 5);
    if (o.heartShirt) s += heart(-150, -160, .7, '#ff5d73');
  }
  // thorax
  s += limb(H[0], H[1], R ? Math.atan2(N[1] - H[1], N[0] - H[0]) * 180 / Math.PI : 0, Math.hypot(N[0] - H[0], N[1] - H[1]), 0, 0, col, 28).svg;
  // pattes avant-plan
  s += leg([0, -150 + bob], [70, -200 + bob], [110 - walkK * 18, 0], col) + leg([-40, -145 + bob], [-120, -210 + bob], [-170 + walkK * 18, 0], col);
  // bras ravisseurs
  const F = [lerp(H[0], N[0], .72), lerp(H[1], N[1], .72)];
  const poses = { pray: [70, -75, 115], strike: [10, -5, 15], grab: [20, -40, 60], up: [10, -20, -80], wave: [0, -50, -110 + wave(t, 3, 30)], rest: [80, -60, 120], hold: [40, -10, 80] };
  const armPose = (p) => typeof p === 'string' ? poses[p] : p;
  const arm = (pp, c, off) => {
    const [a1, a2, a3] = armPose(pp);
    const p0 = [F[0] + off, F[1] + off * .5];
    const p1 = [p0[0] + Math.cos(R(a1)) * 50, p0[1] + Math.sin(R(a1)) * 50];
    const p2 = [p1[0] + Math.cos(R(a2)) * 105, p1[1] + Math.sin(R(a2)) * 105];
    const p3 = [p2[0] + Math.cos(R(a3)) * 85, p2[1] + Math.sin(R(a3)) * 85];
    const d = `M${f1(p0[0])} ${f1(p0[1])}L${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}L${f1(p3[0])} ${f1(p3[1])}`;
    let a = `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${22 + SW * 2 - 2}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (o.spikes) for (let k = 1; k <= 4; k++) { const q = k / 5, sx = lerp(p1[0], p2[0], q), sy = lerp(p1[1], p2[1], q), na = R(a2 + 90); a += path(`M${f1(sx - Math.cos(R(a2)) * 8)} ${f1(sy - Math.sin(R(a2)) * 8)}L${f1(sx + Math.cos(na) * 26)} ${f1(sy + Math.sin(na) * 26)}L${f1(sx + Math.cos(R(a2)) * 8)} ${f1(sy + Math.sin(R(a2)) * 8)}Z`, '#fff', 4); }
    return { svg: a, end: p3 };
  };
  const A1 = arm(o.armFar || o.arms || 'pray', far, -8);
  const A2 = arm(o.arms || 'pray', col, 8);
  // tête
  const headTilt = o.headTilt || 0;
  const headPos = [N[0] + 10, N[1] - r * .55];
  let headS = '';
  if (!o.headless) headS = G(tr(headPos[0], headPos[1], o.headScale || 1, headTilt), bugHead(Object.assign({ color: col }, o, { color: col, lashes: o.lashes ?? fem, lipstick: o.lipstick ?? fem, bow: o.bow ?? fem }), r, t));
  else headS = G(tr(N[0], N[1]), ell(0, 0, 18, 10, shade(col, .3), 5) + (o.bandage ? path('M-24 -6L24 6M-24 6L24 -6', 'none', 10, '#fff') : ''));
  s = A1.svg + s + headS + A2.svg;
  if (o.holdItem) s += G(tr(A2.end[0], A2.end[1], 1, o.holdRot || 0), o.holdItem);
  return G(tr(o.x || 0, o.y || 0, s0, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''), s);
}
// tête seule centrée (pour gros plans)
function mantisHead(o, x, y, s, t) { const col = o.color || (o.female ? F_GREEN : M_GREEN); return G(tr(x, y, s, o.headTilt || 0), bugHead(Object.assign({}, o, { color: col, lashes: o.lashes ?? !!o.female, lipstick: o.lipstick ?? !!o.female, bow: o.bow ?? !!o.female }), o.hr || 100, t)); }

function fly(x, y, s, t, o = {}) {
  const fl = Math.abs(Math.sin(t * 60));
  const ho = o.headOff || 0;
  let b = '';
  b += G(tr(-10, -40, 1, -20), ell(0, 0, 50, 22 * (0.4 + fl * .6), 'rgba(220,240,255,.75)', 5)) + G(tr(10, -40, 1, 20), ell(0, 0, 50, 22 * (0.4 + fl * .6), 'rgba(220,240,255,.75)', 5));
  b += path('M-30 20L-50 60M0 25L0 65M30 20L50 60', 'none', 6);
  b += ell(0, 0, 55, 40, '#4a5068') + path('M-20 -30Q0 -10 20 -30', 'none', 4, '#6b7290');
  const hx = 55 + ho * 220, hy = -10 - ho * 260 + ho * ho * 200, hr = ho * 540;
  let hd = circ(0, 0, 34, '#4a5068') + circ(-14, -8, 18, '#d6283a', 5) + circ(16, -8, 18, '#d6283a', 5) + circ(-10, -12, 5, '#fff', 0) + circ(20, -12, 5, '#fff', 0);
  if (ho > 0) hd += sparkle(0, -60, .35, '#fff');
  b += G(tr(hx, hy, 1, hr), hd);
  if (o.dizzy) for (let i = 0; i < 3; i++) b += sparkle(Math.cos(t * 6 + i * 2) * 60, -80 + Math.sin(t * 6 + i * 2) * 20, .3, '#ffd23f');
  return G(tr(x, y, s, o.rot || 0) + (o.flip ? ' scale(-1 1)' : ''), b);
}

function ootheca(x, y, s, t, crack = 0) {
  let b = path('M-170 40C-190 -60 -120 -150 0 -160C120 -150 190 -60 170 40C120 90 -120 90 -170 40Z', '#c9945a', SW);
  for (let i = 0; i < 6; i++) b += path(`M${-150 + i * 60} ${60 - Math.abs(i - 2.5) * 6}Q${-130 + i * 60} -60 ${-110 + i * 60} ${-140 + Math.abs(i - 2.5) * 10}`, 'none', 5, '#a87542');
  b += path('M-120 -110Q0 -180 120 -110', 'none', 8, '#e2b67e');
  if (crack > 0) b += op(crack, path('M-20 -150L0 -110L-25 -80L5 -50', 'none', 6));
  return G(tr(x, y, s), b);
}
function branch(x1, y1, x2, y2, w = 46, c = '#9a6a43', leaves = []) {
  let s = path(`M${x1} ${y1}Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + 30} ${x2} ${y2}`, 'none', w + SW * 2, OL) + path(`M${x1} ${y1}Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + 30} ${x2} ${y2}`, 'none', w, c);
  s += path(`M${x1} ${y1 - w * .2}Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + 30 - w * .2} ${x2} ${y2 - w * .2}`, 'none', 6, shade(c, .2));
  for (const [lx, ly, ls, lr] of leaves) s += leaf(lx, ly, ls, lr);
  return s;
}
function leaf(x, y, s = 1, r = 0, c = '#7cc46a') { return G(tr(x, y, s, r), path('M0 0C40 -60 140 -70 220 0C140 70 40 60 0 0Z', c, SW) + path('M10 0Q110 -4 210 0', 'none', 5, shade(c, -.2))); }
function bgLeaves(t, c = 'rgba(90,160,90,.25)', seed = 2) { const r = rng(seed); let s = ''; for (let i = 0; i < 9; i++) s += G(tr(r() * 1200 - 60, r() * 1800, 1.6 + r() * 1.6, r() * 360 + wave(t, .15, 4, i)), path('M0 0C40 -60 140 -70 220 0C140 70 40 60 0 0Z', c, 0)); return s; }
function grassBed(y, t, c1 = '#5aa04a', c2 = '#7cc46a') { let s = rect(-100, y, 1300, 2000 - y, c1, 0, 0); for (let i = 0; i < 40; i++) { const x = i * 30 - 60, h = 60 + (i * 37 % 50); s += path(`M${x} ${y + 10}Q${x + 8 + wave(t, .5, 6, i / 7)} ${y - h * .5} ${x + 14 + wave(t, .5, 12, i / 7)} ${y - h}Q${x + 14} ${y - h * .4} ${x + 26} ${y + 10}Z`, i % 2 ? c2 : c1, 0); } return s; }
function fork(x, y, s = 1, r = 0) { return G(tr(x, y, s, r), rect(-8, -20, 16, 150, '#cfd6dc', 6, 5) + path('M-28 -20L-28 -90M-10 -20L-10 -90M10 -20L10 -90M28 -20L28 -90M-28 -20Q0 10 28 -20', 'none', 9, '#cfd6dc') + path('M-28 -20L-28 -90M28 -20L28 -90', 'none', 3)); }
function knife(x, y, s = 1, r = 0) { return G(tr(x, y, s, r), rect(-9, 20, 18, 120, '#8a5a3a', 6, 5) + path('M-12 22L-12 -110Q20 -80 12 22Z', '#e6ebef', 5)); }
function bib(x, y, s = 1) { return G(tr(x, y, s), path('M-70 0L70 0L90 130Q0 160 -90 130Z', '#fff', 6) + path('M-60 50L60 50M-70 90L70 90', 'none', 6, '#ff8a8a')); }
function flowerItem(x, y, s = 1, r = 0) { let p = ''; for (let i = 0; i < 6; i++) p += G(`rotate(${i * 60})`, ell(0, -26, 16, 24, '#ff7fb0', 5)); return G(tr(x, y, s, r), line(0, 0, 0, 140, 8, '#4f9a45') + G(tr(0, 0), p + circ(0, 0, 16, '#ffd23f', 5))); }
function plate(x, y, s = 1, inner = '') { return G(tr(x, y, s), ell(0, 0, 220, 70, '#fff', SW) + ell(0, 0, 160, 46, '#f2f2f2', 4) + inner); }
function candleTable(x, y, s, t) { return G(tr(x, y, s), rect(-200, -20, 400, 30, '#fff', 10) + rect(-180, 10, 360, 120, '#e8b4b8', 0, 6) + line(0, 130, 0, 260, 16) + rect(-15, -110, 30, 90, '#fff7e0', 6, 5) + G(tr(0, -125, 1 + wave(t, 4, .1)), path('M0 -30Q14 -6 0 6Q-14 -6 0 -30Z', '#ffb703', 4)) + glow(0, -125, 120, '#ffd27a', .5).replace(/<rect[^>]*>/, m => m.replace('x="-400" y="-400"', 'x="-200" y="-260"').replace(/width="[^"]*" height="[^"]*"/, 'width="400" height="300"'))); }
function ghostHead(x, y, s, t, o = {}) { const w = wave(t, 1.2, 8); return G(tr(x, y + w, s), path('M-90 40C-110 -120 110 -120 90 40Q70 20 50 50Q30 20 10 50Q-10 20 -30 50Q-50 20 -70 50Q-80 30 -90 40Z', 'rgba(255,255,255,.88)', 6) + circ(-30, -20, 12, OL, 0) + circ(30, -20, 12, OL, 0) + line(-20, 20, 20, 20, 6) + ell(0, -120 + w * .2, 60, 14, 'none', 10, '#ffd23f')); }
function medal(x, y, s = 1) { return G(tr(x, y, s), path('M-30 -120L0 -40L30 -120', 'none', 18, '#4d7cf0') + circ(0, 0, 60, '#ffd23f', SW) + circ(0, 0, 40, '#ffe680', 4) + sparkle(0, 0, .5, '#fff')); }
function lightning(x, y, s, o = 1) { return op(o, G(tr(x, y, s), path('M0 0L-60 200L20 190L-40 400L120 140L30 150L90 0Z', '#fff3a0', 6))); }
