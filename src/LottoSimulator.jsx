import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// LOTTERY GAME CONFIGURATIONS
// ============================================

const LOTTERY_GAMES = {
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
    color: 'bg-red-500',
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
    jackpotOdds: 8145060, color: 'bg-cyan-500',
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
    jackpotOdds: 8145060, color: 'bg-indigo-500',
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
    jackpotOdds: 45379620, color: 'bg-yellow-500',
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
    drawDays: ['Thursday'], drawsPerYear: 52, jackpotOdds: 134490400, color: 'bg-purple-500',
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
    jackpotOdds: 38608020, color: 'bg-green-500', isAnnuity: true,
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
    drawDays: ['Mon', 'Wed', 'Sat'], drawsPerYear: 156, jackpotOdds: 292201338, color: 'bg-red-600',
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
    drawDays: ['Tue', 'Fri'], drawsPerYear: 104, jackpotOdds: 302575350, color: 'bg-yellow-600',
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
    drawDays: ['Tue', 'Fri'], drawsPerYear: 104, jackpotOdds: 139838160, color: 'bg-blue-600',
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
    drawDays: ['Tue', 'Fri'], drawsPerYear: 104, jackpotOdds: 139838160, color: 'bg-orange-500',
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
    drawDays: ['Tue', 'Fri'], drawsPerYear: 104, jackpotOdds: 33294800, color: 'bg-red-700',
    linesPerTicket: 3,
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
    drawDays: ['Wed', 'Sat'], drawsPerYear: 104, jackpotOdds: 13983816, color: 'bg-blue-700',
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
    drawDays: ['Friday'], drawsPerYear: 52, jackpotOdds: 10295472, color: 'bg-pink-600',
    taxFree: true,
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
    drawDays: ['Mon', 'Thu'], drawsPerYear: 104, jackpotOdds: 6096454, color: 'bg-rose-500',
    taxFree: true,
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
    drawDays: ['Sunday'], drawsPerYear: 52, jackpotOdds: 31625100, color: 'bg-amber-600',
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

// Currency symbols
const CURRENCY_SYMBOLS = { AUD: '$', USD: '$', EUR: '€', CAD: 'C$', JPY: '¥' };

// Format currency
const formatCurrency = (amount, currency) => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  if (currency === 'JPY') return `${symbol}${amount.toLocaleString()}`;
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Format large numbers
const formatNumber = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

// Generate random numbers for a pool
const generateNumbers = (count, range, exclude = []) => {
  const numbers = [];
  while (numbers.length < count) {
    const num = Math.floor(Math.random() * range) + 1;
    if (!numbers.includes(num) && !exclude.includes(num)) numbers.push(num);
  }
  return numbers.sort((a, b) => a - b);
};

// Generate a quick pick ticket for a game
const generateQuickPick = (game) => {
  const mainNumbers = generateNumbers(game.mainPool.count, game.mainPool.range);
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

// Check ticket against draw result
const checkTicket = (ticket, draw, game) => {
  const mainMatches = ticket.mainNumbers.filter(n => draw.mainNumbers.includes(n)).length;
  let bonusMatches = 0;
  let suppMatches = 0;
  
  if (game.bonusPool && ticket.bonusNumbers && draw.bonusNumbers) {
    bonusMatches = ticket.bonusNumbers.filter(n => draw.bonusNumbers.includes(n)).length;
  }
  if (game.supplementary && draw.supplementary) {
    suppMatches = ticket.mainNumbers.filter(n => draw.supplementary.includes(n)).length;
  }
  
  // Find matching division
  for (const div of game.divisions) {
    const [mainReq, bonusReq] = div.match.split('+');
    const mainNeeded = parseInt(mainReq);
    
    let matches = false;
    if (bonusReq === 'PB' || bonusReq === 'MB' || bonusReq === 'K') {
      matches = mainMatches === mainNeeded && bonusMatches >= 1;
    } else if (bonusReq === '2') {
      matches = mainMatches === mainNeeded && bonusMatches === 2;
    } else if (bonusReq === '1') {
      matches = mainMatches === mainNeeded && (bonusMatches === 1 || suppMatches >= 1);
    } else if (bonusReq === '0') {
      matches = mainMatches === mainNeeded && bonusMatches === 0 && suppMatches === 0;
    } else {
      matches = mainMatches === mainNeeded;
    }
    
    if (matches) {
      return { division: div, mainMatches, bonusMatches, suppMatches };
    }
  }
  return null;
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function LottoSimulator() {
  const [selectedGame, setSelectedGame] = useState('saturday_lotto');
  const [tickets, setTickets] = useState([]);
  const [drawResult, setDrawResult] = useState(null);
  const [results, setResults] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('Australia');
  
  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStats, setSimStats] = useState(null);
  const [simSpeed, setSimSpeed] = useState(1000); // draws per batch
  const simulationRef = useRef(null);
  const abortRef = useRef(false);

  const game = LOTTERY_GAMES[selectedGame];
  const countries = [...new Set(Object.values(LOTTERY_GAMES).map(g => g.country))];
  
  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lotto_stats_v5');
    if (saved) setStats(JSON.parse(saved));
  }, []);
  
  // Save stats to localStorage
  useEffect(() => {
    if (Object.keys(stats).length > 0) {
      localStorage.setItem('lotto_stats_v5', JSON.stringify(stats));
    }
  }, [stats]);

  // Add quick pick tickets
  const addQuickPicks = (count) => {
    const newTickets = [];
    for (let i = 0; i < count; i++) {
      newTickets.push({ ...generateQuickPick(game), id: Date.now() + i });
    }
    setTickets(prev => [...prev, ...newTickets]);
  };

  // Clear tickets
  const clearTickets = () => {
    setTickets([]);
    setDrawResult(null);
    setResults([]);
  };

  // Run a single draw
  const runDraw = () => {
    if (tickets.length === 0) return;
    setIsDrawing(true);
    
    // Generate draw result
    const mainNumbers = generateNumbers(game.mainPool.count, game.mainPool.range);
    let bonusNumbers = null;
    let supplementary = null;
    
    if (game.bonusPool) {
      bonusNumbers = generateNumbers(game.bonusPool.count, game.bonusPool.range);
    }
    if (game.supplementary) {
      supplementary = generateNumbers(game.supplementary.count, game.supplementary.range, mainNumbers);
    }
    
    const draw = { mainNumbers, bonusNumbers, supplementary };
    setDrawResult(draw);
    
    // Check all tickets
    const ticketResults = tickets.map(ticket => ({
      ticket,
      result: checkTicket(ticket, draw, game)
    }));
    setResults(ticketResults);
    
    // Update stats
    const newStats = { ...stats };
    if (!newStats[selectedGame]) {
      newStats[selectedGame] = { draws: 0, spent: 0, won: 0, divisions: {} };
    }
    newStats[selectedGame].draws++;
    newStats[selectedGame].spent += tickets.length * game.cost;
    
    ticketResults.forEach(({ result }) => {
      if (result) {
        const prize = result.division.prizeType === 'monthly' 
          ? result.division.prize * result.division.duration 
          : result.division.prize;
        newStats[selectedGame].won += prize;
        newStats[selectedGame].divisions[result.division.name] = 
          (newStats[selectedGame].divisions[result.division.name] || 0) + 1;
      }
    });
    
    setStats(newStats);
    setIsDrawing(false);
  };

  // Run simulation until Division 1 win
  const runSimulation = async () => {
    abortRef.current = false;
    setIsSimulating(true);
    setSimStats({ draws: 0, spent: 0, won: 0, ticketsPerDraw: tickets.length, startTime: Date.now() });
    
    const ticketCount = tickets.length || 50;
    let totalDraws = 0;
    let totalSpent = 0;
    let totalWon = 0;
    let div1Won = false;
    let bestDivision = null;
    
    const runBatch = () => {
      return new Promise((resolve) => {
        for (let i = 0; i < simSpeed && !abortRef.current && !div1Won; i++) {
          // Generate tickets
          const simTickets = [];
          for (let j = 0; j < ticketCount; j++) {
            simTickets.push(generateQuickPick(game));
          }
          
          // Generate draw
          const mainNumbers = generateNumbers(game.mainPool.count, game.mainPool.range);
          const bonusNumbers = game.bonusPool ? generateNumbers(game.bonusPool.count, game.bonusPool.range) : null;
          const supplementary = game.supplementary ? generateNumbers(game.supplementary.count, game.supplementary.range, mainNumbers) : null;
          const draw = { mainNumbers, bonusNumbers, supplementary };
          
          totalDraws++;
          totalSpent += ticketCount * game.cost;
          
          // Check tickets
          for (const ticket of simTickets) {
            const result = checkTicket(ticket, draw, game);
            if (result) {
              const prize = result.division.prizeType === 'monthly' 
                ? result.division.prize * (result.division.duration || 1)
                : (result.division.prize || 0);
              totalWon += prize;
              
              if (result.division.name.includes('1') || result.division.name === 'Jackpot') {
                div1Won = true;
                bestDivision = result.division;
                break;
              }
              if (!bestDivision || game.divisions.indexOf(result.division) < game.divisions.indexOf(bestDivision)) {
                bestDivision = result.division;
              }
            }
          }
        }
        resolve();
      });
    };

    const updateUI = () => {
      const elapsed = (Date.now() - simStats.startTime) / 1000;
      const drawsPerSec = totalDraws / elapsed;
      const yearsSimulated = totalDraws / game.drawsPerYear;
      
      setSimStats({
        draws: totalDraws,
        spent: totalSpent,
        won: totalWon,
        ticketsPerDraw: ticketCount,
        yearsSimulated,
        drawsPerSec: Math.round(drawsPerSec),
        bestDivision,
        div1Won,
        elapsed
      });
    };
    
    // Run simulation loop
    while (!div1Won && !abortRef.current) {
      await runBatch();
      updateUI();
      await new Promise(r => setTimeout(r, 10)); // Allow UI to update
    }
    
    updateUI();
    setIsSimulating(false);
    
    // Save final stats
    if (div1Won) {
      const newStats = { ...stats };
      if (!newStats[selectedGame]) {
        newStats[selectedGame] = { draws: 0, spent: 0, won: 0, divisions: {} };
      }
      newStats[selectedGame].draws += totalDraws;
      newStats[selectedGame].spent += totalSpent;
      newStats[selectedGame].won += totalWon;
      newStats[selectedGame].divisions['Division 1'] = 
        (newStats[selectedGame].divisions['Division 1'] || 0) + 1;
      setStats(newStats);
    }
  };
  
  const stopSimulation = () => {
    abortRef.current = true;
    setIsSimulating(false);
  };

  // Render numbers as balls
  const NumberBall = ({ num, isMatch, isBonus, isSupp }) => (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm
      ${isMatch ? 'bg-green-500 text-white' : 
        isBonus ? 'bg-purple-500 text-white' : 
        isSupp ? 'bg-yellow-500 text-gray-900' : 
        'bg-gray-600 text-white'}`}>
      {num}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6">🎰 Lotto Simulator</h1>
        
        {/* Country Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {countries.map(country => (
            <button
              key={country}
              onClick={() => setActiveTab(country)}
              className={`px-4 py-2 rounded-lg font-medium transition
                ${activeTab === country ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {Object.values(LOTTERY_GAMES).find(g => g.country === country)?.flag} {country}
            </button>
          ))}
        </div>
        
        {/* Game Selection */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {Object.values(LOTTERY_GAMES)
            .filter(g => g.country === activeTab)
            .map(g => (
              <button
                key={g.id}
                onClick={() => { setSelectedGame(g.id); clearTickets(); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition
                  ${selectedGame === g.id ? g.color : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {g.shortName}
              </button>
            ))}
        </div>

        {/* Game Info */}
        <div className={`${game.color} rounded-xl p-4 mb-6`}>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{game.flag} {game.name}</h2>
              <p className="text-sm opacity-90">
                {game.mainPool.count} from {game.mainPool.range}
                {game.bonusPool && ` + ${game.bonusPool.count} ${game.bonusPool.name} from ${game.bonusPool.range}`}
                {game.supplementary && ` + ${game.supplementary.count} supps`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(game.cost, game.currency)} per game</p>
              <p className="text-sm opacity-90">Div 1 Odds: 1 in {formatNumber(game.jackpotOdds)}</p>
            </div>
          </div>
        </div>
        
        {/* Quick Pick Buttons */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {[1, 5, 10, 20, 50].map(n => (
            <button
              key={n}
              onClick={() => addQuickPicks(n)}
              disabled={isSimulating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50"
            >
              +{n} Quick Pick{n > 1 ? 's' : ''}
            </button>
          ))}
          <button
            onClick={clearTickets}
            disabled={isSimulating}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium disabled:opacity-50"
          >
            Clear
          </button>
        </div>
        
        {/* Tickets */}
        {tickets.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">{tickets.length} Ticket{tickets.length > 1 ? 's' : ''}</h3>
              <p className="text-sm">Total: {formatCurrency(tickets.length * game.cost, game.currency)}</p>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {tickets.slice(0, 20).map((ticket, i) => (
                <div key={ticket.id} className="flex flex-wrap gap-1 items-center text-sm">
                  <span className="text-gray-400 w-6">#{i + 1}</span>
                  {ticket.mainNumbers.map(n => (
                    <NumberBall key={n} num={n} 
                      isMatch={drawResult?.mainNumbers.includes(n)}
                      isSupp={drawResult?.supplementary?.includes(n)} />
                  ))}
                  {ticket.bonusNumbers && (
                    <>
                      <span className="text-gray-500 mx-1">+</span>
                      {ticket.bonusNumbers.map(n => (
                        <NumberBall key={`b${n}`} num={n} isBonus 
                          isMatch={drawResult?.bonusNumbers?.includes(n)} />
                      ))}
                    </>
                  )}
                </div>
              ))}
              {tickets.length > 20 && (
                <p className="text-gray-400 text-sm">...and {tickets.length - 20} more</p>
              )}
            </div>
          </div>
        )}

        {/* Draw Button */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={runDraw}
            disabled={tickets.length === 0 || isDrawing || isSimulating}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-lg disabled:opacity-50"
          >
            🎱 Draw!
          </button>
          <button
            onClick={isSimulating ? stopSimulation : runSimulation}
            disabled={tickets.length === 0 && !isSimulating}
            className={`px-8 py-3 rounded-xl font-bold text-lg
              ${isSimulating ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}
              disabled:opacity-50`}
          >
            {isSimulating ? '⏹ Stop' : '🚀 Run Until Div 1'}
          </button>
        </div>
        
        {/* Draw Result */}
        {drawResult && (
          <div className="bg-gray-800 rounded-xl p-4 mb-6">
            <h3 className="font-bold mb-3">Draw Result</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {drawResult.mainNumbers.map(n => (
                <NumberBall key={n} num={n} />
              ))}
              {drawResult.bonusNumbers && (
                <>
                  <span className="text-gray-500 mx-2">+</span>
                  {drawResult.bonusNumbers.map(n => (
                    <NumberBall key={`b${n}`} num={n} isBonus />
                  ))}
                </>
              )}
              {drawResult.supplementary && (
                <>
                  <span className="text-gray-500 mx-2">Supps:</span>
                  {drawResult.supplementary.map(n => (
                    <NumberBall key={`s${n}`} num={n} isSupp />
                  ))}
                </>
              )}
            </div>
            
            {/* Winners */}
            {results.filter(r => r.result).length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-bold text-green-400">🎉 Winners!</h4>
                {results.filter(r => r.result).map((r, i) => (
                  <div key={i} className="bg-green-900/30 rounded p-2">
                    <span className="font-bold">{r.result.division.name}</span>
                    <span className="ml-2">
                      {r.result.division.prizeType === 'monthly' 
                        ? `${formatCurrency(r.result.division.prize, game.currency)}/mo for ${r.result.division.duration} months`
                        : formatCurrency(r.result.division.prize, game.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Simulation Panel */}
        {(isSimulating || simStats) && (
          <div className="bg-purple-900/30 border border-purple-500 rounded-xl p-4 mb-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              {isSimulating && <span className="animate-spin">🎰</span>}
              Simulation {isSimulating ? 'Running...' : 'Complete!'}
            </h3>
            {simStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Draws</p>
                  <p className="text-xl font-bold">{formatNumber(simStats.draws)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Years Simulated</p>
                  <p className="text-xl font-bold">{simStats.yearsSimulated?.toFixed(1) || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Spent</p>
                  <p className="text-xl font-bold text-red-400">{formatCurrency(simStats.spent, game.currency)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Won</p>
                  <p className="text-xl font-bold text-green-400">{formatCurrency(simStats.won, game.currency)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Net</p>
                  <p className={`text-xl font-bold ${simStats.won - simStats.spent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(simStats.won - simStats.spent, game.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Speed</p>
                  <p className="text-xl font-bold">{formatNumber(simStats.drawsPerSec || 0)}/sec</p>
                </div>
                <div>
                  <p className="text-gray-400">Best Division</p>
                  <p className="text-xl font-bold">{simStats.bestDivision?.name || 'None'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Tickets/Draw</p>
                  <p className="text-xl font-bold">{simStats.ticketsPerDraw}</p>
                </div>
              </div>
            )}
            {simStats?.div1Won && (
              <div className="mt-4 p-4 bg-green-600 rounded-lg text-center">
                <p className="text-2xl font-bold">🎉 DIVISION 1 WON! 🎉</p>
                <p>After {formatNumber(simStats.draws)} draws ({simStats.yearsSimulated?.toFixed(1)} years)</p>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {stats[selectedGame] && (
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-bold mb-3">📊 {game.name} Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-400">Total Draws</p>
                <p className="text-xl font-bold">{formatNumber(stats[selectedGame].draws)}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Spent</p>
                <p className="text-xl font-bold text-red-400">
                  {formatCurrency(stats[selectedGame].spent, game.currency)}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Total Won</p>
                <p className="text-xl font-bold text-green-400">
                  {formatCurrency(stats[selectedGame].won, game.currency)}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Net Profit/Loss</p>
                <p className={`text-xl font-bold ${stats[selectedGame].won - stats[selectedGame].spent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(stats[selectedGame].won - stats[selectedGame].spent, game.currency)}
                </p>
              </div>
            </div>
            
            {/* Division Wins */}
            {Object.keys(stats[selectedGame].divisions).length > 0 && (
              <div>
                <h4 className="font-bold mb-2">Division Wins</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats[selectedGame].divisions).map(([div, count]) => (
                    <span key={div} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                      {div}: {count}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={() => {
                const newStats = { ...stats };
                delete newStats[selectedGame];
                setStats(newStats);
              }}
              className="mt-4 px-4 py-2 bg-red-600/50 hover:bg-red-600 rounded text-sm"
            >
              Reset {game.name} Stats
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
