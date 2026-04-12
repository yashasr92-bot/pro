const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/labourDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});

global.io = io;

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});

app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

server.listen(5000, () => console.log("Server running"));