// Lecteur commun : rend une frame au temps T (secondes) dans le <svg id="stage">
(function () {
  const st = document.createElement('style');
  st.textContent = "@font-face{font-family:Fredoka;src:url(../engine/fredoka.woff2) format('woff2');font-weight:700}html,body{margin:0;background:#000;overflow:hidden}#stage{width:" + W + "px;height:" + H + "px;display:block}";
  document.head.appendChild(st);
})();
const stage = document.getElementById('stage');
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
  if (c.shake) { const [sx, sy] = shake(T, c.shake); x += sx; y += sy; }
  const cx = c.cx ?? W / 2, cy = c.cy ?? H / 2;
  let out = `<g transform="translate(${cx + x} ${cy + y}) rotate(${r}) scale(${z}) translate(${-cx} ${-cy})">${inner}</g>`;
  if (sc.overlay) out += sc.overlay(t, d, T);
  if (sc.dust !== false) out += dust(T, 7, 18, 'rgba(255,255,255,.35)');
  out += vignette(.28);
  if (sc.flash) out += op(1 - seg(t, 0, .18), `<rect width="${W}" height="${H}" fill="#fff"/>`);
  if (T > TOTAL - .5) out += op(seg(T, TOTAL - .5, TOTAL), `<rect width="${W}" height="${H}" fill="#000"/>`);
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
