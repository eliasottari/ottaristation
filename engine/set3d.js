// ============================================================
//  DÉCORS 3D (Three.js) + PERSOS 2D projetés dedans = vraie 2,5D
//  - décors en volumes « cartoon » : ombrage en 3 tons (toon) + contour noir (coque inversée)
//  - view = set3(name, cam, w, h) → { img (svg <image>), P(x,y,z) → [sx, sy, depth], ppm(depth) }
//  - hum3(view, X, Z, o, t, hM) : pose un perso person() (lib.js) au sol, à la bonne taille (hM mètres)
//  Charger après vendor/three.min.js, lib.js, fly3d.js (t3Renderer).
// ============================================================
const SET3 = {};
let _toonGrad;
function s3mat(c, o = {}) {
  if (!_toonGrad) { const d = new Uint8Array([90, 170, 255]); _toonGrad = new THREE.DataTexture(d, 3, 1, THREE.RedFormat); _toonGrad.minFilter = _toonGrad.magFilter = THREE.NearestFilter; _toonGrad.needsUpdate = true; }
  return new THREE.MeshToonMaterial(Object.assign({ color: c, gradientMap: _toonGrad }, o));
}
const S3_OL = new THREE.MeshBasicMaterial({ color: '#2b2420', side: THREE.BackSide });
// boîte avec contour. p = centre [x,y,z] ; size [w,h,d]
function s3box(parent, size, p, col, o = {}) {
  const g = new THREE.BoxGeometry(...size), m = new THREE.Mesh(g, o.mat || s3mat(col));
  m.position.set(...p); if (o.rot) m.rotation.set(...o.rot);
  parent.add(m);
  if (o.ol !== false) { const k = o.olw ?? .03; const ol = new THREE.Mesh(new THREE.BoxGeometry(size[0] + k * 2, size[1] + k * 2, size[2] + k * 2), S3_OL); m.add(ol); }
  return m;
}
function s3cyl(parent, r0, r1, h, p, col, o = {}) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, o.seg || 16), o.mat || s3mat(col)); m.position.set(...p); if (o.rot) m.rotation.set(...o.rot); parent.add(m);
  if (o.ol !== false) { const k = o.olw ?? .03; m.add(new THREE.Mesh(new THREE.CylinderGeometry(r0 + k, r1 + k, h + k * 2, o.seg || 16), S3_OL)); }
  return m;
}
function s3sph(parent, r, p, col, o = {}) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), o.mat || s3mat(col)); m.position.set(...p); if (o.scale) m.scale.set(...o.scale); parent.add(m);
  if (o.ol !== false) { const ol = new THREE.Mesh(new THREE.SphereGeometry(r * (1 + (o.olk || .06)), 20, 14), S3_OL); m.add(ol); }
  return m;
}
// texte / image plaqué (canvas) sur un plan
function s3label(parent, w, h, p, draw, o = {}) {
  const cv = document.createElement('canvas'); cv.width = o.pw || 512; cv.height = Math.round(cv.width * h / w); const cx = cv.getContext('2d'); draw(cx, cv.width, cv.height);
  const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.LinearEncoding;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: !!o.transparent }));
  m.position.set(...p); if (o.rot) m.rotation.set(...o.rot); parent.add(m); m.userData.cx = cx; m.userData.tex = tex; m.userData.draw = draw; return m;
}
function s3lights(sc, o = {}) {
  sc.add(new THREE.HemisphereLight(o.sky || '#ffffff', o.ground || '#8a7a6a', o.hemi ?? .55));
  const d = new THREE.DirectionalLight('#ffffff', o.dir ?? .75); d.position.set(...(o.dpos || [3, 8, 4])); sc.add(d);
  sc.add(new THREE.AmbientLight('#ffffff', o.amb ?? .15));
}
function s3floorTiles(parent, w, d, step, c1, c2, z0 = 0) {
  const g = new THREE.PlaneGeometry(w, d, Math.round(w / step), Math.round(d / step)).toNonIndexed(); g.rotateX(-Math.PI / 2);
  const cols = [], A = new THREE.Color(c1), B = new THREE.Color(c2), nx = Math.round(w / step);
  for (let i = 0; i < g.attributes.position.count / 6; i++) { const c = ((i % nx) + Math.floor(i / nx)) % 2 ? A : B; for (let k = 0; k < 6; k++) cols.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true })); m.position.set(0, 0, z0 + d / 2); parent.add(m); return m;
}

