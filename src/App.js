import React from "react";
import { Routes, Route } from "react-router-dom";

import ShoppingListPage from "./pages/ShoppingListPage";
import ItemsListPage from "./pages/ItemsListPage";
import MembersListPage from "./pages/MembersListPage";

import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ShoppingListPage />} />
      <Route path="/lists/:listId" element={<ItemsListPage />} />
      <Route path="/lists/:listId/members" element={<MembersListPage />} />
      <Route path="*" element={<div style={{ padding: 20 }}>Not found</div>} />
    </Routes>
  );
}

