// ============================================================
//  VRAIE 3D (Three.js, WebGL logiciel dans Chromium) — mouche low-poly, monde « jeu vidéo »,
//  scan fil de fer. Chaque appel rend une image et renvoie une data-URL à poser dans le SVG.
//  Charger engine/vendor/three.min.js AVANT ce fichier.
// ============================================================
const T3 = { R: {}, S: {} };
function t3Renderer(w, h) {
  const k = w + 'x' + h;
  if (!T3.R[k]) {
    const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    r.setPixelRatio(1); r.setSize(w, h); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    T3.R[k] = r;
  }
  return T3.R[k];
}
const t3mat = (c, o = {}) => new THREE.MeshLambertMaterial(Object.assign({ color: c, flatShading: true }, o));
function t3cyl(a, b, r0, r1, mat, seg = 6) { // cylindre entre 2 points
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), len = A.distanceTo(B);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, len, seg), mat);
  m.position.copy(A).add(B).multiplyScalar(.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  m.castShadow = true; return m;
}

// ---------- la mouche (drosophile) low-poly ----------
function t3Fly() {
  const g = new THREE.Group(), parts = [];
  const add = (m, p) => { m.castShadow = true; (p || g).add(m); parts.push(m); return m; };
  const body = t3mat('#b8702a'), headM = t3mat('#c98a3a'), eye = t3mat('#d8232c'), dark = t3mat('#2a1a10'), band = t3mat('#e6a43c'), stripe = t3mat('#3a2412');
  const th = add(new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 1), body)); th.scale.set(1, .85, 1.15); th.position.set(0, .82, 0);
  const hd = add(new THREE.Mesh(new THREE.IcosahedronGeometry(.42, 1), headM)); hd.position.set(0, .9, -.82);
  for (const sd of [-1, 1]) { const e = add(new THREE.Mesh(new THREE.IcosahedronGeometry(.29, 1), eye)); e.position.set(sd * .3, .98, -.95); }
  for (const sd of [-1, 1]) add(t3cyl([sd * .1, 1.2, -1.05], [sd * .25, 1.55, -1.35], .035, .02, dark, 4));
  // abdomen rayé
  const rads = [.5, .56, .5, .38], cols = [band, stripe, band, stripe];
  for (let i = 0; i < 4; i++) { const m = add(new THREE.Mesh(new THREE.CylinderGeometry(rads[i], rads[i + 1] || .2, .36, 8), cols[i])); m.rotation.x = Math.PI / 2; m.position.set(0, .82, .55 + i * .34); }
  const tip = add(new THREE.Mesh(new THREE.ConeGeometry(.2, .3, 8), stripe)); tip.rotation.x = Math.PI / 2; tip.position.set(0, .82, 2.0);
  // ailes
  const shp = new THREE.Shape(); shp.absellipse(0, 0, .45, 1.1, 0, Math.PI * 2);
  const wingM = new THREE.MeshLambertMaterial({ color: '#e8f7ff', transparent: true, opacity: .45, side: THREE.DoubleSide });
  const wings = [-1, 1].map(sd => { const p = new THREE.Group(); p.position.set(sd * .2, 1.25, -.1); g.add(p); const w = add(new THREE.Mesh(new THREE.ShapeGeometry(shp, 12), wingM), p); w.rotation.x = -Math.PI / 2; w.position.set(sd * .35, 0, 1.0); p.userData.sd = sd; return p; });
  // pattes (3 paires), pivot à l'attache
  const legs = [];
  [-.32, 0, .32].forEach((z, j) => [-1, 1].forEach(sd => {
    const p = new THREE.Group(); p.position.set(sd * .35, .72, z); g.add(p);
    const dz = (j - 1) * .35;
    add(t3cyl([0, 0, 0], [sd * .55, .35, dz], .06, .05, dark, 5), p);
    add(t3cyl([sd * .55, .35, dz], [sd * .85, -.72, dz * 1.5], .055, .035, dark, 5), p);
    p.userData = { sd, ph: (j % 2 === 0 ? 0 : Math.PI) + (sd > 0 ? Math.PI : 0) };
    legs.push(p);
  }));
  g.userData = { legs, wings, parts, head: hd };
  return g;
}
function t3FlyAnim(fly, t, walk = 1, eat = 0) {
  for (const p of fly.userData.legs) { const a = Math.sin(t * 14 + p.userData.ph) * .45 * walk; p.rotation.y = a; p.rotation.z = Math.max(0, Math.cos(t * 14 + p.userData.ph)) * .25 * walk * p.userData.sd; }
  for (const w of fly.userData.wings) { w.rotation.z = w.userData.sd * (.15 + Math.sin(t * 6) * .05); w.rotation.y = w.userData.sd * -.25; }
  fly.userData.head.position.y = .9 - eat * (.5 + .5 * Math.sin(t * 22)) * .18;
  fly.userData.head.position.z = -.82 - eat * .12;
}

