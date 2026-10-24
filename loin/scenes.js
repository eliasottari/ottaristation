// ============================================================
//  « Pourquoi c'est horrible d'habiter loin de tous ses potes ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Héros fixe : cheveux bouclés bruns, t-shirt orange, SAC À DOS bleu (il est toujours en transit). Kevin = le pote de la ville.
//  Les CAPITALES du script = moments criés → kword slam + flash.
// ============================================================
const SCENES = [];
function B(n, o, off = 0) { o.s = +(BT[n - 1] + off).toFixed(3); o.n = n; SCENES.push(o); return o; }
const _norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
// at(n, 'mot', k) : temps (relatif au début du bloc n) du k-ième mot qui commence par 'mot'
function at(n, word, k = 1) {
  const a = BT[n - 1] - .3, b = BT[n] + .3, q = _norm(word);
  for (const [s, e, w] of WORDS) if (s >= a && s <= b && _norm(w).startsWith(q) && --k === 0) return +(s - BT[n - 1]).toFixed(2);
  console.error('at(): mot introuvable', n, word); return 0;
}
const dur = n => +(BT[n] - BT[n - 1]).toFixed(2);
const CX = W / 2;

// ---------- SIZEX fun : accent BLEU SNCF (propre à l'épisode), jaune marqueur ----------
sxFun('#0d84d6'); SX.acc2 = '#ffd23f'; SX.cool = '#5ee0a0';
const LN = { sh: '#ff8a3d', pk: '#3d55b8', hair: '#3a2a20', skin: '#f0c39a', red: '#e2463a', grn: '#5fb85f' };

// ============================================================
//  HÉROS : bouclé brun, t-shirt orange, sac à dos bleu (bretelles jaunes) — il le garde TOUT l'épisode
// ============================================================
function lnPackB(o, t, c = LN.pk) { const b = (o.bob ?? 1) * wave(t, .8, 4, o.seed ?? 5); return G(ptr(o), G(tr(0, b), rect(-104, -222, 208, 160, c, 36, 7) + rect(-84, -128, 168, 50, shade(c, -.18), 16, 5) + path('M-40 -222Q0 -262 40 -222', 'none', 9))); }
function lnStraps(o, t) { const b = (o.bob ?? 1) * wave(t, .8, 4, o.seed ?? 5); return G(ptr(o), G(tr(0, b), path('M-40 -210L-50 -116', 'none', 18) + path('M-40 -210L-50 -116', 'none', 9, '#ffd23f') + path('M40 -210L50 -116', 'none', 18) + path('M40 -210L50 -116', 'none', 9, '#ffd23f'))); }
function lnHero(o, t) { o = Object.assign({ seed: 5 }, o);
  return (o.pack === false ? '' : lnPackB(o, t)) + person(Object.assign({ age: 'kid', hair: 'curly', hairColor: LN.hair, shirt: LN.sh, pants: '#3b4a6b', skin: LN.skin }, o), t) + (o.pack === false ? '' : lnStraps(o, t)); }
const lnHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hair: 'curly', hairColor: LN.hair, skin: LN.skin, seed: 5 }, o), t));
// éclair blanc au milieu d'un plan
const lnFlash = (t, t0, k = .8) => t < t0 || t > t0 + .25 ? '' : op(k * (1 - seg(t, t0, t0 + .25)), rect(-M, -M, W + 2 * M, H + 2 * M, '#fff', 0, 0));
// les potes de la ville (Kevin + 2)
const lnPal1 = (o, t) => kid(1, Object.assign({}, o), t);
const lnPal2 = (o, t) => kid(4, Object.assign({ hair: 'ponytail', hairColor: '#e0a040', shirt: '#ff8fb1' }, o), t);
// chapeau de fête (au-dessus d'une tête de rayon r)
const lnHat = (x, y, r, c = '#ff5c8a', tilt = 0) => G(tr(x, y - r * .82, r / 100, tilt), path('M-46 0L0 -120L46 0Z', c, 6) + circ(0, -124, 14, '#ffd23f', 4) + path('M-30 -30L30 -50M-20 -70L20 -86', 'none', 6, '#fff'));

// ============================================================
//  ACCESSOIRES CAMPAGNE
// ============================================================
function lnCow(x, yb, s = 1, t = 0, o = {}) { const ch = Math.sin(t * 7 + x) * 3, tl = Math.sin(t * 3 + x) * 16;
  let g = path(`M-112 -130Q${-150} ${-100 + tl} ${-142 + tl * .3} -60`, 'none', 7) + circ(-142 + tl * .3, -56, 9, OL, 0);
  g += [-80, -42, 48, 86].map(lx => rect(lx - 12, -82, 24, 82, '#fff', 6, 6) + rect(lx - 13, -16, 26, 16, OL, 4, 0)).join('');
  g += ell(0, -118, 122, 62, '#fff', 7) + ell(-46, -134, 32, 22, OL, 0) + ell(34, -100, 24, 16, OL, 0) + ell(70, -146, 18, 12, OL, 0) + ell(-6, -62, 22, 11, '#ffb3c0', 4);
  const hd = ell(-50, -20, 24, 10, '#fff', 5) + ell(50, -20, 24, 10, '#fff', 5) + path('M-26 -44Q-44 -76 -22 -72', 'none', 9, '#f4e6c8') + path('M26 -44Q44 -76 22 -72', 'none', 9, '#f4e6c8') +
    ell(0, 0, 48, 54, '#fff', 7) + ell(-18, -24, 16, 13, OL, 0) + ell(0, 32 + ch * .3, 40, 26, '#ffb3c0', 6) + circ(-12, 30 + ch * .3, 5, OL, 0) + circ(12, 30 + ch * .3, 5, OL, 0) +
    circ(-18, -4, 8, OL, 0) + circ(18, -4, 8, OL, 0) + circ(-15, -7, 2.5, '#fff', 0) + circ(21, -7, 2.5, '#fff', 0) + (o.lick ? path(`M10 50Q${30 + ch * 3} 90 4 96`, '#ff8fa8', 5) : '');
  g += G(tr(128, -152, 1, o.tilt || 0), hd);
  return G(`translate(${f1(x)} ${f1(yb)}) scale(${o.flip ? -s : s} ${s})`, g); }
// éolienne (pales qui tournent)
const lnWind = (x, yb, s, t) => G(tr(x, yb, s), path('M-10 0L-5 -420L5 -420L10 0Z', '#f4f6f8', 5) + G(tr(0, -420, 1, t * 70), [0, 120, 240].map(a => G(tr(0, 0, 1, a), path('M-8 0Q-14 -110 0 -200Q14 -110 8 0Z', '#fff', 5))).join('') + circ(0, 0, 12, '#dfe5ea', 5)));
const lnBarn = (x, yb, s = 1) => G(tr(x, yb, s), rect(-150, -190, 300, 190, '#c8423a', 4, 7) + path('M-170 -186L0 -300L170 -186Z', '#8a2b26', 7) + rect(-60, -130, 120, 130, '#fff', 4, 6) + path('M-54 -124L54 -6M54 -124L-54 -6', 'none', 6, '#c8423a') + rect(-30, -250, 60, 50, '#fff', 4, 5));
const lnSilo = (x, yb, s = 1) => G(tr(x, yb, s), rect(-50, -300, 100, 300, '#c9d3dc', 8, 6) + path('M-50 -300Q0 -360 50 -300Z', '#9aa3ad', 6) + [1, 2, 3].map(i => line(-50, -300 + i * 75, 50, -300 + i * 75, 4, '#9aa3ad')).join(''));
const lnHay = (x, yb, s = 1) => G(tr(x, yb, s), ell(0, -50, 70, 50, '#e8c25a', 6) + path('M-20 -50Q-20 -70 0 -70Q22 -70 22 -48Q22 -28 0 -28Q-16 -28 -16 -46', 'none', 5, '#c49a3a'));
const lnTumble = (x, y, t, s = 1) => G(tr(x, y, s, t * 300), circ(0, 0, 54, 'none', 7, '#b8854f') + path('M-40 -24Q0 22 40 -24M-34 34Q0 -10 34 34M-54 6L54 -4M-6 -50L4 50', 'none', 6, '#b8854f'));
const lnCrow = (x, y, s, t, ph = 0) => G(tr(x, y, s), ell(0, 0, 34, 22, '#2b2b33', 5) + circ(30, -18, 16, '#2b2b33', 5) + path('M44 -20L66 -14L44 -10Z', '#ffd23f', 3) + circ(34, -22, 3, '#fff', 0) + path(`M-10 -6Q-30 ${-40 + Math.sin(t * 12 + ph) * 16} -50 -20`, '#2b2b33', 5));
const lnHouse = (x, yb, s = 1, lit = 0) => G(tr(x, yb, s), rect(-130, -170, 260, 170, '#f0dcb8', 4, 7) + path('M-160 -166L0 -280L160 -166Z', '#a8423a', 7) + rect(-100, -130, 70, 60, lit ? '#ffe08a' : '#9fd6ff', 4, 5) + rect(30, -130, 70, 60, lit ? '#ffe08a' : '#9fd6ff', 4, 5) + rect(-24, -80, 48, 80, '#8a5a3a', 4, 5) + rect(60, -300, 36, 70, '#8a5a3a', 4, 5));
// panneau d'entrée d'agglo (blanc, bord rouge)
const lnPanneau = (x, y, s, l1, l2, size = 40) => G(tr(x, y, s), line(-150, 80, -150, 460, 14, '#9aa3ad') + line(150, 80, 150, 460, 14, '#9aa3ad') + rect(-260, -90, 520, 180, '#fff', 14, 7) + rect(-246, -76, 492, 152, 'none', 10, 10, LN.red) + ftext(0, -10, l1, { size, fill: OL, stroke: 'none' }) + ftext(0, size + 6, l2, { size, fill: OL, stroke: 'none' }));
// arrêt de bus au milieu de nulle part
const lnStop = (x, yb, s, t, str = 'DEMAIN') => G(tr(x, yb, s), rect(-10, -440, 20, 440, '#9aa3ad', 6, 5) + circ(0, -470, 56, '#ffd23f', 7) + ftext(0, -456, 'BUS', { size: 34, fill: OL, stroke: 'none' }) +
  G(tr(0, -300, 1, Math.sin(t * 2) * 3), rect(-90, -60, 180, 120, '#fff', 10, 6) + ftext(0, -22, 'PROCHAIN :', { size: 22, fill: OL, stroke: 'none' }) + ftext(0, 28, str, { size: 36, fill: LN.red, stroke: 'none' })));

// vue par la fenêtre : champs, vaches, RIEN à l'horizon (o.eve = soir, o.night = nuit)
function lnFields(x, y, w, h, t, o = {}) { const e = o.eve, n = o.night, sc = h / 470;
  let s = grad(n ? '#141a44' : e ? '#ff9466' : '#8fd0ff', n ? '#39407e' : e ? '#ffe2a6' : '#e9f7ff', x, y, w, h);
  s += n ? circ(x + w * .74, y + h * .22, 30 * sc, '#fff6d6', 0) + [0, 1, 2, 3, 4, 5].map(i => circ(x + ((i * 137) % w), y + 20 + (i * 53) % (h * .4), 3, '#fff', 0)).join('') : circ(x + w * .74, y + h * (e ? .48 : .2), 36 * sc, e ? '#ffd27a' : '#fff3b0', 0) + op(.35, circ(x + w * .74, y + h * (e ? .48 : .2), 64 * sc, '#fff3b0', 0));
  if (!n) s += cloud(x + ((t * 22) % (w + 260)) - 130, y + h * .16, .5 * sc, '#fff') + dBird(x + ((t * 70) % (w + 120)) - 60, y + h * .3, .5 * sc, t);
  const hl = n ? '#2c3a4a' : '#a8d68f', fl = n ? '#24323a' : '#b7dc7a', yl = n ? '#2e3a3a' : '#f2d36b';
  s += path(`M${x} ${y + h * .6}Q${x + w * .3} ${y + h * .5} ${x + w * .55} ${y + h * .58}T${x + w} ${y + h * .55}L${x + w} ${y + h}L${x} ${y + h}Z`, hl, 0);
  s += rect(x, y + h * .64, w, h * .36, fl, 0, 0) + path(`M${x} ${y + h * .7}L${x + w * .55} ${y + h * .66}L${x + w * .7} ${y + h * .78}L${x} ${y + h * .86}Z`, yl, 0);
  s += tree(x + w * .2, y + h * .62, .16 * sc, t) + G(tr(x + w * .88, y + h * .64, .5 * sc), path('M-30 0L0 -180L30 0M-40 -120L40 -120M-24 -60L24 -60', 'none', 5, n ? '#556' : '#7d848c'));
  s += [0, 1, 2, 3, 4, 5, 6, 7].map(i => rect(x + i * w / 7 - 4, y + h * .86, 8, 40 * sc, '#c8955a', 2, 3)).join('') + rect(x, y + h * .88, w, 6, '#c8955a', 0, 0);
  s += lnCow(x + w * .36, y + h * .82, .3 * sc, t) + lnCow(x + w * .72, y + h * .97, .44 * sc, t + 1, { flip: 1, lick: o.lick });
  if (n) s += op(.35, rect(x, y, w, h, '#0c1030', 0, 0));
  return clipR(x, y, w, h, s, 8); }
function lnWindow(x, y, w, h, t, o = {}) { return rect(x - 18, y - 18, w + 36, h + 36, '#fff', 12, 7) + lnFields(x, y, w, h, t, o) +
  line(x + w / 2, y, x + w / 2, y + h, 16) + line(x + w / 2, y, x + w / 2, y + h, 8, '#fff') + line(x, y + h * .42, x + w, y + h * .42, 16) + line(x, y + h * .42, x + w, y + h * .42, 8, '#fff') +
  rect(x, y, w, h, 'none', 8, 7) + rect(x - 34, y + h + 10, w + 68, 24, '#f4f1ea', 6, 6); }
const lnBed = (x, yb, s = 1, c = '#8fc1ff') => G(tr(x, yb, s), rect(-270, -300, 40, 300, '#a0683c', 12, 6) + rect(-250, -120, 520, 80, '#c58e55', 10, 6) + rect(-240, -190, 500, 80, '#fff', 26, 6) +
  path('M-150 -196L260 -196L260 -110L-150 -110Z', c, 6) + path('M-50 -196L-50 -110M50 -196L50 -110M150 -196L150 -110', 'none', 4, shade(c, -.2)) + ell(-190, -200, 64, 32, '#fff', 6) + rect(-240, -40, 30, 40, '#8a5a3a', 4, 5) + rect(230, -40, 30, 40, '#8a5a3a', 4, 5));

