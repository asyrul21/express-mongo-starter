import express from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import http from "http";
import { setupDb } from "./setup/db";

// middlewares
import { notFound, errorHandler } from "./middlewares/error.middleware";

/**
 * Event Emitter: remove if not needed
 *
 * to emit: EM.emit("MyEvent");
 *
 * to listen: EM.on("MyEvent", () => {})
 */
// import * as events from "events";
// const EM = new events.EventEmitter();

// import routes
import AuthRoutes from "./routes/auth.routes";
import CategoryRoutes from "./routes/cateogory.routes";
import ItemRoutes from "./routes/item.routes";

// socket IO - remove if not needed
import * as SocketIO from "socket.io";
import SockerInfo from "./constants/Socket";

setupDb(process.env.NODE_ENV);

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

if (process.env.NODE_ENV !== "test") {
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

export default HttpServer;
