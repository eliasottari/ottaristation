"""Synthèse procédurale des bruitages + mixage avec la voix.

usage:
  python3 sfx.py mix cues.json voice.mp3 out.wav [duree]
  python3 sfx.py preview            -> sfx_preview/*.wav
"""
import json, subprocess, sys, os, wave
import numpy as np

SR = 44100
SFX_GAIN = .2
rs = np.random.default_rng(7)


def T(d):
    return np.arange(int(SR * d)) / SR


def env(d, a=0.005, decay=None, hold=0.0):
    t = T(d)
    e = np.clip(t / max(a, 1e-4), 0, 1)
    if decay:
        e *= np.exp(-np.clip(t - a - hold, 0, None) / decay)
    return e


def sweep(f0, f1, d, curve='exp'):
    t = T(d)
    if curve == 'exp':
        f = f0 * (f1 / f0) ** (t / d)
    else:
        f = f0 + (f1 - f0) * t / d
    return 2 * np.pi * np.cumsum(f) / SR


def noise(d):
    return rs.uniform(-1, 1, int(SR * d))


def onepole_lp(x, fc):
    """filtre passe-bas 1 pôle, fc scalaire ou tableau"""
    fc = np.broadcast_to(np.asarray(fc, float), x.shape)
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def lp(x, fc, n=2):
    for _ in range(n):
        x = onepole_lp(x, fc)
    return x


def hp(x, fc):
    return x - lp(x, fc, 1)


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def cat(*xs):
    return np.concatenate(xs)


def at(base_len, items):
    out = np.zeros(int(SR * base_len))
    for t0, x in items:
        i = int(t0 * SR)
        n = min(len(x), len(out) - i)
        if n > 0:
            out[i:i + n] += x[:n]
    return out


def bell(f, d=1.2, partials=((1, 1), (2.76, .5), (5.4, .25), (8.9, .1)), decay=.35):
    t = T(d)
    s = sum(a * np.sin(2 * np.pi * f * p * t) * np.exp(-t / (decay / (1 + p * .4))) for p, a in partials)
    return s * env(d, .002)


# ---------------- bibliothèque ----------------
def whoosh(d=.45, f0=300, f1=3000):
    n = noise(d)
    t = T(d)
    fc = f0 * (f1 / f0) ** (np.sin(np.pi * t / d))
    x = lp(n, fc, 2)
    return norm(x * np.sin(np.pi * t / d) ** 1.5, .8)


def whoosh_up(d=.9):
    t = T(d)
    x = lp(noise(d), 200 * (20 ** (t / d)), 2) * (t / d) ** 1.5
    tone = np.sin(sweep(200, 900, d)) * .25 * (t / d)
    return norm(x + tone, .8)


def pop(f0=700, f1=180, d=.09):
    return np.sin(sweep(f0, f1, d)) * env(d, .001, .03) * .9


def pop_hi():
    return pop(1300, 500, .07)


def boing(d=.6, f=220):
    t = T(d)
    fm = f * (1 + .35 * np.sin(2 * np.pi * 14 * t) * np.exp(-t / .25)) * (1 + .6 * np.exp(-t / .05))
    return np.sin(2 * np.pi * np.cumsum(fm) / SR) * env(d, .002, .22) * .8


def ding(f=1320):
    return norm(bell(f, 1.4), .7)


def glint():
    return norm(bell(3200, .6, decay=.15) + bell(4800, .6, decay=.1) * .5, .5)


def sparkle():
    notes = [1568, 1976, 2349, 2637, 3136, 3951]
    return norm(at(1.2, [(i * .06, bell(f, .7, decay=.18)) for i, f in enumerate(notes)]), .55)


def boom(d=1.6):
    t = T(d)
    s = np.sin(sweep(90, 32, d)) * np.exp(-t / .5)
    n = lp(noise(d), 300, 3) * np.exp(-t / .25) * 3
    return norm(np.tanh((s + n) * 2), .95)


def drum(f0=110, f1=50, d=.6):
    t = T(d)
    s = np.sin(sweep(f0, f1, d)) * np.exp(-t / .18)
    n = lp(noise(d), 900, 2) * np.exp(-t / .04)
    return norm(s + n * .8, .9)


def saw(f, d):
    t = T(d)
    return 2 * ((f * t) % 1) - 1


def sting():
    notes = [(0, 98, .22), (.28, 92.5, .22), (.56, 82.4, 1.1)]
    out = []
    for t0, f, d in notes:
        x = (saw(f, d) + saw(f * 1.005, d) + saw(f / 2, d)) / 3
        x = lp(x, 900, 2) * env(d, .01, d * .6)
        out.append((t0, x))
    o = at(1.8, out) + at(1.8, [(t0, drum(80, 40, .7) * .6) for t0, _, _ in notes])
    return norm(o, .9)


def printer(d=1.6):
    t = T(d)
    gate = (np.sin(2 * np.pi * 9 * t) > 0).astype(float)
    buzz = np.sign(np.sin(2 * np.pi * 180 * t)) * .3 + hp(noise(d), 2000) * .6
    x = lp(buzz, 3500, 1) * (.35 + .65 * gate) * env(d, .02)
    x[-int(.05 * SR):] *= np.linspace(1, 0, int(.05 * SR))
    return norm(x, .55)


