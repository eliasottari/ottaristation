"""Génère les bruitages / ambiances / boucles musicales d'un épisode avec ElevenLabs (sound-generation).

usage (depuis le dossier de l'épisode) :  python3 ../engine/eleven.py [clef1 clef2 ...]
  - lit assets/sfx/spec.json : { "clef": {"text": "...", "dur": 3, "loop": false, "influence": .4}, ... }
  - écrit assets/sfx/<clef>.mp3 (déjà présents = ignorés, sauf si la clef est passée en argument)
  - clé API : variable ELEVENLABS_API_KEY ou fichier engine/.env (gitignoré) — ne jamais la committer.
Dans scenes.js : cue 'el:clef' (one-shot) ou BEDS = [{name:'el:clef', t0, t1, vol, duck}] (nappes en boucle).
Note : l'API Musique d'ElevenLabs exige un compte payant ; les boucles musicales passent par sound-generation (loop).
"""
import json, os, sys, time, urllib.request, urllib.error

ENGINE = os.path.dirname(os.path.abspath(__file__))


def api_key():
    k = os.environ.get('ELEVENLABS_API_KEY')
    if not k and os.path.exists(os.path.join(ENGINE, '.env')):
        for l in open(os.path.join(ENGINE, '.env')):
            if l.startswith('ELEVENLABS_API_KEY='):
                k = l.split('=', 1)[1].strip()
    if not k:
        sys.exit('ELEVENLABS_API_KEY manquante (env ou engine/.env)')
    return k


def generate(key, spec, fn):
    body = {'text': spec['text'], 'duration_seconds': spec.get('dur', 3), 'prompt_influence': spec.get('influence', .45),
            'model_id': 'eleven_text_to_sound_v2'}
    if spec.get('loop'):
        body['loop'] = True
    req = urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation', data=json.dumps(body).encode(),
                                 headers={'xi-api-key': key, 'Content-Type': 'application/json'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                open(fn, 'wb').write(r.read())
            return True
        except urllib.error.HTTPError as e:
            msg = e.read()[:300]
            print('  HTTP', e.code, msg)
            if e.code in (401, 402, 422):
                return False
        except Exception as e:
            print('  erreur', e)
        time.sleep(2 ** (attempt + 1))
    return False


if __name__ == '__main__':
    key = api_key()
    specs = json.load(open('assets/sfx/spec.json'))
    force = set(sys.argv[1:])
    for k, sp in specs.items():
        fn = f'assets/sfx/{k}.mp3'
        if os.path.exists(fn) and k not in force:
            continue
        print('->', k, sp.get('dur'), 's')
        generate(key, sp, fn)
