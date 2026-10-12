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


# ---------- épisode 2 : nature ----------
def crack():
    c = hp(noise(.04), 1500) * env(.04, .0005, .008)
    return norm(at(.35, [(0, c), (.06, c * .7), (.15, c), (.2, c * .5)]), .7)


def chomp():
    b = drum(180, 90, .15) * .8
    cr = hp(noise(.18), 2500) * np.exp(-T(.18) / .05)
    return norm(at(.3, [(0, b), (0, cr * .7), (.09, cr * .5)]), .85)


def chirp():
    out = []
    for i in range(3):
        d = .07
        out.append((i * .11, np.sin(sweep(3200, 5200, d)) * env(d, .005, .03) * .4))
    return at(.45, out)


def angel(d=1.4):
    t = T(d)
    chord = [523, 659, 784, 1047]
    x = sum(np.sin(2 * np.pi * np.cumsum(f * (1 + .004 * np.sin(2 * np.pi * 5 * t))) / SR) for f in chord)
    return norm(lp(x, 2500, 1) * env(d, .25) * np.clip((d - t) / .5, 0, 1), .45)


def buzz(d=2.4):
    t = T(d)
    f = 210 + 25 * np.sin(2 * np.pi * 1.3 * t) + 15 * np.sin(2 * np.pi * 3.7 * t)
    x = saw(1, d) * 0
    ph = np.cumsum(f) / SR
    x = (2 * (ph % 1) - 1)
    am = .6 + .4 * np.sin(2 * np.pi * .9 * t) ** 2
    return norm(lp(x, 1800, 1) * am * env(d, .1) * np.clip((d - t) / .2, 0, 1), .35)


def thunder(d=2.2):
    t = T(d)
    x = lp(noise(d), 180, 3) * (np.exp(-t / .8) + .5 * np.exp(-np.abs(t - .3) / .2))
    cr = hp(noise(d), 1500) * np.exp(-t / .08) * .4
    return norm(np.tanh((x * 6 + cr) * 1.5), .95)


def growl(d=1.1):
    t = T(d)
    x = lp(noise(d), 160, 3) * (1 + np.sin(2 * np.pi * 7 * t)) * env(d, .1) * np.clip((d - t) / .3, 0, 1)
    tone = np.sin(sweep(90, 60, d)) * .3 * env(d, .1, .5)
    return norm(x * 6 + tone, .8)


def gulp():
    return norm(at(.3, [(0, np.sin(sweep(500, 150, .08)) * env(.08, .002, .03)), (.1, np.sin(sweep(300, 120, .1)) * env(.1, .002, .04))]), .7)


def ghost(d=1.3):
    t = T(d)
    f = 500 + 250 * np.sin(np.pi * t / d) + 30 * np.sin(2 * np.pi * 6 * t)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, .2) * np.clip((d - t) / .4, 0, 1), .4)


def wolf():
    a = np.sin(sweep(900, 2600, .25)) * env(.25, .02)
    b = np.sin(sweep(1400, 700, .45)) * env(.45, .01, .3)
    return norm(at(.9, [(0, a), (.32, b)]), .45)


def kiss():
    return norm(at(.2, [(0, hp(noise(.03), 2000) * env(.03, .001, .01)), (.01, np.sin(sweep(1400, 2400, .05)) * env(.05, .002, .02))]), .6)


def hammer():
    h = at(.3, [(0, bell(1800, .3, decay=.08)), (0, drum(300, 200, .1) * .5)])
    return norm(at(1.0, [(0, h), (.3, h), (.6, h)]), .6)


def tiptoe(n=6, gap=.3):
    s = lambda: hp(noise(.03), 1500) * env(.03, .001, .008)
    return norm(at(n * gap + .1, [(i * gap, s()) for i in range(n)]), .35)


def siren(d=1.4):
    t = T(d)
    f = 700 + 300 * np.sign(np.sin(2 * np.pi * 2.5 * t))
    return norm(lp(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)), 3000, 1) * env(d, .02) * np.clip((d - t) / .2, 0, 1), .35)


def ring(d=1.6):
    """sonnerie de téléphone moderne (deux tons alternés, en rafales)"""
    t = T(d)
    f = np.where((t * 12) % 2 < 1, 1320, 1760)
    gate = ((t % .5) < .32).astype(float)
    return norm((np.sin(2 * np.pi * np.cumsum(f) / SR) * .7 + np.sin(4 * np.pi * np.cumsum(f) / SR) * .2) * gate * env(d, .01), .5)


def vibrate(d=1.0):
    t = T(d)
    gate = ((t % .4) < .25).astype(float)
    return norm(lp(np.sign(np.sin(2 * np.pi * 150 * t)), 600, 2) * gate * env(d, .01), .5)


def wind(d=2.5):
    t = T(d)
    n = noise(d)[:len(t)]
    sw = np.sin(np.pi * t / d) ** 1.5
    fc = 300 + 900 * sw + 200 * np.sin(2 * np.pi * .7 * t)
    return norm(onepole_lp(n, fc) * sw * 3, .6)


