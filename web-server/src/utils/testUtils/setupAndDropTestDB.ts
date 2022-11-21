import mongoose from "mongoose";

interface IConfig {
  doDropDbBeforeEach?: Boolean;
}

let connection;
let db: mongoose.Connection;

export default function setupAndDropTestDB(config?: IConfig): void {
  beforeAll(async () => {
    db = await mongoose.connection;
    connection = await mongoose.connect(
      "mongodb://localhost:27017/SmartGroceryListTestTB"
    );
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => console.log("Connected to db"));
  });
  if (config?.doDropDbBeforeEach) {
    beforeEach(async () => {
      await db.dropDatabase();
    });
  }

  afterAll(async () => {
    await db.dropDatabase();
    await db.close();
  });
}
