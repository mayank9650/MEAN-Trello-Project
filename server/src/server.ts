import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
require("dotenv").config();
import * as usersController from "./controllers/users";
import bodyParser from "body-parser";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const mongoURI = process.env.MONGO_URI || ""; // UPDATE:: Update your user name and password along with mongo url
const PORT = process.env.PORT || "4001";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is UP");
});

app.post("/api/users", usersController.register);

io.on("connection", () => {
  console.log("connect");
});

mongoose.connect(mongoURI).then(() => {
  console.log("connected to mongodb");
  httpServer.listen(PORT, () => {
    console.log(`API is listening on port 4001`);
  });
});
