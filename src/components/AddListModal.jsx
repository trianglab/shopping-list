import React, { useState } from "react";

export default function AddListModal({ show, onClose, onAdd }) {
  const [listName, setListName] = useState("");

  const handleSubmit = () => {
    if (listName.trim()) {
      onAdd(listName);
      setListName("");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">Create New List</h5>
          <button className="btn-close" onClick={onClose} />
        </div>
        <div className="modal-body">
          <input
            type="text"
            className="form-control"
            placeholder="Enter list name..."
            value={listName}
            onChange={(e) => setListName(e.target.value)}
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
            disabled={!listName.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
