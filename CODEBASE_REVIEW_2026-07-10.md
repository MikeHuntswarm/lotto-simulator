# Lotto Simulator — Codebase Review
**Date:** 2026-07-10 | **Reviewed by:** Hermes Agent

---

## 1. Identity & History

| Field | Value |
|-------|-------|
| **Project** | Lotto Simulator |
| **Version** | 1.0.0 |
| **Author** | MikeHuntswarm (1 contributor) |
| **First Commit** | 2025-12-24 |
| **Last Commit** | 2026-02-18 |
| **Total Commits** | 10 |
| **Branches** | `master` (only) |
| **Age** | ~2 months active development |

---

## 2. What It Is

A single-page React application that lets users simulate lottery draws across **12 international lottery games** (Australia, USA, Europe, Canada, Japan, Spain). Users can generate quick-pick tickets, run individual draws with animated ball displays, or launch a continuous "Run Until Division 1" simulation. Stats persist in `localStorage`.

---

## 3. Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| **Runtime** | Node.js 18+ | Build & dev |
| **UI Framework** | React 18.2 | Component library |
| **Build Tool** | Vite 5.0 | Dev server + bundler |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS |
| **Language** | JSX (ES Modules) | Source code |
| **Storage** | localStorage (lotto_stats_v5) | Persistent stats |
| **CSS** | PostCSS 8.4 | Build pipeline |
| **Linting** | ESLint 8.55 | Code quality |

**No** TypeScript, no testing framework, no CI/CD, no backend, no database.

---

## 4. Codebase Metrics

| Metric | Value |
|--------|-------|
| **Total source files** | 6 (3 JSX, 3 JS/JSX config) |
| **Total LOC (all files)** | 1,058 code lines (pygount) |
| **Source LOC (JSX only)** | ~781 code lines |
| **Largest file** | `LottoSimulator.jsx` (1,015 lines, ~93% of source) |
| **Test files** | 0 |
| **Markdown docs** | 3 research/internal files (2,081 lines) |
| **Config files** | 4 (vite, tailwind, postcss, package.json) |

---

## 5. Architecture

```
index.html
  └── main.jsx ──▶ App.jsx ──▶ LottoSimulator.jsx
                                          │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
              LOTTERY_GAMES      useState/useEffect/useCallback   NumberBall (inline component)
              const (static)     (11 state vars, 6 refs)         (#102)
              12 games, 74       Single massive component         Pure function
              division configs   handling ALL logic & UI          that does NOT get used —
              incl odds/prizes   (see §6 "Spaghetti" below)       rendered directly in JSX as
              & metadata                                                      <NumberBall /> without
                                                                              being exported
```

### Key Patterns Observed
- **Single component architecture** — everything lives in one file
- **Static data definitions** at module scope (LOTTERY_GAMES, helpers)
- **localStorage** for persistence — no server
- **refs for abort** (simulation cancel)
- **no state management library** — all local state

---

## 6. Deep Dive: The Spaghetti Factor

`LottoSimulator.jsx` (1,015 lines) is a **monolith**. Here's the breakdown:

| Section | Lines | What |
|---------|-------|------|
| LOTTERY_GAMES data | 7–273 | 12 game configs, 74 division tiers, odds, prizes |
| Pure utility functions | 279–387 | `formatCurrency`, `nCr`, `generateNumbers`, `generateQuickPick`, `checkTicket` |
| Component function | 393–1015 | **ALL 11 state variables + 6 refs + 15+ event handlers + render** |

### State Pollution (11 top-level `useState` + 2 `useRef`)
```
selectedGame, selectedSystem, tickets, drawResult, results, isDrawing, stats, activeTab,
isSimulating, simStats, simSpeed, simulationRef, abortRef
```
That's 11 state variables + 2 refs in one component. No `useReducer`. No custom hooks. No extracted sub-components (except the inline `NumberBall` which is actually **never called** — it's rendered via JSX syntax but defined inside the component body each render, a React anti-pattern).

### The `checkTicket` Algorithm (Lines 333–387)
Uses combinations math (`nCr`) to calculate win counts per division for a ticket-vs-draw matchup. Handles:
- Standard matches (5+0)
- Bonus ball matches (PB, MB, K)
- Supplementary ball edge cases (Aussie Div 6 "1+2" with two supps)
- System entry combinations

**Assessment:** The math is sophisticated but the branch logic for `bonusReq` handling (lines 353–378) is a series of nested `if/else` blocks that are hard to follow. Each lottery variant has subtly different supplement rules that get conflated.

### Simulation Engine (Lines 525–638)
- Async loop with batched draws (`simSpeed` draws per batch)
- Abort via `abortRef`
- UI updates every 10ms via `setTimeout`
- Generates random tickets + draws per batch (no caching)
- Tracks "best division" found and early-exits on Division 1

