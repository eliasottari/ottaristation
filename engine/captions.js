// ============================================================
//  Sous-titres incrustés (règle client, jusqu'à nouvel ordre) — style CapCut du client :
//  police Sour Gummy Black, minuscules, blanc + contour noir épais, ombre noire décalée (droite/bas),
//  espacement -2, centré, coupure « ponctuation ou pause », une seule ligne, apparition « pop » par ligne.
//  Position : centre de ligne à y ≈ 1494 (sur 1920). Dessinés hors caméra (ne tremblent pas).
//  Désactiver : window.CAPTIONS = false dans scenes.js.
// ============================================================
const CAP = { y: 1494, size: 64, maxW: 920, gap: .32 };
function buildCaps() {
  if (typeof WORDS === 'undefined') return [];
  const toks = WORDS.map(w => [w[0], w[1], String(w[2]).replace(/[«»"]/g, '').trim()]).filter(w => w[2]);
  const txt = ws => ws.reduce((s, w) => s + (s && !/^['’\-]/.test(w[2]) && !/^[,.?!…:;]/.test(w[2]) ? ' ' : '') + w[2], '').replace(/\s+([,.?!…:;])/g, '$1').toLowerCase();
  const width = s => s.length * CAP.size * .46;
  const phrases = []; let cur = [];
  for (let i = 0; i < toks.length; i++) {
    const w = toks[i], nx = toks[i + 1]; cur.push(w);
    const glued = nx && /^['’\-]/.test(nx[2]);
    const punct = /[,.?!…:;]$/.test(w[2]), pause = nx && nx[0] - w[1] > CAP.gap;
    if (!glued && (punct || pause || !nx)) { phrases.push(cur); cur = []; }
  }
  if (cur.length) phrases.push(cur);
  const lines = [];
  const split = ws => { if (ws.length < 2 || width(txt(ws)) <= CAP.maxW) { lines.push(ws); return; }
    let best = 1, bd = 1e9; for (let j = 1; j < ws.length; j++) { if (/^['’\-]/.test(ws[j][2])) continue; const d = Math.abs(width(txt(ws.slice(0, j))) - width(txt(ws.slice(j)))); if (d < bd) { bd = d; best = j; } }
    split(ws.slice(0, best)); split(ws.slice(best)); };
  phrases.forEach(split);
  return lines.map((ws, i) => ({ t0: ws[0][0], t1: lines[i + 1] ? Math.min(lines[i + 1][0][0], ws[ws.length - 1][1] + .6) : ws[ws.length - 1][1] + .6, s: txt(ws) }));
}
let _CAPS = null;
function captionsAt(T) {
  if (window.CAPTIONS === false) return '';
  if (!_CAPS) _CAPS = buildCaps();
  const c = _CAPS.find(c => T >= c.t0 && T < c.t1); if (!c) return '';
  const k = seg(T, c.t0, c.t0 + .16), s = .55 + .45 * eOutBack(k, 2.2);
  const esc = c.s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<defs><filter id="capsh" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="9" dy="5" stdDeviation="3.5" flood-color="#000" flood-opacity=".95"/></filter></defs>`
    + `<g transform="translate(${W / 2} ${CAP.y}) scale(${s.toFixed(3)})" filter="url(#capsh)"><text x="0" y="${CAP.size * .35}" font-family="SourGummy, Fredoka, sans-serif" font-weight="900" font-size="${CAP.size}" letter-spacing="-1.5" text-anchor="middle" fill="#fff" stroke="#000" stroke-width="${CAP.size * .2}" stroke-linejoin="round" paint-order="stroke">${esc}</text></g>`;
}
