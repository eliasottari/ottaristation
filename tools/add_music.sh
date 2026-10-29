#!/usr/bin/env bash
# usage (depuis l'épisode) : ../tools/add_music.sh out/<ep>_9x16.mp4 [musique.mp3] [gain_dB]
# Règle client (jusqu'à nouvel ordre) : musique Bad Piggies à -10 dB sous la voix, coupée là où la vidéo s'arrête.
set -e
IN="$1"; MUS="${2:-../engine/music_badpiggies.mp3}"; DB="${3:--10}"
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
F=$(python3 -c "print(max(0,$D-0.25))")
OUT="${IN%.mp4}_music.mp4"
ffmpeg -y -v error -i "$IN" -i "$MUS" -filter_complex "[1:a]atrim=0:$D,volume=${DB}dB,afade=t=out:st=$F:d=0.25[m];[0:a][m]amix=inputs=2:duration=first:normalize=0[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT"
mv "$OUT" "$IN"; echo "musique ajoutée -> $IN"
