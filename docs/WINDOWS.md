# Windows builds and portable use

Windows x64 support is implemented on the shared codebase. The portable application and optional NSIS installer build successfully. Anonymous remote segment downloading now passes after correcting Windows proxy forwarding and a false HTTP-429 classifier. Opera cookie extraction and a precise segment download passed after Opera was closed, releasing its Windows database lock. See [the investigation](WINDOWS_DOWNLOAD_DIAGNOSIS.md) and [earlier validation](WINDOWS_VALIDATION.md). Anonymous and Opera-cookie precise segment tests passed; authenticated caption retrieval and restricted videos remain untested.

## Development prerequisites

Use Node.js 24 LTS, Rust with the x86_64-pc-windows-msvc toolchain, Visual Studio 2022 C++ Build Tools (Desktop C++ workload, MSVC and Windows SDK), and system WebView2. The launch script discovers the usual user Cargo installation even when a shell's PATH predates Rust installation. Tauri prerequisites: https://v2.tauri.app/start/prerequisites/#windows .

From the repository root:

```powershell
npm ci
node scripts/install-tools.mjs
npm run prepare:sidecars
npm run build
npm test
npm run lint
cargo test --manifest-path src-tauri/Cargo.toml
npm run desktop
```

The scripts dispatch to Windows implementations on win32; the existing Apple Silicon installer, sidecar signing, and macOS packaging remain in place. The Windows installer supports x64; other Windows architectures are rejected explicitly.

## Portable ZIP (preferred)

```powershell
npm run package:portable
```

Output: `dist-portable/YouGlish-Downloader-Windows-Portable.zip`.

Extract the entire ZIP into any writable directory. Run `YouGlish Downloader.exe`. No installation, administrator token, Node.js, Rust, or separately installed media tools is required at runtime. Windows 11 x64 and the existing system WebView2 runtime are required. The portable build never installs WebView2. Extract before running; do not launch inside the ZIP.

The ZIP includes the app, yt-dlp.exe, ffmpeg.exe, ffprobe.exe, deno.exe, certificate store, licenses/notices, exact tool versions/hashes and app-local Microsoft CRT DLLs. Build inputs are pinned and verified with upstream SHA-256 digests. ZIP entries are sorted with fixed timestamps; each invocation stages fresh files under .tools, never including an earlier runtime Data folder. Reproducibility requires the same compiler, SDK, dependencies, and build inputs; byte-for-byte reproducibility across different compiler installations is not claimed.

`portable.marker` next to the executable enables portable data paths:

- `Data/settings.json`: application settings, including selected paths and browser choice.
- `Data/Cache/captions`: per-request temporary caption metadata, removed after each request.
- `Data/WebView2`: embedded WebView browsing/session data.
- `Data/Temp` and `Data/Deno`: media-process temporary files and Deno cache.
- Downloads and their isolated temporary staging folders use the selected download destination. Publishing also supports filesystems without hard links, such as exFAT/FAT USB storage.

Move the whole app folder, including Data, with the app closed. Saved absolute download and imported-cookie paths may need to be selected again after a drive-letter change. The app reports a nonwritable portable directory rather than requesting elevation. Windows and WebView2 may still maintain system-level runtime/diagnostic state; this is not a claim of zero OS writes.

External browser profiles and credentials remain in the browser's normal OS locations. Browser choice only authorizes yt-dlp's existing cookie extraction; cookies are not copied into settings. Close all browser windows and background processes before extraction. Windows sharing violations during cookie-database copying are reported separately from decryption failures. Chromium's Windows cookie encryption can prevent extraction; explicitly import a Netscape cookies file if necessary. Cookie decryption and OS security protections are never bypassed.

## Native behavior

Windows media processes use Job Objects with kill-on-close ownership. Processes start suspended, are assigned to the job, and then resume. Descendants remain owned for cancellation/exit cleanup. Pause/resume suspends/resumes job-member processes (native Windows API); the running process is retained, so a long pause can still expire server connections. These operations do not persist across app restarts.

Windows resolves .exe media tools next to the app, bundled certificates under resources, detects common per-user/system browser executable locations, and reveals completed files in Explorer. macOS keeps Unix process groups and Finder reveal. Filename validation additionally rejects Windows reserved device names and invalid characters.

## Optional installer

```powershell
npm run package:windows
```

Creates `src-tauri/target/release/bundle/nsis/YouGlish Downloader_0.1.0_x64-setup.exe`. NSIS uses per-user installation and can download WebView2 if absent. Installed mode uses normal Tauri profile storage; portable mode is identified by portable.marker. The evaluation binaries are unsigned. Public redistribution still requires completing the exact bundled tools' corresponding-source/license obligations described in DEPENDENCIES.md.

No changes should be pushed or merged without the owner's approval.


Safe media diagnostics are stored in portable Data/Diagnostics/media.jsonl (rotated at approximately 1 MiB). They contain only allowlisted codes/flags and tool version labels, never raw output or authentication material. See WINDOWS_DOWNLOAD_DIAGNOSIS.md.
