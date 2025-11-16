import React from "react";

export default function MemberList({ members = [], onDelete }) {
  if (!members || members.length === 0) {
    return <div className="text-muted">No members</div>;
  }

  return (
    <div>
      {members.map((member) => (
        <div key={member.id} className="list-row">
          <span>{member.name}</span>
          <button 
            className="btn-blue" 
            style={{ background: "#e74c3c" }}
            onClick={() => onDelete(member.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
