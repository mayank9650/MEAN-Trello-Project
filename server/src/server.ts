import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
require("dotenv").config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const mongoURI = process.env.MONGO_URI || ""; // UPDATE:: Update your user name and password along with mongo url
const PORT = process.env.PORT || "4001";
app.get("/", (req, res) => {
  res.send("API is UP");
});

io.on("connection", () => {
  console.log("connect");
});

mongoose.connect(mongoURI).then(() => {
  console.log("connected to mongodb");
  httpServer.listen(PORT, () => {
    console.log(`API is listening on port 4001`);
  });
});
