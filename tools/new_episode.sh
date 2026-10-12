#!/usr/bin/env bash
# usage : tools/new_episode.sh <nom> [16x9]   -> crée <nom>/ depuis template/
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; EP="$ROOT/$1"
[ -z "$1" ] && { echo "usage: $0 <nom> [16x9]"; exit 1; }
mkdir -p "$EP/assets" "$EP/out"
cp "$ROOT/template/scenes.js" "$EP/scenes.js"
if [ "$2" = "16x9" ]; then cp "$ROOT/template/index_16x9.html" "$EP/index.html"; else cp "$ROOT/template/index.html" "$EP/index.html"; fi
echo 'out/tmp/' > "$EP/.gitignore"
echo "OK -> $EP  (ensuite : cd $1 && python3 ../tools/prep.py <voix>)"
