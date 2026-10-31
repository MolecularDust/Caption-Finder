# YouGlish Downloader — latest update, 21 October 2026

The app is now named **YouGlish Downloader**. The existing identifier is retained so preferences survive the rename. Native icons and the in-app logo are generated directly from the user's supplied `Gemini_Generated_Image_btw8esbtw8esbtw8.jpeg`. The packaged ICNS hash matches the generated source ICNS.

## Latest changes and checks

- Widget autoplay is enabled for navigating to the next or previous sample. Native Next/Previous navigation was exercised; the next clip played through to its end, and Previous returned to the preceding source. Browsing continues independently of metadata retrieval.
- Selecting a source starts asynchronous metadata loading with a visible status/spinner. Once duration is known, In is zero and Out is the full duration. Controls stay disabled while duration is unavailable. Metadata requests are serialized, obsolete queued selections are skipped, and successful metadata is cached in memory.
- Native default bounds verified: `zFMXiiXfVX8` → 0–549s, `f0oc4gUCOQI` → 0–565s.
- In/Out inputs and both stacked arrow buttons share a fixed 52px control row. Validation messages live below that row. Length now uses the same custom arrow component with one-second steps rather than tiny native number arrows.
- Native Reset regression checks: invalid In text, invalid zero Out, and invalid zero Length were entered. Reset restored the full range and cleared errors even when underlying valid state had not changed. Preview and queue eligibility recovered. Length increase/decrease and In increase were exercised.
- Lookup no longer runs on blur. Clicking **Look Up**, or explicitly pressing Enter in File Name, starts lookup. The button becomes a disabled animated spinner with a Looking up label. Other controls remain responsive. Reset cancels applying a pending result and restores the full range.
- Native test: entering `I'll see ya next time` and leaving the field started no lookup. Clicking Look Up showed its spinner; successful supplied-caption matching populated 542.420–544.384s and restored the button. A progress screenshot is saved in `docs/lookup-progress.png`.
- The initial selected caption is retained as File Name while playback continues; blank end-of-video captions no longer replace it. Added decoding tests cover URL-encoded markers, `&nbsp;`, entities, and literal percent signs.
- Frontend build, lint, and all **21 frontend/domain tests** pass. The backend code is unchanged from the earlier passing 16 Rust tests. The final native development bundle was rebuilt and launched, with its title and Look Up accessibility label checked.

Current app: `src-tauri/target/debug/bundle/macos/YouGlish Downloader.app`. The earlier PhoneticCutter bundle is an older build; use the new named app. No new export was needed for these UI fixes. The earlier end-to-end export verification remains recorded below.

---

# PhoneticCutter verification — 21 October 2026

Forked from the clean local TubeCutter checkout at `/Users/mike/Documents/video-downloader`, upstream commit `b179193d2a4e0575c7cc49f2c8d6161c46b99cbd`. The original application was not edited. The new source and local evaluation app are in this project folder. Product name: PhoneticCutter; identifier: `com.mike.phoneticcutter`.

## Implemented

- Phrase input; language selector; language-specific accent options; all accents by default.
- Official YouGlish widget with its browsing, playback, speed, caption, and attribution controls. Search is manual; no phonetic ranking or result harvesting.
- Video ID and caption callbacks select the current source. URL-encoded captions are decoded before use as editable filename text.
- File Name matches against the full source subtitle track on Enter or blur. Supplied tracks first, untranslated original automatic tracks only as fallback. Temporary caption files are removed after parsing; cached cues remain in app memory for subsequent filename edits.
- Normalized whole-word phrase matching across adjacent subtitle cues, with overlapping rolling-caption text suppressed. Matching times refer to subtitle segments, not acoustic word boundaries. No automatic padding is applied in this app.
- Single match sets In/Out. Multiple occurrences require choosing a match. No match leaves timings unchanged. Stale results after changing source/text are ignored.
- One-second mini arrows on both timestamps; inherited direct edits, timeline, length control, and precise/fast cutting.
- Exact-cut preview temporarily uses the inherited YouTube player in the widget area; return button restores YouGlish. This is needed because the documented widget interface does not expose an absolute current-time or seek method.
- Download settings initially collapsed; destination and Add to Queue remain visible. 1080p preferred, with lower source resolutions as fallback.
- Anonymous authentication default, with installed Opera/Chrome/Firefox/Safari/Vivaldi detected on this Mac. Other supported browsers appear if installed in standard application folders. Cookies stay with local yt-dlp operations and are not injected into YouGlish.
- Inherited native file picker, queue controls, verification, and collision-safe output publishing. Download retries are disabled for media-service operations; a user can explicitly retry a failed job.

