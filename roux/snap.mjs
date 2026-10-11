// usage: node snap.mjs out.png t1 t2 ...  -> planche contact
import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
import path from 'path';
const [out, ...ts] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(()=>chromium.launch());
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs=[]; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
await p.goto('file://' + path.resolve('index.html'));
await p.evaluate(() => document.fonts.ready);
const files = [];
for (const [i, t] of ts.entries()) { await p.evaluate(t => renderFrame(t), +t); const f = `/tmp/claude-0/-home-user-ottaristation/7a5acb2b-c3bc-5114-9346-982522533dbc/scratchpad/snap_${i}.png`; await p.screenshot({ path: f }); files.push(f); }
await b.close();
if (errs.length) console.log('ERR', errs.slice(0,5));
const cols = Math.min(files.length, 6), rows = Math.ceil(files.length / cols);
const inputs = files.flatMap(f => ['-i', f]);
const fc = files.map((_, i) => `[${i}:v]scale=360:-1[v${i}]`).join(';') + ';' + files.map((_, i) => `[v${i}]`).join('') + (files.length > 1 ? `xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % cols) * 360}_${Math.floor(i / cols) * 640}`).join('|')}:fill=black` : 'null');
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', fc, '-frames:v', '1', out]);
console.log('ok', out);
