require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.NODE_ENV === 'test' ? 0 : (process.env.PORT || 5000);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB setup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'shoppingdb';
let db;
let listsCol;

async function connectDb() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  listsCol = db.collection('lists');
  console.log('Connected to MongoDB', MONGODB_URI, DB_NAME);
}

// GET lists with optional archived filter
// Query param: archived=true|false (optional). If omitted, returns all lists.
app.get('/api/lists', async (req, res, next) => {
  try {
    const archivedParam = req.query.archived;
    const filter = {};
    if (archivedParam === 'true') filter.archived = true;
    else if (archivedParam === 'false') filter.archived = false;

    const lists = await listsCol.find(filter).sort({ updatedAt: -1 }).toArray();
    res.json(lists);
  } catch (err) { next(err); }
});

// GET single list by ID
app.get('/api/lists/:listId', async (req, res, next) => {
  try {
    const id = req.params.listId;
    const oId = ObjectId.isValid(id) ? new ObjectId(id) : id;
    const list = await listsCol.findOne({ _id: oId });
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json(list);
  } catch (err) { next(err); }
});

// POST create new list
app.post('/api/lists', async (req, res, next) => {
  try {
    const { name, ownerId } = req.body;
    if (!name || !ownerId) return res.status(400).json({ error: 'Name and ownerId are required' });

    const now = new Date();
    const newList = {
      name,
      ownerId,
      archived: false,
      createdAt: now,
      updatedAt: now,
      members: [{ userId: ownerId, name: 'You', role: 'owner', joinedAt: now }],
      items: []
    };

    const result = await listsCol.insertOne(newList);
    newList._id = result.insertedId;
    res.status(201).json(newList);
  } catch (err) { next(err); }
});

// PATCH archive/unarchive a list — only owner can modify
app.patch('/api/lists/:listId/archive', async (req, res, next) => {
  try {
    const id = req.params.listId;
    const oId = ObjectId.isValid(id) ? new ObjectId(id) : id;
    const ownerId = req.header('x-user-id') || req.body.ownerId;
    const { archived } = req.body;
    if (!ownerId) return res.status(400).json({ error: 'ownerId required (header x-user-id or body.ownerId)' });

    const list = await listsCol.findOne({ _id: oId });
    if (!list) return res.status(404).json({ error: 'List not found' });
    if (list.ownerId !== ownerId) return res.status(403).json({ error: 'Only owner can archive this list' });

    await listsCol.updateOne({ _id: oId }, { $set: { archived: !!archived, updatedAt: new Date() } });
    res.json({ message: 'List archived status updated', archived: !!archived });
  } catch (err) { next(err); }
});

// DELETE a list — only owner can delete
// Owner identity: prefer header 'x-user-id', fallback to body.ownerId
app.delete('/api/lists/:listId', async (req, res, next) => {
  try {
    const id = req.params.listId;
    const oId = ObjectId.isValid(id) ? new ObjectId(id) : id;
    const ownerId = req.header('x-user-id') || req.body.ownerId;
    if (!ownerId) return res.status(400).json({ error: 'ownerId required (header x-user-id or body.ownerId)' });

    const list = await listsCol.findOne({ _id: oId });
    if (!list) return res.status(404).json({ error: 'List not found' });
    if (list.ownerId !== ownerId) return res.status(403).json({ error: 'Only owner can delete this list' });

    await listsCol.deleteOne({ _id: oId });
    res.json({ message: 'List deleted' });
  } catch (err) { next(err); }
});

// Add item to list
app.post('/api/lists/:listId/items', async (req, res, next) => {
  try {
    const { name, quantity } = req.body;
    const id = req.params.listId;
    const oId = ObjectId.isValid(id) ? new ObjectId(id) : id;
    if (!name) return res.status(400).json({ error: 'Item name is required' });

    const newItem = { id: Date.now(), title: name, quantity: quantity || 1, isCompleted: false, createdAt: new Date() };
    const result = await listsCol.updateOne({ _id: oId }, { $push: { items: newItem }, $set: { updatedAt: new Date() } });
    if (result.matchedCount === 0) return res.status(404).json({ error: 'List not found' });
    res.status(201).json(newItem);
  } catch (err) { next(err); }
});

// Toggle item done status
app.put('/api/lists/:listId/items/:itemId', async (req, res, next) => {
  try {
    const { done } = req.body;
    const id = req.params.listId;
    const itemId = Number(req.params.itemId);
    const oId = ObjectId.isValid(id) ? new ObjectId(id) : id;

    const result = await listsCol.findOneAndUpdate(
      { _id: oId, 'items.id': itemId },
      { $set: { 'items.$.isCompleted': !!done, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result.value) return res.status(404).json({ error: 'List or item not found' });
    // find the item in returned doc
    const updatedItem = result.value.items.find(i => i.id === itemId);
    res.json(updatedItem);
  } catch (err) { next(err); }
});

// Delete item from list
app.delete('/api/lists/:listId/items/:itemId', async (req, res, next) => {
  try {
    const id = req.params.listId;
    const itemId = Number(req.params.itemId);
    const oId = ObjectId.isValid(id) ? new ObjectId(id) : id;

    const result = await listsCol.updateOne({ _id: oId }, { $pull: { items: { id: itemId } }, $set: { updatedAt: new Date() } });
    if (result.matchedCount === 0) return res.status(404).json({ error: 'List not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) { next(err); }
});

// Add member to list
app.post('/api/lists/:listId/members', async (req, res, next) => {
  try {
    const { name, userId } = req.body;
    const id = req.params.listId;
    const oId = ObjectId.isValid(id) ? new ObjectId(id) : id;
    if (!name) return res.status(400).json({ error: 'Member name is required' });

    const newMember = { userId: userId || Date.now().toString(), name, role: 'member', joinedAt: new Date() };
    const result = await listsCol.updateOne({ _id: oId }, { $push: { members: newMember }, $set: { updatedAt: new Date() } });
    if (result.matchedCount === 0) return res.status(404).json({ error: 'List not found' });
    res.status(201).json(newMember);
  } catch (err) { next(err); }
});

// Delete member
app.delete('/api/lists/:listId/members/:memberId', async (req, res, next) => {
  try {
    const id = req.params.listId;
    const memberId = req.params.memberId;
    const oId = ObjectId.isValid(id) ? new ObjectId(id) : id;

    const result = await listsCol.updateOne({ _id: oId }, { $pull: { members: { userId: memberId } }, $set: { updatedAt: new Date() } });
    if (result.matchedCount === 0) return res.status(404).json({ error: 'List not found' });
    res.json({ message: 'Member removed' });
  } catch (err) { next(err); }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for testing or start server
async function startServer() {
  await connectDb();
  return {
    app,
    server: app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    }),
    db,
    listsCol
  };
}

// Only start if not being required as a module (for testing)
if (require.main === module) {
  startServer().catch((err) => {
    console.error('Failed to start server due to DB connection error:', err);
    process.exit(1);
  });
}

module.exports = startServer;