def error_beep():
    b = np.sign(np.sin(2 * np.pi * 880 * T(.12))) * .4 * env(.12, .003, .1)
    return at(.4, [(0, b), (.18, b)])


def slot(d=2.0):
    items, t = [], 0.0
    gap = .045
    while t < d - .3:
        items.append((t, hp(noise(.02), 2500) * env(.02, .001, .006) * .7 + np.resize(pop(2200, 1800, .02), int(.02 * SR)) * .3))
        t += gap
        gap *= 1.06
    return at(d + .2, items)


def jackpot():
    chord = [1047, 1319, 1568, 2093]
    return norm(at(1.6, [(i * .07, bell(f, 1.2)) for i, f in enumerate(chord)] + [(.3, bell(2093, 1.2))]), .7)


def tick():
    return at(.025, [(0, hp(noise(.025), 3000) * env(.025, .0005, .005)), (0, pop(3000, 2500, .02) * .3)])


def clock_fast(d=2.0, rate=10):
    return at(d, [(i / rate, tick() * (.6 if i % 2 else 1)) for i in range(int(d * rate))])


def waves(d=3.5):
    t = T(d)
    x = lp(noise(d), 700, 2)
    swell = .4 + .6 * np.sin(np.pi * ((t / 1.7) % 1)) ** 2
    return norm(x * swell * env(d, .4), .5)


def zap():
    d = .18
    return np.sign(np.sin(sweep(1800, 250, d))) * .35 * env(d, .002, .08)


def whistle():
    mel = [(784, .18), (988, .18), (1175, .3), (988, .18), (1319, .35)]
    out, t0 = [], 0
    for f, d in mel:
        t = T(d)
        ph = 2 * np.pi * np.cumsum(f * (1 + .012 * np.sin(2 * np.pi * 6 * t))) / SR
        out.append((t0, (np.sin(ph) + hp(noise(d), 4000) * .05) * env(d, .02, d * .8) * .5))
        t0 += d * .95
    return at(t0 + .2, out)


def step():
    return lp(noise(.08), 400, 2) * env(.08, .002, .02) * 3


def steps(n=4, gap=.28):
    return norm(at(n * gap + .2, [(i * gap, step()) for i in range(n)]), .5)


def sizzle(d=2.0):
    t = T(d)
    base = hp(noise(d), 4000) * .5
    crack = np.zeros(len(t))
    for i in rs.integers(0, len(t) - 400, 90):
        crack[i:i + 300] += rs.uniform(-1, 1, 300) * np.exp(-np.arange(300) / 40)
    return norm((base + crack) * env(d, .05) * np.clip((d - t) / .3, 0, 1), .5)


def school_bell(d=1.6):
    t = T(d)
    b = bell(2200, d, decay=.6) * (.6 + .4 * np.sign(np.sin(2 * np.pi * 22 * t)))
    return norm(b * np.clip((d - t) / .2, 0, 1), .55)


def spray(d=.8):
    t = T(d)
    return norm(hp(noise(d), 1500) * env(d, .01) * np.clip((d - t) / .25, 0, 1), .6)


def crickets(d=2.0):
    items = []
    t0 = 0
    while t0 < d:
        for k in range(3):
            dd = .035
            items.append((t0 + k * .05, np.sin(2 * np.pi * 4600 * T(dd)) * env(dd, .003, .015) * .35))
        t0 += .42
    return at(d + .2, items)


def scratch():
    d = .45
    t = T(d)
    f = 900 * np.exp(-t / .12) + 120 + 600 * np.abs(np.sin(2 * np.pi * 7 * t))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .5 + hp(noise(d), 1200) * .5
    return norm(x * env(d, .003, .2), .8)


def ecg_beep():
    return np.sin(2 * np.pi * 1000 * T(.12)) * env(.12, .003, .08) * .45


def tada():
    chord = [(0, 523), (.12, 659), (.24, 784), (.4, 1047)]
    out = []
    for t0, f in chord:
        d = 1.2 - t0
        x = sum(lp(saw(f * m, d), 3000, 1) * a for m, a in [(1, 1), (1.003, .7), (2, .3)])
        out.append((t0, x * env(d, .02, .6) * .25))
    return norm(at(1.3, out), .75)


def rewind(d=.9):
    t = T(d)
    f = 400 + 900 * (t / d) + 200 * np.sin(2 * np.pi * 18 * t)
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .2 + hp(noise(d), 3000) * .2
    return norm(lp(x, 4000, 1) * env(d, .02) * np.clip((d - t) / .1, 0, 1), .55)


def snip():
    c = hp(noise(.03), 3500) * env(.03, .0005, .008)
    return norm(at(.2, [(0, c), (.07, c * .8)]), .7)


def shutter():
    c = hp(noise(.04), 2000) * env(.04, .0005, .01)
    return norm(at(.18, [(0, c), (.08, c * .7)]), .6)


