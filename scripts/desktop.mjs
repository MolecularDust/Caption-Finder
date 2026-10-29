import { spawnSync } from "node:child_process";
import { resolve, delimiter } from "node:path";
import { homedir } from "node:os";
import { existsSync } from "node:fs";
const env = {
  ...process.env,
  ...(existsSync(".tools/cargo/bin/cargo")
    ? {
        CARGO_HOME: resolve(".tools/cargo"),
        RUSTUP_HOME: resolve(".tools/rustup"),
      }
    : {}),
  PATH: [
    resolve(".tools/cargo/bin"),
    resolve(homedir(), ".cargo/bin"),
    process.env.PATH,
  ].join(delimiter),
};
const r = spawnSync(
  process.execPath,
  [resolve("node_modules/@tauri-apps/cli/tauri.js"), ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env,
  },
);
process.exit(r.status ?? 1);
