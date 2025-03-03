const { Server } = require("socket.io");

const io = new Server(process.env.PORT || 3000, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});

io.on("connection", (socket) => {
  socket.emit("check", "Hello world - Everything ok");
  socket.on("message", (obj) => {
    socket.broadcast.emit("sendthis", obj);
  });
});
// dvd
