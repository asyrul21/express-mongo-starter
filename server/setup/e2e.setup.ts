import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import App from "../server";

let connection: any;
const server = App;
beforeAll(async () => {
  /**
   * Mock DB Server
   */
  const MockServer = await MongoMemoryServer.create();
  const conn = await mongoose.connect(MockServer.getUri(), {
    dbName: "e2e-db",
  });
  connection = conn.connection;
  //   console.log(`MOCK MongoDB Connected at host: ${connection.host}`);
  /**
   * Run Server
   */
  server.listen(5000, () => {
    // console.log(`Express is listening at http://localhost:5000`);
    // console.log(`Node Environment: ${process.env.NODE_ENV}`);
  });
});

afterAll(async () => {
  await connection.close();
  server.close();
  server.closeAllConnections();
});
