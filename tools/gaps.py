#!/usr/bin/env python3
"""Détecte les phrases RATÉES par whisper (trou > 0,8 s entre deux mots alors que la voix parle) et les récupère.
usage (depuis l'épisode, après prep.py) :
  python3 ../tools/gaps.py           # liste les trous suspects
  python3 ../tools/gaps.py --fix     # retranscrit chaque trou avec le modèle medium et insère les mots dans words.json / words.js
Après --fix : ajoute la phrase affichée comme nouvelle ligne dans assets/blocks.txt (à sa place), puis prep.py --realign."""
import json, subprocess, sys
import numpy as np

GAP, DB, SR = .8, -35, 16000
fix = '--fix' in sys.argv
W = json.load(open('assets/words.json'))
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', 'assets/voix.mp3', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                                 capture_output=True, check=True).stdout, np.float32)

def loud(a, b):  # la voix parle-t-elle entre a et b ? (fenêtres de 100 ms)
    seg = x[int(a * SR):int(b * SR)]; win = int(SR * .1); n = len(seg) // win
    if n == 0: return False
    rms = np.sqrt(np.mean(seg[:n * win].reshape(n, win) ** 2, axis=1) + 1e-12)
    return (20 * np.log10(rms) > DB).sum() >= 3

gaps = [(W[i][1], W[i + 1][0]) for i in range(len(W) - 1) if W[i + 1][0] - W[i][1] > GAP and loud(W[i][1] + .05, W[i + 1][0] - .05)]
if not gaps: print('OK : aucune phrase ratée par la transcription'); sys.exit(0)
for a, b in gaps: print(f'trou suspect {a:.2f} → {b:.2f} s ({b - a:.2f} s de voix non transcrite)')
if not fix: print('→ relance avec --fix'); sys.exit(1)

from faster_whisper import WhisperModel
m = WhisperModel('medium', device='cpu', compute_type='int8')
for a, b in gaps:
    a0, b0 = max(0, a - .3), b + .3
    segs, _ = m.transcribe(x[int(a0 * SR):int(b0 * SR)], language='fr', word_timestamps=True, beam_size=5)
    new = [[round(w.start + a0, 2), round(w.end + a0, 2), w.word.strip()] for s in segs for w in s.words]
    new = [w for w in new if w[0] >= a - .05 and w[1] <= b + .05]
    if not new: print(f'{a:.2f}–{b:.2f} : rien de récupéré (bruit ?)'); continue
    W = sorted(W + new)
    print(f'{a:.2f}–{b:.2f} : AJOUTÉ « {" ".join(w[2] for w in new)} » → mets cette phrase dans assets/blocks.txt puis prep.py --realign')
json.dump(W, open('assets/words.json', 'w'), ensure_ascii=False)
open('words.js', 'w').write('const WORDS=' + json.dumps(W, ensure_ascii=False) + ';\n')
