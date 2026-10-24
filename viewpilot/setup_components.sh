#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
mkdir -p "$DIR/components"

if [ ! -d "$DIR/components/LovyanGFX" ]; then
  echo "[ViewPilot] Fetching LovyanGFX display library..."
  git clone --depth 1 https://github.com/lovyan03/LovyanGFX.git "$DIR/components/LovyanGFX"
  echo "[ViewPilot] LovyanGFX setup complete."
else
  echo "[ViewPilot] LovyanGFX already installed."
fi
