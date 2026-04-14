import { getCategoryById, formatCurrencyFull, formatDate } from '../utils/constants';

export default function TransactionItem({ tx, onClick, currency = '₹' }) {
  const cat = getCategoryById(tx.category);

  return (
    <div className="transaction-item" onClick={() => onClick?.(tx)}>
      <div
        className="transaction-icon"
        style={{ background: cat.color + '20' }}
      >
        {cat.icon}
      </div>
      <div className="transaction-info">
        <div className="transaction-title">{tx.notes || cat.label}</div>
        <div className="transaction-meta">
          {cat.label} · {formatDate(tx.date)}
        </div>
      </div>
      <div className={`transaction-amount ${tx.type}`}>
        {tx.type === 'expense' ? '−' : '+'}{formatCurrencyFull(tx.amount, currency)}
      </div>
    </div>
  );
}
