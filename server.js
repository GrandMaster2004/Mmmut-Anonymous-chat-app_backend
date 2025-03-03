const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();

// Apply CORS middleware
app.use(
  cors({
    origin: "https://mmmut-anonymous-chat-app-frontend.vercel.app", // Only allow frontend domain
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

// Configure Socket.io with CORS support
const io = new Server(server, {
  cors: {
    origin: "https://mmmut-anonymous-chat-app-frontend.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Root route
app.get("/", async (req, res) => {
  try {
    res.send("Server is running");
  } catch (error) {
    console.error("Error in root route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Socket.io connection handler with async/await
io.on("connection", async (socket) => {
  try {
    console.log("New client connected:", socket.id);

    // Send a welcome message
    await socket.emit("check", "Hello world - Everything ok");

    // Handle incoming messages
    socket.on("message", async (obj) => {
      console.log("Message received:", obj);
      await socket.broadcast.emit("sendthis", obj);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  } catch (error) {
    console.error("Socket.io error:", error);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
