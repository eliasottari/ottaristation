// ============================================================
//  VRAIE 3D (Three.js) — l'intérieur du corps : estomac (plis, acide, inflammation), œsophage,
//  bactéries H. pylori cartoon (spirale + flagelles + yeux), antibiotiques, champ de microscope.
//  Rendu par t3Renderer (fly3d.js) → data-URL → img3().
// ============================================================
const G3 = {};
const g3toon = (c, o = {}) => new THREE.MeshToonMaterial(Object.assign({ color: c }, o));
class G3Helix extends THREE.Curve {
  constructor(L = 2.2, a = .2, turns = 1.6) { super(); this.L = L; this.a = a; this.n = turns; }
  getPoint(t, v = new THREE.Vector3()) { const w = t * this.n * Math.PI * 2; return v.set((t - .5) * this.L, Math.cos(w) * this.a, Math.sin(w) * this.a); }
}
// une bactérie (tête vers +x). mood : 'evil' | 'happy' | 'chill' (lunettes de soleil)
function g3Bacterium(mood = 'evil', col = '#86d24f') {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const mat = g3toon(col), dark = new THREE.MeshBasicMaterial({ color: '#2b2420' });
  const curve = new G3Helix();
  body.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, .3, 12), mat));
  for (const t of [0, 1]) { const m = new THREE.Mesh(new THREE.SphereGeometry(.3, 16, 12), mat); m.position.copy(curve.getPoint(t)); body.add(m); }
  // flagelles
  const flag = new THREE.Group(); flag.position.copy(curve.getPoint(0)); g.add(flag);
  const fm = g3toon(shade(col, -.25));
  for (let i = 0; i < 4; i++) {
    const pts = []; for (let k = 0; k <= 12; k++) pts.push(new THREE.Vector3(-k * .13, Math.sin(k * .9) * .12, Math.cos(k * .9) * .04));
    const f = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, .045, 5), fm);
    f.rotation.x = i * Math.PI / 2; flag.add(f);
  }
  // visage (ne tourne pas avec la spirale)
  const face = new THREE.Group(); face.position.copy(curve.getPoint(1)); g.add(face);
  for (const sd of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(.17, 14, 10), new THREE.MeshBasicMaterial({ color: '#ffffff' })); e.position.set(.16, .14, sd * .14); face.add(e);
    const p = new THREE.Mesh(new THREE.SphereGeometry(.08, 10, 8), dark); p.position.set(.3, .13, sd * .14); face.add(p);
    const b = new THREE.Mesh(new THREE.BoxGeometry(.06, .05, .2), dark); b.position.set(.22, .34, sd * .15); b.rotation.x = sd * (mood === 'evil' ? -.5 : .35); face.add(b);
  }
  if (mood === 'chill') { const gl = new THREE.Mesh(new THREE.BoxGeometry(.08, .16, .5), dark); gl.position.set(.32, .14, 0); face.add(gl); }
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(.1, .025, 6, 12, Math.PI), dark); mouth.position.set(.3, -.06, 0); mouth.rotation.y = Math.PI / 2; mouth.rotation.z = mood === 'evil' || mood === 'chill' || mood === 'happy' ? Math.PI : 0; face.add(mouth);
  g.userData = { body, flag, face };
  return g;
}
function g3BactAnim(b, t, ph = 0, swim = 1) { b.userData.body.rotation.x = t * 9 * swim + ph; b.userData.flag.rotation.x = -t * 14 * swim + ph; b.userData.face.rotation.z = Math.sin(t * 3 + ph) * .1; }
function g3Pill() {
  const g = new THREE.Group();
  const a = g3toon('#e2463a'), b = g3toon('#f6f3ea');
  const c1 = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .7, 16), a); c1.position.y = .35; g.add(c1);
  const c2 = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .7, 16), b); c2.position.y = -.35; g.add(c2);
  const s1 = new THREE.Mesh(new THREE.SphereGeometry(.35, 16, 10), a); s1.position.y = .7; g.add(s1);
  const s2 = new THREE.Mesh(new THREE.SphereGeometry(.35, 16, 10), b); s2.position.y = -.7; g.add(s2);
  return g;
}

