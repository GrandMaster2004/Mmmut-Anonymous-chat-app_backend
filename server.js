const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();

app.use(
  cors({
    origin: "https://mmmut-anonymous-chat-app-frontend.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://mmmut-anonymous-chat-app-frontend.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
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
