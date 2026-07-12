import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import RegionPage from './pages/RegionPage';
import { getAllRegions } from './utils/lotteryData';

const regions = getAllRegions();

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#030308] text-white overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Subtle grid overlay */}
        <div
          className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <NavBar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {regions.map(region => (
                <Route
                  key={region.id}
                  path={`/region/${region.id}`}
                  element={<RegionPage regionId={region.id} regionName={region.name} regionFlag={region.flag} />}
                />
              ))}
              {/* Legacy routes */}
              {regions.map(region => (
                <Route
                  key={`legacy-${region.id}`}
                  path={region.id}
                  element={<RegionPage regionId={region.id} regionName={region.name} regionFlag={region.flag} />}
                />
              ))}
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}