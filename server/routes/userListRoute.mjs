import express from "express";
import connectToDatabase from "../utils/mongodb.mjs";

const router = express.Router();

router.get("/api/user-list", async (req, res) => {
  // connexion a la DB
  const { db } = await connectToDatabase();

  const userList = await db
    .collection("users")
    .find({})
    .toArray((err, data) => {
      if (err) {
        console.log(err);
        return res.send({ message: "Fetch error" });
      }

      if (!err) {
        console.log("data envoyé");
        return res.send(data);
      }
    });
});

export default router;