// ---------- CHAMBRE À LA CAMPAGNE (fenêtre = champs / vaches / rien) ----------
function lnRoom(t, o = {}) { const yb = 1250, n = o.night, e = o.eve;
  let s = dWall('stripe', '#f6e6c6', '#efd9b0', yb) + rect(-M, -M, W + 2 * M, 110 + M, '#a0683c', 0, 0) + rect(-M, 100, W + 2 * M, 34, '#8a5a3a', 0, 6);
  s += lnWindow(560, 300, 400, 440, t, { eve: e, night: n, lick: o.lick }) + dCurtain(490, 280, 110, 520, '#e86a8a', t, 1) + dCurtain(920, 280, 110, 520, '#e86a8a', t, -1);
  const city = [0, 1, 2, 3, 4].map(i => rect(-80 + i * 34, 10 - (i * 37 % 60) - 30, 30, 60 + (i * 37 % 60), '#ffd23f', 2, 3)).join('') + ftext(0, 96, 'LA VILLE', { size: 28, fill: '#fff', stroke: 'none' }) + heart(0, -84, .5);
  s += dPoster(180, 400, 200, 250, '#2f3a5a', -4, city, t) + wallClock(400, 220, 46, t, 1) + dFrame(400, 430, 110, 90, 'mount', '#c38a52', 3);
  s += G(tr(420, 620, 1, 5), rect(-56, -74, 112, 148, '#fff', 4, 5) + ftext(0, -36, 'HORAIRES', { size: 18, fill: OL, stroke: 'none' }) + [0, 1, 2, 3].map(i => line(-40, -10 + i * 22, 40, -10 + i * 22, 3, '#9aa3ad')).join('') + circ(0, -74, 8, LN.red, 3));
  s += dShelf(40, 760, 300, dBooks(56, 760, 170, 3) + dTrophy(270, 760, .6)) + dSwitch(1030, 860) + dOutlet(480, 1180);
  s += lnBed(330, 1250, .85) + dParquet(yb, '#c49a6c') + dRug(700, 1500, 640, 150, '#7fc8a0', '#ffd23f') + dLamp(1010, 1290, 1, n ? 1 : 0, t) + dPot(70, 1300, 1, t, 0) + dShoes(820, 1680, .7) + dBox(150, 1800, .8, 'BD');
  if (n) s += op(.42, rect(-M, -M, W + 2 * M, H + 2 * M, '#101640', 0, 0)); else if (e) s += op(.12, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff9a4d', 0, 0));
  return s; }

// ---------- CAMPAGNE (route, champs, éolienne, ferme, vaches) ----------
function lnCountry(t, o = {}) { const e = o.eve;
  let s = e ? grad('#ff8a5c', '#ffd9a0', -M, -M, W + 2 * M, 1900) + circ(800, 820, 90, '#ffd27a', 0) + op(.3, circ(800, 820, 160, '#fff3b0', 0)) + cloud(((t * 20) % 1600) - 300, 300, 1.2, '#ffc9a8') : SKY(t);
  s += path('M-700 900Q200 760 600 880T1780 860L1780 1300L-700 1300Z', e ? '#9ac07c' : '#a8d68f', 0) + path('M-700 980Q300 900 700 960T1780 950L1780 1300L-700 1300Z', e ? '#8ab86e' : '#93c97c', 0);
  s += lnWind(880, 900, .55, t) + lnWind(1010, 920, .4, t + .3) + lnBarn(160, 990, .7) + lnSilo(310, 990, .6) + tree(620, 990, .45, t);
  s += rect(-M, 990, W + 2 * M, 300, e ? '#a9c96a' : '#b7dc7a', 0, 0) + path('M-200 1010L700 1000L900 1100L-200 1180Z', e ? '#e6c25a' : '#f2d36b', 0) + lnHay(820, 1060, .7) + lnHay(960, 1080, .55);
  s += dFence(-200, 1300, 1120, '#fff') + lnCow(150, 1180, .55, t) + lnCow(930, 1200, .6, t + 1, { flip: 1 });
  s += path('M440 990L640 990L1180 1950L-100 1950Z', '#8f959d', 7) + [0, 1, 2, 3, 4].map(i => { const k = i / 5, y = 1010 + k * k * 900; return rect(535 - 4 - k * 16, y, 8 + k * 32, 30 + k * 80, '#fff', 3, 0); }).join('');
  s += rect(-M, 1250, 560, 900, '#7cb85a', 0, 0) + rect(1060, 1250, 900, 900, '#7cb85a', 0, 0) + dFlowers(30, 1320, 5, 3, t) + dFlowers(900, 1330, 4, 6, t) + dBush(1040, 1420, 1.1);
  s += lnCrow(((t * 90) % 1500) - 200, 380 + Math.sin(t * 2) * 20, .6, t);
  if (e) s += op(.1, rect(-M, -M, W + 2 * M, H + 2 * M, '#ff7a4a', 0, 0));
  return s; }

// ---------- GARE de campagne ----------
function lnGare(t, o = {}) { const yb = 1180, n = o.night;
  let s = n ? grad('#141a44', '#3a3f80', -M, -M, W + 2 * M, 1900) + circ(860, 220, 50, '#fff6d6', 0) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => circ((i * 137) % W, 80 + (i * 71) % 400, 3, '#fff', 0)).join('') : grad('#ff9466', '#ffe2a6', -M, -M, W + 2 * M, 1900);
  s += path('M-700 960Q300 880 700 940T1780 930L1780 1300L-700 1300Z', n ? '#25304a' : '#a8d68f', 0) + lnCow(1000, 1060, .32, t, { flip: 1 }) + dFence(500, 1300, 1080, n ? '#7d848c' : '#fff');
  s += rect(30, 560, 440, 620, '#f0dcb8', 4, 7) + path('M0 566L250 430L500 566Z', '#a8423a', 7) + rect(80, 760, 120, 150, n ? '#ffe08a' : '#9fd6ff', 6, 6) + rect(300, 760, 120, 150, n ? '#ffe08a' : '#9fd6ff', 6, 6) + rect(190, 960, 120, 220, '#5a4a3a', 6, 6);
  s += G(tr(250, 640), rect(-210, -42, 420, 84, '#fff', 10, 6) + ftext(0, 14, 'ST-PAUMÉ-LES-CHAMPS', { size: 30, fill: LN.pk, stroke: 'none' }));
  s += G(tr(110, 1000, 1, -3), rect(-50, -70, 100, 140, LN.red, 6, 5) + ftext(0, -20, 'TER', { size: 30, fill: '#fff', stroke: 'none' }) + ftext(0, 30, '2/JOUR', { size: 20, fill: '#fff', stroke: 'none' }));
  const hh = o.hh ?? 19, mm = (o.mm ?? 30) + t * .4;
  s += line(600, yb, 600, 520, 14, '#5a626e') + circ(600, 470, 64, '#fff', 8) + line(600, 470, 600 + Math.sin(R(mm * 6)) * 48, 470 - Math.cos(R(mm * 6)) * 48, 6) + line(600, 470, 600 + Math.sin(R(hh * 30 + mm * .5)) * 30, 470 - Math.cos(R(hh * 30 + mm * .5)) * 30, 9) + circ(600, 470, 6, OL, 0);
  const blink = Math.sin(t * 6) > 0;
  s += line(760, yb, 760, 720, 10, '#5a626e') + line(940, yb, 940, 720, 10, '#5a626e') + G(tr(850, 640), rect(-170, -100, 340, 200, '#1d2026', 14, 7) + ftext(0, -56, 'DÉPARTS', { size: 26, fill: '#fff', stroke: 'none' }) +
    ftext(-150, -6, o.l1 || 'TER  19:42', { size: 30, fill: '#ffb23f', stroke: 'none', anchor: 'start' }) + ftext(-150, 44, o.l2 || 'BUS  DEMAIN', { size: 30, fill: blink ? '#ffb23f' : '#7a5a2a', stroke: 'none', anchor: 'start' }) + ftext(-150, 84, 'RETARD 20 MIN', { size: 18, fill: '#ff6b5a', stroke: 'none', anchor: 'start' }));
  s += rect(-M, yb, W + 2 * M, 110, '#b9bec6', 0, 0) + rect(-M, yb + 70, W + 2 * M, 14, '#ffd23f', 0, 0) + line(-M, yb, W + M, yb, 6, '#8f959d') + rect(-M, yb + 110, W + 2 * M, 20, '#6e747c', 0, 0);
  s += rect(-M, yb + 130, W + 2 * M, 900, '#7a726a', 0, 0) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => rect(-80 + i * 110, 1380, 60, 220, '#6b4a32', 4, 4)).join('') + line(-M, 1420, W + M, 1420, 14, '#c9d3dc') + line(-M, 1560, W + M, 1560, 14, '#c9d3dc');
  s += dBench(700, yb, .8) + dLampPost(1020, yb, 1, n ? 1 : 0) + dBin(520, yb, .6, '#36a85a') + lnTumble(((t * 160) % 1500) - 200, yb - 50, t, .7);
  if (n) s += op(.3, rect(-M, -M, W + 2 * M, H + 2 * M, '#0c1030', 0, 0));
  return s; }

// ---------- TRAIN (intérieur, paysage qui défile) ----------
function lnTrainView(x, y, w, h, t, o = {}) { const n = o.night, sp = o.speed ?? 650;
  let s = grad(n ? '#141a44' : '#9fd6ff', n ? '#39407e' : '#e9f7ff', x, y, w, h) + (n ? circ(x + w * .7, y + 70, 26, '#fff6d6', 0) : cloud(x + w * .5, y + 80, .5, '#fff'));
  s += path(`M${x} ${y + h * .6}Q${x + w * .4} ${y + h * .48} ${x + w} ${y + h * .58}L${x + w} ${y + h}L${x} ${y + h}Z`, n ? '#2c3a4a' : '#a8d68f', 0) + rect(x, y + h * .7, w, h * .3, n ? '#24323a' : '#b7dc7a', 0, 0);
  for (let i = 0; i < 6; i++) { const px = ((i * 300 - t * sp * .5) % 1800 + 1800) % 1800 - 300; s += i % 3 === 1 ? lnCow(px, y + h * .9, .3, t + i, { flip: 1 }) : tree(px, y + h * .82, .25, t); }
  for (let i = 0; i < 8; i++) { const px = ((i * 220 - t * sp * 1.6) % 1760 + 1760) % 1760 - 300; s += rect(px, y + h * .3, 14, h * .7, n ? '#555a66' : '#7d848c', 3, 0); }
  if (n) s += op(.35, rect(x, y, w, h, '#0c1030', 0, 0));
  return clipR(x, y, w, h, s, 30); }
function lnTrain(t, o = {}) { const yb = 1250, n = o.night;
  let s = rect(-M, -M, W + 2 * M, yb + M, n ? '#c9ced8' : '#e9edf2', 0, 0) + rect(-M, -M, W + 2 * M, 200 + M, n ? '#b5bcc8' : '#d5dce4', 0, 0);
  const scroll = (t * 60) % 900;
  s += G(tr(540, 140), rect(-230, -40, 460, 80, '#1d2026', 14, 6) + clipR(-214, -30, 428, 60, ftext(200 - scroll, 14, 'PROCHAIN ARRÊT : ST-PAUMÉ-LES-CHAMPS · TERMINUS', { size: 30, fill: '#ffb23f', stroke: 'none', anchor: 'start' }), 6));
  s += rect(-M, 250, W + 2 * M, 18, '#9aa3ad', 6, 5) + dBag(150, 250, .55, LN.red) + dBag(860, 250, .6, '#36a85a') + dBox(560, 250, .5);
  for (const [wx, ww] of [[40, 440], [600, 440]]) s += rect(wx - 20, 320, ww + 40, 460, n ? '#9aa3ad' : '#c9d3dc', 40, 7) + lnTrainView(wx, 340, ww, 420, t, o) + rect(wx, 340, ww, 420, 'none', 30, 6) + op(.2, path(`M${wx + 30} 360L${wx + 140} 360L${wx + 40} 700Z`, '#fff', 0));
  s += rect(-M, 800, W + 2 * M, 30, n ? '#8a92a0' : '#b9c4ce', 0, 5) + G(tr(1000, 880), rect(-40, -26, 80, 52, LN.red, 8, 4) + ftext(0, 10, 'SOS', { size: 24, fill: '#fff', stroke: 'none' }));
  s += rect(-M, yb, W + 2 * M, 1400, '#5a626e', 0, 0) + rect(300, yb, 480, 1400, '#7a5aa8', 0, 0) + line(300, yb, 300, 1920, 5, '#4a3a6a') + line(780, yb, 780, 1920, 5, '#4a3a6a');
  if (n) s += op(.18, rect(-M, -M, W + 2 * M, H + 2 * M, '#101640', 0, 0));
  return s; }
const lnSeat = (x, yb, s = 1, c = '#3d6fb8') => G(tr(x, yb, s), rect(-130, -420, 260, 420, c, 40, 7) + rect(-100, -400, 200, 80, '#f4f6f8', 18, 5) + [0, 1, 2].map(i => line(-90, -270 + i * 70, 90, -270 + i * 70, 5, shade(c, -.2))).join(''));

// ---------- KEBAB (intérieur) ----------
const lnKebabSand = (x, y, s = 1, r = 0) => G(tr(x, y, s, r), path('M-70 -60Q0 -110 70 -60L20 90Q0 104 -20 90Z', '#f2d39a', 6) + path('M-56 -60Q-30 -86 0 -70Q30 -90 56 -60L40 -20L-40 -20Z', '#b5652a', 5) + circ(-30, -62, 12, LN.red, 4) + circ(20, -66, 12, '#5fb85f', 4) + path('M-40 -30Q0 -10 40 -30', 'none', 6, '#fff'));
const lnFries = (x, y, s = 1) => G(tr(x, y, s), [-24, -8, 8, 24].map((xx, i) => rect(xx - 7, -110 + (i % 2) * 14, 14, 80, '#ffd23f', 4, 4)).join('') + path('M-44 -60L44 -60L34 30L-34 30Z', LN.red, 6) + ftext(0, 0, 'M', { size: 34, fill: '#fff', stroke: 'none' }).replace('>M<', '>★<'));
function lnKebab(t, o = {}) { const yb = 1250;
  let s = rect(-M, -M, W + 2 * M, yb + M, '#f4f6f8', 0, 0); for (let y = 0; y < 940; y += 80) s += line(-M, y, W + M, y, 3, '#dfe5ea'); for (let x = -M; x < W + M; x += 80) s += line(x, 0, x, 940, 3, '#dfe5ea');
  s += rect(-M, 860, W + 2 * M, 30, SX.acc, 0, 0) + dNeon(540, 120, 'KEBAB', '#ff5c8a', t, 70);
  s += rect(50, 170, 980, 330, '#22252c', 18, 7);
  [['KEBAB', '7 €'], ['FRITES', '3 €'], ['TACOS', '8 €'], ['SODA', '2 €']].forEach(([a, b], i) => { const cx = 170 + i * 245;
    s += rect(cx - 105, 190, 210, 160, '#ffe9c4', 10, 4) + (i === 0 ? lnKebabSand(cx, 280, .7) : i === 1 ? lnFries(cx, 320, .9) : i === 2 ? G(tr(cx, 290), path('M-70 30Q0 -80 70 30Z', '#f2d39a', 5) + circ(-20, 0, 12, LN.red, 3) + circ(20, -4, 12, '#5fb85f', 3)) : G(tr(cx, 280), rect(-30, -50, 60, 100, LN.red, 12, 5) + ftext(0, 10, 'COLA', { size: 16, fill: '#fff', stroke: 'none' })));
    s += ftext(cx, 400, a, { size: 32, fill: '#fff', stroke: 'none' }) + ftext(cx, 460, b, { size: 40, fill: SX.acc2, stroke: 'none' }); });
  s += rect(740, 540, 220, 380, '#3a3f4a', 14, 6) + op(.5 + .1 * Math.sin(t * 9), rect(760, 560, 180, 340, '#ff7a3a', 10, 0));
  let cone = path('M800 580L900 580L880 900L820 900Z', '#b5652a', 6); for (let i = 0; i < 7; i++) { const yy = 600 + ((i * 46 + t * 60) % 300); cone += line(806 + (yy - 580) * .06, yy, 894 - (yy - 580) * .06, yy - 10, 5, '#8a4a20'); }
  s += cone + line(850, 540, 850, 940, 8, '#c9d3dc') + G(tr(1010, 640), rect(-70, -100, 140, 200, '#e8eef2', 10, 6) + [0, 1, 2].map(j => [0, 1, 2].map(i => rect(-54 + i * 38, -84 + j * 60, 28, 46, DPAL[(i + j * 3) % 8], 6, 3)).join('')).join(''));
  s += wallClock(80, 620, 44, t) + G(tr(560, 620), rect(-130, -60, 260, 120, '#fff', 12, 5) + ftext(0, -10, 'SAUCE', { size: 26, fill: LN.red, stroke: 'none' }) + ftext(0, 30, 'BLANCHE ✓', { size: 26, fill: OL, stroke: 'none' }));
  if (o.chef !== false) s += adult(0, { x: 560, y: 1200, s: .9, mustache: true, glasses: false, apron: '#fff', shirt: '#36a85a', expr: 'happy', armR: [-40, -60], armL: [200, 140] }, t);
  s += rect(-M, 940, W + 2 * M, 330, '#c9d3dc', 0, 7) + rect(-M, 920, W + 2 * M, 30, '#e8eef2', 0, 6) + rect(70, 970, 520, 130, 'rgba(200,235,255,.6)', 12, 5);
  s += [['#5fb85f', 140], [LN.red, 260], ['#fff', 380], ['#ffd23f', 500]].map(([c, x]) => ell(x, 1060, 50, 24, c, 5)).join('');
  s += [[650, LN.red], [690, '#ffd23f'], [730, '#fff']].map(([x, c]) => rect(x - 14, 860, 28, 64, c, 8, 4) + rect(x - 6, 846, 12, 16, OL, 3, 0)).join('') + dPot(1000, 920, .7, t, 1);
  s += dTileFloor(yb, '#e8e2d6', '#c9c2b4') + [200, 880].map(x => rect(x - 50, 1340, 100, 26, '#e2463a', 10, 5) + line(x, 1366, x, 1560, 10, '#9aa3ad')).join('');
  return s; }

