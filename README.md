<!-- languages:start -->
<div align="center">

<details>
<summary><b>🌐 Language · Idioma · Langue · Sprache · Язык · 语言 · 言語 · 언어 · भाषा · لغة</b></summary>
<br>

<table>
  <tr>
    <td align="center"><b>English</b></td>
    <td align="center"><a href="docs/i18n/README.ar.md">العربية</a></td>
    <td align="center"><a href="docs/i18n/README.bn.md">বাংলা</a></td>
    <td align="center"><a href="docs/i18n/README.zh-Hans.md">简体中文</a></td>
    <td align="center"><a href="docs/i18n/README.fil.md">Filipino</a></td>
  </tr>
  <tr>
    <td align="center"><a href="docs/i18n/README.fr.md">Français</a></td>
    <td align="center"><a href="docs/i18n/README.de.md">Deutsch</a></td>
    <td align="center"><a href="docs/i18n/README.hi.md">हिन्दी</a></td>
    <td align="center"><a href="docs/i18n/README.id.md">Bahasa Indonesia</a></td>
    <td align="center"><a href="docs/i18n/README.it.md">Italiano</a></td>
  </tr>
  <tr>
    <td align="center"><a href="docs/i18n/README.ja.md">日本語</a></td>
    <td align="center"><a href="docs/i18n/README.ko.md">한국어</a></td>
    <td align="center"><a href="docs/i18n/README.fa.md">فارسی</a></td>
    <td align="center"><a href="docs/i18n/README.pt-BR.md">Português (Brasil)</a></td>
    <td align="center"><a href="docs/i18n/README.ru.md">Русский</a></td>
  </tr>
  <tr>
    <td align="center"><a href="docs/i18n/README.es.md">Español</a></td>
    <td align="center"><a href="docs/i18n/README.te.md">తెలుగు</a></td>
    <td align="center"><a href="docs/i18n/README.th.md">ไทย</a></td>
    <td align="center"><a href="docs/i18n/README.tr.md">Türkçe</a></td>
    <td align="center"><a href="docs/i18n/README.vi.md">Tiếng Việt</a></td>
  </tr>
</table>

</details>

</div>
<!-- languages:end -->

# Caption Finder

Find the moment a phrase is spoken in YouTube videos, pick the take you like, and download the trimmed clip.

Type a phrase, point the app at one channel, several channels, or a list of videos, and it scans their captions. Matches fill a list on the left. Pick one and the video loads on the right with In and Out points already set around the line. Adjust them, preview, and download just that part.

<p align="center">
  <img src="docs/screenshot.webp" alt="Caption Finder listing videos that match the phrase download, with the selected video loaded and its matching caption segments" width="420">
</p>

> Download only content you own or have permission to download.

## Install (Windows)

