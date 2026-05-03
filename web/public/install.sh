#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# Markdown Viewer — One-line installer for macOS
#
# Usage:
#   curl -fsSL https://markdown.yuggupta.com/install.sh | sh
#
# What it does:
#   1. Downloads the latest .dmg from GitHub releases
#   2. Mounts it
#   3. Copies Markdown Viewer.app into /Applications
#   4. Removes the macOS quarantine flag (so it opens without warnings)
#   5. Cleans up
#
# Why this approach instead of a regular .dmg download?
#   The app is unsigned (no $99/year Apple Developer cert), so a Safari/Chrome
#   download triggers Gatekeeper's "is damaged" warning. Running this script
#   from your Terminal bypasses that — no warnings, no manual steps.
#
# Source: https://github.com/yug-space/markdown-viewer
# ──────────────────────────────────────────────────────────────────────────────

set -e

# ── Style ────────────────────────────────────────────────────────────────────
BOLD=$'\033[1m'
DIM=$'\033[2m'
GREEN=$'\033[32m'
YELLOW=$'\033[33m'
RED=$'\033[31m'
RESET=$'\033[0m'
ARROW="${DIM}→${RESET}"

info() { echo "${ARROW} $1"; }
ok()   { echo "${GREEN}✓${RESET} $1"; }
warn() { echo "${YELLOW}!${RESET} $1"; }
fail() { echo "${RED}✗${RESET} $1" >&2; exit 1; }

echo
echo "${BOLD}Markdown Viewer${RESET} ${DIM}— installer${RESET}"
echo

# ── Pre-flight ───────────────────────────────────────────────────────────────
[ "$(uname)" = "Darwin" ] || fail "This installer is for macOS only."
command -v curl >/dev/null 2>&1 || fail "curl is required."
command -v hdiutil >/dev/null 2>&1 || fail "hdiutil is required (built into macOS)."

# ── Constants ────────────────────────────────────────────────────────────────
REPO="yug-space/markdown-viewer"
APP_NAME="Markdown Viewer"
DMG_NAME="Markdown-Viewer-1.0.0-arm64.dmg"
RELEASE_URL="https://github.com/${REPO}/releases/download/v1.0.0/${DMG_NAME}"
TMP_DIR=$(mktemp -d)
DMG_PATH="${TMP_DIR}/${DMG_NAME}"
MOUNT_POINT="${TMP_DIR}/mnt"

cleanup() {
  if [ -d "$MOUNT_POINT" ]; then
    hdiutil detach "$MOUNT_POINT" -quiet 2>/dev/null || true
  fi
  rm -rf "$TMP_DIR" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# ── Download ─────────────────────────────────────────────────────────────────
info "Downloading from GitHub release v1.0.0..."
curl -fL --progress-bar -o "$DMG_PATH" "$RELEASE_URL" \
  || fail "Could not download $DMG_NAME"
ok "Downloaded $(du -h "$DMG_PATH" | cut -f1)"

# ── Mount ────────────────────────────────────────────────────────────────────
info "Mounting disk image..."
mkdir -p "$MOUNT_POINT"
hdiutil attach "$DMG_PATH" -mountpoint "$MOUNT_POINT" -nobrowse -quiet \
  || fail "Could not mount $DMG_NAME"
ok "Mounted"

# ── Install ──────────────────────────────────────────────────────────────────
SRC_APP="$MOUNT_POINT/${APP_NAME}.app"
DEST_APP="/Applications/${APP_NAME}.app"

[ -d "$SRC_APP" ] || fail "Application bundle not found inside the DMG."

if [ -d "$DEST_APP" ]; then
  warn "Existing copy at $DEST_APP — replacing"
  rm -rf "$DEST_APP"
fi

info "Copying to /Applications..."
cp -R "$SRC_APP" "/Applications/"
ok "Copied"

# ── Strip quarantine ─────────────────────────────────────────────────────────
info "Removing macOS quarantine flag..."
xattr -cr "$DEST_APP" 2>/dev/null || true
ok "Cleared"

# ── Register as default for .md ──────────────────────────────────────────────
info "Registering with Launch Services..."
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister \
  -f "$DEST_APP" 2>/dev/null || true
ok "Registered"

# ── Done ─────────────────────────────────────────────────────────────────────
echo
echo "${GREEN}${BOLD}✓ Markdown Viewer installed${RESET}"
echo "${DIM}  → /Applications/Markdown Viewer.app${RESET}"
echo
echo "Open it from Spotlight, Launchpad, or by double-clicking any ${BOLD}.md${RESET} file."
echo "${DIM}  Tip: right-click a .md file → Get Info → Open with → Markdown Viewer → Change All${RESET}"
echo
