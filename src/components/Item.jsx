import React from "react";

export default function Item({ item, onToggle, onEdit, onDelete }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-start">
      <div>
        <div className="d-flex align-items-center">
          <input
            className="form-check-input me-2"
            type="checkbox"
            checked={!!item.isCompleted}
            onChange={() => onToggle && onToggle(item.id)}
            aria-label={`Mark ${item.title} as completed`}
          />
          <strong style={{ textDecoration: item.isCompleted ? "line-through" : "none" }}>
            {item.title}
          </strong>
        </div>

        {item.quantity ? (
          <div><small className="text-muted">Qty: {item.quantity}</small></div>
        ) : null}
      </div>

      <div className="btn-group">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onEdit && onEdit(item)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={() => onDelete && onDelete(item.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