// ---------- monde « jeu vidéo » ----------
function t3World() {
  const sc = new THREE.Scene();
  sc.background = new THREE.Color('#8fd2ff'); sc.fog = new THREE.Fog('#cdeeff', 30, 95);
  sc.add(new THREE.HemisphereLight('#ffffff', '#4f7a3a', .75));
  const sun = new THREE.DirectionalLight('#fff6dc', .85); sun.position.set(-8, 14, 6); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 40 }); sun.shadow.bias = -.002;
  sc.add(sun); sc.add(sun.target);
  // sol en damier de verts (pixels)
  const gg = new THREE.PlaneGeometry(160, 160, 80, 80).toNonIndexed(); gg.rotateX(-Math.PI / 2);
  const cols = ['#5fc04a', '#56b444', '#6acb56', '#4fae3f', '#62c44f'].map(c => new THREE.Color(c));
  const ca = [], rr = rng(11);
  for (let i = 0; i < gg.attributes.position.count / 6; i++) { const c = cols[Math.floor(rr() * cols.length)]; for (let k = 0; k < 6; k++) ca.push(c.r, c.g, c.b); }
  gg.setAttribute('color', new THREE.Float32BufferAttribute(ca, 3));
  const ground = new THREE.Mesh(gg, new THREE.MeshLambertMaterial({ vertexColors: true })); ground.receiveShadow = true; sc.add(ground);
  // arbres + montagnes
  const trunk = t3mat('#7a5232'), leaf = [t3mat('#3f9a45'), t3mat('#4daa4c'), t3mat('#36883d')];
  for (let i = 0; i < 46; i++) {
    const x = (rr() - .5) * 90, z = -rr() * 80 + 14; if (Math.abs(x) < 6 && z > -16) continue;
    const s = .8 + rr() * .9, tg = new THREE.Group(); tg.position.set(x, 0, z); tg.scale.setScalar(s);
    const tk = new THREE.Mesh(new THREE.CylinderGeometry(.35, .5, 5, 6), trunk); tk.position.y = 2.5; tk.castShadow = true; tg.add(tk);
    const cr = new THREE.Mesh(new THREE.IcosahedronGeometry(2.4, 0), leaf[i % 3]); cr.position.y = 6.2; cr.castShadow = true; tg.add(cr);
    sc.add(tg);
  }
  const mtn = [t3mat('#4f8f6a'), t3mat('#5a9c78'), t3mat('#467f60')];
  for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.ConeGeometry(14 + rr() * 8, 16 + rr() * 12, 5), mtn[i % 3]); m.position.set(-70 + i * 18 + rr() * 6, 7, -75 - rr() * 10); sc.add(m); }
  // banane (posée sur deux bâtons)
  const ban = new THREE.Group();
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-2.6, .2, 0), new THREE.Vector3(0, -1.4, 0), new THREE.Vector3(2.6, .6, 0));
  const yel = t3mat('#f4cf4a');
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, .62, 7), yel); tube.castShadow = true; ban.add(tube);
  for (const [p, d] of [[curve.getPoint(0), -1], [curve.getPoint(1), 1]]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.18, .28, .5, 6), t3mat('#5a3e1c')); c.position.copy(p).add(new THREE.Vector3(d * .2, .1, 0)); c.rotation.z = -d * 1.1; ban.add(c); }
  for (const x of [-1.6, 1.8]) ban.add(t3cyl([x, -1.2, 0], [x * 1.2, -3.4, .4], .12, .12, trunk, 5));
  ban.position.set(.4, 3.0, -9.6); ban.rotation.y = .35;
  sc.add(ban);
  // texture « manquante » (damier magenta)
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const cx = cv.getContext('2d');
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { cx.fillStyle = (i + j) % 2 ? '#ff00dc' : '#14001a'; cx.fillRect(i * 8, j * 8, 8, 8); }
  const tex = new THREE.CanvasTexture(cv); tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(6, 1);
  const missing = new THREE.MeshBasicMaterial({ map: tex });
  const fly = t3Fly(); sc.add(fly);
  const cam = new THREE.PerspectiveCamera(42, 9 / 16, .1, 300);
  return { sc, cam, fly, ban, tube, yel, missing, sun };
}
// o : {t, walkZ (position de la mouche), walk (0..1 intensité), eat, glitch (0/1), cam: {dx, dy, dz, look}}
function t3WorldFrame(o, w, h) {
  if (!T3.S.world) T3.S.world = t3World();
  const S = T3.S.world, f = S.fly;
  f.position.set(o.x || 0, 0, o.walkZ || 0); f.rotation.y = o.yaw || 0;
  t3FlyAnim(f, o.t, o.walk ?? 1, o.eat || 0);
  S.tube.material = o.glitch ? S.missing : S.yel;
  S.missing.map.offset.x = (o.t * 3) % 1;
  const c = o.cam || {};
  S.cam.aspect = w / h; S.cam.fov = c.fov || 42; S.cam.updateProjectionMatrix();
  S.cam.position.set(f.position.x + (c.dx ?? 2.6), c.dy ?? 1.5, f.position.z + (c.dz ?? 3.8));
  S.cam.lookAt(f.position.x + (c.lx ?? 0), c.ly ?? .7, f.position.z + (c.lz ?? -1.4));
  S.sun.position.set(f.position.x - 8, 14, f.position.z + 6); S.sun.target.position.copy(f.position);
  const r = t3Renderer(w, h); r.render(S.sc, S.cam);
  return r.domElement.toDataURL('image/jpeg', .92);
}