Get the setup from the [releases page](https://github.com/MolecularDust/Caption-Finder/releases): `Caption-Finder-Setup_<version>_x64.exe`. It needs Windows 11 on an x64 PC. The WebView2 runtime that the app uses is included in Windows 11.

1. Close Caption Finder if it is running.
2. Double-click the setup. Windows may warn that the app is from an unknown publisher, because it is not code-signed. Click **More info**, then **Run anyway**.
3. Choose one option:
   - **Install normally:** installs for your user account with no administrator rights. Adds a Start menu shortcut and an entry in Apps & features.
   - **Portable:** copies the app into a folder you choose, such as a USB drive. Nothing is added to the Start menu or the registry, and settings stay in a `Data` folder next to the app.
4. Click **Install**, then **Finish**.

To uninstall a normal install, use **Apps & features**. Your settings and sign-in data stay in your user profile.

You can also download `Caption-Finder-Windows-Portable.zip` from the same page. Extract the whole ZIP to a folder first, then run `Caption Finder.exe`. Do not run it from inside the ZIP.

## Install (macOS)

Get `Caption-Finder-Installer.dmg` from the [latest release](https://github.com/MolecularDust/Caption-Finder/releases) and open it. The window shows the steps:

1. Double-click **Install Caption Finder**.
2. macOS stops it ("can't be opened"). Click **Done**.
3. Double-click the blue **Open System Settings** tile, scroll to the bottom of Privacy & Security, and click **Open Anyway**.
4. Confirm with your password, then click **Continue** and **Install**.

The app is signed ad hoc and is not notarized, so macOS blocks the installer once. An app placed by Installer is not marked as downloaded, so Caption Finder itself opens without a block. Needs macOS 11 or newer on Apple silicon.

## Set up YouTube access

1. Install Caption Finder and open **Account & Settings**.
2. Under **Video player account**, click **1. Sign in to Google**, then **2. Connect YouTube**, and choose your channel if asked. Close the account window when you’re done.
3. Under **Download authentication**, choose **App’s YouTube session**.

You’re ready to use Caption Finder.

To use a browser you already have signed in to instead, choose it under **Download authentication**. On Windows, close that browser before you search: Chromium browsers lock their cookie file while they run, so the app’s own session is the reliable choice there. On macOS you do not need to close the browser. Only use your own account. Do not import or share anyone else’s cookies.

You can also keep **Anonymous**, but YouTube’s anti-bot checks are stricter for anonymous access, and some videos will fail.

## Using it

**Search across** picks the mode.

- **Channels:** type a name and a list of matching channels appears (Enter shows it at once). Click one to add it. A channel link or `@handle` is added directly, and a pasted video link suggests the channel it belongs to. Several channels are searched one after another, or mixed (one video from each in turn); see Account & Settings.
- **Videos:** paste video links (watch, `youtu.be` or Shorts), one or many. The listed videos are searched in order.

Then type a **Search phrase** and press **Search**. Results appear as they are found, newest first, up to 25 videos. Click one to open it; each shows the matching line and how many matches the video has.

On the right: the player, the matched line, a timeline, **Set In / Set Out** with padding and length, **Precise Cut**, **Preview selection**, and the file name. Choose a download folder and add the selection to the download queue. The queue supports pause, resume, cancel, retry and **Reveal file**, which shows the finished file in File Explorer on Windows or in Finder on macOS.

**Presets** save a list of channels or videos so you can bring it back. **Save preset** is disabled until the list has something in it. **Load preset** opens the presets folder to pick a file. Each mode has its own presets. Right-click a preset name for Load, Add to current list, Show in Finder, Rename and Remove from list. Right-click empty space for Clear files, Clear presets and Show presets folder. Removing a preset from the row never deletes its file. On Windows, **Show in Finder** keeps that label but opens File Explorer with the preset file selected, and **Show presets folder** opens the folder in File Explorer.

### Matching

- Case, punctuation and apostrophe style are ignored. A phrase can span adjacent caption cues.
- Languages with no spaces (Chinese, Japanese, Thai and similar) match character by character. Arabic and Hebrew vowel marks are ignored.
- The caption language follows the alphabet of the phrase (a Cyrillic phrase looks for Russian, Ukrainian and similar tracks), or the language each video is spoken in for Latin letters. **Caption language** in settings overrides this, which also reaches the dubbed audio tracks some channels publish.
- **Search in captions** limits the search to uploaded captions, to YouTube's automatic captions, or either (uploaded preferred). Translations are never used.
- Boundaries are caption-cue boundaries, not word-level alignment.

### Account & Settings

- **Video player account:** **1. Sign in to Google**, **2. Connect YouTube** (choose your channel if asked) and **Check playback** open a separate account window for the player. The login is kept in the app's own browser storage. On YouTube, an account avatar confirms you are signed in, and its account menu switches accounts or signs out. Close the window when you are done and search again to reload the player.
- **Download authentication:** where caption lookups and downloads get their YouTube sign-in. Choose **Anonymous** (the default), **App's YouTube session**, a browser the app finds on this computer, or **Import Netscape cookies…**. Cookies are never copied into the app's settings.
  - **Windows:** Chrome, Edge, Firefox, Brave, Chromium, Vivaldi and Opera are detected.
  - **macOS:** Chrome, Opera, Vivaldi, Firefox, Safari and others are detected.
- **On Windows:**
  - Close the browser completely, including its background processes, before you search or download with its cookies. Chromium browsers (Chrome, Edge, Opera, Brave, Vivaldi, Chromium) lock their cookie file while they run. If the app says it could not copy the browser cookie database, this is why.
  - Chromium's cookie encryption on Windows can still stop the extraction, and the app never bypasses it. Use **App's YouTube session** or **Import Netscape cookies…** instead.
  - The app passes the system's manual HTTP proxy (without a user name or password) on to yt-dlp, and honours `HTTP_PROXY` and `HTTPS_PROXY`. A PAC script or a bypass list with entries other than local addresses is not forwarded.
  - The download folder and an imported cookies file are saved as full paths. If a portable copy moves to a different drive letter, choose them again.
  - Pausing a download suspends its process, so a long pause can let YouTube drop the connection. Pause and resume do not carry over a restart of the app.
  - There is no Full Disk Access on Windows, so the macOS helper window below never appears.
- **On macOS:** Chrome and Firefox cookies need Full Disk Access; the app opens a small helper window with an icon to drag into System Settings.
- **File names** that Windows cannot save (reserved names such as `CON` or `NUL`, and characters such as `? * | < >`) are rejected on every platform, so a clip can move between the two.
- **Videos to scan per search** (per channel, default 50), **Results from several channels**, **Caption language**, **Search in captions**.
- **Don't play the first found video automatically**, and **While a video loads** (thumbnail or spinner).

## Where things are kept

| What | Windows (normal install) | macOS |
| --- | --- | --- |
| Settings (download folder, authentication) | `%APPDATA%\com.mike.captionfinder\settings.json` | `~/Library/Application Support/com.mike.captionfinder/settings.json` |
| Presets | `%APPDATA%\Caption Finder\Presets\Channels` and `...\Videos` | `~/Library/Application Support/Caption Finder/Presets/Channels` and `.../Videos` |
| The app's own YouTube sign-in | `%LOCALAPPDATA%\com.mike.captionfinder\EBWebView` | `~/Library/WebKit/com.mike.captionfinder` |

On Windows, caches and the media log (`logs\media.jsonl`, which holds only safe diagnostic codes) are also under `%LOCALAPPDATA%\com.mike.captionfinder`. A portable copy (the portable ZIP, or the setup's **Portable** option) keeps its settings, sign-in and caches in a `Data` folder beside `Caption Finder.exe`, with the log in `Data\Diagnostics`. Its presets still go to `%APPDATA%\Caption Finder\Presets`. Move a portable folder only while the app is closed.

Presets live outside the app's own folders on purpose: a reset or a reinstall leaves them alone. The app never deletes or overwrites a preset file without asking; replacing one keeps the old version beside it as `<name>.json.bak`.

## Development

Caption Finder is a [Tauri](https://tauri.app) desktop app (React and TypeScript in the window, Rust behind it) that drives [yt-dlp](https://github.com/yt-dlp/yt-dlp) and FFmpeg. Windows 11 (x64) and macOS (Apple silicon) both work; see [Windows](#windows).

Prerequisites: Node.js (24 LTS), Rust (the version is pinned in `rust-toolchain.toml`; `rustup` installs it), and the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your system. On Windows that means the Visual Studio C++ Build Tools (the Desktop development with C++ workload) and the WebView2 runtime.

```sh
npm ci
node scripts/install-tools.mjs     # fetches the pinned yt-dlp, FFmpeg, FFprobe and Deno
npm run prepare:sidecars
npm run desktop                    # development app
```

Checks:

```sh
npm run build        # type-check and build the frontend
npm test             # frontend tests
npm run lint
cargo test --manifest-path src-tauri/Cargo.toml
```

### Builds on Windows

| Command | Result |
| --- | --- |
| `npm run package:windows-installer` | The setup, `dist-installer/Caption-Finder-Setup_<version>_x64.exe`: install normally or make a portable copy. Needs NSIS, which Tauri downloads the first time `npm run package:windows` runs. |
| `npm run package:portable` | The portable ZIP, `dist-portable/Caption-Finder-Windows-Portable.zip`. |
| `npm run package:windows` | Tauri's own NSIS installer, in `src-tauri/target/release/bundle/nsis/`. It installs normally only, with no portable choice. |

The builds are not signed. Windows locks a program while it runs, so close Caption Finder before building or packaging, or the build cannot replace `caption-finder.exe`. See `docs/WINDOWS.md` for the details.

### Builds on macOS

| Command                     | Result                                                                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run package:dev`       | `Caption Finder Dev.app` in `src-tauri/target/debug/bundle/macos/`. Has its own identity (`com.mike.captionfinder.dev`), so testing it doesn't disturb the main app's settings or permissions. |
| `npm run package:app`       | `Caption Finder.app` in `src-tauri/target/release/bundle/macos/`.                                                                                                                              |
| `npm run package:installer` | The installer disk image, in `src-tauri/target/release/bundle/installer/`. Needs the app built first.                                                                                          |
| `npm run reset:app`         | Lists what a reset would remove; add `--yes` to do it. Clears settings, caches, the app's sign-in and macOS privacy entries for both builds. It does not touch presets.                        |

Rebuilding an app changes its ad-hoc signature, so macOS forgets its Full Disk Access grant: grant it again after a rebuild.

### Layout

- `src/main.tsx` is the interface. `src/search.ts` runs a search (batches, concurrency, rate-limit back-off). `src/channels.ts` and `src/languages.ts` hold the channel and language logic. `src/subtitles.ts` does the matching.
- `src-tauri/src/channel.rs` lists channel videos and looks up channels. `captions.rs` retrieves captions. `presets.rs` stores presets. `preview.rs` makes the low-resolution local preview. `session.rs` and `browser_access.rs` handle sign-in and cookies. `grant_helper.rs` is the macOS Full Disk Access helper window. `platform.rs` resolves tools and processes per OS.
- `scripts/installer/CaptionFinderSetup.nsi` and `scripts/package-windows-installer.mjs` build the Windows setup. `scripts/windows-payload.mjs` stages the files that the setup and the portable ZIP share.
- `tools/installer/` builds the macOS installer: an installer package plus a disk image whose window walks through Open Anyway.
- `docs/i18n/` holds this README in 19 other languages (the same ones as HomePad). `scripts/readme-languages.mjs` keeps the language chooser at the top of every page in sync, and `node scripts/readme-languages.mjs --check` verifies that each translation still has the same commands, file names, links and structure as this page. The Development section stays English-only.

### Translating the README

The translations were written by an AI and have not been reviewed by native speakers. The app itself is English-only, so button and menu names stay in English in every translation, and Windows and macOS's own labels are translated with the English in brackets. To add a language, add a row to `LANGUAGES` in `scripts/readme-languages.mjs`, write `docs/i18n/README.<code>.md` with the two `<!-- languages:... -->` markers at the top (copy another language's file as the template), then run `node scripts/readme-languages.mjs` and `node scripts/readme-languages.mjs --check`. When this README's user-facing sections change, update the translations too; the check reports what has drifted.

`docs/DEPENDENCIES.md` lists the third-party tools and their licenses. The other files in `docs/` come from the project this was forked from and still describe it (see [Credits](#credits)).

## Windows

Windows 11 (x64) works, with unsigned builds. See [Builds on Windows](#builds-on-windows) for the commands and `docs/WINDOWS.md` for the details. The setup and the portable ZIP are built from the same staged files. Windows may show a reputation prompt, because the builds are not signed.

**Tested on Windows 11 x64:** the YouTube sign-in window, channel lookup from a pasted video link, caption search, `cargo test`, and the setup (portable and regular installs, refusal while the app is running, upgrade, uninstall).

**Still to check or finish:**

- **Signed-in use and downloads:** a search with the app's YouTube session or browser cookies, then a preview and a download end to end. Previews, downloads and format analysis still use yt-dlp's legacy HTTP handler, which is slow behind a local proxy; lookups and caption search use the default one.
- **macOS-only parts:** the Full Disk Access helper (`grant_helper.rs`) and the browser access check (`browser_access.rs`) do nothing on Windows and leave unused-code warnings.
- **Channel lookup cancel:** on Windows, typing past a lookup lets it finish; on macOS it stops the lookup's yt-dlp process (`run_lookup` in `channel.rs`).
- **Presets:** stored in the user data folder (`%APPDATA%\Caption Finder\Presets\...`). A portable copy keeps its other data next to the app, so decide where presets should go.
- **Reveal in file manager:** `reveal_preset` and the Show presets folder action have Windows branches that have not been tested.
- **Leftover names:** `docs/WINDOWS.md` still uses the parent project's names in places.

## Credits

Caption Finder started as a fork of [YouGlish Downloader](https://github.com/MolecularDust/Youglish-Downloader), itself a fork of TubeCutter. The download queue and much of the packaging come from that work. Third-party tools (yt-dlp, FFmpeg, Deno, and the libraries in the apps) keep their own licenses; see `LICENSES/` and `docs/DEPENDENCIES.md`. The FFmpeg builds used are GPL, so redistributing the app means following those terms.

Licensed under the MIT License; see `LICENSE`. YouTube's [Terms of Service](https://www.youtube.com/t/terms) and [Google's Privacy Policy](https://policies.google.com/privacy) apply to what you do with YouTube content.
