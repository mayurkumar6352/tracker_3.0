import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ListFilter } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { CATEGORIES, formatDate, formatCurrency, groupByDate, getCategoryById } from '../utils/constants';
import TransactionItem from '../components/TransactionItem';
import TransactionDetail from '../components/TransactionDetail';
import TransactionModal from '../components/TransactionModal';

const TYPE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'expense', label: 'Expenses' },
  { id: 'income', label: 'Income' },
];

export default function Transactions() {
  const { bookTransactions, settings } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [editTx, setEditTx] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return bookTransactions.filter(tx => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (catFilter !== 'all' && tx.category !== catFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const cat = getCategoryById(tx.category);
        if (!tx.notes?.toLowerCase().includes(q) && !cat.label.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [bookTransactions, typeFilter, catFilter, search]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const totalExpense = useMemo(() => filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [filtered]);
  const totalIncome = useMemo(() => filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [filtered]);

  const hasActiveFilter = typeFilter !== 'all' || catFilter !== 'all';

  function clearFilters() {
    setTypeFilter('all');
    setCatFilter('all');
    setSearch('');
  }

  return (
    <div className="page">
      <div className="page-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="page-title">Transactions</span>
          <button
            className={`btn-icon ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(v => !v)}
            style={{ color: showFilters ? 'var(--accent)' : undefined, background: showFilters ? 'var(--accent-soft)' : undefined }}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 36, paddingTop: 10, paddingBottom: 10, fontSize: 14 }}
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 12, border: '1px solid var(--border-color)' }}>
            <div>
              <div className="form-label" style={{ marginBottom: 8 }}>Type</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {TYPE_FILTERS.map(f => (
                  <button
                    key={f.id}
                    className={`filter-chip ${typeFilter === f.id ? 'active' : ''}`}
                    onClick={() => setTypeFilter(f.id)}
                  >{f.label}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="form-label" style={{ marginBottom: 8 }}>Category</div>
              <div className="filter-row">
                <button className={`filter-chip ${catFilter === 'all' ? 'active' : ''}`} onClick={() => setCatFilter('all')}>All</button>
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    className={`filter-chip ${catFilter === c.id ? 'active' : ''}`}
                    onClick={() => setCatFilter(c.id)}
                  >{c.icon} {c.label}</button>
                ))}
              </div>
            </div>
            {hasActiveFilter && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ alignSelf: 'flex-start' }}>
                <X size={13} /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary Row */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, background: 'var(--success-soft)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
            <div style={{ fontSize: 10, color: 'var(--success)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Income</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
              +{formatCurrency(totalIncome, settings.currency)}
            </div>
          </div>
          <div style={{ flex: 1, background: 'var(--danger-soft)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
            <div style={{ fontSize: 10, color: 'var(--danger)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Expenses</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
              -{formatCurrency(totalExpense, settings.currency)}
            </div>
          </div>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><ListFilter size={28} /></div>
          <div className="empty-title">{hasActiveFilter || search ? 'No results' : 'No transactions'}</div>
          <div className="empty-desc">
            {hasActiveFilter || search
              ? 'Try adjusting your filters or search query.'
              : 'Start adding transactions using the + button.'}
          </div>
          {(hasActiveFilter || search) && (
            <button className="btn btn-secondary btn-sm" onClick={clearFilters} style={{ marginTop: 8 }}>Clear filters</button>
          )}
        </div>
      ) : (
        groups.map(([date, txs]) => {
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
