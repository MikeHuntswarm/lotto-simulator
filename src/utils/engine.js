// ============================================
// LOTTERY ENGINE — pure math, no I/O, no React
// ============================================
// Deep module: checkTicket's 74 division rules sit behind a tiny
// 3-argument interface. RNG is accepted as a dependency (not created
// inside) so every function is deterministic under a seeded RNG.

// Calculate combinations (n choose r)
export const nCr = (n, r) => {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  if (r > n / 2) r = n - r;
  let res = 1;
  for (let i = 1; i <= r; i++) {
    res = res * (n - i + 1) / i;
  }
  return Math.round(res);
};

// Generate random numbers for a pool (exclude avoids collisions)
export const generateNumbers = (count, range, exclude = [], rng = Math.random) => {
  const numbers = [];
  while (numbers.length < count) {
    const num = Math.floor(rng() * range) + 1;
    if (!numbers.includes(num) && !exclude.includes(num)) numbers.push(num);
  }
  return numbers.sort((a, b) => a - b);
};

// Generate a quick pick ticket for a game (system entries via systemSize)
export const generateQuickPick = (game, systemSize = null, rng = Math.random) => {
  const n = systemSize || game.mainPool.count;
  const mainNumbers = generateNumbers(n, game.mainPool.range, [], rng);
  let bonusNumbers = null;
  let supplementary = null;

  if (game.bonusPool) {
    bonusNumbers = generateNumbers(game.bonusPool.count, game.bonusPool.range, [], rng);
  }
  if (game.supplementary) {
    supplementary = generateNumbers(game.supplementary.count, game.supplementary.range, mainNumbers, rng);
  }

  return { mainNumbers, bonusNumbers, supplementary };
};

// Check ticket against draw result (supports System Entries)
export const checkTicket = (ticket, draw, game) => {
  const n = ticket.mainNumbers.length; // Numbers picked
  const k = game.mainPool.count;       // Numbers needed for standard game

  const m = ticket.mainNumbers.filter(num => draw.mainNumbers.includes(num)).length;
  const s = game.supplementary ? ticket.mainNumbers.filter(num => draw.supplementary.includes(num)).length : 0;

  let b = 0;
  if (game.bonusPool && ticket.bonusNumbers && draw.bonusNumbers) {
    b = ticket.bonusNumbers.filter(num => draw.bonusNumbers.includes(num)).length;
  }

  const wins = [];

  // Find matching divisions
  for (const div of game.divisions) {
    const [mainReqStr, bonusReq] = div.match.split('+');
    const mainReq = parseInt(mainReqStr);
    let winCount = 0;

    if (bonusReq === 'PB' || bonusReq === 'MB' || bonusReq === 'K') {
      if (b >= 1) winCount = nCr(m, mainReq) * nCr(n - m, k - mainReq);
    } else if (bonusReq === '2') {
      if (game.bonusPool) {
        if (b === 2) winCount = nCr(m, mainReq) * nCr(n - m, k - mainReq);
      } else {
        // Aussie Lotto Div 6 (1+2) - 1 or 2 main + 2 supps
        winCount = (nCr(m, 1) * nCr(s, 2) * nCr(n - m - s, k - 1 - 2)) +
                   (nCr(m, 2) * nCr(s, 2) * nCr(n - m - s, k - 2 - 2));
      }
    } else if (bonusReq === '1') {
      if (game.bonusPool) {
        if (b === 1) winCount = nCr(m, mainReq) * nCr(n - m, k - mainReq);
      } else {
        // At least one supplementary
        winCount = nCr(m, mainReq) * (nCr(n - m, k - mainReq) - nCr(n - m - s, k - mainReq));
      }
    } else if (bonusReq === '0') {
      if (game.bonusPool) {
        if (b === 0) winCount = nCr(m, mainReq) * nCr(n - m, k - mainReq);
      } else {
        // Exactly 0 supplementaries
        winCount = nCr(m, mainReq) * nCr(n - m - s, k - mainReq);
      }
    } else {
      winCount = nCr(m, mainReq) * nCr(n - m, k - mainReq);
    }

    if (winCount > 0) {
      wins.push({ division: div, count: winCount });
    }
  }

  return wins.length > 0 ? wins : null;
};

// ---- Candidate 2: prize-value authority ----
// The one place that knows how to value a prize. Monthly/annuity prizes
// are worth prize × duration; everything else is face value.
export const prizeValue = (division, count = 1) =>
  count * (division.prizeType === 'monthly'
    ? division.prize * (division.duration || 1)
    : (division.prize || 0));

// ---- Top-division predicate ----
// Structural: the top division IS divisions[0]. Fixes the old
// name.includes('1') heuristic, which matched "Match 1+PB" ($4) as
// a Division 1 win for Powerball US / Mega Millions.
export const isTopDivision = (division, game) => division === game.divisions[0];
