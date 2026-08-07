// ============================================
// STATS STORE — persistence behind an adapter
// ============================================
// loadStats / saveStats sit behind a storage seam (default: localStorage).
// recordDraw owns the accumulation logic that used to be duplicated in
// runDraw and runSimulation. A schema change bumps STORAGE_KEY and adds a
// migration step in migrate() — one file, not four silent versions.

const STORAGE_KEY = 'lotto_stats_v5';

// Default adapter: browser localStorage. Injectable for tests.
const defaultStorage = () => (typeof localStorage !== 'undefined' ? localStorage : null);

// Normalise a raw stored payload into the current schema. This is the
// migration hook: if STORAGE_KEY is bumped to v6, add the v5→v6 step here.
export const migrate = (raw) => {
  if (!raw || typeof raw !== 'object') return {};
  const stats = {};
  for (const [gameId, entry] of Object.entries(raw)) {
    if (!entry || typeof entry !== 'object') continue;
    const divisions = {};
    if (entry.divisions && typeof entry.divisions === 'object') {
      for (const [name, count] of Object.entries(entry.divisions)) {
        divisions[name] = Number(count) || 0;
      }
    }
    stats[gameId] = {
      draws: Number(entry.draws) || 0,
      spent: Number(entry.spent) || 0,
      won: Number(entry.won) || 0,
      divisions,
    };
  }
  return stats;
};

// Load stats from the storage adapter (empty object if none / corrupt)
export const loadStats = (storage = defaultStorage()) => {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    return raw ? migrate(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
};

// Save stats to the storage adapter
export const saveStats = (stats, storage = defaultStorage()) => {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // storage unavailable (private mode, SSR) — fail silently
  }
};

// Accumulate one draw into stats. Pure: returns a new stats object so
// React state updates trigger re-renders. Used by both single draws and
// simulations — the duplication that used to live in RegionPage.
export const recordDraw = (stats, gameId, { draws = 1, spent = 0, won = 0, divisions = {} } = {}) => {
  const prev = stats[gameId] || { draws: 0, spent: 0, won: 0, divisions: {} };
  const nextDivisions = { ...prev.divisions };
  for (const [name, count] of Object.entries(divisions)) {
    nextDivisions[name] = (nextDivisions[name] || 0) + count;
  }
  return {
    ...stats,
    [gameId]: {
      draws: prev.draws + draws,
      spent: prev.spent + spent,
      won: prev.won + won,
      divisions: nextDivisions,
    },
  };
};
