# Lotto Simulator

## User Preferences

- Make tool decisions autonomously without asking yes/no confirmation
- Proceed with actions directly, don't ask for permission


## ?? MANDATORY: CI/CD Monitoring

**ALWAYS check GitHub Actions after ANY push.** This is non-negotiable.

### After Every `git push`:

```bash
gh run list --limit 3  # Check workflow status
```

### If ANY workflow fails:

1. **STOP** all other work immediately
2. Run `gh run view <id> --log-failed` to see the error
3. **Fix the failure** before continuing
4. Push the fix and verify CI passes

### Never:
- Ignore failing workflows
- Continue coding while CI is red
- Deploy with failed checks

**CI failures are P0 blockers. Period.**

---


## Mandatory UI Verification

**ALWAYS verify the application is working after ANY code changes.**

### After Every Code Change:

1. Start dev server: `npm run dev`
2. Test UI loads at http://localhost:5173 (or configured port)
3. Check browser console for errors
4. Test simulation functionality

**Do NOT consider a task complete until verification passes.**

## Overview

React application for simulating lottery draws and analyzing outcomes. Simple SPA with React.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React (Vite) |
| UI | React, CSS |
| Build | Vite |

## Key Directories

```
/src           - React source code
/public        - Static assets
/node_modules  - Dependencies
```

## Commands

```bash
npm run dev     # Start development server
npm run build   # Production build
npm run preview # Preview production build
npm run lint    # ESLint check (if configured)
```

## Security Checklists Applied

- `react.md` - React security
- `general-web.md` - Web fundamentals

---

## Project Management

### Trigger Phrases

| Phrase | Action |
|--------|--------|
| "What's next?" | Show current phase and next pending task |
| "Project status" | Show overall progress |
| "Review" / "Audit" | Generate PROJECT_REVIEW.md |
| "Maintenance" | Run code hygiene checks |

---

## Project Agent Skill

**Load `.claude/skills/project-agent/SKILL.md` for methodology enforcement.**

### System Skills

| Skill | Path | Use For |
|-------|------|---------|
| **frontend-design** | `/mnt/skills/public/frontend-design/SKILL.md` | UI/UX |

---

## Pre-Deployment Workflow (MANDATORY)

**Before ANY deployment, the following steps MUST complete successfully:**

### Step 1: Stage, Commit, and Push

```bash
git add -A
git status
git commit -m "[type]: [description]"
git push origin [branch]
```

### Step 2: Monitor GitHub Actions

```bash
# List recent workflow runs
gh run list --limit 10

# Watch active run until completion
gh run watch [run-id]

# Check for failures
gh run list --status failure --limit 10
```

### Step 3: Handle Failed Workflows

**If any workflow fails:**

1. View failure details: `gh run view [run-id] --log-failed`
2. Identify root cause
3. Fix the issue
4. Commit and push fix
5. Rerun failed jobs: `gh run rerun [run-id] --failed`
6. Monitor until passing

### Step 4: Resolve ALL Failed Runs

**⚠️ CRITICAL: A new passing run does NOT clear old failures.**

Every failed workflow must be explicitly resolved. Do not proceed until the failure list is empty or all failures are documented as superseded.

```bash
# List ALL failed runs
gh run list --status failure --limit 50
```

**For EACH failed run, you MUST:**

1. **Check if superseded** (failure was from old code that's now fixed):
   ```bash
   # Get the commit SHA of the failed run
   gh run view [failed-run-id] --json headSha -q '.headSha'
   
   # Compare to current HEAD
   git rev-parse HEAD
   
   # If different AND the fix addresses the failure → Superseded
   ```

2. **If superseded**: Document it, then the failure can be ignored
   - Add to commit message: "Supersedes failed run [id] - [reason]"
   - OR note in PR description

3. **If NOT superseded** (same SHA or issue still exists):
   - **STOP** - Do not create new commits to "cover" the failure
   - **FIX** the actual issue in the code
   - **PUSH** the fix
   - **WAIT** for new run to complete
   - **VERIFY** new run passes

4. **Never do this:**
   - ❌ Push a new commit hoping the old failure "goes away"
   - ❌ Ignore red runs because a newer green run exists  
   - ❌ Assume failures are "flaky" without investigation
   - ❌ Proceed with deployment while ANY failure is unresolved

**Resolution Status Check:**
```bash
# This should return EMPTY before proceeding
gh run list --status failure --limit 50 --json databaseId,name,headSha,createdAt

# If not empty, resolve each one explicitly
```

### Step 5: Deployment Gate Check

```
┌─────────────────────────────────────────────────┐
│ 🚀 DEPLOYMENT READINESS CHECK                   │
├─────────────────────────────────────────────────┤
│ [✓/✗] All commits pushed                        │
│ [✓/✗] All workflow runs passing                 │
│ [✓/✗] No unresolved failed actions              │
│ [✓/✗] Security checklist complete               │
│ [✓/✗] PROJECT_REVIEW.md generated (if review)   │
├─────────────────────────────────────────────────┤
│ DEPLOY STATUS: [READY / BLOCKED]                │
└─────────────────────────────────────────────────┘
```

**HARD BLOCK**: Deployment cannot proceed if:

- Any current workflow is failing
- Unreviewed past failures exist
- Critical/High security issues unresolved

**Note**: CI/CD is a HARD BLOCK (not scored) - deployment cannot proceed with failed workflows.
