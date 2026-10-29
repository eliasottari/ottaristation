#!/usr/bin/env bash
# usage : tools/new_episode.sh <nom> [voix.mp3|wav] [16x9]
#   crée <nom>/ depuis template/ (format SIZEX fun 9:16 par défaut ; 16x9 = ancien format YouTube long)
#   avec une voix : silences resserrés (TikTok) → transcription mot à mot → blocs → calage → voix +10 dB → contrôle des trous
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; EP="$ROOT/$1"
[ -z "$1" ] && { echo "usage: $0 <nom> [voix.mp3] [16x9]"; exit 1; }
VOICE=""; FMT=""
for a in "${@:2}"; do if [ "$a" = "16x9" ]; then FMT=16x9; else VOICE="$(realpath "$a")"; fi; done
mkdir -p "$EP/assets" "$EP/out"
if [ "$FMT" = "16x9" ]; then cp "$ROOT/template/index_16x9.html" "$EP/index.html"; cp "$ROOT/template/scenes_v2.js" "$EP/scenes.js"
else cp "$ROOT/template/index.html" "$EP/index.html"; cp "$ROOT/template/scenes.js" "$EP/scenes.js"; fi
printf 'out/tmp/\nout/partie_*.mp4\nout/planche_finale.png\nout/check.txt\n' > "$EP/.gitignore"
[ -z "$VOICE" ] && { echo "OK -> $EP  (ensuite : $0 $1 <voix.mp3>, ou cd $1 && python3 ../tools/prep.py <voix>)"; exit 0; }
cd "$EP"
ffmpeg -v error -y -i "$VOICE" -c:a libmp3lame -q:a 2 assets/brut.mp3
python3 "$ROOT/tools/tighten.py" assets/brut.mp3 assets/src.mp3 --keep .06 --min .12     # phrases bord à bord (TikTok)
PAD="${INTRO_PAD:-1.2}"   # silence ajouté AVANT la voix : la machine à sous tourne seule (suspense) — INTRO_PAD=0 pour l'ancien rythme
if [ "$PAD" != "0" ]; then ffmpeg -v error -y -i assets/src.mp3 -af "adelay=$(python3 -c "print(int($PAD*1000))"):all=1" assets/_pad.mp3 && mv assets/_pad.mp3 assets/src.mp3; fi
python3 "$ROOT/tools/prep.py" assets/src.mp3                                            # words.js, blocks.txt, timing.js
ffmpeg -v error -y -i assets/src.mp3 -af "volume=10dB,alimiter=limit=0.89:level=false" assets/voix.mp3   # voix +10 dB
python3 "$ROOT/tools/gaps.py" || echo "⚠ trous détectés : python3 ../tools/gaps.py --fix, puis ajoute la phrase dans assets/blocks.txt et prep.py --realign"
echo "OK -> $EP prêt : corrige assets/blocks.txt (+ prep.py --realign), puis écris scenes.js"
