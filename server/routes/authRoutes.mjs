import express from "express";
import connectToDatabase from "../utils/mongodb.mjs";
import bcrypt from "bcrypt";

// a cacher pour plus tard
const secretToken =
  "05498965a266cf1fd6b15c60516bc213a12ca646ebeab1420d26418eed45cf719cc2d40aa1499bdb941891e69de083182030e8cd4e1846101ba76c49df6c0da4";

const router = express.Router();

// register route
router.post("/api/auth/register", async (req, res) => {
  const { email, name, password, avatar } = req.body;

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
    return res.send({ message: "Existing user error" });
  }

  //   si utilisateur non existant
  if (existingUser.length < 1) {
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
