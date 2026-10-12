#!/usr/bin/env python3
"""Préparation d'un épisode : voix -> transcription mot à mot -> blocs -> calage.
usage (depuis le dossier de l'épisode) :
  python3 ../tools/prep.py <voix.mp3|wav>            # blocs = phrases de la transcription (si pas de assets/blocks.txt)
  python3 ../tools/prep.py <voix> --model medium      # transcription plus précise (plus lent)
  python3 ../tools/prep.py --realign                  # après avoir corrigé assets/blocks.txt : recalcule seulement le calage
Écrit : assets/voix.mp3, assets/words.json, words.js (WORDS), assets/blocks.txt (1 bloc / ligne), timing.js (TOTAL, BT).
"""
import json, os, re, subprocess, sys, unicodedata, difflib

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    return re.findall(r"[a-z0-9]+", ''.join(c for c in s if unicodedata.category(c) != 'Mn'))

def transcribe(src, model):
    import numpy as np
    from faster_whisper import WhisperModel
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
    m = WhisperModel(model, device='cpu', compute_type='int8')
    segs, _ = m.transcribe(np.frombuffer(raw, np.float32), language='fr', word_timestamps=True, beam_size=5)
    return [[round(w.start, 2), round(w.end, 2), w.word.strip()] for s in segs for w in s.words]

def sentences(W):
    out, cur = [], []
    for a, b, t in W:
        cur.append(t)
        if re.search(r'[.?!…]$', t): out.append(' '.join(cur)); cur = []
    if cur: out.append(' '.join(cur))
    return [re.sub(r"\s+'", "'", re.sub(r"\s+([,.?!])", r"\1", s)) for s in out]

def align(W, blocks):
    wt, wi = [], []
    for i, (a, b, t) in enumerate(W):
        for x in norm(t): wt.append(x); wi.append(i)
    bt, bi = [], []
    for k, l in enumerate(blocks):
        for x in norm(l): bt.append(x); bi.append(k)
    first = {}
    for a, b, size in difflib.SequenceMatcher(None, bt, wt, autojunk=False).get_matching_blocks():
        for j in range(size):
            first.setdefault(bi[a + j], W[wi[b + j]][0])
    BT, last = [], 0
    for k in range(len(blocks)):
        v = round(max(0, first[k] - .2), 2) if k in first else None
        if v is None or v < last: v = last + .3  # bloc non retrouvé : juste après le précédent
        BT.append(v); last = v
    BT[0] = 0
    return BT

def main():
    args = sys.argv[1:]
    model = 'small'
    if '--model' in args: i = args.index('--model'); model = args[i + 1]; del args[i:i + 2]
    os.makedirs('assets', exist_ok=True)
    if '--realign' not in args:
        src = args[0]
        if os.path.abspath(src) != os.path.abspath('assets/voix.mp3'):
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-c:a', 'libmp3lame', '-q:a', '2', 'assets/voix.mp3'], check=True)
        print('transcription (faster-whisper', model, ')…', flush=True)
        W = transcribe('assets/voix.mp3', model)
        json.dump(W, open('assets/words.json', 'w'), ensure_ascii=False)
        open('words.js', 'w').write('const WORDS=' + json.dumps(W, ensure_ascii=False) + ';\n')
    W = json.load(open('assets/words.json'))
    if not os.path.exists('assets/blocks.txt'):
        open('assets/blocks.txt', 'w').write('\n'.join(sentences(W)) + '\n')
    blocks = [l.strip() for l in open('assets/blocks.txt') if l.strip()]
    BT = align(W, blocks)
    TOTAL = round(W[-1][1] + .6, 2)
    open('timing.js', 'w').write(f'const TOTAL = {TOTAL};\nconst BT = {json.dumps(BT + [TOTAL])};\n')
    print(f'\nTOTAL = {TOTAL} s, {len(blocks)} blocs\n')
    for k, l in enumerate(blocks):
        end = BT[k + 1] if k + 1 < len(BT) else TOTAL
        print(f'B{k + 1:03d}  {BT[k]:6.2f} → {end:6.2f}  ({end - BT[k]:4.2f} s)  {l}')

if __name__ == '__main__':
    main()
