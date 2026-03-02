export const formatCurrency = (n: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export const formatPercent = (n: number, decimals = 1): string =>
  `${(n * 100).toFixed(decimals)}%`;

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('en-US').format(n);

export const formatRatio = (n: number): string =>
  `${n.toFixed(2)}x`;
