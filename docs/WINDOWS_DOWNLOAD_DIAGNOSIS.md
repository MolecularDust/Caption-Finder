# Windows download investigation — 22 October 2026

## Findings

The reported HTTP 429 was a false classification. The original error text contained `ERROR: ffmpeg exited with code 4294957242`, alongside a connection reset. As an unsigned 32-bit Windows exit value, 4294957242 represents signed -10054 (connection reset). `safe_error` previously used `text.contains("429")`, so it incorrectly called this a YouTube rate limit. The historical message was not evidence of HTTP 429. No genuine HTTP 429 was captured in this investigation.

A separate Windows-specific route handoff explains the observed anonymous segment failure. This workstation has a manual Windows user proxy (loopback HTTP proxy), no proxy environment variables, and only local/private-address bypasses. yt-dlp's Python HTTP requests automatically discover that proxy. In yt-dlp 2026.10.21, however, FFmpeg's downloader only exports HTTP_PROXY/http_proxy when `params['proxy']` is explicitly set. The app did not set it, so metadata and FFmpeg segment traffic could use different routes. Explicitly forwarding the existing Windows manual proxy made the same public video's precise segment download succeed. No new proxy, alternate VPN, route rotation, impersonation, TLS bypass, or restriction bypass was introduced.

Opera authentication failed independently of YouTube: yt-dlp reported `Could not copy Chrome cookie database` (its generic Chromium-browser wording, including Opera). A read-open check without reading cookie contents found Opera's Default-profile cookie database but returned Windows error 32 (sharing violation). Local State was readable. Browser-cookie extraction did not succeed. DPAPI/app-bound encryption has not been established as the cause of this attempt; database access failed before cookie decryption could be demonstrated. No browser security settings or credentials were changed.

## Controlled tests and evidence

| Test | Result |
| --- | --- |
| One standalone anonymous metadata request, public video 8HfoKd873HY | Exit 0; five captured HTTP response status lines were 200; no HTTP 429 or 403, certificate failure, or connection reset. Verbose/traffic output was held only in memory; only an allowlisted summary was saved. |
| Prior failed segment log | Connection reset -10054 and FFmpeg unsigned exit 4294957242; no explicit HTTP 429 signature. |
| One post-fix anonymous precise segment, same video, 216.279–220.578 seconds | Exit 0; produced MP4. H.264 1280×720 + AAC, 4.333333-second output, full decode passed. No HTTP 429/403 or reset. |
| Native anonymous metadata/caption workflow, H14bBuluwB8 | Passed; English cues parsed and temporary caption metadata removed. |
| Separate Opera-authenticated segment attempt | Failed during cookie-database copy; no cookies extracted, no output, no HTTP 429/403 or connection reset. After the owner closed Opera, one authorized follow-up succeeded: the database was readable, cookies were extracted, yt-dlp exited 0, and a precise MP4 segment was produced without HTTP 429/403, reset, or decryption errors. FFprobe inspection and full decoding passed. |
| Browser/application egress measurement | One approved ipify request in Opera and one through the app's existing Windows-proxy route produced different public-IP fingerprints. |
| Mac egress measurement | Owner supplied SHA-256 from `curl -fsS https://api.ipify.org | shasum -a 256`; it differs from both Windows fingerprints. The samples do not verify a common public egress IP despite the same selected VPN server. |
| Native tests | 25 passed, two environment/network tests ignored by default. The configured-Windows-route test was run explicitly and passed without network access. |
| Frontend | Build, all 25 tests and lint passed. |

Different measured public IPs do not establish whether a VPN uses multiple exit addresses, split routing, protocol differences, or browser-specific routing. Opera showed no visible VPN indicator; the exact reason for its egress difference is not established. No repeated IP probes or network-setting changes were made. macOS environment/runtime behavior could not be inspected remotely; its egress fingerprint was supplied by the owner.

## Invocation trace and platform comparison

All three operations share `base(settings)` in src-tauri/src/lib.rs. It resolves the bundled yt-dlp, FFmpeg directory and Deno executable, and adds `--ignore-config --no-playlist --no-warnings --no-cache-dir --socket-timeout 20 --retries 0 --extractor-retries 0 --sleep-requests 3 --compat-options prefer-legacy-http-handler`. The fix also makes `--fragment-retries 0` explicit. No retry or automatic alternate-route strategy was added.