## Actual checks

- Frontend production build passed.
- ESLint and Rust Clippy (warnings treated as errors) passed.
- 19 frontend/domain tests and 16 Rust tests passed (35 total).
- Native macOS development .app bundle built and launched.
- Live native `ya` / English / All accents search loaded 18,005 YouGlish results; selected source ID and caption reached the app.
- File Name `ya think he got famous for bifocals` matched the supplied English captions of `f0oc4gUCOQI` and populated In `00:06:36.310`, Out `00:06:40.379`.
- Both timing mini controls were exercised: In increased by 1.000s, Out decreased by 1.000s, then both were restored.
- Preview played the selected passage and paused at approximately 400.385s, within milliseconds of the 400.379s Out point. Returning to YouGlish worked.
- Installed-browser options were inspected in the native settings menu.
- Anonymous video metadata and supplied subtitle retrieval succeeded after an initial connection failure. The first anonymous queued export failed with a generic media/network error; its exact cause was not established.
- Explicit retry using the previously authorized local Opera session completed through the native queue. The app published `smoke-output/ya think he got famous for bifocals.mp4`.
- Independent FFprobe check: 1920×1080 H.264 video, AAC audio, duration 4.087417s, size 1,241,946 bytes. FFmpeg decoded the entire final file without errors. Native queue reported completion and duration difference +0.018s.
- Anonymous mode was restored after testing. The selected destination remains the local `smoke-output` folder; use Choose folder to change it.

## Limits

This is a local development build, not a notarized release. The build uses inherited sidecars/resources; upstream release hashes and release-signing statements are not verification of this fork. Network failures remain possible, especially without a browser session. Automatic-caption fallback, non-English retrieval, lower-resolution live exports, and many-match selection have unit or implementation coverage but were not each exercised against live services. Browser detection covers standard macOS application folders, not arbitrary custom installations. The in-memory captions cache resets on app exit. Caption work already underway may finish after navigating to another source; stale UI updates are discarded.

No commercial YouGlish permission was obtained or contact sent. Its documented developer policy requires explicit permission for commercial API/widget use. The app uses the documented widget API and keeps attribution. API reference: https://youglish.com/api/doc/js-api

A native verification screenshot is saved as `docs/native-verification.png`. Older documents copied from TubeCutter under `docs/` are upstream reference material, not fresh tests of this fork.

## 2026-10-21 icon, typography, and failed-download investigation

Replaced icon assets with the supplied 066dfcee JPEG, as provided (its checkerboard is baked into the JPEG). Enlarged timing input text from 13px to 18px, preserving 52px controls. Rebuilt and opened the native app; visual proofs: icon-timestamp-update.png and larger-timestamps.png.

The reported Babish job used anonymous settings, 284.190–287.080 seconds, fast cut. Its original raw diagnostic was not retained, so the precise historical failure cannot be established. Found and fixed an overbroad classifier that treated any mention of cookies, including YouTube authentication advice, as a browser-cookie extraction failure; restricted format errors to the actual requested-format failure and preserved stderr line breaks. Regression tests cover misleading cookie advice, successful cookie extraction followed by 403, and harmless format log text.

