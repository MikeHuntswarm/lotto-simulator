# Development Workflow

> **For agents:** this is the build loop for this repo. It decides *what to run and when to stop*.
> The commands are **not** in this file — they are in `scripts/verify.sh`. This file is the method;
> that script is the environment. Change the commands there.

**The loop:** verify → fix → commit → push → watch → green.

**Stack:** React / Vite / Vitest (JS)

## The one rule

**`bash scripts/verify.sh` is the gate.** It is the only thing that decides whether work may ship:

- **red** (non-zero exit) → not done. Fix the cause, re-run **from the top**.
- **green** (zero exit) → commit, push, watch CI.

CI runs *this same script* ([`.github/workflows/verify.yml`](.github/workflows/verify.yml)) — added because this repo previously had no push/PR gate at all. That is deliberate: one script means local and CI cannot drift apart. Never hand-run a subset of it and call it verified.

## The loop

### 1. Verify — run the whole gate
```bash
bash scripts/verify.sh
```
Runs this repo's stages in the order tabled below and stops at the first failure.

**Done when:** it exits 0, or you have a specific failing stage and its error text.

### 2. Fix
Fix the cause, not the symptom. Re-run `verify.sh` **from the top** — not just the stage that
failed. A fix that trades one stage's red for another's is not a fix.

If a stage is red for a reason you cannot fix in the repo (missing credential, dead external
service), **stop and say so**. Do not disable the check to get green — a disabled gate reports
success forever.

**Done when:** `verify.sh` exits 0.

### 3. Commit
One commit per logical change; the message states the *why*, not the file list.

**Done when:** nothing you intended to commit is still untracked.

### 4. Push
```bash
git push
```

### 5. Watch — a push is not done until CI says green
```bash
gh run list --limit 5                              # find the run for your head commit
gh run watch <run-id> --exit-status --interval 10
```
`gh run list --commit <sha>` returns empty while a run is still being created — don't wait on it.

**Done when:** the run for your head commit reports `success`. Queued or in-progress is not green.

### 6. CI red → back to step 2
Fix it on the spot, then commit, push, watch again. **Never leave a failed run in the list** and
move on — a red run is the work, not a footnote. After two attempts that cannot fix a red
in-repo, stop and report it rather than pushing a third.

**Done when:** the head commit is green and no failed run is left unresolved.

## Working rules

1. **Green locally is not green.** `verify.sh` is necessary, not sufficient — CI is the authority.
2. **Fix root causes.** Check the sibling call paths for the same defect, not just the reported site.
3. **A flaky red is still red.** Confirm it is a flake by re-running, then fix the flake or delete
   the bad test — never retry it away.
4. **Never disable a gate to pass it.** Quarantine with a reason and an issue, or fix it.
5. **Verify before asserting.** "Tests pass", "pushed", "CI green" are claims about the world — read
   the real output before saying them.
6. **Stop at the boundaries that need a human:** data deletion, secrets, spend, anything irreversible.

## This repo's gates

| # | Stage | Command |
|---|---|---|
| 1 | `lint` | `npm run lint` |
| 2 | `test` | `npm test` |
| 3 | `build` | `npm run build` |

`scripts/verify.sh` is the executable form of this table. If they disagree, the script wins.

---

## Known-red (recorded, not hidden)

`npm run lint` is **red on this repo today** and no CI gate has been added for that reason. The
state predates this document; nothing here caused it.

- Error: `ESLint couldn't find a configuration file` — the repo has **no eslint config at all**
  (`.eslintrc*` / `eslint.config.js` are all absent), while `package.json` still ships
  `eslint . --ext js,jsx --report-exclude... --max-warnings 0` on eslint 8.
- So the lint script has never been runnable; it fails before reading a single file.
- This repo had no CI, so nothing ever called it.

Adding an eslint config is real work, not a workflow change. Until then this repo's
`scripts/verify.sh` will report red at the `lint` stage and, deliberately, no CI gate runs it.
