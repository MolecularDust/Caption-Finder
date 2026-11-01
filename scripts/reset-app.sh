#!/bin/bash
# Resets Caption Finder to a first-run state on this Mac: settings, caption and preview caches,
# diagnostics, the app's own browser storage (this signs it out of Google/YouTube), and its
# macOS privacy entries (Full Disk Access and the rest), for both the app and its "Dev" test build.
#
# Without --yes it only lists what it would remove. It never touches your browsers' cookies,
# saved clips, or other apps.
#   scripts/reset-app.sh            show what would be removed
#   scripts/reset-app.sh --yes      do it
#   scripts/reset-app.sh --yes --electron   also remove the old Electron prototype's data
set -euo pipefail

IDS=("com.mike.captionfinder" "com.mike.captionfinder.dev")   # the app and its test build
APPLY=0
ELECTRON=0
for arg in "$@"; do
  case "$arg" in
    --yes) APPLY=1 ;;
    --electron) ELECTRON=1 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

TARGETS=()
for ID in "${IDS[@]}"; do
  TARGETS+=(
    "$HOME/Library/Application Support/$ID"
    "$HOME/Library/Caches/$ID"
    "$HOME/Library/Logs/$ID"
    "$HOME/Library/WebKit/$ID"
    "$HOME/Library/HTTPStorages/$ID"
    "$HOME/Library/Preferences/$ID.plist"
    "$HOME/Library/Saved Application State/$ID.savedState"
  )
done
[ "$ELECTRON" = 1 ] && TARGETS+=("$HOME/Library/Application Support/caption-finder")

if [ "$APPLY" = 1 ]; then
  osascript -e 'tell application "Caption Finder" to quit' 2>/dev/null || true
  osascript -e 'tell application "Caption Finder Dev" to quit' 2>/dev/null || true
  osascript -e 'tell application "System Settings" to quit' 2>/dev/null || true
  sleep 1
fi

for path in "${TARGETS[@]}"; do
  if [ -e "$path" ]; then
    size=$(du -sh "$path" 2>/dev/null | cut -f1)
    if [ "$APPLY" = 1 ]; then
      rm -rf -- "$path"
      echo "removed  $size  $path"
    else
      echo "would remove  $size  $path"
    fi
  fi
done

if [ "$APPLY" = 1 ]; then
  # Forgets the app's privacy decisions, which removes its Full Disk Access entry.
  for ID in "${IDS[@]}"; do
    tccutil reset All "$ID" >/dev/null 2>&1 && echo "reset macOS privacy entries for $ID" || true
  done
  echo "Done. If System Settings still lists Caption Finder, reopen that page."
else
  echo
  echo "Nothing was changed. Run with --yes to apply."
fi
