import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getGamesByRegion, LOTTERY_GAMES, nCr, generateNumbers, generateQuickPick, checkTicket, formatCurrency, formatNumber } from '../utils/lotteryData';
import GameSelector from '../components/GameSelector';
import GameInfoBar from '../components/GameInfoBar';
import NumberBalls from '../components/NumberBalls';

export default function RegionPage({ regionId, regionName, regionFlag }) {
  const games = getGamesByRegion(regionId);
  const [selectedGame, setSelectedGame] = useState(games[0]?.id);
  const [selectedSystem, setSelectedSystem] = useState('standard');
  const [tickets, setTickets] = useState([]);
  const [drawResult, setDrawResult] = useState(null);
  const [results, setResults] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stats, setStats] = useState({});

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStats, setSimStats] = useState(null);
  const [simSpeed, setSimSpeed] = useState(1000);
  const abortRef = useRef(false);

  const game = LOTTERY_GAMES[selectedGame];

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

  // System entry options
  const getSystemOptions = () => {
    const options = [{ label: 'Standard', value: 'standard' }];
    const maxSystem = Math.min(game.mainPool.count + 14, 20);
    for (let i = game.mainPool.count + 1; i <= maxSystem; i++) {
      const gamesCount = nCr(i, game.mainPool.count);
      options.push({ label: `System ${i}`, value: `system_${i}`, games: gamesCount });
    }
    return options;
  };

  const getSystemSize = (sys) => {
    if (sys === 'standard') return game.mainPool.count;
    return parseInt(sys.split('_')[1]);
  };

  const getGamesPerTicket = (sys) => {
    if (sys === 'standard') return 1;
    return nCr(getSystemSize(sys), game.mainPool.count);
  };

  const addQuickPicks = (count) => {
    const newTickets = [];
    const systemSize = getSystemSize(selectedSystem);
    const gamesPerTicket = getGamesPerTicket(selectedSystem);

    for (let i = 0; i < count; i++) {
      newTickets.push({
        ...generateQuickPick(game, systemSize),
        id: Date.now() + i,
        systemType: selectedSystem,
        gamesPerTicket
      });
    }
    setTickets(prev => [...prev, ...newTickets]);
  };

  const clearTickets = () => {
    setTickets([]);
    setDrawResult(null);
    setResults([]);
    setSimStats(null);
  };

  const removeTicket = (id) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const runDraw = () => {
    if (tickets.length === 0) return;
    setIsDrawing(true);

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

    let totalSpentInDraw = 0;
    ticketResults.forEach(({ ticket, result }) => {
      totalSpentInDraw += ticket.gamesPerTicket * game.cost;
      if (result) {
        result.forEach(win => {
          const prizePerWin = win.division.prizeType === 'monthly'
            ? win.division.prize * win.division.duration
            : win.division.prize;
          const totalPrize = prizePerWin * win.count;
          newStats[selectedGame].won += totalPrize;
          newStats[selectedGame].divisions[win.division.name] =
            (newStats[selectedGame].divisions[win.division.name] || 0) + win.count;
        });
      }
    });
    newStats[selectedGame].spent += totalSpentInDraw;

    setStats(newStats);
    setIsDrawing(false);
  };

  // Run simulation until Division 1 win
  const runSimulation = async () => {
    abortRef.current = false;
    setIsSimulating(true);

    const gamesPerTicket = getGamesPerTicket(selectedSystem);
    const systemSize = getSystemSize(selectedSystem);
    const ticketCount = tickets.length || 1;
    const spentPerDraw = ticketCount * gamesPerTicket * game.cost;

    setSimStats({
      draws: 0,
      spent: 0,
      won: 0,
      ticketsPerDraw: ticketCount,
      gamesPerDraw: ticketCount * gamesPerTicket,
      startTime: Date.now()
    });

    let totalDraws = 0;
    let totalSpent = 0;
    let totalWon = 0;
    let div1Won = false;
    let bestDivision = null;
    const sessionDivisions = {};

    const runBatch = () => {
      return new Promise((resolve) => {
        for (let i = 0; i < simSpeed && !abortRef.current && !div1Won; i++) {
          const simTickets = [];
          for (let j = 0; j < ticketCount; j++) {
            simTickets.push(generateQuickPick(game, systemSize));
          }

          const mainNumbers = generateNumbers(game.mainPool.count, game.mainPool.range);
          const bonusNumbers = game.bonusPool ? generateNumbers(game.bonusPool.count, game.bonusPool.range) : null;
          const supplementary = game.supplementary ? generateNumbers(game.supplementary.count, game.supplementary.range, mainNumbers) : null;
          const draw = { mainNumbers, bonusNumbers, supplementary };

          totalDraws++;
          totalSpent += spentPerDraw;

          for (const ticket of simTickets) {
            const wins = checkTicket(ticket, draw, game);
            if (wins) {
              wins.forEach(win => {
                const prizePerWin = win.division.prizeType === 'monthly'
                  ? win.division.prize * (win.division.duration || 1)
                  : (win.division.prize || 0);
                totalWon += prizePerWin * win.count;

                sessionDivisions[win.division.name] = (sessionDivisions[win.division.name] || 0) + win.count;

                if (win.division.name.includes('1') || win.division.name === 'Jackpot') {
                  div1Won = true;
                  bestDivision = win.division;
                }
                if (!bestDivision || game.divisions.indexOf(win.division) < game.divisions.indexOf(bestDivision)) {
                  bestDivision = win.division;
                }
              });
              if (div1Won) break;
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

      setSimStats(prev => ({
        ...prev,
        draws: totalDraws,
        spent: totalSpent,
        won: totalWon,
        yearsSimulated,
        drawsPerSec: Math.round(drawsPerSec),
        bestDivision,
        div1Won,
        elapsed
      }));
    };

    while (!div1Won && !abortRef.current) {
      await runBatch();
      updateUI();
      await new Promise(r => setTimeout(r, 10));
    }

    updateUI();
    setIsSimulating(false);

    const newStats = { ...stats };
    if (!newStats[selectedGame]) {
      newStats[selectedGame] = { draws: 0, spent: 0, won: 0, divisions: {} };
    }
    newStats[selectedGame].draws += totalDraws;
    newStats[selectedGame].spent += totalSpent;
    newStats[selectedGame].won += totalWon;

    Object.entries(sessionDivisions).forEach(([name, count]) => {
      newStats[selectedGame].divisions[name] = (newStats[selectedGame].divisions[name] || 0) + count;
    });

    setStats(newStats);
  };

  const stopSimulation = () => {
    abortRef.current = true;
    setIsSimulating(false);
  };

  const clearStats = () => {
    if (confirm(`Clear all stats for ${game.name}?`)) {
      const newStats = { ...stats };
      delete newStats[selectedGame];
      setStats(newStats);
    }
  };

  const totalGames = tickets.reduce((acc, t) => acc + t.gamesPerTicket, 0);
  const totalCost = totalGames * game.cost;
  const gameStats = stats[selectedGame];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link to="/" className="text-gray-500 hover:text-white transition-colors">Home</Link>
        <span className="text-gray-600">/</span>
        <span className="text-white font-medium">{regionFlag} {regionName}</span>
      </div>

      {/* Game Selector */}
      <div className="mb-6">
        <GameSelector games={games} selectedGameId={selectedGame} onSelect={setSelectedGame} />
      </div>

      {/* Game Info */}
      <div className="mb-6 animate-fade-in-up">
        <GameInfoBar
          game={game}
          systemSize={getSystemSize(selectedSystem)}
          gamesPerTicket={getGamesPerTicket(selectedSystem)}
          systemType={selectedSystem}
        />
      </div>

      {/* System Selection */}
      <div className="mb-6">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Entry Type</h3>
          <div className="flex flex-wrap gap-2">
            {getSystemOptions().map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSystem(opt.value)}
                className={`relative overflow-hidden rounded-xl text-sm font-medium transition-all duration-200 px-4 py-2.5
                  ${selectedSystem === opt.value
                    ? `bg-gradient-to-r ${game.color} text-white shadow-lg shadow-black/20`
                    : 'glass text-gray-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
              >
                {opt.label}
                {opt.games && (
                  <span className="ml-2 text-xs opacity-60">({opt.games.toLocaleString()})</span>
                )}
              </button>
            ))}
          </div>
          {selectedSystem !== 'standard' && (
            <p className={`mt-3 text-sm ${game.accent} font-medium`}>
              {getSystemSize(selectedSystem)} numbers selected · {formatCurrency(getGamesPerTicket(selectedSystem) * game.cost, game.currency)} per ticket
            </p>
          )}
        </div>
      </div>

      {/* Quick Pick & Tickets */}
      <div className="mb-6">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Generate Tickets</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {[1, 5, 10, 20, 50].map(count => (
              <button
                key={count}
                onClick={() => addQuickPicks(count)}
                disabled={isSimulating}
                className="btn-premium px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:shadow-none"
              >
                +{count} Quick Pick{count > 1 ? 's' : ''}
              </button>
            ))}
            {tickets.length > 0 && (
              <button
                onClick={clearTickets}
                disabled={isSimulating}
                className="btn-premium px-4 py-2.5 glass text-gray-400 hover:text-white disabled:opacity-50"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Tickets Display */}
          {tickets.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.05] animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-medium text-white">{tickets.length} ticket{tickets.length > 1 ? 's' : ''}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({totalGames.toLocaleString()} games · {formatCurrency(totalCost, game.currency)})
                  </span>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                {tickets.slice(0, 10).map((ticket, i) => (
                  <div key={ticket.id} className="glass rounded-xl p-3 group relative">
                    <button
                      onClick={() => removeTicket(ticket.id)}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/[0.05] hover:bg-red-500/30 text-gray-500 hover:text-red-400 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium">
                        #{i + 1} {ticket.systemType !== 'standard' && ticket.systemType.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{ticket.gamesPerTicket} game{ticket.gamesPerTicket > 1 ? 's' : ''}</span>
                    </div>
                    <NumberBalls
                      numbers={ticket.mainNumbers}
                      highlight={drawResult?.mainNumbers}
                      colors={{ main: drawResult?.mainNumbers, supp: drawResult?.supplementary }}
                    />
                    {ticket.bonusNumbers && (
                      <div className="mt-2 pt-2 border-t border-white/[0.05]">
                        <span className="text-xs text-gray-500 mr-2">+ Bonus</span>
                        <NumberBalls numbers={ticket.bonusNumbers} highlight={drawResult?.bonusNumbers} colors={{ bonus: drawResult?.bonusNumbers }} size="sm" />
                      </div>
                    )}
                    {ticket.supplementary && !game.bonusPool && (
                      <div className="mt-2 pt-2 border-t border-white/[0.05]">
                        <span className="text-xs text-gray-500 mr-2">+ Supp</span>
                        <NumberBalls numbers={ticket.supplementary} highlight={drawResult?.supplementary} colors={{ supp: drawResult?.supplementary }} size="sm" />
                      </div>
                    )}
                  </div>
                ))}
                {tickets.length > 10 && (
                  <p className="text-xs text-gray-500 text-center italic py-1">...and {tickets.length - 10} more tickets</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={runDraw}
          disabled={tickets.length === 0 || isDrawing || isSimulating}
          className="btn-premium flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:shadow-none"
        >
          <span className="text-xl">🎱</span> Run Draw
        </button>
        <button
          onClick={isSimulating ? stopSimulation : runSimulation}
          disabled={tickets.length === 0 && !isSimulating}
          className={`btn-premium flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all
            ${isSimulating
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-red-900/20'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 shadow-purple-900/20'
            }
            disabled:opacity-50 disabled:shadow-none`}
        >
          <span className="text-xl">{isSimulating ? '⏹' : '🚀'}</span>
          {isSimulating ? 'Stop Simulation' : 'Run Until Division 1'}
        </button>
      </div>

      {/* Draw Results */}
      {drawResult && (
        <div className="mb-6 animate-fade-in-up">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Latest Draw</h3>
            <div className="flex items-center gap-3 mb-4">
              <NumberBalls numbers={drawResult.mainNumbers} colors={{}} />
              {drawResult.bonusNumbers && (
                <>
                  <span className="text-gray-500 text-lg">+</span>
                  <NumberBalls numbers={drawResult.bonusNumbers} colors={{ bonus: drawResult.bonusNumbers }} />
                </>
              )}
              {drawResult.supplementary && (
                <>
                  <span className="text-gray-500 text-lg">+</span>
                  <NumberBalls numbers={drawResult.supplementary} colors={{ supp: drawResult.supplementary }} />
                </>
              )}
            </div>

            {results.filter(r => r.result).length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <span>🎉</span> Winners!
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {results.filter(r => r.result).map((r, idx) => (
                    <div key={idx} className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1 font-medium">
                        Ticket #{results.indexOf(r) + 1} {r.ticket.systemType !== 'standard' && r.ticket.systemType.replace('_', ' ').toUpperCase()}
                      </div>
                      {r.result.map((win, j) => (
                        <div key={j} className="flex justify-between items-center mb-1 last:mb-0">
                          <span className="text-sm font-medium text-emerald-300">{win.count}× {win.division.name}</span>
                          <span className="text-sm font-mono text-emerald-400">
                            {formatCurrency(win.count * (win.division.prizeType === 'monthly' ? win.division.prize * win.division.duration : win.division.prize), game.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No winners this draw. Better luck next time!</p>
            )}
          </div>
        </div>
      )}

      {/* Simulation Panel */}
      {(isSimulating || simStats) && (
        <div className="mb-6 animate-fade-in-up">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                {isSimulating && <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse" />}
                {isSimulating ? 'Simulation Running' : 'Simulation Complete'}
              </h3>
              {isSimulating && (
                <div className="flex gap-1.5">
                  {[100, 1000, 5000].map(s => (
                    <button
                      key={s}
                      onClick={() => setSimSpeed(s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${simSpeed === s ? 'bg-purple-500/30 text-purple-300' : 'bg-white/[0.05] text-gray-400 hover:text-white'}`}
                    >
                      {s.toLocaleString()}/batch
                    </button>
                  ))}
                </div>
              )}
            </div>

            {simStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass rounded-xl p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Draws</p>
                  <p className="text-lg font-bold text-white font-mono">{simStats.draws.toLocaleString()}</p>
                </div>
                <div className="glass rounded-xl p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Spent</p>
                  <p className="text-lg font-bold text-white font-mono">{formatCurrency(simStats.spent, game.currency)}</p>
                </div>
                <div className="glass rounded-xl p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Won</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono">{formatCurrency(simStats.won, game.currency)}</p>
                </div>
                <div className="glass rounded-xl p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Years</p>
                  <p className="text-lg font-bold text-white font-mono">{simStats.yearsSimulated?.toFixed(1) || '0'}</p>
                </div>
                {simStats.bestDivision && (
                  <div className="col-span-full glass rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{simStats.div1Won ? '🏆' : '📊'}</span>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Best Result</p>
                        <p className="text-sm font-bold text-white">
                          {simStats.div1Won ? `Won ${simStats.bestDivision.name}!` : `${simStats.bestDivision.name} (${formatCurrency(simStats.bestDivision.prize, game.currency)})`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {simStats.drawsPerSec > 0 && (
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Speed</p>
                    <p className="text-lg font-bold text-white font-mono">{simStats.drawsPerSec.toLocaleString()}/s</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Panel */}
      {gameStats && (
        <div className="mb-6 animate-fade-in-up">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Session Stats — {game.name}
              </h3>
              <button
                onClick={clearStats}
                className="text-xs text-gray-500 hover:text-red-400 transition px-2 py-1 rounded-lg hover:bg-red-500/10"
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Draws</p>
                <p className="text-lg font-bold text-white font-mono">{gameStats.draws.toLocaleString()}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Spent</p>
                <p className="text-lg font-bold text-white font-mono">{formatCurrency(gameStats.spent, game.currency)}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Won</p>
                <p className="text-lg font-bold text-emerald-400 font-mono">{formatCurrency(gameStats.won, game.currency)}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Return</p>
                <p className={`text-lg font-bold font-mono ${gameStats.spent > 0 ? (gameStats.won / gameStats.spent * 100 >= 100 ? 'text-emerald-400' : 'text-red-400') : 'text-gray-400'}`}>
                  {gameStats.spent > 0 ? `${(gameStats.won / gameStats.spent * 100).toFixed(1)}%` : '—'}
                </p>
              </div>
            </div>
            {Object.keys(gameStats.divisions).length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/[0.05]">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Division Wins</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(gameStats.divisions).map(([name, count]) => (
                    <span key={name} className="glass rounded-lg px-2.5 py-1 text-xs font-medium text-gray-300">
                      {count}× {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}