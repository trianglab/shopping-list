require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage (replace with database later)
let lists = [
  {
    _id: "1",
    name: "Groceries",
    ownerId: "user-1",
    members: [
      { userId: "user-1", name: "Alex", role: "owner" },
      { userId: "user-2", name: "Jane", role: "member" }
    ],
    items: [
      { id: 1, name: "Milk", quantity: 2, done: false },
      { id: 2, name: "Bread", quantity: 1, done: true },
      { id: 3, name: "Apples", quantity: 6, done: false }
    ]
  }
];

// GET all lists
app.get('/api/lists', (req, res) => {
  res.json(lists);
});

// GET single list by ID
app.get('/api/lists/:listId', (req, res) => {
  const list = lists.find(l => l._id === req.params.listId);
  if (!list) return res.status(404).json({ error: 'List not found' });
  res.json(list);
});

// POST create new list
app.post('/api/lists', (req, res) => {
  const { name, ownerId } = req.body;
  
  if (!name || !ownerId) {
    return res.status(400).json({ error: 'Name and ownerId are required' });
  }

  const newList = {
    _id: Date.now().toString(),
    name,
    ownerId,
    members: [{ userId: ownerId, name: "You", role: "owner" }],
    items: []
  };

  lists.push(newList);
  res.status(201).json(newList);
});

// POST add item to list
app.post('/api/lists/:listId/items', (req, res) => {
  const { name, quantity } = req.body;
  const list = lists.find(l => l._id === req.params.listId);

  if (!list) return res.status(404).json({ error: 'List not found' });
  if (!name) return res.status(400).json({ error: 'Item name is required' });

  const newItem = {
    id: Date.now(),
    name,
    quantity: quantity || 1,
    done: false
  };

  list.items.push(newItem);
  res.status(201).json(newItem);
});

// PUT toggle item done status
app.put('/api/lists/:listId/items/:itemId', (req, res) => {
  const { done } = req.body;
  const list = lists.find(l => l._id === req.params.listId);

  if (!list) return res.status(404).json({ error: 'List not found' });

  const item = list.items.find(i => i.id == req.params.itemId);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  item.done = done;
  res.json(item);
});

// DELETE item from list
app.delete('/api/lists/:listId/items/:itemId', (req, res) => {
  const list = lists.find(l => l._id === req.params.listId);

  if (!list) return res.status(404).json({ error: 'List not found' });

  list.items = list.items.filter(i => i.id != req.params.itemId);
  res.json({ message: 'Item deleted' });
});

// POST add member to list
app.post('/api/lists/:listId/members', (req, res) => {
  const { name } = req.body;
  const list = lists.find(l => l._id === req.params.listId);

  if (!list) return res.status(404).json({ error: 'List not found' });
  if (!name) return res.status(400).json({ error: 'Member name is required' });

  const newMember = {
    userId: Date.now().toString(),
    name,
    role: "member"
  };

  list.members.push(newMember);
  res.status(201).json(newMember);
});

// DELETE member from list
app.delete('/api/lists/:listId/members/:memberId', (req, res) => {
  const list = lists.find(l => l._id === req.params.listId);

  if (!list) return res.status(404).json({ error: 'List not found' });

  list.members = list.members.filter(m => m.userId !== req.params.memberId);
  res.json({ message: 'Member removed' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
