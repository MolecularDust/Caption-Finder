# Agent collaboration instructions

Read [docs/COLLABORATION.md](docs/COLLABORATION.md) before changing this project.

- Each concurrently active agent must use a separate clone or Git worktree and its own branch. Never edit another agent’s working folder or switch its branch.
- Agent A is the continuing development/integration agent. Agent B works on a scoped review or change branch. These roles do not grant authority to overwrite each other’s work.
- Fetch before starting; record the exact base commit. Do not pull or merge into a dirty working tree. Preserve uncommitted user changes.
- Do not force-push shared branches, reset away changes, delete another agent’s files, or push directly to main without explicit user authorization. Submit changes through a pull request by default. Resolve overlapping edits deliberately and rerun affected checks.
- For an independent review, inspect code and report findings before changing it unless fixes were requested. Distinguish demonstrated defects from hypotheses. Historical status notes are not proof of current behavior.
- Never commit credentials, cookies, WebView profile data, local preferences, downloaded media, toolchains, or build output. Do not log cookie values. Use test fixtures without real credentials.
- Use the repository’s pinned media tools and existing build scripts. Do not substitute machine-specific absolute paths. Keep Mac and Windows behavior in mind; state which platforms were actually tested.
- Finish with a handoff based on [docs/HANDOFF_TEMPLATE.md](docs/HANDOFF_TEMPLATE.md), including branch, full commit hash, tests, limitations, and continuation steps. Building is not a source-code handoff: commit and push authorized changes.
- Do not restart a user’s running app or overwrite a running app bundle while downloads are active. Parallel app instances can share authentication/profile data; coordinate runtime tests and use disposable download destinations.
