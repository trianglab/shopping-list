import React, { useState } from "react";
import Layout from "../components/Layout";
import { useParams, Link } from "react-router-dom";
import EditItemModal from "../components/Modals/EditItemModal";

export default function ItemsListPage() {
  const { listId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showRenameInput, setShowRenameInput] = useState(false);
  const currentUserId = "user-1";

  // Mock list data
  const listsData = {
    "1": {
      name: "Groceries",
      ownerId: "user-1",
      members: [
        { userId: "user-1", name: "Alex", role: "owner" },
        { userId: "user-2", name: "Jane", role: "member" }
      ]
    },
    "2": {
      name: "Hardware Store",
      ownerId: "user-2",
      members: [
        { userId: "user-2", name: "Jane", role: "owner" },
        { userId: "user-1", name: "Alex", role: "member" }
      ]
    },
    "3": {
      name: "Party Supplies",
      ownerId: "user-1",
      members: [
        { userId: "user-1", name: "Alex", role: "owner" }
      ]
    }
  };

  const listData = listsData[listId];
  const isOwner = listData?.ownerId === currentUserId;

  const [currentListName, setCurrentListName] = useState(listData?.name || "Items");
  const [filter, setFilter] = useState("all"); // "all", "unresolved", "resolved"

  const [items, setItems] = useState([
    { id: 1, name: "Milk", quantity: 2, done: false },
    { id: 2, name: "Bread", quantity: 1, done: true },
    { id: 3, name: "Apples", quantity: 6, done: false }
  ]);

  const filteredItems = items.filter((item) => {
    if (filter === "unresolved") return !item.done;
    if (filter === "resolved") return item.done;
    return true;
  });

  const handleDelete = (id) => {
    setItems((cur) => cur.filter((i) => i.id !== id));
  };

  const toggleDone = (id) => {
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const handleAddItem = (newItem) => {
    setItems([...items, { 
      id: Date.now(), 
      ...newItem, 
      done: false 
    }]);
    setShowModal(false);
  };

  const handleRenameList = () => {
    setShowRenameInput(false);
  };

  const headerContent = (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span>{currentListName}</span>
      {isOwner && (
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            padding: "0"
          }}
          onClick={() => setShowRenameInput(true)}
          title="Rename list"
        >
          ✏️
        </button>
      )}
    </div>
  );

  const headerRightButton = isOwner ? (
    <Link to={`/lists/${listId}/members`} style={{ textDecoration: "none" }}>
      <button
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "20px",
          cursor: "pointer",
          padding: "0",
          display: "flex",
          alignItems: "center"
        }}
        title="Manage members"
      >
        👥
      </button>
    </Link>
  ) : null;

  return (
    <Layout
      showBack={true}
      rightHeader={headerContent}
      headerRightContent={headerRightButton}
      footerContent={
        <button className="btn-green" style={{ width: "90%" }} onClick={() => setShowModal(true)}>
          Add Item
        </button>
      }
    >
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", justifyContent: "center" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            background: filter === "all" ? "#2ecc71" : "#fff",
            color: filter === "all" ? "#fff" : "#333",
            cursor: "pointer",
            fontWeight: filter === "all" ? "600" : "400",
            fontSize: "13px"
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unresolved")}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            background: filter === "unresolved" ? "#2ecc71" : "#fff",
            color: filter === "unresolved" ? "#fff" : "#333",
            cursor: "pointer",
            fontWeight: filter === "unresolved" ? "600" : "400",
            fontSize: "13px"
          }}
        >
          Unresolved
        </button>
        <button
          onClick={() => setFilter("resolved")}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            background: filter === "resolved" ? "#2ecc71" : "#fff",
            color: filter === "resolved" ? "#fff" : "#333",
            cursor: "pointer",
            fontWeight: filter === "resolved" ? "600" : "400",
            fontSize: "13px"
          }}
        >
          Resolved
        </button>
      </div>

      {filteredItems.map((item) => (
        <div key={item.id} className="item-row" role="group" aria-label={`Item ${item.name}`}>
          <div className="item-info">
            <span className="item-name">{item.name}</span>
            <span className="item-qty">{item.quantity} pcs</span>
          </div>

          <div className="item-checkbox">
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleDone(item.id)}
              aria-label={`Mark ${item.name} as done`}
            />
          </div>

          <button
            className="btn-trash"
            onClick={() => handleDelete(item.id)}
            aria-label={`Delete ${item.name}`}
            title="Delete item"
          >
            ❌
          </button>
        </div>
      ))}

      <EditItemModal show={showModal} onClose={() => setShowModal(false)} onAdd={handleAddItem} />
    </Layout>
  );
}
