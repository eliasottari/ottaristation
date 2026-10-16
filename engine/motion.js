// ============================================================
//  SIZEX — boîte à outils MOTION DESIGN (par-dessus l'ADN cartoon de lib.js)
//  Typo cinétique (mot-clé « slam » + écho couleur, mots fins en blur-in, décodage, compteur),
//  cadres d'outil de design, pilules, cartes 2.5D extrudées, anneaux concentriques, flèches/cercles au marqueur,
//  textures (grain, trame, papier, ombre de feuillage), glitch RGB, tunnel d'étoiles, film N&B, transitions.
//  Toutes les fonctions sont pures (dépendent seulement de t) → rendu déterministe.
// ============================================================

// ---------- design system SIZEX ----------
const SX = {
  ink: '#151217', paper: '#f3ead8', cream: '#fbf6ec',
  acc: '#ff3d2e',        // accent unique (emphase) — surchargé par épisode : SX.acc = '#…'
  acc2: '#ffd23f',       // jaune marqueur (annotations)
  cool: '#2fa3a0',       // secondaire
  display: "Anton, Impact, sans-serif", thin: "Outfit, Fredoka, sans-serif", marker: "'Permanent Marker', Fredoka, sans-serif",
  fun: 0,                // 1 = SIZEX « fun » : police Komika, contours cartoon épais, formes rebondies (activer avec sxFun())
};
// SIZEX fun (validé) : police comics Komika Axis partout, contours #2b2420, formes molles/rebondies
// police par défaut = Fredoka (validé après « front ») ; sxFun(acc, 'komika') pour l'ancienne police comics
function sxFun(acc, font = 'fredoka') { SX.fun = 1; SX.display = SX.thin = SX.marker = font === 'komika' ? "Komika, Fredoka, sans-serif" : "Fredoka, sans-serif"; SX.weight = font === 'komika' ? 400 : 700; if (acc) SX.acc = acc; }
const _sxid = p => p + (_gid++);

// texte « libre » (police au choix, sans contour cartoon)
function ftext(x, y, str, o = {}) {
  const sz = o.size || 100, anchor = o.anchor || 'middle';
  if (SX.fun && o.stroke === undefined && o.font !== 'Fredoka') o = Object.assign({}, o, { stroke: OL, sw: sz * .13 });
  const st = o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || sz * .08}" paint-order="stroke" stroke-linejoin="round"` : '';
  const ls = o.ls != null ? ` letter-spacing="${f1(o.ls)}"` : '';
  return `<text x="${f1(x)}" y="${f1(y)}" font-family="${o.font || SX.display}" font-weight="${SX.fun ? (SX.weight || 700) : (o.weight || 400)}" font-size="${f1(sz)}" text-anchor="${anchor}" fill="${o.fill || '#fff'}"${st}${ls}${o.extra || ''}>${str}</text>`;
}
// dégradé vertical 2 couleurs (renvoie [defs, url])
function vgrad(c1, c2) { const id = _sxid('vg'); return [`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`, `url(#${id})`]; }
const blurPx = (px, svg) => px < .4 ? svg : (() => { const id = _sxid('bz'); return `<defs><filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${f1(px)}"/></filter></defs><g filter="url(#${id})">${svg}</g>`; })();

