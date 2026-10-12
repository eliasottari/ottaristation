#!/usr/bin/env bash
# Installe ce qu'il faut pour fabriquer les vidéos (Linux/macOS). Idempotent.
set -e
need() { command -v "$1" >/dev/null 2>&1; }
if ! need ffmpeg; then (sudo apt-get update && sudo apt-get install -y ffmpeg) 2>/dev/null || brew install ffmpeg; fi
need node || { echo "Installe Node.js >= 18 (https://nodejs.org)"; exit 1; }
need python3 || { echo "Installe Python 3"; exit 1; }
python3 -c "import numpy" 2>/dev/null || pip install numpy
python3 -c "import faster_whisper" 2>/dev/null || pip install faster-whisper
node -e "require('playwright')" 2>/dev/null || [ -d "$(npm root -g)/playwright" ] || npm install -g playwright
[ -d /opt/pw-browsers ] || npx -y playwright install chromium
echo "OK : ffmpeg, node, python3+numpy, faster-whisper, playwright+chromium"
