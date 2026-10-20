// ============================================================
//  « POURQUOI C'EST HORRIBLE DE … ? » — format SIZEX fun (validé client) — 9:16, calé mot à mot
//  words.js + timing.js sont générés par tools/prep.py. TOTAL et BT viennent de timing.js (ne pas les redéfinir).
//  Moteur : lib.js (persos, primitives) · cine.js (depth, blur) · motion.js (sxFun, kword, kthin, funTag, funBox, burst,
//  blob, popStars, unlock, cutout, gridBg, paper, gobo…) · decor.js (décors riches, kevin, kid, adult, aides).
//  Référence complète du format : exemple_gentil/scenes.js (ou gentil/, pauvres/, secours/ dans le dépôt d'origine).
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

// ---------- SIZEX fun : UN accent par épisode (Fredoka gras + contour cartoon sur tous les textes motion) ----------
sxFun('#ff3d6e'); SX.acc2 = '#ffd23f';

// ---------- le héros : il doit PORTER le sujet de l'épisode (barbe clairsemée, cernes, auréole, chasuble…) ----------
// Overlay sur la tête via hairFn : renvoie [derrière, devant] (voir gentil/scenes.js gentilHair, hair.js bigForehead).
const HERO_SHIRT = '#5b8fd8';
const heroHair = (r, t, o) => { const [b, f] = hairSvg('short', o.hairColor || '#5a3a26', r, t); return [b, f /* + ton overlay ici */]; };
const heroP = (o, t) => person(Object.assign({ age: 'kid', hairFn: heroHair, shirt: HERO_SHIRT, pants: '#3b3f4a', seed: 2 }, o), t);
const heroHead = (x, y, r, o, t) => G(tr(x, y, 1, o.tilt || 0), head(Object.assign({ hr: r, hairFn: heroHair, seed: 2 }, o), t));

// ============================================================
//  PLANS — un B(n, {...}) par bloc (sous-plans : B(n, {...}, at(n, 'mot') - .15)). Vise 32–40 plans pour ~60 s.
//  Cadrage 9:16 : visages/textes entre y 380 et 1150 ; sous 1250 = décor seulement (sous-titres du client).
// ============================================================
// B001 — SIGNATURE : fond graphique, héros en cut-out, titre 3 lignes, « débloqué » en étoiles sur le mot-clé
B(1, { enter: 'none', cam: (t, d) => ({ z: lerp(1, 1.06, t / d), hand: .3 }),
  draw: (t, d, T) => { const K = at(1, 'pourquoi') + .9; // ← remplace par at(1, 'motcle')
    return gridBg(SX.ink) + halftoneFade('#fff', .06, 1) + burst(CX, 1050, 300, t, .4, SX.acc, 16) + unlock(CX, 1000, t, K, { part: 'back', r: 480 }) +
      G(tr(CX, 1440, 1 + .03 * Math.sin(t * 6)), cutout(heroP({ x: 0, y: 0, s: 1.25, expr: t > K ? 'jawdrop' : 'happy' }, t), 12)) +
      unlock(CX, 1000, t, K, { part: 'front', r: 480 }) + funBox(CX, 1030, 330, 330, t, K + .2, { label: 'heros.png' }) +
      kthin("POURQUOI C'EST", CX, 330, t, .05, { size: 62 }) + kthin('HORRIBLE DE', CX, 415, t, .3, { size: 58 }) +
      kword('MOT-CLÉ ?', CX, 540, t, K - .05, { size: 80, fill: SX.acc2 }); },
  sfx: [[0, 'whoosh', .6], [.05, 'pop_hi', .4], [.3, 'pop_hi', .4], [at(1, 'pourquoi') + .85, 'boom', .6], [at(1, 'pourquoi') + .9, 'sparkle', .5]] });

// B002 — intro motion (papier + ombre de feuillage), personnages en cut-out, étiquettes molles
B(2, { enter: 'none', trans: 'wipe', cam: zin(1.02, 1.08, .3),
  draw: (t, d, T) => paper(SX.paper) + gobo(T, .12) + burst(780, 980, 260, t, .2, '#ffe1b8', 16) +
    cutout(heroP({ x: 300, y: 1450, s: 1.2, expr: 'happy' }, t), 10) + cutout(kevin({ x: 790, y: 1450, s: 1.2, expr: 'smugger', flip: 1 }, t), 10) +
    funTag(790, 640, 'KEVIN', t, .3, { size: 44, bg: '#5fb85f' }),
  sfx: [[0, 'whoosh', .4], [.3, 'pop', .6]] });

// B003+ — VRAI DÉCOR RICHE (decor.js) en 3 couches + couche motion par-dessus
B(3, { enter: 'whip', cam: (t, d) => ({ z: lerp(1.02, 1.08, t / d), hand: .4 }),
  draw: (t, d, T) => depth({ zoom: 1, x: Math.sin(t) * 14 }, [
      { z: 1.5, svg: streetT(t, 2), haze: .08 },
      { z: 1, svg: heroP({ x: 340, y: 1480, s: 1.3, expr: 'panic' }, t) + kevin({ x: 760, y: 1480, s: 1.3, expr: 'mock', flip: 1 }, t) },
      { z: .6, svg: blur(10, dBin(80, 1820, 1.4, '#36a85a')) }]) +
    kword('PUNCH', CX, 470, t, .3, { size: 100, fill: SX.acc2 }) + popStars(340, 760, t, .5, 6, 120),
  sfx: [[0, 'whoosh', .5], [.3, 'boom', .5], [.5, 'sparkle', .4]] });

// Blocs restants : remplacés un par un par de vrais plans (ce filet évite seulement un écran vide pendant l'écriture)
for (let n = SCENES.length + 1; n < BT.length; n++) B(n, { draw: (t, d, T) => salonF(t) + WASH() + heroP({ x: CX, y: 1480, s: 1.3, expr: 'sob' }, t), sfx: [[0, 'whoosh', .3]] });

SCENES.sort((a, b) => a.s - b.s);
