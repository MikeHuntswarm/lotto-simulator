# 🎰 Lotto Simulator

A multi-country lottery simulator featuring games from Australia, USA, Europe, and more. Test your luck and see how long it takes to win Division 1!

## 🎮 Features

- **Australian Lotteries**: Saturday Lotto, Monday Lotto, Wednesday Lotto, Oz Lotto, Powerball, Set for Life
- **US Lotteries**: Powerball, Mega Millions
- **European Lotteries**: EuroMillions, Eurojackpot
- **Coming Soon**: Canada (Lotto Max, 6/49), Japan (Loto 6, Loto 7), Spain (El Gordo)

### Game Features
- Quick Pick (auto-generate numbers)
- Bulk ticket purchase (5, 10, 20, 50 games)
- Animated ball draws
- Division-based prize structures
- "Run until Division 1" simulation mode
- Statistics tracking with localStorage persistence

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lotto-simulator.git
cd lotto-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
lotto-simulator/
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Main app component
│   ├── LottoSimulator.jsx    # Core simulator component
│   └── index.css             # Tailwind styles
├── INTERNATIONAL_LOTTERY_RESEARCH.md  # Lottery rules research
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 Roadmap

- [x] Australian lottery games
- [x] US Powerball & Mega Millions
- [x] European EuroMillions & Eurojackpot
- [ ] Canadian Lotto Max & 6/49
- [ ] Japanese Loto 6 & Loto 7
- [ ] Spanish El Gordo
- [ ] Historical statistics dashboard
- [ ] Share results feature
- [ ] Mobile-optimized UI

## 📊 Lottery Odds Reference

| Lottery | Jackpot Odds | Cost |
|---------|-------------|------|
| Aus Saturday Lotto | 1 in 8.1M | $1.35 |
| Aus Powerball | 1 in 134.5M | $1.60 |
| US Powerball | 1 in 292.2M | $2.00 |
| US Mega Millions | 1 in 302.6M | $5.00 |
| EuroMillions | 1 in 139.8M | €2.50 |

## 📄 License

MIT License - feel free to use and modify!

## 🙏 Acknowledgments

- Lottery data sourced from official lottery websites
- Built with React + Vite + Tailwind CSS
