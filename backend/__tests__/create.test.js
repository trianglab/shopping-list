const request = require('supertest');

describe('POST /api/lists - Create new shopping list', () => {
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

  test('Happy Path: Create a new list with name and ownerId', async () => {
    const payload = {
      name: 'Grocery Shopping',
      ownerId: 'user123'
    };

    const response = await request(app)
      .post('/api/lists')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBe('Grocery Shopping');
    expect(response.body.ownerId).toBe('user123');
    expect(response.body.archived).toBe(false);
    expect(response.body.members).toBeDefined();
    expect(response.body.items).toEqual([]);
  });

  test('Alternative: Create list without name (400 error)', async () => {
    const payload = {
      ownerId: 'user123'
    };

    const response = await request(app)
      .post('/api/lists')
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('required');
  });

  test('Alternative: Create list without ownerId (400 error)', async () => {
    const payload = {
      name: 'Grocery Shopping'
    };

    const response = await request(app)
      .post('/api/lists')
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('required');
  });

  test('Happy Path: Created list has owner as first member', async () => {
    const payload = {
      name: 'New List',
      ownerId: 'user456'
    };

    const response = await request(app)
      .post('/api/lists')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.members.length).toBeGreaterThan(0);
    expect(response.body.members[0].userId).toBe('user456');
    expect(response.body.members[0].role).toBe('owner');
  });

  test('Happy Path: List has createdAt and updatedAt timestamps', async () => {
    const payload = {
      name: 'Timestamped List',
      ownerId: 'user789'
    };

    const response = await request(app)
      .post('/api/lists')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
  });

  test('Alternative: Create with empty name string (400 error)', async () => {
    const payload = {
      name: '',
      ownerId: 'user123'
    };

    const response = await request(app)
      .post('/api/lists')
      .send(payload);

    expect(response.status).toBe(400);
  });
});
