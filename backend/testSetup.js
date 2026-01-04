const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Set test environment
process.env.NODE_ENV = 'test';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.DB_NAME = 'shoppingdb-test';
});

afterAll(async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
});
