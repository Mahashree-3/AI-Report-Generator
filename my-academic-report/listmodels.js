import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models?key=" + API_KEY
    );
    const data = await res.json();

    console.log("Available models:\n", data);
  } catch (err) {
    console.error("❌ Failed to list models:", err);
  }
}

listModels();