// ---------- CINÉMA ----------
function lnCine(t, o = {}) { let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#2a1420', 0, 0); for (let x = -M; x < W + M; x += 70) s += rect(x, -M, 34, 1300 + M, 'rgba(255,255,255,.03)', 0, 0);
  const fin = o.fin, fl = .8 + .2 * Math.sin(t * 9) * Math.sin(t * 3.1);
  s += op((fin ? .1 : .2) * fl, path('M540 1900L-100 600L1180 600Z', '#bfe3ff', 0)) + rect(90, 150, 900, 450, '#141820', 14, 7);
  if (fin) { let cr = ''; const names = ['RÉALISATION', 'Jean Truc', 'MUSIQUE', 'Kevin Lol', 'MAQUILLAGE', 'Léa B.', 'CASCADES', 'Tom', 'MERCI À', 'TOUS', 'SAUF TOI']; names.forEach((nm, i) => { cr += ftext(540, 640 + i * 60 - t * 140, nm, { size: i % 2 ? 30 : 24, fill: i % 2 ? '#fff' : '#9aa3ad', stroke: 'none' }); });
    s += rect(110, 170, 860, 410, '#000', 6, 0) + clipR(110, 170, 860, 410, cr + ftext(540, 300, 'FIN', { size: 90, fill: '#fff', stroke: 'none' }), 6); }
  else s += rect(110, 170, 860, 410, mixC('#7fc8ff', '#ffe08a', .5 + .5 * Math.sin(t * 1.3)), 6, 0) + op(.6, path('M110 580L300 380L420 500L600 290L800 480L970 360L970 580Z', '#2f6fb0', 0)) + circ(800, 270, 50, '#fff6c8', 0) + G(tr(330 + Math.sin(t * 2) * 30, 470), ell(0, 0, 80, 50, '#7be07b', 5) + circ(70, -40, 34, '#7be07b', 5) + circ(80, -46, 6, OL, 0));
  s += dCurtain(-60, 120, 200, 560, '#a8203a', t, 1) + dCurtain(940, 120, 200, 560, '#a8203a', t, -1) + rect(-M, 100, W + 2 * M, 50, '#7a1428', 0, 5);
  s += G(tr(990, 730), rect(-80, -30, 160, 60, '#1f8a4a', 8, 4) + ftext(0, 12, 'SORTIE', { size: 28, fill: '#fff', stroke: 'none' }));
  for (let i = 0; i < 6; i++) s += op(.6 + .4 * Math.sin(t * 2 + i), circ(100 + i * 176, 690, 8, '#ffd88a', 0));
  return s; }
const lnSeats = (y, s = 1, n = 8, off = 0) => { let r = ''; for (let i = -1; i < n; i++) { const x = off + i * 170 * s; r += rect(x - 74 * s, y, 148 * s, 150 * s, '#c8243e', 30 * s, 6) + rect(x - 60 * s, y + 14 * s, 120 * s, 20 * s, '#e0405a', 8, 0); } return r; };
const lnPopcorn = (x, y, s = 1, t = 0) => G(tr(x, y, s), path('M-60 -130L60 -130L44 0L-44 0Z', '#fff', 5) + [-36, -12, 12, 36].map((xx, i) => rect(xx - 7, -128, 14, 126, i % 2 ? LN.red : '#fff', 0, 0)).join('') + path('M-60 -130L60 -130L44 0L-44 0Z', 'none', 5) + [[-40, -150], [-10, -170], [24, -156], [46, -138], [0, -146], [-30, -132]].map(([a, b], i) => circ(a, b + wave(t, 1.4, 3, i), 22, '#fff6c8', 4)).join(''));
const ln3D = (x, y, s = 1) => G(tr(x, y, s), rect(-90, -26, 80, 52, 'rgba(255,60,60,.7)', 10, 5) + rect(10, -26, 80, 52, 'rgba(60,160,255,.7)', 10, 5) + line(-10, -6, 10, -6, 6));

// ---------- PARC (soleil ou pluie) ----------
function lnRain(t, n = 40, c = 'rgba(200,225,255,.8)') { let s = ''; for (let i = 0; i < n; i++) { const x = (i * 97) % (W + 200) - 100, y = ((i * 211 + t * 1500) % (H + 300)) - 200; s += line(x, y, x - 14, y + 60, 5, c); } return s; }
function lnPark(t, o = {}) { const r = o.rain, yb = 1250;
  let s = r ? grad('#6d7a8c', '#aeb8c6', -M, -M, W + 2 * M, 1900) + cloud(260, 220, 2.4, '#5d6878') + cloud(780, 280, 2.2, '#56606e') + cloud(((t * 40) % 1500) - 200, 420, 1.6, '#66717f') : SKY(t);
  s += path('M-700 900Q200 800 600 880T1780 860L1780 1300L-700 1300Z', r ? '#6f9a6a' : '#9fd18a', 0);
  for (let i = 0; i < 6; i++) s += op(.9, tree(-60 + i * 230, 960 + (i % 2) * 20, .5, t + i));
  s += rect(-M, 980, W + 2 * M, 400, r ? '#78a868' : '#8fd18a', 0, 0) + ell(780, 1080, 220, 50, r ? '#6a8aa8' : '#7fc8ff', 6) + G(tr(720 + Math.sin(t) * 20, 1070), ell(0, 0, 26, 16, '#fff', 4) + circ(20, -14, 12, '#fff', 4) + path('M30 -14L42 -10L30 -6Z', '#ff9a4d', 3));
  s += path('M-200 1250Q300 1100 540 1060Q800 1020 1300 1080L1300 1140Q800 1080 540 1120Q300 1160 -100 1300Z', '#e6d5b0', 5);
  s += dBench(200, 1110, .7) + dLampPost(950, 1120, .9, r ? 1 : 0) + dBin(380, 1110, .55, '#36a85a') + dFlowers(40, 1180, 5, 2, t) + dFlowers(860, 1190, 4, 7, t) + dBush(60, 1240, 1) + dBush(1020, 1250, 1.1);
  if (!r) s += kidsBg(t, 1080, 3, .3) + dBirds(t, 3, 300);
  s += rect(-M, yb, W + 2 * M, 900, r ? '#6a9a5a' : '#7cc46a', 0, 0) + G(tr(560, 1400), path('M-300 -60L300 -60L340 80L-340 80Z', r ? '#9a6a8a' : '#ff8fb1', 6) + path('M-200 -60L-226 80M-100 -60L-112 80M0 -60L0 80M100 -60L112 80M200 -60L226 80', 'none', 4, '#fff') + G(tr(200, -60), rect(-60, -70, 120, 70, '#c58e55', 10, 5) + path('M-50 -70Q0 -130 50 -70', 'none', 8)));
  if (r) { s += lnRain(t, 46) + [[200, 1500], [800, 1600], [450, 1750]].map(([x, y], i) => ell(x, y, 120 + ((t * 80 + i * 30) % 60), 22, 'none', 4, 'rgba(220,235,255,.7)')).join('') + op(.18, rect(-M, -M, W + 2 * M, H + 2 * M, '#2a3550', 0, 0)); }
  return s; }

// ---------- CARTE (papier) + trajet ----------
function lnMapBg(t) { const r = rng(7); let s = rect(-M, -M, W + 2 * M, H + 2 * M, '#efe6cf', 0, 0);
  for (let i = 0; i < 14; i++) s += ell(r() * 1200 - 60, 300 + r() * 1300, 90 + r() * 120, 60 + r() * 80, ['#d6e8b0', '#cfe3a4', '#e3edc0'][i % 3], 0);
  for (let i = 0; i < 10; i++) { const x = r() * 1100, y = 350 + r() * 1200; s += [0, 1, 2].map(j => circ(x + j * 26, y + (j % 2) * 14, 22, '#8fc47a', 3, '#6aa45a')).join(''); }
  s += path('M-200 760Q200 700 380 820T760 760T1300 900', 'none', 34, '#9fd0f0') + path('M-200 760Q200 700 380 820T760 760T1300 900', 'none', 4, '#6aa8cc');
  for (let i = 0; i < 9; i++) { const x1 = r() * 1300 - 100, y1 = 300 + r() * 1300, a = r() * 3.14, L = 400 + r() * 500; s += line(x1, y1, x1 + Math.cos(a) * L, y1 + Math.sin(a) * L, 14, '#d4c9ad') + line(x1, y1, x1 + Math.cos(a) * L, y1 + Math.sin(a) * L, 8, '#fff'); }
  for (let i = 0; i < 18; i++) s += rect(r() * 1080, 300 + r() * 1300, 18, 18, '#c9bfa6', 3, 0);
  s += G(tr(980, 1180, 1, Math.sin(t * 2) * 6), circ(0, 0, 44, '#fff', 5) + path('M0 -40L10 0L0 40L-10 0Z', LN.red, 3) + ftext(0, -52, 'N', { size: 26, fill: OL, stroke: 'none' }));
  return s; }
// bezier quadratique échantillonné jusqu'à k ; style 'solid' (trait) ou 'dots' (pointillés à pied)
function lnSeg(a, b, bend, k, col, st = 'solid', w = 16) { if (k <= 0) return ''; const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * bend, my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * bend;
  const P = u => [(1 - u) * (1 - u) * a[0] + 2 * u * (1 - u) * mx + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * u * (1 - u) * my + u * u * b[1]]; const N = 40; let d = '', dots = '';
  for (let i = 0; i <= N * k; i++) { const [x, y] = P(i / N); d += (i ? 'L' : 'M') + f1(x) + ' ' + f1(y); if (i % 3 === 0) dots += circ(x, y, w * .45, col, 4); }
  return st === 'dots' ? dots : `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w + 10}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; }
const lnSegMid = (a, b, bend) => [(a[0] + b[0]) / 4 + ((a[0] + b[0]) / 2 + (b[1] - a[1]) * bend) / 2, (a[1] + b[1]) / 4 + ((a[1] + b[1]) / 2 - (b[0] - a[0]) * bend) / 2];
const lnBusIco = (x, y, s = 1) => G(tr(x, y, s), rect(-70, -50, 140, 92, '#ffd23f', 18, 6) + rect(-56, -38, 50, 34, '#9fd6ff', 6, 4) + rect(6, -38, 50, 34, '#9fd6ff', 6, 4) + circ(-40, 44, 16, OL, 0) + circ(40, 44, 16, OL, 0) + rect(-70, 8, 140, 10, LN.red, 0, 0));
const lnTrainIco = (x, y, s = 1) => G(tr(x, y, s), rect(-60, -80, 120, 140, SX.acc, 30, 6) + rect(-44, -62, 88, 50, '#bfe3ff', 10, 4) + circ(-30, 22, 10, '#ffd23f', 4) + circ(30, 22, 10, '#ffd23f', 4) + line(-40, 70, -60, 96, 7) + line(40, 70, 60, 96, 7));
const lnWalkIco = (x, y, s = 1, t = 0) => G(tr(x, y, s), G(tr(-22, Math.sin(t * 12) * 8, 1, -12), ell(0, 0, 18, 34, '#fff', 5) + ell(0, 18, 12, 10, OL, 0)) + G(tr(22, -Math.sin(t * 12) * 8, 1, 12), ell(0, 0, 18, 34, '#fff', 5) + ell(0, 18, 12, 10, OL, 0)));
function lnPin(x, y, t, t0, col = LN.red, s = 1) { const k = popEl(t, t0, .55); if (k <= 0) return ''; return G(tr(x, y, k * s), ell(0, 0, 18, 7, 'rgba(0,0,0,.3)', 0) + path('M0 0C-24 -34 -36 -52 -36 -72A36 36 0 1 1 36 -72C36 -52 24 -34 0 0Z', col, 6) + circ(0, -72, 13, '#fff', 0)); }

// ---------- TÉLÉPHONE (gros plan) ----------
function lnPhone(x, y, w, h, inner, o = {}) { return G(tr(x, y, o.s || 1, o.r || 0), rect(-w / 2 - 20, -h / 2 - 20, w + 40, h + 40, '#22232b', 44, 7) + clipR(-w / 2, -h / 2, w, h, rect(-w / 2, -h / 2, w, h, o.bg || '#f4f1ea', 0, 0) + inner, 26) + rect(-44, -h / 2 - 12, 88, 12, '#44454f', 6, 0)); }
// bulle de message dans le téléphone (coordonnées locales)
function lnMsg(x, y, w, lines, t, t0, o = {}) { const k = pop(t, t0, .3); if (k <= 0) return ''; const sz = o.size || 30, h = lines.length * sz * 1.25 + 30, me_ = o.me;
  return G(tr(x, y, k), rect(me_ ? -w : 0, -h / 2, w, h, me_ ? (o.bg || SX.acc) : '#fff', 24, 5) + (o.name ? ftext(me_ ? -w + 20 : 20, -h / 2 - 10, o.name, { size: 20, fill: '#7d848c', stroke: 'none', anchor: 'start' }) : '') +
    lines.map((l, i) => ftext(me_ ? -w + 22 : 22, -h / 2 + 15 + sz + i * sz * 1.25 - sz * .15, l, { size: sz, fill: me_ ? '#fff' : OL, stroke: 'none', anchor: 'start' })).join('')); }
// mini-carte GPS (coordonnées locales, w×h), zoom z (plus petit = plus loin), route du bas vers le haut
function lnGps(w, h, t, o = {}) { const z = o.z ?? 1, r = rng(3); let s = rect(-w / 2, -h / 2, w, h, '#efe6cf', 0, 0);
  let g = ''; for (let i = 0; i < 22; i++) g += ell(r() * 1600 - 800, r() * 3000 - 1500, 60 + r() * 90, 40 + r() * 60, ['#d6e8b0', '#cfe3a4'][i % 2], 0);
  for (let i = 0; i < 14; i++) { const x1 = r() * 1600 - 800, y1 = r() * 3000 - 1500, a = r() * 3.14, L = 300 + r() * 500; g += line(x1, y1, x1 + Math.cos(a) * L, y1 + Math.sin(a) * L, 10, '#fff'); }
  s += G(`scale(${f1(z * 100) / 100})`, g);
  const yA = o.yA ?? h / 2 - 90, yB = o.yB ?? -h / 2 - 200, kk = o.k ?? 1; let d = ''; for (let i = 0; i <= 30 * kk; i++) { const u = i / 30, y = lerp(yA, yB, u), x = Math.sin(u * 9) * w * .25; d += (i ? 'L' : 'M') + f1(x) + ' ' + f1(y); }
  s += `<path d="${d}" fill="none" stroke="${OL}" stroke-width="22" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${SX.acc}" stroke-width="13" stroke-linecap="round"/>`;
  s += circ(0, yA, 18, '#2f9aff', 6) + op(.3, circ(0, yA, 34 + 10 * Math.sin(t * 6), '#2f9aff', 0));
  return s; }

