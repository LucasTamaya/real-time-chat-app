// fonction qui va gérer la connexion à mongoDB de façon optimisé

import { MongoClient } from "mongodb";

let uri = "mongodb+srv://lucas_tamaya:Lucas2003@linkedincloneapp.4qysj.mongodb.net/ChatApp?retryWrites=true&w=majority"//process.env.MONGODB_URI;
let dbName = "ChatApp" //process.env.MONGODB_DB;

let cachedClient = null;
let cachedDb = null;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!dbName) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

export default async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    console.log("cache existant, connexion réussi");
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = await client.db(dbName);

  cachedClient = client;
  cachedDb = db;
  console.log("aucun cache, connexion réussi");
  return { client, db };
}
