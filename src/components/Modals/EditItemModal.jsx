import React, { useState } from "react";

export default function EditItemModal({ show, onClose, onAdd }) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("1");

  const handleSubmit = () => {
    if (itemName.trim()) {
      onAdd({
        name: itemName,
        quantity: parseInt(quantity) || 1
      });
      setItemName("");
      setQuantity("1");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">Add Item</h5>
          <button className="btn-close" onClick={onClose} />
        </div>
        <div className="modal-body">
          <input
            type="text"
            className="form-control"
            placeholder="Item name..."
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            autoFocus
          />
          <div style={{ marginTop: 12 }}>
            <label>Quantity:</label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!itemName.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
