import { useState } from 'react';
import { X, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../hooks/useToast';
import { getCategoryById, formatCurrencyFull } from '../utils/constants';
import ConfirmDialog from './ConfirmDialog';

export default function TransactionDetail({ tx, onClose, onEdit }) {
  const { deleteTransaction, settings } = useApp();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!tx) return null;

  const cat = getCategoryById(tx.category);

  function handleDelete() {
    deleteTransaction(tx.id);
    toast('Transaction deleted', 'success');
    setConfirmOpen(false);
    onClose();
  }

  return (
    <>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-sheet">
          <div className="modal-handle" />
          <div className="modal-header">
            <span className="modal-title">Details</span>
            <button className="btn-icon" onClick={onClose}><X size={18} /></button>
          </div>

          {/* Hero */}
          <div style={{
            textAlign: 'center', padding: '16px 0 24px',
            borderBottom: '1px solid var(--divider)', marginBottom: 20,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: cat.color + '20',
              fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>{cat.icon}</div>
            <div style={{
              fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-mono)',
              color: tx.type === 'expense' ? 'var(--danger)' : 'var(--success)',
              letterSpacing: -1,
            }}>
              {tx.type === 'expense' ? '−' : '+'}{formatCurrencyFull(tx.amount, settings.currency)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
              {cat.label}
            </div>
          </div>

          {/* Details */}
          {[
            { label: 'Type', value: tx.type === 'expense' ? 'Expense' : 'Income' },
            { label: 'Date', value: new Date(tx.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
            tx.notes && { label: 'Notes', value: tx.notes },
            { label: 'Added', value: new Date(tx.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) },
          ].filter(Boolean).map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--divider)' }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button
              className="btn btn-secondary"
              style={{ flex: 1, gap: 6 }}
              onClick={() => { onClose(); onEdit(tx); }}
            >
              <Pencil size={15} />Edit
            </button>
            <button
              className="btn btn-danger"
              style={{ flex: 1, gap: 6 }}
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 size={15} />Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Transaction"
        description="This action cannot be undone. The transaction will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