def gasp(d=1.0):
    """foule qui fait « ooooh ! » (bruit formanté)"""
    t = T(d)
    n = noise(d)[:len(t)]
    v = 0
    for f in (500, 900, 1300, 2300):
        v = v + lp(hp(n, f * .8), f * 1.2, 2)
    vox = sum(np.sin(2 * np.pi * (180 + k * 37) * t * (1 - .15 * t)) * .15 for k in range(8))
    return norm((v + vox) * env(d, .05, decay=.6), .55)


def typing(d=1.6, rate=11):
    out = np.zeros(int(d * SR)); r = np.random.default_rng(3)
    for k in range(int(d * rate)):
        i = int((k / rate + r.random() * .03) * SR)
        c = hp(noise(.02), 2000) * env(.02, .001, decay=.008)
        out[i:i + len(c)] += c[:len(out) - i] * (.6 + .4 * r.random())
    return norm(out, .5)


def burp(d=1.1):
    """rot sonore : voix grave rauque modulée"""
    t = T(d)
    f = 95 + 25 * np.sin(2 * np.pi * 3 * t) - 30 * t
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sign(np.sin(ph)) * .5 + np.sin(ph * 2) * .3
    rough = 1 + .8 * np.sin(2 * np.pi * 31 * t) * lp(noise(d), 60, 2) * 20
    x = lp(tone * rough, 700, 2) * env(d, .03) * np.clip((d - t) / .25, 0, 1)
    return norm(x, .85)


def tiny_scream(d=1.6, n=5):
    """chœur de petits cris suraigus (asticots)"""
    out = np.zeros(int(SR * d)); r = np.random.default_rng(3)
    for i in range(n):
        dd = .35 + r.random() * .5; t = T(dd)
        f = (1700 + r.random() * 900) * (1 + .12 * np.sin(2 * np.pi * (14 + r.random() * 8) * t)) * (1 - .25 * t / dd)
        ph = 2 * np.pi * np.cumsum(f) / SR
        v = (np.sin(ph) + .4 * np.sin(2 * ph) + .2 * np.sin(3 * ph)) * env(dd, .02) * np.clip((dd - t) / .08, 0, 1)
        i0 = int((r.random() * (d - dd)) * SR); out[i0:i0 + len(v)] += v * (.6 + .4 * r.random())
    return norm(out, .6)


def vomit(d=1.3):
    """haut-le-cœur + éclaboussure liquide"""
    t = T(d)
    gag = lp(noise(d), 400, 2) * (1 + np.sin(2 * np.pi * 9 * t)) * env(d, .02) * np.clip((.45 - t) / .1, 0, 1) * 4
    splash = hp(noise(d), 600) * np.clip((t - .35) / .03, 0, 1) * np.exp(-np.clip(t - .35, 0, None) / .35) * (1 + .5 * np.sin(2 * np.pi * 23 * t))
    gl = np.sin(sweep(260, 90, d)) * env(d, .05, .3) * .4
    return norm(gag + splash + gl, .8)


def gag(d=.6):
    t = T(d)
    x = lp(noise(d), 500, 2) * (1 + np.sin(2 * np.pi * 11 * t)) * env(d, .01, .2) * 4 + np.sin(sweep(220, 140, d)) * env(d, .01, .15) * .5
    return norm(x, .7)


