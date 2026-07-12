export default function GameInfoBar({ game, systemSize, gamesPerTicket, systemType }) {
  const formatCost = () => {
    const cost = gamesPerTicket * game.cost;
    if (game.currency === 'JPY') return `¥${cost.toLocaleString()}`;
    const sym = game.currency === 'AUD' ? 'A$' : game.currency === 'USD' ? '$' : game.currency === 'EUR' ? '€' : game.currency === 'CAD' ? 'C$' : '$';
    return `${sym}${cost.toFixed(2)}`;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Gradient border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${game.color} opacity-40`} />
      {/* Glass content */}
      <div className="relative glass-strong rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{game.flag}</span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{game.name}</h2>
              <p className="text-gray-400 text-sm mt-0.5">
                Pick {game.mainPool.count} from {game.mainPool.range}
                {game.bonusPool && ` + ${game.bonusPool.count} ${game.bonusPool.name} from ${game.bonusPool.range}`}
                {game.supplementary && ` + ${game.supplementary.count} supplementary`}
              </p>
              {game.drawDays && (
                <p className="text-gray-500 text-xs mt-1">
                  Draws {game.drawDays.join(' · ')} — {game.drawsPerYear} draws/year
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-5 sm:text-right">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Ticket</p>
              <p className="text-lg font-bold text-white">{formatCost()}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Div 1 Odds</p>
              <p className="text-lg font-bold text-white/90">1 in {game.jackpotOdds.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}