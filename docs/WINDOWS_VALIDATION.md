# Windows validation — 22 October 2026

Correction: the historical rate-limit message below was caused by a classifier bug matching FFmpeg exit code 4294957242, not evidence of HTTP 429. The Windows proxy-handoff fix subsequently passed an anonymous remote precise-segment test. See [the current investigation](WINDOWS_DOWNLOAD_DIAGNOSIS.md). These original results are retained as a historical record.

Branch: windows-support. Tested on the owner's Windows 11 x64 workstation.

## Passed

- Node 24.22.0 and WebView2 155.0.4283.62 were already installed. Installed Visual Studio 2022 Build Tools 17.14.42, MSVC 14.44, Windows SDK 10.0.26100 and Rust MSVC 1.99.1. The Winget Rust installer failed after waiting for MSVC; direct execution of its verified Rustup installer successfully installed the toolchain.
- Frontend TypeScript/Vite release build, ESLint and all 25 Vitest cases.
- All 18 Rust unit tests, including real pause/resume heartbeat checks, cancel while paused, descendant cleanup on ownership drop, staging cleanup and collision-safe output publication. One network test is ignored by default.
- Explicit network test `cargo test --manifest-path src-tauri/Cargo.toml windows_public_caption_workflow -- --ignored`: passed. Retrieved/parses English speech captions and verifies request metadata cleanup.
- Pinned Windows yt-dlp 2026.10.21, Deno 2.9.8, FFmpeg/FFprobe Gyan 9.0.2: SHA-256 verified and executable version checks passed.
- Native release compilation, portable ZIP packaging and optional NSIS installer compilation.
- ZIP extracted outside the repository. Launched from C:\Windows with PATH restricted to Windows system directories, without an administrator token. The process stayed responsive and loaded the existing system WebView2 runtime. No Node/Rust processes are used by the release app. This is a restricted-PATH smoke test on a developer workstation, not an OS image with development tools uninstalled.
- Portable GUI: YouGlish search for hello loaded real results and played an embedded speech video. Selected caption was copied into File Name. Look Up retrieved supplied English captions through the native bridge and populated In/Out (216.279–220.578 seconds). Preview controls activated and the playhead advanced. Native destination dialog saved settings in app-local Data/settings.json. Queue creation, Pause and Resume worked.
- Real anonymous whole-video download/merge using the Windows sidecars (Big Buck Bunny, aqz-KE-bpKQ).
- Local fast cut and precise cut of the downloaded media. Precise output inspected as 5.000 seconds with H.264/AAC and decoded completely with FFmpeg.
- Failed GUI download displayed a safe rate-limit error and offered Retry. No partial/staging files remained in the isolated destination.

## Failed or not completed

- Direct remote fast/precise section downloads failed when FFmpeg opened Googlevideo URLs: connection reset -10054, with both Schannel and GnuTLS builds. A second speech video also failed. A packaged-app segment attempt subsequently hit a YouTube rate-limit response. Retries were stopped. No TLS verification bypass or silent whole-video fallback was added. These results prevent claiming successful end-to-end segment downloading.
- Complete GUI queue download, successful-file reveal, Retry completion, overwrite dialog in the GUI and subtitle embedding have not been demonstrated. Native publication/overwrite behavior is covered by unit tests. Cancellation/descendant cleanup is tested natively; the GUI cancel attempt raced with a request failure.
- Preview activation/playhead movement was observed; accurate acoustic boundaries and perceptual lip sync have not been independently measured.
- No private/account cookies were used. Browser extraction and authenticated video paths require owner testing; Chromium cookie encryption may prevent extraction.
- No physical USB launch: the listed removable drive had no usable media. The no-hard-link publication path is implemented, but a real FAT/exFAT filesystem test remains necessary.
- No clean Windows 11 VM without development tools was available; do not equate restricted PATH testing with that test. No macOS runtime/build regression test can be performed on this Windows workstation.
- NSIS was built but not installed/uninstalled. Binaries are unsigned evaluation builds. Exact corresponding-source obligations for bundled GPL tool builds remain before public redistribution.

Local raw test logs are under ignored .tools and are not committed because extractor logs can contain signed media URLs. No cookies, credentials, downloads, Data, build output, or machine-local settings are part of the source changes.
