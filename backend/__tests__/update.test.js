const request = require('supertest');
const { ObjectId } = require('mongodb');

describe('PATCH /api/lists/:listId/archive - Update list (archive/unarchive)', () => {
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

  test('Happy Path: Archive a list as owner using x-user-id header', async () => {
    const testList = {
      name: 'To Archive',
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
      .patch(`/api/lists/${listId}/archive`)
      .set('x-user-id', 'owner-user')
      .send({ archived: true });

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(true);

    // Verify in database
    const updatedList = await listsCol.findOne({ _id: new ObjectId(listId) });
    expect(updatedList.archived).toBe(true);
  });

  test('Happy Path: Unarchive a list as owner', async () => {
    const testList = {
      name: 'To Unarchive',
      ownerId: 'owner-user',
      archived: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [],
      items: []
    };
    const result = await listsCol.insertOne(testList);
    const listId = result.insertedId.toString();

    const response = await request(app)
      .patch(`/api/lists/${listId}/archive`)
      .set('x-user-id', 'owner-user')
      .send({ archived: false });

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(false);

    // Verify in database
    const updatedList = await listsCol.findOne({ _id: new ObjectId(listId) });
    expect(updatedList.archived).toBe(false);
  });

  test('Alternative: Update as non-owner (403 Forbidden)', async () => {
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
      .patch(`/api/lists/${listId}/archive`)
      .set('x-user-id', 'different-user')
      .send({ archived: true });

    expect(response.status).toBe(403);
    expect(response.body.error).toContain('owner');

    // Verify list was NOT updated
    const existingList = await listsCol.findOne({ _id: new ObjectId(listId) });
    expect(existingList.archived).toBe(false);
  });

  test('Alternative: Update without ownerId (400 error)', async () => {
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
      .patch(`/api/lists/${listId}/archive`)
      .send({ archived: true });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('required');
  });

  test('Alternative: Update non-existent list (404)', async () => {
    const fakeId = new ObjectId().toString();

    const response = await request(app)
      .patch(`/api/lists/${fakeId}/archive`)
      .set('x-user-id', 'some-user')
      .send({ archived: true });

    expect(response.status).toBe(404);
    expect(response.body.error).toContain('not found');
  });

  test('Happy Path: Update includes updatedAt timestamp', async () => {
    const testList = {
      name: 'Timestamp List',
      ownerId: 'owner-user',
      archived: false,
      createdAt: new Date(Date.now() - 10000),
      updatedAt: new Date(Date.now() - 10000),
      members: [],
      items: []
    };
    const result = await listsCol.insertOne(testList);
    const listId = result.insertedId.toString();

    const beforeUpdate = new Date();
    const response = await request(app)
      .patch(`/api/lists/${listId}/archive`)
      .set('x-user-id', 'owner-user')
      .send({ archived: true });
    const afterUpdate = new Date();

    expect(response.status).toBe(200);

    const updatedList = await listsCol.findOne({ _id: new ObjectId(listId) });
    const updatedAtTime = new Date(updatedList.updatedAt).getTime();
    expect(updatedAtTime).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    expect(updatedAtTime).toBeLessThanOrEqual(afterUpdate.getTime());
  });

  test('Happy Path: Update using ownerId in body', async () => {
    const testList = {
      name: 'Body Update List',
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
      .patch(`/api/lists/${listId}/archive`)
      .send({ archived: true, ownerId: 'body-owner' });

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(true);
  });
});
