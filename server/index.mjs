import connectToDatabase from "./utils/mongodb.mjs";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.mjs"; // toutes les routes liées à la connexion
import userListRoute from "./routes/userListRoute.mjs";
import conversationRoomRoutes from "./routes/conversationRoomRoutes.mjs";
import previousMessagesRoute from "./routes/previousMessagesRoute.mjs";
import http from "http";
import { Server } from "socket.io";
// import login from "./api/auth/login.mjs";
// import register from "./api/auth/register.mjs";
// import conversation from "./api/conversation.mjs";
// import roomName from "./api/messages/[roomName].mjs";
// import userList from "./api/userList.mjs";

const app = express();
app.use(cors());
app.use(express.json());

// partie websockets avec socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// détecte les connexions
io.on("connection", (socket) => {
  console.log("A new user is connected", socket.id, );

  // détecte quand on rejoint une conversation room
  socket.on("joinRoom", (data) => {
    console.log(`user joined room ${data}`);
    socket.join(data);
  });

  // détecter les envois de messages
  socket.on("sendMessage", async (data) => {
    console.log("message sent");

    // envoit des messages au front, à la conversation room concerné
    socket.to(data.conversationRoomName).emit("receiveMessage", data);

    // envoit des messages à la BD
    const { db } = await connectToDatabase();
    db.collection("messages").insertOne({
      conversationRoomName: data.conversationRoomName,
      sender: data.sender,
      message: data.message,
      date: data.date,
    });
  });

  // détecte les déconnexions
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} just disconnected`);
  });
});

// app.use("/api/auth/login", login);
// app.use("/api/auth/register", register);
// app.use("/api/conversation", conversation);
// app.use("/api/messages/", roomName);
// app.use("/api/user-list", userList);

app.use(authRoutes)

app.use(userListRoute);

app.use(conversationRoomRoutes);

app.use(previousMessagesRoute);

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
