const { Server } = require("socket.io");
const io = new Server(process.env.PORT || 3000, {
  cors: {
    origin: "https://mmmut-anonymous-chat-app-frontend.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
  transports: ["websocket"], // Add this line to ensure WebSocket support
});

io.on("connection", (socket) => {
  console.log("connection");

  socket.emit("check", "Hello world - Everything ok");
  socket.on("message", (obj) => {
    socket.broadcast.emit("sendthis", obj);
  });
});
