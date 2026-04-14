import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../hooks/useToast';
import { BOOK_COLORS, BOOK_ICONS } from '../utils/constants';

export default function BookModal({ open, onClose, editBook = null }) {
  const { addBook, updateBook } = useApp();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [color, setColor] = useState(BOOK_COLORS[0]);
  const [icon, setIcon] = useState(BOOK_ICONS[0]);

  useEffect(() => {
    if (editBook) {
      setName(editBook.name);
      setColor(editBook.color);
      setIcon(editBook.icon);
    } else {
      setName('');
      setColor(BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)]);
      setIcon(BOOK_ICONS[Math.floor(Math.random() * BOOK_ICONS.length)]);
    }
  }, [editBook, open]);

  if (!open) return null;

  function handleSubmit() {
    if (!name.trim()) { toast('Please enter a book name', 'error'); return; }
    if (editBook) {
      updateBook({ id: editBook.id, name: name.trim(), color, icon });
      toast('Book updated', 'success');
    } else {
      addBook({ name: name.trim(), color, icon });
      toast('Book created', 'success');
    }
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet" style={{ maxHeight: '70dvh' }}>
        <div className="modal-handle" />
        <div className="modal-header">
          <span className="modal-title">{editBook ? 'Edit Book' : 'New Book'}</span>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Preview */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
          background: color + '18', borderRadius: 'var(--radius-md)',
          border: `2px solid ${color}40`, marginBottom: 20,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-sm)',
            background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flexShrink: 0,
          }}>{icon}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
              {name || 'Book Name'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Your new book</div>
          </div>
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Book Name</label>
          <input
            className="form-input"
            placeholder="e.g. Personal, Business..."
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={24}
            autoFocus
          />
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Icon</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BOOK_ICONS.map(ic => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-sm)',
                  fontSize: 22, background: icon === ic ? color + '25' : 'var(--bg-tertiary)',
                  border: `2px solid ${icon === ic ? color : 'transparent'}`,
                  transition: 'all 150ms ease', cursor: 'pointer',
                }}
              >{ic}</button>
            ))}
          </div>
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Color</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {BOOK_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 36, height: 36, borderRadius: '50%', background: c, border: 'none',
                  outline: color === c ? `3px solid ${c}` : '2px solid transparent',
                  outlineOffset: 2, cursor: 'pointer',
                  transform: color === c ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 150ms ease',
                }}
              />
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={handleSubmit} style={{ height: 52, fontSize: 16 }}>
          {editBook ? 'Save Changes' : 'Create Book'}
        </button>
      </div>
    </div>
  );
}
