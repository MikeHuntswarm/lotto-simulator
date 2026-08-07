// ============================================
// SIMULATION ENGINE — the draw/simulation pipeline
// ============================================
// Deep module: the entire "run until Division 1" loop lives here behind
// a small interface. The page only renders progress. RNG is injected so
// tests can seed it; abort + progress are callbacks.

import { checkTicket, generateQuickPick, generateNumbers, prizeValue, isTopDivision, nCr } from './engine.js';

// Generate a full draw result for a game (main + bonus + supplementary)
export const generateDraw = (game, rng = Math.random) => {
  const mainNumbers = generateNumbers(game.mainPool.count, game.mainPool.range, [], rng);
  const bonusNumbers = game.bonusPool
    ? generateNumbers(game.bonusPool.count, game.bonusPool.range, [], rng)
    : null;
  const supplementary = game.supplementary
    ? generateNumbers(game.supplementary.count, game.supplementary.range, mainNumbers, rng)
    : null;
  return { mainNumbers, bonusNumbers, supplementary };
};

// Evaluate a list of tickets against a draw
export const evaluateTickets = (tickets, draw, game) =>
  tickets.map(ticket => ({
    ticket,
    result: checkTicket(ticket, draw, game),
  }));

// Accumulate wins into { won, divisions } using the prize-value authority
export const accumulateWins = (results) => {
  let won = 0;
  const divisions = {};
  for (const { result } of results) {
    if (!result) continue;
    for (const win of result) {
      won += prizeValue(win.division, win.count);
      divisions[win.division.name] = (divisions[win.division.name] || 0) + win.count;
    }
  }
  return { won, divisions };
};

// Run ONE draw against the given tickets. Returns the draw, per-ticket
// results, and the ledger (spent / won / divisions) in one object.
export const runSingleDraw = ({ game, tickets, rng = Math.random }) => {
  const draw = generateDraw(game, rng);
  const ticketResults = evaluateTickets(tickets, draw, game);
  const spent = tickets.reduce((sum, t) => sum + t.gamesPerTicket * game.cost, 0);
  const { won, divisions } = accumulateWins(ticketResults);
  return { draw, ticketResults, spent, won, divisions };
};

// Run draws until Division 1 (the top division) is hit or aborted.
//
// Interface:
//   game           — game config from the catalog
//   systemSize     — numbers picked per ticket (mainPool.count = standard)
//   ticketsPerDraw — how many fresh quick picks per draw
//   batchSize      — draws per batch before yielding to the UI
//   rng            — injectable RNG (default Math.random) for seeded tests
//   shouldAbort    — () => boolean, checked between batches
//   onProgress     — (progress) => void, called after each batch
//
// Returns: { draws, spent, won, divisions, div1Won, bestDivision,
//            yearsSimulated, drawsPerSec }
export const simulateUntilDivision1 = async ({
  game,
  systemSize,
  ticketsPerDraw,
  batchSize = 1000,
  rng = Math.random,
  shouldAbort = () => false,
  onProgress = () => {},
}) => {
  const startTime = Date.now();
  let totalDraws = 0;
  let totalSpent = 0;
  let totalWon = 0;
  let div1Won = false;
  let bestDivision = null;
  const divisions = {};

  const spentPerDraw = ticketsPerDraw * (systemSize === game.mainPool.count ? 1 : nCr(systemSize, game.mainPool.count)) * game.cost;

  const snapshot = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    return {
      draws: totalDraws,
      spent: totalSpent,
      won: totalWon,
      yearsSimulated: totalDraws / game.drawsPerYear,
      drawsPerSec: elapsed > 0 ? Math.round(totalDraws / elapsed) : 0,
      div1Won,
      bestDivision,
      elapsed,
    };
  };

  const runBatch = () => {
    for (let i = 0; i < batchSize && !div1Won && !shouldAbort(); i++) {
      // Generate fresh quick picks for this draw
      const tickets = [];
      for (let j = 0; j < ticketsPerDraw; j++) {
        tickets.push(generateQuickPick(game, systemSize, rng));
      }

      const draw = generateDraw(game, rng);
      const results = evaluateTickets(tickets, draw, game);
      totalDraws++;
      totalSpent += spentPerDraw;

      for (const { result } of results) {
        if (!result) continue;
        for (const win of result) {
          totalWon += prizeValue(win.division, win.count);
          divisions[win.division.name] = (divisions[win.division.name] || 0) + win.count;
          // Structural top-division check — NOT a name heuristic
          if (isTopDivision(win.division, game)) {
            div1Won = true;
            bestDivision = win.division;
          }
          if (!bestDivision || game.divisions.indexOf(win.division) < game.divisions.indexOf(bestDivision)) {
            bestDivision = win.division;
          }
        }
        if (div1Won) break;
      }
    }
  };

  while (!div1Won && !shouldAbort()) {
    runBatch();
    onProgress(snapshot());
    await new Promise(r => setTimeout(r, 10)); // yield to UI
  }

  onProgress(snapshot());
  return snapshot();
};
