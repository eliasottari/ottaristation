#!/usr/bin/env bash
# usage (depuis l'épisode) : ../tools/deliver.sh out/<nom>_9x16.mp4
# -> si > 30 Mo : découpe 1080p sans ré-encodage en out/partie_1.mp4, partie_2.mp4… (à recoller dans CapCut)
# -> si > 95 Mo : ré-encode la copie commitée (GitHub < 100 Mo)
set -e
F="$1"; SZ=$(stat -c %s "$F")
if [ "$SZ" -gt 30000000 ]; then
  ffmpeg -v error -y -i "$F" -c copy -map 0 -f segment -segment_time 50 -reset_timestamps 1 -segment_start_number 1 "$(dirname "$F")/partie_%d.mp4"
  ls -la "$(dirname "$F")"/partie_*.mp4
else echo "$F fait $((SZ/1000000)) Mo : envoi direct"; fi
if [ "$SZ" -gt 95000000 ]; then
  ffmpeg -v error -y -i "$F" -c:v libx264 -crf 22 -tune animation -preset slow -c:a copy "${F%.mp4}_repo.mp4" && mv "${F%.mp4}_repo.mp4" "$F"; fi
