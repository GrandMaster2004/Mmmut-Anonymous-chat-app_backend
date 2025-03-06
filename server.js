const { Server } = require("socket.io");

const io = new Server(process.env.PORT || 3000, {
  cors: {
    origin: [
      "http://127.0.0.1:5500",
      "https://mmmut-anonymous-chat-app-frontend.vercel.app",
      
    ],
  },
});

let onlineUsers = 0;

io.on("connection", (socket) => {
  // console.log("connection");
  onlineUsers++;

  // Emit the updated user count to all clients
  io.emit("onlineUsers", onlineUsers);

  // socket.emit("check", "Hello world - Everything ok");
  socket.on("message", (obj) => {
    socket.broadcast.emit("sendthis", obj);
  });

  socket.on("disconnect", () => {
    onlineUsers--;
    io.emit("onlineUsers", onlineUsers);
  });
  // console.log(onlineUsers);
});
