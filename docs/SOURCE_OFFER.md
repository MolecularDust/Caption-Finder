# Corresponding source for bundled GPL tools

Caption Finder's macOS and Windows installers include FFmpeg and FFprobe, built with GPL and version 3 options. They are GPLv3+ programs and run as separate processes. The application's own code is MIT (see [LICENSE](../LICENSE)).

## What you can get

For the FFmpeg and FFprobe builds in each release:

- **Source:** FFmpeg 9.0.2, the version these builds are labelled with, from https://ffmpeg.org/download.html . [TO CONFIRM: the exact tarball and checksum used.]
- **Build recipe:** the build configuration and scripts used for the bundled binaries. [TO CONFIRM: the upstream builder and version used, and the configure flags.]
- **Licenses:** [LICENSES/ffmpeg-GPLv3.txt](../LICENSES/ffmpeg-GPLv3.txt) and [LICENSES/ffmpeg-windows.txt](../LICENSES/ffmpeg-windows.txt).

yt-dlp (with its bundled Python libraries) and Deno are bundled too. Their notices are in [LICENSES](../LICENSES), and their sources are at https://github.com/yt-dlp/yt-dlp and https://github.com/denoland/deno .

## Written offer

For at least three years from the release date, and as long as we distribute these builds, anyone may request the complete corresponding source for the FFmpeg and FFprobe builds in a release, plus the build recipe, by opening an issue at https://github.com/MolecularDust/Caption-Finder/issues . [TO CONFIRM: the offer period and contact.]