// ---------- l'estomac ----------
function g3Stomach() {
  const sc = new THREE.Scene(); sc.background = new THREE.Color('#3a0d16'); sc.fog = new THREE.Fog('#5a1422', 14, 40);
  const R0 = 16, geo = new THREE.SphereGeometry(R0, 120, 80);
  const pos = geo.attributes.position, base = [], cols = [];
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i).normalize();
    const lon = Math.atan2(v.z, v.x), lat = Math.asin(v.y);
    const ridge = Math.pow(Math.abs(Math.sin(lon * 13 + Math.sin(lat * 5) * 1.6)), 3);
    const k = 1 - .07 * ridge + .02 * Math.sin(lat * 23 + lon * 3);
    pos.setXYZ(i, v.x * R0 * k, v.y * R0 * k * .8, v.z * R0 * k);
    base.push(ridge); cols.push(1, 1, 1);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  geo.computeVertexNormals();
  const wall = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .28, metalness: 0, side: THREE.BackSide }));
  sc.add(wall);
  const acidGeo = new THREE.CircleGeometry(15, 80, 0, Math.PI * 2); acidGeo.rotateX(-Math.PI / 2);
  const acid = new THREE.Mesh(acidGeo, new THREE.MeshStandardMaterial({ color: '#93c44a', emissive: '#1e3a08', emissiveIntensity: .3, roughness: .08, transparent: true, opacity: .78 }));
  acid.position.y = -7; sc.add(acid);
  const bub = []; const bm = new THREE.MeshStandardMaterial({ color: '#efffa8', roughness: .1, transparent: true, opacity: .8 });
  for (let i = 0; i < 26; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.18 + (i % 4) * .08, 10, 8), bm); sc.add(m); bub.push(m); }
  sc.add(new THREE.AmbientLight('#ffb3c0', .45));
  const hemi = new THREE.HemisphereLight('#ffd6dd', '#c0607a', .35); sc.add(hemi);
  const lamp = new THREE.PointLight('#fff4e8', 1.4, 40, 1.2); sc.add(lamp);
  const cam = new THREE.PerspectiveCamera(60, 9 / 16, .05, 200);
  const bact = []; for (let i = 0; i < 40; i++) { const b = g3Bacterium(i % 7 === 3 ? 'chill' : i % 3 ? 'evil' : 'happy', ['#86d24f', '#9add5c', '#74c043'][i % 3]); b.visible = false; sc.add(b); bact.push(b); }
  const pills = []; for (let i = 0; i < 14; i++) { const p = g3Pill(); p.visible = false; sc.add(p); pills.push(p); }
  const boom = []; const pm = g3toon('#b8f070'); for (let i = 0; i < 60; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.09, 6, 5), pm); m.visible = false; sc.add(m); boom.push(m); }
  return { sc, cam, lamp, wall, geo, base, acid, acidGeo, bub, bact, pills, boom };
}
// o : {t, cam:{p:[x,y,z], l:[x,y,z], fov}, acid (niveau y), inflam 0..1, n (bactéries), mode:'swarm'|'settle'|'sizzle'|'die', die 0..1, pills 0..1}
function g3StomachFrame(o, w, h) {
  if (!G3.st) G3.st = g3Stomach();
  const S = G3.st, t = o.t;
  // couleurs (inflammation qui rougit)
  const ca = S.geo.attributes.color, pos = S.geo.attributes.position, inf = o.inflam || 0;
  if (S._inf !== inf) {
    S._inf = inf; const A = new THREE.Color('#f09aa8'), Bc = new THREE.Color('#ffd0d8'), Rd = new THREE.Color('#d0202f'), c = new THREE.Color();
    for (let i = 0; i < ca.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const n = .5 + .5 * Math.sin(x * .7 + z * .5) * Math.sin(y * .9 - x * .3 + z * .2);
      c.copy(A).lerp(Bc, S.base[i] * .6).lerp(Rd, clamp(inf * (n * 1.4 - .1)) * .9);
      ca.setXYZ(i, c.r, c.g, c.b);
    }
    ca.needsUpdate = true;
  }
  // acide qui ondule
  const ay = o.acid ?? -7; S.acid.position.y = ay; S.acid.visible = ay > -14;
  const ap = S.acidGeo.attributes.position; for (let i = 0; i < ap.count; i++) { const x = ap.getX(i), z = ap.getZ(i); ap.setY(i, Math.sin(x * .8 + t * 2.2) * .12 + Math.cos(z * .9 - t * 1.7) * .1); } ap.needsUpdate = true;
  S.bub.forEach((m, i) => { const k = (t * .35 + i * .137) % 1; const a = i * 2.39, rr = 2 + (i * 1.7) % 9; m.position.set(Math.cos(a) * rr, ay + k * 1.6, Math.sin(a) * rr); m.scale.setScalar(k < .9 ? 1 : (1 - k) * 10); m.visible = S.acid.visible; });
  // bactéries
  const n = o.n || 0, mode = o.mode || 'swarm', rr = rng(5);
  S.bact.forEach((b, i) => {
    b.visible = i < n; if (!b.visible) return;
    const r1 = rr(), r2 = rr(), r3 = rr(); let p;
    if (mode === 'swarm') { const a = t * (.25 + r1 * .3) + i * 1.3; p = [Math.cos(a) * (4 + r2 * 6), -3 + r3 * 7 + Math.sin(t + i) * .8, Math.sin(a) * (4 + r2 * 6)]; b.rotation.set(0, -a + Math.PI, Math.sin(t + i) * .3); }
    else if (mode === 'settle') { const a = i * 2.39996, lat = -.2 + (r2 - .5) * 1.1; const R = 13.2; p = [Math.cos(a) * Math.cos(lat) * R, Math.sin(lat) * R * .8, Math.sin(a) * Math.cos(lat) * R]; b.lookAt(0, 0, 0); b.rotateY(Math.PI / 2); b.rotateZ(Math.sin(t * 2 + i) * .3); }
    else if (mode === 'sizzle') { p = [0, ay + 4 - (o.fall || 0) * 4.2, -1]; b.rotation.set(0, -.6, Math.sin(t * 3) * .3 - (o.fall || 0) * .8); }
    else { const a = i * 2.39996; p = [Math.cos(a) * (3 + r2 * 5), ay + 3 + r3 * 3 - (o.fall || 0) * (3 + r3 * 4), Math.sin(a) * (3 + r2 * 5)]; b.rotation.set(0, a, Math.sin(t * 3 + i) * .4); }
    b.position.set(...p);
    const d = mode === 'die' ? clamp((o.die || 0) * 1.6 - r1 * .6) : 0;
    b.scale.setScalar((o.bs || 1) * (1 - d) * (mode === 'sizzle' ? 1 - clamp((o.fall || 0) * 1.3 - .3) : 1) + 1e-3);
    g3BactAnim(b, t, i, mode === 'settle' ? .3 : 1);
  });
  // antibiotiques qui tombent + explosions
  const pk = o.pills || 0;
  S.pills.forEach((p, i) => { const k = clamp(pk * 1.6 - i * .045); p.visible = k > 0 && k < 1; const a = i * 2.39996; p.position.set(Math.cos(a) * (2 + i % 5), 10 - k * 18, Math.sin(a) * (2 + i % 5)); p.rotation.set(t * 3 + i, t * 2, i); });
  S.boom.forEach((m, i) => { const k = clamp((o.die || 0) * 1.4 - (i % 10) * .05); m.visible = k > 0 && k < 1 && mode === 'die'; const b = S.bact[i % Math.max(1, n)]; if (!b) return; const a = i * 2.39996, e = i * 1.1; m.position.set(b.position.x + Math.cos(a) * Math.cos(e) * k * 3, b.position.y + Math.sin(e) * k * 3, b.position.z + Math.sin(a) * Math.cos(e) * k * 3); });
  const c = o.cam || {};
  S.cam.aspect = w / h; S.cam.fov = c.fov || 60; S.cam.updateProjectionMatrix();
  S.cam.position.set(...(c.p || [0, 2, 9])); S.cam.lookAt(...(c.l || [0, -2, 0]));
  S.lamp.position.copy(S.cam.position);
  const r = t3Renderer(w, h); r.render(S.sc, S.cam);
  return r.domElement.toDataURL('image/jpeg', .9);
}

