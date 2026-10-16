// Rendu image par image (30 fps) en parallèle -> segments mp4 -> concat + audio mixé
import { createRequire } from 'module';
import { execSync } from 'child_process';
// playwright : local (engine/node_modules) sinon installation globale de l'environnement
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { chromium = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright').chromium; }
const launch = () => chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
import { spawn, execFileSync } from 'child_process';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const ENGINE = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30, WORKERS = +(process.env.WORKERS || 4);
const OUT = process.argv[2] || 'out/roux_9x16.mp4';
const VOICE = process.argv[3];
fs.mkdirSync('out/tmp', { recursive: true });
const browser = await launch();
const probe = await browser.newPage();
await probe.goto('file://' + path.resolve('index.html'));
const TOTAL = await probe.evaluate(() => TOTAL);
const [SW_, SH_] = await probe.evaluate(() => [W, H]);
fs.writeFileSync('out/tmp/cues.json', JSON.stringify(await probe.evaluate(() => getCues())));
await probe.close();
const N = Math.round(TOTAL * FPS);
const SKIPVIDEO = !!process.env.AUDIO_ONLY && fs.existsSync('out/tmp/video.mp4');
const chunk = Math.ceil(N / WORKERS);
let done = 0;
async function work(w) {
  const a = w * chunk, b = Math.min(N, a + chunk);
  const p = await browser.newPage({ viewport: { width: SW_, height: SH_ } });
  p.on('pageerror', e => console.error('pageerror', e.message));
  await p.goto('file://' + path.resolve('index.html'));
  await p.evaluate(() => (window.fontsReady || Promise.resolve()).then(() => document.fonts.ready));
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-g', '60', '-pix_fmt', 'yuv420p', `out/tmp/seg${w}.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = a; f < b; f++) {
    await p.evaluate(t => renderFrame(t), f / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (++done % 150 === 0) console.log(`${done}/${N}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await p.close();
}
if (!SKIPVIDEO) {
  await Promise.all(Array.from({ length: WORKERS }, (_, w) => work(w)));
  fs.writeFileSync('out/tmp/list.txt', Array.from({ length: WORKERS }, (_, w) => `file 'seg${w}.mp4'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', 'out/tmp/list.txt', '-c', 'copy', 'out/tmp/video.mp4'], { stdio: 'inherit' });
}
await browser.close();
if (VOICE) {
  if (!process.env.NOMIX) execFileSync('python3', [path.join(ENGINE, 'sfx.py'), 'mix', 'out/tmp/cues.json', VOICE, 'out/tmp/mix.wav', String(TOTAL)], { stdio: 'inherit' });
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'out/tmp/video.mp4', '-i', 'out/tmp/mix.wav', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', OUT], { stdio: 'inherit' });
}
console.log('OK ->', OUT);
