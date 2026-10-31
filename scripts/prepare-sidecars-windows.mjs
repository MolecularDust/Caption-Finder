import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
if (process.platform !== "win32" || process.arch !== "x64")
  throw Error("Windows x64 required");
mkdirSync("src-tauri/binaries", { recursive: true });
const manifest = [];
for (const name of ["yt-dlp", "ffmpeg", "ffprobe", "deno"]) {
  const src = `.tools/bin/${name}.exe`,
    dst = `src-tauri/binaries/${name}-x86_64-pc-windows-msvc.exe`;
  const r = spawnSync(src, [name.startsWith("ff") ? "-version" : "--version"], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (r.status !== 0) throw Error(`Cannot execute ${name}: ${r.stderr}`);
  copyFileSync(src, dst);
  manifest.push({
    name,
    target: "x86_64-pc-windows-msvc",
    sha256: createHash("sha256").update(readFileSync(src)).digest("hex"),
    version: r.stdout.split("\n")[0].trim(),
  });
}
writeFileSync(
  "docs/tool-manifest-windows.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
