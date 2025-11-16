import React from "react";
import Item from "./Item";

export default function ItemList({ items = [], onToggle, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return <div className="text-muted">No items</div>;
  }

  return (
    <ul className="list-group">
      {items.map((it) => (
        <Item key={it.id} item={it} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}