// ---------- FRANCE (deux régions, frontière) ----------
const LN_FR = [[2.37, 51.05], [1.6, 50.85], [1.55, 50.2], [.2, 49.7], [-.3, 49.3], [-1.25, 49.65], [-1.9, 49.7], [-1.55, 48.65], [-2.2, 48.6], [-3.2, 48.85], [-4.7, 48.5], [-4.3, 48.0], [-3.4, 47.7], [-2.3, 47.25], [-2.0, 46.8], [-1.2, 46.2], [-1.15, 45.6], [-1.25, 44.6], [-1.5, 43.5], [-1.3, 43.1], [0, 42.75], [1.5, 42.45], [3.15, 42.45], [3.05, 42.95], [3.6, 43.35], [4.2, 43.5], [4.8, 43.35], [5.35, 43.25], [6.0, 43.1], [6.9, 43.45], [7.5, 43.8], [7.0, 44.25], [6.9, 45.0], [7.1, 45.85], [6.15, 46.2], [6.5, 46.45], [6.1, 46.75], [7.0, 47.45], [7.6, 47.6], [7.75, 48.5], [8.2, 48.95], [7.0, 49.15], [6.35, 49.45], [5.8, 49.55], [4.85, 49.85], [4.75, 50.15], [4.15, 50.25], [3.2, 50.75], [2.55, 51.1]];
const lnFrP = (p, k) => [(p[0] - 2.6) * k * .69, -(p[1] - 47.2) * k];
function lnFrance(cx, cy, k, t, o = {}) { const d = LN_FR.map((p, i) => { const [x, y] = lnFrP(p, k); return (i ? 'L' : 'M') + f1(x) + ' ' + f1(y); }).join('') + 'Z', id = 'fr' + (_gid++);
  const bx = lnFrP([3.0, 47], k)[0]; let bd = ''; for (let i = 0; i <= 24; i++) { const y = -k * 5 + i * k * 10 / 24; bd += (i ? 'L' : 'M') + f1(bx + Math.sin(i * 1.3) * 18 + (i % 2 ? 8 : -8)) + ' ' + f1(y); }
  const kb = seg(t, o.tb ?? 0, (o.tb ?? 0) + .45);
  let s = G('translate(14 18)', path(d, 'rgba(0,0,0,.35)', 0)) + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">` +
    rect(-2000, -2000, 2000 + bx, 4000, '#bfe3ff', 0, 0) + rect(bx, -2000, 2000, 4000, '#ffe08a', 0, 0) + op(.25, path(`M${-k * 4} ${-k * 1}L${-k} ${k * 2}L${-k * 3} ${k * 4}M${k * 2} ${-k * 3}L${k * 3} ${k}L${k * 1.5} ${k * 4}`, 'none', 5, OL)) + '</g>' + path(d, 'none', 8);
  if (kb > 0) s += `<path d="${bd}" fill="none" stroke="${OL}" stroke-width="22" stroke-dasharray="${f1(2000 * kb)} 4000" stroke-linecap="round"/><path d="${bd}" fill="none" stroke="${LN.red}" stroke-width="12" stroke-dasharray="${f1(2000 * kb)} 4000" stroke-linecap="round"/>`;
  return G(tr(cx, cy, o.s || 1), s); }

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, offset)). Cadrage : visages/textes y 380–1150.
// ============================================================
// B001a — SIGNATURE : grille encre, héros (sac à dos) en cut-out, les potes minuscules au loin, titre + « débloqué » sur LOIN
const O1 = at(1, 'il') - .12;
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'loin'), P = at(1, 'potes');
    const pals = G(tr(930, 1180, .38), kevin({ x: 0, y: 0, s: 1, expr: 'happy', armL: [-150, -120] }, t) + lnPal1({ x: 230, y: 0, s: 1, expr: 'happy' }, t) + lnPal2({ x: -230, y: 0, s: 1, expr: 'happy' }, t));
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX - 90, 1050, 300, t, .4, SX.acc, 16) + unlock(CX - 90, 1000, t, K, { part: 'back', r: 480 }) +
      (t > K ? cutout(pals, 8) : '') + G(tr(CX - 90, 1440, 1 + .03 * Math.sin(t * 6)), cutout(lnHero({ x: 0, y: 0, s: 1.2, expr: t > K ? 'sad' : 'happy', look: t > K ? [1.3, 0] : [0, 0], armR: t > K ? [-20, -10] : [70, 80] }, t), 12)) +
      unlock(CX - 90, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX - 90, 1030, 320, 330, t, K + .2, { label: 'moi.png' }) +
      (t > P ? markerArrow(560, 1000, 860, 1000, t, P, { bend: 40 }) + markerText('les potes', 900, 880, t, P + .1, { size: 44 }) : '') +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin("HORRIBLE D'HABITER", CX, 415, t, .3, { size: 58 }) +
      kword('LOIN DE SES POTES ?', CX, 540, t, K - .05, { size: 64, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'loin') - .05, 'boom', .6], [at(1, 'loin'), 'sparkle', .5], [at(1, 'potes'), 'scratch', .4]] });

// B001b — « Il est 18 h 42. » : papier + gobo, gros réveil 18:42 en cut-out, héros prêt à sortir
B(1, { enter: 'none', trans: 'wipe', transD: .2, cam: zin(1.02, 1.08, .2),
  draw: (t, d, T) => { const H18 = at(1, '18') - O1;
    return paper(SX.paper) + gobo(T, .12) + blob(700, 820, 250, t, '#ffd9b0', 3) +
      cutout(G(tr(700, 820, pop(t, H18 - .05, .35), -4), bigClockF(0, 0, '18:42', '#ff5c4a', 1.05) + rect(-170, 80, 40, 40, '#2b2b33', 8, 5) + rect(130, 80, 40, 40, '#2b2b33', 8, 5)), 10) +
      cutout(lnHero({ x: 270, y: 1480, s: 1.15, expr: 'chill', armL: [-150, -120], armR: [60, 70] }, t), 10) +
      kthin('il est', CX, 430, t, 0, { size: 64 }) + funTag(700, 1010, 'SAMEDI SOIR', t, H18 + .15, { size: 40, bg: SX.acc, r: 4 }); },
  sfx: [[0, 'whoosh', .4], [at(1, '18') - O1 - .05, 'pop', .6], [at(1, '18') - O1, 'tick', .5], [at(1, '18') - O1 + .3, 'clock_fast', .3]] }, O1);

// B002 — « Kevin t'appelle. » : papier, gros téléphone en cut-out qui vibre, appel entrant KEVIN
B(2, { enter: 'none', trans: 'circle', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), shake: 2 }),
  draw: (t, d, T) => { const K = at(2, 'kevin'), vib = Math.sin(t * 70) * 7;
    const scr = grad('#5fd08a', '#2f9a5a', -170, -300, 340, 600) + kevinHead(0, -90, 90, { expr: 'ecstatic' }, t) + ftext(0, 70, 'KEVIN', { size: 52, fill: '#fff' }) + ftext(0, 116, 'appel entrant…', { size: 24, fill: '#fff', stroke: 'none' }) +
      circ(-80, 220, 40, LN.red, 5) + circ(80, 220 + Math.sin(t * 10) * 6, 40, '#36c76a', 5);
    return paper('#e3f0fb') + gobo(T, .1) + burst(CX, 830, 330, t, K, SX.acc, 16) + cutout(lnPhone(CX + vib, 830, 340, 600, scr, { r: -4 }), 10) +
      [0, 1, 2].map(i => op(1 - ((t * 2 + i / 3) % 1), path(`M${300 - i * 30} 700Q${260 - i * 30} 830 ${300 - i * 30} 960M${780 + i * 30} 700Q${820 + i * 30} 830 ${780 + i * 30} 960`, 'none', 10, SX.acc))).join('') +
      kthin("Kevin t'appelle", CX, 420, t, K - .1, { size: 62 }); },
  sfx: [[0, 'ring', .5], [at(2, 'kevin'), 'vibrate', .6], [at(2, 'kevin') + .05, 'pop', .4], [at(2, 'appelle'), 'pop_hi', .4]] });

// B003 — « Frère, on est tous dehors, descends ! » : rue de ville, Kevin crie au téléphone, les potes font coucou
B(3, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4, shake: t > at(3, 'descend') ? 5 : 0 }),
  draw: (t, d, T) => { const Fr = at(3, 'frere'), Dh = at(3, 'dehors'), Ds = at(3, 'descend'), wv = Math.sin(t * 12) * 25;
    return depth({ zoom: 1, x: Math.sin(t) * 12 }, [{ z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: lnPal2({ x: 770, y: 1470, s: 1.1, expr: 'happy', flip: 1, armL: [-130 + wv, -110] }, t) + lnPal1({ x: 960, y: 1470, s: 1.05, expr: 'laugh', flip: 1, armR: [-60, -100 + wv] }, t + 1) +
        kevin({ x: 340, y: 1480, s: 1.3, expr: t > Ds ? 'ecstatic' : 'happy', face: t > Fr ? { mouth: 'scream' } : {}, armR: [-70, -140], holdR: phone(0, -20, .32, 10), armL: t > Ds ? [-150, -100] : [110, 100] }, t) },
      { z: .6, svg: blur(10, dBin(80, 1850, 1.4, '#36a85a')) }]) +
      funTag(340, 900, 'KEVIN', t, Fr - .1, { size: 40, bg: LN.grn, r: -6 }) + kthin('on est tous dehors', CX, 420, t, Dh - .35, { size: 58 }) + kword('DESCENDS !', CX, 570, t, Ds - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(3, 'frere'), 'pop', .5], [at(3, 'dehors'), 'whistle', .4], [at(3, 'descend') - .05, 'boom', .6], [at(3, 'descend') + .1, 'flash_hit', .3]] });

// B004 — « Tu regardes par la fenêtre. » : chambre à la campagne, grande fenêtre : champs, vaches… RIEN
B(4, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Rg = at(4, 'regardes'), Fe = at(4, 'fenetre');
    return dWall('stripe', '#f6e6c6', '#efd9b0', 1250) + rect(-M, -M, W + 2 * M, 110 + M, '#a0683c', 0, 0) + dPoster(110, 320, 150, 190, '#2f3a5a', -4, ftext(0, 10, 'VILLE ♥', { size: 26, fill: '#ffd23f', stroke: 'none' }), t) +
      lnWindow(420, 300, 600, 700, t, { eve: 1, lick: t > Fe }) + dCurtain(360, 280, 110, 780, '#e86a8a', t, 1) + dCurtain(970, 280, 110, 780, '#e86a8a', t, -1) + dPot(520, 1030, .5, t, 2, '#5b8fd8') +
      dParquet(1250, '#c49a6c') + dLamp(80, 1290, 1, 0, t) + dShoes(860, 1650, .7) +
      lnHero({ x: 230, y: 1490, s: 1.25, expr: t > Fe ? 'deadpan' : 'happy', look: [1.2, -.3], armR: [-30, -40] }, t) +
      kthin('tu regardes par la fenêtre', CX, 410, t, Rg - .1, { size: 54 }) + (t > Fe ? funTag(640, 590, 'RIEN.', t, Fe, { size: 50, bg: '#fff', fg: SX.ink, r: -6 }) + markerArrow(760, 600, 900, 700, t, Fe + .1, { bend: -30 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(4, 'regardes'), 'pop_hi', .4], [at(4, 'fenetre'), 'crickets', .6], [at(4, 'fenetre') + .1, 'wind', .3]] });

// B005 — « Puis ton GPS. » : gros plan téléphone, l'itinéraire se calcule… et part hors de l'écran
B(5, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Gp = at(5, 'gps'), k = eOutCubic(seg(t, Gp, Gp + .5));
    const scr = lnGps(340, 600, t, { k, z: 1 }) + rect(-170, -300, 340, 80, SX.acc, 0, 0) + ftext(0, -248, t > Gp ? 'ITINÉRAIRE' : 'CALCUL…', { size: 30, fill: '#fff', stroke: 'none' });
    return depth({ zoom: 1 }, [{ z: 1.4, svg: lnRoom(t, { eve: 1 }), haze: .35 }]) + lnPhone(680, 800, 340, 600, scr, { r: 4 }) +
      lnHead(250, 1010, 150, { expr: t > Gp ? 'suspicious' : 'neutral', look: [1, -.4] }, t) + kthin('puis ton', CX, 420, t, 0, { size: 60 }) + funTag(300, 560, 'GPS', t, Gp - .05, { size: 70, bg: SX.acc2, fg: SX.ink, r: -6 }); },
  sfx: [[0, 'whoosh', .4], [at(5, 'puis'), 'typing', .4], [at(5, 'gps') - .05, 'pop', .6], [at(5, 'gps') + .1, 'whoosh_up', .4]] });

// B006 — « KEVIN. J'HABITE À QUARANTE-SEPT KILOMÈTRES. » : rayons, héros furieux en cut-out, 47 KM qui slamme
B(6, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(6, '47') ? 7 : 3 }),
  draw: (t, d, T) => { const K = at(6, 'kevin'), Hb = at(6, 'habite'), N = at(6, '47');
    return rays(t, CX, 900, '#ff6b5a', '#c92f3a', 22) + burst(CX, 760, 340, t, N, SX.acc2, 18) +
      cutout(lnHero({ x: 280, y: 1490, s: 1.25, expr: 'rage', face: { mouth: 'scream' }, armR: [-70, -140], holdR: phone(0, -20, .32, 10), armL: [-160, -110] }, t), 12) +
      kword('KEVIN.', CX, 420, t, K - .05, { size: 120, fill: '#fff' }) + kthin("j'habite à", CX, 560, t, Hb - .1, { size: 56, out: N - .1 }) +
      kword(counter(1, 47, t, N, .4) + ' KM', 640, 780, t, N - .05, { size: 190, fill: SX.acc2, r: -4 }) + popStars(640, 780, t, N + .1, 8, 380) + lnFlash(t, N, .6) +
      (t > at(6, 'km') ? lnPin(860, 1060, t, at(6, 'km'), LN.red, 1.4) : ''); },
  sfx: [[0, 'flash_hit', .5], [at(6, 'kevin') - .05, 'boom', .6], [at(6, 'habite'), 'growl', .4], [at(6, '47') - .05, 'boom', .8], [at(6, '47'), 'slot', .5], [at(6, 'km'), 'thud', .6]] });

