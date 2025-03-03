const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:3000"], // Allow your client's origin
  },
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket) => {
  socket.emit("check", "Hello world - Everything ok");
  console.log("server running");
  socket.on("message", (obj) => {
    socket.broadcast.emit("sendthis", obj);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