A controlled anonymous reproduction with bundled tools succeeded at 1920x1080, AV1/Opus, 2.930167 seconds, and fully decoded with no errors. Retried the original job in the native app: Completed, 664410 bytes, verified duration 2.930s, +0.040s from selection. Output: smoke-output/Maybe don't pour it right over the hot burner, ya jackass..mp4. Proof: download-retry-success.png. This supports a transient original failure, not a demonstrated cookie-store problem. No authentication preference changed.

Validation: production frontend build, lint, all 21 frontend tests and 17 Rust tests passed. Debug macOS app bundle rebuilt.

## 2026-10-21 duplicate filename save fix

User reported failure at 100% with “Cannot save output”. Confirmed the exact target already existed from the earlier native retry test (664410 bytes, 13:49). Publishing used an atomic hard link and returned a combined collision/permission error on AlreadyExists. Fixed publishing to atomically try numbered names (1), (2), etc., preserving existing outputs and handling concurrent publishers. Permission failures now have a distinct actionable message; other filesystem errors retain their actual cause. Regression test verifies duplicate naming, occupied suffix skipping, preservation of existing bytes, and cleanup. All 17 Rust tests passed; rebuilt the native macOS bundle.

## Explicit filename collision choice

Replaced silent duplicate numbering with a native save-time dialog: Overwrite, Save as New, Cancel. Existing filenames are checked after verification and before publishing. Overwrite uses atomic same-volume rename; Save as New uses atomic no-overwrite numbered publishing; Cancel preserves existing output and marks the job canceled. The jobs lock is released while waiting for the dialog and cancellation is checked again before publication. Save tests verify replacement with distinct bytes and numbered copy preservation. Native app rebuilt.

## Automatic lookup on sample selection

The first nonempty YouGlish caption now triggers matching immediately, while video details load. Subtitle retrieval and metadata loading run concurrently; the existing metadata promise is shared rather than starting a second Analyze request. The selected caption is frozen, so subsequent playback captions do not retrigger lookup. Look Up / Enter remains an explicit retry after manual edits. Existing request-generation checks suppress results after switching samples or resetting. Updated helper text explains automatic timing selection. Production build, all 21 frontend tests, and lint passed; native app rebuilt.

Native verification: clicked Next from the first US “ya” result. The second sample (zFMXiiXfVX8) immediately showed Looking up / Retrieving subtitles while metadata loaded, then automatically selected 542.420–544.384 seconds without pressing Look Up. Edited filename phrase to “I'll see ya next time.” and confirmed explicit Look Up still matched using cached captions. Screenshot: docs/automatic-subtitle-timings.png.

## Manual lookup and padding

Removed metadata analysis and subtitle lookup on YouGlish video/caption events. Browsing only captures the current sample and first caption; timing, timeline, preview, reset, and Precise Cut controls remain gray and disabled. File Name and Look Up enable once a sample caption arrives. Manual Look Up loads metadata/captions and enables editing.

Added two-digit Padding (00–99) between Out and calculated Length, default 02 for initial/new selections and Reset. In/Out remain base boundaries. Preview, download request, selection highlight, and Length use max(0, In-padding) and min(duration, Out+padding). Effective bounds are shown below the controls. Length is now read-only because it is calculated. Padding changes are noncumulative. Tests cover both ends independently, zero padding, and full-video clamping. Frontend build, lint, and all 23 tests passed; native bundle rebuilt.

Native verification completed: browsing left timestamp/padding/preview/Precise Cut controls disabled with File Name and Look Up enabled. Manual lookup for f0oc4gUCOQI selected base 396.310–400.379; default padding 02 gave effective 394.310–402.379 and Length 8.069. Reset selected 0–565 with padding still 02 and Length correctly remained 565. Cached Look Up restored the matched padded selection. Screenshot: docs/manual-lookup-padding.png.

## Compact row and transparent icon

