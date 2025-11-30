require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'shoppingdb';

const sampleData = [
  {
    name: "Groceries",
    ownerId: "user-1",
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [
      { userId: "user-1", name: "Alex", role: "owner", joinedAt: new Date() },
      { userId: "user-2", name: "Jane", role: "member", joinedAt: new Date() }
    ],
    items: [
      { id: Date.now() + 1, title: "Milk", quantity: 2, isCompleted: false, createdAt: new Date() },
      { id: Date.now() + 2, title: "Bread", quantity: 1, isCompleted: true, createdAt: new Date() },
      { id: Date.now() + 3, title: "Eggs", quantity: 12, isCompleted: false, createdAt: new Date() },
      { id: Date.now() + 4, title: "Apples", quantity: 6, isCompleted: false, createdAt: new Date() }
    ]
  },
  {
    name: "Hardware Store",
    ownerId: "user-2",
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [
      { userId: "user-2", name: "Jane", role: "owner", joinedAt: new Date() },
      { userId: "user-1", name: "Alex", role: "member", joinedAt: new Date() }
    ],
    items: [
      { id: Date.now() + 10, title: "Screwdriver", quantity: 1, isCompleted: false, createdAt: new Date() },
      { id: Date.now() + 11, title: "Nails", quantity: 100, isCompleted: false, createdAt: new Date() },
      { id: Date.now() + 12, title: "Paint", quantity: 2, isCompleted: true, createdAt: new Date() }
    ]
  },
  {
    name: "Party Supplies",
    ownerId: "user-1",
    archived: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(),
    members: [
      { userId: "user-1", name: "Alex", role: "owner", joinedAt: new Date() }
    ],
    items: [
      { id: Date.now() + 20, title: "Balloons", quantity: 20, isCompleted: true, createdAt: new Date() },
      { id: Date.now() + 21, title: "Cake", quantity: 1, isCompleted: true, createdAt: new Date() },
      { id: Date.now() + 22, title: "Candles", quantity: 10, isCompleted: true, createdAt: new Date() }
    ]
  },
  {
    name: "Office Supplies",
    ownerId: "user-1",
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [
      { userId: "user-1", name: "Alex", role: "owner", joinedAt: new Date() },
      { userId: "user-3", name: "Bob", role: "member", joinedAt: new Date() }
    ],
    items: [
      { id: Date.now() + 30, title: "Pens", quantity: 12, isCompleted: false, createdAt: new Date() },
      { id: Date.now() + 31, title: "Paper", quantity: 500, isCompleted: false, createdAt: new Date() },
      { id: Date.now() + 32, title: "Stapler", quantity: 1, isCompleted: true, createdAt: new Date() }
    ]
  }
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const listsCol = db.collection('lists');
    
    // Clear existing data
    await listsCol.deleteMany({});
    console.log('Cleared existing lists');
    
    // Insert sample data
    const result = await listsCol.insertMany(sampleData);
    console.log(`Inserted ${result.insertedCount} sample lists`);
    
    // Create indexes
    await listsCol.createIndex({ ownerId: 1 });
    await listsCol.createIndex({ archived: 1 });
    await listsCol.createIndex({ updatedAt: -1 });
    await listsCol.createIndex({ "members.userId": 1 });
    console.log('Created indexes');
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample data:');
    console.log(`- ${sampleData.length} lists created`);
    console.log(`- User "user-1" (Alex) owns: Groceries, Party Supplies (archived), Office Supplies`);
    console.log(`- User "user-2" (Jane) owns: Hardware Store`);
    console.log('\nYou can now start the server and log in as "user-1" to see the lists.');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
