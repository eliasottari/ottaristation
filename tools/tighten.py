#!/usr/bin/env python3
"""Resserre une voix off pour TikTok : chaque silence > MIN s est réduit à KEEP s (les phrases s'enchaînent).
usage : python3 tools/tighten.py entree.mp3 sortie.mp3 [--keep 0.12] [--min 0.18] [--db -38]
Les débuts/fins sont rognés à 0,05 s. Fondu de 8 ms à chaque coupe (pas de clic)."""
import subprocess, sys, numpy as np
args = sys.argv[1:]
def opt(name, d):
    if name in args: i = args.index(name); v = float(args[i + 1]); del args[i:i + 2]; return v
    return d
KEEP, MIN, DB = opt('--keep', .12), opt('--min', .18), opt('--db', -38)
src, dst = args[0], args[1]
SR = 44100
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout, np.float32).copy()
win = int(SR * .01); n = len(x) // win
rms = np.sqrt(np.mean(x[:n * win].reshape(n, win) ** 2, axis=1) + 1e-12)
loud = 20 * np.log10(rms) > DB
# segments silencieux (en fenêtres de 10 ms)
segs, i = [], 0
while i < n:
    if not loud[i]:
        j = i
        while j < n and not loud[j]: j += 1
        segs.append((i, j)); i = j
    else: i += 1
fade = int(SR * .008); out = []; pos = 0; removed = 0
for a, b in segs:
    a_s, b_s = a * win, b * win; dur = (b - a) * win / SR
    if a == 0: keep = .05
    elif b >= n: keep = .05
    elif dur > MIN: keep = KEEP
    else: continue
    k = int(keep * SR)
    cut0, cut1 = a_s + k // 2, b_s - k // 2   # garde k/2 après la fin de parole et k/2 avant la reprise
    if cut1 <= cut0: continue
    seg = x[pos:cut0].copy()
    if len(seg) > fade: seg[-fade:] *= np.linspace(1, 0, fade)
    out.append(seg); pos = cut1; removed += (cut1 - cut0) / SR
    if pos + fade < len(x): x[pos:pos + fade] *= np.linspace(0, 1, fade)
out.append(x[pos:])
y = np.concatenate(out)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'libmp3lame', '-q:a', '2', dst], input=y.astype(np.float32).tobytes(), check=True)
print(f'{len(x) / SR:.2f} s -> {len(y) / SR:.2f} s ({removed:.2f} s de silences retirés)')
