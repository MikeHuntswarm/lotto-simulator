import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/australia', label: 'Australia', flag: '🇦🇺' },
    { to: '/usa', label: 'USA', flag: '🇺🇸' },
    { to: '/europe', label: 'Europe', flag: '🇪🇺' },
    { to: '/canada', label: 'Canada', flag: '🇨🇦' },
    { to: '/japan', label: 'Japan', flag: '🇯🇵' },
    { to: '/spain', label: 'Spain', flag: '🇪🇸' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030308]/80 backdrop-blur-xl border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              🎰
            </span>
            <span className="text-base font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Lotto
              </span>
              <span className="text-gray-500"> Simulator</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-white/[0.08] text-white shadow-inner'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                  {item.flag && <span className="text-base leading-none">{item.flag}</span>}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div id="mobile-menu" className="hidden md:hidden pb-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition
                  ${isActive ? 'bg-white/[0.08] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}
              >
                {item.flag && <span>{item.flag}</span>}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}