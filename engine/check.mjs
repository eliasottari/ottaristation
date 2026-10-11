import { createRequire } from 'module'; import { execSync } from 'child_process'; import path from 'path';
const { chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + path.resolve('index.html'));
const r = await p.evaluate(() => { const out = []; SCENES.forEach((sc, i) => { const e = SCENES[i + 1] ? SCENES[i + 1].s : TOTAL; for (const k of [.05, .5, .95]) { const T = sc.s + (e - sc.s) * k; try { renderFrame(T); if (/NaN|undefined/.test(stage.innerHTML)) out.push(['nan', sc.n, T.toFixed(2), (stage.innerHTML.match(/.{60}(NaN|undefined).{20}/) || [''])[0]]); } catch (x) { out.push(['err', sc.n, T.toFixed(2), x.message]); } } }); return [SCENES.length, out, getCues().cues.length]; });
console.log(JSON.stringify(r, null, 1).slice(0, 3000), errs.slice(0, 5));
await b.close();
