// ============================================
// LOTTERY GAME CONFIGURATIONS
// ============================================

export const LOTTERY_GAMES = {
  // ==================== AUSTRALIA ====================
  saturday_lotto: {
    id: 'saturday_lotto',
    name: 'Saturday Lotto',
    shortName: 'Sat',
    country: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    cost: 1.35,
    mainPool: { count: 6, range: 45 },
    bonusPool: null,
    supplementary: { count: 2, range: 45 },
    drawDays: ['Saturday'],
    drawsPerYear: 52,
    jackpotOdds: 8145060,
    color: 'from-red-500 to-red-700',
    gradientBg: 'bg-gradient-to-br from-red-500/20 to-red-700/20',
    borderGradient: 'border-red-500',
    accent: 'text-red-400',
    divisions: [
      { match: '6+0', name: 'Division 1', prize: 4000000, odds: 8145060 },
      { match: '5+1', name: 'Division 2', prize: 25000, odds: 678755 },
      { match: '5+0', name: 'Division 3', prize: 1000, odds: 36689 },
      { match: '4+0', name: 'Division 4', prize: 30, odds: 733 },
      { match: '3+1', name: 'Division 5', prize: 20, odds: 297 },
      { match: '1+2', name: 'Division 6', prize: 15, odds: 144 }
    ]
  },
  monday_lotto: {
    id: 'monday_lotto', name: 'Monday Lotto', shortName: 'Mon', country: 'Australia', flag: '🇦🇺',
    currency: 'AUD', cost: 1.15, mainPool: { count: 6, range: 45 }, bonusPool: null,
    supplementary: { count: 2, range: 45 }, drawDays: ['Monday'], drawsPerYear: 52,
    jackpotOdds: 8145060, color: 'from-cyan-500 to-cyan-700',
    gradientBg: 'bg-gradient-to-br from-cyan-500/20 to-cyan-700/20',
    borderGradient: 'border-cyan-500',
    accent: 'text-cyan-400',
    divisions: [
      { match: '6+0', name: 'Division 1', prize: 1000000, odds: 8145060 },
      { match: '5+1', name: 'Division 2', prize: 10000, odds: 678755 },
      { match: '5+0', name: 'Division 3', prize: 500, odds: 36689 },
      { match: '4+0', name: 'Division 4', prize: 25, odds: 733 },
      { match: '3+1', name: 'Division 5', prize: 15, odds: 297 },
      { match: '1+2', name: 'Division 6', prize: 10, odds: 144 }
    ]
  },
  wednesday_lotto: {
    id: 'wednesday_lotto', name: 'Wednesday Lotto', shortName: 'Wed', country: 'Australia', flag: '🇦🇺',
    currency: 'AUD', cost: 1.15, mainPool: { count: 6, range: 45 }, bonusPool: null,
    supplementary: { count: 2, range: 45 }, drawDays: ['Wednesday'], drawsPerYear: 52,
    jackpotOdds: 8145060, color: 'from-indigo-500 to-indigo-700',
    gradientBg: 'bg-gradient-to-br from-indigo-500/20 to-indigo-700/20',
    borderGradient: 'border-indigo-500',
    accent: 'text-indigo-400',
    divisions: [
      { match: '6+0', name: 'Division 1', prize: 1000000, odds: 8145060 },
      { match: '5+1', name: 'Division 2', prize: 10000, odds: 678755 },
      { match: '5+0', name: 'Division 3', prize: 500, odds: 36689 },
      { match: '4+0', name: 'Division 4', prize: 25, odds: 733 },
      { match: '3+1', name: 'Division 5', prize: 15, odds: 297 },
      { match: '1+2', name: 'Division 6', prize: 10, odds: 144 }
    ]
  },
  oz_lotto: {
    id: 'oz_lotto', name: 'Oz Lotto', shortName: 'Oz', country: 'Australia', flag: '🇦🇺',
    currency: 'AUD', cost: 1.50, mainPool: { count: 7, range: 45 }, bonusPool: null,
    supplementary: { count: 3, range: 45 }, drawDays: ['Tuesday'], drawsPerYear: 52,
    jackpotOdds: 45379620, color: 'from-yellow-500 to-yellow-700',
    gradientBg: 'bg-gradient-to-br from-yellow-500/20 to-yellow-700/20',
    borderGradient: 'border-yellow-500',
    accent: 'text-yellow-400',
    divisions: [
      { match: '7+0', name: 'Division 1', prize: 10000000, odds: 45379620 },
      { match: '6+1', name: 'Division 2', prize: 50000, odds: 3241401 },
      { match: '6+0', name: 'Division 3', prize: 5000, odds: 180078 },
      { match: '5+1', name: 'Division 4', prize: 200, odds: 29602 },
      { match: '5+0', name: 'Division 5', prize: 50, odds: 3430 },
      { match: '4+0', name: 'Division 6', prize: 25, odds: 154 },
      { match: '3+1', name: 'Division 7', prize: 15, odds: 87 }
    ]
  },
  powerball_au: {
    id: 'powerball_au', name: 'Powerball AU', shortName: 'PB-AU', country: 'Australia', flag: '🇦🇺',
    currency: 'AUD', cost: 1.60, mainPool: { count: 7, range: 35 },
    bonusPool: { count: 1, range: 20, name: 'Powerball' }, supplementary: null,
    drawDays: ['Thursday'], drawsPerYear: 52, jackpotOdds: 134490400, color: 'from-purple-500 to-purple-700',
    gradientBg: 'bg-gradient-to-br from-purple-500/20 to-purple-700/20',
    borderGradient: 'border-purple-500',
    accent: 'text-purple-400',
    divisions: [
      { match: '7+PB', name: 'Division 1', prize: 20000000, odds: 134490400 },
      { match: '7+0', name: 'Division 2', prize: 200000, odds: 7078442 },
      { match: '6+PB', name: 'Division 3', prize: 10000, odds: 686176 },
      { match: '6+0', name: 'Division 4', prize: 500, odds: 36115 },
      { match: '5+PB', name: 'Division 5', prize: 150, odds: 16943 },
      { match: '5+0', name: 'Division 6', prize: 50, odds: 892 },
      { match: '4+PB', name: 'Division 7', prize: 50, odds: 1173 },
      { match: '3+PB', name: 'Division 8', prize: 20, odds: 188 },
      { match: '2+PB', name: 'Division 9', prize: 10, odds: 66 }
    ]
  },
  set_for_life: {
    id: 'set_for_life', name: 'Set for Life', shortName: 'SFL', country: 'Australia', flag: '🇦🇺',
    currency: 'AUD', cost: 2.00, mainPool: { count: 8, range: 37 }, bonusPool: null,
    supplementary: { count: 2, range: 37 }, drawDays: ['Daily'], drawsPerYear: 365,
    jackpotOdds: 38608020, color: 'from-green-500 to-green-700', isAnnuity: true,
    gradientBg: 'bg-gradient-to-br from-green-500/20 to-green-700/20',
    borderGradient: 'border-green-500',
    accent: 'text-green-400',
    divisions: [
      { match: '8+0', name: 'Division 1', prize: 20000, prizeType: 'monthly', duration: 240, odds: 38608020 },
      { match: '7+1', name: 'Division 2', prize: 5000, prizeType: 'monthly', duration: 12, odds: 1930401 },
      { match: '7+0', name: 'Division 3', prize: 5000, odds: 75016 },
      { match: '6+1', name: 'Division 4', prize: 200, odds: 20881 },
      { match: '6+0', name: 'Division 5', prize: 50, odds: 1367 },
      { match: '5+1', name: 'Division 6', prize: 25, odds: 825 },
      { match: '5+0', name: 'Division 7', prize: 15, odds: 82 },
      { match: '4+0', name: 'Division 8', prize: 10, odds: 26 }
    ]
  },

  // ==================== UNITED STATES ====================
  powerball_us: {
    id: 'powerball_us', name: 'Powerball US', shortName: 'PB-US', country: 'USA', flag: '🇺🇸',
    currency: 'USD', cost: 2.00, mainPool: { count: 5, range: 69 },
    bonusPool: { count: 1, range: 26, name: 'Powerball' }, supplementary: null,
    drawDays: ['Mon', 'Wed', 'Sat'], drawsPerYear: 156, jackpotOdds: 292201338, color: 'from-red-600 to-red-800',
    gradientBg: 'bg-gradient-to-br from-red-600/20 to-red-800/20',
    borderGradient: 'border-red-600',
    accent: 'text-red-400',
    divisions: [
      { match: '5+PB', name: 'Jackpot', prize: 20000000, odds: 292201338 },
      { match: '5+0', name: 'Match 5', prize: 1000000, odds: 11688053 },
      { match: '4+PB', name: 'Match 4+PB', prize: 50000, odds: 913129 },
      { match: '4+0', name: 'Match 4', prize: 100, odds: 36525 },
      { match: '3+PB', name: 'Match 3+PB', prize: 100, odds: 14494 },
      { match: '3+0', name: 'Match 3', prize: 7, odds: 580 },
      { match: '2+PB', name: 'Match 2+PB', prize: 7, odds: 701 },
      { match: '1+PB', name: 'Match 1+PB', prize: 4, odds: 92 },
      { match: '0+PB', name: 'Match PB', prize: 4, odds: 38 }
    ]
  },
  mega_millions: {
    id: 'mega_millions', name: 'Mega Millions', shortName: 'MM', country: 'USA', flag: '🇺🇸',
    currency: 'USD', cost: 5.00, mainPool: { count: 5, range: 70 },
    bonusPool: { count: 1, range: 25, name: 'Mega Ball' }, supplementary: null,
    drawDays: ['Tue', 'Fri'], drawsPerYear: 104, jackpotOdds: 302575350, color: 'from-yellow-600 to-yellow-800',
    gradientBg: 'bg-gradient-to-br from-yellow-600/20 to-yellow-800/20',
    borderGradient: 'border-yellow-600',
    accent: 'text-yellow-400',
    divisions: [
      { match: '5+MB', name: 'Jackpot', prize: 50000000, odds: 302575350 },
      { match: '5+0', name: 'Match 5', prize: 1000000, odds: 12607306 },
      { match: '4+MB', name: 'Match 4+MB', prize: 10000, odds: 931001 },
      { match: '4+0', name: 'Match 4', prize: 500, odds: 38792 },
      { match: '3+MB', name: 'Match 3+MB', prize: 200, odds: 14547 },
      { match: '3+0', name: 'Match 3', prize: 10, odds: 606 },
      { match: '2+MB', name: 'Match 2+MB', prize: 10, odds: 693 },
      { match: '1+MB', name: 'Match 1+MB', prize: 4, odds: 89 },
      { match: '0+MB', name: 'Match MB', prize: 2, odds: 37 }
    ]
  },

  // ==================== EUROPE ====================
  euromillions: {
    id: 'euromillions', name: 'EuroMillions', shortName: 'EM', country: 'Europe', flag: '🇪🇺',
    currency: 'EUR', cost: 2.50, mainPool: { count: 5, range: 50 },
    bonusPool: { count: 2, range: 12, name: 'Lucky Stars' }, supplementary: null,
    drawDays: ['Tue', 'Fri'], drawsPerYear: 104, jackpotOdds: 139838160, color: 'from-blue-600 to-blue-800',
    gradientBg: 'bg-gradient-to-br from-blue-600/20 to-blue-800/20',
    borderGradient: 'border-blue-600',
    accent: 'text-blue-400',
    divisions: [
      { match: '5+2', name: 'Jackpot', prize: 17000000, odds: 139838160 },
      { match: '5+1', name: 'Match 5+1', prize: 300000, odds: 6991908 },
      { match: '5+0', name: 'Match 5', prize: 50000, odds: 3107515 },
      { match: '4+2', name: 'Match 4+2', prize: 3000, odds: 621503 },
      { match: '4+1', name: 'Match 4+1', prize: 150, odds: 31076 },
      { match: '3+2', name: 'Match 3+2', prize: 50, odds: 14125 },
      { match: '4+0', name: 'Match 4', prize: 50, odds: 13811 },
      { match: '2+2', name: 'Match 2+2', prize: 10, odds: 985 },
      { match: '3+1', name: 'Match 3+1', prize: 10, odds: 706 },
      { match: '3+0', name: 'Match 3', prize: 10, odds: 314 },
      { match: '1+2', name: 'Match 1+2', prize: 6, odds: 188 },
      { match: '2+1', name: 'Match 2+1', prize: 5, odds: 49 },
      { match: '2+0', name: 'Match 2', prize: 4, odds: 22 }
    ]
  },
  eurojackpot: {
    id: 'eurojackpot', name: 'Eurojackpot', shortName: 'EJ', country: 'Europe', flag: '🇪🇺',
    currency: 'EUR', cost: 2.00, mainPool: { count: 5, range: 50 },
    bonusPool: { count: 2, range: 12, name: 'Euro Numbers' }, supplementary: null,
    drawDays: ['Tue', 'Fri'], drawsPerYear: 104, jackpotOdds: 139838160, color: 'from-orange-500 to-orange-700',
    gradientBg: 'bg-gradient-to-br from-orange-500/20 to-orange-700/20',
    borderGradient: 'border-orange-500',
    accent: 'text-orange-400',
    divisions: [
      { match: '5+2', name: 'Jackpot', prize: 10000000, odds: 139838160 },
      { match: '5+1', name: 'Match 5+1', prize: 800000, odds: 6991908 },
      { match: '5+0', name: 'Match 5', prize: 100000, odds: 3107515 },
      { match: '4+2', name: 'Match 4+2', prize: 4000, odds: 621503 },
      { match: '4+1', name: 'Match 4+1', prize: 200, odds: 31076 },
      { match: '4+0', name: 'Match 4', prize: 90, odds: 13811 },
      { match: '3+2', name: 'Match 3+2', prize: 60, odds: 14125 },
      { match: '2+2', name: 'Match 2+2', prize: 20, odds: 985 },
      { match: '3+1', name: 'Match 3+1', prize: 15, odds: 706 },
      { match: '3+0', name: 'Match 3', prize: 13, odds: 314 },
      { match: '1+2', name: 'Match 1+2', prize: 10, odds: 188 },
      { match: '2+1', name: 'Match 2+1', prize: 9, odds: 49 }
    ]
  },

  // ==================== CANADA ====================
  lotto_max: {
    id: 'lotto_max', name: 'Lotto Max', shortName: 'MAX', country: 'Canada', flag: '🇨🇦',
    currency: 'CAD', cost: 5.00, mainPool: { count: 7, range: 50 }, bonusPool: null,
    supplementary: { count: 1, range: 50, name: 'Bonus' },
    drawDays: ['Tue', 'Fri'], drawsPerYear: 104, jackpotOdds: 33294800, color: 'from-red-700 to-red-900',
    gradientBg: 'bg-gradient-to-br from-red-700/20 to-red-900/20',
    borderGradient: 'border-red-700',
    accent: 'text-red-400',
    divisions: [
      { match: '7+0', name: 'Jackpot', prize: 10000000, odds: 33294800 },
      { match: '6+1', name: 'Match 6+B', prize: 100000, odds: 4756400 },
      { match: '6+0', name: 'Match 6', prize: 5000, odds: 113319 },
      { match: '5+1', name: 'Match 5+B', prize: 1000, odds: 37773 },
      { match: '5+0', name: 'Match 5', prize: 50, odds: 1841 },
      { match: '4+1', name: 'Match 4+B', prize: 20, odds: 1105 },
      { match: '4+0', name: 'Match 4', prize: 0, prizeType: 'free', odds: 82 },
      { match: '3+1', name: 'Match 3+B', prize: 5, odds: 82 },
      { match: '3+0', name: 'Match 3', prize: 0, prizeType: 'free', odds: 8 }
    ]
  },
  lotto_649: {
    id: 'lotto_649', name: 'Lotto 6/49', shortName: '6/49', country: 'Canada', flag: '🇨🇦',
    currency: 'CAD', cost: 3.00, mainPool: { count: 6, range: 49 }, bonusPool: null,
    supplementary: { count: 1, range: 49, name: 'Bonus' },
    drawDays: ['Wed', 'Sat'], drawsPerYear: 104, jackpotOdds: 13983816, color: 'from-blue-700 to-blue-900',
    gradientBg: 'bg-gradient-to-br from-blue-700/20 to-blue-900/20',
    borderGradient: 'border-blue-700',
    accent: 'text-blue-400',
    divisions: [
      { match: '6+0', name: 'Jackpot', prize: 5000000, odds: 13983816 },
      { match: '5+1', name: 'Match 5+B', prize: 50000, odds: 2330636 },
      { match: '5+0', name: 'Match 5', prize: 2000, odds: 55491 },
      { match: '4+0', name: 'Match 4', prize: 80, odds: 1033 },
      { match: '3+0', name: 'Match 3', prize: 10, odds: 56 },
      { match: '2+1', name: 'Match 2+B', prize: 5, odds: 81 },
      { match: '2+0', name: 'Match 2', prize: 0, prizeType: 'free', odds: 8 }
    ]
  },

  // ==================== JAPAN ====================
  loto7: {
    id: 'loto7', name: 'Loto 7', shortName: 'L7', country: 'Japan', flag: '🇯🇵',
    currency: 'JPY', cost: 300, mainPool: { count: 7, range: 37 }, bonusPool: null,
    supplementary: { count: 2, range: 37, name: 'Bonus' },
    drawDays: ['Friday'], drawsPerYear: 52, jackpotOdds: 10295472, color: 'from-pink-600 to-pink-800',
    gradientBg: 'bg-gradient-to-br from-pink-600/20 to-pink-800/20',
    borderGradient: 'border-pink-600',
    accent: 'text-pink-400',
    divisions: [
      { match: '7+0', name: '1st Prize', prize: 600000000, odds: 10295472 },
      { match: '6+1', name: '2nd Prize', prize: 6100000, odds: 735391 },
      { match: '6+0', name: '3rd Prize', prize: 500000, odds: 52528 },
      { match: '5+0', name: '4th Prize', prize: 6500, odds: 1127 },
      { match: '4+0', name: '5th Prize', prize: 1400, odds: 72 },
      { match: '3+1', name: '6th Prize', prize: 1000, odds: 42 }
    ]
  },
  loto6: {
    id: 'loto6', name: 'Loto 6', shortName: 'L6', country: 'Japan', flag: '🇯🇵',
    currency: 'JPY', cost: 200, mainPool: { count: 6, range: 43 }, bonusPool: null,
    supplementary: { count: 1, range: 43, name: 'Bonus' },
    drawDays: ['Mon', 'Thu'], drawsPerYear: 104, jackpotOdds: 6096454, color: 'from-rose-500 to-rose-700',
    gradientBg: 'bg-gradient-to-br from-rose-500/20 to-rose-700/20',
    borderGradient: 'border-rose-500',
    accent: 'text-rose-400',
    divisions: [
      { match: '6+0', name: '1st Prize', prize: 200000000, odds: 6096454 },
      { match: '5+1', name: '2nd Prize', prize: 10000000, odds: 1016076 },
      { match: '5+0', name: '3rd Prize', prize: 500000, odds: 28224 },
      { match: '4+0', name: '4th Prize', prize: 8700, odds: 610 },
      { match: '3+0', name: '5th Prize', prize: 1000, odds: 39 }
    ]
  },

  // ==================== SPAIN ====================
  el_gordo: {
    id: 'el_gordo', name: 'El Gordo', shortName: 'EG', country: 'Spain', flag: '🇪🇸',
    currency: 'EUR', cost: 1.50, mainPool: { count: 5, range: 54 },
    bonusPool: { count: 1, range: 10, name: 'Key Number' }, supplementary: null,
    drawDays: ['Sunday'], drawsPerYear: 52, jackpotOdds: 31625100, color: 'from-amber-600 to-amber-800',
    gradientBg: 'bg-gradient-to-br from-amber-600/20 to-amber-800/20',
    borderGradient: 'border-amber-600',
    accent: 'text-amber-400',
    divisions: [
      { match: '5+K', name: 'Jackpot', prize: 5000000, odds: 31625100 },
      { match: '5+0', name: '2nd Prize', prize: 100000, odds: 3514000 },
      { match: '4+K', name: '3rd Prize', prize: 2000, odds: 176610 },
      { match: '4+0', name: '4th Prize', prize: 200, odds: 19623 },
      { match: '3+K', name: '5th Prize', prize: 20, odds: 3073 },
      { match: '3+0', name: '6th Prize', prize: 5, odds: 341 },
      { match: '2+K', name: '7th Prize', prize: 4, odds: 129 },
      { match: '2+0', name: '8th Prize', prize: 3, odds: 14 },
      { match: '0+K', name: 'Reintegro', prize: 1.50, prizeType: 'refund', odds: 10 }
    ]
  }
};

