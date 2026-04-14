import { useState } from 'react';
import { Moon, Sun, Globe, ChevronRight, Trash2, Download, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../hooks/useToast';
import { CURRENCIES } from '../utils/constants';
import ConfirmDialog from '../components/ConfirmDialog';

function SettingRow({ icon, label, subtitle, right, onClick, danger }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
        width: '100%', background: 'none', border: 'none', cursor: onClick ? 'pointer' : 'default',
        color: danger ? 'var(--danger)' : 'var(--text-primary)',
        transition: 'background 150ms ease',
        borderRadius: 0,
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.background = 'var(--bg-tertiary)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: danger ? 'var(--danger-soft)' : 'var(--bg-tertiary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? 'var(--danger)' : 'var(--text-secondary)', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{label}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>{subtitle}</div>}
      </div>
      {right}
      {onClick && !right && <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />}
    </Tag>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {title && <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.7, padding: '0 0 8px', marginLeft: 4 }}>{title}</div>}
      <div className="card" style={{ overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

export default function Settings() {
  const { settings, setTheme, setCurrency, transactions, books } = useApp();
  const { toast } = useToast();
  const [clearConfirm, setClearConfirm] = useState(false);
  const isDark = settings.theme === 'dark';

  function handleClearData() {
    localStorage.removeItem('expense-tracker-v1');
    toast('All data cleared. Refresh to reset.', 'success');
    setClearConfirm(false);
    setTimeout(() => window.location.reload(), 1000);
  }

  function handleExport() {
    const data = { books, transactions, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Data exported successfully', 'success');
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Settings</div>
      </div>

      <Section title="Appearance">
        <SettingRow
          icon={isDark ? <Moon size={16} /> : <Sun size={16} />}
          label="Dark Mode"
          subtitle={isDark ? 'Currently dark' : 'Currently light'}
          right={
            <label className="toggle">
              <input type="checkbox" checked={isDark} onChange={e => setTheme(e.target.checked ? 'dark' : 'light')} />
              <div className="toggle-track" />
              <div className="toggle-thumb" />
            </label>
          }
        />
      </Section>

      <Section title="Currency">
        {CURRENCIES.map((c, i) => (
          <div key={c.symbol}>
            {i > 0 && <div className="divider" style={{ margin: '0 16px' }} />}
            <SettingRow
              icon={<span style={{ fontSize: 14, fontWeight: 700 }}>{c.symbol}</span>}
              label={c.name}
              subtitle={c.symbol}
              onClick={() => { setCurrency(c.symbol); toast(`Currency set to ${c.name}`, 'success'); }}
              right={settings.currency === c.symbol && (
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
            />
          </div>
        ))}
      </Section>

      <Section title="Data">
        <SettingRow
          icon={<Download size={16} />}
          label="Export Data"
          subtitle="Download JSON backup"
          onClick={handleExport}
        />
        <div className="divider" style={{ margin: '0 16px' }} />
        <SettingRow
          icon={<Trash2 size={16} />}
          label="Clear All Data"
          subtitle={`${transactions.length} transactions, ${books.length} books`}
          onClick={() => setClearConfirm(true)}
          danger
        />
      </Section>

      <Section title="About">
        <SettingRow
          icon={<Info size={16} />}
          label="Expense Tracker"
          subtitle="Version 1.0.0 · Built with ♥"
        />
      </Section>

      <div style={{ textAlign: 'center', padding: '8px 0 24px', fontSize: 12, color: 'var(--text-tertiary)' }}>
        All data is stored locally on your device.
      </div>

      <ConfirmDialog
        open={clearConfirm}
        title="Clear All Data?"
        description="This will permanently delete all books and transactions. This action cannot be undone."
        confirmLabel="Clear Everything"
        onConfirm={handleClearData}
        onCancel={() => setClearConfirm(false)}
      />
    </div>
  );
}
