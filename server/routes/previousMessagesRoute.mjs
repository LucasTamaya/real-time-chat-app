import express from "express";
import connectToDatabase from "../utils/mongodb.mjs";

const router = express.Router();

router.get("/api/messages/:roomName", async (req, res) => {
  const { db } = await connectToDatabase();

  const { roomName } = req.params;

  db.collection("messages")
    .find({ conversationRoomName: roomName })
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
