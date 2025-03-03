const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();

// ✅ Proper CORS setup for Express & WebSockets
app.use(
  cors({
    origin: "https://mmmut-anonymous-chat-app-frontend.vercel.app", // Update with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // Allow cookies and authentication
  })
);

const server = http.createServer(app);

// ✅ WebSocket CORS configuration
const io = new Server(server, {
  cors: {
    origin: "https://mmmut-anonymous-chat-app-frontend.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling", "websocket"], // Use both polling and websocket
});

// ✅ Simple API test
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ WebSocket Connection
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.emit("check", "Hello world - Everything is okay");

  socket.on("message", (obj) => {
    console.log("Message received:", obj);
    socket.broadcast.emit("sendthis", obj);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
