# Nyyo Legal — install kit (free, included with every offer)

**Zero access to your data.** We never ask for remote access, passwords or access codes.
You (or your IT) run every step below yourself and can read every script first.

## What this folder contains today
| File | What it does |
|---|---|
| `install-local.sh` | macOS / Linux: checks for Ollama, pulls a local model, serves the assistant UI on `http://127.0.0.1:8787` (localhost only) |
| `install-local.ps1` | Windows PowerShell equivalent |
| `verify.sh` | Prints SHA-256 checksums of the demo files so you can compare them with `SHA256SUMS` |

The full client build (folder watcher, local vector index, local OCR, `.exe` / `.dmg` installer — Checksum-verified installer (SHA-256); source code available for your IT to review; OS code-signing provided with the delivered build)
is delivered with the paid setup and follows the same rules: localhost only, built to run offline, no account, no cloud upload by default.

## Offline test
1. Download `dist/nyyo-legal-ai-offline-demo.zip` and unzip it.
2. Turn off Wi-Fi / unplug the network cable.
3. Open `index.html`. Ask, Analyze (incl. PDF) and Draft keep working — nothing needs the internet.

## Optional local AI (delivered tool)
Runtime: [Ollama](https://ollama.com). Models: Mistral 7B, Llama 3.1 8B or Qwen 2.5 7B/14B depending on RAM
(16 GB for solo use; 32 GB+ recommended for 14B models). After the model is downloaded, no internet connection is required.
