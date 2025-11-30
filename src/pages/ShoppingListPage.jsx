import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import AddListModal from "../components/Modals/AddListModal";
import { getLists, createList, archiveList } from "../api";

export default function ShoppingListPage() {
  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("active"); // "active", "archived", "all"

  // temporary current user id 
  const currentUserId = "user-1";

  useEffect(() => {
    (async () => {
      try {
        let data;
        if (filter === "active") {
          data = await getLists({ archived: false });
        } else if (filter === "archived") {
          data = await getLists({ archived: true });
        } else {
          data = await getLists();
        }
        setLists(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [filter]);

  const getUserRole = (list) => {
    const member = list.members?.find((m) => m.userId === currentUserId);
    if (!member) return "Member";
    return member.role === "owner" ? "Owner" : "Member";
  };

  const handleAddList = async (listName) => {
    try {
      const created = await createList({ name: listName, ownerId: currentUserId });
      setLists([...lists, created]);
      setShowModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleArchiveList = async (listId, currentlyArchived) => {
    try {
      await archiveList(listId, currentUserId, !currentlyArchived);
      setLists(lists.filter(l => (l._id || l.id) !== listId));
    } catch (e) {
      console.error(e);
      alert('Failed to archive list. You must be the owner.');
    }
  };

  const isOwner = (list) => {
    return list.ownerId === currentUserId;
  };

  return (
    <>
      <Layout
        showBack={false}
        rightHeader="Shopping List"
        footerContent={<button className="btn-green" onClick={() => setShowModal(true)}>Add List</button>}
    >
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", justifyContent: "center" }}>
          <button
            onClick={() => setFilter("active")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              background: filter === "active" ? "#2ecc71" : "#fff",
              color: filter === "active" ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: filter === "active" ? "600" : "400",
              fontSize: "13px"
            }}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("archived")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              background: filter === "archived" ? "#2ecc71" : "#fff",
              color: filter === "archived" ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: filter === "archived" ? "600" : "400",
              fontSize: "13px"
            }}
          >
            Archived
          </button>
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
        </div>
        {lists.map((list) => (
          <div key={list._id} className="list-row-container">
            <Link to={`/lists/${list._id}`} className="list-link" style={{ flex: 1 }}>
              <div className="list-row" role="button" tabIndex={0}>
                <div style={{ fontWeight: 600 }}>{list.name}</div>
                <div className="role-badge">{getUserRole(list)}</div>
              </div>
            </Link>
            {isOwner(list) && (
              <button
                className="btn-trash"
                onClick={() => handleArchiveList(list._id, list.archived)}
                title={list.archived ? "Unarchive list" : "Archive list"}
              >
                {list.archived ? "📂" : "📦"}
              </button>
            )}
          </div>
        ))}
      </Layout>
      <AddListModal show={showModal} onClose={() => setShowModal(false)} onAdd={handleAddList} />
    </>
  );
}