// B007 — « Bienvenue dans la vie du pote qui habite loin. » : route de campagne, panneau d'entrée d'agglo, vaches, éolienne (débloqué 2/3)
B(7, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bv = at(7, 'bienvenue'), Po = at(7, 'pot'), Lo = at(7, 'loin');
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: lnCountry(t), haze: .06 },
      { z: 1, svg: unlock(700, 800, t, Po, { part: 'back', r: 420 }) + G(tr(700, 790, pop(t, Bv, .4)), lnPanneau(0, 0, 1, 'LA VIE DU POTE', 'QUI HABITE LOIN', 40)) + unlock(700, 800, t, Po, { part: 'front', r: 420 }) +
        lnHero({ x: 250, y: 1490, s: 1.25, expr: t > Lo ? 'sob' : 'deadpan', armL: [-150, -120] }, t) + lnTumble(((t * 300) % 1500) - 200, 1340, t, .9) },
      { z: .6, svg: blur(10, dBush(1040, 1950, 1.6)) }]) +
      kthin('bienvenue dans', CX, 420, t, Bv - .1, { size: 60 }) + funTag(700, 970, 'POP. : 1 (TOI)', t, Lo, { size: 34, bg: SX.acc, r: 3 }); },
  sfx: [[at(7, 'bienvenue'), 'magic', .5], [at(7, 'bienvenue') + .1, 'pop', .5], [at(7, 'pot') - .05, 'tada', .5], [at(7, 'pot'), 'sparkle', .4], [at(7, 'loin'), 'wind', .4]] });

// B008 — « Tes amis veulent aller manger un kebab. » : rue de ville, les potes rêvent d'un kebab (bulle de pensée)
B(8, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const Am = at(8, 'amis'), Mg = at(8, 'manger'), Kb = at(8, 'kebab'), k = pop(t, Mg - .1, .35);
    const bubble = k <= 0 ? '' : G(tr(600, 760, k), cloud(0, 0, 2.3, '#fff', 7) + circ(-150, 170, 26, '#fff', 6) + circ(-200, 230, 16, '#fff', 5) + lnKebabSand(-60, 10, 1, -10) + lnFries(110, 60, .9));
    return depth({ zoom: 1, x: Math.sin(t) * 10 }, [{ z: 1.5, svg: streetT(t, 2), haze: .1 },
      { z: 1, svg: kevin({ x: 260, y: 1480, s: 1.2, expr: 'starving', look: [1, -1] }, t) + lnPal1({ x: 520, y: 1480, s: 1.15, expr: 'starving', look: [1, -1] }, t) + lnPal2({ x: 790, y: 1480, s: 1.15, expr: 'love', flip: 1, look: [-1, -1] }, t) + bubble },
      { z: .6, svg: blur(10, dLampPost(1050, 1950, 1.6)) }]) +
      funTag(CX, 420, 'TES AMIS', t, Am - .1, { size: 50, bg: LN.grn, r: -4 }) + kword('KEBAB', 600, 560, t, Kb - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(8, 'amis'), 'pop', .5], [at(8, 'manger'), 'chomp', .5], [at(8, 'kebab') - .05, 'boom', .5], [at(8, 'kebab') + .1, 'sizzle', .4]] });

// B009 — « Ils mettent cinq minutes à pied. » : les potes marchent, chrono 5 MIN, le kebab est juste au coin
B(9, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .3 }),
  draw: (t, d, T) => { const Mt = at(9, 'mettent'), F5 = at(9, '5'), Pd = at(9, 'pied'), dx = t * 90;
    const shop = G(tr(900, 1250), rect(-180, -560, 360, 560, '#f0b8a8', 6, 7) + rect(-180, -600, 360, 70, LN.red, 6, 6) + ftext(0, -550, 'KEBAB', { size: 46, fill: '#fff', stroke: 'none' }) + rect(-130, -460, 260, 200, '#bfe3ff', 8, 6) + rect(-60, -230, 120, 230, '#5a4a3a', 6, 6));
    const watch = G(tr(330, 760), circ(0, 0, 120, '#fff', 8) + rect(-24, -150, 48, 30, '#9aa3ad', 6, 5) + path(`M0 0L0 -100A100 100 0 ${seg(t, F5, F5 + .6) > .5 ? 1 : 0} 1 ${f1(Math.sin(R(360 * .99 * eOutCubic(seg(t, F5, F5 + .6)))) * 100)} ${f1(-Math.cos(R(360 * .99 * eOutCubic(seg(t, F5, F5 + .6)))) * 100)}Z`, SX.acc2, 0) + line(0, 0, 0, -86, 7) + ftext(0, 40, counter(0, 5, t, F5, .6) + ' MIN', { size: 40, fill: SX.ink }));
    return depth({ zoom: 1 }, [{ z: 1.5, svg: streetT(t, 1) + shop, haze: .1 },
      { z: 1, svg: kevin({ x: 150 + dx, y: 1480, s: 1.1, expr: 'happy', walk: 3 }, t) + lnPal1({ x: 360 + dx, y: 1480, s: 1.05, expr: 'laugh', walk: 3 }, t) + lnPal2({ x: 560 + dx, y: 1480, s: 1.05, expr: 'happy', walk: 3 }, t) }]) +
      (t > F5 - .1 ? G(tr(330, 760, pop(t, F5 - .1, .35)), G(tr(-330, -760), watch)) : '') + kthin('ils mettent', CX, 420, t, Mt - .1, { size: 58 }) + funTag(760, 560, 'À PIED', t, Pd - .05, { size: 56, bg: SX.acc2, fg: SX.ink, r: 5 }) + popStars(330, 600, t, F5 + .6, 6, 120); },
  sfx: [[0, 'steps', .5], [at(9, '5') - .05, 'pop', .6], [at(9, '5') + .1, 'clock_fast', .4], [at(9, 'pied'), 'ding', .5]] });

// B010 — « Toi ? Un bus. Deux trains. Et quinze minutes de marche. » : carte, trajet qui s'enchaîne (bus → train → train → à pied)
const LN_RT = [[170, 1110], [470, 1010], [900, 880], [250, 700], [820, 560]], LN_BD = [.25, -.2, .2, -.25];
B(10, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const To = at(10, 'toi'), Bu = at(10, 'bus'), T2 = at(10, '2'), Q = at(10, '15'), Ma = at(10, 'marche');
    const t0s = [Bu - .1, T2 - .1, T2 + .3, Q - .1], cols = ['#ffb23f', SX.acc, SX.acc, '#36a85a'], st = ['solid', 'solid', 'solid', 'dots'];
    let route = ''; for (let i = 0; i < 4; i++) route += lnSeg(LN_RT[i], LN_RT[i + 1], LN_BD[i], eInOut(seg(t, t0s[i], t0s[i] + .45)), cols[i], st[i], 18);
    const icos = [lnBusIco, lnTrainIco, lnTrainIco, lnWalkIco].map((f, i) => { const [mx, my] = lnSegMid(LN_RT[i], LN_RT[i + 1], LN_BD[i]); const k = popEl(t, t0s[i] + .15, .5); return k <= 0 ? '' : G(tr(mx, my, k), circ(0, 0, 76, '#fff', 7) + f(0, 0, .8, t)); }).join('');
    let ci = 0; for (let i = 0; i < 4; i++) if (t > t0s[i]) ci = i; const u = eInOut(seg(t, t0s[ci], t0s[ci] + .45)), a = LN_RT[ci], b = LN_RT[ci + 1];
    const me = t > To ? lnHead(lerp(a[0], b[0], t > Bu - .1 ? u : 0), lerp(a[1], b[1], t > Bu - .1 ? u : 0) - 70, 46, { expr: t > Ma ? 'dizzy' : 'worried' }, t) : '';
    return lnMapBg(t) + route + lnPin(LN_RT[0][0], LN_RT[0][1], t, 0, LN.pk, 1.1) + lnPin(LN_RT[4][0], LN_RT[4][1], t, 0, LN.red, 1.3) + G(tr(LN_RT[4][0] + 80, LN_RT[4][1] - 40, .6), lnKebabSand(0, 0, 1, 10)) +
      icos + me + funTag(LN_RT[0][0] + 40, LN_RT[0][1] + 60, 'TOI', t, To, { size: 34, bg: LN.pk, r: -4 }) + funTag(LN_RT[4][0] - 30, LN_RT[4][1] + 50, 'KEBAB', t, 0, { size: 30, bg: LN.red, r: 4 }) +
      kword('TOI ?', 330, 430, t, To - .05, { size: 110, fill: SX.acc2 }) + (t > Ma ? funTag(560, 1130, 'TOTAL : 2 H 40', t, Ma, { size: 40, bg: SX.ink, r: -3 }) : ''); },
  sfx: [[0, 'flash_hit', .4], [at(10, 'toi') - .05, 'boom', .5], [at(10, 'bus') - .1, 'whoosh', .4], [at(10, 'bus') + .05, 'pop', .5], [at(10, '2') - .1, 'whistle', .4], [at(10, '2') + .45, 'pop', .5], [at(10, '15') - .1, 'steps', .5], [at(10, 'marche'), 'slot', .5]] });

// B011 — « Pour un sandwich à sept euros. » : kebab, le héros arrive en sueur, les potes mangent déjà, étiquette 7 €
B(11, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Sa = at(11, 'sandwich'), S7 = at(11, '7');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: lnKebab(t), haze: .3 },
      { z: 1, svg: kevin({ x: 800, y: 1480, s: 1.05, expr: 'happy', flip: 1, armR: [-70, -100], holdR: lnKebabSand(0, -30, .6, 20) }, t) +
        lnHero({ x: 330, y: 1490, s: 1.25, expr: 'dizzy', tremble: 1, armL: [-140, -100], armR: [80, 90] }, t) + sweatSpray(330, 1050, t) +
        G(tr(560, 880, pop(t, Sa - .1, .35), -8), lnKebabSand(0, 0, 1.1)) }]) +
      kthin('pour un sandwich à', CX, 420, t, Sa - .25, { size: 58 }) + kword('7 €', 560, 600, t, S7 - .05, { size: 140, fill: SX.acc2 }) + popStars(560, 600, t, S7, 6, 200); },
  sfx: [[0, 'whoosh', .4], [.1, 'sizzle', .3], [at(11, 'sandwich') - .1, 'pop', .5], [at(11, '7') - .05, 'kaching', .6], [at(11, 'euros'), 'gasp', .4]] });

// B012 — « MON ALLER-RETOUR COÛTE PLUS CHER QUE LE REPAS. » : ticket de caisse du trajet qui se déroule jusqu'au sol, menu minuscule à côté
B(12, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t > at(12, 'cher') ? 6 : 2 }),
  draw: (t, d, T) => { const Mo = at(12, 'mon'), Al = at(12, 'aller'), Ch = at(12, 'cher'), Rp = at(12, 'repas'), k = eOutCubic(seg(t, Al, Rp + .2));
    const items = [['BUS', '2,10 €'], ['TER 1', '12,40 €'], ['TER 2', '9,80 €'], ['RETOUR', '24,30 €'], ['RETARD', '0,00 €'], ['', ''], ['TOTAL', '48,60 €']];
    const len = 120 + 1500 * k; let rc = rect(-170, 0, 340, len, '#fff', 4, 6) + ftext(0, 54, 'TICKET', { size: 34, fill: OL, stroke: 'none' });
    items.forEach(([a, b], i) => { const y = 120 + i * 62; if (y + 30 < len && a) rc += ftext(-140, y, a, { size: i === 6 ? 32 : 26, fill: i === 6 ? LN.red : OL, stroke: 'none', anchor: 'start' }) + ftext(140, y, b, { size: i === 6 ? 32 : 26, fill: i === 6 ? LN.red : OL, stroke: 'none', anchor: 'end' }); });
    const menu = G(tr(250, 820, pop(t, .02, .3), -6), rect(-90, -60, 180, 120, '#ffe9c4', 10, 6) + ftext(0, -16, 'KEBAB', { size: 28, fill: OL, stroke: 'none' }) + ftext(0, 34, '7 €', { size: 40, fill: LN.red, stroke: 'none' }));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: lnKebab(t), haze: .3 }]) + G(tr(760, 640, 1, 3), rc) + menu + markerText('le menu', 250, 950, t, Al + .2, { size: 40 }) + markerText('le trajet', 520, 1080, t, Ch, { size: 40 }) +
      lnHead(250, 1090, 110, { expr: 'rage', tilt: -6 + Math.sin(t * 20) * 3 }, t) +
      kword('MON ALLER-RETOUR', CX, 420, t, Mo - .05, { size: 76, fill: '#fff' }) + kword('PLUS CHER QUE LE REPAS !', CX, 545, t, Ch - .2, { size: 56, fill: SX.acc2 }) + lnFlash(t, Ch, .4); },
  sfx: [[0, 'flash_hit', .4], [at(12, 'mon') - .05, 'boom', .6], [at(12, 'aller'), 'printer', .6], [at(12, 'cher') - .2, 'boom', .5], [at(12, 'cher'), 'kaching', .5], [at(12, 'repas'), 'thud', .6]] });

// B013 — « À dix-sept ans, tu veux aller à une soirée. » : chambre (soir), héros se prépare, carton d'invitation
B(13, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const A17 = at(13, '17'), So = at(13, 'soiree');
    const inv = ftext(0, -70, 'SOIRÉE', { size: 46, fill: '#fff' }) + ftext(0, -20, 'chez Kevin', { size: 30, fill: OL, stroke: 'none' }) + ftext(0, 40, '21 H', { size: 56, fill: LN.red, stroke: 'none' }) + [0, 1, 2].map(i => circ(-90 + i * 90, 100, 14, DPAL[i * 2], 4)).join('');
    return lnRoom(t, { eve: 1 }) + WASH() + lnHero({ x: 290, y: 1490, s: 1.3, expr: t > So ? 'ecstatic' : 'happy', armL: [-150, -120], armR: [-30, -60] }, t) + (t > So ? lnHat(290, 1490 - 1.3 * 292, 130, '#ff5c8a', -8) : '') +
      card(770, 860, 300, 300, rect(-150, -150, 300, 300, '#ff8fb1', 22, 0) + inv, t, So - .1, { ry: 0, thick: 10, r: 5, bw: 6 }) + confetti(t, So, 24) +
      funTag(CX, 430, '17 ANS', t, A17 - .1, { size: 90, bg: SX.acc2, fg: SX.ink }) + popStars(CX, 430, t, A17, 6, 180) + kthin('tu veux aller à une soirée', CX, 600, t, So - .5, { size: 50 }); },
  sfx: [[0, 'whoosh', .4], [at(13, '17') - .1, 'pop', .7], [at(13, 'soiree') - .1, 'pop_hi', .5], [at(13, 'soiree'), 'tada', .5]] });

// B014 — « Tes amis arrivent à 21 heures. » : soirée, les potes arrivent (cadeaux), horloge 21:00
B(14, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ar = at(14, 'arrivent'), H21 = at(14, '21h'), dx = (1 - eOutCubic(seg(t, 0, Ar + .2))) * 200;
    return partyT(t) + G(tr(800, 760, pop(t, H21 - .05, .35), 4), bigClockF(0, 0, '21:00', '#7be07b', .9)) +
      kevin({ x: 240 + dx, y: 1480, s: 1.15, expr: 'ecstatic', armL: [-150, -120], armR: [-30, -60] }, t) + lnHat(240 + dx, 1480 - 1.15 * 292, 115, '#5ec4f0') +
      lnPal1({ x: 480 + dx, y: 1480, s: 1.1, expr: 'joy', armR: [-60, -90], holdR: dGift(0, 20, .6) }, t) + lnPal2({ x: 720 + dx, y: 1480, s: 1.1, expr: 'happy', armL: [-140, -120] }, t) +
      kthin('tes amis arrivent à', CX, 420, t, Ar - .2, { size: 56 }) + kword('21 H', 800, 560, t, H21 - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(14, 'arrivent') - .1, 'ding', .5], [at(14, 'arrivent') + .1, 'steps', .4], [at(14, '21h') - .05, 'pop', .6], [at(14, '21h') + .2, 'drum', .3]] });

