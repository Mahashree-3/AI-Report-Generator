// ✅ Use CommonJS import style for Node.js
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    // Use the official, working model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent("Say 'Hello! My Gemini API key works fine!'");
    console.log("✅ Gemini API is working!");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("❌ Gemini API key test failed!");
    console.error(error);
  }
}

testGemini();
