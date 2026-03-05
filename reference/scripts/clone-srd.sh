#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/BTMorton/dnd-5e-srd"
TARGET_DIR="reference/srd/dnd-5e-srd"

if [ ! -d "$TARGET_DIR/.git" ]; then
  echo "Cloning SRD dataset into $TARGET_DIR..."
  git clone "$REPO_URL" "$TARGET_DIR"
else
  echo "Updating existing SRD dataset in $TARGET_DIR..."
  (
    cd "$TARGET_DIR"
    git pull
  )
fi
