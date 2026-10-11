// ============================================================
//  Outils « cinéma » : fausse 3D par couches (parallaxe + flou de profondeur + brume),
//  caméra épaule, POV (yeux de la tortue, viseur de l'aigle), letterbox, premiers plans flous,
//  aigle de face (piqué vers la caméra).
// ============================================================

// flou gaussien (filtres déclarés à la volée, réutilisables dans la frame)
function blur(px, svg, dir = '') {
  if (px < .6) return svg;
  const p = Math.round(px), id = 'bl' + p + (dir ? 'h' : '');
  const sd = dir === 'h' ? `${p} 0` : `${p}`;
  return `<defs><filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter></defs><g filter="url(#${id})">${svg}</g>`;
}
// brume atmosphérique : teinte la couche vers une couleur (lointain)
function haze(k, col, svg) {
  if (k <= .01) return svg;
  const id = 'hz' + (_gid++);
  return `<defs><filter id="${id}"><feFlood flood-color="${col}" flood-opacity="${k.toFixed(2)}"/><feComposite in2="SourceGraphic" operator="in"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode/></feMerge></filter></defs><g filter="url(#${id})">${svg}</g>`;
}

// SCÈNE EN PROFONDEUR. cam = {x, y, zoom}. layers = [{z, svg, blur, haze, hazeCol}] du plus loin au plus proche.
// z = 1 : plan de mise au point (bouge comme la caméra) ; z > 1 : loin (bouge moins) ; z < 1 : premier plan (bouge plus, plus gros).
function depth(cam, layers) {
  const zoom = cam.zoom ?? 1, cx = cam.x || 0, cy = cam.y || 0;
  let s = '';
  for (const L of layers) {
    if (!L || !L.svg) continue;
    const k = 1 / L.z, sc = 1 + (zoom - 1) * k;
    let g = `<g transform="translate(${f1(CXc - cx * k)} ${f1(CYc - cy * k)}) scale(${sc.toFixed(4)}) translate(${-CXc} ${-CYc})">${L.svg}</g>`;
    if (L.haze) g = haze(L.haze, L.hazeCol || '#dfeefc', g);
    if (L.blur) g = blur(L.blur, g);
    s += g;
  }
  return s;
}
const CXc = W / 2, CYc = H / 2;

// interpolation de caméra entre 2 positions (dolly/travelling/grue)
function camMove(t, d, a, b, ease = eInOut) { const k = ease(clamp(t / d)); return { x: lerp(a.x || 0, b.x || 0, k), y: lerp(a.y || 0, b.y || 0, k), zoom: lerp(a.zoom ?? 1, b.zoom ?? 1, k) }; }

// caméra épaule : bruit basse fréquence [x, y, rot]
function handheld(t, a = 1) {
  return [(Math.sin(t * 1.3) * 9 + Math.sin(t * 2.9 + 1) * 5 + Math.sin(t * 6.1 + 2) * 2) * a,
    (Math.sin(t * 1.1 + 3) * 7 + Math.sin(t * 3.3) * 4 + Math.sin(t * 7.3 + 1) * 1.5) * a,
    (Math.sin(t * .9 + 2) * .6 + Math.sin(t * 2.3) * .3) * a];
}

// bandes cinéma
function letterbox(k = 1) { const h = 110 * k; return k <= 0 ? '' : rect(-10, -10, W + 20, h + 10, '#000', 0, 0) + rect(-10, H - h, W + 20, h + 10, '#000', 0, 0); }

