# Nyyo Legal - local install helper (Windows PowerShell). Read me before running.
# Never opens remote access. Serves on 127.0.0.1 only.
$Model = if ($env:NYYO_MODEL) { $env:NYYO_MODEL } else { "mistral" }
$Dir = Split-Path -Parent $PSScriptRoot
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  Write-Host "Ollama is not installed. Install it from https://ollama.com/download (official installer), then re-run."
  exit 1
}
Write-Host "Pulling local model: $Model (one-time download, then built to run offline)"
ollama pull $Model
Write-Host "Serving on http://127.0.0.1:8787 (localhost only). Ctrl+C to stop."
Set-Location $Dir
python -m http.server 8787 --bind 127.0.0.1