// B015 — « Toi, tu pars de chez toi à 19 h 30. » : campagne au crépuscule, le héros part à pied avec sa lampe torche, arrêt de bus perdu
B(15, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .4 }),
  draw: (t, d, T) => { const Pa = at(15, 'pars'), H19 = at(15, '19h30'), x = 200 + t * 60;
    const torch = G(tr(0, -10), rect(-14, -40, 28, 60, '#5a626e', 6, 4) + op(.35, path('M0 -40L-90 -260L90 -260Z', '#fff6c8', 0)));
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.5, svg: lnCountry(t, { eve: 1 }) + lnHouse(150, 1000, .7, 1), haze: .06 },
      { z: 1, svg: lnStop(900, 1250, 1, t, 'DANS 52 MIN') + lnHero({ x, y: 1490, s: 1.25, expr: 'worried', walk: 3, armR: [-40, -80], holdR: torch }, t) },
      { z: .6, svg: blur(10, dBush(60, 1950, 1.6, '#4f8a4a')) }]) +
      kthin('toi, tu pars de chez toi à', CX, 420, t, Pa - .4, { size: 52 }) + G(tr(CX, 600, pop(t, H19 - .05, .35), -3), bigClockF(0, 0, '19:30', '#ff9a4d', .9)) + popStars(CX, 600, t, H19, 6, 220); },
  sfx: [[0, 'steps', .5], [.2, 'wind', .3], [at(15, 'pars'), 'pop_hi', .4], [at(15, '19h30') - .05, 'pop', .6], [at(15, '19h30') + .2, 'crickets', .4]] });

// B016 — « Et à 23 heures… » : soirée à fond, tout le monde danse (le héros aussi), horloge 23:00
B(16, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .5 }),
  draw: (t, d, T) => { const H23 = at(16, '23h'), j = Math.abs(Math.sin(t * 8)) * 26;
    return partyT(t) + G(tr(CX, 760, pop(t, H23 - .05, .35), -3), bigClockF(0, 0, '23:00', '#ff5c8a', 1)) +
      lnHero({ x: 280, y: 1490 - j, s: 1.2, expr: 'ecstatic', armL: [-150, -110], armR: [-30, -70] }, t) + lnHat(280, 1490 - j - 1.2 * 292, 120, '#ffd23f', 8) +
      kevin({ x: 790, y: 1490 - Math.abs(Math.sin(t * 8 + 1)) * 26, s: 1.15, expr: 'ecstatic', flip: 1, armL: [-150, -110], armR: [-30, -70] }, t) + lnHat(790, 1490 - 1.15 * 292, 115, '#5ec4f0', -8) +
      kthin('et à', CX, 420, t, 0, { size: 60 }) + kword('23 H…', CX, 560, t, H23 - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'drum', .5], [at(16, '23h') - .05, 'pop', .6], [at(16, '23h') + .1, 'tick', .5], [at(16, '23h') + .4, 'tick', .5]] });

// B017 — « Tu regardes l'heure du dernier train. » : gros plan, appli horaires : DERNIER TRAIN 23:12 (clignote), panique
B(17, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), hand: .3, shake: t > at(17, 'dernier') ? 3 : 0 }),
  draw: (t, d, T) => { const Rg = at(17, 'regardes'), De = at(17, 'dernier'), bl = Math.sin(t * 14) > 0;
    const scr = rect(-170, -300, 340, 90, SX.acc, 0, 0) + ftext(0, -242, 'HORAIRES', { size: 30, fill: '#fff', stroke: 'none' }) +
      ftext(0, -120, 'DERNIER TRAIN', { size: 30, fill: OL, stroke: 'none' }) + ftext(0, -30, '23:12', { size: 96, fill: bl && t > De ? LN.red : OL, stroke: 'none' }) +
      rect(-140, 30, 280, 70, t > De ? '#ffe1dc' : '#eef4ff', 14, 4) + ftext(0, 76, t > De ? 'DANS ' + (8 - Math.floor(seg(t, De, d) * 3)) + ' MIN' : '…', { size: 34, fill: LN.red, stroke: 'none' }) +
      ftext(0, 180, 'après : demain 6:04', { size: 22, fill: '#7d848c', stroke: 'none' });
    return depth({ zoom: 1 }, [{ z: 1.4, svg: partyT(t), haze: .4 }]) + lnPhone(700, 900, 340, 560, scr, { r: 5 }) +
      lnHead(260, 1010, 160, { expr: t > De ? 'terror' : 'neutral', look: [1, -.3] }, t) + (t > De ? sweatSpray(260, 900, t) : '') +
      kthin("tu regardes l'heure du", CX, 420, t, Rg - .1, { size: 54 }) + kword('DERNIER TRAIN', CX, 530, t, De - .05, { size: 92, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(17, 'regardes'), 'pop_hi', .4], [at(17, 'dernier') - .05, 'sting', .6], [at(17, 'train'), 'clock_fast', .5], [at(17, 'train') + .2, 'gasp', .4]] });

// B018 — « Déjà tu pars ? » : Kevin (chapeau de fête) déçu, le héros file avec son sac, traits de vitesse
B(18, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .4 }),
  draw: (t, d, T) => { const Dj = at(18, 'deja'), Pa = at(18, 'pars'), hx = 520 + seg(t, Pa, d + .3) * 700;
    return partyT(t) + speedLines(t, CX, 900, 22, 'rgba(255,255,255,.35)') +
      kevin({ x: 280, y: 1480, s: 1.25, expr: t > Pa ? 'sad' : 'confused', armR: [-50, -80] }, t) + lnHat(280, 1480 - 1.25 * 292, 125, '#5ec4f0', -6) +
      lnHero({ x: hx, y: 1490, s: 1.15, expr: 'panic', walk: 6, flip: 1, rot: 8 }, t) +
      chatBubble(360, 760, 400, 120, 'Déjà tu pars ?', t, Dj - .05, false, 46); },
  sfx: [[0, 'whoosh', .4], [at(18, 'deja') - .05, 'pop', .5], [at(18, 'pars'), 'whoosh', .6], [at(18, 'pars') + .05, 'steps', .5]] });

// B019a — « NON KEVIN, » : rayons rouges, le héros explose
const O19 = at(19, 'je') - .15;
B(19, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: 6 }),
  draw: (t, d, T) => { const No = at(19, 'non'), K = at(19, 'kevin');
    return rays(t, CX, 950, '#ff6b5a', '#b8283a', 22) + lnHead(CX, 990, 230, { expr: 'rage', face: { mouth: 'scream' }, tilt: Math.sin(t * 22) * 3 }, t) + speedLines(t, CX, 990, 24, 'rgba(255,255,255,.4)') +
      kword('NON', CX, 420, t, No - .05, { size: 130, fill: '#fff' }) + kword('KEVIN,', CX, 580, t, K - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'flash_hit', .5], [at(19, 'non') - .05, 'boom', .7], [at(19, 'kevin'), 'growl', .5]] });
// B019b — « …JE VIS JUSTE DANS UNE AUTRE RÉGION ADMINISTRATIVE ! » : carte de France, frontière rouge qui se trace entre toi et eux
B(19, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2, shake: t > at(19, 'administrative') - O19 ? 4 : 0 }),
  draw: (t, d, T) => { const Au = at(19, 'autre') - O19, Rg = at(19, 'region') - O19, Ad = at(19, 'administrative') - O19, k = 82, cy = 930;
    const [kx, ky] = lnFrP([2.35, 48.86], k), [hx, hy] = lnFrP([3.55, 48.5], k);
    const bar = G(tr(CX + lnFrP([3.0, 47], k)[0], cy + 120, pop(t, Rg, .35)), rect(-110, -12, 220, 24, '#fff', 12, 5) + [-70, -20, 30, 80].map(x => rect(x - 12, -12, 24, 24, LN.red, 0, 0)).join('') + rect(-130, -50, 20, 90, '#9aa3ad', 4, 5));
    return lnMapBg(t) + op(.5, rect(-M, -M, W + 2 * M, H + 2 * M, '#173055', 0, 0)) + lnFrance(CX, cy, k, t, { tb: Au }) + bar +
      lnPin(CX + kx, cy + ky, t, .1, LN.grn, 1.1) + kevinHead(CX + kx - 90, cy + ky - 110, 50, { expr: 'confused' }, t) + lnPin(CX + hx, cy + hy, t, .2, LN.pk, 1.1) + lnHead(CX + hx + 70, cy + hy - 110, 50, { expr: 'sob' }, t) +
      funTag(CX + 40, cy + 300, 'FRONTIÈRE', t, Rg + .1, { size: 34, bg: LN.red, r: -4 }) +
      kthin('je vis juste dans une', CX, 400, t, 0, { size: 52, out: Rg - .15 }) + kword('AUTRE RÉGION', CX, 400, t, Rg - .05, { size: 96, fill: SX.acc2 }) + kword('ADMINISTRATIVE !', CX, 530, t, Ad - .05, { size: 76, fill: '#fff' }); },
  sfx: [[0, 'whoosh', .4], [at(19, 'autre') - O19, 'scratch', .6], [at(19, 'region') - O19 - .05, 'boom', .6], [at(19, 'region') - O19 + .1, 'siren', .3], [at(19, 'administrative') - O19 - .05, 'thud', .7]] }, O19);

// B020a — « Le pire, » : chambre de nuit, orage, gros plan inquiet
const O20 = at(20, 'decisions') - .25;
B(20, { enter: 'none', trans: 'black', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.08, t / d), shake: t > at(20, 'pire') ? 3 : 0 }),
  draw: (t, d, T) => { const Pi = at(20, 'pire');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: lnRoom(t, { night: 1 }), haze: .2 }, { z: 1, svg: lnHead(CX, 1000, 220, { expr: t > Pi ? 'scared' : 'neutral' }, t) }]) + (t > Pi && t < Pi + .25 ? lightning(800, 300, 1.2) : '') +
      kword('LE PIRE,', CX, 470, t, Pi - .1, { size: 130, fill: '#ff6b5a' }) + lnFlash(t, Pi, .4); },
  sfx: [[at(20, 'le'), 'sting', .4], [at(20, 'pire') - .05, 'thunder', .6], [at(20, 'pire'), 'boom', .4]] });
// B020b — « …ce sont les décisions de dernière minute. » : le groupe des potes s'affole, messages en rafale, chrono
B(20, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Dc = at(20, 'decisions') - O20, Dn = at(20, 'derniere') - O20;
    const scr = rect(-180, -320, 360, 90, SX.acc, 0, 0) + ftext(0, -262, 'LES POTES (5)', { size: 30, fill: '#fff', stroke: 'none' }) +
      lnMsg(-160, -160, 250, ['ciné ?'], t, Dc - .1, { name: 'Kevin' }) + lnMsg(-160, -40, 290, ['go dans 10 min'], t, Dc + .25, { name: 'Léa' }) + lnMsg(-160, 80, 270, ['on y est !!'], t, Dn, { name: 'Tom' }) + lnMsg(160, 200, 240, ['attendez'], t, Dn + .3, { me: 1 });
    return depth({ zoom: 1 }, [{ z: 1.4, svg: lnRoom(t, { night: 1 }), haze: .35 }]) + lnPhone(680, 820, 360, 640, scr, { r: 4 }) +
      lnHead(240, 1020, 150, { expr: 'panic' }, t) + sweatSpray(240, 920, t) +
      kthin('les décisions de', CX, 420, t, Dc - .1, { size: 54 }) + kword('DERNIÈRE MINUTE', CX, 545, t, Dn - .05, { size: 82, fill: SX.acc2 }); },
  sfx: [[0, 'vibrate', .5], [at(20, 'decisions') - O20 - .1, 'pop_hi', .5], [at(20, 'decisions') - O20 + .25, 'pop_hi', .5], [at(20, 'derniere') - O20 - .05, 'boom', .5], [at(20, 'minute') - O20, 'clock_fast', .5]] }, O20);

// B021 — « Ils vont au cinéma. » : salle de ciné, les potes en lunettes 3D avec pop-corn
B(21, { enter: 'none', trans: 'wipe', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ci = at(21, 'cinema');
    const heads = kevinHead(260, 960, 95, { expr: 'ecstatic' }, t) + ln3D(260, 950, .9) + G(tr(540, 950), head({ hr: 95, hair: KH[1], hairColor: KC[1], skin: SK[1], expr: 'wow', seed: 21 }, t)) + ln3D(540, 940, .9) +
      G(tr(820, 960), head({ hr: 95, hair: 'ponytail', hairColor: '#e0a040', skin: SK[4], expr: 'laugh', seed: 24 }, t)) + ln3D(820, 950, .9);
    return lnCine(t) + op(.5, rect(-M, 700, W + 2 * M, 500, '#2a1420', 0, 0)) + heads + lnSeats(1080, 1.1, 7, 100) + lnPopcorn(400, 1200, .8, t) + lnPopcorn(690, 1210, .8, t + 1) +
      kthin('ils vont au', CX, 420, t, 0, { size: 60, fill: '#fff' }) + kword('CINÉMA', CX, 560, t, Ci - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [at(21, 'cinema') - .05, 'pop', .6], [at(21, 'cinema') + .1, 'chomp', .4]] });

// B022 — « Tu arrives après le film. » : salle VIDE, générique « FIN », héros essoufflé à l'entrée, agent d'entretien qui balaie
B(22, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ar = at(22, 'arrives'), Ap = at(22, 'apres');
    const broom = G(tr(0, 0, 1, Math.sin(t * 8) * 12), line(0, -40, 0, 180, 8, '#c58e55') + path('M-40 180L40 180L50 230L-50 230Z', '#ffd23f', 5));
    return lnCine(t, { fin: 1 }) + lnSeats(900, 1, 7, 60) + lnSeats(1060, 1.1, 7, 0) +
      adult(2, { x: 860, y: 1470, s: 1.0, hair: 'bald', shirt: '#5b8fd8', expr: 'deadpan', armR: [40, 70], holdR: broom }, t) +
      lnHero({ x: 270, y: 1490, s: 1.25, expr: t > Ap ? 'jawdrop' : 'dizzy', armL: [-140, -100] }, t) + sweatSpray(270, 1050, t) +
      kthin('tu arrives', CX, 420, t, Ar - .1, { size: 60 }) + kword('APRÈS LE FILM', CX, 560, t, Ap - .05, { size: 96, fill: SX.acc2 }); },
  sfx: [[0, 'steps', .5], [at(22, 'arrives'), 'gasp', .5], [at(22, 'apres') - .05, 'boom', .5], [at(22, 'fil'), 'crickets', .5]] });

