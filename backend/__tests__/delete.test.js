const request = require('supertest');
const { ObjectId } = require('mongodb');

describe('DELETE /api/lists/:listId - Delete shopping list', () => {
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

  test('Happy Path: Delete a list as owner using x-user-id header', async () => {
    const testList = {
      name: 'To Delete',
      ownerId: 'owner-user',
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [],
      items: []
    };
    const result = await listsCol.insertOne(testList);
    const listId = result.insertedId.toString();

    const response = await request(app)
      .delete(`/api/lists/${listId}`)
      .set('x-user-id', 'owner-user');

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('deleted');

    // Verify list is actually deleted
    const deletedList = await listsCol.findOne({ _id: new ObjectId(listId) });
    expect(deletedList).toBeNull();
  });

  test('Alternative: Delete as non-owner (403 Forbidden)', async () => {
    const testList = {
      name: 'Protected List',
      ownerId: 'original-owner',
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [],
      items: []
    };
    const result = await listsCol.insertOne(testList);
    const listId = result.insertedId.toString();

    const response = await request(app)
      .delete(`/api/lists/${listId}`)
      .set('x-user-id', 'different-user');

    expect(response.status).toBe(403);
    expect(response.body.error).toContain('owner');

    // Verify list still exists
    const existingList = await listsCol.findOne({ _id: new ObjectId(listId) });
    expect(existingList).not.toBeNull();
  });

  test('Alternative: Delete without providing ownerId (400 error)', async () => {
    const testList = {
      name: 'List',
      ownerId: 'owner',
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [],
      items: []
    };
    const result = await listsCol.insertOne(testList);
    const listId = result.insertedId.toString();

    const response = await request(app)
      .delete(`/api/lists/${listId}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('required');
  });

  test('Alternative: Delete non-existent list (404)', async () => {
    const fakeId = new ObjectId().toString();

    const response = await request(app)
      .delete(`/api/lists/${fakeId}`)
      .set('x-user-id', 'some-user');

    expect(response.status).toBe(404);
    expect(response.body.error).toContain('not found');
  });

  test('Happy Path: Delete using ownerId in body', async () => {
    const testList = {
      name: 'Body Delete List',
      ownerId: 'body-owner',
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [],
      items: []
    };
    const result = await listsCol.insertOne(testList);
    const listId = result.insertedId.toString();

    const response = await request(app)
      .delete(`/api/lists/${listId}`)
      .send({ ownerId: 'body-owner' });

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('deleted');
  });
});
