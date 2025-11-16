import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import AddListModal from "../components/Modals/AddListModal";

export default function ShoppingListPage() {
  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // temporary current user id 
  const currentUserId = "user-1";

  useEffect(() => {
    // demo data 
    setLists([
      {
        _id: "1",
        name: "Groceries",
        ownerId: "user-1",
        members: [
          { userId: "user-1", name: "Alex", role: "owner" },
          { userId: "user-2", name: "Jane", role: "member" }
        ]
      },
      {
        _id: "2",
        name: "Hardware Store",
        ownerId: "user-2",
        members: [
          { userId: "user-2", name: "Jane", role: "owner" },
          { userId: "user-1", name: "Alex", role: "member" }
        ]
      },
      {
        _id: "3",
        name: "Party Supplies",
        ownerId: "user-1",
        members: [
          { userId: "user-1", name: "Alex", role: "owner" }
        ]
      }
    ]);
  }, []);

  const getUserRole = (list) => {
    const member = list.members?.find((m) => m.userId === currentUserId);
    if (!member) return "Member";
    return member.role === "owner" ? "Owner" : "Member";
  };

  const handleAddList = (listName) => {
    const newList = {
      _id: Date.now().toString(),
      name: listName,
      ownerId: currentUserId,
      members: [{ userId: currentUserId, name: "You", role: "owner" }]
    };
    setLists([...lists, newList]);
    setShowModal(false);
  };

  const handleDeleteList = (listId) => {
    setLists(lists.filter(l => l._id !== listId));
  };

  return (
    <>
      <Layout
        showBack={false}
        rightHeader="Shopping List"
        footerContent={<button className="btn-green" onClick={() => setShowModal(true)}>Add List</button>}
    >
        {lists.map((list) => (
          <div key={list._id} className="list-row-container">
            <Link to={`/lists/${list._id}`} className="list-link" style={{ flex: 1 }}>
              <div className="list-row" role="button" tabIndex={0}>
                <div style={{ fontWeight: 600 }}>{list.name}</div>
                <div className="role-badge">{getUserRole(list)}</div>
              </div>
            </Link>
            <button
              className="btn-trash"
              onClick={() => handleDeleteList(list._id)}
              title="Delete list"
            >
              ❌
            </button>
          </div>
        ))}
      </Layout>
      <AddListModal show={showModal} onClose={() => setShowModal(false)} onAdd={handleAddList} />
    </>
  );
}

