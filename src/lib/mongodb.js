import { MongoClient } from "mongodb";

const options = {};
let globalClientPromise;

function validateMongoUri(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  const trimmed = uri.trim();
  if (trimmed.includes("<") || trimmed.includes(">") || trimmed.includes("db_password")) {
    throw new Error("MONGODB_URI contains placeholder text. Set a real connection string.");
  }

  if (!trimmed.startsWith("mongodb://") && !trimmed.startsWith("mongodb+srv://")) {
    throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://");
  }

  return trimmed;
}

async function connectMongo(uri) {
  try {
    const client = new MongoClient(uri, options);
    return await client.connect();
  } catch (error) {
    console.error("[mongo] connection failed:", error);
    throw new Error("Database connection failed");
  }
}

export function getClientPromise() {
  const uri = validateMongoUri(process.env.MONGODB_URI);

  if (process.env.NODE_ENV === "development") {
    if (!globalClientPromise) {
      globalClientPromise = connectMongo(uri);
    }
    return globalClientPromise;
  }

  return connectMongo(uri);
}
