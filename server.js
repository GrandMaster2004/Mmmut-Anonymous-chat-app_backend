const { Server } = require("socket.io");

const io = new Server(process.env.PORT || 3000, {
  cors: {
    origin: [
      "http://127.0.0.1:5500",
      "https://mmmut-anonymous-chat-app-frontend.vercel.app",
    ],
  },
});

io.on("connection", (socket) => {
  console.log("connection");

  socket.emit("check", "Hello world - Everything ok");
  socket.on("message", (obj) => {
    socket.broadcast.emit("sendthis", obj);
  });
});
