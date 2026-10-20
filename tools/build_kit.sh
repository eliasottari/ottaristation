#!/usr/bin/env bash
# Construit dist/video-pourquoi-kit.zip (moteur + skill + template + outils + exemples SIZEX fun), SANS clé API ni voix.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; K="$ROOT/dist/video-pourquoi-kit"
rm -rf "$K" "$K.zip"; mkdir -p "$K/.claude/skills"
cp -r "$ROOT/.claude/skills/video-pourquoi" "$K/.claude/skills/"
cp -r "$ROOT/engine" "$K/"; rm -rf "$K/engine/.env" "$K/engine/__pycache__" "$K/engine/node_modules"
cp -r "$ROOT/template" "$K/"; mkdir -p "$K/tools"
cp "$ROOT"/tools/{setup.sh,new_episode.sh,tighten.py,prep.py,gaps.py,finish.sh,deliver.sh} "$K/tools/"; chmod +x "$K"/tools/*
cp "$ROOT/kitfiles/CLAUDE.md" "$ROOT/kitfiles/README.md" "$K/"
for ep in gentil pauvres secours aine; do
  E="$K/exemple_$ep"; mkdir -p "$E/assets"; cp "$ROOT/$ep"/{index.html,scenes.js,words.js,timing.js} "$E/"
  cp "$ROOT/$ep/assets/blocks.txt" "$E/assets/"
done
printf '.env\nout/tmp/\nout/partie_*.mp4\n__pycache__/\n' > "$K/.gitignore"
grep -rIl "ELEVENLABS_API_KEY=sk\|sk_[a-f0-9]\{20,\}" "$K" && { echo "CLÉ DÉTECTÉE — abandon"; exit 1; } || true
(cd "$ROOT/dist" && zip -qr video-pourquoi-kit.zip video-pourquoi-kit)
rm -rf "$K"; ls -la "$K.zip"
