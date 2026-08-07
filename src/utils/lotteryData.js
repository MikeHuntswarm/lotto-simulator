// ============================================
// LOTTERY DATA — barrel re-export
// ============================================
// Split along change-rate seams so callers keep importing from one place:
//   games.js   — catalog data (changes when games are added)
//   engine.js  — probability math (changes rarely, highest risk)
//   format.js  — presentation helpers (UI concern)

export * from './games';
export * from './engine';
export * from './format';
