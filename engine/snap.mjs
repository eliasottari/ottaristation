// usage: node snap.mjs out.png t1 t2 ...  -> planche contact
import { createRequire } from 'module';
import { execSync } from 'child_process';
// playwright : local (engine/node_modules) sinon installation globale de l'environnement
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { chromium = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright').chromium; }
const launch = () => chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
import { execFileSync } from 'child_process';
import path from 'path';
const [out, ...ts] = process.argv.slice(2);
const b = await launch();
const probe = await b.newPage(); await probe.goto('file://' + path.resolve('index.html'));
const [SW_, SH_] = await probe.evaluate(() => [W, H]); await probe.close();
const TW = SW_ > SH_ ? 640 : 360, TH = Math.round(TW * SH_ / SW_);
const p = await b.newPage({ viewport: { width: SW_, height: SH_ } });
const errs=[]; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
await p.goto('file://' + path.resolve('index.html'));
await p.evaluate(() => document.fonts.ready);
if (process.env.GUIDE) await p.evaluate(() => { window.GUIDE = true; });
// arguments : temps en secondes, ou « B12 » (tous les sous-plans du bloc 12 à 60 %) / « B12:.3 » (à 30 %)
const times = [];
for (const a of ts) {
  if (a[0] !== 'B') { times.push(+a); continue; }
  const [b, f] = a.slice(1).split(':');
  times.push(...await p.evaluate(([n, k]) => { const out = []; SCENES.forEach((sc, i) => { if (sc.n === n) { const e = SCENES[i + 1] ? SCENES[i + 1].s : TOTAL; out.push(sc.s + (e - sc.s) * k); } }); return out; }, [+b, f ? +f : .6]));
}
const files = [];
for (const [i, t] of times.entries()) { await p.evaluate(t => renderFrame(t), +t); const f = `/tmp/claude-0/-home-user-ottaristation/7a5acb2b-c3bc-5114-9346-982522533dbc/scratchpad/snap_${process.pid}_${i}.png`; await p.screenshot({ path: f }); files.push(f); }
await b.close();
if (errs.length) console.log('ERR', errs.slice(0,5));
const cols = Math.min(files.length, SW_ > SH_ ? 4 : 6), rows = Math.ceil(files.length / cols);
const inputs = files.flatMap(f => ['-i', f]);
const fc = files.map((_, i) => `[${i}:v]scale=${TW}:-1[v${i}]`).join(';') + ';' + files.map((_, i) => `[v${i}]`).join('') + (files.length > 1 ? `xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % cols) * TW}_${Math.floor(i / cols) * TH}`).join('|')}:fill=black` : 'null');
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', fc, '-frames:v', '1', out]);
console.log('ok', out);