// Region definitions
export const REGIONS = [
  { id: 'australia', name: 'Australia', flag: '🇦🇺', games: ['saturday_lotto', 'monday_lotto', 'wednesday_lotto', 'oz_lotto', 'powerball_au', 'set_for_life'] },
  { id: 'usa', name: 'USA', flag: '🇺🇸', games: ['powerball_us', 'mega_millions'] },
  { id: 'europe', name: 'Europe', flag: '🇪🇺', games: ['euromillions', 'eurojackpot'] },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', games: ['lotto_max', 'lotto_649'] },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', games: ['loto7', 'loto6'] },
  { id: 'spain', name: 'Spain', flag: '🇪🇸', games: ['el_gordo'] }
];

// Get all games grouped by region
export const getGamesByRegion = (regionId) => {
  const region = REGIONS.find(r => r.id === regionId);
  return region ? region.games.map(gameId => LOTTERY_GAMES[gameId]) : [];
};

// Get all regions
export const getAllRegions = () => REGIONS;

// Currency symbols
export const CURRENCY_SYMBOLS = { AUD: '$', USD: '$', EUR: '€', CAD: 'C$', JPY: '¥' };

// Format currency
export const formatCurrency = (amount, currency) => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  if (currency === 'JPY') return `${symbol}${amount.toLocaleString()}`;
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Format large numbers
export const formatNumber = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

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

// Generate random numbers for a pool
export const generateNumbers = (count, range, exclude = []) => {
  const numbers = [];
  while (numbers.length < count) {
    const num = Math.floor(Math.random() * range) + 1;
    if (!numbers.includes(num) && !exclude.includes(num)) numbers.push(num);
  }
  return numbers.sort((a, b) => a - b);
};

// Generate a quick pick ticket for a game
export const generateQuickPick = (game, systemSize = null) => {
  const n = systemSize || game.mainPool.count;
  const mainNumbers = generateNumbers(n, game.mainPool.range);
  let bonusNumbers = null;
  let supplementary = null;
  
  if (game.bonusPool) {
    bonusNumbers = generateNumbers(game.bonusPool.count, game.bonusPool.range);
  }
  if (game.supplementary) {
    supplementary = generateNumbers(game.supplementary.count, game.supplementary.range, mainNumbers);
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
