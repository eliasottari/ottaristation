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
// rendu d'un plan (caméra comprise) au temps global T — T peut dépasser la fin du plan (transitions)
function sceneSvg(i, T) {
  const sc = SCENES[i];
  const e = (SCENES[i + 1] ? SCENES[i + 1].s : TOTAL);
  const t = T - sc.s, d = e - sc.s;
  let inner = sc.draw(t, d, T);
  const c = sc.cam ? sc.cam(t, d) : { z: lerp(1.0, 1.06, eInOut(clamp(t / d))) };
  let z = c.z ?? 1, x = c.x ?? 0, y = c.y ?? 0, r = c.r ?? 0;
  const enter = sc.enter ?? (sc.tin ? 'none' : 'punch');
  if (enter === 'punch') z *= 1 + .08 * (1 - eOutCubic(seg(t, 0, .3)));
  if (enter === 'whip') x += W * .65 * Math.pow(1 - eOutCubic(seg(t, 0, .28)), 2) * (i % 2 ? -1 : 1);
  if (enter === 'drop') y -= H * .26 * Math.pow(1 - eOutCubic(seg(t, 0, .3)), 2);
  if (enter === 'crash') z *= 1 + .5 * Math.pow(1 - eOutCubic(seg(t, 0, .25)), 2);
  if (enter === 'tilt') { r += 8 * Math.pow(1 - eOutCubic(seg(t, 0, .35)), 2) * (i % 2 ? -1 : 1); z *= 1 + .1 * (1 - eOutCubic(seg(t, 0, .35))); }
  if (c.shake) { const [sx, sy] = shake(T, c.shake); x += sx; y += sy; }
  if (c.hand && typeof handheld === 'function') { const [hx, hy, hr] = handheld(T, c.hand); x += hx; y += hy; r += hr; z *= 1 + .03 * c.hand; }
  const cx = c.cx ?? W / 2, cy = c.cy ?? H / 2;
  let out = `<g transform="translate(${cx + x} ${cy + y}) rotate(${r}) scale(${z}) translate(${-cx} ${-cy})">${inner}</g>`;
  if (typeof blur === 'function') {
    if (enter === 'whip' && t < .22) out = blur(40 * (1 - t / .22), out, 'h');
    if (enter === 'crash' && t < .15) out = blur(10 * (1 - t / .15), out);
  }
  return out;
}
// transitions (style flow) : sc.tin = {type, d} ; 'portal' utilise SCENES[i-1].portal(tPrev) ;
// 'portalOut' utilise sc.portal(t) (rectangle de l'écran où vit le plan précédent)
function withTransition(i, T, out) {
  const sc = SCENES[i], tin = sc.tin, t = T - sc.s;
  if (!tin || i === 0 || t >= tin.d) return out;
  const k = clamp(t / tin.d), pv = SCENES[i - 1];
  if (tin.type === 'dissolve') return out + op(1 - eInOut(k), sceneSvg(i - 1, T));
  if (tin.type === 'glitch') return k < .5 ? glitchFx(sceneSvg(i - 1, T), k * 2, T) : glitchFx(out, (1 - k) * 2, T, 7);
  if (tin.type === 'wipe') { const id = 'wp' + (_gid++), x = W * (1 - eInOut(k)) * (tin.dir || 1); return sceneSvg(i - 1, T) + `<defs><clipPath id="${id}"><rect x="${f1(tin.dir < 0 ? -W - 20 + W * eInOut(k) + 20 : x)}" y="-10" width="${W + 20}" height="${H + 20}"/></clipPath></defs><g clip-path="url(#${id})">${out}</g>`; }
  if (tin.type === 'portal') {
    const rc = pv.portal(T - pv.s), e = eInOut(k), tf = portalTf(rc, e);
    let s = `<g transform="${tf}">${sceneSvg(i - 1, T)}${inRect(rc, out, tin.rr ?? 10)}</g>`;
    return typeof chroma === 'function' ? chroma(s, 5 * Math.sin(Math.PI * k)) : s;
  }
  if (tin.type === 'portalOut') {
    const rc = sc.portal(t), e = eInOut(k), tf = portalTf(rc, 1 - e);
    let s = `<g transform="${tf}">${out}${inRect(rc, sceneSvg(i - 1, T), tin.rr ?? 10)}</g>`;
    return typeof chroma === 'function' ? chroma(s, 5 * Math.sin(Math.PI * k)) : s;
  }
  return out;
}
function renderFrame(T) {
  _gid = 0;
  const [sc, i] = sceneAt(T);
  const e = (SCENES[i + 1] ? SCENES[i + 1].s : TOTAL);
  const t = T - sc.s, d = e - sc.s;
  let out = withTransition(i, T, sceneSvg(i, T));
  if (typeof FLOW_DEFS !== 'undefined') out = `<defs>${FLOW_DEFS.replace(/<filter id="grainF"[\s\S]*?<\/filter>/, '')}</defs>` + out;
  if (sc.overlay) out += sc.overlay(t, d, T);
  if (sc.dust !== false) out += dust(T, 7, 18, 'rgba(255,255,255,.35)');
  if (window.FLOW && sc.post !== false) { if (sc.rays) out += lightRays(T, sc.rays); out += grain(T, .07); }
  out += vignette(.28);
  const c = sc.cam ? sc.cam(t, d) : {};
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
