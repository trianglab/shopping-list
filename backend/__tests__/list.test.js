const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');

describe('GET /api/lists - List all shopping lists', () => {
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

  test('Happy Path: Get all lists when lists exist', async () => {
    // Insert test data
    const testList = {
      name: 'Test List',
      ownerId: 'user1',
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [],
      items: []
    };
    await listsCol.insertOne(testList);

    const response = await request(app).get('/api/lists');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Test List');
  });

  test('Happy Path: Get all lists when no lists exist', async () => {
    const response = await request(app).get('/api/lists');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  test('Alternative: Get only archived lists with query filter', async () => {
    // Insert both archived and non-archived lists
    await listsCol.insertMany([
      {
        name: 'Archived List',
        ownerId: 'user1',
        archived: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [],
        items: []
      },
      {
        name: 'Active List',
        ownerId: 'user1',
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [],
        items: []
      }
    ]);

    const response = await request(app).get('/api/lists?archived=true');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Archived List');
    expect(response.body[0].archived).toBe(true);
  });

  test('Alternative: Get only non-archived lists with query filter', async () => {
    // Insert both archived and non-archived lists
    await listsCol.insertMany([
      {
        name: 'Archived List',
        ownerId: 'user1',
        archived: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [],
        items: []
      },
      {
        name: 'Active List',
        ownerId: 'user1',
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [],
        items: []
      }
    ]);

    const response = await request(app).get('/api/lists?archived=false');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Active List');
    expect(response.body[0].archived).toBe(false);
  });
});
