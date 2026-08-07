import { describe, it, expect } from 'vitest';
import { prizeValue, isTopDivision, nCr, generateNumbers, checkTicket } from '../src/utils/engine.js';

// Deterministic seeded RNG (mulberry32) so tests are reproducible
const seededRng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

describe('nCr', () => {
  it('computes combinations correctly', () => {
    expect(nCr(6, 6)).toBe(1);
    expect(nCr(7, 6)).toBe(7);
    expect(nCr(8, 6)).toBe(28);
    expect(nCr(20, 6)).toBe(38760);
    expect(nCr(5, 0)).toBe(1);
    expect(nCr(5, 6)).toBe(0);
  });
});

describe('generateNumbers', () => {
  it('generates unique sorted numbers within range', () => {
    const rng = seededRng(1);
    const nums = generateNumbers(6, 45, [], rng);
    expect(nums).toHaveLength(6);
    expect(new Set(nums).size).toBe(6);
    expect(nums.every(n => n >= 1 && n <= 45)).toBe(true);
    expect(nums).toEqual([...nums].sort((a, b) => a - b));
  });

  it('respects excludes', () => {
    const rng = seededRng(2);
    const nums = generateNumbers(2, 10, [1, 2, 3], rng);
    expect(nums).toHaveLength(2);
    expect(nums.every(n => ![1, 2, 3].includes(n))).toBe(true);
  });
});

describe('prizeValue', () => {
  it('values a plain prize at face value', () => {
    expect(prizeValue({ prize: 100 }, 1)).toBe(100);
    expect(prizeValue({ prize: 100 }, 3)).toBe(300);
  });

  it('values monthly/annuity prizes as prize × duration', () => {
    const div1 = { prize: 20000, prizeType: 'monthly', duration: 240 }; // Set for Life Div 1
    expect(prizeValue(div1, 1)).toBe(4800000);
    expect(prizeValue(div1, 2)).toBe(9600000);
  });

  it('handles refund/free prizes with zero or face value', () => {
    expect(prizeValue({ prize: 0, prizeType: 'free' }, 1)).toBe(0);
    expect(prizeValue({ prize: 1.5, prizeType: 'refund' }, 1)).toBe(1.5);
  });
});

describe('isTopDivision', () => {
  it('is structural — compares against divisions[0], not the name', () => {
    const game = {
      divisions: [
        { name: 'Jackpot', prize: 1000000 },
        { name: 'Match 1+PB', prize: 4 }, // the old heuristic matched this name
        { name: 'Match PB', prize: 4 },
      ],
    };
    expect(isTopDivision(game.divisions[0], game)).toBe(true);
    // The old name.includes('1') bug: "Match 1+PB" contains '1'
    expect(game.divisions[1].name.includes('1')).toBe(true);
    expect(isTopDivision(game.divisions[1], game)).toBe(false);
    expect(isTopDivision(game.divisions[2], game)).toBe(false);
  });
});

describe('checkTicket', () => {
  const game = {
    mainPool: { count: 6, range: 45 },
    supplementary: { count: 2, range: 45 },
    divisions: [
      { match: '6+0', name: 'Division 1', prize: 1000000, odds: 1 },
      { match: '5+1', name: 'Division 2', prize: 10000, odds: 1 },
      { match: '5+0', name: 'Division 3', prize: 1000, odds: 1 },
      { match: '4+0', name: 'Division 4', prize: 30, odds: 1 },
      { match: '3+1', name: 'Division 5', prize: 20, odds: 1 },
      { match: '1+2', name: 'Division 6', prize: 15, odds: 1 },
    ],
  };

  const ticket = {
    mainNumbers: [1, 2, 3, 4, 5, 6],
    bonusNumbers: null,
    supplementary: [7, 8],
    gamesPerTicket: 1,
  };

  it('returns null when nothing matches', () => {
    const draw = { mainNumbers: [10, 11, 12, 13, 14, 15], supplementary: [16, 17] };
    expect(checkTicket(ticket, draw, game)).toBeNull();
  });

  it('detects Division 1 on a full match', () => {
    const draw = { mainNumbers: [1, 2, 3, 4, 5, 6], supplementary: [7, 8] };
    const wins = checkTicket(ticket, draw, game);
    expect(wins.some(w => w.division.name === 'Division 1' && w.count === 1)).toBe(true);
  });

  it('handles the Aussie Div 6 supplementary edge case', () => {
    // Saturday Lotto semantics: you pick 6 numbers; the draw draws 6 main
    // + 2 supplementary from the same pool. Div 6 = 1 main match + 2 of
    // your numbers landing in the draw's supplementary.
    // Ticket [1..6]; draw main has 1, supplementary has 2 and 3 → 1+2.
    const draw = { mainNumbers: [1, 40, 41, 42, 43, 44], supplementary: [2, 3] };
    const wins = checkTicket(ticket, draw, game);
    expect(wins.some(w => w.division.name === 'Division 6' && w.count === 1)).toBe(true);
  });
});
