#!/usr/bin/env bash
# usage (depuis l'épisode) : ../tools/deliver.sh out/<nom>_9x16.mp4
# -> si > 30 Mo : découpe 1080p sans ré-encodage en out/partie_1.mp4, partie_2.mp4… (à recoller dans CapCut)
# -> si > 95 Mo : ré-encode la copie commitée (GitHub < 100 Mo)
set -e
F="$1"; SZ=$(stat -c %s "$F")
if [ "$SZ" -gt 30000000 ]; then
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F")
  ST=$(python3 -c "print(max(10, int($DUR * 26e6 / $SZ)))")   # parties de ~26 Mo (marge sous 30 Mo)
  rm -f "$(dirname "$F")"/partie_*.mp4
  ffmpeg -v error -y -i "$F" -c copy -map 0 -f segment -segment_time "$ST" -reset_timestamps 1 -segment_start_number 1 "$(dirname "$F")/partie_%d.mp4"
  D_="$(dirname "$F")"; N=$(ls "$D_"/partie_*.mp4 | wc -l)
  if [ "$N" -gt 1 ]; then LAST="$D_/partie_$N.mp4"; PREV="$D_/partie_$((N-1)).mp4"
    LD=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$LAST")
    if python3 -c "import sys; sys.exit(0 if $LD < 3 else 1)"; then   # dernière partie < 3 s : recollée à la précédente
      printf "file '%s'\nfile '%s'\n" "$(realpath "$PREV")" "$(realpath "$LAST")" > "$D_/_l.txt"
      ffmpeg -v error -y -f concat -safe 0 -i "$D_/_l.txt" -c copy "$D_/_m.mp4" && mv "$D_/_m.mp4" "$PREV" && rm -f "$LAST" "$D_/_l.txt"; fi; fi
  ls -la "$D_"/partie_*.mp4
else echo "$F fait $((SZ/1000000)) Mo : envoi direct"; fi
if [ "$SZ" -gt 95000000 ]; then
  ffmpeg -v error -y -i "$F" -c:v libx264 -crf 22 -tune animation -preset slow -c:a copy "${F%.mp4}_repo.mp4" && mv "${F%.mp4}_repo.mp4" "$F"; fi
