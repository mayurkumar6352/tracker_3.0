export const CATEGORIES = [
  { id: 'food', label: 'Food', icon: '🍔', color: '#FF9F0A', colorVar: 'var(--warning)' },
  { id: 'transport', label: 'Travel', icon: '🚗', color: '#5AC8FA', colorVar: 'var(--teal)' },
  { id: 'bills', label: 'Bills', icon: '🧾', color: '#FF453A', colorVar: 'var(--danger)' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#BF5AF2', colorVar: 'var(--purple)' },
  { id: 'health', label: 'Health', icon: '💊', color: '#30D158', colorVar: 'var(--success)' },
  { id: 'entertainment', label: 'Fun', icon: '🎬', color: '#FF375F', colorVar: 'var(--pink)' },
  { id: 'education', label: 'Education', icon: '📚', color: '#5E5CE6', colorVar: 'var(--indigo)' },
  { id: 'salary', label: 'Salary', icon: '💰', color: '#30D158', colorVar: 'var(--success)' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: '#0A84FF', colorVar: 'var(--accent)' },
  { id: 'investment', label: 'Invest', icon: '📈', color: '#5E5CE6', colorVar: 'var(--indigo)' },
  { id: 'rent', label: 'Rent', icon: '🏠', color: '#FF6B00', colorVar: 'var(--orange)' },
  { id: 'other', label: 'Other', icon: '💫', color: '#636366', colorVar: 'var(--text-secondary)' },
];

export const BOOK_COLORS = [
  '#0A84FF', '#30D158', '#FF9F0A', '#FF453A',
  '#BF5AF2', '#5AC8FA', '#FF375F', '#5E5CE6',
  '#FF6B00', '#636366',
];

export const BOOK_ICONS = ['👤', '💼', '🏦', '🏠', '✈️', '🎯', '💡', '🌟', '🔐', '💎'];

export const CURRENCIES = [
  { symbol: '₹', name: 'INR' },
  { symbol: '$', name: 'USD' },
  { symbol: '€', name: 'EUR' },
  { symbol: '£', name: 'GBP' },
  { symbol: '¥', name: 'JPY' },
];

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export function formatCurrency(amount, currency = '₹') {
  const abs = Math.abs(amount);
  const formatted = abs >= 1_00_000
    ? (abs / 1_00_000).toFixed(1) + 'L'
    : abs >= 1_000
    ? (abs / 1_000).toFixed(abs >= 10_000 ? 0 : 1) + 'K'
    : abs.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return currency + formatted;
}

export function formatCurrencyFull(amount, currency = '₹') {
  const abs = Math.abs(amount);
  return currency + abs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function getMonthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function formatMonthKey(key) {
  const [year, month] = key.split('-');
  const d = new Date(+year, +month - 1, 1);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function groupByDate(transactions) {
  const groups = {};
  for (const tx of transactions) {
    const key = tx.date;
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  }
  return Object.entries(groups).sort(([a], [b]) => new Date(b) - new Date(a));
}

export function getCategoryBreakdown(transactions) {
  const map = {};
  for (const tx of transactions) {
    if (tx.type === 'expense') {
      if (!map[tx.category]) map[tx.category] = 0;
      map[tx.category] += tx.amount;
    }
  }
  return Object.entries(map)
    .map(([id, total]) => ({ ...getCategoryById(id), total }))
    .sort((a, b) => b.total - a.total);
}
