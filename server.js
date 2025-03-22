const { Server } = require("socket.io");

const io = new Server(process.env.PORT || 3000, {
  cors: {
    origin: [
      "https://mmmut-anonymous-chat-app-frontend.vercel.app",
      // "https://chattingappmmmut.netlify.app",
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
});

// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCdOE4tDH5SUh-GhQXDtr-74hZm0VWk4ak",
  authDomain: "chatapp-ca958.firebaseapp.com",
  databaseURL: "https://chatapp-ca958-default-rtdb.firebaseio.com",
  projectId: "chatapp-ca958",
  storageBucket: "chatapp-ca958.firebasestorage.app",
  messagingSenderId: "566318675791",
  appId: "1:566318675791:web:c5d598dbd03ed2bd24b73a",
  measurementId: "G-V1LH4CJM9B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteOldMessages() {
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);

  const q = query(
    collection(db, "users"),
    where("timestamp", "<", Timestamp.fromDate(oneHourAgo))
  );

  try {
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "users", docSnap.id));
    });
  } catch (error) {
    console.error("❌ Error deleting old messages:", error);
  }
}

// Delete Old Messages Every 60 Minutes
setInterval(deleteOldMessages, 60 * 60 * 1000);
