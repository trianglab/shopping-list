import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams, Link } from "react-router-dom";
import EditItemModal from "../components/Modals/EditItemModal";
import { getListById, addItem as apiAddItem, toggleItem as apiToggleItem, deleteItem as apiDeleteItem } from "../api";

export default function ItemsListPage() {
  const { listId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showRenameInput, setShowRenameInput] = useState(false);
  const currentUserId = "user-1";

  const [listData, setListData] = useState(null);
  const isOwner = listData?.ownerId === currentUserId;

  const [currentListName, setCurrentListName] = useState("Items");
  const [filter, setFilter] = useState("all"); // "all", "unresolved", "resolved"
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getListById(listId);
        setListData(data);
        setCurrentListName(data.name);
        // Map backend shape {title, quantity, isCompleted} to local {name, quantity, done}
        setItems((data.items || []).map(i => ({ id: i.id, name: i.title, quantity: i.quantity, done: !!i.isCompleted })));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [listId]);

  const filteredItems = items.filter((item) => {
    if (filter === "unresolved") return !item.done;
    if (filter === "resolved") return item.done;
    return true;
  });

  const handleDelete = async (id) => {
    try {
      await apiDeleteItem(listId, id);
      setItems((cur) => cur.filter((i) => i.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleDone = async (id) => {
    try {
      const target = items.find(i => i.id === id);
      const updated = await apiToggleItem(listId, id, !target?.done);
      setItems((cur) => cur.map((i) => (i.id === id ? { ...i, done: !!updated.isCompleted } : i)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      const created = await apiAddItem(listId, { name: newItem.name, quantity: newItem.quantity });
      setItems([...items, { id: created.id, name: created.title, quantity: created.quantity, done: !!created.isCompleted }]);
      setShowModal(false);
    } catch (e) {
      console.error(e);
    }
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
