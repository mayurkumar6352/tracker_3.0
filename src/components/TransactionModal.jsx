import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../hooks/useToast';
import { CATEGORIES } from '../utils/constants';

export default function TransactionModal({ open, onClose, editTx = null }) {
  const { addTransaction, updateTransaction, activeBookId, settings } = useApp();
  const { toast } = useToast();
  const inputRef = useRef(null);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editTx) {
      setType(editTx.type);
      setAmount(String(editTx.amount));
      setCategory(editTx.category);
      setDate(editTx.date);
      setNotes(editTx.notes || '');
    } else {
      setType('expense');
      setAmount('');
      setCategory('food');
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [editTx, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 320);
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit() {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      toast('Please enter a valid amount', 'error');
      return;
    }
    const data = { type, amount: num, category, date, notes: notes.trim(), bookId: activeBookId };
    if (editTx) {
      updateTransaction({ ...data, id: editTx.id });
      toast('Transaction updated', 'success');
    } else {
      addTransaction(data);
      toast('Transaction added', 'success');
    }
    onClose();
  }

  const expenseCategories = CATEGORIES.filter(c => !['salary', 'freelance', 'investment'].includes(c.id));
  const incomeCategories = CATEGORIES.filter(c => ['salary', 'freelance', 'investment', 'other'].includes(c.id));
  const visibleCategories = type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-header">
          <span className="modal-title">{editTx ? 'Edit Transaction' : 'New Transaction'}</span>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Type Segment */}
        <div className="segment-control mb-4">
          <button
            className={`segment-btn ${type === 'expense' ? 'active' : ''}`}
            onClick={() => { setType('expense'); setCategory('food'); }}
          >Expense</button>
          <button
            className={`segment-btn ${type === 'income' ? 'active' : ''}`}
            onClick={() => { setType('income'); setCategory('salary'); }}
          >Income</button>
        </div>

        {/* Amount */}
        <div className="form-group mb-4">
          <label className="form-label">Amount ({settings.currency})</label>
          <input
            ref={inputRef}
            type="number"
            className="form-input"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="0"
            step="0.01"
            inputMode="decimal"
            style={{ fontSize: 24, fontFamily: 'var(--font-mono)', fontWeight: 700 }}
          />
        </div>

        {/* Category */}
        <div className="form-group mb-4">
          <label className="form-label">Category</label>
          <div className="category-grid">
            {visibleCategories.map(cat => (
              <button
                key={cat.id}
                className={`category-option ${category === cat.id ? 'selected' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                <div className="category-option-icon" style={{ background: cat.color + '20' }}>
                  {cat.icon}
                </div>
                <span className="category-option-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="form-group mb-4">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-input"
            value={date}
            onChange={e => setDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>

        {/* Notes */}
        <div className="form-group mb-4">
          <label className="form-label">Notes (optional)</label>
          <textarea
            className="form-input"
            placeholder="Add a note..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleSubmit}
          style={{ marginTop: 8, height: 52, fontSize: 16 }}
        >
          {editTx ? 'Save Changes' : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
        </button>
      </div>
    </div>
  );
}