def oink(d=.45):
    t = T(d)
    f = 280 + 120 * np.sin(np.pi * t / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = lp(np.sign(np.sin(ph)) * (1 + .6 * lp(noise(d), 80, 2) * 30), 1500, 2) * env(d, .02, .15)
    return norm(cat(x, np.zeros(int(SR * .05)), x[:int(SR * .25)] * .8), .7)


def stamp():
    return norm(at(.35, [(0, lp(noise(.12), 900, 2) * env(.12, .001, .03) * 3), (0, np.sin(sweep(160, 60, .15)) * env(.15, .001, .05))]), .9)


def applause(d=2.5):
    out = np.zeros(int(SR * d)); r = np.random.default_rng(8)
    for k in range(int(d * 140)):
        i = int(r.random() * (len(out) - 900)); c = hp(noise(.02), 1200) * env(.02, .001, decay=.006)
        out[i:i + len(c)] += c * (.4 + .6 * r.random())
    return norm(out * np.clip(T(d) / .2, 0, 1) * np.clip((d - T(d)) / .5, 0, 1), .6)


def fanfare():
    notes = [(0, 523), (.18, 659), (.36, 784), (.6, 1047)]
    out = np.zeros(int(SR * 1.6))
    for t0, f in notes:
        dd = 1.0 if f == 1047 else .3
        v = (saw(f, dd) * .5 + saw(f * 1.005, dd) * .5) * env(dd, .02, .4 if f == 1047 else .15)
        i = int(t0 * SR); out[i:i + len(v)] += lp(v, 2500, 2)[:len(out) - i]
    return norm(out, .7)


def crumple(d=.7):
    out = np.zeros(int(SR * d)); r = np.random.default_rng(12)
    for k in range(70):
        i = int(r.random() * (len(out) - 600)); c = hp(noise(.01), 2500) * env(.01, .001, decay=.004)
        out[i:i + len(c)] += c * r.random()
    return norm(out, .55)


def stink(d=1.2):
    t = T(d)
    x = np.sin(sweep(180, 90, d)) * (1 + .5 * np.sin(2 * np.pi * 6 * t)) * env(d, .05, .5) + lp(noise(d), 300, 2) * 2 * env(d, .1, .4)
    return norm(x, .6)


def ding_ding():
    return norm(cat(bell(1568, .5), bell(1568, .9)), .6)


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


EXT_GAIN = .22   # bruitages ElevenLabs (normalisés en crête)
BED_GAIN = .19  # niveau RMS de référence des nappes (musique ~9 dB sous la voix, +4 dB demandé par l'utilisateur)
VOICE_GAIN = 1.0
_ext = {}


def ext_audio(name):
    """Cue 'el:clef' -> assets/sfx/clef.mp3 (généré par engine/eleven.py), normalisé."""
    if name not in _ext:
        fn = os.path.join('assets', 'sfx', name[3:] + '.mp3')
        if not os.path.exists(fn):
            print('fichier absent:', fn); _ext[name] = None
        else:
            _ext[name] = norm(read_audio(fn), .9)
    return _ext[name]


def voice_envelope(voice, n):
    """Enveloppe de la voix (attaque rapide, relâche lente) pour le ducking de la musique."""
    hop = 441  # 10 ms
    m = len(voice) // hop
    rms = np.sqrt(np.mean(voice[:m * hop].reshape(m, hop) ** 2, axis=1))
    env = np.zeros(m); e = 0.
    for k in range(m):
        e = rms[k] if rms[k] > e else e * .975  # relâche ~400 ms
        env[k] = e
    # attaque adoucie (~60 ms) puis interpolation à la fréquence audio
    env = np.convolve(env, np.ones(6) / 6)[:m]
    return np.interp(np.arange(n), np.arange(m) * hop + hop / 2, env, right=0)


def place_bed(out, x, t0, t1, vol, fin, fout):
    """Pose une nappe (musique/ambiance) en boucle entre t0 et t1 avec fondus."""
    i0, i1 = int(t0 * SR), min(int(t1 * SR), len(out))
    L = i1 - i0
    if L <= 0: return np.zeros(0), i0
    reps = int(np.ceil(L / len(x)))
    y = np.tile(x, reps)[:L] * vol
    a, b = int(fin * SR), int(fout * SR)
    if a: y[:min(a, L)] *= np.linspace(0, 1, min(a, L))
    if b: y[-min(b, L):] *= np.linspace(1, 0, min(b, L))
    return y, i0


def mix(cues_fn, voice_fn, out_fn, dur=None):
    data = json.load(open(cues_fn))
    cues, beds = (data, []) if isinstance(data, list) else (data['cues'], data.get('beds', []))
    voice = read_audio(voice_fn)
    dur = float(dur) if dur else len(voice) / SR + .8
    n = int(dur * SR) + SR
    out = np.zeros(n)
    out[:len(voice)] += voice * VOICE_GAIN
    # nappes : musique (ducking sous la voix) + ambiances
    if beds:
        env = voice_envelope(voice, n)
        for bd in beds:
            x = ext_audio(bd['name'])
            if x is None: continue
            x = x * (BED_GAIN / (np.sqrt(np.mean(x ** 2)) + 1e-9))  # nappes normalisées en RMS (vol = niveau relatif)
            y, i0 = place_bed(out, x, bd['t0'], bd['t1'], bd.get('vol', .5), bd.get('fin', 1.5), bd.get('fout', 1.5))
            duck = bd.get('duck', .55)
            if duck:
                g = 1 - duck * np.clip(env[i0:i0 + len(y)] / .045, 0, 1)
                y = y * g
            out[i0:i0 + len(y)] += y
    cache = {}
    for c in cues:
        name = c['name']
        if name.startswith('el:'):
            x = ext_audio(name)
            if x is None: continue
            x = x * c.get('vol', 1) * EXT_GAIN
        else:
            if name not in LIB:
                print('SFX inconnu:', name); continue
            if name not in cache:
                cache[name] = LIB[name]()
            x = cache[name] * c.get('vol', 1) * SFX_GAIN
        i = int(c['t'] * SR)
        m = min(len(x), len(out) - i)
        if m > 0:
            out[i:i + m] += x[:m]
    out = out[:int(dur * SR)]
    out = np.tanh(out * 1.1) / np.tanh(1.1)  # limiteur doux
    write_wav(out_fn, out * .95)
    print('mix ->', out_fn, f'{len(cues)} sfx, {len(beds)} nappes')


if __name__ == '__main__':
    if sys.argv[1] == 'mix':
        mix(*sys.argv[2:])
    elif sys.argv[1] == 'preview':
        os.makedirs('sfx_preview', exist_ok=True)
        for k, f in LIB.items():
            write_wav(f'sfx_preview/{k}.wav', f())
        print(sorted(LIB))