// ---------- scan : mouche en fil de fer qui se construit, puis pleine ----------
function t3Scan() {
  const sc = new THREE.Scene(); sc.background = new THREE.Color('#081530');
  sc.add(new THREE.HemisphereLight('#bfe6ff', '#0a1a3a', 1.0));
  const dl = new THREE.DirectionalLight('#ffffff', .6); dl.position.set(3, 6, 4); sc.add(dl);
  const grid = new THREE.GridHelper(30, 30, '#3f7dff', '#1d3f8a'); sc.add(grid);
  const fly = t3Fly(); sc.add(fly);
  const wire = new THREE.MeshBasicMaterial({ color: '#63d8ff', wireframe: true });
  fly.userData.parts.forEach(m => { m.userData.solid = m.material; });
  const cam = new THREE.PerspectiveCamera(38, 9 / 16, .1, 100);
  return { sc, cam, fly, wire };
}
// o : {t, build (0..1 : pièces visibles), solid (0/1), rot}
function t3ScanFrame(o, w, h) {
  if (!T3.S.scan) T3.S.scan = t3Scan();
  const S = T3.S.scan, parts = S.fly.userData.parts, n = parts.length;
  parts.forEach((m, i) => { m.visible = i < Math.ceil((o.build ?? 1) * n); m.material = o.solid ? m.userData.solid : S.wire; });
  t3FlyAnim(S.fly, o.t, o.walk || 0, 0);
  S.fly.rotation.y = o.rot ?? o.t * .8;
  S.cam.aspect = w / h; S.cam.updateProjectionMatrix();
  S.cam.position.set(0, 4.6, 9.5); S.cam.lookAt(0, .7, 0);
  const r = t3Renderer(w, h); r.render(S.sc, S.cam);
  return r.domElement.toDataURL('image/jpeg', .9);
}
// image SVG d'une vue 3D
function img3(url, x, y, w, h, extra = '') { return `<image href="${url}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" preserveAspectRatio="none" ${extra}/>`; }
