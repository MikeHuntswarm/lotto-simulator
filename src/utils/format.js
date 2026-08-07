// ============================================
// FORMAT HELPERS — presentation-only concerns
// ============================================

// Currency symbols
export const CURRENCY_SYMBOLS = { AUD: '$', USD: '$', EUR: '€', CAD: 'C$', JPY: '¥' };

// Format currency
export const formatCurrency = (amount, currency) => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  if (currency === 'JPY') return `${symbol}${amount.toLocaleString()}`;
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Format large numbers (1.2M, 3.4B)
export const formatNumber = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};
