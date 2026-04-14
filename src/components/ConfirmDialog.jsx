export default function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" style={{ alignItems: 'center' }}>
      <div className="confirm-dialog">
        <div className="confirm-title">{title}</div>
        <div className="confirm-desc">{description}</div>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
