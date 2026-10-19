#!/usr/bin/env bash
# Compare the output with SHA256SUMS published in the repository.
cd "$(dirname "$0")/.." && sha256sum index.html css/app.css js/*.js vendor/*.js
