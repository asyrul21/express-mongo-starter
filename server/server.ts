import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import http from "http";
import mongoose from "mongoose";
dotenv.config();

// middlewares
import { notFound, errorHandler } from "./middlewares/error.middleware";

// event emitter
// import * as events from "events";
// const EM = new events.EventEmitter();

// import routes
import AuthRoutes from "./routes/auth.routes";
import CategoryRoutes from "./routes/cateogory.routes";
import ItemRoutes from "./routes/item.routes";

// socket IO
import * as SocketIO from "socket.io";
import SockerInfo from "./constants/Socket";

Main().catch((err) => {
  console.error("Failed to run Main Application wrapper:", err);
});

async function Main() {
  await mongoose.connect(process.env.MONGO_URL);

  const app = express();

  // morgan
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
  // body parser
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  /**
   *
   * Routes
   *
   */
  app.use("/api/auth", AuthRoutes);
  app.use("/api/categories", CategoryRoutes);
  app.use("/api/items", ItemRoutes);

  // error middlewares
  app.use(notFound);
  app.use(errorHandler);

  const HttpServer = http.createServer(app);

  /**
   * Socket.io for communication with client.
   * Disabled or remove if not used
   */
  const SocketService = new SocketIO.Server(HttpServer, {
    cors: {
      origin: process.env.CLIENT_DOMAIN_URL,
      methods: ["GET", "POST", "PUT"],
    },
  });
  // set app config to enable emitting socket events from controllers
  // to access is use req.app.get("SocketService").emit("message", {...body})
  app.set(SockerInfo.name, SocketService);

  const port = process.env.PORT || 5000;
  HttpServer.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port}`);
    console.log(`Node Environment: ${process.env.NODE_ENV}`);

    /**
     * Socket.io for communication with client.
     * Disabled or remove if not used
     */
    SocketService.on("connection", (socket) => {
      console.log("Client connected successfully.");
      socket.emit(SockerInfo.events.serverReady);
      socket.on("disconnect", () => {
        console.log("Client disconnected.");
      });
    });
  });
}

// Main();

export default Main;
