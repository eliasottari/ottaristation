// Lecteur commun : rend une frame au temps T (secondes) dans le <svg id="stage">
(function () {
  const st = document.createElement('style');
  st.textContent = "@font-face{font-family:Fredoka;src:url(../engine/fredoka.woff2) format('woff2');font-weight:700}@font-face{font-family:Anton;src:url(../engine/fonts/anton.woff2) format('woff2')}@font-face{font-family:Outfit;src:url(../engine/fonts/outfit200.woff2) format('woff2');font-weight:200}@font-face{font-family:Komika;src:url(../engine/fonts/komika.ttf) format('truetype')}@font-face{font-family:'Permanent Marker';src:url(../engine/fonts/marker.woff2) format('woff2')}html,body{margin:0;background:#000;overflow:hidden}#stage{width:" + W + "px;height:" + H + "px;display:block}";
  document.head.appendChild(st);
})();
const stage = document.getElementById('stage');
window.fontsReady = Promise.all(['700 40px Fredoka', '40px Anton', '200 40px Outfit', "40px 'Permanent Marker'", '40px Komika'].map(f => document.fonts.load(f).catch(() => 0)));
window.GUIDE = false;
function sceneAt(T) {
  for (let i = SCENES.length - 1; i >= 0; i--) if (T >= SCENES[i].s) return [SCENES[i], i];
  return [SCENES[0], 0];
}
function renderFrame(T) {
  _gid = 0;
  const [sc, i] = sceneAt(T);
  const e = (SCENES[i + 1] ? SCENES[i + 1].s : TOTAL);
  const t = T - sc.s, d = e - sc.s;
  let inner = sc.draw(t, d, T);
  const c = sc.cam ? sc.cam(t, d) : { z: lerp(1.0, 1.06, eInOut(clamp(t / d))) };
  let z = c.z ?? 1, x = c.x ?? 0, y = c.y ?? 0, r = c.r ?? 0;
  const enter = sc.enter ?? 'punch';
  if (enter === 'punch') z *= 1 + .08 * (1 - eOutCubic(seg(t, 0, .3)));
  if (enter === 'whip') x += W * .65 * Math.pow(1 - eOutCubic(seg(t, 0, .28)), 2) * (i % 2 ? -1 : 1);
  if (enter === 'drop') y -= H * .26 * Math.pow(1 - eOutCubic(seg(t, 0, .3)), 2);
  if (enter === 'crash') z *= 1 + .5 * Math.pow(1 - eOutCubic(seg(t, 0, .25)), 2);
  if (enter === 'tilt') { r += 8 * Math.pow(1 - eOutCubic(seg(t, 0, .35)), 2) * (i % 2 ? -1 : 1); z *= 1 + .1 * (1 - eOutCubic(seg(t, 0, .35))); }
  if (c.shake) { const [sx, sy] = shake(T, c.shake); x += sx; y += sy; }
  if (c.hand && typeof handheld === 'function') { const [hx, hy, hr] = handheld(T, c.hand); x += hx; y += hy; r += hr; z *= 1 + .03 * c.hand; }
  const cx = c.cx ?? W / 2, cy = c.cy ?? H / 2;
  let out = `<g transform="translate(${cx + x} ${cy + y}) rotate(${r}) scale(${z}) translate(${-cx} ${-cy})">${inner}</g>`;
  // flou de mouvement pendant les entrées rapides
  if (typeof blur === 'function') {
    if (enter === 'whip' && t < .22) out = blur(40 * (1 - t / .22), out, 'h');
    if (enter === 'crash' && t < .15) out = blur(10 * (1 - t / .15), out);
  }
  // transitions SIZEX (sc.trans) : mélange avec la fin du plan précédent pendant TD secondes
  if (sc.trans && i > 0 && t < (sc.transD || .3)) {
    const pv = SCENES[i - 1], pd = sc.s - pv.s, k = t / (sc.transD || .3), e = eInOut(k);
    const prev = `<g>${pv.draw(pd, pd, T)}</g>`;
    if (sc.trans === 'zoom') out = G(`translate(${W / 2} ${H / 2}) scale(${1 + e * 3}) translate(${-W / 2} ${-H / 2})`, op(1 - e, prev)) + op(e, G(`translate(${W / 2} ${H / 2}) scale(${.6 + .4 * e}) translate(${-W / 2} ${-H / 2})`, out));
    else if (sc.trans === 'circle') { const id = 'tc' + (_gid++); out = prev + `<defs><clipPath id="${id}"><circle cx="${sc.tx ?? W / 2}" cy="${sc.ty ?? H / 2}" r="${e * H * 1.2}"/></clipPath></defs><g clip-path="url(#${id})">${out}</g>`; }
    else if (sc.trans === 'push') out = G(`translate(${-e * W} 0)`, prev) + G(`translate(${(1 - e) * W} 0)`, out);
    else if (sc.trans === 'up') out = G(`translate(0 ${-e * H})`, prev) + G(`translate(0 ${(1 - e) * H})`, out);
    else if (sc.trans === 'glitch' && typeof glitch === 'function') out = glitch(k < .5 ? prev : out, T, 1 - Math.abs(k - .5) * 2);
    else if (sc.trans === 'black') out = k < .4 ? `<rect width="${W}" height="${H}" fill="#000"/>` : out;
    else if (sc.trans === 'wipe') { const id = 'tw' + (_gid++); out = prev + `<defs><clipPath id="${id}"><path d="M-200 -200L${-200 + e * (W + 900)} -200L${-600 + e * (W + 900)} ${H + 200}L-200 ${H + 200}Z"/></clipPath></defs><g clip-path="url(#${id})">${out}</g>` + line(-200 + e * (W + 900), -200, -600 + e * (W + 900), H + 200, 40, typeof SX !== 'undefined' ? SX.acc : '#ff3d2e'); }
  }
  if (sc.overlay) out += sc.overlay(t, d, T);
  if (sc.dust !== false) out += dust(T, 7, 18, 'rgba(255,255,255,.35)');
  out += vignette(.28);
  if (typeof SIZEX !== 'undefined' && SIZEX && typeof grain === 'function' && sc.grain !== false) out += grain(T, SIZEX.grain ?? .09);
  if (c.bars && typeof letterbox === 'function') out += letterbox(c.bars);
  if (sc.flash) out += op(1 - seg(t, 0, .18), `<rect width="${W}" height="${H}" fill="#fff"/>`);
  if (T > TOTAL - .5) out += op(seg(T, TOTAL - .5, TOTAL), `<rect width="${W}" height="${H}" fill="#000"/>`);
  if (window.GUIDE && W > H) out += `<rect y="700" width="${W}" height="220" fill="rgba(255,0,0,.25)"/><rect y="920" width="${W}" height="160" fill="rgba(0,0,0,.3)"/>`;
  if (window.GUIDE && H > W) out += `<rect y="1250" width="1080" height="420" fill="rgba(255,0,0,.25)"/><rect y="1670" width="1080" height="250" fill="rgba(0,0,0,.35)"/>`;
  stage.innerHTML = out;
}
window.renderFrame = renderFrame;
window.getCues = () => {
  const cues = [];
  SCENES.forEach(sc => (sc.sfx || []).forEach(([dt, name, vol]) => cues.push({ t: +(sc.s + dt).toFixed(3), name, vol: vol ?? 1 })));
  return { cues, beds: typeof BEDS !== 'undefined' ? BEDS : [] };
};
const q = new URLSearchParams(location.search);
if (q.has('t')) document.fonts.ready.then(() => renderFrame(+q.get('t')));
