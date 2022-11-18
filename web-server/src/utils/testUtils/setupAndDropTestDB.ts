import mongoose from "mongoose";

let connection;
let db: mongoose.Connection;

export default function setupAndDropTestDB(): void {
  beforeAll(async () => {
    db = await mongoose.connection;
    connection = await mongoose.connect(
      "mongodb://localhost:27017/SmartGroceryListTestTB"
    );
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => console.log("Connected to db"));
  });

  afterAll(async () => {
    await db.dropDatabase();
    await db.close();
  });
}