// ---------- TYPO CINÉTIQUE ----------
// mot-clé : slam-in (échelle 2.4 → 1 avec écrasement), ombre décalée + contour accent, écho couleur pendant l'entrée, bouffée à l'atterrissage
function kword(str, x, y, t, t0, o = {}) {
  const k = seg(t, t0, t0 + (o.d || .28)); if (k <= 0) return '';
  const sz = o.size || 170, fill = o.fill || '#fff', acc = o.acc || SX.acc;
  const e = eOutCubic(k), s = lerp(o.from ?? 2.4, 1, e);
  const land = seg(t, t0 + (o.d || .28), t0 + (o.d || .28) + .22), sq = 1 + Math.sin(land * Math.PI) * .12 * (1 - land);
  const T_ = ftext(0, sz * .36, str, { size: sz, fill: o.grad ? 'GRAD' : fill, font: o.font || SX.display, ls: o.ls });
  let g = '';
  if (k < 1) for (let i = 4; i >= 1; i--) g += op(.22 * (1 - k) * (5 - i) / 4, G(`translate(${f1(-i * 26 * (o.dir || 1))} ${f1(i * 18)})`, T_.replace('GRAD', acc)));
  g += G(`translate(${f1(sz * .045)} ${f1(sz * .055)})`, T_.replace('GRAD', SX.ink).replace(/fill="[^"]*"/, `fill="${o.shadow || SX.ink}"`));
  g += SX.fun ? T_.replace('GRAD', fill) : T_.replace('GRAD', fill).replace('<text', `<text stroke="${acc}" stroke-width="${f1(sz * .05)}" paint-order="stroke"`);
  if (o.grad) { const [d, u] = vgrad(o.grad[0], o.grad[1]); g += d + T_.replace('GRAD', u); }
  if (land > 0 && land < 1 && o.puff !== false) for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; g += op(1 - land, circ(Math.cos(a) * sz * (1.2 + land * 1.2), Math.sin(a) * sz * .5 * (1 + land), sz * .12 * (1 - land), '#fff', 0)); }
  const glow = o.glow ? blurPx(sz * .16, ftext(0, sz * .36, str, { size: sz, fill: o.glow, font: o.font || SX.display, ls: o.ls })) : '';
  const wob = SX.fun ? Math.sin((t - t0) * 5) * 2.5 * seg(t, t0 + .3, t0 + .5) : 0;
  return G(`translate(${f1(x)} ${f1(y)}) rotate(${f1((o.r || 0) + wob)}) scale(${f1(s * sq)} ${f1(s / sq)})`, op(o.op ?? 1, glow + g));
}
// mot fin : blur-in (flou 12 → 0, monte de 20 px), sortie en dissolution
function kthin(str, x, y, t, t0, o = {}) {
  const k = seg(t, t0, t0 + (o.d || .22)); if (k <= 0) return '';
  const out = o.out != null ? 1 - seg(t, o.out, o.out + .25) : 1; if (out <= 0) return '';
  const e = eOutCubic(k);
  return op(e * out, blurPx(12 * (1 - e) + 8 * (1 - out), ftext(x, y + 20 * (1 - e), str, { size: o.size || 64, fill: o.fill || '#fff', font: o.font || SX.thin, weight: o.weight || 200, ls: o.ls, anchor: o.anchor })));
}
// phrase construite mot à mot : words = [[mot, t0, {key:1}] …] ; les mots-clés en display + accent, les autres fins
function kline(words, x, y, t, o = {}) {
  const sz = o.size || 70; let cx = 0; const parts = [];
  for (const [w, t0, wo = {}] of words) { const ws = wo.key ? sz * 1.5 : sz; const wd = w.length * ws * (wo.key ? .5 : .52); parts.push([w, t0, wo, ws, cx + wd / 2]); cx += wd + sz * .3; }
  const off = o.anchor === 'start' ? 0 : -cx / 2;
  return parts.map(([w, t0, wo, ws, px]) => wo.key ? kword(w, x + off + px, y - ws * .1, t, t0, { size: ws, puff: false, from: 1.6, acc: wo.acc, fill: wo.fill })
    : kthin(w, x + off + px, y, t, t0, { size: ws, fill: o.fill, weight: o.weight })).join('');
}
// décodage : caractères aléatoires → mot final
function scramble(str, t, t0, d = .5, seed = 3) {
  const k = seg(t, t0, t0 + d); if (t < t0) return ''; const n = Math.floor(k * str.length * 1.0001), G_ = '01#%@&$X?!';
  const r = rng(seed + Math.floor(t * 30)); let s = '';
  for (let i = 0; i < str.length; i++) s += i < n || str[i] === ' ' ? str[i] : G_[Math.floor(r() * G_.length)];
  return s;
}
const counter = (a, b, t, t0, d = .8) => Math.round(lerp(a, b, eOutCubic(seg(t, t0, t0 + d))));
// mot 3D extrudé (pile de copies plus sombres + face avant)
function extrude(str, x, y, t, t0, o = {}) {
  const k = pop(t, t0, .4); if (k <= 0) return '';
  const sz = o.size || 150, n = o.depth || 12, dx = o.dx ?? 1.6, dy = o.dy ?? 2.2; let g = '';
  for (let i = n; i >= 1; i--) g += ftext(i * dx, sz * .36 + i * dy, str, { size: sz, fill: shade(o.side || '#9aa3ad', -.25 - i / n * .3), font: o.font || SX.display, ls: o.ls });
  g += ftext(0, sz * .36, str, { size: sz, fill: o.fill || '#fff', font: o.font || SX.display, stroke: o.stroke, sw: o.sw, ls: o.ls });
  return G(tr(x, y, k, o.r || 0), ellShadow(0, sz * .5 + n * dy + 20, str.length * sz * .3, 22) + g);
}
const ellShadow = (x, y, rx, ry) => blurPx(10, ell(x, y, rx, ry, 'rgba(0,0,0,.28)', 0));

