// ============================================================
//  Cheveux qui tombent : crinière -> golfes -> dégarni -> mèche ramenée -> rasé
//  À passer à person()/head() via  hairFn: mane({ loss, wind, comb, shaved, color })
//  renvoie (r, t) => [derrière, devant]
// ============================================================
const HAIR_BROWN = '#5a3a28';
function mane(o = {}) {
  return (r, t) => {
    const k = clamp(o.loss || 0), col = o.color || HAIR_BROWN, dk = shade(col, -.25);
    let back = '', front = '';
    if (o.shaved) {
      // crâne rasé : ombre de barbe à cheveux + reflet
      let st = ''; const rr = rng(7); for (let i = 0; i < 60; i++) { const a = R(200 + rr() * 140), d = r * (.5 + rr() * .45); st += circ(Math.cos(a) * d, Math.sin(a) * d, r * .012, 'rgba(60,40,30,.35)', 0); }
      return ['', st + ell(-r * .3, -r * .62, r * .26, r * .1, 'rgba(255,255,255,.75)', 0).replace('<ellipse', `<ellipse transform="rotate(-25 ${f1(-r * .3)} ${f1(-r * .62)})"`) + sparkle(-r * .55, -r * .78, r / 400 * (1 + .3 * Math.sin(t * 6)), '#fff')];
    }
    // côtés (couronne qui reste toujours)
    const side = sd => path(`M${sd * r * .78} ${-r * .62}C${sd * r * 1.15} ${-r * .4} ${sd * r * 1.12} ${r * .15} ${sd * r * .95} ${r * .35}L${sd * r * .86} ${r * .05}C${sd * r * .9} ${-r * .2} ${sd * r * .84} ${-r * .38} ${sd * r * .7} ${-r * .5}Z`, col, 6);
    back += side(-1) + side(1);
    const capVis = k < .86;
    if (capVis) {
      const vol = lerp(1.32, 1.04, clamp(k * 1.2));
      // ligne frontale (golfes en M qui reculent)
      const yS = lerp(-.1, -.3, k), yT = lerp(-.4, -1.0, clamp(k * 1.7)), yM = lerp(-.45, -.92, clamp(k * 1.25)), yC = lerp(-.32, -.97, clamp(k * 1.15));
      let d = `M${-r * 1.02} ${r * .05}C${-r * 1.15} ${-r * .9} ${-r * .55} ${-r * vol} 0 ${-r * vol}C${r * .55} ${-r * vol} ${r * 1.15} ${-r * .9} ${r * 1.02} ${r * .05}`;
      d += `L${r * .88} ${r * yS}Q${r * .72} ${r * (yT + .05)} ${r * .55} ${r * yT}Q${r * .42} ${r * (yM + .1)} ${r * .25} ${r * yM}Q${r * .12} ${r * (yC - .02)} 0 ${r * yC}`;
      d += `Q${-r * .12} ${r * (yC - .02)} ${-r * .25} ${r * yM}Q${-r * .42} ${r * (yM + .1)} ${-r * .55} ${r * yT}Q${-r * .72} ${r * (yT + .05)} ${-r * .88} ${r * yS}Z`;
      const op_ = k > .6 ? 1 - (k - .6) / .26 * .55 : 1;
      front += `<g opacity="${op_.toFixed(2)}">` + path(d, col, 6);
      // mèches / volume (crinière)
      if (k < .4) front += path(`M${-r * .2} ${-r * vol}C${-r * .1} ${-r * (vol + .28)} ${r * .35} ${-r * (vol + .3)} ${r * .3} ${-r * (vol - .05)}C${r * .45} ${-r * (vol + .15)} ${r * .7} ${-r * (vol - .05)} ${r * .55} ${-r * (vol - .2)}`, col, 6) +
        path(`M${-r * .6} ${-r * .75}Q${-r * .3} ${-r * .95} ${-r * .05} ${-r * .85}M${r * .1} ${-r * .95}Q${r * .4} ${-r * 1.05} ${r * .65} ${-r * .8}`, 'none', 5, dk);
      else front += path(`M${-r * .4} ${-r * .82}Q${-r * .2} ${-r * .92} 0 ${-r * .85}M${r * .15} ${-r * .9}Q${r * .35} ${-r * .95} ${r * .5} ${-r * .82}`, 'none', 4, dk);
      front += '</g>';
    }
    // reflet du crâne qui apparaît
    if (k > .35) front = ell(-r * .25, -r * .78, r * .22 * k, r * .07 * k, 'rgba(255,255,255,.7)', 0) + front;
    // mèche ramenée de derrière vers l'avant (combover) ; wind 0..1 la soulève comme un couvercle
    if (o.comb) {
      const w = o.wind || 0, flap = -w * (110 + 25 * Math.sin(t * 14));
      let strands = '';
      for (let i = 0; i < 6; i++) { const y0 = -r * (.55 + i * .07); strands += path(`M${r * .9} ${y0 + r * .2}C${r * .4} ${y0 - r * .35} ${-r * .3} ${y0 - r * .25} ${-r * .82} ${y0 + r * .05}`, 'none', 7, i % 2 ? col : dk); }
      front += G(`rotate(${f1(flap)} ${f1(r * .9)} ${f1(-r * .45)})`, path(`M${r * .92} ${-r * .3}C${r * .5} ${-r * 1.05} ${-r * .4} ${-r * 1.08} ${-r * .86} ${-r * .45}C${-r * .4} ${-r * .8} ${r * .4} ${-r * .75} ${r * .92} ${-r * .3}Z`, col, 6) + strands);
    }
    return [back, front];
  };
}
// tas de cheveux (douche) — assez pour une perruque
function hairPile(x, y, s = 1, col = HAIR_BROWN) { let g = path('M-160 40C-170 -40 -90 -90 0 -80C90 -95 170 -40 160 40Z', col, 6); const r = rng(3); for (let i = 0; i < 14; i++) { const a = r() * 3.14, l = 60 + r() * 80; g += path(`M${f1((r() - .5) * 220)} ${f1(-r() * 60)}q${f1(Math.cos(a) * l * .5)} ${f1(-l * .4)} ${f1(Math.cos(a) * l)} ${f1(-Math.sin(a) * l * .3)}`, 'none', 5, shade(col, -.3)); } return G(tr(x, y, s), g); }
function wig(x, y, s = 1, col = HAIR_BROWN, r_ = 0) { return G(tr(x, y, s, r_), path('M-110 30C-130 -90 -50 -130 0 -128C50 -130 130 -90 110 30L80 0Q0 -30 -80 0Z', col, 6) + path('M-60 -90Q0 -110 60 -90', 'none', 5, shade(col, -.3))); }
// follicule pileux en coupe (k = 1 sain, 0 miniaturisé)
function follicle(x, y, s, k, t = 0) {
  const w = lerp(6, 26, k), len = lerp(60, 260, k);
  return G(tr(x, y, s), path(`M-30 0Q-40 120 -16 200Q0 230 16 200Q40 120 30 0`, '#ffd9c2', 6) + ell(0, 205, 26, 20, '#f4a3a3', 5) + path(`M0 190L0 ${-len}`, 'none', w + 10, OL) + path(`M0 190L0 ${-len}`, 'none', w, HAIR_BROWN) + path(`M0 ${-len}q${8 * k} -10 ${-4} -24`, 'none', 4));
}
// molécule DHT méchante
function dhtMonster(x, y, s, t, o = {}) {
  const b = 1 + .06 * Math.sin(t * 8);
  let g = '';
  for (let i = 0; i < 6; i++) { const a = R(i * 60 + t * 40); g += line(0, 0, Math.cos(a) * 120, Math.sin(a) * 120, 14) + circ(Math.cos(a) * 125, Math.sin(a) * 125, 26, '#b56cff'); }
  g += G(`scale(${b})`, circ(0, 0, 90, '#8e44ff') + circ(-30, -15, 18, '#fff', 5) + circ(30, -15, 18, '#fff', 5) + circ(-26, -12, 8, OL, 0) + circ(34, -12, 8, OL, 0) + line(-56, -48, -12, -30, 9) + line(56, -48, 12, -30, 9) + path('M-36 30Q0 54 36 30Q0 40 -36 30Z', '#5a1f3a', 5) + path('M-24 32L-18 42L-12 33M12 33L18 42L24 32', '#fff', 3));
  g += text(0, 160, OL, 'DHT', '#e6ccff', 64);
  if (o.scissors) g += G(tr(110, -60, .8, -30 + Math.sin(t * 14) * 12), scissors(0, 0, 1, 0, .5 + .5 * Math.sin(t * 14)));
  return G(tr(x, y, s), g);
}
function bottleProd(x, y, s, col = '#5ec4f0', label = '', r = 0) { return G(tr(x, y, s, r), rect(-60, -150, 120, 260, col, 30) + rect(-30, -200, 60, 60, '#fff', 10) + rect(-45, -60, 90, 90, '#fff', 12, 4) + text(0, 0, 'none', label, OL, 26) + ell(-30, -110, 12, 30, 'rgba(255,255,255,.5)', 0)); }
function rosemaryOil(x, y, s, r = 0) { return G(tr(x, y, s, r), rect(-45, -110, 90, 170, '#7a9a3a', 22) + rect(-22, -170, 44, 64, '#2b2b2b', 10) + ell(0, -186, 26, 18, '#2b2b2b', 5) + path('M-20 -40Q0 -90 20 -40M-10 -60L-26 -74M8 -64L24 -78M-4 -48L-20 -58M4 -52L20 -62', 'none', 5, '#cfe8a0')); }
function clippers(x, y, s, r = 0, t = 0) { const v = Math.sin(t * 60) * 3; return G(tr(x + v, y, s, r), rect(-50, -160, 100, 300, '#33373d', 40) + rect(-60, -200, 120, 50, '#c9ced6', 8) + Array.from({ length: 6 }, (_, i) => line(-50 + i * 20, -200, -50 + i * 20, -222, 5)).join('') + circ(0, 0, 18, '#5fd068', 4)); }
function searchBar(x, y, w, str, t, t0 = 0) { const n = Math.floor(clamp((t - t0) * 18, 0, str.length)); return G(tr(x, y), rect(-w / 2, -50, w, 100, '#fff', 50) + circ(-w / 2 + 50, 0, 18, 'none', 6, '#7a8a99') + line(-w / 2 + 62, 12, -w / 2 + 76, 26, 6, '#7a8a99') + `<text x="${-w / 2 + 100}" y="14" font-family="Fredoka, sans-serif" font-weight="700" font-size="38" fill="${OL}">${str.slice(0, n)}${(t * 2) % 1 < .5 ? '|' : ''}</text>`); }
