export default function GameSelector({ games, selectedGameId, onSelect }) {
  if (games.length <= 2) {
    return (
      <div className="flex gap-3 justify-center flex-wrap">
        {games.map(game => {
          const isActive = selectedGameId === game.id;
          return (
            <button
              key={game.id}
              onClick={() => onSelect(game.id)}
              className={`relative overflow-hidden rounded-xl font-semibold text-sm transition-all duration-300 px-5 py-3
                ${isActive
                  ? `bg-gradient-to-r ${game.color} text-white shadow-lg shadow-black/30 scale-105`
                  : 'glass text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-lg">{game.flag}</span>
                <span>{game.name}</span>
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {games.map(game => {
        const isActive = selectedGameId === game.id;
        return (
          <button
            key={game.id}
            onClick={() => onSelect(game.id)}
            className={`relative overflow-hidden rounded-xl font-medium transition-all duration-300 text-left p-4
              ${isActive
                ? `bg-gradient-to-r ${game.color} text-white shadow-lg shadow-black/30`
                : 'glass text-gray-300 hover:text-white hover:bg-white/[0.06]'
              }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{game.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{game.name}</div>
                <div className={`text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                  {game.mainPool.count}/{game.mainPool.range}
                  {game.bonusPool && ` + ${game.bonusPool.count}/${game.bonusPool.range}`}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                  {game.cost < 10 ? `$${game.cost.toFixed(2)}` : `$${game.cost}`}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}