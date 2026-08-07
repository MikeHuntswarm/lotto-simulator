// ============================================
// SYSTEM ENTRIES — domain rules for system play
// ============================================
// "What system entries does this game offer?" and "what does one cost?"
// are domain questions. They used to be computed inside RegionPage and
// re-derived by GameInfoBar; now they have one owner next to the engine.

import { nCr } from './engine.js';

// The maximum system size offered (System 20 cap)
const MAX_SYSTEM = 20;

// All entry types for a game: Standard plus System N for
// N = count+1 .. min(count+14, 20). Each entry knows its value token,
// its label, how many numbers are picked, and how many games it covers.
export const systemEntriesFor = (game) => {
  const entries = [{
    label: 'Standard',
    value: 'standard',
    size: game.mainPool.count,
    games: 1,
  }];
  const maxSystem = Math.min(game.mainPool.count + 14, MAX_SYSTEM);
  for (let i = game.mainPool.count + 1; i <= maxSystem; i++) {
    entries.push({
      label: `System ${i}`,
      value: `system_${i}`,
      size: i,
      games: nCr(i, game.mainPool.count),
    });
  }
  return entries;
};

// Numbers picked for an entry token ('standard' or 'system_N')
export const systemSizeOf = (value, game) =>
  value === 'standard' ? game.mainPool.count : parseInt(value.split('_')[1], 10);

// Games covered per ticket for an entry token
export const gamesPerTicketFor = (value, game) =>
  value === 'standard' ? 1 : nCr(systemSizeOf(value, game), game.mainPool.count);