// ---------- ÉLÉMENTS UI / DESIGN ----------
// cadre de sélection d'outil de design (pointillés + poignées carrées), se trace puis tourne légèrement
function selBox(x, y, w, h, t, t0, o = {}) {
  const k = seg(t, t0, t0 + .3); if (k <= 0) return '';
  const col = o.col || '#4d9fff', per = 2 * (w + h), drawn = per * eOutCubic(k);
  let g = `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="none" stroke="${col}" stroke-width="5" stroke-dasharray="${f1(drawn)} ${f1(per)}"/>`;
  if (k >= 1) for (const [hx, hy] of [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]]) g += rect(hx * w / 2 - 11, hy * h / 2 - 11, 22, 22, '#fff', 3, 4, col);
  if (o.label && k >= 1) g += G(tr(-w / 2, -h / 2 - 34), rect(0, -26, o.label.length * 20 + 30, 44, col, 8, 0) + ftext(15, 6, o.label, { size: 30, fill: '#fff', font: SX.thin, weight: 200, anchor: 'start' }));
  return G(tr(x, y, 1, (o.r || 0) * eOutCubic(seg(t, t0 + .3, t0 + .9))), g);
}
// pilule : point → cercle → pilule (texte blanc gras, bord lumineux)
function pill(x, y, str, t, t0, o = {}) {
  const k = seg(t, t0, t0 + .45); if (k <= 0) return '';
  const sz = o.size || 54, W_ = str.length * sz * .55 + sz * 1.4, H_ = sz * 1.7;
  const a = seg(k, 0, .45), b = eOutBack(seg(k, .45, 1));
  const w = lerp(H_ * a, W_, b), col = o.col || SX.ink, bd = o.border || SX.acc2;
  let g = (o.glow !== false ? blurPx(14, rect(-w / 2, -H_ / 2 * a, w, H_ * a, 'none', H_ / 2, 8, bd)) : '') + rect(-w / 2, -H_ / 2 * a, w, H_ * a, col, H_ / 2, 6, bd);
  if (b > .6) g += op((b - .6) / .4, ftext(0, sz * .36, str, { size: sz, fill: o.fg || '#fff', font: o.font || SX.display }));
  return G(tr(x, y, 1, o.r || 0), g);
}
// anneaux concentriques colorés en cascade
function rings(x, y, t, t0, cols = [SX.acc, SX.acc2, SX.cool, '#4d7cf0'], r = 520) {
  let g = ''; cols.forEach((c, i) => { const k = seg(t, t0 + i * .07, t0 + i * .07 + .55); if (k > 0 && k < 1) g += circ(x, y, r * eOutCubic(k), 'none', 40 * (1 - k) + 4, c); }); return g;
}
// carte 2.5D : bascule en perspective (rotY/rotX), épaisseur extrudée, ombre portée, bord blanc
function card(x, y, w, h, inner, t, t0, o = {}) {
  const k = pop(t, t0, .45); if (k <= 0) return '';
  const ry = (o.ry ?? 22) * (o.flat ? 1 - seg(t, o.flat, o.flat + .4) : 1), rx = o.rx ?? 0;
  const sx = Math.cos(R(ry)), sk = Math.sin(R(ry)) * 18, sy = Math.cos(R(rx));
  const th = o.thick ?? 18; let g = '';
  for (let i = th; i > 0; i -= 3) g += rect(-w / 2 + i * .6, -h / 2 + i * .8, w, h, shade(o.edge || '#cfd6dc', -.2), o.rad ?? 22, 0);
  g += rect(-w / 2, -h / 2, w, h, o.bg || '#fff', o.rad ?? 22, o.bw ?? 6, o.bc || SX.ink) + inner;
  return ellShadow(x + 20, y + h / 2 * k + 40, w * .45 * k, 26) + G(`translate(${f1(x)} ${f1(y)}) rotate(${f1(o.r || 0)}) matrix(${f1(sx * k)} ${f1(sk / 100)} 0 ${f1(sy * k)} 0 0)`, g);
}
// éventail de cartes en arc (cascade 80 ms)
function cardArc(cx, cy, n, rr, t, t0, innerFn, o = {}) { let s = ''; for (let i = 0; i < n; i++) { const a = R(-150 + i * (120 / Math.max(1, n - 1))); s += card(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .7, o.w || 190, o.h || 150, innerFn(i), t, t0 + i * .08, { ry: 0, thick: 8, r: (i - (n - 1) / 2) * 7, bw: 5 }); } return s; }
// autocollant : bord blanc épais, ombre, arrive en tournant
function sticker(svg, x, y, s, t, t0, o = {}) { const k = pop(t, t0, .4); if (k <= 0) return ''; return G(tr(x + 10, y + 14, s * k, (o.r ?? -8) + (1 - k) * 40), op(.3, svg.replace(/fill="[^"#]*#[0-9a-fA-F]{3,6}"/g, 'fill="#000"'))) + G(tr(x, y, s * k, (o.r ?? -8) + (1 - k) * 40), svg); }

// ---------- MARQUEUR (annotations dessinées à la main) ----------
function markerPath(d, t, t0, o = {}) { const k = eOutCubic(seg(t, t0, t0 + (o.d || .35))); if (k <= 0) return ''; const L = o.len || 1400;
  return `<path d="${d}" fill="none" stroke="${o.col || SX.acc2}" stroke-width="${o.w || 14}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${f1(L * k)} ${L}"/>`; }
function markerArrow(x1, y1, x2, y2, t, t0, o = {}) { const mx = (x1 + x2) / 2 + (o.bend ?? 80), my = (y1 + y2) / 2 - (o.bend ?? 80), a = Math.atan2(y2 - my, x2 - mx);
  return markerPath(`M${f1(x1)} ${f1(y1)}Q${f1(mx)} ${f1(my)} ${f1(x2)} ${f1(y2)}`, t, t0, o) + (seg(t, t0, t0 + (o.d || .35)) >= 1 ? markerPath(`M${f1(x2 - Math.cos(a - .5) * 50)} ${f1(y2 - Math.sin(a - .5) * 50)}L${f1(x2)} ${f1(y2)}L${f1(x2 - Math.cos(a + .5) * 50)} ${f1(y2 - Math.sin(a + .5) * 50)}`, t, t0 + (o.d || .35), { ...o, d: .12, len: 200 }) : ''); }
function markerCircle(x, y, rx, ry, t, t0, o = {}) { let d = ''; for (let i = 0; i <= 26; i++) { const a = R(-100 + i * 15), j = 1 + .06 * Math.sin(i * 1.7); d += (i ? 'L' : 'M') + f1(x + Math.cos(a) * rx * j) + ' ' + f1(y + Math.sin(a) * ry * j); } return markerPath(d, t, t0, { len: 2 * Math.PI * Math.max(rx, ry) * 1.2, ...o }); }
function markerText(str, x, y, t, t0, o = {}) { const k = pop(t, t0, .3); if (k <= 0) return ''; return G(tr(x, y, k, o.r ?? -6), ftext(0, 0, str, { size: o.size || 70, fill: o.col || SX.acc2, font: SX.marker, stroke: SX.ink, sw: (o.size || 70) * .12 })); }

// ---------- TEXTURES / LOOKS ----------
// grain animé (bruit fractal, nouvelle graine toutes les 2 frames)
function grain(T, o = .09) { const id = _sxid('gr'), sd = Math.floor(T * 15) % 97;
  return `<defs><filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="1" seed="${sd}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 ${o * 2.2} 0"/></filter></defs><rect width="${W}" height="${H}" filter="url(#${id})" style="mix-blend-mode:overlay"/>`; }
// trame de points (halftone) sur une zone
function halftone(x, y, w, h, col = 'rgba(0,0,0,.12)', size = 22, ang = 30) { const id = _sxid('ht');
  return `<defs><pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(${ang})"><circle cx="${size / 2}" cy="${size / 2}" r="${size * .28}" fill="${col}"/></pattern></defs><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="url(#${id})"/>`; }
// trame en dégradé (points qui grossissent vers un bord) — look BD/print
function halftoneFade(col = SX.ink, o = .18, fromBottom = 1) { let s = ''; const sz = 34; for (let y = 0; y < H + 200; y += sz) { const k = fromBottom ? y / H : 1 - y / H; const r = sz * .5 * Math.pow(clamp(k), 2); if (r < 1.5) continue; for (let x = ((y / sz) % 2) * sz / 2 - 200; x < W + 200; x += sz) s += `<circle cx="${f1(x)}" cy="${f1(y - 100)}" r="${f1(r)}"/>`; } return `<g fill="${col}" opacity="${o}">${s}</g>`; }
// fond papier (couleur + fibres + légère vignette chaude)
function paper(col = SX.paper, M_ = 700) { const id = _sxid('pp');
  return rect(-M_, -M_, W + 2 * M_, H + 2 * M_, col, 0, 0) + `<defs><filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency=".012 .4" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .3  0 0 0 0 .2  0 0 0 .18 0"/></filter></defs><rect x="${-M_}" y="${-M_}" width="${W + 2 * M_}" height="${H + 2 * M_}" filter="url(#${id})"/>`; }
// fond graphique uni + grille fine (look « motion »)
function gridBg(col = SX.ink, line_ = 'rgba(255,255,255,.06)', step = 90, M_ = 700) { let s = rect(-M_, -M_, W + 2 * M_, H + 2 * M_, col, 0, 0); for (let x = -M_; x < W + M_; x += step) s += line(x, -M_, x, H + M_, 2, line_); for (let y = -M_; y < H + M_; y += step) s += line(-M_, y, W + M_, y, 2, line_); return s; }
// ombre de feuillage (gobo) qui bouge doucement
function gobo(T, o = .16) { let s = ''; const r = rng(11); for (let i = 0; i < 9; i++) { const x = r() * W, y = r() * H * .8, a = r() * 180 + Math.sin(T * .7 + i) * 6; s += G(tr(x + Math.sin(T * .5 + i) * 18, y, 1.4 + r(), a), path('M0 0Q60 -90 0 -200Q-60 -90 0 0Z', '#000', 0) + path('M0 0Q90 -40 180 -40Q90 10 0 0Z', '#000', 0)); } return op(o, blurPx(16, s)); }
// fuite de lumière (light leak) chaude
function lightLeak(T, o = .35, col = '#ff9a3c') { const x = W * (.2 + .6 * (.5 + .5 * Math.sin(T * .6))); return op(o, blurPx(90, ell(x, -100, 520, 380, col, 0) + ell(W - x * .5, H * .35, 300, 500, '#ff4f6d', 0))); }
// fenêtre en papier déchiré qui révèle un contenu
function tornWindow(x, y, w, h, inner, k, seed = 5) { if (k <= 0) return ''; const r = rng(seed), ww = w * eOutBack(k), hh = h * eOutBack(k); let d = '';
  const pts = []; const n = 14; for (let i = 0; i < n; i++) pts.push([-ww / 2 + ww * i / n, -hh / 2 + (r() - .5) * 26]); for (let i = 0; i < n; i++) pts.push([ww / 2 + (r() - .5) * 26, -hh / 2 + hh * i / n]);
  for (let i = 0; i < n; i++) pts.push([ww / 2 - ww * i / n, hh / 2 + (r() - .5) * 26]); for (let i = 0; i < n; i++) pts.push([-ww / 2 + (r() - .5) * 26, hh / 2 - hh * i / n]);
  d = 'M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L') + 'Z'; const id = _sxid('tw');
  return G(tr(x, y), `<path d="${d}" fill="#fff" transform="translate(10 12)" opacity=".9"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><g transform="translate(${-x} ${-y})">${inner}</g></g><path d="${d}" fill="none" stroke="#fff" stroke-width="10"/>`); }

// ---------- EFFETS ----------
// glitch : tranches horizontales décalées + séparation RGB (amt 0..1)
function glitch(svg, T, amt = 1, seed = 1) { if (amt <= 0) return svg; const r = rng(seed + Math.floor(T * 24)); let s = '';
  s += op(.55 * amt, G(`translate(${f1(-14 * amt)} 0)`, `<g style="mix-blend-mode:screen" filter="url(#sxR)">${svg}</g>`)) + svg + op(.55 * amt, G(`translate(${f1(14 * amt)} 0)`, `<g style="mix-blend-mode:screen" filter="url(#sxC)">${svg}</g>`));
  const defs = `<defs><filter id="sxR"><feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter><filter id="sxC"><feColorMatrix values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"/></filter></defs>`;
  let sl = ''; for (let i = 0; i < 6; i++) { const y = r() * H, h = 20 + r() * 120, dx = (r() - .5) * 160 * amt, id = _sxid('gs'); sl += `<defs><clipPath id="${id}"><rect x="-200" y="${f1(y)}" width="${W + 400}" height="${f1(h)}"/></clipPath></defs><g clip-path="url(#${id})"><g transform="translate(${f1(dx)} 0)">${svg}</g></g>`; }
  return defs + s + sl; }
// tunnel de traînées lumineuses (hyperespace)
function tunnel(cx, cy, T, cols = [SX.acc, '#b05cff', '#ff4fa0'], n = 70) { let s = ''; const r = rng(17); for (let i = 0; i < n; i++) { const a = r() * 6.28, sp = .6 + r(), k = (T * sp * .8 + r()) % 1, r1 = 60 + k * k * 1300, r2 = r1 + 40 + k * 500;
  s += line(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, 3 + k * 10, cols[i % cols.length]); } return rect(-200, -200, W + 400, H + 400, '#07050c', 0, 0) + op(.9, s) + glow(cx, cy, 300, '#fff', .5); }
// film noir et blanc (grain fort, scintillement, rayures, vignette)
function filmBW(svg, T) { const fl = .85 + .15 * Math.sin(T * 47) * Math.sin(T * 13); const r = rng(Math.floor(T * 24));
  let sc = ''; for (let i = 0; i < 3; i++) if (r() > .4) { const x = r() * W; sc += line(x, 0, x + (r() - .5) * 20, H, 2, 'rgba(255,255,255,.35)'); }
  return `<defs><filter id="sxBW"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="1.25" intercept="-.1"/><feFuncG type="linear" slope="1.25" intercept="-.1"/><feFuncB type="linear" slope="1.25" intercept="-.1"/></feComponentTransfer></filter></defs><g filter="url(#sxBW)" opacity="${f1(fl)}">${svg}</g>` + sc + grain(T, .22); }
// écho directionnel (traînée colorée = flou de mouvement stylisé)
function echo(svgFn, n, dx, dy, col) { let s = ''; for (let i = n; i >= 1; i--) s += op(.18 * (n + 1 - i) / n, G(`translate(${f1(dx * i)} ${f1(dy * i)})`, col ? `<g filter="url(#sxTint)">${svgFn(i)}</g>` : svgFn(i))); return (col ? `<defs><filter id="sxTint"><feFlood flood-color="${col}"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs>` : '') + s + svgFn(0); }
// barre de progression / jauge
function bar(x, y, w, k, o = {}) { return G(tr(x, y), rect(-w / 2, -18, w, 36, o.bg || 'rgba(255,255,255,.15)', 18, 0) + rect(-w / 2, -18, w * clamp(k), 36, o.col || SX.acc, 18, 0) + (o.label ? ftext(-w / 2, -40, o.label, { size: 40, font: SX.thin, weight: 200, anchor: 'start', fill: o.fg || '#fff' }) : '')); }
// découpe : silhouette blanche (pour poser un perso cartoon comme un « cut-out » sur fond graphique)
function cutout(svg, o = 12) { const id = _sxid('co'); return `<defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="${o}" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="w"/><feOffset in="w" dx="8" dy="12" result="sh"/><feFlood flood-color="rgba(0,0,0,.3)"/><feComposite in2="sh" operator="in" result="shc"/><feMerge><feMergeNode in="shc"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#${id})">${svg}</g>`; }

// ---------- FORMES FUN (SIZEX fun : rebondies, contour cartoon, jamais sérieuses) ----------
// explosion de BD à pointes (« POW »), pop + rotation lente
function burst(x, y, r, t, t0, col = SX.acc2, n = 14, o = {}) { const k = popEl(t, t0, .5); if (k <= 0) return ''; let d = '';
  for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * 6.283, rr = i % 2 ? r * .62 : r * (1 + .08 * Math.sin(i * 2.3)); d += (i ? 'L' : 'M') + f1(Math.cos(a) * rr) + ' ' + f1(Math.sin(a) * rr); }
  return G(tr(x, y, k * (1 + .03 * Math.sin(t * 9)), (o.r || 0) + t * 12), path(d + 'Z', col, 8) + (o.inner ? path(d + 'Z', 'none', 5, 'rgba(255,255,255,.5)').replace('<path', `<path transform="scale(.8)"`) : '')); }
// blob mou qui ondule (fond de mot, tache de couleur)
function blob(x, y, r, t, col = SX.acc, seed = 1, o = {}) { const k = o.t0 != null ? popEl(t, o.t0, .5) : 1; if (k <= 0) return ''; let d = ''; const n = 10;
  const P = i => { const a = i / n * 6.283, rr = r * (1 + .12 * Math.sin(t * 2.5 + i * 1.7 + seed)); return [Math.cos(a) * rr * (o.sx || 1), Math.sin(a) * rr]; };
  for (let i = 0; i < n; i++) { const [x1, y1] = P(i), [x2, y2] = P(i + 1); d += (i ? '' : `M${f1((x1 + x2) / 2)} ${f1((y1 + y2) / 2)}`) + `Q${f1(x2)} ${f1(y2)} ${f1((x2 + P(i + 2)[0]) / 2)} ${f1((y2 + P(i + 2)[1]) / 2)}`; }
  return G(tr(x, y, k, o.r || 0), path(d + 'Z', col, o.sw ?? 8)); }
// tortillon / ressort décoratif
function squiggle(x, y, w, t, col = SX.acc2, o = {}) { let d = `M${-w / 2} 0`; for (let i = 0; i < 8; i++) d += `q${w / 16} ${(i % 2 ? 1 : -1) * 40} ${w / 8} 0`; const k = seg(t, o.t0 || 0, (o.t0 || 0) + .35);
  return k <= 0 ? '' : G(tr(x, y, 1, o.r || 0), `<path d="${d}" fill="none" stroke="${OL}" stroke-width="26" stroke-linecap="round" stroke-dasharray="${f1(w * 2.2 * k)} ${f1(w * 3)}"/><path d="${d}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${f1(w * 2.2 * k)} ${f1(w * 3)}"/>`); }
// petites étoiles/croix qui pétillent autour d'un point
function popStars(x, y, t, t0, n = 6, rr = 200, cols = [SX.acc2, '#fff', SX.acc]) { const k = seg(t, t0, t0 + .6); if (k <= 0 || k >= 1) return ''; let s = '';
  for (let i = 0; i < n; i++) { const a = i / n * 6.283 + .3; s += sparkle(x + Math.cos(a) * rr * eOutCubic(k), y + Math.sin(a) * rr * eOutCubic(k), .7 * (1 - k) + .2, cols[i % cols.length], k * 90); } return s; }
// étiquette molle (bulle arrondie, contour épais, légère rotation) — remplace tag/pill en mode fun
function funTag(x, y, str, t, t0, o = {}) { const k = popEl(t, t0, .5); if (k <= 0) return ''; const sz = o.size || 60, w = str.length * sz * .62 + sz * 1.2, h = sz * 1.6;
  return G(tr(x, y, k, (o.r ?? -4) + Math.sin(t * 3) * 1.5), rect(-w / 2 + 10, -h / 2 + 12, w, h, OL, h / 2, 0) + rect(-w / 2, -h / 2, w, h, o.bg || SX.acc2, h / 2, 7) + ell(-w / 2 + h * .5, -h * .22, h * .22, h * .1, 'rgba(255,255,255,.55)', 0) + ftext(0, sz * .36, str, { size: sz, fill: o.fg || '#fff' })); }
// cadre « fun » : rectangle tremblé dessiné à la main + poignées rondes colorées + étiquette molle
function funBox(x, y, w, h, t, t0, o = {}) { const k = seg(t, t0, t0 + .3); if (k <= 0) return ''; const col = o.col || SX.acc, r = rng(o.seed || 3); let d = '';
  const pts = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2], [-w / 2, -h / 2]]; pts.forEach((p, i) => d += (i ? 'L' : 'M') + f1(p[0] + (r() - .5) * 14 + Math.sin(t * 6 + i) * 3) + ' ' + f1(p[1] + (r() - .5) * 14));
  const per = 2 * (w + h); let g = `<path d="${d}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" stroke-dasharray="26 16" stroke-dashoffset="${f1(-t * 80)}" opacity="${eOutCubic(k)}"/>`;
  if (k >= 1) [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b], i) => g += circ(a * w / 2, b * h / 2, 16 + 3 * Math.sin(t * 8 + i), [SX.acc2, '#fff', SX.cool, SX.acc][i], 6));
  if (o.label) g += funTag(-w / 2 + o.label.length * 14 + 30, -h / 2 - 46, o.label, t, t0 + .25, { size: 34, bg: col, r: -3 });
  return G(tr(x, y), g); }

