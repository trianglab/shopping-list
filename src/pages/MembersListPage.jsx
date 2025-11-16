import React, { useState } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import AddMemberModal from "../components/Modals/AddMemberModal";

export default function MembersListPage() {
  const { listId } = useParams();
  const [showModal, setShowModal] = useState(false);

  const [members, setMembers] = useState([
    { id: 1, name: "Alex" },
    { id: 2, name: "Maria" },
    { id: 3, name: "John" }
  ]);

  const handleAddMember = (memberName) => {
    setMembers([...members, { id: Date.now(), name: memberName }]);
    setShowModal(false);
  };

  const handleDeleteMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <Layout
      showBack={true}
      rightHeader="Members"
      footerContent={
        <button className="btn-green" style={{ width: "90%" }} onClick={() => setShowModal(true)}>
          Add Member
        </button>
      }
    >
      {members.map((m) => (
        <div key={m.id} className="list-row">
          <span>{m.name}</span>
          <button 
            className="btn-trash" 
            onClick={() => handleDeleteMember(m.id)}
            title="Delete member"
          >
            ❌
          </button>
        </div>
      ))}
      <AddMemberModal show={showModal} onClose={() => setShowModal(false)} onAdd={handleAddMember} />
    </Layout>
  );
}