// ---------- l'œsophage (on tombe dedans) ----------
function g3Tube() {
  const sc = new THREE.Scene(); sc.background = new THREE.Color('#2a0810'); sc.fog = new THREE.Fog('#2a0810', 4, 26);
  const pts = []; for (let i = 0; i <= 12; i++) pts.push(new THREE.Vector3(Math.sin(i * .7) * 1.5, -i * 3, Math.cos(i * .5) * 1.2));
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = new THREE.TubeGeometry(curve, 300, 2.4, 40), pos = geo.attributes.position;
  const ctr = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) { const seg = Math.floor(i / 41), u = seg / 300; curve.getPoint(u, ctr); const v = new THREE.Vector3().fromBufferAttribute(pos, i).sub(ctr); const ring = 1 - .12 * Math.pow(Math.abs(Math.sin(u * 120)), 4) - .05 * Math.sin(Math.atan2(v.y, v.x) * 8); v.multiplyScalar(ring); pos.setXYZ(i, ctr.x + v.x, ctr.y + v.y, ctr.z + v.z); }
  geo.computeVertexNormals();
  sc.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#e98896', roughness: .25, side: THREE.BackSide })));
  sc.add(new THREE.AmbientLight('#ffb0c0', .5));
  const lamp = new THREE.PointLight('#fff0e0', 1.6, 18, 1.3); sc.add(lamp);
  const cam = new THREE.PerspectiveCamera(70, 9 / 16, .05, 100);
  const bact = []; for (let i = 0; i < 12; i++) { const b = g3Bacterium(i % 2 ? 'evil' : 'happy'); sc.add(b); bact.push(b); }
  const drops = []; const dm = new THREE.MeshStandardMaterial({ color: '#7fbf3a', roughness: .1, transparent: true, opacity: .85 }); for (let i = 0; i < 30; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.15 + (i % 3) * .1, 10, 8), dm); sc.add(m); drops.push(m); }
  return { sc, cam, lamp, curve, bact, drops };
}
function g3TubeFrame(o, w, h) {
  if (!G3.tube) G3.tube = g3Tube();
  const S = G3.tube, t = o.t, u = clamp(o.u ?? t * .25, 0, .96);
  const p = S.curve.getPoint(u), l = S.curve.getPoint(Math.min(1, u + .04));
  S.cam.aspect = w / h; S.cam.updateProjectionMatrix(); S.cam.position.copy(p); S.cam.lookAt(l); S.cam.rotateZ(t * .6);
  S.lamp.position.copy(p);
  S.bact.forEach((b, i) => { const uu = Math.min(.99, u + .035 + i * .016 + Math.sin(t + i) * .004); const q = S.curve.getPoint(uu); const a = i * 2.4 + t; b.position.set(q.x + Math.cos(a) * 1.3, q.y, q.z + Math.sin(a) * 1.3); b.rotation.set(0, a, -Math.PI / 2 + Math.sin(t * 3 + i) * .3); b.scale.setScalar(.45); g3BactAnim(b, t, i); });
  S.drops.forEach((m, i) => { const uu = Math.min(.99, u + .01 + i * .007); const q = S.curve.getPoint(uu); const a = i * 1.7 + t * 2; m.position.set(q.x + Math.cos(a) * 1.6, q.y + Math.sin(t * 4 + i) * .3, q.z + Math.sin(a) * 1.6); });
  const r = t3Renderer(w, h); r.render(S.sc, S.cam);
  return r.domElement.toDataURL('image/jpeg', .9);
}

