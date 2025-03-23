import { Server } from "socket.io";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

// Initialize Socket.io Server
const io = new Server(3000, {
  cors: {
    origin: ["https://mmmut-anonymous-chat-app-frontend.vercel.app"], // Replace with frontend origin
  },
});

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCdOE4tDH5SUh-GhQXDtr-74hZm0VWk4ak",
  authDomain: "chatapp-ca958.firebaseapp.com",
  projectId: "chatapp-ca958",
  storageBucket: "chatapp-ca958.appspot.com",
  messagingSenderId: "566318675791",
  appId: "1:566318675791:web:c5d598dbd03ed2bd24b73a",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Variables to Track Users ---
let onlineUsers = 0;
const activeUsernames = new Map(); // socket.id -> username

// --- Socket.io Connection Handling ---
io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);

  // Receive Username
  socket.on("setUsername", (username, callback) => {
    // Check if username already exists
    if ([...activeUsernames.values()].includes(username)) {
      callback({
        success: false,
        message: "Username already taken. Try another.",
      });
    } else {
      activeUsernames.set(socket.id, username);
      onlineUsers++;
      callback({ success: true, message: "Username accepted" });
      // console.log(`Username accepted: ${username}`);

      // Broadcast updated online user count
      io.emit("onlineUsers", onlineUsers);
    }
  });

  // Handle incoming messages
  socket.on("message", async (data) => {
    // console.log(`Message from ${data.user}: ${data.msg}`);
    // Save message to Firestore with timestamp
    // await saveMessageToFirestore(data);

    // Broadcast to all connected clients
    io.emit("sendthis", data);
  });

  // Disconnect Handling
  socket.on("disconnect", async () => {
    // console.log(`User disconnected: ${socket.id}`);
    // const username = activeUsernames.get(socket.id);
    activeUsernames.delete(socket.id);
    if (onlineUsers > 0) onlineUsers--;

    // Broadcast updated online user count
    io.emit("onlineUsers", onlineUsers);
  });
});

// --- Firestore: Delete Old Messages ---
async function deleteOldMessages() {
  try {
    const messagesRef = collection(db, "messages");
    const oneDayAgo = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

    const q = query(messagesRef, where("timestamp", "<", oneDayAgo));
    const snapshot = await getDocs(q);

    snapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "messages", docSnap.id));
    });
  } catch (error) {
    console.error("Error deleting old messages:", error);
  }
}

setInterval(deleteOldMessages, 60 * 60 * 1000); // Every 1 hour
