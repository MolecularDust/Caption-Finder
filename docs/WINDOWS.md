# Windows development handoff

This repository currently contains a working macOS evaluation app. Moving the source to GitHub does not by itself produce a working Windows build.

## Initial setup

Install Git, a current Node.js LTS release, Rust (MSVC toolchain), Microsoft C++ Build Tools with the desktop C++ workload and Windows SDK, and WebView2. Follow the current [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/#windows).

Clone this repository, then run `npm ci`, `npm run build`, `npm test`, and `npm run lint` to check the shared frontend.

## Native port work still required

- `scripts/desktop.mjs` currently uses Unix PATH separators and launches a Unix npm executable. Adapt it for Windows or call `npm run tauri -- dev` directly during initial investigation.
- `scripts/install-tools.mjs` and `scripts/prepare-sidecars.mjs` support Apple Silicon macOS only. Add checksum-verified Windows downloads for yt-dlp, FFmpeg, FFprobe, and Deno, and prepare target-suffixed `.exe` sidecars.
- `src-tauri/src/platform.rs` must resolve `.exe` media tools and the Windows bundled certificate path. Current pause/resume/cancel process-group control is Unix-only; Windows needs appropriate child-process lifetime control before downloads can be considered supported.
- Add a Windows bundle configuration (for example NSIS), including the tools, certificates and third-party notices. The current default targets are `app` and `dmg`.
- Browser detection and file reveal currently contain macOS behavior; implement and verify Windows equivalents. Browser cookies and downloaded media must remain machine-local.
- Test the embedded YouGlish widget, caption lookup, preview, cutting, overwrite dialog, destination permissions, cooldown and queue controls on Windows. Do not mark the Windows app supported until the native download flow is verified.

Keep one shared codebase with platform-specific implementations. Preserve the existing Mac behavior while adding Windows support. Never commit cookies, downloaded videos, personal settings, or build output.
