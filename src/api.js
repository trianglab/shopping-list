const BASE = '/api';

export async function getLists({ archived } = {}) {
  const url = new URL(`${BASE}/lists`, window.location.origin);
  if (archived !== undefined) url.searchParams.set('archived', archived);
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('Failed to fetch lists');
  return res.json();
}

export async function createList({ name, ownerId }) {
  const res = await fetch(`${BASE}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ name, ownerId })
  });
  if (!res.ok) throw new Error('Failed to create list');
  return res.json();
}

export async function archiveList(id, ownerId, archived = true) {
  const res = await fetch(`${BASE}/lists/${id}/archive`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-user-id': ownerId },
    body: JSON.stringify({ ownerId, archived })
  });
  if (!res.ok) throw new Error('Failed to archive list');
  return res.json();
}

export async function deleteList(id, ownerId) {
  const res = await fetch(`${BASE}/lists/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-user-id': ownerId },
    body: JSON.stringify({ ownerId })
  });
  if (!res.ok) throw new Error('Failed to delete list');
  return res.json();
}

export async function getListById(id) {
  const res = await fetch(`${BASE}/lists/${id}`, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('Failed to fetch list');
  return res.json();
}

export async function addItem(listId, { name, quantity }) {
  const res = await fetch(`${BASE}/lists/${listId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ name, quantity })
  });
  if (!res.ok) throw new Error('Failed to add item');
  return res.json();
}

export async function toggleItem(listId, itemId, done) {
  const res = await fetch(`${BASE}/lists/${listId}/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ done })
  });
  if (!res.ok) throw new Error('Failed to update item');
  return res.json();
}

export async function deleteItem(listId, itemId) {
  const res = await fetch(`${BASE}/lists/${listId}/items/${itemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete item');
  return res.json();
}

export async function addMember(listId, { name, userId }) {
  const res = await fetch(`${BASE}/lists/${listId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ name, userId })
  });
  if (!res.ok) throw new Error('Failed to add member');
  return res.json();
}

export async function deleteMember(listId, memberId) {
  const res = await fetch(`${BASE}/lists/${listId}/members/${memberId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to remove member');
  return res.json();
}