// usage : unlock(x,y,t,t0,{part:'back'}) AVANT le perso (rayons) + unlock(x,y,t,t0,{part:'front'}) APRÈS (flash + étoiles)
// « DÉBLOQUÉ ! » : explosion d'étoiles (remplace les anneaux de l'intro) — grosse étoile qui pop, éclats d'étoiles en gerbe, rayons brillants
function unlock(x, y, t, t0, o = {}) { const k = seg(t, t0, t0 + 1.1); if (t < t0) return ''; const cols = o.cols || [SX.acc2, '#fff', SX.acc, SX.cool], r = o.r || 420; let s = '';
  const back = o.part !== 'front', front = o.part !== 'back';
  const fl = 1 - seg(t, t0, t0 + .25); if (fl > 0 && front) s += op(fl * .8, circ(x, y, r * .9 * eOutCubic(seg(t, t0, t0 + .25)), '#fff', 0));
  if (back) for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + t * .4, L = r * (.8 + .4 * (i % 2)); s += op(.35 * (1 - seg(t, t0 + .2, t0 + 1.4)), path(`M${f1(x)} ${f1(y)}L${f1(x + Math.cos(a - .05) * L)} ${f1(y + Math.sin(a - .05) * L)}L${f1(x + Math.cos(a + .05) * L)} ${f1(y + Math.sin(a + .05) * L)}Z`, cols[i % 2 ? 0 : 1], 0)); }
  const n = o.n || 14; for (let i = 0; i < n; i++) { const a = i / n * 6.283 + (i % 3) * .2, dist = r * (.25 + (.75 + .55 * ((i * 37) % 10) / 10) * eOutCubic(k)), sz = (1.1 + .7 * (i % 3) / 2) * (1 - k * .45) * (o.ss || 1);
    if (k < 1 && front) s += G(tr(x + Math.cos(a) * dist, y + Math.sin(a) * dist * .85 + k * k * 120, sz, k * 360 * (i % 2 ? 1 : -1)), path('M0 -50L14 -16L50 -14L22 8L32 46L0 24L-32 46L-22 8L-50 -14L-14 -16Z', cols[i % cols.length], 6)); }
  if (o.big) { const kb = popEl(t, t0, .6); s += G(tr(x + (o.bx || 0), y + (o.by || 0), kb * (o.bs || 1.6) * (1 + .04 * Math.sin(t * 8)), Math.sin(t * 3) * 6), path('M0 -50L14 -16L50 -14L22 8L32 46L0 24L-32 46L-22 8L-50 -14L-14 -16Z', SX.acc2, 7) + ell(-12, -14, 10, 6, 'rgba(255,255,255,.7)', 0)); }
  return s; }
