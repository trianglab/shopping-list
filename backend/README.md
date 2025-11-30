# Shopping List Backend

Basic Express.js backend for the Shopping List app.

## Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

   Or for development with auto-reload:

   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Lists

- `GET /api/lists` - Get all lists
- `GET /api/lists/:listId` - Get a specific list
- `POST /api/lists` - Create a new list

### Items

- `POST /api/lists/:listId/items` - Add item to list
- `PUT /api/lists/:listId/items/:itemId` - Update item (mark as done)
- `DELETE /api/lists/:listId/items/:itemId` - Delete item

### Members

- `POST /api/lists/:listId/members` - Add member to list
- `DELETE /api/lists/:listId/members/:memberId` - Remove member from list

