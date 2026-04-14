import { useState } from 'react';
import { Plus, Check, Pencil, Trash2, BookOpen } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/constants';
import BookModal from '../components/BookModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Books() {
  const { books, transactions, activeBookId, setActiveBook, deleteBook, settings } = useApp();
  const { toast } = useToast();
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [confirmBook, setConfirmBook] = useState(null);

  function getBookStats(bookId) {
    const txs = transactions.filter(t => t.bookId === bookId);
    const balance = txs.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { count: txs.length, balance, expense };
  }

  function handleDelete(book) {
    if (books.length <= 1) {
      toast("Can't delete the last book", 'error');
      return;
    }
    setConfirmBook(book);
  }

  function confirmDelete() {
    deleteBook(confirmBook.id);
    toast(`"${confirmBook.name}" deleted`, 'success');
    setConfirmBook(null);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Books</div>
          <div className="page-subtitle">{books.length} book{books.length !== 1 ? 's' : ''}</div>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => { setEditBook(null); setBookModalOpen(true); }}
        >
          <Plus size={15} />New
        </button>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><BookOpen size={28} /></div>
          <div className="empty-title">No books yet</div>
          <div className="empty-desc">Create a book to organize your finances by category.</div>
        </div>
      ) : (
        <div>
          {books.map(book => {
            const stats = getBookStats(book.id);
            const isActive = book.id === activeBookId;

            return (
              <div
                key={book.id}
                className={`book-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveBook(book.id)}
                style={{ borderColor: isActive ? book.color : undefined }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: book.color + (isActive ? '30' : '18'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0, transition: 'background 200ms ease',
                }}>{book.icon}</div>

                <div className="book-info">
                  <div className="book-name" style={{ color: isActive ? book.color : undefined }}>
                    {book.name}
                    {isActive && <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-soft)', borderRadius: 99, padding: '1px 7px' }}>Active</span>}
                  </div>
                  <div className="book-count">
                    {stats.count} transaction{stats.count !== 1 ? 's' : ''}
                  </div>
                  <div style={{ marginTop: 4, display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600, color: stats.balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {stats.balance >= 0 ? '+' : '−'}{formatCurrency(Math.abs(stats.balance), settings.currency)}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>balance</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    className="btn-icon"
                    onClick={e => { e.stopPropagation(); setEditBook(book); setBookModalOpen(true); }}
                    style={{ width: 34, height: 34 }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={e => { e.stopPropagation(); handleDelete(book); }}
                    style={{ width: 34, height: 34, color: 'var(--danger)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick tips */}
      <div style={{
        marginTop: 24, background: 'var(--accent-soft)', borderRadius: 'var(--radius-md)',
        padding: '14px 16px', border: '1px solid var(--accent-glow)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>💡 Pro tip</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Create separate books for Personal, Business, or Savings to keep your finances organized. Switch between them using the balance card on the dashboard.
        </div>
      </div>

      <BookModal
        open={bookModalOpen}
        onClose={() => { setBookModalOpen(false); setEditBook(null); }}
        editBook={editBook}
      />

      <ConfirmDialog
        open={!!confirmBook}
        title={`Delete "${confirmBook?.name}"?`}
        description={`This will permanently delete the book and all ${getBookStats(confirmBook?.id || '').count} transactions inside it.`}
        confirmLabel="Delete Book"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmBook(null)}
      />
    </div>
  );
}
