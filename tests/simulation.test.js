import { describe, it, expect } from 'vitest';
import { LOTTERY_GAMES } from '../src/utils/games.js';
import { simulateUntilDivision1 } from '../src/utils/simulation.js';
import { recordDraw, migrate } from '../src/utils/stats.js';

// Deterministic seeded RNG (mulberry32) so simulations are reproducible
const seededRng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Tiny game where every draw is a jackpot → simulation must stop after 1 draw
const tinyGame = {
  mainPool: { count: 2, range: 2 },
  bonusPool: null,
  supplementary: null,
  cost: 1,
  drawsPerYear: 52,
  divisions: [
    { match: '2+0', name: 'Jackpot', prize: 1000, odds: 1 },
    { match: '1+0', name: 'Match 1', prize: 2, odds: 1 },
  ],
};

describe('simulateUntilDivision1', () => {
  it('stops after one draw when every draw is a jackpot', async () => {
    const result = await simulateUntilDivision1({
      game: tinyGame,
      systemSize: 2,
      ticketsPerDraw: 1,
      batchSize: 100,
      rng: seededRng(42),
    });
    expect(result.draws).toBe(1);
    expect(result.div1Won).toBe(true);
    expect(result.bestDivision.name).toBe('Jackpot');
  });

  it('fixes the old name.includes("1") bug — "Match 1+PB" is NOT Division 1', async () => {
    // Powerball US: the top division is "Jackpot"; "Match 1+PB" ($4) contains
    // the character '1' and used to stop the simulation early.
    const game = LOTTERY_GAMES.powerball_us;
    let draws = 0;
    const result = await simulateUntilDivision1({
      game,
      systemSize: 5,
      ticketsPerDraw: 1,
      batchSize: 1000,
      rng: seededRng(7),
      // Cap the run so the test is fast even on a jackpot miss:
      shouldAbort: () => draws >= 5000,
      onProgress: (snap) => { draws = snap.draws; },
    });
    // Whatever happened, it must NOT have stopped on a $4 "Match 1+PB" win.
    // (With 1 ticket/draw, hitting the real 1-in-292M jackpot in 5000 draws
    // is astronomically unlikely, so div1Won must be false.)
    expect(result.div1Won).toBe(false);
  });

  it('accumulates spent = draws × tickets × cost', async () => {
    const game = {
      ...tinyGame,
      cost: 2,
    };
    const result = await simulateUntilDivision1({
      game,
      systemSize: 2,
      ticketsPerDraw: 3,
      batchSize: 100,
      rng: seededRng(99),
    });
    expect(result.spent).toBe(result.draws * 3 * 2);
  });

  it('reports progress via onProgress', async () => {
    const snapshots = [];
    await simulateUntilDivision1({
      game: tinyGame,
      systemSize: 2,
      ticketsPerDraw: 1,
      batchSize: 100,
      rng: seededRng(1),
      onProgress: (snap) => snapshots.push(snap),
    });
    expect(snapshots.length).toBeGreaterThan(0);
    expect(snapshots[0]).toHaveProperty('draws');
    expect(snapshots[0]).toHaveProperty('div1Won');
  });
});

describe('recordDraw', () => {
  it('accumulates across calls and returns new objects (React-safe)', () => {
    let stats = {};
    stats = recordDraw(stats, 'saturday_lotto', { draws: 1, spent: 2, won: 30, divisions: { 'Division 4': 1 } });
    stats = recordDraw(stats, 'saturday_lotto', { draws: 1, spent: 2, won: 0, divisions: {} });
    expect(stats.saturday_lotto.draws).toBe(2);
    expect(stats.saturday_lotto.spent).toBe(4);
    expect(stats.saturday_lotto.won).toBe(30);
    expect(stats.saturday_lotto.divisions['Division 4']).toBe(1);
  });

  it('merges division counts', () => {
    let stats = {};
    stats = recordDraw(stats, 'oz_lotto', { divisions: { 'Division 1': 1 } });
    stats = recordDraw(stats, 'oz_lotto', { divisions: { 'Division 1': 2 } });
    expect(stats.oz_lotto.divisions['Division 1']).toBe(3);
  });
});

describe('migrate', () => {
  it('normalises legacy payloads to the current schema', () => {
    const legacy = {
      saturday_lotto: { draws: '5', spent: '10.5', won: '20', divisions: { 'Division 4': '2' } },
      powerball_us: { draws: 1, spent: 2, won: 3, divisions: {} },
      garbage: 'not-an-entry',
    };
    const stats = migrate(legacy);
    expect(stats.saturday_lotto.draws).toBe(5);
    expect(stats.saturday_lotto.spent).toBe(10.5);
    expect(stats.saturday_lotto.divisions['Division 4']).toBe(2);
    expect(stats.powerball_us.draws).toBe(1);
    expect(stats.garbage).toBeUndefined();
  });

  it('handles null/corrupt input gracefully', () => {
    expect(migrate(null)).toEqual({});
    expect(migrate('nope')).toEqual({});
    expect(migrate(42)).toEqual({});
  });
});
