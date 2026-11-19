import { existsSync, mkdirSync, readFileSync, rmSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildRelease, run, stagePayload } from "./windows-payload.mjs";
if (process.platform !== "win32" || process.arch !== "x64")
  throw Error("Build on Windows x64.");
// Tauri downloads NSIS here the first time it builds an installer.
const makensis = join(
  process.env.LOCALAPPDATA ?? "",
  "tauri",
  "NSIS",
  "makensis.exe",
);
if (!existsSync(makensis))
  throw Error(
    `makensis not found at ${makensis}. Run npm run package:windows once so Tauri downloads NSIS.`,
  );
buildRelease();
const payload = resolve(".tools/installer/payload");
rmSync(payload, { recursive: true, force: true });
mkdirSync(payload, { recursive: true });
stagePayload(payload);
const version = JSON.parse(
  readFileSync("src-tauri/tauri.conf.json", "utf8"),
).version;
const outDir = resolve("dist-installer");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `Caption-Finder-Setup_${version}_x64.exe`);
if (existsSync(outFile)) unlinkSync(outFile);
run(makensis, [
  `/DPAYLOAD=${payload}`,
  `/DOUTFILE=${outFile}`,
  `/DICON=${resolve("src-tauri/icons/icon.ico")}`,
  `/DVERSION=${version}`,
  resolve("scripts/installer/CaptionFinderSetup.nsi"),
]);
console.log(`Created setup with install and portable options: ${outFile}`);