- Analysis adds `--dump-single-json --skip-download -- <normalized public video URL>`.
- Caption metadata uses the same metadata call. Caption transfer uses `--skip-download --sub-format json3 --sub-langs <language> --sleep-subtitles 3 --write-subs` or `--write-auto-subs`, plus `--load-info-json` for the already retrieved metadata.
- Downloads add queue progress/output/format options. Segments use `--download-sections *In-Out`; precise cuts add `--force-keyframes-at-cuts` and explicit FFmpeg output encoder options. The controlled precise test used the same base, Deno, FFmpeg, preferred <=1080p/AAC MP4 format, and cut options; it additionally omitted warning suppression so diagnostics could be classified.
- Browser mode adds only `--cookies-from-browser opera`; anonymous mode adds no cookie argument. Imported Netscape files use `--cookies <selected file>`. Neither mode changes proxy routing.

| Component | Checked-in macOS baseline | Windows tested |
| --- | --- | --- |
| yt-dlp | 2026.08.19, ARM64 macOS standalone | 2026.10.21, x64 Windows standalone |
| Deno | 2.9.7 ARM64 | 2.9.8 x64 |
| FFmpeg / FFprobe | 9.0.2 Riedl macOS static build | 9.0.2 Gyan static GnuTLS build |
| JS/runtime environment | DENO_V8_FLAGS=--jitless | Same; portable DENO_DIR/TEMP/TMP under Data |
| TLS | Bundled Mozilla CA via SSL_CERT_FILE | Same CA resource, Windows resource path; verification remains enabled |
| HTTP handler | Shared prefer-legacy-http-handler compatibility option | Same |
| Process ownership | Unix process groups | Windows suspended startup, Job Object assignment, then resume; no change to these controls in this fix |
| Browser cookies | macOS keychain/AES path | Windows database access, then DPAPI/AES-GCM path; Chromium app-bound encryption can impose additional restrictions |

Deno/JavaScript handling and certificate configuration were not changed: metadata/challenge handling succeeded with the existing Windows versions. Both earlier Schannel and GnuTLS builds failed without the route handoff; the existing GnuTLS build succeeded with it. This evidence supports the route/classifier fixes rather than an unsupported tool upgrade or certificate workaround. The Mac versions listed are the repository manifest baseline, not a live audit of the owner's Mac.

## Targeted changes

1. Parse explicit HTTP status markers with a three-digit boundary. Process exit codes and digits in URLs are not HTTP statuses. Normalize FFmpeg unsigned Windows exit values for diagnostics.
2. On Windows, read the current user's manual proxy using WinHttpGetIEProxyConfigForCurrentUser and explicitly pass an unambiguous existing HTTP proxy to yt-dlp, enabling its FFmpeg forwarding. Environment overrides retain precedence. PAC, credential-bearing/SOCKS proxies, different per-protocol proxy servers, and nonlocal bypass rules are not guessed or collapsed. macOS routing is unchanged.
3. Disable fragment retries explicitly, matching the displayed no-automatic-retries policy.
4. Distinguish a browser database-copy error from cookie decryption and HTTP failures. Advise closing all browser/background processes or importing a Netscape file; do not unlock databases, elevate the app, or bypass encryption.
5. Add safe structured diagnostics for invocation, analysis, caption metadata, caption transfer and download outcome.

## Safe diagnostics

Portable mode writes `Data/Diagnostics/media.jsonl`, rotating at approximately 1 MiB into `media.previous.jsonl`. Installed mode uses Tauri's application log directory. macOS uses the native application log directory with restrictive Unix permissions. Logging failure does not fail a media operation.

Records contain only fixed stage/authentication labels, OS, proxy source category, bundled yt-dlp/Deno version labels, Deno availability, exit code, explicitly recognized HTTP codes, normalized FFmpeg code, and boolean network/certificate/cookie-failure indicators. They contain no raw stdout/stderr, command arguments, request/response bodies, headers, URLs, video titles/IDs, file/profile paths, proxy addresses, cookies, authorization tokens, credentials, or IPs. Disk/rotation and synthetic-secret tests pass. Logs are intentionally less detailed than raw yt-dlp verbose output; absent HTTP codes mean no explicit code was emitted, not an invented success status.

Raw cookie contents were neither displayed nor logged. Existing historical integration logs remain ignored under .tools and were not added to source control. New controlled tests kept raw verbose output in memory and saved only sanitized summaries. No changes were pushed or merged.

## Remaining authenticated validation

Close Opera normally, including background processes, before a single follow-up authenticated test. If copying then works but decryption fails, classify that separately; do not disable Chromium security or use an elevation/decryption bypass. The single authorized follow-up after closing Opera passed cookie extraction and precise segment downloading, inspection, and full decoding. This confirms the database lock was the observed extraction blocker. Authenticated caption retrieval and private/account-restricted videos were not separately tested; successful extraction on this machine does not guarantee that all Chromium profiles or encryption configurations are supported.

## Primary source references

