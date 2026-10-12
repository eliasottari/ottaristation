#!/usr/bin/env bash
# Construit dist/video-pourquoi-kit.zip (moteur + skill + template + outils + exemples), SANS clé API ni voix client.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; K="$ROOT/dist/video-pourquoi-kit"
rm -rf "$K" "$K.zip"; mkdir -p "$K/.claude/skills"
cp -r "$ROOT/.claude/skills/video-pourquoi" "$K/.claude/skills/"
cp -r "$ROOT/engine" "$K/"; rm -rf "$K/engine/.env" "$K/engine/__pycache__" "$K/engine/node_modules"
cp -r "$ROOT/template" "$K/"; mkdir -p "$K/tools"; cp "$ROOT"/tools/{setup.sh,new_episode.sh,prep.py,deliver.sh} "$K/tools/"
cp "$ROOT/kitfiles/CLAUDE.md" "$ROOT/kitfiles/README.md" "$K/"
for ep in dents hyperactif calvitie; do
  E="$K/exemple_$ep"; mkdir -p "$E/assets"; cp "$ROOT/$ep"/{index.html,scenes.js,words.js} "$E/"
  [ -f "$ROOT/$ep/assets/blocks.txt" ] && cp "$ROOT/$ep/assets/blocks.txt" "$E/assets/"
done
printf '.env\nout/tmp/\n__pycache__/\n' > "$K/.gitignore"
grep -rIl "ELEVENLABS_API_KEY=sk\|sk_[a-f0-9]\{20,\}" "$K" && { echo "CLÉ DÉTECTÉE — abandon"; exit 1; } || true
(cd "$ROOT/dist" && zip -qr video-pourquoi-kit.zip video-pourquoi-kit)
ls -la "$K.zip"
