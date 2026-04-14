import { useState, useMemo } from 'react';
import { ChevronRight, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import {
  formatCurrency, formatCurrencyFull, getCategoryBreakdown,
  groupByDate, formatDate, getMonthKey, formatMonthKey,
} from '../utils/constants';
import TransactionItem from '../components/TransactionItem';
import TransactionDetail from '../components/TransactionDetail';
import TransactionModal from '../components/TransactionModal';

export default function Dashboard() {
  const { bookTransactions, activeBook, settings } = useApp();
  const [selectedTx, setSelectedTx] = useState(null);
  const [editTx, setEditTx] = useState(null);

  const thisMonth = useMemo(() => {
    const key = getMonthKey(new Date().toISOString());
    return bookTransactions.filter(t => getMonthKey(t.date) === key);
  }, [bookTransactions]);

  const totalBalance = useMemo(() =>
    bookTransactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0),
    [bookTransactions]);

  const monthlyExpense = useMemo(() =>
    thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [thisMonth]);

  const monthlyIncome = useMemo(() =>
    thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [thisMonth]);

  const categoryBreakdown = useMemo(() => getCategoryBreakdown(thisMonth), [thisMonth]);

  const recentGroups = useMemo(() => {
    const sorted = [...bookTransactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
    return groupByDate(sorted);
  }, [bookTransactions]);

  const maxCatTotal = categoryBreakdown[0]?.total || 1;

  return (
    <div className="page">
      {/* Balance Card */}
      <div className="balance-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="balance-label">Total Balance</div>
          <div style={{
            background: 'rgba(255,255,255,0.18)', borderRadius: 'var(--radius-full)',
            padding: '3px 10px', fontSize: 12, fontWeight: 600,
          }}>{activeBook?.icon} {activeBook?.name}</div>
        </div>
        <div className="balance-amount">{formatCurrencyFull(totalBalance, settings.currency)}</div>
        <div className="balance-meta">
          {formatMonthKey(getMonthKey(new Date().toISOString()))}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">Income</div>
          <div className="summary-value" style={{ color: 'var(--success)', fontSize: 18 }}>
            {formatCurrency(monthlyIncome, settings.currency)}
          </div>
          <div className="summary-sub">This month</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Expenses</div>
          <div className="summary-value" style={{ color: 'var(--danger)', fontSize: 18 }}>
            {formatCurrency(monthlyExpense, settings.currency)}
          </div>
          <div className="summary-sub">This month</div>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">By Category</span>
            <span className="text-sm text-secondary">{formatMonthKey(getMonthKey(new Date().toISOString()))}</span>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <div className="chart-bar-group">
              {categoryBreakdown.slice(0, 6).map(cat => (
                <div key={cat.id} className="chart-bar-row">
                  <div className="chart-bar-label">
                    <span style={{ marginRight: 4 }}>{cat.icon}</span>
                    {cat.label}
                  </div>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill"
                      style={{
                        width: `${(cat.total / maxCatTotal) * 100}%`,
                        background: cat.color,
                      }}
                    />
                  </div>
                  <div className="chart-bar-value">{formatCurrency(cat.total, settings.currency)}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Recent Transactions */}
      <div className="section-header">
        <span className="section-title">Recent</span>
      </div>

      {recentGroups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Wallet size={28} /></div>
          <div className="empty-title">No transactions yet</div>
          <div className="empty-desc">Tap the + button below to add your first expense or income.</div>
        </div>
      ) : (
        recentGroups.map(([date, txs]) => {
          const dayTotal = txs.reduce((s, t) => t.type === 'expense' ? s - t.amount : s + t.amount, 0);
          return (
            <div key={date}>
              <div className="date-group-header">
                <span>{formatDate(date)}</span>
                <span className={`date-group-total ${dayTotal < 0 ? 'text-danger' : 'text-success'}`}>
                  {dayTotal < 0 ? '−' : '+'}{formatCurrency(Math.abs(dayTotal), settings.currency)}
                </span>
              </div>
              <div className="card-list">
                {txs.map(tx => (
                  <TransactionItem
                    key={tx.id}
                    tx={tx}
                    onClick={setSelectedTx}
                    currency={settings.currency}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}

      <TransactionDetail
        tx={selectedTx}
        onClose={() => setSelectedTx(null)}
        onEdit={tx => { setSelectedTx(null); setEditTx(tx); }}
      />
      <TransactionModal
        open={!!editTx}
        onClose={() => setEditTx(null)}
        editTx={editTx}
      />
    </div>
  );
}
