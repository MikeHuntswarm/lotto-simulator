import { LOTTERY_GAMES, getAllRegions, formatNumber } from '../utils/lotteryData';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const regions = getAllRegions();

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center mb-14 sm:mb-18 animate-fade-in-up stagger-1">
        <div className="inline-flex items-center gap-2 bg-white/[0.04] backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-gray-400 border border-white/[0.06] mb-5">
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center text-xs">🌍</span>
          <span>{Object.keys(LOTTERY_GAMES).length} international lottery games</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
          <span className="gradient-text">How Long Until</span>
          <br />
          <span className="gradient-text-accent">You Win?</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Test your luck across {regions.length} regions worldwide. Run simulations, track odds,<br className="hidden sm:block" />
          and see how many draws it takes to hit Division 1.
        </p>
      </div>

      {/* Region Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((region, idx) => {
          const games = region.games.map(id => LOTTERY_GAMES[id]);
          const avgOdds = Math.round(games.reduce((sum, g) => sum + g.jackpotOdds, 0) / games.length);
          const colors = games[0]?.color || 'from-blue-500 to-purple-600';

          return (
            <Link
              key={region.id}
              to={`/region/${region.id}`}
              className={`group relative overflow-hidden rounded-2xl p-5 card-premium animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`}
            >
              {/* Gradient icon badge */}
              <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br ${colors} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-500`} />

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{region.flag}</span>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200 tracking-tight">
                    {region.name}
                  </h3>
                  <p className="text-sm text-gray-500">{games.length} game{games.length > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                {games.map(game => (
                  <div key={game.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      <span className={`font-semibold bg-gradient-to-r ${game.color} bg-clip-text text-transparent`}>{game.shortName}</span>
                      <span className="text-gray-500 ml-1.5">— {game.name}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Avg. Div 1 odds</span>
                <span className="text-xs font-mono text-gray-400 bg-white/[0.03] px-2 py-0.5 rounded-md">
                  1 in {formatNumber(avgOdds)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* How It Works */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '🎫', title: 'Pick Your Game', desc: 'Choose from 12 lotteries across 6 countries with authentic rules and odds.' },
          { icon: '🎟️', title: 'Generate Tickets', desc: 'Quick picks or system entries — play standard or expand your coverage.' },
          { icon: '🚀', title: 'Simulate Draws', desc: 'Run individual draws or simulate until you hit Division 1.' },
        ].map((step, i) => (
          <div key={i} className="glass rounded-2xl p-6 text-center card-premium animate-fade-in-up" style={{ animationDelay: `${400 + i * 120}ms` }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] flex items-center justify-center mx-auto mb-3 text-2xl border border-white/[0.06]">
              {step.icon}
            </div>
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] mb-1.5">Step {i + 1}</div>
            <h4 className="font-bold text-white mb-2 tracking-tight">{step.title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}