// POV de la tortue : paupières qui clignent (blinks = [t0,...]) + vignette sombre + léger flou de bord
function povEyes(t, blinks = [], o = .55) {
  let k = 0; for (const b of blinks) k = Math.max(k, 1 - Math.abs(t - b) / .12);
  const id = 'pv' + (_gid++);
  let s = `<defs><radialGradient id="${id}" cx="${W / 2}" cy="${H / 2}" r="${W * .62}" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${o}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  if (k > 0) { const lid = H / 2 * clamp(k); s += path(`M-10 -10L${W + 10} -10L${W + 10} ${lid}Q${W / 2} ${lid + 120} -10 ${lid}Z`, '#3a2b25', 0) + path(`M-10 ${H + 10}L${W + 10} ${H + 10}L${W + 10} ${H - lid}Q${W / 2} ${H - lid - 120} -10 ${H - lid}Z`, '#3a2b25', 0); }
  return s;
}
// POV de l'aigle : vision prédateur (teinte, viseur qui verrouille la cible)
function povEagle(t, tx, ty, lock = 1) {
  const id = 'pe' + (_gid++);
  let s = `<rect width="${W}" height="${H}" fill="rgba(255,60,40,.12)"/><defs><radialGradient id="${id}" cx="${W / 2}" cy="${H / 2}" r="${W * .55}" gradientUnits="userSpaceOnUse"><stop offset=".6" stop-color="#300" stop-opacity="0"/><stop offset="1" stop-color="#300" stop-opacity=".75"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  const r = lerp(260, 120, lock), rot = (1 - lock) * 90 + t * 20;
  s += G(tr(tx, ty, 1, rot), circ(0, 0, r, 'none', 6, '#ff3b30') + [0, 90, 180, 270].map(a => G(`rotate(${a})`, line(r - 30, 0, r + 40, 0, 8, '#ff3b30'))).join(''));
  if (lock >= 1) s += G(tr(tx, ty - r - 60), text(0, 0, 'none', 'MIAM', '#ff3b30', 60));
  return s;
}
// traits de vitesse horizontaux (travelling rapide)
function streaks(t, dir = 1, n = 18, c = 'rgba(255,255,255,.55)', seed = 5) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const y = r() * H, len = 200 + r() * 500, x = ((r() * W - dir * t * 3000) % (W + 800) + W + 800) % (W + 800) - 400; s += line(x, y, x + len, y, 4 + r() * 8, c); }
  return s;
}
// gros plan d'impact : contour de choc (anneau) qui s'étend
function shockRing(x, y, t, t0, c = '#fff') { const k = seg(t, t0, t0 + .4); return k <= 0 || k >= 1 ? '' : circ(x, y, 40 + k * 500, 'none', 30 * (1 - k), c); }

// ---------- premiers plans (à mettre en couche z < 1, floutés) ----------
function fgGrass(x, y, s, t, c = '#6c9a3c', seed = 2) { const r = rng(seed); let g = ''; for (let i = 0; i < 9; i++) { const a = -90 + (r() - .5) * 50 + wave(t, .5, 4, r()), l = 160 + r() * 200; g += path(`M${(i - 4) * 26} 0Q${(i - 4) * 26 + Math.cos(R(a)) * l * .3} ${-l * .5} ${(i - 4) * 26 + Math.cos(R(a)) * l} ${Math.sin(R(a)) * l}`, 'none', 22, shade(c, (r() - .5) * .3)); } return G(tr(x, y, s), g); }
function fgDune(x, y, w, h, c = SAND_D) { return path(`M${x - w / 2} ${y + h}Q${x - w / 4} ${y} ${x} ${y + 10}Q${x + w / 4} ${y - 20} ${x + w / 2} ${y + h}Z`, c, 0); }
function fgRock(x, y, s, c = '#8d8a86') { return G(tr(x, y, s), path('M-160 60Q-170 -40 -80 -80Q0 -120 90 -70Q170 -30 160 60Z', c, 0) + path('M-80 -60Q-20 -90 40 -70', 'none', 10, 'rgba(255,255,255,.25)')); }
function fgShell(x, y, s, r = 0) { return G(tr(x, y, s, r), path('M0 60L-70 -10Q-60 -70 0 -80Q60 -70 70 -10Z', '#ffd9c7') + path('M0 60L-40 -60M0 60L0 -80M0 60L40 -60', 'none', 5, '#e8a990')); }
function fgBubbles(t, seed = 3, n = 7) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * W, y = ((r() * H - t * (60 + r() * 80)) % (H + 300) + H + 300) % (H + 300) - 150; s += circ(x, y, 30 + r() * 60, 'rgba(255,255,255,.18)', 6, 'rgba(255,255,255,.5)'); } return s; }
function fgKelp(x, y, s, t, c = '#2f7d4a') { return G(tr(x, y, s), kelp(0, 0, 900, t, c, x)); }
function bokeh(t, seed = 4, n = 12, cols = ['#ffe08a', '#fff6c8', '#ffcf70']) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) s += circ(r() * W, r() * H * .8, 40 + r() * 90, cols[i % cols.length], 0).replace('/>', ` opacity="${(.25 + .2 * Math.sin(t + i)).toFixed(2)}"/>`); return s; }