// ---------- rendu + projection ----------
// cam = {p:[x,y,z], l:[x,y,z], fov, roll}
function set3(name, cam, w = W, h = H, upd) {
  if (!SET3[name]) SET3[name] = SET3_BUILD[name]();
  const S = SET3[name];
  if (upd) upd(S);
  const c = S.cam || (S.cam = new THREE.PerspectiveCamera(50, w / h, .05, 400));
  c.aspect = w / h; c.fov = cam.fov || 50; c.updateProjectionMatrix();
  c.position.set(...cam.p); c.lookAt(...cam.l); if (cam.roll) c.rotateZ(R(cam.roll));
  c.updateMatrixWorld();
  const r = t3Renderer(w, h); r.render(S.sc, c);
  const url = r.domElement.toDataURL('image/jpeg', .9);
  const fpx = (H / 2) / Math.tan(R(c.fov / 2)), v = new THREE.Vector3();
  const inv = c.matrixWorldInverse;
  return {
    img: `<image href="${url}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none"/>`,
    P: (x, y, z) => { v.set(x, y, z).applyMatrix4(inv); const d = -v.z; v.set(x, y, z).project(c); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, d]; },
    ppm: (d) => fpx / Math.max(d, .05),
  };
}
// hauteur naturelle (px) d'un person() selon son gabarit
function humPx(o) { const A = Object.assign({}, AGE[o.age || 'adult'], o.A || {}); return A.legL + A.bodyH + (A.hr || 92) * 1.82; }
// perso posé au sol (X, Z), hauteur réelle hM (m)
function hum3(view, X, Z, o, t, hM = 1.7, Y = 0) {
  const [sx, sy, d] = view.P(X, Y, Z); if (d < .1) return '';
  const k = view.ppm(d) * hM / humPx(o);
  return G(tr(sx, sy, k), person(Object.assign({ age: 'adult' }, o, { x: 0, y: 0, s: 1 }), t));
}
// n'importe quel SVG posé à un point 3D, taille en mètres (unit = px du SVG pour 1 m)
function at3(view, X, Y, Z, svg, unit = 300, r = 0) { const [sx, sy, d] = view.P(X, Y, Z); if (d < .1) return ''; return G(tr(sx, sy, view.ppm(d) / unit, r), svg); }

