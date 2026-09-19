# 0001: Top-prize identity is structural; simulation lives behind a deep module

Top-prize ("Division 1" / "Jackpot") identity is determined by position — the winning division
*is* `game.divisions[0]` — never by parsing the division name. The draw/simulation pipeline
(`simulateUntilDivision1`, draw generation, prize valuation) lives in `src/utils/simulation.js`
and `src/utils/engine.js` behind small interfaces (RNG injected, abort/progress as callbacks),
not inline in the region page. This was decided on 2026-08-08 after a codebase review confirmed
a correctness bug: the previous heuristic `win.division.name.includes('1') || name === 'Jackpot'`
matched the *$4* "Match 1+PB" / "Match 1+MB" tier (odds ≈ 1:92) as a jackpot for Powerball US and
Mega Millions, so "Run Until Division 1" stopped almost immediately on a $4 win instead of the
real jackpot (1:292M). The deep-module shape exists because the loop was previously welded into
the React component (`RegionPage.jsx`, 595 LOC) with the prize math duplicated across three call
sites and zero tests — none of which could be exercised without a browser.

Considered and rejected: name-based detection (the bug), a single-process-forever inline loop
(untestable, no locality), and in-component pry (kept prize math scattered). Consequence:
`isTopDivision(division, game)` and `prizeValue(division, count)` are the *only* authorities —
do not move prize logic back into callers, and never reintroduce name-matching for prize tiers.
All game configs keep `divisions` ordered top-prize-first (this is the invariant the structural
check relies on); adding a game must preserve that order.