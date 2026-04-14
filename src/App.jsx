import { useState, lazy, Suspense } from 'react';
import { Plus } from 'lucide-react';
import BottomNav from './components/BottomNav';
import TransactionModal from './components/TransactionModal';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Books = lazy(() => import('./pages/Books'));
const Settings = lazy(() => import('./pages/Settings'));

function PageFallback() {
  return (
    <div style={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[120, 80, 100, 60, 90].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: 16, width: `${w}%`, borderRadius: 8 }} />
      ))}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [addOpen, setAddOpen] = useState(false);

  function handlePageChange(p) {
    setPage(p);
  }

  const pages = {
    dashboard: Dashboard,
    transactions: Transactions,
    books: Books,
    settings: Settings,
  };

  const PageComponent = pages[page];

  return (
    <div className="app-container">
      <main className="main-content">
        <Suspense fallback={<PageFallback />}>
          <PageComponent key={page} />
        </Suspense>
      </main>

      <BottomNav current={page} onChange={handlePageChange} />

      {/* FAB - only show on pages that need it */}
      {(page === 'dashboard' || page === 'transactions') && (
        <button className="fab" onClick={() => setAddOpen(true)} aria-label="Add transaction">
          <Plus size={26} strokeWidth={2.5} />
        </button>
      )}

      <TransactionModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
