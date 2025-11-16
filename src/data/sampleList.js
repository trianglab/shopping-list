//Sample list for me - I want my app to have only ID, TITLE, QUANTITY and Completion Mark

const SAMPLE_LIST = {
  id: "list-1",
  name: "Groceries",
  ownerId: "user-1",
  archived: false,
  members: [
    { userId: "user-1", name: "You", role: "owner" },
    { userId: "user-2", name: "Alice", role: "member" },
    { userId: "user-3", name: "Egor", role: "member" }
  ],
  items: [
    { id: "i1", title: "Milk", quantity: "2", isCompleted: false },
    { id: "i2", title: "Eggs", quantity: "12", isCompleted: true },
    { id: "i3", title: "Bread", quantity: "1", isCompleted: false }
  ]
};

export default SAMPLE_LIST;