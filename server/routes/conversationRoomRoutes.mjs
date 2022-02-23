import express from "express";
import connectToDatabase from "../utils/mongodb.mjs";

const router = express.Router();

// ajout d'une nouvelle conversation
router.post("/api/conversation", async (req, res) => {
  const { room } = req.body;

  //   connection a la BD
  const { db } = await connectToDatabase();

  //   vérifie si le nom de la conversation n'existe pas deja
  const existingConversation = await db
    .collection("conversations")
    .find({ roomName: room })
    .toArray();

  // si elle existe deja
  if (existingConversation.length >= 1) {
    console.log("conversation existante");
    return res.send({ message: "Existing conversation error" });
  }

  // si elle n'existe pas, on l'a crée
  if (existingConversation.length < 1) {
    const newConversation = await db.collection("conversations").insertOne({
      roomName: room,
      members: "test",
    });
    console.log("nouvelle conversation crée");
    // on retourne le nom de la conversation afin de crée la route dynamique vers celle-ci
    return res.json(room);
  }
});

// recuperation de toutes les conversations
router.get("/api/conversation", async (req, res) => {
  const { db } = await connectToDatabase();

  const conversationList = await db
    .collection("conversations")
    .find({})
    .toArray((err, data) => {
      if (err) {
        console.log(err);
        return res.send({ message: "Fetch error" });
      }

      if (!err) {
        console.log("data envoyé");
        return res.json(data);
      }
    });
});
export default router;