def kaching():
    drawer = lp(noise(.25), 600, 2) * env(.25, .005, .06) * 2
    return norm(at(1.5, [(0, hp(noise(.05), 3000) * env(.05, .001, .01)), (.05, bell(2637, 1.2, decay=.5)), (.13, bell(3520, 1.2, decay=.5)), (.32, drawer)]), .8)


def coins(n=7):
    return norm(at(1.2, [(rs.uniform(0, .7), bell(rs.uniform(3000, 5000), .4, decay=.08)) for _ in range(n)]), .5)


def rimshot():
    ba = drum(220, 160, .25) * .7
    dum = drum(150, 100, .35) * .8
    tss = hp(noise(.9), 6000) * np.exp(-T(.9) / .25) * .6 + lp(noise(.9), 2000, 1) * np.exp(-T(.9) / .05) * .5
    kick = drum(110, 45, .4)
    return norm(at(1.4, [(0, ba), (.18, dum), (.42, tss), (.42, kick)]), .9)


def fire(d=2.0):
    t = T(d)
    rumble = lp(noise(d), 300, 2) * 2
    crack = np.zeros(len(t))
    for i in rs.integers(0, len(t) - 600, 40):
        crack[i:i + 500] += rs.uniform(-1, 1, 500) * np.exp(-np.arange(500) / 60) * rs.uniform(.3, 1)
    return norm((rumble + hp(crack, 1500)) * env(d, .1) * np.clip((d - t) / .4, 0, 1), .5)


def flutter(d=.8):
    t = T(d)
    return norm(lp(noise(d), 1500, 1) * (np.sin(2 * np.pi * 16 * t) > .2) * env(d, .02) * np.clip((d - t) / .2, 0, 1), .45)


def squeak():
    d = .14
    return np.sin(sweep(1200, 2200, d)) * env(d, .005, .06) * .4


def thud():
    return norm(drum(140, 60, .3), .8)


def flash_hit():
    return norm(at(.9, [(0, boom(.9) * .6), (0, hp(noise(.9), 2500) * np.exp(-T(.9) / .08) * .6)]), .9)


def magic():
    return norm(at(1.2, [(0, sparkle()), (0, whoosh(.6, 800, 6000) * .4)]), .6)


def heartbeat():
    b = drum(70, 45, .25)
    return norm(at(.8, [(0, b), (.18, b * .7)]), .7)


def baby_coo():
    d = .45
    t = T(d)
    f = 520 + 120 * np.sin(np.pi * t / d)
    x = sum(np.sin(2 * np.pi * np.cumsum(f * m) / SR) * a for m, a in [(1, 1), (2, .4), (3, .2)])
    return norm(lp(x, 2500, 1) * env(d, .05, .2) * (1 + .3 * np.sin(2 * np.pi * 9 * t)), .45)


def hmm():
    d = .6
    t = T(d)
    f = 140 + 20 * np.sin(np.pi * t / d)
    x = sum(np.sin(2 * np.pi * np.cumsum(f * m) / SR) * a for m, a in [(1, 1), (2, .5), (3, .3), (4, .2)])
    return norm(lp(x, 900, 2) * env(d, .05, .35), .5)


LIB = {k: v for k, v in globals().items() if callable(v) and k not in (
    'T', 'env', 'sweep', 'noise', 'onepole_lp', 'lp', 'hp', 'norm', 'cat', 'at', 'bell', 'saw', 'read_wav', 'write_wav', 'main', 'mix', 'step')}


def write_wav(fn, x, sr=SR):
    x = np.clip(x, -1, 1)
    y = (x * 32767).astype(np.int16)
    if y.ndim == 1:
        y = np.stack([y, y], 1)
    with wave.open(fn, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(y.tobytes())


def read_audio(fn):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', fn, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)


def mix(cues_fn, voice_fn, out_fn, dur=None):
    cues = json.load(open(cues_fn))
    voice = read_audio(voice_fn)
    dur = float(dur) if dur else len(voice) / SR + .8
    out = np.zeros(int(dur * SR) + SR)
    out[:len(voice)] += voice * 1.0
    cache = {}
    for c in cues:
        name = c['name']
        if name not in LIB:
            print('SFX inconnu:', name); continue
        if name not in cache:
            cache[name] = LIB[name]()
        x = cache[name] * c.get('vol', 1) * SFX_GAIN
        i = int(c['t'] * SR)
        n = min(len(x), len(out) - i)
        if n > 0:
            out[i:i + n] += x[:n]
    out = out[:int(dur * SR)]
    out = np.tanh(out * 1.1) / np.tanh(1.1)  # limiteur doux
    write_wav(out_fn, out * .95)
    print('mix ->', out_fn, f'{len(cues)} sfx')


if __name__ == '__main__':
    if sys.argv[1] == 'mix':
        mix(*sys.argv[2:])
    elif sys.argv[1] == 'preview':
        os.makedirs('sfx_preview', exist_ok=True)
        for k, f in LIB.items():
            write_wav(f'sfx_preview/{k}.wav', f())
        print(sorted(LIB))