// ============================================================
//  LES DÉCORS
// ============================================================
const SET3_BUILD = {
  // ---------- salle de concert ----------
  concert() {
    const sc = new THREE.Scene(); sc.background = new THREE.Color('#120a24'); sc.fog = new THREE.Fog('#1a0f33', 14, 45);
    s3lights(sc, { sky: '#a080ff', ground: '#200a30', hemi: .5, dir: .5 });
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), s3mat('#2a1d44')); fl.rotation.x = -Math.PI / 2; sc.add(fl);
    s3box(sc, [14, 1.4, 5], [0, .7, 16], '#3a2a55');
    s3box(sc, [12, 5, .3], [0, 4.2, 18.4], '#1a1030');
    const scr = s3label(sc, 9, 4.2, [0, 4.4, 18.2], (cx, w, h) => { const g = cx.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#ff4fd8'); g.addColorStop(1, '#4fc3ff'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); cx.fillStyle = '#fff'; cx.font = 'bold 120px Fredoka, sans-serif'; cx.textAlign = 'center'; cx.fillText('★ LIVE ★', w / 2, h / 2 + 40); }, { rot: [0, Math.PI, 0] });
    for (const x of [-6.5, 6.5]) { s3box(sc, [.4, 7, .4], [x, 3.5, 16], '#444'); for (let i = 0; i < 3; i++) s3box(sc, [1.2, 1.4, 1], [x, 1.5 + i * 1.5, 15.5], '#222'); }
    s3box(sc, [14, .4, .4], [0, 7, 16], '#444');
    const beams = []; const bm = new THREE.MeshBasicMaterial({ color: '#ffe8a0', transparent: true, opacity: .14, side: THREE.DoubleSide, depthWrite: false });
    for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.ConeGeometry(1.6, 9, 20, 1, true), bm.clone()); b.position.set(-5 + i * 2, 2.8, 15.5); sc.add(b); beams.push(b); }
    // foule (têtes et épaules low-poly)
    const crowd = []; const rr = rng(4); const skins = ['#f2c9a0', '#e0a878', '#c98e62', '#8d5a3a', '#f6d7b8'], tops = ['#e2463a', '#3f7df0', '#2fa36b', '#f2b632', '#9b6fd6', '#333', '#ff6fa5'];
    for (let row = 0; row < 16; row++) for (let i = 0; i < 12; i++) {
      const g = new THREE.Group(); const x = -7 + i * 1.25 + (row % 2) * .6 + (rr() - .5) * .3, z = -5.5 + row * 1.2, hh = 1.45 + rr() * .35;
      if (Math.abs(x) < 1.7 && Math.abs(z - 1) < 1.6) continue;
      g.position.set(x, 0, z); sc.add(g);
      s3cyl(g, .28, .34, hh - .3, [0, (hh - .3) / 2, 0], tops[(row + i * 3) % 7], { ol: false });
      s3sph(g, .22, [0, hh, 0], skins[(i + row) % 5], { olk: .05 });
      if (rr() < .4) s3box(g, [.08, .5, .08], [.3, hh + .1, 0], skins[(i + row) % 5], { ol: false, rot: [0, 0, -.4] });
      crowd.push(g);
    }
    return { sc, beams, crowd, scr, hideNear(p, r = 1.4) { crowd.forEach(g => { g.visible = Math.hypot(g.position.x - p[0], g.position.z - p[2]) > r; }); }, anim(t) { beams.forEach((b, i) => { b.rotation.z = Math.sin(t * 1.3 + i) * .5; b.rotation.x = -.5 + Math.cos(t * .9 + i) * .3; b.material.opacity = .1 + .08 * Math.sin(t * 6 + i * 2); b.material.color.setHSL(((t * .1 + i * .15) % 1), .8, .7); }); crowd.forEach((g, i) => { g.position.y = Math.max(0, Math.sin(t * 7 + i * 1.7)) * .12; }); } };
  },
  // ---------- rayon de supermarché ----------
  market() {
    const sc = new THREE.Scene(); sc.background = new THREE.Color('#f4f0e6');
    s3lights(sc, { hemi: .7, dir: .6, dpos: [2, 10, -3] });
    s3floorTiles(sc, 8, 40, .8, '#e9e6de', '#d9d5cb', -8);
    s3box(sc, [8, .1, 40], [0, 5, 12], '#ffffff', { ol: false });
    for (let z = -6; z < 30; z += 4) s3box(sc, [.6, .05, 2.4], [0, 4.94, z], '#fffbe0', { ol: false, mat: new THREE.MeshBasicMaterial({ color: '#fffbe0' }) });
    const boxes = ['#e2463a', '#f2b632', '#3f7df0', '#2fa36b', '#ff6fa5', '#9b6fd6', '#f08a24'];
    const rr = rng(7); let cereal;
    for (const sd of [-1, 1]) {
      const x = sd * 2.2;
      s3box(sc, [1.0, 3.2, 36], [x + sd * .2, 1.6, 12], '#c9ced6');
      for (let lv = 0; lv < 5; lv++) {
        const y = .15 + lv * .66;
        s3box(sc, [1.1, .06, 36], [x, y, 12], '#aeb5c0', { olw: .015 });
        for (let z = -5.5; z < 29.5; z += .42) { const hh = .34 + rr() * .2; const col = boxes[Math.floor(rr() * 7)]; s3box(sc, [.32, hh, .36], [x - sd * .2, y + .03 + hh / 2, z], col, { olw: .012 }); }
      }
    }
    // la boîte de céréales star, étagère du haut (côté gauche, z = 4)
    cereal = s3label(sc, .5, .7, [-1.85, 3.0, 4], (cx, w, h) => { cx.fillStyle = '#ffcf3f'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#e2463a'; cx.fillRect(0, 0, w, h * .3); cx.fillStyle = '#fff'; cx.font = 'bold 90px Fredoka, sans-serif'; cx.textAlign = 'center'; cx.fillText('CHOCO', w / 2, h * .22); cx.fillStyle = '#7a3a1a'; for (let i = 0; i < 9; i++) { cx.beginPath(); cx.arc(w * (.2 + (i % 3) * .3), h * (.5 + Math.floor(i / 3) * .15), 34, 0, 7); cx.fill(); } }, { rot: [0, Math.PI / 2, 0] });
    s3box(sc, [.5, .7, .14], [-1.95, 3.0, 4], '#ffcf3f', { olw: .02 });
    s3label(sc, 2.6, .6, [0, 4.2, 25], (cx, w, h) => { cx.fillStyle = '#e2463a'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#fff'; cx.font = `bold ${Math.round(h * .7)}px Fredoka, sans-serif`; cx.textAlign = 'center'; cx.fillText('CÉRÉALES', w / 2, h * .78); }, { rot: [0, Math.PI, 0] });
    return { sc, cereal };
  },
  // ---------- cabine d'avion ----------
  plane() {
    const sc = new THREE.Scene(); sc.background = new THREE.Color('#dfe6ee');
    s3lights(sc, { hemi: .75, dir: .45, dpos: [-4, 6, 2] });
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(6, 40), s3mat('#5a6a8a')); fl.rotation.x = -Math.PI / 2; fl.position.z = 12; sc.add(fl);
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 40, 32, 1, true, 0, Math.PI * 2), s3mat('#eef1f5', { side: THREE.BackSide })); shell.rotation.x = Math.PI / 2; shell.position.set(0, 1.2, 12); sc.add(shell);
    s3box(sc, [.4, .1, 40], [0, .01, 12], '#c0202f', { ol: false });
    for (let z = 0; z < 30; z += .95) for (const x of [-1.5, -.95, .95, 1.5]) {
      const g = new THREE.Group(); g.position.set(x, 0, z); sc.add(g);
      s3box(g, [.5, .45, .5], [0, .45, 0], '#2f4a8a', { olw: .02 }); s3box(g, [.5, .85, .12], [0, 1.05, .25], '#2f4a8a', { olw: .02 }); s3box(g, [.32, .18, .1], [0, 1.4, .25], '#e8eef4', { olw: .015 });
    }
    for (let z = 0; z < 30; z += 1.9) for (const sd of [-1, 1]) { const w = s3box(sc, [.05, .45, .32], [sd * 2.05, 1.45, z], '#bfe6ff', { olw: .02 }); w.rotation.z = sd * .25; }
    for (const sd of [-1, 1]) s3box(sc, [1.1, .4, 30], [sd * 1.55, 2.6, 15], '#f6f7f9', { olw: .02 });
    return { sc };
  },
  // ---------- l'ADN (hologramme) ----------
  dna() {
    const sc = new THREE.Scene(); sc.background = new THREE.Color('#0d1a3a');
    s3lights(sc, { sky: '#bfe6ff', ground: '#10204a', hemi: .8, dir: .5 });
    const g = new THREE.Group(); sc.add(g); const cols = ['#ff6fa5', '#5ec4f0', '#ffd23f', '#7be07b'];
    for (let i = 0; i < 26; i++) { const y = -6 + i * .48, a = i * .52; const p1 = [Math.cos(a) * 1.4, y, Math.sin(a) * 1.4], p2 = [-p1[0], y, -p1[2]]; s3sph(g, .28, p1, '#cfe6ff'); s3sph(g, .28, p2, '#cfe6ff'); const c = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, 2.8, 8), s3mat(cols[i % 4])); c.position.set(0, y, 0); c.rotation.z = Math.PI / 2; c.rotation.y = -a; g.add(c); }
    const grid = new THREE.GridHelper(30, 30, '#3f7dff', '#1d3f8a'); grid.position.y = -6.5; sc.add(grid);
    return { sc, g, anim(t) { g.rotation.y = t * .8; } };
  },
  // ---------- avion vu de l'extérieur (atterrissage) ----------
  sky() {
    const sc = new THREE.Scene(); sc.background = new THREE.Color('#8fd0ff'); sc.fog = new THREE.Fog('#cfeeff', 40, 160);
    s3lights(sc, { hemi: .8, dir: .7, dpos: [5, 10, 5] });
    const gr = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), s3mat('#7cc95a')); gr.rotation.x = -Math.PI / 2; sc.add(gr);
    s3box(sc, [6, .05, 200], [0, .03, 0], '#5a5f68', { ol: false });
    for (let z = -90; z < 100; z += 8) s3box(sc, [.3, .06, 3], [0, .05, z], '#fff', { ol: false });
    const pl = new THREE.Group(); sc.add(pl);
    s3cyl(pl, .9, .9, 9, [0, 0, 0], '#ffffff', { rot: [Math.PI / 2, 0, 0], seg: 20 });
    s3sph(pl, .9, [0, 0, 4.5], '#ffffff', { scale: [1, 1, 1.6] });
    s3box(pl, [11, .2, 1.8], [0, -.2, .3], '#e9eef4'); s3box(pl, [3.6, .15, .9], [0, .2, -4.2], '#e9eef4'); s3box(pl, [.15, 2, 1.4], [0, 1.2, -4.2], '#c0202f');
    for (const sd of [-1, 1]) s3cyl(pl, .35, .35, 1.4, [sd * 2.6, -.6, .6], '#c9ced6', { rot: [Math.PI / 2, 0, 0] });
    for (let i = 0; i < 8; i++) s3sph(pl, .12, [.9, .25, 2.8 - i * .8], '#5ec4f0', { olk: .2 });
    const smoke = []; for (let i = 0; i < 10; i++) { const m = s3sph(sc, .8, [0, 0, 0], '#ffffff', { ol: false }); smoke.push(m); }
    for (let i = 0; i < 12; i++) { const c = s3sph(sc, 4 + (i % 3), [-60 + i * 11, 30 + (i % 4) * 4, 60 + (i % 5) * 10], '#ffffff', { ol: false, scale: [2, .8, 1] }); }
    return { sc, pl, smoke };
  },
};

// perso posé dans un décor 3D-lite (cam3/room3 de flow/toon)
function humL(c, X, Z, o, t, hM = 1.7, Y = 0) { const oo = Object.assign({ age: 'adult' }, o, { x: 0, y: 0, s: 1 }); return sprite3(c, X, Y, Z, person(oo, t), humPx(oo) / hM); }
