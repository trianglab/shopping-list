import React, { useState } from "react";

export default function AddMemberModal({ show, onClose, onAdd }) {
  const [memberName, setMemberName] = useState("");

  const handleSubmit = () => {
    if (memberName.trim()) {
      onAdd(memberName);
      setMemberName("");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">Add Member</h5>
          <button className="btn-close" onClick={onClose} />
        </div>
        <div className="modal-body">
          <input
            type="text"
            className="form-control"
            placeholder="Member name..."
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!memberName.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