// ---------- champ de microscope (vu du dessus, fond clair) ----------
function g3Micro() {
  const sc = new THREE.Scene(); sc.background = new THREE.Color('#f4efd6');
  sc.add(new THREE.AmbientLight('#ffffff', .7)); const d = new THREE.DirectionalLight('#ffffff', .6); d.position.set(2, 6, 3); sc.add(d);
  const cells = []; const cm = g3toon('#f2b7c4', { transparent: true, opacity: .75 }), nm = g3toon('#b56a9a');
  for (let i = 0; i < 16; i++) { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.SphereGeometry(1.4, 24, 16), cm); c.scale.set(1, .25, 1); g.add(c); const nn = new THREE.Mesh(new THREE.SphereGeometry(.45, 16, 12), nm); nn.scale.set(1, .5, 1); nn.position.y = .15; g.add(nn); sc.add(g); cells.push(g); }
  const bact = []; for (let i = 0; i < 26; i++) { const b = g3Bacterium(i % 4 ? 'evil' : 'happy'); b.scale.setScalar(.55); sc.add(b); bact.push(b); }
  const cam = new THREE.PerspectiveCamera(40, 9 / 16, .1, 100);
  return { sc, cam, cells, bact };
}
function g3MicroFrame(o, w, h) {
  if (!G3.mi) G3.mi = g3Micro();
  const S = G3.mi, t = o.t, rr = rng(9), n = o.n ?? 26;
  S.cells.forEach((g, i) => { g.position.set((rr() - .5) * 12, -.6, (rr() - .5) * 20); g.rotation.y = rr() * 6; });
  S.bact.forEach((b, i) => { b.visible = i < n; const a = t * (.3 + rr() * .4) * (i % 2 ? 1 : -1) + rr() * 6, R = 1 + rr() * 6; b.position.set(Math.cos(a) * R + (rr() - .5) * 4, .2, Math.sin(a) * R + (rr() - .5) * 8); b.rotation.set(0, -a + (i % 2 ? Math.PI : 0), 0); g3BactAnim(b, t, i); });
  S.cam.aspect = w / h; S.cam.updateProjectionMatrix(); const z = o.zoom || 1; S.cam.position.set(0, 18 / z, .01); S.cam.lookAt(0, 0, 0);
  const r = t3Renderer(w, h); r.render(S.sc, S.cam);
  return r.domElement.toDataURL('image/jpeg', .9);
}
