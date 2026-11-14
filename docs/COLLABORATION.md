# Working with Agent A and Agent B

## Shared source and isolation

Repository: https://github.com/MolecularDust/Youglish-Downloader

GitHub is the shared source of truth. Each agent uses an independent folder and branch. The maintainer's working folder is a local path; it is not a requirement for other machines.

Agent A continues development and integrates changes when asked. Agent B can review or implement a scoped task. Give each agent its task and identify files likely to overlap. Agree who runs the desktop app when sharing a machine; separate Git folders do not isolate the app’s saved account session.

## Starting Agent B

Use a fresh clone for the simplest setup across machines (substitute the task-specific branch name):

```sh
git clone https://github.com/MolecularDust/Youglish-Downloader.git youglish-agent-b
cd youglish-agent-b
git fetch origin
git switch -c agent-b/review origin/main
git rev-parse HEAD
npm ci
```

Alternatively, Agent A can create a worktree from a clean repository:

```sh
git fetch origin
git worktree add ../youglish-agent-b -b agent-b/review origin/main
```

Each worktree needs its own dependencies. Do not copy node_modules or native build outputs between operating systems. Open the new folder as Agent B’s workspace so it has appropriate filesystem access. Use the user’s GitHub authentication, never a copied token or cookie file.

Suggested initial prompt:

> Work as Agent B in this separate checkout. Read AGENTS.md and docs/COLLABORATION.md. Record the base commit. Independently review the current code, especially session-cookie handling, temporary-file lifetime, filename validation, download publication and platform behavior. Report findings with severity, file/line references and reproduction evidence before making changes. Do not use real credentials or alter the user’s app session. If subsequently asked to fix issues, use your own branch, run relevant checks, push it and provide docs/HANDOFF_TEMPLATE.md as a completed handoff.

For an implementation task, replace the review scope with concrete acceptance criteria and explicitly authorize changes/push. Avoid assigning both agents the same files concurrently when possible.

## Checks and builds

Shared frontend:

```sh
npm run lint
npm test
npm run build
```

Native Rust with a standard installed toolchain:

```sh
cargo test --manifest-path src-tauri/Cargo.toml
```

Native builds need Tauri prerequisites and pinned sidecars; follow README.md, docs/DEPENDENCIES.md and docs/WINDOWS.md. Local `.tools` caches are optional and ignored by Git. A Mac pass does not establish Windows compatibility. GitHub Actions currently checks the frontend on macOS and Windows; native and network checks must be reported separately.

Use a disposable folder for media tests and report actual duration/audio/video checks. Network tests can fail for account, VPN or service reasons; do not label them passed without executing them. Session cookies are sensitive. App-session snapshots are temporary, runtime-only files; abrupt termination cleanup and Windows file protection deserve explicit review.

## Returning changes to Agent A

1. Run affected checks and inspect `git diff --check` and `git status --short`.
2. Stage only intended source/docs/tests. Review the staged diff for secrets and artifacts.
3. Commit and push the branch, then open a PR if authorized. Do not force-push main.
4. Complete the handoff template and give the user the PR URL, branch and full commit hash.
5. Stop changing that handoff commit while Agent A integrates it; communicate subsequent commits explicitly.

Agent A fetches the named branch and compares it with its own changes. On a clean integration branch, merge the review branch, resolve conflicts preserving both tasks, run affected checks and inspect the final diff. Push/merge main when the user authorizes it. Never use a blind folder copy or replace source with a built app.

## Source versus application state

Source changes transfer through Git; dependencies and apps are rebuilt locally. Download destinations, browser sessions and preferences stay on each machine. Do not include them in a handoff. App builds from separate folders may still share the same app identifier and WebView profile. Avoid concurrent sign-in/sign-out, playback diagnostics or downloads using that profile. Coordinate these tests with the user.

## Historical notes

`docs/PHONETIC_FORK_STATUS.md` records experiments in chronological order. Some entries describe superseded behavior. Check the current implementation and later entries before relying on an earlier claim. The README describes current setup; the handoff must identify any remaining uncertainty.
