#!/usr/bin/env python3
"""Génère la voix off avec ElevenLabs (voix Tenko FR, modèle v4, réglages validés : vitesse 1, stabilité 0,5, similarité 1).
usage : python3 tools/tts.py <script.txt> <sortie.mp3> [voice_id]
La clé est lue dans engine/.env (ELEVENLABS_API_KEY=…, jamais commitée)."""
import json, os, ssl, sys, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
key = [l.split('=', 1)[1].strip() for l in open(os.path.join(ROOT, 'engine/.env')) if l.startswith('ELEVENLABS_API_KEY')][0]
src, dst = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else '0bKGtCCpdKSI5NjGhU3z'   # Tenko — Young and Storyteller
text = open(src).read().strip()
body = json.dumps({'text': text, 'model_id': 'eleven_v4', 'language_code': 'fr',
                   'voice_settings': {'stability': .5, 'similarity_boost': 1.0, 'speed': 1.0}}).encode()
req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128', data=body,
                             headers={'xi-api-key': key, 'Content-Type': 'application/json'})
ca = '/root/.ccr/ca-bundle.crt'
ctx = ssl.create_default_context(cafile=ca) if os.path.exists(ca) else ssl.create_default_context()
open(dst, 'wb').write(urllib.request.urlopen(req, context=ctx, timeout=600).read())
print('OK', dst, len(text), 'caractères')