- [yt-dlp 2026.10.21 proxy discovery](https://github.com/yt-dlp/yt-dlp/blob/2026.10.21/yt_dlp/YoutubeDL.py)
- [yt-dlp 2026.10.21 FFmpeg proxy forwarding](https://github.com/yt-dlp/yt-dlp/blob/2026.10.21/yt_dlp/downloader/external.py)
- [yt-dlp 2026.10.21 browser-cookie handling](https://github.com/yt-dlp/yt-dlp/blob/2026.10.21/yt_dlp/cookies.py)


## Actual running-app investigation — 22 October 2026

The owner's exact failing example was `https://www.youtube.com/watch?v=qNU_eY5_kPo`, the second YouGlish result for `earmuff`, with Precise Cut left off (Fast Cut), anonymous mode, and default 1080p settings.

### Executable mismatch

The process initially running from `dist-portable/YouGlish Downloader/YouGlish Downloader.exe` was SHA-256 `2931253D2F790F9B3D377CA0BED4886BF92F421F679797D1EAF4FED1D62B285A`. It lacked the new diagnostic-log and cookie-error strings, and its adjacent Data folder contained no Diagnostics/media.jsonl. The corrected ZIP/release executable at that point was `135385F521CFFDF9D15D51A45EBB4E02680E17FA55801497FE22C22F10D874BE`.

The packaging script builds a fresh ZIP in a separate stage; it does not update an already extracted application folder. That folder had been left stale during the previous delivery. Therefore the original running process still had the old substring-based 429 classification and lacked the explicit proxy handoff. Its particular last failure cannot be reconstructed from a log that it never wrote. The earlier captured FFmpeg reset/exit evidence remains distinct from that unlogged attempt.

The app was closed normally and its existing extracted binaries refreshed from the ZIP, preserving Data and settings. After the additional filename fix below, the running executable, release executable and ZIP entry all match SHA-256 `C19569C8308DB3821A5F124D0A5D57AA2B611916AFD7DC8ADF2E66DD1ACD8AAD`.

### Additional Windows filename failure reproduced in the UI

Caption lookup succeeded, but Add to Download Queue rejected the default caption filename with: `This file name is reserved or contains characters Windows cannot save.` No download subprocess started. The caption was `Oh. I'm gonna earmuff my grandma when she watches this.`

Windows validation incorrectly rejected a sentence-final period in the filename stem even though the application appends `.mp4`. The final path ends in `.mp4`, not a period. The Windows-only check now accepts that valid name, preserving the existing macOS behavior and the Windows reserved-device/invalid-character checks. Two regression tests include writing the exact resulting filename on Windows. Validation rejections now emit a safe `queue_rejected` stage without recording the filename or request.

### Actual Tauri queue test after correction

No standalone yt-dlp network request was repeated in this investigation. Through the real native UI, selected the second `earmuff` result, clicked Look Up and Add to Download Queue, keeping the original caption text and Fast Cut setting.

- Caption metadata and caption transfer each exited 0 in the running app's `Data/Diagnostics/media.jsonl`.
- Native subprocess observation confirmed video `qNU_eY5_kPo`, section `*121.633-129.20999999999998` (caption 123.633–127.210 plus two-second padding), format `bv[height<=1080]+ba/b[height<=1080]`, explicit `--proxy`, bundled Deno, and no force-keyframe or certificate-bypass option.
- During the FFmpeg process, observed TCP connections went to the existing loopback proxy; no direct external connections were observed. The observer saved only proxy connection counts, safe option flags and the authorized public video ID, never signed media URLs or raw command lines. Windows can reuse PIDs, so tool identity was checked for each socket observation rather than inferred solely from the initial PID record.
- Queue outcome: Completed, 100%, 3,732,494 bytes. The diagnostic `download` record exited 0 with no explicit HTTP error, FFmpeg failure, reset, certificate failure or cookie failure.
- Output: H.264 1920×1080 + Opus in MP4, duration 7.662833 seconds; full FFmpeg decode exited 0. The UI reported verified duration 7.663s, +0.086s from the requested section, consistent with Fast Cut stream boundaries.
- The previous successful standalone test used a different video (`8HfoKd873HY`), AAC-preferred selection and Precise Cut/reencoding. It was not proof of this exact UI case; this native queue run now covers the actual requested video and Fast Cut format.
- Native regression suite: 27 passed, two environment/network tests ignored by default. No frontend source changed during this follow-up.

This run establishes successful anonymous browsing, caption lookup and Fast Cut downloading for this example through the actual application. It does not establish that every video/network path works. Authenticated mode was not repeated for this exact video; the earlier separately authorized Opera-closed extraction/precise-download test remains the authenticated evidence. No new HTTP 429 was observed, no route/security settings were changed, and no changes were pushed or merged.

When updating a portable installation, close the app and replace its extracted program files from the new ZIP while retaining the existing Data folder. Merely rebuilding or downloading the ZIP does not update an already extracted executable.
