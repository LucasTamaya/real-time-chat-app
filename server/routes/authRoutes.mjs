import express from "express";
import connectToDatabase from "../utils/mongodb.mjs";
import bcrypt from "bcrypt";

const router = express.Router();

// register route
router.post("/api/auth/register", async (req, res) => {
  const { email, name, password, avatar } = req.body;

  // connexion a la DB
  const { db } = await connectToDatabase();

  //   vérifie que l'email n'existe pas dans MongoDB
  const existingEmail = await db
    .collection("users")
    .find({ email: email })
    .toArray();

  //   vérifie que l'username n'existe pas dans MongoDB
  const existingName = await db
    .collection("users")
    .find({ name: name })
    .toArray();

  // si email existant
  if (existingEmail.length >= 1) {
    console.log("email existant");
    return res.send({ message: "Existing email error" });
  }

  // si username existant
  if (existingName.length >= 1) {
    console.log("username existant");
    return res.send({ message: "Existing username error" });
  }

  //   si email et username correcte
  if (existingEmail.length < 1 && existingName.length < 1) {
    console.log("nouvel utilisateur");

    // hash du password avec bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // enregistre le nouvel utilisateur dans MongoDB
    const newUser = await db.collection("users").insertOne({
      email: email,
      name: name,
      password: hashPassword,
      avatar: avatar,
    });

    res.status(200).send({ username: name });
  }
});

// login route
router.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // connexion a la DB
  const { db } = await connectToDatabase();

  //   vérifie que l'utilisateur n'existe pas dans MongoDB
  const existingUser = await db
    .collection("users")
    .find({ email: email })
    .toArray();

  // si utilisateur existant
  if (existingUser.length >= 1) {
    console.log("utilisateur existant");

    // on vérifie les mots de passe hashé
    const isMatch = await bcrypt.compare(password, existingUser[0].password);

    // si erreur avec le pwd
    if (!isMatch) {
      console.log("mot de passe incorrect");
      return res.send({ message: "Login error" });
    }

    // si aucune erreur avec le pwd
    if (isMatch) {
      // récupère le nom de l'utilisateur
      const name = existingUser[0].name;

      return res.status(200).send({ username: name });
    }
  }

  //   si utilisateur non existant
  if (existingUser.length < 1) {
    console.log("utilisateur non existant");
    return res.send({ message: "Login error" });
  }
});

export default router;