// AIGLE DE FACE (fonce vers la caméra) : ailes déployées, serres en avant, gueule baveuse
function eagleFront(o, t = 0) {
  const fl = o.wingA !== undefined ? o.wingA : wave(t, o.flap ?? 1.4, 22);
  const C = o.gull ? { body: '#f4f4f2', wing: '#aab6c2', beak: '#f39c32' } : { body: '#6b4a2f', wing: '#5a3d26', beak: '#ffc93c' };
  let s = '';
  for (const sd of [-1, 1]) s += G(`scale(${sd} 1)`, G(tr(60, -40, 1, -fl), path('M0 0C120 -160 330 -230 560 -200L520 -150L590 -120L520 -90L560 -50L470 -40L500 10C330 30 160 60 0 70Z', C.wing) + path('M140 -60L380 -150M120 0L360 -50', 'none', 6, 'rgba(0,0,0,.2)')));
  s += path('M-120 0C-130 160 -60 230 0 230C60 230 130 160 120 0C110 -80 -110 -80 -120 0Z', C.body);
  // serres
  const tal = o.talons ?? 1;
  for (const sd of [-1, 1]) { s += line(sd * 50, 200, sd * 70, 260 + 40 * tal, 22) + line(sd * 50, 200, sd * 70, 260 + 40 * tal, 12, '#ffc93c'); for (const a of [-40, 0, 40]) s += G(tr(sd * 70, 270 + 40 * tal, 1, 90 + a * (.3 + tal * .9)), path('M0 0L40 0Q56 4 58 22', 'none', 12) + path('M0 0L40 0', 'none', 6, '#ffc93c')); }
  // tête
  const hy = -110;
  s += circ(0, hy, 110, o.gull ? '#fff' : '#fff');
  const ex = o.expr || 'starving';
  for (const sd of [-1, 1]) {
    const exx = sd * 46, eyy = hy - 20, big = ex === 'starving' ? (sd < 0 ? 1.25 : 1) : 1;
    s += circ(exx, eyy, 26 * big, ex === 'starving' ? '#fff7c2' : '#ffd23f', 6) + circ(exx + Math.sin(t * 29 + sd) * 3, eyy, 9, OL, 0);
    if (ex === 'starving') s += path(`M${exx - 22 * big} ${eyy + 4}l10 -2M${exx + 20 * big} ${eyy - 8}l-9 4`, 'none', 3, '#ff4d4d');
    s += line(sd * 12, hy - 38, sd * 86, hy - 70, 13);
  }
  const mo = o.mouthOpen ?? (.6 + .4 * Math.sin(t * 6));
  s += path(`M-46 ${hy + 20}L46 ${hy + 20}L0 ${hy + 120}Z`, C.beak);
  s += path(`M-34 ${hy + 34}L34 ${hy + 34}L0 ${hy + 34 + 60 * mo}Z`, '#6b1f24', 5) + path(`M-14 ${hy + 40}q14 ${40 * mo} 28 0Z`, '#ff8a9a', 0);
  if (ex === 'starving') for (let i = 0; i < 4; i++) { const k = (t * 1.2 + i / 4) % 1, dx = -30 + i * 20; s += path(`M${dx} ${hy + 70}q${-4 + i * 2} ${70 + k * 200} 2 ${90 + k * 240}`, 'none', 10 - i, 'rgba(190,232,255,.95)') + circ(dx + 2, hy + 160 + k * 240, 10 - i, '#bfe8ff', 3, '#7cc4e8'); }
  if (o.bib) s += G(tr(0, hy + 130, .8), bib(0, 0));
  return G(tr(o.x || 0, o.y || 0, o.s || 1, o.rot || 0), s);
}
