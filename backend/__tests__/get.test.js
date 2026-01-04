const request = require('supertest');
const { ObjectId } = require('mongodb');

describe('GET /api/lists/:listId - Get single shopping list', () => {
  let app;
  let server;
  let db;
  let listsCol;

  beforeAll(async () => {
    const setupApp = require('../server');
    const result = await setupApp();
    app = result.app;
    server = result.server;
    db = result.db;
    listsCol = result.listsCol;
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  beforeEach(async () => {
    await listsCol.deleteMany({});
  });

  test('Happy Path: Get a list by valid ID', async () => {
    const testList = {
      name: 'My Shopping List',
      ownerId: 'user1',
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [{ userId: 'user1', name: 'Owner', role: 'owner', joinedAt: new Date() }],
      items: []
    };
    const result = await listsCol.insertOne(testList);
    const listId = result.insertedId.toString();

    const response = await request(app).get(`/api/lists/${listId}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(listId);
    expect(response.body.name).toBe('My Shopping List');
    expect(response.body.ownerId).toBe('user1');
  });

  test('Alternative: Get a list by invalid ID (404)', async () => {
    const fakeId = new ObjectId().toString();

    const response = await request(app).get(`/api/lists/${fakeId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('List not found');
  });

  test('Alternative: Get list with malformed ID', async () => {
    const response = await request(app).get('/api/lists/invalid-id-format');

    // API should handle gracefully or return 404
    expect([404, 500]).toContain(response.status);
  });

  test('Happy Path: Get list with items and members', async () => {
    const testList = {
      name: 'List with Data',
      ownerId: 'user1',
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [
        { userId: 'user1', name: 'Owner', role: 'owner', joinedAt: new Date() },
        { userId: 'user2', name: 'Helper', role: 'member', joinedAt: new Date() }
      ],
      items: [
        { id: 1, title: 'Milk', quantity: 2, isCompleted: false, createdAt: new Date() }
      ]
    };
    const result = await listsCol.insertOne(testList);
    const listId = result.insertedId.toString();

    const response = await request(app).get(`/api/lists/${listId}`);

    expect(response.status).toBe(200);
    expect(response.body.members.length).toBe(2);
    expect(response.body.items.length).toBe(1);
  });
});
