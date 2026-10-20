#!/usr/bin/env bash
# usage (depuis l'épisode) : ../tools/finish.sh <nom>
#   vérifie (check.mjs) → rendu 1080p 30 fps → contrôle du niveau audio → planche du MP4 final → découpe en parties < 30 Mo
set -e
N="${1:-$(basename "$PWD")}"; ROOT="$(cd "$(dirname "$0")/.." && pwd)"
node "$ROOT/engine/check.mjs" > out/check.txt 2>&1 || { cat out/check.txt; exit 1; }
grep -q "mot introuvable\|Error" out/check.txt && { grep "mot introuvable\|Error" out/check.txt; exit 1; }
node "$ROOT/engine/render.mjs" "out/${N}_9x16.mp4" assets/voix.mp3
ffmpeg -i "out/${N}_9x16.mp4" -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume"
ffmpeg -v error -y -i "out/${N}_9x16.mp4" -vf "select='not(mod(n\,64))',scale=216:384,tile=10x3" -frames:v 1 out/planche_finale.png
"$ROOT/tools/deliver.sh" "out/${N}_9x16.mp4"
rm -f out/check.txt
echo "FINI : out/${N}_9x16.mp4 (+ out/partie_*.mp4 à envoyer, out/planche_finale.png à regarder)"
