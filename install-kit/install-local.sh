#!/usr/bin/env bash
# Nyyo Legal — local install helper (macOS / Linux). Read me before running.
# - Never opens remote access. Serves on 127.0.0.1 only.
set -euo pipefail
MODEL="${NYYO_MODEL:-mistral}"
DIR="$(cd "$(dirname "$0")/.." && pwd)"
if ! command -v ollama >/dev/null 2>&1; then
  echo "Ollama is not installed. Install it from https://ollama.com/download (official installer), then re-run this script."
  exit 1
fi
echo "Pulling local model: $MODEL (one-time download, then built to run offline)"
ollama pull "$MODEL"
echo "Serving the assistant UI on http://127.0.0.1:8787 (localhost only). Ctrl+C to stop."
cd "$DIR" && python3 -m http.server 8787 --bind 127.0.0.1