**Assessment:** Functional but could be slower under high batch sizes (5000) with complex games like EuroMillions (13 divisions, `nCr` calculations per ticket per batch).

---

## 7. Feature Modules

| Module | Coverage | Notes |
|--------|----------|-------|
| **Australia** (6 games) | ✅ Complete | Sat/Mon/Wed Lotto, Oz Lotto, Powerball AU, Set for Life |
| **USA** (2 games) | ✅ Complete | Powerball, Mega Millions |
| **Europe** (2 games) | ✅ Complete | EuroMillions, Eurojackpot |
| **Canada** (2 games) | ✅ Complete* | Lotto Max, Lotto 6/49 (research says "Coming Soon", but fully implemented) |
| **Japan** (2 games) | ✅ Complete | Loto 7, Loto 6 |
| **Spain** (1 game) | ✅ Complete | El Gordo Primitiva |
| **System Entries** | ✅ Implemented | System 7 through System 20 via nCr expansion |
| **Bulk Quick Picks** | ✅ Implemented | 1/5/10/20/50 buttons |
| **Run Until Div 1** | ✅ Implemented | Async simulation loop |
| **localStorage Stats** | ✅ Persistent | v5 schema, per-game |
| **Animated Balls** | Partial | CSS classes exist but no animation used in draw |
| **Tax calculations** | ❌ Not implemented | `taxFree` flag on Loto 7/6 but no logic |
| **Power Play / Megaplier** | ❌ Not implemented | Documented in research but not in code |

---

## 8. Database / Storage

| Aspect | Detail |
|--------|--------|
| **Storage** | `localStorage` (browser-only) |
| **Key** | `lotto_stats_v5` (schema version 5 — suggests 4 prior iterations) |
| **Schema** | `{ gameId: { draws: number, spent: number, won: number, divisions: { [name]: count } } }` |
| **No cleanup** | No data migration or schema version upgrade logic |
| **No backup/export** | User data is trapped in browser |
| **Risk** | Clears on browser data wipe; no cloud sync |

---

## 9. Test Infrastructure

| Aspect | Status |
|--------|--------|
| **Test framework** | None |
| **Test files** | 0 |
| **CI/CD** | None |
| **Coverage** | 0% |
| **Critical logic with zero tests** | `checkTicket()` — combinatorial odds math, system entries, supplement matching |
| **Simulation engine** | Untested |
| **Edge cases** | `generateNumbers()` infinite loop risk if `count > range`, `nCr` overflow |

---

## 10. Project Health

| Category | Rating | Notes |
|----------|--------|-------|
| **Architecture** | ⚠️ Fragile | Everything in one file; single point of change |
| **Testability** | ❌ None | No testing infrastructure at all |
| **Maintainability** | ⚠️ Difficult | 1,015-line component is hard to navigate |
| **Performance** | ⚠️ Concerning | `nCr` recalculated per division per ticket per draw |
| **Correctness** | ⚠️ Unverified | Odds math is complex and untested |
| **Code quality** | ✅ Clean style | Consistent formatting, no lint errors expected |
| **Type safety** | ❌ None | Plain JSX with no TypeScript |
| **Documentation** | ⚠️ Partial | README exists but is generic; research doc is thorough |

---

## 11. Pre-Scan Checklist

| Item | Status |
|------|--------|
| **Stale data** | ⚠️ `INTERNATIONAL_LOTTERY_RESEARCH.md` dated "December 2024" — lottery rules may have changed (e.g., Mega Millions Megaplier changed April 2025 per the doc itself) |
| **Unused dependencies** | ✅ None obvious — ESLint dependencies are installed but unused (no CI) |
| **Dead links** | ✅ README uses `yourusername/lotto-simulator` (placeholder — not critical) |
| **Hardcoded test/sample data in components** | ❌ All "data" is production config — no sample/test data |
| **Complex logic with zero tests** | ❌ `checkTicket()` with 74 division rules, system entries, supplement logic — zero tests |
| **Duplicate type definitions** | ✅ None found |
| **Inline component rendering** | ⚠️ `NumberBall` defined inside component body, never exported, re-created every render |
| **localStorage version drift** | ⚠️ Schema version `v5` but no migration logic |

---

## Summary

This is a well-researched, ambitious simulation tool crammed into a single massive component file. The **domain coverage is impressive** — 12 international lottery games with accurate odds and division structures. However, the **architecture is a single-file monolith** with no tests, no TypeScript, and no CI. The most critical risk is the `checkTicket()` combinatorial engine: it's the heart of the simulator's correctness, handles complex edge cases across 6 countries, and has **zero test coverage**. The simulation itself is unverified against known statistical distributions.
