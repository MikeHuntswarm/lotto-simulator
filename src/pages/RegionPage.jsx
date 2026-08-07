import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getGamesByRegion, LOTTERY_GAMES, formatCurrency, formatNumber } from '../utils/lotteryData';
import { prizeValue, generateQuickPick } from '../utils/engine';
import { runSingleDraw, simulateUntilDivision1 } from '../utils/simulation';
import { loadStats, saveStats, recordDraw } from '../utils/stats';
import { systemEntriesFor, systemSizeOf, gamesPerTicketFor } from '../utils/systems';
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

  // Load stats from the stats store
  useEffect(() => {
    setStats(loadStats());
  }, []);

  // Save stats to the stats store
  useEffect(() => {
    if (Object.keys(stats).length > 0) {
      saveStats(stats);
    }
  }, [stats]);

  // System entry options come from the domain module
  const systemEntries = systemEntriesFor(game);
  const getSystemSize = (sys) => systemSizeOf(sys, game);
  const getGamesPerTicket = (sys) => gamesPerTicketFor(sys, game);

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

    // The engine generates the draw, evaluates tickets, and produces the
    // ledger (spent / won / divisions) in one call.
    const { draw, ticketResults, spent, won, divisions } = runSingleDraw({ game, tickets });

    setDrawResult(draw);
    setResults(ticketResults);

    // Update stats via the stats store's accumulation
    setStats(prev => recordDraw(prev, selectedGame, { draws: 1, spent, won, divisions }));
    setIsDrawing(false);
  };

  // Run simulation until Division 1 win — the loop lives in the engine now.
  const runSimulation = async () => {
    abortRef.current = false;
    setIsSimulating(true);

    const gamesPerTicket = getGamesPerTicket(selectedSystem);
    const systemSize = getSystemSize(selectedSystem);
    const ticketCount = tickets.length || 1;

    setSimStats({
      draws: 0,
      spent: 0,
      won: 0,
      ticketsPerDraw: ticketCount,
      gamesPerDraw: ticketCount * gamesPerTicket,
      startTime: Date.now()
    });

    const result = await simulateUntilDivision1({
      game,
      systemSize,
      ticketsPerDraw: ticketCount,
      batchSize: simSpeed,
      shouldAbort: () => abortRef.current,
      onProgress: (snapshot) => setSimStats(prev => ({
        ...prev,
        ...snapshot,
        ticketsPerDraw: ticketCount,
        gamesPerDraw: ticketCount * gamesPerTicket,
      })),
    });

    setIsSimulating(false);

    // Save final stats via the stats store's accumulation
    setStats(prev => recordDraw(prev, selectedGame, {
      draws: result.draws,
      spent: result.spent,
      won: result.won,
      divisions: result.divisions,
    }));
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
            {systemEntries.map((opt, idx) => (
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
                            {formatCurrency(prizeValue(win.division, win.count), game.currency)}
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