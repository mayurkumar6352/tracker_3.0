import { LayoutDashboard, ArrowLeftRight, BookOpen, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'History', icon: ArrowLeftRight },
  { id: 'books', label: 'Books', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function BottomNav({ current, onChange }) {
  return (
    <nav className="bottom-nav">
      <div className="nav-logo" style={{ display: 'none' }}>
        <span style={{ color: 'var(--accent)' }}>💰</span> Expenses
      </div>
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`nav-item ${current === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
        >
          <Icon size={22} className="nav-icon" strokeWidth={current === id ? 2.2 : 1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
