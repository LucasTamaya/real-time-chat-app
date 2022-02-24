import connectToDatabase from "./utils/mongodb.mjs";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.mjs"; // toutes les routes liées à la connexion
import userListRoute from "./routes/userListRoute.mjs";
import conversationRoomRoutes from "./routes/conversationRoomRoutes.mjs";
import previousMessagesRoute from "./routes/previousMessagesRoute.mjs";

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
  console.log("A new user is connected", socket.id);

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

app.use(authRoutes);

app.use(userListRoute);

app.use(conversationRoomRoutes);

app.use(previousMessagesRoute);

app.get("/", (req, res) => {
  return res.json({ message: "Server running" });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