Applied approved compact layout: timing fields, Padding, calculated Length, Preview selection, and Reset share one row at normal desktop width without font/height changes. Padding and Length labels explicitly use two lines. Narrow windows below 780px retain a wrapped button fallback. Replaced baked-checkerboard JPEG icon with imagegen background-removed RGBA PNG, regenerated platform assets and macOS bundle. Alpha inspected using AppKit: exterior corner alpha 0, sparse exterior residue alpha 1/255 (effectively invisible). Native screenshot verifies aligned row: docs/compact-row.png. Production build and lint passed.

## Flat full-canvas red icon

Regenerated the icon as opaque full-bleed YouTube-red with subtle gradient and flat white speech/play artwork, removing bevels and exterior transparency. Removed the header icon blue background (#556ee4) and blue shadow that caused the visible outline; background is red and shadow none. Regenerated platform icons, rebuilt macOS app. Frontend build and lint passed.

## Beveled bubble icon and Length stepper

Applied approved generated hybrid icon: full-canvas flat red gradient with beveled white speech/play bubble. Regenerated platform assets and macOS bundle. Added matching Length up/down controls at ±1 second, changing base Out to adjust effective padded duration. Handles already-clamped end padding; increase at video end is a no-op; decrease retains a positive valid base selection. Padding and In stay unchanged. Expanded Length column by 10px to fit its stepper. Frontend production build, lint, and all 25 tests passed.

## Clear failed queue attempts

Clear Finished (renamed from Clear Completed) now clears completed, failed, and canceled queue entries. The button enables when any of those states exists, including a queue containing only failures. Queued/downloading/paused jobs remain visible; clearing only hides queue records and never deletes downloaded files. Updated backend regression test passed; frontend build and lint passed. macOS bundle rebuilt.

## 2026-10-21 — Reuse lookup extraction and space downloads

- Manual Look Up now receives video details and captions together from one backend request. Removed the parallel frontend Analyze request. Caption download uses yt-dlp `--load-info-json` with the initial extraction, eliminating the third metadata extraction. Temporary metadata is held in a private directory and cleaned up after use; existing in-memory caption caching remains.
- Existing `--sleep-requests 3` and `--sleep-subtitles 3` remain unchanged.
- Serialized queue waits ten seconds after the preceding attempt finishes (success, failure, or cancellation) before starting another, including retries. First attempt is immediate. Waiting job displays a rounded-up countdown, can be canceled, and cannot be paused until running.
- Validation: 25 frontend tests, 18 Rust tests, lint and desktop bundle build passed. Local HTTP fixture with bundled yt-dlp verified both supplied/automatic tracks requested only the caption endpoint using saved metadata, no extraction/media request. No live YouTube requests were needed for this validation.
- Rebuilt debug bundle; running app not restarted so current browsing/queue state is preserved. Restart to load changes.

## 2026-10-30 — Error pop-ups and filename repair

Replaced the general error banner with an accessible modal dialog (focus containment and Escape dismissal). Before queueing an invalid custom filename, show original and proposed names with Cancel / Fix name. Applying a fix changes only the filename and leaves queueing as a separate deliberate action. Portable sanitation strips incompatible characters and controls, protects Windows reserved names, removes trailing dots, supplies an empty-name fallback and truncates on Unicode boundaries to 180 UTF-8 bytes. Captions remain cached for subsequent phrase matching.

Validation: 27 frontend tests, lint, build, and macOS debug bundle passed. Existing running app left alone; restart to load the updated build.

## 2026-10-30 — Direct YouGlish window comparison

Added a diagnostic button below the search form that opens the official YouGlish website as a top-level WebView, using the entered phrase/language/accent. Remote window has no added IPC capabilities; it is separate from clip selection. Reopening reuses the test window. URL construction restricts origin and encodes path segments.

Frontend tests (27), Rust tests (19), lint and macOS debug bundle passed. Native UI test with `see your`, English/US, result 1 (I2xDZlpInik) loaded the full YouGlish site but YouTube still displayed “Sign in to confirm you’re not a bot”. Thus removing the local iframe layers alone did not fix the issue; this does not distinguish browser runtime from session/account differences. Left test window open for user comparison. Screenshot: direct-youglish-test.png (local only).

### 2026-10-30 — persistent session sign-in test
- Added Sign in to YouTube beside the diagnostic YouGlish button. Both navigate the same `youglish-test` window using the default persistent website store; remote content receives no IPC capabilities.
- Rebuilt and launched the app. Opened YouTube directly and clicked its Sign in link. Google's actual accounts.google.com email/phone sign-in page loaded successfully. User authentication and subsequent playback/restart persistence checks remain pending.
- Downloader cookie handling is unchanged; this is a playback session test, not yet downloader session integration.
- Validation: lint, frontend build, 27 frontend tests, 19 Rust tests, native debug app bundle passed.

### Cookie diagnostic result
- Added a localhost-only cookie diagnostic in the same session window. It reads only `yg_storage_probe`, never Google cookies.
- Verified live: navigator.cookieEnabled=true; a persistent test cookie was readable immediately, on a second page, and after quitting/relaunching the app (new localhost port). The exact test value survived. Removed test cookie afterward and verified ABSENT.
- This rules out globally disabled cookie storage or general persistence failure. It does NOT test Google's secure/HttpOnly cookies or cross-site login redirects; the cause of Google's cookie error remains unresolved.
- Lint and native debug bundle build passed.

### 2026-10-31 — resumed direct YouTube test
- Direct watch page for I2xDZlpInik loaded signed out and played from 17:14 to 17:17 inside the diagnostic window.
- Clicking YouTube Sign in recognized saved Google login and presented channel selection without credentials. Selected Tomaten Paste (the user's previously shown channel); YouTube then displayed Account menu/Notifications instead of Sign in.
- Reopened full YouGlish for see your / US: first sample loaded and Play produced Pause video. Main embedded widget also loaded the same sample and Play produced Pause video. No bot error on this sample in either context today.
- Limited result: not proof that sign-in caused the playback improvement (direct playback already worked signed out today; YouTube locale changed DE yesterday to RU today). Broad browsing reliability, YouTube-session restart persistence and downloader authentication remain unverified.

### 2026-10-31 — integrated playback account controls
- User reported 50 consecutive samples without playback errors.
- Removed diagnostic buttons from main search; removed localhost cookie test route and page.
- Account & Settings now provides Sign in to Google, Connect YouTube (official /signin route), and Check playback. Explains channel selection, reload, and account-menu sign-out.
- Verified Connect YouTube opens authenticated YouTube with Account menu. Persistent account store and restricted remote-window capabilities preserved.
- Existing subtitle/download authentication remains separate; app cookies are not exported to yt-dlp in this change.
- Lint, 27 frontend tests, frontend build and native debug bundle passed.

### 2026-10-31 — yt-dlp uses app session, verified
- Added App’s YouTube session download-authentication option and selected it for the live test. Metadata, subtitle retrieval, enqueue and retry prepare independent snapshots of the app’s YouTube cookies; unrelated domains are excluded.
- Runtime-only Arc guard retains each private temporary Netscape file through the operation/queue and removes it afterward. Cookie values and temporary paths are not serialized into settings. Unix files created with 0600; abrupt process termination can leave a temporary file (normal completion/failure/cancel release their guards).
- Corrected Wry cookies_for_url exact-domain filtering by reading the store then applying a strict youtube.com domain filter locally. No cookie values logged.
- Live lookup: Di0X3qWYAR8 supplied English captions found 1115.825–1118.075; padded selection 6.25s.
- Live download completed: /Users/mike/Documents/Weak Forms/Pronouns/you/App session test 2026-10-31.mp4. ffprobe confirmed audio + 1280x720 video, 6.269 seconds, 746803 bytes. No temporary session files remained.
- Validation: 21 Rust tests, 27 frontend tests, lint, frontend/native build passed. App-session authentication remains selected. Browser imports retained as optional fallback. Windows permissions/runtime behavior not yet tested.