// B023 — « Ils vont au parc. » : parc ensoleillé, pique-nique, frisbee
B(23, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.04, t / d), hand: .3 }),
  draw: (t, d, T) => { const Pc = at(23, 'parc'), fx = 380 + Math.sin(t * 3) * 240;
    return lnPark(t) + kevin({ x: 240, y: 1470, s: 1.1, expr: 'ecstatic', armL: [-150, -110] }, t) + lnPal1({ x: 540, y: 1470, s: 1.05, expr: 'joy' }, t) + lnPal2({ x: 830, y: 1470, s: 1.05, expr: 'laugh', flip: 1, armL: [-140, -120] }, t) +
      G(tr(fx, 840, 1, t * 400), ell(0, 0, 50, 16, LN.red, 5)) +
      kthin('ils vont au', CX, 420, t, 0, { size: 60 }) + kword('PARC', CX, 560, t, Pc - .05, { size: 120, fill: SX.acc2 }); },
  sfx: [[0, 'chirp', .5], [at(23, 'parc') - .05, 'pop', .6], [at(23, 'parc') + .2, 'whistle', .3]] });

// B024 — « Tu arrives quand il pleut. » : même parc sous la pluie, héros trempé, nuage perso au-dessus de la tête
B(24, { enter: 'drop', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ar = at(24, 'arrives'), Pl = at(24, 'pleuvent');
    const myCloud = G(tr(CX, 680 + Math.sin(t * 3) * 10), cloud(0, 0, 1.6, '#5d6878', 7) + (t > Pl && Math.sin(t * 9) > .6 ? lightning(40, 60, .5) : ''));
    let drops = ''; for (let i = 0; i < 12; i++) { const x = CX - 180 + (i * 37) % 360, y = 740 + ((i * 53 + t * 900) % 500); drops += line(x, y, x - 6, y + 40, 6, '#8fc4ff'); }
    return lnPark(t, { rain: 1 }) + drops + myCloud +
      lnHero({ x: CX, y: 1490, s: 1.3, expr: 'sob', armL: [-140, -100] }, t) + op(.4, path(`M${CX - 140} 1000Q${CX} 1060 ${CX + 140} 1000`, 'none', 10, '#8fc4ff')) +
      kthin('tu arrives quand', CX, 420, t, Ar - .1, { size: 58 }) + kword('IL PLEUT', CX, 560, t, Pl - .1, { size: 100, fill: '#bfe3ff', r: -4 }); },
  sfx: [[0, 'thunder', .5], [.05, 'wind', .4], [at(24, 'arrives'), 'steps', .4], [at(24, 'pleuvent') - .1, 'boom', .4], [at(24, 'pleuvent') + .2, 'spray', .3]] });

// B025 — « Ils organisent une soirée improvisée. » : soirée, banderole qui tombe, potes qui dansent
B(25, { enter: 'none', trans: 'circle', transD: .25, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .4 }),
  draw: (t, d, T) => { const Or = at(25, 'organisent'), So = at(25, 'soiree'), Im = at(25, 'improvisee'), dy = 300 * (1 - eOutBack(seg(t, So - .1, So + .3)));
    const banner = G(tr(CX, 700 - dy), path('M-400 -60L400 -60L380 60L-380 60Z', SX.acc, 7) + ftext(0, 22, 'SOIRÉE !!!', { size: 64, fill: '#fff' }));
    const dance = (i, f) => Math.abs(Math.sin(t * 8 + i)) * 26;
    return partyT(t) + banner + kevin({ x: 230, y: 1480 - dance(0), s: 1.1, expr: 'ecstatic', armL: [-150, -110], armR: [-30, -70] }, t) + lnPal1({ x: 540, y: 1480 - dance(1), s: 1.05, expr: 'joy', armL: [-150, -110] }, t) +
      lnPal2({ x: 840, y: 1480 - dance(2), s: 1.05, expr: 'ecstatic', flip: 1, armL: [-150, -110], armR: [-30, -70] }, t) + confetti(t, Im, 30) +
      kthin('ils organisent une', CX, 420, t, Or - .1, { size: 54 }) + kword('SOIRÉE IMPROVISÉE', CX, 560, t, Im - .1, { size: 72, fill: SX.acc2 }); },
  sfx: [[0, 'drum', .5], [at(25, 'organisent'), 'pop_hi', .4], [at(25, 'soiree') - .1, 'whoosh', .4], [at(25, 'soiree') + .2, 'thud', .4], [at(25, 'improvisee') - .1, 'tada', .5]] });

// B026 — « Tu la découvres sur Snapchat. » : la nuit, dans son lit, la story de la soirée (barres de progression), le héros en larmes
B(26, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2 }),
  draw: (t, d, T) => { const Dc = at(26, 'decouvres'), Sn = at(26, 'snapchat');
    let story = grad('#5a2a8c', '#1a0b30', -190, -340, 380, 680); for (let i = 0; i < 3; i++) story += op(.25, G(tr(-120 + i * 120, -340, 1, Math.sin(t * 2 + i) * 20), path('M-20 0L20 0L120 600L-120 600Z', DPAL[i * 2], 0)));
    story += discoBall(0, -170, .5, t) + kevinHead(-100, 70, 62, { expr: 'ecstatic' }, t) + lnHat(-100, 70, 62, '#5ec4f0') + G(tr(30, 100), head({ hr: 58, hair: KH[1], hairColor: KC[1], skin: SK[1], expr: 'laugh', seed: 21 }, t)) + lnHat(30, 100, 58, '#ffd23f') +
      G(tr(130, 60), head({ hr: 56, hair: 'ponytail', hairColor: '#e0a040', skin: SK[4], expr: 'joy', seed: 24 }, t)) +
      [0, 1, 2].map(i => rect(-170 + i * 116, -320, 106, 8, 'rgba(255,255,255,.4)', 4, 0) + rect(-170 + i * 116, -320, 106 * (i === 0 ? 1 : i === 1 ? seg(t, 0, d) : 0), 8, '#fff', 4, 0)).join('') +
      circ(-150, -280, 20, LN.grn, 3) + ftext(-120, -272, 'kevin  ·  il y a 2 h', { size: 20, fill: '#fff', stroke: 'none', anchor: 'start' }) +
      G(tr(10, 230, 1, -6), rect(-150, -34, 300, 68, SX.acc2, 14, 5) + ftext(0, 14, 'SOIRÉE IMPRO !!', { size: 32, fill: SX.ink, stroke: 'none' }));
    return lnRoom(t, { night: 1 }) + op(.3, glow(660, 800, 380, '#c9a0ff', .8)) + lnPhone(680, 790, 380, 660, story, { r: 3 }) +
      lnHead(230, 1020, 150, { expr: t > Sn ? 'sob' : 'shock', look: [1, -.3] }, t) +
      kthin('tu la découvres sur', CX, 400, t, Dc - .1, { size: 52 }) + funTag(240, 790, 'STORY', t, Sn - .05, { size: 46, bg: SX.acc2, fg: SX.ink, r: -8 }); },
  sfx: [[0, 'whoosh', .4], [at(26, 'decouvres'), 'pop_hi', .4], [at(26, 'snapchat') - .05, 'shutter', .5], [at(26, 'snapchat') + .1, 'sting', .5], [at(26, 'snapchat') + .3, 'gasp', .4]] });

// B027 — « Alors tu finis par refuser certaines invitations. » : bureau, les invitations arrivent… tampon REFUSÉ sur chacune
B(27, { enter: 'none', trans: 'up', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Al = at(27, 'alors'), Fi = at(27, 'finis'), Rf = at(27, 'refuser'), In = at(27, 'invitations');
    const cards = [['ANNIV LÉA', '#ff8fb1', 300, 820, -6, Al], ['BOWLING', '#5ec4f0', 560, 760, 4, Fi], ['SOIRÉE', '#ffd23f', 820, 840, -3, Fi + .3]];
    return lnRoom(t, { eve: 1 }) + WASH() + cards.map(([s, c, x, y, r, t0], i) => card(x, y, 240, 170, rect(-120, -85, 240, 170, c, 16, 0) + ftext(0, -10, s, { size: 34, fill: '#fff' }) + ftext(0, 50, 'tu viens ?', { size: 24, fill: OL, stroke: 'none' }), t, t0, { ry: 0, thick: 8, r, bw: 6 }) +
      stamp(x, y + 10, 'REFUSÉ', t, [Rf, Rf + .3, In][i], LN.red, -12, 44)).join('') +
      lnHero({ x: 540, y: 1490, s: 1.25, expr: t > Rf ? 'sad' : 'worried', armR: [-20, -20] }, t) +
      kthin('alors tu finis par', CX, 420, t, Al - .1, { size: 56 }) + kword('REFUSER', CX, 560, t, Rf - .05, { size: 110, fill: '#ff6b5a' }); },
  sfx: [[at(27, 'alors'), 'pop', .5], [at(27, 'finis'), 'pop', .5], [at(27, 'finis') + .3, 'pop', .5], [at(27, 'refuser'), 'thud', .6], [at(27, 'refuser') + .3, 'thud', .5], [at(27, 'invitations'), 'thud', .5]] });

// B028 — « Pas parce que tu n'as pas envie. » : le héros serre une photo des potes, jauge ENVIE qui déborde
B(28, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .2 }),
  draw: (t, d, T) => { const Pa = at(28, 'pas'), En = at(28, 'envie'), k = eOutCubic(seg(t, Pa, En + .2));
    const photo = G(tr(0, -60, 1, -6), rect(-110, -90, 220, 170, '#fff', 8, 6) + rect(-96, -76, 192, 120, '#bfe3ff', 4, 4) + kevinHead(-40, -10, 34, { expr: 'happy' }, t) + G(tr(36, -6), head({ hr: 32, hair: KH[1], hairColor: KC[1], skin: SK[1], expr: 'happy', seed: 21 }, t)));
    const gauge = G(tr(840, 860), rect(-60, -260, 120, 520, '#fff', 30, 7) + clipR(-52, -252, 104, 504, rect(-52, 252 - 560 * k, 104, 560, '#ff5c8a', 0, 0), 26) + ftext(0, -290, 'ENVIE', { size: 34, fill: '#fff' }) + ftext(0, 20, Math.round(k * 200) + ' %', { size: 36, fill: '#fff' }));
    return lnRoom(t, { eve: 1 }) + WASH() + gauge + (k > .9 ? heartsUp(t, 840, 560, 5, 300) : '') +
      lnHero({ x: 330, y: 1490, s: 1.3, expr: 'love', armL: [-60, -10], armR: [-120, -170], holdR: photo }, t) + heartsUp(t, 330, 980, 4, 260) +
      kthin("pas parce que tu n'as pas", CX, 420, t, Pa - .1, { size: 50 }) + kword('ENVIE', 420, 570, t, En - .05, { size: 110, fill: '#ff8fb1' }); },
  sfx: [[at(28, 'pas'), 'pop_hi', .4], [at(28, 'pas') + .1, 'whoosh_up', .4], [at(28, 'envie') - .05, 'boom', .5], [at(28, 'envie') + .1, 'sparkle', .5]] });

// B029a — « Mais parce que tu es fatigué » : train de nuit, le héros dort contre la vitre (bave, zZz)
const O29 = at(29, 'passer') - .15;
B(29, { enter: 'none', trans: 'zoom', transD: .22, cam: (t, d) => ({ z: lerp(1.04, 1.1, t / d), r: -2 }),
  draw: (t, d, T) => { const Ma = at(29, 'mais'), Fa = at(29, 'fatigue');
    const zz = [0, 1, 2].map(i => { const k = (t * .7 + i / 3) % 1; return op(1 - k, ftext(560 + k * 120, 820 - k * 260, 'Z', { size: 50 + i * 16, fill: '#fff' })); }).join('');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: lnTrain(t, { night: 1 }), haze: .3 }]) + lnSeat(420, 1250, 1.1) +
      lnHead(420, 980, 190, { expr: t > Fa ? 'sleep' : 'dizzy', tilt: -22 }, t) + (t > Fa ? path(`M${450} 1110Q456 ${1150 + Math.sin(t * 3) * 10} 448 1180`, 'none', 10, '#8fd0ff') : '') + zz +
      kthin('mais parce que tu es', CX, 420, t, Ma - .1, { size: 54 }) + kword('FATIGUÉ', CX, 560, t, Fa - .05, { size: 110, fill: '#bfe3ff' }); },
  sfx: [[at(29, 'mais'), 'whoosh', .4], [at(29, 'fatigue') - .05, 'thud', .5], [at(29, 'fatigue') + .2, 'whistle', .3]] });
// B029b — « …de passer trois heures dans les transports pour en passer deux avec eux. » : barres comparées + sablier
B(29, { enter: 'crash', cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const H3 = at(29, '3') - O29, Tr = at(29, 'transports') - O29, H2 = at(29, '2') - O29, Eu = at(29, 'eux') - O29;
    const k1 = eOutCubic(seg(t, H3, Tr + .3)), k2 = eOutCubic(seg(t, H2, H2 + .35));
    const bars = ftext(-360, -120, 'TRANSPORTS', { size: 34, fill: OL, stroke: 'none', anchor: 'start' }) + rect(-360, -96, 720, 80, '#eef1f4', 18, 5) + rect(-360, -96, 720 * k1, 80, '#ff9a4d', 18, 5) + ftext(-360 + 720 * k1 - 16, -40, k1 > .2 ? '3 H' : '', { size: 40, fill: '#fff', anchor: 'end' }) +
      [lnBusIco, lnTrainIco, lnTrainIco, lnWalkIco].map((f, i) => k1 > (i + 1) / 5 ? f(-300 + i * 160, 50, .45, t) : '').join('') +
      ftext(-360, 170, 'AVEC EUX', { size: 34, fill: OL, stroke: 'none', anchor: 'start' }) + rect(-360, 194, 720, 80, '#eef1f4', 18, 5) + rect(-360, 194, 480 * k2, 80, '#5fb85f', 18, 5) + ftext(-360 + 480 * k2 - 16, 250, k2 > .2 ? '2 H' : '', { size: 40, fill: '#fff', anchor: 'end' });
    const sand = seg(t, 0, d), hg = G(tr(880, 1080, .8, Math.sin(t * 2) * 6), path('M-60 -100L60 -100L0 0L60 100L-60 100L0 0Z', 'rgba(220,240,255,.8)', 6) + path(`M${-50 * (1 - sand)} ${-90 + 90 * sand}L${50 * (1 - sand)} ${-90 + 90 * sand}L0 0Z`, '#ffd23f', 0) + path(`M-50 90L50 90L${30 * sand} ${90 - 70 * sand}L${-30 * sand} ${90 - 70 * sand}Z`, '#ffd23f', 0) + rect(-74, -116, 148, 18, '#c58e55', 6, 5) + rect(-74, 98, 148, 18, '#c58e55', 6, 5));
    return depth({ zoom: 1 }, [{ z: 1.4, svg: lnTrain(t), haze: .4 }]) + card(CX, 830, 820, 520, bars, t, .02, { ry: 0, thick: 12, r: -2, bw: 6 }) + hg +
      lnHead(150, 1100, 90, { expr: t > Eu ? 'dead' : 'dizzy' }, t) +
      kword('3 H', 260, 470, t, H3 - .05, { size: 110, fill: '#ff9a4d' }) + kthin('pour en passer', 700, 450, t, H2 - .5, { size: 46 }) + kword('2 H', 860, 520, t, H2 - .05, { size: 90, fill: '#7be07b' }) + (t > Eu ? markerText('rentable ?', 640, 1150, t, Eu, { size: 46 }) : ''); },
  sfx: [[0, 'whoosh', .4], [at(29, '3') - O29 - .05, 'slot', .5], [at(29, 'transports') - O29, 'whoosh_up', .4], [at(29, '2') - O29 - .05, 'pop', .6], [at(29, 'eux') - O29, 'rimshot', .5]] }, O29);

