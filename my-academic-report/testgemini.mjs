import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ correct model + new endpoint (works with 0.24.x)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent("Say 'Hello! My Gemini API key works fine!'");
    console.log("✅ Gemini API is working!");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("❌ Gemini API key test failed!");
    console.error(error);
  }
}

testGemini();