// B030 — « Et un jour, Kevin t'écrit : » : salon de Kevin, il tape sur son téléphone (bulle « … »)
B(30, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .2 }),
  draw: (t, d, T) => { const Jo = at(30, 'jour'), K = at(30, 'kevin'), Ec = at(30, 'ecrit');
    const dots = t > K ? G(tr(720, 820, pop(t, K, .3)), rect(-110, -50, 220, 100, '#fff', 40, 6) + [0, 1, 2].map(i => circ(-50 + i * 50, Math.sin(t * 10 + i) * 8, 14, '#9aa3ad', 0)).join('')) : '';
    return salonF(t) + WASH() + kevin({ x: 420, y: 1480, s: 1.25, expr: 'smugger', look: [.3, 1], armR: [80, -160], holdR: phone(0, 10, .3, -6), armL: [100, -20] }, t) + dots +
      kthin('et un jour,', CX, 420, t, Jo - .2, { size: 60 }) + funTag(CX, 570, "KEVIN T'ÉCRIT", t, Ec - .15, { size: 60, bg: LN.grn, r: -4 }); },
  sfx: [[at(30, 'jour'), 'pop_hi', .4], [at(30, 'kevin'), 'typing', .5], [at(30, 'ecrit') - .15, 'pop', .5], [at(30, 'ecrit') + .1, 'ding', .4]] });

// B031 — « On se voit jamais, t'abuses. » : écran de discussion, le message de Kevin, T'ABUSES qui slamme
B(31, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .2, shake: t > at(31, 'abuses') ? 3 : 0 }),
  draw: (t, d, T) => { const Vo = at(31, 'voit'), Ab = at(31, 'abuses');
    const scr = rect(-180, -320, 360, 100, '#fff', 0, 0) + kevinHead(-120, -270, 34, { expr: 'happy' }, t) + ftext(-70, -258, 'Kevin', { size: 32, fill: OL, stroke: 'none', anchor: 'start' }) + line(-180, -220, 180, -220, 3, '#dfe5ea') +
      lnMsg(-160, -100, 300, ['On se voit jamais,'], t, Vo - .1) + lnMsg(-160, 10, 200, ["t'abuses."], t, Ab - .05) + rect(-170, 240, 340, 60, '#fff', 30, 4);
    return depth({ zoom: 1 }, [{ z: 1.4, svg: lnGare(t, { night: 1, l1: 'TER  23:12', l2: 'BUS  DEMAIN' }), haze: .3 }]) + lnPhone(640, 880, 340, 600, scr, { r: -3, bg: '#eef1f4' }) +
      lnHead(220, 1030, 140, { expr: t > Ab ? 'annoyed' : 'neutral', look: [1, -.3] }, t) +
      kword("T'ABUSES.", CX, 450, t, Ab - .05, { size: 110, fill: SX.acc2 }); },
  sfx: [[0, 'vibrate', .5], [at(31, 'voit') - .1, 'ding', .5], [at(31, 'abuses') - .05, 'boom', .5], [at(31, 'abuses') + .2, 'hmm', .4]] });

// B032 — « Tu regardes ton téléphone. » : gare de nuit, seul sur le banc, visage éclairé par l'écran
B(32, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Rg = at(32, 'regardes'), Te = at(32, 'telephone');
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.4, svg: lnGare(t, { night: 1, l1: 'TER  23:12', l2: 'BUS  DEMAIN' }), haze: .05 },
      { z: 1, svg: lnHero({ x: 620, y: 1480, s: 1.25, expr: 'deadpan', look: [0, 1], armR: [80, -160], holdR: phone(0, 10, .3, -6), armL: [100, -20] }, t) + op(.35, glow(620, 1050, 200, '#bfe3ff', .8)) }]) +
      kthin('tu regardes ton', CX, 420, t, Rg - .1, { size: 60 }) + kword('TÉLÉPHONE', CX, 560, t, Te - .05, { size: 100, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .4], [.1, 'crickets', .4], [at(32, 'regardes'), 'pop_hi', .4], [at(32, 'telephone') - .05, 'pop', .5]] });

// B033 — « Tu pourrais lui expliquer. Encore. » : au tableau, le héros explique le trajet pour la 48e fois
B(33, { enter: 'none', trans: 'push', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const Po = at(33, 'pourrais'), Ex = at(33, 'expliquer'), En = at(33, 'encore');
    const chalk = op(.9, lnBusIco(240, 520, .7) + lnTrainIco(440, 520, .7) + lnTrainIco(620, 520, .7) + lnWalkIco(800, 520, .7, t) + [[300, 360], [520, 540], [700, 760]].map(([a, b]) => path(`M${a} 520L${b - 20} 520`, 'none', 6, '#fff')).join('') + ftext(540, 680, '= 2 H 40', { size: 60, fill: '#fff', stroke: 'none' }));
    const ptr_ = G(tr(0, -20), line(0, 0, 120, -160, 8, '#c58e55'));
    return classroomT(t, Ex < t ? chalk : '') + WASH() + lnHero({ x: 260, y: 1490, s: 1.25, expr: t > En ? 'deadpan' : 'talk', armR: [-60, -90], holdR: ptr_ }, t) +
      kthin('tu pourrais lui expliquer', CX, 420, t, Po - .1, { size: 54, out: En - .15 }) + kword('ENCORE.', CX, 420, t, En - .05, { size: 110, fill: SX.acc2 }) +
      (t > En ? funTag(800, 960, 'FOIS N° ' + counter(1, 48, t, En, .4), t, En, { size: 40, bg: LN.red, r: 5 }) : ''); },
  sfx: [[at(33, 'pourrais'), 'scratch', .4], [at(33, 'expliquer'), 'pop', .5], [at(33, 'encore') - .05, 'boom', .5], [at(33, 'encore'), 'slot', .4]] });

// B034 — « Mais cette fois, tu réponds simplement : » : train, le héros, lunettes de soleil, tape avec assurance
B(34, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Ce = at(34, 'cette'), Re = at(34, 'reponds'), Si = at(34, 'simplement');
    const shades = G(tr(0, 0), rect(-96, -30, 84, 50, '#1d2026', 14, 5) + rect(12, -30, 84, 50, '#1d2026', 14, 5) + line(-12, -12, 12, -12, 6));
    const hy = 1490 - 1.3 * 292;
    return depth({ zoom: 1 }, [{ z: 1.4, svg: lnTrain(t), haze: .1 }]) + lnSeat(540, 1250, 1.2) + lnHero({ x: 540, y: 1490, s: 1.3, expr: 'smugger', look: [0, 1], armR: [80, -160], holdR: phone(0, 10, .3, -6), armL: [100, -20] }, t) +
      (t > Ce ? G(tr(540, hy + 1.3 * 6 - 60 * (1 - eOutBack(seg(t, Ce, Ce + .3))), 1.3), shades) : '') + (t > Si ? sparkle(640, hy - 20, 1 + .2 * Math.sin(t * 20), '#fff') : '') +
      kthin('mais cette fois,', CX, 420, t, Ce - .2, { size: 60 }) + funTag(CX, 570, 'SIMPLEMENT', t, Si - .1, { size: 60, bg: SX.acc, r: -4 }); },
  sfx: [[at(34, 'cette'), 'whoosh', .4], [at(34, 'cette') + .2, 'glint', .5], [at(34, 'reponds'), 'typing', .5], [at(34, 'simplement') - .1, 'pop', .5]] });

// B035a — « FRÈRE, POUR UNE FOIS, » : grille, héros en cut-out qui tape à fond, FRÈRE slam
const O35 = at(35, 'viens') - .15;
B(35, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 4 }),
  draw: (t, d, T) => { const Fr = at(35, 'frere'), Fo = at(35, 'fois');
    return gridBg(SX.acc, 'rgba(255,255,255,.08)') + halftoneFade('#fff', .06, 1) + burst(CX, 1000, 300, t, Fr, SX.acc2, 16) +
      cutout(lnHero({ x: CX, y: 1490, s: 1.3, expr: 'rage', face: { mouth: 'scream' }, armR: [80, -160], holdR: phone(0, 10, .3, -6), armL: [-150, -110], tremble: 1 }, t), 12) + speedLines(t, CX, 1000, 20, 'rgba(255,255,255,.35)') +
      kword('FRÈRE,', CX, 430, t, Fr - .05, { size: 130, fill: '#fff' }) + kthin('pour une fois,', CX, 600, t, Fo - .3, { size: 60 }); },
  sfx: [[0, 'flash_hit', .5], [at(35, 'frere') - .05, 'boom', .6], [at(35, 'pour'), 'typing', .5], [at(35, 'fois'), 'pop', .4]] });
// B035b — « VIENS CHEZ MOI. » : la maison perdue dans les champs, le héros la montre fièrement
B(35, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: 3 }),
  draw: (t, d, T) => { const Vi = at(35, 'viens') - O35;
    return depth({ zoom: 1 }, [{ z: 1.5, svg: lnCountry(t), haze: .05 }, { z: 1, svg: lnHouse(760, 1200, 1.4) + lnHero({ x: 280, y: 1490, s: 1.25, expr: 'ecstatic', armL: [-170, -150], armR: [-20, -40] }, t) }]) +
      kword('VIENS CHEZ MOI.', CX, 500, t, Vi - .05, { size: 96, fill: SX.acc2 }) + popStars(760, 900, t, Vi + .1, 8, 300); },
  sfx: [[at(35, 'viens') - O35 - .05, 'boom', .7], [at(35, 'moi') - O35, 'tada', .5]] }, O35);

// B036 — « Il regarde l'itinéraire. Puis répond : » : Kevin sur son canapé, la carte s'étire… s'étire… s'étire
const O36 = BT[34] + at(35, 'ils') - .1 - BT[35];
B(36, { enter: 'none', trans: 'zoom', transD: .2, cam: (t, d) => ({ z: lerp(1.0, 1.05, t / d), hand: .3 }),
  draw: (t, d, T) => { const It = at(36, 'itineraire') - O36, Pu = at(36, 'puis') - O36, k = eInOut(seg(t, It - .1, Pu + .3)), h = lerp(600, 1250, k);
    const scr = lnGps(340, h, t, { z: lerp(1, .3, k), yA: h / 2 - 80, yB: -h / 2 + 90, k: 1 }) + lnPin(0, -h / 2 + 90, t, 0, LN.grn, .8) + rect(-170, -h / 2, 340, 64, SX.acc, 0, 0) + ftext(0, -h / 2 + 44, counter(1, 47, t, It, .6) + ' KM', { size: 34, fill: '#fff', stroke: 'none' });
    return salonF(t) + WASH() + lnPhone(760, 860, 340, h, scr, { r: 3 }) + kevinHead(300, 960, 170, { expr: t > Pu ? 'shock' : t > It ? 'confused' : 'smugger', look: [1, -.2] }, t) +
      kthin("il regarde l'itinéraire", 300, 420, t, 0, { size: 46, out: Pu - .1 }) + kthin('puis répond :', 300, 420, t, Pu - .05, { size: 56 }); },
  sfx: [[0, 'pop_hi', .4], [at(36, 'itineraire') - O36, 'whoosh_up', .5], [at(36, 'itineraire') - O36 + .3, 'boing', .5], [at(36, 'repond') - O36, 'gulp', .5]] }, O36);

// B037 — « Ah ouais… c'est super loin. » : gros plan Kevin gêné, sueur, SUPER LOIN
B(37, { enter: 'punch', cam: (t, d) => ({ z: lerp(1.02, 1.1, t / d), hand: .2 }),
  draw: (t, d, T) => { const Ah = at(37, 'ah'), Su = at(37, 'super');
    return depth({ zoom: 1 }, [{ z: 1.4, svg: salonF(t), haze: .3 }, { z: 1, svg: kevinHead(CX, 1000, 220, { expr: t > Su ? 'embarrassed' : 'worried', look: [-.5, .3] }, t) + (t > Su ? sweatSpray(CX, 860, t) : '') }]) +
      chatBubble(CX, 700, 520, 110, 'Ah ouais…', t, Ah - .05, false, 50) + kword("C'EST SUPER LOIN", CX, 470, t, Su - .2, { size: 74, fill: SX.acc2 }); },
  sfx: [[at(37, 'ah'), 'hmm', .5], [at(37, 'ouais'), 'gulp', .4], [at(37, 'super') - .2, 'boom', .5], [at(37, 'loin'), 'crickets', .5]] });

// B038 — « AH BAH TIENS. » : rayons, le héros bras croisés, regard caméra blasé
B(38, { enter: 'crash', flash: 1, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), shake: t < .3 ? 6 : 0 }),
  draw: (t, d, T) => { const Ah = at(38, 'ah'), Ti = at(38, 'tiens');
    return rays(t, CX, 950, SX.acc, '#0a5a96', 22) + cutout(lnHero({ x: CX, y: 1490, s: 1.35, expr: 'smugger', armL: [120, 40], armR: [60, 140] }, t), 12) +
      kword('AH BAH TIENS.', CX, 480, t, Ah - .05, { size: 100, fill: SX.acc2 }) + (t > Ti ? funTag(820, 760, 'ÉTONNANT.', t, Ti, { size: 40, bg: '#fff', fg: SX.ink, r: 8 }) : ''); },
  sfx: [[0, 'flash_hit', .5], [at(38, 'ah') - .05, 'boom', .7], [at(38, 'tiens'), 'rimshot', .6]] });

// B039 — FIN « BIENVENUE DANS MA VIE, KEVIN. » : Kevin à l'arrêt de bus perdu (PROCHAIN : DEMAIN), une vache le lèche, débloqué (3/3)
B(39, { enter: 'none', trans: 'wipe', transD: .22, cam: (t, d) => ({ z: lerp(1.0, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const Bv = at(39, 'bienvenue'), Vi = at(39, 'vie'), K = at(39, 'kevin');
    return depth({ zoom: 1, x: Math.sin(t) * 8 }, [{ z: 1.5, svg: lnCountry(t, { eve: 1 }), haze: .05 },
      { z: 1, svg: unlock(CX, 640, t, K, { part: 'back', r: 420 }) + lnStop(160, 1260, .9, t, 'DEMAIN') + lnCow(700, 1440, .95, t, { flip: 1, lick: 1, tilt: -10 }) +
        lnPackB({ x: 380, y: 1470, s: 1.2, seed: 3 }, t, '#8a6ad8') + kevin({ x: 380, y: 1470, s: 1.2, expr: t > K ? 'sob' : 'scared', armL: [-140, -110] }, t) + lnStraps({ x: 380, y: 1470, s: 1.2, seed: 3 }, t) +
        lnHero({ x: 900, y: 1490, s: 1.1, expr: 'smugger', flip: 1, armL: [120, 40], armR: [60, 140] }, t) + unlock(CX, 640, t, K, { part: 'front', r: 420 }) },
      { z: .6, svg: blur(10, dBush(60, 1950, 1.6)) }]) +
      kthin('bienvenue dans ma vie,', CX, 420, t, Bv - .1, { size: 60 }) + kword('KEVIN.', CX, 580, t, K - .05, { size: 150, fill: SX.acc2 }); },
  sfx: [[at(39, 'bienvenue'), 'magic', .5], [at(39, 'vie'), 'wind', .4], [at(39, 'kevin') - .05, 'boom', .7], [at(39, 'kevin'), 'tada', .5], [at(39, 'kevin') + .5, 'rimshot', .4]] });

SCENES.sort((a, b) => a.s - b.s);
